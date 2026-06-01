/**
 * Corte Codex producto — Biblioteca dock pausada.
 *
 * La lógica interna queda en el repo, pero la app no debe exponer chrome,
 * atajos ni montaje visual de biblioteca dock por ahora.
 */
import { expect, test } from "@playwright/test";
import { esperarWorkbenchInicial } from "./_smoke-helpers";

test.describe("biblioteca dock pausada", () => {
  test("no aparece en menú principal ni se abre con Ctrl+B", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    await esperarWorkbenchInicial(page);

    // Ronda Codex v2 L5: el menú lateral se retiró; Ctrl/Cmd+K abre el command
    // palette. El dock sigue sin estar expuesto como comando.
    await page.keyboard.press("Control+k");
    const palette = page.getByTestId("command-palette");
    await expect(palette).toBeVisible();
    await expect(palette.getByText("Biblioteca dock", { exact: true })).toHaveCount(0);
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("command-palette")).toHaveCount(0);

    await page.keyboard.press("Control+b");
    await expect(page.getByTestId("biblioteca-dock")).toHaveCount(0);
    await expect(page.getByTestId("biblioteca-dock-pane")).toHaveCount(0);
    await expect(page.getByTestId("tree-pane")).toBeVisible();
    await expect(page.getByTestId("canvas-pane")).toBeVisible();

    expect(pageErrors).toEqual([]);
  });
});
