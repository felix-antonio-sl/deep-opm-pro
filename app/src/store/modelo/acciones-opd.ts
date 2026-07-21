import { eliminarOpdHoja } from "../../modelo/opdEliminacion";
import { obtenerRefinamiento } from "../../modelo/refinamientos";
import {
  adoptarOpd,
  descomponerProceso,
  desplegarObjeto,
  quitarDescomposicionProceso,
  quitarDespliegueObjeto,
  reanclarEnlaceExternoDerivado,
} from "../../modelo/operaciones";
import { crearOpdSuelto } from "../../modelo/operaciones/opdSuelto";
import { idsSubarbolOpd } from "../../modelo/operaciones/refinamiento/helpers";
import {
  moverNodo,
  ordenSegunCanvasPadre,
  reordenarHermanos,
} from "../../modelo/opdReorden";
import {
  commitModelo,
  confirmarEliminacionOpd,
  mensajeBloqueoEdicion,
  opdActivoSeguro,
  opdDestinoDeAviso,
  type GetStore,
  type SetStore,
} from "../runtime";
import type { ModeloSlice } from "../tipos";
import type { Id, ModoDespliegueObjeto, Modelo, Resultado, TipoRefinamiento } from "../../modelo/tipos";

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

export function actualizarPreguntaGuia(modelo: Modelo, opdId: Id, preguntaGuia: string): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return { ok: false, error: `OPD no existe: ${opdId}` };
  const limpia = preguntaGuia.trim();
  if (!limpia) return { ok: false, error: "La pregunta guía no puede quedar vacía." };
  if (opd.preguntaGuia === limpia) return { ok: true, value: modelo };
  return {
    ok: true,
    value: {
      ...modelo,
      opds: { ...modelo.opds, [opdId]: { ...opd, preguntaGuia: limpia } },
    },
  };
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
      const bloqueo = mensajeBloqueoEdicion(get());
      if (bloqueo) {
        set({ refinamientoPendiente: null, mensaje: bloqueo });
        return;
      }
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

      const existente = obtenerRefinamiento(entidad, "descomposicion");
      if (existente) {
        if (!modelo.opds[existente.opdId]) {
          set({ mensaje: `OPD de descomposición no existe: ${existente.opdId}` });
          return;
        }
        set({ opdActivoId: existente.opdId, refinamientoPendiente: null, mensaje: null });
        return;
      }
      set({
        refinamientoPendiente: {
          tipo: "descomposicion",
          opdPadreId: opdActivoId,
          entidadId: seleccionId,
          entidadNombre: entidad.nombre,
        },
        mensaje: null,
      });
    },

    desplegarSeleccionada(modo) {
      const bloqueo = mensajeBloqueoEdicion(get());
      if (bloqueo) {
        set({ refinamientoPendiente: null, mensaje: bloqueo });
        return;
      }
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

      const existente = obtenerRefinamiento(entidad, "despliegue");
      if (existente) {
        if (!modelo.opds[existente.opdId]) {
          set({ mensaje: `OPD de despliegue no existe: ${existente.opdId}` });
          return;
        }
        set({ opdActivoId: existente.opdId, refinamientoPendiente: null, mensaje: null });
        return;
      }
      set({
        refinamientoPendiente: {
          tipo: "despliegue",
          opdPadreId: opdActivoId,
          entidadId: seleccionId,
          entidadNombre: entidad.nombre,
          modo: modo ?? null,
        },
        mensaje: null,
      });
    },

    confirmarRefinamientoPendiente(input) {
      const estado = get();
      const bloqueo = mensajeBloqueoEdicion(estado);
      if (bloqueo) {
        set({ refinamientoPendiente: null, mensaje: bloqueo });
        return;
      }
      const pendiente = estado.refinamientoPendiente;
      if (!pendiente) return;
      const preguntaGuia = input.preguntaGuia.trim();
      if (!preguntaGuia) {
        set({ refinamientoPendiente: { ...pendiente, error: "Escribe una pregunta antes de crear el refinamiento." } });
        return;
      }

      if (pendiente.tipo === "descomposicion") {
        const resultado = descomponerProceso(
          estado.modelo,
          pendiente.opdPadreId,
          pendiente.entidadId,
          { preguntaGuia },
        );
        if (!resultado.ok) {
          set({ refinamientoPendiente: { ...pendiente, error: resultado.error } });
          return;
        }
        const colaRenombradoPendiente = resultado.value.refinadorIds.map((id) => ({ tipo: "entidad" as const, id }));
        commitModelo(set, estado.modelo, resultado.value.modelo, {
          opdActivoId: resultado.value.opdId,
          seleccionId: pendiente.entidadId,
          colaRenombradoPendiente,
          enlaceSeleccionId: null,
          modoEnlace: null,
          refinamientoPendiente: null,
          mensaje: null,
        });
        return;
      }

      if (pendiente.tipo === "despliegue") {
        const modo = input.modo ?? pendiente.modo;
        if (!modo) {
          set({ refinamientoPendiente: { ...pendiente, error: "Elige una relación antes de crear el refinamiento." } });
          return;
        }
        const resultado = desplegarObjeto(
          estado.modelo,
          pendiente.opdPadreId,
          pendiente.entidadId,
          modo,
          { preguntaGuia },
        );
        if (!resultado.ok) {
          set({ refinamientoPendiente: { ...pendiente, error: resultado.error } });
          return;
        }
        commitModelo(set, estado.modelo, resultado.value.modelo, {
          opdActivoId: resultado.value.opdId,
          seleccionId: pendiente.entidadId,
          enlaceSeleccionId: null,
          modoEnlace: null,
          refinamientoPendiente: null,
          mensaje: null,
        });
        return;
      }

      const entidadId = input.entidadId ?? pendiente.entidadId;
      const tipo = input.tipo ?? pendiente.refinamiento;
      const modo = input.modo ?? pendiente.modo ?? undefined;
      if (tipo === "despliegue" && !modo) {
        set({ refinamientoPendiente: { ...pendiente, error: "Elige una relación antes de crear el refinamiento." } });
        return;
      }
      const resultado = adoptarOpd(estado.modelo, {
        opdPadreId: pendiente.opdPadreId,
        entidadId,
        opdSueltoId: pendiente.opdSueltoId,
        tipo,
        ...(modo ? { modo } : {}),
        preguntaGuia,
      });
      if (!resultado.ok) {
        set({ refinamientoPendiente: { ...pendiente, error: resultado.error } });
        return;
      }
      commitModelo(set, estado.modelo, resultado.value, {
        opdActivoId: pendiente.opdSueltoId,
        seleccionId: entidadId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        refinamientoPendiente: null,
        mensaje: null,
      });
    },

    cancelarRefinamientoPendiente() {
      set({ refinamientoPendiente: null, mensaje: null });
    },

    actualizarPreguntaGuiaOpd(opdId, preguntaGuia) {
      const { modelo } = get();
      const resultado = actualizarPreguntaGuia(modelo, opdId, preguntaGuia);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, modelo, resultado.value, { mensaje: null });
    },

    nuevoOpdSuelto() {
      const { modelo } = get();
      const { modelo: siguiente, opdId } = crearOpdSuelto(modelo);
      commitModelo(set, modelo, siguiente, {
        opdActivoId: opdId,
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: "OPD suelto creado (Taller)",
      });
    },

    adoptarOpdEnSeleccion(opdSueltoId: Id, tipo: TipoRefinamiento, modo?: ModoDespliegueObjeto) {
      const bloqueo = mensajeBloqueoEdicion(get());
      if (bloqueo) {
        set({ refinamientoPendiente: null, mensaje: bloqueo });
        return;
      }
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId || !modelo.entidades[seleccionId]) {
        set({ mensaje: "Selecciona la cosa que adoptará el OPD suelto" });
        return;
      }
      const opdSuelto = modelo.opds[opdSueltoId];
      if (!opdSuelto) {
        set({ mensaje: `OPD no existe: ${opdSueltoId}` });
        return;
      }
      set({
        refinamientoPendiente: {
          tipo: "adopcion",
          opdPadreId: opdActivoId,
          opdSueltoId,
          opdNombre: opdSuelto.nombre,
          entidadId: seleccionId,
          refinamiento: tipo,
          modo: tipo === "despliegue" ? modo ?? null : null,
          ...(opdSuelto.preguntaGuia ? { preguntaInicial: opdSuelto.preguntaGuia } : {}),
        },
        mensaje: null,
      });
    },

    quitarDescomposicionSeleccionada() {
      const bloqueo = mensajeBloqueoEdicion(get());
      if (bloqueo) {
        set({ confirmacionEliminarRefinamiento: null, mensaje: bloqueo });
        return;
      }
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona una cosa descompuesta" });
        return;
      }
      const entidad = modelo.entidades[seleccionId];
      const refinamiento = entidad ? obtenerRefinamiento(entidad, "descomposicion") : undefined;
      if (!entidad || !refinamiento) {
        set({ mensaje: "Selecciona una cosa descompuesta" });
        return;
      }
      set({
        confirmacionEliminarRefinamiento: {
          tipo: "descomposicion",
          entidadId: seleccionId,
          opdRaizId: refinamiento.opdId,
          opdIds: [...idsSubarbolOpd(modelo, refinamiento.opdId)],
        },
        mensaje: null,
      });
    },

    quitarDespliegueSeleccionado() {
      const bloqueo = mensajeBloqueoEdicion(get());
      if (bloqueo) {
        set({ confirmacionEliminarRefinamiento: null, mensaje: bloqueo });
        return;
      }
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId) {
        set({ mensaje: "Selecciona una cosa desplegada" });
        return;
      }
      const entidad = modelo.entidades[seleccionId];
      const refinamiento = entidad ? obtenerRefinamiento(entidad, "despliegue") : undefined;
      if (!entidad || !refinamiento) {
        set({ mensaje: "Selecciona una cosa desplegada" });
        return;
      }
      set({
        confirmacionEliminarRefinamiento: {
          tipo: "despliegue",
          entidadId: seleccionId,
          opdRaizId: refinamiento.opdId,
          opdIds: [...idsSubarbolOpd(modelo, refinamiento.opdId)],
        },
        mensaje: null,
      });
    },

    confirmarEliminarRefinamiento() {
      const estado = get();
      const confirmacion = estado.confirmacionEliminarRefinamiento;
      if (!confirmacion) return;
      const bloqueo = mensajeBloqueoEdicion(estado);
      if (bloqueo) {
        set({ confirmacionEliminarRefinamiento: null, mensaje: bloqueo });
        return;
      }
      const entidadActual = estado.modelo.entidades[confirmacion.entidadId];
      const refinamientoActual = entidadActual
        ? obtenerRefinamiento(entidadActual, confirmacion.tipo)
        : undefined;
      if (refinamientoActual?.opdId !== confirmacion.opdRaizId) {
        set({ confirmacionEliminarRefinamiento: null, mensaje: "El refinamiento cambió; revisa su alcance antes de eliminar." });
        return;
      }
      const resultado = confirmacion.tipo === "descomposicion"
        ? quitarDescomposicionProceso(estado.modelo, confirmacion.entidadId)
        : quitarDespliegueObjeto(estado.modelo, confirmacion.entidadId);
      if (!resultado.ok) {
        set({ confirmacionEliminarRefinamiento: null, mensaje: resultado.error });
        return;
      }
      commitModelo(set, estado.modelo, resultado.value, {
        confirmacionEliminarRefinamiento: null,
        opdActivoId: opdActivoSeguro(resultado.value, estado.opdActivoId),
        seleccionId: confirmacion.entidadId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: confirmacion.tipo === "descomposicion" ? "Descomposición eliminada" : "Despliegue eliminado",
      });
    },

    cancelarEliminarRefinamiento() {
      set({ confirmacionEliminarRefinamiento: null, mensaje: null });
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
      // P1-5 ronda 4: navegar entre OPDs es cambio de contexto; descartar editor inline.
      set({ opdActivoId: id, seleccionId: null, seleccionados: [], modoSeleccion: "simple", enlaceSeleccionId: null, modoEnlace: null, modoCreacion: null, nuevaCosaPendiente: null, hoverOplRef: null, mensaje: null });
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
          nuevaCosaPendiente: null,
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
          nuevaCosaPendiente: null,
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
            nuevaCosaPendiente: null,
            mensaje: null,
          });
          return;
        }
      }

      set({ mensaje: "Aviso sin elemento navegable" });
    },
  };
}
