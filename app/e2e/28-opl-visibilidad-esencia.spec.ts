import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible, ejecutarComandoPalette, restaurarPanelOplSiMinimizado } from "./_smoke-helpers";

/**
 * A7 — Visibilidad de esencia en OPL.
 *
 * El selector "Esencia" en Configuración → OPL controla si las oraciones de
 * clasificación de esencia (p.ej. "Objeto es informacional.") aparecen en el
 * panel OPL. La preferencia se aplica al Guardar (coherente con la cuadrícula
 * del mismo diálogo); Cancelar la descarta.
 */
test("selector de esencia en Configuración filtra oraciones OPL de esencia", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  // Arranque: modelo demo (canvas precargado con pantalla de inicio).
  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  // Crear un objeto; por defecto tendrá esencia informacional y afiliación sistémica.
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Sistema");
  await page.keyboard.press("Escape");

  const panel = page.getByLabel("Panel OPL-ES");
  await restaurarPanelOplSiMinimizado(page);

  // Verificar estado inicial: ambas oraciones de clasificación visibles.
  // Canon L1: objeto por defecto → "Sistema es informacional." + "Sistema es sistémico."
  await expect(panel.getByText("Sistema es informacional.")).toBeVisible();
  await expect(panel.getByText("Sistema es sistémico.")).toBeVisible();

  // --- Paso 0: Cancelar descarta el cambio ---
  await ejecutarComandoPalette(page, "configuracion", "menu-configuracion");
  const dialogoCancel = page.getByTestId("modal-config-grid");
  await expect(dialogoCancel).toBeVisible();
  await dialogoCancel.getByLabel("Visibilidad de esencia en OPL").selectOption("oculta");
  await dialogoCancel.getByRole("button", { name: "Cancelar" }).click();
  await expect(dialogoCancel).toHaveCount(0);
  // Al cancelar, la preferencia NO se aplica: las oraciones siguen visibles.
  await expect(panel.getByText("Sistema es informacional.")).toBeVisible();
  await expect(panel.getByText("Sistema es sistémico.")).toBeVisible();

  // --- Paso 1: cambiar a "Oculta" y Guardar ---
  await ejecutarComandoPalette(page, "configuracion", "menu-configuracion");
  const dialogo = page.getByTestId("modal-config-grid");
  await expect(dialogo).toBeVisible();
  await dialogo.getByLabel("Visibilidad de esencia en OPL").selectOption("oculta");
  await dialogo.getByRole("button", { name: "Guardar" }).click();
  await expect(dialogo).toHaveCount(0);

  // Con esencia oculta las oraciones de clasificación de esencia NO deben aparecer.
  await expect(panel.getByText("Sistema es informacional.")).toHaveCount(0);
  await expect(panel.getByText("Sistema es sistémico.")).toHaveCount(0);

  // --- Paso 2: restaurar a "Siempre" ---
  await ejecutarComandoPalette(page, "configuracion", "menu-configuracion");
  const dialogo2 = page.getByTestId("modal-config-grid");
  await expect(dialogo2).toBeVisible();

  const selectEsencia2 = dialogo2.getByLabel("Visibilidad de esencia en OPL");
  // Verificar que el valor guardado persiste ("oculta").
  await expect(selectEsencia2).toHaveValue("oculta");
  await selectEsencia2.selectOption("siempre");
  await dialogo2.getByRole("button", { name: "Guardar" }).click();
  await expect(dialogo2).toHaveCount(0);

  // Con visibilidad "siempre" las oraciones reaparecen.
  await expect(panel.getByText("Sistema es informacional.")).toBeVisible();
  await expect(panel.getByText("Sistema es sistémico.")).toBeVisible();

  expect(pageErrors).toEqual([]);
});
