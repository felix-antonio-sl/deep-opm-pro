// Experimento de FALSACIÓN DE GENERALIDAD del compilador proto→Modelo.
//
// Pregunta: ¿la gramática del sub-dialecto (v0.2 + familia V) generaliza más allá
// del estilo HODOM, o está sobreajustada al corpus contra el que se falsó?
//
// Método: un proto chico de OTRO dominio (permiso de edificación municipal,
// LGUC/OGUC) escrito con naturalidad de modelador SIN ajustar las oraciones a lo
// que el normalizador acepta (`docs/proto-modelo/segundo-dominio/`). Se compila
// con el MISMO `compilarProto()` sin tocar la gramática; el resultado —cobertura,
// rechazos, fallos— ES el dato. Las divergencias se reportan, no se esconden ni
// se "arreglan" en la gramática (los mapeos nuevos son decisión del operador,
// igual que la familia V).
//
// Sello L6: el bundle del experimento se emite con procedencia (W5.3) desde el
// inicio — proto + glosario del segundo dominio.
//
// Determinista: sin fechas/aleatoriedad; el reporte reemplaza al previo.
// Regenerar: `cd app && bun run scripts/experimento-segundo-dominio.ts`.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { compilarProto } from "../src/autoria/compilar/compilador";
import type { DestinoLedger } from "../src/autoria/compilar/compilador";
import { emitirBundle } from "../src/autoria/bundle";
import { compararProcedencia, construirSello } from "../src/autoria/procedencia";
import { hidratarModelo } from "../src/serializacion/json";

const BASE = resolve(import.meta.dir, "../../docs/proto-modelo/segundo-dominio");
const PROTO_PATH = resolve(BASE, "proto-permiso-edificacion.md");
const GLOSARIO_PATH = resolve(BASE, "glosario-permiso-edificacion.md");
const REPORTE_PATH = resolve(import.meta.dir, "../../docs/proto-modelo/experimento-segundo-dominio.md");

// Referencia HODOM (piloto 2026-06-05): para el contraste de generalidad.
const HODOM = { cobertura: 98.9, rechazadas: 5, fallos: 0, aplicadas: 444 };

function fmtTabla(filas: Array<[string, string | number]>): string {
  const ancho = Math.max(...filas.map(([k]) => k.length));
  return filas.map(([k, v]) => `- ${k.padEnd(ancho)} : ${v}`).join("\n");
}

