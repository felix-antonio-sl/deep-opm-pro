import { naturalezaDeEnlace } from "../constantes";
import { crearEnlace } from "../operaciones/enlaces";
import { eliminarEntidad, eliminarEnlace } from "../operaciones/eliminacion";
import { crearObjeto, crearProceso } from "../operaciones/creacion";
import { renombrarEntidad } from "../operaciones/entidad";
import { agregarEstado, eliminarEstado, renombrarEstado } from "../operaciones/estados";
import { idModeloExiste } from "../operaciones/helpers";
import { validarReferenciasOpd } from "../integridadReferencial";
import { applyPieceOperation } from "../reuse/piece";
import { materializacionEfectivaSubmodelo } from "../submodelos/materializacion";
import { applyRefinementOperation } from "./refinement";
import { applyXorExclusionOperation, xorExclusionReadIds } from "./xor";
import type { Id, Modelo, Resultado } from "../tipos";
import type {
  ChangeCollection,
  ChangeRejectionCode,
  ChangeValidation,
  ModelChange,
  ModelDiff,
  ModelPath,
  ModelSlot,
  OperationPrecondition,
  SemanticInverse,
  SemanticChangeBatch,
  SemanticOperation,
  ValidatedEffects,
  InverseValidation,
} from "./types";

export interface ApplyChangeOptions {
  /** Optional scope supplied by the trusted caller; operation payloads cannot widen it. */
  scopeIds?: ReadonlySet<Id>;
}

const COLLECTIONS: readonly ChangeCollection[] = ["entidades", "estados", "enlaces", "opds", "abanicos", "submodelos", "pieceLineage"];

export function applyChangeSet(model: Modelo, change: SemanticChangeBatch, options: ApplyChangeOptions = {}): ChangeValidation {
  if (!change.id.trim() || change.operations.length === 0) {
    return reject("invalid-change", "El cambio requiere identidad y al menos una operación");
  }
  if (model.procedencia) {
    return reject("external-owned", "El modelo raíz tiene procedencia externa; la escritura requiere su flujo propietario", [model.id]);
  }
  const operationIds = new Set<string>();
  let candidate = model;
  const readIds = new Set<Id>();

  for (const operation of change.operations) {
    if (!operation.operationId.trim() || operationIds.has(operation.operationId)) {
      return reject("invalid-change", "Las identidades de operación deben ser únicas y no vacías", [operation.operationId]);
    }
    operationIds.add(operation.operationId);
    if (operation.kind === "createXorExclusion" && (!Array.isArray(operation.linkIds) || operation.linkIds.length < 2)) {
      return reject("invalid-change", "La exclusión XOR requiere al menos dos enlaces válidos");
    }
    if (esCreacion(operation) && !operation.id.trim()) {
      return reject("invalid-change", "Las operaciones de creación requieren un ID estable no vacío", [operation.id]);
    }

    const guard = validarPrecondiciones(candidate, operation.preconditions);
    if (!guard.ok) return reject("precondition-failed", guard.error, guard.references);

    const references = referenciasOperacion(candidate, operation);
    for (const id of references) readIds.add(id);
    const readOnlyTargets = operation.kind === "connectPieceReference" || operation.kind === "replaceSubmodelReference"
      ? []
      : referenciasEnVistaProtegida(candidate, operation);
    if (readOnlyTargets.length > 0) {
      return reject("external-owned", "La operación intenta modificar contenido materializado de solo lectura", readOnlyTargets);
    }
    const externallyOwned = referenciasExternas(candidate, operation);
    if (externallyOwned.length > 0) {
      return reject("external-owned", "La operación toca una pieza anclada a una fuente externa", externallyOwned);
    }

    const result = aplicarOperacion(candidate, operation);
    if (!result.ok) {
      const idCollision = /ID ya existe/.test(result.error);
      return reject(idCollision ? "id-collision" : "invalid-change", result.error, references);
    }
    candidate = result.value;
  }

  const integrity = validarReferenciasOpd(candidate);
  if (!integrity.ok) return reject("invalid-model", integrity.error);

  const diff = diffModel(model, candidate);
  const protectedEntityIds = diff.changes
    .filter((item) => item.path[0] === "entidades" && item.path.length === 2 && item.before.exists && !item.after.exists)
    .map((item) => item.path[1])
    .filter((id) => model.entidades[id]?.anclaje !== undefined);
  if (protectedEntityIds.length > 0) {
    return reject("external-owned", "La operación eliminaría una pieza anclada a una fuente externa", protectedEntityIds);
  }
  const writeIds = idsEscritos(diff);
  if (options.scopeIds) {
    const fuera = writeIds.filter((id) => !options.scopeIds?.has(id));
    if (fuera.length > 0) return reject("out-of-scope", "El efecto derivado excede el alcance autorizado", fuera);
  }

  const effects: ValidatedEffects = {
    changeId: change.id,
    changes: diff.changes,
    readIds: [...readIds].sort(),
    writeIds,
  };
  const inverse = buildInverse(model, effects);
  return {
    kind: "validated",
    candidate,
    effects,
    diff,
    inverse,
    readIds: effects.readIds,
    writeIds,
  };
}

