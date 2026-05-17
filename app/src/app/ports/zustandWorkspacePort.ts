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
  const abrirCarpeta = useOpmStore((s) => s.abrirCarpeta);
  const crearCarpetaEnActual = useOpmStore((s) => s.crearCarpetaEnActual);
  const renombrarCarpetaEnIndice = useOpmStore((s) => s.renombrarCarpetaEnIndice);
  const eliminarCarpetaEnIndice = useOpmStore((s) => s.eliminarCarpetaEnIndice);

  return {
    workspaceLocal,
    modelosGuardados,
    indice,
    carpetaActualId,
    mostrarVersiones,
    abrirCarpeta,
    crearCarpetaEnActual,
    renombrarCarpetaEnIndice,
    eliminarCarpetaEnIndice,
    rutaCarpetaActual: () => rutaWorkspaceActual(indice, carpetaActualId),
    listarHijosActuales: (opciones) => resolverHijosWorkspace(indice, carpetaActualId, modelosGuardados, opciones),
    validarNombreModelo: (nombre) => validarNombreWorkspace(nombre, modelosGuardados),
  };
}
