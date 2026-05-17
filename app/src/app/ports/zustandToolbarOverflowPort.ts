import { useOpmStore } from "../../store";
import type { ToolbarOverflowPort } from "./toolbarOverflowPort";

export function useZustandToolbarOverflowPort(): ToolbarOverflowPort {
  const abierto = useOpmStore((s) => s.toolbarMasAbierto);
  const fijarAbierto = useOpmStore((s) => s.fijarToolbarMasAbierto);

  return {
    abierto,
    fijarAbierto,
  };
}
