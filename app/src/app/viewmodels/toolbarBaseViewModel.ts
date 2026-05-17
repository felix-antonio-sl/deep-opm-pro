import { useOpmStore } from "../../store";
import { useZustandHistoryPort } from "../ports/zustandHistoryPort";
import { useZustandModelCreationPort } from "../ports/zustandModelCreationPort";
import { useZustandSelectionPort } from "../ports/zustandSelectionPort";
import { useZustandToolbarChromePort } from "../ports/zustandToolbarChromePort";
import { useZustandWorkbenchViewControlsPort } from "../ports/zustandWorkbenchViewControlsPort";

export function useToolbarBaseViewModel() {
  const {
    abrirMenuPrincipal,
    cerrarMenuPrincipal,
    menuPrincipalAbierto,
    abrirDialogoComandos,
  } = useZustandToolbarChromePort();
  const { deshacer, rehacer, puedeDeshacer, puedeRehacer } = useZustandHistoryPort();
  const {
    crearObjeto,
    crearProceso,
    crearAtributoNumerico,
    fijarModoCreacion,
    modoCreacion,
    nuevaCosaPendiente,
    confirmarNombreNuevaCosa,
    descartarNuevaCosaPendiente,
  } = useZustandModelCreationPort();
  const { seleccionId, seleccionados, seleccionarEntidad, seleccionarEnlace } = useZustandSelectionPort();
  const {
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
    abrirDialogoConfiguracion,
    aplicarLayoutSugerido,
    bibliotecaDockAbierto,
    toggleBibliotecaDock,
    vistaMapaActiva,
    abrirVistaMapa,
    cerrarVistaMapa,
    iniciarModoSimulacion,
  } = useZustandWorkbenchViewControlsPort();
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const copiarEstiloEnlaceAlPortapapeles = useOpmStore((s) => s.copiarEstiloEnlaceAlPortapapeles);
  const pegarEstiloEnlaceDesdePortapapeles = useOpmStore((s) => s.pegarEstiloEnlaceDesdePortapapeles);
  const enlaceEstiloPortapapeles = useOpmStore((s) => s.enlaceEstiloPortapapeles);
  const borrarEnlacesEnLote = useOpmStore((s) => s.borrarEnlacesEnLote);
  const eliminarSeleccion = useOpmStore((s) => s.eliminarSeleccion);
  const conectarSeleccionAlTodo = useOpmStore((s) => s.conectarSeleccionAlTodo);
  const traerEnlacesEntreSeleccionadas = useOpmStore((s) => s.traerEnlacesEntreSeleccionadas);
  const iniciarAutosalvado = useOpmStore((s) => s.iniciarAutosalvado);
  const alinearSeleccion = useOpmStore((s) => s.alinearSeleccion);
  const distribuirSeleccion = useOpmStore((s) => s.distribuirSeleccion);
  const alinearSeleccionEnlaces = useOpmStore((s) => s.alinearSeleccionEnlaces);

  const toggleVistaMapa = () => {
    if (vistaMapaActiva) cerrarVistaMapa();
    else abrirVistaMapa();
  };

  return {
    abrirMenuPrincipal,
    cerrarMenuPrincipal,
    crearObjeto,
    crearProceso,
    crearAtributoNumerico,
    fijarModoCreacion,
    deshacer,
    rehacer,
    menuPrincipalAbierto,
    abrirDialogoComandos,
    puedeDeshacer,
    puedeRehacer,
    modelo,
    opdActivoId,
    seleccionId,
    seleccionados,
    nuevaCosaPendiente,
    confirmarNombreNuevaCosa,
    descartarNuevaCosaPendiente,
    seleccionarEntidad,
    seleccionarEnlace,
    copiarEstiloEnlaceAlPortapapeles,
    pegarEstiloEnlaceDesdePortapapeles,
    enlaceEstiloPortapapeles,
    borrarEnlacesEnLote,
    eliminarSeleccion,
    conectarSeleccionAlTodo,
    traerEnlacesEntreSeleccionadas,
    iniciarAutosalvado,
    modoCreacion,
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
    abrirDialogoConfiguracion,
    aplicarLayoutSugerido,
    bibliotecaDockAbierto,
    toggleBibliotecaDock,
    vistaMapaActiva,
    toggleVistaMapa,
    iniciarModoSimulacion,
    alinearSeleccion,
    distribuirSeleccion,
    alinearSeleccionEnlaces,
  };
}

export type ToolbarBaseViewModel = ReturnType<typeof useToolbarBaseViewModel>;
