import type { Id, ValorConcreto } from "../tipos";

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
  /** OPD donde vive visualmente este paso. La simulacion puede cambiar de OPD
   *  al entrar en una descomposicion/in-zoom. */
  opdId: Id;
  opdNombre: string;
  /** Profundidad en el arbol OPD desde el OPD donde se inicio la corrida. */
  profundidad: number;
  /** Proceso que invoco este OPD por descomposicion, si aplica. */
  procesoPadreId?: Id;
  procesoId: Id;
  procesoNombre: string;
  /** Coordenada Y del proceso en el OPD: ordenador canónico (HU-B0.013). */
  ordenY: number;
  /** Si el proceso activo tiene descomposicion, el proximo nivel se ejecuta
   *  sincronicamente despues de marcar el proceso padre. */
  opdHijoId?: Id;
  opdHijoNombre?: string;
  enlacesEntradaIds: Id[];
  enlacesSalidaIds: Id[];
  /** Transiciones de estado inferidas estáticamente del modelo. La ejecución
   *  valida contra estados current observados; si no coincide, emite
   *  diagnóstico y no muta el contexto. */
  transicionesPlanificadas: TransicionEstadoSim[];
}

/** Un cambio de valor runtime sobre un atributo durante un paso (Beta2 L3). */
export interface CambioValorRuntime {
  entidadId: Id;
  /** Valor previo runtime; `undefined` si el atributo no tenía valor. */
  antes: ValorConcreto | undefined;
  despues: ValorConcreto;
}

/** Una entrada del trace tras ejecutar un paso. */
export interface EntradaTraceSim {
  /** 1-indexed. */
  numero: number;
  opdId: Id;
  opdNombre: string;
  procesoId: Id;
  procesoNombre: string;
  transicionesAplicadas: TransicionEstadoSim[];
  /** Cambios de valor runtime aplicados (asignación atributo→atributo, L3). */
  cambiosValor: CambioValorRuntime[];
  /** Texto canónico cuando el paso no pudo aplicar todas las transiciones
   *  planificadas o cambios de valor. Razón corta legible. */
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
  /** Valores runtime por entidadId (atributos con valorSlot). Separados del
   *  modelo persistente: las mutaciones de simulación NUNCA tocan
   *  `Entidad.valorSlot.valor` original. */
  valoresRuntime: Record<Id, ValorConcreto>;
  trace: EntradaTraceSim[];
}
