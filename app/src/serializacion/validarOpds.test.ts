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
});
