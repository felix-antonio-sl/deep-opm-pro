import { describe, expect, test } from "bun:test";
import { parsearParrafoOpl, normalizarNombreOpl, claveNombre, extraerMultiplicidad } from "./parsear";

describe("parser OPL reverse base", () => {
  test("normaliza markdown, numeracion, alias y unidades para resolver nombres", () => {
    expect(normalizarNombreOpl("1 **Sensor** [V] {alias}")).toBe("Sensor");
    expect(claveNombre("Medición Clínica")).toBe("medicion clinica");
  });

  test("extrae multiplicidad OPCloud con +, * y rangos estrella", () => {
    expect(extraerMultiplicidad("+ **Componentes**")).toEqual({ multiplicidad: "+", nombre: "**Componentes**" });
    expect(extraerMultiplicidad("2..* **Partes**")).toEqual({ multiplicidad: "2..*", nombre: "**Partes**" });
    expect(extraerMultiplicidad("* **Veces**")).toEqual({ multiplicidad: "*", nombre: "**Veces**" });
    expect(extraerMultiplicidad("un **Techo Descapotable** opcional")).toEqual({ multiplicidad: "0..1", nombre: "**Techo Descapotable**" });
  });

  test("parsea descripcion canonica de cosa", () => {
    const result = parsearParrafoOpl("Sensor es un objeto físico y sistémico.");

    expect(result.diagnosticos).toEqual([]);
    expect(result.ast).toEqual([
      {
        kind: "descripcion-cosa",
        linea: 1,
        nombre: "Sensor",
        tipoEntidad: "objeto",
        esencia: "fisica",
        afiliacion: "sistemica",
      },
    ]);
  });

  test("parsea estados, enlace procedural con estado y enlace estructural multi-destino", () => {
    const result = parsearParrafoOpl([
      "Pedido puede ser abierto o cerrado.",
      "Procesar Pedido consume Pedido en abierto.",
      "Sistema consta de Pedido y Operador.",
    ].join("\n"));

    expect(result.diagnosticos).toEqual([]);
    expect(result.ast[0]).toMatchObject({ kind: "estados", objeto: "Pedido", estados: ["abierto", "cerrado"] });
    expect(result.ast[1]).toMatchObject({
      kind: "procedimental",
      tipoEnlace: "consumo",
      proceso: "Procesar Pedido",
      objeto: "Pedido",
      estadoEntrada: "abierto",
    });
    expect(result.ast[2]).toMatchObject({
      kind: "estructural",
      tipoEnlace: "agregacion",
      origen: "Sistema",
      destinos: ["Pedido", "Operador"],
    });
  });

  test("parsea exhibicion opcional singular y agrupada", () => {
    const result = parsearParrafoOpl([
      "**Auto** tiene un **Techo Descapotable** opcional.",
      "**Auto** tiene **Techo Descapotable** y **Spoiler** opcionales.",
    ].join("\n"));

    expect(result.diagnosticos).toEqual([]);
    expect(result.ast[0]).toMatchObject({
      kind: "estructural",
      tipoEnlace: "exhibicion",
      origen: "Auto",
      destinos: ["Techo Descapotable"],
      multiplicidadDestino: "0..1",
    });
    expect(result.ast[1]).toMatchObject({
      kind: "estructural",
      tipoEnlace: "exhibicion",
      origen: "Auto",
      destinos: ["Techo Descapotable", "Spoiler"],
      multiplicidadDestino: "0..1",
    });
  });

  test("emite diagnostico para oraciones sin punto o no soportadas", () => {
    const sinPunto = parsearParrafoOpl("Sensor es un objeto físico y sistémico");
    expect(sinPunto.diagnosticos[0]?.codigo).toBe("syntax-error");

    const noSoportada = parsearParrafoOpl("Sensor baila con Pedido.");
    expect(noSoportada.ast[0]?.kind).toBe("unsupported");
    expect(noSoportada.diagnosticos[0]?.codigo).toBe("syntax-error");
  });
});

