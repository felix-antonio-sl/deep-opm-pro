import { describe, expect, test } from "bun:test";
import type { Entidad, Estado } from "../../modelo/tipos";
import { formatearAliasInline, formatearDuracion, formatearUnidadInline, nombreEstadoOpl, oracionesUnidadDescripcionEstados } from "./duracionMetadata";

describe("duracionMetadata OPL", () => {
  test("formatearDuracion conserva plantilla JOYAS vigente", () => {
    const estado: Estado = { id: "s1", entidadId: "e1", nombre: "cargado", duracion: { unidad: "s", min: 1, nominal: 5, max: 10 } };
    expect(formatearDuracion(estado)).toBe("1, 5, y 10 s Duracion Minima, Esperada y Maxima de `cargado`, respectivamente.");
  });

  test("nombreEstadoOpl incluye designaciones en parentesis", () => {
    const estado: Estado = { id: "s1", entidadId: "e1", nombre: "abierto", designaciones: ["inicial", "final"] };
    expect(nombreEstadoOpl(estado)).toBe("`abierto` (inicial y final)");
  });

  test("alias y unidad mantienen formato inline actual", () => {
    const entidad: Entidad = { id: "e1", tipo: "objeto", nombre: "Temperatura", esencia: "informacional", afiliacion: "sistemica", alias: "T", unidad: "°C" };
    expect(formatearAliasInline(entidad)).toBe(" {T}");
    expect(formatearUnidadInline(entidad)).toBe("[°C]");
  });

  test("descripcion de entidad no se emite como sentencia OPL nuclear", () => {
    const entidad: Entidad = { id: "e1", tipo: "objeto", nombre: "Temperatura", esencia: "informacional", afiliacion: "sistemica", descripcion: "Metadata externa." };
    expect(oracionesUnidadDescripcionEstados(entidad, [])).toEqual([]);
  });
});
