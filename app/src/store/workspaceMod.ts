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
import type { ResumenModeloPersistido } from "../persistencia/modelos";
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
  marcarBiblioteca as marcarBibliotecaEnIndiceOp,
  marcarApunte as marcarApunteEnIndiceOp,
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
import { guardarVersionBackend, persistenciaBackendHabilitada } from "../persistencia/backend";
import { construirVersionPersistible } from "../persistencia/versiones";
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
import type { CrearSlice, WorkspaceModSlice } from "./tipos";
import {
  ANCHO_PANEL_ARBOL_DEFAULT, ANCHO_PANEL_ARBOL_MAX, ANCHO_PANEL_ARBOL_MIN, PORTAPAPELES_WORKSPACE_TTL_MS, PREF_MOSTRAR_ARCHIVADOS_KEY, PREF_MOSTRAR_VERSIONES_KEY, activarEstadoPestanas, activarPestanaNueva, aparienciaSeleccionadaActiva, commitModelo, confirmarEliminacionOpd, crearIdModeloLocal, entidadNueva, enlaceNuevo, escribirIndiceWorkspace, escribirPreferenciaBooleana, estadoModelo, estadoSeleccionDesdeIds, hermanosOrdenados, leerIndiceWorkspace, leerPreferenciaBooleana, leerPreferenciasMapa, limitar, limitarAnchoPanelArbol, listarModelosGuardadosSeguro, mapaWorkspaceDesdeEstado, marcarSnapshotJson, marcarSnapshotModelo, modelosRecientesDeIndice, obtenerAutosalvadoControl, obtenerEstadoStore, opdActivoSeguro, opdDestinoDeAviso, persistirPreferenciasMapa, fijarAutosalvadoControl, resetHistorial, setEstadoStore, sincronizarIndiceConModelosGuardados, actualizarPreferenciasUi, validarSubprocesoTimeline,
  pestanaReemplazable,
  deshacerRuntime,
  rehacerRuntime,
  type GetStore,
} from "./runtime";
export const indiceInicial = leerIndiceWorkspace();

export type { WorkspaceModSlice } from "./tipos";

