import { test, expect, TOKEN, abrir, leer, guardado, tecla, opl, captura, editarOpl, aplicarTexto, seleccionar, puntoRef, descargar } from './soporte';
import type { Page } from '@playwright/test';
import { modeloCon, porNombre } from '../src/pruebas/constructores';
import { exportarV0 } from '../src/codec/exportar';
import { generarDocumentoOpl, importarOpl } from '../src/opl/documento';
import { importarV0 } from '../src/codec/importar';

const diagrama = (page: Page) => page.getByLabel(/^Diagrama /);
async function puntoEstado(page: Page, estado: string) {
    return diagrama(page).evaluate((root, estado) => {
        const g = Array.from(root.getElementsByTagName('*')).find(n => n.getAttribute('data-ref') === `estado:${estado}`), rect = g?.getElementsByTagName('rect')[0];
        if (!rect) throw new Error('Cápsula real ausente');
        const b = rect.getBBox(), m = rect.getScreenCTM()!;
        const p = [.5, .3, .7].flatMap(y => [.5, .3, .7].map(x => new DOMPoint(b.x + b.width * x, b.y + b.height * y).matrixTransform(m)))
            .find(p => document.elementFromPoint(p.x, p.y)?.closest('[data-ref]')?.getAttribute('data-ref') === `estado:${estado}`);
        if (!p) throw new Error(`La cápsula ${estado} no tiene tinta alcanzable`);
        return { x: p.x, y: p.y };
    }, estado);
}

test('T-121 T-173 T-243 B-37 RF5 se aplica desde OPL, conserva el modelo y distingue la etiqueta explícita', async ({ page, request }) => {
    const id = 'e2e-rf5-no-soportada';
    const m = { ...modeloCon({
        objetos: [['Vehículo', []], ['Auto', []], ['Medio de Desplazamiento', ['tierra', 'agua']]],
        enlaces: [['generalizacion', 'Vehículo', 'Auto'], ['exhibicion', 'Vehículo', 'Medio de Desplazamiento']],
    }), id, nombre: 'E2E RF5 no soportada' };
    const creado = await request.post('/api/modelos', { headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, data: exportarV0(m) });
    expect(creado.status(), await creado.text()).toBe(201); await abrir(page, id);
    const antes = await leer(request, id), rf5 = '**Auto** exhibe **Medio de Desplazamiento** en `tierra`.';
    const atributo = porNombre(m, 'Medio de Desplazamiento'); if (atributo.tipo !== 'objeto') throw Error('Montaje');
    const area = await editarOpl(page), dialogo = page.getByRole('dialog', { name: 'Editar OPL', exact: true });
    await area.fill(rf5);
    await expect(dialogo.getByText(/RF5|B-37/)).toHaveCount(0);
    await expect(dialogo.getByRole('button', { name: 'Aplicar 1 cambio', exact: true })).toBeEnabled();
    expect(await leer(request, id)).toEqual(antes);
    await dialogo.getByRole('button', { name: 'Aplicar 1 cambio', exact: true }).click();
    await dialogo.getByRole('button', { name: 'Cerrar diálogo' }).click(); await guardado(page);
    const caracterizado = importarV0((await leer(request, id)).texto); expect(caracterizado.ok).toBe(true);
    if (!caracterizado.ok) throw Error('Códec');
    // Testigo de la conversión falsa: nunca un etiquetado «exhibe».
    expect(Object.values(caracterizado.modelo.enlaces).filter(e => e.tipo === 'etiquetado')).toEqual([]);
    expect(Object.values(caracterizado.modelo.enlaces)).toEqual([
        ...Object.values(m.enlaces), expect.objectContaining({ tipo: 'exhibicion', refinable: porNombre(m, 'Auto').id, refinador: atributo.id, estado: atributo.estados[0]!.id }),
    ]);
    for (const c of Object.values(m.cosas)) expect(caracterizado.modelo.cosas[c.id]).toEqual(c);
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^Auto exhibe Medio de Desplazamiento en tierra\.$/ })).toHaveCount(1);
    await expect(diagrama(page).locator(`[data-ref="simbolo:${porNombre(m, 'Auto').id}:exhibicion:${atributo.estados[0]!.id}"]`)).toHaveCount(1);
    await captura(page, 'b37-rf5-opl-aplicada');
    await tecla(page, 'Control+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(antes.texto);

    await aplicarTexto(page, rf5 + '\n**Auto** exhibe **Color**.'); await guardado(page);
    const mixto = importarV0((await leer(request, id)).texto); expect(mixto.ok).toBe(true);
    if (!mixto.ok) throw Error('Códec');
    expect(Object.values(mixto.modelo.enlaces).filter(e => e.tipo === 'etiquetado')).toEqual([]);
    const color = porNombre(mixto.modelo, 'Color');
    expect(Object.values(mixto.modelo.enlaces)).toEqual([
        ...Object.values(m.enlaces), expect.objectContaining({ tipo: 'exhibicion', refinable: porNombre(m, 'Auto').id, refinador: color.id }),
        expect.objectContaining({ tipo: 'exhibicion', refinable: porNombre(m, 'Auto').id, refinador: atributo.id, estado: atributo.estados[0]!.id }),
    ]);
    for (const c of Object.values(m.cosas)) expect(mixto.modelo.cosas[c.id]).toEqual(c);
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^Auto exhibe Color\.$/ })).toHaveCount(1);
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^Auto exhibe Medio de Desplazamiento en tierra\.$/ })).toHaveCount(1);
    await tecla(page, 'Control+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(antes.texto);

    await aplicarTexto(page, rf5.replace(' exhibe ', ' «exhibe» ')); await guardado(page);
    const etiquetado = importarV0((await leer(request, id)).texto); expect(etiquetado.ok).toBe(true);
    if (!etiquetado.ok) throw Error('Códec');
    expect(Object.values(etiquetado.modelo.enlaces)).toEqual([
        ...Object.values(m.enlaces), expect.objectContaining({ tipo: 'etiquetado', origen: porNombre(m, 'Auto').id,
            destino: atributo.id, estadoDestino: atributo.estados[0]!.id, etiqueta: 'exhibe' }),
    ]);
    const linea = opl(page).locator('[data-linea]').filter({ hasText: /^Auto «exhibe» Medio de Desplazamiento en tierra\.$/ });
    await expect(linea).toHaveCount(1); await linea.scrollIntoViewIfNeeded(); await expect(linea).toBeVisible();
    await captura(page, 'b37-etiqueta-explicita-opl');
    await tecla(page, 'Control+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(antes.texto);
    await page.reload(); await guardado(page); expect((await leer(request, id)).texto).toBe(antes.texto);
});

