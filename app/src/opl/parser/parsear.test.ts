import { describe, expect, test } from "bun:test";
import { parsearParrafoOpl, normalizarNombreOpl, claveNombre } from "./parsear";

describe("parser OPL reverse base", () => {
  test("normaliza markdown, numeracion, alias y unidades para resolver nombres", () => {
    expect(normalizarNombreOpl("1 **Sensor** [V] {alias}")).toBe("Sensor");
    expect(claveNombre("Medición Clínica")).toBe("medicion clinica");
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

  test("emite diagnostico para oraciones sin punto o no soportadas", () => {
    const sinPunto = parsearParrafoOpl("Sensor es un objeto físico y sistémico");
    expect(sinPunto.diagnosticos[0]?.codigo).toBe("syntax-error");

    const noSoportada = parsearParrafoOpl("Sensor baila con Pedido.");
    expect(noSoportada.ast[0]?.kind).toBe("unsupported");
    expect(noSoportada.diagnosticos[0]?.codigo).toBe("syntax-error");
  });
});
