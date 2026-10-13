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
    ['T-074', 'AP-07', () => refined({ id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 'o-nuevo', salida: 'o-listo' })],
    ['T-082', 'R-INV-2B', () => refined({ id: 'e', tipo: 'invocacion', origen: 'a', destino: 'z' })],
    ['T-040', 'R-EDIT-1', () => modelo([p, proc('q', 'Archivar Pedido')], [{ id: 'e-9', tipo: 'invocacion', origen: 'p', destino: 'q' }, { id: 'e-10', tipo: 'invocacion', origen: 'p', destino: 'q' }])],
    ['T-030', 'orden-vertical-contradictorio', () => { const m = refined({ id: 'e', tipo: 'agente', objeto: 'o', proceso: 'p' }), h = m.opds.dc as OpdDescomposicion; return congelar({ ...m, opds: { ...m.opds, dc: { ...h, apariciones: { ...h.apariciones, a: { ...h.apariciones.z!, x: h.apariciones.a!.x }, z: { ...h.apariciones.a!, x: h.apariciones.z!.x } } } } }); }],
];
for (const [tid, codigo, construir] of casos) test(`${tid} CC-23 reparación real resuelve ${codigo}`, () => {
    const m = construir(), antes = JSON.stringify(m); expect(validarForma(m)).toEqual([]);
    const d = diagnosticar(m).find(d => (d.codigo === codigo || d.regla === codigo) && d.reparacion)!;
    expect(d).toBeDefined(); expect(d.reparacion).toBeDefined(); congelar(d.reparacion);
    const previos = new Set(erroresContexto(m).map(v => JSON.stringify([v.codigo, v.regla, v.refs]))), r = aplicarAccion(m, d.reparacion!);
    expect(r.ok, r.ok ? '' : JSON.stringify(r.rechazo)).toBe(true); if (!r.ok) throw Error(r.rechazo.mensaje);
    const out = r.valor.modelo; expect(validarForma(out)).toEqual([]);
    expect(diagnosticar(out).some(x => x.codigo === d.codigo && x.regla === d.regla && JSON.stringify(x.refs) === JSON.stringify(d.refs))).toBe(false);
    expect(erroresContexto(out).filter(v => !previos.has(JSON.stringify([v.codigo, v.regla, v.refs])))).toEqual([]);
    expect(JSON.stringify(m)).toBe(antes);
});
test('T-060 CC-23 un cruce de evento exige decisión del modelador y no ofrece la antigua migración automática', () => {
    const m = refined({ id: 'e', tipo: 'agente', objeto: 'o', proceso: 'a', control: 'e' }), antes = JSON.stringify(m);
    expect(validarForma(m)).toEqual([]);
    const d = diagnosticar(m).find(d => d.regla === 'R-CX-DIST-2');
    expect(d).toBeDefined(); expect(d!.severidad).toBe('error'); expect(d!.reparacion).toBeUndefined();
    expect(REGLAS_CONTEXTO.find(r => r.id === 'R-CX-DIST-2')!.reparacion).toBeUndefined();
    expect(JSON.stringify(m)).toBe(antes);
});
test('T-040 CC-23 B-58 una copia idéntica que es rama de un abanico exige decisión: retirarla por id cambiaría XOR por AND', () => {
    const q = proc('q', 'Archivar Pedido'), r = proc('r', 'Rechazar Pedido');
    const inv = (id: string, destino: string): Enlace => ({ id, tipo: 'invocacion', origen: 'p', destino });
    // La misma invocación P→Q fuera y dentro del abanico; sólo cambia qué id lleva cada una.
    const montar = (fuera: readonly string[], rama: string): Modelo => congelar({ ...modelo([p, q, r], [...fuera.map(id => inv(id, 'q')), inv(rama, 'q'), inv('e-11', 'r')]), abanicos: { 'f-50': { id: 'f-50', operador: 'XOR' as const, enlaces: [rama, 'e-11'] } } });
    for (const m of [montar(['e-9'], 'e-10'), montar(['e-10'], 'e-9')]) {
        expect(validarForma(m)).toEqual([]);
        const ds = diagnosticar(m).filter(d => d.regla === 'R-EDIT-1');
        expect(ds.map(d => [d.severidad, d.refs])).toEqual([['error', [{ tipo: 'enlace', id: 'e-10' }]]]);
        expect(ds[0]!.reparacion).toBeUndefined();
    }
    // Otra copia fuera del abanico sí se retira sin cambiar la lógica, sea cual sea el orden de ids;
    // la que queda junto a la rama sigue pidiendo decisión.
    for (const [x, y, z] of [['e-9', 'e-10', 'e-12'], ['e-9', 'e-12', 'e-10'], ['e-10', 'e-9', 'e-12'], ['e-10', 'e-12', 'e-9'], ['e-12', 'e-9', 'e-10'], ['e-12', 'e-10', 'e-9']] as const) {
        let m = montar([x, y], z);
        for (let d = diagnosticar(m).find(d => d.regla === 'R-EDIT-1' && d.reparacion); d; d = diagnosticar(m).find(d => d.regla === 'R-EDIT-1' && d.reparacion)) {
            const hecho = aplicarAccion(m, d.reparacion!);
            expect(hecho.ok).toBe(true); if (!hecho.ok) throw Error(hecho.rechazo.mensaje);
            m = hecho.valor.modelo;
        }
        expect(m.abanicos).toEqual({ 'f-50': { id: 'f-50', operador: 'XOR', enlaces: [z, 'e-11'] } });
        expect(Object.values(m.enlaces).filter(e => e.tipo === 'invocacion' && e.destino === 'q')).toHaveLength(2);
        expect(diagnosticar(m).filter(d => d.regla === 'R-EDIT-1').map(d => d.reparacion)).toEqual([undefined]);
    }
});
test('T-261 CC-23 inventario cerrado: todas las reparaciones ejecutables tienen fixture real', () => {
    expect(REGLAS_CONTEXTO.filter(r => r.reparacion).map(r => r.id)).toEqual(['R-EDIT-1', 'R-DIST-1', 'AP-07', 'R-INV-2B']);
    const reales = new Set(casos.flatMap(([, , construir]) => diagnosticar(construir()).filter(d => d.reparacion).map(d => d.codigo)));
    expect([...reales].sort()).toEqual(['afiliacion-incoherente', 'enlace-invalido', 'estado-duplicado', 'estado-fuera-de-lexico', 'general-redundante', 'manejador-no-ambiental', 'nombre-duplicado', 'nombre-fuera-de-lexico', 'orden-vertical-contradictorio']);
    expect(CATALOGO.filter(c => reales.has(c.codigo))).toHaveLength(9);
});
