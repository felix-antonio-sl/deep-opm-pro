# Ronda 15 — Pre-Beta1 hardening visual e interacción

**Fecha**: 2026-05-07
**Base**: `main` @ `d02489d` (`docs(roadmap): actualiza estado beta0 post-polish`)
**Objetivo**: resolver dos bloqueantes de estabilidad antes de abrir Beta1: causa raíz de `Dialogo` que produjo 3 reverts, y overflow de Toolbar mediante menú manual `⋯ Más`.

## 1. Filosofía Operativa

Beta1 no debe arrancar sobre una UI que obliga a reverts para mantener smokes verdes. Esta ronda no agrega capacidades de dominio; estabiliza la superficie donde se modelará el dominio real.

Tesis nueva:

- El bug de `Dialogo` es más fundamental que los tres síntomas revertidos (`modal-grid`, `mask-image` de scroll, `canvas role`).
- El overflow de Toolbar es decisión de producto, no un detector automático de anchura. Se hace manual y estable: ~25 controles visibles, el resto a `⋯ Más`.
- OPCloud/opm-extracted es referencia de patrones y affordances, pero no se clona su Angular/Rappid.

## 2. Reglas Duras Comunes

- No tocar semántica OPM, parser OPL, store kernel ni serializadores.
- Revisar primero `docs/HANDOFF.md`, `docs/roadmap/cortes-operativos.md`, `docs/auditorias/2026-05-07-auditoria-ifml.md`, `docs/auditorias/2026-05-07-refactor-radical-steipete.md`.
- Antes de inventar UI, revisar `opm-extracted/src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts`, `opm-extracted/src/app/rappid-components/rappid-toolbar/` y `docs/JOYAS.md`.
- Cada línea debe cerrar con `cd app && bun run check`, `bun run lint`, `bun run build`, `bun run browser:smoke`.
- Si un fix obliga a revertir otra mejora, parar y reportar; no hacer cuarto revert silencioso.
- No tocar `docs/historias-usuario-v2/`. Esta ronda opera sobre cortes, no sobre HU canónicas.

## 3. Visión General

| Línea | Título | Cierra | Riesgo | Dominio |
|---|---|---|---|---|
| L1 | `Dialogo` root-cause + reintroducción controlada de mejoras revertidas | D.1/C.3/A.2 del informe visual, más IFML H-1 como contexto | medio | modal/render/browser CSS |
| L2 | Toolbar overflow manual `⋯ Más` | C.1/C.2: 38 controles → ~25 visibles | medio | chrome principal |

## 4. Mapa De Archivos

| Archivo | L1 Dialogo | L2 Toolbar |
|---|---|---|
| `app/src/ui/Dialogo.tsx` | EDIT focal | lectura |
| `app/src/ui/App.tsx` | lectura / test harness si hace falta | lectura |
| `app/src/render/jointjs/JointCanvas.tsx` | EDIT solo si se reintroduce rol accesible | — |
| `app/src/ui/DialogoCargarModelo.tsx` | lectura/smoke repro | — |
| `app/src/ui/DialogoPlantillas.tsx` | lectura/smoke repro | — |
| `app/src/ui/CapturadorBugs.tsx` | lectura/smoke repro | — |
| `app/src/ui/toolbar/ToolbarBase.tsx` | — | EDIT |
| `app/src/ui/toolbar/ToolbarCreacion.tsx` | — | EDIT |
| `app/src/ui/toolbar/ToolbarSeleccion.tsx` | — | EDIT |
| `app/src/ui/toolbar/ToolbarMultiseleccion.tsx` | — | EDIT |
| `app/src/ui/toolbar/ToolbarMas.tsx` | — | NUEVO |
| `app/src/ui/toolbar/toolbarStyles.ts` | lectura | EDIT |
| `app/e2e/11-dialogo-layout-regression.spec.ts` | NUEVO | — |
| `app/e2e/12-toolbar-overflow.spec.ts` | — | NUEVO |

## 5. Protocolo De Conciliación

Orden de merge: **L1 → L2 → consolidación**.

Rationale: L1 estabiliza el sustrato modal y puede afectar pruebas visuales globales. L2 trabaja sobre Toolbar y debe correr smokes contra la base visual ya estable.

## 6. Anclaje A Evidencia

- Reverts vivos: `789eb0e`, `816e7bf`, `73f46ce`.
- IFML: `docs/auditorias/2026-05-07-auditoria-ifml.md`, especialmente H-1 y O-1.
- Steipete: `docs/auditorias/2026-05-07-refactor-radical-steipete.md` T2.1 opción C; se reinterpreta como menú manual, no overflow automático.
- OPCloud: `opm-extracted/src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts` y `opm-extracted/src/app/rappid-components/rappid-toolbar/rappid-toolbar.component.ts`.

## 7. Verificación Esperada

- `bun run check`: sin regresión.
- `bun run lint`: sin excepciones nuevas.
- `bun run build`: verde; bundle puede variar levemente pero no debe crecer >2 kB sin justificar.
- `bun run browser:smoke`: 109+ passed o baseline actualizado con explicación.
- Nuevos smokes focales:
  - dialogos pintan sobre `main display:grid` + canvas SVG/composite layer;
  - Toolbar muestra ~25 controles visibles y `⋯ Más` contiene secundarios accesibles.

## 8. Entregable De Consolidación

- Commits atómicos por línea.
- Si L1 logra reintroducir alguna mejora revertida, commit separado por mejora (`modal-grid`, `scroll affordance`, `canvas role`) y smoke dedicado.
- Si L2 mueve controles a `⋯ Más`, documentar lista visible vs overflow.
- Actualizar `docs/HANDOFF.md` al cierre, reemplazando la sección de pendientes pre-Beta1.
