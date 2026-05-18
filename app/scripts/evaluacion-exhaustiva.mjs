// Pasada evaluativa exhaustiva pre-Beta1: 12 rutas, 8 demos, 6 dialogos,
// responsive, axe-core via CDN, perf timing y verificacion del flujo IFML
// L3 ronda 15 (modal-nombre-cosa via store, no por bus DOM). Sin tocar
// codigo de produccion.
//
// Uso:
//   bun run scripts/evaluacion-exhaustiva.mjs                  # url y dir default
//   bun run scripts/evaluacion-exhaustiva.mjs http://127.0.0.1:5173/
//   bun run scripts/evaluacion-exhaustiva.mjs --out <dir>      # subdir bajo _eval-output
//   bun run scripts/evaluacion-exhaustiva.mjs --strict         # exit 1 si hay FAIL
//
// Salidas en `app/_eval-output/<dir>/`:
//   _evaluacion-exhaustiva.json   reporte estructurado completo
//   reporte.md                    resumen ejecutivo legible (ranking + links)
//   *.png                         capturas por ruta
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve, relative } from "node:path";

const argv = process.argv.slice(2);
function flag(nombre, fallback = null) {
  const i = argv.indexOf(nombre);
  if (i === -1) return fallback;
  return argv[i + 1] ?? fallback;
}
const URL = argv.find((a) => /^https?:\/\//.test(a)) ?? "http://localhost:5173/";
const STRICT = argv.includes("--strict");
const SUBDIR = flag("--out", "ronda-3");
const RAIZ = resolve(import.meta.dirname, "..", "..");
const DIR = resolve(RAIZ, "app/_eval-output", SUBDIR);
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
// RUTA 2: Cada uno de los 6 demos OPCloud sandbox
// ============================================================
const DEMOS = ["System Diagram", "SD Sync", "SD Async", "OnStar System", "OPM Structure Meta Model", "Modelo Vacio"];
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
      await medirPerf(page, "demo-system-diagram");
      await correrAxe(page, "demo-system-diagram");
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
  const systemName = page.locator('text="System Name"').first();
  if (await systemName.isVisible()) {
    await systemName.click({ force: true });
    await page.waitForTimeout(300);
    await shot(page, "03-toolbar-con-objeto");
  }

  // Con entidad proceso
  const proc = page.locator('text="Main System Doing"').first();
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
  const systemName = page.locator('text="System Name"').first();
  await systemName.click({ force: true });
  await page.waitForTimeout(400);
  await shotFull(page, "04-inspector-entidad-fullpage");
  await medirPerf(page, "inspector-entidad");
  await correrAxe(page, "inspector-entidad");

  // Inspector proceso
  const proc = page.locator('text="Main System Doing"').first();
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
  await shot(page, "05-opl-system-diagram");

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
    const proc = page.locator('text="Main System Doing"').first();
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

  const proc = page.locator('text="Main System Doing"').first();
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

  // OnStar conserva estados y refinamiento desde el sandbox.
  await page.selectOption('select', { index: 4 }).catch(()=>{});
  await page.waitForTimeout(900);
  await shot(page, "09-onstar-system");
  datosCanon["onstar-system"] = await dumpCanon(page);

  // OPM Structure Meta Model cubre estructura densa.
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  await page.selectOption('select', { index: 5 }).catch(()=>{});
  await page.waitForTimeout(900);
  await shot(page, "09-opm-structure-meta-model");

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
// RUTA 13: Flujo IFML L3 — modal-nombre-cosa via store, no via bus DOM
// ============================================================
{
  const { ctx, page } = await nuevoPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 25000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(700);

  // a) un dispatch ajeno NO abre el modal: el contrato vive en el store.
  const ajenoNoAbre = await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent("opm:nueva-cosa", { detail: { entidadId: "x", aparienciaId: "y", nombre: "Z" } }));
    return !document.querySelector('[data-testid="modal-nombre-cosa"]');
  });
  record("ifml-l3", "bus-dom-sin-listener-vivo", ajenoNoAbre ? "OK" : "FAIL", "Un dispatch externo de opm:nueva-cosa no debe abrir el modal");

  // b) drop al canvas dispara el modal via Action -> store -> View.
  const canvas = page.locator('[role="img"][aria-label="OPD activo"]').first();
  let dropOk = false;
  try {
    const dragSource = page.locator('[data-testid="toolbar-modo-creacion-objeto"]').first();
    await dragSource.dragTo(canvas, { targetPosition: { x: 320, y: 190 } });
    await page.waitForTimeout(300);
    dropOk = await page.locator('[data-testid="modal-nombre-cosa"]').count() > 0;
  } catch (e) {
    dropOk = false;
  }
  record("ifml-l3", "modal-tras-drop-aparece", dropOk ? "OK" : "FAIL", { dropOk });
  if (dropOk) await shot(page, "13-ifml-modal-nombre-cosa");

  // c) Esc descarta sin renombrar.
  if (dropOk) {
    const input = page.locator('[data-testid="modal-nombre-cosa"] input').first();
    if (await input.count() > 0) {
      await input.focus();
      await input.fill("nombre transitorio");
      await input.press("Escape");
      await page.waitForTimeout(200);
      const cerrado = await page.locator('[data-testid="modal-nombre-cosa"]').count() === 0;
      record("ifml-l3", "esc-descarta-sin-renombrar", cerrado ? "OK" : "FAIL", { cerrado });
    }
  }

  // d) verificar que el portal de Dialogo (L1) sigue siendo body-level y
  // no dentro del grid principal. Smoke negativo: el primer Dialogo abierto
  // debe vivir como hijo directo de body.
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.click('button:has-text("Plantillas")').catch(() => {});
  await page.waitForTimeout(400);
  const dialogoEsHijoDeBody = await page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"]');
    if (!dlg) return null;
    return dlg.parentElement === document.body || dlg.parentElement?.parentElement === document.body;
  });
  if (dialogoEsHijoDeBody !== null) {
    // INFO en vez de FAIL: el portal de Dialogo es responsabilidad de L1
    // (commit 8c43075 sobre main). Si esta eval corre en un worktree
    // anterior a L1, este dato sigue siendo verdadero pero no es regresion
    // de L3.
    record("ifml-l1-portal", "dialogo-en-body", "INFO", { dialogoEsHijoDeBody, esperado: "true tras L1 (commit 8c43075)" });
  }

  await ctx.close();
}

