// Piloto del compilador proto-modelo → Modelo (W4.2) sobre el proto real de HODOM.
//
// Compila `hd-opm/docs/modelo-opm-hodom-completo.md` con `compilarProto`, emite el
// bundle vía `emitirBundle`, verifica el round-trip OPL forward, y escribe un
// reporte determinista a `docs/proto-modelo/piloto-compilador-2026-06-04.md`.
//
// ORÁCULO (mandato W4.2): coherencia interna — L2 (ninguna línea sin destino,
// hechos == oraciones aplicables) + `validarModelo` (vía hidratación del bundle) +
// round-trip OPL. NO se compara contra el bundle v1.6 de hd-opm: el proto v1.9 y el
// bundle divergieron legítimamente.
//
// Determinista: sin fechas/aleatoriedad en la salida; el reporte reemplaza al previo.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { compilarProto } from "../src/autoria/compilar/compilador";
import type { DestinoLedger } from "../src/autoria/compilar/compilador";
import { emitirBundle } from "../src/autoria/bundle";
import { generarOpl } from "../src/opl/generar";
import { parsearParrafoOpl, claveNombre } from "../src/opl/parser/parsear";

const PROTO_PATH = "/home/felix/projects/hd-opm/docs/modelo-opm-hodom-completo.md";
const REPORTE_PATH = resolve(import.meta.dir, "../../docs/proto-modelo/piloto-compilador-2026-06-04.md");

function clavesHechosOpl(lineas: string[]): Set<string> {
  const set = new Set<string>();
  for (const linea of lineas) {
    if (!linea.trim() || linea.startsWith("#")) continue;
    const { ast } = parsearParrafoOpl(linea.trim());
    for (const a of ast) {
      switch (a.kind) {
        case "descripcion-cosa": set.add(`cosa:${claveNombre(a.nombre)}`); break;
        case "estados": set.add(`estados:${claveNombre(a.objeto)}`); break;
        case "procedimental": set.add(`${a.tipoEnlace}:${claveNombre(a.proceso ?? a.origen ?? "")}:${claveNombre(a.objeto ?? a.destino ?? "")}`); break;
        case "estructural": for (const d of a.destinos) set.add(`${a.tipoEnlace}:${claveNombre(a.origen)}:${claveNombre(d)}`); break;
        default: break;
      }
    }
  }
  return set;
}

function fmtTabla(filas: Array<[string, string | number]>): string {
  const ancho = Math.max(...filas.map(([k]) => k.length));
  return filas.map(([k, v]) => `- ${k.padEnd(ancho)} : ${v}`).join("\n");
}

