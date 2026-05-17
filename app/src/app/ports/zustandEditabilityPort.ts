import { useOpmStore } from "../../store";
import type { EditabilityPort } from "./editabilityPort";

export function useZustandEditabilityPort(): EditabilityPort {
  const readOnly = useOpmStore((s) => s.readOnly);

  return {
    readOnly,
  };
}
