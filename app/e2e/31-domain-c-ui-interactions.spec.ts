import { expect, test, type Locator } from "@playwright/test";
import { clickCabeceraElemento, elementoPorTexto, exportadoActual, jsonEditor, modeloTransicionEstados } from "./_smoke-helpers";

test("BUG-a41f5c: redimensiona una cosa desde handles de selección", async ({ page }) => {
  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloEntidadSimple(), null, 2));
  await page.getByRole("button", { name: "Importar", exact: true }).click();

  await clickCabeceraElemento(page, "Pedido");
  const handle = page.locator('[joint-selector="resize-se"]').first();
  await expect(handle).toBeVisible();
  const box = await handle.boundingBox();
  if (!box) throw new Error("No se renderizó handle de resize de cosa");

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2 + 50);
  await page.mouse.up();

  const exportado = await exportadoActual(page);
  const apariencia = exportado.modelo.opds["opd-1"]?.apariencias["a-pedido"];
  expect(apariencia?.width).toBeGreaterThan(135);
  expect(apariencia?.height).toBeGreaterThan(94);
  expect(apariencia?.modoTamano).toBe("manual");
});

test("BUG-20260605T041307Z/041523Z: estado se mueve, redimensiona y conserva anchors", async ({ page }) => {
  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloEstadosInteractivos(), null, 2));
  await page.getByRole("button", { name: "Importar", exact: true }).click();

  const estado = page.locator('.joint-element [data-estado-id="s-pendiente"]');
  await estado.click();
  const estadoIndex = await indiceVisualEstado(estado);
  await expect(page.locator(`[joint-selector="resize-state${estadoIndex}-se"]`)).toBeVisible();
  await expect(page.locator(`[joint-selector="connect-anchor-e-state${estadoIndex}"]`)).toHaveCount(1);

  const estadoBox = await estado.boundingBox();
  if (!estadoBox) throw new Error("No se renderizó cápsula de estado");
  await page.mouse.move(estadoBox.x + estadoBox.width / 2, estadoBox.y + estadoBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(estadoBox.x + estadoBox.width / 2 - 28, estadoBox.y + estadoBox.height / 2 - 12, { steps: 5 });
  await page.mouse.up();

  let exportado = await exportadoActual(page);
  const movido = exportado.modelo.estados["s-pendiente"];
  expect(movido?.x).toBeLessThan(118);
  expect(movido?.y).toBeLessThan(90);

  const handle = page.locator(`[joint-selector="resize-state${estadoIndex}-se"]`);
  const handleBox = await handle.boundingBox();
  if (!handleBox) throw new Error("No se renderizó handle de resize de estado");
  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(handleBox.x + handleBox.width / 2 + 46, handleBox.y + handleBox.height / 2 + 18, { steps: 5 });
  await page.mouse.up();

  exportado = await exportadoActual(page);
  const redimensionado = exportado.modelo.estados["s-pendiente"];
  expect(redimensionado?.width).toBeGreaterThan(90);
  expect(redimensionado?.height).toBeGreaterThan(24);
});

test("BUG-20260605T041307Z: Backspace elimina estado sin extremos huérfanos", async ({ page }) => {
  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloResizeEstados(), null, 2));
  await page.getByRole("button", { name: "Importar", exact: true }).click();

  const estado = page.locator('.joint-element [data-estado-id="s-pendiente"]');
  await estado.click();

  let exportado = await exportadoActual(page);
  expect(exportado.modelo.estados["s-pendiente"]).toBeDefined();

  await page.keyboard.press("Backspace");
  exportado = await exportadoActual(page);
  expect(exportado.modelo.estados["s-pendiente"]).toBeUndefined();
  const extremos = Object.values(exportado.modelo.enlaces).flatMap((enlace) => [enlace.origenId, enlace.destinoId]);
  expect(extremos.some((extremo) => extremo.kind === "estado" && extremo.id === "s-pendiente")).toBe(false);
});

