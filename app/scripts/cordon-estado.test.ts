import { describe, expect, test } from "bun:test";
import { clasificarDerivaFuente, extraerBuildProduccion, versionFrontmatter } from "./cordon-estado";

describe("cordon:estado", () => {
  test("lee semver del frontmatter vivo", () => {
    expect(versionFrontmatter("---\nversion: \"1.6.0\"\n---")).toBe("1.6.0");
    expect(versionFrontmatter("# sin versión")).toBeNull();
  });

  test("extrae el build desde el testigo visible minificado", () => {
    const bundle = 'const a="2026-07-18",b="92dbbaa7",c=a;title:`build ${b}`';
    expect(extraerBuildProduccion(bundle)).toBe("92dbbaa7");
  });

  test("no inventa una revisión si el bundle no porta el testigo", () => {
    expect(extraerBuildProduccion('const hash="deadbeef";')).toBeNull();
  });

  test("distingue un commit documental posterior de una deriva desplegable", () => {
    expect(clasificarDerivaFuente({
      head: "bbbbbbbb",
      build: "aaaaaaaa",
      cambiaProducto: false,
    })).toContain("solo difiere en artefactos no desplegables");
    expect(clasificarDerivaFuente({
      head: "bbbbbbbb",
      build: "aaaaaaaa",
      cambiaProducto: true,
    })).toContain("hay cambios desplegables");
  });
});
