// Corte C1 — version-match skill↔app (cordón umbilical, spec §5 + roadmap Tramo C).
// El transmutador `_emision/claude-code` de pneuma deja el frontmatter del runtime
// mínimo (name/description/allowed-tools) y baja toda la metadata de gobernanza al
// bloque proof-carrying `<!-- kora:sello … -->` del CUERPO. El consumidor (opforja)
// detecta «deploy stale» leyendo la versión AUTÉNTICA de ahí, no del frontmatter.
//
// Este módulo es PURO (string -> datos): la IO de localizar el deploy de la skill
// vive en scripts/cordon-skill-audit.ts.

/** Campos de gobernanza extraídos del bloque `kora:sello` de una skill emitida. */
export interface SelloKora {
  fuente: string;
  version: string;
  hashFuente: string;
  target: string;
}

const RE_BLOQUE_SELLO = /<!--\s*kora:sello\s*([\s\S]*?)-->/;

function leerCampo(cuerpo: string, clave: string): string | null {
  const m = cuerpo.match(new RegExp(`^${clave}:\\s*(.+)$`, "m"));
  const valor = m?.[1];
  return valor === undefined ? null : valor.trim();
}

/**
 * Parsea el bloque `<!-- kora:sello … -->` del contenido de una skill desplegada.
 * Devuelve null si no hay sello o si le falta alguno de los campos requeridos
 * (version/hash-fuente/target/fuente) — el consumidor trata el null como SKIP
 * nombrado, no como falso verde.
 */
export function parsearSelloKora(contenido: string): SelloKora | null {
  const bloque = contenido.match(RE_BLOQUE_SELLO);
  const cuerpo = bloque?.[1];
  if (cuerpo === undefined) return null;
  const fuente = leerCampo(cuerpo, "fuente");
  const version = leerCampo(cuerpo, "version");
  const hashFuente = leerCampo(cuerpo, "hash-fuente");
  const target = leerCampo(cuerpo, "target");
  if (!fuente || !version || !hashFuente || !target) return null;
  return { fuente, version, hashFuente, target };
}

/** Estado del cordón: ok / advertencia (no rompe) / fallo (rompe) / skip (no comparable). */
export type EstadoCordon = "ok" | "advertencia" | "fallo" | "skip";

export interface VeredictoCordon {
  estado: EstadoCordon;
  motivo: string;
}

/** Valores pineados en el repo que el deploy de la skill DEBE testimoniar. */
export interface EsperadoCordon {
  version: string;
  hashFuente: string;
  target: string;
  /** Firma de los archivos de una emisión nativa revisada, sin sello embebido. */
  nativeHash?: string;
}

/**
 * Evalúa el sello del deploy contra lo pineado en el repo. Matriz de dureza:
 *  - sello null            → SKIP nombrado (no se puede comparar; ni falso verde ni rojo).
 *  - target ajeno          → FALLO duro (estás leyendo una emisión de otro runtime).
 *  - version != esperada   → FALLO duro «deploy stale» (desfase semántico declarado).
 *  - version ok, hash !=    → ADVERTENCIA «hash drift» (contenido cambió sin bump; R-CONF-7:
 *                             se reporta, no se silencia ni rompe el gate).
 *  - todo coincide         → OK.
 */
export function evaluarCordonSkill(
  sello: SelloKora | null,
  esperado: EsperadoCordon,
): VeredictoCordon {
  if (!sello) {
    return { estado: "skip", motivo: "sin bloque kora:sello en el deploy: versión no comparable" };
  }
  if (sello.target !== esperado.target) {
    return {
      estado: "fallo",
      motivo: `target ajeno: deploy target=${sello.target} != esperado ${esperado.target}`,
    };
  }
  if (sello.version !== esperado.version) {
    return {
      estado: "fallo",
      motivo: `deploy stale: skill v${sello.version} != esperada v${esperado.version}`,
    };
  }
  if (sello.hashFuente !== esperado.hashFuente) {
    return {
      estado: "advertencia",
      motivo:
        `hash drift sin bump de versión (v${sello.version}): ` +
        `hash-fuente ${sello.hashFuente} != esperado ${esperado.hashFuente}`,
    };
  }
  return { estado: "ok", motivo: `skill v${sello.version} coincide con el repo` };
}

/** Emisiones compatibles revisadas por runtime; no presuponen despliegue simultáneo. */
export const CORDON_SKILL_NOMBRE = "modelamiento-opm";
export type TargetCordonSkill = "claude-code" | "codex";

// Claude conserva la emisión 2.1.0 del ciclo reversible (fuente e43ebf7).
// Codex 3.1.0 incorpora revelación progresiva: su fibra operacion-profunda
// conserva Apunte⇄Modelo, Boceto⇄OPD, bundle v0, Testigo-Base y no-clobber.
// Ambos consumen el mismo canon OPM/Forja pineado en resolutorUrn.
// Los hashes corresponden al archivo fuente de KORA, no a una etiqueta inferida.
export const CORDON_SKILL_ESPERADOS: Record<TargetCordonSkill, EsperadoCordon> = {
  "claude-code": {
    version: "2.1.0",
    hashFuente: "sha256:8cf8dd16dd843c967d585edfd3508425d835686508d89836978e31ad03639483",
    target: "claude-code",
  },
  codex: {
    version: "3.1.0",
    hashFuente: "sha256:cfa80c33aed313d04af3ca8c400f40e5266b97d4aa60e55ab09e6dffac093ef2",
    target: "codex",
    // Render canónico KORA contrastado byte a byte con sus 11 archivos instalados.
    nativeHash: "sha256:0315794b4a10fb0ee70cd5e34310a9b88580063d482459125cf94ef1ee5174a3",
  },
};
