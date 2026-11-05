"""Sirve las fichas en local y, al guardar, actualiza js/datos.js en Git."""

import json
import os
import subprocess
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATOS = ROOT / "js" / "datos.js"
PRECIOS = ROOT / "js" / "precios.js"
PUERTO = 8080
CANDADO = threading.Lock()
ENCABEZADO = (
    "// Recetas del sitio. Al guardar una ficha con el servidor local,\n"
    "// este archivo se actualiza, se confirma en Git y se sube a GitHub.\n"
)
ENCABEZADO_PRECIOS = (
    "// Lista compartida de costos. El mismo producto y la misma unidad\n"
    "// valen para todas las recetas. null significa que falta el precio.\n"
)


def canon(recetas):
    return json.dumps(recetas, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def leer_recetas():
    texto = DATOS.read_text(encoding="utf-8")
    marca = "window.RECETAS_INICIALES ="
    inicio = texto.index(marca) + len(marca)
    datos, _ = json.JSONDecoder().raw_decode(texto[inicio:].lstrip())
    if not isinstance(datos, list):
        raise ValueError("js/datos.js no contiene una lista de recetas.")
    return datos


def escribir(recetas):
    cuerpo = json.dumps(recetas, ensure_ascii=False, indent=2)
    DATOS.write_text(ENCABEZADO + "window.RECETAS_INICIALES = " + cuerpo + ";\n", encoding="utf-8", newline="\n")


def leer_precios():
    if not PRECIOS.exists():
        return []
    texto = PRECIOS.read_text(encoding="utf-8")
    marca = "window.PRECIOS ="
    if marca not in texto:
        return []
    inicio = texto.index(marca) + len(marca)
    datos, _ = json.JSONDecoder().raw_decode(texto[inicio:].lstrip())
    if not isinstance(datos, list):
        raise ValueError("js/precios.js no contiene una lista de precios.")
    return datos


def escribir_precios(precios):
    cuerpo = json.dumps(precios, ensure_ascii=False, indent=2)
    PRECIOS.write_text(ENCABEZADO_PRECIOS + "window.PRECIOS = " + cuerpo + ";\n", encoding="utf-8", newline="\n")


def git(*argumentos, timeout=60):
    entorno = os.environ.copy()
    entorno["GIT_TERMINAL_PROMPT"] = "0"
    return subprocess.run(
        ["git", *argumentos],
        cwd=ROOT,
        check=False,
        capture_output=True,
        text=True,
        timeout=timeout,
        env=entorno,
    )


def mensaje_limpio(texto):
    linea = " ".join(str(texto or "").split())
    permitidos = []
    for caracter in linea:
        if caracter.isalnum() or caracter in " áéíóúüñÁÉÍÓÚÜÑ.,:;¡!¿?-":
            permitidos.append(caracter)
    limpio = "".join(permitidos).strip()[:180]
    return limpio or "Actualizar fichas técnicas."


def validar(recetas):
    if not isinstance(recetas, list) or len(recetas) > 300:
        raise ValueError("La lista de recetas no es válida.")
    for receta in recetas:
        if not isinstance(receta, dict) or not str(receta.get("nombre") or "").strip():
            raise ValueError("Cada ficha necesita un nombre.")
        if not isinstance(receta.get("ingredientes"), list):
            raise ValueError("Cada ficha necesita sus ingredientes.")


def adelantada():
    estado = git("status", "-sb")
    if estado.returncode != 0:
        raise RuntimeError((estado.stderr or estado.stdout or "No se pudo leer el estado de Git.").strip())
    primera = estado.stdout.splitlines()[0] if estado.stdout else ""
    return "ahead" in primera


def subir():
    subido = git("push", "origin", "HEAD", timeout=120)
    if subido.returncode != 0:
        return {
            "ok": True,
            "subido": False,
            "detalle": (subido.stderr or subido.stdout or "El commit quedó en esta PC, pero no se pudo subir.").strip(),
        }
    return {"ok": True, "subido": True}


def validar_precios(precios):
    if not isinstance(precios, list) or len(precios) > 2000:
        raise ValueError("La lista de costos no es válida.")
    for producto in precios:
        if not isinstance(producto, dict) or not str(producto.get("nombre") or "").strip():
            raise ValueError("Cada producto necesita un nombre.")
        precio = producto.get("precioUnidad", None)
        if precio is None:
            continue
        if isinstance(precio, bool) or not isinstance(precio, (int, float)):
            raise ValueError("El precio debe ser un número o quedar vacío.")
        if precio != precio or precio in (float("inf"), float("-inf")) or precio < 0:
            raise ValueError("El precio no es un número válido.")


def publicar(recetas, mensaje, precios=None):
    validar(recetas)
    if precios is not None:
        validar_precios(precios)
    recetas_iguales = canon(leer_recetas()) == canon(recetas)
    precios_iguales = precios is None or canon(leer_precios()) == canon(precios)
    if recetas_iguales and precios_iguales:
        if not adelantada():
            return {"ok": True, "sinCambios": True, "subido": True}
        resultado = subir()
        resultado["sinCambios"] = resultado["subido"]
        return resultado
    archivos = []
    if not recetas_iguales:
        escribir(recetas)
        archivos.append("js/datos.js")
    if precios is not None and not precios_iguales:
        escribir_precios(precios)
        archivos.append("js/precios.js")
    agregado = git("add", "--", *archivos)
    if agregado.returncode != 0:
        raise RuntimeError((agregado.stderr or agregado.stdout or "No se pudo preparar el archivo.").strip())
    diferencias = git("diff", "--cached", "--quiet")
    if diferencias.returncode == 0:
        return {"ok": True, "sinCambios": True, "subido": True}
    confirmado = git("commit", "-m", mensaje_limpio(mensaje))
    if confirmado.returncode != 0:
        raise RuntimeError((confirmado.stderr or confirmado.stdout or "No se pudo crear el commit.").strip())
    resultado = subir()
    resultado["commit"] = True
    return resultado


class FichasHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        ruta = self.path.split("?", 1)[0]
        if ruta in ("/", "/index.html") or ruta.endswith((".js", ".css", ".html")):
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_GET(self):
        if self.path.split("?", 1)[0] == "/api/estado":
            self.responder(200, {"git": True})
            return
        super().do_GET()

    def do_POST(self):
        if self.client_address[0] not in ("127.0.0.1", "::1"):
            self.responder(403, {"ok": False, "detalle": "Solo se aceptan cambios desde esta PC."})
            return
        if self.path.split("?", 1)[0] != "/api/recetas":
            self.responder(404, {"ok": False, "detalle": "No encontré ese servicio."})
            return
        if not CANDADO.acquire(blocking=False):
            self.responder(409, {"ok": False, "detalle": "Hay otro guardado en curso."})
            return
        try:
            largo = int(self.headers.get("Content-Length", "0"))
            if largo <= 0 or largo > 2_000_000:
                self.responder(400, {"ok": False, "detalle": "El envío no es válido."})
                return
            cuerpo = json.loads(self.rfile.read(largo).decode("utf-8"))
            resultado = publicar(cuerpo.get("recetas"), cuerpo.get("mensaje"), cuerpo.get("precios"))
            self.responder(200, resultado)
        except (ValueError, json.JSONDecodeError) as error:
            self.responder(400, {"ok": False, "detalle": str(error)})
        except (OSError, subprocess.TimeoutExpired, RuntimeError) as error:
            self.responder(500, {"ok": False, "detalle": str(error)})
        finally:
            CANDADO.release()

    def responder(self, codigo, dato):
        cuerpo = json.dumps(dato, ensure_ascii=False).encode("utf-8")
        self.send_response(codigo)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(cuerpo)))
        self.end_headers()
        self.wfile.write(cuerpo)


if __name__ == "__main__":
    servidor = ThreadingHTTPServer(("127.0.0.1", PUERTO), FichasHandler)
    print("Fichas técnicas en http://127.0.0.1:%s/" % PUERTO, flush=True)
    servidor.serve_forever()
