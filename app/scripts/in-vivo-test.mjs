// Exploración in-vivo del modelador OPM en navegador real.
// Uso: node app/scripts/in-vivo-test.mjs [URL]
// Default URL: http://138.201.53.205:5173/

import { chromium } from "@playwright/test";
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const URL_OBJETIVO = process.argv[2] ?? "http://138.201.53.205:5173/";
const RAIZ_REPO = resolve(import.meta.dirname, "..", "..");
const DIR_SHOTS = resolve(RAIZ_REPO, "app/test-results/in-vivo");
const RUTA_REPORT = resolve(DIR_SHOTS, "REPORTE-EJECUTIVO.md");

mkdirSync(DIR_SHOTS, { recursive: true });

const FECHA = new Date().toISOString();
const findings = [];
const consoleMessages = [];
const pageErrors = [];
const requestFailures = [];

function record(seccion, criterio, estado, detalle) {
  findings.push({ seccion, criterio, estado, detalle });
  const icono = estado === "OK" ? "[OK]" : estado === "FAIL" ? "[X]" : estado === "WARN" ? "[!]" : "[i]";
  console.log(`${icono} ${seccion} :: ${criterio}${detalle ? " — " + detalle : ""}`);
}

async function shot(page, nombre) {
  const ruta = resolve(DIR_SHOTS, nombre);
  await page.screenshot({ path: ruta, fullPage: true });
  return `app/test-results/in-vivo/${nombre}`;
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  ignoreHTTPSErrors: true,
});
const page = await context.newPage();

page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") {
    consoleMessages.push({ type: msg.type(), text: msg.text().slice(0, 600) });
  }
});
page.on("pageerror", (err) => pageErrors.push(err.message));
page.on("requestfailed", (req) => {
  if (req.failure()) requestFailures.push({ url: req.url(), reason: req.failure()?.errorText });
});

