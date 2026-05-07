// Microciclo 2: Creacion y edicion de cosas y enlaces
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const URL = process.argv[2] ?? "http://localhost:5173/";
const RAIZ = resolve(import.meta.dirname, "..", "..");
const DIR = resolve(RAIZ, "app/test-results/in-vivo/ciclo-visual-ux");
const ANTES = resolve(DIR, "antes");
const DESPUES = resolve(DIR, "despues");
mkdirSync(ANTES, { recursive: true });
mkdirSync(DESPUES, { recursive: true });

const log = [];
const errors = [];
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => { if (m.type() === "error") errors.push(`console.error: ${m.text()}`); });

await page.goto(URL, { waitUntil: "networkidle", timeout: 25000 });
await page.waitForTimeout(800);

// Limpiar localStorage para empezar limpio
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(600);

// Crear un objeto via boton "Objeto" (clic = crear demo object)
const btnObjeto = page.locator('button:has-text("Objeto")').first();
await btnObjeto.click();
await page.waitForTimeout(400);
await page.screenshot({ path: resolve(ANTES, "10-tras-crear-objeto.png"), fullPage: false });
log.push({ paso: "crear-objeto", ok: true });

// Crear otro objeto y un proceso
await btnObjeto.click(); await page.waitForTimeout(300);
const btnProceso = page.locator('button:has-text("Proceso")').first();
await btnProceso.click(); await page.waitForTimeout(400);
await page.screenshot({ path: resolve(ANTES, "11-tres-cosas.png"), fullPage: false });

// Capturar canvas SVG: medir colores reales
const datosCosas = await page.evaluate(() => {
  const svg = document.querySelector('svg');
  if (!svg) return { err: 'no svg' };
  const rects = Array.from(svg.querySelectorAll('rect[fill]')).slice(0, 10).map(r => ({
    fill: r.getAttribute('fill'), stroke: r.getAttribute('stroke'),
    sw: r.getAttribute('stroke-width'), sd: r.getAttribute('stroke-dasharray')
  }));
  const ellipses = Array.from(svg.querySelectorAll('ellipse[fill]')).slice(0,5).map(e => ({
    fill: e.getAttribute('fill'), stroke: e.getAttribute('stroke'),
    sw: e.getAttribute('stroke-width'), sd: e.getAttribute('stroke-dasharray')
  }));
  const textos = Array.from(svg.querySelectorAll('text')).slice(0,10).map(t => ({
    contenido: t.textContent?.slice(0,30), font: t.getAttribute('font-family'),
    size: t.getAttribute('font-size'), weight: t.getAttribute('font-weight')
  }));
  return { rects, ellipses, textos };
});
log.push({ paso: "datos-cosas", datosCosas });

// Click en una cosa para seleccionar (centrar canvas)
const canvasArea = page.locator('svg').first();
const box = await canvasArea.boundingBox();
if (box) {
  await page.mouse.click(box.x + 200, box.y + 200);
  await page.waitForTimeout(300);
}
await page.screenshot({ path: resolve(ANTES, "12-seleccionado.png"), fullPage: false });

// Abrir picker de tipo enlace - "Tipos válidos"
const tiposBtn = page.locator('button:has-text("Tipos")').first();
const habilitado = await tiposBtn.isEnabled();
log.push({ paso: "tipos-validos-habilitado", habilitado });
if (habilitado) {
  await tiposBtn.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: resolve(ANTES, "13-picker-tipos.png"), fullPage: false });
}

// Inspector lateral: ver estado al seleccionar
const inspector = page.locator('aside, [aria-label*="nspector" i]').first();
if (await inspector.isVisible().catch(()=>false)) {
  await inspector.screenshot({ path: resolve(ANTES, "14-inspector-con-seleccion.png") }).catch(()=>{});
}

// Probar dialogo cargar demo (boton Demo)
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(700);
const demoSel = page.locator('select, [role="combobox"]').first();
if (await demoSel.isVisible().catch(()=>false)) {
  // Es un <select>, leer opciones
  const opts = await page.evaluate(() => {
    const s = document.querySelector('select');
    return s ? Array.from(s.options).map(o => o.textContent?.trim()).slice(0, 12) : [];
  });
  log.push({ paso: "demos-disponibles", opts });
  if (opts.length > 1) {
    await page.selectOption('select', { index: 1 }).catch(()=>{});
    await page.waitForTimeout(800);
    await page.screenshot({ path: resolve(ANTES, "15-demo-cargado.png"), fullPage: false });
    // Capturar canvas con demo
    await page.screenshot({ path: resolve(ANTES, "16-demo-canvas.png"), fullPage: true });
  }
}

writeFileSync(resolve(ANTES, "_log-ciclo-2.json"), JSON.stringify({ log, errors }, null, 2));
console.log("CICLO 2 ok - log:", log.length, "err:", errors.length);
await browser.close();
