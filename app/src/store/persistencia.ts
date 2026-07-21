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
  type ModeloPersistido,
  type ResumenModeloPersistido,
} from "../persistencia/modelos";
import {
  borrarModeloBackend,
  cargarModeloBackend,
  cargarWorkspaceBackend,
  cerrarSesionBackend,
  confirmarRevisionBackend,
  guardarAutosalvadoBackend,
  guardarModeloBackend,
  guardarVersionBackend,
  iniciarSesionBackend,
  listarModelosBackend,
  observarBaseRevisionBackend,
  onBackendUnauthorized,
  obtenerEstadoSesionBackend,
  persistenciaBackendHabilitada,
} from "../persistencia/backend";
import { registrarVersionEnWorkspace } from "../mesa/especieWorkspace";
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
  type WorkspacePersistido,
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
import type { CrearSlice, OpmStore, PersistenciaSlice } from "./tipos";
import {
  ANCHO_PANEL_ARBOL_DEFAULT, ANCHO_PANEL_ARBOL_MAX, ANCHO_PANEL_ARBOL_MIN, PORTAPAPELES_WORKSPACE_TTL_MS, PREF_MOSTRAR_ARCHIVADOS_KEY, PREF_MOSTRAR_VERSIONES_KEY, activarEstadoPestanas, activarPestanaNueva, aparienciaSeleccionadaActiva, commitModelo, confirmarEliminacionOpd, crearIdModeloLocal, entidadNueva, enlaceNuevo, escribirIndiceWorkspace, escribirPreferenciaBooleana, estadoModelo, estadoSeleccionDesdeIds, hermanosOrdenados, leerIndiceWorkspace, leerPreferenciaBooleana, leerPreferenciasMapa, limitar, limitarAnchoPanelArbol, listarModelosGuardadosSeguro, mapaWorkspaceDesdeEstado, marcarSnapshotJson, marcarSnapshotModelo, modelosRecientesDeIndice, obtenerAutosalvadoControl, obtenerEstadoStore, opdActivoSeguro, opdDestinoDeAviso, persistirPreferenciasMapa, fijarAutosalvadoControl, obtenerPollRevisionTimer, fijarPollRevisionTimer, conBaseRevision, mergeWorkspaceBootstrap, observePersistedWorkspace, resetHistorial, setEstadoStore, sincronizarIndiceConModelosGuardados, actualizarPreferenciasUi, validarSubprocesoTimeline,
  pestanaReemplazable,
  resetWorkspacePersistenceRuntime,
  deshacerRuntime,
  rehacerRuntime,
  type GetStore,
  type SetStore,
} from "./runtime";
import {
  advanceSessionEpoch,
  captureSessionEpoch,
  enqueueRemoteLogout,
  isSessionEpochCurrent,
  waitForPendingRemoteLogout,
} from "./sessionEpoch";

import { modeloInicial } from "./modelo";

export type { PersistenciaSlice } from "./tipos";

/** A′-vitrina: intervalo del poll ligero de revisión (patrón autosalvado). */
const POLL_REVISION_MS = 15_000;
let loadRequestSequence = 0;
let listRequestSequence = 0;

