// Centinela de Drift — red de regresión e2e de la MECÁNICA end-to-end.
//
// La UI (marcador en el lienzo + sección «Anclaje» del Inspector) ya está
// construida, verde y validada in-vivo; lo que faltaba era la malla e2e que
// FALSE la mecánica completa: entidad anclada → biblioteca cambia bajo sus pies
// → el aviso aparece; re-sincronizar lo apaga; soltar la desancla.
//
// B4 (§2(c) del spec de la PUERTA): el chip tiene TRES estados, mismo slot. El
// al-día se DECLARA con una marca de amarre dibujada en PATH (selector propio
// `driftBadgeMark`, peso mínimo) — NO el `text` `driftBadge`, reservado a los
// glifos de fuente ⟳ (divergente) / ? (no-resuelto). Por eso aquí distinguimos
// `markaAmarre` (al-día) de `badgeDrift` (⟳/?), y son mutuamente excluyentes.
//
// Diseño adversarial (anti verde-tautológico): la divergencia NO se inyecta con
// un hash hardcodeado. Se persiste una biblioteca v1 en un backend en-memory
// (page.route con un Map mutable, mismo patrón que 33-backend-only), el cliente
// congela `frozenAtHash = firmaBiblioteca(v1)` computado in-browser con el MISMO
// pipeline que el Centinela (hidratarModelo → firmaBiblioteca), y SOLO entonces se
// MUTA SEMÁNTICAMENTE la biblioteca persistida (renombrar una pieza + agregar
// otra). El test asienta `sincronizado` ANTES de mutar y `divergente` DESPUÉS,
// con el MISMO hash congelado intacto: la transición prueba por construcción que
// el aviso lo enciende la mutación, no el test. Sin el paso de mutación, el caso
// `divergente` se cae (verificado a mano omitiéndolo).
//
// Los marcadores del lienzo se verifican por los selectores nativos de JointJS
// `[joint-selector="driftBadge"]` (⟳/?) y `[joint-selector="driftBadgeMark"]`
// (marca de amarre al-día) — mismo mecanismo que 07/08 usan para
// stateCapsule/imagen/wrapper, sin tocar producto ni agregar data-testids.

import { expect, test, type Page } from "@playwright/test";
import { abrirDialogoCargarModelo, elementoPorTexto, esperarWorkbenchInicial, jsonEditor } from "./_smoke-helpers";

const LIB_ID = "gist-lib-centinela-e2e";
const LIB_NOMBRE = "Biblioteca gist (Centinela e2e)";
const LIB_AUSENTE_ID = "biblioteca-inexistente-e2e";
const ANCLADA_ID = "o-anclada";
const ANCLADA_NOMBRE = "Cosa Anclada";
const PIEZA_ID = "ent-Category";

const RUTA_STORE = "/src/store.ts";
const RUTA_JSON = "/src/serializacion/json.ts";
const RUTA_ANCLAJE = "/src/modelo/operaciones/anclaje.ts";

interface ModeloApi {
  id: string;
  nombre: string;
  descripcion: string;
  creadoEn: string;
  actualizadoEn: string;
  json: string;
  revision: number;
}

