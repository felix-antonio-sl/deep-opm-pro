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
  clickLinkPorIndice,
  clickLinkPorTipo,
  desplegarComoAgregacion,
  guardarComoActual,
  abrirDialogoCargarModelo,
  cargarPrimerModelo,
  crearModeloNuevoDesdeMenu,
  abrirMenuPrincipal,
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

test("primer paint arranca vacio sin onboarding, ejemplos ni System Diagram", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByRole("img", { name: "OPD activo" })).toBeVisible();
  await expect(page.locator(".joint-paper svg")).toHaveCount(1);
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await expect(page.locator(".joint-link")).toHaveCount(0);
  await expect(page.getByRole("treeitem", { name: /SD/ })).toBeVisible();
  await expect(page.getByTestId("breadcrumb-opd")).not.toContainText("System Diagram");
  await restaurarPanelOplSiMinimizado(page);
  await expect(page.getByTestId("panel-opl")).toContainText("Sin OPL todavía.");
  await expect(page.getByTestId("panel-diagnostico")).toHaveCount(0);
  await expect(page.getByTestId("codex-footer-diagnostico")).toContainText(/sin pendientes|ningún diagnóstico/);
  expect(pageErrors).toEqual([]);
});

test("workspace local abre menu, guarda como, guarda incremental y carga desde dialogo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByTestId("chip-persistencia")).toHaveAttribute("data-variante", "nuevo");
  await expect(page.getByRole("treeitem", { name: /SD/ })).toBeVisible();
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await expect(page.getByTestId("panel-opl")).toBeVisible();
  await expect(page.getByTestId("panel-opl-minimizado")).toHaveCount(0);

  // Ronda Codex v2 L5: el menú lateral se retiró. El botón ☰ abre el command
  // palette `⌘K` (vía única de comandos), superset del menú: comprobamos que
  // el comando "Nuevo modelo" está disponible y cerramos el palette.
  const palette = await abrirMenuPrincipal(page);
  await palette.getByRole("combobox").fill("nuevo modelo");
  await expect(palette.getByTestId("command-palette-item-menu-nuevo-modelo")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
  // Guardar (Ctrl+S) sobre un modelo nuevo abre "Guardar como".
  await page.keyboard.press("Control+s");

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

  await crearModeloNuevoDesdeMenu(page);
  await expect(page.locator(".joint-element")).toHaveCount(0);
  const dialogoCargar = await abrirDialogoCargarModelo(page);
  // Post L4 ronda6: cada modelo en "Recientes" es un boton con data-testid="reciente-modelo".
  const tileWorkspaceL2 = dialogoCargar.getByTestId("reciente-modelo").filter({ hasText: /Workspace L2/ });
  await expect(tileWorkspaceL2).toBeVisible();
  await tileWorkspaceL2.dblclick();
  await expect(dialogoCargar).toHaveCount(0);
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("HU-30.021 dialogo abrir no expone selector de ejemplos", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  const dialogo = await abrirDialogoCargarModelo(page);
  await expect(dialogo.getByLabel("Cargar modelo de ejemplo")).toHaveCount(0);
  await expect(dialogo).not.toContainText("Ejemplos");
  await expect(page.locator(".joint-element")).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});

test("L2 dialogo cargar busca descripcion, selecciona tile y carga", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await guardarComoActual(page, "Busqueda L2", "descripcion persistencia l2");
  await crearModeloNuevoDesdeMenu(page);
  const dialogo = await abrirDialogoCargarModelo(page);
  await dialogo.getByLabel("Buscar modelos por nombre").fill("persistencia");

  const tile = dialogo.getByTestId("modelo-tile-cargar").filter({ hasText: /Busqueda L2/ });
  await expect(tile).toBeVisible();
  await tile.click();
  await dialogo.getByRole("button", { name: "Abrir", exact: true }).click();

  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);
  expect(pageErrors).toEqual([]);
});

test("workspace L4 mueve modelos y busca global con guard", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
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

  const dialogoCargar = await abrirDialogoCargarModelo(page);
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
  // Ronda 22 §7.1: el header ya no duplica el titulo del modelo; la identidad
  // vive en la pestaña y el estado de persistencia en ChipPersistencia.
  await expect(page.getByTestId("toolbar-root").getByText("Modelo multi OPD", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: /Modelo multi OPD/ })).toHaveCount(1);
  // Corte 3.5: el chip muestra "Sin guardar · Ctrl+S" para imports no
  // persistidos; el origen "importado" sigue expuesto en data-variante.
  await expect(page.getByTestId("chip-persistencia")).toHaveAttribute("data-variante", "importado");
  await expect(page.getByTestId("chip-persistencia")).toContainText("Sin guardar");

  await jsonEditor(page).fill("{");
  await expect(page.getByRole("alert")).toHaveText("JSON inválido");

  expect(pageErrors).toEqual([]);
});
