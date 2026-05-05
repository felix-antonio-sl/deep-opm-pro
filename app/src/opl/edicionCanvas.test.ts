import { describe, expect, test } from "bun:test";
import { aplicarEdicionOpl, type IntencionEdicionOpl } from "./edicionCanvas";
import { crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso } from "../modelo/operaciones";
import type { Modelo } from "../modelo/tipos";

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function modeloConEntidad(): Modelo {
  let modelo = crearModelo("test-edicion");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 10 }, "Objeto A"));
  return modelo;
}

describe("aplicarEdicionOpl", () => {
  test("renombrar-entidad produce Resultado.ok con ids validos", () => {
    const modelo = modeloConEntidad();
    const entId = Object.values(modelo.entidades).find((e) => e.nombre === "Objeto A")!.id;
    const intencion: IntencionEdicionOpl = { tipo: "renombrar-entidad", id: entId, nombre: "Renombrado" };
    const resultado = aplicarEdicionOpl(modelo, intencion);
    expect(resultado.ok).toBe(true);
    if (resultado.ok) {
      expect(resultado.value.entidades[entId]?.nombre).toBe("Renombrado");
    }
  });

  test("renombrar-entidad produce Resultado.error con id invalido", () => {
    const modelo = modeloConEntidad();
    const intencion: IntencionEdicionOpl = { tipo: "renombrar-entidad", id: "no-existe", nombre: "X" };
    const resultado = aplicarEdicionOpl(modelo, intencion);
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) {
      expect(resultado.error).toContain("no existe");
    }
  });

  test("renombrar-estado produce Resultado.ok con ids validos", () => {
    let modelo = modeloConEntidad();
    const objId = Object.values(modelo.entidades).find((e) => e.tipo === "objeto")!.id;
    const estadosResult = crearEstadosIniciales(modelo, objId);
    modelo = must(estadosResult).modelo;
    const estadoId = Object.keys(modelo.estados)[0];
    if (!estadoId) throw new Error("setup: sin estados");
    const intencion: IntencionEdicionOpl = { tipo: "renombrar-estado", estadoId, nombre: "nuevo-nombre" };
    const resultado = aplicarEdicionOpl(modelo, intencion);
    expect(resultado.ok).toBe(true);
    if (resultado.ok) {
      expect(resultado.value.estados[estadoId]?.nombre).toBe("nuevo-nombre");
    }
  });

  test("renombrar-estado produce Resultado.error con id invalido", () => {
    const modelo = modeloConEntidad();
    const intencion: IntencionEdicionOpl = { tipo: "renombrar-estado", estadoId: "no-existe", nombre: "X" };
    const resultado = aplicarEdicionOpl(modelo, intencion);
    expect(resultado.ok).toBe(false);
  });

  test("fijar-etiqueta-enlace produce Resultado.ok con ids validos", () => {
    let modelo = modeloConEntidad();
    const objAId = Object.values(modelo.entidades).find((e) => e.tipo === "objeto")!.id;
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 80 }, "Objeto B"));
    const objBId = Object.values(modelo.entidades).find((e) => e.nombre === "Objeto B")!.id;
    // Signature: crearEnlace(modelo, opdId, origenId, destinoId, tipo)
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, objAId, objBId, "agregacion"));
    const enlaceId = Object.keys(modelo.enlaces).find((id) => modelo.enlaces[id]?.tipo === "agregacion")!;
    const intencion: IntencionEdicionOpl = { tipo: "fijar-etiqueta-enlace", enlaceId, etiqueta: "parte critica" };
    const resultado = aplicarEdicionOpl(modelo, intencion);
    expect(resultado.ok).toBe(true);
    if (resultado.ok) {
      expect(resultado.value.enlaces[enlaceId]?.etiqueta).toBe("parte critica");
    }
  });

  test("fijar-etiqueta-enlace produce Resultado.error con enlace inexistente", () => {
    const modelo = modeloConEntidad();
    const intencion: IntencionEdicionOpl = { tipo: "fijar-etiqueta-enlace", enlaceId: "no-existe", etiqueta: "x" };
    const resultado = aplicarEdicionOpl(modelo, intencion);
    expect(resultado.ok).toBe(false);
  });

  test("abrir-inspector-enlace no muta el modelo y retorna ok con ids validos", () => {
    let modelo = modeloConEntidad();
    const objAId = Object.values(modelo.entidades).find((e) => e.tipo === "objeto")!.id;
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 10, y: 80 }, "Objeto B"));
    const objBId = Object.values(modelo.entidades).find((e) => e.nombre === "Objeto B")!.id;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, objAId, objBId, "agregacion"));
    const enlaceId = Object.keys(modelo.enlaces).find((id) => modelo.enlaces[id]?.tipo === "agregacion")!;
    const intencion: IntencionEdicionOpl = { tipo: "abrir-inspector-enlace", enlaceId };
    const resultado = aplicarEdicionOpl(modelo, intencion);
    expect(resultado.ok).toBe(true);
    if (resultado.ok) {
      // El modelo no debe cambiar
      expect(resultado.value).toBe(modelo);
    }
  });

  test("abrir-inspector-enlace produce Resultado.error con enlace inexistente", () => {
    const modelo = modeloConEntidad();
    const intencion: IntencionEdicionOpl = { tipo: "abrir-inspector-enlace", enlaceId: "no-existe" };
    const resultado = aplicarEdicionOpl(modelo, intencion);
    expect(resultado.ok).toBe(false);
  });
});
