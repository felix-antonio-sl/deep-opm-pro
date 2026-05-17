import { useZustandConfigurationDialogPort } from "../ports/zustandConfigurationDialogPort";

export function useDialogoConfiguracionViewModel() {
  const {
    abierto,
    cerrar,
    modeloNombre,
    modeloPersistidoId,
    gridConfig,
    fijarGridConfig,
    renombrarModeloActual,
  } = useZustandConfigurationDialogPort();

  return {
    abierto,
    cerrar,
    modeloNombre,
    modeloPersistidoId,
    gridConfig,
    fijarGridConfig,
    renombrarModeloActual,
  };
}

export type DialogoConfiguracionViewModel = ReturnType<typeof useDialogoConfiguracionViewModel>;
