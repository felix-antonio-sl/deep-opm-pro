# Dossier — Shell de interfaz (`app/src/ui/*` archivos raíz)

Fecha de lectura: 2026-09-30 · Repositorio: `/home/user/deep-opm-pro` · Rama: `main`.
Alcance: los ~90 archivos **raíz** de `app/src/ui/` (no las subcarpetas `inspector/`, `toolbar/`,
`codex/`, `panelOpl/`, `arbol/`, `agent/`, `review/`, `portable/`, `reuse/`, `simulacion/`, `mobile/`,
`panelCarpetas/`, que se citan solo cuando determinan la experiencia). Se leyó el código real de
App, paleta, inspectores, menús, diálogos, cintas, persistencia, tokens y atajos, y se contrastó con
`docs/uso-productivo.md`, `ui-forja/GOVERNANCE.md`, `app/src/app/*` (ports/viewmodels) y el kernel
cuando la UI replica una regla.

Volumen: **21.749 líneas no-test** en archivos raíz (+2.838 de tests unitarios); ~15.600 más en
subcarpetas de `ui/`. ~4.900 líneas son objetos de estilo inline (`satisfies Record<string,
JSX.CSSProperties>`), ~1.200 son comentarios, de los cuales ~100 son marcas arqueológicas
(`Ronda 21 L2`, `Codex v2 L3`, `BUG-2026…`). La historia Git está aplastada (69 commits, UI desde
2026-07-26): la genealogía real vive solo en esos comentarios.

---

## 1. Resumen ejecutivo

La shell es un **workbench bimodal OPD/OPL maduro en lo esencial y sobrecargado en todo lo demás**.
El núcleo (canvas JointJS + panel OPL sincronizado + árbol OPD + inspector + creación/enlace con
filtro por firma OPM) es sólido y, en varias piezas (diálogo accesible, registro de atajos,
catálogo único de acciones contextuales, `MenuTipoEnlace` con preview OPL, `Timeline` de
subprocesos), de alta calidad y portable casi tal cual.

Alrededor de ese núcleo se acumularon, ronda tras ronda, **capas de ciclo de vida documental
(Apunte/Taller → Modelo → Biblioteca → Archivo, Bocetos, graduación, reapertura), cinco
mecanismos de reutilización, un agente, un tutor contextual transversal, dos sistemas de
persistencia visibles a la vez, un capturador de bugs de gobernanza, una Mesa de exploración
preformal y un mapa del sistema dormido**. El resultado:

- ~38 superficies modales (34 usos del primitivo `Dialogo` + 4 modales hechos a mano), 4 menús
  contextuales, un halo flotante, una paleta con **43 acciones de menú + ~26 contextuales + ~56
  atajos + referencias del tutor**.
- Acciones básicas escondidas: **Abrir/Nuevo solo existen en `Ctrl+K`** (el menú ☰ que citan los
  docs ya no se monta). "Descargar JSON" solo es accesible dentro del panel "Importar JSON" del
  gestor.
- **Cuatro indicadores de guardado simultáneos** con vocabularios distintos.
- Duplicaciones sistemáticas: 5 formas de renombrar, 3 superficies de acciones de estado, 3 de
  cambiar extremos de enlace, 3 caminos para refinar, 4 listas de etiquetas de tipos de enlace,
  ≥7 derivaciones ad hoc de "¿es apunte?", 5 selectores de modelos con su propio
  `ordenarModelos/coincideBusqueda`.
- Una capa `app/ports` (112 archivos) + `app/viewmodels` (48) que en la shell es mayormente
  *pass-through* de selectores Zustand y que 26 archivos raíz eluden importando `useOpmStore`
  directamente.

Recomendación global: **conservar el núcleo OPM y los primitivos de calidad; colapsar la shell a
un layout de 3 columnas con un header mínimo (Archivo · Pestañas · Ruta · Guardado · ⌘K), un
único router de diálogos, un único indicador de persistencia y un único catálogo de
etiquetas/acciones**, y sacar a módulos opcionales (o eliminar) el ciclo de vida
Taller/Graduación, la Mesa, el mapa, el capturador de bugs, el tutor transversal y los mecanismos
de reuso redundantes.

---

## 2. Layout reconstruido

### 2.1 Desktop (≥1024 px) — `App.tsx:227-412` + `codex/CodexFrame.tsx`

```
┌──────────────────────────────────────── header 48 px (CodexFrame) ─────────────────────────────────────────┐
│ Opforja │ [pestaña A ×][pestaña B ×] │ SD · SD1 · SD1.2 │ ○ Guardado·12:04  [chip rev.]  ● Auto │ ▭Objeto O ⬭Proceso P ◇Estado S [+Atributo] │ Relación R │ 12 oraciones · sin guardar · ⌘K │
├───────── OPL (240 px) ─────────┬──┬──────────────────── canvas ─────────────────────┬──┬── Índice + Inspector (360 px) ──┐
│ OPL          [filtrado·3/12 ✕]◀│÷ │ ┌ topbar ────────────────────────────────────┐ │÷ │ ÍNDICE  OPDs            4   ▶   │
│ [toolbar OPL: buscar, #, copiar,│  │ │ IntentBar «Qué quieres conseguir…»          │ │  │  ├ SD                            │
│  filtro selección, editar, IA,  │  │ │ Guardado aquí · Compartir revisión… ·       │ │  │  │ └ SD1 (Nombre)               │
│  minimizar]                     │  │ │ Proponer refinamiento… · Reutilizar pieza · │ │  │  └ Bocetos: …                   │
│ Bloques OPL (click=seleccionar, │  │ │ Paquete portátil…                           │ │  ├──────────── divisor ───────────┤
│  hover sincronizado, renombrar) │  │ │ ◷ Apunte · en Taller · … [Explorar] [Revisar│ │  │ INSPECTOR  Selección             │
│                                 │  │ │   para graduar]   (o ◆ Modelo / ⊙ Biblioteca)│ │  │  Objeto            o.06          │
│ ─────────────────────────────── │  │ └────────────────────────────────────────────┘ │  │  Nombre [______]                 │
│ ▸ Diagnóstico   3 bloqueos      │  │  zoom · 100%                                    │  │  Semántica ▾ Enlaces ▾ Refinam. ▸│
│   (marginalia expandible 44 %)  │  │  [paper JointJS]  ※ descomponer·desplegar·…    │  │  Extensiones ▸ Anclaje ▸         │
│                                 │  │  «¿Qué tienes más claro ahora?» (vacío)         │  │  Apariciones ▸ Tamaño ▸          │
│                                 │  │                                                 │  │  [Timeline si OPD in-zoom]       │
└─────────────────────────────────┴──┴─────────────────────────────────────────────────┴──┴──────────────────────────────────┘
overlays: HaloEstado · MenuTipoEnlace · RenombradoInline · 4 menús contextuales · modal-nombre-cosa · ~38 diálogos
```

Piezas y dueños:

| Zona | Componente | Archivo |
|---|---|---|
| Wordmark | literal "Opforja" | `codex/CodexFrame.tsx` |
| Pestañas de modelos | `BarraPestanas` | `BarraPestanas.tsx` |
| Ruta OPD | `Breadcrumb` (colapsa >4 segmentos a `…`) | `Breadcrumb.tsx` |
| Toolbar | `Toolbar` → `ToolbarBase` + `ToolbarCreacion` | `Toolbar.tsx`, `toolbar/*` |
| Meta | `ChromeMetaCodex` ("N oraciones · sin guardar · ⌘K") | `App.tsx:457-489` |
| Columna izquierda | `PanelOplView` + `AnunciadorDeltaDiagnostico` + `PanelDiagnostico` | `App.tsx:254-289` |
| Canvas | `CodexCanvasMount` (topbar + zoom + paper + `CodexSelectionAnnotation`) + `JointCanvasFeedbackBoundary` + `EstadoVacioOpm` | `App.tsx:313-337` |
| Topbar canvas | `AgentWorkbench` + `DocumentActions` + `CintaBiblioteca`/`CintaApunte`/`CintaModelo` (o `BarraSimulacion`) | `App.tsx:316-323` |
| Columna derecha | `ArbolOpd` / divisor horizontal / `Inspector` + `Timeline` (lazy) | `App.tsx:362-411` |
| Divisores | `DivisorPanel` ×3 (OPL, inspector, índice/inspector) | `divisorPanel.tsx` |
| Diálogos | `WorkbenchDialogs` (28 lazy + `CapturadorBugs`) | `WorkbenchDialogs.tsx` |

Observaciones de layout:

- **El OPL está a la izquierda**, pero el atajo `Ctrl+.` se describe como "columna derecha de
  marginalia OPL" (`app/ports/globalShortcutsPort.ts:224`) — texto obsoleto.
