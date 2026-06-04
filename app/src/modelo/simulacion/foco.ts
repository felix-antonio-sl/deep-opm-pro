import { tieneDesignacion } from "../estadosDesignaciones";
import { entidadIdDeExtremo } from "../extremos";
import { rutaEtiquetaNormalizada } from "../rutas";
import type { Id, Modelo } from "../tipos";
import type { ContextoSimulacion, PasoSimulacion, TransicionEstadoSim } from "./tipos";

export interface FocoPasoSimulacion {
  paso: PasoSimulacion | null;
  procesoActivoId: Id | null;
  entidadesInvolucradasIds: Id[];
  enlacesInvolucradosIds: Id[];
  estadosOrigenIds: Id[];
  estadosResultadoIds: Id[];
}

export function focoPasoActualSimulacion(modelo: Modelo, contexto: ContextoSimulacion | null): FocoPasoSimulacion {
  const paso = contexto && contexto.pasoActual < contexto.plan.length
    ? contexto.plan[contexto.pasoActual] ?? null
    : null;
  if (!contexto || !paso) {
    return {
      paso: null,
      procesoActivoId: null,
      entidadesInvolucradasIds: [],
      enlacesInvolucradosIds: [],
      estadosOrigenIds: [],
      estadosResultadoIds: [],
    };
  }
  const transicionesActivas = transicionesActivasEnPaso(paso, contexto.estadosCurrent);

  return {
    paso,
    procesoActivoId: paso.procesoId,
    entidadesInvolucradasIds: entidadesInvolucradasEnPaso(modelo, paso, contexto.estadosCurrent),
    enlacesInvolucradosIds: enlacesInvolucradosEnPaso(modelo, paso, contexto.estadosCurrent),
    estadosOrigenIds: idsEstadosOrigen(transicionesActivas),
    estadosResultadoIds: idsEstadosResultado(transicionesActivas),
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
    transicionesActivasEnPaso(paso, estadosCurrent)
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
  const transiciones = estadosCurrent ? transicionesActivasEnPaso(paso, estadosCurrent) : paso.transicionesPlanificadas;
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

function transicionesActivasEnPaso(paso: PasoSimulacion, estadosCurrent: Record<Id, Id>): TransicionEstadoSim[] {
  const grupos = new Map<Id, TransicionEstadoSim[]>();
  for (const transicion of paso.transicionesPlanificadas) {
    const grupo = grupos.get(transicion.entidadId);
    if (grupo) grupo.push(transicion);
    else grupos.set(transicion.entidadId, [transicion]);
  }
  const activas: TransicionEstadoSim[] = [];
  for (const [entidadId, transiciones] of grupos) {
    if (transiciones.length === 1) {
      activas.push(...transiciones);
      continue;
    }
    const conEstadoEntrada = transiciones.filter((transicion) => transicion.estadoAntesId !== null);
    if (conEstadoEntrada.length === 0) {
      activas.push(...transiciones);
      continue;
    }
    activas.push(...conEstadoEntrada.filter((transicion) => estadosCurrent[entidadId] === transicion.estadoAntesId));
  }
  return activas;
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
