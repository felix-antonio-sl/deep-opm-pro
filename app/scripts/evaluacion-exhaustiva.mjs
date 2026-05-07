// Pasada evaluativa exhaustiva: todas las zonas, 8 demos, 6 dialogos,
// responsive, axe-core via CDN, perf timing. Sin tocar codigo.
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const URL = process.argv[2] ?? "http://localhost:5173/";
const RAIZ = resolve(import.meta.dirname, "..", "..");
const DIR = resolve(RAIZ, "app/_eval-output/ronda-3");
mkdirSync(DIR, { recursive: true });

const findings = [];
const errors = [];
const a11yPorRuta = {};
const perfPorRuta = {};
const datosCanon = {};

const browser = await chromium.launch({ headless: true });

function record(zona, criterio, estado, detalle) {
  findings.push({ zona, criterio, estado, detalle });
}

async function nuevoPage(viewport = { width: 1440, height: 900 }) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push({ tipo: "pageerror", msg: e.message }));
  page.on("console", (m) => { if (m.type() === "error") errors.push({ tipo: "console.error", msg: m.text() }); });
  page.on("requestfailed", (r) => { if (!/favicon/.test(r.url())) errors.push({ tipo: "requestfailed", url: r.url(), reason: r.failure()?.errorText }); });
  return { ctx, page };
}

async function ruta(nombre, fn) {
  console.log(`>> ${nombre}`);
  try {
    await fn();
    console.log(`<< ${nombre} OK`);
  } catch (e) {
    console.log(`<< ${nombre} FAIL: ${e.message?.slice(0, 200)}`);
    record(nombre, "ruta-completa", "FAIL", e.message?.slice(0, 200));
  }
}

async function inyectarAxe(page) {
  const ya = await page.evaluate(() => !!window.axe);
  if (!ya) {
    await page.addScriptTag({ url: "https://cdn.jsdelivr.net/npm/axe-core@4.10.2/axe.min.js" }).catch(()=>{});
  }
}

async function correrAxe(page, ruta) {
  await inyectarAxe(page);
  const ok = await page.evaluate(() => !!window.axe);
  if (!ok) return null;
  const res = await page.evaluate(async () => {
    // @ts-ignore
    return window.axe.run(document, { resultTypes: ["violations"], runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } });
  });
  a11yPorRuta[ruta] = {
    violaciones: res.violations.length,
    detalle: res.violations.map(v => ({
      id: v.id, impact: v.impact, help: v.help,
      nodos: v.nodes.length,
      target: v.nodes[0]?.target,
      summary: v.nodes[0]?.failureSummary?.slice(0, 200)
    }))
  };
  return res;
}

async function medirPerf(page, ruta) {
  const m = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paints = performance.getEntriesByType("paint");
    return {
      domContentLoaded: nav?.domContentLoadedEventEnd ?? null,
      loadEvent: nav?.loadEventEnd ?? null,
      transferSize: nav?.transferSize ?? null,
      domNodes: document.querySelectorAll('*').length,
      botones: document.querySelectorAll('button').length,
      svgEls: document.querySelectorAll('svg *').length,
      paint: Object.fromEntries(paints.map(p => [p.name, p.startTime])),
    };
  });
  perfPorRuta[ruta] = m;
  return m;
}

async function shot(page, nombre) {
  await page.screenshot({ path: resolve(DIR, `${nombre}.png`), fullPage: false }).catch(()=>{});
}

async function shotFull(page, nombre) {
  await page.screenshot({ path: resolve(DIR, `${nombre}.png`), fullPage: true }).catch(()=>{});
}

