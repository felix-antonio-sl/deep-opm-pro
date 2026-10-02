import type { Modelo } from '../nucleo/tipos';
import type { Respuesta } from '../nucleo/resultado';
import { importarV0 } from './importar';
import { exportarV0 } from './exportar';
import { informeVacio } from './informe';
import { sha256 } from './sha256';
export function leerCanonico(texto: string): Respuesta<Modelo> {
    const r = importarV0(texto);
    if (!r.ok || !informeVacio(r.informe) || exportarV0(r.modelo) !== texto) return { ok:false, rechazo:{ codigo:'forma', regla:'T-286', mensaje:'El documento no es v0 canónico de esta versión.', refs:[] } };
    return { ok:true, valor:r.modelo, trazas:[] };
}
export async function revision(texto: string): Promise<string> { return sha256(texto); }
export function resumen(m: Modelo): {
    readonly nombre: string;
    readonly cosas: number;
    readonly opds: number;
} { return { nombre:m.nombre, cosas:Object.keys(m.cosas).length, opds:Object.keys(m.opds).length }; }
export const ID_MODELO: RegExp = /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/;
