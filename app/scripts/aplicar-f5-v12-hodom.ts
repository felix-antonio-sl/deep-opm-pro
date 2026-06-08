// F5-V12 (migración del proto HODOM): reescribe las 4 líneas `cuando` (V12)
// rechazadas tras el estrechamiento de V12 a su forma OPL-ES estricta E2.
// Hermano de `aplicar-f5-parcial-hodom.ts`, pero el contrato YA NO es byte-
// idéntico: estas 4 colas no tenían equivalente estricto que reprodujera el
// modelo (eran "requiere-decisión"). La migración:
//   1. `… cambia X a 's' cuando C`  → `… cambia X a 's'. [RATIFICAR: C]`
//   2. `requiere O <estado> cuando C` → `requiere O en estado '<estado>'. [RATIFICAR: C]`
//   3/5. (idem #1, idem `genera`)
// Decidido con el operador (2026-06-08): la condicionalidad de estas 4 formas
// NO es OPM nuclear (no glifo/oración bimodal) — es ancla normativa pendiente;
// su canal de ida-vuelta es la ratificación humana, no el parser. Tras el
// estrechamiento de V12 (`cuando` retirado), la skill emite la TS/efecto/requiere
// estricto + `[RATIFICAR: …]` explícito (P3: el compilador verifica, no puentea).
//
// GUARDA (no byte-identidad): las 4 reescrituras aplican; las 4 `cuando` dejan
// de estar rechazadas; NO aparecen nuevas rechazadas; las 4 anclas RATIFICAR
// quedan presentes; el resto de rechazadas (pre-existentes, otras reglas) intacto.
// Idempotente: si el proto ya está migrado (0 reescrituras aplican), no escribe.
//
// Aplicar: `cd app && bun run scripts/aplicar-f5-v12-hodom.ts`.

import { readFileSync, writeFileSync } from "node:fs";
import { compilarProto } from "../src/autoria/compilar/compilador";

const PROTO_PATH = "/home/felix/projects/hd-opm/docs/modelo-opm-hodom-completo.md";

/** Las 4 reescrituras E2 (laxo `cuando` → estricto + `[RATIFICAR: cola]`). */
const REWRITES: ReadonlyArray<readonly [string, string]> = [
  [
    "Registro de la atención cambia Indicación médica a 'cumplida' cuando se completa la orden.",
    "Registro de la atención cambia Indicación médica a 'cumplida'. [RATIFICAR: se completa la orden]",
  ],
  [
    "Integración diagnóstica requiere Voluntad anticipada vigente cuando la decisión puede escalar.",
    "Integración diagnóstica requiere Voluntad anticipada en estado 'vigente'. [RATIFICAR: la decisión puede escalar — Ley 20.584]",
  ],
  [
    "Ajuste terapéutico cambia Indicación médica a 'suspendida' cuando supersede una indicación previa.",
    "Ajuste terapéutico cambia Indicación médica a 'suspendida'. [RATIFICAR: supersede una indicación previa]",
  ],
  [
    "Vigilancia y prevención de IAAS genera Evento adverso cuando detecta una IAAS.",
    "Vigilancia y prevención de IAAS genera Evento adverso. [RATIFICAR: detecta una IAAS]",
  ],
];

const NOTAS_RE = /se completa la orden|decisión puede escalar|supersede una indicación|detecta una IAAS/i;

function main(): void {
  const md = readFileSync(PROTO_PATH, "utf8");

  let mig = md;
  const aplicadas = REWRITES.map(([from, to]) => {
    const antes = mig;
    mig = mig.replace(from, to);
    return mig !== antes;
  });

  if (aplicadas.every((x) => !x)) {
    console.log("Proto ya migrado (0 reescrituras `cuando` aplican). Nada que escribir.");
    return;
  }

  const rechazadas = (texto: string): string[] =>
    compilarProto(texto, { id: "hodom-piloto", nombre: "HODOM (piloto)" }).ledger.entradas
      .filter((e): e is Extract<typeof e, { tipo: "rechazada" }> => e.tipo === "rechazada")
      .map((e) => ((e as { original?: string; oracion?: string }).original ?? (e as { oracion?: string }).oracion ?? "").trim());

  const rejOrig = rechazadas(md);
  const rMig = compilarProto(mig, { id: "hodom-piloto", nombre: "HODOM (piloto)" });
  const rejMig = rMig.ledger.entradas
    .filter((e): e is Extract<typeof e, { tipo: "rechazada" }> => e.tipo === "rechazada")
    .map((e) => ((e as { original?: string; oracion?: string }).original ?? (e as { oracion?: string }).oracion ?? "").trim());

  const desaparecidas = rejOrig.filter((x) => !rejMig.includes(x));
  const nuevas = rejMig.filter((x) => !rejOrig.includes(x));
  const anclasRatif = (Object.values(rMig.modelo.anclasNormativas ?? {}) as Array<{ nota?: string }>)
    .filter((a) => NOTAS_RE.test(a.nota ?? ""));

  const todasAplicadas = aplicadas.every((x) => x);
  const cuatroCuandoFueron = desaparecidas.length === 4 && desaparecidas.every((x) => /\bcuando\b/i.test(x));
  const sinNuevas = nuevas.length === 0;
  const cuatroAnclas = anclasRatif.length === 4;

  const guardasOk = todasAplicadas && cuatroCuandoFueron && sinNuevas && cuatroAnclas;

  console.log("Reescrituras:");
  REWRITES.forEach(([from], i) => console.log(`  ${aplicadas[i] ? "✓" : "✗"} ${from.slice(0, 70)}…`));
  console.log(`Guardas: aplicadas=${todasAplicadas} cuando→fuera(4)=${cuatroCuandoFueron} sin-nuevas-rechazadas=${sinNuevas} anclas-RATIFICAR(4)=${cuatroAnclas}`);
  console.log(`Rechazadas: ${rejOrig.length} → ${rejMig.length} (−4 esperado).`);

  if (!guardasOk) {
    console.error("❌ GUARDA FALLÓ — NO se escribe el proto. Revisar arriba.");
    process.exitCode = 1;
    return;
  }

  writeFileSync(PROTO_PATH, mig, "utf8");
  console.log(`✅ Proto HODOM migrado (4 lineas cuando → E2 estricto + [RATIFICAR]): ${PROTO_PATH}`);
}

main();
