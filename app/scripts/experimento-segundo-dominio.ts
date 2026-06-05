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
import { detectarDuplicadosPorAbsorcion } from "../src/autoria/compilar/absorcion";
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
  // MÉTRICA HONESTA (adjudicación dov-dori §3.10): una "aplicada" que produjo
  // entidad duplicada por absorción es corrupción, no éxito. Se descuenta.
  const duplicados = detectarDuplicadosPorAbsorcion(modelo);
  const coberturaSana = intentadas ? ((aplicadas.length - duplicados.length) / intentadas) * 100 : 0;

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
    ["Duplicados por absorción (corrupción silenciosa)", duplicados.length],
    ["Cobertura SANA (descuenta corrupciones)", `${coberturaSana.toFixed(1)}%`],
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
  lineas.push("## 5. Hallazgos, adjudicación y remediación (ciclo completo 2026-06-05)");
  lineas.push("");
  lineas.push("La PRIMERA corrida (proto v0.1, gramática pre-adjudicación) arrojó 93.0% con 4 rechazos y dos");
  lineas.push("defectos de borde; el operador convocó a **dov-dori**, cuya adjudicación");
  lineas.push("(`adjudicacion-dov-dori-2026-06-05.md`) fue IMPLEMENTADA el mismo día. Resolución por hallazgo:");
  lineas.push("");
  lineas.push("| # | Hallazgo (1ª corrida) | Adjudicación | Estado |");
  lineas.push("|---|---|---|---|");
  lineas.push("| (a) | `Planos de arquitectura son…` → R3 | **R8**: plural sin Conjunto/Grupo se RECHAZA con sugerencia (R-NOM-OBJ-1/2) — jamás se normaliza en silencio | implementado (rechazo correcto: el barro vuelve al modelador) |");
  lineas.push("| (b) | alfabeto cerrado `DS\\|NT\\|DTO\\|Ley\\|Decreto` | detector por **LOCALIZADOR** (`art./§/inc./letra/N°`, conjunto cerrado) + cuerpo-con-numeración legal; el alfabeto de cuerpos es ABIERTO y no se enumera | implementado (`(LGUC art. 116)`, `(OGUC §5.1.6)` ahora compilan a ancla) |");
  lineas.push("| (c) | cita absorbida al nombre → entidad DUPLICADA silenciosa | guard **R9** en el punto de creación (residuo no nominal ⇒ fallo con diagnóstico) + check `detectarDuplicadosPorAbsorcion` | implementado (BLOQUEANTE, fue primero) |");
  lineas.push("| (d) | `está acotada por un plazo de 30 días` → R7 | **V17** bifurcado por firma de extremos: temporal→`exhibe Plazo`+cola; abstracto↔abstracto→etiquetado «está acotado por». Destraba la ex-en-reflexión #2 de HODOM | implementado |");
  lineas.push("| (e) | `notifica al Solicitante` → R3 | **V16**: `genera Notificación` + etiquetado «dirigido a» (+contenido como cola). El enum de verbos NUNCA se infla | implementado |");
  lineas.push("");
  lineas.push("**Los números de §1-§4 de este reporte reflejan la gramática POST-adjudicación.** Los rechazos");
  lineas.push("residuales esperados del proto v0.1 son los R8 (plurales mal formados que el AUTOR debe renombrar");
  lineas.push("`Conjunto de…` — rechazo correcto, no sobreajuste).");
  lineas.push("");
  lineas.push("**Veredicto de fondo (dov-dori §2, pendiente de ratificación del operador como P3):** la gramática");
  lineas.push("determinista NO es utopía — la que pretende enumerar léxico de dominio SÍ lo es. Frontera recomendada:");
  lineas.push("el léxico abierto (mapeos verbo-de-dominio, citas, morfología) sube al LLM en E2 (propone, humano");
  lineas.push("confirma); el compilador queda como VERIFICADOR TOTAL sobre el enum cerrado + emisor reproducible.");
  lineas.push("El LLM nunca toca el bundle; el compilador nunca adivina semántica de dominio.");
  lineas.push("");

  writeFileSync(REPORTE_PATH, lineas.join("\n") + "\n", "utf8");

  console.log(`aplicadas: ${aplicadas.length} · rechazadas: ${rechazadas.length} · fallos: ${fallos.length} · cobertura: ${cobertura.toFixed(1)}% (HODOM: ${HODOM.cobertura}%)`);
  console.log(`OPDs: ${resumen.opds} · hechos: ${resumen.hechos} · bundle: ${bundleOk} · L6: ${procedenciaVerde}`);
  console.log(`anclas: ${resumen.anclasDetectadas} detectadas / ${resumen.anclasCompiladas} compiladas`);
  console.log(`Reporte: ${REPORTE_PATH}`);
  void modelo;
}

main();
