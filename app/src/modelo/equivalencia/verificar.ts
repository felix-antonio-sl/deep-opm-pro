import { firmaFronteraDeOpd, fronteraDe } from "./frontera";
import type { Id, Modelo, Resultado } from "../tipos";

export interface RealizacionAlternativa {
  padreId: Id;
  opdA: Id;
  opdB: Id;
}

/**
 * Compara el conjunto de roles netos que cada realización ejerce sobre su
 * frontera (qué consume / produce / habilita), abstrayendo el interior. Cada
 * elemento de la firma es `entidadFrontera|tipoEnlace|rol`.
 *
 * Una firma igual hace las realizaciones indistinguibles respecto de esos
 * observables. No demuestra identidad, bisimulación, equivalencia categorial ni
 * sustituibilidad total: estados, protocolos, errores, timing y otros efectos
 * pueden distinguirlas.
 *
 * NOTA: comparar la `seccionLocal` completa (cimiento F0) sería demasiado
 * estricto: incluye enlaces a subprocesos internos, que difieren entre
 * descomposiciones. Por eso aquí se proyecta
 * a la firma de frontera (rol), no a los hechos-enlace completos.
 *
 * Limitación declarada (MVP): la firma captura entidad-frontera + tipo de enlace
 * + rol; no distingue aún por estado especificado del enlace (consumo en estado X).
 */

export interface BoundarySignatureComparison {
  sameSignature: boolean;
  scope: "boundary-signature";
  differences?: string[];
}

export function compareBoundarySignature(
  modelo: Modelo,
  eq: RealizacionAlternativa,
): Resultado<BoundarySignatureComparison> {
  const frontera = new Set(fronteraDe(modelo, eq.padreId));
  const firmaA = firmaFronteraDeOpd(modelo, frontera, eq.opdA);
  const firmaB = firmaFronteraDeOpd(modelo, frontera, eq.opdB);
  const diferencias: string[] = [];
  for (const f of firmaA) if (!firmaB.has(f)) diferencias.push(f);
  for (const f of firmaB) if (!firmaA.has(f)) diferencias.push(f);
  return {
    ok: true,
    value: {
      sameSignature: diferencias.length === 0,
      scope: "boundary-signature",
      ...(diferencias.length > 0 ? { differences: diferencias } : {}),
    },
  };
}