- Ocultar OPL tiene dos mecanismos: botón `◀` del header de columna (`App.tsx:262-270`, ancho→0)
  y "minimizar" dentro de `PanelOplView` (rail "OPL · N oraciones · Restaurar",
  `PanelOpl.tsx:112-137`). Además `Ctrl+Shift+M` "solo canvas" y `Ctrl+.`.
- La topbar del canvas apila hasta **3 franjas** (IntentBar, acciones de documento, cinta de
  especie) antes del lienzo: en 1280×800 roban ~100 px verticales al OPD.
- Anchos: OPL default 240, inspector 360, índice 300 px de alto fijo en estado local
  (`App.tsx:93`, no persiste). `GOVERNANCE.md §2` dice "columnas laterales 360 px"; el OPL no
  cumple. `divisorPanel.tsx:5-8` redefine `ANCHO_PANEL_ARBOL_*` que ya existen en
  `store/runtime.ts:49-53` (duplicado, y el "árbol" ya no es una columna).

### 2.2 Tablet (640–1023 px)
Mismo `CodexFrame` con columnas topadas a 200/220 px (`codexFrameColumns`), cluster "Modelo" del
toolbar oculto (`style.clusterTabletOculto`), header comprimido.

### 2.3 Mobile (<640 px) — dos implementaciones
- `VITE_MOBILE_READONLY=true` (así se construye producción: `docker-compose.yml:8`) →
  `MobileReadonlyApp` (lector).
- Si no → layout editable-mobile (`App.tsx:178-226`): Toolbar + pestañas + AgentWorkbench +
  canvas + `BarraHerramientasElemento` flotante + tabs inferiores `ModoRevisionMobile`
  (Canvas/OPDs/OPL/Diagnóstico) + `AvisoEditarEnEscritorio`.
  **En producción esta rama nunca se monta**; mantiene vivo `BarraHerramientasElemento` como
  componente (en desktop fue sustituido por `CodexSelectionAnnotation`, que solo reutiliza sus
  helpers puros).

### 2.4 Otros modos
- **Login**: `PantallaLogin` reemplaza todo si `requiereLogin` (`App.tsx:152`).
- **Solo canvas** (`uiSoloCanvas`, `Ctrl+Shift+M`): `CodexFrame canvasOnly`.
- **Simulación**: el slot toolbar del header queda vacío y `BarraSimulacion` ocupa la topbar.
- **Mapa del sistema**: `APP_FEATURES.mapaSistema = false` (`app/features.ts:8`); `MapaSistema.tsx`
  (376 LOC) + `MapaFiltros` + `MapaPanelEstadisticas` **no se importan desde ningún lado**, pero
  `vistaMapaActiva` sigue atravesando `contexto.ts`, `contextoWorkbench.ts`, `atajosTeclado.ts`
  (contexto `vista-mapa`), `PanelOpl.tsx:103-110` y 51 referencias no-test.

---

## 3. Inventario de módulos raíz

Clasificación: **N** núcleo · **I** importante · **M** marginal · **A** acreción. Recomendación:
K keep · S simplify · C cut.

### 3.1 Estructura de la shell

| Archivo | LOC | Propósito | Clase | Rec. | Justificación |
|---|---:|---|---|---|---|
| `App.tsx` | 878 | Raíz: login, breakpoints, grid Codex, montaje de paneles, divisores, meta header, diálogos | N | S | ~40 % es estilo muerto: `layout.workbench` (l.576), `codexLeftDivider` (l.620), `treePane` (l.662), `canvasPane` (l.679), `inspectorPane` (l.687), `marginaliaInspector` (l.729), `marginaliaRule` (l.739), `oplMarginaliaContent` (l.744) y `diagnosticoMarginalia` (l.755) no se referencian; `setInspectorAbierto` (l.90) es estado fantasma; `tieneTimelineDisponible` (l.551-561) duplica `contextoTimeline` (`app/viewmodels/timelineViewModel.ts:34`) con criterio distinto; rama mobile editable muerta en prod. |
| `WorkbenchDialogs.tsx` | 117 | Monta 28 diálogos lazy por flag | N | S | Reemplazar 27 booleanos del store por un `dialogoActivo: {tipo, payload}` discriminado. Varios se montan siempre (Reabrir, EliminarRefinamiento, DevolverBoceto, RolBiblioteca, ColisionNombre). |
| `Toolbar.tsx` | 40 | Orquestador; agrega chip "● Auto" | N | S | El chip "Auto" duplica el estado de persistencia (ver §5.5). |
| `CanvasAdapterContext.tsx` | 14 | Contexto con `JointCanvasAdapter`/`paper` | N | K | Mínimo y correcto. |
| `JointCanvasFeedbackBoundary.tsx` | 25 | Inyecta `MenuTipoEnlace` y `RenombradoInline` en `JointCanvas` | N | K | Inversión de dependencia limpia (render no importa UI). |
| `MensajeFlashBridge.tsx` | 31 | Puente `mensaje` del store → toast (4,5 s) | I | S | Dos canales de mensaje (store `mensaje` + `addFlash`); unificar en uno. |
| `divisorPanel.tsx` | 134 | Separador redimensionable accesible (`role=separator`, dblclick reset) | I | K | Buen primitivo; quitar constantes `ANCHO_PANEL_ARBOL_*` duplicadas. |
| `layoutResponsive.ts` | 104 | Breakpoints + `useBreakpoint` | I | S | `permiteToolbarModeladoPesado`, `permiteDockBiblioteca`, `usaPanelesComoDrawers` solo los usan tests. |
| `contexto.ts` + `contextoWorkbench.ts` | 142 | "IFML Context": device/modo/submodo/viewpoint → `data-*` y `<h1>` sr-only | A | S | Dos módulos para derivar 4 strings; `Context`/`vistaActivaIFML` solo en tests. Un `useModoWorkbench()` de 15 líneas basta. |
| `motion.ts` | 16 | `prefers-reduced-motion` | I | K | Trivial, útil. |
| `focus.css` / `menus.css` / `BarraPestanas.css` | 81 | Foco visible, hover de menús (inline styles no soportan `:hover`) | I | S | Existen porque todo es inline; una hoja CSS con tokens como variables eliminaría el parche. |
| `tokens.ts` | 473 | Espejo runtime de `ui-forja/tokens.json` | I | S | ~12 valores reales; >100 alias de compatibilidad (`ink02`, `warning*`, `bosque*`, `terracota*`, `azulAccion`, `naranja`, `violeta`…) que colapsan a los mismos 5 hex; 25 alias de sombra = `"none"`; `radii` todos 0 salvo pill; `typography.sizes/sizeXs/weightBold…` triplican la escala. Conservar solo la paleta Codex + OPM. |
| `inspectorStyles.ts` | 469 | Estilos compartidos de inspectores y secciones | I | S | 29 consumidores; convertir a clases CSS. |

### 3.2 Paleta, atajos y acciones

| Archivo | LOC | Propósito | Clase | Rec. | Justificación |
|---|---:|---|---|---|---|
| `CommandPalette.tsx` | 1148 | Paleta `⌘K`: estratos Contextual/Crear/Recientes, búsqueda sin tildes, prefijo-primero, frecuencia de uso, preview del tutor | N | S | Buen motor de búsqueda (`filtrarItemsCommandPalette`, `normalizarTextoBusqueda`); pero es **la única puerta** de ~43 acciones (`construirAccionesMenuCommandPalette`, l.769-817), recibe 50+ dependencias por props, mezcla el tutor (l.270-311, 476-516) y reglas de export (l.219-232). Separar: catálogo declarativo de comandos (registro) + vista de paleta. |
| `atajosTeclado.ts` | 237 | Registro global de atajos con contextos (`global/canvas/panel-opl/panel-arbol/modal-input/vista-mapa`), normalización Mac, supresión con modal abierto | N | K | Diseño sólido y pequeño; quitar contexto `vista-mapa`. |
| `ejecutarAccionContextual.ts` | 131 | Ejecuta `AccionContextualId` con precondiciones → `ActionEvent normal/exceptional` | N | K | Punto único de despacho de acciones contextuales (usado por paleta, menú, barra). |
| `CheatsheetAtajos.tsx` | 211 | Referencia de atajos derivada del registro | I | S | Modal hecho a mano (no usa `Dialogo`); podría ser una vista de la paleta. |

### 3.3 Selección, inspección y edición

