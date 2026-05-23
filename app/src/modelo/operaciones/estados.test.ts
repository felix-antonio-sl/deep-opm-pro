import { describe, expect, test } from "bun:test";
import { agregarEstado, crearEstadosIniciales, crearModelo, crearObjeto, estadosDeEntidad, reordenarEstado } from "../operaciones";
import type { Modelo, Resultado } from "../tipos";

/**
 * Tests de `reordenarEstado` (operación nueva del paquete "Estados como
 * ciudadanos de primera clase", 2026-05-23). Cubre bounds, idempotencia,
 * preservación de designaciones, normalización de `orden` y aislamiento
 * por objeto propietario.
 *
 * Refs: docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md §6, §9.
 */

function debeOk<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(`Esperaba ok, recibí: ${resultado.error}`);
  return resultado.value;
}

function sembrarObjetoCon3Estados(nombreObjeto = "Caso"): { modelo: Modelo; objetoId: string; estadoIds: [string, string, string] } {
  let modelo = crearModelo();
  modelo = debeOk(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, nombreObjeto));
  const objetoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === nombreObjeto)!.id;
  const iniciales = debeOk(crearEstadosIniciales(modelo, objetoId));
  modelo = iniciales.modelo;
  const tercero = debeOk(agregarEstado(modelo, objetoId, "tercero"));
  modelo = tercero.modelo;
  return { modelo, objetoId, estadoIds: [iniciales.estadoIds[0], iniciales.estadoIds[1], tercero.estadoId] };
}

describe("operaciones/estados — reordenarEstado", () => {
  test("mueve un estado hacia adelante y normaliza el orden", () => {
    const { modelo, objetoId, estadoIds } = sembrarObjetoCon3Estados();
    const [primero, , tercero] = estadoIds;
    const resultado = debeOk(reordenarEstado(modelo, primero, 2));

    const orden = estadosDeEntidad(resultado, objetoId).map((estado) => estado.id);
    expect(orden).toEqual([estadoIds[1], tercero, primero]);

    // Todos los estados quedan con `orden` normalizado 0..N-1.
    expect(resultado.estados[estadoIds[1]]?.orden).toBe(0);
    expect(resultado.estados[tercero]?.orden).toBe(1);
    expect(resultado.estados[primero]?.orden).toBe(2);
  });

  test("mueve un estado hacia atrás", () => {
    const { modelo, objetoId, estadoIds } = sembrarObjetoCon3Estados();
    const [, , tercero] = estadoIds;
    const resultado = debeOk(reordenarEstado(modelo, tercero, 0));

    const orden = estadosDeEntidad(resultado, objetoId).map((estado) => estado.id);
    expect(orden).toEqual([tercero, estadoIds[0], estadoIds[1]]);
  });

  test("idempotente: mismo índice retorna el mismo modelo", () => {
    const { modelo, estadoIds } = sembrarObjetoCon3Estados();
    const resultado = debeOk(reordenarEstado(modelo, estadoIds[0], 0));
    expect(resultado).toBe(modelo);
  });

  test("falla con índice negativo", () => {
    const { modelo, estadoIds } = sembrarObjetoCon3Estados();
    const resultado = reordenarEstado(modelo, estadoIds[0], -1);
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toMatch(/fuera de rango/);
  });

  test("falla con índice >= length", () => {
    const { modelo, estadoIds } = sembrarObjetoCon3Estados();
    const resultado = reordenarEstado(modelo, estadoIds[0], 3);
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toMatch(/fuera de rango/);
  });

  test("falla con índice no entero", () => {
    const { modelo, estadoIds } = sembrarObjetoCon3Estados();
    const resultado = reordenarEstado(modelo, estadoIds[0], 1.5);
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toMatch(/inválido/);
  });

  test("falla cuando el estado no existe", () => {
    const { modelo } = sembrarObjetoCon3Estados();
    const resultado = reordenarEstado(modelo, "s-inexistente", 0);
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toMatch(/no existe/);
  });

  test("preserva el orden de hermanos no movidos", () => {
    const { modelo, objetoId, estadoIds } = sembrarObjetoCon3Estados();
    const resultado = debeOk(reordenarEstado(modelo, estadoIds[1], 2));

    const orden = estadosDeEntidad(resultado, objetoId).map((estado) => estado.id);
    expect(orden).toEqual([estadoIds[0], estadoIds[2], estadoIds[1]]);
  });

  test("no afecta a estados de otros objetos", () => {
    const seed = sembrarObjetoCon3Estados();
    let modelo = debeOk(crearObjeto(seed.modelo, seed.modelo.opdRaizId, { x: 200, y: 0 }, "Otro"));
    const segundoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Otro")!.id;
    const inicialesB = debeOk(crearEstadosIniciales(modelo, segundoId));
    modelo = inicialesB.modelo;

    const resultado = debeOk(reordenarEstado(modelo, seed.estadoIds[0], 2));
    const ordenA = estadosDeEntidad(resultado, seed.objetoId).map((estado) => estado.id);
    expect(ordenA[2]).toBe(seed.estadoIds[0]);

    const ordenB = estadosDeEntidad(resultado, segundoId).map((estado) => estado.id);
    expect(ordenB).toEqual([inicialesB.estadoIds[0], inicialesB.estadoIds[1]]);
  });

  test("preserva designaciones del estado movido", () => {
    const { modelo, objetoId, estadoIds } = sembrarObjetoCon3Estados();
    // Marca el primer estado como inicial antes de reordenar.
    const conInicial = { ...modelo, estados: { ...modelo.estados, [estadoIds[0]]: { ...modelo.estados[estadoIds[0]]!, esInicial: true } } };
    const resultado = debeOk(reordenarEstado(conInicial, estadoIds[0], 2));
    expect(resultado.estados[estadoIds[0]]?.esInicial).toBe(true);
    // El resto no debe ganar la designación.
    expect(resultado.estados[estadoIds[1]]?.esInicial).toBeUndefined();
    expect(resultado.estados[estadoIds[2]]?.esInicial).toBeUndefined();
    // Verifica orden final usando view.
    const orden = estadosDeEntidad(resultado, objetoId).map((estado) => estado.id);
    expect(orden[2]).toBe(estadoIds[0]);
  });
});
