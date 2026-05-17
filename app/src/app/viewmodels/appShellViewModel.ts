import { useOpmStore } from "../../store";

export function useAppShellViewModel() {
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const anchoPanelArbol = useOpmStore((s) => s.anchoPanelArbol);
  const anchoPanelInspector = useOpmStore((s) => s.anchoPanelInspector);
  const preferenciasOpl = useOpmStore((s) => s.indice.preferenciasUi);
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const fijarAnchoPanelArbol = useOpmStore((s) => s.fijarAnchoPanelArbol);
  const fijarAnchoPanelInspector = useOpmStore((s) => s.fijarAnchoPanelInspector);
  const asistenteAbierto = useOpmStore((s) => s.asistente !== null);
  const dialogoGuardarComoAbierto = useOpmStore((s) => s.dialogoGuardarComoAbierto);
  const dialogoConfiguracionAbierto = useOpmStore((s) => s.dialogoConfiguracionAbierto);
  const dialogoImportarExportarJsonAbierto = useOpmStore((s) => s.dialogoImportarExportarJsonAbierto);
  const cerrarDialogoImportarExportarJson = useOpmStore((s) => s.cerrarDialogoImportarExportarJson);
  const dialogoCargarModeloAbierto = useOpmStore((s) => s.dialogoCargarModeloAbierto);
  const dialogoBuscarGlobalAbierto = useOpmStore((s) => s.dialogoBuscarGlobalAbierto);
  const busquedaCosasAbierta = useOpmStore((s) => s.busquedaCosasAbierta);
  const dialogoVersionesAbierto = useOpmStore((s) => s.dialogoVersionesAbierto !== null);
  const modalUrlsAbierto = useOpmStore((s) => s.modalUrlsAbierto !== null);
  const modalImagenAbierto = useOpmStore((s) => s.modalImagenAbierto !== null);
  const modalDuracionAbierto = useOpmStore((s) => s.modalDuracionAbierto !== null);
  const tablaEnlacesAbierta = useOpmStore((s) => s.tablaEnlacesAbierta);
  const gestionArbolAbierta = useOpmStore((s) => s.gestionArbolAbierta);
  const cheatsheetAtajosAbierto = useOpmStore((s) => s.cheatsheetAtajosAbierto);
  const cerrarCheatsheetAtajos = useOpmStore((s) => s.cerrarCheatsheetAtajos);
  const dialogoComandosAbierto = useOpmStore((s) => s.dialogoComandosAbierto);
  const cerrarDialogoComandos = useOpmStore((s) => s.cerrarDialogoComandos);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const pantallaInicioCerrada = useOpmStore((s) => s.pantallaInicioCerrada);
  const seleccionIdOpl = useOpmStore((s) => s.seleccionId);
  const enlaceSeleccionIdOpl = useOpmStore((s) => s.enlaceSeleccionId);
  const vistaMobileActiva = useOpmStore((s) => s.vistaMobileActiva);
  const bibliotecaDockAbierto = useOpmStore((s) => s.bibliotecaDockAbierto);
  const cerrarBibliotecaDock = useOpmStore((s) => s.cerrarBibliotecaDock);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const modoSimulacionActivo = useOpmStore((s) => s.contextoSimulacion !== null);
  const modoEnlaceActivo = useOpmStore((s) => s.modoEnlace !== null);
  const modoCreacionActivo = useOpmStore((s) => s.modoCreacion !== null);

  return {
    vistaMapaActiva,
    anchoPanelArbol,
    anchoPanelInspector,
    preferenciasOpl,
    modelo,
    opdActivoId,
    fijarAnchoPanelArbol,
    fijarAnchoPanelInspector,
    asistenteAbierto,
    dialogoGuardarComoAbierto,
    dialogoConfiguracionAbierto,
    dialogoImportarExportarJsonAbierto,
    cerrarDialogoImportarExportarJson,
    dialogoCargarModeloAbierto,
    dialogoBuscarGlobalAbierto,
    busquedaCosasAbierta,
    dialogoVersionesAbierto,
    modalUrlsAbierto,
    modalImagenAbierto,
    modalDuracionAbierto,
    tablaEnlacesAbierta,
    gestionArbolAbierta,
    cheatsheetAtajosAbierto,
    cerrarCheatsheetAtajos,
    dialogoComandosAbierto,
    cerrarDialogoComandos,
    modeloPersistidoId,
    pantallaInicioCerrada,
    seleccionIdOpl,
    enlaceSeleccionIdOpl,
    vistaMobileActiva,
    bibliotecaDockAbierto,
    cerrarBibliotecaDock,
    cambiarOpdActivo,
    modoSimulacionActivo,
    modoEnlaceActivo,
    modoCreacionActivo,
  };
}

export type AppShellViewModel = ReturnType<typeof useAppShellViewModel>;
