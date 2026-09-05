import { lazy, Suspense } from "preact/compat";
import { useAppShellDialogsViewModel } from "../app/viewmodels/appShellViewModel";
import { CapturadorBugs } from "./CapturadorBugs";

const CheatsheetAtajos = lazy(() => import("./CheatsheetAtajos").then((m) => ({ default: m.CheatsheetAtajos })));
const CommandPalette = lazy(() => import("./CommandPalette").then((m) => ({ default: m.CommandPalette })));
const DialogoBuscarCosas = lazy(() => import("./DialogoBuscarCosas").then((m) => ({ default: m.DialogoBuscarCosas })));
const DialogoBuscarGlobal = lazy(() => import("./DialogoBuscarGlobal").then((m) => ({ default: m.DialogoBuscarGlobal })));
const DialogoCargarModelo = lazy(() => import("./DialogoCargarModelo").then((m) => ({ default: m.DialogoCargarModelo })));
const DialogoConfiguracion = lazy(() => import("./DialogoConfiguracion").then((m) => ({ default: m.DialogoConfiguracion })));
const DialogoOntologia = lazy(() => import("./DialogoOntologia").then((m) => ({ default: m.DialogoOntologia })));
const DialogoRequisito = lazy(() => import("./DialogoRequisito").then((m) => ({ default: m.DialogoRequisito })));
const DialogoSubmodelo = lazy(() => import("./DialogoSubmodelo").then((m) => ({ default: m.DialogoSubmodelo })));
const DialogoComposicion = lazy(() => import("./DialogoComposicion").then((m) => ({ default: m.DialogoComposicion })));
const VitrinaEstereotipos = lazy(() => import("./VitrinaEstereotipos").then((m) => ({ default: m.VitrinaEstereotipos })));
const DialogoSimulacionNumerica = lazy(() => import("./DialogoSimulacionNumerica").then((m) => ({ default: m.DialogoSimulacionNumerica })));
const DialogoColisionNombre = lazy(() => import("./DialogoColisionNombre").then((m) => ({ default: m.DialogoColisionNombre })));
const DialogoGuardarComo = lazy(() => import("./DialogoGuardarComo").then((m) => ({ default: m.DialogoGuardarComo })));
const DialogoMesaExploracion = lazy(() => import("./DialogoMesaExploracion").then((m) => ({ default: m.DialogoMesaExploracion })));
const DialogoGraduar = lazy(() => import("./DialogoGraduar").then((m) => ({ default: m.DialogoGraduar })));
const DialogoReabrirTaller = lazy(() => import("./DialogoReabrirTaller").then((m) => ({ default: m.DialogoReabrirTaller })));
const DialogoEliminarRefinamiento = lazy(() => import("./DialogoEliminarRefinamiento").then((m) => ({ default: m.DialogoEliminarRefinamiento })));
const DialogoDevolverBoceto = lazy(() => import("./DialogoDevolverBoceto").then((m) => ({ default: m.DialogoDevolverBoceto })));
const DialogoRolBiblioteca = lazy(() => import("./DialogoRolBiblioteca").then((m) => ({ default: m.DialogoRolBiblioteca })));
const DialogoImportarExportarJson = lazy(() => import("./DialogoImportarExportarJson").then((m) => ({ default: m.DialogoImportarExportarJson })));
const DialogoVersiones = lazy(() => import("./DialogoVersiones").then((m) => ({ default: m.DialogoVersiones })));
const TablaEnlaces = lazy(() => import("./TablaEnlaces").then((m) => ({ default: m.TablaEnlaces })));
const GestionArbolOpd = lazy(() => import("./GestionArbolOpd").then((m) => ({ default: m.GestionArbolOpd })));
const ModalDuracionEstado = lazy(() => import("./ModalDuracionEstado").then((m) => ({ default: m.ModalDuracionEstado })));
const ModalImagenObjeto = lazy(() => import("./ModalImagenObjeto").then((m) => ({ default: m.ModalImagenObjeto })));
const ModalUrlsObjeto = lazy(() => import("./ModalUrlsObjeto").then((m) => ({ default: m.ModalUrlsObjeto })));

