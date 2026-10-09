export type Id = string; // opaco; nunca SDx.y ni nombre (T-022)
export type TipoCosa = 'objeto' | 'proceso'; // cerrado (T-012)
export type Esencia = 'fisica' | 'informacional'; // default 'informacional'
export type Afiliacion = 'sistemica' | 'ambiental'; // default 'sistemica'
export type UnidadTiempo = 'ms' | 'sec' | 'min' | 'hour' | 'day' | 'week' | 'month' | 'year';
export type ModoDespliegue = 'agregacion' | 'exhibicion' | 'generalizacion' | 'clasificacion';
export type RelacionIncompleta = Exclude<ModoDespliegue, 'clasificacion'>; // nunca clasificación (T-034)
export type Control = 'e' | 'c'; // escalar: c+e irrepresentable (T-052)
export type Multiplicidad = '?' | '*' | '+' | '2..*' | `${number}`; // ausente = 1..1 (T-057); el número es un entero ≥ 2 (DEC35)
export type Operador = 'XOR' | 'OR'; // AND = ausencia de abanico (T-028)
export type Designacion = 'inicial' | 'final' | 'porDefecto' | 'current';
// ---------- Cosas y estados ----------
export interface Estado {
    readonly id: Id;
    readonly nombre: string; // léxico: una palabra que empieza en minúscula (se diagnostica, no se fuerza)
    readonly inicial?: true; // 0..* por objeto, combinable con final (D10)
    readonly final?: true;
    readonly suprimido?: true; // supresión global (T-018)
}
interface CosaBase {
    readonly id: Id;
    readonly nombre: string; // léxico EBNF; único sin distinguir mayúsculas (se diagnostica)
    readonly esencia: Esencia;
    readonly afiliacion: Afiliacion;
    readonly genero?: 'f'; // ausente = masculino (R-OPL-1, T-035)
    readonly descripcion?: string; // meta: no emite OPL (T-004)
    readonly incompleta?: readonly RelacionIncompleta[]; // colección incompleta DECLARADA (sin duplicados)
}
export interface Objeto extends CosaBase {
    readonly tipo: 'objeto';
    readonly estados: readonly Estado[]; // el orden del arreglo es el orden del modelo (T-015)
    readonly porDefecto?: Id; // ∈ estados: ≤1 por construcción (T-016)
    readonly current?: Id; // ∈ estados: ≤1 por construcción; declarado, jamás runtime (T-017)
    readonly valor?: string; // valor puntual de atributo (T-020)
}
export interface Duracion {
    readonly min?: number;
    readonly esperada?: number;
    readonly max?: number;
    readonly unidad?: UnidadTiempo; // ausente = unidad del modelo (R-EXC-5)
}
export interface Proceso extends CosaBase {
    readonly tipo: 'proceso'; // sin campo estados: estado de proceso irrepresentable (AP-12, T-059)
    readonly duracion?: Duracion; // T-021
}
export type Cosa = Objeto | Proceso;
// ---------- Enlaces: extremos nombrados por rol; la dirección canónica es la del tipo ----------
interface EnlaceBase {
    readonly id: Id;
}
interface Procedimental extends EnlaceBase {
    readonly objeto: Id;
    readonly proceso: Id;
    readonly mult?: Multiplicidad; // siempre en el extremo objeto (R-MULT-1A)
}
export interface Consumo extends Procedimental {
    readonly tipo: 'consumo';
    readonly estado?: Id;
    readonly control?: Control;
    readonly ruta?: string;
}
export interface Resultado extends Procedimental {
    readonly tipo: 'resultado';
    readonly estado?: Id;
    readonly ruta?: string;
}
export interface Efecto extends Procedimental {
    readonly tipo: 'efecto';
    readonly entrada?: Id;
    readonly salida?: Id;
    readonly control?: Control;
    readonly escision?: {
        readonly par: Id;
        readonly mitad: 'entrada' | 'salida';
    }; // R-ESCIND-0, T-032
}
export interface Agente extends Procedimental {
    readonly tipo: 'agente';
    readonly estado?: Id;
    readonly control?: Control;
}
export interface Instrumento extends Procedimental {
    readonly tipo: 'instrumento';
    readonly estado?: Id;
    readonly control?: Control;
}
interface EntreProcesos extends EnlaceBase {
    readonly origen: Id;
    readonly destino: Id;
}
export interface Invocacion extends EntreProcesos {
    readonly tipo: 'invocacion';
} // origen === destino ⇒ IV2
export interface Excepcion extends EntreProcesos {
    readonly tipo: 'excepcionSobretiempo' | 'excepcionSubtiempo'; // nunca control (R-EXC-1B)
}
interface Estructural extends EnlaceBase {
    readonly refinable: Id;
    readonly refinador: Id;
} // vértice → base del triángulo
export interface Agregacion extends Estructural {
    readonly tipo: 'agregacion';
    readonly mult?: Multiplicidad; // solo en la parte (DR-44)
}
export interface Exhibicion extends Estructural {
    readonly tipo: 'exhibicion';
} // exhibidor → rasgo
export interface Generalizacion extends Estructural {
    readonly tipo: 'generalizacion';
    readonly estados?: {
        readonly general: Id;
        readonly especializacion: Id;
    }; // ambos o ninguno (R-OPL-RF-3, DS-8)
}
export interface Clasificacion extends Estructural {
    readonly tipo: 'clasificacion';
} // clase → instancia
interface EtiquetadoBase extends EnlaceBase {
    readonly origen: Id;
    readonly destino: Id;
    readonly multOrigen?: Multiplicidad;
    readonly multDestino?: Multiplicidad;
}
export interface Etiquetado extends EtiquetadoBase {
    readonly tipo: 'etiquetado';
    readonly etiqueta?: string;
    readonly estadoOrigen?: Id;
    readonly estadoDestino?: Id;
}
export interface Bidireccional extends EtiquetadoBase {
    readonly tipo: 'etiquetadoBidireccional';
    readonly etiqueta: string;
    readonly inversa: string;
    readonly estadoOrigen?: Id; // solo en el origen (V-30, AP-11)
}
export interface Reciproco extends EtiquetadoBase {
    readonly tipo: 'reciproco';
    readonly etiqueta?: string;
    readonly estados?: {
        readonly origen: Id;
        readonly destino?: Id;
    }; // nunca solo destino (AP-11)
}
export type Enlace = Consumo | Resultado | Efecto | Agente | Instrumento | Invocacion | Excepcion | Agregacion | Exhibicion | Generalizacion | Clasificacion | Etiquetado | Bidireccional | Reciproco;
export type TipoEnlace = Enlace['tipo']; // 15 literales
export type EnlaceDe<T extends TipoEnlace> = Extract<Enlace, {
    readonly tipo: T;
}>;
export type EnlaceProcedimental = Consumo | Resultado | Efecto | Agente | Instrumento;
export type SinId<T> = T extends unknown ? Omit<T, 'id'> : never;
export type EnlaceNuevo = SinId<Enlace>; // candidato: lo construyen tiposLegales y el planificador OPL
export type Familia = 'transformadora' | 'habilitadora' | 'invocacion' | 'excepcion' | 'estructural' | 'etiquetada';
export function esProcedimental(e: Enlace | EnlaceNuevo): e is EnlaceProcedimental { return ['consumo', 'resultado', 'efecto', 'agente', 'instrumento'].includes(e.tipo); } // (EnlaceNuevo ⇒ SinId<…>)
/** Extremos en la dirección del formato v0: consumo/agente/instrumento objeto→proceso; resultado/efecto
 *  proceso→objeto; estructurales refinable→refinador; invocación, excepción y etiquetados origen→destino. */
