// Amarra del Centinela de Drift contra GIST REAL — "las 3 amarras".
//
// QUÉ FALSA: que el Centinela detecta drift de verdad cuando la GREDA GIST real
// (no un fixture fabricado) cambia bajo los pies de un derivado anclado, sin tocar
// el `frozenAtHash` y sin producción. Es distinto del e2e hermético
// `34-centinela-drift.spec.ts` (que usa un page.route mock y una biblioteca de
// laboratorio): aquí se ejercita el BACKEND REAL del middleware dev
// (`devModelPersistence` → `repoMemoria`, mismo handler que producción) y los
// bundles REALES de `gist-opm`.
//
// SUFIJO `.preview.spec.ts`: `playwright.config.ts` lo excluye del smoke/CI vía
// `testIgnore: /.*\.preview\.spec\.ts/`, así que NO entra al gate. Re-ejecutable:
//   bun run browser:external amarra-gist-real
//
// FUENTES SSOT (otro repo — se LEEN con fs, no se copian al repo):
//   - OPFORJA_GIST_BUNDLE: bundle gist-opm-v0.json con las piezas usadas abajo.
//   - OPFORJA_SD0_BUNDLE: derivado sd0-ejemplar-transaccion.json.
//
// CORRESPONDENCIAS DE ANCLAJE elegidas (entidad del derivado → piezaId real de gist):
//   - o-asignacion-3 (Asignación) → ent-Assignment (Asignación)  — EXACTA.
//   - p-transar-4    (Transar)    → ent-Transaction (Transacción) — FUERTE: verbo/sustantivo
//        del mismo arquetipo transaccional; el SD0 ES "la transacción gist en movimiento".
//   - CONTROL NEGATIVO: o-parte-1 (Parte) — SIN anclar. No existe `ent-Party` en gist real,
//        así que es un control genuinamente no-mapeable; el marcador NO debe aparecer nunca.
//   (gist real no tiene `ent-Resource`/`ent-Party`; el experimento falsa la DETECCIÓN,
//    no la corrección ontológica del mapeo —eso es trabajo del gesto de anclar futuro—.)
//
// Compatibilidad del grano BIBLIOTECA: este bundle inyecta anclajes legacy sin
// frozenAtPieza. La amarra 2b conserva esa cobertura; el grano de pieza por el
// gesto actual se verifica en amarra-pieza-grano.preview.spec.ts.

