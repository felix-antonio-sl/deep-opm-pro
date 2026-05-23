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
    gridConfig,
    toggleGrid,
    aplicarLayoutSugerido,
    iniciarModoSimulacion,
    abrirTablaEnlaces,
    abrirCheatsheetAtajos,
    frecuenciaUso,
    registrarUsoCommandPalette,
    exportarJsonAlPortapapeles,
  };
}

export type CommandPaletteViewModel = ReturnType<typeof useCommandPaletteViewModel>;
