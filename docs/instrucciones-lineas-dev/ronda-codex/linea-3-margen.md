# L3 — Margen unificado (OPL marginalia ↔ Inspector)

> Ronda Codex · base `a4b8abf` · riesgo **medio** · depende de **L1 (tokens)** + **L2 (CodexFrame)**.
> Lee primero el [`README.md`](README.md) de la ronda (reglas duras §2, tabla de colisiones §5, orden de merge §6). Este brief no lo duplica.

---

## 1. Misión

Construir el **contenido del margen derecho Codex** como un único componente `MargenDerecho.tsx` que vive en la región `rightPanel` del CodexFrame de L2. Dos estados de un mismo margen:

- **Default (escena 01)**: la OPL del modelo como **marginalia editorial** — oraciones numeradas (`CodexOPLNote`) en serif, con los diagnósticos integrados como **severidad al pie de cada oración** (no toasts, no panel inferior).
- **Selección (escena 04 / 03)**: al seleccionar un símbolo, el margen hace **split**: Inspector arriba (re-pielado con `CodexInspect*`) + OPL **filtrada** a ese símbolo abajo, con divider hairline-strong `MARGINALIA · OPL  filtrado · o.06 · 4/24 ✕`.

Esto **absorbe** el panel OPL inferior y el `PanelDiagnostico` actuales: L2 deja de montarlos abajo; todo su contenido se reubica aquí. Re-piel **solo de presentación**: consumes `useInspectorViewModel`, `usePanelOplViewModel` y los pipelines OPL **sin tocarlos**.

---

## 2. HU base

| HU | Path absoluto | Aporte a esta línea |
|---|---|---|
| HU-50.001 — Renderizar panel OPL-ES persistente | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | El margen derecho reemplaza el panel inferior sin apagar la lente OPL. |
| HU-50.016 — Colorear tokens OPL-ES por clase de cosa | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Los helpers `OplObj/OplProc/OplState` materializan la tipografía/cromática por clase. |
| HU-50.017 — Resaltar cruzado OPL-ES↔OPD al pasar el cursor | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Marginalia debe conservar hover/click bidireccional con canvas. |
| HU-50.018 — Filtrar OPL-ES por selección activa en canvas | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | El estado selección del margen muestra OPL filtrada y split con inspector. |
| HU-50.019..025 — Edición inversa, copia, exportación y búsqueda OPL | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | La re-piel no puede romper edición inversa, acciones de panel ni búsqueda. |
| HU-SHARED-008 — Selección y deselección de canvas | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-008-seleccion-canvas.md` | El margen depende de la selección activa sin modificar el contrato de selección. |

**Contrato Codex + SSOT:**

**Componentes Codex (de `02-components.md`):**
- §5 `CodexSelectionAnnotation` — barra emergente de selección (overlay HTML sobre el canvas). **Ojo de scope:** la barra emergente se *posiciona sobre el canvas* y se monta vía la prop `floating` del CodexFrame, no dentro de `rightPanel`. Coordínala con L2/L4 — tú defines el componente y su contenido (mark `※`/dígito, acciones por `·`, meta line), L2 lo recibe por `floating`. Si su montaje exige tocar `App.tsx`, **te detienes y reportas** (es de L2).
- §6 `CodexOPLNote` — oración OPL numerada en marginalia (número mono + body serif inkMid + selected crimson + marginalia de severidad indentada 38px). **Componente más usado.** Lo creas tú.
- §7 `OplObj` / `OplProc` / `OplState` — helpers tipográficos inline (objeto bold; proceso bold-italic; estado mono 0.86em oliva). Los creas tú (en `CodexOPLNote.tsx` o un módulo hermano).
- §9 `CodexInspectSection`, §10 `CodexInspectField`, §11 `CodexInspectInline`, §12 `CodexStateRow` — primitivas del inspector re-pielado.
- `04-opl-rendering.md` — realización canónica OPL: §1 tipografía (helpers), §4 filtrado por selección, §5 indicador selected (crimson, **no** oliva), §6 marginalia de validación (severidad + cita SSOT), §11 bidireccionalidad OPD↔OPL.
- `03-scenes.md` escena 04 (split inspector+OPL) y escena 03 (multi-select, oraciones `selected`).

**Anclaje SSOT (`opm-opl-es`):**
- **§1.5 ser/estar** — `puede estar` para estados, `es` para propiedades invariantes. (Ya lo resuelven los generadores OPL; tú solo lo renderizas — **no reescribas verbos**.)
- **§1.7 tipografía** — Objeto bold / Proceso bold-italic / Estado mono oliva. Es la regla que `OplObj/OplProc/OplState` materializan. Cada nombre OPM en cuerpo OPL DEBE pasar por uno de los tres.
- **§1.9 posición de estado** — estado después del objeto con preposición "en". (También lo resuelve el generador; solo render.)

**Canon V-203 (`opd-es`):** crimson `#8e2a2e` es canal UI exclusivo (selección, filtro activo, flag `suprimir`, severidad crítica). **Nunca** como semántica OPM. Oliva es estado.

