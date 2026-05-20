import { describe, expect, test } from "bun:test";
import { extremoEstado } from "./extremos";
import { crearEstadosIniciales, crearModelo, crearObjeto, crearProceso, estadosDeEntidad, renombrarEstado } from "./operaciones";
import { crearEnlaceTransaccional } from "./transaccionEnlace";
import type { Id, Modelo, Resultado } from "./tipos";

describe("transaccion de enlace", () => {
  test("crea enlace, materializa puertos y forma abanico automatico en una operacion canonica", () => {
    let modelo = crearModelo("Transaccion enlaces");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 40, y: 80 }, "Aprobar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 280, y: 80 }, "Pedido"));
    const procesoId = entidad(modelo, "Aprobar");
    const pedidoId = entidad(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
    const [pendiente, aprobado] = estadosDeEntidad(modelo, pedidoId);
    if (!pendiente || !aprobado) throw new Error("La prueba esperaba estados");
    modelo = must(renombrarEstado(modelo, pendiente.id, "pendiente"));
    modelo = must(renombrarEstado(modelo, aprobado.id, "aprobado"));

    const primero = must(crearEnlaceTransaccional(modelo, modelo.opdRaizId, procesoId, extremoEstado(pendiente.id), "resultado"));
    const segundo = must(crearEnlaceTransaccional(primero.modelo, primero.modelo.opdRaizId, procesoId, extremoEstado(aprobado.id), "resultado"));

    expect(primero.enlaceId).toBeDefined();
    expect(segundo.enlaceId).toBeDefined();
    expect(Object.values(segundo.modelo.abanicos ?? {})).toEqual([
      expect.objectContaining({
        operador: "O",
        enlaceIds: [primero.enlaceId, segundo.enlaceId],
        puertoEntidadId: procesoId,
      }),
    ]);
    const proceso = apariencia(segundo.modelo, "Aprobar");
    const puertos = Object.values(segundo.modelo.enlaces)
      .filter((enlace) => enlace.tipo === "resultado")
      .map((enlace) => enlace.origenId.portId);
    expect(new Set(puertos).size).toBe(1);
    expect(proceso.ports?.[puertos[0]!]).toBeDefined();
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
