// Sonda visual rápida contra producción para BUG-20260606T041330Z-1f46fe
// Captura: bienvenida, HODOM SD0, header close-up, panel derecho close-up.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const URL_OBJETIVO = process.argv[2] ?? "https://opforja.sanixai.com/";
const DIR_SHOTS = resolve(import.meta.dirname, "..", "test-results", "bug-1f46fe-sonda");
mkdirSync(DIR_SHOTS, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 963 } });
const page = await ctx.newPage();

const consoleErrors = [];
const pageErrors = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
page.on("pageerror", (e) => pageErrors.push(String(e)));

await page.goto(URL_OBJETIVO, { waitUntil: "networkidle", timeout: 30000 });

// 01 — bienvenida (cold)
await page.waitForTimeout(400);
await page.screenshot({ path: resolve(DIR_SHOTS, "01-bienvenida.png") });

// Cerrar bienvenida con el botón de empezar
const empezar = page.getByRole("button", { name: /Empezar vac[ií]o|Nuevo vac[ií]o|Modelo vac[ií]o|Manos a la obra|Trabajar en vac[ií]o|Trabajar en blanco|Continuar vac[ií]o|Abrir ejemplo|Continuar/i }).first();
if (await empezar.count() > 0) {
  try { await empezar.click({ timeout: 2000 }); } catch { /* guard-catch: boton opcional segun fixture */ }
}
await page.waitForTimeout(500);

// 02 — estado tras bienvenida
await page.screenshot({ path: resolve(DIR_SHOTS, "02-post-bienvenida.png") });

// 03 — closeup header (toolbar)
try {
  const header = page.locator('[data-testid="codex-frame"] > header').first();
  if (await header.count() > 0) {
    await header.screenshot({ path: resolve(DIR_SHOTS, "03-header-toolbar.png") });
  }
} catch (e) { console.error("header shot failed", e); }

// 04 — closeup panel derecho (Indice/OPDs)
try {
  const panel = page.getByTestId("tree-pane");
  if (await panel.count() > 0) {
    await panel.first().screenshot({ path: resolve(DIR_SHOTS, "04-panel-indice.png") });
  }
} catch (e) { console.error("tree-pane shot failed", e); }

// 05 — closeup inspector pane
try {
  const insp = page.getByTestId("inspector-pane");
  if (await insp.count() > 0) {
    await insp.first().screenshot({ path: resolve(DIR_SHOTS, "05-inspector-pane.png") });
  }
} catch (e) { console.error("inspector-pane shot failed", e); }

// 06 — closeup left pane (OPL)
try {
  const opl = page.getByTestId("panel-opl");
  if (await opl.count() > 0) {
    await opl.first().screenshot({ path: resolve(DIR_SHOTS, "06-panel-opl.png") });
  }
} catch (e) { console.error("opl shot failed", e); }

// 07 — viewport completo cold
await page.screenshot({ path: resolve(DIR_SHOTS, "07-fullpost.png"), fullPage: false });

// Medir alturas reales de los elementos sospechosos
const medidas = await page.evaluate(() => {
  function bbox(sel) {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  }
  const headerEl = document.querySelector('[data-testid="codex-frame"] > header');
  const headerH = headerEl ? headerEl.getBoundingClientRect().height : null;
  const headerStyle = headerEl ? getComputedStyle(headerEl) : null;
  const treePaneEl = document.querySelector('[data-testid="tree-pane"]');
  const treePaneH = treePaneEl ? treePaneEl.getBoundingClientRect().height : null;
  let colHeaderRect = null;
  let colHeaderH = null;
  let colHeaderStyle = null;
  if (treePaneEl) {
    const ch = treePaneEl.querySelector('header');
    if (ch) {
      colHeaderRect = ch.getBoundingClientRect();
      colHeaderH = colHeaderRect.height;
      colHeaderStyle = {
        padding: getComputedStyle(ch).padding,
        gridTemplateRows: getComputedStyle(ch).gridTemplateRows,
        fontSize: getComputedStyle(ch.querySelector('strong')).fontSize,
        lineHeight: getComputedStyle(ch.querySelector('strong')).lineHeight,
        rowGap: getComputedStyle(ch).rowGap,
      };
    }
  }
  // toolbar children
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
    header: { h: headerH, padding: headerStyle?.padding, height: headerStyle?.height, gridTemplateRows: headerStyle?.gridTemplateRows, alignItems: headerStyle?.alignItems },
    toolbar: { tallestButton, bbox: bbox('[data-testid="toolbar-root"]') },
    treePane: { h: treePaneH, bbox: bbox('[data-testid="tree-pane"]') },
    colHeader: { h: colHeaderH, rect: colHeaderRect && { x: colHeaderRect.x, y: colHeaderRect.y, w: colHeaderRect.width }, style: colHeaderStyle },
  };
});

console.log("MEDIDAS:", JSON.stringify(medidas, null, 2));
console.log("PAGE_ERRORS:", pageErrors.length, pageErrors);
console.log("CONSOLE_ERRORS:", consoleErrors.length, consoleErrors);

await browser.close();
