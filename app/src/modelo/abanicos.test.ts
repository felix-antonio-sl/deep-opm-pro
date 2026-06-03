import { describe, expect, test } from "bun:test";
import {
  agregarRamaAAbanico,
  alternarOperadorAbanico,
  candidatosAbanicoExacto,
  definirProbabilidadesAbanico,
  detectarPuertoCompartido,
  disolverAbanico,
  formarAbanico,
  formarAbanicoAutomatico,
  quitarRamaDeAbanico,
} from "./abanicos";
import { extremoEstado } from "./extremos";
import { crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso, eliminarEnlace, estadosDeEntidad, renombrarEstado } from "./operaciones";
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
      puertoComun: {
        entidadId: procesoId,
        lado: "origen",
        portId: "port-test-origen",
      },
      operador: "O",
      enlaceIds: enlaces,
    });
  });

  test("permite dos abanicos del mismo tipo y entidad cuando usan puertos exactos distintos", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 40, y: 120 }, "P"));
    const procesoId = entidad(modelo, "P");
    for (const [index, nombre] of ["A", "B", "C", "D"].entries()) {
      modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 280, y: 20 + index * 90 }, nombre));
      modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesoId, entidad(modelo, nombre), "resultado"));
    }
    const [e1, e2, e3, e4] = Object.keys(modelo.enlaces);
    if (!e1 || !e2 || !e3 || !e4) throw new Error("La prueba esperaba cuatro enlaces");
    modelo = fijarPuertoCompartido(modelo, [e1, e2], "origen", "port-fan-superior");
    modelo = fijarPuertoCompartido(modelo, [e3, e4], "origen", "port-fan-inferior");

    modelo = must(formarAbanico(modelo, modelo.opdRaizId, [e1, e2]));
    modelo = must(formarAbanico(modelo, modelo.opdRaizId, [e3, e4]));

    const abanicos = Object.values(modelo.abanicos ?? {});
    expect(abanicos).toHaveLength(2);
    expect(abanicos.map((abanico) => abanico.puertoComun.portId).sort()).toEqual([
      "port-fan-inferior",
      "port-fan-superior",
    ]);
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

  test("formarAbanico no infiere puerto compartido solo por misma entidad si los portId difieren", () => {
    const { modelo, enlaces } = modeloConResultados(["A", "B"], { puertoCompartido: false });

    const resultado = formarAbanico(modelo, modelo.opdRaizId, enlaces);

    expect(resultado.ok).toBe(false);
    if (resultado.ok) return;
    expect(resultado.error).toContain("puerto");
  });

  test("detecta fan posible por extremo comun aunque las ramas aun no compartan portId", () => {
    const { modelo, procesoId, enlaces } = modeloConResultados(["A", "B"], { puertoCompartido: false });

    const candidatos = candidatosAbanicoExacto(modelo, modelo.opdRaizId, enlaces[0]!);

    expect(candidatos).toEqual([{
      lado: "origen",
      entidadId: procesoId,
      tipo: "resultado",
      enlaceIds: enlaces,
    }]);
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

  test("definirProbabilidadesAbanico guarda una policy XOR completa por rama", () => {
    const { modelo: base, enlaces } = modeloConResultados(["A", "B", "C"]);
    let modelo = must(formarAbanico(base, base.opdRaizId, enlaces, "XOR"));
    const abanico = unicoAbanico(modelo);

    modelo = must(definirProbabilidadesAbanico(modelo, abanico.id, {
      [enlaces[0]!]: 0.2,
      [enlaces[1]!]: 0.3,
      [enlaces[2]!]: 0.5,
    }));

    expect(modelo.abanicos?.[abanico.id]?.decision).toEqual({
      modo: "probabilidades",
      pesos: {
        [enlaces[0]!]: 0.2,
        [enlaces[1]!]: 0.3,
        [enlaces[2]!]: 0.5,
      },
    });
    expect(enlaces.map((id) => modelo.enlaces[id]?.probabilidad)).toEqual([0.2, 0.3, 0.5]);
  });

  test("definirProbabilidadesAbanico exige suma 1 y operador XOR", () => {
    const { modelo: base, enlaces } = modeloConResultados(["A", "B"]);
    const modelo = must(formarAbanico(base, base.opdRaizId, enlaces, "O"));
    const abanico = unicoAbanico(modelo);

    const enO = definirProbabilidadesAbanico(modelo, abanico.id, {
      [enlaces[0]!]: 0.5,
      [enlaces[1]!]: 0.5,
    });
    expect(enO.ok).toBe(false);
    if (enO.ok) return;
    expect(enO.error).toContain("XOR");

    const comoXor = must(alternarOperadorAbanico(modelo, abanico.id, "XOR"));
    const sumaInvalida = definirProbabilidadesAbanico(comoXor, abanico.id, {
      [enlaces[0]!]: 0.7,
      [enlaces[1]!]: 0.7,
    });
    expect(sumaInvalida.ok).toBe(false);
    if (sumaInvalida.ok) return;
    expect(sumaInvalida.error).toContain("sumar 1");
  });

  test("definirProbabilidadesAbanico limpia la policy explicita al recibir undefined", () => {
    const { modelo: base, enlaces } = modeloConResultados(["A", "B"]);
    let modelo = must(formarAbanico(base, base.opdRaizId, enlaces, "XOR"));
    const abanico = unicoAbanico(modelo);
    modelo = must(definirProbabilidadesAbanico(modelo, abanico.id, {
      [enlaces[0]!]: 0.6,
      [enlaces[1]!]: 0.4,
    }));

    modelo = must(definirProbabilidadesAbanico(modelo, abanico.id, undefined));

    expect(modelo.abanicos?.[abanico.id]?.decision).toBeUndefined();
    expect(enlaces.map((id) => modelo.enlaces[id]?.probabilidad)).toEqual([undefined, undefined]);
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
    expect(unicoAbanico(resultado.value)).toMatchObject({
      puertoEntidadId: procesoId,
      puertoComun: {
        entidadId: procesoId,
        lado: "origen",
        portId: "port-test-origen",
      },
    });
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

  test("dos resultados hacia estados distintos del mismo objeto forman abanico por proceso exacto", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 40, y: 80 }, "Aprobar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 280, y: 80 }, "Pedido"));
    const procesoId = entidad(modelo, "Aprobar");
    const pedidoId = entidad(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
    const [pendiente, aprobado] = estadosDeEntidad(modelo, pedidoId);
    if (!pendiente || !aprobado) throw new Error("La prueba esperaba dos estados");
    modelo = must(renombrarEstado(modelo, pendiente.id, "pendiente"));
    modelo = must(renombrarEstado(modelo, aprobado.id, "aprobado"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesoId, extremoEstado(pendiente.id), "resultado"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesoId, extremoEstado(aprobado.id), "resultado"));
    const enlaces = Object.keys(modelo.enlaces);

    const resultado = formarAbanico(modelo, modelo.opdRaizId, enlaces, "XOR");

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(unicoAbanico(resultado.value)).toMatchObject({
      puertoEntidadId: procesoId,
      operador: "XOR",
      enlaceIds: enlaces,
    });
  });

  test("eliminarEnlace sincroniza abanicos y disuelve agrupadores con menos de dos ramas", () => {
    const { modelo: base, enlaces } = modeloConResultados(["A", "B", "C"]);
    let modelo = must(formarAbanico(base, base.opdRaizId, enlaces, "XOR"));

    modelo = must(eliminarEnlace(modelo, enlaces[0]!));

    expect(unicoAbanico(modelo).enlaceIds).toEqual(enlaces.slice(1));

    modelo = must(eliminarEnlace(modelo, enlaces[1]!));

    expect(modelo.abanicos).toEqual({});
  });
});

interface OpcionesRamas {
  puertoCompartido?: boolean;
}

function modeloConResultados(nombres: string[], opciones?: OpcionesRamas): { modelo: Modelo; procesoId: Id; enlaces: Id[] } {
  return modeloConRamas("resultado", nombres, opciones);
}

function modeloConConsumos(nombres: string[], opciones?: OpcionesRamas): { modelo: Modelo; procesoId: Id; enlaces: Id[] } {
  return modeloConRamas("consumo", nombres, opciones);
}

function modeloConRamas(tipo: TipoEnlace, nombres: string[], opciones: OpcionesRamas = {}): { modelo: Modelo; procesoId: Id; enlaces: Id[] } {
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
  const enlaces = Object.keys(modelo.enlaces);
  if (opciones.puertoCompartido !== false) {
    modelo = fijarPuertoCompartido(modelo, enlaces, tipo === "resultado" ? "origen" : "destino");
  }
  return { modelo, procesoId, enlaces };
}

function fijarPuertoCompartido(modelo: Modelo, enlaceIds: Id[], lado: "origen" | "destino", portId = `port-test-${lado}`): Modelo {
  const campo = lado === "origen" ? "origenId" : "destinoId";
  const enlaces = { ...modelo.enlaces };
  for (const enlaceId of enlaceIds) {
    const enlace = enlaces[enlaceId];
    if (!enlace) continue;
    const extremo = enlace[campo];
    if (extremo.kind !== "entidad") continue;
    enlaces[enlaceId] = { ...enlace, [campo]: { ...extremo, portId } };
  }
  return { ...modelo, enlaces };
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
