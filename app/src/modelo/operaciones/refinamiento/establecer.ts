import { esOpdSuelto } from "../../opdSueltos";
import {
  fijarRefinamiento,
  obtenerRefinamiento,
  quitarRefinamiento,
  refinamientosDe,
} from "../../refinamientos";
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
  preguntaGuia?: string;
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
  const preguntaGuia = enlace.preguntaGuia?.trim();
  return ok({
    ...modelo,
    entidades: { ...modelo.entidades, [entidadId]: fijarRefinamiento(entidad, tipo, slot) },
    opds: {
      ...modelo.opds,
      [opdHijoId]: {
        ...opdHijo,
        padreId: opdPadreId,
        ...(preguntaGuia ? { preguntaGuia } : {}),
      },
    },
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
  preguntaGuia?: string;
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
    ...(args.preguntaGuia !== undefined ? { preguntaGuia: args.preguntaGuia } : {}),
  });
}

export interface DevolucionOpdABocetos {
  modelo: Modelo;
  opdId: Id;
  entidadId: Id;
  tipo: TipoRefinamiento;
}

/**
 * Operación inversa NO destructiva de `establecerRefinamiento`.
 *
 * Desvincula un OPD integrado de la entidad que lo refina y lo devuelve al
 * conjunto de Bocetos (`padreId:null`, sin ser la raíz). Preserva por identidad
 * el OPD y todo su subárbol, junto con entidades, enlaces, estados, geometría,
 * nombres y pregunta guía. La eliminación destructiva del refinamiento sigue
 * siendo una operación distinta y explícita.
 */
export function devolverOpdABocetos(
  modelo: Modelo,
  opdId: Id,
): Resultado<DevolucionOpdABocetos> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  if (opdId === modelo.opdRaizId) return fallo("La raíz del modelo no puede convertirse en Boceto");
  if (opd.padreId === null) return fallo(`El OPD ${opdId} ya está en Bocetos`);

  const propietarios = Object.values(modelo.entidades).flatMap((entidad) =>
    refinamientosDe(entidad)
      .filter((refinamiento) => refinamiento.opdId === opdId)
      .map((refinamiento) => ({ entidad, refinamiento }))
  );

  if (propietarios.length === 0) {
    return fallo("El OPD integrado no tiene un vínculo de refinamiento que devolver");
  }
  if (propietarios.length > 1) {
    return fallo("El OPD está vinculado por más de un refinamiento; corrige la integridad antes de devolverlo");
  }

  const { entidad, refinamiento } = propietarios[0]!;
  const opdPadre = modelo.opds[opd.padreId];
  if (!opdPadre || !entidadVisibleEnOpd(opdPadre, entidad.id)) {
    return fallo("El vínculo de refinamiento no coincide con el padre del OPD; corrige la integridad antes de devolverlo");
  }
  return ok({
    modelo: {
      ...modelo,
      entidades: {
        ...modelo.entidades,
        [entidad.id]: quitarRefinamiento(entidad, refinamiento.tipo),
      },
      opds: {
        ...modelo.opds,
        [opdId]: { ...opd, padreId: null },
      },
    },
    opdId,
    entidadId: entidad.id,
    tipo: refinamiento.tipo,
  });
}
