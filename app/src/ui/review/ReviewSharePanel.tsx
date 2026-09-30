import { useEffect, useMemo, useState } from "preact/hooks";
import type { ReviewAnnotationView, ReviewReaderView, ReviewShareOwnerView } from "../../modelo/review";
import type { ReviewOwnerPanelProps } from "../../app/ports/reviewPort";
import "./review.css";

export function ReviewSharePanel({ documentId, model, ownerPort }: ReviewOwnerPanelProps) {
  const [shares, setShares] = useState<ReviewShareOwnerView[]>([]);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const [annotate, setAnnotate] = useState(true);
  const [activeReview, setActiveReview] = useState<{ shareId: string; view: ReviewReaderView } | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState<Record<string, string>>({});

  const sources = useMemo(() => Object.values(model.mesaExploracion?.fuentes ?? {}).sort((a, b) =>
    (a.titulo ?? "Fuente de texto").localeCompare(b.titulo ?? "Fuente de texto")), [model]);

  const refresh = async (signal?: AbortSignal) => {
    try {
      setShares(await ownerPort.list(documentId, signal));
    } catch {
      if (!signal?.aborted) setError("No se pudieron cargar las revisiones compartidas.");
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal);
    return () => controller.abort();
  }, [documentId, ownerPort]);

  const toggleSource = (sourceId: string) => {
    setSelectedSourceIds((current) => current.includes(sourceId)
      ? current.filter((id) => id !== sourceId)
      : [...current, sourceId]);
  };

  const createShare = async (event: Event) => {
    event.preventDefault();
    setBusy(true); setError(""); setStatus("");
    try {
      const created = await ownerPort.create({ documentId, includedSourceIds: selectedSourceIds, annotate });
      setShares((current) => [created.share, ...current.filter((share) => share.id !== created.share.id)]);
      setShareUrl(`${window.location.origin}/revision/${encodeURIComponent(created.token)}`);
      setStatus(`Revisión ${created.share.revision} compartida.`);
      setActiveReview(null);
    } catch {
      setError("No se pudo compartir esta revisión. Recarga el modelo y vuelve a intentarlo.");
    } finally { setBusy(false); }
  };

  const copyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus("Enlace copiado.");
    } catch {
      const input = document.getElementById("review-share-link") as HTMLInputElement | null;
      input?.focus(); input?.select();
      setStatus("Selecciona el enlace y cópialo.");
    }
  };

  const revoke = async (share: ReviewShareOwnerView) => {
    setBusy(true); setError(""); setStatus("");
    try {
      await ownerPort.revoke(documentId, share.id);
      setShares((current) => current.map((item) => item.id === share.id ? { ...item, revokedAt: new Date().toISOString() } : item));
      if (activeReview?.shareId === share.id) setActiveReview(null);
      setStatus("Enlace revocado.");
    } catch { setError("No se pudo revocar el enlace."); }
    finally { setBusy(false); }
  };

  const openReview = async (share: ReviewShareOwnerView) => {
    if (activeReview?.shareId === share.id) { setActiveReview(null); return; }
    setBusy(true); setError("");
    try {
      setActiveReview({ shareId: share.id, view: await ownerPort.get(documentId, share.id) });
    } catch { setError("No se pudieron cargar las anotaciones de esta revisión."); }
    finally { setBusy(false); }
  };

  const resolve = async (shareId: string, annotation: ReviewAnnotationView, outcome: "addressed" | "kept") => {
    if (!activeReview || activeReview.shareId !== shareId) return;
    setBusy(true); setError("");
    try {
      const updated = await ownerPort.resolve({
        documentId,
        shareId,
        annotationId: annotation.id,
        outcome,
        note: resolutionNotes[annotation.id] ?? "",
      });
      setActiveReview((current) => current?.shareId === shareId ? {
        ...current,
        view: { ...current.view, annotations: current.view.annotations.map((item) => item.id === updated.id ? updated : item) },
      } : current);
      setResolutionNotes((current) => ({ ...current, [annotation.id]: "" }));
    } catch { setError("No se pudo registrar la resolución."); }
    finally { setBusy(false); }
  };

  return (
    <section class="review-owner" aria-labelledby="review-owner-heading">
      <header class="review-owner__header">
        <div><p class="review-reader__eyebrow">LECTURA COMPARTIDA</p><h2 id="review-owner-heading">Revisión compartida</h2></div>
        <p>Quien tenga este enlace podrá ver esta revisión.</p>
      </header>

      <form class="review-owner__form" onSubmit={createShare}>
        <fieldset class="review-owner__fieldset">
          <legend>Fuentes que podrá leer</legend>
          {sources.length ? sources.map((source) => <label class="review-owner__check" key={source.id}>
            <input type="checkbox" checked={selectedSourceIds.includes(source.id)} onChange={() => toggleSource(source.id)} />
            <span>{source.titulo ?? "Fuente de texto"}</span>
          </label>) : <p class="review-owner__help">Este modelo no tiene fuentes de texto para compartir.</p>}
          <p class="review-owner__help">Las fuentes sin seleccionar y sus fragmentos quedan fuera de la revisión.</p>
        </fieldset>
        <label class="review-owner__check">
          <input type="checkbox" checked={annotate} onChange={(event) => setAnnotate((event.currentTarget as HTMLInputElement).checked)} />
          <span>Permitir anotaciones</span>
        </label>
        <button type="submit" disabled={busy}>{busy ? "Guardando…" : "Compartir revisión"}</button>
      </form>

      {shareUrl && <div class="review-owner__created" aria-label="Enlace de revisión compartida">
        <label for="review-share-link">Enlace de la revisión</label>
        <div class="review-owner__link-row"><input id="review-share-link" readonly value={shareUrl} /><button type="button" onClick={copyLink}>Copiar enlace</button></div>
      </div>}
      {status && <p role="status" class="review-owner__status">{status}</p>}
      {error && <p role="alert" class="review-reader__error">{error}</p>}

      {shares.length > 0 && <section class="review-owner__existing" aria-label="Enlaces creados">
        <h3>Enlaces creados</h3>
        <ul>
          {shares.map((share) => <li key={share.id}>
            <div class="review-owner__share-summary">
              <div><strong>{share.modelName} · revisión {share.revision}</strong><small>{share.source === "autosave" ? "Copia de trabajo" : "Guardada"} · {share.permissions.annotate ? "admite anotaciones" : "solo lectura"}</small>
                {share.includedSources.length > 0 && <small>Fuentes: {share.includedSources.map((source) => source.title).join(", ")}</small>}
              </div>
              <div class="review-owner__share-actions">
                <button type="button" onClick={() => void openReview(share)} disabled={busy}>{activeReview?.shareId === share.id ? "Ocultar anotaciones" : "Ver anotaciones"}</button>
                {share.revokedAt ? <span>Revocado</span> : <button class="review-owner__revoke" type="button" onClick={() => void revoke(share)} disabled={busy}>Revocar</button>}
              </div>
            </div>
            {activeReview?.shareId === share.id && <div class="review-owner__annotation-list">
              {activeReview.view.annotations.length === 0 ? <p>Todavía no hay anotaciones.</p> : activeReview.view.annotations.map((annotation) => <article class="review-reader__annotation" key={annotation.id}>
                <p class="review-reader__annotation-meta">{annotation.actorLabel} · revisión {annotation.revision} · {new Date(annotation.createdAt).toLocaleDateString("es")}</p>
                <p>{annotation.text}</p>
                {annotation.resolutions.map((resolution) => <div class="review-reader__resolution" key={resolution.id}>
                  <strong>{resolution.actorLabel}: {resolution.outcome === "addressed" ? "Atendida" : "Se conserva"} · revisión {resolution.revision}</strong>
                  <p>{resolution.note || "Sin comentario adicional."}</p>
                  {!resolution.anchorPresent && <small>El referente ya no existe en el modelo actual; la anotación conserva su ancla original.</small>}
                </div>)}
                {!share.revokedAt && <div class="review-owner__resolve">
                  <label for={`review-resolution-${annotation.id}`}>Nota de resolución (opcional)</label>
                  <textarea id={`review-resolution-${annotation.id}`} rows={2} value={resolutionNotes[annotation.id] ?? ""} onInput={(event) => setResolutionNotes((current) => ({ ...current, [annotation.id]: (event.currentTarget as HTMLTextAreaElement).value }))} />
                  <div><button type="button" disabled={busy} onClick={() => void resolve(share.id, annotation, "addressed")}>Marcar atendida</button><button type="button" disabled={busy} onClick={() => void resolve(share.id, annotation, "kept")}>Mantener sin cambios</button></div>
                </div>}
              </article>)}
            </div>}
          </li>)}
        </ul>
      </section>}
    </section>
  );
}
