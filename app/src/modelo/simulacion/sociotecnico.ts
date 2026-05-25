import type { Id } from "../tipos";

export type TipoActorSim = "humano" | "equipo" | "servicio" | "agente" | "sistema-externo";
export type EstadoDisponibilidadActorSim = "disponible" | "ocupado" | "no-disponible";

export interface ActorSim {
  readonly id: Id;
  readonly nombre: string;
  readonly tipo: TipoActorSim;
  readonly roles?: readonly string[];
  readonly capacidad?: number;
  readonly disponibilidad?: EstadoDisponibilidadActorSim;
}

export type NivelAutonomiaSim = "bloqueado" | "requiere-aprobacion" | "autonomo";

export interface PoliticaAutonomiaSim {
  readonly porDefecto: NivelAutonomiaSim;
  readonly acciones?: Readonly<Record<string, NivelAutonomiaSim>>;
  readonly herramientas?: Readonly<Record<string, NivelAutonomiaSim>>;
}

export interface AgenteSim {
  readonly id: Id;
  readonly nombre: string;
  readonly actorId: Id;
  readonly objetivo?: string;
  readonly politica: PoliticaAutonomiaSim;
  readonly herramientas?: readonly string[];
}

export type TipoEfectoSim =
  | "ask-human"
  | "tool-call"
  | "http"
  | "python"
  | "mqtt"
  | "sql"
  | "ros"
  | "genai";

export interface EfectoSim {
  readonly id: Id;
  readonly tipo: TipoEfectoSim;
  readonly descripcion: string;
  readonly herramientaId?: Id;
  readonly payload?: Readonly<Record<string, unknown>>;
}

export interface DecisionSim {
  readonly id: Id;
  readonly agenteId: Id;
  readonly accion: string;
  readonly efecto?: EfectoSim;
  readonly justificacion?: string;
}

export type EstadoResultadoDecisionSim = "permitida" | "suspendida" | "bloqueada";

export interface ResultadoDecisionSim {
  readonly estado: EstadoResultadoDecisionSim;
  readonly decision: DecisionSim;
  readonly motivo?: string;
  readonly efectoPendiente?: EfectoSim;
}

export type TipoEventoSociotecnicoSim =
  | "decision-permitida"
  | "decision-suspendida"
  | "decision-bloqueada";

export interface EventoSociotecnicoSim {
  readonly numero: number;
  readonly tipo: TipoEventoSociotecnicoSim;
  readonly actorId?: Id;
  readonly agenteId?: Id;
  readonly decisionId: Id;
  readonly accion: string;
  readonly motivo?: string;
  readonly efectoId?: Id;
}

export interface RuntimeSociotecnicoSim {
  readonly actores: Readonly<Record<Id, ActorSim>>;
  readonly agentes: Readonly<Record<Id, AgenteSim>>;
  readonly efectosPendientes: readonly EfectoSim[];
  readonly trace: readonly EventoSociotecnicoSim[];
}

export interface CrearRuntimeSociotecnicoInput {
  readonly actores?: readonly ActorSim[];
  readonly agentes?: readonly AgenteSim[];
}

export interface AplicarDecisionSociotecnicaResult {
  readonly runtime: RuntimeSociotecnicoSim;
  readonly resultado: ResultadoDecisionSim;
}

export function crearRuntimeSociotecnico(
  input: CrearRuntimeSociotecnicoInput = {},
): RuntimeSociotecnicoSim {
  return {
    actores: indexarPorId(input.actores ?? []),
    agentes: indexarPorId(input.agentes ?? []),
    efectosPendientes: [],
    trace: [],
  };
}

export function evaluarDecisionSociotecnica(
  runtime: RuntimeSociotecnicoSim,
  decision: DecisionSim,
): ResultadoDecisionSim {
  const agente = runtime.agentes[decision.agenteId];
  if (!agente) {
    return bloquear(decision, "Agente no registrado");
  }

  const actor = runtime.actores[agente.actorId];
  if (!actor) {
    return bloquear(decision, "Actor del agente no registrado");
  }

  if (actor.disponibilidad === "no-disponible") {
    return suspender(
      decision,
      crearEfectoAprobacion(decision, agente, actor),
      "El actor responsable no esta disponible",
    );
  }

  const nivel = resolverNivelAutonomia(agente.politica, decision);
  if (nivel === "bloqueado") {
    return bloquear(decision, "La politica bloquea la accion o herramienta solicitada");
  }

  if (nivel === "requiere-aprobacion") {
    return suspender(
      decision,
      crearEfectoAprobacion(decision, agente, actor),
      "La accion requiere aprobacion humana",
    );
  }

  return { estado: "permitida", decision };
}

export function aplicarDecisionSociotecnica(
  runtime: RuntimeSociotecnicoSim,
  decision: DecisionSim,
): AplicarDecisionSociotecnicaResult {
  const resultado = evaluarDecisionSociotecnica(runtime, decision);
  const agente = runtime.agentes[decision.agenteId];
  const evento = crearEvento(runtime.trace.length + 1, decision, resultado, agente);
  const efectosPendientes =
    resultado.estado === "suspendida" && resultado.efectoPendiente
      ? [...runtime.efectosPendientes, resultado.efectoPendiente]
      : [...runtime.efectosPendientes];

  return {
    resultado,
    runtime: {
      actores: { ...runtime.actores },
      agentes: { ...runtime.agentes },
      efectosPendientes,
      trace: [...runtime.trace, evento],
    },
  };
}

function indexarPorId<T extends { readonly id: Id }>(items: readonly T[]): Record<Id, T> {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

function resolverNivelAutonomia(
  politica: PoliticaAutonomiaSim,
  decision: DecisionSim,
): NivelAutonomiaSim {
  const herramientaId = decision.efecto?.herramientaId;
  if (herramientaId && politica.herramientas?.[herramientaId]) {
    return politica.herramientas[herramientaId];
  }

  return politica.acciones?.[decision.accion] ?? politica.porDefecto;
}

function bloquear(decision: DecisionSim, motivo: string): ResultadoDecisionSim {
  return { estado: "bloqueada", decision, motivo };
}

function suspender(
  decision: DecisionSim,
  efectoPendiente: EfectoSim,
  motivo: string,
): ResultadoDecisionSim {
  return { estado: "suspendida", decision, motivo, efectoPendiente };
}

function crearEfectoAprobacion(
  decision: DecisionSim,
  agente: AgenteSim,
  actor: ActorSim,
): EfectoSim {
  return {
    id: `approval-${decision.id}`,
    tipo: "ask-human",
    descripcion: `Solicitar aprobacion humana para ${decision.accion}`,
    payload: {
      decisionId: decision.id,
      agenteId: agente.id,
      actorId: actor.id,
      justificacion: decision.justificacion,
    },
  };
}

function crearEvento(
  numero: number,
  decision: DecisionSim,
  resultado: ResultadoDecisionSim,
  agente?: AgenteSim,
): EventoSociotecnicoSim {
  const efectoId = resultado.efectoPendiente?.id ?? decision.efecto?.id;

  return {
    numero,
    tipo: `decision-${resultado.estado}` as TipoEventoSociotecnicoSim,
    ...(agente ? { actorId: agente.actorId, agenteId: agente.id } : {}),
    decisionId: decision.id,
    accion: decision.accion,
    ...(resultado.motivo !== undefined ? { motivo: resultado.motivo } : {}),
    ...(efectoId !== undefined ? { efectoId } : {}),
  };
}
