# L5 — Reconciliación de scope (lenguaje Codex para lo preservado)

> **Ronda Codex · Ola 2 (en paralelo con L3).** Depende de merge de **L1** (tokens) y **L2** (CodexFrame + API de montaje). Riesgo medio: re-piel de superficies existentes, sin tocar lógica.
> Lee primero `README.md` (reglas duras §2, tabla de colisiones §5, orden de merge §6) y este brief.

---

## 1. Misión

Dar lenguaje visual **Codex** a todo lo que el handoff Codex v1 **no diseñó** pero que la app YA tiene y **se conserva** (postura "preservar todo"): el árbol de OPDs, la biblioteca dock, el modo revisión mobile, los ~16 diálogos/modales, y el chrome de la vista de mapa del sistema. Es **re-piel** (tokens + glifos + tipografía pura) de componentes existentes — **cero pérdida de funcionalidad**, cero lógica nueva. Cada superficie se monta dentro del `CodexFrame` de L2 (vía sus props `leftTree`/`floating`/regiones) o como overlay HTML; no editas `App.tsx`.

La tensión que cierras: el handoff diseñó un frame de 3 columnas **sin** dock ni mapa como vistas. Como preservas todo, defines **dónde vive cada cosa** en ese frame (§10).

---

## 2. HU base

| HU | Path absoluto | Aporte a esta línea |
|---|---|---|
| HU-20.001 / HU-20.007 / HU-20.010 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-20-estructura-arbol-opd.md` | Árbol persistente, navegación y resize sobreviven con `CodexTreeRow`. |
| HU-20.011 / HU-20.014 / HU-20.020 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-20-estructura-arbol-opd.md` | Menú contextual, renombrar y gestión del árbol preservan su UI bajo piel Codex. |
| HU-21.001 / HU-21.003 / HU-21.006 / HU-21.014 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-21-estructura-mapa-sistema.md` | Mapa del sistema, suspensión OPL y panel estadístico se conservan como vista central. |
| HU-34.008 / HU-34.027 — Biblioteca lateral vacía/poblada | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md` | Biblioteca dock se preserva como overlay, no se elimina por el frame Codex. |
| HU-SHARED-004 — Renombrar | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-004-renombrar.md` | Diálogos de renombrar mantienen comportamiento y solo cambian piel. |
| HU-SHARED-005 — Eliminar con scope | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-005-eliminar-con-scope.md` | Diálogos de eliminación mantienen opciones de alcance y cancelación. |
| HU-SHARED-009 — Validación nominal | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-009-validacion-nominal.md` | Indicadores de validación nominal sobreviven al cambio visual. |
| HU-SHARED-003 — Permisos/read-only | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-003-permisos-readonly.md` | Re-piel de diálogos no puede ocultar estados disabled/read-only ni acciones no permitidas. |

**Contrato Codex + SSOT:**

- **`02-components.md §3 — CodexTreeRow`** (regla dura del árbol):
  - Tipografía pura: **sin íconos de carpeta, sin chevrones**.
  - `code` en JetBrains Mono 10px al inicio; `label` en Inria Serif 14px.
  - Padding `4px 0`, indent `level × 18px`, **hairline-dotted** abajo.
  - **Current**: peso 600 + color ink full + marker `▸`. No-current: peso 400, inkMid.
  - **NO** contadores por diagrama (`7o · 1p · 8e` — rechazado). **NO** "Mapa del sistema" como entrada del árbol. Solo OPDs reales + fila de creación (`+`).
- **`06-ssot-compliance.md §5 — deuda v1`**: el handoff difirió explícitamente mapa, mobile, sub-modelos, asistente. Tú **recuperas** mapa/mobile/diálogos en lenguaje Codex (no los reintroduces como deuda; los vistes). No reabres asistente interactivo (lo cubre L6 con el command palette) ni sub-modelos.
- **`01-design-spec.md` §3-§6** (tokens, tipografía, hairlines, glifos) — fuente única de estilo.
- SSOT relevante: **V-202/V-203** (UI no semántica usa canal crimson reservado; nada de verde/azul/olive como UI), **V-212** (sin truncamiento silencioso — el label del árbol expande, no `ellipsis`), **§1.7** tipografía OPL (si algún diálogo muestra nombres OPM, usa los helpers `OplObj/OplProc/OplState` de L3).

---

## 3. Anclaje a evidencia (estado actual)

