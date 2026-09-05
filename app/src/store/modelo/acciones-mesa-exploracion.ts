import {
  agregarFuenteExploracion as agregarFuenteKernel,
  agregarTrazoExploracion as agregarTrazoKernel,
  confirmarPropuestaExploracion as confirmarPropuestaKernel,
  crearPropuestaExploracion as crearPropuestaKernel,
  editarPropuestaExploracion as editarPropuestaKernel,
  editarTrazoExploracion as editarTrazoKernel,
} from "../../modelo/mesaExploracion";
import { especieDe } from "../../persistencia/especie";
import {
  commitModelo,
  mensajeBloqueoEdicion,
  type GetStore,
  type SetStore,
} from "../runtime";
import type { ModeloSlice } from "../tipos";

/** Acciones del bucle meta→OPM, disponibles solo para el Apunte activo. */
export function accionesMesaExploracion(set: SetStore, get: GetStore): Partial<ModeloSlice> {
  return {
    agregarFuenteExploracion(input) {
      const estado = get();
      const bloqueo = validarAccesoMesa(estado);
      if (bloqueo) {
        set({ mensaje: bloqueo });
        return null;
      }
      const resultado = agregarFuenteKernel(estado.modelo, input, new Date().toISOString());
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return null;
      }
      const aplicado = commitModelo(set, estado.modelo, resultado.value.modelo, {
        mensaje: "Fuente conservada en la Mesa de exploración",
      });
      return aplicado ? resultado.value.fuenteId : null;
    },

    agregarTrazoExploracion(input) {
      const estado = get();
      const bloqueo = validarAccesoMesa(estado);
      if (bloqueo) {
        set({ mensaje: bloqueo });
        return null;
      }
      const resultado = agregarTrazoKernel(estado.modelo, input, new Date().toISOString());
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return null;
      }
      const aplicado = commitModelo(set, estado.modelo, resultado.value.modelo, {
        mensaje: "Trazo añadido; todavía no es OPM",
      });
      return aplicado ? resultado.value.trazoId : null;
    },

    editarTrazoExploracion(trazoId, texto) {
      const estado = get();
      const bloqueo = validarAccesoMesa(estado);
      if (bloqueo) {
        set({ mensaje: bloqueo });
        return;
      }
      const resultado = editarTrazoKernel(estado.modelo, trazoId, texto, new Date().toISOString());
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, estado.modelo, resultado.value, { mensaje: "Trazo actualizado" });
    },

    crearPropuestaExploracion(input) {
      const estado = get();
      const bloqueo = validarAccesoMesa(estado);
      if (bloqueo) {
        set({ mensaje: bloqueo });
        return null;
      }
      const resultado = crearPropuestaKernel(estado.modelo, {
        trazoIds: input.trazoIds,
        operacion: {
          tipo: "crear-entidad",
          entidadTipo: input.entidadTipo,
          nombre: input.nombre,
          opdId: input.opdId ?? estado.opdActivoId,
        },
      }, new Date().toISOString());
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return null;
      }
      const aplicado = commitModelo(set, estado.modelo, resultado.value.modelo, {
        mensaje: "Propuesta OPM pendiente de confirmación",
      });
      return aplicado ? resultado.value.propuestaId : null;
    },

    editarPropuestaExploracion(propuestaId, input) {
      const estado = get();
      const bloqueo = validarAccesoMesa(estado);
      if (bloqueo) {
        set({ mensaje: bloqueo });
        return;
      }
      const resultado = editarPropuestaKernel(estado.modelo, propuestaId, input);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, estado.modelo, resultado.value, {
        mensaje: "Propuesta revisada contra el estado actual",
      });
    },

    confirmarPropuestaExploracion(propuestaId) {
      const estado = get();
      const bloqueo = validarAccesoMesa(estado);
      if (bloqueo) {
        set({ mensaje: bloqueo });
        return null;
      }
      const resultado = confirmarPropuestaKernel(estado.modelo, propuestaId, new Date().toISOString());
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return null;
      }
      const propuesta = estado.modelo.mesaExploracion?.propuestas[propuestaId];
      const aplicado = commitModelo(set, estado.modelo, resultado.value.modelo, {
        ...(propuesta ? { opdActivoId: propuesta.operacion.opdId } : {}),
        seleccionId: resultado.value.targetId,
        seleccionados: [resultado.value.targetId],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        estadoSeleccionId: null,
        mensaje: "Hecho OPM confirmado con proveniencia",
      });
      return aplicado ? resultado.value.targetId : null;
    },
  };
}

function validarAccesoMesa(
  estado: ReturnType<GetStore>,
): string | null {
  const bloqueo = mensajeBloqueoEdicion(estado);
  if (bloqueo) return bloqueo;
  const idActivo = estado.modeloPersistidoId ?? estado.modelo.id;
  const entrada = estado.indice.modelos.find((modelo) => modelo.id === idActivo);
  if (estado.modelo.id !== idActivo || !entrada || especieDe(entrada) !== "apunte") {
    return "La Mesa de exploración solo está disponible en un Apunte activo";
  }
  return null;
}
