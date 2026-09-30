import { createHash, randomUUID } from "node:crypto";
import { AGENT_CAPABILITY_PROFILE } from "../../agent/capabilityProfile";
import type { Base, ChangeSet, CommitReceipt, Target } from "../../agent/contracts";
import { buildInverse, applyChangeSet, diffModel, validateInverse } from "../../modelo/changes/apply";
import type { SemanticInverse, ValidatedEffects } from "../../modelo/changes/types";
import { firmaSnapshotSubmodelo } from "../../modelo/submodelos/estado";
import type { Modelo } from "../../modelo/tipos";
import { carpetaIdDeJson, exportarModelo, hidratarModelo } from "../../serializacion/json";
import { modelTaskSources, sourceVersion } from "./sourceAccess";
import { canonicalTutorSourceVersion, validateDependencies } from "./tools";
import { PersistenciaConflictError, type PersistenciaSesion } from "../modelPersistence";
import {
  assertAgentTaskScope,
  type AgentChangeRecord,
  type AgentDocumentSnapshot,
  type AgentRepository,
  type AgentTaskRecord,
  type AgentTransaction,
  type AgentVariantRecord,
} from "./repository";
import {
  consumirCommitGrant,
  emitirCommitGrant,
  guardarClaimsCommitGrant,
  hashCommitRequest,
  verificarCommitGrant,
  type CommitGrant,
  type CommitGrantBinding,
  type CommitGrantKind,
} from "./commitGrant";

export interface ChangeGatewayOptions {
  repository: AgentRepository;
  now?: () => number;
}

export interface PrepareCommitRequest {
  kind: CommitGrantKind;
  controllerId: string;
  clientSequence: number;
  workingCopyHash: string;
  /** Undo identity is resolved to the durable inverse inside the repository. */
  undoOf?: string;
}

export type CommitFailureCode =
  | "stale-base"
  | "authority-denied"
  | "invalid-change"
  | "dependency-changed"
  | "cancelled";

export type CommitResult =
  | {
      kind: "committed";
      receipt: CommitReceipt;
      inverse: SemanticInverse;
      modelJson: string;
      base: Base;
      recovered: boolean;
    }
  | { kind: CommitFailureCode; message: string; references: string[] };

export class ChangeGatewayError extends Error {
  constructor(readonly code: CommitFailureCode, message: string, readonly references: string[] = []) {
    super(message);
    this.name = "ChangeGatewayError";
  }
}

export class ChangeGateway {
  private readonly now: () => number;

  constructor(private readonly options: ChangeGatewayOptions) {
    this.now = options.now ?? Date.now;
  }

  async prepareCommit(
    session: PersistenciaSesion,
    change: ChangeSet,
    request: PrepareCommitRequest,
  ): Promise<CommitGrant> {
    requireOperator(session);
    validateControllerRequest(change, request);
    const requestHash = hashCommitRequest({ change, undoOf: request.undoOf ?? null });
    return this.options.repository.transaction(session, change.target.documentId, async (tx) => {
      const document = await tx.getDocument();
      if (!document) fail("stale-base", "Documento no disponible");
      const task = change.taskId ? await tx.getTask(change.taskId) : null;
      if (change.taskId && !task) fail("authority-denied", "Tarea no disponible");
      if (task) assertAgentTaskScope(task, session, change.target.documentId);
      if (task) await variantForIncorporation(tx, task, change);
      const actorId = session.userId;
      if (change.actorId !== actorId) fail("authority-denied", "El actor del cambio no coincide con la sesión autenticada");
      const trustedChange = { ...change, actorId };
      assertDocumentBase(document, trustedChange.base, request);
      if (task) assertTaskController(task, request, this.now());
      if (!document.writable) fail("authority-denied", "El documento está en solo lectura");
      assertTaskAuthority(task, trustedChange, request.kind, request.undoOf ?? null, this.now());

      const prior = await tx.getChange(change.id);
      if (prior && prior.requestHash !== requestHash) {
        fail("invalid-change", "La identidad del cambio ya se usó con otro contenido");
      }
      if (prior?.status === "committed") fail("invalid-change", "El cambio ya fue aplicado; consulta su recibo");

      const prepared = prepareCandidate(document, trustedChange, task, request.undoOf ?? null, async (sourceId) => {
        const source = await tx.getChange(sourceId);
        return source;
      });
      const preparedValue = await prepared;
      const binding: CommitGrantBinding = {
        kind: request.kind,
        changeId: change.id,
        taskId: trustedChange.taskId,
        actorId,
        target: trustedChange.target,
        base: trustedChange.base,
        controllerId: request.controllerId,
        intentVersion: trustedChange.intentVersion,
        authorizationVersion: task?.intent.authorizationVersion ?? null,
        leaseFence: task?.lease.fence ?? 0,
      };
      const grant = emitirCommitGrant(binding, 15_000, new Date(this.now()));
      const record: AgentChangeRecord = {
        change: preparedValue.change,
        requestHash,
        ...(request.undoOf ? { undoOf: request.undoOf } : {}),
        status: "prepared",
        createdAt: prior?.createdAt ?? this.stamp(),
        receipt: null,
        inverse: preparedValue.inverse,
        grant: guardarClaimsCommitGrant(grant),
      };
      await tx.putChange(record);
      if (task) {
        task.pendingCommit = { changeId: change.id };
        task.updatedAt = this.stamp();
        await tx.putTask(task);
        await tx.appendEvent({ id: randomUUID(), taskId: task.id, kind: "decision", revision: null, resultId: null });
      }
      return grant;
    });
  }

