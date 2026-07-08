import { useOpmStore } from "../../store";
import type { CommandPalettePort } from "./commandPalettePort";

export function useZustandCommandPalettePort(): CommandPalettePort {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const nuevoModelo = useOpmStore((s) => s.nuevoModelo);
  const nacerApunte = useOpmStore((s) => s.nacerApunte);
  const abrirCargarModelo = useOpmStore((s) => s.abrirCargarModelo);
  const abrirGuardarComo = useOpmStore((s) => s.abrirGuardarComo);
  const abrirDialogoConfiguracion = useOpmStore((s) => s.abrirDialogoConfiguracion);
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
  const copiarOplModeloMarkdownAlPortapapeles = useOpmStore((s) => s.copiarOplModeloMarkdownAlPortapapeles);
  const copiarCanonDocumentoAlPortapapeles = useOpmStore((s) => s.copiarCanonDocumentoAlPortapapeles);
  const copiarContextoSkillAlPortapapeles = useOpmStore((s) => s.copiarContextoSkillAlPortapapeles);
  const copiarLogDecisionesAlPortapapeles = useOpmStore((s) => s.copiarLogDecisionesAlPortapapeles);
  // Auth v1 (spec §4): logout desde la paleta.
  const cerrarSesion = useOpmStore((s) => s.cerrarSesion);
  const frecuenciaUso = useOpmStore((s) => s.frecuenciaUsoCommandPalette);
  const registrarUsoCommandPalette = useOpmStore((s) => s.registrarUsoCommandPalette);
  // Ronda Codex v2 L5: acciones absorbidas desde el `MenuPrincipal` lateral
  // (retirado). El palette pasa a ser superset de aquel menú.
  const abrirPestanaNueva = useOpmStore((s) => s.abrirPestanaNueva);
  const abrirBusquedaCosas = useOpmStore((s) => s.abrirBusquedaCosas);
  const abrirBusquedaGlobal = useOpmStore((s) => s.abrirDialogoBuscarGlobal);
  const abrirModalUrls = useOpmStore((s) => s.abrirModalUrls);
  const uiAliasVisibles = useOpmStore((s) => s.uiAliasVisibles);
  const toggleAliasVisibles = useOpmStore((s) => s.toggleAliasVisibles);
  const uiDescripcionesVisibles = useOpmStore((s) => s.uiDescripcionesVisibles);
  const toggleDescripcionesVisibles = useOpmStore((s) => s.toggleDescripcionesVisibles);
  const uiSoloCanvas = useOpmStore((s) => s.uiSoloCanvas);
  const toggleSoloCanvas = useOpmStore((s) => s.toggleSoloCanvas);
  const uiModoImagenGlobal = useOpmStore((s) => s.uiModoImagenGlobal);
  const fijarModoImagenGlobal = useOpmStore((s) => s.fijarModoImagenGlobal);
  const abrirModalImagen = useOpmStore((s) => s.abrirModalImagen);
  const mostrarArchivados = useOpmStore((s) => s.mostrarArchivados);
  const toggleMostrarArchivados = useOpmStore((s) => s.toggleMostrarArchivados);
  const mostrarVersiones = useOpmStore((s) => s.mostrarVersiones);
  const toggleMostrarVersiones = useOpmStore((s) => s.toggleMostrarVersiones);
  const abrirDialogoOntologia = useOpmStore((s) => s.abrirDialogoOntologia);
  const abrirDialogoRequisito = useOpmStore((s) => s.abrirDialogoRequisito);
  const abrirDialogoSubmodelo = useOpmStore((s) => s.abrirDialogoSubmodelo);
  const abrirVitrinaEstereotipos = useOpmStore((s) => s.abrirVitrinaEstereotipos);
  const splitEffectParcialSeleccionado = useOpmStore((s) => s.splitEffectParcialSeleccionado);
  const recolectarEnlaceContornoSeleccionado = useOpmStore((s) => s.recolectarEnlaceContornoSeleccionado);
  const distribuirEnlaceContornoSeleccionado = useOpmStore((s) => s.distribuirEnlaceContornoSeleccionado);
  const resolverDecisionSeleccionada = useOpmStore((s) => s.resolverDecisionSeleccionada);

  return {
    modelo,
    opdActivoId,
    seleccionId,
    enlaceSeleccionId,
    seleccionados,
    nuevoModelo,
    nacerApunte,
    abrirCargarModelo,
    abrirGuardarComo,
    abrirDialogoConfiguracion,
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
    copiarOplModeloMarkdownAlPortapapeles,
    copiarCanonDocumentoAlPortapapeles,
    copiarContextoSkillAlPortapapeles,
    copiarLogDecisionesAlPortapapeles,
    cerrarSesion,
    frecuenciaUso,
    registrarUsoCommandPalette,
    abrirPestanaNueva,
    abrirBusquedaCosas,
    abrirBusquedaGlobal,
    abrirModalUrls,
    uiAliasVisibles,
    toggleAliasVisibles,
    uiDescripcionesVisibles,
    toggleDescripcionesVisibles,
    uiSoloCanvas,
    toggleSoloCanvas,
    uiModoImagenGlobal,
    fijarModoImagenGlobal,
    abrirModalImagen,
    mostrarArchivados,
    toggleMostrarArchivados,
    mostrarVersiones,
    toggleMostrarVersiones,
    abrirDialogoOntologia,
    abrirDialogoRequisito,
    abrirDialogoSubmodelo,
    abrirVitrinaEstereotipos,
    splitEffectParcialSeleccionado,
    recolectarEnlaceContornoSeleccionado,
    distribuirEnlaceContornoSeleccionado,
    resolverDecisionSeleccionada,
  };
}
