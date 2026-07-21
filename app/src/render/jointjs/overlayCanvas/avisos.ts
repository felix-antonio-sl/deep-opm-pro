import { codigoDiagnosticoCanonico } from "../../../modelo/diagnostico";
import { severidadDiagnostico, type SeveridadIssue } from "../../../modelo/diagnosticoSeveridad";
import { aparienciaDeEntidadEnOpd } from "../../../modelo/politicaApariciones";
import type { Id, Modelo } from "../../../modelo/tipos";
import { validarModelo } from "../../../modelo/validaciones";
import type { FeedbackAviso } from "../../../app/ports/feedbackPort";

export function construirAvisosFeedbackCanvas(
  modelo: Modelo,
  opdActivoId: Id,
  opciones: { esApunte?: boolean } = {},
): FeedbackAviso[] {
  return validarModelo(modelo, opdActivoId)
    .flatMap((aviso) => {
      const anchorCellId = anchorCellIdParaAviso(modelo, opdActivoId, aviso.elementoTipo, aviso.elementoId);
      if (!anchorCellId) return [];
      return [{
        anchorCellId,
        reglaId: codigoDiagnosticoCanonico(aviso.reglaId),
        severidad: severidadFeedback(severidadDiagnostico({
          origen: "validacion",
          codigo: aviso.reglaId,
          severidad: aviso.severidad,
        }, opciones)),
        mensaje: aviso.mensaje,
        citaSSOT: aviso.citaSSOT,
      }];
    });
}

function severidadFeedback(severidad: SeveridadIssue): FeedbackAviso["severidad"] {
  if (severidad === "bloqueo") return "error";
  if (severidad === "mejora") return "advertencia";
  return "info";
}

export function anchorCellIdParaAviso(
  modelo: Modelo,
  opdActivoId: Id,
  elementoTipo: "entidad" | "enlace" | "opd" | undefined,
  elementoId: Id | undefined,
): Id | null {
  if (!elementoId) return null;
  const opd = modelo.opds[opdActivoId];
  if (!opd) return null;
  if (elementoTipo === "entidad") {
    return aparienciaDeEntidadEnOpd(opd, elementoId)?.id ?? null;
  }
  if (elementoTipo === "enlace") {
    return Object.values(opd.enlaces).find((apariencia) => apariencia.enlaceId === elementoId)?.id ?? null;
  }
  return null;
}
