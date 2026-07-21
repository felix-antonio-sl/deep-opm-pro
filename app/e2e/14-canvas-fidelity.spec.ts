/**
 * Smoke 14 — canvas fidelity pre-beta.
 *
 * Cubre las garantias de Ronda 15 L4:
 * 1. Modelo mediano demo se renderiza con objetos/procesos visibles.
 * 2. Enlaces tienen marker correcto (assets canonicos JOYAS §5).
 * 3. Connector jumpover activo en enlaces procedurales con routerManhattan.
 * 4. Sugerir layout es undoable y no rompe seleccion ni undo stack.
 */
import { expect, test } from "@playwright/test";
import {
  esperarWorkbenchInicial,
  clickToolbarMasItem,
  exportadoActual,
  jsonEditor,
  modeloSmokeTablaEnlaces,
  modeloMarkersCanonicos,
} from "./_smoke-helpers";

test("modelo markers canonicos se renderiza con todos los objetos/procesos visibles", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloMarkersCanonicos(), null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();

  // 20 entidades + 6 markers estructurales (agregacion + 2 exhibicion + generalizacion + clasificacion + dot)
  await expect(page.locator(".joint-element")).toHaveCount(26);
  await expect(page.locator(".joint-link")).toHaveCount(14);

  // Cada enlace canonico tiene path 'wrapper' (15px hit area) y 'line'
  // (2px visible). Confirma fidelity JOYAS §4.
  const wrappers = await page.locator(".joint-link [joint-selector=wrapper]").count();
  const lines = await page.locator(".joint-link [joint-selector=line]").count();
  expect(wrappers).toBeGreaterThanOrEqual(10);
  expect(lines).toBeGreaterThanOrEqual(10);

  const transformadoresSwallowtail = await page.locator('defs marker path[d="M 0 0 L 23 8 L 12 0 L 23 -8 Z"]').count();
  const invocacionesPuntaSimple = await page.locator('defs marker path[d="M 9 -4 0 0 9 4 z"]').count();
  expect(transformadoresSwallowtail).toBeGreaterThanOrEqual(1);
  expect(invocacionesPuntaSimple).toBe(0);

  expect(pageErrors).toEqual([]);
});

test("enlaces procedurales con routerManhattan usan connector jumpover", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloSmokeTablaEnlaces(), null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();

  await expect(page.locator(".joint-link")).toHaveCount(3);
  // jumpover marca cada link con vConnector que termina con 'jumpover' en JointJS;
  // el path resultante puede contener arcos 'A' SVG cuando hay cruces. La
  // verificacion robusta es que el connector quede registrado en el modelo
  // joint a traves del adapter expuesto en window.
  const connectors = await page.evaluate(() => {
    const adapter = (window as unknown as { __opmJointAdapter?: { graph: { getLinks(): Array<{ get(prop: string): unknown }> } } }).__opmJointAdapter;
    if (!adapter) return [];
    return adapter.graph.getLinks().map((link) => link.get("connector"));
  });
  // Al menos un enlace debe tener jumpover (los procedurales sandbox usan routerManhattan).
  const conJumpover = connectors.filter((c) => (c as { name?: string })?.name === "jumpover");
  expect(conJumpover.length).toBeGreaterThan(0);

  expect(pageErrors).toEqual([]);
});

test("aplicar layout sugerido reorganiza apariencias y es undoable atomicamente", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await jsonEditor(page).fill(JSON.stringify(modeloSmokeTablaEnlaces(), null, 2));
  await page.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();

  // Posiciones iniciales del fixture (definidas en _smoke-helpers).
  const exportadoInicial = await exportadoActual(page);
  const aparienciasInicial = exportadoInicial.modelo.opds["opd-1"]?.apariencias ?? {};
  expect(Object.keys(aparienciasInicial).length).toBeGreaterThan(0);

  await clickToolbarMasItem(page, "toolbar-mas-auto-layout");

  const exportadoLayout = await exportadoActual(page);
  const aparienciasLayout = exportadoLayout.modelo.opds["opd-1"]?.apariencias ?? {};
  // Al menos una apariencia debe haber cambiado de posicion.
  let cambio = false;
  for (const [id, apariencia] of Object.entries(aparienciasLayout)) {
    const original = aparienciasInicial[id];
    if (!original) continue;
    if (original.x !== apariencia.x || original.y !== apariencia.y) {
      cambio = true;
      break;
    }
  }
  expect(cambio).toBe(true);

  // Undo: una sola pulsacion debe revertir todo el batch.
  await page.keyboard.press("Control+z");
  const exportadoUndo = await exportadoActual(page);
  const aparienciasUndo = exportadoUndo.modelo.opds["opd-1"]?.apariencias ?? {};
  for (const [id, apariencia] of Object.entries(aparienciasInicial)) {
    expect(aparienciasUndo[id]?.x).toBe(apariencia.x);
    expect(aparienciasUndo[id]?.y).toBe(apariencia.y);
  }

  expect(pageErrors).toEqual([]);
});

test("aplicar layout en OPD vacio no rompe ni cambia el ledger", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await esperarWorkbenchInicial(page);

  // No hay apariencias todavia. Click no debe romper.
  await clickToolbarMasItem(page, "toolbar-mas-auto-layout");
  // Mensaje "Layout ya esta aplicado" puede o no aparecer; lo importante
  // es que no haya pageerror ni alteracion del estado.
  await expect(page.locator(".joint-element")).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

// Ronda 27 III.A cierre: `clickToolbarMasItem` se importa canonicamente
// desde `_smoke-helpers` y resuelve via menú principal `☰`.
