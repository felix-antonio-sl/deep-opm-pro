import { useMemo } from "preact/hooks";
import { normalizarGridConfig } from "../../canvas/grid";
import { listarFixtures } from "../../store/runtime";
import { useOpmStore } from "../../store";

export function useMenuPrincipalViewModel() {
  const abierto = useOpmStore((s) => s.menuPrincipalAbierto);
  const cerrar = useOpmStore((s) => s.cerrarMenuPrincipal);
  const nuevoModelo = useOpmStore((s) => s.nuevoModelo);
  const abrirPestanaNueva = useOpmStore((s) => s.abrirPestanaNueva);
  const guardarLocal = useOpmStore((s) => s.guardarLocal);
  const abrirGuardarComo = useOpmStore((s) => s.abrirGuardarComo);
  const abrirCargarModelo = useOpmStore((s) => s.abrirCargarModelo);
  const abrirBusquedaCosas = useOpmStore((s) => s.abrirBusquedaCosas);
  const abrirBusquedaGlobal = useOpmStore((s) => s.abrirDialogoBuscarGlobal);
  const abrirVersiones = useOpmStore((s) => s.abrirDialogoVersiones);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const abrirDialogoConfiguracion = useOpmStore((s) => s.abrirDialogoConfiguracion);
  const mostrarArchivados = useOpmStore((s) => s.mostrarArchivados);
  const mostrarVersiones = useOpmStore((s) => s.mostrarVersiones);
  const toggleMostrarArchivados = useOpmStore((s) => s.toggleMostrarArchivados);
  const toggleMostrarVersiones = useOpmStore((s) => s.toggleMostrarVersiones);
  const cargarFixtureDemo = useOpmStore((s) => s.cargarFixtureDemo);
  const exportarJson = useOpmStore((s) => s.exportarJson);
  const abrirVistaMapa = useOpmStore((s) => s.abrirVistaMapa);
  const cerrarVistaMapa = useOpmStore((s) => s.cerrarVistaMapa);
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const toggleMapaPanelEstadisticas = useOpmStore((s) => s.toggleMapaPanelEstadisticas);
  const gridConfigBase = useOpmStore((s) => s.gridConfig ?? s.indice.preferenciasUi?.gridConfig);
  const gridConfig = useMemo(() => normalizarGridConfig(gridConfigBase), [gridConfigBase]);
  const toggleGrid = useOpmStore((s) => s.toggleGrid);
  const aplicarLayoutSugerido = useOpmStore((s) => s.aplicarLayoutSugerido);
  const iniciarModoSimulacion = useOpmStore((s) => s.iniciarModoSimulacion);
  const abrirTablaEnlaces = useOpmStore((s) => s.abrirTablaEnlaces);
  const abrirDialogoPlantillas = useOpmStore((s) => s.abrirDialogoPlantillas);
  const abrirDialogoGuardarPlantilla = useOpmStore((s) => s.abrirDialogoGuardarPlantilla);
  const abrirDialogoImportarExportarJson = useOpmStore((s) => s.abrirDialogoImportarExportarJson);
  const abrirCheatsheetAtajos = useOpmStore((s) => s.abrirCheatsheetAtajos);
  const objetoSeleccionadoId = useOpmStore((s) => {
    const id = s.seleccionId;
    return id && s.modelo.entidades[id]?.tipo === "objeto" ? id : null;
  });
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
