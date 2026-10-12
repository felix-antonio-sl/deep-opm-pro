import { expect, test } from 'bun:test';
import { modeloCon, must, porNombre } from '../pruebas/constructores';
import { crearEnlace, fijarControl, fijarMultiplicidad } from '../nucleo/enlaces';
import { formarAbanico } from '../nucleo/abanicos';
import { desplegar } from '../nucleo/refinamiento';
import { generarBloque, textoCanonico } from './generar';
import { generarDocumentoOpl, importarOpl } from './documento';
import { analizar } from './analizar';
import { planificar } from './planificar';
import { exportarV0 } from '../codec/exportar';
import { importarV0 } from '../codec/importar';
import { gatesExportacion } from '../nucleo/diagnostico';
import type { Modelo } from '../nucleo/tipos';

const procesos = ['Alfa', 'Beta', 'Índice'] as const;
function comun(n = 3, auxiliar = false) {
    let m = modeloCon({ objetos: auxiliar ? [['Agente', ['libre', 'ocupado']], ['Auxiliar', []]] : [['Agente', ['libre', 'ocupado']]], procesos: [...procesos] }); const ids: string[] = [];
    for (const nombre of procesos.slice(0, n)) {
        const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'agente', objeto: porNombre(m, 'Agente').id, proceso: porNombre(m, nombre).id } }));
        m = r.modelo; ids.push(r.creados[0]!);
    }
    expect(gatesExportacion(m, 'modelo')).toEqual([]); return { m, ids };
}
const enlaces = (m: Modelo, opd = m.raiz) => generarBloque(m, opd).filter(l => l.hechos.length);
for (const n of [2, 3]) test(`T-194 DEC52 agente común informativo simple ${n} procesos: texto e inversa con identidad`, () => {
    const { m, ids } = comun(n), antes = exportarV0(m), ls = enlaces(m);
    const texto = n === 2 ? '**Agente** maneja *Alfa* y *Beta*.' : '**Agente** maneja *Alfa*, *Beta* e *Índice*.';
    expect(ls.map(l => l.texto)).toEqual([texto]); expect(ls[0]!.hechos).toEqual(ids);
    for (const id of ids) {
        const e = m.enlaces[id]!; if (e.tipo !== 'agente') throw Error('Agente');
        expect(ls[0]!.tokens.some(t => t.hecho === id && t.ref?.tipo === 'cosa' && t.ref.id === e.proceso)).toBe(true);
    }
    const a = analizar(texto)[0]!; expect(a.diagnosticos).toEqual([]); expect(a.hechos).toHaveLength(n);
    expect(a.hechos).toEqual(procesos.slice(0, n).map(proceso => ({ k: 'enlace', enlace: { tipo: 'agente', objeto: { nombre: 'Agente', tipo: 'objeto' }, proceso } })));
    const doc = generarDocumentoOpl(m), imp = must(importarOpl(m.nombre, doc)); expect(generarDocumentoOpl(imp.modelo)).toBe(doc);
    expect(Object.keys(imp.modelo.enlaces)).toHaveLength(n); expect(Object.keys(imp.modelo.abanicos)).toHaveLength(0);
    expect(planificar(m, 'modelo', doc).acciones).toEqual([]); expect(exportarV0(m)).toBe(antes);
    const json = exportarV0(imp.modelo), fijo = importarV0(json); expect(fijo.ok).toBe(true); if (!fijo.ok) throw Error('Códec'); expect(exportarV0(fijo.modelo)).toBe(json);
});
for (const atributo of ['estado', 'multiplicidad', 'e', 'c'] as const)
    test(`T-194 DEC52 agente común no extrapola ${atributo} compartido fuera del literal aprobado`, () => {
        let { m, ids } = comun(2);
        if (atributo === 'e' || atributo === 'c') for (const id of ids) m = must(fijarControl(m, { enlace: id, control: atributo })).modelo;
        else if (atributo === 'multiplicidad') for (const id of ids) m = must(fijarMultiplicidad(m, { enlace: id, extremo: 'objeto', valor: '3' })).modelo;
        else {
            const o = porNombre(m, 'Agente'); if (o.tipo !== 'objeto') throw Error('Objeto');
            m = { ...m, enlaces: Object.fromEntries(Object.entries(m.enlaces).map(([id, e]) => [id, { ...e, estado: o.estados[0]!.id }])) };
        }
        expect(enlaces(m)).toHaveLength(2); expect(enlaces(m).every(l => l.hechos.length === 1)).toBe(true);
        expect(planificar(m, 'modelo', generarDocumentoOpl(m)).acciones).toEqual([]);
    });
