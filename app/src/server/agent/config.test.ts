import { expect, test } from "bun:test";
import { agentAvailability, estimateTurnCost, loadAgentConfig } from "./config";

test("configuration keeps the service off until explicitly enabled and configured", () => {
  const config = loadAgentConfig({});
  expect(agentAvailability(config).available).toBe(false);
  expect(config.apiKey).toBeNull();
  expect(agentAvailability(loadAgentConfig({ OPFORJA_AGENT_ENABLED: "true" })).available).toBe(false);
});

test("unknown pricing and incompatible providers never silently fall back", () => {
  expect(agentAvailability(loadAgentConfig({
    OPFORJA_AGENT_ENABLED: "true", OPFORJA_AGENT_API_KEY: "synthetic-test-key", OPFORJA_AGENT_MODEL: "another-model",
  })).available).toBe(false);
  expect(() => loadAgentConfig({ OPFORJA_AGENT_PROVIDER: "unapproved" })).toThrow();
  expect(() => loadAgentConfig({ OPFORJA_AGENT_MAX_MODEL_CALLS: "NaN" })).toThrow();
  expect(() => loadAgentConfig({ OPFORJA_AGENT_MAX_MODEL_CALLS: "1.5" })).toThrow();
});

test("pricing reserves uncached input and output independently", () => {
  const pricing = loadAgentConfig({}).pricing!;
  expect(estimateTurnCost(pricing, 1_000_000, 0)).toBe(0.435);
  expect(estimateTurnCost(pricing, 0, 1_000_000)).toBe(0.87);
});

test("MiMo pricing is bound to its direct provider, not inferred from a model name alone", () => {
  const mimo = loadAgentConfig({ OPFORJA_AGENT_PROVIDER: "xiaomi-mimo", OPFORJA_AGENT_MODEL: "mimo-v2.6-pro" });
  expect(mimo.pricing).toEqual({ inputUsdPerMillion: 0.435, outputUsdPerMillion: 0.87, checkedOn: "2026-09-23" });
  expect(loadAgentConfig({ OPFORJA_AGENT_PROVIDER: "opencode-zen", OPFORJA_AGENT_MODEL: "mimo-v2.6-pro" }).pricing).toBeNull();
});
