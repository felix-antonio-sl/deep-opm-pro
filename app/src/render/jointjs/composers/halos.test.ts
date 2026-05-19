import { describe, expect, test } from "bun:test";
import type { Apariencia, Entidad, Modelo } from "../../../modelo/tipos";
import { jointCanvasPalette } from "../palette";
import { proyectarHaloSeleccion, refResaltaEntidad, refResaltaEnlace } from "./halos";

describe("composer halos", () => {
  test("proyecta halo azul de seleccion multi con metadata estable", () => {
    const cell = proyectarHaloSeleccion("opd-1", apariencia, entidad);
    const body = (cell.attrs as Record<string, unknown>).body as Record<string, unknown>;

    expect(cell.id).toBe("seleccion-ap-1");
    expect(body.stroke).toBe(jointCanvasPalette.seleccion);
    expect(body.strokeWidth).toBe(2);
    expect(cell.opm).toEqual({ kind: "selection-halo", opdId: "opd-1", targetId: "ent-1" });
  });

  test("resuelve hover OPL para entidad, estado y enlace", () => {
    const modelo: Modelo = {
      id: "m",
      nombre: "m",
      opdRaizId: "opd-1",
      opds: {},
      entidades: { "ent-1": entidad },
      estados: { "est-1": { id: "est-1", entidadId: "ent-1", nombre: "listo" } },
      enlaces: {},
      nextSeq: 1,
    };

    expect(refResaltaEntidad(modelo, entidad, { tipo: "entidad", id: "ent-1" })).toBe(true);
    expect(refResaltaEntidad(modelo, entidad, { tipo: "estado", id: "est-1" })).toBe(true);
    expect(refResaltaEnlace({ id: "en-1", tipo: "consumo", origenId: { kind: "entidad", id: "a" }, destinoId: { kind: "entidad", id: "b" }, etiqueta: "" }, { tipo: "enlace", id: "en-1" })).toBe(true);
  });
});

const apariencia: Apariencia = {
  id: "ap-1",
  entidadId: "ent-1",
  opdId: "opd-1",
  x: 20,
  y: 30,
  width: 135,
  height: 60,
};

const entidad: Entidad = {
  id: "ent-1",
  tipo: "objeto",
  nombre: "Orden",
  esencia: "informacional",
  afiliacion: "sistemica",
};
