import { useMemo } from "preact/hooks";
import { normalizarGridConfig } from "../../canvas/grid";
import { useOpmStore } from "../../store";

export function useDialogoConfiguracionViewModel() {
  const abierto = useOpmStore((s) => s.dialogoConfiguracionAbierto);
  const cerrar = useOpmStore((s) => s.cerrarDialogoConfiguracion);
  const modeloNombre = useOpmStore((s) => s.modelo.nombre);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const renombrarModeloActual = useOpmStore((s) => s.renombrarModeloActual);
  const gridConfigBase = useOpmStore((s) => s.gridConfig ?? s.indice.preferenciasUi?.gridConfig);
  const gridConfig = useMemo(() => normalizarGridConfig(gridConfigBase), [gridConfigBase]);
  const fijarGridConfig = useOpmStore((s) => s.fijarGridConfig);

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
