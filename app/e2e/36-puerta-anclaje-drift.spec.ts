// La PUERTA × el Centinela — e2e INTEGRAL del corte "gesto de anclar".
//
// Cruza las dos líneas que ningún e2e de línea pudo cruzar solo: el gesto de
// fundación (L-Piezas: Anclar una Pieza desde una biblioteca) y el chip de 3
// estados (B4) gobernado por el Centinela. Falsea el VALOR end-to-end:
//
//   1. el usuario ANCLA una Pieza POR EL GESTO del producto (no por bundle
//      inyectado, como hacían las amarras viejas) → el producto congela el
//      frozenAtHash de la biblioteca viva v1;
//   2. con la biblioteca intacta, la cosa anclada se DECLARA al-día (marca de
//      amarre en el lienzo, sin glifo de alarma) — este es el ANCLA adversarial:
//      la MISMA cosa, con el MISMO hash que el gesto congeló, está sincronizada;
//   3. se MUTA la biblioteca persistida → el aviso ⟳ aparece SOLO, sin tocar el
//      hash. La transición sincronizado→divergente prueba por construcción que
//      el aviso lo enciende la mutación, no el test.
//
// Sin el paso de mutación, el caso se queda en sincronizado (anti-tautológico,
// mismo principio que 34-centinela-drift). El frozenAtHash NO se hardcodea: lo
// computa el gesto Anclar contra la biblioteca viva.
import { expect, test, type Page } from "@playwright/test";
import { esperarWorkbenchInicial } from "./_smoke-helpers";

const LIB_ID = "gist-lib-integral-e2e";
const LIB_NOMBRE = "Biblioteca gist (integral e2e)";
const PIEZA_ID = "ent-Recurso";
const RUTA_STORE = "/src/store.ts";

interface ModeloApi {
  id: string;
  nombre: string;
  descripcion: string;
  creadoEn: string;
  actualizadoEn: string;
  json: string;
  revision: number;
}

// Biblioteca de Piezas. v2 = mutación SEMÁNTICA de v1: renombra la Pieza anclada.
// La firma del Centinela es semántica (excluye layout), así que el cambio de
// `nombre` altera el hash vivo y enciende el drift.
function documentoBiblioteca(version: "v1" | "v2"): string {
  const nombre = version === "v1" ? "Recurso" : "Recurso Revisado";
  return JSON.stringify({
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: LIB_ID,
      nombre: LIB_NOMBRE,
      opdRaizId: "opd-sd",
      nextSeq: 20,
      entidades: {
        [PIEZA_ID]: { id: PIEZA_ID, tipo: "objeto", nombre, esencia: "informacional", afiliacion: "sistemica" },
      },
      estados: {},
      enlaces: {},
      opds: {
        "opd-sd": {
          id: "opd-sd",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "ap-rec": { id: "ap-rec", entidadId: PIEZA_ID, opdId: "opd-sd", x: 80, y: 80, width: 190, height: 72 },
          },
          enlaces: {},
        },
      },
    },
  });
}

interface Backend {
  mutarBiblioteca(json: string): void;
}

// Backend en-memory con el índice de workspace SEMBRADO (la biblioteca marcada
// `esBiblioteca`, patrón de 35-piezas-puerta) + un mutador del JSON persistido
// (patrón de 34-centinela-drift). Replica "mutar la greda gist" sin tocar el cliente.
function instalarBackend(page: Page): Backend {
  const ahora = (): string => new Date().toISOString();
  const modelos = new Map<string, ModeloApi>();
  modelos.set(LIB_ID, { id: LIB_ID, nombre: LIB_NOMBRE, descripcion: "", creadoEn: ahora(), actualizadoEn: ahora(), json: documentoBiblioteca("v1"), revision: 1 });
  let workspace: { modelos: unknown[]; carpetas: unknown[]; recientes: unknown[] } = {
    modelos: [{ id: LIB_ID, carpetaId: null, esBiblioteca: true }],
    carpetas: [],
    recientes: [],
  };
  const session = { tenantId: "tenant-integral-e2e", userId: "user-integral-e2e" };

  void page.route("**/__deep-opm/session", (route) => route.fulfill({ json: { session } }));
  void page.route("**/__deep-opm/workspace", async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ json: { indice: workspace } });
      return;
    }
    const body = JSON.parse(route.request().postData() ?? "{}") as { indice?: typeof workspace };
    workspace = body.indice ?? workspace;
    await route.fulfill({ json: { indice: workspace } });
  });
  void page.route("**/__deep-opm/modelos**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname !== "/__deep-opm/modelos") {
      await route.fallback();
      return;
    }
    if (route.request().method() === "GET") {
      await route.fulfill({ json: { modelos: [...modelos.values()] } });
      return;
    }
    const body = JSON.parse(route.request().postData() ?? "{}") as { modelo?: ModeloApi };
    const incoming = body.modelo;
    if (!incoming) {
      await route.fulfill({ status: 400, json: { error: "Modelo persistido inválido" } });
      return;
    }
    const actual = modelos.get(incoming.id);
    const guardado: ModeloApi = { ...incoming, revision: actual ? actual.revision + 1 : 1, actualizadoEn: ahora() };
    modelos.set(guardado.id, guardado);
    await route.fulfill({ json: { modelo: guardado } });
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
      if (!actual) throw new Error("Biblioteca no sembrada");
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

