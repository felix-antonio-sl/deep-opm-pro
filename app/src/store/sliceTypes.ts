import type { OpmStore } from "./tipos";
import type { ModeloSliceKey } from "./modelo/contrato";
import type { AtajosSlice } from "./atajos";
export type { AtajosSlice } from "./atajos";

type Slice<K extends keyof OpmStore> = Pick<OpmStore, K>;

export type CrearSlice<T> = (
  set: (partial: Partial<OpmStore> | ((state: OpmStore) => Partial<OpmStore>)) => void,
  get: () => OpmStore,
) => T;

export type ModeloSlice = Slice<ModeloSliceKey>;

export type SeleccionSlice = Slice<
  | "seleccionId"
  | "seleccionados"
  | "modoSeleccion"
  | "portapapelesVisual"
  | "enlaceSeleccionId"
  | "estadoSeleccionId"
  | "eliminarSeleccion"
  | "setSeleccion"
  | "setSeleccionPorTipo"
  | "agregarASeleccion"
  | "quitarDeSeleccion"
  | "toggleSeleccion"
  | "vaciarSeleccion"
  | "seleccionarEstado"
  | "agregarEstadoASeleccion"
  | "toggleSeleccionEstado"
  | "seleccionarTodoEnOpd"
  | "nudgeSeleccion"
  | "alinearSeleccionEnlaces"
  | "conectarSeleccionAlTodo"
  | "copiarSeleccionAlBuffer"
  | "pegarBufferEnOpdActivo"
>;

export type EnlacesSlice = Slice<
  | "modoEnlace"
  | "eligiendoOrigenEnlace"
  | "modoCreacion"
  | "tablaEnlacesAbierta"
  | "tablaEnlacesFiltroTipo"
  | "tablaEnlacesOrdenColumna"
  | "tablaEnlacesOrdenDireccion"
  | "fijarMultiplicidadEnlace"
  | "quitarMultiplicidadEnlace"
  | "insertarVerticeAccion"
  | "reposicionarVerticeAccion"
  | "reanclarExtremoAccion"
  | "cambiarTipoGrupoEstructuralSeleccionado"
  | "fijarOrdenGrupoEstructuralSeleccionado"
  | "separarGrupoEstructuralSeleccionado"
  | "volverGrupoEstructuralAutomaticoSeleccionado"
  | "traerRelacionesEstructuralesFaltantesSeleccionadas"
  | "plegarGrupoEstructuralSeleccionado"
  | "plegarCompletoGrupoEstructuralSeleccionado"
  | "borrarEnlacesEnLote"
  | "abrirTablaEnlaces"
  | "cerrarTablaEnlaces"
  | "fijarFiltroTablaEnlaces"
  | "fijarOrdenTablaEnlaces"
  | "navegarAEnlaceDesdeTabla"
  | "irAExtremoEnlaceTabla"
  | "eliminarEnlaceDesdeTabla"
>;

export type WorkspaceModSlice = Slice<
  | "indice"
  | "workspaceRevision"
  | "carpetaActualId"
  | "modelosRecientes"
  | "crearCarpetaEnActual"
  | "renombrarCarpetaEnIndice"
  | "eliminarCarpetaEnIndice"
  | "abrirCarpeta"
  | "moverModeloACarpetaEnIndice"
  | "cortarModelo"
  | "cortarCarpeta"
  | "cancelarPortapapelesWorkspace"
  | "pegarEn"
  | "moverModeloDirecto"
  | "moverCarpetaDirecto"
  | "archivarModeloActual"
  | "archivarModeloPorId"
  | "restaurarModeloPorId"
  | "toggleBibliotecaModelo"
  | "toggleApunteModelo"
  | "dialogoGraduarModeloId"
  | "abrirGraduar"
  | "cerrarGraduar"
  | "confirmarGraduacion"
  | "archivarCarpetaPorId"
  | "restaurarCarpetaPorId"
  | "guardarConVersion"
  | "crearVersionAhora"
>;

export type CarpetasSlice = Slice<
  | "portapapelesWorkspace"
  | "mostrarArchivados"
  | "mostrarVersiones"
  | "dialogoVersionesAbierto"
  | "dialogoBuscarGlobalAbierto"
  | "busquedaGlobal"
  | "busquedaCosasAbierta"
  | "busquedaCosasQuery"
  | "busquedaCosasFiltro"
  | "abrirDialogoVersiones"
  | "cerrarDialogoVersiones"
  | "restaurarVersionComoCopia"
  | "eliminarVersionPorId"
  | "abrirDialogoBuscarGlobal"
  | "cerrarDialogoBuscarGlobal"
  | "fijarBusquedaGlobalQuery"
  | "ejecutarBusquedaGlobal"
  | "abrirResultadoBusquedaGlobal"
  | "toggleMostrarArchivados"
  | "toggleMostrarVersiones"
  | "abrirBusquedaCosas"
  | "cerrarBusquedaCosas"
  | "fijarBusquedaCosasQuery"
  | "fijarBusquedaCosasFiltro"
  | "saltarAResultadoBusqueda"
>;

