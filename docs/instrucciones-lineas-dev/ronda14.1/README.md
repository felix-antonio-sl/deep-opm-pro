# Ronda 14.1 — Refinamiento OPM completo sobre Thing (hardening)

**Fecha**: 2026-05-07  
**Base**: `main` @ `f20c09a` (`fix refinamiento OPM sobre Thing`) o posterior.  
**Objetivo**: mini-ronda de una sola linea para continuar desde el corte
`refinamiento OPM completo sobre Thing`: revisar la deuda de slots separados
`refineeInzooming` / `refineeUnfolding` / `refineable`, agregar e2e para
object-inzoom y process-unfold, y auditar el OPL especifico de descomposicion de
objeto contra SSOT OPM.

Esta ronda es deliberadamente **N=1**. No se fuerza paralelismo artificial porque
los tres temas comparten el mismo contrato semantico de refinamiento.

## Filosofia Operativa

- **SSOT antes que OPCloud**: OPM/ISO 19450 gobierna la semantica; OPCloud aporta
  evidencia operacional y nombres de slots visuales.
- **No migrar schema por reflejo**: la existencia de
  `refineeInzooming/refineeUnfolding/refineable` en OPCloud no obliga a migrar
  `entidad.refinamiento` si el producto no necesita simultaneidad inzoom+unfold
  en este corte.
- **Endurecer antes de abrir Beta1**: Beta1 requiere descomposicion robusta; esta
  ronda cierra evidencia UI y OPL sobre la matriz `Thing x refinamiento`.
- **Aditividad por defecto**: agregar tests, auditoria y correcciones OPL
  puntuales. No renombrar APIs legacy ni tocar serializacion salvo hallazgo
  bloqueante.

## Reglas Duras Comunes

- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/**`.
- No introducir migracion de JSON ni nuevo schema de entidad sin decision
  explicita del operador.
- No copiar codigo 1:1 desde `opm-extracted/`; usarlo para comprender semantica,
  slots y UX.
- No reabrir OPL reverse alpha-lock. Esta ronda audita OPL forward de
  refinamiento.
- Todo cambio debe citar evidencia concreta:
  - SSOT: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
  - OPCloud extraido: `opm-extracted/`.
  - Codigo local: `app/src/modelo/operaciones/refinamiento/`,
    `app/src/opl/generadores/refinamiento.ts`, `app/e2e/05-refinamiento-y-plegado.spec.ts`.
- Loop verde obligatorio:
  - `cd app && bun run check`
  - `cd app && bun run lint`
  - `cd app && bun run build`
  - `cd app && bun run browser:smoke`

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
| L1 | Refinamiento Thing hardening | Slots audit + e2e object-inzoom/process-unfold + OPL object decomposition | EPICA-12 / EPICA-50 OPL forward refinamiento | S | Bajo-medio |

## Mapa De Archivos

| Archivo | L1 |
|---|---|
| `docs/auditorias/2026-05-07-refinamiento-thing-slots-opl.md` | nuevo |
| `app/e2e/05-refinamiento-y-plegado.spec.ts` | aditivo |
| `app/src/opl/generadores/refinamiento.ts` | lectura / edit puntual si SSOT lo exige |
| `app/src/opl/generadores/refinamiento.test.ts` | aditivo |
| `app/src/opl/generar.test.ts` | aditivo |
| `app/src/modelo/operaciones/refinamiento/*.ts` | lectura |
| `app/src/modelo/operaciones.test.ts` | lectura / aditivo solo si falta evidencia kernel |
| `app/src/modelo/tipos/entidad.ts` | lectura |
| `app/src/serializacion/validarEntidades.ts` | lectura |
| `docs/roadmap/cortes-operativos.md` | ya actualizado por operador/Codex; la linea no lo toca |
| `docs/HANDOFF.md` | prohibido |

## Protocolo De Conciliacion

Orden de commits sugerido:

1. `docs(auditoria): slots refinamiento Thing contra SSOT y opm-extracted`
2. `test(e2e): cubre object-inzoom y process-unfold`
3. `test(opl): fija OPL de descomposicion de objeto contra SSOT`
4. `fix(opl): ajusta descomposicion de objeto` solo si el test revela mismatch.

Rationale: primero se decide si hay deuda real de schema; despues se agrega
evidencia UI; al final se corrige OPL solo si la auditoria lo exige.

## Anclaje Obligatorio A HU Y SSOT

- SSOT visual:
  - `opm-visual-es.md` V-69: contorno grueso aplica a inzooming y unfolding.
  - `opm-visual-es.md` V-79..V-85: contenedor, internos y externos en OPD hijo.
- SSOT OPL:
  - `opm-opl-es.md` gramatica `oracion_de_descomposicion_objeto_en_diagrama`.
  - `opm-opl-es.md` gramatica `oracion_de_descomposicion_objeto_en_nuevo_diagrama`.
- OPCloud:
  - `opm-extracted/src/app/models/VisualPart/OpmVisualThing.ts`: `inzoom(...)`
    fija `refineable` y `refineeInzooming`.
  - `opm-extracted/src/app/models/json.model.ts`: serializa/reconecta
    `refineableId`, `refineeInzoomingId`, `refineeUnfoldingId`.
  - `opm-extracted/src/app/ImportOPX/OPX.API.ts`: reconstruye conexiones entre
    OPDs via refineable/refinee slots.

## Brief Por Linea

| Linea | Brief |
|---|---|
| L1 | [`linea-1-refinamiento-thing-hardening.md`](linea-1-refinamiento-thing-hardening.md) |

## Verificacion Al Cierre

Metricas esperadas:

- Unit tests: +2 a +6.
- Smokes browser: +2 (`object-inzoom`, `process-unfold`).
- Dashboard: sin caida de MVP-alpha 100%.
- Build: sin crecimiento significativo.
- Worktree limpio al cierre.
