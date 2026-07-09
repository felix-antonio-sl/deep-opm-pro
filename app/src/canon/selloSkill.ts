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

/**
 * Skill del cordón que opforja consume como mesa de trabajo, y los valores que su
 * deploy DEBE testimoniar. PINEADO: al bumpear la skill (p. ej. D3 → v1.10.0) hay
 * que actualizar aquí — ese es el punto del gate, forzar la actualización consciente.
 * Único lugar de verdad (greppable: `CORDON_SKILL_ESPERADO`).
 */
export const CORDON_SKILL_NOMBRE = "modelamiento-opm";

// v1.13.0 (auditoria integral skill↔mesa↔SSOT, 2026-07-09): la skill aprende el puente
// directo mesa↔skill — §Puente directo (CLI `mesa modelos|pull|push`, token Bearer,
// pull = contexto W6.0 por ley de determinismo, push con veredicto de disciplina:
// import duro / biblioteca solo-lectura / carril por procedencia / base ratificada /
// clausura sin-delta / 409 re-pull) + Regla Dura #29 (no-clobber) + capacidades
// (todo-nace-apunte, Taller en UI, gestor «Modelos» dos zonas, vitrina de revision)
// + handoff con push directo primario. W6.0 copy/paste queda como fallback. El
// `hash-fuente` testifica el ARTEFACTO FUENTE en pneuma (sha256 de
// `artefactos/skills/kora/modelamiento-opm/SKILL.md`), re-emitido con
// `kora.py transmutar` a claude-code/codex/opencode (3 sellos identicos, paridad fiel).
export const CORDON_SKILL_ESPERADO: EsperadoCordon = {
  version: "1.13.0",
  hashFuente: "sha256:78b34228619eb13be9feea08637d0d57abc4760d45b50a65ab608b135aca7637",
  target: "claude-code",
};
