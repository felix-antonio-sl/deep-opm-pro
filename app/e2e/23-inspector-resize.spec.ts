// BUG-20260511T225343Z-696858: el inspector derecho debe ser redimensionable
// vía DivisorPanel. Smoke aditivo: arrastrar el divisor cambia el ancho del
// pane, el ancho persiste en `indice.preferenciasUi.anchoPanelInspector`
// (espejo de `anchoPanelArbol`) y el doble clic resetea al default 360.
import { expect, test } from "@playwright/test";
import { esperarWorkbenchInicial, rectDeLocator } from "./_smoke-helpers";

test("BUG-20260511T225343Z-696858: el inspector derecho se redimensiona desde su divisor", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await esperarWorkbenchInicial(page);

  const inspector = page.getByTestId("inspector-pane");
  const divisor = page.getByTestId("divisor-panel-inspector");
  await expect(inspector).toBeVisible();
  await expect(divisor).toBeVisible();

  const anchoInicial = (await rectDeLocator(inspector)).width;
  const divisorBox = await divisor.boundingBox();
  if (!divisorBox) throw new Error("No se pudo ubicar el divisor del inspector");

  // Arrastrar a la izquierda (delta x = -120) agranda el inspector porque
  // `invertirDelta=true` en `<DivisorPanel>` para el caso pane-a-la-derecha.
  await page.mouse.move(divisorBox.x + divisorBox.width / 2, divisorBox.y + divisorBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(divisorBox.x + divisorBox.width / 2 - 120, divisorBox.y + divisorBox.height / 2, { steps: 8 });
  await page.mouse.up();

  await expect
    .poll(async () => (await rectDeLocator(inspector)).width)
    .toBeGreaterThan(anchoInicial + 90);

  // Persistencia espejo a `anchoPanelArbol`: workspace.preferenciasUi.
  const preferencias = await page.evaluate(() => {
    const raw = localStorage.getItem("deep-opm-pro:persistencia:workspace");
    return raw ? JSON.parse(raw).preferenciasUi : null;
  });
  expect(preferencias?.anchoPanelInspector).toBeGreaterThan(anchoInicial + 90);

  // Doble clic reset a 360 (ANCHO_PANEL_INSPECTOR_DEFAULT).
  await divisor.dblclick();
  await expect.poll(async () => Math.round((await rectDeLocator(inspector)).width)).toBe(360);
});
