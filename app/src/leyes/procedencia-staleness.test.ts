// LEY L6 — Procedencia y staleness del bundle emitido (W5.3).
//
// Enunciado (acta mesa flujo-canónico 2026-06-04, líneas 52-53 + backlog W5.3):
//
//   (a) Un bundle emitido con sello de procedencia PORTA el sello en su JSON y el
//       sello sobrevive al round-trip de serialización (exportar → hidratar).
//   (b) FIXTURE NEGATIVO: si el proto (o el glosario) se edita DESPUÉS de la
//       emisión, la comparación del sello del bundle contra el sello recomputado
//       DETECTA la divergencia y nombra exactamente la componente divergente.
//   (c) Honestidad temporal: la divergencia REPORTA (ambos valores), no descarta —
//       el proto sigue siendo el portador canónico de la trazabilidad legal.
//   (d) Byte-identidad: un bundle emitido SIN procedencia no gana la clave en el
//       JSON ni líneas en el reporte (los consumidores existentes —generador
//       hd-opm— regeneran byte-a-byte).
//
// Control de no-tautología: (b) se acompaña del positivo (mismo proto → sin
// divergencia); si hashContenido devolviera una constante, (b) fallaría.

import { describe, expect, test } from "bun:test";
import { emitirBundle } from "../autoria/bundle";
import { construirSello, compararProcedencia } from "../autoria/procedencia";
import { construirCafetera } from "../autoria/_fixtures/cafetera";
import { hidratarModelo } from "../serializacion/json";

const PROTO_V1 = "# Proto cafetera v1\n\nCafetera maneja Preparación de café.\n";
const GLOSARIO_V1 = "# Glosario cafetera v1\n\n- Cafetera: máquina física.\n";

describe("L6 — el sello viaja en el bundle y sobrevive al round-trip", () => {
  test("(a) bundle con procedencia: el JSON porta el sello y la hidratación lo conserva", () => {
    const sello = construirSello({ protoTexto: PROTO_V1, glosarioTexto: GLOSARIO_V1 });
    const bundle = emitirBundle(construirCafetera(), { procedencia: sello });
    const parsed = JSON.parse(bundle.json) as { modelo: { procedencia?: unknown } };
    expect(parsed.modelo.procedencia).toEqual(sello);

    const hidratado = hidratarModelo(bundle.json);
    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) throw new Error("nunca");
    expect(hidratado.value.procedencia).toEqual(sello);
  });

  test("(a') el reporte del bundle declara la procedencia cuando existe", () => {
    const sello = construirSello({ protoTexto: PROTO_V1, glosarioTexto: GLOSARIO_V1 });
    const bundle = emitirBundle(construirCafetera(), { procedencia: sello });
    expect(bundle.reporte).toContain(sello.protoHash);
    expect(bundle.reporte).toContain(sello.glosarioHash);
  });
});

describe("L6 — fixture negativo: la edición posterior del insumo SE DETECTA", () => {
  test("(b) proto editado tras la emisión → divergencia en protoHash (y solo ahí)", () => {
    // Emisión: el bundle queda sellado con el proto v1.
    const selloEmision = construirSello({ protoTexto: PROTO_V1, glosarioTexto: GLOSARIO_V1 });
    const bundle = emitirBundle(construirCafetera(), { procedencia: selloEmision });
    const hidratado = hidratarModelo(bundle.json);
    if (!hidratado.ok) throw new Error("bundle inválido");
    const selloBundle = hidratado.value.procedencia!;

    // El dominio evoluciona: alguien edita el proto DESPUÉS de emitir.
    const PROTO_V2 = PROTO_V1 + "Cafetera exhibe Capacidad.\n";
    const selloActual = construirSello({ protoTexto: PROTO_V2, glosarioTexto: GLOSARIO_V1 });

    const d = compararProcedencia(selloBundle, selloActual);
    expect(d.divergente).toBe(true);
    expect(d.componentes.map((c) => c.componente)).toEqual(["protoHash"]);
    // (c) honestidad temporal: ambos valores viajan en el reporte de divergencia.
    expect(d.componentes[0]!.bundle).toBe(selloEmision.protoHash);
    expect(d.componentes[0]!.actual).toBe(selloActual.protoHash);
  });

  test("(b-positivo, control de no-tautología) mismos insumos → sin divergencia", () => {
    const selloEmision = construirSello({ protoTexto: PROTO_V1, glosarioTexto: GLOSARIO_V1 });
    const bundle = emitirBundle(construirCafetera(), { procedencia: selloEmision });
    const hidratado = hidratarModelo(bundle.json);
    if (!hidratado.ok) throw new Error("bundle inválido");

    const selloActual = construirSello({ protoTexto: PROTO_V1, glosarioTexto: GLOSARIO_V1 });
    const d = compararProcedencia(hidratado.value.procedencia!, selloActual);
    expect(d.divergente).toBe(false);
    expect(d.componentes).toEqual([]);
  });
});

describe("L6 — byte-identidad de los consumidores sin procedencia", () => {
  test("(d) bundle sin procedencia: el JSON no gana la clave ni el reporte líneas", () => {
    const bundle = emitirBundle(construirCafetera());
    expect(bundle.json).not.toContain('"procedencia"');
    expect(bundle.reporte.toLowerCase()).not.toContain("procedencia");
  });

  test("(d') emitir con y sin procedencia: el JSON difiere SOLO en el sello", () => {
    const sello = construirSello({ protoTexto: PROTO_V1, glosarioTexto: GLOSARIO_V1 });
    const sin = emitirBundle(construirCafetera());
    const con = emitirBundle(construirCafetera(), { procedencia: sello });
    const parsedSin = JSON.parse(sin.json) as { modelo: Record<string, unknown> };
    const parsedCon = JSON.parse(con.json) as { modelo: Record<string, unknown> };
    delete parsedCon.modelo.procedencia;
    expect(parsedCon).toEqual(parsedSin);
  });
});

describe("L6 — la serialización valida el sello (extensión aditiva)", () => {
  test("sello malformado (componente faltante) → hidratación RECHAZA con diagnóstico", () => {
    const sello = construirSello({ protoTexto: PROTO_V1, glosarioTexto: GLOSARIO_V1 });
    const bundle = emitirBundle(construirCafetera(), { procedencia: sello });
    const doc = JSON.parse(bundle.json) as { modelo: { procedencia: Record<string, unknown> } };
    delete doc.modelo.procedencia.protoHash;
    const res = hidratarModelo(JSON.stringify(doc));
    expect(res.ok).toBe(false);
    if (res.ok) throw new Error("nunca");
    expect(res.error).toContain("procedencia");
  });
});
