import { useZustandToolbarOverflowPort } from "../ports/zustandToolbarOverflowPort";

export function useToolbarMasViewModel() {
  const { abierto, fijarAbierto } = useZustandToolbarOverflowPort();

  return {
    abierto,
    fijarAbierto,
  };
}

export type ToolbarMasViewModel = ReturnType<typeof useToolbarMasViewModel>;
