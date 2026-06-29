// La PUERTA del Anclaje — e2e de la superficie «Piezas» (corte "gesto de anclar", B2+B3).
//
// Falsea el gesto de fundación end-to-end desde el producto: con un modelo designado
// BIBLIOTECA (esBiblioteca=true en el índice), abrir Piezas → el selector de fuente la
// ofrece → cargar sus entidades como Piezas → Calcar clona SIN anclaje → Anclar deja
// anclaje (sincronizado). Con «Este modelo» la columna Anclar NO aparece.
//
// Backend en-memory por test (mismo patrón que 34-centinela-drift): se siembra el
// índice de workspace con la biblioteca marcada + el documento persistido. La mutación
// (Calcar/Anclar) pasa por el store; aquí se inspecciona el resultado vía el store
// expuesto por Vite dev (import('/src/store.ts')).
import { expect, test, type Page } from "@playwright/test";
import { esperarWorkbenchInicial } from "./_smoke-helpers";

const LIB_ID = "gist-lib-piezas-e2e";
const LIB_NOMBRE = "Biblioteca gist (Piezas e2e)";
const PIEZA_ID = "ent-Recurso";
const PIEZA_NOMBRE = "Recurso";
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

// Biblioteca de Piezas persistida: un objeto "Recurso" como Pieza anclable.
function documentoBiblioteca(): string {
  return JSON.stringify({
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: LIB_ID,
      nombre: LIB_NOMBRE,
      opdRaizId: "opd-sd",
      nextSeq: 20,
      entidades: {
        [PIEZA_ID]: { id: PIEZA_ID, tipo: "objeto", nombre: PIEZA_NOMBRE, esencia: "informacional", afiliacion: "sistemica" },
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

// Backend en-memory con el índice de workspace SEMBRADO: la biblioteca aparece marcada
// `esBiblioteca` (B1) para que la superficie la ofrezca como fuente, y persistida en el
// Map de modelos para que la carga de Piezas y la resolución de hash (Anclar) la lean.
function instalarBackend(page: Page): void {
  const ahora = (): string => new Date().toISOString();
  const modelos = new Map<string, ModeloApi>();
  modelos.set(LIB_ID, { id: LIB_ID, nombre: LIB_NOMBRE, descripcion: "", creadoEn: ahora(), actualizadoEn: ahora(), json: documentoBiblioteca(), revision: 1 });
  let workspace: { modelos: unknown[]; carpetas: unknown[]; recientes: unknown[] } = {
    modelos: [{ id: LIB_ID, carpetaId: null, esBiblioteca: true }],
    carpetas: [],
    recientes: [],
  };
  const session = { tenantId: "tenant-piezas-e2e", userId: "user-piezas-e2e" };

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
}

// Lee la cosa SELECCIONADA del modelo activo (la recién calcada/anclada) y su drift.
async function seleccionActual(page: Page): Promise<{ id: string | null; anclado: boolean; modeloIdAnclaje?: string; drift?: string }> {
  return page.evaluate(async (ruta) => {
    const m = await import(ruta) as {
      store: { getState: () => { seleccionId: string | null; modelo: { entidades: Record<string, { anclaje?: { biblioteca: { modeloId: string } } }> }; driftMap: Record<string, string> } };
    };
    const s = m.store.getState();
    const id = s.seleccionId;
    if (!id) return { id: null, anclado: false };
    const anclaje = s.modelo.entidades[id]?.anclaje;
    return { id, anclado: !!anclaje, modeloIdAnclaje: anclaje?.biblioteca.modeloId, drift: s.driftMap[id] };
  }, RUTA_STORE);
}

// Abre la superficie Piezas vía el store expuesto por Vite dev. El comando equivalente
// del command palette («Piezas») lo cubre `CommandPalette.test.ts`; aquí lo que se
// falsea es la superficie y sus verbos, no el atajo de apertura.
async function abrirPiezas(page: Page): Promise<void> {
  await page.evaluate(async (ruta) => {
    const m = await import(ruta) as { store: { getState: () => { abrirVitrinaEstereotipos: () => void } } };
    m.store.getState().abrirVitrinaEstereotipos();
  }, RUTA_STORE);
  await expect(page.getByTestId("vitrina-estereotipos")).toBeVisible();
}

test.describe("La PUERTA del Anclaje — superficie Piezas", () => {
  test("una biblioteca designada se ofrece como fuente; Calcar clona sin anclaje, Anclar deja anclaje sincronizado", async ({ page }) => {
    instalarBackend(page);
    await page.goto("/");
    await esperarWorkbenchInicial(page);

    // Fuerza el bootstrap de listado (workspace + modelos) contra el backend sembrado,
    // y espera a que la biblioteca designada entre al índice del store (es asíncrono).
    await page.evaluate(async (ruta) => {
      const m = await import(ruta) as { store: { getState: () => { listarModelosGuardados: () => void } } };
      m.store.getState().listarModelosGuardados();
    }, RUTA_STORE);
    await expect.poll(async () => page.evaluate(async ({ ruta, libId }) => {
      const m = await import(ruta) as { store: { getState: () => { indice: { modelos: { id: string; esBiblioteca?: boolean }[] } } } };
      return m.store.getState().indice.modelos.some((x) => x.id === libId && x.esBiblioteca === true);
    }, { ruta: RUTA_STORE, libId: LIB_ID })).toBe(true);

    await abrirPiezas(page);

    // Fuente por defecto = «Este modelo»: la columna Anclar NO existe (solo Calcar de
    // estereotipos). No hay filas de Pieza externa.
    await expect(page.getByTestId("piezas-fuente-local")).toHaveAttribute("aria-checked", "true");
    await expect(page.locator('[data-testid^="pieza-anclar-"]')).toHaveCount(0);

    // El selector ofrece la biblioteca designada.
    const chipBiblioteca = page.getByTestId(`piezas-fuente-${LIB_ID}`);
    await expect(chipBiblioteca).toBeVisible();
    await chipBiblioteca.click();

    // Sus entidades aparecen como Piezas, con AMBOS verbos (fuente externa).
    await expect(page.getByTestId(`pieza-item-${PIEZA_ID}`)).toBeVisible();
    await expect(page.getByTestId(`pieza-calcar-${PIEZA_ID}`)).toBeVisible();
    await expect(page.getByTestId(`pieza-anclar-${PIEZA_ID}`)).toBeVisible();

    // Calcar: clona-y-olvida. La Pieza aterriza seleccionada, SIN anclaje. Modal abierto.
    await page.getByTestId(`pieza-calcar-${PIEZA_ID}`).click();
    await expect(page.getByTestId("vitrina-estereotipos")).toBeVisible();
    await expect.poll(async () => (await seleccionActual(page)).id).not.toBeNull();
    const trasCalcar = await seleccionActual(page);
    expect(trasCalcar.anclado).toBe(false);

    // Anclar: clona + ata. La nueva Pieza queda anclada a la biblioteca y sincronizada.
    await page.getByTestId(`pieza-anclar-${PIEZA_ID}`).click();
    await expect.poll(async () => (await seleccionActual(page)).anclado).toBe(true);
    const trasAnclar = await seleccionActual(page);
    expect(trasAnclar.modeloIdAnclaje).toBe(LIB_ID);
    expect(trasAnclar.drift).toBe("sincronizado");
  });
});
