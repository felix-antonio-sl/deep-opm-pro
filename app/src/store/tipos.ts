import { crearCosaEnPosicion } from "../modelo/creacionInterna";
import { extremoEstado } from "../modelo/extremos";
import {
  designarCurrent,
  designarDefault,
  designarFinal,
  designarInicial,
  quitarDesignacion,
  restaurarEstado,
  suprimirEstado,
} from "../modelo/estadosDesignaciones";
import {
  aplicarEstiloApariencia,
  resetearEstiloApariencia,
} from "../modelo/estilos";
import {
  contenedorRefinamiento,
  dentroDeApariencia,
  posicionLibre,
} from "../modelo/layout";
import {
  actualizarVerticesEnlace as actualizarVerticesEnlaceOp,
  ajustarMultiplicidad,
  apuntarExtremoEnlace,
  cambiarAfiliacion,
  cambiarEsencia,
  agregarEstado,
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  designarEstadoFinal as designarEstadoFinalOp,
  designarEstadoInicial as designarEstadoInicialOp,
  descomponerProceso,
  desplegarObjeto,
  eliminarEnlace,
  eliminarEstado as eliminarEstadoOp,
  moverApariencia as moverAparienciaEntidad,
  moverAparienciaPorId,
  quitarDescomposicionProceso,
  quitarDespliegueObjeto,
  quitarEstadosObjeto,
  reanclarEnlaceExternoDerivado as reanclarEnlaceExternoDerivadoOp,
  renombrarEntidad,
  renombrarEstado,
  splitEffectEnPar,
  volverEnlaceExternoDerivadoAAutomatico as volverEnlaceExternoDerivadoAAutomaticoOp,
  type AjustePuertoEnlace,
} from "../modelo/operaciones";
import {
  agregarUrl,
  editarAlias,
  editarDescripcion,
  editarUnidad,
  eliminarUrl,
  reordenarUrls,
} from "../modelo/objetoMetadata";
import { fijarDuracion, quitarDuracion } from "../modelo/objetoDuracion";
import {
  cambiarOrdenPartes as cambiarOrdenPartesOp,
  cambiarModoPlegado as cambiarModoPlegadoOp,
  crearEnlaceConExtremoPlegado,
  extraerParteDePlegado as extraerParteDePlegadoOp,
  reinsertarParteEnPlegado as reinsertarParteEnPlegadoOp,
} from "../modelo/plegado";
import {
  abanicoDeEnlace,
  alternarOperadorAbanico as alternarOperadorAbanicoOp,
  disolverAbanico as disolverAbanicoOp,
  formarAbanicoAutomatico,
  quitarRamaDeAbanico as quitarRamaDeAbanicoOp,
  sincronizarAbanicos,
} from "../modelo/abanicos";
import { crearAutoInvocacion } from "../modelo/autoinvocacion";
import { eliminarOpdHoja } from "../modelo/opdEliminacion";
import {
  listarHermanos,
  moverNodo,
  ordenSegunCanvasPadre,
  reordenarHermanos,
  validarMovimientoSinCiclo,
} from "../modelo/opdReorden";
import {
  aplicarModificador,
  definirDemora,
  definirProbabilidad,
  quitarModificador,
} from "../modelo/modificadores";
import { renombrarEtiquetaEnlace } from "../modelo/etiquetasEnlace";
import { definirRutaEtiqueta } from "../modelo/rutas";
import {
  aplicarEstiloEnlace,
  copiarEstiloEnlace,
  pegarEstiloEnlace,
  resetEstiloEnlace,
} from "../modelo/enlaceEstilo";
import {
  fijarMultiplicidadOrigen,
  fijarMultiplicidadDestino,
  quitarMultiplicidad,
} from "../modelo/enlaceMultiplicidad";
import {
  insertarVerticeApariencia,
  reposicionarVerticeApariencia,
  reanclarExtremoEnlace as reanclarExtremoEnlaceOp,
} from "../modelo/enlaceVertices";
import {
  borrarModeloLocal,
  cargarModeloLocal,
  guardarModeloLocal,
  listarModelosLocales,
  actualizarMetadataModeloLocal,
  type ResumenModeloPersistido,
} from "../persistencia/local";
import {
  archivarCarpeta as archivarCarpetaEnIndiceOp,
  archivarModelo as archivarModeloEnIndiceOp,
  buscarGlobal,
  validarNombreModeloLocal,
  workspaceDesdeModelo,
  type WorkspaceModeloLocal,
  type CarpetaIndice,
  type BusquedaGlobalEstado,
  type PortapapelesWorkspace,
  type ResultadoBusquedaGlobal,
  type WorkspaceIndice,
  type MapaWorkspace,
  indiceVacio,
  crearCarpeta as crearCarpetaEnIndice,
  renombrarCarpeta as renombrarCarpetaEnIndiceOp,
  eliminarCarpeta as eliminarCarpetaEnIndiceOp,
  moverModeloACarpeta as moverModeloACarpetaEnIndiceOp,
  listarHijosDeCarpeta,
  restaurarCarpeta as restaurarCarpetaEnIndiceOp,
  restaurarModelo as restaurarModeloEnIndiceOp,
  rutaDeCarpeta,
} from "../persistencia/workspace";
import {
  cortarCarpeta as cortarCarpetaWorkspace,
  cortarModelo as cortarModeloWorkspace,
  moverCarpeta,
  moverModelo,
  pegarCarpeta,
  pegarModelo,
} from "../persistencia/movimientoModelos";
import {
  crearVersion,
  eliminarVersion,
  restaurarVersion,
} from "../persistencia/versiones";
import {
  crearAutosalvado,
  type AutosalvadoEstado,
  type AutosalvadoControl,
} from "../persistencia/autosalvado";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import type { Aviso } from "../modelo/validaciones";
import type { Afiliacion, AnclajesSimboloEstructural, Apariencia, DesignacionEstado, DuracionTemporal, EnlaceEstilo, Esencia, EstiloApariencia, ExtremoEnlace, Id, ImagenEntidad, LayoutEstados, Modelo, Modificador, ModoDespliegueObjeto, ModoImagenEntidad, ModoPlegado, Opd, OperadorAbanico, OrdenPartesPlegado, ParametrosSimulacionEntidad, Pestana, PestanaId, PlantillaIndice, Posicion, SubtipoModificador, TipoEnlace, TipoEntidad, TipoValorSlot, UnidadTiempo, UrlObjetoTipada, UiPortapapelesVisual, ValorConcreto, VersionResumen } from "../modelo/tipos";
import { mismaReferencia, type OplReferencia } from "../opl/interaccion";
import { datosAsistenteVacio, sembrarModeloDesdeAsistente, validarDatosAsistente, type DatosAsistente, type EtapaAsistente } from "../modelo/creacionWizard";
import { generarOpl } from "../opl/generar";
import {
  aplicarMarcadores,
  calcularEstadisticas,
  construirDescriptorMapa,
  filtrarPorProfundidad,
  filtrarPorSubarbol,
  resaltarPorTipo,
  type CriterioResaltado,
  type DescriptorMapa,
  type EstadisticasModelo,
} from "../render/jointjs/mapaSistema";
import { fijarOpcionesProyeccionGlobal } from "../render/jointjs/proyeccion";
import type { EjeAlineacion, OrientacionDistribucion } from "../canvas/operacionesBatch";
import type { FamiliaTraerConectados } from "../canvas/reglasTraer";
import type { GridConfig } from "../canvas/grid";
import {
  abrirPestana as abrirPestanaEstado,
  cambiarActiva as cambiarPestanaActivaEstado,
  cerrarPestana as cerrarPestanaEstado,
  clonarModelo,
  crearPestanaDesdeModelo,
  crearPestanaNueva,
  duplicarPestana as duplicarPestanaEstado,
  reordenarPestanas as reordenarPestanasEstado,
} from "./pestanas";
import {
  agregar as seleccionAgregar,
  quitar as seleccionQuitar,
  setSeleccion as seleccionSet,
  todasDelOpd,
  toggle as seleccionToggle,
  vacia as seleccionVacia,
  type ModoSeleccion,
} from "../canvas/seleccionMultiple";
import {
  alinearEnlacesAbajo,
  alinearEnlacesArriba,
  alinearEnlacesDerecha,
  alinearEnlacesIzquierda,
  aplicarEstiloApariencias,
  aplicarEstiloEnlaces,
  conectarMultiAlTodo,
  copiarSeleccion,
  eliminarBatch,
  nudgeApariencias,
  nudgeEnlaces,
  pegarSeleccion,
} from "../canvas/operacionesBatch";

