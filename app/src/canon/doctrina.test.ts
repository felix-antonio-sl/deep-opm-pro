// Corte C2 — IO de la doctrina del cordón (decisión D-DOCTRINA, spec §5.2).
// La lectura de las 4 SSOT forja vive en `canon/doctrina.ts` (NO en el kernel
// puro `autoria/procedencia.ts`). Aquí se verifica que, con pneuma montada,
// produce 4 textos no vacíos y un hash de doctrina estable.
//
// SKIP nombrado (mismo patrón que resolutorUrn.test): si KORA_RAIZ no está
// montada, no se verifica IO real — ni falso verde ni falso rojo.
import { existsSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import { koraRaiz } from "./resolutorUrn";
import { URN_DOCTRINA_ORDEN_CANONICO, leerDoctrinaParaSello } from "./doctrina";
import { hashDoctrina } from "../autoria/procedencia";

const raiz = koraRaiz();
const ssotMontada = existsSync(raiz);

describe("doctrina — IO de las 4 SSOT forja para el sello (corte C2)", () => {
  test("el orden canónico fija las 4 SSOT forja (reglas, spec-opd, spec-opl, metodología)", () => {
    expect(URN_DOCTRINA_ORDEN_CANONICO).toEqual([
      "urn:fxsl:kb:reglas-opm-estrictas-es",
      "urn:fxsl:kb:spec-forja-opd-es",
      "urn:fxsl:kb:spec-forja-opl-es",
      "urn:fxsl:kb:metodologia-forja-opm-es",
    ]);
  });

  test("leerDoctrinaParaSello() devuelve 4 textos no vacíos y hashDoctrina es estable (pneuma montada)", () => {
    if (!ssotMontada) {
      console.warn(
        `[doctrina] SSOT no montada, lectura no verificada (KORA_RAIZ=${raiz})`,
      );
      return;
    }
    const textos = leerDoctrinaParaSello();
    expect(textos.length).toBe(4);
    for (const t of textos) {
      expect(typeof t).toBe("string");
      expect(t.trim().length).toBeGreaterThan(0);
    }
    // Determinista: dos lecturas seguidas producen el mismo hash de doctrina.
    expect(hashDoctrina(textos)).toBe(hashDoctrina(leerDoctrinaParaSello()));
  });
});
