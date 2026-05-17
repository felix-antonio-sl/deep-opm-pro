import { useOpmStore } from "../../store";
import type { SimulationPort } from "./simulationPort";

export function useZustandSimulationPort(): SimulationPort {
  const contexto = useOpmStore((s) => s.contextoSimulacion);
  const autoAvance = useOpmStore((s) => s.autoAvanceSimulacionActivo);
  const velocidad = useOpmStore((s) => s.velocidadSimulacion);
  const ejecutarPaso = useOpmStore((s) => s.ejecutarPasoSimulacion);
  const ejecutarCorrida = useOpmStore((s) => s.ejecutarCorridaSimulacion);
  const reiniciar = useOpmStore((s) => s.reiniciarSimulacionActual);
  const iniciarAutoAvance = useOpmStore((s) => s.iniciarAutoAvanceSimulacion);
  const pausarAutoAvance = useOpmStore((s) => s.pausarAutoAvanceSimulacion);
  const fijarVelocidad = useOpmStore((s) => s.fijarVelocidadSimulacion);
  const salir = useOpmStore((s) => s.salirModoSimulacion);

  return {
    contexto,
    autoAvance,
    velocidad,
    ejecutarPaso,
    ejecutarCorrida,
    reiniciar,
    iniciarAutoAvance,
    pausarAutoAvance,
    fijarVelocidad,
    salir,
  };
}
