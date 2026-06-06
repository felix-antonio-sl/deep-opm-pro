import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AUTORIA_ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.resolve(AUTORIA_ROOT, "..");
const MODELO_ROOT = path.join(SRC_ROOT, "modelo");

const CAPAS_RUNTIME_PROHIBIDAS = new Set(["app", "canvas", "persistencia", "render", "server", "store", "ui"]);
const IMPORT_RE = /(?:import|export)\s+(?:type\s+)?(?:[^'"]*?\s+from\s+)?["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)/g;

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
});

function archivosProductivos(root: string): string[] {
  return listarArchivos(root).filter((archivo) =>
    /\.(ts|tsx)$/.test(archivo) &&
    !archivo.endsWith(".test.ts") &&
    !archivo.endsWith(".test.tsx") &&
    !archivo.endsWith(".d.ts"),
  );
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
