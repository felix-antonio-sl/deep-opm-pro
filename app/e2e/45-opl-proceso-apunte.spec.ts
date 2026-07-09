import { expect, test } from "@playwright/test";
import { esperarWorkbenchInicial, ejecutarComandoPalette } from "./_smoke-helpers";

// BUG-20260709T174709Z-76af16: «no se genera OPL de proceso y cuando estoy en
// modo taller no se forma ningún OPL». Causa: R-ENT-2 (spec-forja-opl-es)
// suprime la OPL canónica de las cosas con nombre placeholder («Proceso1»…).
// En un APUNTE aplica la excepción de apunte a R-ENT-2: el boceto emite todo
// su OPL — en el panel, el editor libre, los exports y el puente skill (una
// sola generación, sin superficies divergentes). El régimen riguroso (modelos)
// mantiene la supresión; el diagnóstico de nominación sigue avisando.

test("en un apunte, un proceso placeholder aparece en el OPL", async ({ page }) => {
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
  // ...y su oración de existencia aparece en el OPL (excepción de apunte a R-ENT-2).
  await expect(page.getByText(/es un proceso informacional y sistémico/i).first()).toBeVisible();

  expect(pageErrors).toEqual([]);
});
