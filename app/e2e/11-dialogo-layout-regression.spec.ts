/**
 * Smoke focal — regresion de layout/paint del componente Dialogo cuando
 * convive con el workbench grid + canvas SVG/composite layers.
 *
 * Contexto (ronda 15 L1):
 * - `<main>` usa `display: grid` con filas `48px 37px minmax(0, 1fr) auto`.
 * - El canvas JointJS (SVG + html overlays) ocupa la mayor parte del area.
 * - Tres reverts conscientes (`789eb0e` modal-grid, `816e7bf` mask-image,
 *   `73f46ce` canvas role) sugieren que algun cambio dejaba al modal
 *   inalcanzable / con clicks robados por el SVG del paper.
 *
 * Esta spec fija el sustrato modal antes de cualquier reintroduccion:
 *  1. Un `Dialogo` ancho con grid interno (`DialogoCargarModelo`) pinta
 *     encima del canvas (paint visible + interaccion real con un control
 *     interno).
 *  2. Un modal pequeno (`ModalConfiguracionGrid`) renderizado como hijo
 *     del primer row del `<main>` grid pinta y permite editar inputs sin
 *     que el SVG del paper intercepte clicks.
 *  3. El modal vive fuera del subarbol del workbench (portal al body) para
 *     volverlo robusto frente a transform/filter/contain en cualquier
 *     ancestro del workbench (regla canonica OPCloud `cdk-overlay-pane`).
 */

import { expect, test, type Page, type Locator } from "@playwright/test";
import { cerrarPantallaInicioSiVisible } from "./_smoke-helpers";

interface Rect { x: number; y: number; width: number; height: number }

async function rectOf(locator: Locator): Promise<Rect> {
  return locator.evaluate((element) => {
    const rect = (element as HTMLElement).getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });
}

async function elementoEnPunto(page: Page, x: number, y: number): Promise<{ insideDialog: boolean; tag: string; testid: string | null }> {
  return page.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return { insideDialog: false, tag: "(null)", testid: null };
    const dialog = el.closest("[role=\"dialog\"]");
    return {
      insideDialog: Boolean(dialog),
      tag: el.tagName.toLowerCase(),
      testid: el.getAttribute("data-testid"),
    };
  }, { x, y });
}

test("[L1] DialogoCargarModelo pinta sobre canvas+grid e interactua", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByLabel("Cargar modelo de ejemplo").selectOption("Cafetera Domestica");
  await expect(page.locator(".joint-paper svg")).toHaveCount(1);

  await page.getByRole("button", { name: "Cargar", exact: true }).first().click();

  const dialogo = page.getByRole("dialog", { name: "Cargar modelo" });
  await expect(dialogo).toBeVisible();

  const bbox = await rectOf(dialogo);
  expect(bbox.width).toBeGreaterThan(200);
  expect(bbox.height).toBeGreaterThan(120);

  // Centro del dialogo es interactivo: elementFromPoint cae dentro.
  const cx = Math.round(bbox.x + bbox.width / 2);
  const cy = Math.round(bbox.y + bbox.height / 2);
  const punto = await elementoEnPunto(page, cx, cy);
  expect(punto.insideDialog, `centro del dialogo no es interactivo - elemento real: ${punto.tag}#${punto.testid ?? ""}`).toBe(true);

  // Cierre por Escape (cubre captura de teclado del Dialogo).
  await page.keyboard.press("Escape");
  await expect(dialogo).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("[L1] ModalConfiguracionGrid pinta sobre canvas SVG y acepta edicion sin clicks robados", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByLabel("Cargar modelo de ejemplo").selectOption("Cafetera Domestica");
  await expect(page.locator(".joint-paper svg")).toHaveCount(1);

  await page.getByTestId("config-grid").click();
  const modal = page.getByRole("dialog", { name: "Cuadrícula" }).or(page.getByTestId("modal-config-grid"));
  await expect(modal.first()).toBeVisible();
  const bbox = await rectOf(modal.first());
  expect(bbox.width).toBeGreaterThan(200);
  expect(bbox.height).toBeGreaterThan(150);

  // El centro del modal es interactivo (no canvas, no inspector, no
  // barra contextual). Si el SVG del paper se metiera por encima,
  // elementFromPoint caeria fuera del subarbol del modal.
  const cx = Math.round(bbox.x + bbox.width / 2);
  const cy = Math.round(bbox.y + bbox.height / 2);
  const punto = await elementoEnPunto(page, cx, cy);
  expect(punto.insideDialog, `centro del modal no es interactivo - elemento real: ${punto.tag}#${punto.testid ?? ""}`).toBe(true);

  // Edicion real: cambiar paso a 80, click en Guardar y verificar cierre.
  // Si los clicks del modal se reordenaran por debajo del SVG, este flujo
  // se cuelga (lo que era el sintoma observado tras reintroducir
  // role="application" + tabIndex sobre el viewport del paper).
  const inputPaso = modal.first().locator("input[type=\"number\"]").first();
  await inputPaso.fill("80");
  await modal.first().getByRole("button", { name: "Guardar" }).click();
  await expect(modal.first()).toHaveCount(0);

  expect(pageErrors).toEqual([]);
});

test("[L1] Dialogo se monta fuera del subarbol del workbench (portal a body)", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await cerrarPantallaInicioSiVisible(page);
  await page.getByLabel("Cargar modelo de ejemplo").selectOption("Cafetera Domestica");
  await expect(page.locator(".joint-paper svg")).toHaveCount(1);

  await page.getByRole("button", { name: "Cargar", exact: true }).first().click();
  await expect(page.getByRole("dialog", { name: "Cargar modelo" })).toBeVisible();

  // Estructura de portal: el role="dialog" no puede ser descendiente de
  // <main> ni de la barra de herramientas. Si en el futuro algun ancestro
  // del workbench introduce `transform`/`filter`/`contain: paint`, esto
  // garantiza que el modal sigue anclado al viewport (canonical OPCloud
  // `cdk-overlay-pane`, fuera del paper SVG).
  const fueraDelWorkbench = await page.evaluate(() => {
    const dialog = document.querySelector("[role=\"dialog\"]");
    if (!dialog) return { ok: false, motivo: "no-dialog" } as const;
    const main = document.querySelector("main");
    const toolbar = document.querySelector("[role=\"toolbar\"]");
    const dentroMain = Boolean(main && main.contains(dialog));
    const dentroToolbar = Boolean(toolbar && toolbar.contains(dialog));
    return {
      ok: !dentroMain && !dentroToolbar,
      motivo: `dentroMain=${dentroMain} dentroToolbar=${dentroToolbar}`,
    } as const;
  });
  expect(fueraDelWorkbench.ok, `dialogo no esta en portal: ${fueraDelWorkbench.motivo}`).toBe(true);

  expect(pageErrors).toEqual([]);
});
