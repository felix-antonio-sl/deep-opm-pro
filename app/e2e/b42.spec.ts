import { test, expect, TOKEN, abrir, leer, guardado, seleccionarEnlace, seleccionar, tecla, opl, captura, aplicarTexto, descargar } from './soporte';
import { modeloCon, must, porNombre } from '../src/pruebas/constructores';
import { crearEnlace } from '../src/nucleo/enlaces';
import { exportarV0 } from '../src/codec/exportar';
import { importarV0 } from '../src/codec/importar';
import { aplicarAccion } from '../src/nucleo/operaciones';
import { generarDocumentoOpl, importarOpl } from '../src/opl/documento';

const decodificar = (texto: string) => {
    const r = importarV0(texto); if (!r.ok) throw Error('Códec'); return r.modelo;
};
test('T-119 T-128 T-170 T-182 T-194 B-42 lista UNI edita segundo destino sin perder parámetro citado, identidad ni undo', async ({ page, request }) => {
    const id = 'e2e-b42-UNI-restriccion';
    let m = { ...modeloCon({ objetos: [['Dato', []], ['Análisis', []], ['Ítem', []]] }), id, nombre: 'E2E lista restringida' };
    for (const [nombre, plural] of [['Análisis', 'Análisis'], ['Ítem', 'Ítems de entrada']] as const)
        m = { ...must(aplicarAccion(m, { op: 'fijarNombrePlural', args: { cosa: porNombre(m, nombre).id, nombre: plural } })).modelo };
    m = { ...must(aplicarAccion(m, { op: 'moverApariciones', args: { opd: m.raiz, mover: [
        { cosa: porNombre(m, 'Dato').id, x: 80, y: 200 },
        { cosa: porNombre(m, 'Análisis').id, x: 600, y: 50 },
        { cosa: porNombre(m, 'Ítem').id, x: 600, y: 400 },
    ] } })).modelo };
    const ids: string[] = [];
    for (const nombre of ['Análisis', 'Ítem']) {
        const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'etiquetado', origen: porNombre(m, 'Dato').id,
            destino: porNombre(m, nombre).id, multOrigen: '1', multDestino: '"a o b"; "a o b">=1' } }));
        m = { ...r.modelo }; ids.push(r.creados[0]!);
    }
    const target = must(aplicarAccion(m, { op: 'fijarMultiplicidad', args: { enlace: ids[1]!, extremo: 'destino', valor: '4' } })).modelo;
    const creado = await request.post('/api/modelos', { headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, data: exportarV0(m) });
    expect(creado.status(), await creado.text()).toBe(201); await abrir(page, id);
    await aplicarTexto(page, generarDocumentoOpl(target)); await guardado(page);
    expect((await leer(request, id)).texto).toBe(exportarV0(target));
    const final = decodificar((await leer(request, id)).texto);
    expect(final.enlaces[ids[0]!]).toEqual(m.enlaces[ids[0]!]); expect(Object.keys(final.enlaces)).toEqual(ids);
    await expect(opl(page).locator('.token.negrita').filter({ hasText: 'donde "a o b" >= 1' })).toHaveCount(1);
    await captura(page, 'b42-UNI-restriccion-edicion');
    await tecla(page, 'Control+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(exportarV0(m));
    await tecla(page, 'Control+Shift+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(exportarV0(target));
    await page.reload(); await guardado(page); expect((await leer(request, id)).texto).toBe(exportarV0(target));
    const union = must(aplicarAccion(target, { op: 'fijarMultiplicidad', args: { enlace: ids[0]!, extremo: 'destino', valor: 'n; n=1,3' } })).modelo;
    await aplicarTexto(page, generarDocumentoOpl(union)); await guardado(page);
    expect((await leer(request, id)).texto).toBe(exportarV0(union));
    await expect(opl(page).locator('.token.negrita').filter({ hasText: 'donde n = 1 o 3' })).toHaveCount(1);
    await captura(page, 'b42-UNI-union-edicion');
    await tecla(page, 'Control+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(exportarV0(target));
    await tecla(page, 'Control+Shift+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(exportarV0(union));
    await page.reload(); await guardado(page); expect((await leer(request, id)).texto).toBe(exportarV0(union));
});
for (const coexistente of [false, true]) test(`T-011 T-128 T-243 DEC56 editar token plural por ID sin renombrar canónico coexistente=${coexistente}`, async ({ page, request }) => {
    const id = `e2e-b42-token-plural-${coexistente}`;
    const base = { ...modeloCon({ objetos: [['Pieza', []], ...(coexistente ? [['Piezas', []] as const] : [])], procesos: ['Ensamblar'] }), id, nombre: 'E2E token plural ' + coexistente };
    const objeto = porNombre(base, 'Pieza').id;
    let m = must(aplicarAccion(base, { op:'fijarNombrePlural',args:{cosa:objeto,nombre:'Piezas'} })).modelo;
    m = must(crearEnlace(m,{opd:m.raiz,candidato:{tipo:'consumo',objeto,proceso:porNombre(m,'Ensamblar').id,mult:'2'}})).modelo;
    const creado=await request.post('/api/modelos',{headers:{Authorization:`Bearer ${TOKEN}`,'Content-Type':'application/json'},data:exportarV0(m)});
    expect(creado.status(),await creado.text()).toBe(201);await abrir(page,id);
    const token = opl(page).locator('[data-linea]').filter({hasText:/^Ensamblar consume 2 Piezas/}).getByRole('button',{name:'Piezas',exact:true});
    await token.press('F2');const dialogo=page.getByRole('dialog',{name:'Editar término OPL',exact:true});
    await expect(dialogo.getByRole('textbox',{name:'Texto',exact:true})).toHaveValue('Piezas');
    await dialogo.getByRole('button',{name:'Aplicar',exact:true}).click();await expect(dialogo).toBeHidden();
    await guardado(page);expect((await leer(request,id)).texto).toBe(exportarV0(m));
    await token.dblclick();await dialogo.getByRole('textbox',{name:'Texto',exact:true}).fill('Piezas de recambio');
    await dialogo.getByRole('button',{name:'Aplicar',exact:true}).click();await expect(dialogo).toBeHidden();await guardado(page);
    const despues=decodificar((await leer(request,id)).texto);
    expect(despues.cosas[objeto]).toMatchObject({id:objeto,nombre:'Pieza',nombrePlural:'Piezas de recambio'});
    if(coexistente)expect(porNombre(despues,'Piezas').id).toBe(porNombre(m,'Piezas').id);
    expect(Object.keys(despues.enlaces)).toEqual(Object.keys(m.enlaces));
    await captura(page,`b42-v2-token-plural-${coexistente}`);await tecla(page,'Control+z');await guardado(page);
    expect((await leer(request,id)).texto).toBe(exportarV0(m));
    await token.dblclick();await dialogo.getByRole('textbox',{name:'Texto',exact:true}).fill('');
    await dialogo.getByRole('button',{name:'Aplicar',exact:true}).click();await expect(dialogo).toBeHidden();await guardado(page);
    const retirado=decodificar((await leer(request,id)).texto);
    expect(retirado.cosas[objeto]).not.toHaveProperty('nombrePlural');expect(retirado.cosas[objeto]?.nombre).toBe('Pieza');
    await tecla(page,'Control+z');await guardado(page);expect((await leer(request,id)).texto).toBe(exportarV0(m));
});
test('T-011 T-128 T-183 T-243 DEC56 plural invariante, nombre canónico y estado editan su propio dato', async ({ page, request }) => {
    const id = 'e2e-b42-token-invariante';
    const base = { ...modeloCon({ objetos: [['Análisis', ['pendiente']]], procesos: ['Analizar'] }), id, nombre: 'E2E token invariante' };
    const objeto = porNombre(base, 'Análisis'); if (objeto.tipo !== 'objeto') throw Error('Montaje');
    let m = must(aplicarAccion(base, { op: 'fijarNombrePlural', args: { cosa: objeto.id, nombre: 'Análisis' } })).modelo;
    m = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'consumo', objeto: objeto.id,
        proceso: porNombre(m, 'Analizar').id, mult: '2', estado: objeto.estados[0]!.id } })).modelo;
    const creado = await request.post('/api/modelos', { headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, data: exportarV0(m) });
    expect(creado.status(), await creado.text()).toBe(201); await abrir(page, id);
    const linea = opl(page).locator('[data-linea]').filter({ hasText: /^Analizar consume 2 Análisis/ });
    const plural = linea.getByRole('button', { name: 'Análisis', exact: true });
    const antes = await leer(request, id);
    await plural.click(); await expect(page.getByRole('textbox', { name: 'Cantidad o parámetro objeto', exact: true })).toHaveValue('2');
    await plural.press('Enter'); expect(await leer(request, id)).toEqual(antes);
    const dialogo = page.getByRole('dialog', { name: 'Editar término OPL', exact: true });
    const texto = dialogo.getByRole('textbox', { name: 'Texto', exact: true });
    await plural.dblclick(); await expect(texto).toHaveValue('Análisis'); await texto.fill('Estudios');
    await dialogo.getByRole('button', { name: 'Aplicar', exact: true }).click(); await guardado(page);
    expect(decodificar((await leer(request, id)).texto).cosas[objeto.id]).toMatchObject({ nombre: 'Análisis', nombrePlural: 'Estudios' });
    await tecla(page, 'Control+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(exportarV0(m));
    const canonico = opl(page).locator('[data-linea]').filter({ hasText: /^Forma plural de Análisis:/ }).getByRole('button', { name: 'Análisis', exact: true });
    await canonico.dblclick(); await expect(texto).toHaveValue('Análisis'); await texto.fill('Informe');
    await dialogo.getByRole('button', { name: 'Aplicar', exact: true }).click(); await guardado(page);
    expect(decodificar((await leer(request, id)).texto).cosas[objeto.id]).toMatchObject({ nombre: 'Informe', nombrePlural: 'Análisis' });
    await tecla(page, 'Control+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(exportarV0(m));
    await linea.getByRole('button', { name: 'pendiente', exact: true }).dblclick(); await expect(texto).toHaveValue('pendiente'); await texto.fill('listo');
    await dialogo.getByRole('button', { name: 'Aplicar', exact: true }).click(); await guardado(page);
    const final = decodificar((await leer(request, id)).texto);
    expect(final.cosas[objeto.id]).toMatchObject({ nombre: 'Análisis', nombrePlural: 'Análisis', estados: [{ ...objeto.estados[0]!, nombre: 'listo' }] });
    expect(Object.keys(final.enlaces)).toEqual(Object.keys(m.enlaces));
    await tecla(page, 'Control+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(exportarV0(m));
});
test('T-011 T-025 T-128 T-182 DEC56 forma plural explícita se guarda, recarga, deshace y habilita documento', async ({ page, request }) => {
    const id = 'e2e-b42-plural';
    const base = { ...modeloCon({ objetos: [['Pieza', ['lista']]], procesos: ['Ensamblar'] }), id, nombre: 'E2E plural' };
    const objeto = porNombre(base, 'Pieza'); if (objeto.tipo !== 'objeto') throw Error('Montaje');
    const m = must(crearEnlace(base, { opd: base.raiz, candidato: { tipo: 'consumo', objeto: objeto.id,
        proceso: porNombre(base, 'Ensamblar').id, mult: '2', estado: objeto.estados[0]!.id } })).modelo;
    const creado = await request.post('/api/modelos', { headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, data: exportarV0(m) });
    expect(creado.status(), await creado.text()).toBe(201); await abrir(page, id);
    await page.getByRole('button', { name: 'Exportar ▾', exact: true }).click();
    const exportacion = page.getByRole('dialog', { name: 'Exportar', exact: true });
    await expect(exportacion.getByRole('button', { name: 'Documento HTML · canon-documento' })).toBeDisabled();
    await expect(exportacion.getByRole('button', { name: 'Modelo JSON', exact: true })).toBeEnabled();
    await expect(exportacion.getByRole('button', { name: 'OPD SVG · canon-diagrama' })).toBeEnabled();
    await expect(exportacion).toContainText('DEC56/DR-12'); await exportacion.getByRole('button', { name: 'Cerrar diálogo' }).click();
    await seleccionar(page, 'Pieza'); const campo = page.getByRole('textbox', { name: 'Forma plural', exact: true });
    await campo.fill('Piezas'); await campo.press('Tab'); await guardado(page);
    const despues = await leer(request, id);
    expect(decodificar(despues.texto).cosas[objeto.id]).toMatchObject({ id: objeto.id, nombre: 'Pieza', nombrePlural: 'Piezas' });
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^Ensamblar consume 2 Piezas \[nombre: «Pieza»\] en lista\.$/ })).toHaveCount(1);
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^Forma plural de Pieza: «Piezas»\.$/ })).toHaveCount(1);
    const nombres = await page.getByLabel(/^Diagrama /).locator('text').allTextContents();
    expect(nombres).toContain('Pieza'); expect(nombres).not.toContain('Piezas');
    await captura(page, 'b42-v2-plural-explicito'); await tecla(page, 'Control+z'); await guardado(page);
    expect((await leer(request, id)).texto).toBe(exportarV0(m));
    await tecla(page, 'Control+Shift+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(despues.texto);
    await page.reload(); await guardado(page); await seleccionar(page, 'Pieza'); await expect(campo).toHaveValue('Piezas');
    await page.getByRole('button', { name: 'Exportar ▾', exact: true }).click();
    await expect(exportacion.getByRole('button', { name: 'Documento HTML · canon-documento' })).toBeEnabled();
    const html = await descargar(page, exportacion.getByRole('button', { name: 'Documento HTML · canon-documento' }));
    expect(html).toContain('Piezas'); expect(html).toContain('canon-documento');
    const texto = await descargar(page, exportacion.getByRole('button', { name: 'Documento OPL', exact: true }));
    const r = importarOpl(m.nombre, texto); expect(r.ok).toBe(true);
    if (r.ok) expect(generarDocumentoOpl(r.valor.modelo)).toBe(texto);
    await exportacion.getByRole('button', { name: 'Cerrar diálogo' }).click();
    await seleccionar(page, 'Pieza');
    const retiradaGuardada = page.waitForResponse(r => {
        if (new URL(r.url()).pathname !== `/api/modelos/${id}` || r.request().method() !== 'PUT') return false;
        const cosa = JSON.parse(r.request().postData() ?? '{}').modelo?.entidades?.[objeto.id];
        return !!cosa && !('nombrePlural' in cosa);
    }, { timeout: 5000 });
    await campo.fill(''); await expect(campo).toHaveValue(''); await campo.press('Tab');
    expect((await retiradaGuardada).status()).toBe(200); await guardado(page);
    expect(decodificar((await leer(request, id)).texto).cosas[objeto.id]).not.toHaveProperty('nombrePlural');
    await tecla(page, 'Control+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(despues.texto);
});

