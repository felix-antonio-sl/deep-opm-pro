import type { Modelo } from '../nucleo/tipos';
import type { Respuesta } from '../nucleo/resultado';
export function leerCanonico(texto: string): Respuesta<Modelo> { throw new Error('pendiente: WP-6'); }
export function revision(texto: string): Promise<string> { throw new Error('pendiente: WP-6'); }
export function resumen(m: Modelo): {
    readonly nombre: string;
    readonly cosas: number;
    readonly opds: number;
} { throw new Error('pendiente: WP-6'); }
export const ID_MODELO: RegExp = /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/;
