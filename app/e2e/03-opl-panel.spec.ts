import { expect, test, type Page } from "@playwright/test";
import {
  elementoPorTexto,
  escapeRegExp,
  modeloTraerConectadosSmoke,
  esperarWorkbenchInicial,
  restaurarPanelOplSiMinimizado,
  crearAtributoNumericoSmoke,
  rectDeLocator,
  clickCabeceraElemento,
  clickCentroLink,
  elegirTipoEnlaceDesdeMenu,
  clickLinkPorIndice,
  clickLinkPorTipo,
  desplegarComoAgregacion,
  guardarComoActual,
  cargarPrimerModelo,
  assertWorkbenchLayout,
  assertCanvasScrollable,
  estadoBeforeUnload,
  puntoMedioPath,
  todasSeparadas,
  svgText,
  jsonEditor,
  exportadoActual,
  aparienciaRaizPorNombre,
  verticesPrimerEnlace,
  modeloDosOpds,
  modeloSmokeTablaEnlaces,
  modeloMarkersCanonicos,
  modeloModificadoresEnlace,
  modeloNoModificador,
  modeloMoverPuerto,
  modeloConsumoDuplicado,
  modeloBusAgregacion,
  modeloAbanicoLogico,
  modeloTransicionEstados,
  modeloTransicionEstadosIncompleto,
  modeloAbanicoRutasEstados,
  objeto,
  proceso,
  enlace,
  aparienciaPar,
  extremoEntidad,
  extremoEstado,
  extremoApuntaAEntidad,
  type ExportadoModelo,
  type ExtremoExportado,
} from "./_smoke-helpers";

