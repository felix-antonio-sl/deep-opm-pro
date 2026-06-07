// Sonda: BUG-20260607T220340Z-42c24c — overlay de la barra de simulación
// desalineado del header Codex (12px de gap, fondo del body se filtra).
//
// Antes: `s.barraOverlayDesktop.top: 60` (match con header viejo de 60px).
// Después: `top: CODEX_HEADER_HEIGHT` (= 48px, derivado de CodexFrame).
//
// Reproduce en prod: carga el modelo laboratorio complejo, entra a modo
// simulación, mide el offset entre el bottom del header y el top de la
// barra. Antes del fix: offset ≈ 12px (gap visible). Después: offset ≈ 0.
//
// Uso:
//   URL=https://opforja.sanixai.com node app/scripts/sonda-bug-42c24c.mjs
//   URL=http://127.0.0.1:5270/   node app/scripts/sonda-bug-42c24c.mjs
import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const URL = process.env.URL || "http://127.0.0.1:5270/";
const OUT = process.env.OUT || "/tmp/opencode/bug-42c24c.png";
const JSON_OUT = process.env.JSON_OUT || "/tmp/opencode/bug-42c24c.json";
const TOLERANCIA_PX = Number(process.env.TOL || 1);

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1920, height: 963 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

const pageErrors = [];
const consoleErrors = [];
page.on("pageerror", (e) => pageErrors.push(String(e)));
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});

const report = {
  url: URL,
  toleranciaPx: TOLERANCIA_PX,
  pageErrors,
  consoleErrors,
  steps: [],
};

async function step(name, fn) {
  try {
    const r = await fn();
    report.steps.push({ name, ok: true, ...(r && typeof r === "object" ? r : { value: r }) });
    return r;
  } catch (e) {
    report.steps.push({ name, ok: false, error: String(e) });
    throw e;
  }
}

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(800);

// Sesión y modelo (best effort; el dev server puede no tener los endpoints)
try {
  const s = await page.request.post(URL.replace(/\/$/, "") + "/__deep-opm/session");
  await s.text();
  report.steps.push({ name: "session", ok: s.ok(), status: s.status() });
} catch (e) {
  report.steps.push({ name: "session", ok: false, error: String(e) });
}

// Activar modo simulación via Command Palette
await step("abrir-command-palette", async () => {
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(300);
});
await step("buscar-modo-simulacion", async () => {
  await page.keyboard.type("simulación", { delay: 30 });
  await page.waitForTimeout(300);
});
await step("seleccionar-primera-opcion", async () => {
  await page.keyboard.press("Enter");
  await page.waitForTimeout(500);
});

// Medir header Codex y barra de simulación
const header = page.locator('[data-testid="codex-frame"] > header').first();
const barra = page.locator('[data-testid="barra-simulacion"]');

if ((await header.count()) && (await barra.count())) {
  const headerBox = await header.boundingBox();
  const barraBox = await barra.boundingBox();
  const headerStyle = await header.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { zIndex: cs.zIndex, position: cs.position };
  });
  const barraStyle = await barra.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { top: cs.top, position: cs.position, zIndex: cs.zIndex };
  });

  const headerBottom = headerBox.y + headerBox.height;
  const offset = barraBox.y - headerBottom;

  report.headerBox = headerBox;
  report.headerStyle = headerStyle;
  report.barraBox = barraBox;
  report.barraStyle = barraStyle;
  report.alignment = {
    headerBottom,
    barraTop: barraBox.y,
    offset,
    pass: Math.abs(offset) <= TOLERANCIA_PX,
    mensaje: Math.abs(offset) <= TOLERANCIA_PX
      ? `OK: overlay alineado con header (offset ${offset.toFixed(2)}px <= ${TOLERANCIA_PX}px)`
      : `FAIL: overlay desalineado del header por ${offset.toFixed(2)}px (esperado <= ${TOLERANCIA_PX}px)`,
  };

  // Captura recortada al header + barra para evidencia visual
  await page.screenshot({
    path: OUT,
    clip: {
      x: 0,
      y: 0,
      width: 1920,
      height: Math.ceil(barraBox.y + barraBox.height + 8),
    },
  });
  report.screenshot = OUT;
} else {
  await page.screenshot({ path: OUT, fullPage: false });
  report.screenshot = OUT;
  report.steps.push({
    name: "warning",
    ok: false,
    message: "Header o barra no encontrados. Probable causa: el modelo no se cargó via UI o la sesión no tiene acceso. La sonda funciona contra prod con sesión autenticada y el modelo 'modelo-simulacion-lab-complejo' disponible.",
  });
  report.alignment = { pass: null, mensaje: "No se pudo medir (header o barra no presentes)" };
}

await writeFile(JSON_OUT, JSON.stringify(report, null, 2));
console.log("json:", JSON_OUT);
console.log("alignment:", report.alignment);
console.log("pageErrors:", pageErrors.length, "consoleErrors:", consoleErrors.length);

await browser.close();
process.exit(report.alignment?.pass ? 0 : 2);
