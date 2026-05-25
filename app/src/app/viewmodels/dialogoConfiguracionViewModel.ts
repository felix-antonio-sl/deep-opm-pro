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
    oplEsenciaVisibilidad,
    fijarOplEsenciaVisibilidad,
  } = useZustandConfigurationDialogPort();

  return {
    abierto,
    cerrar,
    modeloNombre,
    modeloPersistidoId,
    gridConfig,
    fijarGridConfig,
    renombrarModeloActual,
    oplEsenciaVisibilidad,
    fijarOplEsenciaVisibilidad,
  };
}

export type DialogoConfiguracionViewModel = ReturnType<typeof useDialogoConfiguracionViewModel>;
