import { useEffect, useMemo, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { createAgentTaskPort, createAgentDocumentOperationsPort, type AgentTaskPort } from "../../app/ports/agentTaskPort";
import type { DocumentOperationsPort } from "../../app/ports/documentOperationsPort";
import { createAgentClient } from "../../persistencia/agentClient";
import type { Modelo } from "../../modelo/tipos";
import { useOpmStore } from "../../store";
import { IntentBar } from "./IntentBar";

interface AgentWorkbenchProps {
  model: Modelo;
  activeOpdId: string;
  renderDocumentActions?: (operations: DocumentOperationsPort | null) => ComponentChildren;
}

/** Keeps the task agent beside the document while reusing its single operation-ordering port. */
export function AgentWorkbench({ model, activeOpdId, renderDocumentActions }: AgentWorkbenchProps) {
  const documentId = useOpmStore((state) => state.modeloPersistidoId);
  const selectedIds = useOpmStore((state) => state.seleccionados);
  const selectedEntityId = useOpmStore((state) => state.seleccionId);
  const selectedStateId = useOpmStore((state) => state.estadoSeleccionId);
  const selectionScope = useMemo(
    () => [...new Set([...selectedIds, ...(selectedEntityId ? [selectedEntityId] : []), ...(selectedStateId ? [selectedStateId] : [])])],
    [selectedEntityId, selectedIds, selectedStateId],
  );
  const [client] = useState(() => createAgentClient());
  const [boundPort, setBoundPort] = useState<{ documentId: string; port: AgentTaskPort; operations: DocumentOperationsPort } | null>(null);

  useEffect(() => {
    if (!documentId) {
      setBoundPort(null);
      return;
    }
    const operationTransport = new AbortController();
    const operations = createAgentDocumentOperationsPort(documentId, client, operationTransport.signal);
    const port = createAgentTaskPort({ documentId, client, operations });
    setBoundPort({ documentId, port, operations });
    return () => {
      port.dispose();
      operationTransport.abort();
      operations.dispose();
    };
  }, [client, documentId]);

  const port = boundPort?.documentId === documentId ? boundPort.port : null;
  const disabledReason = !documentId ? "Guarda el documento para iniciar un encargo." : !port ? "Conectando al documento…" : undefined;
  return <>
    <IntentBar
      port={port}
      model={model}
      activeOpdId={activeOpdId}
      selectedIds={selectionScope}
      disabled={!port}
      {...(disabledReason ? { disabledReason } : {})}
    />
    {renderDocumentActions?.(boundPort?.documentId === documentId ? boundPort.operations : null)}
  </>;
}
