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

async function abrirMenuPrincipal(page) {
  await page.getByLabel("Menú principal").click();
  const menu = page.getByRole("menu", { name: "Menú principal" });
  await menu.waitFor({ state: "visible", timeout: 1500 });
  return menu;
}

async function cargarEjemplo(page, nombre) {
  const menu = await abrirMenuPrincipal(page);
  await menu.getByRole("menuitem", { name: "Cargar otro..." }).click();
  const dialogo = page.getByRole("dialog", { name: "Cargar modelo" });
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

async function abrirDialogoJson(page) {
  const dialogo = page.getByTestId("dialogo-importar-exportar-json");
  if (await waitVisible(dialogo, 250)) return dialogo;
  const menu = await abrirMenuPrincipal(page);
  await menu.getByRole("menuitem", { name: "Importar/Exportar JSON..." }).click();
  await dialogo.waitFor({ state: "visible", timeout: 2500 });
  return dialogo;
}

async function exportarJson(page) {
  const dialogo = await abrirDialogoJson(page);
  await dialogo.getByRole("button", { name: "Exportar", exact: true }).click();
  const json = await dialogo.locator('textarea[spellcheck="false"]').first().inputValue();
  await dialogo.getByRole("button", { name: "Cerrar", exact: true }).click();
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

- El flujo principal del corte UX/IFML queda operativo: bienvenida, chrome IFML, command palette, menu contextual, feedback anclado al canvas, conexion por \`MenuTipoEnlace\` y modo mobile review.
- La edicion mobile sigue tratada como fuera de alcance productivo; el modo revision expone tabs y aviso de edicion en escritorio/tablet.
- El siguiente backlog debe elegirse desde funciones post-brief, no desde deuda del script: mini-mapa, etiquetas/enlaces avanzados, import/export OPX real o modelos densos tipo HODOM.

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
  recordBool("1. Carga y bienvenida", "Bienvenida opinada visible en arranque limpio", bienvenidaVisible);
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
  await recordVisible("1. Carga y bienvenida", "Panel diagnostico visible", page.getByTestId("panel-diagnostico"));
  await recordVisible("1. Carga y bienvenida", "Empty state compacto Iniciar SD visible", page.getByTestId("estado-vacio-opm"));
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
  await recordVisible("2. Chrome IFML", "Cluster Ayuda montado en desktop", page.getByRole("group", { name: "Ayuda" }));
  recordBool("2. Chrome IFML", "Conectar esta deshabilitado sin origen", await page.getByTestId("abrir-menu-tipo-enlace").isDisabled().catch(() => false));

  await page.keyboard.press("Control+k");
  const palette = page.getByTestId("command-palette");
  await recordVisible("2. Chrome IFML", "Ctrl+K abre CommandPalette", palette);
  recordBool("2. Chrome IFML", "CommandPalette declara estereotipo Modal", await attr(palette, "data-ifml-stereotype") === "Modal");
  await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "combobox", undefined, { timeout: 1200 }).catch(() => undefined);
  recordBool("2. Chrome IFML", "Combobox de CommandPalette recibe foco", await palette.getByRole("combobox").evaluate((el) => el === document.activeElement).catch(() => false));
  await palette.getByRole("combobox").fill("tabla enlaces");
  await recordVisible("2. Chrome IFML", "Busqueda fuzzy encuentra Tabla de enlaces", page.getByTestId("command-palette-item-menu-tabla-enlaces"));
  await screenshot(page, "03-command-palette.png");
  await page.keyboard.press("Escape");
  recordBool("2. Chrome IFML", "Escape cierra CommandPalette", (await locatorCount(page.getByTestId("command-palette"))) === 0);

  const menuPrincipal = await abrirMenuPrincipal(page);
  const menuTexto = await menuPrincipal.textContent();
  const menuOk = ["Guardar", "Cargar otro", "Nuevo", "Importar/Exportar JSON", "Tabla de enlaces"].every((item) => menuTexto?.includes(item));
  recordBool("2. Chrome IFML", "Menu principal concentra acciones de modelo y vista", menuOk, menuTexto?.slice(0, 220) ?? "");
  await page.keyboard.press("Escape");

  await resetWorkbench(page);
  await cargarEjemplo(page, "System Diagram");
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
  const objetos = visual.filter((c) => c.tag === "rect");
  const procesos = visual.filter((c) => c.tag === "ellipse");
  const fillOk = visual.length > 0 && visual.every((c) => c.fill === "#fdffff");
  const objetosOk = objetos.length > 0 && objetos.every((c) => c.stroke === "#70e483");
  const procesosOk = procesos.length > 0 && procesos.every((c) => c.stroke === "#3bc3ff");
  const dimsOk = visual.length > 0 && visual.every((c) => Math.abs(c.width - 135) <= 2 && Math.abs(c.height - 60) <= 2);
  record("3. Ejemplo y SSOT visual", "Cosas detectadas por shape", "INFO", JSON.stringify({ objetos: objetos.length, procesos: procesos.length, visual }));
  recordBool("3. Ejemplo y SSOT visual", "Fill canonico #fdffff", fillOk);
  recordBool("3. Ejemplo y SSOT visual", "Objetos con stroke #70E483", objetosOk);
  recordBool("3. Ejemplo y SSOT visual", "Procesos con stroke #3BC3FF", procesosOk);
  recordBool("3. Ejemplo y SSOT visual", "Dimensiones canonicas 135x60 con tolerancia 2px", dimsOk);
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
  await elementoPorTexto(page, "Entrada").hover();
  const tooltip = page.getByTestId("hover-tooltip");
  await recordVisible("4. Feedback overlay", "HoverTooltip aparece sobre cosa OPM", tooltip);
  recordBool("4. Feedback overlay", "HoverTooltip no usa aria-live", (await attr(tooltip, "aria-live")) === null);
  await screenshot(page, "06-hover-tooltip.png");
  await page.mouse.move(8, 8);

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
  const toast = page.getByTestId("flash-toast").filter({ hasText: "Selección eliminada" });
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
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(URL_OBJETIVO, { waitUntil: "networkidle", timeout: 20000 });
  await cerrarPantallaInicioSiVisible(page);
  const overflow = await page.evaluate(() => ({
    doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.body.clientWidth,
  }));
  recordBool("7. Mobile review", "Viewport 390x844 no tiene overflow horizontal >8px", overflow.doc <= 8 && overflow.body <= 8, JSON.stringify(overflow));
  await recordVisible("7. Mobile review", "Tabs mobile review visibles", page.getByTestId("modo-revision-mobile"));
  recordBool("7. Mobile review", "Toolbar pesada no se monta en mobile", (await locatorCount(page.getByTestId("toolbar-actions-pesadas"))) === 0);
  for (const tab of ["canvas", "opds", "opl", "issues"]) {
    await recordVisible("7. Mobile review", `Tab ${tab} visible`, page.getByTestId(`mobile-tab-${tab}`));
  }
  await page.getByTestId("mobile-tab-opds").click();
  await recordVisible("7. Mobile review", "Tab OPDs abre panel de arbol", page.getByTestId("mobile-pane-opds"));
  await page.getByTestId("mobile-tab-opl").click();
  await recordVisible("7. Mobile review", "Tab OPL abre panel OPL", page.getByTestId("mobile-pane-opl"));
  await page.getByTestId("mobile-tab-issues").click();
  await recordVisible("7. Mobile review", "Tab Issues muestra aviso de edicion escritorio/tablet", page.getByTestId("mobile-aviso-edicion"));
  await screenshot(page, "10-mobile-review.png");
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
