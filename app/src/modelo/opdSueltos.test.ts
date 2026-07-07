import { describe, expect, test } from "bun:test";
import { crearModelo } from "./operaciones/creacion";
import { opdsSueltos, esOpdSuelto } from "./opdSueltos";
import type { Modelo } from "./tipos";

function conOpd(modelo: Modelo, id: string, padreId: string | null): Modelo {
  return { ...modelo, opds: { ...modelo.opds, [id]: { id, nombre: id, padreId, apariencias: {}, enlaces: {} } } };
}

describe("opdsSueltos", () => {
  test("la raíz nunca es suelto aunque tenga padreId null", () => {
    const m = crearModelo("M");
    expect(m.opds[m.opdRaizId].padreId).toBeNull();
    expect(opdsSueltos(m)).toEqual([]);
    expect(esOpdSuelto(m, m.opdRaizId)).toBe(false);
  });

  test("un OPD con padreId null que no es la raíz es suelto", () => {
    const m = conOpd(crearModelo("M"), "opd-suelto", null);
    expect(opdsSueltos(m).map((o) => o.id)).toEqual(["opd-suelto"]);
    expect(esOpdSuelto(m, "opd-suelto")).toBe(true);
  });

  test("un OPD con padre real no es suelto", () => {
    const m = conOpd(crearModelo("M"), "opd-hijo", "opd-1");
    expect(opdsSueltos(m)).toEqual([]);
    expect(esOpdSuelto(m, "opd-hijo")).toBe(false);
  });
});
