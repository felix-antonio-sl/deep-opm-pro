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

  test("evento con probabilidad emite porcentaje canonico", () => {
    const modelo = modeloBase();
    const enlace: Enlace = {
      id: "l1",
      tipo: "consumo",
      origenId: { kind: "entidad", id: "producto" },
      destinoId: { kind: "entidad", id: "proceso" },
      etiqueta: "",
      modificador: "evento",
      subtipoModificador: "E",
      probabilidad: 0.7,
    };
    expect(oracionEnlaceConRuta(modelo, enlace)).toBe("**Producto** inicia *Procesar*, que consume **Producto** (probabilidad: 70%).");
  });

  test("evento sobre consumo de estado conserva verbo consumo y califica estado", () => {
    const modelo = modeloConEstados();
    const enlace = {
      ...modelo.enlaces.c1!,
      modificador: "evento",
      subtipoModificador: "E",
      probabilidad: 0.7,
    } satisfies Enlace;
    expect(oracionEnlaceConRuta(modelo, enlace)).toBe(
      "**Pedido** en `pendiente` inicia *Procesar*, que consume **Pedido** en `pendiente` (probabilidad: 70%).",
    );
  });

  test("evento sobre resultado a estado conserva verbo resultado y califica estado", () => {
    const modelo = modeloConEstados();
    const enlace = {
      ...modelo.enlaces.r1!,
      modificador: "evento",
      subtipoModificador: "E",
    } satisfies Enlace;
    expect(oracionEnlaceConRuta(modelo, enlace)).toBe(
      "**Pedido** en `aprobado` inicia *Procesar*, que genera **Pedido** en `aprobado`.",
    );
  });

  test("par consumo resultado sobre estados emite transicion TS3 unica", () => {
    const modelo = modeloConEstados();
    const transiciones = transicionesEstado(modelo, modelo.opds.opd!);
    expect(transiciones.lineaPorEnlaceConsumo.get("c1")).toBe("*Procesar* cambia **Pedido** de `pendiente` a `aprobado`.");
    expect(transiciones.enlacesCubiertos.has("r1")).toBe(true);
  });

  test("par consumo resultado con evento emite transicion ETS2 unica", () => {
    const modelo = modeloConEstados();
    modelo.enlaces.c1 = {
      ...modelo.enlaces.c1!,
      modificador: "evento",
      subtipoModificador: "E",
      probabilidad: 0.7,
    };
    const transiciones = transicionesEstado(modelo, modelo.opds.opd!);
    expect(transiciones.lineaPorEnlaceConsumo.get("c1")).toBe(
      "**Pedido** en `pendiente` inicia *Procesar*, que cambia **Pedido** de `pendiente` a `aprobado` (probabilidad: 70%).",
    );
    expect(transiciones.enlacesCubiertos.has("r1")).toBe(true);
  });

  test("par consumo resultado con condicion emite transicion CS2 unica", () => {
    const modelo = modeloConEstados();
    modelo.enlaces.c1 = {
      ...modelo.enlaces.c1!,
      modificador: "condicion",
      subtipoModificador: "C",
    };
    const transiciones = transicionesEstado(modelo, modelo.opds.opd!);
    expect(transiciones.lineaPorEnlaceConsumo.get("c1")).toBe(
      "*Procesar* ocurre si **Pedido** está en `pendiente`, en cuyo caso *Procesar* cambia **Pedido** de `pendiente` a `aprobado`, de lo contrario *Procesar* se omite.",
    );
    expect(transiciones.enlacesCubiertos.has("r1")).toBe(true);
  });

  test("condicion sobre consumo de estado conserva verbo consumo y califica estado", () => {
    const modelo = modeloConEstados();
    const enlace = {
      ...modelo.enlaces.c1!,
      modificador: "condicion",
      subtipoModificador: "C",
    } satisfies Enlace;
    expect(oracionEnlaceConRuta(modelo, enlace)).toBe(
      "*Procesar* ocurre si **Pedido** está en `pendiente`, en cuyo caso *Procesar* consume **Pedido** en `pendiente`, de lo contrario *Procesar* se omite.",
    );
  });

  test("condicion sobre resultado a estado conserva verbo resultado y califica estado", () => {
    const modelo = modeloConEstados();
    const enlace = {
      ...modelo.enlaces.r1!,
      modificador: "condicion",
      subtipoModificador: "C",
    } satisfies Enlace;
    expect(oracionEnlaceConRuta(modelo, enlace)).toBe(
      "*Procesar* ocurre si **Pedido** en `aprobado` puede generarse, en cuyo caso *Procesar* genera **Pedido** en `aprobado`, de lo contrario *Procesar* se omite.",
    );
  });

  test("condicion sobre agente en estado no repite el estado como existencia", () => {
    const modelo = modeloConEstados();
    modelo.entidades.operador = { id: "operador", tipo: "objeto", nombre: "Operador", esencia: "fisica", afiliacion: "sistemica" };
    modelo.estados.s3 = { id: "s3", entidadId: "operador", nombre: "disponible" };
    const enlace: Enlace = {
      id: "a1",
      tipo: "agente",
      origenId: { kind: "estado", id: "s3" },
      destinoId: { kind: "entidad", id: "proceso" },
      etiqueta: "",
      modificador: "condicion",
      subtipoModificador: "C",
    };
    expect(oracionEnlaceConRuta(modelo, enlace)).toBe(
      "**Operador** maneja *Procesar* si **Operador** está en `disponible`, de lo contrario *Procesar* se omite.",
    );
  });

  test("condicion sobre instrumento en estado usa estar", () => {
    const modelo = modeloConEstados();
    modelo.estados.s3 = { id: "s3", entidadId: "producto", nombre: "calibrado" };
    const enlace: Enlace = {
      id: "i1",
      tipo: "instrumento",
      origenId: { kind: "estado", id: "s3" },
      destinoId: { kind: "entidad", id: "proceso" },
      etiqueta: "",
      modificador: "condicion",
      subtipoModificador: "C",
    };
    expect(oracionEnlaceConRuta(modelo, enlace)).toBe(
      "*Procesar* ocurre si **Producto** está en `calibrado`, de lo contrario *Procesar* se omite.",
    );
  });

  // BUG-20260519T200211Z-62ee85: emision inconsistente del estado en enlaces.
  // Sin ruta, sin modificador y sin pareja consumo/resultado para transicion,
  // los enlaces consumo y resultado anclados a un estado deben preservar el
  // estado en la oracion OPL (paridad con `oracionProcedimentalParaRuta`).
  test("consumo solitario desde estado emite 'en `estado`' sin ruta", () => {
    const modelo = modeloConEstados();
    // borra el resultado para que el consumo quede solitario (no forma transicion).
    delete (modelo.enlaces as Record<string, Enlace>).r1;
    delete (modelo.opds.opd!.enlaces as Record<string, { id: string; enlaceId: string; opdId: string; vertices: never[] }>).ar1;
    expect(oracionEnlaceConRuta(modelo, modelo.enlaces.c1!)).toBe(
      "*Procesar* consume **Pedido** en `pendiente`.",
    );
  });

  test("resultado solitario a estado emite 'en `estado`' sin ruta", () => {
    const modelo = modeloConEstados();
    // borra el consumo para que el resultado quede solitario (no forma transicion).
    delete (modelo.enlaces as Record<string, Enlace>).c1;
    delete (modelo.opds.opd!.enlaces as Record<string, { id: string; enlaceId: string; opdId: string; vertices: never[] }>).ac1;
    expect(oracionEnlaceConRuta(modelo, modelo.enlaces.r1!)).toBe(
      "*Procesar* genera **Pedido** en `aprobado`.",
    );
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
