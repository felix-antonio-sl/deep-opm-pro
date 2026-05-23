import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export interface BugIndexOptions {
  repoRoot: string;
  bugsRoot: string;
  indexFileName?: string;
  historyFileName?: string;
  statusFileName?: string;
}

export interface BugIndexResult {
  path: string;
  historyPath: string;
  entries: number;
  activeEntries: number;
  historyEntries: number;
  markdown: string;
  historyMarkdown: string;
}

interface BugIndexEntry {
  id: string;
  scope: BugScope;
  type: string;
  status: string;
  resolution: string;
  createdAt: string;
  reportPath: string;
  text: string;
  modelName: string;
  opdName: string;
  screenshots: number;
  note: string;
}

interface BugStatusMetadata {
  type?: string;
  status?: string;
  resolution?: string;
  note?: string;
}

interface ArchiveResolution {
  status: string;
  resolution: string;
}

type BugScope = "Activo" | "Histórico";

const DEFAULT_INDEX_FILE_NAME = "INDEX.md";
const DEFAULT_HISTORY_FILE_NAME = "HISTORY.md";
const DEFAULT_STATUS_FILE_NAME = "statuses.json";
const DEFAULT_STATUS = "Nuevo";
const DEFAULT_TYPE = "Bug";

export async function actualizarIndiceBugs(options: BugIndexOptions): Promise<BugIndexResult> {
  const indexFileName = options.indexFileName ?? DEFAULT_INDEX_FILE_NAME;
  const historyFileName = options.historyFileName ?? DEFAULT_HISTORY_FILE_NAME;
  const statusFileName = options.statusFileName ?? DEFAULT_STATUS_FILE_NAME;
  const statusMap = await leerStatusMap(path.join(options.bugsRoot, statusFileName));
  const archiveResolutionMap = await leerArchiveResolutionMap(path.join(options.bugsRoot, "archive"));
  const activeEntries = await leerBugEntries(options.bugsRoot, options.repoRoot, statusMap, archiveResolutionMap, "Activo");
  const archivedEntries = await leerArchivedEntries(options.bugsRoot, options.repoRoot, statusMap, archiveResolutionMap);
  const historyEntries = ordenarEntries([...activeEntries, ...archivedEntries]);
  const markdown = renderBugIndex(activeEntries, statusFileName, historyFileName);
  const historyMarkdown = renderBugHistory(historyEntries, statusFileName);
  const indexPath = path.join(options.bugsRoot, indexFileName);
  const historyPath = path.join(options.bugsRoot, historyFileName);
  await mkdir(options.bugsRoot, { recursive: true });
  await writeFile(indexPath, markdown);
  await writeFile(historyPath, historyMarkdown);
  return {
    path: indexPath,
    historyPath,
    entries: activeEntries.length,
    activeEntries: activeEntries.length,
    historyEntries: historyEntries.length,
    markdown,
    historyMarkdown,
  };
}

async function leerArchivedEntries(
  bugsRoot: string,
  repoRoot: string,
  statusMap: Map<string, BugStatusMetadata>,
  archiveResolutionMap: Map<string, ArchiveResolution>,
): Promise<BugIndexEntry[]> {
  const archiveRoot = path.join(bugsRoot, "archive");
  const bugDirs = await listarBugDirsRecursivo(archiveRoot);
  const entries = await Promise.all(bugDirs.map((dir) =>
    leerBugEntry(dir, repoRoot, statusMap, archiveResolutionMap, "Histórico")
  ));
  return ordenarEntries(entries.filter((entry): entry is BugIndexEntry => entry !== null));
}

async function leerBugEntries(
  bugsRoot: string,
  repoRoot: string,
  statusMap: Map<string, BugStatusMetadata>,
  archiveResolutionMap: Map<string, ArchiveResolution>,
  scope: BugScope,
): Promise<BugIndexEntry[]> {
  let dirs: string[];
  try {
    const entries = await readdir(bugsRoot, { withFileTypes: true });
    dirs = entries
      .filter((entry) => entry.isDirectory() && /^BUG-/.test(entry.name))
      .map((entry) => path.join(bugsRoot, entry.name));
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") return [];
    throw error;
  }

  const bugEntries = await Promise.all(dirs.map((dir) =>
    leerBugEntry(dir, repoRoot, statusMap, archiveResolutionMap, scope)
  ));
  return ordenarEntries(bugEntries.filter((entry): entry is BugIndexEntry => entry !== null));
}