| Archivo | LOC | Propósito | Clase | Rec. | Justificación |
|---|---:|---|---|---|---|
| `Inspector.tsx` | 102 | XOR estado/entidad/enlace/vacío; rama vacía con procedencia, `[RATIFICAR]`, anclas, ficha de trabajo, nota del modelo | N | S | La rama vacía acumula 5 bloques de metodología; debería mostrar el modelo (nombre, descripción, métricas) y nada más por defecto. |
| `InspectorEntidad.tsx` | 807 | Ficha continua: Semántica / Enlaces / Refinamiento / Extensiones / Anclaje / Apariciones / Tamaño | N | S | 42 callbacks desde el viewmodel + 8 lecturas directas al store; `PanelRefinamiento` (l.633-660) es un wrapper que reenvía 22 props sin lógica; `reenviarComboGlobalDesdeInput` (l.775-807) es un bug (§6). "Extensiones" mezcla requisitos y submodelos. |
| `InspectorEnlace.tsx` | 819 | Ficha: Propiedades (etiqueta, multiplicidad, modificador, probabilidad, demora, metadatos OPCloud, requisitos, abanico, grupo estructural, anclas, notas) / Extremos (reapuntar, ruta, reanclaje, split, contorno, decisión) | N | S | 14 `useState` espejo de campos del enlace + 3 `useEffect` de sincronización (l.94-152): patrón frágil; editar directo contra el modelo con validación en `onBlur`. `SeccionGrupoEstructural` (l.461-617) expone anclajes dx/dy numéricos y 6 botones de plegado: detalle de layout que no pertenece al inspector semántico. |
| `BarraHerramientasElemento.tsx` | 850 | Barra flotante de acciones de selección (entidad/enlace/multi) con posicionamiento anticolisión | I | S | Solo se monta en la rama mobile editable (muerta en prod). En desktop, `codex/CodexSelectionAnnotation.tsx` reutiliza sus funciones puras (`resolverContextoBarra`, `accionesParaContextoBarra`…). Extraer los helpers a un módulo y borrar el componente. |
| `HaloEstado.tsx` | 351 | Halo flotante sobre la cápsula de estado: renombrar inline, designaciones, eliminar; renombrado encadenado | I | S | Autodeclarado duplicado de `InspectorEstado` y `MenuContextualEstado` (comentario l.13-16). Hace **polling de DOM en cada frame** con `requestAnimationFrame` mientras hay un estado seleccionado (l.58-82). |
| `RenombradoInline.tsx` | 85 | Input de renombrado sobre el canvas (subprocesos) | N | K | Pequeño y correcto; generalizar a toda cosa/estado. |
| `MenuTipoEnlace.tsx` | 338 | Selector de tipo de enlace filtrado por firma OPM (`evaluarTiposEnlacePermitidos`), dirección Salida/Entrada, motivos de exclusión, **preview OPL** | N | K/S | Pieza clave y bien pensada. Pero `previewOpl` (l.265-286) es un **segundo generador OPL a mano** que diverge del real (`opl/generadores/procedural.ts`): no maneja estados (`en \`estado\``), excepciones dicen "su duración máxima" en vez del valor, estados se marcan `**…**`. Debe llamar al generador real sobre un enlace hipotético. |
| `MenuContextualEntidad.tsx` | 177 | Menú derecho de apariencia; ordena y agrupa acciones del catálogo | N | K | Rendering del catálogo único `store/acciones-contextuales.ts`. |
| `MenuContextualEnlace.tsx` | 74 | Menú derecho de enlace | I | S | **"Multiplicidad", "Modificador", "Reanclar" solo cierran el menú** (l.32-34): affordances falsas. "Conectar multi al todo" siempre usa agregación. |
| `MenuContextualEstado.tsx` | 212 | Menú derecho de estado: renombrar (con `window.prompt`), designaciones, duración, suprimir, ocultar/mostrar en vista, hermano, eliminar | I | S | `window.prompt` (l.49) rompe el lenguaje visual; fusionar con el halo. |
| `MenuContextualArbol.tsx` | 195 | Menú derecho del árbol: integrar/devolver Boceto, renombrar, eliminar, cortar/pegar, reordenar, nombres, expandir/colapsar, buscar, ir padre/hijo | I | S | 16 ítems; "Buscar OPD" abre `GestionArbolOpd` (modal duplicado). |
| `DialogoMoverPuerto.tsx` | 144 | Reanclar extremo de enlace + ancla de reloj; "Remover relación" | I | S | Lista todos los extremos del OPD sin filtrar por firma (el kernel rechaza después); acción destructiva dentro de un diálogo de reanclaje. Tercera vía de cambiar extremos. |
| `DialogoTraerConectados.tsx` | 112 | Traer conectados por familia (4 familias OPCloud) con conteos | I | K | Útil y acotado. |
| `ModalDuracionEstado.tsx` | 89 | Duración min/nominal/máx de estado | I | K | Validación en kernel (`modelo/objetoDuracion.ts:34-41`). Podría ser inline en el inspector. |
| `ModalImagenObjeto.tsx` | 195 | Imagen de objeto (URL/archivo, modo imagen/texto) | M | S | Extensión OPCloud; bajar a sección del inspector. |
| `ModalUrlsObjeto.tsx` | 77 | URLs del objeto | M | S | Ídem. |

### 3.4 Navegación y paneles

| Archivo | LOC | Propósito | Clase | Rec. | Justificación |
|---|---:|---|---|---|---|
| `PanelOpl.tsx` | 253 | Vista OPL: bloques, delta "OPL actualizada · N líneas", auto-scroll a selección, editor libre OPL→OPD con clasificación, minimizado | N | K/S | Corazón bimodal. Quitar botón `onPlaceholderAi` ("Próximamente: oraciones generadas por LLM", `store/modelo/acciones-canvas.ts:295-297`) y la rama `vistaMapaActiva`. |
| `ArbolOpd.tsx` | 376 | Árbol OPD con teclado, drag reorden, renombrar F2, badges de avisos, sección Bocetos, menú contextual | N | K/S | Registra atajos `Ctrl+↑/↓`, `F2`, `Ctrl+E`, `Ctrl+Shift+E`, `Ctrl+D` en contexto `panel-arbol` (l.96-103); `Ctrl+D` y `Ctrl+↑/↓` también existen en `global` con semántica distinta. |
| `GestionArbolOpd.tsx` | 322 | Modal "Gestión del árbol OPD": búsqueda, cortar/pegar, renombrar | A | C | Duplica `ArbolOpd` + su menú contextual; modal hecho a mano sin foco atrapado. Añadir un filtro de búsqueda al árbol lateral y borrar. |
| `Breadcrumb.tsx` | 201 | Ruta OPD con colapso | N | K | Correcto y pequeño. |
| `BarraPestanas.tsx` | 242 | Pestañas de modelos: activar, cerrar con confirmación, drag reorden | I | S | Cambiar de pestaña con cambios pide "Guardar/Descartar/Cancelar" (l.42-49) aunque la pestaña conserva su estado: "Descartar" solo cambia de pestaña (copy engañoso) y la fricción anula el valor de las pestañas. |
| `Timeline.tsx` | 370 | Orden temporal de subprocesos de un in-zoom (Y ordinal, paralelos por misma Y, antes/paralelo/después por drag, "Romper" paralelismo) | N | K | Regla ISO 19450 bien materializada (§4). Paralelismo por igualdad exacta de Y es frágil (1 px rompe). |
| `PanelDiagnostico.tsx` | 422 | Marginalia de diagnóstico del OPD activo por severidad (bloqueo/mejora/estilo), navegación al aviso, anuncio aria-live del delta | N | K/S | Buen diseño "criterio junto al hallazgo". El conteo se recalcula 3 veces por render (App l.137, panel, anunciador). |
| `EstadoVacioOpm.tsx` | 210 | Lienzo vacío: "¿Qué tienes más claro ahora?" (SD / Taller / explorar) + nudge "Conectar como resultado" | I | S | La elección metodológica antes de dibujar es fricción para un usuario nuevo; el nudge usa `validarFirmaEnlace` (bien). |
| `ModoRevisionMobile.tsx` | 168 | Tabs inferiores mobile editable | A | C | Rama inactiva en prod (`VITE_MOBILE_READONLY=true`). |
| `MapaSistema.tsx`, `MapaFiltros.tsx`, `MapaPanelEstadisticas.tsx` | 661 | Mapa del sistema | A | C | No importados; flag `false`. |

### 3.5 Persistencia, documentos y workspace

