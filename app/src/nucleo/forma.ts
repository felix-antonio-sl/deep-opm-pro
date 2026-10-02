import type { Modelo, Id, Ref, Enlace, Opd } from './tipos';
import type { Violacion } from './resultado';
import { indice } from './indice';
import { MATRIZ, noOfrecido } from './matriz';
import { sufijoId } from './ids';
export function validarForma(m: Modelo): readonly Violacion[] {
    const opd = (id: Id) => Object.hasOwn(m.opds, id) ? m.opds[id] : undefined;
    const aparece = (o: Opd | undefined, id: Id) => o !== undefined && Object.hasOwn(o.apariciones, id);
    const vs: Violacion[] = [], idx = indice(m);
    const fallo = (codigo: string, mensaje: string, refs: readonly Ref[]) => vs.push({ codigo, regla: codigo, mensaje, refs });
    const ref = (tipo: Ref['tipo'], id: Id): Ref => ({ tipo, id });
    const existe = (id: Id, tipo: Ref['tipo']) => {
        const ok = tipo === 'estado' ? idx.estadoDe.has(id) : tipo === 'cosa' ? Object.hasOwn(m.cosas, id) : tipo === 'enlace' ? Object.hasOwn(m.enlaces, id) : tipo === 'opd' ? Object.hasOwn(m.opds, id) : Object.hasOwn(m.abanicos, id);
        if (!ok)
            fallo('F-1', `No existe ${tipo} ${id}.`, [ref(tipo, id)]);
        return ok;
    };
    const estado = (s: Id | undefined, c: Id, e: Id, codigo = 'F-3') => {
        if (s === undefined)
            return;
        if (!existe(s, 'estado'))
            return;
        if (idx.estadoDe.get(s)?.objeto !== c)
            fallo(codigo, 'El estado no pertenece a su objeto.', [ref('enlace', e), ref('estado', s), ref('cosa', c)]);
    };
    const ids = new Set<Id>();
    let max = 0;
    const id = (clave: Id, valor: Id, tipo: Ref['tipo']) => {
        if (clave !== valor || ids.has(valor))
            fallo('F-9', 'Id repetido o distinto de su clave.', [ref(tipo, valor)]);
        ids.add(valor);
        max = Math.max(max, sufijoId(valor));
    };
    for (const [k, c] of Object.entries(m.cosas)) {
        id(k, c.id, 'cosa');
        if (c.tipo === 'objeto') {
            for (const s of c.estados)
                id(s.id, s.id, 'estado');
            for (const s of [c.porDefecto, c.current])
                if (s !== undefined) {
                    existe(s, 'estado');
                    if (idx.estadoDe.get(s)?.objeto !== c.id)
                        fallo('F-1', 'La designación no pertenece a su objeto.', [ref('cosa', c.id), ref('estado', s)]);
                }
            if (c.valor !== undefined && !Object.values(m.enlaces).some(e => e.tipo === 'exhibicion' && e.refinador === c.id))
                fallo('F-13', 'El objeto con valor debe ser un rasgo exhibido.', [ref('cosa', c.id)]);
        }
        else if (c.duracion) {
            const d = c.duracion;
            const ns = [d.min, d.esperada, d.max].filter((n): n is number => n !== undefined);
            if (ns.some(n => !Number.isFinite(n) || n <= 0) || (d.min !== undefined && d.esperada !== undefined && d.min > d.esperada) || (d.esperada !== undefined && d.max !== undefined && d.esperada > d.max) || (d.min !== undefined && d.max !== undefined && d.min > d.max))
                fallo('F-10', 'La duración debe ser positiva, finita y ordenada.', [ref('cosa', c.id)]);
        }
    }
    for (const [k, e] of Object.entries(m.enlaces)) {
        id(k, e.id, 'enlace');
        const fila = MATRIZ[e.tipo];
        // Roles contractuales: todas las filas declaran un par de ids.
        const roles: readonly Id[] = 'objeto' in e ? [e.objeto, e.proceso] : 'refinable' in e ? [e.refinable, e.refinador] : [e.origen, e.destino];
        const ca = m.cosas[roles[0]!], cb = m.cosas[roles[1]!];
        for (const c of roles)
            existe(c, 'cosa');
        if (ca && cb && (fila.clases[0] !== 'cosa' && fila.clases[0] !== ca.tipo || fila.clases[1] !== 'cosa' && fila.clases[1] !== cb.tipo || fila.mismoTipo && ca.tipo !== cb.tipo || !fila.reflexivo && ca.id === cb.id))
            fallo('F-2', 'Las categorías o la reflexividad no corresponden a la matriz.', [ref('enlace', e.id)]);
        switch (e.tipo) {
            case 'consumo':
            case 'resultado':
            case 'agente':
            case 'instrumento':
                estado(e.estado, e.objeto, e.id);
                break;
            case 'efecto':
                estado(e.entrada, e.objeto, e.id);
                estado(e.salida, e.objeto, e.id);
                if (e.escision) {
                    existe(e.escision.par, 'enlace');
                    const p = m.enlaces[e.escision.par], mitad = e.escision.mitad;
                    const propia = mitad === 'entrada' ? e.entrada !== undefined && e.salida === undefined : e.salida !== undefined && e.entrada === undefined;
                    if (!propia || e.control !== undefined || !p || p.tipo !== 'efecto' || p.objeto !== e.objeto || p.escision?.par !== e.id || p.escision.mitad === mitad)
                        fallo('F-4', 'La escisión debe formar un par bilateral de mitades opuestas.', [ref('enlace', e.id)]);
                }
                break;
            case 'generalizacion':
                if (e.estados) {
                    estado(e.estados.general, e.refinable, e.id);
                    estado(e.estados.especializacion, e.refinador, e.id);
                    if (m.cosas[e.refinable]?.tipo !== 'objeto' || m.cosas[e.refinador]?.tipo !== 'objeto')
                        fallo('F-3', 'La especialización de estados requiere dos objetos.', [ref('enlace', e.id)]);
                }
                break;
            case 'etiquetado':
                estado(e.estadoOrigen, e.origen, e.id);
                estado(e.estadoDestino, e.destino, e.id);
                break;
            case 'etiquetadoBidireccional':
                estado(e.estadoOrigen, e.origen, e.id);
                if (!e.etiqueta.trim() || !e.inversa.trim() || e.etiqueta === e.inversa)
                    fallo('F-11', 'Las etiquetas deben ser distintas y no vacías.', [ref('enlace', e.id)]);
                break;
            case 'reciproco':
                if (e.estados) {
                    estado(e.estados.origen, e.origen, e.id);
                    estado(e.estados.destino, e.destino, e.id);
                }
                break;
        }
        const no = noOfrecido(m, e);
        if (no)
            fallo('F-5', no.motivo, [ref('enlace', e.id)]);
    }
    const ramas = new Set<Id>();
    for (const [k, f] of Object.entries(m.abanicos)) {
        id(k, f.id, 'abanico');
        if (f.enlaces.length < 2 || new Set(f.enlaces).size !== f.enlaces.length)
            fallo('F-6', 'El abanico requiere dos ramas distintas.', [ref('abanico', f.id)]);
        for (const e of f.enlaces) {
            existe(e, 'enlace');
            if (ramas.has(e))
                fallo('F-6', 'Un enlace solo puede pertenecer a un abanico.', [ref('enlace', e)]);
            ramas.add(e);
            const enlace = m.enlaces[e];
            if (enlace) {
                const no = noOfrecido(m, enlace, f);
                if (no)
                    fallo('F-5', no.motivo, [ref('abanico', f.id)]);
            }
        }
    }
    const raiz = opd(m.raiz);
    existe(m.raiz, 'opd');
    if (raiz?.tipo !== 'raiz' || Object.values(m.opds).filter(o => o.tipo === 'raiz').length !== 1)
        fallo('F-7', 'Debe existir una única raíz designada.', [ref('opd', m.raiz)]);
    const refinamientos = new Set<string>(), internos = new Map<Id, Id>();
    const ancestros = (o: Opd) => {
        const vistos = new Set<Id>([o.id]), cosas = new Set<Id>();
        let actual = o;
        while (actual.tipo !== 'raiz') {
            if (vistos.has(actual.padre)) {
                fallo('F-7', 'El árbol contiene un ciclo.', [ref('opd', o.id)]);
                break;
            }
            vistos.add(actual.padre);
            const p = opd(actual.padre);
            if (!p)
                break;
            if (p.tipo !== 'raiz')
                cosas.add(p.cosa);
            actual = p;
        }
        return { vistos, cosas, conectado: actual.id === m.raiz };
    };
    for (const [k, o] of Object.entries(m.opds)) {
        id(k, o.id, 'opd');
        for (const [c, a] of Object.entries(o.apariciones)) {
            existe(c, 'cosa');
            for (const s of a.ocultos ?? []) {
                existe(s, 'estado');
                if (idx.estadoDe.get(s)?.objeto !== c)
                    fallo('F-1', 'El estado oculto no pertenece a la aparición.', [ref('opd', o.id), ref('estado', s)]);
            }
            if (!Number.isFinite(a.x) || !Number.isFinite(a.y) || !Number.isInteger(a.x) || !Number.isInteger(a.y) || !Number.isInteger(a.ancho) || !Number.isInteger(a.alto) || a.ancho < 20 || a.alto < 20)
                fallo('F-12', 'La caja requiere enteros finitos y tamaños ≥20.', [ref('opd', o.id), ref('cosa', c)]);
        }
        if (o.tipo === 'raiz')
            continue;
        existe(o.padre, 'opd');
        existe(o.cosa, 'cosa');
        const key = `${o.tipo}:${o.cosa}`, asc = ancestros(o);
        if (refinamientos.has(key) || asc.cosas.has(o.cosa) || !asc.conectado || !aparece(o, o.cosa) || !aparece(opd(o.padre), o.cosa) || o.tipo === 'descomposicion' && m.cosas[o.cosa]?.tipo !== 'proceso')
            fallo('F-7', 'El refinamiento viola identidad, árbol, categoría o apariciones.', [ref('opd', o.id)]);
        refinamientos.add(key);
        if (o.tipo === 'descomposicion') {
            const miembros = new Set<Id>();
            for (const b of o.bandas) {
                if (!b.length)
                    fallo('F-8', 'Una banda no puede estar vacía.', [ref('opd', o.id)]);
                for (const c of b) {
                    existe(c, 'cosa');
                    if (miembros.has(c) || c === o.cosa || m.cosas[c]?.tipo !== 'proceso' || !aparece(o, c))
                        fallo('F-8', 'Subproceso inválido, repetido o sin aparición.', [ref('opd', o.id), ref('cosa', c)]);
                    miembros.add(c);
                }
            }
            for (const c of o.objetosInternos) {
                existe(c, 'cosa');
                if (miembros.has(c) || m.cosas[c]?.tipo !== 'objeto' || !aparece(o, c))
                    fallo('F-8', 'Objeto interno inválido o sin aparición.', [ref('opd', o.id), ref('cosa', c)]);
                miembros.add(c);
            }
            for (const c of miembros) {
                if (internos.has(c) && internos.get(c) !== o.id)
                    fallo('F-8', 'Un interno tiene más de un OPD dueño.', [ref('cosa', c)]);
                internos.set(c, o.id);
            }
        }
    }
    for (const [padre, hs] of idx.hijosDe) {
        hs.forEach((h, i) => {
            const o = opd(h);
            if (o && o.tipo !== 'raiz' && o.orden !== i)
                fallo('F-7', 'Los órdenes de hermanos deben ser densos.', [ref('opd', padre), ref('opd', h)]);
        });
    }
    for (const [c, dueño] of internos)
        for (const o of Object.values(m.opds))
            if (aparece(o, c) && o.id !== dueño && !ancestros(o).vistos.has(dueño))
                fallo('F-8', 'El interno aparece fuera de su alcance.', [ref('cosa', c), ref('opd', o.id)]);
    if (!Number.isSafeInteger(m.secuencia) || m.secuencia <= max)
        fallo('F-9', 'La secuencia debe superar todos los sufijos numéricos.', []);
    return vs;
}
