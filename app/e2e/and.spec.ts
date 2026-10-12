import type { Page } from '@playwright/test';
import { test, expect, TOKEN, abrir, leer, guardado, tecla, captura, opl, editarOpl, aplicarTexto } from './soporte';
import { modeloCon, must, porNombre } from '../src/pruebas/constructores';
import { crearEnlace } from '../src/nucleo/enlaces';
import { exportarV0 } from '../src/codec/exportar';
import { importarV0 } from '../src/codec/importar';
import { generarDocumentoOpl } from '../src/opl/documento';

const svg = (p: Page) => p.getByLabel(/^Diagrama /);

function fixture(id: string) {
    let m = { ...modeloCon({ objetos: [['Alfa', ['nuevo', 'listo']], ['Beta', ['pendiente', 'activo']]], procesos: ['Procesar'] }), id, nombre: `E2E ${id}` };
    const ids: string[] = [];
    for (const nombre of ['Alfa', 'Beta']) {
        const o = porNombre(m, nombre); if (o.tipo !== 'objeto') throw Error('Objeto esperado');
        const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'consumo', objeto: o.id, estado: o.estados[1]!.id, proceso: porNombre(m, 'Procesar').id } }));
        m = { ...r.modelo }; ids.push(r.creados[0]!);
    }
    return { m, ids };
}
function decodificar(texto: string) {
    const r = importarV0(texto); if (!r.ok) throw Error('Documento persistido rechazado por el códec');
    return r.modelo;
}

test('T-194 T-243 B-41 token del segundo miembro selecciona su enlace, edita sólo ese miembro y deshace', async ({ page, request }) => {
    const id = 'e2e-b41-miembro', { m, ids } = fixture(id);
    const r = await request.post('/api/modelos', { headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, data: exportarV0(m) });
    expect(r.status(), await r.text()).toBe(201); await abrir(page, id);
    const antes = await leer(request, id), previo = decodificar(antes.texto);
    const linea = opl(page).locator('[data-linea]').filter({ hasText: /^Procesar consume Alfa en listo y Beta en activo\.$/ });
    await expect(linea).toHaveCount(1); const beta = linea.getByRole('button', { name: 'Beta', exact: true });
    await beta.hover();
    await expect.poll(() => svg(page).evaluate((root, id) => Array.from(root.getElementsByTagName('*')).some(n => n.getAttribute('data-ref') === `enlace:${id}` && (() => {
        let a: Element | null = n; while (a) { if (a.getAttribute('data-capa-ui') === '1') return true; a = a.parentElement; } return false;
    })()), ids[1]!)).toBe(true);
    await beta.click(); await expect(opl(page).getByRole('heading', { name: /^consumo: Beta/ })).toBeVisible();
    await expect(opl(page).getByText(ids[1]!, { exact: true })).toBeVisible(); expect((await leer(request, id)).rev).toBe(antes.rev);
    const cantidad = page.getByRole('textbox', { name: 'Cantidad exacta objeto', exact: true }); await cantidad.fill('3'); await cantidad.press('Tab');
    await guardado(page); await expect.poll(async () => { const e = decodificar((await leer(request, id)).texto).enlaces[ids[1]!]!; return 'mult' in e ? e.mult : undefined; }).toBe('3');
    const despues = decodificar((await leer(request, id)).texto), esperado = previo.enlaces[ids[1]!]!; if (esperado.tipo !== 'consumo') throw Error('Consumo esperado');
    expect(despues).toEqual({ ...previo, enlaces: { ...previo.enlaces, [ids[1]!]: { ...esperado, mult: '3' } } });
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^Procesar consume Alfa en listo y 3 Beta en activo\.$/ })).toHaveCount(1);
    await captura(page, 'b41-miembro-multiplicidad'); await tecla(page, 'Control+z'); await guardado(page);
    expect((await leer(request, id)).texto).toBe(antes.texto);
    await beta.click(); const objeto = porNombre(previo, 'Beta'); if (objeto.tipo !== 'objeto') throw Error('Objeto esperado');
    await page.getByRole('combobox', { name: 'Estado', exact: true }).selectOption(objeto.estados[0]!.id); await guardado(page);
    await expect.poll(async () => { const e = decodificar((await leer(request, id)).texto).enlaces[ids[1]!]!; return 'estado' in e ? e.estado : undefined; }).toBe(objeto.estados[0]!.id);
    expect(decodificar((await leer(request, id)).texto)).toEqual({ ...previo, enlaces: { ...previo.enlaces, [ids[1]!]: { ...esperado, estado: objeto.estados[0]!.id } } });
    await captura(page, 'b41-miembro-estado'); await tecla(page, 'Control+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(antes.texto);
});

test('T-170 T-174 T-182 T-194 B-41 editar multiplicidad en OPL conserva identidad y rechaza otro estado o tipo', async ({ page, request }) => {
    const id = 'e2e-b41-opl', { m, ids } = fixture(id);
    const r = await request.post('/api/modelos', { headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, data: exportarV0(m) });
    expect(r.status(), await r.text()).toBe(201); await abrir(page, id);
    const antes = await leer(request, id), previo = decodificar(antes.texto), doc = generarDocumentoOpl(previo);
    await aplicarTexto(page, doc.replace('y **Beta** en `activo`.', 'y 4 **Beta** en `activo`.')); await guardado(page);
    const despues = decodificar((await leer(request, id)).texto), e = previo.enlaces[ids[1]!]!;
    if (e.tipo !== 'consumo') throw Error('Consumo esperado');
    expect(despues).toEqual({ ...previo, enlaces: { ...previo.enlaces, [ids[1]!]: { ...e, mult: '4' } } });
    await captura(page, 'b41-opl-multiplicidad'); await tecla(page, 'Control+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(antes.texto);
    const revision = (await leer(request, id)).rev, area = await editarOpl(page);
    await area.fill(doc.replace('y **Beta** en `activo`.', 'y **Beta** en `pendiente`.'));
    await expect(page.getByRole('status').filter({ hasText: /1 no aplicables/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sin cambios aplicables', exact: true })).toBeDisabled();
    expect((await leer(request, id)).rev).toBe(revision); expect((await leer(request, id)).texto).toBe(antes.texto);
    await area.fill(doc.replace('y **Beta** en `activo`.', 'y *Beta* en `activo`.'));
    await expect(page.getByRole('status').filter({ hasText: /1 no aplicables/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sin cambios aplicables', exact: true })).toBeDisabled();
    await area.press('Escape'); expect((await leer(request, id)).rev).toBe(revision); expect((await leer(request, id)).texto).toBe(antes.texto);
});
