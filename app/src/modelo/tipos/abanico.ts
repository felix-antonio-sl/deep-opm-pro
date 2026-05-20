import type { Id } from "./comunes";

/**
 * Tipos del dominio Abanico (OR/XOR fan en OPM).
 * Cubre operador disyuntivo (al menos uno) y exclusivo (exactamente uno).
 *
 * Refs: SSOT opm-visual-es.md V-* (abanicos lógicos),
 *       opm-extracted/src/app/models/LogicalPart/* (lógica de fan).
 */

export type OperadorAbanico = "O" | "XOR";

export interface PuertoAbanicoExacto {
  entidadId: Id;
  lado: "origen" | "destino";
  portId: Id;
}

export interface Abanico {
  id: Id;
  opdId: Id;
  puertoComun: PuertoAbanicoExacto;
  /**
   * Alias legacy derivado de puertoComun.entidadId.
   * Se conserva para compatibilidad de JSON v0 y consumidores historicos.
   */
  puertoEntidadId: Id;
  operador: OperadorAbanico;
  enlaceIds: Id[];
}
