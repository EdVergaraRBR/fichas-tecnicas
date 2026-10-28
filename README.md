# Fichas técnicas

Recetario para ver cada preparación como ficha: ingredientes, costo, rendimiento y preparación por etapas A, B, C, D y E.

La primera ficha es el **queque** tomado de `fichas tecnicas.xlsx`. Las cantidades están en la etapa A. El paso a paso todavía no venía en la planilla: se escribe en la misma etapa, un paso por línea.

## Cómo verla

Abre `index.html` en el navegador, o entra a https://edvergararbr.github.io/fichas-tecnicas/

## Cómo agregar una receta

1. Entra a **Nueva receta**.
2. Completa los datos, el paso a paso de cada etapa y las cantidades A–E.
3. Pulsa **Guardar ficha**. Queda guardada en ese navegador.
4. Pulsa **Descargar fichas** y reemplaza `js/datos.js` con el archivo descargado.
5. Guarda ese cambio en el repositorio para que la receta quede para todos.

También puedes editar `js/datos.js` a mano. Cada receta repite la misma estructura del queque.

## Costos

Por cada ingrediente:

- total = cantidad A + B + C + D + E
- costo = precio de la unidad × total
- costo porción = costo ÷ rendimiento

Después se aplica el make up, el IVA y el precio bruto, igual que en la ficha de la planilla. El precio es por la unidad indicada: `0,4` kilo son 400 g.

En el Excel, la suma del costo dejaba fuera la fila de las nueces. En esta página entra cada ingrediente que tenga cantidad.
