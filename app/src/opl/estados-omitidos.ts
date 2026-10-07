import type { Id, Modelo } from '../nucleo/tipos';
import type { Accion } from '../nucleo/operaciones';
import { generarModelo } from './generar';

export interface EstadoOmitido {
    readonly objeto: Id;
    readonly estado: Id;
    readonly opds: readonly Id[];
}

// La cobertura es la del documento real, incluidas las referencias de enlaces y otros OPDs.
// Los objetos sin aparición conservan su límite B-26; aquí nunca se inventa una vista.
export function estadosOmitidos(m: Modelo): readonly EstadoOmitido[] {
    const expresados = new Set(generarModelo(m).flatMap(l => l.refs.filter(r => r.tipo === 'estado').map(r => r.id)));
    const omitidos: EstadoOmitido[] = [];
    for (const c of Object.values(m.cosas)) {
        if (c.tipo !== 'objeto') continue;
        const opds = Object.values(m.opds).filter(o => Object.hasOwn(o.apariciones, c.id)).map(o => o.id);
        if (!opds.length) continue;
        for (const s of c.estados) if (!expresados.has(s.id)) omitidos.push({ objeto: c.id, estado: s.id, opds });
    }
    return omitidos;
}

// Propuesta pura sobre el Modelo vigente: sólo retira supresiones de estados omitidos reales.
export function accionesExpresarEstados(m: Modelo): readonly Accion[] {
    const acciones: Accion[] = [];
    for (const omitido of estadosOmitidos(m)) {
        const c = m.cosas[omitido.objeto]!;
        if (c.tipo !== 'objeto') continue;
        const s = c.estados.find(s => s.id === omitido.estado)!;
        if (s.suprimido) acciones.push({ op: 'suprimirEstado', args: { estado: s.id, opd: null, activa: false } });
        for (const opd of omitido.opds) if (m.opds[opd]!.apariciones[c.id]!.ocultos?.includes(s.id)) {
            acciones.push({ op: 'suprimirEstado', args: { estado: s.id, opd, activa: false } });
        }
    }
    return acciones;
}
