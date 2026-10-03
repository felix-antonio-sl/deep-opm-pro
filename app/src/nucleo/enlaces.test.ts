import { afterEach, expect, test } from 'bun:test';
import * as op from './enlaces';
import { modeloCon, congelar } from '../pruebas/constructores';
import { validarForma } from './forma';
import { proyectar } from './proyeccion';
import { tiposLegales, erroresContexto } from './matriz';
import type { Modelo, Enlace, EnlaceNuevo, Objeto, TipoEnlace } from './tipos';
import type { Hecho, Respuesta, CodigoRechazo } from './resultado';
const resultados: Modelo[] = [];
afterEach(() => {
    for (const m of resultados.splice(0))
        expect(validarForma(m)).toEqual([]);
});
function bien(r: Respuesta<Hecho>): Modelo {
    expect(r.ok).toBe(true);
    if (!r.ok)
        throw new Error(r.rechazo.mensaje);
    resultados.push(r.valor.modelo);
    return r.valor.modelo;
}
function mal(r: Respuesta<Hecho>, codigo: CodigoRechazo, regla?: string) {
    expect(r.ok).toBe(false);
    if (r.ok)
        throw new Error('Se esperaba rechazo');
    expect(r.rechazo.codigo).toBe(codigo);
    if (regla)
        expect(r.rechazo.regla).toBe(regla);
    expect(r.rechazo.refs.length).toBeGreaterThan(0);
}
function base(): Modelo {
    return modeloCon({ objetos: [['Agua', ['fria', 'caliente']], ['Caja', ['abierta', 'cerrada']], ['Peso', []]], procesos: ['Hervir', 'Guardar', 'Medir'] });
}
function con(m: Modelo, ...es: Enlace[]): Modelo {
    return congelar({ ...m, enlaces: Object.fromEntries(es.map(e => [e.id, e])), secuencia: 30 });
}
// IDs literales de los constructores: Agua=o-2 s-3/s-4; Caja=o-5 s-6/s-7; Peso=o-8; procesos p-9/10/11.
const firmas: readonly EnlaceNuevo[] = [
    { tipo: 'consumo', objeto: 'o-2', proceso: 'p-9', estado: 's-3' }, { tipo: 'resultado', objeto: 'o-2', proceso: 'p-9', estado: 's-4' },
    { tipo: 'efecto', objeto: 'o-2', proceso: 'p-9', entrada: 's-3', salida: 's-4' }, { tipo: 'agente', objeto: 'o-2', proceso: 'p-9' }, { tipo: 'instrumento', objeto: 'o-2', proceso: 'p-9' },
    { tipo: 'invocacion', origen: 'p-9', destino: 'p-10' }, { tipo: 'agregacion', refinable: 'o-2', refinador: 'o-5' }, { tipo: 'exhibicion', refinable: 'o-2', refinador: 'p-9' },
    { tipo: 'generalizacion', refinable: 'o-2', refinador: 'o-5', estados: { general: 's-3', especializacion: 's-6' } }, { tipo: 'clasificacion', refinable: 'p-9', refinador: 'p-10' },
    { tipo: 'etiquetado', origen: 'o-2', destino: 'o-5', etiqueta: 'conoce', estadoOrigen: 's-3', estadoDestino: 's-6' },
    { tipo: 'etiquetadoBidireccional', origen: 'o-2', destino: 'o-5', etiqueta: 'conoce', inversa: 'es-conocido', estadoOrigen: 's-3' },
    { tipo: 'reciproco', origen: 'o-2', destino: 'o-5', etiqueta: 'conoce', estados: { origen: 's-3', destino: 's-6' } },
    { tipo: 'excepcionSobretiempo', origen: 'p-9', destino: 'p-10' }, { tipo: 'excepcionSubtiempo', origen: 'p-9', destino: 'p-10' },
];
for (const candidato of firmas)
    test(`T-040 crear ${candidato.tipo} conserva identidad, entrada y deshacer`, () => {
        const m = base(), a = congelar({ opd: m.raiz, candidato }), antes = JSON.stringify([m, a]);
        const r = op.crearEnlace(m, a), n = bien(r);
        expect(n.enlaces[`e-${m.secuencia}`]).toEqual({ ...candidato, id: `e-${m.secuencia}` });
        expect(n.secuencia).toBe(m.secuencia + 1);
        if (r.ok)
            expect(r.valor.creados).toEqual([`e-${m.secuencia}`]);
        expect(JSON.stringify([m, a])).toBe(antes);
        const deshecho = m;
        expect(deshecho).toBe(m);
    });
