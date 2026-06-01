import type { Id, Modelo } from "../tipos";
import { estadosCurrentIniciales, planificarSimulacion } from "./plan";
import type { ContextoSimulacion, EntradaTraceSim, TransicionEstadoSim } from "./tipos";
import { aplicarCambiosValor, iniciarValoresRuntime } from "./valores";
import { efectoUnico, tomarUnico, type Efecto } from "./efecto";

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
    valoresRuntime: iniciarValoresRuntime(modelo),
    trace: [],
  };
}

/**
 * La coalgebra: dado el estado actual, produce el efecto con su(s) sucesor(es).
 * F = Identidad (un sucesor). S2 extendera esta funcion para Powerset/Dist.
 */
export function pasoEfecto(modelo: Modelo, contexto: ContextoSimulacion): Efecto<ContextoSimulacion> {
  if (contexto.pasoActual >= contexto.plan.length) {
    const completado = contexto.estado === "completado" ? contexto : { ...contexto, estado: "completado" as const };
    return efectoUnico(completado);
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

  const { valoresNuevos, cambios: cambiosValor, motivos: motivosValor } = aplicarCambiosValor(
    modelo,
    contexto.valoresRuntime,
    paso,
  );
  motivosBloqueo.push(...motivosValor);

  const entrada: EntradaTraceSim = {
    numero: contexto.pasoActual + 1,
    opdId: paso.opdId,
    opdNombre: paso.opdNombre,
    procesoId: paso.procesoId,
    procesoNombre: paso.procesoNombre,
    transicionesAplicadas,
    cambiosValor,
  };
  if (motivosBloqueo.length > 0) {
    entrada.diagnostico = `No simulable: ${motivosBloqueo.join("; ")}`;
  }

  const nuevoPaso = contexto.pasoActual + 1;
  const siguiente: ContextoSimulacion = {
    ...contexto,
    pasoActual: nuevoPaso,
    estado: nuevoPaso >= contexto.plan.length ? "completado" : "ejecutando",
    estadosCurrent,
    valoresRuntime: valoresNuevos,
    trace: [...contexto.trace, entrada],
  };
  return efectoUnico(siguiente);
}

/**
 * Compat: avanza un paso tomando el sucesor canonico. Comportamiento identico al previo.
 */
export function ejecutarPaso(modelo: Modelo, contexto: ContextoSimulacion): ContextoSimulacion {
  return tomarUnico(pasoEfecto(modelo, contexto));
}

/**
 * El unfold (anamorfismo): despliega la coalgebra desde un estado hasta
 * completar, tomando el sucesor canonico en cada paso. F = Identidad =>
 * traza determinista identica a iterar `ejecutarPaso`.
 */
export function desplegar(modelo: Modelo, estadoInicial: ContextoSimulacion): ContextoSimulacion {
  let actual = estadoInicial;
  while (actual.pasoActual < actual.plan.length) {
    actual = tomarUnico(pasoEfecto(modelo, actual));
  }
  return actual;
}

/**
 * Reinicia la simulación al estado inicial preservando el modeloId/opdId.
 * Equivale a un nuevo `iniciarSimulacion` sobre el mismo OPD.
 */
export function reiniciarSimulacion(modelo: Modelo, contexto: ContextoSimulacion): ContextoSimulacion {
  return iniciarSimulacion(modelo, contexto.opdId);
}

/**
 * Compat: corre todos los pasos restantes. Delega en el unfold.
 */
export function ejecutarCorrida(modelo: Modelo, contexto: ContextoSimulacion): ContextoSimulacion {
  return desplegar(modelo, contexto);
}
