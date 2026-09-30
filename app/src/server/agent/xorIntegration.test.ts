import { createHash, randomUUID } from "node:crypto";
import { expect, test } from "bun:test";
import { DEFAULT_TASK_BUDGET, emptyTaskUsage } from "../../agent/taskState";
import { createOrderFixture } from "../../agent/fixtures/order";
import type { Base, ChangeSet, SemanticOperation } from "../../agent/contracts";
import { AGENT_CAPABILITY_PROFILE } from "../../agent/capabilityProfile";
import { construirModeloPersistido } from "../../persistencia/modelos";
import { exportarModelo, carpetaIdDeJson } from "../../serializacion/json";
import type { PersistenciaSesion } from "../modelPersistence";
import { crearRepoMemoria } from "../repoMemoria";
import { ChangeGateway, ChangeGatewayError } from "./changeGateway";
import type { AgentDocumentSnapshot, AgentRepository, AgentTaskRecord } from "./repository";
import type { JsonValue } from "./provider";
import { createAgentTaskTools } from "./tools";

const session: PersistenciaSesion = {
  tenantId: "xor-integration-tenant",
  userId: "xor-integration-operator",
  auth: true,
  authKind: "operator",
};
const expiresAt = new Date(Date.now() + 60_000).toISOString();

async function harness(scope: "opd" | "order-entity") {
  const fixture = createOrderFixture();
  // Preserve the exact common ports and procedural branches, but remove the
  // fixture XOR so this test exercises a fresh create-only operation.
  const model = { ...fixture.model, abanicos: {} };
  const json = exportarModelo(model);
  const persisted = construirModeloPersistido({ id: "xor-document", nombre: model.nombre, json, revision: 1 });
  const legacy = crearRepoMemoria([persisted], session);
  const repository = legacy.agentRepository;
  const snapshot = await repository.transaction(session, "xor-document", async (tx) => {
    const document = await tx.getDocument();
    if (!document) throw new Error("Falta el documento sembrado");
    return document;
  });
  const workingCopyHash = hashWorkingCopy(snapshot);
  const scopeIds = scope === "opd" ? [model.opdRaizId] : [fixture.ids.order];
  const task: AgentTaskRecord = {
    id: `task-${randomUUID()}`, tenantId: session.tenantId, documentId: "xor-document", actorId: session.userId,
    status: "working", reason: null,
    intent: {
      id: `intent-${randomUUID()}`, version: 1,
      target: { kind: "current", documentId: "xor-document" },
      outcome: "Agrupar las rutas mutuamente excluyentes del OPD indicado",
      scopeIds, exclusions: [], allowedSourceIds: [], sufficiency: ["Exclusión revisable"], authority: "propose",
      authorizationVersion: 1, rejectedAlternatives: [],
    },
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    budget: { ...DEFAULT_TASK_BUDGET }, usage: emptyTaskUsage(),
    profile: { provider: "xiaomi-mimo", protocol: "chat-completions", model: "mimo-v2.6-pro" },
    transcript: [], controller: { id: "browser-xor", expiresAt, clientSequence: 0, workingCopyHash },
    lease: { owner: "worker-xor", fence: 1, expiresAt }, results: [], pendingDecision: null, pendingCommit: null,
    dependencies: [], sources: [],
  };
  await repository.transaction(session, "xor-document", (tx) => tx.putTask(task));
  return { fixture, model, legacy, repository, snapshot, task, gateway: new ChangeGateway({ repository }) };
}

function hashWorkingCopy(document: AgentDocumentSnapshot): string {
  const canonical = exportarModelo(document.effectiveModel, carpetaIdDeJson(document.effectiveJson));
  return createHash("sha256").update(canonical, "utf8").digest("hex");
}

function xorOperation(f: Awaited<ReturnType<typeof harness>>, id: string): SemanticOperation {
  return {
    kind: "createXorExclusion", operationId: `operation-${id}`, id, opdId: f.model.opdRaizId,
    linkIds: [f.fixture.ids.pickupLink, f.fixture.ids.deliveryLink],
    preconditions: [
      { kind: "opdExists", id: f.model.opdRaizId },
      { kind: "idAbsent", id },
    ],
  };
}

function baseOf(document: AgentDocumentSnapshot): Base {
  return {
    revision: document.model.revision ?? 0,
    semanticHash: document.semanticHash,
    workingCopyHash: hashWorkingCopy(document),
    clientSequence: 0,
    profileVersion: AGENT_CAPABILITY_PROFILE,
  };
}

test("an explicitly scoped OPD can author XOR through tools and the gateway commits a reviewable result", async () => {
  const f = await harness("opd");
  const call = {
    id: "propose-xor",
    name: "propose_change",
    args: {
      explanation: "Las rutas de retiro y reparto son alternativas excluyentes.",
      operations: [xorOperation(f, "xor-routes")],
    } as unknown as JsonValue,
  };
  const result = await createAgentTaskTools({ repository: f.repository }).execute(call, {
    session, task: f.task, intentVersion: f.task.intent.version, leaseFence: f.task.lease.fence,
    signal: new AbortController().signal,
  });
  const output = result.output as Record<string, JsonValue>;
  if (output.kind !== "proposal") throw new Error(JSON.stringify(output));
  expect(output.kind).toBe("proposal");
  expect(JSON.stringify((output.diff as Record<string, JsonValue>).opl)).toContain("exactamente uno");
  const changeId = output.changeId;
  if (typeof changeId !== "string") throw new Error("La propuesta XOR no guardó su cambio");
  const stored = await f.repository.transaction(session, "xor-document", (tx) => tx.getChange(changeId));
  if (!stored) throw new Error("Falta el cambio XOR preparado");

  const grant = await f.gateway.prepareCommit(session, stored.change, {
    kind: "review", controllerId: "browser-xor", clientSequence: 0, workingCopyHash: hashWorkingCopy(f.snapshot),
  });
  const committed = await f.gateway.commit(session, stored.change, grant);
  expect(committed.kind).toBe("committed");
  if (committed.kind !== "committed") throw new Error(committed.message);
  expect(committed.receipt.appliedOperationIds).toEqual(["operation-xor-routes"]);
  const saved = await f.legacy.get(session, "xor-document");
  expect(saved?.revision).toBe(2);
  const roundTrip = await f.repository.transaction(session, "xor-document", async (tx) => tx.getDocument());
  expect(roundTrip?.effectiveModel.abanicos?.["xor-routes"]).toMatchObject({
    operador: "XOR", enlaceIds: [f.fixture.ids.pickupLink, f.fixture.ids.deliveryLink],
  });
});

test("a task scoped to an entity cannot smuggle an XOR create for an unselected OPD through the gateway", async () => {
  const f = await harness("order-entity");
  const change: ChangeSet = {
    id: "forbidden-xor", taskId: f.task.id, actorId: session.userId, intentVersion: f.task.intent.version,
    target: f.task.intent.target, base: baseOf(f.snapshot), operations: [xorOperation(f, "xor-out-of-scope")],
    readIds: [], writeIds: [], dependencies: [], explanation: "No debe atravesar el límite de alcance.",
  };

  await expect(f.gateway.prepareCommit(session, change, {
    kind: "review", controllerId: "browser-xor", clientSequence: 0, workingCopyHash: hashWorkingCopy(f.snapshot),
  })).rejects.toMatchObject({ code: "authority-denied" } satisfies Partial<ChangeGatewayError>);
  expect((await f.legacy.get(session, "xor-document"))?.revision).toBe(1);
});
