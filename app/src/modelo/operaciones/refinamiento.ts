import { CANON } from "../constantes";
import {
  entidadDeExtremo,
  entidadIdDeExtremo,
  extremoApuntaAEntidad,
  extremoEntidad,
  mismoExtremo,
} from "../extremos";
import type {
  Apariencia,
  AparienciaEnlace,
  Enlace,
  Entidad,
  Estado,
  ExtremoEnlace,
  Id,
  Modelo,
  ModoDespliegueObjeto,
  Opd,
  Resultado,
  TipoEnlace,
} from "../tipos";
import { entidadVisibleEnOpd, fallo, ok, siguienteId, validarFirmaEnlace } from "./helpers";

/**
 * Operaciones de refinamiento OPD: descomposición de procesos (in-zoom) y
 * despliegue de objetos (unfold), plus quitarRefinamiento + helpers que
 * proyectan enlaces externos sobre el OPD hijo (HU-12.* refinamientos).
 *
 * Refs: SSOT opm-iso-19450-es.md §3.* (Refinement),
 *       opm-extracted/src/app/models/components/commands/object-decider.ts:5-127 (decider por tipo).
 */

export interface DescomposicionProceso {
  modelo: Modelo;
  opdId: Id;
  creado: boolean;
}

export interface DespliegueObjeto {
  modelo: Modelo;
  opdId: Id;
  creado: boolean;
  modo: ModoDespliegueObjeto;
}

const INZOOM = {
  subprocesosIniciales: 3,
  paddingSuperior: 100,
  separacionVertical: 30,
  toleranciaParaleloY: 4,
  contornoWidth: CANON.dims.cosaWidth * 3,
  contornoHeight: (CANON.dims.cosaHeight + 30) * 3 + 100 + 65,
} as const;

const UNFOLD = {
  partesIniciales: 3,
  paddingSuperior: 132,
  separacionHorizontal: 30,
  contornoWidth: CANON.dims.cosaWidth * 3 + 120,
  contornoHeight: CANON.dims.cosaHeight + 132 + 80,
} as const;

export function descomponerProceso(modelo: Modelo, opdPadreId: Id, procesoId: Id): Resultado<DescomposicionProceso> {
  const opdPadre = modelo.opds[opdPadreId];
  if (!opdPadre) return fallo(`OPD no existe: ${opdPadreId}`);
  const proceso = modelo.entidades[procesoId];
  if (!proceso) return fallo(`Entidad no existe: ${procesoId}`);
  if (proceso.tipo !== "proceso") return fallo("La descomposición requiere un proceso");
  if (!entidadVisibleEnOpd(opdPadre, procesoId)) {
    return fallo("La descomposición requiere que el proceso tenga apariencia en el OPD activo");
  }

  if (proceso.refinamiento?.tipo === "descomposicion") {
    const opdExistente = modelo.opds[proceso.refinamiento.opdId];
    if (!opdExistente) return fallo(`OPD de descomposición no existe: ${proceso.refinamiento.opdId}`);
    return ok({ modelo, opdId: opdExistente.id, creado: false });
  }

  const opdHijoId = siguienteId(modelo, "opd");
  let nextSeq = modelo.nextSeq + 1;
  const aparienciaHijoId = siguienteId({ ...modelo, nextSeq }, "a");
  nextSeq += 1;
  const aparienciaHijo: Apariencia = {
    id: aparienciaHijoId,
    entidadId: procesoId,
    opdId: opdHijoId,
    x: 150,
    y: 90,
    width: INZOOM.contornoWidth,
    height: INZOOM.contornoHeight,
  };
  const aparienciasExternas = aparienciasExtremosExternos(modelo, opdPadre, procesoId, opdHijoId, nextSeq);
  nextSeq = aparienciasExternas.nextSeq;
  const subprocesos = subprocesosInicialesInzoom(modelo, proceso, aparienciaHijo, opdHijoId, nextSeq);
  nextSeq = subprocesos.nextSeq;
  const opdHijo: Opd = {
    id: opdHijoId,
    nombre: siguienteNombreOpdHijo(modelo, opdPadreId),
    padreId: opdPadreId,
    apariencias: {
      [aparienciaHijoId]: aparienciaHijo,
      ...aparienciasExternas.apariencias,
      ...subprocesos.apariencias,
    },
    enlaces: {},
  };
  const base: Modelo = {
    ...modelo,
    nextSeq,
    entidades: {
      ...modelo.entidades,
      [procesoId]: {
        ...proceso,
        refinamiento: {
          tipo: "descomposicion",
          opdId: opdHijoId,
        },
      },
      ...subprocesos.entidades,
    },
    opds: {
      ...modelo.opds,
      [opdHijoId]: opdHijo,
    },
  };
  const siguiente = proyectarEnlacesExternosEnRefinamiento(base, opdHijoId, {
    primeroId: subprocesos.primeroId,
    ultimoId: subprocesos.ultimoId,
  });
  if (!siguiente.ok) return fallo(siguiente.error);

  return ok({ modelo: siguiente.value, opdId: opdHijoId, creado: true });
}

export function desplegarObjeto(
  modelo: Modelo,
  opdPadreId: Id,
  objetoId: Id,
  modo: ModoDespliegueObjeto = "agregacion",
): Resultado<DespliegueObjeto> {
  const opdPadre = modelo.opds[opdPadreId];
  if (!opdPadre) return fallo(`OPD no existe: ${opdPadreId}`);
  const objeto = modelo.entidades[objetoId];
  if (!objeto) return fallo(`Entidad no existe: ${objetoId}`);
  if (objeto.tipo !== "objeto") return fallo("El despliegue requiere un objeto");
  if (!entidadVisibleEnOpd(opdPadre, objetoId)) {
    return fallo("El despliegue requiere que el objeto tenga apariencia en el OPD activo");
  }

  if (objeto.refinamiento?.tipo === "despliegue") {
    const opdExistente = modelo.opds[objeto.refinamiento.opdId];
    if (!opdExistente) return fallo(`OPD de despliegue no existe: ${objeto.refinamiento.opdId}`);
    return ok({ modelo, opdId: opdExistente.id, creado: false, modo: objeto.refinamiento.modo ?? "agregacion" });
  }
  if (objeto.refinamiento) return fallo("El objeto ya tiene otro refinamiento");

  const opdHijoId = siguienteId(modelo, "opd");
  let nextSeq = modelo.nextSeq + 1;
  const aparienciaHijoId = siguienteId({ ...modelo, nextSeq }, "a");
  nextSeq += 1;
  const aparienciaHijo: Apariencia = {
    id: aparienciaHijoId,
    entidadId: objetoId,
    opdId: opdHijoId,
    x: 150,
    y: 90,
    width: UNFOLD.contornoWidth,
    height: UNFOLD.contornoHeight,
  };
  const partes = partesInicialesDespliegue(modelo, objeto, aparienciaHijo, opdHijoId, nextSeq, modo);
  nextSeq = partes.nextSeq;
  const enlacesDespliegue = enlacesEstructuralesDespliegue(modelo, objetoId, partes.parteIds, opdHijoId, nextSeq, modo);
  nextSeq = enlacesDespliegue.nextSeq;
  const opdHijo: Opd = {
    id: opdHijoId,
    nombre: siguienteNombreOpdHijo(modelo, opdPadreId),
    padreId: opdPadreId,
    apariencias: {
      [aparienciaHijoId]: aparienciaHijo,
      ...partes.apariencias,
    },
    enlaces: enlacesDespliegue.aparienciasEnlace,
  };

  return ok({
    modelo: {
      ...modelo,
      nextSeq,
      entidades: {
        ...modelo.entidades,
        [objetoId]: {
          ...objeto,
          refinamiento: {
            tipo: "despliegue",
            opdId: opdHijoId,
            modo,
          },
        },
        ...partes.entidades,
      },
      enlaces: {
        ...modelo.enlaces,
        ...enlacesDespliegue.enlaces,
      },
      opds: {
        ...modelo.opds,
        [opdHijoId]: opdHijo,
      },
    },
    opdId: opdHijoId,
    creado: true,
    modo,
  });
}

export function quitarDescomposicionProceso(modelo: Modelo, procesoId: Id): Resultado<Modelo> {
  const proceso = modelo.entidades[procesoId];
  if (!proceso) return fallo(`Entidad no existe: ${procesoId}`);
  if (proceso.tipo !== "proceso") return fallo("La descomposición requiere un proceso");
  if (proceso.refinamiento?.tipo !== "descomposicion") return fallo("El proceso no tiene descomposición");

  return quitarRefinamientoEntidad(modelo, procesoId);
}

export function quitarDespliegueObjeto(modelo: Modelo, objetoId: Id): Resultado<Modelo> {
  const objeto = modelo.entidades[objetoId];
  if (!objeto) return fallo(`Entidad no existe: ${objetoId}`);
  if (objeto.tipo !== "objeto") return fallo("El despliegue requiere un objeto");
  if (objeto.refinamiento?.tipo !== "despliegue") return fallo("El objeto no tiene despliegue");

  return quitarRefinamientoEntidad(modelo, objetoId);
}

/**
 * Helper privado-al-subdirectorio: lo consume `eliminacion.ts` (eliminarEntidad
 * con refinamiento). NO se re-exporta desde el barrel `operaciones.ts`.
 */
export function quitarRefinamientoEntidad(modelo: Modelo, entidadId: Id): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad?.refinamiento) return fallo("La entidad no tiene refinamiento");
  const removidos = idsSubarbolOpd(modelo, entidad.refinamiento.opdId);
  if (!removidos.has(entidad.refinamiento.opdId)) {
    return fallo(`OPD de refinamiento no existe: ${entidad.refinamiento.opdId}`);
  }

  const opds = Object.fromEntries(
    Object.entries(modelo.opds).filter(([opdId]) => !removidos.has(opdId)),
  );
  const entidadesVisibles = new Set(
    Object.values(opds).flatMap((opd) => Object.values(opd.apariencias).map((apariencia) => apariencia.entidadId)),
  );
  const entidades = Object.fromEntries(
    Object.entries(modelo.entidades)
      .filter(([id]) => entidadesVisibles.has(id))
      .map(([id, item]) => [id, sinRefinamientoRemovido(item, removidos)]),
  ) as Record<Id, Entidad>;
  const estados = Object.fromEntries(
    Object.entries(modelo.estados ?? {}).filter(([, estado]) => entidades[estado.entidadId]),
  ) as Record<Id, Estado>;
  const enlacesVisibles = new Set(
    Object.values(opds).flatMap((opd) => Object.values(opd.enlaces).map((apariencia) => apariencia.enlaceId)),
  );
  const enlaces = Object.fromEntries(
    Object.entries(modelo.enlaces).filter(([enlaceId, enlace]) => (
      enlacesVisibles.has(enlaceId) &&
      entidadIdDeExtremo({ ...modelo, entidades, estados }, enlace.origenId) !== null &&
      entidadIdDeExtremo({ ...modelo, entidades, estados }, enlace.destinoId) !== null
    )),
  ) as Record<Id, Enlace>;
  const opdsSinEnlacesHuerfanos = Object.fromEntries(
    Object.entries(opds).map(([opdId, opd]) => [
      opdId,
      {
        ...opd,
        enlaces: Object.fromEntries(
          Object.entries(opd.enlaces).filter(([, apariencia]) => enlaces[apariencia.enlaceId]),
        ),
      },
    ]),
  );

  return ok({ ...modelo, entidades, estados, enlaces, opds: opdsSinEnlacesHuerfanos });
}

/**
 * Helper privado-al-subdirectorio: lo consume `creacion.ts` (crearEntidad para
 * proceso) y `apariencias.ts`/`enlaces.ts` (refrescar tras mover/reanclar).
 */
export function refrescarEnlacesExternosDerivados(modelo: Modelo, opdId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return ok(modelo);
  const contorno = procesoDescompuestoEnOpd(modelo, opd);
  if (!contorno) return ok(modelo);
  const subprocesos = subprocesosOrdenadosDeRefinamiento(modelo, opd, contorno.entidad.id);
  const primero = subprocesos[0];
  const ultimo = subprocesos[subprocesos.length - 1];
  if (!primero || !ultimo) return ok(modelo);

  const limpio = limpiarEnlacesDerivadosAutomaticos(modelo, opdId, contorno.entidad.id);
  return proyectarEnlacesExternosEnRefinamiento(limpio, opdId, {
    primeroId: primero.entidadId,
    ultimoId: ultimo.entidadId,
  });
}

export function redistribuirEnlacesExternosSiPrimerSubproceso(modelo: Modelo, opdId: Id, subprocesoId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return ok(modelo);
  const contorno = procesoDescompuestoEnOpd(modelo, opd);
  if (!contorno) return ok(modelo);
  const procesosInternos = subprocesosOrdenadosDeRefinamiento(modelo, opd, contorno.entidad.id);
  if (procesosInternos.length !== 1 || procesosInternos[0]?.entidadId !== subprocesoId) return ok(modelo);

  return proyectarEnlacesExternosEnRefinamiento(modelo, opdId, {
    primeroId: subprocesoId,
    ultimoId: subprocesoId,
  });
}

export function subprocesosOrdenadosDeRefinamiento(modelo: Modelo, opd: Opd, procesoRefinadoId: Id): Apariencia[] {
  const contorno = Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === procesoRefinadoId);
  if (!contorno) return [];
  return Object.values(opd.apariencias)
    .filter((apariencia) => apariencia.entidadId !== procesoRefinadoId)
    .filter((apariencia) => modelo.entidades[apariencia.entidadId]?.tipo === "proceso")
    .filter((apariencia) => dentroDe(apariencia, contorno))
    .sort((a, b) => compararOrdenTemporal(a, b));
}

export function procesoDescompuestoEnOpd(modelo: Modelo, opd: Opd): { entidad: Entidad; apariencia: Apariencia } | null {
  for (const apariencia of Object.values(opd.apariencias)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (entidad?.tipo === "proceso" && entidad.refinamiento?.tipo === "descomposicion" && entidad.refinamiento.opdId === opd.id) {
      return { entidad, apariencia };
    }
  }
  return null;
}

function aparienciasExtremosExternos(
  modelo: Modelo,
  opdPadre: Opd,
  procesoId: Id,
  opdHijoId: Id,
  nextSeqInicial: number,
): { apariencias: Record<Id, Apariencia>; nextSeq: number } {
  const externos = enlacesExternosDelProceso(modelo, opdPadre, procesoId);
  const existentes = new Set<Id>([procesoId]);
  const apariencias: Record<Id, Apariencia> = {};
  let nextSeq = nextSeqInicial;
  let entradas = 0;
  let salidas = 0;

  for (const { enlace, externoId, aparienciaPadre } of externos) {
    if (existentes.has(externoId)) continue;
    existentes.add(externoId);
    const id = siguienteId({ ...modelo, nextSeq }, "a");
    nextSeq += 1;
    const entrada = extremoApuntaAEntidad(enlace.destinoId, procesoId);
    const fila = entrada ? entradas : salidas;
    if (entrada) entradas += 1;
    else salidas += 1;
    apariencias[id] = {
      ...aparienciaPadre,
      id,
      opdId: opdHijoId,
      x: entrada ? 24 : 610,
      y: 112 + fila * 92,
    };
  }

  return { apariencias, nextSeq };
}

function subprocesosInicialesInzoom(
  modelo: Modelo,
  proceso: Entidad,
  contorno: Apariencia,
  opdHijoId: Id,
  nextSeqInicial: number,
): { entidades: Record<Id, Entidad>; apariencias: Record<Id, Apariencia>; primeroId: Id; ultimoId: Id; nextSeq: number } {
  const entidades: Record<Id, Entidad> = {};
  const apariencias: Record<Id, Apariencia> = {};
  let nextSeq = nextSeqInicial;
  let primeroId = "";
  let ultimoId = "";
  const x = contorno.x + (contorno.width - CANON.dims.cosaWidth) / 2;
  let y = contorno.y + INZOOM.paddingSuperior;

  for (let index = 1; index <= INZOOM.subprocesosIniciales; index += 1) {
    const entidadId = siguienteId({ ...modelo, nextSeq }, "p");
    nextSeq += 1;
    const aparienciaId = siguienteId({ ...modelo, nextSeq }, "a");
    nextSeq += 1;
    if (!primeroId) primeroId = entidadId;
    ultimoId = entidadId;
    entidades[entidadId] = {
      id: entidadId,
      tipo: "proceso",
      nombre: `${proceso.nombre} ${index}`,
      esencia: proceso.esencia,
      afiliacion: proceso.afiliacion,
    };
    apariencias[aparienciaId] = {
      id: aparienciaId,
      entidadId,
      opdId: opdHijoId,
      x,
      y,
      width: CANON.dims.cosaWidth,
      height: CANON.dims.cosaHeight,
    };
    y += CANON.dims.cosaHeight + INZOOM.separacionVertical;
  }

  return { entidades, apariencias, primeroId, ultimoId, nextSeq };
}

function partesInicialesDespliegue(
  modelo: Modelo,
  objeto: Entidad,
  contorno: Apariencia,
  opdHijoId: Id,
  nextSeqInicial: number,
  modo: ModoDespliegueObjeto,
): { entidades: Record<Id, Entidad>; apariencias: Record<Id, Apariencia>; parteIds: Id[]; nextSeq: number } {
  const entidades: Record<Id, Entidad> = {};
  const apariencias: Record<Id, Apariencia> = {};
  const parteIds: Id[] = [];
  let nextSeq = nextSeqInicial;
  const totalWidth = CANON.dims.cosaWidth * UNFOLD.partesIniciales + UNFOLD.separacionHorizontal * (UNFOLD.partesIniciales - 1);
  let x = contorno.x + (contorno.width - totalWidth) / 2;
  const y = contorno.y + UNFOLD.paddingSuperior;

  for (let index = 1; index <= UNFOLD.partesIniciales; index += 1) {
    const entidadId = siguienteId({ ...modelo, nextSeq }, "o");
    nextSeq += 1;
    const aparienciaId = siguienteId({ ...modelo, nextSeq }, "a");
    nextSeq += 1;
    entidades[entidadId] = {
      id: entidadId,
      tipo: "objeto",
      nombre: nombreInicialDespliegue(objeto, modo, index),
      esencia: objeto.esencia,
      afiliacion: objeto.afiliacion,
    };
    parteIds.push(entidadId);
    apariencias[aparienciaId] = {
      id: aparienciaId,
      entidadId,
      opdId: opdHijoId,
      x,
      y,
      width: CANON.dims.cosaWidth,
      height: CANON.dims.cosaHeight,
    };
    x += CANON.dims.cosaWidth + UNFOLD.separacionHorizontal;
  }

  return { entidades, apariencias, parteIds, nextSeq };
}

function nombreInicialDespliegue(objeto: Entidad, modo: ModoDespliegueObjeto, index: number): string {
  if (modo === "agregacion") return `${objeto.nombre} parte ${index}`;
  if (modo === "exhibicion") return `Atributo ${index}`;
  if (modo === "generalizacion") return `Especialización ${index}`;
  return `Instancia ${index}`;
}

function tipoEnlaceDespliegue(modo: ModoDespliegueObjeto): TipoEnlace {
  if (modo === "agregacion") return "agregacion";
  if (modo === "exhibicion") return "exhibicion";
  if (modo === "generalizacion") return "generalizacion";
  return "clasificacion";
}

function enlacesEstructuralesDespliegue(
  modelo: Modelo,
  objetoId: Id,
  parteIds: Id[],
  opdId: Id,
  nextSeqInicial: number,
  modo: ModoDespliegueObjeto,
): { enlaces: Record<Id, Enlace>; aparienciasEnlace: Record<Id, AparienciaEnlace>; nextSeq: number } {
  const enlaces: Record<Id, Enlace> = {};
  const aparienciasEnlace: Record<Id, AparienciaEnlace> = {};
  let nextSeq = nextSeqInicial;
  const tipo = tipoEnlaceDespliegue(modo);

  for (const parteId of parteIds) {
    const enlaceId = siguienteId({ ...modelo, nextSeq }, "e");
    nextSeq += 1;
    const aparienciaId = siguienteId({ ...modelo, nextSeq }, "ae");
    nextSeq += 1;
    enlaces[enlaceId] = {
      id: enlaceId,
      tipo,
      origenId: extremoEntidad(objetoId),
      destinoId: extremoEntidad(parteId),
      etiqueta: "",
    };
    aparienciasEnlace[aparienciaId] = { id: aparienciaId, enlaceId, opdId, vertices: [] };
  }

  return { enlaces, aparienciasEnlace, nextSeq };
}

function proyectarEnlacesExternosEnRefinamiento(
  modelo: Modelo,
  opdId: Id,
  subprocesos: { primeroId: Id; ultimoId: Id },
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return ok(modelo);
  const contorno = procesoDescompuestoEnOpd(modelo, opd);
  if (!contorno) return ok(modelo);
  const padre = modelo.opds[opd.padreId];
  if (!padre) return ok(modelo);
  const externos = enlacesExternosDelProceso(modelo, padre, contorno.entidad.id)
    .filter(({ externoId }) => entidadVisibleEnOpd(opd, externoId));
  if (externos.length === 0) return ok(modelo);
  let nextSeq = modelo.nextSeq;
  const enlaces = { ...modelo.enlaces };
  const aparienciasEnlace: Record<Id, AparienciaEnlace> = { ...opd.enlaces };

  for (const { enlace } of externos) {
    if (enlaceDerivadoManualExisteParaPadre(enlaces, aparienciasEnlace, enlace.id, contorno.entidad.id)) {
      continue;
    }
    const proyeccion = proyeccionEnlaceExterno(enlace, contorno.entidad.id, subprocesos);
    if (proyeccion.tipo === "contorno") {
      if (!aparienciaEnlaceExiste(aparienciasEnlace, enlace.id)) {
        const aparienciaId = siguienteId({ ...modelo, nextSeq }, "ae");
        nextSeq += 1;
        aparienciasEnlace[aparienciaId] = { id: aparienciaId, enlaceId: enlace.id, opdId, vertices: [] };
      }
    } else {
      const origen = entidadDeExtremo(modelo, proyeccion.origenId);
      const destino = entidadDeExtremo(modelo, proyeccion.destinoId);
      if (!origen || !destino) continue;
      const firma = validarFirmaEnlace(enlace.tipo, origen, destino, {
        origen: proyeccion.origenId,
        destino: proyeccion.destinoId,
      });
      if (!firma.ok) continue;
      if (enlaceDerivadoExiste(enlaces, aparienciasEnlace, enlace.tipo, proyeccion.origenId, proyeccion.destinoId)) {
        continue;
      }
      const enlaceId = siguienteId({ ...modelo, nextSeq }, "e");
      nextSeq += 1;
      const aparienciaId = siguienteId({ ...modelo, nextSeq }, "ae");
      nextSeq += 1;
      enlaces[enlaceId] = {
        id: enlaceId,
        tipo: enlace.tipo,
        origenId: proyeccion.origenId,
        destinoId: proyeccion.destinoId,
        etiqueta: enlace.etiqueta,
        derivado: {
          tipo: "enlace-externo-refinamiento",
          refinamientoId: contorno.entidad.id,
          enlacePadreId: enlace.id,
          origen: "automatico",
        },
      };
      aparienciasEnlace[aparienciaId] = {
        id: aparienciaId,
        enlaceId,
        opdId,
        vertices: [],
      };
    }
  }

  if (nextSeq === modelo.nextSeq) return ok(modelo);
  return ok({
    ...modelo,
    nextSeq,
    enlaces,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: aparienciasEnlace,
      },
    },
  });
}

function proyeccionEnlaceExterno(
  enlace: Enlace,
  procesoRefinadoId: Id,
  subprocesos: { primeroId: Id; ultimoId: Id },
): { tipo: "derivado"; origenId: ExtremoEnlace; destinoId: ExtremoEnlace } | { tipo: "contorno" } {
  if (enlace.tipo === "consumo" && extremoApuntaAEntidad(enlace.destinoId, procesoRefinadoId)) {
    return { tipo: "derivado", origenId: enlace.origenId, destinoId: extremoEntidad(subprocesos.primeroId) };
  }
  if (
    (enlace.tipo === "resultado" || enlace.tipo === "invocacion") &&
    extremoApuntaAEntidad(enlace.origenId, procesoRefinadoId)
  ) {
    return { tipo: "derivado", origenId: extremoEntidad(subprocesos.ultimoId), destinoId: enlace.destinoId };
  }
  return { tipo: "contorno" };
}

function aparienciaEnlaceExiste(apariencias: Record<Id, AparienciaEnlace>, enlaceId: Id): boolean {
  return Object.values(apariencias).some((apariencia) => apariencia.enlaceId === enlaceId);
}

function enlaceDerivadoExiste(
  enlaces: Record<Id, Enlace>,
  apariencias: Record<Id, AparienciaEnlace>,
  tipo: TipoEnlace,
  origenId: ExtremoEnlace,
  destinoId: ExtremoEnlace,
): boolean {
  return Object.values(enlaces).some((existente) => (
    existente.tipo === tipo &&
    mismoExtremo(existente.origenId, origenId) &&
    mismoExtremo(existente.destinoId, destinoId) &&
    aparienciaEnlaceExiste(apariencias, existente.id)
  ));
}

function enlaceDerivadoManualExisteParaPadre(
  enlaces: Record<Id, Enlace>,
  apariencias: Record<Id, AparienciaEnlace>,
  enlacePadreId: Id,
  refinamientoId: Id,
): boolean {
  return Object.values(enlaces).some((existente) => (
    existente.derivado?.tipo === "enlace-externo-refinamiento" &&
    existente.derivado.refinamientoId === refinamientoId &&
    existente.derivado.enlacePadreId === enlacePadreId &&
    existente.derivado.origen === "manual" &&
    aparienciaEnlaceExiste(apariencias, existente.id)
  ));
}

