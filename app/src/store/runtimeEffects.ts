export interface RuntimeEffects {
  now(): Date;
  confirm(message: string): boolean;
  readLocalStorage(key: string): string | null;
  writeLocalStorage(key: string, value: string): void;
  randomUUID(): string | null;
  random(): number;
}

function localStorageSeguro(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
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
  readLocalStorage: (key) => {
    try {
      return localStorageSeguro()?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  writeLocalStorage: (key, value) => {
    try {
      localStorageSeguro()?.setItem(key, value);
    } catch {
      // storage no disponible
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
