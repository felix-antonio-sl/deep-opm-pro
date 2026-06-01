import { describe, expect, test } from "bun:test";
import { claveHecho, conjunto, type Hecho } from "./tipos";

const hEntidad: Hecho = {
  tipo: "entidad",
  entidadId: "o1",
  clase: "objeto",
  esencia: "informacional",
  afiliacion: "sistemica",
};
const hEstado: Hecho = {
  tipo: "estado",
  entidadId: "o1",
  estadoId: "s1",
  nombre: "abierto",
  designaciones: ["inicial"],
};
const hEnlace: Hecho = {
  tipo: "enlace",
  enlaceId: "e1",
  clase: "efecto",
  origen: { kind: "entidad", id: "p1" },
  destino: { kind: "estado", id: "s1" },
};

describe("hechos/tipos: clave estructural", () => {
  test("claveHecho es determinista y discrimina por valor", () => {
    expect(claveHecho(hEntidad)).toBe(claveHecho({ ...hEntidad }));
    expect(claveHecho(hEntidad)).not.toBe(claveHecho({ ...hEntidad, afiliacion: "ambiental" }));
    expect(claveHecho(hEstado)).not.toBe(claveHecho(hEnlace));
  });

  test("designaciones no dependen del orden", () => {
    const a: Hecho = { ...hEstado, designaciones: ["inicial", "final"] };
    const b: Hecho = { ...hEstado, designaciones: ["final", "inicial"] };
    expect(claveHecho(a)).toBe(claveHecho(b));
  });

  test("conjunto deduplica por clave estructural", () => {
    const c = conjunto([hEntidad, { ...hEntidad }, hEstado]);
    expect(c.size).toBe(2);
  });

  test("conjunto guarda copias de valores estructurales mutables", () => {
    const estadoMutable: Hecho = { ...hEstado, designaciones: ["inicial"] };
    const c = conjunto([estadoMutable]);
    estadoMutable.designaciones = ["final"];
    const almacenado = [...c.values()][0]!;
    expect(almacenado).toMatchObject({ tipo: "estado", designaciones: ["inicial"] });
  });
});
