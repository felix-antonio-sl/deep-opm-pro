import { useEffect, useMemo, useState } from "preact/hooks";
import { exportarOpdOffscreenSvgPng } from "../../render/jointjs/mapaExport";
import { generarOpl } from "../../opl/generar";
import { cachePortableReaderAssets, readStoredPortablePackage, storePortablePackage } from "../../persistencia/readerCache";
import { readPortablePackage, type PortablePackageReadResult, type PortableRevisionView } from "../../serializacion/portablePackage";
import "./portable.css";

export function PortableReaderPage() {
  const [result, setResult] = useState<PortablePackageReadResult | null>(null);
  const [revisionId, setRevisionId] = useState("");
  const [opdId, setOpdId] = useState("");
  const [diagram, setDiagram] = useState("");
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("package");
    if (!id) {
      setBusy(false);
      return;
    }
    let current = true;
    setBusy(true);
    readStoredPortablePackage(id).then(async (bytes) => {
      if (!bytes) throw new Error("No hay una copia local para este enlace. Selecciona el archivo portable desde tu dispositivo.");
      const opened = await readPortablePackage(bytes);
      if (!current) return;
      setResult(opened);
      if (opened.kind === "ready") {
        setRevisionId(opened.package.manifest.selectedRevisionId);
      }
      setError("");
    }).catch((cause) => {
      if (current) setError(errorMessage(cause));
    }).finally(() => { if (current) setBusy(false); });
    return () => { current = false; };
  }, []);

  const revisions = result?.kind === "ready" ? result.revisions : [];
  const selectedRevision = revisions.find((item) => item.id === revisionId) ?? revisions[0] ?? null;
  const model = selectedRevision?.model ?? null;
  const opds = useMemo(() => model ? Object.values(model.opds).sort((left, right) => left.nombre.localeCompare(right.nombre)) : [], [model]);
  const selectedOpdId = model && model.opds[opdId] ? opdId : selectedRevision?.selectedOpdId ?? model?.opdRaizId ?? "";
  const opl = useMemo(() => model && selectedOpdId ? generarOpl(model, selectedOpdId) : [], [model, selectedOpdId]);

  useEffect(() => {
    if (!model || !selectedOpdId || result?.kind !== "ready") {
      setDiagram("");
      return;
    }
    let active = true;
    setDiagram("");
    exportarOpdOffscreenSvgPng(model, selectedOpdId, { fondo: "blanco" }).then((rendered) => {
      if (active) setDiagram(rendered?.svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(rendered.svg)}` : "");
    }).catch(() => { if (active) setDiagram(""); });
    return () => { active = false; };
  }, [model, selectedOpdId, result?.kind]);

  const openFile = async (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    if (file.size > 40 * 1024 * 1024) {
      setError("El archivo supera el límite de 40 MB.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const opened = await readPortablePackage(new Uint8Array(await file.arrayBuffer()));
      setResult(opened);
      if (opened.kind === "ready") {
        setRevisionId(opened.package.manifest.selectedRevisionId);
        setOpdId("");
      }
    } catch (cause) {
      setResult(null);
      setError(errorMessage(cause));
    } finally { setBusy(false); }
  };

  const saveLocalCopy = async () => {
    if (!result) return;
    setBusy(true);
    setError("");
    try {
      const id = await storePortablePackage(result.originalBytes);
      window.location.assign(`/portable-reader/?package=${encodeURIComponent(id)}`);
    } catch (cause) {
      setError(errorMessage(cause));
      setBusy(false);
    }
  };

  const prepareOffline = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const cached = await cachePortableReaderAssets();
      setMessage(cached.cached ? `Lector guardado para uso sin conexión (${cached.cachedCount} recursos).` : cached.message);
    } catch (cause) { setError(errorMessage(cause)); }
    finally { setBusy(false); }
  };

  return (
    <main class="portable-reader">
      <header class="portable-reader__header">
        <p class="portable-reader__eyebrow">OPFORJA · LECTOR PORTABLE</p>
        <h1>{model?.nombre ?? "Abrir un paquete portable"}</h1>
        <p class="portable-reader__meta">Lector local de archivos JSON · no inicia sesión ni consulta modelos externos.</p>
      </header>

      <section class="portable-reader__section" aria-labelledby="portable-open-heading">
        <div class="portable-reader__section-heading"><div><p class="portable-reader__eyebrow">ARCHIVO</p><h2 id="portable-open-heading">Abrir paquete</h2></div></div>
        <div class="portable-reader__actions">
          <input class="portable-reader__file" type="file" accept=".json,.opforja.json,application/json" aria-label="Elegir paquete portable" onChange={openFile} />
          {result && <>
            <button type="button" onClick={saveLocalCopy} disabled={busy}>Guardar copia en este dispositivo</button>
            <button type="button" onClick={prepareOffline} disabled={busy}>Preparar para uso sin conexión</button>
            <button type="button" onClick={() => downloadBytes(result.originalBytes)} disabled={busy}>Descargar original</button>
          </>}
        </div>
        {busy && <p role="status">{result ? "Procesando paquete…" : "Buscando una copia local…"}</p>}
        {message && <p class="portable-reader__callout" role="status">{message}</p>}
        {error && <p class="portable-reader__callout portable-reader__callout--error" role="alert">{error}</p>}
      </section>

      {!result && !busy && !error && <section class="portable-reader__section"><p>Selecciona un archivo portable. El lector lo procesa en este dispositivo y no lo envía a ningún servicio.</p></section>}
      {result?.kind === "unsupported-format" || result?.kind === "unsupported-version" ? <section class="portable-reader__section">
        <p class="portable-reader__callout portable-reader__callout--warning" role="status">{result.message}</p>
        <p>El lector conserva los bytes originales. No interpreta ni reescribe este formato.</p>
      </section> : null}
      {result?.kind === "unsupported-profile" && <section class="portable-reader__section">
        <p class="portable-reader__callout portable-reader__callout--warning" role="status">{result.message}</p>
        <p>El modelo no se abre con este perfil. Puedes descargar el paquete original sin cambios.</p>
      </section>}
      {result?.kind === "ready" && <>
        <section class="portable-reader__section" aria-labelledby="portable-manifest-heading">
          <div class="portable-reader__section-heading"><div><p class="portable-reader__eyebrow">CONTENIDO</p><h2 id="portable-manifest-heading">{result.package.revisions.length} revisión{result.package.revisions.length === 1 ? "" : "es"}</h2></div></div>
          <p><strong>Perfil:</strong> {result.package.profile.id} · {result.package.profile.version}</p>
          <p><strong>Huella:</strong> bytes del contenido verificados. Esto no acredita la verdad ni equivalencia normativa del modelo.</p>
          {result.package.revisions.length > 1 && <label>Revisión
            <select value={selectedRevision?.id ?? ""} onChange={(event) => { setRevisionId((event.currentTarget as HTMLSelectElement).value); setOpdId(""); }}>
              {result.package.revisions.map((revision) => <option key={revision.id} value={revision.id}>{revision.label} · {formatDate(revision.createdAt)}</option>)}
            </select>
          </label>}
          <p class="portable-reader__meta">{selectedRevision?.label} · {selectedRevision ? formatDate(selectedRevision.createdAt) : ""}</p>
        </section>

        {model && selectedRevision && <section class="portable-reader__section" aria-labelledby="portable-model-heading">
          <div class="portable-reader__section-heading">
            <div><p class="portable-reader__eyebrow">MODELO</p><h2 id="portable-model-heading">Diagramas y enunciados</h2></div>
            <label for="portable-opd">Diagrama</label>
            <select id="portable-opd" value={selectedOpdId} onChange={(event) => setOpdId((event.currentTarget as HTMLSelectElement).value)}>
              {opds.map((opd) => <option key={opd.id} value={opd.id}>{opd.nombre}</option>)}
            </select>
          </div>
          <div class="portable-reader__diagram" aria-live="polite">
            {diagram ? <img src={diagram} alt={`Diagrama OPM: ${model.opds[selectedOpdId]?.nombre ?? model.nombre}`} /> : <p role="status">No se pudo mostrar este diagrama.</p>}
          </div>
          <details>
            <summary>Leer OPL de este diagrama</summary>
            {opl.length ? <ol class="portable-reader__opl">{opl.map((line, index) => <li key={`${index}:${line}`}>{line}</li>)}</ol> : <p>No hay enunciados para este diagrama.</p>}
          </details>
        </section>}

        {result.package.sources.included.length > 0 && <section class="portable-reader__section" aria-labelledby="portable-sources-heading">
          <div class="portable-reader__section-heading"><div><p class="portable-reader__eyebrow">EVIDENCIA INCLUIDA</p><h2 id="portable-sources-heading">Fuentes autorizadas</h2></div></div>
          <div class="portable-reader__source-list">{result.package.sources.included.map((source) => <details class="portable-reader__source" key={source.id}>
            <summary>{source.title}</summary>
            <p class="portable-reader__muted">Contenido incluido con autorización humana · SHA-256 de estos bytes verificado</p>
            <pre>{source.content}</pre>
            <Locator locator={source.locator} />
          </details>)}</div>
        </section>}

        {result.package.sources.omitted.length > 0 && <section class="portable-reader__section" aria-labelledby="portable-omitted-heading">
          <div class="portable-reader__section-heading"><div><p class="portable-reader__eyebrow">CONTENIDO NO INCLUIDO</p><h2 id="portable-omitted-heading">Referencias externas y omitidas</h2></div></div>
          <div class="portable-reader__source-list">{result.package.sources.omitted.map((source) => <details class="portable-reader__source" key={source.id}>
            <summary>{source.title}</summary><p>{source.reason}</p><Locator locator={source.locator} />
          </details>)}</div>
        </section>}
      </>}
      <footer class="portable-reader__footer">El archivo permanece en este dispositivo. Las referencias omitidas no están disponibles dentro del paquete.</footer>
    </main>
  );
}

function Locator({ locator }: { locator: string }) {
  const href = safeWebUrl(locator);
  return <p class="portable-reader__meta">Referencia: {href ? <a href={href} rel="noreferrer noopener" target="_blank">{locator}</a> : <code>{locator}</code>}</p>;
}

function safeWebUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch { return null; }
}

function downloadBytes(bytes: Uint8Array): void {
  const copy = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(copy).set(bytes);
  const url = URL.createObjectURL(new Blob([copy], { type: "application/json;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "paquete-portable-original.opforja.json";
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(date) : "fecha no disponible";
}

function errorMessage(value: unknown): string {
  return value instanceof Error ? value.message : "No se pudo abrir este paquete portable.";
}
