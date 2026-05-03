#!/usr/bin/env node
/*
 * extract.mjs
 *
 * Splitter exhaustivo de los módulos OPM (./src/app/...) presentes en los
 * archivos decompilados de OPCloud. Lee fuentes (deobfuscated.js + chunks
 * pequeños), localiza marcadores `// CONCATENATED MODULE: <path>`, y emite
 * un archivo por path bajo opm-extracted/src/.
 *
 * Reglas:
 *  - Solo procesa marcadores cuyo path comienza con ./src/ (ignora node_modules,
 *    rappid, polyfills, runtime).
 *  - Si dos fuentes producen el mismo path, gana la versión más larga (más
 *    completa). Reporta colisiones en _index.json.
 *  - Limpieza inicial mínima: elimina la indentación uniforme del closure webpack
 *    (detectada por el indent del propio marcador) y comentarios `/* harmony ... *\/`.
 *  - No reescribe `__webpack_require__(N)` aún — eso es la fase 2 (refactor.mjs).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DEC = resolve(ROOT, "..", "decompiled");
const OUT_SRC = resolve(ROOT, "src");
const OUT_INDEX = resolve(ROOT, "src", "_index.json");

const SOURCES = [
  // Mina principal: 344 módulos OPM concatenados.
  "deobfuscated.js",
  // Chunk principal de la app Angular: contiene 282 módulos OPM mezclados con libs.
  "37084.js",
  // Chunks pequeños lazy-loaded.
  "1185.js", "14898.js", "26692.js", "29007.js", "2839.js", "3037.js",
  "43894.js", "54695.js", "68506.js", "71252.js", "81330.js", "84072.js",
  "86922.js", "91886.js",
];

const MARKER = /^(\s*);?\s*\/\/ CONCATENATED MODULE:\s+(\S+)\s*$/;

function readAllMarkers(filename, content) {
  const lines = content.split("\n");
  const markers = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(MARKER);
    if (m) markers.push({ line: i, indent: m[1].length, path: m[2], file: filename });
  }
  return { lines, markers };
}

function pickIndentToStrip(blockLines) {
  // Toma el menor indent de líneas no vacías; corresponde al indent común del
  // closure webpack (suele ser 4 espacios; en deobfuscated.js puede ser 6 en
  // bloques anidados). Eso es lo que queremos sacar como cero-indent.
  let min = Infinity;
  for (const ln of blockLines) {
    if (!ln.trim()) continue;
    const m = ln.match(/^(\s*)/);
    const ind = m ? m[1].length : 0;
    if (ind < min) min = ind;
  }
  return min === Infinity ? 0 : min;
}

function stripWebpackNoise(text) {
  return text
    // Comentarios harmony import/export sueltos en una línea
    .replace(/^\s*\/\* harmony (import|export|default export|reexport.*?) \*\/\s*$/gm, "")
    // Comentarios harmony en línea
    .replace(/\/\* harmony (import|export|default export|reexport[^*]*) \*\//g, "")
    // unused harmony exports listados
    .replace(/^\s*\/\* unused harmony export[s]? .*? \*\/\s*$/gm, "")
    // EXPORTS y UNUSED EXPORTS bloques que webcrack pone arriba
    .replace(/^\s*\/\/ EXPORTS\s*$/gm, "")
    .replace(/^\s*\/\/ UNUSED EXPORTS:.*$/gm, "")
    // EXTERNAL MODULE comments — los consolidamos pero los sacamos del cuerpo
    .replace(/^\s*\/\/ EXTERNAL MODULE:.*$/gm, "")
    // sourceMappingURL comments
    .replace(/^\s*\/\/[#@]\s*sourceMappingURL=.*$/gm, "")
    // Dejar al menos una línea en blanco entre bloques colapsados
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\n+/, "")
    .replace(/\n+$/, "\n");
}

const collected = new Map(); // path -> { body, source, byteLength }
const collisions = []; // [{ path, kept, dropped, kept_size, dropped_size }]

for (const filename of SOURCES) {
  const fpath = join(DEC, filename);
  if (!existsSync(fpath)) {
    console.warn(`  saltando (no existe): ${filename}`);
    continue;
  }
  const content = readFileSync(fpath, "utf8");
  const { lines, markers } = readAllMarkers(filename, content);
  if (!markers.length) continue;

  // Tomamos sólo paths ./src/* (incluye ./src/app/* y ./src/environments/*)
  const opmMarkers = markers.filter((m) => m.path.startsWith("./src/"));
  if (!opmMarkers.length) continue;

  for (let i = 0; i < markers.length; i++) {
    const m = markers[i];
    if (!m.path.startsWith("./src/")) continue;
    const next = markers[i + 1];
    const startLine = m.line + 1; // contenido empieza después del marker
    let endLine = next ? next.line : lines.length; // no incluye next

    // Retroceder mientras la última línea sea preámbulo del siguiente módulo:
    //   `// EXTERNAL MODULE: ...`, `import * as X from "..."`, `import X from "..."`,
    //   o líneas vacías/`;` huérfanos. Esto saca el preludio del módulo siguiente
    //   que webpack inserta justo antes del próximo `; // CONCATENATED MODULE`.
    while (endLine > startLine + 1) {
      const ln = lines[endLine - 1].trim();
      if (
        ln === "" ||
        ln === ";" ||
        /^\/\/\s*EXTERNAL MODULE:/i.test(ln) ||
        /^import\s+(?:\*\s+as\s+)?[A-Za-z_$][\w$]*(?:\s*,\s*\{[^}]*\})?\s+from\s+["'`][^"'`]+["'`];?(?:\s*\/\/.*)?$/i.test(ln) ||
        /^import\s+\{[^}]*\}\s+from\s+["'`][^"'`]+["'`];?(?:\s*\/\/.*)?$/i.test(ln)
      ) {
        endLine--;
        continue;
      }
      break;
    }
    const blockLines = lines.slice(startLine, endLine);
    const indent = pickIndentToStrip(blockLines);
    const stripped = blockLines
      .map((ln) => ln.length >= indent && /^\s/.test(ln) ? ln.slice(indent) : ln)
      .join("\n");
    const cleaned = stripWebpackNoise(stripped);

    // Normalizar path: ./src/app/foo.ts -> app/foo.ts (bajo opm-extracted/src/)
    let outRel = m.path.replace(/^\.\/src\//, "");
    // Algunos paths apuntan a archivos no .ts/.js — añadir .ts si falta
    if (!/\.(ts|js|mjs|cjs|json)$/.test(outRel)) outRel += ".ts";

    const prev = collected.get(outRel);
    const size = cleaned.length;
    if (!prev || size > prev.byteLength) {
      if (prev) {
        collisions.push({
          path: outRel,
          kept_source: filename,
          kept_size: size,
          dropped_source: prev.source,
          dropped_size: prev.byteLength,
        });
      }
      collected.set(outRel, { body: cleaned, source: filename, byteLength: size });
    } else if (size > 0 && size !== prev.byteLength) {
      collisions.push({
        path: outRel,
        kept_source: prev.source,
        kept_size: prev.byteLength,
        dropped_source: filename,
        dropped_size: size,
      });
    }
  }
}

// Escribir archivos
const writtenIndex = [];
for (const [outRel, entry] of [...collected.entries()].sort()) {
  const outPath = join(OUT_SRC, outRel);
  mkdirSync(dirname(outPath), { recursive: true });
  // Anteponer encabezado de procedencia
  const header = `// Source: decompiled/${entry.source}\n// Original path: ./src/${outRel.replace(/\.(ts|js)$/, (s) => outRel.endsWith(".ts") || outRel.endsWith(".js") ? s : "")}\n// Extracted by opm-extracted/tools/extract.mjs\n\n`;
  writeFileSync(outPath, header + entry.body);
  writtenIndex.push({ path: outRel, source: entry.source, bytes: entry.byteLength });
}

const indexPayload = {
  generated_at: new Date().toISOString(),
  tool: "opm-extracted/tools/extract.mjs",
  total_files: writtenIndex.length,
  total_bytes: writtenIndex.reduce((a, b) => a + b.bytes, 0),
  collisions_resolved_by_size: collisions.length,
  files: writtenIndex,
  collisions,
};
mkdirSync(dirname(OUT_INDEX), { recursive: true });
writeFileSync(OUT_INDEX, JSON.stringify(indexPayload, null, 2));

console.log(`OK: ${writtenIndex.length} archivos OPM emitidos (${(indexPayload.total_bytes / 1024).toFixed(1)} KiB).`);
console.log(`Colisiones resueltas: ${collisions.length}. Index: src/_index.json`);
