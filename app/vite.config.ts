import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import type { Plugin } from "vite";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP_ROOT = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = path.resolve(APP_ROOT, "..");
const BUGS_ROOT = path.join(REPO_ROOT, "docs", "bugs");
const MAX_BODY_BYTES = 25 * 1024 * 1024;
const MAX_SCREENSHOTS = 12;

export default defineConfig({
  plugins: [preact(), bugCapturePlugin()],
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

function bugCapturePlugin(): Plugin {
  return {
    name: "deep-opm-bug-capture",
    configureServer(server) {
      instalarBugCaptureMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      instalarBugCaptureMiddleware(server.middlewares);
    },
  };
}

function instalarBugCaptureMiddleware(middlewares: { use(path: string, handler: (req: IncomingMessage, res: ServerResponse) => void): void }): void {
  middlewares.use("/__deep-opm/bug-reports", (req, res) => {
    void manejarBugReport(req, res);
  });
}

async function manejarBugReport(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== "POST") {
    responderJson(res, 405, { error: "Metodo no permitido" });
    return;
  }

  try {
    const payload = validarPayload(JSON.parse(await leerBody(req)));
    const now = new Date();
    const id = crearBugId(now);
    const dir = path.join(BUGS_ROOT, id);
    const screenshotsDir = path.join(dir, "screenshots");
    const screenshots = payload.screenshots.map(prepararScreenshot);

    await mkdir(screenshotsDir, { recursive: true });
    const archivosScreenshots: string[] = [];
    for (const [index, screenshot] of screenshots.entries()) {
      const filename = `${(index + 1).toString().padStart(2, "0")}-${screenshot.safeName}.${screenshot.ext}`;
      await writeFile(path.join(screenshotsDir, filename), screenshot.buffer);
      archivosScreenshots.push(`screenshots/${filename}`);
    }

    const context = payload.context && typeof payload.context === "object" ? payload.context : {};
    await writeFile(path.join(dir, "payload.json"), JSON.stringify({
      id,
      createdAt: now.toISOString(),
      text: payload.text,
      context,
      screenshots: archivosScreenshots,
    }, null, 2));
    await writeFile(path.join(dir, "report.md"), renderBugMarkdown(id, now, payload.text, context, archivosScreenshots));

    const relativeDir = normalizarPath(path.relative(REPO_ROOT, dir));
    responderJson(res, 201, {
      id,
      path: `${relativeDir}/report.md`,
      directory: relativeDir,
      screenshots: archivosScreenshots.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo guardar el reporte";
    responderJson(res, message.startsWith("Payload") || message.startsWith("Texto") || message.startsWith("Screenshot") ? 400 : 500, { error: message });
  }
}

async function leerBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.length;
    if (total > MAX_BODY_BYTES) throw new Error("Payload demasiado grande");
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

type BugPayload = {
  text: string;
  screenshots: ScreenshotPayload[];
  context: unknown;
};

type ScreenshotPayload = {
  name: string;
  type: string;
  dataUrl: string;
};

function validarPayload(input: unknown): BugPayload {
  if (!input || typeof input !== "object") throw new Error("Payload invalido");
  const record = input as Record<string, unknown>;
  const text = typeof record.text === "string" ? record.text.trim() : "";
  if (!text) throw new Error("Texto requerido");
  const screenshotsInput = Array.isArray(record.screenshots) ? record.screenshots : [];
  if (screenshotsInput.length > MAX_SCREENSHOTS) throw new Error(`Screenshot maximo: ${MAX_SCREENSHOTS}`);
  return {
    text,
    screenshots: screenshotsInput.map(validarScreenshot),
    context: record.context ?? {},
  };
}

function validarScreenshot(input: unknown): ScreenshotPayload {
  if (!input || typeof input !== "object") throw new Error("Screenshot invalido");
  const record = input as Record<string, unknown>;
  const name = typeof record.name === "string" && record.name.trim() ? record.name.trim() : "captura";
  const type = typeof record.type === "string" ? record.type : "";
  const dataUrl = typeof record.dataUrl === "string" ? record.dataUrl : "";
  if (!dataUrl.startsWith("data:image/")) throw new Error("Screenshot debe ser imagen data URL");
  return { name, type, dataUrl };
}

function prepararScreenshot(input: ScreenshotPayload): { safeName: string; ext: string; buffer: Buffer } {
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(input.dataUrl);
  if (!match) throw new Error("Screenshot debe ser png, jpeg o webp en base64");
  const mime = match[1] ?? input.type;
  const base64 = match[2] ?? "";
  const ext = mime === "image/jpeg" ? "jpg" : mime.replace("image/", "");
  return {
    safeName: limpiarNombreArchivo(input.name.replace(/\.[^.]+$/, "")),
    ext,
    buffer: Buffer.from(base64, "base64"),
  };
}

function crearBugId(now: Date): string {
  const iso = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  return `BUG-${iso}-${randomBytes(3).toString("hex")}`;
}

function limpiarNombreArchivo(input: string): string {
  const normalized = input.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return normalized || "captura";
}

function renderBugMarkdown(id: string, now: Date, text: string, context: unknown, screenshots: string[]): string {
  const screenshotSection = screenshots.length
    ? screenshots.map((item) => `- [${item}](${item})`).join("\n")
    : "Sin screenshots adjuntos.";
  return `# ${id}

**Creado**: ${now.toISOString()}

## Texto

${text}

## Screenshots

${screenshotSection}

## Contexto

\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`
`;
}

function responderJson(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function normalizarPath(input: string): string {
  return input.replace(/\\/g, "/");
}
