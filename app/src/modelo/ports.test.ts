import { describe, expect, test } from "bun:test";
import { formarAbanico } from "./abanicos";
import { extremoEstado } from "./extremos";
import {
  actualizarPuertosEnlacesDesdePuntos,
  calcularPuertoRelativo,
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  sincronizarPuertosEnlaces,
} from "./operaciones";
import type { Modelo, Resultado } from "./tipos";

describe("puertos dinámicos OPCloud-style", () => {
  test("crearEnlace asigna portId por extremo y ports relativos en apariencias", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 20 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 20 }, "Procesar"));

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada"), entidad(modelo, "Procesar"), "consumo"));

    const enlace = Object.values(modelo.enlaces)[0]!;
    expect(enlace.origenId.portId).toBe("port-e-5-origen");
    expect(enlace.destinoId.portId).toBe("port-e-5-destino");

    const origen = apariencia(modelo, "Entrada");
    const destino = apariencia(modelo, "Procesar");
    expect(origen.ports?.[enlace.origenId.portId!]).toEqual({ x: 1, y: 0.5 });
    expect(destino.ports?.[enlace.destinoId.portId!]).toEqual({ x: 0, y: 0.5 });
  });

  test("acumula todos los puertos aunque OPCloud los deje en el mismo punto", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 20 }, "Entrada A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 120 }, "Entrada B"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 220 }, "Entrada C"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 420 }, "Procesar"));

    for (const nombre of ["Entrada A", "Entrada B", "Entrada C"]) {
      modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, nombre), entidad(modelo, "Procesar"), "consumo"));
    }
    modelo = sincronizarPuertosEnlaces(modelo, modelo.opdRaizId);

    const destino = apariencia(modelo, "Procesar");
    const portsDestino = Object.values(destino.ports ?? {});
    expect(portsDestino).toHaveLength(3);
    expect(new Set(portsDestino.map((port) => `${port.x.toFixed(4)}:${port.y.toFixed(4)}`)).size).toBe(1);
    expect(portsDestino[0]).toEqual({ x: 0.5, y: 0 });
  });

  test("separa enlaces estructurales con ranuras OPCloud sobre el mismo extremo", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 20 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 20 }, "Parte A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 20 }, "Parte B"));

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Todo"), entidad(modelo, "Parte A"), "agregacion"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Todo"), entidad(modelo, "Parte B"), "agregacion"));
    modelo = sincronizarPuertosEnlaces(modelo, modelo.opdRaizId);

    const todo = apariencia(modelo, "Todo");
    const puertosOrigen = Object.values(modelo.enlaces)
      .map((enlace) => enlace.origenId.portId ? todo.ports?.[enlace.origenId.portId] : undefined)
      .filter((puerto): puerto is { x: number; y: number } => !!puerto);

    expect(puertosOrigen).toHaveLength(2);
    expect(puertosOrigen[0]).toEqual({ x: 1, y: 0.5 });
    expect(puertosOrigen[1]).toEqual({ x: 1, y: 0.6 });
  });

  test("unifica resultados desde un proceso hacia estados del mismo objeto", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 20, y: 20 }, "Procesar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 20 }, "Pedido"));
    const pedidoId = entidad(modelo, "Pedido");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Procesar"), extremoEstado(estados.estadoIds[0]), "resultado"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Procesar"), extremoEstado(estados.estadoIds[1]), "resultado"));
    modelo = sincronizarPuertosEnlaces(modelo, modelo.opdRaizId);

    const portIds = Object.values(modelo.enlaces).map((enlace) => enlace.origenId.portId);
    expect(new Set(portIds).size).toBe(1);
    const proceso = apariencia(modelo, "Procesar");
    expect(proceso.ports?.[portIds[0]!]).toEqual({ x: 1, y: 1 });
  });

  test("unifica consumos desde estados del mismo objeto hacia un proceso", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 20 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 20 }, "Procesar"));
    const pedidoId = entidad(modelo, "Pedido");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;

    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(estados.estadoIds[0]), entidad(modelo, "Procesar"), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(estados.estadoIds[1]), entidad(modelo, "Procesar"), "consumo"));
    modelo = sincronizarPuertosEnlaces(modelo, modelo.opdRaizId);

    const portIds = Object.values(modelo.enlaces).map((enlace) => enlace.destinoId.portId);
    expect(new Set(portIds).size).toBe(1);
    const proceso = apariencia(modelo, "Procesar");
    expect(proceso.ports?.[portIds[0]!]).toEqual({ x: 0, y: 1 });
  });

  test("beautifyConnectedLinks persiste puerto desde punto opuesto real y sincronizacion no lo pisa", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 20 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 20 }, "Procesar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada"), entidad(modelo, "Procesar"), "consumo"));
    modelo = sincronizarPuertosEnlaces(modelo, modelo.opdRaizId);

    const enlaceId = Object.keys(modelo.enlaces)[0]!;
    const ajustado = actualizarPuertosEnlacesDesdePuntos(modelo, modelo.opdRaizId, [{
      enlaceId,
      lado: "origen",
      puntoOpuesto: { x: 87.5, y: 20 },
    }]);
    modelo = must(ajustado);

    const enlace = modelo.enlaces[enlaceId]!;
    const portId = enlace.origenId.portId!;
    expect(apariencia(modelo, "Entrada").ports?.[portId]).toEqual({ x: 0.5, y: 0 });

    const resincronizado = sincronizarPuertosEnlaces(modelo, modelo.opdRaizId);
    expect(apariencia(resincronizado, "Entrada").ports?.[portId]).toEqual({ x: 0.5, y: 0 });
  });

  test("proyecta puertos calculados al borde aunque el punto opuesto caiga dentro del bbox", () => {
    const ap = {
      id: "ap-solapada",
      entidadId: "objeto",
      opdId: "opd",
      x: 100,
      y: 100,
      width: 200,
      height: 100,
    };

    expect(calcularPuertoRelativo(ap, { x: 200, y: 150 })).toEqual({ x: 1, y: 0.5 });
    expect(calcularPuertoRelativo(ap, { x: 150, y: 125 })).toEqual({ x: 0, y: 0 });
  });

  test("resincroniza puertos persistidos que quedaron en el centro de la figura", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 20 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 20 }, "Procesar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada"), entidad(modelo, "Procesar"), "consumo"));
    modelo = sincronizarPuertosEnlaces(modelo, modelo.opdRaizId);

    const enlaceId = Object.keys(modelo.enlaces)[0]!;
    const enlace = modelo.enlaces[enlaceId]!;
    const portId = enlace.origenId.portId!;
    const entrada = apariencia(modelo, "Entrada");
    const opd = modelo.opds[modelo.opdRaizId]!;
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [modelo.opdRaizId]: {
          ...opd,
          apariencias: {
            ...opd.apariencias,
            [entrada.id]: {
              ...entrada,
              ports: {
                ...(entrada.ports ?? {}),
                [portId]: { x: 0.5, y: 0.5 },
              },
            },
          },
        },
      },
    };

    const resincronizado = sincronizarPuertosEnlaces(modelo, modelo.opdRaizId);
    expect(apariencia(resincronizado, "Entrada").ports?.[portId]).toEqual({ x: 1, y: 0.5 });
  });

  test("los enlaces en abanico comparten un puerto de borde en la entidad común", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 20 }, "Entrada A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 300, y: 20 }, "Entrada B"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 250, y: 200 }, "Procesar"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada A"), entidad(modelo, "Procesar"), "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Entrada B"), entidad(modelo, "Procesar"), "consumo"));
    modelo = fijarPuertoCompartidoDestino(modelo, Object.keys(modelo.enlaces));
    modelo = must(formarAbanico(modelo, modelo.opdRaizId, Object.keys(modelo.enlaces), "O"));

    const sincronizado = sincronizarPuertosEnlaces(modelo, modelo.opdRaizId);
    const portIds = Object.values(sincronizado.enlaces).map((enlace) => enlace.destinoId.portId);
    expect(new Set(portIds).size).toBe(1);
    const portId = portIds[0];
    expect(portId).toBeDefined();
    expect(apariencia(sincronizado, "Procesar").ports?.[portId!]).toEqual({ x: 0.5, y: 0 });
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

function fijarPuertoCompartidoDestino(modelo: Modelo, enlaceIds: string[]): Modelo {
  const enlaces = { ...modelo.enlaces };
  for (const enlaceId of enlaceIds) {
    const enlace = enlaces[enlaceId];
    if (!enlace || enlace.destinoId.kind !== "entidad") continue;
    enlaces[enlaceId] = { ...enlace, destinoId: { ...enlace.destinoId, portId: "port-test-destino" } };
  }
  return { ...modelo, enlaces };
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
