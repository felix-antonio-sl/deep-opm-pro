// De-risking F4 (read-only) — ¿migrar las reglas migrable-estricto (V3/V4/V5/V7)
// en el proto HODOM preserva el bundle byte-a-byte, o exige re-pin?
//
// Contexto: F2 probó equivalencia OBSERVABLE laxo↔E2 por regla; F3 midió que
// HODOM usa esas 4 reglas 7 veces. F5-parcial (retirar V3/V4/V5/V7 del compilador)
// exige antes migrar esas 7 líneas del proto a su forma E2 estricta (F4). Este
// script responde, SIN editar la SSOT, si esa migración cambia el bundle:
//
//   - lee el proto real de hd-opm (READ-ONLY, nunca escribe);
//   - reescribe en memoria las 7 líneas migrables a OPL-ES estricto;
//   - compila proto original y proto migrado, emite ambos bundles;
//   - VALIDA (guarda anti-reescritor-bugueado): el modelo observable debe ser
//     IDÉNTICO y el uso de familia-V migrable debe caer de 7 a 0;
//   - compara el bundle JSON byte-a-byte.
//
// Veredicto:
//   · BYTE-IDÉNTICO  → F5-parcial es cambio de cero costo (bendecir edición + retiro).
//   · DIFIERE        → F5-parcial exige re-pin; el reporte dimensiona el diff.
//
// Determinista. Regenerar: `cd app && bun run scripts/derisk-f4-migrables-hodom.ts`.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { compilarProto } from "../src/autoria/compilar/compilador";
import { emitirBundle } from "../src/autoria/bundle";
import { construirSello } from "../src/autoria/procedencia";
import { usoFamiliaV, particionarUso, proyeccionObservable } from "../src/autoria/compilar/usoFamiliaV";

const PROTO_PATH = "/home/felix/projects/hd-opm/docs/modelo-opm-hodom-completo.md";
const GLOSARIO_PATH = "/home/felix/projects/hd-opm/docs/glosario-opm-hodom.md";
const REPORTE_PATH = resolve(import.meta.dir, "../../docs/proto-modelo/derisk-f4-migrables.md");

const MIGRABLES = new Set(["V3", "V4", "V5", "V7"]);

/** Reescribe una línea laxa migrable a su forma OPL-ES estricta E2 (F2). */
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
    case "V3": // `X [en estado 's'] puede iniciar P` → `... inicia P`
      r = s.replace(" puede iniciar ", " inicia ");
      break;
    default:
      throw new Error(`regla no migrable: ${regla}`);
  }
  return `${r}.`;
}