async function leerBugEntry(
  dir: string,
  repoRoot: string,
  statusMap: Map<string, BugStatusMetadata>,
  archiveResolutionMap: Map<string, ArchiveResolution>,
  scope: BugScope,
): Promise<BugIndexEntry | null> {
  const dirName = path.basename(dir);
  const payload = asRecord(await leerJsonOpcional(path.join(dir, "payload.json")));
  const report = await leerTextoOpcional(path.join(dir, "report.md"));
  const id = asString(payload?.id) ?? dirName;
  const context = asRecord(payload?.context);
  const statusMetadata = statusMap.get(id);
  const archiveResolution = archiveResolutionMap.get(id);
  const status = statusMetadata?.status ??
    (scope === "Histórico" ? archiveResolution?.status : null) ??
    asString(payload?.status) ??
    extraerCampoMarkdown(report, "Estado") ??
    archiveResolution?.status ??
    (scope === "Histórico" ? "Archivado" : DEFAULT_STATUS);
  const type = normalizarTipo(statusMetadata?.type ??
    asString(payload?.type) ??
    extraerCampoMarkdown(report, "Tipo") ??
    inferirTipo(asString(payload?.text) ?? report));
  const resolution = statusMetadata?.resolution ??
    (scope === "Histórico" ? archiveResolution?.resolution : null) ??
    asString(payload?.resolution) ??
    extraerCampoMarkdown(report, "Resolución") ??
    archiveResolution?.resolution ??
    (scope === "Histórico" ? "Archivado sin resolución detallada." : "Pendiente.");
  const text = asString(payload?.text) ?? extraerTextoReport(report) ?? "Sin descripcion.";
  const createdAt = asString(payload?.createdAt) ?? extraerCampoMarkdown(report, "Creado") ?? "";
  const screenshotsInput = Array.isArray(payload?.screenshots) ? payload.screenshots : [];
  return {
    id,
    scope,
    type,
    status,
    resolution,
    createdAt,
    reportPath: normalizarPath(path.relative(repoRoot, path.join(dir, "report.md"))),
    text,
    modelName: asString(context?.modeloNombre) ?? "",
    opdName: asString(context?.opdActivoNombre) ?? "",
    screenshots: screenshotsInput.length,
    note: statusMetadata?.note ?? "",
  };
}

async function listarBugDirsRecursivo(root: string): Promise<string[]> {
  const found: string[] = [];
  async function visit(dir: string): Promise<void> {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch (error) {
      if (isNodeError(error) && error.code === "ENOENT") return;
      throw error;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const child = path.join(dir, entry.name);
      if (/^BUG-/.test(entry.name)) {
        found.push(child);
      } else {
        await visit(child);
      }
    }
  }
  await visit(root);
  return found;
}

async function leerArchiveResolutionMap(archiveRoot: string): Promise<Map<string, ArchiveResolution>> {
  const readmes = await listarReadmesArchivo(archiveRoot);
  const map = new Map<string, ArchiveResolution>();
  for (const readme of readmes) {
    const text = await leerTextoOpcional(readme);
    const rows = extraerFilasTablaArchivo(text);
    for (const row of rows) {
      const shortId = row.shortId.toLowerCase();
      const id = await encontrarBugIdPorSufijo(path.dirname(readme), shortId);
      if (!id) continue;
      map.set(id, {
        status: inferirEstadoArchivado(row.closure),
        resolution: row.evidence ? `${row.closure}; ${row.evidence}` : row.closure,
      });
    }
  }
  return map;
}

async function listarReadmesArchivo(root: string): Promise<string[]> {
  const readmes: string[] = [];
  async function visit(dir: string): Promise<void> {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch (error) {
      if (isNodeError(error) && error.code === "ENOENT") return;
      throw error;
    }
    for (const entry of entries) {
      const child = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await visit(child);
      } else if (entry.name === "README.md") {
        readmes.push(child);
      }
    }
  }
  await visit(root);
  return readmes;
}

