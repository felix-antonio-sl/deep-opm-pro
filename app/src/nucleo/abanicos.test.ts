import { afterEach, expect, test } from 'bun:test';
import * as fan from './abanicos';
import * as enlace from './enlaces';
import { modeloCon, congelar } from '../pruebas/constructores';
import { validarForma } from './forma';
import { tiposLegales, erroresContexto } from './matriz';
import type { Modelo, Enlace, EnlaceNuevo, Abanico } from './tipos';
import type { Respuesta, Hecho, CodigoRechazo } from './resultado';
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
function base() {
    return modeloCon({ objetos: [['Agua', ['fria', 'tibia', 'caliente']], ['Caja', ['abierta', 'cerrada']], ['Peso', ['ligero']]], procesos: ['Hervir', 'Guardar', 'Medir'] });
}
// Agua o-2 s-3/4/5; Caja o-6 s-7/8; Peso o-9 s-10; procesos p-11/12/13.
function con(es: readonly Enlace[], fs: readonly Abanico[] = []): Modelo {
    const m = base();
    return congelar({ ...m, enlaces: Object.fromEntries(es.map(e => [e.id, e])), abanicos: Object.fromEntries(fs.map(f => [f.id, f])), secuencia: 30 });
}
const c = (id: string, objeto: string, proceso = 'p-11', estado?: string): Enlace => ({ id, tipo: 'consumo', objeto, proceso, ...(estado ? { estado } : {}) });
const f: Abanico = { id: 'f-22', operador: 'XOR', enlaces: ['e-20', 'e-21'] };
for (const tipo of ['consumo', 'resultado', 'efecto', 'agente', 'instrumento', 'invocacion'] as const)
    for (const direccion of ['convergente', 'divergente'] as const)
        test(`T-054 ${tipo} ${direccion} formar XOR y cambiar OR son reales`, () => {
            const es: Enlace[] = tipo === 'invocacion' ? direccion === 'convergente' ? [{ id: 'e-20', tipo, origen: 'p-11', destino: 'p-13' }, { id: 'e-21', tipo, origen: 'p-12', destino: 'p-13' }] : [{ id: 'e-20', tipo, origen: 'p-11', destino: 'p-12' }, { id: 'e-21', tipo, origen: 'p-11', destino: 'p-13' }]
                : direccion === 'convergente' ? [{ id: 'e-20', tipo, objeto: 'o-2', proceso: 'p-11' }, { id: 'e-21', tipo, objeto: 'o-6', proceso: 'p-11' }] : [{ id: 'e-20', tipo, objeto: 'o-2', proceso: 'p-11' }, { id: 'e-21', tipo, objeto: 'o-2', proceso: 'p-12' }];
            const m = con(es), snap = JSON.stringify(m), r = fan.formarAbanico(m, { enlaces: ['e-20', 'e-21'], operador: 'XOR' }), n = bien(r);
            expect(n.abanicos['f-30']).toEqual({ id: 'f-30', operador: 'XOR', enlaces: ['e-20', 'e-21'] });
            if (r.ok)
                expect(r.valor.creados).toEqual(['f-30']);
            expect(bien(fan.fijarOperador(n, { abanico: 'f-30', operador: 'OR' })).abanicos['f-30']!.operador).toBe('OR');
            expect(JSON.stringify(m)).toBe(snap);
            expect(m.abanicos).toEqual({});
        });
