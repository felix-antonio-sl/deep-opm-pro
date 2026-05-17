import { useOpmStore } from "../../store";
import type { WelcomeScreenPort } from "./welcomeScreenPort";

export function useZustandWelcomeScreenPort(): WelcomeScreenPort {
  const pantallaInicioCerrada = useOpmStore((s) => s.pantallaInicioCerrada);
  const cerrarPantallaInicio = useOpmStore((s) => s.cerrarPantallaInicio);

  return {
    pantallaInicioCerrada,
    cerrarPantallaInicio,
  };
}
