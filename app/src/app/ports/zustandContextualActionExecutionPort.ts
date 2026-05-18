import { store } from "../../store";
import type { ContextualActionExecutionPort } from "./contextualActionExecutionPort";

export function crearZustandContextualActionExecutionPort(): ContextualActionExecutionPort {
  return {
    snapshot: () => store.getState(),
  };
}
