import { expect, test } from "@playwright/test";

const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  "base64",
);

test("capturador de bugs guarda texto sin screenshots y muestra id referenciable", async ({ page }) => {
  let payload: Record<string, unknown> | null = null;
  await instalarClipboardMock(page);
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
  await abrirCapturadorDesdePalette(page);
  const dialog = page.getByRole("dialog", { name: "Capturar bug" });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Descripción del bug").fill("El enlace se pierde al reordenar el OPD.");
  await dialog.getByRole("button", { name: "Guardar reporte" }).click();

  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("dialog", { name: "Capturar bug" })).toHaveCount(0);
  await expectClipboard(page, "BUG-TEST-SIN-SCREENSHOT");
  expect(payload?.text).toBe("El enlace se pierde al reordenar el OPD.");
  expect(payload?.screenshots).toEqual([]);
  expect((payload?.context as Record<string, unknown>).modeloNombre).toBeTruthy();
});

test("capturador de bugs abre con Ctrl+Alt+B", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Control+Alt+B");
  await expect(page.getByRole("dialog", { name: "Capturar bug" })).toBeVisible();
});

test("capturador de bugs expone accesos directos visibles", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("bug-capture-open")).toBeVisible();
  await expect(page.getByTestId("bug-ledger-open")).toBeVisible();

  await page.getByTestId("bug-capture-open").click();
  await expect(page.getByRole("dialog", { name: "Capturar bug" })).toBeVisible();
});

test("capturador de bugs muestra lista activa e historica desde el sidecar", async ({ page }) => {
  await page.route("**/__deep-opm/bug-reports", async (route) => {
    if (route.request().method() !== "GET") return route.fallback();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        active: [{
          id: "BUG-20260523T185803Z-a0d7bc",
          scope: "Activo",
          type: "Feat",
          status: "Resuelto",
          resolution: "Visible en UI.",
          createdAt: "2026-05-23T18:58:03.717Z",
          reportPath: "docs/bugs/BUG-20260523T185803Z-a0d7bc/report.md",
          text: "que exista una lista de los bugs y su estado para no repetirnos",
          modelName: "HODOM",
          opdName: "SD1",
          screenshots: 0,
          note: "",
        }],
        history: [{
          id: "BUG-20260507T165507Z-19b234",
          scope: "Histórico",
          type: "Bug",
          status: "Resuelto",
          resolution: "fix(ui): aclara creacion continua",
          createdAt: "2026-05-07T16:55:07.000Z",
          reportPath: "docs/bugs/archive/2026-05/BUG-20260507T165507Z-19b234/report.md",
          text: "para que son las funciones dentro del círculo rojo?",
          modelName: "Diagnostico Clinico",
          opdName: "SD",
          screenshots: 1,
          note: "",
        }],
        counts: { active: 1, history: 1 },
      }),
    });
  });

  await page.goto("/");
  await abrirLedgerDesdePalette(page);
  const dialog = page.getByRole("dialog", { name: "Bugs y features" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("BUG-20260523T185803Z-a0d7bc");
  await expect(dialog).toContainText("Visible en UI.");

  await dialog.getByRole("button", { name: /Histórico/ }).click();
  await expect(dialog).toContainText("BUG-20260507T165507Z-19b234");
  await expect(dialog).toContainText("fix(ui): aclara creacion continua");
});

test("capturador de bugs adjunta uno o mas screenshots al payload", async ({ page }) => {
  let payload: Record<string, unknown> | null = null;
  await instalarClipboardMock(page);
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
  await abrirCapturadorDesdePalette(page);
  const dialog = page.getByRole("dialog", { name: "Capturar bug" });
  await dialog.getByLabel("Descripción del bug").fill("El canvas queda cortado en el borde derecho.");
  await dialog.locator('input[type="file"]').setInputFiles({
    name: "captura-canvas.png",
    mimeType: "image/png",
    buffer: PNG_1X1,
  });
  await expect(dialog.getByText("captura-canvas.png")).toBeVisible();
  await dialog.getByRole("button", { name: "Guardar reporte" }).click();

  await expect(dialog).toHaveCount(0);
  await expectClipboard(page, "BUG-TEST-CON-SCREENSHOT");
  const screenshots = payload?.screenshots as Array<Record<string, string>>;
  expect(screenshots).toHaveLength(1);
  expect(screenshots[0]?.name).toBe("captura-canvas.png");
  expect(screenshots[0]?.dataUrl).toContain("data:image/png;base64,");
});

test("capturador de bugs acepta screenshot pegado directamente", async ({ page }) => {
  let payload: Record<string, unknown> | null = null;
  await instalarClipboardMock(page);
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
  await abrirCapturadorDesdePalette(page);
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

  await expect(dialog).toHaveCount(0);
  await expectClipboard(page, "BUG-TEST-PEGADO");
  const screenshots = payload?.screenshots as Array<Record<string, string>>;
  expect(screenshots).toHaveLength(1);
  expect(screenshots[0]?.name).toBe("pegado-desde-clipboard.png");
});

test("capturador de bugs degrada cuando el endpoint no existe", async ({ page }) => {
  await page.route("**/__deep-opm/bug-reports", async (route) => {
    await route.fulfill({
      status: 501,
      contentType: "text/html",
      body: "Unsupported method",
    });
  });

  await page.goto("/");
  await abrirCapturadorDesdePalette(page);
  const dialog = page.getByRole("dialog", { name: "Capturar bug" });
  await dialog.getByLabel("Descripción del bug").fill("Smoke de hosting estatico sin middleware local.");
  await dialog.getByRole("button", { name: "Guardar reporte" }).click();

  await expect(dialog.getByRole("alert")).toContainText("no disponible en despliegue estatico");
});

async function instalarClipboardMock(page: import("@playwright/test").Page): Promise<void> {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as unknown as { __deepOpmClipboard?: string }).__deepOpmClipboard = text;
        },
      },
    });
  });
}

async function expectClipboard(page: import("@playwright/test").Page, expected: string): Promise<void> {
  await expect.poll(() => page.evaluate(() => (window as unknown as { __deepOpmClipboard?: string }).__deepOpmClipboard)).toBe(expected);
}

async function abrirCapturadorDesdePalette(page: import("@playwright/test").Page): Promise<void> {
  await page.getByTestId("toolbar-menu").click();
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").fill("capturar bug");
  await palette.getByTestId("command-palette-item-menu-capturar-bug").click();
}

async function abrirLedgerDesdePalette(page: import("@playwright/test").Page): Promise<void> {
  await page.getByTestId("toolbar-menu").click();
  const palette = page.getByTestId("command-palette");
  await expect(palette).toBeVisible();
  await palette.getByRole("combobox").fill("bugs y features");
  await palette.getByTestId("command-palette-item-menu-bug-ledger").click();
}
