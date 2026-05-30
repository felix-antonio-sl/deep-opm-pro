import { expect, test } from "@playwright/test";
import { esperarWorkbenchInicial } from "./_smoke-helpers";

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
  await esperarWorkbenchInicial(page);

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await expect(palette).toHaveAttribute("data-ifml-stereotype", "Modal");
  await expect(palette.getByRole("combobox")).toBeFocused();

  await palette.getByRole("combobox").fill("tabla enlaces");
  await expect(page.getByTestId("command-palette-item-menu-tabla-enlaces")).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
  const tabla = page.getByTestId("tabla-enlaces");
  await expect(tabla).toBeVisible();
  await expect(tabla).toHaveAttribute("data-ifml-stereotype", "Modal");

  expect(pageErrors).toEqual([]);
});

test("Escape cierra Command Palette sin ejecutar accion", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.keyboard.press("Control+k");
  await expect(page.getByTestId("command-palette")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByTestId("command-palette")).toHaveCount(0);
  await expect(page.getByTestId("tabla-enlaces")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("Command Palette abre Abrir / importar unificado", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").fill("abrir importar");
  await expect(page.getByTestId("command-palette-item-menu-abrir-importar")).toBeVisible();

  await page.keyboard.press("Enter");
  const dialogo = page.getByRole("dialog", { name: "Abrir modelo" });
  await expect(dialogo).toBeVisible();
  await expect(dialogo.getByLabel("Cargar modelo de ejemplo")).toHaveCount(0);
  await expect(dialogo.getByTestId("panel-json-abrir-importar").locator("summary")).toHaveText("JSON");

  expect(pageErrors).toEqual([]);
});

test("Command Palette no expone asistente, ejemplos ni plantillas", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();

  for (const query of ["asistente", "ejemplo", "plantilla"]) {
    await palette.getByRole("combobox").fill(query);
    await expect(palette).toContainText("sin resultados - escribe otro comando");
    await expect(palette.getByRole("option")).toHaveCount(0);
  }

  expect(pageErrors).toEqual([]);
});

test("Command Palette abre Configuración consolidada", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

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

test("Command Palette ofrece Exportar diagnóstico (JSON) en EXPORTAR y lo ejecuta", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();

  await palette.getByRole("combobox").fill("diagnostico");
  const item = page.getByTestId("command-palette-item-menu-exportar-diagnostico");
  await expect(item).toBeVisible();
  await expect(item).toContainText("Exportar diagnóstico (JSON)");
  // Vive bajo la sección EXPORTAR (enrutado por seccionVisualCommandPalette).
  await expect(palette.getByTestId("command-palette-section-exportar")).toContainText("Exportar diagnóstico (JSON)");

  // Ejecutarlo copia al portapapeles y cierra el palette sin errores. No
  // afirmamos el contenido del portapapeles para no depender de permisos de
  // clipboard del navegador headless.
  await item.click();
  await expect(page.getByTestId("command-palette")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("Command Palette abre cheatsheet con estereotipo modal IFML", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").fill("atajos teclado");
  await expect(page.getByTestId("command-palette-item-menu-atajos-teclado")).toBeVisible();

  await page.keyboard.press("Enter");
  const cheatsheet = page.getByTestId("cheatsheet-atajos");
  await expect(cheatsheet).toBeVisible();
  await expect(cheatsheet).toHaveAttribute("data-ifml-stereotype", "Modal");

  expect(pageErrors).toEqual([]);
});
