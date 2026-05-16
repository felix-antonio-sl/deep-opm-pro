import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible } from "./_smoke-helpers";

/**
 * Ronda 22 §7.10 — Command Palette como superficie discoverable.
 *
 * Cubre el contrato minimo: Ctrl+K abre, fuzzy search encuentra acciones
 * estaticas del MenuPrincipal, Enter ejecuta y Escape cierra.
 */

test("Ctrl+K abre palette, busca accion de menu y Enter la ejecuta", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await expect(palette.getByRole("combobox")).toBeFocused();

  await palette.getByRole("combobox").fill("tabla enlaces");
  await expect(page.getByTestId("command-palette-item-menu-tabla-enlaces")).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
  await expect(page.getByTestId("tabla-enlaces")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("Escape cierra Command Palette sin ejecutar accion", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await page.keyboard.press("Control+k");
  await expect(page.getByTestId("command-palette")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
  await expect(page.getByTestId("tabla-enlaces")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("Command Palette abre Cargar modelo con archivados visibles", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").fill("cargar archivados");
  await expect(page.getByTestId("command-palette-item-menu-cargar-archivados")).toBeVisible();

  await page.keyboard.press("Enter");
  const dialogo = page.getByRole("dialog", { name: "Cargar modelo" });
  await expect(dialogo).toBeVisible();
  await expect(dialogo.getByLabel("Mostrar archivados")).toBeChecked();

  expect(pageErrors).toEqual([]);
});

test("Command Palette abre Configuración consolidada", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").fill("configuracion");
  await expect(page.getByTestId("command-palette-item-menu-configuracion")).toBeVisible();

  await page.keyboard.press("Enter");
  const dialogo = page.getByRole("dialog", { name: "Configuración" });
  await expect(dialogo).toBeVisible();
  await expect(dialogo.getByLabel("Nombre del modelo")).toBeVisible();
  await expect(dialogo.getByLabel("Paso")).toBeVisible();

  expect(pageErrors).toEqual([]);
});
