// Corte C1 — version-match skill↔app (cordón umbilical).
// El consumidor (opforja) lee la versión AUTÉNTICA de la skill desplegada desde
// el bloque proof-carrying `<!-- kora:sello … -->` del CUERPO (no del frontmatter,
// que el transmutador pneuma deja mínimo). Aquí se prueban el parser puro del
// sello y el evaluador del veredicto del cordón. La IO (localizar el deploy) vive
// en scripts/cordon-skill-audit.ts.
import { describe, expect, test } from "bun:test";
import { evaluarCordonSkill, parsearSelloKora } from "./selloSkill";

const SELLO_VALIDO = [
  "# modelamiento-opm",
  "",
  "cuerpo de la skill...",
  "",
  "<!-- kora:sello",
  "fuente: urn:kora:artefacto:modelamiento-opm",
  "version: 1.9.0",
  "hash-fuente: sha256:3df08728195912bcc6692ea725fd5c7e3f94775307841a0c862c8111a6aa9312",
  "target: claude-code",
  "funtor: T-claude-code-pneuma-v1",
  "fidelidad: pi:full mu:full xi:full lambda:full phi:full sigma:full",
  "-->",
].join("\n");

describe("parsearSelloKora — parser puro del sello proof-carrying (corte C1)", () => {
  test("extrae version, hash-fuente, target y fuente de un sello válido", () => {
    const sello = parsearSelloKora(SELLO_VALIDO);
    expect(sello).not.toBeNull();
    expect(sello?.version).toBe("1.9.0");
    expect(sello?.hashFuente).toBe(
      "sha256:3df08728195912bcc6692ea725fd5c7e3f94775307841a0c862c8111a6aa9312",
    );
    expect(sello?.target).toBe("claude-code");
    expect(sello?.fuente).toBe("urn:kora:artefacto:modelamiento-opm");
  });

  test("devuelve null si el contenido no tiene bloque kora:sello", () => {
    expect(parsearSelloKora("# skill sin sello\n\nsolo cuerpo, sin metadata")).toBeNull();
  });
});

const ESPERADO = {
  version: "1.9.0",
  hashFuente: "sha256:3df08728195912bcc6692ea725fd5c7e3f94775307841a0c862c8111a6aa9312",
  target: "claude-code",
};

const selloCon = (over: Partial<typeof ESPERADO>) => ({ fuente: "urn:x", ...ESPERADO, ...over });

describe("evaluarCordonSkill — veredicto del cordón (version-duro / hash-blando / target / skip)", () => {
  test("ok cuando version, hash-fuente y target del deploy coinciden con lo esperado", () => {
    const v = evaluarCordonSkill(selloCon({}), ESPERADO);
    expect(v.estado).toBe("ok");
  });

  test("fallo duro 'deploy stale' cuando la version del deploy difiere de la esperada", () => {
    const v = evaluarCordonSkill(selloCon({ version: "1.8.0" }), ESPERADO);
    expect(v.estado).toBe("fallo");
    expect(v.motivo).toContain("deploy stale");
    expect(v.motivo).toContain("1.8.0");
    expect(v.motivo).toContain("1.9.0");
  });

  test("advertencia 'hash drift' cuando la version coincide pero el hash-fuente difiere", () => {
    const v = evaluarCordonSkill(selloCon({ hashFuente: "sha256:0000" }), ESPERADO);
    expect(v.estado).toBe("advertencia");
    expect(v.motivo).toContain("hash");
  });

  test("fallo duro cuando el target es de otro runtime (no claude-code)", () => {
    const v = evaluarCordonSkill(selloCon({ target: "openclaw" }), ESPERADO);
    expect(v.estado).toBe("fallo");
    expect(v.motivo).toContain("target");
  });

  test("skip nombrado cuando el sello es null (no se puede comparar version)", () => {
    const v = evaluarCordonSkill(null, ESPERADO);
    expect(v.estado).toBe("skip");
  });
});
