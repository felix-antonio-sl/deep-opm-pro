import { createHash, randomUUID } from "node:crypto";
import { AGENT_CAPABILITY_PROFILE, agentCapabilityProfile } from "../../agent/capabilityProfile";
import { projectChangeDiff, type ProjectedChangeDiff } from "../../agent/changeProjection";
import type { ChangeSet } from "../../agent/contracts";
import type { StartTaskRequest } from "../../agent/taskView";
import { applyChangeSet, validateInverse } from "../../modelo/changes/apply";
import { applyRefinementOperation, refinementFrontier, type CreateRefinementOperation } from "../../modelo/changes/refinement";
import { preparePieceOperation, type PieceOperationInput, type PieceOperationPreparation } from "../../modelo/reuse/piece";
import { carpetaIdDeJson, exportarModelo, hidratarModelo } from "../../serializacion/json";
import { PersistenciaConflictError, type PersistenciaSesion } from "../modelPersistence";
import { esRecord, leerJsonRequest, responderJson } from "../persistenceHttp";
import { ChangeGateway, ChangeGatewayError } from "./changeGateway";
import { hashCommitRequest, type CommitGrant } from "./commitGrant";
import { agentAvailability, type AgentConfig } from "./config";
import { parseEventCursor, taskEventsResponse } from "./events";
import { assertAgentTaskScope, type AgentChangeRecord, type AgentRepository } from "./repository";
import { TaskRuntime, taskView } from "./taskRuntime";
import type { PrepareIncorporationResult } from "./variants";
import { prepareHumanChange } from "./humanChanges";

interface PreparedChange { changeId: string; change: ChangeSet; diff: ProjectedChangeDiff }
export interface AgentHttpOptions {
  repository: AgentRepository;
  runtime: TaskRuntime;
  gateway: ChangeGateway;
  config: AgentConfig;
  variants: { prepareIncorporation(session: PersistenciaSesion, documentId: string, changeId: string): Promise<PrepareIncorporationResult> };
}

