import { expect, test } from 'bun:test';
import type { Modelo, Enlace, Objeto, Proceso } from '../nucleo/tipos';
import { validarForma } from '../nucleo/forma';
import { noOfrecido, erroresContexto } from '../nucleo/matriz';
import { formarAbanico } from '../nucleo/abanicos';
import { importarV0 } from '../codec/importar';
import { exportarV0 } from '../codec/exportar';
import { generarBloque } from '../opl/generar';
import { PLANTILLAS } from '../opl/plantillas';
import { escena } from './escena';
import { exportarDiagrama, exportarDocumento } from './exportar';
import { readFileSync } from 'node:fs';

function base(tipo: 'consumo' | 'resultado' | 'agente' | 'instrumento', operador: 'XOR' | 'OR', estado: 'uniforme' | 'distinto' | 'ausente'): Modelo {
    const o: Objeto = { id: 'o', nombre: 'Pedido', tipo: 'objeto', esencia: tipo === 'agente' ? 'fisica' : 'informacional', afiliacion: 'sistemica', estados: [{ id: 's1', nombre: 'pendiente' }, { id: 's2', nombre: 'pagado' }] };
    const proceso = (id: string, nombre: string): Proceso => ({ id, nombre, tipo: 'proceso', esencia: 'informacional', afiliacion: 'sistemica', duracion: { min: 123456789012345, esperada: 123456789012346, max: 123456789012347 } });
    const enlaces: Enlace[] = ['p', 'q'].map((proceso, i) => ({ id: `e${i + 1}`, tipo, objeto: 'o', proceso, ...(estado === 'ausente' ? {} : { estado: estado === 'uniforme' || i === 0 ? 's1' : 's2' }) }));
    return { id: 'decision29', nombre: 'Prueba', raiz: 'sd', unidadTiempo: 'min', secuencia: 100, cosas: { o, p: proceso('p', 'Procesar'), q: proceso('q', 'Archivar') }, enlaces: Object.fromEntries(enlaces.map(e => [e.id, e])), abanicos: { f: { id: 'f', operador, enlaces: ['e1', 'e2'] } }, opds: { sd: { id: 'sd', tipo: 'raiz', apariciones: { o: { x: 0, y: 0, ancho: 300, alto: 220 }, p: { x: -200, y: -200, ancho: 135, alto: 60 }, q: { x: -200, y: 200, ancho: 135, alto: 60 } } } } };
}

for (const tipo of ['consumo', 'resultado', 'agente', 'instrumento'] as const)
    for (const operador of ['XOR', 'OR'] as const)
        for (const estado of ['uniforme', 'distinto'] as const) {
            test(`T-054 DEC29 rechaza común en estado ${tipo} ${operador} ${estado} sin reservar identidad`, () => {
                const m = base(tipo, operador, estado), antes = JSON.stringify(m), f = m.abanicos.f!;
                expect(validarForma({ ...m, abanicos: {} })).toEqual([]);
                expect(validarForma(m).every(v => v.codigo === 'F-5')).toBe(true);
                expect(noOfrecido(m, m.enlaces.e1!, f)?.registro).toBe('B-06');
                const r = formarAbanico({ ...m, abanicos: {} }, { enlaces: f.enlaces, operador });
                expect(r.ok).toBe(false);
                if (!r.ok) expect(r.rechazo.codigo).toBe('no-ofrecido');
                expect(JSON.stringify(m)).toBe(antes);
                expect(m.secuencia).toBe(100);
            });
            test(`T-287 T-281 DEC29 import retira sólo fan ${tipo} ${operador} ${estado} y exporta estados sueltos`, () => {
                const m = base(tipo, operador, estado), entrada = exportarV0(m), r = importarV0(entrada);
                expect(r.ok).toBe(true);
                if (!r.ok) throw new Error('Importación válida');
                expect(r.modelo.abanicos).toEqual({});
                expect(r.modelo.enlaces).toEqual(m.enlaces);
                expect(r.modelo.cosas).toEqual(m.cosas);
                expect(validarForma(r.modelo)).toEqual([]);
                expect(erroresContexto(r.modelo)).toEqual([]);
                expect(r.informe.descartado.some(e => e.ruta.includes('abanicos.f') && e.regla === 'R-FAN-EST-1')).toBe(true);
                const antes = JSON.stringify(r.modelo), e = escena(r.modelo, 'sd');
                expect(e.arcos).toEqual([]);
                expect(e.aristas.map(a => [a.ref.id, a.tramos.map(t => t.puntos.length)])).toEqual([['e1', [2]], ['e2', [2]]]);
                const ls = generarBloque(r.modelo, 'sd');
                expect(ls.some(l => l.plantilla.startsWith('FANLOCAL'))).toBe(false);
                expect(ls.flatMap(l => l.hechos)).toEqual(expect.arrayContaining(['e1', 'e2']));
                const estados = ls.flatMap(l => l.tokens.filter(t => t.marca === 'estado').map(t => t.ref!.id));
                expect(estados).toEqual(expect.arrayContaining(estado === 'uniforme' ? ['s1'] : ['s1', 's2']));
                const svg = exportarDiagrama(r.modelo, 'sd', { version: 'DEC29' });
                const html = exportarDocumento(r.modelo, new Map([['sd', ls]]), { version: 'DEC29' });
                expect(svg.ok).toBe(true); expect(html.ok).toBe(true);
                if (svg.ok) { expect(svg.valor.svg).toContain('canon-diagrama'); expect(svg.valor.svg).toContain('@font-face'); }
                if (html.ok) expect(html.valor.html).toContain('canon-documento');
                expect(JSON.stringify(r.modelo)).toBe(antes); expect(exportarV0(m)).toBe(entrada);
            });
        }

