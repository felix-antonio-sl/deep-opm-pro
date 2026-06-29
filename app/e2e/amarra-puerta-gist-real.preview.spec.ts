// AMARRA in-vivo de la PUERTA con gist REAL — falsación del valor del corte
// "gesto de anclar" con dato real, anclando POR EL GESTO del producto.
//
// Diferencia con la amarra vieja (`amarra-gist-real.preview.spec.ts`): aquélla
// inyectaba el anclaje POR BUNDLE (no había gesto). Ésta ancla una Pieza real de
// gist 14.1.0 desde la superficie «Piezas» del producto — cierra el caveat #2 del
// criterio de muerte ("si nunca se ancla nada en el flujo real").
//
// `.preview.spec.ts` ⇒ EXCLUIDA del smoke/gate (`playwright.config.ts: testIgnore`).
// Re-correr: `bunx playwright test amarra-puerta-gist-real.preview.spec.ts --project=chromium`.
// Lee gist-opm-v0.json de su SSOT con `fs` (no engorda este repo).
import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { esperarWorkbenchInicial } from "./_smoke-helpers";

const GIST_PATH = "/home/felix/projects/gist-opm/bundles/gist-opm-v0.json";
const LIB_ID = "gist-opm-v0";
const LIB_NOMBRE = "gist 14.1.0 — greda OPM (catálogo dockable)";
const PIEZA_ID = "ent-Assignment"; // «Asignación» — pieza real de gist
const RUTA_STORE = "/src/store.ts";
const CAP = "test-results/amarra-puerta-gist-real";

const gistV1 = readFileSync(GIST_PATH, "utf8");
function gistMutado(): string {
  const doc = JSON.parse(gistV1) as { modelo: { entidades: Record<string, { nombre: string }> } };
  doc.modelo.entidades[PIEZA_ID].nombre = "Asignación Revisada";
  return JSON.stringify(doc);
}

interface ModeloApi { id: string; nombre: string; descripcion: string; creadoEn: string; actualizadoEn: string; json: string; revision: number }
interface Backend { mutarBiblioteca(json: string): void }

function instalarBackend(page: Page): Backend {
  const ahora = (): string => new Date().toISOString();
  const modelos = new Map<string, ModeloApi>();
  modelos.set(LIB_ID, { id: LIB_ID, nombre: LIB_NOMBRE, descripcion: "", creadoEn: ahora(), actualizadoEn: ahora(), json: gistV1, revision: 1 });
  let workspace: { modelos: unknown[]; carpetas: unknown[]; recientes: unknown[] } = {
    modelos: [{ id: LIB_ID, carpetaId: null, esBiblioteca: true }], carpetas: [], recientes: [],
  };
  const session = { tenantId: "tenant-amarra-puerta", userId: "user-amarra-puerta" };

  void page.route("**/__deep-opm/session", (route) => route.fulfill({ json: { session } }));
  void page.route("**/__deep-opm/workspace", async (route) => {
    if (route.request().method() === "GET") { await route.fulfill({ json: { indice: workspace } }); return; }
    const body = JSON.parse(route.request().postData() ?? "{}") as { indice?: typeof workspace };
    workspace = body.indice ?? workspace;
    await route.fulfill({ json: { indice: workspace } });
  });
  void page.route("**/__deep-opm/modelos**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname !== "/__deep-opm/modelos") { await route.fallback(); return; }
    if (route.request().method() === "GET") { await route.fulfill({ json: { modelos: [...modelos.values()] } }); return; }
    const body = JSON.parse(route.request().postData() ?? "{}") as { modelo?: ModeloApi };
    const incoming = body.modelo;
    if (!incoming) { await route.fulfill({ status: 400, json: { error: "Modelo persistido inválido" } }); return; }
    const actual = modelos.get(incoming.id);
    modelos.set(incoming.id, { ...incoming, revision: actual ? actual.revision + 1 : 1, actualizadoEn: ahora() });
    await route.fulfill({ json: { modelo: modelos.get(incoming.id) } });
  });
  void page.route("**/__deep-opm/modelos/*", async (route) => {
    const url = new URL(route.request().url());
    const id = decodeURIComponent(url.pathname.split("/").pop() ?? "");
    if (route.request().method() === "GET") {
      const modelo = modelos.get(id);
      await route.fulfill(modelo ? { json: { modelo } } : { status: 404, json: { error: "Modelo no encontrado" } });
      return;
    }
    await route.fallback();
  });

  return {
    mutarBiblioteca(json) {
      const actual = modelos.get(LIB_ID);
      if (!actual) throw new Error("gist no sembrado");
      modelos.set(LIB_ID, { ...actual, json, actualizadoEn: ahora(), revision: actual.revision + 1 });
    },
  };
}

