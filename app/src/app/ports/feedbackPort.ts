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
    }
  | {
      id: string;
      tipo: "hover-tooltip";
      anchorCellId: string;
      contenido: string;
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
  setHoverTooltip: (cellId: string, contenido: string) => void;
  clearHoverTooltip: () => void;
  sincronizarBadgesDesdeAvisos: (avisos: readonly FeedbackAviso[]) => void;
}

export const EVENTO_ABRIR_AVISO_DIAGNOSTICO = "opm:diagnostico:abrir-aviso";

export function idHoverTooltip(cellId: string): string {
  return `hover-tooltip-${cellId.replace(/[^A-Za-z0-9_-]/g, "_")}`;
}
