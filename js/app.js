(function () {
  const ETAPAS = window.Costos.ETAPAS;
  const CLAVE = "fichas-tecnicas.recetas.v1";
  const pesos = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
  const decimal = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 3 });

  const state = {
    recetas: [],
    personalizadas: false,
    vista: "catalogo",
    recetaId: null,
    etapa: "todas",
    busqueda: "",
    categoria: "Todas",
    borrador: null,
    sucio: false,
    toast: "",
    scrollA: null,
    conGit: false,
    guardando: false
  };

  const app = document.getElementById("app");

  function clonar(valor) {
    return JSON.parse(JSON.stringify(valor));
  }

  function slug(texto) {
    const base = String(texto || "receta")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return base || "receta";
  }

  function idUnico(nombre, actual) {
    let id = slug(nombre);
    const usados = new Set(state.recetas.map((receta) => receta.id).filter((idReceta) => idReceta !== actual));
    if (!usados.has(id)) return id;
    let n = 2;
    while (usados.has(id + "-" + n)) n += 1;
    return id + "-" + n;
  }

  function normalizar(receta) {
    const etapas = ETAPAS.map((id) => {
      const encontrada = (receta.etapas || []).find((etapa) => etapa.id === id) || {};
      return {
        id,
        nombre: encontrada.nombre || "",
        minutos: encontrada.minutos ?? null,
        pasos: Array.isArray(encontrada.pasos) ? encontrada.pasos.filter(Boolean) : []
      };
    });
    return {
      id: receta.id || slug(receta.nombre || "receta"),
      nombre: receta.nombre || "Sin nombre",
      descripcion: receta.descripcion || "",
      categoria: receta.categoria || "Sin categoría",
      codigo: receta.codigo || "",
      tiempoPreparacion: receta.tiempoPreparacion ?? null,
      tiempoUnidad: receta.tiempoUnidad || "h",
      rendimientoPax: receta.rendimientoPax ?? null,
      aporteCalorico: receta.aporteCalorico || "",
      porcentajeGanancia: receta.porcentajeGanancia ?? null,
      precioVentaUnitario: receta.precioVentaUnitario ?? null,
      makeup: receta.makeup ?? 0.02,
      iva: receta.iva ?? 0.19,
      tecnicas: receta.tecnicas || "",
      puntosCriticos: receta.puntosCriticos || "",
      etapas,
      ingredientes: (receta.ingredientes || []).map((ingrediente) => ({
        nombre: ingrediente.nombre || "",
        unidad: ingrediente.unidad || "",
        precioUnidad: ingrediente.precioUnidad ?? null,
        cantidades: Object.fromEntries(ETAPAS.map((id) => [id, ingrediente.cantidades ? ingrediente.cantidades[id] ?? null : null]))
      }))
    };
  }

  function cargar() {
    const guardadas = localStorage.getItem(CLAVE);
    if (guardadas) {
      try {
        const lista = JSON.parse(guardadas);
        if (Array.isArray(lista)) {
          state.recetas = lista.map(normalizar);
          state.personalizadas = true;
          return;
        }
      } catch (error) {
        console.warn("No se pudieron leer las recetas guardadas", error);
      }
    }
    state.recetas = clonar(window.RECETAS_INICIALES || []).map(normalizar);
    state.personalizadas = false;
  }

  function guardarLocal() {
    localStorage.setItem(CLAVE, JSON.stringify(state.recetas));
    state.personalizadas = true;
  }

  async function detectarGit() {
    try {
      const respuesta = await fetch("/api/estado", { cache: "no-store" });
      if (!respuesta.ok) return;
      const dato = await respuesta.json();
      if (!dato.git) return;
      state.conGit = true;
      if (!state.sucio) pintar();
    } catch (error) {
      state.conGit = false;
    }
  }

  async function publicarEnGit(mensaje) {
    const respuesta = await fetch("/api/recetas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recetas: state.recetas, mensaje: mensaje })
    });
    const dato = await respuesta.json().catch(() => ({}));
    if (!respuesta.ok || !dato.ok) {
      throw new Error(dato.detalle || "No se pudo subir al repositorio.");
    }
    if (dato.subido) {
      localStorage.removeItem(CLAVE);
      state.personalizadas = false;
    }
    return dato;
  }

  async function guardarEnGit(mensaje, avisoLocal) {
    if (!state.conGit) {
      mostrarToast(avisoLocal);
      return;
    }
    try {
      const resultado = await publicarEnGit(mensaje);
      if (resultado.sinCambios) mostrarToast("Esa ficha ya estaba en el repositorio.");
      else if (resultado.subido) mostrarToast("Listo. El cambio quedó en GitHub.");
      else mostrarToast(resultado.detalle || "Quedó guardado en Git en esta PC, pero no se pudo subir.");
    } catch (error) {
      mostrarToast(error.message || "No se pudo subir al repositorio. El cambio sigue en este navegador.");
    }
  }

  function recetaActual() {
    return state.recetas.find((receta) => receta.id === state.recetaId) || null;
  }

  function el(tag, attrs, children) {
    const nodo = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([clave, valor]) => {
      if (valor == null || valor === false) return;
      if (clave === "class") nodo.className = valor;
      else if (clave === "text") {
        nodo.textContent = valor == null ? "" : String(valor);
        if (tag === "textarea") nodo.value = nodo.textContent;
      }
      else if (clave.startsWith("on") && typeof valor === "function") nodo.addEventListener(clave.slice(2).toLowerCase(), valor);
      else nodo.setAttribute(clave, valor);
    });
    (children || []).flat().forEach((hijo) => {
      if (hijo == null || hijo === false) return;
      nodo.append(hijo instanceof Node ? hijo : document.createTextNode(String(hijo)));
    });
    return nodo;
  }

  function dinero(valor) {
    if (valor == null || Number.isNaN(valor)) return "—";
    return pesos.format(Math.round(valor));
  }

  function cantidad(valor) {
    if (valor == null || valor === "" || Number(valor) === 0) return "";
    return decimal.format(Number(valor));
  }

  function porcentaje(valor) {
    if (valor == null) return "—";
    return decimal.format(valor * 100) + "%";
  }

  function tiempoTexto(receta) {
    if (receta.tiempoPreparacion == null || receta.tiempoPreparacion === "") return "Sin tiempo";
    return decimal.format(Number(receta.tiempoPreparacion)) + " " + (receta.tiempoUnidad || "h");
  }

  function nombreEtapa(etapa) {
    return etapa.nombre ? etapa.nombre : "Etapa " + etapa.id;
  }

  function resumenEtapa(receta, etapa) {
    if (etapa.minutos) return etapa.minutos + " min";
    if (etapa.pasos.length) return etapa.pasos.length + (etapa.pasos.length === 1 ? " paso" : " pasos");
    const tieneCantidad = receta.ingredientes.some((ingrediente) => Number(ingrediente.cantidades[etapa.id]) > 0);
    return tieneCantidad ? "sin pasos" : "vacía";
  }

  function etapasUsadas(receta) {
    return ETAPAS.filter((id) => receta.ingredientes.some((ingrediente) => Number(ingrediente.cantidades[id]) > 0) || receta.etapas.find((etapa) => etapa.id === id && (etapa.pasos.length || etapa.nombre || etapa.minutos)));
  }

  function mostrarToast(mensaje) {
    state.toast = mensaje;
    const aviso = el("div", { class: "toast", text: mensaje });
    document.body.append(aviso);
    setTimeout(() => aviso.remove(), 2800);
  }

  function aplicarRuta() {
    const partes = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (partes[0] === "nueva") {
      state.vista = "editor";
      state.recetaId = null;
      state.borrador = normalizar({
        id: "",
        nombre: "",
        categoria: "Postres",
        rendimientoPax: 1,
        makeup: 0.02,
        iva: 0.19,
        ingredientes: [{ nombre: "", unidad: "kilo", precioUnidad: null, cantidades: {} }]
      });
      return;
    }
    if (partes[0] === "r" && partes[1]) {
      state.recetaId = decodeURIComponent(partes[1]);
      if (!recetaActual()) {
        state.vista = "catalogo";
        state.recetaId = null;
        return;
      }
      if (partes[2] === "editar") {
        state.vista = "editor";
        state.borrador = clonar(recetaActual());
      } else {
        state.vista = "ficha";
        state.borrador = null;
      }
      return;
    }
    state.vista = "catalogo";
    state.recetaId = null;
    state.borrador = null;
  }

  let revirtiendo = false;
  let rutaAplicada = location.hash;

  function ir(hash) {
    if (state.sucio && !confirm("Hay cambios sin guardar. ¿Salir de la ficha?")) return;
    state.sucio = false;
    if (location.hash !== hash) location.hash = hash;
    else {
      aplicarRuta();
      rutaAplicada = location.hash;
      pintar();
    }
  }

  window.addEventListener("hashchange", () => {
    if (revirtiendo) {
      revirtiendo = false;
      return;
    }
    if (state.sucio && !confirm("Hay cambios sin guardar. ¿Salir de la ficha?")) {
      revirtiendo = true;
      location.hash = rutaAplicada || "#/";
      return;
    }
    state.sucio = false;
    aplicarRuta();
    rutaAplicada = location.hash;
    pintar();
  });

  function numeroInput(valor) {
    if (valor === "" || valor == null) return null;
    const n = Number(valor);
    return Number.isFinite(n) ? n : null;
  }

  function leerFormulario() {
    const form = document.getElementById("form-ficha");
    if (!form) return state.borrador;
    const dato = (nombre) => form.elements[nombre] ? form.elements[nombre].value : "";
    const borrador = clonar(state.borrador);
    borrador.nombre = dato("nombre").trim();
    borrador.categoria = dato("categoria").trim() || "Sin categoría";
    borrador.codigo = dato("codigo").trim();
    borrador.descripcion = dato("descripcion").trim();
    borrador.tiempoPreparacion = numeroInput(dato("tiempoPreparacion"));
    borrador.tiempoUnidad = dato("tiempoUnidad") || "h";
    borrador.rendimientoPax = numeroInput(dato("rendimientoPax"));
    borrador.aporteCalorico = dato("aporteCalorico").trim();
    borrador.porcentajeGanancia = numeroInput(dato("porcentajeGanancia"));
    if (borrador.porcentajeGanancia != null) borrador.porcentajeGanancia /= 100;
    borrador.precioVentaUnitario = numeroInput(dato("precioVentaUnitario"));
    borrador.makeup = numeroInput(dato("makeup"));
    if (borrador.makeup != null) borrador.makeup /= 100;
    borrador.iva = numeroInput(dato("iva"));
    if (borrador.iva != null) borrador.iva /= 100;
    borrador.tecnicas = dato("tecnicas").trim();
    borrador.puntosCriticos = dato("puntosCriticos").trim();
    borrador.etapas = ETAPAS.map((id) => ({
      id,
      nombre: dato("etapa-nombre-" + id).trim(),
      minutos: numeroInput(dato("etapa-minutos-" + id)),
      pasos: dato("etapa-pasos-" + id).split(/\r?\n/).map((paso) => paso.trim()).filter(Boolean)
    }));
    const filas = [...form.querySelectorAll("[data-ingrediente]")];
    borrador.ingredientes = filas.map((fila) => ({
      nombre: fila.querySelector("[data-campo='nombre']").value.trim(),
      unidad: fila.querySelector("[data-campo='unidad']").value.trim(),
      precioUnidad: numeroInput(fila.querySelector("[data-campo='precio']").value),
      cantidades: Object.fromEntries(ETAPAS.map((id) => [id, numeroInput(fila.querySelector("[data-etapa='" + id + "']").value)]))
    })).filter((ingrediente) => ingrediente.nombre || ingrediente.precioUnidad != null || ETAPAS.some((id) => ingrediente.cantidades[id]));
    return borrador;
  }

  function sincronizar() {
    if (document.getElementById("form-ficha")) state.borrador = leerFormulario();
  }

  function marcarSucio() {
    state.sucio = true;
  }

  async function guardarFicha(evento) {
    evento.preventDefault();
    if (state.guardando) return;
    const borrador = leerFormulario();
    if (!borrador.nombre) {
      mostrarToast("La ficha necesita un nombre.");
      return;
    }
    if (!borrador.ingredientes.length) {
      mostrarToast("Agrega al menos un ingrediente.");
      return;
    }
    const anterior = state.recetaId;
    borrador.id = idUnico(borrador.nombre, anterior);
    const normal = normalizar(borrador);
    if (anterior) {
      const indice = state.recetas.findIndex((receta) => receta.id === anterior);
      state.recetas.splice(indice, 1, normal);
    } else {
      state.recetas.push(normal);
    }
    guardarLocal();
    state.sucio = false;
    state.recetaId = normal.id;
    state.guardando = true;
    const accion = anterior ? "Actualizar" : "Agregar";
    await guardarEnGit(accion + " la ficha de " + normal.nombre + ".", "Ficha guardada en este navegador.");
    state.guardando = false;
    ir("#/r/" + encodeURIComponent(normal.id));
  }

  async function eliminarFicha() {
    const receta = recetaActual();
    if (!receta || state.guardando) return;
    const pregunta = state.conGit
      ? "¿Eliminar la ficha «" + receta.nombre + "»? También se quitará del repositorio."
      : "¿Eliminar la ficha «" + receta.nombre + "» de este navegador?";
    if (!confirm(pregunta)) return;
    state.recetas = state.recetas.filter((item) => item.id !== receta.id);
    guardarLocal();
    state.sucio = false;
    state.guardando = true;
    await guardarEnGit("Eliminar la ficha de " + receta.nombre + ".", "Ficha eliminada de este navegador.");
    state.guardando = false;
    ir("#/");
  }

  function restaurarOriginales() {
    if (!confirm("Se quitarán las recetas guardadas en este navegador y volverán las del repositorio.")) return;
    localStorage.removeItem(CLAVE);
    state.sucio = false;
    cargar();
    mostrarToast("Listo. Volviste a las fichas del repositorio.");
    ir("#/");
  }

  function descargar() {
    sincronizar();
    let lista = state.recetas.slice();
    if (state.vista === "editor") {
      const actual = normalizar(leerFormulario());
      if (state.recetaId) {
        lista = lista.map((receta) => receta.id === state.recetaId ? actual : receta);
      } else {
        lista = lista.concat(actual);
      }
    }
    const contenido = "window.RECETAS_INICIALES = " + JSON.stringify(lista.map(normalizar), null, 2) + ";\n";
    const archivo = new Blob([contenido], { type: "text/javascript" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(archivo);
    enlace.download = "datos.js";
    enlace.click();
    URL.revokeObjectURL(enlace.href);
    mostrarToast("Descarga lista. Reemplaza js/datos.js para dejarla en el repositorio.");
  }

  function importarArchivo(evento) {
    const archivo = evento.target.files && evento.target.files[0];
    evento.target.value = "";
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => {
      try {
        const texto = String(lector.result);
        const inicio = texto.indexOf("[");
        const fin = texto.lastIndexOf("]");
        if (inicio < 0 || fin < inicio) throw new Error("formato");
        const lista = JSON.parse(texto.slice(inicio, fin + 1));
        if (!Array.isArray(lista)) throw new Error("formato");
        state.recetas = lista.map(normalizar);
        guardarLocal();
        state.sucio = false;
        guardarEnGit("Importar fichas.", "Recetas importadas en este navegador.").then(() => ir("#/"));
      } catch (error) {
        mostrarToast("No pude leer ese archivo.");
      }
    };
    lector.readAsText(archivo);
  }

  function pintar() {
    const foco = document.activeElement && document.activeElement.id === "buscar" ? document.activeElement.selectionStart : null;
    app.replaceChildren(cabecera(), contenido());
    if (state.scrollA) {
      document.getElementById(state.scrollA)?.scrollIntoView({ behavior: "smooth", block: "start" });
      state.scrollA = null;
    }
    const buscar = document.getElementById("buscar");
    if (buscar && foco != null) {
      buscar.focus();
      buscar.setSelectionRange(foco, foco);
    }
  }

  function cabecera() {
    return el("header", { class: "cabecera" }, [
      el("a", { class: "marca", href: "#/", onclick: (evento) => { evento.preventDefault(); ir("#/"); } }, [
        el("span", { class: "sello", text: "Ft" }),
        el("div", {}, [
          el("h1", { text: "Fichas técnicas" }),
          el("p", { text: "Recetas, costos y preparación por etapas" })
        ])
      ]),
      el("div", { class: "acciones no-print" }, [
        el("button", { class: "btn secundario", type: "button", onclick: descargar, text: "Descargar fichas" }),
        el("button", { class: "btn", type: "button", onclick: () => ir("#/nueva"), text: "Nueva receta" })
      ])
    ]);
  }

  function contenido() {
    if (state.vista === "editor") return editor();
    if (state.vista === "ficha") return ficha();
    return catalogo();
  }

  function catalogo() {
    const categorias = ["Todas", ...new Set(state.recetas.map((receta) => receta.categoria).filter(Boolean))];
    const texto = state.busqueda.trim().toLowerCase();
    const visibles = state.recetas.filter((receta) => {
      const enCategoria = state.categoria === "Todas" || receta.categoria === state.categoria;
      const buscable = [receta.nombre, receta.categoria, receta.descripcion, ...receta.ingredientes.map((ingrediente) => ingrediente.nombre)].join(" ").toLowerCase();
      return enCategoria && (!texto || buscable.includes(texto));
    });
    return el("main", {}, [
      state.personalizadas ? el("div", { class: "banner no-print" }, [
        el("span", { text: state.conGit
          ? "Hay cambios solo en este navegador. Vuelve a guardar la ficha para subirlos a GitHub."
          : "Estás viendo las fichas guardadas en este navegador. Descarga datos.js y reemplázalo en el repositorio para no perderlas." }),
        state.conGit ? null : el("button", { class: "btn fantasma", type: "button", onclick: restaurarOriginales, text: "Volver a las del repositorio" })
      ]) : null,
      el("div", { class: "catalogo-top" }, [
        el("div", {}, [
          el("h2", { text: "Recetario" }),
          el("p", { text: state.conGit
            ? "Al guardar o eliminar una ficha, el cambio se confirma en Git y se sube a GitHub."
            : "Cada ficha ordena los ingredientes en las etapas A, B, C, D y E. En esta dirección los cambios quedan en el navegador." })
        ])
      ]),
      el("div", { class: "herramientas no-print" }, [
        el("input", {
          id: "buscar",
          class: "buscar",
          type: "search",
          placeholder: "Buscar receta o ingrediente",
          value: state.busqueda,
          oninput: (evento) => { state.busqueda = evento.target.value; pintar(); }
        }),
        el("div", { class: "chips" }, categorias.map((categoria) => el("button", {
          class: "chip" + (state.categoria === categoria ? " activa" : ""),
          type: "button",
          text: categoria,
          onclick: () => { state.categoria = categoria; pintar(); }
        }))),
        el("button", { class: "btn fantasma", type: "button", onclick: () => document.getElementById("archivo").click(), text: "Importar" }),
        el("input", { id: "archivo", class: "archivo", type: "file", accept: ".js,.json,text/javascript,application/json", onchange: importarArchivo })
      ]),
      visibles.length ? el("div", { class: "grilla" }, visibles.map(tarjeta)) : el("div", { class: "panel vacio", text: "No hay fichas con ese filtro." })
    ]);
  }

  function tarjeta(receta) {
    const costos = window.Costos.calcularReceta(receta);
    const usadas = etapasUsadas(receta);
    return el("button", { class: "tarjeta", type: "button", onclick: () => ir("#/r/" + encodeURIComponent(receta.id)) }, [
      el("div", {}, [
        el("div", { class: "categoria", text: receta.categoria }),
        el("h3", { text: receta.nombre })
      ]),
      el("p", { class: "resumen", text: receta.descripcion || "Sin descripción todavía." }),
      el("div", { class: "meta-mini" }, [
        el("span", { text: tiempoTexto(receta) }),
        el("span", { text: (receta.rendimientoPax || "—") + " pax" }),
        el("span", { text: dinero(costos.costoPorcion) + " / porción" })
      ]),
      el("div", { class: "meta-mini" }, [
        el("span", { text: usadas.length ? "Etapas " + usadas.join(", ") : "Sin etapas cargadas" })
      ])
    ]);
  }

  function ficha() {
    const receta = recetaActual();
    if (!receta) return el("p", { text: "No encontré esa ficha." });
    const costos = window.Costos.calcularReceta(receta);
    const etapaActiva = state.etapa;
    return el("main", {}, [
      el("div", { class: "ficha-head" }, [
        el("div", {}, [
          el("button", { class: "volver no-print", type: "button", onclick: () => ir("#/"), text: "← Recetario" }),
          el("p", { class: "kicker", text: receta.categoria + (receta.codigo ? " · " + receta.codigo : "") }),
          el("h2", { text: receta.nombre }),
          el("p", { class: "bajada", text: receta.descripcion || "Las cantidades A–E son las etapas de la preparación." })
        ]),
        el("div", { class: "acciones no-print" }, [
          el("button", { class: "btn secundario", type: "button", onclick: () => window.print(), text: "Imprimir" }),
          el("button", { class: "btn", type: "button", onclick: () => ir("#/r/" + encodeURIComponent(receta.id) + "/editar"), text: "Editar ficha" })
        ])
      ]),
      el("section", { class: "datos" }, [
        dato("Tiempo de preparación", tiempoTexto(receta)),
        dato("Rendimiento", (receta.rendimientoPax || "—") + " pax"),
        dato("Costo porción MP", dinero(costos.costoPorcion)),
        dato("Precio bruto / pax", dinero(costos.precioBrutoPorcion))
      ]),
      el("div", { class: "etapas no-print" }, [
        el("button", {
          class: "etapa etapa-todas" + (etapaActiva === "todas" ? " activa" : ""),
          type: "button",
          onclick: () => { state.etapa = "todas"; pintar(); }
        }, [el("b", { text: "Todas" }), el("small", { text: "Ficha completa" })]),
        ...receta.etapas.map((etapa) => el("button", {
          class: "etapa" + (etapaActiva === etapa.id ? " activa" : ""),
          type: "button",
          "data-etapa": etapa.id,
          onclick: () => { state.etapa = etapa.id; pintar(); }
        }, [
          el("b", { text: etapa.id }),
          el("small", { text: resumenEtapa(receta, etapa) })
        ]))
      ]),
      el("div", { class: "layout" }, [
        tablaIngredientes(receta, costos, etapaActiva),
        el("div", {}, [
          panelCostos(receta, costos),
          panelPasos(receta, etapaActiva)
        ])
      ])
    ]);
  }

  function dato(etiqueta, valor) {
    return el("article", { class: "panel dato" }, [
      el("span", { text: etiqueta }),
      el("strong", { text: valor })
    ]);
  }

  function tablaIngredientes(receta, costos, etapaActiva) {
    return el("section", { class: "panel bloque" }, [
      el("h3", { text: "Ingredientes" }),
      el("div", { class: "tabla-wrap" }, [
        el("table", {}, [
          el("thead", {}, [
            el("tr", {}, [
              el("th", { class: "nombre", text: "Producto" }),
              el("th", { text: "U/M" }),
              el("th", { class: "num", text: "$ U/M" }),
              ...ETAPAS.map((id) => el("th", { class: "num col-" + id + (etapaActiva === id ? " foco-" + id : ""), text: id })),
              el("th", { class: "num", text: "Total" }),
              el("th", { class: "num", text: "Costo" }),
              el("th", { class: "num", text: "Porción" })
            ])
          ]),
          el("tbody", {}, costos.ingredientes.map((ingrediente) => {
            const visible = etapaActiva === "todas" || Number(ingrediente.cantidades[etapaActiva]) > 0;
            return el("tr", { class: visible ? "" : "fuera" }, [
              el("td", { class: "nombre", text: ingrediente.nombre || "Sin nombre" }),
              el("td", { text: ingrediente.unidad || "" }),
              el("td", { class: "num", text: ingrediente.precio == null ? "—" : dinero(ingrediente.precio) }),
              ...ETAPAS.map((id) => el("td", {
                class: "num col-" + id + (etapaActiva === id ? " foco-" + id : ""),
                text: cantidad(ingrediente.cantidades[id])
              })),
              el("td", { class: "num", text: cantidad(ingrediente.total) || "—" }),
              el("td", { class: "num", text: dinero(ingrediente.costoTotal) }),
              el("td", { class: "num", text: dinero(ingrediente.costoPorcion) })
            ]);
          }))
        ])
      ]),
      etapaActiva !== "todas" && !costos.ingredientes.some((ingrediente) => Number(ingrediente.cantidades[etapaActiva]) > 0)
        ? el("p", { class: "aviso", text: "Esta etapa todavía no tiene cantidades. Puedes repartirlas al editar la ficha." })
        : null,
      el("p", { class: "pista", text: "La cantidad usa la misma unidad de la columna U/M. 0,4 kilo son 400 g. El costo de la línea es precio por total de las etapas A a E." })
    ]);
  }

  function panelCostos(receta, costos) {
    const filas = [
      ["Costo de receta (MP)", dinero(costos.costoMP), false],
      ["Make up " + porcentaje(costos.makeup), dinero(costos.costoMP * costos.makeup), false],
      ["Subtotal", dinero(costos.subtotal), false],
      ["IVA " + porcentaje(costos.iva), dinero(costos.montoIva), false],
      ["Precio bruto", dinero(costos.precioBruto), true]
    ];
    const extra = [];
    if (receta.precioVentaUnitario != null) extra.push(["Precio venta unitario", dinero(receta.precioVentaUnitario), false]);
    if (costos.precioSugerido != null) extra.push(["Precio sugerido / pax", dinero(costos.precioSugerido), false]);
    return el("aside", { class: "panel costos" }, [
      el("h3", { text: "Costos" }),
      ...filas.map(([etiqueta, valor, total]) => el("div", { class: "fila-costo" + (total ? " total" : "") }, [
        el("span", { text: etiqueta }),
        el(total ? "strong" : "b", { text: valor })
      ])),
      el("div", { class: "fila-costo" }, [
        el("span", { text: "Costo unitario MP" }),
        el("b", { text: dinero(costos.costoPorcion) })
      ]),
      el("div", { class: "fila-costo" }, [
        el("span", { text: "Precio bruto unitario" }),
        el("b", { text: dinero(costos.precioBrutoPorcion) })
      ]),
      el("div", { class: "fila-costo" }, [
        el("span", { text: "Ratio de costo" }),
        el("b", { text: costos.ratio == null ? "—" : porcentaje(costos.ratio) })
      ]),
      ...extra.map(([etiqueta, valor]) => el("div", { class: "fila-costo" }, [el("span", { text: etiqueta }), el("b", { text: valor })])),
      costos.faltanPrecios.length ? el("p", { class: "aviso", text: "Falta el precio de: " + costos.faltanPrecios.join(", ") + "." }) : null,
      receta.aporteCalorico ? el("p", { class: "pista", text: "Aporte calórico: " + receta.aporteCalorico }) : null,
      el("p", { class: "pista", text: "El ratio es el precio bruto dividido por el costo de materias primas. El costo suma cada ingrediente con cantidad." }),
      receta.tecnicas ? nota("Técnicas", receta.tecnicas) : null,
      receta.puntosCriticos ? nota("Puntos críticos", receta.puntosCriticos) : null
    ]);
  }

  function nota(titulo, texto) {
    return el("div", { class: "paso-etapa" }, [
      el("h3", { text: titulo }),
      el("p", { text: texto })
    ]);
  }

  function panelPasos(receta, etapaActiva) {
    return el("section", { class: "panel pasos" }, [
      el("h3", { text: "Preparación" }),
      el("p", { class: "pista", text: "Cada etapa reúne las cantidades de esa columna y el texto del paso a paso." }),
      ...receta.etapas.map((etapa) => bloqueEtapa(receta, etapa, etapaActiva === etapa.id)),
      el("div", { class: "no-print", style: "margin-top:0.8rem" }, [
        el("button", {
          class: "btn secundario",
          type: "button",
          text: "Escribir la preparación",
          onclick: () => {
            state.scrollA = "etapas";
            ir("#/r/" + encodeURIComponent(receta.id) + "/editar");
          }
        })
      ])
    ]);
  }

  function bloqueEtapa(receta, etapa, activa) {
    const ingredientes = receta.ingredientes.filter((ingrediente) => Number(ingrediente.cantidades[etapa.id]) > 0);
    return el("article", { class: "paso-etapa" + (activa ? " activa" : ""), id: "prep-" + etapa.id }, [
      el("header", {}, [
        el("strong", { text: etapa.id + " · " + nombreEtapa(etapa) }),
        el("span", { text: etapa.minutos ? etapa.minutos + " min" : "Sin tiempo" })
      ]),
      ingredientes.length ? el("ul", { class: "pasos-lista" }, ingredientes.map((ingrediente) => el("li", {
        text: ingrediente.nombre + ": " + cantidad(ingrediente.cantidades[etapa.id]) + " " + ingrediente.unidad
      }))) : el("p", { class: "pista", text: "Sin cantidades en esta etapa." }),
      etapa.pasos.length ? el("ol", { class: "pasos-lista" }, etapa.pasos.map((paso) => el("li", { text: paso }))) : el("div", { class: "sin-pasos", text: "Todavía no hay paso a paso en esta etapa." })
    ]);
  }

  function editor() {
    const receta = state.borrador;
    const porcentual = (valor) => valor == null ? "" : String(Math.round(valor * 1000) / 10);
    return el("main", {}, [
      el("div", { class: "editor-head" }, [
        el("div", {}, [
          el("button", { class: "volver", type: "button", onclick: () => ir(state.recetaId ? "#/r/" + encodeURIComponent(state.recetaId) : "#/"), text: "← Volver" }),
          el("p", { class: "kicker", text: state.recetaId ? "Editar ficha" : "Nueva ficha" }),
          el("h2", { text: receta.nombre || "Sin nombre" })
        ])
      ]),
      el("form", { id: "form-ficha", class: "formulario", onsubmit: guardarFicha, oninput: marcarSucio }, [
        el("section", { class: "panel bloque" }, [
          el("h3", { text: "Datos de la preparación" }),
          el("div", { class: "campos" }, [
            campo("Nombre", "nombre", receta.nombre, "text"),
            campo("Categoría", "categoria", receta.categoria, "text", "Postres, Comidas, Masas…"),
            campo("Código", "codigo", receta.codigo, "text"),
            campo("Aporte calórico", "aporteCalorico", receta.aporteCalorico, "text"),
            campo("Tiempo", "tiempoPreparacion", receta.tiempoPreparacion ?? "", "number"),
            selectTiempo(receta.tiempoUnidad),
            campo("Rendimiento pax", "rendimientoPax", receta.rendimientoPax ?? "", "number"),
            campo("% ganancia", "porcentajeGanancia", porcentual(receta.porcentajeGanancia), "number"),
            campo("Precio venta unitario", "precioVentaUnitario", receta.precioVentaUnitario ?? "", "number"),
            campo("Make up %", "makeup", porcentual(receta.makeup), "number"),
            campo("IVA %", "iva", porcentual(receta.iva), "number"),
            el("label", { class: "campo ancho" }, [
              el("span", { text: "Descripción" }),
              el("textarea", { name: "descripcion", rows: "2", text: receta.descripcion })
            ])
          ])
        ]),
        el("section", { id: "etapas", class: "panel bloque" }, [
          el("h3", { text: "Preparación por etapas" }),
          el("p", { class: "pista", text: "A, B, C, D y E ordenan la ficha. Escribe un paso por línea. Las cantidades de los ingredientes se cargan en la misma letra, más abajo." }),
          ...receta.etapas.map((etapa) => el("article", { class: "carta-etapa" }, [
            el("div", { class: "campos-etapa" }, [
              el("div", { class: "letra", style: "background:var(--" + etapa.id.toLowerCase() + ")", text: etapa.id }),
              campo("Nombre de la etapa", "etapa-nombre-" + etapa.id, etapa.nombre, "text", "Por ejemplo: masa, relleno, montaje"),
              campo("Minutos", "etapa-minutos-" + etapa.id, etapa.minutos ?? "", "number")
            ]),
            el("label", { class: "campo", style: "margin-top:0.6rem" }, [
              el("span", { text: "Paso a paso" }),
              el("textarea", { name: "etapa-pasos-" + etapa.id, text: etapa.pasos.join("\n"), placeholder: "Un paso por línea" })
            ])
          ]))
        ]),
        el("section", { class: "panel bloque" }, [
          el("h3", { text: "Ingredientes y cantidades" }),
          el("p", { class: "pista", text: "El precio es por la unidad indicada. Reparte la cantidad entre las etapas en las que se usa ese producto." }),
          el("div", { class: "ing-head ing-editor" }, [
            el("span", { text: "Producto" }),
            el("span", { text: "U/M" }),
            el("span", { text: "$ U/M" }),
            ...ETAPAS.map((id) => el("span", { text: id })),
            el("span", { text: "" })
          ]),
          ...receta.ingredientes.map((ingrediente, indice) => filaIngrediente(ingrediente, indice)),
          el("p", {}, [
            el("button", { class: "btn secundario", type: "button", text: "Agregar ingrediente", onclick: () => {
              sincronizar();
              state.borrador.ingredientes.push({ nombre: "", unidad: "kilo", precioUnidad: null, cantidades: { A: null, B: null, C: null, D: null, E: null } });
              pintar();
            } })
          ])
        ]),
        el("section", { class: "panel bloque" }, [
          el("h3", { text: "Notas de la ficha" }),
          el("div", { class: "campos-3" }, [
            el("label", { class: "campo ancho" }, [
              el("span", { text: "Técnicas" }),
              el("textarea", { name: "tecnicas", rows: "3", text: receta.tecnicas })
            ]),
            el("label", { class: "campo ancho" }, [
              el("span", { text: "Puntos críticos" }),
              el("textarea", { name: "puntosCriticos", rows: "3", text: receta.puntosCriticos })
            ])
          ])
        ]),
        el("div", { class: "barra-guardar" }, [
          el("div", { class: "grupo-botones" }, [
            state.recetaId ? el("button", { class: "btn peligro", type: "button", text: "Eliminar", onclick: eliminarFicha }) : null
          ]),
          el("div", { class: "grupo-botones" }, [
            el("button", { class: "btn secundario", type: "button", text: "Descargar", onclick: descargar }),
            el("button", { class: "btn", type: "submit", disabled: state.guardando, text: state.guardando ? "Subiendo…" : (state.conGit ? "Guardar y subir" : "Guardar ficha") })
          ])
        ])
      ])
    ]);
  }

  function campo(etiqueta, nombre, valor, tipo, placeholder) {
    return el("label", { class: "campo" }, [
      el("span", { text: etiqueta }),
      el("input", { name: nombre, type: tipo || "text", value: valor ?? "", placeholder: placeholder || null, step: tipo === "number" ? "any" : null })
    ]);
  }

  function selectTiempo(unidad) {
    const select = el("select", { name: "tiempoUnidad" }, [
      el("option", { value: "h", text: "horas" }),
      el("option", { value: "min", text: "minutos" })
    ]);
    select.value = unidad || "h";
    return el("label", { class: "campo" }, [el("span", { text: "Unidad de tiempo" }), select]);
  }

  function filaIngrediente(ingrediente, indice) {
    return el("div", { class: "ing-editor", "data-ingrediente": String(indice) }, [
      el("input", { "data-campo": "nombre", value: ingrediente.nombre, placeholder: "Ingrediente", "aria-label": "Ingrediente" }),
      el("input", { "data-campo": "unidad", value: ingrediente.unidad, placeholder: "kilo", "aria-label": "Unidad", list: "unidades" }),
      el("input", { "data-campo": "precio", type: "number", step: "any", value: ingrediente.precioUnidad ?? "", placeholder: "0", "aria-label": "Precio" }),
      ...ETAPAS.map((id) => el("input", {
        "data-etapa": id,
        type: "number",
        step: "any",
        value: ingrediente.cantidades[id] ?? "",
        "aria-label": "Cantidad " + id
      })),
      el("button", { class: "btn fantasma", type: "button", text: "Quitar", onclick: () => {
        sincronizar();
        state.borrador.ingredientes.splice(indice, 1);
        pintar();
      } })
    ]);
  }

  function listaUnidades() {
    if (document.getElementById("unidades")) return;
    document.body.append(el("datalist", { id: "unidades" }, ["kilo", "litro", "unidad", "gramo", "ml"].map((unidad) => el("option", { value: unidad }))));
  }

  cargar();
  listaUnidades();
  if (!location.hash) location.hash = "#/";
  aplicarRuta();
  pintar();
  detectarGit();
})();
