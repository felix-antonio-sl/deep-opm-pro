# _raw — chunks OPM-core decompilados originales (auditoría)

Esta carpeta conserva los **14 chunks lazy-loaded** de OPCloud que contienen
exclusivamente código `./src/app/...` (cero código de bibliotecas npm). Se
guardan tal cual los emitió `webcrack` — sin renombrar, sin refactorizar — para:

1. **Auditar la procedencia** de cada archivo en `../src/`. Si una clase
   parece sospechosa o el refactor automatizado introdujo un cambio
   cuestionable, aquí está el original byte-a-byte.
2. **Permitir re-extracción** si las heurísticas del pipeline cambian, sin
   tener que regenerar `decompiled/` completo (regenerable con `bash setup.sh`
   pero descarga 42 MB y corre `webcrack`).
3. **Identificar casos límite**: paths que webcrack no separó por completo
   (clases anidadas en chunks grandes, módulos que se concatenaron en uno solo).

## Inventario

| Chunk | Tamaño | Path principal | Clases destacadas |
|---|---:|---|---|
| `1185.js` | 33 K | `configuration/rappidEnviromentFunctionality/inspector/opmStyle.ts` | paleta de colores canónicos, fontWeights |
| `14898.js` | 11 K | `models/components/commands/state-decider.ts` | AddStateCommand, SetStateTimeDurationCommand |
| `26692.js` | 13 K | `models/modules/attribute-validation/` | BooleanRange, NumericRange, StringRange, AttributeValue |
| `29007.js` | 16 K | `models/LogicalPart/OpmLogicalThing.ts` | OpmLogicalThing, StereotypeModule, SimulationModule |
| `2839.js` | 21 K | `models/LogicalPart/OpmLogicalObject.ts` | OpmLogicalObject, computation-module, units-text-module |
| `3037.js` | 15 K | `models/VisualPart/OpmVisualProcess.ts` | OpmVisualProcess, set-process-time-duration |
| `43894.js` | 11 K | `models/LogicalPart/OpmLogicalEntity.ts` | OpmLogicalEntity, LogicalTextModule |
| `54695.js` | 63 K | `models/VisualPart/OpmVisualThing.ts` | OpmVisualThing, BringConnectedEntitiesAction, bringConnectedRules |
| `68506.js` | 99 K | `models/DrawnPart/OpmObject.ts` | OpmObject, alias.popup, range |
| `71252.js` | 10 K | `models/LogicalPart/OpmLogicalState.ts` | OpmLogicalState, OpmVisualEllipsis |
| `81330.js` | 99 K | `models/DrawnPart/OpmEntity.ts` | OpmEntity, TextBlock, UrlsUtils, ontologyApplier |
| `84072.js` | 68 K | `models/consistency/consistancy.model.ts` | todas las reglas de consistency |
| `86922.js` | 41 K | `models/VisualPart/OpmVisualObject.ts` | OpmVisualObject, add-states, edit-alias, edit-units, suppress |
| `91886.js` | 6 K | `models/DrawnPart/OpmEntityRappid.ts` | OpmEntityRappid, halo-config |

> Estos chunks vienen de **webpack splitChunks** lazy-loaded — sólo se cargan
> cuando la app necesita esa funcionalidad específica. Por eso son módulos
> "puros OPM" sin libs npm mezcladas.

## Lo que NO está acá

- `deobfuscated.js` (46 MB) — concentra los 344 módulos OPM en un solo
  archivo y es el origen primario del split. **Vive en `decompiled/`**, que
  es regenerable con `setup.sh`. Demasiado grande para versionar.
- `37084.js` (25 MB) — chunk principal Angular: 282 OPM + libs npm.
  También en `decompiled/`.
- Los otros ~795 chunks de `decompiled/` — todos son libs npm puras o
  chunks vacíos.

## Regenerar

Si esta carpeta queda inconsistente con `decompiled/`:

```bash
cd /home/felix/projects/deep-opm-pro
cp decompiled/{1185,14898,26692,29007,2839,3037,43894,54695,68506,71252,81330,84072,86922,91886}.js opm-extracted/_raw/
```
