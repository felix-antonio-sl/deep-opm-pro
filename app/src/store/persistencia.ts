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
  guardarAutosalvadoBackend,
  guardarModeloBackend,
  guardarVersionBackend,
  listarModelosBackend,
  obtenerSesionBackend,
  persistenciaBackendHabilitada,
} from "../persistencia/backend";
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
import { construirVersionPersistible } from "../persistencia/versiones";
import {
  crearAutosalvado,
  type AutosalvadoEstado,
  type AutosalvadoControl,
} from "../persistencia/autosalvado";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import type { Aviso } from "../modelo/validaciones";
import type { Afiliacion, Apariencia, DesignacionEstado, DuracionTemporal, Esencia, ExtremoEnlace, Id, LayoutEstados, Modelo, Modificador, ModoDespliegueObjeto, ModoPlegado, Opd, OperadorAbanico, OrdenPartesPlegado, Pestana, PestanaId, Posicion, TipoEnlace, TipoEntidad, UrlObjetoTipada, UiPortapapelesVisual } from "../modelo/tipos";
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
  ANCHO_PANEL_ARBOL_DEFAULT, ANCHO_PANEL_ARBOL_MAX, ANCHO_PANEL_ARBOL_MIN, PORTAPAPELES_WORKSPACE_TTL_MS, PREF_MOSTRAR_ARCHIVADOS_KEY, PREF_MOSTRAR_VERSIONES_KEY, activarEstadoPestanas, activarPestanaNueva, aparienciaSeleccionadaActiva, commitModelo, confirmarEliminacionOpd, crearIdModeloLocal, entidadNueva, enlaceNuevo, escribirIndiceWorkspace, escribirPreferenciaBooleana, estadoModelo, estadoSeleccionDesdeIds, hermanosOrdenados, leerIndiceWorkspace, leerPreferenciaBooleana, leerPreferenciasMapa, limitar, limitarAnchoPanelArbol, listarModelosGuardadosSeguro, mapaWorkspaceDesdeEstado, marcarSnapshotJson, marcarSnapshotModelo, modelosRecientesDeIndice, obtenerAutosalvadoControl, obtenerEstadoStore, opdActivoSeguro, opdDestinoDeAviso, persistirPreferenciasMapa, fijarAutosalvadoControl, fusionarPreferenciasBootstrap, resetHistorial, setEstadoStore, sincronizarIndiceConModelosGuardados, actualizarPreferenciasUi, validarSubprocesoTimeline,
  pestanaReemplazable,
  deshacerRuntime,
  rehacerRuntime,
  type GetStore,
  type SetStore,
} from "./runtime";

import { modeloInicial } from "./modelo";

export type { PersistenciaSlice } from "./tipos";

