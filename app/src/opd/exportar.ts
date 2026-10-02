import type { Modelo, Id, Ref } from '../nucleo/tipos';
import type { Respuesta } from '../nucleo/resultado';
import type { Escena } from './escena';
export interface LineaDocumento {
    readonly tokens: readonly {
        readonly texto: string;
        readonly marca?: 'objeto' | 'proceso' | 'estado';
    }[];
}
// LineaOpl la satisface estructuralmente: opd/ no importa opl/
export interface Advertencia {
    readonly tipo: 'cruce' | 'atraviesa' | 'solape';
    readonly refs: readonly Ref[];
    readonly texto: string;
}
export function advertenciasEscena(e: Escena): readonly Advertencia[] { throw new Error('pendiente: WP-12'); }
export function exportarDiagrama(m: Modelo, opd: Id, o: {
    readonly version: string;
}): Respuesta<{
    readonly svg: string;
    readonly archivo: string;
    readonly advertencias: readonly Advertencia[];
}> { throw new Error('pendiente: WP-12'); }
export function exportarDocumento(m: Modelo, opl: ReadonlyMap<Id, readonly LineaDocumento[]>, o: {
    readonly version: string;
}): Respuesta<{
    readonly html: string;
    readonly archivo: string;
}> { throw new Error('pendiente: WP-12'); }
