/**
 * Smoke E2E ronda 17 L2 — Modo simulación conceptual (Beta2).
 *
 * Cubre el slice mínimo del brief r17-L2 §6:
 *   - Botón "Simulación" (cluster Validar) entra al modo.
 *   - BarraSimulacion reemplaza la Toolbar de edición (sin botón "Objeto").
 *   - Paso ejecuta el siguiente proceso del plan y avanza el contador.
 *   - Correr ejecuta todos los pasos restantes; queda Completado.
 *   - Reiniciar vuelve al paso 1/N.
 *   - Salir vuelve a la Toolbar de edición.
 *
 * Decisión Beta2-min documentada: marca de proceso activo es **textual**
 * en BarraSimulacion (no overlay sobre canvas JointJS).
 */
import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible } from "./_smoke-helpers";

test("modo simulación: entrar, paso, correr, reiniciar, salir", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  // Construir un modelo con 2 procesos para tener plan no vacío.
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Recibir");
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Proceso", exact: true }).click();
  await page.getByLabel("Nombre").fill("Atender");
  await page.keyboard.press("Enter");

  // Toolbar de edición presente, BarraSimulacion no.
  await expect(page.getByTestId("toolbar-root")).toBeVisible();
  await expect(page.getByTestId("barra-simulacion")).toHaveCount(0);

  // Entrar al modo simulación.
  await page.getByTestId("toolbar-simulacion").click();
  await expect(page.getByTestId("barra-simulacion")).toBeVisible();
  // Toolbar de edición desaparece (BarraSimulacion la reemplaza).
  await expect(page.getByTestId("toolbar-root")).toHaveCount(0);
  // No hay botón "Objeto" disponible en modo simulación (canvas read-only).
  await expect(page.getByRole("button", { name: "Objeto", exact: true })).toHaveCount(0);

  // Progreso inicial: Paso 1/2 con un proceso activo (orden depende de Y).
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText(/Paso\s+1\/2/);
  const primeraVez = page.getByTestId("barra-simulacion-proceso-activo");
  await expect(primeraVez).toContainText(/Recibir|Atender/);
  const primerProceso = (await primeraVez.textContent())?.replace(/^▶\s*/, "").trim() ?? "";

  // Ejecutar Paso → avanza a Paso 2/2 con el OTRO proceso activo.
  await page.getByTestId("barra-simulacion-paso").click();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText(/Paso\s+2\/2/);
  const segundo = primerProceso === "Recibir" ? "Atender" : "Recibir";
  await expect(page.getByTestId("barra-simulacion-proceso-activo")).toContainText(segundo);
  await expect(page.getByTestId("barra-simulacion-trace")).toBeVisible();

  // Correr → completa los pasos restantes.
  await page.getByTestId("barra-simulacion-correr").click();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText(/Completado\s+·\s+2\/2/);
  // Paso queda deshabilitado en completado.
  await expect(page.getByTestId("barra-simulacion-paso")).toBeDisabled();

  // Reiniciar → vuelve a Paso 1/2.
  await page.getByTestId("barra-simulacion-reiniciar").click();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText(/Paso\s+1\/2/);
  await expect(page.getByTestId("barra-simulacion-paso")).toBeEnabled();

  // Salir → vuelve a Toolbar de edición.
  await page.getByTestId("barra-simulacion-salir").click();
  await expect(page.getByTestId("barra-simulacion")).toHaveCount(0);
  await expect(page.getByTestId("toolbar-root")).toBeVisible();
  await expect(page.getByRole("button", { name: "Objeto", exact: true })).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("modo simulación: OPD sin procesos muestra mensaje y controles deshabilitados", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await page.getByTestId("toolbar-simulacion").click();
  await expect(page.getByTestId("barra-simulacion")).toBeVisible();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText("Sin procesos en este OPD");
  await expect(page.getByTestId("barra-simulacion-paso")).toBeDisabled();
  await expect(page.getByTestId("barra-simulacion-correr")).toBeDisabled();

  await page.getByTestId("barra-simulacion-salir").click();
  await expect(page.getByTestId("toolbar-root")).toBeVisible();

  expect(pageErrors).toEqual([]);
});