test("sincroniza OPL interactivo con canvas y renombrado inverso", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");

  await elementoPorTexto(page, "Entrada").click();
  await elegirTipoEnlaceDesdeMenu(page, "consumo");
  await clickCabeceraElemento(page, "Procesar");

  const panel = page.getByLabel("Panel OPL-ES");
  // Canon L1: la clasificación de cada entidad se escinde en dos oraciones
  // (esencia + afiliación). Entrada (2) + Procesar (2) + consumo (1) = 5.
  await expect(panel.locator('[data-testid="opl-line"]')).toHaveCount(5);
  await expect(panel.locator('[data-opl-ordinal="1"]')).toBeVisible();
  await expect(panel.locator('[data-opl-ordinal="2"]')).toBeVisible();
  await expect(panel.locator('[data-opl-ordinal="3"]')).toBeVisible();

  const tokenEntrada = panel.getByText("Entrada").first();
  await tokenEntrada.hover();
  // Codex: el hover sutil del token OPL usa ink04/paperWarm
  // (#f4f3ec = rgb(244,243,236)); la intención sigue siendo contraste tenue
  // contra paper, ahora en la rampa editorial.
  await expect(tokenEntrada).toHaveCSS("background-color", "rgb(244, 243, 236)");

  await elementoPorTexto(page, "Procesar").click();
  // Codex L6 (G7): al activar el filtro el checkbox se desmonta y lo reemplaza
  // el chip; `.check()` colgaría esperando el `checked` del input ausente, así
  // que se dispara con click directo.
  await panel.getByLabel("Filtrar por selección").click();
  await expect(panel.getByText("Entrada es un objeto")).toHaveCount(0);
  await expect(panel.getByText(/Procesar\s+consume\s+Entrada\./)).toBeVisible();

  // Codex L6 (G7): con el filtro activo, el checkbox se reemplaza por el chip
  // `filtrado · <código> · N/M ✕`; la ✕ desactiva el filtro.
  await expect(panel.getByTestId("panel-opl-filtro-chip")).toBeVisible();
  await panel.getByTestId("panel-opl-filtro-chip-quitar").click();
  await expect(panel.getByLabel("Filtrar por selección")).toBeVisible();
  await tokenEntrada.dblclick();
  await page.getByLabel("Renombrar desde OPL").fill("Cliente");
  await page.keyboard.press("Enter");

  await expect(elementoPorTexto(page, "Cliente")).toHaveCount(1);
  // Canon L1: "Cliente" aparece en 3 oraciones — esencia, afiliación y consumo.
  await expect(panel.getByText("Cliente")).toHaveCount(3);
  await expect(panel.getByText(/Procesar\s+consume\s+Cliente\./)).toBeVisible();

  await page.screenshot({ path: "test-results/opm-opl-interactivo-inverso.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("panel OPL aplica edicion libre con preview y propaga al canvas", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");

  await page.getByTestId("panel-opl-editar-libre").click();
  await page.getByTestId("panel-opl-editor-textarea").fill("**Cliente** es un objeto físico y ambiental.");
  await expect(page.getByTestId("panel-opl-editor-preview")).toContainText("renombrar Entrada -> Cliente");
  // L2 ronda 20: el editor honesto incluye conteo en el botón "Aplicar".
  await expect(page.getByTestId("panel-opl-editor-aplicar")).toContainText(/Aplicar \d+ cambio/);
  await page.getByTestId("panel-opl-editor-aplicar").click();

  await expect(elementoPorTexto(page, "Cliente")).toHaveCount(1);
  await restaurarPanelOplSiMinimizado(page);
  // Canon L1: la clasificación se rinde como dos oraciones escindidas.
  await expect(page.getByLabel("Panel OPL-ES").getByText("Cliente es físico.")).toBeVisible();
  await expect(page.getByLabel("Panel OPL-ES").getByText("Cliente es ambiental.")).toBeVisible();
  await expect(page.getByText("OPL aplicado: 3 cambios")).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("OPL agrupa oraciones por OPD y permite colapsar bloques", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloDosOpds(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();
  await restaurarPanelOplSiMinimizado(page);

  const bloqueRaiz = page.getByTestId("bloque-opl-opd-1");
  const bloqueHijo = page.getByTestId("bloque-opl-opd-2");
  await expect(bloqueRaiz).toBeVisible();
  await expect(bloqueHijo).toBeVisible();
  // Canon L1: la clasificación de cada entidad ocupa dos oraciones; el nombre
  // aparece en ambas, por lo que se afirma sobre la primera.
  await expect(bloqueRaiz.getByText("Objeto Raiz").first()).toBeVisible();
  await expect(bloqueHijo.getByText("Proceso Hijo").first()).toBeVisible();

  await page.getByTestId("cabecera-bloque-opl-opd-2").click();
  await expect(bloqueHijo.getByText("Proceso Hijo")).toHaveCount(0);
  await page.getByTestId("cabecera-bloque-opl-opd-2").click();
  await expect(bloqueHijo.getByText("Proceso Hijo").first()).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("panel OPL busca texto y filtra lineas", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");
  await elementoPorTexto(page, "Entrada").click();
  await elegirTipoEnlaceDesdeMenu(page, "consumo");
  await elementoPorTexto(page, "Procesar").click();

  const panel = page.getByLabel("Panel OPL-ES");
  // Canon L1: Entrada (2) + Procesar (2) + consumo (1) = 5 oraciones.
  await expect(panel.locator('[data-testid="opl-line"]')).toHaveCount(5);
  await page.getByTestId("panel-opl-buscar").fill("consume");
  await expect(panel.locator('[data-testid="opl-line"]')).toHaveCount(1);
  await expect(panel.getByText(/Procesar\s+consume\s+Entrada\./)).toBeVisible();
  await expect(panel.getByText("Entrada es un objeto")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("panel OPL copia y exporta HTML desde botones", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (texto: string) => {
          (window as Window & { __copiedOpl?: string }).__copiedOpl = texto;
        },
      },
    });
  });
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  await page.getByTestId("panel-opl-copiar").click();
  const copiado = await page.evaluate(() => (window as Window & { __copiedOpl?: string }).__copiedOpl ?? "");
  // Canon L1: clasificación escindida en dos oraciones (esencia + afiliación).
  expect(copiado).toContain("**Objeto** es informacional.");
  expect(copiado).toContain("**Objeto** es sistémico.");
  await expect(page.getByText("OPL copiado al portapapeles")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByTestId("panel-opl-exportar-html").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/Modelo-opl\.html$/);

  expect(pageErrors).toEqual([]);
});

test("panel OPL alterna numeracion 123 sin perder seleccion", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  const panel = page.getByLabel("Panel OPL-ES");
  await expect(panel.locator('[data-opl-ordinal="1"] span').first()).toHaveCSS("opacity", "1");

  await page.getByTestId("panel-opl-toggle-numeracion").click();
  await expect(panel.locator('[data-opl-ordinal="1"] span').first()).toHaveCSS("opacity", "0");
  // Canon L1: el nombre aparece en dos oraciones de clasificación; clic en la primera.
  await panel.getByText("Entrada").first().click();
  await expect(page.getByLabel("Nombre")).toHaveValue("Entrada");

  expect(pageErrors).toEqual([]);
});

test("panel OPL minimiza y restaura desde barra colapsada", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByTestId("panel-opl-minimizar").click();

  await expect(page.getByTestId("panel-opl-minimizado")).toBeVisible();
  // Canon L1: un objeto rinde dos oraciones (esencia + afiliación).
  await expect(page.getByTestId("panel-opl-restaurar")).toContainText("OPL · 2 oraciones · Restaurar");
  await expect(page.locator('[data-testid="opl-line"]')).toHaveCount(0);

  await page.getByTestId("panel-opl-restaurar").click();
  await expect(page.locator('[data-testid="opl-line"]')).toHaveCount(2);

  expect(pageErrors).toEqual([]);
});

