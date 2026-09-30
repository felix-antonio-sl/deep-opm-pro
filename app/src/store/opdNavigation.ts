import type { Id, Modelo } from "../modelo/tipos";
import { refinaA } from "../modelo/refinamientos";

export interface OutzoomAutor {
  opdPadreId: Id;
  refinadorId: Id | null;
}

export function resolverOutzoomAutor(modelo: Modelo, opdActivoId: Id): OutzoomAutor | null {
  const opd = modelo.opds[opdActivoId];
  if (!opd?.padreId || !modelo.opds[opd.padreId]) return null;
  const refinador = Object.values(modelo.entidades).find((entidad) => refinaA(entidad, opdActivoId) !== null);
  return { opdPadreId: opd.padreId, refinadorId: refinador?.id ?? null };
}
