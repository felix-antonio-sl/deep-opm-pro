import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { chromium } from "@playwright/test";
import { esperarWorkbenchInicial } from "./_smoke-helpers";

test("reabre desde IndexedDB tras cerrar el navegador y dejar inaccesible la API", async () => {
  const profile = await mkdtemp(join(tmpdir(), "opforja-offline-e2e-"));
  let context: import("@playwright/test").BrowserContext | null = null;
  const baseUrl = `http://127.0.0.1:${process.env.PW_PORT ?? "5173"}/`;
  try {
    context = await chromium.launchPersistentContext(profile, { headless: true, viewport: { width: 1440, height: 1000 } });
    let page = context.pages()[0] ?? await context.newPage();
    instalarBackend(context, () => true);
    await page.goto(baseUrl);
    await esperarWorkbenchInicial(page);
    await expect.poll(() => page.evaluate(async () => {
      const { getDocumentLocalIdentity } = await import("/src/persistencia/backend.ts");
      return getDocumentLocalIdentity().status;
    })).toBe("authenticated");

    await page.evaluate(async () => {
      const { store } = await import("/src/store.ts");
      const state = store.getState();
      store.setState({
        modelo: { ...state.modelo, nombre: "Borrador recuperado sin conexión" },
        dirty: true,
        dirtyModelo: true,
      });
    });
    const saveStatus = page.locator('button[aria-label^="Guardado del documento:"]');
    await expect(saveStatus).toContainText("Sin guardar aquí");
    await saveStatus.click();
    await page.getByRole("button", { name: "Guardar aquí", exact: true }).click();
    await expect(page.locator('button[aria-label^="Guardado del documento:"]')).toContainText("Guardado aquí");
    const beforeRestart = await page.evaluate(async () => {
      const { getLocalDocumentRepository } = await import("/src/persistencia/localRepository.ts");
      const { getDocumentLocalIdentity } = await import("/src/persistencia/backend.ts");
      const identity = getDocumentLocalIdentity();
      if (identity.status !== "authenticated") return null;
      const records = await getLocalDocumentRepository().listDocuments(identity.identity);
      return records.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]?.snapshotJson ?? null;
    });
    expect(beforeRestart).not.toBeNull();
    expect(beforeRestart).toContain("Borrador recuperado sin conexión");

    await context.close();
    context = await chromium.launchPersistentContext(profile, { headless: true, viewport: { width: 1440, height: 1000 } });
    page = context.pages()[0] ?? await context.newPage();
    instalarBackend(context, () => false);
    await page.goto(baseUrl);
    await esperarWorkbenchInicial(page);
    await expect.poll(() => page.evaluate(async () => {
      const { store } = await import("/src/store.ts");
      return store.getState().modelo.nombre;
    })).toBe("Borrador recuperado sin conexión");
    await expect.poll(() => page.evaluate(async () => {
      const { getDocumentLocalIdentity } = await import("/src/persistencia/backend.ts");
      return getDocumentLocalIdentity().status;
    })).toBe("offline");
    await expect(page.locator('button[aria-label^="Guardado del documento:"]')).toContainText("Guardado aquí");
  } finally {
    await context?.close();
    await rm(profile, { recursive: true, force: true });
  }
});

function instalarBackend(context: import("@playwright/test").BrowserContext, online: () => boolean): void {
  const session = { tenantId: "tenant-offline-e2e", userId: "user-offline-e2e" };
  context.route("**/__deep-opm/**", async (route) => {
    if (!online()) {
      await route.abort("failed");
      return;
    }
    const path = new URL(route.request().url()).pathname;
    if (path === "/__deep-opm/session") {
      await route.fulfill({ json: { session } });
      return;
    }
    if (path === "/__deep-opm/workspace") {
      await route.fulfill({ json: { indice: { modelos: [], carpetas: [], recientes: [] } } });
      return;
    }
    if (path === "/__deep-opm/modelos") {
      await route.fulfill({ json: { modelos: [] } });
      return;
    }
    await route.fallback();
  });
}
