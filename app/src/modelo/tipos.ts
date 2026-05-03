export type Id = string;

export type TipoEntidad = "objeto" | "proceso";
export type Esencia = "informacional" | "fisica";
export type Afiliacion = "sistemica" | "ambiental";

export type TipoEnlace =
  | "agregacion"
  | "agente"
  | "instrumento"
  | "consumo"
  | "resultado"
  | "efecto"
  | "invocacion";

export interface Entidad {
  id: Id;
  tipo: TipoEntidad;
  nombre: string;
  esencia: Esencia;
  afiliacion: Afiliacion;
}

export interface Apariencia {
  id: Id;
  entidadId: Id;
  opdId: Id;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Enlace {
  id: Id;
  tipo: TipoEnlace;
  origenId: Id;
  destinoId: Id;
  etiqueta: string;
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