async function dumpCanon(page) {
  return await page.evaluate(() => {
    const svg = document.querySelector('svg');
    if (!svg) return null;
    const rects = Array.from(svg.querySelectorAll('rect[fill]')).slice(0, 20).map(r => ({
      fill: r.getAttribute('fill'), stroke: r.getAttribute('stroke'),
      sw: r.getAttribute('stroke-width'), sd: r.getAttribute('stroke-dasharray'),
      filter: r.getAttribute('filter')?.slice(0, 40)
    }));
    const ellipses = Array.from(svg.querySelectorAll('ellipse[fill]')).slice(0,10).map(e => ({
      fill: e.getAttribute('fill'), stroke: e.getAttribute('stroke'),
      sw: e.getAttribute('stroke-width'), sd: e.getAttribute('stroke-dasharray')
    }));
    const paths = svg.querySelectorAll('path').length;
    const polygons = svg.querySelectorAll('polygon').length;
    const labels = Array.from(svg.querySelectorAll('text')).slice(0, 8).map(t => ({
      t: t.textContent?.slice(0,20), font: t.getAttribute('font-family'),
      size: t.getAttribute('font-size'), w: t.getAttribute('font-weight')
    }));
    return { rects, ellipses, pathsCount: paths, polygonsCount: polygons, labels };
  });
}

// ============================================================
// RUTA 1: Carga inicial + chrome vacio
// ============================================================
{
  const { ctx, page } = await nuevoPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 25000 });
  await page.waitForTimeout(800);
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);

  await shot(page, "01-carga-inicial");
  await shotFull(page, "01b-carga-fullpage");
  await medirPerf(page, "carga-inicial");
  await correrAxe(page, "carga-inicial");

  // Toolbar overflow
  const tb = await page.evaluate(() => {
    const cont = Array.from(document.querySelectorAll('div')).find(el => el.scrollWidth > el.clientWidth + 100 && el.children.length > 5);
    return cont ? { sw: cont.scrollWidth, cw: cont.clientWidth, delta: cont.scrollWidth - cont.clientWidth } : null;
  });
  record("toolbar", "overflow-horizontal", tb && tb.delta > 0 ? "WARN" : "OK", tb);

  // Botones inicialmente disabled
  const dis = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('button')).filter(b => b.offsetParent !== null);
    const disabled = all.filter(b => b.disabled);
    return { total: all.length, disabled: disabled.length, ratio: disabled.length / all.length };
  });
  record("toolbar", "ratio-disabled-inicial", dis.ratio > 0.20 ? "WARN" : "OK", dis);

  await ctx.close();
}

// ============================================================
// RUTA 2: Cada uno de los 8 demos
// ============================================================
const DEMOS = ["Cafetera Domestica", "OnStar System", "Diagnostico Clinico", "SD Generico", "Logistica de Envios", "SD Async", "Control de Calidad", "Ejemplo organizacional"];
{
  const { ctx, page } = await nuevoPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 25000 });
  await page.waitForTimeout(700);

  for (let i = 0; i < DEMOS.length; i++) {
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    await page.selectOption('select', { index: i + 1 }).catch(()=>{});
    await page.waitForTimeout(900);
    const slug = DEMOS[i].toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await shot(page, `02-demo-${i+1}-${slug}`);
    datosCanon[slug] = await dumpCanon(page);
    if (i === 0) {
      // Para Cafetera, axe + perf
      await medirPerf(page, "demo-cafetera");
      await correrAxe(page, "demo-cafetera");
    }
  }
  await ctx.close();
}

// ============================================================
// RUTA 3: Toolbar en distintos estados
// ============================================================
{
  const { ctx, page } = await nuevoPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 25000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.selectOption('select', { index: 1 }).catch(()=>{});
  await page.waitForTimeout(800);

  // Sin seleccion
  await page.keyboard.press("Escape");
  await shot(page, "03-toolbar-sin-seleccion");

  // Con entidad objeto
  const persona = page.locator('text="Persona"').first();
  if (await persona.isVisible()) {
    await persona.click({ force: true });
    await page.waitForTimeout(300);
    await shot(page, "03-toolbar-con-objeto");
  }

  // Con entidad proceso
  const proc = page.locator('text="Hacer Cafe"').first();
  if (await proc.isVisible()) {
    await proc.click({ force: true });
    await page.waitForTimeout(300);
    await shot(page, "03-toolbar-con-proceso");
  }

  // Multi-seleccion (Ctrl+A o atajo)
  await page.keyboard.press("Control+a").catch(()=>{});
  await page.waitForTimeout(300);
  await shot(page, "03-toolbar-multi-seleccion");

  await ctx.close();
}

