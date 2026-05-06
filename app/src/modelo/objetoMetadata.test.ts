import { describe, expect, test } from "bun:test";
import { crearEstadosIniciales, crearModelo, crearObjeto } from "./operaciones";
import { cambiarModoImagen, editarImagen, quitarImagen } from "./objetoMetadata";
import type { Modelo, Resultado } from "./tipos";

describe("objetoMetadata imagen", () => {
  test("edita, cambia modo y quita imagen de objeto", () => {
    let modelo = modeloConObjeto();
    const entidadId = Object.keys(modelo.entidades)[0]!;

    modelo = must(editarImagen(modelo, entidadId, { url: "https://example.com/a.png", modo: "imagen-texto" }));
    expect(modelo.entidades[entidadId]?.imagen).toMatchObject({ url: "https://example.com/a.png", modo: "imagen-texto" });

    modelo = must(cambiarModoImagen(modelo, entidadId, "imagen"));
    expect(modelo.entidades[entidadId]?.imagen?.modo).toBe("imagen");

    modelo = must(quitarImagen(modelo, entidadId));
    expect(modelo.entidades[entidadId]?.imagen).toBeUndefined();
  });

  test("fuerza modo texto si el objeto tiene estados visibles", () => {
    let modelo = modeloConObjeto();
    const entidadId = Object.keys(modelo.entidades)[0]!;
    modelo = must(crearEstadosIniciales(modelo, entidadId)).modelo;

    modelo = must(editarImagen(modelo, entidadId, { url: "https://example.com/a.png", modo: "imagen" }));

    expect(modelo.entidades[entidadId]?.imagen?.modo).toBe("texto");
  });
});

function modeloConObjeto(): Modelo {
  return must(crearObjeto(crearModelo(), "opd-1", { x: 0, y: 0 }, "Objeto"));
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
