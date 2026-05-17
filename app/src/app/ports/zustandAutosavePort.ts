import { useOpmStore } from "../../store";
import type { AutosavePort } from "./autosavePort";

export function useZustandAutosavePort(): AutosavePort {
  const autosalvado = useOpmStore((s) => s.autosalvado);
  const iniciarAutosalvado = useOpmStore((s) => s.iniciarAutosalvado);
  const detenerAutosalvado = useOpmStore((s) => s.detenerAutosalvado);

  return {
    autosalvado,
    iniciarAutosalvado,
    detenerAutosalvado,
  };
}