| Archivo | LOC | Propósito | Clase | Rec. | Justificación |
|---|---:|---|---|---|---|
| `DialogoCargarModelo.tsx` | 1108 | Gestor "Trabajo de modelado": espacios Taller/Modelos/Bibliotecas/Archivo, carpetas (sidebar, drag, crear/renombrar), búsqueda, orden por columna, tabla, chip de rigor, glifos, menú de acciones por modelo, importar JSON | N | S | Núcleo "abrir", pero con 4 espacios + 2 zonas en Modelos + carpetas + orden en variable de módulo (`ordenCargarMemoria`, l.520/793-799) pese a existir `PreferenciasUiUsuario.ordenCargar`; glifo candado igual para "solo lectura" y "archivado" (l.751-754); "Tamaño" muestra bytes crudos de `versiones[0]`. Solo accesible por la paleta. |
| `PanelCarpetas.tsx` (+`panelCarpetas/` 499) | 377 | Navegador de carpetas tiles/lista con menú, portapapeles, drag | A | C | Solo se usa como selector de carpeta en "Guardar como" (`modoOperacion="selector"`, `onAbrirModelo={() => {}}`); el gestor tiene su propia sidebar de carpetas. Reemplazar por un `<select>` jerárquico. |
| `DialogoGuardarComo.tsx` | 267 | Nombre, descripción, carpeta, "crear versiones en guardados manuales", explicación variante vs versión | N | S | Correcto; el selector de carpetas es sobredimensionado. |
| `PersistenciaJson.tsx` | 491 | Exportar/Descargar/Importar JSON (reemplazar o pestaña nueva), archivo o pegado, vista previa con migración, "Modelos locales" cargar/borrar | N | S | "Borrar" modelo **sin confirmación** (l.118) vs gestor con `confirm`; bloque "Modelos locales" duplica el gestor. |
| `DialogoImportarExportarJson.tsx` | 27 | Envoltorio modal de `PersistenciaJson` | A | C | `abrirDialogoImportarExportarJson` no tiene ningún disparador de UI (lo cablean `zustandCommandPalettePort` y `zustandPersistencePort`, pero la paleta no lo lista). Inalcanzable; los docs (`uso-productivo.md` §Respaldo) remiten a un menú ☰ que ya no existe. |
| `ChipPersistencia.tsx` | 285 | Clasificación de variante (`local-clean/dirty/importado/nuevo`), labels, tooltip | I | S | El componente `ChipPersistencia` ya no se renderiza (solo se usan `clasificarVariante/labelChip/detallarChip` desde `toolbar/ToolbarBase.tsx:400-433`); `formatearTiempoRelativo` solo lo usa el componente muerto. |
| `DocumentPersistenceStatus.tsx` | 94 | "Guardado aquí / Sincronizado / Sin guardar aquí / Revisar conflicto" + diálogo: guardar aquí, sincronizar, descargar recuperación, resolver conflicto comparando OPL de ramas | I | S | Segundo sistema de persistencia visible (local-first con cola de sync, `app/ports/documentPersistencePort.ts`) coexistiendo con el autosalvado backend. La comparación de ramas vía OPL es buena idea. |
| `DocumentActions.tsx` | 27 | Franja: estado de persistencia local + Compartir revisión + Proponer refinamiento + Reutilizar pieza + Paquete portátil | I | S | Cuatro verbos de nivel documento en la topbar del canvas; pertenecen a un menú Archivo/Compartir. |
| `ReviewDocumentAction.tsx` | 27 | Abre panel de revisión compartida (enlace revocable) | I | K | Delgado. |
| `PortableDocumentAction.tsx` | 21 | Abre panel de paquete portátil | M | K | Delgado. |
| `RefinementProposalAction.tsx` | 112 | Propone un refinamiento preparado por servidor (`prepareHumanAuthoringRequest("refinements")`) y lo integra con revisión de cambio | M | C/S | Tercer camino para refinar (además de acción directa y formulario de la anotación de selección). Llama a persistencia desde la UI. |
| `DialogoVersiones.tsx` | 293 | Versiones: crear, restaurar como copia, eliminar con confirmación, hitos de agente colapsables | I | K/S | Tutor enganchado en `onFocus` de cada botón. |
| `ConfirmacionContext.tsx` + `DialogoConfirmacion.tsx` | 135 | Confirmación única "Hay cambios sin guardar" (Guardar/Descartar/Cancelar) | N | K | Buen patrón (reemplazó instancias duplicadas). |
| `DialogoBuscarCosas.tsx` | 310 | `Ctrl+F`: busca entidades, estados y etiquetas por aparición; saltar; traer al OPD activo | N | K | Opera por aparición (correcto en OPM). |
| `DialogoBuscarGlobal.tsx` | 95 | `Ctrl+Shift+F`: búsqueda en todos los modelos del workspace | I | K | Pequeño. |
| `DialogoConfiguracion.tsx` | 139 | Nombre del modelo + cuadrícula (paso, color, grosor) + visibilidad de esencia en OPL | I | S | Mezcla metadato del modelo con preferencias; renombrar el modelo debería ser inline (header/pestaña). |
| `PantallaLogin.tsx` | 135 | Login email+password | N | K | — |

### 3.6 Ciclo de vida, reuso y extensiones

| Archivo | LOC | Propósito | Clase | Rec. | Justificación |
|---|---:|---|---|---|---|
| `CintaApunte.tsx` | 126 | Cinta "Apunte · en Taller · integridad obligatoria; cierre en observación" + Explorar + Revisar para graduar | A | S | Una cinta permanente para comunicar un régimen de validación. |
| `CintaModelo.tsx` | 87 | Cinta "Modelo · en Modelos · rigor exigible" + Reabrir en Taller | A | S | Estilos casi idénticos a `CintaApunte`: fusionar en una `CintaDocumento` o en un badge del header. |
| `CintaBiblioteca.tsx` | 180 | Biblioteca en solo lectura / editando + confirmación | I | S | El único estado de cinta con consecuencia real (readOnly). |
| `DialogoGraduar.tsx` | 424 | Graduar Apunte→Modelo/Biblioteca: nombre, carpeta, reporte integridad/bloqueos/mejoras/Bocetos | A | S | Reimplementa la clasificación de integridad cruzando `severidadDiagnostico` con y sin `esApunte` (l.53-83). |
| `DialogoReabrirTaller.tsx` | 62 | Modelo→Apunte | A | S | 3 párrafos de explicación por un cambio de flag. |
| `DialogoRolBiblioteca.tsx` | 50 | Marcar/quitar Biblioteca | A | S | — |
| `DialogoDevolverBoceto.tsx` | 59 | OPD integrado → Bocetos (conserva subárbol) | I | K/S | Operación semántica real (desrefinar sin pérdida). |
| `DialogoEliminarRefinamiento.tsx` | 51 | Confirmar borrado de refinamiento y subárbol | N | K | Confirmación destructiva bien planteada. |
| `DialogoMesaExploracion.tsx` | 584 | Mesa preformal: fuente → trazo → propuesta (tipo+nombre) → confirmar → ir al hecho / deshacer | A | C | Cuatro etapas para crear **una** cosa; metodología Forja, no OPM. Si se conserva, como panel opcional de notas con "convertir en cosa". |
| `VitrinaEstereotipos.tsx` | 576 | "Piezas": estereotipos locales + entidades de bibliotecas con Calcar / Anclar | M | S | Uno de 5 mecanismos de reuso (§5.3). Carga backend directo desde la UI (l.101-117). |
| `DialogoSubmodelo.tsx` | 197 | Conectar submodelo (referencia LF-04 solo lectura) | M | S | Reuso por referencia. |
| `DialogoComposicion.tsx` | 346 | Componer con otro modelo: mapeo de entidades compartidas (mismo tipo), sugerencias por interfaz, preview de delta y conflictos de linealidad | M | S | Reuso por fusión. Toggles locales archivados/versiones. |
| `DialogoRequisito.tsx` | 195 | Crear/marcar/vincular requisito (ID lógico, dureza, actor, satisfacción) | M | S | Extensión OPCloud (estereotipo requisito). |
| `DialogoOntologia.tsx` | 121 | "Normalización léxica": términos canónicos y sinónimos, modo | M | C/S | El propio diálogo admite que "esta interfaz todavía no sugiere ni reemplaza nombres"; `uso-productivo.md` afirma que `Reforzar canónico` sustituye. Contradicción doc/código. |
| `DialogoSimulacionNumerica.tsx` | 360 | Muestras de atributos simulables → CSV | M | S | Contiene un NUL literal en `columnas.join("\0")` (el archivo se detecta como binario). |
| `DialogoColisionNombre.tsx` | 130 | Nombre ya existe: reutilizar (misma cosa, nueva aparición) / otro nombre / ir a ubicación | N | K | Regla OPM de identidad por nombre (§4). |
| `TablaEnlaces.tsx` | 858 | Tabla de todos los enlaces: buscar, filtrar por tipo/familia, ordenar, editar multiplicidad/etiqueta, ir a extremo, eliminar con confirmación | I | S | Modal hecho a mano; repite las 15 etiquetas de tipos (l.121-137). Útil para auditoría. |
| `TutorDetails.tsx` + `useTutorContent.ts` | 310 | Disclosure "Criterio / Fundamento" con fuentes; preferencias en localStorage | M | S | Enganchado en 18 archivos raíz (`runTutorPolicy`/`TutorInterventionDetails`), incluso en `onFocus` de botones. Ayuda contextual valiosa, pero debería ser un único "?" por superficie, no un motor de políticas por render. |
| `CapturadorBugs.tsx` | 607 | Captura de bugs con screenshots → `POST /__deep-opm/bug-reports`; ledger activos/histórico | A | C | Gobernanza del repositorio dentro del producto; activado en prod (`docker-compose.yml:7`). Sustituir por un enlace "Enviar comentario". |