describe("parser OPL — eventos (SSOT §6: ET/EH/ETS/EHS)", () => {
  test("ET-agente: 'X inicia y maneja Y' (subclausula implicita agente)", () => {
    const result = parsearParrafoOpl("**Operador** inicia y maneja *Procesar*.");
    expect(result.diagnosticos).toEqual([]);
    expect(result.ast[0]).toMatchObject({
      kind: "evento",
      iniciador: "Operador",
      proceso: "Procesar",
      base: { tipoEnlace: "agente", objeto: "Operador", proceso: "Procesar" },
    });
  });

  test("ET-invocacion: 'X inicia e invoca Y'", () => {
    const result = parsearParrafoOpl("*Revisar* inicia e invoca *Aprobar*.");
    expect(result.diagnosticos).toEqual([]);
    expect(result.ast[0]).toMatchObject({
      kind: "evento",
      iniciador: "Revisar",
      proceso: "Aprobar",
      base: { tipoEnlace: "invocacion", origen: "Revisar", destino: "Aprobar" },
    });
  });

  test("ET-instrumento (EH1): 'X inicia Y, que requiere X'", () => {
    const result = parsearParrafoOpl("**Llave** inicia *Abrir*, que requiere **Llave**.");
    expect(result.diagnosticos).toEqual([]);
    expect(result.ast[0]).toMatchObject({
      kind: "evento",
      iniciador: "Llave",
      proceso: "Abrir",
      base: { tipoEnlace: "instrumento", proceso: "Abrir", objeto: "Llave" },
    });
  });

  test("ET-consumo (ET1): 'X inicia Y, que consume X' con probabilidad descartable", () => {
    const result = parsearParrafoOpl("**Producto** inicia *Procesar*, que consume **Producto** (probabilidad: 70%).");
    expect(result.diagnosticos).toEqual([]);
    expect(result.ast[0]).toMatchObject({
      kind: "evento",
      iniciador: "Producto",
      proceso: "Procesar",
      base: { tipoEnlace: "consumo", proceso: "Procesar", objeto: "Producto" },
    });
  });

  test("ETS-consumo (ETS1): 'X en `s` inicia Y, que consume X en `s`'", () => {
    const result = parsearParrafoOpl("**Pedido** en `pendiente` inicia *Procesar*, que consume **Pedido** en `pendiente`.");
    expect(result.diagnosticos).toEqual([]);
    expect(result.ast[0]).toMatchObject({
      kind: "evento",
      iniciador: "Pedido",
      iniciadorEstado: "pendiente",
      proceso: "Procesar",
      base: { tipoEnlace: "consumo", proceso: "Procesar", objeto: "Pedido", estadoEntrada: "pendiente" },
    });
  });

  test("ETS2 (transicion): 'X en `s1` inicia Y, que cambia X de `s1` a `s2`'", () => {
    const result = parsearParrafoOpl("**Pedido** en `pendiente` inicia *Procesar*, que cambia **Pedido** de `pendiente` a `aprobado` (probabilidad: 70%).");
    expect(result.diagnosticos).toEqual([]);
    expect(result.ast[0]).toMatchObject({
      kind: "evento",
      iniciador: "Pedido",
      iniciadorEstado: "pendiente",
      proceso: "Procesar",
      base: {
        tipoEnlace: "efecto",
        proceso: "Procesar",
        objeto: "Pedido",
        estadoEntrada: "pendiente",
        estadoSalida: "aprobado",
      },
    });
  });

  test("EHS1: 'X en `s` inicia Y, que requiere X'", () => {
    const result = parsearParrafoOpl("**Operador** en `disponible` inicia *Atender*, que requiere **Operador**.");
    expect(result.diagnosticos).toEqual([]);
    expect(result.ast[0]).toMatchObject({
      kind: "evento",
      iniciador: "Operador",
      iniciadorEstado: "disponible",
      proceso: "Atender",
      base: { tipoEnlace: "instrumento", proceso: "Atender", objeto: "Operador" },
    });
  });

  test("ET-resultado: 'Y inicia X, que genera Y'", () => {
    const result = parsearParrafoOpl("**Producto** inicia *Fabricar*, que genera **Producto**.");
    expect(result.diagnosticos).toEqual([]);
    expect(result.ast[0]).toMatchObject({
      kind: "evento",
      iniciador: "Producto",
      proceso: "Fabricar",
      base: { tipoEnlace: "resultado", proceso: "Fabricar", objeto: "Producto" },
    });
  });

  test("ET-efecto: 'X inicia Y, que afecta X'", () => {
    const result = parsearParrafoOpl("**Pedido** inicia *Revisar*, que afecta **Pedido**.");
    expect(result.diagnosticos).toEqual([]);
    expect(result.ast[0]).toMatchObject({
      kind: "evento",
      iniciador: "Pedido",
      proceso: "Revisar",
      base: { tipoEnlace: "efecto", proceso: "Revisar", objeto: "Pedido" },
    });
  });

  test("'X inicia Y' sin sub-clausula → evento + invocacion implicita (no base)", () => {
    const result = parsearParrafoOpl("*Disparador* inicia *Procesar*.");
    expect(result.diagnosticos).toEqual([]);
    expect(result.ast[0]).toMatchObject({
      kind: "evento",
      iniciador: "Disparador",
      proceso: "Procesar",
    });
    const evento = result.ast[0]!;
    if (evento.kind !== "evento") throw new Error("esperaba evento");
    expect(evento.base).toBeUndefined();
  });
});