test("panel OPL queda fijado en marginalia izquierda y persiste al recargar", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  const oplInferior = page.getByTestId("opl-pane");
  const canvas = page.getByTestId("canvas-pane");
  await expect(oplInferior).toBeVisible();
  let oplBox = await oplInferior.boundingBox();
  let canvasBox = await canvas.boundingBox();
  if (!oplBox || !canvasBox) throw new Error("No se pudo medir layout marginalia OPL");
  expect(oplBox.x).toBeLessThan(canvasBox.x);
  expect(oplBox.width).toBeLessThan(canvasBox.width);

  await page.reload();
  oplBox = await page.getByTestId("opl-pane").boundingBox();
  canvasBox = await page.getByTestId("canvas-pane").boundingBox();
  if (!oplBox || !canvasBox) throw new Error("No se pudo medir layout marginalia OPL tras recarga");
  expect(oplBox.x).toBeLessThan(canvasBox.x);

  expect(pageErrors).toEqual([]);
});

test("margen Codex se redimensiona horizontalmente desde su divisor", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  const panel = page.getByTestId("inspector-pane");
  const divisor = page.getByTestId("divisor-panel-inspector");
  await expect(panel).toBeVisible();
  await expect(divisor).toBeVisible();
  await expect(page.getByTestId("divisor-panel-indice-inspector")).toBeVisible();

  const anchoInicial = (await rectDeLocator(panel)).width;
  const divisorBox = await divisor.boundingBox();
  if (!divisorBox) throw new Error("No se pudo ubicar el divisor del margen Codex");

  await page.mouse.move(divisorBox.x + divisorBox.width / 2, divisorBox.y + divisorBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(divisorBox.x + divisorBox.width / 2 - 90, divisorBox.y + divisorBox.height / 2, { steps: 8 });
  await page.mouse.up();

  await expect
    .poll(async () => (await rectDeLocator(panel)).width)
    .toBeGreaterThan(anchoInicial + 70);

  await divisor.dblclick();
  await expect.poll(async () => Math.round((await rectDeLocator(panel)).width)).toBe(360);

  expect(pageErrors).toEqual([]);
});

test("panel OPL indenta y contrae bloques jerarquicos desde preferencias", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await jsonEditor(page).fill(JSON.stringify(modeloDosOpds(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();
  await restaurarPanelOplSiMinimizado(page);

  const bloqueRaiz = page.getByTestId("bloque-opl-opd-1");
  const bloqueHijo = page.getByTestId("bloque-opl-opd-2");
  await expect(bloqueRaiz).toHaveAttribute("data-opl-nivel", "0");
  await expect(bloqueHijo).toHaveAttribute("data-opl-nivel", "1");
  expect(await bloqueRaiz.evaluate((el) => getComputedStyle(el).paddingLeft)).toBe("0px");
  expect(await bloqueHijo.evaluate((el) => getComputedStyle(el).paddingLeft)).toBe("16px");

  await page.getByTestId("cabecera-bloque-opl-opd-2").click();
  await expect(bloqueHijo.getByText("Proceso Hijo")).toHaveCount(0);
  await page.reload();
  await expect(page.getByTestId("bloque-opl-opd-2").getByText("Proceso Hijo")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("panel OPL selecciona enlace especifico en oracion multi-enlace", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await jsonEditor(page).fill(JSON.stringify(modeloAbanicoLogico(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();
  await restaurarPanelOplSiMinimizado(page);

  const lineaMultiEnlace = page.locator('[data-testid="opl-line"]').filter({ hasText: "al menos uno de" });
  await lineaMultiEnlace.getByText("Entrada B").click();
  await page.getByRole("button", { name: "Eliminar enlace" }).click();
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  expect(exportado.modelo.enlaces["e-consumo-a"]).toBeDefined();
  expect(exportado.modelo.enlaces["e-consumo-b"]).toBeUndefined();

  expect(pageErrors).toEqual([]);
});

// Ronda23 L1 #5: el botón AI Text está oculto tras `AI_TEXT_HABILITADO=false`
// en `src/ui/panelOpl/Toolbar.tsx` hasta que la feature exista. Cuando se
// implemente, bajar el flag y descomentar este smoke (o reescribir contra el
// flujo real). Se conserva como referencia del contrato esperado.
test.skip("panel OPL muestra placeholder de AI Text sin ejecutar funcionalidad", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await restaurarPanelOplSiMinimizado(page);
  await page.getByTestId("panel-opl-ai-text").click();
  await expect(page.getByText("Próximamente: oraciones generadas por LLM")).toBeVisible();

  expect(pageErrors).toEqual([]);
});