export function diffModel(before: Modelo, after: Modelo): ModelDiff {
  const changes: ModelChange[] = [];
  for (const collection of COLLECTIONS) {
    const left = (before as unknown as Record<string, Record<Id, unknown> | undefined>)[collection] ?? {};
    const right = (after as unknown as Record<string, Record<Id, unknown> | undefined>)[collection] ?? {};
    const ids = new Set([...Object.keys(left), ...Object.keys(right)]);
    for (const id of [...ids].sort()) {
      diffValue([collection, id], slot(left[id], Object.hasOwn(left, id)), slot(right[id], Object.hasOwn(right, id)), changes);
    }
  }
  return { changes };
}

export function buildInverse(before: Modelo, validatedEffects: ValidatedEffects): SemanticInverse {
  const patches = validatedEffects.changes.map((change) => {
    const actualBefore = getSlot(before, change.path);
    if (!slotEqual(actualBefore, change.before)) {
      throw new Error(`El efecto no corresponde a la base del cambio en ${change.path.join(".")}`);
    }
    return {
      path: change.path,
      expected: change.after,
      restore: change.before,
    };
  });
  return {
    id: `inverse:${validatedEffects.changeId}`,
    sourceChangeId: validatedEffects.changeId,
    patches,
  };
}

export function validateInverse(current: Modelo, inverse: SemanticInverse): InverseValidation {
  const conflicts: Id[] = [];
  for (const patch of inverse.patches) {
    if (!slotEqual(getSlot(current, patch.path), patch.expected)) conflicts.push(...referenciasRuta(current, patch.path));
  }
  if (conflicts.length > 0) {
    return { kind: "conflict", reason: "Uno o más efectos del cambio fueron modificados después", references: [...new Set(conflicts)].sort() };
  }

  let candidate = current;
  for (const patch of inverse.patches) candidate = setSlot(candidate, patch.path, patch.restore);
  const integrity = validarReferenciasOpd(candidate);
  if (!integrity.ok) {
    const removedEntities = inverse.patches
      .filter((patch) => patch.path[0] === "entidades" && patch.path.length === 2 && patch.expected.exists && !patch.restore.exists)
      .map((patch) => patch.path[1]);
    return {
      kind: "conflict",
      reason: `La reversión eliminaría o dañaría una referencia posterior: ${integrity.error}`,
      references: [...new Set([...referencesInError(integrity.error), ...removedEntities])].sort(),
    };
  }
  const diff = diffModel(current, candidate);
  const writeIds = idsEscritos(diff);
  return {
    kind: "applicable",
    candidate,
    diff,
    readIds: [...new Set(inverse.patches.map((patch) => patch.path[1]))].sort(),
    writeIds,
  };
}

function referenciasRuta(modelo: Modelo, path: ModelPath): Id[] {
  const [collection, id, ...fields] = path;
  if (collection === "opds") {
    const opd = modelo.opds[id];
    if (fields[0] === "apariencias") {
      const appearance = fields[1] ? opd?.apariencias[fields[1]] : undefined;
      return appearance ? [appearance.entidadId, appearance.id, opd?.id ?? id] : [id];
    }
    if (fields[0] === "enlaces") {
      const appearance = fields[1] ? opd?.enlaces[fields[1]] : undefined;
      const link = appearance ? modelo.enlaces[appearance.enlaceId] : undefined;
      return link ? [link.id, link.origenId.id, link.destinoId.id, id] : [appearance?.enlaceId ?? id, id];
    }
  }
  return [id];
}

