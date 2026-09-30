import type { Id, Modelo, Resultado } from "../tipos";

/** A piece of scenario knowledge, separate from the OPM domain state. */
export type Conocimiento<T> =
  | { estado: "conocido"; valor: T }
  | { estado: "desconocido"; motivo?: string };

export type PresenciaEscenario = "presente" | "ausente";

/** Runtime facts used while evaluating a step. Missing entries remain unknown. */
export interface ConocimientoRuntimeEscenario {
  presencia: Readonly<Record<Id, Conocimiento<PresenciaEscenario>>>;
  estadosCurrent: Readonly<Record<Id, Conocimiento<Id>>>;
}

export interface SupuestoEscenario {
  id: string;
  descripcion: string;
  referencias: readonly Id[];
}

export type ParametroEscenario = string | number | boolean | null;

/**
 * A scenario pins the conceptual model revision and records only declared
 * knowledge. `desconocido` is an epistemic value, never a domain state.
 */
export interface EscenarioSimulacion {
  id: string;
  modeloId: Id;
  revisionBase: string | number;
  proposito: string;
  alcanceIds: readonly Id[];
  conocimientoInicial: ConocimientoRuntimeEscenario;
  supuestos: readonly SupuestoEscenario[];
  parametros: Readonly<Record<string, ParametroEscenario>>;
  capacidadesSoportadas: readonly string[];
}

export type ResultadoPasoEscenario =
  | "avance"
  | "espera"
  | "omision"
  | "evento-no-ocurrido"
  | "evento-perdido"
  | "indeterminado"
  | "no-soportado"
  | "truncado";

export interface ReferenciaEvidenciaEscenario {
  tipo: "declaracion" | "estado" | "enlace" | "supuesto" | "regla";
  id: Id | string;
}

export interface ConclusionEscenario {
  resultado: ResultadoPasoEscenario;
  referencias: readonly ReferenciaEvidenciaEscenario[];
  limites: readonly string[];
}

/** Clone the caller-owned collections. No status, state, or assumption is inferred. */
export function crearEscenario(entrada: EscenarioSimulacion): EscenarioSimulacion {
  const copiarConocimiento = <T>(valores: Readonly<Record<Id, Conocimiento<T>>>) =>
    Object.fromEntries(Object.entries(valores).map(([id, dato]) => [id, { ...dato }])) as Record<Id, Conocimiento<T>>;
  return {
    ...entrada,
    alcanceIds: [...entrada.alcanceIds],
    conocimientoInicial: {
      presencia: copiarConocimiento(entrada.conocimientoInicial.presencia),
      estadosCurrent: copiarConocimiento(entrada.conocimientoInicial.estadosCurrent),
    },
    supuestos: entrada.supuestos.map((supuesto) => ({
      ...supuesto,
      referencias: [...supuesto.referencias],
    })),
    parametros: { ...entrada.parametros },
    capacidadesSoportadas: [...entrada.capacidadesSoportadas],
  };
}

/** Validate scenario references without changing the model or scenario. */
export function validarEscenario(
  modelo: Modelo,
  escenario: EscenarioSimulacion,
): Resultado<EscenarioSimulacion> {
  if (escenario.modeloId !== modelo.id) return { ok: false, error: "El escenario pertenece a otro modelo" };
  if (!escenario.id.trim()) return { ok: false, error: "El escenario requiere un id" };
  if (!escenario.proposito.trim()) return { ok: false, error: "El escenario requiere un propósito" };
  if (typeof escenario.revisionBase === "string" && !escenario.revisionBase.trim()) {
    return { ok: false, error: "El escenario requiere una revisión base" };
  }
  for (const [entidadId, conocimiento] of Object.entries(escenario.conocimientoInicial.presencia)) {
    const entidad = modelo.entidades[entidadId];
    if (!entidad || entidad.tipo !== "objeto") return { ok: false, error: `Objeto de escenario inexistente: ${entidadId}` };
    if (conocimiento.estado === "conocido" && !["presente", "ausente"].includes(conocimiento.valor)) {
      return { ok: false, error: `Presencia inválida para ${entidadId}` };
    }
  }
  for (const [entidadId, conocimiento] of Object.entries(escenario.conocimientoInicial.estadosCurrent)) {
    if (conocimiento.estado !== "conocido") continue;
    const estado = modelo.estados[conocimiento.valor];
    if (!estado || estado.entidadId !== entidadId || estado.suprimido) {
      return { ok: false, error: `Estado inicial inválido para ${entidadId}` };
    }
    if (escenario.conocimientoInicial.presencia[entidadId]?.estado === "conocido" &&
      escenario.conocimientoInicial.presencia[entidadId]?.valor === "ausente") {
      return { ok: false, error: `El escenario declara ${entidadId} ausente y con un estado actual` };
    }
  }
  for (const supuesto of escenario.supuestos) {
    if (!supuesto.id.trim() || !supuesto.descripcion.trim()) {
      return { ok: false, error: "Cada supuesto requiere id y descripción" };
    }
  }
  return { ok: true, value: escenario };
}

/** Replace runtime state knowledge with the current runner state, retaining scenario presence facts. */
export function conocimientoRuntimeEscenario(
  escenario: EscenarioSimulacion | undefined,
  estadosCurrent: Readonly<Record<Id, Id>>,
): ConocimientoRuntimeEscenario {
  const estados = Object.fromEntries(
    Object.entries(estadosCurrent).map(([entidadId, estadoId]) => [entidadId, { estado: "conocido", valor: estadoId }]),
  ) as Record<Id, Conocimiento<Id>>;
  return {
    presencia: escenario?.conocimientoInicial.presencia ?? {},
    estadosCurrent: estados,
  };
}
