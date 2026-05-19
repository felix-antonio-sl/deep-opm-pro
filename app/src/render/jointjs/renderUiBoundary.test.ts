import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const RENDER_JOINTJS_ROOT = dirname(fileURLToPath(import.meta.url));

describe("frontera render/UI JointJS", () => {
  test("render/jointjs no importa el adapter concreto de feedback Zustand", () => {
    const offenders = sourceFiles(RENDER_JOINTJS_ROOT)
      .filter((file) => {
        const text = readFileSync(file, "utf8");
        return text.includes("zustandFeedbackPort") || text.includes("useZustandFeedbackOverlays");
      })
      .map((file) => relative(RENDER_JOINTJS_ROOT, file).replaceAll("\\", "/"));

    expect(offenders).toEqual([]);
  });

  test("JointCanvas no importa chrome UI concreto", () => {
    const offenders = sourceFiles(RENDER_JOINTJS_ROOT)
      .filter((file) => {
        const text = readFileSync(file, "utf8");
        return text.includes("../../ui/MenuTipoEnlace")
          || text.includes("../../ui/RenombradoInline")
          || text.includes("../../ui/motion");
      })
      .map((file) => relative(RENDER_JOINTJS_ROOT, file).replaceAll("\\", "/"));

    expect(offenders).toEqual([]);
  });

  test("render/jointjs no sincroniza puertos del modelo en tiempo de render", () => {
    const offenders = sourceFiles(RENDER_JOINTJS_ROOT)
      .filter((file) => {
        const text = readFileSync(file, "utf8");
        return text.includes("sincronizarPuertosEnlaces")
          || text.includes("sincronizarPuertosTodosLosOpd");
      })
      .map((file) => relative(RENDER_JOINTJS_ROOT, file).replaceAll("\\", "/"));

    expect(offenders).toEqual([]);
  });
});

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const file = join(dir, name);
    const stat = statSync(file);
    if (stat.isDirectory()) return sourceFiles(file);
    if (!/\.(?:ts|tsx)$/.test(file) || file.endsWith(".test.ts") || file.endsWith(".test.tsx")) return [];
    return [file];
  });
}
