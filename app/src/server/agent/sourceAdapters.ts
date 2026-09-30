import type { TaskIntent } from "../../agent/contracts";
import { MAX_MARKDOWN_SOURCE_BYTES } from "../../agent/markdownSource";
import type { SourceExcerpt, TaskSource } from "./sourceAccess";
import { readTaskSource, sourceVersion } from "./sourceAccess";

export interface SourceReference {
  sourceId: string;
  locator?: string;
}

/** Persisted task authority and currently available document sources. */
export interface SourceUserAccess {
  intent: Pick<TaskIntent, "allowedSourceIds">;
  sources: readonly TaskSource[];
}

export interface SourceAdapter {
  readonly mediaType: TaskSource["mediaType"];
  read(reference: SourceReference, userAccess: SourceUserAccess): SourceExcerpt;
}

/**
 * Reads only a source explicitly attached to the document and allowed by the
 * persisted task intent. Markdown is local evidence: embedded links are never
 * followed, and its bytes must still be the original bounded UTF-8 payload.
 */
export const markdownSourceAdapter: SourceAdapter = {
  mediaType: "text/markdown",
  read(reference, userAccess) {
    if (!userAccess.intent.allowedSourceIds.includes(reference.sourceId)) {
      throw new Error("Fuente fuera del alcance autorizado");
    }
    const source = userAccess.sources.find((candidate) => candidate.id === reference.sourceId);
    if (!source || source.mediaType !== "text/markdown") throw new Error("Fuente Markdown no disponible");
    if (Buffer.byteLength(source.content, "utf8") > MAX_MARKDOWN_SOURCE_BYTES) {
      throw new Error("El archivo Markdown supera el límite de 128 kB");
    }
    if (source.version !== sourceVersion(source.content)) throw new Error("La versión de la fuente no coincide");
    return readTaskSource(userAccess.intent, [source], source.id, reference.locator ?? "paragraph:1");
  },
};

/** Small adapter dispatcher; unknown and non-Markdown formats remain unsupported. */
export function readAttachedSource(reference: SourceReference, userAccess: SourceUserAccess): SourceExcerpt {
  const source = userAccess.sources.find((candidate) => candidate.id === reference.sourceId);
  if (!source) throw new Error("Fuente no disponible");
  if (source.mediaType === "text/markdown") return markdownSourceAdapter.read(reference, userAccess);
  if (source.mediaType === "text/plain") {
    if (!userAccess.intent.allowedSourceIds.includes(reference.sourceId)) throw new Error("Fuente fuera del alcance autorizado");
    return readTaskSource(userAccess.intent, [source], source.id, reference.locator ?? "paragraph:1");
  }
  throw new Error("Formato de fuente no soportado");
}