test("BUG-20260605T041152Z: anchor de estado conecta estado a proceso", async ({ page }) => {
  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloTransicionEstadosSinEnlaces(modeloEstadosInteractivos()), null, 2));
  await page.getByRole("button", { name: "Importar", exact: true }).click();

  const estado = page.locator('.joint-element [data-estado-id="s-pendiente"]');
  const proceso = elementoPorTexto(page, "Aprobar").locator('[joint-selector="body"]');
  const estadoIndex = await indiceVisualEstado(estado);
  await estado.hover();
  const anchor = page.locator(`[joint-selector="connect-anchor-e-state${estadoIndex}"]`);
  const anchorBox = await anchor.boundingBox();
  const procesoBox = await proceso.boundingBox();
  if (!anchorBox || !procesoBox) throw new Error("No se pudo medir anchor/destino");
  await page.mouse.move(anchorBox.x + anchorBox.width / 2, anchorBox.y + anchorBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(procesoBox.x + procesoBox.width / 2, procesoBox.y + procesoBox.height / 2, { steps: 8 });
  await page.mouse.up();

  const menu = page.getByTestId("menu-tipo-enlace");
  await expect(menu).toBeVisible();
  await menu.getByTestId("menu-tipo-enlace-consumo").click();

  const exportado = await exportadoActual(page);
  const enlace = Object.values(exportado.modelo.enlaces).find((item) => item.tipo === "consumo");
  expect(enlace?.origenId).toEqual({ kind: "estado", id: "s-pendiente" });
  expect(enlace?.destinoId).toMatchObject({ kind: "entidad", id: "p-aprobar" });
});

test("BUG-f81da4: la anotación contextual no desborda ni superpone acciones", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloEntidadSimple(), null, 2));
  await page.getByRole("button", { name: "Importar", exact: true }).click();

  await clickCabeceraElemento(page, "Pedido");
  const barra = page.getByTestId("barra-herramientas-elemento");
  await expect(barra).toBeVisible();

  const geometria = await barra.evaluate((root) => {
    const rootRect = root.getBoundingClientRect();
    const paneRect = root.closest('[data-testid="canvas-pane"]')?.getBoundingClientRect();
    const buttons = Array.from(root.querySelectorAll("button")).map((button) => {
      const rect = button.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    });
    const overlaps = buttons.some((actual, index) => buttons.slice(index + 1).some((otro) => (
      actual.left < otro.right &&
      actual.right > otro.left &&
      actual.top < otro.bottom &&
      actual.bottom > otro.top
    )));
    return {
      dentroPane: paneRect ? rootRect.left >= paneRect.left - 1 && rootRect.right <= paneRect.right + 1 : false,
      sinOverflowInterno: root.scrollWidth <= root.clientWidth + 1,
      overlaps,
    };
  });

  expect(geometria).toEqual({ dentroPane: true, sinOverflowInterno: true, overlaps: false });
});

function modeloResizeEstados() {
  const base = modeloTransicionEstados();
  base.modelo.estados["s-pendiente"] = {
    ...base.modelo.estados["s-pendiente"]!,
    x: 2200,
    y: -310,
    width: 360,
    height: 120,
  };
  base.modelo.estados["s-rechazado"] = { id: "s-rechazado", entidadId: "o-pedido", nombre: "rechazado" };
  return base;
}

function modeloTransicionEstadosSinEnlaces(base = modeloTransicionEstados()) {
  base.modelo.enlaces = {};
  base.modelo.opds["opd-1"].enlaces = {};
  return base;
}

function modeloEstadosInteractivos() {
  const base = modeloTransicionEstados();
  base.modelo.opds["opd-1"].apariencias["a-pedido"].width = 240;
  base.modelo.opds["opd-1"].apariencias["a-pedido"].height = 120;
  base.modelo.opds["opd-1"].apariencias["a-aprobar"].x = 400;
  return base;
}

function modeloEntidadSimple() {
  const base = modeloTransicionEstadosSinEnlaces();
  base.modelo.estados = {};
  base.modelo.opds["opd-1"].apariencias["a-pedido"].width = 135;
  base.modelo.opds["opd-1"].apariencias["a-pedido"].height = 60;
  return base;
}

async function indiceVisualEstado(estado: Locator): Promise<string> {
  const index = await estado.getAttribute("data-estado-index");
  if (!index) throw new Error("Cápsula de estado sin data-estado-index");
  return index;
}
