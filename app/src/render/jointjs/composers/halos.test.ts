import { describe, expect, test } from "bun:test";
import type { Apariencia, Entidad, Modelo } from "../../../modelo/tipos";
import { jointCanvasPalette } from "../palette";
import { proyectarEntidad } from "./entidad";
import { proyectarHaloSeleccion, proyectarHaloSeleccionEstado, proyectarHaloSimulacionEntidadInvolucrada, refResaltaEntidad, refResaltaEnlace } from "./halos";

describe("composer halos", () => {
  test("proyecta seleccion Codex como underline crimson sin redibujar borde", () => {
    const cell = proyectarHaloSeleccion("opd-1", apariencia, entidad);
    const body = (cell.attrs as Record<string, unknown>).body as Record<string, unknown>;

    expect(cell.id).toBe("seleccion-ap-1");
    expect(cell.type).toBe("standard.Path");
    expect(cell.position).toEqual({ x: 28, y: 65 });
    expect(cell.size).toEqual({ width: 119, height: 2 });
    expect(body).toMatchObject({
      d: "M 0 1 L 119 1",
      fill: "none",
      stroke: jointCanvasPalette.seleccion,
      strokeWidth: 1.2,
      pointerEvents: "none",
    });
    expect(body).not.toHaveProperty("rx");
    expect(body).not.toHaveProperty("ry");
    expect(cell.opm).toEqual({ kind: "selection-halo", opdId: "opd-1", targetId: "ent-1" });
  });

  test("proyecta seleccion de estado como underline crimson bajo la capsula", () => {
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

    const cell = proyectarHaloSeleccionEstado(modelo, "opd-1", apariencia, modelo.estados["est-1"]!);
    if (!cell) throw new Error("Fixture invalido");
    const body = (cell.attrs as Record<string, unknown>).body as Record<string, unknown>;

    expect(cell.id).toBe("seleccion-estado-ap-1-est-1");
    expect(cell.type).toBe("standard.Path");
    expect(body.stroke).toBe(jointCanvasPalette.seleccion);
    expect(body.strokeWidth).toBe(1.2);
    expect(body.fill).toBe("none");
    expect(cell.opm).toEqual({ kind: "selection-halo", opdId: "opd-1", targetId: "est-1", targetKind: "estado" });
  });

  test("ui-forja/08 §5.2: variante hover es underline 1px crimson opacity 0.5", () => {
    const cell = proyectarHaloSeleccion("opd-1", apariencia, entidad, "hover");
    const body = (cell.attrs as Record<string, unknown>).body as Record<string, unknown>;

    expect(body).toMatchObject({
      fill: "none",
      stroke: jointCanvasPalette.seleccion,
      strokeWidth: 1,
      opacity: 0.5,
      pointerEvents: "none",
    });
    expect(body).not.toHaveProperty("rx");
  });

  test("ui-forja/08 §5.1: variante seleccion (default) es 1.2px opaca sin opacity", () => {
    const cell = proyectarHaloSeleccion("opd-1", apariencia, entidad);
    const body = (cell.attrs as Record<string, unknown>).body as Record<string, unknown>;
    expect(body.strokeWidth).toBe(1.2);
    expect(body).not.toHaveProperty("opacity");
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

  test("simulacion: halo de objeto involucrado cubre la geometria renderizada con estados", () => {
    const modelo = modeloConEstadosVisibles();
    const objeto = modelo.entidades[entidad.id]!;
    const entidadCell = proyectarEntidad(modelo, "opd-1", apariencia, objeto, false, false, {});
    const halo = proyectarHaloSimulacionEntidadInvolucrada(modelo, "opd-1", apariencia, objeto, {});
    const sizeEntidad = entidadCell.size as { width: number; height: number };

    expect(sizeEntidad.height).toBeGreaterThan(apariencia.height);
    expect(halo.position).toEqual({ x: apariencia.x - 5, y: apariencia.y - 5 });
    expect(halo.size).toEqual({ width: sizeEntidad.width + 10, height: sizeEntidad.height + 10 });
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

function modeloConEstadosVisibles(): Modelo {
  return {
    id: "m",
    nombre: "m",
    opdRaizId: "opd-1",
    opds: {
      "opd-1": {
        id: "opd-1",
        nombre: "SD",
        padreId: null,
        apariencias: { [apariencia.id]: apariencia },
        enlaces: {},
      },
    },
    entidades: { [entidad.id]: entidad },
    estados: {
      "est-1": { id: "est-1", entidadId: entidad.id, nombre: "recibida" },
      "est-2": { id: "est-2", entidadId: entidad.id, nombre: "validada" },
    },
    enlaces: {},
    nextSeq: 1,
  };
}