/** Los diálogos observan su estado sin suscribir todo el editor a cada apertura. */
export function WorkbenchDialogs({
  explorationMounted,
  explorationOpen,
  onCloseExploration,
}: {
  explorationMounted: boolean;
  explorationOpen: boolean;
  onCloseExploration: () => void;
}) {
  const {
    dialogoGuardarComoAbierto,
    dialogoConfiguracionAbierto,
    dialogoOntologiaAbierto,
    dialogoRequisitoAbierto,
    dialogoSubmodeloAbierto,
    dialogoComposicionAbierto,
    vitrinaEstereotiposAbierta,
    dialogoSimulacionNumericaAbierto,
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
    dialogoGraduarAbierto,
  } = useAppShellDialogsViewModel();
  return (
    <>
        {dialogoGuardarComoAbierto ? <Suspense fallback={null}><DialogoGuardarComo /></Suspense> : null}
        {explorationMounted ? (
          <Suspense fallback={null}>
            <DialogoMesaExploracion open={explorationOpen} onCerrar={onCloseExploration} />
          </Suspense>
        ) : null}
        {dialogoGraduarAbierto ? <Suspense fallback={null}><DialogoGraduar /></Suspense> : null}
        <Suspense fallback={null}><DialogoReabrirTaller /></Suspense>
        <Suspense fallback={null}><DialogoEliminarRefinamiento /></Suspense>
        <Suspense fallback={null}><DialogoDevolverBoceto /></Suspense>
        <Suspense fallback={null}><DialogoRolBiblioteca /></Suspense>
        {dialogoConfiguracionAbierto ? <Suspense fallback={null}><DialogoConfiguracion /></Suspense> : null}
        {dialogoOntologiaAbierto ? <Suspense fallback={null}><DialogoOntologia /></Suspense> : null}
        {dialogoRequisitoAbierto ? <Suspense fallback={null}><DialogoRequisito /></Suspense> : null}
        {dialogoSubmodeloAbierto ? <Suspense fallback={null}><DialogoSubmodelo /></Suspense> : null}
        {dialogoComposicionAbierto ? <Suspense fallback={null}><DialogoComposicion /></Suspense> : null}
        {vitrinaEstereotiposAbierta ? <Suspense fallback={null}><VitrinaEstereotipos /></Suspense> : null}
        {dialogoSimulacionNumericaAbierto ? <Suspense fallback={null}><DialogoSimulacionNumerica /></Suspense> : null}
        <Suspense fallback={null}><DialogoColisionNombre /></Suspense>
        {dialogoImportarExportarJsonAbierto ? (
          <Suspense fallback={null}>
            <DialogoImportarExportarJson open={dialogoImportarExportarJsonAbierto} onCerrar={cerrarDialogoImportarExportarJson} />
          </Suspense>
        ) : null}
        {dialogoCargarModeloAbierto ? <Suspense fallback={null}><DialogoCargarModelo /></Suspense> : null}
        {dialogoBuscarGlobalAbierto ? <Suspense fallback={null}><DialogoBuscarGlobal /></Suspense> : null}
        {busquedaCosasAbierta ? <Suspense fallback={null}><DialogoBuscarCosas /></Suspense> : null}
        {dialogoVersionesAbierto ? <Suspense fallback={null}><DialogoVersiones /></Suspense> : null}
        {tablaEnlacesAbierta ? <Suspense fallback={null}><TablaEnlaces /></Suspense> : null}
        {gestionArbolAbierta ? <Suspense fallback={null}><GestionArbolOpd /></Suspense> : null}
        {modalImagenAbierto ? <Suspense fallback={null}><ModalImagenObjeto /></Suspense> : null}
        {modalUrlsAbierto ? <Suspense fallback={null}><ModalUrlsObjeto /></Suspense> : null}
        {modalDuracionAbierto ? <Suspense fallback={null}><ModalDuracionEstado /></Suspense> : null}
        {cheatsheetAtajosAbierto ? (
          <Suspense fallback={null}>
            <CheatsheetAtajos abierto={cheatsheetAtajosAbierto} onCerrar={cerrarCheatsheetAtajos} />
          </Suspense>
        ) : null}
        {dialogoComandosAbierto ? (
          <Suspense fallback={null}>
            <CommandPalette abierto={dialogoComandosAbierto} onCerrar={cerrarDialogoComandos} />
          </Suspense>
        ) : null}
        <CapturadorBugs />
    </>
  );
}
