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
import type { CrearSlice, CarpetasSlice } from "./tipos";
import {
  ANCHO_PANEL_ARBOL_DEFAULT, ANCHO_PANEL_ARBOL_MAX, ANCHO_PANEL_ARBOL_MIN, PORTAPAPELES_WORKSPACE_TTL_MS, PREF_MOSTRAR_ARCHIVADOS_KEY, PREF_MOSTRAR_VERSIONES_KEY, activarEstadoPestanas, activarPestanaNueva, aparienciaSeleccionadaActiva, commitModelo, confirmarEliminacionOpd, crearDemo, crearIdModeloLocal, entidadNueva, enlaceNuevo, escribirIndiceWorkspace, escribirPreferenciaBooleana, estadoModelo, estadoSeleccionDesdeIds, generarHtmlOpl, hermanosOrdenados, leerIndiceWorkspace, leerPreferenciaBooleana, leerPreferenciasMapa, limitar, limitarAnchoPanelArbol, listarModelosGuardadosSeguro, mapaWorkspaceDesdeEstado, marcarSnapshotJson, marcarSnapshotModelo, modelosRecientesDeIndice, obtenerAutosalvadoControl, obtenerEstadoStore, opdActivoSeguro, opdDestinoDeAviso, persistirPreferenciasMapa, fijarAutosalvadoControl, resetHistorial, setEstadoStore, sincronizarIndiceConModelosGuardados, actualizarPreferenciasUi, validarSubprocesoTimeline,
  pestanaReemplazable,
  deshacerRuntime,
  rehacerRuntime,
} from "./runtime";

export type { CarpetasSlice } from "./tipos";

export const createCarpetasSlice: CrearSlice<CarpetasSlice> = (set, get) => ({
  portapapelesWorkspace: null,
  mostrarArchivados: leerPreferenciaBooleana(PREF_MOSTRAR_ARCHIVADOS_KEY, false),
  mostrarVersiones: leerPreferenciaBooleana(PREF_MOSTRAR_VERSIONES_KEY, false),
  dialogoVersionesAbierto: null,
  dialogoArchivadosAbierto: false,
  dialogoBuscarGlobalAbierto: false,
  busquedaGlobal: { query: "", resultados: [], enProgreso: false },
  busquedaCosasAbierta: false,
  busquedaCosasQuery: "",
  busquedaCosasFiltro: "todos",

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

  saltarAResultadoBusqueda(resultado) {
    const { modelo } = get();
    if (!modelo.opds[resultado.opdId]) {
      set({ mensaje: `OPD destino no existe: ${resultado.opdId}` });
      return;
    }
    // [Ronda 16 L2] Selección polimorfa por tipo:
    // - entidad/estado seleccionan la apariencia visible (entidad lógica),
    //   asegurando halo + selección compartida con OPL/Inspector.
    // - enlace selecciona el enlace lógico vía `enlaceSeleccionId`.
    // El halo temporal (`idsResaltadosTemporales`) refuerza la afordancia
    // de "saltó hasta aquí" durante 3s, igual que el patrón de plantillas.
    const idsHalo: Id[] = [];
    if (resultado.tipo === "entidad" || resultado.tipo === "estado") {
      idsHalo.push(resultado.aparienciaId);
      set({
        opdActivoId: resultado.opdId,
        seleccionId: resultado.entidadId,
        seleccionados: [resultado.entidadId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        modoEnlace: null,
        busquedaCosasAbierta: false,
        mensaje: null,
      });
    } else {
      const enlace = modelo.enlaces[resultado.enlaceId];
      if (!enlace) {
        set({ mensaje: `Enlace no existe: ${resultado.enlaceId}` });
        return;
      }
      idsHalo.push(resultado.enlaceId);
      set({
        opdActivoId: resultado.opdId,
        seleccionId: null,
        seleccionados: [resultado.enlaceId],
        modoSeleccion: "simple",
        enlaceSeleccionId: resultado.enlaceId,
        modoEnlace: null,
        busquedaCosasAbierta: false,
        mensaje: null,
      });
    }
    if (idsHalo.length > 0) get().resaltarTemporalmente(idsHalo, 3000);
  }
});
