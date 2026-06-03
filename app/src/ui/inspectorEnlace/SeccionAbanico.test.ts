import { describe, expect, test } from "bun:test";
import { formarAbanico } from "../../modelo/abanicos";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "../../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../../modelo/tipos";
import { modeloEditorProbabilidadesAbanico } from "./SeccionAbanico";

describe("SeccionAbanico · editor de probabilidades XOR", () => {
  test("deriva filas por rama y valida suma 100%", () => {
    const { modelo, enlaces } = modeloConFanXor(["A", "B", "C"]);
    const abanico = Object.values(modelo.abanicos ?? {})[0];
    if (!abanico) throw new Error("La prueba esperaba abanico");

    const editor = modeloEditorProbabilidadesAbanico(modelo, abanico, {
      [enlaces[0]!]: "20",
      [enlaces[1]!]: "30",
      [enlaces[2]!]: "50",
    });

    expect(editor.filas.map((fila) => fila.etiqueta)).toEqual(["A", "B", "C"]);
    expect(editor.suma).toBe(100);
    expect(editor.error).toBeNull();
    expect(editor.pesos).toEqual({
      [enlaces[0]!]: 0.2,
      [enlaces[1]!]: 0.3,
      [enlaces[2]!]: 0.5,
    });
  });

  test("expone error cuando los porcentajes no suman 100", () => {
    const { modelo, enlaces } = modeloConFanXor(["A", "B"]);
    const abanico = Object.values(modelo.abanicos ?? {})[0];
    if (!abanico) throw new Error("La prueba esperaba abanico");

    const editor = modeloEditorProbabilidadesAbanico(modelo, abanico, {
      [enlaces[0]!]: "70",
      [enlaces[1]!]: "70",
    });

    expect(editor.suma).toBe(140);
    expect(editor.error).toContain("100");
    expect(editor.pesos).toBeNull();
  });

  test("un abanico sin probabilidades aun no muestra error", () => {
    const { modelo } = modeloConFanXor(["A", "B"]);
    const abanico = Object.values(modelo.abanicos ?? {})[0];
    if (!abanico) throw new Error("La prueba esperaba abanico");

    const editor = modeloEditorProbabilidadesAbanico(modelo, abanico);

    expect(editor.suma).toBe(0);
    expect(editor.error).toBeNull();
    expect(editor.pesos).toBeNull();
  });
});

function modeloConFanXor(nombres: string[]): { modelo: Modelo; enlaces: Id[] } {
  let modelo = crearModelo();
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 40, y: 80 }, "P"));
  const procesoId = entidad(modelo, "P");
  for (const [index, nombre] of nombres.entries()) {
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 20 + index * 100 }, nombre));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesoId, entidad(modelo, nombre), "resultado"));
  }
  const enlaces = Object.keys(modelo.enlaces);
  modelo = fijarPuertoCompartido(modelo, enlaces);
  modelo = must(formarAbanico(modelo, modelo.opdRaizId, enlaces, "XOR"));
  return { modelo, enlaces };
}

function fijarPuertoCompartido(modelo: Modelo, enlaceIds: Id[]): Modelo {
  const enlaces = { ...modelo.enlaces };
  for (const enlaceId of enlaceIds) {
    const enlace = enlaces[enlaceId];
    if (!enlace || enlace.origenId.kind !== "entidad") continue;
    enlaces[enlaceId] = { ...enlace, origenId: { ...enlace.origenId, portId: "port-test-origen" } };
  }
  return { ...modelo, enlaces };
}

function entidad(modelo: Modelo, nombre: string): Id {
  const encontrada = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!encontrada) throw new Error(`Entidad no encontrada: ${nombre}`);
  return encontrada.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
