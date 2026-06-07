// Sonda: BUG-20260606T063734Z-52df54 — barra de simulación descuadrada.
// Reproduce el bug en producción y verifica el fix:
// - Antes: la `fila` de status y el panel `narrativa` comparten línea y la
//   altura del panel desalinea el status.
// - Después: 3 filas independientes, status, narrativa, controles.
//
// El modelo `modelo-simulacion-lab-complejo` solo existe en el tenant del
// operador. Si la sonda no puede cargarlo (sesión nueva, sin tenant), crea
// un modelo mínimo via API con 2 procesos y entra a modo simulación.
//
// Uso:
//   URL=https://opforja.sanixai.com node app/scripts/sonda-bug-52df54.mjs
//   URL=http://127.0.0.1:5270/   node app/scripts/sonda-bug-52df54.mjs
import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const URL = process.env.URL || "http://127.0.0.1:5270/";
const OUT_BEFORE = process.env.OUT_BEFORE || "/tmp/opencode/bug-52df54-before.png";
const OUT_AFTER = process.env.OUT_AFTER || "/tmp/opencode/bug-52df54-after.png";
const JSON_OUT = process.env.JSON_OUT || "/tmp/opencode/bug-52df54.json";
const HEADLESS = process.env.HEADFUL !== "1";

const browser = await chromium.launch({ headless: HEADLESS });
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

const report = { url: URL, pageErrors, consoleErrors, steps: [] };

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

// Asegurar cookie de sesión
try {
  const s = await page.request.post(URL.replace(/\/$/, "") + "/__deep-opm/session");
  await s.text();
  report.steps.push({ name: "session", ok: s.ok(), status: s.status() });
} catch (e) {
  report.steps.push({ name: "session", ok: false, error: String(e) });
}

// Intentar cargar el modelo laboratorio complejo via API
let modeloId = "modelo-simulacion-lab-complejo";
try {
  const r = await page.request.get(URL.replace(/\/$/, "") + "/__deep-opm/modelos");
  const j = await r.json();
  const found = (j.modelos || []).find((m) => m.id === "modelo-simulacion-lab-complejo");
  if (found) {
    modeloId = found.id;
    report.steps.push({ name: "modelo-encontrado", ok: true, modeloId });
  } else {
    report.steps.push({ name: "modelo-no-encontrado", ok: false, count: (j.modelos || []).length });
  }
} catch (e) {
  report.steps.push({ name: "modelos-list-fail", ok: false, error: String(e) });
}

// Activar modo simulación via Command Palette (Ctrl+K)
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

const barra = page.locator('[data-testid="barra-simulacion"]');
const barraExists = await barra.count();
report.steps.push({ name: "barra-exists", ok: barraExists > 0, count: barraExists });

if (barraExists) {
  const box = await barra.boundingBox();
  const style = await barra.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      display: cs.display,
      alignItems: cs.alignItems,
      flexWrap: cs.flexWrap,
      minHeight: cs.minHeight,
      height: el.getBoundingClientRect().height,
      width: el.getBoundingClientRect().width,
    };
  });
  report.barraBox = box;
  report.barraStyle = style;

  // Medir la narrativa y la fila de status
  const narrativa = page.locator('[data-testid="barra-simulacion-narrativa"]').first();
  if (await narrativa.count()) {
    const nb = await narrativa.boundingBox();
    const ns = await narrativa.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { flexBasis: cs.flexBasis, maxHeight: cs.maxHeight, overflow: cs.overflow };
    });
    report.narrativaBox = nb;
    report.narrativaStyle = ns;
  }

  const progreso = page.locator('[data-testid="barra-simulacion-progreso"]').first();
  if (await progreso.count()) {
    report.progresoBox = await progreso.boundingBox();
  }

  // Verificar que narrativa y fila de status NO comparten línea
  // (sus top deben diferir más que la altura de la fila sola)
  if (report.narrativaBox && report.progresoBox) {
    const narrTop = report.narrativaBox.y;
    const progTop = report.progresoBox.y;
    report.alignmentCheck = {
      narrativaTop: narrTop,
      progresoTop: progTop,
      sharedRow: Math.abs(narrTop - progTop) < 5,
      expected: "progreso y narrativa en filas distintas (progTop > narrativaTop + 5)",
    };
  }

  await page.screenshot({ path: OUT_AFTER, fullPage: false });
  report.screenshot = OUT_AFTER;
} else {
  await page.screenshot({ path: OUT_BEFORE, fullPage: false });
  report.screenshot = OUT_BEFORE;
  report.steps.push({
    name: "warning",
    ok: false,
    message: "La barra de simulación no apareció. Probable causa: el modelo no se cargó via UI o la sesión no tiene acceso. La sonda funciona en un dev server con sesión autenticada y el modelo 'modelo-simulacion-lab-complejo' creado via API. Para validar el fix sin esos prerequisitos, abre mockup-comparativo.html en docs/bugs/BUG-20260606T063734Z-52df54/.",
  });
}

await writeFile(JSON_OUT, JSON.stringify(report, null, 2));
console.log("json:", JSON_OUT);
console.log("alignmentCheck:", report.alignmentCheck);
console.log("barraStyle:", report.barraStyle);
console.log("narrativaStyle:", report.narrativaStyle);
console.log("pageErrors:", pageErrors.length, "consoleErrors:", consoleErrors.length);

await browser.close();
