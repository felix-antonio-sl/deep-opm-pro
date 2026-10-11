import { test, expect, TOKEN, abrir, leer, guardado, navegar, seleccionarEnlace, tecla, captura, opl } from './soporte';
import { modeloCon, must, porNombre } from '../src/pruebas/constructores';
import { crearEnlace, reanclarExtremo } from '../src/nucleo/enlaces';
import { descomponer } from '../src/nucleo/refinamiento';
import { exportarV0 } from '../src/codec/exportar';

for (const afiliacion of ['sistemica', 'ambiental'] as const)
    test(`T-060 B-44 interfaz rechaza evento exterior ${afiliacion} y conserva condición, revisión e identidad`, async ({ page, request }) => {
        const id = `e2e-b44-${afiliacion}`, b = modeloCon({ objetos: [['Pedido', []]], procesos: ['Procesar'] });
        const base = { ...b, id, nombre: `E2E ${id}`, cosas: Object.fromEntries(Object.entries(b.cosas).map(([k, c]) => [k, { ...c, afiliacion }])) };
        const enlace = must(crearEnlace(base, { opd: base.raiz, candidato: { tipo: 'instrumento', objeto: porNombre(base, 'Pedido').id, proceso: porNombre(base, 'Procesar').id, control: 'c' } }));
        const d = must(descomponer(enlace.modelo, { opd: base.raiz, proceso: porNombre(base, 'Procesar').id, bandas: [['Inspeccionar'], ['Aceptar']] }));
        const e = enlace.creados[0]!, m = must(reanclarExtremo(d.modelo, { opd: d.creados[0]!, enlace: e, extremo: 'destino', hacia: { cosa: porNombre(d.modelo, 'Inspeccionar').id } })).modelo;
        const r = await request.post('/api/modelos', { headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, data: exportarV0(m) });
        expect(r.status(), await r.text()).toBe(201);
        await abrir(page, id); await navegar(page, /SD1 Procesar/); await seleccionarEnlace(page, e);
        const antes = await leer(request, id);
        await tecla(page, 'e');
        await expect(page.getByRole('status').filter({ hasText: 'Un evento externo no puede atravesar el contorno de un proceso descompuesto para iniciar un subproceso, a ningún nivel.' })).toBeVisible();
        await guardado(page);
        const despues = await leer(request, id); expect(despues.texto).toBe(antes.texto); expect(despues.rev).toBe(antes.rev);
        await expect(page.getByRole('combobox', { name: 'Control', exact: true })).toHaveValue('c');
        const evento = page.getByRole('combobox', { name: 'Control', exact: true }).getByRole('option', { name: 'e', exact: true });
        await expect(evento).toHaveJSProperty('disabled', true); await expect(evento).toHaveAttribute('disabled', '');
        await expect(evento).toHaveAttribute('title', 'Un evento externo no puede atravesar el contorno de un proceso descompuesto para iniciar un subproceso, a ningún nivel.');
        await expect(opl(page)).toContainText('Inspeccionar'); await captura(page, `b44-${afiliacion}-rechazo`);
        await tecla(page, 'c'); await guardado(page);
        await expect.poll(async () => JSON.parse((await leer(request, id)).texto).modelo.enlaces[e].modificador).toBeUndefined();
        await tecla(page, 'Control+z'); await guardado(page);
        expect((await leer(request, id)).texto).toBe(antes.texto);
    });
