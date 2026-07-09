import { expect, test } from "@playwright/test";
import { esperarWorkbenchInicial, ejecutarComandoPalette } from "./_smoke-helpers";

// BUG-20260709T174709Z-76af16: «no se genera OPL de proceso y cuando estoy en
// modo taller no se forma ningún OPL». Causa: R-NOM-PROC-1 suprime del OPL los
// procesos con nombre placeholder (Proceso1…). En un APUNTE se relaja esa regla
// (bisimetría del bosquejo): el proceso placeholder SÍ aparece en el OPL de
// display. El OPL canónico (roundtrip) queda intacto.

test("en un apunte, un proceso placeholder aparece en el OPL de display", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  // Nacer un apunte (comando «Nuevo» de la paleta).
  await ejecutarComandoPalette(page, "nuevo", "menu-nuevo-modelo");
  await expect(page.getByTestId("cinta-apunte")).toBeVisible();

  // Crear un proceso SIN nombrarlo → nombre placeholder ("Proceso"/"Proceso1").
  await page.locator(".joint-paper").click({ position: { x: 40, y: 40 } });
  await page.keyboard.press("p");
  // Cerrar cualquier editor de nombre inline dejando el placeholder intacto.
  await page.keyboard.press("Escape");

  // El proceso placeholder existe en el canvas...
  await expect(page.locator(".joint-element")).toHaveCount(1);
  // ...y su oración de existencia aparece en el OPL (relajación de R-NOM-PROC-1).
  await expect(page.getByText(/es un proceso informacional y sistémico/i).first()).toBeVisible();

  expect(pageErrors).toEqual([]);
});
