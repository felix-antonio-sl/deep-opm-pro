import { afterEach, describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { cambiaProductoDesde, clasificarDerivaFuente, extraerBuildProduccion, versionFrontmatter } from "./cordon-estado";

const reposTemporales: string[] = [];
afterEach(() => {
  for (const repo of reposTemporales.splice(0)) rmSync(repo, { recursive: true, force: true });
});

function crearRepo(): { repo: string; build: string; git: (...args: string[]) => string } {
  const repo = mkdtempSync(join(tmpdir(), "opforja-cordon-"));
  reposTemporales.push(repo);
  const git = (...args: string[]): string => execFileSync("git", [
    "-c", "user.name=Prueba", "-c", "user.email=prueba@example.invalid",
    "-c", "commit.gpgsign=false", "-c", "core.hooksPath=/dev/null", ...args,
  ], { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  git("init");
  mkdirSync(join(repo, "app"));
  mkdirSync(join(repo, "docs"));
  writeFileSync(join(repo, "app/index.ts"), "export const version = 1;\n");
  writeFileSync(join(repo, "docs/README.md"), "# Documentación\n");
  writeFileSync(join(repo, ".gitignore"), "app/dist/\n");
  writeFileSync(join(repo, ".dockerignore"), ".git\n");
  git("add", ".");
  git("commit", "-m", "Base de prueba");
  return { repo, build: git("rev-parse", "--short=8", "HEAD"), git };
}

describe("cordon:estado", () => {
  test("lee semver del frontmatter vivo", () => {
    expect(versionFrontmatter("---\nversion: \"1.6.0\"\n---")).toBe("1.6.0");
    expect(versionFrontmatter("# sin versión")).toBeNull();
  });

  test("extrae el build desde el testigo visible minificado", () => {
    const bundle = 'const a="2026-07-18",b="92dbbaa7",c=a;title:`build ${b}`';
    expect(extraerBuildProduccion(bundle)).toBe("92dbbaa7");
  });

  test("conserva la marca dirty del build en ambos formatos de testigo", () => {
    expect(extraerBuildProduccion('const a="2026-09-05",b="92dbbaa7-dirty";title:`build ${b}`')).toBe("92dbbaa7-dirty");
    expect(extraerBuildProduccion('const a="2026-09-05",b="92dbbaa7-dirty";')).toBe("92dbbaa7-dirty");
    expect(clasificarDerivaFuente({
      head: "92dbbaa7", build: "92dbbaa7-dirty", cambiaProducto: false,
    })).toContain("el SHA no acredita paridad");
  });

  test("no inventa una revisión si el bundle no porta el testigo", () => {
    expect(extraerBuildProduccion('const hash="deadbeef";')).toBeNull();
  });

  test("distingue un commit documental posterior de una deriva desplegable", () => {
    expect(clasificarDerivaFuente({
      head: "bbbbbbbb",
      build: "aaaaaaaa",
      cambiaProducto: false,
    })).toContain("solo difiere en artefactos no desplegables");
    expect(clasificarDerivaFuente({
      head: "bbbbbbbb",
      build: "aaaaaaaa",
      cambiaProducto: true,
    })).toContain("hay cambios desplegables");
  });

  test("un mismo HEAD no acredita paridad si cambió la fuente o no se pudo comparar", () => {
    const revision = { head: "aaaaaaaa", build: "aaaaaaaa" };
    expect(clasificarDerivaFuente({ ...revision, cambiaProducto: true })).toContain("ADVERTENCIA");
    expect(clasificarDerivaFuente({ ...revision, cambiaProducto: null })).toContain("SKIP");
    expect(clasificarDerivaFuente({ ...revision, cambiaProducto: false })).toContain("OK");
  });

  test("compara cambios desplegables sin commit, preparados y confirmados con el build", () => {
    const { repo, build, git } = crearRepo();
    expect(cambiaProductoDesde(build, repo)).toBe(false);
    writeFileSync(join(repo, "app/index.ts"), "export const version = 2;\n");
    expect(cambiaProductoDesde(build, repo)).toBe(true);
    git("add", "app/index.ts");
    expect(cambiaProductoDesde(build, repo)).toBe(true);
    git("commit", "-m", "Cambio de producto");
    expect(cambiaProductoDesde(build, repo)).toBe(true);
  });

  test("detecta archivos desplegables nuevos fuera del índice", () => {
    const { repo, build } = crearRepo();
    writeFileSync(join(repo, "app/nuevo.ts"), "export const nuevo = true;\n");
    expect(cambiaProductoDesde(build, repo)).toBe(true);
  });

  test("un cambio preparado sigue pendiente aunque el archivo de trabajo vuelva al build", () => {
    const { repo, build, git } = crearRepo();
    writeFileSync(join(repo, "app/index.ts"), "export const version = 2;\n");
    git("add", "app/index.ts");
    writeFileSync(join(repo, "app/index.ts"), "export const version = 1;\n");
    expect(cambiaProductoDesde(build, repo)).toBe(true);
  });

  test("el resolutor que materializa el corpus sí es una entrada del producto", () => {
    const { repo, build, git } = crearRepo();
    mkdirSync(join(repo, "docs/canon-opm"));
    writeFileSync(join(repo, "docs/canon-opm/resolutor-urn.json"), "{}\n");
    expect(cambiaProductoDesde(build, repo)).toBe(true);
    git("add", "docs/canon-opm/resolutor-urn.json");
    git("commit", "-m", "Cambiar origen del corpus");
    expect(cambiaProductoDesde(build, repo)).toBe(true);
  });

  test("la documentación y los derivados ignorados no simulan una deriva del producto", () => {
    const { repo, build, git } = crearRepo();
    writeFileSync(join(repo, "docs/README.md"), "# Documentación actualizada\n");
    writeFileSync(join(repo, "docs/nota.md"), "# Nota\n");
    mkdirSync(join(repo, "app/dist"));
    writeFileSync(join(repo, "app/dist/index.js"), "// derivado\n");
    expect(cambiaProductoDesde(build, repo)).toBe(false);
    git("add", "docs");
    git("commit", "-m", "Cambio documental");
    expect(cambiaProductoDesde(build, repo)).toBe(false);
  });

  test("el contexto Docker forma parte de la fuente desplegable", () => {
    const { repo, build } = crearRepo();
    writeFileSync(join(repo, ".dockerignore"), ".git\n.env\n");
    expect(cambiaProductoDesde(build, repo)).toBe(true);
  });

  test("una revisión ausente o dirty deja la comparación indeterminada", () => {
    const { repo, build } = crearRepo();
    expect(cambiaProductoDesde("00000000", repo)).toBeNull();
    expect(cambiaProductoDesde(`${build}-dirty`, repo)).toBeNull();
    expect(cambiaProductoDesde(null, repo)).toBeNull();
  });
});
