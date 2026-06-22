// TDD del sello de procedencia del bundle (W5.3 / L6).
//
// Diseño consensuado (acta mesa flujo-canónico 2026-06-04, líneas 52-53;
// glosario ELIMINADO 2026-06-09 — el proto es la fuente única autoral):
//   - El bundle emitido PORTA `{protoHash, autoriaVersion, layoutVersion}`.
//   - Staleness definida sobre ARTEFACTOS ESTABLES (hash de contenido del proto),
//     no sobre ids internos.
//   - Honestidad temporal: la divergencia REPORTA, no degrada — hasta F5+, el proto
//     sigue siendo el portador canónico de la trazabilidad legal aunque diverja.
//
// El kernel es PURO (sin IO): hashear contenido ya leído, construir el sello,
// comparar dos sellos. Quién lee archivos es el consumidor (script/piloto).

import { describe, expect, test } from "bun:test";
import {
  AUTORIA_VERSION,
  compararProcedencia,
  construirSello,
  hashContenido,
  hashDoctrina,
} from "./procedencia";
import { LAYOUT_VERSION } from "./layout";
import type { SelloProcedencia } from "../modelo/tipos";

// ── hashContenido: determinista, sensible al contenido ───────────────────────

describe("hashContenido", () => {
  test("mismo texto → mismo hash (determinista, sin reloj ni aleatoriedad)", () => {
    const a = hashContenido("# Proto v1.10\n\nHospitalización en domicilio.");
    const b = hashContenido("# Proto v1.10\n\nHospitalización en domicilio.");
    expect(a).toBe(b);
  });

  test("texto distinto → hash distinto (control de no-tautología de L6)", () => {
    const a = hashContenido("# Proto v1.10");
    const b = hashContenido("# Proto v1.11");
    expect(a).not.toBe(b);
  });

  test("un solo byte de diferencia cambia el hash (sensibilidad)", () => {
    expect(hashContenido("abc")).not.toBe(hashContenido("abd"));
    expect(hashContenido("")).not.toBe(hashContenido(" "));
  });

  test("formato estable: hex en minúsculas, no vacío", () => {
    const h = hashContenido("contenido");
    expect(h).toMatch(/^[0-9a-f]+$/);
    expect(h.length).toBeGreaterThanOrEqual(8);
  });
});

// ── construirSello: las 4 componentes del acta ────────────────────────────────

describe("construirSello", () => {
  test("porta las 3 componentes {protoHash, autoriaVersion, layoutVersion}", () => {
    const sello = construirSello({ protoTexto: "proto" });
    expect(sello.protoHash).toBe(hashContenido("proto"));
    expect(sello.autoriaVersion).toBe(AUTORIA_VERSION);
    expect(sello.layoutVersion).toBe(LAYOUT_VERSION);
  });

  test("glosario eliminado: el sello NO porta glosarioHash", () => {
    const sello = construirSello({ protoTexto: "proto" });
    expect("glosarioHash" in sello).toBe(false);
  });

  test("es función pura del contenido: mismos insumos → sello idéntico", () => {
    const a = construirSello({ protoTexto: "p" });
    const b = construirSello({ protoTexto: "p" });
    expect(a).toEqual(b);
  });
});

// ── compararProcedencia: detección de divergencia (L6) ───────────────────────

describe("compararProcedencia", () => {
  const base: SelloProcedencia = {
    protoHash: "aaaa",
    autoriaVersion: "1",
    layoutVersion: "1",
  };

  test("sellos idénticos → sin divergencia", () => {
    const d = compararProcedencia(base, { ...base });
    expect(d.divergente).toBe(false);
    expect(d.componentes).toEqual([]);
  });

  test("proto editado → divergencia SOLO en protoHash, con ambos valores reportados", () => {
    const d = compararProcedencia(base, { ...base, protoHash: "cccc" });
    expect(d.divergente).toBe(true);
    expect(d.componentes).toEqual([{ componente: "protoHash", bundle: "aaaa", actual: "cccc" }]);
  });

  test("versión de layout cambiada (re-pin deliberado) → divergencia en layoutVersion", () => {
    const d = compararProcedencia(base, { ...base, layoutVersion: "2" });
    expect(d.divergente).toBe(true);
    expect(d.componentes.map((c) => c.componente)).toEqual(["layoutVersion"]);
  });

  test("divergencia múltiple → todas las componentes, en orden estable del sello", () => {
    const d = compararProcedencia(base, {
      protoHash: "x",
      autoriaVersion: "9",
      layoutVersion: "9",
    });
    expect(d.divergente).toBe(true);
    expect(d.componentes.map((c) => c.componente)).toEqual([
      "protoHash",
      "autoriaVersion",
      "layoutVersion",
    ]);
  });
});

// ── hashDoctrina: testigo de deriva doctrinal (corte C2, D-DOCTRINA) ──────────

