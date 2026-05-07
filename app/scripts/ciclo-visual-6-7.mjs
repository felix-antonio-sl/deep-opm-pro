// Microciclos 6 (focus/errores) y 7 (firma + mapa)
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const URL = process.argv[2] ?? "http://localhost:5173/";
const RAIZ = resolve(import.meta.dirname, "..", "..");
const DIR = resolve(RAIZ, "app/test-results/in-vivo/ciclo-visual-ux/ronda-2");
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

// === Focus visible ===
// 6.1 Tab navigation
const focusOutlines = [];
for (let i = 0; i < 20; i++) {
  await page.keyboard.press("Tab");
  await page.waitForTimeout(120);
  const info = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const cs = window.getComputedStyle(el);
    return {
      tag: el.tagName,
      texto: el.textContent?.trim().slice(0, 30),
      aria: el.getAttribute('aria-label'),
      outline: cs.outline,
      outlineWidth: cs.outlineWidth,
      outlineStyle: cs.outlineStyle,
      outlineColor: cs.outlineColor,
      boxShadow: cs.boxShadow,
      hasFocusVisible: cs.outline !== 'none' || /[1-9]/.test(cs.outlineWidth) || cs.boxShadow !== 'none'
    };
  });
  if (info) focusOutlines.push(info);
}
log.push({ paso: "tab-focus", focusOutlines });
await page.screenshot({ path: resolve(DIR, "tab-focus-final.png"), fullPage: false });

// 6.2 Error JSON: importar JSON invalido
await page.click('text="Importar"').catch(()=>{});
// Mejor: pegar JSON invalido en textarea
const textarea = page.locator('textarea[data-testid="textarea-json"]').first();
if (await textarea.isVisible().catch(()=>false)) {
  await textarea.fill('{"opds": null, "broken": true');
  await page.waitForTimeout(400);
  // Click "Importar" boton secundario
  const btnImportar = page.locator('button:has-text("Importar")').first();
  if (await btnImportar.isVisible().catch(()=>false)) {
    await btnImportar.click();
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: resolve(DIR, "estado-error-json-invalido.png"), fullPage: false });
  // Capturar mensaje de error
  const errMsg = await page.evaluate(() => {
    const r = document.querySelector('[role="alert"]');
    return r ? r.textContent?.trim() : null;
  });
  log.push({ paso: "error-json", errMsg });
}

// === Microciclo 7: validacion firma + mapa ===
// Cargar Cafetera para tener cosas con que probar
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(700);
await page.selectOption('select', { index: 1 }).catch(()=>{});
await page.waitForTimeout(800);

// 7.1 Mapa del sistema
const mapa = page.locator('[data-opd-id="__mapa__"]').first();
if (await mapa.isVisible()) {
  await mapa.click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: resolve(DIR, "vista-mapa-sistema.png"), fullPage: false });
  log.push({ paso: "mapa-sistema", ok: true });

  // Auditoria del Mapa
  const mapaMeta = await page.evaluate(() => {
    const svg = document.querySelector('svg');
    if (!svg) return { err: 'no svg' };
    return {
      cosas: svg.querySelectorAll('rect[fill], ellipse[fill]').length,
      enlaces: svg.querySelectorAll('path').length,
      titulo: document.querySelector('h1, h2, [aria-label*="apa" i]')?.textContent?.trim().slice(0, 60)
    };
  });
  log.push({ paso: "mapa-meta", mapaMeta });
  // Volver al SD
  const sd = page.locator('[role="treeitem"]').filter({ hasText: 'SD' }).first();
  await sd.click().catch(()=>{});
  await page.waitForTimeout(500);
}

// 7.2 Validacion firma: intentar consumo objeto -> objeto
// Seleccionar primer objeto (Persona)
const persona = page.locator('text="Persona"').first();
if (await persona.isVisible()) {
  await persona.click({ force: true });
  await page.waitForTimeout(300);
  await page.screenshot({ path: resolve(DIR, "firma-1-objeto-seleccionado.png"), fullPage: false });
  // Boton Tipos validos: deberia listar opciones validas para Persona como origen
  const tipos = page.locator('button:has-text("Tipos")').first();
  if (await tipos.isEnabled().catch(()=>false)) {
    await tipos.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: resolve(DIR, "firma-2-picker-tipos.png"), fullPage: false });
    // Capturar lista de tipos
    const tiposListados = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('[role="menuitem"], [role="option"], [data-testid*="tipo" i]')).slice(0, 30);
      return items.map(i => ({ texto: i.textContent?.trim().slice(0, 40), disabled: i.getAttribute('aria-disabled') }));
    });
    log.push({ paso: "tipos-validos-para-persona", tiposListados });
  }
}

// 7.3 Visibilidad foco
const focusOnSelect = await page.evaluate(() => {
  // Foco en select Demo
  const s = document.querySelector('select');
  if (s) s.focus();
  const cs = window.getComputedStyle(document.activeElement);
  return { outline: cs.outline, boxShadow: cs.boxShadow };
});
log.push({ paso: "focus-select-demo", focusOnSelect });

writeFileSync(resolve(DIR, "_log-ciclo-6-7.json"), JSON.stringify({ log, errors }, null, 2));
console.log("CICLO 6-7 OK - log:", log.length, "err:", errors.length);
await browser.close();
