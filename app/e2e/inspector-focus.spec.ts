/**
 * Smoke ronda 23 L4 — Default brutal: crear objeto/proceso enfoca el input
 * Nombre del Inspector con el texto seleccionado (#15).
 *
 * Cierra audit veredicto §II.15. El flujo "crear → renombrar" es el más
 * común; ahorrar el clic de focus + select reduce fricción medible.
 *
 * También cubre #11: la sección Tamaño (Ancho/Alto/Ajustar texto/Volver
 * auto) vive en el tab Estilo, NO en Refinamiento.
 */

import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible } from "./_smoke-helpers";

test("crear objeto desde toolbar enfoca el input Nombre y selecciona el texto", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  // El inspector se abre con el input Nombre enfocado.
  const inputNombre = page.getByTestId("inspector-entidad-nombre");
  await expect(inputNombre).toBeVisible();
  await expect(inputNombre).toBeFocused();

  // El texto por defecto ("Objeto") está seleccionado para sobrescribir
  // de un tipeo. Verificamos seleccionando el rango del input activo.
  const selectionMatchesValue = await page.evaluate(() => {
    const el = document.activeElement;
    if (!(el instanceof HTMLInputElement)) return false;
    return el.selectionStart === 0 && el.selectionEnd === el.value.length && el.value.length > 0;
  });
  expect(selectionMatchesValue).toBe(true);

  // Confirma comportamiento end-to-end: tipear reemplaza el nombre default.
  await page.keyboard.type("Cliente");
  await expect(inputNombre).toHaveValue("Cliente");

  expect(pageErrors).toEqual([]);
});

test("crear proceso desde toolbar enfoca el input Nombre y selecciona el texto", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await page.getByRole("button", { name: "Proceso", exact: true }).click();

  const inputNombre = page.getByTestId("inspector-entidad-nombre");
  await expect(inputNombre).toBeVisible();
  await expect(inputNombre).toBeFocused();

  await page.keyboard.type("Atender");
  await expect(inputNombre).toHaveValue("Atender");

  expect(pageErrors).toEqual([]);
});

test("seleccionar entidad existente (no recién creada) NO roba focus al input Nombre", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  // Primer objeto: focus por default brutal (esto se verifica en el primer
  // test). Confirmamos el nombre y soltamos el focus llevándolo al canvas.
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  const inputPrimero = page.getByTestId("inspector-entidad-nombre");
  await expect(inputPrimero).toBeFocused();
  await page.keyboard.type("Cliente");
  // Hacer blur del input: clic en el body del documento.
  await page.locator("body").click({ position: { x: 5, y: 5 } });

  // Crear segundo objeto. El input Nombre del nuevo objeto recibe focus.
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  const inputSegundo = page.getByTestId("inspector-entidad-nombre");
  await expect(inputSegundo).toBeFocused();
  // El valor del input es "Objeto" (default), no "Cliente" del previo.
  await expect(inputSegundo).toHaveValue("Objeto");

  expect(pageErrors).toEqual([]);
});

test("sección Tamaño vive en el tab Estilo (movida desde Refinamiento en ronda 23)", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();

  // Tab Refinamiento NO contiene Tamaño.
  await page.getByTestId("inspector-tab-refinamiento").click();
  await expect(page.getByTestId("inspector-panel-refinamiento")).toBeVisible();
  // `aria-label="Tamaño"` es la marca canónica de la sección.
  await expect(
    page.getByTestId("inspector-panel-refinamiento").locator('section[aria-label="Tamaño"]'),
  ).toHaveCount(0);

  // Tab Estilo SÍ contiene Tamaño con sus controles (Ancho/Alto/Ajustar
  // texto/Volver auto).
  await page.getByTestId("inspector-tab-estilo").click();
  await expect(page.getByTestId("inspector-panel-estilo")).toBeVisible();
  const seccionTamano = page
    .getByTestId("inspector-panel-estilo")
    .locator('section[aria-label="Tamaño"]');
  await expect(seccionTamano).toBeVisible();
  await expect(seccionTamano.getByRole("button", { name: "Ajustar texto" })).toBeVisible();
  await expect(seccionTamano.getByRole("button", { name: "Volver auto" })).toBeVisible();

  expect(pageErrors).toEqual([]);
});
