import { useZustandAutosavePort } from "../ports/zustandAutosavePort";
import { useZustandHistoryPort } from "../ports/zustandHistoryPort";
import { useZustandInteractionModePort } from "../ports/zustandInteractionModePort";
import { useZustandLinkContextActionsPort } from "../ports/zustandLinkContextActionsPort";
import { useZustandModelCreationPort } from "../ports/zustandModelCreationPort";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";
import { useZustandSelectionBatchActionsPort } from "../ports/zustandSelectionBatchActionsPort";
import { useZustandSelectionPort } from "../ports/zustandSelectionPort";
import { useZustandToolbarChromePort } from "../ports/zustandToolbarChromePort";

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
    eliminarSeleccion,
    conectarSeleccionAlTodo,
    traerEnlacesEntreSeleccionadas,
    alinearSeleccion,
    distribuirSeleccion,
    alinearSeleccionEnlaces,
  } = useZustandSelectionBatchActionsPort();
  const {
    copiarEstiloEnlaceAlPortapapeles,
    pegarEstiloEnlaceDesdePortapapeles,
    enlaceEstiloPortapapeles,
    borrarEnlacesEnLote,
  } = useZustandLinkContextActionsPort();
  const { iniciarAutosalvado } = useZustandAutosavePort();
  const { modelo, opdActivoId } = useZustandOpdNavigationPort();
  const { modoEnlace } = useZustandInteractionModePort();

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
    modoEnlace,
    alinearSeleccion,
    distribuirSeleccion,
    alinearSeleccionEnlaces,
  };
}

export type ToolbarBaseViewModel = ReturnType<typeof useToolbarBaseViewModel>;
