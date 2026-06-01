import { aparienciaDeEntidadEnOpd } from "../politicaApariciones";
import { estadoVisibleEnAparicion } from "../visibilidadEstados";
import type { ExtremoEnlace } from "../tipos/enlace";
import type { Id, Modelo } from "../tipos";

export type SeveridadPegado = "error-consistencia" | "advertencia-consistencia";

export interface ObservacionPegado {
  codigo: "pegado-enlace-estado-suprimido";
  severidad: SeveridadPegado;
  entidadId: Id;
  opdIds: Id[];
  mensaje: string;
}

function estadoSuprimidoEnOpd(modelo: Modelo, opdId: Id, extremo: ExtremoEnlace): ObservacionPegado | null {
  if (extremo.kind !== "estado") return null;
  const estado = modelo.estados[extremo.id];
  const opd = modelo.opds[opdId];
  if (!estado || !opd) return null;

  const apariencia = aparienciaDeEntidadEnOpd(opd, estado.entidadId);
  if (!apariencia || estadoVisibleEnAparicion(estado, apariencia)) return null;

  return {
    codigo: "pegado-enlace-estado-suprimido",
    severidad: "error-consistencia",
    entidadId: estado.entidadId,
    opdIds: [opdId],
    mensaje: `El enlace referencia el estado '${estado.nombre}', suprimido en este OPD.`,
  };
}

/**
 * Sheaf-check de pegado entre OPDs como diagnostico puro.
 * F0 implementa separación: el OPD no debe contradecirse mostrando un enlace
 * hacia un estado que oculta en la fibra local de su objeto.
 */
export function verificarPegado(modelo: Modelo): ObservacionPegado[] {
  const observaciones: ObservacionPegado[] = [];
  for (const opd of Object.values(modelo.opds)) {
    for (const aparienciaEnlace of Object.values(opd.enlaces)) {
      const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
      if (!enlace) continue;
      for (const extremo of [enlace.origenId, enlace.destinoId]) {
        const observacion = estadoSuprimidoEnOpd(modelo, opd.id, extremo);
        if (observacion) observaciones.push(observacion);
      }
    }
  }
  return observaciones;
}
