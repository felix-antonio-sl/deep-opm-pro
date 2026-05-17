import { useZustandMobileReviewPort } from "../ports/zustandMobileReviewPort";

export function useModoRevisionMobileViewModel() {
  const {
    vistaMobileActiva: vistaActiva,
    cambiarVistaMobile: cambiarVista,
  } = useZustandMobileReviewPort();

  return {
    vistaActiva,
    cambiarVista,
  };
}

export type ModoRevisionMobileViewModel = ReturnType<typeof useModoRevisionMobileViewModel>;
