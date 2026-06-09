// Golden-harness de reproducibilidad (H2, upstream hd-opm). Regenera el bundle
// desde un proto (o toma un modelo ya emitido) y lo compara byte a byte contra un
// golden versionado. Reemplaza el ritual `md5sum` manual del dogfood por un
// comando pass/fail con diagnostico: que componente del sello cambio + primeras
// lineas divergentes.
//
// Uso:
//   bun run verify:reproducible --proto  <md>   --golden <bundle.json> [--max-diff N]
//   bun run verify:reproducible --modelo <json> --golden <bundle.json> [--max-diff N]
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { emitirBundle } from "../src/autoria/bundle";
import { compilarProto } from "../src/autoria/compilar/compilador";
import { construirSello } from "../src/autoria/procedencia";
import { compararReproducibilidad } from "../src/autoria/reproducibilidad";

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i]!;
    if (a.startsWith("--")) {
      const val = argv[i + 1] && !argv[i + 1]!.startsWith("--") ? argv[++i]! : "true";
      args[a.slice(2)] = val;
    }
  }
  return args;
}

function morir(msg: string, code: number): never {
  console.error(`[verify:reproducible] ${msg}`);
  process.exit(code);
}

const args = parseArgs(process.argv.slice(2));
if (!args.golden) morir("falta --golden <bundle.json>", 2);
if (!args.proto && !args.modelo) morir("falta --proto <md> o --modelo <json>", 2);
if (args.proto && args.modelo) morir("--proto y --modelo son mutuamente excluyentes", 2);

const golden = readFileSync(args.golden, "utf8");
let generado: string;
let protoHash: string | undefined;
if (args.proto) {
  const md = readFileSync(args.proto, "utf8");
  // Mismas opciones que el dogfood del consumidor: sin sello inyectado (byte-identidad
  // con goldens estandar) y sin abortar por advertencias de canon.
  generado = emitirBundle(compilarProto(md, { nombre: basename(args.proto).replace(/\.[^.]+$/, "") }).autor, { lanzarEnError: false }).json;
  protoHash = construirSello({ protoTexto: md }).protoHash;
} else {
  generado = readFileSync(args.modelo!, "utf8");
}

const r = compararReproducibilidad(generado, golden, { maxDiferencias: Number(args["max-diff"]) || 5 });

if (protoHash) console.log(`[verify:reproducible] protoHash actual: ${protoHash}`);

if (r.byteIdentico) {
  console.log(`[verify:reproducible] PASS — byte-identico (${r.bytesGenerado} chars)`);
  process.exit(0);
}

console.error(`[verify:reproducible] FAIL — difiere (generado ${r.bytesGenerado} vs golden ${r.bytesEsperado} chars)`);
if (r.procedencia?.divergente) {
  console.error("  sello divergente (causa):");
  for (const c of r.procedencia.componentes) {
    console.error(`    ${c.componente}: golden '${c.bundle}' → regenerado '${c.actual}'`);
  }
}
console.error(`  primeras ${r.primerasDiferencias.length} linea(s) divergente(s):`);
for (const d of r.primerasDiferencias) {
  console.error(`    L${d.linea}:`);
  console.error(`      - golden:     ${d.esperado ?? "(falta)"}`);
  console.error(`      + regenerado: ${d.generado ?? "(falta)"}`);
}
process.exit(1);
