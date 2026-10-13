import { test, expect } from 'bun:test';
import { analizar } from './analizar';
import { planificar } from './planificar';
import { aplicarPlan } from './aplicar';
import { generarDocumentoOpl, importarOpl } from './documento';
import { modeloCon, must, porNombre } from '../pruebas/constructores';
import { aplicarAcciones } from '../nucleo/operaciones';
import { validarForma } from '../nucleo/forma';
import { erroresContexto } from '../nucleo/matriz';
import { exportarV0 } from '../codec/exportar';
import { importarV0 } from '../codec/importar';

const rf5 = '**Auto** exhibe **Medio de Desplazamiento** en `tierra`.';
const base = () => modeloCon({
    objetos: [['Vehículo', []], ['Auto', []], ['Medio de Desplazamiento', ['tierra', 'agua']]],
    enlaces: [['generalizacion', 'Vehículo', 'Auto'], ['exhibicion', 'Vehículo', 'Medio de Desplazamiento']],
});
const aviso = { codigo: 'unsupported-canonical', severidad: 'warning', regla: 'R-STRE-2' };

for (const verbo of ['exhibe', 'Exhibe', 'EXHIBE']) test(`T-156 B-37 RF5 ${verbo} es canónica no soportada y nunca un etiquetado`, () => {
    const texto = rf5.replace('exhibe', verbo), l = analizar(texto)[0]!;
    expect(l.hechos).toEqual([]);
    expect(l.diagnosticos).toEqual([expect.objectContaining(aviso)]);
    expect(l.diagnosticos[0]!.mensaje).toContain('RF5');
    expect(l.diagnosticos[0]!.mensaje).toContain('B-37');
    const r = must(importarOpl('RF5 sin soporte', texto));
    expect(r.plan.acciones).toEqual([]);
    expect(r.modelo.cosas).toEqual({}); expect(r.modelo.enlaces).toEqual({});
    expect(r.modelo.secuencia).toBe(r.plan.base.secuencia);
});

test('T-156 T-173 B-37 RF5 no muta un contexto nativo válido ni sus IDs y campos guardados', () => {
    const b = base(), auto = porNombre(b, 'Auto').id;
    const m = must(aplicarAcciones(b, [
        { op: 'fijarGenero', args: { cosa: auto, genero: 'f' } },
        { op: 'fijarNombrePlural', args: { cosa: auto, nombre: 'Autos' } },
    ])).modelo;
    expect(validarForma(m)).toEqual([]); expect(erroresContexto(m)).toEqual([]);
    const antes = exportarV0(m), p = planificar(m, m.raiz, rf5);
    expect(p.lineas[0]).toMatchObject({ estado: 'sin-cambio', razon: 'inversa-no-soportada' });
    expect(p.lineas[0]!.diagnosticos).toEqual([expect.objectContaining(aviso)]);
    expect(p.acciones).toEqual([]);
    expect(must(aplicarPlan(m, p)).modelo).toBe(m);
    expect(exportarV0(m)).toBe(antes);
    const json = importarV0(antes); expect(json.ok).toBe(true);
    if (json.ok) expect(exportarV0(json.modelo)).toBe(antes);
});

test('T-156 T-173 B-37 documento mixto aplica sólo RF2 y conserva la RF5 sin acciones', () => {
    const m = base(), soportada = '**Auto** exhibe **Color**.';
    const solo = planificar(m, m.raiz, soportada), mixto = planificar(m, m.raiz, rf5 + '\n' + soportada);
    expect(mixto.lineas[0]!.diagnosticos).toEqual([expect.objectContaining(aviso)]);
    expect(mixto.acciones).toEqual(solo.acciones);
    const r = must(aplicarPlan(m, mixto)).modelo;
    expect(r).toEqual(must(aplicarPlan(m, solo)).modelo);
    expect(Object.values(r.enlaces).filter(e => e.tipo === 'etiquetado')).toEqual([]);
    expect(Object.values(r.enlaces).filter(e => e.tipo === 'exhibicion')).toHaveLength(2);
    expect(r.cosas[porNombre(m, 'Medio de Desplazamiento').id]).toEqual(porNombre(m, 'Medio de Desplazamiento'));
});

test('T-119 T-192 B-37 etiqueta explícita exhibe conserva otro hecho, roundtrip estricto y códec fijo', () => {
    const m = base(), texto = rf5.replace(' exhibe ', ' «exhibe» '), p = planificar(m, m.raiz, texto);
    expect(p.lineas[0]!.diagnosticos).toEqual([]);
    const r = must(aplicarPlan(m, p)).modelo, atributo = porNombre(m, 'Medio de Desplazamiento');
    if (atributo.tipo !== 'objeto') throw Error('Montaje');
    expect(Object.values(r.enlaces).filter(e => e.tipo === 'etiquetado')).toEqual([
        expect.objectContaining({ tipo: 'etiquetado', etiqueta: 'exhibe', origen: porNombre(m, 'Auto').id,
            destino: atributo.id, estadoDestino: atributo.estados[0]!.id }),
    ]);
    const doc = generarDocumentoOpl(r);
    expect(doc).toContain(texto); expect(doc).toContain('**Vehículo** exhibe **Medio de Desplazamiento**.');
    expect(planificar(r, r.raiz, doc).acciones).toEqual([]);
    const nuevo = must(importarOpl(r.nombre, doc));
    expect(nuevo.plan.lineas.flatMap(l => l.diagnosticos)).toEqual([]);
    expect(generarDocumentoOpl(nuevo.modelo)).toBe(doc);
    const e = Object.values(nuevo.modelo.enlaces).find(e => e.tipo === 'etiquetado')!;
    expect(e.tipo).toBe('etiquetado');
    if (e.tipo !== 'etiquetado') throw Error('Falta el etiquetado');
    expect(nuevo.modelo.cosas[e.origen]!.nombre).toBe('Auto');
    const destino = nuevo.modelo.cosas[e.destino]!;
    expect(destino.nombre).toBe('Medio de Desplazamiento');
    if (destino.tipo !== 'objeto') throw Error('Destino');
    expect(destino.estados.find(s => s.id === e.estadoDestino)?.nombre).toBe('tierra');
    expect(e.etiqueta).toBe('exhibe');
    const bytes = exportarV0(r), json = importarV0(bytes); expect(json.ok).toBe(true);
    if (json.ok) expect(exportarV0(json.modelo)).toBe(bytes);
});

for (const texto of [
    '**Auto exhibe** «exhibe» **Atributo en valor** en `estado exhibe`.',
    '**Auto** «exhibe Atributo en valor» **Atributo** en `tierra`.',
    '**Auto** «conoce» exhibe **Atributo** en `tierra`.',
    '**Auto** exhibe **Atributo exhibe**.',
]) test(`T-150 B-37 RF5 no interpreta datos opacos ${texto}`, () => {
    const l = analizar(texto)[0]!;
    expect(l.diagnosticos).toEqual([]); expect(l.hechos).toHaveLength(1);
});

test('T-157 B-37 la grafía histórica mantiene su clasificación sin ofrecer RF5', () => {
    const l = analizar('**Auto** exhibe `tierra` **Medio de Desplazamiento**.')[0]!;
    expect(l.hechos).toEqual([]);
    expect(l.diagnosticos).toEqual([expect.objectContaining({ codigo: 'non-canonical', regla: 'R-ZNC-1' })]);
});
