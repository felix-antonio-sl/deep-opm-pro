import { describe, expect, test } from "bun:test";
import type { ChangeSet } from "../agent/contracts";
import type { SemanticInverse } from "../modelo/changes/types";
import { IntentHistory } from "./intentHistory";

function change(id: string): ChangeSet {
  return {
    id,
    taskId: "task-1",
    actorId: "actor-1",
    intentVersion: 1,
    target: { kind: "current", documentId: "doc-1" },
    base: {
      revision: 1,
      semanticHash: "semantic",
      workingCopyHash: "working",
      clientSequence: 2,
      profileVersion: "p1",
    },
    operations: [],
    readIds: [],
    writeIds: [],
    dependencies: [],
    explanation: "test",
  };
}

const inverse: SemanticInverse = { id: "inverse-1", sourceChangeId: "change-1", patches: [] };

describe("IntentHistory", () => {
  test("la barrera deja deshacer ediciones posteriores y bloquea cruzar snapshots anteriores", () => {
    const history = new IntentHistory();
    history.recordApplied({
      documentId: "doc-1",
      changeId: "change-1",
      target: { kind: "current", documentId: "doc-1" },
      sequence: 3,
      legacyUndoDepth: 2,
      change: change("change-1"),
      inverse,
    });

    expect(history.undoCandidate("doc-1", 3)).toBeNull();
    expect(history.undoCandidate("doc-1", 2)?.changeId).toBe("change-1");
    expect(history.undoCandidate("doc-1", 1)).toBeNull();
  });

  test("una dependencia posterior conserva la intención y permite comunicar conflicto", () => {
    const history = new IntentHistory();
    history.recordApplied({
      documentId: "doc-1",
      changeId: "change-1",
      target: { kind: "current", documentId: "doc-1" },
      sequence: 3,
      legacyUndoDepth: 0,
      change: change("change-1"),
      inverse,
    });
    expect(history.markUndoConflict("doc-1", "change-1", {
      reason: "La entidad tiene una referencia humana posterior",
      references: ["link-human"],
    })).toBe(true);
    expect(history.undoCandidate("doc-1", 0)?.conflict).toEqual({
      reason: "La entidad tiene una referencia humana posterior",
      references: ["link-human"],
    });
  });

  test("reaplicar registra identidad nueva y queda detrás de su propia barrera", () => {
    const history = new IntentHistory();
    history.recordApplied({
      documentId: "doc-1",
      changeId: "change-1",
      target: { kind: "current", documentId: "doc-1" },
      sequence: 3,
      legacyUndoDepth: 0,
      change: change("change-1"),
      inverse,
    });
    history.markUndone("doc-1", "change-1", "undo-1");
    const reapplied = history.recordReapplied({
      documentId: "doc-1",
      originalChangeId: "change-1",
      changeId: "change-2",
      change: change("change-2"),
      inverse: { ...inverse, id: "inverse-2", sourceChangeId: "change-2" },
      sequence: 5,
      legacyUndoDepth: 0,
    });
    expect(reapplied?.changeId).toBe("change-2");
    expect(reapplied?.change.id).toBe("change-2");
    expect(history.reapplyCandidate("doc-1")).toBeNull();
  });
});
