import { store } from "../../store";
import type { GlobalShortcutsPort } from "./globalShortcutsPort";

export function crearZustandGlobalShortcutsPort(): GlobalShortcutsPort {
  return {
    vistaMapaActiva: () => store.getState().vistaMapaActiva,
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
