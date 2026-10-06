import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { importarV0 } from '../codec/importar';
import { eliminarRefinamiento } from './refinamiento';
import { congelar } from '../pruebas/constructores';
import type { Modelo, Enlace, EnlaceProcedimental, Id, Aparicion, Opd, Cosa, Control } from './tipos';
import { proyectar, etiquetaOpd, opdsEnPreorden } from './proyeccion';
import { indice } from './indice';
import { validarForma } from './forma';
import { noOfrecido, violacionesContexto, violacionesAbanico } from './matriz';

const caja: Aparicion = { x: 0, y: 0, ancho: 140, alto: 60 };
const apps = (...ids: Id[]): Record<Id, Aparicion> => Object.fromEntries(ids.map(id => [id, caja]));
const proceso = (id: Id): Cosa => ({ id, tipo: 'proceso', nombre: id, esencia: 'informacional', afiliacion: 'sistemica' });
const objeto = (id: Id): Cosa => ({ id, tipo: 'objeto', nombre: id, esencia: 'fisica', afiliacion: 'sistemica', estados: [0, 1, 2, 3].map(n => ({ id: `${id}${n}`, nombre: `estado${n}` })) });
function modelo(enlaces: readonly Enlace[] = [], cambios: Partial<Modelo> = {}): Modelo {
    return congelar({ id: 'modelo', nombre: 'Proyección', unidadTiempo: 'min', raiz: 'raiz', secuencia: 50,
        cosas: Object.fromEntries([objeto('b'), objeto('x'), objeto('y'), ...['p', 's1', 's2', 's3', 'z'].map(proceso)].map(c => [c.id, c])),
        enlaces: Object.fromEntries(enlaces.map(e => [e.id, e])), abanicos: {},
        opds: { raiz: { id: 'raiz', tipo: 'raiz', apariciones: apps('b', 'p', 'y', 'z') },
            hijo: { id: 'hijo', tipo: 'descomposicion', padre: 'raiz', cosa: 'p', orden: 0, bandas: [['s1'], ['s2'], ['s3']], objetosInternos: ['x'], apariciones: apps('b', 'p', 's1', 's2', 's3', 'x', 'y', 'z') } },
        ...cambios });
}
function procedimental(tipo: EnlaceProcedimental['tipo'], id: Id, proceso: Id, control?: Control): EnlaceProcedimental {
    return tipo === 'resultado' ? { id, tipo, objeto: 'b', proceso } : { id, tipo, objeto: 'b', proceso, ...(control ? { control } : {}) };
}

test('T-086 raíz proyecta hechos directos sin resolver colisiones de edición', () => {
    const m = modelo([{ id: 'a', tipo: 'agente', objeto: 'b', proceso: 'p' }, { id: 'e', tipo: 'efecto', objeto: 'b', proceso: 'p' }]);
    const v = proyectar(m, 'raiz');
    expect(v.clase).toBe('raiz');
    expect(v.cosas.map(c => [c.cosa, c.rol])).toEqual([['b', 'libre'], ['p', 'libre'], ['y', 'libre'], ['z', 'libre']]);
    expect(v.enlaces.map(e => [e.enlace.id, e.hechos, e.abstraido])).toEqual([['a', ['a'], false], ['e', ['e'], false]]);
    expect(v.conflictos).toEqual([]);
});

test('T-086 hijo oculta externos y conserva el contorno DR-13, internos y estructurales', () => {
    const m = modelo([
        { id: 'externos', tipo: 'consumo', objeto: 'y', proceso: 'z' },
        { id: 'contorno', tipo: 'instrumento', objeto: 'b', proceso: 'p' },
        { id: 'interno', tipo: 'efecto', objeto: 'x', proceso: 's1' },
        { id: 'estructura', tipo: 'agregacion', refinable: 'p', refinador: 's1' },
        { id: 'etiqueta', tipo: 'etiquetado', origen: 'x', destino: 'b' }
    ]);
    const v = proyectar(m, 'hijo');
    expect(v.enlaces.map(e => e.enlace.id)).toEqual(['contorno', 'interno', 'estructura', 'etiqueta']);
    expect(v.cosas.map(c => [c.cosa, c.rol, c.banda])).toEqual([
        ['b', 'externo', undefined], ['p', 'contenedor', undefined], ['s1', 'subproceso', 0], ['s2', 'subproceso', 1], ['s3', 'subproceso', 2], ['x', 'interno', undefined], ['y', 'externo', undefined], ['z', 'externo', undefined]
    ]);
});

test('T-086 abstracción recursiva eleva procesos, nunca objetos, estructurales ni etiquetados', () => {
    const base = modelo();
    const m = modelo([
        { id: 'profundo', tipo: 'consumo', objeto: 'b', proceso: 'ss' },
        { id: 'objeto-interno', tipo: 'efecto', objeto: 'x', proceso: 's1' },
        { id: 'estructura', tipo: 'agregacion', refinable: 'p', refinador: 's1' },
        { id: 'etiqueta', tipo: 'etiquetado', origen: 's1', destino: 'z' },
        { id: 'excepcion', tipo: 'excepcionSobretiempo', origen: 's1', destino: 's2' }
    ], { cosas: { ...base.cosas, ss: proceso('ss') }, opds: { ...base.opds,
        nieto: { id: 'nieto', tipo: 'descomposicion', padre: 'hijo', cosa: 's1', orden: 0, bandas: [['ss']], objetosInternos: [], apariciones: apps('s1', 'ss', 'b') }
    } });
    const v = proyectar(m, 'raiz');
    expect(v.enlaces.map(e => e.enlace)).toEqual([{ id: 'profundo', tipo: 'consumo', objeto: 'b', proceso: 'p' }]);
    expect(v.enlaces[0]?.hechos).toEqual(['profundo']);
    expect(v.enlaces[0]?.abstraido).toBe(true);
});

test('T-086 DEC32 invocación interna elevada y excepción desaparecen en padre', () => {
    const v = proyectar(modelo([
        { id: 'inv', tipo: 'invocacion', origen: 's1', destino: 's2' },
        { id: 'exc', tipo: 'excepcionSubtiempo', origen: 's1', destino: 's2' }
    ]), 'raiz');
    expect(v.enlaces).toEqual([]);
});

test('T-086 despliegue muestra refinable/refinadores del modo y oculta externos sin abstraerlos', () => {
    const base = modelo();
    const m = modelo([
        { id: 'parte', tipo: 'agregacion', refinable: 'b', refinador: 'x' },
        { id: 'otra-relacion', tipo: 'exhibicion', refinable: 'b', refinador: 'y' },
        { id: 'externos', tipo: 'consumo', objeto: 'y', proceso: 'z' },
        { id: 'interior', tipo: 'instrumento', objeto: 'x', proceso: 'z' }
    ], { opds: { raiz: base.opds.raiz!, despliegue: { id: 'despliegue', tipo: 'despliegue', padre: 'raiz', cosa: 'b', modo: 'agregacion', orden: 0, apariciones: apps('b', 'x', 'y', 'z') } } });
    const v = proyectar(m, 'despliegue');
    expect(v.clase).toBe('despliegue');
    expect(v.cosas.map(c => [c.cosa, c.rol])).toEqual([['b', 'refinable'], ['x', 'interno'], ['y', 'externo'], ['z', 'externo']]);
    expect(v.enlaces.map(e => e.enlace.id)).toEqual(['parte', 'otra-relacion', 'interior']);
    expect(proyectar(m, 'raiz').enlaces.map(e => e.enlace.id)).toEqual(['otra-relacion', 'externos']);
});

// Literales transcritos de CANON §3.5: el nivel principal no intercambia controles.
const fuerzas: readonly [number, EnlaceProcedimental['tipo'], Control | undefined][] = [
    [1, 'consumo', 'e'], [2, 'consumo', undefined], [2, 'resultado', undefined], [3, 'consumo', 'c'],
    [4, 'efecto', 'e'], [5, 'efecto', undefined], [6, 'efecto', 'c'],
    [7, 'agente', 'e'], [8, 'agente', undefined], [9, 'agente', 'c'],
    [10, 'instrumento', 'e'], [11, 'instrumento', undefined], [12, 'instrumento', 'c']
];
for (const [nivel, tipo, control] of fuerzas) {
    test(`T-085 fuerza ${nivel}: ${tipo} ${control ?? 'base'} retiene clase y control`, () => {
        const rival = tipo === 'instrumento' ? procedimental('instrumento', 'rival', 's2', 'c') : procedimental('instrumento', 'rival', 's2', 'e');
        const v = proyectar(modelo([procedimental(tipo, 'fuerte', 's1', control), rival]), 'raiz');
        expect(v.enlaces).toHaveLength(1);
        expect(v.enlaces[0]?.enlace).toEqual({ id: 'fuerte', tipo, objeto: 'b', proceso: 'p', ...(control ? { control } : {}) });
        expect(v.enlaces[0]?.hechos).toEqual(['fuerte', 'rival']);
    });
}
for (const tipo of ['efecto', 'agente', 'instrumento'] as const) {
    for (const [a, b, esperado] of [['c', undefined, undefined], [undefined, 'e', 'e'], ['c', 'e', 'e']] as const) {
        test(`T-085 control dentro de ${tipo}: ${a ?? 'base'} + ${b ?? 'base'}`, () => {
            const v = proyectar(modelo([procedimental(tipo, 'a', 's1', a), procedimental(tipo, 'b', 's2', b)]), 'raiz');
            expect(v.enlaces).toHaveLength(1);
            const e = v.enlaces[0]!.enlace;
            expect('control' in e ? e.control : undefined).toBe(esperado);
        });
    }
}
const celdas: readonly [EnlaceProcedimental['tipo'], EnlaceProcedimental['tipo'], EnlaceProcedimental['tipo'] | readonly EnlaceProcedimental['tipo'][], 'precedencia-invalida' | 'conflicto-resultado-consumo' | undefined][] = [
    ['efecto', 'efecto', 'efecto', undefined], ['efecto', 'resultado', ['efecto', 'resultado'], 'precedencia-invalida'], ['efecto', 'consumo', 'consumo', undefined],
    ['resultado', 'efecto', 'resultado', undefined], ['resultado', 'resultado', ['resultado', 'resultado'], 'precedencia-invalida'], ['resultado', 'consumo', ['resultado', 'consumo'], 'conflicto-resultado-consumo'],
    ['consumo', 'efecto', ['consumo', 'efecto'], 'precedencia-invalida'], ['consumo', 'resultado', ['consumo', 'resultado'], 'conflicto-resultado-consumo'], ['consumo', 'consumo', ['consumo', 'consumo'], 'precedencia-invalida']
];
for (const [a, b, esperado, codigo] of celdas) {
    test(`T-085 R-PREC ${a} + ${b}`, () => {
        const m = modelo([procedimental(a, 'a', 's1'), procedimental(b, 'b', 's2')]);
        const v = proyectar(m, 'raiz');
        expect(v.enlaces.map(e => e.enlace.tipo)).toEqual(typeof esperado === 'string' ? [esperado] : [...esperado]);
        expect(v.conflictos.map(d => d.codigo)).toEqual(codigo ? [codigo] : []);
        if (codigo) {
            expect(v.enlaces.map(e => e.hechos)).toEqual([['a'], ['b']]);
            expect(v.conflictos[0]).toMatchObject({ regla: codigo === 'precedencia-invalida' ? 'R-PREC-1' : 'R-PREC-3', familia: 'contencion', severidad: codigo === 'precedencia-invalida' ? 'error' : 'warning', opd: 'raiz', refs: [{ tipo: 'enlace', id: 'a' }, { tipo: 'enlace', id: 'b' }] });
        } else {
            expect(v.enlaces[0]?.hechos).toEqual(['a', 'b']);
            expect(v.enlaces[0]?.enlace.id).toBe('a');
        }
    });
}

