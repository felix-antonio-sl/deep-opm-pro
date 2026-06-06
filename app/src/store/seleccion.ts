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
import type { CrearSlice, SeleccionSlice } from "./tipos";
import { addFlash } from "./feedback";
import {
  ANCHO_PANEL_ARBOL_DEFAULT, ANCHO_PANEL_ARBOL_MAX, ANCHO_PANEL_ARBOL_MIN, PORTAPAPELES_WORKSPACE_TTL_MS, PREF_MOSTRAR_ARCHIVADOS_KEY, PREF_MOSTRAR_VERSIONES_KEY, activarEstadoPestanas, activarPestanaNueva, aparienciaSeleccionadaActiva, commitModelo, confirmarEliminacionOpd, crearIdModeloLocal, entidadNueva, enlaceNuevo, escribirIndiceWorkspace, escribirPreferenciaBooleana, estadoModelo, estadoSeleccionDesdeIds, hermanosOrdenados, leerIndiceWorkspace, leerPreferenciaBooleana, leerPreferenciasMapa, limitar, limitarAnchoPanelArbol, listarModelosGuardadosSeguro, mapaWorkspaceDesdeEstado, marcarSnapshotJson, marcarSnapshotModelo, modelosRecientesDeIndice, obtenerAutosalvadoControl, obtenerEstadoStore, opdActivoSeguro, opdDestinoDeAviso, persistirPreferenciasMapa, fijarAutosalvadoControl, resetHistorial, setEstadoStore, sincronizarIndiceConModelosGuardados, actualizarPreferenciasUi, validarSubprocesoTimeline,
  pestanaReemplazable,
  deshacerRuntime,
  rehacerRuntime,
  tipoDeCosa,
} from "./runtime";

export type { SeleccionSlice } from "./tipos";

