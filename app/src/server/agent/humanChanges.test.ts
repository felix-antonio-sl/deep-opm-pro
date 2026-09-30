import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { crearModelo } from "../../modelo/operaciones";
import { construirModeloPersistido } from "../../persistencia/modelos";
import { carpetaIdDeJson, exportarModelo, hidratarModelo } from "../../serializacion/json";
import type { PersistenciaSesion } from "../modelPersistence";
import { crearRepoMemoria } from "../repoMemoria";
import { ChangeGateway } from "./changeGateway";
import { prepareHumanChange } from "./humanChanges";

const session: PersistenciaSesion = { tenantId: "human-tenant", userId: "human-owner", auth: true, authKind: "operator" };
function fixture() {
  const model = crearModelo("Documento");
  const json = exportarModelo(model);
  const legacy = crearRepoMemoria([construirModeloPersistido({ id: "doc", nombre: model.nombre, json, revision: 1 })], session);
  const hydrated = hidratarModelo(json);
  if (!hydrated.ok) throw new Error(hydrated.error);
  const binding = { documentId: "doc", controllerId: "tab", clientSequence: 2,
    workingCopyHash: createHash("sha256").update(exportarModelo(hydrated.value, carpetaIdDeJson(json))).digest("hex") };
  const build = () => ({ explanation: "Insertar el objeto revisado", operations: [{
    kind: "createObject" as const, operationId: "create-one", preconditions: [], id: "object-one",
    opdId: "opd-1", name: "Pedido", position: { x: 100, y: 100 },
  }] });
  return { legacy, binding, build };
}

test("human preparation has no model effect and enters the shared one-use commit circuit", async () => {
  const { legacy, binding, build } = fixture();
  const repository = legacy.agentRepository;
  const prepared = await prepareHumanChange(repository, session, binding, build);
  expect((await legacy.get(session, "doc"))?.revision).toBe(1);
  expect(prepared.change.actorId).toBe(session.userId);
  expect(prepared.change.taskId).toBeNull();
  expect(prepared.diff.changes.length).toBeGreaterThan(0);
  const gateway = new ChangeGateway({ repository });
  const grant = await gateway.prepareCommit(session, prepared.change, { ...binding, kind: "review" });
  const committed = await gateway.commit(session, prepared.change, grant);
  expect(committed.kind).toBe("committed");
  if (committed.kind !== "committed") return;
  const model = hidratarModelo(committed.modelJson);
  expect(model.ok && model.value.entidades["object-one"]?.nombre).toBe("Pedido");
  expect(committed.inverse.patches.length).toBeGreaterThan(0);
  const replay = await gateway.commit(session, prepared.change, grant);
  expect(replay.kind === "committed" && replay.receipt.revision).toBe(2);
});

test("stale bases and external agent credentials never reach the human constructor", async () => {
  const { legacy, binding } = fixture();
  let built = false;
  const build = () => { built = true; return { operations: [], explanation: "invalid" }; };
  await expect(prepareHumanChange(legacy.agentRepository, session, { ...binding, workingCopyHash: "stale" }, build)).rejects.toMatchObject({ code: "stale-base" });
  await expect(prepareHumanChange(legacy.agentRepository, { ...session, authKind: "agent" }, binding, build)).rejects.toMatchObject({ code: "authority-denied" });
  expect(built).toBe(false);
  expect((await legacy.get(session, "doc"))?.revision).toBe(1);
});
