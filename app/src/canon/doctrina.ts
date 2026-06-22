// Corte C2 — IO de la doctrina del cordón (decisión D-DOCTRINA, spec §5.2).
// Lee el CONTENIDO de las 4 SSOT forja desde pneuma (vía el resolutor URN del
// corte C3) para que el consumidor (script de emisión) arme `doctrinaVersion`
// con `autoria/procedencia.hashDoctrina`. Aquí vive la IO; `procedencia.ts`
// permanece puro (solo hashea contenido ya leído).
import { readFileSync } from "node:fs";
import { resolverUrn } from "./resolutorUrn";

/**
 * Orden CANÓNICO de las 4 SSOT forja para el hash de doctrina. Es load-bearing:
 * `hashDoctrina` concatena los textos en este orden, así que reordenar cambia el
 * hash. Coincide con la cadena de precedencia visual (reglas > spec-opd >
 * spec-opl > metodología).
 */
export const URN_DOCTRINA_ORDEN_CANONICO = [
  "urn:fxsl:kb:reglas-opm-estrictas-es",
  "urn:fxsl:kb:spec-forja-opd-es",
  "urn:fxsl:kb:spec-forja-opl-es",
  "urn:fxsl:kb:metodologia-forja-opm-es",
] as const;

/**
 * Lee el contenido de las 4 SSOT forja en orden canónico, listo para
 * `hashDoctrina`. Lanza un error claro si KORA_RAIZ no está montada o un path no
 * existe — el consumidor decide si omitir `doctrinaVersion` (rollback-free) al
 * capturar este error.
 */
export function leerDoctrinaParaSello(): string[] {
  return URN_DOCTRINA_ORDEN_CANONICO.map((urn) => {
    const abs = resolverUrn(urn);
    try {
      return readFileSync(abs, "utf8");
    } catch (causa) {
      throw new Error(
        `No se pudo leer la SSOT forja ${urn} en ${abs} para el sello de doctrina ` +
          "(¿KORA_RAIZ montada? el consumidor puede omitir doctrinaVersion): " +
          (causa instanceof Error ? causa.message : String(causa)),
      );
    }
  });
}
