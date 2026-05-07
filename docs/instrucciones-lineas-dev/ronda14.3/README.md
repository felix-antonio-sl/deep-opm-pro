# Ronda 14.3 — Fronteras Store/Render/Effects

**Fecha**: 2026-05-07
**Base**: `main` post-ronda 14.2. Puede arrancar exploracion en paralelo desde `3303a97`, pero **no mergear** hasta que 14.2 cierre leyes y ledger.
**Objetivo**: bajar deuda arquitectonica F3/F4/F5 de `docs/roadmap/auditoria-categorial-app.md` sin big-bang: contratos de slices reales en store, efectos runtime explicitos y proyeccion JointJS pura por argumentos.

## Filosofia Operativa

- **Refactor como naturalidad**: el comportamiento observable no cambia; los mismos llamados deben producir el mismo modelo/render antes y despues.
- **Efectos explicitos**: localStorage/autosave/confirm/global UI no deben vivir como dependencias invisibles del core.
- **Tipos primero**: factorizar contratos antes que mover archivos masivamente.
- **Compatibilidad temporal aceptada**: wrappers legacy quedan si reducen blast radius, pero el core nuevo debe ser testeable sin globals.

## Reglas Duras Comunes

- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/**`.
- No cambiar UX ni features; solo fronteras y contratos.
- No reabrir parser OPL ni leyes 14.2 salvo lectura.
- No mover todos los slices a carpetas nuevas por estetica.
- Todo cambio con tests de equivalencia o comportamiento preservado.
- Reuso obligatorio:
  - `docs/roadmap/auditoria-categorial-app.md` F3/F4/F5;
  - ICAS `urn:fxsl:kb:icas-comparacion` y `urn:fxsl:kb:icas-efectos`;
  - `opm-extracted/` solo como referencia de separacion operacional, no arquitectura a copiar.
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
| L1 | Store slice contracts | F3: `Partial<OpmStore>` oculta dependencias reales | calidad arquitectonica pre-Beta1 | M | Medio |
| L2 | Runtime effects + render pure options | F4/F5: efectos implicitos y `globalThis` en proyeccion | calidad arquitectonica pre-Beta1 | M | Medio |

## Mapa De Archivos

| Archivo | L1 | L2 |
|---|---|---|
| `app/src/store/tipos.ts` | edit aditivo | lectura |
| `app/src/store/slices.ts` o `app/src/store/sliceTypes.ts` | nuevo | lectura |
| `app/src/store/*.ts` slices | edit minimo de tipos si necesario | lectura |
| `app/src/store/runtime.ts` | lectura | edit aditivo |
| `app/src/store/runtimeEffects.ts` | lectura | nuevo |
| `app/src/store/runtime.test.ts` | lectura | aditivo |
| `app/src/render/jointjs/proyeccion.ts` | lectura | edit aditivo |
| `app/src/render/jointjs/proyeccionOpciones.ts` | lectura | nuevo opcional |
| `app/src/render/jointjs/proyeccion.test.ts` | lectura | aditivo |
| `app/src/render/jointjs/JointCanvas.tsx` | lectura | edit puntual si debe pasar opciones explicitas |
| `app/src/leyes/*.test.ts` | lectura | lectura |
| `docs/HANDOFF.md` | prohibido | prohibido |
| `docs/historias-usuario-v2/**` | prohibido | prohibido |

## Protocolo De Conciliacion

Orden de merge sugerido:

1. **L1**: tipos de slices reales sin cambiar runtime.
2. **L2**: runtime effects/render options, consumiendo contratos ya definidos si conviene.
3. **Consolidacion operador**: recalibrar dashboard si cambian paths de evidencia y actualizar HANDOFF si corresponde.

Rationale: los tipos de store definen la frontera; los efectos la usan. Si L2 no necesita L1, puede mergear antes, pero solo si no toca `store/tipos.ts`.

## Anclaje Obligatorio A HU Y SSOT

Esta ronda no cierra HU funcional nueva. Es corte de arquitectura de producto antes de Beta1. Sus invariantes se miden por:

- leyes 14.2 preservadas;
- MVP-alpha 100% preservado;
- smoke completo verde;
- ausencia de drift semantico en OPM/OPL.

ICAS:

- `urn:fxsl:kb:icas-comparacion`: refactor como transformacion natural; conmutan llamadas antes/despues.
- `urn:fxsl:kb:icas-efectos`: efectos explicitos componen mejor que globals/singletons.

## Brief Por Linea

| Linea | Brief |
|---|---|
| L1 | [`linea-1-store-slice-contracts.md`](linea-1-store-slice-contracts.md) |
| L2 | [`linea-2-runtime-render-effects.md`](linea-2-runtime-render-effects.md) |

## Verificacion Al Cierre

Metricas esperadas:

- `Partial<OpmStore>` eliminado de aliases `ModeloSlice`, `SeleccionSlice`, etc.
- `proyectarModeloAJointCells` testeable con opciones explicitas sin contaminacion global.
- Runtime effects encapsulados en interfaz/adaptador.
- Unit tests: +10 a +25.
- Smoke browser: 106+ o baseline post-14.2 sin regresion.
- Build: sin crecimiento significativo.
- Worktree limpio al cierre.
