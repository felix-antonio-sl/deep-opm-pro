import { useMemo, useState } from "preact/hooks";
import type { Modelo } from "../../modelo/tipos";
import { exportarModelo } from "../../serializacion/json";
import { createPortablePackage, PORTABLE_READER_PROFILE, type PortableIncludedSourceInput, type PortableOmittedSourceInput } from "../../serializacion/portablePackage";
import { cachePortableReaderAssets, storePortablePackage } from "../../persistencia/readerCache";
import "./portable.css";

export interface PortablePackagePanelProps {
  model: Modelo;
  selectedOpdId: string;
}

/** Exporta la revisión de trabajo abierta; no consulta historial remoto ni incluye fuentes sin consentimiento. */
export function PortablePackagePanel({ model, selectedOpdId }: PortablePackagePanelProps) {
  const [selectedSources, setSelectedSources] = useState<Set<string>>(() => new Set());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const sourceCandidates = useMemo(() => Object.values(model.mesaExploracion?.fuentes ?? {}), [model.mesaExploracion?.fuentes]);
  const omittedSources = useMemo(() => externalLocators(model), [model]);
  const selected = useMemo(() => sourceCandidates.filter((source) => selectedSources.has(source.id)), [sourceCandidates, selectedSources]);

  const revision = useMemo(() => ({
    id: `working:${model.id}`,
    modelJson: exportarModelo(model),
    label: `${model.nombre} · revisión de trabajo actual`,
    selectedOpdId: model.opds[selectedOpdId] ? selectedOpdId : model.opdRaizId,
  }), [model, selectedOpdId]);

  const buildPackage = () => createPortablePackage({
    profile: PORTABLE_READER_PROFILE,
    revisions: [revision],
    selectedRevisionId: revision.id,
    includedSources: selected.map((source): PortableIncludedSourceInput => ({
      id: `mesa:${source.id}`,
      modelSourceId: source.id,
      title: source.titulo ?? "Fuente de la mesa",
      locator: `opforja://mesa-exploracion/${encodeURIComponent(source.id)}`,
      content: source.contenido,
      mediaType: "text/plain",
      authorizedByUser: true,
    })),
    omittedSources,
  });

  const download = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const bytes = await buildPackage();
      downloadBytes(bytes, `${fileSlug(model.nombre)}.opforja.json`);
      setMessage(`Paquete descargado (${formatBytes(bytes.byteLength)}). Contiene la revisión de trabajo abierta${selected.length ? ` y ${selected.length} fuente${selected.length === 1 ? "" : "s"} autorizada${selected.length === 1 ? "" : "s"}` : ""}.`);
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  };

  const openPortable = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const bytes = await buildPackage();
      const id = await storePortablePackage(bytes);
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
      const result = await cachePortableReaderAssets();
      setMessage(result.cached
        ? `Lector preparado para uso sin conexión (${result.cachedCount} recursos declarados).`
        : result.message);
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section class="portable-package" aria-labelledby="portable-package-heading">
      <p class="portable-package__eyebrow">LECTURA Y RESGUARDO</p>
      <h2 id="portable-package-heading">Paquete portable</h2>
      <p class="portable-package__intro">Incluye el modelo y sus vistas. Las fuentes textuales quedan fuera hasta que marques cada una.</p>

      <div class="portable-package__revision" data-testid="portable-current-revision">
        <strong>{model.nombre}</strong>
        <span>Revisión de trabajo actual{model.versiones?.length ? ` · ${model.versiones.length} snapshots registrados; este paquete exporta solo el estado abierto` : ""}</span>
      </div>

      {sourceCandidates.length > 0 && <fieldset class="portable-package__sources">
        <legend>Fuentes de la mesa</legend>
        <p>Autoriza por separado cada contenido que quieras llevar en el archivo.</p>
        {sourceCandidates.map((source) => {
          const checked = selectedSources.has(source.id);
          return <label key={source.id} class="portable-package__source">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => setSelectedSources((current) => {
                const next = new Set(current);
                if (next.has(source.id)) next.delete(source.id);
                else next.add(source.id);
                return next;
              })}
            />
            <span><strong>{source.titulo ?? "Fuente sin título"}</strong><small>{checked ? "Su texto se incluirá en el paquete." : "Su texto no se incluirá."}</small></span>
          </label>;
        })}
      </fieldset>}

      {omittedSources.length > 0 && <p class="portable-package__omitted">{omittedSources.length} pieza externa conserva su referencia y estado; su contenido sigue en su sistema de origen.</p>}
      <p class="portable-package__integrity">La huella detecta cambios en los bytes del contenido. No acredita la verdad del modelo ni equivalencia normativa.</p>

      {error && <p class="portable-package__message portable-package__message--error" role="alert">{error}</p>}
      {message && <p class="portable-package__message" role="status">{message}</p>}
      <div class="portable-package__actions">
        <button type="button" onClick={download} disabled={busy}>{busy ? "Preparando…" : "Descargar paquete"}</button>
        <button type="button" onClick={openPortable} disabled={busy}>Abrir en lector portable</button>
        <button type="button" class="portable-package__secondary" onClick={prepareOffline} disabled={busy}>Preparar lector sin conexión</button>
      </div>
    </section>
  );
}

function externalLocators(model: Modelo): PortableOmittedSourceInput[] {
  const items: PortableOmittedSourceInput[] = [];
  for (const reference of Object.values(model.submodelos ?? {})) {
    const sourceModelId = reference.source?.modeloId ?? reference.modeloId;
    items.push({
      id: `external-submodel:${reference.id}`,
      title: reference.source?.nombre ?? reference.nombre,
      locator: `opforja://modelo/${encodeURIComponent(sourceModelId)}/submodelo/${encodeURIComponent(reference.id)}`,
      reason: `Pieza externa (${reference.estado}); el paquete conserva la referencia y no incluye su modelo de origen.`,
    });
  }
  const libraries = new Map<string, { modelId: string; name: string; pieceId: string }>();
  for (const entity of Object.values(model.entidades)) {
    const reference = entity.anclaje?.biblioteca;
    if (!reference) continue;
    const id = `${reference.modeloId}:${entity.anclaje?.piezaId}`;
    libraries.set(id, { modelId: reference.modeloId, name: reference.nombre ?? "Biblioteca externa", pieceId: entity.anclaje?.piezaId ?? entity.id });
  }
  for (const [key, library] of libraries) {
    items.push({
      id: `external-library:${key}`,
      title: library.name,
      locator: `opforja://biblioteca/${encodeURIComponent(library.modelId)}/pieza/${encodeURIComponent(library.pieceId)}`,
      reason: "Referencia viva a una pieza de biblioteca; su contenido no se incluye en el paquete.",
    });
  }
  return items;
}

function downloadBytes(bytes: Uint8Array, filename: string): void {
  const copy = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(copy).set(bytes);
  const blob = new Blob([copy], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function fileSlug(value: string): string {
  const slug = value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64);
  return slug || "modelo-opm";
}

function formatBytes(bytes: number): string {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function errorMessage(value: unknown): string {
  return value instanceof Error ? value.message : "No se pudo crear el paquete portable.";
}