export function extremos(e: Enlace | EnlaceNuevo): {
    readonly origen: Id;
    readonly destino: Id;
} {
    switch (e.tipo) {
        case 'consumo':
        case 'agente':
        case 'instrumento': return { origen: e.objeto, destino: e.proceso };
        case 'resultado':
        case 'efecto': return { origen: e.proceso, destino: e.objeto };
        case 'agregacion':
        case 'exhibicion':
        case 'generalizacion':
        case 'clasificacion': return { origen: e.refinable, destino: e.refinador };
        default: return { origen: e.origen, destino: e.destino };
    }
}
// ---------- Abanicos ----------
export interface Abanico {
    readonly id: Id;
    readonly operador: Operador;
    readonly enlaces: readonly Id[]; // n ≥ 2 distintos; mismo tipo y extremo común (contexto, §4.3)
}
// ---------- OPDs: el refinamiento vive en el OPD hijo (fuente única) ----------
export interface Aparicion {
    readonly x: number;
    readonly y: number; // enteros; esquina superior izquierda
    readonly ancho: number;
    readonly alto: number; // tamaño mínimo declarado; el render lo expande (AP-23)
    readonly ocultos?: readonly Id[]; // supresión local de estados propios (LF-03)
}
interface OpdBase {
    readonly id: Id;
    readonly apariciones: Readonly<Record<Id, Aparicion>>;
}
export interface OpdRaiz extends OpdBase {
    readonly tipo: 'raiz';
}
export interface OpdDescomposicion extends OpdBase {
    readonly tipo: 'descomposicion';
    readonly padre: Id;
    readonly cosa: Id; // cosa: un proceso (descomposición de objeto diferida, DR-23)
    readonly orden: number; // orden entre hermanos (etiqueta SDx.y, DR-4)
    readonly bandas: readonly (readonly Id[])[]; // subprocesos; banda = paralelo; fuente de verdad del tiempo (T-030)
    readonly objetosInternos: readonly Id[]; // alcance persistido (T-033)
}
export interface OpdDespliegue extends OpdBase {
    readonly tipo: 'despliegue';
    readonly padre: Id;
    readonly cosa: Id;
    readonly orden: number;
    readonly modo: ModoDespliegue;
}
export type Opd = OpdRaiz | OpdDescomposicion | OpdDespliegue;
export interface Modelo {
    readonly id: Id; // clave de almacenamiento (nombre de archivo)
    readonly nombre: string; // texto libre (no es nombre OPM)
    readonly descripcion?: string;
    readonly unidadTiempo: UnidadTiempo; // default 'min' (DS-24)
    readonly raiz: Id; // opds[raiz].tipo === 'raiz'
    readonly cosas: Readonly<Record<Id, Cosa>>;
    readonly enlaces: Readonly<Record<Id, Enlace>>;
    readonly abanicos: Readonly<Record<Id, Abanico>>;
    readonly opds: Readonly<Record<Id, Opd>>;
    readonly secuencia: number; // siguiente N para ids nuevos
}
export type Ref = {
    readonly tipo: 'cosa' | 'estado' | 'enlace' | 'abanico' | 'opd';
    readonly id: Id;
};
