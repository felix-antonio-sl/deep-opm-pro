import { seccionLocal, type ConjuntoDeHechos, type Hecho } from "../hechos";
import { fronteraDe } from "./frontera";
import type { Id, Modelo, Resultado } from "../tipos";

export interface RealizacionAlternativa {
  padreId: Id;
  opdA: Id;
  opdB: Id;
}

function unionSecciones(
  modelo: Modelo,
  entidadIds: Id[],
  opdId: Id,
): ConjuntoDeHechos {
  const resultado = new Map<string, Hecho>();
  for (const entidadId of entidadIds) {
    const seccion = seccionLocal(modelo, entidadId, opdId);
    for (const [clave, hecho] of seccion) {
      if (!resultado.has(clave)) resultado.set(clave, hecho);
    }
  }
  return resultado;
}

function diferenciaSimetrica(
  a: ConjuntoDeHechos,
  b: ConjuntoDeHechos,
): ConjuntoDeHechos {
  const resultado = new Map<string, Hecho>();
  for (const [clave, hecho] of a) {
    if (!b.has(clave)) resultado.set(clave, hecho);
  }
  for (const [clave, hecho] of b) {
    if (!a.has(clave)) resultado.set(clave, hecho);
  }
  return resultado;
}

export function verificarEquivalencia(
  modelo: Modelo,
  eq: RealizacionAlternativa,
): Resultado<{ equivalente: boolean; diferencias?: ConjuntoDeHechos }> {
  const frontera = fronteraDe(modelo, eq.padreId);
  const hechosA = unionSecciones(modelo, frontera, eq.opdA);
  const hechosB = unionSecciones(modelo, frontera, eq.opdB);
  const diffs = diferenciaSimetrica(hechosA, hechosB);
  return {
    ok: true,
    value: {
      equivalente: diffs.size === 0,
      ...(diffs.size > 0 ? { diferencias: diffs } : {}),
    },
  };
}
