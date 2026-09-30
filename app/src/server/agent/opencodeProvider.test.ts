import { describe, expect, it } from "bun:test";
import { createMimoProvider, createOpenCodeProvider } from "./opencodeProvider";
import type { ProviderEvent, ProviderRequest } from "./provider";

const schema = {
  type: "object",
  properties: { id: { type: "string" } },
  required: ["id"],
  additionalProperties: false,
} as const;

const baseRequest: ProviderRequest = {
  profile: { provider: "opencode-zen", protocol: "chat-completions", model: "glm-5.2" },
  sessionId: "task-test-001",
  messages: [
    { role: "system", content: "Use only the provided tools." },
    { role: "user", content: "Inspect the synthetic objects." },
  ],
  tools: { inspect: { description: "Inspect a synthetic object by id.", inputSchema: schema } },
  limits: { maxOutputTokens: 120 },
};

describe("OpenCode Zen provider", () => {
  it("uses the fixed MiMo endpoint, bounded output and explicit tool calling mode", async () => {
    let captured: Record<string, unknown> | undefined;
    let destination = "";
    const provider = createMimoProvider({ apiKey: "mimo-test-key", fetch: async (input, init) => {
      destination = String(input);
      captured = JSON.parse(String(init?.body));
      expect(init?.redirect).toBe("error");
      expect(new Headers(init?.headers).get("authorization")).toBe("Bearer mimo-test-key");
      expect(new Headers(init?.headers).has("x-opencode-session")).toBe(false);
      return sseResponse([choiceChunk({ content: "Preparado." }), finishChunk("stop", { prompt_tokens: 12, completion_tokens: 3, total_tokens: 15 }), "data: [DONE]\n\n"]);
    } });
    const events = await collect(provider.stream({ ...baseRequest, profile: { provider: "xiaomi-mimo", protocol: "chat-completions", model: "mimo-v2.6-pro" } }, new AbortController().signal));
    expect(destination).toBe("https://api.xiaomimimo.com/v1/chat/completions");
    expect(captured).toMatchObject({ model: "mimo-v2.6-pro", max_completion_tokens: 120, thinking: { type: "disabled" } });
    expect(captured?.max_tokens).toBeUndefined();
    expect(events.at(-1)?.type).toBe("finish");
    expect(JSON.stringify(events)).not.toContain("mimo-test-key");
    const mismatch = await collect(provider.stream(baseRequest, new AbortController().signal));
    expect(mismatch).toMatchObject([{ type: "error", error: { code: "invalid-request" } }]);
  });

  it("streams text, usage, and a final event without exposing provider errors", async () => {
    const captured: Array<{ url: string; headers: Headers; body: Record<string, unknown> }> = [];
    const provider = createOpenCodeProvider({
      apiKey: "test-key",
      fetch: async (input, init) => {
        captured.push({
          url: String(input),
          headers: new Headers(init?.headers),
          body: JSON.parse(String(init?.body)) as Record<string, unknown>,
        });
        return sseResponse([
          choiceChunk({ content: "El objeto existe." }),
          finishChunk("stop", { prompt_tokens: 11, completion_tokens: 4, total_tokens: 15 }),
          "data: [DONE]\n\n",
        ]);
      },
    });

    const events = await collect(provider.stream(baseRequest, new AbortController().signal));

    expect(events).toEqual([
      { type: "text-delta", text: "El objeto existe." },
      { type: "usage", usage: { status: "known", inputTokens: 11, outputTokens: 4 } },
      { type: "finish", reason: "stop", usage: { status: "known", inputTokens: 11, outputTokens: 4 } },
    ]);
    expect(captured).toHaveLength(1);
    expect(captured[0]?.url).toBe("https://opencode.ai/zen/v1/chat/completions");
    expect(captured[0]?.headers.get("authorization")).toBe("Bearer test-key");
    expect(captured[0]?.headers.get("x-opencode-session")).toBe("task-test-001");
    expect(captured[0]?.body).toMatchObject({ model: "glm-5.2", stream: true });
    expect(JSON.stringify(events)).not.toContain("test-key");
  });

  it("emits two complete tool calls and preserves assistant calls plus results on the next turn", async () => {
    const bodies: Array<Record<string, unknown>> = [];
    let callCount = 0;
    const provider = createOpenCodeProvider({
      apiKey: "test-key",
      fetch: async (_input, init) => {
        bodies.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
        callCount += 1;
        return callCount === 1
          ? sseResponse([
              choiceChunk({ tool_calls: [
                { index: 0, id: "call-a", type: "function", function: { name: "inspect", arguments: "{\"id\":\"A\"}" } },
                { index: 1, id: "call-b", type: "function", function: { name: "inspect", arguments: "{\"id\":\"B\"}" } },
              ] }),
              finishChunk("tool_calls", { prompt_tokens: 9, completion_tokens: 8, total_tokens: 17 }),
              "data: [DONE]\n\n",
            ])
          : sseResponse([
              choiceChunk({ content: "A está listo y B está pendiente." }),
              finishChunk("stop", { prompt_tokens: 17, completion_tokens: 9, total_tokens: 26 }),
              "data: [DONE]\n\n",
            ]);
      },
    });

    const firstTurn = await collect(provider.stream(baseRequest, new AbortController().signal));
    const calls = firstTurn.filter((event) => event.type === "tool-call");
    expect(calls).toEqual([
      { type: "tool-call", toolCallId: "call-a", name: "inspect", args: { id: "A" } },
      { type: "tool-call", toolCallId: "call-b", name: "inspect", args: { id: "B" } },
    ]);
    expect(firstTurn.at(-1)?.type).toBe("finish");

    const followUp: ProviderRequest = {
      ...baseRequest,
      messages: [
        ...baseRequest.messages,
        {
          role: "assistant",
          content: "",
          toolCalls: calls.map((event) => {
            if (event.type !== "tool-call") throw new Error("Expected complete tool call");
            return { id: event.toolCallId, name: event.name, args: event.args };
          }),
        },
        { role: "tool", toolCallId: "call-a", name: "inspect", content: "{\"id\":\"A\",\"state\":\"ready\"}" },
        { role: "tool", toolCallId: "call-b", name: "inspect", content: "{\"id\":\"B\",\"state\":\"pending\"}" },
        { role: "user", content: "Summarize those two results." },
      ],
    };
    const secondTurn = await collect(provider.stream(followUp, new AbortController().signal));
    expect(secondTurn).toContainEqual({ type: "text-delta", text: "A está listo y B está pendiente." });
    expect(bodies).toHaveLength(2);
    const secondMessages = bodies[1]?.messages as Array<Record<string, unknown>>;
    expect(secondMessages.some((message) => message.role === "assistant" && Array.isArray(message.tool_calls))).toBe(true);
    expect(secondMessages.filter((message) => message.role === "tool")).toHaveLength(2);
    expect(secondMessages.filter((message) => message.role === "tool").map((message) => message.tool_call_id)).toEqual(["call-a", "call-b"]);
  });

  it("maps 401 without returning the response body", async () => {
    const provider = createOpenCodeProvider({
      apiKey: "test-key",
      fetch: async () => new Response("private provider error detail", { status: 401 }),
    });

    const events = await collect(provider.stream(baseRequest, new AbortController().signal));
    expect(events).toContainEqual({ type: "error", error: { code: "unauthorized", message: "Provider rejected the API key." } });
    expect(JSON.stringify(events)).not.toContain("private provider error detail");
  });

  it("maps 429 Retry-After and does not retry behind the runtime", async () => {
    let calls = 0;
    const provider = createOpenCodeProvider({
      apiKey: "test-key",
      fetch: async () => {
        calls += 1;
        return new Response("quota detail", { status: 429, headers: { "retry-after": "2" } });
      },
    });

    const events = await collect(provider.stream(baseRequest, new AbortController().signal));
    expect(calls).toBe(1);
    expect(events).toContainEqual({
      type: "error",
      error: { code: "rate-limited", message: "Provider rate limit was reached.", retryAfterMs: 2000 },
    });
  });

  it("reports unknown usage and refuses a successful finish when token counts are absent", async () => {
    const provider = createOpenCodeProvider({
      apiKey: "test-key",
      fetch: async () => sseResponse([
        choiceChunk({ content: "Ready." }),
        finishChunk("stop"),
        "data: [DONE]\n\n",
      ]),
    });

    const events = await collect(provider.stream(baseRequest, new AbortController().signal));
    expect(events).toContainEqual({ type: "usage", usage: { status: "unknown", inputTokens: null, outputTokens: null } });
    expect(events).toContainEqual({
      type: "error",
      error: { code: "usage-unavailable", message: "Provider ended without complete token usage." },
    });
    expect(events.some((event) => event.type === "finish")).toBe(false);
  });

  it("discards an incomplete stream instead of treating a partial tool call as complete", async () => {
    const provider = createOpenCodeProvider({
      apiKey: "test-key",
      fetch: async () => sseResponse([
        choiceChunk({ tool_calls: [
          { index: 0, id: "call-incomplete", type: "function", function: { name: "inspect", arguments: "{\"id\":" } },
        ] }),
        // EOF before the provider finish/usage event.
      ]),
    });

    const events = await collect(provider.stream(baseRequest, new AbortController().signal));
    expect(events.some((event) => event.type === "tool-call")).toBe(false);
    const lastEvent = events.at(-1);
    expect(lastEvent?.type).toBe("error");
    if (lastEvent?.type !== "error") throw new Error("Expected stream failure");
    expect(lastEvent.error.code).toBe("stream-truncated");
  });

  it("forwards abort and emits an explicit cancellation", async () => {
    const controller = new AbortController();
    const captured: { signal: AbortSignal | null } = { signal: null };
    const provider = createOpenCodeProvider({
      apiKey: "test-key",
      fetch: async (_input, init) => {
        captured.signal = init?.signal ?? null;
        controller.abort();
        throw new DOMException("cancelled", "AbortError");
      },
    });

    const events = await collect(provider.stream(baseRequest, controller.signal));
    expect(captured.signal).not.toBeNull();
    expect(captured.signal?.aborted).toBe(true);
    expect(events).toContainEqual({ type: "error", error: { code: "cancelled", message: "Provider call was cancelled." } });
  });

  it("does not call the provider for an already aborted signal", async () => {
    let calls = 0;
    const controller = new AbortController();
    controller.abort();
    const provider = createOpenCodeProvider({ apiKey: "test-key", fetch: async () => { calls += 1; return new Response(); } });

    const events = await collect(provider.stream(baseRequest, controller.signal));
    expect(calls).toBe(0);
    expect(events).toEqual([{ type: "error", error: { code: "cancelled", message: "Provider call was cancelled." } }]);
  });
});