---

## 4. Reglas OPM y de modelado codificadas en la shell

La shell **casi nunca es dueña** de la regla: la replica para deshabilitar/filtrar. La reescritura
debe conservar el comportamiento y, idealmente, obtenerlo de una sola función del kernel.

| # | Regla | Dónde en la UI | Fuente autoritativa |
|---|---|---|---|
| R1 | Los tipos de enlace permitidos dependen de la firma (tipo de cosa/estado origen y destino, dirección); se muestran motivos de exclusión | `MenuTipoEnlace.tsx:61-66, 147-156, 233-241` | `modelo/opcionesEnlace.ts` (`evaluarTiposEnlacePermitidos`, `tiposEnlacePermitidos`) |
| R2 | 15 tipos canónicos: 4 estructurales fundamentales (agregación, exhibición, generalización, clasificación), 2 etiquetados, 6 procedurales (agente, instrumento, consumo, resultado, efecto, invocación), 3 excepciones de tiempo | `MenuTipoEnlace.tsx:16-35`; copias en `TablaEnlaces.tsx:121-137`, `BarraHerramientasElemento.tsx:587-606`, `InspectorEnlace.tsx:517-520` | `modelo/tipos/enlace.ts:14-29` |
| R3 | Frase OPL por tipo (consume/genera/afecta/maneja/requiere/invoca/consta de/exhibe/es/es una instancia de/se relaciona con/ocurre si duración…) ; procesos en cursiva, objetos en negrita | `MenuTipoEnlace.tsx:265-292` (**copia divergente**) | `opl/generadores/procedural.ts`, `estructural.ts` |
| R4 | Cambiar tipo de un grupo estructural solo entre los 4 fundamentales y respetando la firma | `InspectorEnlace.tsx:461-617, 669-686` (select sin prefiltrar) | `modelo/operaciones/enlaces.ts:288-313` (`validarFirmaEnlace`) |
| R5 | Los estados solo existen en objetos; "S" y "+Estado" requieren objeto seleccionado | `toolbar/ToolbarBase.tsx` (`puedeCrearAtributo`), `ejecutarAccionContextual.ts:20-23`, `InspectorEntidad.tsx:577` | kernel `agregarEstado*` |
| R6 | Un atributo es un objeto exhibido; solo se crea en un objeto que no sea ya atributo | `InspectorEntidad.tsx:557-567` | `modelo/operaciones` (`esAtributoDerivado`, `crearAtributoEnObjeto`) |
| R7 | Linealidad solo aplica a objetos | `InspectorEntidad.tsx:575` | kernel |
| R8 | Designaciones de estado: inicial, final, default, current; **default y current son excluyentes** en un estado; default/current únicos por entidad | `MenuContextualEstado.tsx:89-104`, `HaloEstado.tsx:236-246` | `modelo/estadosDesignaciones.ts:17-25, 88` |
| R9 | Duración de estado: min ≤ nominal ≤ max, finitos | `ModalDuracionEstado.tsx` (sin validación local) | `modelo/objetoDuracion.ts:34-41` |
| R10 | Entidad vs aparición: una cosa existe una vez; su edición afecta todas sus apariciones ("Aparece en N OPDs… los cambios afectan a todas"); ocultar aparición ≠ borrar | `InspectorEntidad.tsx:501-509`; `ejecutarAccionContextual.ts:94-97` (`ocultar-apariencia`); `MenuContextualEstado.tsx:125-153` (ocultar estado solo en esta vista) | `docs/uso-productivo.md` §Apariciones; kernel |
| R11 | Unicidad de nombre canónico; reutilizar solo si es del mismo tipo y en creación (nueva aparición de la misma cosa) | `DialogoColisionNombre.tsx:24, 70-73` | store `colisionPendiente` / kernel |
| R12 | Refinamiento: in-zoom (descomposición) de proceso u objeto, unfold (despliegue) con modo agregación/exhibición/…; quitar descomposición/despliegue solo si existe | `ejecutarAccionContextual.ts:24-39`, `InspectorEntidad.tsx:262-287` | kernel `refinamientos` |
| R13 | Árbol OPD: la raíz no se elimina; un OPD con hijos no se elimina; cortar/pegar solo reordena hermanos — **reparentar cambia el hecho de refinamiento** y pasa por integración | `MenuContextualArbol.tsx:44-47, 90`; `GestionArbolOpd.tsx:14-20` | store árbol / gateway de integración |
| R14 | Bocetos (OPD sin padre): se integran como descomposición o despliegue; devolver a Bocetos conserva ID, hechos, geometría, pregunta guía y subárbol; eliminar refinamiento destruye el subárbol | `MenuContextualArbol.tsx:66-87`; `DialogoDevolverBoceto.tsx`; `DialogoEliminarRefinamiento.tsx:44-47` | `modelo/opdSueltos.ts` |
| R15 | Enlaces de contorno en un OPD de refinamiento: una proyección automática puede "recolectarse" (materializar) o "distribuirse" (restaurar proyección) | `InspectorEnlace.tsx:428-453, 365-371` | kernel `derivado.tipo === "enlace-externo-refinamiento"` |
| R16 | Decisión evaluable si el enlace toca un estado o su destino tiene estados no suprimidos | `InspectorEnlace.tsx:455-459` | kernel decisión |
| R17 | Split de efecto: en par consumo+resultado con objeto intermedio, o parcial TS4/TS5 con estado no especificado | `InspectorEnlace.tsx:363-364`; paleta l.783 | kernel `splitEffect*` |
| R18 | Orden temporal en in-zoom: subprocesos ordenados por Y del contorno, misma Y = paralelos; solo procesos dentro del contorno del refinador | `Timeline.tsx:126-184`; `app/viewmodels/timelineViewModel.ts:34-66` | ISO 19450 (timeline de in-zoom) |
| R19 | Agregar como partes: la última cosa de la multiselección es el todo (agregación) | `ejecutarAccionContextual.ts:67-73`; `BarraHerramientasElemento.tsx:294-298` | kernel `conectarSeleccionAlTodo` |
| R20 | Composición entre modelos: solo se fusionan entidades del mismo tipo; conflictos de linealidad visibles | `DialogoComposicion.tsx:109, 241, 303-310` | `modelo/composicion` |
| R21 | Nudge "Conectar como resultado" solo si la firma proceso→objeto es legal | `app/viewmodels/estadoVacioOpmViewModel.ts` (`validarFirmaEnlace("resultado")`) | kernel |
| R22 | Gates de export canónico: PNG deshabilitado si el OPD supera la densidad máxima (`perfilCanonDiagrama`) o si es un Boceto no integrado en un Modelo (en Apunte degrada a observación) | `CommandPalette.tsx:219-232, 796-797` | `modelo/perfilDiagrama.ts`, `serializacion/perfilesExport.ts` (`gateOpdsSinAdoptar`) |
| R23 | Régimen Apunte: códigos de *validez* en lista blanca bajan a observación; la *integridad* siempre bloquea; graduar exige integridad | `PanelDiagnostico.tsx:39-43`; `DialogoGraduar.tsx:53-99` | `modelo/diagnosticoSeveridad.ts:167-181` |
| R24 | Biblioteca se abre en solo lectura; editarla requiere desbloqueo explícito | `CintaBiblioteca.tsx`; `DialogoCargarModelo.tsx:740-745` (`accesoCatalogo`) | store `gobernarAperturaBiblioteca` |

Nota: R22-R24 son reglas **de producto/metodología Forja**, no de ISO 19450. R1-R21 son OPM y deben
preservarse.

---

## 5. Flujos principales (tal como están)

### 5.1 Crear una cosa
1. Clic en `Objeto`/`Proceso` (header), o tecla `O`/`P` con el canvas enfocado, o arrastre al
   canvas, o `Shift+clic` para inserción continua (`toolbar/ToolbarBase.tsx:233-248`).
2. La cosa nace con nombre sugerido; **tres superficies compiten para nombrarla**: el formulario
   flotante `modal-nombre-cosa` (`nuevaCosaPendiente`, `toolbar/ToolbarBase.tsx:454-464`), el foco
   automático del input Nombre del inspector (`solicitarFocusNombre`, `InspectorEntidad.tsx:163-179`)
   y el renombrado inline del canvas.
3. Si el nombre colisiona → `DialogoColisionNombre`.
4. Lienzo vacío: antes de todo aparece "¿Qué tienes más claro ahora?" con 2-3 entradas
   metodológicas (`EstadoVacioOpm.tsx:44-90`).

### 5.2 Enlazar
- `R` o botón `Relación` → `MenuTipoEnlace` con origen fijado → elegir tipo (lista filtrada por
  firma y preview OPL) → modo "Conectando: X · selecciona destino · Esc cancela" → clic destino.
