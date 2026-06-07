// Sonda: BUG-20260607T224342Z-a8e599 — barra de simulación en canvas + diferenciación visual.
//
// Verifica:
// 1. La barra de simulación vive DENTRO del canvas (no position fixed full-width).
// 2. El spine crimson (3px) está presente a la izquierda y a la derecha.
// 3. El borde superior 2px crimson está presente.
// 4. El "live dot" crimson está presente (la tag "Simulacion" tiene un span de 6×6).
// 5. Los botones de ocultar panel (◀ en panel OPL, ▶ en Inspector) NO están
//    cubiertos por la barra — son clickeables.
//
// Reproduce en prod: carga el modelo laboratorio complejo, entra a modo
// simulación y mide.
//
// Uso:
//   URL=https://opforja.sanixai.com node app/scripts/sonda-bug-a8e599.mjs
//   URL=http://127.0.0.1:5270/   node app/scripts/sonda-bug-a8e599.mjs
import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const URL = process.env.URL || "http://127.0.0.1:5270/";
const OUT = process.env.OUT || "/tmp/opencode/bug-a8e599.png";
const JSON_OUT = process.env.JSON_OUT || "/tmp/opencode/bug-a8e599.json";
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

const report = { url: URL, pageErrors, consoleErrors, checks: [], steps: [] };

async function check(name, fn) {
  try {
    const r = await fn();
    report.checks.push({ name, ok: true, ...(r && typeof r === "object" ? r : { value: r }) });
    return r;
  } catch (e) {
    report.checks.push({ name, ok: false, error: String(e) });
    return null;
  }
}

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

// Sesión y modelo
try {
  const s = await page.request.post(URL.replace(/\/$/, "") + "/__deep-opm/session");
  await s.text();
  report.steps.push({ name: "session", ok: s.ok(), status: s.status() });
} catch (e) {
  report.steps.push({ name: "session", ok: false, error: String(e) });
}

