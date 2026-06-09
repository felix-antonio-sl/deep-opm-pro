import { expect, test } from "@playwright/test";
import { esperarWorkbenchInicial, ejecutarComandoPalette, restaurarPanelOplSiMinimizado } from "./_smoke-helpers";

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

  // Arranque: modelo vacio sin onboarding.
  await page.goto("/");
  await esperarWorkbenchInicial(page);
  // Deja asentar el bootstrap async (sesión + workspace + modelos) antes de tocar
  // preferencias/OPL: evita timing de render del panel y cualquier residual del
  // load del workspace. El clobber de preferenciasUi por el bootstrap ya está
  // endurecido en el kernel (fusionarPreferenciasBootstrap), esto cubre el
  // settling general de la UI.
  await page.waitForLoadState("networkidle");

  // Crear un objeto; por defecto tendrá esencia informacional y afiliación sistémica.
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Sistema");
  await page.keyboard.press("Escape");

  const panel = page.getByLabel("Panel OPL-ES");
  await restaurarPanelOplSiMinimizado(page);

  // Verificar estado inicial: la oración de clasificación visible.
  // Canon vigente (forma OPCloud): objeto por defecto → una sola oración
  // "Sistema es un objeto informacional y sistémico."
  await expect(panel.getByText("Sistema es un objeto informacional y sistémico.")).toBeVisible();

  // --- Paso 0: Cancelar descarta el cambio ---
  await ejecutarComandoPalette(page, "configuracion", "menu-configuracion");
  const dialogoCancel = page.getByTestId("modal-config-grid");
  await expect(dialogoCancel).toBeVisible();
  await dialogoCancel.getByLabel("Visibilidad de esencia en OPL").selectOption("oculta");
  await dialogoCancel.getByRole("button", { name: "Cancelar" }).click();
  await expect(dialogoCancel).toHaveCount(0);
  // Al cancelar, la preferencia NO se aplica: la oración sigue visible.
  await expect(panel.getByText("Sistema es un objeto informacional y sistémico.")).toBeVisible();

  // --- Paso 1: cambiar a "Oculta" y Guardar ---
  await ejecutarComandoPalette(page, "configuracion", "menu-configuracion");
  const dialogo = page.getByTestId("modal-config-grid");
  await expect(dialogo).toBeVisible();
  await dialogo.getByLabel("Visibilidad de esencia en OPL").selectOption("oculta");
  await dialogo.getByRole("button", { name: "Guardar" }).click();
  await expect(dialogo).toHaveCount(0);

  // Con esencia oculta la oración de clasificación NO debe aparecer.
  await expect(panel.getByText("Sistema es un objeto informacional y sistémico.")).toHaveCount(0);

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

  // Con visibilidad "siempre" la oración reaparece.
  await expect(panel.getByText("Sistema es un objeto informacional y sistémico.")).toBeVisible();

  expect(pageErrors).toEqual([]);
});
