/**
 * E2E ronda F-ui — Simulación numérica: diálogo abierto desde ⌘K,
 * estado vacío con guía, y flujo completo con atributo simulable.
 *
 * Cubre:
 * - Abrir desde CommandPalette ("Simulación numérica").
 * - Estado vacío: guía visible cuando no hay atributos simulables.
 * - Flujo con atributo: crear objeto → crear atributo numérico →
 *   marcar como simulable → abrir diálogo → ejecutar N=5 →
 *   tabla con 5 filas → botón Descargar CSV presente.
 * - Cerrar con "Cerrar".
 */

import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible, crearAtributoNumericoSmoke } from "./_smoke-helpers";

test("simulación numérica: abrir desde palette, estado vacío visible", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  // Abrir via ⌘K (Ctrl+K en Playwright Linux).
  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();

  await palette.getByRole("combobox").fill("simulacion numerica");
  const item = page.getByTestId("command-palette-item-menu-simulacion-numerica");
  await expect(item).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(palette).toHaveCount(0);

  // El diálogo está abierto.
  const dialogo = page.getByTestId("modal-simulacion-numerica");
  await expect(dialogo).toBeVisible();

  // En un modelo vacío no hay atributos simulables: guía visible.
  const estadoVacio = page.getByTestId("simulacion-numerica-estado-vacio");
  await expect(estadoVacio).toBeVisible();
  await expect(estadoVacio).toContainText("No hay atributos simulables");
  await expect(estadoVacio).toContainText("inspector");

  // Botón Ejecutar debe estar deshabilitado (sin columnas).
  const btnEjecutar = dialogo.getByRole("button", { name: "Ejecutar simulación" });
  await expect(btnEjecutar).toBeDisabled();

  // Cerrar con el botón Cerrar.
  await dialogo.getByRole("button", { name: "Cerrar" }).click();
  await expect(page.getByTestId("modal-simulacion-numerica")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("simulación numérica: atributo simulable, ejecutar N=5, tabla y descarga", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");

  // Crea objeto + atributo numérico via helper (nombre = "Temperatura [°C]").
  await crearAtributoNumericoSmoke(page);

  // El inspector debe tener la sección de atributo visible.
  await expect(page.getByTestId("inspector-seccion-atributo")).toBeVisible();

  // Marcar atributo como simulable.
  const toggleSim = page.getByTestId("atributo-simulacion-toggle");
  await expect(toggleSim).toBeVisible();
  const estaActivo = await toggleSim.isChecked();
  if (!estaActivo) {
    await toggleSim.click();
  }
  await expect(toggleSim).toBeChecked();

  // Abrir diálogo desde palette. Primero clicar fuera del inspector para
  // liberar foco y que Ctrl+K llegue al listener global del canvas.
  await page.locator("[data-testid='canvas-pane'], [data-testid='opl-pane']").first().click({ force: true, position: { x: 2, y: 2 } }).catch(() => undefined);
  await page.keyboard.press("Control+k");
  await expect(page.getByTestId("command-palette")).toBeVisible();
  await page.getByTestId("command-palette").getByRole("combobox").fill("simulacion numerica");
  await expect(page.getByTestId("command-palette-item-menu-simulacion-numerica")).toBeVisible();
  await page.keyboard.press("Enter");

  const dialogo = page.getByTestId("modal-simulacion-numerica");
  await expect(dialogo).toBeVisible();

  // No debe aparecer el estado vacío (hay columnas).
  await expect(page.getByTestId("simulacion-numerica-estado-vacio")).toHaveCount(0);

  // Fijar N = 5.
  const inputN = dialogo.getByLabel("Número de ejecuciones");
  await expect(inputN).toBeVisible();
  await inputN.fill("5");

  // Ejecutar.
  const btnEjecutar = dialogo.getByRole("button", { name: "Ejecutar simulación" });
  await expect(btnEjecutar).toBeEnabled();
  await btnEjecutar.click();

  // Tabla con 5 filas de datos (+ 1 cabecera = 6 tr total).
  const tabla = page.getByTestId("simulacion-numerica-tabla");
  await expect(tabla).toBeVisible();
  const filas = tabla.locator("tbody tr");
  await expect(filas).toHaveCount(5);

  // Botón Descargar CSV presente.
  const btnCsv = dialogo.getByRole("button", { name: "Descargar CSV" });
  await expect(btnCsv).toBeVisible();

  // Cerrar.
  await dialogo.getByRole("button", { name: "Cerrar" }).click();
  await expect(page.getByTestId("modal-simulacion-numerica")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});
