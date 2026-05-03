#!/usr/bin/env node
/*
 * fix-patrones.mjs — añade SHARED faltantes a `Patrones aplicados:` /
 * `Patrones:` de cada HU detectada por audit-hu.mjs (D4).
 *
 * Es semi-idempotente: si la HU ya declara el SHARED, no hace nada.
 * Conserva el formato (largo o corto) que la HU ya use; si no tiene la
 * sección, la añade en formato corto al final del bloque.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = "/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2";
const AUDIT_JSON = join(ROOT, "AUDITORIA-CATEGORIAL-RESULTADO.json");

const audit = JSON.parse(readFileSync(AUDIT_JSON, "utf8"));
const fixes = audit.violaciones.filter((v) => v.id === "D4").map((v) => {
  const m = v.detalle.match(/HU-SHARED-\d+/);
  return { hu: v.hu, archivo: v.archivo, shared: m ? m[0] : null };
}).filter((f) => f.shared);

// Agrupar por archivo
const porArchivo = new Map();
for (const f of fixes) {
  if (!porArchivo.has(f.archivo)) porArchivo.set(f.archivo, []);
  porArchivo.get(f.archivo).push(f);
}

const epicasDir = join(ROOT, "epicas");
const sharedDir = join(ROOT, "shared");

function resolveArchivo(name) {
  if (name.startsWith("HU-SHARED-")) return join(sharedDir, name);
  return join(epicasDir, name);
}

let totalEditadas = 0;

for (const [archivo, lista] of porArchivo) {
  const path = resolveArchivo(archivo);
  let contenido = readFileSync(path, "utf8");
  // Por HU, agrupamos los shared a añadir
  const porHU = new Map();
  for (const f of lista) {
    if (!porHU.has(f.hu)) porHU.set(f.hu, []);
    porHU.get(f.hu).push(f.shared);
  }

  for (const [hu, sharedToAdd] of porHU) {
    const huHeaderRe = new RegExp(`^### ${hu.replace(".", "\\.")}\\b[^\\n]*$`, "m");
    const headerMatch = contenido.match(huHeaderRe);
    if (!headerMatch) {
      console.warn(`  ${archivo}: HU ${hu} no encontrada (header)`);
      continue;
    }
    const startIdx = headerMatch.index;
    // Buscar el final del bloque HU: el siguiente `### HU-` o `---` final del archivo o `## ` mayor.
    const endRe = /^(?:### HU-|---\s*$|## )/m;
    const tail = contenido.slice(startIdx + headerMatch[0].length);
    const endMatch = tail.match(endRe);
    const endIdx = endMatch ? startIdx + headerMatch[0].length + endMatch.index : contenido.length;
    let bloque = contenido.slice(startIdx, endIdx);

    // Detectar formato existente: **Patrones aplicados:** o **Patrones:**
    const patRe = /(\*\*Patrones(?:\s+aplicados)?:\*\*\s*)([\s\S]*?)(?=\n\*\*[A-Z]|\n###|\n## |$)/i;
    const patMatch = bloque.match(patRe);

    if (patMatch) {
      const cuerpoPatrones = patMatch[2];
      const yaPresente = sharedToAdd.filter((s) => cuerpoPatrones.includes(s));
      const aAgregar = sharedToAdd.filter((s) => !yaPresente.includes(s));
      if (aAgregar.length === 0) continue;
      // Si el formato es lista con guiones (- HU-SHARED-...), añadir como nuevos guiones.
      const tieneGuiones = /^\s*-\s+HU-SHARED-/m.test(cuerpoPatrones);
      let nuevoCuerpo = cuerpoPatrones;
      if (tieneGuiones) {
        // Asegurar terminación con newline
        if (!nuevoCuerpo.endsWith("\n")) nuevoCuerpo += "\n";
        for (const s of aAgregar) nuevoCuerpo += `- ${s} (mecánica detectada por audit-hu.mjs).\n`;
        // Limpiar dobles \n
        nuevoCuerpo = nuevoCuerpo.replace(/\n{3,}/g, "\n\n");
      } else {
        // Formato corto: una línea con SHARED separados por coma
        // Ej: HU-SHARED-001, HU-SHARED-002, HU-SHARED-007.
        const trimmed = nuevoCuerpo.trim();
        const sinPunto = trimmed.replace(/\.\s*$/, "");
        nuevoCuerpo = (sinPunto ? sinPunto + ", " : "") + aAgregar.join(", ") + ".\n";
      }
      const nuevoBloque = bloque.replace(patRe, `$1${nuevoCuerpo}`);
      contenido = contenido.slice(0, startIdx) + nuevoBloque + contenido.slice(endIdx);
      totalEditadas += aAgregar.length;
    } else {
      // No tiene sección — intentamos insertar antes del primer "anchor" disponible.
      // Para formato canónico (§6): antes de **Dependencias:**.
      // Para formato compacto: antes de **Deps:**, **Prioridad:**, **Tamaño:** o **Etiquetas:**.
      const anchorsRe = [
        /(\*\*Dependencias:\*\*)/,
        /(\*\*Deps:\*\*)/,
        /(\*\*Prioridad:\*\*)/,
        /(\*\*Tamaño:\*\*)/,
        /(\*\*Etiquetas:\*\*)/,
      ];
      let inserted = false;
      for (const re of anchorsRe) {
        if (re.test(bloque)) {
          // Detectar si es formato compacto (texto en línea con `**Campo:**` repetidos)
          const compacto = /\*\*[A-Z][^:*]*:\*\*[^\n]*\*\*[A-Z]/.test(bloque);
          const sharedListado = sharedToAdd.join(", ");
          const insercion = compacto
            ? ` **Patrones:** ${sharedListado} (mecánica detectada por audit-hu.mjs). `
            : `**Patrones aplicados:**\n${sharedToAdd.map((s) => `- ${s} (mecánica detectada por audit-hu.mjs).`).join("\n")}\n\n`;
          bloque = bloque.replace(re, insercion + "$1");
          contenido = contenido.slice(0, startIdx) + bloque + contenido.slice(endIdx);
          totalEditadas += sharedToAdd.length;
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        console.warn(`  ${archivo}: HU ${hu} sin anchor detectable; saltado.`);
      }
    }
  }

  writeFileSync(path, contenido);
}

console.log(`fix-patrones: ${totalEditadas} entradas SHARED añadidas.`);
