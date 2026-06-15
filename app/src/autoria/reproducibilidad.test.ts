import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { describe, expect, test } from "bun:test";
import { emitirBundle } from "./bundle";
import { compilarProto } from "./compilar/compilador";
import { construirSello } from "./procedencia";
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

// Integración del CLI `verify-reproducible.ts` (golden-harness H2): robustez del
// camino --proto (H1H2-02: el sello recién computado debe inyectarse para que el
// FAIL nombre la componente divergente) y de la semántica de exit codes (H1H2-03:
// exit 2 = error de IO/uso, exit 1 ESTRICTAMENTE = divergencia byte).
describe("CLI verify-reproducible.ts", () => {
  const appDir = resolve(import.meta.dirname, "..", "..");
  const script = "scripts/verify-reproducible.ts";

  function correr(args: string[]) {
    return spawnSync("bun", ["run", script, ...args], { cwd: appDir, encoding: "utf8" });
  }

  function conTmp<T>(fn: (dir: string) => T): T {
    const dir = mkdtempSync(resolve(tmpdir(), "verify-reproducible-test-"));
    try {
      return fn(dir);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }

  // H1H2-02: golden CON sello + regeneración cuya autoriaVersion/layoutVersion difiere
  // del golden → el FAIL nombra la componente divergente del sello.
  test("golden con sello divergente → el FAIL nombra la componente del sello", () => {
    conTmp((dir) => {
      const proto = resolve(dir, "cafe.md");
      const golden = resolve(dir, "golden.json");
      writeFileSync(proto, PROTO_CAFE, "utf8");
      // Golden CON sello, pero con autoriaVersion/layoutVersion antiguos (re-pin):
      // así la regeneración (que inyecta el sello vigente) diverge en esas componentes.
      const selloAntiguo = { ...construirSello({ protoTexto: PROTO_CAFE }), autoriaVersion: "0", layoutVersion: "0" };
      const json = emitirBundle(compilarProto(PROTO_CAFE, { nombre: "cafe" }).autor, {
        lanzarEnError: false,
        procedencia: selloAntiguo,
      }).json;
      writeFileSync(golden, json, "utf8");

      const r = correr(["--proto", proto, "--golden", golden]);

      expect(r.status).toBe(1);
      expect(r.stderr ?? "").toContain("sello divergente");
      // Debe nombrar al menos una de las componentes del sello que cambiaron.
      expect(/autoriaVersion|layoutVersion/.test(r.stderr ?? "")).toBe(true);
    });
  });

  // H1H2-02: golden SIN sello → la regeneración tampoco gana sello (byte-identidad).
  test("golden sin sello → regenerar el mismo proto da PASS (byte-idéntico)", () => {
    conTmp((dir) => {
      const proto = resolve(dir, "cafe.md");
      const golden = resolve(dir, "golden.json");
      writeFileSync(proto, PROTO_CAFE, "utf8");
      const json = emitirBundle(compilarProto(PROTO_CAFE, { nombre: "cafe" }).autor, { lanzarEnError: false }).json;
      writeFileSync(golden, json, "utf8");

      const r = correr(["--proto", proto, "--golden", golden]);

      expect(r.status).toBe(0);
      expect(r.stdout ?? "").toContain("PASS");
    });
  });

  // H1H2-03: golden inexistente → exit 2 (error de IO/uso) + mensaje legible, NO stacktrace.
  test("golden inexistente → exit 2 + mensaje legible (no stacktrace)", () => {
    conTmp((dir) => {
      const proto = resolve(dir, "cafe.md");
      writeFileSync(proto, PROTO_CAFE, "utf8");
      const goldenInexistente = resolve(dir, "no-existe.json");

      const r = correr(["--proto", proto, "--golden", goldenInexistente]);

      expect(r.status).toBe(2);
      expect(r.stderr ?? "").toContain("no se pudo leer");
      expect(r.stderr ?? "").not.toContain("at ");
    });
  });

  // H1H2-03: proto inexistente → exit 2 (no exit 1, que se reserva a divergencia byte).
  test("proto inexistente → exit 2 + mensaje legible", () => {
    conTmp((dir) => {
      const golden = resolve(dir, "golden.json");
      writeFileSync(golden, "{}", "utf8");
      const protoInexistente = resolve(dir, "no-existe.md");

      const r = correr(["--proto", protoInexistente, "--golden", golden]);

      expect(r.status).toBe(2);
      expect(r.stderr ?? "").toContain("no se pudo leer");
      expect(r.stderr ?? "").not.toContain("at ");
    });
  });
});
