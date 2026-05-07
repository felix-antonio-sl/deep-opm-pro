import { describe, expect, test } from "bun:test";
import type { Apariencia, AparienciaEnlace, Enlace, Entidad, Modelo } from "../../modelo/tipos";
import { oracionPlegadoParcial } from "./plegado";

describe("plegado OPL", () => {
  test("plegado parcial lista partes visibles", () => {
    const modelo = modeloConPartes(2);
    expect(oracionPlegadoParcial(modelo, modelo.opds.opd!.apariencias.ap!, modelo.entidades.padre!))
      .toBe("**Vehiculo** se lista con **Parte 1** y **Parte 2** como rasgos.");
  });

  test("plegado parcial trunca sobre umbral", () => {
    const modelo = modeloConPartes(5);
    expect(oracionPlegadoParcial(modelo, modelo.opds.opd!.apariencias.ap!, modelo.entidades.padre!))
      .toBe("**Vehiculo** se lista con **Parte 1**, **Parte 2** y **Parte 3** y 2 partes más como rasgos.");
  });
});

function modeloConPartes(cantidad: number): Modelo {
  const entidades: Record<string, Entidad> = {
    padre: { id: "padre", tipo: "objeto" as const, nombre: "Vehiculo", esencia: "informacional" as const, afiliacion: "sistemica" as const, refinamientos: { despliegue: { opdId: "hijo" } } },
  };
  const apariencias: Record<string, Apariencia> = {
    contorno: { id: "contorno", entidadId: "padre", opdId: "hijo", x: 0, y: 0, width: 500, height: 250 },
  };
  const enlaces: Record<string, Enlace> = {};
  const aparienciasEnlace: Record<string, AparienciaEnlace> = {};

  for (let index = 1; index <= cantidad; index += 1) {
    const id = `p${index}`;
    entidades[id] = { id, tipo: "objeto", nombre: `Parte ${index}`, esencia: "informacional", afiliacion: "sistemica" };
    apariencias[id] = { id: `a-${id}`, entidadId: id, opdId: "hijo", x: 20 + index * 40, y: 40, width: 40, height: 40 };
    enlaces[`l${index}`] = { id: `l${index}`, tipo: "agregacion", origenId: { kind: "entidad", id: "padre" }, destinoId: { kind: "entidad", id }, etiqueta: "" };
    aparienciasEnlace[`al${index}`] = { id: `al${index}`, enlaceId: `l${index}`, opdId: "hijo", vertices: [] };
  }

  return {
    id: "m1",
    nombre: "M",
    opdRaizId: "opd",
    opds: {
      opd: {
        id: "opd",
        nombre: "SD",
        padreId: null,
        apariencias: { ap: { id: "ap", entidadId: "padre", opdId: "opd", x: 0, y: 0, width: 200, height: 120, modoPlegado: "parcial" } },
        enlaces: {},
      },
      hijo: { id: "hijo", nombre: "SD1", padreId: "opd", apariencias, enlaces: aparienciasEnlace },
    },
    entidades,
    estados: {},
    enlaces,
    nextSeq: 1,
  };
}
