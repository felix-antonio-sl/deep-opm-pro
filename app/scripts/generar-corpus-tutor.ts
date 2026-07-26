import { createHash } from "node:crypto";
import {
  chmodSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { TUTOR_SOURCES } from "../src/tutor/fuentes";
import {
  renderTutorMarkdownPage,
  TUTOR_MARKDOWN_RENDERER_VERSION,
} from "./render-tutor-markdown";

const appRoot = resolve(import.meta.dir, "..");
const repoRoot = resolve(appRoot, "..");
const outputRoot = join(appRoot, ".tutor-corpus");
const lockPath = join(appRoot, ".tutor-corpus.lock");
const resolverPath = join(repoRoot, "docs/canon-opm/resolutor-urn.json");
const MANIFEST_SCHEMA_VERSION = 2;

interface ResolverConfig {
  kora_raiz_default: string;
  urn: Record<string, { path: string; version: string }>;
}

interface MaterializedSource {
  sourceId: string;
  title: string;
  locator: string;
  documentPath: string;
  anchors: readonly { id: string; label: string; heading: string }[];
  digest: string;
  bytes: number;
}

if (process.env.TUTOR_CORPUS_PREBUILT === "1") {
  const manifestPath = join(outputRoot, "tutor-sources/manifest.json");
  try {
    statSync(manifestPath);
    asegurarPermisosCorpus();
    process.exit(0);
  } catch {
    throw new Error("TUTOR_CORPUS_PREBUILT=1 exige app/.tutor-corpus generado antes del build Docker.");
  }
}

await conLock(async () => {
  const resolver = JSON.parse(readFileSync(resolverPath, "utf8")) as ResolverConfig;
  const canonicalRoot = process.env.TUTOR_CANON_ROOT ?? resolver.kora_raiz_default;
  const inputs = TUTOR_SOURCES.map((source) => {
    const inputPath = source.locator.startsWith("urn:")
      ? resolverCanonicalPath(source.locator, resolver, canonicalRoot)
      : resolve(repoRoot, source.locator);
    const body = readFileSync(inputPath, "utf8");
    validarIntegridad(source, body, resolver);
    validarAnclas(source, body);
    return { source, body, digest: sha256(body) };
  });
  const fingerprint = sha256(JSON.stringify({
    schemaVersion: MANIFEST_SCHEMA_VERSION,
    markdownRendererVersion: TUTOR_MARKDOWN_RENDERER_VERSION,
    sources: inputs.map(({ source, digest }) => ({
      sourceId: source.sourceId,
      documentPath: source.documentPath,
      anchors: source.anchors,
      digest,
    })),
  }));
  const manifestActual = leerManifest();
  if (manifestActual?.fingerprint === fingerprint) {
    asegurarPermisosCorpus();
    return;
  }

  // El staging debe vivir junto al destino: `renameSync` no cruza sistemas de
  // archivos (EXDEV), algo habitual cuando el repo y /tmp usan montajes distintos.
  const tempRoot = join(appRoot, `.tutor-corpus.tmp-${process.pid}-${Date.now()}`);
  const tempSources = join(tempRoot, "tutor-sources");
  mkdirSync(tempSources, { recursive: true });
  const materialized: MaterializedSource[] = [];

  try {
    for (const { source, body, digest } of inputs) {
      const fileName = `${source.sourceId}.html`;
      const html = source.locator.endsWith(".html")
        ? instrumentarHtml(body, source.anchors)
        : renderTutorMarkdownPage(source.title, source.locator, body, source.anchors);
      writeFileSync(join(tempSources, fileName), html, "utf8");
      materialized.push({
        sourceId: source.sourceId,
        title: source.title,
        locator: source.locator,
        documentPath: source.documentPath,
        anchors: source.anchors,
        digest,
        bytes: Buffer.byteLength(body),
      });
    }
    writeFileSync(join(tempSources, "manifest.json"), JSON.stringify({
      schemaVersion: MANIFEST_SCHEMA_VERSION,
      markdownRendererVersion: TUTOR_MARKDOWN_RENDERER_VERSION,
      fingerprint,
      sources: materialized,
    }, null, 2), "utf8");
    rmSync(outputRoot, { recursive: true, force: true });
    renameSync(tempRoot, outputRoot);
    asegurarPermisosCorpus();
  } catch (error) {
    rmSync(tempRoot, { recursive: true, force: true });
    throw error;
  }
});

function asegurarPermisosCorpus(): void {
  const sourcesRoot = join(outputRoot, "tutor-sources");
  chmodSync(outputRoot, 0o755);
  chmodSync(sourcesRoot, 0o755);
  for (const fileName of readdirSync(sourcesRoot)) {
    chmodSync(join(sourcesRoot, fileName), 0o644);
  }
}

function resolverCanonicalPath(locator: string, resolver: ResolverConfig, root: string): string {
  const entry = resolver.urn[locator];
  if (!entry) throw new Error(`URN del tutor sin resolución: ${locator}`);
  return resolve(root, entry.path);
}

function validarIntegridad(
  source: (typeof TUTOR_SOURCES)[number],
  body: string,
  resolver: ResolverConfig,
): void {
  if (source.integrity.kind === "sha256") {
    const actual = sha256(body);
    if (actual !== source.integrity.value) {
      throw new Error(`${source.sourceId}: checksum esperado ${source.integrity.value}, recibido ${actual}.`);
    }
    return;
  }
  const version = resolver.urn[source.locator]?.version;
  if (version !== source.integrity.value) {
    throw new Error(`${source.sourceId}: versión esperada ${source.integrity.value}, resuelta ${version ?? "ausente"}.`);
  }
}

function validarAnclas(source: (typeof TUTOR_SOURCES)[number], body: string): void {
  const headings = extraerHeadings(body, source.locator.endsWith(".html"));
  for (const anchor of source.anchors) {
    if (!headings.some((heading) => normalizarHeading(heading) === normalizarHeading(anchor.heading))) {
      throw new Error(`${source.sourceId}: no existe heading para #${anchor.id}: ${anchor.heading}`);
    }
  }
}

function extraerHeadings(body: string, html: boolean): string[] {
  if (html) {
    return [...body.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)]
      .map((match) => textoHtml(match[1] ?? ""));
  }
  return body.split(/\r?\n/).flatMap((line) => {
    const match = /^(?:#{1,6})\s+(.+?)\s*$/.exec(line);
    return match?.[1] ? [match[1]] : [];
  });
}

function instrumentarHtml(
  body: string,
  anchors: readonly { id: string; heading: string }[],
): string {
  const byHeading = new Map(anchors.map((anchor) => [normalizarHeading(anchor.heading), anchor.id]));
  let instrumented = body.replace(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi, (full, level: string, attrs: string, inner: string) => {
    const id = byHeading.get(normalizarHeading(textoHtml(inner)));
    if (!id) return full;
    const cleanAttrs = attrs.replace(/\s+id=(?:"[^"]*"|'[^']*'|[^\s>]+)/i, "");
    return `<h${level}${cleanAttrs} id="${escapeAttr(id)}">${inner}</h${level}>`;
  });
  const styles = `<style id="opforja-tutor-source">:target{outline:3px solid #b11f2a;outline-offset:4px;scroll-margin-top:16px}</style>`;
  instrumented = /<\/head>/i.test(instrumented)
    ? instrumented.replace(/<\/head>/i, `${styles}</head>`)
    : `${styles}${instrumented}`;
  return instrumented;
}

function normalizarHeading(value: string): string {
  return textoHtml(value)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9§]+/g, " ")
    .trim()
    .toLocaleLowerCase("es");
}

function textoHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function leerManifest(): { fingerprint?: string } | null {
  try {
    return JSON.parse(readFileSync(join(outputRoot, "tutor-sources/manifest.json"), "utf8")) as { fingerprint?: string };
  } catch {
    return null;
  }
}

async function conLock(run: () => Promise<void>): Promise<void> {
  const deadline = Date.now() + 15_000;
  while (true) {
    try {
      mkdirSync(lockPath);
      break;
    } catch {
      if (Date.now() >= deadline) throw new Error("Timeout esperando generación concurrente del corpus tutor.");
      await Bun.sleep(50);
    }
  }
  try {
    await run();
  } finally {
    rmSync(lockPath, { recursive: true, force: true });
  }
}
