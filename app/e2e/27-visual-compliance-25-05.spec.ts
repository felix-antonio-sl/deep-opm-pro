import { expect, test } from "@playwright/test";
import { cerrarPantallaInicioSiVisible } from "./_smoke-helpers";

test("chrome Codex elimina cajas residuales en estado vacio", async ({ page }) => {
  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await expect(page.getByTestId("breadcrumb-opd")).toHaveText(/sistema\s*·\s*system diagram/i);
  await expect(page.locator("footer").first()).toContainText("Edición");

  const inspector = page.getByTestId("inspector-pane");
  await expect(inspector).toBeVisible();
  await expect(inspector.getByTestId("inspector-vacio-placeholder")).toHaveText(
    "Selecciona un objeto, proceso o enlace para ver sus propiedades aquí.",
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
  await expect(canvasViewport).toHaveCSS("overflow-x", "hidden");
  await expect(canvasViewport).toHaveCSS("overflow-y", "hidden");
});

test("command palette contiene comandos de modelo, vista y soporte sin FABs", async ({ page }) => {
  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);

  await page.getByTestId("toolbar-menu").click();
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();

  await palette.getByRole("combobox").fill("renombrar modelo");
  await expect(palette.getByTestId("command-palette-item-menu-renombrar-modelo")).toBeVisible();

  await palette.getByRole("combobox").fill("capturar bug");
  await expect(palette.getByTestId("command-palette-item-menu-capturar-bug")).toBeVisible();

  await palette.getByRole("combobox").fill("bugs y features");
  await expect(palette.getByTestId("command-palette-item-menu-bug-ledger")).toBeVisible();
});
