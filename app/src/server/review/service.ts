import { randomBytes, randomUUID } from "node:crypto";
import { exportarModelo, hidratarModelo } from "../../serializacion/json";
import {
  projectReviewModel,
  reviewAnchorExists,
  type ReviewAnnotation,
  type ReviewAnnotationView,
  type ReviewReaderView,
  type ReviewShareOwnerView,
  type ReviewShareRecord,
} from "../../modelo/review";
import type { PersistenciaSesion } from "../modelPersistence";
import type {
  ReviewAnnotationInput,
  ReviewRepository,
  ReviewResolutionInput,
  ReviewShareRequest,
} from "./repository";
import { ReviewConflictError, ReviewInvalidError, ReviewNotFoundError } from "./errors";
import { hashReviewToken } from "./hash";

const ROOT = "/__deep-opm/review";
const MAX_BODY_BYTES = 16_384;

export interface ReviewServiceOptions {
  repository: ReviewRepository;
  now?: () => string;
}

export function createReviewService({ repository, now = () => new Date().toISOString() }: ReviewServiceOptions) {
  return {
    handlePublic: async (request: Request): Promise<Response> => {
      const route = publicRoute(new URL(request.url).pathname);
      if (!route) return publicNotFound();
      try {
        if (request.method === "GET" && !route.annotation) {
          const record = await repository.getPublic(hashReviewToken(route.token));
          if (!record) return publicNotFound();
          const view = readerView(record.share, record.annotations);
          return json(200, view);
        }
        if (request.method === "POST" && route.annotation) {
          const tokenHash = hashReviewToken(route.token);
          const record = await repository.getPublic(tokenHash);
          if (!record) return publicNotFound();
          if (!record.share.permissions.annotate) return json(403, { error: "Las anotaciones están desactivadas para esta revisión" });
          const input = validateAnnotation(await readJson(request));
          const hydrated = hidratarModelo(record.share.snapshot.modelJson);
          if (!hydrated.ok || !reviewAnchorExists(hydrated.value, input.anchor)) {
            return json(400, { error: "El referente no pertenece a la revisión compartida" });
          }
          const annotation: ReviewAnnotation = {
            id: randomUUID(),
            shareId: record.share.id,
            documentId: record.share.documentId,
            revision: record.share.snapshot.revision,
            anchor: input.anchor,
            text: input.text.trim(),
            actorId: randomUUID(),
            actorLabel: "Lector con enlace",
            actorKind: "reader",
            createdAt: now(),
            resolutions: [],
          };
          const created = await repository.createAnnotation(tokenHash, input, annotation);
          return created ? json(201, { annotation: annotationView(created) }) : publicNotFound();
        }
        return publicNotFound();
      } catch (error) {
        if (error instanceof ReviewInvalidError) return json(400, { error: error.message });
        if (error instanceof ReviewConflictError) return json(409, { error: error.message });
        return json(500, { error: "No se pudo cargar esta revisión" });
      }
    },

    handleOperator: async (request: Request, session: PersistenciaSesion): Promise<Response> => {
      if (session.auth !== true || session.authKind === "agent") return json(403, { error: "Acción disponible para el autor autenticado" });
      const url = new URL(request.url);
      const route = operatorRoute(url.pathname);
      if (!route) return json(404, { error: "No encontrado" });
      try {
        if (request.method === "GET" && route.kind === "collection") {
          const documentId = requiredQuery(url, "documentId");
          return json(200, { shares: await repository.listShares(session, documentId) });
        }
        if (request.method === "POST" && route.kind === "collection") {
          const input = validateShareRequest(await readJson(request));
          const token = randomBytes(32).toString("base64url");
          const share = await repository.createShare(session, input, randomUUID(), hashReviewToken(token), now());
          return json(201, { share: ownerView(share), token });
        }
        if (request.method === "GET" && route.kind === "share") {
          const documentId = requiredQuery(url, "documentId");
          const record = await repository.getOwnerReview(session, documentId, route.shareId);
          return record ? json(200, readerView(record.share, record.annotations)) : json(404, { error: "Revisión compartida no encontrada" });
        }
        if (request.method === "DELETE" && route.kind === "share") {
          const documentId = requiredQuery(url, "documentId");
          const revoked = await repository.revokeShare(session, documentId, route.shareId, now());
          return revoked ? json(200, { ok: true }) : json(404, { error: "Revisión compartida no encontrada" });
        }
        if (request.method === "POST" && route.kind === "resolve") {
          const documentId = requiredQuery(url, "documentId");
          const input = validateResolution(await readJson(request));
          const resolution = {
            id: randomUUID(),
            actorId: session.userId,
            actorLabel: "Autor",
            at: now(),
            outcome: input.outcome,
            note: input.note.trim(),
          } as const;
          const annotation = await repository.resolveAnnotation(session, documentId, route.shareId, route.annotationId, resolution);
          return annotation ? json(200, { annotation: annotationView(annotation) }) : json(404, { error: "Anotación no encontrada" });
        }
        return json(404, { error: "No encontrado" });
      } catch (error) {
        if (error instanceof ReviewInvalidError) return json(400, { error: error.message });
        if (error instanceof ReviewConflictError) return json(409, { error: error.message });
        if (error instanceof ReviewNotFoundError) return json(404, { error: error.message });
        return json(500, { error: "No se pudo guardar la revisión" });
      }
    },
  };
}

function publicRoute(pathname: string): { token: string; annotation: boolean } | null {
  if (!pathname.startsWith(`${ROOT}/`)) return null;
  const parts = pathname.slice(ROOT.length + 1).split("/");
  if (parts.length < 1 || parts.length > 2) return null;
  const token = decodePart(parts[0] ?? "");
  if (!token || token === "grants" || !/^[A-Za-z0-9_-]{40,64}$/.test(token)) return null;
  if (parts.length === 1) return { token, annotation: false };
  return parts[1] === "annotations" ? { token, annotation: true } : null;
}