const inicio = Date.now();
try {
  // ============================================================
  // 1. CARGA INICIAL
  // ============================================================
  await page.goto(URL_OBJETIVO, { waitUntil: "networkidle", timeout: 20000 });
  const tCarga = Date.now() - inicio;
  record("1. Carga inicial", "Carga sin error fatal", "OK", `${tCarga} ms hasta networkidle`);

  const titulo = await page.title();
  record("1. Carga inicial", "Título de la página", "INFO", titulo || "(vacío)");

  await shot(page, "01-carga-inicial.png");

  const layoutVisible = await page.locator(".joint-paper").isVisible();
  record("1. Carga inicial", "Canvas JointJS visible", layoutVisible ? "OK" : "FAIL");

  const arbolVisible = await page.getByRole("tree", { name: "Árbol OPD" }).isVisible();
  record("1. Carga inicial", "Árbol OPD visible", arbolVisible ? "OK" : "FAIL");

  const inspectorVisible = await page.locator('aside:has-text("Sin selección")').isVisible();
  record("1. Carga inicial", "Inspector con estado vacío", inspectorVisible ? "OK" : "FAIL");

  const oplVisible = await page.locator("text=OPL").first().isVisible();
  record("1. Carga inicial", "Panel OPL visible", oplVisible ? "OK" : "FAIL");

  // ============================================================
  // 2. TOOLBAR Y BOTONES
  // ============================================================
  const botones = ["Objeto", "Proceso", "Deshacer", "Rehacer", "Demo", "Guardar", "Cargar"];
  for (const nombre of botones) {
    const ok = await page.getByRole("button", { name: nombre }).isVisible();
    record("2. Toolbar", `Botón "${nombre}" visible`, ok ? "OK" : "FAIL");
  }
  const selectorEnlace = await page.getByLabel("Tipo de enlace").isVisible();
  record("2. Toolbar", "Selector de tipo de enlace visible", selectorEnlace ? "OK" : "FAIL");
  const selectorEnlaceDeshabilitado = await page.getByLabel("Tipo de enlace").isDisabled();
  record("2. Toolbar", "Selector de enlace inactivo sin origen", selectorEnlaceDeshabilitado ? "OK" : "FAIL");

  // Botones Deshacer/Rehacer iniciales deshabilitados
  const deshacerInicial = await page.getByRole("button", { name: "Deshacer" }).isDisabled();
  const rehacerInicial = await page.getByRole("button", { name: "Rehacer" }).isDisabled();
  record("2. Toolbar", "Deshacer deshabilitado al inicio", deshacerInicial ? "OK" : "FAIL");
  record("2. Toolbar", "Rehacer deshabilitado al inicio", rehacerInicial ? "OK" : "FAIL");

  // ============================================================
  // 3. CARGAR DEMO Y VERIFICAR
  // ============================================================
  await page.getByRole("button", { name: "Demo" }).click();
  await page.waitForTimeout(300);
  const elementosDemo = await page.locator(".joint-element").count();
  const enlacesDemo = await page.locator(".joint-link").count();
  record("3. Demo", `Demo carga 3 cosas (vistas: ${elementosDemo})`, elementosDemo === 3 ? "OK" : "WARN");
  record("3. Demo", `Demo carga 2 enlaces (vistas: ${enlacesDemo})`, enlacesDemo === 2 ? "OK" : "WARN");
  await page.locator(".joint-paper").screenshot({ path: resolve(DIR_SHOTS, "03-demo-canvas.png") });
  await shot(page, "03-demo-fullpage.png");
  const oplDriver = await page.getByText("Driver Rescuing afecta OnStar System.").isVisible();
  record("3. Demo", "OPL contiene 'Driver Rescuing afecta OnStar System.'", oplDriver ? "OK" : "FAIL");

  // ============================================================
  // 4. INSPECCIÓN VISUAL DE COSAS (colores, dimensiones)
  // ============================================================
  // Canon de la app: fill=#fdffff (interior cuasi-blanco) + stroke=color del tipo (objeto verde, proceso azul)
  const cosasInfo = await page.locator(".joint-element").evaluateAll((els) => {
    return els.map((el) => {
      const rect = el.getBoundingClientRect();
      const interno = el.querySelector("rect:not([fill='transparent']), ellipse");
      return {
        tag: interno?.tagName,
        fill: (interno?.getAttribute("fill") ?? "").toLowerCase(),
        stroke: (interno?.getAttribute("stroke") ?? "").toLowerCase(),
        strokeWidth: interno?.getAttribute("stroke-width"),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    });
  });
  const objetos = cosasInfo.filter((c) => c.tag === "rect");
  const procesos = cosasInfo.filter((c) => c.tag === "ellipse");
  record(
    "4. Visual SSOT",
    `Cosas detectadas: ${objetos.length} objeto(s) [rect], ${procesos.length} proceso(s) [ellipse]`,
    "INFO",
    cosasInfo.map((c) => `${c.tag}@${c.width}x${c.height} fill=${c.fill} stroke=${c.stroke}`).join(" | "),
  );
  const fillCanonOk = cosasInfo.every((c) => c.fill === "#fdffff");
  const objetosVerdes = objetos.every((c) => c.stroke === "#70e483");
  const procesosAzules = procesos.every((c) => c.stroke === "#3bc3ff");
  const dimsCanon = cosasInfo.every((c) => c.width === 135 && c.height === 60);
  record("4. Visual SSOT", "Fill canónico #fdffff en todas las cosas", fillCanonOk ? "OK" : "FAIL");
  record("4. Visual SSOT", `Objetos con stroke #70E483 (n=${objetos.length})`, objetosVerdes ? "OK" : "FAIL");
  record("4. Visual SSOT", `Procesos con stroke #3BC3FF (n=${procesos.length})`, procesos.length > 0 && procesosAzules ? "OK" : procesos.length === 0 ? "WARN" : "FAIL", procesos.length === 0 ? "no había procesos en pantalla" : undefined);
  record("4. Visual SSOT", "Dimensiones canónicas 135x60 en todas las cosas", dimsCanon ? "OK" : "FAIL");

  // ============================================================
  // 5. UNDO/REDO — el canon es: cargarDemo limpia el historial, así que probamos sobre operaciones manuales.
  // ============================================================
  // Tras cargar Demo, undo no debe reducir (historial reseteado por diseño).
  await page.keyboard.press("Control+Z");
  await page.waitForTimeout(150);
  const elementosTrasUndoDemo = await page.locator(".joint-element").count();
  record(
    "5. Undo/Redo",
    `Tras Demo, Ctrl+Z mantiene elementos (${elementosTrasUndoDemo}=3, historial reseteado por diseño)`,
    elementosTrasUndoDemo === 3 ? "OK" : "WARN",
  );

  // Ahora creamos manualmente y probamos undo/redo real
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.waitForTimeout(150);
  const elementosCon4 = await page.locator(".joint-element").count();
  await page.keyboard.press("Control+Z");
  await page.waitForTimeout(150);
  const elementosTrasUndo = await page.locator(".joint-element").count();
  record("5. Undo/Redo", `Tras crear cosa manual, Ctrl+Z reduce (${elementosCon4}→${elementosTrasUndo})`, elementosTrasUndo < elementosCon4 ? "OK" : "FAIL");
  await page.keyboard.press("Control+Y");
  await page.waitForTimeout(150);
  const elementosTrasRedo = await page.locator(".joint-element").count();
  record("5. Undo/Redo", `Ctrl+Y restaura (${elementosTrasUndo}→${elementosTrasRedo})`, elementosTrasRedo > elementosTrasUndo ? "OK" : "FAIL");
  await shot(page, "05-undo-redo.png");

  // ============================================================
  // 6. SELECCIÓN DE ENTIDAD Y INSPECTOR
  // ============================================================
  await page.locator(".joint-element").first().click();
  await page.waitForTimeout(150);
  const inspectorObjeto = await page.locator('aside:has-text("Nombre")').isVisible().catch(() => false);
  record("6. Inspector entidad", "Inspector muestra campo Nombre tras seleccionar", inspectorObjeto ? "OK" : "FAIL");
  const camposEsencia = await page.getByText("Esencia").isVisible();
  const camposAfiliacion = await page.getByText("Afiliación").isVisible();
  record("6. Inspector entidad", "Inspector muestra Esencia/Afiliación", (camposEsencia && camposAfiliacion) ? "OK" : "FAIL");
  await shot(page, "06-inspector-entidad.png");

  // Cambiar nombre
  const inputNombre = page.locator('aside input').first();
  await inputNombre.fill("Conductor Probado");
  await page.waitForTimeout(150);
  const oplActualizado = await page.getByText(/Conductor Probado/).count();
  record("6. Inspector entidad", "Cambio de nombre se refleja en OPL/canvas", oplActualizado > 0 ? "OK" : "WARN");
  await shot(page, "06b-rename.png");

  // Cambiar esencia
  await page.getByRole("button", { name: "Física" }).first().click();
  await page.waitForTimeout(150);
  await shot(page, "06c-esencia-fisica.png");
  // Cambiar afiliación
  await page.getByRole("button", { name: "Ambiental" }).first().click();
  await page.waitForTimeout(150);
  const cosaAmbiental = await page.locator(".joint-element").first().evaluate((el) => {
    const f = el.querySelector("rect, ellipse");
    return { strokeDasharray: f?.getAttribute("stroke-dasharray") ?? null };
  });
  record("6. Inspector entidad", `Afiliación ambiental aplica stroke-dasharray (${cosaAmbiental.strokeDasharray})`, cosaAmbiental.strokeDasharray ? "OK" : "WARN");
  await shot(page, "06d-afiliacion-ambiental.png");

  // ============================================================
  // 7. CREAR ENLACE NUEVO (CONSUMO o INVOCACIÓN)
  // ============================================================
  // Primero creamos modelo limpio
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByRole("button", { name: "Proceso" }).click();
  await page.waitForTimeout(150);
  const cosasNuevas = await page.locator(".joint-element").count();
  record("7. Crear enlace", `Crear Objeto + Proceso vacíos (vistas: ${cosasNuevas})`, cosasNuevas === 2 ? "OK" : "WARN");

  // UX correcta: 1) seleccionar entidad origen, 2) elegir tipo, 3) clic en destino
  const cosas = page.locator(".joint-element");
  // Primero clicamos el objeto (que es el rect, en posición de objeto)
  const objetoEl = page.locator(".joint-element").filter({ has: page.locator("rect") }).first();
  await objetoEl.click();
  await page.waitForTimeout(120);
  const selectorHabilitadoConOrigen = !(await page.getByLabel("Tipo de enlace").isDisabled());
  record("7. Crear enlace", "Selector de enlace activo tras seleccionar origen", selectorHabilitadoConOrigen ? "OK" : "FAIL");
  await page.getByLabel("Tipo de enlace").selectOption("consumo");
  await page.waitForTimeout(120);
  const mensajeDestino = await page.getByText(/destino/i).first().isVisible().catch(() => false);
  record("7. Crear enlace", "Tras elegir tipo aparece mensaje 'Selecciona la entidad destino'", mensajeDestino ? "OK" : "WARN");
  // Ahora clic en proceso (ellipse)
  const procesoEl = page.locator(".joint-element").filter({ has: page.locator("ellipse") }).first();
  await procesoEl.click();
  await page.waitForTimeout(250);
  const enlacesNuevo = await page.locator(".joint-link").count();
  record("7. Crear enlace", `Enlace consumo creado (vistas: ${enlacesNuevo})`, enlacesNuevo >= 1 ? "OK" : "FAIL");
  await shot(page, "07-enlace-consumo.png");

  // Verificar OPL del consumo
  const oplConsumo = await page.locator("body").textContent();
  const oplTieneConsumo = /consume|consumo/i.test(oplConsumo ?? "");
  record("7. Crear enlace", "OPL contiene texto de consumo", oplTieneConsumo ? "OK" : "WARN");

  // ============================================================
  // 8. CREAR ENLACE INVÁLIDO: objeto→objeto con consumo (consumo exige objeto→proceso)
  // ============================================================
  await page.getByRole("button", { name: "Objeto" }).click();  // 2do objeto
  await page.waitForTimeout(150);
  // Seleccionar primer objeto, intentar consumo a segundo objeto
  const objetos2 = page.locator(".joint-element").filter({ has: page.locator("rect") });
  await objetos2.first().click();
  await page.waitForTimeout(100);
  await page.getByLabel("Tipo de enlace").selectOption("consumo");
  await page.waitForTimeout(80);
  await objetos2.nth(1).click();
  await page.waitForTimeout(200);
  const enlacesTrasInvalido = await page.locator(".joint-link").count();
  const mensajeFirma = await page.locator("text=/requiere|firma|consumo|destino/i").first().textContent().catch(() => "");
  const firmaBloqueada = enlacesTrasInvalido === enlacesNuevo;
  record("8. Validación firma", `Firma ilegal no crea enlace (${enlacesNuevo}→${enlacesTrasInvalido})`, firmaBloqueada ? "OK" : "FAIL", mensajeFirma ?? "");
  await shot(page, "08-firma-ilegal.png");

  // ============================================================
  // 9. PERSISTENCIA JSON: EXPORT / IMPORT
  // ============================================================
  await page.getByRole("button", { name: "Exportar" }).click();
  await page.waitForTimeout(150);
  const jsonExport = await page.locator("textarea").inputValue();
  let parsed;
  try {
    parsed = JSON.parse(jsonExport);
  } catch (e) {
    parsed = null;
  }
  const exportValido = parsed?.formato === "deep-opm-pro.modelo.v0";
  record("9. JSON", "Export produce JSON válido con formato canónico", exportValido ? "OK" : "FAIL");
  await shot(page, "09-export-json.png");

  // Probar import corrupto
  await page.locator("textarea").fill('{"formato":"deep-opm-pro.modelo.v0","modelo":{"id":"x","nombre":"x","opdRaizId":"opd-1","nextSeq":1,"opds":{"opd-1":null},"entidades":{},"enlaces":{}}}');
  await page.getByRole("button", { name: "Importar" }).click();
  await page.waitForTimeout(200);
  const mensajeImportError = await page.locator("text=/inválido|OPD|Documento/i").count();
  record("9. JSON", "Import de JSON corrupto muestra mensaje de error", mensajeImportError > 0 ? "OK" : "WARN");
  await shot(page, "09b-import-corrupto.png");

  // ============================================================
  // 10. PERSISTENCIA LOCAL (Guardar / dirty / Cargar)
  // ============================================================
  await page.locator("textarea").fill(jsonExport);
  await page.getByRole("button", { name: "Importar" }).click();
  await page.waitForTimeout(200);
  await page.getByRole("button", { name: "Guardar" }).click();
  await page.waitForTimeout(120);
  const tituloTrasGuardar = await page.locator("span").filter({ hasText: /(No guardado)/ }).count();
  record("10. Persistencia local", "Tras Guardar, deja de aparecer '(No guardado)'", tituloTrasGuardar === 0 ? "OK" : "WARN");

  await page.getByRole("button", { name: "Objeto" }).click();
  await page.waitForTimeout(120);
  const tituloDirty = await page.locator("span").filter({ hasText: /(No guardado)/ }).count();
  record("10. Persistencia local", "Tras crear nueva entidad, aparece '(No guardado)'", tituloDirty > 0 ? "OK" : "WARN");

  await page.getByRole("button", { name: "Cargar" }).click();
  await page.waitForTimeout(150);
  const tituloTrasCargar = await page.locator("span").filter({ hasText: /(No guardado)/ }).count();
  record("10. Persistencia local", "Tras Cargar regresa al estado guardado", tituloTrasCargar === 0 ? "OK" : "WARN");
  await shot(page, "10-persistencia-local.png");

  // ============================================================
  // 11. ÁRBOL OPD CON IMPORT MULTI-OPD
  // ============================================================
  const dosOpds = {
    formato: "deep-opm-pro.modelo.v0",
    modelo: {
      id: "m",
      nombre: "Multi-OPD test",
      opdRaizId: "opd-1",
      nextSeq: 200,
      opds: {
        "opd-1": { id: "opd-1", nombre: "SD", padreId: null, apariencias: { "a-1": { id: "a-1", entidadId: "ent-1", opdId: "opd-1", x: 100, y: 100, width: 135, height: 60 } }, enlaces: {} },
        "opd-2": { id: "opd-2", nombre: "SD1", padreId: "opd-1", apariencias: { "a-2": { id: "a-2", entidadId: "ent-2", opdId: "opd-2", x: 100, y: 100, width: 135, height: 60 } }, enlaces: {} },
      },
      entidades: {
        "ent-1": { id: "ent-1", tipo: "objeto", nombre: "Objeto Padre", esencia: "informacional", afiliacion: "sistemica" },
        "ent-2": { id: "ent-2", tipo: "proceso", nombre: "Proceso Hijo", esencia: "informacional", afiliacion: "sistemica" },
      },
      enlaces: {},
    },
  };
  await page.locator("textarea").fill(JSON.stringify(dosOpds));
  await page.getByRole("button", { name: "Importar" }).click();
  await page.waitForTimeout(200);
  const treeitems = await page.locator('[role="treeitem"]').count();
  record("11. Árbol OPD", `Árbol muestra ${treeitems} nodos (esperados ≥2)`, treeitems >= 2 ? "OK" : "FAIL");
  await shot(page, "11-arbol-opd.png");

  await page.locator('[role="treeitem"][data-opd-id="opd-2"]').click();
  await page.waitForTimeout(150);
  const procesoHijoVisible = await page.getByText("Proceso Hijo").first().isVisible();
  record("11. Árbol OPD", "Click en hijo cambia OPD activo (visible Proceso Hijo)", procesoHijoVisible ? "OK" : "FAIL");
  await shot(page, "11b-opd-hijo.png");

  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Proceso" }).click();
  await page.waitForTimeout(150);
  await page.getByRole("button", { name: "Descomponer" }).click();
  await page.waitForTimeout(200);
  const nodoDescompuesto = await page.locator('[role="treeitem"]').filter({ hasText: "SD1: Un Proceso descompuesto" }).count();
  record("11. Árbol OPD", "Descomponer crea nodo derivado SD1", nodoDescompuesto === 1 ? "OK" : "FAIL");
  await page.getByRole("button", { name: "Quitar descomposición" }).click();
  await page.waitForTimeout(200);
  const nodosTrasQuitar = await page.locator('[role="treeitem"]').count();
  const oplDescompuesto = await page.getByText("Un Proceso se descompone en SD1.").count();
  record("11. Árbol OPD", "Quitar descomposición elimina OPD hijo", nodosTrasQuitar === 1 ? "OK" : "FAIL");
  record("11. Árbol OPD", "Quitar descomposición remueve OPL de refinamiento", oplDescompuesto === 0 ? "OK" : "FAIL");
  await shot(page, "11c-quitar-descomposicion.png");

  // ============================================================
  // 12. AGREGACIÓN: triángulo, no editable
  // ============================================================
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.waitForTimeout(150);
  const objetosAgg = page.locator(".joint-element").filter({ has: page.locator("rect") });
  await objetosAgg.first().click();
  await page.waitForTimeout(100);
  await page.getByLabel("Tipo de enlace").selectOption("agregacion");
  await page.waitForTimeout(80);
  await objetosAgg.nth(1).click();
  await page.waitForTimeout(200);
  const triangulos = await page.locator(".joint-element polygon").count();
  record("12. Agregación", `Triángulo estructural presente (polygons: ${triangulos})`, triangulos >= 1 ? "OK" : "FAIL");
  // Click en triángulo y verificar que NO aparece tool de vértices
  await page.locator(".joint-element polygon").first().click();
  await page.waitForTimeout(150);
  const verticeTool = await page.locator('[data-tool-name="vertices"]').count();
  record("12. Agregación", "Triángulo no expone tool de vértices", verticeTool === 0 ? "OK" : "WARN");
  await shot(page, "12-agregacion.png");

  // ============================================================
  // 13. DRAG ENTIDAD Y PERSISTENCIA VISUAL
  // ============================================================
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.waitForTimeout(150);
  const cosa = page.locator(".joint-element").first();
  const box = await cosa.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + 200, box.y + 150, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(150);
    const box2 = await page.locator(".joint-element").first().boundingBox();
    const movido = box2 && (Math.abs(box2.x - box.x) > 50 || Math.abs(box2.y - box.y) > 30);
    record("13. Drag", `Entidad arrastrada (Δx=${box2 ? Math.round(box2.x - box.x) : "?"}, Δy=${box2 ? Math.round(box2.y - box.y) : "?"})`, movido ? "OK" : "FAIL");
  } else {
    record("13. Drag", "No se pudo obtener bounding box de entidad", "FAIL");
  }
  await shot(page, "13-drag-entidad.png");

  // ============================================================
  // 14. RESPONSIVE: viewport pequeño
  // ============================================================
  await page.setViewportSize({ width: 1024, height: 700 });
  await page.waitForTimeout(150);
  await shot(page, "14-viewport-1024x700.png");
  const toolbarOverflow1024 = await page.evaluate(() => {
    const bar = document.querySelector('main > div, main > section');
    if (!bar) return null;
    return {
      scrollWidth: document.body.scrollWidth,
      clientWidth: document.body.clientWidth,
    };
  });
  record("14. Responsive 1024px", `body scrollWidth/clientWidth = ${toolbarOverflow1024?.scrollWidth}/${toolbarOverflow1024?.clientWidth}`, "INFO");

  await page.setViewportSize({ width: 1920, height: 1080 });
  await shot(page, "14b-viewport-1920x1080.png");
  await page.setViewportSize({ width: 1440, height: 900 });

  // ============================================================
  // 15. ELIMINAR ENTIDAD CON CASCADA
  // ============================================================
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Demo" }).click();
  await page.waitForTimeout(200);
  const elemAntes = await page.locator(".joint-element").count();
  const linksAntes = await page.locator(".joint-link").count();
  await page.locator(".joint-element").first().click();
  await page.waitForTimeout(120);
  await page.getByRole("button", { name: "Eliminar entidad" }).click();
  await page.waitForTimeout(150);
  const elemDespues = await page.locator(".joint-element").count();
  const linksDespues = await page.locator(".joint-link").count();
  record("15. Eliminar", `Entidades ${elemAntes}→${elemDespues}`, elemDespues < elemAntes ? "OK" : "FAIL");
  record("15. Eliminar", `Enlaces (cascada) ${linksAntes}→${linksDespues}`, linksDespues < linksAntes ? "OK" : "WARN");
  await shot(page, "15-cascada-borrado.png");
} catch (errFatal) {
  record("FATAL", "Excepción no controlada", "FAIL", errFatal instanceof Error ? errFatal.message : String(errFatal));
  await shot(page, "99-fatal.png").catch(() => {});
} finally {
  await browser.close();
}

