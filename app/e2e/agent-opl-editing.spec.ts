import { expect, test } from "@playwright/test";
import { esperarWorkbenchInicial, elementoPorTexto, restaurarPanelOplSiMinimizado } from "./_smoke-helpers";

test("la edición manual desde OPL sigue disponible con teclado", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);
  await restaurarPanelOplSiMinimizado(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");

  const token = page.locator('[data-opl-token^="entidad:"]').filter({ hasText: "Entrada" });
  await expect(token).toBeVisible();
  await token.focus();
  await token.press("Enter");
  const editor = page.getByLabel("Renombrar desde OPL");
  await expect(editor).toHaveValue("Entrada");
  await editor.fill("Cambio cancelado");
  await editor.press("Escape");
  await expect(page.getByLabel("Renombrar desde OPL")).toHaveCount(0);
  await expect(elementoPorTexto(page, "Entrada")).toHaveCount(1);

  const tokenAfterCancel = page.locator('[data-opl-token^="entidad:"]').filter({ hasText: "Entrada" });
  await tokenAfterCancel.focus();
  await tokenAfterCancel.press("Enter");
  const editorFinal = page.getByLabel("Renombrar desde OPL");
  await editorFinal.fill("Cliente");
  await editorFinal.press("Enter");

  await expect(elementoPorTexto(page, "Cliente")).toHaveCount(1);
  await expect(page.locator('[data-opl-token^="entidad:"]').filter({ hasText: "Cliente" })).toBeVisible();
  expect(pageErrors).toEqual([]);
});
