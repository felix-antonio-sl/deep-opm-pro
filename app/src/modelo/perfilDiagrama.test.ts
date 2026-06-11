import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "./operaciones";
import { perfilCanonDiagrama } from "./perfilDiagrama";
import type { Modelo, Resultado } from "./tipos";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function modeloConApariencias(cantidad: number): Modelo {
  let modelo = crearModelo("Perfil");
  for (let i = 0; i < cantidad; i += 1) {
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: i * 10, y: 0 }, `Objeto ${i}`));
  }
  return modelo;
}

describe("perfilCanonDiagrama", () => {
  test("clasifica OPDs densos con umbral canon-diagrama", () => {
    expect(perfilCanonDiagrama(modeloConApariencias(20), "opd-1").estado).toBe("ok");
    expect(perfilCanonDiagrama(modeloConApariencias(21), "opd-1").estado).toBe("advertencia");
    expect(perfilCanonDiagrama(modeloConApariencias(26), "opd-1").estado).toBe("bloqueado");
  });
});
