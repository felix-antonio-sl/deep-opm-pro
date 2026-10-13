import { test, expect } from 'bun:test';
import { modeloCon, porNombre } from '../pruebas/constructores';
import { aplicarAccion } from './operaciones';
import type { Accion } from './operaciones';
import type { Modelo, Aparicion } from './tipos';
import { validarForma } from './forma';
const base = modeloCon({ objetos: [['Alfa', []], ['Beta', []], ['Fuera', []]] });
const a = porNombre(base, 'Alfa').id, b = porNombre(base, 'Beta').id, fuera = porNombre(base, 'Fuera').id;
function cajas(primera: Partial<Aparicion>, segunda: Partial<Aparicion> = {}): Modelo {
    const apariciones = { ...base.opds[base.raiz]!.apariciones };
    delete apariciones[fuera];
    return { ...base, opds: { [base.raiz]: { ...base.opds[base.raiz]!, apariciones: {
        ...apariciones, [a]: { ...apariciones[a]!, ...primera }, [b]: { ...apariciones[b]!, ...segunda },
    } } } };
}
const acciones: Accion[] = [
    { op: 'crearCosa', args: { opd: base.raiz, tipo: 'objeto', nombre: 'Nueva', x: 0, y: 0 } },
    { op: 'traerCosa', args: { opd: base.raiz, cosa: fuera, x: 24, y: 36 } },
    { op: 'moverApariciones', args: { opd: base.raiz, mover: [{ cosa: b, x: 24, y: 36 }] } },
];
for (const [nombre, cambio] of [
    ['ancho bajo20', { ancho: 19 }], ['alto fraccionario', { alto: 20.5 }],
    ['x nofinita', { x: Infinity }], ['y NaN', { y: NaN }],
] as const) test(`T-011 T-022 F-12 crear traer mover no dispensan caja ajena inválida: ${nombre}`, () => {
    const m = cajas(cambio), antes = structuredClone(m);
    for (const accion of acciones) {
        expect(aplicarAccion(m, accion)).toEqual({ ok: false, rechazo: { codigo: 'forma', regla: 'F-12',
            mensaje: 'La caja requiere enteros finitos y tamaños ≥20.', refs: [{ tipo: 'opd', id: base.raiz }, { tipo: 'cosa', id: a }] } });
        expect(m).toEqual(antes); expect(m.secuencia).toBe(base.secuencia);
    }
});
test('T-011 T-022 F-12 tamaños20 y coordenadas negativas enteras se admiten, IDs y creación efectivos', () => {
    const m = cajas({ ancho: 20, alto: 20, x: -1, y: -1 });
    expect(validarForma(m)).toEqual([]);
    for (const accion of acciones) {
        const antes = structuredClone(m), r = aplicarAccion(m, accion);
        expect(r.ok).toBe(true); if (!r.ok) throw Error(r.rechazo.mensaje);
        expect(validarForma(r.valor.modelo)).toEqual([]); expect(m).toEqual(antes);
        expect(r.valor.modelo.cosas[a]?.id).toBe(a);
    }
});
test('T-011 T-022 F-12 reparar posición de una caja no dispensa la segunda inválida, rollback íntegro', () => {
    const m = cajas({ x: NaN }, { ancho: 19 }), antes = structuredClone(m);
    const r = aplicarAccion(m, { op: 'moverApariciones', args: { opd: base.raiz, mover: [{ cosa: a, x: 0, y: 0 }] } });
    expect(r).toEqual({ ok: false, rechazo: { codigo: 'forma', regla: 'F-12', mensaje: 'La caja requiere enteros finitos y tamaños ≥20.',
        refs: [{ tipo: 'opd', id: base.raiz }, { tipo: 'cosa', id: b }] } });
    expect(m).toEqual(antes);
});
test('T-011 T-022 F-12 primera violación conserva recorrido por ID de valor, incluso clave e ID duplicados', () => {
    const raiz = cajas({}, { ancho: 19 });
    const m: Modelo = { ...raiz, opds: { otra: { ...base.opds[base.raiz]!, apariciones: { [a]: { ...base.opds[base.raiz]!.apariciones[a]!, x: NaN } } }, ...raiz.opds } };
    const antes = structuredClone(m);
    expect(validarForma(m).map(v => [v.regla, v.refs])).toEqual([
        ['F-7', [{ tipo: 'opd', id: base.raiz }]],
        ['F-9', [{ tipo: 'opd', id: base.raiz }]],
        ['F-12', [{ tipo: 'opd', id: base.raiz }, { tipo: 'cosa', id: a }]],
        ['F-9', [{ tipo: 'opd', id: base.raiz }]],
        ['F-12', [{ tipo: 'opd', id: base.raiz }, { tipo: 'cosa', id: b }]],
    ]);
    expect(aplicarAccion(m, acciones[0]!)).toEqual({ ok: false, rechazo: { codigo: 'forma', regla: 'F-12',
        mensaje: 'La caja requiere enteros finitos y tamaños ≥20.', refs: [{ tipo: 'opd', id: base.raiz }, { tipo: 'cosa', id: a }] } });
    expect(m).toEqual(antes);
});
