#!/usr/bin/env bun
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(appRoot, "..");

function readRel(path) {
  return readFileSync(join(repoRoot, path), "utf8");
}

// ── Versión única del sistema de diseño ──────────────────────────────────────
// La SSOT de versión es ui-forja/GOVERNANCE.md (autoridad normativa, precedencia
// §1.3). El resto de artefactos de diseño que declaran versión deben igualarla;
// el gate la LEE de la SSOT y nombra al divergente, en vez de hardcodearla.

/** Reduce cualquier etiqueta de versión a `major.minor` para comparar. */
export function versionMajorMinor(value) {
  const match = String(value).match(/(\d+)\.(\d+)/);
  return match ? `${match[1]}.${match[2]}` : "";
}

/**
 * Extrae la versión declarada en un artefacto según su formato:
 * - "frontmatter": línea Markdown `**Versión:** X.Y`
 * - "json": campo `"version": "X.Y.Z"`
 * - "css": comentario `Versión X.Y`
 */
export function extraerVersionDeclarada(texto, formato) {
  if (formato === "json") {
    try {
      return JSON.parse(texto).version ?? "";
    } catch {
      return ""; // JSON malformado ⇒ versión "(ausente)", reportado como divergencia, no excepción
    }
  }
  if (formato === "frontmatter") {
    const match = texto.match(/^\*\*Versi[oó]n:\*\*\s*([0-9.]+)/m);
    return match ? match[1] : "";
  }
  if (formato === "css") {
    const match = texto.match(/Versi[oó]n\s+([0-9.]+)/);
    return match ? match[1] : "";
  }
  return "";
}

/**
 * Artefactos de diseño que declaran versión. El primero marcado `esSsot` es la
 * fuente; los demás deben igualar su `major.minor`. Devuelve `version: null` si
 * el archivo no existe (lo detecta el gate como divergencia).
 */
export function artefactosDeVersion() {
  const fuentes = [
    { path: "ui-forja/GOVERNANCE.md", formato: "frontmatter", esSsot: true },
    { path: "ui-forja/01-design-spec.md", formato: "frontmatter", esSsot: false },
    { path: "ui-forja/README.md", formato: "frontmatter", esSsot: false },
    { path: "ui-forja/tokens.json", formato: "json", esSsot: false },
    { path: "ui-forja/tokens.css", formato: "css", esSsot: false },
  ];
  return fuentes.map((fuente) => {
    const full = join(repoRoot, fuente.path);
    const version = existsSync(full) ? extraerVersionDeclarada(readFileSync(full, "utf8"), fuente.formato) : null;
    return { ...fuente, version };
  });
}

function auditarVersionUnica(assertCheck) {
  const artefactos = artefactosDeVersion();
  const ssot = artefactos.find((a) => a.esSsot);
  assertCheck("version-ssot-presente", Boolean(ssot?.version), "GOVERNANCE.md debe declarar **Versión:** X.Y (SSOT de versión)");
  if (!ssot?.version) return;

  const esperada = versionMajorMinor(ssot.version);
  for (const artefacto of artefactos) {
    if (artefacto.esSsot) continue;
    const declarada = artefacto.version == null ? "(ausente)" : versionMajorMinor(artefacto.version);
    assertCheck(
      `version-alineada-${artefacto.path}`,
      declarada === esperada,
      `${artefacto.path}: versión ${declarada}, SSOT (${ssot.path}) declara ${esperada}`,
    );
  }
}

// ── Auditoría de gobernanza ───────────────────────────────────────────────────