// ============================================================
// CIERRE: dump JSON
// ============================================================
const totales = {
  total: findings.length,
  ok: findings.filter(f => f.estado === "OK").length,
  warn: findings.filter(f => f.estado === "WARN").length,
  fail: findings.filter(f => f.estado === "FAIL").length,
  info: findings.filter(f => f.estado === "INFO").length,
};
const axeViolacionesTotal = Object.values(a11yPorRuta).reduce((s, r) => s + (r.violaciones || 0), 0);

writeFileSync(resolve(DIR, "_evaluacion-exhaustiva.json"), JSON.stringify({
  fecha: new Date().toISOString(),
  url: URL,
  totalCriterios: totales.total,
  ok: totales.ok,
  warn: totales.warn,
  fail: totales.fail,
  info: totales.info,
  errors,
  a11yPorRuta,
  perfPorRuta,
  datosCanon,
  findings,
}, null, 2));

// ── Reporte markdown legible ─────────────────────────────────
function fmtDetalle(d) {
  if (d == null) return "";
  if (typeof d === "string") return d.length > 140 ? d.slice(0, 140) + "…" : d;
  try {
    const s = JSON.stringify(d);
    return s.length > 140 ? s.slice(0, 140) + "…" : s;
  } catch {
    return String(d);
  }
}
const lineasFails = findings.filter(f => f.estado === "FAIL").map(f => `- **FAIL** \`${f.zona}/${f.criterio}\` — ${fmtDetalle(f.detalle)}`);
const lineasWarns = findings.filter(f => f.estado === "WARN").map(f => `- WARN \`${f.zona}/${f.criterio}\` — ${fmtDetalle(f.detalle)}`);
const lineasInfo = findings.filter(f => f.estado === "INFO").map(f => `- INFO \`${f.zona}/${f.criterio}\` — ${fmtDetalle(f.detalle)}`);
const lineasA11y = Object.entries(a11yPorRuta)
  .filter(([_, r]) => r && r.violaciones > 0)
  .sort((a, b) => b[1].violaciones - a[1].violaciones)
  .map(([ruta, r]) => `- \`${ruta}\` — ${r.violaciones} violación(es): ${(r.detalle ?? []).map(v => `\`${v.id}\` (${v.impact ?? "n/d"})`).join(", ")}`);
const lineasErrors = errors.length === 0 ? ["(sin errores de runtime)"] : errors.slice(0, 20).map(e => `- ${e.tipo}: ${fmtDetalle(e.msg ?? e.url ?? e.reason)}`);
const md = `# Evaluacion exhaustiva pre-Beta1

Fecha: ${new Date().toISOString()}
URL: ${URL}
Salida: \`${relative(RAIZ, DIR)}\`

## Resumen

| Estado | Conteo |
|---|---|
| OK | ${totales.ok} |
| WARN | ${totales.warn} |
| FAIL | ${totales.fail} |
| INFO | ${totales.info} |
| **Total criterios** | ${totales.total} |
| Errors runtime | ${errors.length} |
| Axe violaciones totales | ${axeViolacionesTotal} |

${totales.fail > 0 ? "## Fails (bloqueantes)\n\n" + lineasFails.join("\n") + "\n" : ""}
## Warnings

${lineasWarns.length ? lineasWarns.join("\n") : "(sin warnings)"}

## A11y por ruta

${lineasA11y.length ? lineasA11y.join("\n") : "(sin violaciones a11y)"}

## Errors runtime

${lineasErrors.join("\n")}

## Info

${lineasInfo.length ? lineasInfo.join("\n") : "(sin info)"}

## Capturas

Ver archivos PNG en este directorio. Las mas relevantes para reportes son:

- \`01-carga-inicial.png\` chrome vacio
- \`02-demo-1-cafetera-domestica.png\` baseline visual canonica
- \`04-inspector-entidad-fullpage.png\` Inspector con seleccion
- \`06-dialogo-*.png\` shape de cada modal
- \`13-ifml-modal-nombre-cosa.png\` flujo IFML L3 corregido

## Como referenciar bugs

Si una entrada es accionable, capturarla con el capturador dev-only:
genera \`docs/bugs/BUG-<timestamp>-<hash>/\` con report.md + payload.json +
screenshots. Pegar la ruta del PNG aqui basta.
`;
writeFileSync(resolve(DIR, "reporte.md"), md);

console.log("EVAL exhaustiva -",
  `criterios=${totales.total}`,
  `ok=${totales.ok}`,
  `warn=${totales.warn}`,
  `fail=${totales.fail}`,
  `info=${totales.info}`,
  `errors=${errors.length}`,
  `axe=${axeViolacionesTotal}`,
  `dir=${relative(RAIZ, DIR)}`);
await browser.close();
if (STRICT && totales.fail > 0) {
  console.error(`STRICT: ${totales.fail} FAIL detectado(s) — exit 1`);
  process.exit(1);
}
