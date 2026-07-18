import { describe, expect, test } from "bun:test";
import { compareBoundarySignature } from "../modelo/equivalencia";
import type { Apariencia, AparienciaEnlace, Enlace, Entidad, Modelo, Opd, TipoEnlace } from "../modelo/tipos";

// Propiedades de la comparación de firma sobre realizaciones de interior
// realmente distinto (no OPDs idénticos): reflexiva, simétrica, pura.

function ent(id: string, tipo: "objeto" | "proceso"): Entidad {
  return { id, tipo, nombre: id, esencia: "informacional", afiliacion: "sistemica" };
}
function ap(id: string, entidadId: string, opdId: string): Apariencia {
  return { id, entidadId, opdId, x: 0, y: 0, width: 100, height: 50 };
}
function enl(id: string, tipo: TipoEnlace, origen: string, destino: string): Enlace {
  return { id, tipo, origenId: { kind: "entidad", id: origen }, destinoId: { kind: "entidad", id: destino }, etiqueta: "" };
}
function ae(id: string, enlaceId: string, opdId: string): AparienciaEnlace {
  return { id, enlaceId, opdId, vertices: [] };
}
function opd(id: string, padreId: string | null, aps: Apariencia[], aes: AparienciaEnlace[]): Opd {
  return {
    id,
    nombre: id,
    padreId,
    apariencias: Object.fromEntries(aps.map((a) => [a.id, a])),
    enlaces: Object.fromEntries(aes.map((x) => [x.id, x])),
  };
}

// P consume A produce B; opd 'a' usa subproceso P1, opd 'b' usa subproceso Q1
// (interior distinto, mismo rol neto de frontera → indistinguibles respecto
// de la firma declarada).
function modelo(): { modelo: Modelo; padreId: string; opdA: string; opdB: string } {
  const entidades: Record<string, Entidad> = {
    P: ent("P", "proceso"), A: ent("A", "objeto"), B: ent("B", "objeto"),
    P1: ent("P1", "proceso"), Q1: ent("Q1", "proceso"),
  };
  const enlaces: Record<string, Enlace> = {
    cA: enl("cA", "consumo", "A", "P"), rB: enl("rB", "resultado", "P", "B"),
    acA: enl("acA", "consumo", "A", "P1"), arB: enl("arB", "resultado", "P1", "B"),
    bcA: enl("bcA", "consumo", "A", "Q1"), brB: enl("brB", "resultado", "Q1", "B"),
  };
  const opds: Record<string, Opd> = {
    r: opd("r", null, [ap("rP", "P", "r"), ap("rA", "A", "r"), ap("rB", "B", "r")], [ae("aeC", "cA", "r"), ae("aeR", "rB", "r")]),
    a: opd("a", "r", [ap("aA", "A", "a"), ap("aB", "B", "a"), ap("aP1", "P1", "a")], [ae("aeAC", "acA", "a"), ae("aeAR", "arB", "a")]),
    b: opd("b", "r", [ap("bA", "A", "b"), ap("bB", "B", "b"), ap("bQ1", "Q1", "b")], [ae("aeBC", "bcA", "b"), ae("aeBR", "brB", "b")]),
  };
  return { modelo: { id: "m", nombre: "m", opdRaizId: "r", opds, entidades, estados: {}, enlaces, nextSeq: 100 }, padreId: "P", opdA: "a", opdB: "b" };
}

describe("LEY R-CAT-EQ-2 — igualdad de firma de frontera", () => {
  test("reflexiva: una realización tiene la misma firma que sí misma", () => {
    const { modelo: m, padreId, opdA } = modelo();
    const r = compareBoundarySignature(m, { padreId, opdA, opdB: opdA });
    expect(r.ok && r.value.sameSignature).toBe(true);
  });

  test("igualdad observable: a y b comparten firma con interior distinto", () => {
    const { modelo: m, padreId, opdA, opdB } = modelo();
    const r = compareBoundarySignature(m, { padreId, opdA, opdB });
    expect(r.ok && r.value.sameSignature).toBe(true);
    expect(r.ok && r.value.scope).toBe("boundary-signature");
  });

  test("simétrica: (a,b) y (b,a) dan el mismo veredicto", () => {
    const { modelo: m, padreId, opdA, opdB } = modelo();
    const r1 = compareBoundarySignature(m, { padreId, opdA, opdB });
    const r2 = compareBoundarySignature(m, { padreId, opdA: opdB, opdB: opdA });
    expect(r1.ok && r2.ok).toBe(true);
    if (r1.ok && r2.ok) expect(r1.value.sameSignature).toBe(r2.value.sameSignature);
  });

  test("pura: no muta el modelo", () => {
    const { modelo: m, padreId, opdA, opdB } = modelo();
    const antes = JSON.stringify(m);
    compareBoundarySignature(m, { padreId, opdA, opdB });
    expect(JSON.stringify(m)).toBe(antes);
  });
});