---

## 3. Anclaje a evidencia (estado actual del código)

**Cómo se obtienen las oraciones OPL hoy** (mapeo verificado, NO lo tocas):

- `PanelOpl.tsx` (`app/src/ui/PanelOpl.tsx`) consume `usePanelOplViewModel()` (`app/src/app/viewmodels/panelOplViewModel.ts`).
- El VM llama `derivarPanelOpl(...)` (`app/src/opl/panel.ts`), que produce: `lineas: OplLineaInteractiva[]`, `bloques: BloqueOpl[]` (agrupadas por OPD), `visibles`, `visiblesPorId`, `seleccionRef`, `primeraVisibleSeleccionada`, `query`. El filtrado por selección ya está implementado vía `filtrarLineasPorReferencia` cuando `filtroActivo`.
- **El mapeo oración↔símbolo YA EXISTE.** En `app/src/opl/interaccion.ts`:
  - `OplLineaInteractiva` tiene `refs: OplReferencia[]` (`{tipo:"entidad"|"enlace"|"estado", id}`) y `tokens: OplToken[]` donde cada token de nombre lleva su `ref` y su `markdown:"objeto"|"proceso"|"estado"`.
  - `lineaTocaReferencia(linea, ref)` dice si una oración toca la selección/hover.
  - `referenciaEnlaceEspecifico(linea, posicionToken)` resuelve el enlace correcto al clickear un token de enlace.
- **Click y hover ya están cableados** en el VM: `seleccionarDesdeOpl(ref)`, `fijarHoverOpl(ref|null)`, `hoverOplRef`, `seleccionRef`, más `renombrarEntidadDesdeOpl`, `renombrarEstadoDesdeOpl`, `abrirInspectorEnlaceDesdeOpl`. El render token actual vive en `app/src/ui/panelOpl/Bloques.tsx` → `RenderToken` (`app/src/ui/panelOpl/RenderToken.tsx`). **Reúsalos tal cual; reemplazas su piel, no su lógica.**
- `ToolbarOpl` (`app/src/ui/panelOpl/Toolbar.tsx`) ofrece `onFiltroSeleccion`, `onCopiar`, `onExportarHtml`, `alternarNumeracionOpl`, `minimizar`, `buscar`, `editorLibre`. El `EditorOplHonesto` (editor libre OPL reverse) se conserva — su disparador puede vivir en el header del margen.

