import { useOpmStore } from "../../store";
import type { CommandPalettePort } from "./commandPalettePort";

export function useZustandCommandPalettePort(): CommandPalettePort {
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
  const gridConfigBase = useOpmStore((s) => s.gridConfig ?? s.indice.preferenciasUi?.gridConfig);
  const toggleGrid = useOpmStore((s) => s.toggleGrid);
  const aplicarLayoutSugerido = useOpmStore((s) => s.aplicarLayoutSugerido);
  const iniciarModoSimulacion = useOpmStore((s) => s.iniciarModoSimulacion);
  const abrirDialogoSimulacionNumerica = useOpmStore((s) => s.abrirDialogoSimulacionNumerica);
  const abrirTablaEnlaces = useOpmStore((s) => s.abrirTablaEnlaces);
  const abrirDialogoImportarExportarJson = useOpmStore((s) => s.abrirDialogoImportarExportarJson);
  const abrirCheatsheetAtajos = useOpmStore((s) => s.abrirCheatsheetAtajos);
  const exportarJson = useOpmStore((s) => s.exportarJson);
  const frecuenciaUso = useOpmStore((s) => s.frecuenciaUsoCommandPalette);
  const registrarUsoCommandPalette = useOpmStore((s) => s.registrarUsoCommandPalette);
  // Ronda Codex v2 L5: acciones absorbidas desde el `MenuPrincipal` lateral
  // (retirado). El palette pasa a ser superset de aquel menú.
  const iniciarAsistente = useOpmStore((s) => s.iniciarAsistente);
  const abrirPestanaNueva = useOpmStore((s) => s.abrirPestanaNueva);
  const abrirBusquedaCosas = useOpmStore((s) => s.abrirBusquedaCosas);
  const abrirBusquedaGlobal = useOpmStore((s) => s.abrirDialogoBuscarGlobal);
  const abrirModalUrls = useOpmStore((s) => s.abrirModalUrls);
  const uiAliasVisibles = useOpmStore((s) => s.uiAliasVisibles);
  const toggleAliasVisibles = useOpmStore((s) => s.toggleAliasVisibles);
  const uiDescripcionesVisibles = useOpmStore((s) => s.uiDescripcionesVisibles);
  const toggleDescripcionesVisibles = useOpmStore((s) => s.toggleDescripcionesVisibles);
  const uiModoImagenGlobal = useOpmStore((s) => s.uiModoImagenGlobal);
  const fijarModoImagenGlobal = useOpmStore((s) => s.fijarModoImagenGlobal);
  const abrirModalImagen = useOpmStore((s) => s.abrirModalImagen);
  const mostrarArchivados = useOpmStore((s) => s.mostrarArchivados);
  const toggleMostrarArchivados = useOpmStore((s) => s.toggleMostrarArchivados);
  const mostrarVersiones = useOpmStore((s) => s.mostrarVersiones);
  const toggleMostrarVersiones = useOpmStore((s) => s.toggleMostrarVersiones);

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
    gridConfigBase,
    toggleGrid,
    aplicarLayoutSugerido,
    iniciarModoSimulacion,
    abrirDialogoSimulacionNumerica,
    abrirTablaEnlaces,
    abrirDialogoImportarExportarJson,
    abrirCheatsheetAtajos,
    exportarJson,
    frecuenciaUso,
    registrarUsoCommandPalette,
    iniciarAsistente,
    abrirPestanaNueva,
    abrirBusquedaCosas,
    abrirBusquedaGlobal,
    abrirModalUrls,
    uiAliasVisibles,
    toggleAliasVisibles,
    uiDescripcionesVisibles,
    toggleDescripcionesVisibles,
    uiModoImagenGlobal,
    fijarModoImagenGlobal,
    abrirModalImagen,
    mostrarArchivados,
    toggleMostrarArchivados,
    mostrarVersiones,
    toggleMostrarVersiones,
  };
}
