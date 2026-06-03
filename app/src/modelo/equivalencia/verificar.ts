import { firmaFronteraDeOpd, fronteraDe } from "./frontera";
import type { Id, Modelo, Resultado } from "../tipos";

export interface RealizacionAlternativa {
  padreId: Id;
  opdA: Id;
  opdB: Id;
}

/**
 * Firma de frontera de una realización: el conjunto de roles netos que la
 * descomposición ejerce sobre cada entidad de frontera (qué consume / produce /
 * habilita), ABSTRAYENDO el subproceso interno que lo hace. Cada firma es
 * `entidadFrontera|tipoEnlace|rol`.
 *
 * Dos realizaciones de un mismo proceso son equivalentes si presentan la misma
 * firma de frontera —el mismo efecto observable sobre el contorno— aunque su
 * interior difiera. Esta es la noción funcional que el método A0 (realizaciones
 * alternativas) necesita; lectura formal: 2-célula (urn:fxsl:kb:icas-higher-categories).
 *
 * NOTA: comparar la `seccionLocal` completa (cimiento F0) sería demasiado
 * estricto: incluye los enlaces a los subprocesos internos, que difieren entre
 * descomposiciones distintas → jamás darían equivalente. Por eso aquí se proyecta
 * a la firma de frontera (rol), no a los hechos-enlace completos.
 *
 * Limitación declarada (MVP): la firma captura entidad-frontera + tipo de enlace
 * + rol; no distingue aún por estado especificado del enlace (consumo en estado X).
 */

export function verificarEquivalencia(
  modelo: Modelo,
  eq: RealizacionAlternativa,
): Resultado<{ equivalente: boolean; diferencias?: string[] }> {
  const frontera = new Set(fronteraDe(modelo, eq.padreId));
  const firmaA = firmaFronteraDeOpd(modelo, frontera, eq.opdA);
  const firmaB = firmaFronteraDeOpd(modelo, frontera, eq.opdB);
  const diferencias: string[] = [];
  for (const f of firmaA) if (!firmaB.has(f)) diferencias.push(f);
  for (const f of firmaB) if (!firmaA.has(f)) diferencias.push(f);
  return {
    ok: true,
    value: { equivalente: diferencias.length === 0, ...(diferencias.length > 0 ? { diferencias } : {}) },
  };
}