function main(): void {
  const md = readFileSync(PROTO_PATH, "utf8");
  const glosario = readFileSync(GLOSARIO_PATH, "utf8");
  const sello = construirSello({ protoTexto: md, glosarioTexto: glosario });
  const { modelo, autor, ledger, resumen } = compilarProto(md, {
    id: "permiso-edificacion-exp",
    nombre: "Permiso de edificación (experimento segundo dominio)",
  });

  // ── Bundle + sello L6 ──
  let bundleOk = false;
  let bundleError = "";
  let conteos = { entidades: 0, estados: 0, enlaces: 0, opds: 0 };
  let avisosError = 0;
  let procedenciaVerde = false;
  try {
    const bundle = emitirBundle(autor, { lanzarEnError: false, procedencia: sello });
    bundleOk = true;
    conteos = bundle.conteos;
    avisosError = bundle.avisos.filter((a) => a.severidad === "error").length;
    const hidratado = hidratarModelo(bundle.json);
    procedenciaVerde =
      hidratado.ok &&
      !!hidratado.value.procedencia &&
      !compararProcedencia(hidratado.value.procedencia, sello).divergente;
  } catch (e) {
    bundleError = e instanceof Error ? e.message : String(e);
  }

  // ── Cobertura: oraciones-hecho del proto que llegaron a destino productivo ──
  const aplicadas = ledger.entradas.filter((e): e is Extract<DestinoLedger, { tipo: "aplicada" }> => e.tipo === "aplicada");
  const rechazadas = ledger.entradas.filter((e): e is Extract<DestinoLedger, { tipo: "rechazada" }> => e.tipo === "rechazada");
  const fallos = ledger.entradas.filter((e): e is Extract<DestinoLedger, { tipo: "fallo" }> => e.tipo === "fallo");
  const excluidas = ledger.entradas.filter((e): e is Extract<DestinoLedger, { tipo: "excluida" }> => e.tipo === "excluida");
  // Mismo criterio que el piloto HODOM: cobertura = aplicadas / (aplicadas + rechazadas + fallos).
  const intentadas = aplicadas.length + rechazadas.length + fallos.length;
  const cobertura = intentadas ? (aplicadas.length / intentadas) * 100 : 0;

  const reglasUsadas = new Map<string, number>();
  for (const a of aplicadas) {
    if (a.regla) reglasUsadas.set(a.regla, (reglasUsadas.get(a.regla) ?? 0) + 1);
  }

  // ── Reporte ──
  const lineas: string[] = [];
  lineas.push("# Experimento de falsación de generalidad — segundo dominio (permiso de edificación)");
  lineas.push("");
  lineas.push("**Pregunta:** ¿la gramática v0.2 + familia V generaliza más allá del estilo HODOM?");
  lineas.push("**Insumo:** `docs/proto-modelo/segundo-dominio/proto-permiso-edificacion.md` (v0.1, escrito con naturalidad de dominio, SIN ajustar a la gramática).");
  lineas.push("**Método:** mismo `compilarProto()`, gramática INTACTA. Los rechazos/fallos son el dato del experimento — los mapeos nuevos son decisión del operador (como la familia V).");
  lineas.push("**Regenerar:** `cd app && bun run scripts/experimento-segundo-dominio.ts`. Este reporte reemplaza al previo.");
  lineas.push("");
  lineas.push("## 1. Resultado global vs referencia HODOM");
  lineas.push("");
  lineas.push(fmtTabla([
    ["Oraciones aplicadas", aplicadas.length],
    ["Rechazadas (T3)", rechazadas.length],
    ["Fallos de emisión", fallos.length],
    ["Excluidas (clase sin primitiva)", excluidas.length],
    ["Cobertura (aplicadas / intentadas)", `${cobertura.toFixed(1)}%`],
    ["— Referencia HODOM (piloto)", `${HODOM.cobertura}% (${HODOM.aplicadas} aplicadas, ${HODOM.rechazadas} rechazadas, ${HODOM.fallos} fallos)`],
    ["Hechos emitidos", resumen.hechos],
    ["OPDs", resumen.opds],
    ["Bundle emite (validarModelo)", bundleOk ? "SÍ" : `NO — ${bundleError}`],
    ["Entidades/Estados/Enlaces (bundle)", `${conteos.entidades}/${conteos.estados}/${conteos.enlaces}`],
    ["Avisos error", avisosError],
    ["Sello L6 en bundle, sin divergencia", procedenciaVerde ? "SÍ" : "NO"],
    ["Anclas detectadas/compiladas/candidatas", `${resumen.anclasDetectadas}/${resumen.anclasCompiladas}/${resumen.anclasCandidatas}`],
  ]));
  lineas.push("");
  lineas.push("## 2. Reglas de la gramática ejercitadas (¿la familia V generaliza?)");
  lineas.push("");
  if (reglasUsadas.size) {
    for (const [regla, n] of [...reglasUsadas].sort()) lineas.push(`- \`${regla}\`: ${n}`);
  } else {
    lineas.push("- (ninguna regla T2/V usada: todo entró como OPL estricto)");
  }
  lineas.push("");
  lineas.push("## 3. Rechazos T3 — oración :: categoría :: diagnóstico");
  lineas.push("");
  for (const r of rechazadas) {
    lineas.push(`- \`${r.original.slice(0, 90).replace(/`/g, "'")}\``);
    lineas.push(`  - **${r.categoria}** :: ${r.diagnostico.slice(0, 140)}`);
  }
  if (!rechazadas.length) lineas.push("- (sin rechazos)");
  lineas.push("");
  lineas.push("## 4. Fallos de emisión — oración :: razón");
  lineas.push("");
  for (const f of fallos) {
    lineas.push(`- \`${f.oracion.slice(0, 90).replace(/`/g, "'")}\` :: ${f.razon.slice(0, 120)}`);
  }
  if (!fallos.length) lineas.push("- (sin fallos)");
  lineas.push("");
  lineas.push("## 5. Análisis de generalidad (adjudicación 2026-06-05 sobre el proto v0.1)");
  lineas.push("");
  lineas.push("**Lo que GENERALIZÓ** (núcleo confirmado): las reglas T2 (A1 listas, A2 estados, A4, A6 multi-destino,");
  lineas.push("A9 exhibe-como, AESS) y la familia V ejercitada (V5 `detecta`, V7 `precede a`, V12 colas `cuando`)");
  lineas.push("operaron sin fricción sobre un dominio ajeno; el lector de estructura armó los 4 OPDs (raíz + 2");
  lineas.push("in-zoom + 1 despliegue) con la misma convención; el bundle valida y porta sello L6.");
  lineas.push("");
  lineas.push("**SOBREAJUSTE CONFIRMADO** (2 hallazgos léxicos de borde — mapeos candidatos, DECISIÓN DEL OPERADOR):");
  lineas.push("");
  lineas.push("1. **Esencia plural de entidad singular**: `Planos de arquitectura son informacionales y ambientales`");
  lineas.push("   → R3 (×2). La ruta singular de esencia exige `es`; la plural existe solo para LISTAS (A1). Un");
  lineas.push("   dominio con entidades de nombre gramaticalmente plural (Planos, Especificaciones) no puede declarar");
  lineas.push("   esencia. HODOM casi no las tiene (cf. cola «Otros profesionales» en-reflexión). Mapeo candidato:");
  lineas.push("   `X son <esencia-pl> y <afiliacion-pl>` con X sin separadores de lista → esencia singular.");
  lineas.push("2. **Alfabeto cerrado de normas** (`ANCLA_PAREN_NORMA_RE`: `DS|NT|DTO|Ley|Decreto`): `(LGUC art. 116)`");
  lineas.push("   y `(OGUC §…)` NO se reconocen como ancla — el vocabulario normativo está sobreajustado a HODOM.");
  lineas.push("   Candidatos: LGUC, OGUC, DFL, Res. Ex., Circular (o patrón genérico `<SIGLA> art./§ N`).");
  lineas.push("");
  lineas.push("**HALLAZGO SERIO — degradación SILENCIOSA** (peor que un rechazo): la cita no reconocida NO se rechaza —");
  lineas.push("se pega al NOMBRE: el bundle contiene `Permiso de edificación (LGUC art. 116)` **Y** `Permiso de");
  lineas.push("edificación` como DOS entidades distintas (SD0 genera la primera; SD1 referencia la segunda). Modelo");
  lineas.push("válido pero semánticamente corrupto, sin diagnóstico. Viola el espíritu de L2/L8 («nada se pierde en");
  lineas.push("silencio») por la rendija del nombre. Guard candidato (decisión del operador): paréntesis con patrón");
  lineas.push("`art./§` y sigla NO reconocida → diagnóstico, no absorber al nombre.");
  lineas.push("");
  lineas.push("**Rechazos correctos (NO sobreajuste)**: `está acotada por un plazo de 30 días` (R7) COLISIONA con la");
  lineas.push("oración en-reflexión de HODOM `está-acotado-por` — el patrón es TRANSVERSAL a dominios, lo que sube la");
  lineas.push("prioridad de esa reflexión del operador. `notifica al Solicitante` (R3) es verbo nuevo legítimo,");
  lineas.push("candidato a familia V futura. Ambos con diagnóstico útil.");
  lineas.push("");
  lineas.push("**Honestidad de la métrica**: la cobertura de §1 SOBRESTIMA — la oración del art. 116 cuenta como");
  lineas.push("`aplicada` pero produjo la entidad duplicada (corrupción silenciosa). Cobertura sana real: 52/57.");
  lineas.push("");
  lineas.push("**Veredicto**: la gramática NUCLEAR generaliza; el sobreajuste vive en los BORDES LÉXICOS (alfabeto");
  lineas.push("normativo, morfología plural) + 1 bug de silencio en la absorción de citas. Ninguno se corrige sin el");
  lineas.push("operador (los mapeos son decisiones de dialecto, como la familia V).");
  lineas.push("");

  writeFileSync(REPORTE_PATH, lineas.join("\n") + "\n", "utf8");

  console.log(`aplicadas: ${aplicadas.length} · rechazadas: ${rechazadas.length} · fallos: ${fallos.length} · cobertura: ${cobertura.toFixed(1)}% (HODOM: ${HODOM.cobertura}%)`);
  console.log(`OPDs: ${resumen.opds} · hechos: ${resumen.hechos} · bundle: ${bundleOk} · L6: ${procedenciaVerde}`);
  console.log(`anclas: ${resumen.anclasDetectadas} detectadas / ${resumen.anclasCompiladas} compiladas`);
  console.log(`Reporte: ${REPORTE_PATH}`);
  void modelo;
}

main();
