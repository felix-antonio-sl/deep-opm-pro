import { describe, expect, test } from "bun:test";
import { verificarPegado } from "../modelo/hechos";
import { crearEstadosIniciales, crearModelo, crearObjeto } from "../modelo/operaciones";
import { aparienciaDeEntidadEnOpd } from "../modelo/politicaApariciones";
import type { AparienciaEnlace, Enlace } from "../modelo/tipos/enlace";
import type { Modelo, Resultado } from "../modelo/tipos";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function conEnlaceSobreEstadoSuprimido(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Documento"));
  const objeto = Object.values(modelo.entidades).find((entidad) => entidad.tipo === "objeto")!;
  modelo = must(crearEstadosIniciales(modelo, objeto.id)).modelo;
  const estado = Object.values(modelo.estados).find((item) => item.entidadId === objeto.id)!;
  const enlace: Enlace = {
    id: "ec1",
    tipo: "efecto",
    origenId: { kind: "entidad", id: objeto.id },
    destinoId: { kind: "estado", id: estado.id },
    etiqueta: "",
  };
  const aparienciaEnlace: AparienciaEnlace = {
    id: "aec1",
    enlaceId: "ec1",
    opdId: modelo.opdRaizId,
    vertices: [],
  };
  const opd = modelo.opds[modelo.opdRaizId]!;
  const aparienciaObjeto = aparienciaDeEntidadEnOpd(opd, objeto.id)!;
  return {
    ...modelo,
    enlaces: { ...modelo.enlaces, ec1: enlace },
    opds: {
      ...modelo.opds,
      [modelo.opdRaizId]: {
        ...opd,
        enlaces: { ...opd.enlaces, aec1: aparienciaEnlace },
        apariencias: {
          ...opd.apariencias,
          [aparienciaObjeto.id]: { ...aparienciaObjeto, estadosSuprimidos: [estado.id] },
        },
      },
    },
  };
}

describe("LEY law-pegado-opd", () => {
  test("separación produce error-consistencia como diagnóstico", () => {
    const observaciones = verificarPegado(conEnlaceSobreEstadoSuprimido());
    expect(Array.isArray(observaciones)).toBe(true);
    expect(observaciones.some((observacion) => observacion.severidad === "error-consistencia")).toBe(true);
  });

  test("verificarPegado es puro: no muta el modelo", () => {
    const modelo = conEnlaceSobreEstadoSuprimido();
    const antes = JSON.stringify(modelo);
    verificarPegado(modelo);
    expect(JSON.stringify(modelo)).toBe(antes);
  });
});
