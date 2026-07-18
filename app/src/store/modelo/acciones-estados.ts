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
  moverEstado,
  quitarEstadosObjeto,
  redimensionarEstado,
  renombrarEstado,
  reordenarEstado,
} from "../../modelo/operaciones";
import { estadosDeEntidad } from "../../modelo/operaciones/estados";
import { aparienciaDeEntidadEnOpd } from "../../modelo/politicaApariciones";
import {
  mostrarEstadoEnAparicion,
  mostrarTodosLosEstadosEnAparicion,
  suprimirEstadoEnAparicion,
  suprimirTodosLosEstadosEnAparicion,
} from "../../modelo/visibilidadEstados";
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
      const colaRenombradoPendiente = resultado.value.creado
        ? resultado.value.estadoIds.map((id) => ({ tipo: "estado" as const, id }))
        : [];
      commitModelo(set, modelo, resultado.value.modelo, {
        seleccionId,
        colaRenombradoPendiente,
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
      const colaRenombradoPendiente = [{ tipo: "estado" as const, id: resultado.value.estadoId }];
      commitModelo(set, modelo, resultado.value.modelo, {
        seleccionId,
        colaRenombradoPendiente,
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
      const estadoIds = "estadoIds" in resultado.value
        ? (resultado.value.creado ? resultado.value.estadoIds : [])
        : [resultado.value.estadoId];
      const colaRenombradoPendiente = estadoIds.map((id) => ({ tipo: "estado" as const, id }));
      commitModelo(set, modelo, resultado.value.modelo, {
        seleccionId,
        colaRenombradoPendiente,
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

    // ───── Paquete "Estados ciudadanos de primera clase" (2026-05-23) ─────
    // Acciones from-selection: leen `estadoSeleccionId` para que atajos y
    // menús contextuales no tengan que pasar el id explícitamente. Si
    // `estadoSeleccionId` es null, setean `mensaje` y no mutan.
    // Spec: docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md §3.

    eliminarEstadoSeleccionado() {
      const { modelo, estadoSeleccionId } = get();
      if (!estadoSeleccionId) {
        set({ mensaje: "Selecciona un estado para eliminar" });
        return;
      }
      const resultado = eliminarEstadoOp(modelo, estadoSeleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId: null,
        estadoSeleccionId: null,
        modoEnlace: null,
        mensaje: "Estado eliminado",
      });
    },

    redimensionarEstadoEnCanvas(estadoId, width, height, posicion) {
      const { modelo } = get();
      const resultado = redimensionarEstado(modelo, estadoId, width, height, posicion);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId: null,
        estadoSeleccionId: estadoId,
        seleccionados: [estadoId],
        modoSeleccion: "simple",
        modoEnlace: null,
        mensaje: null,
      });
    },

    moverEstadoEnCanvas(estadoId, x, y) {
      const { modelo } = get();
      const resultado = moverEstado(modelo, estadoId, x, y);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId: null,
        estadoSeleccionId: estadoId,
        seleccionados: [estadoId],
        modoSeleccion: "simple",
        modoEnlace: null,
        mensaje: null,
      });
    },

    renombrarEstadoSeleccionadoSmart(nombre) {
      const { modelo, estadoSeleccionId } = get();
      if (!estadoSeleccionId) {
        set({ mensaje: "Selecciona un estado para renombrar" });
        return;
      }
      const resultado = renombrarEstado(modelo, estadoSeleccionId, nombre);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        estadoSeleccionId,
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
      });
    },

    designarEstadoSeleccionado(designacion) {
      const { estadoSeleccionId } = get();
      if (!estadoSeleccionId) {
        set({ mensaje: "Selecciona un estado para designar" });
        return;
      }
      designarEstadoEnStore(set, get, estadoSeleccionId, designacion);
    },

    quitarDesignacionEstadoSeleccionado(designacion) {
      const { modelo, estadoSeleccionId } = get();
      if (!estadoSeleccionId) {
        set({ mensaje: "Selecciona un estado para quitar designación" });
        return;
      }
      const resultado = quitarDesignacion(modelo, estadoSeleccionId, designacion);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        estadoSeleccionId,
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
      });
    },

    suprimirEstadoSeleccionado() {
      const { modelo, estadoSeleccionId } = get();
      if (!estadoSeleccionId) {
        set({ mensaje: "Selecciona un estado para suprimir" });
        return;
      }
      const resultado = suprimirEstado(modelo, estadoSeleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        estadoSeleccionId,
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: "Estado suprimido",
      });
    },

    // ───── Supresión de estados POR APARICIÓN (per-OPD) ─────
    // Oculta/muestra el estado seleccionado SOLO en el OPD activo. Distinto de
    // suprimirEstadoSeleccionado (global) y de ocultarAparienciaSeleccionada
    // (oculta la entidad completa del OPD). Visibilidad efectiva = ¬global ∧
    // ¬local (ver `modelo/visibilidadEstados.ts`, SELLOs cat-thinking).

    ocultarEstadoEnVistaSeleccionado() {
      const ctx = resolverAparicionEstadoSeleccionado(get, set);
      if (!ctx) return;
      const { modelo, opdActivoId, aparienciaId, estadoSeleccionId } = ctx;
      const resultado = suprimirEstadoEnAparicion(modelo, opdActivoId, aparienciaId, estadoSeleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        estadoSeleccionId,
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: "Estado ocultado en esta vista",
      });
    },

    mostrarEstadoEnVistaSeleccionado() {
      const ctx = resolverAparicionEstadoSeleccionado(get, set);
      if (!ctx) return;
      const { modelo, opdActivoId, aparienciaId, estadoSeleccionId } = ctx;
      const resultado = mostrarEstadoEnAparicion(modelo, opdActivoId, aparienciaId, estadoSeleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        estadoSeleccionId,
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
      });
    },

    ocultarTodosEstadosEnVistaDeSeleccionado() {
      const ctx = resolverAparicionEstadoSeleccionado(get, set);
      if (!ctx) return;
      const { modelo, opdActivoId, aparienciaId, estadoSeleccionId } = ctx;
      const resultado = suprimirTodosLosEstadosEnAparicion(modelo, opdActivoId, aparienciaId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        estadoSeleccionId,
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: "Estados ocultados en esta vista",
      });
    },

    mostrarTodosEstadosEnVistaDeSeleccionado() {
      const ctx = resolverAparicionEstadoSeleccionado(get, set);
      if (!ctx) return;
      const { modelo, opdActivoId, aparienciaId, estadoSeleccionId } = ctx;
      const resultado = mostrarTodosLosEstadosEnAparicion(modelo, opdActivoId, aparienciaId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        estadoSeleccionId,
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: "Estados restaurados en esta vista",
      });
    },

    abrirModalDuracionEstadoSeleccionado() {
      const { estadoSeleccionId } = get();
      if (!estadoSeleccionId) {
        set({ mensaje: "Selecciona un estado para editar su duración" });
        return;
      }
      set({ modalDuracionAbierto: estadoSeleccionId, mensaje: null });
    },

    agregarEstadoHermanoDeSeleccionado() {
      const { modelo, estadoSeleccionId } = get();
      if (!estadoSeleccionId) {
        set({ mensaje: "Selecciona un estado para agregar un hermano" });
        return;
      }
      const estado = modelo.estados?.[estadoSeleccionId];
      if (!estado) {
        set({ mensaje: `Estado no existe: ${estadoSeleccionId}` });
        return;
      }
      const resultado = agregarEstado(modelo, estado.entidadId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value.modelo, {
        estadoSeleccionId,
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
      });
    },

    reordenarEstadoSeleccionado(indiceDestino) {
      const { modelo, estadoSeleccionId } = get();
      if (!estadoSeleccionId) {
        set({ mensaje: "Selecciona un estado para reordenar" });
        return;
      }
      const resultado = reordenarEstado(modelo, estadoSeleccionId, indiceDestino);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        estadoSeleccionId,
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
      });
    },

    designarBatch(estadoIds, designacion) {
      const { modelo, estadoSeleccionId } = get();
      if (estadoIds.length === 0) {
        set({ mensaje: "Selecciona al menos un estado para designar" });
        return;
      }
      // Constraint: todos del mismo objeto propietario.
      const objetoPropietario = modelo.estados?.[estadoIds[0]!]?.entidadId;
      if (!objetoPropietario) {
        set({ mensaje: `Estado no existe: ${estadoIds[0]}` });
        return;
      }
      for (const id of estadoIds) {
        if (modelo.estados?.[id]?.entidadId !== objetoPropietario) {
          set({ mensaje: "designarBatch sólo opera dentro del mismo objeto propietario" });
          return;
        }
      }
      let siguiente = modelo;
      for (const id of estadoIds) {
        const resultado = aplicarDesignacionSimple(siguiente, id, designacion);
        if (!resultado.ok) {
          set({ mensaje: resultado.error });
          return;
        }
        siguiente = resultado.value;
      }
      commitModelo(set, modelo, siguiente, {
        estadoSeleccionId,
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: null,
      });
    },
  };
}