/** Mounted only after the persistence session and identity checks. */
export function createAgentHttpHandler(options: AgentHttpOptions) {
  const { repository, runtime, gateway, config, variants } = options;
  return async (request: Request, session: PersistenciaSesion): Promise<Response> => {
    try {
      if (!session.auth || session.authKind === "agent") throw new HttpError(403, "Se requiere una sesión del operador");
      if (!isSameOriginRequest(request)) throw new HttpError(403, "Origen de la solicitud no permitido");
      const url = new URL(request.url);
      const route = url.pathname.replace(/^\/__deep-opm\/agent\/?/, "").split("/");
      const isRead = request.method === "GET";
      if (!isRead && request.method !== "POST") throw new HttpError(405, "Método no permitido");
      const body = isRead ? {} : await readBody(request, route[0] === "pieces" ? 2 * 1024 * 1024 + 16_384 : 128 * 1024);
      if (route[0] === "status" && route.length === 1 && isRead) {
        return json({ ...agentAvailability(config), profile: agentCapabilityProfile(), model: config.profile.model, budgetIncrement: config.budget });
      }
      const documentId = string(isRead ? url.searchParams.get("documentId") : body.documentId, "documentId", 200);
      if (route[0] === "pieces" && route.length === 1 && !isRead) {
        const input = pieceInput(body);
        let metadata: Pick<PieceOperationPreparation, "manifest" | "losses" | "comparison"> | null = null;
        const prepared = await prepareHumanChange(repository, session, {
          documentId, controllerId: string(body.controllerId, "controllerId", 200),
          clientSequence: integer(body.clientSequence, "clientSequence"),
          workingCopyHash: string(body.workingCopyHash, "workingCopyHash", 200),
        }, (model) => {
          const proposal = preparePieceOperation(model, input);
          if (!proposal.ok) throw new ChangeGatewayError("invalid-change", proposal.error);
          const { operations, explanation, manifest, losses, comparison } = proposal.value;
          metadata = { manifest, losses, ...(comparison ? { comparison } : {}) };
          return { operations, explanation };
        });
        return json({ ...prepared, ...(metadata as Pick<PieceOperationPreparation, "manifest" | "losses" | "comparison"> | null) });
      }
      if (route[0] === "refinements" && route.length === 1 && !isRead) {
        const entityId = string(body.entityId, "entityId", 200);
        const opdId = string(body.opdId, "opdId", 200);
        const refinementType = choice(body.refinementType, ["descomposicion", "despliegue"]);
        const question = string(body.question, "question", 2_000);
        const justification = string(body.justification, "justification", 4_000);
        const mode = body.mode === undefined ? undefined : choice(body.mode, ["agregacion", "exhibicion", "generalizacion", "clasificacion"]);
        let frontier: { declarations: number; preserved: boolean } | null = null;
        const prepared = await prepareHumanChange(repository, session, {
          documentId, controllerId: string(body.controllerId, "controllerId", 200),
          clientSequence: integer(body.clientSequence, "clientSequence"),
          workingCopyHash: string(body.workingCopyHash, "workingCopyHash", 200),
        }, (model) => {
          const operation: CreateRefinementOperation = {
            kind: "createRefinement", operationId: randomUUID(), preconditions: [],
            entityId, opdId, refinementType, question, justification, expectedNextSeq: model.nextSeq,
            ...(mode ? { mode } : {}),
          };
          const proposed = applyRefinementOperation(model, operation);
          if (!proposed.ok) throw new ChangeGatewayError("invalid-change", proposed.error);
          const before = refinementFrontier(model, entityId);
          const after = new Set(refinementFrontier(proposed.value, entityId));
          frontier = { declarations: before.length, preserved: before.every((declaration) => after.has(declaration)) };
          if (!frontier.preserved) throw new ChangeGatewayError("invalid-change", "La propuesta altera declaraciones de la frontera original");
          return { operations: [operation], explanation: `${question.trim()}\n${justification.trim()}` };
        });
        return json({ ...prepared, frontier });
      }
      if (route[0] === "tasks" && route.length === 1) {
        if (isRead) return json({ tasks: (await repository.listTasks(session, documentId)).map(taskView) });
        if (!agentAvailability(config).available) throw new HttpError(503, agentAvailability(config).reason!);
        return json({ task: await runtime.start(session, startInput(body, documentId)) }, 202);
      }
      const id = string(route[1], "id", 200);
      const action = route[2];
      if (route.length > 3) throw new HttpError(404, "Ruta no disponible");
      if (route[0] === "tasks") {
        const task = await repository.getTask(session, documentId, id);
        if (!task) throw new HttpError(404, "Tarea no disponible");
        assertAgentTaskScope(task, session, documentId);
        if (isRead && !action) {
          await runtime.recoverExpired(session, documentId, id);
          const events = await repository.listEvents(session, documentId, id, 0);
          // Read the snapshot after the cursor so a concurrent event cannot be skipped.
          const latest = await repository.getTask(session, documentId, id);
          if (!latest) throw new HttpError(404, "Tarea no disponible");
          return json({ task: taskView(latest), cursor: events.at(-1)?.sequence ?? 0 });
        }
        if (isRead && action === "events") return taskEventsResponse(repository, session, documentId, id,
          parseEventCursor(url.searchParams.get("after") ?? request.headers.get("last-event-id")), request.signal);
        if (!isRead && action === "instructions") return json({ task: await runtime.instruct(session, documentId, id,
          string(body.text, "text", 8_000), integer(body.expectedVersion, "expectedVersion", 1)) });
        if (!isRead && action === "continue") return json({ task: await runtime.continue(session, documentId, id,
          body.answer === undefined ? undefined : string(body.answer, "answer", 8_000), body.acceptReservedUsage === true, body.extendBudget === true) });
        if (!isRead && action === "stop") return json({ task: await runtime.stop(session, documentId, id) });
        if (!isRead && action === "presence") return json({ task: await runtime.presence(session, documentId, id, {
          id: string(body.controllerId, "controllerId", 200),
          clientSequence: integer(body.clientSequence, "clientSequence"),
          workingCopyHash: string(body.workingCopyHash, "workingCopyHash", 200),
        }) });
        if (!isRead && action === "grants") {
          const record = await ownedChange(repository, session, documentId, string(body.changeId, "changeId", 200));
          if (record.change.taskId !== null && record.change.taskId !== id) throw new HttpError(403, "El cambio pertenece a otra tarea");
          return json({ grant: await prepareStoredGrant(gateway, session, record, body) });
        }
      }
      if (route[0] === "changes") {
        const record = await ownedChange(repository, session, documentId, id);
        if (isRead && action === "receipt") return repository.transaction(session, documentId, async (tx) => {
          const current = await tx.getChange(id);
          const document = await tx.getDocument();
          if (!document || !current) throw new HttpError(404, "Cambio no disponible");
          const modelJson = document.effectiveJson;
          const canonicalJson = exportarModelo(document.effectiveModel, carpetaIdDeJson(modelJson));
          const applied = current.status === "committed" && current.receipt && current.inverse ? {
            kind: "committed", receipt: current.receipt, inverse: current.inverse, modelJson,
            base: { revision: document.model.revision ?? 0, semanticHash: document.semanticHash,
              workingCopyHash: createHash("sha256").update(canonicalJson).digest("hex"),
              clientSequence: current.change.base.clientSequence, profileVersion: AGENT_CAPABILITY_PROFILE },
          } : null;
          return json({ receipt: current.receipt, applied });
        });
        if (isRead && !action) return repository.transaction(session, documentId, async (tx) => {
          const document = await tx.getDocument();
          if (!document) throw new HttpError(404, "Documento no disponible");
          const source = record.undoOf ? await tx.getChange(record.undoOf) : null;
          const validation = source?.inverse
            ? validateInverse(document.effectiveModel, source.inverse)
            : applyChangeSet(document.effectiveModel, record.change);
          const diff = validation.kind === "validated" || validation.kind === "applicable"
            ? projectChangeDiff(document.effectiveModel, validation.candidate, validation.diff) : null;
          return json({ change: record.change, status: record.status, diff,
            validation: { kind: validation.kind, ...(diff === null ? { message: "La propuesta necesita revisión sobre la base vigente" } : {}) } });
        });
        if (!isRead && action === "prepare") {
          const prepared = await variants.prepareIncorporation(session, documentId, id);
          return prepared.kind === "prepared" ? json(prepared) : json({ ...prepared, error: "El cambio ya fue aplicado; recupera su recibo" }, 409);
        }
        if (!isRead && action === "undo") return json(await prepareUndo(repository, session, documentId, record, body));
        if (!isRead && action === "reapply") {
          const original = await ownedChange(repository, session, documentId, id);
          if (!original.reversedBy) throw new HttpError(409, "El cambio no tiene una reversión confirmada");
          const reversed = await ownedChange(repository, session, documentId, original.reversedBy);
          return json(await prepareUndo(repository, session, documentId, reversed, body, `Reaplicar el cambio ${id}`));
        }
        if (!isRead && action === "grants") return json({ grant: await prepareStoredGrant(gateway, session, record, body) });
        if (!isRead && action === "commit") {
          const result = await gateway.commit(session, record.change, grantInput(body.grant));
          return json(result, result.kind === "committed" ? 200 : result.kind === "authority-denied" ? 403 : 409);
        }
      }
      throw new HttpError(404, "Ruta no disponible");
    } catch (error) {
      if (error instanceof HttpError) return json({ error: error.message }, error.status);
      if (error instanceof ChangeGatewayError) return json({ kind: error.code, error: error.message, references: error.references },
        error.code === "authority-denied" ? 403 : 409);
      if (error instanceof PersistenciaConflictError) return json({ error: error.message }, 409);
      // No database errors, provider bodies, or request contents cross this boundary.
      return json({ error: "No se pudo completar la operación; recupera el estado de la tarea" }, 500);
    }
  };
}

