import { useZustandEntityMetadataOpenersPort } from "../ports/zustandEntityMetadataModalPort";
import { useZustandHelpPort } from "../ports/zustandHelpPort";
import { useZustandLinksTablePort } from "../ports/zustandLinksTablePort";
import { useZustandMapViewPort } from "../ports/zustandMapViewPort";
import { useZustandModelBootstrapPort } from "../ports/zustandModelBootstrapPort";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";
import { useZustandPersistencePort } from "../ports/zustandPersistencePort";
import { useZustandSearchDialogsPort } from "../ports/zustandSearchDialogsPort";
import { useZustandSelectionPort } from "../ports/zustandSelectionPort";
import { useZustandSessionTabsPort } from "../ports/zustandSessionTabsPort";
import { useZustandSystemMapControlsPort } from "../ports/zustandSystemMapControlsPort";
import { useZustandTemplateDialogsPort } from "../ports/zustandTemplateDialogsPort";
import { useZustandToolbarChromePort } from "../ports/zustandToolbarChromePort";
import { useZustandWorkbenchViewControlsPort } from "../ports/zustandWorkbenchViewControlsPort";
import { useZustandWorkspacePort } from "../ports/zustandWorkspacePort";

export function useMenuPrincipalViewModel() {
  const {
    menuPrincipalAbierto: abierto,
    cerrarMenuPrincipal: cerrar,
  } = useZustandToolbarChromePort();
  const { abrirPestanaNueva } = useZustandSessionTabsPort();
  const {
    guardarLocal,
    abrirGuardarComo,
    abrirCargarModelo,
    modeloPersistidoId,
    exportarJson,
  } = useZustandPersistencePort();
  const {
    mostrarArchivados,
    mostrarVersiones,
    toggleMostrarArchivados,
    toggleMostrarVersiones,
    abrirDialogoVersiones: abrirVersiones,
  } = useZustandWorkspacePort();
  const {
    vistaMapaActiva,
    abrirVistaMapa,
    cerrarVistaMapa,
  } = useZustandMapViewPort();
  const { toggleMapaPanelEstadisticas } = useZustandSystemMapControlsPort();
  const {
    abrirDialogoConfiguracion,
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
    aplicarLayoutSugerido,
    bibliotecaDockAbierto,
    toggleBibliotecaDock,
    iniciarModoSimulacion,
  } = useZustandWorkbenchViewControlsPort();
  const { modelo, opdActivoId } = useZustandOpdNavigationPort();
  const { seleccionId } = useZustandSelectionPort();
  const { nuevoModelo, iniciarAsistente } = useZustandModelBootstrapPort();
  const { abrirBusquedaCosas, abrirBusquedaGlobal } = useZustandSearchDialogsPort();
  const { abrir: abrirTablaEnlaces } = useZustandLinksTablePort();
  const { abrirDialogoGuardarPlantilla } = useZustandTemplateDialogsPort();
  const { abrirCheatsheetAtajos } = useZustandHelpPort();
  const objetoSeleccionadoId = seleccionId && modelo.entidades[seleccionId]?.tipo === "objeto" ? seleccionId : null;
  const { abrirModalUrls } = useZustandEntityMetadataOpenersPort();

  const copiarJsonAlPortapapeles = () => {
    const json = exportarJson();
    void globalThis.navigator?.clipboard?.writeText(json);
  };

  // Ronda 27 III.A cierre: el botón `⋯ Más` desaparece del chrome. Sus
  // acciones globales (vista, layout, dock, mapa, simulación) se absorben
  // como secciones del menú principal `☰`. Las acciones multi-selección no
  // se migran: ya están en la barra contextual flotante sobre la selección.
  const toggleVistaMapa = () => {
    if (vistaMapaActiva) cerrarVistaMapa();
    else abrirVistaMapa();
  };
  const editarImagenObjetoSeleccionado = () => {
    if (objetoSeleccionadoId) abrirModalImagen(objetoSeleccionadoId);
  };

  return {
    abierto,
    cerrar,
    nuevoModelo,
    abrirPestanaNueva,
    guardarLocal,
    abrirGuardarComo,
    abrirCargarModelo,
    abrirBusquedaCosas,
    abrirBusquedaGlobal,
    abrirVersiones,
    modeloPersistidoId,
    abrirDialogoConfiguracion,
    mostrarArchivados,
    mostrarVersiones,
    toggleMostrarArchivados,
    toggleMostrarVersiones,
    modelo,
    opdActivoId,
    vistaMapaActiva,
    toggleMapaPanelEstadisticas,
    abrirTablaEnlaces,
    abrirDialogoPlantillas,
    abrirDialogoGuardarPlantilla,
    abrirCheatsheetAtajos,
    objetoSeleccionadoId,
    abrirModalUrls,
    iniciarAsistente,
    copiarJsonAlPortapapeles,
    // Ronda 27 III.A: items absorbidos desde ⋯ Más.
    uiAliasVisibles,
    uiDescripcionesVisibles,
    toggleAliasVisibles,
    toggleDescripcionesVisibles,
    uiModoImagenGlobal,
    fijarModoImagenGlobal,
    editarImagenObjetoSeleccionado,
    gridActiva: gridConfig.activa,
    toggleGrid,
    aplicarLayoutSugerido,
    bibliotecaDockAbierto,
    toggleBibliotecaDock,
    toggleVistaMapa,
    iniciarModoSimulacion,
  };
}

export type MenuPrincipalViewModel = ReturnType<typeof useMenuPrincipalViewModel>;
