// Corte C3 — el resolutor URN es config de DATOS (spec §5.3): un mapa
// urn:fxsl:kb:* -> { path relativo a KORA_RAIZ, version observada } que re-ancla
// los puentes docs/canon-opm/ a la SSOT VIVA en pneuma (no a la bestia congelada).
//
// Leyes operacionalizadas por este test:
//   L1 — todo URN del mapa resuelve a un path absoluto bajo KORA_RAIZ.
//   L2 — ese path EXISTE en disco (verificación real cuando la SSOT está montada).
//   L3 — el urn declarado en el frontmatter de la SSOT coincide con la clave del mapa.
//   L4 — si KORA_RAIZ no está y el default no existe, SKIP nombrado (ni falso verde ni falso rojo).
//   L5 — delta de versión (SSOT más nueva que el puente / que el mapa) se REPORTA, no rompe.
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import { koraRaiz, mapaUrn, resolverUrn } from "./resolutorUrn";

// Lee el campo `version:` plano del frontmatter YAML de una SSOT de pneuma.
function versionFrontmatter(absPath: string): string | null {
  const texto = readFileSync(absPath, "utf8");
  const m = texto.match(/^version:\s*"?([0-9]+\.[0-9]+\.[0-9]+)"?/m);
  return m?.[1] ?? null;
}

// Lee el campo `urn:` plano del frontmatter YAML de una SSOT de pneuma.
function urnFrontmatter(absPath: string): string | null {
  const texto = readFileSync(absPath, "utf8");
  const m = texto.match(/^urn:\s*"?(urn:[^"\s]+)"?/m);
  return m?.[1] ?? null;
}

const raiz = koraRaiz();
const ssotMontada = existsSync(raiz);

describe("resolutorUrn — config de datos, re-anclaje a pneuma", () => {
  test("el mapa tiene exactamente las 5 fuentes propietarias del tutor contextual", () => {
    expect(Object.keys(mapaUrn()).sort()).toEqual(
      [
        "urn:fxsl:kb:metodologia-forja-opm-es",
        "urn:fxsl:kb:opm-categorial-es",
        "urn:fxsl:kb:reglas-opm-estrictas-es",
        "urn:fxsl:kb:spec-forja-opd-es",
        "urn:fxsl:kb:spec-forja-opl-es",
      ].sort(),
    );
  });

  test("resolverUrn produce un path absoluto bajo KORA_RAIZ (L1)", () => {
    for (const urn of Object.keys(mapaUrn())) {
      const abs = resolverUrn(urn);
      expect(abs.startsWith("/")).toBe(true);
      expect(abs.startsWith(raiz)).toBe(true);
    }
  });

  test("resolverUrn rechaza un URN desconocido", () => {
    expect(() => resolverUrn("urn:fxsl:kb:no-existe")).toThrow();
  });

  for (const [urn, entrada] of Object.entries(mapaUrn())) {
    test(`${urn} — el path resuelto existe y el frontmatter coincide (L2/L3/L5)`, () => {
      if (!ssotMontada) {
        // L4 — ni falso verde ni falso rojo: declaramos por qué no se verificó.
        console.warn(
          `[resolutorUrn] SSOT no montada, resolución no verificada (KORA_RAIZ=${raiz})`,
        );
        return;
      }
      const abs = resolverUrn(urn);
      // L2 — el path resuelto EXISTE en disco.
      expect(existsSync(abs)).toBe(true);

      // L3 — el urn del frontmatter de la SSOT coincide con la clave del mapa.
      const urnReal = urnFrontmatter(abs);
      expect(urnReal).toBe(urn);

      // L5 — delta de versión: se REPORTA, no rompe. El mapa fija la versión
      // observada al corte; si la SSOT viva avanzó, lo dejamos en log.
      const versionReal = versionFrontmatter(abs);
      expect(versionReal).not.toBeNull();
      if (versionReal !== entrada.version) {
        console.warn(
          `[resolutorUrn] delta de versión en ${urn}: mapa=${entrada.version} SSOT=${versionReal} ` +
            "(la SSOT viva avanzó; actualizar resolutor-urn.json en un corte futuro)",
        );
      }
    });
  }
});
