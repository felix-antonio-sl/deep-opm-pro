import { useMemo } from "preact/hooks";
import { normalizarGridConfig } from "../../canvas/grid";
import { useZustandCommandPalettePort } from "../ports/zustandCommandPalettePort";

export function useCommandPaletteViewModel() {
  const {
    modelo,
    opdActivoId,
    seleccionId,
    enlaceEstiloPortapapeles,
    seleccionados,
    nuevoModelo,
    abrirCargarModelo,
    abrirGuardarComo,
    abrirDialogoConfiguracion,
    abrirDialogoGuardarPlantilla,
    abrirDialogoPlantillas,
    abrirDialogoVersiones,
    modeloPersistidoId,
    abrirVistaMapa,
    cerrarVistaMapa,
    vistaMapaActiva,
    gridConfigBase,
    toggleGrid,
    aplicarLayoutSugerido,
    iniciarModoSimulacion,
    abrirTablaEnlaces,
    abrirCheatsheetAtajos,
    exportarJson,
    frecuenciaUso,
    registrarUsoCommandPalette,
  } = useZustandCommandPalettePort();
  const gridConfig = useMemo(() => normalizarGridConfig(gridConfigBase), [gridConfigBase]);

  const toggleMapaSistema = () => {
    if (vistaMapaActiva) cerrarVistaMapa();
    else abrirVistaMapa();
  };

  const exportarJsonAlPortapapeles = () => {
    const json = exportarJson();
    void globalThis.navigator?.clipboard?.writeText(json);
  };

  return {
    modelo,
    opdActivoId,
    seleccionId,
    enlaceEstiloPortapapeles,
    seleccionados,
    nuevoModelo,
    abrirCargarModelo,
    abrirGuardarComo,
    abrirDialogoConfiguracion,
    abrirDialogoGuardarPlantilla,
    abrirDialogoPlantillas,
    abrirDialogoVersiones,
    modeloPersistidoId,
    vistaMapaActiva,
    gridConfig,
    toggleGrid,
    aplicarLayoutSugerido,
    iniciarModoSimulacion,
    abrirTablaEnlaces,
    abrirCheatsheetAtajos,
    frecuenciaUso,
    registrarUsoCommandPalette,
    toggleMapaSistema,
    exportarJsonAlPortapapeles,
  };
}

export type CommandPaletteViewModel = ReturnType<typeof useCommandPaletteViewModel>;
