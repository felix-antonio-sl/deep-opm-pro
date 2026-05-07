import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const UI_ROOT = new URL("./", import.meta.url).pathname;
const SOURCE_FILE = /\.(ts|tsx)$/;
const TEST_FILE = /\.test\.(ts|tsx)$/;
const BAD_TOKEN_LITERAL = /"[^"`\n]*\$\{tokens\.[^"`\n]*"/;

function listarFuentesUi(dir: string): string[] {
  const archivos: string[] = [];
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entrada.name);
    if (entrada.isDirectory()) {
      archivos.push(...listarFuentesUi(path));
      continue;
    }
    if (SOURCE_FILE.test(entrada.name) && !TEST_FILE.test(entrada.name)) {
      archivos.push(path);
    }
  }
  return archivos;
}

describe("tokens UI — interpolacion CSS", () => {
  test("no deja tokens interpolados dentro de strings normales", () => {
    const errores: string[] = [];
    for (const archivo of listarFuentesUi(UI_ROOT)) {
      const lineas = readFileSync(archivo, "utf8").split(/\r?\n/);
      lineas.forEach((linea, index) => {
        if (BAD_TOKEN_LITERAL.test(linea)) {
          errores.push(`${relative(UI_ROOT, archivo)}:${index + 1}: ${linea.trim()}`);
        }
      });
    }

    expect(errores).toEqual([]);
  });
});
