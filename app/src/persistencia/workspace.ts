import type { Id, Modelo } from "../modelo/tipos";
import type { ResumenModeloPersistido } from "./local";

export interface WorkspaceModeloLocal {
  id: Id | null;
  nombre: string;
  descripcion: string;
  carpetaId: "local";
}

export interface ValidacionNombreModelo {
  ok: boolean;
  nombre: string;
  error?: string;
}

export const BREADCRUMB_MODELOS_LOCALES = ["Inicio", "Modelos locales"] as const;

const NOMBRE_MODELO_RE = /^(?=[\S])[^\\/:*?"<>|.$[\]#]+$/;

export function workspaceDesdeModelo(
  modelo: Modelo,
  id: Id | null,
  descripcion = "",
): WorkspaceModeloLocal {
  return {
    id,
    nombre: modelo.nombre,
    descripcion,
    carpetaId: "local",
  };
}

export function validarNombreModeloLocal(
  nombre: string,
  existentes: ResumenModeloPersistido[],
  idPermitido: Id | null = null,
): ValidacionNombreModelo {
  const limpio = nombre.trim();
  if (!limpio) return { ok: false, nombre: limpio, error: "Ingresa un nombre de modelo" };
  if (!NOMBRE_MODELO_RE.test(limpio)) {
    return { ok: false, nombre: limpio, error: "El nombre contiene caracteres no permitidos" };
  }
  const duplicado = existentes.some((modelo) => (
    modelo.id !== idPermitido &&
    modelo.nombre.trim().toLocaleLowerCase("es-CL") === limpio.toLocaleLowerCase("es-CL")
  ));
  if (duplicado) return { ok: false, nombre: limpio, error: "Ya existe un modelo local con ese nombre" };
  return { ok: true, nombre: limpio };
}

