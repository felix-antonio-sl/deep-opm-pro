import { lazy, Suspense } from "preact/compat";
import { useState } from "preact/hooks";
import type { Modelo } from "../modelo/tipos";
import { createDocumentReviewOwnerPort } from "../app/ports/reviewOwnerPort";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";

const SharePanel = lazy(() => import("./review/ReviewSharePanel").then((module) => ({ default: module.ReviewSharePanel })));

export function ReviewDocumentAction({ documentId, model }: { documentId: string | null; model: Modelo }) {
  const [open, setOpen] = useState(false);
  const [ownerPort] = useState(createDocumentReviewOwnerPort);
  return <>
    <button type="button" onClick={() => setOpen(true)} disabled={!documentId}
      title={documentId ? "Compartir una revisión fija del documento" : "Guarda el documento para compartir una revisión"}
      style={{ border: 0, padding: "5px 12px", background: "transparent",
        color: tokens.colors.inkMid, font: `12px ${tokens.typography.serif}`, cursor: documentId ? "pointer" : "default", textAlign: "left" }}>
      Compartir revisión…
    </button>
    {open && documentId ? <Dialogo open title="Compartir revisión" size="lg" onCancel={() => setOpen(false)}
      actions={<DialogoAccion onClick={() => setOpen(false)}>Cerrar</DialogoAccion>}>
      <Suspense fallback={<p role="status">Abriendo las revisiones…</p>}>
        <SharePanel key={documentId} documentId={documentId} model={model} ownerPort={ownerPort} />
      </Suspense>
    </Dialogo> : null}
  </>;
}
