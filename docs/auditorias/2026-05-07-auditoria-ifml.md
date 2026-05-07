# Auditoría IFML — deep-opm-pro
Fecha: 2026-05-07. Plataforma: web desktop-first.

Auditor: agente IFML Architect (Claude Opus 4.7, 1M ctx). Corpus IFML cargado desde
`~/kora/artifacts/knowledge/fxsl/ifml/*.md` (ifml-fundamentos, ifml-view-containers,
ifml-view-components, ifml-actions-events, ifml-patrones, ifml-extensiones-desktop,
ifml-extensiones-web). Modos operativos: M1 (audit) + M3 (flow optimization) + M4
(consistency review).

## 1. Resumen ejecutivo

El workbench de deep-opm-pro está bien estructurado como composición conjuntiva de
landmarks (Toolbar, BarraPestanas, ArbolOpd, Inspector, PanelOpl, PanelAvisos) con
un único punto disjuntivo (canvas vs MapaSistema), pero el modelo IFML implícito
muestra cuatro debilidades sistémicas: (a) el conjunto de modales se gestiona como
flags booleanos en store —no como pila ordenada— violando la semántica modal; (b)
muchas Actions del store no están encapsuladas como nodos IFML sino disueltas en
event handlers anónimos; (c) Toolbar registra ParameterBindings y atajos
duplicados con App.tsx, fragmentando el contrato Event→Action; (d) la Action
`crearEntidadEnCanvas` propaga vía `window.dispatchEvent("opm:nueva-cosa")` un
canal SystemEvent ad-hoc que sustituye lo que debería ser un NavigationFlow
explícito hacia un sub-ViewContainer Form modal. Tres oportunidades top:
formalizar BarraPestanas como ViewContainer disjuntivo de orden 1 (no auxiliar),
introducir un patrón CN-DEF para selección por defecto del OPD raíz al cargar,
y unificar el catálogo de modales en una pila (modal-stack) coherente con
Escape→top-of-stack ya implementado en App.tsx:122.

## 2. Encuadre

- Plataforma: web SPA Preact + Zustand + JointJS, desktop-first sin auth ni
  multi-rol. Sin políticas IA-RBP / IA-LOGIN aplicables.
- Roles: un único actor implícito (operador). No hay ContextDimension UserRole.
- Dimensiones contextuales activas:
  - Device: implícito en literal `desktop-first`; no se observan ActivationExpression
    sobre breakpoint. [no verificado]
  - ConnectivityType: no aplicable — persistencia 100% local (`store/runtime`,
    `persistencia/local.ts`).
  - SessionState: implícito en `dirty`, `modeloPersistidoId`, `autosalvado`. No
    es un ContextDimension declarado pero gobierna habilitación de Actions
    (Toolbar.tsx:268 título "(No guardado)", Toolbar.tsx:373 `confirmarSiDirty`).
- Familias de patrones IFML dominantes:
  - **OD-CWA** (Composite work area): workbench grid 4 columnas.
  - **CN-MD** (Master-detail): ArbolOpd → JointCanvas → Inspector encadenan tres
    niveles maestro-detalle (OPD seleccionado → entidad/enlace seleccionada →
    propiedades).
  - **CM-OCR/CM-ODL/CM-OM** (Object creation/deletion/modification): toda la
    edición OPM cae aquí.
  - **DE-FRM** (Multifield form): InspectorEntidad e InspectorEnlace.
  - **DE-WIZ** (Wizard): AsistenteNuevoModelo (12 etapas).
  - **CS-SRC / CS-MCS**: DialogoBuscarCosas (multicriterio: query+tipo) y
    DialogoBuscarGlobal (cross-modelo).
  - **CN-BREAD / CN-UP**: navegación de OPDs (atajos Ctrl+Arrow* en App.tsx:159-162)
    expone semántica padre/hermanos pero ningún breadcrumb visible verificado en UI.
  - **CM-NOTIF**: PanelAvisos y mensajes de status en Toolbar.tsx:67/522.
  - **OW-LWSA**: gestión de Workspace (carpetas, archivados, versiones).

## 3. Modelo IFML del workbench

Pseudo-DSL tomando IFML/OMG canónico con extensiones desktop. Símbolos: `[D]`
default, `[L]` landmark, `<<XOR>>` disjuntivo, `<<AND>>` conjuntivo, `→` Navi-
gationFlow, `--→` DataFlow, `⟶S` SystemFlow, `[E]` Event, `[A]` Action, `[PB]`
ParameterBinding.

### 3.1 Top-level

```
ViewContainer AppRoot <<AND>> [L]                       (App.tsx:62 main grid 4 filas)
├── ViewContainer Toolbar [L]                           (Toolbar.tsx — 48 px)
│   ├── ViewComponent ButtonGroup-Crear (Form-like)
│   ├── ViewComponent ButtonGroup-Persistencia
│   ├── ViewComponent SelectorTipoEnlace (SelectionField)
│   ├── ViewComponent SelectorAlinear/Distribuir (SelectionField, condicional)
│   ├── ViewComponent EstadoModelo (Details: nombre+dirty+versiones+archivado)
│   ├── ViewContainer MenuPrincipal <<Modeless>>        (lazy MenuPrincipal.tsx:13)
│   └── ViewContainer MenuTipoEnlace / MenuContextual* <<Modeless>>
├── ViewContainer BarraPestanas [L]                     (37 px) — pestañas son
│                                                        ViewContainers disjuntivos hermanos
├── ViewContainer Workbench <<AND>> [D]                 (App.tsx:66, grid 240/6/1fr/300[/320])
│   ├── ViewContainer ArbolOpd [L]                       (lista jerárquica de OPDs)
│   ├── ViewContainer CanvasArea <<XOR>>                  (App.tsx:75-81)
│   │   ├── ViewContainer JointCanvas [D]                 (editor diagramático)
│   │   └── ViewContainer MapaSistema                     (lazy, vista global)
│   ├── ViewContainer InspectorPane <<AND>>
│   │   ├── ViewContainer Inspector <<XOR>>               (Inspector.tsx selector)
│   │   │   ├── ViewContainer InspectorEntidad
│   │   │   └── ViewContainer InspectorEnlace
│   │   ├── ViewContainer Timeline
│   │   └── ViewContainer PanelAvisos
│   └── ViewContainer OplPane (lateral, sólo si oplPosicion=lateral-derecho)
└── ViewContainer OplPane (inferior, default)            (App.tsx:96)
```