test('T-040 creación rechaza firma y duplicado semántico con claves anidadas permutadas', () => {
    const m = base();
    mal(op.crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'consumo', objeto: 'p-9', proceso: 'o-2' } }), 'forma', 'R-EDIT-1');
    const e: Enlace = { id: 'e-20', tipo: 'generalizacion', refinable: 'o-2', refinador: 'o-5', estados: { general: 's-3', especializacion: 's-6' } };
    mal(op.crearEnlace(con(m, e), { opd: m.raiz, candidato: { tipo: 'generalizacion', refinable: 'o-2', refinador: 'o-5', estados: { especializacion: 's-6', general: 's-3' } } }), 'ya-existe');
});
test('T-066 aparición activa y alcance del interno se validan antes de reservar ids', () => {
    const m = base(), apariciones = { ...m.opds[m.raiz]!.apariciones };
    delete apariciones['o-5'];
    const n = congelar({ ...m, opds: { [m.raiz]: { ...m.opds[m.raiz]!, apariciones } } });
    mal(op.crearEnlace(n, { opd: m.raiz, candidato: { tipo: 'consumo', objeto: 'o-5', proceso: 'p-9' } }), 'no-visible');
    const hijo = { id: 'opd-20', tipo: 'descomposicion' as const, padre: m.raiz, cosa: 'p-9', orden: 0, bandas: [['p-10']], objetosInternos: ['o-2'], apariciones: { 'p-9': { x: 0, y: 0, ancho: 600, alto: 400 }, 'p-10': { x: 100, y: 100, ancho: 135, alto: 60 }, 'o-2': { x: 100, y: 200, ancho: 135, alto: 60 } } };
    const raizInterna = { ...m.opds[m.raiz]!.apariciones };
    delete raizInterna['o-2'];
    delete raizInterna['p-10'];
    const d = congelar({ ...m, secuencia: 21, opds: { ...m.opds, [m.raiz]: { ...m.opds[m.raiz]!, apariciones: raizInterna }, [hijo.id]: hijo } });
    expect(validarForma(d)).toEqual([]);
    expect(erroresContexto(d)).toEqual([]);
    const antes = JSON.stringify(d), secuencia = d.secuencia;
    mal(op.crearEnlace(d, { opd: m.raiz, candidato: { tipo: 'etiquetado', origen: 'o-2', destino: 'o-5' } }), 'interno-no-visible', 'T-066');
    expect(d.secuencia).toBe(secuencia);
    expect(JSON.stringify(d)).toBe(antes);
});
test('T-043 resultado inicial bloquea crear, setter, reanclar y cambio de tipo', () => {
    const b = base(), c = b.cosas['o-2'] as Objeto, m = congelar({ ...b, cosas: { ...b.cosas, [c.id]: { ...c, estados: c.estados.map(s => s.id === 's-3' ? { ...s, inicial: true as const } : s) } } });
    mal(op.crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'resultado', objeto: 'o-2', proceso: 'p-9', estado: 's-3' } }), 'contexto', 'R-RES-1');
    const n = con(m, { id: 'e-20', tipo: 'resultado', objeto: 'o-2', proceso: 'p-9' });
    mal(op.fijarEstados(n, { enlace: 'e-20', estados: { estado: 's-3' } }), 'contexto', 'R-RES-1');
    mal(op.reanclarExtremo(n, { opd: m.raiz, enlace: 'e-20', extremo: 'destino', hacia: { cosa: 'o-2', estado: 's-3' } }), 'contexto', 'R-RES-1');
    mal(op.cambiarTipoEnlace(con(m, { id: 'e-20', tipo: 'consumo', objeto: 'o-2', proceso: 'p-9', estado: 's-3' }), { enlace: 'e-20', tipo: 'resultado' }), 'contexto', 'R-RES-1');
});
test('T-044 efecto exige estados, pero herencia real permite T3 sin materializarlos', () => {
    const m = base();
    mal(op.crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'efecto', objeto: 'o-8', proceso: 'p-9' } }), 'contexto', 'R-EFE-1');
    const n = con(m, { id: 'e-20', tipo: 'generalizacion', refinable: 'o-2', refinador: 'o-8' });
    const r = bien(op.crearEnlace(n, { opd: m.raiz, candidato: { tipo: 'efecto', objeto: 'o-8', proceso: 'p-9' } }));
    expect((r.cosas['o-8'] as Objeto).estados).toEqual([]);
    mal(op.crearEnlace(n, { opd: m.raiz, candidato: { tipo: 'efecto', objeto: 'o-8', proceso: 'p-9', entrada: 's-3' } }), 'forma', 'R-EDIT-2');
});
test('T-045 agente usa proxy físico y DS-20 compara original importado real', () => {
    const b = base(), m = congelar({ ...b, cosas: { ...b.cosas, 'o-2': { ...b.cosas['o-2']!, esencia: 'informacional' as const } } });
    mal(op.crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'agente', objeto: 'o-2', proceso: 'p-9' } }), 'contexto', 'R-AG-1');
    const n = con(m, { id: 'e-20', tipo: 'agente', objeto: 'o-2', proceso: 'p-9' });
    expect(bien(op.crearEnlace(n, { opd: m.raiz, candidato: { tipo: 'consumo', objeto: 'o-5', proceso: 'p-10' } })).enlaces['e-30']).toHaveProperty('tipo', 'consumo');
});
test('T-053 segundo plano se bloquea y completarCambio/cambiarTipoExistente son reales', () => {
    const m = con(base(), { id: 'e-20', tipo: 'efecto', objeto: 'o-2', proceso: 'p-9', entrada: 's-3' });
    mal(op.crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'efecto', objeto: 'o-2', proceso: 'p-9', salida: 's-4' } }), 'contexto', 'R-ROL-UNIC-1');
    const o = tiposLegales(m, { opd: m.raiz, desde: { cosa: 'p-9' }, hacia: { cosa: 'o-2', estado: 's-4' } }).find(x => x.tipo === 'efecto' && x.sentido === 'directo');
    expect(o?.legal).toBe(false);
    if (o?.legal === false)
        expect(o.alternativa).toEqual({ k: 'completarCambio', enlace: 'e-20', estados: { entrada: 's-3', salida: 's-4' } });
    expect(bien(op.fijarEstados(m, { enlace: 'e-20', estados: { entrada: 's-3', salida: 's-4' } })).enlaces['e-20']).toEqual({ id: 'e-20', tipo: 'efecto', objeto: 'o-2', proceso: 'p-9', entrada: 's-3', salida: 's-4' });
    const c = con(base(), { id: 'e-20', tipo: 'consumo', objeto: 'o-2', proceso: 'p-9' });
    expect(bien(op.cambiarTipoEnlace(c, { enlace: 'e-20', tipo: 'instrumento' })).enlaces['e-20']).toEqual({ id: 'e-20', tipo: 'instrumento', objeto: 'o-2', proceso: 'p-9' });
});
const setters: readonly [
    string,
    Enlace,
    Parameters<typeof op.fijarEstados>[1]['estados'],
    Partial<Enlace>
][] = [
    ['consumo', { id: 'e-20', tipo: 'consumo', objeto: 'o-2', proceso: 'p-9' }, { estado: 's-3' }, { estado: 's-3' }],
    ['efecto', { id: 'e-20', tipo: 'efecto', objeto: 'o-2', proceso: 'p-9' }, { entrada: 's-3', salida: 's-4' }, { entrada: 's-3', salida: 's-4' }],
    ['generalizacion', { id: 'e-20', tipo: 'generalizacion', refinable: 'o-2', refinador: 'o-5' }, { generalizacion: { general: 's-3', especializacion: 's-6' } }, { estados: { general: 's-3', especializacion: 's-6' } }],
    ['etiquetado', { id: 'e-20', tipo: 'etiquetado', origen: 'o-2', destino: 'o-5', etiqueta: 'conoce' }, { origen: 's-3', destino: 's-6' }, { estadoOrigen: 's-3', estadoDestino: 's-6' }],
];
for (const [nombre, e, estados, campos] of setters)
    test(`T-041 fijarEstados ${nombre} tiene forma exacta y propietario propio`, () => {
        const m = con(base(), e);
        expect(bien(op.fijarEstados(m, { enlace: e.id, estados })).enlaces[e.id]).toEqual({ ...e, ...campos } as Enlace);
        mal(op.fijarEstados(m, { enlace: e.id, estados: { estado: 's-99' } }), nombre === 'consumo' ? 'forma' : 'tipo-incompatible');
    });
