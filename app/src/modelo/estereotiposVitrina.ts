// D6.4 — agrupación pura del catálogo de estereotipos para la Vitrina.
// Puro: sin DOM, sin store. Clasifica cada estereotipo en una de cuatro familias
// por la forma de su plantilla (paridad con la galería OpCloud por tipo):
//   - marcadores: sin plantilla (marcador puro, p. ej. requirement).
//   - objetos:    plantilla con exactamente 1 entidad.
//   - enlaces:    plantilla con 2 entidades y ≥1 enlace.
//   - patrones:   resto con plantilla (2 entidades sin enlace, o 3+ entidades).
import type { Estereotipo } from "./tipos";

export interface GruposEstereotipos {
  marcadores: Estereotipo[];
  objetos: Estereotipo[];
  enlaces: Estereotipo[];
  patrones: Estereotipo[];
}

export function agruparEstereotipos(estereotipos: readonly Estereotipo[]): GruposEstereotipos {
  const grupos: GruposEstereotipos = { marcadores: [], objetos: [], enlaces: [], patrones: [] };
  for (const estereotipo of estereotipos) {
    const plantilla = estereotipo.plantilla;
    if (!plantilla) {
      grupos.marcadores.push(estereotipo);
      continue;
    }
    const entidades = Object.keys(plantilla.entidades).length;
    const enlaces = Object.keys(plantilla.enlaces).length;
    if (entidades === 1) grupos.objetos.push(estereotipo);
    else if (entidades === 2 && enlaces >= 1) grupos.enlaces.push(estereotipo);
    else grupos.patrones.push(estereotipo);
  }
  return grupos;
}
