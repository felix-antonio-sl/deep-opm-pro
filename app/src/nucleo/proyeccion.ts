import type { Modelo, Id, RelacionIncompleta, Enlace, Operador } from './tipos';
import type { Diagnostico } from './diagnostico';
export interface Vista {
    readonly opd: Id;
    readonly clase: 'raiz' | 'descomposicion' | 'despliegue';
    readonly cosas: readonly CosaVista[];
    readonly enlaces: readonly EnlaceVisto[];
    readonly abanicos: readonly AbanicoVisto[];
    readonly incompletas: readonly {
        readonly refinable: Id;
        readonly relacion: RelacionIncompleta;
        readonly declarada: boolean;
    }[];
    readonly conflictos: readonly Diagnostico[]; // AP-30 / R-PREC-3 de este OPD
}
export interface CosaVista {
    readonly cosa: Id;
    readonly rol: 'libre' | 'contenedor' | 'subproceso' | 'interno' | 'externo' | 'refinable';
    readonly banda?: number; // subprocesos
    readonly estadosVisibles: readonly Id[]; // en el orden del modelo
    readonly ocultos: number; // chip ⋯N y D6
}
export interface EnlaceVisto {
    readonly clave: string; // estable: tipo|extremos vistos|estados|control
    readonly enlace: Enlace; // hecho visto (sintetizado si abstraído; id = primer subyacente)
    readonly hechos: readonly Id[]; // enlaces del modelo que representa (1 si es directo)
    readonly abstraido: boolean;
}
export interface AbanicoVisto {
    readonly abanico: Id;
    readonly operador: Operador;
    readonly ramas: readonly Id[];
    readonly comun: Id;
}
export function proyectar(m: Modelo, opd: Id): Vista { throw new Error('pendiente: WP-4p'); }
export function etiquetaOpd(m: Modelo, opd: Id): string { throw new Error('pendiente: WP-4p'); }
export function opdsEnPreorden(m: Modelo): readonly Id[] { throw new Error('pendiente: WP-4p'); }