function aplicarDesignacionSimple(
  modelo: Modelo,
  estadoId: Id,
  designacion: DesignacionEstado,
): ReturnType<typeof designarInicial> {
  const acciones: Record<DesignacionEstado, (m: Modelo, id: Id) => ReturnType<typeof designarInicial>> = {
    inicial: designarInicial,
    final: designarFinal,
    default: designarDefault,
    current: designarCurrent,
  };
  return acciones[designacion](modelo, estadoId);
}

/**
 * Resuelve el contexto (modelo, OPD activo, aparición del objeto propietario,
 * estado seleccionado) para las acciones de supresión por aparición. Setea
 * `mensaje` y retorna null si falta selección o el objeto no aparece en el OPD
 * activo (p.ej. el estado se seleccionó en otra pestaña/vista).
 */
function resolverAparicionEstadoSeleccionado(
  get: GetStore,
  set: SetStore,
): { modelo: Modelo; opdActivoId: Id; aparienciaId: Id; estadoSeleccionId: Id } | null {
  const { modelo, opdActivoId, estadoSeleccionId } = get();
  if (!estadoSeleccionId) {
    set({ mensaje: "Selecciona un estado para ocultarlo o mostrarlo en esta vista" });
    return null;
  }
  const estado = modelo.estados?.[estadoSeleccionId];
  if (!estado) {
    set({ mensaje: `Estado no existe: ${estadoSeleccionId}` });
    return null;
  }
  const opd = modelo.opds[opdActivoId];
  const apariencia = opd ? aparienciaDeEntidadEnOpd(opd, estado.entidadId) : null;
  if (!apariencia) {
    set({ mensaje: "El objeto de este estado no aparece en el OPD activo" });
    return null;
  }
  return { modelo, opdActivoId, aparienciaId: apariencia.id, estadoSeleccionId };
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
