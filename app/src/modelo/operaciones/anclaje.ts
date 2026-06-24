// Operación del modo `anclaje` (referencia viva): ancla una cosa a un tipo de una
// biblioteca de tipos externa (la greda gist) SIN copiar. Es el "anti-injerto":
// espeja el contrato de referencia de `conectarSubmodelo` pero NO materializa el
// snapshot (≠ `injertarEstereotipo`/graft de D6, que clona-e-injerta). Aditivo: no
// toca `estereotipoId` (marker local del graft) ni el resto del modelo.
//
// Derivado de `gist-opm/docs/derivaciones/brecha-anclaje-referencial-opforja-2026-06-23.md`
// §7.3 y del acta `docs/auditorias/2026-06-24-acta-alcance-anclaje-gist.md`. La forma
// OPL/visual del anclaje (C6/C7) espera doctrina custodio-kora (a); este corte es solo
// el kernel referencial + su eval-de-mecanismo.
import type { Id, Modelo, Resultado, BibliotecaRef } from "../tipos";
import { fallo, ok } from "./helpers";

/**
 * Ancla `entidadId` al tipo `piezaId` de la biblioteca `biblioteca`, como
 * referencia viva. NO clona ni materializa: el modelo gana 0 entidades; solo se
 * asigna `Entidad.anclaje`. La resolución del tipo contra la biblioteca
 * (render/OPL/validación, drift por `frozenAtHash`) es lazy y vive fuera de esta
 * operación pura.
 */
export function anclarAPieza(
  modelo: Modelo,
  entidadId: Id,
  biblioteca: BibliotecaRef,
  piezaId: Id,
): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: { ...entidad, anclaje: { piezaId, biblioteca } },
    },
  });
}
