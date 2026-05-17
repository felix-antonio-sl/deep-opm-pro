import { useOpmStore } from "../../store";

export function useToolbarMasViewModel() {
  const abierto = useOpmStore((s) => s.toolbarMasAbierto);
  const fijarAbierto = useOpmStore((s) => s.fijarToolbarMasAbierto);

  return {
    abierto,
    fijarAbierto,
  };
}

export type ToolbarMasViewModel = ReturnType<typeof useToolbarMasViewModel>;
