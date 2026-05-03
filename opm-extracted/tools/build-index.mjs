#!/usr/bin/env node
/*
 * build-index.mjs
 *
 * Recorre opm-extracted/src/ y construye:
 *   - INDEX.md         tabla clase OPM -> archivo (las 376 clases catalogadas)
 *   - MODULES.md       tabla path -> bytes/líneas -> símbolos top-level
 *   - assets/INDEX.md  cross-reference SVG/PNG -> clase usuaria + estado
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const SRC = resolve(ROOT, "src");
const ASSETS = resolve(ROOT, "assets");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(SRC).filter((f) => /\.(ts|js|mjs)$/.test(f) && !f.endsWith("_index.json"));

// 1. Recolectar símbolos top-level por archivo
const symbolsByFile = new Map(); // file -> { classes: [{name, extends}], functions: [], consts: [], enums: [] }
const fileByClass = new Map();   // className -> [files]

for (const f of files) {
  const text = readFileSync(f, "utf8");
  const symbols = { classes: [], functions: [], consts: [], enums: [], interfaces: [], types: [] };

  // class X (extends Y)?
  const classRe = /^\s*(?:export\s+(?:default\s+)?)?(?:abstract\s+)?class\s+([A-Za-z_$][\w$]*)(?:\s+extends\s+([A-Za-z_$][\w$.]*))?/gm;
  let m;
  while ((m = classRe.exec(text)) !== null) {
    symbols.classes.push({ name: m[1], extends: m[2] || null });
    if (!fileByClass.has(m[1])) fileByClass.set(m[1], []);
    fileByClass.get(m[1]).push(f);
  }

  // function X(...)
  const fnRe = /^\s*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/gm;
  while ((m = fnRe.exec(text)) !== null) {
    symbols.functions.push(m[1]);
  }

  // const/let/var X = (top-level top of indent 0)
  const constRe = /^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/gm;
  while ((m = constRe.exec(text)) !== null) {
    symbols.consts.push(m[1]);
  }

  // enum X
  const enumRe = /^\s*(?:export\s+)?(?:const\s+)?enum\s+([A-Za-z_$][\w$]*)/gm;
  while ((m = enumRe.exec(text)) !== null) {
    symbols.enums.push(m[1]);
  }

  // interface X
  const ifRe = /^\s*(?:export\s+)?interface\s+([A-Za-z_$][\w$]*)/gm;
  while ((m = ifRe.exec(text)) !== null) {
    symbols.interfaces.push(m[1]);
  }

  // type X =
  const typeRe = /^\s*(?:export\s+)?type\s+([A-Za-z_$][\w$]*)\s*=/gm;
  while ((m = typeRe.exec(text)) !== null) {
    symbols.types.push(m[1]);
  }

  symbolsByFile.set(f, symbols);
}

// 2. Construir INDEX.md
const indexLines = [];
indexLines.push("# INDEX — clases OPM extraídas");
indexLines.push("");
indexLines.push("Tabla generada automáticamente por `tools/build-index.mjs`. Mapea cada");
indexLines.push("clase OPM presente en `opm-extracted/src/` a su archivo. Las clases");
indexLines.push("provienen del catálogo `catalog/classes.txt` (376 clases identificadas en");
indexLines.push("la decompilación) más cualquier clase auxiliar que aparezca al refactorizar.");
indexLines.push("");
indexLines.push("## Resumen");
indexLines.push("");
const totalClasses = [...fileByClass.keys()].length;
const totalFiles = files.length;
let totalBytes = 0;
let totalLines = 0;
for (const f of files) {
  const text = readFileSync(f, "utf8");
  totalBytes += text.length;
  totalLines += text.split("\n").length;
}
indexLines.push(`- **Archivos**: ${totalFiles}`);
indexLines.push(`- **Clases distintas**: ${totalClasses}`);
indexLines.push(`- **Líneas totales**: ${totalLines.toLocaleString()}`);
indexLines.push(`- **Bytes totales**: ${(totalBytes / 1024).toFixed(1)} KiB`);
indexLines.push("");
indexLines.push("## Clases (orden alfabético)");
indexLines.push("");
indexLines.push("| Clase | Extends | Archivo | Líneas |");
indexLines.push("|-------|---------|---------|--------|");

const sortedClassNames = [...fileByClass.keys()].sort((a, b) => a.localeCompare(b));
for (const cls of sortedClassNames) {
  const fpaths = fileByClass.get(cls);
  for (const fpath of fpaths) {
    const rel = relative(ROOT, fpath);
    const symbols = symbolsByFile.get(fpath);
    const cls_meta = symbols.classes.find((c) => c.name === cls);
    const ext = cls_meta?.extends || "—";
    const lineCount = readFileSync(fpath, "utf8").split("\n").length;
    indexLines.push(`| \`${cls}\` | \`${ext}\` | [\`${rel}\`](${rel}) | ${lineCount} |`);
  }
}
indexLines.push("");
indexLines.push("## Por categoría");
indexLines.push("");

const buckets = {
  "Modelo (núcleo)": (rel) => /\/models\/[^/]+\.(ts|js)$/.test(rel),
  "Modelo lógico (LogicalPart)": (rel) => /\/models\/LogicalPart\//.test(rel),
  "Modelo visual (VisualPart)": (rel) => /\/models\/VisualPart\//.test(rel),
  "Modelo dibujado (DrawnPart)": (rel) => /\/models\/DrawnPart\/(?!Links)/.test(rel),
  "Links (DrawnPart/Links)": (rel) => /\/models\/DrawnPart\/Links\//.test(rel),
  "Consistency": (rel) => /\/models\/consistency\//.test(rel),
  "Commands & Actions": (rel) => /\/models\/(components\/commands|Actions)\//.test(rel),
  "Modules (validation, hidden)": (rel) => /\/models\/(modules|hiddenAttributes|notes)\//.test(rel),
  "DSM": (rel) => /\/models\/DSM\//.test(rel),
  "DCM": (rel) => /\/models\/dcm\/|\/services\/dcm\//.test(rel),
  "ImportOPX": (rel) => /\/ImportOPX\//.test(rel),
  "Dialogs (UI Angular — referencia)": (rel) => /\/dialogs\//.test(rel),
  "Layout y módulos UI": (rel) => /\/modules\/(app|layout|shared|Settings)\//.test(rel),
  "Configuration": (rel) => /\/configuration\//.test(rel),
  "Rappid components": (rel) => /\/rappid-components\//.test(rel),
  "Database / Auth": (rel) => /\/database\//.test(rel),
  "Services (genéricos)": (rel) => /\/services\/(?!dcm)/.test(rel),
  "Pipes / Error / Pages": (rel) => /\/(pipes|error-handler|opd-hierarchy|environments|layout)\//.test(rel),
  "Otros": () => true, // catch-all
};

const seenFiles = new Set();
for (const [bucketName, predicate] of Object.entries(buckets)) {
  const matched = files
    .filter((f) => !seenFiles.has(f))
    .filter((f) => predicate(relative(ROOT, f)))
    .sort();
  if (!matched.length) continue;
  for (const f of matched) seenFiles.add(f);
  indexLines.push(`### ${bucketName} (${matched.length})`);
  indexLines.push("");
  for (const f of matched) {
    const rel = relative(ROOT, f);
    const symbols = symbolsByFile.get(f);
    const classNames = symbols.classes.map((c) => c.name).join(", ");
    const detail = classNames || symbols.functions.slice(0, 3).join(", ") || "(sin símbolos top-level)";
    indexLines.push(`- [\`${rel}\`](${rel}) — ${detail}`);
  }
  indexLines.push("");
}

writeFileSync(resolve(ROOT, "INDEX.md"), indexLines.join("\n"));

// 3. MODULES.md — vista tabular detallada por archivo
const modulesLines = [];
modulesLines.push("# MODULES — inventario por archivo");
modulesLines.push("");
modulesLines.push("Cada fila lista los símbolos top-level (clases, funciones, consts, enums)");
modulesLines.push("definidos en cada archivo de `opm-extracted/src/`.");
modulesLines.push("");
modulesLines.push("| Archivo | Líneas | Clases | Funciones | Consts | Enums |");
modulesLines.push("|---------|-------:|--------|-----------|--------|-------|");

for (const f of files.sort()) {
  const rel = relative(ROOT, f);
  const symbols = symbolsByFile.get(f);
  const text = readFileSync(f, "utf8");
  const lineCount = text.split("\n").length;
  const classes = symbols.classes.map((c) => `\`${c.name}\``).join(" ");
  const fns = symbols.functions.map((c) => `\`${c}\``).slice(0, 6).join(" ");
  const consts = symbols.consts.map((c) => `\`${c}\``).slice(0, 4).join(" ");
  const enums = symbols.enums.map((c) => `\`${c}\``).join(" ");
  modulesLines.push(`| [\`${rel}\`](${rel}) | ${lineCount} | ${classes || "—"} | ${fns || "—"} | ${consts || "—"} | ${enums || "—"} |`);
}

writeFileSync(resolve(ROOT, "MODULES.md"), modulesLines.join("\n"));

// 4. assets/INDEX.md — cross-reference asset -> clase usuaria
const assetFiles = walk(ASSETS).filter((f) => !f.endsWith("INDEX.md") && !f.endsWith("README.md"));

// Buscar referencias en src/ a cada asset por nombre base
function refsToAsset(basename) {
  const hits = [];
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    const re = new RegExp(`\\b${basename.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\b`);
    if (re.test(text)) hits.push(relative(ROOT, f));
  }
  return hits;
}

const assetsLines = [];
assetsLines.push("# Assets — inventario y cross-reference");
assetsLines.push("");
assetsLines.push("Inventario de SVG/PNG canónicos copiados desde `assets/` raíz, con");
assetsLines.push("cross-reference a los archivos en `src/` que referencian cada asset por");
assetsLines.push("nombre. Útil para identificar qué clase OPM consume qué SVG.");
assetsLines.push("");
assetsLines.push("Estado:");
assetsLines.push(`- **Total assets descargados**: ${assetFiles.length} (73 SVG + 11 PNG)`);
assetsLines.push("- **Assets referenciados pero NO descargados**: ver sección \"Wishlist\"");
assetsLines.push("");
assetsLines.push("## SVG por categoría");
assetsLines.push("");

const svgFiles = assetFiles.filter((f) => f.endsWith(".svg"));
const groupedSvg = {};
for (const f of svgFiles) {
  const rel = relative(ASSETS, f);
  const dir = dirname(rel) === "." ? "svg/(root)" : `svg/${dirname(rel).replace(/^svg\//, "")}`;
  if (!groupedSvg[dir]) groupedSvg[dir] = [];
  groupedSvg[dir].push(f);
}
for (const dir of Object.keys(groupedSvg).sort()) {
  assetsLines.push(`### ${dir}`);
  assetsLines.push("");
  assetsLines.push("| Asset | Referenciado en |");
  assetsLines.push("|-------|------------------|");
  for (const f of groupedSvg[dir].sort()) {
    const base = f.split("/").pop();
    const rel = relative(ROOT, f);
    const refs = refsToAsset(base);
    const refList = refs.length
      ? refs.slice(0, 3).map((r) => `\`${r.replace(/^src\//, "")}\``).join(", ") + (refs.length > 3 ? ` (+${refs.length - 3})` : "")
      : "—";
    assetsLines.push(`| [\`${base}\`](${rel}) | ${refList} |`);
  }
  assetsLines.push("");
}

assetsLines.push("## PNG");
assetsLines.push("");
const pngFiles = assetFiles.filter((f) => f.endsWith(".png"));
assetsLines.push("| Asset | Referenciado en |");
assetsLines.push("|-------|------------------|");
for (const f of pngFiles.sort()) {
  const base = f.split("/").pop();
  const rel = relative(ROOT, f);
  const refs = refsToAsset(base);
  const refList = refs.length
    ? refs.slice(0, 3).map((r) => `\`${r.replace(/^src\//, "")}\``).join(", ") + (refs.length > 3 ? ` (+${refs.length - 3})` : "")
    : "—";
  assetsLines.push(`| [\`${base}\`](${rel}) | ${refList} |`);
}

assetsLines.push("");
assetsLines.push("## Wishlist — assets referenciados pero NO descargados");
assetsLines.push("");
assetsLines.push("Lista de paths `assets/...` mencionados en el código extraído y que no");
assetsLines.push("aparecen físicamente en `opm-extracted/assets/`. Útil para futura curaduría");
assetsLines.push("o para implementar fallbacks.");
assetsLines.push("");
const allRefs = new Set();
for (const f of files) {
  const text = readFileSync(f, "utf8");
  for (const m of text.matchAll(/['"`]assets\/([A-Za-z0-9_/.\-]+)['"`]/g)) {
    allRefs.add(m[1]);
  }
}
const haveSet = new Set(assetFiles.map((f) => relative(ASSETS, f).toLowerCase()));
const missing = [];
for (const ref of allRefs) {
  // Normalizamos: en código aparece "SVG/" pero el árbol local usa "svg/".
  const normalized = ref.toLowerCase().replace(/^(svg|png)\//i, (m) => m.toLowerCase());
  if (!haveSet.has(normalized) && !haveSet.has(ref.toLowerCase())) {
    missing.push(ref);
  }
}
missing.sort();
for (const m of missing) {
  assetsLines.push(`- \`assets/${m}\``);
}

writeFileSync(resolve(ASSETS, "INDEX.md"), assetsLines.join("\n"));

console.log("OK:");
console.log(`  INDEX.md           ${sortedClassNames.length} clases listadas`);
console.log(`  MODULES.md         ${files.length} archivos catalogados`);
console.log(`  assets/INDEX.md    ${assetFiles.length} assets, ${missing.length} en wishlist`);
