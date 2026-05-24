import { describe, expect, test } from "bun:test";
import { designarInicial } from "../estadosDesignaciones";
import { crearEstadosIniciales, crearModelo, crearObjeto } from "../operaciones";
import type { Id, Modelo, Resultado } from "../tipos";
import { estadosInicialesDelModelo } from "./foco";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`No existe entidad ${nombre}`);
  return entidad.id;
}

describe("estadosInicialesDelModelo", () => {
  test("sin designaciones devuelve lista vacia", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    modelo = must(crearEstadosIniciales(modelo, entidadPorNombre(modelo, "Pedido"))).modelo;
    expect(estadosInicialesDelModelo(modelo)).toEqual([]);
  });

  test("deriva solo los estados designados inicial", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    const estados = must(crearEstadosIniciales(modelo, entidadPorNombre(modelo, "Pedido")));
    modelo = estados.modelo;
    const [pendienteId] = estados.estadoIds;
    modelo = must(designarInicial(modelo, pendienteId));

    expect(estadosInicialesDelModelo(modelo)).toEqual([pendienteId]);
  });
});
