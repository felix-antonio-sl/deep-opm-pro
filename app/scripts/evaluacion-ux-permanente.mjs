import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { fixtureUxPorId, fixturesUxRegresion } from "./fixtures-ux-regresion.mjs";

const ESTADOS = ["FAIL", "WARN", "OK"];
const DEFAULT_URL = "http://localhost:5173/";

export function parseArgs(argv) {
  const url = argv.find((arg) => /^https?:\/\//.test(arg)) ?? DEFAULT_URL;
  const outIndex = argv.indexOf("--out");
  return {
    url,
    strict: argv.includes("--strict"),
    selfTest: argv.includes("--self-test"),
    out: outIndex >= 0 ? argv[outIndex + 1] ?? "ronda21" : "ronda21",
  };
}

export function resumenResultados(resultados) {
  return resultados.reduce((acc, item) => {
    acc.total += 1;
    acc[item.estado.toLowerCase()] += 1;
    return acc;
  }, { total: 0, ok: 0, warn: 0, fail: 0 });
}

export function debeFallarStrict(resultados, strict) {
  return strict && resultados.some((item) => item.estado === "FAIL");
}

export function ordenarResultados(resultados) {
  return [...resultados].sort((a, b) => ESTADOS.indexOf(a.estado) - ESTADOS.indexOf(b.estado));
}

export function serializarMarkdown(reporte) {
  const resumen = resumenResultados(reporte.resultados);
  const lineas = [
    "# Evaluacion UX permanente",
    "",
    `- Fecha: ${reporte.fecha}`,
    `- URL: ${reporte.url}`,
    `- Strict: ${reporte.strict ? "si" : "no"}`,
    `- Resumen: ${resumen.fail} FAIL / ${resumen.warn} WARN / ${resumen.ok} OK`,
    "",
    "## Criterios",
    "",
    "| Estado | Criterio | Duracion | Screenshot | Detalle |",
    "|---|---|---:|---|---|",
  ];
  for (const item of ordenarResultados(reporte.resultados)) {
    const shot = item.screenshot ? `[png](${item.screenshot})` : "";
    const detalle = markdownDetalle(item.detalle);
    lineas.push(`| ${item.estado} | ${escapeMd(item.criterio)} | ${item.duracionMs ?? ""} ms | ${shot} | ${detalle} |`);
  }
  lineas.push(
    "",
    "## Runtime",
    "",
    `- Page errors: ${reporte.runtime.pageErrors.length}`,
    `- Console errors: ${reporte.runtime.consoleErrors.length}`,
    `- Console warnings: ${reporte.runtime.consoleWarnings.length}`,
    `- Request failures: ${reporte.runtime.requestFailures.length}`,
    "",
    "## Fixtures",
    "",
    ...reporte.fixtures.map((fixture) => `- ${fixture.id}: ${fixture.nombre}`),
    "",
    "## Umbrales iniciales",
    "",
    "- FAIL: contrato visible roto, error JS de pagina durante el criterio, o flujo critico no ejecutable.",
    "- WARN: prerequisito de ronda no presente, affordance opcional no implementada, o degradacion no bloqueante.",
    "- OK: contrato observado con evidencia DOM y screenshot.",
  );
  return `${lineas.join("\n")}\n`;
}

function escapeMd(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function markdownDetalle(detalle) {
  if (detalle == null) return "";
  const texto = typeof detalle === "string" ? detalle : JSON.stringify(detalle);
  return escapeMd(texto.length > 220 ? `${texto.slice(0, 217)}...` : texto);
}

function assertSelfTest() {
  const sample = [
    { criterio: "ok", estado: "OK", duracionMs: 1 },
    { criterio: "fail", estado: "FAIL", duracionMs: 2 },
  ];
  const md = serializarMarkdown({
    fecha: "2026-05-08T00:00:00.000Z",
    url: "http://127.0.0.1:5173/",
    strict: true,
    resultados: sample,
    runtime: { pageErrors: [], consoleErrors: [], consoleWarnings: [], requestFailures: [] },
    fixtures: [],
  });
  if (!md.includes("| FAIL | fail | 2 ms |")) throw new Error("serializacion markdown no ordena FAIL primero");
  if (!debeFallarStrict(sample, true)) throw new Error("strict no falla con FAIL");
  if (debeFallarStrict(sample, false)) throw new Error("modo no strict fallo indebidamente");
}

function crearRecorder({ dir, runtime }) {
  const resultados = [];
  return {
    resultados,
    async criterio(page, criterio, fn) {
      const inicio = performance.now();
      const prevPageErrors = runtime.pageErrors.length;
      try {
        const detalle = await fn();
        const screenshotPath = await screenshot(page, dir, criterio);
        const estado = runtime.pageErrors.length > prevPageErrors ? "FAIL" : detalle?.estado ?? "OK";
        resultados.push({
          criterio,
          estado,
          duracionMs: Math.round(performance.now() - inicio),
          detalle: detalle?.detalle ?? detalle,
          screenshot: screenshotPath,
        });
      } catch (error) {
        const screenshotPath = page ? await screenshot(page, dir, criterio).catch(() => null) : null;
        resultados.push({
          criterio,
          estado: "FAIL",
          duracionMs: Math.round(performance.now() - inicio),
          detalle: error.message,
          screenshot: screenshotPath,
        });
      }
    },
    warn(criterio, detalle) {
      resultados.push({ criterio, estado: "WARN", duracionMs: 0, detalle });
    },
  };
}

async function screenshot(page, dir, criterio) {
  const nombre = `${slug(criterio)}.png`;
  await page.screenshot({ path: resolve(dir, nombre), fullPage: false });
  return nombre;
}

function slug(texto) {
  return texto.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function nuevaPagina(browser, url, viewport, runtime) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  page.on("pageerror", (error) => runtime.pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtime.consoleErrors.push(message.text());
    if (message.type() === "warning") runtime.consoleWarnings.push(message.text());
  });
  page.on("requestfailed", (request) => {
    if (/favicon/.test(request.url())) return;
    runtime.requestFailures.push({ url: request.url(), reason: request.failure()?.errorText });
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 25000 });
  await cerrarInicio(page);
  return { context, page };
}

async function cerrarInicio(page) {
  const pantalla = page.getByTestId("pantalla-inicio");
  if (await pantalla.count()) {
    const nuevo = pantalla.getByRole("button", { name: "Nuevo", exact: true });
    if (await nuevo.count()) await nuevo.click();
  }
}

async function crearCosa(page, tipo, nombre) {
  await page.getByRole("button", { name: tipo, exact: true }).click();
  const modal = page.getByTestId("modal-nombre-cosa");
  if (await modal.count()) {
    await modal.getByLabel("Nombre").fill(nombre);
    await modal.getByRole("button", { name: "OK" }).click();
  } else {
    const input = page.getByLabel("Nombre").first();
    if (await input.count()) await input.fill(nombre);
  }
  await page.waitForTimeout(150);
}

function elementoPorTexto(page, texto) {
  const flexible = new RegExp(`^\\s*${texto.trim().split(/\s+/).map(escapeRegExp).join("\\s*")}\\s*$`);
  return page.locator(".joint-element").filter({ has: page.locator("text").filter({ hasText: flexible }) });
}

function escapeRegExp(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function importarFixture(page, fixture) {
  await page.getByLabel("Archivo JSON").setInputFiles({
    name: `${fixture.id}.json`,
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(fixture.payload)),
  });
  await page.getByRole("button", { name: "Importar" }).click();
  const dialogoDirty = page.getByRole("dialog", { name: "Hay cambios sin guardar" });
  if (await dialogoDirty.count()) await dialogoDirty.getByRole("button", { name: "Descartar" }).click();
  await page.waitForTimeout(500);
}

async function exportadoActual(page) {
  await page.getByRole("button", { name: "Exportar", exact: true }).click();
  const json = await page.locator('textarea[spellcheck="false"]').first().inputValue();
  return JSON.parse(json);
}

async function puntoCentro(locator) {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, width: rect.width, height: rect.height };
  });
}