export const createPersistenciaSlice: CrearSlice<PersistenciaSlice> = (set, get) => ({
  modelosGuardados: [],
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

  guardarLocal() {
    if (get().readOnly) {
      const estado = get();
      const nombre = nombreCopiaReadOnly(estado.modelo.nombre, estado.modelosGuardados);
      set({ readOnly: false, mensaje: "Modelo en solo lectura — guardando como copia nueva" });
      estado.guardarComoLocal({ nombre, descripcion: estado.descripcionModeloLocal });
      return;
    }
    const { modelo, modeloPersistidoId, descripcionModeloLocal, indice } = get();
    if (!modeloPersistidoId) {
      get().abrirGuardarComo();
      return;
    }
    const carpetaId = indice.modelos.find((m) => m.id === modeloPersistidoId)?.carpetaId ?? null;
    const json = exportarModelo(modelo, carpetaId);
    const inputGuardado = {
      id: modeloPersistidoId,
      nombre: modelo.nombre,
      descripcion: descripcionModeloLocal,
      json,
      ...(carpetaId !== undefined ? { carpetaId } : {}),
    };
    const existente = get().modelosGuardados.find((item) => item.id === modeloPersistidoId);
    const modeloPersistido = construirModeloPersistido(inputGuardado, existente);
    const finalizarGuardado = (guardadoBase: ModeloPersistido, mensaje = "Modelo guardado exitosamente") => {
      let guardado = guardadoBase;
      let versiones = guardado.versiones ?? [];
      let indiceActualizado = get().indice;
      if (guardado.crearVersionAlGuardar) {
        const version = construirVersionPersistible(modelo, { descripcion: "Guardado manual" });
        versiones = [version.version, ...versiones];
        guardado = { ...guardado, versiones };
        void guardarVersionBackend(guardado.id, version.version, version.json).then((resultado) => {
          if (!resultado.ok) set({ mensaje: `Modelo guardado; no se pudo guardar versión en servidor: ${resultado.error}` });
        });
        indiceActualizado = {
          ...indiceActualizado,
          modelos: indiceActualizado.modelos.map((item) =>
            item.id === guardado.id ? { ...item, versiones } : item,
          ),
        };
        escribirIndiceWorkspace(indiceActualizado);
      }
      marcarSnapshotModelo(modelo);
      set(estadoModelo(modelo, {
        mensaje,
        dirty: false,
        dirtyModelo: false,
        modeloPersistidoId: guardado.id,
        descripcionModeloLocal: guardado.descripcion,
        modelosGuardados: upsertModeloGuardado(get().modelosGuardados, guardado),
        indice: indiceActualizado,
        workspaceLocal: workspaceDesdeModelo(modelo, guardado.id, guardado.descripcion, carpetaId),
      }));
    };
    if (persistenciaBackendHabilitada()) {
      set({ mensaje: "Guardando modelo en servidor..." });
      void guardarModeloBackend(modeloPersistido).then((resultado) => {
        if (resultado.ok) {
          finalizarGuardado(resultado.value);
          return;
        }
        set({ mensaje: `No se pudo guardar en servidor: ${resultado.error}` });
      });
      return;
    }
    set({ mensaje: "Backend de modelos no disponible" });
  },

  cargarLocal(id) {
    const modeloId = id ?? get().modelosGuardados[0]?.id;
    if (!modeloId) {
      set({ mensaje: "No hay modelos guardados" });
      return;
    }
    if (persistenciaBackendHabilitada()) {
      set({ mensaje: "Cargando modelo desde servidor..." });
      void cargarModeloBackend(modeloId).then((cargado) => {
        if (!cargado.ok) {
          set({ mensaje: cargado.error });
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
        }));
      });
      return;
    }
    set({ mensaje: "Backend de modelos no disponible" });
  },

  borrarLocal(id) {
    if (persistenciaBackendHabilitada()) {
      set({ mensaje: "Borrando modelo en servidor..." });
      void borrarModeloBackend(id).then((resultado) => {
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
        if (!state.modeloPersistidoId) return;
        const carpetaId = state.indice.modelos.find((m) => m.id === state.modeloPersistidoId)?.carpetaId;
        const json = exportarModelo(state.modelo, carpetaId);
        const inputGuardado = {
          id: state.modeloPersistidoId,
          nombre: state.modelo.nombre,
          descripcion: state.descripcionModeloLocal,
          json,
          autosalvado: true,
          ...(carpetaId !== undefined ? { carpetaId } : {}),
        };
        const existente = state.modelosGuardados.find((item) => item.id === state.modeloPersistidoId);
        const modeloPersistido = construirModeloPersistido(inputGuardado, existente);
        if (!persistenciaBackendHabilitada()) return;
        const guardado = await guardarModeloBackend(modeloPersistido);
        if (guardado.ok) {
          void guardarAutosalvadoBackend(guardado.value.id, guardado.value.json);
          marcarSnapshotModelo(state.modelo);
          setEstadoStore(estadoModelo(state.modelo, {
            dirty: false,
            modelosGuardados: upsertModeloGuardado(obtenerEstadoStore().modelosGuardados, guardado.value),
            autosalvado: obtenerAutosalvadoControl()?.estado() ?? { activo: false, ultimo: null, salvando: false },
          }));
          return;
        }
      },
    });
    fijarAutosalvadoControl(control);
    control.onEstado((estado) => setEstadoStore({ autosalvado: estado }));
    control.iniciar();
  },

  detenerAutosalvado() {
    obtenerAutosalvadoControl()?.detener();
    fijarAutosalvadoControl(null);
    set({ autosalvado: { activo: false, ultimo: null, salvando: false } });
  }
});

function sincronizarListadoBackend(set: SetStore, get: GetStore): void {
  if (!persistenciaBackendHabilitada()) return;
  void obtenerSesionBackend().then(() => Promise.all([listarModelosBackend(), cargarWorkspaceBackend()])).then(([modelosResultado, workspaceResultado]) => {
    if (!modelosResultado.ok) {
      set({ modelosGuardados: [], mensaje: modelosResultado.error });
      return;
    }
    const indiceBackend = workspaceResultado.ok ? workspaceResultado.value : get().indice;
    // Anti-race: preserva las preferencias que el usuario haya cambiado antes de
    // que este load async resolviera (ver fusionarPreferenciasBootstrap).
    const indiceBase = fusionarPreferenciasBootstrap(indiceBackend, get().indice);
    const indice = sincronizarIndiceConModelosGuardados(modelosResultado.value, indiceBase);
    escribirIndiceWorkspace(indice);
    set({
      modelosGuardados: modelosResultado.value,
      indice,
      modelosRecientes: modelosRecientesDeIndice(indice, modelosResultado.value),
      mensaje: workspaceResultado.ok ? null : workspaceResultado.error,
    });
  }).catch(() => {
    set({ modelosGuardados: [], mensaje: "No se pudo conectar al backend de modelos" });
  });
}

function upsertModeloGuardado(modelos: ResumenModeloPersistido[], modelo: ModeloPersistido): ResumenModeloPersistido[] {
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
