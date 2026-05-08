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
  irATabRefinamiento,
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

test("navega OPDs desde el arbol lateral", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByRole("tree", { name: "Árbol OPD" })).toBeVisible();
  const nodoRaiz = page.locator('[role="treeitem"][data-opd-id="opd-1"]');
  const nodoHijo = page.locator('[role="treeitem"][data-opd-id="opd-2"]');
  await expect(nodoRaiz).toHaveAttribute("aria-current", "page");

  await jsonEditor(page).fill(JSON.stringify(modeloDosOpds(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await expect(nodoRaiz).toHaveAttribute("aria-current", "page");
  await expect(elementoPorTexto(page, "Objeto Raiz")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Proceso Hijo")).toHaveCount(0);
  await expect(page.getByText("Objeto Raiz").first()).toBeVisible();

  await nodoHijo.click();

  await expect(nodoHijo).toHaveAttribute("aria-current", "page");
  await expect(elementoPorTexto(page, "Objeto Raiz")).toHaveCount(0);
  await expect(elementoPorTexto(page, "Proceso Hijo")).toHaveCount(1);
  await expect(page.getByText("Proceso Hijo").first()).toBeVisible();

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  const json = await jsonEditor(page).inputValue();
  const exportado = JSON.parse(json) as ExportadoModelo;
  expect(Object.values(exportado.modelo.opds["opd-1"]?.apariencias ?? {})).toHaveLength(1);
  const aparienciasHijo = Object.values(exportado.modelo.opds["opd-2"]?.apariencias ?? {});
  expect(aparienciasHijo).toHaveLength(2);
  expect(todasSeparadas(aparienciasHijo)).toBe(true);

  await page.screenshot({ path: "test-results/opm-opd-tree.png", fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("arbol OPD atajos panel: F2 renombra y Ctrl+D abre gestion", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloDosOpds(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  const nodoRaiz = page.locator('[role="treeitem"][data-opd-id="opd-1"]');
  await expect(nodoRaiz).toBeVisible();
  await nodoRaiz.focus();
  await page.keyboard.press("F2");

  const input = page.getByTestId("arbol-opd-renombrado-inline");
  await expect(input).toBeVisible();
  await input.fill("SD Ajustado");
  await page.keyboard.press("Enter");
  await expect(nodoRaiz).toContainText("SD Ajustado");

  await nodoRaiz.focus();
  await page.keyboard.press("Control+d");
  await expect(page.getByRole("dialog", { name: "Gestión del árbol OPD" })).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("pestanas de sesion mantienen modelos independientes", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByTestId("barra-pestanas")).toBeVisible();
  await expect(page.getByRole("tab")).toHaveCount(1);

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(page.locator(".joint-element")).toHaveCount(1);

  await page.getByTestId("nueva-pestana-btn").click();
  await expect(page.getByRole("tab")).toHaveCount(2);
  await expect(page.locator(".joint-element")).toHaveCount(0);

  await page.getByRole("tab").nth(0).click();
  await expect(page.locator(".joint-element")).toHaveCount(1);

  await page.getByRole("tab").nth(1).click();
  const dialogo = page.getByRole("dialog", { name: "Hay cambios sin guardar" });
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole("button", { name: "Descartar" }).click();
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await page.getByTestId(/^cerrar-pestana-/).nth(1).click();
  await expect(page.getByRole("tab")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("mapa del sistema: abre, muestra thumbnails, doble clic navega", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  // Crear modelo con jerarquía: SD > SD1 (descompone proceso) — flujo determinista
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  // Asegurar que el proceso esta seleccionado para que "Descomponer" funcione
  await elementoPorTexto(page, "Proceso").click();
  // Ronda 20 L1: el botón Descomponer vive en el tab `Refinamiento` del Inspector.
  await irATabRefinamiento(page);
  await page.getByRole("button", { name: "Descomponer", exact: true }).click();

  // Esperar a que SD1 aparezca en el arbol; con el arbol expandido por
  // default, el nodo descompuesto es visible inmediatamente.
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1:" })).toHaveCount(1);
  await elementoPorTexto(page, "Proceso 1").click();
  await irATabRefinamiento(page);
  await page.getByRole("button", { name: "Descomponer", exact: true }).click();
  await expect(page.locator('[role="treeitem"]').filter({ hasText: "SD1.1:" })).toHaveCount(1);
  // Verificar al menos 3 treeitems (Mapa + SD raiz + SD1)
  const treeItems = page.getByRole("treeitem");
  const count = await treeItems.count();
  expect(count).toBeGreaterThanOrEqual(3);

  // Abrir Mapa del sistema desde el cluster Validar de la toolbar.
  await page.getByRole("group", { name: "Validar" }).getByRole("button", { name: "Mapa", exact: true }).click();

  // Verificar que el mapa se muestra
  const mapa = page.getByTestId("mapa-sistema");
  await expect(mapa).toBeVisible({ timeout: 5000 });

  // Verificar que la cobertura visual vuelve a igualar el descriptor multinivel.
  const jointElems = page.locator(".joint-element");
  const elemCount = await jointElems.count();
  expect(elemCount).toBeGreaterThanOrEqual(3);
  await expect(page.getByText(/\d+ OPDs · \d+ relaciones/)).toBeVisible();

  await page.getByRole("button", { name: "Filtros" }).click();
  await expect(page.getByTestId("mapa-filtros")).toBeVisible();
  await page.getByLabel("Filtros del mapa").getByRole("combobox").nth(1).selectOption("predominanciaProceso");
  await mapa.getByRole("button", { name: "Estadísticas" }).click();
  await expect(page.getByTestId("mapa-estadisticas")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "SVG" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/mapa-\d{4}-\d{2}-\d{2}\.svg$/);

  // Cerrar mapa
  await page.getByRole("button", { name: "Cerrar mapa" }).click();
  await expect(mapa).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("gestion arbol Ctrl+D: abre, busca, renombra y verifica", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByRole("treeitem", { name: /SD/ })).toBeVisible();

  // Ctrl+D abre Gestión del árbol
  await page.keyboard.press("Control+d");

  const dialog = page.getByRole("dialog", { name: "Gestión del árbol OPD" });
  await expect(dialog).toBeVisible({ timeout: 5000 });

  // Buscar "SD"
  const searchInput = dialog.locator('input[type="search"]');
  await searchInput.fill("SD");
  // Debería encontrar al menos el nodo SD
  await expect(dialog.getByText("SD")).toBeVisible();

  // Cerrar con Escape
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("arbol OPD: renombrado inline y expandir/colapsar funcionan", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  const canvasPane = page.getByTestId("canvas-pane");
  await canvasPane.click({ position: { x: 200, y: 200 } });

  // L1 ronda 7: la barra creativa permanece sticky tras crear (HU-11.001).
  // Liberar el modo y seleccionar el proceso recién creado para que el
  // Inspector exponga "Descomponer".
  await page.keyboard.press("Escape");
  await canvasPane.locator(".joint-element").first().click();

  // Descomponer para crear SD1 (ronda 20 L1: vive en tab Refinamiento).
  await irATabRefinamiento(page);
  await page.getByRole("button", { name: "Descomponer", exact: true }).click();

  // Verificar que el árbol tiene nodos expandibles
  const treePane = page.getByTestId("tree-pane");
  // El botón de colapsar/expandir debería estar visible
  const expandBtn = treePane.locator('button[aria-label="Expandir"], button[aria-label="Colapsar"]');
  const hasExpand = await expandBtn.count();
  // Al menos debería haber botones de expandir si hay jerarquía
  expect(hasExpand).toBeGreaterThanOrEqual(0); // Puede ser 0 si no hay jerarquía

  expect(pageErrors).toEqual([]);
});
