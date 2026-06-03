import { enlaceAdmiteTiempoMaximo, enlaceAdmiteTiempoMinimo, esEnlaceExcepcionTemporal } from "../constantes";
import { esUnidadTiempo } from "../objetoDuracion";
import type { DuracionTemporal, Enlace, Id, Modelo, UnidadTiempo } from "../tipos";
import type { EventoTemporalSim, ModoSimulacion, PasoSimulacion, TransicionEstadoSim } from "./tipos";

export const UNIDAD_RELOJ_SIMULACION = "s" as const;

const FACTOR_SEGUNDOS: Record<UnidadTiempo, number> = {
  ms: 0.001,
  s: 1,
  min: 60,
  h: 3600,
  dia: 86400,
  sem: 604800,
  mes: 2629800,
  año: 31557600,
};

export interface DuracionPasoSim {
  estadoId: Id;
  ventana: DuracionTemporal;
  min: number;
  nominal: number;
  max: number;
  observada: number;
}

type RandomFn = () => number;

export function convertirAUnidadReloj(valor: number, unidad: UnidadTiempo): number {
  return valor * FACTOR_SEGUNDOS[unidad];
}

export function inferirDuracionPasoSim(
  modelo: Modelo,
  transiciones: TransicionEstadoSim[],
  modo: ModoSimulacion,
  random?: RandomFn,
): DuracionPasoSim | undefined {
  for (const t of transiciones) {
    const estadoId = t.estadoDespuesId ?? t.estadoAntesId;
    if (!estadoId) continue;
    const estado = modelo.estados[estadoId];
    if (!estado?.duracion) continue;
    const ventana = { ...estado.duracion };
    const min = convertirAUnidadReloj(ventana.min, ventana.unidad);
    const nominal = convertirAUnidadReloj(ventana.nominal, ventana.unidad);
    const max = convertirAUnidadReloj(ventana.max, ventana.unidad);
    const observada = modo === "muestreo" && random && max > min
      ? min + random() * (max - min)
      : nominal;
    return { estadoId, ventana, min, nominal, max, observada };
  }
  return undefined;
}

export function detectarEventosTemporalesPaso(
  modelo: Modelo,
  paso: PasoSimulacion,
  duracion: number,
): EventoTemporalSim[] {
  const eventos: EventoTemporalSim[] = [];
  for (const enlaceId of paso.enlacesSalidaIds) {
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace || !esEnlaceExcepcionTemporal(enlace.tipo)) continue;
    if (enlace.origenId.kind !== "entidad" || enlace.origenId.id !== paso.procesoId) continue;
    if (enlace.destinoId.kind !== "entidad") continue;

    if (enlaceAdmiteTiempoMaximo(enlace.tipo)) {
      const umbral = umbralTemporal(enlace, "maximo");
      if (umbral && duracion > umbral.valorReloj) {
        eventos.push({
          tipo: "sobretiempo",
          enlaceId: enlace.id,
          procesoOrigenId: paso.procesoId,
          procesoManejoId: enlace.destinoId.id,
          duracion,
          umbral: umbral.valorReloj,
          unidadReloj: UNIDAD_RELOJ_SIMULACION,
          umbralOriginal: { valor: umbral.valorOriginal, unidad: umbral.unidadOriginal },
        });
      }
    }

    if (enlaceAdmiteTiempoMinimo(enlace.tipo)) {
      const umbral = umbralTemporal(enlace, "minimo");
      if (umbral && duracion < umbral.valorReloj) {
        eventos.push({
          tipo: "subtiempo",
          enlaceId: enlace.id,
          procesoOrigenId: paso.procesoId,
          procesoManejoId: enlace.destinoId.id,
          duracion,
          umbral: umbral.valorReloj,
          unidadReloj: UNIDAD_RELOJ_SIMULACION,
          umbralOriginal: { valor: umbral.valorOriginal, unidad: umbral.unidadOriginal },
        });
      }
    }
  }
  return eventos;
}

function umbralTemporal(
  enlace: Enlace,
  lado: "minimo" | "maximo",
): { valorOriginal: number; unidadOriginal: UnidadTiempo; valorReloj: number } | undefined {
  const valorRaw = lado === "minimo" ? enlace.tiempoMinimo : enlace.tiempoMaximo;
  const unidadRaw = lado === "minimo" ? enlace.unidadTiempoMinimo : enlace.unidadTiempoMaximo;
  const valorOriginal = valorRaw != null ? Number(valorRaw) : Number.NaN;
  if (!Number.isFinite(valorOriginal) || !esUnidadTiempo(unidadRaw)) return undefined;
  return {
    valorOriginal,
    unidadOriginal: unidadRaw,
    valorReloj: convertirAUnidadReloj(valorOriginal, unidadRaw),
  };
}