test('T-054 formar rechaza cardinalidad, repetidos, ausentes, mezcla, sin común y duplicados semánticos', () => {
    const m = con([c('e-20', 'o-2'), c('e-21', 'o-6'), c('e-22', 'o-9', 'p-12'), { id: 'e-23', tipo: 'resultado', objeto: 'o-9', proceso: 'p-11' }, c('e-24', 'o-2')]);
    for (const enlaces of [['e-20'], ['e-20', 'e-20'], ['e-20', 'e-99'], ['e-20', 'e-22'], ['e-20', 'e-23'], ['e-20', 'e-24']])
        mal(fan.formarAbanico(m, { enlaces, operador: 'XOR' }), 'abanico');
});
test('T-054 pertenencia única no fusiona dos fans ni reutiliza miembro', () => {
    const m = con([c('e-20', 'o-2'), c('e-21', 'o-6'), c('e-23', 'o-9')], [f]);
    mal(fan.formarAbanico(m, { enlaces: ['e-20', 'e-23'], operador: 'OR' }), 'abanico', 'F-6');
    mal(fan.agregarRama(m, { abanico: 'f-22', enlace: 'e-20' }), 'abanico');
    mal(fan.fijarOperador(m, { abanico: 'f-99', operador: 'OR' }), 'no-encontrado');
});
test('T-054 agregar, quitar y disolver conservan hechos/IDs, cardinalidad mínima y traza', () => {
    const m = con([c('e-20', 'o-2'), c('e-21', 'o-6'), c('e-23', 'o-9')], [f]);
    const n = bien(fan.agregarRama(m, { abanico: 'f-22', enlace: 'e-23' }));
    expect(n.abanicos['f-22']!.enlaces).toEqual(['e-20', 'e-21', 'e-23']);
    const q = bien(fan.quitarRama(n, { abanico: 'f-22', enlace: 'e-21' }));
    expect(q.abanicos['f-22']!.enlaces).toEqual(['e-20', 'e-23']);
    expect(q.enlaces).toBe(m.enlaces);
    const z = fan.quitarRama(q, { abanico: 'f-22', enlace: 'e-23' });
    expect(bien(z).abanicos).toEqual({});
    if (z.ok)
        expect(z.trazas.some(t => t.regla === 'R-FAN-GEO-2')).toBe(true);
    expect(bien(fan.disolverAbanico(m, { abanico: 'f-22' })).enlaces).toBe(m.enlaces);
    mal(fan.quitarRama(m, { abanico: 'f-22', enlace: 'e-23' }), 'no-encontrado');
});
test('T-053 abanicoCon segundo resultado es transacción única y extiende mismo id', () => {
    const m = con([{ id: 'e-20', tipo: 'resultado', objeto: 'o-2', proceso: 'p-11', estado: 's-3' }]);
    const candidato: EnlaceNuevo = { tipo: 'resultado', objeto: 'o-2', proceso: 'p-11', estado: 's-4' };
    const opcion = tiposLegales(m, { opd: m.raiz, desde: { cosa: 'p-11' }, hacia: { cosa: 'o-2', estado: 's-4' } }).find(x => x.tipo === 'resultado' && x.sentido === 'directo');
    expect(opcion?.legal).toBe(false);
    if (opcion?.legal === false)
        expect(opcion.alternativa).toEqual({ k: 'abanicoCon', enlace: 'e-20' });
    const r = enlace.crearEnlace(m, { opd: m.raiz, candidato, abanicoCon: { enlace: 'e-20', operador: 'XOR' } }), n = bien(r);
    if (r.ok)
        expect(r.valor.creados).toEqual(['e-30', 'f-31']);
    expect(n.abanicos['f-31']!.enlaces).toEqual(['e-20', 'e-30']);
    expect(erroresContexto(n)).toEqual([]);
    const z = bien(enlace.crearEnlace(n, { opd: m.raiz, candidato: { ...candidato, estado: 's-5' }, abanicoCon: { enlace: 'e-20', operador: 'OR' } }));
    expect(Object.keys(z.abanicos)).toEqual(['f-31']);
    expect(z.abanicos['f-31']).toEqual({ id: 'f-31', operador: 'OR', enlaces: ['e-20', 'e-30', 'e-32'] });
});
test('T-055 control de todas ramas es uniforme, setter individual y NO_OFRECIDO no eluden cierre', () => {
    const m = con([c('e-20', 'o-2'), c('e-21', 'o-6')], [f]);
    const n = bien(fan.fijarControlAbanico(m, { abanico: f.id, control: 'c' }));
    expect(n.enlaces['e-20']).toHaveProperty('control', 'c');
    expect(n.enlaces['e-21']).toHaveProperty('control', 'c');
    mal(enlace.fijarControl(m, { enlace: 'e-20', control: 'c' }), 'abanico', 'R-FAN-3');
    mal(fan.fijarControlAbanico(m, { abanico: f.id, control: 'e' }), 'no-ofrecido', 'T-056');
    expect(bien(fan.fijarControlAbanico(n, { abanico: f.id, control: null })).enlaces['e-20']).not.toHaveProperty('control');
    const r = con([{ id: 'e-20', tipo: 'resultado', objeto: 'o-2', proceso: 'p-11' }, { id: 'e-21', tipo: 'resultado', objeto: 'o-6', proceso: 'p-11' }], [f]);
    mal(fan.fijarControlAbanico(r, { abanico: f.id, control: 'c' }), 'forma', 'R-MOD-4');
});
test('T-056 efecto fan control de objeto común sí tiene plantilla; instrumento no', () => {
    const m = con([{ id: 'e-20', tipo: 'efecto', objeto: 'o-2', proceso: 'p-11' }, { id: 'e-21', tipo: 'efecto', objeto: 'o-2', proceso: 'p-12' }], [f]);
    for (const control of ['e', 'c'] as const)
        expect(bien(fan.fijarControlAbanico(m, { abanico: f.id, control })).enlaces['e-21']).toHaveProperty('control', control);
    const n = con([{ id: 'e-20', tipo: 'instrumento', objeto: 'o-2', proceso: 'p-11' }, { id: 'e-21', tipo: 'instrumento', objeto: 'o-6', proceso: 'p-11' }], [f]);
    mal(fan.fijarControlAbanico(n, { abanico: f.id, control: 'c' }), 'no-ofrecido', 'T-056');
});
test('T-054 estados de efecto mismo par: salida común permitida, dos dimensiones distintas B-06', () => {
    const es: Enlace[] = [{ id: 'e-20', tipo: 'efecto', objeto: 'o-2', proceso: 'p-11', entrada: 's-3', salida: 's-5' }, { id: 'e-21', tipo: 'efecto', objeto: 'o-2', proceso: 'p-11', entrada: 's-4', salida: 's-5' }];
    bien(fan.formarAbanico(con(es), { enlaces: ['e-20', 'e-21'], operador: 'OR' }));
    mal(enlace.fijarEstados(con(es, [f]), { enlace: 'e-21', estados: { entrada: 's-4', salida: 's-3' } }), 'no-ofrecido', 'R-FAN-5/5A');
    const mixto = con([es[0]!, { id: 'e-21', tipo: 'efecto', objeto: 'o-6', proceso: 'p-11', entrada: 's-7', salida: 's-8' }]);
    mal(fan.formarAbanico(mixto, { enlaces: ['e-20', 'e-21'], operador: 'XOR' }), 'no-ofrecido', 'R-FAN-5/5A');
});
test('T-250 rama no cambia tipo ni reancla fuera de geometría; DS-10 admite ruta', () => {
    const m = con([c('e-20', 'o-2'), c('e-21', 'o-6')], [f]);
    mal(enlace.cambiarTipoEnlace(m, { enlace: 'e-20', tipo: 'resultado' }), 'abanico');
    mal(enlace.reanclarExtremo(m, { opd: m.raiz, enlace: 'e-20', extremo: 'destino', hacia: { cosa: 'p-12' } }), 'abanico', 'R-FAN-GEO-2');
    expect(bien(enlace.fijarRuta(m, { enlace: 'e-20', ruta: 'A' })).abanicos[f.id]).toEqual(f);
});
test('T-053 disolver/quitar no dejan segundo procedimental plano, rollback DS-20', () => {
    const m = con([c('e-20', 'o-2', 'p-11', 's-3'), c('e-21', 'o-2', 'p-11', 's-4')], [f]);
    mal(fan.disolverAbanico(m, { abanico: f.id }), 'contexto', 'R-ROL-UNIC-1');
    mal(fan.quitarRama(m, { abanico: f.id, enlace: 'e-20' }), 'contexto', 'R-ROL-UNIC-1');
    expect(m.abanicos[f.id]).toEqual(f);
});
test('T-054 eliminar ramas disuelve fan pequeño con traza sin borrar superviviente', () => {
    const m = con([c('e-20', 'o-2'), c('e-21', 'o-6')], [f]);
    const r = enlace.eliminarEnlaces(m, { enlaces: ['e-20'] }), n = bien(r);
    expect(n.abanicos).toEqual({});
    expect(n.enlaces['e-21']).toEqual(m.enlaces['e-21']);
    if (r.ok)
        expect(r.trazas.some(t => t.regla === 'R-FAN-GEO-2')).toBe(true);
});
test('T-028 AND es ausencia de abanico y disolver devuelve todos los hechos con traza', () => {
    const m = con([c('e-20', 'o-2'), c('e-21', 'o-6')], [f]);
    const r = fan.disolverAbanico(m, { abanico: f.id }), n = bien(r);
    expect(n.abanicos).toEqual({});
    expect(n.enlaces).toBe(m.enlaces);
    expect(n.secuencia).toBe(m.secuencia);
    if (r.ok)
        expect(r.trazas.some(t => t.regla === 'R-FAN-GEO-2')).toBe(true);
});
test('T-054 agregarRama valida NO_OFRECIDO y pertenencia de un segundo abanico', () => {
    const es: Enlace[] = [{ id: 'e-20', tipo: 'efecto', objeto: 'o-2', proceso: 'p-11', entrada: 's-3', salida: 's-5' }, { id: 'e-21', tipo: 'efecto', objeto: 'o-2', proceso: 'p-11', entrada: 's-4', salida: 's-5' }, { id: 'e-23', tipo: 'efecto', objeto: 'o-2', proceso: 'p-11', entrada: 's-5', salida: 's-3' }];
    mal(fan.agregarRama(con(es, [f]), { abanico: f.id, enlace: 'e-23' }), 'no-ofrecido', 'R-FAN-5/5A');
    const otros = [c('e-20', 'o-2'), c('e-21', 'o-6'), c('e-23', 'o-9'), c('e-24', 'o-9', 'p-12')], m = con(otros, [f, { id: 'f-25', operador: 'OR', enlaces: ['e-23', 'e-24'] }]);
    mal(fan.agregarRama(m, { abanico: f.id, enlace: 'e-23' }), 'abanico', 'F-6');
});
test('T-053 abanicoCon inválido conserva secuencia, hechos y membresías', () => {
    const m = con([c('e-20', 'o-2')]), snapshot = JSON.stringify(m);
    mal(enlace.crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'resultado', objeto: 'o-2', proceso: 'p-11' }, abanicoCon: { enlace: 'e-20', operador: 'XOR' } }), 'abanico', 'R-FAN-GEO-2');
    expect(JSON.stringify(m)).toBe(snapshot);
    mal(enlace.crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'consumo', objeto: 'o-6', proceso: 'p-11' }, abanicoCon: { enlace: 'e-99', operador: 'OR' } }), 'no-encontrado');
});
