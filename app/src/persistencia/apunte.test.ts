import { describe, expect, test } from "bun:test";
import {
  construirModeloPersistido,
  resumenDesdeModeloPersistido,
  type ModeloPersistido,
} from "./modelos";
import {
  graduarApunte,
  marcarApunte,
  marcarBiblioteca,
  reabrirModeloEnTaller,
  type WorkspaceIndice,
} from "./workspace";

// Modo apunte — gemelo de `esBiblioteca` + invariante de exclusión mutua.
// Spec: docs/superpowers/specs/2026-06-30-modo-apunte-design.md §3.5, §7.

describe("apunte — flag esApunte (gemelo de esBiblioteca)", () => {
  const json = JSON.stringify({ formato: "deep-opm-pro.modelo.v0", modelo: { id: "ap-1" } });

  test("construirModeloPersistido propaga esApunte desde el input", () => {
    const modelo = construirModeloPersistido({ id: "ap-1", nombre: "borrador", json, esApunte: true });
    expect(modelo.esApunte).toBe(true);
  });

  test("resumenDesdeModeloPersistido conserva el flag en el roundtrip", () => {
    const modelo: ModeloPersistido = construirModeloPersistido({
      id: "ap-1",
      nombre: "borrador",
      json,
      esApunte: true,
    });
    const resumen = resumenDesdeModeloPersistido(modelo);
    expect(resumen.esApunte).toBe(true);
    expect(resumen).toEqual(expect.objectContaining({ id: "ap-1", esApunte: true }));
  });

  test("hereda esApunte del modelo existente cuando el input lo omite", () => {
    const previo = construirModeloPersistido({ id: "ap-1", nombre: "borrador", json, esApunte: true });
    const reguardado = construirModeloPersistido({ id: "ap-1", nombre: "borrador", json }, previo);
    expect(reguardado.esApunte).toBe(true);
  });

  test("graduar a modelo: esApunte queda AUSENTE, no false (corrección 8)", () => {
    const previo = construirModeloPersistido({ id: "ap-1", nombre: "borrador", json, esApunte: true });
    // El toggle de promoción setea el flag en el índice (marcarApunte false); a
    // nivel de record un modelo sin el flag no lo gana.
    const modelo = construirModeloPersistido({ id: "modelo-normal", nombre: "Normal", json });
    expect(modelo.esApunte).toBeUndefined();
    expect(resumenDesdeModeloPersistido(modelo).esApunte).toBeUndefined();
    // Sanity: el previo sí lo portaba.
    expect(previo.esApunte).toBe(true);
  });
});

describe("apunte — invariante de exclusión mutua apunte ⊕ biblioteca (corrección 5)", () => {
  function indice(): WorkspaceIndice {
    return {
      modelos: [
        { id: "m-1", carpetaId: null },
        { id: "lib-1", carpetaId: null, esBiblioteca: true },
        { id: "ap-1", carpetaId: null, esApunte: true },
      ],
      carpetas: [],
      recientes: [],
    };
  }

  test("marcarApunte(true) designa apunte y RETIRA esBiblioteca", () => {
    const tras = marcarApunte(indice(), "lib-1", true);
    const modelo = tras.modelos.find((m) => m.id === "lib-1");
    expect(modelo?.esApunte).toBe(true);
    expect(modelo?.esBiblioteca).toBeUndefined();
  });

  test("marcarBiblioteca(true) designa biblioteca y RETIRA esApunte", () => {
    const tras = marcarBiblioteca(indice(), "ap-1", true);
    const modelo = tras.modelos.find((m) => m.id === "ap-1");
    expect(modelo?.esBiblioteca).toBe(true);
    expect(modelo?.esApunte).toBeUndefined();
  });

  test("marcarApunte(false) retira el flag (índice mínimo, no false)", () => {
    const tras = marcarApunte(indice(), "ap-1", false);
    expect(tras.modelos.find((m) => m.id === "ap-1")).toEqual({ id: "ap-1", carpetaId: null });
  });

  test("graduar valida el destino antes de retirar la especie", () => {
    const base = indice();
    expect(graduarApunte(base, "ap-1", "carpeta-inexistente")).toEqual({
      ok: false,
      error: "Carpeta destino no encontrada",
    });
    expect(base.modelos.find((m) => m.id === "ap-1")?.esApunte).toBe(true);
  });

  test("graduar produce nombre de especie y destino como un solo índice", () => {
    const base = {
      ...indice(),
      carpetas: [{ id: "carpeta-1", nombre: "Trabajo", padreId: null, creadoEn: 1 }],
    };
    const resultado = graduarApunte(base, "ap-1", "carpeta-1");
    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value.modelos.find((m) => m.id === "ap-1")).toEqual({
      id: "ap-1",
      carpetaId: "carpeta-1",
    });
  });

  test("graduar a Biblioteca abandona Apunte y fija rol en la misma transición", () => {
    const base = indice();
    const resultado = graduarApunte(base, "ap-1", null, "biblioteca");
    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value.modelos.find((m) => m.id === "ap-1")).toEqual({
      id: "ap-1",
      carpetaId: null,
      esBiblioteca: true,
    });
  });

  test("nunca coexisten ambos flags tras cualquier toggle", () => {
    const base = indice();
    for (const paso of [
      marcarApunte(base, "m-1", true),
      marcarBiblioteca(base, "m-1", true),
      marcarApunte(marcarBiblioteca(base, "m-1", true), "m-1", true),
    ]) {
      for (const modelo of paso.modelos) {
        expect(modelo.esApunte === true && modelo.esBiblioteca === true).toBe(false);
      }
    }
  });

  test("reabrir conserva el mismo registro y lo devuelve a Taller", () => {
    const base = indice();
    const resultado = reabrirModeloEnTaller(base, "m-1");
    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value.modelos).toHaveLength(base.modelos.length);
    expect(resultado.value.modelos.find((m) => m.id === "m-1")).toEqual({
      id: "m-1",
      carpetaId: null,
      esApunte: true,
    });
  });

  test("reabrir conserva la carpeta elegida explícitamente al graduar", () => {
    const base = {
      ...indice(),
      carpetas: [{ id: "carpeta-1", nombre: "Trabajo", padreId: null, creadoEn: 1 }],
    };
    const graduado = graduarApunte(base, "ap-1", "carpeta-1");
    expect(graduado.ok).toBe(true);
    if (!graduado.ok) return;

    const reabierto = reabrirModeloEnTaller(graduado.value, "ap-1");
    expect(reabierto.ok).toBe(true);
    if (!reabierto.ok) return;
    expect(reabierto.value.modelos.find((modelo) => modelo.id === "ap-1")).toEqual({
      id: "ap-1",
      carpetaId: "carpeta-1",
      esApunte: true,
    });
  });

  test("reabrir rechaza Apuntes y Bibliotecas sin mutar el índice", () => {
    const base = indice();
    expect(reabrirModeloEnTaller(base, "ap-1")).toEqual({
      ok: false,
      error: "El documento ya está en Taller",
    });
    expect(reabrirModeloEnTaller(base, "lib-1")).toEqual({
      ok: false,
      error: "Quita primero el rol Biblioteca para reabrir el Modelo en Taller",
    });
    expect(base.modelos.find((m) => m.id === "lib-1")?.esBiblioteca).toBe(true);
  });
});
