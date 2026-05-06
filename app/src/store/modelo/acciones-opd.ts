import { eliminarOpdHoja } from "../../modelo/opdEliminacion";
import {
  descomponerProceso,
  desplegarObjeto,
  quitarDescomposicionProceso,
  quitarDespliegueObjeto,
} from "../../modelo/operaciones";
import {
  commitModelo,
  confirmarEliminacionOpd,
  opdActivoSeguro,
  opdDestinoDeAviso,
  type GetStore,
  type SetStore,
} from "../runtime";
import type { ModeloSlice } from "../tipos";

/**
 * Acciones de OPD: refinamiento (descomponer/desplegar/quitar), navegación
 * de OPD activo, eliminación de OPD desde árbol y navegación a avisos del
 * panel de validaciones.
 */
export function accionesOpd(set: SetStore, get: GetStore): Partial<ModeloSlice> {
  return {
    descomponerSeleccionada() {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona un proceso para descomponer" });
        return;
      }
      const entidad = modelo.entidades[seleccionId];
      if (!entidad || entidad.tipo !== "proceso") {
        set({ mensaje: "Selecciona un proceso para descomponer" });
        return;
      }

      const resultado = descomponerProceso(modelo, opdActivoId, seleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value.modelo, {
        opdActivoId: resultado.value.opdId,
        seleccionId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: resultado.value.creado ? "OPD hijo creado" : null,
      });
    },

    desplegarSeleccionada(modo = "agregacion") {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona un objeto para desplegar" });
        return;
      }
      const entidad = modelo.entidades[seleccionId];
      if (!entidad || entidad.tipo !== "objeto") {
        set({ mensaje: "Selecciona un objeto para desplegar" });
        return;
      }

      const resultado = desplegarObjeto(modelo, opdActivoId, seleccionId, modo);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value.modelo, {
        opdActivoId: resultado.value.opdId,
        seleccionId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: resultado.value.creado ? "OPD de despliegue creado" : null,
      });
    },

    quitarDescomposicionSeleccionada() {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona un proceso descompuesto" });
        return;
      }
      const entidad = modelo.entidades[seleccionId];
      if (!entidad || entidad.tipo !== "proceso" || entidad.refinamiento?.tipo !== "descomposicion") {
        set({ mensaje: "Selecciona un proceso descompuesto" });
        return;
      }

      const resultado = quitarDescomposicionProceso(modelo, seleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        opdActivoId: opdActivoSeguro(resultado.value, opdActivoId),
        seleccionId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: "Descomposición eliminada",
      });
    },

    quitarDespliegueSeleccionado() {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona un objeto desplegado" });
        return;
      }
      const entidad = modelo.entidades[seleccionId];
      if (!entidad || entidad.tipo !== "objeto" || entidad.refinamiento?.tipo !== "despliegue") {
        set({ mensaje: "Selecciona un objeto desplegado" });
        return;
      }

      const resultado = quitarDespliegueObjeto(modelo, seleccionId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        opdActivoId: opdActivoSeguro(resultado.value, opdActivoId),
        seleccionId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: "Despliegue eliminado",
      });
    },

    eliminarOpdDesdeArbol(opdId) {
      const { modelo, opdActivoId } = get();
      const resultado = eliminarOpdHoja(modelo, opdId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      const opd = modelo.opds[opdId];
      if (!confirmarEliminacionOpd(opd?.nombre ?? opdId)) return;
      commitModelo(set, modelo, resultado.value.modelo, {
        opdActivoId: opdActivoId === opdId ? resultado.value.opdActivoSugerido : opdActivoSeguro(resultado.value.modelo, opdActivoId),
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: "OPD eliminado",
      });
    },

    cambiarOpdActivo(id) {
      const { modelo, opdActivoId } = get();
      if (!modelo.opds[id]) {
        set({ mensaje: `OPD no existe: ${id}` });
        return;
      }
      if (id === opdActivoId) {
        set({ mensaje: null });
        return;
      }
      set({ opdActivoId: id, seleccionId: null, seleccionados: [], modoSeleccion: "simple", enlaceSeleccionId: null, modoEnlace: null, modoCreacion: null, hoverOplRef: null, mensaje: null });
    },

    navegarAviso(aviso) {
      const { modelo, opdActivoId } = get();
      const opdDestino = opdDestinoDeAviso(modelo, aviso, opdActivoId);

      if (aviso.elementoTipo === "entidad" && aviso.elementoId && modelo.entidades[aviso.elementoId]) {
        set({
          opdActivoId: opdDestino ?? opdActivoId,
          seleccionId: aviso.elementoId,
          enlaceSeleccionId: null,
          modoEnlace: null,
          mensaje: null,
        });
        return;
      }

      if (aviso.elementoTipo === "enlace" && aviso.elementoId && modelo.enlaces[aviso.elementoId]) {
        set({
          opdActivoId: opdDestino ?? opdActivoId,
          seleccionId: null,
          enlaceSeleccionId: aviso.elementoId,
          modoEnlace: null,
          mensaje: null,
        });
        return;
      }

      if (aviso.elementoTipo === "opd") {
        const destino = aviso.elementoId && modelo.opds[aviso.elementoId] ? aviso.elementoId : opdDestino;
        if (destino) {
          set({
            opdActivoId: destino,
            seleccionId: null,
            enlaceSeleccionId: null,
            modoEnlace: null,
            mensaje: null,
          });
          return;
        }
      }

      set({ mensaje: "Aviso sin elemento navegable" });
    },
  };
}
