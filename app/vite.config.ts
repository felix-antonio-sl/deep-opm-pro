import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      "@app": new URL("./src", import.meta.url).pathname,
    },
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
            modulo.includes("/src/ui/MapaPanelEstadisticas") ||
            modulo.includes("/src/render/jointjs/mapaExport")
          ) return "feature-mapa";

          if (modulo.includes("/src/ui/AsistenteNuevoModelo")) return "feature-asistente";

          if (
            modulo.includes("/src/ui/DialogoBuscarGlobal") ||
            modulo.includes("/src/ui/DialogoVersiones") ||
            modulo.includes("/src/ui/DialogoArchivados") ||
            modulo.includes("/src/ui/DialogoCargarModelo") ||
            modulo.includes("/src/ui/DialogoGuardarComo")
          ) return "feature-dialogos-pesados";

          if (
            modulo.includes("/src/ui/ModalUrlsObjeto") ||
            modulo.includes("/src/ui/ModalDuracionEstado") ||
            modulo.includes("/src/ui/CheatsheetAtajos")
          ) return "feature-modales";

          return undefined;
        },
      },
    },
  },
});
