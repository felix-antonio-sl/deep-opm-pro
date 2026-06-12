import { describe, expect, test } from "bun:test";
import { agregarNotaMesa } from "../modelo/notasMesa";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../modelo/tipos";
import { hidratarModelo } from "./json";
import {
  ATRIBUTOS_DE_PERFIL,
  PERFIL_DEFAULT_DIAGRAMA,
  PERFIL_DEFAULT_DOCUMENTO,
  PERFILES_EXPORT,
  emitirDocumentoCanonico,
  exportarModeloConPerfil,
  filtrarModeloPorPerfil,
  gateDensidadCanonica,
} from "./perfilesExport";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function modeloBase(): Modelo {
  let m = crearModelo("Perfiles");
  m = must(crearObjeto(m, m.opdRaizId, { x: 20, y: 80 }, "Entrada"));
  m = must(crearProceso(m, m.opdRaizId, { x: 220, y: 80 }, "Procesar"));
  m = must(crearEnlace(m, m.opdRaizId, entidadPorNombre(m, "Entrada"), entidadPorNombre(m, "Procesar"), "consumo"));
  return m;
}

function conExtensiones(m: Modelo): Modelo {
  const conNota = must(agregarNotaMesa(m, { tipo: "modelo" }, "nota interna de mesa", "2026-06-11"));
  return {
    ...conNota,
    ontologia: { modo: "suggest", terminos: [] },
    procedencia: { protoHash: "abc", autoriaVersion: "1.0.0", layoutVersion: "3" },
  };
}

describe("perfiles de export (R-VIS-EXP-2)", () => {
  test("canon-diagrama excluye notas de mesa, ontología y procedencia", () => {
    const filtrado = filtrarModeloPorPerfil(conExtensiones(modeloBase()), "canon-diagrama");
    expect(filtrado.notasMesa).toBeUndefined();
    expect(filtrado.ontologia).toBeUndefined();
    expect(filtrado.procedencia).toBeUndefined();
    expect(filtrado.satisfaccionesRequisito).toBeUndefined();
  });

  test("canon-documento conserva procedencia pero excluye notas de mesa y ontología", () => {
    const filtrado = filtrarModeloPorPerfil(conExtensiones(modeloBase()), "canon-documento");
    expect(filtrado.notasMesa).toBeUndefined();
    expect(filtrado.ontologia).toBeUndefined();
    expect(filtrado.procedencia).toBeDefined();
  });

  test("intercambio es la identidad", () => {
    const modelo = conExtensiones(modeloBase());
    expect(filtrarModeloPorPerfil(modelo, "intercambio")).toBe(modelo);
  });

  test("el export canónico es hidratable (roundtrip del perfil)", () => {
    const json = must(exportarModeloConPerfil(conExtensiones(modeloBase()), "canon-diagrama"));
    const hidratado = hidratarModelo(json);
    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(hidratado.value.notasMesa ?? {}).toEqual({});
  });

  test("gate de densidad bloquea el export canónico con OPD sobre el máximo", () => {
    let m = modeloBase();
    for (let i = 0; i < 26; i += 1) {
      m = must(crearObjeto(m, m.opdRaizId, { x: 20 + i * 30, y: 300 }, `Cosa ${i}`));
    }
    expect(gateDensidadCanonica(m).ok).toBe(false);
    const canonico = exportarModeloConPerfil(m, "canon-diagrama");
    expect(canonico.ok).toBe(false);
    if (!canonico.ok) expect(canonico.error).toContain("densidad");
    // intercambio (export histórico/persistencia) NO se gatea.
    expect(must(exportarModeloConPerfil(m, "intercambio")).length).toBeGreaterThan(0);
  });

  test("documento canónico: portada, métricas, árbol, OPL y procedencia; sin notas de mesa", () => {
    const doc = must(emitirDocumentoCanonico(conExtensiones(modeloBase())));
    expect(doc).toContain("# Perfiles");
    expect(doc).toContain("## Métricas del modelo");
    expect(doc).toContain("## Árbol de OPDs");
    expect(doc).toContain("## OPL completa");
    expect(doc).toContain("## Procedencia");
    expect(doc).not.toContain("nota interna de mesa");
  });
});

describe("declaraciones de export (V-226 / R-VIS-EXP-5)", () => {
  test("los defaults por familia están declarados y son perfiles válidos", () => {
    expect(PERFILES_EXPORT).toContain(PERFIL_DEFAULT_DIAGRAMA);
    expect(PERFILES_EXPORT).toContain(PERFIL_DEFAULT_DOCUMENTO);
  });

  test("cada atributo de perfil declarado persiste SOLO en canon-documento", () => {
    const modelo = conExtensiones(modeloBase());
    const diagrama = filtrarModeloPorPerfil(modelo, "canon-diagrama");
    const documento = filtrarModeloPorPerfil(modelo, "canon-documento");
    for (const clave of ATRIBUTOS_DE_PERFIL["canon-documento"]) {
      if (modelo[clave] === undefined) continue;
      expect(diagrama[clave]).toBeUndefined();
      expect(documento[clave]).toBeDefined();
    }
  });
});
