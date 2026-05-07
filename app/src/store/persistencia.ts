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
import type { CrearSlice, OpmStore, PersistenciaSlice } from "./tipos";
import {
  ANCHO_PANEL_ARBOL_DEFAULT, ANCHO_PANEL_ARBOL_MAX, ANCHO_PANEL_ARBOL_MIN, PORTAPAPELES_WORKSPACE_TTL_MS, PREF_MOSTRAR_ARCHIVADOS_KEY, PREF_MOSTRAR_VERSIONES_KEY, activarEstadoPestanas, activarPestanaNueva, aparienciaSeleccionadaActiva, commitModelo, confirmarEliminacionOpd, crearDemo, crearFixturePorNombre, crearIdModeloLocal, entidadNueva, enlaceNuevo, escribirIndiceWorkspace, escribirPreferenciaBooleana, estadoModelo, estadoSeleccionDesdeIds, generarHtmlOpl, hermanosOrdenados, leerIndiceWorkspace, leerPreferenciaBooleana, leerPreferenciasMapa, limitar, limitarAnchoPanelArbol, listarModelosGuardadosSeguro, mapaWorkspaceDesdeEstado, marcarSnapshotJson, marcarSnapshotModelo, modelosRecientesDeIndice, obtenerAutosalvadoControl, obtenerEstadoStore, opdActivoSeguro, opdDestinoDeAviso, persistirPreferenciasMapa, fijarAutosalvadoControl, resetHistorial, setEstadoStore, sincronizarIndiceConModelosGuardados, actualizarPreferenciasUi, validarSubprocesoTimeline,
  pestanaReemplazable,
  deshacerRuntime,
  rehacerRuntime,
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

  listarModelosGuardados() {
    const listado = listarModelosLocales();
    if (!listado.ok) {
      set({ modelosGuardados: [], mensaje: listado.error });
      return;
    }
    set({ modelosGuardados: listado.value });
  },

  guardarLocal() {
    if (get().readOnly) {
      const estado = get();
      const idPrevio = estado.modeloPersistidoId;
      const nombre = nombreCopiaReadOnly(estado.modelo.nombre, listarModelosGuardadosSeguro());
      estado.guardarComoLocal({ nombre, descripcion: estado.descripcionModeloLocal });
      if (get().modeloPersistidoId && get().modeloPersistidoId !== idPrevio) {
        set({ readOnly: false, mensaje: "Modelo en solo lectura — guardando como copia nueva" });
      }
      return;
    }
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
    marcarSnapshotModelo(modelo);
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
      marcarSnapshotJson("");
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

  cargarFixtureDemo(nombre: string) {
    const modelo = crearFixturePorNombre(nombre);
    if (!modelo) {
      set({ mensaje: `Fixture no encontrado: ${nombre}` });
      return;
    }
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
      mensaje: `Fixture cargado: ${nombre}`,
    }));
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
        const guardado = guardarModeloLocal({
          id: state.modeloPersistidoId,
          nombre: state.modelo.nombre,
          descripcion: state.descripcionModeloLocal,
          json,
          autosalvado: true,
          ...(carpetaId !== undefined ? { carpetaId } : {}),
        });
        if (guardado.ok) {
          marcarSnapshotModelo(state.modelo);
          setEstadoStore(estadoModelo(state.modelo, {
            dirty: false,
            autosalvado: obtenerAutosalvadoControl()?.estado() ?? { activo: false, ultimo: null, salvando: false },
          }));
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

function nombreCopiaReadOnly(nombre: string, modelos: ResumenModeloPersistido[]): string {
  const base = `${nombre.trim() || "Modelo"} copia`;
  for (let i = 1; i < 100; i += 1) {
    const candidato = i === 1 ? base : `${base} ${i}`;
    if (validarNombreModeloLocal(candidato, modelos).ok) return candidato;
  }
  return `${base} ${Date.now()}`;
}
