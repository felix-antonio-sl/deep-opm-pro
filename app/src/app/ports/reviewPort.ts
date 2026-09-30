import type { Modelo } from "../../modelo/tipos";
import type { ReviewOwnerPort } from "../../persistencia/reviewClient";
export type { ReviewReaderPort, ReviewOwnerPort, ReviewCreateInput, ReviewCreatedShare } from "../../persistencia/reviewClient";

export interface ReviewOwnerPanelProps {
  documentId: string;
  model: Modelo;
  ownerPort: ReviewOwnerPort;
}
