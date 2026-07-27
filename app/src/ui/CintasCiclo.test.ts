import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

describe("cintas del ciclo reversible · contraste", () => {
  test("Apunte y Modelo reservan inkFaint para glifos, no para texto", () => {
    for (const file of ["CintaApunte.tsx", "CintaModelo.tsx"]) {
      const source = readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
      expect(source).toMatch(/texto:\s*\{[\s\S]*?color:\s*C\.inkSoft/);
    }
  });
});
