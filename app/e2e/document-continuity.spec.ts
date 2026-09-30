import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";
import { abrirDialogoCargarModelo, crearModeloNuevoDesdeMenu, guardarComoActual, irAEspacioModelos } from "./_smoke-helpers";

test("importa continuidad sin alterar ids/OPD suelto y deja recuperar el JSON original", async ({ page }) => {
  page.on("pageerror", (error) => console.error("[document-continuity pageerror]", error));
  instalarBackendPersistenciaMock(page);
  await page.goto("/");
  await expect(page.getByTestId("toolbar-root")).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId("canvas-pane")).toBeVisible();

  const dialog = await abrirDialogoCargarModelo(page);
  await dialog.getByTestId("abrir-importar-json").click();
  const source = legacyDocument();
  const original = `\n${JSON.stringify(source, null, 2)}\n`;
  await dialog.getByTestId("textarea-json").fill(original);
  await expect(dialog.getByTestId("import-preview")).toBeVisible();
  await expect(dialog.getByTestId("import-continuity-notice")).toContainText("Se conservarán 1 OPD(s) suelto(s)");
  await expect(dialog.getByTestId("import-recovery-notice")).toContainText("modelo.campoSinSucesor");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    dialog.getByRole("button", { name: "Descargar original" }).click(),
  ]);
  const downloadedPath = await download.path();
  expect(downloadedPath).not.toBeNull();
  if (!downloadedPath) return;
  expect(await readFile(downloadedPath, "utf8")).toBe(original);

  await dialog.getByRole("button", { name: "Importar y reemplazar pestaña activa" }).click();
  await expect(dialog).toHaveCount(0);
  await guardarComoActual(page, "Continuidad recuperable", "conserva el documento legado");

  await crearModeloNuevoDesdeMenu(page);
  const reopenDialog = await abrirDialogoCargarModelo(page);
  await irAEspacioModelos(reopenDialog);
  await reopenDialog.getByTestId("modelo-fila-cargar").filter({ hasText: "Continuidad recuperable" }).dblclick();
  await expect(reopenDialog).toHaveCount(0);

  const reopened = await page.evaluate(async () => {
    const { store } = await import("/src/store.ts");
    const model = store.getState().modelo;
    return { id: model.id, entityIds: Object.keys(model.entidades), opdIds: Object.keys(model.opds), looseParent: model.opds["opd-loose"]?.padreId };
  });
  expect(reopened).toEqual({
    id: "doc-continuidad-e2e",
    entityIds: ["entity-stable"],
    opdIds: ["opd-root", "opd-loose"],
    looseParent: null,
  });
});

function legacyDocument() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "doc-continuidad-e2e",
      nombre: "Documento legado",
      opdRaizId: "opd-root",
      nextSeq: 2,
      entidades: {
        "entity-stable": { id: "entity-stable", tipo: "objeto", nombre: "Sistema", esencia: "informacional", afiliacion: "sistemica" },
      },
      estados: {},
      enlaces: {},
      opds: {
        "opd-root": {
          id: "opd-root", nombre: "SD", padreId: null,
          apariencias: { "appearance-stable": { id: "appearance-stable", entidadId: "entity-stable", opdId: "opd-root", x: 80, y: 80, width: 160, height: 64 } },
          enlaces: {},
        },
        "opd-loose": { id: "opd-loose", nombre: "Boceto", padreId: null, apariencias: {}, enlaces: {} },
      },
      campoSinSucesor: { evidencia: "preservar textualmente" },
    },
  };
}

function instalarBackendPersistenciaMock(page: Page): void {
  interface ModelRecord { id: string; nombre: string; descripcion: string; json: string; creadoEn: string; actualizadoEn: string; revision: number }
  const models = new Map<string, ModelRecord>();
  let workspace: { modelos: unknown[]; carpetas: unknown[]; recientes: unknown[] } = { modelos: [], carpetas: [], recientes: [] };
  const session = { tenantId: "tenant-continuity-e2e", userId: "user-continuity-e2e" };

  page.route("**/__deep-opm/session", (route) => route.fulfill({ json: { session } }));
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
      const id = decodeURIComponent(url.pathname.split("/").pop() ?? "");
      const model = route.request().method() === "GET" ? models.get(id) : undefined;
      await route.fulfill(model ? { json: { modelo: model } } : { status: 404, json: { error: "No encontrado" } });
      return;
    }
    if (route.request().method() === "GET") {
      await route.fulfill({ json: { modelos: [...models.values()] } });
      return;
    }
    const body = JSON.parse(route.request().postData() ?? "{}") as { modelo?: ModelRecord };
    if (!body.modelo) {
      await route.fulfill({ status: 400, json: { error: "Modelo inválido" } });
      return;
    }
    const old = models.get(body.modelo.id);
    const saved = { ...body.modelo, revision: old ? old.revision + 1 : 1 };
    models.set(saved.id, saved);
    await route.fulfill({ json: { modelo: saved } });
  });
}
