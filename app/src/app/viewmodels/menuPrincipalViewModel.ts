import { useMemo } from "preact/hooks";
import { listarFixtures } from "../../store/runtime";
import { useOpmStore } from "../../store";
import { useZustandMapViewPort } from "../ports/zustandMapViewPort";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";
import { useZustandPersistencePort } from "../ports/zustandPersistencePort";
import { useZustandSelectionPort } from "../ports/zustandSelectionPort";
import { useZustandSessionTabsPort } from "../ports/zustandSessionTabsPort";
import { useZustandSystemMapControlsPort } from "../ports/zustandSystemMapControlsPort";
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
  const nuevoModelo = useOpmStore((s) => s.nuevoModelo);
  const abrirBusquedaCosas = useOpmStore((s) => s.abrirBusquedaCosas);
  const abrirBusquedaGlobal = useOpmStore((s) => s.abrirDialogoBuscarGlobal);
  const abrirTablaEnlaces = useOpmStore((s) => s.abrirTablaEnlaces);
  const abrirDialogoGuardarPlantilla = useOpmStore((s) => s.abrirDialogoGuardarPlantilla);
  const abrirDialogoImportarExportarJson = useOpmStore((s) => s.abrirDialogoImportarExportarJson);
  const abrirCheatsheetAtajos = useOpmStore((s) => s.abrirCheatsheetAtajos);
  const objetoSeleccionadoId = seleccionId && modelo.entidades[seleccionId]?.tipo === "objeto" ? seleccionId : null;
  const abrirModalUrls = useOpmStore((s) => s.abrirModalUrls);
  const iniciarAsistente = useOpmStore((s) => s.iniciarAsistente);
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
