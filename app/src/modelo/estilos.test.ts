import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "./operaciones";
import { aplicarEstiloApariencia, normalizarEstiloApariencia, resetearEstiloApariencia } from "./estilos";
import type { Modelo, Resultado } from "./tipos";

describe("estilos de apariencia", () => {
  test("aplica fill y borderColor preservando los otros campos de apariencia", () => {
    const modelo = modeloConObjeto();
    const apariencia = primeraApariencia(modelo);

    const resultado = aplicarEstiloApariencia(modelo, modelo.opdRaizId, apariencia.id, {
      fill: "#70E483",
      borderColor: "#586D8C",
    });

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    const actualizada = resultado.value.opds[modelo.opdRaizId]?.apariencias[apariencia.id];
    expect(actualizada).toMatchObject({
      id: apariencia.id,
      entidadId: apariencia.entidadId,
      opdId: apariencia.opdId,
      x: apariencia.x,
      y: apariencia.y,
      width: apariencia.width,
      height: apariencia.height,
      estilo: {
        fill: "#70e483",
        borderColor: "#586d8c",
      },
    });
  });

  test("reset remueve estilo sin tocar semantica ni geometria", () => {
    const modelo = modeloConObjeto();
    const apariencia = primeraApariencia(modelo);
    const conEstilo = must(aplicarEstiloApariencia(modelo, modelo.opdRaizId, apariencia.id, { fill: "#fef3c7" }));

    const resultado = resetearEstiloApariencia(conEstilo, modelo.opdRaizId, apariencia.id);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    const actualizada = resultado.value.opds[modelo.opdRaizId]?.apariencias[apariencia.id];
    expect(actualizada?.estilo).toBeUndefined();
    expect(actualizada).toMatchObject({
      entidadId: apariencia.entidadId,
      x: apariencia.x,
      y: apariencia.y,
      width: apariencia.width,
      height: apariencia.height,
    });
  });

  test("normaliza hex validos y omite objetos vacios", () => {
    expect(normalizarEstiloApariencia({ fill: "#FFF", borderColor: "#3BC3FF" })).toEqual({
      fill: "#fff",
      borderColor: "#3bc3ff",
    });
    expect(normalizarEstiloApariencia({})).toBeUndefined();
    expect(normalizarEstiloApariencia({ fill: "red" })).toBeUndefined();
  });
});

function modeloConObjeto(): Modelo {
  return must(crearObjeto(crearModelo("Estilo"), "opd-1", { x: 10, y: 20 }, "Sistema"));
}

function primeraApariencia(modelo: Modelo) {
  const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
  if (!apariencia) throw new Error("La prueba esperaba apariencia");
  return apariencia;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
