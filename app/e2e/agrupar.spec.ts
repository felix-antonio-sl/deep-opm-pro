import { test, expect, TOKEN, abrir, leer, modelo, guardado, tecla, opl, captura, cosa, seleccionar } from './soporte';
import { modeloCon, porNombre } from '../src/pruebas/constructores';
import { exportarV0 } from '../src/codec/exportar';
import type { Modelo } from '../src/nucleo/tipos';

// T-325 (método A4.5): out-zoom desde el lienzo. Lo agrupado pasa a un OPD hijo; el SD lo muestra abstraído.
test('T-325 agrupar procesos desde el lienzo crea el proceso intermedio y su descomposición, y se deshace en un paso', async ({ page, request }) => {
    const id = 'e2e-agrupar';
    const b = { ...modeloCon({ objetos: [['Pedido', []], ['Factura', []]], procesos: ['Recibir Pedido', 'Emitir Factura'],
        enlaces: [['consumo', 'Pedido', 'Recibir Pedido'], ['resultado', 'Factura', 'Emitir Factura']] }), id, nombre: 'E2E agrupar' };
    const emitir = porNombre(b, 'Emitir Factura').id, sd = b.opds[b.raiz]!;
    const m: Modelo = { ...b, opds: { ...b.opds, [b.raiz]: { ...sd, apariciones: { ...sd.apariciones, [emitir]: { ...sd.apariciones[emitir]!, y: sd.apariciones[emitir]!.y + 220 } } } } };
    const creado = await request.post('/api/modelos', { headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, data: exportarV0(m) });
    expect(creado.status(), await creado.text()).toBe(201); await abrir(page, id); const antes = await leer(request, id);
    // Con sólo objetos elegidos no hay proceso que agrupar, y Propiedades lo dice.
    await seleccionar(page, 'Pedido'); await cosa(page, 'Factura').click({ modifiers: ['Shift'] });
    await expect(page.getByRole('button', { name: 'Agrupar en un proceso (out-zoom)', exact: true })).toBeDisabled();
    await expect(page.getByText('Agrupar requiere al menos un proceso.').first()).toBeVisible();
    await seleccionar(page, 'Recibir Pedido'); await cosa(page, 'Emitir Factura').click({ modifiers: ['Shift'] });
    await expect(page.getByRole('button', { name: 'Agrupar en un proceso (out-zoom)', exact: true })).toBeEnabled();
    await tecla(page, 'g');
    const campo = page.getByRole('textbox', { name: 'Nombre del proceso que agrupa', exact: true }); await campo.fill('Atender Pedido'); await campo.press('Enter');
    await guardado(page);
    const v = modelo(await leer(request, id)), hijo = Object.values(v.modelo.opds).find(x => x.padreId === 'opd-1')!;
    expect((hijo.ordenInzoom as string[][]).map(b => b.map(x => v.modelo.entidades[x]!.nombre))).toEqual([['Recibir Pedido'], ['Emitir Factura']]);
    await expect(opl(page)).toContainText('Atender Pedido consume Pedido.'); await expect(opl(page)).toContainText('Atender Pedido genera Factura.');
    await expect(opl(page)).toContainText('Atender Pedido se descompone en Recibir Pedido y Emitir Factura, en esa secuencia.');
    await expect(cosa(page, 'Recibir Pedido')).toHaveCount(0); await expect(page.getByRole('heading', { name: 'Atender Pedido', exact: true })).toBeVisible();
    await captura(page, 'agrupar');
    await tecla(page, 'Control+z'); await guardado(page);
    expect((await leer(request, id)).texto).toBe(antes.texto); await expect(cosa(page, 'Recibir Pedido')).toBeVisible();
});