test('T-105 DEC29 tabla de plantillas no contiene dialecto local', () => {
    expect(PLANTILLAS.some(p => p.id.startsWith('FANLOCAL'))).toBe(false);
});

for (const operador of ['XOR', 'OR'] as const)
    test(`T-216 DEC29 común en borde ${operador} conserva acople exacto radios y rectas aun solapado`, () => {
        const m = base('consumo', operador, 'ausente'), antes = JSON.stringify(m);
        expect(noOfrecido(m, m.enlaces.e1!, m.abanicos.f!)).toBeNull();
        expect(erroresContexto(m)).toEqual([]);
        const e = escena(m, 'sd');
        expect(e.arcos.map(a => a.radio)).toEqual(operador === 'XOR' ? [30] : [30, 35]);
        const C = e.arcos[0]!.centro;
        expect(C.x === 0 || C.x === 300 || C.y === 0 || C.y === 220).toBe(true);
        expect(e.aristas.map(a => a.tramos[0]!.puntos.at(-1))).not.toEqual([C, C]);
        expect(e.aristas.map(a => a.tramos[0]!.puntos[0])).toEqual([C, C]);
        expect(e.aristas.every(a => a.tramos.every(t => t.puntos.length === 2))).toBe(true);
        expect(exportarDiagrama(m, 'sd', { version: 'DEC29' }).ok).toBe(true);
        expect(JSON.stringify(m)).toBe(antes);
    });

for (const operador of ['XOR', 'OR'] as const)
    test(`T-054 DEC29 TS3 salida común sin literal se importa como enlaces sueltos ${operador}`, () => {
        const m = base('consumo', operador, 'ausente');
        const enlaces: Record<string, Enlace> = {
            e1: { id: 'e1', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's1', salida: 's2' },
            e2: { id: 'e2', tipo: 'efecto', objeto: 'o', proceso: 'p', entrada: 's2', salida: 's2' }
        };
        const modelo = { ...m, enlaces }, antes = JSON.stringify(modelo);
        expect(noOfrecido(modelo, enlaces.e1!, modelo.abanicos.f!)?.registro).toBe('B-06');
        const r = importarV0(exportarV0(modelo));
        expect(r.ok).toBe(true);
        if (!r.ok) throw new Error('Importación');
        expect(r.modelo.abanicos).toEqual({}); expect(r.modelo.enlaces).toEqual(enlaces);
        expect(generarBloque(r.modelo, 'sd').filter(l => l.hechos.length).map(l => l.texto)).toEqual([
            '*Procesar* cambia **Pedido** de `pendiente` a `pagado`.',
            '*Procesar* cambia **Pedido** de `pagado` a `pagado`.'
        ]);
        expect(JSON.stringify(modelo)).toBe(antes);
    });

const archivados = [
    ...JSON.parse(readFileSync(new URL('./pruebas/modelos-B-v2.json', import.meta.url), 'utf8')),
    ...JSON.parse(readFileSync(new URL('./pruebas/modelos-uniformes-X.json', import.meta.url), 'utf8'))
] as readonly { id: string; opd?: string; jsonOriginal: string }[];
for (const archivo of archivados)
    test(`T-287 T-216 DEC29 modelo archivado ${archivo.id} preserva todos los enlaces en import/export`, () => {
        const original = JSON.parse(archivo.jsonOriginal) as Modelo, antes = JSON.stringify(original);
        const r = importarV0(exportarV0(original));
        expect(r.ok).toBe(true);
        if (!r.ok) throw new Error('Importación');
        expect(validarForma(r.modelo)).toEqual([]);
        expect(r.modelo.enlaces).toEqual(original.enlaces);
        expect(r.modelo.cosas).toEqual(original.cosas);
        const e = escena(r.modelo, archivo.opd ?? 'sd');
        expect(e.aristas.flatMap(a => a.hechos).sort()).toEqual(Object.keys(original.enlaces).sort());
        expect(e.aristas.every(a => a.tramos.every(t => t.puntos.length === 2))).toBe(true);
        const exportado = exportarDiagrama(r.modelo, archivo.opd ?? 'sd', { version: 'DEC29' });
        if (archivo.opd === 'h') {
            expect(exportado.ok).toBe(false);
            if (!exportado.ok) expect(exportado.rechazo.regla).toBe('R-ROL-UNIC-1');
        } else expect(exportado.ok).toBe(true);
        expect(JSON.stringify(original)).toBe(antes);
    });

test('T-287 DEC29 Async sin grupos conserva hechos y errores recuperables históricos', () => {
    const r = importarV0(readFileSync(new URL('../../fixtures/v0/SD_Async.json', import.meta.url), 'utf8'));
    expect(r.ok).toBe(true); if (!r.ok) throw Error('Fixture Async');
    expect(r.modelo.abanicos).toEqual({});
    expect(r.informe.descartado).toEqual([]);
    const errores = erroresContexto(r.modelo).filter(d => d.regla === 'R-ROL-UNIC-1');
    expect(errores.flatMap(d => d.refs.map(ref => ref.id))).toEqual(['e-25','e-27','e-29','e-31','e-66','e-68','e-70','e-72']);
    const segunda = importarV0(exportarV0(r.modelo));
    expect(segunda.ok).toBe(true); if (!segunda.ok) throw Error('Punto fijo Async');
    expect(segunda.modelo.enlaces).toEqual(r.modelo.enlaces);
    expect(segunda.modelo.cosas).toEqual(r.modelo.cosas);
    const exportado = exportarDiagrama(r.modelo, r.modelo.raiz, { version:'DEC29' });
    expect(exportado.ok).toBe(false);
    if (!exportado.ok) expect(exportado.rechazo.regla).toBe('R-ROL-UNIC-1');
});
