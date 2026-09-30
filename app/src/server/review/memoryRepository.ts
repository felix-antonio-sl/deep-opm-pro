import { addReviewResolution, reviewAnchorExists } from "../../modelo/review";
import { hidratarModelo } from "../../serializacion/json";
import type { ReviewAnnotation, ReviewResolution, ReviewShareOwnerView, ReviewShareRecord } from "../../modelo/review";
import type { PersistenciaSesion } from "../modelPersistence";
import type {
  ReviewAnnotationInput,
  ReviewDocumentSnapshot,
  ReviewPublicRecord,
  ReviewRepository,
  ReviewShareRequest,
  ReviewSnapshotProvider,
} from "./repository";
import { ReviewConflictError, ReviewInvalidError, ReviewNotFoundError } from "./errors";
import { canonicalWorkingCopyHash } from "./hash";

/** Dev/test adapter. Production ownership and locking are enforced in PostgreSQL. */
export function createMemoryReviewRepository(snapshotProvider: ReviewSnapshotProvider): ReviewRepository {
  const shares = new Map<string, ReviewShareRecord>();
  const annotations = new Map<string, ReviewAnnotation>();
  const tokenToShare = new Map<string, string>();
  const byDocument = new Map<string, string[]>();
  const locks = new Map<string, Promise<void>>();

  const withLock = async <T>(key: string, work: () => Promise<T>): Promise<T> => {
    const previous = locks.get(key) ?? Promise.resolve();
    let release!: () => void;
    const current = new Promise<void>((resolve) => { release = resolve; });
    const queued = previous.then(() => current);
    locks.set(key, queued);
    await previous;
    try { return await work(); }
    finally {
      release();
      if (locks.get(key) === queued) locks.delete(key);
    }
  };

  const annotationsFor = (shareId: string) => [...annotations.values()]
    .filter((annotation) => annotation.shareId === shareId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));

  return {
    async createShare(session, input, id, tokenHash, now) {
      return withLock(`document:${session.tenantId}:${input.documentId}`, async () => {
        const snapshot = await snapshotProvider(session, input.documentId);
        if (!snapshot || snapshot.ownerId !== session.userId) throw new ReviewNotFoundError();
        if (snapshot.revision !== input.expectedRevision ||
            canonicalWorkingCopyHash(snapshot.modelJson) !== input.expectedWorkingCopyHash) {
          throw new ReviewConflictError();
        }
        const hydrated = hidratarModelo(snapshot.modelJson);
        if (!hydrated.ok) throw new ReviewNotFoundError();
        const sourceMap = hydrated.value.mesaExploracion?.fuentes ?? {};
        if (input.includedSourceIds.some((sourceId) => !Object.hasOwn(sourceMap, sourceId))) {
          throw new ReviewInvalidError("Una de las fuentes elegidas ya no está disponible en esta revisión");
        }
        const share: ReviewShareRecord = {
          id,
          tenantId: session.tenantId,
          documentId: input.documentId,
          ownerId: session.userId,
          tokenHash,
          createdAt: now,
          revokedAt: null,
          permissions: { annotate: input.annotate },
          snapshot: {
            revision: snapshot.revision,
            source: snapshot.source,
            capturedAt: now,
            modelName: hydrated.value.nombre,
            modelJson: snapshot.modelJson,
            includedSourceIds: [...input.includedSourceIds],
          },
        };
        shares.set(id, share);
        tokenToShare.set(tokenHash, id);
        const key = `${session.tenantId}:${input.documentId}`;
        byDocument.set(key, [...(byDocument.get(key) ?? []), id]);
        return share;
      });
    },

    async listShares(session, documentId) {
      const ids = byDocument.get(`${session.tenantId}:${documentId}`) ?? [];
      return ids.map((id) => shares.get(id)).filter((share): share is ReviewShareRecord =>
        Boolean(share && share.ownerId === session.userId),
      ).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(ownerView);
    },

    async getOwnerReview(session, documentId, shareId) {
      const share = shares.get(shareId);
      if (!share || share.tenantId !== session.tenantId || share.documentId !== documentId || share.ownerId !== session.userId) return null;
      return { share, annotations: annotationsFor(shareId) };
    },

    async revokeShare(session, documentId, shareId, now) {
      return withLock(`share:${shareId}`, async () => {
        const share = shares.get(shareId);
        if (!share || share.tenantId !== session.tenantId || share.documentId !== documentId ||
            share.ownerId !== session.userId || share.revokedAt) return false;
        shares.set(shareId, { ...share, revokedAt: now });
        return true;
      });
    },

    async getPublic(tokenHash): Promise<ReviewPublicRecord | null> {
      const id = tokenToShare.get(tokenHash);
      if (!id) return null;
      const share = shares.get(id);
      return !share || share.revokedAt ? null : { share, annotations: annotationsFor(id) };
    },

    async createAnnotation(tokenHash, _input: ReviewAnnotationInput, annotation) {
      return withLock(`token:${tokenHash}`, async () => {
        const id = tokenToShare.get(tokenHash);
        const share = id ? shares.get(id) : null;
        if (!share || share.revokedAt || !share.permissions.annotate ||
            share.id !== annotation.shareId || share.documentId !== annotation.documentId) return null;
        annotations.set(annotation.id, annotation);
        return annotation;
      });
    },

    async resolveAnnotation(session, documentId, shareId, annotationId, resolution: Omit<ReviewResolution, "revision" | "anchorPresent">) {
      return withLock(`share:${shareId}`, async () => {
        const share = shares.get(shareId);
        const annotation = annotations.get(annotationId);
        if (!share || !annotation || share.tenantId !== session.tenantId || share.documentId !== documentId ||
            share.ownerId !== session.userId || annotation.shareId !== shareId) return null;
        const current: ReviewDocumentSnapshot | null = await snapshotProvider(session, documentId);
        if (!current || current.ownerId !== session.userId) return null;
        const hydrated = hidratarModelo(current.modelJson);
        if (!hydrated.ok) return null;
        const stored: ReviewResolution = {
          ...resolution,
          revision: current.revision,
          anchorPresent: reviewAnchorExists(hydrated.value, annotation.anchor),
        };
        const updated = addReviewResolution(annotation, stored);
        annotations.set(annotationId, updated);
        return updated;
      });
    },
  };
}

function ownerView(share: ReviewShareRecord): ReviewShareOwnerView {
  const hydrated = hidratarModelo(share.snapshot.modelJson);
  const sources = hydrated.ok ? hydrated.value.mesaExploracion?.fuentes ?? {} : {};
  return {
    id: share.id,
    documentId: share.documentId,
    revision: share.snapshot.revision,
    source: share.snapshot.source,
    modelName: share.snapshot.modelName,
    createdAt: share.createdAt,
    revokedAt: share.revokedAt,
    permissions: share.permissions,
    includedSources: share.snapshot.includedSourceIds.map((id) => ({ id, title: sources[id]?.titulo ?? "Fuente de texto" })),
  };
}
