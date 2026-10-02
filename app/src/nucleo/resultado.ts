import type { Id, Modelo, Ref } from './tipos';
import { erroresContexto } from './matriz';
export type CodigoRechazo = 'lexico' | 'unicidad-nominal' | 'no-visible' | 'interno-no-visible' | 'ya-aparece' | 'ya-existe' | 'es-interno' | 'es-contenedor' | 'tiene-refinamiento' | 'refinamiento-no-hoja' | 'ya-refinado' | 'ciclo' | 'externo-no-refinable' | 'descomposicion-objeto' | 'forma' | 'contexto' | 'no-ofrecido' | 'abanico' | 'estado-enlazado' | 'efecto-sin-estados' | 'tipo-incompatible' | 'duracion-invalida' | 'referencia-ambigua' | 'no-encontrado';
export interface Rechazo {
    readonly codigo: CodigoRechazo;
    readonly regla: string; // id canónico (R-…, AP-…, T-…) o 'producto'
    readonly mensaje: string; // es-CL, con nombres tipográficos: «**Pedido** ya existe (objeto, en SD y SD2).»
    readonly accion?: string; // acción canónica (R-AP-0B): «Trae esa misma cosa o escribe otro nombre.»
    readonly refs: readonly Ref[];
}
export interface Traza {
    readonly regla: string;
    readonly mensaje: string;
    readonly refs: readonly Ref[];
} // R-OPD-OP-5
export type Respuesta<T> = {
    readonly ok: true;
    readonly valor: T;
    readonly trazas: readonly Traza[];
} | {
    readonly ok: false;
    readonly rechazo: Rechazo;
};
export interface Hecho {
    readonly modelo: Modelo;
    readonly creados: readonly Id[];
} // valor de toda operación que muta
export type Operacion<A> = (m: Modelo, a: A) => Respuesta<Hecho>;
export interface Violacion {
    readonly codigo: string;
    readonly regla: string;
    readonly mensaje: string;
    readonly refs: readonly Ref[];
    readonly accion?: string;
}
// Ayudante interno de transacción (≈50 líneas). No se exporta fuera de nucleo/.
export interface Tx {
    readonly m: Modelo; // modelo en curso (copia de camino)
    nuevoId(prefijo: 'o' | 'p' | 's' | 'e' | 'f' | 'opd'): Id;
    poner<K extends 'cosas' | 'enlaces' | 'abanicos' | 'opds'>(col: K, valor: Modelo[K][Id]): void;
    quitar(col: 'cosas' | 'enlaces' | 'abanicos' | 'opds', id: Id): void;
    modelo(cambio: Partial<Pick<Modelo, 'nombre' | 'descripcion' | 'unidadTiempo'>>): void;
    traza(t: Traza): void;
    rechazar(r: Rechazo): never; // lanza una excepción privada
}
class Aborto {
    constructor(readonly rechazo: Rechazo) { }
}
const memoErrores = new WeakMap<Modelo, readonly Violacion[]>();
const clave = (v: Violacion) => JSON.stringify([v.codigo, v.refs.map(r => `${r.tipo}:${r.id}`).sort()]);
function errores(m: Modelo): readonly Violacion[] {
    const previo = memoErrores.get(m);
    if (previo)
        return previo;
    const vs = erroresContexto(m);
    memoErrores.set(m, vs);
    return vs;
}
export function transaccion(m: Modelo, cuerpo: (tx: Tx) => void, o?: {
    permiteErroresNuevos?: true;
}): Respuesta<Hecho> {
    let actual = m;
    const creados: Id[] = [], trazas: Traza[] = [];
    const tx: Tx = { get m() { return actual; }, nuevoId(prefijo) { const id = `${prefijo}-${actual.secuencia}`; actual = { ...actual, secuencia: actual.secuencia + 1 }; creados.push(id); return id; }, poner(col, valor) { actual = { ...actual, [col]: { ...actual[col], [valor.id]: valor } }; }, quitar(col, id) { const copia = { ...actual[col] }; delete copia[id]; actual = { ...actual, [col]: copia }; }, modelo(cambio) { actual = { ...actual, ...cambio }; }, traza(t) { trazas.push(t); }, rechazar(r) { throw new Aborto(r); } };
    try {
        cuerpo(tx);
        if (!o?.permiteErroresNuevos) {
            const previos = new Set(errores(m).map(clave));
            const nuevo = errores(actual).find(v => !previos.has(clave(v)));
            if (nuevo)
                return { ok: false, rechazo: { codigo: 'contexto', regla: nuevo.regla, mensaje: nuevo.mensaje, refs: nuevo.refs, ...(nuevo.accion ? { accion: nuevo.accion } : {}) } };
        }
        return { ok: true, valor: { modelo: actual, creados }, trazas };
    }
    catch (e) {
        if (e instanceof Aborto)
            return { ok: false, rechazo: e.rechazo };
        throw e;
    }
}