export interface ModoEnlace {
  tipo: TipoEnlace;
  origenId: Id;
}

/** [Ronda 16 L2] Filtros disponibles en `DialogoBuscarCosas`. */
export type BusquedaCosasFiltro = "todos" | "objetos" | "procesos" | "estados" | "enlaces";

/**
 * [Ronda 16 L2] Resultado de un click en `DialogoBuscarCosas`. Discriminado
 * por tipo para que `saltarAResultadoBusqueda` pueda seleccionar entidad,
 * estado (como apariencia de su entidad padre) o enlace en el OPD destino.
 */
export type ResultadoBusquedaSalto =
  | { tipo: "entidad"; entidadId: Id; opdId: Id; aparienciaId: Id }
  | { tipo: "estado"; estadoId: Id; entidadId: Id; opdId: Id; aparienciaId: Id }
  | { tipo: "enlace"; enlaceId: Id; opdId: Id };

/**
 * L1 ronda 20: tabs por intención del Inspector de entidad. Particionan el
 * muro plano actual en 5 capas semánticas (informe UI/UX 2026-05-07 §P1
 * inspector líneas 98-114). Default `semantica` en cada selección.
 */
export type TabInspectorEntidad = "semantica" | "enlaces" | "refinamiento" | "apariciones" | "estilo";

/**
 * L1 ronda 20: tabs por intención del Inspector de enlace. Espejan la
 * partición de entidad pero con 3 dimensiones simétricas. Default
 * `propiedades`.
 */
export type TabInspectorEnlace = "propiedades" | "extremos" | "estilo";

