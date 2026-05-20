import type { DatosAsistente, EtapaAsistente } from "../../modelo/creacionWizard";
import type { OpmStore } from "../../store";

/**
 * Ronda 23 L3 #6: tras la poda de 9 a 3 etapas el wizard no tiene etapas
 * opcionales; todas son obligatorias y se validan al avanzar. La constante
 * se preserva como arreglo vacío para no romper imports históricos y dejar
 * margen a futuro si vuelve a haber opcionalidad.
 */
export const ETAPAS_ASISTENTE_OPCIONALES: EtapaAsistente[] = [];

export interface NewModelAssistantPort {
  asistente: OpmStore["asistente"];
  mensaje: OpmStore["mensaje"];
  setDato: <K extends keyof DatosAsistente>(clave: K, valor: DatosAsistente[K]) => void;
  siguiente: () => void;
  anterior: OpmStore["etapaAnterior"];
  cancelar: OpmStore["cancelarAsistente"];
  confirmar: OpmStore["confirmarAsistente"];
  descartarConfirmado: () => void;
  cancelarConfirmacion: () => void;
}
