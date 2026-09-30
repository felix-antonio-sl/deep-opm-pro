import { describe, expect, test } from "bun:test";
import { extremoEntidad } from "../extremos";
import { crearEnlace, renombrarEntidad } from "../operaciones";
import type { ChangeSet } from "../../agent/contracts";
import type { Modelo } from "../tipos";
import { applyChangeSet, validateInverse } from "./apply";
import type { SemanticOperation } from "./types";
import { createOrderFixture } from "../../agent/fixtures/order";

describe("semantic inverse", () => {
  test("undo removes its own entity and preserves a later unrelated human rename", () => {
    const fixture = createOrderFixture();
    const result = applyChangeSet(fixture.model, change("create-x", [{
      ...base("create"), kind: "createObject", id: "agent-object-x", opdId: fixture.model.opdRaizId,
      name: "Etiqueta de preparación", position: { x: 500, y: 500 },
    }]));
    expect(result.kind).toBe("validated");
    if (result.kind !== "validated") return;

    const human = must(renombrarEntidad(result.candidate, fixture.ids.delivery, "Reparto confirmado"));
    const undo = validateInverse(human, result.inverse);
    expect(undo.kind).toBe("applicable");
    if (undo.kind !== "applicable") return;
    expect(undo.candidate.entidades["agent-object-x"]).toBeUndefined();
    expect(undo.candidate.entidades[fixture.ids.delivery]?.nombre).toBe("Reparto confirmado");
  });

  test("undo conflicts when a later human link depends on the created entity", () => {
    const fixture = createOrderFixture();
    const result = applyChangeSet(fixture.model, change("create-y", [{
      ...base("create"), kind: "createObject", id: "agent-object-y", opdId: fixture.model.opdRaizId,
      name: "Pedido embalado", position: { x: 500, y: 500 },
    }]));
    expect(result.kind).toBe("validated");
    if (result.kind !== "validated") return;

    const connected = must(crearEnlace(
      result.candidate,
      fixture.model.opdRaizId,
      extremoEntidad(fixture.ids.prepare),
      extremoEntidad("agent-object-y"),
      "resultado",
    ));
    const undo = validateInverse(connected, result.inverse);
    expect(undo.kind).toBe("conflict");
    if (undo.kind === "conflict") expect(undo.references).toContain("agent-object-y");
    expect(connected.entidades["agent-object-y"]).toBeDefined();
  });

  test("undo rejects a later edit to the same created entity", () => {
    const fixture = createOrderFixture();
    const result = applyChangeSet(fixture.model, change("create-z", [{
      ...base("create"), kind: "createObject", id: "agent-object-z", opdId: fixture.model.opdRaizId,
      name: "Caja", position: { x: 500, y: 500 },
    }]));
    expect(result.kind).toBe("validated");
    if (result.kind !== "validated") return;
    const human = must(renombrarEntidad(result.candidate, "agent-object-z", "Caja revisada"));
    expect(validateInverse(human, result.inverse)).toMatchObject({ kind: "conflict", references: ["agent-object-z"] });
  });

  test("undo restores a deleted XOR branch link without reverting an unrelated rename", () => {
    const fixture = createOrderFixture();
    const result = applyChangeSet(fixture.model, change("delete-branch", [{
      ...base("delete-link"), kind: "deleteLink", linkId: fixture.ids.pickupLink,
    }]));
    expect(result.kind).toBe("validated");
    if (result.kind !== "validated") return;

    const human = must(renombrarEntidad(result.candidate, fixture.ids.delivery, "Reparto domiciliario"));
    const undo = validateInverse(human, result.inverse);
    expect(undo.kind).toBe("applicable");
    if (undo.kind !== "applicable") return;
    expect(undo.candidate.enlaces[fixture.ids.pickupLink]).toBeDefined();
    expect(undo.candidate.entidades[fixture.ids.delivery]?.nombre).toBe("Reparto domiciliario");
    expect(Object.values(undo.candidate.abanicos ?? {}).find((item) => item.operador === "XOR")?.enlaceIds).toEqual(
      expect.arrayContaining([fixture.ids.pickupLink, fixture.ids.deliveryLink]),
    );
  });
});

function change(id: string, operations: SemanticOperation[]): ChangeSet {
  return {
    id,
    taskId: "task-test",
    actorId: "test",
    intentVersion: 1,
    target: { kind: "current", documentId: "doc-test" },
    base: { revision: 1, semanticHash: "test", workingCopyHash: "test", clientSequence: 0, profileVersion: "test" },
    operations,
    readIds: [],
    writeIds: [],
    dependencies: [],
    explanation: "synthetic test",
  };
}

function base(operationId: string) {
  return { operationId, preconditions: [] };
}

function must<T>(result: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!result.ok) throw new Error(result.error);
  return result.value;
}
