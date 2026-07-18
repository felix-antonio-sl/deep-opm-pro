// Auditoria in-vivo del modelador OPM en navegador real.
// Uso: node scripts/in-vivo-test.mjs [URL]
// Default URL: http://127.0.0.1:5173/

import { chromium } from "@playwright/test";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const URL_OBJETIVO = process.argv[2] ?? "http://127.0.0.1:5173/";
const RAIZ_REPO = resolve(import.meta.dirname, "..", "..");
const DIR_SHOTS = resolve(RAIZ_REPO, "app/test-results/in-vivo");
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

function record(seccion, criterio, estado, detalle = "") {
  findings.push({ seccion, criterio, estado, detalle });
  const icono = estado === "OK" ? "[OK]" : estado === "FAIL" ? "[X]" : estado === "WARN" ? "[!]" : "[i]";
  console.log(`${icono} ${seccion} :: ${criterio}${detalle ? " - " + detalle : ""}`);
}

async function screenshot(page, nombre, options = {}) {
  const ruta = resolve(DIR_SHOTS, nombre);
  await page.screenshot({ path: ruta, fullPage: options.fullPage ?? true });
  const relativa = `app/test-results/in-vivo/${nombre}`;
  screenshots.push(relativa);
  return relativa;
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
  try {
    return await locator.count();
  } catch {
    return 0;
  }
}

async function attr(locator, name) {
  try {
    return await locator.first().getAttribute(name);
  } catch {
    return null;
  }
}

function recordBool(seccion, criterio, ok, detalle = "", estadoFail = "FAIL") {
  record(seccion, criterio, ok ? "OK" : estadoFail, detalle);
}

async function recordVisible(seccion, criterio, locator, timeout = 900, estadoFail = "FAIL") {
  const visible = await waitVisible(locator, timeout);
  recordBool(seccion, criterio, visible, "", estadoFail);
  return visible;
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
  await pantalla.waitFor({ state: "visible", timeout: 900 }).catch(() => undefined);
  if ((await locatorCount(pantalla)) === 0) return false;
  if (!(await waitVisible(pantalla, 250))) return false;
  await pantalla.getByRole("button", { name: /Empezar vacío|Nuevo/ }).click();
  await pantalla.waitFor({ state: "detached", timeout: 2500 }).catch(() => undefined);
  return true;
}

async function resetWorkbench(page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  }).catch(() => undefined);
  await page.goto(URL_OBJETIVO, { waitUntil: "networkidle", timeout: 20000 });
  await cerrarPantallaInicioSiVisible(page);
  await page.waitForTimeout(250);
}

async function crearCosa(page, tipo, nombre) {
  await page.getByRole("button", { name: tipo, exact: true }).click();
  const modal = page.getByTestId("modal-nombre-cosa");
  if (await waitVisible(modal, 800)) {
    await modal.getByLabel("Nombre").fill(nombre);
    await modal.getByRole("button", { name: "OK" }).click();
    await modal.waitFor({ state: "detached", timeout: 2500 }).catch(() => undefined);
  } else {
    const inputNombre = page.getByLabel("Nombre").first();
    if (await waitVisible(inputNombre, 500)) await inputNombre.fill(nombre);
  }
  await page.waitForTimeout(180);
  return elementoPorTexto(page, nombre);
}

async function ejecutarComando(page, query, itemId) {
  await page.locator("main").click({ position: { x: 500, y: 80 } });
  await page.keyboard.press("Control+KeyK");
  const palette = page.getByTestId("command-palette");
  await palette.waitFor({ state: "visible", timeout: 1500 });
  await palette.getByRole("combobox").fill(query);
  const item = page.getByTestId(`command-palette-item-${itemId}`);
  await item.waitFor({ state: "visible", timeout: 1500 });
  await item.click();
}

async function restaurarPanelOplSiMinimizado(page) {
  const restaurar = page.getByTestId("panel-opl-restaurar");
  if ((await locatorCount(restaurar)) > 0 && await waitVisible(restaurar, 250)) {
    await restaurar.click();
    await page.getByTestId("panel-opl").waitFor({ state: "visible", timeout: 1500 }).catch(() => undefined);
  }
}

