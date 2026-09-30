import { createHash } from "node:crypto";
import { expect, test } from "bun:test";
import { AGENT_CAPABILITY_PROFILE } from "../../agent/capabilityProfile";
import { createOrderFixture } from "../../agent/fixtures/order";
import type { Base, ChangeSet, SemanticOperation } from "../../agent/contracts";
import { applyChangeSet } from "../../modelo/changes/apply";
import { agregarFuenteExploracion } from "../../modelo/mesaExploracion";
import { construirModeloPersistido } from "../../persistencia/modelos";
import { carpetaIdDeJson, exportarModelo, hidratarModelo } from "../../serializacion/json";
import type { PersistenciaSesion } from "../modelPersistence";
import { crearRepoMemoria } from "../repoMemoria";
import { hashCommitRequest } from "./commitGrant";
import type { JsonValue } from "./provider";
import type { AgentChangeRecord, AgentTaskRecord } from "./repository";
import { modelTaskSources } from "./sourceAccess";
import { ChangeGateway } from "./changeGateway";
import { createAgentTaskTools, validateDependencies } from "./tools";
import { VariantService } from "./variants";

const session: PersistenciaSesion = { tenantId: "variant-test-tenant", userId: "operator", auth: true, authKind: "operator" };

async function fixture() {
  const original = createOrderFixture().model;
  const withSource = agregarFuenteExploracion(original, { titulo: "Pedido", contenido: "Conservar retiro o reparto." }, new Date().toISOString());
  if (!withSource.ok) throw new Error(withSource.error);
  const model = withSource.value.modelo;
  const stored = construirModeloPersistido({ id: "document", nombre: model.nombre, json: exportarModelo(model), revision: 1 });
  const legacy = crearRepoMemoria([stored], session);
  const repository = legacy.agentRepository;
  const document = await repository.transaction(session, "document", (tx) => tx.getDocument());
  if (!document) throw new Error("fixture document missing");
  const taskId = "task-1";
  const variantId = "variant-1";
  const now = new Date().toISOString();
  const future = new Date(Date.now() + 60_000).toISOString();
  const intent: AgentTaskRecord["intent"] = {
    id: taskId, version: 3,
    target: { kind: "variant", documentId: "document", variantId },
    outcome: "Proponer un objeto adicional", scopeIds: [model.opdRaizId], exclusions: [],
    allowedSourceIds: [withSource.value.fuenteId], sufficiency: ["Propuesta revisada"],
    authority: "propose", authorizationVersion: 1, rejectedAlternatives: [],
  };
  const task: AgentTaskRecord = {
    id: taskId, tenantId: session.tenantId, documentId: "document", actorId: session.userId,
    status: "completed", reason: null, intent, createdAt: now, updatedAt: now,
    budget: { maxModelCalls: 3, maxToolCalls: 3, maxInputTokens: 10_000, maxOutputTokens: 2_000, maxTaskUsd: 1, timeoutMs: 60_000 },
    usage: { modelCalls: 1, toolCalls: 1, inputTokens: 100, outputTokens: 50, estimatedUsd: 0.001, activeMs: 10, usageUnknown: false },
    profile: { provider: "xiaomi-mimo", protocol: "chat-completions", model: "mimo-v2.6-pro" }, transcript: [],
    controller: { id: "browser", expiresAt: future, clientSequence: 2, workingCopyHash: "captured-copy" },
    lease: { owner: null, fence: 2, expiresAt: null }, results: [], pendingDecision: null, pendingCommit: null,
    dependencies: [{ kind: "source", id: withSource.value.fuenteId, version: modelTaskSources(model)[0]!.version }],
    sources: modelTaskSources(model),
  };
  const operation: SemanticOperation = {
    operationId: "add-extra-object", kind: "createObject", id: "extra-object", opdId: model.opdRaizId,
    name: "Objeto adicional", position: { x: 1_080, y: 180 }, preconditions: [{ kind: "idAbsent", id: "extra-object" }],
  };
  const validation = applyChangeSet(model, { id: "source-proposal", operations: [operation] });
  if (validation.kind !== "validated") throw new Error(validation.message);
  const base: Base = {
    revision: document.model.revision ?? 1, semanticHash: document.semanticHash,
    workingCopyHash: task.controller!.workingCopyHash, clientSequence: task.controller!.clientSequence,
    profileVersion: AGENT_CAPABILITY_PROFILE,
  };
  const change: ChangeSet = {
    id: "source-proposal", taskId, actorId: session.userId, intentVersion: intent.version,
    target: intent.target, base, operations: [operation], readIds: validation.readIds, writeIds: validation.writeIds,
    dependencies: task.dependencies ?? [], explanation: "Propuesta sintética para probar su incorporación",
  };
  const proposal: AgentChangeRecord = {
    change, requestHash: hashCommitRequest({ change, undoOf: null }), status: "prepared", createdAt: now,
    receipt: null, inverse: validation.inverse, grant: null,
  };
  await repository.transaction(session, "document", async (tx) => {
    await tx.putTask(task);
    await tx.putVariant({
      id: variantId, tenantId: session.tenantId, documentId: "document", taskId,
      base, operations: [operation], createdAt: now, updatedAt: now, state: "open",
    });
    await tx.putChange(proposal);
  });
  return { legacy, repository, model, task, proposal, variantId };
}

