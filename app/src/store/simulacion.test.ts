import { beforeEach, describe, expect, test } from "bun:test";
import { exportarModelo } from "../serializacion/json";
import { crearAutoInvocacion } from "../modelo/autoinvocacion";
import { crearModelo, crearProceso } from "../modelo/operaciones";
import type { Resultado } from "../modelo/tipos";
import { store } from "../store";
import { normalizarVelocidadSimulacion } from "./simulacion";

describe("headless simulacion", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        length: 0,
        key: () => null,
        getItem: () => null,
        setItem: () => undefined,
        removeItem: () => undefined,
        clear: () => undefined,
      },
    });
    store.getState().importarJson(exportarModelo(crearModelo()));
    // Reset UI-only sim flags between tests
    if (store.getState().headlessSimulacion) store.getState().alternarHeadlessSimulacion();
  });

  test("headlessSimulacion inicia en false", () => {
    expect(store.getState().headlessSimulacion).toBe(false);
  });

  test("alternarHeadlessSimulacion lo pone en true", () => {
    store.getState().alternarHeadlessSimulacion();
    expect(store.getState().headlessSimulacion).toBe(true);
  });

  test("llamar dos veces vuelve a false", () => {
    store.getState().alternarHeadlessSimulacion();
    store.getState().alternarHeadlessSimulacion();
    expect(store.getState().headlessSimulacion).toBe(false);
  });
});

describe("simulacion bloqueada", () => {
  beforeEach(() => {
    store.getState().importarJson(exportarModelo(crearModelo()));
  });

  test("autoavance se detiene si un loop alcanza el limite de seguridad", () => {
    let modelo = crearModelo("Loop store");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Reintentar"));
    const procesoId = Object.values(modelo.entidades).find((e) => e.nombre === "Reintentar")?.id;
    if (!procesoId) throw new Error("La prueba esperaba un proceso");
    modelo = must(crearAutoInvocacion(modelo, modelo.opdRaizId, procesoId));
    store.getState().importarJson(exportarModelo(modelo));

    store.getState().iniciarModoSimulacion();
    store.getState().iniciarAutoAvanceSimulacion();
    for (let i = 0; i < 201; i += 1) store.getState().ejecutarPasoSimulacion();

    expect(store.getState().contextoSimulacion?.estado).toBe("bloqueado");
    expect(store.getState().autoAvanceSimulacionActivo).toBe(false);
    expect(store.getState().mensaje).toContain("límite");
  });
});

describe("normalizarVelocidadSimulacion", () => {
  test("clamp continuo al rango [0.25, 4]", () => {
    expect(normalizarVelocidadSimulacion(0.25)).toBe(0.25);
    expect(normalizarVelocidadSimulacion(4)).toBe(4);
    expect(normalizarVelocidadSimulacion(1.7)).toBe(1.7);
  });
  test("recorta fuera de rango a los extremos", () => {
    expect(normalizarVelocidadSimulacion(0.1)).toBe(0.25);
    expect(normalizarVelocidadSimulacion(10)).toBe(4);
  });
  test("NaN cae a 1; ±Infinity al extremo correspondiente", () => {
    expect(normalizarVelocidadSimulacion(Number.NaN)).toBe(1);
    expect(normalizarVelocidadSimulacion(Number.POSITIVE_INFINITY)).toBe(4);
    expect(normalizarVelocidadSimulacion(Number.NEGATIVE_INFINITY)).toBe(1);
  });
});

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
