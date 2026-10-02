import { test, expect } from 'bun:test';
import * as e from './estados';
import { modeloCon, congelar } from '../pruebas/constructores';
import { validarForma } from './forma';
import { proyectar } from './proyeccion';
import type { Modelo, Objeto, Enlace, OpdDescomposicion } from './tipos';
import type { Hecho, Respuesta, CodigoRechazo } from './resultado';

function bien(r: Respuesta<Hecho>): Modelo {
    expect(r.ok).toBe(true);
    if (!r.ok) throw new Error(r.rechazo.mensaje);
    expect(validarForma(r.valor.modelo)).toEqual([]);
    return r.valor.modelo;
}
function rechazo(r: Respuesta<Hecho>, codigo: CodigoRechazo, regla?: string) {
    expect(r.ok).toBe(false);
    if (r.ok) throw new Error('Se esperaba rechazo');
    expect(r.rechazo.codigo).toBe(codigo);
    expect(r.rechazo.regla).toBe(regla ?? r.rechazo.regla);
    expect(r.rechazo.refs.length).toBeGreaterThan(0);
}
const objeto = (m: Modelo, id = 'o-2') => m.cosas[id] as Objeto;
function conEnlace(m: Modelo, enlace: Enlace): Modelo {
    return congelar({ ...m, enlaces: { ...m.enlaces, [enlace.id]: enlace }, secuencia: Math.max(m.secuencia, Number(enlace.id.slice(2)) + 1) });
}
test('T-015 agrega único estado propio, posición, ID y original inmutable', () => {
    const m = modeloCon({ objetos: [['Pedido', []]] }), snapshot = JSON.stringify(m);
    const r = e.agregarEstado(m, { objeto: 'o-2', nombre: 'listo' });
    const n = bien(r);
    expect(objeto(n).estados).toEqual([{ id: 's-3', nombre: 'listo' }]);
    if (r.ok) expect(r.valor.creados).toEqual(['s-3']);
    const q = bien(e.agregarEstado(congelar(n), { objeto: 'o-2', nombre: 'nuevo', indice: 0 }));
    expect(objeto(q).estados.map(s => s.id)).toEqual(['s-4', 's-3']);
    expect(JSON.stringify(m)).toBe(snapshot);
});
test('T-015 léxico y unicidad solo por objeto, nunca capitaliza estado', () => {
    const m = modeloCon({ objetos: [['Pedido', ['listo']], ['Factura', ['lista']]] });
    rechazo(e.agregarEstado(m, { objeto: 'o-2', nombre: 'Listo' }), 'lexico', 'R-§18-LEX-1');
    rechazo(e.agregarEstado(m, { objeto: 'o-2', nombre: 'listo' }), 'unicidad-nominal');
    expect(objeto(bien(e.agregarEstado(m, { objeto: 'o-4', nombre: 'listo' })), 'o-4').estados.map(s => s.nombre)).toEqual(['lista', 'listo']);
});
test('T-059 procesos no reciben estados, referencia y posición inválidas rechazan', () => {
    const m = modeloCon({ objetos: [['Pedido', ['listo']]], procesos: ['Procesar'] });
    rechazo(e.agregarEstado(m, { objeto: 'p-4', nombre: 'listo' }), 'tipo-incompatible');
    rechazo(e.agregarEstado(m, { objeto: 'o-99', nombre: 'listo' }), 'no-encontrado');
    rechazo(e.agregarEstado(m, { objeto: 'o-2', nombre: 'nuevo', indice: 7 }), 'forma');
    rechazo(e.moverEstado(m, { estado: 's-3', indice: -1 }), 'forma');
});
test('T-015 renombra y mueve conservando dueño, ID y secuencia', () => {
    const m = modeloCon({ objetos: [['Pedido', ['nuevo', 'listo', 'finalizado']]] });
    const n = bien(e.renombrarEstado(m, { estado: 's-3', nombre: 'iniciado' }));
    expect(objeto(n).estados[0]).toEqual({ id: 's-3', nombre: 'iniciado' });
    rechazo(e.renombrarEstado(m, { estado: 's-3', nombre: 'listo' }), 'unicidad-nominal');
    const q = bien(e.moverEstado(congelar(n), { estado: 's-3', indice: 2 }));
    expect(objeto(q).estados.map(s => s.id)).toEqual(['s-4', 's-5', 's-3']);
    expect(q.secuencia).toBe(m.secuencia);
});
test('T-016 inicial/final combinables y múltiples; default/current exclusivos con traza', () => {
    const original = modeloCon({ objetos: [['Pedido', ['nuevo', 'listo']]] });
    let m = original;
    for (const estado of ['s-3', 's-4']) for (const designacion of ['inicial', 'final'] as const)
        m = bien(e.designar(congelar(m), { estado, designacion, activa: true }));
    expect(objeto(m).estados.every(s => s.inicial && s.final)).toBe(true);
    for (const designacion of ['porDefecto', 'current'] as const) {
        m = bien(e.designar(congelar(m), { estado: 's-3', designacion, activa: true }));
        const r = e.designar(congelar(m), { estado: 's-4', designacion, activa: true });
        m = bien(r); expect(objeto(m)[designacion]).toBe('s-4');
        if (r.ok) expect(r.trazas.some(t => t.refs.some(x => x.id === 's-3') && t.refs.some(x => x.id === 's-4'))).toBe(true);
        m = bien(e.designar(congelar(m), { estado: 's-3', designacion, activa: false }));
        expect(objeto(m)[designacion]).toBe('s-4');
        m = bien(e.designar(congelar(m), { estado: 's-4', designacion, activa: false }));
        expect(objeto(m)).not.toHaveProperty(designacion);
    }
    expect(objeto(original).estados).toEqual([{ id: 's-3', nombre: 'nuevo' }, { id: 's-4', nombre: 'listo' }]);
});
test('T-248 DS-20 designar resultado inicial rechaza, error previo no bloquea metadata', () => {
    const m = conEnlace(modeloCon({ objetos: [['Pedido', ['listo']]], procesos: ['Procesar'] }), { id: 'e-5', tipo: 'resultado', objeto: 'o-2', proceso: 'p-4', estado: 's-3' });
    rechazo(e.designar(m, { estado: 's-3', designacion: 'inicial', activa: true }), 'contexto', 'R-RES-1');
    const malo = congelar({ ...m, cosas: { ...m.cosas, 'o-2': { ...objeto(m), estados: [{ ...objeto(m).estados[0]!, inicial: true as const }] } } });
    expect(objeto(bien(e.renombrarEstado(malo, { estado: 's-3', nombre: 'terminado' }))).estados[0]?.inicial).toBe(true);
    expect(objeto(bien(e.designar(malo, { estado: 's-3', designacion: 'inicial', activa: false }))).estados[0]).not.toHaveProperty('inicial');
});
test('T-015 borrar estado limpia designaciones/ocultos y conserva TS1 como T1 con traza', () => {
    const base = conEnlace(modeloCon({ objetos: [['Pedido', ['nuevo', 'listo']]], procesos: ['Procesar'] }), { id: 'e-6', tipo: 'consumo', objeto: 'o-2', proceso: 'p-5', estado: 's-3' });
    const m = congelar({ ...base, cosas: { ...base.cosas, 'o-2': { ...objeto(base), porDefecto: 's-3', current: 's-3' } }, opds: { ...base.opds, 'opd-1': { ...base.opds['opd-1']!, apariciones: { ...base.opds['opd-1']!.apariciones, 'o-2': { ...base.opds['opd-1']!.apariciones['o-2']!, ocultos: ['s-3', 's-4'] } } } } });
    const r = e.eliminarEstado(m, { estado: 's-3' }), n = bien(r);
    expect(n.enlaces['e-6']).toEqual({ id: 'e-6', tipo: 'consumo', objeto: 'o-2', proceso: 'p-5' });
    expect(objeto(n).estados.map(s => s.id)).toEqual(['s-4']);
    expect(objeto(n)).not.toHaveProperty('current'); expect(objeto(n)).not.toHaveProperty('porDefecto');
    expect(n.opds['opd-1']!.apariciones['o-2']!.ocultos).toEqual(['s-4']);
    if (r.ok) expect(r.trazas.some(t => t.refs.some(x => x.id === 'e-6'))).toBe(true);
});
test('T-048 borrar entrada TS3 conserva salida TS5 y ID', () => {
    const m = conEnlace(modeloCon({ objetos: [['Pedido', ['nuevo', 'listo']]], procesos: ['Procesar'] }), { id: 'e-6', tipo: 'efecto', objeto: 'o-2', proceso: 'p-5', entrada: 's-3', salida: 's-4' });
    expect(bien(e.eliminarEstado(m, { estado: 's-3' })).enlaces['e-6']).toEqual({ id: 'e-6', tipo: 'efecto', objeto: 'o-2', proceso: 'p-5', salida: 's-4' });
});
test('T-048 último estado que sustenta T3 devuelve código específico compartido', () => {
    const m = conEnlace(modeloCon({ objetos: [['Pedido', ['listo']]], procesos: ['Procesar'] }), { id: 'e-5', tipo: 'efecto', objeto: 'o-2', proceso: 'p-4' });
    rechazo(e.eliminarEstado(m, { estado: 's-3' }), 'efecto-sin-estados', 'R-EFE-1');
    expect(objeto(m).estados).toHaveLength(1);
});
test('T-093 último estado heredado invalida efecto del especial, otro general lo sustenta', () => {
    const base = modeloCon({ objetos: [['General', ['listo']], ['Especial', []], ['Otro', ['activo']]], procesos: ['Procesar'], enlaces: [['generalizacion', 'General', 'Especial'], ['efecto', 'Especial', 'Procesar']] });
    rechazo(e.eliminarEstado(base, { estado: 's-3' }), 'efecto-sin-estados', 'R-EFE-1');
    const multiple = conEnlace(base, { id: 'e-10', tipo: 'generalizacion', refinable: 'o-5', refinador: 'o-4' });
    expect(objeto(bien(e.eliminarEstado(multiple, { estado: 's-3' }))).estados).toEqual([]);
});
test('T-018 suprimir global/local conserva estado y no fabrica anclajes', () => {
    const m = modeloCon({ objetos: [['Pedido', ['listo']]] });
    const n = bien(e.suprimirEstado(m, { estado: 's-3', opd: 'opd-1', activa: true }));
    expect(n.opds['opd-1']!.apariciones['o-2']!.ocultos).toEqual(['s-3']);
    expect(proyectar(n, 'opd-1').cosas[0]?.estadosVisibles).toEqual([]);
    expect(objeto(n).estados[0]).not.toHaveProperty('suprimido');
    const q = bien(e.suprimirEstado(congelar(n), { estado: 's-3', opd: null, activa: true }));
    expect(objeto(q).estados[0]?.suprimido).toBe(true);
    let restaurado = bien(e.suprimirEstado(congelar(q), { estado: 's-3', opd: null, activa: false }));
    restaurado = bien(e.suprimirEstado(congelar(restaurado), { estado: 's-3', opd: 'opd-1', activa: false }));
    expect(objeto(restaurado).estados).toEqual(objeto(m).estados);
    expect(restaurado.opds['opd-1']!.apariciones['o-2']).not.toHaveProperty('ocultos');
});
test('T-018 LF-03 usa proyección real: anclaje visible rechaza, enlace sin vista no', () => {
    const m = conEnlace(modeloCon({ objetos: [['Pedido', ['listo']]], procesos: ['Procesar'] }), { id: 'e-5', tipo: 'consumo', objeto: 'o-2', proceso: 'p-4', estado: 's-3' });
    rechazo(e.suprimirEstado(m, { estado: 's-3', opd: 'opd-1', activa: true }), 'estado-enlazado', 'LF-03');
    rechazo(e.suprimirEstado(m, { estado: 's-3', opd: null, activa: true }), 'estado-enlazado', 'LF-03');
    const { 'p-4': eliminado, ...apps } = m.opds['opd-1']!.apariciones; void eliminado;
    const invisible = congelar({ ...m, opds: { 'opd-1': { ...m.opds['opd-1']!, apariciones: apps } } });
    expect(objeto(bien(e.suprimirEstado(invisible, { estado: 's-3', opd: null, activa: true }))).estados[0]?.suprimido).toBe(true);
});
test('T-018 supresión local exige aparición propia y rechazo útil de referencias', () => {
    const m = modeloCon({ objetos: [['Pedido', ['listo']]] });
    rechazo(e.suprimirEstado(m, { estado: 's-3', opd: 'opd-99', activa: true }), 'no-encontrado');
    rechazo(e.renombrarEstado(m, { estado: 's-99', nombre: 'listo' }), 'no-encontrado');
    rechazo(e.designar(m, { estado: 's-99', designacion: 'current', activa: true }), 'no-encontrado');
});
for (const tipo of ['consumo', 'resultado', 'agente', 'instrumento', 'efecto', 'generalizacion', 'etiquetado', 'etiquetadoBidireccional', 'reciproco'] as const) {
    test(`T-015 retiro de anclaje conserva hecho e identidad: ${tipo}`, () => {
        const base = modeloCon({ objetos: [['General', ['nuevo', 'listo']], ['Especial', ['activo']]], procesos: ['Procesar'] });
        const e1: Enlace = tipo === 'efecto' ? { id: 'e-8', tipo, objeto: 'o-2', proceso: 'p-7', entrada: 's-3', salida: 's-4' }
            : tipo === 'generalizacion' ? { id: 'e-8', tipo, refinable: 'o-2', refinador: 'o-5', estados: { general: 's-3', especializacion: 's-6' } }
            : tipo === 'reciproco' ? { id: 'e-8', tipo, origen: 'o-2', destino: 'o-5', etiqueta: 'conoce', estados: { origen: 's-3', destino: 's-6' } }
            : tipo === 'etiquetadoBidireccional' ? { id: 'e-8', tipo, origen: 'o-2', destino: 'o-5', etiqueta: 'conoce', inversa: 'es-conocido', estadoOrigen: 's-3' }
            : tipo === 'etiquetado' ? { id: 'e-8', tipo, origen: 'o-2', destino: 'o-5', estadoOrigen: 's-3', estadoDestino: 's-6' }
            : { id: 'e-8', tipo, objeto: 'o-2', proceso: 'p-7', estado: 's-3' };
        const m = conEnlace(base, e1); expect(validarForma(m)).toEqual([]);
        const n = bien(e.eliminarEstado(m, { estado: 's-3' }));
        const esperado: Enlace = tipo === 'efecto' ? { id: 'e-8', tipo, objeto: 'o-2', proceso: 'p-7', salida: 's-4' }
            : tipo === 'generalizacion' ? { id: 'e-8', tipo, refinable: 'o-2', refinador: 'o-5' }
            : tipo === 'reciproco' ? { id: 'e-8', tipo, origen: 'o-2', destino: 'o-5', etiqueta: 'conoce' }
            : tipo === 'etiquetadoBidireccional' ? { id: 'e-8', tipo, origen: 'o-2', destino: 'o-5', etiqueta: 'conoce', inversa: 'es-conocido' }
            : tipo === 'etiquetado' ? { id: 'e-8', tipo, origen: 'o-2', destino: 'o-5', estadoDestino: 's-6' }
            : { id: 'e-8', tipo, objeto: 'o-2', proceso: 'p-7' };
        expect(n.enlaces['e-8']).toEqual(esperado);
        expect(n.secuencia).toBe(m.secuencia);
    });
}
test('T-015 retiro solo destino recíproco conserva origen; especialización pierde par completo', () => {
    const base = modeloCon({ objetos: [['General', ['listo']], ['Especial', ['activo']]] });
    const r = conEnlace(base, { id: 'e-6', tipo: 'reciproco', origen: 'o-2', destino: 'o-4', etiqueta: 'conoce', estados: { origen: 's-3', destino: 's-5' } });
    expect(validarForma(r)).toEqual([]);
    expect(bien(e.eliminarEstado(r, { estado: 's-5' })).enlaces['e-6']).toEqual({ id: 'e-6', tipo: 'reciproco', origen: 'o-2', destino: 'o-4', etiqueta: 'conoce', estados: { origen: 's-3' } });
    const g = conEnlace(base, { id: 'e-6', tipo: 'generalizacion', refinable: 'o-2', refinador: 'o-4', estados: { general: 's-3', especializacion: 's-5' } });
    expect(bien(e.eliminarEstado(g, { estado: 's-5' })).enlaces['e-6']).not.toHaveProperty('estados');
});
function abstracto(): Modelo {
    const m = modeloCon({ objetos: [['Pedido', ['nuevo', 'listo']]], procesos: ['Procesar', 'Iniciar', 'Terminar'] });
    const root = m.opds['opd-1']!;
    const o: OpdDescomposicion = { id: 'opd-8', tipo: 'descomposicion', padre: 'opd-1', cosa: 'p-5', orden: 0, bandas: [['p-6'], ['p-7']], objetosInternos: [], apariciones: {
        'o-2': { x: -200, y: 0, ancho: 135, alto: 60 }, 'p-5': { x: 0, y: 0, ancho: 420, alto: 288 }, 'p-6': { x: 100, y: 64, ancho: 135, alto: 60 }, 'p-7': { x: 100, y: 164, ancho: 135, alto: 60 },
    } };
    return congelar({ ...m, opds: { 'opd-1': { ...root, apariciones: { 'o-2': root.apariciones['o-2']!, 'p-5': root.apariciones['p-5']! } }, 'opd-8': o }, enlaces: {
        'e-9': { id: 'e-9', tipo: 'consumo', objeto: 'o-2', proceso: 'p-6', estado: 's-3' },
    }, secuencia: 10 });
}
test('T-018 LF-03 impide supresión del anclaje abstracto en padre con refs reales', () => {
    const m = abstracto(); expect(validarForma(m)).toEqual([]);
    const vista = proyectar(m, 'opd-1');
    expect(vista.enlaces[0]?.abstraido).toBe(true);
    expect(vista.enlaces[0]?.hechos).toEqual(['e-9']);
    const r = e.suprimirEstado(m, { estado: 's-3', opd: 'opd-1', activa: true });
    rechazo(r, 'estado-enlazado', 'LF-03');
    if (!r.ok) expect(r.rechazo.refs).toContainEqual({ tipo: 'enlace', id: 'e-9' });
    rechazo(e.suprimirEstado(m, { estado: 's-3', opd: null, activa: true }), 'estado-enlazado', 'LF-03');
});
test('T-018 LF-03 permite ocultar anclaje débil descartado por fuerza en padre, pero global no', () => {
    const base = abstracto();
    const debil = congelar({ ...base, enlaces: {
        'e-9': { id: 'e-9', tipo: 'efecto' as const, objeto: 'o-2', proceso: 'p-6', entrada: 's-3' },
        'e-10': { id: 'e-10', tipo: 'resultado' as const, objeto: 'o-2', proceso: 'p-7', estado: 's-4' },
    }, secuencia: 11 });
    expect(validarForma(debil)).toEqual([]);
    // §4.6-4 dice literalmente E+R da R: solo se retiene el estado de R en padre.
    expect(proyectar(debil, 'opd-1').enlaces[0]?.enlace).toMatchObject({ tipo: 'resultado', estado: 's-4' });
    const r = e.suprimirEstado(debil, { estado: 's-3', opd: 'opd-1', activa: true });
    const n = bien(r);
    expect(n.opds['opd-1']!.apariciones['o-2']!.ocultos).toEqual(['s-3']);
    expect(proyectar(n, 'opd-1').cosas.find(c => c.cosa === 'o-2')?.estadosVisibles).toEqual(['s-4']);
    expect(objeto(n).estados).toHaveLength(2);
    expect(debil.opds['opd-1']!.apariciones['o-2']).not.toHaveProperty('ocultos');
    rechazo(e.suprimirEstado(debil, { estado: 's-3', opd: null, activa: true }), 'estado-enlazado', 'LF-03');
});
test('T-093 estados propios del especial sostienen T3 tras borrar el último del general', () => {
    const m = modeloCon({ objetos: [['General', ['listo']], ['Especial', ['activo']]], procesos: ['Procesar'], enlaces: [['generalizacion', 'General', 'Especial'], ['efecto', 'Especial', 'Procesar']] });
    expect(objeto(bien(e.eliminarEstado(m, { estado: 's-3' })), 'o-4').estados).toEqual([{ id: 's-5', nombre: 'activo' }]);
});
test('T-015 borrar estado desconocido y suprimir sin aparición rechazan sin mutar', () => {
    const m = modeloCon({ objetos: [['Pedido', ['listo']]] });
    rechazo(e.eliminarEstado(m, { estado: 's-99' }), 'no-encontrado');
    const invisible = congelar({ ...m, opds: { 'opd-1': { ...m.opds['opd-1']!, apariciones: {} } } });
    rechazo(e.suprimirEstado(invisible, { estado: 's-3', opd: 'opd-1', activa: true }), 'no-visible');
});
test('T-074 borrar anclaje de mitad escindida retira metadata bilateral y conserva hechos', () => {
    const base = abstracto();
    const m = congelar({ ...base, enlaces: {
        'e-9': { id: 'e-9', tipo: 'efecto' as const, objeto: 'o-2', proceso: 'p-6', entrada: 's-3', escision: { par: 'e-10', mitad: 'entrada' as const } },
        'e-10': { id: 'e-10', tipo: 'efecto' as const, objeto: 'o-2', proceso: 'p-7', salida: 's-4', escision: { par: 'e-9', mitad: 'salida' as const } },
    }, secuencia: 11 });
    expect(validarForma(m)).toEqual([]);
    const n = bien(e.eliminarEstado(m, { estado: 's-3' }));
    expect(n.enlaces['e-9']).toEqual({ id: 'e-9', tipo: 'efecto', objeto: 'o-2', proceso: 'p-6' });
    expect(n.enlaces['e-10']).toEqual({ id: 'e-10', tipo: 'efecto', objeto: 'o-2', proceso: 'p-7', salida: 's-4' });
    expect(objeto(n).estados).toEqual([{ id: 's-4', nombre: 'listo' }]);
});
test('T-054 eliminar estado no publica abanico mixto NO_OFRECIDO por matriz real', () => {
    const base = modeloCon({ objetos: [['Pedido', ['nuevo', 'listo', 'terminado']]], procesos: ['Procesar'] });
    const m = congelar({ ...base, enlaces: {
        'e-7': { id: 'e-7', tipo: 'efecto' as const, objeto: 'o-2', proceso: 'p-6', entrada: 's-3', salida: 's-4' },
        'e-8': { id: 'e-8', tipo: 'efecto' as const, objeto: 'o-2', proceso: 'p-6', entrada: 's-3', salida: 's-5' },
    }, abanicos: { 'f-9': { id: 'f-9', operador: 'XOR' as const, enlaces: ['e-7', 'e-8'] } }, secuencia: 10 });
    expect(validarForma(m)).toEqual([]);
    const original = JSON.stringify(m);
    rechazo(e.eliminarEstado(m, { estado: 's-4' }), 'no-ofrecido', 'R-FAN-5/5A');
    expect(JSON.stringify(m)).toBe(original);
});
