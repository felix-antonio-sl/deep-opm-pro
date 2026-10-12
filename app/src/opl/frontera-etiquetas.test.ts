import { expect, test } from 'bun:test';
import { modeloCon, must, porNombre } from '../pruebas/constructores';
import { crearEnlace } from '../nucleo/enlaces';
import { gatesExportacion } from '../nucleo/diagnostico';
import { exportarV0 } from '../codec/exportar';
import { generarDocumentoOpl, importarOpl } from './documento';
import { generarBloque } from './generar';
import { analizar } from './analizar';
import { planificar } from './planificar';
import type { Multiplicidad } from '../nucleo/tipos';

function modelo(etiqueta: string, multOrigen?: Multiplicidad, multDestino?: Multiplicidad) {
    const b = modeloCon({ objetos: [['Origen', []], ['Destino', []]] });
    return must(crearEnlace(b, { opd: b.raiz, candidato: {
        tipo: 'etiquetado', origen: porNombre(b, 'Origen').id, destino: porNombre(b, 'Destino').id,
        etiqueta, ...(multOrigen ? { multOrigen } : {}), ...(multDestino ? { multDestino } : {})
    } })).modelo;
}

for (const [etiqueta, mult, lado] of [
    ['conoce 3', '3', 'destino'], ['conoce al menos un', '+', 'destino'],
    ['conoce al menos dos', '2..*', 'destino'], ['opcionales conoce', '*', 'origen']
] as const) test(`T-119 T-128 T-182 T-194 B-55 conserva ambos hechos: ${etiqueta}`, () => {
    const a = modelo(etiqueta), b = modelo('conoce', lado === 'origen' ? mult : undefined, lado === 'destino' ? mult : undefined);
    const firma = (m: typeof a) => Object.values(m.enlaces).map(e => {
        if (e.tipo !== 'etiquetado') throw Error('Tipo');
        return [m.cosas[e.origen]!.nombre, m.cosas[e.destino]!.nombre, e.etiqueta, e.multOrigen, e.multDestino];
    });
    expect(firma(a)).not.toEqual(firma(b));
    const da = generarDocumentoOpl(a), db = generarDocumentoOpl(b);
    expect(da).not.toBe(db);
    for (const m of [a, b]) {
        expect(gatesExportacion(m, 'modelo')).toEqual([]);
        const antes = exportarV0(m), doc = generarDocumentoOpl(m), r = must(importarOpl(m.nombre, doc));
        expect(r.plan.resumen.noAplicables).toBe(0); expect(firma(r.modelo)).toEqual(firma(m));
        expect(generarDocumentoOpl(r.modelo)).toBe(doc); expect(planificar(m, 'modelo', doc).acciones).toEqual([]);
        const token = generarBloque(m, m.raiz).flatMap(l => l.tokens).find(t => t.ref?.tipo === 'enlace');
        expect(token!.texto).toBe(Object.values(m.enlaces)[0]!.tipo === 'etiquetado' ? (Object.values(m.enlaces)[0] as { etiqueta: string }).etiqueta : '');
        expect(token!.texto).not.toContain('«'); expect(exportarV0(m)).toBe(antes);
    }
});

for (const texto of ['**Origen** conoce 3 **Destino**.', '**Origen** conoce al menos un **Destino**.',
    '**Origen** conoce al menos dos **Destino**.', '**Origen** opcionales conoce **Destino**.'])
    test(`T-156 T-173 B-55 legacy ambiguo conserva entrada sin hechos ni acciones: ${texto}`, () => {
        const l = analizar(texto)[0]!;
        expect(l.texto).toBe(texto); expect(l.hechos).toEqual([]);
        expect(l.diagnosticos.map(d => d.codigo)).toEqual(['ambiguous-symbol']);
        const b = modeloCon({ objetos: [['Origen', []], ['Destino', []]] }), antes = exportarV0(b);
        expect(planificar(b, b.raiz, texto).acciones).toEqual([]); expect(exportarV0(b)).toBe(antes);
    });

for (const texto of ['**Origen** «conoce **Destino**.', '**Origen** conoce» **Destino**.',
    '**Origen** ««conoce» **Destino**.', '**Origen** «conoce»» **Destino**.'])
    test(`T-150 T-156 B-55 delimitador incompleto o sobrante se rechaza: ${texto}`, () => {
        const l = analizar(texto)[0]!; expect(l.hechos).toEqual([]);
        expect(l.diagnosticos.map(d => d.codigo)).toEqual(['syntax-error']);
    });

for (const texto of ['**Origen** conoce **Destino**.', '3 **Origen** conoce **Destino**.',
    '**Origen** y **Destino** son asociados.', '**Origen** tiene un **Destino** opcional.'])
    test(`T-150 T-156 B-55 entrada histórica unívoca conserva su hecho: ${texto}`, () => {
        const l = analizar(texto)[0]!; expect(l.diagnosticos).toEqual([]); expect(l.hechos).toHaveLength(1);
        const r = must(importarOpl('Prueba','# Prueba\n\n## SD\n'+texto));
        expect(r.plan.resumen.noAplicables).toBe(0);
        const e = Object.values(r.modelo.enlaces)[0]!;
        if (texto.startsWith('3 ')) expect('multOrigen' in e && e.multOrigen).toBe('3');
        if (texto.endsWith('opcional.')) expect('multDestino' in e && e.multDestino).toBe('?');
        expect(generarDocumentoOpl(r.modelo)).toContain('«');
    });
