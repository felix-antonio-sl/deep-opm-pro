import type { Estado, Id } from "../../modelo/tipos";

export type EstadoTarget = { selector: string; estadoId: Id };

export function targetsEstado(estados: Estado[]): EstadoTarget[] {
  return estados.flatMap((estado, index) => [
    { selector: `stateCapsule${index}`, estadoId: estado.id },
    { selector: `stateLabel${index}`, estadoId: estado.id },
  ]);
}
