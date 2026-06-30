// AMARRA in-vivo del GRANO DE PIEZA (C4) con gist REAL — falsa el VALOR de C4 con dato real.
//
// El Centinela legacy mide drift a grano BIBLIOTECA: mutar CUALQUIER pieza de gist hacía
// `divergente` a TODA cosa anclada a esa biblioteca (ruido «toda la biblioteca cambió»). C4 baja el
// grano a la VECINDAD RADIO-1 de la Pieza. Esta amarra lo prueba EN VIVO, por el gesto del producto:
//
//   1. ANCLAR «Asignación» (ent-Assignment, pieza real de gist) POR EL GESTO → el producto congela
//      `frozenAtPieza` (firma de la vecindad de Assignment), además del `frozenAtHash` de biblioteca.
//   2. gist intacto ⇒ al-día: marca de amarre en el lienzo, sin glifo de alarma.
//   3. MUTAR «Cuenta» (ent-Account), una pieza AJENA NO anclada y fuera de la vecindad de Assignment
//      (gist: Assignment tiene 0 estados y 1 enlace incidente —a ent-TemporalRelation—, ninguno toca
//      a Account) ⇒ el marcador ⟳ NO aparece: sigue `sincronizado`. ESTA es la falsación de C4: con
//      el grano legacy esta misma mutación habría encendido el ⟳. El ruido se apagó.
//   4. ANTI-TAUTOLOGÍA: mutar «Asignación» misma (la pieza anclada) ⇒ AHORA sí `divergente` (⟳). El
//      centinela no está muerto: discrimina la vecindad propia de la ajena.
//
// `.preview.spec.ts` ⇒ EXCLUIDA del smoke/gate (`playwright.config.ts: testIgnore`).
// Re-correr: `bunx playwright test amarra-pieza-grano.preview.spec.ts --project=chromium`.
// Lee gist-opm-v0.json de su SSOT con `fs` (no engorda este repo).
import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { esperarWorkbenchInicial } from "./_smoke-helpers";

const GIST_PATH = "/home/felix/projects/gist-opm/bundles/gist-opm-v0.json";
const LIB_ID = "gist-opm-v0";
const LIB_NOMBRE = "gist 14.1.0 — greda OPM (catálogo dockable)";
const PIEZA_ANCLADA = "ent-Assignment"; // «Asignación» — la pieza que anclamos
const PIEZA_AJENA = "ent-Account"; // «Cuenta» — pieza NO anclada, fuera de la vecindad de Assignment
const RUTA_STORE = "/src/store.ts";
const CAP = "test-results/amarra-pieza-grano";

