import type { Id } from "./comunes";

/**
 * Tipos del dominio OPL (Object-Process Language como lente derivada).
 * Cubre estado de bloque OPL (colapsado/expandido) por OPD.
 *
 * Refs: SSOT opm-opl-es.md, [OPL-ES §14] atributos y valores,
 *       docs/HANDOFF.md §Decisiones Vigentes
 *       (OPL-ES como lente derivada, bloques jerárquicos).
 */

export interface TokenValor {
  tipo: "valor";
  texto: string;
}

export interface TokenUnidad {
  tipo: "unidad";
  texto: string;
}

export interface BloqueOplEstado {
  opdId: Id;
  colapsado: boolean;
}
