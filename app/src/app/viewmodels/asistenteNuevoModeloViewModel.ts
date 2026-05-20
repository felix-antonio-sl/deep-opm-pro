import {
  ETAPA_FUNCION,
  TOTAL_ETAPAS,
  type EtapaAsistente,
} from "../../modelo/creacionWizard";
import { useZustandNewModelAssistantPort } from "../ports/zustandNewModelAssistantPort";

/**
 * Ronda 23 L3 #6: el wizard quedó en 3 etapas obligatorias (función,
 * beneficiario, sembrar). Ya no hay etapa de bienvenida ni etapas
 * opcionales, así que se simplifican los flags derivados (`esOpcional`,
 * `cosasParaAmbientales`) y la barra de progreso usa el total nuevo.
 */
export function useAsistenteNuevoModeloViewModel() {
  const {
    asistente,
    mensaje,
    setDato,
    siguiente,
    anterior,
    cancelar,
    confirmar,
    descartarConfirmado,
    cancelarConfirmacion,
  } = useZustandNewModelAssistantPort();

  if (!asistente) return null;

  const etapa = asistente.etapaActual;
  const datos = asistente.datos;
  const cancelado = asistente.cancelado;
  const pct = ((etapa + 1) / TOTAL_ETAPAS) * 100;
  const muestraAtras = debeMostrarAtrasWizard(etapa);

  return {
    asistente,
    mensaje,
    etapa,
    datos,
    cancelado,
    pct,
    muestraAtras,
    setDato,
    handleSiguiente: siguiente,
    handleAnterior: anterior,
    handleCancelar: cancelar,
    handleConfirmar: confirmar,
    handleDescartarConfirmado: descartarConfirmado,
    handleCancelarConfirmacion: cancelarConfirmacion,
  };
}

export type AsistenteNuevoModeloViewModel = ReturnType<typeof useAsistenteNuevoModeloViewModel>;

export function debeMostrarAtrasWizard(etapa: EtapaAsistente): boolean {
  return etapa > ETAPA_FUNCION;
}
