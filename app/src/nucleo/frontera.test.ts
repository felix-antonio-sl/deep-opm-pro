import { expect, test } from 'bun:test';
import { congelar } from '../pruebas/constructores';
import { proyectar } from './proyeccion';
import type { Modelo, EnlaceProcedimental, Id } from './tipos';
import type { Vista } from './proyeccion';

function ejemplo(tipos: readonly EnlaceProcedimental['tipo'][]): Modelo {
    const caja = { x: 0, y: 0, ancho: 140, alto: 60 };
    const procesos = ['p', 'primero', 'ultimo'];
    const enlaces: EnlaceProcedimental[] = tipos.map((tipo, i) => ({ id: `e${i}`, tipo, objeto: 'b', proceso: i === 0 ? 'primero' : 'ultimo',
        ...(tipo === 'efecto' ? { entrada: i === 0 ? 'a' : 'c', salida: i === 0 ? 'c' : 'd' } : { estado: i === 0 ? 'a' : 'd' }) }));
    return congelar({ id: 'm', nombre: 'Frontera', unidadTiempo: 'min', raiz: 'raiz', secuencia: 20,
        cosas: { b: { id: 'b', tipo: 'objeto', nombre: 'Objeto', esencia: 'fisica', afiliacion: 'sistemica', estados: ['a', 'c', 'd'].map(id => ({ id, nombre: id })) },
            ...Object.fromEntries(procesos.map(id => [id, { id, tipo: 'proceso', nombre: id, esencia: 'informacional', afiliacion: 'sistemica' }])) },
        enlaces: Object.fromEntries(enlaces.map(e => [e.id, e])), abanicos: {},
        opds: { raiz: { id: 'raiz', tipo: 'raiz', apariciones: { b: caja, p: caja } },
            hijo: { id: 'hijo', tipo: 'descomposicion', padre: 'raiz', cosa: 'p', orden: 0, objetosInternos: [], bandas: [['primero'], ['ultimo']], apariciones: { b: caja, p: caja, primero: caja, ultimo: caja } } }
    } as Modelo);
}

// Oráculo de ~40 líneas: recibe hechos del modelo, no el resultado ni auxiliares de proyectar.
// La expectativa de tipo proviene de la tabla literal, la de estados de bandas explícitas.
function firma(e: EnlaceProcedimental): string {
    return JSON.stringify([e.objeto, e.tipo, e.tipo === 'efecto' ? [e.entrada ?? null, e.salida ?? null] : [e.estado ?? null]]);
}
function fusionDelHijo(m: Modelo): readonly string[] {
    const hijo = m.opds.hijo!;
    if (hijo.tipo !== 'descomposicion') throw new Error('fixture no descompuesto');
    const internos = new Set(hijo.bandas.flat());
    const hechos = Object.values(m.enlaces).filter((e): e is EnlaceProcedimental => 'objeto' in e && e.objeto === 'b' && (e.proceso === hijo.cosa || internos.has(e.proceso)));
    const resultados = hechos.filter(e => e.tipo === 'resultado');
    const consumos = hechos.filter(e => e.tipo === 'consumo');
    if (resultados.length > 1 || consumos.length > 1 || (resultados.length && consumos.length))
        return [...new Set([...resultados, ...consumos].map(firma))].sort();
    if (resultados.length || consumos.length) return [firma((resultados[0] ?? consumos[0])!)];
    const efectos = hechos.filter(e => e.tipo === 'efecto');
    if (efectos.length) {
        const porTiempo = [...efectos].sort((a, b) => hijo.bandas.findIndex(banda => banda.includes(a.proceso)) - hijo.bandas.findIndex(banda => banda.includes(b.proceso)));
        const entrada = porTiempo.find(e => e.entrada !== undefined)?.entrada;
        const salida = [...porTiempo].reverse().find(e => e.salida !== undefined)?.salida;
        return [firma({ id: 'oraculo', tipo: 'efecto', objeto: 'b', proceso: hijo.cosa, ...(entrada ? { entrada } : {}), ...(salida ? { salida } : {}) })];
    }
    const agentes = hechos.filter(e => e.tipo === 'agente');
    const elegido = agentes[0] ?? hechos.find(e => e.tipo === 'instrumento');
    return elegido ? [firma(elegido)] : [];
}
function firmaPadre(v: Vista): readonly string[] {
    return [...new Set(v.enlaces.flatMap(({ enlace }) => 'objeto' in enlace && enlace.proceso === 'p' ? [firma(enlace)] : []))].sort();
}

for (const a of ['efecto', 'resultado', 'consumo'] as const) {
    for (const b of ['efecto', 'resultado', 'consumo'] as const) {
        test(`T-089 frontera ${a} + ${b} coincide con fusión independiente del hijo`, () => {
            const m = ejemplo([a, b]);
            const antes = JSON.stringify(m);
            expect(firmaPadre(proyectar(m, 'raiz'))).toEqual(fusionDelHijo(m));
            expect(proyectar(m, 'hijo').enlaces.map(e => e.enlace.id)).toEqual(['e0', 'e1']);
            expect(JSON.stringify(m)).toBe(antes);
        });
    }
}

test('T-089 frontera retiene transformación sobre habilitación con estados trazables', () => {
    const m = ejemplo(['instrumento', 'efecto']);
    expect(firmaPadre(proyectar(m, 'raiz'))).toEqual(fusionDelHijo(m));
    expect(firmaPadre(proyectar(m, 'raiz'))).toEqual(['["b","efecto",["c","d"]]']);
});

test('T-089 frontera del contorno DR-13 se incluye en ambos lados', () => {
    const base = ejemplo(['instrumento']);
    const e: EnlaceProcedimental = { id: 'e0', tipo: 'instrumento', objeto: 'b', proceso: 'p', estado: 'a' };
    const m = congelar({ ...base, enlaces: { e0: e } });
    expect(firmaPadre(proyectar(m, 'raiz'))).toEqual(fusionDelHijo(m));
    expect(proyectar(m, 'hijo').enlaces[0]?.enlace).toEqual(e);
});

test('T-089 oráculo detecta mutantes de tipo, estado y omisión de frontera', () => {
    const m = ejemplo(['efecto', 'efecto']);
    const v = proyectar(m, 'raiz');
    const e = v.enlaces[0]!;
    const mutantes: Vista[] = [
        { ...v, enlaces: [] },
        { ...v, enlaces: [{ ...e, enlace: { id: e.enlace.id, tipo: 'instrumento', objeto: 'b', proceso: 'p' } }] },
        { ...v, enlaces: [{ ...e, enlace: { id: e.enlace.id, tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'c', salida: 'd' } }] }
    ];
    for (const mutante of mutantes) expect(firmaPadre(mutante)).not.toEqual(fusionDelHijo(m));
});
