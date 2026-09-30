import { createReviewOwnerPort } from "../../persistencia/reviewClient";
import { flushDocumentOperations } from "../../store/runtime";
import type { ReviewOwnerPort } from "./reviewPort";

/** Sharing captures the same working copy the editor has synchronized. */
export function createDocumentReviewOwnerPort(): ReviewOwnerPort {
  return createReviewOwnerPort(fetch, async (documentId) => {
    const base = await flushDocumentOperations(documentId);
    return { expectedRevision: base.revision, expectedWorkingCopyHash: base.workingCopyHash };
  });
}
