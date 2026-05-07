// Microciclo 5: Dialogos modales
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
await page.selectOption('select', { index: 1 }).catch(()=>{});
await page.waitForTimeout(800);

async function abrirYcapturar(nombre, abrir, cerrar) {
  await abrir();
  await page.waitForTimeout(500);
  await page.screenshot({ path: resolve(DIR, `dialogo-${nombre}.png`), fullPage: false });
  // Auditoria del dialog: focus visible, role, aria, primary button, esc
  const meta = await page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"], dialog[open], .dialog, [class*="ialog" i]');
    if (!dlg) return { err: "no dialog" };
    const focused = document.activeElement;
    return {
      role: dlg.getAttribute('role'),
      ariaLabel: dlg.getAttribute('aria-label') || dlg.getAttribute('aria-labelledby'),
      ariaModal: dlg.getAttribute('aria-modal'),
      focusedTag: focused?.tagName, focusedText: focused?.textContent?.trim().slice(0,40),
      buttons: Array.from(dlg.querySelectorAll('button')).slice(0, 12).map(b => ({ texto: b.textContent?.trim().slice(0,30), aria: b.getAttribute('aria-label'), disabled: b.disabled, primary: /primary|primario|confirmar|guardar|cargar|ok|aceptar/i.test(b.className) })),
      inputsConLabel: Array.from(dlg.querySelectorAll('input,textarea,select')).map(i => ({
        tag: i.tagName, type: i.type, label: i.closest('label') ? 'implicit' : (i.getAttribute('aria-label') || (i.id && document.querySelector(`label[for="${i.id}"]`) ? 'explicit' : null))
      })),
      headings: Array.from(dlg.querySelectorAll('h1,h2,h3')).map(h => h.textContent?.trim().slice(0,60)),
      hasCerrar: !!dlg.querySelector('[aria-label*="errar" i]') || Array.from(dlg.querySelectorAll('button')).some(b => /cancelar|cerrar/i.test(b.textContent || '')),
    };
  });
  log.push({ dialogo: nombre, meta });
  if (cerrar) await cerrar();
  await page.waitForTimeout(300);
}

// 1. Dialogo Plantillas
await abrirYcapturar("plantillas",
  async () => await page.click('button:has-text("Plantillas")'),
  async () => await page.keyboard.press("Escape"));

// 2. Dialogo Cargar Modelo
await abrirYcapturar("cargar-modelo",
  async () => {
    // Hay 2 botones "Cargar" -> el primero (toolbar superior) abre dialogo
    const cargares = await page.locator('button:has-text("Cargar")').all();
    for (const c of cargares) {
      const enabled = await c.isEnabled();
      if (enabled) { await c.click(); break; }
    }
  },
  async () => await page.keyboard.press("Escape"));

// 3. Dialogo Versiones (boton "..." en titulo, o atajo)
// Disparar via store (mas robusto)
await page.evaluate(() => {
  // @ts-ignore acceso puente al store si existe en window
  const ev = new CustomEvent('opm:abrir-dialogo-versiones');
  window.dispatchEvent(ev);
});
await page.waitForTimeout(300);
// Si no se abrio, intentar via menu principal
const menu = page.locator('button[aria-label="Menú principal"], button:has-text("☰")').first();
if (await menu.isVisible()) {
  await menu.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: resolve(DIR, "dialogo-menu-principal.png"), fullPage: false });
  const versionesBtn = page.locator('button:has-text("Versiones"), button:has-text("Historial")').first();
  if (await versionesBtn.isVisible().catch(()=>false)) {
    await versionesBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: resolve(DIR, "dialogo-versiones.png"), fullPage: false });
  } else {
    await page.keyboard.press("Escape");
  }
}

// 4. Dialogo Buscar Global (Ctrl+Shift+F probablemente, o atajo)
await page.keyboard.press("Control+Shift+f");
await page.waitForTimeout(400);
let dlg = await page.locator('[role="dialog"]').first().isVisible().catch(()=>false);
if (dlg) {
  await page.screenshot({ path: resolve(DIR, "dialogo-buscar-global.png"), fullPage: false });
  await page.keyboard.press("Escape");
}

// 5. Configuracion grid
const grid = page.locator('button:has-text("Config grid")').first();
if (await grid.isVisible()) {
  await grid.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: resolve(DIR, "dialogo-config-grid.png"), fullPage: false });
  await page.keyboard.press("Escape");
}

// 6. Inspector estado vacio (deseleccionar)
await page.keyboard.press("Escape");
await page.click('svg', { position: { x: 100, y: 100 } }).catch(()=>{});
await page.waitForTimeout(300);
await page.screenshot({ path: resolve(DIR, "estado-inspector-sin-seleccion.png"), fullPage: false });

writeFileSync(resolve(DIR, "_log-ciclo-5.json"), JSON.stringify({ log, errors }, null, 2));
console.log("CICLO 5 OK - dialogos:", log.length, "errors:", errors.length);
await browser.close();
