import type { CrearSlice } from "./sliceTypes";

export const ATAJOS_SLICE_KEYS = ["frecuenciaUsoCommandPalette", "registrarUsoCommandPalette"] as const;

export interface AtajosSlice {
  frecuenciaUsoCommandPalette: Record<string, number>;
  registrarUsoCommandPalette: (itemId: string) => void;
}

export const createAtajosSlice: CrearSlice<AtajosSlice> = (set, get) => ({
  frecuenciaUsoCommandPalette: {},

  registrarUsoCommandPalette(itemId) {
    const siguiente = incrementarFrecuenciaUsoCommandPalette(get().frecuenciaUsoCommandPalette, itemId);
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
