import type { ChangeSet, Target } from "../agent/contracts";
import type { SemanticInverse } from "../modelo/changes/types";

export type IntentHistoryStatus = "applied" | "undo-pending" | "undone" | "undo-conflict" | "reapply-pending" | "reapplied";

export interface IntentHistoryEntry {
  documentId: string;
  changeId: string;
  target: Target;
  sequence: number;
  /** Legacy snapshot depth when this semantic intent crossed into the document. */
  legacyUndoDepth: number;
  change: ChangeSet;
  inverse: SemanticInverse;
  status: IntentHistoryStatus;
  undoChangeId?: string;
  conflict?: { reason: string; references: string[] };
}

export interface UndoConflict {
  reason: string;
  references: string[];
}

/** Semantic undo ledger. Legacy snapshots may unwind only down to its barrier. */
export class IntentHistory {
  private readonly byDocument = new Map<string, IntentHistoryEntry[]>();

  clearAll(): void {
    this.byDocument.clear();
  }

  recordApplied(input: Omit<IntentHistoryEntry, "status">): IntentHistoryEntry {
    const entries = this.byDocument.get(input.documentId) ?? [];
    const entry: IntentHistoryEntry = { ...input, status: "applied" };
    this.byDocument.set(input.documentId, [...entries, entry]);
    return entry;
  }

  entries(documentId: string): readonly IntentHistoryEntry[] {
    return [...(this.byDocument.get(documentId) ?? [])];
  }

  restoreDocument(documentId: string, entries: readonly IntentHistoryEntry[]): void {
    const restored = entries
      .filter((entry) => entry.documentId === documentId)
      .map((entry) => structuredClone(entry));
    this.byDocument.set(documentId, restored);
  }

  get(documentId: string, changeId: string): IntentHistoryEntry | null {
    return (this.byDocument.get(documentId) ?? []).find((entry) => entry.changeId === changeId) ?? null;
  }

  /**
   * Returns an applied semantic intent once all newer legacy snapshots have
   * been undone. This makes a snapshot from before the intent unreachable.
   */
  undoCandidate(documentId: string, legacyUndoDepth: number): IntentHistoryEntry | null {
    const entries = this.byDocument.get(documentId) ?? [];
    const entry = [...entries].reverse().find((item) => item.status === "applied" || item.status === "undo-conflict");
    // The barrier is a precise point in the legacy stack. Let newer snapshots
    // unwind to it, then perform the semantic inverse before older snapshots.
    if (!entry || legacyUndoDepth !== entry.legacyUndoDepth) return null;
    return entry;
  }

  undoBarrier(documentId: string): number | null {
    const entries = this.byDocument.get(documentId) ?? [];
    return [...entries].reverse().find((item) =>
      item.status === "applied" || item.status === "undo-conflict" || item.status === "undo-pending",
    )?.legacyUndoDepth ?? null;
  }

  markUndoPending(documentId: string, changeId: string): boolean {
    return this.update(documentId, changeId, (entry) => {
      if (entry.status !== "applied" && entry.status !== "undo-conflict") return null;
      return { ...entry, status: "undo-pending" };
    });
  }

  markUndoConflict(documentId: string, changeId: string, conflict: UndoConflict): boolean {
    return this.update(documentId, changeId, (entry) => ({
      ...entry,
      status: "undo-conflict",
      conflict: { reason: conflict.reason, references: [...conflict.references] },
    }));
  }

  cancelUndoPending(documentId: string, changeId: string): boolean {
    return this.update(documentId, changeId, (entry) => {
      if (entry.status !== "undo-pending") return null;
      return { ...entry, status: entry.conflict ? "undo-conflict" : "applied" };
    });
  }

  markUndone(documentId: string, changeId: string, undoChangeId: string): boolean {
    return this.update(documentId, changeId, (entry) => {
      const next = { ...entry, status: "undone" as const, undoChangeId };
      delete next.conflict;
      return next;
    });
  }

  markReapplied(documentId: string, changeId: string): boolean {
    return this.update(documentId, changeId, (entry) => {
      if (entry.status !== "undone") return null;
      return { ...entry, status: "reapplied" };
    });
  }

  reapplyCandidate(documentId: string): IntentHistoryEntry | null {
    const entries = this.byDocument.get(documentId) ?? [];
    return [...entries].reverse().find((entry) => entry.status === "undone") ?? null;
  }

  markReapplyPending(documentId: string, changeId: string): boolean {
    return this.update(documentId, changeId, (entry) => {
      if (entry.status !== "undone") return null;
      return { ...entry, status: "reapply-pending" };
    });
  }

  cancelReapplyPending(documentId: string, changeId: string): boolean {
    return this.update(documentId, changeId, (entry) => {
      if (entry.status !== "reapply-pending") return null;
      return { ...entry, status: "undone" };
    });
  }

  recordReapplied(input: {
    documentId: string;
    originalChangeId: string;
    changeId: string;
    change: ChangeSet;
    inverse: SemanticInverse;
    sequence: number;
    legacyUndoDepth: number;
  }): IntentHistoryEntry | null {
    const original = (this.byDocument.get(input.documentId) ?? [])
      .find((entry) => entry.changeId === input.originalChangeId);
    if (!original || (original.status !== "undone" && original.status !== "reapply-pending")) return null;
    const entry = this.recordApplied({
      documentId: input.documentId,
      changeId: input.changeId,
      target: original.target,
      sequence: input.sequence,
      legacyUndoDepth: input.legacyUndoDepth,
      change: input.change,
      inverse: input.inverse,
    });
    this.markReapplied(input.documentId, input.originalChangeId);
    return entry;
  }

  clearDocument(documentId: string): void {
    this.byDocument.delete(documentId);
  }

  shiftLegacyUndoDepth(documentId: string, delta: -1 | 1): void {
    const entries = this.byDocument.get(documentId);
    if (!entries) return;
    this.byDocument.set(documentId, entries.map((entry) => {
      if (entry.status === "undone" || entry.status === "reapplied") return entry;
      return { ...entry, legacyUndoDepth: Math.max(0, entry.legacyUndoDepth + delta) };
    }));
  }

  private update(
    documentId: string,
    changeId: string,
    update: (entry: IntentHistoryEntry) => IntentHistoryEntry | null,
  ): boolean {
    const entries = this.byDocument.get(documentId);
    if (!entries) return false;
    const index = entries.findIndex((entry) => entry.changeId === changeId);
    if (index < 0) return false;
    const next = update(entries[index]!);
    if (!next) return false;
    const copy = [...entries];
    copy[index] = next;
    this.byDocument.set(documentId, copy);
    return true;
  }
}

export const intentHistory = new IntentHistory();
