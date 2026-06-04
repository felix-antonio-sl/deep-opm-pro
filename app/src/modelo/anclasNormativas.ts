// Helpers de kernel para la extensión AnclaNormativa (W5.1). Puro: sin JointJS, sin DOM,
// sin Zustand. La AnclaNormativa es *extensión declarada* (R-DOC-7), contenido meta del
// autor (V-204): NO emite OPL nuclear, NO cuenta como cosa, NO altera validarModelo nuclear.
// Diseño adjudicado v0: docs/proto-modelo/diseno-ancla-normativa.md.
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

function targetId(target: TargetAncla): Id | undefined {
  return target.tipo === "modelo" ? undefined : target.id;
}
