import { beforeEach, describe, expect, test } from "bun:test";
import { exportarModelo } from "../serializacion/json";
import { definirProbabilidadesAbanico, formarAbanico } from "../modelo/abanicos";
import { crearAutoInvocacion } from "../modelo/autoinvocacion";
import { extremoEntidad, extremoEstado } from "../modelo/extremos";
import { crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso } from "../modelo/operaciones";
import { compartirAnclaExtremosEnlaces } from "../modelo/operaciones/ports";
import type { Modelo, Resultado } from "../modelo/tipos";
import { store } from "../store";
import { normalizarVelocidadSimulacion } from "./simulacion";

describe("headless simulacion", () => {
  beforeEach(() => {
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
    for (let i = 0; i < 805; i += 1) store.getState().ejecutarPasoSimulacion();

    expect(store.getState().contextoSimulacion?.estado).toBe("bloqueado");
    expect(store.getState().autoAvanceSimulacionActivo).toBe(false);
    expect(store.getState().mensaje).toContain("límite");
  });
});

describe("resolución XOR inline", () => {
  function modeloConXor(): { modelo: Modelo; veredictoId: string; ramas: string[]; estados: string[] } {
    let m = crearModelo("XOR inline");
    m = must(crearProceso(m, m.opdRaizId, { x: 0, y: 0 }, "Decidir"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 300, y: 0 }, "Veredicto"));
    const decidir = Object.values(m.entidades).find((e) => e.nombre === "Decidir")!.id;
    const veredicto = Object.values(m.entidades).find((e) => e.nombre === "Veredicto")!.id;
    m = must(crearEstadosIniciales(m, veredicto)).modelo;
    const [s1, s2] = Object.values(m.estados).filter((s) => s.entidadId === veredicto).map((s) => s.id);
    m = must(crearEnlace(m, m.opdRaizId, extremoEntidad(decidir), extremoEstado(s1!), "resultado"));
    m = must(crearEnlace(m, m.opdRaizId, extremoEntidad(decidir), extremoEstado(s2!), "resultado"));
    const ramas = Object.keys(m.enlaces);
    m = must(compartirAnclaExtremosEnlaces(m, m.opdRaizId, ramas, "origen", "E"));
    m = must(formarAbanico(m, m.opdRaizId, ramas, "XOR"));
    const abanicoId = Object.keys(m.abanicos ?? {})[0]!;
    m = must(definirProbabilidadesAbanico(m, abanicoId, { [ramas[0]!]: 0.7, [ramas[1]!]: 0.3 }));
    return { modelo: m, veredictoId: veredicto, ramas, estados: [s1!, s2!] };
  }

  beforeEach(() => {
    // El describe anterior deja el store DENTRO del modo simulación (singleton):
    // sin salir, iniciarModoSimulacion haría early-return sobre el modelo viejo.
    store.getState().salirModoSimulacion();
    store.getState().importarJson(exportarModelo(crearModelo()));
  });

  test("resolverRamaSimulacionActual aplica la transición de la rama elegida", () => {
    const { modelo, veredictoId, ramas, estados } = modeloConXor();
    store.getState().importarJson(exportarModelo(modelo));
    store.getState().iniciarModoSimulacion();

    // La rama de menor probabilidad: el modo determinista NUNCA la elegiría solo.
    store.getState().resolverRamaSimulacionActual(ramas[1]!);

    const fin = store.getState().contextoSimulacion;
    expect(fin?.estadosCurrent[veredictoId]).toBe(estados[1]!);
    expect(fin?.trace).toHaveLength(1);
    expect(fin?.estado).toBe("completado");
  });

  test("un enlace ajeno al abanico del paso actual es no-op", () => {
    const { modelo } = modeloConXor();
    store.getState().importarJson(exportarModelo(modelo));
    store.getState().iniciarModoSimulacion();
    const antes = store.getState().contextoSimulacion;

    store.getState().resolverRamaSimulacionActual("enlace-inexistente");

    expect(store.getState().contextoSimulacion).toBe(antes);
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