export const createPersistenciaSlice: CrearSlice<PersistenciaSlice> = (set, get) => ({
  modelosGuardados: [],
  requiereLogin: false,
  revisionRemota: null,
  revisionBasePorModelo: {},

  async iniciarSesion(email, password) {
    const sessionEpoch = advanceSessionEpoch();
    await waitForPendingRemoteLogout();
    if (!isSessionEpochCurrent(sessionEpoch)) return;
    const resultado = await iniciarSesionBackend(email.trim(), password);
    if (!isSessionEpochCurrent(sessionEpoch)) return;
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    set({ requiereLogin: false, mensaje: null });
    sincronizarListadoBackend(set, get);
  },

  async cerrarSesion() {
    advanceSessionEpoch();
    purgeLocalSession(set, get);
    try {
      const resultado = await enqueueRemoteLogout(cerrarSesionBackend);
      if (!resultado.ok) {
        set({
          mensaje: `Sesión local cerrada; el servidor no confirmó el cierre: ${resultado.error}`,
        });
      }
    } catch {
      set({ mensaje: "Sesión local cerrada; el servidor no confirmó el cierre" });
    }
  },

  async verificarSesion() {
    // Chequeo de montaje (spec §4): bajo login obligatorio el gate debe
    // evaluarse al cargar la app, no recién en la primera acción de
    // persistencia. SOLO consulta /session: un backend caído u otro error no
    // bloquea el workbench (eso lo reporta el flujo de persistencia normal).
    if (!persistenciaBackendHabilitada()) return;
    const sessionEpoch = captureSessionEpoch();
    const estadoSesion = await obtenerEstadoSesionBackend();
    if (!isSessionEpochCurrent(sessionEpoch)) return;
    if (estadoSesion.estado === "requiere-login") {
      advanceSessionEpoch();
      purgeLocalSession(set, get);
    }
  },
  modeloPersistidoId: null,
  descripcionModeloLocal: "",
  workspaceLocal: workspaceDesdeModelo(modeloInicial, null),
  autosalvado: { activo: false, ultimo: null, salvando: false },

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
    const estado = get();
    const snapshotJson = exportarModelo(resultado.value);
    const pestanasAbiertas = estado.pestanasAbiertas.map((pestana) => {
      if (pestana.id !== estado.pestanaActivaId) return pestana;
      return {
        ...pestana,
        modelo: clonarModelo(resultado.value),
        modeloId: null,
        cargadoDesde: "importado" as const,
        dirty: false,
        historialUndo: [],
        cursorUndo: 0,
        seleccionadosPestana: [],
        descripcionModeloLocal: "",
        etiqueta: etiquetaPestana({ nombre: resultado.value.nombre, modeloId: null }),
        snapshotJson,
      };
    });
    set(estadoModelo(resultado.value, {
      pestanasAbiertas,
      opdActivoId: resultado.value.opdRaizId,
      seleccionId: null,
      enlaceSeleccionId: null,
      modoEnlace: null,
      modoCreacion: null,
      modeloPersistidoId: null,
      descripcionModeloLocal: "",
      workspaceLocal: workspaceDesdeModelo(resultado.value, null),
      mensaje: "Modelo importado",
      // B5: un JSON importado entra como modelo editable, nunca como biblioteca.
      readOnly: false,
      esBibliotecaAbierta: false,
    }));
    // W6.0: un modelo CON sello de procedencia solo puede venir del compilador
    // de autoría → es un cruce skill→app del puente (observable g3).
    if (resultado.value.procedencia) {
      get().registrarCrucePuenteSkill("import");
    }
  },

  listarModelosGuardados() {
    if (persistenciaBackendHabilitada()) {
      set({ mensaje: "Cargando modelos desde servidor..." });
      sincronizarListadoBackend(set, get);
      return;
    }
    set({ modelosGuardados: [], mensaje: "Backend de modelos no disponible" });
  },

  guardarLocal(opciones) {
    const sessionEpoch = captureSessionEpoch();
    if (get().readOnly) {
      const estado = get();
      const nombre = nombreCopiaReadOnly(estado.modelo.nombre, estado.modelosGuardados);
      set({ readOnly: false, mensaje: "Modelo en solo lectura — guardando como copia nueva" });
      estado.guardarComoLocal({ nombre, descripcion: estado.descripcionModeloLocal });
      return;
    }
    const {
      modelo,
      modeloPersistidoId,
      descripcionModeloLocal,
      indice,
      pestanaActivaId,
      revisionBasePorModelo,
    } = get();
    if (!modeloPersistidoId) {
      get().abrirGuardarComo();
      return;
    }
    const baseRevision = revisionBasePorModelo[modeloPersistidoId];
    if (typeof baseRevision !== "number") {
      set({ mensaje: "No se puede guardar: recarga el modelo para fijar su revisión base" });
      return;
    }
    const carpetaId = indice.modelos.find((m) => m.id === modeloPersistidoId)?.carpetaId ?? null;
    const json = exportarModelo(modelo, carpetaId);
    const inputGuardado = {
      id: modeloPersistidoId,
      nombre: modelo.nombre,
      descripcion: descripcionModeloLocal,
      json,
      autosalvado: false,
      revision: baseRevision,
      ...(carpetaId !== undefined ? { carpetaId } : {}),
    };
    const existente = get().modelosGuardados.find((item) => item.id === modeloPersistidoId);
    const modeloPersistido = construirModeloPersistido(inputGuardado, existente);
    const finalizarGuardado = (
      guardadoBase: ModeloPersistido,
      mensaje = "Modelo guardado exitosamente",
      revisionConfirmada?: {
        version: VersionResumen;
        workspace: WorkspacePersistido;
      },
    ) => {
      if (!isSessionEpochCurrent(sessionEpoch) ||
        get().requiereLogin ||
        isStoredRevisionObsolete(get, guardadoBase.id, guardadoBase.revision)) {
        return;
      }
      let guardado = guardadoBase;
      let versiones = guardado.versiones ?? [];
      let indiceActualizado = get().indice;
      if (revisionConfirmada) {
        versiones = [
          revisionConfirmada.version,
          ...(get().modelosGuardados.find((item) => item.id === guardado.id)?.versiones ?? [])
            .filter((item) => item.id !== revisionConfirmada.version.id),
        ];
        guardado = { ...guardado, versiones };
        const workspaceObservado = observePersistedWorkspace(
          revisionConfirmada.workspace,
        );
        indiceActualizado = workspaceObservado
          ? mergeWorkspaceBootstrap(
              revisionConfirmada.workspace.indice,
              indice,
              get().indice,
            )
          : registrarVersionEnWorkspace(
              get().indice,
              guardado.id,
              revisionConfirmada.version,
            );
      } else if (guardado.crearVersionAlGuardar) {
        const version = construirVersionPersistible(modelo, { descripcion: "Guardado manual" });
        versiones = [version.version, ...versiones];
        guardado = { ...guardado, versiones };
        void guardarVersionBackend(guardado.id, version.version, version.json).then((resultado) => {
          if (isSessionEpochCurrent(sessionEpoch) && !get().requiereLogin && !resultado.ok) {
            set({ mensaje: `Modelo guardado; no se pudo guardar versión en servidor: ${resultado.error}` });
          }
        });
        indiceActualizado = {
          ...indiceActualizado,
          modelos: indiceActualizado.modelos.map((item) =>
            item.id === guardado.id ? { ...item, versiones } : item,
          ),
        };
        escribirIndiceWorkspace(indiceActualizado);
      }
      const estadoActual = get();
      const pestanaOrigen = estadoActual.pestanasAbiertas.find(
        (pestana) => pestana.id === pestanaActivaId,
      );
      const origenSigueActivo =
        estadoActual.pestanaActivaId === pestanaActivaId &&
        estadoActual.modeloPersistidoId === guardado.id;
      const modeloVivo = origenSigueActivo ? estadoActual.modelo : pestanaOrigen?.modelo;
      const descripcionViva = origenSigueActivo
        ? estadoActual.descripcionModeloLocal
        : (pestanaOrigen?.descripcionModeloLocal ?? descripcionModeloLocal);
      const carpetaActual =
        estadoActual.indice.modelos.find((item) => item.id === guardado.id)?.carpetaId ??
        carpetaId;
      const huboCambiosPosteriores = Boolean(modeloVivo) && (
        exportarModelo(modeloVivo!, carpetaActual) !== json ||
        descripcionViva !== descripcionModeloLocal ||
        carpetaActual !== carpetaId
      );
      const modelosGuardados = upsertModeloGuardado(estadoActual.modelosGuardados, guardado);
      const revisionBasePorModelo = conBaseRevision(
        estadoActual.revisionBasePorModelo,
        guardado.id,
        guardado.revision,
      );
      const mensajeFinal = huboCambiosPosteriores
        ? "Modelo guardado; hay cambios posteriores pendientes"
        : mensaje;
      if (!origenSigueActivo) {
        const snapshotConfirmado = exportarModelo(modelo);
        const pestanasAbiertas = pestanaOrigen
          ? estadoActual.pestanasAbiertas.map((pestana) =>
              pestana.id === pestanaActivaId
                ? {
                    ...pestana,
                    dirty: huboCambiosPosteriores,
                    snapshotJson: snapshotConfirmado,
                  }
                : pestana
            )
          : estadoActual.pestanasAbiertas;
        set({
          mensaje: mensajeFinal,
          modelosGuardados,
          indice: indiceActualizado,
          revisionBasePorModelo,
          pestanasAbiertas,
        });
        return;
      }

      // La respuesta confirma exactamente el snapshot enviado. Si el usuario
      // editó durante la red, esa respuesta avanza la base pero no reemplaza
      // el modelo vivo ni limpia su dirty.
      marcarSnapshotModelo(modelo);
      const descripcionReconciliada = huboCambiosPosteriores
        ? descripcionViva
        : guardado.descripcion;
      const parcial = estadoModelo(modeloVivo!, {
        mensaje: mensajeFinal,
        dirty: huboCambiosPosteriores,
        dirtyModelo: huboCambiosPosteriores ? estadoActual.dirtyModelo : false,
        modeloPersistidoId: guardado.id,
        descripcionModeloLocal: descripcionReconciliada,
        modelosGuardados,
        indice: indiceActualizado,
        workspaceLocal: workspaceDesdeModelo(
          modeloVivo!,
          guardado.id,
          descripcionReconciliada,
          carpetaActual,
        ),
        // A′-vitrina: la base avanza con mi propio guardado (evita cry-wolf).
        revisionBasePorModelo,
      });
      const pestanasAbiertas = (
        parcial.pestanasAbiertas ?? estadoActual.pestanasAbiertas
      ).map((pestana) =>
        pestana.id === pestanaActivaId
          ? { ...pestana, snapshotJson: exportarModelo(modelo) }
          : pestana
      );
      set({ ...parcial, pestanasAbiertas });
    };
    if (persistenciaBackendHabilitada()) {
      if (opciones?.conVersion) {
        set({ mensaje: "Guardando modelo y versión en servidor..." });
        return (async () => {
          const base = await observarBaseRevisionBackend(
            modeloPersistidoId,
            baseRevision,
          );
          if (!isSessionEpochCurrent(sessionEpoch) || get().requiereLogin) return;
          if (!base.ok) {
            set({ mensaje: `No se pudo guardar modelo y versión: ${base.error}` });
            return;
          }
          const version = construirVersionPersistible(modelo, {
            descripcion: "Versión manual",
          });
          const revision = await confirmarRevisionBackend({
            model: modeloPersistido,
            version: version.version,
            base: { kind: "existing", witness: base.value.witness },
            confirmedByOperator: true,
          });
          if (!isSessionEpochCurrent(sessionEpoch) || get().requiereLogin) return;
          if (!revision.ok) {
            set({
              mensaje: revision.error === "sin cambios: no se crea revisión"
                ? "Sin cambios: no se creó una versión"
                : `No se pudo guardar modelo y versión: ${revision.error}`,
            });
            return;
          }
          finalizarGuardado(
            revision.value.model,
            "Modelo y versión guardados",
            {
              version: revision.value.version,
              workspace: revision.value.workspace,
            },
          );
        })();
      }
      set({ mensaje: "Guardando modelo en servidor..." });
      void guardarModeloBackend(modeloPersistido).then((resultado) => {
        if (!isSessionEpochCurrent(sessionEpoch) || get().requiereLogin) return;
        if (resultado.ok) {
          finalizarGuardado(resultado.value);
          return;
        }
        set({ mensaje: `No se pudo guardar en servidor: ${resultado.error}` });
      });
      return;
    }
    set({ mensaje: "Backend de modelos no disponible" });
    return;
  },

  cargarLocal(id) {
    const modeloId = id ?? get().modelosGuardados[0]?.id;
    if (!modeloId) {
      set({ mensaje: "No hay modelos guardados" });
      return;
    }
    if (persistenciaBackendHabilitada()) {
      const requestId = ++loadRequestSequence;
      const sessionEpoch = captureSessionEpoch();
      const estadoOrigen = get();
      const pestanaOrigenId = estadoOrigen.pestanaActivaId;
      const jsonOrigen = exportarModelo(estadoOrigen.modelo);
      const descripcionOrigen = estadoOrigen.descripcionModeloLocal;
      set({ mensaje: "Cargando modelo desde servidor..." });
      void cargarModeloBackend(modeloId).then((cargado) => {
        if (requestId !== loadRequestSequence ||
          !isSessionEpochCurrent(sessionEpoch) ||
          get().requiereLogin) {
          return;
        }
        if (!cargado.ok) {
          set({ mensaje: cargado.error });
          return;
        }
        if (isStoredRevisionObsolete(
          get,
          cargado.value.id,
          cargado.value.revision,
        )) {
          return;
        }
        const estadoActual = get();
        if (estadoActual.pestanaActivaId !== pestanaOrigenId ||
          exportarModelo(estadoActual.modelo) !== jsonOrigen ||
          estadoActual.descripcionModeloLocal !== descripcionOrigen) {
          set({ mensaje: "Carga cancelada: el modelo cambió mientras se esperaba al servidor" });
          return;
        }
        const resultado = hidratarModelo(cargado.value.json);
        if (!resultado.ok) {
          set({ mensaje: resultado.error });
          return;
        }
        const indice = get().indice;
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
        const modelosGuardados = upsertModeloGuardado(get().modelosGuardados, cargado.value);
        set(estadoModelo(resultado.value, {
          opdActivoId: resultado.value.opdRaizId,
          seleccionId: null,
          enlaceSeleccionId: null,
          modoEnlace: null,
          modeloPersistidoId: cargado.value.id,
          descripcionModeloLocal: cargado.value.descripcion,
          modelosGuardados,
          modelosRecientes: modelosRecientesDeIndice(nuevoIndice, modelosGuardados),
          indice: nuevoIndice,
          dialogoCargarModeloAbierto: false,
          carpetaActualId: null,
          workspaceLocal: workspaceDesdeModelo(resultado.value, cargado.value.id, cargado.value.descripcion, carpetaId),
          mensaje: `Modelo cargado: ${cargado.value.nombre}`,
          // A′-vitrina: la base = revisión que acabo de cargar.
          revisionBasePorModelo: conBaseRevision(get().revisionBasePorModelo, cargado.value.id, cargado.value.revision),
        }));
        // B5: abrir una biblioteca → solo-lectura + cinta de modo; cualquier
        // otro modelo limpia ambos (puede venir de tener una biblioteca abierta).
        get().gobernarAperturaBiblioteca(cargado.value.esBiblioteca === true);
        // Centinela de Drift: toda recarga efectiva —incluida «Traer la del
        // agente»— debe reevaluar las piezas sobre el modelo ya hidratado.
        void get().cargarYEvaluarDrift();
      });
      return;
    }
    set({ mensaje: "Backend de modelos no disponible" });
  },

  borrarLocal(id) {
    if (persistenciaBackendHabilitada()) {
      const sessionEpoch = captureSessionEpoch();
      set({ mensaje: "Borrando modelo en servidor..." });
      void borrarModeloBackend(id).then((resultado) => {
        if (!isSessionEpochCurrent(sessionEpoch) || get().requiereLogin) return;
        if (!resultado.ok && resultado.error !== "Modelo no encontrado") {
          set({ mensaje: resultado.error });
          return;
        }
        const indice = {
          ...get().indice,
          modelos: get().indice.modelos.filter((modelo) => modelo.id !== id),
          recientes: get().indice.recientes.filter((reciente) => reciente !== id),
        };
        escribirIndiceWorkspace(indice);
        const extra: Partial<OpmStore> = {
          modelosGuardados: get().modelosGuardados.filter((modelo) => modelo.id !== id),
          indice,
          revisionBasePorModelo: Object.fromEntries(
            Object.entries(get().revisionBasePorModelo).filter(([modeloId]) => modeloId !== id),
          ),
          revisionRemota: get().revisionRemota?.modeloId === id ? null : get().revisionRemota,
          mensaje: "Modelo borrado",
        };
        if (get().modeloPersistidoId === id) {
          marcarSnapshotJson("");
          extra.modeloPersistidoId = null;
          extra.descripcionModeloLocal = "";
          extra.dirty = true;
          extra.workspaceLocal = workspaceDesdeModelo(get().modelo, null);
        }
        set(extra);
      });
      return;
    }
    set({ mensaje: "Backend de modelos no disponible" });
  },

  iniciarAutosalvado() {
    if (obtenerAutosalvadoControl()) return;
    const control = crearAutosalvado({
      esDirty: () => obtenerEstadoStore().dirty && obtenerEstadoStore().modeloPersistidoId !== null,
      ejecutarSalvado: async () => {
        const state = obtenerEstadoStore();
        if (!state.modeloPersistidoId) return false;
        const sessionEpoch = captureSessionEpoch();
        const carpetaId = state.indice.modelos.find((m) => m.id === state.modeloPersistidoId)?.carpetaId;
        const json = exportarModelo(state.modelo, carpetaId);
        const existente = state.modelosGuardados.find((item) => item.id === state.modeloPersistidoId);
        const revisionBase = state.revisionBasePorModelo[state.modeloPersistidoId] ?? existente?.revision;
        if (typeof revisionBase !== "number") return false;
        if (!persistenciaBackendHabilitada()) return false;
        const guardado = await guardarAutosalvadoBackend(
          state.modeloPersistidoId,
          json,
          revisionBase,
        );
        if (!isSessionEpochCurrent(sessionEpoch) ||
          obtenerAutosalvadoControl() !== control ||
          obtenerEstadoStore().requiereLogin) {
          return false;
        }
        if (guardado.ok) {
          const current = obtenerEstadoStore();
          if (knownRevision(current, state.modeloPersistidoId) > revisionBase) return false;
          const pestanaOrigen = current.pestanasAbiertas.find(
            (pestana) => pestana.id === state.pestanaActivaId,
          );
          const origenSigueActivo =
            current.pestanaActivaId === state.pestanaActivaId &&
            current.modeloPersistidoId === state.modeloPersistidoId;
          const modeloVivo = origenSigueActivo ? current.modelo : pestanaOrigen?.modelo;
          const descripcionViva = origenSigueActivo
            ? current.descripcionModeloLocal
            : (pestanaOrigen?.descripcionModeloLocal ?? state.descripcionModeloLocal);
          const carpetaActual = current.indice.modelos
            .find((item) => item.id === state.modeloPersistidoId)?.carpetaId ?? carpetaId;
          const huboCambiosPosteriores = Boolean(modeloVivo) && (
            exportarModelo(modeloVivo!, carpetaActual) !== json ||
            descripcionViva !== state.descripcionModeloLocal ||
            carpetaActual !== carpetaId
          );
          const modelosGuardados = current.modelosGuardados.map((modelo) =>
            modelo.id === state.modeloPersistidoId
              ? { ...modelo, autosalvado: true }
              : modelo
          );
          if (!origenSigueActivo) {
            const pestanasAbiertas = pestanaOrigen
              ? current.pestanasAbiertas.map((pestana) =>
                  pestana.id === state.pestanaActivaId
                    ? {
                        ...pestana,
                        dirty: huboCambiosPosteriores,
                        snapshotJson: exportarModelo(state.modelo),
                      }
                    : pestana
                )
              : current.pestanasAbiertas;
            setEstadoStore({
              modelosGuardados,
              pestanasAbiertas,
            });
            return true;
          }

          marcarSnapshotModelo(state.modelo);
          const parcial = estadoModelo(modeloVivo!, {
            dirty: huboCambiosPosteriores,
            dirtyModelo: huboCambiosPosteriores ? current.dirtyModelo : false,
            modelosGuardados,
            autosalvado: obtenerAutosalvadoControl()?.estado() ?? { activo: false, ultimo: null, salvando: false },
            ...(huboCambiosPosteriores
              ? { mensaje: "Autosalvado completado; hay cambios posteriores pendientes" }
              : {}),
          });
          const pestanasAbiertas = (
            parcial.pestanasAbiertas ?? current.pestanasAbiertas
          ).map((pestana) =>
            pestana.id === state.pestanaActivaId
              ? { ...pestana, snapshotJson: exportarModelo(state.modelo) }
              : pestana
          );
          setEstadoStore({ ...parcial, pestanasAbiertas });
          return true;
        }
        setEstadoStore({ mensaje: `No se pudo autosalvar en servidor: ${guardado.error}` });
        return false;
      },
    });
    fijarAutosalvadoControl(control);
    control.onEstado((estado) => {
      if (obtenerAutosalvadoControl() === control) {
        setEstadoStore({ autosalvado: estado });
      }
    });
    control.iniciar();
  },

  detenerAutosalvado() {
    obtenerAutosalvadoControl()?.detener();
    fijarAutosalvadoControl(null);
    set({ autosalvado: { activo: false, ultimo: null, salvando: false } });
  },

  // ── A′-vitrina: poll de revisión + traer la del agente ──

  async verificarRevisionRemota() {
    const modeloId = get().modeloPersistidoId;
    if (!modeloId || !persistenciaBackendHabilitada()) return;
    const sessionEpoch = captureSessionEpoch();
    const cargado = await cargarModeloBackend(modeloId);
    if (!cargado.ok || typeof cargado.value.revision !== "number") return;
    // Anti-race: sólo fija si el modelo activo sigue siendo el mismo.
    if (!isSessionEpochCurrent(sessionEpoch) ||
      get().requiereLogin ||
      get().modeloPersistidoId !== modeloId) {
      return;
    }
    const revisionConocida = knownRevision(get(), modeloId);
    if (cargado.value.revision < revisionConocida) return;
    set({ revisionRemota: { modeloId, revision: cargado.value.revision } });
  },

  iniciarPollRevision() {
    if (obtenerPollRevisionTimer()) return;
    void get().verificarRevisionRemota();
    const timer = setInterval(() => { void obtenerEstadoStore().verificarRevisionRemota(); }, POLL_REVISION_MS);
    fijarPollRevisionTimer(timer);
  },

  detenerPollRevision() {
    const timer = obtenerPollRevisionTimer();
    if (timer) clearInterval(timer);
    fijarPollRevisionTimer(null);
  },

  traerRevisionDelAgente() {
    const modeloId = get().modeloPersistidoId;
    if (!modeloId) return;
    // Recarga la revisión del agente (misma acción para «Recargar» y
    // «Descartar los míos…»); cargarLocal avanza la base y limpia dirty.
    set({ revisionRemota: null });
    get().cargarLocal(modeloId);
  },

  verVersionDelAgente() {
    const modeloId = get().modeloPersistidoId;
    if (!modeloId) return;
    // Refresca versiones (para que aparezca el push del agente) y reusa el
    // visor de versiones existente — no se construye visor nuevo.
    get().listarModelosGuardados();
    get().abrirDialogoVersiones(modeloId);
  }
});

