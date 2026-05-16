import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "../modelo/operaciones";
import { modeloTieneContenidoVisible } from "./bienvenida";

describe("modeloTieneContenidoVisible", () => {
  test("declara falso para un modelo recien creado sin apariencias ni enlaces", () => {
    expect(modeloTieneContenidoVisible(crearModelo("Inicio"))).toBe(false);
  });

  test("declara verdadero cuando algun OPD ya tiene una apariencia", () => {
    const modelo = crearModelo("Inicio");
    const resultado = crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Cliente");
    if (!resultado.ok) throw new Error(resultado.error);

    expect(modeloTieneContenidoVisible(resultado.value)).toBe(true);
  });
});
