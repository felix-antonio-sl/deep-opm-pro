import { useZustandAutosavePort } from "../ports/zustandAutosavePort";

export function useToolbarViewModel() {
  const { autosalvado } = useZustandAutosavePort();

  return {
    autosalvado,
  };
}

export type ToolbarViewModel = ReturnType<typeof useToolbarViewModel>;
