import { createHash, randomUUID } from "node:crypto";
import { AGENT_CAPABILITY_PROFILE } from "../../agent/capabilityProfile";
import type { Base, ChangeSet, CommitReceipt } from "../../agent/contracts";
import { projectChangeDiff, type ProjectedChangeDiff } from "../../agent/changeProjection";
import { applyChangeSet } from "../../modelo/changes/apply";
import type { SemanticInverse } from "../../modelo/changes/types";
import type { PersistenciaSesion } from "../modelPersistence";
import type { JsonValue } from "./provider";
import { hashCommitRequest } from "./commitGrant";
import {
  expandedWriteScope,
  validateStoredChange,
  validateDependencies,
  type StoredValidation,
} from "./tools";
import type { AgentChangeRecord, AgentRepository, AgentTaskRecord, AgentVariantRecord } from "./repository";

export type PrepareIncorporationResult =
  | { kind: "prepared"; changeId: string; change: ChangeSet; diff: ProjectedChangeDiff }
  | { kind: "already-committed"; changeId: string; receipt: CommitReceipt };

export interface VariantServiceOptions {
  repository: AgentRepository;
  now?: () => number;
}

/** Variants are persisted overlays; preparation only produces a current-target candidate. */
export class VariantService {
  private readonly now: () => number;

  constructor(private readonly options: VariantServiceOptions) {
    this.now = options.now ?? Date.now;
  }

  async prepareIncorporation(
    session: PersistenciaSesion,
    documentId: string,
    changeId: string,
  ): Promise<PrepareIncorporationResult> {
    if (session.authKind === "agent") throw new Error("El cliente externo no administra variantes integradas");
    return this.options.repository.transaction(session, documentId, async (tx) => {
      const source = await tx.getChange(changeId);
      if (!source || source.change.target.documentId !== documentId || source.change.actorId !== session.userId) {
        throw new Error("Candidato no disponible");
      }
      if (source.status === "committed" && source.receipt) {
        return { kind: "already-committed", changeId: source.change.id, receipt: source.receipt };
      }
      if (source.status !== "prepared") throw new Error("El candidato ya no se puede incorporar");
      if (source.requestHash !== hashCommitRequest({ change: source.change, undoOf: null })) {
        throw new Error("La identidad del candidato no coincide con su contenido guardado");
      }
      const document = await tx.getDocument();
      if (!document) throw new Error("Documento no disponible");
      if (!document.writable) throw new Error("El documento no permite escritura");
      const task = source.change.taskId ? await tx.getTask(source.change.taskId) : null;
      if (!task || task.actorId !== session.userId || task.documentId !== documentId) throw new Error("Tarea de origen no disponible");
      const priorIncorporations = task.results.filter((result) => {
        const payload = result.payload;
        return payload && !Array.isArray(payload) && typeof payload === "object"
          && payload.kind === "variant-incorporation" && payload.sourceChangeId === source.change.id;
      });
      for (const result of priorIncorporations) {
        const payload = result.payload as Record<string, JsonValue>;
        if (typeof payload.preparedChangeId !== "string") continue;
        const previous = await tx.getChange(payload.preparedChangeId);
        if (previous?.status === "committed" && previous.receipt) {
          return { kind: "already-committed", changeId: previous.change.id, receipt: previous.receipt };
        }
      }
      const variant = source.change.target.kind === "variant"
        ? await tx.getVariant(source.change.target.variantId)
        : null;
      if (source.change.target.kind === "variant") {
        if (!variant || variant.taskId !== task.id || variant.state !== "open") throw new Error("La variante ya no está abierta");
      } else if (task.intent.authority !== "edit") {
        throw new Error("La intención vigente no autoriza editar el documento");
      }
      const staleDependency = validateDependencies(document.effectiveModel, source.change.dependencies, task, variant?.operations);
      if (staleDependency) throw new Error(`Dependencia obsoleta: ${staleDependency}`);

      const validation = validateStoredChange(document, task, source, variant);
      if (validation.kind !== "validated") throw new Error(`${validation.code}: ${validation.message}`);
      const operations = source.change.target.kind === "variant" ? variant!.operations : source.change.operations;
      const preparedId = incorporationId(source.change.id, document.semanticHash, document.model.revision ?? 1, task);
      const base: Base = {
        revision: document.model.revision ?? 1,
        semanticHash: document.semanticHash,
        workingCopyHash: task.controller?.workingCopyHash ?? document.semanticHash,
        clientSequence: task.controller?.clientSequence ?? 0,
        profileVersion: AGENT_CAPABILITY_PROFILE,
      };
      const change: ChangeSet = {
        id: preparedId,
        taskId: task.id,
        actorId: session.userId,
        intentVersion: task.intent.version,
        target: { kind: "current", documentId },
        base,
        operations,
        readIds: validation.readIds,
        writeIds: validation.writeIds,
        dependencies: source.change.dependencies,
        explanation: source.change.explanation,
      };

      const inCurrent = applyChangeSet(document.effectiveModel, { id: change.id, operations }, {
        scopeIds: expandedWriteScope(document.effectiveModel, operations, task.intent.scopeIds),
      });
      if (inCurrent.kind !== "validated") throw new Error(`No se pudo preparar sobre el vigente: ${inCurrent.message}`);
      const stored = await tx.getChange(preparedId);
      const requestHash = hashCommitRequest({ change, undoOf: null });
      if (stored && stored.requestHash !== requestHash) throw new Error("Conflicto de identidad al preparar la incorporación");
      if (stored?.status === "committed" && stored.receipt) {
        return { kind: "already-committed", changeId: stored.change.id, receipt: stored.receipt };
      }
      if (stored?.status === "rejected") throw new Error("El candidato preparado fue rechazado");
      if (!stored) {
        const changeRecord: AgentChangeRecord = {
          change,
          requestHash,
          status: "prepared",
          createdAt: this.stamp(),
          receipt: null,
          inverse: inCurrent.inverse as SemanticInverse,
          grant: null,
        };
        await tx.putChange(changeRecord);
      }
      task.pendingCommit = { changeId: preparedId };
      const outcomeResultId = stored ? null : randomUUID();
      if (outcomeResultId) task.results.push({
        id: outcomeResultId,
        kind: "proposal",
        createdAt: this.stamp(),
        payload: {
          kind: "variant-incorporation",
          sourceChangeId: source.change.id,
          preparedChangeId: preparedId,
          status: "prepared-for-review",
          currentBase: {
            revision: base.revision,
            semanticHash: base.semanticHash,
            workingCopyHash: base.workingCopyHash,
            clientSequence: base.clientSequence,
            profileVersion: base.profileVersion,
          },
        } satisfies JsonValue,
      });
      task.updatedAt = this.stamp();
      await tx.putTask(task);
      if (outcomeResultId) await tx.appendEvent({ id: randomUUID(), taskId: task.id, kind: "result", revision: null, resultId: outcomeResultId });
      return {
        kind: "prepared",
        changeId: preparedId,
        change,
        diff: projectChangeDiff(document.effectiveModel, inCurrent.candidate, inCurrent.diff),
      };
    });
  }

