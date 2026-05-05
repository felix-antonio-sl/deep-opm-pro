import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto } from "./operaciones";
import { etiquetaEnlaceNormalizada, renombrarEtiquetaEnlace, validarEtiquetaEnlace } from "./etiquetasEnlace";
import type { Modelo, Resultado } from "./tipos";

describe("etiquetas de enlace", () => {
  test("renombra etiqueta con trim sin cambiar identidad del enlace", () => {
    let modelo = modeloConAgregacion();
    const enlaceId = Object.keys(modelo.enlaces)[0];
    if (!enlaceId) throw new Error("La prueba esperaba enlace");

    modelo = must(renombrarEtiquetaEnlace(modelo, enlaceId, "  componente crítico  "));

    expect(modelo.enlaces[enlaceId]?.etiqueta).toBe("componente crítico");
    expect(modelo.enlaces[enlaceId]?.id).toBe(enlaceId);
  });

  test("permite etiqueta vacía para agregación como tag opcional", () => {
    const modelo = modeloConAgregacion();
    const enlace = Object.values(modelo.enlaces)[0];
    if (!enlace) throw new Error("La prueba esperaba enlace");

    expect(etiquetaEnlaceNormalizada("   ")).toBe("");
    expect(validarEtiquetaEnlace(enlace, "")).toEqual({ ok: true, value: true });
  });
});

function modeloConAgregacion(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Todo"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 180, y: 0 }, "Parte"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Todo"), entidad(modelo, "Parte"), "agregacion"));
  return modelo;
}

function entidad(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