describe("hashDoctrina", () => {
  const SSOT = ["reglas v1.4", "spec-opd v1.1", "spec-opl v1.2", "metodología v1.5"];

  test("determinista: mismos textos en mismo orden → mismo hash", () => {
    expect(hashDoctrina(SSOT)).toBe(hashDoctrina([...SSOT]));
  });

  test("INSENSIBLE a whitespace cosmético: trim + colapso de líneas en blanco → mismo hash", () => {
    const cosmetico = [
      "  reglas v1.4  ",
      "spec-opd v1.1\n\n\n", // líneas en blanco extra al final (se colapsan + trim)
      "spec-opl v1.2",
      "metodología v1.5\n",
    ];
    expect(hashDoctrina(cosmetico)).toBe(hashDoctrina(SSOT));
  });

  test("INSENSIBLE a líneas en blanco internas duplicadas (colapso a una)", () => {
    const conSaltos = ["a\n\n\n\nb", "x"];
    const normal = ["a\n\nb", "x"];
    expect(hashDoctrina(conSaltos)).toBe(hashDoctrina(normal));
  });

  test("SENSIBLE a cambio real de contenido (control de no-tautología)", () => {
    const editado = ["reglas v1.5", "spec-opd v1.1", "spec-opl v1.2", "metodología v1.5"];
    expect(hashDoctrina(editado)).not.toBe(hashDoctrina(SSOT));
  });

  test("SENSIBLE al ORDEN (el orden lo fija el consumidor, es load-bearing)", () => {
    const reordenado = [SSOT[1]!, SSOT[0]!, SSOT[2]!, SSOT[3]!];
    expect(hashDoctrina(reordenado)).not.toBe(hashDoctrina(SSOT));
  });

  test("formato estable: hex en minúsculas, no vacío", () => {
    expect(hashDoctrina(SSOT)).toMatch(/^[0-9a-f]+$/);
  });
});

// ── construirSello: doctrinaVersion solo cuando se pasan textos ───────────────

describe("construirSello — doctrinaVersion (opcional, rollback-free)", () => {
  test("sin doctrinaTextos: el sello NO porta doctrinaVersion (byte-identidad legacy)", () => {
    const sello = construirSello({ protoTexto: "proto" });
    expect("doctrinaVersion" in sello).toBe(false);
  });

  test("doctrinaTextos vacío []: tampoco porta doctrinaVersion (length 0)", () => {
    const sello = construirSello({ protoTexto: "proto", doctrinaTextos: [] });
    expect("doctrinaVersion" in sello).toBe(false);
  });

  test("con doctrinaTextos: porta doctrinaVersion = hashDoctrina(textos)", () => {
    const textos = ["a", "b", "c", "d"];
    const sello = construirSello({ protoTexto: "proto", doctrinaTextos: textos });
    expect(sello.doctrinaVersion).toBe(hashDoctrina(textos));
  });

  test("los 3 requeridos no cambian al añadir doctrina (extensión aditiva)", () => {
    const sin = construirSello({ protoTexto: "proto" });
    const con = construirSello({ protoTexto: "proto", doctrinaTextos: ["x"] });
    expect(con.protoHash).toBe(sin.protoHash);
    expect(con.autoriaVersion).toBe(sin.autoriaVersion);
    expect(con.layoutVersion).toBe(sin.layoutVersion);
  });
});

// ── compararProcedencia: doctrinaVersion solo si presente en AMBOS ────────────

describe("compararProcedencia — doctrinaVersion (opcional)", () => {
  const base: SelloProcedencia = { protoHash: "aaaa", autoriaVersion: "1", layoutVersion: "1" };

  test("presente en ambos y DIFIERE → divergencia nombrada en doctrinaVersion", () => {
    const d = compararProcedencia(
      { ...base, doctrinaVersion: "dddd" },
      { ...base, doctrinaVersion: "eeee" },
    );
    expect(d.divergente).toBe(true);
    expect(d.componentes).toEqual([{ componente: "doctrinaVersion", bundle: "dddd", actual: "eeee" }]);
  });

  test("presente en ambos e IGUAL → sin divergencia", () => {
    const d = compararProcedencia(
      { ...base, doctrinaVersion: "dddd" },
      { ...base, doctrinaVersion: "dddd" },
    );
    expect(d.divergente).toBe(false);
  });

  test("ausente en uno (sello legacy de 3) → NO se compara, no diverge", () => {
    const dBundleLegacy = compararProcedencia(base, { ...base, doctrinaVersion: "eeee" });
    expect(dBundleLegacy.divergente).toBe(false);
    const dActualLegacy = compararProcedencia({ ...base, doctrinaVersion: "dddd" }, base);
    expect(dActualLegacy.divergente).toBe(false);
  });

  test("orden estable: requeridos primero, opcionales después", () => {
    const d = compararProcedencia(
      { protoHash: "a", autoriaVersion: "1", layoutVersion: "1", doctrinaVersion: "d1" },
      { protoHash: "b", autoriaVersion: "1", layoutVersion: "1", doctrinaVersion: "d2" },
    );
    expect(d.componentes.map((c) => c.componente)).toEqual(["protoHash", "doctrinaVersion"]);
  });
});