function aplicarOperacion(modelo: Modelo, op: SemanticOperation): Resultado<Modelo> {
  switch (op.kind) {
    case "createObject":
      return crearObjeto(modelo, op.opdId, op.position, op.name, { id: op.id });
    case "createProcess":
      return crearProceso(modelo, op.opdId, op.position, op.name, { id: op.id });
    case "createState": {
      const creada = agregarEstado(modelo, op.entityId, op.name, { id: op.id });
      return creada.ok ? { ok: true, value: creada.value.modelo } : creada;
    }
    case "renameEntity": {
      const actual = modelo.entidades[op.entityId];
      if (!actual || actual.nombre !== op.beforeName) return { ok: false, error: `La entidad ${op.entityId} cambió desde la lectura` };
      return renombrarEntidad(modelo, op.entityId, op.afterName);
    }
    case "renameState": {
      const actual = modelo.estados[op.stateId];
      if (!actual || actual.nombre !== op.beforeName) return { ok: false, error: `El estado ${op.stateId} cambió desde la lectura` };
      return renombrarEstado(modelo, op.stateId, op.afterName);
    }
    case "createProceduralLink": {
      if (naturalezaDeEnlace(op.linkType) !== "procedural") return { ok: false, error: "createProceduralLink sólo acepta enlaces procedurales" };
      return crearEnlace(modelo, op.opdId, op.source, op.destination, op.linkType, op.label ?? "", undefined, { id: op.id });
    }
    case "createXorExclusion":
      return applyXorExclusionOperation(modelo, op);
    case "deleteLink":
      return eliminarEnlace(modelo, op.linkId);
    case "deleteState":
      return eliminarEstado(modelo, op.stateId);
    case "deleteEntity":
      return eliminarEntidad(modelo, op.entityId);
    case "createRefinement":
      return applyRefinementOperation(modelo, op);
    case "copyPiece":
    case "connectPieceReference":
    case "replaceSubmodelReference":
      return applyPieceOperation(modelo, op);
    default:
      return assertNever(op);
  }
}

function validarPrecondiciones(modelo: Modelo, preconditions: OperationPrecondition[]): { ok: true } | { ok: false; error: string; references: Id[] } {
  for (const condition of preconditions) {
    if (condition.kind === "idAbsent") {
      if (idExiste(modelo, condition.id)) return { ok: false, error: `ID ya existe: ${condition.id}`, references: [condition.id] };
      continue;
    }
    if (condition.kind === "opdExists") {
      if (!modelo.opds[condition.id]) return { ok: false, error: `OPD no existe: ${condition.id}`, references: [condition.id] };
      continue;
    }
    if (condition.kind === "entity") {
      const entity = modelo.entidades[condition.id];
      if (!entity || (condition.expectedName !== undefined && entity.nombre !== condition.expectedName) || (condition.expectedType !== undefined && entity.tipo !== condition.expectedType)) {
        return { ok: false, error: `Precondición de entidad incumplida: ${condition.id}`, references: [condition.id] };
      }
      continue;
    }
    if (condition.kind === "state") {
      const state = modelo.estados[condition.id];
      if (!state || (condition.expectedName !== undefined && state.nombre !== condition.expectedName) || (condition.expectedEntityId !== undefined && state.entidadId !== condition.expectedEntityId)) {
        return { ok: false, error: `Precondición de estado incumplida: ${condition.id}`, references: [condition.id] };
      }
      continue;
    }
    const link = modelo.enlaces[condition.id];
    if (!link || (condition.expectedFingerprint !== undefined && fingerprintValue(link) !== condition.expectedFingerprint)) {
      return { ok: false, error: `Precondición de enlace incumplida: ${condition.id}`, references: [condition.id] };
    }
  }
  return { ok: true };
}

