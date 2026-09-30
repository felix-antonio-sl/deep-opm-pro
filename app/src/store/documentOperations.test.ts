import { afterEach, describe, expect, test } from "bun:test";
import type { Base } from "../agent/contracts";
import { crearModelo } from "../modelo/operaciones";
import { DocumentOperationsController, isDefiniteCommitRejection, mergePreparedModelEdit, replayPreparedDocumentEdits, resolveCommitFailure, resolveUnknownReceipt } from "./documentOperations";

const controllers: DocumentOperationsController[] = [];
afterEach(() => {
  controllers.length = 0;
});

function base(clientSequence = 0): Base {
  return {
    revision: 4,
    semanticHash: "semantic-hash",
    workingCopyHash: "working-hash",
    clientSequence,
    profileVersion: "profile-v1",
  };
}

function controller(documentId = "doc-a", clientSequence = 0) {
  const value = new DocumentOperationsController({ documentId, clientSequence });
  controllers.push(value);
  return value;
}

describe("DocumentOperationsController", () => {
  test("una edición humana confirmada antes de la propuesta vuelve obsoleta su base", () => {
    const queue = controller();
    expect(queue.recordAppliedEdit()).toBe(1);
    expect(queue.beginReservation("change-1", base(0)).kind).toBe("stale-base");
    expect(queue.snapshot().reservation).toBeNull();
  });

  test("conserva ediciones humanas preparadas durante la reserva en orden", () => {
    const queue = controller();
    const model = crearModelo();
    const begun = queue.beginReservation("change-1", base(), 100);
    expect(begun.kind).toBe("reserved");

    const first = queue.prepareHumanEdit({ base: model, candidate: model, payload: "first", now: 101 });
    const second = queue.prepareHumanEdit({ base: model, candidate: model, payload: "second", now: 102 });
    expect(first?.id).toBe("doc-a:pending:1");
    expect(second?.id).toBe("doc-a:pending:2");
    expect(queue.snapshot().pendingEdits.map((edit) => edit.payload)).toEqual(["first", "second"]);

    const pending = queue.finishReservation("change-1");
    expect(pending?.map((edit) => edit.payload)).toEqual(["first", "second"]);
    expect(queue.snapshot().reservation).toBeNull();
    expect(queue.snapshot().pendingEdits).toHaveLength(0);
  });

  test("edición preparada mientras se solicita el permiso queda en cola hasta recibirlo", async () => {
    const queue = controller();
    const model = crearModelo();
    let releaseGrant!: (value: { grant: { id: string }; expiresAt: number }) => void;
    const request = queue.prepareGrant({
      changeId: "change-1",
      base: base(),
      now: () => 100,
      issueGrant: () => new Promise((resolve) => { releaseGrant = resolve; }),
    });
    queue.prepareHumanEdit({ base: model, candidate: model, payload: "human", now: 101 });
    expect(queue.snapshot().reservation?.status).toBe("preparing");
    expect(queue.snapshot().pendingEdits).toHaveLength(1);

    releaseGrant({ grant: { id: "grant-1" }, expiresAt: 200 });
    expect(await request).toMatchObject({ kind: "grant-ready", reservation: { status: "granted" } });
    expect(queue.snapshot().pendingEdits[0]?.payload).toBe("human");
  });

  test("grant vence y se consume localmente una sola vez", () => {
    const queue = controller();
    queue.beginReservation("change-1", base(), 100);
    expect(queue.attachGrant("change-1", { id: "grant-1" }, 200, 110)).toBe(true);
    expect(queue.consumeGrant("change-1", 199)).toEqual({ id: "grant-1" });
    expect(queue.consumeGrant("change-1", 199)).toBeNull();
    expect(queue.snapshot().reservation?.status).toBe("unknown");
    expect(queue.snapshot().reservation?.commitSubmitted).toBe(true);
  });

  test("el segundo intento no libera la reserva que ya tiene un commit enviado", () => {
    const queue = controller();
    queue.beginReservation("change-1", base(), 100);
    queue.attachGrant("change-1", { id: "grant-1" }, 200, 110);
    const first = queue.claimCommitGrant("change-1", 120);
    const second = queue.claimCommitGrant("change-1", 121);

    expect(first).toEqual({ kind: "claimed", grant: { id: "grant-1" } });
    expect(second).toEqual({ kind: "already-submitted" });
    expect(queue.snapshot().reservation).toMatchObject({ changeId: "change-1", status: "unknown", commitSubmitted: true });
  });

  test("un timeout al pedir grant libera la reserva porque todavía no se envió commit", async () => {
    const queue = controller();
    const result = await queue.prepareGrant({
      changeId: "change-1",
      base: base(),
      issueGrant: async () => { throw new Error("grant request timed out"); },
    });

    expect(result.kind).toBe("unknown");
    expect(queue.snapshot().reservation).toBeNull();
    expect("pendingEdits" in result ? result.pendingEdits : []).toEqual([]);
  });

  test("un resultado de red desconocido mantiene la reserva hasta resolver el recibo", () => {
    const queue = controller();
    queue.beginReservation("change-1", base(), 100);
    expect(queue.markOutcomeUnknown("change-1")).toBe(true);
    expect(queue.snapshot().reservation?.status).toBe("unknown");
    expect(queue.beginReservation("change-2", base(), 101).kind).toBe("busy");
    expect(queue.finishReservation("change-1")).toEqual([]);
    expect(queue.beginReservation("change-2", base(), 102).kind).toBe("reserved");
  });

  test("una fecha de expiración pasada no permite instalar un grant", () => {
    const queue = controller();
    queue.beginReservation("change-1", base(), 100);
    expect(queue.attachGrant("change-1", { id: "grant-1" }, 99)).toBe(false);
    expect(queue.snapshot().reservation?.status).toBe("unknown");
    expect(queue.snapshot().reservation?.commitSubmitted).toBe(false);
    expect(queue.releaseReservation("change-1")).toEqual([]);
    expect(queue.snapshot().reservation).toBeNull();
  });

  test("consulta recibo ante timeout y conserva la reserva si aún no hay recibo", async () => {
    const queue = controller();
    queue.beginReservation("change-1", base(), 100);
    let resolveLookup!: (value: { revision: number } | null) => void;
    const lookup = new Promise<{ revision: number } | null>((resolve) => { resolveLookup = resolve; });
    const pending = resolveUnknownReceipt({
      controller: queue,
      changeId: "change-1",
      lookup: () => lookup,
      reconcile: (receipt) => receipt.revision,
    });
    expect(queue.snapshot().reservation?.status).toBe("unknown");
    resolveLookup(null);
    expect(await pending).toEqual({ kind: "unknown" });
    expect(queue.snapshot().reservation?.changeId).toBe("change-1");
  });

  test("un 500 posterior al envío consulta e integra el recibo una sola vez", async () => {
    const queue = controller();
    queue.beginReservation("change-1", base(), 100);
    queue.attachGrant("change-1", { id: "grant-1" }, 200, 110);
    expect(queue.claimCommitGrant("change-1", 120).kind).toBe("claimed");
    const receipt = { revision: 5 };
    let reconciliations = 0;

    const result = await resolveCommitFailure({
      error: { status: 500 },
      controller: queue,
      changeId: "change-1",
      release: () => { queue.releaseReservation("change-1"); },
      lookup: async () => receipt,
      reconcile: (found) => {
        reconciliations += 1;
        queue.finishReservation("change-1");
        return found.revision;
      },
    });

    expect(isDefiniteCommitRejection({ status: 500 })).toBe(false);
    expect(result).toEqual({ kind: "resolved", value: 5 });
    expect(reconciliations).toBe(1);
    expect(queue.snapshot().reservation).toBeNull();
  });

  test("un 500 sin recibo mantiene la reserva y no libera el fence", async () => {
    const queue = controller();
    queue.beginReservation("change-1", base(), 100);
    queue.attachGrant("change-1", { id: "grant-1" }, 200, 110);
    queue.claimCommitGrant("change-1", 120);
    let releases = 0;

    const result = await resolveCommitFailure({
      error: { status: 500 },
      controller: queue,
      changeId: "change-1",
      release: () => { releases += 1; queue.releaseReservation("change-1"); },
      lookup: async () => null,
      reconcile: (found: { revision: number }) => found.revision,
    });

    expect(result).toEqual({ kind: "unknown" });
    expect(releases).toBe(0);
    expect(queue.snapshot().reservation).toMatchObject({ changeId: "change-1", status: "unknown", commitSubmitted: true });
  });

  test("408 y 5xx son ambiguos; rechazos del contrato sí liberan", () => {
    expect(isDefiniteCommitRejection({ status: 408 })).toBe(false);
    expect(isDefiniteCommitRejection({ status: 500 })).toBe(false);
    expect(isDefiniteCommitRejection({ status: 400 })).toBe(true);
    expect(isDefiniteCommitRejection({ status: 409 })).toBe(true);
  });
});

