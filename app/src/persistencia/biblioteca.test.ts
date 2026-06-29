import { describe, expect, test } from "bun:test";
import {
  construirModeloPersistido,
  resumenDesdeModeloPersistido,
  type ModeloPersistido,
} from "./modelos";
import { listarBibliotecas, marcarBiblioteca, type WorkspaceIndice } from "./workspace";

// B1 — Contrato del flag `esBiblioteca`. Estos tests fallan si el flag se pierde
// en cualquier tramo del roundtrip (construir → resumen) o si el read-path deja
// de filtrar por designación de biblioteca.
describe("biblioteca — flag esBiblioteca", () => {
  const json = JSON.stringify({ formato: "deep-opm-pro.modelo.v0", modelo: { id: "lib-1" } });

  test("construirModeloPersistido propaga esBiblioteca desde el input", () => {
    const modelo = construirModeloPersistido({ id: "lib-1", nombre: "gist", json, esBiblioteca: true });
    expect(modelo.esBiblioteca).toBe(true);
  });

  test("resumenDesdeModeloPersistido conserva el flag en el roundtrip", () => {
    const modelo: ModeloPersistido = construirModeloPersistido({
      id: "lib-1",
      nombre: "gist",
      json,
      esBiblioteca: true,
    });
    const resumen = resumenDesdeModeloPersistido(modelo);
    expect(resumen.esBiblioteca).toBe(true);
    // Falsabilidad: si el resumen perdiera el flag, esta igualdad rompe.
    expect(resumen).toEqual(expect.objectContaining({ id: "lib-1", esBiblioteca: true }));
  });

  test("hereda esBiblioteca del modelo existente cuando el input lo omite", () => {
    const previo = construirModeloPersistido({ id: "lib-1", nombre: "gist", json, esBiblioteca: true });
    const reguardado = construirModeloPersistido({ id: "lib-1", nombre: "gist", json }, previo);
    expect(reguardado.esBiblioteca).toBe(true);
  });

  test("un modelo sin el flag no lo gana (omitido, no false por defecto)", () => {
    const modelo = construirModeloPersistido({ id: "modelo-normal", nombre: "Normal", json });
    expect(modelo.esBiblioteca).toBeUndefined();
    expect(resumenDesdeModeloPersistido(modelo).esBiblioteca).toBeUndefined();
  });
});

describe("biblioteca — toggle y read-path sobre el indice", () => {
  function indice(): WorkspaceIndice {
    return {
      modelos: [
        { id: "lib-1", carpetaId: null },
        { id: "modelo-2", carpetaId: null },
        { id: "lib-3", carpetaId: null, esBiblioteca: true },
      ],
      carpetas: [],
      recientes: [],
    };
  }

  test("marcarBiblioteca designa y retira la designacion", () => {
    const marcado = marcarBiblioteca(indice(), "lib-1", true);
    expect(marcado.modelos.find((m) => m.id === "lib-1")?.esBiblioteca).toBe(true);

    const desmarcado = marcarBiblioteca(marcado, "lib-1", false);
    // Retirar omite el flag, no lo deja en false (indice minimo).
    expect(desmarcado.modelos.find((m) => m.id === "lib-1")).toEqual({ id: "lib-1", carpetaId: null });
  });

  test("listarBibliotecas devuelve solo las bibliotecas designadas", () => {
    const base = indice();
    expect(listarBibliotecas(base).map((m) => m.id)).toEqual(["lib-3"]);

    const tras = marcarBiblioteca(base, "lib-1", true);
    expect(listarBibliotecas(tras).map((m) => m.id).sort()).toEqual(["lib-1", "lib-3"]);

    const ninguna = marcarBiblioteca(tras, "lib-3", false);
    expect(listarBibliotecas(marcarBiblioteca(ninguna, "lib-1", false))).toEqual([]);
  });
});
