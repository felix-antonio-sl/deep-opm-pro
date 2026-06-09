// F2 de la migración familia-V → skill `modelamiento-opm` (normalizar-proto).
//
// Contrato: `contrato-migracion-familia-v-skill.md (retirado 2a83c1c5, en git)` (F2 =
// "pares proto laxo familia-V → proto E2 estricto y resultado equivalente, sin
// cambiar comportamiento del compilador"). Ledger F1:
// `ledger-familia-v-skill.md (retirado 2a83c1c5, en git)`.
//
// IDEA CLAVE (determinismo sin LLM): F2 NO ejecuta la skill. Codifica la salida
// E2 esperada como texto y verifica, por cada regla V, que la ruta E2 produce el
// MISMO modelo observable que la ruta legacy (laxa, vía mapearFamiliaV) PERO sin
// usar familia-V. La equivalencia se mide sobre una proyección observable del
// modelo (entidades nombre→tipo, enlaces tipo+extremos+etiqueta+modificador,
// estados, anclas), no sobre ids posicionales.
//
// HALLAZGO que F2 hace ejecutable (no esconde): solo los mapeos verbo→verbo-del-
// enum (V4 alimenta→requiere, V5 detecta→genera, V7 precede→invoca) tienen
// superficie OPL-ES estricta REVERSE-parseable y migran limpio HOY. Los tagged
// (V8-V11, V17) y las compuestas con directivas/modificador (V1/V2/V3/V6/V12-V16)
// emiten formas que el parser reverse NO re-lee → su "salida E2" requiere una
// decisión de transporte antes de F4/F5. F2 los CLASIFICA, no finge equivalencia.

import { describe, expect, test } from "bun:test";
import { compilarProto } from "./compilador";
import {
  usoFamiliaV,
  usoFamiliaVPorOpd,
  particionarUso,
  MIGRABLE_ESTRICTO_F2,
  proyeccionObservable,
} from "./usoFamiliaV";
import { FIXTURES_FAMILIA_V, PREAMBULO_FIXTURES } from "./familia-v-e2.fixtures";

function compilar(cuerpo: string) {
  const md = `${PREAMBULO_FIXTURES}\n${cuerpo}\n\`\`\`\n`;
  return compilarProto(md, { id: "f2", nombre: "F2" });
}

// ── usoFamiliaV: observación pura del ledger ─────────────────────────────────

describe("usoFamiliaV — cuenta entradas con regla V del ledger", () => {
  test("una línea estricta no usa familia-V", () => {
    const { ledger } = compilar("Monitorización genera Evento de deterioro clínico.");
    const uso = usoFamiliaV(ledger);
    expect(uso.total).toBe(0);
    expect(uso.porRegla).toEqual({});
  });

  test("una línea laxa V6 reporta uso de V6", () => {
    // V5 `detecta` fue RETIRADA (F5-parcial); se usa V6 `compromete`, regla viva.
    const { ledger } = compilar("Ingreso HODOM compromete Capacidad de prestaciones.");
    const uso = usoFamiliaV(ledger);
    expect(uso.total).toBe(1);
    expect(uso.porRegla.V6).toBe(1);
  });

  test("control de no-tautología: una normalizada T2 (no-V) NO cuenta como familia-V", () => {
    // AESS (esencia sin 'un objeto') es normalizada con regla AESS, NO una V.
    const { ledger } = compilar("Cosa nueva es física y sistémica.");
    expect(usoFamiliaV(ledger).total).toBe(0);
  });
});

// ── Primera ola: migrable-estricto RETIRADA en F5-parcial (2026-06-08) ────────
// El de-risking (`derisk-f4-migrables.md (retirado 2a83c1c5, en git)`) probó equivalencia
// byte-idéntica laxo↔E2 para V3/V4/V5/V7 y autorizó retirar sus mappers. Ya NO
// existe la ruta laxa contra la cual comparar: la equivalencia F2 cumplió su
// función. Lo que queda es la GUARDA DE RETIRO — la laxa ya no se puentea
// (rechaza/falla, sin usar familia-V) y la E2 compila estricto (usoFamiliaV==0).

describe("F5-parcial: V3/V4/V5/V7 retiradas — laxo ya no se puentea, E2 compila estricto", () => {
  const retiradas = FIXTURES_FAMILIA_V.filter((f) => f.claseE2 === "estricto-reverse" && f.positivo);

  test("siguen registradas V3/V4/V5/V7 como las migrable-estricto (clasificación F2)", () => {
    const reglas = new Set(retiradas.map((f) => f.regla));
    expect(reglas.has("V3")).toBe(true);
    expect(reglas.has("V4")).toBe(true);
    expect(reglas.has("V5")).toBe(true);
    expect(reglas.has("V7")).toBe(true);
  });

  for (const f of retiradas) {
    test(`${f.regla}: la laxa ya NO usa familia-V (retirada); la E2 compila estricto sin familia-V`, () => {
      const laxo = compilar(f.laxo);
      // El mapper legacy se retiró: la laxa no puede aplicar su regla V.
      expect(usoFamiliaV(laxo.ledger).porRegla[f.regla] ?? 0).toBe(0);
      // La E2 estricta sigue compilando por la ruta canónica, sin familia-V.
      const e2 = compilar(f.e2!);
      expect(usoFamiliaV(e2.ledger).total).toBe(0);
    });
  }
});

