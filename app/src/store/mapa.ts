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
import type { Afiliacion, Apariencia, DesignacionEstado, DuracionTemporal, EnlaceEstilo, Esencia, EstiloApariencia, ExtremoEnlace, Id, LayoutEstados, Modelo, Modificador, ModoDespliegueObjeto, ModoPlegado, Opd, OperadorAbanico, OrdenPartesPlegado, Pestana, PestanaId, Posicion, TipoEnlace, TipoEntidad, UrlObjetoTipada, UiPortapapelesVisual, VersionResumen } from "../modelo/tipos";
import { mismaReferencia, type OplReferencia } from "../opl/interaccion";
import { generarOpl } from "../opl/generar";
import {
  construirDescriptorMapa,
} from "../canvas/mapaSistema";
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
import type { CrearSlice, MapaSlice } from "./tipos";
import {
  ANCHO_PANEL_ARBOL_DEFAULT, ANCHO_PANEL_ARBOL_MAX, ANCHO_PANEL_ARBOL_MIN, PORTAPAPELES_WORKSPACE_TTL_MS, PREF_MOSTRAR_ARCHIVADOS_KEY, PREF_MOSTRAR_VERSIONES_KEY, activarEstadoPestanas, activarPestanaNueva, aparienciaSeleccionadaActiva, commitModelo, confirmarEliminacionOpd, crearIdModeloLocal, entidadNueva, enlaceNuevo, escribirIndiceWorkspace, escribirPreferenciaBooleana, estadoModelo, estadoSeleccionDesdeIds, hermanosOrdenados, leerIndiceWorkspace, leerPreferenciaBooleana, leerPreferenciasMapa, limitar, limitarAnchoPanelArbol, listarModelosGuardadosSeguro, mapaWorkspaceDesdeEstado, marcarSnapshotJson, marcarSnapshotModelo, modelosRecientesDeIndice, obtenerAutosalvadoControl, obtenerEstadoStore, opdActivoSeguro, opdDestinoDeAviso, persistirPreferenciasMapa, fijarAutosalvadoControl, resetHistorial, setEstadoStore, sincronizarIndiceConModelosGuardados, actualizarPreferenciasUi, validarSubprocesoTimeline,
  pestanaReemplazable,
  deshacerRuntime,
  rehacerRuntime,
} from "./runtime";

export type { MapaSlice } from "./tipos";

export const createMapaSlice: CrearSlice<MapaSlice> = (set, get) => ({
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

  abrirVistaMapa() {
    const { modelo, modeloPersistidoId, indice, contextoSimulacion, readOnlyPrevSimulacion } = get();
    // P0-2 ronda 4: Mapa y Simulacion son mutuamente excluyentes.
    // Si hay simulacion activa, restauramos readOnly y la limpiamos.
    // Cancelamos tambien modoEnlace y modoCreacion (no aplican en vista mapa).
    set({
      vistaMapaActiva: true,
      descriptorMapaCache: construirDescriptorMapa(modelo),
      ...leerPreferenciasMapa(indice, modeloPersistidoId),
      mensaje: null,
      modoEnlace: null,
      modoCreacion: null,
      // P1-5 ronda 4: editor inline (`nuevaCosaPendiente`) no debe sobrevivir
      // un cambio de contexto. Cualquier modo que no sea Modelar lo descarta.
      nuevaCosaPendiente: null,
      ...(contextoSimulacion !== null ? {
        contextoSimulacion: null,
        readOnly: readOnlyPrevSimulacion ?? false,
        readOnlyPrevSimulacion: null,
      } : {}),
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

});
