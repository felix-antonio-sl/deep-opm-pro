import { describe, expect, test } from "bun:test";
import { anclasDe } from "./anclasNormativas";
import { crearModelo } from "./operaciones";
import type { AnclaNormativa, Modelo } from "./tipos";

// W6.4: `anclasDe` unifica la consulta por TargetAncla (4 niveles) para que el
// Inspector proyecte las anclas del componente seleccionado sin ramificar por tipo.

function modeloConAnclas(anclas: AnclaNormativa[]): Modelo {
  return {
    ...crearModelo("AnclasKernel"),
    anclasNormativas: Object.fromEntries(anclas.map((ancla) => [ancla.id, ancla])),
  };
}

function ancla(parcial: Partial<AnclaNormativa> & Pick<AnclaNormativa, "id" | "claveProto" | "target">): AnclaNormativa {
  return { estado: "vigente", ...parcial };
}

describe("anclasDe — consulta unificada por TargetAncla (W6.4)", () => {
  const fixture = modeloConAnclas([
    ancla({ id: "an-2", claveProto: "ancla:frontera-art17", target: { tipo: "entidad", id: "ent-1" } }),
    ancla({ id: "an-1", claveProto: "ancla:requisitos", target: { tipo: "entidad", id: "ent-1" } }),
    ancla({ id: "an-3", claveProto: "ancla:convenio", target: { tipo: "enlace", id: "enl-1" } }),
    ancla({ id: "an-4", claveProto: "ancla:vista-causal", target: { tipo: "opd", id: "opd-1" } }),
    ancla({ id: "an-5", claveProto: "ratificar:convenio-ges", target: { tipo: "modelo" }, estado: "pendiente-ratificacion" }),
  ]);

  test("target entidad devuelve solo sus anclas, en orden estable por id", () => {
    const resultado = anclasDe(fixture, { tipo: "entidad", id: "ent-1" });
    expect(resultado.map((a) => a.id)).toEqual(["an-1", "an-2"]);
  });

  test("target enlace y target opd filtran por su id", () => {
    expect(anclasDe(fixture, { tipo: "enlace", id: "enl-1" }).map((a) => a.id)).toEqual(["an-3"]);
    expect(anclasDe(fixture, { tipo: "opd", id: "opd-1" }).map((a) => a.id)).toEqual(["an-4"]);
  });

  test("target modelo devuelve las anclas modelo-nivel", () => {
    expect(anclasDe(fixture, { tipo: "modelo" }).map((a) => a.id)).toEqual(["an-5"]);
  });

  test("modelo sin extensión de anclas devuelve []", () => {
    expect(anclasDe(crearModelo("Vacio"), { tipo: "modelo" })).toEqual([]);
    expect(anclasDe(crearModelo("Vacio"), { tipo: "entidad", id: "ent-1" })).toEqual([]);
  });

  test("un id presente en otro tipo de target no se cruza (entidad ≠ opd)", () => {
    const cruzado = modeloConAnclas([
      ancla({ id: "an-1", claveProto: "ancla:x", target: { tipo: "opd", id: "mismo-id" } }),
    ]);
    expect(anclasDe(cruzado, { tipo: "entidad", id: "mismo-id" })).toEqual([]);
  });
});
