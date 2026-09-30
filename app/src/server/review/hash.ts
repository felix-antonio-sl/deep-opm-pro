import { createHash } from "node:crypto";
import { exportarModelo, hidratarModelo } from "../../serializacion/json";

export function hashReviewToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

/** Matches the browser's UTF-8 hash of exportarModelo(model, carpetaId). */
export function canonicalWorkingCopyHash(json: string): string | null {
  const hydrated = hidratarModelo(json);
  if (!hydrated.ok) return null;
  let folderId: string | null | undefined;
  try {
    const parsed: unknown = JSON.parse(json);
    if (isRecord(parsed) && Object.hasOwn(parsed, "carpetaId") &&
        (parsed.carpetaId === null || typeof parsed.carpetaId === "string")) {
      folderId = parsed.carpetaId;
    }
  } catch { return null; }
  const normalized = exportarModelo(hydrated.value, folderId);
  return createHash("sha256").update(normalized, "utf8").digest("hex");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
