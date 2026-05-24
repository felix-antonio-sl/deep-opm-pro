# Ronda Codex v1 — Cierre de cumplimiento `ui-forja` v1.0

**Fecha:** 2026-05-25
**Base commit:** `22b30bf` (`style(ui): CodexTreeRow — fila tipográfica pura del árbol OPD`)
**Objetivo:** cerrar la brecha entre la implementación actual y la spec de diseño
`ui-forja/` (Codex v1.0), repartida en **5 líneas paralelas** de re-piel de chrome
+ una tanda de micro-fidelidad de fundaciones. Todo es **chrome/tokens/attrs
visuales**: no se toca store, modelo, proyección semántica, routing OPCloud,
anchors, multiplicidad, parser/generador OPL ni persistencia.

---

## 1. Filosofía operativa

- **No reinventar.** La spec ya existe en `ui-forja/` (8 docs + `tokens.css` +
  `scenes/`). Cada línea implementa lo que la spec declara, citándola.
- **La página es la interfaz** (`ui-forja/README §10`): tipografía antes que UI,
  hairlines no shadows, cero iconos vectoriales (solo glifos Unicode), canon OPM
  manda en el canvas, marginalia como herramienta semántica.
- **Frontera dura chrome ↔ canvas** (`ui-forja/README §0`): el chrome es
  HTML/CSS (responsabilidad total de Codex); el canvas es JointJS y Codex solo
  fija **attrs visuales** (colores, strokes, fills, fuentes, markers). Ninguna
  línea cruza a lógica de render (routing/anchors/proyección semántica).
- **Aditividad y reuso.** Reciclar lo existente (`RenderToken.tsx` ya tiene la
  tipografía OPL acoplada; `tokens.ts`/`glifos.ts` ya están completos) y el
  corpus `opm-extracted/` antes de crear de novo.
- **Loop verde obligatorio** en cada línea antes de cerrar.

---

## 2. Reglas duras comunes (no negociables)

- **Tokens = fuente única.** Solo la tanda de micro-fidelidad escribe
  `app/src/ui/tokens.ts`. Las demás líneas lo **leen**. Cero hex/fuente/espaciado
  hard-coded en chrome fuera de `tokens`.
- **Glifos vía `glifos.ts`** (L6, ya mergeado): se **importan**, no se redefinen.
  Cero iconos vectoriales nuevos.
- **Canon V-63/V-203 en el canvas.** Objeto verde `#3a6b4d`, proceso azul
  `#26467a`, estado oliva `#7e8338` + fill `#ece9e1`, enlaces tinta `#171511`.
  Crimson `#8e2a2e` es canal UI exclusivo (V-203) — nunca semántica OPM.
- **NO tocar**: `store/**`, `modelo/**`, `opl/parser/**`, `opl/generadores/**`
  (salvo lectura), `proyeccion.ts`, `opcloudRouting.ts`, `mapa/**`, anchors,
  multiplicidad, persistencia, leyes, ViewModels de datos. Si una línea cree
  necesitarlo, **cruzó a lógica → detente y reporta**.
- **NO reincorporar Mapa del sistema ni Biblioteca dock** (pausados por producto;
  su lógica queda dormida). No aparecen en shell/menú/toolbar/palette/atajos.
- **testIds y roles ARIA inmutables.** Solo cambia la piel. Si un test asserta
  estilo Bauhaus concreto, se actualiza al valor Codex; los selectores no.
- **Evidencia y citas.** Cada decisión visual cita `ui-forja/<doc>§<n>`; cada
  decisión semántica cita la SSOT (`/home/felix/kora/artifacts/knowledge/fxsl/
  opm/opm-ssot-es/`). Cada brief recicla al menos un recurso de `opm-extracted/`.
- **Idiomas:** documentos en es-CL; identificadores y comandos en forma original.
- **Out of scope (deuda v1.1 declarada por `ui-forja/README §7`):** proceso
  activo in-flight (V-132), pin de estado current, asistente SD wizard,
  sub-modelos (§10), switcher de lengua OPL, dark mode. **No** se abren en esta
  ronda.

