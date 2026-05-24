# L2 — CodexFrame + shell responsive

> **Ronda Codex** · base `a4b8abf` · rama `linea-2-codex-wip` (worktree propio).
> Lee primero el [`README.md`](README.md) de la ronda (reglas duras §2, tabla de colisiones §5, orden de merge §6). Este brief no lo duplica.
> Depende de **L1** (tokens). Bloquea a **L3** y **L5** (consumen la API del frame que defines aquí).

---

## 1. Misión

Reestructurar `app/src/ui/App.tsx` desde el grid Bauhaus actual de 4 columnas (`240px|6px|1fr|6px|300px` + panel OPL inferior) hacia el **frame Codex de 3 columnas** — índice izquierdo | canvas central (figura) | margen derecho (marginalia) — con **header 60px** y **footer 44px**, consumiendo **exactamente los mismos ViewModels** que hoy. Creas los componentes de shell en `app/src/ui/codex/` y defines la **API de props del frame** que L3/L5/L6 usarán para montarse, de modo que **ninguna otra línea tenga que editar `App.tsx`**.

**Decisión clave de la ronda (no reabrir):** el frame Codex es **responsive**, NO el letterbox fijo 1700×950 desktop-only que describe el handoff. Conservas mobile y tablet reusando el patrón `ModoRevisionMobile` existente. Eres OWNER único de `App.tsx` y del directorio de shell Codex.

Eres pura **piel de presentación**: cero lógica, cero store, cero modelo, cero proyección. Si crees necesitar tocar un ViewModel o el store, **te detienes y reportas** — cruzaste a lógica.

---

## 2. HU base

