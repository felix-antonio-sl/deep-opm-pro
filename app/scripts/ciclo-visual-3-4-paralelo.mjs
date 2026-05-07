// Microciclos 3 (inspector+OPL) y 4 (refinamiento+arbol) en una sola pasada
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const URL = process.argv[2] ?? "http://localhost:5173/";
const RAIZ = resolve(import.meta.dirname, "..", "..");
const DIR = resolve(RAIZ, "app/test-results/in-vivo/ciclo-visual-ux/antes");
mkdirSync(DIR, { recursive: true });

const log = [];
const errors = [];
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => { if (m.type() === "error") errors.push(`console.error: ${m.text()}`); });

await page.goto(URL, { waitUntil: "networkidle", timeout: 25000 });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(700);
// Cargar demo Cafetera
await page.selectOption('select', { index: 1 }).catch(()=>{});
await page.waitForTimeout(900);

// === MICROCICLO 3: Inspector + OPL ===
// 3.1 Click en "Hacer Cafe" (proceso central)
const proc = page.locator('text="Hacer Cafe"').first();
if (await proc.isVisible()) {
  await proc.click({ force: true });
  await page.waitForTimeout(400);
  await page.screenshot({ path: resolve(DIR, "30-inspector-proceso.png"), fullPage: false });
  log.push({ paso: "click-proceso", ok: true });

  // Inspector content
  const inspectorMeta = await page.evaluate(() => {
    const aside = Array.from(document.querySelectorAll('aside, [class*="nspector"]')).find(el => el.querySelector('input,select,textarea') || /Selecci/i.test(el.textContent || ""));
    if (!aside) return { err: "no inspector" };
    return {
      texto: aside.textContent?.trim().slice(0, 500),
      inputs: Array.from(aside.querySelectorAll('input,select,textarea')).map(i => ({
        tipo: i.tagName, name: i.name, id: i.id, placeholder: i.placeholder, label: i.getAttribute('aria-label')
      })).slice(0, 20),
      labels: Array.from(aside.querySelectorAll('label')).map(l => l.textContent?.trim().slice(0,50)).slice(0, 20)
    };
  });
  log.push({ paso: "inspector-meta", inspectorMeta });
}

// 3.2 Click en un enlace (target el del bus a hacer cafe)
const enlaces = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('path, line[class*="link" i]')).slice(0, 5).map(e => ({ tag: e.tagName, classes: e.className?.baseVal || e.className }));
});
log.push({ enlaces });

// 3.3 OPL panel: medir oraciones
const oplMeta = await page.evaluate(() => {
  const opl = document.querySelector('[aria-label*="OPL" i], [class*="opl" i]') || Array.from(document.querySelectorAll('section, footer, div')).find(el => /\d+ oraciones/i.test(el.textContent || ''));
  if (!opl) return { err: 'no opl' };
  return {
    altura: opl.getBoundingClientRect().height,
    tieneScroll: opl.scrollHeight > opl.clientHeight,
    oraciones: Array.from(opl.querySelectorAll('li, p')).filter(el => /[A-Z]/.test(el.textContent || '')).map(el => el.textContent?.trim().slice(0, 80)).slice(0, 15)
  };
});
log.push({ paso: "opl-meta", oplMeta });

// 3.4 Capturar inspector zoom
const inspector = page.locator('aside').last();
if (await inspector.isVisible().catch(()=>false)) {
  await inspector.screenshot({ path: resolve(DIR, "31-inspector-zoom.png") }).catch(()=>{});
}
// Capturar OPL panel zoom
const oplBox = await page.evaluate(() => {
  const opl = Array.from(document.querySelectorAll('section, footer, aside, div')).find(el => /\d+ oraciones/i.test(el.textContent || '') && el.children.length > 0 && el.getBoundingClientRect().height > 50 && el.getBoundingClientRect().height < 400);
  return opl ? { x: Math.round(opl.getBoundingClientRect().x), y: Math.round(opl.getBoundingClientRect().y), w: Math.round(opl.getBoundingClientRect().width), h: Math.round(opl.getBoundingClientRect().height) } : null;
});
if (oplBox && oplBox.w > 0 && oplBox.h > 0) {
  await page.screenshot({ path: resolve(DIR, "32-opl-panel.png"), clip: { x: oplBox.x, y: oplBox.y, width: oplBox.w, height: oplBox.h } });
  log.push({ paso: "opl-clip", oplBox });
}

// === MICROCICLO 4: Refinamiento + arbol OPD ===
// 4.1 Doble click en proceso "Hacer Cafe" → in-zoom
const procDC = page.locator('text="Hacer Cafe"').first();
if (await procDC.isVisible()) {
  await procDC.dblclick({ delay: 60, force: true });
  await page.waitForTimeout(800);
  await page.screenshot({ path: resolve(DIR, "40-tras-dblclick-inzoom.png"), fullPage: false });
  log.push({ paso: "dblclick-proceso", ok: true });

  // Estado del arbol OPD
  const arbol = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('[role="treeitem"]'));
    return items.map(it => ({
      texto: it.textContent?.trim().slice(0,60),
      activo: !!it.getAttribute('aria-current') || it.classList.contains('activo') || /seleccion/i.test(it.className || ''),
      level: it.getAttribute('aria-level')
    }));
  });
  log.push({ paso: "arbol-opd-tras-inzoom", arbol });
}

// 4.2 Capturar arbol OPD zoom
const arbolBox = await page.evaluate(() => {
  const a = document.querySelector('[role="tree"]');
  return a ? { x: Math.round(a.getBoundingClientRect().x), y: Math.round(a.getBoundingClientRect().y - 30), w: Math.round(a.getBoundingClientRect().width), h: Math.round(a.getBoundingClientRect().height + 30) } : null;
});
if (arbolBox && arbolBox.w > 0 && arbolBox.h > 0) {
  await page.screenshot({ path: resolve(DIR, "41-arbol-opd.png"), clip: { x: arbolBox.x, y: arbolBox.y, width: arbolBox.w, height: arbolBox.h } });
}

// 4.3 Volver al SD - click en SD
const sd = page.locator('[role="treeitem"]').filter({ hasText: 'SD' }).first();
if (await sd.isVisible()) {
  await sd.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: resolve(DIR, "42-vuelta-sd.png"), fullPage: false });
}

// 4.4 Probar Mapa del sistema
const mapa = page.locator('[data-opd-id="__mapa__"]').first();
if (await mapa.isVisible()) {
  await mapa.click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: resolve(DIR, "43-mapa-sistema.png"), fullPage: false });
  log.push({ paso: "click-mapa", ok: true });
}

writeFileSync(resolve(DIR, "_log-ciclo-3-4.json"), JSON.stringify({ log, errors }, null, 2));
console.log("CICLO 3-4 OK - log:", log.length, "err:", errors.length);
await browser.close();
