import { estadosDeEntidad } from "./operaciones/estados";
import type { Abanico, DecisionPolicy, Enlace, Id, Modelo, Resultado } from "./tipos";

export interface EntradaFuncionDecision {
  modelo: Modelo;
  abanico: Abanico;
  enlaces: Enlace[];
}

export interface OpcionesResolverDecision {
  random?: () => number;
  funciones?: Record<Id, (entrada: EntradaFuncionDecision) => Id | null | undefined>;
}

export interface ResultadoDecision {
  modo: DecisionPolicy["modo"];
  enlaceId?: Id;
  estadoId?: Id;
  probabilidades?: Record<Id, number>;
  trace: string;
}

export function resolverDecisionEnlace(modelo: Modelo, enlaceId: Id): Resultado<ResultadoDecision> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return { ok: false, error: `Enlace no existe: ${enlaceId}` };
  const estadoId = enlace.destinoId.kind === "estado"
    ? enlace.destinoId.id
    : enlace.origenId.kind === "estado"
      ? enlace.origenId.id
      : undefined;
  if (estadoId) {
    return {
      ok: true,
      value: {
        modo: "estado-fijo",
        enlaceId,
        estadoId,
        trace: `decision estado-fijo:${estadoId}`,
      },
    };
  }
  const entidadId = enlace.destinoId.kind === "entidad" ? enlace.destinoId.id : undefined;
  if (!entidadId) return { ok: false, error: "El enlace no apunta a un objeto con estados" };
  const estados = estadosDeEntidad(modelo, entidadId).filter((estado) => !estado.suprimido);
  if (estados.length === 0) return { ok: false, error: "El objeto no tiene estados para resolver decisión uniforme" };
  const peso = 1 / estados.length;
  return {
    ok: true,
    value: {
      modo: "uniforme",
      enlaceId,
      probabilidades: Object.fromEntries(estados.map((estado) => [estado.id, peso])),
      trace: `decision uniforme:${entidadId}`,
    },
  };
}

export function resolverDecisionAbanico(
  modelo: Modelo,
  abanicoId: Id,
  opciones: OpcionesResolverDecision = {},
): Resultado<ResultadoDecision> {
  const abanico = modelo.abanicos?.[abanicoId];
  if (!abanico) return { ok: false, error: `Abanico no existe: ${abanicoId}` };
  if (abanico.operador !== "XOR") return { ok: false, error: "La resolución de decisión requiere abanico XOR" };
  const enlaces = abanico.enlaceIds.map((id) => modelo.enlaces[id]).filter((enlace): enlace is Enlace => !!enlace);
  if (enlaces.length !== abanico.enlaceIds.length || enlaces.length < 2) {
    return { ok: false, error: "Abanico inválido para decisión" };
  }
  const policy = abanico.decision ?? policyProbabilidadesDesdeLinks(enlaces) ?? policyUniformeDesdeEnlaces(modelo, enlaces);
  if (!policy) return { ok: false, error: "No hay política de decisión resoluble" };
  return resolverDecisionConPolicy(modelo, abanico, enlaces, policy, opciones);
}

export function resolverDecisionConPolicy(
  modelo: Modelo,
  abanico: Abanico,
  enlaces: Enlace[],
  policy: DecisionPolicy,
  opciones: OpcionesResolverDecision = {},
): Resultado<ResultadoDecision> {
  switch (policy.modo) {
    case "estado-fijo": {
      const enlace = enlaces.find((item) => item.destinoId.kind === "estado" && item.destinoId.id === policy.estadoId);
      if (!enlace) return { ok: false, error: `Estado fijo fuera del abanico: ${policy.estadoId}` };
      return { ok: true, value: { modo: "estado-fijo", enlaceId: enlace.id, estadoId: policy.estadoId, trace: `decision estado-fijo:${policy.estadoId}` } };
    }
    case "uniforme": {
      const pesos = pesosUniformes(enlaces.map((enlace) => enlace.id));
      return elegirPorPesos("uniforme", pesos, opciones.random);
    }
    case "probabilidades": {
      const validado = validarPesos(policy.pesos, enlaces.map((enlace) => enlace.id));
      if (!validado.ok) return validado;
      return elegirPorPesos("probabilidades", validado.value, opciones.random);
    }
    case "funcion": {
      const funcion = opciones.funciones?.[policy.funcionId];
      if (!funcion) return { ok: false, error: `Función de decisión no registrada: ${policy.funcionId}` };
      const enlaceId = funcion({ modelo, abanico, enlaces });
      if (!enlaceId || !enlaces.some((enlace) => enlace.id === enlaceId)) {
        return { ok: false, error: `Función de decisión retornó una rama inválida: ${enlaceId ?? ""}` };
      }
      return { ok: true, value: { modo: "funcion", enlaceId, trace: `decision funcion:${policy.funcionId}` } };
    }
  }
}

function policyProbabilidadesDesdeLinks(enlaces: Enlace[]): DecisionPolicy | null {
  if (!enlaces.every((enlace) => enlace.probabilidad !== undefined)) return null;
  return { modo: "probabilidades", pesos: Object.fromEntries(enlaces.map((enlace) => [enlace.id, enlace.probabilidad ?? 0])) };
}

function policyUniformeDesdeEnlaces(modelo: Modelo, enlaces: Enlace[]): DecisionPolicy | null {
  const objetos = new Set(
    enlaces
      .map((enlace) => enlace.destinoId.kind === "entidad" ? enlace.destinoId.id : null)
      .filter((id): id is Id => !!id),
  );
  if (objetos.size !== 1) return null;
  const objetoId = [...objetos][0]!;
  return estadosDeEntidad(modelo, objetoId).length > 0 ? { modo: "uniforme", objetoId } : null;
}

function elegirPorPesos(modo: "uniforme" | "probabilidades", pesos: Record<Id, number>, random = Math.random): Resultado<ResultadoDecision> {
  const r = Math.min(Math.max(random(), 0), 0.999999999);
  let acumulado = 0;
  const entries = Object.entries(pesos);
  for (const [enlaceId, peso] of entries) {
    acumulado += peso;
    if (r < acumulado) {
      return { ok: true, value: { modo, enlaceId, probabilidades: pesos, trace: `decision ${modo}:${enlaceId}` } };
    }
  }
  const ultimo = entries.at(-1);
  return ultimo
    ? { ok: true, value: { modo, enlaceId: ultimo[0], probabilidades: pesos, trace: `decision ${modo}:${ultimo[0]}` } }
    : { ok: false, error: "Decisión sin ramas" };
}

function pesosUniformes(ids: Id[]): Record<Id, number> {
  const peso = 1 / ids.length;
  return Object.fromEntries(ids.map((id) => [id, peso]));
}

function validarPesos(pesos: Record<Id, number>, enlaceIds: Id[]): Resultado<Record<Id, number>> {
  const ids = new Set(enlaceIds);
  const normalizados: Record<Id, number> = {};
  for (const id of enlaceIds) {
    const peso = pesos[id];
    if (typeof peso !== "number" || !Number.isFinite(peso) || peso < 0 || peso > 1) {
      return { ok: false, error: `Probabilidad inválida para rama ${id}` };
    }
    normalizados[id] = peso;
  }
  if (Object.keys(pesos).some((id) => !ids.has(id))) return { ok: false, error: "La política de probabilidades contiene ramas ajenas al abanico" };
  const suma = Object.values(normalizados).reduce((acc, value) => acc + value, 0);
  if (Math.abs(suma - 1) > 1e-9) return { ok: false, error: "Las probabilidades de decisión deben sumar 1" };
  return { ok: true, value: normalizados };
}
