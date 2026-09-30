import { DEFAULT_TASK_BUDGET, type TaskBudget } from "../../agent/taskState";
import type { ProviderProfile } from "./provider";

export interface AgentPricing {
  inputUsdPerMillion: number;
  outputUsdPerMillion: number;
  checkedOn: string;
}

export interface AgentConfig {
  enabled: boolean;
  apiKey: string | null;
  profile: ProviderProfile;
  budget: TaskBudget;
  requestTimeoutMs: number;
  presenceTimeoutMs: number;
  workerLeaseMs: number;
  pricing: AgentPricing | null;
}

function positive(env: Record<string, string | undefined>, key: string, fallback: number): number {
  const raw = env[key];
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) throw new Error(`Configuración inválida: ${key}`);
  return value;
}

function positiveInteger(env: Record<string, string | undefined>, key: string, fallback: number): number {
  const value = positive(env, key, fallback);
  if (!Number.isSafeInteger(value)) throw new Error(`Configuración inválida: ${key}`);
  return value;
}

/** Configuration stays on the server; never serialize this object to a client. */
export function loadAgentConfig(env: Record<string, string | undefined> = process.env): AgentConfig {
  const provider = env.OPFORJA_AGENT_PROVIDER || "xiaomi-mimo";
  const model = env.OPFORJA_AGENT_MODEL || (provider === "xiaomi-mimo" ? "mimo-v2.6-pro" : "glm-5.2");
  const protocol = env.OPFORJA_AGENT_PROTOCOL || "chat-completions";
  if ((provider !== "opencode-zen" && provider !== "xiaomi-mimo") || protocol !== "chat-completions") {
    throw new Error("Perfil del agente no soportado; no se cambiará de proveedor automáticamente");
  }
  // Official Zen price table, checked 2026-09-23: https://opencode.ai/docs/zen/
  // Reserve at uncached input rates; cache discounts never increase the budget.
  let pricing: AgentPricing | null = provider === "opencode-zen" && model === "glm-5.2"
    ? { inputUsdPerMillion: 1.4, outputUsdPerMillion: 4.4, checkedOn: "2026-09-23" }
    : null;
  // Official overseas pay-as-you-go prices, excluding cache discounts.
  // https://mimo.mi.com/docs/en-US/price/pay-as-you-go (checked 2026-09-23)
  if (provider === "xiaomi-mimo" && model === "mimo-v2.6-pro") {
    pricing = { inputUsdPerMillion: 0.435, outputUsdPerMillion: 0.87, checkedOn: "2026-09-23" };
  }
  if (env.OPFORJA_AGENT_INPUT_USD_PER_MILLION && env.OPFORJA_AGENT_OUTPUT_USD_PER_MILLION) {
    if (!env.OPFORJA_AGENT_PRICE_CHECKED_ON) {
      throw new Error("La tarifa del proveedor requiere OPFORJA_AGENT_PRICE_CHECKED_ON");
    }
    pricing = {
      inputUsdPerMillion: positive(env, "OPFORJA_AGENT_INPUT_USD_PER_MILLION", 0),
      outputUsdPerMillion: positive(env, "OPFORJA_AGENT_OUTPUT_USD_PER_MILLION", 0),
      checkedOn: env.OPFORJA_AGENT_PRICE_CHECKED_ON,
    };
  }
  return {
    enabled: env.OPFORJA_AGENT_ENABLED === "true",
    apiKey: env.OPFORJA_AGENT_API_KEY?.trim() || null,
    profile: { provider, protocol, model },
    budget: {
      maxModelCalls: positiveInteger(env, "OPFORJA_AGENT_MAX_MODEL_CALLS", DEFAULT_TASK_BUDGET.maxModelCalls),
      maxToolCalls: positiveInteger(env, "OPFORJA_AGENT_MAX_TOOL_CALLS", DEFAULT_TASK_BUDGET.maxToolCalls),
      maxInputTokens: positiveInteger(env, "OPFORJA_AGENT_MAX_INPUT_TOKENS", DEFAULT_TASK_BUDGET.maxInputTokens),
      maxOutputTokens: positiveInteger(env, "OPFORJA_AGENT_MAX_OUTPUT_TOKENS", DEFAULT_TASK_BUDGET.maxOutputTokens),
      maxTaskUsd: positive(env, "OPFORJA_AGENT_MAX_TASK_USD", DEFAULT_TASK_BUDGET.maxTaskUsd),
      timeoutMs: positiveInteger(env, "OPFORJA_AGENT_TASK_TIMEOUT_MS", DEFAULT_TASK_BUDGET.timeoutMs),
    },
    requestTimeoutMs: positiveInteger(env, "OPFORJA_AGENT_REQUEST_TIMEOUT_MS", 120_000),
    presenceTimeoutMs: 45_000,
    workerLeaseMs: 150_000,
    pricing,
  };
}

export function estimateTurnCost(pricing: AgentPricing, inputTokens: number, outputTokens: number): number {
  return (inputTokens * pricing.inputUsdPerMillion + outputTokens * pricing.outputUsdPerMillion) / 1_000_000;
}

export function agentAvailability(config: AgentConfig): { available: boolean; reason: string | null } {
  if (!config.enabled) return { available: false, reason: "El servicio agéntico está deshabilitado" };
  if (!config.apiKey) return { available: false, reason: "Falta configurar la credencial del proveedor" };
  if (!config.pricing) return { available: false, reason: "Falta una tarifa verificada para este modelo" };
  return { available: true, reason: null };
}