function purgeLocalSession(set: SetStore, get: GetStore): void {
  get().detenerAutosalvado();
  get().detenerPollRevision();
  resetWorkspacePersistenceRuntime();
  const modelo = crearModelo("Modelo");
  const pestana = crearPestanaNueva({ modelo });
  resetHistorial(modelo);
  set(estadoModelo(modelo, {
    requiereLogin: true,
    modelosGuardados: [],
    modelosRecientes: [],
    indice: indiceVacio(),
    workspaceRevision: null,
    carpetaActualId: null,
    revisionBasePorModelo: {},
    revisionRemota: null,
    modeloPersistidoId: null,
    descripcionModeloLocal: "",
    workspaceLocal: workspaceDesdeModelo(modelo, null),
    pestanasAbiertas: [pestana],
    pestanaActivaId: pestana.id,
    opdActivoId: modelo.opdRaizId,
    seleccionId: null,
    seleccionados: [],
    modoSeleccion: "simple",
    enlaceSeleccionId: null,
    estadoSeleccionId: null,
    modoEnlace: null,
    eligiendoOrigenEnlace: false,
    modoCreacion: null,
    nuevaCosaPendiente: null,
    refinamientoPendiente: null,
    confirmacionEliminarRefinamiento: null,
    colisionPendiente: null,
    filtroOplPorSeleccion: false,
    hoverOplRef: null,
    busquedaOpl: "",
    solicitarFocusNombre: null,
    colaRenombradoPendiente: [],
    idsResaltadosTemporales: [],
    portapapelesVisual: null,
    portapapelesWorkspace: null,
    driftMap: {},
    menuPrincipalAbierto: false,
    toolbarMasAbierto: false,
    busquedaGlobal: { query: "", resultados: [], enProgreso: false },
    dialogoVersionesAbierto: null,
    dialogoBuscarGlobalAbierto: false,
    busquedaCosasAbierta: false,
    busquedaCosasQuery: "",
    busquedaCosasFiltro: "todos",
    dialogoGuardarComoAbierto: false,
    dialogoCargarModeloAbierto: false,
    dialogoImportarExportarJsonAbierto: false,
    dialogoComandosAbierto: false,
    dialogoConfiguracionAbierto: false,
    dialogoSimulacionNumericaAbierto: false,
    dialogoTraerConectadosAbierto: false,
    dialogoOntologiaAbierto: false,
    dialogoRequisitoAbierto: null,
    dialogoSubmodeloAbierto: false,
    dialogoComposicionAbierto: false,
    vitrinaEstereotiposAbierta: false,
    dialogoGraduarModeloId: null,
    graduacionDestino: "modelo",
    graduacionModeloObjetivo: null,
    graduacionDescripcionObjetivo: "",
    graduacionRevisionObjetivo: null,
    graduacionCarpetaObjetivo: null,
    graduacionEnCurso: false,
    graduacionError: null,
    dialogoRolBibliotecaModeloId: null,
    modalUrlsAbierto: null,
    modalImagenAbierto: null,
    modalDuracionAbierto: null,
    tablaEnlacesAbierta: false,
    tablaEnlacesFiltroTipo: "todos",
    tablaEnlacesOrdenColumna: null,
    tablaEnlacesOrdenDireccion: "asc",
    gestionArbolAbierta: false,
    busquedaOpdGestion: "",
    contextoSimulacion: null,
    readOnlyPrevSimulacion: null,
    autoAvanceSimulacionActivo: false,
    descriptorMapaCache: null,
    vistaMapaActiva: false,
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
    readOnly: false,
    esBibliotecaAbierta: false,
    dirty: false,
    dirtyModelo: false,
    mensaje: null,
  }));
}

