import type { Abanico, Enlace, Id, Modelo } from "../tipos";
import { entidadIdDeExtremo, nombreExtremo } from "../extremos";
import { estadosCurrentDeclarados, estadosCurrentIniciales, planificarSimulacion } from "./plan";
import type { ContextoSimulacion, EntradaTraceSim, EventoTemporalSim, ModoSimulacion, TransicionEstadoSim } from "./tipos";
import { aplicarCambiosValor, iniciarValoresRuntime } from "./valores";
import { efectoUnico, tomarUnico, type Efecto, type Sucesor } from "./efecto";
import { resolverDecisionAbanico } from "../decision";
import { rngSembrado } from "./rng";
import { detectarEventosTemporalesPaso, inferirDuracionPasoSim } from "./tiempo";
import { normalizarFaseSimulacion, primeraFaseSimulacion, siguienteFaseSimulacion } from "./fases";
import { evaluateEnablers } from "./enablers";
import { conocimientoRuntimeEscenario } from "./scenario";
import type { ConocimientoRuntimeEscenario, EscenarioSimulacion, ResultadoPasoEscenario, ReferenciaEvidenciaEscenario } from "./scenario";

export const LIMITE_PASOS_SIMULACION = 200;

export interface OpcionesInicioSimulacion {
  semilla?: number;
  escenario?: EscenarioSimulacion;
}

/**
 * Inicia una simulación conceptual sobre un OPD. No muta el modelo.
 * Si no hay procesos en el OPD, el contexto nace `completado` con plan vacío.
 */
export function iniciarSimulacion(modelo: Modelo, opdId: Id, opciones: OpcionesInicioSimulacion = {}): ContextoSimulacion {
  const plan = planificarSimulacion(modelo, opdId);
  const rngInicial = opciones.semilla !== undefined ? rngSembrado(opciones.semilla) : undefined;
  const estadosCurrent = opciones.escenario
    ? estadosCurrentDeclarados(modelo)
    : estadosCurrentIniciales(modelo);
  if (opciones.escenario?.modeloId === modelo.id) {
    for (const [entidadId, dato] of Object.entries(opciones.escenario.conocimientoInicial.estadosCurrent)) {
      if (dato.estado === "conocido") estadosCurrent[entidadId] = dato.valor;
      else delete estadosCurrent[entidadId];
    }
  }
  return {
    modeloId: modelo.id,
    opdId,
    plan,
    pasoActual: 0,
    faseActual: primeraFaseSimulacion(modelo, plan[0]),
    estado: plan.length === 0 ? "completado" : "preparado",
    estadosCurrent,
    valoresRuntime: iniciarValoresRuntime(modelo, rngInicial),
    trace: [],
    ...(opciones.semilla !== undefined ? { semilla: opciones.semilla } : {}),
    ...(opciones.escenario ? { escenario: opciones.escenario } : {}),
  };
}

/**
 * La coalgebra: dado el estado actual, produce el efecto con su(s) sucesor(es).
 * El runner mantiene el camino secuencial por defecto y expone sucesores
 * alternativos para decisiones XOR resolubles por semilla, exhaustivo o UI.
 */
