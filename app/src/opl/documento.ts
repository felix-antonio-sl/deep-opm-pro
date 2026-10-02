import type { Modelo } from '../nucleo/tipos';
import type { Respuesta } from '../nucleo/resultado';
import type { Plan } from './planificar';
export function generarDocumentoOpl(m: Modelo): string { throw new Error('pendiente: WP-7'); }
export function importarOpl(nombre: string, texto: string): Respuesta<{
    modelo: Modelo;
    plan: Plan;
}> { throw new Error('pendiente: WP-13'); }
