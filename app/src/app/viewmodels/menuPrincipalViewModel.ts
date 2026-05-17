import { useMemo } from "preact/hooks";
import { listarFixtures } from "../../store/runtime";
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
    abrirDialogoImportarExportarJson,
    modeloPersistidoId,
    cargarFixtureDemo,
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
    gridConfig,
    toggleGrid,
    aplicarLayoutSugerido,
    iniciarModoSimulacion,
    abrirDialogoConfiguracion,
    abrirDialogoPlantillas,
  } = useZustandWorkbenchViewControlsPort();
  const { modelo } = useZustandOpdNavigationPort();
  const { seleccionId } = useZustandSelectionPort();
  const { nuevoModelo, iniciarAsistente } = useZustandModelBootstrapPort();
  const { abrirBusquedaCosas, abrirBusquedaGlobal } = useZustandSearchDialogsPort();
  const { abrir: abrirTablaEnlaces } = useZustandLinksTablePort();
  const { abrirDialogoGuardarPlantilla } = useZustandTemplateDialogsPort();
  const { abrirCheatsheetAtajos } = useZustandHelpPort();
  const objetoSeleccionadoId = seleccionId && modelo.entidades[seleccionId]?.tipo === "objeto" ? seleccionId : null;
  const { abrirModalUrls } = useZustandEntityMetadataOpenersPort();
  const demos = useMemo(() => listarFixtures(), []);

  const toggleVistaMapa = () => {
    if (vistaMapaActiva) cerrarVistaMapa();
    else abrirVistaMapa();
  };

  const copiarJsonAlPortapapeles = () => {
    const json = exportarJson();
    void globalThis.navigator?.clipboard?.writeText(json);
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
    cargarFixtureDemo,
    vistaMapaActiva,
    toggleVistaMapa,
    toggleMapaPanelEstadisticas,
    gridConfig,
    toggleGrid,
    aplicarLayoutSugerido,
    iniciarModoSimulacion,
    abrirTablaEnlaces,
    abrirDialogoPlantillas,
    abrirDialogoGuardarPlantilla,
    abrirDialogoImportarExportarJson,
    abrirCheatsheetAtajos,
    objetoSeleccionadoId,
    abrirModalUrls,
    iniciarAsistente,
    demos,
    copiarJsonAlPortapapeles,
  };
}

export type MenuPrincipalViewModel = ReturnType<typeof useMenuPrincipalViewModel>;
