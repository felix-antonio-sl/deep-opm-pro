export type FeedbackOverlay =
  | {
      id: string;
      tipo: "flash";
      mensaje: string;
      ttl: number;
      creadoEn: number;
    }
  | {
      id: string;
      tipo: "inline-error";
      anchorCellId: string;
      reglaId: string;
      severidad: "error" | "advertencia" | "info";
      mensaje: string;
      citaSSOT: string;
    };

export interface FeedbackAviso {
  anchorCellId: string;
  reglaId: string;
  severidad: "error" | "advertencia" | "info";
  mensaje: string;
  citaSSOT: string;
}

export interface FeedbackPort {
  addFlash: (mensaje: string, ttl?: number) => string;
  sincronizarBadgesDesdeAvisos: (avisos: readonly FeedbackAviso[]) => void;
}

export const EVENTO_ABRIR_AVISO_DIAGNOSTICO = "opm:diagnostico:abrir-aviso";
