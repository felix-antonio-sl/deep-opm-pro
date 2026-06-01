import { useOpmStore } from "../../store";
import type { LinkContextActionsPort } from "./linkContextActionsPort";

export function useZustandLinkContextActionsPort(): LinkContextActionsPort {
  const borrarEnlacesEnLote = useOpmStore((s) => s.borrarEnlacesEnLote);

  return {
    borrarEnlacesEnLote,
  };
}
