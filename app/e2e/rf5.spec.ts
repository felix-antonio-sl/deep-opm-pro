import { test, expect, TOKEN, abrir, leer, guardado, tecla, opl, captura, editarOpl, aplicarTexto } from './soporte';
import { modeloCon, porNombre } from '../src/pruebas/constructores';
import { exportarV0 } from '../src/codec/exportar';
import { importarV0 } from '../src/codec/importar';

test('T-156 T-173 T-243 B-37 RF5 muestra su límite, conserva el modelo y distingue la etiqueta explícita', async ({ page, request }) => {
    const id = 'e2e-rf5-no-soportada';
    const m = { ...modeloCon({
        objetos: [['Vehículo', []], ['Auto', []], ['Medio de Desplazamiento', ['tierra', 'agua']]],
        enlaces: [['generalizacion', 'Vehículo', 'Auto'], ['exhibicion', 'Vehículo', 'Medio de Desplazamiento']],
    }), id, nombre: 'E2E RF5 no soportada' };
    const creado = await request.post('/api/modelos', { headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, data: exportarV0(m) });
    expect(creado.status(), await creado.text()).toBe(201); await abrir(page, id);
    const antes = await leer(request, id), rf5 = '**Auto** exhibe **Medio de Desplazamiento** en `tierra`.';
    const area = await editarOpl(page), dialogo = page.getByRole('dialog', { name: 'Editar OPL', exact: true });
    await area.fill(rf5);
    await expect(dialogo.getByText(/Línea 1:.*RF5:.*B-37/)).toBeVisible();
    await expect(dialogo.getByRole('button', { name: 'Sin cambios aplicables', exact: true })).toBeDisabled();
    expect(await leer(request, id)).toEqual(antes);
    await captura(page, 'b37-rf5-diagnostico');

    await area.fill(rf5 + '\n**Auto** exhibe **Color**.');
    await expect(dialogo.getByText(/Línea 1:.*RF5:.*B-37/)).toBeVisible();
    await expect(dialogo.getByRole('button', { name: /^Aplicar \d+ cambios?$/ })).toBeEnabled();
    await dialogo.getByRole('button', { name: /^Aplicar \d+ cambios?$/ }).click();
    await dialogo.getByRole('button', { name: 'Cerrar diálogo' }).click(); await guardado(page);
    const parcial = importarV0((await leer(request, id)).texto); expect(parcial.ok).toBe(true);
    if (!parcial.ok) throw Error('Códec');
    expect(Object.values(parcial.modelo.enlaces).filter(e => e.tipo === 'etiquetado')).toEqual([]);
    const color = porNombre(parcial.modelo, 'Color');
    expect(Object.values(parcial.modelo.enlaces)).toEqual([
        ...Object.values(m.enlaces), expect.objectContaining({ tipo: 'exhibicion', refinable: porNombre(m, 'Auto').id, refinador: color.id }),
    ]);
    for (const c of Object.values(m.cosas)) expect(parcial.modelo.cosas[c.id]).toEqual(c);
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^Auto exhibe Color\.$/ })).toHaveCount(1);
    await tecla(page, 'Control+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(antes.texto);

    await aplicarTexto(page, rf5.replace(' exhibe ', ' «exhibe» ')); await guardado(page);
    const etiquetado = importarV0((await leer(request, id)).texto); expect(etiquetado.ok).toBe(true);
    if (!etiquetado.ok) throw Error('Códec');
    const atributo = porNombre(m, 'Medio de Desplazamiento'); if (atributo.tipo !== 'objeto') throw Error('Montaje');
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
