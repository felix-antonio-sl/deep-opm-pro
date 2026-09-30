import { expect, test, type Page } from "@playwright/test";
import { esperarWorkbenchInicial, guardarComoActual } from "./_smoke-helpers";

test("cuando el agente no está disponible, el encargo se bloquea y la edición OPL permanece activa", async ({ page }) => {
  instalarAgenteDeshabilitado(page);
  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.getByLabel("Nombre").fill("Entrada");
  await guardarComoActual(page, "Agente no disponible", "La edición manual sigue activa");

  const input = page.getByTestId("agent-intent-input");
  await expect(input).toBeEnabled();
  await input.fill("Completar el modelo");
  await expect(page.getByTestId("agent-task-status")).toContainText("Agente no disponible");
  await expect(page.getByRole("button", { name: "Iniciar encargo" })).toBeDisabled();

  const token = page.locator('[data-opl-token^="entidad:"]').filter({ hasText: "Entrada" });
  await expect(token).toBeVisible();
  await token.focus();
  await token.press("Enter");
  const editor = page.getByLabel("Renombrar desde OPL");
  await editor.fill("Cliente");
  await editor.press("Enter");
  await expect(page.locator('[data-opl-token^="entidad:"]').filter({ hasText: "Cliente" })).toBeVisible();
});

function instalarAgenteDeshabilitado(page: Page): void {
  page.route("**/__deep-opm/agent/**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === "/__deep-opm/agent/status" && route.request().method() === "GET") {
      await route.fulfill({ json: { available: false, reason: "Servicio de agente desactivado para la prueba", profile: {}, model: "mimo-v2.6-pro" } });
      return;
    }
    if (url.pathname === "/__deep-opm/agent/tasks" && route.request().method() === "GET") {
      await route.fulfill({ json: { tasks: [] } });
      return;
    }
    await route.fulfill({ status: 404, json: { error: "Ruta de agente inesperada en esta prueba" } });
  });
}
