/**
 * Smoke ronda 21 L1 — Estado vacio OPM con inicio compacto.
 *
 * Cubre el resultado esperado del informe UI/UX 2026-05-07 §P2 estado vacio:
 *  - el bloque inicio compacto aparece sobre el canvas vacio sin landing page;
 *  - los 3 botones primarios + Asistente estan accesibles;
 *  - el bloque desaparece al existir la primera apariencia (brief §1.5);
 *  - tras dos entidades con firma legal, aparece el nudge "Conectar como
 *    resultado" y al activarlo crea el enlace de resultado canonico;
 *  - eval mínimo: crear proceso + objeto + enlace resultado desde vacio en
 *    menos de 60s (medido con `performance.now()`).
 *
 * El smoke se valida al converger en main; no corre en paralelo con sibling
 * worktrees porque comparte puerto 5173.
 */

import { expect, test } from "@playwright/test";
import {
  cerrarPantallaInicioSiVisible,
  elementoPorTexto,
} from "./_smoke-helpers";

test("estado vacio OPM expone inicio compacto sobre canvas vacio", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  // El bloque vive dentro del canvas-pane, no es overlay full-screen.
  const bloque = page.getByTestId("estado-vacio-opm");
  await expect(bloque).toBeVisible();
  await expect(bloque).toHaveAttribute("aria-label", "Iniciar SD");

  // 3 botones de creacion primaria + 1 secundario asistente.
  await expect(page.getByTestId("estado-vacio-crear-proceso")).toBeVisible();
  await expect(page.getByTestId("estado-vacio-crear-objeto")).toBeVisible();
  await expect(page.getByTestId("estado-vacio-crear-agente-instrumento")).toBeVisible();
  await expect(page.getByTestId("estado-vacio-abrir-asistente")).toBeVisible();

  // El bloque vive dentro del canvas-pane (DISCRETO, no landing page).
  const canvasPane = page.getByTestId("canvas-pane");
  await expect(canvasPane).toContainText("Iniciar SD");

  await page.getByTestId("estado-vacio-abrir-asistente").click();
  const asistente = page.getByRole("dialog", { name: "Asistente nuevo modelo" });
  await expect(asistente).toHaveAttribute("data-ifml-stereotype", "Modal");
  await page.keyboard.press("Escape");
  await expect(asistente).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("empty state desaparece tras crear primera apariencia", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await expect(page.getByTestId("estado-vacio-opm")).toBeVisible();

  // Click "Crear proceso" abre el modal de nombre canonico (sub-ViewContainer
  // existente). Tras confirmar, la primera apariencia existe -> empty state
  // desaparece.
  await page.getByTestId("estado-vacio-crear-proceso").click();
  const modal = page.getByTestId("modal-nombre-cosa");
  await expect(modal).toBeVisible();
  await modal.getByLabel("Nombre").fill("Procesar pedido");
  await modal.getByRole("button", { name: "OK" }).click();
  await expect(modal).toHaveCount(0);

  await expect(page.getByTestId("estado-vacio-opm")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("tras 2 entidades con firma legal aparece nudge 'Conectar como resultado'", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  // Crear proceso desde el bloque empty state.
  await page.getByTestId("estado-vacio-crear-proceso").click();
  const modalProceso = page.getByTestId("modal-nombre-cosa");
  await expect(modalProceso).toBeVisible();
  await modalProceso.getByLabel("Nombre").fill("Procesar");
  await modalProceso.getByRole("button", { name: "OK" }).click();
  await expect(modalProceso).toHaveCount(0);
  // Empty state ya no aparece.
  await expect(page.getByTestId("estado-vacio-opm")).toHaveCount(0);

  // Crear objeto via toolbar (la operacion canonica usada por el resto del
  // smoke set; aprovechamos que la toolbar es estable y no es scope L1).
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  const modalObjeto = page.getByTestId("modal-nombre-cosa");
  if (await modalObjeto.count() > 0) {
    await expect(modalObjeto).toBeVisible();
    await modalObjeto.getByLabel("Nombre").fill("Resultado");
    await modalObjeto.getByRole("button", { name: "OK" }).click();
    await expect(modalObjeto).toHaveCount(0);
  } else {
    await page.getByLabel("Nombre").fill("Resultado");
  }

  // El nudge debe estar visible: 1 proceso + 1 objeto + 0 enlaces, firma legal.
  const nudge = page.getByTestId("estado-vacio-nudge-resultado");
  await expect(nudge).toBeVisible();
  await expect(nudge).toContainText("Procesar");
  await expect(nudge).toContainText("Resultado");

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
  await expect(page.getByTestId("estado-vacio-opm")).toBeVisible();

  // Marca de inicio segun reloj de la pagina.
  const inicio = await page.evaluate(() => performance.now());

  // Paso 1: proceso central via empty state.
  await page.getByTestId("estado-vacio-crear-proceso").click();
  const modalProceso = page.getByTestId("modal-nombre-cosa");
  await expect(modalProceso).toBeVisible();
  await modalProceso.getByLabel("Nombre").fill("Procesar");
  await modalProceso.getByRole("button", { name: "OK" }).click();
  await expect(modalProceso).toHaveCount(0);

  // Paso 2: objeto via toolbar (operacion canonica).
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  const modalObjeto = page.getByTestId("modal-nombre-cosa");
  if (await modalObjeto.count() > 0) {
    await expect(modalObjeto).toBeVisible();
    await modalObjeto.getByLabel("Nombre").fill("Resultado");
    await modalObjeto.getByRole("button", { name: "OK" }).click();
    await expect(modalObjeto).toHaveCount(0);
  } else {
    await page.getByLabel("Nombre").fill("Resultado");
  }

  // Paso 3: conectar como resultado via nudge.
  await expect(page.getByTestId("estado-vacio-nudge-resultado")).toBeVisible();
  await page.getByTestId("estado-vacio-conectar-resultado").click();
  await expect(page.locator(".joint-link")).toHaveCount(1);

  const fin = await page.evaluate(() => performance.now());
  const ms = fin - inicio;
  expect(ms, `flujo SD minimo tomo ${ms.toFixed(0)}ms (target <60000)`).toBeLessThan(60_000);

  // Verificacion estructural: una entidad proceso, una objeto, un enlace
  // tipo resultado.
  const procesar = elementoPorTexto(page, "Procesar");
  const resultado = elementoPorTexto(page, "Resultado");
  await expect(procesar).toHaveCount(1);
  await expect(resultado).toHaveCount(1);

  expect(pageErrors).toEqual([]);
});
