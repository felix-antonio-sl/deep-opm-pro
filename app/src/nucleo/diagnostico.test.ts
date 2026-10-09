import { expect, test } from 'bun:test';
import { CATALOGO, diagnosticar, gatesExportacion } from './diagnostico';
import type { CodigoDiagnostico } from './diagnostico';
import type { Modelo, Cosa, Enlace, Opd } from './tipos';
import { congelar } from '../pruebas/constructores';
import { OPERACIONES } from './operaciones';
import { validarForma } from './forma';
import { proyectar } from './proyeccion';
const ap = { x: 0, y: 0, ancho: 140, alto: 70 };
function objeto(id: string, nombre = 'Pedido'): Cosa { return { id, tipo: 'objeto', nombre, esencia: 'fisica', afiliacion: 'sistemica', estados: [{ id: `${id}-s1`, nombre: 'pendiente' }, { id: `${id}-s2`, nombre: 'pagado' }] }; }
function proceso(id: string, nombre = 'Procesar Pedido'): Cosa { return { id, tipo: 'proceso', nombre, esencia: 'informacional', afiliacion: 'sistemica' }; }
function modelo(cosas: Cosa[] = [objeto('o'), proceso('p')], enlaces: Enlace[] = [], hijos: Opd[] = []): Modelo {
    const internos = new Set(hijos.flatMap(o => o.tipo === 'descomposicion' ? [...o.bandas.flat(), ...o.objetosInternos] : []));
    return congelar({ id: 'm-diagnostico', nombre: 'Diagnóstico sintético', unidadTiempo: 'min', raiz: 'sd', secuencia: 100,
        cosas: Object.fromEntries(cosas.map(c => [c.id, c])), enlaces: Object.fromEntries(enlaces.map(e => [e.id, e])), abanicos: {},
        opds: Object.fromEntries([{ id: 'sd', tipo: 'raiz', apariciones: Object.fromEntries(cosas.filter(c => !internos.has(c.id)).map(c => [c.id, ap])) } as Opd, ...hijos].map(o => [o.id, o])) });
}
function hijo(bandas: string[][] = [['p1'], ['p2']]): Opd { return { id: 'h', tipo: 'descomposicion', padre: 'sd', cosa: 'p', orden: 0, bandas, objetosInternos: [], apariciones: Object.fromEntries(['p', 'o', ...bandas.flat()].map(id => [id, ap])) }; }
function refinado(enlaces: Enlace[] = [], bandas = [['p1'], ['p2']]): Modelo { return modelo([objeto('o'), proceso('p'), proceso('p1', 'Preparar Pedido'), proceso('p2', 'Entregar Pedido')], enlaces, [hijo(bandas)]); }
function cambiar(m: Modelo, datos: Partial<Modelo>): Modelo { return congelar({ ...m, ...datos }); }
function cosa(m: Modelo, id: string, datos: Partial<Cosa>): Modelo { return cambiar(m, { cosas: { ...m.cosas, [id]: { ...m.cosas[id]!, ...datos } as Cosa } }); }
function nombre(n: string, tipo: 'objeto' | 'proceso' = 'objeto'): Modelo { return modelo([tipo === 'objeto' ? objeto('o', n) : proceso('p', n)]); }
function estados(nombres: string[]): Modelo { const o = objeto('o'); return modelo([{ ...o, estados: nombres.map((nombre, i) => ({ id: `s${i}`, nombre })) } as Cosa]); }
function fan(mixto: boolean): Modelo {
    const m = modelo([objeto('o'), objeto('o2', 'Factura'), proceso('p')], [{ id: 'a', tipo: 'consumo', objeto: 'o', proceso: 'p', control: 'c' }, { id: 'b', tipo: 'consumo', objeto: 'o2', proceso: 'p', ...(mixto ? {} : { control: 'c' as const }) }]);
    return cambiar(m, { abanicos: { f: { id: 'f', operador: 'XOR', enlaces: ['a', 'b'] } } });
}
const c = (id: string, p = 'p', estado?: string): Enlace => ({ id, tipo: 'consumo', objeto: 'o', proceso: p, ...(estado ? { estado } : {}) });
const r = (id: string, p = 'p', estado?: string): Enlace => ({ id, tipo: 'resultado', objeto: 'o', proceso: p, ...(estado ? { estado } : {}) });
function ex(ambiental: boolean, cota: boolean): Modelo { return modelo([proceso('p'), { ...proceso('q', 'Gestionar Error'), afiliacion: ambiental ? 'ambiental' : 'sistemica' } as Cosa].map(x => x.id === 'p' && cota ? { ...x, duracion: { max: 5 } } as Cosa : x), [{ id: 'ex', tipo: 'excepcionSobretiempo', origen: 'p', destino: 'q' }]); }
function densidad(n: number): Modelo { return modelo([proceso('p'), ...Array.from({ length: n - 1 }, (_, i) => objeto(`o${i}`, `Pedido${i}`))]); }
function despliegue(relaciones: boolean): Modelo { return modelo([objeto('o'), objeto('a', 'Cuenta'), objeto('b', 'Saldo')], [{ id: 'e1', tipo: 'agregacion', refinable: 'o', refinador: 'b' }, { id: 'e2', tipo: relaciones ? 'exhibicion' : 'agregacion', refinable: 'a', refinador: 'b' }], [{ id: 'h', tipo: 'despliegue', padre: 'sd', cosa: 'o', orden: 0, modo: 'agregacion', apariciones: { o: ap, b: ap } }, { id: 'h2', tipo: 'despliegue', padre: 'sd', cosa: 'a', orden: 1, modo: relaciones ? 'exhibicion' : 'agregacion', apariciones: { a: ap, b: ap } }]); }
const metadata = [
        ['error', 'gramatical'], ['error', 'gramatical'], ['error', 'identidad'], ['error', 'gramatical'], ['error', 'identidad'], ['error', 'gramatical'], ['error', 'gramatical'], ['error', 'contencion'], ['warning', 'contencion'], ['warning', 'metodologica'], ['warning', 'metodologica'], ['warning', 'contencion'], ['info', 'contencion'], ['warning', 'sugerencia'], ['warning', 'sugerencia'], ['warning', 'metodologica'], ['warning', 'metodologica'], ['warning', 'metodologica'], ['warning', 'metodologica'], ['warning', 'metodologica'], ['warning', 'contencion'], ['info', 'sugerencia'], ['warning', 'metodologica'], ['warning', 'metodologica'], ['warning', 'metodologica'], ['warning', 'metodologica'], ['warning', 'metodologica'], ['info', 'gramatical'], ['info', 'metodologica'], ['info', 'metodologica'], ['info', 'metodologica'], ['info', 'sugerencia'], ['warning', 'identidad'], ['warning', 'identidad'],
    ] as const;
