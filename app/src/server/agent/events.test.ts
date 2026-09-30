import { expect, test } from "bun:test";
import type { TaskEvent } from "../../agent/contracts";
import { encodeTaskEvent, eventGap, parseEventCursor } from "./events";

function event(sequence: number): TaskEvent {
  return { id: `event-${sequence}`, taskId: "task", sequence, kind: "status", revision: null, resultId: null };
}

test("replay detects missing, reordered and duplicate events", () => {
  expect(eventGap([event(4), event(5)], 3)).toBe(false);
  expect(eventGap([event(5)], 3)).toBe(true);
  expect(eventGap([event(4), event(4)], 3)).toBe(true);
  expect(eventGap([event(5), event(4)], 3)).toBe(true);
});

test("wire cursor is an exact nonnegative safe integer", () => {
  expect(parseEventCursor(null)).toBe(0);
  expect(parseEventCursor("23")).toBe(23);
  for (const invalid of ["-1", "1.5", "NaN", "1x", "9007199254740992"]) {
    expect(() => parseEventCursor(invalid)).toThrow();
  }
  expect(encodeTaskEvent(event(4))).toStartWith("id: 4\nevent: task\ndata: ");
});