| Superficie | Archivo(s) | Hecho relevante |
|---|---|---|
| Árbol — barrel | `app/src/ui/ArbolOpd.tsx:24-275` | header con botones `Manual/Auto/ID/Aa/▾/⋯`; styles Bauhaus en `style` (L297-432, tokens `accent`, `ink04/15/70`). |
| Árbol — fila | `app/src/ui/arbol/NodoOpd.tsx:6-36` | **renderiza SVG `list-logical/*.svg` + `delete.svg`** y chevrones — **viola CodexTreeRow**. Hay que reemplazar por tipografía pura + glifos. |
| Árbol — CSS | `app/src/ui/arbol/arbol.css` | estilos del árbol (EDIT permitido). |
| Árbol — menú ctx | `app/src/ui/MenuContextualArbol.tsx`, `app/src/ui/GestionArbolOpd.tsx` | menú contextual + diálogo de gestión. |
| Biblioteca dock | `app/src/ui/biblioteca/BibliotecaDock.tsx:33-266`, `ListaBibliotecaCosas.tsx` | **usa nombres de token VIEJOS** (`fondoChrome`, `acentoUi`, `azulAccion`, `radii.pill`…) que **NO existirán tras L1** → migración obligatoria. Chips tipo pill (prohibido). |
| Mobile | `app/src/ui/ModoRevisionMobile.tsx:42-168` | 4 tabs (Canvas/OPDs/OPL/Sugerencias), glifos Unicode `▦⎘¶!`, ya migrado a tokens nuevos. Re-piel ligera. |
| Diálogo base | `app/src/ui/Dialogo.tsx:67-244` | **base común** de casi todos los diálogos (portal a body, foco, Esc). Re-pelar aquí propaga a todos. |
| Diálogos | `app/src/ui/Dialogo{BuscarCosas,BuscarGlobal,CargarModelo,Configuracion,Confirmacion,EstiloEnlace,GuardarComo,ImportarExportarJson,MoverPuerto,Plantillas,TraerConectados,Versiones}.tsx` (12) + `Modal{DuracionEstado,ImagenObjeto,UrlsObjeto}.tsx` (3) | 15 superficies modales + `Dialogo.tsx` base. |
| Mapa — vista | `app/src/ui/MapaSistema.tsx`, `MapaFiltros.tsx`, `MapaPanelEstadisticas.tsx`, `app/src/ui/toolbar/ToolbarMapaSistema.tsx` | el **canvas JointJS interno del mapa NO se toca** (es render); sí su **chrome** (toolbar, filtros, panel estadísticas, tooltip). |
| Cómo se invoca el mapa | `App.tsx:164` `contextoWorkbench.modo === "mapa"` → reemplaza el `canvas-pane` central por `<MapaSistema/>`; toggle vía `abrirVistaMapa` (`arbolOpdViewModel.ts:23`). testId `mapa-sistema`. **El mapa NO es entrada del árbol**: hoy se entra desde un botón del chrome; en Codex la entrada vive en el command palette (`NAVEGAR → mapa del sistema`, lo provee L6). |
| Evidencia OPCloud | `opm-extracted/MODULES.md` (`src/app/dialogs/**`, `rappidEnviromentFunctionality/shared.ts:ConfirmDialog/EnterValueDialog`) | OPCloud usa Angular **MatDialog / `cdk-overlay-pane`** — ya citado como referencia conceptual en `Dialogo.tsx:18-22`. **Conceptual, no se clona** (Preact≠Angular). `OPX.Inzoomed_Tree/Unfolded_Tree` confirman semántica de árbol in-zoom/unfold (ya implementada). `docs/JOYAS.md` no aporta marcador nuevo para árbol/diálogo. |

---

## 4. Archivos permitidos

**EDIT (OWNER):**
```text
app/src/ui/ArbolOpd.tsx                         EDIT
app/src/ui/arbol/NodoOpd.tsx                    EDIT
app/src/ui/arbol/badges.ts                      EDIT solo estilo/glifo
app/src/ui/arbol/arbol.css                      EDIT
app/src/ui/MenuContextualArbol.tsx              EDIT
app/src/ui/GestionArbolOpd.tsx                  EDIT
app/src/ui/biblioteca/BibliotecaDock.tsx        EDIT
app/src/ui/biblioteca/ListaBibliotecaCosas.tsx  EDIT
app/src/ui/ModoRevisionMobile.tsx               EDIT
app/src/ui/Dialogo.tsx                          EDIT base común
app/src/ui/Dialogo*.tsx                         EDIT diálogos listados en §3
app/src/ui/Modal*.tsx                           EDIT modales listados en §3
app/src/ui/MapaSistema.tsx                      EDIT chrome HTML
app/src/ui/MapaFiltros.tsx                      EDIT chrome HTML
app/src/ui/MapaPanelEstadisticas.tsx            EDIT chrome HTML
app/src/ui/toolbar/ToolbarMapaSistema.tsx       EDIT chrome de mapa
app/e2e/04-arbol-y-pestanas.spec.ts            EDIT opcional si cambia assert visual
app/e2e/20-biblioteca-dock.spec.ts             EDIT opcional si cambia assert visual
app/e2e/11-dialogo-layout-regression.spec.ts   EDIT opcional si cambia assert visual
app/e2e/22-responsive-review.spec.ts           EDIT opcional si cambia assert visual
```

