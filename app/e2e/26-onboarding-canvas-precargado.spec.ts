/**
 * Smoke ronda 23 L3 #7 — Banner inline de bienvenida con canvas precargado.
 *
 * Cubre el reemplazo del modal de bienvenida por la dupla:
 *  - canvas precargado con el fixture canónico "System Diagram"
 *  - banner inline arriba del canvas con accesos a "Asistente guiado",
 *    "Empezar vacío" y un ✕ que mantiene el ejemplo.
 *
 * Para activar la precarga (deshabilitada por defecto bajo Playwright)
 * el spec sobreescribe `navigator.webdriver` vía `addInitScript`. Eso
 * permite validar el comportamiento real para usuarios sin tocar los 26
 * smokes históricos.
 */
import { expect, test } from "@playwright/test";

async function activarPrecargaReal(page: import("@playwright/test").Page): Promise<void> {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false, configurable: true });
  });
}

test("primer paint precarga System Diagram y muestra banner inline", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await activarPrecargaReal(page);
  await page.goto("/");

  // El banner debe aparecer dentro del canvas-pane (no como overlay con telón).
  const banner = page.getByTestId("pantalla-inicio");
  await expect(banner).toBeVisible();
  await expect(banner).toContainText("Estás viendo un ejemplo: System Diagram");
  await expect(banner).toHaveCSS("font-style", "italic");

  const canvasBox = await page.getByTestId("canvas-pane").boundingBox();
  const bannerBox = await banner.boundingBox();
  expect(canvasBox).not.toBeNull();
  expect(bannerBox).not.toBeNull();
  expect(bannerBox!.width).toBeLessThanOrEqual(420);
  expect(bannerBox!.x).toBeGreaterThanOrEqual(canvasBox!.x + canvasBox!.width - 460);
  expect(bannerBox!.y).toBeLessThanOrEqual(canvasBox!.y + 80);

  // El canvas precargado tiene las cosas del fixture System Diagram
  // (8 entidades + estados anidados del atributo beneficiario).
  const conteoCanvas = await page.locator(".joint-element").count();
  expect(conteoCanvas).toBeGreaterThanOrEqual(8);

  // Los tres botones expuestos son: Asistente guiado, Empezar vacío y ✕.
  const asistente = banner.getByRole("button", { name: "Asistente guiado" });
  const empezarVacio = banner.getByRole("button", { name: "Empezar vacío" });
  await expect(asistente).toBeVisible();
  await expect(empezarVacio).toBeVisible();
  await expect(banner.getByRole("button", { name: "Descartar banner de bienvenida" })).toBeVisible();
  await expect(asistente).toHaveCSS("border-top-style", "none");
  await expect(asistente).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(asistente).toHaveCSS("font-style", "italic");
  await expect(empezarVacio).toHaveCSS("border-top-style", "none");
  await expect(empezarVacio).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");

  expect(pageErrors).toEqual([]);
});

test("clic en × descarta banner pero conserva el ejemplo cargado", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await activarPrecargaReal(page);
  await page.goto("/");

  const banner = page.getByTestId("pantalla-inicio");
  await expect(banner).toBeVisible();
  const conteoInicial = await page.locator(".joint-element").count();
  expect(conteoInicial).toBeGreaterThan(0);

  await banner.getByRole("button", { name: "Descartar banner de bienvenida" }).click();
  await expect(banner).toHaveCount(0);
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("opforja:welcome-banner-dismissed:v1")))
    .toBe("1");

  // El canvas conserva el ejemplo: el operador acepta el fixture como punto
  // de partida y sigue editándolo sin la distracción del banner.
  await expect(page.locator(".joint-element")).toHaveCount(conteoInicial);
  await page.reload();
  await expect(page.getByTestId("pantalla-inicio")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("clic en 'Empezar vacío' vacía el canvas y descarta el banner", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await activarPrecargaReal(page);
  await page.goto("/");

  const banner = page.getByTestId("pantalla-inicio");
  await expect(banner).toBeVisible();
  expect(await page.locator(".joint-element").count()).toBeGreaterThan(0);

  await banner.getByRole("button", { name: "Empezar vacío" }).click();
  await expect(banner).toHaveCount(0);

  // Tras la acción canónica "Nuevo modelo" la pestaña activa se reemplaza
  // por una pestaña limpia: 0 entidades, viewpoint Edicion.
  await expect(page.locator(".joint-element")).toHaveCount(0);
  await expect(page.getByTestId("viewpoint-heading")).toHaveText("Workbench OPM - edición");

  expect(pageErrors).toEqual([]);
});

test("clic en 'Asistente guiado' abre el wizard de 3 etapas", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await activarPrecargaReal(page);
  await page.goto("/");

  const banner = page.getByTestId("pantalla-inicio");
  await expect(banner).toBeVisible();

  await banner.getByRole("button", { name: "Asistente guiado" }).click();
  await expect(banner).toHaveCount(0);

  // El wizard DE-WIZ abre con la primera etapa: "Función principal".
  const wizard = page.getByRole("dialog", { name: "Asistente nuevo modelo" });
  await expect(wizard).toBeVisible();
  await expect(wizard).toContainText("Etapa 1 de 3");
  await expect(wizard).toContainText("Función principal");

  expect(pageErrors).toEqual([]);
});