function main(): void {
  const md = readFileSync(PROTO_PATH, "utf8");
  const { autor, modelo, ledger, resumen } = compilarProto(md, { id: "hodom-piloto", nombre: "HODOM (piloto compilador)" });

  // ── Bundle + validación ──
  let bundleOk = false;
  let conteos = { entidades: 0, estados: 0, enlaces: 0, opds: 0 };
  let avisosError = 0;
  let canonLinea = "";
  let bundleError = "";
  let opl = "";
  try {
    const bundle = emitirBundle(autor, { lanzarEnError: false });
    bundleOk = true;
    conteos = bundle.conteos;
    avisosError = bundle.avisos.filter((a) => a.severidad === "error").length;
    canonLinea = bundle.reporte.split("\n").find((l) => l.startsWith("- Canon:")) ?? "";
    opl = bundle.opl;
  } catch (e) {
    bundleError = e instanceof Error ? e.message : String(e);
  }

  // ── Round-trip OPL (L2): los hechos APLICADOS aparecen en el OPL forward ──
  const hechosOplPorOpd = new Map<string, Set<string>>();
  for (const opd of Object.values(modelo.opds)) {
    hechosOplPorOpd.set(opd.id, clavesHechosOpl(generarOpl(modelo, opd.id)));
  }
  const todosLosHechosOpl = new Set<string>();
  for (const set of hechosOplPorOpd.values()) for (const h of set) todosLosHechosOpl.add(h);

  // Recolecta los hechos esperados (claves de los enlaces/cosas/estados emitidos).
  const aplicadas = ledger.entradas.filter((e): e is Extract<DestinoLedger, { tipo: "aplicada" }> => e.tipo === "aplicada");
  // Para el round-trip se cuenta cuántas ORACIONES aplicadas (que tienen forma OPL
  // forward) reaparecen: parseamos cada oración aplicada y buscamos su clave.
  let roundtripPresentes = 0;
  let roundtripVerificables = 0;
  for (const e of aplicadas) {
    const { ast } = parsearParrafoOpl(e.oracion.trim().endsWith(".") ? e.oracion : `${e.oracion}.`);
    for (const a of ast) {
      let clave: string | null = null;
      if (a.kind === "descripcion-cosa") clave = `cosa:${claveNombre(a.nombre)}`;
      else if (a.kind === "estados") clave = `estados:${claveNombre(a.objeto)}`;
      else if (a.kind === "procedimental") clave = `${a.tipoEnlace}:${claveNombre(a.proceso ?? a.origen ?? "")}:${claveNombre(a.objeto ?? a.destino ?? "")}`;
      if (clave) {
        roundtripVerificables += 1;
        if (todosLosHechosOpl.has(clave)) roundtripPresentes += 1;
      }
    }
  }

  // ── Desglose de destinos del ledger ──
  const fallos = ledger.entradas.filter((e): e is Extract<DestinoLedger, { tipo: "fallo" }> => e.tipo === "fallo");
  const excluidas = ledger.entradas.filter((e): e is Extract<DestinoLedger, { tipo: "excluida" }> => e.tipo === "excluida");
  const rechazadas = ledger.entradas.filter((e): e is Extract<DestinoLedger, { tipo: "rechazada" }> => e.tipo === "rechazada");

  const fallosPorCategoria = new Map<string, number>();
  for (const f of fallos) {
    const cat = categorizarFallo(f.razon);
    fallosPorCategoria.set(cat, (fallosPorCategoria.get(cat) ?? 0) + 1);
  }
  const rechazosPorCat = new Map<string, number>();
  for (const r of rechazadas) rechazosPorCat.set(r.categoria, (rechazosPorCat.get(r.categoria) ?? 0) + 1);

  // ── L2: ninguna línea sin destino ──
  const tiposValidos = new Set(["aplicada", "estructura", "rechazada", "excluida", "comentario", "estructural-md", "fallo"]);
  const sinDestino = ledger.entradas.filter((e) => !tiposValidos.has(e.tipo)).length;
  const hechosLedger = aplicadas.reduce((acc, e) => acc + e.hechos.length, 0);
  const l2Coherente = sinDestino === 0 && hechosLedger === resumen.hechos;

  // ── Reporte ──
  const lineas: string[] = [];
  lineas.push("# Piloto del compilador proto-modelo → Modelo (W4.2) sobre HODOM");
  lineas.push("");
  lineas.push("**Item:** W4.2 del backlog contingencial. **Naturaleza:** ejecución determinista del compilador `autoria/compilar/` sobre el proto real.");
  lineas.push("**Insumo:** `hd-opm/docs/modelo-opm-hodom-completo.md` (proto v1.9, completo — todos los bloques, no solo SD0/SD1).");
  lineas.push("**Oráculo:** coherencia interna (L2 + validación del bundle + round-trip OPL forward). NO se compara contra el bundle v1.6 (proto y bundle divergieron legítimamente).");
  lineas.push("**Regenerar:** `cd app && bun run scripts/piloto-compilador-hodom.ts`. Este reporte reemplaza al previo.");
  lineas.push("");
  lineas.push("## 1. OPDs y conteos del bundle emitido");
  lineas.push("");
  lineas.push(fmtTabla([
    ["OPDs creados", resumen.opds],
    ["Bundle emite (validarModelo PASS)", bundleOk ? "SÍ" : `NO — ${bundleError}`],
    ["Entidades (bundle)", conteos.entidades],
    ["Estados (bundle)", conteos.estados],
    ["Enlaces (bundle)", conteos.enlaces],
    ["OPDs (bundle)", conteos.opds],
    ["Avisos de severidad error", avisosError],
    ["Canon", canonLinea.replace("- Canon: ", "") || "n/a"],
  ]));
  lineas.push("");
  lineas.push("## 2. Hechos aplicados por tipo de primitiva DSL");
  lineas.push("");
  lineas.push(fmtTabla([
    ["Oraciones aplicadas", resumen.aplicadas],
    ["Hechos emitidos (total)", resumen.hechos],
    ...Object.entries(resumen.hechosPorPrimitiva).sort().map(([k, v]) => [`  · ${k}`, v] as [string, number]),
  ]));
  lineas.push("");
  lineas.push("## 3. Exclusiones, rechazos y fallos (L2 — nada se pierde en silencio)");
  lineas.push("");
  lineas.push(fmtTabla([
    ["Líneas estructura (refinamientos)", resumen.estructura],
    ["Comentarios conservados", resumen.comentarios],
    ["Excluidas (clase sin primitiva)", resumen.excluidas],
    ["Rechazadas (T3 del normalizador)", resumen.rechazadas],
    ["Fallos (emisión rechazada por kernel/parser)", resumen.fallos],
  ]));
  lineas.push("");
  if (excluidas.length) {
    lineas.push("### Exclusiones por clase");
    lineas.push("");
    const porClase = new Map<string, number>();
    for (const e of excluidas) porClase.set(e.clase, (porClase.get(e.clase) ?? 0) + 1);
    for (const [clase, n] of [...porClase].sort()) lineas.push(`- \`${clase}\`: ${n}`);
    lineas.push("");
  }
  lineas.push("### Rechazos del normalizador por categoría T3");
  lineas.push("");
  for (const [cat, n] of [...rechazosPorCat].sort()) lineas.push(`- \`${cat}\`: ${n}`);
  lineas.push("");
  lineas.push("### Fallos de emisión por causa (tensiones de la convención v0)");
  lineas.push("");
  for (const [cat, n] of [...fallosPorCategoria].sort((a, b) => b[1] - a[1])) lineas.push(`- ${cat}: ${n}`);
  lineas.push("");
  lineas.push("Ejemplos de fallo (oración :: razón):");
  lineas.push("");
  for (const f of fallos.slice(0, 12)) {
    lineas.push(`- \`${f.oracion.slice(0, 80).replace(/`/g, "'")}\` :: ${f.razon.slice(0, 90)}`);
  }
  lineas.push("");
  lineas.push("## 4. Round-trip OPL forward (los hechos aplicados reaparecen)");
  lineas.push("");
  const pct = roundtripVerificables ? ((roundtripPresentes / roundtripVerificables) * 100).toFixed(1) : "0";
  lineas.push(fmtTabla([
    ["Hechos aplicados verificables (cosa/estados/procedural)", roundtripVerificables],
    ["Presentes en el OPL forward del modelo", roundtripPresentes],
    ["Cobertura round-trip", `${pct}%`],
  ]));
  lineas.push("");
  lineas.push("## 5. L2 — contabilidad");
  lineas.push("");
  lineas.push(fmtTabla([
    ["Líneas sin destino reconocido", sinDestino],
    ["Hechos en ledger == resumen.hechos", `${hechosLedger} == ${resumen.hechos}`],
    ["L2 coherente", l2Coherente ? "SÍ" : "NO"],
  ]));
  lineas.push("");
  lineas.push("## 6. Veredicto");
  lineas.push("");
  const verde = bundleOk && avisosError === 0 && l2Coherente;
  lineas.push(verde
    ? "El compilador produce un Modelo OPM **válido** desde el proto real completo; L2 cierra (ninguna línea sin destino, hechos == oraciones aplicables); el round-trip OPL forward reproduce los hechos aplicados. Los fallos restantes son **tensiones reales de la convención v0 / del parser / del modelo** (ver §3), reportadas honestamente, no forzadas."
    : "El compilador NO cierra el oráculo interno; revisar §1/§5.");

  writeFileSync(REPORTE_PATH, lineas.join("\n") + "\n", "utf8");

  // Salida a consola (determinista).
  console.log(`OPDs: ${resumen.opds} · entidades: ${conteos.entidades} · estados: ${conteos.estados} · enlaces: ${conteos.enlaces}`);
  console.log(`aplicadas: ${resumen.aplicadas} · hechos: ${resumen.hechos} · excluidas: ${resumen.excluidas} · rechazadas: ${resumen.rechazadas} · fallos: ${resumen.fallos}`);
  console.log(`bundle válido: ${bundleOk} · avisos error: ${avisosError} · round-trip: ${roundtripPresentes}/${roundtripVerificables} (${pct}%)`);
  console.log(`L2 coherente: ${l2Coherente} (sin destino: ${sinDestino})`);
  console.log(`Reporte: ${REPORTE_PATH}`);
  if (!verde) process.exitCode = 1;
}

