import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { isTimestampAfter, isValidTimestamp } from "./timestampOrder";

const FORMAT = "opforja.mesa-base.v1";
const PREFIX = "mesa-v1.";
const SHA256 = /^[a-f0-9]{64}$/;
const BASE64URL = /^[A-Za-z0-9_-]+$/;

export type BaseSource = "saved" | "autosave";

export interface ObservedBaseState {
  modelId: string;
  saved: {
    revision: number;
    updatedAt: string;
    json: string;
  };
  autosave: {
    createdAt: string;
    json: string;
  } | null;
}

export interface MesaBaseWitnessV1 {
  format: typeof FORMAT;
  modelId: string;
  saved: {
    revision: number;
    updatedAt: string;
    sha256: string;
  };
  autosave: {
    createdAt: string;
    sha256: string;
  } | null;
  source: BaseSource;
}

export function createBaseWitness(state: ObservedBaseState): MesaBaseWitnessV1 {
  return {
    format: FORMAT,
    modelId: state.modelId,
    saved: {
      revision: state.saved.revision,
      updatedAt: state.saved.updatedAt,
      sha256: hashJson(state.saved.json),
    },
    autosave: state.autosave
      ? {
          createdAt: state.autosave.createdAt,
          sha256: hashJson(state.autosave.json),
        }
      : null,
    source: sourceFromState(state),
  };
}

export function encodeBaseWitness(witness: MesaBaseWitnessV1): string {
  return `${PREFIX}${Buffer.from(JSON.stringify(witness), "utf8").toString("base64url")}`;
}

export function decodeBaseWitness(encoded: string): MesaBaseWitnessV1 | null {
  if (!encoded.startsWith(PREFIX)) return null;
  const payload = encoded.slice(PREFIX.length);
  if (!BASE64URL.test(payload)) return null;
  try {
    const decoded = Buffer.from(payload, "base64url");
    if (decoded.toString("base64url") !== payload) return null;
    const parsed = JSON.parse(decoded.toString("utf8"));
    return normalizeBaseWitness(parsed);
  } catch {
    return null;
  }
}

export function normalizeBaseWitness(value: unknown): MesaBaseWitnessV1 | null {
  if (!isRecord(value) ||
    value.format !== FORMAT ||
    typeof value.modelId !== "string" ||
    !value.modelId.trim() ||
    !isRecord(value.saved) ||
    !isNonNegativeInteger(value.saved.revision) ||
    !isValidTimestamp(value.saved.updatedAt) ||
    typeof value.saved.sha256 !== "string" ||
    !SHA256.test(value.saved.sha256) ||
    (value.source !== "saved" && value.source !== "autosave")) {
    return null;
  }

  let autosave: MesaBaseWitnessV1["autosave"] = null;
  if (value.autosave !== null) {
    if (!isRecord(value.autosave) ||
      !isValidTimestamp(value.autosave.createdAt) ||
      typeof value.autosave.sha256 !== "string" ||
      !SHA256.test(value.autosave.sha256)) {
      return null;
    }
    autosave = {
      createdAt: value.autosave.createdAt,
      sha256: value.autosave.sha256,
    };
  }

  return {
    format: FORMAT,
    modelId: value.modelId,
    saved: {
      revision: value.saved.revision,
      updatedAt: value.saved.updatedAt,
      sha256: value.saved.sha256,
    },
    autosave,
    source: value.source,
  };
}

export function baseWitnessMatches(witness: MesaBaseWitnessV1, state: ObservedBaseState): boolean {
  const current = createBaseWitness(state);
  return witness.format === current.format &&
    witness.modelId === current.modelId &&
    witness.saved.revision === current.saved.revision &&
    witness.saved.updatedAt === current.saved.updatedAt &&
    witness.saved.sha256 === current.saved.sha256 &&
    witness.autosave?.createdAt === current.autosave?.createdAt &&
    witness.autosave?.sha256 === current.autosave?.sha256 &&
    witness.source === current.source;
}

export function sourceFromState(state: ObservedBaseState): BaseSource {
  return state.autosave &&
    isTimestampAfter(state.autosave.createdAt, state.saved.updatedAt)
    ? "autosave"
    : "saved";
}

export function selectedBaseJson(state: ObservedBaseState): string {
  return sourceFromState(state) === "autosave" ? state.autosave!.json : state.saved.json;
}

/** Produce la marca mínima que mantiene la ley autosave.createdAt > saved.updatedAt. */
export function autosaveTimestampAfter(savedUpdatedAt: string): string {
  const millis = Date.parse(savedUpdatedAt);
  if (!Number.isFinite(millis)) {
    throw new Error("Marca de actualización inválida para autosave");
  }
  return new Date(millis + 1).toISOString();
}

function hashJson(json: string): string {
  return createHash("sha256").update(json, "utf8").digest("hex");
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
