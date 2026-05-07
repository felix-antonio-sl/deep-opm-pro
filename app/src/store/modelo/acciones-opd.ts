import { eliminarOpdHoja } from "../../modelo/opdEliminacion";
import { obtenerRefinamiento } from "../../modelo/refinamientos";
import {
  descomponerProceso,
  desplegarObjeto,
  quitarDescomposicionProceso,
  quitarDespliegueObjeto,
  reanclarEnlaceExternoDerivado,
} from "../../modelo/operaciones";
import {
  moverNodo,
  ordenSegunCanvasPadre,
  reordenarHermanos,
} from "../../modelo/opdReorden";
import {
  commitModelo,
  confirmarEliminacionOpd,
  opdActivoSeguro,
  opdDestinoDeAviso,
  type GetStore,
  type SetStore,
} from "../runtime";
import type { ModeloSlice } from "../tipos";
import type { Id, Modelo, Resultado } from "../../modelo/tipos";

export function renombrarOpdDesdeArbol(modelo: Modelo, opdId: Id, nombre: string): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return { ok: false, error: `OPD no existe: ${opdId}` };
  const limpio = nombre.trim();
  if (!limpio || limpio === opd.nombre) return { ok: true, value: modelo };
  const nombreUnico = nombreOpdUnico(modelo, opdId, limpio);
  return {
    ok: true,
    value: {
      ...modelo,
      opds: {
        ...modelo.opds,
        [opdId]: { ...opd, nombre: nombreUnico },
      },
    },
  };
}

export function reordenarOpdsHermanos(modelo: Modelo, padreId: Id | null, ordenIds: Id[]): Resultado<Modelo> {
  return reordenarHermanos(modelo, padreId, ordenIds);
}

export function reordenarHermanosAutomaticamente(modelo: Modelo, opdPadreId: Id): Resultado<Modelo> {
  const orden = ordenSegunCanvasPadre(modelo, opdPadreId);
  if (!orden.ok) return orden;
  return reordenarHermanos(modelo, opdPadreId, orden.value);
}

export function moverOpdGestion(modelo: Modelo, opdId: Id, nuevoPadreId: Id | null, posicion?: number): Resultado<Modelo> {
  return moverNodo(modelo, opdId, nuevoPadreId, posicion);
}

function nombreOpdUnico(modelo: Modelo, opdId: Id, nombre: string): string {
  const opd = modelo.opds[opdId];
  if (!opd) return nombre;
  const nombresHermanos = new Set(Object.values(modelo.opds)
    .filter((otro) => otro.id !== opdId && otro.padreId === opd.padreId)
    .map((otro) => otro.nombre.trim().toLocaleLowerCase("es-CL")));
  if (!nombresHermanos.has(nombre.toLocaleLowerCase("es-CL"))) return nombre;
  for (let i = 2; i < 1000; i += 1) {
    const candidato = `${nombre} ${i}`;
    if (!nombresHermanos.has(candidato.toLocaleLowerCase("es-CL"))) return candidato;
  }
  return `${nombre} ${Date.now()}`;
}

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
        set({ mensaje: "Selecciona una cosa para descomponer" });
        return;
      }
      const entidad = modelo.entidades[seleccionId];
      if (!entidad) {
        set({ mensaje: "Selecciona una cosa para descomponer" });
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
        set({ mensaje: "Selecciona una cosa para desplegar" });
        return;
      }
      const entidad = modelo.entidades[seleccionId];
      if (!entidad) {
        set({ mensaje: "Selecciona una cosa para desplegar" });
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
        set({ mensaje: "Selecciona una cosa descompuesta" });
        return;
      }
      const entidad = modelo.entidades[seleccionId];
      if (!entidad || !obtenerRefinamiento(entidad, "descomposicion")) {
        set({ mensaje: "Selecciona una cosa descompuesta" });
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
        set({ mensaje: "Selecciona una cosa desplegada" });
        return;
      }
      const entidad = modelo.entidades[seleccionId];
      if (!entidad || !obtenerRefinamiento(entidad, "despliegue")) {
        set({ mensaje: "Selecciona una cosa desplegada" });
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

    reasignarEnlaceExternoManual(opdId, aparienciaEnlaceId, nuevoSubprocesoId) {
      const { modelo } = get();
      const resultado = reanclarEnlaceExternoDerivado(modelo, opdId, aparienciaEnlaceId, nuevoSubprocesoId);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, {
        seleccionId: null,
        enlaceSeleccionId: resultado.value.opds[opdId]?.enlaces[aparienciaEnlaceId]?.enlaceId ?? null,
        modoEnlace: null,
        mensaje: "Enlace externo reasignado",
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
