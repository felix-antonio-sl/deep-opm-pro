// Sonda visual exhaustiva contra producción para BUG-20260606T041330Z-1f46fe
// Captura: bienvenida, post-bienvenida, header close-up, paneles, inspector con selección,
// command palette, mobile/tablet. Mide alturas reales.
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const URL_OBJETIVO = process.argv[2] ?? "https://opforja.sanixai.com/";
const DIR_SHOTS = resolve(import.meta.dirname, "..", "test-results", "bug-1f46fe-exhaustivo");
mkdirSync(DIR_SHOTS, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function newSession(w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("pageerror", (e) => pageErrors.push(String(e)));
  return { ctx, page, consoleErrors, pageErrors };
}

async function closeBienvenida(page) {
  // El primer botón suele ser "Empezar vacío", "Nuevo", o similar
  const candidates = [
    page.getByRole("button", { name: /Empezar vac[ií]o/i }).first(),
    page.getByRole("button", { name: /^Nuevo vac[ií]o$/i }).first(),
    page.getByRole("button", { name: /Trabajar en blanco|Trabajar en vac[ií]o/i }).first(),
    page.getByRole("link", { name: /Empezar vac[ií]o|Nuevo/i }).first(),
  ];
  for (const c of candidates) {
    if (await c.count() > 0) {
      try { await c.click({ timeout: 2000 }); return true; } catch { /* guard-catch: candidato alternativo puede fallar */ }
    }
  }
  return false;
}

async function cargarHodom(page) {
  // Intentar cargar HODOM desde el menú principal
  const menu = page.getByLabel("Menú principal");
  if (await menu.count() === 0) return false;
  await menu.click();
  const item = page.getByRole("menuitem", { name: /Abrir \/ importar|Cargar modelo/i });
  if (await item.count() === 0) return false;
  await item.first().click();
  const dialogo = page.getByTestId("dialogo-abrir-importar")
    .or(page.getByRole("dialog", { name: /Abrir \/ importar modelo|Cargar modelo/ }));
  if (await dialogo.count() === 0) return false;
  await dialogo.first().waitFor({ state: "visible", timeout: 2000 }).catch(() => undefined);
  const sel = dialogo.getByLabel("Cargar modelo de ejemplo");
  if (await sel.count() === 0) return false;
  // Buscar opción HODOM
  const opts = await sel.locator("option").all();
  let hodomValue = null;
  for (const o of opts) {
    const t = (await o.textContent() ?? "").toLowerCase();
    if (t.includes("hodom")) { hodomValue = await o.getAttribute("value"); break; }
  }
  if (!hodomValue) {
    // fallback: primer ejemplo disponible
    hodomValue = await opts[1]?.getAttribute("value") ?? null;
  }
  if (!hodomValue) return false;
  await sel.selectOption(hodomValue);
  await dialogo.first().waitFor({ state: "detached", timeout: 5000 }).catch(() => undefined);
  await page.waitForTimeout(800);
  return true;
}

async function medir(page) {
  return await page.evaluate(() => {
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
    const toolbar = document.querySelector('[data-testid="toolbar-root"]');
    let tallestButton = 0;
    if (toolbar) {
      for (const c of toolbar.querySelectorAll('button')) {
        const r = c.getBoundingClientRect();
        if (r.height > tallestButton) tallestButton = r.height;
      }
    }
    return {
      viewport: { w: window.innerWidth, h: window.innerHeight },
      header: headerEl ? { h: headerEl.getBoundingClientRect().height } : null,
      toolbar: { tallestButton, h: toolbar?.getBoundingClientRect().height ?? null },
      treePane: treePaneEl ? { h: treePaneEl.getBoundingClientRect().height, w: treePaneEl.getBoundingClientRect().width } : null,
      oplPane: oplPaneEl ? { h: oplPaneEl.getBoundingClientRect().height, w: oplPaneEl.getBoundingClientRect().width } : null,
      colHeaderT: colHeaderT ? { h: colHeaderT.getBoundingClientRect().height, gridRows: getComputedStyle(colHeaderT).gridTemplateRows } : null,
      colHeaderO: colHeaderO ? { h: colHeaderO.getBoundingClientRect().height, gridRows: getComputedStyle(colHeaderO).gridTemplateRows } : null,
    };
  });
}

const findings = [];
function record(seccion, criterio, ok, detalle) {
  findings.push({ seccion, criterio, ok, detalle });
  console.log(`${ok ? "OK" : "FAIL"} | ${seccion} | ${criterio}${detalle ? " - " + detalle : ""}`);
}

// ============ ESCRITORIO 1920x963 ============
{
  const { ctx, page, consoleErrors, pageErrors } = await newSession(1920, 963);
  await page.goto(URL_OBJETIVO, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: resolve(DIR_SHOTS, "01-1920-bienvenida.png") });
  record("carga", "no hay pageErrors al cargar", pageErrors.length === 0, `pageErrors=${pageErrors.length}`);
  record("carga", "no hay console errors", consoleErrors.length === 0, `consoleErrors=${consoleErrors.length}`);

  const cerrada = await closeBienvenida(page);
  record("navegación", "cerrar bienvenida OK", cerrada);
  await page.waitForTimeout(500);
  await page.screenshot({ path: resolve(DIR_SHOTS, "02-1920-post-bienvenida.png") });

  // Header close-up
  const header = page.locator('[data-testid="codex-frame"] > header').first();
  if (await header.count() > 0) {
    await header.screenshot({ path: resolve(DIR_SHOTS, "03-1920-header.png") });
  }
  // Paneles
  const tp = page.getByTestId("tree-pane");
  if (await tp.count() > 0) await tp.first().screenshot({ path: resolve(DIR_SHOTS, "04-1920-tree.png") });
  const op = page.getByTestId("opl-pane");
  if (await op.count() > 0) await op.first().screenshot({ path: resolve(DIR_SHOTS, "05-1920-opl.png") });
  const insp = page.getByTestId("inspector-pane");
  if (await insp.count() > 0) await insp.first().screenshot({ path: resolve(DIR_SHOTS, "06-1920-inspector.png") });

  const m1 = await medir(page);
  console.log("MEDIDAS desktop-vacio:", JSON.stringify(m1, null, 2));
  record("header", "altura del header razonable (<= 56px)", m1.header.h <= 56, `header.h=${m1.header.h}`);
  record("colHeader.right", "crece con contenido (>= 40px)", m1.colHeaderT && m1.colHeaderT.h >= 40, `colHeaderT.h=${m1.colHeaderT?.h}`);
  record("colHeader.left", "crece con contenido (>= 40px)", m1.colHeaderO && m1.colHeaderO.h >= 40, `colHeaderO.h=${m1.colHeaderO?.h}`);

  // Intentar cargar HODOM
  const hodomOk = await cargarHodom(page);
  record("navegación", "cargar HODOM", hodomOk);
  await page.waitForTimeout(800);
  await page.screenshot({ path: resolve(DIR_SHOTS, "07-1920-hodom.png") });
  if (hodomOk) {
    const m2 = await medir(page);
    console.log("MEDIDAS desktop-hodom:", JSON.stringify(m2, null, 2));
    // Capturar panel inspector con selección (click en primer elemento del canvas)
    const firstEntity = page.locator('.joint-element').first();
    if (await firstEntity.count() > 0) {
      try { await firstEntity.click({ timeout: 1500 }); await page.waitForTimeout(400); } catch { /* guard-catch: entidad opcional para sonda */ }
    }
    await page.screenshot({ path: resolve(DIR_SHOTS, "08-1920-hodom-click.png") });
    if (await insp.count() > 0) await insp.first().screenshot({ path: resolve(DIR_SHOTS, "09-1920-inspector-con-contenido.png") });
  }

  // Probar command palette
  await page.keyboard.press("Control+K").catch(() => undefined);
  await page.waitForTimeout(400);
  await page.screenshot({ path: resolve(DIR_SHOTS, "10-1920-command-palette.png") });
  await page.keyboard.press("Escape").catch(() => undefined);

  await ctx.close();
}

