import type { Modelo, Cosa, Enlace, TipoEnlace, Id } from '../nucleo/tipos';
import type { Respuesta } from '../nucleo/resultado';
export function congelar<T>(valor: T): T {
    if (valor && typeof valor === 'object' && !Object.isFrozen(valor)) {
        Object.freeze(valor);
        for (const x of Object.values(valor))
            congelar(x);
    }
    return valor;
}
export function must<T>(r: Respuesta<T>): T {
    if (!r.ok)
        throw new Error(r.rechazo.mensaje);
    return r.valor;
}
export function porNombre(m: Modelo, nombre: string): Cosa {
    const c = Object.values(m.cosas).find(c => c.nombre === nombre);
    if (!c)
        throw new Error(`No existe ${nombre}`);
    return c;
}
export interface DatosModelo {
    readonly objetos?: readonly (readonly [
        string,
        readonly string[]
    ])[];
    readonly procesos?: readonly string[];
    readonly enlaces?: readonly (readonly [
        TipoEnlace,
        string,
        string
    ])[];
}
export function modeloCon(a: DatosModelo = {}): Modelo {
    let n = 2;
    const cosas: Record<Id, Cosa> = {};
    const enlaces: Record<Id, Enlace> = {};
    const apariciones: Record<Id, {
        x: number;
        y: number;
        ancho: number;
        alto: number;
    }> = {};
    for (const [nombre, estados] of a.objetos ?? []) {
        const id = `o-${n++}`;
        cosas[id] = { id, tipo: 'objeto', nombre, esencia: 'fisica', afiliacion: 'sistemica', estados: estados.map(nombre => ({ id: `s-${n++}`, nombre })) };
    }
    for (const nombre of a.procesos ?? []) {
        const id = `p-${n++}`;
        cosas[id] = { id, tipo: 'proceso', nombre, esencia: 'informacional', afiliacion: 'sistemica' };
    }
    for (const [i, c] of Object.values(cosas).entries())
        apariciones[c.id] = { x: i * 180, y: 0, ancho: 135, alto: 60 };
    const encontrar = (nombre: string) => {
        const c = Object.values(cosas).find(c => c.nombre === nombre);
        if (!c)
            throw new Error(`No existe ${nombre}`);
        return c.id;
    };
    for (const [tipo, desde, hacia] of a.enlaces ?? []) {
        const id = `e-${n++}`;
        const origen = encontrar(desde), destino = encontrar(hacia);
        let e: Enlace;
        switch (tipo) {
            case 'consumo':
            case 'resultado':
            case 'efecto':
            case 'agente':
            case 'instrumento':
                e = { id, tipo, objeto: origen, proceso: destino };
                break;
            case 'agregacion':
            case 'exhibicion':
            case 'generalizacion':
            case 'clasificacion':
                e = { id, tipo, refinable: origen, refinador: destino };
                break;
            case 'etiquetadoBidireccional':
                e = { id, tipo, origen, destino, etiqueta: 'conoce', inversa: 'es-conocido' };
                break;
            default: e = { id, tipo, origen, destino };
        }
        enlaces[id] = e;
    }
    return congelar({ id: 'm-prueba', nombre: 'Prueba', unidadTiempo: 'min', raiz: 'opd-1', cosas, enlaces, abanicos: {}, opds: { 'opd-1': { id: 'opd-1', tipo: 'raiz', apariciones } }, secuencia: n });
}