/** No CORS surface. Proxy headers are supplied by the deployment's trusted nginx. */
export function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  if (!origin) return true;
  try {
    const url = new URL(request.url);
    const protocol = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
    if (protocol !== "http" && protocol !== "https") return false;
    const host = request.headers.get("host") ?? url.host;
    return new URL(origin).origin === `${protocol}://${host}`;
  } catch { return false; }
}

async function ownedChange(repository: AgentRepository, session: PersistenciaSesion, documentId: string, id: string) {
  return repository.transaction(session, documentId, async (tx) => {
    if (!await tx.getDocument()) throw new HttpError(404, "Documento no disponible");
    const record = await tx.getChange(id);
    if (!record || record.change.actorId !== session.userId || record.change.target.documentId !== documentId) {
      throw new HttpError(404, "Cambio no disponible");
    }
    if (record.change.taskId) {
      const task = await tx.getTask(record.change.taskId);
      if (!task) throw new HttpError(404, "Tarea no disponible");
      assertAgentTaskScope(task, session, documentId);
    }
    return record;
  });
}

async function prepareStoredGrant(gateway: ChangeGateway, session: PersistenciaSesion, record: AgentChangeRecord, body: Record<string, unknown>) {
  return gateway.prepareCommit(session, record.change, {
    kind: choice(body.kind, ["review", "delegated"]),
    controllerId: string(body.controllerId, "controllerId", 200),
    clientSequence: integer(body.clientSequence, "clientSequence"),
    workingCopyHash: string(body.workingCopyHash, "workingCopyHash", 200),
    ...(record.undoOf ? { undoOf: record.undoOf } : {}),
  });
}

