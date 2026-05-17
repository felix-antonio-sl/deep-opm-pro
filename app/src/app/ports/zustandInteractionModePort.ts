import { useOpmStore } from "../../store";
import type { InteractionModePort } from "./interactionModePort";

export function useZustandInteractionModePort(): InteractionModePort {
  const modoEnlace = useOpmStore((s) => s.modoEnlace);
  const modoSeleccion = useOpmStore((s) => s.modoSeleccion);

  return {
    modoEnlace,
    modoSeleccion,
  };
}
