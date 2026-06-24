import type { LayoutEstados } from "./apariencia";
import type { Id } from "./comunes";
import type { TipoEnlace } from "./enlace";
import type { RequisitoEntidadMetadata, Anclaje } from "./extensiones";

/**
 * Tipos del dominio Entidad (Object/Process en SSOT OPM) y su metadata.
 * Cubre tipo, esencia, afiliación, refinamiento, alias/unidad/descripción/URLs
 * (HU-17.* metadata extendida ronda 7) y atributo con slot de valor aditivo.
 *
 * Refs: SSOT opm-iso-19450-es.md §3.55 (Object), §3.69 (Process), §3.71 (State),
 *       [Glos 3.4] atributo, [V-163] slot de valor visible,
 *       opm-extracted/src/app/models/DrawnPart/OpmObject.ts:5-15.
 */

export type TipoEntidad = "objeto" | "proceso";
export type Esencia = "informacional" | "fisica";
export type Afiliacion = "sistemica" | "ambiental";
export type TipoRefinamiento = "descomposicion" | "despliegue";
export type ModoDespliegueObjeto = "agregacion" | "exhibicion" | "generalizacion" | "clasificacion";
export type TipoUrlObjeto = "imagen" | "video" | "articulo" | "texto" | "oslc";
export type ModoImagenEntidad = "imagen" | "texto" | "imagen-texto";
export type TipoValorSlot = "integer" | "float" | "char" | "string";
export type ValorConcreto = number | string;
export type DistribucionSimulacion = "uniform" | "normal" | "bernoulli" | "geometric" | "poisson" | "exponential" | "binomial";

/**
 * Slot indexado por TipoRefinamiento dentro del producto parcial
 * `Entidad.refinamientos`. La clave del record fija `tipo`, por lo que el
 * slot solo guarda el destino (opdId) y el modo (solo aplicable a despliegue).
 */
export interface SlotRefinamiento {
  opdId: Id;
  modo?: ModoDespliegueObjeto;
}

/**
 * Forma legacy pre-ronda 15.2: una sola entrada `tipo` + `opdId` (+ `modo`).
 * Se conserva como tipo nominal para validación/migración de modelos
 * exportados antes del cambio. Tras hidratar, el modelo runtime expone
 * únicamente `Entidad.refinamientos`.
 */
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

export interface ImagenEntidad {
  url: string;
  modo: ModoImagenEntidad;
  cache?: {
    ts: number;
    estado: "ok" | "fallido";
  };
}

export interface ValorSlot {
  tipo: TipoValorSlot;
  placeholder: "value";
  valor?: ValorConcreto;
}

export interface FilaTextualSimulacion {
  texto: string;
  porcentaje: number;
}

export interface ConfiguracionSimulacionNumerica {
  modo: "numerica";
  distribucion: DistribucionSimulacion;
  entero?: boolean;
  rangoMin?: number;
  rangoMax?: number;
  uniformMin?: number;
  uniformMax?: number;
  normalMu?: number;
  normalSigma?: number;
  probabilidad?: number;
  binomialN?: number;
  binomialP?: number;
  lambda?: number;
}

export interface ConfiguracionSimulacionTextual {
  modo: "textual";
  valores: FilaTextualSimulacion[];
}

export type ConfiguracionSimulacionEntidad = ConfiguracionSimulacionNumerica | ConfiguracionSimulacionTextual;

/**
 * Parametros persistentes de simulacion para atributos con slot de valor.
 * Deriva del `SimulationModule` de OPCloud: flag `simulated`, modo numerico
 * o textual, distribucion probabilistica y arreglo textual ponderado.
 */
export interface ParametrosSimulacionEntidad {
  simulable: boolean;
  configuracion?: ConfiguracionSimulacionEntidad;
}

export interface Entidad {
  id: Id;
  tipo: TipoEntidad;
  nombre: string;
  esencia: Esencia;
  afiliacion: Afiliacion;
  /**
   * Producto parcial indexado por TipoRefinamiento. Una entidad puede tener
   * descomposicion (in-zoom) y despliegue (unfold) simultáneos: son
   * ortogonales (Comportamiento vs Estructura, SSOT §refinamiento).
   * Pre-ronda 15.2 existía un único `refinamiento?: RefinamientoEntidad`;
   * los modelos legacy se migran al hidratar.
   */
  refinamientos?: Partial<Record<TipoRefinamiento, SlotRefinamiento>>;
  alias?: string;
  unidad?: string;
  esAtributo?: boolean;
  valorSlot?: ValorSlot;
  simulacion?: ParametrosSimulacionEntidad;
  descripcion?: string;
  /**
   * D6: id del estereotipo aplicado. Resuelve a un estereotipo de fábrica
   * (ESTEREOTIPO_REQUIREMENT_ID) o a una entrada de `Modelo.estereotipos`.
   * Reemplaza el legacy `estereotipo?: "requirement"` (adaptado al hidratar).
   */
  estereotipoId?: Id;
  /**
   * Modo Anclaje (referencia viva): referencia VIVA a un tipo de biblioteca externa,
   * sin copiar (≠ `estereotipoId`, que es marker local del graft/Template D6). Campo
   * aditivo — no introduce un 4º tipo seleccionable, no dispara la deuda O(N²) del trío.
   */
  anclaje?: Anclaje;
  requisito?: RequisitoEntidadMetadata;
  urls?: UrlObjetoTipada[];
  imagen?: ImagenEntidad;
  layoutEstados?: LayoutEstados;
  /** Recurso lineal: se consume, no se copia (default false = copiable). Capa categorial F1. */
  lineal?: boolean;
  /**
   * Tipos estructurales fundamentales marcados como ordenados para esta cosa
   * refinable. Emula `orderedFundamentalTypes` de OPCloud: el orden pertenece
   * al refinable lógico y al tipo de relación, no a una rama aislada.
   */
  orderedFundamentalTypes?: TipoEnlace[];
}
