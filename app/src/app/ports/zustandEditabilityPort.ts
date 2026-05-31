import { useOpmStore } from "../../store";
import { opdActivoEsSoloLectura } from "../../store/runtime";
import type { EditabilityPort } from "./editabilityPort";

export function useZustandEditabilityPort(): EditabilityPort {
  const readOnly = useOpmStore((s) => s.readOnly);
  const vistaReadOnly = useOpmStore((s) => opdActivoEsSoloLectura(s.modelo, s.opdActivoId));

  return {
    readOnly: readOnly || vistaReadOnly,
  };
}
