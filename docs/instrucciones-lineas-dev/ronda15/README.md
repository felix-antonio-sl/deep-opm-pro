# Ronda 15 — Beta0 hardening fusionado pre-Beta1

**Fecha**: 2026-05-07
**Base**: `main` @ `d636d44` (`docs(ronda15): pre-beta1 dialogo root-cause y toolbar mas`)
**Objetivo**: fusionar la ronda 15 original y la ronda 16 propuesta en un solo tramo Beta0 hardening antes de Beta1: `Dialogo` root-cause, Toolbar `⋯ Más`, IFML + bugs visuales, visual-canvas fidelity y coherencia UX contextual.

## 1. Filosofía Operativa

Beta1 no debe arrancar sobre una UI que obliga a reverts ni sobre un canvas que requiere trabajo manual excesivo para verse profesional. Esta ronda no abre capacidades de dominio nuevas; estabiliza la superficie de modelado diario donde después se probarán HDOS/KORA/GOREOS.

Tesis de ronda:

- El bug de `Dialogo` es más fundamental que los tres síntomas revertidos (`modal-grid`, `mask-image` scroll affordance, `canvas role`).
- El overflow de Toolbar se resuelve por diseño manual (`⋯ Más`), no con medición automática de anchura.
- IFML entra como normalización de flujos y eventos, no como formalismo decorativo.
- Visual-canvas fidelity se calibra contra SSOT + `docs/JOYAS.md` + `opm-extracted/`, no contra gusto local.
- Barra contextual, Inspector, Panel OPL, árbol y futura Tabla de Enlaces deben sentirse como una sola superficie de modelado.

## 2. Reglas Duras Comunes

- No tocar semántica OPM, parser OPL, store kernel ni serializadores salvo autorización explícita del brief.
- No tocar `docs/historias-usuario-v2/`.
- Revisar primero `docs/HANDOFF.md`, `docs/roadmap/cortes-operativos.md`, `docs/auditorias/2026-05-07-auditoria-ifml.md`, `docs/auditorias/2026-05-07-refactor-radical-steipete.md`, `docs/JOYAS.md`.
- Antes de inventar UI/canvas, revisar `assets/`, `opm-extracted/INDEX.md`, `opm-extracted/MODULES.md` y módulos citados por cada línea.
- Cada línea cierra con `cd app && bun run check`, `bun run lint`, `bun run build`, `bun run browser:smoke`.
- Si un fix obliga a revertir otra mejora, parar y reportar; no hacer cuarto revert silencioso.

## 3. Stack Y Comandos

