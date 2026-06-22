// Corte C3 — resolutor URN como config de DATOS (spec §5.3).
// Resuelve urn:fxsl:kb:* -> path absoluto a la SSOT VIVA en pneuma, leyendo el
// mapa de datos puros docs/canon-opm/resolutor-urn.json. Función pura de datos:
// NO ejecuta kora.py ni ningún subprocess; solo lee el JSON y compone la ruta.
// KORA_RAIZ (env) re-ancla la raíz; el default apunta a pneuma, no a la bestia.
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

// El JSON vive en docs/canon-opm/, fuera de app/src/: lo resolvemos relativo a
// este módulo (independiente del cwd) siguiendo el patrón import.meta.dir del repo.
const RUTA_JSON = resolve(import.meta.dir, "../../../docs/canon-opm/resolutor-urn.json");

interface EntradaUrn {
  path: string;
  version: string;
}
interface ConfigResolutor {
  kora_raiz_default: string;
  urn: Record<string, EntradaUrn>;
}

const config: ConfigResolutor = JSON.parse(readFileSync(RUTA_JSON, "utf8"));

/** Raíz efectiva del corpus: env KORA_RAIZ o el default de pneuma del JSON. */
export function koraRaiz(): string {
  return process.env.KORA_RAIZ ?? config.kora_raiz_default;
}

/** Mapa urn -> { path relativo, version observada }. Copia inmutable para inspección. */
export function mapaUrn(): Record<string, EntradaUrn> {
  return { ...config.urn };
}

/** Resuelve un URN a path absoluto bajo KORA_RAIZ. Lanza si el URN no está mapeado. */
export function resolverUrn(urn: string): string {
  const entrada = config.urn[urn];
  if (!entrada) throw new Error(`URN no mapeado en resolutor-urn.json: ${urn}`);
  return join(koraRaiz(), entrada.path);
}
