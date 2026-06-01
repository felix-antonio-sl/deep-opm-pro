import { expect, test } from "@playwright/test";
import { esperarWorkbenchInicial } from "./_smoke-helpers";

test("chrome Codex elimina cajas residuales en estado vacio", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await expect(page.getByTestId("breadcrumb-opd")).toHaveText(/modelo\s*·\s*sd/i);
  await expect(page.locator("footer")).toHaveCount(0);

  const inspector = page.getByTestId("inspector-pane");
  await expect(inspector).toBeVisible();
  await expect(inspector.getByTestId("inspector-vacio-placeholder")).toHaveText(
    "Selecciona un elemento.",
  );
  await expect(inspector).not.toContainText("System Diagram");
  await expect(inspector).not.toContainText("Renombrar modelo");
  await expect(inspector.getByTestId("panel-diagnostico")).toHaveCount(0);

  await expect(page.getByTestId("opl-pane").locator("header")).not.toContainText("LIVE");
  await expect(inspector.locator("header").filter({ hasText: "INSPECTOR" })).not.toContainText("LIVE");

  const numeracion = page.getByTestId("panel-opl-toggle-numeracion");
  await expect(numeracion).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(numeracion).toHaveCSS("border-top-style", "none");

  const filtro = page.getByTestId("panel-opl-filtro-toggle");
  await expect(filtro).toHaveAttribute("role", "button");
  await expect(filtro).not.toHaveAttribute("type", "checkbox");
  await expect(filtro).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(filtro).toHaveCSS("border-top-style", "none");

  await expect(page.getByTestId("bug-capture-open")).toHaveCount(0);
  await expect(page.getByTestId("bug-ledger-open")).toHaveCount(0);

  const canvasViewport = page.getByRole("img", { name: "OPD activo" });
  await expect(canvasViewport).toHaveCSS("overflow-x", "auto");
  await expect(canvasViewport).toHaveCSS("overflow-y", "auto");
});

test("command palette contiene comandos de modelo, vista y soporte", async ({ page }) => {
  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();

  await palette.getByRole("combobox").fill("renombrar modelo");
  await expect(palette.getByTestId("command-palette-item-menu-renombrar-modelo")).toBeVisible();

  await palette.getByRole("combobox").fill("capturar bug");
  await expect(palette.getByTestId("command-palette-item-menu-capturar-bug")).toBeVisible();

  await palette.getByRole("combobox").fill("bugs y features");
  await expect(palette.getByTestId("command-palette-item-menu-bug-ledger")).toBeVisible();
});