ViewContainers `<<Modal>>` (lazy) montados en AppRoot bajo flag de store, no
anidados:

```
[Modal]    AsistenteNuevoModelo            (DE-WIZ, 12 etapas)
[Modal]    DialogoGuardarComo              (DE-FRM + CM-OCR)
[Modal]    DialogoCargarModelo             (CN-MD sobre WorkspaceIndice)
[Modal]    DialogoBuscarGlobal             (CS-SRC cross-modelo)
[Modal]    DialogoBuscarCosas              (CS-MCS dentro del modelo)
[Modal]    DialogoVersiones                (lista versiones de un modelo)
[Modal]    DialogoArchivados               (subset filtrado del workspace)
[Modal]    DialogoTraerConectados          (CM-OACR — añade apariencias+enlaces)
[Modal]    DialogoPlantillas               (CN-MD plantillas privadas)
[Modal]    DialogoGuardarPlantilla         (DE-FRM)
[Modal]    DialogoEstiloEnlace             (DE-FRM)
[Modal]    DialogoMoverPuerto              (DE-FRM)
[Modal]    DialogoGestionArbol             (CM-OM jerarquía OPDs)
[Modal]    ModalConfiguracionGrid          (DE-FRM)
[Modal]    ModalImagenObjeto / ModalUrlsObjeto / ModalDuracionEstado  (DE-FRM)
[Modal]    CheatsheetAtajos                (Details — read-only)
[Modal]    DialogoConfirmacion             (CM-NOTIF de confirmación dirty)
```

### 3.2 ViewContainer crítico — JointCanvas

```
ViewContainer JointCanvas [D] (XOR con MapaSistema)
  DataBinding: modelo.opds[opdActivoId].apariencias + modelo.entidades + modelo.enlaces
  ViewComponent CanvasGrid (background)
    ContentBinding: gridConfig (DataFlow desde store)
  ViewComponent ListaApariencias <<MultiChoiceList>>
    DataBinding: opds[opdActivoId].apariencias
    Events:
      [E] ClickEntidad        → [A] seleccionarEntidad         (acciones-canvas:64)
      [E] ClickEnlace         → [A] seleccionarEnlace
      [E] CtrlClick           → [A] alternarSeleccionMulti
      [E] DoubleClick         → [A] descomponer/desplegar (refinement) [no verificado]
      [E] OnDragStart         → [A] crearEntidadEnCanvas (drop desde Toolbar)
      [E] OnDrop              → [A] crearEntidadEnCanvas / pegarBufferEnOpdActivo
      [E] OnContextMenu       → ⟶S MenuContextualEntidad (Toolbar.tsx:204)
      [E] PointerMove         → [A] moverApariencia (drag interno)
      [E] PointerMoveLink     → [A] actualizarVerticesEnlace
  ViewComponent CapaEnlaces <<List>>
  ViewComponent OverlayCreaciónEnlace (visible cuando modoEnlace ≠ null)
  PB: opdActivoId (origen ArbolOpd) — DataFlow
  PB: seleccionId (target Inspector) — DataFlow
```

### 3.3 ViewContainer crítico — InspectorEntidad

```
ViewContainer InspectorEntidad <<Form>>                  (InspectorEntidad.tsx:29)
  DataBinding: modelo.entidades[seleccionId]  (recibido como prop entidad)
  PB de entrada: seleccionId (DataFlow desde JointCanvas)
  ViewComponentParts (SimpleField/SelectionField sobre DataContextVariable):
    SimpleField nombre               [E] OnInput → [A] renombrarSeleccionada
    EditableTextArea descripcion     [E] OnInput → [A] editarDescripcionEntidad
    SimpleField alias / unidad       (sólo objeto)
    SelectionField esencia           [E] OnChange → [A] fijarEsenciaSeleccionada
    SelectionField afiliacion        [E] OnChange → [A] fijarAfiliacionSeleccionada
    Sub-Form SeccionUrls             → [E] click → ⟶ Modal ModalUrlsObjeto
    Sub-Form SeccionImagen           → [E] click → ⟶ Modal ModalImagenObjeto
    Sub-Form SeccionAtributo         (sólo si esAtributoDerivado)
    Sub-Form SeccionTamano           (acciones tamaño/auto)
    Sub-Form SeccionRefinamiento     [A] descomponer / desplegar / quitar*
    Sub-Form SeccionLayoutEstados    (sólo objeto, MultiChoiceList sobre estados)
    Sub-Form StyleControls           [E] OnChange → [A] aplicarEstilo / aplicarEstiloASeleccion
    Button Eliminar entidad          [E] Submit → [A] eliminarSeleccion
  Patrón CN-DEF aplicable: el binding del nombre dispara renombrar en cada
    keystroke (renombrarSeleccionada en InspectorEntidad.tsx:93) — pattern
    CM-OM in-place edit (DE-INPL) implementado correctamente.
```

### 3.4 ViewContainer crítico — AsistenteNuevoModelo (DE-WIZ canónico)

