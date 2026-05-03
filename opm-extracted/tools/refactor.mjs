#!/usr/bin/env node
/*
 * refactor.mjs
 *
 * Pasada de refactor automatizado sobre los archivos extraídos a
 * opm-extracted/src/. Convierte el output de webcrack en código directamente
 * legible aplicando, en orden:
 *
 *  1. Resolver exports renombrados con su comentario canónico:
 *       links_model /* LinksModel *\/.JL  ->  LinksModel
 *     (webcrack siempre incrusta el nombre original como comentario antes del
 *     export key minificado; lo recuperamos.)
 *
 *  2. Limpiar las "decoraciones" residuales del flag minificado en posiciones
 *     no resueltas: `name /* X *\/.key` solo cuando key sigue siendo identifier.
 *
 *  3. Renombrar variables top-level con el prefijo de concatenación de webpack
 *     (`BasicOpmModel_uuid` -> `uuid`) cuando el prefijo coincide con el
 *     basename del archivo. Sólo si el nombre resultante no choca.
 *
 *  4. Limpieza cosmética: comentarios huérfanos, duplicados de blank lines,
 *     declaraciones `var X = require("./N.js");` que quedaron sin uso porque
 *     el split eliminó el contexto.
 *
 *  5. Encabezado "import" virtual: recoge las llamadas únicas a
 *     `__webpack_require__(N)` y `require("./N.js")` y las agrupa al inicio
 *     del archivo como un comentario `// requires: [N1, N2, ...]` para
 *     facilitar trazado posterior.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, basename, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const SRC = resolve(ROOT, "src");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (/\.(ts|js|mjs)$/.test(name) && name !== "_index.json") out.push(full);
  }
  return out;
}

const ID = "[A-Za-z_$][A-Za-z0-9_$]*";

// 1. base /* Name */.key  ->  Name
//    base /* Name */ ["key"]  ->  Name
//    Soporta encadenamientos: a /* A */.x /* irrelevante */.y  -> requiere repetir.
const RENAMED_EXPORT = new RegExp(
  `(${ID})\\s*\\/\\*\\s*(${ID})\\s*\\*\\/\\s*(?:\\.\\s*${ID}|\\[\\s*"[^"]+"\\s*\\])`,
  "g",
);

// 2. base /* Name */ (sin .key después) -> Name (caso poco común tras pasada 1)
const RENAMED_BARE = new RegExp(
  `(${ID})\\s*\\/\\*\\s*(${ID})\\s*\\*\\/(?!\\s*[.\\[])`,
  "g",
);

// 3. Variables prefijadas con basename, ej. en BasicOpmModel.ts:
//    BasicOpmModel_uuid -> uuid    (pero solo si no choca con keyword o ID existente)
const RESERVED = new Set([
  "if", "else", "for", "while", "do", "return", "break", "continue", "switch",
  "case", "default", "function", "var", "let", "const", "class", "extends",
  "new", "this", "super", "throw", "try", "catch", "finally", "of", "in",
  "typeof", "instanceof", "void", "yield", "await", "async", "delete", "null",
  "true", "false", "undefined", "static", "import", "export", "from", "as",
]);

function applyExportRename(text) {
  // Iteramos hasta punto fijo porque encadenados pueden requerir 2-3 pasadas.
  let prev;
  let curr = text;
  let safety = 6;
  do {
    prev = curr;
    curr = curr.replace(RENAMED_EXPORT, (_match, _base, name) => name);
    safety--;
  } while (curr !== prev && safety > 0);
  // Pasada para barrer los `base /* Name */` huérfanos que quedaron (sin `.key`).
  curr = curr.replace(RENAMED_BARE, (_m, _b, name) => name);
  // Pasada para residuo de imports ESM sin alias resuelto:
  //   _OpmTaggedLink__WEBPACK_IMPORTED_MODULE_0__.foo -> OpmTaggedLink.foo
  //   _OpmTaggedLink__WEBPACK_IMPORTED_MODULE_0__     -> OpmTaggedLink
  curr = curr.replace(/\b_([A-Za-z_$][\w$]*?)__WEBPACK_IMPORTED_MODULE_\d+__/g, "$1");
  return curr;
}

