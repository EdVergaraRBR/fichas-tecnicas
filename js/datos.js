// Recetas del sitio. Al guardar una ficha con el servidor local,
// este archivo se actualiza, se confirma en Git y se sube a GitHub.
window.RECETAS_INICIALES = [
  {
    "id": "queque",
    "nombre": "Queque",
    "descripcion": "Queque con cáscara de limón, maicena y harina con polvos. Las cantidades se pueden ver en tazas o en gramos.",
    "categoria": "Postres",
    "codigo": "",
    "tiempoPreparacion": 2.5,
    "tiempoUnidad": "h",
    "rendimientoPax": 12,
    "aporteCalorico": "",
    "porcentajeGanancia": null,
    "precioVentaUnitario": null,
    "makeup": 0.02,
    "iva": 0.19,
    "tecnicas": "",
    "puntosCriticos": "",
    "etapas": [
      {
        "id": "A",
        "nombre": "",
        "minutos": null,
        "pasos": []
      },
      {
        "id": "B",
        "nombre": "",
        "minutos": null,
        "pasos": []
      },
      {
        "id": "C",
        "nombre": "",
        "minutos": null,
        "pasos": []
      },
      {
        "id": "D",
        "nombre": "",
        "minutos": null,
        "pasos": []
      },
      {
        "id": "E",
        "nombre": "",
        "minutos": null,
        "pasos": []
      }
    ],
    "ingredientes": [
      {
        "nombre": "Azúcar",
        "unidad": "kilo",
        "precioUnidad": 1276,
        "medidaReceta": "2 tazas",
        "medidaEstandar": "400 g",
        "presentacion": { "receta": { "cantidad": 2, "unidad": "taza" }, "estandar": { "cantidad": 400, "unidad": "g" } },
        "cantidades": { "A": 0.4, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Sal",
        "unidad": "kilo",
        "precioUnidad": 450,
        "medidaReceta": "1 pizca",
        "medidaEstandar": "1 g",
        "presentacion": { "receta": { "cantidad": 1, "unidad": "pizca" }, "estandar": { "cantidad": 1, "unidad": "g" } },
        "cantidades": { "A": 0.001, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Cáscara de limón (ralladura)",
        "unidad": "kilo",
        "precioUnidad": 1925,
        "medidaReceta": "A gusto",
        "medidaEstandar": "5 g aprox.",
        "presentacion": { "receta": { "texto": "A gusto", "escala": false }, "estandar": { "cantidad": 5, "unidad": "g", "aprox": true } },
        "cantidades": { "A": 0.005, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Maicena",
        "unidad": "kilo",
        "precioUnidad": 2550,
        "medidaReceta": "1 taza",
        "medidaEstandar": "120 g",
        "presentacion": { "receta": { "cantidad": 1, "unidad": "taza" }, "estandar": { "cantidad": 120, "unidad": "g" } },
        "cantidades": { "A": 0.12, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Harina con polvos",
        "unidad": "kilo",
        "precioUnidad": 1314,
        "medidaReceta": "2 tazas",
        "medidaEstandar": "240 g",
        "presentacion": { "receta": { "cantidad": 2, "unidad": "taza" }, "estandar": { "cantidad": 240, "unidad": "g" } },
        "cantidades": { "A": 0.24, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Huevo",
        "unidad": "unidad",
        "precioUnidad": 277,
        "medidaReceta": "6 huevos",
        "medidaEstandar": "300 g aprox. sin cáscara",
        "presentacion": { "receta": { "cantidad": 6, "unidad": "huevo" }, "estandar": { "cantidad": 300, "unidad": "g", "aprox": true, "nota": " sin cáscara" } },
        "cantidades": { "A": 6, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Leche",
        "unidad": "litro",
        "precioUnidad": 1150,
        "medidaReceta": "1/2 taza de leche o yogur",
        "medidaEstandar": "125 ml de leche o 125 g de yogur",
        "presentacion": {
          "receta": { "cantidad": 0.5, "unidad": "taza", "nota": " de leche o yogur" },
          "estandar": { "opciones": [{ "cantidad": 125, "unidad": "ml", "etiqueta": "de leche" }, { "cantidad": 125, "unidad": "g", "etiqueta": "de yogur" }] }
        },
        "cantidades": { "A": 0.125, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Aceite",
        "unidad": "litro",
        "precioUnidad": 2505,
        "medidaReceta": "1/2 taza",
        "medidaEstandar": "120 ml, aproximadamente 110 g",
        "presentacion": { "receta": { "cantidad": 0.5, "unidad": "taza" }, "estandar": { "cantidad": 120, "unidad": "ml", "tambien": { "cantidad": 110, "unidad": "g" } } },
        "cantidades": { "A": 0.12, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Polvo de hornear",
        "unidad": "kilo",
        "precioUnidad": 9900,
        "medidaReceta": "1 a 2 cucharadas",
        "medidaEstandar": "10 a 20 g aprox.",
        "presentacion": { "receta": { "min": 1, "max": 2, "unidad": "cucharada" }, "estandar": { "min": 10, "max": 20, "unidad": "g", "aprox": true } },
        "cantidades": { "A": 0.015, "B": null, "C": null, "D": null, "E": null }
      }
    ]
  },
  {
    "id": "cheesecake-maracuya",
    "nombre": "Cheesecake de maracuyá",
    "descripcion": "Alcanza para 7 porciones individuales, o para 1 porción grande y 1 individual. La etapa A es la masa, la B el relleno y la C la salsa.",
    "notaMedidas": "De la receta: 1 taza de harina o de azúcar flor = 120 g, 1 taza de mantequilla = 200 g, 1 taza de cream cheese = 240 g, 1 taza de leche condensada = 300 g, 1 taza de pulpa = 250 g, 1 taza de azúcar = 200 g y 1 taza de líquido = 250 ml. 1 cucharada = 15 ml y 1 cucharadita = 5 ml. La pizca de sal equivale a 1 g.",
    "categoria": "Postres",
    "codigo": "",
    "tiempoPreparacion": null,
    "tiempoUnidad": "h",
    "rendimientoPax": 7,
    "aporteCalorico": "",
    "porcentajeGanancia": null,
    "precioVentaUnitario": null,
    "makeup": 0.02,
    "iva": 0.19,
    "tecnicas": "",
    "puntosCriticos": "",
    "etapas": [
      { "id": "A", "nombre": "Masa", "minutos": null, "pasos": [] },
      { "id": "B", "nombre": "Relleno", "minutos": null, "pasos": [] },
      { "id": "C", "nombre": "Salsa", "minutos": null, "pasos": [] },
      { "id": "D", "nombre": "", "minutos": null, "pasos": [] },
      { "id": "E", "nombre": "", "minutos": null, "pasos": [] }
    ],
    "ingredientes": [
      {
        "nombre": "Harina sin polvos",
        "unidad": "kilo",
        "precioUnidad": 1302,
        "medidaReceta": "1 2/3 taza",
        "medidaEstandar": "200 g",
        "presentacion": { "receta": { "cantidad": 1.6666667, "unidad": "taza" }, "estandar": { "cantidad": 200, "unidad": "g" } },
        "cantidades": { "A": 0.2, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Mantequilla",
        "unidad": "kilo",
        "precioUnidad": 11910,
        "medidaReceta": "1/2 taza, fría en cubitos",
        "medidaEstandar": "100 g",
        "presentacion": { "receta": { "cantidad": 0.5, "unidad": "taza", "nota": ", fría en cubitos" }, "estandar": { "cantidad": 100, "unidad": "g" } },
        "cantidades": { "A": 0.1, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Azúcar flor",
        "unidad": "kilo",
        "precioUnidad": 2490,
        "medidaReceta": "1/2 taza",
        "medidaEstandar": "60 g",
        "presentacion": { "receta": { "cantidad": 0.5, "unidad": "taza" }, "estandar": { "cantidad": 60, "unidad": "g" } },
        "cantidades": { "A": 0.06, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Huevo",
        "unidad": "unidad",
        "precioUnidad": 277,
        "medidaReceta": "1 huevo",
        "medidaEstandar": "1 unidad",
        "presentacion": { "receta": { "cantidad": 1, "unidad": "huevo" }, "estandar": { "cantidad": 1, "unidad": "unidad" } },
        "cantidades": { "A": 1, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Sal",
        "unidad": "kilo",
        "precioUnidad": 450,
        "medidaReceta": "1 pizca",
        "medidaEstandar": "1 g",
        "presentacion": { "receta": { "cantidad": 1, "unidad": "pizca" }, "estandar": { "cantidad": 1, "unidad": "g" } },
        "cantidades": { "A": 0.001, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Esencia de vainilla",
        "unidad": "cucharadita",
        "precioUnidad": 31,
        "medidaReceta": "1/2 cucharadita (opcional)",
        "medidaEstandar": "2,5 ml",
        "presentacion": { "receta": { "cantidad": 0.5, "unidad": "cucharadita", "nota": " (opcional)" }, "estandar": { "cantidad": 2.5, "unidad": "ml" } },
        "cantidades": { "A": 0.5, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Cream cheese americano",
        "unidad": "kilo",
        "precioUnidad": 6890,
        "medidaReceta": "2 1/2 tazas",
        "medidaEstandar": "600 g",
        "presentacion": { "receta": { "cantidad": 2.5, "unidad": "taza" }, "estandar": { "cantidad": 600, "unidad": "g" } },
        "cantidades": { "A": null, "B": 0.6, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Crema de leche",
        "unidad": "litro",
        "precioUnidad": 3990,
        "medidaReceta": "4/5 taza, muy fría",
        "medidaEstandar": "200 cc",
        "presentacion": { "receta": { "cantidad": 0.8, "unidad": "taza", "nota": ", muy fría" }, "estandar": { "cantidad": 200, "unidad": "cc" } },
        "cantidades": { "A": null, "B": 0.2, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Leche condensada",
        "unidad": "kilo",
        "precioUnidad": 4156,
        "medidaReceta": "1 1/3 taza",
        "medidaEstandar": "400 g",
        "presentacion": { "receta": { "cantidad": 1.3333333, "unidad": "taza" }, "estandar": { "cantidad": 400, "unidad": "g" } },
        "cantidades": { "A": null, "B": 0.4, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Gelatina sin sabor",
        "unidad": "kilo",
        "precioUnidad": 16956,
        "medidaReceta": "2 cucharadas",
        "medidaEstandar": "15 g",
        "presentacion": { "receta": { "cantidad": 2, "unidad": "cucharada" }, "estandar": { "cantidad": 15, "unidad": "g" } },
        "cantidades": { "A": null, "B": 0.015, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Agua",
        "unidad": "litro",
        "precioUnidad": 0,
        "medidaReceta": "1/3 taza",
        "medidaEstandar": "80 cc",
        "presentacion": { "receta": { "cantidad": 0.3333333, "unidad": "taza" }, "estandar": { "cantidad": 80, "unidad": "cc" } },
        "cantidades": { "A": null, "B": 0.08, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Pulpa de maracuyá",
        "unidad": "kilo",
        "precioUnidad": 5223,
        "medidaReceta": "1 taza",
        "medidaEstandar": "250 g",
        "presentacion": { "receta": { "cantidad": 1, "unidad": "taza" }, "estandar": { "cantidad": 250, "unidad": "g" } },
        "cantidades": { "A": null, "B": null, "C": 0.25, "D": null, "E": null }
      },
      {
        "nombre": "Azúcar",
        "unidad": "kilo",
        "precioUnidad": 1276,
        "medidaReceta": "2/5 taza",
        "medidaEstandar": "80 g",
        "presentacion": { "receta": { "cantidad": 0.4, "unidad": "taza" }, "estandar": { "cantidad": 80, "unidad": "g" } },
        "cantidades": { "A": null, "B": null, "C": 0.08, "D": null, "E": null }
      },
      {
        "nombre": "Maicena",
        "unidad": "kilo",
        "precioUnidad": 2550,
        "medidaReceta": "4 cucharaditas",
        "medidaEstandar": "10 g",
        "presentacion": { "receta": { "cantidad": 4, "unidad": "cucharadita" }, "estandar": { "cantidad": 10, "unidad": "g" } },
        "cantidades": { "A": null, "B": null, "C": 0.01, "D": null, "E": null }
      },
      {
        "nombre": "Agua",
        "unidad": "litro",
        "precioUnidad": 0,
        "medidaReceta": "2/5 taza",
        "medidaEstandar": "100 cc",
        "presentacion": { "receta": { "cantidad": 0.4, "unidad": "taza" }, "estandar": { "cantidad": 100, "unidad": "cc" } },
        "cantidades": { "A": null, "B": null, "C": 0.1, "D": null, "E": null }
      }
    ]
  },
  {
    "id": "tartaleta-durazno",
    "nombre": "Tartaleta de durazno",
    "descripcion": "Misma masa del cheesecake de maracuyá. La etapa A es la masa, la B la crema y la C la cobertura de durazno. Alcanza para 6 porciones.",
    "notaMedidas": "En la masa, 1 taza de harina o de azúcar flor = 120 g y 1 taza de mantequilla = 200 g. 1 cucharadita = 5 ml, así que 10 cc de vainilla son 2 cucharaditas. La pizca de sal equivale a 1 g. El durazno es 1 tarro conservero, que drenado da 480 g.",
    "categoria": "Postres",
    "codigo": "",
    "tiempoPreparacion": null,
    "tiempoUnidad": "h",
    "rendimientoPax": 6,
    "aporteCalorico": "",
    "porcentajeGanancia": null,
    "precioVentaUnitario": null,
    "makeup": 0.02,
    "iva": 0.19,
    "tecnicas": "",
    "puntosCriticos": "",
    "etapas": [
      { "id": "A", "nombre": "Masa", "minutos": null, "pasos": [] },
      { "id": "B", "nombre": "Crema", "minutos": null, "pasos": [] },
      { "id": "C", "nombre": "Cobertura", "minutos": null, "pasos": [] },
      { "id": "D", "nombre": "", "minutos": null, "pasos": [] },
      { "id": "E", "nombre": "", "minutos": null, "pasos": [] }
    ],
    "ingredientes": [
      {
        "nombre": "Harina sin polvos",
        "unidad": "kilo",
        "precioUnidad": 1302,
        "medidaReceta": "1 2/3 taza",
        "medidaEstandar": "200 g",
        "presentacion": { "receta": { "cantidad": 1.6666667, "unidad": "taza" }, "estandar": { "cantidad": 200, "unidad": "g" } },
        "cantidades": { "A": 0.2, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Mantequilla",
        "unidad": "kilo",
        "precioUnidad": 11910,
        "medidaReceta": "1/2 taza, fría en cubitos",
        "medidaEstandar": "100 g",
        "presentacion": { "receta": { "cantidad": 0.5, "unidad": "taza", "nota": ", fría en cubitos" }, "estandar": { "cantidad": 100, "unidad": "g" } },
        "cantidades": { "A": 0.1, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Azúcar flor",
        "unidad": "kilo",
        "precioUnidad": 2490,
        "medidaReceta": "1/2 taza",
        "medidaEstandar": "60 g",
        "presentacion": { "receta": { "cantidad": 0.5, "unidad": "taza" }, "estandar": { "cantidad": 60, "unidad": "g" } },
        "cantidades": { "A": 0.06, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Huevo",
        "unidad": "unidad",
        "precioUnidad": 277,
        "medidaReceta": "1 huevo",
        "medidaEstandar": "1 unidad",
        "presentacion": { "receta": { "cantidad": 1, "unidad": "huevo" }, "estandar": { "cantidad": 1, "unidad": "unidad" } },
        "cantidades": { "A": 1, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Sal",
        "unidad": "kilo",
        "precioUnidad": 450,
        "medidaReceta": "1 pizca",
        "medidaEstandar": "1 g",
        "presentacion": { "receta": { "cantidad": 1, "unidad": "pizca" }, "estandar": { "cantidad": 1, "unidad": "g" } },
        "cantidades": { "A": 0.001, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Esencia de vainilla",
        "unidad": "cucharadita",
        "precioUnidad": 31,
        "medidaReceta": "1/2 cucharadita (opcional)",
        "medidaEstandar": "2,5 ml",
        "presentacion": { "receta": { "cantidad": 0.5, "unidad": "cucharadita", "nota": " (opcional)" }, "estandar": { "cantidad": 2.5, "unidad": "ml" } },
        "cantidades": { "A": 0.5, "B": null, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Leche",
        "unidad": "litro",
        "precioUnidad": 1150,
        "medidaReceta": "500 cc",
        "medidaEstandar": "500 cc",
        "presentacion": { "receta": { "cantidad": 500, "unidad": "cc" }, "estandar": { "cantidad": 500, "unidad": "cc" } },
        "cantidades": { "A": null, "B": 0.5, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Maicena",
        "unidad": "kilo",
        "precioUnidad": 2550,
        "medidaReceta": "50 g",
        "medidaEstandar": "50 g",
        "presentacion": { "receta": { "cantidad": 50, "unidad": "g" }, "estandar": { "cantidad": 50, "unidad": "g" } },
        "cantidades": { "A": null, "B": 0.05, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Azúcar",
        "unidad": "kilo",
        "precioUnidad": 1276,
        "medidaReceta": "100 g",
        "medidaEstandar": "100 g",
        "presentacion": { "receta": { "cantidad": 100, "unidad": "g" }, "estandar": { "cantidad": 100, "unidad": "g" } },
        "cantidades": { "A": null, "B": 0.1, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Huevo",
        "unidad": "unidad",
        "precioUnidad": 277,
        "medidaReceta": "3 yemas",
        "medidaEstandar": "3 unidades",
        "presentacion": { "receta": { "cantidad": 3, "unidad": "yema" }, "estandar": { "cantidad": 3, "unidad": "unidad" } },
        "cantidades": { "A": null, "B": 3, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Esencia de vainilla",
        "unidad": "cucharadita",
        "precioUnidad": 31,
        "medidaReceta": "10 cc",
        "medidaEstandar": "10 cc",
        "presentacion": { "receta": { "cantidad": 10, "unidad": "cc" }, "estandar": { "cantidad": 10, "unidad": "cc" } },
        "cantidades": { "A": null, "B": 2, "C": null, "D": null, "E": null }
      },
      {
        "nombre": "Durazno conservero",
        "unidad": "tarro",
        "precioUnidad": null,
        "medidaReceta": "1 tarro",
        "medidaEstandar": "480 g drenados",
        "presentacion": { "receta": { "cantidad": 1, "unidad": "tarro" }, "estandar": { "cantidad": 480, "unidad": "g", "nota": " drenados" } },
        "cantidades": { "A": null, "B": null, "C": 1, "D": null, "E": null }
      }
    ]
  }
];
