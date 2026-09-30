import { descomponerProceso, desplegarObjeto } from "../operaciones/refinamiento";
import { obtenerRefinamiento } from "../refinamientos";
import type { Id, Modelo, ModoDespliegueObjeto, Resultado, TipoRefinamiento } from "../tipos";
import type { OperationBase } from "./types";

/** Human-authored proposal; it is not offered by the agent tool schema. */
export interface CreateRefinementOperation extends OperationBase {
  kind: "createRefinement";
  entityId: Id;
  opdId: Id;
  refinementType: TipoRefinamiento;
  mode?: ModoDespliegueObjeto;
  question: string;
  justification: string;
  /** Existing refinement constructors allocate IDs from this exact sequence. */
  expectedNextSeq: number;
}

export function applyRefinementOperation(model: Modelo, operation: CreateRefinementOperation): Resultado<Modelo> {
  const entity = model.entidades[operation.entityId];
  if (!entity || !model.opds[operation.opdId]) return { ok: false, error: "El referente del refinamiento ya no está disponible" };
  if (model.opds[operation.opdId]!.vista?.readOnly || entity.anclaje) {
    return { ok: false, error: "El refinamiento requiere un referente propio y editable" };
  }
  if (!operation.question.trim() || !operation.justification.trim()) {
    return { ok: false, error: "La propuesta requiere pregunta y justificación explícitas" };
  }
  if (operation.expectedNextSeq !== model.nextSeq) return { ok: false, error: "La base cambió; vuelve a preparar el refinamiento" };
  if (obtenerRefinamiento(entity, operation.refinementType)) {
    return { ok: false, error: "Ese refinamiento ya existe; navega a él sin crear otro" };
  }
  const options = { preguntaGuia: operation.question.trim() };
  if (operation.refinementType === "descomposicion") {
    const result = descomponerProceso(model, operation.opdId, entity.id, options);
    return result.ok ? { ok: true, value: result.value.modelo } : result;
  }
  if (!operation.mode) return { ok: false, error: "El despliegue requiere una relación estructural explícita" };
  const result = desplegarObjeto(model, operation.opdId, entity.id, operation.mode, options);
  return result.ok ? { ok: true, value: result.value.modelo } : result;
}

/** Parent declarations remain inspectable independently of projected child links. */
export function refinementFrontier(model: Modelo, entityId: Id): string[] {
  const states = new Set(Object.values(model.estados).filter((state) => state.entidadId === entityId).map((state) => state.id));
  const owns = (endpoint: { kind: string; id: Id }) => endpoint.kind === "entidad" ? endpoint.id === entityId : states.has(endpoint.id);
  return Object.values(model.enlaces)
    .filter((link) => owns(link.origenId) || owns(link.destinoId))
    .map((link) => JSON.stringify([link.id, link.tipo, link.origenId, link.destinoId]))
    .sort();
}