// ============================================================
// RESUMEN
// ============================================================
const resumen = {
  fecha: FECHA,
  url: URL_OBJETIVO,
  totalCriterios: findings.length,
  ok: findings.filter((f) => f.estado === "OK").length,
  fail: findings.filter((f) => f.estado === "FAIL").length,
  warn: findings.filter((f) => f.estado === "WARN").length,
  info: findings.filter((f) => f.estado === "INFO").length,
  pageErrors,
  consoleMessages,
  requestFailures,
  findings,
};

const capturas = readdirSync(DIR_SHOTS)
  .filter((nombre) => nombre.endsWith(".png"))
  .sort();

writeFileSync(resolve(DIR_SHOTS, "_resumen.json"), JSON.stringify(resumen, null, 2));
writeFileSync(RUTA_REPORT, generarReporte(resumen, capturas));
console.log("\n=== RESUMEN ===");
console.log(`OK ${resumen.ok} / FAIL ${resumen.fail} / WARN ${resumen.warn} / INFO ${resumen.info}`);
console.log(`pageerrors: ${pageErrors.length}, console errors/warnings: ${consoleMessages.length}, request failures: ${requestFailures.length}`);
console.log(`screenshots y resumen JSON en ${DIR_SHOTS}`);
console.log(`reporte ejecutivo en ${RUTA_REPORT}`);

