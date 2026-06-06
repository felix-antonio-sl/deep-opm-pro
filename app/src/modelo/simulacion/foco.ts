import { tieneDesignacion } from "../estadosDesignaciones";
import { entidadIdDeExtremo } from "../extremos";
import { rutaEtiquetaNormalizada } from "../rutas";
import type { Id, Modelo } from "../tipos";
import {
  enlacesDeFaseSimulacion,
  estadosCurrentVisualesFase,
  normalizarFaseSimulacion,
  transicionesVigentesSimulacion,
} from "./fases";
import type { ContextoSimulacion, EntradaTraceSim, FaseSimulacion, PasoSimulacion, TransicionEstadoSim } from "./tipos";

export interface FocoPasoSimulacion {
  fase: "inactivo" | "inicio" | "paso" | "final";
  faseConceptual: FaseSimulacion | null;
  paso: PasoSimulacion | null;
  procesoActivoId: Id | null;
  entidadesInvolucradasIds: Id[];
  enlacesInvolucradosIds: Id[];
  estadosOrigenIds: Id[];
  estadosResultadoIds: Id[];
  estadosCurrentVisual: Record<Id, Id>;
}

export function focoPasoActualSimulacion(modelo: Modelo, contexto: ContextoSimulacion | null): FocoPasoSimulacion {
  if (!contexto || contexto.plan.length === 0) {
    return focoVacio("inactivo");
  }

  if (contexto.estado === "completado" || contexto.pasoActual >= contexto.plan.length) {
    const ultimaEntrada = contexto.trace.at(-1);
    const pasoFinal = pasoDeEntrada(contexto, ultimaEntrada) ?? contexto.plan.at(-1) ?? null;
    if (!pasoFinal) return focoVacio("final");
    const entidadesFinalesIds = entidadesFinales(modelo, pasoFinal, ultimaEntrada);
    return {
      fase: "final",
      faseConceptual: null,
      paso: pasoFinal,
      procesoActivoId: null,
      entidadesInvolucradasIds: entidadesFinalesIds,
      enlacesInvolucradosIds: [],
      estadosOrigenIds: [],
      estadosResultadoIds: estadosFinales(contexto, entidadesFinalesIds, ultimaEntrada),
      estadosCurrentVisual: contexto.estadosCurrent,
    };
  }

  const paso = contexto.plan[contexto.pasoActual] ?? null;
  if (!paso) return focoVacio("inactivo");
  const faseActual = normalizarFaseSimulacion(modelo, paso, contexto.faseActual);
  const transicionesActivas = transicionesVigentesSimulacion(paso, contexto.estadosCurrent);
  const estadosCurrentVisual = estadosCurrentVisualesFase(contexto.estadosCurrent, transicionesActivas, faseActual);

  if (contexto.estado === "preparado" && contexto.trace.length === 0) {
    const entidadesInicioIds = entidadesEntradaEnPaso(modelo, paso, transicionesActivas);
    return {
      fase: "inicio",
      faseConceptual: faseActual,
      paso,
      procesoActivoId: null,
      entidadesInvolucradasIds: entidadesInicioIds,
      enlacesInvolucradosIds: enlacesDeFaseSimulacion(modelo, paso, faseActual, contexto.estadosCurrent),
      estadosOrigenIds: unirIds(idsEstadosOrigen(transicionesActivas), estadosCurrentDeEntidades(contexto, entidadesInicioIds)),
      estadosResultadoIds: [],
      estadosCurrentVisual,
    };
  }

  const enlacesFase = enlacesDeFaseSimulacion(modelo, paso, faseActual, contexto.estadosCurrent);
  const procesoActivoId = faseActual === "preparacion" || faseActual === "cierre" ? null : paso.procesoId;
  const estadosResultadoIds = faseActual === "resultado" || faseActual === "cierre"
    ? idsEstadosResultado(transicionesActivas)
    : [];

  return {
    fase: "paso",
    faseConceptual: faseActual,
    paso,
    procesoActivoId,
    entidadesInvolucradasIds: entidadesInvolucradasEnFase(modelo, paso, procesoActivoId, enlacesFase, transicionesActivas, faseActual),
    enlacesInvolucradosIds: enlacesFase,
    estadosOrigenIds: faseActual === "consumo" || faseActual === "proceso" ? idsEstadosOrigen(transicionesActivas) : [],
    estadosResultadoIds,
    estadosCurrentVisual,
  };
}

function focoVacio(fase: FocoPasoSimulacion["fase"]): FocoPasoSimulacion {
  return {
    fase,
    faseConceptual: null,
    paso: null,
    procesoActivoId: null,
    entidadesInvolucradasIds: [],
    enlacesInvolucradosIds: [],
    estadosOrigenIds: [],
    estadosResultadoIds: [],
    estadosCurrentVisual: {},
  };
}

/**
 * Ids de estados designados como INICIAL en todo el modelo (B0.019). Puro:
 * deriva los ids cuyo estado tiene la designacion "inicial" (incluye el legado
 * `esInicial` via `tieneDesignacion`). El render lo usa para mantener un borde
 * oliva distintivo en el estado inicial durante toda la simulacion.
 */
export function estadosInicialesDelModelo(modelo: Modelo): Id[] {
  return Object.values(modelo.estados)
    .filter((estado) => tieneDesignacion(estado, "inicial"))
    .map((estado) => estado.id);
}

