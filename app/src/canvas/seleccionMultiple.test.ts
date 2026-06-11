import { describe, expect, test } from "bun:test";
import { crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso } from "../modelo/operaciones";
import type { Modelo, Resultado } from "../modelo/tipos";
import { agregar, enlacesInternosSeleccion, interseccionRectangulo, todasDelOpd, toggle, vacia } from "./seleccionMultiple";

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

  test("enlacesInternosSeleccion retorna solo enlaces cuyos extremos están seleccionados", () => {
    const modelo = modeloConEnlacesInternos();
    const ids = Object.values(modelo.entidades);
    const a = ids.find((entidad) => entidad.nombre === "A")!.id;
    const b = ids.find((entidad) => entidad.nombre === "B")!.id;
    const c = ids.find((entidad) => entidad.nombre === "C")!.id;
    const internos = enlacesInternosSeleccion(modelo, modelo.opdRaizId, [a, b, c]);
    const nombres = internos.map((id) => modelo.enlaces[id]!.etiqueta).sort();
    expect(nombres).toEqual(["A-B", "A-C"]);
  });
});

function modeloBase(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 50, y: 50 }, "Todo"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 50 }, "Hacer"));
  const [objeto, proceso] = Object.values(modelo.entidades);
  if (!objeto || !proceso) throw new Error("fixture inválido");
  // R-OPD-EST-3: el objeto afectado debe declarar estados.
  modelo = must(crearEstadosIniciales(modelo, objeto.id)).modelo;
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, proceso.id, objeto.id, "efecto"));
  return modelo;
}

function modeloConEnlacesInternos(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 50, y: 50 }, "A"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 240, y: 50 }, "B"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 430, y: 50 }, "C"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 620, y: 50 }, "D"));
  const entidad = (nombre: string) => Object.values(modelo.entidades).find((item) => item.nombre === nombre)!.id;
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad("A"), entidad("B"), "agregacion", "A-B"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad("A"), entidad("C"), "agregacion", "A-C"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad("B"), entidad("D"), "agregacion", "B-D"));
  return modelo;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
