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
});
