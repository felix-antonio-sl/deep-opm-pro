import type {
  MesaBaseWitnessV1,
  ObservedBaseState,
} from "../mesa/baseWitness";
import { isTimestampAfter } from "../mesa/timestampOrder";

const FORMAT = "opforja.mesa-base.v1";

/** Equivalente browser-safe de `createBaseWitness` (Web Crypto, sin Node). */
export async function crearTestigoBaseBrowser(
  state: ObservedBaseState,
): Promise<MesaBaseWitnessV1> {
  const autosave = state.autosave
    ? {
        createdAt: state.autosave.createdAt,
        sha256: await sha256(state.autosave.json),
      }
    : null;
  return {
    format: FORMAT,
    modelId: state.modelId,
    saved: {
      revision: state.saved.revision,
      updatedAt: state.saved.updatedAt,
      sha256: await sha256(state.saved.json),
    },
    autosave,
    source: autosave &&
      isTimestampAfter(autosave.createdAt, state.saved.updatedAt)
      ? "autosave"
      : "saved",
  };
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
