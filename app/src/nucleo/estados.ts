import type { Id, Objeto, Estado, Enlace, Designacion, Ref } from './tipos';
import type { Operacion, Tx, CodigoRechazo } from './resultado';
import { transaccion } from './resultado';
import { indice, claveNombre } from './indice';
import { validarNombreEstado } from './lexico';
import { proyectar } from './proyeccion';
import { noOfrecido } from './matriz';

function negar(tx: Tx, codigo: CodigoRechazo, regla: string, mensaje: string, refs: readonly Ref[]): never {
    return tx.rechazar({ codigo, regla, mensaje, refs });
}
function objeto(tx: Tx, id: Id): Objeto {
    const c = Object.hasOwn(tx.m.cosas, id) ? tx.m.cosas[id] : undefined;
    if (!c) negar(tx, 'no-encontrado', 'producto', 'El objeto ya no existe.', [{ tipo: 'cosa', id }]);
    if (c.tipo !== 'objeto') negar(tx, 'tipo-incompatible', 'AP-12', 'Un proceso no tiene estados.', [{ tipo: 'cosa', id }]);
    return c;
}
function estado(tx: Tx, id: Id): { objeto: Objeto; estado: Estado; posicion: number } {
    const dueño = indice(tx.m).estadoDe.get(id);
    if (!dueño) negar(tx, 'no-encontrado', 'producto', 'El estado ya no existe.', [{ tipo: 'estado', id }]);
    const c = objeto(tx, dueño.objeto);
    return { objeto: c, estado: c.estados[dueño.posicion]!, posicion: dueño.posicion };
}
function nombre(tx: Tx, c: Objeto, n: string, excluir?: Id) {
    const refs: Ref[] = [{ tipo: 'cosa', id: c.id }, ...(excluir ? [{ tipo: 'estado' as const, id: excluir }] : [])];
    const r = validarNombreEstado(n); if (r) tx.rechazar({ ...r, refs });
    const otro = c.estados.find(s => s.id !== excluir && claveNombre(s.nombre) === claveNombre(n));
    if (otro) negar(tx, 'unicidad-nominal', 'T-015', `El estado **${n}** ya existe en **${c.nombre}**.`, [...refs, { tipo: 'estado', id: otro.id }]);
}
function posicion(tx: Tx, n: number, max: number, id: Id) {
    if (!Number.isInteger(n) || n < 0 || n > max) negar(tx, 'forma', 'T-015', 'La posición del estado está fuera del arreglo.', [{ tipo: 'cosa', id }]);
}
function sin<T extends object, K extends keyof T>(x: T, k: K): Omit<T, K> { const copia = { ...x }; delete copia[k]; return copia; }

export const agregarEstado: Operacion<{ objeto: Id; nombre: string; indice?: number }> = (m, a) => transaccion(m, tx => {
    const c = objeto(tx, a.objeto); nombre(tx, c, a.nombre);
    const p = a.indice ?? c.estados.length; posicion(tx, p, c.estados.length, c.id);
    const id = tx.nuevoId('s'), estados = [...c.estados]; estados.splice(p, 0, { id, nombre: a.nombre });
    tx.poner('cosas', { ...c, estados });
});
export const renombrarEstado: Operacion<{ estado: Id; nombre: string }> = (m, a) => transaccion(m, tx => {
    const d = estado(tx, a.estado); nombre(tx, d.objeto, a.nombre, a.estado);
    tx.poner('cosas', { ...d.objeto, estados: d.objeto.estados.map(s => s.id === a.estado ? { ...s, nombre: a.nombre } : s) });
});
export const moverEstado: Operacion<{ estado: Id; indice: number }> = (m, a) => transaccion(m, tx => {
    const d = estado(tx, a.estado); posicion(tx, a.indice, d.objeto.estados.length - 1, d.objeto.id);
    const estados = [...d.objeto.estados]; estados.splice(d.posicion, 1); estados.splice(a.indice, 0, d.estado);
    tx.poner('cosas', { ...d.objeto, estados });
});

