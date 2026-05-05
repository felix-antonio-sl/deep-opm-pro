import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "../modelo/operaciones";
import type { Modelo, Resultado } from "../modelo/tipos";
import { agregar, interseccionRectangulo, todasDelOpd, toggle, vacia } from "./seleccionMultiple";

describe("seleccionMultiple", () => {
  test("estado vacío usa modo simple", () => {
    expect(vacia()).toEqual({ seleccionados: [], modo: "simple" });
  });

  test("agregar es idempotente y toggle agrega/quita", () => {
    const inicial = vacia();
    expect(agregar(agregar(inicial, "o-1"), "o-1").seleccionados).toEqual(["o-1"]);
    expect(toggle(toggle(inicial, "o-1"), "o-1").seleccionados).toEqual([]);
  });

  test("todasDelOpd devuelve entidades y enlaces solo del OPD activo", () => {
    const modelo = modeloBase();
    expect(todasDelOpd(modelo, modelo.opdRaizId)).toHaveLength(3);
    expect(todasDelOpd({ ...modelo, opds: { ...modelo.opds, "opd-2": { id: "opd-2", nombre: "SD1", padreId: modelo.opdRaizId, apariencias: {}, enlaces: {} } } }, "opd-2")).toEqual([]);
  });

  test("interseccionRectangulo usa overlap, no contención total", () => {
    const modelo = modeloBase();
    const entidad = Object.values(modelo.entidades)[0]!;
    const ids = interseccionRectangulo(modelo, modelo.opdRaizId, { x: 40, y: 40, width: 20, height: 20 });
    expect(ids).toContain(entidad.id);
  });
});

function modeloBase(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 50, y: 50 }, "Todo"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 50 }, "Hacer"));
  const [objeto, proceso] = Object.values(modelo.entidades);
  if (!objeto || !proceso) throw new Error("fixture inválido");
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, objeto.id, proceso.id, "efecto"));
  return modelo;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
