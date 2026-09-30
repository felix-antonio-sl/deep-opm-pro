import type { DocumentOperationsPort } from "../app/ports/documentOperationsPort";
import type { Modelo } from "../modelo/tipos";
import { ReviewDocumentAction } from "./ReviewDocumentAction";
import { RefinementProposalAction } from "./RefinementProposalAction";
import { PortableDocumentAction } from "./PortableDocumentAction";
import { DocumentPersistenceStatus } from "./DocumentPersistenceStatus";
import { PieceProposalAction } from "./reuse/PieceProposalAction";
import { tokens } from "./tokens";

export function DocumentActions({ documentId, localDocumentId, model, opdId, operations, compact = false }: {
  documentId: string | null; localDocumentId: string; model: Modelo; opdId: string; operations: DocumentOperationsPort | null; compact?: boolean;
}) {
  const actions = <>
    <ReviewDocumentAction documentId={documentId} model={model} />
    <RefinementProposalAction key={documentId ?? "unsaved"} model={model} opdId={opdId} operations={operations} />
    <PieceProposalAction key={`piece:${documentId ?? "unsaved"}`} model={model} opdId={opdId} operations={operations} />
    <PortableDocumentAction model={model} opdId={opdId} />
  </>;
  return <div aria-label="Acciones del documento" style={{ display: "flex", flexWrap: "wrap", alignItems: "center",
    borderBottom: `1px solid ${tokens.colors.rule}`, background: tokens.colors.paper }}>
    <DocumentPersistenceStatus key={localDocumentId} documentId={localDocumentId} model={model} />
    {compact ? <details style={{ font: `12px ${tokens.typography.serif}`, color: tokens.colors.inkMid }}>
      <summary style={{ cursor: "pointer", padding: "5px 12px" }}>Acciones del documento</summary>
      <div style={{ display: "grid" }}>{actions}</div>
    </details> : actions}
  </div>;
}
