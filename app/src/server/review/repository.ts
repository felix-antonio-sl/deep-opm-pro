import type { PersistenciaSesion } from "../modelPersistence";
import type {
  ReviewAnnotation,
  ReviewResolution,
  ReviewShareOwnerView,
  ReviewShareRecord,
} from "../../modelo/review";

export interface ReviewShareRequest {
  documentId: string;
  includedSourceIds: string[];
  annotate: boolean;
  expectedRevision: number;
  expectedWorkingCopyHash: string;
}

export interface ReviewAnnotationInput {
  anchor: ReviewAnnotation["anchor"];
  text: string;
}

export interface ReviewResolutionInput {
  outcome: ReviewResolution["outcome"];
  note: string;
}

export interface ReviewDocumentSnapshot {
  ownerId: string;
  revision: number;
  source: "saved" | "autosave";
  modelJson: string;
  modelName: string;
}

export interface ReviewPublicRecord {
  share: ReviewShareRecord;
  annotations: ReviewAnnotation[];
}

export interface ReviewRepository {
  createShare(
    session: PersistenciaSesion,
    input: ReviewShareRequest,
    id: string,
    tokenHash: string,
    now: string,
  ): Promise<ReviewShareRecord>;
  listShares(session: PersistenciaSesion, documentId: string): Promise<ReviewShareOwnerView[]>;
  getOwnerReview(session: PersistenciaSesion, documentId: string, shareId: string): Promise<ReviewPublicRecord | null>;
  revokeShare(session: PersistenciaSesion, documentId: string, shareId: string, now: string): Promise<boolean>;
  getPublic(tokenHash: string): Promise<ReviewPublicRecord | null>;
  createAnnotation(
    tokenHash: string,
    input: ReviewAnnotationInput,
    annotation: ReviewAnnotation,
  ): Promise<ReviewAnnotation | null>;
  resolveAnnotation(
    session: PersistenciaSesion,
    documentId: string,
    shareId: string,
    annotationId: string,
    resolution: Omit<ReviewResolution, "revision" | "anchorPresent">,
  ): Promise<ReviewAnnotation | null>;
}

export type ReviewSnapshotProvider = (
  session: PersistenciaSesion,
  documentId: string,
) => Promise<ReviewDocumentSnapshot | null>;
