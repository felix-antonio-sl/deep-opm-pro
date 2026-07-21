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
  construirModeloPersistido,
  resumenDesdeModeloPersistido,
  type ResumenModeloPersistido,
} from "../persistencia/modelos";
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
import {
  cargarModeloBackend,
  confirmarRevisionBackend,
  guardarVersionBackend,
  observarBaseRevisionBackend,
  persistenciaBackendHabilitada,
} from "../persistencia/backend";
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
  etiquetaPestana,
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
  ANCHO_PANEL_ARBOL_DEFAULT, ANCHO_PANEL_ARBOL_MAX, ANCHO_PANEL_ARBOL_MIN, PORTAPAPELES_WORKSPACE_TTL_MS, PREF_MOSTRAR_ARCHIVADOS_KEY, PREF_MOSTRAR_VERSIONES_KEY, activarEstadoPestanas, activarPestanaNueva, aparienciaSeleccionadaActiva, commitModelo, confirmarEliminacionOpd, conBaseRevision, crearIdModeloLocal, entidadNueva, enlaceNuevo, escribirIndiceWorkspace, escribirPreferenciaBooleana, estadoModelo, estadoSeleccionDesdeIds, hermanosOrdenados, leerIndiceWorkspace, leerPreferenciaBooleana, leerPreferenciasMapa, limitar, limitarAnchoPanelArbol, listarModelosGuardadosSeguro, mapaWorkspaceDesdeEstado, marcarSnapshotJson, marcarSnapshotModelo, mergeWorkspaceBootstrap, modelosRecientesDeIndice, observePersistedWorkspace, obtenerAutosalvadoControl, obtenerEstadoStore, opdActivoSeguro, opdDestinoDeAviso, persistirPreferenciasMapa, fijarAutosalvadoControl, resetHistorial, setEstadoStore, sincronizarIndiceConModelosGuardados, actualizarPreferenciasUi, validarSubprocesoTimeline,
  pestanaReemplazable,
  deshacerRuntime,
  rehacerRuntime,
  type GetStore,
} from "./runtime";
import { captureSessionEpoch, isSessionEpochCurrent } from "./sessionEpoch";
export const indiceInicial = leerIndiceWorkspace();

export type { WorkspaceModSlice } from "./tipos";

