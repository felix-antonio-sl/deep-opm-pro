import type { ModoSimulacion } from "../../modelo/simulacion/tipos";
import type { OpmStore } from "../../store";

export interface SimulationPort {
  contexto: OpmStore["contextoSimulacion"];
  autoAvance: OpmStore["autoAvanceSimulacionActivo"];
  velocidad: OpmStore["velocidadSimulacion"];
  headless: OpmStore["headlessSimulacion"];
  ejecutarPaso: OpmStore["ejecutarPasoSimulacion"];
  ejecutarCorrida: OpmStore["ejecutarCorridaSimulacion"];
  reiniciar: OpmStore["reiniciarSimulacionActual"];
  iniciarAutoAvance: OpmStore["iniciarAutoAvanceSimulacion"];
  pausarAutoAvance: OpmStore["pausarAutoAvanceSimulacion"];
  fijarVelocidad: OpmStore["fijarVelocidadSimulacion"];
  alternarHeadless: OpmStore["alternarHeadlessSimulacion"];
  salir: OpmStore["salirModoSimulacion"];
  fijarModo: (modo: ModoSimulacion) => void;
  fijarSemilla: (semilla: number) => void;
}
