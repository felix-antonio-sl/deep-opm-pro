import { describe, expect, test } from "bun:test";
import { crearEstadosIniciales, crearModelo, crearObjeto, estadosDeEntidad, renombrarEstado } from "../../../modelo/operaciones";
import type { Apariencia, Modelo, Resultado } from "../../../modelo/tipos";
import { anchoCapsulaEstado, dimensionesConEstados, puntoCapsulaEstado } from "./estados";

describe("composer estados", () => {
  test("dimensiona capsulas con minimo y layout horizontal", () => {
    expect(anchoCapsulaEstado("ok")).toBe(52);
    expect(anchoCapsulaEstado("estado extremadamente largo")).toBeGreaterThan(150);

    const size = dimensionesConEstados(apariencia, "Pedido", [
      { id: "s1", entidadId: "obj-1", nombre: "pendiente" },
      { id: "s2", entidadId: "obj-1", nombre: "cerrado" },
    ], "horizontal");

    expect(size.width).toBeGreaterThanOrEqual(135);
    expect(size.height).toBe(100);
  });

  test("calcula punto absoluto de capsula de estado visible", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Pedido"));
    const entidad = Object.values(modelo.entidades)[0];
    if (!entidad) throw new Error("Entidad no encontrada");
    modelo = must(crearEstadosIniciales(modelo, entidad.id)).modelo;
    const [estado] = estadosDeEntidad(modelo, entidad.id);
    if (!estado) throw new Error("Estado no encontrado");
    modelo = must(renombrarEstado(modelo, estado.id, "pendiente"));
    const ap = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
    if (!ap) throw new Error("Apariencia no encontrada");

    const punto = puntoCapsulaEstado(modelo, ap, estado.id);

    expect(punto?.x).toBeGreaterThan(ap.x);
    expect(punto?.y).toBeGreaterThan(ap.y);
  });
});

const apariencia: Apariencia = {
  id: "ap-1",
  entidadId: "obj-1",
  opdId: "opd-1",
  x: 80,
  y: 90,
  width: 135,
  height: 60,
};

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
