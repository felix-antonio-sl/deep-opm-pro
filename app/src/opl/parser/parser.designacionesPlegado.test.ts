import { describe, expect, test } from "bun:test";
import {
  aplicarPatchesOpl,
  parsearParrafoOpl,
  planificarEdicionOplLibre,
} from ".";
import {
  designacionesEstado,
} from "../../modelo/estadosDesignaciones";
import {
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  estadosDeEntidad,
  renombrarEstado,
} from "../../modelo/operaciones";
import type { Estado, Modelo, Resultado } from "../../modelo/tipos";
import { generarOpl } from "../generar";

describe("OPL reverse — designaciones D7-D10 (ronda26/L5)", () => {
  test("parsea designaciones inicial, final, default y current", () => {
    const result = parsearParrafoOpl([
      "**Pedido** en `abierto` es inicial.",
      "**Pedido** en `cerrado` es final.",
      "**Pedido** en `abierto` es Default.",
      "**Pedido** en `cerrado` es Current.",
    ].join("\n"));

    expect(result.diagnosticos).toEqual([]);
    expect(result.ast.map((item) => item.kind)).toEqual([
      "designacion-estado",
      "designacion-estado",
      "designacion-estado",
      "designacion-estado",
    ]);
    expect(result.ast[0]).toMatchObject({
      kind: "designacion-estado",
      entidad: "Pedido",
      estado: "abierto",
      designacion: "inicial",
    });
    expect(result.ast[1]).toMatchObject({ designacion: "final" });
    expect(result.ast[2]).toMatchObject({ designacion: "default" });
    expect(result.ast[3]).toMatchObject({ designacion: "current" });
  });

  test("acepta sinonimos 'por defecto' y 'actual' como default/current", () => {
    const result = parsearParrafoOpl([
      "**Pedido** en `abierto` es por defecto.",
      "**Pedido** en `cerrado` es actual.",
    ].join("\n"));

    expect(result.diagnosticos).toEqual([]);
    expect(result.ast[0]).toMatchObject({ kind: "designacion-estado", designacion: "default" });
    expect(result.ast[1]).toMatchObject({ kind: "designacion-estado", designacion: "current" });
  });

  test("planifica patch aplicar-designacion-estado y muta el modelo (inicial)", () => {
    const { modelo, pedidoId, estados } = setupPedidoConEstados();

    const texto = generarOpl(modelo).join("\n") + "\n**Pedido** en `abierto` es inicial.";
    const preview = planificarEdicionOplLibre(modelo, texto);

    expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toEqual([]);
    expect(preview.patches).toEqual([
      {
        tipo: "aplicar-designacion-estado",
        linea: 3,
        entidadId: pedidoId,
        estadoNombre: "abierto",
        designacion: "inicial",
      },
    ]);

    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches));
    const abierto = aplicado.estados[estados[0]!.id]! as Estado;
    expect(designacionesEstado(abierto)).toContain("inicial");
    expect(generarOpl(aplicado)).toContain("**Pedido** en `abierto` es inicial.");
  });

  test("aplica final sin tocar otras designaciones (aditividad)", () => {
    const { modelo, estados } = setupPedidoConEstados();
    const texto = generarOpl(modelo).join("\n") + "\n**Pedido** en `cerrado` es final.";
    const preview = planificarEdicionOplLibre(modelo, texto);
    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches));
    const cerrado = aplicado.estados[estados[1]!.id]! as Estado;
    expect(designacionesEstado(cerrado)).toEqual(["final"]);
  });

  test("aplica default (single-per-entidad) reemplazando si existe otro", () => {
    const { modelo, estados } = setupPedidoConEstados();
    const intermedio = planificarEdicionOplLibre(
      modelo,
      generarOpl(modelo).join("\n") + "\n**Pedido** en `abierto` es Default.",
    );
    const m2 = must(aplicarPatchesOpl(modelo, intermedio.patches));
    expect(designacionesEstado(m2.estados[estados[0]!.id]!)).toContain("default");
    expect(designacionesEstado(m2.estados[estados[1]!.id]!)).not.toContain("default");

    const preview = planificarEdicionOplLibre(
      m2,
      generarOpl(m2).join("\n") + "\n**Pedido** en `cerrado` es Default.",
    );
    const m3 = must(aplicarPatchesOpl(m2, preview.patches));
    expect(designacionesEstado(m3.estados[estados[0]!.id]!)).not.toContain("default");
    expect(designacionesEstado(m3.estados[estados[1]!.id]!)).toContain("default");
  });

  test("aplica current con misma logica de exclusividad", () => {
    const { modelo, estados } = setupPedidoConEstados();
    const texto = generarOpl(modelo).join("\n") + "\n**Pedido** en `cerrado` es Current.";
    const preview = planificarEdicionOplLibre(modelo, texto);
    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches));
    expect(designacionesEstado(aplicado.estados[estados[1]!.id]!)).toContain("current");
  });

  test("idempotencia: re-aplicar la misma designacion no genera patch", () => {
    const { modelo } = setupPedidoConEstados();
    const textoBase = generarOpl(modelo).join("\n") + "\n**Pedido** en `abierto` es inicial.";
    const previo = planificarEdicionOplLibre(modelo, textoBase);
    const conInicial = must(aplicarPatchesOpl(modelo, previo.patches));

    const reaplicar = planificarEdicionOplLibre(conInicial, generarOpl(conInicial).join("\n"));
    expect(reaplicar.patches).toEqual([]);
  });

  test("diagnostica unknown-symbol si el estado no existe", () => {
    const { modelo } = setupPedidoConEstados();
    const texto = generarOpl(modelo).join("\n") + "\n**Pedido** en `fantasma` es inicial.";
    const preview = planificarEdicionOplLibre(modelo, texto);
    expect(preview.diagnosticos.some((d) => d.codigo === "unknown-symbol" && d.severidad === "error")).toBe(true);
  });

  test("roundtrip parser↔generador para inicial+final en el mismo lote", () => {
    const { modelo } = setupPedidoConEstados();
    const texto = generarOpl(modelo).join("\n")
      + "\n**Pedido** en `abierto` es inicial."
      + "\n**Pedido** en `cerrado` es final.";
    const preview = planificarEdicionOplLibre(modelo, texto);
    expect(preview.diagnosticos.filter((d) => d.severidad === "error")).toEqual([]);
    const aplicado = must(aplicarPatchesOpl(modelo, preview.patches));
    const regenerado = generarOpl(aplicado).join("\n");
    expect(regenerado).toContain("**Pedido** en `abierto` es inicial.");
    expect(regenerado).toContain("**Pedido** en `cerrado` es final.");
  });
});

