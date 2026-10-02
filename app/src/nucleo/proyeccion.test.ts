import { expect, test } from 'bun:test';
import { congelar } from '../pruebas/constructores';
import type { Modelo, Enlace, EnlaceProcedimental, Id, Aparicion, Opd, Cosa, Control } from './tipos';
import { proyectar, etiquetaOpd, opdsEnPreorden } from './proyeccion';
import { indice } from './indice';
import { validarForma } from './forma';
import { noOfrecido } from './matriz';

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

test('T-086 invocación colapsada conserva autoinvocación pero excepción no reflexiva desaparece', () => {
    const v = proyectar(modelo([
        { id: 'inv', tipo: 'invocacion', origen: 's1', destino: 's2' },
        { id: 'exc', tipo: 'excepcionSubtiempo', origen: 's1', destino: 's2' }
    ]), 'raiz');
    expect(v.enlaces.map(e => e.enlace)).toEqual([{ id: 'inv', tipo: 'invocacion', origen: 'p', destino: 'p' }]);
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
    ['efecto', 'efecto', 'efecto', undefined], ['efecto', 'resultado', 'resultado', undefined], ['efecto', 'consumo', 'consumo', undefined],
    ['resultado', 'efecto', 'resultado', undefined], ['resultado', 'resultado', ['resultado', 'resultado'], 'precedencia-invalida'], ['resultado', 'consumo', ['resultado', 'consumo'], 'conflicto-resultado-consumo'],
    ['consumo', 'efecto', 'consumo', undefined], ['consumo', 'resultado', ['consumo', 'resultado'], 'conflicto-resultado-consumo'], ['consumo', 'consumo', ['consumo', 'consumo'], 'precedencia-invalida']
];
for (const [a, b, esperado, codigo] of celdas) {
    test(`T-085 R-PREC ${a} + ${b}`, () => {
        const m = modelo([procedimental(a, 'a', 's1'), procedimental(b, 'b', 's2')]);
        const v = proyectar(m, 'raiz');
        expect(v.enlaces.map(e => e.enlace.tipo)).toEqual(typeof esperado === 'string' ? [esperado] : [...esperado]);
        expect(v.conflictos.map(d => d.codigo)).toEqual(codigo ? [codigo] : []);
        if (codigo) {
            expect(v.enlaces.map(e => e.hechos)).toEqual([['a'], ['b']]);
            expect(v.conflictos[0]).toMatchObject({ regla: codigo === 'precedencia-invalida' ? 'R-PREC-1' : 'R-PREC-3', familia: 'gramatical', severidad: 'error', opd: 'raiz', refs: [{ tipo: 'enlace', id: 'a' }, { tipo: 'enlace', id: 'b' }] });
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
        const e = proyectar(modelo([a, b]), 'raiz').enlaces[0]!.enlace;
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
    expect(v.enlaces.map(e => e.enlace.tipo)).toEqual(['resultado', 'resultado']);
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