async function prepareUndo(repository: AgentRepository, session: PersistenciaSesion, documentId: string, source: AgentChangeRecord, body: Record<string, unknown>, explanation = `Deshacer el cambio ${source.change.id}`): Promise<PreparedChange> {
  string(body.controllerId, "controllerId", 200);
  const clientSequence = integer(body.clientSequence, "clientSequence");
  const workingCopyHash = string(body.workingCopyHash, "workingCopyHash", 200);
  return repository.transaction(session, documentId, async (tx) => {
    const document = await tx.getDocument();
    if (!document || !document.writable) throw new HttpError(403, "Documento no editable");
    const current = await tx.getChange(source.change.id);
    if (!current?.inverse || current.status !== "committed") throw new HttpError(409, "No hay un cambio aplicado para deshacer");
    if (current.reversedBy) throw new HttpError(409, "La reversión ya fue aplicada; recupera su recibo");
    const validation = validateInverse(document.effectiveModel, current.inverse);
    if (validation.kind !== "applicable") throw new HttpError(409, validation.reason);
    const effectiveHash = createHash("sha256").update(exportarModelo(document.effectiveModel, carpetaIdDeJson(document.effectiveJson))).digest("hex");
    if (workingCopyHash !== effectiveHash) throw new HttpError(409, "Sincroniza la copia local antes de preparar la reversión");
    const change: ChangeSet = {
      id: randomUUID(), taskId: null, actorId: session.userId, intentVersion: null,
      target: { kind: "current", documentId },
      base: {
        revision: document.model.revision ?? 0, semanticHash: document.semanticHash,
        workingCopyHash, clientSequence,
        profileVersion: AGENT_CAPABILITY_PROFILE,
      },
      operations: [], readIds: validation.readIds, writeIds: validation.writeIds, dependencies: [],
      explanation,
    };
    await tx.putChange({ change, requestHash: hashCommitRequest({ change, undoOf: source.change.id }),
      undoOf: source.change.id, status: "prepared", createdAt: new Date().toISOString(), receipt: null, inverse: null, grant: null });
    return { changeId: change.id, change, diff: projectChangeDiff(document.effectiveModel, validation.candidate, validation.diff) };
  });
}