---

## 3. Stack y comandos

```bash
cd app
bun run dev              # Vite + HMR en localhost:5173
bun run check            # typecheck + unit — GATE mínimo antes de commit
bun run lint             # eslint src/
bun run build            # build producción
bun run browser:smoke    # smoke Playwright — SOLO con dev server apagado (flakes canvas 02/05)
```

---

## 4. Las 5 líneas

| ID | Título | Cierra | HU eje | Tamaño | Riesgo | Dominio nuevo |
|----|--------|--------|--------|--------|--------|---------------|
| **L1** | OPL canónico (contrato) | helpers `OplObj/Proc/State` + `CodexOPLNote` + marginalia de validación | EPICA-50, HU-SHARED-007 | medio | medio | `ui/codex/oplTipografia.tsx`, `ui/codex/CodexOplNote.tsx` |
| **L2** | Inspector canónico | `CodexInspectSection/Field/Inline` + `CodexStateRow` | EPICA-13, HU-SHARED-009 | medio | medio | `ui/codex/CodexInspect*.tsx`, `CodexStateRow.tsx` |
| **L3** | Diálogos Codex (cierra L5 scope) | `Dialogo.tsx` base + 15 modales | HU-SHARED-003/004/005 | medio-alto | medio | — (re-piel de existentes) |
| **L4** | Selección emergente + canvas chrome + mobile | `CodexSelectionAnnotation` + header CanvasMount + `ModoRevisionMobile` | HU-SHARED-008 | medio | medio | `ui/codex/CodexSelectionAnnotation.tsx` |
| **L5** | Fidelidad JointJS (solo attrs) | index labels `o.01/p.01/s.01` + highlighter underline + markers | EPICA-14 | medio | medio-alto | — (attrs en composers) |

Cierre adicional fuera de líneas: **micro-fidelidad de fundaciones** (§7).

---

## 5. Mapa de archivos por línea (tabla de colisiones)

Celdas: `EDIT` = dueño edita · `NUEVO` = crea archivo · `lectura` = solo lee · `—` = no toca.

| Archivo / zona | L1 | L2 | L3 | L4 | L5 | micro |
|---|---|---|---|---|---|---|
| `app/src/ui/tokens.ts` | lectura | lectura | lectura | lectura | lectura | **EDIT** |
| `app/src/ui/codex/glifos.ts` | lectura | lectura | lectura | lectura | lectura | lectura |
| `app/src/ui/codex/oplTipografia.tsx` | **NUEVO** | lectura | lectura | — | — | — |
| `app/src/ui/codex/CodexOplNote.tsx` | **NUEVO** | — | — | — | — | — |
| `app/src/ui/panelOpl/**`, `PanelOpl.tsx` | **EDIT** | — | — | — | — | — |
| `app/src/ui/codex/CodexInspect*.tsx`, `CodexStateRow.tsx` | — | **NUEVO** | — | — | — | — |
| `app/src/ui/inspector/**`, `Inspector.tsx` | — | **EDIT** | — | — | — | — |
| `app/src/ui/Dialogo*.tsx`, `Modal*.tsx` | — | — | **EDIT** | — | — | — |
| `app/src/ui/codex/CodexSelectionAnnotation.tsx` | — | — | — | **NUEVO** | — | — |
| `app/src/ui/codex/CodexCanvasMount.tsx` | — | — | — | **EDIT** | — | — |
| `app/src/ui/ModoRevisionMobile.tsx` | — | — | — | **EDIT** | — | — |
| `app/src/render/jointjs/composers/**`, `constantes.codex.ts` | — | — | — | — | **EDIT** | — |
| `app/src/ui/CommandPalette.tsx`, `codex/CodexFooterKey.tsx`, `atajosTeclado.ts` | — | — | — | — | — | **EDIT** |

**Colisión cero a nivel de archivo.** El único acoplamiento es de **contrato**:
L2 y L3 importan los helpers `OplObj/OplProc/OplState` que crea L1 (lectura), por
eso L1 mergea primero. `App.tsx` y `CodexFrame.tsx` **no se editan**: L4 monta su
overlay vía portal sobre el `canvas-pane` (ver brief L4 §5).

