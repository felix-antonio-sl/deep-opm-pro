import type { TaskEvent } from "../../agent/contracts";
import { isTerminalTask } from "../../agent/taskState";
import type { PersistenciaSesion } from "../modelPersistence";
import type { AgentRepository } from "./repository";

export function parseEventCursor(value: string | null): number {
  if (value === null || value === "") return 0;
  if (!/^\d+$/.test(value)) throw new Error("Cursor de eventos inválido");
  const cursor = Number(value);
  if (!Number.isSafeInteger(cursor)) throw new Error("Cursor de eventos inválido");
  return cursor;
}

export function encodeTaskEvent(event: TaskEvent): string {
  return `id: ${event.sequence}\nevent: task\ndata: ${JSON.stringify(event)}\n\n`;
}

export function eventGap(events: readonly TaskEvent[], after: number): boolean {
  let sequence = after;
  for (const event of events) {
    if (event.sequence !== sequence + 1) return true;
    sequence = event.sequence;
  }
  return false;
}

/** A bounded SSE connection rechecks access; reconnecting carries the last cursor. */
export function taskEventsResponse(
  repository: AgentRepository,
  session: PersistenciaSesion,
  documentId: string,
  taskId: string,
  after: number,
  signal?: AbortSignal,
): Response {
  const encoder = new TextEncoder();
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (value: string) => {
        if (!cancelled && !signal?.aborted) controller.enqueue(encoder.encode(value));
      };
      let cursor = after;
      const deadline = Date.now() + 25_000;
      try {
        send(": connected\nretry: 1000\n\n");
        // An impossible future cursor requires reconciliation as well as a hole.
        const history = await repository.listEvents(session, documentId, taskId, 0);
        if (after > (history.at(-1)?.sequence ?? 0)) {
          send('event: snapshot-required\ndata: {"reason":"cursor-ahead"}\n\n');
          return;
        }
        do {
          const task = await repository.getTask(session, documentId, taskId);
          if (!task || task.actorId !== session.userId || task.tenantId !== session.tenantId) return;
          const events = await repository.listEvents(session, documentId, taskId, cursor);
          if (eventGap(events, cursor)) {
            send('event: snapshot-required\ndata: {"reason":"event-gap"}\n\n');
            return;
          }
          for (const event of events) { send(encodeTaskEvent(event)); cursor = event.sequence; }
          if (isTerminalTask(task.status) || cancelled || signal?.aborted) return;
          await new Promise<void>((resolve) => setTimeout(resolve, 500));
        } while (Date.now() < deadline && !cancelled && !signal?.aborted);
      } catch {
        send('event: snapshot-required\ndata: {"reason":"connection-error"}\n\n');
      } finally {
        if (!cancelled) { try { controller.close(); } catch { /* Reader already cancelled. */ } }
      }
    },
    cancel() { cancelled = true; },
  });
  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
    },
  });
}
