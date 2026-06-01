import type { RngSimulacion } from "./parametros";

/**
 * PRNG determinista (mulberry32). Misma semilla => misma secuencia. Puro.
 */
export function rngSembrado(semilla: number): RngSimulacion {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