| HU | Path absoluto | Aporte a esta línea |
|---|---|---|
| HU-20.001 — Ver árbol OPD persistente en panel lateral izquierdo | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-20-estructura-arbol-opd.md` | La columna izquierda del CodexFrame preserva el índice/árbol como región persistente. |
| HU-20.010 — Ajustar ancho del panel árbol con divisor arrastrable | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-20-estructura-arbol-opd.md` | El frame debe seguir usando divisores/resizers existentes para no perder ergonomía. |
| HU-50.001 — Renderizar panel OPL-ES persistente | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | El OPL deja la franja inferior, pero sigue persistente en el margen derecho. |
| HU-50.004 — Mover panel OPL-ES al panel lateral | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Autoriza funcionalmente la absorción del OPL en el margen lateral Codex. |
| HU-SHARED-006 — Dirty state | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-006-dirty-state.md` | Header/meta del frame debe conservar estado de guardado y señales de cierre/navegación. |

**Contrato Codex + SSOT:**

**Specs Codex eje:**
- `ui-forja/01-design-spec.md §1` (filosofía: la página es la interfaz; tipografía antes que UI; hairlines no shadows) y **§2 Frame general** (anatomía de 3 columnas + header + footer; dimensiones canónicas).
- `ui-forja/02-components.md` — **§1 CodexFrame** (props, anatomía, header/footer), **§2 CodexColHeader** (kicker + título serif + side), **§4 CodexCanvasMount** (wrapper del paper: label + zoom + hairline + `paperContainerRef`), **§13 CodexFooterKey** (kbd + label, border por canon OPM).
- `ui-forja/03-scenes.md` — escenas 01–04 son **un solo editor**, el frame nunca cambia; solo varían qué llena las 3 regiones y el `floating`.
- Implementación de referencia React del chrome: `ui-forja/src/variant-codex.jsx` (`CodexFrame`, `CodexColHeader`, `CodexFooterKey`, `CodexCanvas`/`CodexCanvasMount`). Screenshot: `ui-forja/screenshots/01-editor.png`.

**SSOT (capa UI no semántica):**
- **V-202 / V-203**: crimson `#8e2a2e` es **canal UI exclusivo** (acento editorial, selección, severidad) — **nunca** semántica OPM. El canon V-63 del canvas (objeto verde, proceso azul, estado oliva) lo aplica L4 dentro de JointJS; el frame no pinta símbolos.
- El frame es chrome HTML/CSS puro: NO toca el SVG del paper (regla `02-components.md §4`). Verificadas en `ui-forja/06-ssot-compliance.md`. Ante conflicto Codex vs SSOT, manda la SSOT (regla de oro #1).

**Tokens:** todo color/fuente/espaciado del chrome sale de `tokens.ts` (OWNER L1). Cero hex/familia/spacing hard-coded en tus componentes. La paleta Codex (`paper #fafaf8`, `ink #171511`, `inkMid #5a564c`, `inkSoft #a39e92`, `inkFaint #cfcbc1`, `rule #e4e0d6`, `ruleStrong #c7c2b6`, `crimson #8e2a2e`) y las familias (Inria Serif / Inria Sans / JetBrains Mono) llegan vía tokens de L1. Si un token que necesitas no existe aún, lo declaras como pendiente para L1 y usas un fallback de `tokens` existente — **no inventas el hex en tu archivo**.

---

## 3. Anclaje a evidencia (paths/líneas concretas)

**Estado actual de `app/src/ui/App.tsx` (618 líneas, leído completo):**
- **Grid raíz desktop** (`layout.page`, L396-404): `gridTemplateRows: "48px 32px minmax(0,1fr) auto auto"` → toolbar(48) + barra-pestañas(32) + workbench(1fr) + divisor-opl + panel-opl. `pageStyle` (L545-551) recalcula filas según `oplMinimizado`/`altoPanelOpl`.
- **Workbench grid 4 columnas** (`layout.workbench` L405-419 + `workbenchStyle` L553-573): `gridTemplateColumns: "{arbol}px 6px minmax(0,1fr) {divisorInsp} {inspector}"`, `gridTemplateAreas: "tree divisor canvas divisorInspector inspector"`.
- **Montaje del canvas** (la línea que el reporte pide): `<JointCanvasFeedbackBoundary onAdapterChange={setCanvasAdapter} />` en **L280** (rama desktop, dentro de `div[data-testid="canvas-pane"]` L273) y **L203** (rama mobile, dentro de `canvas-pane` mobile L196). El adapter se guarda en estado local `canvasAdapter` (L114) y se inyecta por `CanvasAdapterContext.Provider` (L167). Junto al canvas montan: `BarraHerramientasElemento` (L281/204), `EstadoVacioOpm` (L290), `PantallaInicio` (L293/209). Mapa: `<MapaSistema/>` en `Suspense` cuando `esViewPointMapa` (L274-277 / 197-200).
- **Árbol** (`tree-pane` L244-267): `<ArbolOpd/>` + `BibliotecaDock` opcional bajo divisor horizontal cuando `dockVisible`.
- **Inspector** (`inspector-pane` L317-328): `<Inspector/>` + `<Timeline/>` condicional. Divisor `divisor-panel-inspector` L303-316 (`invertirDelta`, `gridArea: "divisorInspector"`).
- **Panel OPL inferior** (L330-345): `divisor-panel-opl` (`invertirDelta`, `setAltoPanelOpl`) + `div[data-testid="opl-pane"]` con `<PanelOpl/>`. Estado local `altoPanelOpl` (L113), `oplMinimizado` derivado (L119).
- **`PanelDiagnostico`** monta suelto en L346.
- **Rama mobile** (`esMobile`, L191-240): `section[data-testid="mobile-revision-section"]` con `canvas-pane` mobile + overlay `mobile-pane-{opds|opl|issues}` (L213-238) + `<ModoRevisionMobile/>` (L239, barra de tabs inferior).
- **Diálogos lazy** (L349-375): se montan tras el layout, gateados por flags del ViewModel. `<CapturadorBugs/>` L376.

**ViewModels que consume el shell (NO se tocan — son el contrato de datos):**
- `useAppShellViewModel()` (`app/src/app/viewmodels/appShellViewModel.ts`) = spread de `useZustandAppShellWorkbenchPort` + `useZustandAppShellOverlaysPort`. El puerto workbench (`appShellWorkbenchPort.ts`) expone: `vistaMapaActiva`, `anchoPanelArbol`, `anchoPanelInspector`, `preferenciasOpl`, `modelo`, `opdActivoId`, `fijarAnchoPanelArbol/Inspector`, `modeloPersistidoId`, `pantallaInicioCerrada`, `seleccionIdOpl`, `enlaceSeleccionIdOpl`, `vistaMobileActiva`, `bibliotecaDockAbierto`, `cerrarBibliotecaDock`, `cambiarOpdActivo`, `modoSimulacionActivo/EnlaceActivo/CreacionActivo`. El puerto overlays aporta los flags de diálogos.
- `panelOplMinimizadoEfectivo` (`panelOplViewModel.ts`), `usePrecargaBienvenida`, `tituloViewPointWorkbench` (`contextoWorkbench.ts`), `resolverContextoWorkbench` (`contexto.ts`), `obtenerRefinamiento` (modelo). Todos LECTURA.

**Layout responsive existente:** `app/src/ui/layoutResponsive.ts` — `useBreakpoint()` devuelve `"mobile"|"tablet"|"desktop"` con thresholds **`<640` mobile, `640-1023` tablet, `≥1024` desktop**. Helpers puros `usaPanelesComoDrawers(bp)` (true salvo desktop), `permiteDockBiblioteca(bp)`, `permiteToolbarModeladoPesado(bp)`. **Reusa estos; no redefinas breakpoints.**

**Resize:** `app/src/ui/divisorPanel.tsx` — `DivisorPanel` (orientación, anchoInicial/Min/Max, `invertirDelta`, `resetValue`, `testId`, `title`, `gridArea`). Reúsalo tal cual para los divisores índice↔canvas y canvas↔margen.

**Mobile:** `ModoRevisionMobile.tsx` — barra de tabs `canvas/opds/opl/issues`, testIds `mobile-tab-*`, ya re-pielado a tokens en Ronda 28; L5 es OWNER de re-pielarlo a Codex, **tú solo lo montas**.

**Evidencia OPCloud revisada (declaración obligatoria §2 README):** `opm-extracted/INDEX.md` lista el módulo `layout/` Angular: `MainComponent` (668 líneas), `HeaderComponent` (626), `OplContainerComponent` (540, contenedor OPL), `NavigatorComponent`, `LayoutModule`/`OpcLayoutModule`. **Conceptualmente** confirman la topología OPCloud header + main-canvas + OPL-container lateral (justifica el patrón de 3 regiones), pero su shell es Angular/Material con barras pesadas — **antitético a Codex** (tipografía/hairlines). **No se recicla código**: el frame Codex es type-led y los ViewModels Preact ya cubren los datos. `docs/JOYAS.md` no cubre shell (solo layout de estados dentro de objetos). Conclusión: nada que reciclar a nivel de chrome; se construye nuevo sobre tokens L1.

---

## 4. Archivos permitidos

| Archivo | Modo |
|---|---|
| `app/src/ui/App.tsx` | **EDIT** (OWNER único) |
| `app/src/ui/codex/CodexFrame.tsx` | **NUEVO** |
| `app/src/ui/codex/CodexColHeader.tsx` | **NUEVO** |
| `app/src/ui/codex/CodexCanvasMount.tsx` | **NUEVO** |
| `app/src/ui/codex/CodexFooterKey.tsx` | **NUEVO** |
| `app/src/ui/tokens.ts` | **LECTURA** (OWNER L1) |
| ViewModels / puertos / `layoutResponsive.ts` / `divisorPanel.tsx` / `ModoRevisionMobile.tsx` | **LECTURA** |

Tests nuevos de los componentes shell (`app/src/ui/codex/*.test.tsx`) **permitidos** si testean piel pura (snapshot de estructura/props), sin tocar store. Opcional un `frameApi.ts` o interface co-ubicada en `CodexFrame.tsx` con el tipo `CodexFrameProps` exportado (lo importarán L3/L5/L6).

**Prohibido** crear/editar: `MargenDerecho.tsx`, `glifos.ts`, `CommandPalette.tsx`, `Inspector*`, `PanelOpl.tsx`, `ArbolOpd.tsx`, cualquier `*.css` global, y todo lo listado en README §2 "NO tocar".

---

## 5. Restricciones de no-colisión

- **Solo L2 edita `App.tsx`.** Es el choque crítico controlado (README §5). L3 (margen unificado), L5 (re-piel de árbol/diálogos/mobile) y L6 (palette/glifos) se montan **vía las props del CodexFrame** — nunca editan `App.tsx`.
- **Expones una API estable de frame.** `CodexFrameProps` con las regiones como `ReactNode`/`ComponentChildren`:

  ```ts
  export interface CodexFrameProps {
    breadcrumb?: string[];        // header centro (último item bold)
    meta?: string;                // header derecha ("24 oraciones · sin guardar")
    leftTree: ComponentChildren;  // L5 monta CodexColHeader + ArbolOpd repielado
    canvasMount: ComponentChildren; // contenedor del paper (CodexCanvasMount)
    rightPanel: ComponentChildren;  // L3 monta MargenDerecho (OPL↔Inspector unificado)
    floating?: ComponentChildren;   // overlays HTML absolutos sobre el canvas (hints, CommandPalette de L6, SelectionAnnotation)
    footerCenter?: ComponentChildren; // leyendas de tecla (CodexFooterKey ×N)
    footerRight?: string;         // estado diagnóstico ("✓ ningún diagnóstico")
  }
  ```

  Replica los nombres del handoff (`variant-codex.jsx` usa `canvas`; renómbralo a `canvasMount` para alinear con `02-components.md §1`). **Documenta esta API en JSDoc del componente** — es el contrato inter-línea.
- En `App.tsx`, **tú** compones el `leftTree`/`rightPanel`/`floating` con los componentes existentes **tal cual existen hoy** (ArbolOpd, Inspector, PanelOpl, etc.). L3/L5 luego los repielan en sus propios archivos; mientras no mergeen, el frame ya funciona con los componentes actuales. No bloquees a nadie: el frame debe renderizar verde con la composición que armes hoy.
- `src/ui/codex/` es directorio compartido pero **sin colisión a nivel de archivo**: tú creas `CodexFrame/ColHeader/CanvasMount/FooterKey`; L3 crea `MargenDerecho/CodexOPLNote`; L6 crea `glifos`. No toques archivos de otra línea.

---

## 6. Slice mínimo shippeable

**Estructura del CodexFrame (desktop):** grid de 3 filas × 3 columnas, áreas nombradas:

```
gridTemplateRows: "{header}px 1fr {footer}px"          // 60 / 1fr / 44 vía tokens
gridTemplateColumns: "{left}px {divIzq} 1fr {divDer} {right}px"
gridTemplateAreas:
  "head  head     head    head    head"
  "left  divIzq   canvas  divDer  right"
  "foot  foot     foot    foot    foot"
```

- **left ≈ 210px, right ≈ 360px** (canónicos handoff) pero **ligados a `anchoPanelArbol`/`anchoPanelInspector` del store** vía `DivisorPanel` (índice ↔ canvas; canvas ↔ margen). Default visible = los valores Codex; el store sigue siendo la fuente. **Reusa los testIds `divisor-panel-arbol`/`divisor-panel-inspector`** para no romper `23-inspector-resize.spec.ts`. Las columnas divisor son 6px (igual que hoy).
- **HEAD (60px):** wordmark "Opforja" (Inria Serif italic 22) sobre la columna izquierda · breadcrumb mono centrado · meta italic + kbd `⌘K` a la derecha. Hairlines `rule` entre celdas (replica `variant-codex.jsx` L84-129).
- **CANVAS (1fr):** región central que contiene el `CodexCanvasMount` (`canvasMount` prop) + `floating` superpuesto absoluto. **Aquí monta el canvas existente sin tocarlo:** `CodexCanvasMount` provee `label`+`zoom`+hairline y un `<div>` `flex:1` donde, **en `App.tsx`**, sigues renderizando `<JointCanvasFeedbackBoundary onAdapterChange={setCanvasAdapter}/>` exactamente como en L280 — con su `CanvasAdapterContext.Provider`, `BarraHerramientasElemento`, `EstadoVacioOpm`, `PantallaInicio`, y la rama `MapaSistema` cuando `esViewPointMapa`. **El `div[data-testid="canvas-pane"]` se preserva** envolviendo el mount. El label/zoom del CanvasMount sale de `contextoWorkbench`/adapter (lectura).
- **RIGHT (360px):** región `rightPanel`. **Aquí va la absorción del OPL:** L3 entrega un `MargenDerecho` unificado (marginalia OPL ↔ inspector según selección). L2 **migra** el OPL desde la franja inferior al margen derecho como composición provisional (`<Inspector/>` + `<PanelOpl/>` apilados), preservando `inspector-pane` y **preservando `data-testid="opl-pane"` dentro del margen**. La fila OPL inferior desaparece del grid, pero `divisor-panel-opl` debe quedar como hairline/compat element no interactivo o como alias del divisor derecho hasta que L3 actualice la semántica de tests. No puede haber ruptura esperada del gate verde. **Documenta en JSDoc que el OPL fue absorbido por `rightPanel` y que L3 reemplazará la composición provisional por `MargenDerecho`.**
- **FOOT (44px):** 3 columnas equidistantes — fecha/versión mono izquierda · `footerCenter` (CodexFooterKey ×5: O/P/S/R verde/azul/oliva/rule + ⌘K) centro · `footerRight` (estado diagnóstico) derecha. `PanelDiagnostico` puede alimentar `footerRight`, pero **no elimines su superficie/testIds en L2**: hasta que L3 lo absorba como marginalia, mantenlo montado como `floating`/compat o equivalente visualmente integrado. L3 es OWNER de la re-piel real de diagnósticos.

**Estrategia responsive (reusa `useBreakpoint`):**
- **`desktop` (≥1024):** frame de 3 columnas completo descrito arriba.
- **`tablet` (640–1023):** mantiene las 3 columnas pero **índice y margen como drawers** colapsables desde los bordes (reusa `usaPanelesComoDrawers(bp)===true`), con el canvas dominando el ancho. Header/footer se conservan. Un toggle tipográfico en el header abre/cierra cada drawer (palabra, no botón cromado — coherente con Codex).
- **`mobile` (<640):** delega al patrón existente: `section[data-testid="mobile-revision-section"]` + `<ModoRevisionMobile/>` (tabs `canvas/opds/opl/issues`). **El CodexFrame NO se monta en mobile**; conservas la rama `esMobile` actual intacta (solo re-pielada por L5 más adelante). El header Codex puede degradar a una barra compacta sobre el canvas; el footer se omite (los tabs lo reemplazan).

**Decisión de tensión letterbox → responsive:** descartas `transform: scale` / `1700×950` fijo. El frame usa `width/height: 100%` + `minmax(0,1fr)` para la columna central, igual que `variant-codex.jsx` (L70-83 ya usa `1fr`, no px fijo, en la columna central). Las columnas laterales son px ligadas al store con `minmax` defensivo.

---

## 7. Tests (qué podría romper)

Specs que tocan layout y dependen de testIds que **debes preservar**:
- `02-canvas-y-render.spec.ts` → `viewpoint-heading`, `inspector-pane`.
- `03-opl-panel.spec.ts` → **`canvas-pane`, `opl-pane`, `divisor-panel-opl`.** La absorción del OPL no autoriza romper estos selectors: `opl-pane` se conserva dentro del margen derecho y `divisor-panel-opl` queda como compat hairline/alias hasta que L3 reescriba la experiencia completa. L2 no edita este spec; si no puede mantenerlo verde mediante compat DOM, se detiene y reporta.
- `04-arbol-y-pestanas.spec.ts` → `tree-pane`, `canvas-pane`.
- `22-responsive-review.spec.ts` → `tree-pane`, `canvas-pane`, `inspector-pane`, `opl-pane`, `modo-revision-mobile`, `mobile-tab-*`, `mobile-pane-*`. **Preserva la rama mobile completa.**
- `23-inspector-resize.spec.ts` → `inspector-pane`, `divisor-panel-inspector`. **Preserva el divisor del inspector con su testId.**
- `_smoke-helpers.ts` → `canvas-pane`, `tree-pane`, `inspector-pane` (helpers compartidos por casi todos los specs).

**Contrato de testIds a preservar SÍ o SÍ:** `canvas-pane`, `tree-pane`, `inspector-pane`, `opl-pane`, `divisor-panel-opl`, `viewpoint-heading`, `divisor-panel-arbol`, `divisor-panel-inspector`, `modo-revision-mobile`, `mobile-revision-section`, `mobile-tab-{canvas,opds,opl,issues}`, `mobile-pane-{opds,opl,issues}`. `opl-pane`/`divisor-panel-opl` migran al margen derecho, pero no desaparecen.

---

## 8. Verificación

```bash
cd app
bun run check          # typecheck + unit — gate mínimo, verde obligatorio
bun run typecheck      # tsc --noEmit estricto
bun run lint           # eslint sobre lo nuevo
```

Smoke **solo con el dev server apagado** (flakes en specs canvas 02/05 con vite en background — memoria del proyecto):

```bash
# matar cualquier vite en background antes
bun run browser:smoke
```

Foco en `02`, `03`, `04`, `22`, `23` (los que tocan layout). El gate debe cerrar verde sin editar specs de otras líneas; la compatibilidad de `03` se preserva con DOM/testIds, no con excepción. Validación in-vivo con skill `test-vivo-iterativo-opmkv` contra `ui-forja/screenshots/01-editor.png` recomendada antes de entregar.

---

## 9. Decisiones bloqueadas (no reabrir)

1. Frame **responsive**, no letterbox 1700×950 fijo. Conservar mobile/tablet.
2. Margen derecho **unificado** (OPL marginalia ↔ inspector) — su contenido lo construye **L3**; tú solo expones la región/prop `rightPanel`.
3. `App.tsx` sigue consumiendo los ViewModels actuales **sin tocarlos**.
4. `App.tsx` **deja de montar el panel OPL inferior**, pero conserva `opl-pane`/`divisor-panel-opl` como testIds de compatibilidad en el margen derecho; el OPL vive en `rightPanel`.
5. Tokens = fuente única (L1). Crimson = canal UI (V-203), nunca semántica.
6. El canvas se monta **sin tocar** `JointCanvasFeedbackBoundary` ni la proyección; solo cambia su contenedor (CodexCanvasMount).

---

## 10. Decisiones que tomas vos

- **Breakpoints exactos:** reusa los de `layoutResponsive.ts` (`<640` mobile / `640–1023` tablet / `≥1024` desktop). No introduzcas otros.
- **Anchos de columna:** desktop `left ≈ 210` / `right ≈ 360` como defaults visibles, ligados al store (`anchoPanelArbol`/`anchoPanelInspector`) con `minmax` defensivo. Decide los `min/max` razonables reusando los del store (`ANCHO_PANEL_INSPECTOR_MIN/MAX/DEFAULT`, `ANCHO_PANEL_ARBOL_*`).
- **Mecánica de drawer en tablet:** colapsable desde el borde con toggle tipográfico en el header (palabra subrayable, no botón). Decide si el drawer es overlay absoluto o columna que se contrae a 0; preferible columna contraíble para no romper `inspector-pane`/`tree-pane` presentes en el DOM.
- **Header/footer en mobile:** decide la degradación (header compacto sobre canvas; footer omitido a favor de tabs). Mantén `viewpoint-heading` (sr-only) en todos los breakpoints.
- **Nombre interno de la prop del canvas:** `canvasMount` (alineado a `02-components.md §1`).
- Si un token Codex aún no existe en `tokens.ts` al integrar, decide un fallback de `tokens` existente y declara el pendiente para L1 — nunca hardcodees el hex.

---

## 11. Forma del entregable

- Commits en la rama `linea-2-codex-wip` con prefijo **`feat(ui)`** (o `style(ui)` para ajustes puramente visuales), scope estricto a los 5 archivos permitidos + tests shell. Footer co-author del operador.
- Mensaje del commit que introduce el frame **debe declarar**: (a) `App.tsx` migrado a CodexFrame 3-columnas responsive; (b) panel OPL inferior eliminado, absorbido a `rightPanel`; (c) API `CodexFrameProps` expuesta para L3/L5/L6; (d) testIds preservados y los que migran.
- **No tocar:** store, modelo, proyección, ViewModels/puertos, OPL pipelines, `tokens.ts`, ni archivos de otras líneas en `src/ui/codex/`. `HANDOFF.md` NO se toca (lo reescribe el operador al cierre).
- Bugs fuera de scope → patch a `/tmp`, no se mezclan al WIP.
- Entrega con `bun run check` verde y sin specs rotos esperados. Si `03-opl-panel` no puede quedar verde con compat DOM/testIds, detente y reporta a steipete; no cruces a ownership de L3.
