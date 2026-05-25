# Ronda Codex v2 — cierre de la Auditoría Codex v1.0 ↔ Implementación

**Fecha**: 2026-05-25 · **Base commit**: `92372a3` (app = `4857b5a`) · **Rama base**: `main`

**Objetivo**: ejecutar las ~28 desviaciones de la *Auditoría Codex v1.0 rev2* (`/home/felix/_TEMP_BORRAR/OpForja_diff.pdf`) hasta cerrar la fidelidad Codex a ≥95%. Seis líneas paralelas con mínimo solape de archivos, orden de merge en dos olas.

## Filosofía operativa

- **No reinventar**: los componentes nativos `ui/codex/` ya existen y mayormente cumplen; el trabajo es *re-pielar* lo heredado y *cablear* lo desconectado, no crear de nuevo. Revisar `opm-extracted/` y los assets antes de inventar.
- **La auditoría es el contrato**: cada cambio cierra una desviación con ID en el PDF rev2 (§05 matriz). Citar el ID y el `archivo:línea`.
- **Canon manda**: la SSOT suprema de OPM es `docs/canon-opm/reglas-opm-estrictas.md`. Ante duda de OPL/canon, esa SSOT decide (estados=`puede estar`, especialización=`puede ser`).
- **Aditividad y scope estricto**: cada línea toca solo sus archivos permitidos. `App.tsx` tiene **dueño único: L2**.
- **Loop verde obligatorio**: `cd app && bun run check` (typecheck + unit) verde antes de entregar cada línea; `bun run lint` y `bun run build` limpios.

## Reglas duras comunes

1. **Scope por archivo**: respetar la tabla de colisiones. Si una línea necesita tocar un archivo de otra, lo **declara** y lo deja para el dueño o lo coordina vía el orden de merge.
2. **`App.tsx` lo edita SOLO L2.** L4 y L5 que necesiten cambios de montaje los entregan como diff descrito a L2 (L2 los aplica proactivamente; ver briefs).
3. **No tocar** `store/` (slices/runtime) salvo L6 en los dos defaults de ancho declarados; **no tocar** `modelo/` (kernel) salvo L1 en generadores OPL; **no tocar** routing/anchors del canvas (solo apariencia).
4. **Tests dorados**: L1 cambia contrato OPL → debe actualizar generador + parser inverso + fixtures de roundtrip de forma coordinada, en la misma línea.
5. **Evidencia**: cada commit cita el ID de desviación (ej. `C1`, `SEL-2`, `2.3`) y, si es semántico, la regla SSOT.
6. **Idiomas**: docs/commits en es-CL; identificadores y comandos en forma original.
7. **No tocar** `docs/HANDOFF.md` ni `docs/historias-usuario-v2/` desde las líneas.
8. **Aislamiento**: cada línea corre en su worktree; merge a `main` con gate verde, en el orden declarado.

## Stack y comandos

```bash
cd app
bun run check      # typecheck + unit — gate mínimo
bun run lint
bun run build
bunx playwright test e2e/<spec>   # smoke puntual si aplica
```

## Visión general de las 6 líneas

| ID | Título | Desviaciones que cierra | Riesgo | Dominio / archivo eje | Ola |
|----|--------|--------------------------|--------|------------------------|-----|
| **L1** | Canon OPL | C1 (puede estar), G2 (split clasificación), 1.3 ya en L3 | Medio (tests dorados) | `opl/generadores/`, `opl/parser/` | 1 |
| **L2** | Chrome shell (top-bar + frame + footer) | CRÍT-Footer, wordmark dup, botones-caja, breadcrumb, tree-header, footer→diagnóstico | **Alto (hub App.tsx)** | `ui/toolbar/`, `ui/codex/CodexFrame.tsx`, `App.tsx` | 1 |
| **L3** | Inspector ficha continua | C9 (tabs→ficha), contadores vacío, `o-11`→`o.11` | Medio | `ui/InspectorEntidad.tsx`, `ui/inspector/` | 1 |
| **L6** | Tokens · color · layout · filtro OPL | pesos 500/600, colores legacy, sombras/radius, anchos 210/360, chip filtro OPL | Medio (muchos archivos chicos) | `ui/tokens.ts`, misc | 1 |
| **L4** | Canvas selección · una voz | SEL-1 (underline single), SEL-2 (handles), multi-select dual voice | Alto | `render/jointjs/`, `ui/codex/CodexSelectionAnnotation.tsx` | 2 |
| **L5** | Comandos · palette único | hamburguesa→trigger palette, ⌘1-9, atajos plataforma | Alto | `ui/MenuPrincipal.tsx`, `ui/CommandPalette.tsx` | 2 |

## Mapa de archivos (tabla de colisiones)