// Documento de biblioteca (la greda gist persistida). v2 = mutación SEMÁNTICA
// sobre v1: renombra `ent-Category` y agrega `ent-Extra`. La firma del Centinela
// es semántica (excluye coords/tamaño), así que el cambio de `nombre` y la pieza
// nueva sí alteran el hash vivo; un cambio de layout no lo haría.
function documentoBiblioteca(version: "v1" | "v2"): unknown {
  const nombreCategory = version === "v1" ? "Categoría" : "Categoría Revisada";
  const entidades: Record<string, unknown> = {
    "ent-Category": { id: "ent-Category", tipo: "objeto", nombre: nombreCategory, esencia: "informacional", afiliacion: "sistemica" },
    "ent-Component": { id: "ent-Component", tipo: "objeto", nombre: "Componente", esencia: "informacional", afiliacion: "sistemica" },
  };
  const apariencias: Record<string, unknown> = {
    "ap-cat": { id: "ap-cat", entidadId: "ent-Category", opdId: "opd-sd", x: 80, y: 80, width: 190, height: 72 },
    "ap-com": { id: "ap-com", entidadId: "ent-Component", opdId: "opd-sd", x: 310, y: 80, width: 190, height: 72 },
  };
  if (version === "v2") {
    entidades["ent-Extra"] = { id: "ent-Extra", tipo: "objeto", nombre: "Pieza Nueva", esencia: "informacional", afiliacion: "sistemica" };
    apariencias["ap-extra"] = { id: "ap-extra", entidadId: "ent-Extra", opdId: "opd-sd", x: 540, y: 80, width: 190, height: 72 };
  }
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: LIB_ID,
      nombre: LIB_NOMBRE,
      opdRaizId: "opd-sd",
      nextSeq: 20,
      entidades,
      estados: {},
      enlaces: {},
      opds: {
        "opd-sd": { id: "opd-sd", nombre: "SD", padreId: null, apariencias, enlaces: {} },
      },
    },
  };
}

// Modelo cliente: una cosa anclada a `PIEZA_ID` de la biblioteca `modeloIdBiblioteca`,
// con `frozenAtHash` congelado al valor que computa el propio Centinela para v1.
function documentoCliente(modeloIdBiblioteca: string, frozenAtHash: string): unknown {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "cliente-centinela-e2e",
      nombre: "Modelo cliente (Centinela e2e)",
      opdRaizId: "opd-1",
      nextSeq: 10,
      entidades: {
        [ANCLADA_ID]: {
          id: ANCLADA_ID,
          tipo: "objeto",
          nombre: ANCLADA_NOMBRE,
          esencia: "informacional",
          afiliacion: "sistemica",
          anclaje: {
            piezaId: PIEZA_ID,
            biblioteca: { modeloId: modeloIdBiblioteca, frozenAtHash, nombre: LIB_NOMBRE },
          },
        },
      },
      estados: {},
      enlaces: {},
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "a-anclada": { id: "a-anclada", entidadId: ANCLADA_ID, opdId: "opd-1", x: 200, y: 160, width: 135, height: 60 },
          },
          enlaces: {},
        },
      },
    },
  };
}

interface Backend {
  sembrarBiblioteca(id: string, nombre: string, json: string): void;
  mutarBiblioteca(id: string, json: string): void;
}

// Backend en-memory por test (aislado): persiste modelos en un Map e intercepta
// session/workspace/modelos. `mutarBiblioteca` reemplaza el JSON persistido de la
// biblioteca SIN tocar nada del cliente — replica «mutar la greda gist».
function instalarBackend(page: Page): Backend {
  const modelos = new Map<string, ModeloApi>();
  let workspace: { modelos: unknown[]; carpetas: unknown[]; recientes: unknown[] } = { modelos: [], carpetas: [], recientes: [] };
  const session = { tenantId: "tenant-centinela-e2e", userId: "user-centinela-e2e" };
  const ahora = (): string => new Date().toISOString();

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
    const method = route.request().method();
    if (method === "GET") {
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
    const method = route.request().method();
    if (method === "GET") {
      const modelo = modelos.get(id);
      await route.fulfill(modelo ? { json: { modelo } } : { status: 404, json: { error: "Modelo no encontrado" } });
      return;
    }
    if (method === "DELETE") {
      modelos.delete(id);
      await route.fulfill({ json: { ok: true } });
      return;
    }
    // versiones/autosave: irrelevantes para el Centinela; que sigan su curso.
    await route.fallback();
  });

  return {
    sembrarBiblioteca(id, nombre, json) {
      modelos.set(id, { id, nombre, descripcion: "", creadoEn: ahora(), actualizadoEn: ahora(), json, revision: 1 });
    },
    mutarBiblioteca(id, json) {
      const actual = modelos.get(id);
      if (!actual) throw new Error(`Biblioteca no sembrada: ${id}`);
      modelos.set(id, { ...actual, json, actualizadoEn: ahora(), revision: actual.revision + 1 });
    },
  };
}

