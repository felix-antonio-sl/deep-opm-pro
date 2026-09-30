import { describe, expect, test } from "bun:test";
import { crearEstadosIniciales, crearEnlace, crearModelo, crearObjeto, crearProceso } from "../operaciones";
import type { Modelo, Resultado } from "../tipos";
import { applyChangeSet, validateInverse } from "../changes/apply";
import type { SemanticOperation } from "../changes/types";
import { preparePieceOperation, createPieceManifest, recordPieceCopy } from "./piece";

function must<T>(result: Resultado<T>): T {
  if (!result.ok) throw new Error(result.error);
  return result.value;
}

function fixture(): { model: Modelo; pieceId: string; externalId: string } {
  let model = crearModelo("Biblioteca");
  model = { ...model, id: "library" };
  model = must(crearObjeto(model, model.opdRaizId, { x: 20, y: 30 }, "Registro"));
  model = must(crearProceso(model, model.opdRaizId, { x: 200, y: 30 }, "Validar"));
  const [objectId, processId] = Object.keys(model.entidades);
  model = must(crearEnlace(model, model.opdRaizId, { kind: "entidad", id: objectId! }, { kind: "entidad", id: processId! }, "consumo"));
  return { model, pieceId: objectId!, externalId: processId! };
}

describe("reuse/piece manifest", () => {
  test("declares function, direct boundary, source version, profile, and origin lineage", () => {
    const { model, pieceId, externalId } = fixture();
    const result = createPieceManifest({ model, pieceId, function: "Representar registro utilizable", sourceVersion: "lib-r7" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toMatchObject({
      identity: { modelId: "library", pieceId },
      function: "Representar registro utilizable",
      boundary: {
        scope: "direct-incidence",
          roles: [{ entityId: externalId, linkType: "consumo", role: "source" }],
      },
      version: { id: "lib-r7", contentHash: expect.stringMatching(/^fnv1a-/) },
      profile: { id: "entity-neighborhood", version: "1" },
      lineage: [{ identity: { modelId: "library", pieceId }, relation: "source" }],
    });
  });

  test("requires an explicit function and rejects a missing or non-piece entity", () => {
    const { model, pieceId } = fixture();
    expect(createPieceManifest({ model, pieceId, function: "  " })).toMatchObject({ ok: false });
    expect(createPieceManifest({ model, pieceId: "missing", function: "Use" })).toMatchObject({ ok: false });
  });

  test("records a copy as a separate identity with source lineage, without a live reference", () => {
    const { model, pieceId } = fixture();
    const source = createPieceManifest({ model, pieceId, function: "Representar registro" });
    expect(source.ok).toBe(true);
    if (!source.ok) return;
    const copied = recordPieceCopy(source.value, { modelId: "work-doc", pieceId: "o-48" }, { id: "work-r3", contentHash: "copy-hash" });
    expect(copied.identity).toEqual({ modelId: "work-doc", pieceId: "o-48" });
    expect(copied.lineage).toHaveLength(2);
    expect(copied.lineage[0]?.relation).toBe("source");
    expect(copied.lineage[1]).toMatchObject({ relation: "copy", identity: copied.identity, version: copied.version });
  });

  test("uses the semantic piece signature, which changes when the member state changes", () => {
    const { model: before, pieceId } = fixture();
    const stateful = must(crearEstadosIniciales(before, pieceId)).modelo;
    const oldManifest = createPieceManifest({ model: before, pieceId, function: "Representar registro" });
    const newManifest = createPieceManifest({ model: stateful, pieceId, function: "Representar registro" });
    expect(oldManifest.ok && newManifest.ok).toBe(true);
    if (!oldManifest.ok || !newManifest.ok) return;
    expect(oldManifest.value.version.contentHash).not.toBe(newManifest.value.version.contentHash);
  });

  test("prepares an independent copy with fresh IDs and durable source lineage", () => {
    const source = fixture();
    source.model = must(crearEstadosIniciales(source.model, source.pieceId)).modelo;
    let target = crearModelo("Documento propio");
    target = must(crearProceso(target, target.opdRaizId, { x: 400, y: 40 }, "Consumir recurso"));
    const prepared = preparePieceOperation(target, {
      kind: "copy", source: source.model, pieceId: source.pieceId, function: "Provee un recurso utilizable",
      target: { opdId: target.opdRaizId, position: { x: 80, y: 80 } },
    });
    expect(prepared.ok).toBe(true);
    if (!prepared.ok) return;
    const result = applyChangeSet(target, { id: "copy-piece", operations: prepared.value.operations });
    expect(result.kind).toBe("validated");
    if (result.kind !== "validated") return;
    const copiedId = Object.keys(result.candidate.entidades).find((id) => !Object.hasOwn(target.entidades, id));
    expect(copiedId).toBeDefined();
    if (!copiedId) return;
    expect(copiedId).not.toBe(source.pieceId);
    expect(Object.values(result.candidate.estados).filter((state) => state.entidadId === copiedId)).toHaveLength(2);
    expect(result.candidate.pieceLineage?.[copiedId]).toMatchObject({
      function: "Provee un recurso utilizable",
      lineage: [
        { identity: { modelId: "library", pieceId: source.pieceId }, relation: "source" },
        { identity: { modelId: target.id, pieceId: copiedId }, relation: "copy" },
      ],
    });
    const inverse = validateInverse(result.candidate, result.inverse);
    expect(inverse.kind).toBe("applicable");
    if (inverse.kind === "applicable") expect(inverse.candidate.pieceLineage?.[copiedId]).toBeUndefined();
  });

  test("fresh ID allocation skips a collision in a legacy nextSeq", () => {
    const source = fixture();
    const withState = must(crearEstadosIniciales(source.model, source.pieceId)).modelo;
    const targetBase = crearModelo("Documento propio");
    let target = must(crearObjeto(targetBase, targetBase.opdRaizId, { x: 0, y: 0 }, "Existente"));
    target = { ...target, nextSeq: 1 };
    const prepared = preparePieceOperation(target, {
      kind: "copy", source: withState, pieceId: source.pieceId, function: "Provee un recurso utilizable",
      target: { opdId: target.opdRaizId, position: { x: 80, y: 80 } },
    });
    expect(prepared.ok).toBe(true);
    if (!prepared.ok) return;
    const result = applyChangeSet(target, { id: "copy-collision", operations: prepared.value.operations });
    expect(result.kind).toBe("validated");
    if (result.kind !== "validated") return;
    expect(result.candidate.entidades["o-1"]?.nombre).toBe("Existente");
    expect(Object.keys(result.candidate.entidades).filter((id) => id !== "o-1")).toContain("o-2");
    expect(Object.values(result.candidate.estados).filter((state) => state.entidadId === "o-2")).toHaveLength(2);
  });

  test("a read-only Piece reference rejects direct object, state, link, rename, and delete changes in the shared kernel", () => {
    const source = fixture();
    let target = crearModelo("Documento propio");
    target = must(crearProceso(target, target.opdRaizId, { x: 400, y: 40 }, "Consumir recurso"));
    const rootEntity = Object.values(target.entidades)[0]!;
    const prepared = preparePieceOperation(target, {
      kind: "reference", source: source.model, pieceId: source.pieceId, function: "Provee un recurso utilizable",
      target: { opdId: target.opdRaizId, anchorEntityId: rootEntity.id },
    });
    expect(prepared.ok).toBe(true);
    if (!prepared.ok) return;
    const connected = applyChangeSet(target, { id: "reference-piece", operations: prepared.value.operations });
    expect(connected.kind).toBe("validated");
    if (connected.kind !== "validated") return;
    const ref = Object.values(connected.candidate.submodelos ?? {}).find((entry) => entry.piece);
    expect(ref?.piece?.identity).toEqual({ modelId: "library", pieceId: source.pieceId });
    expect(ref?.opdVistaId).toBeDefined();
    if (!ref?.opdVistaId) return;
    const materializedId = Object.values(ref.materializacion?.entidadMap ?? {})[0];
    expect(materializedId).toBeDefined();
    if (!materializedId) return;
    const rejected = [
      { kind: "renameEntity", operationId: "rename-projected", preconditions: [], entityId: materializedId, beforeName: "Registro", afterName: "Otra cosa" },
      { kind: "deleteEntity", operationId: "delete-projected", preconditions: [], entityId: materializedId },
      { kind: "createState", operationId: "state-projected", preconditions: [{ kind: "idAbsent", id: "state-local" }], id: "state-local", entityId: materializedId, name: "Nuevo estado" },
      { kind: "createObject", operationId: "object-in-projection", preconditions: [{ kind: "idAbsent", id: "object-local" }, { kind: "opdExists", id: ref.opdVistaId }], id: "object-local", opdId: ref.opdVistaId, name: "Objeto local", position: { x: 20, y: 20 } },
      { kind: "createProceduralLink", operationId: "link-in-projection", preconditions: [{ kind: "idAbsent", id: "link-local" }, { kind: "opdExists", id: ref.opdVistaId }], id: "link-local", opdId: ref.opdVistaId, source: { kind: "entidad", id: materializedId }, destination: { kind: "entidad", id: rootEntity.id }, linkType: "consumo" },
    ] satisfies SemanticOperation[];
    for (const operation of rejected) {
      const result = applyChangeSet(connected.candidate, { id: operation.operationId, operations: [operation] });
      expect(result).toMatchObject({ kind: "rejected", code: "external-owned" });
    }
  });

  test("updates a protected reference only against the expected version and keeps a reversible diff", () => {
    const source = fixture();
    let target = crearModelo("Documento propio");
    target = must(crearProceso(target, target.opdRaizId, { x: 400, y: 40 }, "Consumir recurso"));
    const rootEntity = Object.values(target.entidades)[0]!;
    const reference = preparePieceOperation(target, {
      kind: "reference", source: source.model, pieceId: source.pieceId, function: "Provee un recurso utilizable",
      target: { opdId: target.opdRaizId, anchorEntityId: rootEntity.id },
    });
    if (!reference.ok) throw new Error(reference.error);
    const connected = applyChangeSet(target, { id: "reference-for-update", operations: reference.value.operations });
    if (connected.kind !== "validated") throw new Error(connected.message);
    const ref = Object.values(connected.candidate.submodelos ?? {}).find((entry) => entry.piece)!;
    const sourcePiece = source.model.entidades[source.pieceId]!;
    const changedSource = { ...source.model, entidades: { ...source.model.entidades, [source.pieceId]: { ...sourcePiece, descripcion: "Una descripción nueva" } } };
    const prepared = preparePieceOperation(connected.candidate, {
      kind: "update", source: changedSource, pieceId: source.pieceId, function: "Provee un recurso utilizable",
      target: { referenceId: ref.id, expectedSourceVersion: ref.piece!.version.id },
    });
    expect(prepared.ok).toBe(true);
    if (!prepared.ok) return;
    const updated = applyChangeSet(connected.candidate, { id: "update-piece", operations: prepared.value.operations });
    expect(updated.kind).toBe("validated");
    if (updated.kind !== "validated") return;
    const nextRef = updated.candidate.submodelos?.[ref.id];
    expect(nextRef?.piece?.version.contentHash).not.toBe(ref.piece!.version.contentHash);
    expect(nextRef?.estado).toBe("cargado-sincronizado");
    const inverse = validateInverse(updated.candidate, updated.inverse);
    expect(inverse.kind).toBe("applicable");
    if (inverse.kind === "applicable") {
      expect(inverse.candidate.submodelos?.[ref.id]?.piece?.version.contentHash).toBe(ref.piece!.version.contentHash);
    }
    expect(preparePieceOperation(connected.candidate, {
      kind: "update", source: changedSource, pieceId: source.pieceId, function: "Provee un recurso utilizable",
      target: { referenceId: ref.id, expectedSourceVersion: "stale-version" },
    })).toMatchObject({ ok: false });
  });

  test("requires an explicit review proposal when the reference boundary changes", () => {
    const source = fixture();
    let target = crearModelo("Documento propio");
    target = must(crearProceso(target, target.opdRaizId, { x: 400, y: 40 }, "Consumir recurso"));
    const rootEntity = Object.values(target.entidades)[0]!;
    const reference = preparePieceOperation(target, {
      kind: "reference", source: source.model, pieceId: source.pieceId, function: "Provee un recurso utilizable",
      target: { opdId: target.opdRaizId, anchorEntityId: rootEntity.id },
    });
    if (!reference.ok) throw new Error(reference.error);
    const connected = applyChangeSet(target, { id: "reference-for-boundary", operations: reference.value.operations });
    if (connected.kind !== "validated") throw new Error(connected.message);
    const ref = Object.values(connected.candidate.submodelos ?? {}).find((entry) => entry.piece)!;
    const other = must(crearProceso(source.model, source.model.opdRaizId, { x: 600, y: 40 }, "Otro proceso"));
    const otherId = Object.values(other.entidades).find((entity) => entity.nombre === "Otro proceso")!.id;
    const [link] = Object.values(other.enlaces);
    const changedSource = {
      ...other,
      enlaces: { ...other.enlaces, [link!.id]: { ...link!, destinoId: { kind: "entidad" as const, id: otherId } } },
    };
    const rejected = preparePieceOperation(connected.candidate, {
      kind: "update", source: changedSource, pieceId: source.pieceId, function: "Provee un recurso utilizable",
      target: { referenceId: ref.id, expectedSourceVersion: ref.piece!.version.id },
    });
    expect(rejected).toMatchObject({ ok: false, error: expect.stringContaining("frontera") });
    const prepared = preparePieceOperation(connected.candidate, {
      kind: "update", source: changedSource, pieceId: source.pieceId, function: "Provee un recurso utilizable",
      target: { referenceId: ref.id, expectedSourceVersion: ref.piece!.version.id }, includeBoundaryChange: true,
    });
    expect(prepared.ok).toBe(true);
    if (!prepared.ok) return;
    expect(prepared.value.comparison?.changed).toContain("boundary");
    const updated = applyChangeSet(connected.candidate, { id: "boundary-review", operations: prepared.value.operations });
    expect(updated.kind).toBe("validated");
  });
});
