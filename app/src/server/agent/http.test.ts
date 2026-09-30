import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { AGENT_CAPABILITY_PROFILE } from "../../agent/capabilityProfile";
import type { ChangeSet } from "../../agent/contracts";
import { crearModelo, crearObjeto, crearProceso } from "../../modelo/operaciones";
import { construirModeloPersistido } from "../../persistencia/modelos";
import { carpetaIdDeJson, exportarModelo, hidratarModelo } from "../../serializacion/json";
import type { PersistenciaSesion } from "../modelPersistence";
import { crearRepoMemoria } from "../repoMemoria";
import { ChangeGateway } from "./changeGateway";
import { hashCommitRequest } from "./commitGrant";
import { loadAgentConfig } from "./config";
import { createAgentHttpHandler, isSameOriginRequest } from "./http";
import { prepareHumanChange } from "./humanChanges";
import { TaskRuntime } from "./taskRuntime";

const session: PersistenciaSesion = { tenantId: "tenant-http", userId: "operator-http", auth: true, authKind: "operator" };
async function fixture(model = crearModelo("Documento sintético")) {
  const persisted = construirModeloPersistido({ id: "document", nombre: model.nombre, json: exportarModelo(model), revision: 1 });
  const legacy = crearRepoMemoria([persisted], session);
  const repository = legacy.agentRepository;
  const config = loadAgentConfig({ OPFORJA_AGENT_ENABLED: "true", OPFORJA_AGENT_API_KEY: "test-only" });
  const runtime = new TaskRuntime({ repository, config,
    provider: { async *stream() {
      yield { type: "tool-call", toolCallId: "read-completed", name: "finish_task", args: {} };
      yield { type: "finish", reason: "tool-calls", usage: { status: "known", inputTokens: 10, outputTokens: 10 } };
    } },
    tools: { definitions: {}, context: async () => "Synthetic fixture", execute: async () => ({ output: {}, halt: "completed" }) },
  });
  const gateway = new ChangeGateway({ repository });
  const handler = createAgentHttpHandler({ repository, runtime, config, gateway,
    variants: { prepareIncorporation: async () => { throw new Error("No variant in this fixture"); } },
  });
  const request = (path: string, body?: unknown, actor = session) => handler(new Request(`http://localhost/__deep-opm/agent/${path}`, {
    method: body === undefined ? "GET" : "POST", headers: { origin: "http://localhost", "content-type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  }), actor);
  const document = await repository.transaction(session, persisted.id, (tx) => tx.getDocument());
  return { legacy, repository, runtime, gateway, request, handler, document: document! };
}

describe("agent HTTP integration", () => {
  test("same-origin policy handles the trusted proxy and rejects cross-site requests", () => {
    expect(isSameOriginRequest(new Request("http://model-api/", { headers: { host: "opforja.example", origin: "https://opforja.example", "x-forwarded-proto": "https" } }))).toBe(true);
    expect(isSameOriginRequest(new Request("http://localhost/", { headers: { origin: "https://other.example" } }))).toBe(false);
    expect(isSameOriginRequest(new Request("http://localhost/", { headers: { "sec-fetch-site": "cross-site" } }))).toBe(false);
  });

  test("status never exposes the key and external credentials cannot open task routes", async () => {
    const h = await fixture();
    const status = await h.request("status");
    expect(status.status).toBe(200);
    expect(await status.text()).not.toContain("test-only");
    const denied = await h.request("tasks?documentId=document", undefined, { ...session, authKind: "agent" });
    expect(denied.status).toBe(403);
    const anonymous = await h.request("status", undefined, { tenantId: session.tenantId, userId: session.userId });
    expect(anonymous.status).toBe(403);
  });

  test("task snapshot and replay remain tenant-scoped and exclude provider transcript", async () => {
    const h = await fixture();
    const response = await h.request("tasks", {
      documentId: "document", outcome: "Leer el modelo sintético", scopeIds: ["opd-1"], authority: "read",
      controllerId: "controller", clientSequence: 0, workingCopyHash: h.document.semanticHash,
    });
    expect(response.status).toBe(202);
    const started = await response.json();
    await h.runtime.wait(started.task.id);
    const snapshot = await (await h.request(`tasks/${started.task.id}?documentId=document`)).json();
    expect(snapshot.task.status).toBe("completed");
    expect(snapshot.cursor).toBeGreaterThan(0);
    expect(snapshot.task.transcript).toBeUndefined();
    const replay = await h.request(`tasks/${started.task.id}/events?documentId=document&after=0`);
    expect(replay.headers.get("content-type")).toContain("text/event-stream");
    expect(await replay.text()).toContain("event: task");
    const other = await h.request(`tasks/${started.task.id}?documentId=document`, undefined, { ...session, tenantId: "other" });
    expect(other.status).toBe(404);
  });

  test("malformed authoring arguments do not create a task", async () => {
    const h = await fixture();
    const response = await h.request("tasks", { documentId: "document", outcome: "x", scopeIds: "opd-1" });
    expect(response.status).toBe(400);
    expect(await h.repository.listTasks(session, "document")).toHaveLength(0);
  });

  test("a human refinement exposes its frontier and is applied only after review", async () => {
    const empty = crearModelo("Refinar un reparto");
    const made = crearProceso(empty, empty.opdRaizId, { x: 50, y: 50 }, "Reparto", { id: "delivery" });
    if (!made.ok) throw new Error(made.error);
    const h = await fixture(made.value);
    const binding = { documentId: "document", controllerId: "tab", clientSequence: 0,
      workingCopyHash: createHash("sha256").update(exportarModelo(h.document.effectiveModel, carpetaIdDeJson(h.document.effectiveJson))).digest("hex") };
    const response = await h.request("refinements", { ...binding, entityId: "delivery", opdId: "opd-1",
      refinementType: "descomposicion", question: "¿Cómo se reparte?", justification: "Precisar sus pasos" });
    const proposed = await response.json();
    expect({ status: response.status, error: proposed.error }).toEqual({ status: 200, error: undefined });
    expect(proposed.frontier).toEqual({ declarations: 0, preserved: true });
    expect((await h.legacy.get(session, "document"))?.revision).toBe(1);
    const { grant } = await (await h.request(`changes/${proposed.changeId}/grants`, { ...binding, kind: "review" })).json();
    const committed = await (await h.request(`changes/${proposed.changeId}/commit`, { documentId: "document", grant })).json();
    expect(committed.kind).toBe("committed");
    expect(committed.receipt.revision).toBe(2);
    const reopened = hidratarModelo(committed.modelJson);
    expect(reopened.ok && Object.keys(reopened.value.opds).length).toBe(2);
    expect((await h.repository.listTasks(session, "document")).length).toBe(0);
  });

  test("an unexpected error after durable commit stays uncertain and the receipt remains recoverable", async () => {
    const h = await fixture();
    const binding = { documentId: "document", controllerId: "tab", clientSequence: 0,
      workingCopyHash: createHash("sha256").update(exportarModelo(h.document.effectiveModel, carpetaIdDeJson(h.document.effectiveJson))).digest("hex") };
    const prepared = await prepareHumanChange(h.repository, session, binding, () => ({
      explanation: "Crear pedido", operations: [{ kind: "createObject", operationId: "one", preconditions: [],
        id: "order", name: "Pedido", opdId: "opd-1", position: { x: 50, y: 50 } }],
    }));
    const grantResponse = await h.request(`changes/${prepared.changeId}/grants`, { ...binding, kind: "review" });
    const { grant } = await grantResponse.json();
    const commit = h.gateway.commit.bind(h.gateway);
    h.gateway.commit = async (...args) => { await commit(...args); throw new Error("Response interrupted after commit"); };
    const failed = await h.request(`changes/${prepared.changeId}/commit`, { documentId: "document", grant });
    expect(failed.status).toBe(500);
    expect(await failed.text()).not.toContain("Response interrupted");
    const recovered = await (await h.request(`changes/${prepared.changeId}/receipt?documentId=document`)).json();
    expect(recovered.receipt.revision).toBe(2);
    expect(recovered.applied.modelJson).toContain('"order"');
    expect((await h.legacy.get(session, "document"))?.revision).toBe(2);
  });

  test("a file-backed reference is reviewed, versioned by its bytes, updated, and undone through the common gateway", async () => {
    const own = crearProceso(crearModelo("Documento propio"), "opd-1", { x: 50, y: 50 }, "Consumir", { id: "consumer" });
    const external = crearObjeto(crearModelo("Biblioteca sintética"), "opd-1", { x: 50, y: 50 }, "Recurso", { id: "resource" });
    if (!own.ok || !external.ok) throw new Error("Fixture inválido");
    const source = { ...external.value, id: "library" };
    const h = await fixture(own.value);
    let binding = { documentId: "document", controllerId: "tab", clientSequence: 0,
      workingCopyHash: createHash("sha256").update(exportarModelo(h.document.effectiveModel, carpetaIdDeJson(h.document.effectiveJson))).digest("hex") };
    const applyPrepared = async (changeId: string) => {
      const grantResponse = await h.request(`changes/${changeId}/grants`, { ...binding, kind: "review" });
      const grant = await grantResponse.json();
      expect({ status: grantResponse.status, error: grant.error }).toEqual({ status: 200, error: undefined });
      const response = await h.request(`changes/${changeId}/commit`, { documentId: "document", grant: grant.grant });
      const committed = await response.json();
      expect(committed.kind).toBe("committed");
      binding = { ...binding, clientSequence: binding.clientSequence + 1, workingCopyHash: committed.base.workingCopyHash };
      const opened = hidratarModelo(committed.modelJson);
      if (!opened.ok) throw new Error(opened.error);
      return opened.value;
    };
    const sourceJson = exportarModelo(source);
    const preparedResponse = await h.request("pieces", { ...binding, kind: "reference", sourceJson,
      pieceId: "resource", function: "Representar un recurso", target: { opdId: "opd-1", anchorEntityId: "consumer" } });
    const prepared = await preparedResponse.json();
    expect({ status: preparedResponse.status, error: prepared.error }).toEqual({ status: 200, error: undefined });
    expect(prepared.manifest.version.id).toBe(createHash("sha256").update(sourceJson).digest("hex"));
    expect((await h.legacy.get(session, "document"))?.revision).toBe(1);
    const referenced = await applyPrepared(prepared.changeId);
    const reference = Object.values(referenced.submodelos ?? {}).find((entry) => entry.piece)!;
    expect(reference.piece?.identity).toEqual({ modelId: "library", pieceId: "resource" });
    const updatedSource = { ...source, entidades: { ...source.entidades,
      resource: { ...source.entidades.resource!, descripcion: "Versión nueva" } } };
    const payload = { ...binding, kind: "update", sourceJson: exportarModelo(updatedSource), pieceId: "resource",
      function: "Representar un recurso", target: { referenceId: reference.id, expectedSourceVersion: reference.piece!.version.id } };
    expect((await h.request("pieces", { ...payload, target: { ...payload.target, expectedSourceVersion: "stale" } })).status).toBe(409);
    const updateResponse = await h.request("pieces", payload);
    const update = await updateResponse.json();
    expect({ status: updateResponse.status, error: update.error }).toEqual({ status: 200, error: undefined });
    const updated = await applyPrepared(update.changeId);
    expect(updated.submodelos?.[reference.id]?.piece?.version.id).not.toBe(reference.piece!.version.id);
    const undoResponse = await h.request(`changes/${update.changeId}/undo`, binding);
    expect(undoResponse.status).toBe(200);
    const undone = await applyPrepared((await undoResponse.json()).changeId);
    expect(undone.submodelos?.[reference.id]?.piece?.version.id).toBe(reference.piece!.version.id);
    expect((await h.legacy.get(session, "document"))?.revision).toBe(4);
    expect(await h.repository.listTasks(session, "document")).toHaveLength(0);
  });

  test("HTTP grant, commit, replay, and receipt refer to one canonical model change", async () => {
    const h = await fixture();
    const workingCopyHash = createHash("sha256").update(exportarModelo(h.document.effectiveModel, carpetaIdDeJson(h.document.effectiveJson))).digest("hex");
    const start = await (await h.request("tasks", {
      documentId: "document", outcome: "Leer", scopeIds: ["opd-1"], authority: "read",
      controllerId: "controller", clientSequence: 0, workingCopyHash,
    })).json();
    await h.runtime.wait(start.task.id);
    const change: ChangeSet = {
      id: "human-reviewed", taskId: null, actorId: session.userId, intentVersion: null,
      target: { kind: "current", documentId: "document" },
      base: { revision: 1, semanticHash: h.document.semanticHash, workingCopyHash, clientSequence: 0, profileVersion: AGENT_CAPABILITY_PROFILE },
      operations: [{ kind: "createObject", operationId: "create-item", id: "item", opdId: "opd-1", name: "Pedido", position: { x: 100, y: 100 }, preconditions: [{ kind: "idAbsent", id: "item" }] }],
      readIds: ["opd-1"], writeIds: ["item", "opd-1"], dependencies: [], explanation: "Objeto revisado por operador",
    };
    await h.repository.transaction(session, "document", (tx) => tx.putChange({ change, requestHash: hashCommitRequest({ change, undoOf: null }), status: "prepared", createdAt: new Date().toISOString(), inverse: null, receipt: null, grant: null }));
    const grantResponse = await h.request(`tasks/${start.task.id}/grants`, { documentId: "document", changeId: change.id, kind: "review", controllerId: "controller", clientSequence: 0, workingCopyHash });
    const grantBody = await grantResponse.json();
    expect({ status: grantResponse.status, error: grantBody.error }).toEqual({ status: 200, error: undefined });
    const { grant } = grantBody;
    const committedResponse = await h.request(`changes/${change.id}/commit`, { documentId: "document", grant });
    const committed = await committedResponse.json();
    expect({ status: committedResponse.status, message: committed.message }).toEqual({ status: 200, message: undefined });
    expect(committed.receipt.revision).toBe(2);
    const saved = await h.legacy.get(session, "document");
    const hydrated = hidratarModelo(saved!.json);
    expect(hydrated.ok && hydrated.value.entidades.item?.nombre).toBe("Pedido");
    const replay = await (await h.request(`changes/${change.id}/commit`, { documentId: "document", grant })).json();
    expect(replay.receipt).toEqual(committed.receipt);
    const receipt = await (await h.request(`changes/${change.id}/receipt?documentId=document`)).json();
    expect(receipt.receipt).toEqual(committed.receipt);
    expect(receipt.applied.modelJson).toBe(committed.modelJson);
    expect(receipt.applied.inverse).toEqual(committed.inverse);
    expect((await h.legacy.get(session, "document"))!.revision).toBe(2);

    const undoBinding = { documentId: "document", controllerId: "controller", clientSequence: 1, workingCopyHash: committed.base.workingCopyHash };
    const preparedUndoResponse = await h.request(`changes/${change.id}/undo`, undoBinding);
    expect(preparedUndoResponse.status).toBe(200);
    const preparedUndo = await preparedUndoResponse.json();
    expect(preparedUndo.change.taskId).toBeNull();
    const undoGrant = await (await h.request(`changes/${preparedUndo.changeId}/grants`, { ...undoBinding, kind: "review" })).json();
    const undo = await (await h.request(`changes/${preparedUndo.changeId}/commit`, { documentId: "document", grant: undoGrant.grant })).json();
    expect(undo.kind).toBe("committed");
    expect(undo.receipt.revision).toBe(3);
    const undone = hidratarModelo(undo.modelJson);
    expect(undone.ok && undone.value.entidades.item).toBeUndefined();
    expect((await h.request(`changes/${change.id}/undo`, undoBinding)).status).toBe(409);

    const reapplyBinding = { ...undoBinding, clientSequence: 2, workingCopyHash: undo.base.workingCopyHash };
    const preparedReapplyResponse = await h.request(`changes/${change.id}/reapply`, reapplyBinding);
    expect(preparedReapplyResponse.status).toBe(200);
    const preparedReapply = await preparedReapplyResponse.json();
    expect(preparedReapply.changeId).not.toBe(change.id);
    const reapplyGrant = await (await h.request(`changes/${preparedReapply.changeId}/grants`, { ...reapplyBinding, kind: "review" })).json();
    const reapplied = await (await h.request(`changes/${preparedReapply.changeId}/commit`, { documentId: "document", grant: reapplyGrant.grant })).json();
    expect(reapplied.kind).toBe("committed");
    expect(reapplied.receipt.revision).toBe(4);
    const reopened = hidratarModelo(reapplied.modelJson);
    expect(reopened.ok && reopened.value.entidades.item?.nombre).toBe("Pedido");
    expect((await h.request(`changes/${change.id}/reapply`, reapplyBinding)).status).toBe(409);
    const secondReplay = await (await h.request(`changes/${preparedReapply.changeId}/commit`, { documentId: "document", grant: reapplyGrant.grant })).json();
    expect(secondReplay.receipt).toEqual(reapplied.receipt);
    expect((await h.legacy.get(session, "document"))!.revision).toBe(4);
  });
});
