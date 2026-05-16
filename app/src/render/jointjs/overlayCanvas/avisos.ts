import { listarAvisosDiagnostico } from "../../../modelo/diagnostico";
import type { Id, Modelo } from "../../../modelo/tipos";
import type { FeedbackAviso } from "../../../store/feedback";

export function construirAvisosFeedbackCanvas(modelo: Modelo, opdActivoId: Id): FeedbackAviso[] {
  return listarAvisosDiagnostico(modelo, { tipo: "opd", opdId: opdActivoId })
    .filter((aviso) => aviso.origen === "validacion")
    .flatMap((aviso) => {
      const anchorCellId = anchorCellIdParaAviso(modelo, opdActivoId, aviso.elementoTipo, aviso.elementoId);
      if (!anchorCellId) return [];
      return [{
        anchorCellId,
        reglaId: aviso.reglaId,
        severidad: aviso.severidad,
        mensaje: aviso.mensaje,
        citaSSOT: aviso.citaSSOT,
      }];
    });
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
    return Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === elementoId)?.id ?? null;
  }
  if (elementoTipo === "enlace") {
    return Object.values(opd.enlaces).find((apariencia) => apariencia.enlaceId === elementoId)?.id ?? null;
  }
  return null;
}