export interface OpmStore {
  modelo: Modelo;
  opdActivoId: Id;
  pestanasAbiertas: Pestana[];
  pestanaActivaId: PestanaId;
  seleccionId: Id | null;
  seleccionados: Id[];
  modoSeleccion: ModoSeleccion;
  portapapelesVisual: UiPortapapelesVisual | null;
  enlaceSeleccionId: Id | null;
  modoEnlace: ModoEnlace | null;
  modoCreacion: TipoEntidad | null;
  /**
   * IFML H-3 / Ronda 15 L3: NavigationFlow tipado del flujo
   * `crearEntidadEnCanvas` -> sub-ViewContainer "modal nombre cosa".
   * Reemplaza el SystemEvent ad-hoc `window.dispatchEvent("opm:nueva-cosa")`.
   * Estado UI (no serializable) que el ToolbarBase escucha vía store y limpia
   * al confirmar (renombrar) o descartar.
   */
  nuevaCosaPendiente: { entidadId: Id; aparienciaId: Id; nombre: string } | null;
  filtroOplPorSeleccion: boolean;
  hoverOplRef: OplReferencia | null;
  busquedaOpl: string;
  /**
   * L1 ronda 20: tab activo del Inspector cuando hay entidad seleccionada.
   * Persistencia por sesión via store (no localStorage). Si la entidad cambia
   * de tipo y el tab no aplica, cae a `semantica`. Default `semantica`.
   */
  tabInspectorEntidadActivo: TabInspectorEntidad;
  /**
   * L1 ronda 20: tab activo del Inspector cuando hay enlace seleccionado.
   * Default `propiedades`.
   */
  tabInspectorEnlaceActivo: TabInspectorEnlace;
  mensaje: string | null;
  dirty: boolean;
  /**
   * P0 ronda 4: dirtyModelo distingue mutacion semantica (entidades,
   * enlaces, nombres) de cambios visuales/layout (auto-layout, drag,
   * nudge, alineacion). Solo dirtyModelo bloquea carga de otro modelo.
   * dirty sigue reflejando cualquier cambio para undo/redo y chip.
   */
  dirtyModelo: boolean;
  puedeDeshacer: boolean;
  puedeRehacer: boolean;
  modelosGuardados: ResumenModeloPersistido[];
  modeloPersistidoId: Id | null;
  descripcionModeloLocal: string;
  menuPrincipalAbierto: boolean;
  /**
   * P0-2 (informe UI/UX 2026-05-07): el menu "⋯ Mas" de la toolbar y el
   * MenuPrincipal lateral son mutuamente excluyentes. Antes coexistian y
   * se solapaban visualmente. Estado global porque el cierre se gatilla
   * desde acciones del store (`abrirMenuPrincipal`, etc.) y desde el
   * propio ToolbarMas. Default `false`. Solo un menu primario abierto a
   * la vez.
   */
  toolbarMasAbierto: boolean;
  dialogoGuardarComoAbierto: boolean;
  dialogoCargarModeloAbierto: boolean;
  dialogoImportarExportarJsonAbierto: boolean;
  pantallaInicioCerrada: boolean;
  dialogoRenombrarModeloAbierto: boolean;
  dialogoTraerConectadosAbierto: boolean;
  /** [Met §8.8] Catálogo runtime de plantillas privadas, no serializado en Modelo. */
  plantillasGuardadas: PlantillaIndice[];
  dialogoPlantillasAbierto: boolean;
  dialogoGuardarPlantillaAbierto: boolean;
  /** [JOYAS §1] Halo temporal solicitado para inserción; amarillo canónico #FFFC7F. */
  idsResaltadosTemporales: Id[];
  workspaceLocal: WorkspaceModeloLocal;
  tablaEnlacesAbierta: boolean;
  tablaEnlacesFiltroTipo: TipoEnlace | "todos";
  tablaEnlacesOrdenColumna: string | null;
  tablaEnlacesOrdenDireccion: "asc" | "desc";
  enlaceEstiloPortapapeles: EnlaceEstilo | null;
  uiAliasVisibles: boolean;
  uiDescripcionesVisibles: boolean;
  gridConfig?: GridConfig;
  /**
   * P0-5 (informe UI/UX 2026-05-07): contador monotonicamente creciente
   * que el canvas observa para gatillar fit-to-view. Cada incremento
   * solicita un encuadre del OPD activo. Acciones que dejan el canvas
   * en estado "ordenado pero potencialmente fuera de viewport" — como
   * `aplicarLayoutSugerido` — incrementan este token al confirmar exito.
   * El canvas (JointCanvas) reacciona en useEffect y llama
   * `fitCanvasAPantalla`. Compatibilidad SSR: el flag es solo runtime.
   */
  solicitudFitToken: number;
  /**
   * Flag de solo-lectura. Cuando es `true`, todas las acciones que mutan
   * el modelo se abortan en `commitModelo` con mensaje "Modelo en solo
   * lectura. Usa Guardar como para crear copia editable.".
   * (HU-SHARED-003 ronda 11 L5).
   */
  readOnly: boolean;
  modalUrlsAbierto: Id | null;
  modalImagenAbierto: Id | null;
  uiModoImagenGlobal: ModoImagenEntidad | null;
  modalDuracionAbierto: Id | null;
  // ── Carpetas (L4) ──
  indice: WorkspaceIndice;
  carpetaActualId: Id | null;
  modelosRecientes: ResumenModeloPersistido[];
  // ── Búsqueda intra-modelo (L4) ──
  busquedaCosasAbierta: boolean;
  busquedaCosasQuery: string;
  busquedaCosasFiltro: BusquedaCosasFiltro;
  // ── Autosalvado (L4) ──
  autosalvado: AutosalvadoEstado;
  // ── Asistente nuevo modelo (L3) ──
  asistente: null | {
    etapaActual: EtapaAsistente;
    datos: Partial<DatosAsistente>;
    cancelado: boolean;
  };
  limpiarMensaje: () => void;
  abrirMenuPrincipal: () => void;
  cerrarMenuPrincipal: () => void;
  /** P0-2: setea el estado global del menu ⋯ Mas. Si se abre, fuerza el
   * cierre del MenuPrincipal lateral. */
  fijarToolbarMasAbierto: (abierto: boolean) => void;
  abrirGuardarComo: () => void;
  cerrarGuardarComo: () => void;
  guardarComoLocal: (input: { nombre: string; descripcion?: string; crearVersionAlGuardar?: boolean }) => void;
  guardarComoLocalConDescripcion: (input: { nombre: string; descripcion?: string; crearVersionAlGuardar?: boolean }) => void;
  abrirCargarModelo: () => void;
  cerrarCargarModelo: () => void;
  abrirDialogoImportarExportarJson: () => void;
  cerrarDialogoImportarExportarJson: () => void;
  cargarLocalDesdeDialogo: (id: Id) => void;
  cerrarPantallaInicio: () => void;
  abrirRenombrarModelo: () => void;
  cerrarRenombrarModelo: () => void;
  abrirDialogoTraerConectados: () => void;
  cerrarDialogoTraerConectados: () => void;
  renombrarModeloActual: (nombre: string) => void;
  abrirDialogoPlantillas: () => void;
  cerrarDialogoPlantillas: () => void;
  abrirDialogoGuardarPlantilla: () => void;
  cerrarDialogoGuardarPlantilla: () => void;
  guardarComoPlantillaConfirmar: (input: { nombre: string; descripcion?: string; ambito?: "privado" | "organizacional" | "global" }) => void;
  insertarPlantillaEnOpdActivo: (plantillaId: Id) => void;
  resaltarTemporalmente: (ids: Id[], ms?: number) => void;
  cargarEjemploOrganizacional: () => void;
  nuevoModelo: () => void;
  crearObjetoDemo: () => void;
  crearProcesoDemo: () => void;
  crearEntidadEnCanvas: (tipo: TipoEntidad, posicion: Posicion) => void;
  /** Confirma `nuevaCosaPendiente` aplicando el nombre tipeado y la limpia. */
  confirmarNombreNuevaCosa: (nombre: string) => void;
  /** Descarta `nuevaCosaPendiente` sin renombrar (Escape o cancel). */
  descartarNuevaCosaPendiente: () => void;
  crearAparienciaEntidadEnCanvas: (entidadId: Id, posicion: Posicion) => void;
  fijarModoCreacion: (tipo: TipoEntidad | null) => void;
  descomponerSeleccionada: () => void;
  desplegarSeleccionada: (modo?: ModoDespliegueObjeto) => void;
  quitarDescomposicionSeleccionada: () => void;
  quitarDespliegueSeleccionado: () => void;
  reasignarEnlaceExternoManual: (opdId: Id, aparienciaEnlaceId: Id, nuevoSubprocesoId: Id) => void;
  eliminarOpdDesdeArbol: (opdId: Id) => void;
  cambiarOpdActivo: (id: Id) => void;
  seleccionarEntidad: (id: Id) => void;
  seleccionarEstadoComoExtremo: (estadoId: Id) => void;
  seleccionarEnlace: (id: Id) => void;
  seleccionarGrupoEstructural: (enlaceId: Id, enlaceIds: Id[]) => void;
  seleccionarDesdeOpl: (ref: OplReferencia) => void;
  renombrarEntidadDesdeOpl: (entidadId: Id, nombre: string) => void;
  fijarFiltroOplPorSeleccion: (activo: boolean) => void;
  fijarHoverOpl: (ref: OplReferencia | null) => void;
  fijarBusquedaOpl: (texto: string) => void;
  /** L1 ronda 20: cambia el tab activo del Inspector de entidad. */
  cambiarTabInspectorEntidad: (tab: TabInspectorEntidad) => void;
  /** L1 ronda 20: cambia el tab activo del Inspector de enlace. */
  cambiarTabInspectorEnlace: (tab: TabInspectorEnlace) => void;
  buscarEnPanelOpl: (texto: string) => void;
  alternarNumeracionOpl: () => void;
  cambiarPosicionOpl: (posicion?: "inferior" | "lateral-derecho") => void;
  minimizarOpl: () => void;
  restaurarOpl: () => void;
  alternarBloqueOplContraido: (opdId: Id) => void;
  mostrarPlaceholderAiOpl: () => void;
  editarEtiquetaEnlaceDesdeOpl: (enlaceId: Id, etiqueta: string) => void;
  renombrarEstadoDesdeOpl: (estadoId: Id, nombre: string) => void;
  abrirInspectorEnlaceDesdeOpl: (enlaceId: Id) => void;
  aplicarEdicionOplLibre: (texto: string) => void;
  copiarOplActualAlPortapapeles: () => Promise<void>;
  exportarOplActualHtml: () => Promise<void>;
  navegarAviso: (aviso: Aviso) => void;
  deshacer: () => void;
  rehacer: () => void;
  elegirTipoEnlace: (tipo: TipoEnlace) => void;
  crearEnlaceEntreEntidades: (origenId: Id, destinoId: Id, tipo: TipoEnlace) => void;
  cancelarEnlace: () => void;
	  renombrarSeleccionada: (nombre: string) => void;
	  crearAtributoEnObjetoSeleccionado: (input?: { nombre?: string; tipoSlot?: TipoValorSlot; unidad?: string }) => void;
	  asignarValorAtributoSeleccionado: (valor: ValorConcreto) => void;
	  cambiarTipoValorAtributoSeleccionado: (tipo: TipoValorSlot) => void;
	  configurarSimulacionAtributoSeleccionado: (parametros: ParametrosSimulacionEntidad | undefined) => void;
	  fijarEsenciaSeleccionada: (esencia: Esencia) => void;
  fijarAfiliacionSeleccionada: (afiliacion: Afiliacion) => void;
  redimensionarSeleccionada: (width: number, height: number) => void;
  redimensionarAparienciaEnCanvas: (aparienciaId: Id, x: number, y: number, width: number, height: number) => void;
  ajustarSeleccionadaAlTexto: () => void;
  volverSeleccionadaAAuto: () => void;
  alternarModoTamanoSeleccionado: () => void;
  cambiarModoPlegadoSeleccionado: (modo: ModoPlegado) => void;
  cambiarModoPlegadoApariencia: (aparienciaId: Id, modo: ModoPlegado) => void;
  fijarModoPlegadoApariencia: (aparienciaId: Id, modo: ModoPlegado) => void;
  cambiarOrdenPartesSeleccionado: (orden: OrdenPartesPlegado) => void;
  fijarOrdenPartesApariencia: (aparienciaId: Id, orden: OrdenPartesPlegado) => void;
  aplicarEstiloSeleccionado: (patch: EstiloApariencia) => void;
  resetearEstiloSeleccionado: () => void;
  seleccionarPartePlegada: (padreAparienciaId: Id, parteEntidadId: Id) => void;
  extraerParteDePlegado: (padreAparienciaId: Id, parteEntidadId: Id) => void;
  extraerTodasLasPartesSeleccionadas: () => void;
  reinsertarParteExtraidaSeleccionada: () => void;
  quitarSemiplegadoEstructuralSeleccionado: () => void;
  quitarPlegadoCompletoEstructuralSeleccionado: () => void;
  traerAgregacionesInzoomFaltantesSeleccionadas: () => void;
  agregarEstadosObjeto: () => void;
  agregarEstadoObjeto: () => void;
  eliminarEstado: (estadoId: Id) => void;
  quitarEstadosObjetoSeleccionado: () => void;
  renombrarEstadoSeleccionado: (estadoId: Id, nombre: string) => void;
  designarEstadoInicial: (estadoId: Id) => void;
  designarEstadoFinal: (estadoId: Id) => void;
  editarAliasEntidad: (entidadId: Id, alias: string) => void;
  editarUnidadEntidad: (entidadId: Id, unidad: string) => void;
  editarDescripcionEntidad: (entidadId: Id, descripcion: string) => void;
  abrirModalUrls: (entidadId: Id) => void;
  cerrarModalUrls: () => void;
  agregarUrlAEntidad: (entidadId: Id, url: Omit<UrlObjetoTipada, "id">) => void;
  eliminarUrlDeEntidad: (entidadId: Id, urlId: Id) => void;
  reordenarUrlsEntidad: (entidadId: Id, urlIds: Id[]) => void;
  abrirModalImagen: (entidadId: Id) => void;
  cerrarModalImagen: () => void;
  editarImagenEntidad: (entidadId: Id, imagen: ImagenEntidad) => void;
  quitarImagenEntidad: (entidadId: Id) => void;
  cambiarModoImagenEntidad: (entidadId: Id, modo: ModoImagenEntidad) => void;
  alternarModoImagenEntidad: (entidadId: Id) => void;
  fijarModoImagenGlobal: (modo: ModoImagenEntidad | null) => void;
  activarReadOnly: (activo: boolean) => void;
  designarEstadoComo: (estadoId: Id, designacion: DesignacionEstado) => void;
  quitarDesignacionEstado: (estadoId: Id, designacion: DesignacionEstado) => void;
  suprimirEstadoPorId: (estadoId: Id) => void;
  restaurarEstadoPorId: (estadoId: Id) => void;
  abrirModalDuracion: (estadoId: Id) => void;
  cerrarModalDuracion: () => void;
  fijarDuracionEstado: (estadoId: Id, duracion: DuracionTemporal) => void;
  quitarDuracionEstado: (estadoId: Id) => void;
  fijarLayoutEstadosEntidad: (entidadId: Id, layout: LayoutEstados) => void;
  toggleAliasVisibles: () => void;
  toggleDescripcionesVisibles: () => void;
  moverEntidad: (id: Id, x: number, y: number) => void;
  moverApariencia: (aparienciaId: Id, x: number, y: number) => void;
  moverAparienciaConPuertos: (aparienciaId: Id, x: number, y: number, ajustes: AjustePuertoEnlace[]) => void;
  actualizarPosicionSimboloEstructural: (aparienciaEnlaceIds: Id[], posicion: { x: number; y: number }, anclajesPorApariencia?: Partial<Record<Id, AnclajesSimboloEstructural>>) => void;
  actualizarAnclajesSimboloEstructural: (aparienciaEnlaceIds: Id[], anclajes: AnclajesSimboloEstructural) => void;
  resetearAnclajesSimboloEstructural: (aparienciaEnlaceIds: Id[]) => void;
  toggleGrid: () => void;
  fijarGridConfig: (patch: Partial<GridConfig>) => void;
  alinearSeleccion: (eje: EjeAlineacion) => void;
  distribuirSeleccion: (orientacion: OrientacionDistribucion) => void;
  aplicarLayoutSugerido: () => void;
  reordenarSubprocesoEnTimeline: (opdId: Id, aparienciaId: Id, nuevaY: number) => void;
  actualizarVerticesEnlace: (aparienciaEnlaceId: Id, vertices: Array<{ x: number; y: number }>) => void;
  actualizarPosicionLabelEnlace: (aparienciaEnlaceId: Id, labelKey: string, posicion: { distance: number; offset?: number | { x: number; y: number }; angle?: number }) => void;
  traerConectadosSeleccionado: (familias?: readonly FamiliaTraerConectados[]) => void;
  traerEnlacesEntreSeleccionadas: () => void;
  ocultarAparienciaSeleccionada: () => void;
  ajustarMultiplicidadSeleccionada: (lado: "origen" | "destino", texto: string) => void;
  apuntarExtremoEnlaceSeleccionado: (lado: "origen" | "destino", extremo: ExtremoEnlace) => void;
  reanclarEnlaceExternoDerivado: (aparienciaEnlaceId: Id, nuevoEndpointEntidadId: Id) => void;
  splitEffectSeleccionado: () => void;
  volverEnlaceExternoDerivadoAAutomatico: (aparienciaEnlaceId: Id) => void;
  alternarOperadorAbanicoSeleccionado: (operador: OperadorAbanico) => void;
  quitarRamaDeAbanicoSeleccionado: () => void;
  disolverAbanicoSeleccionado: () => void;
  crearAutoInvocacionSeleccionada: () => void;
  aplicarModificadorEnlaceSeleccionado: (modificador: Modificador) => void;
  aplicarSubtipoModificadorEnlaceSeleccionado: (subtipo: SubtipoModificador) => void;
  quitarModificadorEnlaceSeleccionado: () => void;
  definirProbabilidadEventoSeleccionada: (probabilidad: number | undefined) => void;
  definirDemoraInvocacionSeleccionada: (demora: string | undefined) => void;
  definirBackwardTagSeleccionado: (tag: string | undefined) => void;
  definirRequisitosEnlaceSeleccionado: (requisitos: string | undefined, mostrar: boolean) => void;
  definirTasaEnlaceSeleccionada: (tasa: string | undefined, unidadesTasa: string | undefined) => void;
  definirTiempoExcepcionEnlaceSeleccionado: (valores: {
    tiempoMinimo?: string | undefined;
    unidadTiempoMinimo?: UnidadTiempo | undefined;
    tiempoMaximo?: string | undefined;
    unidadTiempoMaximo?: UnidadTiempo | undefined;
  }) => void;
  moverPuertoEnlaceSeleccionado: (lado: "origen" | "destino", extremo: ExtremoEnlace, opcionRemover?: boolean) => void;
  renombrarEtiquetaEnlaceSeleccionado: (etiqueta: string) => void;
  definirRutaEtiquetaSeleccionada: (etiqueta: string | undefined) => void;
  cambiarTipoGrupoEstructuralSeleccionado: (tipo: TipoEnlace) => void;
  fijarOrdenGrupoEstructuralSeleccionado: (ordenado: boolean) => void;
  separarGrupoEstructuralSeleccionado: () => void;
  volverGrupoEstructuralAutomaticoSeleccionado: () => void;
  traerRelacionesEstructuralesFaltantesSeleccionadas: () => void;
  plegarGrupoEstructuralSeleccionado: () => void;
  plegarCompletoGrupoEstructuralSeleccionado: () => void;
  eliminarSeleccion: () => void;
  setSeleccion: (ids: Id[]) => void;
  agregarASeleccion: (id: Id) => void;
  quitarDeSeleccion: (id: Id) => void;
  toggleSeleccion: (id: Id) => void;
  vaciarSeleccion: () => void;
  seleccionarTodoEnOpd: () => void;
  nudgeSeleccion: (dx: number, dy: number) => void;
  alinearSeleccionEnlaces: (direccion: "izquierda" | "derecha" | "arriba" | "abajo") => void;
  conectarSeleccionAlTodo: (todoApariencia: Id, tipo: TipoEnlace) => void;
  aplicarEstiloASeleccion: (estilo: Partial<EstiloApariencia | EnlaceEstilo>) => void;
  copiarSeleccionAlBuffer: () => void;
  pegarBufferEnOpdActivo: () => void;
  exportarJson: () => string;
  importarJson: (json: string) => void;
  abrirPestanaNueva: () => void;
  abrirPestanaConAsistente: () => void;
  abrirPestanaImportandoJson: (json: string) => void;
  abrirPestanaConModelo: (modeloId: Id) => void;
  duplicarPestana: (id: PestanaId) => void;
  cerrarPestana: (id: PestanaId, opts?: { forzar?: boolean }) => void;
  cambiarPestanaActiva: (id: PestanaId) => void;
  reordenarPestanas: (idsOrdenados: PestanaId[]) => void;
  renombrarPestana: (id: PestanaId, etiqueta: string) => void;
  listarModelosGuardados: () => void;
  guardarLocal: () => void;
  cargarLocal: (id?: Id) => void;
  borrarLocal: (id: Id) => void;
  cargarDemo: () => void;
  cargarFixtureDemo: (nombre: string) => void;
  // ── Carpetas (L4) ──
  crearCarpetaEnActual: (nombre: string) => void;
  renombrarCarpetaEnIndice: (carpetaId: Id, nombre: string) => void;
  eliminarCarpetaEnIndice: (carpetaId: Id, opciones: { cascada: boolean }) => Promise<void>;
  abrirCarpeta: (carpetaId: Id | null) => void;
  moverModeloACarpetaEnIndice: (modeloId: Id, carpetaId: Id | null) => void;
  portapapelesWorkspace: PortapapelesWorkspace | null;
  mostrarArchivados: boolean;
  mostrarVersiones: boolean;
  dialogoVersionesAbierto: { modeloId: Id } | null;
  dialogoArchivadosAbierto: boolean;
  dialogoBuscarGlobalAbierto: boolean;
  busquedaGlobal: BusquedaGlobalEstado;
  cortarModelo: (modeloId: Id) => void;
  cortarCarpeta: (carpetaId: Id) => void;
  cancelarPortapapelesWorkspace: () => void;
  pegarEn: (carpetaDestinoId: Id | null) => void;
  moverModeloDirecto: (modeloId: Id, destino: Id | null) => void;
  moverCarpetaDirecto: (carpetaId: Id, destino: Id | null) => void;
  archivarModeloActual: () => void;
  archivarModeloPorId: (modeloId: Id) => void;
  restaurarModeloPorId: (modeloId: Id) => void;
  archivarCarpetaPorId: (carpetaId: Id) => void;
  restaurarCarpetaPorId: (carpetaId: Id) => void;
  guardarConVersion: () => Promise<void>;
  crearVersionAhora: (opts?: { nombre?: string; descripcion?: string }) => Promise<void>;
  abrirDialogoVersiones: (modeloId: Id) => void;
  cerrarDialogoVersiones: () => void;
  restaurarVersionComoCopia: (modeloId: Id, versionId: Id) => Promise<void>;
  eliminarVersionPorId: (modeloId: Id, versionId: Id) => void;
  abrirDialogoArchivados: () => void;
  cerrarDialogoArchivados: () => void;
  abrirDialogoBuscarGlobal: () => void;
  cerrarDialogoBuscarGlobal: () => void;
  fijarBusquedaGlobalQuery: (q: string) => void;
  ejecutarBusquedaGlobal: () => void;
  abrirResultadoBusquedaGlobal: (modeloId: Id) => void;
  toggleMostrarArchivados: () => void;
  toggleMostrarVersiones: () => void;
  // ── Búsqueda (L4) ──
  abrirBusquedaCosas: () => void;
  cerrarBusquedaCosas: () => void;
  fijarBusquedaCosasQuery: (q: string) => void;
  fijarBusquedaCosasFiltro: (filtro: BusquedaCosasFiltro) => void;
  saltarAResultadoBusqueda: (resultado: ResultadoBusquedaSalto) => void;
  // ── Autosalvado (L4) ──
  iniciarAutosalvado: () => void;
  detenerAutosalvado: () => void;
  // ── L6: enlaces, estilo, tabla ──
  fijarMultiplicidadEnlace: (enlaceId: Id, lado: "origen" | "destino", valor: string) => void;
  quitarMultiplicidadEnlace: (enlaceId: Id, lado: "origen" | "destino") => void;
  aplicarEstiloEnlaceAccion: (enlaceId: Id, estilo: Partial<EnlaceEstilo>) => void;
  resetEstiloEnlaceAccion: (enlaceId: Id) => void;
  copiarEstiloEnlaceAlPortapapeles: (enlaceId: Id) => void;
  pegarEstiloEnlaceDesdePortapapeles: (enlaceId: Id) => void;
  aplicarEstiloTextoAccion: (aparienciaId: Id, estilo: Partial<EstiloApariencia>) => void;
  resetEstiloTextoAccion: (aparienciaId: Id) => void;
  insertarVerticeAccion: (aparienciaEnlaceId: Id, posicion: Posicion) => void;
  reposicionarVerticeAccion: (aparienciaEnlaceId: Id, indice: number, posicion: Posicion) => void;
  reanclarExtremoAccion: (enlaceId: Id, lado: "origen" | "destino", nuevoExtremo: ExtremoEnlace) => void;
  borrarEnlacesEnLote: (enlaceIds: Id[]) => void;
  abrirTablaEnlaces: () => void;
  cerrarTablaEnlaces: () => void;
  fijarFiltroTablaEnlaces: (tipo: TipoEnlace | "todos") => void;
  fijarOrdenTablaEnlaces: (columna: string) => void;
  navegarAEnlaceDesdeTabla: (enlaceId: Id) => void;
  irAExtremoEnlaceTabla: (enlaceId: Id, lado: "origen" | "destino") => void;
  eliminarEnlaceDesdeTabla: (enlaceId: Id) => void;
  // ── L5: Mapa del sistema ─────────────────────────────────────────
  vistaMapaActiva: boolean;
  descriptorMapaCache: import("../render/jointjs/mapaSistema").DescriptorMapa | null;
  mapaProfundidadMaxima: number | null;
  mapaSubarbolRaizId: Id | null;
  mapaCriterioResaltado: CriterioResaltado;
  mapaZoom: number;
  mapaPanX: number;
  mapaPanY: number;
  mapaAutoRefresh: boolean;
  mapaUltimoVisitadoOpdId: Id | null;
  mapaTooltipActivoId: Id | null;
  mapaPanelFiltrosAbierto: boolean;
  mapaPanelEstadisticasAbierto: boolean;
  abrirVistaMapa: () => void;
  cerrarVistaMapa: () => void;
  refrescarVistaMapa: () => void;
  saltarAOpdDesdeMapa: (opdId: Id) => void;
  fijarMapaProfundidad: (max: number | null) => void;
  fijarMapaSubarbol: (raizId: Id | null) => void;
  fijarMapaCriterioResaltado: (criterio: CriterioResaltado) => void;
  fijarMapaZoom: (zoom: number) => void;
  fijarMapaPan: (x: number, y: number) => void;
  toggleMapaAutoRefresh: () => void;
  fijarMapaTooltip: (opdId: Id | null) => void;
  toggleMapaPanelFiltros: () => void;
  toggleMapaPanelEstadisticas: () => void;
  limpiarFiltrosMapa: () => void;
  descriptorMapaFiltrado: () => DescriptorMapa;
  estadisticasModelo: () => EstadisticasModelo;
  // ── L5: Reordenamiento del árbol ─────────────────────────────────
  modoOrdenArbol: "manual" | "automatico";
  fijarModoOrdenArbol: (modo: "manual" | "automatico") => void;
  moverHermano: (padreId: Id | null, opdId: Id, posicion: number) => void;
  moverOpdEnGestion: (opdId: Id, nuevoPadreId: Id | null, posicion: number) => void;
  // ── L5: Gestión árbol ────────────────────────────────────────────
  gestionArbolAbierta: boolean;
  abrirGestionArbol: () => void;
  cerrarGestionArbol: () => void;
  busquedaOpdGestion: string;
  fijarBusquedaOpdGestion: (q: string) => void;
  // ── L5: Renombrado OPD desde árbol ───────────────────────────────
  renombrarOpdDesdeArbol: (opdId: Id, nombre: string) => void;
  // ── L5: Atajos / árbol ───────────────────────────────────────────
  anchoPanelArbol: number;
  /**
   * BUG-20260511T225343Z-696858: ancho del panel Inspector derecho.
   * Persistencia espejo a `anchoPanelArbol` (en `indice.preferenciasUi`).
   * Clamp en `limitarAnchoPanelInspector` [240, 560] con default 300.
   */
  anchoPanelInspector: number;
  nombresArbolVisibles: boolean;
  cheatsheetAtajosAbierto: boolean;
  /**
   * L2 ronda 21: vista activa del modo revisión mobile.
   * Solo se consume cuando `resolverBreakpoint(viewport.width) === "mobile"`.
   * Persiste en sesión (no se serializa al modelo). Default: "canvas".
   */
  vistaMobileActiva: "canvas" | "opds" | "opl" | "issues";
  fijarAnchoPanelArbol: (px: number) => void;
  /** BUG-20260511T225343Z-696858: setea ancho Inspector con clamp + persistencia. */
  fijarAnchoPanelInspector: (px: number) => void;
  toggleNombresArbolVisibles: () => void;
  abrirCheatsheetAtajos: () => void;
  cerrarCheatsheetAtajos: () => void;
  /** L2 ronda 21: cambia la vista activa del modo revisión mobile. */
  cambiarVistaMobile: (vista: "canvas" | "opds" | "opl" | "issues") => void;
  navegarOpdArriba: () => void;
  navegarOpdAbajo: () => void;
  navegarOpdIzquierda: () => void;
  navegarOpdDerecha: () => void;
  // ── /L5 ──────────────────────────────────────────────────────────
  // ── L3 ronda 20: Biblioteca dock + overlay ───────────────────────
  /** Overlay legacy de biblioteca (Toolbar > Biblioteca). Vive en store */
  /** desde ronda 20 L3 para que `toggleBibliotecaDock` pueda cerrarlo. */
  bibliotecaCosaAbierta: boolean;
  /** Dock acoplable junto al árbol OPD (panel persistente, desktop ≥900px). */
  bibliotecaDockAbierto: boolean;
  toggleBibliotecaCosa: () => void;
  abrirBibliotecaCosa: () => void;
  cerrarBibliotecaCosa: () => void;
  toggleBibliotecaDock: () => void;
  abrirBibliotecaDock: () => void;
  cerrarBibliotecaDock: () => void;
  // ── /L3 ronda 20 ─────────────────────────────────────────────────
  // ── L3: Asistente nuevo modelo ───────────────────────────────────
  iniciarAsistente: () => void;
  siguienteEtapa: (parcial: Partial<DatosAsistente>) => void;
  etapaAnterior: () => void;
  cancelarAsistente: () => void;
  confirmarAsistente: () => void;
  // ── Beta2 / Ronda 17 L2: modo simulación conceptual ──────────────
  /** Contexto activo de simulación; `null` cuando no estamos en modo. */
  contextoSimulacion: import("../modelo/simulacion/tipos").ContextoSimulacion | null;
  /** Snapshot del `readOnly` previo a entrar en modo simulación. Permite
   *  restaurar el flag al salir sin perder el modo solo-lectura del modelo. */
  readOnlyPrevSimulacion: boolean | null;
  /** Equivalente local a `Executing && !ExecutingPause` de OPCloud. */
  autoAvanceSimulacionActivo: boolean;
  /** Razón de velocidad de tokens/simulacion, inspirada en `tokenRuntimeRatio`. */
  velocidadSimulacion: number;
  iniciarModoSimulacion: () => void;
  salirModoSimulacion: () => void;
  ejecutarPasoSimulacion: () => void;
  ejecutarCorridaSimulacion: () => void;
  reiniciarSimulacionActual: () => void;
  iniciarAutoAvanceSimulacion: () => void;
  pausarAutoAvanceSimulacion: () => void;
  fijarVelocidadSimulacion: (velocidad: number) => void;
  asignarValorRuntimeSimulacion: (entidadId: Id, valor: import("../modelo/tipos").ValorConcreto) => void;
}



export type {
  CarpetasSlice,
  CrearSlice,
  EnlacesSlice,
  MapaSlice,
  ModeloSlice,
  OpmStoreSliceExtraKeys,
  OpmStoreSliceMissingKeys,
  OpmStoreSlices,
  PersistenciaSlice,
  PestanasSlice,
  SeleccionSlice,
  SimulacionSlice,
  UiPanelSlice,
  WorkspaceModSlice,
} from "./sliceTypes";