**Inspector hoy:**
- `Inspector.tsx` (`app/src/ui/Inspector.tsx`, dispatcher) consume `useInspectorViewModel()` (`app/src/app/viewmodels/inspectorViewModel.ts`) que devuelve `modo: "entidad"|"enlace"|"estado"|"vacio"` + `entidad|enlace|estado|modeloNombre|conteos|horaEditado|abrirDialogoConfiguracion`. **Este contrato NO se toca.**
- Branches: `InspectorEstado` (`app/src/ui/inspector/InspectorEstado.tsx`), `InspectorEntidad` (`app/src/ui/InspectorEntidad.tsx`, 577L, 5 tabs Semántica/Enlaces/Refinamiento/Apariciones/Estilo vía `useInspectorEntidadViewModel`), `InspectorEnlace` (`app/src/ui/InspectorEnlace.tsx`, 758L), `InspectorVacio` (inline en `Inspector.tsx`).
- Secciones reutilizables en `app/src/ui/inspector/Seccion*.tsx` (Esencia/Afiliación, Estados, Atributo, Layout, Refinamiento, etc.). **Las re-pielas con `CodexInspect*`, no reescribes su lógica ni sus viewmodels.**

**Diagnósticos hoy:**
- `PanelDiagnostico.tsx` (`app/src/ui/PanelDiagnostico.tsx`, 362L) consume `useZustandDiagnosticsPort(revision)` → `avisos: AvisoDiagnostico[]` y `derivarIssuesDiagnostico` / `agruparIssuesDiagnostico` (`app/src/app/viewmodels/panelDiagnosticoViewModel.ts`).
- `AvisoDiagnostico` (`app/src/modelo/diagnostico.ts`) lleva `elementoId?: Id` (entidad o enlace), `opdId?`, `cita`/`citaSSOT`, `avisoNavegable`, `reglaId`. **`elementoId` es la llave para anclar una marginalia de severidad a la oración OPL que lo menciona** (vía `lineaTocaReferencia(linea, {tipo:"entidad", id: elementoId})`).
- Severidad: `SeveridadDiagnostico = "bloqueo"|"mejora"|"estilo"` (`app/src/modelo/diagnosticoSeveridad.ts`). **Mapeo a Codex** (decides tú, §10): `bloqueo→critica` (crimson), `mejora→alta` (oliva), `estilo→nota` (inkSoft).

---

## 4. Archivos permitidos

| Acción | Archivo |
|---|---|
| **EDIT** (OWNER) | `app/src/ui/Inspector.tsx`, `app/src/ui/InspectorEntidad.tsx`, `app/src/ui/InspectorEnlace.tsx`, `app/src/ui/inspector/InspectorEstado.tsx` + `app/src/ui/inspector/Seccion*.tsx`, `app/src/ui/inspectorStyles.ts`, `app/src/ui/PanelOpl.tsx` + `app/src/ui/panelOpl/**` (Bloques, RenderToken, Toolbar, styles, EditorOplHonesto), `app/src/ui/PanelDiagnostico.tsx` |
| **NUEVO** (N) | `app/src/ui/codex/MargenDerecho.tsx`, `app/src/ui/codex/CodexOPLNote.tsx` (incluye/expone `OplObj/OplProc/OplState`). Puedes añadir hermanos en `app/src/ui/codex/` (p.ej. `CodexInspect.tsx`, `CodexSelectionAnnotation.tsx`) **siempre con nombre distinto** a los de otras líneas. |
| **LECTURA** (R) | `app/src/ui/tokens.ts` (L1), `app/src/app/viewmodels/inspectorViewModel.ts`, `inspectorEntidadViewModel.ts`, `panelOplViewModel.ts`, `panelDiagnosticoViewModel.ts`, `app/src/opl/**`, `app/src/modelo/diagnostico*.ts`. NUNCA editar. |

---

## 5. Restricciones de no-colisión

