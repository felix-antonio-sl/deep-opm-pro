import type { Id, Modelo, Opd } from "./tipos";

/**
 * OPD suelto (R-OPD-REF-20): fragmento fuera del árbol de refinamiento —
 * `padreId === null` y NO es la raíz canónica (`opdRaizId`). Estado transitorio
 * legítimo del arranque bottom-up. La raíz siempre tiene `padreId:null` pero
 * es el tronco, no un suelto.
 */
export function opdsSueltos(modelo: Modelo): Opd[] {
  return Object.values(modelo.opds).filter(
    (opd) => opd.padreId === null && opd.id !== modelo.opdRaizId,
  );
}

export function esOpdSuelto(modelo: Modelo, opdId: Id): boolean {
  const opd = modelo.opds[opdId];
  return !!opd && opd.padreId === null && opd.id !== modelo.opdRaizId;
}
