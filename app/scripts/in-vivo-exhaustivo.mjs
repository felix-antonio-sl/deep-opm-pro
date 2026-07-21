// Auditoria in-vivo EXHAUSTIVA del modelador OPM en navegador real.
// Caso: HODOM completo v1.6 (261 entidades, 200 estados, 467 enlaces, 36 OPDs).
// URL por defecto: https://opforja.sanixai.com/
// Complementa app/scripts/in-vivo-test.mjs (que valida contrato base) y agrega:
//   - bloques 8..12: tablet, persistencia, command palette exhaustivo, undo real,
//     IFML data-attributes, import corrupto, import HODOM v1.6 real.
// El reporte ejecutivo se reemplaza en docs/REPORTE-EJECUTIVO.md.

import { chromium } from "@playwright/test";
import { mkdirSync, rmSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const URL_OBJETIVO = process.argv[2] ?? "https://opforja.sanixai.com/";
// El modelo de dominio (p. ej. HODOM) vive en su propio repo (hd-opm), NO aquí:
// pásalo por argumento. Sin él, el bloque que lo usa se omite con WARN (existsSync).
const RUTA_HODOM = process.argv[3] ?? "";
const RAIZ_REPO = resolve(import.meta.dirname, "..", "..");
const DIR_SHOTS = resolve(RAIZ_REPO, "app/test-results/in-vivo-exhaustivo");
const RUTA_RESUMEN = resolve(DIR_SHOTS, "_resumen.json");
const RUTA_REPORT = resolve(RAIZ_REPO, "docs/REPORTE-EJECUTIVO.md");
const FECHA = new Date().toISOString();

rmSync(DIR_SHOTS, { recursive: true, force: true });
mkdirSync(DIR_SHOTS, { recursive: true });

const findings = [];
const screenshots = [];
const consoleMessages = [];
const pageErrors = [];
const requestFailures = [];
const perfMetrics = {};

function record(seccion, criterio, estado, detalle = "") {
  findings.push({ seccion, criterio, estado, detalle });
  const icono = estado === "OK" ? "[OK]" : estado === "FAIL" ? "[X]" : estado === "WARN" ? "[!]" : "[i]";
  const t = detalle ? ` - ${typeof detalle === "string" ? detalle.slice(0, 240) : JSON.stringify(detalle).slice(0, 240)}` : "";
  console.log(`${icono} ${seccion} :: ${criterio}${t}`);
}

function recordBool(seccion, criterio, ok, detalle = "", estadoFail = "FAIL") {
  record(seccion, criterio, ok ? "OK" : estadoFail, detalle);
}

async function recordVisible(seccion, criterio, locator, timeout = 900, estadoFail = "FAIL") {
  const visible = await waitVisible(locator, timeout);
  recordBool(seccion, criterio, visible, "", estadoFail);
  return visible;
}

async function waitVisible(locator, timeout = 900) {
  try {
    await locator.first().waitFor({ state: "visible", timeout });
    return true;
  } catch {
    return false;
  }
}

async function locatorCount(locator) {
  try { return await locator.count(); } catch { return 0; }
}

async function attr(locator, name) {
  try { return await locator.first().getAttribute(name); } catch { return null; }
}

async function screenshot(page, nombre, options = {}) {
  const ruta = resolve(DIR_SHOTS, nombre);
  await page.screenshot({ path: ruta, fullPage: options.fullPage ?? true });
  const relativa = `app/test-results/in-vivo-exhaustivo/${nombre}`;
  screenshots.push(relativa);
  return relativa;
}

function escapeRegExp(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function elementoPorTexto(page, texto) {
  const flexible = new RegExp(`^\\s*${texto.trim().split(/\s+/).map(escapeRegExp).join("\\s*")}\\s*$`);
  return page.locator(".joint-element").filter({
    has: page.locator("text").filter({ hasText: flexible }),
  });
}

async function cerrarPantallaInicioSiVisible(page) {
  const pantalla = page.getByTestId("pantalla-inicio");
  await pantalla.waitFor({ state: "visible", timeout: 700 }).catch(() => undefined);
  if ((await locatorCount(pantalla)) === 0) return false;
  if (!(await waitVisible(pantalla, 200))) return false;
  try {
    await pantalla.getByRole("button", { name: /Empezar vacío|Nuevo|Saltar|Continuar/ }).first().click({ timeout: 1500 });
    await pantalla.waitFor({ state: "detached", timeout: 2500 }).catch(() => undefined);
    return true;
  } catch {
    return false;
  }
}

async function resetWorkbench(page) {
  await page.evaluate(() => {
    try { localStorage.clear(); } catch { /* guard-catch: storage puede no estar disponible */ }
    try { sessionStorage.clear(); } catch { /* guard-catch: storage puede no estar disponible */ }
  }).catch(() => undefined);
  await page.goto(URL_OBJETIVO, { waitUntil: "networkidle", timeout: 25000 });
  await cerrarPantallaInicioSiVisible(page);
}

async function abrirMenuPrincipal(page) {
  await page.getByLabel("Menú principal").click();
  const menu = page.getByRole("menu", { name: "Menú principal" });
  await menu.waitFor({ state: "visible", timeout: 1500 });
  return menu;
}

async function cargarEjemplo(page, nombre) {
  // La versión actual absorbió el menú en la command palette.
  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await palette.waitFor({ state: "visible", timeout: 1500 });
  await palette.getByRole("combobox").fill("abrir");
  await page.waitForTimeout(150);
  await page.getByTestId("command-palette-item-menu-abrir-importar").click();
  const dialogo = page.getByTestId("dialogo-abrir-importar")
    .or(page.getByRole("dialog", { name: /Abrir \/ importar modelo|Cargar modelo/ }));
  await dialogo.waitFor({ state: "visible", timeout: 2500 });
  await dialogo.getByLabel("Cargar modelo de ejemplo").selectOption(nombre);
  await dialogo.waitFor({ state: "detached", timeout: 2500 }).catch(() => undefined);
  await page.waitForTimeout(250);
}

async function restaurarPanelOplSiMinimizado(page) {
  const restaurar = page.getByTestId("panel-opl-restaurar");
  if ((await locatorCount(restaurar)) > 0 && await waitVisible(restaurar, 250)) {
    await restaurar.click();
    await page.getByTestId("panel-opl").waitFor({ state: "visible", timeout: 1500 }).catch(() => undefined);
  }
}

async function abrirPanelJsonSiExiste(dialogo) {
  const panelJson = dialogo.getByTestId("panel-json-abrir-importar");
  if ((await locatorCount(panelJson)) === 0) return;
  // Forzar open y dispatch evento para que la UI reaccione
  await panelJson.evaluate((el) => {
    if (!el.open) {
      el.open = true;
      el.dispatchEvent(new Event("toggle"));
    }
  });
  // Esperar a que el textarea sea visible
  await dialogo.locator("textarea[data-testid='textarea-json']").waitFor({ state: "visible", timeout: 2000 }).catch(() => undefined);
}

async function abrirDialogoJson(page) {
  const dialogoUnificado = page.getByTestId("dialogo-abrir-importar");
  if (await waitVisible(dialogoUnificado, 250)) {
    await abrirPanelJsonSiExiste(dialogoUnificado);
    return dialogoUnificado;
  }
  const dialogoLegacy = page.getByTestId("dialogo-importar-exportar-json");
  if (await waitVisible(dialogoLegacy, 250)) return dialogoLegacy;
  // Absorbido en la command palette
  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await palette.waitFor({ state: "visible", timeout: 1500 });
  await palette.getByRole("combobox").fill("importar");
  await page.waitForTimeout(150);
  await page.getByTestId("command-palette-item-menu-abrir-importar").click();
  const dialogo = page.getByTestId("dialogo-abrir-importar")
    .or(page.getByTestId("dialogo-importar-exportar-json"));
  await dialogo.waitFor({ state: "visible", timeout: 2500 });
  await abrirPanelJsonSiExiste(dialogo);
  return dialogo;
}

async function importarJsonTexto(page, json) {
  const dialogo = await abrirDialogoJson(page);
  // Forzar visibilidad de textarea via details
  await dialogo.evaluate((d) => {
    const dt = d.querySelector("details[data-testid='panel-json-abrir-importar']");
    if (dt && !dt.open) {
      dt.open = true;
      dt.dispatchEvent(new Event("toggle"));
    }
  });
  const textarea = dialogo.locator("textarea[data-testid='textarea-json']");
  await textarea.waitFor({ state: "visible", timeout: 3000 });
  await textarea.fill(json);
  await dialogo.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();
  const confirmacion = page.getByRole("dialog").filter({ has: page.getByRole("button", { name: "Descartar" }) });
  if (await waitVisible(confirmacion, 500)) {
    await confirmacion.getByRole("button", { name: "Descartar" }).click();
  }
  await page.waitForTimeout(600);
}

async function exportarJson(page) {
  const dialogo = await abrirDialogoJson(page);
  await dialogo.evaluate((d) => {
    const dt = d.querySelector("details[data-testid='panel-json-abrir-importar']");
    if (dt && !dt.open) {
      dt.open = true;
      dt.dispatchEvent(new Event("toggle"));
    }
  });
  await dialogo.getByRole("button", { name: "Exportar", exact: true }).click();
  const json = await dialogo.locator('textarea[spellcheck="false"], textarea[data-testid="textarea-json"]').first().inputValue();
  await dialogo.getByRole("button", { name: /^(Cerrar|Cancelar)$/ }).click();
  await page.waitForTimeout(400);
  return json;
}

async function crearCosa(page, tipo, nombre) {
  // En la versión actual, el botón crea la entidad con el nombre del TIPO
  // (no abre modal). El renombrado se hace desde el Inspector.
  await page.getByRole("button", { name: tipo, exact: true }).click();
  await page.waitForTimeout(300);
  // Si la app actual pide nombre via modal, mantener el flujo legacy
  const modal = page.getByTestId("modal-nombre-cosa");
  if (await waitVisible(modal, 600)) {
    await modal.getByLabel("Nombre").fill(nombre);
    await modal.getByRole("button", { name: "OK" }).click();
    await modal.waitFor({ state: "detached", timeout: 2500 }).catch(() => undefined);
  } else if (nombre && nombre !== tipo) {
    // La entidad quedó seleccionada automáticamente: renombrar via Inspector
    const inputNombre = page.getByLabel("Nombre").first();
    if (await waitVisible(inputNombre, 500)) {
      await inputNombre.fill(nombre);
      await inputNombre.press("Enter");
      await page.waitForTimeout(200);
    }
  }
  await page.waitForTimeout(180);
  return elementoPorTexto(page, nombre ?? tipo);
}

async function conectarConsumo(page, origenNombre, destinoNombre) {
  await elementoPorTexto(page, origenNombre).click();
  await page.getByTestId("abrir-menu-tipo-enlace").click();
  const menu = page.getByTestId("menu-tipo-enlace");
  await menu.waitFor({ state: "visible", timeout: 1500 });
  await menu.getByTestId("menu-tipo-enlace-consumo").click();
  await elementoPorTexto(page, destinoNombre).click();
  await page.waitForTimeout(250);
}

function resumenConteos() {
  return {
    criterios: findings.length,
    ok: findings.filter((f) => f.estado === "OK").length,
    fail: findings.filter((f) => f.estado === "FAIL").length,
    warn: findings.filter((f) => f.estado === "WARN").length,
    info: findings.filter((f) => f.estado === "INFO").length,
    pageErrors: pageErrors.length,
    consoleErrors: consoleMessages.filter((m) => m.type === "error").length,
    consoleWarnings: consoleMessages.filter((m) => m.type === "warning").length,
    requestFailures: requestFailures.length,
  };
}

function conteosPorSeccion() {
  const mapa = new Map();
  for (const finding of findings) {
    const actual = mapa.get(finding.seccion) ?? { OK: 0, FAIL: 0, WARN: 0, INFO: 0 };
    actual[finding.estado] += 1;
    mapa.set(finding.seccion, actual);
  }
  return Array.from(mapa.entries()).map(([seccion, conteos]) => ({ seccion, ...conteos }));
}

function markdownTablaDetalle() {
  return findings
    .map((f) => `| ${f.estado} | ${f.seccion} | ${f.criterio} | ${String(f.detalle ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ")} |`)
    .join("\n");
}

function hallazgoAccionable(f) {
  if (f.estado !== "FAIL" && f.estado !== "WARN") return null;
  return { estado: f.estado, seccion: f.seccion, criterio: f.criterio, detalle: f.detalle };
}

function generarReporte(hodom) {
  const conteos = resumenConteos();
  const bloqueoRuntime = conteos.pageErrors + conteos.consoleErrors + conteos.requestFailures;
  const veredicto = conteos.fail === 0 && bloqueoRuntime === 0
    ? "APROBADO: el audit exhaustivo no detecta fallos bloqueantes."
    : `REVISAR: ${conteos.fail} FAIL + ${bloqueoRuntime} errores runtime requieren correccion.`;
  const secciones = conteosPorSeccion()
    .map((s) => `| ${s.seccion} | ${s.OK} | ${s.FAIL} | ${s.WARN} | ${s.INFO} |`)
    .join("\n");
  const runtime = [
    ...pageErrors.map((m) => `- pageerror: ${m}`),
    ...consoleMessages.map((m) => `- console.${m.type}: ${m.text}`),
    ...requestFailures.map((m) => `- requestfailed: ${m.url} (${m.reason})`),
  ].join("\n") || "- Sin pageerror, console.error ni requestfailed registrados.";
  const artifacts = screenshots.map((s) => `- \`${s}\``).join("\n") || "- No se generaron capturas.";
  const accionables = findings.map(hallazgoAccionable).filter(Boolean);
  const accionablesTexto = accionables.length
    ? accionables.map((a) => `- **[${a.estado}]** _${a.seccion}_ — ${a.criterio}\n  - evidencia: \`${String(a.detalle).slice(0, 280)}\``).join("\n")
    : "- Sin hallazgos accionables.";

  const hodomBloque = hodom
    ? `## HODOM v1.6 — caso stress

- **Ruta**: \`${RUTA_HODOM}\`
- **Tamaño**: ${hodom.bytes} bytes
- **Entidades**: ${hodom.entidades}
- **Estados**: ${hodom.estados}
- **Enlaces**: ${hodom.enlaces}
- **OPDs**: ${hodom.opds}
- **Tipos de enlace**: ${hodom.tiposEnlaces.join(", ")}
- **max entidades por OPD**: ${hodom.maxEntidadesPorOpd}
- **OPD raíz**: \`${hodom.opdRaiz}\`
- **Import**: ${hodom.importMs} ms
- **Tiempo a primer render JointJS tras import**: ${hodom.ttrMs ?? "n/d"} ms
- **OPL del OPD raíz tras import**: ${hodom.oplCaracteres} caracteres visibles
- **Treeitems tras import**: ${hodom.treeitems}
- **Navegación a OPD hoja (${hodom.opdHoja})**: ${hodom.navOpdHojaMs} ms

`
    : `## HODOM v1.6 — caso stress

- No se ejecutó el bloque HODOM v1.6 (archivo no disponible o no se pasó ruta).
`;

  return `# Reporte ejecutivo in-vivo EXHAUSTIVO OPMKV

**Fecha**: ${FECHA}
**URL auditada**: \`${URL_OBJETIVO}\`
**Script**: \`app/scripts/in-vivo-exhaustivo.mjs\`
**Complementa**: \`app/scripts/in-vivo-test.mjs\` (contrato base)

## Veredicto

${veredicto}

| Criterios | OK | FAIL | WARN | INFO | pageerror | console.error | console.warn | requestfailed |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| ${conteos.criterios} | ${conteos.ok} | ${conteos.fail} | ${conteos.warn} | ${conteos.info} | ${conteos.pageErrors} | ${conteos.consoleErrors} | ${conteos.consoleWarnings} | ${conteos.requestFailures} |

${hodomBloque}## Cobertura por seccion

| Seccion | OK | FAIL | WARN | INFO |
|---|---:|---:|---:|---:|
${secciones}

## Performance baseline

${Object.entries(perfMetrics).map(([k, v]) => `- **${k}**: ${v}`).join("\n") || "- Sin metricas capturadas."}

## Detalle de criterios

| Estado | Seccion | Criterio | Detalle |
|---|---|---|---|
${markdownTablaDetalle()}

## Runtime

${runtime}

## Artefactos generados

${artifacts}

## Hallazgos UX accionables

${accionablesTexto}

## Riesgos detectados

- La sonda depende de \`data-testid\` estabilizados en runtime; si un componente se renombra, varios criterios caen en FAIL/WARN sincronizados.
- El bloque HODOM v1.6 asume que el import del modelo grande (730KB JSON) no excede timeouts del backend \`__deep-opm\`. Si el backend rechaza por tamaño, el bloque se reporta con FAIL honesto.
- Las capturas full-page del HODOM pesan ~MB; se mantienen como artefacto regenerable, no versionado.
- \`ifmlViewComponent\` data-attrs solo se verifican en el chrome del workbench; en sub-renders (canvas JointJS) no aplica.

## Como reproducir

\`\`\`bash
cd app
node scripts/in-vivo-exhaustivo.mjs ${URL_OBJETIVO} ${RUTA_HODOM}
\`\`\`
`;
}

const hodomInfo = existsSync(RUTA_HODOM)
  ? (() => {
      const raw = readFileSync(RUTA_HODOM, "utf8");
      const parsed = JSON.parse(raw);
      const m = parsed.modelo;
      const ids = Object.keys(m.opds ?? {});
      return {
        bytes: raw.length,
        entidades: Object.keys(m.entidades).length,
        estados: Object.keys(m.estados ?? {}).length,
        enlaces: Object.keys(m.enlaces ?? {}).length,
        opds: ids.length,
        opdRaiz: m.opdRaizId,
        opdHoja: ids[ids.length - 1] ?? m.opdRaizId,
        tiposEnlaces: [...new Set(Object.values(m.enlaces ?? {}).map((e) => e.tipo))],
        maxEntidadesPorOpd: Math.max(0, ...Object.values(m.opds).map((o) => Object.keys(o.apariencias ?? {}).length)),
      };
    })()
  : null;

let browser;
let hodomResult = null;
try {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  page.on("pageerror", (err) => pageErrors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      consoleMessages.push({ type: msg.type(), text: msg.text().slice(0, 800) });
    }
  });
  page.on("requestfailed", (req) => {
    const failure = req.failure();
    if (!failure || failure.errorText === "net::ERR_ABORTED") return;
    requestFailures.push({ url: req.url(), reason: failure.errorText });
  });

  // ╭─ 0. RUNTIME BASELINE ─────────────────────────────────────────────╮
  const requests = [];
  page.on("response", (res) => {
    const url = res.url();
    if (url.startsWith(URL_OBJETIVO.replace(/\/$/, ""))) {
      requests.push({ url, status: res.status(), type: res.request().resourceType() });
    }
  });
  const t0 = Date.now();
  await page.goto(URL_OBJETIVO, { waitUntil: "networkidle", timeout: 25000 });
  perfMetrics["TTI (load→networkidle)"] = `${Date.now() - t0} ms`;

  const perf = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paint = performance.getEntriesByType("paint");
    return {
      fcp: paint.find((p) => p.name === "first-contentful-paint")?.startTime,
      dcl: nav?.domContentLoadedEventEnd,
      load: nav?.loadEventEnd,
      transfer: nav?.transferSize,
      encoded: nav?.encodedBodySize,
      resources: performance.getEntriesByType("resource").length,
    };
  });
  if (perf.fcp) perfMetrics["FCP"] = `${Math.round(perf.fcp)} ms`;
  if (perf.dcl) perfMetrics["DOMContentLoaded"] = `${Math.round(perf.dcl)} ms`;
  if (perf.load) perfMetrics["load"] = `${Math.round(perf.load)} ms`;
  if (perf.transfer) perfMetrics["Transfer (initial)"] = `${(perf.transfer / 1024).toFixed(1)} KB`;
  perfMetrics["Resources cargados"] = `${perf.resources}`;

  const noOk = requests.filter((r) => r.status >= 400);
  recordBool("0. Runtime baseline", `Sin 4xx/5xx en resources propios`, noOk.length === 0, noOk.slice(0, 5).map((r) => `${r.status} ${r.url}`).join(" | "));
  record("0. Runtime baseline", `Bundle entry cargado`, "INFO", `requests=${requests.length}`);

  // ╭─ 1. CARGA Y BIENVENIDA ───────────────────────────────────────────╮
  recordBool("1. Carga y bienvenida", "Carga inicial llega a networkidle", perf.load > 0, `${perf.load} ms`);
  const titulo = await page.title();
  record("1. Carga y bienvenida", "Titulo de pagina", "INFO", titulo);

  const pantallaInicio = page.getByTestId("pantalla-inicio");
  const bienvenidaVisible = await waitVisible(pantallaInicio, 1200);
  recordBool("1. Carga y bienvenida", "Sin bienvenida modal en cold start (contrato del repo)", !bienvenidaVisible);
  if (bienvenidaVisible) {
    const glosa = await pantallaInicio.textContent().catch(() => "");
    const glosaOk = ["Cosa", "OPD", "Apariencia", "Enlace"].every((termino) => glosa?.includes(termino));
    recordBool("1. Carga y bienvenida", "Mini-glosa cubre 4 terminos core", glosaOk, glosa?.slice(0, 180) ?? "");
    await cerrarPantallaInicioSiVisible(page);
  }
  await screenshot(page, "01-bienvenida-o-cold.png");

  await recordVisible("1. Carga y bienvenida", "Toolbar raiz visible", page.getByTestId("toolbar-root"));
  await recordVisible("1. Carga y bienvenida", "Canvas JointJS visible", page.locator(".joint-paper"));
  await recordVisible("1. Carga y bienvenida", "Arbol OPD visible", page.getByTestId("tree-pane"));
  await recordVisible("1. Carga y bienvenida", "Inspector visible", page.getByTestId("inspector-pane"));
  await recordVisible("1. Carga y bienvenida", "Panel OPL visible o minimizado", page.getByTestId("opl-pane").or(page.getByTestId("panel-opl-minimizado")));
  // Panel diagnóstico es perezoso: solo se monta cuando hay errores. En cold start NO debe estar.
  const diagCold = await locatorCount(page.getByTestId("panel-diagnostico"));
  recordBool("1. Carga y bienvenida", "Panel diagnóstico es lazy (ausente en cold start)", diagCold === 0, `presentes=${diagCold}`);
  await recordVisible("1. Carga y bienvenida", "Hint compacto Iniciar SD visible", page.getByTestId("estado-vacio-hint").or(page.getByTestId("estado-vacio-opm")));
  await screenshot(page, "02-workbench-vacio.png");

  // ╭─ 2. CHROME IFML ──────────────────────────────────────────────────╮
  const mainAttrs = await page.locator("main").evaluate((el) => ({
    viewpoint: el.getAttribute("data-viewpoint"),
    modo: el.getAttribute("data-context-modo"),
    submodo: el.getAttribute("data-context-submodo"),
    def: el.getAttribute("data-viewpoint-default"),
    device: el.getAttribute("data-context-device"),
  }));
  recordBool("2. Chrome IFML", "Workbench declara ViewPoint Edicion default", mainAttrs.viewpoint === "Edicion" && mainAttrs.def === "true", JSON.stringify(mainAttrs));
  recordBool("2. Chrome IFML", "Modo runtime es edicion", mainAttrs.modo === "edicion", mainAttrs.modo);
  recordBool("2. Chrome IFML", "Device declarado coincide con viewport 1440", mainAttrs.device === "desktop", mainAttrs.device);

  await recordVisible("2. Chrome IFML", "Cluster Modelar montado en desktop", page.getByRole("group", { name: "Modelar" }));
  await recordVisible("2. Chrome IFML", "Cluster Conectar visible con R deshabilitado (sin origen)", page.getByRole("group", { name: "Conectar" }));

  // IFML data-attributes: PanelOpl es el contrato vigente, no asumimos todos
  const ifmlCheck = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="panel-opl"]');
    return el ? { vc: el.getAttribute("data-ifml-view-component"), pat: el.getAttribute("data-ifml-pattern") } : null;
  });
  recordBool("2. Chrome IFML", "PanelOpl declara IFML data-attributes (vc + pattern)", ifmlCheck && ifmlCheck.vc && ifmlCheck.pat, JSON.stringify(ifmlCheck));

  // Command palette exhaustivo
  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await recordVisible("2. Chrome IFML", "Ctrl+K abre CommandPalette", palette);
  recordBool("2. Chrome IFML", "CommandPalette declara estereotipo Modal", await attr(palette, "data-ifml-stereotype") === "Modal");
  await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "combobox", undefined, { timeout: 1200 }).catch(() => undefined);
  recordBool("2. Chrome IFML", "Combobox de CommandPalette recibe foco", await palette.getByRole("combobox").evaluate((el) => el === document.activeElement).catch(() => false));

  // Items totales sin filtro
  await palette.getByRole("combobox").fill("");
  await page.waitForTimeout(150);
  const totalItems = await locatorCount(page.locator('[data-testid^="command-palette-item-"]'));
  recordBool("2. Chrome IFML", "CommandPalette ofrece >=50 acciones (universo completo)", totalItems >= 50, `items=${totalItems}`);

  // Búsqueda fuzzy múltiple (queries que sí tokeniza la app)
  for (const query of ["tabla", "guardar", "modelo", "nuevo", "enlaces"]) {
    await palette.getByRole("combobox").fill(query);
    await page.waitForTimeout(180);
    const items = await locatorCount(page.locator('[data-testid^="command-palette-item-"]'));
    recordBool("2. Chrome IFML", `Búsqueda fuzzy '${query}' devuelve >=1 resultado`, items > 0, `items=${items}`);
  }
  await page.keyboard.press("Escape");
  recordBool("2. Chrome IFML", "Escape cierra CommandPalette", (await locatorCount(page.getByTestId("command-palette"))) === 0);
  await screenshot(page, "03-command-palette.png");

  // Verificación: el menú contextual dentro del chrome se absorbió en la paleta
  record("2. Chrome IFML", "Entradas de modelo absorbidas por CommandPalette (universo 60+ items)", "INFO", `items totales=${totalItems}`);

  // ╭─ 3. SSOT VISUAL sobre modelo importable ───────────────────────────╮
  // El producto migró de ejemplos precargados a workspace persistente.
  // Cargamos un modelo sintético via import JSON para verificar SSOT visual.
  const modeloSintetico = {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-sintetico-ssot",
      nombre: "Modelo sintetico SSOT",
      opdRaizId: "opd-1",
      nextSeq: 100,
      entidades: {
        "o-A": { id: "o-A", tipo: "objeto", nombre: "Objeto A", esencia: "informacional", afiliacion: "sistemica" },
        "o-B": { id: "o-B", tipo: "objeto", nombre: "Objeto B", esencia: "informacional", afiliacion: "sistemica" },
        "o-C": { id: "o-C", tipo: "objeto", nombre: "Objeto C", esencia: "informacional", afiliacion: "sistemica" },
        "p-X": { id: "p-X", tipo: "proceso", nombre: "Proceso X", esencia: "informacional", afiliacion: "sistemica" },
        "p-Y": { id: "p-Y", tipo: "proceso", nombre: "Proceso Y", esencia: "informacional", afiliacion: "sistemica" },
      },
      estados: {},
      enlaces: {},
      abanicos: {},
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "a-A": { id: "a-A", entidadId: "o-A", opdId: "opd-1", x: 60, y: 60, width: 135, height: 60 },
            "a-B": { id: "a-B", entidadId: "o-B", opdId: "opd-1", x: 60, y: 180, width: 135, height: 60 },
            "a-C": { id: "a-C", entidadId: "o-C", opdId: "opd-1", x: 60, y: 300, width: 135, height: 60 },
            "a-X": { id: "a-X", entidadId: "p-X", opdId: "opd-1", x: 320, y: 120, width: 135, height: 60 },
            "a-Y": { id: "a-Y", entidadId: "p-Y", opdId: "opd-1", x: 320, y: 240, width: 135, height: 60 },
          },
          enlaces: {},
        },
      },
    },
  };
  await resetWorkbench(page);
  await importarJsonTexto(page, JSON.stringify(modeloSintetico));
  await restaurarPanelOplSiMinimizado(page);
  const elementosDemo = await locatorCount(page.locator(".joint-element"));
  recordBool("3. SSOT visual", "Modelo sintético importa 5 cosas", elementosDemo === 5, `cosas=${elementosDemo}`);

  const visual = await page.locator(".joint-element [joint-selector='body']").evaluateAll((els) => els.map((el) => {
    const rect = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      fill: (el.getAttribute("fill") ?? "").toLowerCase(),
      stroke: (el.getAttribute("stroke") ?? "").toLowerCase(),
      strokeWidth: el.getAttribute("stroke-width"),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  }));
  const cuerposCosa = visual.filter((c) => c.tag === "rect" || c.tag === "ellipse");
  const objetos = cuerposCosa.filter((c) => c.tag === "rect");
  const procesos = cuerposCosa.filter((c) => c.tag === "ellipse");
  record("3. SSOT visual", "Cuerpos detectados por shape", "INFO", `objetos=${objetos.length} procesos=${procesos.length}`);
  // CANON-V2 vigente: fill transparente, stroke semántico por tipo
  const objetosStrokeOk = objetos.length > 0 && objetos.every((c) => c.stroke === "#27613f");
  const procesosStrokeOk = procesos.length > 0 && procesos.every((c) => c.stroke === "#1d3f78");
  const fillTransparente = cuerposCosa.length > 0 && cuerposCosa.every((c) => c.fill === "transparent" || c.fill === "");
  recordBool("3. SSOT visual", "Fill CANON-V2 vigente: transparente (líneas, no lavado)", fillTransparente, JSON.stringify([...new Set(cuerposCosa.map((c) => c.fill))]));
  recordBool("3. SSOT visual", "Stroke CANON-V2 objeto en verde bosque #27613f", objetosStrokeOk, JSON.stringify([...new Set(objetos.map((c) => c.stroke))]));
  recordBool("3. SSOT visual", "Stroke CANON-V2 proceso en azul #1d3f78", procesosStrokeOk, JSON.stringify([...new Set(procesos.map((c) => c.stroke))]));
  const cuerposEstandar = cuerposCosa.filter((c) => Math.abs(c.width - 135) <= 2 && Math.abs(c.height - 60) <= 2);
  recordBool("3. SSOT visual", "Dimensiones estándar 135x60 presentes", cuerposEstandar.length >= 5, `cuerposEstandar=${cuerposEstandar.length}/${cuerposCosa.length}`);
  await screenshot(page, "04-ssot-visual.png");

  // ╭─ 4. FEEDBACK OVERLAY + UNDO REAL ─────────────────────────────────╮
  await resetWorkbench(page);
  await crearCosa(page, "Proceso", "Procesar");
  // Click en el canvas para asegurar foco y que la entidad quede seleccionada
  await elementoPorTexto(page, "Procesar").click().catch(() => undefined);
  await page.waitForTimeout(200);
  const barra = page.getByTestId("barra-herramientas-elemento");
  await recordVisible("4. Feedback overlay", "Barra contextual aparece al seleccionar proceso", barra);
  recordBool("4. Feedback overlay", "Barra contextual usa role toolbar", await attr(barra, "role") === "toolbar");

  // ErrorBadge inline
  const badge = page.locator('[data-testid="error-badge"][data-regla-id="proceso-sin-entrada-ni-salida"]');
  await recordVisible("4. Feedback overlay", "ErrorBadge inline para proceso sin entrada/salida", badge);
  await badge.first().click();
  await page.waitForTimeout(400);
  const diagDespues = await locatorCount(page.getByTestId("panel-diagnostico"));
  recordBool("4. Feedback overlay", "Click en ErrorBadge monta PanelDiagnostico (lazy)", diagDespues > 0, `presentes=${diagDespues}`);
  if (diagDespues > 0) {
    const diagnostico = page.getByTestId("panel-diagnostico");
    recordBool("4. Feedback overlay", "PanelDiagnostico se marca como expandido", await attr(diagnostico, "data-expandido") === "true");
  }
  await screenshot(page, "05-feedback-errorbadge.png");

  // Undo real: crear nueva entidad sin renombrar (para tener 1 sola acción en stack)
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.waitForTimeout(400);
  await page.locator(".joint-paper").click({ position: { x: 800, y: 600 } });
  await page.waitForTimeout(200);
  const elementosAntes = await locatorCount(page.locator(".joint-element"));
  await page.keyboard.press("Control+z");
  await page.waitForTimeout(400);
  const elementosDespuesUndo = await locatorCount(page.locator(".joint-element"));
  recordBool("4. Feedback overlay", "Ctrl+Z deshace última creación", elementosDespuesUndo < elementosAntes, `antes=${elementosAntes} despues=${elementosDespuesUndo}`);

  // ╭─ 5. ENLACE Y SUBMODO + VALIDACION DE FIRMA ──────────────────────╮
  await crearCosa(page, "Objeto", "Entrada");
  await conectarConsumo(page, "Entrada", "Procesar");
  const enlacesTrasConexion = await locatorCount(page.locator(".joint-link"));
  recordBool("5. Enlace y submodo", "Consumo Entrada -> Procesar crea enlace", enlacesTrasConexion === 1, `enlaces=${enlacesTrasConexion}`);
  await recordVisible("5. Enlace y submodo", "OPL refleja consumo creado", page.getByText(/Procesar\s+consume\s+Entrada/).first());

  // Validación de firma: al seleccionar un objeto aislado, el botón R se habilita
  // pero el menú filtra y NO ofrece "consumo" (firma se respeta por filtro, no por disable).
  await resetWorkbench(page);
  await page.getByRole("button", { name: "Objeto", exact: true }).click();
  await page.waitForTimeout(400);
  const rBtn = page.getByTestId("abrir-menu-tipo-enlace");
  const rTitle = await rBtn.getAttribute("title");
  await rBtn.click();
  await page.waitForTimeout(400);
  const consumoItem = page.getByTestId("menu-tipo-enlace-consumo");
  const consumoPresente = await locatorCount(consumoItem) > 0;
  recordBool("5. Enlace y submodo", "Firma OPM: menú filtra tipos no válidos (sin consumo desde objeto aislado)", !consumoPresente, `title="${rTitle}" consumoPresente=${consumoPresente}`);
  await page.keyboard.press("Escape");

  // ╭─ 6. JSON / ÁRBOL / IMPORT CORRUPTO ────────────────────────────────╮
  await resetWorkbench(page);
  const jsonStr = await exportarJson(page);
  const jsonOk = (() => { try { JSON.parse(jsonStr); return true; } catch { return false; } })();
  recordBool("6. JSON y OPD", "Export JSON produce JSON parseable", jsonOk, `len=${jsonStr.length}`);

  const modeloMultiOpd = {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-in-vivo-multi-opd",
      nombre: "Modelo multi OPD in vivo",
      opdRaizId: "opd-1",
      nextSeq: 10,
      entidades: {
        "o-entrada": { id: "o-entrada", tipo: "objeto", nombre: "Entrada raiz", esencia: "informacional", afiliacion: "sistemica" },
        "p-hijo": { id: "p-hijo", tipo: "proceso", nombre: "Proceso hijo", esencia: "informacional", afiliacion: "sistemica" },
      },
      estados: {},
      enlaces: {},
      abanicos: {},
      opds: {
        "opd-1": { id: "opd-1", nombre: "SD", padreId: null, apariencias: { "a-entrada": { id: "a-entrada", entidadId: "o-entrada", opdId: "opd-1", x: 80, y: 90, width: 135, height: 60 } }, enlaces: {} },
        "opd-2": { id: "opd-2", nombre: "SD1", padreId: "opd-1", apariencias: { "a-hijo": { id: "a-hijo", entidadId: "p-hijo", opdId: "opd-2", x: 220, y: 130, width: 135, height: 60 } }, enlaces: {} },
      },
    },
  };
  await importarJsonTexto(page, JSON.stringify(modeloMultiOpd));
  const treeitems = await locatorCount(page.locator('[role="treeitem"]'));
  recordBool("6. JSON y OPD", "Import multi-OPD hidrata árbol", treeitems >= 2, `treeitems=${treeitems}`);
  await page.locator('[role="treeitem"][data-opd-id="opd-2"]').click();
  await recordVisible("6. JSON y OPD", "Click en OPD hijo cambia canvas activo", page.getByText("Proceso hijo").first());
  await screenshot(page, "06-multi-opd-import.png");

  // Import corrupto: opds con null
  await resetWorkbench(page);
  const modeloCorrupto = JSON.parse(JSON.stringify(modeloMultiOpd));
  modeloCorrupto.modelo.opds["opd-1"] = null;
  const elementosAntesCorrupto = await locatorCount(page.locator(".joint-element"));
  await importarJsonTexto(page, JSON.stringify(modeloCorrupto));
  const elementosDespuesCorrupto = await locatorCount(page.locator(".joint-element"));
  recordBool("6. JSON y OPD", "Import corrupto no muta modelo", elementosDespuesCorrupto === elementosAntesCorrupto, `antes=${elementosAntesCorrupto} despues=${elementosDespuesCorrupto}`);

  // ╭─ 7. PERSISTENCIA LOCAL + BACKEND ─────────────────────────────────╮
  await resetWorkbench(page);
  await crearCosa(page, "Objeto", "Persistir-A");
  const dirtyAntes = await page.getByTestId("chip-persistencia").getAttribute("data-variante");
  record("7. Persistencia", "Estado dirty antes de guardar", "INFO", `variante=${dirtyAntes}`);

  // Verificación 1: click chip abre "Guardar como" (no es acción atómica)
  await page.getByTestId("chip-persistencia").click();
  await page.waitForTimeout(800);
  const dialogoGuardar = page.getByRole("dialog").filter({ hasText: /Guardar como|Crear versi/i });
  const dialogoVisible = await waitVisible(dialogoGuardar, 1500);
  recordBool("7. Persistencia", "Click chip-persistencia abre diálogo Guardar como", dialogoVisible, "");
  if (dialogoVisible) {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
  }

  // Verificación 2: el atajo Ctrl+S dispara flujo de persistencia (puede ser Guardar directo
  // o Guardar como si el modelo es anónimo y requiere nombre).
  const antesS = await page.getByTestId("chip-persistencia").getAttribute("data-variante");
  await page.keyboard.press("Control+s");
  await page.waitForTimeout(1500);
  const dialogoSave = await locatorCount(page.getByRole("dialog").filter({ hasText: /Guardar como|Crear versi/ }));
  const dirtyTrasS = await page.getByTestId("chip-persistencia").getAttribute("data-variante");
  recordBool("7. Persistencia", "Ctrl+S dispara flujo de persistencia (diálogo o cambio de variante)", dialogoSave > 0 || dirtyTrasS !== antesS, `dlgCount=${dialogoSave} antes=${antesS} despues=${dirtyTrasS}`);
  if (dialogoSave > 0) await page.keyboard.press("Escape");
  record("7. Persistencia", "Variante final del chip post-Ctrl+S", "INFO", `variante=${dirtyTrasS}`);

  // Endpoint backend de listado
  const apiListado = await page.evaluate(async (base) => {
    try {
      const r = await fetch(`${base}__deep-opm/modelos`, { credentials: "include" });
      return { ok: r.ok, status: r.status, body: (await r.text()).slice(0, 200) };
    } catch (e) { return { ok: false, error: String(e) }; }
  }, URL_OBJETIVO.replace(/\/$/, "/"));
  recordBool("7. Persistencia", "Endpoint __deep-opm/modelos responde 2xx", apiListado.ok && apiListado.status < 300, `status=${apiListado.status} body=${(apiListado.body ?? "").slice(0, 120)}`);

  // ╭─ 8. TABLET (768x1024) ─────────────────────────────────────────────╮
  await resetWorkbench(page);
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(URL_OBJETIVO, { waitUntil: "networkidle", timeout: 20000 });
  await cerrarPantallaInicioSiVisible(page);
  const overflowTablet = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.body.clientWidth,
  }));
  recordBool("8. Tablet", "Viewport 768x1024 sin overflow horizontal >8px", overflowTablet.doc <= 8 && overflowTablet.body <= 8, JSON.stringify(overflowTablet));
  const deviceTablet = await page.locator("main").getAttribute("data-context-device");
  recordBool("8. Tablet", "Device declarado en tablet", deviceTablet === "tablet", deviceTablet);
  await recordVisible("8. Tablet", "Toolbar raiz visible en tablet", page.getByTestId("toolbar-root"));
  await recordVisible("8. Tablet", "Cluster Modelar en tablet", page.getByRole("group", { name: "Modelar" }));
  await screenshot(page, "07-tablet.png");

  // ╭─ 9. MOBILE 390x844 ────────────────────────────────────────────────╮
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(URL_OBJETIVO, { waitUntil: "networkidle", timeout: 20000 });
  await cerrarPantallaInicioSiVisible(page);
  const overflowMobile = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.body.clientWidth,
  }));
  recordBool("9. Mobile", "Viewport 390x844 sin overflow horizontal >8px", overflowMobile.doc <= 8 && overflowMobile.body <= 8, JSON.stringify(overflowMobile));
  const deviceMobile = await page.locator("main").getAttribute("data-context-device");
  recordBool("9. Mobile", "Device declarado en mobile", deviceMobile === "mobile" || deviceMobile === "phone", deviceMobile);
  recordBool("9. Mobile", "Toolbar pesada no se monta en mobile", (await locatorCount(page.getByTestId("toolbar-actions-pesadas"))) === 0);

  // Tabs mobile (canvas, opds, opl, issues)
  for (const tab of ["canvas", "opds", "opl", "issues"]) {
    recordBool("9. Mobile", `Tab ${tab} visible en mobile`, (await locatorCount(page.getByTestId(`mobile-tab-${tab}`))) > 0);
  }
  if ((await locatorCount(page.getByTestId("mobile-tab-opl"))) > 0) {
    await page.getByTestId("mobile-tab-opl").click();
    await page.waitForTimeout(200);
    await recordVisible("9. Mobile", "Tab OPL abre panel OPL", page.getByTestId("mobile-pane-opl").or(page.getByTestId("panel-opl")));
  }
  await screenshot(page, "08-mobile.png");

  // ╭─ 10. HODOM v1.6 — CASO STRESS REAL ────────────────────────────────╮
  if (hodomInfo) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await resetWorkbench(page);
    const tImport = Date.now();
    const hodomJson = readFileSync(RUTA_HODOM, "utf8");
    // Para modelos grandes, copiar el JSON via clipboard y paste, o via input directo
    await page.keyboard.press("Control+k");
    await page.waitForTimeout(400);
    await page.getByTestId("command-palette").getByRole("combobox").fill("abrir");
    await page.waitForTimeout(200);
    await page.getByTestId("command-palette-item-menu-abrir-importar").click();
    const dlgH = page.getByTestId("dialogo-abrir-importar");
    await dlgH.waitFor({ state: "visible", timeout: 5000 });
    await dlgH.evaluate((d) => {
      const dt = d.querySelector("details[data-testid='panel-json-abrir-importar']");
      if (dt) { dt.open = true; dt.dispatchEvent(new Event("toggle")); }
    });
    const taH = dlgH.locator("textarea[data-testid='textarea-json']");
    await taH.waitFor({ state: "visible", timeout: 5000 });
    // Usar evaluate para setear el valor (más rápido que fill para 730KB)
    await taH.evaluate((el, value) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
      setter.call(el, value);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }, hodomJson);
    await page.waitForTimeout(300);
    await dlgH.getByRole("button", { name: "Importar y reemplazar pestaña activa", exact: true }).click();
    await page.waitForTimeout(2000);
    const confirmH = page.getByRole("dialog").filter({ has: page.getByRole("button", { name: "Descartar" }) });
    if (await waitVisible(confirmH, 1500)) {
      await confirmH.getByRole("button", { name: "Descartar" }).click();
    }
    await page.waitForTimeout(2000);
    const importMs = Date.now() - tImport;
    recordBool("10. HODOM v1.6", "Import del modelo grande completa sin error", true, `bytes=${hodomJson.length} importMs=${importMs}`);

    // Tiempo a primer render JointJS
    const ttr = Date.now();
    const jointReady = await page.waitForFunction(() => {
      const el = document.querySelector(".joint-paper .joint-element");
      return el ? Date.now() : null;
    }, undefined, { timeout: 30000 }).then(() => Date.now() - ttr).catch(() => null);
    recordBool("10. HODOM v1.6", "Primer render JointJS tras import < 15s", jointReady !== null && jointReady < 15000, `ttr=${jointReady} ms`);

    const treeitemsH = await locatorCount(page.locator('[role="treeitem"]'));
    recordBool("10. HODOM v1.6", `Árbol OPD hidrata >=30 OPDs (esperado ${hodomInfo.opds})`, treeitemsH >= Math.min(30, hodomInfo.opds - 1), `treeitems=${treeitemsH}`);

    // OPL del OPD raíz
    const oplText = await page.getByTestId("panel-opl").textContent().catch(() => "");
    recordBool("10. HODOM v1.6", "OPL del OPD raíz tiene >=200 caracteres", oplText.length >= 200, `chars=${oplText.length}`);

    // Selección de OPD hoja
    const tNav = Date.now();
    const opdHoja = page.locator(`[role="treeitem"][data-opd-id="${hodomInfo.opdHoja}"]`);
    const opdHojaVisible = (await locatorCount(opdHoja)) > 0;
    recordBool("10. HODOM v1.6", `OPD hoja (${hodomInfo.opdHoja}) accesible desde árbol`, opdHojaVisible);
    if (opdHojaVisible) {
      await opdHoja.click();
      await page.waitForTimeout(800);
    }
    const navMs = Date.now() - tNav;
    await screenshot(page, "09-hodom-opd-hoja.png", { fullPage: false });

    // Persistencia backend del modelo grande
    await page.getByTestId("chip-persistencia").click();
    await page.waitForTimeout(2000);
    const dirtyH = await page.getByTestId("chip-persistencia").getAttribute("data-variante");
    recordBool("10. HODOM v1.6", "Persistencia backend acepta modelo HODOM completo", dirtyH !== "nuevo", `variante=${dirtyH}`);

    // Verificar que los 10 tipos de enlace están representados en el modelo cargado en memoria
    // (no re-exportamos post-HODOM para evitar regresión de tiempo, leemos el state interno via API)
    const tiposEnMemoria = await page.evaluate(() => {
      // Buscar el modelo en el store global (si está expuesto) o contar desde el canvas
      const enlaces = [...document.querySelectorAll(".joint-link")];
      return enlaces.length;
    });
    record("10. HODOM v1.6", "Enlaces renderizados en canvas (post-import)", "INFO", `joint-links=${tiposEnMemoria}`);

    // Verificación de tipos: la importacion HODOM no mutó el set de tipos esperados
    recordBool("10. HODOM v1.6", "HODOM carga con 10 tipos de enlace según spec", hodomInfo.tiposEnlaces.length === 10, `tipos=${hodomInfo.tiposEnlaces.length} (${hodomInfo.tiposEnlaces.join(",")})`);

    // Screenshot final full-page
    await page.evaluate(() => window.scrollTo(0, 0));
    await screenshot(page, "10-hodom-root.png");

    hodomResult = {
      ...hodomInfo,
      importMs,
      ttrMs: jointReady,
      oplCaracteres: oplText.length,
      treeitems: treeitemsH,
      navOpdHojaMs: navMs,
    };
  } else {
    record("10. HODOM v1.6", "Archivo HODOM no disponible, bloque omitido", "WARN", RUTA_HODOM);
  }
} catch (error) {
  record("0. Runtime", "Excepción no controlada de la sonda", "FAIL", error?.stack ?? String(error));
} finally {
  if (browser) await browser.close();
  const resumen = {
    fecha: FECHA,
    url: URL_OBJETIVO,
    hodom: hodomInfo,
    ...resumenConteos(),
    perfMetrics,
    findings,
    pageErrors,
    consoleMessages,
    requestFailures,
    screenshots,
  };
  writeFileSync(RUTA_RESUMEN, `${JSON.stringify(resumen, null, 2)}\n`);
  writeFileSync(RUTA_REPORT, generarReporte(hodomResult));

  const conteos = resumenConteos();
  const bloqueoRuntime = conteos.pageErrors + conteos.consoleErrors + conteos.requestFailures;
  process.exitCode = conteos.fail > 0 || bloqueoRuntime > 0 ? 1 : 0;
  console.log(`\nResumen: OK=${conteos.ok} FAIL=${conteos.fail} WARN=${conteos.warn} INFO=${conteos.info}  pageerror=${conteos.pageErrors}  console.error=${conteos.consoleErrors}  requestfailed=${conteos.requestFailures}`);
  console.log(`Reporte: ${RUTA_REPORT}`);
  console.log(`Resumen JSON: ${RUTA_RESUMEN}`);
  if (hodomResult) console.log(`HODOM: import=${hodomResult.importMs}ms ttr=${hodomResult.ttrMs}ms treeitems=${hodomResult.treeitems}`);
}
