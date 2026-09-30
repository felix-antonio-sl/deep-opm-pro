import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { jsonSchema, streamText, type ModelMessage, type ToolSet } from "ai";
import type {
  AgentProvider,
  JsonValue,
  ProviderEvent,
  ProviderFailure,
  ProviderMessage,
  ProviderProfile,
  ProviderRequest,
  ProviderUsage,
} from "./provider";

const ENDPOINTS = {
  "opencode-zen": "https://opencode.ai/zen/v1",
  "xiaomi-mimo": "https://api.xiaomimimo.com/v1",
} as const;

export type OpenCodeProviderOptions = {
  readonly apiKey: string;
  readonly fetch?: ProviderFetch;
};

export type ProviderFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

type HttpFailure = { readonly status: number; readonly retryAfterMs?: number };

/** One SDK call per turn; tool execution and retries belong to the runtime. */
export function createOpenCodeProvider(options: OpenCodeProviderOptions): AgentProvider {
  return createCompatibleProvider("opencode-zen", options);
}

export function createMimoProvider(options: OpenCodeProviderOptions): AgentProvider {
  return createCompatibleProvider("xiaomi-mimo", options);
}

function createCompatibleProvider(providerName: ProviderProfile["provider"], { apiKey, fetch: fetchImpl = fetch }: OpenCodeProviderOptions): AgentProvider {
  if (apiKey.trim().length === 0) throw new Error("Provider API key is required");
  const baseURL = ENDPOINTS[providerName];

  return {
    async *stream(request: ProviderRequest, signal: AbortSignal): AsyncIterable<ProviderEvent> {
      const invalid = validateRequest(request, providerName);
      if (invalid) {
        yield { type: "error", error: invalid };
        return;
      }
      if (signal.aborted) {
        yield { type: "error", error: { code: "cancelled", message: "Provider call was cancelled." } };
        return;
      }

      let httpFailure: HttpFailure | undefined;
      let receivedResponse = false;
      const guardedFetch: ProviderFetch = async (input, init) => {
        const url = new URL(input instanceof Request ? input.url : input.toString());
        if (url.href !== `${baseURL}/chat/completions`) {
          throw new Error("Unexpected provider URL");
        }
        const response = await fetchImpl(input, { ...init, redirect: "error" });
        receivedResponse = true;
        if (!response.ok) {
          const retryAfter = response.headers.get("retry-after");
          const retryAfterMs = retryAfter === null ? undefined : parseRetryAfterMs(retryAfter);
          httpFailure = {
            status: response.status,
            ...(retryAfterMs === undefined ? {} : { retryAfterMs }),
          };
        }
        return response;
      };

      const compatible = createOpenAICompatible({
        name: providerName,
        baseURL,
        apiKey,
        fetch: guardedFetch as typeof fetch,
        includeUsage: true,
        headers: {
          ...(providerName === "opencode-zen" ? { "x-opencode-session": request.sessionId } : {}),
          "User-Agent": "opforja",
        },
        ...(providerName === "xiaomi-mimo" ? {
          // MiMo documents this mode for stable tool calls without a hidden
          // reasoning transcript requirement across turns. Checked 2026-09-23.
          // https://mimo.mi.com/docs/en-US/quick-start/usage-guide/text-generation/deep-thinking
          transformRequestBody: (body: Record<string, unknown>) => {
            const { max_tokens, ...rest } = body;
            return { ...rest, max_completion_tokens: max_tokens, thinking: { type: "disabled" } };
          },
        } : {}),
      });

      let result;
      try {
        const tools = toTools(request);
        result = streamText({
          model: compatible(request.profile.model),
          messages: toModelMessages(request.messages),
          allowSystemInMessages: true,
          tools,
          maxOutputTokens: request.limits.maxOutputTokens,
          maxRetries: 0,
          streamRetries: 0,
          abortSignal: signal,
          // The SDK defaults to console.error(error), which can include raw
          // provider bodies and request metadata. This adapter never logs them.
          onError: () => "",
        });
      } catch {
        yield { type: "error", error: { code: "invalid-request", message: "Provider request could not be prepared." } };
        return;
      }

      let sawFinish = false;
      let invalidToolCall = false;
      const seenToolCallIds = new Set<string>();
      try {
        for await (const part of result.stream) {
          if (signal.aborted || part.type === "abort") {
            yield { type: "error", error: { code: "cancelled", message: "Provider call was cancelled." } };
            return;
          }

          if (part.type === "text-delta") {
            if (part.text.length > 0) yield { type: "text-delta", text: part.text };
            continue;
          }

          if (part.type === "tool-call") {
            const input = part.input;
            if (
              ("invalid" in part && part.invalid === true) ||
              !(part.toolName in request.tools) ||
              !isJsonObject(input) ||
              part.toolCallId.length === 0 ||
              seenToolCallIds.has(part.toolCallId)
            ) {
              invalidToolCall = true;
              continue;
            }
            seenToolCallIds.add(part.toolCallId);
            yield {
              type: "tool-call",
              toolCallId: part.toolCallId,
              name: part.toolName,
              args: input,
            };
            continue;
          }

          if (part.type === "error") {
            yield { type: "error", error: httpFailure
              ? providerFailure(httpFailure, receivedResponse)
              : streamFailure(undefined, receivedResponse) };
            return;
          }

          if (part.type === "finish") {
            sawFinish = true;
            const usage = getUsage(part.totalUsage);
            yield { type: "usage", usage };
            if (usage.status === "unknown") {
              yield { type: "error", error: { code: "usage-unavailable", message: "Provider ended without complete token usage." } };
              return;
            }
            if (part.finishReason !== "stop" && part.finishReason !== "tool-calls") {
              yield { type: "error", error: { code: "stream-truncated", message: "Provider did not finish a complete turn." } };
              return;
            }
            if (invalidToolCall) {
              yield { type: "error", error: { code: "invalid-response", message: "Provider returned an invalid tool call." } };
              return;
            }
            yield { type: "finish", reason: part.finishReason, usage };
            return;
          }
        }
      } catch {
        yield { type: "error", error: signal.aborted
          ? { code: "cancelled", message: "Provider call was cancelled." }
          : streamFailure(httpFailure, receivedResponse) };
        return;
      }

      if (!sawFinish) {
        yield { type: "error", error: httpFailure
          ? providerFailure(httpFailure, receivedResponse)
          : { code: "stream-truncated", message: "Provider stream ended before its finish event." } };
      }
    },
  };
}

