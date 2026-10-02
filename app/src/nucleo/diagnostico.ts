import type { Modelo, Id, Ref } from './tipos';
import type { Accion } from './operaciones';
import type { Rechazo } from './resultado';
export type Severidad = 'error' | 'warning' | 'info'; // ≙ CRÍTICA / ALTA-MEDIA / BAJA (método A8.1, DR-40)
export type FamiliaDiagnostico = 'gramatical' | 'metodologica' | 'identidad' | 'contencion' | 'sugerencia'; // R-OPD-VAL-2
export interface Diagnostico {
    readonly codigo: CodigoDiagnostico;
    readonly regla: string;
    readonly severidad: Severidad;
    readonly familia: FamiliaDiagnostico;
    readonly mensaje: string;
    readonly accion: string;
    readonly refs: readonly Ref[];
    readonly opd?: Id;
    readonly reparacion?: Accion; // un clic; el panel agrupa por código y ofrece «Aplicar a los N»
}
export interface FilaCatalogo {
    readonly codigo: string;
    readonly regla: string;
    readonly severidad: Severidad;
    readonly familia: FamiliaDiagnostico;
    readonly accion: string;
}
type CodigoPendiente = 'enlace-invalido' | 'abanico-invalido' | 'nombre-duplicado' | 'nombre-fuera-de-lexico' | 'estado-duplicado' | 'estado-fuera-de-lexico' | 'etiqueta-fuera-de-lexico' | 'precedencia-invalida' | 'conflicto-resultado-consumo' | 'proceso-sin-transformacion' | 'subproceso-sin-transformado' | 'refinamiento-trivial' | 'enlace-en-contorno-temporal' | 'opd-denso' | 'opd-sobrecargado' | 'sd-sin-proceso-unico' | 'manejador-no-ambiental' | 'cota-faltante' | 'afiliacion-incoherente' | 'proceso-de-ambientales' | 'refinador-en-varios-contextos' | 'general-redundante' | 'objeto-transiente' | 'nombre-proceso-largo' | 'nombre-proceso-no-deverbal' | 'nombre-objeto-plural' | 'nombre-estado-no-descriptivo' | 'etiqueta-larga' | 'mezcla-infinitivo-nominalizacion' | 'estado-sin-escritor' | 'agente-humano' | 'ajuste-automatico' | 'cosa-sin-aparicion' | 'enlace-sin-vista';
export const CATALOGO: readonly (FilaCatalogo & {
    readonly codigo: CodigoPendiente;
})[] = new Proxy<(FilaCatalogo & {
    readonly codigo: CodigoPendiente;
})[]>([], { get() { throw new Error('pendiente: WP-5'); } });
export function diagnosticar(m: Modelo): readonly Diagnostico[] { throw new Error('pendiente: WP-5'); }
export function gatesExportacion(m: Modelo, alcance: {
    readonly opd: Id;
} | 'modelo'): readonly Rechazo[] { throw new Error('pendiente: WP-5'); }
export type CodigoDiagnostico = (typeof CATALOGO)[number]['codigo'];
