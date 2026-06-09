// Smoke E2E del render headless (H1): corre el CLI real sobre un proto mínimo y
// valida la salida en <out>/. Levanta Vite efímero + Chromium vía el propio
// script — autónomo, no necesita dev server previo. Pesado (~30-60s); NO va en
// `bun run check`. Uso: bun run render:headless:smoke
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

// Proto mínimo válido (SD + in-zoom) tomado del fixture del compilador.
const PROTO_CAFE = `# SD0 — Hacer café (sistema)

Visión sistémica de la cafetera (prosa libre, no compila).

\`\`\`opl
Hacer café es físico y sistémico.
Persona es física y ambiental.
Persona maneja Hacer café.
Cafetera es física y sistémica.
Cafetera maneja Hacer café.
Hacer café requiere Cafetera.
Agua es física y ambiental.
Hacer café consume Agua.
Café es físico y ambiental.
Hacer café genera Café.
Café puede estar 'caliente' o 'frío'.
\`\`\`

Razonamiento del modelador entre bloques.

# SD1 — in-zoom de Hacer café

\`\`\`opl
Hacer café se descompone en Calentar agua y Verter.
Calentar agua y Verter son físicas y sistémicas.
Calentar agua consume Agua.
Calentar agua cambia Café de 'frío' a 'caliente'.
Verter genera Café.
\`\`\`
`;

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47];
const fallas: string[] = [];
function chequear(ok: boolean, msg: string) {
  console.log(`${ok ? "[OK]" : "[X]"} ${msg}`);
  if (!ok) fallas.push(msg);
}

const appDir = resolve(import.meta.dirname, "..");
const dir = mkdtempSync(resolve(tmpdir(), "render-headless-smoke-"));
const protoPath = resolve(dir, "cafe.proto.md");
const outDir = resolve(dir, "out");
writeFileSync(protoPath, PROTO_CAFE, "utf8");

try {
  const r = spawnSync("bun", ["run", "scripts/render-headless.ts", "--proto", protoPath, "--out", outDir], {
    cwd: appDir,
    encoding: "utf8",
    timeout: 120_000,
    stdio: ["ignore", "inherit", "inherit"],
  });
  chequear(r.status === 0, `el CLI termina con exit 0 (fue ${r.status})`);

  const indicePath = resolve(outDir, "00-indice.json");
  chequear(existsSync(indicePath), "00-indice.json existe");
  if (existsSync(indicePath)) {
    const indice = JSON.parse(readFileSync(indicePath, "utf8")) as {
      opds: { orden: number; opdId: string; nombre: string; png: string; svg: string }[];
      procedenciaHash?: string;
    };
    chequear(indice.opds.length === 2, `el índice lista 2 OPDs (SD0 + SD1) — fueron ${indice.opds.length}`);
    chequear(indice.opds[0]?.orden === 1, "el primer OPD tiene orden 1 (raíz BFS)");
    chequear(Boolean(indice.procedenciaHash), "el índice porta procedenciaHash (sello del proto)");

    for (const o of indice.opds) {
      const png = resolve(outDir, o.png);
      const svg = resolve(outDir, o.svg);
      const okPng =
        existsSync(png) && PNG_MAGIC.every((b, i) => readFileSync(png)[i] === b);
      chequear(okPng, `${o.png} es un PNG válido (magic bytes)`);
      const svgTxt = existsSync(svg) ? readFileSync(svg, "utf8") : "";
      chequear(svgTxt.includes("<svg"), `${o.svg} contiene <svg`);
      chequear(/viewBox=/.test(svgTxt), `${o.svg} tiene viewBox (encuadre fiel, no fallback 1x1)`);
    }
  }

  for (const f of ["opl.md", "reporte.md", "procedencia.json", "avisos.json", "ledger.json", "conteos.json"]) {
    chequear(existsSync(resolve(outDir, f)), `artefacto textual ${f} escrito`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}

if (fallas.length > 0) {
  console.error(`\n[render:headless:smoke] ${fallas.length} falla(s).`);
  process.exit(1);
}
console.log("\n[render:headless:smoke] OK — render fiel por OPD + artefactos textuales.");