  async commit(session: PersistenciaSesion, change: ChangeSet, grant: CommitGrant | null): Promise<CommitResult> {
    try {
      requireOperator(session);
      if (!grant) fail("authority-denied", "Falta el permiso técnico de commit");
      return await this.options.repository.transaction(session, change.target.documentId, async (tx) => {
        const document = await tx.getDocument();
        if (!document) fail("stale-base", "Documento no disponible");
        const prior = await tx.getChange(change.id);
        const requestHash = hashCommitRequest({ change, undoOf: prior?.undoOf ?? null });
        if (prior && prior.requestHash !== requestHash) fail("invalid-change", "La identidad del cambio ya se usó con otro contenido");
        if (prior?.status === "committed" && prior.receipt && prior.inverse) {
          const currentBase = baseAfter(document, change.base.clientSequence);
          return {
            kind: "committed",
            receipt: prior.receipt,
            inverse: prior.inverse,
            modelJson: document.effectiveJson,
            base: currentBase,
            recovered: true,
          };
        }
        if (!prior || prior.status !== "prepared") fail("invalid-change", "El cambio necesita permiso vigente");
        if (!prior.grant || !verificarCommitGrant(grant, prior.grant, grantBinding(prior.change, prior.grant), new Date(this.now()))) {
          fail("authority-denied", "El permiso de commit no coincide, venció o ya fue consumido");
        }
        const task = prior.change.taskId ? await tx.getTask(prior.change.taskId) : null;
        if (prior.change.taskId && !task) fail("authority-denied", "Tarea no disponible");
        if (task) assertAgentTaskScope(task, session, change.target.documentId);
        const variant = task ? await variantForIncorporation(tx, task, prior.change) : null;
        assertDocumentBase(document, prior.change.base, {
          controllerId: grant.controllerId,
          clientSequence: grant.base.clientSequence,
          workingCopyHash: grant.base.workingCopyHash,
        });
        if (!document.writable) fail("authority-denied", "El documento está en solo lectura");
        assertTaskAuthority(task, prior.change, grant.kind, prior.undoOf ?? null, this.now());
        assertGrantStillCurrent(grant, task, this.now());

        const prepared = prepareCandidate(document, prior.change, task, prior.undoOf ?? null, async (sourceId) => {
          const source = await tx.getChange(sourceId);
          return source;
        });
        const preparedValue = await prepared;
        const modelJson = exportarModelo(preparedValue.candidate, carpetaIdDeJson(document.effectiveJson));
        const hydratedCandidate = hidratarModelo(modelJson);
        if (!hydratedCandidate.ok) fail("invalid-change", "El modelo serializado no pudo validarse");
        const canonicalCandidate = hydratedCandidate.value;
        // The canonical serializer may normalize derived fields. Build the
        // durable inverse from the exact bytes that will be stored, or a later
        // undo could conflict immediately against its own commit.
        const canonicalDiff = diffModel(document.effectiveModel, canonicalCandidate);
        const inverse = buildInverse(document.effectiveModel, {
          changeId: prior.change.id,
          changes: canonicalDiff.changes,
          readIds: preparedValue.change.readIds,
          writeIds: preparedValue.change.writeIds,
        });
        const model = {
          ...document.model,
          nombre: canonicalCandidate.nombre,
          actualizadoEn: this.stamp(),
          json: modelJson,
          autosalvado: false,
        };
        const saved = await tx.putModel(model, document.model.revision ?? 0);
        const receipt: CommitReceipt = {
          changeId: prior.change.id,
          target: prior.change.target,
          previousRevision: document.model.revision ?? 0,
          revision: saved.revision ?? (document.model.revision ?? 0) + 1,
          appliedOperationIds: prior.undoOf ? [] : preparedValue.change.operations.map((operation) => operation.operationId),
          inverseId: inverse.id,
        };
        const consumedGrant = consumirCommitGrant(prior.grant, new Date(this.now()));
        await tx.putChange({ ...prior, change: preparedValue.change, status: "committed", receipt, inverse, grant: consumedGrant });
        if (prior.undoOf) {
          const original = await tx.getChange(prior.undoOf);
          if (!original) fail("invalid-change", "El cambio original ya no está disponible");
          await tx.putChange({ ...original, reversedBy: prior.change.id });
        }
        if (variant) await tx.putVariant({ ...variant, state: "incorporated", updatedAt: this.stamp() });
        if (task) {
          task.pendingCommit = null;
          task.updatedAt = this.stamp();
          const resultId = randomUUID();
          task.results.push({ id: resultId, kind: "answer", createdAt: this.stamp(),
            payload: { kind: "committed-change", receipt: { ...receipt, target: { ...receipt.target } } } });
          await tx.putTask(task);
          await tx.appendEvent({ id: randomUUID(), taskId: task.id, kind: "committed", revision: receipt.revision, resultId });
        }
        const base = baseAfter({ ...document, model: saved, effectiveJson: modelJson, effectiveModel: canonicalCandidate }, prior.change.base.clientSequence);
        return { kind: "committed", receipt, inverse, modelJson, base, recovered: false };
      });
    } catch (error) {
      if (error instanceof ChangeGatewayError) return { kind: error.code, message: error.message, references: error.references };
      if (error instanceof PersistenciaConflictError) return { kind: "stale-base", message: error.message, references: [] };
      throw error;
    }
  }

