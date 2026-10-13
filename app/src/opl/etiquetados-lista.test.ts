import { expect, test } from 'bun:test';
import { modeloCon, must, porNombre } from '../pruebas/constructores';
import { crearEnlace, fijarMultiplicidad } from '../nucleo/enlaces';
import { fijarNombrePlural } from '../nucleo/cosas';
import { aplicarAccion } from '../nucleo/operaciones';
import { desplegar } from '../nucleo/refinamiento';
import { gatesExportacion } from '../nucleo/diagnostico';
import { noOfrecido } from '../nucleo/matriz';
import { exportarV0 } from '../codec/exportar';
import { importarV0 } from '../codec/importar';
import { generarBloque, textoCanonico } from './generar';
import { generarDocumentoOpl, importarOpl } from './documento';
import { analizar } from './analizar';
import { planificar } from './planificar';
import { aplicarPlan } from './aplicar';
import type { Etiquetado, Modelo } from '../nucleo/tipos';

const destinos = ['Alfa', 'Beta', 'Índice'] as const;
function lista(tipo: 'objeto' | 'proceso', n: number, etiqueta?: string, anclaje: 'ninguno' | 'origen' | 'destinos' | 'ambos' = 'ninguno') {
    let m = modeloCon(tipo === 'objeto'
        ? { objetos: [['Origen', ['nuevo', 'listo']], ...destinos.map(nombre => [nombre, ['pendiente', 'activo']] as const)] }
        : { procesos: ['Origen', ...destinos] });
    const origen = porNombre(m, 'Origen'), ids: string[] = [];
    for (const nombre of destinos.slice(0, n)) {
        const destino = porNombre(m, nombre);
        const estadoOrigen = anclaje !== 'ninguno' && anclaje !== 'destinos' && origen.tipo === 'objeto' ? origen.estados[1]!.id : undefined;
        const estadoDestino = anclaje !== 'ninguno' && anclaje !== 'origen' && destino.tipo === 'objeto' ? destino.estados[nombre === 'Beta' ? 0 : 1]!.id : undefined;
        const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'etiquetado', origen: origen.id, destino: destino.id,
            ...(etiqueta ? { etiqueta } : {}), ...(estadoOrigen ? { estadoOrigen } : {}), ...(estadoDestino ? { estadoDestino } : {}) } }));
        m = r.modelo; ids.push(r.creados[0]!);
    }
    expect(gatesExportacion(m, 'modelo')).toEqual([]);
    return { m, ids };
}
const hechos = (m: Modelo, opd = m.raiz) => generarBloque(m, opd).filter(l => l.hechos.length);
for (const cantidad of ['"a o b"; "a o b">=1', '"a y b"; "a y b">=1', 'n; n=1,3',
    'n; n en {2,4}', 'n; n en {2,4}; n>=1', 'n; n>=(a+y)/2', 'n; n>=((a+o)/2+y)'] as const)
    for (const multOrigen of ['1', '2'] as const) for (const etiqueta of [undefined, 'conoce', 'se relaciona con', 'se relacionan con'])
        for (const estados of [false, true]) for (const editar of [0, 1])
            test(`T-119 T-128 T-182 T-194 B-42 lista UNI edita miembro=${editar} con restricción=${cantidad}/origen=${multOrigen}/etiqueta=${etiqueta ?? 'default'}/estados=${estados}`, () => {
                let m = modeloCon({ objetos: [['Dato', ['listo']], ['Análisis', ['vigente']], ['Ítem', ['activo']]] });
                for (const [nombre, plural] of [['Dato', 'Datos'], ['Análisis', 'Análisis'], ['Ítem', 'Ítems de entrada']] as const)
                    m = must(fijarNombrePlural(m, { cosa: porNombre(m, nombre).id, nombre: plural })).modelo;
                const origen = porNombre(m, 'Dato'), ids: string[] = [];
                if (origen.tipo !== 'objeto') throw Error('Objeto de origen');
                for (const nombre of ['Análisis', 'Ítem']) {
                    const destino = porNombre(m, nombre); if (destino.tipo !== 'objeto') throw Error('Objeto de destino');
                    const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'etiquetado', origen: origen.id, destino: destino.id,
                        multOrigen, multDestino: cantidad, ...(etiqueta ? { etiqueta } : {}),
                        ...(estados ? { estadoOrigen: origen.estados[0]!.id, estadoDestino: destino.estados[0]!.id } : {}) } }));
                    m = r.modelo; ids.push(r.creados[0]!);
                }
                const antes = exportarV0(m), id = ids[editar]!, target = must(fijarMultiplicidad(m, { enlace: id, extremo: 'destino', valor: '4' })).modelo;
                const doc = generarDocumentoOpl(target), linea = hechos(target)[0]!;
                expect(linea.hechos).toEqual(ids);
                expect(analizar(linea.texto)[0]!.diagnosticos).toEqual([]);
                const p = planificar(m, 'modelo', doc);
                expect(p.resumen.noAplicables).toBe(0); expect(p.acciones).toHaveLength(2);
                expect(p.acciones.every(a => 'enlace' in a.args && a.args.enlace === id)).toBe(true);
                const r = must(aplicarPlan(m, p));
                expect(exportarV0(r.modelo)).toBe(exportarV0(target));
                expect(Object.keys(r.modelo.enlaces)).toEqual(ids);
                expect(r.modelo.enlaces[ids[1 - editar]!]).toEqual(m.enlaces[ids[1 - editar]!]);
                const nuevo = must(importarOpl(target.nombre, doc));
                expect(nuevo.plan.resumen.noAplicables).toBe(0); expect(generarDocumentoOpl(nuevo.modelo)).toBe(doc);
                expect(exportarV0(m)).toBe(antes);
            });