export function ejecutarAuditoria() {
  const failures = [];
  const warnings = [];

  function assertCheck(id, ok, detail) {
    if (!ok) failures.push({ id, detail });
  }

  function warnCheck(id, ok, detail) {
    if (!ok) warnings.push({ id, detail });
  }

  return import(pathToFileURL(join(appRoot, "src/ui/tokens.ts")).href).then((runtimeTokens) => {
    const tokensJson = JSON.parse(readRel("ui-forja/tokens.json"));

    function tokenValue(path) {
      let cursor = tokensJson;
      for (const part of path) cursor = cursor?.[part];
      return cursor?.value;
    }

    function numericPx(value) {
      return Number.parseFloat(String(value).replace("px", ""));
    }

    function walk(dir, files = []) {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const stat = statSync(full);
        if (stat.isDirectory()) {
          if (entry === "node_modules" || entry === "dist" || entry === "test-results") continue;
          walk(full, files);
          continue;
        }
        files.push(full);
      }
      return files;
    }

    function auditOffsetShadows() {
      const roots = [join(appRoot, "src/ui"), join(appRoot, "src/render/jointjs")];
      const files = roots.flatMap((root) => walk(root)).filter((file) => {
        const ext = extname(file);
        if (![".ts", ".tsx", ".css"].includes(ext)) return false;
        return !file.endsWith(".test.ts") && !file.endsWith(".test.tsx");
      });
      const offenders = [];
      for (const file of files) {
        const rel = relative(repoRoot, file);
        const lines = readFileSync(file, "utf8").split("\n");
        lines.forEach((line, index) => {
          const lower = line.toLowerCase();
          const isShadow = lower.includes("boxshadow") || lower.includes("box-shadow:");
          if (!isShadow) return;
          const allowed =
            lower.includes("none") ||
            lower.includes("tokens.shadows") ||
            lower.includes("shadows.") ||
            lower.includes("inset") ||
            lower.includes("0 0 0");
          if (allowed) return;
          if (/\b\d+px\s+\d+px\b/.test(line) || /\b0\s+\d+px\b/.test(line)) {
            offenders.push(`${rel}:${index + 1}: ${line.trim()}`);
          }
        });
      }
      assertCheck("no-offset-shadows", offenders.length === 0, offenders.join("\n"));
    }

    const governancePath = "ui-forja/GOVERNANCE.md";
    assertCheck("governance-file", existsSync(join(repoRoot, governancePath)), `${governancePath} debe existir`);

    const governance = existsSync(join(repoRoot, governancePath)) ? readRel(governancePath) : "";
    assertCheck("governance-precedence-opm", governance.includes("reglas-opm-estrictas.md") && governance.includes("SSOT suprema"), "GOVERNANCE debe declarar precedencia de la SSOT OPM");
    assertCheck("governance-layout-v11", governance.includes("OPL ← canvas → Índice + Inspector"), "GOVERNANCE debe declarar el layout v1.1 vigente");
    assertCheck("governance-gate", governance.includes("bun run design:governance"), "GOVERNANCE debe declarar su gate ejecutable");

    // Versión única del sistema de diseño: leída de la SSOT (GOVERNANCE), no hardcodeada.
    auditarVersionUnica(assertCheck);

    const readme = readRel("ui-forja/README.md");
    assertCheck("readme-governance-link", readme.includes("GOVERNANCE.md"), "README de ui-forja debe apuntar a GOVERNANCE.md");

    const designSpec = readRel("ui-forja/01-design-spec.md");
    assertCheck("design-spec-governance-link", designSpec.includes("GOVERNANCE.md"), "01-design-spec debe apuntar a GOVERNANCE.md");
    assertCheck("design-spec-mirrored-layout", designSpec.includes("margen izquierdo") && designSpec.includes("herramientas de edición"), "01-design-spec debe describir OPL izquierda e índice/inspector derecha");

    assertCheck("tokens-json-left-col", tokensJson.layout?.colLeft?.value === "360px", `layout.colLeft esperado 360px, actual ${tokensJson.layout?.colLeft?.value}`);

    const tokensCss = readRel("ui-forja/tokens.css");
    assertCheck("tokens-css-left-col", tokensCss.includes("--cx-col-left:   360px;"), "tokens.css debe fijar --cx-col-left en 360px");

    const { colors, stroke, typography, radii, shadows } = runtimeTokens;

    const colorExpectations = [
      ["paper", colors.paper],
      ["paperWarm", colors.paperWarm],
      ["ink", colors.ink],
      ["inkMid", colors.inkMid],
      ["inkSoft", colors.inkSoft],
      ["inkFaint", colors.inkFaint],
      ["rule", colors.rule],
      ["ruleStrong", colors.ruleStrong],
      ["crimson", colors.crimson],
    ];
    for (const [token, runtime] of colorExpectations) {
      assertCheck(`color-${token}`, tokenValue(["color", token]) === runtime, `${token}: ui-forja=${tokenValue(["color", token])} runtime=${runtime}`);
    }

    assertCheck("color-opm-object", tokenValue(["color", "opm", "object"]) === colors.opm.object, `object: ui-forja=${tokenValue(["color", "opm", "object"])} runtime=${colors.opm.object}`);
    assertCheck("color-opm-process", tokenValue(["color", "opm", "process"]) === colors.opm.process, `process: ui-forja=${tokenValue(["color", "opm", "process"])} runtime=${colors.opm.process}`);
    assertCheck("color-opm-state", tokenValue(["color", "opm", "state"]) === colors.opm.state, `state: ui-forja=${tokenValue(["color", "opm", "state"])} runtime=${colors.opm.state}`);
    assertCheck("color-opm-state-fill", tokenValue(["color", "opm", "stateFill"]) === colors.opm.stateFill, `stateFill: ui-forja=${tokenValue(["color", "opm", "stateFill"])} runtime=${colors.opm.stateFill}`);

    assertCheck("stroke-object", numericPx(tokenValue(["stroke", "object"])) === stroke.opm.object, `stroke.object runtime=${stroke.opm.object}`);
    assertCheck("stroke-process", numericPx(tokenValue(["stroke", "process"])) === stroke.opm.process, `stroke.process runtime=${stroke.opm.process}`);
    assertCheck("stroke-state", numericPx(tokenValue(["stroke", "state"])) === stroke.opm.state, `stroke.state runtime=${stroke.opm.state}`);
    assertCheck("stroke-link", numericPx(tokenValue(["stroke", "link"])) === stroke.opm.link, `stroke.link runtime=${stroke.opm.link}`);
    assertCheck("stroke-triangle", numericPx(tokenValue(["stroke", "triangle"])) === stroke.opm.triangle, `stroke.triangle runtime=${stroke.opm.triangle}`);

    assertCheck("typography-fs13", numericPx(tokenValue(["fontSize", "fs13"])) === typography.fs.fs13, `fs13 runtime=${typography.fs.fs13}`);
    assertCheck("typography-fs22", numericPx(tokenValue(["fontSize", "fs22"])) === typography.fs.fs22, `fs22 runtime=${typography.fs.fs22}`);
    assertCheck("typography-weight-medium", tokenValue(["fontWeight", "medium"]) === typography.weights.medium, `medium runtime=${typography.weights.medium}`);
    assertCheck("typography-weight-semibold", tokenValue(["fontWeight", "semibold"]) === typography.weights.semibold, `semibold runtime=${typography.weights.semibold}`);
    assertCheck("radii-chrome-zero", radii.xs === 0 && radii.sm === 0 && radii.md === 0 && radii.lg === 0, "radii de chrome deben colapsar a 0");
    assertCheck("shadows-no-elevation", shadows.card === "none" && shadows.modal === "none" && shadows.popover === "none", "sombras de elevación deben ser none");

    auditOffsetShadows();

    warnCheck("legacy-canvas-aliases", colors.canvas.objeto === "#70E483" && colors.canvas.proceso === "#3BC3FF", "aliases legacy canvas cambiaron; si fue intencional, moverlos a excepción documentada");

    return { failures, warnings };
  });
}

// Solo ejecuta el gate cuando se invoca como script; al importarlo (tests) solo
// expone los helpers puros, sin correr la auditoría ni process.exit.
if (import.meta.main) {
  const { failures, warnings } = await ejecutarAuditoria();

  for (const warning of warnings) {
    console.warn(`WARN ${warning.id}: ${warning.detail}`);
  }

  if (failures.length > 0) {
    console.error("ui-forja-governance audit: FAIL");
    for (const failure of failures) {
      console.error(`- ${failure.id}: ${failure.detail}`);
    }
    process.exit(1);
  }

  console.log("ui-forja-governance audit: OK");
}