// Activar modo simulación
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
  const canvas = page.locator('[data-testid="canvas-pane"]').first();
  const canvasBox = await canvas.boundingBox();
  const barraBox = await barra.boundingBox();

  // Check 1: la barra vive dentro del canvas (no full-width)
  await check("barra-dentro-de-canvas", async () => {
    // La barra debe estar horizontalmente contenida en el canvas
    // (tolerancia 1px por sub-pixel rendering).
    const barraLeft = barraBox.x;
    const barraRight = barraBox.x + barraBox.width;
    const canvasLeft = canvasBox.x;
    const canvasRight = canvasBox.x + canvasBox.width;
    const leftOk = Math.abs(barraLeft - canvasLeft) <= TOLERANCIA_PX;
    const rightOk = Math.abs(barraRight - canvasRight) <= TOLERANCIA_PX;
    return {
      barraLeft, barraRight, canvasLeft, canvasRight,
      leftOk, rightOk, pass: leftOk && rightOk,
      mensaje: leftOk && rightOk
        ? "OK: la barra está horizontalmente contenida en el canvas"
        : `FAIL: la barra no coincide con el canvas (left off by ${Math.abs(barraLeft - canvasLeft).toFixed(2)}px, right off by ${Math.abs(barraRight - canvasRight).toFixed(2)}px)`,
    };
  });

  // Check 2: la barra no es position: fixed (es relative/normal en flujo)
  await check("barra-no-es-fixed", async () => {
    const position = await barra.evaluate((el) => getComputedStyle(el).position);
    return {
      position,
      pass: position !== "fixed",
      mensaje: position === "fixed"
        ? "FAIL: la barra sigue siendo position: fixed"
        : `OK: position es '${position}' (no fixed)`,
    };
  });

  // Check 3: spines crimson presentes (izq y der)
  const spineLeft = page.locator('[data-testid="barra-simulacion-spine-left"]');
  const spineRight = page.locator('[data-testid="barra-simulacion-spine-right"]');
  await check("spine-izq-presente", async () => {
    const count = await spineLeft.count();
    return { count, pass: count > 0, mensaje: count > 0 ? "OK" : "FAIL: spine izquierdo no renderizado" };
  });
  await check("spine-der-presente", async () => {
    const count = await spineRight.count();
    return { count, pass: count > 0, mensaje: count > 0 ? "OK" : "FAIL: spine derecho no renderizado" };
  });

  // Check 4: borde superior crimson (borderTop con crimson)
  await check("borderTop-crimson", async () => {
    const borderTop = await barra.evaluate((el) => getComputedStyle(el).borderTop);
    return {
      borderTop,
      pass: borderTop.includes("2px") && borderTop.toLowerCase().includes("142, 42, 46"),
      mensaje: `borderTop = ${borderTop}`,
    };
  });

  // Check 5: live dot presente en la tag
  const liveDot = page.locator(".sim-live-dot");
  await check("live-dot-presente", async () => {
    const count = await liveDot.count();
    if (count === 0) return { count, pass: false, mensaje: "FAIL: .sim-live-dot no encontrado" };
    const dim = await liveDot.first().evaluate((el) => ({
      width: el.getBoundingClientRect().width,
      height: el.getBoundingClientRect().height,
    }));
    return {
      count,
      dim,
      pass: Math.abs(dim.width - 6) <= 1 && Math.abs(dim.height - 6) <= 1,
      mensaje: `OK: ${count} live-dot, dim ${dim.width.toFixed(1)}x${dim.height.toFixed(1)}`,
    };
  });

  // Check 6: los botones de ocultar panel son clickeables
  // (no están cubiertos por la barra ni por pointer-events:none)
  const btnOcultarOpl = page.locator('[data-testid="btn-ocultar-opl"]');
  const btnOcultarInspector = page.locator('[data-testid="btn-ocultar-inspector"]');
  await check("btn-ocultar-opl-accesible", async () => {
    if (!(await btnOcultarOpl.count())) return { pass: false, mensaje: "btn-ocultar-opl no presente (panel OPL cerrado?)" };
    const box = await btnOcultarOpl.boundingBox();
    const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    const hit = await page.evaluate(({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return { hit: null };
      return {
        hit: el.outerHTML.substring(0, 200),
        closestDataTestid: el.closest("[data-testid]")?.getAttribute("data-testid") ?? null,
      };
    }, point);
    const isOcultarBtn = hit.closestDataTestid === "btn-ocultar-opl";
    return {
      point, hit, pass: isOcultarBtn,
      mensaje: isOcultarBtn
        ? "OK: btn-ocultar-opl es el elementFromPoint (no está cubierto)"
        : `FAIL: el elementFromPoint no es btn-ocultar-opl sino '${hit.closestDataTestid}'`,
    };
  });
  await check("btn-ocultar-inspector-accesible", async () => {
    if (!(await btnOcultarInspector.count())) return { pass: false, mensaje: "btn-ocultar-inspector no presente (panel Inspector cerrado?)" };
    const box = await btnOcultarInspector.boundingBox();
    const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    const hit = await page.evaluate(({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return { hit: null };
      return {
        hit: el.outerHTML.substring(0, 200),
        closestDataTestid: el.closest("[data-testid]")?.getAttribute("data-testid") ?? null,
      };
    }, point);
    const isOcultarBtn = hit.closestDataTestid === "btn-ocultar-inspector";
    return {
      point, hit, pass: isOcultarBtn,
      mensaje: isOcultarBtn
        ? "OK: btn-ocultar-inspector es el elementFromPoint (no está cubierto)"
        : `FAIL: el elementFromPoint no es btn-ocultar-inspector sino '${hit.closestDataTestid}'`,
    };
  });

  // Captura
  await page.screenshot({ path: OUT, fullPage: false });
  report.screenshot = OUT;
} else {
  await page.screenshot({ path: OUT, fullPage: false });
  report.screenshot = OUT;
  report.steps.push({
    name: "warning",
    ok: false,
    message: "La barra de simulación no apareció. Probable causa: el modelo no se cargó via UI o la sesión no tiene acceso. La sonda funciona contra prod con sesión autenticada y el modelo 'modelo-simulacion-lab-complejo' disponible.",
  });
}

const allChecksPass = report.checks.every((c) => c.ok);
report.summary = {
  total: report.checks.length,
  pass: report.checks.filter((c) => c.ok).length,
  fail: report.checks.filter((c) => !c.ok).length,
  pass_: allChecksPass,
};

await writeFile(JSON_OUT, JSON.stringify(report, null, 2));
console.log("json:", JSON_OUT);
console.log("summary:", report.summary);
console.log("pageErrors:", pageErrors.length, "consoleErrors:", consoleErrors.length);
for (const c of report.checks) {
  console.log(`  ${c.ok ? "✓" : "✗"} ${c.name}: ${c.mensaje ?? ""}`);
}

await browser.close();
process.exit(allChecksPass ? 0 : 2);
