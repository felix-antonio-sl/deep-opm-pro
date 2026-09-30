import type { ChangeSet, CommitReceipt, TaskEvent } from "../agent/contracts";
import type { TaskStatus } from "../agent/taskState";
import type { TaskBudget } from "../agent/taskState";
import type { AppliedChangeView, StartTaskRequest, TaskView } from "../agent/taskView";
import type { ProjectedChangeDiff } from "../agent/changeProjection";
import { obtenerSesionBackend } from "./backend";
import { encodeSessionIdentity, SESSION_IDENTITY_HEADER } from "./sessionIdentity";

const ROOT = "/__deep-opm/agent";

export interface AgentAvailability {
  available: boolean;
  reason: string | null;
  profile: unknown;
  model: string;
  budgetIncrement?: TaskBudget;
}

export interface AgentChangeView {
  change: ChangeSet;
  status: "prepared" | "committed" | "rejected";
  diff: ProjectedChangeDiff | null;
  validation?: unknown;
}

export interface PreparedAgentChange {
  changeId: string;
  change: ChangeSet;
  diff: ProjectedChangeDiff;
}

export interface AgentGrantRequest {
  documentId: string;
  changeId: string;
  kind: "review" | "delegated";
  controllerId: string;
  clientSequence: number;
  workingCopyHash: string;
}

export interface AgentCommitGrant {
  id: string;
  token: string;
  expiresAt: string;
}

export interface AgentClient {
  status(signal?: AbortSignal): Promise<AgentAvailability>;
  listTasks(documentId: string, signal?: AbortSignal): Promise<TaskView[]>;
  getTask(documentId: string, taskId: string, signal?: AbortSignal): Promise<{ task: TaskView; cursor: number }>;
  startTask(input: StartTaskRequest, signal?: AbortSignal): Promise<TaskView>;
  instruct(documentId: string, task: TaskView, text: string, signal?: AbortSignal): Promise<TaskView>;
  continueTask(documentId: string, taskId: string, input: { answer?: string; acceptReservedUsage?: boolean; extendBudget?: boolean }, signal?: AbortSignal): Promise<TaskView>;
  stop(documentId: string, taskId: string, signal?: AbortSignal): Promise<TaskView>;
  presence(documentId: string, taskId: string, input: { controllerId: string; clientSequence: number; workingCopyHash: string }, signal?: AbortSignal): Promise<TaskView>;
  getChange(documentId: string, changeId: string, signal?: AbortSignal): Promise<AgentChangeView>;
  prepareChange(documentId: string, changeId: string, signal?: AbortSignal): Promise<PreparedAgentChange>;
  prepareUndo(documentId: string, changeId: string, controllerId: string, clientSequence: number, workingCopyHash: string, signal?: AbortSignal): Promise<PreparedAgentChange>;
  prepareReapply(documentId: string, sourceChangeId: string, controllerId: string, clientSequence: number, workingCopyHash: string, signal?: AbortSignal): Promise<{ change: ChangeSet }>;
  grant(input: AgentGrantRequest, signal?: AbortSignal): Promise<AgentCommitGrant>;
  commit(documentId: string, changeId: string, grant: unknown, signal?: AbortSignal): Promise<AppliedChangeView>;
  getReceipt(documentId: string, changeId: string, signal?: AbortSignal): Promise<{ receipt: CommitReceipt | null; applied: AppliedChangeView | null }>;
  resolveReceipt(documentId: string, changeId: string, signal?: AbortSignal): Promise<AppliedChangeView | null>;
  subscribeEvents(input: {
    documentId: string;
    taskId: string;
    after: number;
    onEvent: (event: TaskEvent) => void;
    onSnapshotRequired: () => void;
    signal: AbortSignal;
  }): Promise<void>;
}

