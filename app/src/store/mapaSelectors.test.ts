import { describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones";
import type { Modelo } from "../modelo/tipos";
import { descriptorMapaFiltrado, estadisticasModelo } from "./mapaSelectors";

describe("mapaSelectors", () => {
  test("deriva descriptor filtrado sin depender del store global", () => {
    const modelo = modeloConOpdHijo();

    const descriptor = descriptorMapaFiltrado({
      modelo,
      descriptorMapaCache: null,
      mapaSubarbolRaizId: null,
      mapaProfundidadMaxima: 1,
      mapaCriterioResaltado: "ninguno",
      opdActivoId: modelo.opdRaizId,
      mapaUltimoVisitadoOpdId: null,
    });

    expect(descriptor.nodos.map((nodo) => nodo.opdId)).toEqual([modelo.opdRaizId]);
  });

  test("calcula estadisticas desde modelo explicito", () => {
    const modelo = modeloConOpdHijo();

    expect(estadisticasModelo(modelo).totalOpds).toBe(2);
  });
});

function modeloConOpdHijo(): Modelo {
  const modelo = crearModelo();
  return {
    ...modelo,
    opds: {
      ...modelo.opds,
      "opd-2": {
        id: "opd-2",
        nombre: "SD1",
        padreId: modelo.opdRaizId,
        apariencias: {},
        enlaces: {},
      },
    },
  };
}
