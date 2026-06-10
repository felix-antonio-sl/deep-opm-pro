import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "../../modelo/operaciones";
import type { Resultado } from "../../modelo/tipos";
import { debeAutoAbrirModelos, modeloSinContenido } from "./seleccionModelos";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

// Selector de modelos del shell mobile-readonly (cierra el hueco que el propio
// shell declaraba: "la selección de qué modelo se ve se delega a la futura
// capa de tenants/auth" — auth v1 ya existe).

describe("modeloSinContenido — ¿es el SD vacío de sesión?", () => {
  test("modelo recién creado (sin entidades) es vacío", () => {
    expect(modeloSinContenido(crearModelo("Nuevo"))).toBe(true);
  });

  test("modelo con al menos una cosa NO es vacío", () => {
    const conObjeto = must(crearObjeto(crearModelo("Con datos"), crearModelo("x").opdRaizId, { x: 10, y: 10 }, "Cosa"));
    expect(modeloSinContenido(conObjeto)).toBe(false);
  });
});

describe("debeAutoAbrirModelos — auto-switch inicial a la lista", () => {
  test("modelo vacío + hay guardados + sin interacción ⇒ abrir lista", () => {
    expect(debeAutoAbrirModelos({ modeloVacio: true, hayGuardados: true, yaInteractuo: false })).toBe(true);
  });

  test("si el usuario ya navegó, no se le quita el control", () => {
    expect(debeAutoAbrirModelos({ modeloVacio: true, hayGuardados: true, yaInteractuo: true })).toBe(false);
  });

  test("sin modelos guardados no hay nada que abrir", () => {
    expect(debeAutoAbrirModelos({ modeloVacio: true, hayGuardados: false, yaInteractuo: false })).toBe(false);
  });

  test("con un modelo ya cargado (no vacío) se respeta el diagrama", () => {
    expect(debeAutoAbrirModelos({ modeloVacio: false, hayGuardados: true, yaInteractuo: false })).toBe(false);
  });
});
