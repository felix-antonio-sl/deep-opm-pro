// Corte C1 — test de la IO del gate del cordón (patrón design:governance: test del
// script + script ejecutable). La lógica pura vive en src/canon/selloSkill.ts (ya
// testeada en src); aquí se ejerce la capa de IO: localizar el deploy, manejar el
// archivo ausente (SKIP), y traducir un deploy real a veredicto.
import { describe, expect, test } from "bun:test";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { auditarRutaSkill } from "./cordon-skill-audit";
import { CORDON_SKILL_ESPERADO } from "../src/canon/selloSkill";

const selloFresco = [
  "<!-- kora:sello",
  "fuente: urn:kora:artefacto:modelamiento-opm",
  `version: ${CORDON_SKILL_ESPERADO.version}`,
  `hash-fuente: ${CORDON_SKILL_ESPERADO.hashFuente}`,
  `target: ${CORDON_SKILL_ESPERADO.target}`,
  "-->",
].join("\n");

function escribirSkillTemp(sello: string): string {
  const dir = mkdtempSync(join(tmpdir(), "cordon-"));
  const ruta = join(dir, "SKILL.md");
  writeFileSync(ruta, `# modelamiento-opm\n\ncuerpo\n\n${sello}\n`);
  return ruta;
}

describe("auditarRutaSkill — IO del gate del cordón (corte C1)", () => {
  test("skip nombrado cuando el deploy de la skill no existe (entorno sin skill montada)", () => {
    const v = auditarRutaSkill(
      join(tmpdir(), "no-existe-jamas-cordon", "SKILL.md"),
      CORDON_SKILL_ESPERADO,
    );
    expect(v.estado).toBe("skip");
  });

  test("ok cuando el deploy testimonia la version y hash pineados", () => {
    const ruta = escribirSkillTemp(selloFresco);
    expect(auditarRutaSkill(ruta, CORDON_SKILL_ESPERADO).estado).toBe("ok");
  });

  test("fallo 'deploy stale' cuando el deploy testimonia una version anterior", () => {
    const ruta = escribirSkillTemp(selloFresco.replace(CORDON_SKILL_ESPERADO.version, "1.8.0"));
    const v = auditarRutaSkill(ruta, CORDON_SKILL_ESPERADO);
    expect(v.estado).toBe("fallo");
    expect(v.motivo).toContain("deploy stale");
  });
});
