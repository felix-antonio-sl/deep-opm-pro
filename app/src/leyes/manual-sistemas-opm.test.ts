// Testigo ejecutable del ejemplo Puente Vecinal publicado en
// docs/manual-sistemas-opm.md. La ley impide que la documentación transversal
// enseñe OPL que el parser acepte solo en apariencia.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import { validarModelo } from "../modelo/validaciones";
import { generarOpl } from "../opl/generar";
import {
  aplicarPatchesOpl,
  parsearParrafoOpl,
  planificarEdicionOplLibre,
} from "../opl/parser";
import type { Modelo } from "../modelo/tipos";

const RAIZ_REPO = resolve(import.meta.dir, "../../..");
const FUENTE = resolve(RAIZ_REPO, "docs/ejemplos/puente-vecinal.opl");
const MANUAL = resolve(RAIZ_REPO, "docs/manual-sistemas-opm.md");
const lineas = readFileSync(FUENTE, "utf8").trim().split("\n");
const manual = readFileSync(MANUAL, "utf8");

function importarOpl(texto: string): Modelo {
  const base = crearModelo("Puente Vecinal");
  const preview = planificarEdicionOplLibre(base, texto, {
    opdActivoId: base.opdRaizId,
  });

  expect(
    preview.diagnosticos.filter(
      (diagnostico) =>
        diagnostico.severidad === "error" || diagnostico.severidad === "warning",
    ),
  ).toEqual([]);

  const aplicado = aplicarPatchesOpl(base, preview.patches, base.opdRaizId);
  if (!aplicado.ok) throw new Error(aplicado.error);
  return aplicado.value;
}

function esperarFormaPuenteVecinal(modelo: Modelo): void {
  expect(Object.keys(modelo.entidades)).toHaveLength(11);
  expect(Object.keys(modelo.enlaces)).toHaveLength(15);
  expect(Object.keys(modelo.estados)).toHaveLength(10);
  expect(validarModelo(modelo, modelo.opdRaizId)).toEqual([]);
}

describe("manual de sistemas · ejemplo Puente Vecinal", () => {
  test("todos los bloques OPL publicados usan oraciones atómicas soportadas", () => {
    const bloques = [...manual.matchAll(/```opl\n([\s\S]*?)\n```/g)].map((match) =>
      match[1]!.trim().split("\n"),
    );
    expect(bloques.length).toBeGreaterThan(0);
    for (const linea of bloques.flat()) {
      const parse = parsearParrafoOpl(linea);
      expect(
        parse.diagnosticos.filter(
          (d) => d.severidad === "error" || d.severidad === "warning",
        ),
      ).toEqual([]);
      expect(parse.ast).toHaveLength(1);
      expect(parse.ast[0]?.kind).not.toBe("unsupported");
    }
  });

  test("cada línea del fixture expresa exactamente una oración soportada", () => {
    expect(lineas).toHaveLength(30);
    for (const linea of lineas) {
      const parse = parsearParrafoOpl(linea);
      expect(
        parse.diagnosticos.filter(
          (d) => d.severidad === "error" || d.severidad === "warning",
        ),
      ).toEqual([]);
      expect(parse.ast).toHaveLength(1);
      expect(parse.ast[0]?.kind).not.toBe("unsupported");
    }
  });

  test("distingue al equipo humano del registro que usa como instrumento", () => {
    expect(
      parsearParrafoOpl(
        "**Equipo de préstamo** maneja *Aprobación de préstamo*.",
      ).ast[0],
    ).toMatchObject({
      kind: "procedimental",
      tipoEnlace: "agente",
      proceso: "Aprobación de préstamo",
      objeto: "Equipo de préstamo",
    });
    expect(
      parsearParrafoOpl(
        "*Validación de disponibilidad* requiere **Registro de inventario**.",
      ).ast[0],
    ).toMatchObject({
      kind: "procedimental",
      tipoEnlace: "instrumento",
      proceso: "Validación de disponibilidad",
      objeto: "Registro de inventario",
    });
  });

  test("importa, valida y reimporta sin pérdida semántica", () => {
    const inicial = importarOpl(lineas.join("\n"));
    esperarFormaPuenteVecinal(inicial);

    const regenerado = generarOpl(inicial, inicial.opdRaizId).join("\n");
    const roundtrip = importarOpl(regenerado);
    esperarFormaPuenteVecinal(roundtrip);
    expect(generarOpl(roundtrip, roundtrip.opdRaizId).join("\n")).toBe(regenerado);
  });
});
