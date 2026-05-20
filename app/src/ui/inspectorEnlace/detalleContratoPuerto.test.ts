import { describe, expect, test } from "bun:test";
import type { Modelo } from "../../modelo/tipos";
import { detalleContratoPuertoEnlace } from "./detalleContratoPuerto";

describe("detalleContratoPuertoEnlace", () => {
  test("expone extremos, ancla exacta y puerto comun de abanico", () => {
    const modelo = modeloConFanExacto();
    const enlace = modelo.enlaces["e-consumo-a"]!;

    const detalle = detalleContratoPuertoEnlace(modelo, modelo.opdRaizId, enlace);

    expect(detalle.extremos).toHaveLength(2);
    expect(detalle.extremos.find((extremo) => extremo.lado === "destino")).toMatchObject({
      nombre: "Procesar",
      modo: "puerto-exacto",
      portId: "port-fan-procesar-destino",
      ancla: "E",
      hora: "15:00",
    });
    expect(detalle.fan).toMatchObject({
      abanicoId: "ab-1",
      operador: "XOR",
      ramas: 2,
      entidadNombre: "Procesar",
      ladoCompartido: "destino",
      portId: "port-fan-procesar-destino",
      ancla: "E",
      hora: "15:00",
    });
  });

  test("distingue extremos a estado de puertos de entidad", () => {
    const modelo = modeloConFanExacto();
    const enlace = modelo.enlaces["e-resultado-estado"]!;

    const detalle = detalleContratoPuertoEnlace(modelo, modelo.opdRaizId, enlace);

    expect(detalle.extremos.find((extremo) => extremo.lado === "destino")).toMatchObject({
      nombre: "Pedido [aprobado]",
      modo: "estado",
      entidadNombre: "Pedido",
    });
    expect(detalle.fan).toBeUndefined();
  });
});

function modeloConFanExacto(): Modelo {
  return {
    id: "modelo-ui-puertos",
    nombre: "UI puertos",
    opdRaizId: "opd-1",
    nextSeq: 1,
    entidades: {
      "o-entrada-a": { id: "o-entrada-a", tipo: "objeto", nombre: "Entrada A", esencia: "informacional", afiliacion: "sistemica" },
      "o-entrada-b": { id: "o-entrada-b", tipo: "objeto", nombre: "Entrada B", esencia: "informacional", afiliacion: "sistemica" },
      "p-procesar": { id: "p-procesar", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
      "o-pedido": { id: "o-pedido", tipo: "objeto", nombre: "Pedido", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {
      "s-aprobado": { id: "s-aprobado", entidadId: "o-pedido", nombre: "aprobado" },
    },
    enlaces: {
      "e-consumo-a": {
        id: "e-consumo-a",
        tipo: "consumo",
        origenId: { kind: "entidad", id: "o-entrada-a" },
        destinoId: { kind: "entidad", id: "p-procesar", portId: "port-fan-procesar-destino" },
        etiqueta: "",
      },
      "e-consumo-b": {
        id: "e-consumo-b",
        tipo: "consumo",
        origenId: { kind: "entidad", id: "o-entrada-b" },
        destinoId: { kind: "entidad", id: "p-procesar", portId: "port-fan-procesar-destino" },
        etiqueta: "",
      },
      "e-resultado-estado": {
        id: "e-resultado-estado",
        tipo: "resultado",
        origenId: { kind: "entidad", id: "p-procesar" },
        destinoId: { kind: "estado", id: "s-aprobado" },
        etiqueta: "",
      },
    },
    abanicos: {
      "ab-1": {
        id: "ab-1",
        opdId: "opd-1",
        puertoEntidadId: "p-procesar",
        operador: "XOR",
        enlaceIds: ["e-consumo-a", "e-consumo-b"],
      },
    },
    opds: {
      "opd-1": {
        id: "opd-1",
        nombre: "SD",
        padreId: null,
        apariencias: {
          "a-entrada-a": { id: "a-entrada-a", entidadId: "o-entrada-a", opdId: "opd-1", x: 40, y: 60, width: 135, height: 60 },
          "a-entrada-b": { id: "a-entrada-b", entidadId: "o-entrada-b", opdId: "opd-1", x: 40, y: 230, width: 135, height: 60 },
          "a-procesar": {
            id: "a-procesar",
            entidadId: "p-procesar",
            opdId: "opd-1",
            x: 310,
            y: 145,
            width: 135,
            height: 60,
            ports: { "port-fan-procesar-destino": { x: 1, y: 0.5 } },
          },
          "a-pedido": { id: "a-pedido", entidadId: "o-pedido", opdId: "opd-1", x: 560, y: 145, width: 135, height: 60 },
        },
        enlaces: {
          "ae-consumo-a": { id: "ae-consumo-a", enlaceId: "e-consumo-a", opdId: "opd-1", vertices: [] },
          "ae-consumo-b": { id: "ae-consumo-b", enlaceId: "e-consumo-b", opdId: "opd-1", vertices: [] },
          "ae-resultado-estado": { id: "ae-resultado-estado", enlaceId: "e-resultado-estado", opdId: "opd-1", vertices: [] },
        },
      },
    },
  };
}
