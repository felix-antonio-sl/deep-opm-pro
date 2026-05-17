import {
  ETAPA_AMBIENTALES,
  ETAPA_ATRIBUTO,
  ETAPA_ENTRADAS,
  ETAPA_HANDLER,
  ETAPA_HERRAMIENTAS,
  ETAPA_SALIDAS,
  type DatosAsistente,
  type EtapaAsistente,
} from "../../modelo/creacionWizard";
import type { OpmStore } from "../../store";

export const ETAPAS_ASISTENTE_OPCIONALES: EtapaAsistente[] = [
  ETAPA_ATRIBUTO,
  ETAPA_HANDLER,
  ETAPA_HERRAMIENTAS,
  ETAPA_ENTRADAS,
  ETAPA_SALIDAS,
  ETAPA_AMBIENTALES,
];

export interface NewModelAssistantPort {
  asistente: OpmStore["asistente"];
  mensaje: OpmStore["mensaje"];
  setDato: <K extends keyof DatosAsistente>(clave: K, valor: DatosAsistente[K]) => void;
  siguiente: () => void;
  saltar: () => void;
  anterior: OpmStore["etapaAnterior"];
  cancelar: OpmStore["cancelarAsistente"];
  confirmar: OpmStore["confirmarAsistente"];
  descartarConfirmado: () => void;
  cancelarConfirmacion: () => void;
}
