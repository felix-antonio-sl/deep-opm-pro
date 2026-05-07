import { describe, expect, test } from "bun:test";
import type { Enlace, Modelo } from "../modelo/tipos";
import { crearModelo } from "../modelo/operaciones";
import { familiaDeTipoEnlace, reglaTraerPorFamilias, tiposDeFamilia } from "./reglasTraer";

describe("reglasTraer", () => {
  test("mapea familias canónicas a tipos del kernel actual", () => {
    expect(tiposDeFamilia("procedural-habilitador")).toEqual(["agente", "instrumento"]);
    expect(tiposDeFamilia("procedural-transformador")).toEqual(["consumo", "efecto", "resultado"]);
    expect(tiposDeFamilia("estructural")).toEqual(["agregacion", "exhibicion", "generalizacion", "clasificacion"]);
    expect(tiposDeFamilia("direccional")).toEqual([]);
  });

  test("retorna entidades y enlace cuando la familia coincide", () => {
    const modelo = modeloConEntidades();
    const enlace: Enlace = {
      id: "e-1",
      tipo: "instrumento",
      origenId: { kind: "entidad", id: "o-1" },
      destinoId: { kind: "entidad", id: "p-1" },
      etiqueta: "",
    };
    expect(reglaTraerPorFamilias(modelo, enlace, ["procedural-habilitador"])).toEqual({
      entidades: ["o-1", "p-1"],
      enlaces: ["e-1"],
    });
    expect(reglaTraerPorFamilias(modelo, enlace, ["estructural"])).toEqual({ entidades: [], enlaces: [] });
  });

  test("familiaDeTipoEnlace conserva no-op para direccional ausente", () => {
    expect(familiaDeTipoEnlace("resultado")).toBe("procedural-transformador");
    expect(familiaDeTipoEnlace("agregacion")).toBe("estructural");
    expect(familiaDeTipoEnlace("invocacion")).toBeNull();
  });
});

function modeloConEntidades(): Modelo {
  return {
    ...crearModelo(),
    entidades: {
      "o-1": { id: "o-1", tipo: "objeto", nombre: "Objeto", esencia: "informacional", afiliacion: "sistemica" },
      "p-1": { id: "p-1", tipo: "proceso", nombre: "Proceso", esencia: "informacional", afiliacion: "sistemica" },
    },
  };
}
