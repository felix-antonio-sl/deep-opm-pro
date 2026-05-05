import type { Id, Resultado } from "../modelo/tipos";
import type { PortapapelesWorkspace, WorkspaceIndice } from "./workspace";

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}

export function cortarModelo(
  workspace: WorkspaceIndice,
  modeloId: Id,
  ahora = new Date().toISOString(),
): Resultado<PortapapelesWorkspace> {
  const modelo = workspace.modelos.find((item) => item.id === modeloId);
  if (!modelo) return fallo("Modelo no encontrado en el workspace");
  return ok({ tipo: "modelo", itemId: modeloId, origenCarpetaId: modelo.carpetaId, cortadoEn: ahora });
}

export function cortarCarpeta(
  workspace: WorkspaceIndice,
  carpetaId: Id,
  ahora = new Date().toISOString(),
): Resultado<PortapapelesWorkspace> {
  const carpeta = workspace.carpetas.find((item) => item.id === carpetaId);
  if (!carpeta) return fallo("Carpeta no encontrada en el workspace");
  return ok({ tipo: "carpeta", itemId: carpetaId, origenCarpetaId: carpeta.padreId, cortadoEn: ahora });
}

export function pegarModelo(
  workspace: WorkspaceIndice,
  portapapeles: PortapapelesWorkspace,
  destinoCarpetaId: Id | null,
): Resultado<WorkspaceIndice> {
  if (portapapeles.tipo !== "modelo") return fallo("El portapapeles no contiene un modelo");
  return moverModelo(workspace, portapapeles.itemId, destinoCarpetaId);
}

export function pegarCarpeta(
  workspace: WorkspaceIndice,
  portapapeles: PortapapelesWorkspace,
  destinoCarpetaId: Id | null,
): Resultado<WorkspaceIndice> {
  if (portapapeles.tipo !== "carpeta") return fallo("El portapapeles no contiene una carpeta");
  return moverCarpeta(workspace, portapapeles.itemId, destinoCarpetaId);
}

export function moverModelo(
  workspace: WorkspaceIndice,
  modeloId: Id,
  destinoCarpetaId: Id | null,
): Resultado<WorkspaceIndice> {
  const modelo = workspace.modelos.find((item) => item.id === modeloId);
  if (!modelo) return fallo("Modelo no encontrado en el workspace");
  if (destinoCarpetaId !== null && !workspace.carpetas.some((carpeta) => carpeta.id === destinoCarpetaId)) {
    return fallo("Carpeta destino no encontrada");
  }
  return ok({
    ...workspace,
    modelos: workspace.modelos.map((item) =>
      item.id === modeloId ? { ...item, carpetaId: destinoCarpetaId } : item,
    ),
  });
}

export function moverCarpeta(
  workspace: WorkspaceIndice,
  carpetaId: Id,
  destinoCarpetaId: Id | null,
): Resultado<WorkspaceIndice> {
  const validacion = validarMovimientoSinCiclo(workspace, carpetaId, destinoCarpetaId);
  if (!validacion.ok) return validacion;
  return ok({
    ...workspace,
    carpetas: workspace.carpetas.map((carpeta) =>
      carpeta.id === carpetaId ? { ...carpeta, padreId: destinoCarpetaId } : carpeta,
    ),
  });
}

export function validarMovimientoSinCiclo(
  workspace: WorkspaceIndice,
  carpetaId: Id,
  destinoCarpetaId: Id | null,
): Resultado<void> {
  const carpeta = workspace.carpetas.find((item) => item.id === carpetaId);
  if (!carpeta) return fallo("Carpeta origen no encontrada");
  if (destinoCarpetaId === carpetaId) return fallo("La carpeta no puede moverse dentro de sí misma");
  if (destinoCarpetaId !== null && !workspace.carpetas.some((item) => item.id === destinoCarpetaId)) {
    return fallo("Carpeta destino no encontrada");
  }
  let actual = destinoCarpetaId;
  const visitadas = new Set<Id>();
  while (actual) {
    if (actual === carpetaId) return fallo("La carpeta no puede moverse dentro de una subcarpeta propia");
    if (visitadas.has(actual)) return fallo("El árbol de carpetas tiene un ciclo previo");
    visitadas.add(actual);
    actual = workspace.carpetas.find((item) => item.id === actual)?.padreId ?? null;
  }
  return ok(undefined);
}

