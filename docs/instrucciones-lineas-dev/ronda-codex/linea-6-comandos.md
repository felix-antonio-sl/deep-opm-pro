# L6 — Command palette + glifos + atajos + asistente SD

**Ronda:** Codex · **Base:** `a4b8abf` (main) · **Riesgo:** bajo-medio · **Ola:** 1 (tras merge de L1) · **Merge order:** 4º (`L1 → L4 → L2 → L6 → L3 → L5`).

Rama de trabajo: worktree propio `linea-6-codex-wip`.

---

## 1. Misión

Re-pielar el chrome de comandos/atajos al lenguaje **Codex** (editorial, type-led, cero iconos vectoriales) sin tocar lógica:

1. **Command palette** (`CommandPalette.tsx`, 472 líneas, ya existe con fuzzy + frecuencia) → reorganizar a las **6 secciones canónicas** Codex (MODELO/CREAR/NAVEGAR/EXPORTAR/VISTA/ASISTENTE), backdrop paper+blur, item activo con `border-left` crimson, footer de navegación. Es **RE-PIEL + reorganización**, no construcción desde cero.
2. **Catálogo de glifos Unicode** → crear `src/ui/codex/glifos.ts` como única fuente de verdad de todo glifo Codex (07-glyphs.md). Cero SVG/lucide nuevos.
3. **Registry de atajos** (`atajosTeclado.ts`) → verificar/completar que el cheatsheet y la palette cubren los combos del mapa Codex (§9 de 05-interactions). El registry real vive en `globalShortcutsPort.ts` (**NO editable**, es lógica): aquí solo se ajusta presentación/formato (`formatearCombo`, render de `kbd`).
4. **Absorción del menú principal en ⌘K** → el botón hamburguesa `☰` desaparece; todo item de `MenuPrincipal.tsx` migra a una sección de la palette. `MenuPrincipal.tsx` queda como dropdown re-pielado mínimo **o** se retira su invocación visual (ver §10).
5. **Re-piel Toolbar / BarraPestanas** → tipografía Codex, glifos Unicode en vez de SVG/`☰`/`x`/`+` ad-hoc.
6. **Flujo del asistente SD en frame Codex** → diseñar dónde vive el wizard (`src/ui/asistente/`) en el layout Codex. El handoff lo difirió a v1.1; aquí se **preserva** y se especifica su encaje (ver §10).

**Refactor solo de presentación.** No se toca store, modelo, proyección, OPL ni handlers de comandos.

---

## 2. HU base

| HU | Path absoluto | Aporte a esta línea |
|---|---|---|
| HU-90.001..021 — Interacción / shortcuts | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-90-interaccion-shortcuts.md` | Atajos visibles en palette/cheatsheet deben reflejar registry real sin registrar lógica nueva. |
| HU-34.001 / HU-34.002 — Nuevo modelo desde menú y pestañas | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md` | Sección MODELO de la palette absorbe entrada de nuevo modelo y barra de pestañas conserva `+`. |
| HU-34.010..024 — Nuevo modelo por asistente SD | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md` | Sección ASISTENTE preserva el wizard SD y lo re-piela sin moverlo a lógica nueva. |
| HU-50.023..025 — Copiar/exportar/buscar OPL-ES | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Palette debe exponer comandos de OPL sin romper handlers actuales. |
| HU-SHARED-003 — Permisos/read-only | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-003-permisos-readonly.md` | Re-piel de comandos no debe mostrar acciones de escritura cuando el puerto las deshabilita. |

**Contrato Codex + SSOT:**

| Fuente | Qué aporta |
|---|---|
| `ui-forja/05-interactions.md` | §1 atajos globales del chrome; §2 command palette (activación, navegación, item activo, búsqueda); §3-§4 hover/focus; §8 atajos asistente SD; §9 mapa de atajos por capa |
| `ui-forja/07-glyphs.md` | Catálogo Unicode completo (§1), reglas por glifo (§2), glifos prohibidos (§3), render de `kbd` (§4), comillas `«»` (§5) |
| `ui-forja/02-components.md §8` | Command Palette: anatomía, visual (620px, backdrop paper 80% + blur 2px), **6 secciones canónicas** con items mínimos |
| `ui-forja/02-components.md §13` | `CodexFooterKey` (kbds con borde OPM-canon por tecla) |
| `ui-forja/02-components.md` Apéndice | Patrones prohibidos: `Button` con bg/radius/shadow, overlay oscuro, iconos vectoriales |
| `ui-forja/screenshots/02-command.png` | Referencia visual de la palette |

