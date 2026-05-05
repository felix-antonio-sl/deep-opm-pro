import type { Id, Modelo, Resultado } from "../modelo/tipos";
import type { ResumenModeloPersistido } from "./local";

// ── Tipos de jerarquía ──────────────────────────────────────────────

export interface CarpetaIndice {
  id: Id;
  nombre: string;
  padreId: Id | null;     // null = raíz
  creadoEn: number;
}

export interface ModeloIndice {
  id: Id;
  carpetaId: Id | null;   // null = raíz
}

export interface WorkspaceIndice {
  modelos: ModeloIndice[];
  carpetas: CarpetaIndice[];
  recientes: Id[];        // ids de modelos en orden de apertura, max 10
}

// ── Compatibilidad con ronda 5 ──────────────────────────────────────

export interface WorkspaceModeloLocal {
  id: Id | null;
  nombre: string;
  descripcion: string;
  carpetaId: "local";
}

export function workspaceDesdeModelo(
  modelo: Modelo,
  id: Id | null,
  descripcion = "",
  _carpetaId: Id | null = null,
): WorkspaceModeloLocal {
  return { id, nombre: modelo.nombre, descripcion, carpetaId: "local" };
}

export interface ValidacionNombreModelo {
  ok: boolean;
  nombre: string;
  error?: string;
}

export const BREADCRUMB_RAIZ = ["Inicio", "Modelos locales"] as const;