- Alternativa: arrastre desde ancla del canvas → menú de tipos con origen y destino.
- Cambiar tipo después: solo en `InspectorEnlace` (grupo estructural) o borrando y recreando.
- Menú derecho de enlace: 3 de 6 ítems no hacen nada.

### 5.3 Refinar (in-zoom / unfold)
Cinco puntos de entrada para la misma operación: `Shift+I`/`Shift+U`, anotación de selección
(con formulario de pregunta guía en `codex/CodexSelectionAnnotation.tsx`), menú contextual,
paleta, sección Refinamiento del inspector; más **"Proponer refinamiento…"** en la topbar, que
prepara un cambio en el servidor y lo integra tras revisión (`RefinementProposalAction.tsx`).
Bottom-up: `+ Nuevo boceto OPD` → dibujar → clic derecho → integrar como descomposición/despliegue.

### 5.4 Editar OPL
Clic en token → selecciona en canvas; doble clic en nombre → renombrar; `Editar` → editor libre
`EditorOplHonesto` con clasificación aplicables/no aplicables/sin cambio/ignoradas y previsualización
antes de aplicar; filtro por selección; búsqueda; numeración; copiar. Delta anunciado tras cada
cambio. Es la pieza que materializa la simetría OPD↔OPL: conservar.

### 5.5 Guardar
Cuatro señales a la vez:
1. `chip-persistencia` en el header: "Guardado · HH:mm" / "Guardando…" / "Cambios sin guardar" /
   "Sin guardar · Ctrl+S"; clic abre "Guardar como" (no guarda).
2. `toolbar-autosave-status`: "● Auto / ○ Auto".
3. Meta header: "· sin guardar".
4. `DocumentPersistenceStatus` en la topbar del canvas: "Guardado aquí / Sincronizado / Sin
   guardar aquí / Revisar conflicto", con su propio diálogo (guardar aquí, sincronizar, descargar
   recuperación, resolver conflicto).
Además `beforeunload` si `dirty` (`editorBootstrap.tsx:7-31`). `Ctrl+S` guarda; si el modelo no
tiene identidad abre "Guardar como".

### 5.6 Abrir / nuevo / importar
Solo vía `Ctrl+K` → "Abrir / importar modelo" (o el botón `⌘K` de 20 px del header). No hay botón
Archivo. "Nuevo" crea un **Apunte** sin pedir nombre. Importar JSON: gestor → "Importar JSON" →
panel `PersistenciaJson` → elegir/pegar → "Importar y reemplazar pestaña activa" o "Importar en
pestaña nueva".

### 5.7 Exportar
Paleta: JSON al portapapeles, diagnóstico JSON, OPL Markdown, documento canónico Markdown, contexto
para la skill, log de decisiones, PNG del OPD, ZIP de PNGs. "Descargar JSON" (archivo) solo dentro
del panel de importación del gestor; "Descargar recuperación" en `DocumentPersistenceStatus`;
"Paquete portátil…" en la topbar. Siete salidas repartidas en tres superficies.

### 5.8 Ciclo documental
Apunte (Taller) → "Revisar para graduar" → `DialogoGraduar` → Modelo (listo / con pendientes) →
"Reabrir en Taller" → Apunte. Marcar Biblioteca desde el menú de acciones del gestor →
`DialogoRolBiblioteca`. Archivar/restaurar. Cada transición: diálogo + versión + párrafos
explicativos + tutor.

### 5.9 Reuso (cinco mecanismos)
1. **Piezas / estereotipos** (`VitrinaEstereotipos`): Calcar (copia) o Anclar (copia atada a
   biblioteca, con *drift*).
2. **Reutilizar pieza** (`reuse/PieceProposalAction`, topbar): referencia o copia con linaje.
3. **Submodelo** (`DialogoSubmodelo`): referencia de solo lectura con actualizar/descargar/desvincular.
4. **Composición** (`DialogoComposicion`): fusión de otro modelo con mapeo de compartidas.
5. **Pegar selección** (`Ctrl+C/V`) y **traer conectados**.
Más la sección "Anclaje" del inspector para gestionar el *drift*.

### 5.10 Recuento de superficies
- Diálogos con `Dialogo`: 34 archivos. Modales a mano: `CommandPalette`, `CheatsheetAtajos`,
  `GestionArbolOpd`, `TablaEnlaces` (y `toolbar/ToolbarMas`, no montado).
- Menús: entidad, enlace, estado, árbol, acciones de modelo (gestor), `MenuTipoEnlace`, halo de estado.
- Booleanos de apertura en el store: 27 (`store/tipos.ts`: `dialogo*Abierto`, `modal*Abierto`,
  `menuPrincipalAbierto`, `toolbarMasAbierto`, `mapaPanel*Abierto`, …) + 6 aperturas por id
  (`dialogoGraduarModeloId`, `dialogoReabrirModeloId`, `dialogoRolBibliotecaModeloId`,
  `confirmacionEliminarRefinamiento`, `confirmacionDevolverBoceto`, `colisionPendiente`) y ~60
  acciones `abrir*/cerrar*`. `menuPrincipalAbierto`, `toolbarMasAbierto` y `mapaPanel*` controlan
  componentes que no se montan.

---

## 6. Defectos y fricciones concretas detectadas en el código

1. **Atajos secuestrados en el input Nombre del inspector** (`InspectorEntidad.tsx:775-807`):
   todo combo con Ctrl/Meta y la tecla `Delete` se re-despachan a `window` y se cancela el nativo.
   Consecuencias: `Ctrl+C/V/X/A` sobre el texto del nombre copian/pegan/seleccionan en el canvas;
   **`Supr` mientras se edita el nombre elimina la cosa seleccionada**.
2. Menú de enlace con ítems muertos "Multiplicidad", "Modificador", "Reanclar"
   (`MenuContextualEnlace.tsx:32-34`).
3. Botón OPL "IA" que solo muestra "Próximamente…" (`PanelOpl.tsx:154` →
   `store/modelo/acciones-canvas.ts:295-297`).
4. Diálogo Importar/Exportar JSON inalcanzable; la documentación de usuario apunta a un menú ☰
   inexistente (`docs/uso-productivo.md` §Respaldo manual).
5. "Borrar" modelo sin confirmación en `PersistenciaJson.tsx:118`.
6. `MenuContextualEstado` renombra con `window.prompt` (l.49); el gestor y el inspector usan
   `globalThis.confirm` (`DialogoCargarModelo.tsx:231`, `InspectorEntidad.tsx:443`) en vez de
   `Dialogo`.
7. Cambiar de pestaña con cambios pide Guardar/**Descartar**/Cancelar aunque no descarta nada
   (`BarraPestanas.tsx:42-49`).
8. Atajos que el navegador no entrega o que chocan con él: `Ctrl+W`, `Ctrl+T`, `Ctrl+Tab`,
   `Ctrl+1…9` (reservados por Chrome), `Ctrl+D` (marcador), `Ctrl+H` (historial)
   (`app/ports/globalShortcutsPort.ts:227-335`). `Ctrl+D` y `Ctrl+↑/↓` registrados en dos contextos
   con significados distintos (global: navegar OPD hermano; panel-árbol: mover foco).
9. `HaloEstado` hace `requestAnimationFrame` perpetuo + `querySelector` por frame mientras hay un
   estado seleccionado (`HaloEstado.tsx:58-82`).
10. `previewOpl` del menú de tipos diverge del generador real (ver R3).
11. Derivación inconsistente de "es apunte": algunas excluyen archivados (`CintaApunte.tsx:17-19`,
    `estadoVacioOpmViewModel`), otras no (`PanelDiagnostico.tsx:39`, `CommandPalette.tsx:131`); la
    severidad del diagnóstico puede diferir entre superficies para un apunte archivado.
12. Glifo candado para "solo lectura" y para "archivado" (`DialogoCargarModelo.tsx:751-754`).
13. `DialogoOntologia` contradice la documentación sobre el modo "Reforzar canónico".
14. Texto obsoleto de `Ctrl+.` ("columna derecha").
15. Anidamiento de `Dialogo`: cada instancia registra un `keydown` en captura sobre `window` con
    `stopImmediatePropagation`; con dos diálogos abiertos (p. ej. confirmar eliminación dentro de
    Versiones) `Esc` lo atiende el **primero registrado** (el exterior), no el superior.

---

## 7. Contratos que una reescritura debe respetar o migrar

### 7.1 Tipos del modelo consumidos por la shell (textuales)

