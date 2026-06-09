import { describe, expect, test } from "bun:test";
import { emitirBundle } from "./bundle";
import { compilarProto } from "./compilar/compilador";
import { compararReproducibilidad, verificarReproducibilidad } from "./reproducibilidad";

// Proto mínimo canónicamente limpio (sin doble rol agente/instrumento).
const PROTO_CAFE = `# SD0 — Hacer café (sistema)

\`\`\`opl
Hacer café es físico y sistémico.
Persona es física y ambiental.
Persona maneja Hacer café.
Cafetera es física y sistémica.
Hacer café requiere Cafetera.
Agua es física y ambiental.
Hacer café consume Agua.
Café es físico y ambiental.
Hacer café genera Café.
Café puede estar 'caliente' o 'frío'.
\`\`\`
`;

function bundleConSello(protoHash: string): string {
  return JSON.stringify(
    { formato: "deep-opm-pro.modelo.v0", modelo: { id: "m", nombre: "M", procedencia: { protoHash, autoriaVersion: "1", layoutVersion: "2" } } },
    null,
    2,
  );
}

describe("compararReproducibilidad", () => {
  test("byte-idéntico → ok sin diferencias", () => {
    const a = '{"formato":"deep-opm-pro.modelo.v0","modelo":{"id":"m"}}';

    const r = compararReproducibilidad(a, a);

    expect(r.byteIdentico).toBe(true);
    expect(r.primerasDiferencias).toEqual([]);
    expect(r.bytesGenerado).toBe(a.length);
  });

  test("una línea distinta → byteIdentico false + esa línea reportada con su número", () => {
    const esperado = '{\n  "a": 1,\n  "b": 2\n}';
    const generado = '{\n  "a": 1,\n  "b": 3\n}';

    const r = compararReproducibilidad(generado, esperado);

    expect(r.byteIdentico).toBe(false);
    expect(r.primerasDiferencias).toHaveLength(1);
    expect(r.primerasDiferencias[0]!.linea).toBe(3);
    expect(r.primerasDiferencias[0]!.esperado).toContain('"b": 2');
    expect(r.primerasDiferencias[0]!.generado).toContain('"b": 3');
  });

  test("protoHash distinto en el sello → procedencia nombra el componente", () => {
    const r = compararReproducibilidad(bundleConSello("aaa"), bundleConSello("bbb"));

    expect(r.byteIdentico).toBe(false);
    expect(r.procedencia?.divergente).toBe(true);
    expect(r.procedencia?.componentes.some((c) => c.componente === "protoHash")).toBe(true);
  });

  test("maxDiferencias limita el reporte", () => {
    const esperado = Array.from({ length: 10 }, (_, i) => `linea ${i}`).join("\n");
    const generado = Array.from({ length: 10 }, (_, i) => `LINEA ${i}`).join("\n");

    const r = compararReproducibilidad(generado, esperado, { maxDiferencias: 3 });

    expect(r.byteIdentico).toBe(false);
    expect(r.primerasDiferencias).toHaveLength(3);
  });
});

describe("verificarReproducibilidad", () => {
  test("recompilar el mismo proto es byte-idéntico al golden", () => {
    const golden = emitirBundle(compilarProto(PROTO_CAFE, { nombre: "cafe" }).autor, {}).json;

    const r = verificarReproducibilidad(compilarProto(PROTO_CAFE, { nombre: "cafe" }).autor, golden);

    expect(r.byteIdentico).toBe(true);
  });
});