function paralelosDefault(reservadoPrimero: boolean, estados: boolean) {
    let m = modeloCon({ objetos: [['Origen', ['listo']], ['Destino', ['activo']]] });
    m = must(fijarNombrePlural(m, { cosa: porNombre(m, 'Destino').id, nombre: 'Destinos' })).modelo;
    const origen = porNombre(m, 'Origen'), destino = porNombre(m, 'Destino');
    if (origen.tipo !== 'objeto' || destino.tipo !== 'objeto') throw Error('Objetos de los enlaces');
    const ids: string[] = [];
    for (const reservado of reservadoPrimero ? [true, false] : [false, true]) {
        const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'etiquetado', origen: origen.id, destino: destino.id,
            multDestino: reservado ? '3' : '2', ...(reservado ? { etiqueta: 'se relaciona con' } : {}),
            ...(estados ? { estadoOrigen: origen.estados[0]!.id, estadoDestino: destino.estados[0]!.id } : {}) } }));
        m = r.modelo; ids.push(r.creados[0]!);
    }
    expect(gatesExportacion(m, 'modelo')).toEqual([]);
    return { m, ids };
}
for (const reservadoPrimero of [false, true]) for (const estados of [false, true]) for (const editar of [0, 1])
    test(`T-119 T-128 T-177 T-182 T-194 B-38 dos UNI del mismo par conservan identidades reservadoPrimero=${reservadoPrimero}/estados=${estados}/editar=${editar}`, () => {
        const { m, ids } = paralelosDefault(reservadoPrimero, estados), antes = exportarV0(m), id = ids[editar]!;
        expect(planificar(m, 'modelo', generarDocumentoOpl(m)).acciones).toEqual([]);
        const target = must(fijarMultiplicidad(m, { enlace: id, extremo: 'destino', valor: '4' })).modelo;
        const doc = generarDocumentoOpl(target), p = planificar(m, 'modelo', doc);
        expect(p.resumen.noAplicables).toBe(0); expect(p.acciones).toHaveLength(2);
        expect(p.acciones.every(a => 'enlace' in a.args && a.args.enlace === id)).toBe(true);
        const r = must(aplicarPlan(m, p));
        expect(exportarV0(r.modelo)).toBe(exportarV0(target)); expect(Object.keys(r.modelo.enlaces)).toEqual(ids);
        expect(r.modelo.enlaces[ids[1 - editar]!]).toEqual(m.enlaces[ids[1 - editar]!]);
        const nuevo = must(importarOpl(m.nombre, doc));
        expect(nuevo.plan.resumen.noAplicables).toBe(0); expect(Object.values(nuevo.modelo.enlaces)).toHaveLength(2);
        expect(Object.values(nuevo.modelo.enlaces).map(e => (e as Etiquetado).multDestino).sort())
            .toEqual(Object.values(target.enlaces).map(e => (e as Etiquetado).multDestino).sort());
        expect(generarDocumentoOpl(nuevo.modelo)).toBe(doc);
        expect(exportarV0(m)).toBe(antes);
    });
test('T-064 T-177 T-182 B-38 no elige entre dos IDs si ambas cantidades cambian sin coincidencia completa', () => {
    const { m, ids } = paralelosDefault(false, false), antes = exportarV0(m);
    let target = must(fijarMultiplicidad(m, { enlace: ids[0]!, extremo: 'destino', valor: '4' })).modelo;
    target = must(fijarMultiplicidad(target, { enlace: ids[1]!, extremo: 'destino', valor: '5' })).modelo;
    const p = planificar(m, 'modelo', generarDocumentoOpl(target));
    expect(p.resumen.noAplicables).toBe(1); expect(p.acciones).toEqual([]);
    expect(p.lineas.flatMap(l => l.diagnosticos.map(d => d.codigo))).toContain('ambiguous-symbol');
    expect(must(aplicarPlan(m, p)).modelo).toBe(m); expect(exportarV0(m)).toBe(antes);
});
test('T-178 B-38 una lista legal no admite un ajuste contradictorio en otra línea', () => {
    const { m, ids } = paralelosDefault(false, false), antes = exportarV0(m);
    const target = must(fijarMultiplicidad(m, { enlace: ids[1]!, extremo: 'destino', valor: '4' })).modelo;
    const lista = hechos(target)[0]!.texto;
    const p = planificar(m, m.raiz, lista + '\n**Origen** «se relaciona con» 5 **Destinos** [nombre: «Destino»].');
    expect(p.resumen.noAplicables).toBe(2); expect(p.acciones).toEqual([]);
    expect(p.lineas.map(l => l.diagnosticos.map(d => d.codigo))).toEqual([['patch-conflict'], ['patch-conflict']]);
    expect(exportarV0(m)).toBe(antes);
});
for (const operador of ['XOR', 'OR'] as const) for (const cantidad of ['n; n=1,3', '"a o b"; "a o b"=1,3'])
    test(`T-054 T-128 T-182 T-194 B-42 ${operador} conserva unión relacional por miembro=${cantidad}`, () => {
        let m = modeloCon({ objetos: [['Análisis', []], ['Ítem', []]], procesos: ['Preparar'] });
        for (const [nombre, plural] of [['Análisis', 'Análisis'], ['Ítem', 'Ítems de entrada']] as const)
            m = must(fijarNombrePlural(m, { cosa: porNombre(m, nombre).id, nombre: plural })).modelo;
        const ids: string[] = [];
        for (const nombre of ['Análisis', 'Ítem']) {
            const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'consumo', objeto: porNombre(m, nombre).id,
                proceso: porNombre(m, 'Preparar').id, mult: cantidad } }));
            m = r.modelo; ids.push(r.creados[0]!);
        }
        m = must(aplicarAccion(m, { op: 'formarAbanico', args: { enlaces: ids, operador } })).modelo;
        const antes = exportarV0(m), target = must(fijarMultiplicidad(m, { enlace: ids[1]!, extremo: 'objeto', valor: '4' })).modelo;
        const doc = generarDocumentoOpl(target), p = planificar(m, 'modelo', doc);
        expect(p.resumen.noAplicables).toBe(0);
        expect(exportarV0(must(aplicarPlan(m, p)).modelo)).toBe(exportarV0(target));
        const nuevo = must(importarOpl(target.nombre, doc)); expect(generarDocumentoOpl(nuevo.modelo)).toBe(doc);
        expect(Object.values(nuevo.modelo.abanicos)[0]?.operador).toBe(operador);
        expect(Object.values(nuevo.modelo.enlaces).map(e => 'mult' in e ? e.mult : undefined).sort()).toEqual([cantidad, '4'].sort());
        expect(exportarV0(m)).toBe(antes);
    });