async function collect(stream: AsyncIterable<ProviderEvent>): Promise<ProviderEvent[]> {
  const events: ProviderEvent[] = [];
  for await (const event of stream) events.push(event);
  return events;
}

function choiceChunk(delta: Record<string, unknown>): string {
  return sse({
    id: "chatcmpl-test",
    object: "chat.completion.chunk",
    created: 1,
    model: "glm-5.2",
    choices: [{ index: 0, delta, finish_reason: null }],
  });
}

function finishChunk(
  finishReason: string,
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number },
): string {
  return sse({
    id: "chatcmpl-test",
    object: "chat.completion.chunk",
    created: 1,
    model: "glm-5.2",
    choices: [{ index: 0, delta: {}, finish_reason: finishReason }],
    ...(usage === undefined ? {} : { usage }),
  });
}

function sse(value: unknown): string {
  return `data: ${JSON.stringify(value)}\n\n`;
}

function sseResponse(events: readonly string[], status = 200, headers?: HeadersInit): Response {
  const bytes = new TextEncoder().encode(events.join(""));
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      // Deliberately split inside SSE frames so the SDK parser must reassemble them.
      const midpoint = Math.max(1, Math.floor(bytes.length / 2));
      controller.enqueue(bytes.slice(0, midpoint));
      controller.enqueue(bytes.slice(midpoint));
      controller.close();
    },
  });
  return new Response(body, { status, headers: { "content-type": "text/event-stream", ...headers } });
}
