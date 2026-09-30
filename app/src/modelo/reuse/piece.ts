import type {
  Entidad,
  Estado,
  Id,
  Modelo,
  PieceBehaviorDimension,
  PieceBehaviorObservation,
  PieceBoundaryRole,
  PieceIdentity,
  PieceLineageEntry,
  PieceManifest,
  PieceProfile,
  PieceReferenceMetadata,
  PieceVersion,
  Posicion,
  Resultado,
} from "../tipos";
import { clonarEntidadConIdFresco } from "../operaciones/clonarEntidad";
import { conectarSubmodelo, actualizarMaterializacionSubmodelo } from "../submodelos";
import { firmaSnapshotSubmodelo } from "../submodelos/estado";
import { crearModelo } from "../operaciones/creacion";
import { idModeloExiste } from "../operaciones/helpers";
import { firmaPieza } from "../submodelos/estado";
import { comparePieceVersions, type PieceVersionComparison } from "./compare";
import type { OperationBase } from "../changes/types";

export interface CopyPieceOperation extends OperationBase {
  kind: "copyPiece";
  sourceSnapshot: Modelo;
  pieceId: Id;
  manifest: PieceManifest;
  targetOpdId: Id;
  position: Posicion;
  expectedNextSeq: number;
}

export interface ConnectPieceReferenceOperation extends OperationBase {
  kind: "connectPieceReference";
  sourceSnapshot: Modelo;
  pieceId: Id;
  manifest: PieceManifest;
  targetOpdId: Id;
  anchorEntityId: Id;
  expectedNextSeq: number;
}

export interface ReplaceSubmodelReferenceOperation extends OperationBase {
  kind: "replaceSubmodelReference";
  referenceId: Id;
  expectedSourceVersion: string;
  expectedSourceIdentity: PieceIdentity;
  sourceSnapshot: Modelo;
  pieceId: Id;
  manifest: PieceManifest;
  includeBoundaryChange: boolean;
}

export const PIECE_PROFILE_ENTITY_NEIGHBORHOOD = "entity-neighborhood" as const;
export const PIECE_PROFILE_VERSION = "1" as const;

export interface CreatePieceManifestInput {
  model: Modelo;
  pieceId: Id;
  /** Explicitly authored purpose. It is never inferred from the entity name. */
  function: string;
  sourceVersion?: string;
  profile?: { id: string; version: string };
  behavior?: Partial<Record<PieceBehaviorDimension, PieceBehaviorObservation>>;
  losses?: string[];
}

export type PieceManifestResult =
  | { ok: true; value: PieceManifest }
  | { ok: false; error: string };

/**
 * Builds a versioned manifest for the existing entity-shaped Piece abstraction.
 * Boundary identity is explicit at direct link endpoints; no names are used to
 * silently merge distinct entities.
 */
export function createPieceManifest(input: CreatePieceManifestInput): PieceManifestResult {
  const entity = input.model.entidades[input.pieceId];
  if (!entity || entity.esAtributo) return { ok: false, error: `Pieza no existe o no es reutilizable: ${input.pieceId}` };
  const purpose = input.function.trim();
  if (!purpose) return { ok: false, error: "La función de la pieza debe declararse explícitamente" };

  const contentHash = firmaPieza(input.model, input.pieceId);
  if (contentHash === null) return { ok: false, error: `No se pudo firmar la pieza: ${input.pieceId}` };
  const version: PieceVersion = {
    id: input.sourceVersion?.trim() || contentHash,
    contentHash,
  };
  const identity = { modelId: input.model.id, pieceId: input.pieceId };
  const roles = boundaryRoles(input.model, input.pieceId);
  const source: PieceLineageEntry = { identity, version, relation: "source" };
  const profile = input.profile ?? { id: PIECE_PROFILE_ENTITY_NEIGHBORHOOD, version: PIECE_PROFILE_VERSION };
  const manifestId = pieceManifestId(identity, version, purpose, profile);

  return {
    ok: true,
    value: {
      schema: "opforja.piece.v1",
      manifestId,
      identity,
      function: purpose,
      boundary: {
        scope: "direct-incidence",
        roles,
        signature: serializeBoundary(roles),
      },
      version,
      profile,
      lineage: [source],
      behavior: input.behavior ?? {},
      losses: input.losses ?? [],
    },
  };
}

