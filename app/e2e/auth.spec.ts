import { expect, test } from "@playwright/test";
import { ejecutarComandoPalette } from "./_smoke-helpers";

// Auth v1 (docs/specs/auth-identidad-v1.md §6): lane dedicado contra el dev
// server con MODEL_REQUIRE_AUTH=true (cuenta sembrada CUENTA_DEV_AUTH en
// devModelPersistence.ts). Login obligatorio: sin sesión no hay workbench.
const EMAIL = "dev@opforja.local";
const PASSWORD = "opforja-dev-password";

async function loginUi(page: import("@playwright/test").Page): Promise<void> {
  await page.getByTestId("login-email").fill(EMAIL);
  await page.getByTestId("login-password").fill(PASSWORD);
  await page.getByTestId("login-submit").click();
}

test("sin sesión la app monta PantallaLogin, no el workbench", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("pantalla-login")).toBeVisible();
  await expect(page.getByTestId("canvas-pane")).toHaveCount(0);
});

test("credenciales inválidas muestran error uniforme y no entran", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("login-email").fill(EMAIL);
  await page.getByTestId("login-password").fill("incorrecta");
  await page.getByTestId("login-submit").click();
  await expect(page.getByTestId("login-error")).toContainText("Credenciales inválidas");
  await expect(page.getByTestId("pantalla-login")).toBeVisible();
});

test("login correcto entra al workbench con sesión API viva; logout por paleta vuelve al login", async ({ page }) => {
  await page.goto("/");
  await loginUi(page);

  await expect(page.getByTestId("canvas-pane")).toBeVisible();
  const status = await page.evaluate(async () => (await fetch("/__deep-opm/session")).status);
  expect(status).toBe(200);

  await ejecutarComandoPalette(page, "cerrar sesión", "menu-auth-cerrar-sesion");
  await expect(page.getByTestId("pantalla-login")).toBeVisible();
  const statusTrasLogout = await page.evaluate(async () => (await fetch("/__deep-opm/session")).status);
  expect(statusTrasLogout).toBe(401);
});

test("la cookie sobrevive recarga (sesión durable)", async ({ page }) => {
  await page.goto("/");
  await loginUi(page);
  await expect(page.getByTestId("canvas-pane")).toBeVisible();
  await page.reload();
  await expect(page.getByTestId("canvas-pane")).toBeVisible();
  await expect(page.getByTestId("pantalla-login")).toHaveCount(0);
});
