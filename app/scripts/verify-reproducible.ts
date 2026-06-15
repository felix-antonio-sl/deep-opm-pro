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

/** Lectura tolerante: el fallo de IO/uso es exit 2 con mensaje legible (NO stacktrace);
 *  el exit 1 queda reservado ESTRICTAMENTE a la divergencia byte (H1H2-03). */
function leerArchivo(ruta: string): string {
  try {
    return readFileSync(ruta, "utf8");
  } catch (e) {
    morir(`no se pudo leer ${ruta}: ${e instanceof Error ? e.message : String(e)}`, 2);
  }
}

/** El bundle porta sello cuando su JSON expone `modelo.procedencia`. */
function bundlePortaSello(json: string): boolean {
  try {
    return Boolean((JSON.parse(json) as { modelo?: { procedencia?: unknown } }).modelo?.procedencia);
  } catch {
    return false;
  }
}

const args = parseArgs(process.argv.slice(2));
if (!args.golden) morir("falta --golden <bundle.json>", 2);
if (!args.proto && !args.modelo) morir("falta --proto <md> o --modelo <json>", 2);
if (args.proto && args.modelo) morir("--proto y --modelo son mutuamente excluyentes", 2);

const golden = leerArchivo(args.golden);
let generado: string;
let protoHash: string | undefined;
if (args.proto) {
  const md = leerArchivo(args.proto);
  // H1H2-02: si el golden PORTA sello, inyectamos el sello recién computado en la
  // regeneración para que un FAIL pueda nombrar la componente divergente
  // (protoHash/autoriaVersion/layoutVersion). Si el golden NO lleva sello, regeneramos
  // sin enriquecer para preservar byte-identidad con goldens estándar.
  const sello = construirSello({ protoTexto: md });
  protoHash = sello.protoHash;
  const opcionesProcedencia = bundlePortaSello(golden) ? { procedencia: sello } : {};
  // Mismas opciones que el dogfood del consumidor: sin abortar por advertencias de canon.
  generado = emitirBundle(compilarProto(md, { nombre: basename(args.proto).replace(/\.[^.]+$/, "") }).autor, {
    lanzarEnError: false,
    ...opcionesProcedencia,
  }).json;
} else {
  generado = leerArchivo(args.modelo!);
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
