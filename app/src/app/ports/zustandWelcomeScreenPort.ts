import { useOpmStore } from "../../store";
import type { WelcomeScreenPort } from "./welcomeScreenPort";

export function useZustandWelcomeScreenPort(): WelcomeScreenPort {
  const pantallaInicioCerrada = useOpmStore((s) => s.pantallaInicioCerrada);
  const cerrarPantallaInicio = useOpmStore((s) => s.cerrarPantallaInicio);
  const pestanaActivaEsBienvenida = useOpmStore((s) => {
    const activa = s.pestanasAbiertas.find((p) => p.id === s.pestanaActivaId);
    return activa?.cargadoDesde === "bienvenida";
  });
  const precargarBienvenida = useOpmStore((s) => s.precargarBienvenida);

  return {
    pantallaInicioCerrada,
    cerrarPantallaInicio,
    pestanaActivaEsBienvenida,
    precargarBienvenida,
  };
}
