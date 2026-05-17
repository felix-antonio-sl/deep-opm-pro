import { useMemo } from "preact/hooks";
import { normalizarGridConfig } from "../../canvas/grid";
import { useOpmStore } from "../../store";

export function useCommandPaletteViewModel() {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const enlaceEstiloPortapapeles = useOpmStore((s) => s.enlaceEstiloPortapapeles);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const nuevoModelo = useOpmStore((s) => s.nuevoModelo);
  const abrirCargarModelo = useOpmStore((s) => s.abrirCargarModelo);
  const abrirGuardarComo = useOpmStore((s) => s.abrirGuardarComo);
  const abrirDialogoConfiguracion = useOpmStore((s) => s.abrirDialogoConfiguracion);
  const abrirDialogoGuardarPlantilla = useOpmStore((s) => s.abrirDialogoGuardarPlantilla);
  const abrirDialogoPlantillas = useOpmStore((s) => s.abrirDialogoPlantillas);
  const abrirDialogoVersiones = useOpmStore((s) => s.abrirDialogoVersiones);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const abrirVistaMapa = useOpmStore((s) => s.abrirVistaMapa);
  const cerrarVistaMapa = useOpmStore((s) => s.cerrarVistaMapa);
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const gridConfigBase = useOpmStore((s) => s.gridConfig ?? s.indice.preferenciasUi?.gridConfig);
  const gridConfig = useMemo(() => normalizarGridConfig(gridConfigBase), [gridConfigBase]);
  const toggleGrid = useOpmStore((s) => s.toggleGrid);
  const aplicarLayoutSugerido = useOpmStore((s) => s.aplicarLayoutSugerido);
  const iniciarModoSimulacion = useOpmStore((s) => s.iniciarModoSimulacion);
  const abrirTablaEnlaces = useOpmStore((s) => s.abrirTablaEnlaces);
  const abrirDialogoImportarExportarJson = useOpmStore((s) => s.abrirDialogoImportarExportarJson);
  const abrirCheatsheetAtajos = useOpmStore((s) => s.abrirCheatsheetAtajos);
  const exportarJson = useOpmStore((s) => s.exportarJson);
  const frecuenciaUso = useOpmStore((s) => s.frecuenciaUsoCommandPalette);
  const registrarUsoCommandPalette = useOpmStore((s) => s.registrarUsoCommandPalette);

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
    abrirDialogoImportarExportarJson,
    abrirCheatsheetAtajos,
    frecuenciaUso,
    registrarUsoCommandPalette,
    toggleMapaSistema,
    exportarJsonAlPortapapeles,
  };
}

export type CommandPaletteViewModel = ReturnType<typeof useCommandPaletteViewModel>;
