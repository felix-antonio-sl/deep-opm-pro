// Testigo ejecutable del ejemplo Lumbre publicado en docs/manual-software-opm.md.
// La ley evita que el manual enseñe OPL que el parser acepte solo en apariencia:
// exige parseo atómico, modelo válido y roundtrip sobre un modelo fresco.
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
const FUENTE = resolve(RAIZ_REPO, "docs/ejemplos/lumbre-reservas.opl");
const MANUAL = resolve(RAIZ_REPO, "docs/manual-software-opm.md");
const lineas = readFileSync(FUENTE, "utf8").trim().split("\n");
const manual = readFileSync(MANUAL, "utf8");

function importarOpl(texto: string): Modelo {
  const base = crearModelo("Lumbre");
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

function esperarFormaLumbre(modelo: Modelo): void {
  expect(Object.keys(modelo.entidades)).toHaveLength(13);
  expect(Object.keys(modelo.enlaces)).toHaveLength(16);
  expect(Object.keys(modelo.estados)).toHaveLength(10);
  expect(validarModelo(modelo, modelo.opdRaizId)).toEqual([]);
}

describe("manual de software · ejemplo Lumbre", () => {
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

  test("cada línea expresa exactamente una oración OPL soportada", () => {
    expect(lineas).toHaveLength(32);
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

  test("el parser conserva nombres y condiciones con estado", () => {
    expect(
      parsearParrafoOpl(
        "*Aprobación de reserva* cambia **Permiso** de `pendiente` a `habilitado`.",
      ).ast[0],
    ).toMatchObject({
      kind: "procedimental",
      tipoEnlace: "efecto",
      proceso: "Aprobación de reserva",
      objeto: "Permiso",
      estadoEntrada: "pendiente",
      estadoSalida: "habilitado",
    });
    expect(
      parsearParrafoOpl(
        "*Confirmación de reserva* cambia **Solicitud** de `pendiente` a `confirmada`.",
      ).ast[0],
    ).toMatchObject({
      objeto: "Solicitud",
      estadoEntrada: "pendiente",
      estadoSalida: "confirmada",
    });
    expect(
      parsearParrafoOpl(
        "*Aprobación de reserva* ocurre si **Sala** está en `restringida`, de lo contrario *Aprobación de reserva* se omite.",
      ).ast[0],
    ).toMatchObject({
      kind: "condicion",
      proceso: "Aprobación de reserva",
      condicionante: "Sala",
      condicionanteEstado: "restringida",
      base: "instrumento",
    });
  });

  test("importa, valida y reimporta sin pérdida semántica", () => {
    const inicial = importarOpl(lineas.join("\n"));
    esperarFormaLumbre(inicial);

    const regenerado = generarOpl(inicial, inicial.opdRaizId).join("\n");
    const roundtrip = importarOpl(regenerado);
    esperarFormaLumbre(roundtrip);
    expect(generarOpl(roundtrip, roundtrip.opdRaizId).join("\n")).toBe(regenerado);
  });
});
