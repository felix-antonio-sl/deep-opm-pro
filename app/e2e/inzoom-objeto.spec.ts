import type { APIRequestContext } from '@playwright/test';
import { test, expect, sembrar, abrir, leer, modelo, seleccionar, tecla, opl, guardado, navegar, captura } from './soporte';

// B-02: in-zoom de objeto (R-OPL-CX-4, CX13). Las partes llevan orden espacial o lógico: sin paralelo.
const partes = async (request: APIRequestContext, id: string) => {
    const v = modelo(await leer(request, id)), hijo = Object.values(v.modelo.opds).find(x => x.padreId === 'sd')!;
    return (hijo.ordenInzoom as string[][]).map(b => b.map(x => v.modelo.entidades[x]!.nombre));
};
test('T-072 B-02 descomponer un objeto desde el lienzo: partes en orden, CX13, reorden y deshacer', async ({ page, request }) => {
    const id = 'e2e-inzoom-objeto'; await sembrar(request, 'descomponer', id); await abrir(page, id); const antes = await leer(request, id);
    await seleccionar(page, 'Pedido');
    await expect(page.getByRole('button', { name: 'Descomponer (in-zoom)', exact: true })).toBeEnabled();
    await tecla(page, 'd');
    // Mayúsculas+Enter no agrupa partes en paralelo: cada nombre ocupa su posición.
    for (const [n, t] of [['Cabecera', 'Enter'], ['Detalle', 'Shift+Enter'], ['Pie', 'Enter']] as const) {
        const campo = page.getByRole('textbox', { name: 'Nombre siguiente', exact: true }); await campo.fill(n); await campo.press(t);
    }
    await page.getByRole('textbox', { name: 'Nombre siguiente', exact: true }).press('Escape'); await guardado(page);
    expect(await partes(request, id)).toEqual([['Cabecera'], ['Detalle'], ['Pie']]);
    await expect(opl(page)).toContainText('Pedido se descompone en Cabecera, Detalle y Pie, en esa secuencia.');
    // El consumo sigue en el contorno del objeto: el in-zoom de objeto no distribuye enlaces.
    expect(modelo(await leer(request, id)).modelo.enlaces.e1!.origenId).toMatchObject({ kind: 'entidad', id: 'o' });
    // Un externo no se refina desde el hijo, y el inspector dice por qué.
    await seleccionar(page, 'Procesar');
    await expect(page.getByRole('button', { name: 'Descomponer (in-zoom)', exact: true })).toBeDisabled();
    await expect(page.getByText('Un externo no se refina desde el OPD hijo.').first()).toBeVisible();
    await seleccionar(page, 'Pie'); await tecla(page, '['); await guardado(page);
    expect(await partes(request, id)).toEqual([['Cabecera'], ['Pie'], ['Detalle']]);
    await expect(opl(page)).toContainText('Pedido se descompone en Cabecera, Pie y Detalle, en esa secuencia.');
    await captura(page, 'inzoom-objeto');
    await navegar(page, /SD E2E/); await expect(opl(page)).toContainText('SD1 · descomposición de Pedido');
    await tecla(page, 'Control+z'); await guardado(page); await tecla(page, 'Control+z'); await guardado(page);
    expect((await leer(request, id)).texto).toBe(antes.texto);
});
