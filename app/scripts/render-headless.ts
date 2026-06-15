// Render headless de un proto/modelo OPM → imágenes (PNG+SVG) por OPD (H1, upstream hd-opm).
//
// Le da "ojos" a un consumidor agente: compila el proto (Node puro) y conduce un
// Vite efímero + Chromium para producir un render FIEL a lo que opforja muestra,
// sin abrir la UI ni intervención humana. Read-through: jamás escribe de vuelta
// al proto ni al dominio.
//
// Uso:
//   bun run render:headless --proto  <ruta.md>   --out <dir> [opciones]
//   bun run render:headless --modelo <ruta.json> --out <dir> [opciones]
// Opciones: --fondo blanco|transparente (def. blanco) · --solo-opd <opdId>
//           --url <u> (usar un dev server ya levantado CON el flag, en vez del efímero)
//           --port <n> (puerto del Vite efímero; def. 5199)
import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { createServer } from "vite";
import { emitirBundle } from "../src/autoria/bundle";
import { compilarProto } from "../src/autoria/compilar/compilador";
import { construirSello } from "../src/autoria/procedencia";
import { seleccionarOpds } from "../src/render/jointjs/headlessRender";

type Fondo = "blanco" | "transparente";
interface OpdRenderizado { opdId: string; nombre: string; orden: number; svg: string; pngBase64: string }
interface ResultadoRender { ok: boolean; error?: string; opds: OpdRenderizado[] }

function slugArchivo(input: string): string {
  return input
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLocaleLowerCase("es-CL")
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "modelo";
}

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i]!;
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const val = argv[i + 1] && !argv[i + 1]!.startsWith("--") ? argv[++i]! : "true";
      args[key] = val;
    }
  }
  return args;
}

function morir(msg: string, code: number): never {
  console.error(`[render:headless] ${msg}`);
  process.exit(code);
}

