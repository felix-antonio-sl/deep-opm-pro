import { expect, test } from 'bun:test';
import { crearModelo } from '../nucleo/modelo';
import { exportarV0 } from '../codec/exportar';
const cargar = () => import('./Biblioteca');
test('T-286 Biblioteca prepara importación sin alterar el original y asigna identidad nueva', async () => {
    const ui = await cargar(), m = crearModelo({ id: 'm-original', nombre: 'Prueba' }), original = exportarV0(m);
    const r = ui.prepararImportacion('Prueba.json', original);
    expect(r.original).toBe(original); expect(r.resultado.ok).toBe(true);
    if (r.resultado.ok) { expect(r.resultado.modelo.id).not.toBe(m.id); expect(r.resultado.modelo.nombre).toBe(m.nombre); expect(r.resultado.modelo.opds).toEqual(m.opds); }
    expect(exportarV0(m)).toBe(original);
});
test('T-287 Biblioteca muestra rechazos de JSON inválido y conserva sus bytes', async () => {
    const ui = await cargar(), original = '{no es json', r = ui.prepararImportacion('Prueba.json', original);
    expect(r.resultado.ok).toBe(false); expect(r.resultado.informe.rechazos.length).toBeGreaterThan(0); expect(r.original).toBe(original);
});
test('WP-14 DESIGN §7.3 renombrar hace GET y PUT CAS del modelo real sin perder datos', async () => {
    const ui = await cargar(), m = crearModelo({ id: 'm-prueba', nombre: 'Anterior' }), texto = exportarV0(m), llamadas: unknown[] = [];
    const cliente = { async leer(id: string) { llamadas.push(['GET', id]); return { texto, rev: 'base' }; }, async guardar(id: string, t: string, rev: string) { llamadas.push(['PUT', id, t, rev]); return { rev: 'nueva' }; } };
    const r = await ui.renombrarFila(cliente, m.id, 'Nuevo');
    expect(r.ok).toBe(true); expect(llamadas[0]).toEqual(['GET', m.id]); expect(llamadas[1]).toEqual(['PUT', m.id, exportarV0({ ...m, nombre: 'Nuevo' }), 'base']); expect(exportarV0(m)).toBe(texto);
});
test('WP-14 DESIGN §7.3 renombrar conserva conflicto y rechazo ilegible sin PUT', async () => {
    const ui = await cargar(), texto = exportarV0(crearModelo({ id: 'm-prueba', nombre: 'Anterior' }));
    const r = await ui.renombrarFila({ async leer() { return { texto, rev: 'base' }; }, async guardar() { return { conflicto: 'otra' }; } }, 'm-prueba', 'Nuevo');
    expect(r.ok).toBe(false); expect(r.error).toContain('Conflicto'); let puts = 0;
    const malo = await ui.renombrarFila({ async leer() { return { texto: '{mal', rev: 'base' }; }, async guardar() { puts++; return { rev: 'nueva' }; } }, 'm-prueba', 'Nuevo');
    expect(malo.ok).toBe(false); expect(puts).toBe(0); expect(malo.informe?.rechazos.length).toBeGreaterThan(0);
});

test('WP-14 DESIGN §8.4 renombrar original no canónico exige respaldo y conserva control canónico', async () => {
    const ui = await cargar(), m = crearModelo({ id: 'm-original', nombre: 'Anterior' }), canon = exportarV0(m), calls: unknown[] = [];
    const cliente = { async leer() { return { texto: '  ' + canon + '\n', rev: 'base' }; }, async guardar(id: string, texto: string, rev: string, opciones?: { respaldo?: true }) { calls.push([id, texto, rev, opciones]); return { rev: 'nueva' }; } };
    const r = await ui.renombrarFila(cliente, m.id, 'Nuevo'); expect(r.ok).toBe(true); expect(calls[0]).toEqual([m.id, exportarV0({ ...m, nombre: 'Nuevo' }), 'base', { respaldo: true }]);
});


test('T-287 archivo conserva BOM y rechaza UTF8 ilegible sin sustituir bytes del original', async () => {
    const ui = await cargar(), canon = exportarV0(crearModelo({ id: 'm-original', nombre: 'Prueba' }));
    const conBom = new Uint8Array([239,187,191,...new TextEncoder().encode(canon)]);
    const preparar = (ui as unknown as { prepararArchivo: (n: string, b: Uint8Array) => { original: string; archivo: Blob; resultado: { ok: boolean; informe: { rechazos: unknown[] } } } }).prepararArchivo;
    expect(preparar).toBeFunction();
    const bom = preparar('Prueba.json', conBom);
    expect(bom.original.charCodeAt(0)).toBe(0xfeff); expect(new Uint8Array(await bom.archivo.arrayBuffer())).toEqual(conBom);
    const bytes = new TextEncoder().encode(canon), pos = canon.indexOf('Prueba'); bytes[pos] = 255;
    const original = bytes.slice(), malo = preparar('Prueba.json', bytes);
    expect(malo.resultado.ok).toBe(false); expect(malo.resultado.informe.rechazos.length).toBeGreaterThan(0);
    expect(new Uint8Array(await malo.archivo.arrayBuffer())).toEqual(original); expect(bytes).toEqual(original);
    const bueno = preparar('Prueba.json', new TextEncoder().encode(canon)); expect(bueno.resultado.ok).toBe(true);
});


test('T-287 U+FFFD codificado correctamente es nombre válido y no se confunde con UTF8 corrupto', async () => {
    const ui = await cargar(), m = crearModelo({ id: 'm-replacement', nombre: 'Prueba � válida' }), original = exportarV0(m), bytes = new TextEncoder().encode(original);
    const r = ui.prepararArchivo('valido.json', bytes); expect(r.resultado.ok).toBe(true);
    if (r.resultado.ok) expect(r.resultado.modelo.nombre).toBe(m.nombre);
    expect(r.original).toBe(original); expect(new Uint8Array(await r.archivo.arrayBuffer())).toEqual(bytes);
});


test('T-286 importación OPL genuina usa la inversa existente con identidad nueva y original intacto', async () => {
    const ui = await cargar(), { generarDocumentoOpl } = await import('../opl/documento'), { crearCosa } = await import('../nucleo/cosas');
    const base = crearModelo({ id: 'm-opl', nombre: 'Documento' }), r = crearCosa(base, { tipo: 'objeto', nombre: 'Pedido', opd: base.raiz, x: 20, y: 30 });
    expect(r.ok).toBe(true); if (!r.ok) return;
    const original = generarDocumentoOpl(r.valor.modelo), entrada = ui.prepararImportacion('Documento.md', original);
    expect(entrada.original).toBe(original); expect(entrada.resultado.ok).toBe(true);
    if (entrada.resultado.ok) { expect(entrada.resultado.modelo.id).not.toBe(base.id); expect(generarDocumentoOpl(entrada.resultado.modelo)).toBe(original); }
    expect(generarDocumentoOpl(r.valor.modelo)).toBe(original);
});
