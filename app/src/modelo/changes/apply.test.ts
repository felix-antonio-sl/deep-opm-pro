import { expect, test, describe } from "bun:test";
import { generarOpl } from "../../opl/generar";
import { projectChangeDiff } from "../../agent/changeProjection";
import { extremoEntidad } from "../extremos";
import { crearModelo, crearObjeto, crearProceso, crearEstadosIniciales } from "../operaciones";
import type { ChangeSet } from "../../agent/contracts";
import type { Modelo } from "../tipos";
import { applyChangeSet } from "./apply";
import type { SemanticOperation } from "./types";
import { createOrderFixture } from "../../agent/fixtures/order";

describe("applyChangeSet", () => {
  test("rechaza atómicamente si la última operación falla", () => {
    let model = crearModelo();
    model = must(crearProceso(model, model.opdRaizId, { x: 80, y: 80 }, "Preparar"));
    model = must(crearObjeto(model, model.opdRaizId, { x: 300, y: 80 }, "Pedido"));
    const process = entity(model, "Preparar");
    const order = entity(model, "Pedido");
    const before = structuredClone(model);
    const result = applyChangeSet(model, change("rollback", [
      {
        ...base("create-process"), kind: "createProcess", id: "agent-process", opdId: model.opdRaizId,
        name: "Empacar", position: { x: 170, y: 80 },
      },
      {
        ...base("bad-link"), kind: "createProceduralLink", id: "agent-link", opdId: model.opdRaizId,
        source: extremoEntidad(process.id), destination: extremoEntidad(order.id), linkType: "agregacion",
      },
    ]));

    expect(result.kind).toBe("rejected");
    expect(model).toEqual(before);
    expect("candidate" in result).toBe(false);
  });

  test("respeta IDs estables y rechaza una colisión existente", () => {
    const model = crearModelo();
    const operation: SemanticOperation = {
      ...base("create"), kind: "createProcess", id: "agent-process-1", opdId: model.opdRaizId,
      name: "Empacar", position: { x: 120, y: 90 },
    };
    const one = applyChangeSet(model, change("stable", [operation]));
    const two = applyChangeSet(model, change("stable", [operation]));
    expect(one.kind).toBe("validated");
    expect(two.kind).toBe("validated");
    if (one.kind !== "validated" || two.kind !== "validated") return;
    expect(one.candidate).toEqual(two.candidate);
    expect(one.candidate.entidades["agent-process-1"]?.nombre).toBe("Empacar");

    const collision = applyChangeSet(one.candidate, change("collision", [operation]));
    expect(collision.kind).toBe("rejected");
    if (collision.kind === "rejected") expect(collision.code).toBe("id-collision");

    const appearanceId = Object.keys(one.candidate.opds[one.candidate.opdRaizId]?.apariencias ?? {})[0];
    expect(appearanceId).toBeDefined();
    if (!appearanceId) return;
    const appearanceCollision = applyChangeSet(one.candidate, change("appearance-collision", [{
      ...base("create"), kind: "createObject", id: appearanceId, opdId: one.candidate.opdRaizId,
      name: "Colisión visual", position: { x: 200, y: 100 },
    }]));
    expect(appearanceCollision).toMatchObject({ kind: "rejected", code: "id-collision" });
  });

  test("rechaza una escritura fuera del alcance entregado por el caller confiable", () => {
    const model = crearModelo();
    const result = applyChangeSet(model, change("scope", [{
      ...base("create"), kind: "createProcess", id: "outside", opdId: model.opdRaizId,
      name: "Fuera", position: { x: 80, y: 80 },
    }]), { scopeIds: new Set(["some-other-id"]) });
    expect(result).toMatchObject({ kind: "rejected", code: "out-of-scope", references: ["outside"] });
    expect(model.entidades.outside).toBeUndefined();
  });

  test("crea objeto, proceso y estado con IDs declarados; no permite estados en procesos", () => {
    let model = crearModelo();
    model = must(crearObjeto(model, model.opdRaizId, { x: 20, y: 30 }, "Pedido"));
    model = must(crearEstadosIniciales(model, entity(model, "Pedido").id)).modelo;
    const order = entity(model, "Pedido");
    model = must(crearProceso(model, model.opdRaizId, { x: 250, y: 30 }, "Empacar"));
    const process = entity(model, "Empacar");

    const added = applyChangeSet(model, change("state", [{
      ...base("state-create"), kind: "createState", id: "state-ready", entityId: order.id, name: "Listo",
    }]));
    expect(added.kind).toBe("validated");
    if (added.kind !== "validated") return;
    expect(added.candidate.estados["state-ready"]?.entidadId).toBe(order.id);

    const invalid = applyChangeSet(model, change("process-state", [{
      ...base("process-state-create"), kind: "createState", id: "state-on-process", entityId: process.id, name: "Inválido",
    }]));
    expect(invalid.kind).toBe("rejected");
  });

  test("crea enlaces procedurales con el ID estable y proyecta el efecto", () => {
    const fixture = createOrderFixture();
    const result = applyChangeSet(fixture.model, change("create-link", [{
      ...base("link-create"), kind: "createProceduralLink", id: "agent-link-result",
      opdId: fixture.model.opdRaizId,
      source: { kind: "entidad", id: fixture.ids.delivery },
      destination: { kind: "entidad", id: fixture.ids.order },
      linkType: "resultado",
    }]));
    expect(result.kind).toBe("validated");
    if (result.kind !== "validated") return;
    expect(result.candidate.enlaces["agent-link-result"]).toMatchObject({
      id: "agent-link-result", tipo: "resultado", origenId: { id: fixture.ids.delivery }, destinoId: { id: fixture.ids.order },
    });
    expect(projectChangeDiff(fixture.model, result.candidate, result.diff).opl.find((item) => item.opdId === fixture.model.opdRaizId)?.after.join("\n")).toContain("genera **Pedido**");
  });

  test("mantiene el XOR, el refinamiento y la proyección OPL del fixture del pedido", () => {
    const fixture = createOrderFixture();
    const beforeLines = generarOpl(fixture.model);
    const result = applyChangeSet(fixture.model, change("preserve", [{
      ...base("rename"), kind: "renameEntity", entityId: fixture.ids.prepare,
      beforeName: "Preparar pedido", afterName: "Preparar y revisar pedido",
    }]));
    expect(result.kind).toBe("validated");
    if (result.kind !== "validated") return;
    const fan = Object.values(result.candidate.abanicos ?? {}).find((item) => item.operador === "XOR");
    expect(fan?.enlaceIds).toContain(fixture.ids.pickupLink);
    expect(fan?.enlaceIds).toContain(fixture.ids.deliveryLink);
    expect(result.candidate.entidades[fixture.ids.prepare]?.refinamientos?.descomposicion?.opdId).toBe(fixture.ids.refinementOpd);
    const projection = projectChangeDiff(fixture.model, result.candidate, result.diff);
    const rootOpl = projection.opl.find((item) => item.opdId === fixture.model.opdRaizId);
    expect(rootOpl?.before).toEqual(beforeLines);
    expect(rootOpl?.before.join("\n")).toContain("exactamente uno");
    expect(rootOpl?.after.join("\n")).toContain("exactamente uno");
    expect(rootOpl?.after.join("\n")).toContain("Preparar y revisar pedido");
    expect(projection.opl.some((item) => item.after.join("\n").includes("descompone"))).toBe(true);
  });
});

function change(id: string, operations: SemanticOperation[]): ChangeSet {
  return {
    id,
    taskId: "task-test",
    actorId: "test",
    intentVersion: 1,
    target: { kind: "current", documentId: "doc-test" },
    base: { revision: 1, semanticHash: "test", workingCopyHash: "test", clientSequence: 0, profileVersion: "test" },
    operations,
    readIds: [],
    writeIds: [],
    dependencies: [],
    explanation: "synthetic test",
  };
}

function base(operationId: string) {
  return { operationId, preconditions: [] };
}

function entity(model: Modelo, name: string) {
  const value = Object.values(model.entidades).find((item) => item.nombre === name);
  if (!value) throw new Error(`Falta entidad ${name}`);
  return value;
}

function must<T>(result: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!result.ok) throw new Error(result.error);
  return result.value;
}
