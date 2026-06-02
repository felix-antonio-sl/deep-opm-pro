import { useOpmStore } from "../../store";
import {
  resolverHijosWorkspace,
  rutaWorkspaceActual,
  validarNombreWorkspace,
  type WorkspacePort,
} from "./workspacePort";

export function useZustandWorkspacePort(): WorkspacePort {
  const workspaceLocal = useOpmStore((s) => s.workspaceLocal);
  const modelosGuardados = useOpmStore((s) => s.modelosGuardados);
  const indice = useOpmStore((s) => s.indice);
  const carpetaActualId = useOpmStore((s) => s.carpetaActualId);
  const mostrarVersiones = useOpmStore((s) => s.mostrarVersiones);
  const mostrarArchivados = useOpmStore((s) => s.mostrarArchivados);
  const portapapelesWorkspace = useOpmStore((s) => s.portapapelesWorkspace);
  const abrirCarpeta = useOpmStore((s) => s.abrirCarpeta);
  const crearCarpetaEnActual = useOpmStore((s) => s.crearCarpetaEnActual);
  const renombrarCarpetaEnIndice = useOpmStore((s) => s.renombrarCarpetaEnIndice);
  const eliminarCarpetaEnIndice = useOpmStore((s) => s.eliminarCarpetaEnIndice);
  const abrirPestanaConModelo = useOpmStore((s) => s.abrirPestanaConModelo);
  const cortarModelo = useOpmStore((s) => s.cortarModelo);
  const cortarCarpeta = useOpmStore((s) => s.cortarCarpeta);
  const cancelarPortapapelesWorkspace = useOpmStore((s) => s.cancelarPortapapelesWorkspace);
  const pegarEn = useOpmStore((s) => s.pegarEn);
  const moverModeloDirecto = useOpmStore((s) => s.moverModeloDirecto);
  const moverCarpetaDirecto = useOpmStore((s) => s.moverCarpetaDirecto);
  const archivarModeloPorId = useOpmStore((s) => s.archivarModeloPorId);
  const restaurarModeloPorId = useOpmStore((s) => s.restaurarModeloPorId);
  const archivarCarpetaPorId = useOpmStore((s) => s.archivarCarpetaPorId);
  const restaurarCarpetaPorId = useOpmStore((s) => s.restaurarCarpetaPorId);
  const abrirDialogoVersiones = useOpmStore((s) => s.abrirDialogoVersiones);
  const toggleMostrarArchivados = useOpmStore((s) => s.toggleMostrarArchivados);
  const toggleMostrarVersiones = useOpmStore((s) => s.toggleMostrarVersiones);

  return {
    workspaceLocal,
    modelosGuardados,
    indice,
    carpetaActualId,
    mostrarVersiones,
    mostrarArchivados,
    portapapelesWorkspace,
    abrirCarpeta,
    crearCarpetaEnActual,
    renombrarCarpetaEnIndice,
    eliminarCarpetaEnIndice,
    abrirPestanaConModelo,
    cortarModelo,
    cortarCarpeta,
    cancelarPortapapelesWorkspace,
    pegarEn,
    moverModeloDirecto,
    moverCarpetaDirecto,
    archivarModeloPorId,
    restaurarModeloPorId,
    archivarCarpetaPorId,
    restaurarCarpetaPorId,
    abrirDialogoVersiones,
    toggleMostrarArchivados,
    toggleMostrarVersiones,
    rutaCarpetaActual: () => rutaWorkspaceActual(indice, carpetaActualId),
    listarHijosActuales: (opciones) => resolverHijosWorkspace(indice, carpetaActualId, modelosGuardados, opciones),
    validarNombreModelo: (nombre, idPermitido) => validarNombreWorkspace(nombre, modelosGuardados, idPermitido ?? null),
  };
}
