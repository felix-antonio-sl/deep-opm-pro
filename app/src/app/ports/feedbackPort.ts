import {
  EVENTO_ABRIR_AVISO_DIAGNOSTICO,
  type FeedbackAviso,
  type FeedbackOverlay,
} from "../../store/feedback";

export { EVENTO_ABRIR_AVISO_DIAGNOSTICO };
export type { FeedbackAviso, FeedbackOverlay };

export interface FeedbackPort {
  addFlash: (mensaje: string, ttl?: number) => string;
  sincronizarBadgesDesdeAvisos: (avisos: readonly FeedbackAviso[]) => void;
}