/** Appends a local identity without converting the independent copy into a live reference. */
export function recordPieceCopy(
  source: PieceManifest,
  copyIdentity: PieceIdentity,
  copyVersion: PieceVersion,
): PieceManifest {
  return {
    ...source,
    manifestId: pieceManifestId(copyIdentity, copyVersion, source.function, source.profile),
    identity: copyIdentity,
    version: copyVersion,
    lineage: [
      ...source.lineage,
      { identity: copyIdentity, version: copyVersion, relation: "copy" },
    ],
  };
}

export type PieceOperationInput =
  | {
      kind: "copy";
      source: Modelo;
      pieceId: Id;
      function: string;
      target: { opdId: Id; position: Posicion };
      sourceVersion?: string;
    }
  | {
      kind: "reference";
      source: Modelo;
      pieceId: Id;
      function: string;
      target: { opdId: Id; anchorEntityId: Id };
      sourceVersion?: string;
    }
  | {
      kind: "update";
      source: Modelo;
      pieceId: Id;
      function: string;
      target: { referenceId: Id; expectedSourceVersion: string };
      sourceVersion?: string;
      /** A changed boundary is still only a proposal; it must be included in the review diff. */
      includeBoundaryChange?: boolean;
    };

export interface PieceOperationPreparation {
  operations: import("../changes/types").SemanticOperation[];
  explanation: string;
  manifest: PieceManifest;
  losses: string[];
  comparison?: PieceVersionComparison;
}