test('T-121 T-212 T-243 B-37 RF5 se crea con el gesto, edita su valor en Propiedades y se exporta', async ({ page, request }) => {
    const id = 'e2e-rf5-gesto';
    const m = { ...modeloCon({
        objetos: [['Vehículo', []], ['Auto', []], ['Medio de Desplazamiento', ['tierra', 'agua']]],
        enlaces: [['generalizacion', 'Vehículo', 'Auto'], ['exhibicion', 'Vehículo', 'Medio de Desplazamiento']],
    }), id, nombre: 'E2E RF5 gesto' };
    const creado = await request.post('/api/modelos', { headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, data: exportarV0(m) });
    expect(creado.status(), await creado.text()).toBe(201); await abrir(page, id);
    const antes = await leer(request, id), auto = porNombre(m, 'Auto').id, atributo = porNombre(m, 'Medio de Desplazamiento');
    if (atributo.tipo !== 'objeto') throw Error('Montaje');
    const [tierra, agua] = atributo.estados.map(s => s.id) as [string, string];
    await seleccionar(page, 'Auto'); await tecla(page, 'r');
    const p = await puntoEstado(page, tierra); await page.mouse.click(p.x, p.y);
    const menu = page.getByRole('dialog', { name: /^Enlace:/ });
    await expect(menu.getByRole('menuitem', { name: /exhibicion · directo/ })).toContainText('Auto exhibe Medio de Desplazamiento en tierra.');
    await expect(menu.getByRole('menuitem', { name: /etiquetado · directo/ })).toContainText('Auto «se relaciona con» Medio de Desplazamiento en tierra.');
    await captura(page, 'b37-rf5-menu');
    await menu.getByRole('menuitem', { name: /exhibicion · directo/ }).click(); await expect(menu).toBeHidden(); await guardado(page);
    const v0 = JSON.parse((await leer(request, id)).texto), nuevo = Object.values(v0.modelo.enlaces as Record<string, { id: string; tipo: string; destinoId: unknown }>).find(e => !Object.hasOwn(m.enlaces, e.id))!;
    expect(nuevo).toMatchObject({ tipo: 'exhibicion', origenId: { kind: 'entidad', id: auto }, destinoId: { kind: 'estado', id: tierra } });
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^Auto exhibe Medio de Desplazamiento en tierra\.$/ })).toHaveCount(1);
    const simbolo = `simbolo:${auto}:exhibicion:${tierra}`;
    await expect(diagrama(page).locator(`[data-ref="${simbolo}"]`)).toHaveCount(1);
    await captura(page, 'b37-rf5-gesto-opd');
    // Propiedades: el símbolo RF5 no ofrece colección incompleta y su rama abre el enlace.
    const pt = await puntoRef(page, simbolo); await page.mouse.click(pt.x, pt.y);
    await expect(page.getByRole('heading', { name: 'exhibicion de Auto', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /Marcar (in)?completa/ })).toHaveCount(0);
    await page.getByRole('button', { name: 'exhibicion: Auto → Medio de Desplazamiento', exact: true }).click();
    const valor = page.getByRole('combobox', { name: 'Valor especificado (RF5)', exact: true });
    await expect(valor).toHaveValue(tierra);
    await valor.selectOption(agua); await guardado(page);
    expect(JSON.parse((await leer(request, id)).texto).modelo.enlaces[nuevo.id].destinoId).toEqual({ kind: 'estado', id: agua });
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^Auto exhibe Medio de Desplazamiento en agua\.$/ })).toHaveCount(1);
    await expect(diagrama(page).locator(`[data-ref="simbolo:${auto}:exhibicion:${agua}"]`)).toHaveCount(1);
    await captura(page, 'b37-rf5-valor-agua');
    const conAgua = await leer(request, id);
    await tecla(page, 'Control+z'); await guardado(page);
    expect(JSON.parse((await leer(request, id)).texto).modelo.enlaces[nuevo.id].destinoId).toEqual({ kind: 'estado', id: tierra });
    await tecla(page, 'Control+Shift+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(conAgua.texto);
    await page.reload(); await guardado(page); expect((await leer(request, id)).texto).toBe(conAgua.texto);
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^Auto exhibe Medio de Desplazamiento en agua\.$/ })).toHaveCount(1);
    await page.getByRole('button', { name: 'Exportar ▾', exact: true }).click();
    const exportacion = page.getByRole('dialog', { name: 'Exportar', exact: true });
    const svg = await descargar(page, exportacion.getByRole('button', { name: 'OPD SVG · canon-diagrama' }));
    expect(svg).toContain('>agua</text>'); expect(svg).not.toMatch(/data-ref|data-capa-ui|seleccion-ui/);
    const html = await descargar(page, exportacion.getByRole('button', { name: 'Documento HTML · canon-documento' }));
    expect(html).toContain('canon-documento'); expect(html).toMatch(/Auto<\/strong> exhibe <strong>Medio de Desplazamiento<\/strong> en <code>agua<\/code>/);
    const texto = await descargar(page, exportacion.getByRole('button', { name: 'Documento OPL', exact: true }));
    expect(texto.split('\n')).toContain('**Auto** exhibe **Medio de Desplazamiento** en `agua`.');
    const r = importarOpl(m.nombre, texto); expect(r.ok).toBe(true);
    if (r.ok) { expect(r.valor.plan.lineas.flatMap(l => l.diagnosticos)).toEqual([]); expect(generarDocumentoOpl(r.valor.modelo)).toBe(texto); }
    await exportacion.getByRole('button', { name: 'Cerrar diálogo' }).click();
    expect((await leer(request, id)).texto).toBe(conAgua.texto); expect(conAgua.texto).not.toBe(antes.texto);
});