async function abrirDialogoJson(page) {
  const dialogoUnificado = page.getByTestId("dialogo-abrir-importar");
  if (await waitVisible(dialogoUnificado, 250)) {
    await abrirPanelJsonSiExiste(dialogoUnificado);
    return dialogoUnificado;
  }
  const dialogoLegacy = page.getByTestId("dialogo-importar-exportar-json");
  if (await waitVisible(dialogoLegacy, 250)) return dialogoLegacy;
  await ejecutarComando(page, "abrir importar", "menu-abrir-importar");
  const dialogo = page.getByTestId("dialogo-abrir-importar")
    .or(page.getByTestId("dialogo-importar-exportar-json"));
  await dialogo.waitFor({ state: "visible", timeout: 2500 });
  await abrirPanelJsonSiExiste(dialogo);
  return dialogo;
}

async function abrirPanelJsonSiExiste(dialogo) {
  const panelJson = dialogo.getByTestId("panel-json-abrir-importar");
  if ((await locatorCount(panelJson)) === 0) {
    const trigger = dialogo.getByTestId("abrir-importar-json");
    if (await waitVisible(trigger, 500)) {
      await trigger.click();
      await panelJson.waitFor({ state: "visible", timeout: 1500 });
    }
  }
  if ((await locatorCount(panelJson)) === 0) return;
  const detailsCerrado = await panelJson.evaluate(
    (el) => el.tagName === "DETAILS" && !(el).open,
  ).catch(() => false);
  if (detailsCerrado) await panelJson.locator("summary").click();
}

async function exportarJson(page) {
  const dialogo = await abrirDialogoJson(page);
  await dialogo.getByRole("button", { name: "Exportar", exact: true }).click();
  const json = await dialogo.locator('textarea[spellcheck="false"], textarea[data-testid="textarea-json"]').first().inputValue();
  await dialogo.getByRole("button", { name: /^(Cerrar|Cancelar)$/ }).click();
  await dialogo.waitFor({ state: "detached", timeout: 2500 }).catch(() => undefined);
  return json;
}

async function conectarConsumo(page, origenNombre, destinoNombre) {
  await elementoPorTexto(page, origenNombre).click();
  await page.getByTestId("abrir-menu-tipo-enlace").click();
  const menu = page.getByTestId("menu-tipo-enlace");
  await menu.waitFor({ state: "visible", timeout: 1500 });
  await screenshot(page, "05-menu-tipo-enlace.png");
  await menu.getByTestId("menu-tipo-enlace-consumo").click();

  const indicador = page.getByTestId("indicador-modo-canonico");
  const modoConectar = await attr(indicador, "data-modo");
  const heading = await page.getByTestId("viewpoint-heading").textContent().catch(() => "");
  recordBool("5. Enlace y submodo", "Sticky badge entra en modo conectar", modoConectar === "conectar", String(modoConectar));
  recordBool("5. Enlace y submodo", "ViewPoint anuncia 'conectando'", heading === "Workbench OPM - conectando", heading ?? "");

  await elementoPorTexto(page, destinoNombre).click();
  await page.waitForTimeout(250);
}

function modeloMultiOpd() {
  return {
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
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "a-entrada": { id: "a-entrada", entidadId: "o-entrada", opdId: "opd-1", x: 80, y: 90, width: 135, height: 60 },
          },
          enlaces: {},
        },
        "opd-2": {
          id: "opd-2",
          nombre: "SD1",
          padreId: "opd-1",
          apariencias: {
            "a-hijo": { id: "a-hijo", entidadId: "p-hijo", opdId: "opd-2", x: 220, y: 130, width: 135, height: 60 },
          },
          enlaces: {},
        },
      },
    },
  };
}

