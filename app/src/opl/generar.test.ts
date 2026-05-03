import { describe, expect, test } from "bun:test";
import { cambiarEsencia, crearEnlace, crearModelo, crearObjeto, crearProceso } from "../modelo/operaciones";
import type { Modelo, Resultado } from "../modelo/tipos";
import { generarOpl } from "./generar";

describe("generarOpl", () => {
  test("genera OPL para cosas y agente", () => {
    let modelo = crearModelo();
    const objeto = crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Operador");
    expect(objeto.ok).toBe(true);
    if (!objeto.ok) return;
    modelo = objeto.value;

    const proceso = crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 0 }, "Rescatar");
    expect(proceso.ok).toBe(true);
    if (!proceso.ok) return;
    modelo = proceso.value;

    const operador = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Operador");
    const rescatar = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Rescatar");
    expect(operador).toBeDefined();
    expect(rescatar).toBeDefined();
    if (!operador || !rescatar) return;

    const fisico = cambiarEsencia(modelo, operador.id, "fisica");
    expect(fisico.ok).toBe(true);
    if (!fisico.ok) return;
    modelo = fisico.value;

    const enlace = crearEnlace(modelo, modelo.opdRaizId, operador.id, rescatar.id, "agente");
    expect(enlace.ok).toBe(true);
    if (!enlace.ok) return;

    expect(generarOpl(enlace.value)).toContain("**Operador** maneja *Rescatar*.");
  });

  test("genera OPL para enlaces basicos", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Whole"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 180, y: 0 }, "Part"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 120 }, "Instrumento"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 240, y: 120 }, "Proceso"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 420, y: 120 }, "Subproceso"));

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Whole"), entidad(modelo, "Part"), "agregacion"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Instrumento"), entidad(modelo, "Proceso"), "instrumento"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Proceso"), entidad(modelo, "Part"), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Proceso"), entidad(modelo, "Subproceso"), "invocacion"));

    const lineas = generarOpl(modelo);
    expect(lineas).toContain("**Whole** consta de **Part**.");
    expect(lineas).toContain("*Proceso* requiere **Instrumento**.");
    expect(lineas).toContain("*Proceso* consume **Part**.");
    expect(lineas).toContain("*Proceso* invoca *Subproceso*.");
  });
});

function entidad(modelo: Modelo, nombre: string): string {
  const encontrado = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  expect(encontrado).toBeDefined();
  if (!encontrado) throw new Error(`Entidad no encontrada: ${nombre}`);
  return encontrado.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
