import type { Id, Modelo, PieceLineageRecord, PieceReferenceMetadata, Resultado } from "../modelo/tipos";
import { esRecord, fallo, ok } from "./validarHelpers";

const BEHAVIOR_DIMENSIONS = ["time", "errors", "retry", "internalBehavior"] as const;

/** Validates durable lineage for copied Pieces without modifying the OPM graph. */
export function validarPieceLineage(
  value: unknown,
  modelId: Id,
  entities: Modelo["entidades"],
): Resultado<Record<Id, PieceLineageRecord>> {
  if (value === undefined) return ok({});
  if (!esRecord(value)) return fallo("Modelo inválido: pieceLineage");
  const records: Record<Id, PieceLineageRecord> = {};
  for (const [entityId, raw] of Object.entries(value)) {
    if (!entities[entityId] || entities[entityId]?.esAtributo || !esRecord(raw)) {
      return fallo(`Modelo inválido: pieceLineage.${entityId}`);
    }
    if (typeof raw.manifestId !== "string" || !raw.manifestId.trim() || typeof raw.function !== "string" || !raw.function.trim()) {
      return fallo(`Modelo inválido: pieceLineage.${entityId}.manifestId/function`);
    }
    const lineage = validarLineage(raw.lineage, `pieceLineage.${entityId}.lineage`);
    if (!lineage.ok) return lineage;
    const last = lineage.value.at(-1);
    if (!last || last.relation === "source" || last.identity.modelId !== modelId || last.identity.pieceId !== entityId) {
      return fallo(`Modelo inválido: pieceLineage.${entityId} no termina en la copia local`);
    }
    records[entityId] = { manifestId: raw.manifestId.trim(), function: raw.function.trim(), lineage: lineage.value };
  }
  return ok(records);
}

/** Shared strict validator for a read-only Piece submodel's immutable source declaration. */
export function validarPieceReferenceMetadata(value: unknown, path: string): Resultado<PieceReferenceMetadata | undefined> {
  if (value === undefined) return ok(undefined);
  if (!esRecord(value) || typeof value.manifestId !== "string" || !value.manifestId.trim() ||
      typeof value.function !== "string" || !value.function.trim() || !esRecord(value.identity) ||
      typeof value.identity.modelId !== "string" || !value.identity.modelId.trim() ||
      typeof value.identity.pieceId !== "string" || !value.identity.pieceId.trim() ||
      !esRecord(value.version) || typeof value.version.id !== "string" || !value.version.id.trim() ||
      typeof value.version.contentHash !== "string" || !value.version.contentHash.trim() ||
      !esRecord(value.profile) || typeof value.profile.id !== "string" || !value.profile.id.trim() ||
      typeof value.profile.version !== "string" || !value.profile.version.trim() ||
      !esRecord(value.boundary) || value.boundary.scope !== "direct-incidence" ||
      typeof value.boundary.signature !== "string" || !Array.isArray(value.boundary.roles) ||
      !Array.isArray(value.lineage) || !esRecord(value.behavior) || !Array.isArray(value.losses) ||
      !value.losses.every((loss) => typeof loss === "string" && loss.trim())) {
    return fallo(`Submodelo inválido: ${path}`);
  }
  const lineage = validarLineage(value.lineage, `${path}.lineage`);
  if (!lineage.ok || lineage.value.length === 0) return fallo(`Submodelo inválido: ${path}.lineage`);
  const roles: PieceReferenceMetadata["boundary"]["roles"] = [];
  for (const role of value.boundary.roles) {
    if (!esRecord(role) || typeof role.entityId !== "string" || !role.entityId.trim() ||
        typeof role.linkType !== "string" || !role.linkType.trim() ||
        (role.role !== "source" && role.role !== "destination")) {
      return fallo(`Submodelo inválido: ${path}.boundary.roles`);
    }
    roles.push({ entityId: role.entityId.trim(), linkType: role.linkType.trim(), role: role.role });
  }
  const behavior: PieceReferenceMetadata["behavior"] = {};
  for (const [dimension, observation] of Object.entries(value.behavior)) {
    if (!(BEHAVIOR_DIMENSIONS as readonly string[]).includes(dimension) || !esRecord(observation) ||
        typeof observation.value !== "string" || !observation.value.trim() ||
        typeof observation.evidence !== "string" || !observation.evidence.trim()) {
      return fallo(`Submodelo inválido: ${path}.behavior`);
    }
    behavior[dimension as typeof BEHAVIOR_DIMENSIONS[number]] = {
      value: observation.value.trim(),
      evidence: observation.evidence.trim(),
    };
  }
  return ok({
    manifestId: value.manifestId.trim(),
    identity: { modelId: value.identity.modelId.trim(), pieceId: value.identity.pieceId.trim() },
    function: value.function.trim(),
    boundary: { scope: "direct-incidence", roles, signature: value.boundary.signature },
    version: { id: value.version.id.trim(), contentHash: value.version.contentHash.trim() },
    profile: { id: value.profile.id.trim(), version: value.profile.version.trim() },
    lineage: lineage.value,
    behavior,
    losses: value.losses.map((loss) => (loss as string).trim()),
  });
}

function validarLineage(value: unknown, path: string): Resultado<PieceLineageRecord["lineage"]> {
  if (!Array.isArray(value)) return fallo(`Modelo inválido: ${path}`);
  const entries: PieceLineageRecord["lineage"] = [];
  for (const entry of value) {
    if (!esRecord(entry) || !esRecord(entry.identity) ||
        typeof entry.identity.modelId !== "string" || !entry.identity.modelId.trim() ||
        typeof entry.identity.pieceId !== "string" || !entry.identity.pieceId.trim() ||
        !esRecord(entry.version) || typeof entry.version.id !== "string" || !entry.version.id.trim() ||
        typeof entry.version.contentHash !== "string" || !entry.version.contentHash.trim() ||
        (entry.relation !== "source" && entry.relation !== "copy" && entry.relation !== "update")) {
      return fallo(`Modelo inválido: ${path}`);
    }
    entries.push({
      identity: { modelId: entry.identity.modelId.trim(), pieceId: entry.identity.pieceId.trim() },
      version: { id: entry.version.id.trim(), contentHash: entry.version.contentHash.trim() },
      relation: entry.relation,
    });
  }
  return ok(entries);
}
