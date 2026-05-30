import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, descomponerProceso } from "../modelo/operaciones";
import type { Modelo, Resultado } from "../modelo/tipos";
import { exportarOplModeloMarkdown, exportarOplOpdMarkdown } from "./exportarMarkdown";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((e) => e.nombre === nombre);
  if (!entidad) throw new Error(`No existe entidad ${nombre}`);
  return entidad.id;
}

describe("exportarOplOpdMarkdown — OPD en vista", () => {
  test("antepone título # {modelo} — {OPD} y lista las frases como viñetas Markdown", () => {
    let modelo = crearModelo("Demo");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 40 }, "Cosa"));
    const md = exportarOplOpdMarkdown(modelo, modelo.opdRaizId);

    expect(md.startsWith("# Demo — ")).toBe(true);
    // Las frases OPL ya vienen en Markdown inline (**Cosa** ...); cada una es viñeta.
    expect(md).toContain("\n- **Cosa**");
    expect(md).not.toContain("<"); // nada de HTML
  });

  test("OPD sin frases produce una nota, no una lista vacía", () => {
    const modelo = crearModelo("Vacío");
    const md = exportarOplOpdMarkdown(modelo, modelo.opdRaizId);
    expect(md).toContain("_Sin frases OPL._");
  });
});

describe("exportarOplModeloMarkdown — modelo completo", () => {
  test("encabeza con # {modelo} y emite una sección ## por cada OPD en orden jerárquico", () => {
    let modelo = crearModelo("Sistema");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 60, y: 60 }, "Operar"));
    const descomposicion = must(descomponerProceso(modelo, modelo.opdRaizId, entidadId(modelo, "Operar")));
    modelo = descomposicion.modelo;

    const md = exportarOplModeloMarkdown(modelo);

    expect(md.startsWith("# Sistema\n")).toBe(true);
    // Hay al menos dos OPDs (raíz + descomposición), cada uno con su sección ##.
    const secciones = md.split("\n").filter((linea) => linea.startsWith("## "));
    expect(secciones.length).toBeGreaterThanOrEqual(2);
    expect(md).toContain("*Operar*"); // el proceso aparece en alguna sección
    expect(md).not.toContain("<");
  });
});
