import { createMimoProvider, createOpenCodeProvider } from "../src/server/agent/opencodeProvider";
import type {
  ProviderEvent,
  ProviderMessage,
  ProviderRequest,
  ProviderUsage,
} from "../src/server/agent/provider";

const providerName = process.argv[3] === "xiaomi-mimo" ? "xiaomi-mimo" : "opencode-zen";
const model = providerName === "xiaomi-mimo" ? "mimo-v2.6-pro" : "glm-5.2";
const syntheticTool = "lookup_synthetic_card";
const maxOutputTokens = 240;
const syntheticTools = {
  [syntheticTool]: {
    description: "Read one fixed synthetic card by id.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", enum: ["demo-card"] } },
      required: ["id"],
      additionalProperties: false,
    },
  },
} as const;

if (process.argv.slice(2).includes("--help")) {
  console.log("Usage: bun run scripts/probe-agent-provider.ts --provider xiaomi-mimo --model mimo-v2.6-pro --synthetic\nAlso supported: --provider opencode-zen --model glm-5.2 --synthetic");
} else {
  await main();
}

async function main(): Promise<void> {
  if (!isExpectedInvocation(process.argv.slice(2))) {
    console.error("This probe only permits the listed fixed synthetic provider/model profiles.");
    process.exitCode = 2;
    return;
  }

  const apiKey = process.env.OPFORJA_AGENT_API_KEY;
  if (!apiKey) {
    console.error("OPFORJA_AGENT_API_KEY is not set; no provider request was made.");
    process.exitCode = 2;
    return;
  }

  try {
    await verifyAuthenticatedCatalog(apiKey);
    const provider = (providerName === "xiaomi-mimo" ? createMimoProvider : createOpenCodeProvider)({ apiKey });
    const startedAt = performance.now();
    const first = await completeTurn(provider, {
      profile: { provider: providerName, protocol: "chat-completions", model },
      sessionId: crypto.randomUUID(),
      messages: [
        {
          role: "system",
          content: "Use only lookup_synthetic_card for the fixed synthetic card. Do not invent a result or request external data.",
        },
        { role: "user", content: "Look up the synthetic card with id demo-card." },
      ],
      tools: syntheticTools,
      limits: { maxOutputTokens },
    });
    const firstCall = first.toolCalls[0];
    if (first.toolCalls.length !== 1 || firstCall === undefined || firstCall.name !== syntheticTool || !isDemoCardArgs(firstCall.args)) {
      throw new ProbeFailure("unexpected-tool-call");
    }

    // This is the only dispatched tool, and it reads a constant local fixture.
    const syntheticResult = { id: "demo-card", state: "ready", count: 3 } as const;
    const secondMessages: ProviderMessage[] = [
      ...first.requestMessages,
      {
        role: "assistant",
        content: first.text,
        toolCalls: first.toolCalls.map((call) => ({ id: call.toolCallId, name: call.name, args: call.args })),
      },
      {
        role: "tool",
        toolCallId: firstCall.toolCallId,
        name: syntheticTool,
        content: JSON.stringify(syntheticResult),
      },
      { role: "user", content: "Summarize the synthetic card in one sentence." },
    ];
    const second = await completeTurn(provider, {
      profile: { provider: providerName, protocol: "chat-completions", model },
      sessionId: first.sessionId,
      messages: secondMessages,
      tools: syntheticTools,
      limits: { maxOutputTokens },
    });
    if (second.toolCalls.length !== 0 || second.text.trim().length === 0) {
      throw new ProbeFailure("unexpected-second-turn-result");
    }

    const manifest = await Bun.file(new URL("../package.json", import.meta.url)).json() as {
      dependencies?: Record<string, string>;
    };
    const totalDurationMs = Math.round((performance.now() - startedAt) * 100) / 100;
    console.log(JSON.stringify({
      result: "passed",
      synthetic: true,
      profileCandidateOnly: true,
      enabledByProbe: false,
      provider: providerName,
      model,
      authenticatedCatalog: "candidate model listed",
      sdk: {
        ai: manifest.dependencies?.ai,
        openaiCompatible: manifest.dependencies?.["@ai-sdk/openai-compatible"],
        bun: Bun.version,
      },
      turns: 2,
      toolCalls: 1,
      toolDispatch: "fixed-local-synthetic-fixture",
      usage: { firstTurn: first.usage, secondTurn: second.usage },
      finalTextCharacters: second.text.length,
      totalDurationMs,
    }, null, 2));
  } catch (error) {
    const code = error instanceof ProbeFailure ? error.code : "provider-probe-failed";
    console.error(`Provider probe failed (${code}); response bodies and prompts were suppressed.`);
    process.exitCode = 1;
  }
}

async function verifyAuthenticatedCatalog(apiKey: string): Promise<void> {
  let response: Response;
  try {
    const catalogUrl = providerName === "xiaomi-mimo" ? "https://api.xiaomimimo.com/v1/models" : "https://opencode.ai/zen/v1/models";
    response = await fetch(catalogUrl, {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json", "User-Agent": "opforja" },
      redirect: "error",
      signal: AbortSignal.timeout(120_000),
    });
  } catch {
    throw new ProbeFailure("catalog-unavailable");
  }
  if (response.status === 401) throw new ProbeFailure("catalog-unauthorized");
  if (response.status === 429) throw new ProbeFailure("catalog-rate-limited");
  if (!response.ok) throw new ProbeFailure("catalog-request-failed");

  let catalog: unknown;
  try {
    catalog = await response.json();
  } catch {
    throw new ProbeFailure("catalog-invalid-response");
  }
  if (
    typeof catalog !== "object" ||
    catalog === null ||
    !("data" in catalog) ||
    !Array.isArray(catalog.data) ||
    !catalog.data.some((entry) => typeof entry === "object" && entry !== null && "id" in entry && entry.id === model)
  ) {
    throw new ProbeFailure("candidate-model-not-listed");
  }
}

async function completeTurn(provider: ReturnType<typeof createOpenCodeProvider>, request: ProviderRequest): Promise<{
  readonly requestMessages: readonly ProviderMessage[];
  readonly sessionId: string;
  readonly text: string;
  readonly toolCalls: Array<Extract<ProviderEvent, { type: "tool-call" }>>;
  readonly usage: Extract<ProviderUsage, { status: "known" }>;
}> {
  let text = "";
  let usage: ProviderUsage | undefined;
  let finishSeen = false;
  const toolCalls: Array<Extract<ProviderEvent, { type: "tool-call" }>> = [];
  for await (const event of provider.stream(request, AbortSignal.timeout(120_000))) {
    if (event.type === "text-delta") text += event.text;
    else if (event.type === "tool-call") toolCalls.push(event);
    else if (event.type === "usage") usage = event.usage;
    else if (event.type === "finish") finishSeen = true;
    else throw new ProbeFailure(event.error.code);
  }

  if (!finishSeen || usage?.status !== "known") throw new ProbeFailure("incomplete-turn");
  return { requestMessages: request.messages, sessionId: request.sessionId, text, toolCalls, usage };
}

function isExpectedInvocation(args: readonly string[]): boolean {
  const expected = ["--provider", providerName, "--model", model, "--synthetic"];
  return args.length === expected.length && expected.every((value, index) => args[index] === value);
}

function isDemoCardArgs(value: import("../src/server/agent/provider").JsonValue | undefined): value is { id: "demo-card" } {
  return typeof value === "object" && value !== null && !Array.isArray(value) && value.id === "demo-card";
}

class ProbeFailure extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}
