import { describe, expect, test } from "bun:test";
import { extremoEstado } from "../modelo/extremos";
import { crearEstadosIniciales, crearModelo, crearObjeto, crearProceso } from "../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../modelo/tipos";
import { previewOpl, tiposPendientes } from "./MenuTipoEnlace";

describe("MenuTipoEnlace", () => {
  test("ofrece consumo cuando el origen pendiente es un Estado", () => {
    const { modelo, estado } = modeloConEstado();

    const tipos = tiposPendientes(modelo, extremoEstado(estado)).map((item) => item.tipo);

    expect(tipos).toContain("consumo");
  });

  test("previsualiza resultado Proceso -> Estado usando la capsula estado", () => {
    const { modelo, estado, proceso } = modeloConEstado();

    expect(previewOpl(modelo, "resultado", proceso, extremoEstado(estado)))
      .toBe("*Procesar* genera **Orden [estado1]**.");
  });

  test("previsualiza consumo Estado -> Proceso usando la capsula estado", () => {
    const { modelo, estado, proceso } = modeloConEstado();

    expect(previewOpl(modelo, "consumo", extremoEstado(estado), proceso))
      .toBe("*Procesar* consume **Orden [estado1]**.");
  });
});

function modeloConEstado(): { modelo: Modelo; objeto: Id; estado: Id; proceso: Id } {
  let modelo = crearModelo("Menu enlace con estado");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Orden"));
  const objeto = entidadPorNombre(modelo, "Orden");
  const estados = must(crearEstadosIniciales(modelo, objeto));
  modelo = estados.modelo;
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Procesar"));
  return {
    modelo,
    objeto,
    estado: estados.estadoIds[0],
    proceso: entidadPorNombre(modelo, "Procesar"),
  };
}

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
