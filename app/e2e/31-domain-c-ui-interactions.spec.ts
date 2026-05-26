import { expect, test } from "@playwright/test";
import { elementoPorTexto, exportadoActual, jsonEditor, modeloTransicionEstados } from "./_smoke-helpers";

test("BUG-a41f5c: redimensiona una cosa desde handles de selección", async ({ page }) => {
  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloResizeEstados(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await elementoPorTexto(page, "Pedido").click();
  const handle = page.locator('[joint-selector="resize-se"]').first();
  await expect(handle).toBeVisible();
  const box = await handle.boundingBox();
  if (!box) throw new Error("No se renderizó handle de resize de cosa");

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2 + 30);
  await page.mouse.up();

  const exportado = await exportadoActual(page);
  const apariencia = exportado.modelo.opds["opd-1"]?.apariencias["a-pedido"];
  expect(apariencia?.width).toBeGreaterThan(135);
  expect(apariencia?.height).toBeGreaterThan(94);
  expect(apariencia?.modoTamano).toBe("manual");
});

test("BUG-a41f5c + BUG-00f799: redimensiona estado y Backspace elimina estado enlazado sin extremos huérfanos", async ({ page }) => {
  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloResizeEstados(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await page.locator('.joint-element [data-estado-id="s-pendiente"]').click();
  const handle = page.locator('[joint-selector^="resize-state"][joint-selector$="-se"]').first();
  await expect(handle).toBeVisible();
  const box = await handle.boundingBox();
  if (!box) throw new Error("No se renderizó handle de resize de estado");

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 45, box.y + box.height / 2 + 12);
  await page.mouse.up();

  let exportado = await exportadoActual(page);
  expect(exportado.modelo.estados["s-pendiente"]?.width).toBeGreaterThan(52);
  expect(exportado.modelo.estados["s-pendiente"]?.height).toBeGreaterThan(24);

  await page.keyboard.press("Backspace");
  exportado = await exportadoActual(page);
  expect(exportado.modelo.estados["s-pendiente"]).toBeUndefined();
  const extremos = Object.values(exportado.modelo.enlaces).flatMap((enlace) => [enlace.origenId, enlace.destinoId]);
  expect(extremos.some((extremo) => extremo.kind === "estado" && extremo.id === "s-pendiente")).toBe(false);
});

test("BUG-f81da4: la anotación contextual no desborda ni superpone acciones", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloResizeEstados(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();

  await elementoPorTexto(page, "Pedido").click();
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
  base.modelo.estados["s-rechazado"] = { id: "s-rechazado", entidadId: "o-pedido", nombre: "rechazado" };
  return base;
}
