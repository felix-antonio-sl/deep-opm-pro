import { expect, test, type Page } from "@playwright/test";
import {
  abrirDialogoCargarModelo,
  crearModeloNuevoDesdeMenu,
  elementoPorTexto,
  guardarComoActual,
} from "./_smoke-helpers";

test("persistencia backend-only no escribe payloads OPM en localStorage", async ({ page }) => {
  const backend = instalarBackendPersistenciaMock(page);
  await page.goto("/");

  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  const modalNombreObjeto = page.getByTestId("modal-nombre-cosa");
  if (await modalNombreObjeto.count()) {
    await modalNombreObjeto.getByLabel("Nombre").fill("Objeto backend");
    await modalNombreObjeto.getByRole("button", { name: "OK" }).click();
    await expect(modalNombreObjeto).toHaveCount(0);
  }

  await guardarComoActual(page, "Backend Only E2E", "sin localStorage OPM");
  expect(backend.modelos.size).toBe(1);
  const [guardado] = [...backend.modelos.values()];
  expect(guardado?.revision).toBe(1);

  const storageTrasGuardar = await snapshotLocalStorage(page);
  expect(storageTrasGuardar.opmPayloadKeys).toEqual([]);
  expect(storageTrasGuardar.opmPayloadValues).toEqual([]);

  await crearModeloNuevoDesdeMenu(page);
  const dialogo = await abrirDialogoCargarModelo(page);
  await expect(dialogo.getByTestId("reciente-modelo").filter({ hasText: /Backend Only E2E/ })).toBeVisible();
  await dialogo.getByTestId("reciente-modelo").filter({ hasText: /Backend Only E2E/ }).dblclick();
  await expect(dialogo).toHaveCount(0);
  await expect(elementoPorTexto(page, "Objeto")).toHaveCount(1);

  const storageTrasCargar = await snapshotLocalStorage(page);
  expect(storageTrasCargar.opmPayloadKeys).toEqual([]);
  expect(storageTrasCargar.opmPayloadValues).toEqual([]);
});

function instalarBackendPersistenciaMock(page: Page) {
  const modelos = new Map<string, ModeloApi>();
  let workspace = { modelos: [], carpetas: [], recientes: [] };
  const session = { tenantId: "tenant-e2e-backend-only", userId: "user-e2e-backend-only" };

  page.route("**/__deep-opm/session", async (route) => {
    await route.fulfill({ json: { session } });
  });
  page.route("**/__deep-opm/workspace", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ json: { indice: workspace } });
      return;
    }
    const body = JSON.parse(route.request().postData() ?? "{}") as { indice?: typeof workspace };
    workspace = body.indice ?? workspace;
    await route.fulfill({ json: { indice: workspace } });
  });
  page.route("**/__deep-opm/modelos**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname !== "/__deep-opm/modelos") {
      await route.fallback();
      return;
    }
    const method = route.request().method();
    if (method === "GET") {
      await route.fulfill({ json: { modelos: [...modelos.values()].sort((a, b) => b.actualizadoEn.localeCompare(a.actualizadoEn)) } });
      return;
    }
    const body = JSON.parse(route.request().postData() ?? "{}") as { modelo?: ModeloApi };
    const incoming = body.modelo;
    if (!incoming) {
      await route.fulfill({ status: 400, json: { error: "Modelo persistido invalido" } });
      return;
    }
    const actual = modelos.get(incoming.id);
    if (actual && incoming.revision !== actual.revision) {
      await route.fulfill({ status: 409, json: { error: "Modelo desactualizado; recarga antes de guardar" } });
      return;
    }
    const guardado = { ...incoming, revision: actual ? actual.revision + 1 : 1 };
    modelos.set(guardado.id, guardado);
    await route.fulfill({ json: { modelo: guardado } });
  });
  page.route("**/__deep-opm/modelos/*", async (route) => {
    const url = new URL(route.request().url());
    const id = decodeURIComponent(url.pathname.split("/").pop() ?? "");
    if (route.request().method() === "GET") {
      const modelo = modelos.get(id);
      await route.fulfill(modelo ? { json: { modelo } } : { status: 404, json: { error: "Modelo no encontrado" } });
      return;
    }
    if (route.request().method() === "DELETE") {
      const ok = modelos.delete(id);
      await route.fulfill(ok ? { json: { ok: true } } : { status: 404, json: { error: "Modelo no encontrado" } });
      return;
    }
    await route.fallback();
  });

  return { modelos };
}

async function snapshotLocalStorage(page: Page): Promise<{ opmPayloadKeys: string[]; opmPayloadValues: string[] }> {
  return page.evaluate(() => {
    const entries = Array.from({ length: localStorage.length }, (_, index) => {
      const key = localStorage.key(index) ?? "";
      return [key, localStorage.getItem(key) ?? ""] as const;
    });
    return {
      opmPayloadKeys: entries
        .map(([key]) => key)
        .filter((key) => key.startsWith("deep-opm-pro:persistencia:modelo:") || key.startsWith("deep-opm-pro:version:")),
      opmPayloadValues: entries
        .filter(([, value]) => value.includes("deep-opm-pro.modelo.v0"))
        .map(([key]) => key),
    };
  });
}

interface ModeloApi {
  id: string;
  nombre: string;
  descripcion: string;
  creadoEn: string;
  actualizadoEn: string;
  carpetaId?: string | null;
  json: string;
  revision: number;
}
