import { PersistenciaConflictError, type PersistenciaSesion } from "../modelPersistence";
import { selectedBaseJson, sourceFromState } from "../../mesa/baseWitness";
import { hidratarModelo } from "../../serializacion/json";
import { firmaSnapshotSubmodelo } from "../../modelo/submodelos/estado";
import type { ModeloPersistido } from "../../persistencia/modelos";
import type { CommitReceipt, Target, TaskEvent } from "../../agent/contracts";
import {
  type AgentChangeRecord,
  type AgentDocumentSnapshot,
  type AgentRepository,
  type AgentTaskRecord,
  type AgentTransaction,
  type AgentVariantRecord,
} from "./repository";
import type { CommitGrantRecord } from "./commitGrant";

export interface AgentMemoryModelAccess {
  withDocumentLock<T>(session: PersistenciaSesion, documentId: string, work: () => Promise<T>): Promise<T>;
  getModel(session: PersistenciaSesion, documentId: string): ModeloPersistido | null;
  getAutosave(session: PersistenciaSesion, documentId: string): { creadoEn: string; json: string } | null;
  isWritable(session: PersistenciaSesion, documentId: string): boolean;
  /** Called only while withDocumentLock is held; writes the canonical model map. */
  putModelLocked(
    session: PersistenciaSesion,
    model: ModeloPersistido,
    expectedRevision: number,
  ): ModeloPersistido;
}

/** Shares the exact model/autosave maps and lock used by crearRepoMemoria. */
export function crearRepoAgenteMemoria(access: AgentMemoryModelAccess): AgentRepository {
  const tasks = new Map<string, AgentTaskRecord>();
  const changes = new Map<string, AgentChangeRecord>();
  const variants = new Map<string, AgentVariantRecord>();
  const events = new Map<string, TaskEvent[]>();

  return {
    async transaction(session, documentId, work) {
      return access.withDocumentLock(session, documentId, async () => {
        let pendingModel: ModeloPersistido | null = null;
        const pendingTasks = new Map<string, AgentTaskRecord>();
        const pendingChanges = new Map<string, AgentChangeRecord>();
        const pendingVariants = new Map<string, AgentVariantRecord>();
        const pendingEvents: TaskEvent[] = [];
        const taskKey = (id: string) => key(session, documentId, id);

        const tx: AgentTransaction = {
          async getDocument() {
            const model = pendingModel ?? access.getModel(session, documentId);
            if (!model) return null;
            const autosave = pendingModel ? null : access.getAutosave(session, documentId);
            const state = {
              modelId: model.id,
              saved: { revision: model.revision ?? 0, updatedAt: model.actualizadoEn, json: model.json },
              autosave: autosave ? { createdAt: autosave.creadoEn, json: autosave.json } : null,
            };
            const effectiveJson = selectedBaseJson(state);
            const hydrated = hidratarModelo(effectiveJson);
            if (!hydrated.ok) throw new PersistenciaConflictError("No se pudo leer el modelo vigente");
            return {
              model: clone(model),
              effectiveJson,
              effectiveModel: hydrated.value,
              semanticHash: firmaSnapshotSubmodelo(hydrated.value),
              source: sourceFromState(state),
              autosaveCreatedAt: autosave?.creadoEn ?? null,
              writable: access.isWritable(session, documentId),
            } satisfies AgentDocumentSnapshot;
          },
          async putModel(model, expectedRevision) {
            const current = pendingModel ?? access.getModel(session, documentId);
            if (!current || current.id !== model.id) throw new PersistenciaConflictError("El documento ya no existe");
            if ((current.revision ?? 0) !== expectedRevision) throw new PersistenciaConflictError();
            pendingModel = { ...clone(model), revision: expectedRevision + 1, autosalvado: false };
            return clone(pendingModel);
          },
          async getTask(taskId) {
            const result = pendingTasks.get(taskKey(taskId)) ?? tasks.get(taskKey(taskId));
            return result ? clone(result) : null;
          },
          async putTask(task) {
            pendingTasks.set(taskKey(task.id), clone(task));
          },
          async getChange(changeId) {
            const result = pendingChanges.get(taskKey(changeId)) ?? changes.get(taskKey(changeId));
            return result ? clone(result) : null;
          },
          async putChange(change) {
            pendingChanges.set(taskKey(change.change.id), clone(change));
          },
          async getVariant(variantId) {
            const result = pendingVariants.get(taskKey(variantId)) ?? variants.get(taskKey(variantId));
            return result ? clone(result) : null;
          },
          async putVariant(variant) {
            pendingVariants.set(taskKey(variant.id), clone(variant));
          },
          async getGrant(changeId) {
            return (await tx.getChange(changeId))?.grant ?? null;
          },
          async putGrant(changeId, grant) {
            const change = await tx.getChange(changeId);
            if (!change) throw new PersistenciaConflictError("Cambio preparado no disponible");
            await tx.putChange({ ...change, grant });
          },
          async appendEvent(event) {
            const eventKey = taskKey(event.taskId);
            const previous = [...(events.get(eventKey) ?? []), ...pendingEvents.filter((item) => item.taskId === event.taskId)];
            const stored = { ...event, sequence: previous.reduce((max, item) => Math.max(max, item.sequence), 0) + 1 };
            pendingEvents.push(stored);
            return clone(stored);
          },
        };

        const result = await work(tx);
        if (pendingModel) {
          access.putModelLocked(session, pendingModel, (access.getModel(session, documentId)?.revision ?? 0));
        }
        for (const [id, task] of pendingTasks) tasks.set(id, task);
        for (const [id, change] of pendingChanges) changes.set(id, change);
        for (const [id, variant] of pendingVariants) variants.set(id, variant);
        for (const event of pendingEvents) {
          const eventKey = taskKey(event.taskId);
          const list = events.get(eventKey) ?? [];
          list.push(event);
          events.set(eventKey, list);
        }
        return result;
      });
    },
    async getTask(session, documentId, taskId) {
      const task = tasks.get(key(session, documentId, taskId));
      return task?.actorId === session.userId ? clone(task) : null;
    },
    async listTasks(session, documentId) {
      return [...tasks.values()]
        .filter((task) => task.tenantId === session.tenantId && task.documentId === documentId && task.actorId === session.userId)
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
        .map(clone);
    },
    async listEvents(session, documentId, taskId, after) {
      const task = tasks.get(key(session, documentId, taskId));
      if (!task || task.actorId !== session.userId) return [];
      return (events.get(key(session, documentId, taskId)) ?? []).filter((event) => event.sequence > after).map(clone);
    },
    async getReceipt(session, target, changeId) {
      const record = changes.get(key(session, target.documentId, changeId));
      if (!record?.receipt || !sameTarget(record.receipt.target, target)) return null;
      return clone(record.receipt);
    },
    async deleteDocument(session, documentId) {
      const prefix = `${session.tenantId}:${documentId}:`;
      deleteKeys(tasks, prefix);
      deleteKeys(changes, prefix);
      deleteKeys(variants, prefix);
      deleteKeys(events, prefix);
    },
  };
}

function key(session: PersistenciaSesion, documentId: string, id: string): string {
  return `${session.tenantId}:${documentId}:${id}`;
}

function deleteKeys<T>(map: Map<string, T>, prefix: string): void {
  for (const itemKey of map.keys()) if (itemKey.startsWith(prefix)) map.delete(itemKey);
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function sameTarget(left: Target, right: Target): boolean {
  return left.kind === right.kind && left.documentId === right.documentId &&
    (left.kind !== "variant" || right.kind === "variant" && left.variantId === right.variantId);
}
