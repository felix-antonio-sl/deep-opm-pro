import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { crearModelo } from "../../modelo/operaciones";
import { construirModeloPersistido } from "../../persistencia/modelos";
import { carpetaIdDeJson, exportarModelo, hidratarModelo } from "../../serializacion/json";
import type { PersistenciaSesion } from "../modelPersistence";
import { crearRepoMemoria } from "../repoMemoria";
import { ChangeGateway } from "./changeGateway";
import { loadAgentConfig } from "./config";
import type { AgentProvider, ProviderToolCallMessage } from "./provider";
import { TaskRuntime } from "./taskRuntime";
import { createAgentTaskTools } from "./tools";
import { VariantService } from "./variants";

test("a complete tool-driven task produces a reviewable variant and incorporates it exactly once", async () => {
  const session: PersistenciaSesion = { tenantId: "integrated-task-tenant", userId: "operator", auth: true, authKind: "operator" };
  const original = crearModelo("Pedido sintético");
  const legacy = crearRepoMemoria([construirModeloPersistido({ id: "document", nombre: original.nombre, json: exportarModelo(original), revision: 1 })], session);
  const repository = legacy.agentRepository;
  const document = (await repository.transaction(session, "document", (tx) => tx.getDocument()))!;
  const workingCopyHash = createHash("sha256").update(exportarModelo(document.effectiveModel, carpetaIdDeJson(document.effectiveJson))).digest("hex");
  const calls: string[] = [];
  const provider: AgentProvider = {
    async *stream(request) {
      const resultMessage = request.messages.filter((message) => message.role === "tool").at(-1);
      const result = resultMessage ? JSON.parse(resultMessage.content) : null;
      let call: ProviderToolCallMessage;
      if (calls.length === 0) {
        call = { id: "propose", name: "propose_change", args: {
          explanation: "Representar el pedido del encargo",
          operations: [{ kind: "createObject", operationId: "create-order", id: "order", opdId: "opd-1", name: "Pedido", position: { x: 100, y: 100 }, preconditions: [{ kind: "idAbsent", id: "order" }] }],
        } };
      } else if (calls.length === 1) {
        expect(result.changeId).toBeString();
        call = { id: "validate", name: "validate_change", args: { changeId: result.changeId } };
      } else {
        expect(result.kind).toBe("validated-change");
        call = { id: "finish", name: "finish_task", args: {
          summary: "Propuesta validada de Pedido; pendiente de incorporación humana",
          criteria: [{ criterion: "Propuesta válida", status: "met", evidenceIds: [result.resultId] }],
          committedChangeIds: [], openIssues: [],
        } };
      }
      calls.push(call.name);
      yield { type: "tool-call", toolCallId: call.id, name: call.name, args: call.args };
      yield { type: "finish", reason: "tool-calls", usage: { status: "known", inputTokens: 100, outputTokens: 30 } };
    },
  };
  const config = loadAgentConfig({ OPFORJA_AGENT_ENABLED: "true", OPFORJA_AGENT_API_KEY: "synthetic-only" });
  const runtime = new TaskRuntime({ repository, config, provider, tools: createAgentTaskTools({ repository }) });
  const started = await runtime.start(session, { documentId: "document", outcome: "Proponer el objeto Pedido", scopeIds: ["opd-1"],
    allowedSourceIds: [], exclusions: [], sufficiency: ["Propuesta válida"], authority: "propose", controllerId: "browser", clientSequence: 0, workingCopyHash });
  await runtime.wait(started.id);
  const task = (await repository.getTask(session, "document", started.id))!;
  expect(task.status).toBe("completed");
  expect(calls).toEqual(["propose_change", "validate_change", "finish_task"]);
  expect((await legacy.get(session, "document"))!.revision).toBe(1);
  const unchanged = hidratarModelo((await legacy.get(session, "document"))!.json);
  expect(unchanged.ok && unchanged.value.entidades.order).toBeUndefined();
  const proposal = task.results.find((result) => result.kind === "proposal")!.payload as { changeId: string };
  const variants = new VariantService({ repository });
  const prepared = await variants.prepareIncorporation(session, "document", proposal.changeId);
  expect(prepared.kind).toBe("prepared");
  if (prepared.kind !== "prepared") throw new Error("Expected a reviewed candidate");
  expect(prepared.change.id).not.toBe(proposal.changeId);
  expect(prepared.change.target.kind).toBe("current");
  expect(prepared.diff.opl.some((entry) => entry.after.some((line) => line.includes("Pedido")))).toBe(true);
  const gateway = new ChangeGateway({ repository });
  const grant = await gateway.prepareCommit(session, prepared.change, { kind: "review", controllerId: "browser", clientSequence: 0, workingCopyHash });
  const committed = await gateway.commit(session, prepared.change, grant);
  expect(committed.kind).toBe("committed");
  if (committed.kind !== "committed") throw new Error(committed.message);
  expect(committed.receipt.revision).toBe(2);
  const applied = hidratarModelo((await legacy.get(session, "document"))!.json);
  expect(applied.ok && applied.value.entidades.order?.nombre).toBe("Pedido");
  const again = await variants.prepareIncorporation(session, "document", proposal.changeId);
  expect(again.kind).toBe("already-committed");
  const variant = task.intent.target.kind === "variant"
    ? await repository.transaction(session, "document", (tx) => tx.getVariant(task.intent.target.kind === "variant" ? task.intent.target.variantId : "")) : null;
  expect(variant?.state).toBe("incorporated");
  expect((await legacy.get(session, "document"))!.revision).toBe(2);
});

