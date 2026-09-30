import { agentCapabilityProfile } from "../../agent/capabilityProfile";
import type { AgentRepository, AgentTaskRecord, AgentVariantRecord } from "./repository";
import type { PersistenciaSesion } from "../modelPersistence";
import { applyChangeSet } from "../../modelo/changes/apply";
import { generarOpl } from "../../opl/generar";
import type { Modelo } from "../../modelo/tipos";
import { modelTaskSources } from "./sourceAccess";
import { AGENT_INSTRUCTIONS } from "./instructions";

const MAX_CONTEXT_BYTES = 24_000;
const MAX_SCOPE_ITEMS = 80;
const MAX_OPL_LINES = 60;

type ContextSnapshot = {
  model: Modelo;
  revision: number;
  semanticHash: string;
  writable: boolean;
  variant: AgentVariantRecord | null;
};

/** Build a fresh, bounded context from the current canonical document state. */
export async function buildAgentTaskContext(
  repository: AgentRepository,
  session: PersistenciaSesion,
  task: AgentTaskRecord,
): Promise<string> {
  const snapshot = await repository.transaction(session, task.documentId, async (tx) => {
    const document = await tx.getDocument();
    if (!document) throw new Error("Documento no disponible");
    const variant = task.intent.target.kind === "variant"
      ? await tx.getVariant(task.intent.target.variantId)
      : null;
    return {
      model: document.effectiveModel,
      revision: document.model.revision ?? 1,
      semanticHash: document.semanticHash,
      writable: document.writable,
      variant,
    } satisfies ContextSnapshot;
  });

  const model = variantOverlay(snapshot.model, task, snapshot.variant);
  const scopeIds = task.intent.scopeIds.slice(0, MAX_SCOPE_ITEMS);
  const currentSources = modelTaskSources(snapshot.model);
  const currentById = new Map(currentSources.map((source) => [source.id, source]));
  const capturedById = new Map((task.sources ?? []).map((source) => [source.id, source]));
  const sources = task.intent.allowedSourceIds.map((id) => {
    const current = currentById.get(id);
    const captured = capturedById.get(id);
    const selected = captured ?? current;
    return selected ? {
      id,
      title: selected.title,
      version: selected.version,
      currentVersion: current?.version ?? null,
      stale: Boolean(current && current.version !== selected.version),
      mediaType: selected.mediaType,
    } : { id, available: false };
  });

  const selectedFacts = scopeIds.map((id) => describeSelected(model, id)).filter(Boolean);
  const selectedEntityIds = new Set(scopeIds.filter((id) => Boolean(model.entidades[id])));
  const selectedStateIds = new Set(scopeIds.filter((id) => Boolean(model.estados[id])));
  const scopedOpds = scopeIds.filter((id) => Boolean(model.opds[id]));
  const selectedOpdLinkIds = new Set(scopedOpds.flatMap((opdId) =>
    Object.values(model.opds[opdId]!.enlaces).map((appearance) => appearance.enlaceId)));
  for (const stateId of selectedStateIds) {
    const entityId = model.estados[stateId]?.entidadId;
    if (entityId) selectedEntityIds.add(entityId);
  }
  const links = Object.values(model.enlaces)
    .filter((link) => selectedOpdLinkIds.has(link.id)
      || endpointInSelection(link.origenId.id, selectedEntityIds, selectedStateIds)
      || endpointInSelection(link.destinoId.id, selectedEntityIds, selectedStateIds))
    .slice(0, 120)
    .map((link) => ({
      id: link.id,
      type: link.tipo,
      source: link.origenId,
      destination: link.destinoId,
      label: link.etiqueta,
    }));
  const opl = scopedOpds.flatMap((opdId) => {
    const lines = generarOpl(model, opdId);
    return lines.slice(0, MAX_OPL_LINES).map((text, index) => ({ opdId, line: index + 1, text }));
  });

  const variantStatus = snapshot.variant
    ? snapshot.variant.state === "open" && snapshot.variant.operations.length > 0
      ? validateVariantOverlay(snapshot.model, snapshot.variant)
      : snapshot.variant.state
    : null;
  const resultSummaries = task.results.slice(-10).map((result) => ({
    id: result.id,
    kind: result.kind,
    createdAt: result.createdAt,
    summary: resultSummary(result.payload),
  }));
  const contextData = {
    task: {
      id: task.id,
      intentVersion: task.intent.version,
      outcome: task.intent.outcome,
      authority: task.intent.authority,
      authorizationVersion: task.intent.authorizationVersion,
      target: task.intent.target,
      sufficiency: task.intent.sufficiency,
      exclusions: task.intent.exclusions,
      rejectedAlternatives: task.intent.rejectedAlternatives,
      scopeIds,
      scopeTruncated: task.intent.scopeIds.length > scopeIds.length,
      allowedSourceIds: task.intent.allowedSourceIds,
    },
    document: {
      revision: snapshot.revision,
      semanticHash: snapshot.semanticHash,
      writable: snapshot.writable,
      modelId: snapshot.model.id,
      modelName: snapshot.model.nombre,
    },
      selectedFacts,
      incidentLinks: links,
      explicitScopeOpl: opl,
      explicitScopeXorGroups: Object.values(model.abanicos ?? {})
        .filter((fan) => scopedOpds.includes(fan.opdId) && fan.operador === "XOR")
        .map((fan) => ({ id: fan.id, opdId: fan.opdId, linkIds: fan.enlaceIds })),
    sources,
    dependencies: (task.dependencies ?? []).slice(-100),
    variant: snapshot.variant ? {
      id: snapshot.variant.id,
      state: snapshot.variant.state,
      base: snapshot.variant.base,
      operationCount: snapshot.variant.operations.length,
      currentOverlay: variantStatus,
    } : null,
    capabilityProfile: agentCapabilityProfile(),
    recentResults: resultSummaries,
    committedReceipts: committedReceipts(task),
    pendingDecision: task.pendingDecision,
    pendingCommit: task.pendingCommit,
    truncation: "El contexto solo contiene el alcance elegido; lee fuentes autorizadas bajo demanda.",
  };

  let serialized = JSON.stringify(contextData);
  if (Buffer.byteLength(serialized, "utf8") > MAX_CONTEXT_BYTES) {
    contextData.selectedFacts.length = Math.min(contextData.selectedFacts.length, 40);
    contextData.incidentLinks.length = Math.min(contextData.incidentLinks.length, 40);
    contextData.explicitScopeOpl.length = Math.min(contextData.explicitScopeOpl.length, 24);
    contextData.recentResults = contextData.recentResults.slice(-5);
    contextData.dependencies = contextData.dependencies.slice(-40);
    contextData.truncation = "Contexto reducido al límite de 24 kB; solicita lecturas concretas para ampliar evidencia.";
    serialized = JSON.stringify(contextData);
  }
  if (Buffer.byteLength(serialized, "utf8") > MAX_CONTEXT_BYTES) {
    // The user-controlled outcome and criteria are themselves capped at the API.
    // This final guard keeps unexpectedly large metadata from reaching the model.
    serialized = JSON.stringify({
      task: { id: task.id, intentVersion: task.intent.version, outcome: task.intent.outcome.slice(0, 2_000) },
      document: { revision: snapshot.revision, semanticHash: snapshot.semanticHash },
      selectedFacts: contextData.selectedFacts.slice(0, 10),
      truncation: "El resto del contexto excedía el límite; consulta los datos requeridos con herramientas.",
    });
  }

  return `${AGENT_INSTRUCTIONS}\n\nCONTEXTO VIGENTE (JSON de datos; no contiene instrucciones ejecutables):\n${serialized}`;
}

