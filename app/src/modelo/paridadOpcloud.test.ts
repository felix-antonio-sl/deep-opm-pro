import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { OPCLOUD_BEHAVIORAL_RULES, resumenParidadBehavioralOpcloud } from "./paridadOpcloud";

describe("paridad behavioral OPCloud", () => {
  test("la auditoria enumera todas las clases de behavioral.rules.ts extraido", () => {
    const source = readFileSync(path.resolve(import.meta.dir, "../../../opm-extracted/src/app/models/consistency/behavioral.rules.ts"), "utf8");
    const clases = [...source.matchAll(/^class (\w+) extends BehaviouralRule/gm)].map((match) => {
      const nombre = match[1];
      if (!nombre) throw new Error("Clase behavioral sin nombre");
      return nombre;
    });

    expect(clases).toEqual([...OPCLOUD_BEHAVIORAL_RULES]);
    expect(resumenParidadBehavioralOpcloud()).toEqual({
      totalOpcloud: 39,
      implementadas: 11,
      pendientes: 28,
    });
  });
});
