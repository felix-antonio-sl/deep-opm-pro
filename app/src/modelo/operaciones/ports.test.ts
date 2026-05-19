import { describe, expect, test } from "bun:test";
import { extremoEntidad } from "../extremos";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "../operaciones";
import type { Apariencia, Id, Modelo } from "../tipos";
import { fijarAnclaExtremoEnlace } from "./ports";

describe("puertos de enlace", () => {
  test("fija extremos de objeto y proceso a las 8 posiciones de reloj", () => {
    let modelo = crearModelo("Anchors");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 80 }, "Entrada"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 280, y: 80 }, "Procesar"));
    const entradaId = entidadPorNombre(modelo, "Entrada");
    const procesarId = entidadPorNombre(modelo, "Procesar");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(entradaId), extremoEntidad(procesarId), "consumo"));
    const enlace = Object.values(modelo.enlaces)[0]!;

    modelo = must(fijarAnclaExtremoEnlace(modelo, modelo.opdRaizId, enlace.id, "origen", "NE"));
    modelo = must(fijarAnclaExtremoEnlace(modelo, modelo.opdRaizId, enlace.id, "destino", "SO"));

    const enlaceActualizado = modelo.enlaces[enlace.id]!;
    const portOrigen = enlaceActualizado.origenId.portId;
    const portDestino = enlaceActualizado.destinoId.portId;
    expect(portOrigen).toBe(`port-${enlace.id}-origen`);
    expect(portDestino).toBe(`port-${enlace.id}-destino`);
    expect(aparienciaPorEntidad(modelo, entradaId).ports?.[portOrigen!]).toEqual({ x: 1, y: 0 });
    expect(aparienciaPorEntidad(modelo, procesarId).ports?.[portDestino!]).toEqual({ x: 0, y: 1 });
  });
});

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function aparienciaPorEntidad(modelo: Modelo, entidadId: Id): Apariencia {
  const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})
    .find((item) => item.entidadId === entidadId);
  if (!apariencia) throw new Error(`Apariencia no encontrada: ${entidadId}`);
  return apariencia;
}

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
