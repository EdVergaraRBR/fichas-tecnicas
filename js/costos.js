(function () {
  const ETAPAS = ["A", "B", "C", "D", "E"];

  function numero(valor) {
    if (valor === null || valor === undefined || valor === "") return null;
    const n = Number(valor);
    return Number.isFinite(n) ? n : null;
  }

  function calcularIngrediente(ingrediente, pax) {
    const cantidades = {};
    let total = 0;
    ETAPAS.forEach((id) => {
      const cantidad = numero(ingrediente.cantidades && ingrediente.cantidades[id]);
      cantidades[id] = cantidad;
      total += cantidad || 0;
    });
    const precio = numero(ingrediente.precioUnidad);
    const costoTotal = precio === null ? null : precio * total;
    const costoPorcion = costoTotal === null || !pax ? null : costoTotal / pax;
    return {
      cantidades,
      total,
      precio,
      costoTotal,
      costoPorcion,
      faltaPrecio: total > 0 && precio === null
    };
  }

  function calcularReceta(receta) {
    const pax = numero(receta.rendimientoPax) || 0;
    const ingredientes = (receta.ingredientes || []).map((ingrediente) =>
      Object.assign({}, ingrediente, calcularIngrediente(ingrediente, pax))
    );
    const costoMP = ingredientes.reduce((suma, ingrediente) => suma + (ingrediente.costoTotal || 0), 0);
    const makeup = numero(receta.makeup) || 0;
    const iva = numero(receta.iva) || 0;
    const subtotal = costoMP * (1 + makeup);
    const montoIva = subtotal * iva;
    const precioBruto = subtotal + montoIva;
    const minutos = (receta.etapas || []).reduce((suma, etapa) => suma + (numero(etapa.minutos) || 0), 0);
    const precioBrutoPorcion = pax ? precioBruto / pax : null;
    const ganancia = numero(receta.porcentajeGanancia);
    return {
      ingredientes,
      costoMP,
      makeup,
      iva,
      subtotal,
      montoIva,
      precioBruto,
      costoPorcion: pax ? costoMP / pax : null,
      precioBrutoPorcion,
      precioSugerido: ganancia === null || precioBrutoPorcion === null ? null : precioBrutoPorcion * (1 + ganancia),
      ratio: costoMP ? precioBruto / costoMP : null,
      minutos,
      faltanPrecios: ingredientes.filter((ingrediente) => ingrediente.faltaPrecio).map((ingrediente) => ingrediente.nombre)
    };
  }

  window.Costos = { ETAPAS, numero, calcularReceta };
})();
