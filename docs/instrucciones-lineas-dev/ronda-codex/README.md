# Ronda Codex — Pivot de identidad visual de opforja

**Fecha**: 2026-05-24
**Base commit**: `a4b8abf` (main)
**Objetivo**: Pivot **total** de la identidad visual del modelador desde la estética Bauhaus (Ronda 28) hacia **Codex** — editorial / marginalia / type-led — entregada como handoff de diseño cerrado en `ui-forja/`. Refactor **solo de presentación**: no se toca lógica, modelo, store, proyección ni corrección semántica.

> **Contrato de esta ronda**: el contrato visual es el **handoff Codex** (`ui-forja/01-design-spec.md` … `08-jointjs-styling.md`) + la auditoría SSOT ya hecha en `ui-forja/06-ssot-compliance.md`. Cada línea también declara HU base del backlog vivo para trazabilidad, pero **no reabre ni edita** `docs/historias-usuario-v2/`.

---

## 1. Filosofía operativa

1. **No reinventar.** El handoff Codex YA especifica tokens, componentes, attrs JointJS, glifos y cumplimiento SSOT. Cada línea **implementa** lo especificado; no inventa color, fuente, espaciado ni componente fuera de los tokens.
2. **El contrato es handoff + HU base + SSOT.** Codex define la piel, las HU vivas definen continuidad funcional y la SSOT OPM define semántica. Ante conflicto entre Codex y la SSOT OPM, **manda la SSOT** (regla de oro #1 del proyecto). La auditoría de `06-ssot-compliance.md` ya verificó que Codex no la contradice.
3. **Aditividad sobre presentación, no sobre lógica.** Se reescriben tokens y componentes de chrome y los attrs del canvas. **No** se editan store, modelo, `proyeccion.ts`, ViewModels/selectores, persistencia ni los pipelines OPL.
4. **Modularidad por dominio.** Componentes nuevos Codex viven en `src/ui/codex/`. Archivos disjuntos por línea; ver tabla de colisiones (§6).
5. **Loop verde obligatorio.** Cada línea cierra con `cd app && bun run check` verde antes de entregar. Smoke solo con dev server apagado (flakes en specs canvas 02/05).

---

## 2. Reglas duras comunes (no negociables)

- **NO tocar**: `src/store/**`, `src/modelo/**`, `src/render/jointjs/proyeccion.ts`, `src/render/jointjs/opcloudRouting.ts`, `src/render/jointjs/mapa/proyeccion.ts`, `src/opl/**`, `src/serializacion/**`, `src/persistencia/**`, `src/leyes/**`, ViewModels/puertos (`appShellViewModel.ts`, `inspectorViewModel.ts`, hooks `useZustand*`). Si una línea cree necesitar tocarlos, **se detiene y reporta** — es señal de que cruzó a lógica.
- **Tokens = fuente única.** Solo L1 escribe `src/ui/tokens.ts`. Las demás líneas lo **leen**. Cero hex/fuente/espaciado hard-coded en componentes de chrome fuera de `tokens`.
- **Canon V-63 en el canvas.** Objeto verde `#3a6b4d`, proceso azul `#26467a`, estado oliva `#7e8338` + fill `#ece9e1`, enlaces negro `#171511`. Crimson `#8e2a2e` es canal UI exclusivo (V-203) — nunca semántica OPM.
- **Sin truncamiento silencioso (V-212).** Etiquetas de símbolos: expandir o rechazar resize, nunca `ellipsis`.
- **Verificar insumos antes de crear.** Revisión obligatoria en profundidad de `opm-extracted/` (`INDEX.md`, `MODULES.md`, `assets/`) + `assets/svg|png/` + `docs/JOYAS.md` antes de inventar marcador/shape/glifo. Cada brief declara qué evidencia concreta recicló.
- **Idiomas**: docs es-CL; identificadores y comandos en forma original. Comentarios solo cuando el *por qué* no sea obvio.
- **Commits**: prefijo por capa (`feat(ui)`, `feat(render)`, `style(ui)`…), co-author footer del operador. Scope estricto a los archivos permitidos de la línea.
- **Aislamiento**: cada línea ejecuta en su propio **git worktree** (rama `linea-<i>-codex-wip`). Merge a `main` lo orquesta steipete en el orden de §7. Bugs fuera de scope → patch a `/tmp`, no se mezclan.

---

## 3. Stack y comandos

Bun 1.3 + Vite 6 + Preact 10 + Signals + Zustand 5 + JointJS 3.7 core OSS. TS strict.

```bash
cd app
bun run dev            # HMR localhost:5173
bun run check          # typecheck + unit (gate mínimo)
bun run typecheck      # tsc --noEmit
bun run test           # unit
bun run lint           # eslint
bun run browser:smoke  # smoke Playwright (DEV SERVER APAGADO)
bun run build          # build prod
```

---

## 4. Las 6 líneas

| ID | Título | Spec Codex eje | Dominio nuevo | Riesgo | Depende |
|----|--------|----------------|---------------|--------|---------|
| **L1** | Tokens & tipografía Codex | `01-design-spec.md §3-§6`, `tokens.css` | `tokens.ts` (reescritura) | **alto** (contrato) | — |
| **L4** | CANON-V3 canvas re-piel | `08-jointjs-styling.md` | `src/render/jointjs/constantes.codex.ts` | medio | L1 (soft) |
| **L2** | CodexFrame + shell responsive | `02-components.md §1-§4`, `03-scenes.md` | `src/ui/codex/CodexFrame.tsx` | **alto** (chokepoint App.tsx) | L1 |
| **L6** | Command palette + glifos + asistente | `05-interactions.md`, `07-glyphs.md`, `02 §8` | `src/ui/codex/glifos.ts` | bajo-medio | L1 |
| **L3** | Margen unificado (OPL↔Inspector) | `02 §5-§12`, `04-opl-rendering.md`, `03 escena 04` | `src/ui/codex/MargenDerecho.tsx` | medio | L1, L2 |
| **L5** | Reconciliación de scope | `02 §3`, `06 §5` (deuda v1) | — (re-piel de existentes) | medio | L1, L2 |

---

## 5. Tabla de colisiones (archivo × línea)

Celdas: `OWNER` = único que edita · `R` = solo lectura · `N` = crea archivo nuevo · `—` = no toca.

| Archivo / zona | L1 | L2 | L3 | L4 | L5 | L6 |
|----------------|----|----|----|----|----|----|
| `src/ui/tokens.ts` | **OWNER** | R | R | R | R | R |
| `src/ui/tokens.test.ts` | **OWNER** | — | — | — | — | — |
| `src/main.tsx` (fuentes) | **OWNER** | — | — | — | — | — |
| `package.json`, `bun.lock` (deps fuentes) | **OWNER** | — | — | — | — | — |
| `src/ui/App.tsx` | — | **OWNER** | R | — | R | R |
| `src/ui/codex/CodexFrame.tsx` + ColHeader/CanvasMount/FooterKey | — | **N** | — | — | — | — |
| `src/ui/codex/MargenDerecho.tsx` + CodexOPLNote | — | — | **N** | — | — | — |
| `src/ui/codex/glifos.ts` | — | — | — | — | — | **N** |
| `src/ui/Inspector*.tsx`, `PanelOpl.tsx`, `PanelDiagnostico.tsx` | — | — | **OWNER** | — | — | — |
| `src/render/jointjs/**` (excepto proyeccion/routing/mapa) | — | — | — | **OWNER** | — | — |
| `src/ui/ArbolOpd.tsx`, `src/ui/arbol/**` | — | — | — | — | **OWNER** | — |
| `src/ui/biblioteca/**`, `src/ui/ModoRevisionMobile.tsx` | — | — | — | — | **OWNER** | — |
| `src/ui/Dialogo*.tsx`, `src/ui/Modal*.tsx`, `src/ui/Dialogo.tsx` | — | — | — | — | **OWNER** | — |
| `src/ui/MapaSistema.tsx`, `MapaFiltros.tsx`, `MapaPanelEstadisticas.tsx`, `src/ui/toolbar/ToolbarMapaSistema.tsx` | — | — | — | — | **OWNER** | — |
| `src/ui/CommandPalette.tsx`, `atajosTeclado.ts`, `MenuPrincipal.tsx`, `BarraPestanas.tsx` | — | — | — | — | — | **OWNER** |
| `src/ui/Toolbar.tsx`, `src/ui/toolbar/**` excepto `ToolbarMapaSistema.tsx` | — | — | — | — | — | **OWNER** |
| `src/ui/asistente/**` (modal wizard, solo piel) | — | — | — | — | — | OWNER opcional |
| `src/ui/arbol/arbol.css` | R | R | — | — | **OWNER** | — |
| `src/ui/toolbar/toolbar.css`, `src/ui/toolbar/toolbarStyles.ts` | R | R | — | — | — | **OWNER** |
| `src/ui/menus.css`, `src/ui/focus.css`, otros CSS globales | R | R | R | — | R | R |
| `e2e/03-opl-panel.spec.ts` | — | R | OWNER opcional | — | R | — |
| `e2e/04-arbol-y-pestanas.spec.ts`, `e2e/20-biblioteca-dock.spec.ts`, `e2e/11-dialogo-layout-regression.spec.ts`, `e2e/22-responsive-review.spec.ts` | — | R | R | — | OWNER opcional | — |
| `e2e/12-command-palette.spec.ts`, `e2e/12-toolbar-overflow.spec.ts` | — | — | — | — | R | OWNER opcional |

**Choque crítico controlado**: `App.tsx` lo edita solo L2. L3/L5/L6 se montan **vía la API del CodexFrame** (props `leftTree / canvasMount / rightPanel / floating / footerCenter`). Ninguna otra línea edita `App.tsx`. El directorio `src/ui/codex/` es compartido pero **sin colisión a nivel de archivo** (cada línea crea archivos distintos).

---

## 6. Protocolo de conciliación (orden de merge)

```
Ola 0 (paralelo):   L1 ── L4
                     │      (L4 puede hardcodear hex Codex; no bloquea por L1)
Ola 1 (paralelo):   L2 ── L6   (ambas tras merge de L1)
Ola 2 (paralelo):   L3 ── L5   (ambas tras merge de L2)
```

**Merge order**: `L1 → L4 → L2 → L6 → L3 → L5`.

Rationale: L1 fija el contrato de tokens que todo chrome consume → primero. L4 es disjunto (otro dir) → entra en cuanto cierra. L2 define la API del frame que L3/L5 consumen → antes que ellas. L6 toca archivos aislados → entra apenas L1 esté. L3 y L5 montan dentro del frame → últimas, en paralelo entre sí (dominios de archivo disjuntos).

steipete autoriza cada merge tras `bun run check` verde de la rama. Smoke completo al cierre de cada ola (dev server apagado).

---

## 7. Anclaje obligatorio a HU y SSOT

- **HU base**: cada brief incluye una tabla `HU base` con paths absolutos a `docs/historias-usuario-v2/`. Es trazabilidad y continuidad funcional; no autoriza tocar el backlog.
- **Visual** (`opd-es`): V-63, V-203, V-209, V-211, V-212 — verificadas en `06-ssot-compliance.md §1`.
- **Textual** (`opl-es`): §1.5, §1.7, §1.9, §2 — tipografía OPL (`OplObj/OplProc/OplState`), verbos canónicos.
- **Metodológica**: §5, §6 (asistente SD), §7.3 (refinamiento), profundidad justificada.
- SSOT externa: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.

Cada decisión semántica de una línea cita la sección del handoff Codex **y** la regla SSOT que la respalda.

---

## 8. Briefs por línea

| Línea | Brief |
|-------|-------|
| L1 | [`linea-1-tokens.md`](linea-1-tokens.md) |
| L2 | [`linea-2-frame.md`](linea-2-frame.md) |
| L3 | [`linea-3-margen.md`](linea-3-margen.md) |
| L4 | [`linea-4-canvas.md`](linea-4-canvas.md) |
| L5 | [`linea-5-scope.md`](linea-5-scope.md) |
| L6 | [`linea-6-comandos.md`](linea-6-comandos.md) |

Asignación a agentes: [`prompt-asignacion.md`](prompt-asignacion.md).

---

## 9. Verificación al cierre de la ronda

- `cd app && bun run check` verde (objetivo: ≥1596 unit, sin regresiones nuevas).
- `bun run build` verde.
- `bun run browser:smoke` (dev server apagado) sin regresiones nuevas vs baseline (03/05 tienen flake pre-existente).
- Validación in-vivo con skill `test-vivo-iterativo-opmkv` contra las 4 escenas de `ui-forja/screenshots/`.
- Confirmación: **HANDOFF.md NO tocado por esta ronda** (lo reescribe el operador al cierre).
