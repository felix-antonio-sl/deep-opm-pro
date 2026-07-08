import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { crearBugCaptureRequestHandler } from "./src/server/bugCapture";
import { instalarModelPersistenceDevMiddleware } from "./src/server/devModelPersistence";

const APP_ROOT = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const BUGS_ROOT = path.join(REPO_ROOT, "docs", "bugs");
export default defineConfig({
  plugins: [preact(), bugCapturePlugin()],
  // Versión de opforja para la UI: la fecha se computa al construir; el short
  // SHA llega por el arg `VITE_OPFORJA_BUILD` (el build Docker excluye .git).
  define: {
    __OPFORJA_FECHA__: JSON.stringify(new Date().toISOString().slice(0, 10)),
    __OPFORJA_BUILD__: JSON.stringify(process.env.VITE_OPFORJA_BUILD ?? "local"),
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          const modulo = id.replace(/\\/g, "/");

          if (modulo.includes("/node_modules/jointjs/")) return "vendor-jointjs";
          if (modulo.includes("/node_modules/preact/")) return "vendor-preact";
          if (modulo.includes("/node_modules/zustand/")) return "vendor-zustand";
          if (modulo.includes("/node_modules/")) return "vendor";

          if (
            modulo.includes("/src/render/jointjs/customShapes") ||
            modulo.includes("/src/render/jointjs/linkAssets") ||
            modulo.includes("/src/render/jointjs/jointMarkerAssets")
          ) return "vendor-jointjs";

          if (
            modulo.includes("/src/ui/MapaSistema") ||
            modulo.includes("/src/ui/MapaFiltros") ||
            modulo.includes("/src/ui/MapaPanelEstadisticas")
          ) return "feature-mapa";

          if (modulo.includes("/src/render/jointjs/mapaExport")) return "feature-export";

          if (modulo.includes("/src/ui/asistente/")) return "feature-asistente";

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
