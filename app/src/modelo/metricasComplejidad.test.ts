import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "./operaciones";
import { calcularMetricasComplejidad } from "./metricasComplejidad";

describe("calcularMetricasComplejidad", () => {
  test("calcula score y densidad maxima", () => {
    let modelo = crearModelo("Metrica");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 20 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 20 }, "Procesar"));
    const entradaId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Entrada")?.id;
    const procesarId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Procesar")?.id;
    if (!entradaId || !procesarId) throw new Error("Fixture invalido");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entradaId, procesarId, "consumo"));

    expect(calcularMetricasComplejidad(modelo)).toMatchObject({
      entidades: 2,
      enlaces: 1,
      opds: 1,
      maxAparienciasEnOpd: 2,
      opdsBloqueadosPorDensidad: 0,
      score: 5.5,
    });
  });
});

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