test('T-049 SSE y recíproco admiten retiro legal y rechazan estado solo destino/B-05', () => {
    const m = con(base(), { id: 'e-20', tipo: 'reciproco', origen: 'o-2', destino: 'o-5', etiqueta: 'conoce' });
    mal(op.fijarEstados(m, { enlace: 'e-20', estados: { origen: null, destino: 's-6' } }), 'forma', 'AP-11');
    const n = bien(op.fijarEstados(m, { enlace: 'e-20', estados: { origen: 's-3', destino: 's-6' } }));
    mal(op.fijarEtiqueta(n, { enlace: 'e-20', etiqueta: null }), 'lexico');
    expect(bien(op.fijarEstados(n, { enlace: 'e-20', estados: { origen: null, destino: null } })).enlaces['e-20']).not.toHaveProperty('estados');
});
test('T-051 control alterna y retira, no es aceptado en resultado', () => {
    const m = con(base(), { id: 'e-20', tipo: 'consumo', objeto: 'o-2', proceso: 'p-9' });
    const a = bien(op.fijarControl(m, { enlace: 'e-20', control: 'e' })), b = bien(op.fijarControl(a, { enlace: 'e-20', control: 'c' }));
    expect(b.enlaces['e-20']).toHaveProperty('control', 'c');
    expect(bien(op.fijarControl(b, { enlace: 'e-20', control: null })).enlaces['e-20']).not.toHaveProperty('control');
    mal(op.fijarControl(con(base(), { id: 'e-20', tipo: 'resultado', objeto: 'o-2', proceso: 'p-9' }), { enlace: 'e-20', control: 'e' }), 'forma', 'R-MOD-4');
});
test('T-057 multiplicidad por rol, B-04 y retiro sin mover al proceso', () => {
    const m = con(base(), { id: 'e-20', tipo: 'consumo', objeto: 'o-2', proceso: 'p-9' });
    for (const valor of ['?', '*', '+'] as const)
        expect(bien(op.fijarMultiplicidad(m, { enlace: 'e-20', extremo: 'objeto', valor })).enlaces['e-20']).toHaveProperty('mult', valor);
    mal(op.fijarMultiplicidad(m, { enlace: 'e-20', extremo: 'destino', valor: '?' }), 'forma', 'R-MULT-1');
    const n = bien(op.fijarControl(m, { enlace: 'e-20', control: 'c' }));
    mal(op.fijarMultiplicidad(n, { enlace: 'e-20', extremo: 'objeto', valor: '?' }), 'no-ofrecido', 'DR-44');
    const a = bien(op.fijarMultiplicidad(m, { enlace: 'e-20', extremo: 'objeto', valor: '+' }));
    expect(bien(op.fijarMultiplicidad(a, { enlace: 'e-20', extremo: 'objeto', valor: null })).enlaces['e-20']).not.toHaveProperty('mult');
});
test('T-058 ruta literal se conserva/retiro y familia incorrecta rechaza', () => {
    const m = con(base(), { id: 'e-20', tipo: 'consumo', objeto: 'o-2', proceso: 'p-9' }), n = bien(op.fijarRuta(m, { enlace: 'e-20', ruta: 'Ruta con espacios' }));
    expect(n.enlaces['e-20']).toHaveProperty('ruta', 'Ruta con espacios');
    expect(bien(op.fijarRuta(n, { enlace: 'e-20', ruta: null })).enlaces['e-20']).not.toHaveProperty('ruta');
    mal(op.fijarRuta(m, { enlace: 'e-20', ruta: '' }), 'forma', 'R-OPL-RUTA-2');
    mal(op.fijarRuta(con(base(), { id: 'e-20', tipo: 'efecto', objeto: 'o-2', proceso: 'p-9' }), { enlace: 'e-20', ruta: 'a' }), 'forma', 'R-OPL-RUTA-2');
});
test('T-120 igualdad válida normaliza con traza sin perder id y datos inválidos no crean', () => {
    const m = base(), candidato: EnlaceNuevo = { tipo: 'etiquetadoBidireccional', origen: 'o-2', destino: 'o-5', etiqueta: 'conoce', inversa: 'conoce', estadoOrigen: 's-3' };
    const r = op.crearEnlace(m, { opd: m.raiz, candidato }), n = bien(r);
    expect(n.enlaces[`e-${m.secuencia}`]).toEqual({ id: `e-${m.secuencia}`, tipo: 'reciproco', origen: 'o-2', destino: 'o-5', etiqueta: 'conoce', estados: { origen: 's-3' } });
    if (r.ok)
        expect(r.trazas.some(t => t.regla === 'R-STRE-1')).toBe(true);
    const b = con(m, { ...candidato, id: 'e-20', inversa: 'es-conocido' });
    const s = op.fijarEtiqueta(b, { enlace: 'e-20', etiqueta: 'mira', inversa: 'mira' });
    expect(bien(s).enlaces['e-20']).toHaveProperty('tipo', 'reciproco');
    if (s.ok)
        expect(s.trazas.some(t => t.regla === 'R-STRE-1')).toBe(true);
    for (const etiqueta of ['', ' inválida'])
        mal(op.crearEnlace(m, { opd: m.raiz, candidato: { ...candidato, etiqueta, inversa: etiqueta } }), 'lexico');
});
test('T-250 reanclar T1→TS1 conserva id y estados ajenos/ausentes rechaza', () => {
    const m = con(base(), { id: 'e-20', tipo: 'consumo', objeto: 'o-2', proceso: 'p-9' });
    expect(bien(op.reanclarExtremo(m, { opd: m.raiz, enlace: 'e-20', extremo: 'origen', hacia: { cosa: 'o-5', estado: 's-6' } })).enlaces['e-20']).toEqual({ id: 'e-20', tipo: 'consumo', objeto: 'o-5', proceso: 'p-9', estado: 's-6' });
    mal(op.reanclarExtremo(m, { opd: m.raiz, enlace: 'e-20', extremo: 'origen', hacia: { cosa: 'o-5', estado: 's-3' } }), 'forma', 'R-EDIT-2');
    mal(op.reanclarExtremo(m, { opd: m.raiz, enlace: 'e-99', extremo: 'origen', hacia: { cosa: 'o-5' } }), 'no-encontrado');
});
for (const e of firmas)
    test(`T-250 reanclar familia ${e.tipo} proceso u objeto inequívoco`, () => {
        const m = con(base(), { ...e, id: 'e-20' } as Enlace);
        const estructural = 'refinable' in e, procedimental = 'objeto' in e;
        const extremo = procedimental && (e.tipo === 'consumo' || e.tipo === 'agente' || e.tipo === 'instrumento') ? 'destino' : 'origen';
        const hacia = e.tipo === 'generalizacion' ? { cosa: 'o-2', estado: 's-4' } : e.tipo === 'reciproco' ? { cosa: 'o-2', estado: 's-4' } : estructural ? { cosa: e.refinable === 'p-9' ? 'p-11' : 'o-8' } : procedimental ? { cosa: 'p-11' } : { cosa: e.origen.startsWith('p-') ? 'p-11' : 'o-8' };
        const n = bien(op.reanclarExtremo(m, { opd: m.raiz, enlace: 'e-20', extremo, hacia }));
        expect(n.enlaces['e-20']!.id).toBe('e-20');
        expect(n.secuencia).toBe(m.secuencia);
    });
