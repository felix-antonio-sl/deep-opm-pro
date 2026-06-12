import { useOpmStore } from "../../store";
import type { SimulationPort } from "./simulationPort";

export function useZustandSimulationPort(): SimulationPort {
  const modelo = useOpmStore((s) => s.modelo);
  const contexto = useOpmStore((s) => s.contextoSimulacion);
  const autoAvance = useOpmStore((s) => s.autoAvanceSimulacionActivo);
  const velocidad = useOpmStore((s) => s.velocidadSimulacion);
  const headless = useOpmStore((s) => s.headlessSimulacion);
  const ejecutarPaso = useOpmStore((s) => s.ejecutarPasoSimulacion);
  const resolverRama = useOpmStore((s) => s.resolverRamaSimulacionActual);
  const ejecutarCorrida = useOpmStore((s) => s.ejecutarCorridaSimulacion);
  const reiniciar = useOpmStore((s) => s.reiniciarSimulacionActual);
  const iniciarAutoAvance = useOpmStore((s) => s.iniciarAutoAvanceSimulacion);
  const pausarAutoAvance = useOpmStore((s) => s.pausarAutoAvanceSimulacion);
  const fijarVelocidad = useOpmStore((s) => s.fijarVelocidadSimulacion);
  const alternarHeadless = useOpmStore((s) => s.alternarHeadlessSimulacion);
  const salir = useOpmStore((s) => s.salirModoSimulacion);
  const fijarModo = useOpmStore((s) => s.fijarModoSimulacion);
  const fijarSemilla = useOpmStore((s) => s.fijarSemillaSimulacion);

  return {
    modelo,
    contexto,
    autoAvance,
    velocidad,
    headless,
    ejecutarPaso,
    resolverRama,
    ejecutarCorrida,
    reiniciar,
    iniciarAutoAvance,
    pausarAutoAvance,
    fijarVelocidad,
    alternarHeadless,
    salir,
    fijarModo,
    fijarSemilla,
  };
}
