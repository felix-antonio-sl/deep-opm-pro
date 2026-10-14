export type Id = string; // opaco; nunca SDx.y ni nombre (T-022)
export type TipoCosa = 'objeto' | 'proceso'; // cerrado (T-012)
export type Esencia = 'fisica' | 'informacional'; // default 'informacional'
export type Afiliacion = 'sistemica' | 'ambiental'; // default 'sistemica'
export type UnidadTiempo = 'ms' | 'sec' | 'min' | 'hour' | 'day' | 'week' | 'month' | 'year';
export type ModoDespliegue = 'agregacion' | 'exhibicion' | 'generalizacion' | 'clasificacion';
export type RelacionIncompleta = Exclude<ModoDespliegue, 'clasificacion'>; // nunca clasificación (T-034)
export type Control = 'e' | 'c'; // escalar: c+e irrepresentable (T-052)
export type Multiplicidad = string; // matriz valida cantidades, rangos, aritmética y restricciones declarativas; ausente = 1..1
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
    readonly nombrePlural?: string; // forma explícita del autor; no identifica otra cosa (DEC56)
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
    readonly estado?: Id; // RF5: valor del atributo (estado del refinador); sólo entre objetos (R-STRE-2)
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
/** Etiqueta reservada de SE2 (T-119): la emite un etiquetado sin etiqueta y la lee el parser como ausencia de etiqueta. */
export const ETIQUETA_POR_DEFECTO = 'se relaciona con';
/** B-38: ausencia y literal reservado de UNI son el mismo hecho; sólo para comparar, nunca para guardar. */
export function comoHecho<E extends Enlace | EnlaceNuevo>(e: E): E {
    return e.tipo === 'etiquetado' && e.etiqueta === ETIQUETA_POR_DEFECTO ? { ...e, etiqueta: undefined } : e;
}
export interface Bidireccional extends EtiquetadoBase {
    readonly tipo: 'etiquetadoBidireccional';
    readonly etiqueta: string;
    readonly inversa: string;
    readonly estadoOrigen?: Id;
    readonly estadoDestino?: Id; // ISO §10.4.2.5–§10.4.2.6: en un extremo o en ambos
}
export interface Reciproco extends EtiquetadoBase {
    readonly tipo: 'reciproco';
    readonly etiqueta?: string;
    readonly estados?: {
        readonly origen: Id;
        readonly destino?: Id;
    }; // con un solo estado, éste va en el origen (reciprocoConEstados, R-EST-SSE-1)
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
/** RF5 (ISO §10.4.1, R-OPD-STR-14): la base de esta exhibición es un valor del atributo, no un rasgo;
 *  por eso no integra la colección de rasgos ni el despliegue por exhibición de su exhibidor. */
export function esCaracterizacionConEstado(e: Enlace | EnlaceNuevo): boolean { return e.tipo === 'exhibicion' && e.estado !== undefined; }
/** Refinador que `e` aporta al despliegue de `cosa` por `modo`, si lo aporta. */
export function refinadorPorModo(e: Enlace, modo: ModoDespliegue, cosa: Id): Id | undefined {
    return 'refinable' in e && e.tipo === modo && e.refinable === cosa && !esCaracterizacionConEstado(e) ? e.refinador : undefined;
}
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
    readonly internos: readonly Id[]; // objetos internos; alcance persistido (T-033)
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
/** R-EST-SSE-1, ISO §10.4.2.7: el recíproco es simétrico; con estado en un solo extremo, ese extremo es su
 * origen (SSE7). Invertir los extremos conserva el hecho, su id y sus multiplicidades por extremo. */
export function reciprocoConEstados<T extends Omit<Reciproco, 'id'>>(e: T, origen: Id | undefined, destino: Id | undefined): T {
    const { estados, ...resto } = e; void estados;
    if (origen !== undefined) return { ...resto, estados: { origen, ...(destino !== undefined ? { destino } : {}) } } as unknown as T;
    if (destino === undefined) return resto as unknown as T;
    const { multOrigen, multDestino, ...base } = resto;
    return { ...base, origen: e.destino, destino: e.origen, estados: { origen: destino },
        ...(multDestino !== undefined ? { multOrigen: multDestino } : {}), ...(multOrigen !== undefined ? { multDestino: multOrigen } : {}) } as unknown as T;
}