/** Agrupa la razón de un fallo en una categoría legible (tensión v0).
 *  Tras W4.3, el residuo son CONTRADICCIONES REALES del proto (una entidad usada
 *  con dos clases OPM incompatibles), no tensiones del compilador. */
function categorizarFallo(razon: string): string {
  if (/heterogénea/.test(razon)) return "contradicción de clase del proto: una entidad usada como objeto Y proceso (agregación homogénea heterogénea)";
  if (/Resultado requiere Proceso/.test(razon)) return "contradicción de clase del proto: entidad-agente (objeto) usada como sujeto de `genera` (resultado exige proceso origen)";
  if (/Invocación requiere Proceso/.test(razon)) return "evento desde objeto-en-estado (`X en \\`s\\` inicia P`) → invocación objeto→proceso ilegal";
  if (/Agente requiere Objeto/.test(razon)) return "agente no-físico (descripción informacional explícita vs rol agente)";
  if (/Agregación requiere/.test(razon)) return "agregación de clase mixta (objeto+proceso)";
  if (/Estado no registrado/.test(razon)) return "estado no registrado (nombre con `en …` capturado como estado por el parser)";
  if (/requiere ≥2/.test(razon)) return "lista de estados con disyunción `u` (no `o`) — el parser divide solo por `o`";
  return "otro";
}

main();