```
ViewContainer AsistenteNuevoModelo <<Modal>> <<DE-WIZ>>  (Asistente.tsx:49)
  ViewContainer EtapaActual <<XOR>> sobre asistente.etapaActual ∈ [0..11]
    ViewContainer Bienvenida [D]
    ViewContainer EtapaFuncionPrincipal       (obligatoria, SimpleField)
    ViewContainer EtapaBeneficiario           (obligatoria)
    ViewContainer EtapaAtributo               (opcional)
    ViewContainer EtapaHandler                (opcional)
    ViewContainer EtapaNombreSistema          (obligatoria)
    ViewContainer EtapaHerramientas           (opcional, MultiChoiceList)
    ViewContainer EtapaEntradas               (opcional, MultiChoiceList)
    ViewContainer EtapaSalidas                (opcional)
    ViewContainer EtapaAmbientales            (opcional, MultiChoiceList derivada)
    ViewContainer EtapaConfirmar              (Details + summary)
  Footer ViewComponent NavegacionWizard:
    Button Anterior     [E] Click → [A] etapaAnterior
    Button Cancelar     [E] Click → [A] cancelarAsistente   (set cancelado=true)
    Button Saltar       [E] Click → [A] handleSaltar (sólo en ETAPAS_OPCIONALES)
    Button Siguiente    [E] Click → [A] handleSiguiente / siguienteEtapa
    Button Confirmar    [E] Click → [A] confirmarAsistente  (commit del modelo)
  PB de salida (al confirmar): DatosAsistente → crearModelo() → reemplaza modelo del Workbench
```

Nota IFML: el patrón DE-WIZ está bien materializado pero el orden está
hard-codeado en el componente (Asistente.tsx:67-90) en vez de modelarse como
serie de ActivationExpression entre ViewContainers; es válido pero opaco a
inspección.

### 3.5 ViewContainer crítico — DialogoBuscarGlobal (CS-SRC cross-modelo)

```
ViewContainer DialogoBuscarGlobal <<Modal>> <<CS-SRC>>   (DialogoBuscarGlobal.tsx:6)
  ViewComponent SimpleField query (debounce 300 ms en useEffect:18-21)
    [E] OnInput → [A] fijarBusquedaGlobalQuery       (DataFlow al store)
                  ⟶ debounce → [A] ejecutarBusquedaGlobal (búsqueda asincrónica)
    [E] OnKeyDown(Enter) → [A] abrirResultadoBusquedaGlobal(resultados[0])
  ViewComponent ListaResultados <<List>>
    DataBinding: busquedaGlobal.resultados : Array<{modeloId, nombre, rutaCarpetas, match}>
    Cada fila:
      [E] Click → confirmarSiDirty → [A] abrirResultadoBusquedaGlobal(modeloId)
                                       → NavigationFlow al nuevo Workbench-modelo
  Estados vacíos: query<3 chars / sin resultados (renderiza Details mensaje).
```

Otros 14 modales se referencian en §3.1 sin desarrollar — todos siguen el patrón
DE-FRM o CN-MD canónico.

## 4. ViewComponents y bindings clave

| Container | Componente | Tipo IFML | DataBinding | ParameterBindings |
|---|---|---|---|---|
| Toolbar | EstadoModelo | Details | `modelo.nombre`, `dirty`, `modeloPersistidoId` | — |
| Toolbar | SelectorEnlace | SelectionField | catálogo TIPOS_ENLACE | output → `modoEnlace.tipo` |
| Toolbar | SelectorDemo | SelectionField | `listarFixtures()` | output → cargarFixtureDemo |
| Toolbar | BibliotecaCosa (modeless) | List | `modelo.entidades` filtrado | output → drag→canvas |
| ArbolOpd | TreeOpds | Tree | `modelo.opds` jerárquico | output → `opdActivoId` |
| JointCanvas | ListaApariencias | MultiChoiceList | `opds[opdActivoId].apariencias` | input ← opdActivoId, output → seleccionId/seleccionados |
| JointCanvas | CapaEnlaces | List | `opds[opdActivoId].enlaces` | derivada de apariencias |
| InspectorEntidad | Form raíz | Form | `entidades[seleccionId]` | input ← seleccionId |
| InspectorEntidad | SeccionLayoutEstados | MultiChoiceList | `estadosDeEntidad(modelo, id)` | input ← entidadId |
| InspectorEntidad | StyleControls | Form | `aparienciaActiva.estilo` | input ← aparienciaActiva.id |
| InspectorEnlace | Form raíz | Form | `enlaces[enlaceSeleccionId]` | input ← enlaceSeleccionId |
| InspectorEnlace | SeccionAbanico | Details+Action | `abanicoDeEnlace(modelo, id)` | input ← enlace.id |
| PanelOpl | Bloques | NestedList (NL) | OPL agrupado por OPD | input ← `seleccionRef`, hover bidireccional |
| PanelAvisos | ListaAvisos | List | `validarModelo(modelo, opdActivoId)` | output → navegarAviso (NavigationFlow + PB seleccionId/opdActivoId) |
| MapaSistema | GrafoOpds | Marker (extensión Path para aristas) | `descriptorMapaFiltrado()` | output(dblclick) → saltarAOpdDesdeMapa → opdActivoId |
| BarraPestanas | ListaPestanas | DynamicSortedList | `pestanasAbiertas` | output → `pestanaActivaId` (XOR) |
| DialogoCargarModelo | Lista modelos | List | `modelosGuardados` | output → cargarLocal(id) |
| DialogoVersiones | Lista versiones | DynamicSortedList | `modelosGuardados[id].versiones` | input ← modeloId |
| DialogoBuscarCosas | Resultados | Table | resultados derivados (memo) | input ← query+filtro |

ParameterBindings inferidos por contexto IFML (no explícitos en el código):
- `opdActivoId` → JointCanvas, PanelOpl, PanelAvisos (DataFlow implícito vía
  store; correcto bajo principio "inference from context").
- `seleccionId / enlaceSeleccionId` → Inspector (XOR resolución), PanelOpl
  (filtroOplPorSeleccion).
- `modelo` (root) → casi todos los componentes lo leen vía `useOpmStore((s) =>
  s.modelo)`. Es DataFlow global multicast.

## 5. Eventos, Actions y Atajos