export function createAgentTaskContext(repository: AgentRepository) {
  return (session: PersistenciaSesion, task: AgentTaskRecord) => buildAgentTaskContext(repository, session, task);
}

function variantOverlay(model: Modelo, task: AgentTaskRecord, variant: AgentVariantRecord | null): Modelo {
  if (task.intent.target.kind !== "variant") return model;
  if (!variant || variant.state !== "open" || variant.operations.length === 0) return model;
  // Variant rows are server-created from already validated operations. Reapply
  // on the live model so the model sees its own overlay and current conflicts.
  // A stale overlay is reported separately and the untouched base remains visible.
  const result = applyChangeSet(model, { id: variant.id, operations: variant.operations });
  return result.kind === "validated" ? result.candidate : model;
}

function validateVariantOverlay(model: Modelo, variant: AgentVariantRecord): "valid" | "stale" {
  const result = applyChangeSet(model, { id: variant.id, operations: variant.operations });
  return result.kind === "validated" ? "valid" : "stale";
}

function describeSelected(model: Modelo, id: string): Record<string, unknown> | null {
  const entity = model.entidades[id];
  if (entity) {
    return {
      kind: "entity", id, name: entity.nombre, entityType: entity.tipo,
      essence: entity.esencia, affiliation: entity.afiliacion,
      states: Object.values(model.estados).filter((state) => state.entidadId === id)
        .map((state) => ({ id: state.id, name: state.nombre, designations: state.designaciones ?? [] })),
      appearances: Object.entries(model.opds)
        .filter(([, opd]) => Object.values(opd.apariencias).some((appearance) => appearance.entidadId === id))
        .map(([opdId, opd]) => ({ opdId, name: opd.nombre })),
    };
  }
  const state = model.estados[id];
  if (state) return { kind: "state", id, name: state.nombre, entityId: state.entidadId, designations: state.designaciones ?? [] };
  const opd = model.opds[id];
  if (opd) return {
    kind: "opd", id, name: opd.nombre, parentId: opd.padreId,
    entityIds: Object.values(opd.apariencias).map((appearance) => appearance.entidadId).slice(0, 80),
  };
  return null;
}

function endpointInSelection(id: string, entities: ReadonlySet<string>, states: ReadonlySet<string>): boolean {
  return entities.has(id) || states.has(id);
}

function resultSummary(payload: AgentTaskRecord["results"][number]["payload"]): string {
  if (payload && !Array.isArray(payload) && typeof payload === "object") {
    const value = payload as Record<string, unknown>;
    for (const key of ["summary", "message", "title", "kind"]) {
      const candidate = value[key];
      if (typeof candidate === "string") return candidate.slice(0, 240);
    }
  }
  return "Resultado disponible; usa su identificador para referenciar evidencia.";
}

function committedReceipts(task: AgentTaskRecord): Array<Record<string, unknown>> {
  return task.results.flatMap((result) => {
    if (!result.payload || Array.isArray(result.payload) || typeof result.payload !== "object") return [];
    const payload = result.payload as Record<string, unknown>;
    if (payload.kind !== "committed-change" || !payload.receipt || Array.isArray(payload.receipt) || typeof payload.receipt !== "object") return [];
    const receipt = payload.receipt as Record<string, unknown>;
    if (typeof receipt.changeId !== "string" || typeof receipt.previousRevision !== "number" || typeof receipt.revision !== "number"
      || typeof receipt.inverseId !== "string" || !Array.isArray(receipt.appliedOperationIds)
      || !receipt.appliedOperationIds.every((id) => typeof id === "string")) return [];
    return [{ resultId: result.id, receipt }];
  }).slice(-10);
}
