import { useMemo } from "preact/hooks";
import { normalizarGridConfig } from "../../canvas/grid";
import { useOpmStore } from "../../store";
import type { ConfigurationDialogPort } from "./configurationDialogPort";

export function useZustandConfigurationDialogPort(): ConfigurationDialogPort {
  const abierto = useOpmStore((s) => s.dialogoConfiguracionAbierto);
  const cerrar = useOpmStore((s) => s.cerrarDialogoConfiguracion);
  const modeloNombre = useOpmStore((s) => s.modelo.nombre);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const renombrarModeloActual = useOpmStore((s) => s.renombrarModeloActual);
  const gridConfigBase = useOpmStore((s) => s.gridConfig ?? s.indice.preferenciasUi?.gridConfig);
  const gridConfig = useMemo(() => normalizarGridConfig(gridConfigBase), [gridConfigBase]);
  const fijarGridConfig = useOpmStore((s) => s.fijarGridConfig);
  const oplEsenciaVisibilidad = useOpmStore((s) => s.indice.preferenciasUi?.oplEsenciaVisibilidad ?? "siempre");
  const fijarOplEsenciaVisibilidad = useOpmStore((s) => s.fijarOplEsenciaVisibilidad);

  return {
    abierto,
    cerrar,
    modeloNombre,
    modeloPersistidoId,
    renombrarModeloActual,
    gridConfig,
    fijarGridConfig,
    oplEsenciaVisibilidad,
    fijarOplEsenciaVisibilidad,
  };
}
