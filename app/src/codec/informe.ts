import type { Id, Modelo } from '../nucleo/tipos';
export interface Entrada {
    readonly ruta: string;
    readonly mensaje: string;
    readonly regla?: string;
}
// ruta: "enlaces.e-19.multiplicidadOrigen"
export interface LineaDiff {
    readonly enlace?: Id;
    readonly abanico?: Id;
    readonly texto: string;
}
// texto = describirEnlace(): "consumo: Pedido → Despachar"
export interface DiffVisibilidad {
    readonly opd: Id;
    readonly etiqueta: string;
    readonly aparecen: readonly LineaDiff[];
    readonly desaparecen: readonly LineaDiff[];
}
export interface Informe {
    readonly normalizado: readonly Entrada[]; // transformación equivalente (no pierde hechos)
    readonly descartado: readonly Entrada[]; // información no representable: pérdida declarada
    readonly ignorado: Readonly<Record<string, number>>; // campos visuales/derivables: ruta → conteo
    readonly rechazos: readonly Entrada[]; // el documento no se puede leer ⇒ no se importa
    readonly visibilidad: readonly DiffVisibilidad[]; // SYNTHESIS §8-21
}
export type ResultadoImport = {
    readonly ok: true;
    readonly modelo: Modelo;
    readonly informe: Informe;
} | {
    readonly ok: false;
    readonly informe: Informe;
}; // informe.rechazos no vacío
export function informeVacio(i: Informe): boolean { throw new Error('pendiente: WP-6'); }
