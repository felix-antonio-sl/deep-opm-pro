// Smoke E2E del render headless (H1): corre el CLI real sobre un proto mínimo y
// valida la salida en <out>/. Levanta Vite efímero + Chromium vía el propio
// script — autónomo, no necesita dev server previo. Pesado (~30-60s); NO va en
// `bun run check`. Uso: bun run render:headless:smoke
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer as crearServidorHttp } from "node:http";
import { createServer as crearServidorTcp } from "node:net";
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
// Puerto fijo para el efímero, distinto del default (5199), de forma que podamos
// (a) comprobar que no queda un huérfano escuchándolo tras una corrida normal y
// (b) ocuparlo con un server ajeno y verificar que el CLI FALLA (H1H2-01).
const PUERTO_EFIMERO = 5293;
const fallas: string[] = [];
function chequear(ok: boolean, msg: string) {
  console.log(`${ok ? "[OK]" : "[X]"} ${msg}`);
  if (!ok) fallas.push(msg);
}

/** Resuelve true si NADIE escucha el puerto (intenta bindear y libera). */
function puertoLibre(puerto: number): Promise<boolean> {
  return new Promise((res) => {
    const s = crearServidorTcp();
    s.once("error", () => res(false));
    s.once("listening", () => s.close(() => res(true)));
    s.listen(puerto, "127.0.0.1");
  });
}

const appDir = resolve(import.meta.dirname, "..");
const dir = mkdtempSync(resolve(tmpdir(), "render-headless-smoke-"));
const protoPath = resolve(dir, "cafe.proto.md");
const outDir = resolve(dir, "out");
writeFileSync(protoPath, PROTO_CAFE, "utf8");

const correrCliEn = (salida: string, extra: string[]) =>
  spawnSync(
    "bun",
    ["run", "scripts/render-headless.ts", "--proto", protoPath, "--out", salida, "--port", String(PUERTO_EFIMERO), ...extra],
    { cwd: appDir, encoding: "utf8", timeout: 120_000, stdio: ["ignore", "pipe", "pipe"] },
  );

try {
  const r = correrCliEn(outDir, []);
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  chequear(r.status === 0, `el CLI termina con exit 0 (fue ${r.status})`);

  // H1H2-01: una corrida normal NO deja un Vite huérfano escuchando el puerto.
  chequear(await puertoLibre(PUERTO_EFIMERO), `el puerto ${PUERTO_EFIMERO} queda libre (sin Vite huérfano) tras una corrida normal`);

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

  // H1H2-04: --solo-opd con id inexistente NO es un no-op silencioso: error.txt + exit 2.
  {
    const outSolo = resolve(dir, "out-solo");
    const rs = spawnSync(
      "bun",
      ["run", "scripts/render-headless.ts", "--proto", protoPath, "--out", outSolo, "--port", String(PUERTO_EFIMERO), "--solo-opd", "opd-inexistente"],
      { cwd: appDir, encoding: "utf8", timeout: 120_000, stdio: ["ignore", "pipe", "pipe"] },
    );
    chequear(rs.status === 2, `--solo-opd inexistente → exit 2 (fue ${rs.status})`);
    const errSolo = existsSync(resolve(outSolo, "error.txt")) ? readFileSync(resolve(outSolo, "error.txt"), "utf8") : "";
    chequear(/no existe; disponibles:/.test(errSolo), "--solo-opd inexistente deja error.txt con los OPDs disponibles");
    chequear(!existsSync(resolve(outSolo, "00-indice.json")), "--solo-opd inexistente NO escribe índice (sin no-op silencioso)");
  }

  // H1H2-01: con el puerto ocupado por un server AJENO (que responde 200, como lo
  // haría un huérfano stale), el CLI debe FALLAR en vez de renderizar contra él.
  {
    const ajeno = crearServidorHttp((_req, res) => { res.writeHead(200); res.end("ajeno"); });
    await new Promise<void>((res) => ajeno.listen(PUERTO_EFIMERO, "127.0.0.1", res));
    try {
      const outAjeno = resolve(dir, "out-ajeno");
      const ra = correrCliEn(outAjeno, []);
      chequear(ra.status !== 0, `con :${PUERTO_EFIMERO} ocupado por un server ajeno, el CLI FALLA en vez de reusar el stale (exit ${ra.status})`);
      chequear(!existsSync(resolve(outAjeno, "00-indice.json")), "puerto ocupado → no escribe índice (no renderiza contra el ajeno)");
    } finally {
      await new Promise<void>((res) => ajeno.close(() => res()));
    }
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}

if (fallas.length > 0) {
  console.error(`\n[render:headless:smoke] ${fallas.length} falla(s).`);
  process.exit(1);
}
console.log("\n[render:headless:smoke] OK — render fiel por OPD + artefactos textuales.");