Mapa de Actions principales y su contrato Event→Action:

| Action (slice) | Trigger Event | Atajo | Ubicación | ActionEvents (normal/excepcional) |
|---|---|---|---|---|
| `nuevoModelo` | Click "Nuevo" | — | Toolbar.tsx:350, MenuPrincipal | normal: workbench reset; excepcional: confirmarSiDirty cancelado |
| `iniciarAsistente` | Click "Nuevo modelo por asistente" | — | MenuPrincipal.tsx:71 | normal: abre AsistenteNuevoModelo |
| `guardarLocal` | Click / Submit | Ctrl+S | App.tsx:139, Toolbar.tsx:144 | normal: snapshot+mensaje; excepcional: error de validación → mensaje |
| `abrirCargarModelo` | Click | — | Toolbar.tsx:373 | normal: abre Modal |
| `cargarFixtureDemo(nombre)` | Change SelectorDemo | — | Toolbar.tsx:355 | normal: workbench reemplazado |
| `crearObjetoDemo` / `crearProcesoDemo` | Click | — | Toolbar.tsx:307-308 | normal: nueva apariencia + selección |
| `crearEntidadEnCanvas(tipo, pos)` | Drop al canvas | — | acciones-entidad:60 | normal: emite SystemEvent `opm:nueva-cosa` (Toolbar.tsx:185) |
| `fijarModoCreacion(tipo)` | Toggle "Objeto/Proceso en canvas" | — | Toolbar.tsx:329/341 | sticky-mode (modoCreacion en store) |
| `elegirTipoEnlace(tipo)` | Change SelectorEnlace | — | Toolbar.tsx:385 | activa modoEnlace; excepcional: cancelarEnlace |
| `seleccionarEntidad(id)` | Click apariencia | — | acciones-canvas:64 | bifurcación: si modoEnlace activo crea enlace; si no, fija seleccionId |
| `descomponerSeleccionada` | Botón en SeccionRefinamiento | — | acciones-opd:78 | normal: opdActivoId cambia al hijo; excepcional: "Selecciona un proceso" |
| `desplegarSeleccionada` | Botón / Shift+U | Shift+U | App.tsx:163 | normal/excepcional |
| `eliminarSeleccion` | Botón Inspector / Toolbar | Delete | App.tsx:149 | sin confirmación |
| `deshacer` / `rehacer` | Botón / atajo | Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z | App.tsx:143-145, Toolbar.tsx:151-163 | normal/no-op |
| `seleccionarTodoEnOpd` | atajo | Ctrl+A | App.tsx:146 | sólo ctx canvas |
| `copiarSeleccionAlBuffer` / `pegarBufferEnOpdActivo` | atajo | Ctrl+C, Ctrl+V | App.tsx:147-148 | excepcional: buffer vacío |
| `nudgeSeleccion(dx,dy)` | atajos | Arrows / Shift+Arrows | App.tsx:151-158 | requiere selección |
| `navegarOpdArriba/Abajo/Izquierda/Derecha` | atajo | Ctrl+Arrows | App.tsx:159-162 | navegación jerárquica |
| `abrirBusquedaCosas` / `abrirDialogoBuscarGlobal` | Click / atajo | Ctrl+F / Ctrl+Shift+F | App.tsx:140-141 | abre Modal |
| `abrirGestionArbol` | atajo | Ctrl+D | App.tsx:142 | abre Modal |
| `cerrarModalSuperiorOVaciarSeleccion` | atajo | Escape | App.tsx:122-137,150 | semántica modal-stack manual |
| `abrirPestanaNueva` / `cerrarPestana` | atajo | Ctrl+T / Ctrl+W | App.tsx:168-172 | normal |
| `cambiarPestanaRelativa(±1)` | atajo | Ctrl+Tab / Ctrl+Shift+Tab | App.tsx:173-174 | normal |
| `conectarSeleccionAlTodo` | Botón / atajo | Ctrl+Alt+T | Toolbar.tsx:252 | requiere ≥2 seleccionados |
| `traerConectadosSeleccionado` | Click MenuContextualEntidad | Ctrl+Shift+T | Toolbar.tsx:226 | abre DialogoTraerConectados o ejecuta default |
| `ocultarAparienciaSeleccionada` | Click / atajo | Ctrl+H | Toolbar.tsx:230 | requiere selección |
| `copiarEstiloEnlaceAlPortapapeles` / `pegar` | atajos | Ctrl+Alt+C / V | Toolbar.tsx:244-251 | excepcional: enlace vacío |
| `solicitarExportMapa(formato)` | Click | — | MenuPrincipal.tsx:218 | dispatch CustomEvent → MapaSistema (SystemFlow ad-hoc) |
| `navegarAviso(aviso)` | Click "Ir" | — | acciones-opd:228 | NavigationFlow + PB(opdActivoId, seleccionId/enlaceSeleccionId) |
| `saltarAOpdDesdeMapa(opdId)` | DoubleClick mapa | — | MapaSistema.tsx:74-79 | NavigationFlow al JointCanvas |
| `solicitarExportMapa` ⟶ MapaSistema | window.dispatchEvent | — | MenuPrincipal.tsx:218 → MapaSistema.tsx:166 | SystemFlow ad-hoc |
| `crearEntidadEnCanvas` ⟶ Toolbar (modal nombre) | window.dispatchEvent("opm:nueva-cosa") | — | Toolbar.tsx:175-187 | SystemFlow ad-hoc |

Verificación de no-orfandad de eventos:
- Todos los atajos registrados en App.tsx:138-175 disparan handlers con
  validación de ctx (`canvas` vs `global`) — coherente con extensión IFML web
  para teclado.
- Eventos contextmenu en Toolbar.tsx:204-220 (capture) son ViewElementEvents
  globales que internamente seleccionan y abren MenuContextualEntidad — pasan
  el test de no-orfandad.