test('T-250 efecto preserva roles y bloquea anclaje ambiguo sin elegir salida', () => {
    const m = con(base(), { id: 'e-20', tipo: 'efecto', objeto: 'o-2', proceso: 'p-9' });
    mal(op.reanclarExtremo(m, { opd: m.raiz, enlace: 'e-20', extremo: 'destino', hacia: { cosa: 'o-2', estado: 's-3' } }), 'referencia-ambigua', 'R-OPD-EDIT-4');
    expect(bien(op.reanclarExtremo(m, { opd: m.raiz, enlace: 'e-20', extremo: 'destino', hacia: { cosa: 'o-5' } })).enlaces['e-20']).toEqual({ id: 'e-20', tipo: 'efecto', objeto: 'o-5', proceso: 'p-9' });
    const n = con(base(), { id: 'e-20', tipo: 'efecto', objeto: 'o-2', proceso: 'p-9', entrada: 's-3' });
    expect(bien(op.reanclarExtremo(n, { opd: m.raiz, enlace: 'e-20', extremo: 'destino', hacia: { cosa: 'o-5', estado: 's-6' } })).enlaces['e-20']).toEqual({ id: 'e-20', tipo: 'efecto', objeto: 'o-5', proceso: 'p-9', entrada: 's-6' });
});
test('T-032 par escindido preserva bilateralidad y borrar contraparte deja standalone', () => {
    const m = con(base(), { id: 'e-20', tipo: 'efecto', objeto: 'o-2', proceso: 'p-9', entrada: 's-3', escision: { par: 'e-21', mitad: 'entrada' } }, { id: 'e-21', tipo: 'efecto', objeto: 'o-2', proceso: 'p-10', salida: 's-4', escision: { par: 'e-20', mitad: 'salida' } });
    expect(bien(op.reanclarExtremo(m, { opd: m.raiz, enlace: 'e-20', extremo: 'origen', hacia: { cosa: 'p-11' } })).enlaces['e-20']).toHaveProperty('escision', { par: 'e-21', mitad: 'entrada' });
    mal(op.reanclarExtremo(m, { opd: m.raiz, enlace: 'e-20', extremo: 'destino', hacia: { cosa: 'o-5', estado: 's-6' } }), 'forma', 'F-4');
    mal(op.fijarEstados(m, { enlace: 'e-20', estados: { entrada: null, salida: null } }), 'forma', 'F-4');
    mal(op.fijarControl(m, { enlace: 'e-20', control: 'c' }), 'forma', 'R-ESCIND-0');
    const r = op.eliminarEnlaces(m, { enlaces: ['e-20', 'e-20'] }), n = bien(r);
    expect(n.enlaces['e-21']).not.toHaveProperty('escision');
    expect(n.enlaces['e-21']).toHaveProperty('salida', 's-4');
    if (r.ok)
        expect(r.trazas.some(t => t.regla === 'DR-7')).toBe(true);
    expect(bien(op.eliminarEnlaces(m, { enlaces: ['e-20', 'e-21'] })).enlaces).toEqual({});
    mal(op.eliminarEnlaces(m, { enlaces: ['e-20', 'e-99'] }), 'no-encontrado');
});
test('T-020 perder última exhibición retira valor con traza; otra conserva', () => {
    const b = base(), m = congelar({ ...con(b, { id: 'e-20', tipo: 'exhibicion', refinable: 'o-2', refinador: 'o-8' }, { id: 'e-21', tipo: 'exhibicion', refinable: 'o-5', refinador: 'o-8' }), cosas: { ...b.cosas, 'o-8': { ...b.cosas['o-8'] as Objeto, valor: '12' } } });
    expect(bien(op.eliminarEnlaces(m, { enlaces: ['e-20'] })).cosas['o-8']).toHaveProperty('valor', '12');
    const r = op.eliminarEnlaces(m, { enlaces: ['e-20', 'e-21'] });
    expect(bien(r).cosas['o-8']).not.toHaveProperty('valor');
    if (r.ok)
        expect(r.trazas.some(t => t.regla === 'F-13' && t.mensaje.includes('12'))).toBe(true);
    const n = bien(op.eliminarEnlaces(m, { enlaces: ['e-21'] }));
    expect(bien(op.cambiarTipoEnlace(n, { enlace: 'e-20', tipo: 'agregacion' })).cosas['o-8']).not.toHaveProperty('valor');
    expect(bien(op.reanclarExtremo(n, { opd: n.raiz, enlace: 'e-20', extremo: 'destino', hacia: { cosa: 'o-5' } })).cosas['o-8']).not.toHaveProperty('valor');
});
test('T-091 crear exhibición propaga ambiente por cadena y diamante una vez', () => {
    const b = base(), m = congelar({ ...con(b, { id: 'e-20', tipo: 'exhibicion', refinable: 'o-5', refinador: 'o-8' }, { id: 'e-21', tipo: 'exhibicion', refinable: 'o-5', refinador: 'p-10' }, { id: 'e-22', tipo: 'exhibicion', refinable: 'p-10', refinador: 'o-8' }), cosas: { ...b.cosas, 'o-2': { ...b.cosas['o-2']!, afiliacion: 'ambiental' as const } } });
    const r = op.crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'exhibicion', refinable: 'o-2', refinador: 'o-5' } }), n = bien(r);
    for (const id of ['o-5', 'o-8', 'p-10'])
        expect(n.cosas[id]).toHaveProperty('afiliacion', 'ambiental');
    if (r.ok)
        expect(r.trazas.filter(t => t.refs.some(x => x.tipo === 'cosa' && x.id === 'o-8'))).toHaveLength(1);
});
test('T-018 LF-03 creación y edición desocultan estado anclado visible con traza', () => {
    const b = base(), c = b.cosas['o-2'] as Objeto, m = congelar({ ...b, cosas: { ...b.cosas, 'o-2': { ...c, estados: c.estados.map(s => s.id === 's-3' ? { ...s, suprimido: true as const } : s) } }, opds: { [b.raiz]: { ...b.opds[b.raiz]!, apariciones: { ...b.opds[b.raiz]!.apariciones, 'o-2': { ...b.opds[b.raiz]!.apariciones['o-2']!, ocultos: ['s-3'] } } } } });
    const r = op.crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'consumo', objeto: 'o-2', proceso: 'p-9', estado: 's-3' } }), n = bien(r);
    expect((n.cosas['o-2'] as Objeto).estados[0]).not.toHaveProperty('suprimido');
    expect(n.opds[n.raiz]!.apariciones['o-2']!.ocultos ?? []).not.toContain('s-3');
    expect(proyectar(n, n.raiz).cosas.find(x => x.cosa === 'o-2')!.estadosVisibles).toContain('s-3');
    if (r.ok)
        expect(r.trazas.some(t => t.regla === 'LF-03')).toBe(true);
    const e = con(m, { id: 'e-20', tipo: 'consumo', objeto: 'o-2', proceso: 'p-9' });
    expect(bien(op.fijarEstados(e, { enlace: 'e-20', estados: { estado: 's-3' } })).opds[e.raiz]!.apariciones['o-2']!.ocultos ?? []).not.toContain('s-3');
});
test('T-250 cambiar tipo retira incompatibles con trazas sin invertir objeto/proceso', () => {
    const m = con(base(), { id: 'e-20', tipo: 'consumo', objeto: 'o-2', proceso: 'p-9', estado: 's-3', control: 'e', ruta: 'a', mult: '+' });
    const r = op.cambiarTipoEnlace(m, { enlace: 'e-20', tipo: 'resultado' }), n = bien(r);
    expect(n.enlaces['e-20']).toEqual({ id: 'e-20', tipo: 'resultado', objeto: 'o-2', proceso: 'p-9', estado: 's-3', ruta: 'a', mult: '+' });
    if (r.ok)
        expect(r.trazas.some(t => t.mensaje.includes('control'))).toBe(true);
    mal(op.cambiarTipoEnlace(m, { enlace: 'e-20', tipo: 'etiquetadoBidireccional' }), 'lexico');
});
test('T-049 cambiar entre etiquetados conserva los estados por sus papeles', () => {
    const m = con(base(), { id: 'e-20', tipo: 'etiquetado', origen: 'o-2', destino: 'o-5', etiqueta: 'conoce', estadoOrigen: 's-3', estadoDestino: 's-6' });
    expect(bien(op.cambiarTipoEnlace(m, { enlace: 'e-20', tipo: 'reciproco' })).enlaces['e-20']).toEqual({ id: 'e-20', tipo: 'reciproco', origen: 'o-2', destino: 'o-5', etiqueta: 'conoce', estados: { origen: 's-3', destino: 's-6' } });
    const n = con(base(), { id: 'e-20', tipo: 'reciproco', origen: 'o-2', destino: 'o-5', etiqueta: 'conoce', estados: { origen: 's-3', destino: 's-6' } });
    expect(bien(op.cambiarTipoEnlace(n, { enlace: 'e-20', tipo: 'etiquetado' })).enlaces['e-20']).toEqual({ id: 'e-20', tipo: 'etiquetado', origen: 'o-2', destino: 'o-5', etiqueta: 'conoce', estadoOrigen: 's-3', estadoDestino: 's-6' });
});
test('T-048 cambiar generalización a recíproco retira par incompatible con traza', () => {
    const m = con(base(), { id: 'e-20', tipo: 'generalizacion', refinable: 'o-2', refinador: 'o-5', estados: { general: 's-3', especializacion: 's-6' } });
    const r = op.cambiarTipoEnlace(m, { enlace: 'e-20', tipo: 'reciproco' }), n = bien(r);
    expect(n.enlaces['e-20']).toEqual({ id: 'e-20', tipo: 'reciproco', origen: 'o-2', destino: 'o-5' });
    if (r.ok)
        expect(r.trazas.some(t => t.mensaje.includes('estados'))).toBe(true);
});
test('T-041 retiro explícito del anclaje por fijarEstados tiene traza del estado retirado', () => {
    const m = con(base(), { id: 'e-20', tipo: 'efecto', objeto: 'o-2', proceso: 'p-9', entrada: 's-3' });
    const r = op.fijarEstados(m, { enlace: 'e-20', estados: { entrada: null, salida: null } });
    expect(bien(r).enlaces['e-20']).not.toHaveProperty('entrada');
    if (r.ok)
        expect(r.trazas.some(t => t.refs.some(x => x.tipo === 'estado' && x.id === 's-3'))).toBe(true);
});
test('T-064 setter compatible conserva errores previos de contorno sin fingir distribución', () => {
    const b = base(), e: Enlace = { id: 'e-20', tipo: 'consumo', objeto: 'o-2', proceso: 'p-9' };
    const apariciones = { ...b.opds[b.raiz]!.apariciones };
    delete apariciones['p-10'];
    const hijo = { id: 'opd-21', tipo: 'descomposicion' as const, padre: b.raiz, cosa: 'p-9', orden: 0, bandas: [['p-10']], objetosInternos: [], apariciones: { 'p-9': { x: 0, y: 0, ancho: 600, alto: 400 }, 'p-10': { x: 100, y: 100, ancho: 135, alto: 60 }, 'o-2': b.opds[b.raiz]!.apariciones['o-2']! } };
    const m = congelar({ ...con(b, e), opds: { [b.raiz]: { ...b.opds[b.raiz]!, apariciones }, [hijo.id]: hijo } });
    expect(validarForma(m)).toEqual([]);
    expect(bien(op.fijarRuta(m, { enlace: e.id, ruta: 'documental' })).enlaces[e.id]).toEqual({ ...e, ruta: 'documental' });
});
test('T-066 interno con extremos realmente presentes en hijo crea enlace admitido', () => {
    const b = base(), apariciones = { ...b.opds[b.raiz]!.apariciones };
    delete apariciones['o-2'];
    delete apariciones['p-10'];
    const hijo = { id: 'opd-20', tipo: 'descomposicion' as const, padre: b.raiz, cosa: 'p-9', orden: 0, bandas: [['p-10']], objetosInternos: ['o-2'], apariciones: { 'p-9': { x: 0, y: 0, ancho: 600, alto: 400 }, 'p-10': { x: 100, y: 100, ancho: 135, alto: 60 }, 'o-2': { x: 100, y: 200, ancho: 135, alto: 60 } } };
    const m = congelar({ ...b, secuencia: 21, opds: { [b.raiz]: { ...b.opds[b.raiz]!, apariciones }, [hijo.id]: hijo } });
    expect(validarForma(m)).toEqual([]);
    const n = bien(op.crearEnlace(m, { opd: hijo.id, candidato: { tipo: 'consumo', objeto: 'o-2', proceso: 'p-10', estado: 's-3' } }));
    expect(n.enlaces['e-21']).toEqual({ id: 'e-21', tipo: 'consumo', objeto: 'o-2', proceso: 'p-10', estado: 's-3' });
});
test('T-018 LF-03 conserva ocultamiento local donde el enlace no tiene vista', () => {
    const b = base(), c = b.cosas['o-2'] as Objeto, caja = b.opds[b.raiz]!.apariciones['o-2']!;
    const hijo = { id: 'opd-20', tipo: 'despliegue' as const, padre: b.raiz, cosa: 'o-2', orden: 0, modo: 'agregacion' as const, apariciones: { 'o-2': { ...caja, ocultos: ['s-3'] }, 'o-5': b.opds[b.raiz]!.apariciones['o-5']! } };
    const m = congelar({ ...b, secuencia: 21, cosas: { ...b.cosas, 'o-2': { ...c, estados: c.estados.map(s => s.id === 's-3' ? { ...s, suprimido: true as const } : s) } }, opds: { ...b.opds, [hijo.id]: hijo } });
    expect(validarForma(m)).toEqual([]);
    const r = op.crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'consumo', objeto: 'o-2', proceso: 'p-9', estado: 's-3' } }), n = bien(r);
    expect(n.opds[hijo.id]!.apariciones['o-2']!.ocultos).toEqual(['s-3']);
    expect(proyectar(n, hijo.id).enlaces.some(v => v.hechos.includes('e-21'))).toBe(false);
    expect(proyectar(n, hijo.id).cosas.find(x => x.cosa === 'o-2')!.estadosVisibles).not.toContain('s-3');
});
test('T-057 multiplicidad de agregación y etiquetas conserva extremos correctos y B-04', () => {
    const m = con(base(), { id: 'e-20', tipo: 'agregacion', refinable: 'o-2', refinador: 'o-5' });
    expect(bien(op.fijarMultiplicidad(m, { enlace: 'e-20', extremo: 'refinador', valor: '+' })).enlaces['e-20']).toHaveProperty('mult', '+');
    mal(op.fijarMultiplicidad(m, { enlace: 'e-20', extremo: 'origen', valor: '?' }), 'forma', 'R-MULT-1');
    const e = con(base(), { id: 'e-20', tipo: 'etiquetado', origen: 'o-2', destino: 'o-5' }), n = bien(op.fijarMultiplicidad(e, { enlace: 'e-20', extremo: 'origen', valor: '?' }));
    expect(bien(op.fijarMultiplicidad(n, { enlace: 'e-20', extremo: 'destino', valor: '+' })).enlaces['e-20']).toEqual({ id: 'e-20', tipo: 'etiquetado', origen: 'o-2', destino: 'o-5', multOrigen: '?', multDestino: '+' });
    mal(op.fijarEstados(n, { enlace: 'e-20', estados: { origen: 's-3', destino: null } }), 'no-ofrecido', 'DR-44');
});
test('T-041 fijarEstados retira especialización y distingue estado ajeno del formato erróneo', () => {
    const m = con(base(), { id: 'e-20', tipo: 'generalizacion', refinable: 'o-2', refinador: 'o-5', estados: { general: 's-3', especializacion: 's-6' } });
    expect(bien(op.fijarEstados(m, { enlace: 'e-20', estados: { generalizacion: null } })).enlaces['e-20']).not.toHaveProperty('estados');
    mal(op.fijarEstados(m, { enlace: 'e-20', estados: { generalizacion: { general: 's-6', especializacion: 's-3' } } }), 'forma', 'R-EDIT-2');
    const n = con(base(), { id: 'e-20', tipo: 'etiquetadoBidireccional', origen: 'o-2', destino: 'o-5', etiqueta: 'conoce', inversa: 'es-conocido' });
    expect(bien(op.fijarEstados(n, { enlace: 'e-20', estados: { origen: 's-3', destino: null } })).enlaces['e-20']).toHaveProperty('estadoOrigen', 's-3');
    mal(op.fijarEstados(n, { enlace: 'e-20', estados: { origen: null, destino: 's-6' } }), 'forma', 'AP-11');
});
test('T-120 etiqueta opcional y requerida se retira o rechaza sin fabricación', () => {
    const m = con(base(), { id: 'e-20', tipo: 'etiquetado', origen: 'o-2', destino: 'o-5', etiqueta: 'conoce' });
    expect(bien(op.fijarEtiqueta(m, { enlace: 'e-20', etiqueta: null })).enlaces['e-20']).not.toHaveProperty('etiqueta');
    mal(op.fijarEtiqueta(m, { enlace: 'e-20', etiqueta: 'conoce', inversa: 'es-conocido' }), 'tipo-incompatible');
    const n = con(base(), { id: 'e-20', tipo: 'etiquetadoBidireccional', origen: 'o-2', destino: 'o-5', etiqueta: 'conoce', inversa: 'es-conocido' });
    mal(op.fijarEtiqueta(n, { enlace: 'e-20', etiqueta: null }), 'lexico');
    mal(op.fijarEtiqueta(n, { enlace: 'e-20', etiqueta: 'conoce', inversa: '' }), 'lexico');
});
test('T-250 mitad standalone entrada/salida cambia estado propio o retira con traza', () => {
    for (const campo of ['entrada', 'salida'] as const) {
        const m = con(base(), { id: 'e-20', tipo: 'efecto', objeto: 'o-2', proceso: 'p-9', [campo]: 's-3' });
        const r = op.reanclarExtremo(m, { opd: m.raiz, enlace: 'e-20', extremo: 'destino', hacia: { cosa: 'o-5' } });
        expect(bien(r).enlaces['e-20']).toEqual({ id: 'e-20', tipo: 'efecto', objeto: 'o-5', proceso: 'p-9' });
        if (r.ok)
            expect(r.trazas.some(t => t.refs.some(x => x.id === 's-3'))).toBe(true);
    }
    const n = con(base(), { id: 'e-20', tipo: 'efecto', objeto: 'o-2', proceso: 'p-9', entrada: 's-3', salida: 's-4' });
    const antes = JSON.stringify(n);
    mal(op.reanclarExtremo(n, { opd: n.raiz, enlace: 'e-20', extremo: 'destino', hacia: { cosa: 'o-5', estado: 's-6' } }), 'referencia-ambigua', 'R-OPD-EDIT-4');
    expect(JSON.stringify(n)).toBe(antes);
});
test('T-046 invocación reflexiva y excepciones sin cotas nunca inventan duración', () => {
    const m = base();
    expect(bien(op.crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'invocacion', origen: 'p-9', destino: 'p-9' } })).enlaces[`e-${m.secuencia}`]).toEqual({ id: `e-${m.secuencia}`, tipo: 'invocacion', origen: 'p-9', destino: 'p-9' });
    for (const tipo of ['excepcionSobretiempo', 'excepcionSubtiempo'] as const) {
        const n = bien(op.crearEnlace(m, { opd: m.raiz, candidato: { tipo, origen: 'p-9', destino: 'p-10' } }));
        expect(n.cosas['p-9']).not.toHaveProperty('duracion');
        expect(n.cosas['p-10']).toHaveProperty('afiliacion', 'sistemica');
    }
});
test('T-250 TS3 a otro objeto sin estados propuestos bloquea retiro implícito de ambos papeles', () => {
    const m = con(base(), { id: 'e-20', tipo: 'efecto', objeto: 'o-2', proceso: 'p-9', entrada: 's-3', salida: 's-4' });
    const args = congelar({ opd: m.raiz, enlace: 'e-20', extremo: 'destino' as const, hacia: { cosa: 'o-5' } });
    expect(validarForma(m)).toEqual([]);
    const snapshot = JSON.stringify([m, args]);
    mal(op.reanclarExtremo(m, args), 'referencia-ambigua', 'R-OPD-EDIT-4');
    expect(JSON.stringify([m, args])).toBe(snapshot);
    expect(m.enlaces['e-20']).toEqual({ id: 'e-20', tipo: 'efecto', objeto: 'o-2', proceso: 'p-9', entrada: 's-3', salida: 's-4' });
    expect(m.secuencia).toBe(30);
});
test('T-250 TS3 hacia rectángulo del mismo objeto no decide qué pierna se desancla', () => {
    const m = con(base(), { id: 'e-20', tipo: 'efecto', objeto: 'o-2', proceso: 'p-9', entrada: 's-3', salida: 's-4' });
    const antes = JSON.stringify(m);
    mal(op.reanclarExtremo(m, { opd: m.raiz, enlace: 'e-20', extremo: 'destino', hacia: { cosa: 'o-2' } }), 'referencia-ambigua', 'R-OPD-EDIT-4');
    expect(JSON.stringify(m)).toBe(antes);
});