**LECTURA:**
```text
app/src/ui/tokens.ts                            LECTURA (L1)
app/src/ui/codex/glifos.ts                      LECTURA (L6)
app/src/ui/codex/CodexFrame.tsx                 LECTURA (L2)
app/src/ui/codex/CodexColHeader.tsx             LECTURA (L2)
app/src/ui/codex/CodexCanvasMount.tsx           LECTURA (L2)
ui-forja/01-design-spec.md                      LECTURA
ui-forja/02-components.md                       LECTURA
ui-forja/06-ssot-compliance.md                  LECTURA
```

---

## 5. Restricciones de no-colisión

- **NO** editar `App.tsx` (OWNER L2). Si necesitas que el frame exponga un slot para el dock o el mapa, **detente y solicita a L2** ese contrato vía la prop `floating`/regiones; no lo fuerces.
- **NO** tocar `CodexFrame.tsx`/`MargenDerecho.tsx`/`glifos.ts`/`CommandPalette.tsx`/`MenuPrincipal.tsx`/`BarraPestanas*` ni toolbar global. **Única excepción toolbar:** `app/src/ui/toolbar/ToolbarMapaSistema.tsx`, porque es chrome propio de la vista mapa y es OWNER de L5.
- **NO** crear `glifos.ts` — es de L6. Si L6 aún no mergeó cuando arrancas, usa glifos Unicode literales mínimos y refactoriza a `import { glifos } from "../codex/glifos"` cuando esté disponible (coordinación de ola).
- **NO** tocar `src/store/**`, `src/modelo/**`, `proyeccion.ts`, `opcloudRouting.ts`, `mapa/proyeccion.ts`, `mapaSistema.ts` (render), `mapaExport.ts`, ViewModels, persistencia, OPL, leyes. Si crees necesitarlo, **es señal de que cruzaste a lógica → detente y reporta**.
- **Tokens**: cero hex/fuente/espaciado hard-coded. Todo desde `tokens`. La migración de nombres viejos→nuevos en `BibliotecaDock` es **obligatoria** (hoy referencia tokens inexistentes post-L1).

---

## 6. Slice mínimo shippeable

En este orden (cada paso cierra con `bun run check` verde):

1. **CodexTreeRow** — reescribir `NodoOpd.tsx` como fila tipográfica pura: quitar los `<img>` de `list-logical/*.svg` y `delete.svg` y los chevrones; `code` mono + `label` serif, indent `level×18`, hairline-dotted, current con `▸` peso 600. Acciones (eliminar, etc.) pasan a glifos Unicode (`⌫`) en hover/menú contextual, no íconos. **Sin contadores por diagrama**; los badges de diagnóstico se conservan pero se re-pelan a marca crimson tipográfica (`△`), no pill. Header de `ArbolOpd.tsx`: botones a palabras/glifos Codex (kicker uppercase tracked; `Aa/ID`, `▾`, `⋯` como glifos). El header de columna lo provee L2/`CodexColHeader`; el árbol se monta vía `leftTree`.
2. **Diálogos** — re-pelar `Dialogo.tsx` base primero (propaga a los 15): backdrop paper 80% + blur o ink suave (no negro puro `rgba(10,10,10,.30)` actual → token Codex), borde `tokens.colors.ruleStrong`, **sin radius**, título Inria Serif, acciones como **palabras separadas por `·`** (no botones cromados; ver patrón prohibido `02` apéndice). Luego revisar caso por caso los que tengan chrome propio (Configuracion, Plantillas, ImportarExportar, Versiones, BuscarGlobal) para quitar pills/switches/botones. Orden de re-piel: base → confirmación/guardar/cargar (simples) → buscar/plantillas/config (densos) → modales de estado/imagen/urls.
3. **Biblioteca dock** — migrar tokens viejos→Codex; chips pill → **segmented inline** (palabras separadas por `·`, activa subrayada, patrón `CodexInspectInline`). Destino en el frame: **overlay HTML flotante** vía prop `floating` del CodexFrame (no es columna). Toggle desde command palette `VISTA → biblioteca dock` (L6). Conserva búsqueda + filtros + lista drag-to-canvas.
4. **Mapa** — re-piel del chrome (toolbar/filtros/estadísticas/tooltip) a tokens+glifos Codex, conservando el frame: el mapa **reemplaza el canvas central** (toggle de viewpoint actual), header de columna central pasa a kicker Codex "Mapa del sistema". El SVG interno del mapa no se toca.
5. **Mobile** — re-piel ligera (ya está en tokens nuevos): confirmar glifos y subrayado activo Codex; **degradación coordinada con L2** (L2 decide letterbox vs. layout mobile; tú solo vistes la barra de tabs y el aviso "Editar en escritorio o tablet").

