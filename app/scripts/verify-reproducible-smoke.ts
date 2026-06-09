// Smoke del golden-harness H2 (sin navegador, rapido). Genera un golden desde un
// proto, verifica que regenerar da PASS, y que un golden alterado da FAIL con
// lineas divergentes. Uso: bun run verify:reproducible:smoke
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { emitirBundle } from "../src/autoria/bundle";
import { compilarProto } from "../src/autoria/compilar/compilador";

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

const fallas: string[] = [];
function chequear(ok: boolean, msg: string) {
  console.log(`${ok ? "[OK]" : "[X]"} ${msg}`);
  if (!ok) fallas.push(msg);
}

const appDir = resolve(import.meta.dirname, "..");
const dir = mkdtempSync(resolve(tmpdir(), "verify-reproducible-smoke-"));
const proto = resolve(dir, "cafe.md");
const golden = resolve(dir, "golden.json");
const goldenMut = resolve(dir, "golden-mutado.json");

try {
  writeFileSync(proto, PROTO_CAFE, "utf8");
  // Golden de referencia, mismas opciones que el CLI --proto (lanzarEnError:false, sin sello).
  const json = emitirBundle(compilarProto(PROTO_CAFE, { nombre: "cafe" }).autor, { lanzarEnError: false }).json;
  writeFileSync(golden, json, "utf8");
  writeFileSync(goldenMut, json.replace("deep-opm-pro.modelo.v0", "deep-opm-pro.modelo.vX"), "utf8");

  const correr = (g: string) =>
    spawnSync("bun", ["run", "scripts/verify-reproducible.ts", "--proto", proto, "--golden", g], { cwd: appDir, encoding: "utf8" });

  const pass = correr(golden);
  chequear(pass.status === 0, `regenerar el mismo proto → PASS (exit 0, fue ${pass.status})`);
  chequear(/PASS/.test(pass.stdout ?? ""), "el caso idéntico imprime PASS");
  chequear(/protoHash actual:/.test(pass.stdout ?? ""), "reporta el protoHash actual (trazabilidad)");

  const fail = correr(goldenMut);
  chequear(fail.status === 1, `golden alterado → FAIL (exit 1, fue ${fail.status})`);
  chequear(/FAIL/.test(fail.stderr ?? ""), "el caso divergente imprime FAIL");
  chequear(/L\d+:/.test(fail.stderr ?? ""), "el FAIL reporta al menos una línea divergente con su número");
} finally {
  rmSync(dir, { recursive: true, force: true });
}

if (fallas.length > 0) {
  console.error(`\n[verify:reproducible:smoke] ${fallas.length} falla(s).`);
  process.exit(1);
}
console.log("\n[verify:reproducible:smoke] OK — pass/fail + diagnóstico de líneas.");
