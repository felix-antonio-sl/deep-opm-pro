import type { Page } from '@playwright/test';
import { test, expect, TOKEN, abrir, leer, guardado, tecla, captura, opl, aplicarTexto } from './soporte';
import { modeloCon, must, porNombre } from '../src/pruebas/constructores';
import { crearEnlace } from '../src/nucleo/enlaces';
import { exportarV0 } from '../src/codec/exportar';
import { importarV0 } from '../src/codec/importar';
import { generarDocumentoOpl } from '../src/opl/documento';

function decodificar(texto: string) {
    const r = importarV0(texto); if (!r.ok) throw Error('Códec rechazado'); return r.modelo;
}
async function realce(page: Page, id: string) {
    await expect.poll(() => page.getByLabel(/^Diagrama /).evaluate((root, id) => Array.from(root.getElementsByTagName('*')).some(n => {
        if (n.getAttribute('data-ref') !== `enlace:${id}`) return false;
        let a: Element | null = n; while (a) { if (a.getAttribute('data-capa-ui') === '1') return true; a = a.parentElement; } return false;
    }), id)).toBe(true);
}

test('T-119 T-121 T-173 T-194 T-243 B-41 lista etiquetada permite editar Beta por ID y cantidad por OPL con un undo', async ({ page, request }) => {
    const id = 'e2e-b41-etiquetada';
    let m = { ...modeloCon({ objetos: [['Origen', []], ['Alfa', []], ['Beta', ['pendiente', 'activo']]] }), id, nombre: 'E2E B41 Etiquetada' }; const ids: string[] = [];
    for (const nombre of ['Alfa', 'Beta']) {
        const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'etiquetado', origen: porNombre(m, 'Origen').id, destino: porNombre(m, nombre).id, etiqueta: 'conoce' } }));
        m = { ...r.modelo }; ids.push(r.creados[0]!);
    }
    const r = await request.post('/api/modelos', { headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, data: exportarV0(m) }); expect(r.status(), await r.text()).toBe(201); await abrir(page, id);
    const antes = await leer(request, id), previo = decodificar(antes.texto);
    const linea = opl(page).locator('[data-linea]').filter({ hasText: /^Origen conoce Alfa y Beta\.$/ }); await expect(linea).toHaveCount(1);
    const beta = linea.getByRole('button', { name: 'Beta', exact: true }); await beta.hover(); await realce(page, ids[1]!); await beta.click();
    await expect(opl(page).getByText(ids[1]!, { exact: true })).toBeVisible(); expect((await leer(request, id)).rev).toBe(antes.rev);
    const objeto = porNombre(previo, 'Beta'); if (objeto.tipo !== 'objeto') throw Error('Objeto');
    await page.getByRole('combobox', { name: 'Estado destino', exact: true }).selectOption(objeto.estados[0]!.id); await guardado(page);
    await expect.poll(async () => { const e = decodificar((await leer(request, id)).texto).enlaces[ids[1]!]!; return 'estadoDestino' in e ? e.estadoDestino : undefined; }).toBe(objeto.estados[0]!.id);
    expect(decodificar((await leer(request, id)).texto)).toEqual({ ...previo, enlaces: { ...previo.enlaces, [ids[1]!]: { ...previo.enlaces[ids[1]!]!, estadoDestino: objeto.estados[0]!.id } } });
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^Origen conoce Alfa y Beta en pendiente\.$/ })).toHaveCount(1);
    await captura(page, 'b41-etiquetada-estado'); await tecla(page, 'Control+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(antes.texto);
    const doc = generarDocumentoOpl(previo); await aplicarTexto(page, doc.replace('**Alfa** y **Beta**.', '**Alfa** y 4 **Beta**.')); await guardado(page);
    expect(decodificar((await leer(request, id)).texto)).toEqual({ ...previo, enlaces: { ...previo.enlaces, [ids[1]!]: { ...previo.enlaces[ids[1]!]!, multDestino: '4' } } });
    await captura(page, 'b41-etiquetada-cantidad'); await tecla(page, 'Control+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(antes.texto);
});

test('T-194 T-243 DEC52 proceso enumerado selecciona su propio agente y no extiende estado o multiplicidad compartidos', async ({ page, request }) => {
    const id = 'e2e-b41-agente-comun';
    let m = { ...modeloCon({ objetos: [['Agente', []]], procesos: ['Preparar', 'Revisar'] }), id, nombre: 'E2E B41 Agente Común' }; const ids: string[] = [];
    for (const nombre of ['Preparar', 'Revisar']) {
        const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'agente', objeto: porNombre(m, 'Agente').id, proceso: porNombre(m, nombre).id } })); m = { ...r.modelo }; ids.push(r.creados[0]!);
    }
    const r = await request.post('/api/modelos', { headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, data: exportarV0(m) }); expect(r.status(), await r.text()).toBe(201); await abrir(page, id);
    const antes = await leer(request, id), previo = decodificar(antes.texto);
    const linea = opl(page).locator('[data-linea]').filter({ hasText: /^Agente maneja Preparar y Revisar\.$/ }); await expect(linea).toHaveCount(1);
    const revisar = linea.getByRole('button', { name: 'Revisar', exact: true }); await revisar.hover(); await realce(page, ids[1]!); await revisar.click();
    await expect(opl(page).getByText(ids[1]!, { exact: true })).toBeVisible(); expect((await leer(request, id)).rev).toBe(antes.rev);
    await captura(page, 'b41-agente-seleccion');
    const cantidad = page.getByRole('textbox', { name: 'Cantidad exacta objeto', exact: true }); await cantidad.fill('3'); await cantidad.press('Tab'); await guardado(page);
    await expect.poll(async () => { const e = decodificar((await leer(request, id)).texto).enlaces[ids[1]!]!; return 'mult' in e ? e.mult : undefined; }).toBe('3');
    expect(decodificar((await leer(request, id)).texto)).toEqual({ ...previo, enlaces: { ...previo.enlaces, [ids[1]!]: { ...previo.enlaces[ids[1]!]!, mult: '3' } } });
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^Agente maneja Preparar\.$/ })).toHaveCount(1);
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^3 Agente maneja Revisar\.$/ })).toHaveCount(1);
    await captura(page, 'b41-agente-cantidad'); await tecla(page, 'Control+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(antes.texto);
    await expect(linea).toHaveCount(1);
});
