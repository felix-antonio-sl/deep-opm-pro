/** Profile version covers the authoring and evidence contracts exposed to tasks. */
export const AGENT_CAPABILITY_PROFILE = "opforja-agent-authoring-v3";

export type CapabilityEvidence = {
  supported: boolean;
  test: string;
  version: typeof AGENT_CAPABILITY_PROFILE;
};

type ConstructionCapabilities = {
  read: CapabilityEvidence;
  author: CapabilityEvidence;
  reverse: CapabilityEvidence;
  import: CapabilityEvidence;
  export: CapabilityEvidence;
  scenario: CapabilityEvidence;
};

const cell = (supported: boolean, test: string): CapabilityEvidence => ({
  supported,
  test,
  version: AGENT_CAPABILITY_PROFILE,
});

/**
 * Capability claims are tied to executable witnesses. A missing capability is
 * explicit; corpus knowledge or an inference model cannot turn it on.
 */
export const AGENT_CAPABILITY_MATRIX: Readonly<Record<string, ConstructionCapabilities>> = {
  object: {
    read: cell(true, "src/server/agent/context.test.ts"),
    author: cell(true, "src/server/agent/tools.test.ts"),
    reverse: cell(true, "src/server/agent/changeGateway.test.ts"),
    import: cell(true, "src/serializacion/json.test.ts"),
    export: cell(true, "src/serializacion/json-roundtrip-campos.test.ts"),
    scenario: cell(true, "src/modelo/simulacion/runner.test.ts"),
  },
  process: {
    read: cell(true, "src/server/agent/context.test.ts"),
    author: cell(true, "src/server/agent/tools.test.ts"),
    reverse: cell(true, "src/server/agent/changeGateway.test.ts"),
    import: cell(true, "src/serializacion/json.test.ts"),
    export: cell(true, "src/serializacion/json-roundtrip-campos.test.ts"),
    scenario: cell(true, "src/modelo/simulacion/runner.test.ts"),
  },
  state: {
    read: cell(true, "src/server/agent/context.test.ts"),
    author: cell(true, "src/server/agent/tools.test.ts"),
    reverse: cell(true, "src/server/agent/changeGateway.test.ts"),
    import: cell(true, "src/serializacion/json.test.ts"),
    export: cell(true, "src/serializacion/json-roundtrip-campos.test.ts"),
    scenario: cell(true, "src/modelo/simulacion/runner.test.ts"),
  },
  proceduralLink: {
    read: cell(true, "src/server/agent/context.test.ts"),
    author: cell(true, "src/server/agent/tools.test.ts"),
    reverse: cell(true, "src/server/agent/changeGateway.test.ts"),
    import: cell(true, "src/serializacion/json.test.ts"),
    export: cell(true, "src/serializacion/json-roundtrip-campos.test.ts"),
    scenario: cell(true, "src/modelo/simulacion/runner.test.ts"),
  },
  xorExclusion: {
    read: cell(true, "src/modelo/abanicos.test.ts"),
    author: cell(true, "src/server/agent/xorIntegration.test.ts"),
    reverse: cell(true, "src/modelo/changes/xor.test.ts"),
    import: cell(true, "src/serializacion/abanicoProbabilidades.test.ts"),
    export: cell(true, "src/serializacion/abanicoProbabilidades.test.ts"),
    scenario: cell(true, "src/store/simulacion.test.ts"),
  },
  refinement: {
    read: cell(true, "src/opl/generadores/refinamiento.test.ts"),
    author: cell(false, "src/agent/capabilityProfile.test.ts"),
    reverse: cell(false, "src/agent/capabilityProfile.test.ts"),
    import: cell(true, "src/serializacion/json.test.ts"),
    export: cell(true, "src/serializacion/json-roundtrip-campos.test.ts"),
    scenario: cell(false, "src/agent/capabilityProfile.test.ts"),
  },
};

const OPERATIONS_BY_CONSTRUCTION: Readonly<Record<string, readonly string[]>> = {
  object: ["createObject", "createProcess", "renameEntity", "deleteEntity"],
  state: ["createState", "renameState", "deleteState"],
  proceduralLink: ["createProceduralLink", "deleteLink"],
  xorExclusion: ["createXorExclusion"],
};

export const AGENT_AUTHORING_OPERATIONS: readonly string[] = Object.entries(OPERATIONS_BY_CONSTRUCTION)
  .filter(([construction]) => AGENT_CAPABILITY_MATRIX[construction]?.author.supported)
  .flatMap(([, operations]) => operations);

/** Use at the tool boundary so static prompts and execution share one gate. */
export function agentCanAuthor(operation: string): boolean {
  return AGENT_AUTHORING_OPERATIONS.includes(operation);
}

export function agentCapabilityProfile() {
  return {
    version: AGENT_CAPABILITY_PROFILE,
    capabilityMatrix: AGENT_CAPABILITY_MATRIX,
    authoringOperations: [...AGENT_AUTHORING_OPERATIONS],
    existingXor: {
      read: AGENT_CAPABILITY_MATRIX.xorExclusion!.read.supported,
      preserve: true,
      author: AGENT_CAPABILITY_MATRIX.xorExclusion!.author.supported,
      reverse: AGENT_CAPABILITY_MATRIX.xorExclusion!.reverse.supported,
      scenario: AGENT_CAPABILITY_MATRIX.xorExclusion!.scenario.supported,
    },
    existingRefinement: {
      read: AGENT_CAPABILITY_MATRIX.refinement!.read.supported,
      preserve: true,
      author: AGENT_CAPABILITY_MATRIX.refinement!.author.supported,
      reverse: AGENT_CAPABILITY_MATRIX.refinement!.reverse.supported,
    },
    interpretation: "Validación del perfil implementado; no certifica verdad del dominio ni conformidad OPM total",
  };
}
