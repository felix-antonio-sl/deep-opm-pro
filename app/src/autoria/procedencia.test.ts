// TDD del sello de procedencia del bundle (W5.3 / L6).
//
// Diseño consensuado (acta mesa flujo-canónico 2026-06-04, líneas 52-53):
//   - El bundle emitido PORTA `{protoHash, glosarioHash, autoriaVersion, layoutVersion}`.
//   - Staleness definida sobre ARTEFACTOS ESTABLES (hashes de contenido de archivos),
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
  test("porta las 4 componentes {protoHash, glosarioHash, autoriaVersion, layoutVersion}", () => {
    const sello = construirSello({ protoTexto: "proto", glosarioTexto: "glosario" });
    expect(sello.protoHash).toBe(hashContenido("proto"));
    expect(sello.glosarioHash).toBe(hashContenido("glosario"));
    expect(sello.autoriaVersion).toBe(AUTORIA_VERSION);
    expect(sello.layoutVersion).toBe(LAYOUT_VERSION);
  });

  test("es función pura del contenido: mismos insumos → sello idéntico", () => {
    const a = construirSello({ protoTexto: "p", glosarioTexto: "g" });
    const b = construirSello({ protoTexto: "p", glosarioTexto: "g" });
    expect(a).toEqual(b);
  });
});

// ── compararProcedencia: detección de divergencia (L6) ───────────────────────

describe("compararProcedencia", () => {
  const base: SelloProcedencia = {
    protoHash: "aaaa",
    glosarioHash: "bbbb",
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

  test("glosario editado → divergencia SOLO en glosarioHash", () => {
    const d = compararProcedencia(base, { ...base, glosarioHash: "dddd" });
    expect(d.divergente).toBe(true);
    expect(d.componentes.map((c) => c.componente)).toEqual(["glosarioHash"]);
  });

  test("versión de layout cambiada (re-pin deliberado) → divergencia en layoutVersion", () => {
    const d = compararProcedencia(base, { ...base, layoutVersion: "2" });
    expect(d.divergente).toBe(true);
    expect(d.componentes.map((c) => c.componente)).toEqual(["layoutVersion"]);
  });

  test("divergencia múltiple → todas las componentes, en orden estable del sello", () => {
    const d = compararProcedencia(base, {
      protoHash: "x",
      glosarioHash: "y",
      autoriaVersion: "9",
      layoutVersion: "9",
    });
    expect(d.divergente).toBe(true);
    expect(d.componentes.map((c) => c.componente)).toEqual([
      "protoHash",
      "glosarioHash",
      "autoriaVersion",
      "layoutVersion",
    ]);
  });
});