- **NO tocar `App.tsx`** — es OWNER de L2. Te montas vía la prop `rightPanel` del CodexFrame; la barra emergente vía `floating`. Si crees necesitar editar `App.tsx`, **detente y reporta**: significa que el contrato del frame de L2 está incompleto y debe ampliarse desde L2, no desde aquí.
- **NO tocar viewmodels/puertos/pipelines**: `inspectorViewModel.ts`, `inspectorEntidadViewModel.ts`, `panelOplViewModel.ts`, `panelDiagnosticoViewModel.ts`, `app/src/opl/**`, `app/src/modelo/**`, `app/src/store/**`. Si te falta un dato (p.ej. un selector que aún no existe), **lo derivas en tu componente desde lo que el VM ya expone**, no extiendes el VM.
- **Tokens solo lectura.** Cero hex/fuente/espaciado hard-coded fuera de `tokens.ts`. (Crimson, oliva, inkSoft, paper-warm, rule, etc. salen de L1.)
- **Sin truncamiento silencioso (V-212)** en nombres de símbolos dentro de la OPL: expandir o envolver, nunca `ellipsis`.
- **Conserva los `data-testid`** que los e2e usan (`panel-opl`, `opl-line`, `data-opl-ordinal`, `inspector`, `data-modo-inspector`, `panel-diagnostico`, `aviso-*`, etc.). Re-pielar ≠ renombrar testids. Si un layout nuevo obliga a reubicar un testid, documéntalo en el commit.

---

## 6. Slice mínimo shippeable

Entrega incremental, cada paso con `bun run check` verde:

1. **`OplObj/OplProc/OplState`** (helpers §1.7) + **`CodexOPLNote`** (`n` + `body` + `selected` + `severity`/`marginalia`). Render puro, sin estado.
2. **`MargenDerecho` estado default**: consume `usePanelOplViewModel()`, mapea cada `OplLineaInteractiva` → `CodexOPLNote` (tokens → helpers tipográficos según `token.markdown`; número = `ordinal`). Header de columna `MARGINALIA · OPL` + side = nº de oraciones. Footer `ver N más · copiar · html · exportar` (reusa `copiarOplActualAlPortapapeles`, `exportarOplActualHtml`). Conserva `seleccionarDesdeOpl` en click-número y `fijarHoverOpl` en hover.
3. **Diagnósticos como marginalia**: consume `useZustandDiagnosticsPort` (o reusa `PanelDiagnostico` re-pielado como fuente), indexa avisos por `elementoId`, ancla la marginalia más severa al pie de la `CodexOPLNote` cuya oración toca ese elemento (`lineaTocaReferencia`). Máximo UNA marginalia visible por oración (§6 04-opl-rendering); referencia la cita SSOT (`aviso.cita`). El resumen al pie del frame (`✓ ningún diagnóstico` / `△ N sugerencias`) lo provee L2 vía `footerCenter`/`footerRight` — coordina qué le pasas.
4. **`MargenDerecho` estado selección (split)**: cuando `useInspectorViewModel().modo !== "vacio"`, parte el margen: Inspector arriba (re-pielado), OPL **filtrada** abajo (activa `filtroActivo` por la selección + divider `filtrado · {id} · {visibles}/{total} ✕`).
5. **Re-piel del inspector** con `CodexInspect*`: header (badge `id · seleccionado` + título serif + sub-line tipo·esencia·afiliación), secciones VALOR/ESTADOS/OTROS como `CodexInspectSection`, campos como `CodexInspectField`, inline esencia/afiliación como `CodexInspectInline`, estados como `CodexStateRow` (flag `suprimir` siempre crimson). Tabs de `InspectorEntidad`: decides si los conservas como tree-rows/inline o los aplanas (§10).
6. **`CodexSelectionAnnotation`**: componente + su contenido (acciones según selección única/múltiple). Lo expones para que L2 lo monte en `floating`. Posicionamiento (leer bbox del paper) es de L2/L4; tú entregas el componente y los datos.

---

## 7. Tests

- **e2e `e2e/03-opl-panel.spec.ts`** — toca directamente este dominio; tiene **flake pre-existente** con dev server en background (apágalo antes). Ajusta selectores si reubicas estructura, conservando testids.
- **e2e inspector** (`e2e/04-*` si existe) y specs que dependan de `panel-diagnostico` / `aviso-*`.
- Unit: corre la batería completa (`bun run test`). No introduzcas regresiones; objetivo ≥1596 unit.
- Si añades lógica de mapeo aviso→oración en tu componente, cúbrela con un unit test local (sobre la función pura de indexado, no sobre el VM).

## 8. Verificación

