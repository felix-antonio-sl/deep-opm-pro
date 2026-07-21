import {
  actualizarFichaTrabajo as actualizarFichaTrabajoModelo,
  actualizarLentesConocimiento as actualizarLentesModelo,
} from "../../modelo/fichaTrabajo";
import { commitModelo, mensajeBloqueoEdicion, type GetStore, type SetStore } from "../runtime";
import type { ModeloSlice } from "../tipos";

export function accionesFicha(set: SetStore, get: GetStore): Partial<ModeloSlice> {
  return {
    actualizarFichaTrabajo(ficha) {
      const estado = get();
      const bloqueo = mensajeBloqueoEdicion(estado);
      if (bloqueo) {
        set({ mensaje: bloqueo });
        return;
      }
      const resultado = actualizarFichaTrabajoModelo(estado.modelo, ficha);
      if (!resultado.ok) {
        set({ mensaje: resultado.error });
        return;
      }
      commitModelo(set, estado.modelo, resultado.value, { mensaje: null });
    },

    actualizarLentesConocimiento(lentes) {
      const estado = get();
      const bloqueo = mensajeBloqueoEdicion(estado);
      if (bloqueo) {
        set({ mensaje: bloqueo });
        return;
      }
      commitModelo(set, estado.modelo, actualizarLentesModelo(estado.modelo, lentes), { mensaje: null });
    },
  };
}
