import { expect, test } from "@playwright/test";
import {
  clickLinkPorTipo,
  elegirTipoEnlaceDesdeMenu,
  elementoPorTexto,
  esperarWorkbenchInicial,
  irATabExtremos,
} from "./_smoke-helpers";

// BUG-20260530T214922Z-fb6c2c: los enlaces estructurales no podían anclarse a
// su cosa origen/destino porque la sección "Extremos" del inspector (que abre
// DialogoMoverPuerto para reasignar el extremo) se ocultaba para no-procedurales.
test("estructural: la sección Extremos expone reanclaje para una generalización", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Vehiculo");
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Auto");

  await elementoPorTexto(page, "Vehiculo").click();
  await elegirTipoEnlaceDesdeMenu(page, "generalizacion");
  await elementoPorTexto(page, "Auto").click();

  await clickLinkPorTipo(page, "Generalizacion");
  await irATabExtremos(page);
  await expect(page.getByTestId("reanclar-extremo-btn")).toBeVisible();

  expect(pageErrors).toEqual([]);
});