// Vite efímero levantado por API EN EL MISMO PROCESO (H1H2-01). A diferencia del
// spawn de un wrapper `bun run dev` (que no propagaba SIGTERM al `node vite` hijo
// y dejaba un huérfano vivo en :puerto), aquí el server vive y muere con este
// proceso. `strictPort:true` hace que, si el puerto ya está ocupado, `listen()`
// LANCE en vez de reusar silenciosamente un server ajeno (que respondería 200 al
// health-check y violaría el aislamiento del efímero). El flag `VITE_HEADLESS_RENDER`
// se inyecta por env (lo que Vite expone en `import.meta.env`) para que el bundle
// monte `window.__opmRenderHeadless__`.
async function levantarViteEfimero(puerto: number): Promise<{ url: string; parar: () => Promise<void> }> {
  process.env.VITE_HEADLESS_RENDER = "true";
  const server = await createServer({
    root: resolve(import.meta.dirname, ".."),
    configFile: resolve(import.meta.dirname, "..", "vite.config.ts"),
    server: { host: "127.0.0.1", port: puerto, strictPort: true },
    logLevel: "silent",
  });
  try {
    await server.listen();
  } catch (e) {
    // strictPort en uso → puerto ajeno. No reusamos: abortamos limpio.
    await server.close().catch(() => { /* nunca escuchó */ });
    throw new Error(`Vite no pudo escuchar en el puerto ${puerto} (¿ocupado por otro proceso?): ${String(e)}`);
  }
  const direccion = server.resolvedUrls?.local[0] ?? `http://127.0.0.1:${puerto}/`;
  return { url: direccion, parar: () => server.close() };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const out = args.out;
  if (!out) morir("falta --out <dir>", 2);
  if (!args.proto && !args.modelo) morir("falta --proto <ruta.md> o --modelo <ruta.json>", 2);
  if (args.proto && args.modelo) morir("--proto y --modelo son mutuamente excluyentes", 2);
  const fondo: Fondo = args.fondo === "transparente" ? "transparente" : "blanco";
  mkdirSync(out, { recursive: true });

  // 1) COMPILAR (Node puro, sin navegador) → JSON del modelo (con layout) + textuales.
  let modeloJson: string;
  const textuales: { archivo: string; contenido: string }[] = [];
  let procedenciaHash: string | undefined;
  let resumen: unknown;
  if (args.proto) {
    const md = readFileSync(args.proto, "utf8");
    const nombre = basename(args.proto).replace(/\.[^.]+$/, "");
    let comp, bundle;
    try {
      comp = compilarProto(md, { nombre });
      // lanzarEnError: false → las advertencias de canon NO abortan; quedan en
      // bundle.avisos (→ avisos.json). El agente quiere VER el proto aunque tenga
      // observaciones: son señal para el loop, no un muro. Solo un fallo estructural
      // duro (round-trip/contención) lanza y cae al catch.
      bundle = emitirBundle(comp.autor, { lanzarEnError: false });
    } catch (e) {
      writeFileSync(resolve(out, "error.txt"), `Compilación/emisión falló:\n${String(e)}\n`, "utf8");
      morir(`compilación/emisión falló: ${String(e)}`, 1);
    }
    modeloJson = bundle.json;
    const sello = construirSello({ protoTexto: md });
    procedenciaHash = sello.protoHash;
    resumen = comp.resumen;
    textuales.push(
      { archivo: "opl.md", contenido: bundle.opl },
      { archivo: "reporte.md", contenido: bundle.reporte },
      { archivo: "avisos.json", contenido: JSON.stringify(bundle.avisos, null, 2) },
      { archivo: "ledger.json", contenido: JSON.stringify(comp.ledger, null, 2) },
      { archivo: "procedencia.json", contenido: JSON.stringify(sello, null, 2) },
      { archivo: "conteos.json", contenido: JSON.stringify(bundle.conteos, null, 2) },
    );
  } else {
    modeloJson = readFileSync(args.modelo!, "utf8");
  }

  // 2) RENDER (navegador). Vite efímero EN PROCESO con el flag, o un server
  // externo (--url) que NO administramos (parar = no-op). El externo debe haberse
  // levantado con VITE_HEADLESS_RENDER=true por su cuenta.
  const server: { url: string; parar: () => void | Promise<void> } = args.url
    ? { url: args.url, parar: () => {} }
    : await levantarViteEfimero(Number(args.port) || 5199);
  const browser = await chromium.launch();
  // Diferimos toda salida con código de error hasta DESPUÉS de la limpieza (cierre
  // del navegador + parada del server), para no dejar un Vite efímero colgado
  // ni saltarnos la limpieza con process.exit (H1H2-01).
  let salida: { msg: string; code: number } | null = null;
  try {
    const page = await browser.newPage();
    await page.goto(server.url, { waitUntil: "load" });
    await page.waitForFunction(() => "__opmRenderHeadless__" in window, { timeout: 30_000 });

    // El render vive en el navegador: una excepción dentro de page.evaluate (DOM,
    // JointJS, fuentes) debe dejar rastro en error.txt igual que el camino
    // {ok:false}, homogeneizando el contrato de fallo de fase-navegador (H1H2-05).
    let r: ResultadoRender;
    try {
      r = (await page.evaluate(
        async ([json, f]) =>
          (window as unknown as { __opmRenderHeadless__: (j: string, o: { fondo: string }) => Promise<unknown> })
            .__opmRenderHeadless__(json as string, { fondo: f as string }),
        [modeloJson, fondo] as const,
      )) as ResultadoRender;
    } catch (e) {
      writeFileSync(resolve(out, "error.txt"), `Excepción en el render del navegador:\n${String(e)}\n`, "utf8");
      salida = { msg: `excepción en el render del navegador: ${String(e)}`, code: 1 };
      return;
    }

    if (!r.ok) {
      writeFileSync(resolve(out, "error.txt"), `Render falló: ${r.error}\n`, "utf8");
      salida = { msg: `render falló: ${r.error}`, code: 1 };
      return;
    }

    // 3) ESCRIBIR <out>/. --solo-opd inexistente NO es un no-op silencioso: deja
    // error.txt con los OPDs disponibles y sale con código 2 (H1H2-04).
    const { seleccion, error: errorSeleccion } = seleccionarOpds(r.opds, args["solo-opd"] || undefined);
    if (errorSeleccion) {
      writeFileSync(resolve(out, "error.txt"), `${errorSeleccion}\n`, "utf8");
      salida = { msg: errorSeleccion, code: 2 };
      return;
    }
    const indiceOpds = seleccion.map((o) => {
      const base = `${String(o.orden).padStart(2, "0")}-${slugArchivo(o.nombre)}`;
      writeFileSync(resolve(out, `${base}.png`), Buffer.from(o.pngBase64, "base64"));
      writeFileSync(resolve(out, `${base}.svg`), o.svg, "utf8");
      return { orden: o.orden, opdId: o.opdId, nombre: o.nombre, png: `${base}.png`, svg: `${base}.svg` };
    });
    for (const t of textuales) writeFileSync(resolve(out, t.archivo), t.contenido, "utf8");

    const meta = JSON.parse(modeloJson) as { modelo?: { id?: string; nombre?: string } };
    const indice = {
      modelo: { id: meta.modelo?.id ?? null, nombre: meta.modelo?.nombre ?? null },
      fuente: args.proto ? { tipo: "proto", ruta: args.proto } : { tipo: "modelo", ruta: args.modelo },
      ...(procedenciaHash ? { procedenciaHash } : {}),
      ...(resumen ? { resumen } : {}),
      opds: indiceOpds,
    };
    writeFileSync(resolve(out, "00-indice.json"), JSON.stringify(indice, null, 2), "utf8");
    console.log(`[render:headless] ${seleccion.length} OPD(s) → ${out}`);
  } finally {
    await browser.close();
    await server.parar();
    // La limpieza ya corrió (navegador cerrado + Vite efímero parado): recién aquí
    // materializamos un eventual fallo, sin saltarnos esta limpieza con process.exit.
    if (salida) morir(salida.msg, salida.code);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
