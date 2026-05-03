#!/usr/bin/env bun
/**
 * grafo-dependencias.ts — genera grafo de dependencias del inventario v2.
 *
 * Salidas:
 *   - tools/grafo-deps-epicas.dot        : grafo inter-épica (nodos = épicas).
 *   - tools/grafo-deps-detalle.dot       : grafo intra-HU completo.
 *   - tools/metricas-centralidad.md      : reporte de centralidad por épica.
 *
 * Uso:
 *   bun run docs/historias-usuario-v2/tools/grafo-dependencias.ts
 *   dot -Tsvg tools/grafo-deps-epicas.dot -o tools/grafo-deps-epicas.svg
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = "/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2";
const OUT_EPICAS = join(ROOT, "tools/grafo-deps-epicas.dot");
const OUT_DETALLE = join(ROOT, "tools/grafo-deps-detalle.dot");
const OUT_METRICAS = join(ROOT, "tools/metricas-centralidad.md");

interface HUNode {
  id: string;
  archivo: string;
  epica: string;
  prioridad: string;
  tipo: string;
  estado: "viva" | "absorbida" | "fusionada";
  bloqueadaPor: string[];
}

function epicaDeId(id: string): string {
  const m = id.match(/^HU-([A-Z0-9]+(?:-[A-Z0-9]+)?)\.\d+$/);
  return m ? m[1] : "?";
}

function colorPrioridad(p: string): string {
  return (
    {
      M0: "#d43f3a",
      M1: "#f0ad4e",
      S: "#5cb85c",
      C: "#5bc0de",
      W: "#999999",
    }[p] || "#cccccc"
  );
}

function leerHUs(): HUNode[] {
  const hus: HUNode[] = [];
  const dirs = ["epicas", "shared"];
  for (const d of dirs) {
    const archivos = readdirSync(join(ROOT, d))
      .filter(f => f.endsWith(".md"))
      .map(f => join(ROOT, d, f));
    for (const archivo of archivos) {
      const contenido = readFileSync(archivo, "utf8");
      const lineas = contenido.split("\n");
      let actual: { id: string; cuerpo: string[] } | null = null;
      const cierraHU = () => {
        if (!actual) return;
        const cuerpo = actual.cuerpo.join("\n");
        let estado: "viva" | "absorbida" | "fusionada" = "viva";
        if (/\[absorbida en/i.test(actual.cuerpo[0]) || /\*\*Estado:\*\*\s*absorbida/i.test(cuerpo)) estado = "absorbida";
        else if (/\[fusionada en/i.test(actual.cuerpo[0]) || /\*\*Estado:\*\*\s*fusionada/i.test(cuerpo)) estado = "fusionada";

        const bloqueadaPor: string[] = [];
        for (const m of cuerpo.matchAll(/\*\*(?:Bloqueada por|Deps):\*\*\s*([^\n]+)/g)) {
          for (const id of m[1].matchAll(/HU-[A-Z0-9]+(?:-[A-Z0-9]+)?\.\d+/g)) {
            if (!bloqueadaPor.includes(id[0])) bloqueadaPor.push(id[0]);
          }
        }

        const prioridad = (cuerpo.match(/\*\*Prioridad:\*\*\s*([A-Z][0-9]?)/) ?? [, ""])[1];
        const tipo = (cuerpo.match(/\*\*Tipo:\*\*\s*([a-zA-Z\-]+)/) ?? [, ""])[1];

        hus.push({
          id: actual.id,
          archivo,
          epica: epicaDeId(actual.id),
          prioridad,
          tipo,
          estado,
          bloqueadaPor,
        });
        actual = null;
      };
      for (const linea of lineas) {
        const m = linea.match(/^### (HU-[A-Z0-9]+(?:-[A-Z0-9]+)?\.\d+)\s+—/);
        if (m) {
          cierraHU();
          actual = { id: m[1], cuerpo: [linea] };
        } else if (actual) {
          actual.cuerpo.push(linea);
        }
      }
      cierraHU();
    }
  }
  return hus;
}

function generarGrafoEpicas(hus: HUNode[]): string {
  const epicaToHUs = new Map<string, HUNode[]>();
  for (const hu of hus) {
    if (hu.estado !== "viva") continue;
    const k = hu.epica;
    if (!epicaToHUs.has(k)) epicaToHUs.set(k, []);
    epicaToHUs.get(k)!.push(hu);
  }

  // Conteo de aristas inter-épica
  const aristas = new Map<string, number>();
  for (const hu of hus) {
    if (hu.estado !== "viva") continue;
    for (const dep of hu.bloqueadaPor) {
      const epicaDep = epicaDeId(dep);
      if (epicaDep === hu.epica) continue;
      const k = `${hu.epica}→${epicaDep}`;
      aristas.set(k, (aristas.get(k) ?? 0) + 1);
    }
  }

  const lineas: string[] = [];
  lineas.push("digraph epicas {");
  lineas.push('  rankdir=LR;');
  lineas.push('  node [shape=box, style=rounded, fontname="Arial"];');
  lineas.push('  edge [fontname="Arial", fontsize=9];');
  for (const [epica, lista] of epicaToHUs) {
    const prio = lista[0]?.prioridad || "?";
    const color = colorPrioridad(prio);
    lineas.push(
      `  "EPICA-${epica}" [label="EPICA-${epica}\\n${lista.length} HU\\n${prio}", fillcolor="${color}", style="filled,rounded"];`
    );
  }
  for (const [k, cuenta] of aristas) {
    const [from, to] = k.split("→");
    const peso = Math.min(8, 1 + Math.floor(cuenta / 3));
    lineas.push(`  "EPICA-${from}" -> "EPICA-${to}" [label="${cuenta}", penwidth=${peso}];`);
  }
  lineas.push("}");
  return lineas.join("\n");
}

function generarGrafoDetalle(hus: HUNode[]): string {
  const lineas: string[] = [];
  lineas.push("digraph hu_detalle {");
  lineas.push('  rankdir=LR;');
  lineas.push('  node [shape=box, fontsize=8, fontname="Arial"];');
  lineas.push('  edge [fontname="Arial", fontsize=7];');

  // Agrupar por épica con subgraph cluster
  const epicaToHUs = new Map<string, HUNode[]>();
  for (const hu of hus) {
    if (!epicaToHUs.has(hu.epica)) epicaToHUs.set(hu.epica, []);
    epicaToHUs.get(hu.epica)!.push(hu);
  }
  let i = 0;
  for (const [epica, lista] of epicaToHUs) {
    lineas.push(`  subgraph cluster_${i++} {`);
    lineas.push(`    label="EPICA-${epica}";`);
    lineas.push(`    style="rounded";`);
    lineas.push(`    bgcolor="#f5f5f5";`);
    for (const hu of lista) {
      const color = hu.estado === "viva" ? colorPrioridad(hu.prioridad) : "#dddddd";
      const fontcolor = hu.estado === "viva" ? "white" : "#888888";
      const label = `${hu.id}\\n${hu.prioridad}`;
      lineas.push(`    "${hu.id}" [label="${label}", fillcolor="${color}", style="filled", fontcolor="${fontcolor}"];`);
    }
    lineas.push(`  }`);
  }
  for (const hu of hus) {
    if (hu.estado !== "viva") continue;
    for (const dep of hu.bloqueadaPor) {
      lineas.push(`  "${hu.id}" -> "${dep}";`);
    }
  }
  lineas.push("}");
  return lineas.join("\n");
}

function generarMetricas(hus: HUNode[]): string {
  const epicaToHUs = new Map<string, HUNode[]>();
  for (const hu of hus) {
    if (!epicaToHUs.has(hu.epica)) epicaToHUs.set(hu.epica, []);
    epicaToHUs.get(hu.epica)!.push(hu);
  }

  // In-degree y out-degree por épica
  const inDeg = new Map<string, number>();
  const outDeg = new Map<string, number>();
  for (const e of epicaToHUs.keys()) {
    inDeg.set(e, 0);
    outDeg.set(e, 0);
  }
  for (const hu of hus) {
    if (hu.estado !== "viva") continue;
    for (const dep of hu.bloqueadaPor) {
      const eDep = epicaDeId(dep);
      if (eDep === hu.epica) continue;
      outDeg.set(hu.epica, (outDeg.get(hu.epica) ?? 0) + 1);
      inDeg.set(eDep, (inDeg.get(eDep) ?? 0) + 1);
    }
  }

  const filas: Array<{
    epica: string;
    hu_total: number;
    hu_viva: number;
    in: number;
    out: number;
    centralidad: number;
  }> = [];
  for (const [epica, lista] of epicaToHUs) {
    const viva = lista.filter(h => h.estado === "viva").length;
    const ind = inDeg.get(epica) ?? 0;
    const outd = outDeg.get(epica) ?? 0;
    filas.push({
      epica,
      hu_total: lista.length,
      hu_viva: viva,
      in: ind,
      out: outd,
      centralidad: ind + outd,
    });
  }
  filas.sort((a, b) => b.centralidad - a.centralidad);

  const lineas: string[] = [];
  lineas.push("# Métricas de centralidad por épica");
  lineas.push("");
  lineas.push("Generado por `tools/grafo-dependencias.ts`. Mide la posición estructural de cada épica.");
  lineas.push("");
  lineas.push("- **In-degree**: cantidad de HU canónicas de otras épicas que dependen de esta épica (cuántas épicas la requieren).");
  lineas.push("- **Out-degree**: cantidad de dependencias hacia HU de otras épicas (cuántas épicas requiere).");
  lineas.push("- **Centralidad** = in + out: importancia estructural total. Top centralidad = candidatas a *God Épica*.");
  lineas.push("");
  lineas.push("| # | Épica | HU vivas | In | Out | Centralidad |");
  lineas.push("|---|---|---:|---:|---:|---:|");
  filas.forEach((f, i) => {
    lineas.push(`| ${i + 1} | EPICA-${f.epica} | ${f.hu_viva} | ${f.in} | ${f.out} | ${f.centralidad} |`);
  });

  const top = filas.slice(0, 5);
  lineas.push("");
  lineas.push("## Top 5 — análisis cualitativo");
  lineas.push("");
  for (const f of top) {
    lineas.push(`- **EPICA-${f.epica}** (centralidad ${f.centralidad}): in=${f.in}, out=${f.out}.`);
    if (f.in > 20) lineas.push(`  - Alta in-degree: muchas épicas dependen de ella → bloqueador crítico del roadmap.`);
    if (f.out > 20) lineas.push(`  - Alta out-degree: requiere muchas otras → posible *God Épica*; revisar factorización.`);
  }
  lineas.push("");
  lineas.push("## Lectura categorial");
  lineas.push("");
  lineas.push("- Centralidad alta con in >> out = **objeto cercano a inicial** del poset (todas dependen de él).");
  lineas.push("- Centralidad alta con out >> in = **objeto cercano a terminal** (depende de todo lo demás).");
  lineas.push("- in = out alto = **épica densamente conectada**: candidata a structured cospan con interfaces compartidas (`urn:fxsl:kb:icas-escala`).");
  return lineas.join("\n");
}

function main(): void {
  const hus = leerHUs();
  console.log(`HUs detectadas: ${hus.length}`);

  const dotEpicas = generarGrafoEpicas(hus);
  writeFileSync(OUT_EPICAS, dotEpicas);
  console.log(`Grafo épicas → ${basename(OUT_EPICAS)}`);

  const dotDetalle = generarGrafoDetalle(hus);
  writeFileSync(OUT_DETALLE, dotDetalle);
  console.log(`Grafo detalle → ${basename(OUT_DETALLE)}`);

  const metricas = generarMetricas(hus);
  writeFileSync(OUT_METRICAS, metricas);
  console.log(`Métricas → ${basename(OUT_METRICAS)}`);
}

main();