function extraerFilasTablaArchivo(markdown: string): Array<{ shortId: string; closure: string; evidence: string }> {
  const rows: Array<{ shortId: string; closure: string; evidence: string }> = [];
  for (const line of markdown.split("\n")) {
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 3) continue;
    const [shortId, second, third] = cells;
    if (!shortId || !/^[0-9a-f]{6}$/i.test(shortId)) continue;
    rows.push({
      shortId,
      closure: limpiarMarkdownInline(second ?? ""),
      evidence: limpiarMarkdownInline(third ?? ""),
    });
  }
  return rows;
}

async function encontrarBugIdPorSufijo(dir: string, shortId: string): Promise<string | null> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return null;
  }
  const match = entries.find((entry) => entry.isDirectory() && entry.name.toLowerCase().endsWith(`-${shortId}`));
  return match?.name ?? null;
}

async function leerStatusMap(statusPath: string): Promise<Map<string, BugStatusMetadata>> {
  const input = asRecord(await leerJsonOpcional(statusPath));
  const statusMap = new Map<string, BugStatusMetadata>();
  if (!input) return statusMap;
  for (const [id, raw] of Object.entries(input)) {
    if (!/^BUG-/.test(id)) continue;
    const metadata = normalizarStatusMetadata(raw);
    if (metadata) statusMap.set(id, metadata);
  }
  return statusMap;
}

function normalizarStatusMetadata(input: unknown): BugStatusMetadata | null {
  if (typeof input === "string" && input.trim()) {
    return { status: input.trim() };
  }
  const record = asRecord(input);
  if (!record) return null;
  const metadata: BugStatusMetadata = {};
  const type = asString(record.type) ?? asString(record.tipo);
  const status = asString(record.status) ?? asString(record.estado);
  const resolution = asString(record.resolution) ?? asString(record.resolucion);
  const note = asString(record.note) ?? asString(record.nota);
  if (type) metadata.type = type;
  if (status) metadata.status = status;
  if (resolution) metadata.resolution = resolution;
  if (note) metadata.note = note;
  return metadata.type || metadata.status || metadata.resolution || metadata.note ? metadata : null;
}

function renderBugIndex(entries: BugIndexEntry[], statusFileName: string, historyFileName: string): string {
  const summaryRows = contarPor(entries, (entry) => entry.status)
    .map(([status, count]) => `| ${escapeCell(status)} | ${count} |`)
    .join("\n");
  const typeRows = contarPor(entries, (entry) => entry.type)
    .map(([type, count]) => `| ${escapeCell(type)} | ${count} |`)
    .join("\n");
  const bugRows = renderRows(entries, false);

  return `# Índice Vivo De Bugs Y Features

Este archivo es el ledger operativo de bugs/features activos. Se regenera desde
\`payload.json\`/\`report.md\` de cada \`BUG-*\` en esta carpeta y desde
\`${statusFileName}\`, que es la fuente editable para tipo, estado, resolución y nota.

Histórico completo: [${historyFileName}](${historyFileName}).

Para regenerarlo manualmente:

\`\`\`bash
cd app && bun run bug:index
\`\`\`

## Resumen Por Estado

| Estado | Cantidad |
|---|---:|
${summaryRows || "| - | 0 |"}

## Resumen Por Tipo

| Tipo | Cantidad |
|---|---:|
${typeRows || "| - | 0 |"}

## Activos

| Tipo | Estado | Bug/Feat | Creado | Contexto | Resumen | Resolución | Capturas | Nota |
|---|---|---|---|---|---|---|---:|---|
${bugRows}
`;
}

function renderBugHistory(entries: BugIndexEntry[], statusFileName: string): string {
  const stateRows = contarPor(entries, (entry) => `${entry.scope} / ${entry.status}`)
    .map(([status, count]) => `| ${escapeCell(status)} | ${count} |`)
    .join("\n");
  const typeRows = contarPor(entries, (entry) => `${entry.scope} / ${entry.type}`)
    .map(([type, count]) => `| ${escapeCell(type)} | ${count} |`)
    .join("\n");

  return `# Histórico De Bugs Y Features

Este archivo es el ledger histórico completo: activos + archivados. Se regenera
desde \`docs/bugs/\`, \`docs/bugs/archive/**\` y \`${statusFileName}\`.

\`statuses.json\` puede sobrescribir tipo, estado, resolución y nota para
cualquier ID, activo o archivado.

## Resumen Por Estado

| Alcance / Estado | Cantidad |
|---|---:|
${stateRows || "| - | 0 |"}

## Resumen Por Tipo

| Alcance / Tipo | Cantidad |
|---|---:|
${typeRows || "| - | 0 |"}

## Ledger Completo

| Alcance | Tipo | Estado | Bug/Feat | Creado | Contexto | Resumen | Resolución | Capturas | Nota |
|---|---|---|---|---|---|---|---|---:|---|
${renderRows(entries, true)}
`;
}

