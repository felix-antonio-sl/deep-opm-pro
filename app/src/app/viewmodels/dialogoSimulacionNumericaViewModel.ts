import { useZustandSimulacionNumericaDialogPort } from "../ports/zustandSimulacionNumericaDialogPort";

export function useDialogoSimulacionNumericaViewModel() {
  const { abierto, cerrar, columnas, ejecutar } = useZustandSimulacionNumericaDialogPort();

  return {
    abierto,
    cerrar,
    columnas,
    ejecutar,
  };
}

export type DialogoSimulacionNumericaViewModel = ReturnType<typeof useDialogoSimulacionNumericaViewModel>;
