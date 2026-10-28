# Fichas técnicas

Recetario para ver cada preparación como ficha: ingredientes, costo, rendimiento y preparación por etapas A, B, C, D y E.

La primera ficha es el **queque** tomado de `fichas tecnicas.xlsx`. Las cantidades están en la etapa A. El paso a paso todavía no venía en la planilla: se escribe en la misma etapa, un paso por línea.

## Cómo verla

En esta PC, deja corriendo el servidor local y abre http://127.0.0.1:8080/

```bash
py -3.14 servidor.py
```

La copia publicada sigue en https://edvergararbr.github.io/fichas-tecnicas/

## Cómo agregar una receta

1. Abre la página con el servidor local, no como archivo suelto.
2. Entra a **Nueva receta** y completa los datos, el paso a paso y las cantidades A–E.
3. Pulsa **Guardar y subir**.

Eso reescribe `js/datos.js`, crea el commit y lo sube a GitHub. Eliminar una ficha hace lo mismo. En la página publicada el guardado solo queda en ese navegador, porque desde ahí no se puede usar la sesión de Git de esta PC.

## Costos

Por cada ingrediente:

- total = cantidad A + B + C + D + E
- costo = precio de la unidad × total
- costo porción = costo ÷ rendimiento

Después se aplica el make up, el IVA y el precio bruto, igual que en la ficha de la planilla. El precio es por la unidad indicada: `0,4` kilo son 400 g.

En el Excel, la suma del costo dejaba fuera la fila de las nueces. En esta página entra cada ingrediente que tenga cantidad.
