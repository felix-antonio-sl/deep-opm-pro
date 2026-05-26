import type { Modelo, ValorConcreto } from "../../modelo/tipos";
import type { OpmStore } from "../../store";

export interface SimulacionNumericaDialogPort {
  abierto: OpmStore["dialogoSimulacionNumericaAbierto"];
  cerrar: OpmStore["cerrarDialogoSimulacionNumerica"];
  modelo: Modelo;
  columnas: string[];
  ejecutar: (n: number) => Array<Record<string, ValorConcreto | undefined>>;
}
