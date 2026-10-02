import type { Modelo, Id, Enlace, Ref } from './tipos';
import { extremos } from './tipos';
import type { Coincidencia } from './operaciones';
export interface Indice {
    readonly estadoDe: ReadonlyMap<Id, {
        readonly objeto: Id;
        readonly posicion: number;
    }>;
    readonly enlacesDeCosa: ReadonlyMap<Id, readonly Id[]>; // incidentes, incluidos los anclados a sus estados
    readonly enlacesDeEstado: ReadonlyMap<Id, readonly Id[]>;
    readonly abanicoDeEnlace: ReadonlyMap<Id, Id>;
    readonly aparicionesDe: ReadonlyMap<Id, readonly Id[]>; // cosa → OPDs en preorden
    readonly refinamientosDe: ReadonlyMap<Id, {
        readonly descomposicion?: Id;
        readonly despliegue?: Id;
    }>;
    readonly hijosDe: ReadonlyMap<Id, readonly Id[]>; // OPD → hijos por `orden`
    readonly preorden: readonly Id[];
    readonly etiqueta: ReadonlyMap<Id, string>;
    readonly internoDe: ReadonlyMap<Id, Id>; // cosa interna → OPD de descomposición
    readonly subprocesoDe: ReadonlyMap<Id, {
        readonly opd: Id;
        readonly banda: number;
    }>;
    readonly porClaveNombre: ReadonlyMap<string, readonly Id[]>; // ≥2 ⇒ nombre duplicado
}
export function claveNombre(nombre: string): string { return nombre.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('es'); } // NFC, espacios colapsados, recorte, toLocaleLowerCase('es')
const memo = new WeakMap<Modelo, Indice>();
export function indice(m: Modelo): Indice {
    const opd = (id: Id) => Object.hasOwn(m.opds, id) ? m.opds[id] : undefined;
    const previo = memo.get(m);
    if (previo)
        return previo;
    const estadoDe = new Map<Id, {
        objeto: Id;
        posicion: number;
    }>(), enlacesDeCosa = new Map<Id, Id[]>(), enlacesDeEstado = new Map<Id, Id[]>(), abanicoDeEnlace = new Map<Id, Id>(), aparicionesDe = new Map<Id, Id[]>(), refinamientosDe = new Map<Id, {
        descomposicion?: Id;
        despliegue?: Id;
    }>(), hijosDe = new Map<Id, Id[]>(), etiqueta = new Map<Id, string>(), internoDe = new Map<Id, Id>(), subprocesoDe = new Map<Id, {
        opd: Id;
        banda: number;
    }>(), porClaveNombre = new Map<string, Id[]>();
    const añadir = (map: Map<Id, Id[]>, k: Id, v: Id) => {
        const a = map.get(k) ?? [];
        if (!a.includes(v))
            a.push(v);
        map.set(k, a);
    };
    for (const c of Object.values(m.cosas)) {
        añadir(porClaveNombre, claveNombre(c.nombre), c.id);
        if (c.tipo === 'objeto')
            c.estados.forEach((s, posicion) => estadoDe.set(s.id, { objeto: c.id, posicion }));
    }
    for (const e of Object.values(m.enlaces)) {
        const ex = extremos(e);
        añadir(enlacesDeCosa, ex.origen, e.id);
        añadir(enlacesDeCosa, ex.destino, e.id);
        for (const s of estadosEnlace(e))
            añadir(enlacesDeEstado, s, e.id);
    }
    for (const f of Object.values(m.abanicos))
        for (const e of f.enlaces)
            abanicoDeEnlace.set(e, f.id);
    for (const o of Object.values(m.opds)) {
        if (o.tipo === 'raiz')
            continue;
        añadir(hijosDe, o.padre, o.id);
        refinamientosDe.set(o.cosa, { ...refinamientosDe.get(o.cosa), [o.tipo]: o.id });
        if (o.tipo === 'descomposicion') {
            for (const c of o.objetosInternos)
                internoDe.set(c, o.id);
            o.bandas.forEach((b, banda) => b.forEach(c => { internoDe.set(c, o.id); subprocesoDe.set(c, { opd: o.id, banda }); }));
        }
    }
    for (const hs of hijosDe.values())
        hs.sort((a, b) => { const x = opd(a), y = opd(b); return (x && x.tipo !== 'raiz' ? x.orden : 0) - (y && y.tipo !== 'raiz' ? y.orden : 0) || a.localeCompare(b); });
    const preorden: Id[] = [], vistos = new Set<Id>();
    const visitar = (id: Id, t: string) => {
        if (vistos.has(id) || !opd(id))
            return;
        vistos.add(id);
        preorden.push(id);
        etiqueta.set(id, t);
        for (const c of Object.keys(opd(id)!.apariciones))
            añadir(aparicionesDe, c, id);
        (hijosDe.get(id) ?? []).forEach((h, i) => visitar(h, t === 'SD' ? `SD${i + 1}` : `${t}.${i + 1}`));
    };
    visitar(m.raiz, 'SD');
    const idx: Indice = { estadoDe, enlacesDeCosa, enlacesDeEstado, abanicoDeEnlace, aparicionesDe, refinamientosDe, hijosDe, preorden, etiqueta, internoDe, subprocesoDe, porClaveNombre };
    memo.set(m, idx);
    return idx;
}
function estadosEnlace(e: Enlace): readonly Id[] {
    switch (e.tipo) {
        case 'consumo':
        case 'resultado':
        case 'agente':
        case 'instrumento': return e.estado ? [e.estado] : [];
        case 'efecto': return [e.entrada, e.salida].filter((x): x is Id => x !== undefined);
        case 'generalizacion': return e.estados ? [e.estados.general, e.estados.especializacion] : [];
        case 'etiquetado': return [e.estadoOrigen, e.estadoDestino].filter((x): x is Id => x !== undefined);
        case 'etiquetadoBidireccional': return e.estadoOrigen ? [e.estadoOrigen] : [];
        case 'reciproco': return e.estados ? [e.estados.origen, ...(e.estados.destino ? [e.estados.destino] : [])] : [];
        default: return [];
    }
}
const sinAcentos = (s: string) => claveNombre(s).normalize('NFD').replace(/\p{M}/gu, '');
export function buscarPorNombre(m: Modelo, consulta: string, max = 20): readonly Coincidencia[] {
    const idx = indice(m), q = sinAcentos(consulta), r: Coincidencia[] = [];
    for (const c of Object.values(m.cosas)) {
        if (sinAcentos(c.nombre).includes(q))
            r.push({ ref: { tipo: 'cosa', id: c.id }, texto: c.nombre, detalle: `${c.tipo} · ${(idx.aparicionesDe.get(c.id) ?? []).map(id => idx.etiqueta.get(id)).join(', ')}` });
        if (c.tipo === 'objeto')
            for (const s of c.estados)
                if (sinAcentos(s.nombre).includes(q))
                    r.push({ ref: { tipo: 'estado', id: s.id }, texto: s.nombre, detalle: c.nombre });
    }
    return r.slice(0, Math.max(0, max));
}
export function describirEnlace(m: Modelo, e: Enlace): string { const x = extremos(e); return `${e.tipo}: ${m.cosas[x.origen]?.nombre ?? x.origen} → ${m.cosas[x.destino]?.nombre ?? x.destino}`; }