```ts
// modelo/tipos/enlace.ts:14
export type TipoEnlace =
  | "agregacion" | "exhibicion" | "generalizacion" | "clasificacion"
  | "etiquetado" | "etiquetadoBidireccional"
  | "agente" | "instrumento" | "consumo" | "resultado" | "efecto" | "invocacion"
  | "excepcionSobretiempo" | "excepcionSubtiempo" | "excepcionSubSobretiempo";
export type ExtremoKind = "entidad" | "estado";
export type Modificador = "condicion" | "evento" | "no";

// modelo/tipos/estado.ts:12
export type DesignacionEstado = "inicial" | "final" | "default" | "current";

// modelo/tipos/pestana.ts (no se serializa en JSON OPM)
export type OrigenPestana = "nuevo" | "importado" | "persistido";
export interface Pestana {
  id: PestanaId; etiqueta: string; modeloId: Id | null; modelo: Modelo;
  cargadoDesde: OrigenPestana; dirty: boolean;
  historialUndo: HistorialEntrada[]; cursorUndo: number;
  vistaMapaActivaPestana: boolean; seleccionadosPestana?: Id[];
  snapshotJson?: string; descripcionModeloLocal?: string;
}

// modelo/tipos/ui.ts — preferencias fuera del JSON OPM
export type EsenciaVisibilidad = "siempre" | "solo-difiere" | "oculta";
export interface GridConfig { activa: boolean; paso: number; color: string;
  strokeWidth: number; escala: number; snapActivo: boolean; }
```

`PreferenciasUiUsuario` (`modelo/tipos/ui.ts`) persiste anchos de paneles, orden del árbol,
numeración/minimizado/bloques del OPL, `gridConfig`, `oplEsenciaVisibilidad`, `vistaCargar`,
`ordenCargar`, `recientes`, `traerConectadosUltimo`, `crucesPuenteSkill`. Varias no se consumen
(`vistaCargar`, `ordenCargar`, `recientes`: el gestor usa memoria de módulo). Migrar solo lo usado.

### 7.2 Catálogo de acciones contextuales (contrato interno bueno)

```ts
// store/acciones-contextuales.ts
export type SuperficieAccionContextual = "barra-flotante" | "menu-contextual" | "command-palette";
export interface AccionContextual {
  id: AccionContextualId; label: string; testId: string;
  categoria: "refinamiento" | "edicion" | "apariencia" | "enlaces" | "navegacion" | "peligro";
  visible: boolean; enabled: boolean; superficies: readonly SuperficieAccionContextual[];
  texto?: string; atajo?: string; destructiva?: boolean; aliasBusqueda?: readonly string[];
}
export interface ActionEvent { actionId: AccionContextualId; kind: "normal" | "exceptional"; reason?: string; }
```
26 ids (`inzoom`, `unfold`, `agregar-estado`, `quitar-descomposicion`, …, `ocultar-apariencia`).
Es el patrón a extender a **todas** las acciones (hoy las 43 "acciones de menú" de la paleta viven
fuera del catálogo, en `CommandPalette.tsx:769-817`).

### 7.3 Registro de atajos

```ts
// ui/atajosTeclado.ts
export type ContextoAtajo = "global" | "canvas" | "panel-opl" | "panel-arbol" | "modal-input" | "vista-mapa";
export type CategoriaAtajo = "navegacion" | "edicion" | "archivo" | "vista" | "seleccion";
export interface RegistroAtajo { combo: string; handler: (e: KeyboardEvent) => void; ctx: ContextoAtajo;
  etiqueta?: string; descripcion: string; descripcionLarga?: string; categoria: CategoriaAtajo; preventDefault?: boolean; }
```
Mapa actual (56 registros en `globalShortcutsPort.ts`): `O P S R`, `F2`, `D`, `T`, `Shift+I/U`,
`Ctrl+S/K/F/Z/Y/A/C/V/H/T/W/D/.`, `Ctrl+Shift+F/M/T/Z/B/E`, `Ctrl+Alt+T`, `Delete/Backspace`,
flechas ±1/±10 px, `Ctrl+flechas` navegación OPD, `Ctrl+1…9`, `Ctrl+Tab`, `Space` (simulación),
`Escape`. Supresión: si hay `[role=dialog][aria-modal=true]` o `[data-atajos-local=true]`.

### 7.4 Bus de eventos `window` (acoplamiento implícito)
- `opm:menu-contextual-enlace` `{enlaceId,x,y}` y `opm:menu-contextual-estado`
  `{estadoId,entidadId,x,y}`: emitidos por el canvas, escuchados por `ToolbarBase` (los menús
  contextuales viven dentro de la toolbar). `contextmenu` en captura para entidades.
- `opm:halo-estado-rename`, `opm:halo-estado-popover-designar` (atajos F2/D → `HaloEstado`).
- `EVENTO_ABRIR_AVISO_DIAGNOSTICO` `{reglaId}` (árbol/canvas → `PanelDiagnostico`).
- `opforja:bug-capture:open`, `opforja:bug-ledger:open`.
- Enfoque por `document.querySelector('[data-testid=…]')`: `enfocarSeccionInspector` está
  **triplicado** (`CommandPalette.tsx:914`, `toolbar/ToolbarBase.tsx:492`, `BarraHerramientasElemento.tsx:730`).

### 7.5 HTTP tocado directamente desde la UI
- `GET/POST /__deep-opm/bug-reports` (`CapturadorBugs.tsx:103, 134`; servidor en `vite.config.ts`
  y `scripts/bug-capture-api.ts`).
- `cargarModeloBackend(id)` desde `DialogoComposicion.tsx`, `VitrinaEstereotipos.tsx` (y el
  store) — la UI salta la capa de puertos.
- `prepareHumanAuthoringRequest("refinements", {documentId, controllerId, clientSequence,
  workingCopyHash, entityId, opdId, refinementType, question, justification, mode?})`
  (`RefinementProposalAction.tsx:57-63`).
- Revisión compartida y paquete portátil vía `ui/review/*`, `ui/portable/*`.
- Sincronización local-first vía `app/ports/documentPersistencePort.ts` (`saveHere`,
  `synchronize`, `resolveConflict`, `recoveryJson`).

### 7.6 Contrato e2e
76 specs Playwright y ~393 `data-testid` únicos usados desde `e2e/`. Gran parte de la complejidad
("preserva testids", placeholders como `<div data-testid="inspector-entidad-acciones" />` en
`InspectorEntidad.tsx:257`) existe para no romperlos. Una reescritura debe decidir explícitamente
qué escenarios migra (los OPM: crear, enlazar, refinar, OPL roundtrip, persistencia) y cuáles se
retiran con la funcionalidad.

---

## 8. Acoplamientos y capas

- Dirección declarada `modelo → store → app → ui`; en la práctica la shell mezcla tres estilos
  de acceso: viewmodel (`use*ViewModel`), puerto (`useZustand*Port`) y `useOpmStore` directo
  (26 archivos raíz), más `import` directo de `persistencia/*` (7 archivos) y de 41 módulos del
  kernel (`modelo/*`). La capa port/viewmodel no aísla: re-expone selectores 1:1
  (`app/ports/zustandAppShellOverlaysPort.ts` = 25 `useOpmStore` + objeto). `useAppShellViewModel`
  calcula `documentPolicy` en cada render y `App` no lo usa.
- Tres derivaciones de especie documental: `modelo/documentPolicy.ts` (`profile.species`),
  `persistencia/especie.ts` (`especieDe`) y ≥7 expresiones inline
  `s.indice.modelos.some(m => m.id === s.modelo.id && m.esApunte === true …)`.
- El tutor (`app/src/tutor`, 5.850 LOC) se invoca síncronamente en el render de 18 componentes
  raíz (`runTutorPolicy(derive*Intent(...))`) y en handlers `onFocus`.
- Los menús contextuales del canvas los monta `ToolbarBase` (una toolbar), no el canvas.
- Los estilos inline impiden `:hover`/`:focus-visible` → `menus.css` los parchea por
  `data-testid` y `role`.

---

## 9. Olores de sobreingeniería y acreción (ejemplos)

1. **Gobernanza autorreferente en el producto**: `CapturadorBugs` con ledger del repositorio;
   `data-ifml-stereotype`, `data-ifml-modal`, `data-ifml-pattern="DE-DLKP"`, `data-tutor-*`,
   `data-viewpoint*`, `data-context-*` en el DOM para que auditorías "falseen" decisiones;
   `contexto.ts`/`contextoWorkbench.ts` para un `<h1>` sr-only.
2. **Arqueología en comentarios**: ~100 marcas "Ronda N Lx", "Codex v2", "BUG-…", "P0-2 (informe
   UI/UX 2026-05-07)"; explicaciones de por qué algo *ya no está* (`App.tsx:228-233, 326-334`,
   `toolbar/ToolbarBase.tsx:282-289`).
3. **Compat-shims de tokens**: 100+ alias de color para cinco valores; 25 alias de sombra
   `"none"`; tres escalas tipográficas paralelas (`fs.*`, `sizes.*`, `size*`).
4. **Estado espejo**: `InspectorEnlace` duplica 14 campos del enlace en `useState` y los
   re-sincroniza con `useEffect`.