| Archivo | L1 | L2 | L3 | L4 | L5 | L6 |
|---------|----|----|----|----|----|----|
| `opl/generadores/*`, `opl/parser/*`, `opl/fixtures-roundtrip.ts` | **EDIT** | — | — | — | — | — |
| `ui/toolbar/*` (ToolbarBase, toolbarStyles, css) | — | **EDIT** | — | — | lectura | — |
| `ui/codex/CodexFrame.tsx`, `CodexFooterKey.tsx`, `CodexColHeader.tsx` | — | **EDIT** | — | — | — | — |
| `ui/Breadcrumb.tsx` | — | **EDIT** (cablear) | — | — | — | — |
| `ui/App.tsx` | — | **EDIT (único)** | lectura | lectura | lectura | lectura |
| `ui/InspectorEntidad.tsx`, `InspectorEnlace.tsx`, `ui/inspector/*`, `inspectorStyles.ts`, `Inspector.tsx` | — | — | **EDIT** | — | — | — |
| `render/jointjs/proyeccion.ts`, `composers/entidad.ts`, `composers/halos.ts` | — | — | — | **EDIT** | — | — |
| `ui/codex/CodexSelectionAnnotation.tsx`, `CodexCanvasMount.tsx`, `ui/BarraHerramientasElemento.tsx` | — | — | — | **EDIT** | — | — |
| `ui/MenuPrincipal.tsx`, `ui/CommandPalette.tsx`, `app/ports/globalShortcutsPort.ts`, `ui/atajosTeclado.ts` | — | lectura | — | — | **EDIT** | — |
| `ui/tokens.ts`, `index.html`, `store/runtime.ts`(2 defaults), `ui/divisorPanel.tsx` | — | — | — | — | — | **EDIT** |
| `RenombradoInline.tsx`, `TablaEnlaces.tsx`, `Timeline.tsx`, `render/jointjs/mapa/proyeccion.ts`, `MenuContextual*.tsx`, `PanelDiagnostico.tsx`, `panelOpl/Toolbar.tsx` | — | — | — | — | — | **EDIT** |

Sin celdas en conflicto: cada archivo tiene un único dueño `EDIT`. `App.tsx` = L2 exclusivo.

## Protocolo de conciliación (orden de merge)

**Ola 1 (paralela, dominios disjuntos):** `L1`, `L2`, `L3`, `L6`.
- `L1` (opl/), `L3` (Inspector*), `L6` (tokens + misc) son disjuntos de `L2` (chrome/App.tsx) y entre sí → merge en cualquier orden.
- **`L2` debe mergear primero** dentro de la ola por ser el contrato del shell (App.tsx). Luego `L1`/`L3`/`L6` (rebase trivial, no tocan App.tsx).

**Ola 2 (tras L2 en main):** `L4`, `L5`.
- Ambas dependen de cambios de montaje en `App.tsx` que L2 dejó hechos (L2 retira el mount de `BarraHerramientasElemento` para L4 y el de `MenuPrincipal` lateral para L5). Rebasan sobre `main` post-L2.

Rationale: L2 define el esqueleto; el resto cuelga de él sin tocarlo.

## Anclaje a la auditoría y SSOT

- Fuente de desviaciones: **`/home/felix/_TEMP_BORRAR/OpForja_diff.pdf`** (rev2, §05 matriz). Cada línea cita los IDs que cierra.
- SSOT canon OPM: **`docs/canon-opm/reglas-opm-estrictas.md`** (línea 411 verbo de estado; D1–D4 clasificación).
- Spec de diseño Codex (lado propuesto): **`ui-forja/`** (`01-design-spec.md` … `08-jointjs-styling.md`, `tokens.css`).

## Briefs por línea

| Línea | Brief |
|-------|-------|
| L1 | [linea-1-canon-opl.md](linea-1-canon-opl.md) |
| L2 | [linea-2-chrome-shell.md](linea-2-chrome-shell.md) |
| L3 | [linea-3-inspector-ficha.md](linea-3-inspector-ficha.md) |
| L4 | [linea-4-canvas-seleccion.md](linea-4-canvas-seleccion.md) |
| L5 | [linea-5-comandos-palette.md](linea-5-comandos-palette.md) |
| L6 | [linea-6-tokens-pulido.md](linea-6-tokens-pulido.md) |

## Verificación al cierre de la ronda

- `cd app && bun run check` verde (≥1673 unit, sin regresión).
- `bun run lint` + `bun run build` limpios.
- Smoke browser de las specs tocadas (03 OPL, 04 árbol, 05 contextual, 15 superficie).
- Re-correr la auditoría in-vivo y confirmar que las desviaciones cerradas pasan a CUMPLE.