// Computa el hash congelado con el MISMO pipeline que `resolverHashVivoBackend`
// (hidratarModelo → firmaBiblioteca). Garantiza frozen == live para v1 ⇒ arranque
// `sincronizado` real, no asumido.
async function computarFrozenHash(page: Page, jsonBiblioteca: string): Promise<string> {
  return page.evaluate(async ({ json, rutaJson, rutaAnclaje }) => {
    const modJson = await import(rutaJson) as { hidratarModelo: (j: string) => { ok: boolean; value?: unknown; error?: string } };
    const modAnclaje = await import(rutaAnclaje) as { firmaBiblioteca: (m: unknown) => string };
    const hid = modJson.hidratarModelo(json);
    if (!hid.ok || hid.value === undefined) throw new Error(`Hidratación de biblioteca v1 falló: ${hid.error ?? "?"}`);
    return modAnclaje.firmaBiblioteca(hid.value);
  }, { json: jsonBiblioteca, rutaJson: RUTA_JSON, rutaAnclaje: RUTA_ANCLAJE });
}

async function importarDocumento(page: Page, doc: unknown): Promise<void> {
  const dialogo = await abrirDialogoCargarModelo(page);
  await jsonEditor(page).fill(JSON.stringify(doc, null, 2));
  await expect(dialogo.getByTestId("import-preview")).toBeVisible();
  await dialogo.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();
  await expect(dialogo).toHaveCount(0);
}

async function evaluarDrift(page: Page): Promise<void> {
  await page.evaluate(async (ruta) => {
    const m = await import(ruta) as { store: { getState: () => { cargarYEvaluarDrift: () => Promise<void> } } };
    await m.store.getState().cargarYEvaluarDrift();
  }, RUTA_STORE);
}

async function seleccionarAnclada(page: Page): Promise<void> {
  await page.evaluate(async ({ ruta, id }) => {
    const m = await import(ruta) as { store: { getState: () => { seleccionarEntidad: (id: string) => void } } };
    m.store.getState().seleccionarEntidad(id);
  }, { ruta: RUTA_STORE, id: ANCLADA_ID });
}

async function driftDeLaAnclada(page: Page): Promise<string | undefined> {
  return page.evaluate(async ({ ruta, id }) => {
    const m = await import(ruta) as { store: { getState: () => { driftMap: Record<string, string> } } };
    return m.store.getState().driftMap[id];
  }, { ruta: RUTA_STORE, id: ANCLADA_ID });
}

function badgeDrift(page: Page) {
  return page.locator('[joint-selector="driftBadge"]');
}

// Marca de amarre del al-día (B4): path propio, NO el `text` de los glifos ⟳/?.
function markaAmarre(page: Page) {
  return page.locator('[joint-selector="driftBadgeMark"]');
}

// Deja el cliente importado, la cosa anclada visible y seleccionada (Inspector
// montado). `biblioteca: "sembrada"` persiste v1 y congela el hash real; `"ausente"`
// ancla a un modeloId que el backend no tiene (⇒ irresoluble).
async function montar(page: Page, opts: { biblioteca: "sembrada" | "ausente" }): Promise<Backend> {
  const backend = instalarBackend(page);
  const jsonV1 = JSON.stringify(documentoBiblioteca("v1"));
  if (opts.biblioteca === "sembrada") backend.sembrarBiblioteca(LIB_ID, LIB_NOMBRE, jsonV1);

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  const modeloIdBiblioteca = opts.biblioteca === "sembrada" ? LIB_ID : LIB_AUSENTE_ID;
  const frozen = opts.biblioteca === "sembrada"
    ? await computarFrozenHash(page, jsonV1)
    : "fnv1a-00000000";

  await importarDocumento(page, documentoCliente(modeloIdBiblioteca, frozen));
  await expect(elementoPorTexto(page, ANCLADA_NOMBRE)).toBeVisible();
  await seleccionarAnclada(page);
  return backend;
}

