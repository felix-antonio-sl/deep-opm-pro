import { perfilCanonDiagrama } from "./perfilDiagrama";
import type { Modelo } from "./tipos";

export interface MetricasComplejidadModelo {
  entidades: number;
  estados: number;
  enlaces: number;
  opds: number;
  opdsBloqueadosPorDensidad: number;
  maxAparienciasEnOpd: number;
  score: number;
}

export function calcularMetricasComplejidad(modelo: Modelo): MetricasComplejidadModelo {
  const perfiles = Object.keys(modelo.opds).map((opdId) => perfilCanonDiagrama(modelo, opdId));
  const entidades = Object.keys(modelo.entidades).length;
  const estados = Object.keys(modelo.estados).length;
  const enlaces = Object.keys(modelo.enlaces).length;
  const opds = Object.keys(modelo.opds).length;
  return {
    entidades,
    estados,
    enlaces,
    opds,
    opdsBloqueadosPorDensidad: perfiles.filter((perfil) => perfil.estado === "bloqueado").length,
    maxAparienciasEnOpd: perfiles.reduce((max, perfil) => Math.max(max, perfil.apariencias), 0),
    score: entidades + estados * 0.5 + enlaces * 1.5 + opds * 2,
  };
}