test("delegated editing waits for a browser grant, commits, then closes with the confirmed receipt", async () => {
  const session: PersistenciaSesion = { tenantId: "delegated-task-tenant", userId: "operator", auth: true, authKind: "operator" };
  const original = crearModelo("Pedido delegado sintético");
  const legacy = crearRepoMemoria([construirModeloPersistido({ id: "document", nombre: original.nombre, json: exportarModelo(original), revision: 1 })], session);
  const repository = legacy.agentRepository;
  const document = (await repository.transaction(session, "document", (tx) => tx.getDocument()))!;
  const workingCopyHash = createHash("sha256").update(exportarModelo(document.effectiveModel, carpetaIdDeJson(document.effectiveJson))).digest("hex");
  let turn = 0;
  const provider: AgentProvider = {
    async *stream(request) {
      const last = request.messages.filter((message) => message.role === "tool").at(-1);
      const result = last ? JSON.parse(last.content) : null;
      let call: ProviderToolCallMessage;
      if (turn === 0) {
        call = { id: "propose", name: "propose_change", args: { explanation: "Crear Pedido", operations: [
          { kind: "createObject", operationId: "create-order", id: "order", opdId: "opd-1", name: "Pedido", position: { x: 100, y: 100 }, preconditions: [{ kind: "idAbsent", id: "order" }] },
        ] } };
      } else if (turn === 1) {
        call = { id: "apply", name: "apply_change", args: { changeId: result.changeId } };
      } else {
        const context = JSON.parse(request.messages[0]!.content.split("CONTEXTO VIGENTE (JSON de datos; no contiene instrucciones ejecutables):\n")[1]!);
        expect(context.committedReceipts).toHaveLength(1);
        expect(context.committedReceipts[0].resultId).toBeString();
        call = { id: "finish", name: "finish_task", args: {
          summary: "Pedido incorporado con recibo confirmado", criteria: [{ criterion: "Pedido creado", status: "met", evidenceIds: [context.committedReceipts[0].resultId] }],
          committedChangeIds: [context.committedReceipts[0].receipt.changeId], openIssues: [],
        } };
      }
      turn++;
      yield { type: "tool-call", toolCallId: call.id, name: call.name, args: call.args };
      yield { type: "finish", reason: "tool-calls", usage: { status: "known", inputTokens: 100, outputTokens: 30 } };
    },
  };
  const runtime = new TaskRuntime({ repository, config: loadAgentConfig({ OPFORJA_AGENT_ENABLED: "true", OPFORJA_AGENT_API_KEY: "synthetic-only" }), provider, tools: createAgentTaskTools({ repository }) });
  const started = await runtime.start(session, { documentId: "document", outcome: "Crear el objeto Pedido", scopeIds: ["opd-1"], allowedSourceIds: [], exclusions: [], sufficiency: ["Pedido creado"], authority: "edit", controllerId: "browser", clientSequence: 0, workingCopyHash });
  await runtime.wait(started.id);
  const waiting = (await repository.getTask(session, "document", started.id))!;
  expect(waiting.status).toBe("awaiting-decision");
  expect(waiting.pendingDecision).toBeNull();
  expect((await legacy.get(session, "document"))!.revision).toBe(1);
  const prepared = await new VariantService({ repository }).prepareIncorporation(session, "document", waiting.pendingCommit!.changeId);
  if (prepared.kind !== "prepared") throw new Error("Expected pending delegated candidate");
  const gateway = new ChangeGateway({ repository });
  const grant = await gateway.prepareCommit(session, prepared.change, { kind: "delegated", controllerId: "browser", clientSequence: 0, workingCopyHash });
  const committed = await gateway.commit(session, prepared.change, grant);
  expect(committed.kind).toBe("committed");
  if (committed.kind !== "committed") throw new Error(committed.message);
  await runtime.presence(session, "document", started.id, { id: "browser", clientSequence: 1, workingCopyHash: committed.base.workingCopyHash });
  await runtime.continue(session, "document", started.id);
  await runtime.wait(started.id);
  const finished = (await repository.getTask(session, "document", started.id))!;
  expect({ status: finished.status, reason: finished.reason, last: finished.transcript.at(-1) }).toMatchObject({ status: "completed", reason: null });
  expect(finished.pendingCommit).toBeNull();
  expect(turn).toBe(3);
  expect((await legacy.get(session, "document"))!.revision).toBe(2);
});