export function preparePieceOperation(model: Modelo, input: PieceOperationInput): Resultado<PieceOperationPreparation> {
  const losses = pieceProjectionLosses(input.source, input.pieceId);
  const manifestResult = createPieceManifest({
    model: input.source,
    pieceId: input.pieceId,
    function: input.function,
    ...(input.sourceVersion ? { sourceVersion: input.sourceVersion } : {}),
    losses,
  });
  if (!manifestResult.ok) return manifestResult;
  const manifest = manifestResult.value;
  const sourceEntity = input.source.entidades[input.pieceId];
  if (!sourceEntity || sourceEntity.esAtributo) return { ok: false, error: `Pieza no existe o no es reutilizable: ${input.pieceId}` };
  const operationId = `piece:${input.kind}:${input.pieceId}:${manifest.version.contentHash}`;

  if (input.kind === "copy") {
    const targetOpd = model.opds[input.target.opdId];
    if (!targetOpd || targetOpd.vista?.readOnly) return { ok: false, error: "El destino de la copia debe ser un OPD propio y editable" };
    const operation = {
      kind: "copyPiece" as const,
      operationId,
      preconditions: [{ kind: "opdExists" as const, id: input.target.opdId }],
      sourceSnapshot: input.source,
      pieceId: input.pieceId,
      manifest,
      targetOpdId: input.target.opdId,
      position: input.target.position,
      expectedNextSeq: model.nextSeq,
    };
    return { ok: true, value: { operations: [operation], explanation: `Copiar «${sourceEntity.nombre}» como una pieza local independiente.`, manifest, losses } };
  }

  if (input.kind === "reference") {
    const targetOpd = model.opds[input.target.opdId];
    if (!targetOpd || targetOpd.vista?.readOnly) return { ok: false, error: "La referencia debe anclarse desde un OPD propio y editable" };
    const anchor = model.entidades[input.target.anchorEntityId];
    if (!anchor || anchor.anclaje) return { ok: false, error: "La raíz de referencia debe ser una entidad propia, no anclada" };
    const projection = projectPieceSnapshot(input.source, input.pieceId);
    if (!projection.ok) return projection;
    const operation = {
      kind: "connectPieceReference" as const,
      operationId,
      preconditions: [
        { kind: "opdExists" as const, id: input.target.opdId },
        { kind: "entity" as const, id: input.target.anchorEntityId },
      ],
      sourceSnapshot: input.source,
      pieceId: input.pieceId,
      manifest,
      targetOpdId: input.target.opdId,
      anchorEntityId: input.target.anchorEntityId,
      expectedNextSeq: model.nextSeq,
    };
    return { ok: true, value: { operations: [operation], explanation: `Referenciar «${sourceEntity.nombre}» en solo lectura desde «${anchor.nombre}».`, manifest, losses } };
  }

  const ref = model.submodelos?.[input.target.referenceId];
  if (!ref?.piece) return { ok: false, error: "La referencia elegida no es una pieza reutilizable protegida" };
  if (ref.piece.identity.modelId !== input.source.id || ref.piece.identity.pieceId !== input.pieceId) {
    return { ok: false, error: "La identidad de origen no coincide con la referencia; la actualización se rechaza" };
  }
  if (ref.piece.version.id !== input.target.expectedSourceVersion) return { ok: false, error: "La referencia cambió desde que se leyó; vuelve a preparar la actualización" };
  const comparison = comparePieceVersions(metadataAsManifest(ref.piece), manifest);
  const boundaryChanged = comparison.dimensions.boundary?.status === "different";
  if (boundaryChanged && !input.includeBoundaryChange) {
    return { ok: false, error: "La frontera cambió; incluye el cambio explícitamente para preparar una revisión humana" };
  }
  const projection = projectPieceSnapshot(input.source, input.pieceId);
  if (!projection.ok) return projection;
  const nextManifest: PieceManifest = {
    ...manifest,
    lineage: [...ref.piece.lineage, { identity: manifest.identity, version: manifest.version, relation: "update" }],
  };
  const operation = {
    kind: "replaceSubmodelReference" as const,
    operationId,
    preconditions: [],
    referenceId: ref.id,
    expectedSourceVersion: input.target.expectedSourceVersion,
    expectedSourceIdentity: ref.piece.identity,
    sourceSnapshot: input.source,
    pieceId: input.pieceId,
    manifest: nextManifest,
    includeBoundaryChange: input.includeBoundaryChange === true,
  };
  return {
    ok: true,
    value: {
      operations: [operation],
      explanation: boundaryChanged
        ? `Preparar actualización de «${sourceEntity.nombre}»; cambió la frontera y requiere revisión explícita.`
        : `Preparar actualización de «${sourceEntity.nombre}» y conservar el historial de origen.`,
      manifest: nextManifest,
      losses,
      comparison,
    },
  };
}

function metadataAsManifest(metadata: PieceReferenceMetadata): PieceManifest {
  return {
    schema: "opforja.piece.v1",
    manifestId: metadata.manifestId,
    identity: metadata.identity,
    function: metadata.function,
    boundary: metadata.boundary,
    version: metadata.version,
    profile: metadata.profile,
    lineage: metadata.lineage,
    behavior: metadata.behavior,
    losses: metadata.losses,
  };
}

function manifestAsMetadata(manifest: PieceManifest): PieceReferenceMetadata {
  const { schema: _schema, ...metadata } = manifest;
  return metadata;
}