// ============ TABLET 1024x720 ============
{
  const { ctx, page, consoleErrors, pageErrors } = await newSession(1024, 720);
  await page.goto(URL_OBJETIVO, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(400);
  await closeBienvenida(page);
  await page.waitForTimeout(400);
  await page.screenshot({ path: resolve(DIR_SHOTS, "11-1024-vista.png") });
  const m = await medir(page);
  console.log("MEDIDAS tablet:", JSON.stringify(m, null, 2));
  record("tablet", "header cabe <= 56px", m.header.h <= 56, `header.h=${m.header.h}`);
  await ctx.close();
}

// ============ MOBILE 390x844 ============
{
  const { ctx, page, consoleErrors, pageErrors } = await newSession(390, 844);
  await page.goto(URL_OBJETIVO, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(400);
  await closeBienvenida(page);
  await page.waitForTimeout(400);
  await page.screenshot({ path: resolve(DIR_SHOTS, "12-390-mobile.png") });
  const m = await medir(page);
  console.log("MEDIDAS mobile:", JSON.stringify(m, null, 2));
  record("mobile", "header mobile no colapsa", m.header !== null, `header=${JSON.stringify(m.header)}`);
  await ctx.close();
}

console.log("\n=== RESUMEN ===");
const fails = findings.filter(f => !f.ok);
console.log(`Total: ${findings.length}, FAIL: ${fails.length}`);

writeFileSync(resolve(DIR_SHOTS, "_findings.json"), JSON.stringify(findings, null, 2));

await browser.close();
