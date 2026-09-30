import type { Modelo } from "./tipos";
import { sanitizePublicModelUrls } from "./shareSanitization";

/** Referente estable dentro de la revisión que leyó quien anotó. */
export type ReviewAnchor =
  | { kind: "model" }
  | { kind: "opd" | "entity" | "state" | "link"; id: string };

export interface ReviewResolution {
  id: string;
  actorId: string;
  actorLabel: string;
  at: string;
  revision: number;
  outcome: "addressed" | "kept";
  note: string;
  /** El referente puede haber cambiado desde la revisión original. */
  anchorPresent: boolean;
}

export interface ReviewAnnotation {
  id: string;
  shareId: string;
  documentId: string;
  revision: number;
  anchor: ReviewAnchor;
  text: string;
  actorId: string;
  actorLabel: string;
  actorKind: "reader" | "operator";
  createdAt: string;
  resolutions: ReviewResolution[];
}

export type ReviewAnnotationView = Omit<ReviewAnnotation, "shareId" | "documentId">;

export interface ReviewSharePermissions {
  annotate: boolean;
}

export interface ReviewSnapshot {
  revision: number;
  source: "saved" | "autosave";
  capturedAt: string;
  modelName: string;
  /** Private source JSON. Public responses must use `projectReviewModel`. */
  modelJson: string;
  includedSourceIds: string[];
}

/** Server-only record. tokenHash and snapshot are never sent to a reader. */
export interface ReviewShareRecord {
  id: string;
  tenantId: string;
  documentId: string;
  ownerId: string;
  tokenHash: string;
  createdAt: string;
  revokedAt: string | null;
  permissions: ReviewSharePermissions;
  snapshot: ReviewSnapshot;
}

export interface ReviewShareOwnerView {
  id: string;
  documentId: string;
  revision: number;
  source: "saved" | "autosave";
  modelName: string;
  createdAt: string;
  revokedAt: string | null;
  permissions: ReviewSharePermissions;
  includedSources: Array<{ id: string; title: string }>;
}

export interface ReviewSharedSource {
  id: string;
  title: string;
  content: string;
  mediaType: "text/plain";
}

export interface ReviewReaderView {
  share: {
    revision: number;
    source: "saved" | "autosave";
    modelName: string;
    capturedAt: string;
    permissions: ReviewSharePermissions;
    /** Number only: never disclose IDs or titles for sources withheld from the reader. */
    omittedSourcesCount: number;
  };
  modelJson: string;
  sources: ReviewSharedSource[];
  annotations: ReviewAnnotationView[];
}

export function projectReviewModel(model: Modelo, includedSourceIds: readonly string[]): Modelo {
  const allowed = new Set(includedSourceIds);
  const sanitized = sanitizePublicModelUrls(model);
  const { notasMesa: _notasMesa, mesaExploracion: mesa, ...base } = sanitized;
  const copy: Modelo = { ...base };
  if (!mesa) return copy;

  const fuentes = Object.fromEntries(
    Object.entries(mesa.fuentes).filter(([id]) => allowed.has(id)),
  );
  const trazos = Object.fromEntries(
    Object.entries(mesa.trazos).filter(([, trace]) =>
      trace.fuenteIds.length > 0 && trace.fuenteIds.every((id) => allowed.has(id))),
  );
  const retainedTraceIds = new Set(Object.keys(trazos));
  const propuestas = Object.fromEntries(
    Object.entries(mesa.propuestas).filter(([, proposal]) =>
      proposal.trazoIds.length > 0 && proposal.trazoIds.every((id) => retainedTraceIds.has(id))),
  );
  const retainedProposalIds = new Set(Object.keys(propuestas));
  const confirmaciones = Object.fromEntries(
    Object.entries(mesa.confirmaciones).filter(([, confirmation]) =>
      confirmation.fuenteIds.every((id) => allowed.has(id)) &&
      confirmation.fuenteIds.length > 0 &&
      confirmation.trazoIds.every((id) => retainedTraceIds.has(id)) &&
      confirmation.trazoIds.length > 0 &&
      retainedProposalIds.has(confirmation.propuestaId)),
  );

  if (!Object.keys(fuentes).length && !Object.keys(trazos).length &&
      !Object.keys(propuestas).length && !Object.keys(confirmaciones).length) {
  } else {
    copy.mesaExploracion = { ...mesa, fuentes, trazos, propuestas, confirmaciones };
  }
  return copy;
}

export function reviewAnchorExists(model: Modelo, anchor: ReviewAnchor): boolean {
  switch (anchor.kind) {
    case "model": return true;
    case "opd": return Object.hasOwn(model.opds, anchor.id);
    case "entity": return Object.hasOwn(model.entidades, anchor.id);
    case "state": return Object.hasOwn(model.estados, anchor.id);
    case "link": return Object.hasOwn(model.enlaces, anchor.id);
  }
}

export function addReviewResolution(
  annotation: ReviewAnnotation,
  resolution: ReviewResolution,
): ReviewAnnotation {
  if (annotation.resolutions.some((item) => item.id === resolution.id)) return annotation;
  return { ...annotation, resolutions: [...annotation.resolutions, resolution] };
}
