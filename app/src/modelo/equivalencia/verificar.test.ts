import { describe, expect, test } from "bun:test";
import type { Apariencia, AparienciaEnlace, Enlace, Entidad, Modelo, Opd, TipoEnlace } from "../tipos";
import { verificarEquivalencia, type RealizacionAlternativa } from "./verificar";

// Tests REALES de equivalencia funcional (no tautológicos): un proceso P
// (consume A, produce B) con DOS descomposiciones de interior DISTINTO pero
// mismo rol neto de frontera. La equivalencia correcta (método A0) las ve
// equivalentes; distinto rol neto → no equivalentes.

function ent(id: string, tipo: "objeto" | "proceso", nombre: string): Entidad {
  return { id, tipo, nombre, esencia: "informacional", afiliacion: "sistemica" };
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

function modeloDosRealizaciones(): { modelo: Modelo; eq: RealizacionAlternativa } {
  const entidades: Record<string, Entidad> = {
    P: ent("P", "proceso", "Procesar"),
    A: ent("A", "objeto", "Insumo"),
    B: ent("B", "objeto", "Producto"),
    P1: ent("P1", "proceso", "Directo"),
    Q1: ent("Q1", "proceso", "Alterno"),
    X: ent("X", "objeto", "Intermedio"),
    Q2: ent("Q2", "proceso", "Segundo"),
  };
  const enlaces: Record<string, Enlace> = {
    "e-cA": enl("e-cA", "consumo", "A", "P"),
    "e-rB": enl("e-rB", "resultado", "P", "B"),
    // A: A → P1 → B (un subproceso directo)
    "ea-cA": enl("ea-cA", "consumo", "A", "P1"),
    "ea-rB": enl("ea-rB", "resultado", "P1", "B"),
    // B: A → Q1 → X → Q2 → B (dos subprocesos + intermedio; mismo rol neto sobre A y B)
    "eb-cA": enl("eb-cA", "consumo", "A", "Q1"),
    "eb-rX": enl("eb-rX", "resultado", "Q1", "X"),
    "eb-cX": enl("eb-cX", "consumo", "X", "Q2"),
    "eb-rB": enl("eb-rB", "resultado", "Q2", "B"),
  };
  const opds: Record<string, Opd> = {
    r: opd("r", null, [ap("apP", "P", "r"), ap("apA", "A", "r"), ap("apB", "B", "r")], [ae("aeCA", "e-cA", "r"), ae("aeRB", "e-rB", "r")]),
    a: opd("a", "r", [ap("aA", "A", "a"), ap("aB", "B", "a"), ap("aP1", "P1", "a")], [ae("aeaCA", "ea-cA", "a"), ae("aeaRB", "ea-rB", "a")]),
    b: opd(
      "b",
      "r",
      [ap("bA", "A", "b"), ap("bB", "B", "b"), ap("bQ1", "Q1", "b"), ap("bX", "X", "b"), ap("bQ2", "Q2", "b")],
      [ae("aebCA", "eb-cA", "b"), ae("aebRX", "eb-rX", "b"), ae("aebCX", "eb-cX", "b"), ae("aebRB", "eb-rB", "b")],
    ),
  };
  const modelo: Modelo = { id: "m", nombre: "m", opdRaizId: "r", opds, entidades, estados: {}, enlaces, nextSeq: 100 };
  return { modelo, eq: { padreId: "P", opdA: "a", opdB: "b" } };
}

describe("equivalencia/verificar — funcional (realizaciones alternativas, A0)", () => {
  test("interior distinto, mismo rol neto de frontera (A consumida, B producida) → equivalentes", () => {
    const { modelo, eq } = modeloDosRealizaciones();
    const r = verificarEquivalencia(modelo, eq);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.equivalente).toBe(true);
  });

  test("rol neto distinto (una descomposición no consume A) → no equivalentes, reporta diferencia", () => {
    const { modelo, eq } = modeloDosRealizaciones();
    const sinConsumo: Modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        b: { ...modelo.opds.b!, enlaces: { aebRB: modelo.opds.b!.enlaces.aebRB! } },
      },
    };
    const r = verificarEquivalencia(sinConsumo, eq);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.equivalente).toBe(false);
      expect(r.value.diferencias && r.value.diferencias.length > 0).toBe(true);
    }
  });

  test("verificarEquivalencia es pura: no muta el modelo", () => {
    const { modelo, eq } = modeloDosRealizaciones();
    const antes = JSON.stringify(modelo);
    verificarEquivalencia(modelo, eq);
    expect(JSON.stringify(modelo)).toBe(antes);
  });
});
