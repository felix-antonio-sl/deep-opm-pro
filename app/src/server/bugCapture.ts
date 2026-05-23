import { Buffer } from "node:buffer";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import { actualizarIndiceBugs, leerLedgerBugs } from "./bugIndex";

export interface BugCaptureHandlerOptions {
  repoRoot: string;
  bugsRoot?: string;
  maxBodyBytes?: number;
  maxScreenshots?: number;
  now?: () => Date;
  randomHex?: () => string;
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

const DEFAULT_MAX_BODY_BYTES = 25 * 1024 * 1024;
const DEFAULT_MAX_SCREENSHOTS = 12;

export function crearBugCaptureRequestHandler(options: BugCaptureHandlerOptions) {
  const resolved = resolverOptions(options);
  return (req: IncomingMessage, res: ServerResponse): void => {
    void manejarBugReport(req, res, resolved);
  };
}

async function manejarBugReport(
  req: IncomingMessage,
  res: ServerResponse,
  options: Required<BugCaptureHandlerOptions>,
): Promise<void> {
  if (req.method === "GET") {
    await responderLedger(res, options);
    return;
  }

  if (req.method !== "POST") {
    responderJson(res, 405, { error: "Metodo no permitido" });
    return;
  }

  try {
    const payload = validarPayload(JSON.parse(await leerBody(req, options.maxBodyBytes)), options.maxScreenshots);
    const now = options.now();
    const id = crearBugId(now, options.randomHex);
    const dir = path.join(options.bugsRoot, id);
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
      type: "Bug",
      status: "Nuevo",
      resolution: "Pendiente.",
      createdAt: now.toISOString(),
      text: payload.text,
      context,
      screenshots: archivosScreenshots,
    }, null, 2));
    await writeFile(path.join(dir, "report.md"), renderBugMarkdown(id, now, payload.text, context, archivosScreenshots));
    await actualizarIndiceBugs({
      repoRoot: options.repoRoot,
      bugsRoot: options.bugsRoot,
    });

    const relativeDir = normalizarPath(path.relative(options.repoRoot, dir));
    responderJson(res, 201, {
      id,
      path: `${relativeDir}/report.md`,
      directory: relativeDir,
      screenshots: archivosScreenshots.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo guardar el reporte";
    responderJson(res, esErrorPayload(message) ? 400 : 500, { error: message });
  }
}

async function responderLedger(res: ServerResponse, options: Required<BugCaptureHandlerOptions>): Promise<void> {
  const ledger = await leerLedgerBugs({
    repoRoot: options.repoRoot,
    bugsRoot: options.bugsRoot,
  });
  responderJson(res, 200, {
    active: ledger.active,
    history: ledger.history,
    counts: {
      active: ledger.active.length,
      history: ledger.history.length,
    },
  });
}

async function leerBody(req: IncomingMessage, maxBodyBytes: number): Promise<string> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.length;
    if (total > maxBodyBytes) throw new Error("Payload demasiado grande");
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function validarPayload(input: unknown, maxScreenshots: number): BugPayload {
  if (!input || typeof input !== "object") throw new Error("Payload invalido");
  const record = input as Record<string, unknown>;
  const text = typeof record.text === "string" ? record.text.trim() : "";
  if (!text) throw new Error("Texto requerido");
  const screenshotsInput = Array.isArray(record.screenshots) ? record.screenshots : [];
  if (screenshotsInput.length > maxScreenshots) throw new Error(`Screenshot maximo: ${maxScreenshots}`);
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

function crearBugId(now: Date, randomHex: () => string): string {
  const iso = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  return `BUG-${iso}-${randomHex()}`;
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
**Tipo**: Bug
**Estado**: Nuevo
**Resolución**: Pendiente.

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

function resolverOptions(options: BugCaptureHandlerOptions): Required<BugCaptureHandlerOptions> {
  return {
    repoRoot: options.repoRoot,
    bugsRoot: options.bugsRoot ?? path.join(options.repoRoot, "docs", "bugs"),
    maxBodyBytes: options.maxBodyBytes ?? DEFAULT_MAX_BODY_BYTES,
    maxScreenshots: options.maxScreenshots ?? DEFAULT_MAX_SCREENSHOTS,
    now: options.now ?? (() => new Date()),
    randomHex: options.randomHex ?? (() => randomBytes(3).toString("hex")),
  };
}

function esErrorPayload(message: string): boolean {
  return message.startsWith("Payload") ||
    message.startsWith("Texto") ||
    message.startsWith("Screenshot");
}