/** Same-origin agent transport. Session identity is an expectation header, never a credential. */
export function createAgentClient(fetcher: typeof fetch = fetch): AgentClient {
  const json = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
    const session = await obtenerSesionBackend();
    if (!session.ok) throw new AgentClientError(401, session.error);
    const headers = new Headers(init.headers);
    headers.set(SESSION_IDENTITY_HEADER, encodeSessionIdentity(session.value));
    if (init.body !== undefined && !headers.has("content-type")) headers.set("content-type", "application/json");
    let response: Response;
    try {
      response = await fetcher(path, { ...init, headers, credentials: "same-origin" });
    } catch {
      throw new AgentClientError(0, "No se pudo conectar con el servicio de tareas");
    }
    const payload = await readJson(response);
    if (!response.ok) throw new AgentClientError(response.status, safeError(payload));
    return payload as T;
  };

  const getTask = async (documentId: string, taskId: string, signal?: AbortSignal) => {
    const query = queryOf({ documentId });
    return json<{ task: TaskView; cursor: number }>(`${ROOT}/tasks/${part(taskId)}?${query}`, initSignal(signal));
  };

  return {
    status: async (signal) => {
      const response = await json<Omit<AgentAvailability, "reason"> & { reason?: string | null }>(`${ROOT}/status`, initSignal(signal));
      return { ...response, reason: response.reason ?? null };
    },
    listTasks: async (documentId, signal) => {
      const response = await json<{ tasks: TaskView[] }>(`${ROOT}/tasks?${queryOf({ documentId })}`, initSignal(signal));
      return response.tasks;
    },
    getTask,
    startTask: async (input, signal) => {
      const response = await json<{ task: TaskView }>(`${ROOT}/tasks`, { method: "POST", body: JSON.stringify(input), ...initSignal(signal) });
      return response.task;
    },
    instruct: async (documentId, task, text, signal) => {
      const response = await json<{ task: TaskView }>(`${ROOT}/tasks/${part(task.id)}/instructions`, {
        method: "POST", body: JSON.stringify({ documentId, text, expectedVersion: task.intent.version }), ...initSignal(signal),
      });
      return response.task;
    },
    continueTask: async (documentId, taskId, input, signal) => {
      const response = await json<{ task: TaskView }>(`${ROOT}/tasks/${part(taskId)}/continue`, {
        method: "POST", body: JSON.stringify({ documentId, ...input }), ...initSignal(signal),
      });
      return response.task;
    },
    stop: async (documentId, taskId, signal) => {
      const response = await json<{ task: TaskView }>(`${ROOT}/tasks/${part(taskId)}/stop`, {
        method: "POST", body: JSON.stringify({ documentId }), ...initSignal(signal),
      });
      return response.task;
    },
    presence: async (documentId, taskId, input, signal) => {
      const response = await json<{ task: TaskView }>(`${ROOT}/tasks/${part(taskId)}/presence`, {
        method: "POST", body: JSON.stringify({ documentId, ...input }), ...initSignal(signal),
      });
      return response.task;
    },
    getChange: async (documentId, changeId, signal) => json(
      `${ROOT}/changes/${part(changeId)}?${queryOf({ documentId })}`, initSignal(signal),
    ),
    prepareChange: async (documentId, changeId, signal) => {
      const response = await json<PreparedAgentChange>(`${ROOT}/changes/${part(changeId)}/prepare`, {
        method: "POST", body: JSON.stringify({ documentId }), ...initSignal(signal),
      });
      return response;
    },
    prepareUndo: async (documentId, changeId, controllerId, clientSequence, workingCopyHash, signal) => json<PreparedAgentChange>(
      `${ROOT}/changes/${part(changeId)}/undo`, {
        method: "POST", body: JSON.stringify({ documentId, controllerId, clientSequence, workingCopyHash }), ...initSignal(signal),
      },
    ),
    prepareReapply: async (documentId, sourceChangeId, controllerId, clientSequence, workingCopyHash, signal) => json<{ change: ChangeSet }>(
      `${ROOT}/changes/${part(sourceChangeId)}/reapply`, {
        method: "POST", body: JSON.stringify({ documentId, controllerId, clientSequence, workingCopyHash }), ...initSignal(signal),
      },
    ),
    grant: async (input, signal) => {
      const response = await json<{ grant: AgentCommitGrant }>(`${ROOT}/changes/${part(input.changeId)}/grants`, {
        method: "POST", body: JSON.stringify(input), ...initSignal(signal),
      });
      return response.grant;
    },
    commit: async (documentId, changeId, grant, signal) => json<AppliedChangeView>(
      `${ROOT}/changes/${part(changeId)}/commit`, {
        method: "POST", body: JSON.stringify({ documentId, grant }), ...initSignal(signal),
      },
    ),
    getReceipt: async (documentId, changeId, signal) => {
      return json<{ receipt: CommitReceipt | null; applied: AppliedChangeView | null }>(
        `${ROOT}/changes/${part(changeId)}/receipt?${queryOf({ documentId })}`, initSignal(signal),
      );
    },
    resolveReceipt: async (documentId, changeId, signal) => {
      const response = await json<{ receipt: CommitReceipt | null; applied: AppliedChangeView | null }>(
        `${ROOT}/changes/${part(changeId)}/receipt?${queryOf({ documentId })}`, initSignal(signal),
      );
      return response.applied;
    },
    subscribeEvents: (input) => listenForEvents(fetcher, input),
  };
}

