import { describe, expect, test } from "bun:test";
import { crearEstadosIniciales, crearModelo, crearObjeto, desplegarObjeto } from "../../../modelo/operaciones";
import type { Apariencia, Entidad, Modelo, Resultado } from "../../../modelo/tipos";
import { proyectarImagenesEntidad } from "./imagenOverlay";

describe("imagenOverlay", () => {
  test("renderiza overlay e insignia en modo imagen-texto", () => {
    const { modelo, apariencia, entidad } = modeloConImagen("imagen-texto");

    const cells = proyectarImagenesEntidad(modelo, modelo.opdRaizId, apariencia, entidad);

    expect(cells.map((cell) => cell.opm.kind)).toEqual(["imagen-overlay", "imagen-insignia"]);
    expect(cells[0]?.id).toBe(`${apariencia.id}-imagen-overlay`);
    expect(((cells[0]?.attrs as Attrs)?.imagen as Attrs)?.href).toBe("https://example.com/a.png");
    expect(((cells[1]?.attrs as Attrs)?.label as Attrs)?.text).toBe("📷");
  });

  test("modo texto solo renderiza insignia", () => {
    const { modelo, apariencia, entidad } = modeloConImagen("texto");

    expect(proyectarImagenesEntidad(modelo, modelo.opdRaizId, apariencia, entidad).map((cell) => cell.opm.kind))
      .toEqual(["imagen-insignia"]);
  });

  test("suprime overlay si hay refinamiento o estados visibles", () => {
    let caso = modeloConImagen("imagen");
    let modelo = must(desplegarObjeto(caso.modelo, caso.modelo.opdRaizId, caso.entidad.id)).modelo;
    let entidad = modelo.entidades[caso.entidad.id]!;
    expect(proyectarImagenesEntidad(modelo, modelo.opdRaizId, caso.apariencia, entidad).map((cell) => cell.opm.kind))
      .toEqual(["imagen-insignia"]);

    caso = modeloConImagen("imagen");
    modelo = must(crearEstadosIniciales(caso.modelo, caso.entidad.id)).modelo;
    entidad = modelo.entidades[caso.entidad.id]!;
    expect(proyectarImagenesEntidad(modelo, modelo.opdRaizId, caso.apariencia, entidad).map((cell) => cell.opm.kind))
      .toEqual(["imagen-insignia"]);
  });
});

type Attrs = Record<string, unknown>;

function modeloConImagen(modo: NonNullable<Entidad["imagen"]>["modo"]): { modelo: Modelo; apariencia: Apariencia; entidad: Entidad } {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 20 }, "Objeto"));
  const entidadBase = Object.values(modelo.entidades)[0]!;
  const entidad: Entidad = {
    ...entidadBase,
    imagen: { url: "https://example.com/a.png", modo },
  };
  modelo = { ...modelo, entidades: { ...modelo.entidades, [entidad.id]: entidad } };
  const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0]!;
  return { modelo, apariencia, entidad };
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