describe("mergePreparedModelEdit", () => {
  test("preserva un cambio concurrente en otro campo y reporta conflicto en el mismo campo", () => {
    const baseModel = crearModelo();
    const id = "entity-a";
    const original = { id, tipo: "objeto" as const, nombre: "A", esencia: "informacional" as const, afiliacion: "sistemica" as const, descripcion: "base" };
    const base = {
      ...baseModel,
      entidades: { ...baseModel.entidades, [id]: original },
    };
    const candidate = {
      ...base,
      entidades: { ...base.entidades, [id]: { ...original, nombre: "B" } },
    };
    const current = {
      ...base,
      entidades: { ...base.entidades, [id]: { ...original, descripcion: "Nota humana" } },
    };

    const merged = mergePreparedModelEdit(base, candidate, current);
    expect(merged.kind).toBe("merged");
    if (merged.kind === "merged") {
      expect(merged.model.entidades[id]).toEqual({ ...original, nombre: "B", descripcion: "Nota humana" });
    }

    const collision = {
      ...base,
      entidades: { ...base.entidades, [id]: { ...original, nombre: "Nombre humano" } },
    };
    const conflict = mergePreparedModelEdit(base, candidate, collision);
    expect(conflict.kind).toBe("conflict");
    if (conflict.kind === "conflict") expect(conflict.paths).toContain(`modelo.entidades.${id}.nombre`);
  });

  test("integra el recibo remoto y revalida las ediciones humanas en orden", () => {
    const empty = crearModelo();
    const first = { id: "entity-a", tipo: "objeto" as const, nombre: "A", esencia: "informacional" as const, afiliacion: "sistemica" as const };
    const second = { id: "entity-b", tipo: "objeto" as const, nombre: "B", esencia: "informacional" as const, afiliacion: "sistemica" as const };
    const baseModel = { ...empty, entidades: { [first.id]: first, [second.id]: second } };
    const humanDraft = {
      ...baseModel,
      entidades: { ...baseModel.entidades, [second.id]: { ...second, descripcion: "Nota humana" } },
    };
    const remoteReceipt = {
      ...baseModel,
      entidades: { ...baseModel.entidades, [first.id]: { ...first, nombre: "Agente" } },
    };
    const edit = {
      id: "doc-a:pending:1",
      base: baseModel,
      candidate: humanDraft,
      payload: "human",
      preparedAt: 1,
    };

    const replayed = replayPreparedDocumentEdits(remoteReceipt, [edit]);
    expect(replayed.applied).toHaveLength(1);
    expect(replayed.conflicts).toHaveLength(0);
    expect(replayed.model.entidades[first.id]?.nombre).toBe("Agente");
    expect(replayed.model.entidades[second.id]?.descripcion).toBe("Nota humana");

    const overlappingDraft = {
      ...baseModel,
      entidades: { ...baseModel.entidades, [first.id]: { ...first, nombre: "Nombre humano" } },
    };
    const conflict = replayPreparedDocumentEdits(remoteReceipt, [{ ...edit, candidate: overlappingDraft }]);
    expect(conflict.applied).toHaveLength(0);
    expect(conflict.conflicts[0]?.edit.candidate.entidades[first.id]?.nombre).toBe("Nombre humano");
    expect(conflict.model.entidades[first.id]?.nombre).toBe("Agente");
  });
});
