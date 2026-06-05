// Check de DUPLICADO-POR-ABSORCIÓN (adjudicación dov-dori 2026-06-05, hallazgo
// (c), capa 2 — red de seguridad semántica, independiente de la forma).
//
// Atrapa el modo de fallo que el guard R9 previene en el punto de creación, pero
// sobre un MODELO YA CONSTRUIDO (bundles pre-guard, otras rutas de creación):
// dos cosas cuyos nombres difieren solo en un sufijo parentético son, casi
// siempre, UNA cosa duplicada por absorción de material residual
// (`Permiso de edificación` vs `Permiso de edificación (LGUC art. 116)`).
//
// El check DETECTA y REPORTA; no fusiona (podrían ser legítimamente distintas en
// un dominio raro — la decisión es del humano). `esCita` escala la severidad:
// si el sufijo matchea un localizador de cita, es casi seguro corrupción.

import type { Modelo } from "../../modelo/tipos";

/** Un par sospechoso de duplicado por absorción. */
export interface DuplicadoPorAbsorcion {
  /** Id de la entidad con el nombre base (limpio). */
  baseId: string;
  /** Id de la entidad cuyo nombre = base + sufijo parentético. */
  absorbidoId: string;
  nombreBase: string;
  /** El sufijo residual (con paréntesis/corchetes). */
  sufijo: string;
  /** true si el sufijo parece una cita normativa (localizador art./§/N°) — escala a casi-seguro corrupción. */
  esCita: boolean;
}

const SUFIJO_CITA_RE = /(?:\bart[s]?\.|§|\bN°|\bn[uú]m(?:eral)?)\s*\d/iu;

/**
 * Detecta pares (base, base + "(sufijo)") entre las entidades del modelo.
 * Pura; O(N) con índice por nombre exacto.
 */
export function detectarDuplicadosPorAbsorcion(modelo: Modelo): DuplicadoPorAbsorcion[] {
  const porNombre = new Map<string, string>();
  for (const e of Object.values(modelo.entidades)) {
    porNombre.set(e.nombre.trim(), e.id);
  }
  const pares: DuplicadoPorAbsorcion[] = [];
  for (const e of Object.values(modelo.entidades)) {
    const m = /^(.+?)\s*([([].*[)\]])\s*$/u.exec(e.nombre.trim());
    if (!m) continue;
    const base = (m[1] ?? "").trim();
    const sufijo = (m[2] ?? "").trim();
    const baseId = porNombre.get(base);
    if (!baseId || baseId === e.id) continue;
    pares.push({
      baseId,
      absorbidoId: e.id,
      nombreBase: base,
      sufijo,
      esCita: SUFIJO_CITA_RE.test(sufijo),
    });
  }
  return pares;
}