/** Entity + its states only: external links/fans/refinements are disclosed as losses, never cloned. */
export function projectPieceSnapshot(source: Modelo, pieceId: Id): Resultado<Modelo> {
  const entity = source.entidades[pieceId];
  if (!entity || entity.esAtributo) return { ok: false, error: `Pieza no existe o no es reutilizable: ${pieceId}` };
  const rawRoot = source.opds[source.opdRaizId];
  if (!rawRoot) return { ok: false, error: "La fuente no contiene un SD raíz" };
  const appearance = Object.values(source.opds).flatMap((opd) => Object.values(opd.apariencias))
    .find((candidate) => candidate.entidadId === pieceId);
  const cleanEntity = { ...entity };
  delete cleanEntity.refinamientos;
  delete cleanEntity.estereotipoId;
  delete cleanEntity.anclaje;
  delete cleanEntity.requisito;
  const localAppearance = appearance
    ? { ...appearance, entidadId: pieceId, opdId: source.opdRaizId, id: `a-${pieceId}` }
    : { id: `a-${pieceId}`, entidadId: pieceId, opdId: source.opdRaizId, x: 0, y: 0, width: 100, height: 40 };
  return {
    ok: true,
    value: {
      ...crearModelo(source.nombre),
      id: source.id,
      nombre: source.nombre,
      ...(source.descripcion ? { descripcion: source.descripcion } : {}),
      opdRaizId: source.opdRaizId,
      nextSeq: source.nextSeq,
      opds: {
        [source.opdRaizId]: {
          ...rawRoot,
          padreId: null,
          apariencias: { [localAppearance.id]: localAppearance },
          enlaces: {},
          ordenInzoom: [],
        },
      },
      entidades: { [pieceId]: cleanEntity },
      estados: Object.fromEntries(Object.values(source.estados)
        .filter((state) => state.entidadId === pieceId).map((state) => [state.id, state])),
      enlaces: {},
      abanicos: {},
    },
  };
}

export function pieceProjectionLosses(source: Modelo, pieceId: Id): string[] {
  const states = new Set(Object.values(source.estados).filter((state) => state.entidadId === pieceId).map((state) => state.id));
  const touches = (endpoint: { kind: string; id: Id }) => endpoint.kind === "entidad" ? endpoint.id === pieceId : states.has(endpoint.id);
  const losses: string[] = [];
  if (Object.values(source.enlaces).some((link) => touches(link.origenId) || touches(link.destinoId))) losses.push("Los enlaces incidentes y la identidad de los extremos de frontera se describen, pero no se materializan.");
  if (Object.values(source.abanicos ?? {}).some((fan) => fan.enlaceIds.some((id) => {
    const link = source.enlaces[id];
    return !!link && (touches(link.origenId) || touches(link.destinoId));
  }))) losses.push("Los abanicos asociados a la frontera no se materializan.");
  if (source.entidades[pieceId]?.refinamientos) losses.push("Los OPD de refinamiento externos no se materializan.");
  if (source.entidades[pieceId]?.estereotipoId) losses.push("El catálogo de estereotipos de la fuente no se importa.");
  losses.push("El perfil SD-root conserva solo la entidad y sus estados; no demuestra comportamiento temporal ni sustituibilidad.");
  return losses;
}

