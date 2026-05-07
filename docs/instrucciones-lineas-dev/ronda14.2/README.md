# Ronda 14.2 — Leyes ejecutables + ledger de calidad

**Fecha**: 2026-05-07
**Base**: `main` @ `3303a97` (`chore(detector): recalibra refinamiento Thing tras ronda 14.1`) o posterior.
**Objetivo**: convertir la auditoria categorial `docs/roadmap/auditoria-categorial-app.md` en contratos ejecutables antes de Beta1. Esta ronda cierra F6/F7/F8 de la auditoria: leyes de proyeccion, OPL reverse como lente parcial segura y ledger de calidad. No introduce features de dominio.

## Filosofia Operativa

- **Leyes antes que nuevas superficies**: si JSON, render, OPL reverse, refinamiento y undo no tienen pruebas de preservacion, Beta1 se apoya en intuicion.
- **Detector como indicador secundario**: `progress-dashboard.mjs` sigue existiendo, pero la verdad operativa pasa a tests law nombrados.
- **SSOT antes que OPCloud**: OPM/ISO 19450 gobierna las leyes; OPCloud aporta evidencia de slots/refinement y checkers, no reemplaza la semantica.
- **Sin big-bang**: solo tests, ledger y correcciones puntuales si una ley revela una falla real.

## Reglas Duras Comunes

- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/**`.
- No migrar `Entidad.refinamiento` a slots separados; ronda 14.1 lo dejó como schema vNext.
- No reabrir UI de OPL reverse salvo que una ley demuestre bug de seguridad semantica.
- No cambiar comportamiento observable para satisfacer una prueba mal formulada; primero corregir la ley.
- Cada linea debe citar:
  - `docs/roadmap/auditoria-categorial-app.md`.
  - SSOT OPM: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
  - ICAS: `urn:fxsl:kb:icas-preservacion`, `urn:fxsl:kb:icas-comparacion`, `urn:fxsl:kb:icas-efectos`, `urn:fxsl:kb:icas-calidad-riesgo`.
  - `opm-extracted/` relevante al slice.
- Loop verde obligatorio:
  - `cd app && bun run check`
  - `cd app && bun run lint`
  - `cd app && bun run build`
  - `cd app && bun run browser:smoke`
  - `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`

## Stack Y Comandos

```bash
cd app && bun run dev
cd app && bun run check
cd app && bun run lint
cd app && bun run build
cd app && bun run browser:smoke
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

## Vision General

| Linea | Titulo | Pendiente que cierra | HU eje | Tamano | Riesgo |
|---|---|---|---|---:|---|
| L1 | Leyes JSON/render/refinement | Fase C + cierre matriz Thing | HU-12.003/.007/.027 + HU-SHARED-007 como proyeccion | M | Bajo-medio |
| L2 | Ley OPL reverse safe lens + undo | F6: lente parcial segura institucionalizada | HU-SHARED-007 + HU-SHARED-002 | M | Medio |
| L3 | Quality ledger + trazabilidad law-first | F7/F8: detector secundario + medicion de calidad | capa operativa de producto | S | Bajo |

## Mapa De Archivos

| Archivo | L1 | L2 | L3 |
|---|---|---|---|
| `app/src/leyes/proyecciones.test.ts` | nuevo | lectura | lectura |
| `app/src/leyes/opl-reverse.test.ts` | lectura | nuevo | lectura |
| `app/src/leyes/undo.test.ts` | lectura | nuevo / aditivo | lectura |
| `app/src/serializacion/json.ts` | lectura / fix puntual si ley falla | lectura | lectura |
| `app/src/serializacion/json.test.ts` | lectura | lectura | lectura |
| `app/src/render/jointjs/proyeccion.ts` | lectura / fix puntual si ley falla | lectura | lectura |
| `app/src/render/jointjs/proyeccion.test.ts` | lectura | lectura | lectura |
| `app/src/modelo/operaciones/refinamiento/**` | lectura / fix puntual si ley falla | lectura | lectura |
| `app/src/opl/parser/**` | lectura | lectura / fix puntual si ley falla | lectura |
| `app/src/store.test.ts` | lectura | lectura / aditivo solo si no conviene `app/src/leyes/undo.test.ts` | lectura |
| `app/scripts/quality-ledger.mjs` | — | — | nuevo |
| `docs/roadmap/quality-ledger.md` | — | — | nuevo |
| `docs/roadmap/cortes-operativos.md` | lectura | lectura | lectura |
| `docs/roadmap/auditoria-categorial-app.md` | lectura | lectura | lectura |
| `docs/HANDOFF.md` | prohibido | prohibido | prohibido |
| `docs/historias-usuario-v2/**` | prohibido | prohibido | prohibido |

## Protocolo De Conciliacion

Orden de merge sugerido:

1. **L1**: instala `app/src/leyes/proyecciones.test.ts`; no debe tocar parser/store.
2. **L2**: instala leyes OPL/undo; puede apoyarse en helpers de L1 si ya existen, pero no depende de ellos.
3. **L3**: crea ledger y script de medicion; debe referenciar los nombres reales de tests law ya aterrizados por L1/L2.
4. **Consolidacion operador**: dashboard, HANDOFF y cortes si el operador lo pide. Las lineas no tocan HANDOFF.

Rationale: primero se fijan las leyes que definen calidad semantica; luego se publica el ledger que las mide.

## Anclaje Obligatorio A HU Y SSOT

- `HU-SHARED-007`: OPL como lente textual sincronizada, con reverse seguro y no destructivo.
- `HU-SHARED-002`: cambios aplicados desde OPL entran como una unidad undoable.
- `HU-12.003/.007/.027`: crear, preservar y retirar refinamientos sin referencias huerfanas.
- SSOT visual: V-65 dualidad OPD-OPL, V-69 contorno de refinamiento, V-79/V-85 internos/externos, V-95/V-98 invariantes de refinamiento, V-100 aciclicidad.
- SSOT OPL: plantillas CX1/CX3/CX4 y regla de identidad persistente de OPD; las etiquetas `SD*` son humanas, no identidad.
- ICAS: preservacion/functorialidad (`urn:fxsl:kb:icas-preservacion`), naturalidad de refactor/proyeccion (`urn:fxsl:kb:icas-comparacion`), efectos explicitos y bisimulacion (`urn:fxsl:kb:icas-efectos`), calidad como medicion versionada (`urn:fxsl:kb:icas-calidad-riesgo`).

## Brief Por Linea

| Linea | Brief |
|---|---|
| L1 | [`linea-1-leyes-proyeccion.md`](linea-1-leyes-proyeccion.md) |
| L2 | [`linea-2-opl-safe-lens-undo.md`](linea-2-opl-safe-lens-undo.md) |
| L3 | [`linea-3-quality-ledger.md`](linea-3-quality-ledger.md) |

## Verificacion Al Cierre

Metricas esperadas:

- Unit tests: +15 a +30 tests law.
- Smoke browser: 106+ sin regresion.
- Dashboard: MVP-alpha 100%, 102/102 reglas matched o superior.
- `docs/roadmap/quality-ledger.md` creado con baseline de calidad y umbrales.
- Build: sin crecimiento significativo (< +1 kB gzip).
- Worktree limpio al cierre.
