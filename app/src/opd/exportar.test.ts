import { expect, test } from 'bun:test';
import type { Modelo, Cosa } from '../nucleo/tipos';
import type { Escena } from './escena';
import { escena } from './escena';
import { exportarDiagrama, exportarDocumento, advertenciasEscena } from './exportar';
import { gatesExportacion } from '../nucleo/diagnostico';
import { generarBloque } from '../opl/generar';
const obj = (id: string): Cosa => ({ id, nombre: `Objeto${id.replace(/\d/g, d => String.fromCharCode(65 + Number(d)))}`, tipo: 'objeto', estados: [], esencia: 'informacional', afiliacion: 'sistemica' });
function m(n = 2): Modelo { return { id: 'modelo', nombre: 'Modelo <&>', raiz: 'sd', unidadTiempo: 'min', secuencia: 100, cosas: Object.fromEntries(Array.from({ length: n }, (_, i) => { const c = obj(`o${i}`); return [c.id, c]; })), enlaces: {}, abanicos: {}, opds: { sd: { id: 'sd', tipo: 'raiz', apariciones: Object.fromEntries(Array.from({ length: n }, (_, i) => [`o${i}`, { x: i * 220 - 40, y: 0, ancho: 135, alto: 60 }])) } } }; }
test('T-280 T-285 SVG perfil viewBox fuente y fondo', () => {
    const base = m(), r = exportarDiagrama(base, 'sd', { version: '1<&' });
    expect(r.ok).toBe(true);
    if (!r.ok)
        return;
    expect(r.valor.archivo).toBe('modelo-SD.svg');
    expect(r.valor.svg).toContain('<title>SD · Modelo &lt;&amp;&gt;</title>');
    expect(r.valor.svg).toContain('@font-face');
    expect(r.valor.svg).toContain('data:font/woff2;base64,');
    expect(r.valor.svg).toContain('"perfil":"canon-diagrama"');
    expect(r.valor.svg).toContain('"exportParcial":true');
    expect(r.valor.svg).toContain('fill="#fafaf8"');
    const vb = r.valor.svg.match(/viewBox="([^"]+)"/)![1]!.split(' ').map(Number), e = escena(base, 'sd');
    expect(vb).toEqual([e.caja.x - 24, e.caja.y - 24, e.caja.ancho + 48, e.caja.alto + 48]);
});
test('T-203 T-227 T-228 SVG sin interacción ni validación; texto negro', () => {
    const r = exportarDiagrama(m(), 'sd', { version: 'v' });
    expect(r.ok).toBe(true);
    if (!r.ok)
        return;
    for (const x of ['data-ref', 'CapaUi', 'crimson', '#8e2a2e', 'grid', 'handle', 'validado'])
        expect(r.valor.svg).not.toContain(x);
    expect(r.valor.svg).toContain('fill="#000"');
});
test('T-283 gates densidad y error reales con motivos', () => {
    for (const base of [m(26), { ...m(), cosas: { ...m().cosas, o0: { ...obj('o0'), nombre: 'nombre ilegal' } } }]) {
        const gs = gatesExportacion(base, { opd: 'sd' });
        expect(gs.length).toBeGreaterThan(0);
        expect(exportarDiagrama(base, 'sd', { version: 'v' })).toEqual({ ok: false, rechazo: gs[0]! });
        expect(exportarDocumento(base, new Map(), { version: 'v' })).toEqual({ ok: false, rechazo: gatesExportacion(base, 'modelo')[0]! });
    }
});
test('T-283 refinamiento menor que dos bloquea', () => { const base = m(), p: Cosa = { id: 'p', nombre: 'Procesar', tipo: 'proceso', esencia: 'informacional', afiliacion: 'sistemica' }, q: Cosa = { ...p, id: 'q', nombre: 'Preparar' }, a = { x: 0, y: 0, ancho: 135, alto: 60 }, h: Modelo = { ...base, cosas: { p, q }, opds: { sd: { id: 'sd', tipo: 'raiz', apariciones: { p: a } }, h: { id: 'h', tipo: 'descomposicion', padre: 'sd', cosa: 'p', orden: 0, bandas: [['q']], objetosInternos: [], apariciones: { p: a, q: { ...a, y: 100 } } } } }; expect(gatesExportacion(h, { opd: 'h' }).map(r => r.regla)).toContain('AP-13, R-REF-NTRIV-1/2'); expect(exportarDiagrama(h, 'h', { version: 'v' })).toEqual({ ok: false, rechazo: gatesExportacion(h, { opd: 'h' })[0]! }); });
test('T-281 HTML autocontenido OPL inyectada con escape y fuente una vez', () => {
    const r = exportarDocumento(m(), new Map([['sd', [{ tokens: [{ texto: 'Pedido <&>', marca: 'objeto' as const }, { texto: ' procesa ' }, { texto: 'Procesar', marca: 'proceso' as const }, { texto: 'nuevo', marca: 'estado' as const }] }]]]), { version: 'v' });
    expect(r.ok).toBe(true);
    if (!r.ok)
        return;
    expect(r.valor.archivo).toBe('modelo.html');
    expect(r.valor.html).toContain('<strong>Pedido &lt;&amp;&gt;</strong>');
    expect(r.valor.html).toContain('<em>Procesar</em>');
    expect(r.valor.html).toContain('<code>nuevo</code>');
    expect(r.valor.html.match(/@font-face/g)).toHaveLength(2);
    expect(r.valor.html).not.toMatch(/(?:src|href)="https?:/);
    expect(r.valor.html).toContain('<h2');
    expect(r.valor.html).toContain('canon-documento');
});
function manual(): Escena { const n = (id: string, x: number, y: number) => ({ ref: { tipo: 'cosa' as const, id }, tipo: 'objeto' as const, caja: { x, y, ancho: 40, alto: 40 }, contenedor: false, grueso: false, ambiental: false, fisica: false, rotulo: { lineas: [id], x: x + 20, y: y + 20, italica: false }, estados: [] }); return { opd: 'sd', caja: { x: 0, y: 0, ancho: 300, alto: 300 }, nodos: [n('a', 0, 0), n('b', 100, 100), n('c', 0, 100), n('d', 100, 0), n('oculta', 55, 55)], simbolos: [], arcos: [], aristas: [{ ref: { tipo: 'enlace', id: 'e1' }, hechos: ['e1'], tramos: [{ puntos: [{ x: 40, y: 40 }, { x: 100, y: 100 }] }], rayo: false, marcas: [], etiquetas: [], capa: 4 }, { ref: { tipo: 'enlace', id: 'e2' }, hechos: ['e2'], tramos: [{ puntos: [{ x: 40, y: 100 }, { x: 100, y: 40 }] }], rayo: false, marcas: [], etiquetas: [], capa: 4 }] }; }
test('T-284 cruces y atravesamientos sin reroute', () => { const e = manual(), antes = JSON.stringify(e), ws = advertenciasEscena(e); expect(ws.filter(w => w.tipo === 'cruce')).toHaveLength(1); expect(ws.some(w => w.tipo === 'atraviesa' && w.refs.some(r => r.id === 'oculta'))).toBe(true); expect(JSON.stringify(e)).toBe(antes); });
test('T-284 solapes excepto contenedor e internos', () => { const e = manual(), a = e.nodos[0]!, b = { ...e.nodos[1]!, caja: { ...a.caja, x: 10 } }; expect(advertenciasEscena({ ...e, nodos: [a, b], aristas: [] }).map(w => w.tipo)).toEqual(['solape']); expect(advertenciasEscena({ ...e, nodos: [{ ...a, contenedor: true, caja: { x: 0, y: 0, ancho: 400, alto: 400 } }, b], aristas: [] })).toEqual([]); });
test('T-281 T-283 documento con varios OPDs conserva árbol fuente y filtros locales', () => {
    const base = m(), p: Cosa = { id: 'p', nombre: 'Procesar', tipo: 'proceso', esencia: 'fisica', afiliacion: 'sistemica' }, q: Cosa = { ...p, id: 'q', nombre: 'Preparar' }, s: Cosa = { ...p, id: 's', nombre: 'Despachar' }, a = { x: 0, y: 0, ancho: 135, alto: 60 };
    const h: Modelo = { ...base, cosas: { p, q, s }, opds: { sd: { id: 'sd', tipo: 'raiz', apariciones: { p: a } }, h: { id: 'h', tipo: 'descomposicion', padre: 'sd', cosa: 'p', orden: 0, bandas: [['q'], ['s']], objetosInternos: [], apariciones: { p: { ...a, ancho: 420, alto: 288 }, q: { ...a, x: 140, y: 64 }, s: { ...a, x: 140, y: 164 } } } } };
    expect(gatesExportacion(h, 'modelo')).toEqual([]);
    const r = exportarDocumento(h, new Map([['h', [{ tokens: [{ texto: 'XOR:\n  ' }, { texto: 'Preparar', marca: 'proceso' as const }, { texto: '\n  ' }, { texto: 'Despachar', marca: 'proceso' as const }] }]]]), { version: '</metadata><script>bad</script>' });
    expect(r.ok).toBe(true);
    if (!r.ok)
        return;
    expect(r.valor.html.match(/@font-face/g)).toHaveLength(2);
    expect(r.valor.html).toContain('id="sombra-fisica-0"');
    expect(r.valor.html).toContain('id="sombra-fisica-1"');
    expect(r.valor.html).not.toContain('<script>');
    expect(r.valor.html).toContain('XOR:\n  <em>Preparar</em>\n  <em>Despachar</em>');
    expect(r.valor.html).toContain('white-space:pre-wrap');
    expect(r.valor.html.indexOf('<h2>SD</h2>')).toBeLessThan(r.valor.html.indexOf('<h2>SD1</h2>'));
});
test('T-280 OPD inexistente rechaza sin escena inventada', () => {
    const r = exportarDiagrama(m(), 'no-existe', { version: 'v' });
    expect(r.ok).toBe(false);
    if (!r.ok)
        expect(r.rechazo.codigo).toBe('no-encontrado');
});
test('T-284 cruce de aristas incidentes y contacto de terminal no son oclusión', () => { const e = manual(), a = e.aristas[0]!, b = { ...e.aristas[1]!, tramos: [{ puntos: [{ x: 40, y: 40 }, { x: 40, y: 100 }] }] }; expect(advertenciasEscena({ ...e, nodos: e.nodos.slice(0, 4), aristas: [a, b] }).filter(w => w.tipo === 'cruce')).toEqual([]); expect(advertenciasEscena({ ...e, nodos: e.nodos.slice(0, 2), aristas: [a] })).toEqual([]); });
test('T-281 árbol HTML refleja jerarquía OPD en lista anidada', () => {
    const base = m(), p: Cosa = { id: 'p', nombre: 'Procesar', tipo: 'proceso', esencia: 'informacional', afiliacion: 'sistemica' }, q: Cosa = { ...p, id: 'q', nombre: 'Preparar' }, s: Cosa = { ...p, id: 's', nombre: 'Despachar' }, a = { x: 0, y: 0, ancho: 135, alto: 60 }, h: Modelo = { ...base, cosas: { p, q, s }, opds: { sd: { id: 'sd', tipo: 'raiz', apariciones: { p: a } }, h: { id: 'h', tipo: 'descomposicion', padre: 'sd', cosa: 'p', orden: 0, bandas: [['q'], ['s']], objetosInternos: [], apariciones: { p: { ...a, ancho: 420, alto: 288 }, q: { ...a, x: 140, y: 64 }, s: { ...a, x: 140, y: 164 } } } } };
    const r = exportarDocumento(h, new Map(), { version: 'v' });
    expect(r.ok).toBe(true);
    if (!r.ok)
        return;
    expect(r.valor.html).toContain('<li><a href="#opd-0">SD</a><ol><li><a href="#opd-1">SD1</a></li></ol></li>');
});
test('T-281 B-31 tokens G reales multilineales conservan cabecera ramas y referencias en HTML', () => {
    const base = m(), o: Cosa = { ...obj('o'), nombre: 'Pedido', tipo: 'objeto', estados: [{ id: 'pend', nombre: 'pendiente' }, { id: 'pag', nombre: 'pagado' }] }, p: Cosa = { id: 'p', nombre: 'Procesar', tipo: 'proceso', esencia: 'informacional', afiliacion: 'sistemica' }, q: Cosa = { ...p, id: 'q', nombre: 'Archivar' }, a = { x: 0, y: 0, ancho: 135, alto: 60 }, fan: Modelo = { ...base, cosas: { o, p, q }, enlaces: { e1: { id: 'e1', tipo: 'consumo', objeto: 'o', proceso: 'p', estado: 'pend' }, e2: { id: 'e2', tipo: 'consumo', objeto: 'o', proceso: 'q', estado: 'pag' } }, abanicos: { f: { id: 'f', operador: 'XOR', enlaces: ['e1', 'e2'] } }, opds: { sd: { id: 'sd', tipo: 'raiz', apariciones: { o: a, p: { ...a, x: 300, y: 100 }, q: { ...a, x: 300, y: 300 } } } } };
    expect(gatesExportacion(fan, 'modelo')).toEqual([]);
    const ls = generarBloque(fan, 'sd'), l = ls.find(l => l.plantilla === 'FANLOCAL-XOR')!;
    expect(l.texto).toBe('Exactamente una de estas ramas:\n  *Archivar* consume **Pedido** en `pagado`.\n  *Procesar* consume **Pedido** en `pendiente`.');
    const r = exportarDocumento(fan, new Map([['sd', ls]]), { version: 'v' });
    expect(r.ok).toBe(true);
    if (!r.ok)
        return;
    expect(r.valor.html).toContain('Exactamente una de estas ramas:\n  <em>Archivar</em> consume <strong>Pedido</strong> en <code>pagado</code>.\n  <em>Procesar</em> consume <strong>Pedido</strong> en <code>pendiente</code>.');
});
test('T-284 advertencia incluye enlaces estructurales dibujados en peine', () => {
    const e = manual();
    const s = { clave: 'simbolo:a:agregacion', refinable: 'a', relacion: 'agregacion' as const, vertice: { x: 45, y: 45 }, orientacion: 'abajo' as const, incompleta: false, ramas: ['es'], peine: [[{ x: 40, y: 40 }, { x: 100, y: 100 }]], mult: [] };
    const ws = advertenciasEscena({ ...e, aristas: [], simbolos: [s] });
    expect(ws.some(w => w.tipo === 'atraviesa' && w.refs.some(r => r.tipo === 'enlace' && r.id === 'es') && w.refs.some(r => r.id === 'oculta'))).toBe(true);
});

import { validarForma } from '../nucleo/forma';
import { erroresContexto } from '../nucleo/matriz';
test('T-281 revisión namespace conserva texto literal sombra-fisica y metadata', () => {
    const b = m(1), base: Modelo = { ...b, nombre: 'Modelo sombra-fisica', cosas: { o0: { ...b.cosas.o0!, tipo: 'objeto', esencia: 'fisica', estados: [{ id: 's', nombre: 'sombra-fisica' }] } } }, antes = JSON.stringify(base);
    expect(validarForma(base)).toEqual([]); expect(erroresContexto(base)).toEqual([]); expect(gatesExportacion(base, 'modelo')).toEqual([]);
    const r = exportarDocumento(base, new Map([['sd', [{ tokens: [{ texto: 'sombra-fisica', marca: 'estado' as const }] }]]]), { version: 'sombra-fisica' });
    expect(r.ok).toBe(true); if (!r.ok) throw Error(JSON.stringify(r.rechazo));
    expect(r.valor.html).toContain('>sombra-fisica</text>');
    expect(r.valor.html).toContain('>sombra-fisica</code>');
    expect(r.valor.html).toContain('SD · Modelo sombra-fisica');
    expect(r.valor.html).toContain('"version":"sombra-fisica"');
    expect(r.valor.html).toContain('id="sombra-fisica-0"');
    expect(r.valor.html).toContain('filter="url(#sombra-fisica-0)"');
    expect(JSON.stringify(base)).toBe(antes);
});
test('T-204 T-205 T-280 T-281 revisión TEXT declara CSS efectiva none none espaciado0', () => {
    const base = m(1), d = exportarDiagrama(base, 'sd', { version: 'review' }), doc = exportarDocumento(base, new Map(), { version: 'review' });
    expect(gatesExportacion(base, 'modelo')).toEqual([]); expect(d.ok).toBe(true); expect(doc.ok).toBe(true);
    if (!d.ok || !doc.ok) throw Error('Export rechazado');
    for (const xml of [d.valor.svg, doc.valor.html]) {
        const textos = xml.match(/<text\s[^>]*>/g)!; expect(textos.length).toBeGreaterThan(0);
        for (const tag of textos) {
            expect(tag).toContain('font-kerning:none'); expect(tag).toContain('font-variant-ligatures:none');
            expect(tag).toContain('letter-spacing:0'); expect(tag).toContain('word-spacing:0');
        }
    }
});
