import { describe, expect, test } from "bun:test";
import { CANON } from "./constantes";
import {
  columnasDentroDe,
  contenedorRefinamiento,
  dentroDeApariencia,
  esContornoRefinamiento,
  POSICION_INICIAL_CANVAS,
  posicionLibre,
  solapa,
} from "./layout";
import { crearModelo, crearObjeto, crearProceso, descomponerProceso, desplegarObjeto } from "./operaciones";
import type { Apariencia, Modelo, Resultado } from "./tipos";

describe("modelo/layout", () => {
  test("solapa detecta interseccion con margen y descarta el contorno refinable", () => {
    const apariencia = { x: 100, y: 100, width: CANON.dims.cosaWidth, height: CANON.dims.cosaHeight };
    expect(solapa({ x: 110, y: 110 }, apariencia)).toBe(true);
    expect(solapa({ x: 400, y: 100 }, apariencia)).toBe(false);

    const contorno = { x: 100, y: 100, width: 600, height: 400 };
    expect(esContornoRefinamiento(contorno)).toBe(true);
    expect(solapa({ x: 110, y: 110 }, contorno)).toBe(false);
  });

  test("posicionLibre evita solapes y respeta el contorno cuando hay refinamiento", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Uno"));
    const segunda = posicionLibre(modelo, modelo.opdRaizId, "objeto");
    const apariencias = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {});
    expect(apariencias.every((apariencia) => !solapa(segunda, apariencia))).toBe(true);
  });

  test("posicionLibre en OPD raiz vacio nace en el centro geometrico del canvas", () => {
    const modelo = crearModelo();

    expect(posicionLibre(modelo, modelo.opdRaizId, "objeto")).toEqual(POSICION_INICIAL_CANVAS);
    expect(posicionLibre(modelo, modelo.opdRaizId, "proceso")).toEqual(POSICION_INICIAL_CANVAS);
  });

  test("contenedorRefinamiento retorna null en OPD raiz y la apariencia padre en OPD hijo", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Padre"));
    const procesoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Padre")?.id;
    expect(procesoId).toBeDefined();
    if (!procesoId) return;
    const descomposicion = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    modelo = descomposicion.modelo;

    expect(contenedorRefinamiento(modelo, modelo.opdRaizId)).toBeNull();

    const contorno = contenedorRefinamiento(modelo, descomposicion.opdId);
    expect(contorno).not.toBeNull();
    const apariencia = Object.values(modelo.opds[descomposicion.opdId]?.apariencias ?? {})
      .find((item) => item.entidadId === procesoId);
    expect(contorno?.x).toBe(apariencia?.x);
  });

  test("contenedorRefinamiento no trata despliegue estructural como contorno", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Todo"));
    const objetoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Todo")?.id;
    expect(objetoId).toBeDefined();
    if (!objetoId) return;
    const despliegue = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId, "agregacion"));
    modelo = despliegue.modelo;

    expect(contenedorRefinamiento(modelo, despliegue.opdId)).toBeNull();
  });

  test("columnasDentroDe centra procesos y alinea objetos al borde izquierdo", () => {
    const contenedor = { x: 100, width: 600 };
    const procesos = columnasDentroDe(contenedor, "proceso");
    const objetos = columnasDentroDe(contenedor, "objeto");

    // proceso = [center, left, right]; objeto = [left, center, right]
    expect(procesos[1]).toBeLessThan(procesos[0] as number);
    expect(procesos[2]).toBeGreaterThan(procesos[0] as number);
    expect(objetos[0]).toBeLessThan(objetos[1] as number);
    expect(objetos[1]).toBeLessThan(objetos[2] as number);
  });

  test("dentroDeApariencia respeta los limites del contorno", () => {
    const contorno = aparienciaSimple("c", 100, 100, 600, 400);
    const dentro = aparienciaSimple("d", 200, 200, 80, 60);
    const fueraDerecha = aparienciaSimple("f", 700, 200, 80, 60);

    expect(dentroDeApariencia(dentro, contorno)).toBe(true);
    expect(dentroDeApariencia(fueraDerecha, contorno)).toBe(false);
  });
});

function aparienciaSimple(id: string, x: number, y: number, width: number, height: number): Apariencia {
  return { id, entidadId: "ent", opdId: "opd", x, y, width, height };
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
