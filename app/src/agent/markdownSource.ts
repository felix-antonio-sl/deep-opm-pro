import { MAX_MARKDOWN_SOURCE_BYTES } from "../modelo/tipos/extensiones";

export { MAX_MARKDOWN_SOURCE_BYTES };

export interface DecodedMarkdownSource {
  title: string;
  content: string;
  mediaType: "text/markdown";
}

/**
 * Decode an explicitly selected Markdown file without normalizing its UTF-8
 * bytes. Invalid UTF-8 and encodings that cannot round-trip are rejected.
 */
export function decodeMarkdownSource(fileName: string, bytes: Uint8Array): DecodedMarkdownSource {
  if (!/\.md$/i.test(fileName)) throw new Error("Selecciona un archivo Markdown (.md)");
  if (bytes.byteLength > MAX_MARKDOWN_SOURCE_BYTES) throw new Error("El archivo Markdown supera el límite de 128 kB");
  if (bytes.byteLength === 0) throw new Error("El archivo Markdown está vacío");

  let content: string;
  try {
    // ignoreBOM preserves U+FEFF so re-encoding reproduces the selected bytes.
    content = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes);
  } catch {
    throw new Error("El archivo debe usar UTF-8 válido; el original no fue modificado");
  }
  const encoded = new TextEncoder().encode(content);
  if (!sameBytes(bytes, encoded)) throw new Error("No se pudieron conservar exactamente los bytes originales");
  if (!content.trim()) throw new Error("El archivo Markdown está vacío");

  const title = fileName.split(/[\\/]/).at(-1)?.slice(0, 200) ?? "Fuente Markdown";
  return { title, content, mediaType: "text/markdown" };
}

function sameBytes(left: Uint8Array, right: Uint8Array): boolean {
  if (left.byteLength !== right.byteLength) return false;
  for (let index = 0; index < left.byteLength; index++) {
    if (left[index] !== right[index]) return false;
  }
  return true;
}
