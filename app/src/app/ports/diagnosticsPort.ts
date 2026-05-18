import { listarAvisosDiagnostico, type AlcanceAvisosDiagnostico, type AvisoDiagnostico } from "../../modelo/diagnostico";
import type { Id, Modelo } from "../../modelo/tipos";
import type { Aviso } from "../../modelo/validaciones";

export interface DiagnosticsQueryPort {
  listarAvisos: (alcance: AlcanceAvisosDiagnostico) => AvisoDiagnostico[];
}

export interface DiagnosticsPort {
  avisos: AvisoDiagnostico[];
  listarAvisos: (alcance: AlcanceAvisosDiagnostico) => AvisoDiagnostico[];
  navegarAviso: (aviso: Aviso) => void;
}

export interface CrearDiagnosticsPortInput {
  modelo: Modelo;
  opdActivoId: Id;
  navegarAviso: (aviso: Aviso) => void;
}

export function crearDiagnosticsQueryPort(modelo: Modelo): DiagnosticsQueryPort {
  return {
    listarAvisos: (alcance) => listarAvisosDiagnostico(modelo, alcance),
  };
}

export function crearDiagnosticsPort(input: CrearDiagnosticsPortInput): DiagnosticsPort {
  const queryPort = crearDiagnosticsQueryPort(input.modelo);
  return {
    avisos: queryPort.listarAvisos({ tipo: "opd", opdId: input.opdActivoId }),
    listarAvisos: queryPort.listarAvisos,
    navegarAviso: input.navegarAviso,
  };
}