/** Applies a server-built, fixed-purpose piece operation to a candidate model. */
export function applyPieceOperation(
  model: Modelo,
  operation: CopyPieceOperation | ConnectPieceReferenceOperation | ReplaceSubmodelReferenceOperation,
): Resultado<Modelo> {
  const sourceManifest = createPieceManifest({
    model: operation.sourceSnapshot,
    pieceId: operation.pieceId,
    function: operation.manifest.function,
    sourceVersion: operation.manifest.version.id,
    losses: operation.manifest.losses,
  });
  if (!sourceManifest.ok) return sourceManifest;
  if (sourceManifest.value.version.contentHash !== operation.manifest.version.contentHash) {
    return { ok: false, error: "El snapshot de origen no coincide con la versión de pieza declarada" };
  }
  const sourceEntity = operation.sourceSnapshot.entidades[operation.pieceId];
  if (!sourceEntity) return { ok: false, error: `Pieza no existe: ${operation.pieceId}` };

  if (operation.kind === "copyPiece") {
    if (model.nextSeq !== operation.expectedNextSeq) return { ok: false, error: "La base cambió; vuelve a preparar la copia" };
    const target = model.opds[operation.targetOpdId];
    if (!target || target.vista?.readOnly) return { ok: false, error: "El destino de la copia dejó de ser editable" };
    const sourceStates = Object.values(operation.sourceSnapshot.estados).filter((state) => state.entidadId === operation.pieceId);
    const safeBase = skipCollidingCloneIds(model, sourceEntity.tipo === "objeto" ? "o" : "p", sourceStates.length);
    const cloned = clonarEntidadConIdFresco(safeBase, sourceEntity, sourceStates, operation.targetOpdId, operation.position);
    if (!cloned.ok) return cloned;
    const copyContentHash = firmaPieza(cloned.value.modelo, cloned.value.entidadId);
    if (!copyContentHash) return { ok: false, error: "No se pudo firmar la pieza local creada" };
    const localVersion = { id: copyContentHash, contentHash: copyContentHash };
    const localIdentity = { modelId: model.id, pieceId: cloned.value.entidadId };
    const localManifest = recordPieceCopy(operation.manifest, localIdentity, localVersion);
    return {
      ok: true,
      value: {
        ...cloned.value.modelo,
        pieceLineage: {
          ...(cloned.value.modelo.pieceLineage ?? {}),
          [cloned.value.entidadId]: {
            manifestId: localManifest.manifestId,
            function: localManifest.function,
            lineage: [...localManifest.lineage],
          },
        },
      },
    };
  }

  const projection = projectPieceSnapshot(operation.sourceSnapshot, operation.pieceId);
  if (!projection.ok) return projection;
  if (operation.kind === "connectPieceReference") {
    if (model.nextSeq !== operation.expectedNextSeq) return { ok: false, error: "La base cambió; vuelve a preparar la referencia" };
    const target = model.opds[operation.targetOpdId];
    const anchor = model.entidades[operation.anchorEntityId];
    if (!target || target.vista?.readOnly || !anchor || anchor.anclaje) {
      return { ok: false, error: "La raíz de la referencia debe seguir siendo propia y editable" };
    }
    const safeBase = skipCollidingReferenceIds(model);
    const connected = conectarSubmodelo(safeBase, {
      anchorEntidadId: operation.anchorEntityId,
      modeloId: operation.sourceSnapshot.id,
      nombre: sourceEntity.nombre,
      snapshot: projection.value,
      anchorOpdId: operation.targetOpdId,
    });
    if (!connected.ok) return connected;
    const ref = connected.value.modelo.submodelos?.[connected.value.refId];
    if (!ref) return { ok: false, error: "No se creó la referencia protegida" };
    const materializedHash = ref.materializacion?.sourceHash ?? firmaSnapshotSubmodelo(projection.value);
    return {
      ok: true,
      value: {
        ...connected.value.modelo,
        submodelos: {
          ...connected.value.modelo.submodelos,
          [ref.id]: {
            ...ref,
            piece: manifestAsMetadata(operation.manifest),
            source: { ...ref.source, modeloId: operation.sourceSnapshot.id, revisionHash: materializedHash },
            contrato: { ...ref.contrato, frozenAtHash: materializedHash },
          },
        },
      },
    };
  }

  const ref = model.submodelos?.[operation.referenceId];
  if (!ref?.piece) return { ok: false, error: "La referencia a actualizar ya no existe o no es una pieza protegida" };
  if (ref.piece.version.id !== operation.expectedSourceVersion ||
      ref.piece.identity.modelId !== operation.expectedSourceIdentity.modelId ||
      ref.piece.identity.pieceId !== operation.expectedSourceIdentity.pieceId) {
    return { ok: false, error: "La referencia cambió desde que se preparó la actualización" };
  }
  if (ref.piece.identity.modelId !== operation.manifest.identity.modelId || ref.piece.identity.pieceId !== operation.pieceId) {
    return { ok: false, error: "La identidad de origen no coincide con la referencia protegida" };
  }
  const comparison = comparePieceVersions(metadataAsManifest(ref.piece), operation.manifest);
  if (comparison.dimensions.boundary?.status === "different" && !operation.includeBoundaryChange) {
    return { ok: false, error: "La frontera cambió y no está incluida en la propuesta de actualización" };
  }
  const updated = actualizarMaterializacionSubmodelo(model, operation.referenceId, projection.value);
  if (!updated.ok) return updated;
  const updatedRef = updated.value.modelo.submodelos?.[operation.referenceId];
  if (!updatedRef) return { ok: false, error: "No se pudo recuperar la referencia actualizada" };
  const materializedHash = updatedRef.materializacion?.sourceHash ?? firmaSnapshotSubmodelo(projection.value);
  return {
    ok: true,
    value: {
      ...updated.value.modelo,
      submodelos: {
        ...updated.value.modelo.submodelos,
        [operation.referenceId]: {
          ...updatedRef,
          source: { ...updatedRef.source, modeloId: operation.sourceSnapshot.id, revisionHash: materializedHash },
          contrato: { ...updatedRef.contrato, frozenAtHash: materializedHash },
          piece: manifestAsMetadata(operation.manifest),
        },
      },
    },
  };
}

