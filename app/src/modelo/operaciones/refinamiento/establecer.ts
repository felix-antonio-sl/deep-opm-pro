import { CANON } from "../../constantes";
import {
  INZOOM_CANON,
  contornoHeightCanonico,
  contornoWidthCanonico,
} from "../../constantesInzoom";
import { contextoContornoAdopcion } from "../../contextoRefinamiento";
import { CENTRO_CANVAS_GEOMETRICO } from "../../layout";
import { esOpdSuelto } from "../../opdSueltos";
import {
  fijarRefinamiento,
  obtenerRefinamiento,
  quitarRefinamiento,
  refinamientosDe,
} from "../../refinamientos";
import type {
  Apariencia,
  Id,
  Modelo,
  ModoDespliegueObjeto,
  Opd,
  Resultado,
  TipoRefinamiento,
} from "../../tipos";
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
  const materializado = materializarRefinableEnBoceto(modelo, args);
  if (!materializado.ok) return materializado;
  return establecerRefinamiento(materializado.value, {
    opdPadreId: args.opdPadreId,
    entidadId: args.entidadId,
    opdHijoId: args.opdSueltoId,
    tipo: args.tipo,
    // exactOptionalPropertyTypes: omitir `modo` en vez de pasar `undefined`.
    ...(args.modo ? { modo: args.modo } : {}),
    ...(args.preguntaGuia !== undefined ? { preguntaGuia: args.preguntaGuia } : {}),
  });
}

/**
 * La serialización dura exige que la cosa refinada aparezca en el OPD hijo.
 * Un Boceto bottom-up puede no contenerla todavía, por lo que Integrar agrega
 * una apariencia derivada. Su contexto conserva el origen para que Devolver
 * retire solo esta proyección y deje intacto todo contenido autorado.
 */
function materializarRefinableEnBoceto(modelo: Modelo, args: AdopcionOpd): Resultado<Modelo> {
  const opd = modelo.opds[args.opdSueltoId];
  if (!opd) return fallo(`OPD no existe: ${args.opdSueltoId}`);
  if (Object.values(opd.apariencias).some((apariencia) => apariencia.entidadId === args.entidadId)) {
    return ok(modelo);
  }

  const aparienciaId = idAparienciaAdopcion(args);
  if (opd.apariencias[aparienciaId]) {
    return fallo("No se pudo integrar el Boceto: colisión en la apariencia derivada del refinamiento");
  }
  const apariencia: Apariencia = {
    id: aparienciaId,
    entidadId: args.entidadId,
    opdId: opd.id,
    ...geometriaRefinableAdoptado(opd, args.tipo),
    contextoRefinamiento: contextoContornoAdopcion(args.tipo, args.entidadId),
  };
  return ok({
    ...modelo,
    opds: {
      ...modelo.opds,
      [opd.id]: {
        ...opd,
        apariencias: { ...opd.apariencias, [apariencia.id]: apariencia },
      },
    },
  });
}

function idAparienciaAdopcion(args: AdopcionOpd): Id {
  return `a-adopcion-${args.tipo}-${args.entidadId}-${args.opdSueltoId}`;
}

function geometriaRefinableAdoptado(
  opd: Opd,
  tipo: TipoRefinamiento,
): Pick<Apariencia, "x" | "y" | "width" | "height"> {
  const contenido = Object.values(opd.apariencias);
  if (contenido.length === 0) {
    const width = tipo === "descomposicion" ? contornoWidthCanonico : CANON.dims.cosaWidth;
    const height = tipo === "descomposicion" ? contornoHeightCanonico() : CANON.dims.cosaHeight;
    return {
      x: Math.round(CENTRO_CANVAS_GEOMETRICO.x - width / 2),
      y: Math.round(CENTRO_CANVAS_GEOMETRICO.y - height / 2),
      width,
      height,
    };
  }

  const minX = Math.min(...contenido.map((apariencia) => apariencia.x));
  const minY = Math.min(...contenido.map((apariencia) => apariencia.y));
  const maxX = Math.max(...contenido.map((apariencia) => apariencia.x + apariencia.width));
  const maxY = Math.max(...contenido.map((apariencia) => apariencia.y + apariencia.height));
  if (tipo === "descomposicion") {
    const paddingHorizontal = CANON.dims.cosaWidth;
    return {
      x: minX - paddingHorizontal,
      y: minY - INZOOM_CANON.paddingSuperior,
      width: Math.max(contornoWidthCanonico, maxX - minX + paddingHorizontal * 2),
      height: Math.max(
        contornoHeightCanonico(contenido.length),
        maxY - minY + INZOOM_CANON.paddingSuperior + INZOOM_CANON.paddingInferior,
      ),
    };
  }

  return {
    x: Math.round((minX + maxX - CANON.dims.cosaWidth) / 2),
    y: minY - CANON.dims.cosaHeight - INZOOM_CANON.gapInterno,
    width: CANON.dims.cosaWidth,
    height: CANON.dims.cosaHeight,
  };
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
  const aparienciasDerivadas = Object.values(opd.apariencias).filter((apariencia) => {
    const contexto = apariencia.contextoRefinamiento;
    return contexto?.origen === "adopcion" &&
      contexto.rol === "contorno" &&
      contexto.tipo === refinamiento.tipo &&
      contexto.refinableEntidadId === entidad.id;
  });
  if (aparienciasDerivadas.length > 1) {
    return fallo("El OPD contiene más de una apariencia derivada de su integración; corrige la integridad antes de devolverlo");
  }
  const aparienciaDerivadaId = aparienciasDerivadas[0]?.id;
  const apariencias = aparienciaDerivadaId
    ? Object.fromEntries(
        Object.entries(opd.apariencias).filter(([aparienciaId]) => aparienciaId !== aparienciaDerivadaId),
      )
    : opd.apariencias;
  return ok({
    modelo: {
      ...modelo,
      entidades: {
        ...modelo.entidades,
        [entidad.id]: quitarRefinamiento(entidad, refinamiento.tipo),
      },
      opds: {
        ...modelo.opds,
        [opdId]: { ...opd, padreId: null, apariencias },
      },
    },
    opdId,
    entidadId: entidad.id,
    tipo: refinamiento.tipo,
  });
}
