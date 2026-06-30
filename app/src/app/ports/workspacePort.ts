import type { Id } from "../../modelo/tipos";
import type { ResumenModeloPersistido } from "../../persistencia/modelos";
import {
  listarHijosDeCarpeta,
  rutaDeCarpeta,
  validarNombreModeloLocal,
  type CarpetaIndice,
  type PortapapelesWorkspace,
  type ValidacionNombreModelo,
  type WorkspaceIndice,
  type WorkspaceModeloLocal,
} from "../../persistencia/workspace";

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
  mostrarArchivados: boolean;
  portapapelesWorkspace: PortapapelesWorkspace | null;
  abrirCarpeta: (carpetaId: Id | null) => void;
  crearCarpetaEnActual: (nombre: string) => void;
  renombrarCarpetaEnIndice: (carpetaId: Id, nombre: string) => void;
  eliminarCarpetaEnIndice: (carpetaId: Id, opciones: { cascada: boolean }) => Promise<void>;
  abrirPestanaConModelo: (modeloId: Id) => void;
  cortarModelo: (modeloId: Id) => void;
  cortarCarpeta: (carpetaId: Id) => void;
  cancelarPortapapelesWorkspace: () => void;
  pegarEn: (carpetaDestinoId: Id | null) => void;
  moverModeloDirecto: (modeloId: Id, destino: Id | null) => void;
  moverCarpetaDirecto: (carpetaId: Id, destino: Id | null) => void;
  archivarModeloPorId: (modeloId: Id) => void;
  restaurarModeloPorId: (modeloId: Id) => void;
  toggleBibliotecaModelo: (modeloId: Id) => void;
  toggleApunteModelo: (modeloId: Id) => void;
  archivarCarpetaPorId: (carpetaId: Id) => void;
  restaurarCarpetaPorId: (carpetaId: Id) => void;
  abrirDialogoVersiones: (modeloId: Id) => void;
  toggleMostrarArchivados: () => void;
  toggleMostrarVersiones: () => void;
  rutaCarpetaActual: () => CarpetaIndice[];
  listarHijosActuales: (opciones?: { incluirArchivados?: boolean }) => WorkspaceChildren;
  validarNombreModelo: (nombre: string, idPermitido?: Id | null) => ValidacionNombreModelo;
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
      if (modeloIndice.esBiblioteca) modelo.esBiblioteca = true;
      if (modeloIndice.esApunte) modelo.esApunte = true;
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
  idPermitido: Id | null = null,
): ValidacionNombreModelo {
  return validarNombreModeloLocal(nombre, modelosGuardados, idPermitido);
}