---

## 7. Tests

- `e2e/04-arbol-y-pestanas.spec.ts` — árbol; verifica que sigue verde tras CodexTreeRow (testIds `data-opd-id`, `tree-pane` se conservan).
- `e2e/20-biblioteca-dock.spec.ts` — dock; testIds `biblioteca-dock`, `biblioteca-filtro-*`, `biblioteca-dock-contador` **se conservan** aunque cambie el estilo.
- `e2e/11-dialogo-layout-regression.spec.ts` — regresión de layout de diálogos tras re-piel del base.
- `e2e/22-responsive-review.spec.ts` — mobile; testIds `mobile-tab-*` (incl. `mobile-tab-issues`) **inmutables**.
- Mapa: cubierto por `04-arbol-y-pestanas.spec.ts:224` (`mapa-sistema` count) — no romper el testId `mapa-sistema`.
- **Regla**: cambias estilo, **no** testIds ni roles ARIA. Si un test asserta estilo concreto Bauhaus, actualízalo al valor Codex.

---

## 8. Verificación

```bash
cd app
bun run check          # typecheck + unit — GATE, debe quedar verde
bun run lint           # eslint
# smoke SOLO con dev server apagado (flakes canvas 02/05):
bun run browser:smoke  # baseline: sin regresiones nuevas vs main
```

Validación in-vivo opcional con skill `test-vivo-iterativo-opmkv` contra escenas con árbol/dock/mapa/diálogo abierto. Confirmar `bun run build` verde.

---

## 9. Decisiones bloqueadas (no reabrir)

- **Preservar TODO**: mapa, mobile, dock y los 16 diálogos se conservan (NO se eliminan como en Codex v1).
- **Árbol = tipografía pura** (sin íconos de carpeta, sin chevrones, sin contadores por diagrama). Regla dura `02 §3`.
- **Cero íconos vectoriales → glifos Unicode**; coordinar con `src/ui/codex/glifos.ts` (L6) — lo **importas**, no lo creas.
- **No editar `App.tsx`** (L2). Montaje vía API del CodexFrame.
- **Asistente SD** no es tuyo (entrada vía command palette de L6); sub-modelos fuera de scope.

---

## 10. Decisiones que tomas vos

- **Destino de la biblioteca dock**: **overlay HTML flotante** sobre el canvas vía prop `floating` del CodexFrame, no una cuarta columna ni acoplada bajo el árbol como hoy. Razón: el frame Codex es de 3 columnas fijas; meter el dock como columna rompe el contrato `01 §2`. El toggle vive en `VISTA → biblioteca dock` del command palette (L6).
- **Destino del mapa del sistema**: **vista que reemplaza el canvas central** (toggle de viewpoint, como hoy), conservando header/footer del frame. El kicker de la columna central muestra "Mapa del sistema"; la entrada vive en `NAVEGAR → mapa del sistema` (L6), nunca en el árbol.
- **Orden de re-piel de diálogos**: `Dialogo.tsx` base → simples (Confirmacion, GuardarComo, CargarModelo) → densos (Configuracion, Plantillas, ImportarExportarJson, Versiones, BuscarGlobal, BuscarCosas) → modales de entidad (ModalDuracionEstado, ModalImagenObjeto, ModalUrlsObjeto) → especializados (EstiloEnlace, MoverPuerto, TraerConectados).
- **Badges de diagnóstico del árbol**: se conservan como marca tipográfica crimson (`△ + severidad`), no como pill — fuera del marker `▸` del current.
- **Glifo de borrado/acciones de fila**: `⌫` Unicode en hover/menú, reemplazando `delete.svg`.

---

## 11. Forma del entregable

- Rama `linea-5-codex-wip` (git worktree propio). Puede desarrollarse en paralelo con L3 tras L2, pero se mergea **después de L3** para consumir el margen estabilizado: `L1 → L4 → L2 → L6 → L3 → L5` (orden §6 del README).
- Commits con prefijo de capa: `style(ui)` para re-piel pura, `feat(ui)` si un destino cambia (dock→floating). Scope estricto a los archivos de §4. Co-author footer del operador.
- **No tocar**: `App.tsx`, `CodexFrame*`, `MargenDerecho*`, `glifos.ts`, `CommandPalette`, toolbar global (`Toolbar*` excepto `ToolbarMapaSistema.tsx`), `MenuPrincipal`, `BarraPestanas*`, tokens, store/modelo/render-proyección/OPL/persistencia/leyes/ViewModels, `HANDOFF.md`.
- Bugs fuera de scope → patch a `/tmp`, no se mezclan en el WIP.
- testIds y roles ARIA **inmutables**; solo cambia la piel.
