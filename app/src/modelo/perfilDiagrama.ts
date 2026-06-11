import type { Id, Modelo } from "./tipos";

export const PERFIL_CANON_DIAGRAMA = "canon-diagrama";
export const CANON_DIAGRAMA_ADVERTENCIA_APARIENCIAS = 21;
export const CANON_DIAGRAMA_MAX_APARIENCIAS = 25;

export type EstadoPerfilCanonDiagrama = "ok" | "advertencia" | "bloqueado";

export interface PerfilCanonDiagrama {
  perfil: typeof PERFIL_CANON_DIAGRAMA;
  opdId: Id;
  apariencias: number;
  enlaces: number;
  umbralAdvertenciaApariencias: number;
  maxApariencias: number;
  estado: EstadoPerfilCanonDiagrama;
}

export function perfilCanonDiagrama(modelo: Modelo, opdId: Id): PerfilCanonDiagrama {
  const opd = modelo.opds[opdId];
  const apariencias = Object.keys(opd?.apariencias ?? {}).length;
  const enlaces = Object.keys(opd?.enlaces ?? {}).length;
  return {
    perfil: PERFIL_CANON_DIAGRAMA,
    opdId,
    apariencias,
    enlaces,
    umbralAdvertenciaApariencias: CANON_DIAGRAMA_ADVERTENCIA_APARIENCIAS,
    maxApariencias: CANON_DIAGRAMA_MAX_APARIENCIAS,
    estado: estadoPerfilCanonDiagrama(apariencias),
  };
}

function estadoPerfilCanonDiagrama(apariencias: number): EstadoPerfilCanonDiagrama {
  if (apariencias > CANON_DIAGRAMA_MAX_APARIENCIAS) return "bloqueado";
  if (apariencias >= CANON_DIAGRAMA_ADVERTENCIA_APARIENCIAS) return "advertencia";
  return "ok";
}
