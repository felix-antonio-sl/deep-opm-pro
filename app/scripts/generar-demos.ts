#!/usr/bin/env bun

/**
 * Generador de fixtures demo desde el kernel del modelo.
 * Ejecutar: cd app && bun run scripts/generar-demos.ts
 * Salida: fixtures/demo-models/ (desde raiz del repo)
 *         app/examples/ejemplo-organizacional.json (asset publico)
 */

import { exportarModelo } from "../src/serializacion/json";
import { crearEjemploOrganizacional, fixtureTodos } from "../src/modelo/fixtures";
import { generarOplTexto } from "../src/modelo/opl/generador-opl";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = join(import.meta.dir, "..", "..", "fixtures", "demo-models");
const EXAMPLE_DIR = join(import.meta.dir, "..", "examples");

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(EXAMPLE_DIR, { recursive: true });

const modelos = fixtureTodos();
let creados = 0;

for (const fixture of modelos) {
  const safeName = fixture.modelo.nombre
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "");

  const json = exportarModelo(fixture.modelo);
  const opl = generarOplTexto(fixture.modelo);

  const readme = [
    `# ${fixture.modelo.nombre}`,
    "",
    `**Propósito:** ${fixture.proposito}`,
    "",
    `**Descripción:** ${fixture.descripcion}`,
    "",
    `**OPDs:** ${Object.values(fixture.modelo.opds).map((o) => o.nombre).join(", ")}`,
    `**Entidades:** ${Object.keys(fixture.modelo.entidades).length}`,
    `**Enlaces:** ${Object.keys(fixture.modelo.enlaces).length}`,
    `**Estados:** ${Object.keys(fixture.modelo.estados ?? {}).length}`,
    "",
    "## OPL-ES",
    "",
    "```",
    opl.trim(),
    "```",
  ].join("\n");

  writeFileSync(join(OUT_DIR, `${safeName}.json`), json, "utf-8");
  writeFileSync(join(OUT_DIR, `${safeName}.opl.txt`), opl, "utf-8");
  writeFileSync(join(OUT_DIR, `${safeName}.md`), readme, "utf-8");

  console.log(`✓ ${fixture.modelo.nombre} → ${safeName}.json, ${safeName}.opl.txt, ${safeName}.md`);
  creados++;
}

const ejemploOrg = crearEjemploOrganizacional();
const ejemploJson = exportarModelo(ejemploOrg.modelo);
writeFileSync(join(EXAMPLE_DIR, "ejemplo-organizacional.json"), ejemploJson, "utf-8");
const ejemploOpl = generarOplTexto(ejemploOrg.modelo);
writeFileSync(join(EXAMPLE_DIR, "ejemplo-organizacional.opl.txt"), ejemploOpl, "utf-8");
creados++;

console.log(`✓ Ejemplo organizacional → app/examples/ejemplo-organizacional.json`);
console.log(`\nGenerados ${creados} artefactos (${modelos.length} fixtures + ejemplo organizacional)`);
