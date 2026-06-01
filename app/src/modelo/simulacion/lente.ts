import type { Id, Modelo } from "../tipos";
import type { ContextoSimulacion } from "./tipos";
import { pasoEfecto } from "./runner";

/**
 * Lente (Moore machine) de un proceso OPM.
 * observar: proyecta el estado al efecto (sucesores).
 * actualizar: dado un estado e input (elegido), avanza al siguiente.
 */
export interface LenteProceso {
  procesoId: Id;
  /** Produce el efecto del paso (observable + posible ramificacion). */
  observar: (modelo: Modelo, estado: ContextoSimulacion) => ContextoSimulacion;
}

/**
 * Construye la lente de un proceso hoja (sin descomposicion).
 * Es exactamente el paso atomico restringido a ese proceso.
 */
export function lenteDeProcesoAtomica(
  modelo: Modelo,
  procesoId: Id,
): LenteProceso | null {
  if (!modelo.entidades[procesoId]) return null;
  return {
    procesoId,
    observar: (m, estado) => {
      if (estado.pasoActual >= estado.plan.length) return estado;
      const paso = estado.plan[estado.pasoActual];
      if (paso && paso.procesoId === procesoId) {
        const e = pasoEfecto(m, estado);
        return e.sucesores[0]?.estado ?? estado;
      }
      return estado;
    },
  };
}

/**
 * Compone las lentes de subprocesos para un proceso con descomposicion sincrona.
 * Ejecuta los subprocesos en orden (orden Y) y devuelve el estado compuesto.
 * Es el reemplazo del aplanamiento recursivo en plan.ts.
 */
export function componerSubprocesos(
  modelo: Modelo,
  estado: ContextoSimulacion,
  subprocesoIds: Id[],
): ContextoSimulacion {
  let actual = { ...estado };
  const lentes = subprocesoIds
    .map((id) => lenteDeProcesoAtomica(modelo, id))
    .filter((l): l is LenteProceso => l !== null);

  for (const lente of lentes) {
    let subEstado = { ...actual, plan: actual.plan.filter((p) => p.procesoId === lente.procesoId) };
    while (subEstado.pasoActual < subEstado.plan.length) {
      subEstado = lente.observar(modelo, subEstado);
    }
    actual = { ...actual, ...subEstado, plan: actual.plan };
  }
  return actual;
}