export const createWorkspaceModSlice: CrearSlice<WorkspaceModSlice> = (set, get) => ({
  indice: indiceInicial,
  workspaceRevision: null,
  carpetaActualId: null,
  modelosRecientes: [],
  dialogoGraduarModeloId: null,
  graduacionDestino: "modelo",
  graduacionModeloObjetivo: null,
  graduacionDescripcionObjetivo: "",
  graduacionRevisionObjetivo: null,
  graduacionCarpetaObjetivo: null,
  graduacionEnCurso: false,
  graduacionError: null,
  dialogoRolBibliotecaModeloId: null,

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
    if (!actual) {
      set({ mensaje: "Modelo no encontrado" });
      return;
    }
    if (actual.esApunte === true) {
      get().abrirGraduar(modeloId, "biblioteca");
      return;
    }
    set({ dialogoRolBibliotecaModeloId: modeloId, mensaje: null });
  },

  confirmarRolBiblioteca() {
    const estado = get();
    const modeloId = estado.dialogoRolBibliotecaModeloId;
    if (!modeloId) return;
    const actual = estado.indice.modelos.find((modelo) => modelo.id === modeloId);
    if (!actual || actual.esApunte === true) {
      set({ dialogoRolBibliotecaModeloId: null, mensaje: "El rol del modelo cambió; revisa antes de confirmar." });
      return;
    }
    const valor = actual.esBiblioteca !== true;
    const indice = marcarBibliotecaEnIndiceOp(estado.indice, modeloId, valor);
    escribirIndiceWorkspace(indice);
    const modelosGuardados = modelosGuardadosWorkspace(get);
    set({
      dialogoRolBibliotecaModeloId: null,
      indice: sincronizarIndiceConModelosGuardados(modelosGuardados, indice),
      modelosGuardados,
      mensaje: valor
        ? "Ahora es Modelo de Biblioteca · el contenido y el rigor no cambiaron"
        : "Ahora es Modelo de Trabajo · no volvió a Apunte",
    });
  },

  cancelarRolBiblioteca() {
    set({ dialogoRolBibliotecaModeloId: null, mensaje: null });
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
  abrirGraduar(modeloId, destino = "modelo") {
    const estado = get();
    const entrada = estado.indice.modelos.find((modelo) => modelo.id === modeloId);
    if (entrada?.esApunte !== true) {
      set({ mensaje: "El modelo ya no es un Apunte" });
      return;
    }
    const activo = estado.modeloPersistidoId === modeloId && estado.modelo.id === modeloId;
    const base = {
      dialogoGraduarModeloId: modeloId,
      graduacionDestino: destino,
      graduacionModeloObjetivo: activo ? estado.modelo : null,
      graduacionDescripcionObjetivo: activo ? estado.descripcionModeloLocal : "",
      graduacionRevisionObjetivo: activo ? (estado.revisionBasePorModelo[modeloId] ?? null) : null,
      graduacionCarpetaObjetivo: entrada.carpetaId,
      graduacionEnCurso: !activo,
      graduacionError: null,
      mensaje: null,
    } as const;
    set(base);
    if (activo) return;
    if (!persistenciaBackendHabilitada()) {
      set({
        graduacionEnCurso: false,
        graduacionError: "No se pudo preparar la transición · Persistencia backend no disponible",
      });
      return;
    }
    const sessionEpoch = captureSessionEpoch();
    void cargarModeloBackend(modeloId).then((cargado) => {
      if (!isSessionEpochCurrent(sessionEpoch) || get().requiereLogin || get().dialogoGraduarModeloId !== modeloId) return;
      if (!cargado.ok) {
        set({
          graduacionEnCurso: false,
          graduacionError: `No se pudo preparar la transición · ${cargado.error}`,
        });
        return;
      }
      const hidratado = hidratarModelo(cargado.value.json);
      if (!hidratado.ok || typeof cargado.value.revision !== "number") {
        set({
          graduacionEnCurso: false,
          graduacionError: !hidratado.ok
            ? `No se pudo preparar la transición · ${hidratado.error}`
            : "No se pudo preparar la transición · Revisión base ausente",
        });
        return;
      }
      set({
        graduacionModeloObjetivo: hidratado.value,
        graduacionDescripcionObjetivo: cargado.value.descripcion,
        graduacionRevisionObjetivo: cargado.value.revision,
        graduacionCarpetaObjetivo: cargado.value.carpetaId ?? null,
        graduacionEnCurso: false,
        graduacionError: null,
      });
    });
  },

  cerrarGraduar() {
    if (get().graduacionEnCurso && get().graduacionModeloObjetivo) return;
    set({
      dialogoGraduarModeloId: null,
      graduacionDestino: "modelo",
      graduacionModeloObjetivo: null,
      graduacionDescripcionObjetivo: "",
      graduacionRevisionObjetivo: null,
      graduacionCarpetaObjetivo: null,
      graduacionError: null,
    });
  },

  // La graduación cruza el endpoint de revisión atómica: nombre/documento,
  // versión, destino y especie se confirman juntos en servidor. El store no
  // publica ningún cambio local hasta recibir ese recibo.
  confirmarGraduacion(input) {
    const estado = get();
    const nombreLimpio = input.nombre.trim();
    const fallarAntesDePersistir = (causa: string) => {
      set({
        graduacionEnCurso: false,
        graduacionError: `No se pudo graduar · ${causa} · Reintentar`,
        mensaje: null,
      });
    };
    if (estado.graduacionEnCurso) return;
    if (!nombreLimpio) {
      fallarAntesDePersistir("El nombre no puede quedar vacío");
      return;
    }
    const modeloInicial = estado.graduacionModeloObjetivo;
    if (!modeloInicial || modeloInicial.id !== input.modeloId) {
      fallarAntesDePersistir("El Apunte no está preparado");
      return;
    }
    const entrada = estado.indice.modelos.find((modelo) => modelo.id === input.modeloId);
    if (entrada?.esApunte !== true) {
      fallarAntesDePersistir("El modelo ya no es un Apunte");
      return;
    }
    const validacionNombre = validarNombreModeloLocal(
      nombreLimpio,
      estado.modelosGuardados,
      input.modeloId,
    );
    if (!validacionNombre.ok) {
      fallarAntesDePersistir(validacionNombre.error ?? "Nombre de modelo inválido");
      return;
    }
    const baseRevision = estado.graduacionRevisionObjetivo;
    if (typeof baseRevision !== "number") {
      fallarAntesDePersistir("Recarga el Apunte para fijar su revisión base");
      return;
    }
    if (!persistenciaBackendHabilitada()) {
      fallarAntesDePersistir("Persistencia backend no disponible");
      return;
    }

    const sessionEpoch = captureSessionEpoch();
    const pestanaOrigenId = estado.pestanasAbiertas.find((pestana) => pestana.modeloId === input.modeloId)?.id ?? null;
    const indiceInicial = estado.indice;
    const descripcionInicial = estado.graduacionDescripcionObjetivo;
    const destinoGraduacion = estado.graduacionDestino;
    const modeloCandidato: Modelo = { ...modeloInicial, nombre: validacionNombre.nombre };
    set({
      graduacionEnCurso: true,
      graduacionError: null,
      mensaje: destinoGraduacion === "biblioteca" ? "Graduando y marcando Biblioteca…" : "Graduando Apunte…",
    });

    void (async () => {
      const base = await observarBaseRevisionBackend(input.modeloId, baseRevision);
      if (!isSessionEpochCurrent(sessionEpoch) || get().requiereLogin) return;
      if (!base.ok) {
        fallarAntesDePersistir(base.error);
        return;
      }
      const persistido = construirModeloPersistido({
        id: input.modeloId,
        nombre: validacionNombre.nombre,
        descripcion: descripcionInicial,
        json: exportarModelo(modeloCandidato, input.carpetaId),
        autosalvado: false,
        revision: baseRevision,
        carpetaId: input.carpetaId,
      }, base.value.model);
      const version = construirVersionPersistible(modeloCandidato, {
        nombre: destinoGraduacion === "biblioteca" ? "Graduación a Modelo de Biblioteca" : "Graduación a Modelo",
        descripcion: destinoGraduacion === "biblioteca"
          ? "Snapshot confirmado al graduar el Apunte y cambiar su rol"
          : "Snapshot confirmado al graduar el Apunte",
      });
      const resultado = await confirmarRevisionBackend({
        model: persistido,
        version: version.version,
        base: { kind: "existing", witness: base.value.witness },
        graduation: {
          kind: "graduate",
          folderId: input.carpetaId,
          role: destinoGraduacion === "biblioteca" ? "library" : "work",
        },
        confirmedByOperator: true,
      });
      if (!isSessionEpochCurrent(sessionEpoch) || get().requiereLogin) return;
      if (!resultado.ok) {
        fallarAntesDePersistir(resultado.error);
        return;
      }

      observePersistedWorkspace(resultado.value.workspace);
      const actual = get();
      const indice = mergeWorkspaceBootstrap(
        resultado.value.workspace.indice,
        indiceInicial,
        actual.indice,
      );
      const entradaConfirmada = indice.modelos.find((modelo) => modelo.id === input.modeloId);
      const resumen = {
        ...resumenDesdeModeloPersistido(resultado.value.model),
        ...(entradaConfirmada?.versiones ? { versiones: entradaConfirmada.versiones } : {}),
      };
      const modelosGuardados = [
        resumen,
        ...actual.modelosGuardados.filter((modelo) => modelo.id !== input.modeloId),
      ].sort((a, b) => b.actualizadoEn.localeCompare(a.actualizadoEn));
      const revisionBasePorModelo = conBaseRevision(
        actual.revisionBasePorModelo,
        input.modeloId,
        resultado.value.model.revision,
      );
      const pestanaOrigen = pestanaOrigenId
        ? actual.pestanasAbiertas.find((pestana) => pestana.id === pestanaOrigenId)
        : undefined;
      const origenSigueActivo = pestanaOrigenId !== null && actual.pestanaActivaId === pestanaOrigenId &&
        actual.modeloPersistidoId === input.modeloId;
      const modeloVivoBase = origenSigueActivo ? actual.modelo : pestanaOrigen?.modelo;
      const modeloVivo = modeloVivoBase
        ? { ...modeloVivoBase, nombre: validacionNombre.nombre }
        : modeloCandidato;
      const huboCambiosPosteriores = Boolean(modeloVivoBase) &&
        exportarModelo(modeloVivoBase!) !== exportarModelo(modeloInicial);
      const snapshotConfirmado = exportarModelo(modeloCandidato);
      const especieRecibo = destinoGraduacion === "biblioteca" ? "Modelo de Biblioteca" : "Modelo";
      const recibo = input.bloqueos === 0 && input.mejoras === 0
        ? `Ahora es ${especieRecibo} · sin pendientes de cierre`
        : `Ahora es ${especieRecibo} · ${input.bloqueos} bloqueos · ${input.mejoras} mejoras`;

      if (!origenSigueActivo) {
        set({
          pestanasAbiertas: actual.pestanasAbiertas.map((pestana) =>
            pestanaOrigenId !== null && pestana.id === pestanaOrigenId
              ? {
                  ...pestana,
                  modelo: modeloVivo,
                  etiqueta: etiquetaPestana({ nombre: modeloVivo.nombre, modeloId: input.modeloId }),
                  dirty: huboCambiosPosteriores,
                  snapshotJson: snapshotConfirmado,
                }
              : pestana
          ),
          indice,
          modelosGuardados,
          revisionBasePorModelo,
          dialogoGraduarModeloId: null,
          graduacionDestino: "modelo",
          graduacionModeloObjetivo: null,
          graduacionDescripcionObjetivo: "",
          graduacionRevisionObjetivo: null,
          graduacionCarpetaObjetivo: null,
          graduacionEnCurso: false,
          graduacionError: null,
          mensaje: recibo,
        });
        return;
      }

      marcarSnapshotModelo(modeloCandidato);
      const parcial = estadoModelo(modeloVivo, {
        dirty: huboCambiosPosteriores,
        dirtyModelo: huboCambiosPosteriores ? actual.dirtyModelo : false,
        indice,
        modelosGuardados,
        revisionBasePorModelo,
        carpetaActualId: input.carpetaId,
        workspaceLocal: workspaceDesdeModelo(
          modeloVivo,
          input.modeloId,
          actual.descripcionModeloLocal,
          input.carpetaId,
        ),
        dialogoGraduarModeloId: null,
        graduacionDestino: "modelo",
        graduacionModeloObjetivo: null,
        graduacionDescripcionObjetivo: "",
        graduacionRevisionObjetivo: null,
        graduacionCarpetaObjetivo: null,
        graduacionEnCurso: false,
        graduacionError: null,
        mensaje: recibo,
      });
      const pestanasAbiertas = (parcial.pestanasAbiertas ?? actual.pestanasAbiertas).map((pestana) =>
        pestanaOrigenId !== null && pestana.id === pestanaOrigenId
          ? { ...pestana, snapshotJson: snapshotConfirmado }
          : pestana
      );
      set({ ...parcial, pestanasAbiertas });
    })();
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
    if (!get().modeloPersistidoId) {
      set({ mensaje: "Guarda el modelo antes de versionarlo" });
      return;
    }
    await get().guardarLocal({ conVersion: true });
  },

  async crearVersionAhora(opts) {
    const operation = "version-create" as const;
    const { modelo, modeloPersistidoId } = get();
    const sessionEpoch = captureSessionEpoch();
    const pestanaOrigenId = get().pestanaActivaId;
    if (!modeloPersistidoId) {
      const error = "Guarda el modelo antes de versionarlo";
      set({ mensaje: opts?.feedback === "receipt" ? null : error });
      return { ok: false, operation, error };
    }
    if (!persistenciaBackendHabilitada()) {
      const error = "Backend de modelos no disponible";
      set({ mensaje: opts?.feedback === "receipt" ? null : error });
      return { ok: false, operation, error };
    }
    const persistible = construirVersionPersistible(modelo, opts);
    const guardada = await guardarVersionBackend(modeloPersistidoId, persistible.version, persistible.json);
    if (!versionOriginIsCurrent(get, sessionEpoch, pestanaOrigenId, modeloPersistidoId)) {
      return { ok: false, operation, error: "El contexto cambió antes de completar la versión" };
    }
    if (!guardada.ok) {
      const error = `No se pudo guardar versión en servidor: ${guardada.error}`;
      set({ mensaje: opts?.feedback === "receipt" ? null : error });
      return { ok: false, operation, error };
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
        mensaje: opts?.feedback === "receipt" ? null : "Versión creada",
      });
      return {
        ok: true,
        operation,
        resultId: versionResumen.id,
        modelId: modeloPersistidoId,
        versionId: versionResumen.id,
      };
    } catch (error) {
      const detail = error instanceof Error ? error.message : "No se pudo crear versión";
      set({ mensaje: opts?.feedback === "receipt" ? null : detail });
      return { ok: false, operation, error: detail };
    }
  }
});

function modelosGuardadosWorkspace(get: GetStore) {
  return persistenciaBackendHabilitada() ? get().modelosGuardados : listarModelosGuardadosSeguro();
}

function versionOriginIsCurrent(
  get: GetStore,
  sessionEpoch: number,
  pestanaOrigenId: string,
  modeloPersistidoId: string | null,
): boolean {
  const estado = get();
  return isSessionEpochCurrent(sessionEpoch) &&
    !estado.requiereLogin &&
    estado.pestanaActivaId === pestanaOrigenId &&
    estado.modeloPersistidoId === modeloPersistidoId;
}
