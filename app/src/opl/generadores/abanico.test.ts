import { describe, expect, test } from "bun:test";
import type { Modelo } from "../../modelo/tipos";
import { oracionAbanico } from "./abanico";

describe("abanico OPL", () => {
  test("OR emite al menos uno de", () => {
    const modelo = modeloBase("O");
    expect(oracionAbanico(modelo, modelo.abanicos!.ab1!)).toBe("*Procesar* consume al menos uno de **Entrada A** y **Entrada B**.");
  });

  test("XOR emite exactamente uno de", () => {
    const modelo = modeloBase("XOR");
    expect(oracionAbanico(modelo, modelo.abanicos!.ab1!)).toBe("*Procesar* consume exactamente uno de **Entrada A** y **Entrada B**.");
  });

  test("XOR de resultados a estados del mismo objeto no repite el objeto", () => {
    const modelo = modeloResultadosAEstados("XOR");
    expect(oracionAbanico(modelo, modelo.abanicos!.ab1!)).toBe("*Procesar* cambia **Pedido** a exactamente uno de `aprobado` y `rechazado`.");
  });

  test("OR de consumos desde estados del mismo objeto no repite el objeto", () => {
    const modelo = modeloConsumosDesdeEstados("O");
    expect(oracionAbanico(modelo, modelo.abanicos!.ab1!)).toBe("*Procesar* cambia **Pedido** de al menos uno de `pendiente` y `observado`.");
  });
});

function modeloBase(operador: "O" | "XOR"): Modelo {
  return {
    id: "m1",
    nombre: "M",
    opdRaizId: "opd",
    opds: { opd: { id: "opd", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} } },
    entidades: {
      proceso: { id: "proceso", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
      a: { id: "a", tipo: "objeto", nombre: "Entrada A", esencia: "informacional", afiliacion: "sistemica" },
      b: { id: "b", tipo: "objeto", nombre: "Entrada B", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {
      l1: { id: "l1", tipo: "consumo", origenId: { kind: "entidad", id: "a" }, destinoId: { kind: "entidad", id: "proceso" }, etiqueta: "" },
      l2: { id: "l2", tipo: "consumo", origenId: { kind: "entidad", id: "b" }, destinoId: { kind: "entidad", id: "proceso" }, etiqueta: "" },
    },
    abanicos: { ab1: { id: "ab1", opdId: "opd", puertoEntidadId: "proceso", operador, enlaceIds: ["l1", "l2"] } },
    nextSeq: 1,
  };
}

function modeloResultadosAEstados(operador: "O" | "XOR"): Modelo {
  return {
    id: "m1",
    nombre: "M",
    opdRaizId: "opd",
    opds: { opd: { id: "opd", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} } },
    entidades: {
      proceso: { id: "proceso", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
      pedido: { id: "pedido", tipo: "objeto", nombre: "Pedido", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {
      aprobado: { id: "aprobado", entidadId: "pedido", nombre: "aprobado" },
      rechazado: { id: "rechazado", entidadId: "pedido", nombre: "rechazado" },
    },
    enlaces: {
      l1: { id: "l1", tipo: "resultado", origenId: { kind: "entidad", id: "proceso" }, destinoId: { kind: "estado", id: "aprobado" }, etiqueta: "" },
      l2: { id: "l2", tipo: "resultado", origenId: { kind: "entidad", id: "proceso" }, destinoId: { kind: "estado", id: "rechazado" }, etiqueta: "" },
    },
    abanicos: { ab1: { id: "ab1", opdId: "opd", puertoEntidadId: "proceso", operador, enlaceIds: ["l1", "l2"] } },
    nextSeq: 1,
  };
}

function modeloConsumosDesdeEstados(operador: "O" | "XOR"): Modelo {
  return {
    id: "m1",
    nombre: "M",
    opdRaizId: "opd",
    opds: { opd: { id: "opd", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} } },
    entidades: {
      proceso: { id: "proceso", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
      pedido: { id: "pedido", tipo: "objeto", nombre: "Pedido", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {
      pendiente: { id: "pendiente", entidadId: "pedido", nombre: "pendiente" },
      observado: { id: "observado", entidadId: "pedido", nombre: "observado" },
    },
    enlaces: {
      l1: { id: "l1", tipo: "consumo", origenId: { kind: "estado", id: "pendiente" }, destinoId: { kind: "entidad", id: "proceso" }, etiqueta: "" },
      l2: { id: "l2", tipo: "consumo", origenId: { kind: "estado", id: "observado" }, destinoId: { kind: "entidad", id: "proceso" }, etiqueta: "" },
    },
    abanicos: { ab1: { id: "ab1", opdId: "opd", puertoEntidadId: "proceso", operador, enlaceIds: ["l1", "l2"] } },
    nextSeq: 1,
  };
}