export type UiPanelSlice = Slice<
  | "filtroOplPorSeleccion"
  | "hoverOplRef"
  | "busquedaOpl"
  | "menuPrincipalAbierto"
  | "toolbarMasAbierto"
  | "dialogoGuardarComoAbierto"
  | "dialogoCargarModeloAbierto"
  | "dialogoImportarExportarJsonAbierto"
  | "dialogoComandosAbierto"
  | "uiAliasVisibles"
  | "uiDescripcionesVisibles"
  | "uiSoloCanvas"
  | "solicitudFitToken"
  | "readOnly"
  | "esBibliotecaAbierta"
  | "modalUrlsAbierto"
  | "modalImagenAbierto"
  | "uiModoImagenGlobal"
  | "modalDuracionAbierto"
  | "modoOrdenArbol"
  | "gestionArbolAbierta"
  | "busquedaOpdGestion"
  | "anchoPanelArbol"
  | "anchoPanelInspector"
  | "anchoPanelOpleft"
  | "panelOpleftAbierto"
  | "panelInspectorAbierto"
  | "nombresArbolVisibles"
  | "cheatsheetAtajosAbierto"
  | "vistaMobileActiva"
  | "fijarModoOrdenArbol"
  | "moverHermano"
  | "moverOpdEnGestion"
  | "abrirGestionArbol"
  | "cerrarGestionArbol"
  | "fijarBusquedaOpdGestion"
  | "renombrarOpdDesdeArbol"
  | "fijarAnchoPanelArbol"
  | "fijarAnchoPanelInspector"
  | "fijarAnchoPanelOpleft"
  | "registrarCrucePuenteSkill"
  | "togglePanelOpleft"
  | "togglePanelInspector"
  | "toggleNombresArbolVisibles"
  | "toggleSoloCanvas"
  | "fijarSoloCanvas"
  | "abrirCheatsheetAtajos"
  | "cerrarCheatsheetAtajos"
  | "abrirDialogoComandos"
  | "cerrarDialogoComandos"
  | "cambiarVistaMobile"
  | "navegarOpdArriba"
  | "navegarOpdAbajo"
  | "navegarOpdIzquierda"
  | "navegarOpdDerecha"
  // L4 ronda 23: default brutal — focus auto en input Nombre del Inspector
  // al crear objeto/proceso. El campo y el consumidor viven en el slice UI
  // porque el productor (acciones-entidad) es semánticamente del modelo pero
  // la señal es estrictamente UI (no se serializa).
  | "solicitarFocusNombre"
  | "consumirFocusNombre"
>;

export type MapaSlice = Slice<
  | "vistaMapaActiva"
  | "descriptorMapaCache"
  | "mapaProfundidadMaxima"
  | "mapaSubarbolRaizId"
  | "mapaCriterioResaltado"
  | "mapaZoom"
  | "mapaPanX"
  | "mapaPanY"
  | "mapaAutoRefresh"
  | "mapaUltimoVisitadoOpdId"
  | "mapaTooltipActivoId"
  | "mapaPanelFiltrosAbierto"
  | "mapaPanelEstadisticasAbierto"
  | "abrirVistaMapa"
  | "cerrarVistaMapa"
  | "refrescarVistaMapa"
  | "saltarAOpdDesdeMapa"
  | "fijarMapaProfundidad"
  | "fijarMapaSubarbol"
  | "fijarMapaCriterioResaltado"
  | "fijarMapaZoom"
  | "fijarMapaPan"
  | "toggleMapaAutoRefresh"
  | "fijarMapaTooltip"
  | "toggleMapaPanelFiltros"
  | "toggleMapaPanelEstadisticas"
  | "limpiarFiltrosMapa"
>;

export type PersistenciaSlice = Slice<
  | "modelosGuardados"
  | "requiereLogin"
  | "iniciarSesion"
  | "cerrarSesion"
  | "verificarSesion"
  | "modeloPersistidoId"
  | "descripcionModeloLocal"
  | "workspaceLocal"
  | "autosalvado"
  | "exportarJson"
  | "importarJson"
  | "listarModelosGuardados"
  | "guardarLocal"
  | "cargarLocal"
  | "borrarLocal"
  | "iniciarAutosalvado"
  | "detenerAutosalvado"
  | "revisionRemota"
  | "revisionBasePorModelo"
  | "verificarRevisionRemota"
  | "iniciarPollRevision"
  | "detenerPollRevision"
  | "traerRevisionDelAgente"
  | "verVersionDelAgente"
>;

export type PestanasSlice = Slice<
  | "pestanasAbiertas"
  | "pestanaActivaId"
  | "abrirPestanaNueva"
  | "abrirPestanaImportandoJson"
  | "abrirPestanaConModelo"
  | "duplicarPestana"
  | "cerrarPestana"
  | "cambiarPestanaActiva"
  | "reordenarPestanas"
  | "renombrarPestana"
>;

export type SimulacionSlice = Slice<
  | "contextoSimulacion"
  | "readOnlyPrevSimulacion"
  | "autoAvanceSimulacionActivo"
  | "velocidadSimulacion"
  | "headlessSimulacion"
  | "iniciarModoSimulacion"
  | "salirModoSimulacion"
  | "ejecutarPasoSimulacion"
  | "resolverRamaSimulacionActual"
  | "ejecutarCorridaSimulacion"
  | "reiniciarSimulacionActual"
  | "iniciarAutoAvanceSimulacion"
  | "pausarAutoAvanceSimulacion"
  | "fijarVelocidadSimulacion"
  | "asignarValorRuntimeSimulacion"
  | "alternarHeadlessSimulacion"
  | "fijarModoSimulacion"
  | "fijarSemillaSimulacion"
>;

export type OpmStoreSlices =
  & ModeloSlice
  & SeleccionSlice
  & EnlacesSlice
  & WorkspaceModSlice
  & CarpetasSlice
  & UiPanelSlice
  & MapaSlice
  & PersistenciaSlice
  & PestanasSlice
  & SimulacionSlice
  & AtajosSlice;

type AssertNever<T extends never> = T;

export type OpmStoreSliceMissingKeys = AssertNever<Exclude<keyof OpmStore, keyof OpmStoreSlices>>;
export type OpmStoreSliceExtraKeys = AssertNever<Exclude<keyof OpmStoreSlices, keyof OpmStore>>;
