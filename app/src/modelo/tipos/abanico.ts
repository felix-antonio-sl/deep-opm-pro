import type { Id } from "./comunes";

/**
 * Tipos del dominio Abanico (OR/XOR fan en OPM).
 * Cubre operador disyuntivo (al menos uno) y exclusivo (exactamente uno).
 *
 * Refs: SSOT opm-visual-es.md V-* (abanicos lógicos),
 *       opm-extracted/src/app/models/Logical/* (lógica de fan).
 */

export type OperadorAbanico = "O" | "XOR";

export interface Abanico {
  id: Id;
  opdId: Id;
  puertoEntidadId: Id;
  operador: OperadorAbanico;
  enlaceIds: Id[];
}