type OperatorRoute =
  | { kind: "collection" }
  | { kind: "share"; shareId: string }
  | { kind: "resolve"; shareId: string; annotationId: string };

function operatorRoute(pathname: string): OperatorRoute | null {
  if (pathname === `${ROOT}/grants`) return { kind: "collection" };
  const parts = pathname.slice(`${ROOT}/grants/`.length).split("/");
  if (!pathname.startsWith(`${ROOT}/grants/`)) return null;
  const shareId = decodePart(parts[0] ?? "");
  if (!shareId) return null;
  if (parts.length === 1) return { kind: "share", shareId };
  if (parts.length === 4 && parts[1] === "annotations" && parts[3] === "resolve") {
    const annotationId = decodePart(parts[2] ?? "");
    return annotationId ? { kind: "resolve", shareId, annotationId } : null;
  }
  return null;
}

function readerView(share: ReviewShareRecord, annotations: ReviewAnnotation[]): ReviewReaderView {
  const hydrated = hidratarModelo(share.snapshot.modelJson);
  if (!hydrated.ok) throw new Error("Invalid immutable snapshot");
  const includedSourceIds = new Set(share.snapshot.includedSourceIds);
  const omittedSourcesCount = Object.keys(hydrated.value.mesaExploracion?.fuentes ?? {})
    .filter((sourceId) => !includedSourceIds.has(sourceId)).length;
  const projected = projectReviewModel(hydrated.value, share.snapshot.includedSourceIds);
  projected.id = "shared-review";
  const sources = Object.values(projected.mesaExploracion?.fuentes ?? {}).map((source) => ({
    id: source.id,
    title: source.titulo ?? "Fuente de texto",
    content: source.contenido,
    mediaType: "text/plain" as const,
  }));
  return {
    share: {
      revision: share.snapshot.revision,
      source: share.snapshot.source,
      modelName: share.snapshot.modelName,
      capturedAt: share.snapshot.capturedAt,
      permissions: { ...share.permissions },
      omittedSourcesCount,
    },
    modelJson: exportarModelo(projected),
    sources,
    annotations: annotations.map(annotationView),
  };
}

function annotationView(annotation: ReviewAnnotation): ReviewAnnotationView {
  const { shareId: _shareId, documentId: _documentId, ...view } = annotation;
  return view;
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
    permissions: { ...share.permissions },
    includedSources: share.snapshot.includedSourceIds.map((id) => ({ id, title: sources[id]?.titulo ?? "Fuente de texto" })),
  };
}

function validateShareRequest(value: unknown): ReviewShareRequest {
  if (!isRecord(value) || typeof value.documentId !== "string" || !value.documentId.trim() ||
      !Array.isArray(value.includedSourceIds) || typeof value.annotate !== "boolean" ||
      !Number.isInteger(value.expectedRevision) || (value.expectedRevision as number) < 0 ||
      typeof value.expectedWorkingCopyHash !== "string" || !/^[a-f0-9]{64}$/.test(value.expectedWorkingCopyHash) ||
      value.includedSourceIds.some((id) => typeof id !== "string" || !id.trim())) {
    throw new ReviewInvalidError("Solicitud para compartir no válida");
  }
  const ids = value.includedSourceIds as string[];
  if (ids.length > 100 || new Set(ids).size !== ids.length) throw new ReviewInvalidError("La selección de fuentes no es válida");
  return {
    documentId: value.documentId.trim(),
    includedSourceIds: ids.map((id) => id.trim()),
    annotate: value.annotate,
    expectedRevision: value.expectedRevision as number,
    expectedWorkingCopyHash: value.expectedWorkingCopyHash,
  };
}

function validateAnnotation(value: unknown): ReviewAnnotationInput {
  if (!isRecord(value) || typeof value.text !== "string" || value.text.trim().length < 1 || value.text.length > 5000 || !isRecord(value.anchor)) {
    throw new ReviewInvalidError("Anotación no válida");
  }
  const anchor = value.anchor;
  if (anchor.kind === "model") return { text: value.text, anchor: { kind: "model" } };
  if (["opd", "entity", "state", "link"].includes(String(anchor.kind)) && typeof anchor.id === "string" && anchor.id.trim()) {
    return { text: value.text, anchor: { kind: anchor.kind as "opd" | "entity" | "state" | "link", id: anchor.id } };
  }
  throw new ReviewInvalidError("Referente de anotación no válido");
}

function validateResolution(value: unknown): ReviewResolutionInput {
  if (!isRecord(value) || (value.outcome !== "addressed" && value.outcome !== "kept") ||
      typeof value.note !== "string" || value.note.length > 2000) {
    throw new ReviewInvalidError("Resolución no válida");
  }
  return { outcome: value.outcome, note: value.note };
}

async function readJson(request: Request): Promise<unknown> {
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) throw new ReviewInvalidError("La solicitud supera el tamaño permitido");
  try { return JSON.parse(text) as unknown; }
  catch { throw new ReviewInvalidError("JSON no válido"); }
}

function requiredQuery(url: URL, key: string): string {
  const value = url.searchParams.get(key)?.trim();
  if (!value) throw new ReviewInvalidError(`Falta ${key}`);
  return value;
}

function decodePart(value: string): string {
  try { return decodeURIComponent(value); } catch { return ""; }
}

function json(status: number, value: unknown): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, private",
      "referrer-policy": "no-referrer",
      "x-content-type-options": "nosniff",
    },
  });
}

function publicNotFound(): Response {
  return json(404, { error: "Revisión no encontrada o ya no disponible" });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