async function puntoMedioPath(locator) {
  return locator.evaluate((element) => {
    const path = element;
    const ctm = path.getScreenCTM();
    if (!ctm) throw new Error("sin matriz de pantalla");
    const point = path.getPointAtLength(path.getTotalLength() / 2);
    return {
      x: point.x * ctm.a + point.y * ctm.c + ctm.e,
      y: point.x * ctm.b + point.y * ctm.d + ctm.f,
    };
  });
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.selfTest) {
    assertSelfTest();
    console.log("self-test OK");
    return 0;
  }

  const raiz = resolve(import.meta.dirname, "..", "..");
  const dir = resolve(raiz, "app/_eval-output", opts.out);
  mkdirSync(dir, { recursive: true });

  const runtime = { pageErrors: [], consoleErrors: [], consoleWarnings: [], requestFailures: [] };
  const recorder = crearRecorder({ dir, runtime });
  const browser = await chromium.launch({ headless: true });

  try {
    {
      const { context, page } = await nuevaPagina(browser, opts.url, { width: 1280, height: 720 }, runtime);
      await recorder.criterio(page, "carga inicial y estado vacio", async () => {
        const canvas = await page.getByRole("img", { name: "OPD activo" }).count();
        const elementos = await page.locator(".joint-element").count();
        const oplVacio = await page.getByText("Sin OPL todavía.").count();
        if (canvas !== 1 || elementos !== 0 || oplVacio === 0) throw new Error("workspace inicial no esta vacio y listo");
        return { canvas, elementos, oplVacio };
      });

      await recorder.criterio(page, "crear SD minimo", async () => {
        await crearCosa(page, "Objeto", "Entrada UX");
        await crearCosa(page, "Proceso", "Procesar UX");
        const objetos = await page.locator(".joint-element").count();
        if (objetos < 2) throw new Error("no se crearon objeto y proceso minimos");
        return { elementos: objetos };
      });

      await recorder.criterio(page, "crear link por click-click", async () => {
        await elementoPorTexto(page, "Entrada UX").click();
        await page.getByLabel("Tipo de enlace").selectOption("consumo");
        await elementoPorTexto(page, "Procesar UX").click();
        await page.waitForTimeout(300);
        const links = await page.locator(".joint-link").count();
        const opl = await page.getByTestId("panel-opl").textContent().catch(() => "");
        if (links < 1 || !/consume/i.test(opl ?? "")) throw new Error("no se observo enlace consumo ni OPL sincronizado");
        return { links, oplIncluyeConsume: /consume/i.test(opl ?? "") };
      });

      await recorder.criterio(page, "crear link por drag source-target", async () => {
        const origen = await puntoCentro(elementoPorTexto(page, "Entrada UX").first());
        const destino = await puntoCentro(elementoPorTexto(page, "Procesar UX").first());
        const linksAntes = await page.locator(".joint-link").count();
        await page.getByLabel("Tipo de enlace").selectOption("consumo");
        await page.mouse.move(origen.x, origen.y);
        await page.mouse.down();
        await page.mouse.move(destino.x, destino.y, { steps: 8 });
        await page.mouse.up();
        await page.waitForTimeout(350);
        const linksDespues = await page.locator(".joint-link").count();
        if (linksDespues <= linksAntes) {
          return { estado: "WARN", detalle: "No se creo enlace adicional por drag; prerequisito L2 puede no estar disponible o el par duplicado fue rechazado." };
        }
        return { linksAntes, linksDespues };
      });
      await context.close();
    }

    {
      const fixtureMediano = fixtureUxPorId("mediano");
      const { context, page } = await nuevaPagina(browser, opts.url, { width: 1280, height: 720 }, runtime);
      await recorder.criterio(page, "cargar fixture JSON e identidad modelo OPD", async () => {
        await importarFixture(page, fixtureMediano);
        const treeActivo = await page.locator('[role="treeitem"][aria-current="page"]').textContent().catch(() => "");
        const chip = await page.getByTestId("chip-persistencia").textContent().catch(() => "");
        const titulo = await page.getByText(fixtureMediano.nombre, { exact: true }).count();
        const exportado = await exportadoActual(page);
        if (exportado.modelo.nombre !== fixtureMediano.nombre || titulo === 0) throw new Error("identidad de modelo importado no coincide");
        return { modelo: exportado.modelo.nombre, opdActivo: treeActivo, chip };
      });

      await recorder.criterio(page, "refinamiento y navegacion OPD hijo", async () => {
        const botonDescomponer = page.getByRole("button", { name: "Descomponer" }).first();
        if (await botonDescomponer.count() === 0) {
          await crearCosa(page, "Proceso", "Proceso refinable UX");
        } else {
          await elementoPorTexto(page, "Entregar Valor").first().click().catch(() => {});
        }
        const boton = page.getByRole("button", { name: "Descomponer" }).first();
        if (await boton.count() === 0) return { estado: "WARN", detalle: "No hay accion de descomposicion visible para la seleccion actual." };
        await boton.click();
        await page.waitForTimeout(500);
        const activo = await page.locator('[role="treeitem"][aria-current="page"]').textContent().catch(() => "");
        if (!/SD1|descompuesto|descompuesta/i.test(activo ?? "")) throw new Error("no navego al OPD hijo tras refinar");
        return { opdActivo: activo };
      });
      await context.close();
    }

    {
      const fixtureGrande = fixtureUxPorId("grande");
      const { context, page } = await nuevaPagina(browser, opts.url, { width: 1280, height: 720 }, runtime);
      await importarFixture(page, fixtureGrande);
      await recorder.criterio(page, "navegar hasta 8 OPDs raiz inzoom unfold", async () => {
        const items = page.locator('[role="treeitem"][data-opd-id]');
        const total = await items.count();
        const visitados = [];
        for (let i = 0; i < total && visitados.length < 8; i += 1) {
          const item = items.nth(i);
          const texto = await item.textContent();
          if (/Mapa del sistema/i.test(texto ?? "")) continue;
          await item.click();
          visitados.push(texto?.replace(/\s+/g, " ").trim());
        }
        const tipos = visitados.join(" ");
        if (total < 2) return { estado: "WARN", detalle: { total, visitados, razon: "fixture sin suficientes OPDs" } };
        const distingueRaiz = /SD/.test(tipos);
        const distingueInzoomOUnfold = /descomp|despleg|in zoom|unfold|SD1/i.test(tipos);
        if (!distingueRaiz || !distingueInzoomOUnfold) {
          return {
            estado: "WARN",
            detalle: { total, visitados, distingueRaiz, distingueInzoomOUnfold },
          };
        }
        return {
          total,
          visitados,
          distingueRaiz,
          distingueInzoomOUnfold,
        };
      });

      await recorder.criterio(page, "warning metodologico legible 1280x720", async () => {
        await page.getByTestId("panel-metodologia-revalidar").click().catch(() => {});
        const panel = page.getByTestId("panel-metodologia");
        const rect = await panel.evaluate((el) => {
          const r = el.getBoundingClientRect();
          return { width: r.width, height: r.height, visible: r.width > 160 && r.height > 44 };
        });
        const total = await page.getByTestId("panel-metodologia-total").textContent().catch(() => "");
        if (!rect.visible) throw new Error("panel metodologia no tiene superficie legible a 1280x720");
        return { rect, total };
      });

      await recorder.criterio(page, "OPL filtrado por seleccion", async () => {
        const sd = page.locator('[role="treeitem"][data-opd-id]').filter({ hasNotText: /Mapa del sistema/i }).first();
        if (await sd.count()) await sd.click();
        await page.waitForTimeout(150);
        const primera = page.locator(".joint-element").first();
        if (await primera.count() === 0) throw new Error("fixture sin entidades visibles");
        await primera.click();
        const panel = page.locator('[data-testid="panel-opl"], [data-testid="panel-opl-minimizado"]').first();
        if (await panel.count() === 0) throw new Error("panel OPL no visible");
        const texto = await panel.textContent();
        const resaltados = await panel.locator('[data-opl-ref], mark, [aria-current="true"], [data-selected="true"]').count().catch(() => 0);
        if (!texto || texto.length < 20) throw new Error("OPL no muestra contenido tras seleccion");
        return { caracteresOpl: texto.length, resaltados };
      });

      await recorder.criterio(page, "auto-layout y fit visible", async () => {
        await page.getByTestId("toolbar-aplicar-layout").click();
        await page.waitForTimeout(700);
        const canvasLocator = page.locator('[role="img"][aria-label="OPD activo"], [data-testid="canvas-pane"]').first();
        if (await canvasLocator.count() === 0) throw new Error("canvas OPD no visible");
        const canvas = await canvasLocator.evaluate((el) => ({
          scrollLeft: el.scrollLeft,
          scrollTop: el.scrollTop,
          clientWidth: el.clientWidth,
          clientHeight: el.clientHeight,
          scrollWidth: el.scrollWidth,
          scrollHeight: el.scrollHeight,
        }));
        const elementos = await page.locator(".joint-element").count();
        if (elementos === 0) throw new Error("auto-layout dejo canvas sin entidades");
        return { canvas, elementos };
      });

      await recorder.criterio(page, "persistencia y chip si existe", async () => {
        const chip = page.getByTestId("chip-persistencia");
        if (await chip.count() === 0) return { estado: "WARN", detalle: "Chip persistencia no esta implementado en este corte." };
        await page.keyboard.press("Control+S");
        const dialogo = page.getByRole("dialog", { name: "Guardar como" });
        if (await dialogo.count()) {
          await dialogo.getByLabel("Nombre del modelo").fill("Eval UX persistencia");
          await dialogo.getByRole("button", { name: "Guardar" }).click();
          await page.waitForTimeout(300);
        }
        const textoChip = await chip.textContent();
        return { chip: textoChip };
      });
      await context.close();
    }

    {
      const { context, page } = await nuevaPagina(browser, opts.url, { width: 390, height: 844 }, runtime);
      await page.getByLabel("Cargar modelo de ejemplo").selectOption("Cafetera Domestica");
      await page.waitForTimeout(500);
      await recorder.criterio(page, "mobile 390 OPD OPL issues seleccion", async () => {
        const tree = await page.getByTestId("tree-pane").count();
        const opl = await page.getByTestId("panel-opl").count();
        const issues = await page.getByTestId("panel-metodologia").count();
        const overflow = await page.getByTestId("toolbar-root").evaluate((el) => ({
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          delta: el.scrollWidth - el.clientWidth,
        }));
        if (!tree || !opl || !issues) throw new Error("mobile no expone OPD/OPL/issues");
        if (overflow.delta > 8) {
          return { estado: "WARN", detalle: { tree, opl, issues, toolbarOverflowPx: overflow.delta } };
        }
        return { tree, opl, issues, toolbarOverflowPx: overflow.delta };
      });

      await recorder.criterio(page, "mobile 390 comentarios notas", async () => {
        const notas = await page.locator('[data-testid*="nota"], [data-testid*="coment"], button:has-text("Nota"), button:has-text("Comentario")').count();
        if (notas === 0) return { estado: "WARN", detalle: "EPICA-42 comentarios/notas no esta visible en este corte." };
        return { controlesNotas: notas };
      });
      await context.close();
    }
  } finally {
    await browser.close();
  }

  const reporte = {
    fecha: new Date().toISOString(),
    url: opts.url,
    strict: opts.strict,
    outputDir: relative(resolve(import.meta.dirname, ".."), dir),
    resultados: recorder.resultados,
    runtime,
    fixtures: fixturesUxRegresion().map((fixture) => ({ id: fixture.id, nombre: fixture.nombre })),
  };
  writeFileSync(resolve(dir, "_evaluacion-ux.json"), JSON.stringify(reporte, null, 2));
  writeFileSync(resolve(dir, "reporte.md"), serializarMarkdown(reporte));

  const resumen = resumenResultados(recorder.resultados);
  console.log(`UX permanente: ${resumen.fail} FAIL / ${resumen.warn} WARN / ${resumen.ok} OK`);
  console.log(`Reporte: ${resolve(dir, "reporte.md")}`);
  return debeFallarStrict(recorder.resultados, opts.strict) ? 1 : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().then((code) => process.exit(code)).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
