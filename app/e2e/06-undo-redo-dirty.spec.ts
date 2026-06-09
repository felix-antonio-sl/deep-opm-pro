import { expect, test, type Page } from "@playwright/test";
import {
  elementoPorTexto,
  escapeRegExp,
  modeloTraerConectadosSmoke,
  esperarWorkbenchInicial,
  crearAtributoNumericoSmoke,
  rectDeLocator,
  clickCabeceraElemento,
  clickCentroLink,
  elegirTipoEnlaceDesdeMenu,
  clickLinkPorIndice,
  clickLinkPorTipo,
  desplegarComoAgregacion,
  irATabRefinamiento,
  guardarComoActual,
  cargarPrimerModelo,
  crearModeloNuevoDesdeMenu,
  restaurarPanelOplSiMinimizado,
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

// Ronda 25 L1 III.A: el chrome global ya no expone botones ↶/↷. Undo/redo se
// invocan exclusivamente por atajo (Ctrl+Z / Ctrl+Shift+Z). Este test
// preserva la cobertura semántica (dirty state, atomicidad, reset al cargar
// modelo) usando los atajos en vez de clic sobre botones inexistentes. Las
// antiguas aserciones `toBeDisabled` / `toBeEnabled` sobre el botón se
// traducen a aserciones de efecto del atajo: en historial vacío el Ctrl+Z
// no debe alterar el modelo.
test("marca dirty state y navega cambios con deshacer y rehacer (via atajos)", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");

  await expect(page.getByTestId("chip-persistencia")).toHaveAttribute("data-variante", "nuevo");
  // Historial vacío: Ctrl+Z no introduce ningún elemento ni rompe el modelo.
  await page.keyboard.press("Control+Z");
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await page.keyboard.press("Control+Shift+Z");
  await expect(page.locator(".joint-element")).toHaveCount(0);

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(page.getByTestId("chip-persistencia")).toHaveAttribute("data-variante", "nuevo");
  await expect(page.locator(".joint-element")).toHaveCount(1);

  await page.keyboard.press("Control+Z");
  await expect(page.getByTestId("chip-persistencia")).toHaveAttribute("data-variante", "nuevo");
  await expect(page.locator(".joint-element")).toHaveCount(0);

  await page.keyboard.press("Control+Shift+Z");
  await expect(page.getByTestId("chip-persistencia")).toHaveAttribute("data-variante", "nuevo");
  await expect(page.locator(".joint-element")).toHaveCount(1);

  await page.keyboard.press("Control+Z");
  await expect(page.getByTestId("chip-persistencia")).toHaveAttribute("data-variante", "nuevo");
  await expect(page.locator(".joint-element")).toHaveCount(0);

  await page.keyboard.press("Control+Shift+Z");
  await expect(page.getByTestId("chip-persistencia")).toHaveAttribute("data-variante", "nuevo");
  await expect(page.locator(".joint-element")).toHaveCount(1);

  await elementoPorTexto(page, "Objeto").click();
  await page.getByLabel("Nombre").fill("Renombrado");
  await expect(elementoPorTexto(page, "Renombrado")).toHaveCount(1);
  await page.keyboard.press("Control+Z");
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);
  await page.keyboard.press("Control+Shift+Z");
  await expect(elementoPorTexto(page, "Renombrado")).toHaveCount(1);

  await elementoPorTexto(page, "Renombrado").click();
  await page.keyboard.press("Delete");
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await page.keyboard.press("Control+Z");
  await expect(elementoPorTexto(page, "Renombrado")).toHaveCount(1);

  await page.screenshot({ path: "test-results/opm-dirty-undo-redo.png", fullPage: true });
  await guardarComoActual(page, "Renombrado local");
  await expect(page.getByTestId("chip-persistencia")).toHaveAttribute("data-variante", "local-clean");

  await crearModeloNuevoDesdeMenu(page);
  await expect(page.locator(".joint-element")).toHaveCount(0);
  // Historial reseteado tras "Nuevo": Ctrl+Z no debe restaurar elementos.
  await page.keyboard.press("Control+Z");
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await cargarPrimerModelo(page);
  await expect(elementoPorTexto(page, "Renombrado")).toHaveCount(1);
  await expect(page.getByTestId("chip-persistencia")).toHaveAttribute("data-variante", "local-clean");
  // Historial reseteado tras cargar modelo: Ctrl+Z no debe eliminar la cosa.
  await page.keyboard.press("Control+Z");
  await expect(elementoPorTexto(page, "Renombrado")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("L3 panel diagnostico muestra aviso al crear proceso con nombre no verbal", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();

  await expect(page.getByTestId("panel-diagnostico")).toBeVisible();
  await page.getByTestId("panel-diagnostico-toggle").click();
  await expect(page.getByTestId("aviso-PROCESO_NOMBRE_FORMA_VERBAL")).toContainText("Proceso");
  expect(pageErrors).toEqual([]);
});

test("confirma cambios sin guardar antes de crear un modelo nuevo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  const modalNombreObjeto = page.getByTestId("modal-nombre-cosa");
  if (await modalNombreObjeto.count()) {
    await expect(modalNombreObjeto).toBeVisible();
    await modalNombreObjeto.getByLabel("Nombre").fill("Objeto");
    await modalNombreObjeto.getByRole("button", { name: "OK" }).click();
    await expect(modalNombreObjeto).toHaveCount(0);
  }
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  const dialogo = page.getByRole("dialog", { name: "Hay cambios sin guardar" });
  await crearModeloNuevoDesdeMenu(page);
  await expect(dialogo).toBeVisible();
  await expect(dialogo.getByRole("button", { name: "Guardar" })).toBeFocused();

  await dialogo.getByRole("button", { name: "Cancelar" }).click();
  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  await crearModeloNuevoDesdeMenu(page);
  await expect(dialogo).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  await crearModeloNuevoDesdeMenu(page);
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole("button", { name: "Descartar" }).click();
  await expect(dialogo).toHaveCount(0);
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await expect(page.getByTestId("chip-persistencia")).toHaveAttribute("data-variante", "nuevo");

  expect(pageErrors).toEqual([]);
});

