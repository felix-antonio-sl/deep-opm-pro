import { expect, test } from "bun:test";
import { createOrderFixture } from "../../agent/fixtures/order";
import { exportarModelo, hidratarModelo } from "../../serializacion/json";
import { generarOpl } from "../../opl/generar";
import { applyRefinementOperation, refinementFrontier, type CreateRefinementOperation } from "./refinement";
import { applyChangeSet, validateInverse } from "./apply";

function fixture() {
  const { model, ids } = createOrderFixture();
  const operation: CreateRefinementOperation = {
    kind: "createRefinement", operationId: "refine-delivery", preconditions: [],
    entityId: ids.delivery, opdId: model.opdRaizId, refinementType: "descomposicion",
    question: "¿Cómo se realiza el reparto?", justification: "Explicitar sus pasos conservando el retiro como alternativa",
    expectedNextSeq: model.nextSeq,
  };
  return { model, ids, operation };
}

test("refinement proposals retain original frontier, XOR and guidance through serialization", () => {
  const { model, ids, operation } = fixture();
  const original = exportarModelo(model);
  const proposal = applyRefinementOperation(model, operation);
  expect(proposal.ok).toBe(true);
  if (!proposal.ok) return;
  expect(exportarModelo(model)).toBe(original);
  const frontier = new Set(refinementFrontier(proposal.value, ids.delivery));
  expect(refinementFrontier(model, ids.delivery).every((item) => frontier.has(item))).toBe(true);
  expect(proposal.value.abanicos).toEqual(model.abanicos);
  const reopened = hidratarModelo(exportarModelo(proposal.value));
  expect(reopened.ok).toBe(true);
  if (!reopened.ok) return;
  expect(JSON.stringify(reopened.value)).toContain(operation.question);
  expect(Object.keys(reopened.value.opds).length).toBe(Object.keys(model.opds).length + 1);
  expect(generarOpl(reopened.value, model.opdRaizId)).toEqual(generarOpl(proposal.value, model.opdRaizId));
});

test("stale sequence, existing refinement, and missing justification preserve the original", () => {
  const { model, ids, operation } = fixture();
  expect(applyRefinementOperation(model, { ...operation, expectedNextSeq: model.nextSeq - 1 }).ok).toBe(false);
  expect(applyRefinementOperation(model, { ...operation, entityId: ids.prepare }).ok).toBe(false);
  expect(applyRefinementOperation(model, { ...operation, justification: " " }).ok).toBe(false);
});

test("the shared kernel reverses a proposed refinement without deleting an unrelated later rename", () => {
  const { model, ids, operation } = fixture();
  const proposal = applyChangeSet(model, { id: "refinement", operations: [operation] });
  expect(proposal.kind).toBe("validated");
  if (proposal.kind !== "validated") return;
  const later = { ...proposal.candidate, entidades: { ...proposal.candidate.entidades,
    [ids.order]: { ...proposal.candidate.entidades[ids.order]!, nombre: "Pedido actualizado" } } };
  const inverse = validateInverse(later, proposal.inverse);
  expect(inverse.kind).toBe("applicable");
  if (inverse.kind !== "applicable") return;
  expect(inverse.candidate.entidades[ids.order]?.nombre).toBe("Pedido actualizado");
  expect(Object.keys(inverse.candidate.opds)).toEqual(Object.keys(model.opds));
  expect(inverse.candidate.abanicos).toEqual(model.abanicos);
});
