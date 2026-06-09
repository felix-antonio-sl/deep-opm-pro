import { refinaA } from "../../modelo/refinamientos";
import type { Id, Modelo, Opd, TipoRefinamiento } from "../../modelo/tipos";

export type TipoBadgeOpd = "raiz" | "inzoom" | "unfold";

export interface AvisoOpdLike {
  reglaId?: string;
  codigo?: string;
  severidad?: "error" | "advertencia" | "info" | "sugerencia";
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
  errores: number;
  advertencias: number;
  primerAvisoCodigo: string | null;
  refinadorId: Id | null;
}

export function calcularBadges(modelo: Modelo, opdId: Id, avisos: readonly AvisoOpdLike[] = []): BadgesNodoOpd {
  const opd = modelo.opds[opdId];
  const refinador = refinadorDeOpd(modelo, opdId);
  const tipo = tipoBadge(modelo, opdId, refinador?.tipo);

  if (!opd) {
    const avisosNodo = avisosEnOpd(modelo, opdId, avisos);
    return {
      tipo,
      cuentaObjetos: 0,
      cuentaProcesos: 0,
      cuentaEnlaces: 0,
      ...resumenAvisos(avisosNodo),
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

  const avisosNodo = avisosEnOpd(modelo, opdId, avisos);
  return {
    tipo,
    cuentaObjetos,
    cuentaProcesos,
    cuentaEnlaces: Object.keys(opd.enlaces).length,
    ...resumenAvisos(avisosNodo),
    refinadorId: refinador?.entidadId ?? null,
  };
}

// Ronda23 L1 #10: el badge mantiene la nomenclatura técnica OPM
// ("Inzoom"/"Unfold") porque clasifica el tipo de OPD, no una acción del
// usuario. Es paralelo al badge "SD" (sustantivo del modelo, no verbo).
// La acción en castellano ("Descomponer"/"Desplegar") vive en barra
// contextual, menú y command palette. Esta separación evita ambigüedad
// y mantiene compactibilidad: cambiar a "Descomp."/"Despl." (8/6 chars)
// reorganiza la celda lo suficiente como para que Playwright clickee el
// botón badge en lugar del treeitem padre (smoke 11-beta1-catalogo-ancla).
export function labelTipoBadge(tipo: TipoBadgeOpd): "SD" | "Inzoom" | "Unfold" {
  if (tipo === "inzoom") return "Inzoom";
  if (tipo === "unfold") return "Unfold";
  return "SD";
}

/**
 * W6.3: chip de vista derivada para el árbol OPD. Solo `generic-view` (E-1):
 * `submodel-view` ya tiene su tag "SM" y `requirement-view` su propio flujo.
 * Devuelve `null` cuando el OPD no es vista genérica.
 */
export function tagVistaOpd(opd: Opd): { label: "Vista"; title: string } | null {
  if (opd.vista?.kind !== "generic-view") return null;
  const base = "Vista derivada (sin semántica de refinamiento)";
  return {
    label: "Vista",
    title: opd.vista.readOnly === true ? `${base} — solo lectura` : base,
  };
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

function avisosEnOpd(modelo: Modelo, opdId: Id, avisos: readonly AvisoOpdLike[]): AvisoOpdLike[] {
  return avisos.filter((aviso) => avisoAfectaOpd(modelo, opdId, aviso));
}

function resumenAvisos(avisos: readonly AvisoOpdLike[]): Pick<BadgesNodoOpd, "tieneIssues" | "errores" | "advertencias" | "primerAvisoCodigo"> {
  return {
    tieneIssues: avisos.length > 0,
    errores: avisos.filter((aviso) => aviso.severidad === "error").length,
    advertencias: avisos.filter((aviso) => aviso.severidad !== "error").length,
    primerAvisoCodigo: codigoAviso(avisos[0]),
  };
}

function codigoAviso(aviso: AvisoOpdLike | undefined): string | null {
  return aviso?.reglaId ?? aviso?.codigo ?? null;
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
