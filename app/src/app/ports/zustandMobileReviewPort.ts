import { useOpmStore } from "../../store";
import type { MobileReviewPort } from "./mobileReviewPort";

export function useZustandMobileReviewPort(): MobileReviewPort {
  const vistaMobileActiva = useOpmStore((s) => s.vistaMobileActiva);
  const cambiarVistaMobile = useOpmStore((s) => s.cambiarVistaMobile);

  return {
    vistaMobileActiva,
    cambiarVistaMobile,
  };
}
