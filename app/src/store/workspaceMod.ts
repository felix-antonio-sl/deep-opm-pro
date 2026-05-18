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
import { crearVersionResultado } from "../persistencia/versiones";
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
import type { CrearSlice, WorkspaceModSlice } from "./tipos";
import {
  ANCHO_PANEL_ARBOL_DEFAULT, ANCHO_PANEL_ARBOL_MAX, ANCHO_PANEL_ARBOL_MIN, PORTAPAPELES_WORKSPACE_TTL_MS, PREF_MOSTRAR_ARCHIVADOS_KEY, PREF_MOSTRAR_VERSIONES_KEY, activarEstadoPestanas, activarPestanaNueva, aparienciaSeleccionadaActiva, commitModelo, confirmarEliminacionOpd, crearDemo, crearIdModeloLocal, entidadNueva, enlaceNuevo, escribirIndiceWorkspace, escribirPreferenciaBooleana, estadoModelo, estadoSeleccionDesdeIds, generarHtmlOpl, hermanosOrdenados, leerIndiceWorkspace, leerPreferenciaBooleana, leerPreferenciasMapa, limitar, limitarAnchoPanelArbol, listarModelosGuardadosSeguro, mapaWorkspaceDesdeEstado, marcarSnapshotJson, marcarSnapshotModelo, modelosRecientesDeIndice, obtenerAutosalvadoControl, obtenerEstadoStore, opdActivoSeguro, opdDestinoDeAviso, persistirPreferenciasMapa, fijarAutosalvadoControl, resetHistorial, setEstadoStore, sincronizarIndiceConModelosGuardados, actualizarPreferenciasUi, validarSubprocesoTimeline,
  pestanaReemplazable,
  deshacerRuntime,
  rehacerRuntime,
} from "./runtime";
export const indiceInicial = leerIndiceWorkspace();

export type { WorkspaceModSlice } from "./tipos";

export const createWorkspaceModSlice: CrearSlice<WorkspaceModSlice> = (set, get) => ({
  indice: indiceInicial,
  carpetaActualId: null,
  modelosRecientes: [],

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
    const version = crearVersionResultado(modelo, opts);
    if (!version.ok) {
      set({ mensaje: version.error.mensaje });
      return;
    }
    try {
      const resumen = listarModelosGuardadosSeguro().find((item) => item.id === modeloPersistidoId);
      const versiones = [version.value, ...(resumen?.versiones ?? [])];
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
  }
});