async function saveModel(f: Awaited<ReturnType<typeof fixture>>, model: ReturnType<typeof createOrderFixture>["model"]) {
  const persisted = await f.legacy.get(session, "document");
  if (!persisted || typeof persisted.revision !== "number") throw new Error("fixture model missing its revision");
  await f.legacy.save(session, { ...persisted, json: exportarModelo(model), revision: persisted.revision });
}

test("incorporation rebases over an unrelated edit and binds identity to the flushed browser base", async () => {
  const f = await fixture();
  const service = new VariantService({ repository: f.repository });
  const first = await service.prepareIncorporation(session, "document", f.proposal.change.id);
  expect(first.kind).toBe("prepared");
  if (first.kind !== "prepared") throw new Error("expected a prepared proposal");
  expect(first.change.target).toEqual({ kind: "current", documentId: "document" });

  const sameBase = await service.prepareIncorporation(session, "document", f.proposal.change.id);
  expect(sameBase.kind).toBe("prepared");
  if (sameBase.kind !== "prepared") throw new Error("expected an idempotent prepared proposal");
  expect(sameBase.change.id).toBe(first.change.id);
  const afterSameBase = await f.repository.getTask(session, "document", f.task.id);
  expect(afterSameBase?.results.filter((result) => (result.payload as { kind?: string }).kind === "variant-incorporation")).toHaveLength(1);

  await f.repository.transaction(session, "document", async (tx) => {
    const task = await tx.getTask(f.task.id);
    if (!task?.controller) throw new Error("fixture controller missing");
    task.controller.clientSequence = 3;
    task.controller.workingCopyHash = "same-model-after-flush";
    await tx.putTask(task);
  });
  const refreshedPresence = await service.prepareIncorporation(session, "document", f.proposal.change.id);
  expect(refreshedPresence.kind).toBe("prepared");
  if (refreshedPresence.kind !== "prepared") throw new Error("expected current presence to bind a new identity");
  expect(refreshedPresence.change.id).not.toBe(first.change.id);
  expect(refreshedPresence.change.base.clientSequence).toBe(3);
  expect(refreshedPresence.change.base.workingCopyHash).toBe("same-model-after-flush");

  const unrelated = applyChangeSet(f.model, { id: "unrelated-edit", operations: [{
    operationId: "create-unrelated", kind: "createObject", id: "unrelated-object", opdId: f.model.opdRaizId,
    name: "Objeto independiente", position: { x: 60, y: 720 }, preconditions: [{ kind: "idAbsent", id: "unrelated-object" }],
  }] });
  if (unrelated.kind !== "validated") throw new Error(unrelated.message);
  await saveModel(f, unrelated.candidate);
  await f.repository.transaction(session, "document", async (tx) => {
    const task = await tx.getTask(f.task.id);
    if (!task?.controller) throw new Error("fixture controller missing");
    task.controller.clientSequence = 4;
    task.controller.workingCopyHash = "after-unrelated-edit";
    await tx.putTask(task);
  });
  const rebased = await service.prepareIncorporation(session, "document", f.proposal.change.id);
  expect(rebased.kind).toBe("prepared");
  if (rebased.kind !== "prepared") throw new Error("expected independent edit to rebase");
  expect(rebased.change.base.revision).toBe(2);
  expect(rebased.change.base.clientSequence).toBe(4);
  const saved = await f.legacy.get(session, "document");
  expect(saved?.revision).toBe(2);
  const current = saved && hidratarModelo(saved.json);
  expect(current?.ok && current.value.entidades["extra-object"]).toBeUndefined();
  expect(current?.ok && current.value.entidades["unrelated-object"]?.nombre).toBe("Objeto independiente");
});

