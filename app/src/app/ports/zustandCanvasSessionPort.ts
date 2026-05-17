import { useMemo } from "preact/hooks";
import { normalizarGridConfig } from "../../canvas/grid";
import { useOpmStore } from "../../store";
import type { CanvasSessionPort } from "./canvasSessionPort";

export function useZustandCanvasSessionPort(): CanvasSessionPort {
  const modoEnlace = useOpmStore((s) => s.modoEnlace);
  const modoCreacion = useOpmStore((s) => s.modoCreacion);
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const hoverOplRef = useOpmStore((s) => s.hoverOplRef);
  const uiAliasVisibles = useOpmStore((s) => s.uiAliasVisibles);
  const uiDescripcionesVisibles = useOpmStore((s) => s.uiDescripcionesVisibles);
  const uiModoImagenGlobal = useOpmStore((s) => s.uiModoImagenGlobal);
  const contextoSimulacion = useOpmStore((s) => s.contextoSimulacion);
  const alternarModoImagenEntidad = useOpmStore((s) => s.alternarModoImagenEntidad);
  const abrirModalImagen = useOpmStore((s) => s.abrirModalImagen);
  const fijarHoverOpl = useOpmStore((s) => s.fijarHoverOpl);
  const gridConfigBase = useOpmStore((s) => s.gridConfig ?? s.indice.preferenciasUi?.gridConfig);
  const gridConfig = useMemo(() => normalizarGridConfig(gridConfigBase), [gridConfigBase]);
  const solicitudFitToken = useOpmStore((s) => s.solicitudFitToken);

  return {
    modoEnlace,
    modoCreacion,
    modelo,
    opdActivoId,
    hoverOplRef,
    uiAliasVisibles,
    uiDescripcionesVisibles,
    uiModoImagenGlobal,
    contextoSimulacion,
    alternarModoImagenEntidad,
    abrirModalImagen,
    fijarHoverOpl,
    gridConfig,
    solicitudFitToken,
  };
}