5. **Wrappers de reenvío**: `PanelRefinamiento` (22 props → `SeccionRefinamiento` sin lógica),
   `DialogoImportarExportarJson`, `Toolbar` → `ToolbarBase` + slots.
6. **Features dormidas mantenidas**: mapa del sistema, `ToolbarMas`, `MenuPrincipal`,
   `ChipPersistencia` (componente), `CodexFooterKey`, `CodexInspectField`, `modoMarginaliaCodex`,
   rama mobile editable, helpers de `layoutResponsive` sin uso.
7. **Metodología incrustada en cada transición**: tres párrafos + tutor en Reabrir, Rol
   Biblioteca, Devolver Boceto, Graduar; la cinta permanente "integridad obligatoria; cierre en
   observación".
8. **Múltiples voces para una misma cosa** (ver §5): guardado ×4, renombrar ×5, estado ×3,
   extremos ×3, refinar ×5 entradas + propuesta, reuso ×5, búsqueda de modelos ×5 selectores,
   etiquetas de tipos ×4, `enfocarSeccionInspector` ×3, modales a mano ×4.
9. **Paleta como vertedero**: la ausencia de menú obliga a meter 43 verbos (incluidos "Mostrar
   glifos de versiones", "Imagen: ciclar modo global", "Copiar log de decisiones para la skill")
   en un buscador sin jerarquía; los verbos básicos (Abrir, Guardar como, Exportar) quedan al nivel
   de toggles marginales.

---

## 10. Piezas de alta calidad para portar casi tal cual

| Pieza | Por qué |
|---|---|
| `Dialogo.tsx` | Portal a `body`, foco inicial, trampa de Tab, `Esc` en captura, restauración de foco, tamaños canónicos, acciones tipográficas. Solo corregir la pila de `Esc` para diálogos anidados. |
| `atajosTeclado.ts` | Registro pequeño con contextos, normalización Mac/PC, supresión en modales y en `data-atajos-local`, caída a `canvas` cuando el panel no define el combo. |
| `store/acciones-contextuales.ts` + `ejecutarAccionContextual.ts` | Catálogo puro de disponibilidad por superficie + despacho con `ActionEvent`; base ideal para un registro de comandos único. |
| `MenuTipoEnlace.tsx` (salvo `previewOpl`) | Filtro por firma OPM con motivos, dirección, navegación por teclado, estados "sin origen/sin destino/sin tipos". |
| `CommandPalette` — motor de búsqueda | `normalizarTextoBusqueda`, términos AND, prefijo del label primero, orden por frecuencia, lista plana con query. |
| `Timeline.tsx` + `contextoTimeline` | Materialización directa de la regla temporal del in-zoom con drag antes/paralelo/después. |
| `PanelOplView` + `panelOpl/*` | Delta OPL, sincronía de selección/hover, editor libre con clasificación y preview. |
| `PanelDiagnostico` | Severidad + criterio + acción juntos; anuncio aria-live del delta. |
| `DialogoColisionNombre`, `DialogoEliminarRefinamiento`, `ConfirmacionContext` | Confirmaciones con semántica OPM clara y foco en la opción segura. |
| `DivisorPanel`, `Breadcrumb`, `RenombradoInline`, `CanvasAdapterContext`, `JointCanvasFeedbackBoundary` | Pequeños, correctos, sin dependencias ocultas. |
| `DocumentPersistenceStatus.Branch` | Comparar ramas en conflicto a través de su OPL: idea excelente para un único indicador de persistencia. |

---

## 11. Propuesta de shell para la reescritura (dirección, no implementación)

**Layout**: `OPL | Canvas | Árbol+Inspector` (se conserva el invariante de `GOVERNANCE.md §2`).
Header único de una fila: `Opforja · [Archivo ▾] · pestañas · ruta OPD · ● estado de guardado ·
⌘K`. Toolbar de creación flotante o en el borde superior del canvas (Objeto · Proceso · Estado ·
Enlace), no en el header.

**Principios**:
1. **Un registro de comandos** (id, label, categoría, atajo, `enabled(ctx)`, `run(ctx)`,
   superficies) del que derivan paleta, menú Archivo, menús contextuales, barra de selección y
   cheatsheet. Absorbe `acciones-contextuales` y las 43 acciones de la paleta.
2. **Un router de diálogos**: `dialogo: {tipo: 'abrir' | 'guardarComo' | 'versiones' | …, payload}`
   en el store; sin booleanos por diálogo.
3. **Un indicador de persistencia** con estados `sin guardar · guardando · guardado · sin
   conexión · conflicto`, y un solo panel de detalle (guardar, versiones, descargar JSON,
   conflictos con comparación OPL).
4. **Un inspector** por tipo (cosa, estado, enlace) con edición directa sobre el modelo y
   validación del kernel; estados (renombrar, designar, duración, suprimir) solo en inspector +
   menú contextual; el halo se elimina o se reduce a renombrar inline.
5. **Un catálogo de presentación OPM** (`TIPOS_ENLACE` con label, icono, familia) y **un único
   generador OPL** también para previews.
6. **Una derivación de especie/permisos** (`deriveDocumentPolicy` o equivalente) consumida por
   todas las superficies.
7. **Estilos**: CSS con variables de `ui-forja/tokens.css` y clases; eliminar objetos inline y
   `menus.css`.
8. **Sin telemetría de gobernanza en el DOM** (`data-ifml-*`, `data-tutor-*`); los tests usan
   roles/labels accesibles y un conjunto reducido de testids estables.

**Keep / simplify / cut por bloque**:

| Bloque | Decisión |
|---|---|
| Canvas, OPL, árbol, inspector, creación, enlace con firma, refinamiento directo, timeline, diagnóstico, búsqueda `Ctrl+F`, colisión de nombres, undo/redo, pestañas, login | **Keep** (reimplementar limpio, portando las piezas de §10). |
| Gestor de modelos | **Simplify**: una lista con búsqueda, carpetas como filtro, acciones Abrir/Duplicar/Versiones/Archivar/Eliminar; accesible desde "Archivo". |
| Guardar como, Versiones, JSON import/export, PNG/Markdown export | **Simplify**: todo bajo "Archivo"; "Descargar JSON" visible. |
| Persistencia doble (autosalvado backend + local-first) | **Simplify**: un modelo de sincronización y un indicador. |
| Apunte/Taller/Graduar/Reabrir/Cintas | **Simplify o cut**: si se conserva el régimen relajado, un conmutador "Borrador" en la ficha del modelo que cambie la severidad del diagnóstico; sin cintas, sin diálogos de transición. |
| Bocetos (OPD sin padre) | **Keep** como capacidad OPM bottom-up (integrar como descomposición/despliegue, devolver). |
| Biblioteca, Piezas (Calcar/Anclar), Reutilizar pieza, Submodelo, Composición | **Simplify**: dejar dos operaciones — *importar fragmento (copia)* y *referenciar modelo (submodelo solo lectura)*; composición como importación con mapeo. |
| Requisitos, imagen/URLs de objeto, ontología, simulación numérica | **Marginal**: módulos opcionales tras "Extensiones"; ontología fuera hasta que tenga efecto real. |
| Mesa de exploración, `copiar contexto/log para la skill` | **Cut** del producto núcleo (o plugin del método Forja). |
| Tutor transversal | **Simplify**: ayuda contextual "?" por superficie con el mismo corpus; sin motor de políticas en render. |
| Agente (IntentBar, propuestas, ChangeReview), revisión compartida, paquete portátil | **Important/opcional**: agrupar en un panel "Colaborar"; no ocupar franjas permanentes sobre el canvas. |
| Capturador de bugs, mapa del sistema, mobile editable, `GestionArbolOpd`, `PanelCarpetas`, `DialogoImportarExportarJson`, `ChipPersistencia` (componente), `ToolbarMas`, contexto IFML | **Cut**. |

---

## 12. Riesgos y preguntas abiertas

- ¿El régimen Apunte/Modelo tiene usuarios reales o es una decisión metodológica del operador?
  Afecta si el conmutador de severidad se conserva (R23) o desaparece.
- La persistencia local-first (`DocumentPersistenceStatus`) parece el camino nuevo del "producto
  integrado" (`HANDOFF.md`); confirmar cuál de los dos sistemas sobrevive antes de diseñar el
  indicador único.
- Paralelismo por Y exacta (R18) es frágil; decidir tolerancia (p. ej. solapamiento del tope) sin
  contradecir ISO 19450.
- Los ~393 testids e2e: definir qué escenarios migrar. La suite verde actual no garantiza
  usabilidad (varios defectos de §6 conviven con tests verdes).
- `previewOpl` y otras copias de reglas: toda regla OPM de §4 debe quedar con una sola
  implementación en el kernel y ser consultada por la UI; la reescritura es la ocasión para
  eliminar las réplicas locales.