for (const tipo of ['consumo', 'resultado'] as const) for (const operador of ['XOR', 'OR'] as const)
    for (const restriccion of ['n=1,3', 'n>=1'] as const)
        test(`T-054 T-128 T-178 T-194 B-42 ${tipo}/${operador} sólo admite restricción legacy unívoca ${restriccion}`, () => {
            let m = modeloCon({ objetos: [['Alfa', []], ['Beta', []]], procesos: ['Operar'] });
            const ids: string[] = [];
            for (const [nombre, plural, mult] of [['Alfa', 'Alfas', `n; ${restriccion}`], ['Beta', 'Betas', '4']] as const) {
                m = must(fijarNombrePlural(m, { cosa: porNombre(m, nombre).id, nombre: plural })).modelo;
                const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo, objeto: porNombre(m, nombre).id,
                    proceso: porNombre(m, 'Operar').id, mult } }));
                m = r.modelo; ids.push(r.creados[0]!);
            }
            m = must(aplicarAccion(m, { op: 'formarAbanico', args: { enlaces: ids, operador } })).modelo;
            const antes = exportarV0(m), linea = hechos(m)[0]!.texto;
            const plain = linea.replace(/\*\*(donde [^\n]+?)\*\*/gu, '$1');
            expect(plain).not.toBe(linea);
            const canon = analizar(linea)[0]!, lectura = analizar(plain)[0]!, plan = planificar(m, m.raiz, plain);
            expect(canon.diagnosticos).toEqual([]);
            expect(plan.acciones).toEqual([]);
            expect(lectura.texto).toBe(plain);
            if (restriccion === 'n=1,3') {
                expect(lectura.hechos).toEqual([]);
                expect(lectura.diagnosticos.map(d => d.codigo)).toEqual(['ambiguous-symbol']);
                expect(plan.resumen.noAplicables).toBe(1);
            } else {
                expect(lectura.diagnosticos).toEqual([]); expect(lectura.hechos).toEqual(canon.hechos);
                expect(plan.resumen.noAplicables).toBe(0);
                const doc = generarDocumentoOpl(m), legacy = doc.replace(linea, plain);
                expect(generarDocumentoOpl(must(importarOpl(m.nombre, legacy)).modelo)).toBe(doc);
            }
            expect(Object.keys(m.enlaces)).toEqual(ids); expect(exportarV0(m)).toBe(antes);
        });
test('T-119 T-128 T-178 T-194 B-42 una unión relacional plain conserva una lista AND unívoca', () => {
    let m = modeloCon({ objetos: [['Dato', []], ['Alfa', []], ['Beta', []]] });
    for (const [nombre, plural, multDestino] of [['Alfa', 'Alfas', 'n; n=1,3'], ['Beta', 'Betas', '4']] as const) {
        m = must(fijarNombrePlural(m, { cosa: porNombre(m, nombre).id, nombre: plural })).modelo;
        m = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'etiquetado', origen: porNombre(m, 'Dato').id,
            destino: porNombre(m, nombre).id, etiqueta: 'conoce', multDestino } })).modelo;
    }
    const antes = exportarV0(m), doc = generarDocumentoOpl(m), plain = doc.replace(/\*\*(donde [^\n]+?)\*\*/gu, '$1');
    const p = planificar(m, 'modelo', plain);
    expect(p.resumen.noAplicables).toBe(0); expect(p.acciones).toEqual([]);
    expect(generarDocumentoOpl(must(importarOpl(m.nombre, plain)).modelo)).toBe(doc);
    expect(exportarV0(m)).toBe(antes);
});
for (const modo of ['entrada', 'salida', 'cambio'] as const) for (const operador of ['XOR', 'OR'] as const)
    for (const restriccion of ['n=1,3', 'n>=1'] as const)
        test(`T-054 T-128 T-178 T-194 B-42 ${modo}/${operador} conserva estados y sólo admite legacy unívoco ${restriccion}`, () => {
            let m = modeloCon({ objetos: [['Pieza', ['nueva', 'lista', 'usada']]], procesos: ['Operar'] });
            m = must(fijarNombrePlural(m, { cosa: porNombre(m, 'Pieza').id, nombre: 'Piezas' })).modelo;
            const objeto = porNombre(m, 'Pieza'); if (objeto.tipo !== 'objeto') throw Error('Objeto con estados');
            const ids: string[] = [];
            for (const i of [0, 1]) {
                const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'efecto', objeto: objeto.id,
                    proceso: porNombre(m, 'Operar').id, mult: i ? '4' : `n; ${restriccion}`,
                    ...(modo !== 'salida' ? { entrada: objeto.estados[modo === 'cambio' ? 0 : i + 1]!.id } : {}),
                    ...(modo !== 'entrada' ? { salida: objeto.estados[i + 1]!.id } : {}) },
                    ...(i ? { abanicoCon: { enlace: ids[0]!, operador } } : {}) }));
                m = r.modelo; ids.push(r.creados[0]!);
            }
            const antes = exportarV0(m), linea = hechos(m)[0]!.texto, canon = analizar(linea)[0]!;
            const plain = linea.replace(/\*\*(donde [^\n]+?)\*\*/gu, '$1'), lectura = analizar(plain)[0]!;
            expect(canon.diagnosticos).toEqual([]); expect(plain).not.toBe(linea);
            const p = planificar(m, m.raiz, plain); expect(p.acciones).toEqual([]);
            if (restriccion === 'n=1,3') {
                expect(lectura.hechos).toEqual([]);
                expect(lectura.diagnosticos.map(d => d.codigo)).toEqual(['ambiguous-symbol']);
                expect(p.resumen.noAplicables).toBe(1);
            } else {
                expect(lectura.diagnosticos).toEqual([]); expect(lectura.hechos).toEqual(canon.hechos);
                expect(p.resumen.noAplicables).toBe(0);
                const doc = generarDocumentoOpl(m), legacy = doc.replace(linea, plain);
                expect(generarDocumentoOpl(must(importarOpl(m.nombre, legacy)).modelo)).toBe(doc);
            }
            expect(exportarV0(m)).toBe(antes);
        });
