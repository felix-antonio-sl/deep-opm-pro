import { useOpmStore } from "../../store";

export function useModoRevisionMobileViewModel() {
  const vistaActiva = useOpmStore((s) => s.vistaMobileActiva);
  const cambiarVista = useOpmStore((s) => s.cambiarVistaMobile);

  return {
    vistaActiva,
    cambiarVista,
  };
}

export type ModoRevisionMobileViewModel = ReturnType<typeof useModoRevisionMobileViewModel>;
