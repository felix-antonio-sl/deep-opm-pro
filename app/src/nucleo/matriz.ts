import type { Familia, TipoEnlace, Modelo, Enlace, EnlaceNuevo, Id, Abanico } from './tipos';
import type { Violacion } from './resultado';
import type { Indice } from './indice';
import type { Accion, EstadosEnlace, ExtremoRef } from './operaciones';
type Clase = 'objeto' | 'proceso' | 'cosa';
export type EstadosFila = 'ninguno' | 'objeto' | 'entradaSalida' | 'parGeneralizacion' | 'origenDestino' | 'soloOrigen' | 'simetrico';
export interface FilaMatriz {
    readonly familia: Familia;
    readonly roles: readonly [
        'objeto',
        'proceso'
    ] | readonly [
        'origen',
        'destino'
    ] | readonly [
        'refinable',
        'refinador'
    ];
    readonly clases: readonly [
        Clase,
        Clase
    ]; // categoría por rol
    readonly mismoTipo: boolean; // R-STRF-1, R-OPL-SE-2
    readonly reflexivo: boolean; // a === b admitido
    readonly estados: EstadosFila;
    readonly control: boolean; // Pre(P): R-MOD-4
    readonly abanico: boolean; // reglas §7.2
    readonly ruta: boolean; // DR-19
    readonly mult: 'objeto' | 'refinador' | 'ambos' | 'ninguno';
    readonly etiquetas: 'ninguna' | 'opcional' | 'doble';
    readonly plantillas: readonly string[]; // ids de §5.3 (opl/plantillas.test exige que existan)
    readonly menu: number; // orden en el menú de tipos (consumo primero)
}
export const MATRIZ: Readonly<Record<TipoEnlace, FilaMatriz>> = {
    get consumo(): FilaMatriz { throw new Error('pendiente: WP-2'); },
    get resultado(): FilaMatriz { throw new Error('pendiente: WP-2'); },
    get efecto(): FilaMatriz { throw new Error('pendiente: WP-2'); },
    get agente(): FilaMatriz { throw new Error('pendiente: WP-2'); },
    get instrumento(): FilaMatriz { throw new Error('pendiente: WP-2'); },
    get invocacion(): FilaMatriz { throw new Error('pendiente: WP-2'); },
    get excepcionSobretiempo(): FilaMatriz { throw new Error('pendiente: WP-2'); },
    get excepcionSubtiempo(): FilaMatriz { throw new Error('pendiente: WP-2'); },
    get agregacion(): FilaMatriz { throw new Error('pendiente: WP-2'); },
    get exhibicion(): FilaMatriz { throw new Error('pendiente: WP-2'); },
    get generalizacion(): FilaMatriz { throw new Error('pendiente: WP-2'); },
    get clasificacion(): FilaMatriz { throw new Error('pendiente: WP-2'); },
    get etiquetado(): FilaMatriz { throw new Error('pendiente: WP-2'); },
    get etiquetadoBidireccional(): FilaMatriz { throw new Error('pendiente: WP-2'); },
    get reciproco(): FilaMatriz { throw new Error('pendiente: WP-2'); },
};
export interface ReglaContexto {
    readonly id: string; // regla canónica
    readonly tipos: readonly TipoEnlace[];
    readonly severidad: 'error' | 'warning'; // warning solo AP-27 con previos omisibles
    viola(m: Modelo, e: Enlace, idx: Indice): string | null; // mensaje o null
    readonly accion: string; // acción canónica (R-AP-0B)
    readonly reparacion?: (e: Enlace) => Accion; // ejecutable en un clic
}
export const REGLAS_CONTEXTO: readonly ReglaContexto[] = new Proxy<ReglaContexto[]>([], { get() { throw new Error('pendiente: WP-2'); } });
export function violacionesContexto(m: Modelo, e: Enlace): readonly Violacion[] { throw new Error('pendiente: WP-2'); }
export function violacionesAbanico(m: Modelo, f: Abanico): readonly Violacion[] { throw new Error('pendiente: WP-2'); }
export interface FilaNoOfrecido {
    readonly id: string;
    readonly regla: string;
    readonly motivo: string;
    readonly registro: `B-${number}`;
}
export const NO_OFRECIDO: readonly FilaNoOfrecido[] = new Proxy<FilaNoOfrecido[]>([], { get() { throw new Error('pendiente: WP-2'); } });
export function noOfrecido(m: Modelo, e: Enlace | EnlaceNuevo, abanico?: Abanico): FilaNoOfrecido | null { throw new Error('pendiente: WP-2'); }
export type Alternativa = {
    readonly k: 'completarCambio';
    readonly enlace: Id;
    readonly estados: EstadosEnlace;
} // TS4/TS5 ⇒ TS3
 | {
    readonly k: 'abanicoCon';
    readonly enlace: Id;
} // ofrecer XOR y OR
 | {
    readonly k: 'cambiarTipoExistente';
    readonly enlace: Id;
};
export type OpcionTipo = {
    readonly tipo: TipoEnlace;
    readonly sentido: 'directo' | 'inverso';
    readonly legal: true;
    readonly candidato: EnlaceNuevo;
    readonly avisos: readonly Violacion[];
} | {
    readonly tipo: TipoEnlace;
    readonly sentido: 'directo' | 'inverso';
    readonly legal: false;
    readonly motivo: Violacion;
    readonly alternativa?: Alternativa;
};
export function violacionesForma(m: Modelo, e: Enlace | EnlaceNuevo): readonly Violacion[] { throw new Error('pendiente: WP-2'); }
export function tiposLegales(m: Modelo, a: {
    readonly opd: Id;
    readonly desde: ExtremoRef;
    readonly hacia: ExtremoRef;
}): readonly OpcionTipo[] { throw new Error('pendiente: WP-2'); }
export function erroresContexto(m: Modelo): readonly Violacion[] { throw new Error('pendiente: WP-2'); }