// La cosa anclada = la recién seleccionada por el gesto Anclar.
async function ancladaActual(page: Page): Promise<{ id: string | null; anclado: boolean; drift?: string }> {
  return page.evaluate(async (ruta) => {
    const m = await import(ruta) as {
      store: { getState: () => { seleccionId: string | null; modelo: { entidades: Record<string, { anclaje?: unknown }> }; driftMap: Record<string, string> } };
    };
    const s = m.store.getState();
    const id = s.seleccionId;
    if (!id) return { id: null, anclado: false };
    return { id, anclado: !!s.modelo.entidades[id]?.anclaje, drift: s.driftMap[id] };
  }, RUTA_STORE);
}

function badgeDrift(page: Page) {
  return page.locator('[joint-selector="driftBadge"]');
}
function markaAmarre(page: Page) {
  return page.locator('[joint-selector="driftBadgeMark"]');
}

test.describe("La PUERTA × el Centinela — anclar por el gesto y ver el aviso", () => {
  test("anclar una Pieza por el gesto, mutar la biblioteca, y el ⟳ aparece SOLO sin tocar el hash", async ({ page }) => {
    const backend = instalarBackend(page);
    await page.goto("/");
    await esperarWorkbenchInicial(page);

    // Bootstrap del listado contra el backend sembrado; espera a que la biblioteca
    // designada entre al índice del store (asíncrono).
    await page.evaluate(async (ruta) => {
      const m = await import(ruta) as { store: { getState: () => { listarModelosGuardados: () => void } } };
      m.store.getState().listarModelosGuardados();
    }, RUTA_STORE);
    await expect.poll(async () => page.evaluate(async ({ ruta, libId }) => {
      const m = await import(ruta) as { store: { getState: () => { indice: { modelos: { id: string; esBiblioteca?: boolean }[] } } } };
      return m.store.getState().indice.modelos.some((x) => x.id === libId && x.esBiblioteca === true);
    }, { ruta: RUTA_STORE, libId: LIB_ID })).toBe(true);

    // Anclar la Pieza POR EL GESTO del producto: abrir Piezas → fuente externa →
    // Anclar. El producto congela el frozenAtHash de la biblioteca viva v1.
    await abrirPiezas(page);
    await page.getByTestId(`piezas-fuente-${LIB_ID}`).click();
    await expect(page.getByTestId(`pieza-anclar-${PIEZA_ID}`)).toBeVisible();
    await page.getByTestId(`pieza-anclar-${PIEZA_ID}`).click();
    await expect.poll(async () => (await ancladaActual(page)).anclado).toBe(true);

    // ANCLA adversarial: con la biblioteca intacta, la cosa anclada se declara
    // al-día (marca de amarre en el lienzo, SIN glifo de alarma). El hash que el
    // gesto congeló == el hash vivo.
    await evaluarDrift(page);
    expect((await ancladaActual(page)).drift).toBe("sincronizado");
    await expect(markaAmarre(page)).toHaveCount(1);
    await expect(badgeDrift(page)).toHaveCount(0);

    // MUTAR la biblioteca PERSISTIDA (renombra la Pieza). El frozenAtHash de la cosa
    // anclada NO se toca: lo congeló el gesto, aquí no se reescribe.
    backend.mutarBiblioteca(documentoBiblioteca("v2"));
    await evaluarDrift(page);

    // El aviso aparece SOLO: la marca de amarre se reemplaza por ⟳ (excluyentes).
    expect((await ancladaActual(page)).drift).toBe("divergente");
    await expect(markaAmarre(page)).toHaveCount(0);
    await expect(badgeDrift(page)).toHaveCount(1);
    await expect(badgeDrift(page)).toContainText("⟳");
    // El gesto de remediación ya existe (Centinela desplegado): el Inspector lo ofrece.
    await expect(page.getByTestId("inspector-anclaje-divergente")).toBeVisible();
  });
});