for (const operador of ['XOR', 'OR'] as const) test(`T-194 DEC52 agente común no absorbe ramas ${operador}`, () => {
    let { m, ids } = comun(3); m = must(formarAbanico(m, { enlaces: ids.slice(0, 2), operador })).modelo;
    expect(enlaces(m).map(l => l.hechos)).toEqual([ids.slice(0, 2), [ids[2]!]]);
    const imp = must(importarOpl(m.nombre, generarDocumentoOpl(m))); expect(Object.values(imp.modelo.abanicos)).toHaveLength(1);
    expect(Object.values(imp.modelo.abanicos)[0]!.operador).toBe(operador);
});

test('T-194 DEC52 agentes por proceso prevalecen y ningún miembro fabrica producto cartesiano', () => {
    let { m, ids } = comun(3, true); const agente = porNombre(m, 'Agente');
    const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'agente', objeto: porNombre(m, 'Auxiliar').id, proceso: porNombre(m, 'Alfa').id } })); m = r.modelo;
    const ls = enlaces(m); expect(ls.map(l => l.texto)).toEqual(['**Agente** y **Auxiliar** manejan *Alfa*.', '**Agente** maneja *Beta* e *Índice*.']);
    expect(new Set(ls.flatMap(l => l.hechos))).toEqual(new Set([...ids, r.creados[0]!])); expect(ls.flatMap(l => l.hechos)).toHaveLength(4);
    expect(Object.values(m.enlaces).filter(e => e.tipo === 'agente' && e.objeto === agente.id)).toHaveLength(3);
    const imp = must(importarOpl(m.nombre, generarDocumentoOpl(m))); expect(generarDocumentoOpl(imp.modelo)).toBe(generarDocumentoOpl(m));
});

for (const texto of ['**Agente** maneja *Alfa*, *Beta*.', '**Agente** maneja *Alfa* y *Beta* y *Índice*.', '**Agente** maneja *Alfa* o *Beta*.', '**Agente** en `libre` maneja *Alfa* y *Beta*.', '3 **Agente** maneja *Alfa* y *Beta*.', '**Agente** inicia y maneja *Alfa* y *Beta*.'])
    test(`T-150 T-194 DEC52 agente común rechaza extrapolación o lista inválida ${texto}`, () => {
        const a = analizar(texto)[0]!; expect(a.hechos).toEqual([]); expect(a.diagnosticos.length).toBeGreaterThan(0);
    });

test('T-150 T-194 DEC52 agente común conserva procesos y objeto tipográficamente opacos', () => {
    const a = analizar('**Agente y Auxiliar** maneja *Alfa y Beta* e *Índice o Registro*.')[0]!;
    expect(a.diagnosticos).toEqual([]); expect(a.hechos).toEqual([
        { k: 'enlace', enlace: { tipo: 'agente', objeto: { nombre: 'Agente y Auxiliar', tipo: 'objeto' }, proceso: 'Alfa y Beta' } },
        { k: 'enlace', enlace: { tipo: 'agente', objeto: { nombre: 'Agente y Auxiliar', tipo: 'objeto' }, proceso: 'Índice o Registro' } }
    ]);
});


test('T-132 T-194 DEC52 agente común en despliegue conserva CX3 y modo con auto-no-op del hijo', () => {
    let { m } = comun(); const agente = porNombre(m, 'Agente').id;
    for (const nombre of procesos) m = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'exhibicion', refinable: agente, refinador: porNombre(m, nombre).id } })).modelo;
    const r = must(desplegar(m, { opd: m.raiz, cosa: agente, modo: 'exhibicion' })); m = r.modelo; const hijo = r.creados[0]!;
    expect(enlaces(m, hijo).some(l => l.texto === '**Agente** maneja *Alfa*, *Beta* e *Índice*.')).toBe(true);
    expect(generarBloque(m, hijo).some(l => l.plantilla === 'CX3')).toBe(true);
    expect(planificar(m, hijo, textoCanonico(generarBloque(m, hijo))).acciones).toEqual([]);
    const imp = must(importarOpl(m.nombre, generarDocumentoOpl(m))); expect(generarDocumentoOpl(imp.modelo)).toBe(generarDocumentoOpl(m));
});

test('T-194 DEC52 agente común conserva orden estable y pureza frente a permutación', () => {
    const { m } = comun(), antes = exportarV0(m), doc = generarDocumentoOpl(m);
    const p = { ...m, enlaces: Object.fromEntries(Object.entries(m.enlaces).reverse()) };
    expect(generarDocumentoOpl(p)).toBe(doc); expect(exportarV0(m)).toBe(antes);
});
