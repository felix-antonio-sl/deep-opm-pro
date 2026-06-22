import { describe, expect, test } from "bun:test";
import {
  artefactosDeVersion,
  extraerVersionDeclarada,
  versionMajorMinor,
} from "./design-governance-audit.mjs";

describe("versión única del sistema de diseño Codex", () => {
  test("normaliza a major.minor sin importar semver o prefijo", () => {
    expect(versionMajorMinor("1.2")).toBe("1.2");
    expect(versionMajorMinor("1.2.0")).toBe("1.2");
    expect(versionMajorMinor("v1.2")).toBe("1.2");
    expect(versionMajorMinor("Versión 1.2")).toBe("1.2");
  });

  test("extrae la versión declarada por formato (frontmatter, semver, css)", () => {
    expect(extraerVersionDeclarada("**Versión:** 1.2\n**Fecha:** hoy", "frontmatter")).toBe("1.2");
    expect(extraerVersionDeclarada('{ "version": "1.2.0" }', "json")).toBe("1.2.0");
    expect(extraerVersionDeclarada("   Versión 1.2 — autoridad normativa", "css")).toBe("1.2");
  });

  test("GOVERNANCE es la SSOT de versión y todos los artefactos la igualan", () => {
    const artefactos = artefactosDeVersion();
    const ssot = artefactos.find((a) => a.esSsot);
    expect(ssot).toBeDefined();
    expect(ssot.path).toBe("ui-forja/GOVERNANCE.md");

    const esperada = versionMajorMinor(ssot.version);
    expect(esperada).toBe("1.2");

    // Falsable: si cualquier artefacto declarado diverge, este aserto lo nombra.
    const divergentes = artefactos
      .filter((a) => !a.esSsot && versionMajorMinor(a.version) !== esperada)
      .map((a) => a.path);
    expect(divergentes).toEqual([]);
  });
});
