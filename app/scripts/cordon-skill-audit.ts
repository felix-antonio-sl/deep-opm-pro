// Corte C1 — gate del cordón: version-match skill↔app (roadmap Tramo C, 7ª conjunción
// de gate:refactor). Lee la versión AUTÉNTICA de la skill desplegada (la que opforja
// consume como mesa de trabajo) desde el bloque proof-carrying `kora:sello` del cuerpo
// y la compara con lo pineado en el repo (CORDON_SKILL_ESPERADO). NO toca pneuma ni el
// transmutador. Matriz de dureza en src/canon/selloSkill.ts.
//
// Salida greppable: `[CORDON] FALLO: deploy stale: skill vX != esperada vY`.
// Exit 1 solo en FALLO duro; ADVERTENCIA/SKIP/OK no rompen el gate (R-CONF-7: la
// divergencia se reporta, no se silencia; la indeterminación se nombra, no se finge).
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import {
  CORDON_SKILL_ESPERADO,
  CORDON_SKILL_NOMBRE,
  evaluarCordonSkill,
  parsearSelloKora,
  type EsperadoCordon,
  type VeredictoCordon,
} from "../src/canon/selloSkill";

/** Ruta del deploy de la skill. `CORDON_SKILL_DEPLOY_RAIZ` (env) re-ancla la raíz. */
export function rutaDeployPorDefecto(): string {
  const raiz = process.env.CORDON_SKILL_DEPLOY_RAIZ ?? join(homedir(), ".claude", "skills");
  return join(raiz, CORDON_SKILL_NOMBRE, "SKILL.md");
}

/**
 * Audita una ruta concreta del deploy contra lo esperado. El archivo ausente es un
 * SKIP nombrado (CI/otra máquina sin `~/.claude/skills` montado), no un falso rojo.
 */
export function auditarRutaSkill(rutaArchivo: string, esperado: EsperadoCordon): VeredictoCordon {
  if (!existsSync(rutaArchivo)) {
    return {
      estado: "skip",
      motivo: `deploy de la skill no encontrado en ${rutaArchivo} (¿~/.claude/skills montado?)`,
    };
  }
  return evaluarCordonSkill(parsearSelloKora(readFileSync(rutaArchivo, "utf8")), esperado);
}

if (import.meta.main) {
  const ruta = rutaDeployPorDefecto();
  const v = auditarRutaSkill(ruta, CORDON_SKILL_ESPERADO);
  const linea = `[CORDON] ${v.estado.toUpperCase()}: ${v.motivo}`;
  if (v.estado === "fallo") {
    console.error(linea);
    process.exit(1);
  }
  console.log(linea);
}
