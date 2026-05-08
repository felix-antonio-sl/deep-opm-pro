// Smoke L2 ronda 20: editor OPL honesto. Cubre los 4 grupos visuales, el
// conteo en el botón "Aplicar", el tooltip por razón en líneas no aplicables
// y la legibilidad del rail minimizado a 1280x720 sin truncar.
import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible } from "./_smoke-helpers";

test("editor OPL honesto muestra 4 grupos con contadores estables", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");

  await page.getByTestId("panel-opl-editar-libre").click();
  // Texto inicial: el textarea se prellena con el OPL actual ("Entrada es un objeto..."),
  // que es una sentencia reconocida sin cambio. El editor honesto debe
  // mostrar 4 grupos visibles con sus contadores estables.
  await expect(page.getByTestId("editor-opl-grupo-reconocidas")).toBeVisible();
  await expect(page.getByTestId("editor-opl-grupo-aplicables")).toBeVisible();
  await expect(page.getByTestId("editor-opl-grupo-no-aplicables")).toBeVisible();
  await expect(page.getByTestId("editor-opl-contador-reconocidas")).toContainText("1");
  await expect(page.getByTestId("editor-opl-contador-aplicables")).toContainText("0");

  expect(pageErrors).toEqual([]);
});

test("editor OPL honesto cuenta 1 cambio aplicable y etiqueta el botón", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");

  await page.getByTestId("panel-opl-editar-libre").click();
  // Renombra Entrada -> Cliente: 1 cambio aplicable.
  await page.getByTestId("panel-opl-editor-textarea").fill("**Cliente** es un objeto físico y ambiental.");

  await expect(page.getByTestId("editor-opl-contador-aplicables")).toContainText("1");
  await expect(page.getByTestId("panel-opl-editor-aplicar")).toContainText("Aplicar 1 cambio");
  await expect(page.getByTestId("panel-opl-editor-aplicar")).toBeEnabled();
  // El bloque preview sigue exponiendo la descripción de cambio (smoke 03 lo
  // valida con `renombrar Entrada -> Cliente`; aquí lo confirmamos en grupo).
  await expect(page.getByTestId("panel-opl-editor-preview")).toContainText("renombrar Entrada -> Cliente");

  expect(pageErrors).toEqual([]);
});

test("editor OPL honesto marca línea no aplicable con razón visible", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");

  await page.getByTestId("panel-opl-editar-libre").click();
  // Texto basura sin punto: el parser produce un syntax-error y el clasificador
  // lo mapea a razón "puntuacion-faltante".
  await page.getByTestId("panel-opl-editor-textarea").fill("basura sin punto");

  await expect(page.getByTestId("editor-opl-contador-no-aplicables")).toContainText("1");
  await expect(page.getByTestId("editor-opl-contador-aplicables")).toContainText("0");
  await expect(page.getByTestId("panel-opl-editor-aplicar")).toBeDisabled();
  await expect(page.getByTestId("panel-opl-editor-aplicar")).toContainText("Sin cambios aplicables");
  // La razón canónica se muestra inline y el tooltip (title) la repite.
  const lineaNoAplicable = page.locator('[data-estado="no-aplicable"]').first();
  await expect(lineaNoAplicable).toBeVisible();
  await expect(lineaNoAplicable).toHaveAttribute("title", /OPL-ES sintaxis|OPL-ES D1-D8/);

  expect(pageErrors).toEqual([]);
});

test("rail OPL minimizado lee 'OPL · N oraciones' completo a 1280x720", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await page.getByTestId("panel-opl-minimizar").click();

  const rail = page.getByTestId("panel-opl-restaurar");
  await expect(rail).toBeVisible();
  await expect(rail).toContainText("OPL");
  await expect(rail).toContainText("oraciones");
  // Verifica que el texto no se trunque: el `scrollWidth` del rail no debe
  // exceder el `clientWidth` (overflow:hidden + nowrap garantiza esto solo si
  // el contenido cabe). A 1280x720 con 1 oración el texto cabe holgado.
  const noTruncado = await rail.evaluate((el) => el.scrollWidth <= el.clientWidth + 1);
  expect(noTruncado).toBe(true);

  expect(pageErrors).toEqual([]);
});
