/**
 * Smoke ronda 21 L1 — Estado vacio OPM (Corte 3.5 sustracción de chrome).
 *
 * Cubre el resultado esperado tras el corte 3.5:
 *  - canvas vacío muestra solo un hint inferior discreto, no un bloque
 *    "Iniciar SD" centrado con 3 botones primarios;
 *  - la toolbar (Objeto / Proceso) es el único punto de entrada para crear
 *    la primera cosa;
 *  - el hint desaparece al existir la primera apariencia;
 *  - tras dos entidades con firma legal, aparece el nudge "Conectar como
 *    resultado" y al activarlo crea el enlace de resultado canonico;
 *  - eval mínimo: crear proceso + objeto + enlace resultado desde vacio en
 *    menos de 60s.
 *
 * El smoke se valida al converger en main; no corre en paralelo con sibling
 * worktrees porque comparte puerto 5173.
 */

import { expect, test } from "@playwright/test";
import {
  cerrarPantallaInicioSiVisible,
  elementoPorTexto,
} from "./_smoke-helpers";

test("canvas vacio muestra hint inferior discreto, no overlay centrado", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  // El hint es discreto y vive dentro del canvas-pane.
  const hint = page.getByTestId("estado-vacio-hint");
  await expect(hint).toBeVisible();
  await expect(hint).toHaveAttribute("aria-label", "Iniciar SD");
  await expect(hint).toContainText("Pulsa Objeto o Proceso arriba para empezar.");

  // El bloque centrado "Iniciar SD" con sus 3 botones primarios ya no existe.
  await expect(page.getByTestId("estado-vacio-opm")).toHaveCount(0);
  await expect(page.getByTestId("estado-vacio-crear-proceso")).toHaveCount(0);
  await expect(page.getByTestId("estado-vacio-crear-objeto")).toHaveCount(0);
  await expect(page.getByTestId("estado-vacio-crear-agente-instrumento")).toHaveCount(0);
  await expect(page.getByTestId("estado-vacio-abrir-asistente")).toHaveCount(0);

  // La toolbar es el único punto de entrada de creación primaria.
  await expect(page.getByRole("button", { name: "Objeto", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Proceso", exact: true })).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("hint desaparece tras crear primera apariencia via toolbar", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await expect(page.getByTestId("estado-vacio-hint")).toBeVisible();

  // El click en "Proceso" crea directo (sin modal): la accion canonica de la
  // toolbar es `crearProcesoDemo` con nombre default y posicion libre.
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await expect(page.locator(".joint-element")).toHaveCount(1);

  await expect(page.getByTestId("estado-vacio-hint")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("tras 2 entidades con firma legal aparece nudge 'Conectar como resultado'", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await expect(page.locator(".joint-element")).toHaveCount(1);
  await expect(page.getByTestId("estado-vacio-hint")).toHaveCount(0);

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(page.locator(".joint-element")).toHaveCount(2);

  // El nudge debe estar visible: 1 proceso + 1 objeto + 0 enlaces, firma legal.
  const nudge = page.getByTestId("estado-vacio-nudge-resultado");
  await expect(nudge).toBeVisible();

  // Al activarlo se crea el enlace de resultado y el nudge desaparece.
  await page.getByTestId("estado-vacio-conectar-resultado").click();
  await expect(page.getByTestId("estado-vacio-nudge-resultado")).toHaveCount(0);
  await expect(page.locator(".joint-link")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});

test("eval minimo: crear proceso + objeto + enlace resultado desde vacio en menos de 60s", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await expect(page.getByTestId("estado-vacio-hint")).toBeVisible();

  // Marca de inicio segun reloj de la pagina.
  const inicio = await page.evaluate(() => performance.now());

  // Paso 1+2: proceso y objeto via toolbar (acciones canonicas directas).
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await expect(page.locator(".joint-element")).toHaveCount(1);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await expect(page.locator(".joint-element")).toHaveCount(2);

  // Paso 3: conectar como resultado via nudge.
  await expect(page.getByTestId("estado-vacio-nudge-resultado")).toBeVisible();
  await page.getByTestId("estado-vacio-conectar-resultado").click();
  await expect(page.locator(".joint-link")).toHaveCount(1);

  const fin = await page.evaluate(() => performance.now());
  const ms = fin - inicio;
  expect(ms, `flujo SD minimo tomo ${ms.toFixed(0)}ms (target <60000)`).toBeLessThan(60_000);

  // Verificacion estructural: dos elementos en canvas, un enlace.
  await expect(page.locator(".joint-element")).toHaveCount(2);
  await expect(page.locator(".joint-link")).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});