function modeloSystemDiagramSonda() {
  return {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "modelo-in-vivo-system-diagram",
      nombre: "System Diagram",
      opdRaizId: "opd-1",
      nextSeq: 12,
      entidades: {
        "o-input": { id: "o-input", tipo: "objeto", nombre: "Main Input", esencia: "informacional", afiliacion: "sistemica" },
        "p-doing": { id: "p-doing", tipo: "proceso", nombre: "Main System Doing", esencia: "fisica", afiliacion: "sistemica" },
        "o-output": { id: "o-output", tipo: "objeto", nombre: "Main Output", esencia: "informacional", afiliacion: "sistemica" },
      },
      estados: {},
      enlaces: {
        "e-consumo": {
          id: "e-consumo",
          tipo: "consumo",
          origenId: { kind: "entidad", id: "o-input" },
          destinoId: { kind: "entidad", id: "p-doing" },
          etiqueta: "",
        },
        "e-resultado": {
          id: "e-resultado",
          tipo: "resultado",
          origenId: { kind: "entidad", id: "p-doing" },
          destinoId: { kind: "entidad", id: "o-output" },
          etiqueta: "",
        },
      },
      abanicos: {},
      opds: {
        "opd-1": {
          id: "opd-1",
          nombre: "SD",
          padreId: null,
          apariencias: {
            "a-input": { id: "a-input", entidadId: "o-input", opdId: "opd-1", x: 100, y: 180, width: 135, height: 60 },
            "a-doing": { id: "a-doing", entidadId: "p-doing", opdId: "opd-1", x: 340, y: 180, width: 135, height: 60 },
            "a-output": { id: "a-output", entidadId: "o-output", opdId: "opd-1", x: 580, y: 180, width: 135, height: 60 },
          },
          enlaces: {
            "ae-consumo": { id: "ae-consumo", enlaceId: "e-consumo", opdId: "opd-1", vertices: [] },
            "ae-resultado": { id: "ae-resultado", enlaceId: "e-resultado", opdId: "opd-1", vertices: [] },
          },
        },
      },
    },
  };
}

async function importarModelo(page, modelo) {
  const dialogo = await abrirDialogoJson(page);
  await dialogo.locator('textarea[spellcheck="false"]').first().fill(JSON.stringify(modelo));
  await dialogo.getByRole("button", { name: "Importar", exact: true }).click();
  const confirmacion = page.getByRole("dialog").filter({ has: page.getByRole("button", { name: "Descartar" }) });
  if (await waitVisible(confirmacion, 500)) {
    await confirmacion.getByRole("button", { name: "Descartar" }).click();
  }
  await dialogo.waitFor({ state: "detached", timeout: 2500 }).catch(() => undefined);
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
  return findings.map((f) => `| ${f.estado} | ${f.seccion} | ${f.criterio} | ${String(f.detalle ?? "").replace(/\|/g, "\\|")} |`).join("\n");
}

function generarReporte() {
  const conteos = resumenConteos();
  const bloqueoRuntime = conteos.pageErrors + conteos.consoleErrors + conteos.requestFailures;
  const veredicto = conteos.fail === 0 && bloqueoRuntime === 0
    ? "APROBADO: la auditoria in-vivo no detecta fallos bloqueantes ni errores runtime."
    : "REVISAR: hay fallos bloqueantes o errores runtime que requieren correccion.";
  const secciones = conteosPorSeccion()
    .map((s) => `| ${s.seccion} | ${s.OK} | ${s.FAIL} | ${s.WARN} | ${s.INFO} |`)
    .join("\n");
  const runtime = [
    ...pageErrors.map((m) => `- pageerror: ${m}`),
    ...consoleMessages.map((m) => `- console.${m.type}: ${m.text}`),
    ...requestFailures.map((m) => `- requestfailed: ${m.url} (${m.reason})`),
  ].join("\n") || "- Sin pageerror, console.error ni requestfailed registrados.";
  const artifacts = screenshots.map((s) => `- \`${s}\``).join("\n") || "- No se generaron capturas.";

  return `# Reporte ejecutivo in-vivo OPMKV

**Fecha**: ${FECHA}
**URL auditada**: \`${URL_OBJETIVO}\`

## Veredicto

${veredicto}

| Criterios | OK | FAIL | WARN | INFO | pageerror | console.error | console.warn | requestfailed |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| ${conteos.criterios} | ${conteos.ok} | ${conteos.fail} | ${conteos.warn} | ${conteos.info} | ${conteos.pageErrors} | ${conteos.consoleErrors} | ${conteos.consoleWarnings} | ${conteos.requestFailures} |

## Cobertura por seccion

| Seccion | OK | FAIL | WARN | INFO |
|---|---:|---:|---:|---:|
${secciones}

## Detalle de criterios

| Estado | Seccion | Criterio | Detalle |
|---|---|---|---|
${markdownTablaDetalle()}

## Runtime

${runtime}

## Artefactos generados

${artifacts}

## Hallazgos UX accionables

- El scaffolding de descomposicion entra directamente en renombrado inline encadenado: Enter avanza por los tres subprocesos y el diagnostico los agrupa en un solo aviso.
- El flujo principal UX/IFML queda operativo: bienvenida, chrome IFML, command palette, menu contextual, feedback anclado al canvas, conexion por \`MenuTipoEnlace\` y modo mobile review.
- La edicion mobile sigue tratada como fuera de alcance productivo; el modo revision expone tabs y aviso de edicion en escritorio/tablet.
- El siguiente corte UX vigente es C′·C: barra de simulacion honesta y re-encuadre al cambiar el viewport.

## Riesgos detectados

- La sonda depende de los \`data-testid\` estabilizados por los smoke tests; si una superficie IFML se renombra, hay que actualizar esta auditoria junto con el smoke correspondiente.
- Las capturas son artefactos regenerables bajo \`app/test-results/in-vivo/\`; no son fuente versionada.

## Como reproducir

\`\`\`bash
cd app
node scripts/in-vivo-test.mjs ${URL_OBJETIVO}
\`\`\`
`;
}

