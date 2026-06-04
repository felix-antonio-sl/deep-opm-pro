import { describe, expect, test } from "bun:test";
import type { Entidad } from "../modelo/tipos";
import { validarDesignacionesEstado, validarDuracionEstado, validarEstados } from "./validarEstados";

const entidades: Record<string, Entidad> = {
  "e-1": { id: "e-1", tipo: "objeto", nombre: "Pedido", esencia: "informacional", afiliacion: "sistemica" },
};

describe("validarEstados", () => {
  test("acepta estados con designaciones y duracion", () => {
    const resultado = validarEstados({
      "s-1": { id: "s-1", entidadId: "e-1", nombre: "pendiente", designaciones: ["inicial"], duracion: { unidad: "s", min: 1, nominal: 5, max: 10 } },
      "s-2": { id: "s-2", entidadId: "e-1", nombre: "aprobado", designaciones: ["final"] },
    }, entidades);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value["s-1"]?.designaciones).toEqual(["inicial"]);
    expect(resultado.value["s-1"]?.duracion?.nominal).toBe(5);
  });

  test("rechaza default y current simultaneos", () => {
    const resultado = validarDesignacionesEstado("s-1", ["default", "current"]);

    expect(resultado.ok).toBe(false);
  });

  test("permite inicial y final simultaneos", () => {
    const resultado = validarDesignacionesEstado("s-1", ["inicial", "final"]);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value).toEqual(["inicial", "final"]);
  });

  test("rechaza duracion con orden invalido", () => {
    const resultado = validarDuracionEstado("s-1", { unidad: "s", min: 5, nominal: 1, max: 10 });

    expect(resultado.ok).toBe(false);
  });

  test("legacy sin designaciones ni duracion carga sin error", () => {
    const resultado = validarEstados({
      "s-1": { id: "s-1", entidadId: "e-1", nombre: "abierto" },
      "s-2": { id: "s-2", entidadId: "e-1", nombre: "cerrado" },
    }, entidades);

    expect(resultado.ok).toBe(true);
  });

  // V16-2: `orden` no estaba en la whitelist y se perdia al reimportar — los badges
  // caian al desempate alfabetico por id en vez del orden declarado/reordenado.
  test("preserva orden explicito y rechaza orden no numerico", () => {
    const ok = validarEstados({
      "s-1": { id: "s-1", entidadId: "e-1", nombre: "abierto", orden: 0 },
      "s-2": { id: "s-2", entidadId: "e-1", nombre: "cerrado", orden: 1 },
    }, entidades);
    expect(ok.ok).toBe(true);
    if (!ok.ok) return;
    expect(ok.value["s-1"]?.orden).toBe(0);
    expect(ok.value["s-2"]?.orden).toBe(1);

    const mal = validarEstados({
      "s-1": { id: "s-1", entidadId: "e-1", nombre: "abierto", orden: "primero" },
      "s-2": { id: "s-2", entidadId: "e-1", nombre: "cerrado" },
    }, entidades);
    expect(mal.ok).toBe(false);
  });
});
