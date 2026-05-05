export type Id = string;

export type TipoEntidad = "objeto" | "proceso";
export type Esencia = "informacional" | "fisica";
export type Afiliacion = "sistemica" | "ambiental";
export type TipoRefinamiento = "descomposicion" | "despliegue";
export type ModoPlegado = "completo" | "parcial";
export type OrdenPartesPlegado = "alfabetico" | "creacion";
export type ModoDespliegueObjeto = "agregacion" | "exhibicion" | "generalizacion" | "clasificacion";
export type DesignacionEstado = "inicial" | "final";
export type DerivacionOrigen = "automatico" | "manual";
export type ExtremoKind = "entidad" | "estado";

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
  origen?: DerivacionOrigen;
}

export interface Entidad {
  id: Id;
  tipo: TipoEntidad;
  nombre: string;
  esencia: Esencia;
  afiliacion: Afiliacion;
  refinamiento?: RefinamientoEntidad;
}

export interface Estado {
  id: Id;
  entidadId: Id;
  nombre: string;
  esInicial?: boolean;
  esFinal?: boolean;
}

export interface EstiloApariencia {
  fill?: string;
  borderColor?: string;
}

export interface ExtremoEnlace {
  kind: ExtremoKind;
  id: Id;
}

export type OperadorAbanico = "O" | "XOR";

export type Modificador = "condicion" | "evento" | "no";

export interface Abanico {
  id: Id;
  opdId: Id;
  puertoEntidadId: Id;
  operador: OperadorAbanico;
  enlaceIds: Id[];
}

export interface Apariencia {
  id: Id;
  entidadId: Id;
  opdId: Id;
  x: number;
  y: number;
  width: number;
  height: number;
  estilo?: EstiloApariencia;
  modoPlegado?: ModoPlegado;
  ordenPartes?: OrdenPartesPlegado;
  parteExtraidaDe?: { padreAparienciaId: Id; parteEntidadId: Id };
}

export interface Enlace {
  id: Id;
  tipo: TipoEnlace;
  origenId: ExtremoEnlace;
  destinoId: ExtremoEnlace;
  etiqueta: string;
  multiplicidadOrigen?: string;
  multiplicidadDestino?: string;
  modificador?: Modificador;
  probabilidad?: number;
  demora?: string;
  rutaEtiqueta?: string;
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
  estados: Record<Id, Estado>;
  enlaces: Record<Id, Enlace>;
  abanicos?: Record<Id, Abanico>;
  nextSeq: number;
}

export interface Posicion {
  x: number;
  y: number;
}

export type Resultado<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };
