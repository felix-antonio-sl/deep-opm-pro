import { sincronizarAbanicos } from "../../abanicos";
import { esEnlaceExcepcionTemporal } from "../../constantes";
import { contextoExternoDescomposicion } from "../../contextoRefinamiento";
import {
  entidadDeExtremo,
  entidadIdDeExtremo,
  extremoApuntaAEntidad,
  extremoEntidad,
  mismoExtremo,
} from "../../extremos";
import { aparienciaLimpiableAutomaticamente } from "../../politicaApariciones";
import { obtenerRefinamiento } from "../../refinamientos";
import type {
  Apariencia,
  AparienciaEnlace,
  Abanico,
  Enlace,
  ExtremoEnlace,
  Id,
  Modelo,
  Opd,
  PuertoApariencia,
  Resultado,
  TipoEnlace,
} from "../../tipos";
import { entidadVisibleEnOpd, fallo, ok, siguienteId, validarFirmaEnlace } from "../helpers";
import {
  cosaDescompuestaEnOpd,
  enlacesExternosDeEntidad,
  procesoDescompuestoEnOpd,
  subprocesosOrdenadosDeRefinamiento,
} from "./helpers";

/**
 * Politica de representacion del OPD hijo:
 * - materializa proxies externos conectados al refinable en el OPD padre;
 * - distribuye/proyecta enlaces procedurales del contorno hacia refinadores;
 * - conserva override manual de enlaces derivados;
 * - elimina derivados automaticos y proxies externos obsoletos al resincronizar.
 *
 * Refs: SSOT opm-visual-es.md V-80..V-92, V-103..V-107; OPCloud
 * BringConnectedEntitiesAction + OpmVisualThing.inzoom.
 */

type SubprocesosRefinamiento = { primeroId: Id; ultimoId: Id; todosIds?: Id[] };

interface OpcionesRepresentacionRefinamiento {
  subprocesos?: SubprocesosRefinamiento;
  /** Evita que mover un OPD importado sin derivados visibles materialice lineas nuevas. */
  soloSiHayDerivadosAutomaticosVisibles?: boolean;
}

interface OpcionesProyeccionEnlacesExternos {
  sincronizarExternos?: boolean;
  /**
   * En refresh incidental (drag/resize) no se deben expandir derivados
   * automaticos hacia procesos agregados despues de la descomposicion.
   * Mantiene la cardinalidad visible por enlace padre y deja altas nuevas a
   * operaciones explicitas de sincronizacion/creacion.
   */
  limitarAutomaticosPorPadre?: Map<Id, number>;
}

interface ExternoPlan {
  externoId: Id;
  entrada: boolean;
  aparienciaPadre: Apariencia;
  enlaceIds: Id[];
}

interface PlanExternos {
  items: ExternoPlan[];
  keys: Set<Id>;
}

export function refrescarEnlacesExternosDerivados(modelo: Modelo, opdId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return ok(modelo);
  const contorno = procesoDescompuestoEnOpd(modelo, opd);
  if (!contorno) return ok(modelo);
  const subprocesos = subprocesosOrdenadosDeRefinamiento(modelo, opd, contorno.entidad.id);
  const primero = subprocesos[0];
  const ultimo = subprocesos[subprocesos.length - 1];
  if (!primero || !ultimo) return ok(modelo);

  return sincronizarRepresentacionRefinamiento(modelo, opdId, {
    soloSiHayDerivadosAutomaticosVisibles: true,
    subprocesos: {
      primeroId: primero.entidadId,
      ultimoId: ultimo.entidadId,
      todosIds: subprocesos.map((apariencia) => apariencia.entidadId),
    },
  });
}

export function sincronizarRepresentacionesHijasDeOpd(
  modelo: Modelo,
  opdPadreId: Id,
  entidadIds: readonly Id[],
): Resultado<Modelo> {
  const unicos = [...new Set(entidadIds)].filter((id): id is Id => !!id);
  if (unicos.length === 0) return ok(modelo);
  let actual = modelo;

  for (const entidadId of unicos) {
    const entidad = actual.entidades[entidadId];
    const slot = entidad ? obtenerRefinamiento(entidad, "descomposicion") : undefined;
    const opdHijo = slot ? actual.opds[slot.opdId] : undefined;
    if (!opdHijo || opdHijo.padreId !== opdPadreId) continue;
    const sincronizado = sincronizarRepresentacionRefinamiento(actual, opdHijo.id);
    if (!sincronizado.ok) return sincronizado;
    actual = sincronizado.value;
  }

  return ok(actual);
}

export function sincronizarRepresentacionRefinamiento(
  modelo: Modelo,
  opdId: Id,
  opciones: OpcionesRepresentacionRefinamiento = {},
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return ok(modelo);
  const contorno = cosaDescompuestaEnOpd(modelo, opd);
  if (!contorno) return ok(modelo);
  const padre = modelo.opds[opd.padreId];
  if (!padre) return ok(modelo);
  if (
    opciones.soloSiHayDerivadosAutomaticosVisibles &&
    !tieneDerivadosAutomaticosVisibles(modelo, opdId, contorno.entidad.id)
  ) {
    return ok(modelo);
  }

  const subprocesos = opciones.subprocesos ?? subprocesosAutomaticos(modelo, opd, contorno.entidad.id);
  const externos = enlacesExternosDeEntidad(modelo, padre, contorno.entidad.id);
  const planExternos = agruparExternosPorEntidad(modelo, contorno.entidad.id, externos);
  const limiteAutomaticosPorPadre = opciones.soloSiHayDerivadosAutomaticosVisibles
    ? conteosDerivadosAutomaticosVisibles(modelo, opdId, contorno.entidad.id)
    : undefined;
  const conExternos = materializarAparienciasExternas(modelo, opd, contorno.apariencia, planExternos);
  const limpio = limpiarEnlacesDerivadosAutomaticos(conExternos.modelo, opdId, contorno.entidad.id);
  const proyectado = proyectarEnlacesExternosEnRefinamiento(limpio, opdId, subprocesos, {
    sincronizarExternos: false,
    ...(limiteAutomaticosPorPadre ? { limitarAutomaticosPorPadre: limiteAutomaticosPorPadre } : {}),
  });
  if (!proyectado.ok) return proyectado;

  return ok(limpiarAparienciasExternasObsoletas(proyectado.value, opdId, contorno.entidad.id, planExternos.keys));
}

export function proyeccionesCanonicasEnlaceExternoRefinado(
  modelo: Modelo,
  opdId: Id,
  enlacePadreId: Id,
): Array<{ origenId: ExtremoEnlace; destinoId: ExtremoEnlace }> {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return [];
  const contorno = procesoDescompuestoEnOpd(modelo, opd);
  const enlacePadre = modelo.enlaces[enlacePadreId];
  if (!contorno || !enlacePadre) return [];
  return proyeccionesEnlaceExterno(
    enlacePadre,
    contorno.entidad.id,
    subprocesosAutomaticos(modelo, opd, contorno.entidad.id),
  );
}

export function idPuertoAbanicoDerivado(abanicoPadreId: Id, opdHijoId: Id, lado: "origen" | "destino"): Id {
  return `port-fan-ref-${abanicoPadreId}-${opdHijoId}-${lado}`;
}

export function redistribuirEnlacesExternosSiPrimerSubproceso(modelo: Modelo, opdId: Id, subprocesoId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return ok(modelo);
  const contorno = procesoDescompuestoEnOpd(modelo, opd);
  if (!contorno) return ok(modelo);
  const procesosInternos = subprocesosOrdenadosDeRefinamiento(modelo, opd, contorno.entidad.id);
  if (procesosInternos.length !== 1 || procesosInternos[0]?.entidadId !== subprocesoId) return ok(modelo);

  return sincronizarRepresentacionRefinamiento(modelo, opdId, {
    subprocesos: {
      primeroId: subprocesoId,
      ultimoId: subprocesoId,
    },
  });
}

export function distribuirEnlaceExternoEnRefinamiento(modelo: Modelo, opdId: Id, enlacePadreId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return fallo("La distribución requiere un OPD de refinamiento");
  const contorno = procesoDescompuestoEnOpd(modelo, opd);
  if (!contorno) return fallo("La distribución requiere una descomposición de proceso");
  const padre = modelo.opds[opd.padreId];
  const enlace = modelo.enlaces[enlacePadreId];
  if (!padre || !enlace) return fallo("Enlace de contorno no existe");
  if (!enlacesExternosDeEntidad(modelo, padre, contorno.entidad.id).some((item) => item.enlace.id === enlacePadreId)) {
    return fallo("El enlace no pertenece al contorno del refinamiento");
  }
  return sincronizarRepresentacionRefinamiento(modelo, opdId);
}

export function recolectarEnlaceExternoEnRefinamiento(modelo: Modelo, opdId: Id, enlacePadreId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return fallo("La recolección requiere un OPD de refinamiento");
  const contorno = procesoDescompuestoEnOpd(modelo, opd);
  if (!contorno) return fallo("La recolección requiere una descomposición de proceso");
  const padre = modelo.opds[opd.padreId];
  const enlacePadre = modelo.enlaces[enlacePadreId];
  if (!padre || !enlacePadre) return fallo("Enlace de contorno no existe");
  if (!enlacesExternosDeEntidad(modelo, padre, contorno.entidad.id).some((item) => item.enlace.id === enlacePadreId)) {
    return fallo("El enlace no pertenece al contorno del refinamiento");
  }

  let nextSeq = modelo.nextSeq;
  const enlacesOpd = { ...opd.enlaces };
  const enlacesRemovidos = new Set<Id>();
  let cambio = false;
  for (const [aparienciaId, apariencia] of Object.entries(enlacesOpd)) {
    const enlace = modelo.enlaces[apariencia.enlaceId];
    if (
      enlace?.derivado?.tipo === "enlace-externo-refinamiento" &&
      enlace.derivado.refinamientoId === contorno.entidad.id &&
      enlace.derivado.enlacePadreId === enlacePadreId &&
      enlace.derivado.origen !== "manual"
    ) {
      enlacesRemovidos.add(enlace.id);
      delete enlacesOpd[aparienciaId];
      cambio = true;
    }
  }

  if (!aparienciaEnlaceExiste(enlacesOpd, enlacePadreId)) {
    const origenId = entidadIdDeExtremo(modelo, enlacePadre.origenId);
    const destinoId = entidadIdDeExtremo(modelo, enlacePadre.destinoId);
    if (!origenId || !destinoId || !entidadVisibleEnOpd(opd, origenId) || !entidadVisibleEnOpd(opd, destinoId)) {
      return fallo("La recolección requiere extremos visibles en el OPD de refinamiento");
    }
    const aparienciaId = siguienteId({ ...modelo, nextSeq }, "ae");
    nextSeq += 1;
    enlacesOpd[aparienciaId] = { id: aparienciaId, enlaceId: enlacePadreId, opdId, vertices: [] };
    cambio = true;
  }

  if (!cambio) return ok(modelo);
  const enlacesVisiblesEnOtrosOpds = new Set(
    Object.values(modelo.opds)
      .flatMap((actual) => Object.values(actual.id === opdId ? enlacesOpd : actual.enlaces))
      .map((apariencia) => apariencia.enlaceId),
  );
  const enlaces = Object.fromEntries(
    Object.entries(modelo.enlaces).filter(([id]) => !enlacesRemovidos.has(id) || enlacesVisiblesEnOtrosOpds.has(id)),
  ) as Record<Id, Enlace>;
  return ok(sincronizarAbanicos({
    ...modelo,
    nextSeq,
    enlaces,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: enlacesOpd,
      },
    },
  }));
}

export function proyectarEnlacesExternosEnRefinamiento(
  modelo: Modelo,
  opdId: Id,
  subprocesos: SubprocesosRefinamiento,
  opciones: OpcionesProyeccionEnlacesExternos = {},
): Resultado<Modelo> {
  if (opciones.sincronizarExternos ?? true) {
    return sincronizarRepresentacionRefinamiento(modelo, opdId, { subprocesos });
  }

  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return ok(modelo);
  const contorno = cosaDescompuestaEnOpd(modelo, opd);
  if (!contorno) return ok(modelo);
  const padre = modelo.opds[opd.padreId];
  if (!padre) return ok(modelo);
  const externos = enlacesExternosDeEntidad(modelo, padre, contorno.entidad.id)
    .filter(({ externoId }) => entidadVisibleEnOpd(opd, externoId));
  if (externos.length === 0) return ok(modelo);

  let nextSeq = modelo.nextSeq;
  const enlaces = { ...modelo.enlaces };
  let abanicos = modelo.abanicos;
  const apariencias = { ...opd.apariencias };
  const aparienciasEnlace: Record<Id, AparienciaEnlace> = { ...opd.enlaces };
  let cambio = false;

  for (const { enlace } of externos) {
    if (enlaceDerivadoManualExisteParaPadre(enlaces, aparienciasEnlace, enlace.id, contorno.entidad.id)) {
      cambio = quitarAparienciasEnlacePadreMaterializado(aparienciasEnlace, enlace.id) || cambio;
      continue;
    }

    let proyecciones = contorno.entidad.tipo === "proceso"
      ? proyeccionesEnlaceExterno(enlace, contorno.entidad.id, subprocesos)
      : [];
    if (opciones.limitarAutomaticosPorPadre && proyecciones.length > 0) {
      const limite = opciones.limitarAutomaticosPorPadre.get(enlace.id);
      if (limite === undefined) continue;
      proyecciones = proyecciones.slice(0, limite);
    }
    if (proyecciones.length === 0) {
      if (!aparienciaEnlaceExiste(aparienciasEnlace, enlace.id)) {
        const aparienciaId = siguienteId({ ...modelo, nextSeq }, "ae");
        nextSeq += 1;
        aparienciasEnlace[aparienciaId] = { id: aparienciaId, enlaceId: enlace.id, opdId, vertices: [] };
        cambio = true;
      }
      continue;
    }

    cambio = quitarAparienciasEnlacePadreMaterializado(aparienciasEnlace, enlace.id) || cambio;
    for (const proyeccion of proyecciones) {
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
      cambio = true;
    }
  }

  const abanicosProyectados = proyectarAbanicosExternosDerivados({
    modelo,
    padre,
    opdId,
    refinamientoId: contorno.entidad.id,
    enlaces,
    apariencias,
    aparienciasEnlace,
    nextSeq,
  });
  if (abanicosProyectados.cambio) {
    cambio = true;
    nextSeq = abanicosProyectados.nextSeq;
    abanicos = abanicosProyectados.abanicos;
  }

  if (!cambio) return ok(modelo);
  return ok({
    ...modelo,
    nextSeq,
    enlaces,
    ...(abanicos ? { abanicos } : {}),
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias,
        enlaces: aparienciasEnlace,
      },
    },
  });
}

function proyectarAbanicosExternosDerivados(args: {
  modelo: Modelo;
  padre: Opd;
  opdId: Id;
  refinamientoId: Id;
  enlaces: Record<Id, Enlace>;
  apariencias: Record<Id, Apariencia>;
  aparienciasEnlace: Record<Id, AparienciaEnlace>;
  nextSeq: number;
}): { cambio: boolean; nextSeq: number; abanicos?: Record<Id, Abanico> } {
  const abanicosPadre = Object.values(args.modelo.abanicos ?? {})
    .filter((abanico) => abanico.opdId === args.padre.id)
    .filter((abanico) => abanico.puertoComun.entidadId === args.refinamientoId);
  if (abanicosPadre.length === 0) {
    return args.modelo.abanicos
      ? { cambio: false, nextSeq: args.nextSeq, abanicos: args.modelo.abanicos }
      : { cambio: false, nextSeq: args.nextSeq };
  }

  let cambio = false;
  let nextSeq = args.nextSeq;
  const abanicos: Record<Id, Abanico> = { ...(args.modelo.abanicos ?? {}) };
  const visibles = new Set(Object.values(args.aparienciasEnlace).map((apariencia) => apariencia.enlaceId));

  for (const abanicoPadre of abanicosPadre) {
    const derivados = enlacesDerivadosVisibles(args.enlaces, visibles, abanicoPadre.enlaceIds, args.refinamientoId);
    if (derivados.length < 2) continue;
    const puertoComun = puertoComunDerivado(derivados);
    if (!puertoComun) continue;
    const aparienciaPuerto = aparienciaDeEntidad(args.apariencias, puertoComun.entidadId);
    if (!aparienciaPuerto) continue;

    const portId = idPuertoAbanicoDerivado(abanicoPadre.id, args.opdId, puertoComun.lado);
    const puertoRelativo = puertoRelativoPadre(args.padre, abanicoPadre)
      ?? puertoFallback(puertoComun.lado);
    const puertoActual = aparienciaPuerto.ports?.[portId];
    if (!puertoActual || !mismoPuertoRelativo(puertoActual, puertoRelativo)) {
      args.apariencias[aparienciaPuerto.id] = {
        ...aparienciaPuerto,
        ports: {
          ...(aparienciaPuerto.ports ?? {}),
          [portId]: puertoRelativo,
        },
      };
      cambio = true;
    }

    for (const enlace of derivados) {
      const siguiente = enlaceConPuertoComun(enlace, puertoComun.lado, portId);
      if (siguiente !== enlace) {
        args.enlaces[enlace.id] = siguiente;
        cambio = true;
      }
    }

    const enlaceIds = derivados.map((enlace) => enlace.id);
    const existente = Object.values(abanicos).find((abanico) =>
      abanico.opdId === args.opdId && mismosIds(abanico.enlaceIds, enlaceIds)
    );
    const abanicoId = existente?.id ?? siguienteId({ ...args.modelo, nextSeq }, "ab");
    if (!existente) nextSeq += 1;
    const siguiente: Abanico = {
      id: abanicoId,
      opdId: args.opdId,
      puertoComun: {
        entidadId: puertoComun.entidadId,
        lado: puertoComun.lado,
        portId,
      },
      puertoEntidadId: puertoComun.entidadId,
      operador: abanicoPadre.operador,
      enlaceIds,
    };
    if (!abanicosIguales(existente, siguiente)) {
      abanicos[abanicoId] = siguiente;
      cambio = true;
    }
  }

  return { cambio, nextSeq, abanicos };
}

function subprocesosAutomaticos(modelo: Modelo, opd: Opd, refinamientoId: Id): SubprocesosRefinamiento {
  const subprocesos = subprocesosOrdenadosDeRefinamiento(modelo, opd, refinamientoId);
  const primero = subprocesos[0];
  const ultimo = subprocesos[subprocesos.length - 1];
  return {
    primeroId: primero?.entidadId ?? "",
    ultimoId: ultimo?.entidadId ?? "",
    todosIds: subprocesos.map((apariencia) => apariencia.entidadId),
  };
}

function enlacesDerivadosVisibles(
  enlaces: Record<Id, Enlace>,
  visibles: Set<Id>,
  enlacePadreIds: readonly Id[],
  refinamientoId: Id,
): Enlace[] {
  return enlacePadreIds.flatMap((enlacePadreId) =>
    Object.values(enlaces)
      .filter((enlace) => visibles.has(enlace.id))
      .filter((enlace) =>
        enlace.derivado?.tipo === "enlace-externo-refinamiento" &&
        enlace.derivado.refinamientoId === refinamientoId &&
        enlace.derivado.enlacePadreId === enlacePadreId &&
        enlace.derivado.origen !== "manual"
      )
  );
}

function puertoComunDerivado(enlaces: readonly Enlace[]): { entidadId: Id; lado: "origen" | "destino" } | null {
  for (const lado of ["origen", "destino"] as const) {
    const entidadId = entidadIdDirecto(enlaces[0] ? extremoPorLado(enlaces[0], lado) : undefined);
    if (!entidadId) continue;
    if (enlaces.every((enlace) => entidadIdDirecto(extremoPorLado(enlace, lado)) === entidadId)) return { entidadId, lado };
  }
  return null;
}

function extremoPorLado(enlace: Enlace, lado: "origen" | "destino"): ExtremoEnlace {
  return lado === "origen" ? enlace.origenId : enlace.destinoId;
}

function entidadIdDirecto(extremo: ExtremoEnlace | undefined): Id | null {
  return extremo?.kind === "entidad" ? extremo.id : null;
}

function aparienciaDeEntidad(apariencias: Record<Id, Apariencia>, entidadId: Id): Apariencia | undefined {
  return Object.values(apariencias).find((apariencia) => apariencia.entidadId === entidadId);
}

function puertoRelativoPadre(padre: Opd, abanico: Abanico): PuertoApariencia | undefined {
  const apariencia = aparienciaDeEntidad(padre.apariencias, abanico.puertoComun.entidadId);
  return apariencia?.ports?.[abanico.puertoComun.portId];
}

function puertoFallback(lado: "origen" | "destino"): PuertoApariencia {
  return lado === "origen" ? { x: 1, y: 0.5 } : { x: 0, y: 0.5 };
}

function enlaceConPuertoComun(enlace: Enlace, lado: "origen" | "destino", portId: Id): Enlace {
  const campo = lado === "origen" ? "origenId" : "destinoId";
  const extremo = enlace[campo];
  if (extremo.kind !== "entidad" || extremo.portId === portId) return enlace;
  return { ...enlace, [campo]: { ...extremo, portId } };
}

function mismoPuertoRelativo(a: PuertoApariencia, b: PuertoApariencia): boolean {
  return a.x === b.x && a.y === b.y;
}

function abanicosIguales(a: Abanico | undefined, b: Abanico): boolean {
  return !!a &&
    a.opdId === b.opdId &&
    a.operador === b.operador &&
    a.puertoComun.entidadId === b.puertoComun.entidadId &&
    a.puertoComun.lado === b.puertoComun.lado &&
    a.puertoComun.portId === b.puertoComun.portId &&
    mismosIds(a.enlaceIds, b.enlaceIds);
}

function materializarAparienciasExternas(
  modelo: Modelo,
  opd: Opd,
  contorno: Apariencia,
  planExternos: PlanExternos,
): { modelo: Modelo; agregadas: number } {
  if (planExternos.items.length === 0) return { modelo, agregadas: 0 };

  let nextSeq = modelo.nextSeq;
  let agregadas = 0;
  let cambio = false;
  const apariencias = { ...opd.apariencias };
  const existentes = new Map(Object.values(apariencias).map((apariencia) => [apariencia.entidadId, apariencia]));
  const filas = contarFilasExternas(opd, contorno.entidadId, planExternos);

  for (const item of planExternos.items) {
    const existente = existentes.get(item.externoId);
    if (existente) {
      const contexto = contextoExternoDescomposicion(contorno.entidadId, contorno.id, item.enlaceIds);
      const previo = existente.contextoRefinamiento;
      if (
        previo?.tipo !== contexto.tipo ||
        previo.rol !== contexto.rol ||
        previo.refinableEntidadId !== contexto.refinableEntidadId ||
        previo.contenedorAparienciaId !== contexto.contenedorAparienciaId ||
        !mismosIds(previo.enlacesPadreIds ?? [], item.enlaceIds)
      ) {
        apariencias[existente.id] = { ...existente, contextoRefinamiento: contexto };
        cambio = true;
      }
      continue;
    }

    const id = siguienteId({ ...modelo, nextSeq }, "a");
    nextSeq += 1;
    const fila = item.entrada ? filas.entradas++ : filas.salidas++;
    apariencias[id] = {
      ...item.aparienciaPadre,
      id,
      opdId: opd.id,
      x: item.entrada ? contorno.x - item.aparienciaPadre.width - 40 : contorno.x + contorno.width + 40,
      y: contorno.y + 22 + fila * 92,
      contextoRefinamiento: contextoExternoDescomposicion(contorno.entidadId, contorno.id, item.enlaceIds),
    };
    existentes.set(item.externoId, apariencias[id]!);
    agregadas += 1;
    cambio = true;
  }

  if (!cambio) return { modelo, agregadas: 0 };
  return {
    modelo: {
      ...modelo,
      nextSeq,
      opds: {
        ...modelo.opds,
        [opd.id]: {
          ...opd,
          apariencias,
        },
      },
    },
    agregadas,
  };
}

function limpiarAparienciasExternasObsoletas(modelo: Modelo, opdId: Id, refinamientoId: Id, externosActuales: Set<Id>): Modelo {
  const opd = modelo.opds[opdId];
  if (!opd) return modelo;
  const conectadas = entidadesConectadasEnOpd(modelo, opd);
  let cambio = false;
  const apariencias = Object.fromEntries(Object.entries(opd.apariencias).filter(([, apariencia]) => {
    if (!aparienciaLimpiableAutomaticamente(modelo, opdId, apariencia, refinamientoId)) return true;
    if (externosActuales.has(apariencia.entidadId)) return true;
    if (conectadas.has(apariencia.entidadId)) return true;
    cambio = true;
    return false;
  }));
  if (!cambio) return modelo;
  return {
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias,
      },
    },
  };
}

function agruparExternosPorEntidad(
  modelo: Modelo,
  refinamientoId: Id,
  externos: Array<{ enlace: Enlace; externoId: Id; aparienciaPadre: Apariencia }>,
): PlanExternos {
  const porEntidad = new Map<Id, ExternoPlan>();
  for (const { enlace, externoId, aparienciaPadre } of externos) {
    const existente = porEntidad.get(externoId);
    const entrada = entidadIdDeExtremo(modelo, enlace.destinoId) === refinamientoId;
    if (existente) {
      existente.enlaceIds.push(enlace.id);
      existente.enlaceIds.sort();
      existente.entrada = existente.entrada || entrada;
      continue;
    }
    porEntidad.set(externoId, {
      externoId,
      entrada,
      aparienciaPadre,
      enlaceIds: [enlace.id],
    });
  }

  const items = [...porEntidad.values()].sort((a, b) => {
    if (a.entrada !== b.entrada) return a.entrada ? -1 : 1;
    return a.aparienciaPadre.y - b.aparienciaPadre.y || a.aparienciaPadre.x - b.aparienciaPadre.x || a.externoId.localeCompare(b.externoId);
  });
  return { items, keys: new Set(items.map((item) => item.externoId)) };
}

function contarFilasExternas(opd: Opd, refinamientoId: Id, planExternos: PlanExternos): { entradas: number; salidas: number } {
  let entradas = 0;
  let salidas = 0;
  for (const apariencia of Object.values(opd.apariencias)) {
    const item = planExternos.items.find((externo) => externo.externoId === apariencia.entidadId);
    if (!item) continue;
    const contexto = apariencia.contextoRefinamiento;
    if (contexto?.tipo === "descomposicion" && contexto.rol === "interno" && contexto.refinableEntidadId === refinamientoId) continue;
    if (item.entrada) entradas += 1;
    else salidas += 1;
  }
  return { entradas, salidas };
}

function entidadesConectadasEnOpd(modelo: Modelo, opd: Opd): Set<Id> {
  const ids = new Set<Id>();
  for (const apariencia of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[apariencia.enlaceId];
    if (!enlace) continue;
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (origen) ids.add(origen);
    if (destino) ids.add(destino);
  }
  return ids;
}

function proyeccionesEnlaceExterno(
  enlace: Enlace,
  procesoRefinadoId: Id,
  subprocesos: SubprocesosRefinamiento,
): Array<{ origenId: ExtremoEnlace; destinoId: ExtremoEnlace }> {
  if (!subprocesos.primeroId || !subprocesos.ultimoId) return [];
  const todos = subprocesos.todosIds?.length ? subprocesos.todosIds : [subprocesos.primeroId, subprocesos.ultimoId];
  if (enlace.tipo === "consumo" && extremoApuntaAEntidad(enlace.destinoId, procesoRefinadoId)) {
    return [{ origenId: enlace.origenId, destinoId: extremoEntidad(subprocesos.primeroId) }];
  }
  if (
    (enlace.tipo === "resultado" || enlace.tipo === "invocacion" || esEnlaceExcepcionTemporal(enlace.tipo)) &&
    extremoApuntaAEntidad(enlace.origenId, procesoRefinadoId)
  ) {
    return [{ origenId: extremoEntidad(subprocesos.ultimoId), destinoId: enlace.destinoId }];
  }
  if (esEnlaceExcepcionTemporal(enlace.tipo) && extremoApuntaAEntidad(enlace.destinoId, procesoRefinadoId)) {
    return [{ origenId: enlace.origenId, destinoId: extremoEntidad(subprocesos.primeroId) }];
  }
  if ((enlace.tipo === "agente" || enlace.tipo === "instrumento") && extremoApuntaAEntidad(enlace.destinoId, procesoRefinadoId)) {
    return todos.map((subprocesoId) => ({ origenId: enlace.origenId, destinoId: extremoEntidad(subprocesoId) }));
  }
  if (enlace.tipo === "efecto" && extremoApuntaAEntidad(enlace.destinoId, procesoRefinadoId)) {
    return todos.map((subprocesoId) => ({ origenId: enlace.origenId, destinoId: extremoEntidad(subprocesoId) }));
  }
  if (enlace.tipo === "efecto" && extremoApuntaAEntidad(enlace.origenId, procesoRefinadoId)) {
    return todos.map((subprocesoId) => ({ origenId: extremoEntidad(subprocesoId), destinoId: enlace.destinoId }));
  }
  return [];
}

function aparienciaEnlaceExiste(apariencias: Record<Id, AparienciaEnlace>, enlaceId: Id): boolean {
  return Object.values(apariencias).some((apariencia) => apariencia.enlaceId === enlaceId);
}

function tieneDerivadosAutomaticosVisibles(modelo: Modelo, opdId: Id, refinamientoId: Id): boolean {
  const opd = modelo.opds[opdId];
  if (!opd) return false;
  return Object.values(opd.enlaces).some((apariencia) => {
    const enlace = modelo.enlaces[apariencia.enlaceId];
    return enlace?.derivado?.tipo === "enlace-externo-refinamiento" &&
      enlace.derivado.refinamientoId === refinamientoId &&
      enlace.derivado.origen !== "manual";
  });
}

function conteosDerivadosAutomaticosVisibles(modelo: Modelo, opdId: Id, refinamientoId: Id): Map<Id, number> {
  const opd = modelo.opds[opdId];
  const conteos = new Map<Id, number>();
  if (!opd) return conteos;
  for (const apariencia of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[apariencia.enlaceId];
    if (
      enlace?.derivado?.tipo !== "enlace-externo-refinamiento" ||
      enlace.derivado.refinamientoId !== refinamientoId ||
      enlace.derivado.origen === "manual"
    ) {
      continue;
    }
    const padreId = enlace.derivado.enlacePadreId;
    conteos.set(padreId, (conteos.get(padreId) ?? 0) + 1);
  }
  return conteos;
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

function quitarAparienciasEnlacePadreMaterializado(apariencias: Record<Id, AparienciaEnlace>, enlacePadreId: Id): boolean {
  let cambio = false;
  for (const [id, apariencia] of Object.entries(apariencias)) {
    if (apariencia.enlaceId !== enlacePadreId) continue;
    delete apariencias[id];
    cambio = true;
  }
  return cambio;
}

function mismosIds(a: readonly Id[], b: readonly Id[]): boolean {
  if (a.length !== b.length) return false;
  const ordenA = [...a].sort();
  const ordenB = [...b].sort();
  return ordenA.every((id, index) => id === ordenB[index]);
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

  return sincronizarAbanicos({
    ...modelo,
    enlaces,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: enlacesOpd,
      },
    },
  });
}
