// Sonda visual de busqueda de desajustes en dev server (con el fix aplicado)
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const URL_OBJETIVO = process.argv[2] ?? "http://127.0.0.1:5270/";
const DIR_SHOTS = resolve(import.meta.dirname, "..", "test-results", "bug-1f46fe-busqueda");
mkdirSync(DIR_SHOTS, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 963 } });
const page = await ctx.newPage();

const consoleErrors = [];
const pageErrors = [];
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
page.on("pageerror", (e) => pageErrors.push(String(e)));

await page.goto(URL_OBJETIVO, { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(600);

// cerrar bienvenida
for (const sel of [
  page.getByRole("button", { name: /Empezar vac[ií]o|Nuevo vac[ií]o|Trabajar en blanco|Continuar vac[ií]o/i }).first(),
  page.getByRole("link", { name: /Empezar vac[ií]o|Nuevo|Continuar/i }).first(),
]) {
  if (await sel.count() > 0) { try { await sel.click({ timeout: 1500 }); break; } catch {} }
}
await page.waitForTimeout(500);

// 1) abrir el diálogo de cargar
const menuPrincipal = page.getByLabel("Menú principal");
let menuAbierto = false;
if (await menuPrincipal.count() > 0) {
  await menuPrincipal.first().click();
  await page.waitForTimeout(300);
  const item = page.getByRole("menuitem", { name: /Abrir \/ importar|Abrir modelo/i });
  if (await item.count() > 0) {
    await item.first().click();
    menuAbierto = true;
  }
}
await page.waitForTimeout(400);
await page.screenshot({ path: resolve(DIR_SHOTS, "dialogo-cargar.png") });

if (menuAbierto) {
  // buscar HODOM en el listado
  const hodomRow = page.getByText(/HODOM/i).first();
  if (await hodomRow.count() > 0) {
    await hodomRow.click({ timeout: 2000 }).catch(() => undefined);
    await page.waitForTimeout(200);
    const abrir = page.getByRole("button", { name: /^Abrir$/i });
    if (await abrir.count() > 0) {
      await abrir.first().click().catch(() => undefined);
      await page.waitForTimeout(800);
    }
  }
}
await page.screenshot({ path: resolve(DIR_SHOTS, "post-cargar-hodom.png") });

// 2) Click en un elemento del canvas si existe
const firstEntity = page.locator('.joint-element').first();
if (await firstEntity.count() > 0) {
  try { await firstEntity.click({ timeout: 1500 }); await page.waitForTimeout(400); } catch {}
}
await page.screenshot({ path: resolve(DIR_SHOTS, "con-seleccion.png") });

// 3) command palette
await page.keyboard.press("Control+k").catch(() => undefined);
await page.waitForTimeout(400);
await page.screenshot({ path: resolve(DIR_SHOTS, "command-palette.png") });
await page.keyboard.press("Escape").catch(() => undefined);
await page.waitForTimeout(200);

// 4) hover sobre una entidad para ver si hay affordances
if (await firstEntity.count() > 0) {
  try { await firstEntity.hover({ timeout: 1500 }); await page.waitForTimeout(400); } catch {}
}
await page.screenshot({ path: resolve(DIR_SHOTS, "hover-entidad.png") });

// 5) zoom in / out
await page.keyboard.press("Control+Equal").catch(() => undefined);
await page.waitForTimeout(300);
await page.screenshot({ path: resolve(DIR_SHOTS, "zoom-in.png") });
await page.keyboard.press("Control+Minus").catch(() => undefined);
await page.waitForTimeout(300);
await page.screenshot({ path: resolve(DIR_SHOTS, "zoom-out.png") });

// 6) Crear objeto O
await page.keyboard.press("o").catch(() => undefined);
await page.waitForTimeout(400);
await page.screenshot({ path: resolve(DIR_SHOTS, "crear-objeto.png") });

// mediciones finales
const medidas = await page.evaluate(() => {
  function bbox(sel) {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  }
  const headerEl = document.querySelector('[data-testid="codex-frame"] > header');
  const treePaneEl = document.querySelector('[data-testid="tree-pane"]');
  const oplPaneEl = document.querySelector('[data-testid="opl-pane"]');
  const colHeaderT = treePaneEl ? treePaneEl.querySelector('header') : null;
  const colHeaderO = oplPaneEl ? oplPaneEl.querySelector('header') : null;
  return {
    header: { h: headerEl?.getBoundingClientRect().height, bbox: bbox('[data-testid="codex-frame"] > header') },
    treePane: bbox('[data-testid="tree-pane"]'),
    oplPane: bbox('[data-testid="opl-pane"]'),
    colHeaderT: colHeaderT ? { h: colHeaderT.getBoundingClientRect().height, gridRows: getComputedStyle(colHeaderT).gridTemplateRows } : null,
    colHeaderO: colHeaderO ? { h: colHeaderO.getBoundingClientRect().height, gridRows: getComputedStyle(colHeaderO).gridTemplateRows } : null,
    inspector: bbox('[data-testid="inspector-pane"]'),
  };
});
console.log("MEDIDAS:", JSON.stringify(medidas, null, 2));
console.log("pageErrors:", pageErrors.length, pageErrors.slice(0, 3));
console.log("consoleErrors:", consoleErrors.length, consoleErrors.slice(0, 3));

await browser.close();