const NOMBRE_MODELO_RE = /^(?=[\S])[^\\/:*?"<>|.$[\]#]+$/;
const NOMBRE_CARPETA_RE = /^(?=[\S])[^\\/:*?"<>|.$[\]#]+$/;

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

// ── Operaciones sobre WorkspaceIndice ────────────────────────────────

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}

export function indiceVacio(): WorkspaceIndice {
  return { modelos: [], carpetas: [], recientes: [] };
}

function generarIdCarpeta(indice: WorkspaceIndice): Id {
  if (typeof globalThis.crypto?.randomUUID === "function") return `carpeta-${globalThis.crypto.randomUUID()}`;
  return `carpeta-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function crearCarpeta(
  indice: WorkspaceIndice,
  nombre: string,
  padreId: Id | null,
): Resultado<{ indice: WorkspaceIndice; carpeta: CarpetaIndice }> {
  const limpio = nombre.trim();
  if (!limpio) return fallo("Ingresa un nombre de carpeta");
  if (!NOMBRE_CARPETA_RE.test(limpio)) return fallo("El nombre contiene caracteres no permitidos");

  const hermanas = indice.carpetas.filter((c) => c.padreId === padreId);
  const duplicada = hermanas.some(
    (c) => c.nombre.trim().toLocaleLowerCase("es-CL") === limpio.toLocaleLowerCase("es-CL"),
  );
  if (duplicada) return fallo("Ya existe una carpeta con ese nombre en esta ubicación");

  const carpeta: CarpetaIndice = {
    id: generarIdCarpeta(indice),
    nombre: limpio,
    padreId,
    creadoEn: Date.now(),
  };

  return ok({
    indice: { ...indice, carpetas: [...indice.carpetas, carpeta] },
    carpeta,
  });
}

export function renombrarCarpeta(
  indice: WorkspaceIndice,
  carpetaId: Id,
  nombre: string,
): Resultado<WorkspaceIndice> {
  const carpeta = indice.carpetas.find((c) => c.id === carpetaId);
  if (!carpeta) return fallo("Carpeta no encontrada");

  const limpio = nombre.trim();
  if (!limpio) return fallo("Ingresa un nombre de carpeta");
  if (!NOMBRE_CARPETA_RE.test(limpio)) return fallo("El nombre contiene caracteres no permitidos");

  const hermanas = indice.carpetas.filter(
    (c) => c.padreId === carpeta.padreId && c.id !== carpetaId,
  );
  const duplicada = hermanas.some(
    (c) => c.nombre.trim().toLocaleLowerCase("es-CL") === limpio.toLocaleLowerCase("es-CL"),
  );
  if (duplicada) return fallo("Ya existe una carpeta con ese nombre en esta ubicación");

  const carpetas = indice.carpetas.map((c) =>
    c.id === carpetaId ? { ...c, nombre: limpio } : c,
  );

  return ok({ ...indice, carpetas });
}

export function eliminarCarpeta(
  indice: WorkspaceIndice,
  carpetaId: Id,
  opciones: { cascada: boolean },
): Resultado<WorkspaceIndice> {
  const carpeta = indice.carpetas.find((c) => c.id === carpetaId);
  if (!carpeta) return fallo("Carpeta no encontrada");

  if (!opciones.cascada) {
    const hijosCarpetas = indice.carpetas.filter((c) => c.padreId === carpetaId);
    const hijosModelos = indice.modelos.filter((m) => m.carpetaId === carpetaId);
    const total = hijosCarpetas.length + hijosModelos.length;
    if (total > 0) {
      return fallo(`La carpeta no está vacía (${total} elemento${total !== 1 ? "s" : ""}). Usa eliminación en cascada o mueve el contenido primero.`);
    }
  }

  if (opciones.cascada) {
    const idsSubcarpetas = new Set<Id>();
    const recogerHijas = (padreId: Id) => {
      for (const c of indice.carpetas) {
        if (c.padreId === padreId && !idsSubcarpetas.has(c.id)) {
          idsSubcarpetas.add(c.id);
          recogerHijas(c.id);
        }
      }
    };
    recogerHijas(carpetaId);

    const carpetas = indice.carpetas.filter(
      (c) => c.id !== carpetaId && !idsSubcarpetas.has(c.id),
    );

    const modelos = indice.modelos.map((m) =>
      m.carpetaId === carpetaId || idsSubcarpetas.has(m.carpetaId ?? "")
        ? { ...m, carpetaId: null }
        : m,
    );

    return ok({ ...indice, carpetas, modelos });
  }

  return ok({
    ...indice,
    carpetas: indice.carpetas.filter((c) => c.id !== carpetaId),
  });
}

export function moverModeloACarpeta(
  indice: WorkspaceIndice,
  modeloId: Id,
  carpetaId: Id | null,
): Resultado<WorkspaceIndice> {
  const modelo = indice.modelos.find((m) => m.id === modeloId);
  if (!modelo) return fallo("Modelo no encontrado en el índice");

  if (carpetaId !== null) {
    const carpeta = indice.carpetas.find((c) => c.id === carpetaId);
    if (!carpeta) return fallo("Carpeta destino no encontrada");
  }

  const modelos = indice.modelos.map((m) =>
    m.id === modeloId ? { ...m, carpetaId } : m,
  );

  return ok({ ...indice, modelos });
}

export function listarHijosDeCarpeta(
  indice: WorkspaceIndice,
  carpetaId: Id | null,
): { carpetas: CarpetaIndice[]; modelos: ModeloIndice[] } {
  const carpetas = indice.carpetas
    .filter((c) => c.padreId === carpetaId)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es-CL"));
  const modelos = indice.modelos
    .filter((m) => m.carpetaId === carpetaId)
    .sort((a, b) => a.id.localeCompare(b.id));
  return { carpetas, modelos };
}

export function rutaDeCarpeta(
  indice: WorkspaceIndice,
  carpetaId: Id | null,
): CarpetaIndice[] {
  if (carpetaId === null) return [];
  const ruta: CarpetaIndice[] = [];
  let actual = indice.carpetas.find((c) => c.id === carpetaId);
  while (actual) {
    ruta.unshift(actual);
    actual = actual.padreId ? indice.carpetas.find((c) => c.id === actual!.padreId) : undefined;
  }
  return ruta;
}

export function carpetaTieneAncestro(
  indice: WorkspaceIndice,
  carpetaId: Id,
  ancestroId: Id,
): boolean {
  const idsVisitados = new Set<Id>();
  let actual: Id | null = carpetaId;
  while (actual && !idsVisitados.has(actual)) {
    idsVisitados.add(actual);
    if (actual === ancestroId) return true;
    const carpeta = indice.carpetas.find((c) => c.id === actual);
    actual = carpeta?.padreId ?? null;
  }
  return false;
}