test.describe("Centinela de Drift — mecánica e2e", () => {
  test("divergente: la mutación SEMÁNTICA de la biblioteca enciende el marcador, sin tocar el hash congelado", async ({ page }) => {
    const backend = await montar(page, { biblioteca: "sembrada" });

    // Estado base: frozen == live(v1) ⇒ sincronizado. Es el ancla de la
    // falsificación: la MISMA cosa, con el MISMO hash congelado, está al día. B4: el
    // al-día se DECLARA con la marca de amarre (path), SIN el glifo de alarma ⟳/?.
    await evaluarDrift(page);
    await expect(page.getByTestId("inspector-anclaje-sincronizado")).toBeVisible();
    await expect(markaAmarre(page)).toHaveCount(1);
    await expect(badgeDrift(page)).toHaveCount(0);
    expect(await driftDeLaAnclada(page)).toBe("sincronizado");

    // Mutación semántica de la biblioteca PERSISTIDA (renombra pieza + agrega otra).
    // El `frozenAtHash` del cliente NO se toca.
    backend.mutarBiblioteca(LIB_ID, JSON.stringify(documentoBiblioteca("v2")));
    await evaluarDrift(page);

    // El aviso aparece: chip ⟳ en el lienzo + sección divergente con ambas acciones.
    // La marca de amarre del al-día se REEMPLAZA por el glifo ⟳ (excluyentes).
    await expect(page.getByTestId("inspector-anclaje-divergente")).toBeVisible();
    await expect(markaAmarre(page)).toHaveCount(0);
    await expect(badgeDrift(page)).toHaveCount(1);
    // El atributo `title` de JointJS se serializa como <title> hijo del <text>,
    // así que textContent = tooltip + glifo; el glifo ⟳ no vive en ningún tooltip.
    await expect(badgeDrift(page)).toContainText("⟳");
    await expect(page.getByTestId("anclaje-resincronizar")).toBeVisible();
    await expect(page.getByTestId("anclaje-soltar")).toBeVisible();
    const tutor = page.getByTestId("tutor-inspector-anclaje");
    await expect(tutor).toHaveAttribute("data-tutor-intervention", "ask");
    await expect(tutor).toContainText("Elige aceptar la firma actual o perder la vigilancia.");
    await expect(tutor.getByText("Criterio", { exact: true })).toBeVisible();
    await expect(tutor.getByText("Fundamento", { exact: true })).toBeVisible();
    await tutor.getByText("Fundamento", { exact: true }).click();
    await expect(tutor.locator('a[href^="/tutor-sources/"]').first()).toBeVisible();
    await expect(page.locator('[data-tutor-intervention]:visible')).toHaveCount(1);
    expect(await driftDeLaAnclada(page)).toBe("divergente");
  });

  test("sincronizado: biblioteca intacta ⇒ marca de amarre al-día, sin glifo ⟳/?", async ({ page }) => {
    await montar(page, { biblioteca: "sembrada" });
    await evaluarDrift(page);

    await expect(page.getByTestId("inspector-anclaje-sincronizado")).toBeVisible();
    // B4: el al-día se DECLARA (marca de amarre), pero sin glifo de alarma ⟳/?.
    await expect(markaAmarre(page)).toHaveCount(1);
    await expect(badgeDrift(page)).toHaveCount(0);
    // Sincronizado no ofrece Re-sincronizar (no hay nada que adoptar); sí Soltar.
    await expect(page.getByTestId("anclaje-resincronizar")).toHaveCount(0);
    await expect(page.getByTestId("anclaje-soltar")).toBeVisible();
    expect(await driftDeLaAnclada(page)).toBe("sincronizado");
  });

  test("no-resuelto: biblioteca irresoluble ⇒ chip ? y honestidad temporal", async ({ page }) => {
    await montar(page, { biblioteca: "ausente" });
    await evaluarDrift(page);

    await expect(page.getByTestId("inspector-anclaje-no-resuelto")).toBeVisible();
    // El glifo ? sustituye a la marca de amarre del al-día (excluyentes).
    await expect(markaAmarre(page)).toHaveCount(0);
    await expect(badgeDrift(page)).toHaveCount(1);
    // textContent = tooltip + glifo (ver nota en el caso divergente); el glifo ? no
    // aparece en el tooltip de no-resuelto.
    await expect(badgeDrift(page)).toContainText("?");
    // No se inventa re-sincronización contra una biblioteca que no se pudo leer.
    await expect(page.getByTestId("anclaje-resincronizar")).toHaveCount(0);
    await expect(page.getByTestId("anclaje-soltar")).toBeVisible();
    expect(await driftDeLaAnclada(page)).toBe("no-resuelto");
  });

  test("re-sincronizar: desde divergente re-congela al hash vivo y apaga el marcador", async ({ page }) => {
    const backend = await montar(page, { biblioteca: "sembrada" });
    await evaluarDrift(page);
    backend.mutarBiblioteca(LIB_ID, JSON.stringify(documentoBiblioteca("v2")));
    await evaluarDrift(page);
    await expect(page.getByTestId("inspector-anclaje-divergente")).toBeVisible();
    await expect(badgeDrift(page)).toHaveCount(1);

    await page.getByTestId("anclaje-resincronizar").click();

    // Re-congelado al hash vivo (v2): vuelve a sincronizado, el glifo ⟳ se va y
    // reaparece la marca de amarre del al-día.
    await expect(page.getByTestId("inspector-anclaje-sincronizado")).toBeVisible();
    await expect(badgeDrift(page)).toHaveCount(0);
    await expect(markaAmarre(page)).toHaveCount(1);
    expect(await driftDeLaAnclada(page)).toBe("sincronizado");

    await page.keyboard.press("Control+z");
    await seleccionarAnclada(page);
    await expect(page.getByTestId("inspector-anclaje-divergente")).toBeVisible();
    await expect(badgeDrift(page)).toContainText("⟳");
    expect(await driftDeLaAnclada(page)).toBe("divergente");

    await page.keyboard.press("Control+Shift+z");
    await seleccionarAnclada(page);
    await expect(page.getByTestId("inspector-anclaje-sincronizado")).toBeVisible();
    await expect(markaAmarre(page)).toHaveCount(1);
    expect(await driftDeLaAnclada(page)).toBe("sincronizado");
  });

  test("soltar: la cosa pierde el anclaje, se va la sección del Inspector y el marcador", async ({ page }) => {
    const backend = await montar(page, { biblioteca: "sembrada" });
    await evaluarDrift(page);
    backend.mutarBiblioteca(LIB_ID, JSON.stringify(documentoBiblioteca("v2")));
    await evaluarDrift(page);
    await expect(page.getByTestId("inspector-anclaje-divergente")).toBeVisible();

    await page.getByTestId("anclaje-soltar").click();

    // Desanclada: la sección Anclaje se desmonta, sale del driftMap, sin marcador
    // de ningún tipo (ni glifo ⟳/? ni marca de amarre). La cosa sigue existiendo.
    await expect(page.getByTestId("inspector-panel-anclaje")).toHaveCount(0);
    await expect(badgeDrift(page)).toHaveCount(0);
    await expect(markaAmarre(page)).toHaveCount(0);
    expect(await driftDeLaAnclada(page)).toBeUndefined();
    await expect(elementoPorTexto(page, ANCLADA_NOMBRE)).toBeVisible();

    await page.keyboard.press("Control+z");
    await elementoPorTexto(page, ANCLADA_NOMBRE).click();
    await expect(page.getByTestId("inspector-anclaje-divergente")).toBeVisible();
    await expect(badgeDrift(page)).toContainText("⟳");
    expect(await driftDeLaAnclada(page)).toBe("divergente");
  });
});
