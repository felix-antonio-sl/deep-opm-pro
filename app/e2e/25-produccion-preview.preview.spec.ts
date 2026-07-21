import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { ejecutarComandoPalette, jsonEditor, modeloMarkersCanonicos, svgText } from "./_smoke-helpers";

test("preview productivo carga SPA, exporta PNG y no expone bug capture sin opt-in", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloMarkersCanonicos(), null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();
  await expect(page.locator(".joint-paper svg")).toHaveCount(1);
  await expect(svgText(page, "Agente")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await ejecutarComandoPalette(page, "exportar opd png", "menu-exportar-opd-png");
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^markers-canonicos-sd-\d{4}-\d{2}-\d{2}\.png$/);
  const path = await download.path();
  if (!path) throw new Error("Playwright no entrego path de descarga PNG");
  const bytes = await readFile(path);
  expect([...bytes.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  expect(bytes.byteLength).toBeGreaterThan(1000);

  await expect(page.getByTestId("bug-capture-open")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});
