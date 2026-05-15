import { expect, test, type Page } from "@playwright/test";
import {
  elementoPorTexto,
  escapeRegExp,
  modeloTraerConectadosSmoke,
  cerrarPantallaInicioSiVisible,
  crearAtributoNumericoSmoke,
  rectDeLocator,
  clickCabeceraElemento,
  clickCentroLink,
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
  modeloEjemploOrganizacionalSmoke,
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
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Procesar");

  await elementoPorTexto(page, "Entrada").click();
  await page.getByLabel("Tipo de enlace").selectOption("consumo");
  await clickCabeceraElemento(page, "Procesar");

  const panel = page.getByLabel("Panel OPL-ES");
  await expect(panel.locator('[data-testid="opl-line"]')).toHaveCount(3);
  await expect(panel.locator('[data-opl-ordinal="1"]')).toBeVisible();
  await expect(panel.locator('[data-opl-ordinal="2"]')).toBeVisible();
  await expect(panel.locator('[data-opl-ordinal="3"]')).toBeVisible();

  const tokenEntrada = panel.getByText("Entrada").first();
  await tokenEntrada.hover();
  await expect(tokenEntrada).toHaveCSS("background-color", "rgb(225, 230, 235)");

  await elementoPorTexto(page, "Procesar").click();
  await panel.getByLabel("Filtrar por selección").check();
  await expect(panel.getByText("Entrada es un objeto")).toHaveCount(0);
  await expect(panel.getByText(/Procesar\s+consume\s+Entrada\./)).toBeVisible();

  await panel.getByLabel("Filtrar por selección").uncheck();
  await tokenEntrada.dblclick();
  await page.getByLabel("Renombrar desde OPL").fill("Cliente");
  await page.keyboard.press("Enter");

  await expect(elementoPorTexto(page, "Cliente")).toHaveCount(1);
  await expect(panel.getByText("Cliente")).toHaveCount(2);
  await expect(panel.getByText(/Procesar\s+consume\s+Cliente\./)).toBeVisible();

  await page.screenshot({ path: "test-results/opm-opl-interactivo-inverso.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("panel OPL aplica edicion libre con preview y propaga al canvas", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");

  await page.getByTestId("panel-opl-editar-libre").click();
  await page.getByTestId("panel-opl-editor-textarea").fill("**Cliente** es un objeto físico y ambiental.");
  await expect(page.getByTestId("panel-opl-editor-preview")).toContainText("renombrar Entrada -> Cliente");
  // L2 ronda 20: el editor honesto incluye conteo en el botón "Aplicar".
  await expect(page.getByTestId("panel-opl-editor-aplicar")).toContainText(/Aplicar \d+ cambio/);
  await page.getByTestId("panel-opl-editor-aplicar").click();

  await expect(elementoPorTexto(page, "Cliente")).toHaveCount(1);
  await expect(page.getByLabel("Panel OPL-ES").getByText("Cliente es un objeto físico y ambiental.")).toBeVisible();
  await expect(page.getByText("OPL aplicado: 3 cambios")).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("OPL agrupa oraciones por OPD y permite colapsar bloques", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloDosOpds(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  const bloqueRaiz = page.getByTestId("bloque-opl-opd-1");
  const bloqueHijo = page.getByTestId("bloque-opl-opd-2");
  await expect(bloqueRaiz).toBeVisible();
  await expect(bloqueHijo).toBeVisible();
  await expect(bloqueRaiz.getByText("Objeto Raiz")).toBeVisible();
  await expect(bloqueHijo.getByText("Proceso Hijo")).toBeVisible();

  await page.getByTestId("cabecera-bloque-opl-opd-2").click();
  await expect(bloqueHijo.getByText("Proceso Hijo")).toHaveCount(0);
  await page.getByTestId("cabecera-bloque-opl-opd-2").click();
  await expect(bloqueHijo.getByText("Proceso Hijo")).toBeVisible();

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
  await page.getByLabel("Tipo de enlace").selectOption("consumo");
  await elementoPorTexto(page, "Procesar").click();

  const panel = page.getByLabel("Panel OPL-ES");
  await expect(panel.locator('[data-testid="opl-line"]')).toHaveCount(3);
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
  expect(copiado).toContain("**Objeto** es un objeto informacional y sistémico.");
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
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  const panel = page.getByLabel("Panel OPL-ES");
  await expect(panel.locator('[data-opl-ordinal="1"] span').first()).toHaveCSS("opacity", "1");

  await page.getByTestId("panel-opl-toggle-numeracion").click();
  await expect(panel.locator('[data-opl-ordinal="1"] span').first()).toHaveCSS("opacity", "0");
  await panel.getByText("Entrada").click();
  await expect(page.getByLabel("Nombre")).toHaveValue("Entrada");

  expect(pageErrors).toEqual([]);
});

test("panel OPL minimiza y restaura desde barra colapsada", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByTestId("panel-opl-minimizar").click();

  await expect(page.getByTestId("panel-opl-minimizado")).toBeVisible();
  await expect(page.getByTestId("panel-opl-restaurar")).toContainText("OPL · 1 oraciones · Restaurar");
  await expect(page.locator('[data-testid="opl-line"]')).toHaveCount(0);

  await page.getByTestId("panel-opl-restaurar").click();
  await expect(page.locator('[data-testid="opl-line"]')).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("panel OPL queda fijado abajo y persiste al recargar", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  const oplInferior = page.getByTestId("opl-pane");
  const canvas = page.getByTestId("canvas-pane");
  await expect(oplInferior).toBeVisible();
  let oplBox = await oplInferior.boundingBox();
  let canvasBox = await canvas.boundingBox();
  if (!oplBox || !canvasBox) throw new Error("No se pudo medir layout inferior OPL");
  expect(oplBox.y).toBeGreaterThan(canvasBox.y);
  expect(oplBox.width).toBeGreaterThan(canvasBox.width);

  await page.reload();
  oplBox = await page.getByTestId("opl-pane").boundingBox();
  canvasBox = await page.getByTestId("canvas-pane").boundingBox();
  if (!oplBox || !canvasBox) throw new Error("No se pudo medir layout inferior OPL tras recarga");
  expect(oplBox.y).toBeGreaterThan(canvasBox.y);

  expect(pageErrors).toEqual([]);
});

test("panel OPL indenta y contrae bloques jerarquicos desde preferencias", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await jsonEditor(page).fill(JSON.stringify(modeloDosOpds(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

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
  await cerrarPantallaInicioSiVisible(page);
  await jsonEditor(page).fill(JSON.stringify(modeloAbanicoLogico(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  const lineaMultiEnlace = page.locator('[data-testid="opl-line"]').filter({ hasText: "al menos uno de" });
  await lineaMultiEnlace.getByText("Entrada B").click();
  await page.getByRole("button", { name: "Eliminar enlace" }).click();
  const exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  expect(exportado.modelo.enlaces["e-consumo-a"]).toBeDefined();
  expect(exportado.modelo.enlaces["e-consumo-b"]).toBeUndefined();

  expect(pageErrors).toEqual([]);
});

test("panel OPL muestra placeholder de AI Text sin ejecutar funcionalidad", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByTestId("panel-opl-ai-text").click();
  await expect(page.getByText("Próximamente: oraciones generadas por LLM")).toBeVisible();

  expect(pageErrors).toEqual([]);
});
