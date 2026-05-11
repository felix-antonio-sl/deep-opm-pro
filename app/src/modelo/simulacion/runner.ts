import type { Id, Modelo } from "../tipos";
import { estadosCurrentIniciales, planificarSimulacion } from "./plan";
import type { ContextoSimulacion, EntradaTraceSim, TransicionEstadoSim } from "./tipos";

/**
 * Inicia una simulación conceptual sobre un OPD. No muta el modelo.
 * Si no hay procesos en el OPD, el contexto nace `completado` con plan vacío.
 */
export function iniciarSimulacion(modelo: Modelo, opdId: Id): ContextoSimulacion {
  const plan = planificarSimulacion(modelo, opdId);
  return {
    modeloId: modelo.id,
    opdId,
    plan,
    pasoActual: 0,
    estado: plan.length === 0 ? "completado" : "preparado",
    estadosCurrent: estadosCurrentIniciales(modelo),
    trace: [],
  };
}

/**
 * Ejecuta el próximo paso planificado. Determinista; sin efectos sobre el
 * modelo persistente. Devuelve nuevo contexto.
 *
 * Reglas de aplicación:
 *   - Si pasoActual >= plan.length: marca completado, no produce trace nuevo.
 *   - Para cada transición planificada con `estadoAntesId`: si el current del
 *     objeto no coincide, NO se aplica esa transición y se acumula diagnóstico.
 *   - Transiciones con `estadoAntesId=null` (creación) siempre aplican.
 *   - Transiciones con `estadoDespuesId=null` (terminación) borran el current.
 */
export function ejecutarPaso(modelo: Modelo, contexto: ContextoSimulacion): ContextoSimulacion {
  if (contexto.pasoActual >= contexto.plan.length) {
    return contexto.estado === "completado" ? contexto : { ...contexto, estado: "completado" };
  }

  const paso = contexto.plan[contexto.pasoActual]!;
  const transicionesAplicadas: TransicionEstadoSim[] = [];
  const motivosBloqueo: string[] = [];
  const estadosCurrent: Record<Id, Id> = { ...contexto.estadosCurrent };

  for (const transicion of paso.transicionesPlanificadas) {
    if (transicion.estadoAntesId !== null) {
      const observado = estadosCurrent[transicion.entidadId] ?? null;
      if (observado !== transicion.estadoAntesId) {
        const entidadNombre = modelo.entidades[transicion.entidadId]?.nombre ?? transicion.entidadId;
        const esperado = modelo.estados[transicion.estadoAntesId]?.nombre ?? transicion.estadoAntesId;
        motivosBloqueo.push(`${entidadNombre} no está en estado ${esperado}`);
        continue;
      }
    }
    if (transicion.estadoDespuesId !== null) {
      estadosCurrent[transicion.entidadId] = transicion.estadoDespuesId;
    } else if (transicion.estadoAntesId !== null) {
      delete estadosCurrent[transicion.entidadId];
    }
    transicionesAplicadas.push(transicion);
  }

  const entrada: EntradaTraceSim = {
    numero: contexto.pasoActual + 1,
    procesoId: paso.procesoId,
    procesoNombre: paso.procesoNombre,
    transicionesAplicadas,
  };
  if (motivosBloqueo.length > 0) {
    entrada.diagnostico = `No simulable: ${motivosBloqueo.join("; ")}`;
  }

  const nuevoPaso = contexto.pasoActual + 1;
  return {
    ...contexto,
    pasoActual: nuevoPaso,
    estado: nuevoPaso >= contexto.plan.length ? "completado" : "ejecutando",
    estadosCurrent,
    trace: [...contexto.trace, entrada],
  };
}

/**
 * Reinicia la simulación al estado inicial preservando el modeloId/opdId.
 * Equivale a un nuevo `iniciarSimulacion` sobre el mismo OPD.
 */
export function reiniciarSimulacion(modelo: Modelo, contexto: ContextoSimulacion): ContextoSimulacion {
  return iniciarSimulacion(modelo, contexto.opdId);
}

/**
 * Ejecuta todos los pasos restantes en orden hasta completar. Útil para
 * "Play" sin animación. Cap de seguridad implícito: el plan es finito.
 */
export function ejecutarCorrida(modelo: Modelo, contexto: ContextoSimulacion): ContextoSimulacion {
  let actual = contexto;
  while (actual.pasoActual < actual.plan.length) {
    actual = ejecutarPaso(modelo, actual);
  }
  return actual;
}
