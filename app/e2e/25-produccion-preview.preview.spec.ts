import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { ejecutarComandoPalette, jsonEditor, modeloMarkersCanonicos, svgText } from "./_smoke-helpers";

test("preview productivo carga SPA, exporta SVG y no expone bug capture sin opt-in", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloMarkersCanonicos(), null, 2));
  await page.getByRole("button", { name: "Importar" }).click();
  await expect(page.locator(".joint-paper svg")).toHaveCount(1);
  await expect(svgText(page, "Agente")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  // Ronda Codex v2 L5: la exportación SVG se invoca desde el command palette.
  await ejecutarComandoPalette(page, "exportar opd svg", "menu-exportar-svg");
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^markers-canonicos-sd-\d{4}-\d{2}-\d{2}\.svg$/);
  const path = await download.path();
  if (!path) throw new Error("Playwright no entrego path de descarga SVG");
  const svg = await readFile(path, "utf8");
  expect(svg).toContain("<svg");
  expect(svg).toContain("Agente");
  expect(svg).not.toContain("Menú principal");

  await expect(page.getByTestId("bug-capture-open")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});