function renderRows(entries: BugIndexEntry[], includeScope: boolean): string {
  if (entries.length === 0) {
    return includeScope ? "| - | - | - | - | - | - | - | - | - | - |" : "| - | - | - | - | - | - | - | - | - |";
  }
  return entries.map((entry) => {
    const cells = [
      escapeCell(entry.type),
      escapeCell(entry.status),
      `[${entry.id}](${normalizarPath(path.relative("docs/bugs", entry.reportPath))})`,
      escapeCell(formatearFecha(entry.createdAt)),
      escapeCell(formatearContexto(entry)),
      escapeCell(recortar(entry.text, 150)),
      escapeCell(recortar(entry.resolution, 130)),
      String(entry.screenshots),
      escapeCell(entry.note),
    ];
    if (includeScope) cells.unshift(escapeCell(entry.scope));
    return `| ${cells.join(" | ")} |`;
  }).join("\n");
}

function contarPor(entries: BugIndexEntry[], getKey: (entry: BugIndexEntry) => string): Array<[string, number]> {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const key = getKey(entry);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function ordenarEntries(entries: BugIndexEntry[]): BugIndexEntry[] {
  return [...entries].sort((a, b) =>
    compararFechaDesc(a.createdAt, b.createdAt) ||
    a.scope.localeCompare(b.scope) ||
    a.id.localeCompare(b.id)
  );
}

function inferirEstadoArchivado(closure: string): string {
  const normalized = closure.toLowerCase();
  if (normalized.includes("no-defecto")) return "No defecto";
  if (normalized.includes("obsoleto") || normalized.includes("refactor general")) return "Absorbido";
  return "Resuelto";
}

function inferirTipo(text: string): string {
  const normalized = text.toLowerCase();
  if (/\b(feat|feature|funci[oó]n|generemos|quiero|que exista)\b/.test(normalized)) return "Feat";
  return DEFAULT_TYPE;
}

function normalizarTipo(input: string): string {
  const normalized = input.toLowerCase();
  if (/\b(feat|feature)\b/.test(normalized)) return "Feat";
  if (/\bbug|defecto|error|fallo\b/.test(normalized)) return "Bug";
  if (input === "Feat" || input === "Bug") return input;
  return DEFAULT_TYPE;
}

function formatearContexto(entry: BugIndexEntry): string {
  if (entry.modelName && entry.opdName) return `${entry.modelName} / ${entry.opdName}`;
  return entry.modelName || entry.opdName || "-";
}

function formatearFecha(value: string): string {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(value);
  return match ? `${match[1]} ${match[2]}Z` : value || "-";
}

function compararFechaDesc(a: string, b: string): number {
  if (a && b && a !== b) return b.localeCompare(a);
  if (a && !b) return -1;
  if (!a && b) return 1;
  return 0;
}

function extraerCampoMarkdown(markdown: string, campo: string): string | null {
  const escaped = campo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`^\\*\\*${escaped}\\*\\*:\\s*(.+)$`, "m").exec(markdown);
  return match?.[1]?.trim() || null;
}

function extraerTextoReport(markdown: string): string | null {
  const match = /^## Texto\s+([\s\S]*?)(?:\n## |\n```|$)/m.exec(markdown);
  return match?.[1]?.trim() || null;
}

async function leerJsonOpcional(filePath: string): Promise<unknown> {
  const text = await leerTextoOpcional(filePath);
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

async function leerTextoOpcional(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") return "";
    throw error;
  }
}

function asRecord(input: unknown): Record<string, unknown> | null {
  return input && typeof input === "object" && !Array.isArray(input)
    ? input as Record<string, unknown>
    : null;
}

function asString(input: unknown): string | null {
  return typeof input === "string" && input.trim() ? input.trim() : null;
}

function limpiarMarkdownInline(input: string): string {
  return input
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeCell(input: string): string {
  return input.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}

function recortar(input: string, maxLength: number): string {
  const normalized = input.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1)}…`;
}

function normalizarPath(input: string): string {
  return input.replace(/\\/g, "/");
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
