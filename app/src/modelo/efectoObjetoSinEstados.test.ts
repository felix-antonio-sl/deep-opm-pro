// B-4 (solicitud upstream hd-opm 2026-06-06): canon §3.15 — un objeto sin
// estados NO puede ser afectado (solo crearse o consumirse). El checker acusa
// enlaces `efecto` cuyo destino es un objeto con 0 estados; sugiere re-firma a
// resultado/consumo o declarar estados.

import { describe, expect, test } from "bun:test";
import { crearAutor } from "../autoria/index";
import { checkEfectoObjetoSinEstados } from "./checkers";

describe("B-4 — efecto sobre objeto sin estados (§3.15)", () => {
  test("acusa un efecto cuyo destino es un objeto SIN estados", () => {
    const a = crearAutor({ id: "x", nombre: "X" });
    a.entidad("p", "proceso", "Procesar", "fisica", "sistemica");
    a.entidad("o", "objeto", "Cosa", "fisica", "sistemica"); // SIN estados
    a.opd("sd0", "SD0", null);
    a.ver("sd0", "p", 0, 0);
    a.ver("sd0", "o", 200, 0);
    a.enlazar("sd0", "p", "o", "efecto");
    const avisos = checkEfectoObjetoSinEstados(a.modelo);
    expect(avisos).toHaveLength(1);
    expect(avisos[0]?.codigo).toBe("EFECTO_OBJETO_SIN_ESTADOS");
    expect(avisos[0]?.entidadId).toBe("o-o");
  });

  test("NO acusa un efecto cuyo destino es un objeto CON estados", () => {
    const a = crearAutor({ id: "y", nombre: "Y" });
    a.entidad("p", "proceso", "Procesar", "fisica", "sistemica");
    a.entidad("o", "objeto", "Cosa", "fisica", "sistemica");
    a.estados("o", ["a", "b"], "a");
    a.opd("sd0", "SD0", null);
    a.ver("sd0", "p", 0, 0);
    a.ver("sd0", "o", 200, 0);
    a.enlazar("sd0", "p", "o", "efecto", { entrada: "a", salida: "b" });
    expect(checkEfectoObjetoSinEstados(a.modelo)).toHaveLength(0);
  });

  test("NO acusa resultado/consumo hacia objeto sin estados (solo efecto)", () => {
    const a = crearAutor({ id: "z", nombre: "Z" });
    a.entidad("p", "proceso", "Procesar", "fisica", "sistemica");
    a.entidad("o", "objeto", "Salida", "fisica", "sistemica"); // SIN estados, OK para resultado
    a.opd("sd0", "SD0", null);
    a.ver("sd0", "p", 0, 0);
    a.ver("sd0", "o", 200, 0);
    a.enlazar("sd0", "p", "o", "resultado");
    expect(checkEfectoObjetoSinEstados(a.modelo)).toHaveLength(0);
  });
});