// ── Clasificación honesta: requiere-decisión (NO se finge equivalencia) ──────

describe("F2 clasificación — reglas tagged/compuestas sin superficie reverse", () => {
  const requierenDecision = FIXTURES_FAMILIA_V.filter((f) => f.claseE2 === "requiere-decision" && f.positivo);

  test("hay reglas tagged que NO migran a texto estricto hoy", () => {
    expect(requierenDecision.length).toBeGreaterThan(0);
    const reglas = new Set(requierenDecision.map((f) => f.regla));
    expect(reglas.has("V8")).toBe(true); // sucede a — tagged solo-forward
  });

  for (const f of requierenDecision) {
    test(`${f.regla}: la forma laxa produce el hecho; la forma forward E2 NO lo reproduce por ruta estricta`, () => {
      const laxo = compilar(f.laxo);
      // La ruta laxa produce el hecho vía su regla V.
      expect(usoFamiliaV(laxo.ledger).porRegla[f.regla]).toBeGreaterThanOrEqual(1);
      // Si hay una forma forward candidata, demostrar que NO es reverse-equivalente
      // (brecha real: su salida E2 requiere transporte, no texto estricto).
      if (f.e2) {
        const e2 = compilar(f.e2);
        const distintoModelo = JSON.stringify(proyeccionObservable(e2.modelo)) !== JSON.stringify(proyeccionObservable(laxo.modelo));
        const e2UsaFamiliaV = usoFamiliaV(e2.ledger).total > 0;
        // O el modelo difiere (la forward no reprodujo el tagged), o tuvo que
        // volver a usar familia-V — en ningún caso es una migración limpia.
        expect(distintoModelo || e2UsaFamiliaV).toBe(true);
      }
    });
  }
});

// ── F3: auditoría usoFamiliaV por OPD + partición migrable/requiere-decisión ──

describe("F3 — auditoría usoFamiliaV por OPD y partición del veredicto F2", () => {
  test("MIGRABLE_ESTRICTO_F2 es exactamente {V3, V4, V5, V7}", () => {
    expect([...MIGRABLE_ESTRICTO_F2].sort()).toEqual(["V3", "V4", "V5", "V7"]);
  });

  test("usoFamiliaVPorOpd agrupa por OPD y suma igual que el total global", () => {
    // V6 `compromete` (regla viva) — V5 `detecta` fue retirada en F5-parcial.
    const { ledger } = compilar("Ingreso HODOM compromete Capacidad de prestaciones.");
    const porOpd = usoFamiliaVPorOpd(ledger);
    expect(Object.keys(porOpd).length).toBeGreaterThanOrEqual(1);
    const totalGlobal = Object.values(porOpd).reduce((acc, u) => acc + u.total, 0);
    expect(totalGlobal).toBe(usoFamiliaV(ledger).total);
    expect(totalGlobal).toBe(1);
  });

  test("una línea estricta no produce uso por OPD", () => {
    const { ledger } = compilar("Monitorización genera Evento de deterioro clínico.");
    expect(usoFamiliaVPorOpd(ledger)).toEqual({});
  });

  test("particionarUso separa migrable-estricto de requiere-decisión", () => {
    const part = particionarUso({ total: 3, porRegla: { V5: 1, V8: 1, V1: 1 } });
    expect(part.migrable).toEqual({ total: 1, porRegla: { V5: 1 } });
    expect(part.requiereDecision).toEqual({ total: 2, porRegla: { V8: 1, V1: 1 } });
  });

  test("particionarUso preserva el total (suma de ambas particiones)", () => {
    const uso = { total: 4, porRegla: { V3: 2, V4: 1, V11: 1 } };
    const part = particionarUso(uso);
    expect(part.migrable.total + part.requiereDecision.total).toBe(uso.total);
    expect(part.migrable.total).toBe(3); // V3×2 + V4×1
    expect(part.requiereDecision.total).toBe(1); // V11
  });
});

// ── Negativos del ledger F1: la skill no absorbe barro ───────────────────────

describe("F2 negativos — barro persiste como rechazo, no se normaliza", () => {
  // Solo los negativos que el LEGACY ya rechaza (rechazoLegacy !== false). Los
  // aspiracionales (V5- detecta-ciego) son deuda de la skill E2, documentada en
  // el reporte F2, no un aserto duro contra el compilador legacy.
  const negativos = FIXTURES_FAMILIA_V.filter((f) => !f.positivo && f.rechazoLegacy !== false);

  for (const f of negativos) {
    test(`${f.regla} negativo: «${f.laxo.slice(0, 40)}…» no compila a hecho silencioso`, () => {
      const { ledger } = compilar(f.laxo);
      const rechazadaOFallo = ledger.entradas.some((e) => e.tipo === "rechazada" || e.tipo === "fallo");
      const usoLegacy = usoFamiliaV(ledger).porRegla[f.regla] ?? 0;
      // Un negativo NO debe aplicarse como esa regla V; debe rechazarse/fallar,
      // o resolverse por otra regla (p.ej. V15 captura la disyunción de V3).
      expect(rechazadaOFallo || usoLegacy === 0).toBe(true);
    });
  }
});
