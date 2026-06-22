import { describe, expect, test } from "bun:test";
import type { Entidad } from "../modelo/tipos";
import { validarModoDespliegue, validarOpds, validarRefinamiento } from "./validarOpds";

const entidades: Record<string, Entidad> = {
  "e-1": { id: "e-1", tipo: "objeto", nombre: "Sistema", esencia: "fisica", afiliacion: "sistemica" },
};

describe("validarOpds", () => {
  test("acepta OPD raiz SD", () => {
    const resultado = validarOpds({
      "opd-1": { id: "opd-1", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} },
    }, entidades);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value["opd-1"]?.nombre).toBe("SD");
  });

  test("rechaza padreId con tipo invalido", () => {
    const resultado = validarOpds({
      "opd-1": { id: "opd-1", nombre: "SD", padreId: 42, apariencias: {}, enlaces: {} },
    }, entidades);

    expect(resultado.ok).toBe(false);
  });

  test("preserva ordenInzoom valido (bandas de ids)", () => {
    const resultado = validarOpds({
      "opd-1": { id: "opd-1", nombre: "SD", padreId: null, apariencias: {}, enlaces: {}, ordenInzoom: [["p-a", "p-b"], ["p-c"]] },
    }, entidades);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value["opd-1"]?.ordenInzoom).toEqual([["p-a", "p-b"], ["p-c"]]);
  });

  test("rechaza ordenInzoom que no es arreglo de bandas", () => {
    const resultado = validarOpds({
      "opd-1": { id: "opd-1", nombre: "SD", padreId: null, apariencias: {}, enlaces: {}, ordenInzoom: ["p-a", "p-b"] },
    }, entidades);
    expect(resultado.ok).toBe(false);
  });

  test("rechaza ordenInzoom con elemento no-string en una banda", () => {
    const resultado = validarOpds({
      "opd-1": { id: "opd-1", nombre: "SD", padreId: null, apariencias: {}, enlaces: {}, ordenInzoom: [["p-a", 7]] },
    }, entidades);
    expect(resultado.ok).toBe(false);
  });

  test("rechaza ordenInzoom con id duplicado entre bandas (anticadena rota)", () => {
    const resultado = validarOpds({
      "opd-1": { id: "opd-1", nombre: "SD", padreId: null, apariencias: {}, enlaces: {}, ordenInzoom: [["p-a"], ["p-a"]] },
    }, entidades);
    expect(resultado.ok).toBe(false);
  });

  test("acepta refinamiento por descomposicion", () => {
    const resultado = validarRefinamiento("p-1", { tipo: "descomposicion", opdId: "opd-2" });

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value).toEqual({ tipo: "descomposicion", opdId: "opd-2" });
  });

  test("acepta despliegue con modo agregacion", () => {
    const resultado = validarRefinamiento("e-1", { tipo: "despliegue", opdId: "opd-2", modo: "agregacion" });

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value?.modo).toBe("agregacion");
  });

  test("modo despliegue legacy asume agregacion", () => {
    const resultado = validarModoDespliegue("e-1", undefined);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value).toBe("agregacion");
  });

  // D7.1: capa de pizarra / bocetos. Validador LAXO aditivo opcional.
  function opdConBocetos(bocetos: unknown) {
    return validarOpds({
      "opd-1": { id: "opd-1", nombre: "SD", padreId: null, apariencias: {}, enlaces: {}, bocetos },
    }, entidades);
  }

  test("bocetos ausentes ⇒ OPD sin la clave (byte-identidad legacy)", () => {
    const r = validarOpds({
      "opd-1": { id: "opd-1", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} },
    }, entidades);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect("bocetos" in r.value["opd-1"]!).toBe(false);
  });

  test("bocetos `{}` vacíos colapsan a undefined (no inflan el OPD)", () => {
    const r = opdConBocetos({});
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.value["opd-1"]?.bocetos).toBeUndefined();
  });

  test("acepta bocetos válidos de los cuatro tipos (geometría laxa)", () => {
    const r = opdConBocetos({
      "bz-1": { id: "bz-1", tipo: "forma", x: 1, y: 2, w: 3, h: 4, texto: "x", estilo: { color: "#f00", grosor: 2 } },
      "bz-2": { id: "bz-2", tipo: "flecha", puntos: [{ x: 0, y: 0 }, { x: 5, y: 6 }] },
      "bz-3": { id: "bz-3", tipo: "texto", texto: "solo texto" },
      "bz-4": { id: "bz-4", tipo: "nota" },
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(Object.keys(r.value["opd-1"]?.bocetos ?? {})).toEqual(["bz-1", "bz-2", "bz-3", "bz-4"]);
    expect(r.value["opd-1"]?.bocetos?.["bz-2"]?.puntos).toEqual([{ x: 0, y: 0 }, { x: 5, y: 6 }]);
  });

  test("rechaza ruidoso un tipo de boceto ilegal", () => {
    const r = opdConBocetos({ "bz-1": { id: "bz-1", tipo: "garabato" } });
    expect(r.ok).toBe(false);
  });

  test("rechaza ruidoso id incoherente con la clave del Record", () => {
    const r = opdConBocetos({ "bz-1": { id: "OTRO", tipo: "forma" } });
    expect(r.ok).toBe(false);
  });

  test("rechaza ruidoso geometría presente con tipo equivocado (x no-numérica)", () => {
    const r = opdConBocetos({ "bz-1": { id: "bz-1", tipo: "forma", x: "diez" } });
    expect(r.ok).toBe(false);
  });

  test("rechaza ruidoso puntos malformados", () => {
    const r = opdConBocetos({ "bz-1": { id: "bz-1", tipo: "flecha", puntos: [{ x: 0 }] } });
    expect(r.ok).toBe(false);
  });
});