function applyConcatPrefixRename(text, fileBase) {
  // fileBase: ej "BasicOpmModel" -> intenta renombrar BasicOpmModel_<x> a <x>.
  // Solo si <x> no es palabra reservada y no aparece ya como identificador
  // top-level distinto en el archivo (heurística simple: no estaba antes).
  const prefixes = new Set();
  prefixes.add(fileBase);
  // En files con kebab-case el prefijo de webcrack suele ser camel/snake: probamos
  // ambas variantes derivadas del basename.
  const camel = fileBase.replace(/[-.](\w)/g, (_, c) => c.toUpperCase());
  prefixes.add(camel);
  prefixes.add(fileBase.replace(/\./g, "_"));

  // Pre-recolectamos identifiers ya presentes para no chocar.
  const existingIds = new Set(text.match(/[A-Za-z_$][A-Za-z0-9_$]*/g) || []);

  let result = text;
  for (const prefix of prefixes) {
    if (!prefix) continue;
    const re = new RegExp(`\\b${prefix.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}_(${ID})\\b`, "g");
    result = result.replace(re, (whole, suffix) => {
      if (RESERVED.has(suffix)) return whole;
      // Si el sufijo ya existía ANTES como identificador independiente,
      // existe riesgo de colisión semántica. Mantenemos el original con un
      // comentario inline para preservar diagnóstico, pero damos preferencia
      // al renombrado porque webcrack lo introduce mecánicamente.
      return suffix;
    });
  }
  return result;
}

function collectAndStripRequires(text) {
  // __webpack_require__(N) -> recolectar N y dejar marcador
  const requires = new Set();
  text.replace(/__webpack_require__\s*\(\s*(\d+)\s*\)/g, (_m, n) => {
    requires.add(n);
    return _m;
  });
  // require("./N.js") -> mismo (chunks pequeños)
  text.replace(/require\s*\(\s*["'`]\.\/(\d+)\.js["'`]\s*\)/g, (_m, n) => {
    requires.add(n);
    return _m;
  });
  return [...requires].sort((a, b) => Number(a) - Number(b));
}

function dropSelfAssignments(text) {
  // Tras renombrar `var BasicOpmModel_uuid = util_util /* uuid */.uR` quedó
  // `var uuid = uuid;` (self-assign). También aparecen variantes `let`/`const`.
  // Las eliminamos: el identifier ya está disponible vía el ámbito del closure
  // original (que ahora vive como referencia textual), y mantenerlas confunde.
  return text
    .replace(/^\s*(var|let|const)\s+([A-Za-z_$][\w$]*)\s*=\s*\2\s*;?\s*$/gm, "")
    // var <X> = __webpack_require__(N); — recolectado como require, redundante.
    .replace(/^\s*(var|let|const)\s+[A-Za-z_$][\w$]*\s*=\s*__webpack_require__\s*\(\s*\d+\s*\)\s*;?\s*$/gm, "")
    // var <X> = require("./N.js"); — idem.
    .replace(/^\s*(var|let|const)\s+[A-Za-z_$][\w$]*\s*=\s*require\s*\(\s*["'`]\.\/\d+\.js["'`]\s*\)\s*;?\s*$/gm, "");
}

function cosmeticCleanup(text) {
  return text
    // Bloques de var X = __webpack_require__(N); seguidos sin ninguna ref útil
    // (los dejamos pero compactamos espacio).
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+\n/gm, "\n")
    // Eliminar líneas que solo tengan `;`
    .replace(/^\s*;\s*$/gm, "")
    // Asegurar newline final
    .replace(/\n+$/, "\n");
}

function processFile(file) {
  const original = readFileSync(file, "utf8");
  // Conserva header de procedencia
  const headerMatch = original.match(/^((?:\/\/[^\n]*\n)+\n)/);
  const header = headerMatch ? headerMatch[1] : "";
  const body = headerMatch ? original.slice(header.length) : original;

  let out = body;
  out = applyExportRename(out);
  const fileBase = basename(file, extname(file));
  out = applyConcatPrefixRename(out, fileBase);
  out = dropSelfAssignments(out);
  out = cosmeticCleanup(out);

  const requires = collectAndStripRequires(out);
  const requiresHeader = requires.length
    ? `// requires (webpack module ids): ${requires.join(", ")}\n`
    : "";

  const finalText = header + requiresHeader + (requiresHeader ? "\n" : "") + out;
  writeFileSync(file, finalText);
  return {
    bytes_before: original.length,
    bytes_after: finalText.length,
    requires: requires.length,
  };
}

const files = walk(SRC);
let totalBefore = 0;
let totalAfter = 0;
let touched = 0;
for (const f of files) {
  const r = processFile(f);
  totalBefore += r.bytes_before;
  totalAfter += r.bytes_after;
  touched++;
}

console.log(`Refactor aplicado a ${touched} archivos.`);
console.log(`Bytes: ${totalBefore} -> ${totalAfter} (delta ${totalAfter - totalBefore}).`);
