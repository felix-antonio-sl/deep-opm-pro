import { useMemo } from "preact/hooks";
import { normalizarGridConfig } from "../../canvas/grid";
import { exportarDiagnosticoJson } from "../../modelo/exportarDiagnostico";
import { useZustandCommandPalettePort } from "../ports/zustandCommandPalettePort";

export function useCommandPaletteViewModel() {
  const {
    modelo,
    opdActivoId,
    seleccionId,
    enlaceSeleccionId,
    seleccionados,
    nuevoModelo,
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
    splitEffectParcialSeleccionado,
    recolectarEnlaceContornoSeleccionado,
    distribuirEnlaceContornoSeleccionado,
    resolverDecisionSeleccionada,
  } = useZustandCommandPalettePort();
  const gridConfig = useMemo(() => normalizarGridConfig(gridConfigBase), [gridConfigBase]);

  const exportarJsonAlPortapapeles = () => {
    const json = exportarJson();
    void globalThis.navigator?.clipboard?.writeText(json);
  };

  // Copia al portapapeles el diagnóstico completo del modelo (todas las
  // sugerencias) serializado como JSON. Mismo patrón liviano que
  // exportarJsonAlPortapapeles: la serialización es pura (kernel) y aquí solo
  // se escribe al portapapeles.
  const exportarDiagnosticoAlPortapapeles = () => {
    const json = exportarDiagnosticoJson(modelo);
    void globalThis.navigator?.clipboard?.writeText(json);
  };

  return {
    modelo,
    opdActivoId,
    seleccionId,
    enlaceSeleccionId,
    seleccionados,
    nuevoModelo,
    abrirCargarModelo,
    abrirGuardarComo,
    abrirDialogoConfiguracion,
    abrirDialogoVersiones,
    modeloPersistidoId,
    gridConfig,
    toggleGrid,
    aplicarLayoutSugerido,
    iniciarModoSimulacion,
    abrirDialogoSimulacionNumerica,
    abrirTablaEnlaces,
    abrirCheatsheetAtajos,
    frecuenciaUso,
    registrarUsoCommandPalette,
    exportarJsonAlPortapapeles,
    exportarDiagnosticoAlPortapapeles,
    exportarOplModeloMarkdownAlPortapapeles: () => { void copiarOplModeloMarkdownAlPortapapeles(); },
    // R-VIS-EXP-2: documento canónico (canon-documento) gateado por densidad.
    exportarCanonDocumentoAlPortapapeles: () => { void copiarCanonDocumentoAlPortapapeles(); },
    // W6.0: puente de contexto 1-click app→skill (cuenta el cruce, observable g3).
    copiarContextoSkill: () => { void copiarContextoSkillAlPortapapeles(); },
    // W6.5-b: export del LogDecisiones v0 (consumidor: re-elicitar de la skill).
    copiarLogDecisiones: () => { void copiarLogDecisionesAlPortapapeles(); },
    // Auth v1 (spec §4): cerrar sesión vuelve a PantallaLogin.
    cerrarSesion: () => { void cerrarSesion(); },
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
    splitEffectParcialSeleccionado,
    recolectarEnlaceContornoSeleccionado,
    distribuirEnlaceContornoSeleccionado,
    resolverDecisionSeleccionada,
  };
}

export type CommandPaletteViewModel = ReturnType<typeof useCommandPaletteViewModel>;
