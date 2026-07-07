import { expect, test } from "@playwright/test";
import { elementoPorTexto, esperarWorkbenchInicial } from "./_smoke-helpers";

// Taller bottom-up (R-OPD-REF-20): un OPD suelto (padreId:null ≠ raíz) es un
// estado transitorio legítimo del arranque bottom-up. Vive en la banda «Taller»
// (proyección DERIVADA, no especie ni estructura persistida) y se reconcilia con
// el árbol vía «adoptar», que invoca el MISMO constructor `establecerRefinamiento`
// que el top-down (convergencia por construcción).
test("crear un OPD suelto, adoptarlo como descomposición y reconciliar el árbol", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  // Una cosa en la raíz para adoptar contra ella.
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Cargar");

  const mainTree = page.getByRole("tree", { name: "Árbol OPD" });
  const banda = page.getByTestId("arbol-banda-taller");

  // Sin sueltos aún: la banda no existe, pero el gesto sí.
  await expect(banda).toHaveCount(0);

  // Crear un OPD suelto bottom-up.
  await page.getByTestId("arbol-nuevo-suelto").click();

  // El suelto aparece bajo la banda Taller y NO cuelga de la raíz.
  await expect(banda).toBeVisible();
  const sueltoItem = banda.getByRole("treeitem").first();
  await expect(sueltoItem).toBeVisible();
  const sueltoTestId = await sueltoItem.getAttribute("data-testid");
  expect(sueltoTestId).toBeTruthy();
  await expect(mainTree.locator(`[data-testid="${sueltoTestId}"]`)).toHaveCount(0);

  // Volver a la raíz y seleccionar el proceso (crear el suelto activó el suelto).
  await mainTree.getByRole("treeitem").first().click();
  await elementoPorTexto(page, "Cargar").click();

  // Adoptar el suelto como descomposición de «Cargar» desde su menú contextual.
  await sueltoItem.click({ button: "right" });
  await expect(page.getByTestId("menu-contextual-arbol")).toBeVisible();
  await page.getByTestId("menu-adoptar-descomposicion").click();

  // Adoptado: ya no es suelto → la banda desaparece y el OPD cuelga del árbol.
  await expect(banda).toHaveCount(0);
  await expect(mainTree.locator(`[data-testid="${sueltoTestId}"]`)).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});
