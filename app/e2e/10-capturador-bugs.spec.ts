import { expect, test } from "@playwright/test";

const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  "base64",
);

test("capturador de bugs guarda texto sin screenshots y muestra id referenciable", async ({ page }) => {
  let payload: Record<string, unknown> | null = null;
  await page.route("**/__deep-opm/bug-reports", async (route) => {
    payload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: "BUG-TEST-SIN-SCREENSHOT",
        path: "docs/bugs/BUG-TEST-SIN-SCREENSHOT/report.md",
        directory: "docs/bugs/BUG-TEST-SIN-SCREENSHOT",
        screenshots: 0,
      }),
    });
  });

  await page.goto("/");
  await page.getByLabel("Capturar bug").click();
  const dialog = page.getByRole("dialog", { name: "Capturar bug" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Descripción del bug").fill("El enlace se pierde al reordenar el OPD.");
  await dialog.getByRole("button", { name: "Guardar reporte" }).click();

  await expect(dialog.getByTestId("bug-capture-result")).toContainText("BUG-TEST-SIN-SCREENSHOT");
  expect(payload?.text).toBe("El enlace se pierde al reordenar el OPD.");
  expect(payload?.screenshots).toEqual([]);
  expect((payload?.context as Record<string, unknown>).modeloNombre).toBeTruthy();
});

test("capturador de bugs adjunta uno o mas screenshots al payload", async ({ page }) => {
  let payload: Record<string, unknown> | null = null;
  await page.route("**/__deep-opm/bug-reports", async (route) => {
    payload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: "BUG-TEST-CON-SCREENSHOT",
        path: "docs/bugs/BUG-TEST-CON-SCREENSHOT/report.md",
        directory: "docs/bugs/BUG-TEST-CON-SCREENSHOT",
        screenshots: 1,
      }),
    });
  });

  await page.goto("/");
  await page.getByLabel("Capturar bug").click();
  const dialog = page.getByRole("dialog", { name: "Capturar bug" });
  await dialog.getByLabel("Descripción del bug").fill("El canvas queda cortado en el borde derecho.");
  await dialog.locator('input[type="file"]').setInputFiles({
    name: "captura-canvas.png",
    mimeType: "image/png",
    buffer: PNG_1X1,
  });
  await expect(dialog.getByText("captura-canvas.png")).toBeVisible();
  await dialog.getByRole("button", { name: "Guardar reporte" }).click();

  await expect(dialog.getByTestId("bug-capture-result")).toContainText("BUG-TEST-CON-SCREENSHOT");
  const screenshots = payload?.screenshots as Array<Record<string, string>>;
  expect(screenshots).toHaveLength(1);
  expect(screenshots[0]?.name).toBe("captura-canvas.png");
  expect(screenshots[0]?.dataUrl).toContain("data:image/png;base64,");
});

test("capturador de bugs acepta screenshot pegado directamente", async ({ page }) => {
  let payload: Record<string, unknown> | null = null;
  await page.route("**/__deep-opm/bug-reports", async (route) => {
    payload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: "BUG-TEST-PEGADO",
        path: "docs/bugs/BUG-TEST-PEGADO/report.md",
        directory: "docs/bugs/BUG-TEST-PEGADO",
        screenshots: 1,
      }),
    });
  });

  await page.goto("/");
  await page.getByLabel("Capturar bug").click();
  const dialog = page.getByRole("dialog", { name: "Capturar bug" });
  await dialog.getByLabel("Descripción del bug").fill("Screenshot pegado desde clipboard.");
  await dialog.getByTestId("bug-capture-dialog").evaluate((target, base64) => {
    const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
    const transfer = new DataTransfer();
    transfer.items.add(new File([bytes], "pegado-desde-clipboard.png", { type: "image/png" }));
    target.dispatchEvent(new ClipboardEvent("paste", {
      bubbles: true,
      cancelable: true,
      clipboardData: transfer,
    }));
  }, PNG_1X1.toString("base64"));
  await expect(dialog.getByText("pegado-desde-clipboard.png")).toBeVisible();
  await dialog.getByRole("button", { name: "Guardar reporte" }).click();

  await expect(dialog.getByTestId("bug-capture-result")).toContainText("BUG-TEST-PEGADO");
  const screenshots = payload?.screenshots as Array<Record<string, string>>;
  expect(screenshots).toHaveLength(1);
  expect(screenshots[0]?.name).toBe("pegado-desde-clipboard.png");
});
