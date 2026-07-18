#!/usr/bin/env bun
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { mapaUrn, resolverUrn } from "../src/canon/resolutorUrn";
import { CORDON_SKILL_ESPERADO, parsearSelloKora, type SelloKora } from "../src/canon/selloSkill";

const APP_ROOT = resolve(import.meta.dir, "..");
const REPO_ROOT = resolve(APP_ROOT, "..");
const PRODUCCION = process.env.OPFORJA_URL ?? "https://opforja.sanixai.com";
const RUTAS_DESPLEGABLES = ["app", "assets", "deploy", "Dockerfile", "docker-compose.yml"];

export function versionFrontmatter(texto: string): string | null {
  return texto.match(/^version:\s*"?([0-9]+\.[0-9]+\.[0-9]+)"?/m)?.[1] ?? null;
}

export function extraerBuildProduccion(bundle: string): string | null {
  const variable = bundle.match(/title:`build \$\{([A-Za-z_$][\w$]*)\}`/)?.[1];
  if (variable) {
    const escapada = variable.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const build = bundle.match(new RegExp(`(?:^|[,;])${escapada}="([0-9a-f]{7,40})"`))?.[1];
    if (build) return build;
  }
  return bundle.match(/="[0-9]{4}-[0-9]{2}-[0-9]{2}",[A-Za-z_$][\w$]*="([0-9a-f]{7,40})"/)?.[1] ?? null;
}

export function clasificarDerivaFuente(input: {
  head: string;
  build: string | null;
  cambiaProducto: boolean | null;
}): string {
  if (!input.build) return "SKIP · no comparable";
  if (input.build === input.head) return "OK · SHA exacto";
  if (input.cambiaProducto === false) return `OK · HEAD ${input.head} solo difiere en artefactos no desplegables`;
  if (input.cambiaProducto === true) return `ADVERTENCIA · HEAD ${input.head}, deploy ${input.build}, hay cambios desplegables`;
  return `SKIP · no se pudo comparar HEAD ${input.head} con deploy ${input.build}`;
}

