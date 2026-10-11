# Cambios del canon 2.3.0

Decisión del dueño (DEC50), respondida en una pregunta interactiva: «Corregir el canon (Recomendado)». La única
fuente sigue siendo ISO/PAS 19450:2015.

## Canon

Sólo cambia la matriz de precedencia entre transformadores al recomponer (ISO §14.2.4.2, Tabla 27).

| Documento | Lugar | 2.2.0 | 2.3.0 |
|---|---|---|---|
| reglas | §6.6, R-PREC-1, AP-30 | Inválidos sólo resultado+resultado y consumo+consumo, sin orden; «no verificable». | Con P1 anterior a P2, inválidos también efecto→resultado y consumo→efecto; lectura inferida. |
| spec-OPD | R-OPD-REF-13 | Remite a la matriz «no verificable». | Remite a la matriz inferida de cuatro celdas. |
| spec-OPL | §8.3.1 | «no verificable». | «lectura inferida». |
| metodología | A3.4i | «no verificable». | «lectura inferida». |

Fundamento. La PAS no trae las figuras de la Tabla 27, pero sí su disposición:
- las columnas son el enlace entre B y P1, que está arriba, y las filas el enlace entre B y P2;
- las celdas «Invalid» son (fila 1, columna 2), (2, 2), (3, 1) y (3, 3);
- las columnas describen un enlace sin dirección, uno hacia abajo, hacia P1, y uno hacia arriba.

De los seis órdenes posibles de efecto, resultado y consumo, sólo efecto, consumo, resultado pone las cuatro
celdas en las combinaciones temporalmente imposibles: crear dos veces, consumir dos veces, afectar lo ya
consumido y crear lo que ya existía. La matriz de la 2.2.0 tenía dos celdas inválidas y no podía ser la Tabla 27.
Las celdas válidas siguen el texto de §14.2.4.2. La lectura es inferida y se revisa si se dispone de las figuras.

## Fuera del canon

- El producto no cambia: `nucleo/proyeccion.ts` ya aplicaba esta matriz (DEC31).
- `docs/conformidad.md`: B-53 pasa de endurecimiento a enforzado.
- `docs/especificacion.md`, `perfil/opd-opforja.md` (AP-30), `AGENTS.md` y `HANDOFF.md` citan la 2.3.0.
- DEC50 sustituye a DEC44.
