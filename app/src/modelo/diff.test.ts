import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "./operaciones";
import { diffModelos } from "./diff";

describe("diffModelos", () => {
  test("reporta entidades agregadas y OPD modificado por nueva apariencia", () => {
    const base = crearModelo("Base");
    const siguiente = crearObjeto(base, base.opdRaizId, { x: 10, y: 20 }, "Sistema");
    if (!siguiente.ok) throw new Error(siguiente.error);

    expect(diffModelos(base, siguiente.value)).toEqual([
      { tipo: "agregado", coleccion: "entidades", id: "o-1" },
      { tipo: "modificado", coleccion: "opds", id: base.opdRaizId },
    ]);
  });
});
