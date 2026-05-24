import { useZustandEntityMetadataOpenersPort } from "../ports/zustandEntityMetadataModalPort";
import { useZustandHelpPort } from "../ports/zustandHelpPort";
import { useZustandLinksTablePort } from "../ports/zustandLinksTablePort";
import { useZustandModelBootstrapPort } from "../ports/zustandModelBootstrapPort";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";
import { useZustandPersistencePort } from "../ports/zustandPersistencePort";
import { useZustandSearchDialogsPort } from "../ports/zustandSearchDialogsPort";
import { useZustandSelectionPort } from "../ports/zustandSelectionPort";
import { useZustandSessionTabsPort } from "../ports/zustandSessionTabsPort";
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
  // acciones globales (vista, layout, dock, simulación) se absorben
  // como secciones del menú principal `☰`. Las acciones multi-selección no
  // se migran: ya están en la barra contextual flotante sobre la selección.
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
    iniciarModoSimulacion,
  };
}

export type MenuPrincipalViewModel = ReturnType<typeof useMenuPrincipalViewModel>;
