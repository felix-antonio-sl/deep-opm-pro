import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso, sincronizarPuertosEnlaces } from "./operaciones";
import type { Modelo, Resultado } from "./tipos";

describe("puertos dinámicos OPCloud-style", () => {
  test("crearEnlace asigna portId por extremo y ports relativos en apariencias", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 20 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 20 }, "Procesar"));

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada"), entidad(modelo, "Procesar"), "consumo"));
    modelo = sincronizarPuertosEnlaces(modelo, modelo.opdRaizId);

    const enlace = Object.values(modelo.enlaces)[0]!;
    expect(enlace.origenId.portId).toBe("port-e-5-origen");
    expect(enlace.destinoId.portId).toBe("port-e-5-destino");

    const origen = apariencia(modelo, "Entrada");
    const destino = apariencia(modelo, "Procesar");
    expect(origen.ports?.[enlace.origenId.portId!]).toEqual({ x: 1, y: 0.5 });
    expect(destino.ports?.[enlace.destinoId.portId!]).toEqual({ x: 0, y: 0.5 });
  });
});

function entidad(modelo: Modelo, nombre: string): string {
  const encontrada = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  expect(encontrada).toBeDefined();
  return encontrada!.id;
}

function apariencia(modelo: Modelo, nombre: string) {
  const entidadId = entidad(modelo, nombre);
  const encontrada = Object.values(modelo.opds[modelo.opdRaizId]!.apariencias).find((item) => item.entidadId === entidadId);
  expect(encontrada).toBeDefined();
  return encontrada!;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
