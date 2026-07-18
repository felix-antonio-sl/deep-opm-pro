import type { Id, Modelo, PreferenciasUiUsuario, Resultado, VersionResumen } from "../modelo/tipos";
import type { CriterioResaltado } from "../canvas/mapaSistema";
import type { ResumenModeloPersistido } from "./modelos";

// ── Tipos de jerarquía ──────────────────────────────────────────────

export interface CarpetaIndice {
  id: Id;
  nombre: string;
  padreId: Id | null;     // null = raíz
  creadoEn: number;
  archivada?: boolean;
  archivadaEn?: string;
}

export interface ModeloIndice {
  id: Id;
  carpetaId: Id | null;   // null = raíz
  archivado?: boolean;
  archivadoEn?: string;
  archivadoAuto?: boolean;
  esBiblioteca?: boolean;
  esApunte?: boolean;
  ultimoUso?: string;
  descripcion?: string;
  autosalvado?: boolean;
  versiones?: VersionResumen[];
  mapa?: MapaWorkspace;
}

export interface MapaWorkspace {
  zoom?: number;
  panX?: number;
  panY?: number;
  profundidadMaxima?: number | null;
  subarbolRaizId?: Id | null;
  criterioResaltado?: CriterioResaltado;
  autoRefresh?: boolean;
}

export interface WorkspaceIndice {
  modelos: ModeloIndice[];
  carpetas: CarpetaIndice[];
  recientes: Id[];        // ids de modelos en orden de apertura, max 10
  busquedaGlobalUltima?: string;
  preferenciasUi?: PreferenciasUiUsuario;
}

/** Snapshot persistido del índice y testigo monotónico para optimistic locking. */
export interface WorkspacePersistido {
  indice: WorkspaceIndice;
  revision: number;
}

/** Reemplazo completo condicionado al snapshot que el cliente observó. */
export interface WorkspaceWrite {
  indice: WorkspaceIndice;
  revisionBase: number;
}

export interface PortapapelesWorkspace {
  tipo: "modelo" | "carpeta";
  itemId: Id;
  origenCarpetaId: Id | null;
  cortadoEn: string;
}

export interface ResultadoBusquedaGlobal {
  modeloId: Id;
  nombre: string;
  descripcion?: string;
  carpetaId: Id | null;
  rutaCarpetas: string;
  match: { campo: "nombre" | "descripcion"; resaltado: string };
}