  async getReceipt(session: PersistenciaSesion, target: Target, changeId: string): Promise<CommitReceipt | null> {
    requireOperator(session);
    return this.options.repository.getReceipt(session, target, changeId);
  }

  private stamp(): string { return new Date(this.now()).toISOString(); }
}

async function variantForIncorporation(
  tx: AgentTransaction,
  task: AgentTaskRecord,
  change: ChangeSet,
): Promise<AgentVariantRecord | null> {
  if (task.intent.target.kind !== "variant") return null;
  const variantId = task.intent.target.variantId;
  const result = task.results.find((item) => {
    const payload = asObject(item.payload);
    return payload?.kind === "variant-incorporation" && payload.preparedChangeId === change.id;
  });
  const payload = result ? asObject(result.payload) : null;
  const sourceChangeId = payload?.sourceChangeId;
  if (typeof sourceChangeId !== "string") fail("authority-denied", "La incorporación no conserva su candidato de origen");
  const source = await tx.getChange(sourceChangeId);
  if (!source || source.change.taskId !== task.id || source.status !== "prepared" ||
    source.change.target.kind !== "variant" || source.change.target.variantId !== variantId) {
    fail("authority-denied", "El candidato de origen no coincide con la variante autorizada");
  }
  const variant = await tx.getVariant(variantId);
  if (!variant || variant.taskId !== task.id || variant.state !== "open" ||
    hashCommitRequest({ operations: variant.operations }) !== hashCommitRequest({ operations: change.operations })) {
    fail("authority-denied", "La variante cambió o ya fue incorporada");
  }
  return variant;
}

