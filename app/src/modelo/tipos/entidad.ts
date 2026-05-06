import type { LayoutEstados } from "./apariencia";
import type { Id } from "./comunes";

/**
 * Tipos del dominio Entidad (Object/Process en SSOT OPM) y su metadata.
 * Cubre tipo, esencia, afiliación, refinamiento, alias/unidad/descripción/URLs
 * (HU-17.* metadata extendida ronda 7).
 *
 * Refs: SSOT opm-iso-19450-es.md §3.55 (Object), §3.69 (Process), §3.71 (State),
 *       opm-extracted/src/app/models/DrawnPart/OpmObject.ts:5-15.
 */

export type TipoEntidad = "objeto" | "proceso";
export type Esencia = "informacional" | "fisica";
export type Afiliacion = "sistemica" | "ambiental";
export type TipoRefinamiento = "descomposicion" | "despliegue";
export type ModoDespliegueObjeto = "agregacion" | "exhibicion" | "generalizacion" | "clasificacion";
export type TipoUrlObjeto = "imagen" | "video" | "articulo" | "texto" | "oslc";

export interface RefinamientoEntidad {
  tipo: TipoRefinamiento;
  opdId: Id;
  modo?: ModoDespliegueObjeto;
}

export interface UrlObjetoTipada {
  id: Id;
  url: string;
  tipo: TipoUrlObjeto;
}

export interface Entidad {
  id: Id;
  tipo: TipoEntidad;
  nombre: string;
  esencia: Esencia;
  afiliacion: Afiliacion;
  refinamiento?: RefinamientoEntidad;
  alias?: string;
  unidad?: string;
  descripcion?: string;
  urls?: UrlObjetoTipada[];
  layoutEstados?: LayoutEstados;
}