describe("OPL reverse — plegado parcial §10.5 informacional (ronda26/L5)", () => {
  test("parsea plegado parcial con N partes elididas y rol rasgos", () => {
    const result = parsearParrafoOpl(
      "**Vehiculo** se lista con **Parte 1**, **Parte 2** y **Parte 3** y 2 partes más como rasgos.",
    );
    expect(result.ast[0]).toMatchObject({
      kind: "plegado-parcial",
      entidad: "Vehiculo",
      partesExplicitas: ["Parte 1", "Parte 2", "Parte 3"],
      partesElididas: 2,
      rol: "rasgos",
    });
    expect(result.diagnosticos[0]).toMatchObject({
      codigo: "unsupported-kernel",
      severidad: "info",
    });
  });

  test("acepta variante con rol 'partes'", () => {
    const result = parsearParrafoOpl(
      "**Sistema** se lista con **A** y **B** y 3 partes más como partes.",
    );
    expect(result.ast[0]).toMatchObject({
      kind: "plegado-parcial",
      entidad: "Sistema",
      partesExplicitas: ["A", "B"],
      partesElididas: 3,
      rol: "partes",
    });
  });

  test("planifica plegado parcial sin emitir patches (informacional)", () => {
    const modelo = crearModelo("plegado");
    const preview = planificarEdicionOplLibre(
      modelo,
      "**Vehiculo** se lista con **Parte 1** y **Parte 2** y 4 partes más como rasgos.",
    );
    expect(preview.patches).toEqual([]);
    expect(preview.diagnosticos.every((d) => d.severidad !== "error")).toBe(true);
    expect(preview.diagnosticos.some((d) => d.severidad === "info")).toBe(true);
  });
});

function setupPedidoConEstados(): { modelo: Modelo; pedidoId: string; estados: Estado[] } {
  let modelo = crearModelo("designaciones");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Pedido"));
  const pedidoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Pedido")!.id;
  modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
  const baseEstados = estadosDeEntidad(modelo, pedidoId);
  modelo = must(renombrarEstado(modelo, baseEstados[0]!.id, "abierto"));
  modelo = must(renombrarEstado(modelo, baseEstados[1]!.id, "cerrado"));
  const estados = estadosDeEntidad(modelo, pedidoId);
  return { modelo, pedidoId, estados };
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value as T;
}
