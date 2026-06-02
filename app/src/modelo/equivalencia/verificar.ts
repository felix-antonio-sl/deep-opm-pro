import { fronteraDe } from "./frontera";
import type { Id, Modelo, Resultado } from "../tipos";

export interface RealizacionAlternativa {
  padreId: Id;
  opdA: Id;
  opdB: Id;
}

function entidadDeExtremo(extremo: { kind: string; id: Id }, modelo: Modelo): Id | null {
  if (extremo.kind === "entidad") return extremo.id;
  return modelo.estados[extremo.id]?.entidadId ?? null;
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
function firmaFrontera(modelo: Modelo, frontera: ReadonlySet<Id>, opdId: Id): Set<string> {
  const firma = new Set<string>();
  const opd = modelo.opds[opdId];
  if (!opd) return firma;
  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    const origen = entidadDeExtremo(enlace.origenId, modelo);
    const destino = entidadDeExtremo(enlace.destinoId, modelo);
    if (origen && frontera.has(origen)) firma.add(`${origen}|${enlace.tipo}|origen`);
    if (destino && frontera.has(destino)) firma.add(`${destino}|${enlace.tipo}|destino`);
  }
  return firma;
}

export function verificarEquivalencia(
  modelo: Modelo,
  eq: RealizacionAlternativa,
): Resultado<{ equivalente: boolean; diferencias?: string[] }> {
  const frontera = new Set(fronteraDe(modelo, eq.padreId));
  const firmaA = firmaFrontera(modelo, frontera, eq.opdA);
  const firmaB = firmaFrontera(modelo, frontera, eq.opdB);
  const diferencias: string[] = [];
  for (const f of firmaA) if (!firmaB.has(f)) diferencias.push(f);
  for (const f of firmaB) if (!firmaA.has(f)) diferencias.push(f);
  return {
    ok: true,
    value: { equivalente: diferencias.length === 0, ...(diferencias.length > 0 ? { diferencias } : {}) },
  };
}