- Drag&Drop entre Toolbar.tsx:727-739 y JointCanvas: el evento OnDragStart en
  Toolbar fija dataTransfer y el OnDrop en canvas (no leído pero referenciado
  por crearEntidadEnCanvas) consume — par OnDragStart/OnDrop completo.

## 6. Patrones IFML aplicados / aplicables

| Código | Nombre | Estado | Evidencia / dónde |
|---|---|---|---|
| OD-CWA | Composite work area | sí | App.tsx:66 grid 4 columnas con tree+canvas+inspector+OPL |
| OD-MCWA | Multiview composite | parcial | XOR canvas/MapaSistema cumple "multiview"; pero falta una vista alternativa "table" del modelo (TablaEnlaces existe pero abre como modal en lugar de view alterna) |
| OW-LWSA | Large website organizada en áreas | parcial | Workspace = áreas (carpetas); accesibles desde diálogos pero sin vista tipo "site map" persistente — MapaSistema cubre OPDs, no carpetas |
| OW-MFE | Múltiples front ends sobre el mismo modelo | sí | BarraPestanas permite N pestañas independientes sobre el mismo Workspace |
| CN-MD | Master-detail | sí | ArbolOpd→Canvas→Inspector triple |
| CN-MMD | Master-multidetail | sí | InspectorPane = AND(Inspector, Timeline, PanelAvisos), todos derivados de la misma selección/OPD |
| CN-MLMD | Multilevel master-detail | sí | tres niveles encadenados por DataFlow |
| CN-DEF | Default selection | parcial | opdActivoId persiste pero al cargar modelo sin estado previo no hay garantía de OPD raíz seleccionado [no verificado en runtime sin ejecutar] |
| CN-CIM&B | Content-independent menu/navbar | sí | Toolbar y MenuPrincipal son landmark globales |
| CN-UP / CN-BACK | Up / Back navigation | parcial | Ctrl+Arrows navegan jerarquía; no existe BACK del histórico de OPDs visitados |
| CN-BREAD | Breadcrumbs | no | Toolbar muestra solo nombre de modelo, no la ruta del OPD activo. Ronda candidata: añadir migas en BarraPestanas. |
| CN-SOT / CN-MOT | Single/Multiple object toolbar | sí | Toolbar.tsx:445-521 sección condicional `seleccionados.length>=2` con Eliminar/Agregar al todo/Traer enlaces/Alinear/Distribuir |
| CN-DT | Dynamic toolbar | sí | Toolbar oculta/muestra grupo de alineación (445), grupo mapa (575), badges (modoCreacion, readOnly) según estado |
| CN-MSC | Multistep commands | sí | crear-enlace requiere 2 clicks (origen → seleccionar tipo → destino); modo sticky de creación; modoEnlace |
| CN-CII | Commands with inline input | sí | nombre-input modal de creación de cosa (Toolbar.tsx:639-663) |
| CN-PG | Paging | no aplicable | listas son pequeñas (OPDs/entidades del modelo) |
| CN-PR | Collection preview | parcial | MapaSistema actúa como preview/overview; ejemplares en SelectorDemo con `title=proposito` (tooltip preview) |
| CN-ALPHA | Alphabetical filter | no | DialogoBuscarCosas tiene filtro tipo pero no índice alfabético |
| DE-FRM | Multifield form | sí | InspectorEntidad, InspectorEnlace, todos los Modal* |
| DE-PLDF | Preloaded field | sí | nuevaCosa.nombre se preload con entidad.nombre (Toolbar.tsx:181) |
| DE-PASF | Pre-assigned selection | sí | EditarMultiplicidadEnlace pre-asigna valor previo (InspectorEnlace.tsx:69) |
| DE-DLKP | Data lookup | parcial | DialogoBuscarCosas/Global son lookups; pero Inspector no usa DLKP para reasignar extremos de enlace (lo hace via SeccionExtremos con apuntar manual) |
| DE-CSF | Cascade selection | parcial | SeccionMultiplicidad: cambio modificador habilita subtipoModificador. No documentado como cascade en código. |
| DE-WIZ | Wizard | sí | AsistenteNuevoModelo (12 etapas, opcionales saltables) |
| DE-TDFP | Type-dependent field properties | sí | InspectorEntidad muestra secciones distintas según `entidad.tipo === "objeto"` (alias/urls/imagen/estados) o atributoDerivado (línea 103-111) |
| DE-RTE | Rich text editing | parcial | SeccionDescripcion sólo textarea plano |
| DE-AUTO | Input auto-completion | no | DialogoBuscarCosas no auto-completa nombres de entidades; sólo filtra |
| DE-DYN | Dynamic selection fields | sí | MenuTipoEnlace filtra TIPOS_ENLACE según validez origen-destino (Toolbar.tsx:626) |
| DE-INPL | In-place editing | sí | RenombradoInline, edición en JointCanvas y SeccionDescripcion |
| DE-VAL | User input validation | sí | validarMultiplicidad (InspectorEnlace.tsx:83), validarEtiquetaEnlace, validarNombreModeloLocal (acciones-ui:98) |
| CS-SRC | Basic search | sí | DialogoBuscarGlobal |
| CS-MCS | Multicriteria | sí | DialogoBuscarCosas (query + tipo) |
| CS-FSR | Faceted search | no | sólo dos facetas en DialogoBuscarCosas |
| CS-SRCS | Search suggestions | no | sin auto-complete ni history |
| CM-OCR | Object creation | sí | crearObjetoDemo, crearProcesoDemo, crearEntidadEnCanvas, crearAtributoEnObjetoSeleccionado |
| CM-OACR | Object and association creation | sí | DialogoTraerConectados, conectarSeleccionAlTodo, MenuTipoEnlace |
| CM-ODL | Object deletion | sí | eliminarSeleccion, borrarEnlacesEnLote |
| CM-CODL | Cascaded deletion | sí | eliminarOpdDesdeArbol con confirmación (acciones-opd:197) |
| CM-OM | Object modification | sí | InspectorEntidad/Enlace completos |
| CM-AM | Association management | sí | reasignarEnlaceExternoManual, reanclarEnlaceExternoDerivado, moverPuerto |
| CM-NOTIF | Notification | sí | mensaje en Toolbar (522), PanelAvisos, autosalvado badge |
| CM-CBCM | Class-based content management | n/a | no hay CMS clase-basado |
| CM-PBCM | Page-based content management | parcial | DialogoGestionArbol gestiona la jerarquía OPD (≈ páginas) |
| IA-LOGIN/LOGOUT/RBP/etc. | Identidad y autorización | no aplicable | sin auth |
| IA-PRO | User profile | n/a | — |
| SES-CR / SES-PER / SES-EXC | Session management | parcial | autosalvado y `dirty` cumplen SES-PER de facto; SES-EXC no aplicable sin sesión expirable |
| SOC-* | Social functions | no aplicable | producto local |