export function pasoEfecto(modelo: Modelo, contexto: ContextoSimulacion): Efecto<ContextoSimulacion> {
  if (contexto.estado === "bloqueado") return efectoUnico(contexto);
  if (contexto.pasoActual >= contexto.plan.length) {
    const completado = contexto.estado === "completado" ? contexto : { ...contexto, estado: "completado" as const };
    return efectoUnico(completado);
  }

  const paso = contexto.plan[contexto.pasoActual]!;
  if (contexto.escenario && contexto.escenario.modeloId !== modelo.id) {
    return efectoUnico(bloquearPaso(
      modelo,
      contexto,
      paso,
      "No soportado: el escenario pertenece a otro modelo",
      "no-soportado",
      [{ tipo: "declaracion", id: contexto.escenario.id }],
    ));
  }
  const conocimiento = conocimientoRuntimeEscenario(contexto.escenario, contexto.estadosCurrent);
  const eventos = evaluarModificadores(modelo, paso, conocimiento, "evento");
  if (eventos.satisfechas.length === 0 && eventos.incumplidas.length > 0 && eventos.desconocidas.length === 0) {
    return efectoUnico(omitirPaso(
      modelo,
      contexto,
      paso,
      `evento no ocurrido (${eventos.incumplidas.map((item) => item.motivo).join("; ")})`,
      "evento-no-ocurrido",
      [
        ...eventos.incumplidas.map((item) => ({ tipo: "enlace" as const, id: item.enlaceId })),
        { tipo: "regla", id: "R-EJEC-7" },
      ],
    ));
  }
  if (eventos.satisfechas.length === 0 && eventos.desconocidas.length > 0) {
    return efectoUnico(bloquearPaso(
      modelo,
      contexto,
      paso,
      `Indeterminado: evento sin estado conocido (${eventos.desconocidas.map((item) => item.motivo).join("; ")})`,
      "indeterminado",
      [
        ...eventos.desconocidas.map((item) => ({ tipo: "enlace" as const, id: item.enlaceId })),
        { tipo: "regla", id: "R-EJEC-7" },
      ],
    ));
  }

  const condiciones = evaluarModificadores(modelo, paso, conocimiento, "condicion");
  if (condiciones.incumplidas.length > 0) {
    return efectoUnico(omitirPaso(
      modelo,
      contexto,
      paso,
      `condición no satisfecha (${condiciones.incumplidas.map((item) => item.motivo).join("; ")})`,
      "omision",
      [
        ...condiciones.incumplidas.map((item) => ({ tipo: "enlace" as const, id: item.enlaceId })),
        ...eventos.satisfechas.map((item) => ({ tipo: "enlace" as const, id: item.enlaceId })),
        { tipo: "regla", id: "R-EJEC-7" },
        { tipo: "regla", id: "R-EJEC-8" },
        ...(eventos.satisfechas.length > 0 ? [{ tipo: "regla" as const, id: "V-13" }] : []),
      ],
      eventos.satisfechas.length > 0
        ? consumirEventosEvaluados(modelo, eventos.satisfechas.map((item) => item.enlaceId), contexto.estadosCurrent)
        : undefined,
    ));
  }
  if (condiciones.desconocidas.length > 0) {
    const eventoPerdido = eventos.satisfechas.length > 0;
    return efectoUnico(bloquearPaso(
      modelo,
      contexto,
      paso,
      `${eventoPerdido ? "Evento perdido; " : ""}Indeterminado: condición sin estado conocido (${condiciones.desconocidas.map((item) => item.motivo).join("; ")})`,
      eventoPerdido ? "evento-perdido" : "indeterminado",
      [
        ...condiciones.desconocidas.map((item) => ({ tipo: "enlace" as const, id: item.enlaceId })),
        ...eventos.satisfechas.map((item) => ({ tipo: "enlace" as const, id: item.enlaceId })),
        { tipo: "regla", id: "R-EJEC-7" },
        { tipo: "regla", id: "R-EJEC-8" },
        ...(eventoPerdido ? [{ tipo: "regla" as const, id: "V-13" }] : []),
      ],
      eventoPerdido
        ? consumirEventosEvaluados(modelo, eventos.satisfechas.map((item) => item.enlaceId), contexto.estadosCurrent)
        : undefined,
    ));
  }

  const habilitadores = evaluateEnablers(modelo, paso, conocimiento);
  if (habilitadores.estado === "impedidos") {
    const eventoPerdido = eventos.satisfechas.length > 0;
    return efectoUnico(bloquearPaso(
      modelo,
      contexto,
      paso,
      `${eventoPerdido ? "Evento perdido; " : ""}En espera: ${habilitadores.motivos.join("; ")}`,
      eventoPerdido ? "evento-perdido" : "espera",
      [
        ...habilitadores.precondiciones.map((item) => ({ tipo: "enlace" as const, id: item.enlaceId })),
        ...eventos.satisfechas.map((item) => ({ tipo: "enlace" as const, id: item.enlaceId })),
        { tipo: "regla", id: "R-EJEC-6" },
        { tipo: "regla", id: "R-ECA-2" },
        ...(eventoPerdido ? [{ tipo: "regla" as const, id: "V-13" }] : []),
      ],
      eventoPerdido
        ? consumirEventosEvaluados(modelo, eventos.satisfechas.map((item) => item.enlaceId), contexto.estadosCurrent)
        : undefined,
    ));
  }
  if (habilitadores.estado === "no-conocidos") {
    const eventoPerdido = eventos.satisfechas.length > 0;
    return efectoUnico(bloquearPaso(
      modelo,
      contexto,
      paso,
      `${eventoPerdido ? "Evento perdido; " : ""}Indeterminado: ${habilitadores.motivos.join("; ")}`,
      eventoPerdido ? "evento-perdido" : "indeterminado",
      [
        ...habilitadores.precondiciones
          .filter((item) => item.estado === "desconocida")
          .map((item) => ({ tipo: "enlace" as const, id: item.enlaceId })),
        ...eventos.satisfechas.map((item) => ({ tipo: "enlace" as const, id: item.enlaceId })),
        { tipo: "regla", id: "R-EJEC-6" },
        { tipo: "regla", id: "R-ECA-2" },
        ...(eventoPerdido ? [{ tipo: "regla" as const, id: "V-13" }] : []),
      ],
      eventoPerdido
        ? consumirEventosEvaluados(modelo, eventos.satisfechas.map((item) => item.enlaceId), contexto.estadosCurrent)
        : undefined,
    ));
  }
  if (habilitadores.estado === "no-soportado") {
    return efectoUnico(bloquearPaso(
      modelo,
      contexto,
      paso,
      `No soportado: ${habilitadores.motivos.join("; ")}`,
      "no-soportado",
      [
        ...habilitadores.precondiciones.map((item) => ({ tipo: "enlace" as const, id: item.enlaceId })),
        { tipo: "regla", id: "R-EJEC-6" },
      ],
    ));
  }

  const delegaAlRefinamiento = Boolean(paso.opdHijoId);
  const abanico = abanicoXorDeSalida(modelo, paso.procesoId);
  const estadosRama = abanico ? estadosDestinoDeRamas(modelo, abanico) : new Set<Id>();
  const estadosDeEventosNoOcurridos = new Set<Id>();
  for (const evento of eventos.incumplidas) {
    const enlace = modelo.enlaces[evento.enlaceId];
    if (enlace?.origenId.kind === "estado") estadosDeEventosNoOcurridos.add(enlace.origenId.id);
  }
  const transicionesEfectivas = delegaAlRefinamiento ? [] : paso.transicionesPlanificadas.filter((transicion) => (
    (transicion.estadoDespuesId === null || !estadosRama.has(transicion.estadoDespuesId)) &&
    !(eventos.satisfechas.length > 0 && transicion.estadoAntesId && estadosDeEventosNoOcurridos.has(transicion.estadoAntesId))
  ));
  const estadoEntrada = validarEstadosDeEntrada(modelo, transicionesEfectivas, contexto.estadosCurrent);
  if (estadoEntrada.estado !== "satisfecha") {
    const eventoPerdido = eventos.satisfechas.length > 0;
    return efectoUnico(bloquearPaso(
      modelo,
      contexto,
      paso,
      `${eventoPerdido ? "Evento perdido; " : ""}${estadoEntrada.estado === "desconocida" ? "Indeterminado" : "En espera"}: ${estadoEntrada.motivo}`,
      eventoPerdido ? "evento-perdido" : estadoEntrada.estado === "desconocida" ? "indeterminado" : "espera",
      [
        ...(estadoEntrada.estadoId ? [{ tipo: "estado" as const, id: estadoEntrada.estadoId }] : []),
        ...eventos.satisfechas.map((item) => ({ tipo: "enlace" as const, id: item.enlaceId })),
        { tipo: "regla", id: "R-EJEC-6" },
        ...(eventoPerdido ? [{ tipo: "regla" as const, id: "V-13" }] : []),
      ],
      eventoPerdido
        ? consumirEventosEvaluados(modelo, eventos.satisfechas.map((item) => item.enlaceId), contexto.estadosCurrent)
        : undefined,
    ));
  }

  const modo = contexto.modo ?? "determinista";
  let rngMuestreo: (() => number) | undefined;
  let rngConsumido = false;
  const randomMuestreo = (): number => {
    rngConsumido = true;
    rngMuestreo ??= rngSembrado(contexto.semilla ?? 0);
    return rngMuestreo();
  };
  // Distribución canónica de la frontera (V-37, gap B.5): un paso con
  // descomposición DELEGA sus transiciones a los subprocesos — la frontera del
  // padre en el SD declara lo que el sistema consume/produce, pero quienes la
  // REALIZAN son los hijos (consumo al primero, resultado al último). Aplicarla
  // también en el padre la duplicaría: el padre consumiría el estado inicial
  // antes de que el primer subproceso lo use.
  const transicionesAplicadas: TransicionEstadoSim[] = [];
  const motivosBloqueo: string[] = [];
  const estadosCurrent: Record<Id, Id> = { ...contexto.estadosCurrent };
  const transicionesPorEntidad = agruparTransicionesPorEntidad(
    transicionesEfectivas,
  );

  for (const [entidadId, transicionesEntidad] of transicionesPorEntidad) {
    const alternativas = transicionesEntidad.length > 1;
    const transicionesEjecutables = alternativas
      ? transicionesCompatiblesConCurrent(transicionesEntidad, contexto.estadosCurrent)
      : transicionesEntidad;
    if (alternativas && transicionesEjecutables.length === 0) {
      motivosBloqueo.push(motivoSinRutaVigente(modelo, entidadId, transicionesEntidad, contexto.estadosCurrent));
      continue;
    }
    for (const transicion of transicionesEjecutables) {
      if (transicion.estadoAntesId !== null) {
        const observado = contexto.estadosCurrent[transicion.entidadId] ?? null;
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
  }

  // Las copias de valor de la frontera también se delegan a los hijos.
  const { valoresNuevos, cambios: cambiosValor, motivos: motivosValor } = delegaAlRefinamiento
    ? { valoresNuevos: contexto.valoresRuntime, cambios: [], motivos: [] }
    : aplicarCambiosValor(modelo, contexto.valoresRuntime, paso);
  motivosBloqueo.push(...motivosValor);

  const entrada: EntradaTraceSim = {
    numero: contexto.trace.length + 1,
    opdId: paso.opdId,
    opdNombre: paso.opdNombre,
    procesoId: paso.procesoId,
    procesoNombre: paso.procesoNombre,
    transicionesAplicadas,
    cambiosValor,
    resultadoEscenario: "avance",
  };

  const duracionPaso = inferirDuracionPasoSim(
    modelo,
    transicionesAplicadas,
    modo,
    modo === "muestreo" ? randomMuestreo : undefined,
  );
  if (duracionPaso !== undefined) {
    entrada.ventanaDuracion = duracionPaso.ventana;
    entrada.duracion = duracionPaso.observada;
    const eventosTemporales = detectarEventosTemporalesPaso(modelo, paso, duracionPaso.observada);
    if (eventosTemporales.length > 0) entrada.eventosTemporales = eventosTemporales;
  }

  if (motivosBloqueo.length > 0) {
    entrada.diagnostico = `No simulable: ${motivosBloqueo.join("; ")}`;
  }

  const pasoEjecutable = motivosBloqueo.length === 0;
  const nuevoPaso = pasoEjecutable
    ? (resolverSiguientePasoPorEventoTemporal(contexto, entrada.eventosTemporales)
      ?? resolverSiguientePasoPorInvocacion(modelo, contexto, paso))
    : contexto.pasoActual + 1;
  const relojNuevo = (contexto.reloj ?? 0) + (duracionPaso?.observada ?? 0);
  const siguiente: ContextoSimulacion = {
    ...contexto,
    pasoActual: nuevoPaso,
    faseActual: primeraFaseSimulacion(modelo, contexto.plan[nuevoPaso]),
    estado: nuevoPaso >= contexto.plan.length ? "completado" : "ejecutando",
    estadosCurrent: eventos.satisfechas.length > 0
      ? consumirEventosEvaluados(modelo, eventos.satisfechas.map((item) => item.enlaceId), estadosCurrent)
      : estadosCurrent,
    valoresRuntime: valoresNuevos,
    trace: [...contexto.trace, entrada],
    reloj: relojNuevo,
  };

  if (!abanico) {
    return efectoUnico(avanzarSemillaSiFueConsumida(siguiente, modo, rngConsumido, randomMuestreo));
  }

  if (modo === "exhaustivo") {
    const peso = 1 / abanico.enlaceIds.length;
    return { sucesores: abanico.enlaceIds.map((enlaceId) => sucesorDeRama(modelo, siguiente, enlaceId, peso)) };
  }
  if (modo === "muestreo") {
    const d = resolverDecisionAbanico(modelo, abanico.id, { random: randomMuestreo });
    let enlaceId: Id;
    let peso: number;
    if (d.ok && d.value.enlaceId) {
      enlaceId = d.value.enlaceId;
      peso = d.value.probabilidades?.[enlaceId] ?? 1;
    } else {
      // Sin política resoluble (ramas hacia estados sin Pr): Dist uniforme sobre las ramas.
      const idx = Math.min(Math.floor(randomMuestreo() * abanico.enlaceIds.length), abanico.enlaceIds.length - 1);
      enlaceId = abanico.enlaceIds[idx]!;
      peso = 1 / abanico.enlaceIds.length;
    }
    // La semilla EVOLUCIONA para el próximo paso: abanicos sucesivos deben ser
    // independientes (no correlacionados) pero reproducibles desde la semilla raíz.
    const semillaSiguiente = Math.floor(randomMuestreo() * 0x100000000);
    const suc = sucesorDeRama(modelo, siguiente, enlaceId, peso);
    return { sucesores: [{ ...suc, estado: { ...suc.estado, semilla: semillaSiguiente } }] };
  }
  const elegido = [...abanico.enlaceIds].sort(
    (x, y) => (modelo.enlaces[y]?.probabilidad ?? 0) - (modelo.enlaces[x]?.probabilidad ?? 0),
  )[0]!;
  return { sucesores: [sucesorDeRama(modelo, siguiente, elegido)] };
}

/**
 * Avanza un paso tomando el sucesor canonico. El mismo limite de seguridad del
 * unfold completo aplica tambien a paso manual/autoavance.
 */
export function ejecutarPaso(modelo: Modelo, contexto: ContextoSimulacion, limite = LIMITE_PASOS_SIMULACION): ContextoSimulacion {
  if (contexto.estado === "bloqueado") return contexto;
  if (contexto.pasoActual < contexto.plan.length && contexto.trace.length >= limite) {
    return bloquearPorLimite(contexto, limite);
  }
  return tomarUnico(pasoEfecto(modelo, contexto));
}

/** Decisión XOR pendiente del paso actual, para que la UI ofrezca resolución inline. */
export interface DecisionXorSimulacion {
  abanicoId: Id;
  procesoId: Id;
  enlaceIds: readonly Id[];
}

export function decisionXorSimulacion(
  modelo: Modelo,
  contexto: ContextoSimulacion,
): DecisionXorSimulacion | undefined {
  if (contexto.estado === "completado" || contexto.estado === "bloqueado") return undefined;
  const paso = contexto.plan[contexto.pasoActual];
  if (!paso) return undefined;
  const abanico = abanicoXorDeSalida(modelo, paso.procesoId);
  if (!abanico) return undefined;
  return { abanicoId: abanico.id, procesoId: paso.procesoId, enlaceIds: abanico.enlaceIds };
}

export function resolverRamaSimulacion(
  modelo: Modelo,
  contexto: ContextoSimulacion,
  enlaceId: Id,
): ContextoSimulacion {
  const paso = contexto.plan[contexto.pasoActual];
  if (!paso) return contexto;
  const abanico = abanicoXorDeSalida(modelo, paso.procesoId);
  if (!abanico || !abanico.enlaceIds.includes(enlaceId)) return contexto;
  const efecto = pasoEfecto(modelo, { ...contexto, modo: "exhaustivo" });
  return efecto.sucesores.find((sucesor) => modelo.enlaces[enlaceId]?.etiqueta === sucesor.rama || enlaceId === sucesor.rama)?.estado
    ?? efecto.sucesores[abanico.enlaceIds.indexOf(enlaceId)]?.estado
    ?? contexto;
}

/**
 * Avanza una microfase observable. Al cerrar la ÚLTIMA fase de la lista delega
 * en `ejecutarPaso`, que aplica el efecto semántico completo del proceso.
 */
export function ejecutarFaseSimulacion(
  modelo: Modelo,
  contexto: ContextoSimulacion,
  limite = LIMITE_PASOS_SIMULACION,
): ContextoSimulacion {
  if (contexto.estado === "bloqueado" || contexto.estado === "completado") return contexto;
  const paso = contexto.plan[contexto.pasoActual];
  if (!paso) return { ...contexto, estado: "completado", faseActual: undefined };
  // El primer avance desde "preparado" ACTIVA la fase inicial en vez de
  // saltarla: el frame de inicio es quieto, y sin este beat la primera fase
  // real del paso (p.ej. consumo, cuando la preparación vacía se omitió de la
  // lista) nunca se observaría en ejecución.
  if (contexto.estado === "preparado") {
    return { ...contexto, estado: "ejecutando", faseActual: normalizarFaseSimulacion(modelo, paso, contexto.faseActual) };
  }
  const siguienteFase = siguienteFaseSimulacion(modelo, paso, contexto.faseActual);
  if (siguienteFase) {
    return { ...contexto, estado: "ejecutando", faseActual: siguienteFase };
  }
  return ejecutarPaso(modelo, contexto, limite);
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

function agruparTransicionesPorEntidad(transiciones: readonly TransicionEstadoSim[]): Map<Id, TransicionEstadoSim[]> {
  const grupos = new Map<Id, TransicionEstadoSim[]>();
  for (const transicion of transiciones) {
    const grupo = grupos.get(transicion.entidadId);
    if (grupo) grupo.push(transicion);
    else grupos.set(transicion.entidadId, [transicion]);
  }
  return grupos;
}

function validarEstadosDeEntrada(
  modelo: Modelo,
  transiciones: readonly TransicionEstadoSim[],
  estadosCurrent: Readonly<Record<Id, Id>>,
): { estado: "satisfecha" | "incumplida" | "desconocida"; motivo: string; estadoId?: Id } {
  for (const [entidadId, alternativas] of agruparTransicionesPorEntidad(transiciones)) {
    const conEntrada = alternativas.filter((transicion) => transicion.estadoAntesId !== null);
    if (conEntrada.length === 0) continue;
    const observadoId = estadosCurrent[entidadId];
    const vigente = conEntrada.find((transicion) => transicion.estadoAntesId === observadoId);
    if (vigente) continue;
    if (observadoId === undefined) {
      return {
        estado: "desconocida",
        motivo: `${modelo.entidades[entidadId]?.nombre ?? entidadId} no tiene estado runtime conocido`,
        ...(conEntrada[0]?.estadoAntesId ? { estadoId: conEntrada[0].estadoAntesId } : {}),
      };
    }
    const observado = modelo.estados[observadoId]?.nombre ?? observadoId;
    const esperados = conEntrada.map((transicion) => {
      const estadoId = transicion.estadoAntesId;
      return estadoId ? modelo.estados[estadoId]?.nombre ?? estadoId : "sin estado";
    });
    return {
      estado: "incumplida",
      motivo: `${modelo.entidades[entidadId]?.nombre ?? entidadId} está en ${observado}; se requiere ${esperados.join(" o ")}`,
      ...(conEntrada[0]?.estadoAntesId ? { estadoId: conEntrada[0].estadoAntesId } : {}),
    };
  }
  return { estado: "satisfecha", motivo: "" };
}

function transicionesCompatiblesConCurrent(
  transiciones: readonly TransicionEstadoSim[],
  estadosCurrent: Record<Id, Id>,
): TransicionEstadoSim[] {
  const conEstadoEntrada = transiciones.filter((transicion) => transicion.estadoAntesId !== null);
  if (conEstadoEntrada.length === 0) return [...transiciones];
  return conEstadoEntrada.filter((transicion) => estadosCurrent[transicion.entidadId] === transicion.estadoAntesId);
}

function motivoSinRutaVigente(
  modelo: Modelo,
  entidadId: Id,
  transiciones: readonly TransicionEstadoSim[],
  estadosCurrent: Record<Id, Id>,
): string {
  const entidadNombre = modelo.entidades[entidadId]?.nombre ?? entidadId;
  const observadoId = estadosCurrent[entidadId] ?? null;
  const observado = observadoId ? modelo.estados[observadoId]?.nombre ?? observadoId : "sin estado";
  const esperados = transiciones
    .map((transicion) => transicion.estadoAntesId)
    .filter((estadoId): estadoId is Id => estadoId !== null)
    .map((estadoId) => modelo.estados[estadoId]?.nombre ?? estadoId);
  const lista = esperados.length > 0 ? esperados.join(", ") : "sin estado previo";
  return `${entidadNombre} está en ${observado}; ninguna ruta vigente coincide con ${lista}`;
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

function avanzarSemillaSiFueConsumida(
  contexto: ContextoSimulacion,
  modo: ModoSimulacion,
  rngConsumido: boolean,
  random: () => number,
): ContextoSimulacion {
  if (modo !== "muestreo" || !rngConsumido) return contexto;
  return { ...contexto, semilla: Math.floor(random() * 0x100000000) };
}

type PasoConEnlaces = ContextoSimulacion["plan"][number];

const TIPOS_CONDICION_EJECUTABLES = new Set(["consumo", "efecto", "agente", "instrumento"]);

function omitirPaso(
  modelo: Modelo,
  contexto: ContextoSimulacion,
  paso: PasoConEnlaces,
  motivo: string,
  resultadoEscenario: ResultadoPasoEscenario = "omision",
  evidenciaEscenario: ReferenciaEvidenciaEscenario[] = [],
  estadosCurrent?: Record<Id, Id>,
): ContextoSimulacion {
  const nuevoPaso = contexto.pasoActual + 1;
  const entrada: EntradaTraceSim = {
    numero: contexto.trace.length + 1,
    opdId: paso.opdId,
    opdNombre: paso.opdNombre,
    procesoId: paso.procesoId,
    procesoNombre: paso.procesoNombre,
    transicionesAplicadas: [],
    cambiosValor: [],
    omitido: true,
    diagnostico: `Omitido: ${motivo}`,
    resultadoEscenario,
    evidenciaEscenario,
  };
  return {
    ...contexto,
    pasoActual: nuevoPaso,
    faseActual: primeraFaseSimulacion(modelo, contexto.plan[nuevoPaso]),
    estado: nuevoPaso >= contexto.plan.length ? "completado" : "ejecutando",
    ...(estadosCurrent ? { estadosCurrent } : {}),
    trace: [...contexto.trace, entrada],
  };
}

function bloquearPaso(
  modelo: Modelo,
  contexto: ContextoSimulacion,
  paso: PasoConEnlaces,
  motivo: string,
  resultadoEscenario: ResultadoPasoEscenario,
  evidenciaEscenario: ReferenciaEvidenciaEscenario[],
  estadosCurrent?: Record<Id, Id>,
): ContextoSimulacion {
  const entrada: EntradaTraceSim = {
    numero: contexto.trace.length + 1,
    opdId: paso.opdId,
    opdNombre: paso.opdNombre,
    procesoId: paso.procesoId,
    procesoNombre: paso.procesoNombre,
    transicionesAplicadas: [],
    cambiosValor: [],
    diagnostico: motivo,
    resultadoEscenario,
    evidenciaEscenario,
  };
  return {
    ...contexto,
    estado: "bloqueado",
    ...(estadosCurrent ? { estadosCurrent } : {}),
    trace: [...contexto.trace, entrada],
  };
}

/** An evaluated event is consumed even when a later base precondition blocks the process. */
function consumirEventosEvaluados(
  modelo: Modelo,
  enlacesEventoIds: readonly Id[],
  estadosCurrent: Readonly<Record<Id, Id>>,
): Record<Id, Id> {
  const siguientes = { ...estadosCurrent };
  for (const enlaceId of enlacesEventoIds) {
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace || enlace.origenId.kind !== "estado") continue;
    const estado = modelo.estados[enlace.origenId.id];
    if (estado && siguientes[estado.entidadId] === estado.id) delete siguientes[estado.entidadId];
  }
  return siguientes;
}

function evaluarModificadores(
  modelo: Modelo,
  paso: PasoConEnlaces,
  escenario: ConocimientoRuntimeEscenario,
  modificador: "evento" | "condicion",
): {
  satisfechas: Array<{ enlaceId: Id; motivo: string }>;
  incumplidas: Array<{ enlaceId: Id; motivo: string }>;
  desconocidas: Array<{ enlaceId: Id; motivo: string }>;
} {
  const satisfechas: Array<{ enlaceId: Id; motivo: string }> = [];
  const incumplidas: Array<{ enlaceId: Id; motivo: string }> = [];
  const desconocidas: Array<{ enlaceId: Id; motivo: string }> = [];
  const enlacesIds = new Set([...paso.enlacesEntradaIds, ...paso.enlacesSalidaIds]);
  for (const enlaceId of enlacesIds) {
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace || enlace.modificador !== modificador) continue;
    if (!TIPOS_CONDICION_EJECUTABLES.has(enlace.tipo)) continue;
    const condicionante = extremoCondicionanteDeProceso(modelo, enlace, paso.procesoId);
    if (!condicionante) continue;
    const evaluacion = evaluarPrecondicion(modelo, condicionante, escenario);
    const motivo = `${nombreExtremo(modelo, condicionante)} ${evaluacion.motivo}`;
    if (evaluacion.estado === "satisfecha") satisfechas.push({ enlaceId, motivo });
    if (evaluacion.estado === "incumplida") incumplidas.push({ enlaceId, motivo });
    if (evaluacion.estado === "desconocida") desconocidas.push({ enlaceId, motivo });
  }
  return { satisfechas, incumplidas, desconocidas };
}

function evaluarPrecondicion(
  modelo: Modelo,
  extremo: Enlace["origenId"],
  escenario: ConocimientoRuntimeEscenario,
): { estado: "satisfecha" | "incumplida" | "desconocida"; motivo: string } {
  const entidadId = entidadIdDeExtremo(modelo, extremo);
  if (!entidadId || !modelo.entidades[entidadId]) {
    return { estado: "desconocida", motivo: "no tiene referente runtime conocido" };
  }
  const presencia = escenario.presencia[entidadId];
  if (presencia?.estado === "conocido" && presencia.valor === "ausente") {
    return { estado: "incumplida", motivo: "está declarado ausente" };
  }
  if (extremo.kind === "estado") {
    const estado = modelo.estados[extremo.id];
    if (!estado) return { estado: "desconocida", motivo: "no existe en el modelo" };
    if (estado.suprimido) return { estado: "desconocida", motivo: "está suprimido" };
    const observado = escenario.estadosCurrent[estado.entidadId];
    if (observado?.estado !== "conocido") {
      return { estado: "desconocida", motivo: "no tiene un estado runtime conocido" };
    }
    const estadoObservado = modelo.estados[observado.valor];
    if (!estadoObservado || estadoObservado.entidadId !== estado.entidadId || estadoObservado.suprimido) {
      return { estado: "desconocida", motivo: "tiene una referencia runtime de estado inválida" };
    }
    return observado.valor === estado.id
      ? { estado: "satisfecha", motivo: "está vigente" }
      : { estado: "incumplida", motivo: `no está en el estado requerido ${estado.nombre}` };
  }
  if (presencia?.estado === "conocido") {
    return presencia.valor === "presente"
      ? { estado: "satisfecha", motivo: "está presente" }
      : { estado: "incumplida", motivo: "está declarado ausente" };
  }
  if (escenario.estadosCurrent[entidadId]?.estado === "conocido") {
    const estadoObservado = modelo.estados[escenario.estadosCurrent[entidadId]!.valor];
    if (!estadoObservado || estadoObservado.entidadId !== entidadId || estadoObservado.suprimido) {
      return { estado: "desconocida", motivo: "tiene una referencia runtime de estado inválida" };
    }
    return { estado: "satisfecha", motivo: "está presente según su estado runtime" };
  }
  return { estado: "desconocida", motivo: "su presencia no está declarada" };
}

function extremoCondicionanteDeProceso(
  modelo: Modelo,
  enlace: Enlace,
  procesoId: Id,
): Enlace["origenId"] | undefined {
  const origenEntidadId = entidadIdDeExtremo(modelo, enlace.origenId);
  const destinoEntidadId = entidadIdDeExtremo(modelo, enlace.destinoId);
  if (origenEntidadId === procesoId && destinoEntidadId !== procesoId) {
    if (enlace.tipo === "efecto" && enlace.destinoId.kind === "estado") {
      const estado = modelo.estados[enlace.destinoId.id];
      return estado ? { kind: "entidad", id: estado.entidadId } : enlace.destinoId;
    }
    return enlace.destinoId;
  }
  if (destinoEntidadId === procesoId && origenEntidadId !== procesoId) return enlace.origenId;
  return undefined;
}

function resolverSiguientePasoPorInvocacion(
  modelo: Modelo,
  contexto: ContextoSimulacion,
  paso: PasoConEnlaces,
): number {
  const secuencial = contexto.pasoActual + 1;
  // Si un proceso tiene MÚLTIPLES invocaciones de salida, OPM no prescribe el orden;
  // se elige la primera por id (desempate determinista y estable). Tomar solo la
  // primera es una decisión deliberada: la simulación es de un camino, no de un fan-out.
  const invocacion = [...paso.enlacesSalidaIds]
    .map((id) => modelo.enlaces[id])
    .filter((enlace): enlace is Enlace => Boolean(enlace))
    .filter((enlace) =>
      enlace.tipo === "invocacion" &&
      enlace.origenId.kind === "entidad" &&
      enlace.origenId.id === paso.procesoId &&
      enlace.destinoId.kind === "entidad" &&
      modelo.entidades[enlace.destinoId.id]?.tipo === "proceso",
    )
    .sort((a, b) => a.id.localeCompare(b.id))[0];
  if (!invocacion || invocacion.destinoId.kind !== "entidad") return secuencial;
  const destinoId = invocacion.destinoId.id;
  const indice = contexto.plan.findIndex((item) => item.procesoId === destinoId);
  return indice >= 0 ? indice : secuencial;
}

function resolverSiguientePasoPorEventoTemporal(
  contexto: ContextoSimulacion,
  eventos: EventoTemporalSim[] | undefined,
): number | undefined {
  const evento = eventos?.[0];
  if (!evento) return undefined;
  const indice = contexto.plan.findIndex((item) => item.procesoId === evento.procesoManejoId);
  if (indice < 0 || indice === contexto.pasoActual) return undefined;
  return indice;
}

/**
 * Despliega la simulación hasta completar, tomando el sucesor canónico en cada
 * paso. En el modo determinista equivale a iterar `ejecutarPaso`.
 */
export function desplegar(modelo: Modelo, estadoInicial: ContextoSimulacion, limite = LIMITE_PASOS_SIMULACION): ContextoSimulacion {
  let actual = estadoInicial;
  let pasos = 0;
  while (actual.pasoActual < actual.plan.length && actual.estado !== "bloqueado" && pasos < limite) {
    actual = tomarUnico(pasoEfecto(modelo, actual));
    pasos += 1;
  }
  if (actual.pasoActual < actual.plan.length && actual.estado !== "bloqueado" && pasos >= limite) {
    return bloquearPorLimite(actual, limite);
  }
  return actual;
}

function bloquearPorLimite(contexto: ContextoSimulacion, limite: number): ContextoSimulacion {
  const trace = [...contexto.trace];
  const idx = trace.length - 1;
  const diagnostico = `Bloqueado: límite de ${limite} pasos alcanzado`;
  if (idx >= 0) {
    const ultima = trace[idx]!;
    trace[idx] = {
      ...ultima,
      diagnostico: ultima.diagnostico ? `${ultima.diagnostico}; ${diagnostico}` : diagnostico,
      resultadoEscenario: "truncado",
    };
  } else {
    const paso = contexto.plan[contexto.pasoActual];
    if (paso) {
      trace.push({
        numero: 1,
        opdId: paso.opdId,
        opdNombre: paso.opdNombre,
        procesoId: paso.procesoId,
        procesoNombre: paso.procesoNombre,
        transicionesAplicadas: [],
        cambiosValor: [],
        diagnostico,
        resultadoEscenario: "truncado",
        evidenciaEscenario: [],
      });
    }
  }
  return { ...contexto, estado: "bloqueado", trace };
}

/**
 * Reinicia la simulación al estado inicial preservando el modeloId/opdId.
 * Equivale a un nuevo `iniciarSimulacion` sobre el mismo OPD.
 */
export function reiniciarSimulacion(modelo: Modelo, contexto: ContextoSimulacion): ContextoSimulacion {
  return iniciarSimulacion(modelo, contexto.opdId, {
    ...(contexto.semilla !== undefined ? { semilla: contexto.semilla } : {}),
    ...(contexto.escenario ? { escenario: contexto.escenario } : {}),
  });
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
    if (estado.estado === "bloqueado" || estado.pasoActual >= estado.plan.length || contador >= limite) {
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
