import { createHash } from "node:crypto";
import { describe, expect, test } from "bun:test";
import type { Base, ChangeSet } from "../../agent/contracts";
import { AGENT_CAPABILITY_PROFILE } from "../../agent/capabilityProfile";
import { createOrderFixture } from "../../agent/fixtures/order";
import { carpetaIdDeJson, exportarModelo, hidratarModelo } from "../../serializacion/json";
import { construirModeloPersistido } from "../../persistencia/modelos";
import { moverApariencia } from "../../modelo/operaciones/apariencias";
import type { Modelo } from "../../modelo/tipos";
import type { PersistenciaSesion } from "../modelPersistence";
import { crearRepoMemoria } from "../repoMemoria";
import { ChangeGateway } from "./changeGateway";
import { hashCommitRequest } from "./commitGrant";
import type { AgentChangeRecord, AgentRepository, AgentDocumentSnapshot, AgentTaskRecord, AgentVariantRecord } from "./repository";

const session: PersistenciaSesion = {
  tenantId: "gateway-tenant",
  userId: "gateway-operator",
  auth: true,
  authKind: "operator",
};
const documentId = "gateway-document";
const initialNow = Date.parse("2026-09-23T12:00:00.000Z");

function harness() {
  const fixture = createOrderFixture();
  const json = exportarModelo(fixture.model);
  const saved = construirModeloPersistido({ id: documentId, nombre: fixture.model.nombre, json, revision: 1 }, undefined,
    new Date(initialNow).toISOString());
  const models = crearRepoMemoria([saved], session);
  const gateway = new ChangeGateway({ repository: models.agentRepository, now: () => initialNow });
  return { models, repository: models.agentRepository, gateway, fixture };
}

async function snapshot(repository: AgentRepository): Promise<AgentDocumentSnapshot> {
  return repository.transaction(session, documentId, async (tx) => {
    const document = await tx.getDocument();
    if (!document) throw new Error("Expected seeded model");
    return document;
  });
}

function baseOf(document: AgentDocumentSnapshot, clientSequence = 0): Base {
  const canonical = exportarModelo(document.effectiveModel, carpetaIdDeJson(document.effectiveJson));
  return {
    revision: document.model.revision ?? 0,
    semanticHash: document.semanticHash,
    workingCopyHash: createHash("sha256").update(canonical, "utf8").digest("hex"),
    clientSequence,
    profileVersion: AGENT_CAPABILITY_PROFILE,
  };
}

function change(id: string, base: Base, name = "Objeto " + id): ChangeSet {
  const fixture = createOrderFixture();
  return {
    id,
    taskId: null,
    actorId: session.userId,
    intentVersion: null,
    target: { kind: "current", documentId },
    base,
    operations: [{
      operationId: "operation-" + id,
      preconditions: [],
      kind: "createObject",
      id: "entity-" + id,
      opdId: fixture.model.opdRaizId,
      name,
      position: { x: 520, y: 480 },
    }],
    readIds: [],
    writeIds: [],
    dependencies: [],
    explanation: "Cambio sintético de prueba",
  };
}

