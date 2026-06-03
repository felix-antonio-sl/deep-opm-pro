import type { Id, Modelo } from "../tipos";

export function entidadDeExtremoFrontera(
  extremo: { kind: string; id: Id },
  modelo: Modelo,
): Id | null {
  if (extremo.kind === "entidad") return extremo.id;
  return modelo.estados[extremo.id]?.entidadId ?? null;
}

export function fronteraDe(modelo: Modelo, padreId: Id): Id[] {
  const frontera = new Set<Id>();
  for (const enlace of Object.values(modelo.enlaces)) {
    const o = entidadDeExtremoFrontera(enlace.origenId, modelo);
    const d = entidadDeExtremoFrontera(enlace.destinoId, modelo);
    if (o === padreId && d) frontera.add(d);
    if (d === padreId && o) frontera.add(o);
  }
  return [...frontera];
}

export function firmaFronteraDeEnlaces(
  modelo: Modelo,
  frontera: ReadonlySet<Id>,
  enlaceIds: Iterable<Id>,
): Set<string> {
  const firma = new Set<string>();
  for (const enlaceId of enlaceIds) {
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace) continue;
    const origen = entidadDeExtremoFrontera(enlace.origenId, modelo);
    const destino = entidadDeExtremoFrontera(enlace.destinoId, modelo);
    if (origen && frontera.has(origen)) firma.add(`${origen}|${enlace.tipo}|origen`);
    if (destino && frontera.has(destino)) firma.add(`${destino}|${enlace.tipo}|destino`);
  }
  return firma;
}

export function firmaFronteraDeOpd(
  modelo: Modelo,
  frontera: ReadonlySet<Id>,
  opdId: Id,
): Set<string> {
  const opd = modelo.opds[opdId];
  if (!opd) return new Set();
  return firmaFronteraDeEnlaces(
    modelo,
    frontera,
    Object.values(opd.enlaces).map((apariencia) => apariencia.enlaceId),
  );
}