for (const modo of ['entrada', 'salida', 'cambio'] as const)
    test(`T-128 T-178 T-194 B-42 ${modo} AND conserva la unión legacy y el par de estados propio`, () => {
        let m = modeloCon({ objetos: [['Alfa', ['nueva', 'lista']], ['Beta', ['nueva', 'lista']]], procesos: ['Operar'] });
        for (const [nombre, plural, mult] of [['Alfa', 'Alfas', 'n; n=1,3'], ['Beta', 'Betas', '4']] as const) {
            m = must(fijarNombrePlural(m, { cosa: porNombre(m, nombre).id, nombre: plural })).modelo;
            const objeto = porNombre(m, nombre); if (objeto.tipo !== 'objeto') throw Error('Objeto con estados');
            m = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'efecto', objeto: objeto.id,
                proceso: porNombre(m, 'Operar').id, mult,
                ...(modo !== 'salida' ? { entrada: objeto.estados[0]!.id } : {}),
                ...(modo !== 'entrada' ? { salida: objeto.estados[1]!.id } : {}) } })).modelo;
        }
        const antes = exportarV0(m), doc = generarDocumentoOpl(m), plain = doc.replace(/\*\*(donde [^\n]+?)\*\*/gu, '$1');
        const p = planificar(m, 'modelo', plain);
        expect(p.resumen.noAplicables).toBe(0); expect(p.acciones).toEqual([]);
        expect(generarDocumentoOpl(must(importarOpl(m.nombre, plain)).modelo)).toBe(doc);
        expect(exportarV0(m)).toBe(antes);
    });