function referenciasOperacion(modelo: Modelo, op: SemanticOperation): Id[] {
  switch (op.kind) {
    case "createObject":
    case "createProcess":
      return [op.opdId];
    case "createState":
    case "renameEntity":
      return [op.entityId];
    case "renameState": {
      const state = modelo.estados[op.stateId];
      return state ? [op.stateId, state.entidadId] : [op.stateId];
    }
    case "createProceduralLink":
      return [op.opdId, ...referenciasExtremo(modelo, op.source), ...referenciasExtremo(modelo, op.destination)];
    case "createXorExclusion":
      return xorExclusionReadIds(modelo, op);
    case "deleteLink": {
      const link = modelo.enlaces[op.linkId];
      return link ? [op.linkId, ...referenciasExtremo(modelo, link.origenId), ...referenciasExtremo(modelo, link.destinoId)] : [op.linkId];
    }
    case "deleteState": {
      const state = modelo.estados[op.stateId];
      return state ? [op.stateId, state.entidadId] : [op.stateId];
    }
    case "deleteEntity":
      return [op.entityId];
    case "createRefinement":
      return [op.entityId, op.opdId];
    case "copyPiece":
      return [op.targetOpdId];
    case "connectPieceReference":
      return [op.targetOpdId, op.anchorEntityId];
    case "replaceSubmodelReference": {
      const ref = modelo.submodelos?.[op.referenceId];
      return ref ? [op.referenceId, ref.anchor?.entidadId ?? ref.anchorEntidadId] : [op.referenceId];
    }
    default:
      return assertNever(op);
  }
}

function referenciasExtremo(modelo: Modelo, extremo: { kind: "entidad" | "estado"; id: Id }): Id[] {
  if (extremo.kind === "entidad") return [extremo.id];
  const estado = modelo.estados[extremo.id];
  return estado ? [extremo.id, estado.entidadId] : [extremo.id];
}

function esCreacion(operation: SemanticOperation): operation is Extract<SemanticOperation, { kind: "createObject" | "createProcess" | "createState" | "createProceduralLink" | "createXorExclusion" }> {
  return operation.kind === "createObject" || operation.kind === "createProcess" || operation.kind === "createState"
    || operation.kind === "createProceduralLink" || operation.kind === "createXorExclusion";
}

function referenciasExternas(modelo: Modelo, op: SemanticOperation): Id[] {
  const ids = referenciasOperacion(modelo, op);
  return [...new Set(ids)].filter((id) => modelo.entidades[id]?.anclaje !== undefined);
}

/** Read-only submodel projections are protected in the kernel, even if a caller skips the UI. */
function referenciasEnVistaProtegida(modelo: Modelo, op: SemanticOperation): Id[] {
  const protectedEntities = new Set<Id>();
  const protectedStates = new Set<Id>();
  const protectedLinks = new Set<Id>();
  for (const ref of Object.values(modelo.submodelos ?? {})) {
    const materialization = materializacionEfectivaSubmodelo(modelo, ref);
    for (const id of Object.values(materialization?.entidadMap ?? {})) protectedEntities.add(id);
    for (const id of Object.values(materialization?.estadoMap ?? {})) protectedStates.add(id);
    for (const id of Object.values(materialization?.enlaceMap ?? {})) protectedLinks.add(id);
  }
  for (const opd of Object.values(modelo.opds)) {
    if (!opd.vista?.readOnly) continue;
    for (const appearance of Object.values(opd.apariencias)) protectedEntities.add(appearance.entidadId);
    for (const appearance of Object.values(opd.enlaces)) protectedLinks.add(appearance.enlaceId);
  }
  const isProtectedEndpoint = (endpoint: { kind: "entidad" | "estado"; id: Id }) =>
    endpoint.kind === "entidad" ? protectedEntities.has(endpoint.id) : protectedStates.has(endpoint.id);
  const stateOwnerProtected = (stateId: Id) => {
    const entityId = modelo.estados[stateId]?.entidadId;
    return protectedStates.has(stateId) || (!!entityId && protectedEntities.has(entityId));
  };
  switch (op.kind) {
    case "createObject":
    case "createProcess":
      return modelo.opds[op.opdId]?.vista?.readOnly ? [op.opdId] : [];
    case "createState":
      return protectedEntities.has(op.entityId) ? [op.entityId] : [];
    case "renameEntity":
      return protectedEntities.has(op.entityId) ? [op.entityId] : [];
    case "renameState":
      return stateOwnerProtected(op.stateId) ? [op.stateId, modelo.estados[op.stateId]?.entidadId].filter((id): id is Id => !!id) : [];
    case "createProceduralLink":
      return modelo.opds[op.opdId]?.vista?.readOnly
        ? [op.opdId]
        : [op.source, op.destination].filter(isProtectedEndpoint).map((endpoint) => endpoint.id);
    case "createXorExclusion":
      return modelo.opds[op.opdId]?.vista?.readOnly
        ? [op.opdId]
        : Array.isArray(op.linkIds) ? op.linkIds.filter((id) => protectedLinks.has(id)) : [];
    case "deleteLink": {
      const link = modelo.enlaces[op.linkId];
      return protectedLinks.has(op.linkId) || (link && (isProtectedEndpoint(link.origenId) || isProtectedEndpoint(link.destinoId)))
        ? [op.linkId]
        : [];
    }
    case "deleteState":
      return stateOwnerProtected(op.stateId) ? [op.stateId] : [];
    case "deleteEntity":
      return protectedEntities.has(op.entityId) ? [op.entityId] : [];
    case "createRefinement":
      return protectedEntities.has(op.entityId) || modelo.opds[op.opdId]?.vista?.readOnly ? [op.entityId, op.opdId] : [];
    case "copyPiece":
      return modelo.opds[op.targetOpdId]?.vista?.readOnly ? [op.targetOpdId] : [];
    case "connectPieceReference":
    case "replaceSubmodelReference":
      return [];
    default:
      return assertNever(op);
  }
}

