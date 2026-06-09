// Aserción de reproducibilidad / golden-harness (H2, upstream hd-opm) — kernel
// PURO, sin IO. Reemplaza el ritual `md5sum` manual del dogfood byte-idéntico por
// una verificación pass/fail con diff legible. Compone con el sello de procedencia
// (autoria/procedencia): cuando ambos bundles lo portan, nombra QUÉ componente del
// sello cambió (protoHash/autoriaVersion/layoutVersion) — la causa de la divergencia.
// Quién lee/escribe archivos es el consumidor (script/CI); aquí solo se compara.
import type { SelloProcedencia } from "../modelo/tipos";
import { emitirBundle } from "./bundle";
import type { Autor } from "./dsl";
import { compararProcedencia, type DivergenciaProcedencia } from "./procedencia";
import type { OpcionesBundle } from "./tipos";

/** Una línea que difiere entre el bundle regenerado y el golden versionado. */
export interface DiferenciaLinea {
  /** Número de línea 1-based. */
  linea: number;
  /** Línea del golden (`null` si el golden no llega a esa línea). */
  esperado: string | null;
  /** Línea del bundle regenerado (`null` si no llega a esa línea). */
  generado: string | null;
}

export interface ResultadoReproducibilidad {
  /** Veredicto: el bundle regenerado es byte-idéntico al golden. */
  byteIdentico: boolean;
  bytesGenerado: number;
  bytesEsperado: number;
  /** Divergencia del sello (solo si AMBOS bundles portan `modelo.procedencia`). */
  procedencia?: DivergenciaProcedencia;
  /** Hasta `maxDiferencias` (def. 5) líneas divergentes, en orden, con su número. */
  primerasDiferencias: DiferenciaLinea[];
}

export interface OpcionesReproducibilidad {
  /** Tope de líneas divergentes reportadas (def. 5). */
  maxDiferencias?: number;
  /** Opciones de emisión para `verificarReproducibilidad` (def. `{}`). */
  bundle?: OpcionesBundle;
}

function selloDe(json: string): SelloProcedencia | undefined {
  try {
    return (JSON.parse(json) as { modelo?: { procedencia?: SelloProcedencia } }).modelo?.procedencia;
  } catch {
    return undefined;
  }
}

/**
 * Compara dos bundles JSON ya emitidos. Primitiva pura: veredicto byte-identidad
 * + enriquecimiento de sello + primeras N líneas divergentes.
 */
export function compararReproducibilidad(
  jsonGenerado: string,
  jsonEsperado: string,
  opts: { maxDiferencias?: number } = {},
): ResultadoReproducibilidad {
  const byteIdentico = jsonGenerado === jsonEsperado;
  const resultado: ResultadoReproducibilidad = {
    byteIdentico,
    bytesGenerado: jsonGenerado.length,
    bytesEsperado: jsonEsperado.length,
    primerasDiferencias: [],
  };
  if (byteIdentico) return resultado;

  // Causa a alto nivel: qué componente del sello cambió (si ambos lo portan).
  // `compararProcedencia(selloBundle, selloActual)`: bundle = golden versionado,
  // actual = regeneración.
  const selloGolden = selloDe(jsonEsperado);
  const selloGenerado = selloDe(jsonGenerado);
  if (selloGolden && selloGenerado) {
    resultado.procedencia = compararProcedencia(selloGolden, selloGenerado);
  }

  // Dónde: primeras N líneas divergentes.
  const max = opts.maxDiferencias ?? 5;
  const lineasGen = jsonGenerado.split("\n");
  const lineasEsp = jsonEsperado.split("\n");
  const total = Math.max(lineasGen.length, lineasEsp.length);
  for (let i = 0; i < total && resultado.primerasDiferencias.length < max; i += 1) {
    const generado = i < lineasGen.length ? lineasGen[i]! : null;
    const esperado = i < lineasEsp.length ? lineasEsp[i]! : null;
    if (generado !== esperado) resultado.primerasDiferencias.push({ linea: i + 1, esperado, generado });
  }
  return resultado;
}

/**
 * Azúcar que honra el pedido upstream `verificarReproducibilidad(autor, esperado)`:
 * emite el bundle del autor y lo compara byte a byte contra el golden versionado.
 */
export function verificarReproducibilidad(
  autor: Autor,
  jsonEsperado: string,
  opts: OpcionesReproducibilidad = {},
): ResultadoReproducibilidad {
  const { json } = emitirBundle(autor, opts.bundle ?? {});
  return compararReproducibilidad(json, jsonEsperado, opts.maxDiferencias !== undefined ? { maxDiferencias: opts.maxDiferencias } : {});
}