export interface BusquedaGlobalEstado {
  query: string;
  resultados: ResultadoBusquedaGlobal[];
  enProgreso: boolean;
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

const NOMBRE_MODELO_RE = /^(?=[\S])[^\\/:*?"<>|$[\]#]+$/;
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
  opciones: { incluirArchivados?: boolean } = {},
): { carpetas: CarpetaIndice[]; modelos: ModeloIndice[] } {
  const carpetas = indice.carpetas
    .filter((c) => c.padreId === carpetaId && (opciones.incluirArchivados || !c.archivada))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es-CL"));
  const modelos = indice.modelos
    .filter((m) => m.carpetaId === carpetaId && (opciones.incluirArchivados || !m.archivado))
    .sort((a, b) => a.id.localeCompare(b.id));
  return { carpetas, modelos };
}

export function listarModelosPorCarpeta(
  indice: WorkspaceIndice,
  carpetaId: Id | null,
  opciones: { incluirArchivados?: boolean } = {},
): ModeloIndice[] {
  return listarHijosDeCarpeta(indice, carpetaId, opciones).modelos;
}

export function listarCarpetasPorPadre(
  indice: WorkspaceIndice,
  padreId: Id | null,
  opciones: { incluirArchivadas?: boolean } = {},
): CarpetaIndice[] {
  return indice.carpetas
    .filter((c) => c.padreId === padreId && (opciones.incluirArchivadas || !c.archivada))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es-CL"));
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

export function buscarGlobal(
  indice: WorkspaceIndice,
  query: string,
  modelosGuardados: ResumenModeloPersistido[] = [],
): ResultadoBusquedaGlobal[] {
  const q = query.trim().toLocaleLowerCase("es-CL");
  if (q.length < 3) return [];
  const resumenes = new Map(modelosGuardados.map((modelo) => [modelo.id, modelo]));
  return indice.modelos
    .filter((modelo) => !modelo.archivado)
    .reduce<ResultadoBusquedaGlobal[]>((resultados, modelo) => {
      const resumen = resumenes.get(modelo.id);
      const nombre = resumen?.nombre ?? modelo.id;
      const descripcion = resumen?.descripcion ?? "";
      const nombreLower = nombre.toLocaleLowerCase("es-CL");
      const descripcionLower = descripcion.toLocaleLowerCase("es-CL");
      const campo = nombreLower.includes(q)
        ? "nombre"
        : descripcionLower.includes(q)
          ? "descripcion"
          : null;
      if (!campo) return resultados;
      const texto = campo === "nombre" ? nombre : descripcion;
      resultados.push({
        modeloId: modelo.id,
        nombre,
        descripcion,
        carpetaId: modelo.carpetaId,
        rutaCarpetas: rutaTexto(indice, modelo.carpetaId),
        match: { campo, resaltado: texto },
      });
      return resultados;
    }, [])
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es-CL"));
}

export function archivarModelo(indice: WorkspaceIndice, modeloId: Id, ahora = new Date().toISOString()): WorkspaceIndice {
  return {
    ...indice,
    modelos: indice.modelos.map((modelo) =>
      modelo.id === modeloId ? { ...modelo, archivado: true, archivadoEn: ahora } : modelo,
    ),
  };
}

/**
 * B1 — Designación de biblioteca. Espeja `archivarModelo`: marca/desmarca el
 * flag `esBiblioteca` de un modelo en el índice. `valor=true` lo designa como
 * origen de Piezas; `valor=false` retira la designación (omite el flag para
 * mantener el índice mínimo, igual que `restaurarModelo` con `archivado`).
 */
export function marcarBiblioteca(indice: WorkspaceIndice, modeloId: Id, valor: boolean): WorkspaceIndice {
  return {
    ...indice,
    modelos: indice.modelos.map((modelo) =>
      modelo.id === modeloId
        // Invariante de exclusión (corrección 5): designar biblioteca retira la
        // designación apunte. Un record no puede ser ambas especies a la vez.
        ? (valor ? { ...sinApunte(modelo), esBiblioteca: true } : sinBiblioteca(modelo))
        : modelo,
    ),
  };
}

/**
 * Modo apunte — designación de especie hermana del modelo (gemelo de
 * `marcarBiblioteca`). `valor=true` marca el record como apunte (borrador OPM sin
 * rigor de cierre) y RETIRA la designación biblioteca (exclusión mutua sellada,
 * corrección 5); `valor=false` retira la designación apunte (omite el flag para
 * mantener el índice mínimo — promoción a modelo = ausencia, corrección 8). Spec:
 * docs/superpowers/specs/2026-06-30-modo-apunte-design.md §3.5, §3.8.
 */
export function marcarApunte(indice: WorkspaceIndice, modeloId: Id, valor: boolean): WorkspaceIndice {
  return {
    ...indice,
    modelos: indice.modelos.map((modelo) =>
      modelo.id === modeloId
        ? (valor ? { ...sinBiblioteca(modelo), esApunte: true } : sinApunte(modelo))
        : modelo,
    ),
  };
}

/**
 * B1 — Read-path del flag biblioteca. Lista las entradas del índice designadas
 * como biblioteca (origen de Piezas). Lo consume la superficie «Piezas» (B2)
 * para poblar el selector de fuente; se cruza por id con `modelosGuardados`
 * para resolver el nombre.
 */
export function listarBibliotecas(indice: WorkspaceIndice): ModeloIndice[] {
  return indice.modelos.filter((modelo) => modelo.esBiblioteca === true);
}

export function autoArchivarPorEdad(
  indice: WorkspaceIndice,
  modelosGuardados: ResumenModeloPersistido[] = [],
  dias = 90,
  ahora = new Date(),
): { indice: WorkspaceIndice; modelosAutoArchivados: Id[] } {
  const limiteMs = Math.max(1, dias) * 24 * 60 * 60 * 1000;
  const resumenes = new Map(modelosGuardados.map((modelo) => [modelo.id, modelo]));
  const modelosAutoArchivados: Id[] = [];
  const isoAhora = ahora.toISOString();
  const modelos = indice.modelos.map((modelo) => {
    if (modelo.archivado) return modelo;
    const resumen = resumenes.get(modelo.id);
    const uso = fechaUsoModelo(modelo, resumen);
    if (!uso) return modelo;
    const ts = Date.parse(uso);
    if (!Number.isFinite(ts) || ahora.getTime() - ts <= limiteMs) return modelo;
    modelosAutoArchivados.push(modelo.id);
    return {
      ...modelo,
      archivado: true,
      archivadoEn: isoAhora,
      archivadoAuto: true,
    };
  });
  return { indice: { ...indice, modelos }, modelosAutoArchivados };
}

export function restaurarArchivado(indice: WorkspaceIndice, modeloId: Id, ahora = new Date().toISOString()): WorkspaceIndice {
  return {
    ...indice,
    modelos: indice.modelos.map((modelo) =>
      modelo.id === modeloId
        ? { ...sinArchivado(modelo), ultimoUso: ahora }
        : modelo,
    ),
    recientes: [modeloId, ...indice.recientes.filter((id) => id !== modeloId)].slice(0, 12),
  };
}

export function restaurarModelo(indice: WorkspaceIndice, modeloId: Id): WorkspaceIndice {
  return {
    ...indice,
    modelos: indice.modelos.map((modelo) =>
      modelo.id === modeloId ? sinArchivado(modelo) : modelo,
    ),
  };
}

export function archivarCarpeta(indice: WorkspaceIndice, carpetaId: Id, ahora = new Date().toISOString()): WorkspaceIndice {
  const ids = idsCarpetasDescendientes(indice, carpetaId);
  ids.add(carpetaId);
  return {
    ...indice,
    carpetas: indice.carpetas.map((carpeta) =>
      ids.has(carpeta.id) ? { ...carpeta, archivada: true, archivadaEn: ahora } : carpeta,
    ),
    modelos: indice.modelos.map((modelo) =>
      modelo.carpetaId && ids.has(modelo.carpetaId)
        ? { ...modelo, archivado: true, archivadoEn: ahora }
        : modelo,
    ),
  };
}

export function restaurarCarpeta(indice: WorkspaceIndice, carpetaId: Id): WorkspaceIndice {
  const ids = idsCarpetasDescendientes(indice, carpetaId);
  ids.add(carpetaId);
  return {
    ...indice,
    carpetas: indice.carpetas.map((carpeta) => ids.has(carpeta.id) ? sinArchivadoCarpeta(carpeta) : carpeta),
    modelos: indice.modelos.map((modelo) =>
      modelo.carpetaId && ids.has(modelo.carpetaId) ? sinArchivado(modelo) : modelo,
    ),
  };
}

export function rutaTexto(indice: WorkspaceIndice, carpetaId: Id | null): string {
  const partes = [...BREADCRUMB_RAIZ, ...rutaDeCarpeta(indice, carpetaId).map((c) => c.nombre)];
  return partes.join(" / ");
}

function idsCarpetasDescendientes(indice: WorkspaceIndice, carpetaId: Id): Set<Id> {
  const ids = new Set<Id>();
  const visitar = (padreId: Id) => {
    for (const carpeta of indice.carpetas) {
      if (carpeta.padreId !== padreId || ids.has(carpeta.id)) continue;
      ids.add(carpeta.id);
      visitar(carpeta.id);
    }
  };
  visitar(carpetaId);
  return ids;
}

function sinArchivado<T extends { archivado?: boolean; archivadoEn?: string }>(value: T): T {
  const { archivado: _archivado, archivadoEn: _archivadoEn, archivadoAuto: _archivadoAuto, ...resto } = value as T & { archivadoAuto?: boolean };
  return resto as T;
}

function sinBiblioteca(modelo: ModeloIndice): ModeloIndice {
  const { esBiblioteca: _esBiblioteca, ...resto } = modelo;
  return resto;
}

function sinApunte(modelo: ModeloIndice): ModeloIndice {
  const { esApunte: _esApunte, ...resto } = modelo;
  return resto;
}

function sinArchivadoCarpeta(carpeta: CarpetaIndice): CarpetaIndice {
  const { archivada: _archivada, archivadaEn: _archivadaEn, ...resto } = carpeta;
  return resto;
}

function fechaUsoModelo(modelo: ModeloIndice, resumen: ResumenModeloPersistido | undefined): string | null {
  return modelo.ultimoUso ?? resumen?.ultimaApertura ?? resumen?.actualizadoEn ?? resumen?.creadoEn ?? null;
}