// Solo retiro de campos declarado en §4.2; legalidad y cierre siguen en la matriz.
function sinAnclaje(e: Enlace, id: Id): Enlace {
    switch (e.tipo) {
        case 'consumo': case 'resultado': case 'agente': case 'instrumento': return e.estado === id ? sin(e, 'estado') : e;
        case 'efecto': {
            let nuevo = e;
            if (nuevo.entrada === id) nuevo = sin(nuevo, 'entrada');
            if (nuevo.salida === id) nuevo = sin(nuevo, 'salida');
            return nuevo;
        }
        case 'generalizacion': return e.estados && (e.estados.general === id || e.estados.especializacion === id) ? sin(e, 'estados') : e;
        case 'etiquetado': {
            let nuevo = e;
            if (nuevo.estadoOrigen === id) nuevo = sin(nuevo, 'estadoOrigen');
            if (nuevo.estadoDestino === id) nuevo = sin(nuevo, 'estadoDestino');
            return nuevo;
        }
        case 'etiquetadoBidireccional': return e.estadoOrigen === id ? sin(e, 'estadoOrigen') : e;
        case 'reciproco':
            if (e.estados?.origen === id) return sin(e, 'estados');
            if (e.estados?.destino === id) return { ...e, estados: sin(e.estados, 'destino') };
            return e;
        default: return e;
    }
}
export const eliminarEstado: Operacion<{ estado: Id }> = (m, a) => {
    const r = transaccion(m, tx => {
        const d = estado(tx, a.estado);
        let c: Objeto = { ...d.objeto, estados: d.objeto.estados.filter(s => s.id !== a.estado) };
        if (c.porDefecto === a.estado) c = sin(c, 'porDefecto');
        if (c.current === a.estado) c = sin(c, 'current');
        tx.poner('cosas', c);
        const afectados = new Set<Id>();
        for (const id of indice(m).enlacesDeEstado.get(a.estado) ?? []) {
            const fan = indice(m).abanicoDeEnlace.get(id); if (fan) afectados.add(fan);
            const e = tx.m.enlaces[id]!, nuevo = sinAnclaje(e, a.estado);
            tx.poner('enlaces', nuevo);
            tx.traza({ regla: 'R-OPD-OP-5', mensaje: `El enlace perdió el anclaje al estado ${d.estado.nombre} de **${c.nombre}**.`, refs: [{ tipo: 'enlace', id }, { tipo: 'estado', id: a.estado }] });
            if (e.tipo === 'efecto' && e.escision) {
                const propio = tx.m.enlaces[id]!, otro = tx.m.enlaces[e.escision.par];
                if (propio.tipo === 'efecto') tx.poner('enlaces', sin(propio, 'escision'));
                if (otro?.tipo === 'efecto') tx.poner('enlaces', sin(otro, 'escision'));
                tx.traza({ regla: 'DR-7', mensaje: 'Las mitades del par quedaron standalone al perder un anclaje.', refs: [{ tipo: 'enlace', id }, { tipo: 'enlace', id: e.escision.par }] });
            }
        }
        for (const o of Object.values(tx.m.opds)) {
            const app = o.apariciones[c.id]; if (!app?.ocultos?.includes(a.estado)) continue;
            const ocultos = app.ocultos.filter(id => id !== a.estado);
            tx.poner('opds', { ...o, apariciones: { ...o.apariciones, [c.id]: ocultos.length ? { ...app, ocultos } : sin(app, 'ocultos') } });
        }
        for (const id of afectados) {
            const f = tx.m.abanicos[id]!;
            for (const rama of f.enlaces) {
                const no = noOfrecido(tx.m, tx.m.enlaces[rama]!, f);
                if (no) negar(tx, 'no-ofrecido', no.regla, no.motivo, [{ tipo: 'abanico', id }, { tipo: 'enlace', id: rama }, { tipo: 'estado', id: a.estado }]);
            }
        }
    });
    // Consume la violación global real, incluidos los generales no incidentes.
    return !r.ok && r.rechazo.regla === 'R-EFE-1' ? { ok: false, rechazo: { ...r.rechazo, codigo: 'efecto-sin-estados' } } : r;
};
export const designar: Operacion<{ estado: Id; designacion: Designacion; activa: boolean }> = (m, a) => transaccion(m, tx => {
    const d = estado(tx, a.estado), c = d.objeto;
    if (a.designacion === 'inicial' || a.designacion === 'final') {
        tx.poner('cosas', { ...c, estados: c.estados.map(s => s.id !== a.estado ? s : a.activa ? { ...s, [a.designacion]: true } : sin(s, a.designacion as 'inicial' | 'final')) });
        return;
    }
    const anterior = c[a.designacion];
    if (a.activa) {
        tx.poner('cosas', { ...c, [a.designacion]: a.estado });
        if (anterior && anterior !== a.estado) tx.traza({ regla: a.designacion === 'current' ? 'T-017' : 'T-016', mensaje: `La designación ${a.designacion} de **${c.nombre}** pasó a ${d.estado.nombre}.`, refs: [{ tipo: 'estado', id: anterior }, { tipo: 'estado', id: a.estado }] });
    } else if (anterior === a.estado) tx.poner('cosas', sin(c, a.designacion));
});

function ancla(e: Enlace, id: Id): boolean {
    switch (e.tipo) {
        case 'consumo': case 'resultado': case 'agente': case 'instrumento': return e.estado === id;
        case 'efecto': return e.entrada === id || e.salida === id;
        case 'generalizacion': return e.estados?.general === id || e.estados?.especializacion === id;
        case 'etiquetado': return e.estadoOrigen === id || e.estadoDestino === id;
        case 'etiquetadoBidireccional': return e.estadoOrigen === id;
        case 'reciproco': return e.estados?.origen === id || e.estados?.destino === id;
        default: return false;
    }
}
export const suprimirEstado: Operacion<{ estado: Id; opd: Id | null; activa: boolean }> = (m, a) => transaccion(m, tx => {
    const d = estado(tx, a.estado);
    const opds = a.opd === null ? indice(m).preorden : [a.opd];
    if (a.opd !== null) {
        const o = Object.hasOwn(m.opds, a.opd) ? m.opds[a.opd] : undefined;
        if (!o) negar(tx, 'no-encontrado', 'producto', 'El OPD ya no existe.', [{ tipo: 'opd', id: a.opd }]);
        if (!Object.hasOwn(o.apariciones, d.objeto.id)) negar(tx, 'no-visible', 'LF-03', `**${d.objeto.nombre}** no aparece en este OPD.`, [{ tipo: 'cosa', id: d.objeto.id }, { tipo: 'opd', id: a.opd }]);
    }
    if (a.activa) for (const id of opds) {
        const visto = proyectar(m, id).enlaces.find(v => ancla(v.enlace, a.estado));
        if (visto) negar(tx, 'estado-enlazado', 'LF-03', `El estado ${d.estado.nombre} está anclado por un enlace visible.`, [{ tipo: 'estado', id: a.estado }, { tipo: 'opd', id }, ...visto.hechos.map(id => ({ tipo: 'enlace' as const, id }))]);
    }
    if (a.opd === null) {
        tx.poner('cosas', { ...d.objeto, estados: d.objeto.estados.map(s => s.id !== a.estado ? s : a.activa ? { ...s, suprimido: true } : sin(s, 'suprimido')) });
    } else {
        const o = tx.m.opds[a.opd]!, app = o.apariciones[d.objeto.id]!, ocultos = new Set(app.ocultos ?? []);
        if (a.activa) ocultos.add(a.estado); else ocultos.delete(a.estado);
        tx.poner('opds', { ...o, apariciones: { ...o.apariciones, [d.objeto.id]: ocultos.size ? { ...app, ocultos: [...ocultos] } : sin(app, 'ocultos') } });
    }
});
