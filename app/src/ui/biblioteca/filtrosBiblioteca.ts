/**
 * Filtros puros para la Biblioteca dock (L3 ronda 20).
 *
 * Combina tres lentes ortogonales sobre el catálogo de entidades:
 * - tipo: "todos" | "objeto" | "proceso" (radio).
 * - soloOpdActivo: si true, descarta entidades sin apariencia en `opdActivoId`.
 * - query: case-insensitive, locale es-CL, match por `nombre`.
 *
 * Pure function: sin side-effects, sin store, fácil de testear. La biblioteca
 * dock (panel persistente) consume `filtrarEntidades` con `useMemo` ante cambios
 * en `modelo`, `opdActivoId` o `filtros`.
 *
 * SSOT: opm-iso-19450-es.md §3.55 (Object), §3.69 (Process).
 * Refs: docs/instrucciones-lineas-dev/ronda20/linea-3-biblioteca-dockable.md §6.
 */
import type { Entidad, Id, Modelo, TipoEntidad } from "../../modelo/tipos";

export interface FiltrosBiblioteca {
  query: string;
  tipo: "todos" | TipoEntidad;
  soloOpdActivo: boolean;
}

export interface ItemBiblioteca {
  entidad: Entidad;
  apareceEnOpdActivo: boolean;
  totalApariciones: number;
}

export const FILTROS_DEFAULT: FiltrosBiblioteca = {
  query: "",
  tipo: "todos",
  soloOpdActivo: false,
};

/**
 * Construye la lista filtrada y ordenada de entidades a mostrar en la
 * biblioteca dock. Cuenta apariciones globales y marca apariencia en el
 * OPD activo.
 */
export function filtrarEntidades(
  modelo: Modelo,
  opdActivoId: Id,
  filtros: FiltrosBiblioteca,
): ItemBiblioteca[] {
  const aparicionesPorEntidad = construirIndiceApariciones(modelo);
  const queryNorm = filtros.query.trim().toLocaleLowerCase("es-CL");

  const items: ItemBiblioteca[] = [];
  for (const entidad of Object.values(modelo.entidades)) {
    if (filtros.tipo !== "todos" && entidad.tipo !== filtros.tipo) continue;

    const conteo = aparicionesPorEntidad.get(entidad.id);
    const totalApariciones = conteo?.total ?? 0;
    const apareceEnOpdActivo = conteo?.opds.has(opdActivoId) ?? false;

    if (filtros.soloOpdActivo && !apareceEnOpdActivo) continue;

    if (queryNorm.length > 0) {
      const nombreNorm = entidad.nombre.toLocaleLowerCase("es-CL");
      if (!nombreNorm.includes(queryNorm)) continue;
    }

    items.push({ entidad, apareceEnOpdActivo, totalApariciones });
  }

  items.sort((a, b) => a.entidad.nombre.localeCompare(b.entidad.nombre, "es-CL"));
  return items;
}

interface ConteoApariciones {
  total: number;
  opds: Set<Id>;
}

function construirIndiceApariciones(modelo: Modelo): Map<Id, ConteoApariciones> {
  const indice = new Map<Id, ConteoApariciones>();
  for (const opd of Object.values(modelo.opds)) {
    for (const apariencia of Object.values(opd.apariencias)) {
      let conteo = indice.get(apariencia.entidadId);
      if (!conteo) {
        conteo = { total: 0, opds: new Set() };
        indice.set(apariencia.entidadId, conteo);
      }
      conteo.total += 1;
      conteo.opds.add(opd.id);
    }
  }
  return indice;
}
