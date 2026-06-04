import type { Estado, Id } from "../../modelo/tipos";
import { ANCLAS_RELOJ_ENLACE } from "../../modelo/anclajesEnlace";

export type EstadoTarget = { selector: string; estadoId: Id };

export function targetsEstado(estados: Estado[]): EstadoTarget[] {
  return estados.flatMap((estado, index) => [
    { selector: `stateCapsule${index}`, estadoId: estado.id },
    { selector: `stateLabel${index}`, estadoId: estado.id },
    ...ANCLAS_RELOJ_ENLACE.map((anchor) => ({
      selector: selectorAnchorEstado(index, anchor),
      estadoId: estado.id,
    })),
  ]);
}

export function selectorAnchorEstado(index: number, anchor: string): string {
  return `connect-anchor-${anchor.toLowerCase()}-state${index}`;
}