// ============================================================
// RUTA 4: Inspector con cada tipo
// ============================================================
{
  const { ctx, page } = await nuevoPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 25000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.selectOption('select', { index: 1 }).catch(()=>{});
  await page.waitForTimeout(800);

  // Sin seleccion
  await page.keyboard.press("Escape");
  await shot(page, "04-inspector-sin-seleccion");

  // Inspector entidad
  const persona = page.locator('text="Persona"').first();
  await persona.click({ force: true });
  await page.waitForTimeout(400);
  await shotFull(page, "04-inspector-entidad-fullpage");
  await medirPerf(page, "inspector-entidad");
  await correrAxe(page, "inspector-entidad");

  // Inspector proceso
  const proc = page.locator('text="Hacer Cafe"').first();
  await proc.click({ force: true });
  await page.waitForTimeout(400);
  await shotFull(page, "04-inspector-proceso-fullpage");

  // Inspector enlace (click en path)
  const path = page.locator('svg path').first();
  if (await path.isVisible().catch(()=>false)) {
    await path.click({ force: true });
    await page.waitForTimeout(400);
    await shot(page, "04-inspector-enlace");
  }

  await ctx.close();
}

// ============================================================
// RUTA 5: Panel OPL en distintos estados
// ============================================================
{
  const { ctx, page } = await nuevoPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 25000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);

  // OPL vacio
  await shot(page, "05-opl-vacio");

  await page.selectOption('select', { index: 1 }).catch(()=>{});
  await page.waitForTimeout(900);
  // OPL con oraciones
  await shot(page, "05-opl-cafetera");

  // OPL minimizado
  const minBtn = page.locator('button[aria-label*="inimizar" i]').first();
  if (await minBtn.isVisible().catch(()=>false)) {
    await minBtn.click();
    await page.waitForTimeout(300);
    await shot(page, "05-opl-minimizado");
  }

  // OPL filtrado por seleccion
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.selectOption('select', { index: 1 }).catch(()=>{});
  await page.waitForTimeout(800);
  const filtro = page.locator('input[type="checkbox"]:near(:text("Filtrar por selección"))').first();
  if (await filtro.isVisible().catch(()=>false)) {
    await filtro.check();
    const proc = page.locator('text="Hacer Cafe"').first();
    if (await proc.isVisible()) await proc.click({ force: true });
    await page.waitForTimeout(400);
    await shot(page, "05-opl-filtrado");
  }

  await ctx.close();
}