---

## 6. Protocolo de conciliación (orden de merge)

```
Ola A:   L1                       (contrato tipográfico OPL — primero)
Ola B:   L2 ∥ L3 ∥ L4 ∥ L5        (dominios de archivo disjuntos, en paralelo)
Ola C:   micro-fidelidad          (toca contratos tokens/L2/L6 — cierra)
```

**Orden de merge:** `L1 → {L2, L3, L4, L5} → micro-fidelidad`.

Rationale: L1 fija el helper tipográfico que L2 (inspector) y L3 (diálogos)
consumen para mostrar nombres OPM — primero. L2/L3/L4/L5 viven en directorios
disjuntos (inspector / diálogos / overlay+mobile / render) y no comparten
archivo: paralelizables entre sí. La micro-fidelidad toca archivos-contrato
(`tokens.ts`, `CommandPalette.tsx`, `CodexFooterKey.tsx`) y entra al final en un
commit único para no romper la regla "solo una línea toca firmas compartidas".

---

## 7. Micro-fidelidad de fundaciones (commit único, fuera de líneas)

Fixes pequeños que tocan archivos-contrato; los aplica un solo dueño tras la Ola B:

- **`tokens.ts`**: `typography.ls.tight` y `.body` están en `"0"`; la spec
  (`01-design-spec §5`) pide `tight: -0.01em`, `body: -0.005em`. Aplicar.
- **`atajosTeclado.ts`**: registrar `⌘.` / `Ctrl+.` → toggle de la marginalia OPL
  (`05-interactions §1`). Hoy no está en el registro global.
- **`CommandPalette.tsx`**: backdrop paper 80% + blur 2px y hairlines dotted del
  grid 2-col (`02-components §8`).
- **`CodexFooterKey.tsx`**: corregir props a `{ k, label, color }` y color por
  tipo (O→verde, P→azul, S→oliva) (`02-components §13`).

---

## 8. Anclaje obligatorio a HU y SSOT

- HU vivas en `docs/historias-usuario-v2/epicas/` y `docs/historias-usuario-v2/shared/`.
- SSOT OPM: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`
  (`opm-visual-es.md`, `opm-opl-es.md`, `opm-iso-19450-es.md`).
- Spec de diseño: `ui-forja/` (autoridad visual; ante conflicto con SSOT, manda
  la SSOT — `ui-forja/README §9`).
- Corpus reusable: `opm-extracted/` (revisar `INDEX.md`/`MODULES.md` antes de
  crear de novo).

---

## 9. Briefs por línea

| Línea | Brief |
|-------|-------|
| L1 | [linea-1-opl-canonico.md](linea-1-opl-canonico.md) |
| L2 | [linea-2-inspector-canonico.md](linea-2-inspector-canonico.md) |
| L3 | [linea-3-dialogos-codex.md](linea-3-dialogos-codex.md) |
| L4 | [linea-4-seleccion-mobile.md](linea-4-seleccion-mobile.md) |
| L5 | [linea-5-fidelidad-canvas.md](linea-5-fidelidad-canvas.md) |
| asignación | [prompt-asignacion.md](prompt-asignacion.md) |

---

## 10. Verificación al cierre de la ronda

Por línea y al cerrar la ronda:

- `cd app && bun run check` verde (baseline: 1629 unit / 5898 expect tras L1
  Slice 1; cada línea suma sus unit tests sin romper los existentes).
- `bun run lint` limpio.
- `bun run build` verde; sin chunk `feature-mapa` (mapa pausado).
- Smoke focalizado por línea (dev server apagado): la línea cita sus specs e2e.
- Diff visual contra `ui-forja/screenshots/*` a 909×540 cuando aplique
  (`ui-forja/README §6.3`).
- **Regla "no tocar HANDOFF" cumplida**: la consolidación del corte la hace el
  operador al cierre de la ronda, no las líneas.
