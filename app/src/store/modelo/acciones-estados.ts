import {
  designarCurrent,
  designarDefault,
  designarFinal,
  designarInicial,
  quitarDesignacion,
  restaurarEstado,
  suprimirEstado,
} from "../../modelo/estadosDesignaciones";
import { fijarDuracion, quitarDuracion } from "../../modelo/objetoDuracion";
import {
  agregarEstado,
  crearEstadosIniciales,
  eliminarEstado as eliminarEstadoOp,
  quitarEstadosObjeto,
  renombrarEstado,
} from "../../modelo/operaciones";
import { estadosDeEntidad } from "../../modelo/operaciones/estados";
import type { DesignacionEstado, Id, Modelo } from "../../modelo/tipos";
import { commitModelo, type GetStore, type SetStore } from "../runtime";
import type { ModeloSlice } from "../tipos";

/**
 * Acciones sobre estados de objeto: agregar/eliminar estados, renombrar,
 * designaciones (inicial/final/default/current con exclusiones SSOT),
 * suprimir/restaurar, duración temporal con modal.
 */
export function accionesEstados(set: SetStore, get: GetStore): Partial<ModeloSlice> {
  return {
    agregarEstadosObjeto() {
      const { modelo, seleccionId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona un objeto para agregar estados" });
        return;
      }
      const resultado = crearEstadosIniciales(modelo, seleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value.modelo, {
        seleccionId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: resultado.value.creado ? "Estados iniciales agregados" : null,
      });
    },

    agregarEstadoObjeto() {
      const { modelo, seleccionId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona un objeto para agregar un estado" });
        return;
      }
      const resultado = agregarEstado(modelo, seleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value.modelo, {
        seleccionId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
      });
    },

    agregarEstadoSmart() {
      const { modelo, seleccionId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona un objeto para agregar un estado" });
        return;
      }
      const resultado = estadosDeEntidad(modelo, seleccionId).length < 2
        ? crearEstadosIniciales(modelo, seleccionId)
        : agregarEstado(modelo, seleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value.modelo, {
        seleccionId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: "creado" in resultado.value && resultado.value.creado ? "Estados iniciales agregados" : null,
      });
    },

    eliminarEstado(estadoId) {
      const { modelo, seleccionId } = get();
      const resultado = eliminarEstadoOp(modelo, estadoId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
      });
    },

    quitarEstadosObjetoSeleccionado() {
      const { modelo, seleccionId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona un objeto para quitar estados" });
        return;
      }
      const resultado = quitarEstadosObjeto(modelo, seleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: "Estados eliminados",
      });
    },

    renombrarEstadoSeleccionado(estadoId, nombre) {
      const { modelo, seleccionId } = get();
      const resultado = renombrarEstado(modelo, estadoId, nombre);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
      });
    },

    designarEstadoInicial(estadoId) {
      designarEstadoEnStore(set, get, estadoId, "inicial");
    },

    designarEstadoFinal(estadoId) {
      designarEstadoEnStore(set, get, estadoId, "final");
    },

    designarEstadoComo(estadoId, designacion) {
      designarEstadoEnStore(set, get, estadoId, designacion);
    },

    quitarDesignacionEstado(estadoId, designacion) {
      const { modelo, seleccionId } = get();
      const resultado = quitarDesignacion(modelo, estadoId, designacion);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
    },

    suprimirEstadoPorId(estadoId) {
      const { modelo, seleccionId } = get();
      const resultado = suprimirEstado(modelo, estadoId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: "Estado suprimido" });
    },

    restaurarEstadoPorId(estadoId) {
      const { modelo, seleccionId } = get();
      const resultado = restaurarEstado(modelo, estadoId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
    },

    abrirModalDuracion(estadoId) {
      if (!get().modelo.estados[estadoId]) return;
      set({ modalDuracionAbierto: estadoId, mensaje: null });
    },

    cerrarModalDuracion() {
      set({ modalDuracionAbierto: null });
    },

    fijarDuracionEstado(estadoId, duracion) {
      const { modelo, seleccionId } = get();
      const resultado = fijarDuracion(modelo, estadoId, duracion);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, modalDuracionAbierto: null, mensaje: null });
    },

    quitarDuracionEstado(estadoId) {
      const { modelo, seleccionId } = get();
      const resultado = quitarDuracion(modelo, estadoId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, modalDuracionAbierto: null, mensaje: null });
    },
  };
}

function designarEstadoEnStore(
  set: SetStore,
  get: GetStore,
  estadoId: Id,
  designacion: DesignacionEstado,
): void {
  const { modelo, seleccionId } = get();
  const acciones: Record<DesignacionEstado, (m: Modelo, id: Id) => ReturnType<typeof designarInicial>> = {
    inicial: designarInicial,
    final: designarFinal,
    default: designarDefault,
    current: designarCurrent,
  };
  const resultado = acciones[designacion](modelo, estadoId);
  if (!resultado.ok) {
    set({ mensaje: resultado.error });
    return;
  }
  commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
}