  async discard(session: PersistenciaSesion, documentId: string, variantId: string): Promise<AgentVariantRecord> {
    if (session.authKind === "agent") throw new Error("El cliente externo no administra variantes integradas");
    return this.options.repository.transaction(session, documentId, async (tx) => {
      const variant = await tx.getVariant(variantId);
      if (!variant || variant.tenantId !== session.tenantId || variant.documentId !== documentId) throw new Error("Variante no disponible");
      if (variant.state === "incorporated") throw new Error("Una variante incorporada conserva su recibo y no se descarta");
      if (variant.state === "discarded") return variant;
      const task = variant.taskId ? await tx.getTask(variant.taskId) : null;
      if (variant.taskId && (!task || task.actorId !== session.userId)) throw new Error("Variante no disponible");
      const discarded = { ...variant, state: "discarded" as const, updatedAt: this.stamp() };
      await tx.putVariant(discarded);
      if (task && task.pendingCommit) {
        const pending = await tx.getChange(task.pendingCommit.changeId);
        if ((pending?.change.target.kind === "variant" && pending.change.target.variantId === variant.id)
          || task.intent.target.kind === "variant" && task.intent.target.variantId === variant.id) {
          if (pending?.status === "prepared") await tx.putChange({ ...pending, status: "rejected", grant: null });
          task.pendingCommit = null;
        }
        task.updatedAt = this.stamp();
        await tx.putTask(task);
      }
      return discarded;
    });
  }

  private stamp(): string { return new Date(this.now()).toISOString(); }
}

function incorporationId(sourceId: string, semanticHash: string, revision: number, task: AgentTaskRecord): string {
  const suffix = createHash("sha256").update(JSON.stringify({
    sourceId,
    semanticHash,
    revision,
    clientSequence: task.controller?.clientSequence ?? 0,
    workingCopyHash: task.controller?.workingCopyHash ?? semanticHash,
    intentVersion: task.intent.version,
  })).digest("hex").slice(0, 32);
  return `inc:${suffix}`;
}

// Keep this compile-time assertion close to the service: prepared candidates
// are tied to the same authoring profile whose operations were validated.
const _preparedContract: StoredValidation["kind"] = "validated";
void _preparedContract;
