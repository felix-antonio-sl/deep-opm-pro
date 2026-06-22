// Helpers de kernel para la extensión Estereotipo (D6). Puro: sin JointJS, sin DOM,
// sin Zustand. El Estereotipo del CATÁLOGO es contenido meta del autor (mismo estatuto
// que AnclaNormativa/NotaMesa): NO emite OPL nuclear, NO cuenta como cosa, NO altera
// validarModelo nuclear. La APLICACIÓN a una entidad vía `Entidad.estereotipoId` SÍ es
// dato del modelo (estereotipo aplicado) y se valida referencialmente en el import.
import type { Entidad, Estereotipo, Id, Modelo } from "./tipos";

/** Id del estereotipo de FÁBRICA "requirement" (objeto OPM estereotipado, evidencia OpCloud
 *  R-4604 docs/reference/.../86-metodologia-requisitos.md; canon visual <<Requirement>>).
 *  Colon namespaced para NO colisionar con ids de catálogo generados por siguienteId ("est-N"). */
export const ESTEREOTIPO_REQUIREMENT_ID = "est:requirement";

/** Estereotipos de fábrica (built-in): existen sin estar en Modelo.estereotipos. */
export const ESTEREOTIPOS_DE_FABRICA: Readonly<Record<Id, Estereotipo>> = {
  [ESTEREOTIPO_REQUIREMENT_ID]: {
    id: ESTEREOTIPO_REQUIREMENT_ID,
    nombre: "Requirement",
    propositoDeModelado: "Marca un objeto como requisito trazable (objeto OPM estereotipado).",
  },
};

/** Adaptador: ¿la entidad porta el estereotipo de requisito? Acepta undefined ⇒ false. */
export function esRequisito(entidad: Entidad | undefined): boolean {
  return entidad?.estereotipoId === ESTEREOTIPO_REQUIREMENT_ID;
}

/** Resuelve un estereotipo por id contra fábrica + catálogo del modelo. */
export function estereotipoDe(modelo: Modelo, id: Id): Estereotipo | undefined {
  return ESTEREOTIPOS_DE_FABRICA[id] ?? modelo.estereotipos?.[id];
}

/** Enumera estereotipos disponibles (fábrica + catálogo), orden estable por id. Para vitrinas (D6.4). */
export function enumerarEstereotipos(modelo: Modelo): Estereotipo[] {
  const fabrica = Object.values(ESTEREOTIPOS_DE_FABRICA);
  const catalogo = Object.values(modelo.estereotipos ?? {});
  return [...fabrica, ...catalogo].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
