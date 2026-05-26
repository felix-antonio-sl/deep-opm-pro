import type { ValorConcreto } from "../../modelo/tipos";
import type { OpmStore } from "../../store";

export interface SimulacionNumericaDialogPort {
  abierto: OpmStore["dialogoSimulacionNumericaAbierto"];
  cerrar: OpmStore["cerrarDialogoSimulacionNumerica"];
  columnas: string[];
  ejecutar: (n: number) => Array<Record<string, ValorConcreto | undefined>>;
}
