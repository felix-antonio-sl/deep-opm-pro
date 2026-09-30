import type { DocumentOperationsPort, ReconcileResult } from "./documentOperationsPort";
import type { PieceManifest } from "../../modelo/tipos";
import type { PieceVersionComparison } from "../../modelo/reuse/compare";
import { prepareHumanAuthoringRequest } from "../../persistencia/humanChangeClient";
import type { PreparedAgentChange } from "../../persistencia/agentClient";

export const MAX_PIECE_SOURCE_BYTES = 1_048_576;

export type PieceWireTarget =
  | { opdId: string; position: { x: number; y: number } }
  | { opdId: string; anchorEntityId: string }
  | { referenceId: string; expectedSourceVersion: string };

export type PreparePieceInput = {
  sourceJson: string;
  pieceId: string;
  function: string;
} & (
  | { kind: "copy"; target: Extract<PieceWireTarget, { position: { x: number; y: number } }> }
  | { kind: "reference"; target: Extract<PieceWireTarget, { anchorEntityId: string }> }
  | { kind: "update"; target: Extract<PieceWireTarget, { referenceId: string }>; includeBoundaryChange?: boolean }
);

export interface PreparedPieceChange extends PreparedAgentChange {
  manifest: PieceManifest;
  losses: string[];
  comparison?: PieceVersionComparison;
}

export interface PiecePort {
  prepare(input: PreparePieceInput, signal?: AbortSignal): Promise<PreparedPieceChange>;
  apply(prepared: PreparedPieceChange): Promise<ReconcileResult>;
  undo(changeId: string): Promise<ReconcileResult>;
}

type HumanPiecePreparer = (input: Record<string, unknown>, signal?: AbortSignal) => Promise<PreparedPieceChange>;

/** Uses the document's existing queue and human review grant for Piece changes. */
export function createPiecePort(
  operations: Pick<DocumentOperationsPort, "snapshot" | "flush" | "prepareCommit" | "commit" | "undo">,
  prepareHumanChange: HumanPiecePreparer = (input, signal) =>
    prepareHumanAuthoringRequest<PreparedPieceChange>("pieces", input, signal),
): PiecePort {
  return {
    async prepare(input, signal) {
      if (!input.sourceJson.trim()) throw new Error("Selecciona un archivo OPM JSON de origen");
      const sourceBytes = new TextEncoder().encode(input.sourceJson).byteLength;
      if (sourceBytes > MAX_PIECE_SOURCE_BYTES) {
        throw new Error("El archivo de origen supera 1 MiB. Usa una fuente más pequeña para preparar la pieza.");
      }
      if (!input.pieceId.trim() || !input.function.trim()) throw new Error("Elige una pieza y declara su función");
      const base = await operations.flush();
      const state = operations.snapshot();
      return prepareHumanChange({
        documentId: state.documentId,
        controllerId: state.controllerId,
        clientSequence: base.clientSequence,
        workingCopyHash: base.workingCopyHash,
        ...input,
      }, signal);
    },
    async apply(prepared) {
      await operations.prepareCommit(prepared.change, "review");
      const result = await operations.commit(prepared.changeId);
      if (result.kind !== "integrated") throw new Error("El cambio sigue pendiente de reconciliación");
      return result;
    },
    undo(changeId) {
      return operations.undo(changeId);
    },
  };
}
