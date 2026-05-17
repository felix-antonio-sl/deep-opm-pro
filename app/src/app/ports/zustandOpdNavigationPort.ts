import { useOpmStore } from "../../store";
import type { OpdNavigationPort } from "./opdNavigationPort";

export function useZustandOpdNavigationPort(): OpdNavigationPort {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);

  return {
    modelo,
    opdActivoId,
    cambiarOpdActivo,
  };
}
