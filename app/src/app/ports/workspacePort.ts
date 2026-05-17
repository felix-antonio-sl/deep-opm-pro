import type { Id } from "../../modelo/tipos";
import type { ResumenModeloPersistido } from "../../persistencia/local";
import {
  listarHijosDeCarpeta,
  rutaDeCarpeta,
  validarNombreModeloLocal,
  type CarpetaIndice,
  type ValidacionNombreModelo,
  type WorkspaceIndice,
  type WorkspaceModeloLocal,
} from "../../persistencia/workspace";
import type { OpmStore } from "../../store";

export interface WorkspaceChildren {
  carpetas: CarpetaIndice[];
  modelos: ResumenModeloPersistido[];
}

export interface WorkspacePort {
  workspaceLocal: WorkspaceModeloLocal;
  modelosGuardados: ResumenModeloPersistido[];
  indice: WorkspaceIndice;
  carpetaActualId: Id | null;
  mostrarVersiones: boolean;
  abrirCarpeta: OpmStore["abrirCarpeta"];
  crearCarpetaEnActual: OpmStore["crearCarpetaEnActual"];
  renombrarCarpetaEnIndice: OpmStore["renombrarCarpetaEnIndice"];
  eliminarCarpetaEnIndice: OpmStore["eliminarCarpetaEnIndice"];
  rutaCarpetaActual: () => CarpetaIndice[];
  listarHijosActuales: (opciones?: { incluirArchivados?: boolean }) => WorkspaceChildren;
  validarNombreModelo: (nombre: string) => ValidacionNombreModelo;
}

export function resolverHijosWorkspace(
  indice: WorkspaceIndice,
  carpetaActualId: Id | null,
  modelosGuardados: ResumenModeloPersistido[],
  opciones: { incluirArchivados?: boolean } = {},
): WorkspaceChildren {
  const raw = listarHijosDeCarpeta(indice, carpetaActualId, opciones);
  const resumenes = new Map(modelosGuardados.map((modelo) => [modelo.id, modelo]));
  const modelos = raw.modelos
    .map((modeloIndice) => {
      const guardado = resumenes.get(modeloIndice.id);
      if (!guardado) return undefined;
      const modelo: ResumenModeloPersistido = { ...guardado };
      if (modeloIndice.archivado) modelo.archivado = true;
      if (modelo.archivadoEn === undefined && modeloIndice.archivadoEn !== undefined) {
        modelo.archivadoEn = modeloIndice.archivadoEn;
      }
      if (modelo.versiones === undefined && modeloIndice.versiones !== undefined) {
        modelo.versiones = modeloIndice.versiones;
      }
      return modelo;
    })
    .filter((modelo) => modelo !== undefined);
  return { carpetas: raw.carpetas, modelos };
}

export function rutaWorkspaceActual(indice: WorkspaceIndice, carpetaActualId: Id | null): CarpetaIndice[] {
  return rutaDeCarpeta(indice, carpetaActualId);
}

export function validarNombreWorkspace(
  nombre: string,
  modelosGuardados: ResumenModeloPersistido[],
): ValidacionNombreModelo {
  return validarNombreModeloLocal(nombre, modelosGuardados);
}