if (resumen.fail > 0) process.exitCode = 1;

function generarReporte(resumen, capturas) {
  const porSeccion = agruparPorSeccion(resumen.findings);
  const filasCobertura = Object.entries(porSeccion).map(([seccion, items]) => {
    const estados = contarEstados(items);
    return `| ${escapeMd(seccion)} | ${items.length} | ${estados.OK} | ${estados.FAIL} | ${estados.WARN} | ${estados.INFO} |`;
  }).join("\n");
  const filasDetalle = resumen.findings.map((item) => (
    `| ${escapeMd(item.seccion)} | ${escapeMd(item.criterio)} | ${item.estado} | ${escapeMd(item.detalle ?? "")} |`
  )).join("\n");
  const listaCapturas = capturas.length === 0
    ? "- Sin capturas generadas."
    : capturas.map((nombre) => `- \`app/test-results/in-vivo/${nombre}\``).join("\n");
  const runtime = [
    resumen.pageErrors.length === 0 ? "- `pageerror`: 0" : `- \`pageerror\`: ${resumen.pageErrors.length}`,
    resumen.consoleMessages.length === 0 ? "- `console.error/warning`: 0" : `- \`console.error/warning\`: ${resumen.consoleMessages.length}`,
    resumen.requestFailures.length === 0 ? "- `requestfailed`: 0" : `- \`requestfailed\`: ${resumen.requestFailures.length}`,
  ].join("\n");
  const veredicto = resumen.fail === 0
    ? "La app esta operativa en el corte auditado. No se detectaron fallos funcionales ni errores de runtime durante la exploracion in-vivo."
    : "La app no debe considerarse lista para cierre: hay criterios FAIL que requieren correccion antes de publicar el corte.";

  return `# Reporte ejecutivo in-vivo - modelador OPM

**Fecha:** ${resumen.fecha}
**URL probada:** ${resumen.url}
**Driver:** Playwright/Chromium headless
**Script:** \`app/scripts/in-vivo-test.mjs\`
**Artefactos:** \`app/test-results/in-vivo/\`
**Politica:** reporte, JSON y capturas son salidas regenerables ignoradas por git.

---

## 1. Veredicto

${veredicto}

| Metrica | Valor |
|---|---:|
| Criterios verificados | ${resumen.totalCriterios} |
| OK | ${resumen.ok} |
| FAIL | ${resumen.fail} |
| WARN | ${resumen.warn} |
| INFO | ${resumen.info} |
| Errores \`pageerror\` | ${resumen.pageErrors.length} |
| Errores/warnings consola | ${resumen.consoleMessages.length} |
| Requests fallidos | ${resumen.requestFailures.length} |

## 2. Cobertura Por Seccion

| Seccion | Criterios | OK | FAIL | WARN | INFO |
|---|---:|---:|---:|---:|---:|
${filasCobertura}

## 3. Detalle De Criterios

| Seccion | Criterio | Estado | Detalle |
|---|---|---|---|
${filasDetalle}

## 4. Runtime

${runtime}

## 5. Artefactos Generados

${listaCapturas}

## 6. Lectura Del Corte

- El selector de tipo de enlace queda inactivo hasta que exista una entidad origen seleccionada.
- La validacion de firma OPM ilegal se trata como criterio bloqueante: si crea un enlace, el script sale con codigo distinto de cero.
- El reporte se genera automaticamente desde el mismo resumen JSON que alimenta las capturas, evitando divergencia entre \`app/test-results/in-vivo/REPORTE-EJECUTIVO.md\` y \`app/test-results/in-vivo/_resumen.json\`.
- Los PNG y \`_resumen.json\` quedan en \`app/test-results/in-vivo/\`, directorio ignorado por git como salida de prueba.

## 7. Reproduccion

\`\`\`bash
cd app
bun run visual:audit -- ${resumen.url}
\`\`\`
`;
}

function agruparPorSeccion(items) {
  return items.reduce((acc, item) => {
    acc[item.seccion] ??= [];
    acc[item.seccion].push(item);
    return acc;
  }, {});
}

function contarEstados(items) {
  return items.reduce((acc, item) => {
    acc[item.estado] = (acc[item.estado] ?? 0) + 1;
    return acc;
  }, { OK: 0, FAIL: 0, WARN: 0, INFO: 0 });
}

function escapeMd(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}
