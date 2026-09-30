import { abanicoDeEnlace, formarAbanico } from "../abanicos";
import { idModeloExiste } from "../operaciones/helpers";
import type { Id, Modelo, Resultado } from "../tipos";
import type { OperationBase } from "./types";

/** Creates an exactly-one group from already authored procedural links. */
export interface CreateXorExclusionOperation extends OperationBase {
  kind: "createXorExclusion";
  id: Id;
  opdId: Id;
  linkIds: Id[];
}

export function applyXorExclusionOperation(
  model: Modelo,
  operation: CreateXorExclusionOperation,
): Resultado<Modelo> {
  if (!operation || operation.kind !== "createXorExclusion" || typeof operation.id !== "string" || !operation.id.trim()) {
    return { ok: false, error: "La exclusión XOR requiere una identidad estable no vacía" };
  }
  if (typeof operation.opdId !== "string" || !operation.opdId.trim()) {
    return { ok: false, error: "La exclusión XOR requiere un OPD explícito" };
  }
  if (!Array.isArray(operation.linkIds) || operation.linkIds.length < 2
    || operation.linkIds.some((id) => typeof id !== "string" || !id.trim())) {
    return { ok: false, error: "La exclusión XOR requiere al menos dos enlaces válidos" };
  }
  if (new Set(operation.linkIds).size !== operation.linkIds.length) {
    return { ok: false, error: "La exclusión XOR no admite enlaces repetidos" };
  }
  if (idModeloExiste(model, operation.id)) return { ok: false, error: `ID ya existe: ${operation.id}` };
  const grouped = operation.linkIds.map((linkId) => abanicoDeEnlace(model, linkId)).find(Boolean);
  if (grouped) return { ok: false, error: `El enlace ya pertenece al abanico ${grouped.id}; la operación no modifica grupos existentes` };

  // formarAbanico is the semantic owner of exact port, direction, link type,
  // visibility and endpoint validation. Supplying a stable ID makes it a
  // create-only action and prevents its legacy implicit branch-merge behavior.
  return formarAbanico(model, operation.opdId, operation.linkIds, "XOR", operation.id);
}

/**
 * Dependencies of the decision to create the group. Include all current fans
 * in the OPD: an existing fan on the same exact port would otherwise change
 * the result of the legacy group constructor without changing a selected link.
 */
export function xorExclusionReadIds(model: Modelo, operation: CreateXorExclusionOperation): Id[] {
  const ids = new Set<Id>([operation.id, operation.opdId, ...operation.linkIds]);
  for (const fan of Object.values(model.abanicos ?? {})) {
    if (fan.opdId === operation.opdId) ids.add(fan.id);
  }
  for (const linkId of operation.linkIds) {
    const link = model.enlaces[linkId];
    if (!link) continue;
    for (const endpoint of [link.origenId, link.destinoId]) {
      ids.add(endpoint.id);
      if (endpoint.kind === "estado") {
        const state = model.estados[endpoint.id];
        if (state) ids.add(state.entidadId);
      }
    }
  }
  return [...ids].sort();
}