function startInput(body: Record<string, unknown>, documentId: string): StartTaskRequest {
  return {
    documentId, outcome: string(body.outcome, "outcome", 8_000),
    scopeIds: strings(body.scopeIds, "scopeIds", 1_000), allowedSourceIds: strings(body.allowedSourceIds ?? [], "allowedSourceIds", 100),
    exclusions: strings(body.exclusions ?? [], "exclusions", 100), sufficiency: strings(body.sufficiency ?? [], "sufficiency", 100),
    authority: choice(body.authority, ["read", "propose", "edit"]),
    controllerId: string(body.controllerId, "controllerId", 200), clientSequence: integer(body.clientSequence, "clientSequence"),
    workingCopyHash: string(body.workingCopyHash, "workingCopyHash", 200),
  };
}
async function readBody(request: Request, maxBytes = 128 * 1024): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.includes("application/json")) throw new HttpError(415, "Se requiere JSON");
  let value: unknown;
  try { value = await leerJsonRequest(request, maxBytes); }
  catch { throw new HttpError(400, "JSON inválido o demasiado grande"); }
  if (!esRecord(value)) throw new HttpError(400, "Cuerpo inválido");
  return value;
}
function pieceInput(body: Record<string, unknown>): PieceOperationInput {
  const kind = choice(body.kind, ["copy", "reference", "update"]);
  const sourceJson = string(body.sourceJson, "sourceJson", 1024 * 1024);
  if (new TextEncoder().encode(sourceJson).byteLength > 1024 * 1024) throw new HttpError(413, "El archivo de origen supera 1 MiB");
  const source = hidratarModelo(sourceJson);
  if (!source.ok) throw new HttpError(400, "El archivo de origen no contiene un modelo compatible");
  const common = { source: source.value, sourceVersion: createHash("sha256").update(sourceJson).digest("hex"),
    pieceId: string(body.pieceId, "pieceId", 200), function: string(body.function, "function", 4_000) };
  if (!esRecord(body.target)) throw new HttpError(400, "Falta el destino de la pieza");
  const target = body.target;
  if (kind === "copy") {
    if (!esRecord(target.position) || typeof target.position.x !== "number" || !Number.isFinite(target.position.x) ||
      typeof target.position.y !== "number" || !Number.isFinite(target.position.y)) throw new HttpError(400, "Posición de copia inválida");
    return { kind, ...common, target: { opdId: string(target.opdId, "opdId", 200), position: { x: target.position.x, y: target.position.y } } };
  }
  if (kind === "reference") return { kind, ...common, target: {
    opdId: string(target.opdId, "opdId", 200), anchorEntityId: string(target.anchorEntityId, "anchorEntityId", 200),
  } };
  if (body.includeBoundaryChange !== undefined && typeof body.includeBoundaryChange !== "boolean") throw new HttpError(400, "Revisión de frontera inválida");
  return { kind, ...common, includeBoundaryChange: body.includeBoundaryChange === true,
    target: { referenceId: string(target.referenceId, "referenceId", 200), expectedSourceVersion: string(target.expectedSourceVersion, "expectedSourceVersion", 200) } };
}
function grantInput(value: unknown): CommitGrant {
  if (!esRecord(value) || !esRecord(value.base) || !esRecord(value.target)) throw new HttpError(400, "Permiso inválido");
  for (const key of ["id", "token", "kind", "changeId", "actorId", "controllerId", "expiresAt"]) string(value[key], key, 500);
  if (!Number.isFinite(Date.parse(String(value.expiresAt)))) throw new HttpError(400, "Permiso inválido");
  return value as unknown as CommitGrant; // The gateway verifies every stored claim and the opaque token.
}
function string(value: unknown, field: string, max: number): string {
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new HttpError(400, `Campo inválido: ${field}`);
  return value;
}
function strings(value: unknown, field: string, max: number): string[] {
  if (!Array.isArray(value) || value.length > max) throw new HttpError(400, `Campo inválido: ${field}`);
  return value.map((item) => string(item, field, 8_000));
}
function integer(value: unknown, field: string, min = 0): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < min) throw new HttpError(400, `Campo inválido: ${field}`);
  return value;
}
function choice<T extends string>(value: unknown, choices: readonly T[]): T {
  if (typeof value !== "string" || !choices.includes(value as T)) throw new HttpError(400, "Opción inválida");
  return value as T;
}
function json(value: unknown, status = 200): Response {
  const response = responderJson(status, value);
  response.headers.set("cache-control", "no-store");
  return response;
}
class HttpError extends Error { constructor(readonly status: number, message: string) { super(message); } }