export const createSeleccionSlice: CrearSlice<SeleccionSlice> = (set, get) => ({
  seleccionId: null,
  seleccionados: [],
  modoSeleccion: "simple",
  portapapelesVisual: null,
  enlaceSeleccionId: null,
  estadoSeleccionId: null,

  eliminarSeleccion() {
    const { modelo, opdActivoId, seleccionados, seleccionId, enlaceSeleccionId, estadoSeleccionId } = get();
    const ids = seleccionados.length > 0
      ? seleccionados
      : [seleccionId, enlaceSeleccionId, estadoSeleccionId].filter((id): id is Id => !!id);
    if (ids.length === 0) {
      set({ mensaje: "Selecciona una entidad, enlace o estado para eliminar" });
      return;
    }
    // Paquete "Estados ciudadanos de primera clase" (2026-05-23):
    // eliminarBatch no entiende ids de estado. Si los ids son TODOS estados,
    // los procesamos uno por uno con eliminarEstado (que respeta el invariante
    // "objeto con estados debe conservar al menos 2"). Cualquier mezcla cae
    // al batch original (se ignoran los ids de estado en el batch).
    const todosEstados = ids.every((id) => modelo.estados?.[id]);
    if (todosEstados) {
      let siguiente = modelo;
      for (const id of ids) {
        const resultado = eliminarEstadoOp(siguiente, id);
        if (!resultado.ok) {
          set({ mensaje: resultado.error });
          return;
        }
        siguiente = resultado.value;
      }
      commitModelo(set, modelo, siguiente, { seleccionId: null, seleccionados: [], modoSeleccion: "simple", enlaceSeleccionId: null, estadoSeleccionId: null, modoEnlace: null, mensaje: null });
      addFlash("✓ Estado eliminado");
      return;
    }
    const resultado = eliminarBatch(modelo, ids, opdActivoId);
    if (resultado.ok) {
      commitModelo(set, modelo, resultado.value, { seleccionId: null, seleccionados: [], modoSeleccion: "simple", enlaceSeleccionId: null, estadoSeleccionId: null, modoEnlace: null, mensaje: null });
      addFlash("✓ Selección eliminada");
    } else {
      set({ mensaje: resultado.error });
    }
  },

  setSeleccion(ids) {
    const estado = seleccionSet({ seleccionados: get().seleccionados, modo: get().modoSeleccion }, ids);
    set(estadoSeleccionDesdeIds(get().modelo, estado.seleccionados, estado.modo));
  },

  /**
   * Punto único de mutación de selección tipada. Sella el invariante de
   * exclusividad mutua entre `seleccionId`, `enlaceSeleccionId` y
   * `estadoSeleccionId`. Cualquier handler/atajo/menú que cambie selección
   * DEBE pasar por aquí (o por las acciones específicas que delegan a este).
   *
   * Spec: docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md §4.2.
   */
  setSeleccionPorTipo(kind, id) {
    if (kind === "vacia" || !id) {
      const estado = seleccionVacia();
      set({
        seleccionados: estado.seleccionados,
        modoSeleccion: estado.modo,
        seleccionId: null,
        enlaceSeleccionId: null,
        estadoSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
      });
      return;
    }
    const modelo = get().modelo;
    const tipo = tipoDeCosa(modelo, id);
    if (tipo !== kind) {
      set({ mensaje: `Id ${id} no corresponde al tipo ${kind} (tipo real: ${tipo ?? "desconocido"})` });
      return;
    }
    set(estadoSeleccionDesdeIds(modelo, [id], "simple"));
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
    set({ seleccionados: estado.seleccionados, modoSeleccion: estado.modo, seleccionId: null, enlaceSeleccionId: null, estadoSeleccionId: null, modoEnlace: null, mensaje: null });
  },

  seleccionarEstado(estadoId) {
    const modelo = get().modelo;
    const estado = modelo.estados?.[estadoId];
    if (!estado) {
      set({ mensaje: `Estado no existe: ${estadoId}` });
      return;
    }
    set(estadoSeleccionDesdeIds(modelo, [estadoId], "simple"));
  },

  agregarEstadoASeleccion(estadoId) {
    const { modelo, seleccionados } = get();
    const validacion = validarMismoObjetoPropietario(modelo, seleccionados, estadoId);
    if (!validacion.ok) {
      set({ mensaje: validacion.error });
      return;
    }
    const proximo = seleccionAgregar({ seleccionados, modo: get().modoSeleccion }, estadoId);
    set(estadoSeleccionDesdeIds(modelo, proximo.seleccionados, proximo.modo));
  },

  toggleSeleccionEstado(estadoId) {
    const { modelo, seleccionados } = get();
    if (!seleccionados.includes(estadoId)) {
      const validacion = validarMismoObjetoPropietario(modelo, seleccionados, estadoId);
      if (!validacion.ok) {
        set({ mensaje: validacion.error });
        return;
      }
    }
    const proximo = seleccionToggle({ seleccionados, modo: get().modoSeleccion }, estadoId);
    set(estadoSeleccionDesdeIds(modelo, proximo.seleccionados, proximo.modo));
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
  }
});

/**
 * Constraint del multi-select de estados: todos deben pertenecer al mismo
 * objeto propietario (paquete "Estados ciudadanos de primera clase").
 * Devuelve `{ ok: true }` si el id puede agregarse al batch actual,
 * `{ ok: false, error }` en caso contrario.
 *
 * Reglas:
 * 1. El nuevo id debe ser un estado.
 * 2. Si el batch contiene estados, todos deben pertenecer al mismo objeto
 *    que el nuevo.
 * 3. Si el batch contiene no-estados, se rechaza (no se mezclan).
 *
 * Spec: docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md §3.
 */
function validarMismoObjetoPropietario(
  modelo: Modelo,
  seleccionados: Id[],
  estadoId: Id,
): { ok: true } | { ok: false; error: string } {
  const estado = modelo.estados?.[estadoId];
  if (!estado) return { ok: false, error: `Estado no existe: ${estadoId}` };
  const objetoNuevo = estado.entidadId;
  for (const idActual of seleccionados) {
    if (idActual === estadoId) continue;
    const estadoActual = modelo.estados?.[idActual];
    if (!estadoActual) {
      return { ok: false, error: "No se puede mezclar estados con entidades/enlaces en el mismo batch" };
    }
    if (estadoActual.entidadId !== objetoNuevo) {
      return { ok: false, error: "Multi-select de estados sólo dentro del mismo objeto propietario" };
    }
  }
  return { ok: true };
}