export class AgentClientError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = "AgentClientError";
  }
}

export function agentTaskIsActive(status: TaskStatus): boolean {
  return status === "preparing" || status === "working" || status === "awaiting-decision" || status === "suspended";
}

async function listenForEvents(
  fetcher: typeof fetch,
  input: Parameters<AgentClient["subscribeEvents"]>[0],
): Promise<void> {
  let cursor = input.after;
  while (!input.signal.aborted) {
    const session = await obtenerSesionBackend();
    if (!session.ok) throw new AgentClientError(401, session.error);
    const headers = new Headers({
      [SESSION_IDENTITY_HEADER]: encodeSessionIdentity(session.value),
      accept: "text/event-stream",
    });
    const path = `${ROOT}/tasks/${part(input.taskId)}/events?${queryOf({ documentId: input.documentId, after: String(cursor) })}`;
    let response: Response;
    try {
      response = await fetcher(path, { headers, credentials: "same-origin", signal: input.signal });
    } catch {
      if (input.signal.aborted) return;
      await pause(1_000, input.signal);
      continue;
    }
    if (!response.ok || !response.body) throw new AgentClientError(response.status, "No se pudieron recuperar los eventos de la tarea");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      while (!input.signal.aborted) {
        const chunk = await reader.read();
        if (chunk.done) break;
        buffer += decoder.decode(chunk.value, { stream: true });
        const frames = buffer.split(/\r?\n\r?\n/);
        buffer = frames.pop() ?? "";
        for (const frame of frames) {
          const parsed = parseEventFrame(frame);
          if (!parsed) continue;
          if (parsed.type === "snapshot-required") {
            input.onSnapshotRequired();
            return;
          }
          if (parsed.event.sequence !== cursor + 1) {
            input.onSnapshotRequired();
            return;
          }
          cursor = parsed.event.sequence;
          input.onEvent(parsed.event);
        }
      }
    } finally {
      try { await reader.cancel(); } catch { /* Stream may already have closed. */ }
    }
    return;
  }
}

function parseEventFrame(frame: string): { type: "task"; event: TaskEvent } | { type: "snapshot-required" } | null {
  let eventType = "message";
  let data = "";
  for (const line of frame.split(/\r?\n/)) {
    if (line.startsWith("event:")) eventType = line.slice(6).trim();
    else if (line.startsWith("data:")) data += `${data ? "\n" : ""}${line.slice(5).trimStart()}`;
  }
  if (eventType === "snapshot-required") return { type: "snapshot-required" };
  if (eventType !== "task" || !data) return null;
  let event: unknown;
  try { event = JSON.parse(data); } catch { return { type: "snapshot-required" }; }
  if (!isTaskEvent(event)) return { type: "snapshot-required" };
  return { type: "task", event };
}

function isTaskEvent(value: unknown): value is TaskEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Partial<TaskEvent>;
  return typeof event.id === "string" && typeof event.taskId === "string" && Number.isSafeInteger(event.sequence) &&
    ["status", "result", "decision", "committed", "invalidated"].includes(String(event.kind)) &&
    (event.revision === null || typeof event.revision === "number") &&
    (event.resultId === null || typeof event.resultId === "string");
}

function queryOf(values: Record<string, string>): string {
  return new URLSearchParams(values).toString();
}

function initSignal(signal?: AbortSignal): Pick<RequestInit, "signal"> | Record<string, never> {
  return signal ? { signal } : {};
}

function part(value: string): string {
  return encodeURIComponent(value);
}

async function readJson(response: Response): Promise<unknown> {
  try { return await response.json(); } catch { return null; }
}

function safeError(value: unknown): string {
  if (value && typeof value === "object" && typeof (value as { error?: unknown }).error === "string") {
    return (value as { error: string }).error.slice(0, 500);
  }
  return "La operación de la tarea no se pudo completar";
}

function pause(ms: number, signal: AbortSignal): Promise<void> {
  if (signal.aborted) return Promise.resolve();
  return new Promise((resolve) => {
    const timer = setTimeout(done, ms);
    signal.addEventListener("abort", done, { once: true });
    function done() {
      clearTimeout(timer);
      signal.removeEventListener("abort", done);
      resolve();
    }
  });
}
