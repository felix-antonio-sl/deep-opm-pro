import type { Abanico, Id, Modelo } from "../tipos";
import { estadosCurrentIniciales, planificarSimulacion } from "./plan";
import type { ContextoSimulacion, EntradaTraceSim, TransicionEstadoSim } from "./tipos";
import { aplicarCambiosValor, iniciarValoresRuntime } from "./valores";
import { efectoUnico, tomarUnico, type Efecto, type Sucesor } from "./efecto";
import { resolverDecisionAbanico } from "../decision";
import { rngSembrado } from "./rng";

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

  const duracionPaso = inferirDuracionPaso(modelo, transicionesAplicadas);
  if (duracionPaso !== undefined) entrada.duracion = duracionPaso;

  if (motivosBloqueo.length > 0) {
    entrada.diagnostico = `No simulable: ${motivosBloqueo.join("; ")}`;
  }

  const nuevoPaso = contexto.pasoActual + 1;
  const relojNuevo = (contexto.reloj ?? 0) + (duracionPaso ?? 0);
  const siguiente: ContextoSimulacion = {
    ...contexto,
    pasoActual: nuevoPaso,
    estado: nuevoPaso >= contexto.plan.length ? "completado" : "ejecutando",
    estadosCurrent,
    valoresRuntime: valoresNuevos,
    trace: [...contexto.trace, entrada],
    reloj: relojNuevo,
  };

  const abanico = abanicoXorDeSalida(modelo, paso.procesoId);
  const modo = contexto.modo ?? "determinista";
  if (abanico) {
    if (modo === "exhaustivo") {
      return {
        sucesores: abanico.enlaceIds.map((enlaceId) => ({
          estado: aplicarRamaAbanico(modelo, siguiente, abanico, enlaceId, paso),
          rama: modelo.enlaces[enlaceId]?.etiqueta || enlaceId,
          peso: 1 / abanico.enlaceIds.length,
        })),
      };
    }
    if (modo === "muestreo") {
      const random = rngSembrado(contexto.semilla ?? Date.now());
      const d = resolverDecisionAbanico(modelo, abanico.id, { random });
      if (d.ok && d.value.enlaceId) {
        return {
          sucesores: [{
            estado: aplicarRamaAbanico(modelo, siguiente, abanico, d.value.enlaceId, paso),
            rama: modelo.enlaces[d.value.enlaceId]?.etiqueta || d.value.enlaceId,
            peso: d.value.probabilidades?.[d.value.enlaceId] ?? 1,
          }],
        };
      }
    }
    const elegido = [...abanico.enlaceIds].sort(
      (x, y) => (modelo.enlaces[y]?.probabilidad ?? 0) - (modelo.enlaces[x]?.probabilidad ?? 0),
    )[0]!;
    return {
      sucesores: [{
        estado: aplicarRamaAbanico(modelo, siguiente, abanico, elegido, paso),
        rama: modelo.enlaces[elegido]?.etiqueta || elegido,
        peso: 1,
      }],
    };
  }
  return efectoUnico(siguiente);
}

/**
 * Compat: avanza un paso tomando el sucesor canonico. Comportamiento identico al previo.
 */
export function ejecutarPaso(modelo: Modelo, contexto: ContextoSimulacion): ContextoSimulacion {
  return tomarUnico(pasoEfecto(modelo, contexto));
}

function abanicoXorDeSalida(modelo: Modelo, procesoId: Id): Abanico | undefined {
  return Object.values(modelo.abanicos ?? {}).find(
    (a) => a.operador === "XOR" && a.puertoEntidadId === procesoId,
  );
}

/**
 * Aplica al estado la transicion de la rama elegida del abanico XOR.
 * Anota la rama en el diagnostico/no-anotacion de la ultima entrada del trace.
 */
function aplicarRamaAbanico(
  modelo: Modelo,
  estado: ContextoSimulacion,
  abanico: Abanico,
  enlaceId: Id,
  _paso: ContextoSimulacion["plan"][number],
): ContextoSimulacion {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return estado;

  const trace = [...estado.trace];
  const ultima = trace[trace.length - 1];
  if (ultima) {
    const ramaEtiqueta = enlace.etiqueta || enlaceId;
    const modo = estado.modo ?? "determinista";
    const semillaStr = estado.semilla != null ? `, semilla ${estado.semilla}` : "";
    const prStr = modo === "muestreo" ? `Pr ${enlace.probabilidad ?? "-"}` : "";
    ultima.diagnostico = `rama «${ramaEtiqueta}» · ${modo}${prStr ? ` (${prStr})` : ""}${semillaStr}`;
  }

  return estado;
}

function inferirDuracionPaso(
  modelo: Modelo,
  transiciones: TransicionEstadoSim[],
): number | undefined {
  for (const t of transiciones) {
    const estadoId = t.estadoDespuesId ?? t.estadoAntesId;
    if (!estadoId) continue;
    const estado = modelo.estados[estadoId];
    if (estado?.duracion) return estado.duracion.nominal;
  }
  return undefined;
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

export interface NodoTraza {
  estado: ContextoSimulacion;
  rama?: string;
  hijos: NodoTraza[];
}

/**
 * Exhaustivo: arbol de ejecucion hasta un limite de nodos (anti-explosion).
 */
export function desplegarArbol(modelo: Modelo, ini: ContextoSimulacion, limite = 200): { raiz: NodoTraza; truncado: boolean } {
  let contador = 0;
  let truncado = false;
  const construir = (estado: ContextoSimulacion): NodoTraza => {
    if (estado.pasoActual >= estado.plan.length || contador >= limite) {
      if (contador >= limite) truncado = true;
      return { estado, hijos: [] };
    }
    contador += 1;
    const e = pasoEfecto(modelo, estado);
    const nodo: NodoTraza = { estado, hijos: [] };
    nodo.hijos = e.sucesores.map((s) => {
      const hijo = construir(s.estado);
      if (s.rama !== undefined) hijo.rama = s.rama;
      return hijo;
    });
    return nodo;
  };
  return { raiz: construir(ini), truncado };
}
