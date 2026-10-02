import type { Id, Modelo, Ref, TipoCosa } from '../nucleo/tipos';
import type { Accion, ExtremoRef } from '../nucleo/operaciones';
import type { Traza, Respuesta, Hecho } from '../nucleo/resultado';
import type { OpcionTipo } from '../nucleo/matriz';
import type { OpcionesOpl } from '../opl/linea';
import type { Plan } from '../opl/planificar';
import type { Informe } from '../codec/informe';
import type { Punto, Rect } from '../opd/escena';
export type Gesto = {
    readonly k: 'reposo';
} | {
    readonly k: 'creando';
    readonly tipo: TipoCosa;
    readonly en: Punto;
    readonly nombre: string;
} | {
    readonly k: 'arrastrando';
    readonly cosas: readonly Id[];
    readonly desde: Punto;
    readonly delta: Punto;
} | {
    readonly k: 'redimensionando';
    readonly cosa: Id;
    readonly caja: Rect;
} | {
    readonly k: 'conectando';
    readonly desde: ExtremoRef;
    readonly punto: Punto;
    readonly sobre?: ExtremoRef;
} | {
    readonly k: 'menuTipo';
    readonly desde: ExtremoRef;
    readonly hacia: ExtremoRef;
    readonly opciones: readonly OpcionTipo[];
} | {
    readonly k: 'reanclando';
    readonly enlace: Id;
    readonly extremo: 'origen' | 'destino';
    readonly punto: Punto;
} | {
    readonly k: 'banda';
    readonly proceso: Id;
    readonly destino: {
        banda: number;
    } | {
        nuevaBandaAntesDe: number;
    } | null;
} | {
    readonly k: 'encadenando';
    readonly opd: Id;
    readonly bandas: readonly (readonly string[])[];
    readonly actual: string;
    readonly modo: 'subprocesos' | 'refinadores';
} // estados: uno por gesto (DECISIONS 18, CC-20)
 | {
    readonly k: 'desplazando';
    readonly desde: Punto;
};
export type EventoLienzo = {
    readonly k: 'abajo' | 'mover' | 'arriba';
    readonly punto: Punto;
    readonly sobre?: string /* data-ref */;
    readonly mayus: boolean;
} | {
    readonly k: 'tecla';
    readonly tecla: string;
    readonly mayus: boolean;
    readonly ctrl: boolean;
    readonly alt: boolean;
};
export function reducirGesto(m: Modelo, opd: Id, g: Gesto, ev: EventoLienzo): {
    readonly gesto: Gesto;
    readonly acciones: readonly Accion[];
    readonly gestoId?: string;
} { throw new Error('pendiente: WP-14'); }
