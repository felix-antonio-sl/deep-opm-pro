import { describe, expect, test } from "bun:test";
import {
  consumirCommitGrant,
  emitirCommitGrant,
  guardarClaimsCommitGrant,
  verificarCommitGrant,
  type CommitGrantBinding,
} from "./commitGrant";

const binding: CommitGrantBinding = {
  kind: "review",
  changeId: "change-1",
  taskId: null,
  actorId: "operator-1",
  target: { kind: "current", documentId: "document-1" },
  base: {
    revision: 3,
    semanticHash: "semantic-hash",
    workingCopyHash: "working-copy-hash",
    clientSequence: 8,
    profileVersion: "opforja-agent-authoring-v1",
  },
  controllerId: "browser-1",
  intentVersion: null,
  authorizationVersion: null,
  leaseFence: 0,
};

describe("commit grant", () => {
  test("accepts its exact binding once, and rejects token or claim changes", () => {
    const now = new Date("2026-09-23T12:00:00.000Z");
    const grant = emitirCommitGrant(binding, 15_000, now);
    const stored = guardarClaimsCommitGrant(grant);

    expect(verificarCommitGrant(grant, stored, binding, now)).toBe(true);
    expect(verificarCommitGrant({ ...grant, token: `${grant.token}x` }, stored, binding, now)).toBe(false);
    expect(verificarCommitGrant({ ...grant, controllerId: "other-browser" }, stored, binding, now)).toBe(false);
    expect(verificarCommitGrant(grant, stored, { ...binding, actorId: "other-operator" }, now)).toBe(false);
    expect(verificarCommitGrant(grant, consumirCommitGrant(stored, now), binding, now)).toBe(false);
    expect(verificarCommitGrant(grant, stored, binding, new Date(now.getTime() + 15_000))).toBe(false);
  });
});
