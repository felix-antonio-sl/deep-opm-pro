import { aparicionesVisiblesEnOpd } from "../../modelo/politicaApariciones";
import type { Id, Modelo, TipoEnlace, TipoEntidad } from "../../modelo/tipos";
import { TIPOS_ENLACE_MENU } from "../MenuTipoEnlace";

/**
 * Lógica pura del mini-form "Promover boceto → ENLACE" de la BarraPizarra (D7.2).
 *
 * Se extrae del componente para poder verificarla sin DOM (los tests tsx del
 * repo son contractuales; la lógica vive en módulos puros). La UI solo invoca
 * estos helpers + el store; NO re-implementa kernel (dependencias unidireccionales).
 */

export interface EntidadPromocionable {
  id: Id;
  nombre: string;
  tipo: TipoEntidad;
}

/**
 * Cosas elegibles como extremo del enlace: las que tienen APARICIÓN en el OPD
 * activo (no todo el modelo) — el enlace cae en ese OPD, así que origen/destino
 * deben estar realmente presentes ahí. Deriva de `opd.apariencias` (SSOT de
 * visibilidad). Sin OPD: lista vacía (sin throw).
 */
export function entidadesPromocionablesEnOpd(modelo: Modelo, opdId: Id): EntidadPromocionable[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const vistas = new Map<Id, EntidadPromocionable>();
  for (const apariencia of aparicionesVisiblesEnOpd(opd)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (entidad && !vistas.has(entidad.id)) {
      vistas.set(entidad.id, { id: entidad.id, nombre: entidad.nombre, tipo: entidad.tipo });
    }
  }
  return [...vistas.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

/** Catálogo de tipos de enlace ofrecidos en el selector (canónicos, con etiqueta). */
export const TIPOS_ENLACE_PROMOCION: ReadonlyArray<{ tipo: TipoEnlace; label: string }> = TIPOS_ENLACE_MENU;

export interface BorradorEnlacePromocion {
  origenId: Id | null;
  destinoId: Id | null;
  tipo: TipoEnlace | null;
}

/**
 * Guard del botón "Promover a enlace": exige origen, destino y tipo, y —por
 * defecto— extremos DISTINTOS (sin auto-enlace). El rechazo de firma ilegal lo
 * hace el kernel (crearEnlace, vía promoverBocetoActual): este guard solo evita
 * disparar con un borrador incompleto u homónimo.
 */
export function puedePromoverEnlace(borrador: BorradorEnlacePromocion): boolean {
  const { origenId, destinoId, tipo } = borrador;
  if (!origenId || !destinoId || !tipo) return false;
  if (origenId === destinoId) return false;
  return true;
}
