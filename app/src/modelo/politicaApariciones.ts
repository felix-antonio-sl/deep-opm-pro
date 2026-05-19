import {
  aparienciaEsInternaDeRefinamiento,
  contextoRefinamientoValido,
  rolAparienciaEnRefinamiento,
} from "./contextoRefinamiento";
import type { Apariencia, ContextoRefinamientoApariencia, Id, Modelo, Opd, RolContextoRefinamiento } from "./tipos";

export type OrigenAparicion =
  | "manual"
  | "refinamiento-contorno"
  | "refinamiento-interno"
  | "refinamiento-externo-materializado"
  | "plegado-extraido";

export interface PoliticaAparicion {
  visible: true;
  razonVisibilidad: "apariencia-en-opd";
  origen: OrigenAparicion;
  rolRefinamiento: RolContextoRefinamiento;
  contextoRefinamiento: ContextoRefinamientoApariencia | null;
  confinadaAContorno: boolean;
  limpiableAutomaticamente: boolean;
}

export function aparicionesVisiblesEnOpd(opd: Pick<Opd, "apariencias">): Apariencia[] {
  return Object.values(opd.apariencias);
}

/**
 * SSOT operacional de visibilidad: una entidad aparece en un OPD si y solo si
 * existe una Apariencia local que la proyecta en `opd.apariencias`.
 */
export function entidadVisibleEnOpd(opd: Pick<Opd, "apariencias">, entidadId: Id): boolean {
  return aparienciaDeEntidadEnOpd(opd, entidadId) !== null;
}

export function aparienciaDeEntidadEnOpd(opd: Pick<Opd, "apariencias">, entidadId: Id): Apariencia | null {
  return aparicionesVisiblesEnOpd(opd).find((apariencia) => apariencia.entidadId === entidadId) ?? null;
}

export function entidadesVisiblesEnOpd(opd: Pick<Opd, "apariencias">): Set<Id> {
  return new Set(aparicionesVisiblesEnOpd(opd).map((apariencia) => apariencia.entidadId));
}

export function opdIdDeEntidadVisible(modelo: Modelo, entidadId: Id, opdPreferidoId?: Id): Id | null {
  const preferido = opdPreferidoId ? modelo.opds[opdPreferidoId] : null;
  if (preferido && entidadVisibleEnOpd(preferido, entidadId)) return preferido.id;
  for (const opd of Object.values(modelo.opds)) {
    if (entidadVisibleEnOpd(opd, entidadId)) return opd.id;
  }
  return null;
}

export function aparienciaRenderizableEnOpd(opd: Pick<Opd, "apariencias">, apariencia: Apariencia): boolean {
  return opd.apariencias[apariencia.id]?.entidadId === apariencia.entidadId;
}

export function clasificarAparicion(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  opciones: { esContornoDerivado?: boolean } = {},
): PoliticaAparicion | null {
  const opd = modelo.opds[opdId];
  if (!opd || !aparienciaRenderizableEnOpd(opd, apariencia)) return null;

  const contexto = contextoRefinamientoValido(modelo, opdId, apariencia);
  const origen = origenDeAparicion(contexto, apariencia);
  const rolRefinamiento = rolAparienciaEnRefinamiento(modelo, opdId, apariencia, opciones.esContornoDerivado ?? false);
  return {
    visible: true,
    razonVisibilidad: "apariencia-en-opd",
    origen,
    rolRefinamiento,
    contextoRefinamiento: contexto,
    confinadaAContorno: aparienciaEsInternaDeRefinamiento(modelo, opdId, apariencia),
    limpiableAutomaticamente: origen === "refinamiento-externo-materializado",
  };
}

export function aparienciaLimpiableAutomaticamente(
  modelo: Modelo,
  opdId: Id,
  apariencia: Apariencia,
  refinableEntidadId?: Id,
): boolean {
  const politica = clasificarAparicion(modelo, opdId, apariencia);
  if (!politica?.limpiableAutomaticamente) return false;
  if (!refinableEntidadId) return true;
  return politica.contextoRefinamiento?.refinableEntidadId === refinableEntidadId;
}

function origenDeAparicion(
  contexto: ContextoRefinamientoApariencia | null,
  apariencia: Apariencia,
): OrigenAparicion {
  if (contexto?.rol === "contorno") return "refinamiento-contorno";
  if (contexto?.rol === "interno") return "refinamiento-interno";
  if (contexto?.rol === "externo") return "refinamiento-externo-materializado";
  if (apariencia.parteExtraidaDe) return "plegado-extraido";
  return "manual";
}
