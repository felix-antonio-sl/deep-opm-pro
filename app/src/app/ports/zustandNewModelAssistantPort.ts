import type { DatosAsistente, EtapaAsistente } from "../../modelo/creacionWizard";
import { ETAPA_SEMBRAR } from "../../modelo/creacionWizard";
import { store, useOpmStore } from "../../store";
import type { NewModelAssistantPort } from "./newModelAssistantPort";

/**
 * Ronda 23 L3 #6: tras la poda 9→3 ya no hay "saltar". El wizard avanza
 * solo por validación; cancelar / atrás / confirmar quedan intactos.
 */
export function useZustandNewModelAssistantPort(): NewModelAssistantPort {
  const asistente = useOpmStore((s) => s.asistente);
  const mensaje = useOpmStore((s) => s.mensaje);
  const anterior = useOpmStore((s) => s.etapaAnterior);
  const cancelar = useOpmStore((s) => s.cancelarAsistente);
  const confirmar = useOpmStore((s) => s.confirmarAsistente);

  return {
    asistente,
    mensaje,
    setDato,
    siguiente,
    anterior,
    cancelar,
    confirmar,
    descartarConfirmado,
    cancelarConfirmacion,
  };
}

function setDato<K extends keyof DatosAsistente>(clave: K, valor: DatosAsistente[K]) {
  store.setState((s) => {
    if (!s.asistente) return {};
    return { asistente: { ...s.asistente, datos: { ...s.asistente.datos, [clave]: valor } } };
  });
}

function siguiente() {
  const state = store.getState();
  if (!state.asistente) return;
  state.siguienteEtapa({});
}

function descartarConfirmado() {
  store.setState({ asistente: null });
}

function cancelarConfirmacion() {
  const state = store.getState();
  if (!state.asistente) return;
  store.setState({ asistente: { ...state.asistente, cancelado: false } });
}

// Re-export para facilitar callsites legacy que importaban desde aquí.
export { ETAPA_SEMBRAR };
export type { EtapaAsistente };