function idsEscritos(diff: ModelDiff): Id[] {
  return [...new Set(diff.changes.filter((change) => change.path[0] !== "opds").map((change) => change.path[1]))].sort();
}

function diffValue(path: ModelPath, before: ModelSlot, after: ModelSlot, result: ModelChange[]): void {
  if (slotEqual(before, after)) return;
  if (before.exists && after.exists && isPlainRecord(before.value) && isPlainRecord(after.value)) {
    const fields = new Set([...Object.keys(before.value), ...Object.keys(after.value)]);
    for (const field of [...fields].sort()) {
      diffValue(
        [...path, field],
        slot(before.value[field], Object.hasOwn(before.value, field)),
        slot(after.value[field], Object.hasOwn(after.value, field)),
        result,
      );
    }
    return;
  }
  result.push({ path, before, after });
}

function getSlot(model: Modelo, path: ModelPath): ModelSlot {
  const [collection, id, ...fields] = path;
  let value: unknown = (model as unknown as Record<string, Record<Id, unknown> | undefined>)[collection]?.[id];
  let exists = value !== undefined;
  for (const field of fields) {
    if (!isPlainRecord(value) || !Object.hasOwn(value, field)) return { exists: false };
    value = value[field];
    exists = true;
  }
  return slot(value, exists);
}

function setSlot(model: Modelo, path: ModelPath, next: ModelSlot): Modelo {
  const [collection, id, ...fields] = path;
  const records = { ...(((model as unknown as Record<string, Record<Id, unknown> | undefined>)[collection]) ?? {}) };
  if (fields.length === 0) {
    if (next.exists) records[id] = next.value;
    else delete records[id];
  } else {
    const currentEntry = records[id];
    const entry = currentEntry && typeof currentEntry === "object" ? structuredClone(currentEntry) as Record<string, unknown> : {};
    let cursor = entry;
    for (const field of fields.slice(0, -1)) {
      const value = cursor[field];
      if (!value || typeof value !== "object" || Array.isArray(value)) cursor[field] = {};
      cursor = cursor[field] as Record<string, unknown>;
    }
    const leaf = fields[fields.length - 1];
    if (leaf === undefined) throw new Error("Ruta de cambio vacía");
    if (next.exists) cursor[leaf] = structuredClone(next.value);
    else delete cursor[leaf];
    records[id] = entry;
  }
  return { ...model, [collection]: records } as Modelo;
}

function slot(value: unknown, exists: boolean): ModelSlot {
  return exists ? { exists: true, value } : { exists: false };
}

function slotEqual(left: ModelSlot, right: ModelSlot): boolean {
  return left.exists === right.exists && (!left.exists || stableJson(left.value) === stableJson(right.value));
}

export function fingerprintValue(value: unknown): string {
  return `json:${stableJson(value)}`;
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (isPlainRecord(value)) return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  return JSON.stringify(value) ?? "undefined";
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
}

function idExiste(modelo: Modelo, id: Id): boolean {
  return idModeloExiste(modelo, id);
}

function reject(code: ChangeRejectionCode, message: string, references: Id[] = []): ChangeValidation {
  return { kind: "rejected", code, message, references: [...new Set(references)].sort() };
}

function referencesInError(error: string): Id[] {
  const ids = error.match(/(?:^|[ :"'])(?:opd|[opse]-)[A-Za-z0-9_-]+/g) ?? [];
  return [...new Set(ids.map((id) => id.replace(/^[ :"']/, "")))];
}

function assertNever(value: never): never {
  throw new Error(`Operación semántica no soportada: ${JSON.stringify(value)}`);
}
