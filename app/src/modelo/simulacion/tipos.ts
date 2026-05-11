import type { Id } from "../tipos";

/**
 * Tipos del kernel de simulación conceptual (Beta2 / Ronda 17 L1).
 *
 * Slice mínimo determinista: representa pasos derivados del modelo y un
 * contexto inmutable que avanza con `ejecutarPaso`. Sin user functions,
 * sin probabilidad, sin async paralelo (HU-B0.013 ordena por Y ascendente).
 *
 * Refs:
 *   - SSOT opm-iso-19450-es.md §3.69 (Process), §3.71 (State).
 *   - opm-extracted/src/app/dialogs/simulationElement/* (referencia UX/alcance).
 *   - docs/historias-usuario-v2/epicas/epica-b0-simulacion-conceptual.md
 *     HU-B0.005 (play), B0.013 (orden Y), B0.027 (transición de estado).
 */

/** Una transición de estado proyectada sobre un objeto durante un paso. */
export interface TransicionEstadoSim {
  entidadId: Id;
  /** Estado actual esperado al iniciar el paso. `null` = el objeto no tiene
   *  estado previo (creación). */
  estadoAntesId: Id | null;
  /** Estado resultante tras ejecutar el paso. `null` = el estado se consume
   *  sin reemplazo (terminación). */
  estadoDespuesId: Id | null;
}

/** Un paso ejecutable del plan de simulación. */
export interface PasoSimulacion {
  procesoId: Id;
  procesoNombre: string;
  /** Coordenada Y del proceso en el OPD: ordenador canónico (HU-B0.013). */
  ordenY: number;
  enlacesEntradaIds: Id[];
  enlacesSalidaIds: Id[];
  /** Transiciones de estado inferidas estáticamente del modelo. La ejecución
   *  valida contra estados current observados; si no coincide, emite
   *  diagnóstico y no muta el contexto. */
  transicionesPlanificadas: TransicionEstadoSim[];
}

/** Una entrada del trace tras ejecutar un paso. */
export interface EntradaTraceSim {
  /** 1-indexed. */
  numero: number;
  procesoId: Id;
  procesoNombre: string;
  transicionesAplicadas: TransicionEstadoSim[];
  /** Texto canónico cuando el paso no pudo aplicar todas las transiciones
   *  planificadas. Razón corta legible. */
  diagnostico?: string;
}

export type EstadoSimulacion = "preparado" | "ejecutando" | "completado" | "bloqueado";

/** Contexto de simulación. Inmutable: cada operación devuelve uno nuevo. */
export interface ContextoSimulacion {
  modeloId: Id;
  opdId: Id;
  plan: PasoSimulacion[];
  /** Índice del próximo paso a ejecutar (0..plan.length). */
  pasoActual: number;
  estado: EstadoSimulacion;
  /** Estado current por entidadId derivado de designaciones + transiciones. */
  estadosCurrent: Record<Id, Id>;
  trace: EntradaTraceSim[];
}
