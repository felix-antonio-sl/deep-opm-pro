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
  construirModeloPersistido,
  guardarModeloLocal,
  listarModelosLocales,
  resumenDesdeModeloPersistido,
  actualizarMetadataModeloLocal,
  type ModeloPersistido,
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
import { borrarVersionBackend, cargarVersionBackend, guardarModeloBackend, persistenciaBackendHabilitada } from "../persistencia/backend";
import {
  eliminarVersionResultado,
  restaurarVersionResultado,
} from "../persistencia/versiones";
import {
  crearAutosalvado,
  type AutosalvadoEstado,
  type AutosalvadoControl,
} from "../persistencia/autosalvado";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import type { Aviso } from "../modelo/validaciones";
import type { Afiliacion, Apariencia, DesignacionEstado, DuracionTemporal, Esencia, ExtremoEnlace, Id, LayoutEstados, Modelo, Modificador, ModoDespliegueObjeto, ModoPlegado, Opd, OperadorAbanico, OrdenPartesPlegado, Pestana, PestanaId, Posicion, TipoEnlace, TipoEntidad, UrlObjetoTipada, UiPortapapelesVisual, VersionResumen } from "../modelo/tipos";
import { mismaReferencia, type OplReferencia } from "../opl/interaccion";
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
  conectarMultiAlTodo,
  copiarSeleccion,
  eliminarBatch,
  nudgeApariencias,
  nudgeEnlaces,
  pegarSeleccion,
} from "../canvas/operacionesBatch";
import type { CrearSlice, CarpetasSlice } from "./tipos";
import {
  ANCHO_PANEL_ARBOL_DEFAULT, ANCHO_PANEL_ARBOL_MAX, ANCHO_PANEL_ARBOL_MIN, PORTAPAPELES_WORKSPACE_TTL_MS, PREF_MOSTRAR_ARCHIVADOS_KEY, PREF_MOSTRAR_VERSIONES_KEY, activarEstadoPestanas, activarPestanaNueva, aparienciaSeleccionadaActiva, commitModelo, confirmarEliminacionOpd, crearIdModeloLocal, entidadNueva, enlaceNuevo, escribirIndiceWorkspace, escribirPreferenciaBooleana, estadoModelo, estadoSeleccionDesdeIds, hermanosOrdenados, leerIndiceWorkspace, leerPreferenciaBooleana, leerPreferenciasMapa, limitar, limitarAnchoPanelArbol, listarModelosGuardadosSeguro, mapaWorkspaceDesdeEstado, marcarSnapshotJson, marcarSnapshotModelo, modelosRecientesDeIndice, obtenerAutosalvadoControl, obtenerEstadoStore, opdActivoSeguro, opdDestinoDeAviso, persistirPreferenciasMapa, fijarAutosalvadoControl, resetHistorial, setEstadoStore, sincronizarIndiceConModelosGuardados, actualizarPreferenciasUi, validarSubprocesoTimeline,
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
    let restaurado: Modelo | null = null;
    if (persistenciaBackendHabilitada()) {
      const backend = await cargarVersionBackend(modeloId, versionId);
      if (!backend.ok) {
        set({ mensaje: backend.error });
        return;
      }
      const hidratado = hidratarModelo(backend.value.json);
      if (!hidratado.ok) {
        set({ mensaje: hidratado.error });
        return;
      }
      restaurado = hidratado.value;
    } else {
      const restauradoResultado = await restaurarVersionResultado(version.modeloPayloadKey);
      if (!restauradoResultado.ok) {
        set({ mensaje: restauradoResultado.error.mensaje });
        return;
      }
      restaurado = restauradoResultado.value;
    }
    const fecha = version.creadoEn.slice(0, 10);
    const nombre = `${restaurado.nombre} (restaurado ${fecha})`;
    const { archivado: _archivado, archivadoEn: _archivadoEn, versiones: _versiones, ...restauradoActivo } = restaurado;
    const modeloCopia: Modelo = { ...restauradoActivo, id: crearIdModeloLocal(), nombre };
    const carpetaId = get().indice.modelos.find((item) => item.id === modeloId)?.carpetaId ?? null;
    const inputGuardado = {
      nombre,
      descripcion: `Restaurado desde ${version.nombre}`,
      json: exportarModelo(modeloCopia, carpetaId),
      carpetaId,
    };
    let guardado: ModeloPersistido;
    if (persistenciaBackendHabilitada()) {
      const resultado = await guardarModeloBackend(construirModeloPersistido(inputGuardado));
      if (!resultado.ok) {
        set({ mensaje: `No se pudo restaurar versión en servidor: ${resultado.error}` });
        return;
      }
      guardado = resultado.value;
    } else {
      const resultado = guardarModeloLocal(inputGuardado);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      guardado = resultado.value;
    }
    const indice = {
      ...get().indice,
      modelos: [...get().indice.modelos, { id: guardado.id, carpetaId }],
      recientes: [guardado.id, ...get().indice.recientes.filter((id) => id !== guardado.id)].slice(0, 10),
    };
    escribirIndiceWorkspace(indice);
    resetHistorial(modeloCopia);
    set(estadoModelo(modeloCopia, {
      opdActivoId: modeloCopia.opdRaizId,
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      modeloPersistidoId: guardado.id,
      descripcionModeloLocal: guardado.descripcion,
      modelosGuardados: persistenciaBackendHabilitada()
        ? [resumenDesdeModeloPersistido(guardado), ...get().modelosGuardados.filter((item) => item.id !== guardado.id)]
        : listarModelosGuardadosSeguro(),
      indice,
      dialogoVersionesAbierto: null,
      workspaceLocal: workspaceDesdeModelo(modeloCopia, guardado.id, guardado.descripcion, carpetaId),
      mensaje: "Versión restaurada como copia",
    }));
  },

  eliminarVersionPorId(modeloId, versionId) {
    const resumen = get().modelosGuardados.find((item) => item.id === modeloId);
    const versiones = (resumen?.versiones ?? []).filter((version) => version.id !== versionId);
    const eliminado = eliminarVersionResultado(get().indice, modeloId, versionId);
    if (!eliminado.ok) {
      set({ mensaje: eliminado.error.mensaje });
      return;
    }
    const indice = eliminado.value;
    if (!persistenciaBackendHabilitada()) actualizarMetadataModeloLocal(modeloId, { versiones });
    else void borrarVersionBackend(modeloId, versionId);
    escribirIndiceWorkspace(indice);
    set({
      indice,
      modelosGuardados: persistenciaBackendHabilitada()
        ? get().modelosGuardados.map((item) => item.id === modeloId ? { ...item, versiones } : item)
        : listarModelosGuardadosSeguro(),
      mensaje: "Versión eliminada",
    });
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
    // de "saltó hasta aquí" durante 3s.
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
