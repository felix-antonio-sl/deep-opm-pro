import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, crearEnlace } from "../operaciones";
import type { Modelo, Resultado } from "../tipos";
import { verificarLinealidad } from "./linealidad";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function construirObjetoLinealConDosConsumidores(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Energia"));
  const objeto = Object.values(modelo.entidades).find((e) => e.tipo === "objeto")!;
  modelo = {
    ...modelo,
    entidades: { ...modelo.entidades, [objeto.id]: { ...objeto, lineal: true } },
  };
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 80 }, "Motor A"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 180 }, "Motor B"));
  const procesos = Object.values(modelo.entidades).filter((e) => e.tipo === "proceso");
  for (const proc of procesos) {
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, objeto.id, proc.id, "consumo"));
  }
  return modelo;
}

function construirObjetoCopiableConDosConsumidores(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Agua"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 80 }, "Bomba A"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 180 }, "Bomba B"));
  const objeto = Object.values(modelo.entidades).find((e) => e.tipo === "objeto")!;
  const procesos = Object.values(modelo.entidades).filter((e) => e.tipo === "proceso");
  for (const proc of procesos) {
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, objeto.id, proc.id, "consumo"));
  }
  return modelo;
}

describe("composicion/linealidad", () => {
  test("objeto lineal consumido por dos procesos → error-linealidad", () => {
    const modelo = construirObjetoLinealConDosConsumidores();
    const obs = verificarLinealidad(modelo);
    expect(obs.some((o) => o.severidad === "error-linealidad")).toBe(true);
  });

  test("objeto copiable (default) consumido por dos procesos → sin observacion", () => {
    const modelo = construirObjetoCopiableConDosConsumidores();
    expect(verificarLinealidad(modelo)).toEqual([]);
  });

  test("objeto lineal consumido por un solo proceso → sin observacion", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Llave"));
    const objeto = Object.values(modelo.entidades).find((e) => e.tipo === "objeto")!;
    modelo = { ...modelo, entidades: { ...modelo.entidades, [objeto.id]: { ...objeto, lineal: true } } };
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 100 }, "Puerta"));
    const proc = Object.values(modelo.entidades).find((e) => e.tipo === "proceso")!;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, objeto.id, proc.id, "consumo"));
    expect(verificarLinealidad(modelo)).toEqual([]);
  });

  test("objeto lineal consumido por alternativas XOR → sin falso positivo", () => {
    let modelo = construirObjetoLinealConDosConsumidores();
    const consumos = Object.values(modelo.enlaces)
      .filter((enlace) => enlace.tipo === "consumo")
      .map((enlace) => enlace.id);
    modelo = {
      ...modelo,
      abanicos: {
        "ab-xor": {
          id: "ab-xor",
          opdId: modelo.opdRaizId,
          puertoComun: { entidadId: extremoEntidadDeEnlace(modelo, consumos[0]!), lado: "origen", portId: "p-lineal" },
          puertoEntidadId: extremoEntidadDeEnlace(modelo, consumos[0]!),
          operador: "XOR",
          enlaceIds: consumos,
        },
      },
    };

    expect(verificarLinealidad(modelo)).toEqual([]);
  });

  test("verificarLinealidad es puro: no muta el modelo", () => {
    const modelo = construirObjetoLinealConDosConsumidores();
    const antes = JSON.stringify(modelo);
    verificarLinealidad(modelo);
    expect(JSON.stringify(modelo)).toBe(antes);
  });
});

function extremoEntidadDeEnlace(modelo: Modelo, enlaceId: string): string {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace || enlace.origenId.kind !== "entidad") throw new Error("fixture esperado con origen entidad");
  return enlace.origenId.id;
}
