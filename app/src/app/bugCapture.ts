export const BUG_CAPTURE_SHORTCUT = "Ctrl+Shift+B" as const;
export const BUG_CAPTURE_OPEN_EVENT = "opforja:bug-capture:open" as const;
export const BUG_LEDGER_OPEN_EVENT = "opforja:bug-ledger:open" as const;

export type BugCaptureEvent = typeof BUG_CAPTURE_OPEN_EVENT | typeof BUG_LEDGER_OPEN_EVENT;

export function bugCaptureHabilitado(): boolean {
  const env = (import.meta as ImportMeta & {
    env?: { DEV?: boolean; VITE_ENABLE_BUG_CAPTURE?: string };
  }).env;
  return env?.DEV === true || env?.VITE_ENABLE_BUG_CAPTURE === "true";
}

export function emitirEventoBugCapture(nombre: BugCaptureEvent): void {
  globalThis.dispatchEvent?.(new CustomEvent(nombre));
}
