import { store } from "../../store";
import { addFlash } from "../../store/feedback";
import type { GlobalShortcutsPort } from "./globalShortcutsPort";

export function crearZustandGlobalShortcutsPort(): GlobalShortcutsPort {
  return {
    vistaMapaActiva: () => store.getState().vistaMapaActiva,
    notificar: addFlash,
    snapshot: () => {
      const s = store.getState();
      return {
        ...s,
        simulacionActiva: s.contextoSimulacion !== null,
        oplMarginaliaMinimizada: s.indice.preferenciasUi?.oplMinimizado ?? false,
      };
    },
  };
}