## 7. Reporte de validación

| Invariante IFML | Resultado | Evidencia |
|---|---|---|
| Cada Event tiene al menos un OutgoingFlow o Action asociada | PASS | Toolbar y App enumeran todos los handlers; los atajos sin handler activan logs de descarte (atajosTeclado.ts) |
| ViewContainers `<<XOR>>` declaran un Default | PARCIAL | JointCanvas es default frente a MapaSistema (App.tsx:75-81) — correcto. Inspector XOR no tiene Default declarado: si seleccionId y enlaceSeleccionId son null, Inspector renderiza placeholder [no verificado] |
| ParameterBinding requerido está provisto | PASS | seleccionId, opdActivoId, modeloPersistidoId fluyen vía store; inferencia por contexto válida |
| Modal containers tienen Cancel/Close path | PASS | Cada Modal lazy tiene boton Cerrar/Cancelar y atajo Escape (App.tsx:122-137) |
| Pila modal coherente | FAIL parcial | App.tsx:122 implementa modal-stack manual con orden hard-coded de 12 flags; no soporta apilamiento real (e.g. abrir Modal A desde Modal B). Ver hallazgo H-3. |
| Action con efectos colaterales declara ActionEvents normal/exceptional | PARCIAL | Las Actions del store retornan via `set({mensaje})` para casos excepcionales (acciones-opd:81-86); el "normal" se materializa en el commit del modelo. No hay distinción tipada. |
| NavigationFlow vs DataFlow distinguibles | PARCIAL | Mayoría son DataFlows implícitos por store; los CustomEvent (`opm:nueva-cosa`, `deep-opm-pro:exportar-mapa`) son SystemFlows ad-hoc no documentados como tales. Ver hallazgo H-4. |
| Landmarks accesibles desde cualquier ViewContainer | PASS | Toolbar/BarraPestanas/ArbolOpd/Inspector/PanelAvisos persisten en cualquier estado |
| Default de Workbench resuelto al cargar modelo | PARCIAL | opdActivoId se resuelve via opdActivoSeguro pero no hay test de "carga inicial → OPD raíz" verificado [no verificado] |
| Eventos sin salida colgados | PASS | Inspeccion de App.tsx muestra cada combo registra handler |
| Conjuntivo vs disjuntivo coherente | PASS | OplPane lateral/inferior es XOR sobre `oplLateral`; Inspector/Timeline/PanelAvisos son AND apilados; canvas/mapa es XOR. |
| Acciones referenciadas, no encapsuladas | FAIL | Muchas Actions están encapsuladas como funciones anónimas inline en Toolbar.tsx (e.g. línea 633-637 onElegir crea enlace y cierra menú en una sola lambda); IFML pediría una Action nombrada `crearEnlaceYCerrarMenuTipos`. Ver hallazgo H-2. |

## 8. Hallazgos