// ============================================================
// RUTA 6: Dialogos modales
// ============================================================
{
  const { ctx, page } = await nuevoPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 25000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.selectOption('select', { index: 1 }).catch(()=>{});
  await page.waitForTimeout(800);

  async function abrirYevaluar(nombre, abrir, cerrar = async ()=>page.keyboard.press("Escape")) {
    try { await abrir(); } catch {}
    await page.waitForTimeout(500);
    await shot(page, `06-dialogo-${nombre}`);
    const meta = await page.evaluate(() => {
      const dlg = document.querySelector('[role="dialog"]');
      if (!dlg) return null;
      return {
        role: dlg.getAttribute('role'),
        labelledby: dlg.getAttribute('aria-labelledby'),
        modal: dlg.getAttribute('aria-modal'),
        rect: dlg.getBoundingClientRect(),
        hasHeading: !!dlg.querySelector('h1,h2,h3'),
        focusInside: dlg.contains(document.activeElement),
        ctas: Array.from(dlg.querySelectorAll('button')).slice(-3).map(b => ({ texto: b.textContent?.trim().slice(0,20), aria: b.getAttribute('aria-label') }))
      };
    });
    record("dialogos", `dialogo-${nombre}`, meta ? "OK" : "FAIL", meta);
    if (meta) await correrAxe(page, `dialogo-${nombre}`);
    try { await cerrar(); } catch {}
    await page.waitForTimeout(300);
  }

  await abrirYevaluar("plantillas", () => page.click('button:has-text("Plantillas")'));
  await abrirYevaluar("cargar", async () => {
    const cargares = await page.locator('button:has-text("Cargar")').all();
    for (const c of cargares) { if (await c.isEnabled()) { await c.click(); break; } }
  });
  await abrirYevaluar("config-grid", () => page.click('button:has-text("Config grid")'));
  await abrirYevaluar("buscar-global", () => page.keyboard.press("Control+Shift+f"));
  await abrirYevaluar("biblioteca", () => page.click('button:has-text("Biblioteca")'));
  await abrirYevaluar("menu-principal", () => page.click('button[aria-label="Menú principal"]'));

  await ctx.close();
}

// ============================================================
// RUTA 7: Mapa del sistema + arbol multi-OPD
// ============================================================
{
  const { ctx, page } = await nuevoPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 25000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.selectOption('select', { index: 1 }).catch(()=>{});
  await page.waitForTimeout(800);

  await page.click('[data-opd-id="__mapa__"]').catch(()=>{});
  await page.waitForTimeout(700);
  await shot(page, "07-mapa-sistema");

  // Volver al SD
  const sd = page.locator('[role="treeitem"]').filter({ hasText: 'SD' }).first();
  await sd.click().catch(()=>{});
  await page.waitForTimeout(500);

  // Click derecho en SD: menu contextual
  const sdNode = await page.locator('[role="treeitem"]').filter({ hasText: 'SD' }).first();
  await sdNode.click({ button: "right" }).catch(()=>{});
  await page.waitForTimeout(400);
  await shot(page, "07-arbol-menu-contextual");
  await page.keyboard.press("Escape");

  await ctx.close();
}

// ============================================================
// RUTA 8: Refinamiento real (in-zoom desde inspector)
// ============================================================
{
  const { ctx, page } = await nuevoPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 25000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.selectOption('select', { index: 1 }).catch(()=>{});
  await page.waitForTimeout(800);

  const proc = page.locator('text="Hacer Cafe"').first();
  await proc.click({ force: true });
  await page.waitForTimeout(400);

  // Buscar boton "Descomponer" o "In-zoom"
  const inzoom = page.locator('button:has-text("Descomponer"), button:has-text("In-zoom"), button:has-text("Como partes")').first();
  if (await inzoom.isVisible().catch(()=>false)) {
    await inzoom.click();
    await page.waitForTimeout(800);
    await shot(page, "08-refinamiento-inzoom");
    record("refinamiento", "boton-descomponer-disponible", "OK", null);
  } else {
    record("refinamiento", "boton-descomponer-disponible", "WARN", "no encontrado en inspector");
  }

  // Estado del arbol post in-zoom
  const arbol = await page.evaluate(() => Array.from(document.querySelectorAll('[role="treeitem"]')).map(it => it.textContent?.trim().slice(0,40)));
  record("refinamiento", "arbol-tras-inzoom", "INFO", arbol);

  await ctx.close();
}

// ============================================================
// RUTA 9: Estados embebidos + atributos
// ============================================================
{
  const { ctx, page } = await nuevoPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 25000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);

  // Ejemplo organizacional puede tener atributos/estados
  await page.selectOption('select', { index: 8 }).catch(()=>{});
  await page.waitForTimeout(900);
  await shot(page, "09-ejemplo-organizacional");
  datosCanon["ejemplo-organizacional"] = await dumpCanon(page);

  // Diagnostico clinico tiene mas variedad probable
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.selectOption('select', { index: 3 }).catch(()=>{});
  await page.waitForTimeout(900);
  await shot(page, "09-diagnostico-clinico");

  await ctx.close();
}

