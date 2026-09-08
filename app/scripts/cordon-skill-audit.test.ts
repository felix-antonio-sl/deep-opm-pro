// Corte C1 — test de la IO del gate del cordón (patrón design:governance: test del
// script + script ejecutable). La lógica pura vive en src/canon/selloSkill.ts (ya
// testeada en src); aquí se ejerce la capa de IO: localizar el deploy, manejar el
// archivo ausente (SKIP), y traducir un deploy real a veredicto.
import { afterEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { auditarRutaSkill, fingerprintNativeSkill } from "./cordon-skill-audit";
import { CORDON_SKILL_ESPERADOS } from "../src/canon/selloSkill";

const CORDON_SKILL_ESPERADO = CORDON_SKILL_ESPERADOS["claude-code"];
const directories: string[] = [];
afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

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
  directories.push(dir);
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

  test("una emisión nativa se compara por todos sus archivos, no por un sello ausente", () => {
    const ruta = escribirSkillTemp("");
    const dir = directories.at(-1)!;
    mkdirSync(join(dir, "referencias"));
    const reference = join(dir, "referencias/operacion.md");
    writeFileSync(reference, "# Operación vigente\n");
    const expected = { ...CORDON_SKILL_ESPERADOS.codex, nativeHash: fingerprintNativeSkill(dir) };
    expect(auditarRutaSkill(ruta, expected).estado).toBe("ok");
    writeFileSync(reference, "# Operación modificada\n");
    expect(auditarRutaSkill(ruta, expected).estado).toBe("fallo");
    rmSync(reference);
    expect(auditarRutaSkill(ruta, expected).estado).toBe("fallo");
  });

  test("una emisión sin sello ni firma nativa revisada no acredita paridad", () => {
    const ruta = escribirSkillTemp("");
    expect(auditarRutaSkill(ruta, CORDON_SKILL_ESPERADO).estado).toBe("skip");
    expect(auditarRutaSkill(ruta, CORDON_SKILL_ESPERADOS.codex).estado).toBe("fallo");
  });
});