test('T-054 T-057 T-128 T-182 DEC56 común O conserva cantidades por rama en editor y texto desde vacío', async ({ page, request }) => {
    const id = 'e2e-b42-ramas-cuantificadas';
    let m = { ...modeloCon({ objetos: [['Pieza', []]], procesos: ['Ensamblar', 'Reparar', 'Embalar'] }), id, nombre: 'E2E ramas cuantificadas' };
    const objeto = porNombre(m, 'Pieza').id;
    m = must(aplicarAccion(m, { op: 'fijarNombrePlural', args: { cosa: objeto, nombre: 'Piezas' } })).modelo;
    const enlaces: string[] = [];
    for (const [proceso, mult] of [['Ensamblar', 'n; n>=1'], ['Reparar', '2'], ['Embalar', 'm; m>=0']] as const) {
        const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'consumo', objeto, proceso: porNombre(m, proceso).id, mult } }));
        m = r.modelo; enlaces.push(r.creados[0]!);
    }
    m = must(aplicarAccion(m, { op: 'formarAbanico', args: { enlaces, operador: 'XOR' } })).modelo;
    const creado = await request.post('/api/modelos', { headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, data: exportarV0(m) });
    expect(creado.status(), await creado.text()).toBe(201); await abrir(page, id);
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^Exactamente uno de / })).toHaveCount(1);
    await expect(opl(page)).toContainText('Ensamblar consume «n» Piezas [nombre: «Pieza»]');
    await expect(opl(page)).toContainText('Reparar consume 2 Piezas [nombre: «Pieza»]');
    await captura(page, 'b42-v2-ramas-cuantificadas');
    await page.getByRole('button', { name: 'Exportar ▾', exact: true }).click();
    const exportacion = page.getByRole('dialog', { name: 'Exportar', exact: true });
    const texto = await descargar(page, exportacion.getByRole('button', { name: 'Documento OPL', exact: true }));
    const r = importarOpl(m.nombre, texto); expect(r.ok).toBe(true);
    if (!r.ok) throw Error('Inversa del texto visible');
    expect(generarDocumentoOpl(r.valor.modelo)).toBe(texto); expect(Object.values(r.valor.modelo.abanicos)[0]).toMatchObject({ operador: 'XOR' });
    expect(Object.values(r.valor.modelo.enlaces).map(e => 'mult' in e ? e.mult : null).sort()).toEqual(['2', 'm; m>=0', 'n; n>=1']);
    await exportacion.getByRole('button', { name: 'Cerrar diálogo' }).click();
    await page.reload(); await guardado(page); expect((await leer(request, id)).texto).toBe(exportarV0(m));
});
test('T-057 T-128 T-182 T-194 B-42 inspector persiste parámetro y muchos, etiqueta delimitada sólo en OPL y undo', async ({ page, request }) => {
    const id = 'e2e-b42-cantidades';
    let m = { ...modeloCon({ objetos: [['Alfa', []], ['Beta', []]], procesos: ['Preparar'] }), id, nombre: 'E2E B42' };
    const r = must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'consumo', objeto: porNombre(m, 'Alfa').id, proceso: porNombre(m, 'Preparar').id } }));
    m = { ...r.modelo }; const enlace = r.creados[0]!;
    m = { ...must(crearEnlace(m, { opd: m.raiz, candidato: { tipo: 'etiquetado', origen: porNombre(m, 'Alfa').id, destino: porNombre(m, 'Beta').id, etiqueta: 'conoce 3' } })).modelo };
    const creado = await request.post('/api/modelos', { headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, data: exportarV0(m) });
    expect(creado.status(), await creado.text()).toBe(201); await abrir(page, id); await seleccionarEnlace(page, enlace);
    const campo = page.getByRole('textbox', { name: 'Cantidad o parámetro objeto', exact: true });
    await campo.fill('n'); await campo.press('Tab'); await guardado(page);
    await expect.poll(async () => decodificar((await leer(request,id)).texto).enlaces[enlace]).toEqual({ ...m.enlaces[enlace]!, mult: 'n' });
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^Preparar consume «n» Alfa\.$/ })).toHaveCount(1);
    const cantidadOpd = await page.getByLabel(/^Diagrama /).locator('text').allTextContents();
    expect(cantidadOpd).toContain('n'); expect(cantidadOpd).not.toContain('«n»');
    await captura(page,'b42-parametro-delimitado');
    const parametro = await leer(request,id); await page.reload(); await guardado(page); await seleccionarEnlace(page,enlace);
    await expect(campo).toHaveValue('n'); expect((await leer(request,id)).texto).toBe(parametro.texto);
    await page.getByRole('combobox', { name: 'Multiplicidad objeto', exact: true }).selectOption('muchos'); await guardado(page);
    await expect.poll(async () => decodificar((await leer(request,id)).texto).enlaces[enlace]).toEqual({ ...m.enlaces[enlace]!, mult: 'muchos' });
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^Preparar consume muchos Alfa\.$/ })).toHaveCount(1);
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^Alfa «conoce 3» Beta\.$/ })).toHaveCount(1);
    const rotulos = await page.getByLabel(/^Diagrama /).locator('text').allTextContents();
    expect(rotulos).toContain('conoce 3'); expect(rotulos).not.toContain('«conoce 3»');
    await captura(page,'b42-muchos-etiqueta'); await tecla(page,'Control+z'); await guardado(page);
    expect((await leer(request,id)).texto).toBe(parametro.texto);
    await aplicarTexto(page, '*Preparar* consume opcionalidad **Alfa**.'); await guardado(page);
    await expect.poll(async () => decodificar((await leer(request,id)).texto).enlaces[enlace]).toEqual({ ...m.enlaces[enlace]!, mult: 'opcionalidad' });
    await expect(opl(page).locator('[data-linea]').filter({ hasText: /^Preparar consume «opcionalidad» Alfa\.$/ })).toHaveCount(1);
    expect(Object.keys(decodificar((await leer(request,id)).texto).enlaces)).toEqual(Object.keys(m.enlaces));
    await page.reload(); await guardado(page);
    expect(decodificar((await leer(request,id)).texto).enlaces[enlace]).toEqual({ ...m.enlaces[enlace]!, mult: 'opcionalidad' });
});

