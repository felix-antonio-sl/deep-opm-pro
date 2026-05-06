import type { Id } from "./comunes";

/**
 * Tipos del dominio OPL (Object-Process Language como lente derivada).
 * Cubre estado de bloque OPL (colapsado/expandido) por OPD.
 *
 * Refs: SSOT opm-opl-es.md, docs/HANDOFF.md §Decisiones Vigentes
 *       (OPL-ES como lente derivada, bloques jerárquicos).
 */

export interface BloqueOplEstado {
  opdId: Id;
  colapsado: boolean;
}