// Oráculos literales transcritos de DESIGN §4.4; nunca derivados de CATALOGO/proyectar.
const pares: readonly [
    CodigoDiagnostico,
    string,
    () => Modelo,
    () => Modelo
][] = [
    ['enlace-invalido', 'T-260', () => cosa(modelo(undefined, [{ id: 'e', tipo: 'agente', objeto: 'o', proceso: 'p' }]), 'o', { esencia: 'informacional' }), () => modelo(undefined, [{ id: 'e', tipo: 'agente', objeto: 'o', proceso: 'p' }])],
    ['abanico-invalido', 'T-054', () => fan(true), () => fan(false)],
    ['nombre-duplicado', 'T-024', () => modelo([objeto('o'), objeto('o2', 'Pedido')]), () => modelo([objeto('o'), objeto('o2', 'Factura')])],
    ['nombre-fuera-de-lexico', 'T-025', () => nombre('pedido'), () => nombre('Árbol Ñandú')],
    ['estado-duplicado', 'T-015', () => estados(['pagado', 'pagado']), () => estados(['pagado', 'pendiente'])],
    ['estado-fuera-de-lexico', 'T-025', () => estados(['Pagado']), () => estados(['pagado'])],
    ['etiqueta-fuera-de-lexico', 'T-266', () => modelo([objeto('o'), objeto('o2', 'Factura')], [{ id: 'e', tipo: 'etiquetado', origen: 'o', destino: 'o2', etiqueta: 'Tiene' }]), () => modelo([objeto('o'), objeto('o2', 'Factura')], [{ id: 'e', tipo: 'etiquetado', origen: 'o', destino: 'o2', etiqueta: 'tiene' }])],
    ['precedencia-invalida', 'T-260', () => refinado([r('a', 'p1'), r('b', 'p2')]), () => refinado([r('a', 'p1')])],
    ['conflicto-resultado-consumo', 'T-260', () => refinado([r('a', 'p1', 'o-s1'), c('b', 'p2', 'o-s2')]), () => refinado([r('a', 'p1', 'o-s1'), c('b', 'p2', 'o-s1')])],
    ['proceso-sin-transformacion', 'T-263', () => modelo(), () => modelo(undefined, [c('e')])],
    ['subproceso-sin-transformado', 'T-264', () => refinado(), () => refinado([c('a', 'p1'), r('b', 'p2')])],
    ['refinamiento-trivial', 'T-077', () => refinado([], [['p1']]), () => refinado()],
    ['enlace-en-contorno-temporal', 'T-060', () => refinado([c('e')], []), () => modelo(undefined, [c('e')])],
    ['opd-denso', 'T-265', () => densidad(21), () => densidad(20)],
    ['opd-sobrecargado', 'T-265', () => densidad(26), () => densidad(25)],
    ['sd-sin-proceso-unico', 'T-090', () => modelo([objeto('o')]), () => modelo()],
    ['manejador-no-ambiental', 'T-268', () => ex(false, true), () => ex(true, true)],
    ['cota-faltante', 'T-268', () => ex(true, false), () => ex(true, true)],
    ['afiliacion-incoherente', 'T-260', () => modelo([{ ...objeto('o'), afiliacion: 'ambiental' }, objeto('a', 'Saldo')], [{ id: 'e', tipo: 'exhibicion', refinable: 'o', refinador: 'a' }]), () => modelo([{ ...objeto('o'), afiliacion: 'ambiental' }, { ...objeto('a', 'Saldo'), afiliacion: 'ambiental' }], [{ id: 'e', tipo: 'exhibicion', refinable: 'o', refinador: 'a' }])],
    ['proceso-de-ambientales', 'T-260', () => modelo([{ ...objeto('o'), afiliacion: 'ambiental' }, proceso('p')], [{ id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'p' }]), () => modelo(undefined, [{ id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'p' }])],
    ['refinador-en-varios-contextos', 'T-260', () => despliegue(true), () => despliegue(false)],
    ['general-redundante', 'T-260', () => modelo([objeto('o'), objeto('a', 'Factura'), objeto('b', 'Saldo')], [{ id: 'e1', tipo: 'generalizacion', refinable: 'o', refinador: 'b' }, { id: 'e2', tipo: 'generalizacion', refinable: 'a', refinador: 'b' }, { id: 'e3', tipo: 'generalizacion', refinable: 'o', refinador: 'a' }]), () => modelo([objeto('o'), objeto('a', 'Factura'), objeto('b', 'Saldo')], [{ id: 'e1', tipo: 'generalizacion', refinable: 'o', refinador: 'b' }, { id: 'e2', tipo: 'generalizacion', refinable: 'a', refinador: 'b' }])],
    ['objeto-transiente', 'T-260', () => modelo([objeto('o'), proceso('p'), proceso('q', 'Recibir Pedido')], [c('a'), r('b', 'q')]), () => modelo(undefined, [c('a')])],
    ['nombre-proceso-largo', 'T-266', () => nombre('Procesar', 'proceso'), () => nombre('Procesar Pedido', 'proceso')],
    ['nombre-proceso-no-deverbal', 'T-266', () => nombre('Mesa Principal', 'proceso'), () => nombre('Almacenamiento Pedido', 'proceso')],
    ['nombre-objeto-plural', 'T-266', () => nombre('Pedidos'), () => nombre('Conjunto de Pedidos')],
    ['nombre-estado-no-descriptivo', 'T-266', () => estados(['correr']), () => estados(['pagado'])],
    ['etiqueta-larga', 'T-266', () => modelo([objeto('o'), objeto('o2', 'Factura')], [{ id: 'e', tipo: 'etiquetado', origen: 'o', destino: 'o2', etiqueta: 'tiene un dato de factura' }]), () => modelo([objeto('o'), objeto('o2', 'Factura')], [{ id: 'e', tipo: 'etiquetado', origen: 'o', destino: 'o2', etiqueta: 'tiene dato de factura' }])],
    ['mezcla-infinitivo-nominalizacion', 'T-267', () => modelo([proceso('p'), proceso('q', 'Almacenamiento Pedido')]), () => modelo([proceso('p'), proceso('q', 'Guardar Pedido')])],
    ['estado-sin-escritor', 'T-260', () => modelo(undefined, [c('e', 'p', 'o-s1')]), () => modelo(undefined, [{ id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p' }])],
    ['agente-humano', 'T-045', () => modelo(undefined, [{ id: 'e', tipo: 'agente', objeto: 'o', proceso: 'p' }]), () => modelo(undefined, [{ id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'p' }])],
    ['ajuste-automatico', 'T-087', () => { const m = modelo([objeto('o'), objeto('a', 'Factura')], [{ id: 'e', tipo: 'agregacion', refinable: 'o', refinador: 'a' }]); return cambiar(m, { opds: { sd: { ...m.opds.sd!, apariciones: { o: ap } } } }); }, () => modelo([objeto('o'), objeto('a', 'Factura')], [{ id: 'e', tipo: 'agregacion', refinable: 'o', refinador: 'a' }])],
    ['cosa-sin-aparicion', 'T-262', () => cambiar(modelo(), { opds: { sd: { id: 'sd', tipo: 'raiz', apariciones: { p: ap } } } }), () => modelo()],
    ['enlace-sin-vista', 'T-262', () => cambiar(modelo(undefined, [c('e')]), { opds: { sd: { id: 'sd', tipo: 'raiz', apariciones: { p: ap } } } }), () => modelo(undefined, [c('e')])],
];
for (const [codigo, tid, positivo, negativo] of pares) {
    test(`${tid} ${codigo}: positivo literal y ausencia cercana`, () => {
        const p = positivo(), n = negativo(), texto = JSON.stringify(p);
        expect(validarForma(p)).toEqual([]);
        expect(validarForma(n)).toEqual([]);
        const ds = diagnosticar(p).filter(d => d.codigo === codigo);
        expect(ds.length).toBeGreaterThan(0);
        for (const d of ds) {
            expect([d.severidad, d.familia]).toEqual([...metadata[pares.findIndex(p => p[0] === codigo)]!]);
            expect(d.regla.length).toBeGreaterThan(0);
            expect(d.mensaje.length).toBeGreaterThan(0);
            expect(d.accion.length).toBeGreaterThan(0);
            expect(d.refs.length).toBeGreaterThan(0);
        }
        expect(diagnosticar(n).filter(d => d.codigo === codigo)).toEqual([]);
        expect(JSON.stringify(p)).toBe(texto);
    });
}
test('T-261 catálogo cerrado, cinco familias y tres severidades; memo por identidad y reparaciones registradas', () => {
    expect(CATALOGO.map(x => x.codigo)).toEqual(pares.map(x => x[0]));
    expect(new Set(CATALOGO.map(x => x.familia))).toEqual(new Set(['gramatical', 'metodologica', 'identidad', 'contencion', 'sugerencia']));
    expect(new Set(CATALOGO.map(x => x.severidad))).toEqual(new Set(['error', 'warning', 'info']));
    for (const [, , construir] of pares) {
        const m = construir(), ds = diagnosticar(m);
        expect(diagnosticar(m)).toBe(ds);
        for (const d of ds)
            if (d.reparacion)
                expect(Object.hasOwn(OPERACIONES, d.reparacion.op)).toBe(true);
    }
    const m = modelo();
    expect(diagnosticar(cosa(m, 'p', { nombre: 'Mesa Principal' }))).not.toBe(diagnosticar(m));
});
test('T-283 gates por alcance: densidad, trivialidad, error visible y huérfanos; warnings comunes permiten', () => {
    expect(gatesExportacion(densidad(25), 'modelo')).toEqual([]);
    expect(gatesExportacion(densidad(26), { opd: 'sd' })).toHaveLength(1);
    expect(gatesExportacion(refinado([], [['p1']]), { opd: 'h' })).toHaveLength(1);
    const m = pares[0]![2]();
    expect(gatesExportacion(m, { opd: 'sd' }).some(x => x.regla === 'R-AG-1')).toBe(true);
    const sin = pares[32]![2]();
    expect(gatesExportacion(sin, { opd: 'sd' })).toEqual([]);
    expect(gatesExportacion(sin, 'modelo').length).toBeGreaterThan(0);
    expect(gatesExportacion(ex(false, false), 'modelo')).toEqual([]);
});
const objetivo = (m: Modelo, codigo: CodigoDiagnostico) => diagnosticar(m).filter(d => d.codigo === codigo);
function añadir(m: Modelo, es: Enlace[]): Modelo { return cambiar(m, { enlaces: { ...m.enlaces, ...Object.fromEntries(es.map(e => [e.id, e])) } }); }
test('T-261 metadatos literales de contención de precedencia y warning de conflicto', () => {
    const p = objetivo(refinado([r('a', 'p1'), r('b', 'p2')]), 'precedencia-invalida');
    expect(p).toHaveLength(1);
    expect(p[0]).toMatchObject({ severidad: 'error', familia: 'contencion', opd: 'sd' });
    const rc = objetivo(refinado([r('a', 'p1', 'o-s1'), c('b', 'p2', 'o-s2')]), 'conflicto-resultado-consumo');
    expect(rc).toHaveLength(1);
    expect(rc[0]).toMatchObject({ severidad: 'warning', familia: 'contencion', opd: 'sd' });
});
test('T-263 transformación heredada transitiva y por segundo general; habilitadores no cuentan', () => {
    const cs = [objeto('o'), proceso('p'), proceso('g', 'Guardar Pedido'), proceso('gg', 'Almacenar Pedido')];
    const herencia: Enlace[] = [{ id: 'g1', tipo: 'generalizacion', refinable: 'g', refinador: 'p' }, { id: 'g2', tipo: 'generalizacion', refinable: 'gg', refinador: 'g' }];
    const m = modelo(cs, [...herencia, c('e', 'gg')]);
    expect(objetivo(m, 'proceso-sin-transformacion')).toEqual([]);
    const soloH = modelo(cs, [...herencia, { id: 'e', tipo: 'instrumento', objeto: 'o', proceso: 'gg' }]);
    expect(objetivo(soloH, 'proceso-sin-transformacion').map(d => d.refs[0]!.id)).toEqual(['p', 'g', 'gg']);
    const varios = añadir(m, [{ id: 'g3', tipo: 'generalizacion', refinable: 'gg', refinador: 'p' }]);
    expect(objetivo(varios, 'proceso-sin-transformacion')).toEqual([]);
});
test('T-263 transformación en nieto satisface proceso ancestro sin copiar enlaces', () => {
    const h = hijo([['p1']]);
    const n: Opd = { id: 'n', tipo: 'descomposicion', padre: 'h', cosa: 'p1', orden: 0, bandas: [['p2']], objetosInternos: [], apariciones: { p1: ap, p2: ap, o: ap } };
    const m = modelo([objeto('o'), proceso('p'), proceso('p1', 'Preparar Pedido'), proceso('p2', 'Entregar Pedido')], [c('e', 'p2')], [h, n]);
    const texto = JSON.stringify(m);
    expect(validarForma(m)).toEqual([]);
    expect(objetivo(m, 'proceso-sin-transformacion')).toEqual([]);
    expect(objetivo(m, 'subproceso-sin-transformado').map(d => d.refs[0]!.id)).toEqual(['p1']);
    expect(JSON.stringify(m)).toBe(texto);
});
test('T-260 AP-27 conserva warning omisible y error obligatorio con matriz real', () => {
    const evento: Enlace = { id: 'evento', tipo: 'instrumento', objeto: 'o', proceso: 'p2', control: 'e' };
    const omisible = refinado([evento]);
    expect(diagnosticar(omisible).filter(d => d.regla === 'AP-27')).toEqual([expect.objectContaining({ codigo: 'enlace-invalido', severidad: 'warning', refs: [{ tipo: 'enlace', id: 'evento' }] })]);
    expect(gatesExportacion(omisible, 'modelo')).toEqual([]);
    const obligatorio = añadir(omisible, [r('previo', 'p1')]);
    expect(diagnosticar(obligatorio).filter(d => d.regla === 'AP-27')).toEqual([expect.objectContaining({ severidad: 'error' })]);
    expect(gatesExportacion(obligatorio, { opd: 'h' }).some(d => d.regla === 'AP-27')).toBe(true);
});
test('T-265 densidad es por OPD: 20/21/25/26 y nunca suma estados o el modelo', () => {
    for (const n of [20, 21, 25, 26]) {
        const m = densidad(n);
        expect(objetivo(m, 'opd-denso')).toHaveLength(n >= 21 && n <= 25 ? 1 : 0);
        expect(objetivo(m, 'opd-sobrecargado')).toHaveLength(n > 25 ? 1 : 0);
    }
    const m = densidad(40), ids = Object.keys(m.cosas), mitad = Object.fromEntries(ids.slice(0, 20).map(id => [id, ap]));
    const o: Opd = { id: 'h', tipo: 'despliegue', padre: 'sd', cosa: 'o0', orden: 0, modo: 'agregacion', apariciones: Object.fromEntries(ids.slice(20).map(id => [id, ap])) };
    const repartido = cambiar(m, { opds: { sd: { ...m.opds.sd!, apariciones: mitad }, h: o } });
    expect(objetivo(repartido, 'opd-denso')).toEqual([]);
    expect(objetivo(repartido, 'opd-sobrecargado')).toEqual([]);
});
test('T-283 error visible sólo en hermano y error de enlace abstraído se conservan por hechos reales', () => {
    const m = refinado([{ id: 'e', tipo: 'agente', objeto: 'o', proceso: 'p1' }]);
    const malo = cosa(m, 'o', { esencia: 'informacional' });
    expect(proyectar(malo, 'sd').enlaces[0]!.hechos).toEqual(['e']);
    expect(gatesExportacion(malo, { opd: 'sd' }).some(x => x.regla === 'R-AG-1')).toBe(true);
    const sinObjeto = cambiar(malo, { opds: { ...malo.opds, sd: { ...malo.opds.sd!, apariciones: { p: ap } } } });
    expect(gatesExportacion(sinObjeto, { opd: 'sd' })).toEqual([]);
    expect(gatesExportacion(sinObjeto, 'modelo').some(x => x.regla === 'R-AG-1')).toBe(true);
});
test('T-283 gate de estado respeta supresión local, no sólo dueño visible', () => {
    const m = estados(['Pagado']);
    const o = m.cosas.o!;
    const oculto = cambiar(m, { opds: { sd: { id: 'sd', tipo: 'raiz', apariciones: { o: { ...ap, ocultos: ['s0'] } } } } });
    expect(gatesExportacion(oculto, { opd: 'sd' })).toEqual([]);
    expect(gatesExportacion(oculto, 'modelo').some(x => x.refs.some(r => r.id === 's0'))).toBe(true);
    expect(objetivo(oculto, 'estado-fuera-de-lexico')).toHaveLength(1);
});
test('T-261 reparación literal distribución y eliminación de invocación redundante; no ejecuta capacidad futura', () => {
    const m = refinado([c('e'), { id: 'iv', tipo: 'invocacion', origen: 'p1', destino: 'p2' }]);
    const ds = diagnosticar(m);
    expect(ds.find(d => d.regla === 'R-DIST-1')?.reparacion).toEqual({ op: 'distribuirEnlace', args: { enlace: 'e' } });
    expect(ds.find(d => d.regla === 'R-INV-2B')?.reparacion).toEqual({ op: 'eliminarEnlaces', args: { enlaces: ['iv'] } });
    expect(ds.find(d => d.regla === 'R-ROL-UNIC-1')?.reparacion).toBeUndefined();
});
test('T-268 EX subtiempo exige min, max y esperada no la suplen, cero sí es cota', () => {
    const m = modelo([proceso('p'), { ...proceso('q', 'Manejar Error'), afiliacion: 'ambiental' }], [{ id: 'ex', tipo: 'excepcionSubtiempo', origen: 'p', destino: 'q' }]);
    const sin = cosa(m, 'p', { duracion: { max: 8, esperada: 3 } } as Partial<Cosa>);
    expect(objetivo(sin, 'cota-faltante')).toHaveLength(1);
    expect(objetivo(cosa(m, 'p', { duracion: { min: 0 } } as Partial<Cosa>), 'cota-faltante')).toEqual([]);
});
test('T-271 LF-19 inicial, ambiental, glosa auditable, resultado genérico, efecto sólo entrada y salida escrita', () => {
    const m = modelo(undefined, [c('e', 'p', 'o-s1')]);
    expect(objetivo(m, 'estado-sin-escritor').map(d => d.refs[0]!.id)).toEqual(['o-s1', 'o-s2']);
    const o = m.cosas.o!;
    if (o.tipo !== 'objeto')
        throw new Error('montaje');
    const inicial = cosa(m, 'o', { estados: o.estados.map(s => s.id === 'o-s1' ? { ...s, inicial: true } : s) } as Partial<Cosa>);
    expect(objetivo(inicial, 'estado-sin-escritor').map(d => d.refs[0]!.id)).toEqual(['o-s2']);
    expect(objetivo(cosa(m, 'o', { afiliacion: 'ambiental' }), 'estado-sin-escritor')).toEqual([]);
    expect(objetivo(cosa(m, 'o', { descripcion: 'Coproducto XOR-n valores asignados al clasificar' }), 'estado-sin-escritor')).toEqual([]);
    expect(objetivo(cosa(m, 'o', { descripcion: 'Nota Coproducto XOR-n' }), 'estado-sin-escritor')).toHaveLength(2);
    expect(objetivo(modelo(undefined, [r('e')]), 'estado-sin-escritor')).toEqual([]);
    expect(objetivo(modelo(undefined, [{ id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 'o-s1' }]), 'estado-sin-escritor')).toEqual([]);
    expect(objetivo(modelo(undefined, [{ id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p', salida: 'o-s2' }]), 'estado-sin-escritor').map(d => d.refs[0]!.id)).toEqual(['o-s1']);
});
test('T-260 afiliación transitiva, un aviso por rasgo aun con diamante', () => {
    const m = modelo([{ ...objeto('o'), afiliacion: 'ambiental' }, objeto('a', 'Cuenta'), objeto('b', 'Factura')], [{ id: 'e1', tipo: 'exhibicion', refinable: 'o', refinador: 'a' }, { id: 'e2', tipo: 'exhibicion', refinable: 'a', refinador: 'b' }, { id: 'e3', tipo: 'exhibicion', refinable: 'o', refinador: 'b' }]);
    expect(objetivo(m, 'afiliacion-incoherente').map(d => d.refs[0]!.id).sort()).toEqual(['a', 'b']);
    for (const d of objetivo(m, 'afiliacion-incoherente'))
        expect(d.reparacion).toEqual({ op: 'fijarAfiliacion', args: { cosa: d.refs[0]!.id, afiliacion: 'ambiental' } });
});
test('T-054 FAN5A bruto informa no representable sin precondición de forma ni reparación automática', () => {
    const o = objeto('o');
    const m = modelo([o, proceso('p'), proceso('q', 'Guardar Pedido')], [{ id: 'e1', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 'o-s1' }, { id: 'e2', tipo: 'efecto', objeto: 'o', proceso: 'p', salida: 'o-s2' }]);
    const bruto = cambiar(m, { abanicos: { f: { id: 'f', operador: 'XOR', enlaces: ['e1', 'e2'] } } });
    const texto = JSON.stringify(bruto);
    expect(validarForma(bruto).length).toBeGreaterThan(0);
    expect(validarForma(bruto).every(x => x.regla === 'F-5')).toBe(true);
    const ds = objetivo(bruto, 'abanico-invalido');
    expect(ds).toHaveLength(1);
    expect(ds[0]).toMatchObject({ regla: 'R-FAN-5/5A', refs: [{ tipo: 'abanico', id: 'f' }], severidad: 'error' });
    expect(ds[0]!.reparacion).toBeUndefined();
    expect(JSON.stringify(bruto)).toBe(texto);
});
test('T-266 rutas usan cadena_etiqueta nombre, admiten inicial capitalizada o minúscula', () => {
    for (const ruta of ['Normal', 'Urgente Especial', 'normal', 'rápida-especial']) {
        const m = modelo(undefined, [{ ...c('e'), ruta } as Enlace]);
        expect(objetivo(m, 'etiqueta-fuera-de-lexico')).toEqual([]);
    }
    for (const ruta of ['', 'Normal  Especial', 'Normal!']) {
        const m = modelo(undefined, [{ ...c('e'), ruta } as Enlace]);
        expect(objetivo(m, 'etiqueta-fuera-de-lexico')).toHaveLength(1);
    }
});
test('T-283 abanico inválido sin vista de fan bloquea por sus ramas visibles', () => {
    const m = modelo([objeto('o'), objeto('o2', 'Factura'), proceso('p'), proceso('q', 'Guardar Pedido')], [c('a'), { id: 'b', tipo: 'consumo', objeto: 'o2', proceso: 'q' }]);
    const bruto = cambiar(m, { abanicos: { f: { id: 'f', operador: 'XOR', enlaces: ['a', 'b'] } } });
    expect(proyectar(bruto, 'sd').abanicos).toEqual([]);
    expect(objetivo(bruto, 'abanico-invalido')).toHaveLength(1);
    expect(gatesExportacion(bruto, { opd: 'sd' }).some(d => d.refs.some(r => r.tipo === 'abanico' && r.id === 'f'))).toBe(true);
});
test('T-261 acciones nominales son léxicas, IDs reales y ausencia de reparación no inventada', () => {
    for (const codigo of ['nombre-duplicado', 'nombre-fuera-de-lexico', 'estado-duplicado', 'estado-fuera-de-lexico'] as const) {
        const m = pares.find(p => p[0] === codigo)![2]();
        const ds = objetivo(m, codigo);
        for (const d of ds) {
            const a = d.reparacion;
            expect(a).toBeDefined();
            if (!a)
                throw new Error('reparación ausente');
            if (a.op === 'renombrarCosa') {
                expect(m.cosas[a.args.cosa]).toBeDefined();
                expect(a.args.nombre).not.toBe(m.cosas[a.args.cosa]!.nombre);
            }
            else if (a.op === 'renombrarEstado') {
                expect(d.refs).toEqual([{ tipo: 'estado', id: a.args.estado }]);
                expect(a.args.nombre[0]).toBe(a.args.nombre[0]!.toLocaleLowerCase('es'));
            }
            else
                throw new Error('operación de reparación incorrecta');
        }
    }
    expect(objetivo(pares[24]![2](), 'nombre-proceso-no-deverbal')[0]!.reparacion).toBeUndefined();
});
test('T-054 FAN5A cuatro tipos de estado: T3 puro legal, TS3 con entrada común legal, mixto bruto y controls no ofrecidos', () => {
    const o = objeto('o'), cs = [o, proceso('p')];
    const construir = (es: Enlace[]) => { const m = modelo(cs, es); return cambiar(m, { abanicos: { f: { id: 'f', operador: 'XOR', enlaces: es.map(e => e.id) } } }); };
    // T3 puro con destinos distintos, ambas cosas tienen estados pero no anclajes.
    const puro = modelo([objeto('o'), objeto('o2', 'Factura'), proceso('p')], [{ id: 'a', tipo: 'efecto', objeto: 'o', proceso: 'p' }, { id: 'b', tipo: 'efecto', objeto: 'o2', proceso: 'p' }]);
    expect(objetivo(cambiar(puro, { abanicos: { f: { id: 'f', operador: 'OR', enlaces: ['a', 'b'] } } }), 'abanico-invalido')).toEqual([]);
    const comunes = construir([{ id: 'a', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 'o-s1', salida: 'o-s1' }, { id: 'b', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 'o-s1', salida: 'o-s2' }]);
    expect(validarForma(comunes)).toEqual([]);
    expect(objetivo(comunes, 'abanico-invalido')).toEqual([]);
    const b08 = fan(false), es = Object.values(b08.enlaces).map(e => ({ ...e, control: 'e' } as Enlace));
    const evento = cambiar(b08, { enlaces: Object.fromEntries(es.map(e => [e.id, e])) });
    expect(objetivo(evento, 'abanico-invalido')).toEqual([expect.objectContaining({ regla: 'T-056', refs: [{ tipo: 'abanico', id: 'f' }] })]);
});
test('T-077 despliegue cuenta refinadores únicos, no enlaces a dos estados del mismo hijo', () => {
    const m = modelo([objeto('o'), objeto('a', 'Factura')], [{ id: 'g1', tipo: 'generalizacion', refinable: 'o', refinador: 'a', estados: { general: 'o-s1', especializacion: 'a-s1' } }, { id: 'g2', tipo: 'generalizacion', refinable: 'o', refinador: 'a', estados: { general: 'o-s2', especializacion: 'a-s2' } }], [{ id: 'h', tipo: 'despliegue', padre: 'sd', cosa: 'o', orden: 0, modo: 'generalizacion', apariciones: { o: ap, a: ap } }]);
    expect(validarForma(m)).toEqual([]);
    expect(objetivo(m, 'refinamiento-trivial')).toEqual([expect.objectContaining({ opd: 'h', refs: [{ tipo: 'opd', id: 'h' }, { tipo: 'cosa', id: 'o' }] })]);
    expect(gatesExportacion(m, { opd: 'h' })).toHaveLength(1);
});
test('T-261 metadatos por código transcritos y refs existentes; las acciones no mutan el modelo', () => {

    for (const [i, [codigo, , crear]] of pares.entries()) {
        const m = crear(), texto = JSON.stringify(m);
        for (const d of objetivo(m, codigo)) {
            expect([d.severidad, d.familia]).toEqual([...metadata[i]!]);
            for (const r of d.refs) {
                const existe = r.tipo === 'estado' ? Object.values(m.cosas).some(c => c.tipo === 'objeto' && c.estados.some(s => s.id === r.id)) : Object.hasOwn(r.tipo === 'cosa' ? m.cosas : r.tipo === 'enlace' ? m.enlaces : r.tipo === 'abanico' ? m.abanicos : m.opds, r.id);
                expect(existe).toBe(true);
            }
        }
        expect(JSON.stringify(m)).toBe(texto);
    }
});
test('T-283 hermano sobrecargado no bloquea target, modelo sí; cosas externas no inflan refinadores', () => {
    const m = densidad(27), todos = m.opds.sd!.apariciones;
    const es: Enlace[] = [{ id: 'a', tipo: 'agregacion', refinable: 'o0', refinador: 'o1' }, { id: 'b', tipo: 'agregacion', refinable: 'o0', refinador: 'o2' }];
    const h: Opd = { id: 'h', tipo: 'despliegue', padre: 'sd', cosa: 'o0', orden: 0, modo: 'agregacion', apariciones: { o0: ap, o1: ap, o2: ap } };
    const con = añadir(cambiar(m, { opds: { ...m.opds, h } }), es);
    expect(gatesExportacion(con, { opd: 'h' })).toEqual([]);
    expect(gatesExportacion(con, 'modelo').filter(d => d.regla === 'R-LAY-1, R-OPD-LAY-2')).toHaveLength(1);
    expect(objetivo(con, 'refinamiento-trivial')).toEqual([]);
});
test('T-262 un hecho visto sólo en nieto o absorbido por fuerza tiene vista real', () => {
    const m = refinado([{ id: 'i', tipo: 'instrumento', objeto: 'o', proceso: 'p1' }, r('r', 'p2')]);
    expect(proyectar(m, 'sd').enlaces[0]!.hechos).toEqual(['i', 'r']);
    expect(objetivo(m, 'enlace-sin-vista')).toEqual([]);
    const sinRaiz = cambiar(m, { opds: { ...m.opds, sd: { ...m.opds.sd!, apariciones: { p: ap } } } });
    expect(objetivo(sinRaiz, 'enlace-sin-vista')).toEqual([]);
    expect(objetivo(sinRaiz, 'cosa-sin-aparicion')).toEqual([]);
});

test('T-261 catálogo de precedencia acredita AP-30 y R-PREC-1 literal', () => {
    expect(CATALOGO.find(f => f.codigo === 'precedencia-invalida')?.regla).toBe('AP-30, R-PREC-1');
});


test('T-077 refinamiento trivial cuenta refinadores revelados en cada OPD, no colección nuclear completa', () => {
    const modeloParcial = modelo([objeto('o'), objeto('a', 'Cuenta'), objeto('b', 'Saldo')],
        [{ id: 'e1', tipo: 'agregacion', refinable: 'o', refinador: 'a' }, { id: 'e2', tipo: 'agregacion', refinable: 'o', refinador: 'b' }],
        [{ id: 'h', tipo: 'despliegue', padre: 'sd', cosa: 'o', modo: 'agregacion', orden: 0, apariciones: { o: ap, a: ap } }]);
    expect(validarForma(modeloParcial)).toEqual([]);
    const antes = JSON.stringify(modeloParcial);
    expect(diagnosticar(modeloParcial).filter(d => d.codigo === 'refinamiento-trivial')).toEqual([expect.objectContaining({ opd: 'h', refs: [{ tipo: 'opd', id: 'h' }, { tipo: 'cosa', id: 'o' }] })]);
    const h = modeloParcial.opds.h!;
    const completo = cambiar(modeloParcial, { opds: { ...modeloParcial.opds, h: { ...h, apariciones: { ...h.apariciones, b: ap } } } });
    expect(diagnosticar(completo).filter(d => d.codigo === 'refinamiento-trivial')).toEqual([]);
    expect(JSON.stringify(modeloParcial)).toBe(antes);
});


for (const nombreObjeto of ['Apertura', 'Dependencia']) test(`T-266 heurística deverbal ${nombreObjeto} es warning contextual`, () => {
    expect(diagnosticar(nombre(nombreObjeto, 'proceso')).filter(d => d.codigo === 'nombre-proceso-no-deverbal')).toEqual([]);
    expect(diagnosticar(nombre('Mesa', 'proceso')).filter(d => d.codigo === 'nombre-proceso-no-deverbal')).toEqual([expect.objectContaining({ severidad: 'warning', refs: [{ tipo: 'cosa', id: 'p' }] })]);
});
test('T-288 T-283 un dato de enlace ajeno a su fila de la matriz es error visible y bloquea el export', () => {
    const efecto: Enlace = { id: 'e', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 'o-s1', salida: 'o-s2' };
    expect(gatesExportacion(modelo(undefined, [efecto]), { opd: 'sd' })).toEqual([]);
    for (const forzado of [{ ruta: 'r1' }, { control: 'x' }, { mult: '1' }]) {
        const m = modelo(undefined, [{ ...efecto, ...forzado } as Enlace]);
        expect(diagnosticar(m).filter(d => d.codigo === 'enlace-invalido' && d.severidad === 'error').length).toBeGreaterThan(0);
        expect(gatesExportacion(m, { opd: 'sd' }).length).toBeGreaterThan(0);
        expect(gatesExportacion(m, 'modelo').length).toBeGreaterThan(0);
    }
    expect(diagnosticar(modelo(undefined, [{ ...efecto, ruta: 'r1' } as Enlace])).find(d => d.regla === 'R-OPL-RUTA-2'))
        .toMatchObject({ codigo: 'enlace-invalido', severidad: 'error', refs: [{ tipo: 'enlace', id: 'e' }] });
});
