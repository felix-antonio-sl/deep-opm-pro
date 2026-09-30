import { describe, expect, test } from "bun:test";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "../operaciones";
import { applyChangeSet, validateInverse } from "./apply";
import { generarOpl } from "../../opl/generar";
import { exportarModelo, hidratarModelo } from "../../serializacion/json";
import type { CreateXorExclusionOperation } from "./xor";
import { aplicarXor, modeloConRamas, must } from "./xor.testHelpers";

describe("operación de exclusión XOR", () => {
  test("crea un abanico nuevo con ID estable y ramas exactas", () => {
    const { model, links } = modeloConRamas(["retiro", "distribución"]);

    const result = aplicarXor(model, "xor-pedido-1", model.opdRaizId, links);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.abanicos?.["xor-pedido-1"]).toMatchObject({
      id: "xor-pedido-1",
      opdId: model.opdRaizId,
      operador: "XOR",
      enlaceIds: links,
    });
  });

  test("rechaza miembros ya agrupados y preserva el abanico previo", () => {
    const { model, links } = modeloConRamas(["retiro", "distribución", "ambos"]);
    const existing = must(aplicarXor(model, "xor-existente", model.opdRaizId, links.slice(0, 2)));

    const result = aplicarXor(existing, "xor-nuevo", model.opdRaizId, [links[0]!, links[2]!]);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("no modifica grupos existentes");
    expect(existing.abanicos?.["xor-existente"]?.enlaceIds).toEqual(links.slice(0, 2));
  });

  test("rechaza IDs duplicados, enlaces repetidos, enlaces ausentes y grupos del mismo puerto", () => {
    const { model, links } = modeloConRamas(["A", "B", "C", "D"]);
    const existing = must(aplicarXor(model, "xor-existente", model.opdRaizId, links.slice(0, 2)));
    const implicitMerge = aplicarXor(existing, "xor-otro", model.opdRaizId, links.slice(2));
    const duplicateLink = aplicarXor(model, "xor-repeat", model.opdRaizId, [links[0]!, links[0]!]);
    const missingLink = aplicarXor(model, "xor-missing", model.opdRaizId, [links[0]!, "missing-link"]);
    const idCollision = aplicarXor(model, model.entidades[Object.keys(model.entidades)[0]!]!.id, model.opdRaizId, links.slice(0, 2));

    expect(implicitMerge.ok).toBe(false);
    if (!implicitMerge.ok) expect(implicitMerge.error).toContain("Ya existe un abanico");
    expect(duplicateLink.ok).toBe(false);
    expect(missingLink.ok).toBe(false);
    if (!missingLink.ok) expect(missingLink.error).toContain("no existe");
    expect(idCollision.ok).toBe(false);
    if (!idCollision.ok) expect(idCollision.error).toContain("ID ya existe");
  });

  test("rechaza abanicos de direcciones incompatibles o enlaces heterogéneos", () => {
    let model = crearModelo();
    model = must(crearProceso(model, model.opdRaizId, { x: 40, y: 80 }, "Proceso"));
    const processId = Object.values(model.entidades).find((entity) => entity.nombre === "Proceso")!.id;
    model = must(crearObjeto(model, model.opdRaizId, { x: 240, y: 20 }, "A"));
    const a = Object.values(model.entidades).find((entity) => entity.nombre === "A")!.id;
    model = must(crearObjeto(model, model.opdRaizId, { x: 240, y: 140 }, "B"));
    const b = Object.values(model.entidades).find((entity) => entity.nombre === "B")!.id;
    model = must(crearEnlace(model, model.opdRaizId, processId, a, "resultado"));
    model = must(crearEnlace(model, model.opdRaizId, b, processId, "consumo"));
    const links = Object.keys(model.enlaces);
    const heterogeneous = aplicarXor(model, "xor-invalid", model.opdRaizId, links);

    expect(heterogeneous.ok).toBe(false);
    if (!heterogeneous.ok) expect(heterogeneous.error).toContain("homogéneos");
  });

  test("rechaza enlaces del mismo tipo cuyo puerto compartido apunta en direcciones opuestas", () => {
    const { model, links } = modeloConRamas(["A", "B"]);
    const second = model.enlaces[links[1]!]!;
    const reversed = {
      ...model,
      enlaces: {
        ...model.enlaces,
        [second.id]: { ...second, origenId: second.destinoId, destinoId: second.origenId },
      },
    };

    const result = aplicarXor(reversed, "xor-opposite", model.opdRaizId, links);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("puerto");
  });

  test("integra el kernel, proyecta OPL, deshace, reabre y vuelve a aplicar el XOR", () => {
    const { model, links } = modeloConRamas(["retiro", "distribución"]);
    const operation = {
      kind: "createXorExclusion" as const,
      operationId: "operation:xor-order",
      preconditions: [
        { kind: "opdExists" as const, id: model.opdRaizId },
        { kind: "idAbsent" as const, id: "xor-order" },
      ],
      id: "xor-order",
      opdId: model.opdRaizId,
      linkIds: links,
    };

    const validated = applyChangeSet(model, { id: "change-xor-order", operations: [operation] }, { scopeIds: new Set([operation.id]) });
    expect(validated.kind).toBe("validated");
    if (validated.kind !== "validated") return;
    expect(validated.candidate.abanicos?.[operation.id]?.operador).toBe("XOR");
    expect(validated.readIds).toEqual(expect.arrayContaining([
      operation.opdId, operation.id, ...links,
      ...links.flatMap((id) => [model.enlaces[id]!.origenId.id, model.enlaces[id]!.destinoId.id]),
    ]));
    expect(validated.writeIds).toEqual([operation.id]);
    expect(generarOpl(validated.candidate, operation.opdId).join("\n")).toContain("exactamente uno");

    const serialized = must(hidratarModelo(exportarModelo(validated.candidate)));
    expect(serialized.abanicos?.[operation.id]?.enlaceIds).toEqual(links);
    const reversed = validateInverse(serialized, validated.inverse);
    expect(reversed.kind).toBe("applicable");
    if (reversed.kind !== "applicable") return;
    expect(reversed.candidate.abanicos?.[operation.id]).toBeUndefined();
    const reopened = must(hidratarModelo(exportarModelo(reversed.candidate)));
    const reapplied = applyChangeSet(reopened, { id: "change-xor-reapplied", operations: [operation] }, { scopeIds: new Set([operation.id]) });
    expect(reapplied.kind).toBe("validated");
    if (reapplied.kind === "validated") expect(reapplied.candidate.abanicos?.[operation.id]?.operador).toBe("XOR");
  });

  test("conserva errores claros ante payload semántico mal formado", () => {
    const { model, links } = modeloConRamas(["A", "B"]);
    const malformed = {
      kind: "createXorExclusion",
      operationId: "bad-xor",
      preconditions: [],
      id: "bad-xor",
      opdId: model.opdRaizId,
      linkIds: "not-an-array",
    } as unknown as CreateXorExclusionOperation;

    const result = applyChangeSet(model, { id: "bad-xor-change", operations: [malformed] });

    expect(result.kind).toBe("rejected");
    if (result.kind === "rejected") expect(result.message).toContain("al menos dos enlaces");
    expect(Object.keys(model.abanicos ?? {})).toHaveLength(0);
    expect(links).toHaveLength(2);
  });
});
