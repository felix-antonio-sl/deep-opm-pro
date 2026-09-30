import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "bun:test";
import {
  AGENT_AUTHORING_OPERATIONS,
  AGENT_CAPABILITY_MATRIX,
  AGENT_CAPABILITY_PROFILE,
  agentCanAuthor,
  agentCapabilityProfile,
} from "./capabilityProfile";

describe("perfil de capacidades con testigos", () => {
  test("cada celda declara soporte, prueba existente y versión del perfil", () => {
    for (const construction of Object.values(AGENT_CAPABILITY_MATRIX)) {
      for (const capability of Object.values(construction)) {
        expect(typeof capability.supported).toBe("boolean");
        expect(capability.version).toBe(AGENT_CAPABILITY_PROFILE);
        expect(existsSync(resolve(import.meta.dir, "../..", capability.test))).toBe(true);
      }
    }
  });

  test("las herramientas solo anuncian autoría respaldada por la misma matriz", () => {
    expect(agentCanAuthor("createObject")).toBe(true);
    expect(agentCanAuthor("createProceduralLink")).toBe(true);
    expect(agentCanAuthor("createXorExclusion")).toBe(AGENT_CAPABILITY_MATRIX.xorExclusion!.author.supported);
    expect(agentCanAuthor("createRefinement")).toBe(false);
    expect(AGENT_AUTHORING_OPERATIONS).toContain("createObject");
    expect(AGENT_AUTHORING_OPERATIONS.includes("createXorExclusion")).toBe(
      AGENT_CAPABILITY_MATRIX.xorExclusion!.author.supported,
    );
  });

  test("expone versión y capacidad XOR sin convertir escenarios en una promesa de autoría", () => {
    const profile = agentCapabilityProfile();
    expect(profile.version).toBe(AGENT_CAPABILITY_PROFILE);
    expect(profile.existingXor).toMatchObject({
      read: true,
      preserve: true,
      author: AGENT_CAPABILITY_MATRIX.xorExclusion!.author.supported,
      reverse: AGENT_CAPABILITY_MATRIX.xorExclusion!.reverse.supported,
      scenario: true,
    });
    expect(profile.existingRefinement.author).toBe(false);
  });
});
