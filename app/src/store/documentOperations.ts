import type { Base } from "../agent/contracts";
import type { Modelo } from "../modelo/tipos";

export type ReservationStatus = "preparing" | "granted" | "unknown";

export interface CommitReservation<Grant = unknown> {
  changeId: string;
  base: Base;
  status: ReservationStatus;
  startedAt: number;
  expiresAt: number | null;
  grant: Grant | null;
  /** True once the grant may have reached the remote commit endpoint. */
  commitSubmitted: boolean;
}

export interface PreparedDocumentEdit<Payload = unknown> {
  id: string;
  base: Modelo;
  candidate: Modelo;
  payload: Payload;
  preparedAt: number;
}

export interface DocumentOperationsSnapshot<Grant = unknown, Payload = unknown> {
  documentId: string;
  controllerId: string;
  clientSequence: number;
  base: Base | null;
  reservation: CommitReservation<Grant> | null;
  pendingEdits: readonly PreparedDocumentEdit<Payload>[];
}

export type ReservationResult<Grant> =
  | { kind: "reserved"; reservation: CommitReservation<Grant> }
  | { kind: "busy" }
  | { kind: "stale-base"; expectedSequence: number; actualSequence: number }
  | { kind: "expired" };

export type PrepareGrantResult<Grant, Payload = unknown> =
  | { kind: "grant-ready"; grant: Grant; reservation: CommitReservation<Grant> }
  | Exclude<ReservationResult<Grant>, { kind: "reserved" }>
  | { kind: "unknown"; pendingEdits: PreparedDocumentEdit<Payload>[] };

export type CommitGrantClaim<Grant> =
  | { kind: "claimed"; grant: Grant }
  | { kind: "already-submitted" }
  | { kind: "expired" }
  | { kind: "not-ready" }
  | { kind: "not-reserved" };

export type CommitFailureResolution<Result> =
  | { kind: "rejected" }
  | { kind: "unknown" }
  | { kind: "resolved"; value: Result };

/**
 * Per-document local ordering state. It does not grant authority and never
 * mutates the model: runtime owns application and validates prepared edits.
 */
export class DocumentOperationsController<Grant = unknown, Payload = unknown> {
  readonly documentId: string;
  readonly controllerId: string;
  private clientSequence: number;
  private base: Base | null = null;
  private reservation: CommitReservation<Grant> | null = null;
  private pendingEdits: PreparedDocumentEdit<Payload>[] = [];
  private pendingSequence = 0;
  private readonly listeners = new Set<() => void>();

  constructor(input: { documentId: string; controllerId?: string; clientSequence?: number }) {
    this.documentId = input.documentId;
    this.controllerId = input.controllerId ?? createControllerId(input.documentId);
    this.clientSequence = input.clientSequence ?? 0;
  }

