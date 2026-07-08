import { esOpdSuelto } from "../../opdSueltos";
import { fijarRefinamiento, obtenerRefinamiento } from "../../refinamientos";
import type { Id, Modelo, ModoDespliegueObjeto, Resultado, TipoRefinamiento } from "../../tipos";
import { entidadVisibleEnOpd, fallo, ok } from "../helpers";

export interface EnlaceRefinamiento {
  /** OPD donde aparece la cosa refinada; será el padre-en-árbol del hijo. */
  opdPadreId: Id;
  /** La cosa refinada (proceso/objeto). */
  entidadId: Id;
  /** El OPD que realiza el refinamiento (recién creado o suelto adoptado). */
  opdHijoId: Id;
  tipo: TipoRefinamiento;
  modo?: ModoDespliegueObjeto;
}

/**
 * Constructor ÚNICO de refinamiento (R-OPD-REF-20, convergencia por construcción).
 * Vincula una cosa refinada (visible en opdPadre) con el OPD hijo que la realiza:
 *   (1) fija el slot de refinamiento de la entidad → opdHijo;
 *   (2) fija `opdHijo.padreId = opdPadreId` (lo inserta en el árbol).
 * Lo invocan POR IGUAL el camino top-down (`descomponerProceso`/`desplegarObjeto`,
 * que crean el hijo con su contenido antes de vincular) y el verbo «adoptar»
 * (`adoptarOpd`, que toma un suelto existente). No crea contenido ni recalcula
 * representación: es el átomo de enlace, la fuente de la convergencia.
 */
export function establecerRefinamiento(modelo: Modelo, enlace: EnlaceRefinamiento): Resultado<Modelo> {
  const { opdPadreId, entidadId, opdHijoId, tipo, modo } = enlace;
  const opdPadre = modelo.opds[opdPadreId];
  if (!opdPadre) return fallo(`OPD padre no existe: ${opdPadreId}`);
  const opdHijo = modelo.opds[opdHijoId];
  if (!opdHijo) return fallo(`OPD hijo no existe: ${opdHijoId}`);
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  if (!entidadVisibleEnOpd(opdPadre, entidadId)) {
    return fallo("El refinamiento requiere que la entidad tenga apariencia en el OPD padre");
  }
  if (obtenerRefinamiento(entidad, tipo)) {
    return fallo(`La entidad ya tiene refinamiento de tipo ${tipo}`);
  }
  // Aciclicidad (R-OPD-REF-8): el hijo no puede ser el padre ni un ancestro suyo.
  if (opdHijoId === opdPadreId || esAncestroOpd(modelo, opdHijoId, opdPadreId)) {
    return fallo("Refinamiento cíclico: el OPD hijo es ancestro del OPD padre");
  }
  const slot = modo ? { opdId: opdHijoId, modo } : { opdId: opdHijoId };
  return ok({
    ...modelo,
    entidades: { ...modelo.entidades, [entidadId]: fijarRefinamiento(entidad, tipo, slot) },
    opds: { ...modelo.opds, [opdHijoId]: { ...opdHijo, padreId: opdPadreId } },
  });
}

/** ¿`posibleAncestroId` está en la cadena de ancestros de `opdId` (por padreId)? */
function esAncestroOpd(modelo: Modelo, posibleAncestroId: Id, opdId: Id): boolean {
  const visitados = new Set<Id>();
  let actual = modelo.opds[opdId]?.padreId ?? null;
  while (actual && !visitados.has(actual)) {
    if (actual === posibleAncestroId) return true;
    visitados.add(actual);
    actual = modelo.opds[actual]?.padreId ?? null;
  }
  return false;
}

export interface AdopcionOpd {
  opdPadreId: Id;
  entidadId: Id;
  opdSueltoId: Id;
  tipo: TipoRefinamiento;
  modo?: ModoDespliegueObjeto;
}

/**
 * Verbo «adoptar» (R-OPD-REF-20): declara un OPD SUELTO existente como el
 * refinamiento (in-zoom/unfold) de una cosa existente. Valida que el OPD sea
 * suelto y delega el vínculo al MISMO constructor `establecerRefinamiento` que
 * usa el camino top-down → convergencia por construcción.
 */
export function adoptarOpd(modelo: Modelo, args: AdopcionOpd): Resultado<Modelo> {
  if (!esOpdSuelto(modelo, args.opdSueltoId)) {
    return fallo(`El OPD ${args.opdSueltoId} no es un suelto adoptable (o es la raíz)`);
  }
  return establecerRefinamiento(modelo, {
    opdPadreId: args.opdPadreId,
    entidadId: args.entidadId,
    opdHijoId: args.opdSueltoId,
    tipo: args.tipo,
    // exactOptionalPropertyTypes: omitir `modo` en vez de pasar `undefined`.
    ...(args.modo ? { modo: args.modo } : {}),
  });
}