test('T-119 T-128 T-182 T-194 B-42 restricción propia no corta dos o más legacy ni rescata una restricción rota', () => {
    let m = modeloCon({ objetos: [['Dato', []], ['Análisis', []], ['Ítem', []]] });
    for (const [nombre, plural] of [['Análisis', 'Análisis'], ['Ítem', 'Ítems de entrada']] as const)
        m = must(fijarNombrePlural(m, { cosa: porNombre(m, nombre).id, nombre: plural })).modelo;
    for (const [nombre, multDestino] of [['Análisis', '"a o b"; "a o b">=1'], ['Ítem', '2..*']] as const)
        m = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'etiquetado', origen: porNombre(m, 'Dato').id,
            destino: porNombre(m, nombre).id, etiqueta: 'conoce', multDestino } })).modelo;
    const antes = exportarV0(m), doc = generarDocumentoOpl(m), legacy = doc.replace('al menos dos **Ítems de entrada**', 'dos o más **Ítems de entrada**');
    expect(legacy).not.toBe(doc);
    const p = planificar(m, 'modelo', legacy);
    expect(p.resumen.noAplicables).toBe(0); expect(p.acciones).toEqual([]);
    const nuevo = must(importarOpl(m.nombre, legacy)); expect(generarDocumentoOpl(nuevo.modelo)).toBe(doc);
    const sinEstilo = legacy.replace(/, \*\*(donde ([^\n]+?))\*\*/gu, ', $1');
    const plano = planificar(m, 'modelo', sinEstilo);
    expect(plano.resumen.noAplicables).toBe(0); expect(plano.acciones).toEqual([]);
    expect(generarDocumentoOpl(must(importarOpl(m.nombre, sinEstilo)).modelo)).toBe(doc);
    for (const restriccion of ['"a o b" >=', '"a o b >= 1', 'n en {2, 4', 'n >= (a + y']) {
        const roto = doc.replace('"a o b" >= 1', restriccion);
        expect(roto).not.toBe(doc);
        const rechazo = planificar(m, 'modelo', roto);
        expect(rechazo.resumen.noAplicables).toBe(1); expect(rechazo.acciones).toEqual([]);
        expect(exportarV0(m)).toBe(antes);
    }
});
test('T-182 T-194 B-42 un marcador privado de restricción no es entrada ni fabrica cantidades', () => {
    const m = modeloCon({ objetos: [['Origen', []], ['Destino', []]] }), antes = exportarV0(m);
    for (const texto of ['**Origen** «conoce» 2 **Destino**, donde §r0§.',
        '**Origen** «conoce» 2 **Destino**, **donde n >= 1** y 3 **Destino**, donde §r0§.']) {
        expect(analizar(texto)[0]!.hechos).toEqual([]);
        const p = planificar(m, 'modelo', texto);
        expect(p.resumen.noAplicables).toBe(1); expect(p.acciones).toEqual([]);
        expect(exportarV0(m)).toBe(antes);
    }
});
for (const tipo of ['objeto', 'proceso'] as const) for (const etiqueta of [undefined, 'conoce']) for (const n of [2, 3]) {
    test(`T-119 T-194 B-41 bifurcada ${tipo} etiqueta=${etiqueta ?? 'nula'} n=${n}: literal, identidad e inversa`, () => {
        const { m, ids } = lista(tipo, n, etiqueta), antes = exportarV0(m), ls = hechos(m);
        const marca = tipo === 'objeto' ? '**' : '*', o = marca + 'Origen' + marca;
        const cola = n === 2 ? `${marca}Alfa${marca} y ${marca}Beta${marca}` : `${marca}Alfa${marca}, ${marca}Beta${marca} e ${marca}Índice${marca}`;
        expect(ls.map(l => l.texto)).toEqual([`${o} «${etiqueta ?? 'se relaciona con'}» ${cola}.`]);
        expect(ls[0]!.hechos).toEqual(ids);
        for (const id of ids) {
            const e = m.enlaces[id] as Etiquetado;
            expect(ls[0]!.tokens.some(t => t.hecho === id && t.ref?.tipo === 'cosa' && t.ref.id === e.destino)).toBe(true);
        }
        const doc = generarDocumentoOpl(m), r = must(importarOpl(m.nombre, doc));
        expect(r.plan.resumen.noAplicables).toBe(0); expect(generarDocumentoOpl(r.modelo)).toBe(doc);
        expect(Object.values(r.modelo.enlaces)).toHaveLength(n); expect(Object.values(r.modelo.enlaces).every(e => e.tipo === 'etiquetado')).toBe(true);
        expect(planificar(m, 'modelo', doc).acciones).toEqual([]); expect(exportarV0(m)).toBe(antes);
        const json = exportarV0(r.modelo), fijo = importarV0(json); expect(fijo.ok).toBe(true);
        if (!fijo.ok) throw Error('Códec'); expect(exportarV0(fijo.modelo)).toBe(json);
    });
}
for (const [tipo, contexto] of [['objeto', 'simple'], ['proceso', 'simple'], ['objeto', 'estado'], ['objeto', 'cantidad'], ['proceso', 'cantidad']] as const)
    for (const explicitaPrimero of [false, true])
        test(`T-119 T-194 B-38 etiqueta efectiva ${tipo}/${contexto} explícita primero=${explicitaPrimero}: roundtrip y JSON intacto`, () => {
            const miembros = ['Alfa', 'Beta', 'Gamma', 'Índice'];
            let m = modeloCon(tipo === 'objeto'
                ? { objetos: [['Origen', ['listo']], ...miembros.map(nombre => [nombre, []] as const)] }
                : { procesos: ['Origen', ...miembros] });
            const origen = porNombre(m, 'Origen'), ids: string[] = [];
            const estadoOrigen = contexto === 'estado' && origen.tipo === 'objeto' ? origen.estados[0]!.id : undefined;
            for (const [i, nombre] of miembros.entries()) {
                const candidato = { tipo: 'etiquetado' as const, origen: origen.id, destino: porNombre(m, nombre).id,
                    ...((i < 2) === explicitaPrimero ? { etiqueta: 'se relaciona con' } : {}),
                    ...(estadoOrigen ? { estadoOrigen } : {}) };
                if (contexto === 'cantidad' && tipo === 'proceso') {
                    const previo = exportarV0(m), rechazo = crearEnlace(m, { opd: m.raiz, candidato: { ...candidato, multOrigen: '3' } });
                    expect(rechazo.ok).toBe(false); if (rechazo.ok) throw Error('Cantidad en proceso');
                    expect(rechazo.rechazo.regla).toBe('R-MULT-1A'); expect(exportarV0(m)).toBe(previo);
                }
                const r = must(crearEnlace(m, { opd: m.raiz, candidato: { ...candidato,
                    ...(contexto === 'cantidad' && tipo === 'objeto' ? { multOrigen: '3' as const } : {}) } }));
                m = r.modelo; ids.push(r.creados[0]!);
            }
            expect(gatesExportacion(m, 'modelo')).toEqual([]);
            const antes = exportarV0(m), ls = hechos(m), marca = tipo === 'objeto' ? '**' : '*';
            const sujeto = (contexto === 'cantidad' && tipo === 'objeto' ? '3 ' : '') + marca + 'Origen' + marca + (estadoOrigen ? ' en `listo`' : '');
            expect(ls.map(l => l.texto)).toEqual([`${sujeto} «se relaciona con» ${marca}Alfa${marca}, ${marca}Beta${marca}, ${marca}Gamma${marca} e ${marca}Índice${marca}.`]);
            expect(ls[0]!.hechos).toEqual(ids);
            for (const [i, id] of ids.entries()) {
                const e = m.enlaces[id] as Etiquetado;
                expect(e.etiqueta).toBe((i < 2) === explicitaPrimero ? 'se relaciona con' : undefined);
                expect(ls[0]!.tokens.some(t => t.hecho === id && t.ref?.tipo === 'cosa' && t.ref.id === e.destino)).toBe(true);
            }
            const doc = generarDocumentoOpl(m), reconstruido = must(importarOpl(m.nombre, doc));
            expect(reconstruido.plan.resumen.noAplicables).toBe(0);
            expect(Object.values(reconstruido.modelo.enlaces)).toHaveLength(4);
            expect(generarDocumentoOpl(reconstruido.modelo)).toBe(doc);
            expect(planificar(m, 'modelo', doc).acciones).toEqual([]);
            expect(exportarV0(m)).toBe(antes);
            const fijo = importarV0(antes); expect(fijo.ok).toBe(true);
            if (!fijo.ok) throw Error('Códec'); expect(exportarV0(fijo.modelo)).toBe(antes);
        });