test("a changed source dependency blocks incorporation before any current-model write", async () => {
  const f = await fixture();
  const sourceId = f.task.intent.allowedSourceIds[0]!;
  const source = f.model.mesaExploracion?.fuentes[sourceId];
  if (!source || !f.model.mesaExploracion) throw new Error("fixture source missing");
  const changedModel = {
    ...f.model,
    mesaExploracion: {
      ...f.model.mesaExploracion,
      fuentes: { ...f.model.mesaExploracion.fuentes, [sourceId]: { ...source, contenido: "La solicitud cambió después de la captura." } },
    },
  };
  await saveModel(f, changedModel);
  const service = new VariantService({ repository: f.repository });
  await expect(service.prepareIncorporation(session, "document", f.proposal.change.id)).rejects.toThrow("Dependencia obsoleta");
  expect((await f.legacy.get(session, "document"))?.revision).toBe(2);
  const saved = await f.legacy.get(session, "document");
  const current = saved && hidratarModelo(saved.json);
  expect(current?.ok && current.value.entidades["extra-object"]).toBeUndefined();
});

test("variant query dependencies retain their read layer through incorporation and gateway revalidation", async () => {
  const f = await fixture();
  const future = new Date(Date.now() + 60_000).toISOString();
  const currentDocumentBefore = await f.repository.transaction(session, "document", (tx) => tx.getDocument());
  if (!currentDocumentBefore) throw new Error("fixture document missing");
  const workingJson = exportarModelo(currentDocumentBefore.effectiveModel, carpetaIdDeJson(currentDocumentBefore.effectiveJson));
  const workingCopyHash = createHash("sha256").update(workingJson, "utf8").digest("hex");
  const state = Object.values(f.model.estados)[0];
  if (!state) throw new Error("fixture state missing");
  const activeTask = {
    ...f.task,
    intent: { ...f.task.intent, scopeIds: [...new Set([...f.task.intent.scopeIds, state.entidadId, state.id])] },
    status: "working" as const,
    lease: { owner: "worker", fence: f.task.lease.fence + 1, expiresAt: future },
    controller: { ...f.task.controller!, workingCopyHash },
  };
  const overlayOperations: SemanticOperation[] = [
    {
      operationId: "rename-variant-state",
      kind: "renameState",
      stateId: state.id,
      beforeName: state.nombre,
      afterName: `${state.nombre} en variante`,
      preconditions: [{ kind: "state", id: state.id, expectedName: state.nombre }],
    },
    {
      operationId: "create-overlay-object",
      kind: "createObject",
      id: "overlay-only-object",
      opdId: f.model.opdRaizId,
      name: "Objeto de variante",
      position: { x: 1_180, y: 260 },
      preconditions: [{ kind: "idAbsent", id: "overlay-only-object" }],
    },
  ];
  await f.repository.transaction(session, "document", async (tx) => {
    await tx.putTask(activeTask);
    const variant = await tx.getVariant(f.variantId);
    if (!variant) throw new Error("fixture variant missing");
    await tx.putVariant({ ...variant, operations: [], updatedAt: future });
  });

  const tools = createAgentTaskTools({ repository: f.repository });
  const controller = new AbortController();
  let sequence = 0;
  const run = (name: string, args: Record<string, JsonValue>) => tools.execute({ id: `call-${++sequence}`, name, args }, {
    session,
    task: activeTask,
    intentVersion: activeTask.intent.version,
    leaseFence: activeTask.lease.fence,
    signal: controller.signal,
  });
  const baseRead = await run("query_model", { kind: "alcanzable", elementId: state.entidadId, state: state.nombre });
  expect((baseRead.output as Record<string, JsonValue>).kind).toBe("derived-query");

  await f.repository.transaction(session, "document", async (tx) => {
    const variant = await tx.getVariant(f.variantId);
    if (!variant) throw new Error("fixture variant missing");
    const applied = applyChangeSet(f.model, { id: variant.id, operations: overlayOperations });
    if (applied.kind !== "validated") throw new Error(applied.message);
    await tx.putVariant({ ...variant, operations: overlayOperations, updatedAt: future });
  });
  const taskAfterOverlayRead = await f.repository.getTask(session, "document", f.task.id);
  if (!taskAfterOverlayRead) throw new Error("task missing after base query");
  expect(validateDependencies(f.model, taskAfterOverlayRead.dependencies ?? [], taskAfterOverlayRead, overlayOperations)).toBeNull();

  const overlayRead = await run("query_model", { kind: "impacto-de-eliminar", elementId: "overlay-only-object" });
  expect((overlayRead.output as Record<string, JsonValue>).kind).toBe("derived-query");
  const proposed = await run("propose_change", {
    explanation: "Agregar un segundo objeto después de comprobar la variante",
    operations: [{
      operationId: "create-followup-object",
      kind: "createObject",
      id: "followup-object",
      opdId: f.model.opdRaizId,
      name: "Objeto posterior",
      position: { x: 1_280, y: 260 },
      preconditions: [{ kind: "idAbsent", id: "followup-object" }],
    }],
  });
  const proposedOutput = proposed.output as Record<string, JsonValue>;
  if (typeof proposedOutput.changeId !== "string") throw new Error(`proposal failed: ${JSON.stringify(proposedOutput)}`);

  const service = new VariantService({ repository: f.repository });
  const prepared = await service.prepareIncorporation(session, "document", proposedOutput.changeId);
  expect(prepared.kind).toBe("prepared");
  if (prepared.kind !== "prepared") throw new Error("expected current-target incorporation candidate");
  const latestTask = await f.repository.getTask(session, "document", f.task.id);
  if (!latestTask) throw new Error("task missing after preparation");
  const currentDocument = await f.repository.transaction(session, "document", (tx) => tx.getDocument());
  if (!currentDocument) throw new Error("document missing after preparation");
  expect(validateDependencies(currentDocument.effectiveModel, prepared.change.dependencies, latestTask, prepared.change.operations)).toBeNull();
  expect(prepared.change.target).toEqual({ kind: "current", documentId: "document" });
  expect((await f.legacy.get(session, "document"))?.revision).toBe(1);

  const gateway = new ChangeGateway({ repository: f.repository });
  const grant = await gateway.prepareCommit(session, prepared.change, {
    kind: "review",
    controllerId: activeTask.controller.id,
    clientSequence: prepared.change.base.clientSequence,
    workingCopyHash: prepared.change.base.workingCopyHash,
  });
  const stored = await f.repository.transaction(session, "document", (tx) => tx.getChange(prepared.change.id));
  if (!stored) throw new Error("gateway candidate missing");
  const committed = await gateway.commit(session, stored.change, grant);
  expect(committed.kind).toBe("committed");
  expect((await f.legacy.get(session, "document"))?.revision).toBe(2);
  expect((await f.repository.transaction(session, "document", (tx) => tx.getVariant(f.variantId)))?.state).toBe("incorporated");
});

test("discarding a variant never changes the current document", async () => {
  const f = await fixture();
  const service = new VariantService({ repository: f.repository });
  const discarded = await service.discard(session, "document", f.variantId);
  expect(discarded.state).toBe("discarded");
  expect((await f.legacy.get(session, "document"))?.revision).toBe(1);
  const current = hidratarModelo((await f.legacy.get(session, "document"))!.json);
  expect(current.ok && current.value.entidades["extra-object"]).toBeUndefined();
});

test("tampered proposal content is rejected by its stored idempotency hash", async () => {
  const f = await fixture();
  await f.repository.transaction(session, "document", async (tx) => {
    const record = await tx.getChange(f.proposal.change.id);
    if (!record) throw new Error("fixture proposal missing");
    await tx.putChange({ ...record, requestHash: "different-content" });
  });
  const service = new VariantService({ repository: f.repository });
  await expect(service.prepareIncorporation(session, "document", f.proposal.change.id)).rejects.toThrow("identidad del candidato");
  expect((await f.legacy.get(session, "document"))?.revision).toBe(1);
});
