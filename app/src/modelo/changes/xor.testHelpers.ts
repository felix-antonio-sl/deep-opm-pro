import { formarAbanico } from "../abanicos";
import { crearEnlace, crearModelo, crearObjeto, crearProceso } from "../operaciones";
import type { Id, Modelo, Resultado } from "../tipos";
import type { CreateXorExclusionOperation } from "./xor";
import { applyXorExclusionOperation } from "./xor";

export function modeloConRamas(names: string[]): { model: Modelo; links: Id[] } {
  let model = crearModelo();
  model = must(crearProceso(model, model.opdRaizId, { x: 40, y: 80 }, "Decidir"));
  const processId = Object.values(model.entidades).find((entity) => entity.nombre === "Decidir")!.id;
  for (const [index, name] of names.entries()) {
    model = must(crearObjeto(model, model.opdRaizId, { x: 250, y: 20 + index * 100 }, name));
    const objectId = Object.values(model.entidades).find((entity) => entity.nombre === name)!.id;
    model = must(crearEnlace(model, model.opdRaizId, processId, objectId, "resultado"));
  }
  const links = Object.keys(model.enlaces);
  const endpoints = { ...model.enlaces };
  for (const linkId of links) {
    const link = endpoints[linkId]!;
    endpoints[linkId] = { ...link, origenId: { ...link.origenId, portId: "same-output" } };
  }
  return { model: { ...model, enlaces: endpoints }, links };
}

export function aplicarXor(model: Modelo, id: string, opdId: Id, linkIds: Id[]): Resultado<Modelo> {
  const operation: CreateXorExclusionOperation = {
    kind: "createXorExclusion",
    operationId: `operation:${id}`,
    preconditions: [],
    id,
    opdId,
    linkIds,
  };
  return applyXorExclusionOperation(model, operation);
}

export function must<T>(result: Resultado<T>): T {
  if (!result.ok) throw new Error(result.error);
  return result.value;
}
