// F1 (solicitud upstream hd-opm e1-followups 2026-06-09): `aparecerEnlacePorId`
// resuelve por id de enlace lógico, no por (origen, destino, tipo). Necesario
// para multi-edges legítimos (mismos extremos + mismo tipo, distinguidos solo
// por su transición de estado), que `aparecerEnlace` rechaza como ambiguos.
// Debe usar el MISMO contador global `aparienciaEnlaceSeq` (esquema `ae-<n>`).

import { describe, expect, test } from "bun:test";
import { crearAutor } from "./index";
import type { Modelo } from "../modelo/tipos";

function idsAeEnModelo(modelo: Modelo): string[] {
  return Object.values(modelo.opds).flatMap((opd) => Object.keys(opd.enlaces));
}

function autorMultiEdge() {
  const a = crearAutor({ id: "x", nombre: "X" });
  a.entidad("p", "proceso", "Evaluacion de la solicitud", "fisica", "sistemica");
  a.entidad("o", "objeto", "Solicitud", "informacional", "sistemica");
  a.estados("o", ["recibida", "aceptada", "rechazada"], "recibida");
  a.opd("sd", "SD", null);
  a.ver("sd", "p", 0, 0);
  a.ver("sd", "o", 200, 0);
  // Multi-edge legítimo: mismos extremos + mismo tipo, distinta transición.
  const eAcepta = a.enlazar("sd", "p", "o", "efecto", { entrada: "recibida", salida: "aceptada" });
  const eRechaza = a.enlazar("sd", "p", "o", "efecto", { entrada: "recibida", salida: "rechazada" });
  if (!eAcepta || !eRechaza) throw new Error("enlazar devolvió null");
  a.opd("vista", "SD-Vista", null);
  a.vistaGenerica("vista");
  return { a, eAcepta, eRechaza };
}

describe("F1 — aparecerEnlacePorId (multi-edge por transición de estado)", () => {
  test("motivación: aparecerEnlace rechaza el multi-edge como ambiguo", () => {
    const { a } = autorMultiEdge();
    expect(() => a.aparecerEnlace("vista", "p", "o", "efecto")).toThrow(/ambiguo/);
  });

  test("añade la aparición del enlace identificado por id", () => {
    const { a, eAcepta } = autorMultiEdge();
    const apId = a.aparecerEnlacePorId("vista", eAcepta);
    expect(apId).toMatch(/^ae-\d+$/);
    const vista = a.modelo.opds["opd-vista"]!;
    const apariciones = Object.values(vista.enlaces);
    expect(apariciones).toHaveLength(1);
    expect(apariciones[0]!.enlaceId).toBe(eAcepta);
  });

  test("es idempotente: si ya aparece en el OPD, devuelve la misma apariencia", () => {
    const { a, eAcepta } = autorMultiEdge();
    const primera = a.aparecerEnlacePorId("vista", eAcepta);
    const segunda = a.aparecerEnlacePorId("vista", eAcepta);
    expect(segunda).toBe(primera);
    expect(Object.values(a.modelo.opds["opd-vista"]!.enlaces)).toHaveLength(1);
  });

  test("preserva el contador global ae-<n>: ids nuevos, únicos, sin colisión", () => {
    const { a, eAcepta, eRechaza } = autorMultiEdge();
    const antes = new Set(idsAeEnModelo(a.modelo));
    const ap1 = a.aparecerEnlacePorId("vista", eAcepta);
    const ap2 = a.aparecerEnlacePorId("vista", eRechaza);
    expect(antes.has(ap1)).toBe(false);
    expect(antes.has(ap2)).toBe(false);
    expect(ap1).not.toBe(ap2);
    // Invariante global: ningún id de aparición de enlace se repite en todo el modelo.
    const todos = idsAeEnModelo(a.modelo);
    expect(new Set(todos).size).toBe(todos.length);
  });

  test("lanza si el enlace lógico no existe", () => {
    const { a } = autorMultiEdge();
    expect(() => a.aparecerEnlacePorId("vista", "e-inexistente")).toThrow(/no existe/);
  });
});
