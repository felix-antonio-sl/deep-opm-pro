import { describe, expect, test } from "bun:test";
import type { Enlace, Modelo } from "../../modelo/tipos";
import { oracionEnlaceConRuta, transicionesEstado } from "./procedural";

describe("procedural OPL", () => {
  test("agente emite maneja", () => {
    const modelo = modeloBase();
    const enlace: Enlace = { id: "l1", tipo: "agente", origenId: { kind: "entidad", id: "operador" }, destinoId: { kind: "entidad", id: "proceso" }, etiqueta: "" };
    expect(oracionEnlaceConRuta(modelo, enlace)).toBe("**Operador** maneja *Procesar*.");
  });

  test("ruta se antepone sin perder etiqueta canonica", () => {
    const modelo = modeloBase();
    const enlace: Enlace = { id: "l1", tipo: "resultado", origenId: { kind: "entidad", id: "proceso" }, destinoId: { kind: "entidad", id: "producto" }, etiqueta: "", rutaEtiqueta: "exito" };
    expect(oracionEnlaceConRuta(modelo, enlace)).toBe("Por ruta exito, *Procesar* genera **Producto**.");
  });

  test("par consumo resultado sobre estados emite transicion TS3 unica", () => {
    const modelo = modeloConEstados();
    const transiciones = transicionesEstado(modelo, modelo.opds.opd!);
    expect(transiciones.lineaPorEnlaceConsumo.get("c1")).toBe("*Procesar* cambia **Pedido** de `pendiente` a `aprobado`.");
    expect(transiciones.enlacesCubiertos.has("r1")).toBe(true);
  });
});

function modeloBase(): Modelo {
  return {
    id: "m1",
    nombre: "M",
    opdRaizId: "opd",
    opds: { opd: { id: "opd", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} } },
    entidades: {
      operador: { id: "operador", tipo: "objeto", nombre: "Operador", esencia: "fisica", afiliacion: "sistemica" },
      proceso: { id: "proceso", tipo: "proceso", nombre: "Procesar", esencia: "informacional", afiliacion: "sistemica" },
      producto: { id: "producto", tipo: "objeto", nombre: "Producto", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {},
    nextSeq: 1,
  };
}

function modeloConEstados(): Modelo {
  const modelo = modeloBase();
  modelo.entidades.pedido = { id: "pedido", tipo: "objeto", nombre: "Pedido", esencia: "informacional", afiliacion: "sistemica" };
  modelo.estados = {
    s1: { id: "s1", entidadId: "pedido", nombre: "pendiente" },
    s2: { id: "s2", entidadId: "pedido", nombre: "aprobado" },
  };
  modelo.enlaces = {
    c1: { id: "c1", tipo: "consumo", origenId: { kind: "estado", id: "s1" }, destinoId: { kind: "entidad", id: "proceso" }, etiqueta: "" },
    r1: { id: "r1", tipo: "resultado", origenId: { kind: "entidad", id: "proceso" }, destinoId: { kind: "estado", id: "s2" }, etiqueta: "" },
  };
  modelo.opds.opd!.enlaces = {
    ac1: { id: "ac1", enlaceId: "c1", opdId: "opd", vertices: [] },
    ar1: { id: "ar1", enlaceId: "r1", opdId: "opd", vertices: [] },
  };
  return modelo;
}
