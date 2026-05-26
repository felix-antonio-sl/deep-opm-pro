import { useOpmStore } from "../../store";
import { generarDatosSimulados } from "../../modelo/simulacion/parametros";
import type { SimulacionNumericaDialogPort } from "./simulacionNumericaDialogPort";

export function useZustandSimulacionNumericaDialogPort(): SimulacionNumericaDialogPort {
  const abierto = useOpmStore((s) => s.dialogoSimulacionNumericaAbierto);
  const cerrar = useOpmStore((s) => s.cerrarDialogoSimulacionNumerica);
  const modelo = useOpmStore((s) => s.modelo);

  const columnas = Object.values(modelo.entidades)
    .filter((e) => e.esAtributo && e.valorSlot && e.simulacion?.simulable)
    .map((e) => e.nombre);

  const ejecutar = (n: number) => generarDatosSimulados(modelo, n);

  return {
    abierto,
    cerrar,
    columnas,
    ejecutar,
  };
}
