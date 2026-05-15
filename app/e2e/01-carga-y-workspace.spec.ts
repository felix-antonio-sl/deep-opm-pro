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

test("carga demo OPM en canvas JointJS y mantiene OPL visible", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByRole("img", { name: "OPD activo" })).toBeVisible();

  await page.getByLabel("Cargar modelo de ejemplo").selectOption("Cafetera Domestica");

  await expect(page.locator(".joint-paper svg")).toHaveCount(1);
  expect(await page.locator(".joint-element").count()).toBeGreaterThanOrEqual(3);
  expect(await page.locator(".joint-link").count()).toBeGreaterThanOrEqual(2);
  await expect(page.getByText("Hacer Cafe").first()).toBeVisible();
  await expect(page.getByText("Hacer Cafe consume Cafe Molido.")).toBeVisible();

  await page.screenshot({ path: "test-results/opm-demo-jointjs.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("L3 panel diagnostico marca Cafetera Domestica como valida", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByLabel("Cargar modelo de ejemplo").selectOption("Cafetera Domestica");

  const panel = page.getByTestId("panel-diagnostico");
  await expect(panel).toBeVisible();
  await expect(panel).toContainText("0 issues");
  await page.getByTestId("panel-diagnostico-toggle").click();
  await expect(panel).toContainText("Modelo sin issues metodológicos");
  expect(pageErrors).toEqual([]);
});

test("workspace local abre menu, guarda como, guarda incremental y carga desde dialogo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByText("Modelo (No guardado)").first()).toBeVisible();
  await expect(page.getByRole("treeitem", { name: /SD/ })).toBeVisible();
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await expect(page.getByText("Sin OPL todavía.")).toBeVisible();

  await page.getByLabel("Menú principal").click();
  const menu = page.getByRole("menu", { name: "Menú principal" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: "Nuevo", exact: true })).toBeVisible();
  await menu.getByRole("menuitem", { name: "Guardar", exact: true }).click();

  let dialogoGuardar = page.getByRole("dialog", { name: "Guardar como" });
  await expect(dialogoGuardar).toBeVisible();
  // Tras L4 ronda6: el dialogo muestra "Destino: Inicio / Modelos locales" como
  // texto siempre visible; el breadcrumb completo con boton "Inicio" vive bajo
  // el details "Cambiar carpeta destino" colapsado por default.
  await expect(dialogoGuardar.getByText(/Inicio \/ Modelos locales/)).toBeVisible();
  await dialogoGuardar.getByLabel("Nombre del modelo").fill("Workspace L2");
  await dialogoGuardar.getByLabel("Descripción").fill("Persistencia local");
  await dialogoGuardar.getByRole("button", { name: "Guardar" }).click();
  await expect(dialogoGuardar).toHaveCount(0);
  await expect(page.locator("span").filter({ hasText: /^Workspace L2$/ }).first()).toBeVisible();

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  const modalNombreObjeto = page.getByTestId("modal-nombre-cosa");
  if (await modalNombreObjeto.count()) {
    await expect(modalNombreObjeto).toBeVisible();
    await modalNombreObjeto.getByLabel("Nombre").fill("Objeto");
    await modalNombreObjeto.getByRole("button", { name: "OK" }).click();
    await expect(modalNombreObjeto).toHaveCount(0);
  }
  await page.keyboard.press("Control+S");
  await expect(page.getByRole("dialog", { name: "Guardar como" })).toHaveCount(0);
  await expect(page.getByText("Modelo guardado exitosamente")).toBeVisible();

  await page.getByRole("button", { name: "Nuevo", exact: true }).click();
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await page.getByRole("button", { name: "Cargar", exact: true }).first().click();
  const dialogoCargar = page.getByRole("dialog", { name: "Cargar modelo" });
  await expect(dialogoCargar).toBeVisible();
  // Post L4 ronda6: cada modelo en "Recientes" es un boton con data-testid="reciente-modelo".
  const tileWorkspaceL2 = dialogoCargar.getByTestId("reciente-modelo").filter({ hasText: /Workspace L2/ });
  await expect(tileWorkspaceL2).toBeVisible();
  await tileWorkspaceL2.dblclick();
  await expect(dialogoCargar).toHaveCount(0);
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("HU-30.021 dialogo cargar abre ejemplo organizacional canonico", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Cargar", exact: true }).first().click();
  const dialogo = page.getByRole("dialog", { name: "Cargar modelo" });
  await expect(dialogo).toBeVisible();
  const selectorEjemplos = dialogo.getByLabel("Cargar modelo de ejemplo");
  await expect(selectorEjemplos.locator("option").filter({ hasText: /^Ejemplo organizacional$/ })).toHaveCount(1);
  await selectorEjemplos.selectOption("Ejemplo organizacional");

  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Cliente")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Entregar Valor")).toHaveCount(1);
  expect(await page.locator(".joint-link").count()).toBeGreaterThanOrEqual(7);
  expect(pageErrors).toEqual([]);
});

