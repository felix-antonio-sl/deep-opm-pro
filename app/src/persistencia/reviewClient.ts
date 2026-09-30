import type { ReviewAnchor, ReviewAnnotationView, ReviewReaderView, ReviewShareOwnerView } from "../modelo/review";
import { obtenerSesionBackend } from "./backend";
import { encodeSessionIdentity, SESSION_IDENTITY_HEADER } from "./sessionIdentity";

export interface ReviewReaderPort {
  load(signal?: AbortSignal): Promise<ReviewReaderView>;
  annotate(input: { anchor: ReviewAnchor; text: string }, signal?: AbortSignal): Promise<ReviewAnnotationView>;
}

export interface ReviewCreateInput {
  documentId: string;
  includedSourceIds: string[];
  annotate: boolean;
}

export interface ReviewCreatedShare {
  share: ReviewShareOwnerView;
  token: string;
}

export interface ReviewOwnerPort {
  list(documentId: string, signal?: AbortSignal): Promise<ReviewShareOwnerView[]>;
  create(input: ReviewCreateInput, signal?: AbortSignal): Promise<ReviewCreatedShare>;
  get(documentId: string, shareId: string, signal?: AbortSignal): Promise<ReviewReaderView>;
  revoke(documentId: string, shareId: string, signal?: AbortSignal): Promise<void>;
  resolve(input: {
    documentId: string;
    shareId: string;
    annotationId: string;
    outcome: "addressed" | "kept";
    note: string;
  }, signal?: AbortSignal): Promise<ReviewAnnotationView>;
}

const ROOT = "/__deep-opm/review";

export class ReviewClientError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = "ReviewClientError";
  }
}

export type ReviewSnapshotExpectation = (documentId: string) => Promise<{
  expectedRevision: number;
  expectedWorkingCopyHash: string;
}>;

export function createReviewPort({ token, fetcher = fetch }: { token: string; fetcher?: typeof fetch }): ReviewReaderPort {
  const base = `${ROOT}/${encodeURIComponent(token)}`;
  return {
    load: (signal) => publicJson<ReviewReaderView>(fetcher, base, signal ? { signal } : {}),
    annotate: async ({ anchor, text }, signal) => {
      const response = await publicJson<{ annotation: ReviewAnnotationView }>(fetcher, `${base}/annotations`, {
        method: "POST", body: JSON.stringify({ anchor, text }), ...(signal ? { signal } : {}),
      });
      return response.annotation;
    },
  };
}

export function createReviewOwnerPort(
  fetcher: typeof fetch = fetch,
  prepareSnapshot?: ReviewSnapshotExpectation,
): ReviewOwnerPort {
  const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
    const session = await obtenerSesionBackend();
    if (!session.ok) throw new ReviewClientError(401, session.error);
    const headers = new Headers(init.headers);
    headers.set(SESSION_IDENTITY_HEADER, encodeSessionIdentity(session.value));
    if (init.body !== undefined && !headers.has("content-type")) headers.set("content-type", "application/json");
    const response = await fetcher(path, {
      ...init,
      headers,
      cache: "no-store",
      credentials: "same-origin",
      referrerPolicy: "no-referrer",
    });
    return parseResponse<T>(response);
  };

  return {
    async list(documentId, signal) {
      const result = await request<{ shares: ReviewShareOwnerView[] }>(`${ROOT}/grants?documentId=${encodeURIComponent(documentId)}`, signal ? { signal } : {});
      return result.shares;
    },
    async create(input: ReviewCreateInput, signal) {
      if (!prepareSnapshot) throw new ReviewClientError(409, "Actualiza la copia de trabajo antes de compartir");
      const expected = await prepareSnapshot(input.documentId);
      return request<ReviewCreatedShare>(`${ROOT}/grants`, {
        method: "POST", body: JSON.stringify({ ...input, ...expected }), ...(signal ? { signal } : {}),
      });
    },
    get: (documentId, shareId, signal) => request<ReviewReaderView>(
      `${ROOT}/grants/${encodeURIComponent(shareId)}?documentId=${encodeURIComponent(documentId)}`,
      signal ? { signal } : {},
    ),
    async revoke(documentId, shareId, signal) {
      await request(`${ROOT}/grants/${encodeURIComponent(shareId)}?documentId=${encodeURIComponent(documentId)}`, { method: "DELETE", ...(signal ? { signal } : {}) });
    },
    async resolve(input, signal) {
      const { documentId, shareId, annotationId, ...body } = input;
      const result = await request<{ annotation: ReviewAnnotationView }>(
        `${ROOT}/grants/${encodeURIComponent(shareId)}/annotations/${encodeURIComponent(annotationId)}/resolve?documentId=${encodeURIComponent(documentId)}`,
        { method: "POST", body: JSON.stringify(body), ...(signal ? { signal } : {}) },
      );
      return result.annotation;
    },
  };
}

async function publicJson<T>(fetcher: typeof fetch, path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body !== undefined && !headers.has("content-type")) headers.set("content-type", "application/json");
  const response = await fetcher(path, {
    ...init,
    headers,
    cache: "no-store",
    credentials: "omit",
    referrerPolicy: "no-referrer",
  });
  return parseResponse<T>(response);
}

async function parseResponse<T>(response: Response): Promise<T> {
  let payload: unknown;
  try { payload = await response.json(); }
  catch { payload = null; }
  if (!response.ok) {
    const message = isRecord(payload) && typeof payload.error === "string" ? payload.error : "No se pudo guardar la revisión";
    throw new ReviewClientError(response.status, message);
  }
  return payload as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
