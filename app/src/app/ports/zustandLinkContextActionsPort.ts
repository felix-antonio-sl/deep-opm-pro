import { useOpmStore } from "../../store";
import type { LinkContextActionsPort } from "./linkContextActionsPort";

export function useZustandLinkContextActionsPort(): LinkContextActionsPort {
  const copiarEstiloEnlaceAlPortapapeles = useOpmStore((s) => s.copiarEstiloEnlaceAlPortapapeles);
  const pegarEstiloEnlaceDesdePortapapeles = useOpmStore((s) => s.pegarEstiloEnlaceDesdePortapapeles);
  const enlaceEstiloPortapapeles = useOpmStore((s) => s.enlaceEstiloPortapapeles);
  const borrarEnlacesEnLote = useOpmStore((s) => s.borrarEnlacesEnLote);

  return {
    copiarEstiloEnlaceAlPortapapeles,
    pegarEstiloEnlaceDesdePortapapeles,
    enlaceEstiloPortapapeles,
    borrarEnlacesEnLote,
  };
}
