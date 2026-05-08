import { refinaA } from "../../modelo/refinamientos";
import type { Id, Modelo, TipoRefinamiento } from "../../modelo/tipos";

export type TipoBadgeOpd = "raiz" | "inzoom" | "unfold";

export interface AvisoOpdLike {
  opdId?: Id;
  elementoTipo?: "entidad" | "enlace" | "opd";
  elementoId?: Id;
  navegarA?: { tipo: "entidad" | "opd"; id: Id; opdId?: Id };
}

export interface BadgesNodoOpd {
  tipo: TipoBadgeOpd;
  cuentaObjetos: number;
  cuentaProcesos: number;
  cuentaEnlaces: number;
  tieneIssues: boolean;
  refinadorId: Id | null;
}

export function calcularBadges(modelo: Modelo, opdId: Id, avisos: readonly AvisoOpdLike[] = []): BadgesNodoOpd {
  const opd = modelo.opds[opdId];
  const refinador = refinadorDeOpd(modelo, opdId);
  const tipo = tipoBadge(modelo, opdId, refinador?.tipo);

  if (!opd) {
    return {
      tipo,
      cuentaObjetos: 0,
      cuentaProcesos: 0,
      cuentaEnlaces: 0,
      tieneIssues: tieneAvisosEnOpd(modelo, opdId, avisos),
      refinadorId: refinador?.entidadId ?? null,
    };
  }

  let cuentaObjetos = 0;
  let cuentaProcesos = 0;
  for (const apariencia of Object.values(opd.apariencias)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (entidad?.tipo === "objeto") cuentaObjetos += 1;
    if (entidad?.tipo === "proceso") cuentaProcesos += 1;
  }

  return {
    tipo,
    cuentaObjetos,
    cuentaProcesos,
    cuentaEnlaces: Object.keys(opd.enlaces).length,
    tieneIssues: tieneAvisosEnOpd(modelo, opdId, avisos),
    refinadorId: refinador?.entidadId ?? null,
  };
}

export function labelTipoBadge(tipo: TipoBadgeOpd): "SD" | "Inzoom" | "Unfold" {
  if (tipo === "inzoom") return "Inzoom";
  if (tipo === "unfold") return "Unfold";
  return "SD";
}

function tipoBadge(modelo: Modelo, opdId: Id, tipoRefinamiento?: TipoRefinamiento): TipoBadgeOpd {
  if (opdId === modelo.opdRaizId || !tipoRefinamiento) return "raiz";
  return tipoRefinamiento === "descomposicion" ? "inzoom" : "unfold";
}

function refinadorDeOpd(modelo: Modelo, opdId: Id): { entidadId: Id; tipo: TipoRefinamiento } | null {
  for (const entidad of Object.values(modelo.entidades)) {
    const ref = refinaA(entidad, opdId);
    if (ref) return { entidadId: entidad.id, tipo: ref.tipo };
  }
  return null;
}

function tieneAvisosEnOpd(modelo: Modelo, opdId: Id, avisos: readonly AvisoOpdLike[]): boolean {
  return avisos.some((aviso) => avisoAfectaOpd(modelo, opdId, aviso));
}

function avisoAfectaOpd(modelo: Modelo, opdId: Id, aviso: AvisoOpdLike): boolean {
  if (aviso.opdId === opdId) return true;
  if (aviso.navegarA?.tipo === "opd" && aviso.navegarA.id === opdId) return true;
  if (aviso.navegarA?.opdId === opdId) return true;
  if (aviso.elementoTipo === "opd" && aviso.elementoId === opdId) return true;
  if (aviso.elementoTipo === "entidad" && aviso.elementoId) {
    return Object.values(modelo.opds[opdId]?.apariencias ?? {}).some((apariencia) => apariencia.entidadId === aviso.elementoId);
  }
  if (aviso.elementoTipo === "enlace" && aviso.elementoId) {
    return Object.values(modelo.opds[opdId]?.enlaces ?? {}).some((apariencia) => apariencia.enlaceId === aviso.elementoId);
  }
  return false;
}