test("no abre confirmacion cuando Nuevo se ejecuta tras guardar", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await guardarComoActual(page, "Modelo sin confirmacion");
  await expect(page.getByTestId("chip-persistencia")).toHaveAttribute("data-variante", "local-clean");

  await crearModeloNuevoDesdeMenu(page);
  await expect(page.getByRole("dialog", { name: "Hay cambios sin guardar" })).toHaveCount(0);
  await expect(page.locator(".joint-element")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("dialogo cerrar con cambios dirty ofrece Guardar Descartar Cancelar en pestañas", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByTestId("nueva-pestana-btn").click();
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  const tabsModelo = page.getByRole("tablist", { name: "Modelos abiertos" }).getByRole("tab");
  await tabsModelo.first().click();
  const dialogo = page.getByRole("dialog", { name: "Hay cambios sin guardar" });
  await expect(dialogo).toBeVisible();
  await expect(page.getByTestId("dialogo-confirmacion-cerrar-dirty")).toBeVisible();
  await expect(dialogo.getByRole("button", { name: "Guardar" })).toBeVisible();
  await expect(dialogo.getByRole("button", { name: "Descartar" })).toBeVisible();
  await expect(dialogo.getByRole("button", { name: "Cancelar" })).toBeVisible();

  await dialogo.getByRole("button", { name: "Cancelar" }).click();
  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  await page.getByTestId(/^cerrar-pestana-/).nth(1).click();
  await expect(dialogo).toBeVisible();
  await dialogo.getByRole("button", { name: "Descartar" }).click();
  await expect(dialogo).toHaveCount(0);
  await expect(page.getByRole("tab")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("undo elimina entidad y restaura modelo previo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await elementoPorTexto(page, "Objeto").click();
  await page.keyboard.press("Delete");
  await expect(page.locator(".joint-element")).toHaveCount(0);

  await page.keyboard.press("Control+Z");
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("undo renombra entidad y restaura nombre previo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Renombrado");
  await expect(elementoPorTexto(page, "Renombrado")).toHaveCount(1);

  await page.keyboard.press("Control+Z");
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);
  await expect(elementoPorTexto(page, "Renombrado")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("undo mueve apariencia y restaura posicion previa", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await elementoPorTexto(page, "Objeto").click();
  const antes = await aparienciaRaizPorNombre(page, "Objeto");

  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  const movida = await aparienciaRaizPorNombre(page, "Objeto");
  expect(movida.x).toBeGreaterThan(antes.x);

  await page.keyboard.press("Control+Z");
  await page.keyboard.press("Control+Z");
  const restaurada = await aparienciaRaizPorNombre(page, "Objeto");
  expect(restaurada.x).toBe(antes.x);
  expect(restaurada.y).toBe(antes.y);

  expect(pageErrors).toEqual([]);
});

test("accion agregar estado desde barra flotante participa en undo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await elementoPorTexto(page, "Objeto").click();
  await page.getByRole("button", { name: "Agregar estados" }).click();
  await page.getByLabel("Nombre estado 1").fill("abierto");
  await page.getByLabel("Nombre estado 2").fill("cerrado");
  await page.getByTestId("modal-crear-estados-confirmar").click();
  await page.getByTestId("barra-agregar-estado").click();
  const conEstado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  expect(Object.keys(conEstado.modelo.estados)).toHaveLength(3);

  await page.keyboard.press("Control+Z");
  const sinEstado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  expect(Object.keys(sinEstado.modelo.estados)).toHaveLength(2);
  expect(pageErrors).toEqual([]);
});

test("undo cambia esencia y restaura valor previo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByRole("button", { name: "Física" }).click();
  await restaurarPanelOplSiMinimizado(page);
  // Canon vigente (forma OPCloud, commit 59ad3a98): esencia + afiliación se
  // componen en UNA oración con sustantivo de tipo y «y».
  await expect(page.getByText("Objeto es un objeto físico y sistémico.")).toBeVisible();

  await page.keyboard.press("Control+Z");
  await restaurarPanelOplSiMinimizado(page);
  await expect(page.getByText("Objeto es un objeto informacional y sistémico.")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("undo edita vertices y restaura ruta previa", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await elementoPorTexto(page, "Objeto").click();
  await elegirTipoEnlaceDesdeMenu(page, "instrumento");
  await clickCabeceraElemento(page, "Proceso");
  await clickCentroLink(page);

  const verticesPathBox = await rectDeLocator(page.locator('[data-tool-name="vertices"] [joint-selector="connection"]').first());
  await page.mouse.move(verticesPathBox.x + verticesPathBox.width / 2, verticesPathBox.y + verticesPathBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(verticesPathBox.x + verticesPathBox.width / 2, verticesPathBox.y + verticesPathBox.height / 2 + 70, { steps: 8 });
  await page.mouse.up();
  expect((await verticesPrimerEnlace(page)).length).toBeGreaterThan(0);

  await page.keyboard.press("Control+Z");
  expect(await verticesPrimerEnlace(page)).toHaveLength(0);

  expect(pageErrors).toEqual([]);
});

test("extraer todas las partes plegadas crea apariencias en un solo undo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await desplegarComoAgregacion(page);
  await page.locator('[role="treeitem"][data-opd-id="opd-1"]').click();
  await clickCabeceraElemento(page, "Objeto");
  // Ronda 20 L1: Plegado parcial y "Extraer todas" viven en el tab `Refinamiento`.
  await irATabRefinamiento(page);
  await page.getByRole("button", { name: "Plegado parcial" }).click();
  await page.getByTestId("extraer-todas-partes-btn").click();

  await expect(page.locator(".joint-element")).toHaveCount(4);
  let exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  const objeto = Object.values(exportado.modelo.entidades).find((entidad) => entidad.nombre === "Objeto");
  if (!objeto) throw new Error("No se exporto Objeto");
  const extraidas = Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {})
    .filter((apariencia) => apariencia.parteExtraidaDe);
  expect(extraidas).toHaveLength(3);

  await page.keyboard.press("Control+Z");
  exportado = JSON.parse(await jsonEditor(page).inputValue()) as ExportadoModelo;
  expect(Object.values(exportado.modelo.opds[exportado.modelo.opdRaizId]?.apariencias ?? {})
    .filter((apariencia) => apariencia.parteExtraidaDe)).toHaveLength(0);

  expect(pageErrors).toEqual([]);
});

test("activa beforeunload solo cuando el modelo esta dirty", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(await estadoBeforeUnload(page)).toEqual({ canceled: false, defaultPrevented: false });

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(await estadoBeforeUnload(page)).toEqual({ canceled: true, defaultPrevented: true });

  await guardarComoActual(page, "Beforeunload limpio");
  await expect(await estadoBeforeUnload(page)).toEqual({ canceled: false, defaultPrevented: false });

  expect(pageErrors).toEqual([]);
});

test("HU-SHARED-002: deshacer revierte creación de cosa con un solo Ctrl+Z (atomicidad)", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  const canvas = page.getByRole("img", { name: "OPD activo" });
  await page.getByTestId("toolbar-drag-objeto").dragTo(canvas, { targetPosition: { x: 320, y: 190 } });
  const modal = page.getByTestId("modal-nombre-cosa");
  if (await modal.count()) {
    await modal.getByLabel("Nombre").fill("Cosa undo");
    await modal.getByRole("button", { name: "OK" }).click();
    await expect(modal).toHaveCount(0);
  }
  await expect(elementoPorTexto(page, "Cosa undo")).toHaveCount(1);

  // Un solo Ctrl+Z debe revertir la operación completa (creación = un push).
  await page.keyboard.press("Control+z");
  await expect(elementoPorTexto(page, "Cosa undo")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

// Ronda 25 L1 III.A: los botones ↶/↷ se eliminaron del cluster Modelo del
// chrome global. Este test sustituye la verificación visual del botón por
// la verificación funcional del atajo global (Ctrl+Z / Ctrl+Shift+Z) y
// confirma que el chip Persistencia menciona la reversibilidad en su
// tooltip para mantener la affordance descubrible.
test("L1 atajos Ctrl+Z y Ctrl+Shift+Z reemplazan los botones eliminados del chrome", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await expect(page.getByTestId("toolbar-root")).toBeVisible();
  // Confirmamos que el chrome ya no expone botones visibles de Deshacer/Rehacer.
  await expect(page.getByRole("button", { name: "Deshacer", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Rehacer", exact: true })).toHaveCount(0);

  // El tooltip del chip persistencia (única affordance visible para undo)
  // debe mencionar la reversibilidad con Ctrl+Z.
  await expect(page.getByTestId("chip-persistencia")).toHaveAttribute("title", /Ctrl\+Z/);

  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await expect(page.locator(".joint-element")).toHaveCount(1);
  await page.keyboard.press("Control+Z");
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await page.keyboard.press("Control+Shift+Z");
  await expect(page.locator(".joint-element")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});
// ─────────────────────────────────────────────────────────────────────────────
// Ronda 12.1 L2 — HU-30.037 cobertura Esc en diálogos legados.
// El componente `Dialogo.tsx` ya captura Esc en fase de captura
// (líneas 32-44, ronda 12). Estos smokes verifican que los diálogos
// instanciados en MenuPrincipal (Versiones, Cargar modelo, BuscarGlobal)
// efectivamente cierran sin persistir el modelo cuando el operador presiona
// Esc. Anclaje SSOT: [Met §6 etapas SD persistencia].
// Bloque pegable al final de `app/e2e/opm-smoke.spec.ts` (sin tocar tests
// previos). Requiere helpers `esperarWorkbenchInicial` y
// `exportadoActual` ya presentes en el archivo.
// ─────────────────────────────────────────────────────────────────────────────