  snapshot(): DocumentOperationsSnapshot<Grant, Payload> {
    return {
      documentId: this.documentId,
      controllerId: this.controllerId,
      clientSequence: this.clientSequence,
      base: this.base ? { ...this.base } : null,
      reservation: this.reservation ? { ...this.reservation } : null,
      pendingEdits: [...this.pendingEdits],
    };
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** A confirmed local edit changes the working-copy sequence. */
  recordAppliedEdit(): number {
    this.clientSequence += 1;
    this.base = null;
    this.notify();
    return this.clientSequence;
  }

  alignClientSequence(sequence: number): boolean {
    if (!Number.isSafeInteger(sequence) || sequence < 0 || this.reservation || this.pendingEdits.length > 0) return false;
    this.clientSequence = sequence;
    this.base = null;
    this.notify();
    return true;
  }

  observeBase(base: Base): boolean {
    if (base.clientSequence !== this.clientSequence || this.reservation || this.pendingEdits.length > 0) return false;
    this.base = { ...base };
    this.notify();
    return true;
  }

  /**
   * Reserve the next remote write against the exact working-copy sequence.
   * A single in-flight write per document keeps the lease/order model small.
   */
  beginReservation(changeId: string, base: Base, now = Date.now()): ReservationResult<Grant> {
    if (this.reservation) return { kind: "busy" };
    if (!changeId.trim()) throw new Error("changeId is required");
    if (base.clientSequence !== this.clientSequence) {
      return {
        kind: "stale-base",
        expectedSequence: base.clientSequence,
        actualSequence: this.clientSequence,
      };
    }
    const reservation: CommitReservation<Grant> = {
      changeId,
      base: { ...base },
      status: "preparing",
      startedAt: now,
      expiresAt: null,
      grant: null,
      commitSubmitted: false,
    };
    this.reservation = reservation;
    this.notify();
    return { kind: "reserved", reservation: { ...reservation } };
  }

  async prepareGrant(input: {
    changeId: string;
    base: Base;
    issueGrant: () => Promise<{ grant: Grant; expiresAt: number }>;
    now?: () => number;
  }): Promise<PrepareGrantResult<Grant, Payload>> {
    const now = input.now ?? Date.now;
    const started = this.beginReservation(input.changeId, input.base, now());
    if (started.kind !== "reserved") return started;
    try {
      const result = await input.issueGrant();
      if (!this.attachGrant(input.changeId, result.grant, result.expiresAt, now())) return { kind: "expired" };
      const reservation = this.reservation;
      if (!reservation) return { kind: "expired" };
      return { kind: "grant-ready", grant: result.grant, reservation: { ...reservation } };
    } catch {
      const pendingEdits = this.releaseReservation(input.changeId) ?? [];
      return { kind: "unknown", pendingEdits };
    }
  }

  attachGrant(changeId: string, grant: Grant, expiresAt: number, now = Date.now()): boolean {
    const current = this.reservation;
    if (!current || current.changeId !== changeId || current.status !== "preparing") return false;
    if (!Number.isFinite(expiresAt) || expiresAt <= now) {
      // Keep the fence until the runtime releases queued edits explicitly.
      this.reservation = { ...current, status: "unknown", expiresAt, commitSubmitted: false };
      this.notify();
      return false;
    }
    this.reservation = { ...current, status: "granted", grant, expiresAt, commitSubmitted: false };
    this.base = null;
    this.notify();
    return true;
  }

  /** Keep an unknown network outcome fenced until receipt lookup resolves it. */
  markOutcomeUnknown(changeId: string): boolean {
    const current = this.reservation;
    if (!current || current.changeId !== changeId) return false;
    this.reservation = { ...current, status: "unknown" };
    this.notify();
    return true;
  }

  /** Locally enforces one-use and expiry in addition to the server fence. */
  consumeGrant(changeId: string, now = Date.now()): Grant | null {
    const current = this.reservation;
    if (!current || current.changeId !== changeId || current.status !== "granted" || !current.grant) return null;
    if (current.expiresAt === null || current.expiresAt <= now) {
      this.reservation = { ...current, status: "unknown", grant: null, commitSubmitted: false };
      this.notify();
      return null;
    }
    const grant = current.grant;
    this.reservation = { ...current, status: "unknown", grant: null, commitSubmitted: true };
    this.notify();
    return grant;
  }

  /** Claims the grant before network I/O, so concurrent calls cannot submit twice. */
  claimCommitGrant(changeId: string, now = Date.now()): CommitGrantClaim<Grant> {
    const before = this.reservation;
    if (!before || before.changeId !== changeId) return { kind: "not-reserved" };
    if (before.commitSubmitted) return { kind: "already-submitted" };
    if (before.status !== "granted") return { kind: "not-ready" };
    const grant = this.consumeGrant(changeId, now);
    if (grant !== null) return { kind: "claimed", grant };
    const after = this.reservation;
    if (after?.changeId === changeId && !after.commitSubmitted && after.expiresAt !== null && after.expiresAt <= now) {
      return { kind: "expired" };
    }
    return after?.commitSubmitted ? { kind: "already-submitted" } : { kind: "not-ready" };
  }

  /** Hold a semantic local edit while a remote commit owns the document order. */
  prepareHumanEdit(input: {
    base: Modelo;
    candidate: Modelo;
    payload: Payload;
    now?: number;
  }): PreparedDocumentEdit<Payload> | null {
    if (!this.reservation) return null;
    const edit: PreparedDocumentEdit<Payload> = {
      id: `${this.documentId}:pending:${++this.pendingSequence}`,
      base: cloneModel(input.base),
      candidate: cloneModel(input.candidate),
      payload: input.payload,
      preparedAt: input.now ?? Date.now(),
    };
    this.pendingEdits = [...this.pendingEdits, edit];
    this.notify();
    return edit;
  }

  /**
   * Ends a known reservation and returns drafts in original order. Applying or
   * retaining those drafts is the runtime's responsibility.
   */
  finishReservation(changeId: string): PreparedDocumentEdit<Payload>[] | null {
    if (!this.reservation || this.reservation.changeId !== changeId) return null;
    const pending = this.pendingEdits;
    this.reservation = null;
    this.pendingEdits = [];
    this.notify();
    return pending;
  }

  /** A rejected/expired reservation releases the lock without discarding drafts. */
  releaseReservation(changeId: string): PreparedDocumentEdit<Payload>[] | null {
    return this.finishReservation(changeId);
  }

  /** Move successful remote commit into the local working-copy sequence. */
  recordRemoteCommit(): number {
    return this.recordAppliedEdit();
  }

  private notify(): void {
    for (const listener of this.listeners) listener();
  }
}

export type ModelMergeResult =
  | { kind: "merged"; model: Modelo }
  | { kind: "conflict"; paths: string[]; reason?: string };

export interface PreparedEditReplayStep<Payload> {
  edit: PreparedDocumentEdit<Payload>;
  before: Modelo;
  after: Modelo;
}

export interface PreparedEditReplayConflict<Payload> {
  edit: PreparedDocumentEdit<Payload>;
  paths: string[];
  reason?: string;
}

/** Revalidates queued full-model drafts in order against a confirmed remote result. */
export function replayPreparedDocumentEdits<Payload>(
  initial: Modelo,
  edits: readonly PreparedDocumentEdit<Payload>[],
  replay: (current: Modelo, edit: PreparedDocumentEdit<Payload>) => ModelMergeResult =
    (current, edit) => mergePreparedModelEdit(edit.base, edit.candidate, current),
): { model: Modelo; applied: PreparedEditReplayStep<Payload>[]; conflicts: PreparedEditReplayConflict<Payload>[] } {
  let model = initial;
  const applied: PreparedEditReplayStep<Payload>[] = [];
  const conflicts: PreparedEditReplayConflict<Payload>[] = [];
  for (const edit of edits) {
    const result = replay(model, edit);
    if (result.kind === "conflict") {
      conflicts.push({ edit, paths: [...result.paths], ...(result.reason ? { reason: result.reason } : {}) });
      continue;
    }
    applied.push({ edit, before: model, after: result.model });
    model = result.model;
  }
  return { model, applied, conflicts };
}

/** Three-way merge for a queued local draft; arrays and changed leaves are atomic. */
export function mergePreparedModelEdit(base: Modelo, candidate: Modelo, current: Modelo): ModelMergeResult {
  const paths: string[] = [];
  const merged = mergeValue(base, candidate, current, "modelo", paths);
  if (paths.length > 0 || !isRecord(merged)) return { kind: "conflict", paths };
  return { kind: "merged", model: merged as unknown as Modelo };
}

export async function sha256Json(json: string): Promise<string> {
  const bytes = new TextEncoder().encode(json);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** A missing receipt is not proof that an in-flight write did not commit. */
export async function resolveUnknownReceipt<Grant, Receipt, Result>(input: {
  controller: DocumentOperationsController<Grant, unknown>;
  changeId: string;
  lookup: () => Promise<Receipt | null>;
  reconcile: (receipt: Receipt) => Promise<Result> | Result;
}): Promise<{ kind: "unknown" } | { kind: "resolved"; value: Result }> {
  const reservation = input.controller.snapshot().reservation;
  if (!reservation || reservation.changeId !== input.changeId) return { kind: "unknown" };
  input.controller.markOutcomeUnknown(input.changeId);
  const receipt = await input.lookup();
  if (!receipt) return { kind: "unknown" };
  return { kind: "resolved", value: await input.reconcile(receipt) };
}

/**
 * Only contract-level rejections prove that no commit can have happened.
 * Timeouts and server errors remain fenced until a receipt lookup resolves them.
 */
export async function resolveCommitFailure<Grant, Receipt, Result>(input: {
  error: unknown;
  controller: DocumentOperationsController<Grant, unknown>;
  changeId: string;
  release: () => void;
  lookup: () => Promise<Receipt | null>;
  reconcile: (receipt: Receipt) => Promise<Result> | Result;
}): Promise<CommitFailureResolution<Result>> {
  if (isDefiniteCommitRejection(input.error)) {
    input.release();
    return { kind: "rejected" };
  }
  try {
    return await resolveUnknownReceipt(input);
  } catch {
    // A failed receipt lookup is still ambiguous; keep the reservation fenced.
    return { kind: "unknown" };
  }
}

export function isDefiniteCommitRejection(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" && [400, 401, 403, 404, 409, 422, 429].includes(status);
}

function mergeValue(base: unknown, candidate: unknown, current: unknown, path: string, conflicts: string[]): unknown {
  if (deepEqual(base, candidate)) return cloneValue(current);
  if (deepEqual(base, current)) return cloneValue(candidate);
  if (deepEqual(candidate, current)) return cloneValue(current);
  if (isRecord(base) && isRecord(candidate) && isRecord(current)) {
    const keys = new Set([...Object.keys(base), ...Object.keys(candidate), ...Object.keys(current)]);
    const result: Record<string, unknown> = {};
    for (const key of keys) {
      const beforeHas = Object.prototype.hasOwnProperty.call(base, key);
      const candidateHas = Object.prototype.hasOwnProperty.call(candidate, key);
      const currentHas = Object.prototype.hasOwnProperty.call(current, key);
      const value = mergeValue(
        beforeHas ? base[key] : undefined,
        candidateHas ? candidate[key] : undefined,
        currentHas ? current[key] : undefined,
        `${path}.${key}`,
        conflicts,
      );
      if (value !== undefined) result[key] = value;
    }
    return result;
  }
  conflicts.push(path);
  return cloneValue(current);
}

function deepEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left) && Array.isArray(right) && left.length === right.length &&
      left.every((value, index) => deepEqual(value, right[index]));
  }
  if (isRecord(left) || isRecord(right)) {
    if (!isRecord(left) || !isRecord(right)) return false;
    const leftKeys = Object.keys(left).sort();
    const rightKeys = Object.keys(right).sort();
    return leftKeys.length === rightKeys.length && leftKeys.every((key, index) =>
      key === rightKeys[index] && deepEqual(left[key], right[key]));
  }
  return false;
}

function cloneModel(model: Modelo): Modelo {
  return JSON.parse(JSON.stringify(model)) as Modelo;
}

function cloneValue<T>(value: T): T {
  if (value === undefined || value === null || typeof value !== "object") return value;
  return JSON.parse(JSON.stringify(value)) as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createControllerId(documentId: string): string {
  const randomUUID = globalThis.crypto?.randomUUID;
  return typeof randomUUID === "function"
    ? randomUUID.call(globalThis.crypto)
    : `${documentId}:controller:${Date.now().toString(36)}:${Math.random().toString(36).slice(2, 10)}`;
}