test("L2 dialogo cargar busca descripcion, selecciona tile y carga", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await guardarComoActual(page, "Busqueda L2", "descripcion persistencia l2");
  await page.getByRole("button", { name: "Nuevo", exact: true }).click();
  await page.getByRole("button", { name: "Cargar", exact: true }).first().click();
  const dialogo = page.getByRole("dialog", { name: "Cargar modelo" });
  await expect(dialogo).toBeVisible();
  await dialogo.getByLabel("Buscar modelos por nombre").fill("persistencia");

  const tile = dialogo.getByTestId("modelo-tile-cargar").filter({ hasText: /Busqueda L2/ });
  await expect(tile).toBeVisible();
  await tile.click();
  await dialogo.getByRole("button", { name: "Cargar", exact: true }).click();

  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);
  expect(pageErrors).toEqual([]);
});

test("workspace L4 mueve modelos y busca global con guard", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.keyboard.press("Control+S");
  const dialogoGuardar = page.getByRole("dialog", { name: "Guardar como" });
  await expect(dialogoGuardar).toBeVisible();
  await dialogoGuardar.getByLabel("Nombre del modelo").fill("Workspace L4 Busqueda");
  await dialogoGuardar.getByLabel("Descripción").fill("hallazgo global l4");
  await dialogoGuardar.getByLabel("Crear versiones en guardados manuales").check();
  await dialogoGuardar.getByRole("button", { name: "Guardar" }).click();
  await expect(dialogoGuardar).toHaveCount(0);

  await page.keyboard.press("Control+Shift+F");
  const dialogoBuscar = page.getByRole("dialog", { name: "Buscar global" });
  await expect(dialogoBuscar).toBeVisible();
  await dialogoBuscar.getByLabel("Buscar global").fill("ha");
  await expect(dialogoBuscar.getByText("Ingresa al menos 3 caracteres.")).toBeVisible();
  await dialogoBuscar.getByLabel("Buscar global").fill("hallazgo");
  await expect(dialogoBuscar.getByTestId(/resultado-busqueda-global-/)).toContainText("Workspace L4 Busqueda");
  await dialogoBuscar.getByRole("button", { name: "Cerrar" }).click();

  await page.getByRole("button", { name: "Cargar", exact: true }).first().click();
  const dialogoCargar = page.getByRole("dialog", { name: "Cargar modelo" });
  await expect(dialogoCargar).toBeVisible();
  await dialogoCargar.getByRole("button", { name: "+ Nueva carpeta" }).click();
  await dialogoCargar.getByPlaceholder("Nombre de carpeta").fill("Destino L4");
  await page.keyboard.press("Enter");
  await expect(dialogoCargar.getByRole("button", { name: /Destino L4/ })).toBeVisible();
  await dialogoCargar.locator('button[title="Workspace L4 Busqueda"]').last().click({ button: "right" });
  await page.getByRole("button", { name: "Cortar" }).click();
  await dialogoCargar.getByRole("button", { name: /Destino L4/ }).dblclick();
  await dialogoCargar.getByRole("button", { name: "Pegar aqui" }).click();
  await expect(dialogoCargar.locator('button[title="Workspace L4 Busqueda"]').last()).toBeVisible();
  await dialogoCargar.getByRole("button", { name: "Cancelar" }).click();

  expect(pageErrors).toEqual([]);
});

test("asiste importacion JSON con archivo, preview, confirmacion y error legible", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  await jsonEditor(page).fill("");
  await page.getByLabel("Archivo JSON").setInputFiles({
    name: "multi-opd.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(modeloDosOpds(), null, 2)),
  });
  await expect(page.getByTestId("import-preview")).toHaveText('Modelo "Modelo multi OPD" — 2 entidades, 2 OPDs, 0 enlaces');

  const dialogo = page.getByRole("dialog", { name: "Hay cambios sin guardar" });
  await page.getByRole("button", { name: "Importar" }).click();
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole("button", { name: "Cancelar" }).click();
  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Objeto Raiz")).toHaveCount(0);

  await page.getByRole("button", { name: "Importar" }).click();
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole("button", { name: "Descartar" }).click();
  await expect(elementoPorTexto(page, "Objeto Raiz")).toHaveCount(1);
  // P0-1 + ronda19 L5: header y pestana cuentan la misma identidad, y el
  // estado "sin guardar" vive en ChipPersistencia, no como sufijo del titulo.
  await expect(page.getByText("Modelo multi OPD", { exact: true })).toHaveCount(1);
  await expect(page.getByRole("tab", { name: /Modelo multi OPD/ })).toHaveCount(1);
  await expect(page.getByTestId("chip-persistencia")).toContainText("Importado");

  await jsonEditor(page).fill("{");
  await expect(page.getByRole("alert")).toHaveText("JSON inválido");

  expect(pageErrors).toEqual([]);
});
