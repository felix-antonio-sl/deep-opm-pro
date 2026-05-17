import { useOpmStore } from "../../store";
import type { AppShellOverlaysPort } from "./appShellOverlaysPort";

export function useZustandAppShellOverlaysPort(): AppShellOverlaysPort {
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

  return {
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
  };
}