| ID | Sev | Hallazgo | Regla IFML violada | Ubicación | Fix sugerido |
|---|---|---|---|---|---|
| H-1 | bloqueante | Modal stack implementado como cadena `if/else` de 12 flags en `cerrarModalSuperiorOVaciarSeleccion`. Si en el futuro un Modal abre otro Modal (e.g. DialogoCargarModelo → DialogoConfirmacion), el orden lexicográfico de la cadena decide cuál se cierra primero, no el orden de apertura. | "Modal containers must form a stack with LIFO close semantics" (extensión desktop) | App.tsx:122-137 | Introducir `pilaModales: ModalId[]` en store; abrir = push, cerrar = pop. Escape consulta el top. |
| H-2 | alto | Action implícita: `MenuTipoEnlace.onElegir` es una lambda inline (Toolbar.tsx:633-637) que combina `crearEnlaceEntreEntidades` + `setMenuTiposAbierto(false)`. No hay nodo IFML "Action: crearEnlaceDesdeMenuTipos" referenciable. | Action debe ser referenciable, con ActionEvents nominados | Toolbar.tsx:633-637, similar en MenuContextualEnlace handlers (664-690) | Extraer a método del slice `crearEnlaceDesdeMenuTipos(origen,destino,tipo)` que también limpia UI; se hace navegable desde tests. |
| H-3 | alto | El SystemFlow `window.dispatchEvent("opm:nueva-cosa", {...})` (acciones-entidad → emitirNuevaCosa) sustituye lo que IFML modelaría como NavigationFlow al sub-ViewContainer "modal nombre cosa". Acopla via canal global. | SystemEvent debe declararse explícitamente; NavigationFlow es preferible cuando hay relación causal directa | acciones-entidad.tsx (función emitirNuevaCosa, no leída pero referenciada en Toolbar.tsx:185) | Reemplazar por estado en store: `nuevaCosaPendiente: {entidadId, nombre} | null`; el modal lee directo. Elimina el bus global. |
| H-4 | alto | El SystemFlow `window.dispatchEvent("deep-opm-pro:exportar-mapa")` (MenuPrincipal.tsx:218 → MapaSistema.tsx:166) cruza dos ViewContainers que no son padre-hijo; el productor (MenuPrincipal lazy en Toolbar) no sabe si MapaSistema está montado. | SystemFlow no documentado, sin SystemEvent tipado | MenuPrincipal.tsx:218, MapaSistema.tsx:166-173 | Migrar export a Action `exportarMapaActual(formato)` en slice mapa, leída desde MapaSistema vía effect del propio store. |
| H-5 | alto | Atajos duplicados: `Ctrl+S` se registra dos veces (App.tsx:139 y Toolbar.tsx:144). `Ctrl+Z/Ctrl+Y` también (App.tsx:143-145 y Toolbar.tsx:151-163). Ambos handlers se ejecutan en el orden de instalación, son idempotentes pero violan el principio de Event→Action único por contexto. | Un Event debe enrutar a un único Handler/Action por contexto | App.tsx:139/143-145, Toolbar.tsx:140-167 | Consolidar todos los atajos vía `registrarAtajo` (atajosTeclado.ts) y eliminar el `useEffect` ad-hoc en Toolbar. |
| H-6 | medio | Inspector XOR sin Default explícito. Si seleccionId y enlaceSeleccionId son ambos null, `Inspector.tsx` cae a placeholder no inspeccionado, quedando un estado vacío sin pista de "qué hacer". Patrón CN-DEF aplicable. | XOR ViewContainer debe declarar Default o vista vacía con call-to-action | Inspector.tsx (no leído) [no verificado] | Insertar Default ViewContainer "InspectorVacio" con sugerencia "Selecciona una cosa o un enlace en el canvas". |
| H-7 | medio | BarraPestanas se renderiza como banda horizontal pero no muestra ruta (carpeta/modelo/OPD). El usuario navega varios OPDs dentro de un modelo y no hay breadcrumbs. Patrón CN-BREAD ausente. | Falta CN-BREAD en composición OW-LWSA + multiOPD | App.tsx:65 BarraPestanas | Añadir migas debajo del título de la pestaña: `Workspace › Carpeta › Modelo › OPD activo`, cada nivel clicable. |
| H-8 | medio | `eliminarSeleccion` (App.tsx:149) no pide confirmación cuando borra entidades con descomposición/despliegue (cascading deletes). Compara con `eliminarOpdDesdeArbol` que sí confirma (acciones-opd:205). | CM-CODL exige confirmación o disponibilidad de undo trivial | App.tsx:149, acciones-canvas / acciones-entidad | Inyectar confirmarSiDirty-like para eliminaciones que disparan cascada. Indicador visual del nº de descendientes. |
| H-9 | medio | DialogoBuscarCosas no auto-completa ni recuerda búsquedas previas (DE-AUTO ausente, CS-SRCS ausente) en un editor con cientos de entidades potenciales. Anti-pattern: forma plana sin asistencia. | DE-AUTO + CS-SRCS recomendados | DialogoBuscarCosas.tsx | Añadir history en store y combobox EditableSelectionField con últimos 10 términos. |
| H-10 | medio | El SelectorEnlace (Toolbar.tsx:377-393) se deshabilita cuando no hay seleccionId, pero la sección "Tipos válidos" (boton 398) no se deshabilita en el mismo contexto. Inconsistencia DE-TDFP. | Disponibilidad coherente entre componentes con la misma precondición | Toolbar.tsx:377/398 | Aplicar el mismo guard `selectorEnlaceDeshabilitado` al botón "Tipos válidos". |
| H-11 | bajo | `BibliotecaCosa` se gestiona con local state (Toolbar.tsx:118), no en store. Incompatible con persistencia de UI uniforme y con re-apertura desde otros containers. | Estado UI debe vivir en store (consistency review) | Toolbar.tsx:118-119 | Mover bibliotecaAbierta y menuTiposAbierto al store junto con el resto. |
| H-12 | bajo | Atajo Ctrl+H "ocultar apariencia" (Toolbar.tsx:230) está hard-coded en useEffect ad-hoc; no aparece en CheatsheetAtajos (porque CheatsheetAtajos lee del registro central de atajosTeclado, no del DOM). | Cobertura uniforme del catálogo | Toolbar.tsx:222-237 vs CheatsheetAtajos | Migrar el atajo Ctrl+H a `registrarAtajo`. Mismo problema con Ctrl+Alt+C/V/T (Toolbar.tsx:239-261). |
| H-13 | bajo | El menú submenu Demos (MenuPrincipal.tsx:142-172) abre por hover (mouseEnter/Leave) sin manejo de keyboard. Inaccesible vía teclado. | Eventos accesibles requieren equivalente keyboard | MenuPrincipal.tsx:142-172 | Soportar Enter/Space y aria-expanded con focus management. |
| H-14 | bajo | `ToolbarOpl` y `Toolbar` principal duplican lógica de copiar/exportar similar (PanelOpl.tsx:103-104 vs Toolbar.tsx:563+); no comparten un Action genérico. Reutilización IFML débil. | Patrón CN-CIM&B sugiere consolidar acciones por dominio | PanelOpl.tsx, Toolbar.tsx | Crear slice `accionesExportar` con copiarOpl/exportarHtml/exportarMapa unificadas. |

## 9. Oportunidades de mejora

