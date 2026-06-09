// F5-parcial (paso 1/2): MIGRA el proto HODOM — reescribe las 7 líneas migrables
// (V3/V4/V5/V7) a su forma OPL-ES estricta E2. Espejo EXACTO de
// `derisk-f4-migrables-hodom.ts`, pero ESCRIBE el proto (la SSOT de dominio)
// SOLO si la guarda de byte-identidad pasa en memoria.
//
// Contrato: tras esta migración, el proto compila los 7 hechos por la RUTA
// ESTRICTA (sin familia-V). El paso 2/2 (retirar V3/V4/V5/V7 de `mapearFamiliaV`)
// vive en `src/autoria/compilar/normalizador.ts`. El de-risking probó que esta
// migración es BYTE-IDÉNTICA al bundle previo → sin re-pin del golden.
//
// Idempotente: si el proto ya está migrado (0 migrables), no escribe nada.
// Regenerar/aplicar: `cd app && bun run scripts/aplicar-f5-parcial-hodom.ts`.

import { readFileSync, writeFileSync } from "node:fs";
import { compilarProto } from "../src/autoria/compilar/compilador";
import { emitirBundle } from "../src/autoria/bundle";
import { construirSello } from "../src/autoria/procedencia";
import { usoFamiliaV, particionarUso, proyeccionObservable } from "../src/autoria/compilar/usoFamiliaV";

const PROTO_PATH = "/home/felix/projects/hd-opm/docs/modelo-opm-hodom-completo.md";
const MIGRABLES = new Set(["V3", "V4", "V5", "V7"]);

/** Reescribe una línea laxa migrable a su forma OPL-ES estricta E2 (idéntica al de-risking). */
function reescribirE2(regla: string, laxo: string): string {
  const s = laxo.replace(/\.\s*$/, "");
  let r: string;
  switch (regla) {
    case "V4": { // `O alimenta P` → `P requiere O`
      const i = s.indexOf(" alimenta ");
      r = `${s.slice(i + 10)} requiere ${s.slice(0, i)}`;
      break;
    }
    case "V5": // `P detecta O` → `P genera O`
      r = s.replace(" detecta ", " genera ");
      break;
    case "V7": // `A precede a B` → `A invoca B`
      r = s.replace(" precede a ", " invoca ");
      break;
    case "V3": // `X [en 's'] puede iniciar P` → `… inicia P`
      r = s.replace(" puede iniciar ", " inicia ");
      break;
    default:
      throw new Error(`regla no migrable: ${regla}`);
  }
  return `${r}.`;
}

function main(): void {
  const md = readFileSync(PROTO_PATH, "utf8");
  const opciones = { id: "hodom-piloto", nombre: "HODOM (piloto compilador)" } as const;
  const sello = construirSello({ protoTexto: md });

  const orig = compilarProto(md, opciones);
  const usoOrig = particionarUso(usoFamiliaV(orig.ledger));

  if (usoOrig.migrable.total === 0) {
    console.log("Proto ya migrado (0 usos migrable V3/V4/V5/V7). Nada que escribir.");
    return;
  }

  const migrables = orig.ledger.entradas.filter(
    (e): e is Extract<typeof e, { tipo: "aplicada" }> =>
      e.tipo === "aplicada" && typeof e.regla === "string" && MIGRABLES.has(e.regla),
  );
  let mdMigrado = md;
  const reescrituras: Array<{ regla: string; laxo: string; e2: string; aplicada: boolean }> = [];
  for (const e of migrables) {
    const laxo = e.original ?? e.oracion;
    const e2 = reescribirE2(e.regla!, laxo);
    const antes = mdMigrado;
    mdMigrado = mdMigrado.replace(laxo, e2);
    reescrituras.push({ regla: e.regla!, laxo, e2, aplicada: mdMigrado !== antes });
  }

  const migrado = compilarProto(mdMigrado, opciones);
  const usoMigrado = particionarUso(usoFamiliaV(migrado.ledger));

  // Guardas anti-reescritor-bugueado (idénticas al de-risking).
  const todasAplicadas = reescrituras.every((r) => r.aplicada);
  const modeloObservableIgual =
    JSON.stringify(proyeccionObservable(migrado.modelo)) === JSON.stringify(proyeccionObservable(orig.modelo));
  const migrableCayoACero = usoMigrado.migrable.total === 0;
  const requiereDecisionIgual = usoMigrado.requiereDecision.total === usoOrig.requiereDecision.total;

  const bOrig = emitirBundle(orig.autor, { lanzarEnError: false, procedencia: sello });
  const bMig = emitirBundle(migrado.autor, { lanzarEnError: false, procedencia: sello });
  const byteIdentico = bOrig.json === bMig.json;

  const guardasOk = todasAplicadas && modeloObservableIgual && migrableCayoACero && requiereDecisionIgual && byteIdentico;

  console.log("Reescrituras:");
  for (const r of reescrituras) console.log(`  ${r.aplicada ? "✓" : "✗"} ${r.regla}: ${r.laxo}\n        → ${r.e2}`);
  console.log(`Guardas: aplicadas=${todasAplicadas} obs-igual=${modeloObservableIgual} migrable→0=${migrableCayoACero} req-dec-igual=${requiereDecisionIgual} byte-idéntico=${byteIdentico}`);

  if (!guardasOk) {
    console.error("❌ GUARDA FALLÓ — NO se escribe el proto. Revisar arriba.");
    process.exitCode = 1;
    return;
  }

  writeFileSync(PROTO_PATH, mdMigrado, "utf8");
  console.log(`✅ Proto migrado y escrito (byte-idéntico): ${PROTO_PATH}`);
}

main();
