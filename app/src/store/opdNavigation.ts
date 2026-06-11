import type { Id, Modelo } from "../modelo/tipos";

export interface OutzoomAutor {
  opdPadreId: Id;
  refinadorId: Id | null;
}

export function resolverOutzoomAutor(modelo: Modelo, opdActivoId: Id): OutzoomAutor | null {
  const opd = modelo.opds[opdActivoId];
  if (!opd?.padreId || !modelo.opds[opd.padreId]) return null;
  const refinador = Object.values(modelo.entidades).find((entidad) =>
    entidad.refinamientos?.descomposicion?.opdId === opdActivoId ||
    entidad.refinamientos?.despliegue?.opdId === opdActivoId
  );
  return { opdPadreId: opd.padreId, refinadorId: refinador?.id ?? null };
}
