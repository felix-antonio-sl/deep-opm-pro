import { describe, expect, test } from "bun:test";
import { crearEstadosIniciales, crearModelo, crearObjeto, designarEstadoInicial, desplegarObjeto } from "../operaciones";
import type { Modelo, Resultado } from "../tipos";
import { hechosDe, seccionLocal } from "./proyeccion";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function modeloDocEnDosOpds(): { modelo: Modelo; objetoId: string; opdRaizId: string; opdHijoId: string } {
  let modelo = crearModelo();
  const opdRaizId = modelo.opdRaizId;
  modelo = must(crearObjeto(modelo, opdRaizId, { x: 200, y: 120 }, "Documento"));
  const objetoId = Object.values(modelo.entidades).find((entidad) => entidad.tipo === "objeto")!.id;
  modelo = must(crearEstadosIniciales(modelo, objetoId)).modelo;
  const despliegue = must(desplegarObjeto(modelo, opdRaizId, objetoId, "agregacion"));
  return { modelo: despliegue.modelo, objetoId, opdRaizId, opdHijoId: despliegue.opdId };
}

describe("hechos/proyeccion", () => {
  test("hechosDe(modelo) incluye el hecho-entidad del objeto", () => {
    const { modelo, objetoId } = modeloDocEnDosOpds();
    const hechos = [...hechosDe(modelo).values()];
    expect(hechos.some((hecho) => hecho.tipo === "entidad" && hecho.entidadId === objetoId)).toBe(true);
  });

  test("seccionLocal proyecta la entidad y sus estados visibles en ese OPD", () => {
    const { modelo, objetoId, opdRaizId } = modeloDocEnDosOpds();
    const seccion = [...seccionLocal(modelo, objetoId, opdRaizId).values()];
    expect(seccion.some((hecho) => hecho.tipo === "entidad" && hecho.entidadId === objetoId)).toBe(true);
    expect(seccion.some((hecho) => hecho.tipo === "estado" && hecho.entidadId === objetoId)).toBe(true);
    expect(seccion.every((hecho) => (hecho.tipo === "entidad" || hecho.tipo === "estado" ? hecho.entidadId === objetoId : true))).toBe(true);
  });

  test("seccionLocal de una entidad ausente en el OPD es vacia", () => {
    const { modelo, objetoId, opdHijoId } = modeloDocEnDosOpds();
    expect(seccionLocal(modelo, "id-inexistente", opdHijoId).size).toBe(0);
    expect(seccionLocal(modelo, objetoId, "opd-inexistente").size).toBe(0);
  });

  test("hechosDe conserva designaciones legacy esInicial/esFinal", () => {
    let { modelo, objetoId } = modeloDocEnDosOpds();
    const estadoId = Object.values(modelo.estados).find((estado) => estado.entidadId === objetoId)!.id;
    modelo = must(designarEstadoInicial(modelo, estadoId));
    const hechoEstado = [...hechosDe(modelo).values()]
      .find((hecho) => hecho.tipo === "estado" && hecho.estadoId === estadoId);
    expect(hechoEstado).toMatchObject({ tipo: "estado", designaciones: ["inicial"] });
  });

  test("hechosDe no expone designaciones por referencia al modelo", () => {
    const { modelo, objetoId } = modeloDocEnDosOpds();
    const estado = Object.values(modelo.estados).find((item) => item.entidadId === objetoId)!;
    const modeloConDesignacion: Modelo = {
      ...modelo,
      estados: {
        ...modelo.estados,
        [estado.id]: { ...estado, designaciones: ["inicial"] },
      },
    };
    const hechoEstado = [...hechosDe(modeloConDesignacion).values()]
      .find((hecho) => hecho.tipo === "estado" && hecho.estadoId === estado.id);
    if (!hechoEstado || hechoEstado.tipo !== "estado") throw new Error("No se proyectó el estado esperado");
    try {
      (hechoEstado.designaciones as unknown as string[]).push("final");
    } catch {
      // Si el array está congelado, también cumple el contrato de no aliasing.
    }
    expect(modeloConDesignacion.estados[estado.id]!.designaciones).toEqual(["inicial"]);
  });
});