for (const anclaje of ['origen', 'destinos', 'ambos'] as const) for (const etiqueta of [undefined, 'conoce'])
    test(`T-121 T-194 B-41 bifurcada anclaje=${anclaje} etiqueta=${etiqueta ?? 'nula'} conserva estados por extremo`, () => {
        const { m, ids } = lista('objeto', 3, etiqueta, anclaje), ls = hechos(m);
        const o = '**Origen**' + (anclaje !== 'destinos' ? ' en `listo`' : '');
        const ds = anclaje === 'origen' ? '**Alfa**, **Beta** e **Índice**' : '**Alfa** en `activo`, **Beta** en `pendiente` e **Índice** en `activo`';
        expect(ls.map(l => l.texto)).toEqual([`${o} «${etiqueta ?? 'se relaciona con'}» ${ds}.`]); expect(ls[0]!.hechos).toEqual(ids);
        for (const id of ids) {
            const e = m.enlaces[id] as Etiquetado;
            if (e.estadoDestino) expect(ls[0]!.tokens.some(t => t.hecho === id && t.ref?.tipo === 'estado' && t.ref.id === e.estadoDestino)).toBe(true);
        }
        const a = analizar(ls[0]!.texto)[0]!; expect(a.diagnosticos).toEqual([]); expect(a.hechos).toHaveLength(3);
        expect(a.hechos.map(h => h.k === 'enlace' && 'destino' in h.enlace && typeof h.enlace.destino !== 'string' ? h.enlace.destino.estado : undefined)).toEqual(anclaje === 'origen' ? [undefined, undefined, undefined] : ['activo', 'pendiente', 'activo']);
        const r = must(importarOpl(m.nombre, generarDocumentoOpl(m))); expect(generarDocumentoOpl(r.modelo)).toBe(generarDocumentoOpl(m));
        expect(planificar(m, 'modelo', generarDocumentoOpl(m)).acciones).toEqual([]);
    });

test('T-128 T-194 B-41 bifurcada conserva cantidad común de origen y cantidades propias de destino', () => {
    let { m, ids } = lista('objeto', 3, 'conoce');
    for (const [i, id] of ids.entries()) {
        m = must(fijarMultiplicidad(m, { enlace: id, extremo: 'origen', valor: '3' })).modelo;
        m = must(fijarMultiplicidad(m, { enlace: id, extremo: 'destino', valor: ['?', '+', '4'][i] as '?' | '+' | '4' })).modelo;
    }
    expect(hechos(m).map(l => l.texto)).toEqual(['3 **Origen** «conoce» un **Alfa** opcional, al menos un **Beta** y 4 **Índice**.']);
    const doc = generarDocumentoOpl(m), r = must(importarOpl(m.nombre, doc)); expect(generarDocumentoOpl(r.modelo)).toBe(doc);
    expect(planificar(m, 'modelo', doc).acciones).toEqual([]);
});

test('T-173 T-182 T-194 B-41 cantidad editada muta sólo Beta y otro estado agrega una firma sin reanclar', () => {
    const base = lista('objeto', 2, 'conoce'); let { m, ids } = base;
    const doc = generarDocumentoOpl(m), p = planificar(m, 'modelo', doc.replace('**Alfa** y **Beta**.', '**Alfa** y 4 **Beta**.'));
    expect(p.resumen.noAplicables).toBe(0); const r = must(aplicarPlan(m, p)).modelo;
    const betaPrevio = m.enlaces[ids[1]!]!; if (betaPrevio.tipo !== 'etiquetado') throw Error('Etiquetado');
    expect(r.enlaces[ids[0]!]).toEqual(m.enlaces[ids[0]!]); expect(r.enlaces[ids[1]!]).toEqual({ ...betaPrevio, multDestino: '4' });
    ({ m, ids } = lista('objeto', 2, 'conoce', 'destinos'));
    const d = generarDocumentoOpl(m), nueva = planificar(m, 'modelo', d.replace('**Beta** en `pendiente`.', '**Beta** en `activo`.'));
    expect(nueva.resumen.noAplicables).toBe(0); const nuevo = must(aplicarPlan(m, nueva)).modelo;
    expect(nuevo.enlaces[ids[1]!]).toEqual(m.enlaces[ids[1]!]); expect(Object.keys(nuevo.enlaces)).toHaveLength(3);
    expect(Object.values(nuevo.enlaces).filter(e => e.tipo === 'etiquetado' && e.destino === porNombre(m, 'Beta').id)).toHaveLength(2);
});

for (const diferencia of ['etiqueta', 'estadoOrigen', 'multOrigen'] as const)
    test(`T-194 B-41 bifurcada no hereda ${diferencia} del primer miembro`, () => {
        let { m, ids } = lista('objeto', 3, 'conoce'); const tercero = m.enlaces[ids[2]!] as Etiquetado;
        const origen = porNombre(m, 'Origen'); if (origen.tipo !== 'objeto') throw Error('Objeto');
        const delta = diferencia === 'etiqueta' ? { etiqueta: 'ayuda' } : diferencia === 'estadoOrigen' ? { estadoOrigen: origen.estados[1]!.id } : { multOrigen: '3' as const };
        m = { ...m, enlaces: { ...m.enlaces, [tercero.id]: { ...tercero, ...delta } } };
        expect(hechos(m).map(l => l.hechos)).toEqual([ids.slice(0, 2), [ids[2]!]]);
        expect(planificar(m, 'modelo', generarDocumentoOpl(m)).acciones).toEqual([]);
    });

