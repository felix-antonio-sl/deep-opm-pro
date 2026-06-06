export interface RuntimeEffects {
  now(): Date;
  confirm(message: string): boolean;
  randomUUID(): string | null;
  random(): number;
}

export const RUNTIME_EFFECTS_DEFAULT: RuntimeEffects = {
  now: () => new Date(),
  confirm: (message) => {
    try {
      if (typeof globalThis.confirm !== "function") return true;
      return globalThis.confirm(message);
    } catch {
      return true;
    }
  },
  randomUUID: () => {
    try {
      if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
    } catch {
      // crypto no disponible
    }
    return null;
  },
  random: () => Math.random(),
};
