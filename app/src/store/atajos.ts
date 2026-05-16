import type { CrearSlice } from "./sliceTypes";

export const COMMAND_PALETTE_FRECUENCIA_KEY = "deep-opm-pro.command-palette.frecuenciaUso.v1";

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

interface AtajosSliceState {
  frecuenciaUsoCommandPalette: Record<string, number>;
  registrarUsoCommandPalette: (itemId: string) => void;
}

export const createAtajosSlice: CrearSlice<AtajosSliceState> = (set, get) => ({
  frecuenciaUsoCommandPalette: leerFrecuenciaUsoCommandPalette(),

  registrarUsoCommandPalette(itemId) {
    const siguiente = incrementarFrecuenciaUsoCommandPalette(get().frecuenciaUsoCommandPalette, itemId);
    escribirFrecuenciaUsoCommandPalette(siguiente);
    set({ frecuenciaUsoCommandPalette: siguiente });
  },
});

export function incrementarFrecuenciaUsoCommandPalette(
  actual: Readonly<Record<string, number>>,
  itemId: string,
): Record<string, number> {
  const limpio = itemId.trim();
  if (!limpio) return { ...actual };
  const previo = actual[limpio];
  const valorActual = typeof previo === "number" && Number.isFinite(previo) && previo > 0 ? previo : 0;
  return { ...actual, [limpio]: valorActual + 1 };
}

export function leerFrecuenciaUsoCommandPalette(storage = storageLocal()): Record<string, number> {
  if (!storage) return {};
  try {
    const raw = storage.getItem(COMMAND_PALETTE_FRECUENCIA_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const limpio: Record<string, number> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!key || typeof value !== "number" || !Number.isFinite(value) || value <= 0) continue;
      limpio[key] = Math.floor(value);
    }
    return limpio;
  } catch {
    return {};
  }
}

export function escribirFrecuenciaUsoCommandPalette(
  frecuencia: Readonly<Record<string, number>>,
  storage = storageLocal(),
): void {
  if (!storage) return;
  try {
    storage.setItem(COMMAND_PALETTE_FRECUENCIA_KEY, JSON.stringify(frecuencia));
  } catch {
    // localStorage puede fallar por cuota o privacidad; la paleta sigue funcionando en memoria.
  }
}

function storageLocal(): StorageLike | null {
  return typeof globalThis.localStorage === "undefined" ? null : globalThis.localStorage;
}
