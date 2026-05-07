// Microciclo 1: Carga inicial + toolbar + canvas vacio
// Captura app local y opcloud-sandbox para comparacion
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const URL_APP = process.argv[2] ?? "http://localhost:5173/";
const URL_REF = "https://opcloud-sandbox.web.app/";
const RAIZ = resolve(import.meta.dirname, "..", "..");
const DIR = resolve(RAIZ, "app/test-results/in-vivo/ciclo-visual-ux");

mkdirSync(resolve(DIR, "antes"), { recursive: true });
mkdirSync(resolve(DIR, "opcloud-ref"), { recursive: true });

const log = [];
const errors = [];

const browser = await chromium.launch({ headless: true });

async function capturarApp() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console.error: ${m.text()}`); });

  await page.goto(URL_APP, { waitUntil: "networkidle", timeout: 25000 });
  await page.waitForTimeout(800);

  // 1.1 Estado inicial completo (puede haber pantalla bienvenida)
  await page.screenshot({ path: resolve(DIR, "antes", "01-app-carga-inicial.png"), fullPage: true });
  log.push({ id: "01-app-carga-inicial", url: URL_APP });

  // Detectar pantalla inicio o canvas
  const tienePantallaInicio = await page.locator('text=/comenzar|nuevo modelo|empezar/i').first().isVisible().catch(() => false);
  log.push({ tienePantallaInicio });

  if (tienePantallaInicio) {
    // Cerrar/avanzar pantalla inicio si aplica
    const btn = page.locator('button:has-text("Comenzar"), button:has-text("Nuevo")').first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: resolve(DIR, "antes", "02-app-tras-inicio.png"), fullPage: true });
      log.push({ id: "02-app-tras-inicio" });
    }
  }

  // 1.2 Canvas vacio
  await page.screenshot({ path: resolve(DIR, "antes", "03-app-canvas-vacio.png"), fullPage: true });

  // 1.3 Toolbar zoom (region superior)
  const toolbar = page.locator('header, [role="toolbar"], .toolbar, [class*="oolbar"]').first();
  if (await toolbar.isVisible().catch(() => false)) {
    await toolbar.screenshot({ path: resolve(DIR, "antes", "04-app-toolbar-zoom.png") });
    log.push({ id: "04-app-toolbar-zoom" });
  }

  // 1.4 Inspeccion DOM clave
  const meta = await page.evaluate(() => {
    const result = { titulo: document.title };
    result.h1 = document.querySelector('h1')?.textContent?.trim();
    result.idiomaHtml = document.documentElement.lang;
    result.botonesVisibles = Array.from(document.querySelectorAll('button')).filter(b => b.offsetParent !== null).map(b => ({
      texto: b.textContent?.trim().slice(0, 40),
      ariaLabel: b.getAttribute('aria-label'),
      titulo: b.getAttribute('title'),
      disabled: b.disabled,
      tieneIcono: !!b.querySelector('svg, img')
    })).slice(0, 50);
    result.regions = Array.from(document.querySelectorAll('[role]')).map(el => ({ role: el.getAttribute('role'), label: el.getAttribute('aria-label') })).slice(0, 30);
    result.viewportSize = { w: window.innerWidth, h: window.innerHeight };
    result.bodyOverflow = document.body.scrollWidth > document.body.clientWidth;
    return result;
  });
  log.push({ tipo: "meta-app", meta });

  // 1.5 Contraste/estilos clave de toolbar
  const estilosTopBar = await page.evaluate(() => {
    const root = document.querySelector('header, [role="toolbar"], .toolbar') || document.body;
    const cs = window.getComputedStyle(root);
    return { bg: cs.backgroundColor, color: cs.color, font: cs.fontFamily, h: root.getBoundingClientRect().height };
  });
  log.push({ tipo: "estilos-topbar", estilosTopBar });

  await ctx.close();
}

async function capturarOpcloud() {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  try {
    await page.goto(URL_REF, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: resolve(DIR, "opcloud-ref", "ref-01-carga-inicial.png"), fullPage: true });
    log.push({ id: "ref-01-carga-inicial", url: URL_REF });

    // Intentar avanzar/cerrar dialogo si lo hay
    const closeable = page.locator('button:has-text("Close"), button:has-text("Cerrar"), button:has-text("Continue"), .close-button, [aria-label*="close" i]').first();
    if (await closeable.isVisible().catch(() => false)) {
      await closeable.click().catch(() => {});
      await page.waitForTimeout(800);
    }
    await page.screenshot({ path: resolve(DIR, "opcloud-ref", "ref-02-canvas.png"), fullPage: true });

    const meta = await page.evaluate(() => ({
      titulo: document.title,
      h1: document.querySelector('h1')?.textContent?.trim(),
      botonesArriba: Array.from(document.querySelectorAll('button, [role="button"]'))
        .filter(b => b.offsetParent !== null && b.getBoundingClientRect().top < 100)
        .map(b => ({ texto: b.textContent?.trim().slice(0,40), titulo: b.getAttribute('title'), aria: b.getAttribute('aria-label') }))
        .slice(0, 60)
    }));
    log.push({ tipo: "meta-opcloud", meta });
  } catch (err) {
    log.push({ tipo: "opcloud-error", error: String(err) });
  }
  await ctx.close();
}

await capturarApp();
await capturarOpcloud();
await browser.close();

writeFileSync(resolve(DIR, "antes", "_log-ciclo-1.json"), JSON.stringify({ fecha: new Date().toISOString(), log, errors }, null, 2));
console.log("OK ciclo 1 - log:", log.length, "items, errors:", errors.length);