async function abrirPiezas(page: Page): Promise<void> {
  await page.evaluate(async (ruta) => {
    const m = await import(ruta) as { store: { getState: () => { abrirVitrinaEstereotipos: () => void } } };
    m.store.getState().abrirVitrinaEstereotipos();
  }, RUTA_STORE);
  await expect(page.getByTestId("vitrina-estereotipos")).toBeVisible();
}
async function evaluarDrift(page: Page): Promise<void> {
  await page.evaluate(async (ruta) => {
    const m = await import(ruta) as { store: { getState: () => { cargarYEvaluarDrift: () => Promise<void> } } };
    await m.store.getState().cargarYEvaluarDrift();
  }, RUTA_STORE);
}
async function ancladaActual(page: Page): Promise<{ anclado: boolean; drift?: string }> {
  return page.evaluate(async (ruta) => {
    const m = await import(ruta) as { store: { getState: () => { seleccionId: string | null; modelo: { entidades: Record<string, { anclaje?: unknown }> }; driftMap: Record<string, string> } } };
    const s = m.store.getState();
    const id = s.seleccionId;
    if (!id) return { anclado: false };
    return { anclado: !!s.modelo.entidades[id]?.anclaje, drift: s.driftMap[id] };
  }, RUTA_STORE);
}
const badgeDrift = (page: Page) => page.locator('[joint-selector="driftBadge"]');
const markaAmarre = (page: Page) => page.locator('[joint-selector="driftBadgeMark"]');

test.describe("AMARRA — la PUERTA con gist REAL, anclando por el gesto", () => {
  test("anclar una Pieza real de gist por el gesto, mutar gist, y el ⟳ aparece solo", async ({ page }) => {
    const backend = instalarBackend(page);
    await page.goto("/");
    await esperarWorkbenchInicial(page);

    await page.evaluate(async (ruta) => {
      const m = await import(ruta) as { store: { getState: () => { listarModelosGuardados: () => void } } };
      m.store.getState().listarModelosGuardados();
    }, RUTA_STORE);
    await expect.poll(async () => page.evaluate(async ({ ruta, libId }) => {
      const m = await import(ruta) as { store: { getState: () => { indice: { modelos: { id: string; esBiblioteca?: boolean }[] } } } };
      return m.store.getState().indice.modelos.some((x) => x.id === libId && x.esBiblioteca === true);
    }, { ruta: RUTA_STORE, libId: LIB_ID })).toBe(true);

    // Anclar «Asignación» (pieza real de gist) POR EL GESTO.
    await abrirPiezas(page);
    await page.getByTestId(`piezas-fuente-${LIB_ID}`).click();
    await expect(page.getByTestId(`pieza-anclar-${PIEZA_ID}`)).toBeVisible();
    await page.getByTestId(`pieza-anclar-${PIEZA_ID}`).click();
    await expect.poll(async () => (await ancladaActual(page)).anclado).toBe(true);

    // El gesto en sí: la superficie Piezas con gist real (107 objetos, Calcar/Anclar).
    await page.screenshot({ path: `${CAP}/01-superficie-piezas-gist.png` });

    // Al-día con gist real intacto: marca de amarre, sin alarma.
    await evaluarDrift(page);
    expect((await ancladaActual(page)).drift).toBe("sincronizado");
    await expect(markaAmarre(page)).toHaveCount(1);
    await expect(badgeDrift(page)).toHaveCount(0);
    // Cerrar el modal para que el lienzo (y el chip) sean visibles en la captura.
    await page.getByTestId("vitrina-estereotipos").getByRole("button", { name: "Cerrar" }).click();
    await expect(page.getByTestId("vitrina-estereotipos")).toHaveCount(0);
    await page.screenshot({ path: `${CAP}/02-anclada-sincronizada-lienzo.png` });

    // Mutar gist REAL persistido (renombra «Asignación»). El hash congelado no se toca.
    backend.mutarBiblioteca(gistMutado());
    await evaluarDrift(page);

    expect((await ancladaActual(page)).drift).toBe("divergente");
    await expect(markaAmarre(page)).toHaveCount(0);
    await expect(badgeDrift(page)).toHaveCount(1);
    await expect(badgeDrift(page)).toContainText("⟳");
    await expect(page.getByTestId("inspector-anclaje-divergente")).toBeVisible();
    await page.screenshot({ path: `${CAP}/03-gist-mutado-divergente-lienzo.png` });
  });
});