function asObject(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

async function prepareCandidate(
  document: AgentDocumentSnapshot,
  change: ChangeSet,
  task: AgentTaskRecord | null,
  undoOf: string | null,
  getSource: (id: string) => Promise<AgentChangeRecord | null>,
): Promise<{ change: ChangeSet; candidate: Modelo; inverse: SemanticInverse }> {
  if (undoOf) {
    if (change.taskId !== null || change.intentVersion !== null || change.operations.length !== 0) {
      fail("invalid-change", "La reversión debe ser un acto humano independiente");
    }
    const source = await getSource(undoOf);
    if (source?.reversedBy) fail("invalid-change", "La reversión ya fue aplicada; recupera su recibo");
    if (!source?.receipt || source.status !== "committed" || !source.inverse || source.receipt.target.documentId !== change.target.documentId) {
      fail("invalid-change", "No hay un recibo reversible para ese cambio");
    }
    const undone = validateInverse(document.effectiveModel, source.inverse);
    if (undone.kind !== "applicable") fail("dependency-changed", undone.reason, undone.references);
    const effects: ValidatedEffects = {
      changeId: change.id,
      changes: undone.diff.changes,
      readIds: undone.readIds,
      writeIds: undone.writeIds,
    };
    const inverse = buildInverse(document.effectiveModel, effects);
    return { change: { ...change, readIds: effects.readIds, writeIds: effects.writeIds }, candidate: undone.candidate, inverse };
  }
  if (change.operations.length === 0) fail("invalid-change", "El lote requiere al menos una operación");
  assertSourceDependencies(document, task, change);
  const scope = task ? deriveTrustedScope(document.effectiveModel, task.intent.scopeIds, change.operations) : undefined;
  const validation = applyChangeSet(document.effectiveModel, {
    id: change.id,
    operations: change.operations,
  }, scope ? { scopeIds: scope } : {});
  if (validation.kind === "rejected") {
    fail(validation.code === "out-of-scope" || validation.code === "external-owned" ? "authority-denied" : "invalid-change", validation.message, validation.references);
  }
  return {
    change: { ...change, readIds: validation.readIds, writeIds: validation.writeIds },
    candidate: validation.candidate,
    inverse: validation.inverse,
  };
}

function assertDocumentBase(document: AgentDocumentSnapshot, base: Base, request: Pick<PrepareCommitRequest, "controllerId" | "clientSequence" | "workingCopyHash">): void {
  const expectedRevision = document.model.revision ?? 0;
  if (base.revision !== expectedRevision || base.semanticHash !== document.semanticHash ||
    base.clientSequence !== request.clientSequence || base.workingCopyHash !== request.workingCopyHash ||
    base.workingCopyHash !== effectiveWorkingCopyHash(document) ||
    base.profileVersion !== AGENT_CAPABILITY_PROFILE || !request.controllerId.trim()) {
    fail("stale-base", "La base, el controlador o el perfil cambió; sincroniza el documento antes de continuar");
  }
}

function assertTaskAuthority(
  task: AgentTaskRecord | null,
  change: ChangeSet,
  kind: CommitGrantKind,
  undoOf: string | null,
  now: number,
): void {
  if (undoOf) return;
  if (!task) {
    if (change.taskId !== null || change.intentVersion !== null || kind !== "review") {
      fail("authority-denied", "Un cambio sin tarea requiere una confirmación humana explícita");
    }
    return;
  }
  if (change.intentVersion !== task.intent.version) fail("authority-denied", "La intención cambió; vuelve a revisar el candidato");
  if (task.status === "cancelled" || task.status === "failed") fail("cancelled", "La tarea fue detenida o terminó con un fallo");
  if (task.intent.target.documentId !== change.target.documentId) fail("authority-denied", "El cambio sale del documento autorizado");
  if (!task.controller || Date.parse(task.controller.expiresAt) <= now) fail("authority-denied", "El navegador controlador venció");
  if (kind === "delegated") {
    const waitingForCommit = task.status === "awaiting-decision" && !task.pendingDecision &&
      (task.reason === "commit-required" || task.reason === "review-required");
    if (task.intent.authority !== "edit" || task.intent.target.kind !== "current" ||
      (task.status !== "working" && !waitingForCommit) ||
      !task.pendingCommit || task.pendingCommit.changeId !== change.id ||
      !task.lease.owner || !task.lease.expiresAt || Date.parse(task.lease.expiresAt) <= now) {
      fail("authority-denied", "La tarea no tiene un permiso delegado vigente para este lote");
    }
  } else if (task.intent.authority === "read") {
    fail("authority-denied", "Una tarea de consulta no puede incorporar un cambio");
  }
}

function assertTaskController(task: AgentTaskRecord, request: PrepareCommitRequest, now: number): void {
  if (!task.controller || task.controller.id !== request.controllerId ||
    task.controller.clientSequence !== request.clientSequence ||
    task.controller.workingCopyHash !== request.workingCopyHash ||
    Date.parse(task.controller.expiresAt) <= now) {
    fail("stale-base", "El navegador no mantiene la base reservada para este cambio");
  }
}

function assertGrantStillCurrent(grant: CommitGrant, task: AgentTaskRecord | null, now: number): void {
  if (Date.parse(grant.expiresAt) <= now) fail("authority-denied", "El permiso de commit venció");
  if (!task) return;
  if (!task.controller || task.controller.id !== grant.controllerId ||
    task.controller.clientSequence !== grant.base.clientSequence ||
    task.controller.workingCopyHash !== grant.base.workingCopyHash ||
    task.intent.version !== grant.intentVersion ||
    task.intent.authorizationVersion !== grant.authorizationVersion ||
    task.lease.fence !== grant.leaseFence) {
    fail("authority-denied", "El controlador, mandato o fencing cambió después de reservar el commit");
  }
}

function assertSourceDependencies(document: AgentDocumentSnapshot, task: AgentTaskRecord | null, change: ChangeSet): void {
  if (!task) {
    if (change.dependencies.length > 0) fail("dependency-changed", "El cambio cita dependencias que no pertenecen a una tarea verificada");
    return;
  }
  const currentSources = new Map(modelTaskSources(document.effectiveModel).map((source) => [source.id, source.version]));
  for (const source of task.sources ?? []) {
    if (currentSources.get(source.id) !== source.version || sourceVersion(source.content) !== source.version) {
      fail("dependency-changed", "Una fuente consultada cambió; vuelve a leerla", [source.id]);
    }
  }
  const recorded = new Map((task.dependencies ?? []).map((dependency) => [`${dependency.kind}:${dependency.id}`, dependency.version]));
  for (const dependency of change.dependencies) {
    if (recorded.get(`${dependency.kind}:${dependency.id}`) !== dependency.version) {
      fail("dependency-changed", "El cambio cita una dependencia no verificada por la tarea", [dependency.id]);
    }
  }
  for (const dependency of task.dependencies ?? []) {
    const currentVersion = currentSources.get(dependency.id) ?? canonicalTutorSourceVersion(dependency.id);
    if (dependency.kind === "source" && currentVersion !== dependency.version) {
      fail("dependency-changed", "Una fuente consultada cambió; vuelve a leerla", [dependency.id]);
    }
  }
  const stale = validateDependencies(document.effectiveModel, change.dependencies, task,
    task.intent.target.kind === "variant" ? change.operations : undefined);
  if (stale) fail("dependency-changed", stale);
}

function deriveTrustedScope(model: Modelo, declaredScope: readonly string[], operations: ChangeSet["operations"]): Set<string> {
  const scope = new Set(declaredScope);
  // An explicitly selected OPD grants its canonical visible contents. Never
  // infer an existing endpoint or another OPD from an operation's payload.
  for (const id of declaredScope) {
    const opd = model.opds[id];
    if (opd) for (const appearance of Object.values(opd.apariencias)) scope.add(appearance.entidadId);
  }
  for (const state of Object.values(model.estados)) {
    if (scope.has(state.entidadId)) scope.add(state.id);
  }
  for (const id of declaredScope) {
    const opd = model.opds[id];
    if (!opd) continue;
    for (const appearance of Object.values(opd.enlaces)) {
      const link = model.enlaces[appearance.enlaceId];
      if (link && scope.has(link.origenId.id) && scope.has(link.destinoId.id)) scope.add(link.id);
    }
  }
  const original = new Set(declaredScope);
  const createdLinks = new Map<string, { opdId: string; sourceId: string; destinationId: string }>();
  for (const operation of operations) {
    if ((operation.kind === "createObject" || operation.kind === "createProcess") && original.has(operation.opdId)) {
      scope.add(operation.id);
    } else if (operation.kind === "createState" && scope.has(operation.entityId)) {
      scope.add(operation.id);
    } else if (operation.kind === "createProceduralLink" && original.has(operation.opdId) &&
      scope.has(operation.source.id) && scope.has(operation.destination.id)) {
      scope.add(operation.id);
      createdLinks.set(operation.id, { opdId: operation.opdId, sourceId: operation.source.id, destinationId: operation.destination.id });
    } else if (operation.kind === "createXorExclusion" && original.has(operation.opdId) &&
      operation.linkIds.every((id) => {
        if (!scope.has(id)) return false;
        const created = createdLinks.get(id);
        if (created) return created.opdId === operation.opdId && scope.has(created.sourceId) && scope.has(created.destinationId);
        const link = model.enlaces[id];
        return Boolean(link && opdsWithLink(model, id).includes(operation.opdId) &&
          scope.has(link.origenId.id) && scope.has(link.destinoId.id));
      })) {
      scope.add(operation.id);
    }
  }
  // Deletions may touch their owner and visible links; include only cascade
  // records whose endpoints and every OPD projection were already in scope.
  for (const operation of operations) {
    if (operation.kind === "deleteState") {
      const state = model.estados[operation.stateId];
      if (state && original.has(state.entidadId)) scope.add(operation.stateId);
    } else if (operation.kind === "deleteLink") {
      const link = model.enlaces[operation.linkId];
      if (!link || !scope.has(link.origenId.id) || !scope.has(link.destinoId.id)) continue;
      const opds = opdsWithLink(model, operation.linkId);
      if (opds.every((id) => original.has(id))) scope.add(operation.linkId);
    } else if (operation.kind === "deleteEntity") {
      const entity = model.entidades[operation.entityId];
      if (!entity || !original.has(entity.id)) continue;
      const entityStateIds = Object.values(model.estados).filter((state) => state.entidadId === entity.id).map((state) => state.id);
      const childIds = new Set([entity.id, ...entityStateIds]);
      const incidentLinks = Object.values(model.enlaces).filter((link) =>
        childIds.has(link.origenId.id) || childIds.has(link.destinoId.id),
      );
      const cascadeAllowed = incidentLinks.every((link) => {
        const other = childIds.has(link.origenId.id) ? link.destinoId.id : link.origenId.id;
        return scope.has(other) && opdsWithLink(model, link.id).every((id) => original.has(id));
      });
      if (cascadeAllowed) {
        for (const childId of childIds) scope.add(childId);
        for (const link of incidentLinks) scope.add(link.id);
      }
    }
  }
  return scope;
}

function opdsWithLink(model: Modelo, linkId: string): string[] {
  return Object.values(model.opds)
    .filter((opd) => Object.values(opd.enlaces).some((appearance) => appearance.enlaceId === linkId))
    .map((opd) => opd.id);
}

function grantBinding(change: ChangeSet, grant: CommitGrant | import("./commitGrant").CommitGrantRecord): CommitGrantBinding {
  return {
    kind: grant.kind,
    changeId: change.id,
    taskId: change.taskId,
    actorId: change.actorId,
    target: change.target,
    base: change.base,
    controllerId: grant.controllerId,
    intentVersion: change.intentVersion,
    authorizationVersion: grant.authorizationVersion,
    leaseFence: grant.leaseFence,
  };
}

function baseAfter(document: AgentDocumentSnapshot, clientSequence: number): Base {
  return {
    revision: document.model.revision ?? 0,
    semanticHash: firmaSnapshotSubmodelo(document.effectiveModel),
    workingCopyHash: effectiveWorkingCopyHash(document),
    clientSequence,
    profileVersion: AGENT_CAPABILITY_PROFILE,
  };
}

function effectiveWorkingCopyHash(document: AgentDocumentSnapshot): string {
  const canonicalJson = exportarModelo(document.effectiveModel, carpetaIdDeJson(document.effectiveJson));
  return createHash("sha256").update(canonicalJson, "utf8").digest("hex");
}

function validateControllerRequest(change: ChangeSet, request: PrepareCommitRequest): void {
  if (!request.controllerId.trim() || !Number.isSafeInteger(request.clientSequence) || request.clientSequence < 0 ||
    !request.workingCopyHash.trim()) {
    fail("authority-denied", "Controlador o huella de trabajo inválidos");
  }
  if (!change.target.documentId.trim() || change.target.kind !== "current") {
    fail("invalid-change", "La incorporación debe dirigirse al documento vigente");
  }
  if (request.undoOf && (change.taskId !== null || request.kind !== "review")) {
    fail("authority-denied", "La reversión requiere una confirmación humana sin tarea");
  }
}

function requireOperator(session: PersistenciaSesion): void {
  if (session.auth !== true || session.authKind === "agent") fail("authority-denied", "Se requiere una sesión de operador autenticada");
}

function fail(code: CommitFailureCode, message: string, references: string[] = []): never {
  throw new ChangeGatewayError(code, message, references);
}
