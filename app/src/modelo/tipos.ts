export type Id = string;
export type PestanaId = string;

export type TipoEntidad = "objeto" | "proceso";
export type Esencia = "informacional" | "fisica";
export type Afiliacion = "sistemica" | "ambiental";
export type TipoRefinamiento = "descomposicion" | "despliegue";
export type ModoPlegado = "completo" | "parcial" | "plegado" | "desplegado";
export type OrdenPartesPlegado = "alfabetico" | "creacion";
export type ModoDespliegueObjeto = "agregacion" | "exhibicion" | "generalizacion" | "clasificacion";
export type DesignacionEstado = "inicial" | "final" | "default" | "current";
export type DerivacionOrigen = "automatico" | "manual";
export type ExtremoKind = "entidad" | "estado";
export type LayoutEstados = "horizontal" | "vertical";
export type TipoUrlObjeto = "imagen" | "video" | "articulo" | "texto" | "oslc";
export type UnidadTiempo = "ms" | "s" | "min" | "h" | "dia" | "sem" | "mes" | "año";

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
  alias?: string;
  unidad?: string;
  descripcion?: string;
  urls?: UrlObjetoTipada[];
  layoutEstados?: LayoutEstados;
}

export interface UrlObjetoTipada {
  id: Id;
  url: string;
  tipo: TipoUrlObjeto;
}

export interface DuracionTemporal {
  unidad: UnidadTiempo;
  min: number;
  nominal: number;
  max: number;
}

export interface Estado {
  id: Id;
  entidadId: Id;
  nombre: string;
  esInicial?: boolean;
  esFinal?: boolean;
  designaciones?: DesignacionEstado[];
  duracion?: DuracionTemporal;
  suprimido?: boolean;
}

export interface EstiloApariencia {
  fill?: string;
  borderColor?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textColor?: string;
  textAnchor?: "start" | "middle" | "end";
}

export interface EnlaceEstilo {
  color?: string;
  strokeWidth?: number;
  dashArray?: string;
}

// Estado UI transitorio para Ctrl+C/V visual. No pertenece al JSON OPM.
export interface UiPortapapelesVisual {
  apariencias: Array<{
    entidadId: Id;
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
    estilo?: EstiloApariencia;
  }>;
  enlaces: Array<{ enlaceId: Id }>;
  origenOpdId: Id;
  pegados?: number;
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

export interface VersionResumen {
  id: Id;
  creadoEn: string;
  nombre: string;
  descripcion?: string;
  modeloPayloadKey: string;
  bytes: number;
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
  estilo?: EnlaceEstilo;
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
  /** Orden opcional entre hermanos para reordenamiento manual.
   *  Monotono entre hermanos de un mismo padre.
   *  Si no esta presente, se usa orden alfabetico por id. */
  ordenLocal?: number;
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
  archivado?: boolean;
  archivadoEn?: string;
  versiones?: VersionResumen[];
  crearVersionAlGuardar?: boolean;
  nextSeq: number;
}

export type OrigenPestana = "nuevo" | "asistente" | "importado" | "persistido";
export type HistorialEntrada = Modelo;

export interface Pestana {
  id: PestanaId;
  etiqueta: string;
  modeloId: Id | null;
  modelo: Modelo;
  cargadoDesde: OrigenPestana;
  dirty: boolean;
  historialUndo: HistorialEntrada[];
  cursorUndo: number;
  vistaMapaActivaPestana: boolean;
  seleccionadosPestana?: Id[];
  snapshotJson?: string;
  descripcionModeloLocal?: string;
}

export interface BloqueOplEstado {
  opdId: Id;
  colapsado: boolean;
}

// Preferencias de UI del workspace. No pertenecen al JSON OPM canonico.
export interface PreferenciasUiUsuario {
  anchoPanelArbol?: number;
  nombresArbolVisibles?: boolean;
  cheatsheetVisible?: boolean;
}

export interface Posicion {
  x: number;
  y: number;
}

export type Resultado<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };
