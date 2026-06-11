import type { Id, Modelo } from "../tipos";
import { enlacesDeFaseSimulacion } from "./fases";
import type { FocoPasoSimulacion } from "./foco";
import type { FaseSimulacion, PasoSimulacion } from "./tipos";

/** Decide si el render debe disparar tokens animados sobre el OPD visible. Puro. */
export function debeAnimarTokensSim(foco: FocoPasoSimulacion, opdActivoId: Id, headless: boolean): boolean {
  if (headless) return false;
  if (!foco.paso) return false;
  if (foco.paso.opdId !== opdActivoId) return false;
  return foco.enlacesInvolucradosIds.length > 0;
}

export interface TokenViajeFase {
  enlaceId: Id;
  /** Sentido del viaje sobre el path del enlace ("reverse" = destino→origen). */
  direccion: "normal" | "reverse";
}

/**
 * Tokens de la fase ACTIVA, con sentido semántico: en la fase de consumo el
 * flujo va del objeto hacia el proceso — el enlace de efecto se dibuja
 * proceso→objeto, así que su token de consumo viaja en "reverse". Consumo
 * (objeto→proceso), resultado/invocación (proceso→destino) y habilitadores
 * (objeto→proceso) ya apuntan en el sentido del flujo. Fases proceso/cierre
 * no transportan nada.
 */
export function tokensDeFaseSimulacion(
  modelo: Modelo,
  paso: PasoSimulacion,
  fase: FaseSimulacion | null | undefined,
  estadosCurrent: Record<Id, Id>,
): TokenViajeFase[] {
  if (!fase) return [];
  return enlacesDeFaseSimulacion(modelo, paso, fase, estadosCurrent).map((enlaceId) => ({
    enlaceId,
    direccion: fase === "consumo" && modelo.enlaces[enlaceId]?.tipo === "efecto" ? "reverse" : "normal",
  }));
}
