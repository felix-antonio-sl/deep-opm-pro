import { expect, test } from 'bun:test';
import type { Cosa, Enlace, Modelo, OpdDescomposicion } from './tipos';
import { CATALOGO, diagnosticar } from './diagnostico';
import { REGLAS_CONTEXTO, erroresContexto } from './matriz';
import { aplicarAccion } from './operaciones';
import { validarForma } from './forma';
import { congelar } from '../pruebas/constructores';
const obj = (id: string, nombre: string): Cosa => ({ id, tipo: 'objeto', nombre, esencia: 'fisica', afiliacion: 'sistemica', estados: [{ id: `${id}-nuevo`, nombre: 'nuevo' }, { id: `${id}-listo`, nombre: 'listo' }] });
const proc = (id: string, nombre: string): Cosa => ({ id, tipo: 'proceso', nombre, esencia: 'informacional', afiliacion: 'sistemica' });
const o = obj('o', 'Pedido'), p = proc('p', 'Procesar Pedido'), b = obj('b', 'Caja');
const app = { x: 0, y: 0, ancho: 135, alto: 60 };
function modelo(cosas: readonly Cosa[], enlaces: readonly Enlace[] = [], dc?: OpdDescomposicion): Modelo {
    const internos = new Set(dc?.bandas.flat() ?? []);
    return congelar({ id: 'repair', nombre: 'Reparar', raiz: 'sd', secuencia: 100, unidadTiempo: 'min', cosas: Object.fromEntries(cosas.map(c => [c.id, c])), enlaces: Object.fromEntries(enlaces.map(e => [e.id, e])), abanicos: {}, opds: { sd: { id: 'sd', tipo: 'raiz', apariciones: Object.fromEntries(cosas.filter(c => !internos.has(c.id)).map(c => [c.id, app])) }, ...(dc ? { dc } : {}) } });
}
const dc: OpdDescomposicion = { id: 'dc', tipo: 'descomposicion', padre: 'sd', cosa: 'p', orden: 0, objetosInternos: [], bandas: [['a'], ['z']], apariciones: { p: { ...app, ancho: 420, alto: 300 }, o: { ...app, x: -220 }, a: { ...app, x: 140, y: 64 }, z: { ...app, x: 140, y: 164 } } };
const refined = (e: Enlace) => modelo([o, p, proc('a', 'Recibir Pedido'), proc('z', 'Entregar Pedido')], [e], dc);
const casos: readonly [string, string, () => Modelo][] = [
    ['T-024', 'nombre-duplicado', () => modelo([o, obj('b', 'Pedido')])],
    ['T-025', 'nombre-fuera-de-lexico', () => modelo([{ ...o, nombre: 'pedido' }])],
    ['T-015', 'estado-duplicado', () => modelo([{ ...o, estados: [{ id: 'x', nombre: 'listo' }, { id: 'y', nombre: 'listo' }] } as Cosa])],
    ['T-025', 'estado-fuera-de-lexico', () => modelo([{ ...o, estados: [{ id: 'x', nombre: 'Listo' }] } as Cosa])],
    ['T-268', 'manejador-no-ambiental', () => modelo([p, proc('q', 'Gestionar Error')], [{ id: 'e', tipo: 'excepcionSobretiempo', origen: 'p', destino: 'q' }])],
    ['T-091', 'afiliacion-incoherente', () => modelo([{ ...o, afiliacion: 'ambiental' }, b], [{ id: 'e', tipo: 'exhibicion', refinable: 'o', refinador: 'b' }])],
    ['T-260', 'general-redundante', () => modelo([o, b, obj('t', 'Documento')], [{ id: 'e1', tipo: 'generalizacion', refinable: 'o', refinador: 't' }, { id: 'e2', tipo: 'generalizacion', refinable: 'b', refinador: 't' }, { id: 'e3', tipo: 'generalizacion', refinable: 'o', refinador: 'b' }])],
    ['T-075', 'R-DIST-1', () => refined({ id: 'e', tipo: 'consumo', objeto: 'o', proceso: 'p' })],
    ['T-075', 'R-CX-DIST-2', () => refined({ id: 'e', tipo: 'agente', objeto: 'o', proceso: 'p', control: 'e' })],
    ['T-074', 'AP-07', () => refined({ id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 'o-nuevo', salida: 'o-listo' })],
    ['T-082', 'R-INV-2B', () => refined({ id: 'e', tipo: 'invocacion', origen: 'a', destino: 'z' })],
];
for (const [tid, codigo, construir] of casos) test(`${tid} CC-23 reparación real resuelve ${codigo}`, () => {
    const m = construir(), antes = JSON.stringify(m); expect(validarForma(m)).toEqual([]);
    const d = diagnosticar(m).find(d => (d.codigo === codigo || d.regla === codigo) && d.reparacion)!;
    expect(d).toBeDefined(); expect(d.reparacion).toBeDefined(); congelar(d.reparacion);
    const previos = new Set(erroresContexto(m).map(v => JSON.stringify([v.codigo, v.refs]))), r = aplicarAccion(m, d.reparacion!);
    expect(r.ok, r.ok ? '' : JSON.stringify(r.rechazo)).toBe(true); if (!r.ok) throw Error(r.rechazo.mensaje);
    const out = r.valor.modelo; expect(validarForma(out)).toEqual([]);
    expect(diagnosticar(out).some(x => x.codigo === d.codigo && x.regla === d.regla && JSON.stringify(x.refs) === JSON.stringify(d.refs))).toBe(false);
    expect(erroresContexto(out).filter(v => !previos.has(JSON.stringify([v.codigo, v.refs])))).toEqual([]);
    expect(JSON.stringify(m)).toBe(antes);
});
test('T-261 CC-23 inventario cerrado: todas las reparaciones ejecutables tienen fixture real', () => {
    expect(REGLAS_CONTEXTO.filter(r => r.reparacion).map(r => r.id)).toEqual(['R-DIST-1', 'R-CX-DIST-2', 'AP-07', 'R-INV-2B']);
    const reales = new Set(casos.flatMap(([, , construir]) => diagnosticar(construir()).filter(d => d.reparacion).map(d => d.codigo)));
    expect([...reales].sort()).toEqual(['afiliacion-incoherente', 'enlace-invalido', 'estado-duplicado', 'estado-fuera-de-lexico', 'general-redundante', 'manejador-no-ambiental', 'nombre-duplicado', 'nombre-fuera-de-lexico']);
    expect(CATALOGO.filter(c => reales.has(c.codigo))).toHaveLength(8);
});
