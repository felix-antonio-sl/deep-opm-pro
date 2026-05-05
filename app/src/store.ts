import { useEffect, useState } from "preact/hooks";
import { createStore } from "zustand/vanilla";
import { crearCosaEnPosicion } from "./modelo/creacionInterna";
import { extremoEstado } from "./modelo/extremos";
import {
  designarCurrent,
  designarDefault,
  designarFinal,
  designarInicial,
  quitarDesignacion,
  restaurarEstado,
  suprimirEstado,
} from "./modelo/estadosDesignaciones";
import {
  aplicarEstiloApariencia,
  resetearEstiloApariencia,
} from "./modelo/estilos";
import {
  contenedorRefinamiento,
  dentroDeApariencia,
  posicionLibre,
} from "./modelo/layout";
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
} from "./modelo/operaciones";
import {
  agregarUrl,
  editarAlias,
  editarDescripcion,
  editarUnidad,
  eliminarUrl,
  reordenarUrls,
} from "./modelo/objetoMetadata";
import { fijarDuracion, quitarDuracion } from "./modelo/objetoDuracion";
import {
  cambiarOrdenPartes as cambiarOrdenPartesOp,
  cambiarModoPlegado as cambiarModoPlegadoOp,
  crearEnlaceConExtremoPlegado,
  extraerParteDePlegado as extraerParteDePlegadoOp,
  reinsertarParteEnPlegado as reinsertarParteEnPlegadoOp,
} from "./modelo/plegado";
import {
  abanicoDeEnlace,
  alternarOperadorAbanico as alternarOperadorAbanicoOp,
  disolverAbanico as disolverAbanicoOp,
  formarAbanicoAutomatico,
  quitarRamaDeAbanico as quitarRamaDeAbanicoOp,
  sincronizarAbanicos,
} from "./modelo/abanicos";
import { crearAutoInvocacion } from "./modelo/autoinvocacion";
import { eliminarOpdHoja } from "./modelo/opdEliminacion";
import {
  listarHermanos,
  moverNodo,
  ordenSegunCanvasPadre,
  reordenarHermanos,
  validarMovimientoSinCiclo,
} from "./modelo/opdReorden";
import {
  aplicarModificador,
  definirDemora,
  definirProbabilidad,
  quitarModificador,
} from "./modelo/modificadores";
import { renombrarEtiquetaEnlace } from "./modelo/etiquetasEnlace";
import { definirRutaEtiqueta } from "./modelo/rutas";
import {
  aplicarEstiloEnlace,
  copiarEstiloEnlace,
  pegarEstiloEnlace,
  resetEstiloEnlace,
} from "./modelo/enlaceEstilo";
import {
  fijarMultiplicidadOrigen,
  fijarMultiplicidadDestino,
  quitarMultiplicidad,
} from "./modelo/enlaceMultiplicidad";
import {
  insertarVerticeApariencia,
  reposicionarVerticeApariencia,
  reanclarExtremoEnlace as reanclarExtremoEnlaceOp,
} from "./modelo/enlaceVertices";
import {
  borrarModeloLocal,
  cargarModeloLocal,
  guardarModeloLocal,
  listarModelosLocales,
  actualizarMetadataModeloLocal,
  type ResumenModeloPersistido,
} from "./persistencia/local";
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
} from "./persistencia/workspace";
import {
  cortarCarpeta as cortarCarpetaWorkspace,
  cortarModelo as cortarModeloWorkspace,
  moverCarpeta,
  moverModelo,
  pegarCarpeta,
  pegarModelo,
} from "./persistencia/movimientoModelos";
import {
  crearVersion,
  eliminarVersion,
  restaurarVersion,
} from "./persistencia/versiones";
import {
  crearAutosalvado,
  type AutosalvadoEstado,
  type AutosalvadoControl,
} from "./persistencia/autosalvado";
import { exportarModelo, hidratarModelo } from "./serializacion/json";
import type { Aviso } from "./modelo/validaciones";
import type { Afiliacion, Apariencia, DesignacionEstado, DuracionTemporal, EnlaceEstilo, Esencia, EstiloApariencia, ExtremoEnlace, Id, LayoutEstados, Modelo, Modificador, ModoDespliegueObjeto, ModoPlegado, Opd, OperadorAbanico, OrdenPartesPlegado, Pestana, PestanaId, Posicion, TipoEnlace, TipoEntidad, UrlObjetoTipada, UiPortapapelesVisual, VersionResumen } from "./modelo/tipos";
import { mismaReferencia, type OplReferencia } from "./opl/interaccion";
import { datosAsistenteVacio, sembrarModeloDesdeAsistente, validarDatosAsistente, type DatosAsistente, type EtapaAsistente } from "./modelo/creacionWizard";
import { generarOpl } from "./opl/generar";
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
} from "./render/jointjs/mapaSistema";
import { fijarOpcionesProyeccionGlobal } from "./render/jointjs/proyeccion";
import {
  abrirPestana as abrirPestanaEstado,
  cambiarActiva as cambiarPestanaActivaEstado,
  cerrarPestana as cerrarPestanaEstado,
  clonarModelo,
  crearPestanaDesdeModelo,
  crearPestanaNueva,
  duplicarPestana as duplicarPestanaEstado,
  reordenarPestanas as reordenarPestanasEstado,
} from "./store/pestanas";
import {
  agregar as seleccionAgregar,
  quitar as seleccionQuitar,
  setSeleccion as seleccionSet,
  todasDelOpd,
  toggle as seleccionToggle,
  vacia as seleccionVacia,
  type ModoSeleccion,
} from "./canvas/seleccionMultiple";
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
} from "./canvas/operacionesBatch";

interface ModoEnlace {
  tipo: TipoEnlace;
  origenId: Id;
}

interface OpmStore {
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
  filtroOplPorSeleccion: boolean;
  hoverOplRef: OplReferencia | null;
  busquedaOpl: string;
  mensaje: string | null;
  dirty: boolean;
  puedeDeshacer: boolean;
  puedeRehacer: boolean;
  modelosGuardados: ResumenModeloPersistido[];
  modeloPersistidoId: Id | null;
  descripcionModeloLocal: string;
  menuPrincipalAbierto: boolean;
  dialogoGuardarComoAbierto: boolean;
  dialogoCargarModeloAbierto: boolean;
  workspaceLocal: WorkspaceModeloLocal;
  tablaEnlacesAbierta: boolean;
  tablaEnlacesFiltroTipo: TipoEnlace | "todos";
  tablaEnlacesOrdenColumna: string | null;
  tablaEnlacesOrdenDireccion: "asc" | "desc";
  enlaceEstiloPortapapeles: EnlaceEstilo | null;
  uiAliasVisibles: boolean;
  uiDescripcionesVisibles: boolean;
  modalUrlsAbierto: Id | null;
  modalDuracionAbierto: Id | null;
  // ── Carpetas (L4) ──
  indice: WorkspaceIndice;
  carpetaActualId: Id | null;
  modelosRecientes: ResumenModeloPersistido[];
  // ── Búsqueda intra-modelo (L4) ──
  busquedaCosasAbierta: boolean;
  busquedaCosasQuery: string;
  busquedaCosasFiltro: "todos" | "procesos" | "objetos";
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
  abrirGuardarComo: () => void;
  cerrarGuardarComo: () => void;
  guardarComoLocal: (input: { nombre: string; descripcion?: string; crearVersionAlGuardar?: boolean }) => void;
  abrirCargarModelo: () => void;
  cerrarCargarModelo: () => void;
  cargarLocalDesdeDialogo: (id: Id) => void;
  nuevoModelo: () => void;
  crearObjetoDemo: () => void;
  crearProcesoDemo: () => void;
  crearEntidadEnCanvas: (tipo: TipoEntidad, posicion: Posicion) => void;
  fijarModoCreacion: (tipo: TipoEntidad | null) => void;
  descomponerSeleccionada: () => void;
  desplegarSeleccionada: (modo?: ModoDespliegueObjeto) => void;
  quitarDescomposicionSeleccionada: () => void;
  quitarDespliegueSeleccionado: () => void;
  eliminarOpdDesdeArbol: (opdId: Id) => void;
  cambiarOpdActivo: (id: Id) => void;
  seleccionarEntidad: (id: Id) => void;
  seleccionarEstadoComoExtremo: (estadoId: Id) => void;
  seleccionarEnlace: (id: Id) => void;
  seleccionarDesdeOpl: (ref: OplReferencia) => void;
  renombrarEntidadDesdeOpl: (entidadId: Id, nombre: string) => void;
  fijarFiltroOplPorSeleccion: (activo: boolean) => void;
  fijarHoverOpl: (ref: OplReferencia | null) => void;
  fijarBusquedaOpl: (texto: string) => void;
  editarEtiquetaEnlaceDesdeOpl: (enlaceId: Id, etiqueta: string) => void;
  renombrarEstadoDesdeOpl: (estadoId: Id, nombre: string) => void;
  abrirInspectorEnlaceDesdeOpl: (enlaceId: Id) => void;
  copiarOplActualAlPortapapeles: () => Promise<void>;
  exportarOplActualHtml: () => Promise<void>;
  navegarAviso: (aviso: Aviso) => void;
  deshacer: () => void;
  rehacer: () => void;
  elegirTipoEnlace: (tipo: TipoEnlace) => void;
  cancelarEnlace: () => void;
  renombrarSeleccionada: (nombre: string) => void;
  fijarEsenciaSeleccionada: (esencia: Esencia) => void;
  fijarAfiliacionSeleccionada: (afiliacion: Afiliacion) => void;
  cambiarModoPlegadoSeleccionado: (modo: ModoPlegado) => void;
  cambiarModoPlegadoApariencia: (aparienciaId: Id, modo: ModoPlegado) => void;
  fijarModoPlegadoApariencia: (aparienciaId: Id, modo: ModoPlegado) => void;
  cambiarOrdenPartesSeleccionado: (orden: OrdenPartesPlegado) => void;
  fijarOrdenPartesApariencia: (aparienciaId: Id, orden: OrdenPartesPlegado) => void;
  aplicarEstiloSeleccionado: (patch: EstiloApariencia) => void;
  resetearEstiloSeleccionado: () => void;
  seleccionarPartePlegada: (padreAparienciaId: Id, parteEntidadId: Id) => void;
  extraerParteDePlegado: (padreAparienciaId: Id, parteEntidadId: Id) => void;
  reinsertarParteExtraidaSeleccionada: () => void;
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
  reordenarSubprocesoEnTimeline: (opdId: Id, aparienciaId: Id, nuevaY: number) => void;
  actualizarVerticesEnlace: (aparienciaEnlaceId: Id, vertices: Array<{ x: number; y: number }>) => void;
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
  quitarModificadorEnlaceSeleccionado: () => void;
  definirProbabilidadEventoSeleccionada: (probabilidad: number | undefined) => void;
  definirDemoraInvocacionSeleccionada: (demora: string | undefined) => void;
  renombrarEtiquetaEnlaceSeleccionado: (etiqueta: string) => void;
  definirRutaEtiquetaSeleccionada: (etiqueta: string | undefined) => void;
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
  fijarBusquedaCosasFiltro: (filtro: "todos" | "procesos" | "objetos") => void;
  saltarAResultadoBusqueda: (entidadId: Id, opdId: Id) => void;
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
  // ── L5: Mapa del sistema ─────────────────────────────────────────
  vistaMapaActiva: boolean;
  descriptorMapaCache: import("./render/jointjs/mapaSistema").DescriptorMapa | null;
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
  nombresArbolVisibles: boolean;
  cheatsheetAtajosAbierto: boolean;
  fijarAnchoPanelArbol: (px: number) => void;
  toggleNombresArbolVisibles: () => void;
  abrirCheatsheetAtajos: () => void;
  cerrarCheatsheetAtajos: () => void;
  navegarOpdArriba: () => void;
  navegarOpdAbajo: () => void;
  navegarOpdIzquierda: () => void;
  navegarOpdDerecha: () => void;
  // ── /L5 ──────────────────────────────────────────────────────────
  // ── L3: Asistente nuevo modelo ───────────────────────────────────
  iniciarAsistente: () => void;
  siguienteEtapa: (parcial: Partial<DatosAsistente>) => void;
  etapaAnterior: () => void;
  cancelarAsistente: () => void;
  confirmarAsistente: () => void;
}

const pestanaInicial = crearPestanaNueva();
const modeloInicial = pestanaInicial.modelo;
const UNDO_LIMIT = 100;
let snapshotGuardado = exportarModelo(modeloInicial);
let undoStack: Modelo[] = [];
let redoStack: Modelo[] = [];
let autosalvadoControl: AutosalvadoControl | null = null;

const WS_KEY = "deep-opm-pro:persistencia:workspace";
const PREF_MOSTRAR_ARCHIVADOS_KEY = "deep-opm-pro:ui:mostrar-archivados";
const PREF_MOSTRAR_VERSIONES_KEY = "deep-opm-pro:ui:mostrar-versiones";
const PORTAPAPELES_WORKSPACE_TTL_MS = 5 * 60 * 1000;
const ANCHO_PANEL_ARBOL_DEFAULT = 240;
const ANCHO_PANEL_ARBOL_MIN = 160;
const ANCHO_PANEL_ARBOL_MAX = 600;
const indiceInicial = leerIndiceWorkspace();
const preferenciasUiIniciales = indiceInicial.preferenciasUi ?? {};