**Anclaje SSOT** (`/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`):
- **§6 metodología (asistente SD)**: el SD precede a cualquier refinamiento; debe ser simple y claro. El wizard de 3 etapas (Función → Beneficiario → Sembrar) ya implementa esto; L6 solo lo re-piel + decide encaje.
- **§7.3 refinamiento**: los atajos de creación y de in-zoom/unfold (`O`/`P`/`S`/`R`, `Shift+I`/`Shift+U`) deben presentarse en la sección CREAR de la palette con la nomenclatura canónica.
- **opl-es §1.7**: tipografía OPL si se renderiza algún nombre OPM en la palette (improbable; no es marginalia).

Ante conflicto Codex↔SSOT manda la SSOT (regla de oro #1). `06-ssot-compliance.md` ya verificó que no hay conflicto en este dominio.

---

## 3. Anclaje a evidencia (estado actual real)

### Command palette — `app/src/ui/CommandPalette.tsx`
- **Ya existe** (472 líneas). Fuzzy search (`filtrarItemsCommandPalette`, `normalizarTextoBusqueda`, NFD-insensible), frecuencia de uso (`frecuenciaUso`, `registrarUsoCommandPalette`), dedup por `(combo+label)`.
- Construye items de 3 fuentes: **atajos** (`listarAtajos()`), **acciones contextuales** de entidad (`accionesParaSuperficie(..., "command-palette")`), y **acciones de menú** (`construirAccionesMenuCommandPalette`, líneas 325-341 — ya tiene nuevo-modelo, abrir-importar, guardar-como, configuración, plantillas, versiones, exportar-json, simulación, grid, auto-layout, tabla-enlaces, atajos-teclado).
- Orden actual: por frecuencia, luego alfabético. **No** hay secciones; render plano de hasta 60 items con `categoria` como meta-tag a la derecha (`navegacion`/`edicion`/`archivo`/`vista`/`seleccion`).
- Estilo actual = Bauhaus Ronda 28 (`style` líneas 382-472): backdrop `rgb(10 10 10 / 0.32)` **oscuro** (Codex exige paper 80% + blur), item activo con `boxShadow: inset 2px 0 accent` (cinabrio — válido como crimson Codex), `ellipsis` en labels (Codex V-212 prohíbe truncar etiquetas OPD, pero estas son labels de comando, no símbolos — ellipsis aceptable aquí).
- `data-testid="command-palette"`, items `command-palette-item-{id}`, `data-ifml-stereotype="Modal"` — **preservar todos** (los smokes dependen).

### Registry de atajos — `app/src/ui/atajosTeclado.ts`
- Es la **infraestructura** del registry (registrar/desregistrar/escuchar/contexto/`formatearCombo`/`listarAtajos`). Contextos: `global`/`canvas`/`panel-opl`/`panel-arbol`/`modal-input`/`vista-mapa`. Categorías: `navegacion`/`edicion`/`archivo`/`vista`/`seleccion`.
- `formatearCombo` ya mapea a glifos mac (`⌃⇧⌥`, flechas `↑↓←→`). **No mapea `⌘`** (usa `⌃` para Ctrl). Codex usa `⌘` (07-glyphs U+2318) — ajuste de presentación permitido aquí.
- **El registro de los combos concretos vive en `app/src/app/ports/globalShortcutsPort.ts`** (líneas 151-235) — **archivo de lógica, NO editable por L6** (es un port). Allí están `Ctrl+S`, `Ctrl+K` (`abrirDialogoComandos`), `Ctrl+F`, `Ctrl+Shift+F`, `Ctrl+D`, `Ctrl+Z/Y`, `Ctrl+A/C/V`, `Delete`, `Shift+I` (in-zoom), `Shift+U` (unfold), `Ctrl+T/W/Tab`, `Ctrl+B`, flechas/nudge, `Ctrl+Arrow` (navegación OPD).

### Menú principal — `app/src/ui/MenuPrincipal.tsx`
- 421 líneas. Dropdown con secciones: Modelo / Buscar / Exportar / Plantillas / Vista / Workspace / Herramientas. **Incluye `iniciarAsistente`** ("Asistente guiado", línea 97).
- Invocado por botón `☰` en `ToolbarBase.tsx:308` (`handleToggleMenuPrincipal`, store `menuPrincipalAbierto`). Montado una vez en `App.tsx:189`.
- **Iconos vectoriales a reemplazar**: `import modelWizardIcon from ".../toolbar/modelWizard.svg"` (línea 2, footer), `import templateIcon from ".../template.svg"` (línea 4, items Plantillas). Footer usa `<img src={modelWizardIcon}>`.

### Toolbar — `app/src/ui/Toolbar.tsx` + `toolbar/`
- `Toolbar.tsx` (46 líneas, orquestador delgado). Status usa glifos `●`/`○` (ya Unicode, OK).
- `toolbar/ToolbarBase.tsx`: **iconos vectoriales a reemplazar** → `import objectDragIcon from ".../objectDrag.svg"` (línea 15, usado en `<img>` línea 361 "+ Atributo"), botón hamburguesa `☰` (línea 308), `GlyphObjeto`/`GlyphProceso` (SVG inline `<rect>`/`<ellipse>` líneas 42-80). **Decisión:** los glifos geométricos OPM en la toolbar (cuadrado/elipse) son límite con L4 — ver §5; el `☰` y `objectDrag.svg` sí caen claramente a L6.
- `toolbar/ToolbarCreacion.tsx`, `ToolbarMas.tsx`, `toolbarStyles.ts`, `toolbar.css` — re-piel tipográfico. **`ToolbarMapaSistema.tsx` es OWNER de L5** porque pertenece al chrome de mapa.

### Barra de pestañas — `app/src/ui/BarraPestanas.tsx`
- 235 líneas. Cierre con `x` literal (línea 109), nueva pestaña con `+` (línea 124). Sin SVG. Codex: cerrar = `✕` (U+2715), nueva = `+` (U+002B, ya OK). Activa con underline cinabrio (ya Codex-compatible como crimson).

### Asistente SD — `app/src/ui/asistente/`
- **Ya existe**: `Asistente.tsx` (`AsistenteNuevoModelo`, 3 etapas: Función → Beneficiario → Sembrar; `EtapaFuncionPrincipal`/`EtapaBeneficiario`/`EtapaSembrar`), `estilos.ts`, ViewModel `asistenteNuevoModeloViewModel.ts`. Hoy es un **modal** (`role="dialog" aria-modal="true"`, `data-ifml-pattern="DE-WIZ"`), montado lazy en `App.tsx:362` cuando `asistenteAbierto`. Activado por `iniciarAsistente` (store `uiPanel.ts:449`), invocado desde MenuPrincipal y PantallaInicio.
- **NO hay atajo `⌘⇧A` registrado** para iniciar asistente (no aparece en `globalShortcutsPort.ts`). 05-interactions §8 lo pide → ver §6/§10.

### Tokens
- Los tokens Codex de la app viven en **`tokens.ts`**, no en CSS vars runtime. `ui-forja/tokens.css` es referencia de valores, pero L1 proyecta esos valores a `tokens.colors.*`, `tokens.typography.*`, `tokens.stroke.*`, etc. **L6 entra tras merge de L1**, así que consume `tokens` tipados. Si un token Codex falta, **detente y reporta** (no inventes hex ni `--cx-*` locales).

### Evidencia OPCloud / JOYAS revisada (declaración obligatoria)
- `opm-extracted/MODULES.md:20` + `INDEX.md:839`: `keyboardShortcuts.ts` (672 líneas, Rappid) — `copy`/`paste`/`pasteOnlyFormatting`/`moveDuplicationMark`/`findThing`. **Conceptualmente reciclable** para confirmar nomenclatura de comandos, pero el stack diverge (Rappid≠JointJS-OSS, Angular≠Preact). **No se copia 1:1.** El registry propio (`atajosTeclado.ts` + `globalShortcutsPort.ts`) ya cubre y supera estos.
- `docs/JOYAS.md`: **sin** entradas de command palette / toolbar / shortcut (grep vacío). Codex es identidad nueva; los glifos provienen de 07-glyphs.md, no de JOYAS.
- `assets/svg/` contiene `toolbar/modelWizard.svg`, `template.svg`, `objectDrag.svg` — **a retirar** del chrome (reemplazo por glifo Unicode), no a reciclar.

---

## 4. Archivos permitidos

| Archivo | Permiso | Nota |
|---|---|---|
| `app/src/ui/CommandPalette.tsx` | **EDIT (OWNER)** | re-piel + 6 secciones |
| `app/src/ui/atajosTeclado.ts` | **EDIT (OWNER)** | solo presentación: `formatearCombo` (mapeo `⌘`), helpers de render kbd |
| `app/src/ui/MenuPrincipal.tsx` | **EDIT (OWNER)** | re-piel mínimo o retiro de invocación visual (§10) |
| `app/src/ui/Toolbar.tsx`, `app/src/ui/toolbar/*.tsx` excepto `ToolbarMapaSistema.tsx`, `app/src/ui/toolbar/toolbarStyles.ts`, `app/src/ui/toolbar/toolbar.css` | **EDIT (OWNER)** | re-piel global; reemplazar `☰`/`objectDrag.svg` por glifos |
| `app/src/ui/BarraPestanas.tsx`, `app/src/ui/BarraPestanas.css` | **EDIT (OWNER)** | `x` → `✕` |
| `app/src/ui/codex/glifos.ts` | **NUEVO (N)** | catálogo Unicode + helper `Kbd` opcional |
| `app/src/ui/asistente/**` | **EDIT opcional** | solo re-piel del modal wizard, sin mover flujo ni tocar VM |
| `app/src/ui/tokens.ts` | **LECTURA (R)** | consumir tokens Codex tipados post-L1 |
| `app/e2e/12-command-palette.spec.ts`, `app/e2e/12-toolbar-overflow.spec.ts` | **EDIT opcional** | solo si cambian asserts visuales/selectores; preservar `data-testid` y comportamiento |

`src/ui/asistente/*` lo lees para diseñar el encaje (§10), pero **solo lo editas si el encaje exige re-piel del frame del wizard**; coordina con L2/L3 (el frame y la columna derecha son suyos). Recomendación: **no muevas el wizard a la columna derecha en esta ronda** — solo re-pielar su modal y registrar el atajo de presentación; ver §10.

---

## 5. Restricciones de no-colisión

- **NO tocar `App.tsx`** — el frame Codex lo monta L2. La palette se sigue montando como overlay global (ya lo es vía `App.tsx`); si el montaje cambia, lo hace L2 leyendo tu componente. Si crees necesitar editar `App.tsx`, **detente y reporta**.
- **NO tocar `globalShortcutsPort.ts`** ni ningún `*Port.ts`/ViewModel/store — son lógica. Si un combo Codex falta en el registry (p.ej. `⌘⇧A` para asistente), **lo reportas como dependencia para el operador/L2**, no lo añades tú (registrar un combo nuevo = lógica, no presentación).
- **NO tocar** los `handler` de los comandos ni `acciones-contextuales.ts` / `ejecutarAccionContextual.ts` — solo presentación.
- **Límite con L4 (canvas):** los `GlyphObjeto`/`GlyphProceso` SVG inline de `ToolbarBase.tsx` representan geometría OPM en botones de chrome. Codex 07-glyphs **no** define glifo Unicode para "objeto/proceso" en toolbar; el cuadrado/elipse geométrico es señal de tipo. **Decisión L6:** consérvalos como están (son chrome, no canvas; ya son `stroke: ink` neutro, no cromático) **salvo** que 07-glyphs ofrezca equivalente — no lo ofrece. NO migres su color (eso es de L4/canvas, prohibido). Documenta la decisión en el commit.
- **No truncar etiquetas de símbolos OPD** (V-212). En la palette los labels son de comando, no de símbolo → `ellipsis` permitido. No reusar este patrón en el árbol (es de L5).

---

## 6. Slice mínimo shippeable

1. **`glifos.ts` (NUEVO)** — exporta el catálogo Unicode de 07-glyphs.md §1 como constantes nombradas (`GLIFO_CERRAR = "✕"`, `GLIFO_CREAR = "+"`, `GLIFO_CHECK = "✓"`, `GLIFO_VACIO = "—"`, `GLIFO_ENTER = "↵"`, `GLIFO_BORRAR = "⌫"`, `GLIFO_CMD = "⌘"`, `GLIFO_SHIFT = "⇧"`, `GLIFO_CTRL = "⌃"`, `GLIFO_ALT = "⌥"`, `GLIFO_NAV_UP/DOWN`, `GLIFO_CARET = "▾"`, `GLIFO_MARKER = "▸"`, `GLIFO_SEP = "·"`, `GLIFO_REF = "※"`, `GLIFO_WARN = "△"`, comillas `«»`…). Opcional: helper `Kbd({ children })` que renderiza el `kbd` canónico (07-glyphs §4: mono 10px, borde `tokens.colors.rule`, sin background). **Cero imports de SVG/lucide.** Comentario de cabecera citando 07-glyphs.md.
2. **Palette → 6 secciones** — reorganizar el render de `CommandPalette.tsx` para agrupar items en MODELO/CREAR/NAVEGAR/EXPORTAR/VISTA/ASISTENTE en ese orden fijo (02 §8). Mapear cada `item` a su sección vía su `categoria` actual + una tabla de mapeo declarativa (ver §10 para la asignación). Grid 2 columnas, hairlines dotted, item activo `border-left: 2px crimson + paper-warm`, footer `↑↓ navegar · ↵ ejecutar · ⌘. ayuda`, backdrop paper 80% + blur 2px (reemplaza el backdrop oscuro actual). Cabecera input `⌘K buscar comando… esc`. **Preservar** fuzzy/frecuencia/dedup y todos los `data-testid`.
3. **Mapa de glifos aplicado** — sustituir en Toolbar/MenuPrincipal/BarraPestanas todo glifo ad-hoc/SVG de chrome por las constantes de `glifos.ts` (`☰`→absorbido por ⌘K; `x`→`✕`; `objectDrag.svg`→`+`/glifo). Render de kbds en palette/cheatsheet vía helper canónico.
4. **Verificación de combos** — confirmar que la palette y el cheatsheet listan correctamente, con `formatearCombo` mapeando a glifos Codex (`⌘` para Ctrl/Cmd en mac), los combos del mapa §9 que SÍ existen en el registry: `⌘K`, `⌘S`/`⌘⇧S`, `⌘N`, `⌘O`, `⌘Z`/`⌘⇧Z`, `⌘1…9` (navegación OPD vía `Ctrl+Arrow`), `⌘.` (toggle marginalia — reportar si falta), `O`/`P`/`S`/`R` (creación — ver nota), `Shift+I`/`Shift+U` (in-zoom/unfold). **Declarar explícitamente qué combos de §9 NO existen** en el registry (candidatos: `⌘⇧A` asistente, `⌘.` marginalia, `O/P/S/R` si los maneja JointJS y no el registry global, `⌘+/-/0` zoom, `⌘G` group, `⌘L` lock) → lista de gaps para el operador (no los implementas).
5. **Absorción del menú** — eliminar el botón `☰` de `ToolbarBase.tsx`; garantizar que **todo** item de `MenuPrincipal.tsx` tiene equivalente en `construirAccionesMenuCommandPalette` (faltan hoy: Buscar-en-modelo, Buscar-workspace, Renombrar, Asistente guiado, Mostrar/ocultar archivados, Mostrar/ocultar versiones, toggles alias/descripciones/imagen, URLs del objeto). Como añadir acciones de menú a la palette = presentación (solo cablea handlers ya existentes del ViewModel), **sí está permitido** ampliar `construirAccionesMenuCommandPalette` y el `commandPaletteViewModel` **solo si el ViewModel ya expone esos handlers** — si no los expone, reportar (no editar el ViewModel). Ver §10.
6. **Asistente SD** — registrar visualmente el comando "iniciar asistente SD" en la sección ASISTENTE de la palette (ya existe `iniciarAsistente` en MenuPrincipalViewModel; cablear al `commandPaletteViewModel` si está expuesto). Re-pielar el modal `Asistente.tsx`/`estilos.ts` al lenguaje Codex (tipografía editorial, glifos, `«»` para citas SSOT §6). Ver §10 para ubicación.

---

## 7. Tests

- **E2E existentes a preservar verdes** (lectura; ajustar selector solo si la re-piel rompe un `getByTestId` y manteniendo la aserción de comportamiento):
  - `e2e/12-command-palette.spec.ts` — `Ctrl+K` abre, fuzzy `tabla enlaces`/`abrir importar`/`configuracion`/`atajos teclado`, Enter ejecuta, Escape cierra. **Todos los `command-palette-item-menu-*` testIds deben sobrevivir** la reorganización a secciones.
  - `e2e/12-toolbar-overflow.spec.ts` — overflow de toolbar; si retiras `☰` verifica que no rompe el cálculo de overflow.
- `e2e/04-arbol-y-pestanas.spec.ts` se puede correr como smoke de regresión por `BarraPestanas`, pero **no editar**: ese spec es OWNER opcional de L5 por árbol/mapa. Si falla por el cambio `x`→`✕`, conserva `data-testid` y reporta la necesidad de conciliación a steipete.
- **Unit existentes**: `src/ui/CommandPalette.test.ts`, `toolbar/ToolbarCreacion.test.ts`, `toolbar/toolbarStyles.test.ts`, `asistente/Asistente.test.ts` — mantener verdes.
- **Unit nuevo (recomendado)**: `src/ui/codex/glifos.test.ts` — verifica que cada constante es el code-point correcto de 07-glyphs.md y que **no** aparece ningún glifo prohibido (`•`, `★`, emoji, chevrones `> <`).

No agregar specs e2e nuevas salvo que el operador lo pida; el contrato es re-piel.

---

## 8. Verificación

```bash
cd app
bun run check          # typecheck + unit — GATE mínimo, debe quedar verde
bun run lint           # eslint src/
# smoke SOLO con dev server apagado (flakes canvas 02/05):
bun run browser:smoke  # validar 12-command-palette + 12-toolbar-overflow; 04 solo como regresión sin editar
```

- `bun run check` verde obligatorio antes de entregar la rama.
- Validación in-vivo opcional con skill `test-vivo-iterativo-opmkv` contra `ui-forja/screenshots/02-command.png`.
- Confirmar: **HANDOFF.md NO tocado**.

---

## 9. Decisiones bloqueadas (no reabrir)

1. **Cero iconos vectoriales** — todo glifo es Unicode (07-glyphs.md). Los SVG de chrome (`modelWizard.svg`, `template.svg`, `objectDrag.svg`, `☰`) se reemplazan.
2. **La palette YA existe** — es RE-PIEL + reorganización a 6 secciones, no construcción.
3. **⌘K absorbe el menú principal** — el botón hamburguesa `☰` desaparece.
4. **Tokens = L1** — L6 solo lee `tokens.ts`. Si falta un token, detente y reporta.
5. **No tocar lógica** — store/modelo/ports/ViewModels/handlers/proyección/OPL intactos.

---

## 10. Decisiones que toma L6

### 10.1 Ubicación del asistente SD
**Decisión: en esta ronda el asistente SE PRESERVA como modal re-pielado, NO se mueve a la columna derecha.**
Razón: 05-interactions §8 dice que el wizard "vive en la columna derecha reemplazando OPL temporalmente", pero esa columna es **OWNER de L3** (`MargenDerecho.tsx`) y el frame es **OWNER de L2**. Moverlo allí en la Ola 1 cruzaría ownership y dependería de artefactos aún no mergeados. El handoff ya lo difirió a **v1.1**. Por tanto L6:
- Re-piel el modal `Asistente.tsx`/`estilos.ts` al lenguaje Codex (tipografía Inria Serif/Sans, glifos `↵`/`✕`, citas SSOT §6 con `«»`, progreso de etapas con hairlines en vez de barra rellena si encaja).
- Cablea el comando "iniciar asistente SD" en la sección ASISTENTE de la palette.
- **Deja documentado en el brief de cierre** (para v1.1) que el destino final del wizard es la columna derecha de L3, reusando `EtapaFuncionPrincipal`/`EtapaBeneficiario`/`EtapaSembrar` como formulario de etapas inline. NO lo implementes ahora.
- El atajo `⌘⇧A` (registro real) es **gap reportado**, no implementado por L6 (registrar combo = lógica).

### 10.2 Migración MenuPrincipal → secciones de la palette
Mapeo propuesto (cada item del menú a su sección Codex):

| Item MenuPrincipal | Sección palette |
|---|---|
| Guardar, Guardar como, Abrir/importar, Nuevo, Renombrar, Configuración | **MODELO** |
| (nuevo objeto/proceso/estado/relación, in-zoom `Shift+I`, nuevo OPD hijo) | **CREAR** |
| Buscar en modelo, Buscar workspace, ir a SD raíz/SD1, mapa, siguiente OPD, Abrir pestaña | **NAVEGAR** |
| Exportar OPD SVG, Exportar JSON, OPL como HTML | **EXPORTAR** |
| Alias/Descripciones visibles, Imagen global, Cuadrícula, Biblioteca dock, Auto-layout, Simulación, Tabla de enlaces, Atajos de teclado, Mostrar archivados/versiones | **VISTA** |
| Iniciar asistente SD, ir a etapa actual | **ASISTENTE** |

- **Permitido**: ampliar `construirAccionesMenuCommandPalette` (CommandPalette.tsx) cableando handlers **que el `commandPaletteViewModel` ya expone**. Si un handler (p.ej. `abrirBusquedaCosas`, `iniciarAsistente`, `toggleAliasVisibles`, `abrirModalUrls`) **no** está en `commandPaletteViewModel.ts` pero **sí** en `menuPrincipalViewModel.ts`, eso es un gap: repórtalo (ampliar el ViewModel cruza a lógica de cableado — coordina con operador). Prioriza no romper; entrega lo cableables y lista los gaps.
- **MenuPrincipal.tsx**: re-pielar a Codex y **dejar de invocarlo desde el `☰`** (botón eliminado). Decisión: conservar el componente montado pero sin trigger visual (deuda mínima) **o**, si L2 ya no lo monta, retirar su `<MenuPrincipal />` requiere tocar `App.tsx` → **prohibido**; por tanto se conserva montado e inerte y se reporta a L2 para que decida su retiro definitivo del frame. NO eliminar el componente (rompería imports de `App.tsx`).

### 10.3 Cobertura de las 6 secciones — veredicto preliminar
El registry de atajos + acciones de menú **ya cubren ~4 de 6 secciones** parcialmente (MODELO, NAVEGAR parcial, EXPORTAR parcial, VISTA). **CREAR** depende de cómo se expongan `O/P/S/R` (probablemente JointJS/canvas, no registry global → quizá no aparezcan como items hoy) y **ASISTENTE** solo tiene el item vía menú. L6 confirma/completa la agrupación visual; los combos faltantes son gaps reportados.

---

## 11. Forma del entregable

- **Commits** con scope estricto a archivos §4, prefijo por naturaleza:
  - `feat(ui): catálogo de glifos Unicode Codex (glifos.ts)`
  - `style(ui): command palette a 6 secciones Codex + backdrop paper/blur`
  - `style(ui): re-piel Toolbar/BarraPestanas/MenuPrincipal a glifos Codex`
  - `feat(ui): asistente SD en frame Codex (modal re-pielado, comando ⌘K)`
  - Footer co-author del operador.
- **Rama** `linea-6-codex-wip` en worktree propio; merge lo orquesta steipete (4º en el orden).
- **NO tocar**: `App.tsx`, `globalShortcutsPort.ts`, cualquier `*Port.ts`/ViewModel/store/modelo/proyección/OPL, `MargenDerecho.tsx`/`CodexFrame.tsx` (L2/L3), `tokens.ts` (solo lectura).
- **Reportar al cierre**: lista de combos del mapa Codex §9 ausentes del registry (gaps `⌘⇧A`, `⌘.`, etc.), handlers de menú no expuestos por `commandPaletteViewModel`, y la deuda v1.1 del asistente en columna derecha. Bugs fuera de scope → patch a `/tmp`, no se mezclan.
