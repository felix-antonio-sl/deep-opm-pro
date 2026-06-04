import { describe, expect, test } from "bun:test";
import { extremoEstado } from "./extremos";
import { crearEstadosIniciales, crearModelo, crearObjeto, crearProceso, estadosDeEntidad, renombrarEstado } from "./operaciones";
import { puertoRelativoAnclaEnlace } from "./anclajesEnlace";
import { crearEnlaceTransaccional } from "./transaccionEnlace";
import type { Id, Modelo, Resultado } from "./tipos";

describe("transaccion de enlace", () => {
  test("crea enlace, materializa puertos y forma abanico automatico en una operacion canonica", () => {
    let modelo = crearModelo("Transaccion enlaces");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 40, y: 80 }, "Aprobar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 280, y: 40 }, "Pedido aprobado"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 280, y: 160 }, "Pedido rechazado"));
    const procesoId = entidad(modelo, "Aprobar");

    const primero = must(crearEnlaceTransaccional(modelo, modelo.opdRaizId, procesoId, entidad(modelo, "Pedido aprobado"), "resultado", {
      anclaOrigen: "N",
    }));
    const segundo = must(crearEnlaceTransaccional(primero.modelo, primero.modelo.opdRaizId, procesoId, entidad(primero.modelo, "Pedido rechazado"), "resultado", {
      anclaOrigen: "N",
    }));
    const primeroId = mustId(primero.enlaceId);
    const segundoId = mustId(segundo.enlaceId);

    expect(Object.values(segundo.modelo.abanicos ?? {})).toEqual([
      expect.objectContaining({
        operador: "O",
        enlaceIds: [primeroId, segundoId],
        puertoEntidadId: procesoId,
        puertoComun: expect.objectContaining({
          entidadId: procesoId,
          lado: "origen",
        }),
      }),
    ]);
    const proceso = apariencia(segundo.modelo, "Aprobar");
    const puertos = Object.values(segundo.modelo.enlaces)
      .filter((enlace) => enlace.tipo === "resultado")
      .map((enlace) => enlace.origenId.portId);
    expect(new Set(puertos).size).toBe(1);
    expect(proceso.ports?.[puertos[0]!]).toBeDefined();
  });

  test("conserva ancla manual del puerto compartido tras formar abanico automatico", () => {
    let modelo = crearModelo("Transaccion ancla fan estados");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 40, y: 80 }, "Aprobar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 280, y: 40 }, "Pedido aprobado"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 280, y: 160 }, "Pedido rechazado"));
    const procesoId = entidad(modelo, "Aprobar");

    const primero = must(crearEnlaceTransaccional(modelo, modelo.opdRaizId, procesoId, entidad(modelo, "Pedido aprobado"), "resultado", {
      anclaOrigen: "N",
    }));
    const segundo = must(crearEnlaceTransaccional(primero.modelo, primero.modelo.opdRaizId, procesoId, entidad(primero.modelo, "Pedido rechazado"), "resultado", {
      anclaOrigen: "N",
    }));
    const primeroId = mustId(primero.enlaceId);
    const segundoId = mustId(segundo.enlaceId);

    const abanico = Object.values(segundo.modelo.abanicos ?? {})[0];
    expect(abanico?.enlaceIds).toEqual([primeroId, segundoId]);
    expect(abanico?.puertoComun).toMatchObject({
      entidadId: procesoId,
      lado: "origen",
    });
    const puertos = Object.values(segundo.modelo.enlaces)
      .filter((enlace) => enlace.tipo === "resultado")
      .map((enlace) => enlace.origenId.portId);
    expect(new Set(puertos).size).toBe(1);
    expect(apariencia(segundo.modelo, "Aprobar").ports?.[puertos[0]!]).toEqual(puertoRelativoAnclaEnlace("N"));
  });

  test("no forma abanico automatico para transiciones entre estados de un mismo objeto", () => {
    let modelo = crearModelo("Transicion estados sin fan automatico");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 300, y: 60 }, "Agua"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 360, y: 330 }, "Calentar"));
    const aguaId = entidad(modelo, "Agua");
    const calentarId = entidad(modelo, "Calentar");
    modelo = must(crearEstadosIniciales(modelo, aguaId)).modelo;
    const [hielo, liquido] = estadosDeEntidad(modelo, aguaId);
    if (!hielo || !liquido) throw new Error("La prueba esperaba estados");
    modelo = must(renombrarEstado(modelo, hielo.id, "hielo"));
    modelo = must(renombrarEstado(modelo, liquido.id, "liquido"));

    const primero = must(crearEnlaceTransaccional(modelo, modelo.opdRaizId, extremoEstado(hielo.id), calentarId, "consumo"));
    const segundo = must(crearEnlaceTransaccional(primero.modelo, primero.modelo.opdRaizId, calentarId, extremoEstado(liquido.id), "resultado"));
    const tercero = must(crearEnlaceTransaccional(segundo.modelo, segundo.modelo.opdRaizId, extremoEstado(liquido.id), calentarId, "consumo"));

    expect(Object.values(tercero.modelo.abanicos ?? {})).toEqual([]);
    const consumos = Object.values(tercero.modelo.enlaces).filter((enlace) => enlace.tipo === "consumo");
    const puertosDestino = consumos.map((enlace) => enlace.destinoId.kind === "entidad" ? enlace.destinoId.portId : undefined);
    expect(new Set(puertosDestino).size).toBe(consumos.length);
  });

  test("usa la misma ancla explicita como puerto comun para crear abanico de resultados", () => {
    let modelo = crearModelo("Transaccion ancla fan objetos");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 40, y: 80 }, "Aprobar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 280, y: 40 }, "Pedido aprobado"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 280, y: 160 }, "Pedido rechazado"));
    const procesoId = entidad(modelo, "Aprobar");

    const primero = must(crearEnlaceTransaccional(modelo, modelo.opdRaizId, procesoId, entidad(modelo, "Pedido aprobado"), "resultado", {
      anclaOrigen: "N",
    }));
    const segundo = must(crearEnlaceTransaccional(primero.modelo, primero.modelo.opdRaizId, procesoId, entidad(primero.modelo, "Pedido rechazado"), "resultado", {
      anclaOrigen: "N",
    }));
    const primeroId = mustId(primero.enlaceId);
    const segundoId = mustId(segundo.enlaceId);

    const abanico = Object.values(segundo.modelo.abanicos ?? {})[0];
    expect(abanico).toEqual(expect.objectContaining({
      operador: "O",
      enlaceIds: [primeroId, segundoId],
      puertoEntidadId: procesoId,
      puertoComun: expect.objectContaining({
        entidadId: procesoId,
        lado: "origen",
      }),
    }));
    const puertos = Object.values(segundo.modelo.enlaces)
      .filter((enlace) => enlace.tipo === "resultado")
      .map((enlace) => enlace.origenId.portId);
    expect(new Set(puertos).size).toBe(1);
    expect(apariencia(segundo.modelo, "Aprobar").ports?.[puertos[0]!]).toEqual(puertoRelativoAnclaEnlace("N"));
  });
});

function entidad(modelo: Modelo, nombre: string): Id {
  const encontrada = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!encontrada) throw new Error(`Entidad no encontrada: ${nombre}`);
  return encontrada.id;
}

function apariencia(modelo: Modelo, nombre: string) {
  const entidadId = entidad(modelo, nombre);
  const encontrada = Object.values(modelo.opds[modelo.opdRaizId]!.apariencias).find((item) => item.entidadId === entidadId);
  if (!encontrada) throw new Error(`Apariencia no encontrada: ${nombre}`);
  return encontrada;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function mustId(id: Id | null): Id {
  if (!id) throw new Error("La prueba esperaba enlace creado");
  return id;
}
