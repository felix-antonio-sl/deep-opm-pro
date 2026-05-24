import { tieneDesignacion } from "../estadosDesignaciones";
import { entidadIdDeExtremo } from "../extremos";
import type { Id, Modelo } from "../tipos";
import type { ContextoSimulacion, PasoSimulacion } from "./tipos";

export interface FocoPasoSimulacion {
  paso: PasoSimulacion | null;
  procesoActivoId: Id | null;
  entidadesInvolucradasIds: Id[];
  enlacesInvolucradosIds: Id[];
}

export function focoPasoActualSimulacion(modelo: Modelo, contexto: ContextoSimulacion | null): FocoPasoSimulacion {
  const paso = contexto && contexto.pasoActual < contexto.plan.length
    ? contexto.plan[contexto.pasoActual] ?? null
    : null;
  if (!paso) {
    return {
      paso: null,
      procesoActivoId: null,
      entidadesInvolucradasIds: [],
      enlacesInvolucradosIds: [],
    };
  }

  return {
    paso,
    procesoActivoId: paso.procesoId,
    entidadesInvolucradasIds: entidadesInvolucradasEnPaso(modelo, paso),
    enlacesInvolucradosIds: enlacesInvolucradosEnPaso(paso),
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

export function enlacesInvolucradosEnPaso(paso: PasoSimulacion): Id[] {
  return Array.from(new Set([...paso.enlacesEntradaIds, ...paso.enlacesSalidaIds]));
}

export function entidadesInvolucradasEnPaso(modelo: Modelo, paso: PasoSimulacion): Id[] {
  const ids = new Set<Id>([paso.procesoId]);
  for (const transicion of paso.transicionesPlanificadas) {
    ids.add(transicion.entidadId);
  }
  for (const enlaceId of enlacesInvolucradosEnPaso(paso)) {
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace) continue;
    const origenId = entidadIdDeExtremo(modelo, enlace.origenId);
    const destinoId = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (origenId) ids.add(origenId);
    if (destinoId) ids.add(destinoId);
  }
  return Array.from(ids);
}