const gistV1 = readFileSync(GIST_PATH, "utf8");
function gistConRename(piezaId: string, nuevoNombre: string): string {
  const doc = JSON.parse(gistV1) as { modelo: { entidades: Record<string, { nombre: string }> } };
  doc.modelo.entidades[piezaId].nombre = nuevoNombre;
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
  const session = { tenantId: "tenant-amarra-pieza", userId: "user-amarra-pieza" };

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
async function ancladaActual(page: Page): Promise<{ anclado: boolean; drift?: string; granoPieza?: boolean }> {
  return page.evaluate(async (ruta) => {
    const m = await import(ruta) as { store: { getState: () => { seleccionId: string | null; modelo: { entidades: Record<string, { anclaje?: { frozenAtPieza?: string } }> }; driftMap: Record<string, string> } } };
    const s = m.store.getState();
    const id = s.seleccionId;
    if (!id) return { anclado: false };
    const anclaje = s.modelo.entidades[id]?.anclaje;
    return { anclado: !!anclaje, drift: s.driftMap[id], granoPieza: anclaje?.frozenAtPieza !== undefined };
  }, RUTA_STORE);
}
const badgeDrift = (page: Page) => page.locator('[joint-selector="driftBadge"]');
const markaAmarre = (page: Page) => page.locator('[joint-selector="driftBadgeMark"]');

test.describe("AMARRA — grano de PIEZA (C4) con gist REAL: el ruido de biblioteca se apaga", () => {
  test("anclar una Pieza por el gesto; mutar una pieza AJENA NO enciende el ⟳; mutar la propia SÍ", async ({ page }) => {
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

    // 1. Anclar «Asignación» POR EL GESTO. El gesto congela frozenAtHash (biblioteca) Y frozenAtPieza
    //    (vecindad RADIO-1) ⇒ el anclaje nace a grano pieza.
    await abrirPiezas(page);
    await page.getByTestId(`piezas-fuente-${LIB_ID}`).click();
    await expect(page.getByTestId(`pieza-anclar-${PIEZA_ANCLADA}`)).toBeVisible();
    await page.getByTestId(`pieza-anclar-${PIEZA_ANCLADA}`).click();
    await expect.poll(async () => (await ancladaActual(page)).anclado).toBe(true);
    // El gesto congeló el grano pieza (sin esto, C4 no estaría activo y el test sería vacuo).
    expect((await ancladaActual(page)).granoPieza).toBe(true);
    await page.screenshot({ path: `${CAP}/01-superficie-piezas-gist.png` });

    // 2. gist intacto ⇒ al-día: marca de amarre, sin alarma.
    await evaluarDrift(page);
    expect((await ancladaActual(page)).drift).toBe("sincronizado");
    await expect(markaAmarre(page)).toHaveCount(1);
    await expect(badgeDrift(page)).toHaveCount(0);
    await page.getByTestId("vitrina-estereotipos").getByRole("button", { name: "Cerrar" }).click();
    await expect(page.getByTestId("vitrina-estereotipos")).toHaveCount(0);
    await page.screenshot({ path: `${CAP}/02-anclada-sincronizada-lienzo.png` });

    // 3. LA FALSACIÓN DE C4: mutar «Cuenta» (ent-Account), pieza AJENA fuera de la vecindad de
    //    Assignment. El marcador ⟳ NO aparece: sigue sincronizado. Con el grano legacy de biblioteca,
    //    esta misma mutación habría encendido el aviso (toda la biblioteca cambió).
    backend.mutarBiblioteca(gistConRename(PIEZA_AJENA, "Cuenta Revisada"));
    await evaluarDrift(page);
    expect((await ancladaActual(page)).drift).toBe("sincronizado"); // ← el ruido se apagó
    await expect(markaAmarre(page)).toHaveCount(1);
    await expect(badgeDrift(page)).toHaveCount(0);
    await page.screenshot({ path: `${CAP}/03-ajena-mutada-sigue-sincronizada-lienzo.png` });

    // 4. ANTI-TAUTOLOGÍA: mutar «Asignación» misma (la pieza anclada, su vecindad) ⇒ divergente. El
    //    centinela vive: discrimina la vecindad propia de la ajena. (Se mantiene la mutación de Cuenta
    //    para probar que el aviso lo enciende la vecindad propia, no el acumulado de mutaciones.)
    const doc = JSON.parse(gistConRename(PIEZA_AJENA, "Cuenta Revisada")) as { modelo: { entidades: Record<string, { nombre: string }> } };
    doc.modelo.entidades[PIEZA_ANCLADA].nombre = "Asignación Revisada";
    backend.mutarBiblioteca(JSON.stringify(doc));
    await evaluarDrift(page);
    expect((await ancladaActual(page)).drift).toBe("divergente");
    await expect(markaAmarre(page)).toHaveCount(0);
    await expect(badgeDrift(page)).toHaveCount(1);
    await expect(badgeDrift(page)).toContainText("⟳");
    await expect(page.getByTestId("inspector-anclaje-divergente")).toBeVisible();
    await page.screenshot({ path: `${CAP}/04-propia-mutada-divergente-lienzo.png` });
  });
});
