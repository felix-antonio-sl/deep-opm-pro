import type { DatosAsistente, EtapaAsistente } from "../../modelo/creacionWizard";
import { store, useOpmStore } from "../../store";
import { ETAPAS_ASISTENTE_OPCIONALES, type NewModelAssistantPort } from "./newModelAssistantPort";

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
    saltar,
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
  const etapa = state.asistente.etapaActual;
  if (ETAPAS_ASISTENTE_OPCIONALES.includes(etapa)) {
    avanzarAEtapa(Math.min(etapa + 1, 11) as EtapaAsistente);
    return;
  }
  store.getState().siguienteEtapa({});
}

function saltar() {
  const state = store.getState();
  if (!state.asistente) return;
  avanzarAEtapa(Math.min(state.asistente.etapaActual + 1, 11) as EtapaAsistente);
}

function avanzarAEtapa(etapa: EtapaAsistente) {
  store.setState((s) => {
    if (!s.asistente) return {};
    return { asistente: { ...s.asistente, etapaActual: etapa } };
  });
}

function descartarConfirmado() {
  store.setState({ asistente: null });
}

function cancelarConfirmacion() {
  const state = store.getState();
  if (!state.asistente) return;
  store.setState({ asistente: { ...state.asistente, cancelado: false } });
}