| # | Oportunidad | Patrón IFML | Beneficio | Esfuerzo | Relación HU/épica |
|---|---|---|---|---|---|
| O-1 | Implementar pila de modales en store (resuelve H-1 y H-3). | extensión Modal-stack desktop | Garantiza LIFO determinista; permite sub-modales (e.g. DialogoCargarModelo abre confirmación, ya parcialmente roto hoy) | M | toca toda EPICA-30 (persistencia) y EPICA-40 (workspace) |
| O-2 | Añadir breadcrumbs `Workspace › Carpeta › Modelo › OPD` debajo de BarraPestanas (resuelve H-7). | CN-BREAD | Reduce desorientación al navegar entre OPDs descompuestos; aprovecha jerarquía existente | S | candidato a EPICA-50/60 (UX foundation TIER 2 ya en ronda 13) |
| O-3 | Migrar todos los atajos a `registrarAtajo` único (resuelve H-5, H-12). | uniform Event-handler dispatch | CheatsheetAtajos pasa a ser SSOT visual del catálogo; testing más simple; ningún Event se ejecuta dos veces | S | encaja en cleanup TIER 1 (ronda 13.0) |
| O-4 | Convertir vista MapaSistema en vista alternativa "table" adicional `TablaEnlaces` integrada al XOR canvas/mapa (no como modal). | OD-MCWA multi-view real | Tres modos de inspección de un mismo modelo; consolida acceso a TablaEnlaces (hoy modal) | M | EPICA-22 mapa, EPICA-12/15 enlaces |
| O-5 | Wizard AsistenteNuevoModelo: explicitar el grafo de etapas con ActivationExpression en lugar de hard-coded `Math.min(et+1, 11)`. | DE-WIZ canónico | Permite ramas condicionales (e.g. saltar EtapaHandler si beneficiario==handler), inspección formal del flujo | M | refactor de la línea 3 (asistente) |
| O-6 | Persistir UI state (`bibliotecaAbierta`, `menuTiposAbierto`, `mostrarSubmenuDemos`) en store (H-11) y migrar a ViewContainers <<Modeless>> de orden uniforme. | OD-SWA limpieza | Coherencia, testabilidad, posible deeplink a estado UI específico | S | cleanup TIER 1 |
| O-7 | Default explícito de Inspector cuando no hay selección (H-6) con call-to-action y mini-panel "Empezar aquí". | CN-DEF | Reduce estados vacíos confusos; ofrece onboarding pasivo | XS | UX foundation TIER 2 |
| O-8 | DialogoBuscarCosas: agregar facetas adicionales (estado, profundidad de OPD) y auto-complete de últimas búsquedas (H-9). | CS-FSR + CS-SRCS | Mejor scaling con modelos grandes (>200 entidades) | M | EPICA-60 búsqueda |
| O-9 | Catálogo de Actions explícito: extraer todas las lambdas inline en Toolbar/MenuContextual* a Actions nombradas del slice (H-2). | M4 conformance | Mejora cobertura de tests (acciones invocables sin DOM) y hace el modelo IFML inspeccionable | M | refactor distribuido |
| O-10 | Reemplazar `window.dispatchEvent` ad-hoc por estado en store + observer (H-3, H-4). | SystemFlow tipado | Quita el bus global, hace los flujos rastreables, elimina race conditions con lazy mounts | M | preferible antes de añadir nuevas vistas alternas |

## 10. Acoplamiento OPM↔IFML

deep-opm-pro es un meta-editor: el dominio editado es un modelo OPM (ISO 19450)
y la UI es modelable en IFML. Las Actions IFML mutan el `Modelo` y, conceptual-
mente, cada Action es ejecución de un proceso OPM sobre el objeto "Modelo OPM"
con estados {limpio, dirty, persistido, archivado}. Cuatro puntos de fricción:

1. **Refinement OPD↔ViewContainer**. Cuando el usuario `descomponer` un proceso
   (acciones-opd:78), OPM crea un OPD hijo y la UI cambia `opdActivoId`. En IFML
   esto debería modelarse como NavigationFlow al ViewContainer-hermano del mismo
   nivel jerárquico — pero hoy es un cambio de estado en JointCanvas. Si el
   árbol fuera modelado como ViewContainers anidados disjuntivos navegables,
   los Ctrl+Arrow* (App.tsx:159-162) caerían naturalmente en CN-UP/CN-BACK. Hoy
   son atajos sueltos sobre estado plano.

2. **Apariencia ≠ Entidad**. OPM separa entidad (Cosa) de su apariencia en un
   OPD (Apariencia). En la UI IFML actual JointCanvas selecciona apariencias,
   pero Inspector edita la entidad: cambios al nombre se propagan a todas las
   apariencias en todos los OPDs. El ParameterBinding entre seleccionId
   (entidadId) y aparienciaActiva (InspectorEntidad.tsx:77) está implícito y
   recalculado cada render. IFML pediría dos DataContextVariables tipadas y un
   indicador visual de "esta edición afecta N apariencias".

3. **OPL como vista derivada**. PanelOpl es IFML View pura sobre el mismo
   DataBinding `modelo`; pero el flujo inverso (renombrar desde OPL via
   `renombrarEntidadDesdeOpl`) hace que OPL sea simultáneamente sink de Events.
   Esto convierte PanelOpl en ViewContainer bidireccional con DE-INPL embebido.
   Es correcto pero el modelo gana claridad si se etiqueta explícitamente como
   "two-way DataBinding sobre derivacion textual del modelo OPM" — patrón no
   estándar IFML, candidato a extensión `<<DerivedTextEditor>>`.

4. **Aviso/validación como SystemEvent OPM**. PanelAvisos invoca
   `validarModelo(modelo, opdActivoId)` en cada render (PanelAvisos.tsx:46), no
   reactivo a cambios incrementales. En lenguaje IFML/OPM esto debería ser un
   SystemEvent disparado por la Action que mutó el modelo (e.g.
   "ModeloMutado(reglasAfectadas)") con SystemFlow al PanelAvisos. La
   recomputación completa es un anti-pattern de eficiencia escondido tras un
   estado React; escala mal con modelos >500 entidades [no verificado en
   benchmark].

Cierre: el editor es un buen vehículo IFML; el principal trabajo pendiente es
hacer explícitos los flujos hoy implícitos (modal-stack, SystemEvents, Actions
nominadas) y cerrar la brecha CN-BREAD/CN-DEF con bajo esfuerzo. Los hallazgos
H-1 a H-5 concentran el riesgo arquitectónico; H-6 a H-10 son higiene y
percepción de uso; H-11 a H-14 son consistencia y accesibilidad.
