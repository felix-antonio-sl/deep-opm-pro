import { expect, test } from 'bun:test';
import { esMultiplicidad } from './matriz';
import { modeloCon, must, porNombre } from '../pruebas/constructores';
import { crearEnlace, fijarMultiplicidad } from './enlaces';
import { exportarV0 } from '../codec/exportar';
import { importarV0 } from '../codec/importar';
import { generarDocumentoOpl, importarOpl } from '../opl/documento';
import { planificar } from '../opl/planificar';
import { analizar } from '../opl/analizar';
import type { Multiplicidad } from './tipos';

for (const valor of ['muchos', 'n', 'N', 'k', 'n2', 'Mínimo', 'e', 'o', 'u', 'y'] as const)
    test(`T-057 T-128 T-192 B-42 cantidad cualitativa/símbolo ${valor} conserva hechos y códec`, () => {
        expect(esMultiplicidad(valor)).toBe(true);
        const base = modeloCon({ objetos: [['Persona', []]], procesos: ['Atender'] });
        const obj = porNombre(base, 'Persona'), pro = porNombre(base, 'Atender');
        const n = must(crearEnlace(base, { opd: base.raiz, candidato: { tipo: 'agente', objeto: obj.id, proceso: pro.id, mult: valor as Multiplicidad } }));
        const doc = generarDocumentoOpl(n.modelo), r = must(importarOpl(base.nombre, doc));
        expect(Object.values(r.modelo.enlaces).map(e => 'mult' in e ? e.mult : undefined)).toEqual([valor]);
        expect(generarDocumentoOpl(r.modelo)).toBe(doc); expect(planificar(n.modelo, 'modelo', doc).acciones).toEqual([]);
        if (valor === 'n') expect(doc).toContain('«n» **Persona** maneja');
        const json = exportarV0(n.modelo), fijo = importarV0(json);
        expect(fijo.ok).toBe(true); if (!fijo.ok) throw Error('Códec');
        expect(exportarV0(fijo.modelo)).toBe(json);
    });

test('T-057 T-128 B-42 muchos conserva falta de cota y género sin equivaler a opcionales', () => {
    const b = modeloCon({ objetos: [['Persona', []]], procesos: ['Atender'] }), obj = porNombre(b, 'Persona');
    const base = { ...b, cosas: { ...b.cosas, [obj.id]: { ...obj, genero: 'f' as const } } };
    const m = must(crearEnlace(base, { opd: base.raiz, candidato: { tipo: 'agente', objeto: obj.id, proceso: porNombre(base, 'Atender').id, mult: 'muchos' as Multiplicidad } })).modelo;
    expect(generarDocumentoOpl(m)).toContain('Muchas **Persona** maneja');
    const r = must(importarOpl(m.nombre, generarDocumentoOpl(m)));
    expect(Object.values(r.modelo.enlaces).map(e => 'mult' in e ? e.mult : undefined)).toEqual(['muchos']);
    const id = Object.keys(m.enlaces)[0]!, otro = must(fijarMultiplicidad(m, { enlace: id, extremo: 'objeto', valor: '*' })).modelo;
    expect(generarDocumentoOpl(otro)).not.toBe(generarDocumentoOpl(m));
});

test('T-057 R-MULT-2 B-42 símbolos globales reutilizados, sensibles a mayúsculas y ajenos a cosas', () => {
    let m = modeloCon({ objetos: [['Pedido', []], ['Registro', []], ['N', []]], procesos: ['Preparar', 'Revisar'] });
    for (const [tipo, objeto, proceso, mult] of [['consumo', 'Pedido', 'Preparar', 'n'], ['resultado', 'Registro', 'Revisar', 'n'], ['instrumento', 'N', 'Revisar', 'N']] as const)
        m = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo, objeto: porNombre(m, objeto).id, proceso: porNombre(m, proceso).id, mult: mult as Multiplicidad } })).modelo;
    const antes = exportarV0(m), doc = generarDocumentoOpl(m), r = must(importarOpl(m.nombre, doc));
    expect(Object.values(r.modelo.enlaces).map(e => 'mult' in e ? e.mult : undefined)).toEqual(['n', 'n', 'N']);
    expect(Object.values(r.modelo.cosas).map(c => c.nombre).sort()).toEqual(Object.values(m.cosas).map(c => c.nombre).sort());
    expect(planificar(m, 'modelo', doc).acciones).toEqual([]); expect(exportarV0(m)).toBe(antes);
});

for (const parametro of ['e', 'o', 'u', 'y'])
    test(`T-057 T-194 B-42 lista conserva separador y parámetro ${parametro} como tokens distintos`, () => {
        let m = modeloCon({ objetos: [['Alfa', []], ['Beta', []]], procesos: ['Preparar'] });
        for (const [objeto, mult] of [['Alfa', undefined], ['Beta', parametro]] as const)
            m = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'consumo', objeto: porNombre(m, objeto).id,
                proceso: porNombre(m, 'Preparar').id, ...(mult ? { mult } : {}) } })).modelo;
        const doc = generarDocumentoOpl(m), r = must(importarOpl(m.nombre, doc));
        expect(Object.values(r.modelo.enlaces).map(e => 'mult' in e ? e.mult : undefined)).toEqual([undefined, parametro]);
        expect(generarDocumentoOpl(r.modelo)).toBe(doc); expect(planificar(m, 'modelo', doc).acciones).toEqual([]);
    });

for (const valor of ['0', '1', '2..5', 'n..m', 'n + 1', 'n; n>=1', 'n/', 'un', 'una', 'Muchos', 'muchas', 'Infinity', 'NaN'])
    test(`T-057 B-10 B-42 límite de realización declarado: ${valor}`, () => {
        expect(esMultiplicidad(valor)).toBe(false);
        const b = modeloCon({ objetos: [['Pedido', []]], procesos: ['Preparar'], enlaces: [['consumo', 'Pedido', 'Preparar']] });
        const antes = exportarV0(b), r = fijarMultiplicidad(b, { enlace: Object.keys(b.enlaces)[0]!, extremo: 'objeto', valor: valor as Multiplicidad });
        expect(r.ok).toBe(false); expect(exportarV0(b)).toBe(antes);
    });

for (const palabra of ['Infinity', 'NaN', 'un', 'una'])
    test(`T-150 T-173 B-42 no descarta un prefijo de cantidad no ofrecido: ${palabra}`, () => {
        const texto = '*Preparar* consume ' + palabra + ' **Pedido**.', l = analizar(texto)[0]!;
        expect(l.texto).toBe(texto); expect(l.hechos).toEqual([]); expect(l.diagnosticos.length).toBeGreaterThan(0);
        const b = modeloCon({ objetos: [['Pedido', []]], procesos: ['Preparar'] }), antes = exportarV0(b);
        expect(planificar(b,b.raiz,texto).acciones).toEqual([]); expect(exportarV0(b)).toBe(antes);
    });