for (const [a, b, tipo, control] of [
    [procedimental('efecto', 'a', 's1', 'e'), procedimental('resultado', 'b', 's2'), 'resultado', undefined],
    [procedimental('consumo', 'a', 's1', 'c'), procedimental('efecto', 'b', 's2', 'e'), 'consumo', 'c'],
    [procedimental('efecto', 'a', 's1', 'c'), procedimental('agente', 'b', 's2', 'e'), 'efecto', 'c']
] as const) {
    test(`T-085 contraejemplo no transfiere control ${a.tipo} + ${b.tipo}`, () => {
        const base = modelo(), h = base.opds.hijo!; if (h.tipo !== 'descomposicion') throw Error('montaje');
        const e = proyectar(modelo([a, b], { opds: { ...base.opds, hijo: { ...h, bandas: [['s1', 's2'], ['s3']] } } }), 'raiz').enlaces[0]!.enlace;
        expect(e.tipo).toBe(tipo);
        expect('control' in e ? e.control : undefined).toBe(control);
        if (tipo === 'resultado') expect(Object.hasOwn(e, 'control')).toBe(false);
    });
}

test('T-085 efectos usan entrada temprana y salida tardía por banda, no orden del mapa', () => {
    const v = proyectar(modelo([
        { id: 'tarde', tipo: 'efecto', objeto: 'b', proceso: 's3', entrada: 'b2', salida: 'b3' },
        { id: 'temprano', tipo: 'efecto', objeto: 'b', proceso: 's1', entrada: 'b0', salida: 'b1' },
        { id: 'medio', tipo: 'efecto', objeto: 'b', proceso: 's2', entrada: 'b1', salida: 'b2' }
    ]), 'raiz');
    expect(v.enlaces[0]?.enlace).toEqual({ id: 'tarde', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b0', salida: 'b3' });
    expect(v.enlaces[0]?.hechos).toEqual(['tarde', 'temprano', 'medio']);
});

test('T-085 par escindido vuelve a TS3 sin conservar metadatos de mitad en la vista', () => {
    const v = proyectar(modelo([
        { id: 'entrada', tipo: 'efecto', objeto: 'b', proceso: 's1', entrada: 'b0', escision: { par: 'par', mitad: 'entrada' } },
        { id: 'salida', tipo: 'efecto', objeto: 'b', proceso: 's3', salida: 'b3', escision: { par: 'par', mitad: 'salida' } }
    ]), 'raiz');
    expect(v.enlaces[0]?.enlace).toEqual({ id: 'entrada', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b0', salida: 'b3' });
    expect(v.enlaces[0]?.hechos).toEqual(['entrada', 'salida']);
});

test('T-085 conflictos múltiples no desaparecen por orden de fusión ni por habilitadores', () => {
    const v = proyectar(modelo([
        procedimental('efecto', 'e', 's1'), procedimental('resultado', 'r1', 's2'), procedimental('resultado', 'r2', 's3'), procedimental('agente', 'a', 's1')
    ]), 'raiz');
    expect(v.enlaces.map(e => e.enlace.tipo)).toEqual(['efecto', 'resultado', 'resultado']);
    expect(v.conflictos.map(d => d.codigo)).toEqual(['precedencia-invalida']);
    expect(new Set(v.enlaces.flatMap(e => e.hechos))).toEqual(new Set(['e', 'r1', 'r2', 'a']));
});

test('T-086 abanico intacto conserva operador, ramas y común; rama invisible lo oculta', () => {
    const base = modelo([{ ...procedimental('instrumento', 'a', 's1'), objeto: 'x' }, { ...procedimental('instrumento', 'b', 'z'), objeto: 'x' }]);
    const m = congelar({ ...base, abanicos: { f: { id: 'f', operador: 'XOR' as const, enlaces: ['a', 'b'] } } });
    expect(proyectar(m, 'hijo').abanicos).toEqual([{ abanico: 'f', operador: 'XOR', ramas: ['a', 'b'], comun: 'x' }]);
    const hijo = m.opds.hijo!;
    const { z: omitida, ...apariciones } = hijo.apariciones; void omitida;
    const sinProceso = congelar({ ...m, opds: { ...m.opds, hijo: { ...hijo, apariciones } } });
    expect(proyectar(sinProceso, 'hijo').abanicos).toEqual([]);
});

test('T-086 ramas de consumo del mismo abanico colapsan sin inventar conflicto R-PREC', () => {
    const base = modelo([procedimental('consumo', 'a', 's1'), procedimental('consumo', 'b', 's2')]);
    const v = proyectar(congelar({ ...base, abanicos: { f: { id: 'f', operador: 'OR' as const, enlaces: ['a', 'b'] } } }), 'raiz');
    expect(v.abanicos).toEqual([]);
    expect(v.enlaces).toHaveLength(1);
    expect(v.enlaces[0]?.enlace.tipo).toBe('consumo');
    expect(v.enlaces[0]?.hechos).toEqual(['a', 'b']);
    expect(v.conflictos).toEqual([]);
});

for (const [tipo, ajeno, codigo] of [
    ['consumo', 'resultado', 'conflicto-resultado-consumo'],
    ['consumo', 'consumo', 'precedencia-invalida'],
    ['resultado', 'resultado', 'precedencia-invalida']
] as const) {
    test(`T-086 abanico ${tipo} colapsado permanece único ante ${ajeno} ajeno`, () => {
        const base = modelo([procedimental(tipo, 'a', 's1'), procedimental(tipo, 'b', 's2'), procedimental(ajeno, 'ajeno', 's3')]);
        const m = congelar({ ...base, abanicos: { f: { id: 'f', operador: 'OR' as const, enlaces: ['a', 'b'] } } });
        const v = proyectar(m, 'raiz');
        expect(v.enlaces).toHaveLength(2);
        expect(v.enlaces[0]?.enlace.tipo).toBe(tipo);
        expect(v.enlaces[0]?.hechos).toEqual(['a', 'b']);
        expect(v.enlaces[1]?.hechos).toEqual(['ajeno']);
        expect(v.conflictos.map(d => d.codigo)).toEqual([codigo]);
        expect(v.conflictos[0]?.refs).toEqual([{ tipo: 'enlace', id: 'a' }, { tipo: 'enlace', id: 'b' }, { tipo: 'enlace', id: 'ajeno' }]);
        expect(v.abanicos).toEqual([]);
    });
}

for (const tipos of [['consumo', 'resultado'], ['resultado', 'consumo'], ['consumo', 'consumo', 'resultado'], ['resultado', 'resultado', 'consumo']] as const) {
    test(`T-086 abanico mixto cargable conserva clases transformadoras ${tipos.join('+')}`, () => {
        const enlaces = tipos.map((tipo, i) => procedimental(tipo, `e${i}`, `s${i + 1}`));
        const m = modelo(enlaces, { abanicos: { f: { id: 'f', operador: 'OR', enlaces: enlaces.map(e => e.id) } } });
        // P8 permite cargar errores de contexto; no se eluden los validadores reales de forma/F-5.
        expect(validarForma(m)).toEqual([]);
        for (const e of enlaces) expect(noOfrecido(m, e, m.abanicos.f)).toBeNull();
        const v = proyectar(m, 'raiz');
        expect(v.conflictos.map(d => d.codigo)).toEqual(['conflicto-resultado-consumo']);
        expect(v.enlaces).toHaveLength(2);
        expect(v.enlaces.map(e => e.enlace.tipo).sort()).toEqual(['consumo', 'resultado']);
        for (const tipo of ['consumo', 'resultado'])
            expect(v.enlaces.find(e => e.enlace.tipo === tipo)?.hechos).toEqual(enlaces.filter(e => e.tipo === tipo).map(e => e.id));
        expect(v.conflictos[0]?.refs.map(r => r.id).sort()).toEqual(enlaces.map(e => e.id).sort());
        expect(v.abanicos).toEqual([]);
    });
}

for (const profundidad of [16, 32, 64, 128]) {
    test(`T-085 coste estructural lineal con ${profundidad} niveles anidados, índice precalentado`, () => {
        const cosas: Record<Id, Cosa> = { b: objeto('b'), p0: proceso('p0') };
        const enlaces: Record<Id, Enlace> = {};
        const opds: Record<Id, Opd> = { raiz: { id: 'raiz', tipo: 'raiz', apariciones: apps('b', 'p0') } };
        for (let i = 1; i <= profundidad; i++) {
            cosas[`p${i}`] = proceso(`p${i}`); cosas[`q${i}`] = proceso(`q${i}`);
            opds[`opd${i}`] = { id: `opd${i}`, tipo: 'descomposicion', padre: i === 1 ? 'raiz' : `opd${i - 1}`, cosa: `p${i - 1}`, orden: 0,
                bandas: [[`p${i}`], [`q${i}`]], objetosInternos: [], apariciones: apps('b', `p${i - 1}`, `p${i}`, `q${i}`) };
            enlaces[`e${i}`] = { id: `e${i}`, tipo: 'efecto', objeto: 'b', proceso: `p${i}`, entrada: 'b0', salida: 'b3' };
        }
        let accesos = 0;
        const observados = new Proxy(opds, { get(target, key, receiver) { if (typeof key === 'string' && Object.hasOwn(target, key)) accesos++; return Reflect.get(target, key, receiver); } });
        const m = modelo([], { cosas, enlaces, opds: observados });
        indice(m); accesos = 0;
        const v = proyectar(m, 'raiz');
        expect(v.enlaces).toHaveLength(1);
        expect(v.enlaces[0]?.hechos).toHaveLength(profundidad);
        expect(v.enlaces[0]?.enlace).toMatchObject({ entrada: 'b0', salida: 'b3' });
        expect(accesos).toBeLessThanOrEqual(8 * profundidad + 8);
    });
}

test('T-086 rama directa de abanico conserva su carácter directo ante conflicto abstraído', () => {
    const base = modelo([procedimental('consumo', 'directo', 'p'), procedimental('consumo', 'otra', 'z'), procedimental('resultado', 'r', 's1')]);
    const v = proyectar(congelar({ ...base, abanicos: { f: { id: 'f', operador: 'OR' as const, enlaces: ['directo', 'otra'] } } }), 'raiz');
    expect(v.enlaces.find(e => e.hechos.includes('directo'))?.abstraido).toBe(false);
    expect(v.enlaces.find(e => e.hechos.includes('r'))?.abstraido).toBe(true);
    expect(v.conflictos.map(d => d.codigo)).toEqual(['conflicto-resultado-consumo']);
    expect(v.abanicos).toEqual([{ abanico: 'f', operador: 'OR', ramas: ['directo', 'otra'], comun: 'b' }]);
});

test('T-085 abanico colapsado en conflicto retiene control y estado de su clase', () => {
    const base = modelo([
        { id: 'a', tipo: 'consumo', objeto: 'b', proceso: 's1', estado: 'b0', control: 'c' },
        { id: 'b', tipo: 'consumo', objeto: 'b', proceso: 's2', estado: 'b2', control: 'e' },
        procedimental('resultado', 'r', 's3')
    ]);
    const v = proyectar(congelar({ ...base, abanicos: { f: { id: 'f', operador: 'OR' as const, enlaces: ['a', 'b'] } } }), 'raiz');
    expect(v.enlaces[0]?.enlace).toEqual({ id: 'a', tipo: 'consumo', objeto: 'b', proceso: 'p', estado: 'b2', control: 'e' });
    expect(v.enlaces[0]?.hechos).toEqual(['a', 'b']);
    expect(v.conflictos.map(d => d.codigo)).toEqual(['conflicto-resultado-consumo']);
});

test('T-085 orden temporal comparte prefijos paralelos y distingue banda exterior tardía', () => {
    const base = modelo();
    const hijo = base.opds.hijo!; if (hijo.tipo !== 'descomposicion') throw new Error('fixture');
    const m = modelo([
        { id: 'primero-en-mapa', tipo: 'efecto', objeto: 'b', proceso: 'ss2', entrada: 'b1', salida: 'b2' },
        { id: 'segundo-en-mapa', tipo: 'efecto', objeto: 'b', proceso: 'ss1', entrada: 'b0', salida: 'b3' },
        { id: 'tardio', tipo: 'efecto', objeto: 'b', proceso: 's3', entrada: 'b2', salida: 'b0' }
    ], { cosas: { ...base.cosas, ss1: proceso('ss1'), ss2: proceso('ss2') }, opds: {
        ...base.opds, hijo: { ...hijo, bandas: [['s1', 's2'], ['s3']] },
        nieto1: { id: 'nieto1', tipo: 'descomposicion', padre: 'hijo', cosa: 's1', orden: 0, bandas: [['ss1']], objetosInternos: [], apariciones: apps('s1', 'ss1', 'b') },
        nieto2: { id: 'nieto2', tipo: 'descomposicion', padre: 'hijo', cosa: 's2', orden: 1, bandas: [['ss2']], objetosInternos: [], apariciones: apps('s2', 'ss2', 'b') }
    } });
    expect(proyectar(m, 'raiz').enlaces[0]?.enlace).toEqual({ id: 'primero-en-mapa', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b1', salida: 'b0' });
});

test('T-086 abanico colapsado produce un único enlace fusionado, no ramas degeneradas', () => {
    const base = modelo([procedimental('instrumento', 'a', 's1'), procedimental('instrumento', 'b', 's2')]);
    const v = proyectar(congelar({ ...base, abanicos: { f: { id: 'f', operador: 'OR' as const, enlaces: ['a', 'b'] } } }), 'raiz');
    expect(v.abanicos).toEqual([]);
    expect(v.enlaces).toHaveLength(1);
    expect(v.enlaces[0]?.hechos).toEqual(['a', 'b']);
});

test('T-018 estados visibles en orden, anclados localmente vencen supresión global y local', () => {
    const base = modelo();
    const b = base.cosas.b!; if (b.tipo !== 'objeto') throw new Error('fixture');
    const m = modelo([{ id: 'visible', tipo: 'efecto', objeto: 'b', proceso: 's1', entrada: 'b0', salida: 'b2' }, { id: 'otra-vista', tipo: 'efecto', objeto: 'b', proceso: 'z', entrada: 'b1' }], {
        cosas: { ...base.cosas, b: { ...b, estados: b.estados.map(s => ({ ...s, suprimido: true })) } },
        opds: { ...base.opds, hijo: { ...base.opds.hijo!, apariciones: { ...base.opds.hijo!.apariciones, b: { ...caja, ocultos: ['b0', 'b1', 'b2'] } } } }
    });
    expect(proyectar(m, 'hijo').cosas.find(c => c.cosa === 'b')).toMatchObject({ estadosVisibles: ['b0', 'b2'], ocultos: 2 });
    expect(proyectar(m, 'raiz').cosas.find(c => c.cosa === 'b')).toMatchObject({ estadosVisibles: ['b0', 'b1', 'b2'], ocultos: 1 });
});

test('T-018 anclajes estructurales y etiquetados también fuerzan solo estados propios', () => {
    const base = modelo();
    const b = base.cosas.b!; if (b.tipo !== 'objeto') throw new Error('fixture');
    const m = modelo([{ id: 'g', tipo: 'generalizacion', refinable: 'b', refinador: 'y', estados: { general: 'b0', especializacion: 'y1' } },
        { id: 't', tipo: 'etiquetado', origen: 'b', destino: 'y', estadoOrigen: 'b2', estadoDestino: 'y2' }], {
        cosas: { ...base.cosas, b: { ...b, estados: b.estados.map(s => ({ ...s, suprimido: true })) } }
    });
    expect(proyectar(m, 'raiz').cosas.find(c => c.cosa === 'b')).toMatchObject({ estadosVisibles: ['b0', 'b2'], ocultos: 2 });
});

test('T-018 sin anclajes la supresión global y local actúan de forma independiente', () => {
    const base = modelo();
    const b = base.cosas.b!; if (b.tipo !== 'objeto') throw new Error('fixture');
    const m = modelo([], {
        cosas: { ...base.cosas, b: { ...b, estados: b.estados.map(s => s.id === 'b0' ? { ...s, suprimido: true } : s) } },
        opds: { ...base.opds, raiz: { ...base.opds.raiz!, apariciones: { ...base.opds.raiz!.apariciones, b: { ...caja, ocultos: ['b1'] } } } }
    });
    expect(proyectar(m, 'raiz').cosas.find(c => c.cosa === 'b')).toMatchObject({ estadosVisibles: ['b2', 'b3'], ocultos: 2 });
    expect(proyectar(m, 'hijo').cosas.find(c => c.cosa === 'b')).toMatchObject({ estadosVisibles: ['b1', 'b2', 'b3'], ocultos: 1 });
});

test('T-092 estados heredados no se agregan a la expresión del objeto especializado', () => {
    const m = modelo([{ id: 'g', tipo: 'generalizacion', refinable: 'b', refinador: 'y' }]);
    expect(proyectar(m, 'raiz').cosas.find(c => c.cosa === 'y')?.estadosVisibles).toEqual(['y0', 'y1', 'y2', 'y3']);
});

test('T-087 colección incompleta declarada y refinador omitido se derivan sin duplicar declaración', () => {
    const base = modelo();
    const b = base.cosas.b!;
    const m = modelo([{ id: 'a', tipo: 'agregacion', refinable: 'b', refinador: 'x' }, { id: 'g', tipo: 'generalizacion', refinable: 'b', refinador: 'y' }], {
        cosas: { ...base.cosas, b: { ...b, incompleta: ['agregacion', 'exhibicion'] } }
    });
    expect(proyectar(m, 'raiz').incompletas).toEqual([
        { refinable: 'b', relacion: 'agregacion', declarada: true }, { refinable: 'b', relacion: 'exhibicion', declarada: true }
    ]);
    const sinDeclarar = modelo(Object.values(m.enlaces));
    expect(proyectar(sinDeclarar, 'raiz').incompletas).toEqual([{ refinable: 'b', relacion: 'agregacion', declarada: false }]);
});

test('T-031 preorden y etiquetas delegan al índice y mutan sin cambiar ids persistentes', () => {
    const base = modelo();
    const opds: Record<Id, Opd> = { ...base.opds,
        segundo: { id: 'segundo', tipo: 'despliegue', padre: 'raiz', cosa: 'b', modo: 'agregacion', orden: 1, apariciones: apps('b') },
        nieto: { id: 'nieto', tipo: 'despliegue', padre: 'hijo', cosa: 'x', modo: 'exhibicion', orden: 0, apariciones: apps('x') }
    };
    const m = modelo([], { opds });
    expect(opdsEnPreorden(m)).toEqual(['raiz', 'hijo', 'nieto', 'segundo']);
    expect(opdsEnPreorden(m)).toBe(indice(m).preorden);
    expect(opdsEnPreorden(m).map(o => etiquetaOpd(m, o))).toEqual(['SD', 'SD1', 'SD1.1', 'SD2']);
    const siguiente = modelo([], { opds: { raiz: opds.raiz!, segundo: opds.segundo! } });
    expect(etiquetaOpd(siguiente, 'segundo')).toBe('SD1');
    expect(siguiente.opds.segundo?.id).toBe('segundo');
    expect(etiquetaOpd(m, 'segundo')).toBe('SD2');
});

test('T-086 proyección es pura, memoiza modelo/OPD y claves no dependen de posiciones', () => {
    const m = modelo([procedimental('instrumento', 'a', 's1')]);
    const antes = JSON.stringify(m);
    const v = proyectar(m, 'raiz');
    expect(proyectar(m, 'raiz')).toBe(v);
    expect(proyectar(m, 'hijo')).not.toBe(v);
    expect(proyectar({ ...m }, 'raiz')).not.toBe(v);
    expect(JSON.stringify(m)).toBe(antes);
    const movido = congelar({ ...m, opds: { ...m.opds, raiz: { ...m.opds.raiz!, apariciones: { ...m.opds.raiz!.apariciones, p: { ...caja, x: 450 } } } } });
    expect(proyectar(movido, 'raiz').enlaces[0]?.clave).toBe(v.enlaces[0]?.clave);
    const cambiado = modelo([{ id: 'a', tipo: 'instrumento', objeto: 'b', proceso: 's1', estado: 'b0', control: 'e' }]);
    expect(proyectar(cambiado, 'raiz').enlaces[0]?.clave).not.toBe(v.enlaces[0]?.clave);
});

// R-PREC-2: oráculos nuevos literales, sobre hechos y bandas originales.
function cadenaRcp(anidado = false, paralelo = false, rota = false): Modelo {
    const base = modelo();
    const rutas = anidado ? ['n1', 'n2', 's3'] : ['s1', 's2', 's3'];
    const enlaces: Enlace[] = [
        { id: 'r', tipo: 'resultado', objeto: 'b', proceso: rutas[0]!, estado: 'b0' },
        { id: 'e', tipo: 'efecto', objeto: 'b', proceso: rutas[1]!, entrada: rota ? 'b3' : 'b0', salida: 'b1', control: 'e' },
        { id: 'c', tipo: 'consumo', objeto: 'b', proceso: rutas[2]!, estado: 'b1', control: 'c' },
    ];
    const hijo = base.opds.hijo!; if (hijo.tipo !== 'descomposicion') throw new Error('montaje');
    if (!anidado) return modelo(enlaces, { opds: { ...base.opds, hijo: { ...hijo, bandas: paralelo ? [['s1', 's2'], ['s3']] : hijo.bandas } } });
    return modelo(enlaces, { cosas: { ...base.cosas, n1: proceso('n1'), n2: proceso('n2') }, opds: { ...base.opds,
        hijo: { ...hijo, bandas: paralelo ? [['s1', 's2'], ['s3']] : hijo.bandas },
        a: { id: 'a', tipo: 'descomposicion', padre: 'hijo', cosa: 's1', orden: 0, objetosInternos: [], bandas: [['n1']], apariciones: apps('b', 's1', 'n1') },
        bOpd: { id: 'bOpd', tipo: 'descomposicion', padre: 'hijo', cosa: 's2', orden: 1, objetosInternos: [], bandas: [['n2']], apariciones: apps('b', 's2', 'n2') },
    } });
}
for (const invertido of [false, true]) {
    test(`T-085 RCP directo con continuidad por ID, orden de mapa ${invertido ? 'C-R' : 'R-C'}`, () => {
        const es: Enlace[] = [{ id: 'r', tipo: 'resultado', objeto: 'b', proceso: 's1', estado: 'b1' }, { id: 'c', tipo: 'consumo', objeto: 'b', proceso: 's3', estado: 'b1', control: 'c' }];
        const m = modelo(invertido ? [...es].reverse() : es), antes = JSON.stringify(m);
        expect(validarForma(m)).toEqual([]);
        const v = proyectar(m, 'raiz');
        expect(v.conflictos).toEqual([]); expect(v.enlaces).toHaveLength(1);
        expect(v.enlaces[0]!.enlace).toEqual({ id: invertido ? 'c' : 'r', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b1', salida: 'b1', control: 'c' });
        expect(v.enlaces[0]!.hechos).toEqual(invertido ? ['c', 'r'] : ['r', 'c']);
        expect(v.enlaces[0]!.abstraido).toBe(true); expect(JSON.stringify(m)).toBe(antes);
    });
}
for (const anidado of [false, true]) {
    test(`T-085 RCP cadena R→E→C ${anidado ? 'anidada secuencial' : 'secuencial'} conserva firma, control y procedencia`, () => {
        const m = cadenaRcp(anidado), antes = JSON.stringify(m), v = proyectar(m, 'raiz');
        expect(validarForma(m)).toEqual([]);
        expect(v.conflictos).toEqual([]); expect(v.enlaces).toHaveLength(1);
        expect(v.enlaces[0]!.enlace).toEqual({ id: 'r', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b0', salida: 'b1', control: 'e' });
        expect(v.enlaces[0]!.hechos).toEqual(['r', 'e', 'c']); expect(JSON.stringify(m)).toBe(antes);
    });
}
for (const [anidado, paralelo, rota] of [[false, false, true], [true, false, true], [false, true, false], [true, true, false]] as const) {
    test(`T-085 RCP sin testigo anidado=${anidado} paralelo=${paralelo} rota=${rota} conserva ambos y warning`, () => {
        const m = cadenaRcp(anidado, paralelo, rota), v = proyectar(m, 'raiz');
        expect(validarForma(m)).toEqual([]);
        expect(v.enlaces.map(e => e.enlace.tipo)).toEqual(['resultado', 'consumo']);
        expect(new Set(v.enlaces.flatMap(e => e.hechos))).toEqual(new Set(['r', 'e', 'c']));
        expect(v.conflictos).toEqual([expect.objectContaining({ codigo: 'conflicto-resultado-consumo', regla: 'R-PREC-3', familia: 'contencion', severidad: 'warning', opd: 'raiz' })]);
    });
}
for (const caso of ['sin-estado', 'inverso-temporal', 'misma-banda', 'mismo-nombre-otro-ID', 'estado-ajeno', 'efecto-sin-salida', 'padre-descendiente'] as const) {
    test(`T-085 RCP continuidad por identidad y DEC31: ${caso}`, () => {
        const base = modelo();
        const b = base.cosas.b!; if (b.tipo !== 'objeto') throw new Error('montaje');
        const es: Enlace[] = [{ id: 'r', tipo: 'resultado', objeto: 'b', proceso: caso === 'inverso-temporal' ? 's3' : caso === 'padre-descendiente' ? 'p' : 's1', ...(caso === 'sin-estado' ? {} : { estado: caso === 'estado-ajeno' ? 'x0' : 'b0' }) },
            { id: 'c', tipo: 'consumo', objeto: 'b', proceso: caso === 'inverso-temporal' ? 's1' : caso === 'misma-banda' ? 's1' : 's3', estado: caso === 'mismo-nombre-otro-ID' ? 'b1' : 'b0' }];
        if (caso === 'efecto-sin-salida') es.push({ id: 'e', tipo: 'efecto', objeto: 'b', proceso: 's2', entrada: 'b0' });
        const m = modelo(es, caso === 'mismo-nombre-otro-ID' ? { cosas: { ...base.cosas, b: { ...b, estados: b.estados.map(s => ({ ...s, nombre: 'igual' })) } } } : {});
        const v = proyectar(m, 'raiz');
        if (caso === 'inverso-temporal') {
            // DEC31: C→R es temporalmente válido con el mismo estado por identidad.
            expect(v.enlaces.map(e => e.enlace)).toEqual([{ id: 'r', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b0', salida: 'b0' }]);
            expect(v.conflictos).toEqual([]);
        } else {
            expect(v.enlaces.map(e => e.enlace.tipo)).toEqual(['resultado', 'consumo']);
            expect(v.conflictos[0]).toMatchObject({ codigo: 'conflicto-resultado-consumo', severidad: 'warning', familia: 'contencion' });
        }
        expect(new Set(v.enlaces.flatMap(e => e.hechos))).toEqual(new Set(es.map(e => e.id)));
    });
}

test('T-018 RCP efecto recombinado fuerza visibles estados propios ocultos y conserva identidad', () => {
    const base = cadenaRcp(), b = base.cosas.b!; if (b.tipo !== 'objeto') throw new Error('montaje');
    const m = congelar({ ...base, cosas: { ...base.cosas, b: { ...b, estados: b.estados.map(s => ({ ...s, suprimido: true as const })) } }, opds: { ...base.opds, raiz: { ...base.opds.raiz!, apariciones: { ...base.opds.raiz!.apariciones, b: { ...caja, ocultos: ['b0', 'b1', 'b2', 'b3'] } } } } });
    const antes = JSON.stringify(m);
    expect(proyectar(m, 'raiz').cosas.find(c => c.cosa === 'b')?.estadosVisibles).toEqual(['b0', 'b1']);
    expect(JSON.stringify(m)).toBe(antes); expect(base.cosas.b).toBe(b);
});

test('T-085 RCP cadena vuelve al mismo estado por hechos distintos y no por nombres; orden del mapa independiente', () => {
    const es: Enlace[] = [{ id: 'r', tipo: 'resultado', objeto: 'b', proceso: 's1', estado: 'b0' },
        { id: 'e1', tipo: 'efecto', objeto: 'b', proceso: 's2', entrada: 'b0', salida: 'b1', control: 'c' },
        { id: 'e2', tipo: 'efecto', objeto: 'b', proceso: 's3', entrada: 'b1', salida: 'b0', control: 'c' },
        { id: 'c', tipo: 'consumo', objeto: 'b', proceso: 's4', estado: 'b0', control: 'c' },
        { id: 'habilitador', tipo: 'agente', objeto: 'b', proceso: 's1', control: 'e' }];
    const base = modelo(), hijo = base.opds.hijo!; if (hijo.tipo !== 'descomposicion') throw new Error('montaje');
    const m = modelo([...es].reverse(), { cosas: { ...base.cosas, s4: proceso('s4') }, opds: { ...base.opds, hijo: { ...hijo, bandas: [['s1'], ['s2'], ['s3'], ['s4']], apariciones: { ...hijo.apariciones, s4: caja } } } });
    const antes = JSON.stringify(m), v = proyectar(m, 'raiz');
    expect(validarForma(m)).toEqual([]); expect(v.conflictos).toEqual([]);
    expect(v.enlaces).toHaveLength(1);
    expect(v.enlaces[0]!.enlace).toEqual({ id: 'habilitador', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b0', salida: 'b0', control: 'c' });
    expect(v.enlaces[0]!.hechos).toEqual(['habilitador', 'c', 'e2', 'e1', 'r']); expect(JSON.stringify(m)).toBe(antes);
});
for (const profundidad of [16, 32, 64, 128]) {
    test(`T-085 RCP consultas compartidas con ${profundidad} niveles y pares, sin recorridos por profundidad por enlace`, () => {
        const cosas: Record<Id, Cosa> = { p0: proceso('p0') }, enlaces: Record<Id, Enlace> = {}, opds: Record<Id, Opd> = {};
        for (let i = 1; i <= profundidad; i++) {
            cosas[`p${i}`] = proceso(`p${i}`); cosas[`q${i}`] = proceso(`q${i}`); cosas[`o${i}`] = objeto(`o${i}`);
            opds[`d${i}`] = { id: `d${i}`, tipo: 'descomposicion', padre: i === 1 ? 'raiz' : `d${i - 1}`, cosa: `p${i - 1}`, orden: 0, bandas: [[`p${i}`], [`q${i}`]], objetosInternos: [], apariciones: apps(`p${i - 1}`, `p${i}`, `q${i}`) };
            enlaces[`r${i}`] = { id: `r${i}`, tipo: 'resultado', objeto: `o${i}`, proceso: `p${profundidad}`, estado: `o${i}0` };
            enlaces[`c${i}`] = { id: `c${i}`, tipo: 'consumo', objeto: `o${i}`, proceso: 'q1', estado: `o${i}0` };
        }
        opds.raiz = { id: 'raiz', tipo: 'raiz', apariciones: apps('p0', ...Array.from({ length: profundidad }, (_, i) => `o${i + 1}`)) };
        let accesos = 0;
        const observados = new Proxy(opds, { get(target, key, receiver) { if (typeof key === 'string' && Object.hasOwn(target, key)) accesos++; return Reflect.get(target, key, receiver); } });
        const m = modelo([], { cosas, enlaces, opds: observados }); indice(m); accesos = 0;
        const v = proyectar(m, 'raiz');
        expect(v.conflictos).toEqual([]); expect(v.enlaces).toHaveLength(profundidad);
        expect(v.enlaces.every(e => e.enlace.tipo === 'efecto' && e.hechos.length === 2)).toBe(true);
        expect(accesos).toBeLessThanOrEqual(20 * profundidad + 20);
    });
}

// Presupuestos antes de GREEN: cuatro accesos por dimensión permitida cubren pasadas
// constantes. No se incluye el índice frío ni objetos ajenos que no se inspeccionan/emiten.
for (const ajenos of [128, 256]) {
    test(`T-085 coste A no escanea ${ajenos} objetos ajenos al certificado temporal`, () => {
        const base = modelo(), extras = Object.fromEntries(Array.from({ length: ajenos }, (_, i) => {
            const id = `ajeno-${i}`; return [id, { ...objeto(id), estados: [] }];
        }));
        let lecturas = 0;
        const registro = { ...base.cosas, ...extras };
        const cosas = new Proxy(registro, { get(target, key, receiver) {
            if (typeof key === 'string' && Object.hasOwn(target, key)) lecturas++;
            return Reflect.get(target, key, receiver);
        } });
        const m = modelo([{ id: 'r', tipo: 'resultado', objeto: 'b', proceso: 's1', estado: 'b0' },
            { id: 'c', tipo: 'consumo', objeto: 'b', proceso: 's2', estado: 'b0' }], { cosas, secuencia: 10000 });
        expect(validarForma(m)).toEqual([]);
        expect(Object.values(m.enlaces).flatMap(e => violacionesContexto(m, e))).toEqual([]);
        const antes = JSON.stringify(m); indice(m); lecturas = 0;
        const v = proyectar(m, 'raiz'), costo = lecturas;
        expect(v.enlaces.map(e => e.enlace)).toEqual([{ id: 'r', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b0', salida: 'b0' }]);
        expect(v.enlaces[0]!.hechos).toEqual(['r', 'c']); expect(v.conflictos).toEqual([]);
        const D = 2, P = 5, E = 2, A = 4, S = 8;
        expect(costo).toBeLessThanOrEqual(4 * (D + P + E + A + S));
        expect(JSON.stringify(m)).toBe(antes);
    });
}
for (const n of [64, 128]) {
    test(`T-085 coste D ${n} grupos y ${n} estados no multiplican lecturas propias`, () => {
        let lecturas = 0;
        const estados = new Proxy(Array.from({ length: n }, (_, i) => ({ id: `estado-${i}`, nombre: `estado${i}` })), {
            get(target, key, receiver) { if (typeof key === 'string' && /^\d+$/.test(key)) lecturas++; return Reflect.get(target, key, receiver); }
        });
        const cosas: Record<Id, Cosa> = { b: { ...objeto('b'), tipo: 'objeto', estados } }, enlaces: Enlace[] = [];
        const opds: Record<Id, Opd> = { raiz: { id: 'raiz', tipo: 'raiz', apariciones: apps('b', ...Array.from({ length: n }, (_, i) => `p${i}`)) } };
        for (let i = 0; i < n; i++) {
            for (const id of [`p${i}`, `r${i}`, `c${i}`]) cosas[id] = proceso(id);
            opds[`h${i}`] = { id: `h${i}`, tipo: 'descomposicion', padre: 'raiz', cosa: `p${i}`, orden: i,
                bandas: [[`r${i}`], [`c${i}`]], objetosInternos: [], apariciones: apps('b', `p${i}`, `r${i}`, `c${i}`) };
            enlaces.push({ id: `res${i}`, tipo: 'resultado', objeto: 'b', proceso: `r${i}`, estado: `estado-${i}` },
                { id: `cons${i}`, tipo: 'consumo', objeto: 'b', proceso: `c${i}`, estado: `estado-${i}` });
        }
        const m = modelo(enlaces, { cosas, opds, secuencia: 10000 });
        expect(validarForma(m)).toEqual([]);
        expect(Object.values(m.enlaces).flatMap(e => violacionesContexto(m, e))).toEqual([]);
        const antes = JSON.stringify(m); indice(m); lecturas = 0;
        const v = proyectar(m, 'raiz'), costo = lecturas;
        expect(v.conflictos).toEqual([]);
        expect(v.enlaces.map(e => e.enlace)).toEqual(Array.from({ length: n }, (_, i) => ({ id: `res${i}`, tipo: 'efecto', objeto: 'b', proceso: `p${i}`, entrada: `estado-${i}`, salida: `estado-${i}` })));
        expect(v.enlaces.map(e => e.hechos)).toEqual(Array.from({ length: n }, (_, i) => [`res${i}`, `cons${i}`]));
        const D = n + 1, P = 3 * n, E = 2 * n, A = n + 1, S = n;
        expect(costo).toBeLessThanOrEqual(4 * (D + P + E + A + S));
        expect(JSON.stringify(m)).toBe(antes);
    });
}

test('T-085 coste A comparte certificado entre vistas y separa nuevas identidades; memo no lee modelo', () => {
    const base = modelo(), hijo = base.opds.hijo!; if (hijo.tipo !== 'descomposicion') throw new Error('montaje');
    const registro: Record<Id, Opd> = { ...base.opds,
        hijo: { ...hijo, bandas: [['s1'], ['s2']] },
        profundo: { id: 'profundo', tipo: 'descomposicion', padre: 'hijo', cosa: 's1', orden: 0, bandas: [['u'], ['v']], objetosInternos: [], apariciones: apps('b', 's1', 'u', 'v') },
        ajeno: { id: 'ajeno', tipo: 'descomposicion', padre: 'hijo', cosa: 's2', orden: 1, bandas: [['w']], objetosInternos: [], apariciones: apps('b', 's2', 'w') } };
    let lecturas = 0, ajenas = 0;
    const opds = new Proxy(registro, { get(target, key, receiver) {
        if (typeof key === 'string' && Object.hasOwn(target, key)) { lecturas++; if (key === 'ajeno') ajenas++; }
        return Reflect.get(target, key, receiver);
    } });
    const m = modelo([{ id: 'r', tipo: 'resultado', objeto: 'b', proceso: 'u', estado: 'b0' }, { id: 'c', tipo: 'consumo', objeto: 'b', proceso: 'v', estado: 'b0' }], {
        opds, cosas: { ...base.cosas, u: proceso('u'), v: proceso('v'), w: proceso('w') } });
    expect(validarForma(m)).toEqual([]); expect(Object.values(m.enlaces).flatMap(e => violacionesContexto(m, e))).toEqual([]);
    const antes = JSON.stringify(m); indice(m); lecturas = 0; ajenas = 0;
    const raiz = proyectar(m, 'raiz');
    expect(raiz.enlaces[0]!.enlace).toEqual({ id: 'r', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b0', salida: 'b0' });
    expect(ajenas).toBeGreaterThan(0);
    lecturas = 0; ajenas = 0;
    expect(proyectar(m, 'raiz')).toBe(raiz); expect(lecturas).toBe(0);
    const intermedia = proyectar(m, 'hijo');
    expect(intermedia.enlaces[0]!.enlace).toEqual({ id: 'r', tipo: 'efecto', objeto: 'b', proceso: 's1', entrada: 'b0', salida: 'b0' });
    expect(intermedia.enlaces[0]!.hechos).toEqual(['r', 'c']); expect(ajenas).toBe(0);
    const otro = congelar({ ...m }); indice(otro); ajenas = 0;
    expect(proyectar(otro, 'raiz')).not.toBe(raiz); expect(ajenas).toBeGreaterThan(0);
    expect(JSON.stringify(m)).toBe(antes);
});

test('T-085 coste C conserva rangos con huecos y cruce base 256, identidad y procedencia en orden original', () => {
    const ids = Array.from({ length: 300 }, (_, i) => `s${i}`), cosas = { b: objeto('b'), p: proceso('p'), ...Object.fromEntries(ids.map(id => [id, proceso(id)])) };
    const m = modelo([{ id: 'c', tipo: 'consumo', objeto: 'b', proceso: 's299', estado: 'b1', control: 'c' },
        { id: 'e', tipo: 'efecto', objeto: 'b', proceso: 's256', entrada: 'b0', salida: 'b1', control: 'c' },
        { id: 'r', tipo: 'resultado', objeto: 'b', proceso: 's254', estado: 'b0' }], {
        cosas, secuencia: 10000, opds: { raiz: { id: 'raiz', tipo: 'raiz', apariciones: apps('b', 'p') },
            hijo: { id: 'hijo', tipo: 'descomposicion', padre: 'raiz', cosa: 'p', orden: 0, bandas: ids.map(id => [id]), objetosInternos: [], apariciones: apps('b', 'p', ...ids) } } });
    expect(validarForma(m)).toEqual([]); expect(Object.values(m.enlaces).flatMap(e => violacionesContexto(m, e))).toEqual([]);
    const antes = JSON.stringify(m), v = proyectar(m, 'raiz');
    expect(v.conflictos).toEqual([]); expect(v.enlaces).toHaveLength(1);
    expect(v.enlaces[0]!.enlace).toEqual({ id: 'c', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b0', salida: 'b1', control: 'c' });
    expect(v.enlaces[0]!.hechos).toEqual(['c', 'e', 'r']); expect(JSON.stringify(m)).toBe(antes);
});
for (const inverso of [false, true]) {
    test(`T-085 coste C empates paralelos no fabrican secuencia ni reordenan procedencia inverso=${inverso}`, () => {
        const base = modelo(), hijo = base.opds.hijo!; if (hijo.tipo !== 'descomposicion') throw new Error('montaje');
        const es: Enlace[] = [{ id: 'r', tipo: 'resultado', objeto: 'b', proceso: 's1', estado: 'b0' }, { id: 'c', tipo: 'consumo', objeto: 'b', proceso: 's2', estado: 'b0' }];
        const m = modelo(inverso ? es.reverse() : es, { opds: { ...base.opds, hijo: { ...hijo, bandas: [['s1', 's2'], ['s3']] } } });
        expect(validarForma(m)).toEqual([]); expect(Object.values(m.enlaces).flatMap(e => violacionesContexto(m, e))).toEqual([]);
        const antes = JSON.stringify(m), v = proyectar(m, 'raiz');
        expect(v.enlaces.map(e => [e.enlace.id, e.enlace.tipo, e.hechos])).toEqual(inverso ? [['c', 'consumo', ['c']], ['r', 'resultado', ['r']]] : [['r', 'resultado', ['r']], ['c', 'consumo', ['c']]]);
        expect(v.conflictos.map(d => [d.codigo, d.severidad])).toEqual([['conflicto-resultado-consumo', 'warning']]);
        expect(JSON.stringify(m)).toBe(antes);
    });
}
for (const n of [32, 128]) {
    test(`T-086 coste vista E=0 materializa ${n} apariciones sin confundir salida con enlaces`, () => {
        const ids = Array.from({ length: n }, (_, i) => `o${i}`), cosas: Record<Id, Cosa> = { p: proceso('p') };
        for (const id of ids) cosas[id] = { ...objeto(id), tipo: 'objeto', estados: [] };
        const m = modelo([], { cosas, secuencia: 10000, opds: { raiz: { id: 'raiz', tipo: 'raiz', apariciones: apps('p', ...ids) } } });
        expect(validarForma(m)).toEqual([]);
        const antes = JSON.stringify(m), v = proyectar(m, 'raiz');
        expect(v.enlaces).toEqual([]); expect(v.conflictos).toEqual([]);
        expect(v.cosas.map(c => [c.cosa, c.rol, c.estadosVisibles])).toEqual(['p', ...ids].map(id => [id, 'libre', []]));
        expect(proyectar(m, 'raiz')).toBe(v); expect(JSON.stringify(m)).toBe(antes);
    });
}

// Candidato de regresión: SIN_EJECUTAR; integrar sólo tras resolver la propiedad serial.
function wp8bFan(enlaces: readonly Enlace[], operador: 'XOR' | 'OR'): Modelo {
    const base = modelo();
    return modelo(enlaces, { abanicos: { f: { id: 'f', operador, enlaces: enlaces.map(e => e.id) } },
        opds: { raiz: { id: 'raiz', tipo: 'raiz', apariciones: { b: caja, p: caja, z: caja } } },
        cosas: base.cosas });
}
const wp8bEstados: readonly { nombre: string; ramas: readonly Enlace[] }[] = [
    ...(['consumo', 'resultado', 'agente', 'instrumento'] as const).map(tipo => ({ nombre: tipo,
        ramas: [{ id: 'fan-a', tipo, objeto: 'b', proceso: 'p', estado: 'b1' }, { id: 'fan-b', tipo, objeto: 'b', proceso: 'p', estado: 'b2' }] })),
    { nombre: 'TS4 entradas distintas', ramas: [
        { id: 'fan-a', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b1' },
        { id: 'fan-b', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b2' }] },
    { nombre: 'TS5 salidas distintas', ramas: [
        { id: 'fan-a', tipo: 'efecto', objeto: 'b', proceso: 'p', salida: 'b1' },
        { id: 'fan-b', tipo: 'efecto', objeto: 'b', proceso: 'p', salida: 'b2' }] },
    { nombre: 'TS3 entrada común', ramas: [
        { id: 'fan-a', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b0', salida: 'b1' },
        { id: 'fan-b', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b0', salida: 'b2' }] },
    { nombre: 'TS3 salida común', ramas: [
        { id: 'fan-a', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b1', salida: 'b3' },
        { id: 'fan-b', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b2', salida: 'b3' }] },
];
for (const operador of ['XOR', 'OR'] as const) for (const caso of wp8bEstados) {
    test(`T-086 fan ${operador} ${caso.nombre} conserva estados propios y común proceso`, () => {
        const m = wp8bFan(caso.ramas, operador), antes = JSON.stringify(m);
        expect(validarForma({ ...m, abanicos: {} })).toEqual([]);
        expect(validarForma(m).every(v => v.codigo === 'F-5')).toBe(true);
        expect(violacionesAbanico(m, m.abanicos.f!)).toEqual([]);
        for (const e of caso.ramas) {
            expect(violacionesContexto(m, e)).toEqual([]);
            if (caso.nombre === 'TS3 salida común') expect(noOfrecido(m, e, m.abanicos.f!)?.registro).toBe('B-06');
            else expect(noOfrecido(m, e, m.abanicos.f!)).toBeNull();
        }
        const v = proyectar(m, 'raiz');
        expect(v.abanicos).toEqual(caso.nombre === 'TS3 salida común' ? [] : [{ abanico: 'f', operador, ramas: ['fan-a', 'fan-b'], comun: 'p' }]);
        expect(v.enlaces.map(e => [e.enlace, e.hechos, e.abstraido])).toEqual(caso.ramas.map(e => [e, [e.id], false]));
        expect(v.conflictos).toEqual([]);
        expect(proyectar(m, 'raiz')).toBe(v);
        expect(JSON.stringify(m)).toBe(antes);
    });
}
for (const tipo of ['consumo', 'resultado', 'agente', 'instrumento'] as const)
    for (const anclajes of ['uniforme', 'diferentes', 'ausencia-parcial'] as const)
        for (const operador of ['XOR', 'OR'] as const) {
            test(`T-086 fan ${operador} ${tipo} con objeto común conserva anclaje ${anclajes}`, () => {
                const ramas: readonly Enlace[] = [
                    { id: 'fan-a', tipo, objeto: 'b', proceso: 'p', estado: 'b1' },
                    { id: 'fan-b', tipo, objeto: 'b', proceso: 'z', ...(anclajes === 'ausencia-parcial' ? {} : { estado: anclajes === 'uniforme' ? 'b1' : 'b2' }) }
                ];
                const m = wp8bFan(ramas, operador), antes = JSON.stringify(m), v = proyectar(m, 'raiz');
                expect(validarForma({ ...m, abanicos: {} })).toEqual([]);
                expect(validarForma(m).map(v => v.codigo)).toContain('F-5');
                expect(violacionesAbanico(m, m.abanicos.f!)).toEqual([]);
                for (const e of ramas) {
                    expect(violacionesContexto(m, e)).toEqual([]);
                    expect(noOfrecido(m, e, m.abanicos.f!)?.registro).toBe('B-06');
                }
                expect(v.abanicos).toEqual([]);
                expect(v.enlaces.map(e => [e.enlace, e.hechos, e.abstraido])).toEqual(ramas.map(e => [e, [e.id], false]));
                expect(JSON.stringify(m)).toBe(antes);
            });
        }
test('T-086 fan por estados propios colapsado al padre sigue siendo un único hecho con procedencia', () => {
    const base = modelo([
        { id: 'fan-a', tipo: 'consumo', objeto: 'b', proceso: 's1', estado: 'b1' },
        { id: 'fan-b', tipo: 'consumo', objeto: 'b', proceso: 's2', estado: 'b2' }
    ]);
    const m = congelar({ ...base, abanicos: { f: { id: 'f', operador: 'OR' as const, enlaces: ['fan-a', 'fan-b'] } } }), antes = JSON.stringify(m);
    const v = proyectar(m, 'raiz');
    expect(v.abanicos).toEqual([]);
    expect(v.enlaces).toHaveLength(1);
    expect(v.enlaces[0]?.hechos).toEqual(['fan-a', 'fan-b']);
    expect(v.enlaces[0]?.abstraido).toBe(true);
    expect(v.conflictos).toEqual([]);
    expect(JSON.stringify(m)).toBe(antes);
});
test('T-054 fan TS3 de ambas dimensiones variables sigue no ofrecido B-06', () => {
    const m = wp8bFan([
        { id: 'fan-a', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b0', salida: 'b1' },
        { id: 'fan-b', tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b2', salida: 'b3' }
    ], 'OR');
    for (const e of Object.values(m.enlaces)) expect(noOfrecido(m, e, m.abanicos.f!)).toMatchObject({ id: 'nf-abanico-efecto-mixto', registro: 'B-06' });
    // No se dicta una nueva política de vista para modelos no ofrecidos: se conserva la admisión y sus negativas nativas.
});
test('T-054 repetir un mismo estado/fact en dos IDs no crea alternativas legales', () => {
    const m = wp8bFan([
        { id: 'fan-a', tipo: 'consumo', objeto: 'b', proceso: 'p', estado: 'b1' },
        { id: 'fan-b', tipo: 'consumo', objeto: 'b', proceso: 'p', estado: 'b1' }
    ], 'OR');
    expect(violacionesAbanico(m, m.abanicos.f!).some(v => v.regla === 'R-FAN-GEO-2')).toBe(true);
});
test('T-086 fan de objeto común desaparece si una rama deja de ser visible', () => {
    const base = wp8bFan([
        { id: 'fan-a', tipo: 'agente', objeto: 'b', proceso: 'p', estado: 'b1' },
        { id: 'fan-b', tipo: 'agente', objeto: 'b', proceso: 'z', estado: 'b2' }
    ], 'XOR');
    const m = congelar({ ...base, opds: { raiz: { id: 'raiz', tipo: 'raiz' as const, apariciones: { b: caja, p: caja } } } });
    const v = proyectar(m, 'raiz');
    expect(v.enlaces.map(e => e.hechos)).toEqual([['fan-a']]);
    expect(v.abanicos).toEqual([]);
});

// DEC31: tabla temporal literal del dueño, no calculada por auxiliares del producto.
const tablaTemporal = [
    ['efecto', 'efecto', 'efecto'], ['efecto', 'resultado', 'invalida'], ['efecto', 'consumo', 'consumo'],
    ['resultado', 'efecto', 'resultado'], ['resultado', 'resultado', 'invalida'], ['resultado', 'consumo', 'efecto'],
    ['consumo', 'efecto', 'invalida'], ['consumo', 'resultado', 'efecto'], ['consumo', 'consumo', 'invalida']
] as const;
function hechoTemporal(tipo: 'efecto' | 'resultado' | 'consumo', id: Id, proceso: Id, temprano: boolean): EnlaceProcedimental {
    return tipo === 'efecto' ? { id, tipo, objeto: 'b', proceso, entrada: temprano ? 'b0' : 'b1', salida: temprano ? 'b1' : 'b2' }
        : { id, tipo, objeto: 'b', proceso, estado: 'b0' };
}
for (const [a, b, esperado] of tablaTemporal) for (const invertir of [false, true]) {
    test(`T-085 DEC31 tabla27 ${a}→${b} claves invertidas=${invertir}`, () => {
        const es = [hechoTemporal(a, 'temprano', 's1', true), hechoTemporal(b, 'tardio', 's3', false)];
        const m = modelo(invertir ? es.reverse() : es), antes = JSON.stringify(m);
        expect(validarForma(m)).toEqual([]);
        expect(Object.values(m.enlaces).flatMap(e => violacionesContexto(m, e))).toEqual([]);
        const v = proyectar(m, 'raiz'), ids = invertir ? ['tardio', 'temprano'] : ['temprano', 'tardio'];
        if (esperado === 'invalida') {
            expect(v.enlaces.map(e => e.enlace.tipo)).toEqual(invertir ? [b, a] : [a, b]);
            expect(v.enlaces.flatMap(e => e.hechos)).toEqual(ids);
            expect(v.conflictos).toEqual([expect.objectContaining({ codigo: 'precedencia-invalida', severidad: 'error', refs: ids.map(id => ({ tipo: 'enlace', id })) })]);
        } else {
            expect(v.conflictos).toEqual([]); expect(v.enlaces).toHaveLength(1);
            expect(v.enlaces[0]!.enlace.tipo).toBe(esperado);
            expect(v.enlaces[0]!.enlace.id).toBe(ids[0]!); expect(v.enlaces[0]!.hechos).toEqual(ids);
            if (esperado === 'efecto') expect(v.enlaces[0]!.enlace).toEqual({ id: ids[0]!, tipo: 'efecto', objeto: 'b', proceso: 'p', entrada: 'b0', salida: a === 'efecto' ? 'b2' : 'b0' });
        }
        expect(JSON.stringify(m)).toBe(antes); expect(proyectar(m, 'raiz')).toBe(v);
    });
}
for (const [a, b] of tablaTemporal) for (const invertido of [false, true]) {
    test(`T-085 DEC31 banda paralela ${a}+${b} claves invertidas=${invertido}`, () => {
        const base = modelo(), h = base.opds.hijo!; if (h.tipo !== 'descomposicion') throw Error('montaje');
        const es = [hechoTemporal(a, 'temprano', 's1', true), hechoTemporal(b, 'tardio', 's2', false)];
        const m = modelo(invertido ? es.reverse() : es, { opds: { ...base.opds, hijo: { ...h, bandas: [['s1', 's2'], ['s3']] } } });
        const antes = JSON.stringify(m), v = proyectar(m, 'raiz');
        const invalidos = a === b && a !== 'efecto', rc = a !== b && a !== 'efecto' && b !== 'efecto';
        expect(v.conflictos.map(d => d.codigo)).toEqual(invalidos ? ['precedencia-invalida'] : rc ? ['conflicto-resultado-consumo'] : []);
        expect(v.enlaces.map(e => e.enlace.tipo).sort()).toEqual(invalidos || rc ? [a, b].sort() : [a === 'consumo' || b === 'consumo' ? 'consumo' : a === 'resultado' || b === 'resultado' ? 'resultado' : 'efecto']);
        expect(new Set(v.enlaces.flatMap(e => e.hechos))).toEqual(new Set(['temprano', 'tardio']));
        expect(JSON.stringify(m)).toBe(antes);
    });
}
for (const paralelo of [false, true]) for (const tipos of [['consumo', 'efecto'], ['efecto', 'resultado']] as const) {
    test(`T-085 DEC31 anidamiento ${tipos.join('→')} paralelo=${paralelo}`, () => {
        const base = modelo(), h = base.opds.hijo!; if (h.tipo !== 'descomposicion') throw Error('montaje');
        const m = modelo([hechoTemporal(tipos[0], 'enlace-u', 'u', true), hechoTemporal(tipos[1], 'enlace-v', 'v', false)], {
            cosas: { ...base.cosas, u: proceso('u'), v: proceso('v') }, opds: { ...base.opds,
                hijo: { ...h, bandas: paralelo ? [['s1','s2'],['s3']] : h.bandas },
                d1: { id:'d1', tipo:'descomposicion', padre:'hijo', cosa:'s1', orden:0, bandas:[['u']], objetosInternos:[], apariciones:apps('s1','u','b') },
                d2: { id:'d2', tipo:'descomposicion', padre:'hijo', cosa:'s2', orden:1, bandas:[['v']], objetosInternos:[], apariciones:apps('s2','v','b') }
            } });
        expect(validarForma(m)).toEqual([]); const v=proyectar(m,'raiz');
        expect(v.conflictos.map(d=>d.codigo)).toEqual(paralelo ? [] : ['precedencia-invalida']);
        expect(v.enlaces.map(e=>e.enlace.tipo)).toEqual(paralelo ? [tipos[0]==='consumo' ? 'consumo':'resultado'] : [...tipos]);
        expect(v.enlaces.flatMap(e=>e.hechos)).toEqual(['enlace-u','enlace-v']);
    });
}
for (const estado of ['identidad', 'ausente', 'otro-ID', 'ajeno'] as const) {
    test(`T-085 DEC31 C→R requiere continuidad ${estado}`, () => {
        const es: Enlace[]=[{id:'c',tipo:'consumo',objeto:'b',proceso:'s1',...(estado==='ausente'?{}:{estado:'b0'}),control:'e',mult:'+'},
            {id:'r',tipo:'resultado',objeto:'b',proceso:'s3',estado:estado==='otro-ID'?'b1':estado==='ajeno'?'x0':'b0'}];
        const base=modelo(), b=base.cosas.b!; if(b.tipo!=='objeto')throw Error('montaje');
        const m=modelo(es,estado==='otro-ID'?{cosas:{...base.cosas,b:{...b,estados:b.estados.map(s=>({...s,nombre:'igual'}))}}}:{}),antes=JSON.stringify(m),v=proyectar(m,'raiz');
        if(estado==='identidad'){
            expect(validarForma(m)).toEqual([]);expect(Object.values(m.enlaces).flatMap(e=>violacionesContexto(m,e))).toEqual([]);
            expect(v.enlaces.map(e=>e.enlace)).toEqual([{id:'c',tipo:'efecto',objeto:'b',proceso:'p',entrada:'b0',salida:'b0',control:'e',mult:'+'}]);expect(v.conflictos).toEqual([]);
        }else{expect(v.enlaces.map(e=>e.enlace.tipo)).toEqual(['consumo','resultado']);expect(v.conflictos[0]?.codigo).toBe('conflicto-resultado-consumo');}
        expect(v.enlaces.flatMap(e=>e.hechos)).toEqual(['c','r']);expect(JSON.stringify(m)).toBe(antes);
    });
}
test('T-085 DEC31 cadena C→E→R conserva tres transformadores y error, no fuerte único',()=>{
    const m=modelo([{id:'c',tipo:'consumo',objeto:'b',proceso:'s1',estado:'b0'}, {id:'e',tipo:'efecto',objeto:'b',proceso:'s2',entrada:'b0',salida:'b1'}, {id:'r',tipo:'resultado',objeto:'b',proceso:'s3',estado:'b1'}]),antes=JSON.stringify(m),v=proyectar(m,'raiz');
    expect(validarForma(m)).toEqual([]);expect(v.enlaces.map(e=>e.enlace.tipo)).toEqual(['consumo','efecto','resultado']);expect(v.enlaces.flatMap(e=>e.hechos)).toEqual(['c','e','r']);expect(v.conflictos.map(d=>d.codigo)).toEqual(['precedencia-invalida']);expect(JSON.stringify(m)).toBe(antes);
});
for(const extremos of [['s1','s2'],['s1','s1'],['p','s1']] as const){
    test(`T-086 DEC32 invocación ${extremos.join('→')} interna elevada desaparece sólo en padre`,()=>{
        const m=modelo([{id:'iv',tipo:'invocacion',origen:extremos[0],destino:extremos[1]}]),antes=JSON.stringify(m);
        expect(validarForma(m)).toEqual([]);expect(proyectar(m,'raiz').enlaces).toEqual([]);expect(proyectar(m,'hijo').enlaces.map(e=>e.enlace)).toEqual([m.enlaces.iv!]);expect(JSON.stringify(m)).toBe(antes);
    });
}
test('T-086 DEC32 reflexivo propio visible se conserva con identidad y procedencia',()=>{
    const m=modelo([{id:'iv',tipo:'invocacion',origen:'p',destino:'p'}]),antes=JSON.stringify(m),v=proyectar(m,'raiz');
    expect(v.enlaces.map(e=>[e.enlace,e.hechos,e.abstraido])).toEqual([[m.enlaces.iv!,['iv'],false]]);expect(JSON.stringify(m)).toBe(antes);
});
for(const [nombre,ids] of [['SD_Sync',['e-102','e-104','e-106']],['OnStar_System',['e-83','e-93']]] as const){
    test(`T-086 DEC32 modelo real ${nombre} no inventa autoinvocaciones internas en padre`,()=>{
        const r=importarV0(readFileSync(new URL(`../../fixtures/v0/${nombre}.json`,import.meta.url),'utf8'));expect(r.ok).toBe(true);if(!r.ok)throw Error('import real');
        expect(validarForma(r.modelo)).toEqual([]);const antes=JSON.stringify(r.modelo),v=proyectar(r.modelo,r.modelo.raiz);
        for(const id of ids){expect(r.modelo.enlaces[id]?.tipo).toBe('invocacion');expect(v.enlaces.some(e=>e.hechos.includes(id))).toBe(false);}
        expect(JSON.stringify(r.modelo)).toBe(antes);
    });
}

for(const [a,b] of [['consumo','resultado'],['resultado','consumo'],['consumo','efecto'],['efecto','resultado']] as const){
    test(`T-083 T-085 DEC31 DS16 materialización ${a}→${b} conserva semántica, IDs y pérdidas`,()=>{
        const es=[hechoTemporal(a,'temprano','s1',true),hechoTemporal(b,'tardio','s3',false)];
        const m=modelo(es),antes=JSON.stringify(m);expect(validarForma(m)).toEqual([]);expect(Object.values(m.enlaces).flatMap(e=>violacionesContexto(m,e))).toEqual([]);
        const v=proyectar(m,'raiz'),r=eliminarRefinamiento(m,{opd:'hijo'});expect(r.ok).toBe(true);if(!r.ok)throw Error(r.rechazo.regla);
        const valido=a==='resultado'||b==='resultado'&&a==='consumo';
        if(valido){
            const id='temprano'; // C/R sin control tienen fuerza igual: DS16 conserva el empate original.
            expect(v.enlaces[0]!.hechos).toEqual(['temprano','tardio']);
            expect(r.valor.modelo.enlaces).toEqual({[id]:{id,tipo:'efecto',objeto:'b',proceso:'p',entrada:'b0',salida:'b0'}});
            expect(r.trazas.find(t=>t.regla==='DS-16')?.refs).toEqual([{tipo:'enlace',id},{tipo:'cosa',id:'p'},{tipo:'opd',id:'raiz'}]);
        }else{
            expect(v.enlaces.flatMap(e=>e.hechos)).toEqual(['temprano','tardio']);expect(r.valor.modelo.enlaces).toEqual({});
            expect(r.trazas.filter(t=>t.regla==='AP-30').flatMap(t=>t.refs.map(x=>x.id))).toEqual(['temprano','tardio']);
        }
        expect(validarForma(r.valor.modelo)).toEqual([]);expect(r.valor.modelo.cosas.b).toBe(m.cosas.b);expect(JSON.stringify(m)).toBe(antes);
    });
}
for(const n of [32,128,512]){
    test(`T-085 DEC31 coste temporal sin comparación cuadrática ${n} efectos y resultado`,()=>{
        const base=modelo(),ids=Array.from({length:n+1},(_,i)=>`sub${i}`),es=ids.map((id,i)=>hechoTemporal(i===n?'resultado':'efecto',`hecho${i}`,id,true));
        let lecturas=0;const enlaces=Object.fromEntries(es.map(e=>[e.id,new Proxy(e,{get(target,key,receiver){if(key==='proceso')lecturas++;return Reflect.get(target,key,receiver);}})]));
        const m=modelo([],{cosas:{...base.cosas,...Object.fromEntries(ids.map(id=>[id,proceso(id)]))},enlaces,
            opds:{raiz:base.opds.raiz!,hijo:{id:'hijo',tipo:'descomposicion',padre:'raiz',cosa:'p',orden:0,bandas:ids.map(id=>[id]),objetosInternos:[],apariciones:apps('p','b',...ids)}}});
        expect(validarForma(m)).toEqual([]);const antes=JSON.stringify(m);indice(m);lecturas=0;
        const v=proyectar(m,'raiz'),coste=lecturas;
        expect(v.conflictos.map(d=>d.codigo)).toEqual(['precedencia-invalida']);expect(v.enlaces.flatMap(e=>e.hechos)).toEqual(es.map(e=>e.id));
        expect(coste).toBeLessThanOrEqual(8*(n+1)+64);lecturas=0;expect(proyectar(m,'raiz')).toBe(v);expect(lecturas).toBe(0);expect(JSON.stringify(m)).toBe(antes);
    });
}
for(const [a,b] of [['consumo','efecto'],['efecto','resultado']] as const){
    test(`T-085 DEC31 relación ancestro no inventa orden temporal ${a}+${b}`,()=>{
        const m=modelo([hechoTemporal(a,'contorno','p',true),hechoTemporal(b,'interno','s1',false)]),antes=JSON.stringify(m),v=proyectar(m,'raiz');
        expect(v.conflictos).toEqual([]);expect(v.enlaces.map(e=>e.enlace.tipo)).toEqual([a==='consumo'?'consumo':'resultado']);expect(v.enlaces[0]!.hechos).toEqual(['contorno','interno']);expect(JSON.stringify(m)).toBe(antes);
    });
}

// Controles de resolución repetida WP-12; no exigen una caché ni un detalle privado.
test('T-085 extremos repetidos conservan elevado, directo e invisible incluso con nombres iguales', () => {
    const es: Enlace[] = [
        { id: 'elevado-b', tipo: 'instrumento', objeto: 'b', proceso: 's1' },
        { id: 'elevado-y', tipo: 'instrumento', objeto: 'y', proceso: 's1' },
        { id: 'directo', tipo: 'instrumento', objeto: 'b', proceso: 'z' },
        { id: 'oculto-1', tipo: 'instrumento', objeto: 'x', proceso: 's1' },
        { id: 'oculto-2', tipo: 'instrumento', objeto: 'x', proceso: 's2' }
    ];
    const b = modelo(), m = modelo(es, { cosas: { ...b.cosas,
        p: { ...b.cosas.p!, nombre: 'Igual' }, z: { ...b.cosas.z!, nombre: 'Igual' } } });
    const antes = JSON.stringify(m); expect(validarForma(m)).toEqual([]);
    const v = proyectar(m, 'raiz');
    expect(v.enlaces.map(e => [e.enlace, e.hechos, e.abstraido])).toEqual([
        [{ id: 'elevado-b', tipo: 'instrumento', objeto: 'b', proceso: 'p' }, ['elevado-b'], true],
        [{ id: 'elevado-y', tipo: 'instrumento', objeto: 'y', proceso: 'p' }, ['elevado-y'], true],
        [{ id: 'directo', tipo: 'instrumento', objeto: 'b', proceso: 'z' }, ['directo'], false]
    ]);
    expect(v.conflictos).toEqual([]); expect(proyectar(m, 'raiz')).toBe(v);
    // El enlace directo b→z une dos externos en el hijo: DR-13 lo conserva sólo en la raíz.
    expect(proyectar(m, 'hijo').enlaces.flatMap(e => e.hechos)).toEqual(['elevado-b', 'elevado-y', 'oculto-1', 'oculto-2']);
    expect(JSON.stringify(m)).toBe(antes);
});
