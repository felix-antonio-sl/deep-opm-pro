import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { Base, Target } from "../../agent/contracts";

export type CommitGrantKind = "review" | "delegated";

/** Returned to the controller once. Its bearer token is never persisted. */
export interface CommitGrant {
  id: string;
  token: string;
  kind: CommitGrantKind;
  changeId: string;
  taskId: string | null;
  actorId: string;
  target: Target;
  base: Base;
  controllerId: string;
  intentVersion: number | null;
  authorizationVersion: number | null;
  leaseFence: number;
  expiresAt: string;
}

/** Durable claims stored alongside the prepared change. */
export type CommitGrantRecord = Omit<CommitGrant, "token"> & { tokenHash: string; consumedAt: string | null };

export type CommitGrantBinding = Pick<CommitGrant,
  "kind" | "changeId" | "taskId" | "actorId" | "target" | "base" | "controllerId" |
  "intentVersion" | "authorizationVersion" | "leaseFence"
>;

export function emitirCommitGrant(
  binding: CommitGrantBinding,
  ttlMs = 15_000,
  now = new Date(),
): CommitGrant {
  if (!Number.isSafeInteger(ttlMs) || ttlMs <= 0 || ttlMs > 60_000) {
    throw new Error("Duración del permiso de commit inválida");
  }
  const token = randomBytes(32).toString("base64url");
  return {
    ...binding,
    id: randomBytes(16).toString("base64url"),
    token,
    expiresAt: new Date(now.getTime() + ttlMs).toISOString(),
  };
}

export function guardarClaimsCommitGrant(grant: CommitGrant): CommitGrantRecord {
  const { token, ...claims } = grant;
  return { ...claims, tokenHash: hashToken(token), consumedAt: null };
}

export function verificarCommitGrant(
  presented: CommitGrant,
  stored: CommitGrantRecord,
  expected: CommitGrantBinding,
  now = new Date(),
): boolean {
  if (stored.consumedAt !== null || Date.parse(stored.expiresAt) <= now.getTime()) return false;
  if (Date.parse(presented.expiresAt) <= now.getTime()) return false;
  if (!igualJson(claims(presented), claims(stored)) || !igualJson(bindingOf(stored), expected)) return false;
  const actual = Buffer.from(hashToken(presented.token), "hex");
  const expectedHash = Buffer.from(stored.tokenHash, "hex");
  return actual.length === expectedHash.length && timingSafeEqual(actual, expectedHash);
}

export function consumirCommitGrant(record: CommitGrantRecord, now = new Date()): CommitGrantRecord {
  return { ...record, consumedAt: now.toISOString() };
}

export function hashCommitRequest(value: unknown): string {
  // `readIds` and `writeIds` are recomputed by the trusted validation kernel.
  // They may be empty in the submitted request and populated in the stored
  // prepared ChangeSet; they are effects, not part of caller-supplied identity.
  const normalized = typeof value === "object" && value !== null && "change" in value
    ? normalizeDerivedChangeFields(value as { change: unknown; [key: string]: unknown })
    : value;
  return createHash("sha256").update(stableJson(normalized)).digest("hex");
}

function normalizeDerivedChangeFields(value: { change: unknown; [key: string]: unknown }): unknown {
  if (typeof value.change !== "object" || value.change === null || Array.isArray(value.change)) return value;
  return {
    ...value,
    change: { ...(value.change as Record<string, unknown>), readIds: [], writeIds: [] },
  };
}

function hashToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

function claims(value: CommitGrant | CommitGrantRecord): Omit<CommitGrant, "token"> {
  const { token: _token, tokenHash: _tokenHash, consumedAt: _consumedAt, ...claim } = value as CommitGrantRecord & CommitGrant;
  return claim;
}

function bindingOf(value: CommitGrant | CommitGrantRecord): CommitGrantBinding {
  return {
    kind: value.kind,
    changeId: value.changeId,
    taskId: value.taskId,
    actorId: value.actorId,
    target: value.target,
    base: value.base,
    controllerId: value.controllerId,
    intentVersion: value.intentVersion,
    authorizationVersion: value.authorizationVersion,
    leaseFence: value.leaseFence,
  };
}

function igualJson(left: unknown, right: unknown): boolean {
  return stableJson(left) === stableJson(right);
}

function stableJson(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(",")}}`;
}
