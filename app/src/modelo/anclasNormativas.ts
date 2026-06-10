// Helpers de kernel para la extensión AnclaNormativa (W5.1). Puro: sin JointJS, sin DOM,
// sin Zustand. La AnclaNormativa es *extensión declarada* (R-DOC-7), contenido meta del
// autor (V-204): NO emite OPL nuclear, NO cuenta como cosa, NO altera validarModelo nuclear.
// Diseño adjudicado v0: diseno-ancla-normativa.md (retirado 2a83c1c5, en git).
import type { AnclaNormativa, Id, Modelo, TargetAncla } from "./tipos";

/**
 * Enumera todas las anclas normativas del modelo (L8: "ancla enumerable"). Orden estable
 * por `id` para que la enumeración sea determinista. Un modelo sin anclas devuelve `[]`.
 */
export function enumerarAnclas(modelo: Modelo): AnclaNormativa[] {
  const anclas = modelo.anclasNormativas;
  if (!anclas) return [];
  return Object.values(anclas).sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/**
 * Registro consultable de anclas PENDIENTES de ratificación (L8: "registro
 * consultable"). Filtra `estado === "pendiente-ratificacion"`. Orden estable por `id`.
 */
export function anclasPendientes(modelo: Modelo): AnclaNormativa[] {
  return enumerarAnclas(modelo).filter((ancla) => ancla.estado === "pendiente-ratificacion");
}

/** Busca un ancla por su clave estable nacida en el proto (la clave de trazabilidad, §3). */
export function anclaPorClaveProto(modelo: Modelo, claveProto: string): AnclaNormativa | undefined {
  return enumerarAnclas(modelo).find((ancla) => ancla.claveProto === claveProto);
}

/** Filtra las anclas adjuntas a un target dado (entidad/enlace/opd) por su id. */
export function anclasDeTarget(modelo: Modelo, tipo: "entidad" | "enlace" | "opd", id: Id): AnclaNormativa[] {
  return enumerarAnclas(modelo).filter((ancla) => ancla.target.tipo === tipo && targetId(ancla.target) === id);
}

/** Anclas a nivel de modelo entero (`target.tipo === "modelo"`). */
export function anclasDeModelo(modelo: Modelo): AnclaNormativa[] {
  return enumerarAnclas(modelo).filter((ancla) => ancla.target.tipo === "modelo");
}

/**
 * Consulta unificada por `TargetAncla` (W6.4): resuelve los 4 niveles de target
 * sin que el consumidor ramifique por tipo. Orden estable por `id`.
 */
export function anclasDe(modelo: Modelo, target: TargetAncla): AnclaNormativa[] {
  if (target.tipo === "modelo") return anclasDeModelo(modelo);
  return anclasDeTarget(modelo, target.tipo, target.id);
}

function targetId(target: TargetAncla): Id | undefined {
  return target.tipo === "modelo" ? undefined : target.id;
}
