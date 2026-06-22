// Sello de procedencia del bundle (W5.3 / L6) — kernel PURO, sin IO.
//
// Diseño consensuado (acta mesa flujo-canónico 2026-06-04, líneas 52-53;
// glosario eliminado 2026-06-09 — el proto es la fuente única autoral):
// el bundle emitido porta `{protoHash, autoriaVersion, layoutVersion}`;
// la staleness se define sobre artefactos estables (hash de CONTENIDO del
// proto), no sobre ids internos. La divergencia se REPORTA con ambos valores
// (honestidad temporal: el proto sigue siendo el portador canónico de la
// trazabilidad legal aunque diverja — no es stale-y-descartable).
//
// Quién lee archivos es el consumidor (script/piloto): aquí solo se hashea
// contenido ya leído, se construye el sello y se comparan dos sellos.

import type { SelloProcedencia } from "../modelo/tipos";
import { COMPONENTES_SELLO } from "../modelo/tipos";
import { LAYOUT_VERSION } from "./layout";

/**
 * Versión declarada del módulo de autoría (DSL + compilador proto→Modelo).
 * Se incrementa SOLO con un cambio deliberado de semántica de emisión
 * (protocolo re-pin); un bundle sellado con otra versión reporta divergencia.
 */
export const AUTORIA_VERSION = "1";

/**
 * Hash determinista de contenido: FNV-1a de 64 bits en hex. NO criptográfico —
 * detecta divergencia de artefactos (L6), no resiste adversarios. Puro y
 * síncrono a propósito: corre igual en Bun (scripts) y en el navegador (W6.6,
 * panel de procedencia) sin depender de crypto asíncrona.
 */
export function hashContenido(texto: string): string {
  const PRIME = 0x100000001b3n;
  const MASK = 0xffffffffffffffffn;
  let hash = 0xcbf29ce484222325n;
  // FNV-1a sobre los bytes UTF-8 (codePoint → bytes), determinista por contenido.
  for (let i = 0; i < texto.length; i++) {
    const code = texto.codePointAt(i)!;
    if (code > 0xffff) i++; // par sustituto consumido
    // Expansión UTF-8 manual (1-4 bytes) para no depender de TextEncoder.
    if (code < 0x80) {
      hash = ((hash ^ BigInt(code)) * PRIME) & MASK;
    } else if (code < 0x800) {
      hash = ((hash ^ BigInt(0xc0 | (code >> 6))) * PRIME) & MASK;
      hash = ((hash ^ BigInt(0x80 | (code & 0x3f))) * PRIME) & MASK;
    } else if (code < 0x10000) {
      hash = ((hash ^ BigInt(0xe0 | (code >> 12))) * PRIME) & MASK;
      hash = ((hash ^ BigInt(0x80 | ((code >> 6) & 0x3f))) * PRIME) & MASK;
      hash = ((hash ^ BigInt(0x80 | (code & 0x3f))) * PRIME) & MASK;
    } else {
      hash = ((hash ^ BigInt(0xf0 | (code >> 18))) * PRIME) & MASK;
      hash = ((hash ^ BigInt(0x80 | ((code >> 12) & 0x3f))) * PRIME) & MASK;
      hash = ((hash ^ BigInt(0x80 | ((code >> 6) & 0x3f))) * PRIME) & MASK;
      hash = ((hash ^ BigInt(0x80 | (code & 0x3f))) * PRIME) & MASK;
    }
  }
  return hash.toString(16).padStart(16, "0");
}

/** Insumos del sello: el CONTENIDO (ya leído) del proto. */
export interface InsumosSello {
  protoTexto: string;
}

/** Construye el sello de procedencia de una emisión (las 3 componentes del acta). */
export function construirSello(insumos: InsumosSello): SelloProcedencia {
  return {
    protoHash: hashContenido(insumos.protoTexto),
    autoriaVersion: AUTORIA_VERSION,
    layoutVersion: LAYOUT_VERSION,
  };
}

/** Una componente del sello que difiere entre el bundle y el estado actual. */
export interface ComponenteDivergente {
  componente: keyof SelloProcedencia;
  /** Valor sellado en el bundle (la emisión). */
  bundle: string;
  /** Valor recomputado sobre los artefactos actuales. */
  actual: string;
}

/** Resultado de la detección de divergencia (L6). Reporta, no descarta. */
export interface DivergenciaProcedencia {
  divergente: boolean;
  /** En orden estable del sello: protoHash, autoriaVersion, layoutVersion. */
  componentes: ComponenteDivergente[];
}

/** Compara el sello del bundle contra el sello recomputado y nombra cada componente divergente. */
export function compararProcedencia(
  selloBundle: SelloProcedencia,
  selloActual: SelloProcedencia,
): DivergenciaProcedencia {
  const componentes: ComponenteDivergente[] = [];
  for (const componente of COMPONENTES_SELLO) {
    if (selloBundle[componente] !== selloActual[componente]) {
      componentes.push({ componente, bundle: selloBundle[componente], actual: selloActual[componente] });
    }
  }
  return { divergente: componentes.length > 0, componentes };
}
