import { expect, test, type BrowserContext } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { crearModeloNuevoDesdeMenu, esperarWorkbenchInicial, guardarComoActual } from "./_smoke-helpers";

// The reader URL is a bearer capability. Keep it out of traces, screenshots,
// and test logs even when an assertion fails.
test.use({ trace: "off", screenshot: "off" });

const EMAIL = "dev@opforja.local";
const PASSWORD = "opforja-dev-password";

test("crea una revisión compartida desde el editor y el autor puede revocarla", async ({ page, browser }) => {
  let documentId: string | null = null;
  let readerContext: BrowserContext | null = null;

  try {
    await page.goto("/");
    await page.getByTestId("login-email").fill(EMAIL);
    await page.getByTestId("login-password").fill(PASSWORD);
    await page.getByTestId("login-submit").click();
    await esperarWorkbenchInicial(page);

    await crearModeloNuevoDesdeMenu(page);
    const modelName = `Revisión desde UI ${randomUUID().slice(0, 8)}`;
    await guardarComoActual(page, modelName);
    documentId = await page.evaluate(async () => {
      const devModulePath: string = "/src/store.ts";
      const { store } = await import(devModulePath) as typeof import("../src/store");
      return store.getState().modeloPersistidoId;
    });
    expect(documentId).not.toBeNull();
    if (!documentId) throw new Error("El modelo no quedó guardado antes de compartirlo.");

    await page.getByRole("button", { name: "Compartir revisión…" }).click();
    const dialog = page.getByRole("dialog", { name: "Compartir revisión" });
    await expect(dialog.getByRole("heading", { name: "Revisión compartida" })).toBeVisible();
    await dialog.getByRole("button", { name: "Compartir revisión" }).click();
    await expect(dialog.getByRole("status")).toContainText("compartida");

    const ownerOrigin = new URL(page.url()).origin;
    const shareUrl = await dialog.getByLabel("Enlace de la revisión").inputValue();
    const shareLocation = new URL(shareUrl);
    expect(shareLocation.origin).toBe(ownerOrigin);
    expect(shareLocation.pathname.startsWith("/revision/")).toBe(true);

    readerContext = await browser.newContext({ baseURL: ownerOrigin });
    const reader = await readerContext.newPage();
    await reader.goto(`${shareLocation.pathname}${shareLocation.search}`);
    await expect(reader.getByRole("heading", { name: modelName, exact: true })).toBeVisible();
    await expect(reader.getByRole("heading", { name: "Diagramas" })).toBeVisible();
    await expect(reader.getByRole("img", { name: /Diagrama OPM/ })).toBeVisible();
    await expect(reader.getByTestId("pantalla-login")).toHaveCount(0);

    const createdLinks = dialog.locator('section[aria-label="Enlaces creados"]');
    const createdShare = createdLinks.locator("li").filter({ hasText: modelName });
    await expect(createdShare.getByRole("button", { name: "Revocar" })).toBeVisible();
    await createdShare.getByRole("button", { name: "Revocar" }).click();
    await expect(dialog.getByRole("status")).toHaveText("Enlace revocado.");
    await expect(createdShare.getByText("Revocado", { exact: true })).toBeVisible();

    await reader.reload();
    await expect(reader.getByRole("heading", { name: "Revisión no disponible" })).toBeVisible();
  } finally {
    if (documentId) await removeTestDocument(page, documentId);
    await readerContext?.close();
  }
});

async function removeTestDocument(page: import("@playwright/test").Page, documentId: string): Promise<void> {
  await page.evaluate(async (targetDocumentId) => {
    const sessionResponse = await fetch("/__deep-opm/session");
    if (!sessionResponse.ok) return;
    const { session } = await sessionResponse.json() as { session: { tenantId: string; userId: string } };
    const identity = `${encodeURIComponent(session.tenantId)}:${encodeURIComponent(session.userId)}`;
    const headers = { "x-opforja-session-identity": identity };
    const sharesResponse = await fetch(`/__deep-opm/review/grants?documentId=${encodeURIComponent(targetDocumentId)}`, { headers });
    if (sharesResponse.ok) {
      const { shares } = await sharesResponse.json() as { shares: { id: string; revokedAt: string | null }[] };
      for (const share of shares) {
        if (share.revokedAt) continue;
        await fetch(`/__deep-opm/review/grants/${encodeURIComponent(share.id)}?documentId=${encodeURIComponent(targetDocumentId)}`, {
          method: "DELETE", headers,
        });
      }
    }
    await fetch(`/__deep-opm/modelos/${encodeURIComponent(targetDocumentId)}`, { method: "DELETE", headers });
  }, documentId).catch(() => undefined);
}
