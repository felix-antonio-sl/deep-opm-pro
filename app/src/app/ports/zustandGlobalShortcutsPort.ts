import { store } from "../../store";
import type { GlobalShortcutsPort } from "./globalShortcutsPort";

export function crearZustandGlobalShortcutsPort(): GlobalShortcutsPort {
  return {
    vistaMapaActiva: () => store.getState().vistaMapaActiva,
    snapshot: () => store.getState(),
  };
}
