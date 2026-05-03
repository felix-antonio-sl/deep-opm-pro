#!/usr/bin/env bun
/**
 * audit-migracion.ts — auditoría drift v1 → v2.
 *
 * Compara los IDs HU del v1 archivado con el v2 actual y reporta:
 *   - HU del v1 con contraparte canónica viva en v2.
 *   - HU del v1 con stub explícito en v2 (absorbida o fusionada).
 *   - HU del v1 sin contraparte detectable (fugas de migración).
 *
 * Salida: tools/reporte-migracion.md
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT_V2 = "/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2";
const ROOT_V1 = "/home/felix/projects/deep-opm-pro/docs/archive/historias-usuario-v1";
const OUT = join(ROOT_V2, "tools/reporte-migracion.md");

interface IdsPorEstado {
  vivas: Set<string>;
  stubs: Set<string>;
}

function recolectarV2(): IdsPorEstado {
  const vivas = new Set<string>();
  const stubs = new Set<string>();
  const archivos = [...readdirSync(join(ROOT_V2, "epicas")), ...readdirSync(join(ROOT_V2, "shared"))];
  for (const f of archivos) {
    if (!f.endsWith(".md")) continue;
    const dir = existsSync(join(ROOT_V2, "epicas", f)) ? "epicas" : "shared";
    const contenido = readFileSync(join(ROOT_V2, dir, f), "utf8");
    const lineas = contenido.split("\n");
    let actual: { id: string; cuerpo: string[] } | null = null;
    const cierra = () => {
      if (!actual) return;
      const cuerpo = actual.cuerpo.join("\n");
      let estado: "viva" | "absorbida" | "fusionada" = "viva";
      if (/\[absorbida en/i.test(actual.cuerpo[0]) || /\*\*Estado:\*\*\s*absorbida/i.test(cuerpo)) estado = "absorbida";
      else if (/\[fusionada en/i.test(actual.cuerpo[0]) || /\*\*Estado:\*\*\s*fusionada/i.test(cuerpo)) estado = "fusionada";
      if (estado === "viva") vivas.add(actual.id);
      else stubs.add(actual.id);
      actual = null;
    };
    for (const linea of lineas) {
      const m = linea.match(/^### (HU-[A-Z0-9]+(?:-[A-Z0-9]+)?\.\d+)\s+—/);
      if (m) {
        cierra();
        actual = { id: m[1], cuerpo: [linea] };
      } else if (actual) {
        actual.cuerpo.push(linea);
      }
    }
    cierra();
  }
  return { vivas, stubs };
}

function recolectarV1(): Set<string> {
  if (!existsSync(ROOT_V1)) return new Set();
  const ids = new Set<string>();
  const archivos = readdirSync(ROOT_V1).filter(f => f.startsWith("epica-") && f.endsWith(".md"));
  for (const f of archivos) {
    const contenido = readFileSync(join(ROOT_V1, f), "utf8");
    for (const m of contenido.matchAll(/^### (HU-[A-Z0-9]+(?:-[A-Z0-9]+)?\.\d+)\s+—/gm)) {
      ids.add(m[1]);
    }
  }
  return ids;
}

function main(): void {
  const v2 = recolectarV2();
  const v1 = recolectarV1();

  // Clasificación
  const conContrapartViva: string[] = [];
  const conStub: string[] = [];
  const huerfanas: string[] = [];

  for (const id of v1) {
    if (v2.vivas.has(id)) conContrapartViva.push(id);
    else if (v2.stubs.has(id)) conStub.push(id);
    else huerfanas.push(id);
  }

  // IDs introducidos en v2 (no en v1)
  const introducidasV2: string[] = [];
  for (const id of v2.vivas) {
    if (!v1.has(id) && !id.startsWith("HU-SHARED-")) introducidasV2.push(id);
  }

  conContrapartViva.sort();
  conStub.sort();
  huerfanas.sort();
  introducidasV2.sort();

  // Reporte
  const lineas: string[] = [];
  lineas.push("# Auditoría de migración v1 → v2");
  lineas.push("");
  lineas.push("Generada por `tools/audit-migracion.ts`. Lee `docs/archive/historias-usuario-v1/` y compara con `historias-usuario-v2/`.");
  lineas.push("");
  lineas.push("## 1. Resumen cuantitativo");
  lineas.push("");
  lineas.push("| Métrica | Valor |");
  lineas.push("|---|---:|");
  lineas.push(`| HU en v1 | ${v1.size} |`);
  lineas.push(`| HU canónicas vivas en v2 | ${v2.vivas.size} |`);
  lineas.push(`| Stubs en v2 (absorbidas/fusionadas) | ${v2.stubs.size} |`);
  lineas.push(`| v1 con canónica viva en v2 | ${conContrapartViva.length} |`);
  lineas.push(`| v1 con stub en v2 | ${conStub.length} |`);
  lineas.push(`| v1 sin contraparte detectable (huérfanas) | ${huerfanas.length} |`);
  lineas.push(`| Nuevas en v2 (no en v1, ex. shared) | ${introducidasV2.length} |`);
  lineas.push("");

  // Cobertura por épica
  const cobertura = new Map<string, { v1: number; vivas: number; stubs: number; huerfanas: number }>();
  const epicaDe = (id: string) => id.match(/^HU-([A-Z0-9]+(?:-[A-Z0-9]+)?)\.\d+$/)?.[1] ?? "?";
  for (const id of v1) {
    const e = epicaDe(id);
    if (!cobertura.has(e)) cobertura.set(e, { v1: 0, vivas: 0, stubs: 0, huerfanas: 0 });
    const c = cobertura.get(e)!;
    c.v1++;
    if (v2.vivas.has(id)) c.vivas++;
    else if (v2.stubs.has(id)) c.stubs++;
    else c.huerfanas++;
  }

  lineas.push("## 2. Cobertura por épica");
  lineas.push("");
  lineas.push("| Épica | v1 | viva | stub | huérfana | cobertura% |");
  lineas.push("|---|---:|---:|---:|---:|---:|");
  const epicas = Array.from(cobertura.keys()).sort();
  for (const e of epicas) {
    const c = cobertura.get(e)!;
    const cob = Math.round(((c.vivas + c.stubs) / c.v1) * 100);
    lineas.push(`| EPICA-${e} | ${c.v1} | ${c.vivas} | ${c.stubs} | ${c.huerfanas} | ${cob}% |`);
  }
  lineas.push("");

  if (huerfanas.length > 0) {
    lineas.push("## 3. HU huérfanas — sin contraparte detectable");
    lineas.push("");
    lineas.push("Estas HU del v1 no aparecen como canónicas vivas ni como stubs en v2. Posibles razones:");
    lineas.push("- Absorción inline sin marcar (la HU está cubierta por otra canónica que la cita pero no se generó stub).");
    lineas.push("- Fusión sin documentar.");
    lineas.push("- Olvido en la migración.");
    lineas.push("");
    lineas.push("Lista completa:");
    lineas.push("");
    for (const id of huerfanas) lineas.push(`- ${id}`);
    lineas.push("");
  } else {
    lineas.push("## 3. HU huérfanas");
    lineas.push("");
    lineas.push("**No hay HU huérfanas detectadas.** Toda HU del v1 tiene contraparte canónica o stub en v2.");
    lineas.push("");
  }

  if (introducidasV2.length > 0) {
    lineas.push("## 4. HU nuevas en v2 (no presentes en v1)");
    lineas.push("");
    for (const id of introducidasV2) lineas.push(`- ${id}`);
    lineas.push("");
  }

  lineas.push("## 5. Lectura categorial");
  lineas.push("");
  lineas.push("La migración v1 → v2 es un funtor `Migrate: SpecV1 → SpecV2` (`urn:fxsl:kb:icas-lifecycle`).");
  lineas.push("Una HU huérfana indica falla de naturalidad: el funtor no preservó el morfismo correspondiente.");
  lineas.push("Cobertura del 100% (vivas + stubs) por épica = funtor faithful sobre esa épica.");

  writeFileSync(OUT, lineas.join("\n"));
  console.log(`Reporte → ${basename(OUT)}`);
  console.log(`v1: ${v1.size}, v2 vivas: ${v2.vivas.size}, stubs: ${v2.stubs.size}`);
  console.log(`Huérfanas: ${huerfanas.length}, nuevas v2: ${introducidasV2.length}`);
}

main();