test('T-132 T-194 B-41 lista etiquetada del hijo conserva CX3, modo y enlaces del bloque', () => {
    let { m, ids } = lista('objeto', 2, 'conoce'); const origen = porNombre(m, 'Origen').id;
    for (const nombre of destinos.slice(0, 2)) m = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'agregacion', refinable: origen, refinador: porNombre(m, nombre).id } })).modelo;
    const r = must(desplegar(m, { opd: m.raiz, cosa: origen, modo: 'agregacion' })); m = r.modelo; const hijo = r.creados[0]!;
    expect(hechos(m, hijo).find(l => l.texto === '**Origen** «conoce» **Alfa** y **Beta**.')?.hechos).toEqual(ids);
    expect(generarBloque(m, hijo).some(l => l.plantilla === 'CX3')).toBe(true);
    expect(planificar(m, hijo, textoCanonico(generarBloque(m, hijo))).acciones).toEqual([]);
    const nuevo = must(importarOpl(m.nombre, generarDocumentoOpl(m))); expect(generarDocumentoOpl(nuevo.modelo)).toBe(generarDocumentoOpl(m));
});

test('T-150 T-194 B-41 lista etiquetada no captura oraciones fundamentales ni inventa tipos', () => {
    const rf = analizar('**Origen** consta de **Alfa** y **Beta**.')[0]!.hechos;
    expect(rf).toHaveLength(2); expect(rf.every(h => h.k === 'enlace' && h.enlace.tipo === 'agregacion')).toBe(true);
    expect(analizar('**Origen** «conoce» **Alfa** y *Beta*.')[0]!.hechos).toEqual([]);
    expect(analizar('*Origen* conoce *Alfa* y **Beta**.')[0]!.hechos).toEqual([]);
    expect(analizar('*Origen* en `listo` conoce *Alfa* y *Beta*.')[0]!.hechos).toEqual([]);
    expect(analizar('**Origen** conoce `activo` y `pendiente`.')[0]!.hechos).toEqual([]);
});

test('T-150 T-194 B-41 bifurcada cerrada reconoce nombres opacos y etiqueta del núcleo', () => {
    const a = analizar('**Origen y Archivo** «conoce & usa» **Alfa y Beta** e **Índice o Registro**.')[0]!;
    expect(a.diagnosticos).toEqual([]); expect(a.hechos).toEqual([
        { k: 'enlace', enlace: { tipo: 'etiquetado', origen: { nombre: 'Origen y Archivo', tipo: 'objeto' }, destino: { nombre: 'Alfa y Beta', tipo: 'objeto' }, etiqueta: 'conoce & usa' } },
        { k: 'enlace', enlace: { tipo: 'etiquetado', origen: { nombre: 'Origen y Archivo', tipo: 'objeto' }, destino: { nombre: 'Índice o Registro', tipo: 'objeto' }, etiqueta: 'conoce & usa' } }
    ]);
});
for (const lista of ['**Alfa**, **Beta**', '**Alfa** y **Beta** y **Índice**', '**Alfa** y **Beta**, **Índice**', '**Alfa**, y **Beta**', '**Alfa** o **Beta**'])
    test(`T-150 T-194 B-41 bifurcada cerrada rechaza lista mal formada ${lista}`, () => {
        const r = analizar('**Origen** conoce ' + lista + '.')[0]!; expect(r.hechos).toEqual([]); expect(r.diagnosticos).not.toEqual([]);
    });
for (const texto of ['**Origen** «conoce» **Alfa** y más.', '**Origen** «conoce» **Alfa** y **Beta**, ordenados por Nombre.', '**Origen** «conoce» **Alfa** y **Beta**, ordenados por Nombre, en esa secuencia.', '**Origen** «conoce» **Alfa** y **Beta**, donde x > 0.'])
    test(`T-156 T-194 B-41 informa forma canónica no representable ${texto}`, () => {
        const r = analizar(texto)[0]!; expect(r.hechos).toEqual([]); expect(r.diagnosticos[0]?.codigo).toBe('unsupported-canonical');
    });


test('T-121 T-194 B-41 destinos repetidos con estados propios conservan todas sus firmas', () => {
    let { m, ids } = lista('objeto', 2, 'conoce', 'destinos');
    const alfa = porNombre(m, 'Alfa'); if (alfa.tipo !== 'objeto') throw Error('Objeto');
    const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'etiquetado', origen: porNombre(m, 'Origen').id, destino: alfa.id, estadoDestino: alfa.estados[0]!.id, etiqueta: 'conoce' } })); m = r.modelo;
    const ls = hechos(m); expect(ls).toHaveLength(1); expect(ls[0]!.hechos).toHaveLength(3);
    expect(new Set(ls[0]!.hechos)).toEqual(new Set([...ids, r.creados[0]!]));
    expect(ls[0]!.texto).toBe('**Origen** «conoce» **Alfa** en `activo`, **Alfa** en `pendiente` y **Beta** en `pendiente`.');
    const doc = generarDocumentoOpl(m), imp = must(importarOpl(m.nombre, doc)); expect(generarDocumentoOpl(imp.modelo)).toBe(doc); expect(Object.keys(imp.modelo.enlaces)).toHaveLength(3);
    expect(planificar(m, 'modelo', doc).acciones).toEqual([]);
});

