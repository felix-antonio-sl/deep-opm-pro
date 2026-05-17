import { useOpmStore } from "../../store";
import type { BringConnectedDialogPort } from "./bringConnectedDialogPort";

export function useZustandBringConnectedDialogPort(): BringConnectedDialogPort {
  const abierto = useOpmStore((s) => s.dialogoTraerConectadosAbierto);
  const ultima = useOpmStore((s) => s.indice.preferenciasUi?.traerConectadosUltimo);
  const cerrar = useOpmStore((s) => s.cerrarDialogoTraerConectados);
  const traer = useOpmStore((s) => s.traerConectadosSeleccionado);

  return {
    abierto,
    ultima,
    cerrar,
    traer,
  };
}