export const store = createStore<OpmStore>((set, get) => ({
  modelo: modeloInicial,
  opdActivoId: modeloInicial.opdRaizId,
  pestanasAbiertas: [pestanaInicial],
  pestanaActivaId: pestanaInicial.id,
  seleccionId: null,
  seleccionados: [],
  modoSeleccion: "simple",
  portapapelesVisual: null,
  enlaceSeleccionId: null,
  modoEnlace: null,
  modoCreacion: null,
  filtroOplPorSeleccion: false,
  hoverOplRef: null,
  busquedaOpl: "",
  mensaje: null,
  dirty: false,
  puedeDeshacer: false,
  puedeRehacer: false,
  modelosGuardados: [],
  modeloPersistidoId: null,
  descripcionModeloLocal: "",
  menuPrincipalAbierto: false,
  dialogoGuardarComoAbierto: false,
  dialogoCargarModeloAbierto: false,
  workspaceLocal: workspaceDesdeModelo(modeloInicial, null),
  // ── L6 ──
  tablaEnlacesAbierta: false,
  tablaEnlacesFiltroTipo: "todos",
  tablaEnlacesOrdenColumna: null,
  tablaEnlacesOrdenDireccion: "asc",
  enlaceEstiloPortapapeles: null,
  uiAliasVisibles: true,
  uiDescripcionesVisibles: true,
  modalUrlsAbierto: null,
  modalDuracionAbierto: null,

  // ── Carpetas (L4) ──
  indice: indiceInicial,
  carpetaActualId: null,
  modelosRecientes: [],
  portapapelesWorkspace: null,
  mostrarArchivados: leerPreferenciaBooleana(PREF_MOSTRAR_ARCHIVADOS_KEY, false),
  mostrarVersiones: leerPreferenciaBooleana(PREF_MOSTRAR_VERSIONES_KEY, false),
  dialogoVersionesAbierto: null,
  dialogoArchivadosAbierto: false,
  dialogoBuscarGlobalAbierto: false,
  busquedaGlobal: { query: "", resultados: [], enProgreso: false },
  // ── Búsqueda (L4) ──
  busquedaCosasAbierta: false,
  busquedaCosasQuery: "",
  busquedaCosasFiltro: "todos",
  // ── Autosalvado (L4) ──
  autosalvado: { activo: false, ultimo: null, salvando: false },
  // ── L5: Mapa del sistema ──
  vistaMapaActiva: false,
  descriptorMapaCache: null,
  mapaProfundidadMaxima: null,
  mapaSubarbolRaizId: null,
  mapaCriterioResaltado: "ninguno",
  mapaZoom: 1,
  mapaPanX: 0,
  mapaPanY: 0,
  mapaAutoRefresh: true,
  mapaUltimoVisitadoOpdId: null,
  mapaTooltipActivoId: null,
  mapaPanelFiltrosAbierto: false,
  mapaPanelEstadisticasAbierto: false,
  // ── L5: Reordenamiento ──
  modoOrdenArbol: "automatico",
  // ── L5: Gestión árbol ──
  gestionArbolAbierta: false,
  busquedaOpdGestion: "",
  // ── L5: Atajos / árbol ──
  anchoPanelArbol: limitarAnchoPanelArbol(preferenciasUiIniciales.anchoPanelArbol),
  nombresArbolVisibles: preferenciasUiIniciales.nombresArbolVisibles ?? true,
  cheatsheetAtajosAbierto: false,
  // ── L3: Asistente ──
  asistente: null,

  limpiarMensaje() {
    set({ mensaje: null });
  },

  abrirMenuPrincipal() {
    set({
      menuPrincipalAbierto: true,
      modelosGuardados: listarModelosGuardadosSeguro(),
      mensaje: null,
    });
  },

  cerrarMenuPrincipal() {
    set({ menuPrincipalAbierto: false });
  },

  abrirGuardarComo() {
    const { modelo, modeloPersistidoId, descripcionModeloLocal, indice } = get();
    const modelosGuardados = listarModelosGuardadosSeguro();
    const indiceSinc = sincronizarIndiceConModelosGuardados(modelosGuardados, indice);
    const carpetaId = modeloPersistidoId
      ? indiceSinc.modelos.find((m) => m.id === modeloPersistidoId)?.carpetaId ?? null
      : get().carpetaActualId;
    set({
      menuPrincipalAbierto: false,
      dialogoGuardarComoAbierto: true,
      workspaceLocal: workspaceDesdeModelo(modelo, modeloPersistidoId, descripcionModeloLocal, carpetaId),
      modelosGuardados,
      indice: indiceSinc,
      carpetaActualId: carpetaId,
      mensaje: null,
    });
  },

  cerrarGuardarComo() {
    set({ dialogoGuardarComoAbierto: false });
  },

  guardarComoLocal(input) {
    const { modelo, modelosGuardados, opdActivoId, carpetaActualId, indice } = get();
    const validacion = validarNombreModeloLocal(input.nombre, modelosGuardados);
    if (!validacion.ok) {
      set({ mensaje: validacion.error ?? "Nombre de modelo inválido" });
      return;
    }
    const descripcion = input.descripcion?.trim() ?? "";
    const modeloNombrado: Modelo = { ...modelo, nombre: validacion.nombre };
    const carpetaParaGuardar = carpetaActualId;
    const json = exportarModelo(modeloNombrado, carpetaParaGuardar);
    const guardado = guardarModeloLocal({
      id: null,
      nombre: validacion.nombre,
      descripcion,
      json,
      ...(carpetaParaGuardar !== undefined ? { carpetaId: carpetaParaGuardar } : {}),
      ...(input.crearVersionAlGuardar !== undefined ? { crearVersionAlGuardar: input.crearVersionAlGuardar } : {}),
    });
    if (!guardado.ok) {
      set({ mensaje: guardado.error });
      return;
    }
    // Snapshot para dirty tracking sin carpetaId (normalizado)
    snapshotGuardado = exportarModelo(modeloNombrado);
    let versiones: VersionResumen[] = [];
    if (input.crearVersionAlGuardar) {
      try {
        const version = crearVersion(modeloNombrado, { descripcion: "Versión inicial" });
        versiones = [version];
        actualizarMetadataModeloLocal(guardado.value.id, {
          versiones,
          crearVersionAlGuardar: true,
        });
      } catch { /* storage lleno/no disponible: se conserva el guardado */ }
    }
    const nuevoIndice: WorkspaceIndice = {
      ...indice,
      modelos: [
        ...indice.modelos.filter((m) => m.id !== guardado.value.id),
        {
          id: guardado.value.id,
          carpetaId: carpetaParaGuardar ?? null,
          mapa: mapaWorkspaceDesdeEstado(get()),
          ...(versiones.length > 0 ? { versiones } : {}),
        },
      ],
      recientes: [guardado.value.id, ...indice.recientes.filter((r) => r !== guardado.value.id)].slice(0, 10),
    };
    escribirIndiceWorkspace(nuevoIndice);
    set(estadoModelo(modeloNombrado, {
      opdActivoId: opdActivoSeguro(modeloNombrado, opdActivoId),
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: "Modelo guardado exitosamente",
      dirty: false,
      modeloPersistidoId: guardado.value.id,
      descripcionModeloLocal: guardado.value.descripcion,
      modelosGuardados: listarModelosGuardadosSeguro(),
      dialogoGuardarComoAbierto: false,
      indice: nuevoIndice,
      workspaceLocal: workspaceDesdeModelo(modeloNombrado, guardado.value.id, guardado.value.descripcion, carpetaParaGuardar ?? null),
    }));
  },

  abrirCargarModelo() {
    const modelosGuardados = listarModelosGuardadosSeguro();
    const indiceSinc = sincronizarIndiceConModelosGuardados(modelosGuardados, leerIndiceWorkspace());
    set({
      menuPrincipalAbierto: false,
      dialogoCargarModeloAbierto: true,
      modelosGuardados,
      indice: indiceSinc,
      carpetaActualId: null,
      modelosRecientes: modelosRecientesDeIndice(indiceSinc, modelosGuardados),
      mensaje: null,
    });
  },

  cerrarCargarModelo() {
    set({ dialogoCargarModeloAbierto: false });
  },

  cargarLocalDesdeDialogo(id) {
    get().cargarLocal(id);
    if (store.getState().modeloPersistidoId === id) {
      set({ dialogoCargarModeloAbierto: false });
    }
  },

  nuevoModelo() {
    const actual = get().pestanasAbiertas.find((pestana) => pestana.id === get().pestanaActivaId);
    const modelo = crearModelo("Modelo");
    if (actual && pestanaReemplazable(actual)) {
      resetHistorial(modelo);
      set(estadoModelo(modelo, {
        opdActivoId: modelo.opdRaizId,
        seleccionId: null,
        seleccionados: [],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        modoEnlace: null,
        modoCreacion: null,
        hoverOplRef: null,
        modeloPersistidoId: null,
        descripcionModeloLocal: "",
        menuPrincipalAbierto: false,
        dialogoGuardarComoAbierto: false,
        dialogoCargarModeloAbierto: false,
        workspaceLocal: workspaceDesdeModelo(modelo, null),
        mensaje: "Nuevo modelo",
      }));
      return;
    }
    const pestana = crearPestanaNueva({ modelo });
    activarPestanaNueva(set, get, pestana, "Nuevo modelo en pestana");
  },

  crearObjetoDemo() {
    const { modelo, opdActivoId } = get();
    const resultado = crearObjeto(modelo, opdActivoId, posicionLibre(modelo, opdActivoId, "objeto"));
    if (resultado.ok) {
      const nueva = entidadNueva(modelo, resultado.value);
      commitModelo(set, modelo, resultado.value, { seleccionId: nueva, seleccionados: nueva ? [nueva] : [], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: null });
    }
  },

  crearProcesoDemo() {
    const { modelo, opdActivoId } = get();
    const resultado = crearProceso(modelo, opdActivoId, posicionLibre(modelo, opdActivoId, "proceso"));
    if (resultado.ok) {
      const nueva = entidadNueva(modelo, resultado.value);
      commitModelo(set, modelo, resultado.value, { seleccionId: nueva, seleccionados: nueva ? [nueva] : [], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: null });
    }
  },

  crearEntidadEnCanvas(tipo, posicion) {
    const { modelo, opdActivoId } = get();
    const resultado = crearCosaEnPosicion(modelo, opdActivoId, tipo, posicion);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value.modelo, {
      seleccionId: resultado.value.entidadId,
      seleccionados: [resultado.value.entidadId],
      modoSeleccion: "simple",
      enlaceSeleccionId: null,
      modoEnlace: null,
      modoCreacion: tipo,
      mensaje: null,
    });
  },

  fijarModoCreacion(tipo) {
    set({
      modoCreacion: tipo,
      modoEnlace: null,
      mensaje: tipo ? `Haz clic en el canvas para crear ${tipo === "objeto" ? "un objeto" : "un proceso"}` : null,
    });
  },

  descomponerSeleccionada() {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un proceso para descomponer" });
      return;
    }
    const entidad = modelo.entidades[seleccionId];
    if (!entidad || entidad.tipo !== "proceso") {
      set({ mensaje: "Selecciona un proceso para descomponer" });
      return;
    }

    const resultado = descomponerProceso(modelo, opdActivoId, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value.modelo, {
      opdActivoId: resultado.value.opdId,
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: resultado.value.creado ? "OPD hijo creado" : null,
    });
  },

  desplegarSeleccionada(modo = "agregacion") {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un objeto para desplegar" });
      return;
    }
    const entidad = modelo.entidades[seleccionId];
    if (!entidad || entidad.tipo !== "objeto") {
      set({ mensaje: "Selecciona un objeto para desplegar" });
      return;
    }

    const resultado = desplegarObjeto(modelo, opdActivoId, seleccionId, modo);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value.modelo, {
      opdActivoId: resultado.value.opdId,
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: resultado.value.creado ? "OPD de despliegue creado" : null,
    });
  },

  quitarDescomposicionSeleccionada() {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un proceso descompuesto" });
      return;
    }
    const entidad = modelo.entidades[seleccionId];
    if (!entidad || entidad.tipo !== "proceso" || entidad.refinamiento?.tipo !== "descomposicion") {
      set({ mensaje: "Selecciona un proceso descompuesto" });
      return;
    }

    const resultado = quitarDescomposicionProceso(modelo, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      opdActivoId: opdActivoSeguro(resultado.value, opdActivoId),
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: "Descomposición eliminada",
    });
  },

  quitarDespliegueSeleccionado() {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un objeto desplegado" });
      return;
    }
    const entidad = modelo.entidades[seleccionId];
    if (!entidad || entidad.tipo !== "objeto" || entidad.refinamiento?.tipo !== "despliegue") {
      set({ mensaje: "Selecciona un objeto desplegado" });
      return;
    }

    const resultado = quitarDespliegueObjeto(modelo, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      opdActivoId: opdActivoSeguro(resultado.value, opdActivoId),
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: "Despliegue eliminado",
    });
  },

  eliminarOpdDesdeArbol(opdId) {
    const { modelo, opdActivoId } = get();
    const resultado = eliminarOpdHoja(modelo, opdId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const opd = modelo.opds[opdId];
    if (!confirmarEliminacionOpd(opd?.nombre ?? opdId)) return;
    commitModelo(set, modelo, resultado.value.modelo, {
      opdActivoId: opdActivoId === opdId ? resultado.value.opdActivoSugerido : opdActivoSeguro(resultado.value.modelo, opdActivoId),
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: "OPD eliminado",
    });
  },

  cambiarOpdActivo(id) {
    const { modelo, opdActivoId } = get();
    if (!modelo.opds[id]) {
      set({ mensaje: `OPD no existe: ${id}` });
      return;
    }
    if (id === opdActivoId) {
      set({ mensaje: null });
      return;
    }
    set({ opdActivoId: id, seleccionId: null, seleccionados: [], modoSeleccion: "simple", enlaceSeleccionId: null, modoEnlace: null, modoCreacion: null, hoverOplRef: null, mensaje: null });
  },

  seleccionarEntidad(id) {
    const { modelo, modoEnlace, opdActivoId } = get();
    if (!modoEnlace) {
      set({ seleccionId: id, seleccionados: [id], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: null });
      return;
    }

    const resultado = crearEnlaceConExtremoPlegado(modelo, opdActivoId, modoEnlace.origenId, id, modoEnlace.tipo);
    if (!resultado.ok) {
      set({ seleccionId: id, seleccionados: [id], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: resultado.error });
      return;
    }
    let modeloFinal = resultado.value;
    const enlaceCreadoId = enlaceNuevo(modelo, modeloFinal);
    if (enlaceCreadoId) {
      const auto = formarAbanicoAutomatico(modeloFinal, opdActivoId, enlaceCreadoId);
      if (auto.ok) modeloFinal = auto.value;
    }
    commitModelo(set, modelo, modeloFinal, {
      seleccionId: id,
      seleccionados: [id],
      modoSeleccion: "simple",
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  seleccionarEstadoComoExtremo(estadoId) {
    const { modelo, modoEnlace, opdActivoId } = get();
    const estado = modelo.estados[estadoId];
    if (!estado) {
      set({ mensaje: `Estado no existe: ${estadoId}` });
      return;
    }
    if (!modoEnlace) {
      set({ seleccionId: estado.entidadId, seleccionados: [estado.entidadId], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: null });
      return;
    }

    const resultado = crearEnlaceConExtremoPlegado(modelo, opdActivoId, modoEnlace.origenId, extremoEstado(estadoId), modoEnlace.tipo);
    if (!resultado.ok) {
      set({ seleccionId: estado.entidadId, seleccionados: [estado.entidadId], modoSeleccion: "simple", enlaceSeleccionId: null, mensaje: resultado.error });
      return;
    }
    let modeloFinal = resultado.value;
    const enlaceCreadoId = enlaceNuevo(modelo, modeloFinal);
    if (enlaceCreadoId) {
      const auto = formarAbanicoAutomatico(modeloFinal, opdActivoId, enlaceCreadoId);
      if (auto.ok) modeloFinal = auto.value;
    }
    commitModelo(set, modelo, modeloFinal, {
      seleccionId: estado.entidadId,
      seleccionados: [estado.entidadId],
      modoSeleccion: "simple",
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  seleccionarEnlace(id) {
    const { modelo } = get();
    const enlace = modelo.enlaces[id];
    if (!enlace) {
      set({ mensaje: `Enlace no existe: ${id}` });
      return;
    }
    set({ seleccionId: null, seleccionados: [id], modoSeleccion: "simple", enlaceSeleccionId: id, modoEnlace: null, mensaje: null });
  },

  seleccionarDesdeOpl(ref) {
    const { modelo } = get();
    if (ref.tipo === "enlace") {
      if (!modelo.enlaces[ref.id]) {
        set({ mensaje: `Enlace no existe: ${ref.id}` });
        return;
      }
      set({ seleccionId: null, seleccionados: [ref.id], modoSeleccion: "simple", enlaceSeleccionId: ref.id, modoEnlace: null, mensaje: null });
      return;
    }
    if (ref.tipo === "estado") {
      const estado = modelo.estados[ref.id];
      if (!estado) {
        set({ mensaje: `Estado no existe: ${ref.id}` });
        return;
      }
      set({ seleccionId: estado.entidadId, seleccionados: [estado.entidadId], modoSeleccion: "simple", enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
      return;
    }
    if (!modelo.entidades[ref.id]) {
      set({ mensaje: `Entidad no existe: ${ref.id}` });
      return;
    }
    set({ seleccionId: ref.id, seleccionados: [ref.id], modoSeleccion: "simple", enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  renombrarEntidadDesdeOpl(entidadId, nombre) {
    const { modelo } = get();
    const resultado = renombrarEntidad(modelo, entidadId, nombre);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: entidadId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  fijarFiltroOplPorSeleccion(activo) {
    set({ filtroOplPorSeleccion: activo });
  },

  fijarHoverOpl(ref) {
    const actual = get().hoverOplRef;
    if ((actual === null && ref === null) || (actual && ref && mismaReferencia(actual, ref))) return;
    set({ hoverOplRef: ref });
  },

  fijarBusquedaOpl(texto) {
    set({ busquedaOpl: texto });
  },

  editarEtiquetaEnlaceDesdeOpl(enlaceId, etiqueta) {
    const { modelo } = get();
    const resultado = renombrarEtiquetaEnlace(modelo, enlaceId, etiqueta);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId: enlaceId,
      modoEnlace: null,
      mensaje: null,
    });
  },

  renombrarEstadoDesdeOpl(estadoId, nombre) {
    const { modelo } = get();
    const resultado = renombrarEstado(modelo, estadoId, nombre);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const estadoResultado = resultado.value.estados[estadoId];
    commitModelo(set, modelo, resultado.value, {
      seleccionId: estadoResultado?.entidadId ?? null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  abrirInspectorEnlaceDesdeOpl(enlaceId) {
    const { modelo } = get();
    if (!modelo.enlaces[enlaceId]) {
      set({ mensaje: `Enlace no existe: ${enlaceId}` });
      return;
    }
    set({ seleccionId: null, enlaceSeleccionId: enlaceId, modoEnlace: null, mensaje: null });
  },

  async copiarOplActualAlPortapapeles() {
    const { modelo, opdActivoId } = get();
    const lineas = generarOpl(modelo, opdActivoId);
    const texto = lineas.join("\n");
    try {
      await navigator.clipboard.writeText(texto);
      set({ mensaje: "OPL copiado al portapapeles" });
    } catch {
      set({ mensaje: "No se pudo copiar al portapapeles" });
    }
  },

  async exportarOplActualHtml() {
    const { modelo, opdActivoId } = get();
    const lineas = generarOpl(modelo, opdActivoId);
    if (lineas.length === 0) {
      set({ mensaje: "Sin OPL para exportar" });
      return;
    }
    // Generar HTML usando los tokens con estilos canónicos (JOYAS §1)
    const html = generarHtmlOpl(lineas, modelo.nombre);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${modelo.nombre.replace(/[^a-zA-Z0-9\u00C0-\u024F_-]/g, "_")}-opl.html`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    set({ mensaje: null });
  },

  navegarAviso(aviso) {
    const { modelo, opdActivoId } = get();
    const opdDestino = opdDestinoDeAviso(modelo, aviso, opdActivoId);

    if (aviso.elementoTipo === "entidad" && aviso.elementoId && modelo.entidades[aviso.elementoId]) {
      set({
        opdActivoId: opdDestino ?? opdActivoId,
        seleccionId: aviso.elementoId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
      });
      return;
    }

    if (aviso.elementoTipo === "enlace" && aviso.elementoId && modelo.enlaces[aviso.elementoId]) {
      set({
        opdActivoId: opdDestino ?? opdActivoId,
        seleccionId: null,
        enlaceSeleccionId: aviso.elementoId,
        modoEnlace: null,
        mensaje: null,
      });
      return;
    }

    if (aviso.elementoTipo === "opd") {
      const destino = aviso.elementoId && modelo.opds[aviso.elementoId] ? aviso.elementoId : opdDestino;
      if (destino) {
        set({
          opdActivoId: destino,
          seleccionId: null,
          enlaceSeleccionId: null,
          modoEnlace: null,
          mensaje: null,
        });
        return;
      }
    }

    set({ mensaje: "Aviso sin elemento navegable" });
  },

  elegirTipoEnlace(tipo) {
    const { modelo, seleccionId, modoEnlace } = get();
    const origenId = modoEnlace?.origenId ?? seleccionId;
    if (!origenId || !modelo.entidades[origenId]) {
      set({ mensaje: "Selecciona primero la entidad origen del enlace" });
      return;
    }
    set({ modoEnlace: { tipo, origenId }, modoCreacion: null, mensaje: "Selecciona la entidad destino" });
  },

  cancelarEnlace() {
    set({ modoEnlace: null, mensaje: null });
  },

  deshacer() {
    const { modelo, opdActivoId } = get();
    const previo = undoStack.pop();
    if (!previo) {
      set({ mensaje: "No hay cambios para deshacer", puedeDeshacer: false });
      return;
    }
    redoStack = [modelo, ...redoStack].slice(0, UNDO_LIMIT);
    set(estadoModelo(previo, {
      opdActivoId: opdActivoSeguro(previo, opdActivoId),
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      modoCreacion: null,
      mensaje: "Cambio deshecho",
    }));
  },

  rehacer() {
    const { modelo, opdActivoId } = get();
    const siguiente = redoStack.shift();
    if (!siguiente) {
      set({ mensaje: "No hay cambios para rehacer", puedeRehacer: false });
      return;
    }
    undoStack = [...undoStack, modelo].slice(-UNDO_LIMIT);
    set(estadoModelo(siguiente, {
      opdActivoId: opdActivoSeguro(siguiente, opdActivoId),
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      modoCreacion: null,
      mensaje: "Cambio rehecho",
    }));
  },

  renombrarSeleccionada(nombre) {
    const { modelo, seleccionId } = get();
    if (!seleccionId) return;
    const resultado = renombrarEntidad(modelo, seleccionId, nombre);
    if (resultado.ok) commitModelo(set, modelo, resultado.value, { mensaje: null });
  },

  fijarEsenciaSeleccionada(esencia) {
    const { modelo, seleccionId } = get();
    if (!seleccionId) return;
    const resultado = cambiarEsencia(modelo, seleccionId, esencia);
    if (resultado.ok) commitModelo(set, modelo, resultado.value, { mensaje: null });
  },

  fijarAfiliacionSeleccionada(afiliacion) {
    const { modelo, seleccionId } = get();
    if (!seleccionId) return;
    const resultado = cambiarAfiliacion(modelo, seleccionId, afiliacion);
    if (resultado.ok) commitModelo(set, modelo, resultado.value, { mensaje: null });
  },

  cambiarModoPlegadoSeleccionado(modo) {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) return;
    const apariencia = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
      .find((item) => item.entidadId === seleccionId);
    if (!apariencia) {
      set({ mensaje: "La entidad seleccionada no tiene apariencia en el OPD activo" });
      return;
    }
    const resultado = cambiarModoPlegadoOp(modelo, opdActivoId, apariencia.id, modo);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  cambiarModoPlegadoApariencia(aparienciaId, modo) {
    const { modelo, opdActivoId } = get();
    const resultado = cambiarModoPlegadoOp(modelo, opdActivoId, aparienciaId, modo);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const apariencia = modelo.opds[opdActivoId]?.apariencias[aparienciaId];
    commitModelo(set, modelo, resultado.value, {
      seleccionId: apariencia?.entidadId ?? null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  fijarModoPlegadoApariencia(aparienciaId, modo) {
    get().cambiarModoPlegadoApariencia(aparienciaId, modo);
  },

  cambiarOrdenPartesSeleccionado(orden) {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) return;
    const apariencia = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
      .find((item) => item.entidadId === seleccionId);
    if (!apariencia) {
      set({ mensaje: "La entidad seleccionada no tiene apariencia en el OPD activo" });
      return;
    }
    const resultado = cambiarOrdenPartesOp(modelo, opdActivoId, apariencia.id, orden);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  fijarOrdenPartesApariencia(aparienciaId, orden) {
    const { modelo, opdActivoId } = get();
    const resultado = cambiarOrdenPartesOp(modelo, opdActivoId, aparienciaId, orden);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const apariencia = modelo.opds[opdActivoId]?.apariencias[aparienciaId];
    commitModelo(set, modelo, resultado.value, {
      seleccionId: apariencia?.entidadId ?? null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  aplicarEstiloSeleccionado(patch) {
    const { modelo, opdActivoId, seleccionId } = get();
    const apariencia = aparienciaSeleccionadaActiva(modelo, opdActivoId, seleccionId);
    if (!apariencia) {
      set({ mensaje: "Selecciona una cosa con apariencia activa" });
      return;
    }
    const resultado = aplicarEstiloApariencia(modelo, opdActivoId, apariencia.id, patch);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  resetearEstiloSeleccionado() {
    const { modelo, opdActivoId, seleccionId } = get();
    const apariencia = aparienciaSeleccionadaActiva(modelo, opdActivoId, seleccionId);
    if (!apariencia) {
      set({ mensaje: "Selecciona una cosa con apariencia activa" });
      return;
    }
    const resultado = resetearEstiloApariencia(modelo, opdActivoId, apariencia.id);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  seleccionarPartePlegada(_padreAparienciaId, parteEntidadId) {
    const { modelo, modoEnlace, opdActivoId } = get();
    if (!modoEnlace) {
      set({ seleccionId: parteEntidadId, enlaceSeleccionId: null, mensaje: null });
      return;
    }

    const resultado = crearEnlaceConExtremoPlegado(modelo, opdActivoId, modoEnlace.origenId, parteEntidadId, modoEnlace.tipo);
    if (!resultado.ok) {
      set({ seleccionId: parteEntidadId, enlaceSeleccionId: null, mensaje: resultado.error });
      return;
    }
    let modeloFinal = resultado.value;
    const enlaceCreadoId = enlaceNuevo(modelo, modeloFinal);
    if (enlaceCreadoId) {
      const auto = formarAbanicoAutomatico(modeloFinal, opdActivoId, enlaceCreadoId);
      if (auto.ok) modeloFinal = auto.value;
    }
    commitModelo(set, modelo, modeloFinal, {
      seleccionId: parteEntidadId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  extraerParteDePlegado(padreAparienciaId, parteEntidadId) {
    const { modelo, opdActivoId } = get();
    const resultado = extraerParteDePlegadoOp(modelo, opdActivoId, padreAparienciaId, parteEntidadId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: parteEntidadId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  reinsertarParteExtraidaSeleccionada() {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) return;
    const apariencia = Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
      .find((item) => item.entidadId === seleccionId && item.parteExtraidaDe);
    if (!apariencia?.parteExtraidaDe) {
      set({ mensaje: "Selecciona una parte extraída" });
      return;
    }
    const padre = modelo.opds[opdActivoId]?.apariencias[apariencia.parteExtraidaDe.padreAparienciaId];
    const resultado = reinsertarParteEnPlegadoOp(modelo, apariencia.id);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: padre?.entidadId ?? null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  agregarEstadosObjeto() {
    const { modelo, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un objeto para agregar estados" });
      return;
    }
    const resultado = crearEstadosIniciales(modelo, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value.modelo, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: resultado.value.creado ? "Estados iniciales agregados" : null,
    });
  },

  agregarEstadoObjeto() {
    const { modelo, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un objeto para agregar un estado" });
      return;
    }
    const resultado = agregarEstado(modelo, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value.modelo, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  eliminarEstado(estadoId) {
    const { modelo, seleccionId } = get();
    const resultado = eliminarEstadoOp(modelo, estadoId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  quitarEstadosObjetoSeleccionado() {
    const { modelo, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un objeto para quitar estados" });
      return;
    }
    const resultado = quitarEstadosObjeto(modelo, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: "Estados eliminados",
    });
  },

  renombrarEstadoSeleccionado(estadoId, nombre) {
    const { modelo, seleccionId } = get();
    const resultado = renombrarEstado(modelo, estadoId, nombre);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  designarEstadoInicial(estadoId) {
    const { modelo, seleccionId } = get();
    const resultado = designarInicial(modelo, estadoId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  designarEstadoFinal(estadoId) {
    const { modelo, seleccionId } = get();
    const resultado = designarFinal(modelo, estadoId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  editarAliasEntidad(entidadId, alias) {
    const { modelo } = get();
    const resultado = editarAlias(modelo, entidadId, alias);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  editarUnidadEntidad(entidadId, unidad) {
    const { modelo } = get();
    const resultado = editarUnidad(modelo, entidadId, unidad);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  editarDescripcionEntidad(entidadId, descripcion) {
    const { modelo } = get();
    const resultado = editarDescripcion(modelo, entidadId, descripcion);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  abrirModalUrls(entidadId) {
    if (!get().modelo.entidades[entidadId]) return;
    set({ modalUrlsAbierto: entidadId, menuPrincipalAbierto: false, mensaje: null });
  },

  cerrarModalUrls() {
    set({ modalUrlsAbierto: null });
  },

  agregarUrlAEntidad(entidadId, url) {
    const { modelo } = get();
    const resultado = agregarUrl(modelo, entidadId, {
      id: `url-${modelo.nextSeq}`,
      tipo: url.tipo,
      url: url.url,
    });
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, { ...resultado.value, nextSeq: modelo.nextSeq + 1 }, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  eliminarUrlDeEntidad(entidadId, urlId) {
    const { modelo } = get();
    const resultado = eliminarUrl(modelo, entidadId, urlId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  reordenarUrlsEntidad(entidadId, urlIds) {
    const { modelo } = get();
    const resultado = reordenarUrls(modelo, entidadId, urlIds);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  designarEstadoComo(estadoId, designacion) {
    const { modelo, seleccionId } = get();
    const acciones: Record<DesignacionEstado, (m: Modelo, id: Id) => ReturnType<typeof designarInicial>> = {
      inicial: designarInicial,
      final: designarFinal,
      default: designarDefault,
      current: designarCurrent,
    };
    const resultado = acciones[designacion](modelo, estadoId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  quitarDesignacionEstado(estadoId, designacion) {
    const { modelo, seleccionId } = get();
    const resultado = quitarDesignacion(modelo, estadoId, designacion);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  suprimirEstadoPorId(estadoId) {
    const { modelo, seleccionId } = get();
    const resultado = suprimirEstado(modelo, estadoId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: "Estado suprimido" });
  },

  restaurarEstadoPorId(estadoId) {
    const { modelo, seleccionId } = get();
    const resultado = restaurarEstado(modelo, estadoId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  abrirModalDuracion(estadoId) {
    if (!get().modelo.estados[estadoId]) return;
    set({ modalDuracionAbierto: estadoId, mensaje: null });
  },

  cerrarModalDuracion() {
    set({ modalDuracionAbierto: null });
  },

  fijarDuracionEstado(estadoId, duracion) {
    const { modelo, seleccionId } = get();
    const resultado = fijarDuracion(modelo, estadoId, duracion);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, modalDuracionAbierto: null, mensaje: null });
  },

  quitarDuracionEstado(estadoId) {
    const { modelo, seleccionId } = get();
    const resultado = quitarDuracion(modelo, estadoId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, modalDuracionAbierto: null, mensaje: null });
  },

  fijarLayoutEstadosEntidad(entidadId, layout) {
    const { modelo } = get();
    const entidad = modelo.entidades[entidadId];
    if (!entidad || entidad.tipo !== "objeto") return;
    const siguiente: Modelo = {
      ...modelo,
      entidades: {
        ...modelo.entidades,
        [entidadId]: { ...entidad, layoutEstados: layout },
      },
    };
    commitModelo(set, modelo, siguiente, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  toggleAliasVisibles() {
    const { uiAliasVisibles, uiDescripcionesVisibles, modelo } = get();
    const aliasVisibles = !uiAliasVisibles;
    fijarOpcionesProyeccionGlobal({ aliasVisibles, descripcionesVisibles: uiDescripcionesVisibles });
    set({ uiAliasVisibles: aliasVisibles, modelo: { ...modelo } });
  },

  toggleDescripcionesVisibles() {
    const { uiAliasVisibles, uiDescripcionesVisibles, modelo } = get();
    const descripcionesVisibles = !uiDescripcionesVisibles;
    fijarOpcionesProyeccionGlobal({ aliasVisibles: uiAliasVisibles, descripcionesVisibles });
    set({ uiDescripcionesVisibles: descripcionesVisibles, modelo: { ...modelo } });
  },

  moverEntidad(id, x, y) {
    const { modelo, opdActivoId } = get();
    const resultado = moverAparienciaEntidad(modelo, opdActivoId, id, { x, y });
    if (resultado.ok) commitModelo(set, modelo, resultado.value);
  },

  moverApariencia(aparienciaId, x, y) {
    const { modelo, opdActivoId } = get();
    const resultado = moverAparienciaPorId(modelo, opdActivoId, aparienciaId, { x, y });
    if (resultado.ok) commitModelo(set, modelo, resultado.value);
  },

  reordenarSubprocesoEnTimeline(opdId, aparienciaId, nuevaY) {
    const { modelo } = get();
    const validado = validarSubprocesoTimeline(modelo, opdId, aparienciaId);
    if (!validado.ok) {
      set({ mensaje: validado.error });
      return;
    }
    if (!Number.isFinite(nuevaY)) {
      set({ mensaje: "Y de timeline inválida" });
      return;
    }
    const { apariencia, contorno } = validado;
    const y = limitar(nuevaY, contorno.y, contorno.y + contorno.height - apariencia.height);
    const resultado = moverAparienciaPorId(modelo, opdId, aparienciaId, { x: apariencia.x, y });
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: apariencia.entidadId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  actualizarVerticesEnlace(aparienciaEnlaceId, vertices) {
    const { modelo, opdActivoId } = get();
    const resultado = actualizarVerticesEnlaceOp(modelo, opdActivoId, aparienciaEnlaceId, vertices);
    if (resultado.ok) commitModelo(set, modelo, resultado.value);
  },

  ajustarMultiplicidadSeleccionada(lado, texto) {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) return;
    const resultado = ajustarMultiplicidad(modelo, enlaceSeleccionId, lado, texto);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: null,
    });
  },

  apuntarExtremoEnlaceSeleccionado(lado, extremo) {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) return;
    const resultado = apuntarExtremoEnlace(modelo, enlaceSeleccionId, lado, extremo);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    if (resultado.value === modelo) return;
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: null,
    });
  },

  reanclarEnlaceExternoDerivado(aparienciaEnlaceId, nuevoEndpointEntidadId) {
    const { modelo, opdActivoId, enlaceSeleccionId } = get();
    const resultado = reanclarEnlaceExternoDerivadoOp(modelo, opdActivoId, aparienciaEnlaceId, nuevoEndpointEntidadId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: "Enlace derivado reanclado",
    });
  },

  splitEffectSeleccionado() {
    const { modelo, opdActivoId, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) {
      set({ mensaje: "Selecciona un enlace de efecto para splittear" });
      return;
    }
    const resultado = splitEffectEnPar(modelo, opdActivoId, enlaceSeleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: "Efecto descompuesto en consumo + resultado intermedio",
    });
  },

  volverEnlaceExternoDerivadoAAutomatico(aparienciaEnlaceId) {
    const { modelo, opdActivoId, enlaceSeleccionId } = get();
    const resultado = volverEnlaceExternoDerivadoAAutomaticoOp(modelo, opdActivoId, aparienciaEnlaceId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const enlaceActual = enlaceSeleccionId ? resultado.value.enlaces[enlaceSeleccionId] : undefined;
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId: enlaceActual ? enlaceSeleccionId : null,
      modoEnlace: null,
      mensaje: "Enlace derivado automatico",
    });
  },

  alternarOperadorAbanicoSeleccionado(operador) {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) {
      set({ mensaje: "Selecciona un enlace para alternar el operador del abanico" });
      return;
    }
    const abanico = abanicoDeEnlace(modelo, enlaceSeleccionId);
    if (!abanico) {
      set({ mensaje: "El enlace no pertenece a un abanico" });
      return;
    }
    const resultado = alternarOperadorAbanicoOp(modelo, abanico.id, operador);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { mensaje: `Operador actualizado a ${operador}` });
  },

  quitarRamaDeAbanicoSeleccionado() {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) {
      set({ mensaje: "Selecciona un enlace para quitar del abanico" });
      return;
    }
    const abanico = abanicoDeEnlace(modelo, enlaceSeleccionId);
    if (!abanico) {
      set({ mensaje: "El enlace no pertenece a un abanico" });
      return;
    }
    const resultado = quitarRamaDeAbanicoOp(modelo, abanico.id, enlaceSeleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { mensaje: "Rama removida del abanico" });
  },

  disolverAbanicoSeleccionado() {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) {
      set({ mensaje: "Selecciona un enlace del abanico a disolver" });
      return;
    }
    const abanico = abanicoDeEnlace(modelo, enlaceSeleccionId);
    if (!abanico) {
      set({ mensaje: "El enlace no pertenece a un abanico" });
      return;
    }
    const resultado = disolverAbanicoOp(modelo, abanico.id);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { mensaje: "Abanico disuelto" });
  },

  crearAutoInvocacionSeleccionada() {
    const { modelo, opdActivoId, seleccionId } = get();
    if (!seleccionId) {
      set({ mensaje: "Selecciona un proceso para crear auto-invocacion" });
      return;
    }
    const entidad = modelo.entidades[seleccionId];
    if (!entidad || entidad.tipo !== "proceso") {
      set({ mensaje: "Selecciona un proceso para crear auto-invocacion" });
      return;
    }
    const resultado = crearAutoInvocacion(modelo, opdActivoId, seleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const enlaceId = enlaceNuevo(modelo, resultado.value);
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId: enlaceId,
      modoEnlace: null,
      mensaje: "Auto-invocacion creada",
    });
  },

  aplicarModificadorEnlaceSeleccionado(modificador) {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) {
      set({ mensaje: "Selecciona un enlace para aplicar modificador" });
      return;
    }
    const resultado = aplicarModificador(modelo, enlaceSeleccionId, modificador);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: null,
    });
  },

  quitarModificadorEnlaceSeleccionado() {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) return;
    const resultado = quitarModificador(modelo, enlaceSeleccionId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: null,
    });
  },

  definirProbabilidadEventoSeleccionada(probabilidad) {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) return;
    const resultado = definirProbabilidad(modelo, enlaceSeleccionId, probabilidad);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: null,
    });
  },

  definirDemoraInvocacionSeleccionada(demora) {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) return;
    const resultado = definirDemora(modelo, enlaceSeleccionId, demora);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: null,
    });
  },

  renombrarEtiquetaEnlaceSeleccionado(etiqueta) {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) return;
    const resultado = renombrarEtiquetaEnlace(modelo, enlaceSeleccionId, etiqueta);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: null,
    });
  },

  definirRutaEtiquetaSeleccionada(etiqueta) {
    const { modelo, enlaceSeleccionId } = get();
    if (!enlaceSeleccionId) return;
    const resultado = definirRutaEtiqueta(modelo, enlaceSeleccionId, etiqueta);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, {
      seleccionId: null,
      enlaceSeleccionId,
      modoEnlace: null,
      mensaje: null,
    });
  },

  eliminarSeleccion() {
    const { modelo, opdActivoId, seleccionados, seleccionId, enlaceSeleccionId } = get();
    const ids = seleccionados.length > 0 ? seleccionados : [seleccionId, enlaceSeleccionId].filter((id): id is Id => !!id);
    if (ids.length === 0) {
      set({ mensaje: "Selecciona una entidad o enlace para eliminar" });
      return;
    }
    const resultado = eliminarBatch(modelo, ids, opdActivoId);
    if (resultado.ok) {
      commitModelo(set, modelo, resultado.value, { seleccionId: null, seleccionados: [], modoSeleccion: "simple", enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
    } else {
      set({ mensaje: resultado.error });
    }
  },

  setSeleccion(ids) {
    const estado = seleccionSet({ seleccionados: get().seleccionados, modo: get().modoSeleccion }, ids);
    set(estadoSeleccionDesdeIds(get().modelo, estado.seleccionados, estado.modo));
  },

  agregarASeleccion(id) {
    const estado = seleccionAgregar({ seleccionados: get().seleccionados, modo: get().modoSeleccion }, id);
    set(estadoSeleccionDesdeIds(get().modelo, estado.seleccionados, estado.modo));
  },

  quitarDeSeleccion(id) {
    const estado = seleccionQuitar({ seleccionados: get().seleccionados, modo: get().modoSeleccion }, id);
    set(estadoSeleccionDesdeIds(get().modelo, estado.seleccionados, estado.modo));
  },

  toggleSeleccion(id) {
    const estado = seleccionToggle({ seleccionados: get().seleccionados, modo: get().modoSeleccion }, id);
    set(estadoSeleccionDesdeIds(get().modelo, estado.seleccionados, estado.modo));
  },

  vaciarSeleccion() {
    const estado = seleccionVacia();
    set({ seleccionados: estado.seleccionados, modoSeleccion: estado.modo, seleccionId: null, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  seleccionarTodoEnOpd() {
    const { modelo, opdActivoId } = get();
    const ids = todasDelOpd(modelo, opdActivoId);
    if (ids.length === 0) return;
    const estado = seleccionSet({ seleccionados: [], modo: "simple" }, ids);
    set(estadoSeleccionDesdeIds(modelo, estado.seleccionados, estado.modo));
  },

  nudgeSeleccion(dx, dy) {
    const { modelo, opdActivoId, seleccionados } = get();
    if (seleccionados.length === 0) return;
    const movidas = nudgeApariencias(modelo, opdActivoId, seleccionados, dx, dy);
    if (!movidas.ok) {
      set({ mensaje: movidas.error });
      return;
    }
    const enlacesMovidos = nudgeEnlaces(movidas.value, opdActivoId, seleccionados, dx, dy);
    if (!enlacesMovidos.ok) {
      set({ mensaje: enlacesMovidos.error });
      return;
    }
    commitModelo(set, modelo, enlacesMovidos.value, { seleccionados: [...seleccionados], ...estadoSeleccionDesdeIds(enlacesMovidos.value, seleccionados, get().modoSeleccion), mensaje: null });
  },

  alinearSeleccionEnlaces(direccion) {
    const { modelo, opdActivoId, seleccionados } = get();
    const op = direccion === "izquierda"
      ? alinearEnlacesIzquierda
      : direccion === "derecha"
        ? alinearEnlacesDerecha
        : direccion === "arriba"
          ? alinearEnlacesArriba
          : alinearEnlacesAbajo;
    const resultado = op(modelo, opdActivoId, seleccionados);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionados: [...seleccionados], ...estadoSeleccionDesdeIds(resultado.value, seleccionados, get().modoSeleccion), mensaje: "Enlaces alineados" });
  },

  conectarSeleccionAlTodo(todoApariencia, tipo) {
    const { modelo, opdActivoId, seleccionados } = get();
    const partes = seleccionados.filter((id) => id !== todoApariencia);
    const resultado = conectarMultiAlTodo(modelo, opdActivoId, partes, todoApariencia, tipo);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { mensaje: "Selección conectada al todo" });
  },

  aplicarEstiloASeleccion(estilo) {
    const { modelo, opdActivoId, seleccionados } = get();
    if (seleccionados.length === 0) return;
    const estiloApariencia = estilo as Partial<EstiloApariencia>;
    const estiloEnlace = estilo as Partial<EnlaceEstilo>;
    const aplicaApariencias = "fill" in estiloApariencia || "borderColor" in estiloApariencia || "fontFamily" in estiloApariencia || "fontSize" in estiloApariencia || "fontWeight" in estiloApariencia || "fontStyle" in estiloApariencia || "textColor" in estiloApariencia || "textAnchor" in estiloApariencia;
    const aplicaEnlaces = "color" in estiloEnlace || "strokeWidth" in estiloEnlace || "dashArray" in estiloEnlace;
    let siguiente = modelo;
    if (aplicaApariencias) {
      const resultado = aplicarEstiloApariencias(siguiente, opdActivoId, seleccionados, estiloApariencia);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      siguiente = resultado.value;
    }
    if (aplicaEnlaces) {
      const resultado = aplicarEstiloEnlaces(siguiente, opdActivoId, seleccionados, estiloEnlace);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      siguiente = resultado.value;
    }
    commitModelo(set, modelo, siguiente, { seleccionados: [...seleccionados], ...estadoSeleccionDesdeIds(siguiente, seleccionados, get().modoSeleccion), mensaje: null });
  },

  copiarSeleccionAlBuffer() {
    const { modelo, opdActivoId, seleccionados } = get();
    if (seleccionados.length === 0) return;
    set({ portapapelesVisual: copiarSeleccion(modelo, opdActivoId, seleccionados), mensaje: "Selección copiada" });
  },

  pegarBufferEnOpdActivo() {
    const { modelo, opdActivoId, portapapelesVisual } = get();
    if (!portapapelesVisual) {
      set({ mensaje: "No hay selección copiada" });
      return;
    }
    const resultado = pegarSeleccion(modelo, opdActivoId, portapapelesVisual, { x: 24, y: 24 });
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value.modelo, {
      portapapelesVisual: resultado.value.buffer,
      ...estadoSeleccionDesdeIds(resultado.value.modelo, resultado.value.seleccionados, resultado.value.seleccionados.length > 1 ? "multi" : "simple"),
      mensaje: "Selección pegada",
    });
  },

  exportarJson() {
    return exportarModelo(get().modelo);
  },

  importarJson(json) {
    const resultado = hidratarModelo(json);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    resetHistorial(resultado.value);
    set(estadoModelo(resultado.value, {
      opdActivoId: resultado.value.opdRaizId,
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      modoCreacion: null,
      modeloPersistidoId: null,
      descripcionModeloLocal: "",
      workspaceLocal: workspaceDesdeModelo(resultado.value, null),
      mensaje: "Modelo importado",
    }));
  },

  abrirPestanaNueva() {
    const pestana = crearPestanaNueva();
    activarPestanaNueva(set, get, pestana, "Nueva pestana");
  },

  abrirPestanaConAsistente() {
    set({
      asistente: {
        etapaActual: 0,
        datos: datosAsistenteVacio(),
        cancelado: false,
      },
      menuPrincipalAbierto: false,
      mensaje: null,
    });
  },

  abrirPestanaImportandoJson(json) {
    const resultado = hidratarModelo(json);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const pestana = crearPestanaDesdeModelo(resultado.value, {
      modeloId: null,
      nombre: "Modelo (No guardado)",
      cargadoDesde: "importado",
      dirty: false,
    });
    activarPestanaNueva(set, get, pestana, "Modelo importado en pestana");
  },

  abrirPestanaConModelo(modeloId) {
    const cargado = cargarModeloLocal(modeloId);
    if (!cargado.ok) {
      set({ mensaje: cargado.error, modelosGuardados: listarModelosGuardadosSeguro() });
      return;
    }
    const resultado = hidratarModelo(cargado.value.json);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const pestana = crearPestanaDesdeModelo(resultado.value, {
      modeloId: cargado.value.id,
      nombre: cargado.value.nombre,
      cargadoDesde: "persistido",
      dirty: false,
      descripcion: cargado.value.descripcion,
    });
    activarPestanaNueva(set, get, pestana, `Modelo abierto en pestana: ${cargado.value.nombre}`);
  },

  duplicarPestana(id) {
    const resultado = duplicarPestanaEstado({ pestanas: get().pestanasAbiertas, activa: get().pestanaActivaId }, id);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    activarEstadoPestanas(set, resultado.value, "Pestana duplicada");
  },

  cerrarPestana(id, opts) {
    const resultado = cerrarPestanaEstado({ pestanas: get().pestanasAbiertas, activa: get().pestanaActivaId }, id, opts);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    activarEstadoPestanas(set, resultado.value, "Pestana cerrada");
  },

  cambiarPestanaActiva(id) {
    const actual = cambiarPestanaActivaEstado({ pestanas: get().pestanasAbiertas, activa: get().pestanaActivaId }, id);
    activarEstadoPestanas(set, actual, null);
  },

  reordenarPestanas(idsOrdenados) {
    const resultado = reordenarPestanasEstado({ pestanas: get().pestanasAbiertas, activa: get().pestanaActivaId }, idsOrdenados);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    set({ pestanasAbiertas: resultado.value.pestanas, mensaje: null });
  },

  renombrarPestana(id, etiqueta) {
    set({
      pestanasAbiertas: get().pestanasAbiertas.map((pestana) => (
        pestana.id === id ? { ...pestana, etiqueta: etiqueta.trim() || "Modelo (No guardado)" } : pestana
      )),
      mensaje: null,
    });
  },

  listarModelosGuardados() {
    const listado = listarModelosLocales();
    if (!listado.ok) {
      set({ modelosGuardados: [], mensaje: listado.error });
      return;
    }
    set({ modelosGuardados: listado.value });
  },

  guardarLocal() {
    const { modelo, modeloPersistidoId, descripcionModeloLocal, indice } = get();
    if (!modeloPersistidoId) {
      get().abrirGuardarComo();
      return;
    }
    const carpetaId = indice.modelos.find((m) => m.id === modeloPersistidoId)?.carpetaId ?? null;
    const json = exportarModelo(modelo, carpetaId);
    const guardado = guardarModeloLocal({
      id: modeloPersistidoId,
      nombre: modelo.nombre,
      descripcion: descripcionModeloLocal,
      json,
      ...(carpetaId !== undefined ? { carpetaId } : {}),
    });
    if (!guardado.ok) {
      set({ mensaje: guardado.error });
      return;
    }
    let versiones = guardado.value.versiones ?? [];
    if (guardado.value.crearVersionAlGuardar) {
      try {
        const version = crearVersion(modelo, { descripcion: "Guardado manual" });
        versiones = [version, ...versiones];
        actualizarMetadataModeloLocal(guardado.value.id, { versiones });
        const indiceActualizado = {
          ...indice,
          modelos: indice.modelos.map((item) =>
            item.id === guardado.value.id ? { ...item, versiones } : item,
          ),
        };
        escribirIndiceWorkspace(indiceActualizado);
        set({ indice: indiceActualizado });
      } catch {
        set({ mensaje: "Modelo guardado; no se pudo crear versión" });
      }
    }
    // Snapshot para dirty tracking sin carpetaId (normalizado)
    snapshotGuardado = exportarModelo(modelo);
    set(estadoModelo(modelo, {
      mensaje: "Modelo guardado exitosamente",
      dirty: false,
      modeloPersistidoId: guardado.value.id,
      descripcionModeloLocal: guardado.value.descripcion,
      modelosGuardados: listarModelosGuardadosSeguro(),
      workspaceLocal: workspaceDesdeModelo(modelo, guardado.value.id, guardado.value.descripcion, carpetaId),
    }));
  },

  cargarLocal(id) {
    const modeloId = id ?? get().modelosGuardados[0]?.id ?? listarModelosGuardadosSeguro()[0]?.id;
    if (!modeloId) {
      set({ mensaje: "No hay modelos guardados" });
      return;
    }
    const cargado = cargarModeloLocal(modeloId);
    if (!cargado.ok) {
      set({ mensaje: cargado.error, modelosGuardados: listarModelosGuardadosSeguro() });
      return;
    }
    const resultado = hidratarModelo(cargado.value.json);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    // Actualizar última apertura en el modelo
    guardarModeloLocal({
      id: cargado.value.id,
      nombre: cargado.value.nombre,
      descripcion: cargado.value.descripcion,
      json: cargado.value.json,
      ultimaApertura: new Date().toISOString(),
      ...(cargado.value.carpetaId !== undefined ? { carpetaId: cargado.value.carpetaId } : {}),
    });
    // Actualizar índice de workspace
    const indice = leerIndiceWorkspace();
    const carpetaId = cargado.value.carpetaId ?? null;
    const nuevoIndice: WorkspaceIndice = {
      ...indice,
      modelos: [
        ...indice.modelos.filter((m) => m.id !== modeloId),
        {
          ...(indice.modelos.find((m) => m.id === modeloId) ?? { id: modeloId, carpetaId }),
          id: modeloId,
          carpetaId,
        },
      ],
      recientes: [modeloId, ...indice.recientes.filter((r) => r !== modeloId)].slice(0, 10),
    };
    escribirIndiceWorkspace(nuevoIndice);
    resetHistorial(resultado.value);
    const updatedGuardados = listarModelosGuardadosSeguro();
    set(estadoModelo(resultado.value, {
      opdActivoId: resultado.value.opdRaizId,
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      modeloPersistidoId: cargado.value.id,
      descripcionModeloLocal: cargado.value.descripcion,
      modelosGuardados: updatedGuardados,
      modelosRecientes: modelosRecientesDeIndice(nuevoIndice, updatedGuardados),
      indice: nuevoIndice,
      dialogoCargarModeloAbierto: false,
      carpetaActualId: null,
      workspaceLocal: workspaceDesdeModelo(resultado.value, cargado.value.id, cargado.value.descripcion, carpetaId),
      mensaje: `Modelo cargado: ${cargado.value.nombre}`,
    }));
  },

  borrarLocal(id) {
    const borrado = borrarModeloLocal(id);
    if (!borrado.ok) {
      set({ mensaje: borrado.error });
      return;
    }
    const extra: Partial<OpmStore> = {
      modelosGuardados: listarModelosGuardadosSeguro(),
      mensaje: "Modelo local borrado",
    };
    if (get().modeloPersistidoId === id) {
      snapshotGuardado = "";
      extra.modeloPersistidoId = null;
      extra.descripcionModeloLocal = "";
      extra.dirty = true;
      extra.workspaceLocal = workspaceDesdeModelo(get().modelo, null);
    }
    set(extra);
  },

  cargarDemo() {
    const modelo = crearDemo();
    resetHistorial(modelo);
    set(estadoModelo(modelo, {
      opdActivoId: modelo.opdRaizId,
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      modeloPersistidoId: null,
      descripcionModeloLocal: "",
      carpetaActualId: null,
      workspaceLocal: workspaceDesdeModelo(modelo, null),
      mensaje: "Demo cargado",
    }));
  },

  // ── L6: enlaces, estilo, tabla ─────────────────────────────────

  fijarMultiplicidadEnlace(enlaceId, lado, valor) {
    const { modelo } = get();
    const resultado = lado === "origen"
      ? fijarMultiplicidadOrigen(modelo, enlaceId, valor)
      : fijarMultiplicidadDestino(modelo, enlaceId, valor);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: null, enlaceSeleccionId: enlaceId, modoEnlace: null, mensaje: null });
  },

  quitarMultiplicidadEnlace(enlaceId, lado) {
    const { modelo } = get();
    const resultado = quitarMultiplicidad(modelo, enlaceId, lado);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: null, enlaceSeleccionId: enlaceId, modoEnlace: null, mensaje: null });
  },

  aplicarEstiloEnlaceAccion(enlaceId, estilo) {
    const { modelo } = get();
    const resultado = aplicarEstiloEnlace(modelo, enlaceId, estilo);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: null, enlaceSeleccionId: enlaceId, modoEnlace: null, mensaje: null });
  },

  resetEstiloEnlaceAccion(enlaceId) {
    const { modelo } = get();
    const resultado = resetEstiloEnlace(modelo, enlaceId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: null, enlaceSeleccionId: enlaceId, modoEnlace: null, mensaje: null });
  },

  copiarEstiloEnlaceAlPortapapeles(enlaceId) {
    const { modelo } = get();
    const copiado = copiarEstiloEnlace(modelo, enlaceId);
    set({ enlaceEstiloPortapapeles: copiado, mensaje: copiado ? "Estilo copiado" : "Sin estilo que copiar" });
  },

  pegarEstiloEnlaceDesdePortapapeles(enlaceId) {
    const { modelo, enlaceEstiloPortapapeles } = get();
    if (!enlaceEstiloPortapapeles) {
      set({ mensaje: "No hay estilo de enlace en el portapapeles" });
      return;
    }
    const resultado = pegarEstiloEnlace(modelo, enlaceId, enlaceEstiloPortapapeles);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { seleccionId: null, enlaceSeleccionId: enlaceId, modoEnlace: null, mensaje: "Estilo pegado" });
  },

  aplicarEstiloTextoAccion(aparienciaId, estilo) {
    const { modelo, opdActivoId } = get();
    const opd = modelo.opds[opdActivoId];
    if (!opd?.apariencias[aparienciaId]) {
      set({ mensaje: "Apariencia no existe" });
      return;
    }
    const resultado = aplicarEstiloApariencia(modelo, opdActivoId, aparienciaId, estilo);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const entidadId = opd.apariencias[aparienciaId]?.entidadId ?? null;
    commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  resetEstiloTextoAccion(aparienciaId) {
    const { modelo, opdActivoId } = get();
    const opd = modelo.opds[opdActivoId];
    if (!opd?.apariencias[aparienciaId]) {
      set({ mensaje: "Apariencia no existe" });
      return;
    }
    // Solo resetea campos de texto, preserva fill/border
    const resultado = aplicarEstiloApariencia(modelo, opdActivoId, aparienciaId, { fontFamily: undefined, fontSize: undefined, fontWeight: undefined, fontStyle: undefined, textColor: undefined, textAnchor: undefined } as Record<string, undefined> as unknown as EstiloApariencia);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const entidadId = opd.apariencias[aparienciaId]?.entidadId ?? null;
    commitModelo(set, modelo, resultado.value, { seleccionId: entidadId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  insertarVerticeAccion(aparienciaEnlaceId, posicion) {
    const { modelo } = get();
    const resultado = insertarVerticeApariencia(modelo, aparienciaEnlaceId, posicion);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { mensaje: null });
  },

  reposicionarVerticeAccion(aparienciaEnlaceId, indice, posicion) {
    const { modelo } = get();
    const resultado = reposicionarVerticeApariencia(modelo, aparienciaEnlaceId, indice, posicion);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { mensaje: null });
  },

  reanclarExtremoAccion(enlaceId, lado, nuevoExtremo) {
    const { modelo } = get();
    const resultado = reanclarExtremoEnlaceOp(modelo, enlaceId, lado, nuevoExtremo);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value.modelo, { seleccionId: null, enlaceSeleccionId: enlaceId, modoEnlace: null, mensaje: resultado.value.advertencia ?? null });
  },

  borrarEnlacesEnLote(enlaceIds) {
    const { modelo } = get();
    if (enlaceIds.length === 0) return;
    let actual = modelo;
    for (const enlaceId of enlaceIds) {
      const res = eliminarEnlace(actual, enlaceId);
      if (!res.ok) {
        set({ mensaje: res.error });
        return;
      }
      actual = res.value;
    }
    commitModelo(set, modelo, actual, { seleccionId: null, enlaceSeleccionId: null, modoEnlace: null, mensaje: `${enlaceIds.length} enlaces eliminados` });
  },

  abrirTablaEnlaces() {
    set({ tablaEnlacesAbierta: true, menuPrincipalAbierto: false });
  },

  cerrarTablaEnlaces() {
    set({ tablaEnlacesAbierta: false });
  },

  fijarFiltroTablaEnlaces(tipo) {
    set({ tablaEnlacesFiltroTipo: tipo });
  },

  fijarOrdenTablaEnlaces(columna) {
    const { tablaEnlacesOrdenColumna, tablaEnlacesOrdenDireccion } = get();
    if (tablaEnlacesOrdenColumna === columna) {
      set({
        tablaEnlacesOrdenDireccion: tablaEnlacesOrdenDireccion === "asc" ? "desc" : "asc",
      });
    } else {
      set({ tablaEnlacesOrdenColumna: columna, tablaEnlacesOrdenDireccion: "asc" });
    }
  },

  navegarAEnlaceDesdeTabla(enlaceId) {
    const { modelo } = get();
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace) {
      set({ mensaje: `Enlace no existe: ${enlaceId}` });
      return;
    }
    // Encontrar el primer OPD donde el enlace tiene apariencia
    for (const opdId of Object.keys(modelo.opds)) {
      const opd = modelo.opds[opdId];
      if (!opd) continue;
      for (const ae of Object.values(opd.enlaces)) {
        if (ae.enlaceId === enlaceId) {
          set({
            opdActivoId: opdId,
            seleccionId: null,
            enlaceSeleccionId: enlaceId,
            modoEnlace: null,
            tablaEnlacesAbierta: false,
            mensaje: null,
          });
          return;
        }
      }
    }
    set({ mensaje: "Enlace sin apariencia en ningún OPD" });
  },

  // ── Carpetas (L4) ─────────────────────────────────────────────

  crearCarpetaEnActual(nombre) {
    const { indice, carpetaActualId } = get();
    const resultado = crearCarpetaEnIndice(indice, nombre, carpetaActualId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error ?? "No se pudo crear la carpeta" });
      return;
    }
    const nuevoIndice = resultado.value.indice;
    escribirIndiceWorkspace(nuevoIndice);
    set({ indice: nuevoIndice, mensaje: null });
  },

  renombrarCarpetaEnIndice(carpetaId, nombre) {
    const { indice } = get();
    const resultado = renombrarCarpetaEnIndiceOp(indice, carpetaId, nombre);
    if (!resultado.ok) {
      set({ mensaje: resultado.error ?? "No se pudo renombrar la carpeta" });
      return;
    }
    escribirIndiceWorkspace(resultado.value);
    set({ indice: resultado.value, mensaje: null });
  },

  async eliminarCarpetaEnIndice(carpetaId, opciones) {
    const { indice, carpetaActualId } = get();
    const carpeta = indice.carpetas.find((c) => c.id === carpetaId);
    const nombre = carpeta?.nombre ?? carpetaId;
    if (!opciones.cascada) {
      const hijos = listarHijosDeCarpeta(indice, carpetaId);
      const total = hijos.carpetas.length + hijos.modelos.length;
      if (total > 0) {
        if (typeof globalThis.confirm === "function") {
          const confirmado = globalThis.confirm(
            `La carpeta "${nombre}" contiene ${total} elemento${total !== 1 ? "s" : ""}.\n\n` +
            `Aceptar para eliminar todo en cascada (modelos pasarán a raíz).\nCancelar para mover primero el contenido.`,
          );
          if (!confirmado) {
            set({ mensaje: "Eliminación cancelada" });
            return;
          }
        }
        opciones = { cascada: true };
      }
    }
    const resultado = eliminarCarpetaEnIndiceOp(indice, carpetaId, opciones);
    if (!resultado.ok) {
      set({ mensaje: resultado.error ?? "No se pudo eliminar la carpeta" });
      return;
    }
    escribirIndiceWorkspace(resultado.value);
    set({
      indice: resultado.value,
      carpetaActualId: resultado.value.carpetas.some((c) => c.id === carpetaActualId) ? carpetaActualId : null,
      mensaje: `Carpeta "${nombre}" eliminada`,
    });
  },

  abrirCarpeta(carpetaId) {
    set({ carpetaActualId: carpetaId });
  },

  moverModeloACarpetaEnIndice(modeloId, carpetaId) {
    const { indice } = get();
    const resultado = moverModeloACarpetaEnIndiceOp(indice, modeloId, carpetaId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error ?? "No se pudo mover el modelo" });
      return;
    }
    escribirIndiceWorkspace(resultado.value);
    set({ indice: resultado.value, mensaje: null });
  },

  cortarModelo(modeloId) {
    const resultado = cortarModeloWorkspace(get().indice, modeloId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    set({ portapapelesWorkspace: resultado.value, mensaje: "Modelo cortado" });
  },

  cortarCarpeta(carpetaId) {
    const resultado = cortarCarpetaWorkspace(get().indice, carpetaId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    set({ portapapelesWorkspace: resultado.value, mensaje: "Carpeta cortada" });
  },

  cancelarPortapapelesWorkspace() {
    set({ portapapelesWorkspace: null, mensaje: null });
  },

  pegarEn(carpetaDestinoId) {
    const { indice, portapapelesWorkspace } = get();
    if (!portapapelesWorkspace) {
      set({ mensaje: "No hay elemento cortado" });
      return;
    }
    if (Date.now() - Date.parse(portapapelesWorkspace.cortadoEn) > PORTAPAPELES_WORKSPACE_TTL_MS) {
      set({ portapapelesWorkspace: null, mensaje: "El portapapeles de workspace caducó" });
      return;
    }
    const resultado = portapapelesWorkspace.tipo === "modelo"
      ? pegarModelo(indice, portapapelesWorkspace, carpetaDestinoId)
      : pegarCarpeta(indice, portapapelesWorkspace, carpetaDestinoId);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const indicePersistido = resultado.value;
    escribirIndiceWorkspace(indicePersistido);
    if (portapapelesWorkspace.tipo === "modelo") {
      actualizarMetadataModeloLocal(portapapelesWorkspace.itemId, { carpetaId: carpetaDestinoId });
    }
    set({
      indice: indicePersistido,
      modelosGuardados: listarModelosGuardadosSeguro(),
      portapapelesWorkspace: null,
      mensaje: portapapelesWorkspace.tipo === "modelo" ? "Modelo movido" : "Carpeta movida",
    });
  },

  moverModeloDirecto(modeloId, destino) {
    const resultado = moverModelo(get().indice, modeloId, destino);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    escribirIndiceWorkspace(resultado.value);
    actualizarMetadataModeloLocal(modeloId, { carpetaId: destino });
    const modelosGuardados = listarModelosGuardadosSeguro();
    set({
      indice: sincronizarIndiceConModelosGuardados(modelosGuardados, resultado.value),
      modelosGuardados,
      mensaje: "Modelo movido",
    });
  },

  moverCarpetaDirecto(carpetaId, destino) {
    const resultado = moverCarpeta(get().indice, carpetaId, destino);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    escribirIndiceWorkspace(resultado.value);
    set({ indice: resultado.value, mensaje: "Carpeta movida" });
  },

  archivarModeloActual() {
    const id = get().modeloPersistidoId;
    if (!id) {
      set({ mensaje: "Guarda el modelo antes de archivarlo" });
      return;
    }
    get().archivarModeloPorId(id);
  },

  archivarModeloPorId(modeloId) {
    const ahora = new Date().toISOString();
    const indice = archivarModeloEnIndiceOp(get().indice, modeloId, ahora);
    escribirIndiceWorkspace(indice);
    actualizarMetadataModeloLocal(modeloId, { archivado: true, archivadoEn: ahora });
    const modelosGuardados = listarModelosGuardadosSeguro();
    set({
      indice: sincronizarIndiceConModelosGuardados(modelosGuardados, indice),
      modelosGuardados,
      mensaje: "Modelo archivado",
    });
  },

  restaurarModeloPorId(modeloId) {
    const indice = restaurarModeloEnIndiceOp(get().indice, modeloId);
    escribirIndiceWorkspace(indice);
    actualizarMetadataModeloLocal(modeloId, { archivado: false });
    const modelosGuardados = listarModelosGuardadosSeguro();
    set({
      indice: sincronizarIndiceConModelosGuardados(modelosGuardados, indice),
      modelosGuardados,
      mensaje: "Modelo restaurado",
    });
  },

  archivarCarpetaPorId(carpetaId) {
    const carpeta = get().indice.carpetas.find((item) => item.id === carpetaId);
    if (!carpeta) {
      set({ mensaje: "Carpeta no encontrada" });
      return;
    }
    if (typeof globalThis.confirm === "function" && !globalThis.confirm(`Archivar carpeta "${carpeta.nombre}" y todo su contenido?`)) {
      set({ mensaje: "Archivado cancelado" });
      return;
    }
    const ahora = new Date().toISOString();
    const indice = archivarCarpetaEnIndiceOp(get().indice, carpetaId, ahora);
    escribirIndiceWorkspace(indice);
    for (const modelo of indice.modelos.filter((item) => item.archivado)) {
      actualizarMetadataModeloLocal(modelo.id, { archivado: true, archivadoEn: modelo.archivadoEn ?? ahora });
    }
    const modelosGuardados = listarModelosGuardadosSeguro();
    set({ indice: sincronizarIndiceConModelosGuardados(modelosGuardados, indice), modelosGuardados, mensaje: "Carpeta archivada" });
  },

  restaurarCarpetaPorId(carpetaId) {
    const indice = restaurarCarpetaEnIndiceOp(get().indice, carpetaId);
    escribirIndiceWorkspace(indice);
    for (const modelo of indice.modelos) {
      if (!modelo.archivado) actualizarMetadataModeloLocal(modelo.id, { archivado: false });
    }
    const modelosGuardados = listarModelosGuardadosSeguro();
    set({ indice: sincronizarIndiceConModelosGuardados(modelosGuardados, indice), modelosGuardados, mensaje: "Carpeta restaurada" });
  },

  async guardarConVersion() {
    await get().crearVersionAhora({ descripcion: "Versión manual" });
    get().guardarLocal();
  },

  async crearVersionAhora(opts) {
    const { modelo, modeloPersistidoId } = get();
    if (!modeloPersistidoId) {
      set({ mensaje: "Guarda el modelo antes de versionarlo" });
      return;
    }
    try {
      const version = crearVersion(modelo, opts);
      const resumen = listarModelosGuardadosSeguro().find((item) => item.id === modeloPersistidoId);
      const versiones = [version, ...(resumen?.versiones ?? [])];
      const actualizado = actualizarMetadataModeloLocal(modeloPersistidoId, { versiones });
      if (!actualizado.ok) {
        set({ mensaje: actualizado.error });
        return;
      }
      const indice = {
        ...get().indice,
        modelos: get().indice.modelos.map((item) =>
          item.id === modeloPersistidoId ? { ...item, versiones } : item,
        ),
      };
      escribirIndiceWorkspace(indice);
      set({
        indice,
        modelosGuardados: listarModelosGuardadosSeguro(),
        mensaje: "Versión creada",
      });
    } catch (error) {
      set({ mensaje: error instanceof Error ? error.message : "No se pudo crear versión" });
    }
  },

  abrirDialogoVersiones(modeloId) {
    set({ dialogoVersionesAbierto: { modeloId }, menuPrincipalAbierto: false });
  },

  cerrarDialogoVersiones() {
    set({ dialogoVersionesAbierto: null });
  },

  async restaurarVersionComoCopia(modeloId, versionId) {
    const resumen = get().modelosGuardados.find((item) => item.id === modeloId);
    const version = resumen?.versiones?.find((item) => item.id === versionId);
    if (!version) {
      set({ mensaje: "Versión no encontrada" });
      return;
    }
    try {
      const restaurado = await restaurarVersion(version.modeloPayloadKey);
      const fecha = version.creadoEn.slice(0, 10);
      const nombre = `${restaurado.nombre} (restaurado ${fecha})`;
      const { archivado: _archivado, archivadoEn: _archivadoEn, versiones: _versiones, ...restauradoActivo } = restaurado;
      const modeloCopia: Modelo = { ...restauradoActivo, id: crearIdModeloLocal(), nombre };
      const carpetaId = get().indice.modelos.find((item) => item.id === modeloId)?.carpetaId ?? null;
      const guardado = guardarModeloLocal({
        nombre,
        descripcion: `Restaurado desde ${version.nombre}`,
        json: exportarModelo(modeloCopia, carpetaId),
        carpetaId,
      });
      if (!guardado.ok) {
        set({ mensaje: guardado.error });
        return;
      }
      const indice = {
        ...get().indice,
        modelos: [...get().indice.modelos, { id: guardado.value.id, carpetaId }],
        recientes: [guardado.value.id, ...get().indice.recientes.filter((id) => id !== guardado.value.id)].slice(0, 10),
      };
      escribirIndiceWorkspace(indice);
      resetHistorial(modeloCopia);
      set(estadoModelo(modeloCopia, {
        opdActivoId: modeloCopia.opdRaizId,
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        modeloPersistidoId: guardado.value.id,
        descripcionModeloLocal: guardado.value.descripcion,
        modelosGuardados: listarModelosGuardadosSeguro(),
        indice,
        dialogoVersionesAbierto: null,
        workspaceLocal: workspaceDesdeModelo(modeloCopia, guardado.value.id, guardado.value.descripcion, carpetaId),
        mensaje: "Versión restaurada como copia",
      }));
    } catch (error) {
      set({ mensaje: error instanceof Error ? error.message : "No se pudo restaurar versión" });
    }
  },

  eliminarVersionPorId(modeloId, versionId) {
    const resumen = get().modelosGuardados.find((item) => item.id === modeloId);
    const versiones = (resumen?.versiones ?? []).filter((version) => version.id !== versionId);
    const indice = eliminarVersion(get().indice, modeloId, versionId);
    actualizarMetadataModeloLocal(modeloId, { versiones });
    escribirIndiceWorkspace(indice);
    set({
      indice,
      modelosGuardados: listarModelosGuardadosSeguro(),
      mensaje: "Versión eliminada",
    });
  },

  abrirDialogoArchivados() {
    set({ dialogoArchivadosAbierto: true, menuPrincipalAbierto: false, modelosGuardados: listarModelosGuardadosSeguro() });
  },

  cerrarDialogoArchivados() {
    set({ dialogoArchivadosAbierto: false });
  },

  abrirDialogoBuscarGlobal() {
    set({ dialogoBuscarGlobalAbierto: true, menuPrincipalAbierto: false });
  },

  cerrarDialogoBuscarGlobal() {
    set({ dialogoBuscarGlobalAbierto: false });
  },

  fijarBusquedaGlobalQuery(q) {
    set((estado) => ({ busquedaGlobal: { ...estado.busquedaGlobal, query: q } }));
  },

  ejecutarBusquedaGlobal() {
    const { indice, modelosGuardados, busquedaGlobal } = get();
    const resultados = buscarGlobal(indice, busquedaGlobal.query, modelosGuardados);
    const siguiente = { ...indice, busquedaGlobalUltima: busquedaGlobal.query };
    escribirIndiceWorkspace(siguiente);
    set({
      indice: siguiente,
      busquedaGlobal: { query: busquedaGlobal.query, resultados, enProgreso: false },
    });
  },

  abrirResultadoBusquedaGlobal(modeloId) {
    get().cargarLocal(modeloId);
    set({ dialogoBuscarGlobalAbierto: false });
  },

  toggleMostrarArchivados() {
    const siguiente = !get().mostrarArchivados;
    escribirPreferenciaBooleana(PREF_MOSTRAR_ARCHIVADOS_KEY, siguiente);
    set({ mostrarArchivados: siguiente });
  },

  toggleMostrarVersiones() {
    const siguiente = !get().mostrarVersiones;
    escribirPreferenciaBooleana(PREF_MOSTRAR_VERSIONES_KEY, siguiente);
    set({ mostrarVersiones: siguiente });
  },

  // ── Búsqueda (L4) ─────────────────────────────────────────────

  abrirBusquedaCosas() {
    set({ busquedaCosasAbierta: true, busquedaCosasQuery: "", busquedaCosasFiltro: "todos" });
  },

  cerrarBusquedaCosas() {
    set({ busquedaCosasAbierta: false });
  },

  fijarBusquedaCosasQuery(q) {
    set({ busquedaCosasQuery: q });
  },

  fijarBusquedaCosasFiltro(filtro) {
    set({ busquedaCosasFiltro: filtro });
  },

  saltarAResultadoBusqueda(entidadId, opdId) {
    const { modelo, opdActivoId } = get();
    if (!modelo.opds[opdId]) {
      set({ mensaje: `OPD destino no existe: ${opdId}` });
      return;
    }
    set({
      opdActivoId: opdId,
      seleccionId: entidadId,
      enlaceSeleccionId: null,
      modoEnlace: null,
      busquedaCosasAbierta: false,
      mensaje: null,
    });
  },

  // ── Autosalvado (L4) ───────────────────────────────────────────

  iniciarAutosalvado() {
    if (autosalvadoControl) return;
    autosalvadoControl = crearAutosalvado({
      esDirty: () => store.getState().dirty && store.getState().modeloPersistidoId !== null,
      ejecutarSalvado: async () => {
        const state = store.getState();
        if (!state.modeloPersistidoId) return;
        const carpetaId = state.indice.modelos.find((m) => m.id === state.modeloPersistidoId)?.carpetaId;
        const json = exportarModelo(state.modelo, carpetaId);
        const guardado = guardarModeloLocal({
          id: state.modeloPersistidoId,
          nombre: state.modelo.nombre,
          descripcion: state.descripcionModeloLocal,
          json,
          autosalvado: true,
          ...(carpetaId !== undefined ? { carpetaId } : {}),
        });
        if (guardado.ok) {
          snapshotGuardado = exportarModelo(state.modelo);
          store.setState(estadoModelo(state.modelo, {
            dirty: false,
            autosalvado: autosalvadoControl?.estado() ?? { activo: false, ultimo: null, salvando: false },
          }));
        }
      },
    });
    autosalvadoControl.onEstado((estado) => store.setState({ autosalvado: estado }));
    autosalvadoControl.iniciar();
  },

  detenerAutosalvado() {
    autosalvadoControl?.detener();
    autosalvadoControl = null;
    set({ autosalvado: { activo: false, ultimo: null, salvando: false } });
  },

  // ── L5: Mapa del sistema ─────────────────────────────────────────

  abrirVistaMapa() {
    const { modelo, modeloPersistidoId, indice } = get();
    const descriptor = construirDescriptorMapa(modelo);
    const preferencias = leerPreferenciasMapa(indice, modeloPersistidoId);
    set({
      vistaMapaActiva: true,
      descriptorMapaCache: descriptor,
      ...preferencias,
      mensaje: null,
    });
  },

  cerrarVistaMapa() {
    set({ vistaMapaActiva: false, descriptorMapaCache: null, mensaje: null });
  },

  refrescarVistaMapa() {
    const { modelo } = get();
    set({
      descriptorMapaCache: construirDescriptorMapa(modelo),
      mensaje: "Mapa actualizado",
    });
  },

  saltarAOpdDesdeMapa(opdId) {
    const { modelo, opdActivoId } = get();
    if (!modelo.opds[opdId]) {
      set({ mensaje: `OPD no existe: ${opdId}` });
      return;
    }
    set({
      vistaMapaActiva: false,
      descriptorMapaCache: null,
      opdActivoId: opdId,
      mapaUltimoVisitadoOpdId: opdActivoId,
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      mensaje: null,
    });
  },

  fijarMapaProfundidad(max) {
    const estado = get();
    const valor = max === null ? null : Math.max(1, Math.floor(max));
    const indice = persistirPreferenciasMapa(estado, { profundidadMaxima: valor });
    set({ mapaProfundidadMaxima: valor, indice });
  },

  fijarMapaSubarbol(raizId) {
    const estado = get();
    const valor = raizId && estado.modelo.opds[raizId] ? raizId : null;
    const indice = persistirPreferenciasMapa(estado, { subarbolRaizId: valor });
    set({ mapaSubarbolRaizId: valor, indice });
  },

  fijarMapaCriterioResaltado(criterio) {
    const estado = get();
    const indice = persistirPreferenciasMapa(estado, { criterioResaltado: criterio });
    set({ mapaCriterioResaltado: criterio, indice });
  },

  fijarMapaZoom(zoom) {
    const estado = get();
    const valor = limitar(zoom, 0.25, 2);
    const indice = persistirPreferenciasMapa(estado, { zoom: valor });
    set({ mapaZoom: valor, indice });
  },

  fijarMapaPan(x, y) {
    const estado = get();
    const panX = Math.round(x);
    const panY = Math.round(y);
    const indice = persistirPreferenciasMapa(estado, { panX, panY });
    set({ mapaPanX: panX, mapaPanY: panY, indice });
  },

  toggleMapaAutoRefresh() {
    const estado = get();
    const autoRefresh = !estado.mapaAutoRefresh;
    const indice = persistirPreferenciasMapa(estado, { autoRefresh });
    set({ mapaAutoRefresh: autoRefresh, indice });
  },

  fijarMapaTooltip(opdId) {
    set({ mapaTooltipActivoId: opdId });
  },

  toggleMapaPanelFiltros() {
    set({ mapaPanelFiltrosAbierto: !get().mapaPanelFiltrosAbierto });
  },

  toggleMapaPanelEstadisticas() {
    set({ mapaPanelEstadisticasAbierto: !get().mapaPanelEstadisticasAbierto });
  },

  limpiarFiltrosMapa() {
    const estado = get();
    const indice = persistirPreferenciasMapa(estado, {
      profundidadMaxima: null,
      subarbolRaizId: null,
      criterioResaltado: "ninguno",
    });
    set({
      mapaProfundidadMaxima: null,
      mapaSubarbolRaizId: null,
      mapaCriterioResaltado: "ninguno",
      indice,
    });
  },

  descriptorMapaFiltrado() {
    const estado = get();
    let descriptor = estado.descriptorMapaCache ?? construirDescriptorMapa(estado.modelo);
    descriptor = filtrarPorSubarbol(descriptor, estado.mapaSubarbolRaizId);
    descriptor = filtrarPorProfundidad(descriptor, estado.mapaProfundidadMaxima);
    descriptor = resaltarPorTipo(descriptor, estado.mapaCriterioResaltado);
    return aplicarMarcadores(descriptor, estado.opdActivoId, estado.mapaUltimoVisitadoOpdId);
  },

  estadisticasModelo() {
    return calcularEstadisticas(get().modelo);
  },

  // ── L5: Reordenamiento del árbol ─────────────────────────────────

  fijarModoOrdenArbol(modo) {
    const { modelo } = get();
    if (modo === "automatico") {
      // Recomputar orden desde canvas
      const todosPadres = new Set<Id | null>();
      for (const opd of Object.values(modelo.opds)) {
        todosPadres.add(opd.padreId);
      }
      let siguiente = modelo;
      for (const padreId of todosPadres) {
        if (padreId === null) continue;
        const res = ordenSegunCanvasPadre(modelo, padreId);
        if (res.ok) {
          const reord = reordenarHermanos(siguiente, padreId, res.value);
          if (reord.ok) siguiente = reord.value;
        }
      }
      if (siguiente !== modelo) {
        commitModelo(set, modelo, siguiente, {
          modoOrdenArbol: "automatico",
          mensaje: "Orden automático aplicado",
        });
      } else {
        set({ modoOrdenArbol: "automatico" });
      }
    } else {
      set({ modoOrdenArbol: "manual" });
    }
  },

  moverHermano(padreId, opdId, posicion) {
    const { modelo, modoOrdenArbol } = get();
    if (modoOrdenArbol !== "manual") {
      set({ mensaje: "El orden está en modo automático; cámbialo para reordenar manualmente" });
      return;
    }
    const resultado = moverNodo(modelo, opdId, padreId, posicion);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { mensaje: "Hermano reordenado" });
  },

  moverOpdEnGestion(opdId, nuevoPadreId, posicion) {
    const { modelo } = get();
    const resultado = moverNodo(modelo, opdId, nuevoPadreId, posicion);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    commitModelo(set, modelo, resultado.value, { mensaje: "OPD movido en gestión" });
  },

  // ── L5: Gestión árbol ────────────────────────────────────────────

  abrirGestionArbol() {
    set({ gestionArbolAbierta: true, busquedaOpdGestion: "", mensaje: null });
  },

  cerrarGestionArbol() {
    set({ gestionArbolAbierta: false, busquedaOpdGestion: "" });
  },

  fijarBusquedaOpdGestion(q) {
    set({ busquedaOpdGestion: q });
  },

  // ── L5: Renombrado OPD desde árbol ───────────────────────────────

	  renombrarOpdDesdeArbol(opdId, nombre) {
    const { modelo } = get();
    const opd = modelo.opds[opdId];
    if (!opd) {
      set({ mensaje: `OPD no existe: ${opdId}` });
      return;
    }
    const nombreTrim = nombre.trim();
    if (!nombreTrim) {
      set({ mensaje: "El nombre del OPD no puede estar vacío" });
      return;
    }
    // Validar unicidad de nombre dentro del mismo padre
    const hermanoConflicto = Object.values(modelo.opds).find(
      (otro) =>
        otro.id !== opdId &&
        otro.padreId === opd.padreId &&
        otro.nombre === nombreTrim,
    );
    if (hermanoConflicto) {
      set({ mensaje: `Ya existe un OPD con nombre "${nombreTrim}" en este nivel` });
      return;
    }
    const siguiente: Modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [opdId]: { ...opd, nombre: nombreTrim },
      },
    };
	    commitModelo(set, modelo, siguiente, { mensaje: "OPD renombrado" });
	  },

	  // ── L5: Atajos / árbol ─────────────────────────────────────────

	  fijarAnchoPanelArbol(px) {
	    const anchoPanelArbol = limitarAnchoPanelArbol(px);
	    const indice = actualizarPreferenciasUi(get().indice, { anchoPanelArbol });
	    escribirIndiceWorkspace(indice);
	    set({ indice, anchoPanelArbol });
	  },

	  toggleNombresArbolVisibles() {
	    const nombresArbolVisibles = !get().nombresArbolVisibles;
	    const indice = actualizarPreferenciasUi(get().indice, { nombresArbolVisibles });
	    escribirIndiceWorkspace(indice);
	    set({ indice, nombresArbolVisibles });
	  },

	  abrirCheatsheetAtajos() {
	    set({ cheatsheetAtajosAbierto: true, menuPrincipalAbierto: false });
	  },

	  cerrarCheatsheetAtajos() {
	    set({ cheatsheetAtajosAbierto: false });
	  },

	  navegarOpdArriba() {
	    const { modelo, opdActivoId } = get();
	    const actual = modelo.opds[opdActivoId];
	    if (!actual) return;
	    const hermanos = hermanosOrdenados(modelo, actual.padreId);
	    const indice = hermanos.findIndex((opd) => opd.id === opdActivoId);
	    const destino = indice > 0 ? hermanos[indice - 1] : null;
	    if (destino) get().cambiarOpdActivo(destino.id);
	  },

	  navegarOpdAbajo() {
	    const { modelo, opdActivoId } = get();
	    const actual = modelo.opds[opdActivoId];
	    if (!actual) return;
	    const hermanos = hermanosOrdenados(modelo, actual.padreId);
	    const indice = hermanos.findIndex((opd) => opd.id === opdActivoId);
	    const destino = indice >= 0 && indice < hermanos.length - 1 ? hermanos[indice + 1] : null;
	    if (destino) get().cambiarOpdActivo(destino.id);
	  },

	  navegarOpdIzquierda() {
	    const { modelo, opdActivoId } = get();
	    const padreId = modelo.opds[opdActivoId]?.padreId;
	    if (padreId && modelo.opds[padreId]) get().cambiarOpdActivo(padreId);
	  },

	  navegarOpdDerecha() {
	    const { modelo, opdActivoId } = get();
	    const destino = hermanosOrdenados(modelo, opdActivoId)[0];
	    if (destino) get().cambiarOpdActivo(destino.id);
	  },
	
	  // ── L3: Asistente nuevo modelo ─────────────────────────────────

  iniciarAsistente() {
    set({
      asistente: {
        etapaActual: 0,
        datos: datosAsistenteVacio(),
        cancelado: false,
      },
      mensaje: null,
    });
  },

  siguienteEtapa(parcial) {
    const actual = get().asistente;
    if (!actual) return;
    const datos = { ...actual.datos, ...parcial };
    const validacion = validarDatosAsistente(datos, actual.etapaActual);
    if (!validacion.ok) {
      set({ mensaje: validacion.error });
      return;
    }
    const siguienteEtapa = Math.min(actual.etapaActual + 1, 11) as EtapaAsistente;
    set({
      asistente: { ...actual, etapaActual: siguienteEtapa, datos },
      mensaje: null,
    });
  },

  etapaAnterior() {
    const actual = get().asistente;
    if (!actual || actual.etapaActual <= 0) return;
    set({
      asistente: { ...actual, etapaActual: (actual.etapaActual - 1) as EtapaAsistente },
      mensaje: null,
    });
  },

  cancelarAsistente() {
    const actual = get().asistente;
    if (!actual) return;
    // Si no hay datos ingresados, cerrar directo.
    const datos = actual.datos;
    const tieneDatos = datos.funcionPrincipal?.trim()
      || datos.beneficiario?.trim()
      || datos.nombreSistema?.trim()
      || (datos.atributo?.nombre?.trim())
      || datos.agentesAdicionales?.some((a) => a.trim())
      || datos.herramientas?.some((h) => h.trim())
      || datos.entradas?.some((e) => e.trim())
      || datos.salidas?.some((s) => s.nombre.trim());
    if (!tieneDatos) {
      set({ asistente: null, mensaje: null });
      return;
    }
    // Marcar como cancelado; el UI muestra confirmacion.
    set({ asistente: { ...actual, cancelado: true } });
  },

  confirmarAsistente() {
    const actual = get().asistente;
    if (!actual) return;
    // Validar y sembrar.
    const datosCompletos = actual.datos as DatosAsistente;
    const resultado = sembrarModeloDesdeAsistente(datosCompletos);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    const modelo = resultado.value;
    const actualPestana = get().pestanasAbiertas.find((pestana) => pestana.id === get().pestanaActivaId);
    if (actualPestana && pestanaReemplazable(actualPestana)) {
      resetHistorial(modelo);
      set(estadoModelo(modelo, {
        opdActivoId: modelo.opdRaizId,
        seleccionId: null,
        seleccionados: [],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        modoEnlace: null,
        modoCreacion: null,
        hoverOplRef: null,
        modeloPersistidoId: null,
        descripcionModeloLocal: "",
        asistente: null,
        menuPrincipalAbierto: false,
        dirty: true,
        mensaje: "Modelo creado desde asistente",
      }));
      return;
    }
    const pestana = crearPestanaDesdeModelo(modelo, {
      modeloId: null,
      nombre: "Modelo (No guardado)",
      cargadoDesde: "asistente",
      dirty: true,
    });
    activarPestanaNueva(set, get, pestana, "Modelo creado desde asistente");
    set({ asistente: null, menuPrincipalAbierto: false });
  },
}));

export function useOpmStore<T>(selector: (state: OpmStore) => T): T {
  const [selected, setSelected] = useState(() => selector(store.getState()));
  useEffect(() => store.subscribe((state) => {
    const next = selector(state);
    setSelected((current) => (Object.is(current, next) ? current : next));
  }), [selector]);
  return selected;
}

function entidadNueva(previo: Modelo, siguiente: Modelo): Id | null {
  const previos = new Set(Object.keys(previo.entidades));
  return Object.keys(siguiente.entidades).find((id) => !previos.has(id)) ?? null;
}

function enlaceNuevo(previo: Modelo, siguiente: Modelo): Id | null {
  const previos = new Set(Object.keys(previo.enlaces));
  return Object.keys(siguiente.enlaces).find((id) => !previos.has(id)) ?? null;
}

type SetStore = (partial: Partial<OpmStore>) => void;
type GetStore = () => OpmStore;

function activarPestanaNueva(set: SetStore, get: GetStore, pestana: Pestana, mensaje: string): void {
  const estadoActual = sincronizarPestanaActivaEnLista(get());
  const siguiente = abrirPestanaEstado({ pestanas: estadoActual, activa: get().pestanaActivaId }, pestana);
  activarEstadoPestanas(set, siguiente, mensaje);
}

function activarEstadoPestanas(set: SetStore, estado: { pestanas: Pestana[]; activa: PestanaId }, mensaje: string | null): void {
  const pestana = estado.pestanas.find((item) => item.id === estado.activa);
  if (!pestana) return;
  snapshotGuardado = pestana.snapshotJson ?? exportarModelo(pestana.modelo);
  undoStack = [...pestana.historialUndo];
  redoStack = [];
  set(estadoModelo(pestana.modelo, {
    pestanasAbiertas: estado.pestanas,
    pestanaActivaId: pestana.id,
    opdActivoId: opdActivoSeguro(pestana.modelo, pestana.modelo.opdRaizId),
    seleccionId: null,
    seleccionados: pestana.seleccionadosPestana ?? [],
    modoSeleccion: (pestana.seleccionadosPestana?.length ?? 0) > 1 ? "multi" : "simple",
    enlaceSeleccionId: null,
    modoEnlace: null,
    modoCreacion: null,
    hoverOplRef: null,
    modeloPersistidoId: pestana.modeloId,
    descripcionModeloLocal: pestana.descripcionModeloLocal ?? "",
    workspaceLocal: workspaceDesdeModelo(pestana.modelo, pestana.modeloId, pestana.descripcionModeloLocal ?? ""),
    vistaMapaActiva: false,
    descriptorMapaCache: null,
    dirty: pestana.dirty,
    dialogoCargarModeloAbierto: false,
    menuPrincipalAbierto: false,
    mensaje,
  }));
}

function sincronizarPestanaActivaEnLista(state: OpmStore): Pestana[] {
  return state.pestanasAbiertas.map((pestana) => {
    if (pestana.id !== state.pestanaActivaId) return pestana;
    return {
      ...pestana,
      modelo: clonarModelo(state.modelo),
      dirty: state.dirty,
      historialUndo: [...undoStack],
      cursorUndo: undoStack.length,
      seleccionadosPestana: [...state.seleccionados],
      vistaMapaActivaPestana: state.vistaMapaActiva,
      modeloId: state.modeloPersistidoId,
      descripcionModeloLocal: state.descripcionModeloLocal,
      etiqueta: state.modeloPersistidoId ? (state.modelo.nombre || "Modelo (No guardado)") : pestana.etiqueta,
      ...(state.dirty && pestana.snapshotJson === undefined ? {} : { snapshotJson: state.dirty ? pestana.snapshotJson : exportarModelo(state.modelo) }),
    };
  });
}

function pestanaReemplazable(pestana: Pestana): boolean {
  return (
    pestana.cargadoDesde === "nuevo" &&
    pestana.modeloId === null &&
    !pestana.dirty &&
    Object.keys(pestana.modelo.entidades).length === 0 &&
    Object.keys(pestana.modelo.enlaces).length === 0 &&
    Object.keys(pestana.modelo.estados).length === 0
  );
}

function validarSubprocesoTimeline(
  modelo: Modelo,
  opdId: Id,
  aparienciaId: Id,
): { ok: true; apariencia: Apariencia; contorno: Apariencia } | { ok: false; error: string } {
  const opd = modelo.opds[opdId];
  if (!opd) return { ok: false, error: `OPD no existe: ${opdId}` };
  if (!opd.padreId || !modelo.opds[opd.padreId]) {
    return { ok: false, error: "Timeline disponible sólo en OPDs hijos" };
  }
  const contorno = Object.values(opd.apariencias).find((apariencia) => {
    const entidad = modelo.entidades[apariencia.entidadId];
    return entidad?.tipo === "proceso" && entidad.refinamiento?.tipo === "descomposicion" && entidad.refinamiento.opdId === opdId;
  });
  if (!contorno) return { ok: false, error: "Timeline requiere una descomposición de proceso activa" };
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return { ok: false, error: `Apariencia no existe: ${aparienciaId}` };
  const entidad = modelo.entidades[apariencia.entidadId];
  if (!entidad || entidad.tipo !== "proceso" || apariencia.entidadId === contorno.entidadId) {
    return { ok: false, error: "Timeline sólo reordena subprocesos internos" };
  }
  if (!dentroDeApariencia(apariencia, contorno)) {
    return { ok: false, error: "El subproceso no pertenece al contorno de descomposición" };
  }
  return { ok: true, apariencia, contorno };
}

function limitar(valor: number, minimo: number, maximo: number): number {
  return Math.max(minimo, Math.min(maximo, valor));
}

function limitarAnchoPanelArbol(valor: number | undefined): number {
  if (!Number.isFinite(valor)) return ANCHO_PANEL_ARBOL_DEFAULT;
  return limitar(Math.round(valor as number), ANCHO_PANEL_ARBOL_MIN, ANCHO_PANEL_ARBOL_MAX);
}

function actualizarPreferenciasUi(
  indice: WorkspaceIndice,
  patch: NonNullable<WorkspaceIndice["preferenciasUi"]>,
): WorkspaceIndice {
  return {
    ...indice,
    preferenciasUi: {
      ...(indice.preferenciasUi ?? {}),
      ...patch,
    },
  };
}

function mapaWorkspaceDesdeEstado(estado: OpmStore, patch: Partial<MapaWorkspace> = {}): MapaWorkspace {
  return {
    zoom: estado.mapaZoom,
    panX: estado.mapaPanX,
    panY: estado.mapaPanY,
    profundidadMaxima: estado.mapaProfundidadMaxima,
    subarbolRaizId: estado.mapaSubarbolRaizId,
    criterioResaltado: estado.mapaCriterioResaltado,
    autoRefresh: estado.mapaAutoRefresh,
    ...patch,
  };
}

function persistirPreferenciasMapa(estado: OpmStore, patch: Partial<MapaWorkspace>): WorkspaceIndice {
  if (!estado.modeloPersistidoId) return estado.indice;
  const mapa = mapaWorkspaceDesdeEstado(estado, patch);
  const existe = estado.indice.modelos.some((modelo) => modelo.id === estado.modeloPersistidoId);
  const modelos = existe
    ? estado.indice.modelos.map((modelo) => modelo.id === estado.modeloPersistidoId ? { ...modelo, mapa } : modelo)
    : [...estado.indice.modelos, { id: estado.modeloPersistidoId, carpetaId: estado.carpetaActualId, mapa }];
  const indice = { ...estado.indice, modelos };
  escribirIndiceWorkspace(indice);
  return indice;
}

function leerPreferenciasMapa(indice: WorkspaceIndice, modeloId: Id | null): Pick<
  OpmStore,
  "mapaZoom" |
  "mapaPanX" |
  "mapaPanY" |
  "mapaProfundidadMaxima" |
  "mapaSubarbolRaizId" |
  "mapaCriterioResaltado" |
  "mapaAutoRefresh"
> {
  const mapa = modeloId ? indice.modelos.find((modelo) => modelo.id === modeloId)?.mapa : undefined;
  return {
    mapaZoom: limitar(typeof mapa?.zoom === "number" ? mapa.zoom : 1, 0.25, 2),
    mapaPanX: typeof mapa?.panX === "number" ? Math.round(mapa.panX) : 0,
    mapaPanY: typeof mapa?.panY === "number" ? Math.round(mapa.panY) : 0,
    mapaProfundidadMaxima: typeof mapa?.profundidadMaxima === "number" ? Math.max(1, Math.floor(mapa.profundidadMaxima)) : null,
    mapaSubarbolRaizId: typeof mapa?.subarbolRaizId === "string" ? mapa.subarbolRaizId : null,
    mapaCriterioResaltado: esCriterioResaltado(mapa?.criterioResaltado) ? mapa.criterioResaltado : "ninguno",
    mapaAutoRefresh: typeof mapa?.autoRefresh === "boolean" ? mapa.autoRefresh : true,
  };
}

function esCriterioResaltado(value: unknown): value is CriterioResaltado {
  return value === "predominanciaProceso" ||
    value === "predominanciaObjeto" ||
    value === "tieneEstados" ||
    value === "raiz" ||
    value === "ninguno";
}

function hermanosOrdenados(modelo: Modelo, padreId: Id | null): Opd[] {
  return Object.values(modelo.opds)
    .filter((opd) => opd.padreId === padreId)
    .sort((a, b) => {
      if (a.ordenLocal !== undefined && b.ordenLocal !== undefined) return a.ordenLocal - b.ordenLocal;
      if (a.ordenLocal !== undefined) return -1;
      if (b.ordenLocal !== undefined) return 1;
      return a.nombre.localeCompare(b.nombre, "es-CL") || a.id.localeCompare(b.id, "es-CL");
    });
}

function commitModelo(
  set: (partial: Partial<OpmStore>) => void,
  previo: Modelo,
  siguiente: Modelo,
  extra: Partial<OpmStore> = {},
): void {
  const sincronizado = sincronizarAbanicos(siguiente);
  if (previo === sincronizado || exportarModelo(previo) === exportarModelo(sincronizado)) {
    set(extra);
    return;
  }
  undoStack = [...undoStack, previo].slice(-UNDO_LIMIT);
  redoStack = [];
  const extraFinal: Partial<OpmStore> = { ...extra };
  const estadoActual = store.getState();
  if (
    estadoActual.vistaMapaActiva &&
    estadoActual.mapaAutoRefresh &&
    !("descriptorMapaCache" in extraFinal) &&
    cambiaronOpds(previo, sincronizado)
  ) {
    extraFinal.descriptorMapaCache = construirDescriptorMapa(sincronizado);
  }
  set(estadoModelo(sincronizado, extraFinal));
}

function cambiaronOpds(previo: Modelo, siguiente: Modelo): boolean {
  return JSON.stringify(previo.opds) !== JSON.stringify(siguiente.opds);
}

function resetHistorial(modelo: Modelo): void {
  undoStack = [];
  redoStack = [];
  snapshotGuardado = exportarModelo(modelo);
}

function listarModelosGuardadosSeguro(): ResumenModeloPersistido[] {
  const listado = listarModelosLocales();
  return listado.ok ? listado.value : [];
}

function estadoModelo(modelo: Modelo, extra: Partial<OpmStore> = {}): Partial<OpmStore> {
  const dirty = extra.dirty ?? (exportarModelo(modelo) !== snapshotGuardado);
  const actual = typeof store === "undefined" ? null : store.getState();
  const pestanasAbiertas = extra.pestanasAbiertas ?? (
    actual?.pestanasAbiertas
      ? actual.pestanasAbiertas.map((pestana) => {
          if (pestana.id !== actual.pestanaActivaId) return pestana;
          const modeloId = extra.modeloPersistidoId !== undefined ? extra.modeloPersistidoId : actual.modeloPersistidoId;
          const descripcion = extra.descripcionModeloLocal !== undefined ? extra.descripcionModeloLocal : actual.descripcionModeloLocal;
          return {
            ...pestana,
            modelo: clonarModelo(modelo),
            dirty,
            historialUndo: [...undoStack],
            cursorUndo: undoStack.length,
            modeloId,
            descripcionModeloLocal: descripcion,
            etiqueta: modeloId ? (modelo.nombre || "Modelo (No guardado)") : pestana.etiqueta,
            ...(dirty && pestana.snapshotJson === undefined ? {} : { snapshotJson: dirty ? pestana.snapshotJson : exportarModelo(modelo) }),
          };
        })
      : undefined
  );
  return {
    modelo,
    dirty,
    puedeDeshacer: undoStack.length > 0,
    puedeRehacer: redoStack.length > 0,
    ...(pestanasAbiertas ? { pestanasAbiertas } : {}),
    ...extra,
  };
}

function estadoSeleccionDesdeIds(modelo: Modelo, ids: Id[], modo: ModoSeleccion): Partial<OpmStore> {
  const seleccionados = [...new Set(ids.filter((id) => modelo.entidades[id] || modelo.enlaces[id]))];
  const unico = seleccionados.length === 1 ? seleccionados[0] : null;
  return {
    seleccionados,
    modoSeleccion: seleccionados.length > 1 ? "multi" : modo,
    seleccionId: unico && modelo.entidades[unico] ? unico : null,
    enlaceSeleccionId: unico && modelo.enlaces[unico] ? unico : null,
    modoEnlace: null,
    mensaje: null,
  };
}

function opdActivoSeguro(modelo: Modelo, opdActivoId: Id): Id {
  return modelo.opds[opdActivoId] ? opdActivoId : modelo.opdRaizId;
}

function confirmarEliminacionOpd(nombre: string): boolean {
  if (typeof globalThis.confirm !== "function") return true;
  return globalThis.confirm(`Eliminar OPD "${nombre}"? Esta acción se puede deshacer.`);
}

function aparienciaSeleccionadaActiva(modelo: Modelo, opdActivoId: Id, seleccionId: Id | null): Apariencia | null {
  if (!seleccionId) return null;
  const entidad = modelo.entidades[seleccionId];
  if (!entidad) return null;
  return Object.values(modelo.opds[opdActivoId]?.apariencias ?? {})
    .find((apariencia) => apariencia.entidadId === seleccionId) ?? null;
}

function opdDestinoDeAviso(modelo: Modelo, aviso: Aviso, opdActivoId: Id): Id | null {
  if (aviso.opdId && modelo.opds[aviso.opdId]) return aviso.opdId;
  if (!aviso.elementoId) return null;
  if (aviso.elementoTipo === "opd") return modelo.opds[aviso.elementoId] ? aviso.elementoId : null;
  if (aviso.elementoTipo === "enlace") return opdIdDeEnlace(modelo, aviso.elementoId, opdActivoId);
  if (aviso.elementoTipo === "entidad") return opdIdDeEntidad(modelo, aviso.elementoId, opdActivoId);
  return null;
}

function opdIdDeEnlace(modelo: Modelo, enlaceId: Id, opdPreferidoId: Id): Id | null {
  const preferido = modelo.opds[opdPreferidoId];
  if (preferido && Object.values(preferido.enlaces).some((apariencia) => apariencia.enlaceId === enlaceId)) {
    return opdPreferidoId;
  }
  for (const opd of Object.values(modelo.opds)) {
    if (Object.values(opd.enlaces).some((apariencia) => apariencia.enlaceId === enlaceId)) return opd.id;
  }
  return null;
}

function opdIdDeEntidad(modelo: Modelo, entidadId: Id, opdPreferidoId: Id): Id | null {
  const preferido = modelo.opds[opdPreferidoId];
  if (preferido && Object.values(preferido.apariencias).some((apariencia) => apariencia.entidadId === entidadId)) {
    return opdPreferidoId;
  }
  for (const opd of Object.values(modelo.opds)) {
    if (Object.values(opd.apariencias).some((apariencia) => apariencia.entidadId === entidadId)) return opd.id;
  }
  return null;
}

function crearDemo(): Modelo {
  let modelo = crearModelo("OnStar mínimo");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 90, y: 90 }, "Driver"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 330, y: 90 }, "OnStar System"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 230 }, "Driver Rescuing"));

  const driver = entidadPorNombre(modelo, "Driver");
  const sistema = entidadPorNombre(modelo, "OnStar System");
  const rescate = entidadPorNombre(modelo, "Driver Rescuing");

  modelo = must(cambiarEsencia(modelo, driver, "fisica"));
  modelo = must(cambiarAfiliacion(modelo, driver, "ambiental"));
  modelo = must(cambiarEsencia(modelo, sistema, "fisica"));
  modelo = must(cambiarEsencia(modelo, rescate, "fisica"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, driver, rescate, "agente"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, sistema, rescate, "efecto"));
  return modelo;
}

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad demo no encontrada: ${nombre}`);
  return entidad.id;
}

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

// ── Persistencia del WorkspaceIndice ────────────────────────────

function escribirIndiceWorkspace(indice: WorkspaceIndice): void {
  try {
    if (typeof globalThis.localStorage === "undefined") return;
    globalThis.localStorage.setItem(WS_KEY, JSON.stringify(indice));
  } catch { /* storage no disponible */ }
}

function leerIndiceWorkspace(): WorkspaceIndice {
  try {
    if (typeof globalThis.localStorage === "undefined") return indiceVacio();
    const raw = globalThis.localStorage.getItem(WS_KEY);
    if (!raw) return indiceVacio();
    const parsed = JSON.parse(raw);
    if (!esRecord(parsed)) return indiceVacio();
    return {
      modelos: Array.isArray(parsed.modelos) ? parsed.modelos.map(normalizarModeloIndice).filter((m): m is WorkspaceIndice["modelos"][number] => m !== null) : [],
      carpetas: Array.isArray(parsed.carpetas) ? parsed.carpetas.filter((c: unknown) => esRecord(c) && typeof c.id === "string") : [],
      recientes: Array.isArray(parsed.recientes) ? parsed.recientes.filter((r: unknown) => typeof r === "string") : [],
      ...(esPreferenciasUi(parsed.preferenciasUi) ? { preferenciasUi: parsed.preferenciasUi } : {}),
    };
  } catch {
    return indiceVacio();
  }
}

function sincronizarIndiceConModelosGuardados(modelosGuardados: ResumenModeloPersistido[], indice: WorkspaceIndice): WorkspaceIndice {
  const idsGuardados = new Set(modelosGuardados.map((m) => m.id));
  const modelos: WorkspaceIndice["modelos"] = modelosGuardados.map((m) => {
    const existente = indice.modelos.find((item) => item.id === m.id);
    return {
      ...existente,
      id: m.id,
      carpetaId: m.carpetaId ?? existente?.carpetaId ?? null,
      ...(m.archivado ? { archivado: true } : {}),
      ...(m.archivadoEn ? { archivadoEn: m.archivadoEn } : {}),
      ...(m.versiones ? { versiones: m.versiones } : {}),
      ...(existente?.mapa ? { mapa: existente.mapa } : {}),
    };
  });
  // Conservar modelos del índice que no están en modelosGuardados
  for (const m of indice.modelos) {
    if (!idsGuardados.has(m.id)) modelos.push(m);
  }
  return { ...indice, modelos, recientes: indice.recientes.filter((r) => idsGuardados.has(r)) };
}

function normalizarModeloIndice(value: unknown): WorkspaceIndice["modelos"][number] | null {
  if (!esRecord(value) || typeof value.id !== "string") return null;
  return {
    id: value.id,
    carpetaId: typeof value.carpetaId === "string" || value.carpetaId === null ? value.carpetaId : null,
    ...(typeof value.archivado === "boolean" ? { archivado: value.archivado } : {}),
    ...(typeof value.archivadoEn === "string" ? { archivadoEn: value.archivadoEn } : {}),
    ...(Array.isArray(value.versiones) ? { versiones: value.versiones as NonNullable<WorkspaceIndice["modelos"][number]["versiones"]> } : {}),
    ...(esMapaWorkspace(value.mapa) ? { mapa: value.mapa } : {}),
  };
}

function esMapaWorkspace(value: unknown): value is MapaWorkspace {
  if (!esRecord(value)) return false;
  if (value.zoom !== undefined && typeof value.zoom !== "number") return false;
  if (value.panX !== undefined && typeof value.panX !== "number") return false;
  if (value.panY !== undefined && typeof value.panY !== "number") return false;
  if (value.profundidadMaxima !== undefined && value.profundidadMaxima !== null && typeof value.profundidadMaxima !== "number") return false;
  if (value.subarbolRaizId !== undefined && value.subarbolRaizId !== null && typeof value.subarbolRaizId !== "string") return false;
  if (value.criterioResaltado !== undefined && !esCriterioResaltado(value.criterioResaltado)) return false;
  if (value.autoRefresh !== undefined && typeof value.autoRefresh !== "boolean") return false;
  return true;
}

function esRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function esPreferenciasUi(value: unknown): value is NonNullable<WorkspaceIndice["preferenciasUi"]> {
  if (!esRecord(value)) return false;
  if (value.anchoPanelArbol !== undefined && typeof value.anchoPanelArbol !== "number") return false;
  if (value.nombresArbolVisibles !== undefined && typeof value.nombresArbolVisibles !== "boolean") return false;
  if (value.cheatsheetVisible !== undefined && typeof value.cheatsheetVisible !== "boolean") return false;
  return true;
}

function modelosRecientesDeIndice(indice: WorkspaceIndice, guardados: ResumenModeloPersistido[]): ResumenModeloPersistido[] {
  return indice.recientes
    .map((id) => guardados.find((m) => m.id === id))
    .filter((m): m is ResumenModeloPersistido => m !== undefined);
}

function leerPreferenciaBooleana(key: string, fallback: boolean): boolean {
  try {
    if (typeof globalThis.localStorage === "undefined") return fallback;
    const raw = globalThis.localStorage.getItem(key);
    if (raw === "true") return true;
    if (raw === "false") return false;
  } catch { /* storage no disponible */ }
  return fallback;
}

function escribirPreferenciaBooleana(key: string, value: boolean): void {
  try {
    if (typeof globalThis.localStorage === "undefined") return;
    globalThis.localStorage.setItem(key, value ? "true" : "false");
  } catch { /* storage no disponible */ }
}

function crearIdModeloLocal(): Id {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `modelo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * HU-50.024: Genera HTML autocontenido con estilos canónicos OPL-ES (JOYAS §1).
 * Colores: objeto #70E483, proceso #3BC3FF, estado #586D8C.
 */
function generarHtmlOpl(lineas: string[], titulo: string): string {
  const escapeHtml = (texto: string) =>
    texto
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const filas = lineas
    .map((linea, i) => {
      // Colorear tokens markdown: **objeto** y *proceso*
      const coloreada = linea
        .replace(/\*\*([^*]+)\*\*/g, '<span class="obj">$1</span>')
        .replace(/\*([^*\s][^*]*?)\*/g, '<span class="proc">$1</span>')
        .replace(/`([^`]+)`/g, '<span class="est">$1</span>');
      return `<tr><td class="num">${i + 1}.</td><td>${coloreada}</td></tr>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>OPL-ES — ${escapeHtml(titulo)}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 13px; line-height: 1.65; color: #1f2937; max-width: 960px; margin: 40px auto; padding: 0 20px; }
  h1 { font-size: 18px; color: #334155; margin-bottom: 24px; }
  table { border-collapse: collapse; width: 100%; }
  td { vertical-align: top; padding: 2px 6px; }
  td.num { color: #667085; text-align: right; width: 32px; font-variant-numeric: tabular-nums; }
  .obj { color: #1f7a3c; font-weight: 700; }
  .proc { color: #147aa5; font-style: italic; font-weight: 700; }
  .est { color: #475467; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; }
</style>
</head>
<body>
<h1>OPL-ES &mdash; ${escapeHtml(titulo)}</h1>
<table>${filas}</table>
</body>
</html>`;
}