describe("ChangeGateway durable commit boundary", () => {
  test("memory repository rolls back all staged document writes when a transaction callback fails", async () => {
    const h = harness();
    const before = await h.models.get(session, documentId);
    if (!before) throw new Error("Seeded model missing");
    await expect(h.repository.transaction(session, documentId, async (tx) => {
      await tx.putModel({ ...before, nombre: "Debe revertirse" }, before.revision ?? 0);
      throw new Error("fallo simulado antes de cerrar la transacción");
    })).rejects.toThrow("fallo simulado");
    expect(await h.models.get(session, documentId)).toEqual(before);
  });

  test("commits model and receipt once and accepts the canonical prepared payload", async () => {
    const h = harness();
    const current = await snapshot(h.repository);
    const submitted = change("change-normalized", baseOf(current));
    const grant = await h.gateway.prepareCommit(session, submitted, {
      kind: "review", controllerId: "browser-1", clientSequence: 0,
      workingCopyHash: submitted.base.workingCopyHash,
    });
    const stored = await h.repository.transaction(session, documentId, (tx) => tx.getChange(submitted.id));
    expect(stored?.change.writeIds).toContain("entity-change-normalized");
    if (!stored) throw new Error("Prepared change missing");

    const committed = await h.gateway.commit(session, stored.change, grant);
    expect(committed.kind).toBe("committed");
    if (committed.kind !== "committed") return;
    expect(committed.receipt).toMatchObject({ changeId: submitted.id, previousRevision: 1, revision: 2 });
    const committedModel = hidratarModelo(committed.modelJson);
    expect(committedModel.ok).toBe(true);
    if (!committedModel.ok) return;
    const committedWorkingCopy = exportarModelo(committedModel.value, carpetaIdDeJson(committed.modelJson));
    expect(committed.base.workingCopyHash).toBe(createHash("sha256").update(committedWorkingCopy, "utf8").digest("hex"));

    const persisted = await h.models.get(session, documentId);
    expect(persisted?.revision).toBe(2);
    expect(h.gateway.getReceipt(session, submitted.target, submitted.id)).resolves.toEqual(committed.receipt);
    const recovered = await h.gateway.commit(session, stored.change, grant);
    expect(recovered).toMatchObject({ kind: "committed", recovered: true, receipt: committed.receipt });
  });

  test("idempotent change identity rejects different content and leaves the original grant usable", async () => {
    const h = harness();
    const current = await snapshot(h.repository);
    const first = change("same-id", baseOf(current), "Candidato original");
    const grant = await h.gateway.prepareCommit(session, first, {
      kind: "review", controllerId: "browser-1", clientSequence: 0,
      workingCopyHash: first.base.workingCopyHash,
    });

    const altered = { ...first, operations: first.operations.map((operation) => ({ ...operation, name: "Contenido distinto" })) };
    await expect(h.gateway.prepareCommit(session, altered, {
      kind: "review", controllerId: "browser-1", clientSequence: 0,
      workingCopyHash: altered.base.workingCopyHash,
    })).rejects.toThrow("identidad del cambio ya se usó");

    const stored = await h.repository.transaction(session, documentId, (tx) => tx.getChange(first.id));
    if (!stored) throw new Error("Prepared change missing");
    expect((await h.gateway.commit(session, stored.change, grant)).kind).toBe("committed");
  });

  test("two prepared writers serialize and the loser sees a stale effective base", async () => {
    const h = harness();
    const current = await snapshot(h.repository);
    const base = baseOf(current);
    const first = change("race-1", base);
    const second = change("race-2", base);
    const firstGrant = await h.gateway.prepareCommit(session, first, {
      kind: "review", controllerId: "browser-1", clientSequence: 0, workingCopyHash: base.workingCopyHash,
    });
    const secondGrant = await h.gateway.prepareCommit(session, second, {
      kind: "review", controllerId: "browser-1", clientSequence: 0, workingCopyHash: base.workingCopyHash,
    });
    const storedFirst = await h.repository.transaction(session, documentId, (tx) => tx.getChange(first.id));
    const storedSecond = await h.repository.transaction(session, documentId, (tx) => tx.getChange(second.id));
    if (!storedFirst || !storedSecond) throw new Error("Prepared changes missing");

    const results = await Promise.all([
      h.gateway.commit(session, storedFirst.change, firstGrant),
      h.gateway.commit(session, storedSecond.change, secondGrant),
    ]);
    expect(results.filter((result) => result.kind === "committed")).toHaveLength(1);
    expect(results.filter((result) => result.kind === "stale-base")).toHaveLength(1);
    expect((await h.models.get(session, documentId))?.revision).toBe(2);
  });

  test("undo uses the committed inverse and binds undo identity into idempotency", async () => {
    const h = harness();
    const before = await snapshot(h.repository);
    const original = change("undo-source", baseOf(before));
    const originalGrant = await h.gateway.prepareCommit(session, original, {
      kind: "review", controllerId: "browser-1", clientSequence: 0,
      workingCopyHash: original.base.workingCopyHash,
    });
    const storedOriginal = await h.repository.transaction(session, documentId, (tx) => tx.getChange(original.id));
    if (!storedOriginal) throw new Error("Prepared original missing");
    expect((await h.gateway.commit(session, storedOriginal.change, originalGrant)).kind).toBe("committed");

    const after = await snapshot(h.repository);
    const undo = { ...change("undo-action", baseOf(after)), operations: [] };
    const undoRequest = {
      kind: "review" as const, controllerId: "browser-1", clientSequence: 0,
      workingCopyHash: undo.base.workingCopyHash, undoOf: original.id,
    };
    const undoGrant = await h.gateway.prepareCommit(session, undo, undoRequest);
    await expect(h.gateway.prepareCommit(session, undo, { ...undoRequest, undoOf: "different-source" }))
      .rejects.toThrow("identidad del cambio ya se usó");
    const storedUndo = await h.repository.transaction(session, documentId, (tx) => tx.getChange(undo.id));
    if (!storedUndo) throw new Error("Prepared undo missing");
    const undone = await h.gateway.commit(session, storedUndo.change, undoGrant);
    expect(undone.kind).toBe("committed");
    const persisted = await h.models.get(session, documentId);
    expect(persisted).toBeDefined();
    const undoneModel = hidratarModelo(persisted!.json);
    expect(undoneModel.ok).toBe(true);
    if (undoneModel.ok) expect(undoneModel.value.entidades["entity-undo-source"]).toBeUndefined();
  });

  test("incorporating a proposal closes its variant in the same commit transaction", async () => {
    const h = harness();
    const document = await snapshot(h.repository);
    const base = baseOf(document);
    const proposal = change("variant-proposal", base);
    const currentChange: ChangeSet = {
      ...proposal,
      id: "variant-incorporation",
      taskId: "task-variant",
      intentVersion: 1,
    };
    const variantId = "variant-1";
    const variantProposal: ChangeSet = {
      ...proposal,
      target: { kind: "variant", documentId, variantId },
      taskId: "task-variant",
      intentVersion: 1,
    };
    const task: AgentTaskRecord = {
      id: "task-variant",
      tenantId: session.tenantId,
      documentId,
      actorId: session.userId,
      status: "completed",
      reason: null,
      intent: {
        id: "intent-variant", version: 1, target: variantProposal.target,
        outcome: "Proponer y revisar variante", scopeIds: [document.effectiveModel.opdRaizId],
        exclusions: [], allowedSourceIds: [], sufficiency: [], authority: "propose",
        authorizationVersion: 1, rejectedAlternatives: [],
      },
      createdAt: new Date(initialNow).toISOString(),
      updatedAt: new Date(initialNow).toISOString(),
      budget: { maxModelCalls: 1, maxToolCalls: 1, maxInputTokens: 1, maxOutputTokens: 1, maxTaskUsd: 1, timeoutMs: 1 },
      usage: { modelCalls: 0, toolCalls: 0, inputTokens: 0, outputTokens: 0, estimatedUsd: 0, activeMs: 0, usageUnknown: false },
      profile: { provider: "opencode-zen", protocol: "chat-completions", model: "test-model" },
      transcript: [],
      controller: { id: "browser-1", expiresAt: new Date(initialNow + 60_000).toISOString(), clientSequence: 0, workingCopyHash: base.workingCopyHash },
      lease: { owner: null, fence: 0, expiresAt: null },
      results: [{
        id: "incorporation-result", kind: "proposal", createdAt: new Date(initialNow).toISOString(),
        payload: { kind: "variant-incorporation", sourceChangeId: variantProposal.id, preparedChangeId: currentChange.id, status: "prepared-for-review" },
      }],
      pendingDecision: null,
      pendingCommit: { changeId: currentChange.id },
      dependencies: [],
    };
    const variant: AgentVariantRecord = {
      id: variantId, tenantId: session.tenantId, documentId, taskId: task.id,
      base, operations: proposal.operations, createdAt: task.createdAt, updatedAt: task.updatedAt, state: "open",
    };
    const sourceRecord: AgentChangeRecord = {
      change: variantProposal, requestHash: hashCommitRequest(variantProposal), status: "prepared",
      createdAt: task.createdAt, receipt: null, inverse: null, grant: null,
    };
    await h.repository.transaction(session, documentId, async (tx) => {
      await tx.putTask(task);
      await tx.putVariant(variant);
      await tx.putChange(sourceRecord);
    });

    const grant = await h.gateway.prepareCommit(session, currentChange, {
      kind: "review", controllerId: "browser-1", clientSequence: 0, workingCopyHash: base.workingCopyHash,
    });
    const stored = await h.repository.transaction(session, documentId, (tx) => tx.getChange(currentChange.id));
    if (!stored) throw new Error("Prepared incorporation missing");
    expect((await h.gateway.commit(session, stored.change, grant)).kind).toBe("committed");
    const committedVariant = await h.repository.transaction(session, documentId, (tx) => tx.getVariant(variantId));
    expect(committedVariant?.state).toBe("incorporated");
  });

  test("rejects a stale working copy when a newer layout-only autosave is effective", async () => {
    const h = harness();
    const before = await snapshot(h.repository);
    const staleBase = baseOf(before);
    const entityId = Object.keys(before.effectiveModel.entidades)[0];
    if (!entityId) throw new Error("Fixture must have an entity");
    const moved = moverApariencia(before.effectiveModel, before.effectiveModel.opdRaizId, entityId, { x: 840, y: 640 });
    expect(moved.ok).toBe(true);
    if (!moved.ok) return;
    const currentModel: Modelo = moved.value;
    const oldPersisted = await h.models.get(session, documentId);
    if (!oldPersisted) throw new Error("Seeded model missing");
    await h.models.save(session, {
      ...oldPersisted,
      json: exportarModelo(currentModel),
      autosalvado: true,
      actualizadoEn: new Date(initialNow + 1_000).toISOString(),
    });
    const afterAutosave = await snapshot(h.repository);
    expect(afterAutosave.source).toBe("autosave");
    expect(afterAutosave.semanticHash).toBe(staleBase.semanticHash);

    const staleChange = change("stale-autosave", {
      ...staleBase,
      revision: afterAutosave.model.revision ?? 0,
    });
    await expect(h.gateway.prepareCommit(session, staleChange, {
      kind: "review", controllerId: "browser-1", clientSequence: 0,
      workingCopyHash: staleChange.base.workingCopyHash,
    })).rejects.toThrow("base, el controlador o el perfil cambió");
  });
});
