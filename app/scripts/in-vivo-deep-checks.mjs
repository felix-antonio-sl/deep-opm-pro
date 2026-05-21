// Validación in-vivo profunda — criterios avanzados (in-zooming, redistribución, marcadores, etc.)
// Complementa scripts/in-vivo-test.mjs.
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const URL_OBJETIVO = process.argv[2] ?? "http://138.201.53.205:5173/";
const RAIZ_REPO = resolve(import.meta.dirname, "..", "..");
const DIR_SHOTS = resolve(RAIZ_REPO, "app/test-results/in-vivo");
mkdirSync(DIR_SHOTS, { recursive: true });

const findings = [];
function record(seccion, criterio, estado, detalle) {
  findings.push({ seccion, criterio, estado, detalle });
  const icono = estado === "OK" ? "[OK]" : estado === "FAIL" ? "[X]" : estado === "WARN" ? "[!]" : "[i]";
  console.log(`${icono} ${seccion} :: ${criterio}${detalle ? " — " + detalle : ""}`);
}
async function shot(page, nombre) {
  await page.screenshot({ path: resolve(DIR_SHOTS, nombre), fullPage: true });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(e.message));

try {
  await page.goto(URL_OBJETIVO, { waitUntil: "networkidle", timeout: 20000 });

  // ============================================================
  // A. DESCOMPOSICIÓN: subprocesos automáticos, posiciones, OPL
  // ============================================================
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Proceso" }).click();
  await page.waitForTimeout(150);
  // Renombrar para asertos OPL más limpios
  const inputNombre = page.locator('aside input').first();
  await inputNombre.fill("Atender");
  await page.waitForTimeout(120);
  await page.getByRole("button", { name: "Descomponer" }).click();
  await page.waitForTimeout(300);

  // Tras descomponer debe haberse navegado al OPD hijo
  const opdHijoActivo = await page.locator('[role="treeitem"][aria-current="page"]').textContent();
  record("A. Descomposición", `Auto-navegación al OPD hijo (activo: ${opdHijoActivo?.trim()})`, /SD\d/.test(opdHijoActivo ?? "") ? "OK" : "FAIL");

  // Conteo de elementos en hijo: 1 contorno (proceso refinado) + 3 subprocesos = 4 ellipses
  const ellipseCount = await page.locator(".joint-element ellipse").count();
  record("A. Descomposición", `Hijo tiene 4 ellipses (1 contorno + 3 subprocesos): vistas ${ellipseCount}`, ellipseCount === 4 ? "OK" : "FAIL");

  // Verificar que hay 3 subprocesos NOMBRADOS (no contar el contorno)
  const procesosInternos = await page.locator(".joint-element").evaluateAll((els) => {
    return els.map((el) => {
      const ellipse = el.querySelector("ellipse");
      const text = el.textContent ?? "";
      const rect = el.getBoundingClientRect();
      return {
        tieneEllipse: !!ellipse,
        text: text.trim(),
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
    });
  });
  console.log("Procesos internos:", JSON.stringify(procesosInternos, null, 2));

  const subprocesosOrdenadosY = procesosInternos
    .filter((p) => p.tieneEllipse && p.width === 135) // subprocesos canónicos, no contorno
    .sort((a, b) => a.y - b.y);
  record("A. Descomposición", `Subprocesos canónicos detectados: ${subprocesosOrdenadosY.length}`, subprocesosOrdenadosY.length === 3 ? "OK" : "FAIL");

  // Centrados por x (todos comparten misma x con tolerancia ±5)
  if (subprocesosOrdenadosY.length === 3) {
    const xs = subprocesosOrdenadosY.map((p) => p.x);
    const xMax = Math.max(...xs);
    const xMin = Math.min(...xs);
    record("A. Descomposición", `Subprocesos centrados (Δx max = ${xMax - xMin})`, xMax - xMin <= 5 ? "OK" : "FAIL");

    // Apilados por y monotónico creciente
    const ysOrdenados = subprocesosOrdenadosY.every((p, i, arr) => i === 0 || p.y >= arr[i - 1].y);
    record("A. Descomposición", `Subprocesos apilados (orden y monotónico)`, ysOrdenados ? "OK" : "FAIL");

    // No se solapan: Δy entre consecutivos > altura
    const separados = subprocesosOrdenadosY.every((p, i, arr) => i === 0 || p.y - arr[i - 1].y >= p.height - 5);
    record("A. Descomposición", `Subprocesos sin solape vertical (Δy ≥ alto)`, separados ? "OK" : "FAIL");
  }

  // Contorno: ellipse más grande que un subproceso canónico
  const contornoStats = await page.locator(".joint-element").evaluateAll((els) => {
    const cosas = els.map((el) => {
      const r = el.getBoundingClientRect();
      const ellipse = el.querySelector("ellipse");
      return {
        tieneEllipse: !!ellipse,
        width: Math.round(r.width),
        height: Math.round(r.height),
      };
    });
    return cosas.filter((c) => c.tieneEllipse).sort((a, b) => b.width - a.width);
  });
  const contorno = contornoStats[0];
  record("A. Descomposición", `Contorno (mayor ellipse): ${contorno?.width}x${contorno?.height}`, contorno && contorno.width > 135 + 50 && contorno.height > 60 + 50 ? "OK" : "FAIL");

  // Z-order: el contorno debe ir DETRÁS de los subprocesos (i.e., menor índice DOM)
  const zOrder = await page.locator(".joint-element").evaluateAll((els) => {
    return els.map((el, i) => {
      const r = el.getBoundingClientRect();
      const ellipse = el.querySelector("ellipse");
      return {
        index: i,
        tieneEllipse: !!ellipse,
        width: Math.round(r.width),
      };
    });
  });
  const indiceContorno = zOrder.find((z) => z.tieneEllipse && z.width > 200)?.index;
  const indicesSubprocesos = zOrder.filter((z) => z.tieneEllipse && z.width === 135).map((z) => z.index);
  const contornoDetras = indiceContorno !== undefined && indicesSubprocesos.every((i) => i > indiceContorno);
  record("A. Descomposición", `Contorno detrás de subprocesos (idx contorno=${indiceContorno}, subs=${indicesSubprocesos.join(",")})`, contornoDetras ? "OK" : "FAIL");

  await shot(page, "deep-A-descomposicion.png");

  // OPL "se descompone en"
  const oplBody = (await page.locator("body").textContent()) ?? "";
  const oplDescomp = /Atender se descompone en/.test(oplBody);
  record("A. Descomposición", "OPL contiene 'Atender se descompone en'", oplDescomp ? "OK" : "FAIL");

  // ============================================================
  // B. NUEVA COSA EN HIJO SE UBICA DENTRO DEL CONTORNO
  // ============================================================
  const contornoBox = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll(".joint-element"));
    const conEllipse = all.map((el) => ({ el, r: el.getBoundingClientRect(), e: el.querySelector("ellipse") }))
      .filter((it) => it.e)
      .sort((a, b) => b.r.width - a.r.width);
    const c = conEllipse[0];
    return c ? { x: c.r.x, y: c.r.y, w: c.r.width, h: c.r.height } : null;
  });
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.waitForTimeout(200);
  const nuevoObjBox = await page.locator(".joint-element").filter({ has: page.locator("rect") }).last().boundingBox();
  if (contornoBox && nuevoObjBox) {
    const dentro = nuevoObjBox.x >= contornoBox.x && nuevoObjBox.y >= contornoBox.y &&
                   nuevoObjBox.x + nuevoObjBox.width <= contornoBox.x + contornoBox.w &&
                   nuevoObjBox.y + nuevoObjBox.height <= contornoBox.y + contornoBox.h;
    record("B. Posicionamiento", `Nueva cosa colocada dentro del contorno (objeto en ${Math.round(nuevoObjBox.x)},${Math.round(nuevoObjBox.y)}; contorno ${Math.round(contornoBox.x)},${Math.round(contornoBox.y)} ${Math.round(contornoBox.w)}x${Math.round(contornoBox.h)})`, dentro ? "OK" : "FAIL");
  } else {
    record("B. Posicionamiento", "No se pudo medir contorno + nuevo objeto", "FAIL");
  }
  await shot(page, "deep-B-objeto-en-hijo.png");

  // ============================================================
  // C. REDISTRIBUCIÓN DE ENLACES EXTERNOS
  // ============================================================
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  // Crear: Objeto -> Atender (consumo), Atender -> Objeto2 (resultado)
  await page.getByRole("button", { name: "Proceso" }).click();
  await page.waitForTimeout(120);
  // Renombrar proceso a Atender
  await page.locator('aside input').first().fill("Atender");
  await page.waitForTimeout(120);
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.waitForTimeout(120);
  await page.locator('aside input').first().fill("Demanda");
  await page.waitForTimeout(120);
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.waitForTimeout(120);
  await page.locator('aside input').first().fill("Resultado");
  await page.waitForTimeout(120);

  const procesoEl = page.locator(".joint-element").filter({ has: page.locator("ellipse") }).first();
  const objetos = page.locator(".joint-element").filter({ has: page.locator("rect") });
  // Demanda -> Atender (consumo)
  await objetos.first().click();
  await page.waitForTimeout(80);
  await page.getByLabel("Tipo de enlace").selectOption("consumo");
  await page.waitForTimeout(80);
  await procesoEl.click();
  await page.waitForTimeout(150);
  // Atender -> Resultado (resultado)
  await procesoEl.click();
  await page.waitForTimeout(80);
  await page.getByLabel("Tipo de enlace").selectOption("resultado");
  await page.waitForTimeout(80);
  await objetos.nth(1).click();
  await page.waitForTimeout(150);
  const enlacesPadre = await page.locator(".joint-link").count();
  record("C. Redistribución", `Modelo padre tiene 2 enlaces (${enlacesPadre})`, enlacesPadre === 2 ? "OK" : "FAIL");
  await shot(page, "deep-C1-padre-con-enlaces.png");

  // Descomponer Atender
  await procesoEl.click();
  await page.waitForTimeout(120);
  await page.getByRole("button", { name: "Descomponer" }).click();
  await page.waitForTimeout(300);
  const enlacesHijo = await page.locator(".joint-link").count();
  record("C. Redistribución", `OPD hijo tiene enlaces locales (${enlacesHijo}, esperados ≥2)`, enlacesHijo >= 2 ? "OK" : "FAIL");
  await shot(page, "deep-C2-hijo-con-redistribucion.png");

  // Verificar que Demanda y Resultado están en el hijo (apariencias copiadas)
  const cosasHijo = await page.locator(".joint-element").evaluateAll((els) => {
    return els.map((el) => (el.textContent ?? "").trim());
  });
  const tieneDemanda = cosasHijo.some((t) => t.includes("Demanda"));
  const tieneResultado = cosasHijo.some((t) => t.includes("Resultado"));
  record("C. Redistribución", "Apariencia 'Demanda' copiada al hijo", tieneDemanda ? "OK" : "FAIL");
  record("C. Redistribución", "Apariencia 'Resultado' copiada al hijo", tieneResultado ? "OK" : "FAIL");

  // Volver al padre y verificar enlaces conservados
  await page.locator('[role="treeitem"]').first().click();
  await page.waitForTimeout(150);
  const enlacesPadreTras = await page.locator(".joint-link").count();
  record("C. Redistribución", `Padre conserva enlaces tras descomposición (${enlacesPadreTras})`, enlacesPadreTras === 2 ? "OK" : "FAIL");

  // ============================================================
  // D. MARCADORES Y ROUTING
  // ============================================================
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Demo" }).click();
  await page.waitForTimeout(300);

  // Routing: revisar que algún enlace tiene puntos manhattan (vértices ortogonales)
  const linkPaths = await page.locator(".joint-link path[d]").evaluateAll((els) => {
    return els.map((el) => el.getAttribute("d") ?? "");
  });
  const algunoMultiSegmento = linkPaths.some((d) => (d.match(/[ML]/gi) ?? []).length >= 3);
  record("D. Routing", `Manhattan multi-segmento detectado en al menos un enlace`, algunoMultiSegmento ? "OK" : "WARN");

  // Marcadores: el demo OnStar tiene Driver maneja Driver Rescuing (instrumento) y Driver Rescuing afecta OnStar System (efecto)
  // Buscar markers SVG: cualquier <marker> en defs
  const markersDefs = await page.locator("svg defs marker").count();
  record("D. Marcadores", `Número de <marker> en defs: ${markersDefs}`, markersDefs > 0 ? "OK" : "WARN");

  // Buscar elementos visuales típicos: piruleta (circle), corchete (path con bracket), punta cerrada (polygon o path triangular)
  const circulosEnEnlaces = await page.locator(".joint-link circle, .joint-link marker circle, svg defs circle").count();
  const polygonsLinks = await page.locator(".joint-link polygon, svg defs marker polygon").count();
  record("D. Marcadores", `Círculos (piruleta) en enlaces/markers: ${circulosEnEnlaces}`, "INFO");
  record("D. Marcadores", `Polygons (puntas cerradas) en enlaces/markers: ${polygonsLinks}`, "INFO");

  await shot(page, "deep-D-marcadores-routing.png");

  // ============================================================
  // E. LINK TOOLS (Boundary, Vertices, Segments) AL SELECCIONAR ENLACE
  // ============================================================
  // Click sobre el wrapper transparente del path (técnica del smoke existente)
  const punto = await page.locator(".joint-link [joint-selector=wrapper]").first().evaluate((el) => {
    const path = el;
    const ctm = path.getScreenCTM();
    const p = path.getPointAtLength(path.getTotalLength() / 2);
    return { x: p.x * ctm.a + p.y * ctm.c + ctm.e, y: p.x * ctm.b + p.y * ctm.d + ctm.f };
  });
  await page.mouse.click(punto.x, punto.y);
  await page.waitForTimeout(300);
  const boundary = await page.locator('[data-tool-name="boundary"]').count();
  const vertices = await page.locator('[data-tool-name="vertices"]').count();
  const segments = await page.locator('[data-tool-name="segments"]').count();
  record("E. Link tools", `Boundary tool visible (${boundary})`, boundary > 0 ? "OK" : "FAIL");
  record("E. Link tools", `Vertices tool visible (${vertices})`, vertices > 0 ? "OK" : "FAIL");
  record("E. Link tools", `Segments tool visible (${segments})`, segments > 0 ? "OK" : "FAIL");
  await shot(page, "deep-E-link-tools.png");

  // ============================================================
  // F. ROUND-TRIP JSON
  // ============================================================
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Demo" }).click();
  await page.waitForTimeout(200);
  await page.getByRole("button", { name: "Exportar" }).click();
  await page.waitForTimeout(120);
  const json1 = await page.locator("textarea").inputValue();

  // Limpiar y reimportar
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("textarea").fill(json1);
  await page.getByRole("button", { name: "Importar" }).click();
  await page.waitForTimeout(200);
  await page.getByRole("button", { name: "Exportar" }).click();
  await page.waitForTimeout(120);
  const json2 = await page.locator("textarea").inputValue();
  // Comparar parseado para tolerar diferencias de orden de claves
  const a = JSON.parse(json1);
  const b = JSON.parse(json2);
  const ents1 = Object.keys(a.modelo.entidades).length;
  const ents2 = Object.keys(b.modelo.entidades).length;
  const enls1 = Object.keys(a.modelo.enlaces).length;
  const enls2 = Object.keys(b.modelo.enlaces).length;
  const opds1 = Object.keys(a.modelo.opds).length;
  const opds2 = Object.keys(b.modelo.opds).length;
  record("F. Round-trip JSON", `Entidades preservadas (${ents1}→${ents2})`, ents1 === ents2 ? "OK" : "FAIL");
  record("F. Round-trip JSON", `Enlaces preservados (${enls1}→${enls2})`, enls1 === enls2 ? "OK" : "FAIL");
  record("F. Round-trip JSON", `OPDs preservados (${opds1}→${opds2})`, opds1 === opds2 ? "OK" : "FAIL");

  // ============================================================
  // G. RECHAZO DE SELF-LINK
  // ============================================================
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Proceso" }).click();
  await page.waitForTimeout(150);
  const procesoSelf = page.locator(".joint-element").filter({ has: page.locator("ellipse") }).first();
  await procesoSelf.click();
  await page.waitForTimeout(80);
  await page.getByLabel("Tipo de enlace").selectOption("invocacion");
  await page.waitForTimeout(80);
  await procesoSelf.click();
  await page.waitForTimeout(200);
  const enlacesSelf = await page.locator(".joint-link").count();
  record("G. Self-link", `Self-link rechazado (enlaces=${enlacesSelf})`, enlacesSelf === 0 ? "OK" : "FAIL");
  await shot(page, "deep-G-self-link.png");

  // ============================================================
  // H. POSICIÓN INICIAL LIBRE POR OPD (no solapamiento al crear varias)
  // ============================================================
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.waitForTimeout(200);
  const cosasH = await page.locator(".joint-element").evaluateAll((els) => {
    return els.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y) };
    });
  });
  const posiciones = new Set(cosasH.map((p) => `${p.x},${p.y}`));
  record("H. Posición libre", `3 cosas creadas en posiciones distintas (${posiciones.size}/${cosasH.length})`, posiciones.size === cosasH.length ? "OK" : "FAIL");
  await shot(page, "deep-H-posicion-libre.png");

  // ============================================================
  // I. SELECCIÓN, MODO ENLACE Y NAVEGACIÓN OPD NO TOCAN HISTORIAL
  // ============================================================
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Objeto" }).click();
  await page.waitForTimeout(120);
  // Ronda 25 L1 III.A: el chrome ya no expone botón ↶. Verificamos en cambio
  // que el atajo Ctrl+Z efectivamente revierte la creación (proxy funcional
  // del estado "undo habilitado tras crear entidad").
  const cosasAntesUndo = await page.locator(".joint-element").count();
  await page.keyboard.press("Control+z");
  await page.waitForTimeout(120);
  const cosasTrasUndo = await page.locator(".joint-element").count();
  await page.keyboard.press("Control+Shift+z");
  await page.waitForTimeout(120);
  record("I. Historial limpio", `Undo habilitado tras crear entidad`, cosasAntesUndo === 1 && cosasTrasUndo === 0 ? "OK" : "FAIL");
  // Hacer click en la entidad (selección) y verificar que undo no se acumula
  const cosaI = page.locator(".joint-element").first();
  await cosaI.click();
  await cosaI.click();
  await cosaI.click();
  await page.waitForTimeout(120);
  // Hacer Ctrl+Z una sola vez debe revertir hasta el modelo inicial
  await page.keyboard.press("Control+z");
  await page.waitForTimeout(120);
  const cosasTrasUndoSeleccion = await page.locator(".joint-element").count();
  record("I. Historial limpio", `Selección no entra al historial (cosas tras 1 undo: ${cosasTrasUndoSeleccion})`, cosasTrasUndoSeleccion === 0 ? "OK" : "FAIL");
} catch (errFatal) {
  record("FATAL", "Excepción no controlada", "FAIL", errFatal instanceof Error ? errFatal.message : String(errFatal));
  await shot(page, "deep-99-fatal.png").catch(() => {});
} finally {
  await browser.close();
}

const ok = findings.filter((f) => f.estado === "OK").length;
const fail = findings.filter((f) => f.estado === "FAIL").length;
const warn = findings.filter((f) => f.estado === "WARN").length;
const info = findings.filter((f) => f.estado === "INFO").length;
console.log(`\n=== DEEP CHECKS RESUMEN ===`);
console.log(`OK ${ok} / FAIL ${fail} / WARN ${warn} / INFO ${info}`);
console.log(`pageerrors: ${pageErrors.length}`);
writeFileSync(resolve(DIR_SHOTS, "_deep_resumen.json"), JSON.stringify({ findings, ok, fail, warn, info, pageErrors }, null, 2));
if (fail > 0) process.exitCode = 1;
