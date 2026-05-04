export type Id = string;

export type TipoEntidad = "objeto" | "proceso";
export type Esencia = "informacional" | "fisica";
export type Afiliacion = "sistemica" | "ambiental";
export type TipoRefinamiento = "descomposicion" | "despliegue";
export type ModoPlegado = "completo" | "parcial";
export type ModoDespliegueObjeto = "agregacion" | "exhibicion" | "generalizacion" | "clasificacion";

export type TipoEnlace =
  | "agregacion"
  | "exhibicion"
  | "generalizacion"
  | "clasificacion"
  | "agente"
  | "instrumento"
  | "consumo"
  | "resultado"
  | "efecto"
  | "invocacion";

export interface RefinamientoEntidad {
  tipo: TipoRefinamiento;
  opdId: Id;
  modo?: ModoDespliegueObjeto;
}

export interface DerivacionEnlace {
  tipo: "enlace-externo-refinamiento";
  refinamientoId: Id;
  enlacePadreId: Id;
}

export interface Entidad {
  id: Id;
  tipo: TipoEntidad;
  nombre: string;
  esencia: Esencia;
  afiliacion: Afiliacion;
  refinamiento?: RefinamientoEntidad;
}

export interface Apariencia {
  id: Id;
  entidadId: Id;
  opdId: Id;
  x: number;
  y: number;
  width: number;
  height: number;
  modoPlegado?: ModoPlegado;
}

export interface Enlace {
  id: Id;
  tipo: TipoEnlace;
  origenId: Id;
  destinoId: Id;
  etiqueta: string;
  multiplicidadOrigen?: string;
  multiplicidadDestino?: string;
  derivado?: DerivacionEnlace;
}

export interface AparienciaEnlace {
  id: Id;
  enlaceId: Id;
  opdId: Id;
  vertices: Array<{ x: number; y: number }>;
}

export interface Opd {
  id: Id;
  nombre: string;
  padreId: Id | null;
  apariencias: Record<Id, Apariencia>;
  enlaces: Record<Id, AparienciaEnlace>;
}

export interface Modelo {
  id: Id;
  nombre: string;
  opdRaizId: Id;
  opds: Record<Id, Opd>;
  entidades: Record<Id, Entidad>;
  enlaces: Record<Id, Enlace>;
  nextSeq: number;
}

export interface Posicion {
  x: number;
  y: number;
}

export type Resultado<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };
