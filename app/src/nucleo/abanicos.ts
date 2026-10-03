import type { Id, Abanico, Operador, Control, Enlace } from './tipos';
import type { Operacion, Tx } from './resultado';
import { transaccion } from './resultado';
import { indice } from './indice';
import { violacionesAbanico, violacionesForma, noOfrecido } from './matriz';
function obtener(tx: Tx, id: Id): Abanico {
    const f = Object.hasOwn(tx.m.abanicos, id) ? tx.m.abanicos[id] : undefined;
    return f ?? tx.rechazar({ codigo: 'no-encontrado', regla: 'producto', mensaje: 'El abanico ya no existe.', refs: [{ tipo: 'abanico', id }] });
}
/** Validación compartida de la membresía final, incluida creación atómica con abanicoCon. */
export function validarAbanicoTx(tx: Tx, f: Abanico): void {
    if (!['XOR', 'OR'].includes(f.operador))
        tx.rechazar({ codigo: 'abanico', regla: 'F-6', mensaje: 'El operador debe ser XOR u OR.', refs: [{ tipo: 'abanico', id: f.id }] });
    for (const id of f.enlaces) {
        const otro = indice(tx.m).abanicoDeEnlace.get(id);
        if (otro && otro !== f.id)
            tx.rechazar({ codigo: 'abanico', regla: 'F-6', mensaje: 'Una rama solo puede pertenecer a un abanico.', refs: [{ tipo: 'enlace', id }, { tipo: 'abanico', id: otro }, { tipo: 'abanico', id: f.id }] });
    }
    const v = violacionesAbanico(tx.m, f)[0];
    if (v)
        tx.rechazar({ codigo: 'abanico', regla: v.regla, mensaje: v.mensaje, refs: v.refs });
    for (const id of f.enlaces) {
        const e = tx.m.enlaces[id]!, forma = violacionesForma(tx.m, e)[0];
        if (forma)
            tx.rechazar({ codigo: 'forma', regla: forma.regla, mensaje: forma.mensaje, refs: forma.refs });
        const nf = noOfrecido(tx.m, e, f);
        if (nf)
            tx.rechazar({ codigo: 'no-ofrecido', regla: nf.regla, mensaje: nf.motivo, refs: [{ tipo: 'abanico', id: f.id }, { tipo: 'enlace', id }] });
    }
}
function guardar(tx: Tx, f: Abanico) {
    validarAbanicoTx(tx, f);
    tx.poner('abanicos', f);
}
function disolver(tx: Tx, f: Abanico): void {
    tx.quitar('abanicos', f.id);
    tx.traza({ regla: 'R-FAN-GEO-2', mensaje: 'El abanico se disolvió; sus enlaces permanecen en el modelo.', refs: [{ tipo: 'abanico', id: f.id }, ...f.enlaces.map(id => ({ tipo: 'enlace' as const, id }))] });
}
export const formarAbanico: Operacion<{
    enlaces: readonly Id[];
    operador: Operador;
}> = (m, a) => transaccion(m, tx => {
    // Valida también la cardinalidad antes de reservar la identidad persistente.
    const borrador: Abanico = { id: 'f-candidato', operador: a.operador, enlaces: [...a.enlaces] };
    validarAbanicoTx(tx, borrador);
    guardar(tx, { ...borrador, id: tx.nuevoId('f') });
});
export const fijarOperador: Operacion<{
    abanico: Id;
    operador: Operador;
}> = (m, a) => transaccion(m, tx => guardar(tx, { ...obtener(tx, a.abanico), operador: a.operador }));
export const agregarRama: Operacion<{
    abanico: Id;
    enlace: Id;
}> = (m, a) => transaccion(m, tx => {
    const f = obtener(tx, a.abanico);
    guardar(tx, { ...f, enlaces: [...f.enlaces, a.enlace] });
});
export const quitarRama: Operacion<{
    abanico: Id;
    enlace: Id;
}> = (m, a) => transaccion(m, tx => {
    const f = obtener(tx, a.abanico);
    if (!f.enlaces.includes(a.enlace))
        tx.rechazar({ codigo: 'no-encontrado', regla: 'producto', mensaje: 'El enlace no es rama de este abanico.', refs: [{ tipo: 'abanico', id: f.id }, { tipo: 'enlace', id: a.enlace }] });
    const enlaces = f.enlaces.filter(id => id !== a.enlace);
    if (enlaces.length < 2)
        disolver(tx, f);
    else
        guardar(tx, { ...f, enlaces });
});
export const disolverAbanico: Operacion<{
    abanico: Id;
}> = (m, a) => transaccion(m, tx => disolver(tx, obtener(tx, a.abanico)));
export const fijarControlAbanico: Operacion<{
    abanico: Id;
    control: Control | null;
}> = (m, a) => transaccion(m, tx => {
    const f = obtener(tx, a.abanico);
    for (const id of f.enlaces) {
        const e = tx.m.enlaces[id]!;
        if (!e)
            tx.rechazar({ codigo: 'abanico', regla: 'F-6', mensaje: 'La rama ya no existe.', refs: [{ tipo: 'enlace', id }, { tipo: 'abanico', id: f.id }] });
        const campos = { ...e } as Enlace & {
            control?: Control;
        };
        if (a.control === null)
            delete campos.control;
        else
            campos.control = a.control;
        const v = violacionesForma(tx.m, campos)[0];
        if (v)
            tx.rechazar({ codigo: 'forma', regla: v.regla, mensaje: v.mensaje, refs: v.refs });
        tx.poner('enlaces', campos);
    }
    validarAbanicoTx(tx, f);
});
