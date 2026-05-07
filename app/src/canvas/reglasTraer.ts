import { entidadIdDeExtremo } from "../modelo/extremos";
import type { Enlace, Id, Modelo, TipoEnlace } from "../modelo/tipos";

/**
 * Reglas de "traer conectados" por familia.
 *
 * SSOT: [Met §multi-OPD] una apariencia pertenece a una vista OPD; traer
 * conectados hidrata esa vista sin crear hechos logical nuevos. [Glos 3.6]
 * apariencia/contexto visual separado del hecho de modelo. [JOYAS §4] los
 * enlaces traidos reutilizan el patron visual wrapper+line ya proyectado.
 * Referencia tecnica verificada: opm-extracted/src/app/models/consistency/bringConnectedRules.ts.
 */

export const FAMILIAS_TRAER = [
  "procedural-habilitador",
  "procedural-transformador",
  "direccional",
  "estructural",
] as const;

export type FamiliaTraerConectados = typeof FAMILIAS_TRAER[number];

export const FAMILIAS_TRAER_DEFAULT: FamiliaTraerConectados[] = [...FAMILIAS_TRAER];

const TIPOS_POR_FAMILIA: Record<FamiliaTraerConectados, readonly TipoEnlace[]> = {
  "procedural-habilitador": ["agente", "instrumento"],
  "procedural-transformador": ["consumo", "efecto", "resultado"],
  // El kernel actual no define unidireccional/bidireccional tagged. La familia
  // queda como contrato UI no-op hasta que esos tipos existan en TipoEnlace.
  direccional: [],
  estructural: ["agregacion", "exhibicion", "generalizacion", "clasificacion"],
};

export interface ResultadoReglaTraer {
  entidades: Id[];
  enlaces: Id[];
}

export function tiposDeFamilia(familia: FamiliaTraerConectados): readonly TipoEnlace[] {
  return TIPOS_POR_FAMILIA[familia];
}

export function esFamiliaTraer(value: string): value is FamiliaTraerConectados {
  return (FAMILIAS_TRAER as readonly string[]).includes(value);
}

export function normalizarFamiliasTraer(familias?: readonly FamiliaTraerConectados[]): FamiliaTraerConectados[] {
  const limpias = [...new Set((familias && familias.length > 0 ? familias : FAMILIAS_TRAER_DEFAULT).filter(esFamiliaTraer))];
  return limpias.length > 0 ? limpias : [...FAMILIAS_TRAER_DEFAULT];
}

export function reglaTraerPorFamilias(
  modelo: Modelo,
  enlace: Enlace,
  familias: readonly FamiliaTraerConectados[],
): ResultadoReglaTraer {
  const tipos = new Set(familias.flatMap((familia) => [...tiposDeFamilia(familia)]));
  if (!tipos.has(enlace.tipo)) return { entidades: [], enlaces: [] };
  const origen = entidadIdDeExtremo(modelo, enlace.origenId);
  const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
  if (!origen || !destino) return { entidades: [], enlaces: [] };
  return { entidades: [origen, destino], enlaces: [enlace.id] };
}

export function familiaDeTipoEnlace(tipo: TipoEnlace): FamiliaTraerConectados | null {
  for (const familia of FAMILIAS_TRAER) {
    if (TIPOS_POR_FAMILIA[familia].includes(tipo)) return familia;
  }
  return null;
}
