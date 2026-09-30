import { describe, expect, test } from "bun:test";
import type { Base, ChangeSet } from "../../agent/contracts";
import type { DocumentOperationsPort } from "./documentOperationsPort";
import { createPiecePort, MAX_PIECE_SOURCE_BYTES, type PreparedPieceChange } from "./piecePort";

const base: Base = { revision: 1, semanticHash: "sem-1", workingCopyHash: "work-1", clientSequence: 4, profileVersion: "p1" };
const change = { id: "piece-change", target: { kind: "current", documentId: "doc-1" } } as ChangeSet;
const prepared: PreparedPieceChange = {
  changeId: change.id,
  change,
  diff: {} as PreparedPieceChange["diff"],
  manifest: {
    schema: "opforja.piece.v1", manifestId: "manifest", identity: { modelId: "lib", pieceId: "o-1" },
    function: "Provee recurso", boundary: { scope: "direct-incidence", roles: [], signature: "[]" },
    version: { id: "v1", contentHash: "h1" }, profile: { id: "entity-neighborhood", version: "1" },
    lineage: [], behavior: {}, losses: [],
  },
  losses: [],
};

function fakeOperations() {
  const calls: string[] = [];
  const operations = {
    snapshot: () => ({ documentId: "doc-1", controllerId: "tab-1", clientSequence: 3, base, workingCopyHash: "work-1", reservation: null, pendingEdits: 0, pendingConflicts: 0 }),
    flush: async () => { calls.push("flush"); return base; },
    prepareCommit: async (_change: ChangeSet, policy: "review" | "delegated") => {
      calls.push(`prepare:${policy}`);
      return { kind: "prepared" as const, grant: {}, base };
    },
    commit: async (changeId: string) => { calls.push(`commit:${changeId}`); return { kind: "integrated" as const, changeId, model: {} as never, appliedPending: 0, conflicts: 0 }; },
    undo: async (changeId: string) => { calls.push(`undo:${changeId}`); return { kind: "integrated" as const, changeId, model: {} as never, appliedPending: 0, conflicts: 0 }; },
  } satisfies Pick<DocumentOperationsPort, "snapshot" | "flush" | "prepareCommit" | "commit" | "undo">;
  return { calls, operations };
}

describe("PiecePort", () => {
  test("binds preparation to the flushed document revision and asks for human review on apply", async () => {
    const { calls, operations } = fakeOperations();
    const requests: Array<Record<string, unknown>> = [];
    const port = createPiecePort(operations, async (input) => { requests.push(input); return prepared; });
    const result = await port.prepare({
      kind: "copy", sourceJson: "{}", pieceId: "o-1", function: "Provee recurso",
      target: { opdId: "opd-1", position: { x: 10, y: 20 } },
    });
    expect(result).toBe(prepared);
    expect(calls).toEqual(["flush"]);
    expect(requests[0]).toMatchObject({
      documentId: "doc-1", controllerId: "tab-1", clientSequence: 4, workingCopyHash: "work-1",
      kind: "copy", pieceId: "o-1", target: { opdId: "opd-1", position: { x: 10, y: 20 } },
    });
    const applied = await port.apply(result);
    expect(applied.kind).toBe("integrated");
    expect(calls).toEqual(["flush", "prepare:review", "commit:piece-change"]);
    expect((await port.undo("piece-change")).kind).toBe("integrated");
    expect(calls).toContain("undo:piece-change");
  });

  test("rejects a source over the provider's documented request budget before flushing", async () => {
    const { calls, operations } = fakeOperations();
    const port = createPiecePort(operations, async () => prepared);
    const oversized = "x".repeat(MAX_PIECE_SOURCE_BYTES + 1);
    await expect(port.prepare({
      kind: "reference", sourceJson: oversized, pieceId: "o-1", function: "Provee recurso",
      target: { opdId: "opd-1", anchorEntityId: "o-local" },
    })).rejects.toThrow("1 MiB");
    expect(calls).toEqual([]);
  });
});
