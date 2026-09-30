import { compareBoundaryObservations } from "../equivalencia/verificar";
import type { PieceBehaviorDimension, PieceManifest } from "../tipos";

export type PieceComparisonDimension = "identity" | "function" | "boundary" | "version" | "profile"
  | PieceBehaviorDimension;

export interface PieceDimensionResult {
  status: "same" | "different" | "unexamined";
  before?: string;
  after?: string;
  evidence?: { before: string; after: string };
}

export interface PieceVersionComparison {
  scope: "declared-piece-observables";
  dimensions: Record<PieceComparisonDimension, PieceDimensionResult>;
  changed: PieceComparisonDimension[];
  unexamined: PieceComparisonDimension[];
  /** Always false: this comparison does not prove behavioral equivalence or safe substitution. */
  safeSubstitution: false;
}

/**
 * Compares declarations present in both manifests. Equal boundary signatures
 * only establish that narrow observable; missing behavioral evidence stays
 * unexamined, and a matching signature never means safe substitution.
 */
export function comparePieceVersions(before: PieceManifest, after: PieceManifest): PieceVersionComparison {
  const boundary = compareBoundaryObservations(
    before.boundary.roles.map((role) => `${role.entityId}|${role.linkType}|${role.role}`),
    after.boundary.roles.map((role) => `${role.entityId}|${role.linkType}|${role.role}`),
  );
  const dimensions: Record<PieceComparisonDimension, PieceDimensionResult> = {
    identity: compareValue(identityKey(before), identityKey(after)),
    function: compareValue(before.function, after.function),
    boundary: compareValue(before.boundary.signature, after.boundary.signature, {
      same: boundary.sameSignature,
    }),
    version: compareValue(versionKey(before), versionKey(after)),
    profile: compareValue(profileKey(before), profileKey(after)),
    time: compareBehavior(before, after, "time"),
    errors: compareBehavior(before, after, "errors"),
    retry: compareBehavior(before, after, "retry"),
    internalBehavior: compareBehavior(before, after, "internalBehavior"),
  };
  const changed = (Object.keys(dimensions) as PieceComparisonDimension[])
    .filter((dimension) => dimensions[dimension]!.status === "different");
  const unexamined = (Object.keys(dimensions) as PieceComparisonDimension[])
    .filter((dimension) => dimensions[dimension]!.status === "unexamined");
  return { scope: "declared-piece-observables", dimensions, changed, unexamined, safeSubstitution: false };
}

function compareBehavior(
  before: PieceManifest,
  after: PieceManifest,
  dimension: PieceBehaviorDimension,
): PieceDimensionResult {
  const left = before.behavior[dimension];
  const right = after.behavior[dimension];
  if (!left || !right) return { status: "unexamined" };
  return compareValue(left.value, right.value, undefined, { before: left.evidence, after: right.evidence });
}

function compareValue(
  before: string,
  after: string,
  forced?: { same: boolean },
  evidence?: { before: string; after: string },
): PieceDimensionResult {
  return {
    status: (forced?.same ?? before === after) ? "same" : "different",
    before,
    after,
    ...(evidence ? { evidence } : {}),
  };
}

function identityKey(manifest: PieceManifest): string {
  return `${manifest.identity.modelId}/${manifest.identity.pieceId}`;
}

function versionKey(manifest: PieceManifest): string {
  return `${manifest.version.id}/${manifest.version.contentHash}`;
}

function profileKey(manifest: PieceManifest): string {
  return `${manifest.profile.id}@${manifest.profile.version}`;
}
