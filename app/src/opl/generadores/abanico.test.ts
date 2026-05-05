import { describe, expect, test } from "bun:test";
import type { Modelo } from "../../modelo/tipos";
import { oracionAbanico } from "./abanico";

describe("abanico OPL", () => {
  test("OR emite al menos uno de", () => {
    const modelo = modeloBase("O");
    expect(oracionAbanico(modelo, modelo.abanicos!.ab1!)).toBe("*Procesar* consume al menos uno de **Entrada A** y **Entrada B**.");
  });

  test("XOR emite exactamente uno de", () => {
    const modelo = modeloBase("XOR");
    expect(oracionAbanico(modelo, modelo.abanicos!.ab1!)).toBe("*Procesar* consume exactamente uno de **Entrada A** y **Entrada B**.");
  });
});

function modeloBase(operador: "O" | "XOR"): Modelo {
  return {
    id: "m1",
    nombre: "M",
    opdRaizId: "opd",
    opds: { opd: { id: "opd", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} } },
    entidades: {
      proceso: { id: "proceso", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
      a: { id: "a", tipo: "objeto", nombre: "Entrada A", esencia: "informacional", afiliacion: "sistemica" },
      b: { id: "b", tipo: "objeto", nombre: "Entrada B", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {
      l1: { id: "l1", tipo: "consumo", origenId: { kind: "entidad", id: "a" }, destinoId: { kind: "entidad", id: "proceso" }, etiqueta: "" },
      l2: { id: "l2", tipo: "consumo", origenId: { kind: "entidad", id: "b" }, destinoId: { kind: "entidad", id: "proceso" }, etiqueta: "" },
    },
    abanicos: { ab1: { id: "ab1", opdId: "opd", puertoEntidadId: "proceso", operador, enlaceIds: ["l1", "l2"] } },
    nextSeq: 1,
  };
}
