/** Server-only, provider-neutral contract for one model turn. */

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export type JsonSchema = {
  readonly type?: string | readonly string[];
  readonly description?: string;
  readonly enum?: readonly JsonValue[];
  readonly const?: JsonValue;
  readonly properties?: Readonly<Record<string, JsonSchema>>;
  readonly required?: readonly string[];
  readonly items?: JsonSchema;
  readonly additionalProperties?: boolean | JsonSchema;
  readonly minimum?: number;
  readonly maximum?: number;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly [keyword: string]: JsonValue | JsonSchema | readonly JsonValue[] | undefined;
};

export type ProviderToolDefinition = {
  readonly description: string;
  readonly inputSchema: JsonSchema;
};

export type ProviderToolCallMessage = {
  readonly id: string;
  readonly name: string;
  readonly args: JsonValue;
};

export type ProviderMessage =
  | { readonly role: "system"; readonly content: string }
  | { readonly role: "user"; readonly content: string }
  | {
      readonly role: "assistant";
      readonly content: string;
      readonly toolCalls?: readonly ProviderToolCallMessage[];
    }
  | {
      readonly role: "tool";
      readonly toolCallId: string;
      readonly name: string;
      readonly content: string;
    };

export type ProviderProfile = {
  readonly provider: "opencode-zen" | "xiaomi-mimo";
  readonly protocol: "chat-completions";
  readonly model: string;
};

export type ProviderRequest = {
  readonly profile: ProviderProfile;
  /** Opaque, stable for the task; must not contain document or person data. */
  readonly sessionId: string;
  readonly messages: readonly ProviderMessage[];
  readonly tools: Readonly<Record<string, ProviderToolDefinition>>;
  readonly limits: { readonly maxOutputTokens: number };
};

export type ProviderUsage =
  | { readonly status: "known"; readonly inputTokens: number; readonly outputTokens: number }
  | {
      readonly status: "unknown";
      readonly inputTokens: number | null;
      readonly outputTokens: number | null;
    };

export type ProviderFailureCode =
  | "unauthorized"
  | "rate-limited"
  | "stream-truncated"
  | "usage-unavailable"
  | "invalid-request"
  | "invalid-response"
  | "provider-error"
  | "cancelled";

export type ProviderFailure = {
  readonly code: ProviderFailureCode;
  /** Deliberately generic; never forwards provider bodies, prompts, or headers. */
  readonly message: string;
  readonly retryAfterMs?: number;
};

export type ProviderEvent =
  | { readonly type: "text-delta"; readonly text: string }
  | {
      /** Candidate only: buffer until finish + known usage; gateway still validates before dispatch. */
      readonly type: "tool-call";
      readonly toolCallId: string;
      readonly name: string;
      readonly args: JsonValue;
    }
  | { readonly type: "usage"; readonly usage: ProviderUsage }
  | { readonly type: "finish"; readonly reason: string; readonly usage: ProviderUsage }
  | { readonly type: "error"; readonly error: ProviderFailure };

export interface AgentProvider {
  stream(request: ProviderRequest, signal: AbortSignal): AsyncIterable<ProviderEvent>;
}