test('T-057 T-128 T-182 T-194 B-42 matemáticas: rango, restricciones en negrita, edición exacta y undo', async ({ page, request }) => {
    const id = 'e2e-b42-matematicas';
    const base = { ...modeloCon({ objetos: [['Máquina', ['lista']]], procesos: ['Operar'] }), id, nombre: 'E2E B42 matemática' };
    const o = porNombre(base, 'Máquina'); if (o.tipo !== 'objeto') throw Error('Montaje');
    const r = must(crearEnlace(base, { opd: base.raiz, candidato: { tipo: 'consumo', objeto: o.id,
        proceso: porNombre(base, 'Operar').id, estado: o.estados[0]!.id } }));
    const m = r.modelo, enlace = r.creados[0]!;
    const creado = await request.post('/api/modelos', { headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' }, data: exportarV0(m) });
    expect(creado.status(), await creado.text()).toBe(201); await abrir(page, id); await seleccionarEnlace(page, enlace);
    const campo = page.getByRole('textbox', { name: 'Cantidad o parámetro objeto', exact: true });
    await campo.fill('2..5; n>=1'); await campo.press('Tab'); await guardado(page);
    await expect.poll(async () => decodificar((await leer(request, id)).texto).enlaces[enlace]).toEqual({ ...m.enlaces[enlace]!, mult: '2..5; n>=1' });
    const rango = await leer(request, id);
    await campo.fill('n + 0.5*n; n ∈ {2,4}; n ≥ 2'); await campo.press('Tab'); await guardado(page);
    const mult = 'n+0.5*n; n en {2,4}; n>=2';
    await expect.poll(async () => decodificar((await leer(request, id)).texto).enlaces[enlace]).toEqual({ ...m.enlaces[enlace]!, mult });
    const expresion = await leer(request, id);
    const linea = opl(page).locator('[data-linea]').filter({ hasText: 'Operar consume «n+0.5*n» Máquina en lista' });
    await expect(linea).toHaveCount(1);
    await expect(linea.locator('.token.negrita')).toHaveText('donde n en {2, 4}; n >= 2');
    expect(await linea.locator('.token.negrita').evaluate(n => getComputedStyle(n).fontWeight)).toBe('700');
    expect(await page.getByLabel(/^Diagrama /).locator('text').allTextContents()).toContain(mult);
    await captura(page, 'b42-matematica-restriccion-estado');
    await tecla(page, 'Control+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(rango.texto);
    await tecla(page, 'Control+Shift+z'); await guardado(page); expect((await leer(request, id)).texto).toBe(expresion.texto);
    await seleccionarEnlace(page, enlace); await campo.fill('5..2'); await campo.press('Tab');
    await expect(page.getByRole('alert').filter({ hasText: 'R-MULT-1' })).toBeVisible();
    expect((await leer(request, id)).texto).toBe(expresion.texto);
    await page.reload(); await guardado(page); await seleccionarEnlace(page, enlace); await expect(campo).toHaveValue(mult);
    const fijo = decodificar((await leer(request, id)).texto);
    expect(Object.keys(fijo.enlaces)).toEqual([enlace]); expect(Object.keys(fijo.cosas)).toEqual(Object.keys(m.cosas));
});
