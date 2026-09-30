import { createHash } from "node:crypto";
import type { TaskIntent } from "../../agent/contracts";
import type { Modelo } from "../../modelo/tipos";

export interface TaskSource {
  id: string;
  title: string;
  version: string;
  content: string;
  mediaType: "text/plain" | "text/markdown";
}

export interface SourceExcerpt {
  sourceId: string;
  sourceVersion: string;
  locator: string;
  content: string;
  /** Sources are evidence; the runtime never promotes their text to instructions. */
  trust: "source-content";
}

export function sourceVersion(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

export function modelTaskSources(model: Modelo): TaskSource[] {
  return Object.values(model.mesaExploracion?.fuentes ?? {}).map((source) => ({
    id: source.id,
    title: source.titulo ?? "Fuente de texto",
    content: source.contenido,
    version: sourceVersion(source.contenido),
    mediaType: source.mediaType ?? "text/plain",
  }));
}

/** Select exact paragraphs; no summarization or fetching embedded URLs. */
export function readTaskSource(
  intent: Pick<TaskIntent, "allowedSourceIds">,
  sources: readonly TaskSource[],
  sourceId: string,
  locator = "paragraph:1",
): SourceExcerpt {
  if (!intent.allowedSourceIds.includes(sourceId)) throw new Error("Fuente fuera del alcance autorizado");
  const source = sources.find((candidate) => candidate.id === sourceId);
  if (!source) throw new Error("Fuente no disponible");
  if (source.version !== sourceVersion(source.content)) throw new Error("La versión de la fuente no coincide");
  const match = /^paragraph:([1-9]\d*)(?:-([1-9]\d*))?$/.exec(locator);
  if (!match) throw new Error("Localizador no válido; usa paragraph:N o paragraph:N-M");
  const from = Number(match[1]);
  const to = Number(match[2] ?? match[1]);
  const paragraphs = [...source.content.matchAll(/[^\r\n](?:[^\r\n]|\r?\n(?!\r?\n))*/g)];
  if (to < from || to - from > 20 || from > paragraphs.length || to > paragraphs.length) {
    throw new Error("El fragmento solicitado no existe o supera el límite");
  }
  const first = paragraphs[from - 1]!;
  const last = paragraphs[to - 1]!;
  const content = source.content.slice(first.index!, last.index! + last[0].length);
  if (Buffer.byteLength(content, "utf8") > 24_000) throw new Error("Fragmento demasiado grande; acota el localizador");
  return { sourceId, sourceVersion: source.version, locator, content, trust: "source-content" };
}
