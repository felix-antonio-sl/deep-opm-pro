import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "../operaciones";
import type { Modelo, Resultado, TipoEnlace } from "../tipos";
import { comparePieceVersions } from "./compare";
import { createPieceManifest } from "./piece";

function must<T>(result: Resultado<T>): T {
  if (!result.ok) throw new Error(result.error);
  return result.value;
}

function versionedPiece(retry: string, boundaryLinkType: TipoEnlace = "consumo"): ReturnType<typeof createPieceManifest> {
  let model = crearModelo("Biblioteca");
  model = must(crearObjeto(model, model.opdRaizId, { x: 20, y: 30 }, "Control"));
  model = must(crearProceso(model, model.opdRaizId, { x: 240, y: 30 }, "Validar"));
  const [boundaryId, pieceId] = Object.keys(model.entidades);
  const source = boundaryLinkType === "consumo" ? boundaryId! : pieceId!;
  const destination = boundaryLinkType === "consumo" ? pieceId! : boundaryId!;
  model = must(crearEnlace(model, model.opdRaizId, { kind: "entidad", id: source }, { kind: "entidad", id: destination }, boundaryLinkType));
  return createPieceManifest({
    model,
    pieceId: pieceId!,
    function: "Controlar admisión",
    sourceVersion: retry === "at-most-once" ? "v1" : "v2",
    behavior: { retry: { value: retry, evidence: "escenario de fallo del proveedor" } },
  });
}

describe("reuse/compare piece versions", () => {
  test("marks a changed direct boundary as incompatible instead of inferring compatibility from names", () => {
    const a = versionedPiece("at-most-once", "consumo");
    const b = versionedPiece("at-most-once", "resultado");
    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;
    const comparison = comparePieceVersions(a.value, b.value);
    expect(comparison.dimensions.boundary.status).toBe("different");
    expect(comparison.changed).toContain("boundary");
    expect(comparison.safeSubstitution).toBe(false);
  });

  test("equal boundary signatures do not hide different retry behavior or claim equivalence", () => {
    const a = versionedPiece("at-most-once");
    const b = versionedPiece("repeats-effect");
    expect(a.ok && b.ok).toBe(true);
    if (!a.ok || !b.ok) return;
    const comparison = comparePieceVersions(a.value, b.value);
    expect(comparison.dimensions.boundary.status).toBe("same");
    expect(comparison.dimensions.retry).toMatchObject({
      status: "different",
      before: "at-most-once",
      after: "repeats-effect",
    });
    expect(comparison.changed).toContain("retry");
    expect(comparison.unexamined).toContain("time");
    expect(comparison.unexamined).toContain("errors");
    expect(comparison.unexamined).toContain("internalBehavior");
    expect(comparison.safeSubstitution).toBe(false);
  });
});