export function connectBackendSessionBoundary(set: SetStore, get: GetStore): () => void {
  return onBackendUnauthorized(() => {
    advanceSessionEpoch();
    purgeLocalSession(set, get);
  });
}

function knownRevision(state: OpmStore, modeloId: string): number {
  const resumen = state.modelosGuardados.find((modelo) => modelo.id === modeloId)?.revision;
  const base = state.revisionBasePorModelo[modeloId];
  const remota = state.revisionRemota?.modeloId === modeloId
    ? state.revisionRemota.revision
    : undefined;
  return Math.max(
    typeof resumen === "number" ? resumen : -1,
    typeof base === "number" ? base : -1,
    typeof remota === "number" ? remota : -1,
  );
}

function isStoredRevisionObsolete(
  get: GetStore,
  modeloId: string,
  revision: number | undefined,
): boolean {
  return typeof revision === "number" && revision < knownRevision(get(), modeloId);
}

function sincronizarListadoBackend(set: SetStore, get: GetStore): void {
  if (!persistenciaBackendHabilitada()) return;
  const requestId = ++listRequestSequence;
  const sessionEpoch = captureSessionEpoch();
  const modelosAlInicio = get().modelosGuardados;
  const indexAtStart = get().indice;
  const messageAtStart = get().mensaje;
  const requestIsCurrent = () =>
    requestId === listRequestSequence &&
    isSessionEpochCurrent(sessionEpoch);

  void obtenerEstadoSesionBackend().then((estadoSesion) => {
    if (!requestIsCurrent()) return null;
    if (estadoSesion.estado === "requiere-login") {
      // Auth v1 (spec §4): el backend exige login — la UI monta PantallaLogin.
      advanceSessionEpoch();
      purgeLocalSession(set, get);
      return null;
    }
    if (estadoSesion.estado === "error") {
      set({ modelosGuardados: [], mensaje: estadoSesion.error });
      return null;
    }
    return Promise.all([listarModelosBackend(), cargarWorkspaceBackend()]);
  }).then((resultados) => {
    if (!resultados || !requestIsCurrent()) return;
    // Si un save/delete cambió el listado durante la red, este snapshot nació
    // antes de ese cambio y no puede reemplazarlo.
    if (get().modelosGuardados !== modelosAlInicio) return;
    const [modelosResultado, workspaceResultado] = resultados;
    if (!modelosResultado.ok) {
      set({ modelosGuardados: [], mensaje: modelosResultado.error });
      return;
    }
    const currentState = get();
    let baseIndex = currentState.indice;
    if (workspaceResultado.ok) {
      const workspace = workspaceResultado.value;
      const snapshotDoesNotRewind = currentState.workspaceRevision === null ||
        workspace.revision >= currentState.workspaceRevision;
      if (snapshotDoesNotRewind && observePersistedWorkspace(workspace)) {
        baseIndex = currentState.indice === indexAtStart
          ? workspace.indice
          : mergeWorkspaceBootstrap(
              workspace.indice,
              indexAtStart,
              currentState.indice,
            );
      }
    }
    const indice = sincronizarIndiceConModelosGuardados(modelosResultado.value, baseIndex);
    const currentMessage = get().mensaje;
    const mensaje = workspaceResultado.ok
      ? (currentMessage === messageAtStart ? null : currentMessage)
      : workspaceResultado.error;
    set({
      modelosGuardados: modelosResultado.value,
      indice,
      modelosRecientes: modelosRecientesDeIndice(indice, modelosResultado.value),
      mensaje,
    });
  }).catch(() => {
    if (!requestIsCurrent()) return;
    set({ modelosGuardados: [], mensaje: "No se pudo conectar al backend de modelos" });
  });
}

function upsertModeloGuardado(modelos: ResumenModeloPersistido[], modelo: ModeloPersistido): ResumenModeloPersistido[] {
  const actual = modelos.find((item) => item.id === modelo.id);
  if (
    typeof actual?.revision === "number" &&
    typeof modelo.revision === "number" &&
    actual.revision > modelo.revision
  ) {
    return modelos;
  }
  return [resumenDesdeModeloPersistido(modelo), ...modelos.filter((item) => item.id !== modelo.id)]
    .sort((a, b) => b.actualizadoEn.localeCompare(a.actualizadoEn));
}

function nombreCopiaReadOnly(nombre: string, modelos: ResumenModeloPersistido[]): string {
  const base = `${nombre.trim() || "Modelo"} copia`;
  for (let i = 1; i < 100; i += 1) {
    const candidato = i === 1 ? base : `${base} ${i}`;
    if (validarNombreModeloLocal(candidato, modelos).ok) return candidato;
  }
  return `${base} ${Date.now()}`;
}