import { expect, test, type Page } from "@playwright/test";
import { mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { abrirDialogoCargarModelo, elementoPorTexto, esperarWorkbenchInicial, jsonEditor } from "./_smoke-helpers";

// --- Rutas internas de módulos del app (resueltas in-browser por Vite dev) -------
const RUTA_STORE = "/src/store.ts";
const RUTA_JSON = "/src/serializacion/json.ts";
const RUTA_ANCLAJE = "/src/modelo/operaciones/anclaje.ts";
const RUTA_BACKEND = "/src/persistencia/backend.ts";

// Las fuentes se abren al ejecutar, no al descubrir las pruebas.
type GistBundle = { modelo: { id: string; nombre: string; entidades: Record<string, { nombre: string }> } };
let GIST_V1: string;
let SD0_RAW: string;
let GIST_ID: string;
let GIST_NOMBRE: string;

test.beforeAll(() => {
  const rutaGist = process.env.OPFORJA_GIST_BUNDLE;
  const rutaSd0 = process.env.OPFORJA_SD0_BUNDLE;
  if (!rutaGist || !rutaSd0) throw new Error("Define OPFORJA_GIST_BUNDLE y OPFORJA_SD0_BUNDLE para ejecutar esta amarra externa.");
  GIST_V1 = readFileSync(rutaGist, "utf8");
  SD0_RAW = readFileSync(rutaSd0, "utf8");
  const gist = JSON.parse(GIST_V1) as GistBundle;
  GIST_ID = gist.modelo.id;
  GIST_NOMBRE = gist.modelo.nombre;
});

// Anclajes: entidad del derivado → pieza real de gist.
const ANCLAJES: ReadonlyArray<{ entidadId: string; piezaId: string }> = [
  { entidadId: "o-asignacion-3", piezaId: "ent-Assignment" },
  { entidadId: "p-transar-4", piezaId: "ent-Transaction" },
];
const CONTROL_NEGATIVO = "o-parte-1"; // Parte — sin anclar; nunca debe marcarse.
const CLIENTE_ID = "sd0-anclado-amarra-gist";

// Capturas → app/test-results/ (gitignored). Subcarpeta dedicada para el curador.
const DIR_CAPTURAS = fileURLToPath(new URL("../test-results/amarra-gist-real/", import.meta.url));

async function capturar(page: Page, nombre: string): Promise<void> {
  mkdirSync(DIR_CAPTURAS, { recursive: true });
  await page.screenshot({ path: `${DIR_CAPTURAS}${nombre}` });
}

// Construye el cliente anclado a partir del derivado REAL: inyecta `anclaje` a la
// greda gist en las entidades con correspondencia, con `frozenAtHash` = la firma
// que el propio Centinela computa para gist v1 ⇒ arranque `sincronizado` real.
function construirClienteAnclado(frozenAtHash: string): unknown {
  const doc = JSON.parse(SD0_RAW) as { formato: string; modelo: { id: string; nombre: string; entidades: Record<string, Record<string, unknown>> } };
  doc.modelo.id = CLIENTE_ID;
  doc.modelo.nombre = "SD0 ejemplar — anclado a gist (amarra gist real)";
  for (const { entidadId, piezaId } of ANCLAJES) {
    const entidad = doc.modelo.entidades[entidadId];
    if (!entidad) throw new Error(`Derivado real no tiene la entidad esperada: ${entidadId}`);
    entidad.anclaje = { piezaId, biblioteca: { modeloId: GIST_ID, frozenAtHash, nombre: GIST_NOMBRE } };
  }
  return doc;
}

// Greda gist con UNA pieza renombrada (mutación SEMÁNTICA real: la firma del
// Centinela excluye layout pero incluye nombres ⇒ el hash vivo cambia).
function gistConPiezaRenombrada(piezaId: string, nuevoNombre: string): string {
  const bundle = JSON.parse(GIST_V1) as GistBundle;
  const pieza = bundle.modelo.entidades[piezaId];
  if (!pieza) throw new Error(`gist real no tiene la pieza esperada: ${piezaId}`);
  pieza.nombre = nuevoNombre;
  return JSON.stringify(bundle);
}

// --- Puentes in-browser (mismo patrón que 34: import() sobre módulos Vite) --------

// Persiste un modelo en el BACKEND REAL del middleware dev (repoMemoria, por tenant
// de cookie). El derivado y `resolverHashVivoBackend` comparten cookie/tenant en la
// misma página, así que el Centinela lo encontrará de verdad.
async function persistirEnBackend(page: Page, id: string, nombre: string, json: string): Promise<void> {
  const res = await page.evaluate(async ({ ruta, id, nombre, json }) => {
    const mod = await import(ruta) as {
      cargarModeloBackend: (id: string) => Promise<{
        ok: boolean;
        value?: { creadoEn: string; revision?: number };
      }>;
      guardarModeloBackend: (m: unknown) => Promise<{
        ok: boolean;
        error?: string;
      }>;
    };
    const ahora = new Date().toISOString();
    const existente = await mod.cargarModeloBackend(id);
    return mod.guardarModeloBackend({
      id,
      nombre,
      descripcion: "amarra gist real (backend dev)",
      creadoEn: existente.ok ? existente.value?.creadoEn ?? ahora : ahora,
      actualizadoEn: ahora,
      json,
      ...(existente.ok && typeof existente.value?.revision === "number"
        ? { revision: existente.value.revision }
        : {}),
    });
  }, { ruta: RUTA_BACKEND, id, nombre, json });
  if (!res.ok) throw new Error(`No se pudo persistir "${id}" en el backend dev: ${res.error ?? "?"}`);
}

// Computa la firma de biblioteca con el MISMO pipeline que el Centinela
// (hidratarModelo → firmaBiblioteca). Si gist real NO hidrata, esto LANZA — es un
// hallazgo, no se esconde con workaround.
async function computarFirmaBiblioteca(page: Page, json: string): Promise<string> {
  return page.evaluate(async ({ rutaJson, rutaAnclaje, json }) => {
    const modJson = await import(rutaJson) as { hidratarModelo: (j: string) => { ok: boolean; value?: unknown; error?: string } };
    const modAnclaje = await import(rutaAnclaje) as { firmaBiblioteca: (m: unknown) => string };
    const hid = modJson.hidratarModelo(json);
    if (!hid.ok || hid.value === undefined) throw new Error(`Hidratación de gist real FALLÓ: ${hid.error ?? "?"}`);
    return modAnclaje.firmaBiblioteca(hid.value);
  }, { rutaJson: RUTA_JSON, rutaAnclaje: RUTA_ANCLAJE, json });
}

async function evaluarDrift(page: Page): Promise<void> {
  await page.evaluate(async (ruta) => {
    const m = await import(ruta) as { store: { getState: () => { cargarYEvaluarDrift: () => Promise<void> } } };
    await m.store.getState().cargarYEvaluarDrift();
  }, RUTA_STORE);
}

async function driftMap(page: Page): Promise<Record<string, string>> {
  return page.evaluate(async (ruta) => {
    const m = await import(ruta) as { store: { getState: () => { driftMap: Record<string, string> } } };
    return m.store.getState().driftMap;
  }, RUTA_STORE);
}

async function seleccionarEntidad(page: Page, id: string): Promise<void> {
  await page.evaluate(async ({ ruta, id }) => {
    const m = await import(ruta) as { store: { getState: () => { seleccionarEntidad: (id: string) => void } } };
    m.store.getState().seleccionarEntidad(id);
  }, { ruta: RUTA_STORE, id });
}

function badges(page: Page) {
  return page.locator('[joint-selector="driftBadge"]');
}

async function importarDocumento(page: Page, doc: unknown): Promise<void> {
  const dialogo = await abrirDialogoCargarModelo(page);
  await jsonEditor(page).fill(JSON.stringify(doc, null, 2));
  await expect(dialogo.getByTestId("import-preview")).toBeVisible();
  await dialogo.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();
  await expect(dialogo).toHaveCount(0);
}

// AMARRA 1 (común a ambas pruebas): persiste gist v1 en el backend real, congela el
// hash con el pipeline real, importa el derivado anclado y deja la base
// `sincronizado` asentada (sin marcador). Devuelve la firma congelada (v1).
async function montarAmarra1(page: Page): Promise<string> {
  await page.goto("/");
  await esperarWorkbenchInicial(page);

  await persistirEnBackend(page, GIST_ID, GIST_NOMBRE, GIST_V1);
  const frozen = await computarFirmaBiblioteca(page, GIST_V1);

  await importarDocumento(page, construirClienteAnclado(frozen));
  await expect(elementoPorTexto(page, "Asignación")).toBeVisible();

  // Base: frozen == live(v1) ⇒ sincronizado real, sin marcador.
  await seleccionarEntidad(page, "o-asignacion-3");
  await evaluarDrift(page);
  await expect(page.getByTestId("inspector-anclaje-sincronizado")).toBeVisible();
  await expect(badges(page)).toHaveCount(0);

  const dm = await driftMap(page);
  expect(dm["o-asignacion-3"]).toBe("sincronizado");
  expect(dm["p-transar-4"]).toBe("sincronizado");
  expect(dm[CONTROL_NEGATIVO]).toBeUndefined(); // control jamás entra al reporte.
  return frozen;
}

test.describe("Centinela de Drift — amarra contra gist REAL (backend dev real, sin producción)", () => {
  test.slow(); // gist real = 118 piezas + import por diálogo: más holgura que el default.

  test("amarra principal: mutar la pieza ANCLADA (ent-Assignment) enciende el marcador SOLO; remediación real", async ({ page }) => {
    const frozen = await montarAmarra1(page);
    await capturar(page, "01-amarra1-base-sincronizado.png");

    // AMARRA 2a — mutar gist PERSISTIDO de verdad: renombrar la pieza ANCLADA.
    await persistirEnBackend(page, GIST_ID, GIST_NOMBRE, gistConPiezaRenombrada("ent-Assignment", "Asignación (revisada)"));

    // AMARRA 3 — el marcador aparece SOLO, sin tocar el frozenAtHash.
    await evaluarDrift(page);
    await expect(page.getByTestId("inspector-anclaje-divergente")).toBeVisible();
    await expect(page.getByTestId("anclaje-resincronizar")).toBeVisible();
    await expect(page.getByTestId("anclaje-soltar")).toBeVisible();
    // Dos ancladas visibles divergen (o-asignacion-3 + p-transar-4); el control NO.
    await expect(badges(page)).toHaveCount(2);
    await expect(badges(page).first()).toContainText("⟳");
    const dmDiv = await driftMap(page);
    expect(dmDiv["o-asignacion-3"]).toBe("divergente");
    expect(dmDiv["p-transar-4"]).toBe("divergente");
    expect(dmDiv[CONTROL_NEGATIVO]).toBeUndefined(); // control limpio.
    await capturar(page, "02-amarra2a-3-divergente-ent-Assignment.png");

    // AMARRA 4 — remediación real: Re-sincronizar una anclada (adopta el hash vivo v2).
    await page.getByTestId("anclaje-resincronizar").click();
    await expect(page.getByTestId("inspector-anclaje-sincronizado")).toBeVisible();
    await expect(badges(page)).toHaveCount(1); // queda solo el de p-transar-4.
    const dmTrasResync = await driftMap(page);
    expect(dmTrasResync["o-asignacion-3"]).toBe("sincronizado");
    expect(dmTrasResync["p-transar-4"]).toBe("divergente");
    await capturar(page, "03-amarra4-resincronizar.png");

    // AMARRA 4 — Soltar la otra anclada: pierde el anclaje, sale del reporte.
    await seleccionarEntidad(page, "p-transar-4");
    await expect(page.getByTestId("inspector-anclaje-divergente")).toBeVisible();
    await page.getByTestId("anclaje-soltar").click();
    await expect(page.getByTestId("inspector-panel-anclaje")).toHaveCount(0);
    await expect(badges(page)).toHaveCount(0);
    const dmTrasSoltar = await driftMap(page);
    expect(dmTrasSoltar["p-transar-4"]).toBeUndefined();
    await capturar(page, "04-amarra4-soltar.png");

    // El hash congelado original (v1) NO se tocó en ninguna detección: lo enciende la
    // mutación de la greda, no el test.
    expect(frozen).toMatch(/^fnv1a-/);
  });

  test("amarra 2b — honestidad de grano: mutar una pieza NO anclada (ent-Account) IGUAL hace divergir lo anclado", async ({ page }) => {
    await montarAmarra1(page);
    await capturar(page, "05-amarra2b-base-sincronizado.png");

    // Corrida limpia (contexto/tenant fresco). Mutar gist persistido en una pieza
    // DISTINTA de las ancladas: ent-Account (Cuenta) — nadie la ancló.
    await persistirEnBackend(page, GIST_ID, GIST_NOMBRE, gistConPiezaRenombrada("ent-Account", "Cuenta (revisada)"));
    await evaluarDrift(page);

    // GRANO BIBLIOTECA-NIVEL: aunque mutamos ent-Account, lo anclado a ent-Assignment
    // (y a ent-Transaction) IGUAL diverge, porque el hash vivo es de TODA la biblioteca.
    await expect(page.getByTestId("inspector-anclaje-divergente")).toBeVisible();
    await expect(badges(page)).toHaveCount(2);
    await expect(badges(page).first()).toContainText("⟳");
    const dm = await driftMap(page);
    expect(dm["o-asignacion-3"]).toBe("divergente"); // anclada a ent-Assignment, NO a ent-Account.
    expect(dm["p-transar-4"]).toBe("divergente");
    expect(dm[CONTROL_NEGATIVO]).toBeUndefined();
    await capturar(page, "06-amarra2b-3-grano-biblioteca-ent-Account.png");
  });
});
