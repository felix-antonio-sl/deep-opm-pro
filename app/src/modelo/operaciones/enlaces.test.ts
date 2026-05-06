import { describe, expect, test } from "bun:test";
import { extremoEntidad } from "../extremos";
import { crearEnlace, crearModelo, crearObjeto, crearProceso, moverPuertoEnlace } from "../operaciones";
import type { Modelo, Resultado } from "../tipos";

describe("operaciones/enlaces", () => {
  test("moverPuertoEnlace cambia extremo y mantiene seleccionable el enlace", () => {
    let modelo = modeloBase();
    const enlaceId = Object.keys(modelo.enlaces)[0];
    const destinoNuevo = entidad(modelo, "Validar");
    if (!enlaceId) throw new Error("La prueba esperaba enlace");

    modelo = must(moverPuertoEnlace(modelo, enlaceId, "destino", extremoEntidad(destinoNuevo)));

    expect(modelo.enlaces[enlaceId]?.destinoId).toEqual(extremoEntidad(destinoNuevo));
    expect(modelo.enlaces[enlaceId]).toBeDefined();
  });

  test("moverPuertoEnlace remueve relacion cuando se solicita", () => {
    let modelo = modeloBase();
    const enlaceId = Object.keys(modelo.enlaces)[0];
    if (!enlaceId) throw new Error("La prueba esperaba enlace");

    modelo = must(moverPuertoEnlace(modelo, enlaceId, "destino", extremoEntidad(entidad(modelo, "Validar")), true));

    expect(modelo.enlaces[enlaceId]).toBeUndefined();
    expect(Object.values(modelo.opds[modelo.opdRaizId]?.enlaces ?? {}).some((apariencia) => apariencia.enlaceId === enlaceId)).toBe(false);
  });
});

function modeloBase(): Modelo {
  let modelo = crearModelo("Mover puerto");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Entrada"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 80 }, "Procesar"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 420, y: 80 }, "Validar"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada"), entidad(modelo, "Procesar"), "consumo"));
  return modelo;
}

function entidad(modelo: Modelo, nombre: string): string {
  const item = Object.values(modelo.entidades).find((entidadActual) => entidadActual.nombre === nombre);
  if (!item) throw new Error(`Entidad no encontrada: ${nombre}`);
  return item.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