function git(args: string[], cwd = REPO_ROOT): string {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function cambiaProductoDesde(build: string | null): boolean | null {
  if (!build) return null;
  const resultado = spawnSync("git", ["diff", "--quiet", `${build}..HEAD`, "--", ...RUTAS_DESPLEGABLES], {
    cwd: REPO_ROOT,
  });
  if (resultado.status === 0) return false;
  if (resultado.status === 1) return true;
  return null;
}

function selloSkill(ruta: string): SelloKora | null {
  return existsSync(ruta) ? parsearSelloKora(readFileSync(ruta, "utf8")) : null;
}

function versionUrn(urn: string): string | null {
  const ruta = resolverUrn(urn);
  return existsSync(ruta) ? versionFrontmatter(readFileSync(ruta, "utf8")) : null;
}

function estadoSello(sello: SelloKora | null, target: string): string {
  if (!sello) return "SKIP · deploy no encontrado o sin sello";
  const coincide =
    sello.version === CORDON_SKILL_ESPERADO.version &&
    sello.hashFuente === CORDON_SKILL_ESPERADO.hashFuente &&
    sello.target === target;
  return `${coincide ? "OK" : "FALLO"} · v${sello.version} · ${sello.target} · ${sello.hashFuente.slice(0, 19)}…`;
}

async function leerProduccion(): Promise<{ build: string | null; health: string; session: number | null }> {
  try {
    const [index, health, session] = await Promise.all([
      fetch(`${PRODUCCION}/`).then((r) => r.ok ? r.text() : Promise.reject(new Error(`raíz HTTP ${r.status}`))),
      fetch(`${PRODUCCION}/healthz`).then(async (r) => r.ok ? (await r.text()).trim() : `HTTP ${r.status}`),
      fetch(`${PRODUCCION}/__deep-opm/session`).then((r) => r.status),
    ]);
    const assets = [...index.matchAll(/(?:src|href)="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1]);
    const bundles = await Promise.all([...new Set(assets)].map((asset) => fetch(`${PRODUCCION}${asset}`).then((r) => r.text())));
    return { build: extraerBuildProduccion(bundles.join("\n")), health, session };
  } catch (error) {
    return { build: null, health: `SKIP · ${error instanceof Error ? error.message : String(error)}`, session: null };
  }
}

export async function ejecutarCordonEstado(): Promise<number> {
  const sha = git(["rev-parse", "--short=8", "HEAD"]);
  const upstream = git(["rev-list", "--left-right", "--count", "origin/main...HEAD"]).split(/\s+/);
  const estado = git(["status", "--porcelain"]);
  const docsTree = git(["rev-parse", "--short=12", "HEAD:docs"]);
  const manualBlob = git(["hash-object", "docs/manual-opforja.md"]).slice(0, 12);
  const handoff = readdirSync(join(REPO_ROOT, "docs"))
    .filter((nombre) => /^handoff-\d{4}-\d{2}-\d{2}\.md$/.test(nombre))
    .sort()
    .at(-1) ?? "no encontrado";
  const ssot = Object.entries(mapaUrn()).map(([urn, pin]) => {
    const viva = versionUrn(urn);
    return `${urn.replace("urn:fxsl:kb:", "")}=${viva ?? "SKIP"}${viva && viva !== pin.version ? ` (pin ${pin.version})` : ""}`;
  });
  const claude = selloSkill(join(homedir(), ".claude", "skills", "modelamiento-opm", "SKILL.md"));
  const codex = selloSkill(join(homedir(), ".agents", "skills", "modelamiento-opm", "SKILL.md"));
  const produccion = await leerProduccion();
  const derivaFuente = clasificarDerivaFuente({
    head: sha,
    build: produccion.build,
    cambiaProducto: cambiaProductoDesde(produccion.build),
  });
  const skillFalla = !claude || !codex ||
    claude.version !== CORDON_SKILL_ESPERADO.version || claude.hashFuente !== CORDON_SKILL_ESPERADO.hashFuente || claude.target !== "claude-code" ||
    codex.version !== CORDON_SKILL_ESPERADO.version || codex.hashFuente !== CORDON_SKILL_ESPERADO.hashFuente || codex.target !== "codex";

  console.log("Cordón de estado · compuesto opforja");
  console.log(`1. SSOT OPM/Forja · ${ssot.join(" · ")}`);
  console.log(`2. App · ${sha} · origin/main detrás ${upstream[0] ?? "?"}, delante ${upstream[1] ?? "?"} · árbol ${estado ? "con cambios" : "limpio"}`);
  console.log(`3. Documentación · árbol Git ${docsTree} · ${handoff}`);
  console.log(`4. Skill Claude · ${estadoSello(claude, "claude-code")}`);
  console.log(`   Skill Codex  · ${estadoSello(codex, "codex")}`);
  console.log(`5. Método/manual · metodologia-forja-opm-es=${versionUrn("urn:fxsl:kb:metodologia-forja-opm-es") ?? "SKIP"} · manual blob ${manualBlob}`);
  console.log("");
  console.log("Operación");
  console.log(`- Producción: build ${produccion.build ?? "NO DETERMINADO"} · /healthz ${produccion.health} · /session anónima ${produccion.session ?? "SKIP"}`);
  console.log(`- Fuente ↔ deploy: ${derivaFuente}`);
  console.log("");
  console.log("Fronteras sin testigo completo");
  console.log("- SSOT ↔ skill desplegada: el sello prueba identidad, versión y procedencia; la equivalencia semántica aún requiere revisión humana.");
  console.log("- docs/uso-productivo.md ↔ app: existen leyes editoriales y E2E parciales, pero no un comparador de todas sus afirmaciones de comportamiento.");
  return skillFalla ? 1 : 0;
}

if (import.meta.main) process.exitCode = await ejecutarCordonEstado();
