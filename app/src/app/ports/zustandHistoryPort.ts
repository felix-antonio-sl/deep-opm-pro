import { useOpmStore } from "../../store";
import type { HistoryPort } from "./historyPort";

export function useZustandHistoryPort(): HistoryPort {
  const deshacer = useOpmStore((s) => s.deshacer);
  const rehacer = useOpmStore((s) => s.rehacer);
  const puedeDeshacer = useOpmStore((s) => s.puedeDeshacer);
  const puedeRehacer = useOpmStore((s) => s.puedeRehacer);

  return {
    deshacer,
    rehacer,
    puedeDeshacer,
    puedeRehacer,
  };
}