function skipCollidingCloneIds(model: Modelo, entityPrefix: string, stateCount: number): Modelo {
  let nextSeq = model.nextSeq;
  const exists = (id: Id) => idModeloExiste(model, id) || Object.hasOwn(model.pieceLineage ?? {}, id);
  while (true) {
    const ids = [
      `${entityPrefix}-${nextSeq}`,
      ...Array.from({ length: stateCount }, (_, index) => `s-${nextSeq + index + 1}`),
      `a-${nextSeq + stateCount + 1}`,
    ];
    if (ids.every((id) => !exists(id))) return { ...model, nextSeq };
    nextSeq += 1;
  }
}

function skipCollidingReferenceIds(model: Modelo): Modelo {
  let nextSeq = model.nextSeq;
  const exists = (id: Id) => idModeloExiste(model, id) || Object.hasOwn(model.pieceLineage ?? {}, id);
  while (exists(`sm-${nextSeq}`) || exists(`opd-${nextSeq + 1}`)) nextSeq += 1;
  return { ...model, nextSeq };
}

function pieceManifestId(identity: PieceIdentity, version: PieceVersion, purpose: string, profile: PieceProfile): string {
  return `piece:${encodeURIComponent(identity.modelId)}:${encodeURIComponent(identity.pieceId)}:${encodeURIComponent(version.id)}:${encodeURIComponent(purpose)}:${encodeURIComponent(profile.id)}@${encodeURIComponent(profile.version)}`;
}

export function boundaryRoles(model: Modelo, pieceId: Id): PieceBoundaryRole[] {
  const pieceStateIds = new Set(
    Object.values(model.estados)
      .filter((state) => state.entidadId === pieceId)
      .map((state) => state.id),
  );
  const belongsToPiece = (endpoint: { kind: string; id: Id }): boolean =>
    endpoint.kind === "entidad" ? endpoint.id === pieceId : pieceStateIds.has(endpoint.id);
  const roles: PieceBoundaryRole[] = [];

  for (const link of Object.values(model.enlaces)) {
    const sourceInside = belongsToPiece(link.origenId);
    const destinationInside = belongsToPiece(link.destinoId);
    if (sourceInside === destinationInside) continue;
    const externalEndpoint = sourceInside ? link.destinoId : link.origenId;
    const externalEntityId = externalEndpoint.kind === "entidad"
      ? externalEndpoint.id
      : model.estados[externalEndpoint.id]?.entidadId;
    if (!externalEntityId) continue;
    roles.push({
      entityId: externalEntityId,
      linkType: link.tipo,
      role: sourceInside ? "source" : "destination",
    });
  }
  return roles.sort(compareBoundaryRole);
}

export function serializeBoundary(roles: readonly PieceBoundaryRole[]): string {
  return JSON.stringify([...roles].sort(compareBoundaryRole));
}

function compareBoundaryRole(a: PieceBoundaryRole, b: PieceBoundaryRole): number {
  return a.entityId.localeCompare(b.entityId) || a.linkType.localeCompare(b.linkType) || a.role.localeCompare(b.role);
}
