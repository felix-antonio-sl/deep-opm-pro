import { useZustandAutosavePort } from "../ports/zustandAutosavePort";
import { useZustandMapViewPort } from "../ports/zustandMapViewPort";

export function useToolbarViewModel() {
  const { vistaMapaActiva } = useZustandMapViewPort();
  const { autosalvado } = useZustandAutosavePort();

  return {
    vistaMapaActiva,
    autosalvado,
  };
}

export type ToolbarViewModel = ReturnType<typeof useToolbarViewModel>;
