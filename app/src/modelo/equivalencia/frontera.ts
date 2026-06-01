import type { Id, Modelo } from "../tipos";

function entidadDeExtremo(
  extremo: { kind: string; id: Id },
  modelo: Modelo,
): Id | null {
  if (extremo.kind === "entidad") return extremo.id;
  return modelo.estados[extremo.id]?.entidadId ?? null;
}

export function fronteraDe(modelo: Modelo, padreId: Id): Id[] {
  const frontera = new Set<Id>();
  for (const enlace of Object.values(modelo.enlaces)) {
    const o = entidadDeExtremo(enlace.origenId, modelo);
    const d = entidadDeExtremo(enlace.destinoId, modelo);
    if (o === padreId && d) frontera.add(d);
    if (d === padreId && o) frontera.add(o);
  }
  return [...frontera];
}
