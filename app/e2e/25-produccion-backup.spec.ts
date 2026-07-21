import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import {
  crearModeloNuevoDesdeMenu,
  ejecutarComandoPalette,
  exportadoActual,
  jsonEditor,
  modeloMarkersCanonicos,
  svgText,
  type ExportadoModelo,
} from "./_smoke-helpers";

test("backup JSON descarga archivo, reimporta y conserva el modelo", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloMarkersCanonicos(), null, 2));
  await expect(page.getByTestId("import-preview")).toBeVisible();
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();
  await expect(page.getByTestId("dialogo-abrir-importar")).toHaveCount(0);
  await expect(svgText(page, "Agente")).toBeVisible();

  const exportadoOriginal = await exportadoActual(page);
  const conteosOriginales = conteos(exportadoOriginal);

  const downloadPromise = page.waitForEvent("download");
  // Ronda Codex v2 L5: "Abrir / importar" se invoca desde el command palette.
  await ejecutarComandoPalette(page, "abrir importar", "menu-abrir-importar");
  const dialogo = page.getByTestId("dialogo-abrir-importar");
  await expect(dialogo).toBeVisible();
  if (!(await dialogo.getByTestId("panel-json-abrir-importar").isVisible().catch(() => false))) {
    await dialogo.getByTestId("abrir-importar-json").click();
  }
  await expect(dialogo.getByTestId("panel-json-abrir-importar")).toBeVisible();
  await dialogo.getByRole("button", { name: "Descargar JSON" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^markers-canonicos-\d{4}-\d{2}-\d{2}\.json$/);
  const path = await download.path();
  if (!path) throw new Error("Playwright no entrego path de descarga JSON");
  const backupJson = await readFile(path, "utf8");
  expect(backupJson).toContain("\"formato\": \"deep-opm-pro.modelo.v0\"");
  await dialogo.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(dialogo).toHaveCount(0);

  await crearModeloNuevoDesdeMenu(page);
  await expect(page.locator(".joint-element")).toHaveCount(0);

  await jsonEditor(page).fill(backupJson);
  await expect(page.getByTestId("import-preview")).toContainText("Markers canonicos");
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();
  await expect(page.getByTestId("dialogo-abrir-importar")).toHaveCount(0);
  await expect(svgText(page, "Agente")).toBeVisible();

  const exportadoRestaurado = await exportadoActual(page);
  expect(conteos(exportadoRestaurado)).toEqual(conteosOriginales);
  expect(pageErrors).toEqual([]);
});

function conteos(exportado: ExportadoModelo): { entidades: number; enlaces: number; opds: number; estados: number } {
  return {
    entidades: Object.keys(exportado.modelo.entidades).length,
    enlaces: Object.keys(exportado.modelo.enlaces).length,
    opds: Object.keys(exportado.modelo.opds).length,
    estados: Object.keys(exportado.modelo.estados ?? {}).length,
  };
}
