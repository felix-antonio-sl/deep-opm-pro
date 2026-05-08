import { describe, expect, test } from "bun:test";
import {
  debeFallarStrict,
  ordenarResultados,
  parseArgs,
  resumenResultados,
  serializarMarkdown,
} from "./evaluacion-ux-permanente.mjs";

describe("evaluacion UX permanente helpers", () => {
  test("parsea URL, out y strict", () => {
    expect(parseArgs(["http://127.0.0.1:5173/", "--out", "r21", "--strict"])).toEqual({
      url: "http://127.0.0.1:5173/",
      out: "r21",
      strict: true,
      selfTest: false,
    });
  });

  test("resume, ordena y aplica strict sobre FAIL", () => {
    const resultados = [
      { criterio: "ok", estado: "OK" },
      { criterio: "warn", estado: "WARN" },
      { criterio: "fail", estado: "FAIL" },
    ];
    expect(resumenResultados(resultados)).toEqual({ total: 3, ok: 1, warn: 1, fail: 1 });
    expect(ordenarResultados(resultados).map((item) => item.estado)).toEqual(["FAIL", "WARN", "OK"]);
    expect(debeFallarStrict(resultados, true)).toBe(true);
    expect(debeFallarStrict(resultados, false)).toBe(false);
  });

  test("serializa reporte markdown enlazando screenshots", () => {
    const md = serializarMarkdown({
      fecha: "2026-05-08T00:00:00.000Z",
      url: "http://localhost:5173/",
      strict: false,
      resultados: [{ criterio: "criterio | con pipe", estado: "OK", duracionMs: 10, screenshot: "shot.png", detalle: { a: 1 } }],
      runtime: { pageErrors: [], consoleErrors: [], consoleWarnings: [], requestFailures: [] },
      fixtures: [{ id: "chico", nombre: "Comprar Pan" }],
    });
    expect(md).toContain("[png](shot.png)");
    expect(md).toContain("criterio \\| con pipe");
    expect(md).toContain("- chico: Comprar Pan");
  });
});