let browser;
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

  const inicio = Date.now();
  await page.goto(URL_OBJETIVO, { waitUntil: "networkidle", timeout: 20000 });
  record("1. Carga y bienvenida", "Carga inicial llega a networkidle", "OK", `${Date.now() - inicio} ms`);
  record("1. Carga y bienvenida", "Titulo de pagina", "INFO", await page.title());

  const pantallaInicio = page.getByTestId("pantalla-inicio");
  const bienvenidaVisible = await waitVisible(pantallaInicio, 1200);
  recordBool("1. Carga y bienvenida", "Playwright omite bienvenida precargada por contrato", !bienvenidaVisible);
  if (bienvenidaVisible) {
    const glosa = await pantallaInicio.textContent();
    const glosaOk = ["Cosa", "OPD", "Apariencia", "Enlace"].every((termino) => glosa?.includes(termino));
    recordBool("1. Carga y bienvenida", "Mini-glosa OPM cubre 4 terminos core", glosaOk, glosa?.slice(0, 180) ?? "");
  }
  await screenshot(page, "01-bienvenida.png");

  await cerrarPantallaInicioSiVisible(page);
  await recordVisible("1. Carga y bienvenida", "Toolbar raiz visible", page.getByTestId("toolbar-root"));
  await recordVisible("1. Carga y bienvenida", "Canvas JointJS visible", page.locator(".joint-paper"));
  await recordVisible("1. Carga y bienvenida", "Arbol OPD visible", page.getByTestId("tree-pane"));
  await recordVisible("1. Carga y bienvenida", "Inspector visible", page.getByTestId("inspector-pane"));
  await recordVisible("1. Carga y bienvenida", "Panel OPL visible o minimizado", page.getByTestId("opl-pane").or(page.getByTestId("panel-opl-minimizado")));
  recordBool(
    "1. Carga y bienvenida",
    "Diagnostico se omite cuando el modelo vacio no tiene avisos",
    (await locatorCount(page.getByTestId("panel-diagnostico"))) === 0,
  );
  await recordVisible("1. Carga y bienvenida", "Hint compacto Iniciar SD visible", page.getByTestId("estado-vacio-hint").or(page.getByTestId("estado-vacio-opm")));
  await screenshot(page, "02-workbench-vacio.png");

  const mainAttrs = await page.locator("main").evaluate((el) => ({
    viewpoint: el.getAttribute("data-viewpoint"),
    modo: el.getAttribute("data-context-modo"),
    submodo: el.getAttribute("data-context-submodo"),
    def: el.getAttribute("data-viewpoint-default"),
  }));
  recordBool("2. Chrome IFML", "Workbench declara ViewPoint default de edicion", mainAttrs.viewpoint === "Edicion" && mainAttrs.def === "true", JSON.stringify(mainAttrs));
  await recordVisible("2. Chrome IFML", "Cluster Modelar montado en desktop", page.getByRole("group", { name: "Modelar" }));
  await recordVisible("2. Chrome IFML", "Cluster Conectar montado en desktop", page.getByRole("group", { name: "Conectar" }));
  recordBool(
    "2. Chrome IFML",
    "Relacion permanece deshabilitada sin origen",
    await page.getByTestId("abrir-menu-tipo-enlace").isDisabled(),
  );
  await recordVisible("2. Chrome IFML", "Meta editorial anuncia acceso a comandos", page.getByText("editor vacío").first());

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await recordVisible("2. Chrome IFML", "Ctrl+K abre CommandPalette", palette);
  recordBool("2. Chrome IFML", "CommandPalette declara estereotipo Modal", await attr(palette, "data-ifml-stereotype") === "Modal");
  await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "combobox", undefined, { timeout: 1200 }).catch(() => undefined);
  recordBool("2. Chrome IFML", "Combobox de CommandPalette recibe foco", await palette.getByRole("combobox").evaluate((el) => el === document.activeElement).catch(() => false));
  await palette.getByRole("combobox").fill("tabla enlaces");
  await recordVisible("2. Chrome IFML", "Busqueda fuzzy encuentra Tabla de enlaces", page.getByTestId("command-palette-item-menu-tabla-enlaces"));
  await screenshot(page, "03-command-palette.png");
  await palette.getByRole("combobox").fill("abrir importar");
  recordBool(
    "2. Chrome IFML",
    "CommandPalette expone la puerta unificada de modelos y JSON",
    (await locatorCount(page.getByTestId("command-palette-item-menu-abrir-importar"))) === 1,
  );
  await page.keyboard.press("Escape");
  recordBool("2. Chrome IFML", "Escape cierra CommandPalette", (await locatorCount(page.getByTestId("command-palette"))) === 0);

  await resetWorkbench(page);
  await importarModelo(page, modeloSystemDiagramSonda());
  await restaurarPanelOplSiMinimizado(page);
  const elementosDemo = await locatorCount(page.locator(".joint-element"));
  const enlacesDemo = await locatorCount(page.locator(".joint-link"));
  recordBool("3. Ejemplo y SSOT visual", "Ejemplo System Diagram carga >=3 cosas", elementosDemo >= 3, `cosas=${elementosDemo}`);
  recordBool("3. Ejemplo y SSOT visual", "Ejemplo System Diagram carga >=2 enlaces", enlacesDemo >= 2, `enlaces=${enlacesDemo}`);
  await recordVisible("3. Ejemplo y SSOT visual", "OPL renderiza sentencia de consumo del ejemplo", page.getByText(/Main\s+System\s+Doing\s+consume\s+Main\s+Input\./).first());

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
  const fillTransparenteOk = cuerposCosa.length > 0 && cuerposCosa.every((c) => c.fill === "transparent");
  const strokeSemanticoOk = objetos.length > 0
    && procesos.length > 0
    && objetos.every((c) => c.stroke === "#27613f")
    && procesos.every((c) => c.stroke === "#1d3f78");
  const cuerposEstandar = cuerposCosa.filter((c) => c.width >= 135 && Math.abs(c.height - 60) <= 2);
  const dimsOk = cuerposEstandar.length === cuerposCosa.length;
  record("3. Ejemplo y SSOT visual", "Cosas detectadas por shape", "INFO", JSON.stringify({ objetos: objetos.length, procesos: procesos.length, cuerposEstandar: cuerposEstandar.length, visual }));
  recordBool("3. Ejemplo y SSOT visual", "CANON-V3 conserva cuerpos transparentes", fillTransparenteOk);
  recordBool("3. Ejemplo y SSOT visual", "CANON-V3 distingue objeto y proceso por stroke semantico", strokeSemanticoOk);
  recordBool("3. Ejemplo y SSOT visual", "Dimensiones respetan minimo 135x60 y expanden texto largo", dimsOk);
  await screenshot(page, "04-ejemplo-cafetera.png");

  await resetWorkbench(page);
  await crearCosa(page, "Proceso", "Procesar");
  const barra = page.getByTestId("barra-herramientas-elemento");
  await recordVisible("4. Feedback overlay", "Barra contextual aparece al seleccionar proceso", barra);
  recordBool("4. Feedback overlay", "Barra contextual usa role toolbar", await attr(barra, "role") === "toolbar");
  const labelBarraProceso = await attr(barra, "aria-label") ?? "";
  recordBool("4. Feedback overlay", "Barra contextual nombra la seleccion", /Acciones sobre (Proceso|Procesar)/.test(labelBarraProceso), labelBarraProceso);
  const badge = page.locator('[data-testid="error-badge"][data-regla-id="proceso-sin-entrada-ni-salida"]');
  await recordVisible("4. Feedback overlay", "ErrorBadge inline para proceso sin entrada/salida", badge);
  recordBool("4. Feedback overlay", "ErrorBadge expone aria-label metodologico", /proceso-sin-entrada-ni-salida/.test(await attr(badge, "aria-label") ?? ""));
  await badge.first().click();
  const diagnostico = page.getByTestId("panel-diagnostico");
  recordBool("4. Feedback overlay", "Click en ErrorBadge expande diagnostico", await attr(diagnostico, "data-expandido") === "true");
  recordBool("4. Feedback overlay", "Aviso compartido queda resaltado", await attr(page.getByTestId("aviso-proceso-sin-entrada-ni-salida"), "data-resaltado") === "true");
  await screenshot(page, "05-feedback-errorbadge.png");

  await crearCosa(page, "Objeto", "Entrada");

  await conectarConsumo(page, "Entrada", "Procesar");
  const enlacesTrasConexion = await locatorCount(page.locator(".joint-link"));
  recordBool("5. Enlace y submodo", "Consumo Entrada -> Procesar crea enlace", enlacesTrasConexion === 1, `enlaces=${enlacesTrasConexion}`);
  await recordVisible("5. Enlace y submodo", "OPL refleja consumo creado", page.getByText(/Procesar\s+consume\s+Entrada/).first());
  const exportado = JSON.parse(await exportarJson(page));
  const tieneConsumo = Object.values(exportado.modelo.enlaces).some((enlace) => enlace.tipo === "consumo");
  recordBool("5. Enlace y submodo", "Export JSON conserva enlace tipo consumo", tieneConsumo);
  await screenshot(page, "07-consumo-creado.png");

  await elementoPorTexto(page, "Procesar").click();
  await page.keyboard.press("Delete");
  const toast = page.getByTestId("flash-toast").filter({ hasText: /Eliminado.*Procesar/ });
  await recordVisible("4. Feedback overlay", "FlashToast anuncia eliminacion", toast);
  recordBool("4. Feedback overlay", "FlashToast usa role status", await attr(toast, "role") === "status");
  recordBool("4. Feedback overlay", "FlashToast usa aria-live polite", await attr(toast, "aria-live") === "polite");
  await screenshot(page, "08-flash-toast.png");

  await resetWorkbench(page);
  await importarModelo(page, modeloMultiOpd());
  const treeitems = await locatorCount(page.locator('[role="treeitem"]'));
  recordBool("6. Arbol OPD y JSON", "Import JSON multi-OPD hidrata arbol con nodos", treeitems >= 2, `treeitems=${treeitems}`);
  await page.locator('[role="treeitem"][data-opd-id="opd-2"]').click();
  await recordVisible("6. Arbol OPD y JSON", "Click en OPD hijo cambia canvas activo", page.getByText("Proceso hijo").first());
  await screenshot(page, "09-multi-opd-import.png");

  await resetWorkbench(page);
  await crearCosa(page, "Proceso", "Procesar Pedido");
  await page.getByTestId("barra-inzoom").click();
  const renameEncadenado = page.getByTestId("renombrado-inline");
  await recordVisible("7. Scaffolding sin ruido", "Descomponer abre el primer placeholder en edicion inline", renameEncadenado);
  const panelDiagnosticoScaffolding = page.getByTestId("panel-diagnostico");
  if (await waitVisible(panelDiagnosticoScaffolding, 500)) {
    if (await attr(panelDiagnosticoScaffolding, "data-expandido") !== "true") {
      // `HTMLElement.click()` inspecciona sin robar foco al input inline. Un
      // click físico confirmaría por blur el placeholder actual y alteraría
      // precisamente el flujo que esta sonda quiere observar.
      await panelDiagnosticoScaffolding.evaluate((panel) => {
        panel.querySelector('[data-testid="panel-diagnostico-toggle"]')?.click();
      });
    }
  }
  const avisoAgrupado = page.getByText(/3 subprocesos del OPD "SD1" esperan un nombre de dominio/);
  recordBool(
    "7. Scaffolding sin ruido",
    "El diagnostico agrupa los tres placeholders en un aviso",
    (await locatorCount(avisoAgrupado)) === 1,
    `avisos=${await locatorCount(avisoAgrupado)}`,
  );
  const nombresIniciales = [];
  for (const nombre of ["Recibir Pedido", "Validar Pedido", "Despachar Pedido"]) {
    nombresIniciales.push(await renameEncadenado.inputValue());
    await renameEncadenado.fill(nombre);
    await renameEncadenado.press("Enter");
    await page.waitForTimeout(120);
  }
  recordBool(
    "7. Scaffolding sin ruido",
    "Enter avanza por los tres placeholders sembrados",
    nombresIniciales.join("|") === "Procesar Pedido 1|Procesar Pedido 2|Procesar Pedido 3"
      && (await locatorCount(renameEncadenado)) === 0,
    JSON.stringify(nombresIniciales),
  );
  recordBool(
    "7. Scaffolding sin ruido",
    "El aviso desaparece al completar los nombres de dominio",
    (await locatorCount(avisoAgrupado)) === 0,
  );
  await screenshot(page, "10-scaffolding-renombrado-encadenado.png");

  await resetWorkbench(page);
  await crearCosa(page, "Objeto", "Pedido");
  await page.getByTestId("toolbar-crear-estado").click();
  const renameEstados = page.getByTestId("halo-estado-rename-input");
  await recordVisible("7. Scaffolding sin ruido", "Sembrar estados abre el primer nombre en edicion inline", renameEstados);
  const nombresEstadoIniciales = [];
  for (const nombre of ["pendiente", "aprobado"]) {
    nombresEstadoIniciales.push(await renameEstados.inputValue());
    await renameEstados.fill(nombre);
    await renameEstados.press("Enter");
    await page.waitForTimeout(120);
  }
  recordBool(
    "7. Scaffolding sin ruido",
    "Enter avanza por los dos estados sembrados",
    nombresEstadoIniciales.join("|") === "estado1|estado2"
      && (await locatorCount(renameEstados)) === 0,
    JSON.stringify(nombresEstadoIniciales),
  );
  await recordVisible("7. Scaffolding sin ruido", "Los nombres de estado quedan visibles en el objeto", page.getByText("pendiente").or(page.getByText("aprobado")).first());
  await screenshot(page, "11-estados-renombrado-encadenado.png");

  await resetWorkbench(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(URL_OBJETIVO, { waitUntil: "networkidle", timeout: 20000 });
  await cerrarPantallaInicioSiVisible(page);
  const overflow = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.body.clientWidth,
  }));
  recordBool("8. Mobile review", "Viewport 390x844 no tiene overflow horizontal >8px", overflow.doc <= 8 && overflow.body <= 8, JSON.stringify(overflow));
  await recordVisible("8. Mobile review", "Tabs mobile review visibles", page.getByTestId("modo-revision-mobile"));
  recordBool("8. Mobile review", "Toolbar pesada no se monta en mobile", (await locatorCount(page.getByTestId("toolbar-actions-pesadas"))) === 0);
  for (const tab of ["canvas", "opds", "opl", "issues"]) {
    await recordVisible("8. Mobile review", `Tab ${tab} visible`, page.getByTestId(`mobile-tab-${tab}`));
  }
  await page.getByTestId("mobile-tab-opds").click();
  await recordVisible("8. Mobile review", "Tab OPDs abre panel de arbol", page.getByTestId("mobile-pane-opds"));
  await page.getByTestId("mobile-tab-opl").click();
  await recordVisible("8. Mobile review", "Tab OPL abre panel OPL", page.getByTestId("mobile-pane-opl"));
  await page.getByTestId("mobile-tab-issues").click();
  await recordVisible("8. Mobile review", "Tab Issues muestra aviso de edicion escritorio/tablet", page.getByTestId("mobile-aviso-edicion"));
  await screenshot(page, "12-mobile-review.png");
} catch (error) {
  record("0. Runtime", "Excepcion no controlada de la sonda", "FAIL", error?.stack ?? String(error));
} finally {
  if (browser) await browser.close();
  const resumen = {
    fecha: FECHA,
    url: URL_OBJETIVO,
    ...resumenConteos(),
    findings,
    pageErrors,
    consoleMessages,
    requestFailures,
    screenshots,
  };
  writeFileSync(RUTA_RESUMEN, `${JSON.stringify(resumen, null, 2)}\n`);
  writeFileSync(RUTA_REPORT, generarReporte());

  const conteos = resumenConteos();
  const bloqueoRuntime = conteos.pageErrors + conteos.consoleErrors + conteos.requestFailures;
  process.exitCode = conteos.fail > 0 || bloqueoRuntime > 0 ? 1 : 0;
  console.log(`\nResumen: OK=${conteos.ok} FAIL=${conteos.fail} WARN=${conteos.warn} INFO=${conteos.info}`);
  console.log(`Reporte: ${RUTA_REPORT}`);
  console.log(`Resumen JSON: ${RUTA_RESUMEN}`);
}
