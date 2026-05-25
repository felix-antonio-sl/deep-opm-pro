import { describe, expect, test } from "bun:test";

import {
  aplicarDecisionSociotecnica,
  crearRuntimeSociotecnico,
  type ActorSim,
  type AgenteSim,
  type DecisionSim,
} from "./sociotecnico";

describe("simulacion sociotecnica y agentica", () => {
  const actor: ActorSim = {
    id: "actor-analista",
    nombre: "Analista de operaciones",
    tipo: "humano",
    disponibilidad: "disponible",
    roles: ["supervision"],
  };

  const agenteAutonomo: AgenteSim = {
    id: "agente-triage",
    nombre: "Agente de triage",
    actorId: actor.id,
    objetivo: "priorizar trabajo entrante",
    politica: { porDefecto: "autonomo" },
  };

  test("crea un runtime indexado por actores y agentes", () => {
    const runtime = crearRuntimeSociotecnico({
      actores: [actor],
      agentes: [agenteAutonomo],
    });

    expect(runtime.actores[actor.id]).toEqual(actor);
    expect(runtime.agentes[agenteAutonomo.id]).toEqual(agenteAutonomo);
    expect(runtime.efectosPendientes).toEqual([]);
    expect(runtime.trace).toEqual([]);
  });

  test("permite una decision autonoma y registra el evento sin mutar el runtime", () => {
    const runtime = crearRuntimeSociotecnico({
      actores: [actor],
      agentes: [agenteAutonomo],
    });
    const decision: DecisionSim = {
      id: "decision-clasificar",
      agenteId: agenteAutonomo.id,
      accion: "clasificar-ticket",
    };

    const { runtime: siguiente, resultado } = aplicarDecisionSociotecnica(runtime, decision);

    expect(resultado.estado).toBe("permitida");
    expect(siguiente.trace).toHaveLength(1);
    expect(siguiente.trace[0]).toMatchObject({
      numero: 1,
      tipo: "decision-permitida",
      actorId: actor.id,
      agenteId: agenteAutonomo.id,
      decisionId: decision.id,
      accion: decision.accion,
    });
    expect(siguiente.efectosPendientes).toEqual([]);
    expect(runtime.trace).toEqual([]);
  });

  test("suspende una decision que requiere aprobacion humana y deja un efecto pendiente", () => {
    const agenteSupervisado: AgenteSim = {
      ...agenteAutonomo,
      id: "agente-supervisado",
      politica: { porDefecto: "requiere-aprobacion" },
    };
    const runtime = crearRuntimeSociotecnico({
      actores: [actor],
      agentes: [agenteSupervisado],
    });

    const { runtime: siguiente, resultado } = aplicarDecisionSociotecnica(runtime, {
      id: "decision-cerrar-caso",
      agenteId: agenteSupervisado.id,
      accion: "cerrar-caso",
      justificacion: "La evidencia cumple los criterios de cierre",
    });

    expect(resultado.estado).toBe("suspendida");
    if (!resultado.efectoPendiente) {
      throw new Error("Se esperaba un efecto pendiente de aprobacion");
    }
    const efectoPendiente = resultado.efectoPendiente;
    expect(efectoPendiente).toMatchObject({
      id: "approval-decision-cerrar-caso",
      tipo: "ask-human",
      descripcion: "Solicitar aprobacion humana para cerrar-caso",
    });
    expect(siguiente.efectosPendientes).toEqual([efectoPendiente]);
    expect(siguiente.trace[0]).toMatchObject({
      tipo: "decision-suspendida",
      motivo: "La accion requiere aprobacion humana",
      efectoId: "approval-decision-cerrar-caso",
    });
  });

  test("bloquea un efecto de herramienta prohibido por politica", () => {
    const agenteConRestriccion: AgenteSim = {
      ...agenteAutonomo,
      id: "agente-restringido",
      politica: {
        porDefecto: "autonomo",
        herramientas: { "python-prod": "bloqueado" },
      },
    };
    const runtime = crearRuntimeSociotecnico({
      actores: [actor],
      agentes: [agenteConRestriccion],
    });

    const decision: DecisionSim = {
      id: "decision-ejecutar-python",
      agenteId: agenteConRestriccion.id,
      accion: "ejecutar-script",
      efecto: {
        id: "effect-python-prod",
        tipo: "python",
        herramientaId: "python-prod",
        descripcion: "Ejecutar script en ambiente productivo",
      },
    };

    const { runtime: siguiente, resultado } = aplicarDecisionSociotecnica(runtime, decision);

    expect(resultado.estado).toBe("bloqueada");
    expect(resultado.motivo).toBe("La politica bloquea la accion o herramienta solicitada");
    expect(resultado.efectoPendiente).toBeUndefined();
    expect(siguiente.efectosPendientes).toEqual([]);
    expect(siguiente.trace[0]).toMatchObject({
      tipo: "decision-bloqueada",
      decisionId: decision.id,
      efectoId: "effect-python-prod",
    });
  });
});
