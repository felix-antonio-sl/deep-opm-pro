import { describe, expect, test } from "bun:test";
import { crearEstadosIniciales, crearModelo, crearObjeto } from "../operaciones";
import { aparienciaDeEntidadEnOpd } from "../politicaApariciones";
import type { AparienciaEnlace, Enlace } from "../tipos/enlace";
import type { Modelo, Resultado } from "../tipos";
import { verificarPegado } from "./pegado";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function modeloSano(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Documento"));
  const objetoId = Object.values(modelo.entidades).find((entidad) => entidad.tipo === "objeto")!.id;
  return must(crearEstadosIniciales(modelo, objetoId)).modelo;
}

function modeloConEnlaceSobreEstadoSuprimido(): Modelo {
  const modelo = modeloSano();
  const opdRaizId = modelo.opdRaizId;
  const objeto = Object.values(modelo.entidades).find((entidad) => entidad.tipo === "objeto")!;
  const estado = Object.values(modelo.estados).find((item) => item.entidadId === objeto.id)!;
  const enlace: Enlace = {
    id: "enlace-corrupto-1",
    tipo: "efecto",
    origenId: { kind: "entidad", id: objeto.id },
    destinoId: { kind: "estado", id: estado.id },
    etiqueta: "",
  };
  const aparienciaEnlace: AparienciaEnlace = {
    id: "ae-corrupto-1",
    enlaceId: enlace.id,
    opdId: opdRaizId,
    vertices: [],
  };
  const opd = modelo.opds[opdRaizId]!;
  const aparienciaObjeto = aparienciaDeEntidadEnOpd(opd, objeto.id)!;
  return {
    ...modelo,
    enlaces: { ...modelo.enlaces, [enlace.id]: enlace },
    opds: {
      ...modelo.opds,
      [opdRaizId]: {
        ...opd,
        enlaces: { ...opd.enlaces, [aparienciaEnlace.id]: aparienciaEnlace },
        apariencias: {
          ...opd.apariencias,
          [aparienciaObjeto.id]: { ...aparienciaObjeto, estadosSuprimidos: [estado.id] },
        },
      },
    },
  };
}

describe("hechos/pegado: separación entre vistas", () => {
  test("modelo sano no produce observaciones", () => {
    expect(verificarPegado(modeloSano())).toEqual([]);
  });

  test("enlace sobre estado suprimido en su aparición produce error-consistencia", () => {
    const observaciones = verificarPegado(modeloConEnlaceSobreEstadoSuprimido());
    expect(observaciones).toHaveLength(1);
    expect(observaciones[0]!.severidad).toBe("error-consistencia");
    expect(observaciones[0]!.codigo).toBe("pegado-enlace-estado-suprimido");
  });
});
