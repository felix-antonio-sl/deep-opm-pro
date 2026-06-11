import { describe, expect, test } from "bun:test";
import { esAfiliacionEfectivaAmbiental } from "./afiliacionEfectiva";
import { cambiarAfiliacion, crearEnlace, crearModelo, crearObjeto } from "./operaciones";
import type { Id, Modelo, Resultado } from "./tipos";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function idDe(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

describe("afiliación efectiva por cadena estructural (R-OPD-STR-13)", () => {
  function modeloConExhibicion(): Modelo {
    let m = crearModelo("Afiliación");
    m = must(crearObjeto(m, m.opdRaizId, { x: 20, y: 20 }, "Exhibitor"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 20, y: 160 }, "Atributo"));
    m = must(cambiarAfiliacion(m, idDe(m, "Exhibitor"), "ambiental"));
    m = must(crearEnlace(m, m.opdRaizId, idDe(m, "Exhibitor"), idDe(m, "Atributo"), "exhibicion"));
    return m;
  }

  test("el atributo sistémico de un exhibitor ambiental es efectivamente ambiental", () => {
    const m = modeloConExhibicion();
    expect(m.entidades[idDe(m, "Atributo")]?.afiliacion).toBe("sistemica");
    expect(esAfiliacionEfectivaAmbiental(m, idDe(m, "Atributo"))).toBe(true);
  });

  test("hereda transitivamente por cadena de exhibición", () => {
    let m = modeloConExhibicion();
    m = must(crearObjeto(m, m.opdRaizId, { x: 20, y: 300 }, "Subatributo"));
    m = must(crearEnlace(m, m.opdRaizId, idDe(m, "Atributo"), idDe(m, "Subatributo"), "exhibicion"));
    expect(esAfiliacionEfectivaAmbiental(m, idDe(m, "Subatributo"))).toBe(true);
  });

  test("la agregación NO transmite afiliación (la regla cubre atributos/operaciones)", () => {
    let m = crearModelo("Afiliación");
    m = must(crearObjeto(m, m.opdRaizId, { x: 20, y: 20 }, "Todo"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 20, y: 160 }, "Parte"));
    m = must(cambiarAfiliacion(m, idDe(m, "Todo"), "ambiental"));
    m = must(crearEnlace(m, m.opdRaizId, idDe(m, "Todo"), idDe(m, "Parte"), "agregacion"));
    expect(esAfiliacionEfectivaAmbiental(m, idDe(m, "Parte"))).toBe(false);
  });

  test("entidad ambiental directa es efectiva sin cadena", () => {
    let m = crearModelo("Afiliación");
    m = must(crearObjeto(m, m.opdRaizId, { x: 20, y: 20 }, "Solo"));
    m = must(cambiarAfiliacion(m, idDe(m, "Solo"), "ambiental"));
    expect(esAfiliacionEfectivaAmbiental(m, idDe(m, "Solo"))).toBe(true);
  });
});