export function enlacesInvolucradosEnPaso(
  modelo: Modelo,
  paso: PasoSimulacion,
  estadosCurrent?: Record<Id, Id>,
): Id[] {
  const todos = Array.from(new Set([...paso.enlacesEntradaIds, ...paso.enlacesSalidaIds]));
  if (!estadosCurrent) return todos;
  const rutasActivas = new Set(
    transicionesVigentesSimulacion(paso, estadosCurrent)
      .map((transicion) => transicion.rutaEtiqueta)
      .filter((ruta): ruta is string => Boolean(ruta)),
  );
  if (rutasActivas.size === 0) return todos;
  return todos.filter((enlaceId) => {
    const enlace = modelo.enlaces[enlaceId];
    const ruta = rutaEtiquetaNormalizada(enlace?.rutaEtiqueta);
    return ruta ? rutasActivas.has(ruta) : false;
  });
}

export function entidadesInvolucradasEnPaso(modelo: Modelo, paso: PasoSimulacion, estadosCurrent?: Record<Id, Id>): Id[] {
  const ids = new Set<Id>([paso.procesoId]);
  const transiciones = estadosCurrent ? transicionesVigentesSimulacion(paso, estadosCurrent) : paso.transicionesPlanificadas;
  for (const transicion of transiciones) {
    ids.add(transicion.entidadId);
  }
  for (const enlaceId of enlacesInvolucradosEnPaso(modelo, paso, estadosCurrent)) {
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace) continue;
    const origenId = entidadIdDeExtremo(modelo, enlace.origenId);
    const destinoId = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (origenId) ids.add(origenId);
    if (destinoId) ids.add(destinoId);
  }
  return Array.from(ids);
}

function entidadesInvolucradasEnFase(
  modelo: Modelo,
  paso: PasoSimulacion,
  procesoActivoId: Id | null,
  enlacesIds: readonly Id[],
  transiciones: readonly TransicionEstadoSim[],
  fase: FaseSimulacion,
): Id[] {
  const ids = new Set<Id>();
  if (procesoActivoId) ids.add(procesoActivoId);
  for (const enlaceId of enlacesIds) {
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace) continue;
    const origenId = entidadIdDeExtremo(modelo, enlace.origenId);
    const destinoId = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (origenId) ids.add(origenId);
    if (destinoId) ids.add(destinoId);
  }
  if (fase === "consumo" || fase === "proceso") {
    for (const transicion of transiciones) {
      if (transicion.estadoAntesId !== null) ids.add(transicion.entidadId);
    }
  }
  if (fase === "resultado" || fase === "cierre") {
    for (const transicion of transiciones) {
      if (transicion.estadoDespuesId !== null) ids.add(transicion.entidadId);
    }
  }
  if (ids.size === 0) ids.add(paso.procesoId);
  return Array.from(ids);
}

function entidadesEntradaEnPaso(
  modelo: Modelo,
  paso: PasoSimulacion,
  transicionesActivas: readonly TransicionEstadoSim[],
): Id[] {
  const ids = new Set<Id>();
  for (const transicion of transicionesActivas) {
    if (transicion.estadoAntesId !== null) ids.add(transicion.entidadId);
  }
  for (const enlaceId of paso.enlacesEntradaIds) {
    const enlace = modelo.enlaces[enlaceId];
    const entidadId = enlace ? entidadIdDeExtremo(modelo, enlace.origenId) : null;
    if (entidadId) ids.add(entidadId);
  }
  return Array.from(ids);
}

function entidadesFinales(
  modelo: Modelo,
  paso: PasoSimulacion,
  ultimaEntrada: EntradaTraceSim | undefined,
): Id[] {
  const ids = new Set<Id>();
  for (const transicion of ultimaEntrada?.transicionesAplicadas ?? []) {
    if (transicion.estadoDespuesId !== null) ids.add(transicion.entidadId);
  }
  for (const enlaceId of paso.enlacesSalidaIds) {
    const enlace = modelo.enlaces[enlaceId];
    const entidadId = enlace ? entidadIdDeExtremo(modelo, enlace.destinoId) : null;
    if (entidadId) ids.add(entidadId);
  }
  return Array.from(ids);
}

function estadosFinales(
  contexto: ContextoSimulacion,
  entidadesFinalesIds: readonly Id[],
  ultimaEntrada: EntradaTraceSim | undefined,
): Id[] {
  const ids = new Set<Id>();
  for (const transicion of ultimaEntrada?.transicionesAplicadas ?? []) {
    if (transicion.estadoDespuesId !== null) ids.add(transicion.estadoDespuesId);
  }
  for (const entidadId of entidadesFinalesIds) {
    const estadoCurrentId = contexto.estadosCurrent[entidadId];
    if (estadoCurrentId) ids.add(estadoCurrentId);
  }
  return Array.from(ids);
}

function estadosCurrentDeEntidades(contexto: ContextoSimulacion, entidadesIds: readonly Id[]): Id[] {
  return entidadesIds
    .map((entidadId) => contexto.estadosCurrent[entidadId])
    .filter((estadoId): estadoId is Id => Boolean(estadoId));
}

function pasoDeEntrada(contexto: ContextoSimulacion, entrada: EntradaTraceSim | undefined): PasoSimulacion | null {
  if (!entrada) return null;
  return contexto.plan.find((paso) => paso.opdId === entrada.opdId && paso.procesoId === entrada.procesoId) ?? null;
}

function idsEstadosOrigen(transiciones: readonly TransicionEstadoSim[]): Id[] {
  return Array.from(new Set(
    transiciones
      .map((transicion) => transicion.estadoAntesId)
      .filter((estadoId): estadoId is Id => estadoId !== null),
  ));
}

function idsEstadosResultado(transiciones: readonly TransicionEstadoSim[]): Id[] {
  return Array.from(new Set(
    transiciones
      .map((transicion) => transicion.estadoDespuesId)
      .filter((estadoId): estadoId is Id => estadoId !== null),
  ));
}

function unirIds(...listas: readonly Id[][]): Id[] {
  return Array.from(new Set(listas.flat()));
}
