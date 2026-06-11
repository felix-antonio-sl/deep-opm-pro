import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AUTORIA_ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.resolve(AUTORIA_ROOT, "..");
const APP_ROOT = path.resolve(SRC_ROOT, "..");
const SCRIPTS_ROOT = path.join(APP_ROOT, "scripts");
const MODELO_ROOT = path.join(SRC_ROOT, "modelo");
const RENDER_ROOT = path.join(SRC_ROOT, "render");
const CANVAS_ROOT = path.join(SRC_ROOT, "canvas");
const OPL_ROOT = path.join(SRC_ROOT, "opl");
const SERIALIZACION_ROOT = path.join(SRC_ROOT, "serializacion");
const PERSISTENCIA_ROOT = path.join(SRC_ROOT, "persistencia");

const CAPAS_RUNTIME_PROHIBIDAS = new Set(["app", "canvas", "persistencia", "render", "server", "store", "ui"]);
const CAPAS_INTERACTIVAS_PROHIBIDAS = new Set(["app", "render", "server", "store", "ui"]);
const IMPORT_RE = /(?:import|export)\s+(?:type\s+)?(?:[^'"]*?\s+from\s+)?["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)/g;
const CATCH_VACIO_RE = /catch\s*(?:\([^)]*\))?\s*\{\s*\}/g;

// Waivers CONGELADOS de la frontera render↛ui (auditoría 2026-06-11): deuda
// conocida que no debe crecer. Retirar entradas al resolverlas; no añadir.
const WAIVERS_RENDER_A_UI = new Set([
  "render/jointjs/handlers/zoom.ts -> ui/atajosTeclado",
  "render/jointjs/overlayCanvas/FlashToast.tsx -> ui/tokens",
  "render/jointjs/overlayCanvas/ErrorBadge.tsx -> ui/tokens",
]);

describe("arquitectura/autoria", () => {
  test("autoria productiva permanece headless y no depende del runtime interactivo", () => {
    const violaciones = archivosProductivos(AUTORIA_ROOT).flatMap((archivo) =>
      importsRelativosSrc(archivo)
        .filter((destino) => CAPAS_RUNTIME_PROHIBIDAS.has(capaTop(destino)))
        .map((destino) => `${rel(archivo)} -> ${destino}`),
    );

    expect(violaciones).toEqual([]);
  });

  test("el runtime productivo no toma autoria como dependencia oculta", () => {
    const violaciones = archivosProductivos(SRC_ROOT)
      .filter((archivo) => !estaBajo(archivo, AUTORIA_ROOT))
      .flatMap((archivo) =>
        importsRelativosSrc(archivo)
          .filter((destino) => destino === "autoria" || destino.startsWith("autoria/"))
          .map((destino) => `${rel(archivo)} -> ${destino}`),
      );

    expect(violaciones).toEqual([]);
  });

  test("modelo productivo no depende del runtime interactivo", () => {
    const violaciones = archivosProductivos(MODELO_ROOT).flatMap((archivo) =>
      importsRelativosSrc(archivo)
        .filter((destino) => CAPAS_RUNTIME_PROHIBIDAS.has(capaTop(destino)))
        .map((destino) => `${rel(archivo)} -> ${destino}`),
    );

    expect(violaciones).toEqual([]);
  });

  test("opl productivo permanece headless y no depende de runtime interactivo", () => {
    const violaciones = archivosProductivos(OPL_ROOT).flatMap((archivo) =>
      importsRelativosSrc(archivo)
        .filter((destino) => CAPAS_INTERACTIVAS_PROHIBIDAS.has(capaTop(destino)))
        .map((destino) => `${rel(archivo)} -> ${destino}`),
    );

    expect(violaciones).toEqual([]);
  });

  test("serializacion productiva permanece headless y no depende de runtime interactivo", () => {
    const violaciones = archivosProductivos(SERIALIZACION_ROOT).flatMap((archivo) =>
      importsRelativosSrc(archivo)
        .filter((destino) => CAPAS_INTERACTIVAS_PROHIBIDAS.has(capaTop(destino)))
        .map((destino) => `${rel(archivo)} -> ${destino}`),
    );

    expect(violaciones).toEqual([]);
  });

  test("persistencia productiva no depende de UI/render/store/app/server", () => {
    const violaciones = archivosProductivos(PERSISTENCIA_ROOT).flatMap((archivo) =>
      importsRelativosSrc(archivo)
        .filter((destino) => CAPAS_INTERACTIVAS_PROHIBIDAS.has(capaTop(destino)))
        .map((destino) => `${rel(archivo)} -> ${destino}`),
    );

    expect(violaciones).toEqual([]);
  });

  test("render no depende de ui salvo waivers congelados; canvas no depende de jointjs", () => {
    const renderAUi = archivosProductivos(RENDER_ROOT).flatMap((archivo) =>
      importsRelativosSrc(archivo)
        .filter((destino) => capaTop(destino) === "ui")
        .map((destino) => `${rel(archivo)} -> ${destino}`),
    );
    const violacionesRender = renderAUi.filter((violacion) => !WAIVERS_RENDER_A_UI.has(violacion));
    const waiversMuertos = [...WAIVERS_RENDER_A_UI].filter((waiver) => !renderAUi.includes(waiver));

    const violacionesCanvas = archivosProductivos(CANVAS_ROOT).flatMap((archivo) => {
      const contenido = readFileSync(archivo, "utf8");
      return [...contenido.matchAll(IMPORT_RE)]
        .map((match) => match[1] ?? match[2])
        .filter((spec): spec is string => spec === "jointjs" || !!spec?.startsWith("jointjs/"))
        .map((spec) => `${rel(archivo)} -> ${spec}`);
    });

    expect(violacionesRender).toEqual([]);
    // Un waiver que ya no matchea es deuda saldada: retirarlo del set.
    expect(waiversMuertos).toEqual([]);
    expect(violacionesCanvas).toEqual([]);
  });

  test("no quedan catch vacíos sin clasificar en src ni scripts", () => {
    const violaciones = [...archivosProductivos(SRC_ROOT), ...archivosScript(SCRIPTS_ROOT)].flatMap((archivo) => {
      const contenido = readFileSync(archivo, "utf8");
      return [...contenido.matchAll(CATCH_VACIO_RE)].map(() => relApp(archivo));
    });

    expect(violaciones).toEqual([]);
  });
});

function archivosProductivos(root: string): string[] {
  return listarArchivos(root).filter((archivo) =>
    /\.(ts|tsx)$/.test(archivo) &&
    !archivo.endsWith(".test.ts") &&
    !archivo.endsWith(".test.tsx") &&
    !archivo.endsWith(".d.ts"),
  );
}

function archivosScript(root: string): string[] {
  return listarArchivos(root).filter((archivo) => /\.(ts|tsx|mjs)$/.test(archivo));
}

function listarArchivos(root: string): string[] {
  const out: string[] = [];
  for (const nombre of readdirSync(root)) {
    const absoluto = path.join(root, nombre);
    const stat = statSync(absoluto);
    if (stat.isDirectory()) out.push(...listarArchivos(absoluto));
    else out.push(absoluto);
  }
  return out;
}

function importsRelativosSrc(archivo: string): string[] {
  const contenido = readFileSync(archivo, "utf8");
  const destinos: string[] = [];
  for (const match of contenido.matchAll(IMPORT_RE)) {
    const spec = match[1] ?? match[2];
    if (!spec?.startsWith(".")) continue;
    destinos.push(normalizarDestino(archivo, spec));
  }
  return destinos;
}

function normalizarDestino(archivo: string, spec: string): string {
  const absoluto = path.resolve(path.dirname(archivo), spec);
  return path.relative(SRC_ROOT, absoluto).split(path.sep).join("/");
}

function capaTop(destino: string): string {
  return destino.split("/")[0] ?? "";
}

function estaBajo(archivo: string, directorio: string): boolean {
  const relativo = path.relative(directorio, archivo);
  return relativo === "" || (!relativo.startsWith("..") && !path.isAbsolute(relativo));
}

function rel(archivo: string): string {
  return path.relative(SRC_ROOT, archivo).split(path.sep).join("/");
}

function relApp(archivo: string): string {
  return path.relative(APP_ROOT, archivo).split(path.sep).join("/");
}
