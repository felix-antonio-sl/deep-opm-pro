import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import type { AnclaNormativa, Modelo, Resultado } from "../modelo/tipos";
import { exportarContextoSkill } from "./contextoSkill";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

const NOW = new Date("2026-06-09T12:00:00Z");

function anclaPendiente(): AnclaNormativa {
  return {
    id: "an-1",
    claveProto: "ratificar:convenio-ges",
    target: { tipo: "modelo" },
    estado: "pendiente-ratificacion",
    nota: "convenio GES vigente",
    ratificacion: { nivelAutoridad: "mesa", estadoRatificacion: "pendiente" },
  };
}

function modeloConTodo(): Modelo {
  let modelo = crearModelo("HODOM demo");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 40 }, "Paciente"));
  return {
    ...modelo,
    procedencia: { protoHash: "f0bb7875", autoriaVersion: "1", layoutVersion: "2" },
    anclasNormativas: { "an-1": anclaPendiente() },
  };
}

describe("exportarContextoSkill — puente W6.0 app → skill", () => {
  test("compone las cuatro secciones: procedencia, pendientes, diagnóstico y OPL", () => {
    const md = exportarContextoSkill(modeloConTodo(), NOW);

    expect(md.startsWith("# Contexto de modelado — HODOM demo")).toBe(true);
    expect(md).toContain("## Procedencia");
    expect(md).toContain("## Pendientes [RATIFICAR]");
    expect(md).toContain("## Diagnóstico");
    expect(md).toContain("## OPL");
    // Orden: el OPL al final (la sección más larga; el contexto accionable primero).
    expect(md.indexOf("## Procedencia")).toBeLessThan(md.indexOf("## Pendientes [RATIFICAR]"));
    expect(md.indexOf("## Pendientes [RATIFICAR]")).toBeLessThan(md.indexOf("## Diagnóstico"));
    expect(md.indexOf("## Diagnóstico")).toBeLessThan(md.indexOf("## OPL"));
  });

  test("la procedencia expone el sello de 3 componentes (post-G2)", () => {
    const md = exportarContextoSkill(modeloConTodo(), NOW);
    expect(md).toContain("`f0bb7875`");
    expect(md).toContain("autoriaVersion");
    expect(md).toContain("layoutVersion");
    expect(md).not.toContain("glosarioHash");
  });

  test("sin sello de procedencia lo declara en vez de omitir la sección", () => {
    let modelo = crearModelo("Suelto");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 40 }, "Cosa"));
    const md = exportarContextoSkill(modelo, NOW);
    expect(md).toContain("## Procedencia");
    expect(md).toContain("Sin sello de procedencia");
  });

  test("los pendientes [RATIFICAR] llevan claveProto, autoridad y estado de ratificación", () => {
    const md = exportarContextoSkill(modeloConTodo(), NOW);
    expect(md).toContain("`ratificar:convenio-ges`");
    expect(md).toContain("mesa");
    expect(md).toContain("pendiente");
    expect(md).toContain("convenio GES vigente");
  });

  test("sin pendientes lo declara explícitamente", () => {
    let modelo = crearModelo("Limpio");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 40 }, "Cosa"));
    const md = exportarContextoSkill(modelo, NOW);
    expect(md).toContain("Sin pendientes de ratificación");
  });

  test("el diagnóstico viaja como bloque JSON con fecha determinista inyectada", () => {
    const md = exportarContextoSkill(modeloConTodo(), NOW);
    expect(md).toContain("```json");
    expect(md).toContain('"fecha": "2026-06-09"');
  });

  test("el OPL del modelo completo viaja al final (frases en Markdown inline)", () => {
    const md = exportarContextoSkill(modeloConTodo(), NOW);
    expect(md).toContain("- **Paciente**");
  });

  test("es determinista: dos invocaciones con el mismo now producen el mismo texto", () => {
    const modelo = modeloConTodo();
    expect(exportarContextoSkill(modelo, NOW)).toBe(exportarContextoSkill(modelo, NOW));
  });
});