function toTools(request: ProviderRequest): ToolSet {
  const entries = Object.entries(request.tools).map(([name, definition]) => [
    name,
    {
      description: definition.description,
      // The SDK parses complete JSON input; the application gateway must still
      // validate this schema and domain invariants before dispatching a tool.
      inputSchema: jsonSchema<JsonValue>(definition.inputSchema as never),
    },
  ] as const);
  return Object.fromEntries(entries) as ToolSet;
}

function toModelMessages(messages: readonly ProviderMessage[]): ModelMessage[] {
  return messages.map((message): ModelMessage => {
    if (message.role === "system" || message.role === "user") return message;
    if (message.role === "tool") {
      return {
        role: "tool",
        content: [{
          type: "tool-result",
          toolCallId: message.toolCallId,
          toolName: message.name,
          output: { type: "text", value: message.content },
        }],
      };
    }

    const content: Array<{ type: "text"; text: string } | {
      type: "tool-call";
      toolCallId: string;
      toolName: string;
      input: JsonValue;
    }> = [];
    if (message.content.length > 0) content.push({ type: "text", text: message.content });
    for (const call of message.toolCalls ?? []) {
      content.push({ type: "tool-call", toolCallId: call.id, toolName: call.name, input: call.args });
    }
    return { role: "assistant", content };
  });
}

function validateRequest(request: ProviderRequest, providerName: ProviderProfile["provider"]): ProviderFailure | undefined {
  if (
    request.profile.provider !== providerName ||
    request.profile.protocol !== "chat-completions" ||
    request.profile.model.trim().length === 0 ||
    !/^[A-Za-z0-9._:-]{1,128}$/.test(request.sessionId) ||
    !Number.isSafeInteger(request.limits.maxOutputTokens) ||
    request.limits.maxOutputTokens < 1 ||
    request.messages.length === 0
  ) {
    return { code: "invalid-request", message: "Provider request is invalid for the selected profile." };
  }

  for (const [name, definition] of Object.entries(request.tools)) {
    if (!/^[A-Za-z_][A-Za-z0-9_-]{0,63}$/.test(name) || definition.description.trim().length === 0) {
      return { code: "invalid-request", message: "Provider tool definition is invalid." };
    }
  }
  return undefined;
}

function getUsage(usage: { inputTokens: number | undefined; outputTokens: number | undefined }): ProviderUsage {
  const inputTokens = validTokenCount(usage.inputTokens) ? usage.inputTokens : null;
  const outputTokens = validTokenCount(usage.outputTokens) ? usage.outputTokens : null;
  return inputTokens !== null && outputTokens !== null
    ? { status: "known", inputTokens, outputTokens }
    : { status: "unknown", inputTokens, outputTokens };
}

function validTokenCount(value: number | undefined): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isJsonObject(value: unknown): value is { [key: string]: JsonValue } {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  return Object.values(value).every(isJsonValue);
}

function isJsonValue(value: unknown): value is JsonValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isJsonValue);
  if (typeof value === "object") return Object.values(value).every(isJsonValue);
  return false;
}

function providerFailure(failure: HttpFailure | undefined, receivedResponse: boolean): ProviderFailure {
  if (failure?.status === 401) return { code: "unauthorized", message: "Provider rejected the API key." };
  if (failure?.status === 429) return {
    code: "rate-limited",
    message: "Provider rate limit was reached.",
    ...(failure.retryAfterMs === undefined ? {} : { retryAfterMs: failure.retryAfterMs }),
  };
  return receivedResponse
    ? { code: "provider-error", message: "Provider could not complete the request." }
    : { code: "stream-truncated", message: "Provider connection ended before a complete response." };
}

function streamFailure(failure: HttpFailure | undefined, receivedResponse: boolean): ProviderFailure {
  if (failure?.status === 401 || failure?.status === 429) return providerFailure(failure, receivedResponse);
  return receivedResponse
    ? { code: "stream-truncated", message: "Provider stream ended before a complete response." }
    : { code: "provider-error", message: "Provider could not start the request." };
}

function parseRetryAfterMs(value: string): number | undefined {
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.round(seconds * 1000);
  const date = Date.parse(value);
  if (Number.isNaN(date)) return undefined;
  return Math.max(0, date - Date.now());
}
