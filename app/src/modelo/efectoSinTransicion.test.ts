// Preocupación operador 2026-06-11: el modelador permite acumular enlaces de
// efecto PLANOS (sin transición de estados) que nunca maduran al par TS3-TS5
// ni a consumo+resultado. El checker hace visible cada efecto sin refinar
// sobre un objeto que SÍ tiene estados; complementa a B-4 (objeto sin estados).

import { describe, expect, test } from "bun:test";
import { crearAutor } from "../autoria/index";
import { checkEfectoSinTransicion } from "./checkers";

describe("EFECTO_SIN_TRANSICION — efecto plano sobre objeto con estados", () => {
  test("acusa un efecto sin transición cuando el objeto tiene estados", () => {
    const a = crearAutor({ id: "x", nombre: "X" });
    a.entidad("p", "proceso", "Procesar", "fisica", "sistemica");
    a.entidad("o", "objeto", "Cosa", "fisica", "sistemica");
    a.estados("o", ["a", "b"], "a");
    a.opd("sd0", "SD0", null);
    a.ver("sd0", "p", 0, 0);
    a.ver("sd0", "o", 200, 0);
    a.enlazar("sd0", "p", "o", "efecto"); // plano: sin entrada/salida
    const avisos = checkEfectoSinTransicion(a.modelo);
    expect(avisos).toHaveLength(1);
    expect(avisos[0]?.codigo).toBe("EFECTO_SIN_TRANSICION");
    expect(avisos[0]?.entidadId).toBe("o-o");
  });

  test("NO acusa un efecto con par de estados declarado (TS3)", () => {
    const a = crearAutor({ id: "y", nombre: "Y" });
    a.entidad("p", "proceso", "Procesar", "fisica", "sistemica");
    a.entidad("o", "objeto", "Cosa", "fisica", "sistemica");
    a.estados("o", ["a", "b"], "a");
    a.opd("sd0", "SD0", null);
    a.ver("sd0", "p", 0, 0);
    a.ver("sd0", "o", 200, 0);
    a.enlazar("sd0", "p", "o", "efecto", { entrada: "a", salida: "b" });
    expect(checkEfectoSinTransicion(a.modelo)).toHaveLength(0);
  });

  test("NO acusa cuando el objeto no tiene estados (territorio de B-4)", () => {
    const a = crearAutor({ id: "z", nombre: "Z" });
    a.entidad("p", "proceso", "Procesar", "fisica", "sistemica");
    a.entidad("o", "objeto", "Cosa", "fisica", "sistemica"); // SIN estados
    a.opd("sd0", "SD0", null);
    a.ver("sd0", "p", 0, 0);
    a.ver("sd0", "o", 200, 0);
    a.enlazar("sd0", "p", "o", "efecto");
    expect(checkEfectoSinTransicion(a.modelo)).toHaveLength(0);
  });

  test("acusa un aviso POR ENLACE: tres efectos planos = tres avisos", () => {
    const a = crearAutor({ id: "w", nombre: "W" });
    a.entidad("p1", "proceso", "Abrir", "fisica", "sistemica");
    a.entidad("p2", "proceso", "Revisar", "fisica", "sistemica");
    a.entidad("p3", "proceso", "Cerrar", "fisica", "sistemica");
    a.entidad("o", "objeto", "Expediente", "informacional", "sistemica");
    a.estados("o", ["abierto", "cerrado"], "abierto");
    a.opd("sd0", "SD0", null);
    a.ver("sd0", "p1", 0, 0);
    a.ver("sd0", "p2", 0, 120);
    a.ver("sd0", "p3", 0, 240);
    a.ver("sd0", "o", 260, 120);
    a.enlazar("sd0", "p1", "o", "efecto");
    a.enlazar("sd0", "p2", "o", "efecto");
    a.enlazar("sd0", "p3", "o", "efecto");
    expect(checkEfectoSinTransicion(a.modelo)).toHaveLength(3);
  });
});
