import type { Id } from "../tipos";
import type { ContextoSimulacion, TipoEventoTemporalSim } from "./tipos";
import { UNIDAD_RELOJ_SIMULACION } from "./tiempo";

export interface ResumenDuracionCuantitativa {
  total: number;
  media: number;
  min: number;
  max: number;
  unidadReloj: typeof UNIDAD_RELOJ_SIMULACION;
}

export interface ResumenEventosTemporales {
  porTipo: Partial<Record<TipoEventoTemporalSim, number>>;
  porEnlace: Record<Id, number>;
}

export interface ResumenEnriquecimientoCuantitativo {
  corridas: number;
  duracion: ResumenDuracionCuantitativa;
  eventosTemporales: ResumenEventosTemporales;
}

export function resumirEnriquecimientoCuantitativo(corridas: ContextoSimulacion[]): ResumenEnriquecimientoCuantitativo {
  const duraciones = corridas.map(duracionCorrida);
  const total = duraciones.reduce((acc, valor) => acc + valor, 0);
  const porTipo: Partial<Record<TipoEventoTemporalSim, number>> = {};
  const porEnlace: Record<Id, number> = {};

  for (const corrida of corridas) {
    for (const entrada of corrida.trace) {
      for (const evento of entrada.eventosTemporales ?? []) {
        porTipo[evento.tipo] = (porTipo[evento.tipo] ?? 0) + 1;
        porEnlace[evento.enlaceId] = (porEnlace[evento.enlaceId] ?? 0) + 1;
      }
    }
  }

  return {
    corridas: corridas.length,
    duracion: {
      total,
      media: corridas.length > 0 ? total / corridas.length : 0,
      min: duraciones.length > 0 ? Math.min(...duraciones) : 0,
      max: duraciones.length > 0 ? Math.max(...duraciones) : 0,
      unidadReloj: UNIDAD_RELOJ_SIMULACION,
    },
    eventosTemporales: { porTipo, porEnlace },
  };
}

function duracionCorrida(corrida: ContextoSimulacion): number {
  return corrida.reloj ?? corrida.trace.reduce((acc, entrada) => acc + (entrada.duracion ?? 0), 0);
}
