import { createHash, randomUUID } from "node:crypto";
import { AGENT_CAPABILITY_PROFILE } from "../../agent/capabilityProfile";
import { projectChangeDiff } from "../../agent/changeProjection";
import type { ChangeSet } from "../../agent/contracts";
import { applyChangeSet } from "../../modelo/changes/apply";
import type { SemanticOperation } from "../../modelo/changes/types";
import type { Modelo } from "../../modelo/tipos";
import { carpetaIdDeJson, exportarModelo } from "../../serializacion/json";
import type { PersistenciaSesion } from "../modelPersistence";
import { ChangeGatewayError } from "./changeGateway";
import { hashCommitRequest } from "./commitGrant";
import type { AgentRepository } from "./repository";

export interface HumanChangeBinding {
  documentId: string;
  controllerId: string;
  clientSequence: number;
  workingCopyHash: string;
}

/**
 * Human authoring supplies a purpose-specific constructor, never arbitrary
 * client patches. Preparation has no model effect; commit uses the same grant,
 * current-base checks, receipt, and inverse as every agent proposal.
 */
export async function prepareHumanChange(
  repository: AgentRepository,
  session: PersistenciaSesion,
  binding: HumanChangeBinding,
  build: (model: Modelo) => { operations: SemanticOperation[]; explanation: string },
) {
  if (!session.auth || session.authKind === "agent") {
    throw new ChangeGatewayError("authority-denied", "Se requiere una sesión del operador");
  }
  if (!binding.documentId || !binding.controllerId || !Number.isSafeInteger(binding.clientSequence) || binding.clientSequence < 0) {
    throw new ChangeGatewayError("invalid-change", "La propuesta necesita identidad y copia local vigentes");
  }
  return repository.transaction(session, binding.documentId, async (tx) => {
    const document = await tx.getDocument();
    if (!document || !document.writable) throw new ChangeGatewayError("authority-denied", "Documento no editable");
    const workingCopyHash = createHash("sha256")
      .update(exportarModelo(document.effectiveModel, carpetaIdDeJson(document.effectiveJson)))
      .digest("hex");
    if (binding.workingCopyHash !== workingCopyHash) {
      throw new ChangeGatewayError("stale-base", "Sincroniza la copia local antes de preparar la propuesta");
    }
    const authored = build(document.effectiveModel);
    const change: ChangeSet = {
      id: randomUUID(), taskId: null, actorId: session.userId, intentVersion: null,
      target: { kind: "current", documentId: binding.documentId },
      base: {
        revision: document.model.revision ?? 0, semanticHash: document.semanticHash,
        workingCopyHash, clientSequence: binding.clientSequence, profileVersion: AGENT_CAPABILITY_PROFILE,
      },
      ...authored, dependencies: [], readIds: [], writeIds: [],
    };
    const validated = applyChangeSet(document.effectiveModel, change);
    if (validated.kind !== "validated") {
      throw new ChangeGatewayError("invalid-change", validated.message, validated.references);
    }
    change.readIds = validated.readIds;
    change.writeIds = validated.writeIds;
    await tx.putChange({
      change, requestHash: hashCommitRequest({ change, undoOf: null }), status: "prepared",
      createdAt: new Date().toISOString(), receipt: null, inverse: null, grant: null,
    });
    return {
      changeId: change.id, change,
      diff: projectChangeDiff(document.effectiveModel, validated.candidate, validated.diff),
    };
  });
}
