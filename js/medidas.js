(function () {
  const plurales = {
    taza: "tazas",
    cucharada: "cucharadas",
    cucharadita: "cucharaditas",
    pizca: "pizcas",
    unidad: "unidades",
    huevo: "huevos",
    yema: "yemas",
    tarro: "tarros",
    sobre: "sobres"
  };

  function plural(unidad, cantidad) {
    if (cantidad >= 2 && plurales[unidad]) return plurales[unidad];
    return unidad || "";
  }

  function fraccion(valor) {
    if (!Number.isFinite(valor)) return "—";
    const negativo = valor < 0;
    const absoluto = Math.abs(valor);
    const enteros = Math.floor(absoluto + 1e-8);
    const resto = absoluto - enteros;
    if (resto < 0.02) return (negativo ? "-" : "") + String(enteros);
    const opciones = [[1, 8], [1, 7], [1, 6], [1, 5], [1, 4], [1, 3], [2, 7], [3, 8], [2, 5], [3, 7], [1, 2], [4, 7], [3, 5], [5, 8], [2, 3], [5, 7], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]];
    let mejor = null;
    opciones.forEach(function (opcion) {
      const error = Math.abs(resto - opcion[0] / opcion[1]);
      if (!mejor || error < mejor.error) mejor = { numerador: opcion[0], denominador: opcion[1], error: error };
    });
    if (mejor && mejor.error <= 0.03) {
      const texto = mejor.numerador + "/" + mejor.denominador;
      const cuerpo = enteros ? enteros + " " + texto : texto;
      return (negativo ? "-" : "") + cuerpo;
    }
    return new Intl.NumberFormat("es-CL", { maximumFractionDigits: 2 }).format(negativo ? -absoluto : absoluto);
  }

  function cantidadMedida(valor, unidad) {
    if (unidad === "g" || unidad === "ml" || unidad === "cc") {
      const digitos = Math.abs(valor) >= 20 ? 0 : 1;
      return new Intl.NumberFormat("es-CL", { maximumFractionDigits: digitos }).format(valor) + " " + unidad;
    }
    return fraccion(valor) + " " + plural(unidad, valor);
  }

  function texto(bloque, factor) {
    if (!bloque) return "";
    const escala = bloque.escala === false ? 1 : (factor || 1);
    if (bloque.texto && bloque.escala === false) return bloque.texto;
    if (bloque.min != null && bloque.max != null) {
      const minimo = bloque.min * escala;
      const maximo = bloque.max * escala;
      if (bloque.unidad === "g" || bloque.unidad === "ml" || bloque.unidad === "cc") {
        const desde = new Intl.NumberFormat("es-CL", { maximumFractionDigits: minimo >= 20 ? 0 : 1 }).format(minimo);
        return desde + " a " + cantidadMedida(maximo, bloque.unidad) + (bloque.aprox ? " aprox." : "");
      }
      return fraccion(minimo) + " a " + fraccion(maximo) + " " + plural(bloque.unidad, maximo) + (bloque.aprox ? " aprox." : "");
    }
    if (bloque.opciones) {
      return bloque.opciones.map(function (opcion, indice) {
        const medida = cantidadMedida(opcion.cantidad * escala, opcion.unidad);
        return (indice ? " o " : "") + medida + (opcion.etiqueta ? " " + opcion.etiqueta : "");
      }).join("");
    }
    if (bloque.cantidad == null) return bloque.texto || "";
    let base = cantidadMedida(bloque.cantidad * escala, bloque.unidad);
    if (bloque.aprox) base += " aprox.";
    if (bloque.nota) base += bloque.nota;
    if (bloque.tambien) base += ", aproximadamente " + cantidadMedida(bloque.tambien.cantidad * escala, bloque.tambien.unidad);
    return base;
  }

  window.Medidas = { texto: texto };
})();
