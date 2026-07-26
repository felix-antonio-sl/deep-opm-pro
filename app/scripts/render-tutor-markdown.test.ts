import { describe, expect, test } from "bun:test";
import { renderTutorMarkdownPage } from "./render-tutor-markdown";

describe("renderTutorMarkdownPage", () => {
  test("presenta Markdown semántico y conserva el ancla declarada", () => {
    const html = renderTutorMarkdownPage(
      "Reglas OPM estrictas",
      "urn:fxsl:kb:reglas-opm-estrictas-es",
      [
        "---",
        "version: 1.0.0",
        "---",
        "",
        "# Reglas OPM estrictas",
        "",
        "### Ontología y entidades",
        "",
        "- **R-INS-1**: toda `cosa` tiene significado.",
        "- Segundo punto.",
        "",
        "| Regla | Estado |",
        "| --- | --- |",
        "| R-INS-1 | vigente |",
      ].join("\n"),
      [{ id: "ontology-entities", heading: "Ontología y entidades" }],
    );

    expect(html).toContain('<main id="source-content" class="reader"');
    expect(html).toContain("<summary>Metadatos de la fuente</summary>");
    expect(html).toContain("version: 1.0.0");
    expect(html).toContain('<h3 id="ontology-entities">Ontología y entidades</h3>');
    expect(html).toContain("<strong>R-INS-1</strong>");
    expect(html).toContain("<code>cosa</code>");
    expect(html).toContain("<ul><li>");
    expect(html).toContain('<div class="table-scroll"');
    expect(html).not.toContain("### Ontología");
    expect(html).not.toContain("**R-INS-1**");
    expect(html).not.toContain("<hr><h2");
    expect(html).not.toContain('<pre class="source">');
  });

  test("escapa HTML y descarta destinos ejecutables", () => {
    const html = renderTutorMarkdownPage(
      'Título <hostil>',
      'urn:test:"locator"',
      [
        "<script>alert('x')</script>",
        "",
        "[seguro](https://example.com)",
        "",
        "[hostil](javascript:alert(1))",
        "",
        "![hostil](data:image/svg+xml,x)",
      ].join("\n"),
      [],
    );

    expect(html).toContain("Título &lt;hostil&gt;");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('rel="noreferrer noopener"');
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("data:image");
  });
});
