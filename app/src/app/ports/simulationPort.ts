import type { OpmStore } from "../../store";

export interface SimulationPort {
  contexto: OpmStore["contextoSimulacion"];
  autoAvance: OpmStore["autoAvanceSimulacionActivo"];
  velocidad: OpmStore["velocidadSimulacion"];
  ejecutarPaso: OpmStore["ejecutarPasoSimulacion"];
  ejecutarCorrida: OpmStore["ejecutarCorridaSimulacion"];
  reiniciar: OpmStore["reiniciarSimulacionActual"];
  iniciarAutoAvance: OpmStore["iniciarAutoAvanceSimulacion"];
  pausarAutoAvance: OpmStore["pausarAutoAvanceSimulacion"];
  fijarVelocidad: OpmStore["fijarVelocidadSimulacion"];
  salir: OpmStore["salirModoSimulacion"];
}
