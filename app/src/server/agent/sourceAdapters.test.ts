import { describe, expect, test } from "bun:test";
import { decodeMarkdownSource, MAX_MARKDOWN_SOURCE_BYTES } from "../../agent/markdownSource";
import type { TaskIntent } from "../../agent/contracts";
import { sourceVersion, type TaskSource } from "./sourceAccess";
import { readAttachedSource, markdownSourceAdapter } from "./sourceAdapters";

function intent(allowedSourceIds: string[]): Pick<TaskIntent, "allowedSourceIds"> {
  return { allowedSourceIds };
}

function source(content: string, id = "md-1"): TaskSource {
  return { id, title: "pedido.md", content, version: sourceVersion(content), mediaType: "text/markdown" };
}

describe("adaptador de fuentes Markdown", () => {
  test("conserva bytes UTF-8 exactos, BOM, saltos CRLF y acentos", () => {
    const bytes = new TextEncoder().encode("\uFEFF# Solicitud\r\n\r\nRetiro y distribución: camión.");

    const decoded = decodeMarkdownSource("pedido.MD", bytes);

    expect(decoded).toEqual({
      title: "pedido.MD",
      content: "\uFEFF# Solicitud\r\n\r\nRetiro y distribución: camión.",
      mediaType: "text/markdown",
    });
    expect(new TextEncoder().encode(decoded.content)).toEqual(bytes);
  });

  test("rechaza encoding inválido, extensión ajena y archivos sobre el máximo", () => {
    expect(() => decodeMarkdownSource("pedido.md", new Uint8Array([0x23, 0x20, 0xc3, 0x28])))
      .toThrow("UTF-8 válido");
    expect(() => decodeMarkdownSource("pedido.html", new TextEncoder().encode("contenido")))
      .toThrow("Markdown (.md)");
    expect(() => decodeMarkdownSource("pedido.md", new Uint8Array(MAX_MARKDOWN_SOURCE_BYTES + 1)))
      .toThrow("128 kB");
  });

  test("requiere ID permitido y una fuente adjunta presente, sin expandir acceso", () => {
    const attached = source("# Pedido\n\nRetirar antes del viernes.");

    expect(() => readAttachedSource({ sourceId: attached.id }, { intent: intent([]), sources: [attached] }))
      .toThrow("fuera del alcance");
    expect(() => readAttachedSource({ sourceId: attached.id }, { intent: intent([attached.id]), sources: [] }))
      .toThrow("no disponible");
    expect(markdownSourceAdapter.read({ sourceId: attached.id }, { intent: intent([attached.id]), sources: [attached] }).content)
      .toBe("# Pedido");
  });

  test("devuelve sólo el párrafo solicitado y no sigue enlaces Markdown", () => {
    const attached = source("Primero.\n\n[Abre](https://example.invalid/secret)\n\nTercero.");

    const excerpt = readAttachedSource(
      { sourceId: attached.id, locator: "paragraph:2" },
      { intent: intent([attached.id]), sources: [attached] },
    );

    expect(excerpt.content).toBe("[Abre](https://example.invalid/secret)");
    expect(excerpt).toMatchObject({ sourceId: "md-1", sourceVersion: attached.version, locator: "paragraph:2", trust: "source-content" });
  });

  test("las versiones cambian con los bytes y la fuente retirada no se puede leer", () => {
    const original = source("A\r\n\r\nB");
    const updated = source("A\n\nB");
    expect(updated.version).not.toBe(original.version);
    expect(() => readAttachedSource({ sourceId: original.id }, { intent: intent([original.id]), sources: [] }))
      .toThrow("no disponible");
  });
});