test('T-120 T-194 B-41 bifurcada no absorbe mitad bidireccional ni recíproco', () => {
    let { m, ids } = lista('objeto', 2, 'conoce'); const origen = porNombre(m, 'Origen').id, destino = porNombre(m, 'Índice').id;
    const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'etiquetadoBidireccional', origen, destino, etiqueta: 'conoce', inversa: 'pertenece a' } })); m = r.modelo;
    expect(hechos(m).map(l => l.hechos)).toEqual([ids, [r.creados[0]!], [r.creados[0]!]]);
    const doc = generarDocumentoOpl(m), imp = must(importarOpl(m.nombre, doc)); expect(generarDocumentoOpl(imp.modelo)).toBe(doc);
    expect(Object.values(imp.modelo.enlaces).filter(e => e.tipo === 'etiquetado')).toHaveLength(2);
    expect(Object.values(imp.modelo.enlaces).filter(e => e.tipo === 'etiquetadoBidireccional')).toHaveLength(1);
    expect(planificar(m, 'modelo', doc).acciones).toEqual([]);
    const c = lista('objeto', 2, 'conoce');
    const rec = must(crearEnlace(c.m, { opd: c.m.raiz, candidato: { tipo: 'reciproco', origen: porNombre(c.m, 'Origen').id, destino: porNombre(c.m, 'Índice').id, etiqueta: 'asociados' } }));
    expect(hechos(rec.modelo).map(l => l.hechos)).toEqual([c.ids, [rec.creados[0]!]]);
});

test('T-173 T-194 B-41 quitar un destino del texto no borra su enlace y ensayo inválido es atómico', () => {
    const { m, ids } = lista('objeto', 3, 'conoce'), antes = exportarV0(m), doc = generarDocumentoOpl(m);
    const sinUno = planificar(m, 'modelo', doc.replace('**Alfa**, **Beta** e **Índice**.', '**Alfa** e **Índice**.'));
    expect(sinUno.resumen.noAplicables).toBe(0); expect(sinUno.acciones).toEqual([]); expect(Object.keys(m.enlaces)).toEqual(ids);
    const mal = planificar(m, 'modelo', doc.replace('**Alfa**, **Beta** e **Índice**.', '**Alfa** y *Falso*.'));
    expect(mal.resumen.noAplicables).toBeGreaterThan(0); expect(mal.acciones).toEqual([]); expect(exportarV0(m)).toBe(antes);
});

test('T-194 B-41 lista etiquetada estable frente a permutación del almacenamiento', () => {
    const { m } = lista('objeto', 3, 'conoce', 'destinos'); const esperado = generarDocumentoOpl(m), antes = exportarV0(m);
    const permutado = { ...m, enlaces: Object.fromEntries(Object.entries(m.enlaces).reverse()) };
    expect(generarDocumentoOpl(permutado)).toBe(esperado); expect(exportarV0(m)).toBe(antes);
});

test('T-057 T-194 B-42 conserva cantidad y estado de cada miembro UNI ofrecido', () => {
    let { m, ids } = lista('objeto', 3, 'conoce'); const malo = m.enlaces[ids[2]!] as Etiquetado, o = porNombre(m, 'Índice');
    if (o.tipo !== 'objeto') throw Error('Objeto');
    m = { ...m, enlaces: { ...m.enlaces, [malo.id]: { ...malo, estadoDestino: o.estados[0]!.id, multDestino: '3' } } };
    const antes = exportarV0(m);
    expect(noOfrecido(m, m.enlaces[malo.id]!)).toBeNull();
    const intento = crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'etiquetado', origen: malo.origen, destino: malo.destino, estadoDestino: o.estados[1]!.id, multDestino: '3', etiqueta: 'conoce' } });
    expect(intento.ok).toBe(true); if (!intento.ok) throw Error('Creación ofrecida rechazada');
    expect(hechos(m).map(l => l.hechos)).toEqual([ids]);
    expect(hechos(m)[0]!.texto).toBe('**Origen** «conoce» **Alfa**, **Beta** y 3 **Índice** en `pendiente`.');
    const n = intento.valor.modelo, texto = generarDocumentoOpl(n), leido = must(importarOpl(n.nombre, texto));
    expect(hechos(n).map(l => l.hechos)).toEqual([[...ids, intento.valor.creados[0]!]]);
    expect(generarDocumentoOpl(leido.modelo)).toBe(texto);
    expect(Object.values(leido.modelo.enlaces)).toHaveLength(4);
    expect(planificar(n, 'modelo', texto).acciones).toEqual([]);
    expect(exportarV0(m)).toBe(antes);
});


for (const etiqueta of ['donde se registra', 'ordenados por'])
    test(`T-150 T-194 B-41 etiqueta opaca ${etiqueta} no se interpreta como metadato de colección`, () => {
        const { m } = lista('objeto', 2, etiqueta), doc = generarDocumentoOpl(m);
        const a = analizar(hechos(m)[0]!.texto)[0]!;
        expect(a.diagnosticos).toEqual([]); expect(a.hechos).toHaveLength(2);
        expect(a.hechos.every(h => h.k === 'enlace' && 'etiqueta' in h.enlace && h.enlace.etiqueta === etiqueta)).toBe(true);
        const r = must(importarOpl(m.nombre, doc)); expect(generarDocumentoOpl(r.modelo)).toBe(doc);
        expect(planificar(m, 'modelo', doc).acciones).toEqual([]);
    });
for (const etiqueta of ['puede ser donde', 'se pliega donde'])
    test(`T-156 T-194 B-41 etiqueta no elude límite reservado ${etiqueta}`, () => {
        const a = analizar(`**Origen** ${etiqueta} **Alfa** y **Beta**.`)[0]!;
        expect(a.hechos).toEqual([]); expect(a.diagnosticos.length).toBeGreaterThan(0);
    });
