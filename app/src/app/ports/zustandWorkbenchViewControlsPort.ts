import { useMemo } from "preact/hooks";
import { normalizarGridConfig } from "../../canvas/grid";
import { useOpmStore } from "../../store";
import type { WorkbenchViewControlsPort } from "./workbenchViewControlsPort";

export function useZustandWorkbenchViewControlsPort(): WorkbenchViewControlsPort {
  const abrirDialogoPlantillas = useOpmStore((s) => s.abrirDialogoPlantillas);
  const uiAliasVisibles = useOpmStore((s) => s.uiAliasVisibles);
  const uiDescripcionesVisibles = useOpmStore((s) => s.uiDescripcionesVisibles);
  const toggleAliasVisibles = useOpmStore((s) => s.toggleAliasVisibles);
  const toggleDescripcionesVisibles = useOpmStore((s) => s.toggleDescripcionesVisibles);
  const uiModoImagenGlobal = useOpmStore((s) => s.uiModoImagenGlobal);
  const fijarModoImagenGlobal = useOpmStore((s) => s.fijarModoImagenGlobal);
  const abrirModalImagen = useOpmStore((s) => s.abrirModalImagen);
  const gridConfigBase = useOpmStore((s) => s.gridConfig ?? s.indice.preferenciasUi?.gridConfig);
  const gridConfig = useMemo(() => normalizarGridConfig(gridConfigBase), [gridConfigBase]);
  const toggleGrid = useOpmStore((s) => s.toggleGrid);
  const abrirDialogoConfiguracion = useOpmStore((s) => s.abrirDialogoConfiguracion);
  const aplicarLayoutSugerido = useOpmStore((s) => s.aplicarLayoutSugerido);
  const bibliotecaDockAbierto = useOpmStore((s) => s.bibliotecaDockAbierto);
  const toggleBibliotecaDock = useOpmStore((s) => s.toggleBibliotecaDock);
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const abrirVistaMapa = useOpmStore((s) => s.abrirVistaMapa);
  const cerrarVistaMapa = useOpmStore((s) => s.cerrarVistaMapa);
  const iniciarModoSimulacion = useOpmStore((s) => s.iniciarModoSimulacion);

  return {
    abrirDialogoPlantillas,
    uiAliasVisibles,
    uiDescripcionesVisibles,
    toggleAliasVisibles,
    toggleDescripcionesVisibles,
    uiModoImagenGlobal,
    fijarModoImagenGlobal,
    abrirModalImagen,
    gridConfig,
    toggleGrid,
    abrirDialogoConfiguracion,
    aplicarLayoutSugerido,
    bibliotecaDockAbierto,
    toggleBibliotecaDock,
    vistaMapaActiva,
    abrirVistaMapa,
    cerrarVistaMapa,
    iniciarModoSimulacion,
  };
}
