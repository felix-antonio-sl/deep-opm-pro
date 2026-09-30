import { useEffect, useMemo, useState } from "preact/hooks";
import { exportarOpdOffscreenSvgPng } from "../../render/jointjs/mapaExport";
import { generarOpl } from "../../opl/generar";
import { hidratarModelo } from "../../serializacion/json";
import type { ReviewAnnotationView, ReviewAnchor, ReviewReaderView } from "../../modelo/review";
import type { ReviewReaderPort } from "../../app/ports/reviewPort";
import "./review.css";

export interface RevisionReaderProps {
  token: string;
  port: ReviewReaderPort;
}

export function RevisionReader({ token: _token, port }: RevisionReaderProps) {
  const [view, setView] = useState<ReviewReaderView | null>(null);
  const [annotations, setAnnotations] = useState<ReviewAnnotationView[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [selectedOpdId, setSelectedOpdId] = useState("");
  const [selectedAnchor, setSelectedAnchor] = useState("model");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [diagram, setDiagram] = useState("");
  const [diagramError, setDiagramError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setBusy(true);
    port.load(controller.signal).then((loaded) => {
      if (controller.signal.aborted) return;
      setView(loaded);
      setAnnotations(loaded.annotations);
      const hydrated = hidratarModelo(loaded.modelJson);
      if (!hydrated.ok) throw new Error("La revisión no se pudo interpretar");
      setSelectedOpdId(hydrated.value.opdRaizId);
      setError("");
    }).catch(() => {
      if (!controller.signal.aborted) setError("Esta revisión no existe o dejó de estar disponible.");
    }).finally(() => { if (!controller.signal.aborted) setBusy(false); });
    return () => controller.abort();
  }, [port]);

  const model = useMemo(() => {
    if (!view) return null;
    const result = hidratarModelo(view.modelJson);
    return result.ok ? result.value : null;
  }, [view]);
  const opds = useMemo(() => model ? Object.values(model.opds).sort((a, b) => a.nombre.localeCompare(b.nombre)) : [], [model]);
  const anchors = useMemo(() => {
    if (!model) return [];
    return [
      { value: "model", label: `Modelo · ${model.nombre}`, anchor: { kind: "model" } as ReviewAnchor },
      ...Object.values(model.opds).map((item) => ({ value: `opd:${item.id}`, label: `OPD · ${item.nombre}`, anchor: { kind: "opd", id: item.id } as ReviewAnchor })),
      ...Object.values(model.entidades).map((item) => ({ value: `entity:${item.id}`, label: `Elemento · ${item.nombre}`, anchor: { kind: "entity", id: item.id } as ReviewAnchor })),
      ...Object.values(model.estados).map((item) => ({ value: `state:${item.id}`, label: `Estado · ${item.nombre}`, anchor: { kind: "state", id: item.id } as ReviewAnchor })),
      ...Object.values(model.enlaces).map((item) => ({ value: `link:${item.id}`, label: `Relación · ${item.etiqueta || item.id}`, anchor: { kind: "link", id: item.id } as ReviewAnchor })),
    ];
  }, [model]);
  const opl = useMemo(() => model && selectedOpdId ? generarOpl(model, selectedOpdId) : [], [model, selectedOpdId]);

  useEffect(() => {
    if (!model || !selectedOpdId) return;
    let active = true;
    setDiagram("");
    setDiagramError("");
    exportarOpdOffscreenSvgPng(model, selectedOpdId, { fondo: "blanco" }).then((rendered) => {
      if (!active) return;
      if (!rendered?.svg) setDiagramError("No se pudo mostrar este diagrama.");
      else setDiagram(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(rendered.svg)}`);
    }).catch(() => { if (active) setDiagramError("No se pudo mostrar este diagrama."); });
    return () => { active = false; };
  }, [model, selectedOpdId]);

  const submitAnnotation = async (event: Event) => {
    event.preventDefault();
    const target = anchors.find((item) => item.value === selectedAnchor)?.anchor;
    if (!target || !note.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const created = await port.annotate({ anchor: target, text: note.trim() });
      setAnnotations((current) => [...current, created]);
      setNote("");
    } catch {
      setError("No se pudo guardar la anotación. Comprueba si el autor la mantiene habilitada.");
    } finally { setSubmitting(false); }
  };

  if (busy) return <main class="review-reader" aria-busy="true"><p role="status">Abriendo revisión…</p></main>;
  if (error && !view) return <main class="review-reader"><h1>Revisión no disponible</h1><p role="alert">{error}</p></main>;
  if (!view || !model) return <main class="review-reader"><h1>Revisión no disponible</h1><p role="alert">No se pudo leer esta revisión.</p></main>;

  return (
    <main class="review-reader">
      <header class="review-reader__header">
        <p class="review-reader__eyebrow">REVISIÓN COMPARTIDA</p>
        <h1>{view.share.modelName}</h1>
        <p class="review-reader__meta">Revisión {view.share.revision} · {view.share.source === "autosave" ? "copia de trabajo" : "guardada"}</p>
      </header>

      <section class="review-reader__section" aria-labelledby="review-diagrams-heading">
        <div class="review-reader__section-heading">
          <div><p class="review-reader__eyebrow">MODELO</p><h2 id="review-diagrams-heading">Diagramas</h2></div>
          <label class="review-reader__select-label" for="review-opd-select">Diagrama</label>
          <select id="review-opd-select" value={selectedOpdId} onChange={(event) => setSelectedOpdId((event.currentTarget as HTMLSelectElement).value)}>
            {opds.map((opd) => <option key={opd.id} value={opd.id}>{opd.nombre}</option>)}
          </select>
        </div>
        <div class="review-reader__diagram" aria-live="polite">
          {diagram ? <img src={diagram} alt={`Diagrama OPM: ${model.opds[selectedOpdId]?.nombre ?? model.nombre}`} />
            : <p role="status">{diagramError || "Preparando diagrama…"}</p>}
        </div>
        <details class="review-reader__details">
          <summary>Leer enunciados de este diagrama</summary>
          {opl.length ? <ol>{opl.map((sentence, index) => <li key={`${index}:${sentence}`}>{sentence}</li>)}</ol> : <p>No hay enunciados en este diagrama.</p>}
        </details>
      </section>

      {(view.sources.length > 0 || view.share.omittedSourcesCount > 0) && <section class="review-reader__section" aria-labelledby="review-sources-heading">
        <div class="review-reader__section-heading"><div><p class="review-reader__eyebrow">EVIDENCIA</p><h2 id="review-sources-heading">Fuentes de esta revisión</h2></div></div>
        {view.share.omittedSourcesCount > 0 && <p role="note">Hay fuentes que no se incluyeron en esta revisión.</p>}
        {view.sources.length > 0 ? <div class="review-reader__sources">
          {view.sources.map((source) => <details key={source.id} class="review-reader__source">
            <summary>{source.title}</summary><pre>{source.content}</pre>
          </details>)}
        </div> : <p>No hay fuentes incluidas en esta revisión.</p>}
      </section>}

      <section class="review-reader__section" aria-labelledby="review-annotations-heading">
        <div class="review-reader__section-heading"><div><p class="review-reader__eyebrow">CONVERSACIÓN</p><h2 id="review-annotations-heading">Anotaciones</h2></div><span class="review-reader__count">{annotations.length}</span></div>
        {error && <p class="review-reader__error" role="alert">{error}</p>}
        {annotations.length ? <ol class="review-reader__annotations">
          {annotations.map((annotation) => <li key={annotation.id} class="review-reader__annotation">
            <div class="review-reader__annotation-meta">{annotation.actorLabel} · revisión {annotation.revision} · {formatDate(annotation.createdAt)}</div>
            <p>{annotation.text}</p>
            {annotation.resolutions.map((resolution) => <div key={resolution.id} class="review-reader__resolution">
              <strong>{resolution.actorLabel} · {resolution.outcome === "addressed" ? "Atendida" : "Se conserva"} · revisión {resolution.revision}</strong>
              <p>{resolution.note || "Sin comentario adicional."}</p>
              {!resolution.anchorPresent && <small>El referente cambió o ya no existe en la revisión actual; esta anotación conserva su ubicación original.</small>}
            </div>)}
          </li>)}
        </ol> : <p class="review-reader__empty">Todavía no hay anotaciones.</p>}

        {view.share.permissions.annotate ? <form class="review-reader__form" onSubmit={submitAnnotation}>
          <label for="review-anchor-select">Anclar al elemento</label>
          <select id="review-anchor-select" value={selectedAnchor} onChange={(event) => setSelectedAnchor((event.currentTarget as HTMLSelectElement).value)}>
            {anchors.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          <label for="review-note">Anotación</label>
          <textarea id="review-note" value={note} maxLength={5000} rows={4} onInput={(event) => setNote((event.currentTarget as HTMLTextAreaElement).value)} placeholder="Escribe una observación para esta revisión" />
          <div class="review-reader__form-footer"><span>{note.length}/5000</span><button type="submit" disabled={!note.trim() || submitting}>{submitting ? "Guardando…" : "Añadir anotación"}</button></div>
        </form> : <p class="review-reader__readonly">El autor compartió esta revisión en modo de lectura.</p>}
      </section>
      <footer class="review-reader__footer">Vista de solo lectura · la revisión y sus anotaciones conservan su historial.</footer>
    </main>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(date) : "fecha no disponible";
}
