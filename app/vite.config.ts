import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { crearBugCaptureRequestHandler } from "./src/server/bugCapture";
import { instalarModelPersistenceDevMiddleware } from "./src/server/devModelPersistence";

const APP_ROOT = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const BUGS_ROOT = path.join(REPO_ROOT, "docs", "bugs");
export default defineConfig({
  publicDir: ".tutor-corpus",
  plugins: [preact(), bugCapturePlugin(), portableReaderPlugin()],
  // Versión de opforja para la UI: la fecha se computa al construir; el short
  // SHA llega por el arg `VITE_OPFORJA_BUILD` (el build Docker excluye .git).
  define: {
    __OPFORJA_FECHA__: JSON.stringify(new Date().toISOString().slice(0, 10)),
    __OPFORJA_BUILD__: JSON.stringify(process.env.VITE_OPFORJA_BUILD ?? "local"),
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      input: {
        editor: path.join(APP_ROOT, "index.html"),
        portableReader: path.join(APP_ROOT, "portable-reader/index.html"),
      },
      output: {
        // Shared model/serializer dependencies must not execute editor dialogs
        // when the standalone reader imports them.
        onlyExplicitManualChunks: true,
        manualChunks(id: string) {
          const modulo = id.replace(/\\/g, "/");

          if (modulo.includes("/node_modules/jointjs/")) return "vendor-jointjs";
          if (modulo.includes("/node_modules/preact/")) return "vendor-preact";
          if (modulo.includes("/node_modules/zustand/")) return "vendor-zustand";
          if (modulo.includes("/node_modules/") || modulo.includes("commonjsHelpers.js")) return "vendor";

          if (
            modulo.includes("/src/ui/MapaSistema") ||
            modulo.includes("/src/ui/MapaFiltros") ||
            modulo.includes("/src/ui/MapaPanelEstadisticas")
          ) return "feature-mapa";

          if (modulo.includes("/src/render/jointjs/mapaExport")) return "feature-export";

          if (
            modulo.includes("/src/tutor/contenidoRuntime") ||
            modulo.includes("/src/tutor/contenidos") ||
            modulo.includes("/src/tutor/fuentes")
          ) return "feature-tutor-content";

          if (modulo.includes("/src/tutor/")) return "feature-tutor-policy";

          if (
            modulo.includes("/src/ui/DialogoBuscarGlobal") ||
            modulo.includes("/src/ui/DialogoVersiones") ||
            modulo.includes("/src/ui/DialogoArchivados") ||
            modulo.includes("/src/ui/DialogoCargarModelo") ||
            modulo.includes("/src/ui/DialogoGuardarComo") ||
            modulo.includes("/src/ui/ModalUrlsObjeto") ||
            modulo.includes("/src/ui/ModalDuracionEstado") ||
            modulo.includes("/src/ui/CheatsheetAtajos")
          ) return "feature-dialogos-pesados";

          return undefined;
        },
      },
    },
  },
});

/** The public reader owns a narrow worker scope; the editor is never cached. */
function portableReaderPlugin(): Plugin {
  const workerPath = path.join(APP_ROOT, "src/portable-reader/sw.js");
  return {
    name: "opforja-portable-reader",
    configureServer(server) {
      server.middlewares.use("/portable-reader/sw.js", (_req, res) => {
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache");
        res.end(readFileSync(workerPath, "utf8"));
      });
    },
    generateBundle(_options, bundle) {
      this.emitFile({ type: "asset", fileName: "portable-reader/sw.js", source: readFileSync(workerPath, "utf8") });
      const assets = new Set<string>([
        "portable-reader/index.html", "portable-reader/sw.js", "portable-reader/asset-manifest.json",
      ]);
      const visit = (name: string) => {
        if (assets.has(name)) return;
        assets.add(name);
        const entry = bundle[name];
        if (entry?.type !== "chunk") return;
        for (const dependency of [...entry.imports, ...entry.dynamicImports]) visit(dependency);
        const metadata = (entry as typeof entry & { viteMetadata?: { importedCss: Set<string>; importedAssets: Set<string> } }).viteMetadata;
        for (const asset of [...(metadata?.importedCss ?? []), ...(metadata?.importedAssets ?? [])]) assets.add(asset);
      };
      for (const entry of Object.values(bundle)) {
        if (entry.type === "chunk" && entry.isEntry && entry.name === "portableReader") visit(entry.fileName);
      }
      // Fonts and images referenced by the reader's styles are also necessary
      // after a cold restart. Include only assets reached by those styles.
      for (const name of [...assets]) {
        const entry = bundle[name];
        if (!name.endsWith(".css") || entry?.type !== "asset") continue;
        const css = typeof entry.source === "string" ? entry.source : new TextDecoder().decode(entry.source);
        for (const match of css.matchAll(/url\(["']?([^\s)"']+)["']?\)/g)) {
          const target = match[1]!;
          if (/^(data:|https?:|\/\/)/.test(target)) continue;
          const resolved = target.startsWith("/") ? target.slice(1) : path.posix.join(path.posix.dirname(name), target);
          if (bundle[resolved]) assets.add(resolved);
        }
      }
      this.emitFile({ type: "asset", fileName: "portable-reader/asset-manifest.json",
        source: JSON.stringify({ version: 1, urls: [...assets].sort().map((name) => `/${name}`) }) });
    },
  };
}

function bugCapturePlugin(): Plugin {
  return {
    name: "deep-opm-bug-capture",
    configureServer(server) {
      instalarBugCaptureMiddleware(server.middlewares);
      instalarModelPersistenceDevMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      instalarBugCaptureMiddleware(server.middlewares);
      instalarModelPersistenceDevMiddleware(server.middlewares);
    },
  };
}

function instalarBugCaptureMiddleware(middlewares: { use(path: string, handler: (req: IncomingMessage, res: ServerResponse) => void): void }): void {
  const handler = crearBugCaptureRequestHandler({
    repoRoot: REPO_ROOT,
    bugsRoot: BUGS_ROOT,
  });
  middlewares.use("/__deep-opm/bug-reports", (req, res) => {
    handler(req, res);
  });
}
