import { describe, expect, test } from "bun:test";
import {
  agregarRamaAAbanico,
  alternarOperadorAbanico,
  detectarPuertoCompartido,
  disolverAbanico,
  formarAbanico,
  formarAbanicoAutomatico,
  quitarRamaDeAbanico,
} from "./abanicos";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "./operaciones";
import type { Abanico, Id, Modelo, Resultado, TipoEnlace } from "./tipos";

describe("abanicos lógicos O/XOR", () => {
  test("formarAbanico con dos enlaces del mismo puerto crea abanico O por defecto", () => {
    const { modelo, procesoId, enlaces } = modeloConResultados(["A", "B"]);

    const resultado = formarAbanico(modelo, modelo.opdRaizId, enlaces);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    const abanico = unicoAbanico(resultado.value);
    expect(abanico).toMatchObject({
      opdId: modelo.opdRaizId,
      puertoEntidadId: procesoId,
      operador: "O",
      enlaceIds: enlaces,
    });
  });

  test("formarAbanico rechaza enlaces de puertos distintos", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "P1"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 0, y: 120 }, "P2"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 0 }, "A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 120 }, "B"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "P1"), entidad(modelo, "A"), "resultado"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "P2"), entidad(modelo, "B"), "resultado"));
    const enlaces = Object.keys(modelo.enlaces);

    const resultado = formarAbanico(modelo, modelo.opdRaizId, enlaces);

    expect(resultado.ok).toBe(false);
    if (resultado.ok) return;
    expect(resultado.error).toContain("puerto");
  });

  test("formarAbanico rechaza tipos heterogéneos", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "P"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 0 }, "A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 120 }, "B"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "P"), entidad(modelo, "A"), "resultado"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "P"), entidad(modelo, "B"), "efecto"));

    const resultado = formarAbanico(modelo, modelo.opdRaizId, Object.keys(modelo.enlaces));

    expect(resultado.ok).toBe(false);
    if (resultado.ok) return;
    expect(resultado.error).toContain("homogéneos");
  });

  test("agregarRamaAAbanico agrega tercera rama preservando orden", () => {
    const { modelo: base, enlaces } = modeloConResultados(["A", "B", "C"]);
    let modelo = must(formarAbanico(base, base.opdRaizId, enlaces.slice(0, 2)));
    const abanicoId = unicoAbanico(modelo).id;

    modelo = must(agregarRamaAAbanico(modelo, abanicoId, enlaces[2]!));

    expect(modelo.abanicos?.[abanicoId]?.enlaceIds).toEqual(enlaces);
  });

  test("quitarRamaDeAbanico con dos ramas disuelve el abanico", () => {
    const { modelo: base, enlaces } = modeloConResultados(["A", "B"]);
    let modelo = must(formarAbanico(base, base.opdRaizId, enlaces));
    const abanicoId = unicoAbanico(modelo).id;

    modelo = must(quitarRamaDeAbanico(modelo, abanicoId, enlaces[0]!));

    expect(modelo.abanicos).toEqual({});
    expect(modelo.enlaces[enlaces[0]!]).toBeDefined();
    expect(modelo.enlaces[enlaces[1]!]).toBeDefined();
  });

  test("alternarOperadorAbanico cambia operador y preserva miembros", () => {
    const { modelo: base, enlaces } = modeloConResultados(["A", "B"]);
    let modelo = must(formarAbanico(base, base.opdRaizId, enlaces));
    const abanico = unicoAbanico(modelo);

    modelo = must(alternarOperadorAbanico(modelo, abanico.id, "XOR"));

    expect(modelo.abanicos?.[abanico.id]?.operador).toBe("XOR");
    expect(modelo.abanicos?.[abanico.id]?.enlaceIds).toEqual(enlaces);
  });

  test("disolverAbanico elimina sólo el agrupador", () => {
    const { modelo: base, enlaces } = modeloConResultados(["A", "B"]);
    let modelo = must(formarAbanico(base, base.opdRaizId, enlaces));
    const abanicoId = unicoAbanico(modelo).id;

    modelo = must(disolverAbanico(modelo, abanicoId));

    expect(modelo.abanicos).toEqual({});
    expect(Object.keys(modelo.enlaces)).toEqual(enlaces);
  });

  test("formarAbanicoAutomatico crea abanico al conectar segunda rama compatible", () => {
    const { modelo, procesoId, enlaces } = modeloConResultados(["A", "B"]);

    const resultado = formarAbanicoAutomatico(modelo, modelo.opdRaizId, enlaces[1]!);

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(unicoAbanico(resultado.value).puertoEntidadId).toBe(procesoId);
  });

  test("detectarPuertoCompartido encuentra abanico existente por enlace compatible", () => {
    const { modelo: base, enlaces } = modeloConResultados(["A", "B", "C"]);
    const modelo = must(formarAbanico(base, base.opdRaizId, enlaces.slice(0, 2)));

    const detectado = detectarPuertoCompartido(modelo, modelo.opdRaizId, modelo.enlaces[enlaces[2]!]!);

    expect(detectado?.id).toBe(unicoAbanico(modelo).id);
  });

  test("abanico convergente usa el proceso como puerto compartido", () => {
    const { modelo, procesoId, enlaces } = modeloConConsumos(["A", "B"]);

    const resultado = formarAbanico(modelo, modelo.opdRaizId, enlaces, "XOR");

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(unicoAbanico(resultado.value)).toMatchObject({
      puertoEntidadId: procesoId,
      operador: "XOR",
    });
  });
});

function modeloConResultados(nombres: string[]): { modelo: Modelo; procesoId: Id; enlaces: Id[] } {
  return modeloConRamas("resultado", nombres);
}

function modeloConConsumos(nombres: string[]): { modelo: Modelo; procesoId: Id; enlaces: Id[] } {
  return modeloConRamas("consumo", nombres);
}

function modeloConRamas(tipo: TipoEnlace, nombres: string[]): { modelo: Modelo; procesoId: Id; enlaces: Id[] } {
  let modelo = crearModelo();
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 40, y: 80 }, "P"));
  const procesoId = entidad(modelo, "P");
  for (const [index, nombre] of nombres.entries()) {
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 20 + index * 110 }, nombre));
    const objetoId = entidad(modelo, nombre);
    modelo = tipo === "resultado"
      ? must(crearEnlace(modelo, modelo.opdRaizId, procesoId, objetoId, tipo))
      : must(crearEnlace(modelo, modelo.opdRaizId, objetoId, procesoId, tipo));
  }
  return { modelo, procesoId, enlaces: Object.keys(modelo.enlaces) };
}

function unicoAbanico(modelo: Modelo): Abanico {
  const abanicos = Object.values(modelo.abanicos ?? {});
  expect(abanicos).toHaveLength(1);
  const abanico = abanicos[0];
  if (!abanico) throw new Error("La prueba esperaba un abanico");
  return abanico;
}

function entidad(modelo: Modelo, nombre: string): Id {
  const encontrada = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!encontrada) throw new Error(`Entidad no encontrada: ${nombre}`);
  return encontrada.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