function main(): void {
  const md = readFileSync(PROTO_PATH, "utf8");
  const glosario = readFileSync(GLOSARIO_PATH, "utf8");
  const opciones = { id: "hodom-piloto", nombre: "HODOM (piloto compilador)" } as const;
  const sello = construirSello({ protoTexto: md, glosarioTexto: glosario });

  const orig = compilarProto(md, opciones);
  const usoOrig = particionarUso(usoFamiliaV(orig.ledger));

  // Reescritura en memoria de las 7 líneas migrables (replace exacto del original).
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

  // Guardas anti-reescritor-bugueado.
  const todasAplicadas = reescrituras.every((r) => r.aplicada);
  const modeloObservableIgual =
    JSON.stringify(proyeccionObservable(migrado.modelo)) === JSON.stringify(proyeccionObservable(orig.modelo));
  const migrableCayoACero = usoMigrado.migrable.total === 0;
  const requiereDecisionIgual = usoMigrado.requiereDecision.total === usoOrig.requiereDecision.total;
  const guardasOk = todasAplicadas && modeloObservableIgual && migrableCayoACero && requiereDecisionIgual;

  // Comparación de bundle byte-a-byte (solo confiable si las guardas pasan).
  let byteIdentico: boolean | null = null;
  let primeraDiferencia = "";
  if (guardasOk) {
    const bOrig = emitirBundle(orig.autor, { lanzarEnError: false, procedencia: sello });
    const bMig = emitirBundle(migrado.autor, { lanzarEnError: false, procedencia: sello });
    byteIdentico = bOrig.json === bMig.json;
    if (!byteIdentico) {
      const a = bOrig.json.split("\n");
      const b = bMig.json.split("\n");
      const n = Math.max(a.length, b.length);
      for (let i = 0; i < n; i++) {
        if (a[i] !== b[i]) {
          primeraDiferencia = `línea ${i + 1}:\n  orig: ${(a[i] ?? "∅").slice(0, 100)}\n  mig : ${(b[i] ?? "∅").slice(0, 100)}`;
          break;
        }
      }
    }
  }

  const fmt = (filas: Array<[string, string | number]>) => {
    const w = Math.max(...filas.map(([k]) => k.length));
    return filas.map(([k, v]) => `- ${k.padEnd(w)} : ${v}`).join("\n");
  };

  const lineas: string[] = [];
  lineas.push("# De-risking F4 — byte-identidad de migrar V3/V4/V5/V7 en HODOM");
  lineas.push("");
  lineas.push("**Naturaleza:** read-only sobre `hd-opm` (NUNCA escribe el proto). Reescribe en memoria las");
  lineas.push("líneas migrable-estricto a su forma E2 y compara el bundle. **Regenerar:**");
  lineas.push("`cd app && bun run scripts/derisk-f4-migrables-hodom.ts`. Reemplaza al previo.");
  lineas.push("");
  lineas.push("## 1. Reescrituras laxo → E2 (las 7 líneas migrables)");
  lineas.push("");
  for (const r of reescrituras) {
    lineas.push(`- **${r.regla}** ${r.aplicada ? "✓" : "✗ NO APLICADA"}`);
    lineas.push(`  - laxo: \`${r.laxo}\``);
    lineas.push(`  - E2  : \`${r.e2}\``);
  }
  lineas.push("");
  lineas.push("## 2. Guardas de validez (el veredicto byte solo vale si TODAS pasan)");
  lineas.push("");
  lineas.push(fmt([
    ["Las 7 reescrituras se aplicaron al proto", todasAplicadas ? "SÍ" : "NO"],
    ["Modelo observable idéntico (entidades/enlaces/estados/anclas)", modeloObservableIgual ? "SÍ" : "NO"],
    ["Uso familia-V migrable cayó a 0", `${migrableCayoACero ? "SÍ" : "NO"} (${usoOrig.migrable.total} → ${usoMigrado.migrable.total})`],
    ["Uso requiere-decisión intacto", `${requiereDecisionIgual ? "SÍ" : "NO"} (${usoOrig.requiereDecision.total} → ${usoMigrado.requiereDecision.total})`],
    ["Guardas OK", guardasOk ? "SÍ" : "NO"],
  ]));
  lineas.push("");
  lineas.push("## 3. Veredicto byte-a-byte");
  lineas.push("");
  if (!guardasOk) {
    lineas.push("⚠️ **Guardas NO pasaron** — el reescritor o la sustitución fallaron; el veredicto byte se omite.");
    lineas.push("Revisar §2: probablemente una línea no se reescribió o cambió la semántica.");
  } else if (byteIdentico) {
    lineas.push("✅ **BYTE-IDÉNTICO.** Migrar V3/V4/V5/V7 a su forma E2 en el proto HODOM produce el MISMO");
    lineas.push("bundle, byte a byte. **F5-parcial es cambio de cero costo**: el operador solo debe bendecir la");
    lineas.push("edición del proto (7 líneas) y el retiro de esas 4 reglas del compilador — sin re-pin del golden.");
  } else {
    lineas.push("🔶 **DIFIERE.** La migración cambia el bundle → **F5-parcial exige re-pin** del golden HODOM.");
    lineas.push("Primera diferencia:");
    lineas.push("```");
    lineas.push(primeraDiferencia);
    lineas.push("```");
  }
  lineas.push("");
  lineas.push("## 4. Hallazgo colateral (corregido)");
  lineas.push("");
  lineas.push("La primera corrida de este de-risking falló la guarda «modelo observable idéntico» por un");
  lineas.push("**bug de reentrancia**: el contador de `claveProto` de colas (`cola-fina-N`) era módulo-global");
  lineas.push("(`emisor.ts`), no por-compilación — compilar dos protos en un proceso daba claves divergentes");
  lineas.push("(`cola-fina-1..10` y luego `11..20`), violando el diseño W5.2 (claveProto estable nacida en el");
  lineas.push("proto). Corregido hilando un holder `secuenciaColaAncla` por compilación en `ContextoEmision`");
  lineas.push("(test de reentrancia en `anclas.test.ts`). El de-risking no es byte-confiable sin esta corrección.");

  writeFileSync(REPORTE_PATH, lineas.join("\n") + "\n", "utf8");
  console.log(`reescrituras aplicadas: ${reescrituras.filter((r) => r.aplicada).length}/${reescrituras.length}`);
  console.log(`guardas OK: ${guardasOk} (obs-igual: ${modeloObservableIgual}, migrable→0: ${migrableCayoACero})`);
  console.log(`byte-idéntico: ${byteIdentico}`);
  console.log(`Reporte: ${REPORTE_PATH}`);
  if (!guardasOk) process.exitCode = 1;
}

main();