// ============================================================
// RUTA 10: Validacion firma OPM + JSON invalido
// ============================================================
{
  const { ctx, page } = await nuevoPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 25000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);

  // JSON invalido
  const ta = page.locator('textarea[data-testid="textarea-json"]').first();
  if (await ta.isVisible().catch(()=>false)) {
    await ta.fill('{"opds": null, "broken": true');
    await page.waitForTimeout(300);
    const importar = page.locator('button:has-text("Importar")').first();
    if (await importar.isVisible().catch(()=>false)) {
      await importar.click();
      await page.waitForTimeout(500);
    }
    await shot(page, "10-error-json-invalido");
    const errMsg = await page.evaluate(() => document.querySelector('[role="alert"]')?.textContent?.trim());
    record("errores", "mensaje-json-invalido", errMsg ? "OK" : "FAIL", errMsg);
  }

  await ctx.close();
}

// ============================================================
// RUTA 11: Responsive 1024 y 1920
// ============================================================
{
  for (const vp of [{ width: 1024, height: 700, slug: "1024x700" }, { width: 1920, height: 1080, slug: "1920x1080" }]) {
    const { ctx, page } = await nuevoPage(vp);
    await page.goto(URL, { waitUntil: "networkidle", timeout: 25000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    await page.selectOption('select', { index: 1 }).catch(()=>{});
    await page.waitForTimeout(800);
    await shot(page, `11-responsive-${vp.slug}`);
    const overflow = await page.evaluate(() => ({
      bodyOverflow: document.body.scrollWidth > document.body.clientWidth,
      bodyW: document.body.scrollWidth, bodyCW: document.body.clientWidth,
    }));
    record("responsive", `overflow-${vp.slug}`, overflow.bodyOverflow ? "WARN" : "OK", overflow);
    await ctx.close();
  }
}

// ============================================================
// RUTA 12: Hover states (sample)
// ============================================================
{
  const { ctx, page } = await nuevoPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 25000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.selectOption('select', { index: 1 }).catch(()=>{});
  await page.waitForTimeout(800);

  // Hover sobre boton toolbar
  const objBtn = page.locator('button:has-text("Modo objeto")').first();
  if (await objBtn.isVisible()) {
    await objBtn.hover();
    await page.waitForTimeout(400);
    await shot(page, "12-hover-modo-objeto");
  }

  // Hover sobre cosa en canvas (force porque rect intercepta tspan)
  const persona = page.locator('text="Persona"').first();
  if (await persona.isVisible()) {
    try {
      await persona.hover({ force: true, timeout: 5000 });
      await page.waitForTimeout(300);
      await shot(page, "12-hover-cosa-canvas");
    } catch (e) {
      record("hover", "cosa-canvas", "WARN", e.message?.slice(0, 100));
    }
  }

  await ctx.close();
}

// ============================================================
// CIERRE: dump JSON
// ============================================================
writeFileSync(resolve(DIR, "_evaluacion-exhaustiva.json"), JSON.stringify({
  fecha: new Date().toISOString(),
  url: URL,
  totalCriterios: findings.length,
  ok: findings.filter(f => f.estado === "OK").length,
  warn: findings.filter(f => f.estado === "WARN").length,
  fail: findings.filter(f => f.estado === "FAIL").length,
  info: findings.filter(f => f.estado === "INFO").length,
  errors,
  a11yPorRuta,
  perfPorRuta,
  datosCanon,
  findings,
}, null, 2));

console.log("EVAL exhaustiva OK -",
  "criterios:", findings.length,
  "errors:", errors.length,
  "axe rutas:", Object.keys(a11yPorRuta).length,
  "axe violaciones totales:", Object.values(a11yPorRuta).reduce((s, r) => s + (r.violaciones || 0), 0));
await browser.close();