```bash
cd app && bun run check
cd app && bun run lint
cd app && bun run build
cd app && bun run browser:smoke
cd app && bun run scripts/evaluacion-exhaustiva.mjs
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

## 4. Visión General De Líneas

| Línea | Título | Cierra | Riesgo | Dominio |
|---|---|---|---|---|
| L1 | `Dialogo` root-cause + reintroducción controlada de mejoras revertidas | D.1/C.3/A.2 del informe visual + base modal estable | medio | modal/render/browser CSS |
| L2 | Toolbar overflow manual `⋯ Más` | C.1/C.2: ~38 controles -> ~25 visibles | medio | chrome principal |
| L3 | IFML flow cleanup + `evaluacion-exhaustiva` | IFML H-1/H-3/H-4/O-7 acotado + loop de captura visual | medio-alto | flujos, modales, eventos |
| L4 | Visual-canvas fidelity + autolayout sugerido | shapes, enlaces, anclaje, routing, cruces, layout aplicable | alto | render JointJS/canvas |
| L5 | Cierre UX contextual de superficie única | barra contextual + Inspector + Panel OPL + árbol + contrato TablaEnlaces | medio | UX transversal |

## 5. Mapa De Archivos Por Línea

| Archivo | L1 | L2 | L3 | L4 | L5 |
|---|---|---|---|---|---|
| `app/src/ui/Dialogo.tsx` | EDIT | lectura | lectura | — | lectura |
| `app/src/ui/App.tsx` | lectura/test hook | lectura | EDIT | lectura | lectura |
| `app/src/render/jointjs/JointCanvas.tsx` | EDIT solo role/smoke | — | lectura | EDIT | lectura |
| `app/src/ui/toolbar/ToolbarBase.tsx` | — | EDIT | lectura | — | lectura |
| `app/src/ui/toolbar/ToolbarCreacion.tsx` | — | EDIT | — | lectura grid/autolayout | lectura |
| `app/src/ui/toolbar/ToolbarSeleccion.tsx` | — | EDIT | — | — | lectura |
| `app/src/ui/toolbar/ToolbarMultiseleccion.tsx` | — | EDIT | — | — | lectura |
| `app/src/ui/toolbar/ToolbarMas.tsx` | — | NUEVO | — | — | lectura |
| `app/src/ui/toolbar/toolbarStyles.ts` | lectura | EDIT | — | — | lectura |
| `app/src/store/runtime.ts` / slices UI | — | — | EDIT acotado | lectura | lectura |
| `app/src/render/jointjs/**` | — | — | lectura | EDIT | lectura |
| `app/src/canvas/**` | — | — | — | EDIT si layout/routing | lectura |
| `app/src/ui/BarraHerramientasElemento.tsx` | — | lectura | — | — | EDIT |
| `app/src/ui/Inspector*.tsx`, `app/src/ui/inspector/**` | — | — | lectura | lectura | EDIT |
| `app/src/ui/PanelOpl.tsx`, `app/src/ui/panelOpl/**` | — | — | lectura | — | EDIT |
| `app/src/ui/ArbolOpd.tsx`, `app/src/ui/arbol/**` | — | — | lectura | — | EDIT |
| `app/scripts/evaluacion-exhaustiva.mjs` | lectura | — | EDIT/ejecuta | lectura | ejecuta |
| `app/e2e/11-dialogo-layout-regression.spec.ts` | NUEVO | — | lectura | — | — |
| `app/e2e/12-toolbar-overflow.spec.ts` | — | NUEVO | — | — | — |
| `app/e2e/13-ifml-flujos-visuales.spec.ts` | — | — | NUEVO | — | — |
| `app/e2e/14-canvas-fidelity.spec.ts` | — | — | — | NUEVO | — |
| `app/e2e/15-superficie-contextual.spec.ts` | — | — | — | — | NUEVO |

## 6. Protocolo De Conciliación

Orden de merge: **L1 -> L3 -> L2 -> L4 -> L5 -> consolidación**.

Rationale:

- L1 estabiliza el sustrato modal y puede desbloquear reintroducciones.
- L3 normaliza flujos/eventos sobre modales ya estables.
- L2 rebalancea Toolbar sin mezclarlo con IFML sistémico.
- L4 toca render/canvas y debe correr sobre chrome estable.
- L5 cierra coherencia transversal leyendo el estado final de L2/L4.

## 7. Anclaje Obligatorio

- SSOT OPM: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`
- Visual/canvas: `docs/JOYAS.md`, `assets/svg/`, `assets/svg/links/**`, `opm-extracted/src/app/modules/layout/main/main.component.ts`, `opm-extracted/src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts`.
- IFML: `docs/auditorias/2026-05-07-auditoria-ifml.md`.
- Refactor/Toolbar: `docs/auditorias/2026-05-07-refactor-radical-steipete.md`.
- Reverts vivos: `789eb0e`, `816e7bf`, `73f46ce`.

## 8. Briefs

| Línea | Brief |
|---|---|
| L1 | `docs/instrucciones-lineas-dev/ronda15/linea-1-dialogo-root-cause.md` |
| L2 | `docs/instrucciones-lineas-dev/ronda15/linea-2-toolbar-overflow-mas.md` |
| L3 | `docs/instrucciones-lineas-dev/ronda15/linea-3-ifml-evaluacion-visual.md` |
| L4 | `docs/instrucciones-lineas-dev/ronda15/linea-4-visual-canvas-fidelity.md` |
| L5 | `docs/instrucciones-lineas-dev/ronda15/linea-5-superficie-contextual.md` |

## 9. Verificación Esperada Al Cierre

- `bun run check`: verde, sin bajar conteo.
- `bun run lint`: verde.
- `bun run build`: verde; crecimiento bundle > 3 kB requiere explicación.
- `bun run browser:smoke`: verde.
- `evaluacion-exhaustiva.mjs`: reporte sin FAIL bloqueante nuevo.
- Dashboard: alpha 100% preservado; Beta1 aún no se declara abierta.

## 10. Entregable De Consolidación

- Commits atómicos por línea.
- Reescribir `docs/HANDOFF.md` al cierre.
- Actualizar `docs/roadmap/cortes-operativos.md` solo si el resultado cambia gates.
- Declarar explícitamente si Beta1 queda habilitada o si queda una deuda bloqueante.