function limpiarEnlacesDerivadosAutomaticos(modelo: Modelo, opdId: Id, procesoRefinadoId: Id): Modelo {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return modelo;
  const candidatos = new Set(
    Object.values(modelo.enlaces)
      .filter((enlace) => enlace.derivado?.tipo === "enlace-externo-refinamiento")
      .filter((enlace) => enlace.derivado?.refinamientoId === procesoRefinadoId)
      .filter((enlace) => enlace.derivado?.origen !== "manual")
      .map((enlace) => enlace.id),
  );
  if (candidatos.size === 0) return modelo;

  const enlacesOpd = Object.fromEntries(
    Object.entries(opd.enlaces).filter(([, apariencia]) => !candidatos.has(apariencia.enlaceId)),
  );
  const idsAunVisibles = new Set(
    Object.values(modelo.opds)
      .flatMap((item) => Object.values(item.id === opdId ? enlacesOpd : item.enlaces))
      .map((apariencia) => apariencia.enlaceId),
  );
  const enlaces = Object.fromEntries(
    Object.entries(modelo.enlaces).filter(([enlaceId]) => !candidatos.has(enlaceId) || idsAunVisibles.has(enlaceId)),
  );

  return {
    ...modelo,
    enlaces,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: enlacesOpd,
      },
    },
  };
}

function dentroDe(apariencia: Apariencia, contorno: Apariencia): boolean {
  return (
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height
  );
}

function compararOrdenTemporal(a: Apariencia, b: Apariencia): number {
  return a.y - b.y || a.x - b.x || a.id.localeCompare(b.id);
}

function enlacesExternosDelProceso(
  modelo: Modelo,
  opdPadre: Opd,
  procesoId: Id,
): Array<{ enlace: Enlace; externoId: Id; aparienciaPadre: Apariencia }> {
  const aparienciasPadre = new Map(Object.values(opdPadre.apariencias).map((apariencia) => [apariencia.entidadId, apariencia]));
  const externos: Array<{ enlace: Enlace; externoId: Id; aparienciaPadre: Apariencia }> = [];
  for (const aparienciaEnlace of Object.values(opdPadre.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    const externoExtremo = extremoApuntaAEntidad(enlace.origenId, procesoId)
      ? enlace.destinoId
      : extremoApuntaAEntidad(enlace.destinoId, procesoId)
        ? enlace.origenId
        : null;
    const externoId = externoExtremo ? entidadIdDeExtremo(modelo, externoExtremo) : null;
    if (!externoId) continue;
    const aparienciaPadre = aparienciasPadre.get(externoId);
    if (!aparienciaPadre) continue;
    externos.push({ enlace, externoId, aparienciaPadre });
  }
  return externos;
}

function siguienteNombreOpdHijo(modelo: Modelo, opdPadreId: Id): string {
  const opdPadre = modelo.opds[opdPadreId];
  const codigoPadre = codigoOpd(opdPadre?.nombre ?? "SD");
  const usados = new Set(
    Object.values(modelo.opds)
      .filter((opd) => opd.padreId === opdPadreId)
      .map((opd) => codigoOpd(opd.nombre)),
  );

  for (let index = 1; index < Number.MAX_SAFE_INTEGER; index += 1) {
    const candidato = codigoPadre === "SD" ? `SD${index}` : `${codigoPadre}.${index}`;
    if (!usados.has(candidato)) return candidato;
  }
  return codigoPadre === "SD" ? "SD1" : `${codigoPadre}.1`;
}

function codigoOpd(nombre: string): string {
  return /^SD(?:\d+(?:\.\d+)*)?/.exec(nombre.trim())?.[0] ?? nombre;
}

function idsSubarbolOpd(modelo: Modelo, raizId: Id): Set<Id> {
  const removidos = new Set<Id>();
  const pendientes = [raizId];
  while (pendientes.length > 0) {
    const actual = pendientes.pop();
    if (!actual || removidos.has(actual) || !modelo.opds[actual]) continue;
    removidos.add(actual);
    for (const opd of Object.values(modelo.opds)) {
      if (opd.padreId === actual) pendientes.push(opd.id);
    }
  }
  return removidos;
}

function sinRefinamientoRemovido(entidad: Entidad, removidos: Set<Id>): Entidad {
  if (!entidad.refinamiento || !removidos.has(entidad.refinamiento.opdId)) return entidad;
  const { refinamiento: _refinamiento, ...sinRefinamiento } = entidad;
  return sinRefinamiento;
}
