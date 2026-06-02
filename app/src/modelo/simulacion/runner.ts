import type { Abanico, Enlace, Id, Modelo } from "../tipos";
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
  const abanico = abanicoXorDeSalida(modelo, paso.procesoId);
  const estadosRama = abanico ? estadosDestinoDeRamas(modelo, abanico) : new Set<Id>();
  const transicionesAplicadas: TransicionEstadoSim[] = [];
  const motivosBloqueo: string[] = [];
  const estadosCurrent: Record<Id, Id> = { ...contexto.estadosCurrent };

  for (const transicion of paso.transicionesPlanificadas) {
    // Las transiciones cuyo destino es un estado del abanico XOR son ALTERNATIVAS
    // de rama: no se aplican en bloque, sólo la de la rama elegida (S2, BUG-1).
    if (transicion.estadoDespuesId !== null && estadosRama.has(transicion.estadoDespuesId)) continue;
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

  if (!abanico) return efectoUnico(siguiente);

  const modo = contexto.modo ?? "determinista";
  if (modo === "exhaustivo") {
    const peso = 1 / abanico.enlaceIds.length;
    return { sucesores: abanico.enlaceIds.map((enlaceId) => sucesorDeRama(modelo, siguiente, enlaceId, peso)) };
  }
  if (modo === "muestreo") {
    const random = rngSembrado(contexto.semilla ?? 0);
    const d = resolverDecisionAbanico(modelo, abanico.id, { random });
    let enlaceId: Id;
    let peso: number;
    if (d.ok && d.value.enlaceId) {
      enlaceId = d.value.enlaceId;
      peso = d.value.probabilidades?.[enlaceId] ?? 1;
    } else {
      // Sin política resoluble (ramas hacia estados sin Pr): Dist uniforme sobre las ramas.
      const idx = Math.min(Math.floor(random() * abanico.enlaceIds.length), abanico.enlaceIds.length - 1);
      enlaceId = abanico.enlaceIds[idx]!;
      peso = 1 / abanico.enlaceIds.length;
    }
    // La semilla EVOLUCIONA para el próximo paso: abanicos sucesivos deben ser
    // independientes (no correlacionados) pero reproducibles desde la semilla raíz.
    const semillaSiguiente = Math.floor(random() * 0x100000000);
    const suc = sucesorDeRama(modelo, siguiente, enlaceId, peso);
    return { sucesores: [{ ...suc, estado: { ...suc.estado, semilla: semillaSiguiente } }] };
  }
  const elegido = [...abanico.enlaceIds].sort(
    (x, y) => (modelo.enlaces[y]?.probabilidad ?? 0) - (modelo.enlaces[x]?.probabilidad ?? 0),
  )[0]!;
  return { sucesores: [sucesorDeRama(modelo, siguiente, elegido)] };
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

/** Estados destino de las ramas de un abanico XOR: sus transiciones son alternativas. */
function estadosDestinoDeRamas(modelo: Modelo, abanico: Abanico): Set<Id> {
  const estados = new Set<Id>();
  for (const enlaceId of abanico.enlaceIds) {
    const enlace = modelo.enlaces[enlaceId];
    if (enlace?.destinoId.kind === "estado") estados.add(enlace.destinoId.id);
  }
  return estados;
}

/** Sucesor de una rama del abanico: aplica SU transición sobre el estado base. */
function sucesorDeRama(modelo: Modelo, base: ContextoSimulacion, enlaceId: Id, peso = 1): Sucesor<ContextoSimulacion> {
  const enlace = modelo.enlaces[enlaceId];
  const rama = enlace?.etiqueta || enlaceId;
  return { estado: aplicarTransicionDeRama(modelo, base, enlace, rama), rama, peso };
}

/**
 * Aplica la transición de la rama elegida sobre el estado base, INMUTABLEMENTE.
 * Los sucesores de un abanico comparten `base` pero cada uno produce su propio
 * estado (no se muta `base.trace`): copia la última entrada y le añade la
 * transición de la rama + la anotación (S2, BUG-1/BUG-6).
 */
function aplicarTransicionDeRama(
  modelo: Modelo,
  base: ContextoSimulacion,
  enlace: Enlace | undefined,
  rama: string,
): ContextoSimulacion {
  const estadosCurrent: Record<Id, Id> = { ...base.estadosCurrent };
  let transicionRama: TransicionEstadoSim | undefined;
  if (enlace && enlace.destinoId.kind === "estado") {
    const destino = modelo.estados[enlace.destinoId.id];
    if (destino) {
      const antes = base.estadosCurrent[destino.entidadId] ?? null;
      estadosCurrent[destino.entidadId] = destino.id;
      transicionRama = { entidadId: destino.entidadId, estadoAntesId: antes, estadoDespuesId: destino.id };
    }
  }

  const trace = [...base.trace];
  const idx = trace.length - 1;
  const ultima = idx >= 0 ? trace[idx] : undefined;
  if (ultima) {
    const modo = base.modo ?? "determinista";
    const semillaStr = base.semilla != null ? `, semilla ${base.semilla}` : "";
    const prStr = modo === "muestreo" && enlace?.probabilidad != null ? ` (Pr ${enlace.probabilidad})` : "";
    trace[idx] = {
      ...ultima,
      transicionesAplicadas: transicionRama
        ? [...ultima.transicionesAplicadas, transicionRama]
        : ultima.transicionesAplicadas,
      diagnostico: `rama «${rama}» · ${modo}${prStr}${semillaStr}`,
    };
  }

  return { ...base, estadosCurrent, trace };
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
