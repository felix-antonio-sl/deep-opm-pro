import { useOpmStore } from "../../store";
import { useZustandAutosavePort } from "../ports/zustandAutosavePort";

export function useToolbarViewModel() {
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const { autosalvado } = useZustandAutosavePort();

  return {
    vistaMapaActiva,
    autosalvado,
  };
}

export type ToolbarViewModel = ReturnType<typeof useToolbarViewModel>;