export const createWorkspaceModSlice: CrearSlice<WorkspaceModSlice> = (set, get) => ({
  indice: indiceInicial,
  carpetaActualId: null,
  modelosRecientes: [],
  dialogoGraduarModeloId: null,

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
    set({
      indice: indicePersistido,
      modelosGuardados: modelosGuardadosWorkspace(get),
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
    const modelosGuardados = modelosGuardadosWorkspace(get);
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
    const modelosGuardados = modelosGuardadosWorkspace(get);
    set({
      indice: sincronizarIndiceConModelosGuardados(modelosGuardados, indice),
      modelosGuardados,
      mensaje: "Modelo archivado",
    });
  },

  restaurarModeloPorId(modeloId) {
    const indice = restaurarModeloEnIndiceOp(get().indice, modeloId);
    escribirIndiceWorkspace(indice);
    const modelosGuardados = modelosGuardadosWorkspace(get);
    set({
      indice: sincronizarIndiceConModelosGuardados(modelosGuardados, indice),
      modelosGuardados,
      mensaje: "Modelo restaurado",
    });
  },

  toggleBibliotecaModelo(modeloId) {
    const actual = get().indice.modelos.find((modelo) => modelo.id === modeloId);
    const valor = !(actual?.esBiblioteca ?? false);
    const indice = marcarBibliotecaEnIndiceOp(get().indice, modeloId, valor);
    escribirIndiceWorkspace(indice);
    const modelosGuardados = modelosGuardadosWorkspace(get);
    set({
      indice: sincronizarIndiceConModelosGuardados(modelosGuardados, indice),
      modelosGuardados,
      mensaje: valor ? "Modelo marcado como biblioteca" : "Modelo quitado de bibliotecas",
    });
  },

  // Modo apunte — gemelo de `toggleBibliotecaModelo`. Marca/desmarca la especie
  // apunte (borrador OPM sin rigor de cierre). El MISMO gesto es la promoción:
  // desmarcar gradúa el apunte a modelo (corrección 8). `marcarApunteEnIndiceOp`
  // sella la exclusión mutua con biblioteca (corrección 5).
  toggleApunteModelo(modeloId) {
    const actual = get().indice.modelos.find((modelo) => modelo.id === modeloId);
    const valor = !(actual?.esApunte ?? false);
    const indice = marcarApunteEnIndiceOp(get().indice, modeloId, valor);
    escribirIndiceWorkspace(indice);
    const modelosGuardados = modelosGuardadosWorkspace(get);
    set({
      indice: sincronizarIndiceConModelosGuardados(modelosGuardados, indice),
      modelosGuardados,
      mensaje: valor ? "Modelo marcado como apunte" : "Apunte graduado a modelo",
    });
  },

  // «Momento de graduación» (diseño §3). Abre/cierra el diálogo que pide el
  // nombre definitivo + carpeta y muestra la validez ahora EXIGIBLE (los avisos
  // que en apunte estaban en observación). El id es el del apunte a graduar.
  abrirGraduar(modeloId) {
    set({ dialogoGraduarModeloId: modeloId, mensaje: null });
  },

  cerrarGraduar() {
    set({ dialogoGraduarModeloId: null });
  },

  // Gradúa el apunte: (1) mueve a la carpeta elegida; (2) desmarca la especie
  // apunte (esApunte off en el índice — la cinta desaparece); (3) renombra si
  // cambió (sólo el modelo activo tiene renombrado por id). Orden: los ops SÍNCRONOS
  // de índice primero, el renombrado ASÍNCRONO al final para que su `.then` lea el
  // índice ya graduado. `esApunte` vive sólo en el índice, así que el toggle basta.
  confirmarGraduacion(input) {
    const estado = get();
    const { modeloId, carpetaId } = input;
    const nombreLimpio = input.nombre.trim();
    const carpetaActual = estado.indice.modelos.find((m) => m.id === modeloId)?.carpetaId ?? null;
    if (carpetaId !== carpetaActual) {
      get().moverModeloACarpetaEnIndice(modeloId, carpetaId);
    }
    const entrada = get().indice.modelos.find((m) => m.id === modeloId);
    if (entrada?.esApunte) get().toggleApunteModelo(modeloId);
    const esActivo = estado.modeloPersistidoId === modeloId;
    if (esActivo && nombreLimpio && nombreLimpio !== estado.modelo.nombre) {
      get().renombrarModeloActual(nombreLimpio);
    }
    set({ dialogoGraduarModeloId: null });
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
    const modelosGuardados = modelosGuardadosWorkspace(get);
    set({ indice: sincronizarIndiceConModelosGuardados(modelosGuardados, indice), modelosGuardados, mensaje: "Carpeta archivada" });
  },

  restaurarCarpetaPorId(carpetaId) {
    const indice = restaurarCarpetaEnIndiceOp(get().indice, carpetaId);
    escribirIndiceWorkspace(indice);
    const modelosGuardados = modelosGuardadosWorkspace(get);
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
    if (!persistenciaBackendHabilitada()) {
      set({ mensaje: "Backend de modelos no disponible" });
      return;
    }
    const persistible = construirVersionPersistible(modelo, opts);
    const guardada = await guardarVersionBackend(modeloPersistidoId, persistible.version, persistible.json);
    if (!guardada.ok) {
      set({ mensaje: `No se pudo guardar versión en servidor: ${guardada.error}` });
      return;
    }
    const versionResumen = guardada.value.version;
    try {
      const resumen = modelosGuardadosWorkspace(get).find((item) => item.id === modeloPersistidoId);
      const versiones = [versionResumen, ...(resumen?.versiones ?? [])];
      const indice = {
        ...get().indice,
        modelos: get().indice.modelos.map((item) =>
          item.id === modeloPersistidoId ? { ...item, versiones } : item,
        ),
      };
      escribirIndiceWorkspace(indice);
      set({
        indice,
        modelosGuardados: modelosGuardadosWorkspace(get).map((item) =>
          item.id === modeloPersistidoId ? { ...item, versiones } : item,
        ),
        mensaje: "Versión creada",
      });
    } catch (error) {
      set({ mensaje: error instanceof Error ? error.message : "No se pudo crear versión" });
    }
  }
});

function modelosGuardadosWorkspace(get: GetStore) {
  return persistenciaBackendHabilitada() ? get().modelosGuardados : listarModelosGuardadosSeguro();
}