- `cd app && bun run check` verde antes de cada entrega.
- `bun run build` verde.
- `bun run browser:smoke` **con dev server apagado** (flakes en 02/05 y flake pre-existente en 03).
- In-vivo: skill `test-vivo-iterativo-opmkv` contra `ui-forja/screenshots/01-editor.png` (marginalia default + severidad ALTA en oración 05) y `04-inspector.png` (split inspector+OPL, barra emergente `※`, divider `filtrado · o.06 · 4/24 ✕`).

## 9. Decisiones bloqueadas (no reabrir)

- Margen derecho **unificado**: marginalia OPL default ↔ inspector swap/split. El panel OPL inferior actual **se absorbe aquí**; L2 deja de montarlo abajo.
- Tipografía OPL canónica §1.7 (Objeto bold / Proceso bold-italic / Estado mono oliva).
- Diagnósticos como **marginalia** (severidad al pie de la oración), **no toasts**, **no panel inferior**.
- Crimson = UI (selección/filtro/suprimir/crítica); oliva = estado. Nunca cruzar (V-203).
- No tocar `App.tsx`, viewmodels, ni pipelines OPL.

## 10. Decisiones que tomas vos

- **Mecánica swap vs split exacta**: propuesta — default = **marginalia completa**; al seleccionar = **split** Inspector arriba (~58%) + OPL filtrada abajo (~42%) como escena 04. (Multi-select escena 03: sin inspector, marginalia con oraciones `selected`.) Define el ratio y si el split es fijo o redimensionable.
- **Dónde la barra emergente** (`CodexSelectionAnnotation`): contenido y acciones por tipo; coordinas el montaje en `floating` con L2.
- **Mapeo severidad → Codex** (`bloqueo→critica`/`mejora→alta`/`estilo→nota`) y regla de desempate cuando una oración tiene varios avisos (gana el más severo; resto en hover/click).
- **Tabs del `InspectorEntidad`**: conservar como tabs, convertir a tree-rows `▸`, o aplanar a secciones. (Evita patrones prohibidos: nada de tabs con underline grueso — usa marker `▸`.)
- Si `CodexSelectionAnnotation` necesita una prop que el frame de L2 no expone, **lo reportas a steipete** para ampliar el contrato de L2 — no lo fuerzas desde aquí.

## 11. Forma del entregable

- Rama `linea-3-codex-wip` (worktree propio). Merge lo orquesta steipete tras L2 (orden §6 del README).
- Commits con prefijo de capa: `feat(ui)` para `MargenDerecho`/`CodexOPLNote`/`CodexInspect*` nuevos; `style(ui)` para la re-piel de Inspector/PanelOpl/PanelDiagnostico. Footer co-author del operador. Scope estricto a los archivos de §4.
- **NO tocar**: `App.tsx`, ningún viewmodel/puerto, `app/src/opl/**`, `app/src/modelo/**`, `app/src/store/**`, `tokens.ts`, `HANDOFF.md`. Bugs fuera de scope → patch a `/tmp`, no se mezclan.
- `docs/JOYAS.md`: no se encontró marcador/glifo nuevo necesario; los tres roles tipográficos OPL son CSS puro sobre fuentes de L1. `opm-extracted/` (stack Angular/Rappid) no aporta componente reutilizable para esta línea: su OPL view y panel de propiedades divergen del modelo Preact/Zustand; se usó solo como referencia semántica de qué hechos OPL existen.

---

### Nota de evidencia OPCloud / opm-extracted

Revisado `opm-extracted/INDEX.md` y `MODULES.md`: no hay componente de marginalia ni de OPL-view directamente portable (Angular + Rappid + Firebase). La semántica OPL (qué oraciones, qué verbos, qué orden) ya está canonizada en los generadores de `app/src/opl/` y en `04-opl-rendering.md §12` (24 oraciones del SD ejemplo). Para esta línea no se recicla código de `opm-extracted/`; se recicla **lógica viva propia** (`interaccion.ts`, `panel.ts`, los VM y los `seleccionarDesdeOpl/fijarHoverOpl` ya cableados).
