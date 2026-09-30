import type { PersistenciaSesion } from "../modelPersistence";
import { ChangeGateway } from "./changeGateway";
import { loadAgentConfig, type AgentConfig } from "./config";
import { createAgentHttpHandler } from "./http";
import { createMimoProvider, createOpenCodeProvider } from "./opencodeProvider";
import type { AgentProvider } from "./provider";
import type { AgentRepository } from "./repository";
import { TaskRuntime } from "./taskRuntime";
import { createAgentTaskTools } from "./tools";
import { VariantService } from "./variants";

/** One runtime and one repository per backend process, shared by every request. */
export function createAgentService(repository: AgentRepository, config: AgentConfig = loadAgentConfig()) {
  const provider: AgentProvider = config.apiKey
    ? (config.profile.provider === "xiaomi-mimo" ? createMimoProvider : createOpenCodeProvider)({ apiKey: config.apiKey }) : {
    async *stream() { yield { type: "error", error: { code: "invalid-request", message: "Proveedor sin configurar" } }; },
  };
  const gateway = new ChangeGateway({ repository });
  const runtime = new TaskRuntime({ repository, provider, config, tools: createAgentTaskTools({ repository }) });
  const variants = new VariantService({ repository });
  const handle: (request: Request, session: PersistenciaSesion) => Promise<Response> = createAgentHttpHandler({ repository, config, gateway, runtime, variants });
  return { handle, runtime };
}
