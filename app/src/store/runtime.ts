import { crearAutosalvado, type AutosalvadoControl } from "../persistencia/autosalvado";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import type { Aviso } from "../modelo/validaciones";
import type { Abanico, Apariencia, ExtremoEnlace, Id, Modelo, Opd, Pestana, PestanaId } from "../modelo/tipos";
import { construirDescriptorMapa, type CriterioResaltado } from "../canvas/mapaSistema";
import { dentroDeApariencia } from "../modelo/layout";
import { aparienciaDeEntidadEnOpd, opdIdDeEntidadVisible } from "../modelo/politicaApariciones";
import { obtenerRefinamiento, refinaA } from "../modelo/refinamientos";
import { puedeEditarAbanicoEnOpd, sincronizarAbanicos } from "../modelo/abanicos";
import { sincronizarPuertosTodosLosOpd } from "../modelo/operaciones";
import {
  idPuertoAbanicoDerivado,
  proyeccionesCanonicasEnlaceExternoRefinado,
} from "../modelo/operaciones/refinamiento";
import type { ResumenModeloPersistido } from "../persistencia/modelos";
import {
  cargarWorkspaceBackend,
  guardarWorkspaceBackend,
  persistenciaBackendHabilitada,
} from "../persistencia/backend";
import {
  indiceVacio,
  workspaceDesdeModelo,
  type MapaWorkspace,
  type WorkspaceIndice,
  type WorkspacePersistido,
} from "../persistencia/workspace";
import {
  agregar as seleccionAgregar,
  quitar as seleccionQuitar,
  setSeleccion as seleccionSet,
  todasDelOpd,
  toggle as seleccionToggle,
  vacia as seleccionVacia,
  type ModoSeleccion,
} from "../canvas/seleccionMultiple";
import {
  alinearEnlacesAbajo,
  alinearEnlacesArriba,
  alinearEnlacesDerecha,
  alinearEnlacesIzquierda,
  conectarMultiAlTodo,
  copiarSeleccion,
  eliminarBatch,
  nudgeApariencias,
  nudgeEnlaces,
  pegarSeleccion,
} from "../canvas/operacionesBatch";
import type { StoreApi } from "zustand/vanilla";
import { etiquetaPestana } from "./pestanas";
import { RUNTIME_EFFECTS_DEFAULT, type RuntimeEffects } from "./runtimeEffects";
import type { OpmStore } from "./tipos";
import {
  captureSessionEpoch,
  isSessionEpochCurrent,
} from "./sessionEpoch";

export const UNDO_LIMIT = 100;
export const WS_KEY = "workspace";
export const PREF_MOSTRAR_ARCHIVADOS_KEY = "mostrarArchivados";
export const PREF_MOSTRAR_VERSIONES_KEY = "mostrarVersiones";
export const PORTAPAPELES_WORKSPACE_TTL_MS = 5 * 60 * 1000;
export const ANCHO_PANEL_ARBOL_DEFAULT = 210;
export const ANCHO_PANEL_ARBOL_MIN = 160;
export const ANCHO_PANEL_ARBOL_MAX = 600;
// BUG-20260511T225343Z-696858: inspector derecho resizable via DivisorPanel.
// Defaults proporcionales a anchoPanelArbol (240/160/600 → 300/240/560).
export const ANCHO_PANEL_INSPECTOR_DEFAULT = 360;
export const ANCHO_PANEL_INSPECTOR_MIN = 240;
export const ANCHO_PANEL_INSPECTOR_MAX = 560;
// BUG-20260607T215222Z-624056: panel OPL izquierdo resizable horizontalmente.
export const ANCHO_PANEL_OPL_LEFT_DEFAULT = 240;
export const ANCHO_PANEL_OPL_LEFT_MIN = 160;
export const ANCHO_PANEL_OPL_LEFT_MAX = 400;

let snapshotGuardado = "";
let undoStack: Modelo[] = [];
let redoStack: Modelo[] = [];
let autosalvadoControl: AutosalvadoControl | null = null;
let pollRevisionTimer: ReturnType<typeof setInterval> | null = null;
let storeApi: StoreApi<OpmStore> | null = null;
let runtimeEffects: RuntimeEffects = RUNTIME_EFFECTS_DEFAULT;
let workspaceWriteQueue: Promise<void> = Promise.resolve();
let persistedWorkspaceIndex: WorkspaceIndice | null = null;

export function conectarRuntimeStore(api: StoreApi<OpmStore>): void { storeApi = api; }
export function inicializarRuntimeStore(api: StoreApi<OpmStore>, modelo: Modelo): void {
  storeApi = api;
  undoStack = [];
  redoStack = [];
  autosalvadoControl = null;
  resetWorkspacePersistenceRuntime();
  snapshotGuardado = exportarModelo(sincronizarPuertosTodosLosOpd(modelo));
}
export function resetWorkspacePersistenceRuntime(): void {
  workspaceWriteQueue = Promise.resolve();
  persistedWorkspaceIndex = null;
}
export function obtenerRuntimeEffects(): RuntimeEffects { return runtimeEffects; }
export function fijarRuntimeEffects(effects: RuntimeEffects): void { runtimeEffects = effects; }
export function resetRuntimeEffects(): void { runtimeEffects = RUNTIME_EFFECTS_DEFAULT; }
function estadoActual(): OpmStore | null { return storeApi?.getState() ?? null; }
export function obtenerEstadoStore(): OpmStore { const estado = estadoActual(); if (!estado) throw new Error("Store OPM no inicializado"); return estado; }
export function setEstadoStore(partial: Partial<OpmStore>): void { storeApi?.setState(partial); }
export function inicializarSnapshot(modelo: Modelo): void { snapshotGuardado = exportarModelo(sincronizarPuertosTodosLosOpd(modelo)); }
export function marcarSnapshotModelo(modelo: Modelo): void { snapshotGuardado = exportarModelo(sincronizarPuertosTodosLosOpd(modelo)); }
export function marcarSnapshotJson(snapshotJson: string): void { snapshotGuardado = snapshotJson; }
export function obtenerAutosalvadoControl(): AutosalvadoControl | null { return autosalvadoControl; }
export function fijarAutosalvadoControl(control: AutosalvadoControl | null): void { autosalvadoControl = control; }
// A′-vitrina: singleton del poll de revisión (patrón autosalvadoControl).
export function obtenerPollRevisionTimer(): ReturnType<typeof setInterval> | null { return pollRevisionTimer; }
export function fijarPollRevisionTimer(timer: ReturnType<typeof setInterval> | null): void { pollRevisionTimer = timer; }
/**
 * A′-vitrina: fija la «base» de revisión de un modelo. Compartido por los
 * puntos donde el store aprende una revisión fresca del backend (guardar,
 * cargar, autosalvar). No-op si la revisión es indefinida.
 */
export function conBaseRevision(mapa: Record<string, number>, id: string, revision: number | undefined): Record<string, number> {
  if (typeof revision !== "number") return mapa;
  if ((mapa[id] ?? -1) > revision) return mapa;
  return { ...mapa, [id]: revision };
}
function clonarModeloRuntime(modelo: Modelo): Modelo { if (typeof structuredClone === "function") return structuredClone(modelo); return JSON.parse(JSON.stringify(modelo)) as Modelo; }

export function entidadNueva(previo: Modelo, siguiente: Modelo): Id | null {
  const previos = new Set(Object.keys(previo.entidades));
  return Object.keys(siguiente.entidades).find((id) => !previos.has(id)) ?? null;
}

export function enlaceNuevo(previo: Modelo, siguiente: Modelo): Id | null {
  const previos = new Set(Object.keys(previo.enlaces));
  return Object.keys(siguiente.enlaces).find((id) => !previos.has(id)) ?? null;
}

export type SetStore = (partial: Partial<OpmStore>) => void;
export type GetStore = () => OpmStore;

export function activarPestanaNueva(set: SetStore, get: GetStore, pestana: Pestana, mensaje: string): void {
  const estadoActual = sincronizarPestanaActivaEnLista(get());
  const siguiente = { pestanas: [...estadoActual, pestana], activa: pestana.id };
  activarEstadoPestanas(set, siguiente, mensaje);
}

export function activarEstadoPestanas(set: SetStore, estado: { pestanas: Pestana[]; activa: PestanaId }, mensaje: string | null): void {
  const pestana = estado.pestanas.find((item) => item.id === estado.activa);
  if (!pestana) return;
  snapshotGuardado = pestana.snapshotJson ?? exportarModelo(pestana.modelo);
  undoStack = [...pestana.historialUndo];
  redoStack = [];
  set(estadoModelo(pestana.modelo, {
    pestanasAbiertas: estado.pestanas,
    pestanaActivaId: pestana.id,
    opdActivoId: opdActivoSeguro(pestana.modelo, pestana.modelo.opdRaizId),
    seleccionId: null,
    seleccionados: pestana.seleccionadosPestana ?? [],
    modoSeleccion: (pestana.seleccionadosPestana?.length ?? 0) > 1 ? "multi" : "simple",
    enlaceSeleccionId: null,
    estadoSeleccionId: null,
    modoEnlace: null,
    eligiendoOrigenEnlace: false,
    modoCreacion: null,
    nuevaCosaPendiente: null,
    colaRenombradoPendiente: [],
    hoverOplRef: null,
    modeloPersistidoId: pestana.modeloId,
    descripcionModeloLocal: pestana.descripcionModeloLocal ?? "",
    workspaceLocal: workspaceDesdeModelo(pestana.modelo, pestana.modeloId, pestana.descripcionModeloLocal ?? ""),
    vistaMapaActiva: false,
    descriptorMapaCache: null,
    dirty: pestana.dirty,
    dialogoCargarModeloAbierto: false,
    menuPrincipalAbierto: false,
    mensaje,
  }));
  // Centinela de Drift (corte Anclaje α): tras montar el estado de la pestaña, evalúa el
  // drift de las cosas ancladas contra el backend persistido. Asíncrono y sin await: no
  // bloquea el render inicial; el marcador aparece cuando resuelve. Si nada está anclado,
  // `cargarYEvaluarDrift` termina barato con `driftMap: {}`.
  // Spec §3 (Disparo de evaluación). No cambia la firma de `activarEstadoPestanas`.
  void storeApi?.getState().cargarYEvaluarDrift();
}

export function sincronizarPestanaActivaEnLista(state: OpmStore): Pestana[] {
  return state.pestanasAbiertas.map((pestana) => {
    if (pestana.id !== state.pestanaActivaId) return pestana;
    // P0-1: la etiqueta de la pestaña activa siempre refleja la identidad
    // unificada del modelo (helper `etiquetaPestana`). Antes la etiqueta de
    // pestañas no persistidas quedaba estancada en "Modelo (No guardado)"
    // aunque el modelo tuviera nombre real (fixture, import).
    const etiqueta = etiquetaPestana({ nombre: state.modelo.nombre, modeloId: state.modeloPersistidoId });
    return {
      ...pestana,
      modelo: clonarModeloRuntime(state.modelo),
      dirty: state.dirty,
      historialUndo: [...undoStack],
      cursorUndo: undoStack.length,
      seleccionadosPestana: [...state.seleccionados],
      vistaMapaActivaPestana: state.vistaMapaActiva,
      modeloId: state.modeloPersistidoId,
      descripcionModeloLocal: state.descripcionModeloLocal,
      etiqueta,
      ...(state.dirty && pestana.snapshotJson === undefined ? {} : { snapshotJson: state.dirty ? pestana.snapshotJson : exportarModelo(state.modelo) }),
    };
  });
}

export function pestanaReemplazable(pestana: Pestana): boolean {
  if (pestana.cargadoDesde !== "nuevo") return false;
  if (pestana.modeloId !== null) return false;
  if (pestana.dirty) return false;
  return (
    Object.keys(pestana.modelo.entidades).length === 0 &&
    Object.keys(pestana.modelo.enlaces).length === 0 &&
    Object.keys(pestana.modelo.estados).length === 0
  );
}

export function validarSubprocesoTimeline(
  modelo: Modelo,
  opdId: Id,
  aparienciaId: Id,
): { ok: true; apariencia: Apariencia; contorno: Apariencia } | { ok: false; error: string } {
  const opd = modelo.opds[opdId];
  if (!opd) return { ok: false, error: `OPD no existe: ${opdId}` };
  if (!opd.padreId || !modelo.opds[opd.padreId]) {
    return { ok: false, error: "Timeline disponible sólo en OPDs hijos" };
  }
  const contorno = Object.values(opd.apariencias).find((apariencia) => {
    const entidad = modelo.entidades[apariencia.entidadId];
    return entidad?.tipo === "proceso" && obtenerRefinamiento(entidad, "descomposicion")?.opdId === opdId;
  });
  if (!contorno) return { ok: false, error: "Timeline requiere una descomposición de proceso activa" };
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) return { ok: false, error: `Apariencia no existe: ${aparienciaId}` };
  const entidad = modelo.entidades[apariencia.entidadId];
  if (!entidad || entidad.tipo !== "proceso" || apariencia.entidadId === contorno.entidadId) {
    return { ok: false, error: "Timeline sólo reordena subprocesos internos" };
  }
  if (!dentroDeApariencia(apariencia, contorno)) {
    return { ok: false, error: "El subproceso no pertenece al contorno de descomposición" };
  }
  return { ok: true, apariencia, contorno };
}

export function limitar(valor: number, minimo: number, maximo: number): number {
  return Math.max(minimo, Math.min(maximo, valor));
}

export function limitarAnchoPanelArbol(valor: number | undefined): number {
  if (!Number.isFinite(valor)) return ANCHO_PANEL_ARBOL_DEFAULT;
  return limitar(Math.round(valor as number), ANCHO_PANEL_ARBOL_MIN, ANCHO_PANEL_ARBOL_MAX);
}

export function limitarAnchoPanelInspector(valor: number | undefined): number {
  if (!Number.isFinite(valor)) return ANCHO_PANEL_INSPECTOR_DEFAULT;
  return limitar(Math.round(valor as number), ANCHO_PANEL_INSPECTOR_MIN, ANCHO_PANEL_INSPECTOR_MAX);
}

export function limitarAnchoPanelOpleft(valor: number | undefined): number {
  if (!Number.isFinite(valor)) return ANCHO_PANEL_OPL_LEFT_DEFAULT;
  return limitar(Math.round(valor as number), ANCHO_PANEL_OPL_LEFT_MIN, ANCHO_PANEL_OPL_LEFT_MAX);
}

export function actualizarPreferenciasUi(
  indice: WorkspaceIndice,
  patch: NonNullable<WorkspaceIndice["preferenciasUi"]>,
): WorkspaceIndice {
  return {
    ...indice,
    preferenciasUi: {
      ...(indice.preferenciasUi ?? {}),
      ...patch,
    },
  };
}

export function mapaWorkspaceDesdeEstado(estado: OpmStore, patch: Partial<MapaWorkspace> = {}): MapaWorkspace {
  return {
    zoom: estado.mapaZoom,
    panX: estado.mapaPanX,
    panY: estado.mapaPanY,
    profundidadMaxima: estado.mapaProfundidadMaxima,
    subarbolRaizId: estado.mapaSubarbolRaizId,
    criterioResaltado: estado.mapaCriterioResaltado,
    autoRefresh: estado.mapaAutoRefresh,
    ...patch,
  };
}

export function persistirPreferenciasMapa(estado: OpmStore, patch: Partial<MapaWorkspace>): WorkspaceIndice {
  if (!estado.modeloPersistidoId) return estado.indice;
  const mapa = mapaWorkspaceDesdeEstado(estado, patch);
  const existe = estado.indice.modelos.some((modelo) => modelo.id === estado.modeloPersistidoId);
  const modelos = existe
    ? estado.indice.modelos.map((modelo) => modelo.id === estado.modeloPersistidoId ? { ...modelo, mapa } : modelo)
    : [...estado.indice.modelos, { id: estado.modeloPersistidoId, carpetaId: estado.carpetaActualId, mapa }];
  const indice = { ...estado.indice, modelos };
  escribirIndiceWorkspace(indice);
  return indice;
}

export function leerPreferenciasMapa(indice: WorkspaceIndice, modeloId: Id | null): Pick<
  OpmStore,
  "mapaZoom" |
  "mapaPanX" |
  "mapaPanY" |
  "mapaProfundidadMaxima" |
  "mapaSubarbolRaizId" |
  "mapaCriterioResaltado" |
  "mapaAutoRefresh"
> {
  const mapa = modeloId ? indice.modelos.find((modelo) => modelo.id === modeloId)?.mapa : undefined;
  return {
    mapaZoom: limitar(typeof mapa?.zoom === "number" ? mapa.zoom : 1, 0.25, 2),
    mapaPanX: typeof mapa?.panX === "number" ? Math.round(mapa.panX) : 0,
    mapaPanY: typeof mapa?.panY === "number" ? Math.round(mapa.panY) : 0,
    mapaProfundidadMaxima: typeof mapa?.profundidadMaxima === "number" ? Math.max(1, Math.floor(mapa.profundidadMaxima)) : null,
    mapaSubarbolRaizId: typeof mapa?.subarbolRaizId === "string" ? mapa.subarbolRaizId : null,
    mapaCriterioResaltado: esCriterioResaltado(mapa?.criterioResaltado) ? mapa.criterioResaltado : "ninguno",
    mapaAutoRefresh: typeof mapa?.autoRefresh === "boolean" ? mapa.autoRefresh : true,
  };
}

export function esCriterioResaltado(value: unknown): value is CriterioResaltado {
  return value === "predominanciaProceso" ||
    value === "predominanciaObjeto" ||
    value === "tieneEstados" ||
    value === "raiz" ||
    value === "ninguno";
}

export function hermanosOrdenados(modelo: Modelo, padreId: Id | null): Opd[] {
  return Object.values(modelo.opds)
    .filter((opd) => opd.padreId === padreId)
    .sort((a, b) => {
      if (a.ordenLocal !== undefined && b.ordenLocal !== undefined) return a.ordenLocal - b.ordenLocal;
      if (a.ordenLocal !== undefined) return -1;
      if (b.ordenLocal !== undefined) return 1;
      return a.nombre.localeCompare(b.nombre, "es-CL") || a.id.localeCompare(b.id, "es-CL");
    });
}

export function opdActivoEsSoloLectura(modelo: Modelo, opdActivoId: Id): boolean {
  return modelo.opds[opdActivoId]?.vista?.readOnly === true;
}

export function mensajeSoloLecturaOpdActivo(modelo: Modelo, opdActivoId: Id): string | null {
  return opdActivoEsSoloLectura(modelo, opdActivoId)
    ? "Vista derivada en solo lectura. Cambia al OPD fuente para editar."
    : null;
}

/**
 * Ley silencio-cero (auditoría UX 2026-06-12, C-1): el bloqueo de edición
 * siempre HABLA, y nombra su causa real. La simulación va primero porque
 * fuerza `readOnly=true` — sin este orden el usuario recibiría el genérico
 * de solo-lectura estando en un modo del que se sale con ⎋.
 */
export function mensajeBloqueoEdicion(
  estado: Pick<OpmStore, "readOnly" | "contextoSimulacion" | "modelo" | "opdActivoId">,
): string | null {
  if (estado.contextoSimulacion) {
    return "Modo simulación: el modelo es de solo lectura. Sal con ⎋ para editar.";
  }
  if (estado.readOnly) {
    return "Modelo en solo lectura. Usa Guardar como para crear copia editable.";
  }
  return mensajeSoloLecturaOpdActivo(estado.modelo, estado.opdActivoId);
}

/**
 * Devuelve `true` solo si el cambio quedó aplicado (o no había cambio
 * semántico que aplicar). `false` = bloqueado por solo-lectura — los
 * callsites NO deben emitir flashes de éxito en ese caso.
 */
export function commitModelo(
  set: (partial: Partial<OpmStore>) => void,
  previo: Modelo,
  siguiente: Modelo,
  extra: Partial<OpmStore> = {},
): boolean {
  const estado = storeApi?.getState();
  const bloqueo = estado ? mensajeBloqueoEdicion(estado) : null;
  if (bloqueo) {
    set({ mensaje: bloqueo });
    return false;
  }
  const previoSincronizado = sincronizarPuertosTodosLosOpd(previo);
  const sincronizado = sincronizarPuertosTodosLosOpd(sincronizarAbanicos(siguiente));
  const bloqueoAbanico = estado
    ? mensajeBloqueoCambioAbanicoHeredado(previoSincronizado, sincronizado, estado.opdActivoId)
    : null;
  if (bloqueoAbanico) {
    set({ mensaje: bloqueoAbanico });
    return false;
  }
  if (previoSincronizado === sincronizado || exportarModelo(previoSincronizado) === exportarModelo(sincronizado)) {
    set(extra);
    return true;
  }
  undoStack = [...undoStack, previoSincronizado].slice(-UNDO_LIMIT);
  redoStack = [];
  const extraFinal: Partial<OpmStore> = { ...extra };
  // P0 ronda 4: dirtyModelo por defecto true (cambio semantico). Si el
  // callsite paso dirtyModelo explicitamente (ej. layout puro), se respeta.
  if (!("dirtyModelo" in extraFinal)) {
    extraFinal.dirtyModelo = true;
  }
  const estadoActual = obtenerEstadoStore();
  if (
    estadoActual.vistaMapaActiva &&
    estadoActual.mapaAutoRefresh &&
    !("descriptorMapaCache" in extraFinal) &&
    cambiaronOpds(previoSincronizado, sincronizado)
  ) {
    extraFinal.descriptorMapaCache = construirDescriptorMapa(sincronizado);
  }
  set(estadoModelo(sincronizado, extraFinal));
  return true;
}

function mensajeBloqueoCambioAbanicoHeredado(
  previo: Modelo,
  siguiente: Modelo,
  opdActivoId: Id,
  origen: "edicion" | "historial" = "edicion",
): string | null {
  const abanicoIds = new Set([
    ...Object.keys(previo.abanicos ?? {}),
    ...Object.keys(siguiente.abanicos ?? {}),
  ]);
  for (const abanicoId of abanicoIds) {
    const abanicoPrevio = previo.abanicos?.[abanicoId];
    const abanicoSiguiente = siguiente.abanicos?.[abanicoId];
    const abanico = abanicoPrevio ?? abanicoSiguiente;
    if (!abanico) continue;
    if (puedeEditarAbanicoEnOpd(abanico, opdActivoId)) continue;
    const introducePropietarioConAbanico =
      abanicoPrevio === undefined &&
      abanicoSiguiente !== undefined &&
      previo.opds[abanico.opdId] === undefined &&
      siguiente.opds[abanico.opdId] !== undefined;
    if (introducePropietarioConAbanico) continue;
    if (esTransicionAbanicoAutomaticoDesdeActivo(
      previo,
      siguiente,
      abanicoPrevio,
      abanicoSiguiente,
      opdActivoId,
      origen,
    )) continue;
    const cambioAgrupador = JSON.stringify(abanicoPrevio) !== JSON.stringify(abanicoSiguiente);
    const enlaceIds = new Set([
      ...(abanicoPrevio ? idsRamasCustodiadas(previo, abanicoPrevio) : []),
      ...(abanicoSiguiente ? idsRamasCustodiadas(siguiente, abanicoSiguiente) : []),
    ]);
    const cambioRama = [...enlaceIds].some((enlaceId) => (
      firmaRamaAbanico(previo, enlaceId) !== firmaRamaAbanico(siguiente, enlaceId)
    ));
    if (!cambioAgrupador && !cambioRama) continue;
    const propietario = previo.opds[abanico.opdId]?.nombre ?? siguiente.opds[abanico.opdId]?.nombre ?? abanico.opdId;
    return `Este abanico pertenece a '${propietario}'. Cambia a ese OPD para editarlo.`;
  }
  return null;
}

function esTransicionAbanicoAutomaticoDesdeActivo(
  previo: Modelo,
  siguiente: Modelo,
  abanicoPrevio: Abanico | undefined,
  abanicoSiguiente: Abanico | undefined,
  opdActivoId: Id,
  origen: "edicion" | "historial",
): boolean {
  const referencia = abanicoPrevio ?? abanicoSiguiente;
  if (!referencia) return false;
  const opdHijoId = referencia.opdId;
  if (abanicoPrevio === undefined && abanicoSiguiente !== undefined) {
    return previo.opds[opdHijoId]?.padreId === opdActivoId &&
      esProyeccionAbanicoAutomatico(siguiente, abanicoSiguiente, opdActivoId, opdHijoId);
  }
  if (abanicoPrevio !== undefined && abanicoSiguiente !== undefined) {
    return esProyeccionAbanicoAutomatico(previo, abanicoPrevio, opdActivoId, opdHijoId) &&
      esProyeccionAbanicoAutomatico(siguiente, abanicoSiguiente, opdActivoId, opdHijoId);
  }
  if (abanicoPrevio === undefined || abanicoSiguiente !== undefined) return false;
  return esProyeccionAbanicoAutomatico(previo, abanicoPrevio, opdActivoId, opdHijoId) &&
    esRetiroProyeccionPuro(previo, siguiente, abanicoPrevio) &&
    (
      origen === "historial" ||
      !fuenteProyeccionSigueVigente(previo, siguiente, abanicoPrevio, opdActivoId) ||
      existeProyeccionSucesora(previo, siguiente, abanicoPrevio, opdActivoId)
    );
}

function esProyeccionAbanicoAutomatico(
  modelo: Modelo,
  abanico: Abanico,
  opdActivoId: Id,
  opdHijoId: Id,
): boolean {
  const opdHijo = modelo.opds[opdHijoId];
  if (!opdHijo || opdHijo.padreId !== opdActivoId || abanico.opdId !== opdHijoId || abanico.decision) return false;
  if (abanico.enlaceIds.length < 2 || new Set(abanico.enlaceIds).size !== abanico.enlaceIds.length) return false;

  const enlacesPadreIds: Id[] = [];
  let refinamientoId: Id | null = null;
  for (const enlaceId of abanico.enlaceIds) {
    const enlaceHijo = modelo.enlaces[enlaceId];
    const derivado = enlaceHijo?.derivado;
    if (
      !enlaceHijo ||
      !tieneFormaEnlaceDerivadoAutomatico(enlaceHijo) ||
      derivado?.tipo !== "enlace-externo-refinamiento" ||
      derivado.origen !== "automatico"
    ) return false;
    if (refinamientoId === null) refinamientoId = derivado.refinamientoId;
    if (derivado.refinamientoId !== refinamientoId) return false;
    const enlacePadre = modelo.enlaces[derivado.enlacePadreId];
    if (
      !enlacePadre ||
      enlacePadre.tipo !== enlaceHijo.tipo ||
      enlacePadre.etiqueta !== enlaceHijo.etiqueta ||
      !proyeccionesCanonicasEnlaceExternoRefinado(modelo, opdHijoId, enlacePadre.id).some((proyeccion) => (
        coincideExtremoProyectado(enlaceHijo.origenId, proyeccion.origenId, abanico, "origen") &&
        coincideExtremoProyectado(enlaceHijo.destinoId, proyeccion.destinoId, abanico, "destino")
      ))
    ) return false;
    enlacesPadreIds.push(enlacePadre.id);
  }
  const refinada = refinamientoId ? modelo.entidades[refinamientoId] : undefined;
  if (
    !refinamientoId ||
    !refinada ||
    new Set(enlacesPadreIds).size !== enlacesPadreIds.length ||
    !refinaA(refinada, opdHijoId)
  ) return false;

  const abanicoPadre = buscarFuenteProyeccion(modelo, abanico, opdActivoId, refinamientoId, enlacesPadreIds);
  return !!abanicoPadre &&
    abanico.puertoComun.portId === idPuertoAbanicoDerivado(abanicoPadre.id, opdHijoId, abanico.puertoComun.lado) &&
    idsEnBijeccion(abanico.enlaceIds, enlacesAutomaticosVisiblesDeFuente(modelo, opdHijoId, abanicoPadre));
}

function tieneFormaEnlaceDerivadoAutomatico(enlace: Modelo["enlaces"][Id]): boolean {
  if (!enlace) return false;
  const camposPermitidos = new Set(["id", "tipo", "origenId", "destinoId", "etiqueta", "derivado"]);
  return Object.keys(enlace).every((campo) => camposPermitidos.has(campo));
}

function coincideExtremoProyectado(
  actual: ExtremoEnlace,
  esperado: ExtremoEnlace,
  abanico: Abanico,
  lado: "origen" | "destino",
): boolean {
  if (actual.kind !== esperado.kind || actual.id !== esperado.id) return false;
  const portIdEsperado = abanico.puertoComun.lado === lado
    ? abanico.puertoComun.portId
    : esperado.portId;
  return actual.portId === portIdEsperado;
}

function esRetiroProyeccionPuro(previo: Modelo, siguiente: Modelo, abanico: Abanico): boolean {
  return abanico.enlaceIds.every((enlaceId) => {
    const enlacePrevio = previo.enlaces[enlaceId];
    const enlaceSiguiente = siguiente.enlaces[enlaceId];
    return !!enlacePrevio && (
      enlaceSiguiente === undefined || JSON.stringify(enlacePrevio) === JSON.stringify(enlaceSiguiente)
    );
  });
}

function fuenteProyeccionSigueVigente(
  previo: Modelo,
  siguiente: Modelo,
  abanicoHijo: Abanico,
  opdActivoId: Id,
): boolean {
  const refinamientoId = previo.enlaces[abanicoHijo.enlaceIds[0]!]?.derivado?.refinamientoId;
  const refinada = refinamientoId ? siguiente.entidades[refinamientoId] : undefined;
  if (!refinada || !refinaA(refinada, abanicoHijo.opdId)) return false;
  return Object.values(siguiente.abanicos ?? {}).some((abanicoPadre) => (
    abanicoPadre.opdId === opdActivoId &&
    abanicoPadre.puertoComun.entidadId === refinamientoId
  ));
}

function existeProyeccionSucesora(
  previo: Modelo,
  siguiente: Modelo,
  abanicoHijoPrevio: Abanico,
  opdActivoId: Id,
): boolean {
  const fuentePrevia = fuenteDeProyeccion(previo, abanicoHijoPrevio, opdActivoId);
  if (!fuentePrevia) return false;
  const mismaFuenteVigente = siguiente.abanicos?.[fuentePrevia.id]?.opdId === opdActivoId;
  return Object.values(siguiente.abanicos ?? {}).some((candidato) => {
    if (
      candidato.opdId !== abanicoHijoPrevio.opdId ||
      !esProyeccionAbanicoAutomatico(siguiente, candidato, opdActivoId, abanicoHijoPrevio.opdId)
    ) return false;
    const fuenteSiguiente = fuenteDeProyeccion(siguiente, candidato, opdActivoId);
    if (!fuenteSiguiente) return false;
    return mismaFuenteVigente
      ? fuenteSiguiente.id === fuentePrevia.id
      : fuenteSiguiente.puertoComun.entidadId === fuentePrevia.puertoComun.entidadId;
  });
}

function fuenteDeProyeccion(modelo: Modelo, abanicoHijo: Abanico, opdActivoId: Id): Abanico | undefined {
  const derivaciones = abanicoHijo.enlaceIds.map((enlaceId) => modelo.enlaces[enlaceId]?.derivado);
  const refinamientoId = derivaciones[0]?.refinamientoId;
  if (!refinamientoId || derivaciones.some((derivacion) => derivacion?.refinamientoId !== refinamientoId)) return undefined;
  const enlacesPadreIds = derivaciones.flatMap((derivacion) => derivacion?.enlacePadreId ? [derivacion.enlacePadreId] : []);
  return buscarFuenteProyeccion(modelo, abanicoHijo, opdActivoId, refinamientoId, enlacesPadreIds);
}

function buscarFuenteProyeccion(
  modelo: Modelo,
  abanicoHijo: Abanico,
  opdActivoId: Id,
  refinamientoId: Id,
  enlacesPadreIds: readonly Id[],
): Abanico | undefined {
  return Object.values(modelo.abanicos ?? {}).find((candidato) => (
    candidato.id !== abanicoHijo.id &&
    candidato.opdId === opdActivoId &&
    candidato.operador === abanicoHijo.operador &&
    candidato.puertoComun.entidadId === refinamientoId &&
    idsEnBijeccion(candidato.enlaceIds, enlacesPadreIds)
  ));
}

function idsRamasCustodiadas(modelo: Modelo, abanico: Abanico): Id[] {
  const opdPadreId = modelo.opds[abanico.opdId]?.padreId;
  if (!opdPadreId) return abanico.enlaceIds;
  const fuente = fuenteDeProyeccion(modelo, abanico, opdPadreId);
  if (!fuente) return abanico.enlaceIds;
  return [...abanico.enlaceIds, ...enlacesAutomaticosVisiblesDeFuente(modelo, abanico.opdId, fuente)];
}

function enlacesAutomaticosVisiblesDeFuente(modelo: Modelo, opdHijoId: Id, fuente: Abanico): Id[] {
  const opdHijo = modelo.opds[opdHijoId];
  if (!opdHijo) return [];
  const enlacesFuente = new Set(fuente.enlaceIds);
  return Object.values(opdHijo.enlaces).flatMap((apariencia) => {
    const enlace = modelo.enlaces[apariencia.enlaceId];
    const derivado = enlace?.derivado;
    return enlace &&
      derivado?.tipo === "enlace-externo-refinamiento" &&
      derivado.origen === "automatico" &&
      derivado.refinamientoId === fuente.puertoComun.entidadId &&
      enlacesFuente.has(derivado.enlacePadreId)
      ? [enlace.id]
      : [];
  });
}

function idsEnBijeccion(a: readonly Id[], b: readonly Id[]): boolean {
  if (a.length !== b.length || new Set(a).size !== a.length || new Set(b).size !== b.length) return false;
  const idsB = new Set(b);
  return a.every((id) => idsB.has(id));
}

function firmaRamaAbanico(modelo: Modelo, enlaceId: Id): string {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return "ausente";
  return JSON.stringify({
    tipo: enlace.tipo,
    origenId: enlace.origenId,
    destinoId: enlace.destinoId,
    estadoEntradaId: enlace.estadoEntradaId,
    estadoSalidaId: enlace.estadoSalidaId,
    modificador: enlace.modificador,
    subtipoModificador: enlace.subtipoModificador,
    probabilidad: enlace.probabilidad,
    derivado: enlace.derivado,
  });
}

export function cambiaronOpds(previo: Modelo, siguiente: Modelo): boolean {
  return JSON.stringify(previo.opds) !== JSON.stringify(siguiente.opds);
}

export function resetHistorial(modelo: Modelo): void {
  const sincronizado = sincronizarPuertosTodosLosOpd(modelo);
  undoStack = [];
  redoStack = [];
  snapshotGuardado = exportarModelo(sincronizado);
}

export function listarModelosGuardadosSeguro(): ResumenModeloPersistido[] {
  return [];
}

export function estadoModelo(modelo: Modelo, extra: Partial<OpmStore> = {}): Partial<OpmStore> {
  const modeloSincronizado = sincronizarPuertosTodosLosOpd(modelo);
  const dirty = extra.dirty ?? (exportarModelo(modeloSincronizado) !== snapshotGuardado);
  // P0 ronda 4: dirtyModelo solo se activa con cambios semanticos.
  // Layout puro (drag, nudge, auto-layout) conserva el valor actual via
  // extra.dirtyModelo explicito. commitModelo setea extra.dirtyModelo=true
  // por defecto para mutaciones semanticas. Para cargas y modelos nuevos
  // (nuevoModelo, cargarLocal, importarJson) que llaman
  // estadoModelo tras resetHistorial, el modelo recien cargado no es dirty
  // ni semantica ni visualmente: derivamos dirtyModelo de dirty (false).
  // BUG-20260512T044458Z-d4931c: el fallback previo `?? true` dejaba un
  // modelo recien cargado como dirtyModelo=true y disparaba el modal de
  // "Hay cambios sin guardar" en cualquier accion confirmarSiDirty posterior.
  const dirtyModelo = extra.dirtyModelo ?? dirty;
  const actual = estadoActual();
  const pestanasAbiertas = extra.pestanasAbiertas ?? (
    actual?.pestanasAbiertas
      ? actual.pestanasAbiertas.map((pestana) => {
          if (pestana.id !== actual.pestanaActivaId) return pestana;
          const modeloId = extra.modeloPersistidoId !== undefined ? extra.modeloPersistidoId : actual.modeloPersistidoId;
          const descripcion = extra.descripcionModeloLocal !== undefined ? extra.descripcionModeloLocal : actual.descripcionModeloLocal;
          // P0-1: la etiqueta se reconcilia desde modelo.nombre + persistencia
          // en CADA actualización del estado del modelo, no solo cuando hay
          // modeloId. Antes, fixtures/imports quedaban con el placeholder
          // "Modelo (No guardado)" hasta el primer guardado.
          const etiqueta = etiquetaPestana({ nombre: modeloSincronizado.nombre, modeloId });
          return {
            ...pestana,
            modelo: clonarModeloRuntime(modeloSincronizado),
            dirty,
            historialUndo: [...undoStack],
            cursorUndo: undoStack.length,
            modeloId,
            descripcionModeloLocal: descripcion,
            etiqueta,
            ...(dirty && pestana.snapshotJson === undefined ? {} : { snapshotJson: dirty ? pestana.snapshotJson : exportarModelo(modeloSincronizado) }),
          };
        })
      : undefined
  );
  return {
    modelo: modeloSincronizado,
    dirty,
    dirtyModelo,
    puedeDeshacer: undoStack.length > 0,
    puedeRehacer: redoStack.length > 0,
    ...(pestanasAbiertas ? { pestanasAbiertas } : {}),
    // Brechas B3/B4: al cargar/reemplazar modelo, limpiar cualquier diálogo de colisión
    // o creación pendiente que pudiera haber quedado abierto.
    colisionPendiente: null,
    nuevaCosaPendiente: null,
    ...extra,
  };
}

/**
 * Discriminador "tipo de cosa" del modelo. Sustenta el coproducto de selección
 * (paquete "Estados ciudadanos de primera clase", 2026-05-23). Devuelve
 * `null` si el id no resuelve a ninguno de los tres ciudadanos.
 * Spec: docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md §4.3.
 */
export function tipoDeCosa(modelo: Modelo, id: Id): "entidad" | "enlace" | "estado" | null {
  if (modelo.entidades[id]) return "entidad";
  if (modelo.enlaces[id]) return "enlace";
  if (modelo.estados?.[id]) return "estado";
  return null;
}

export function estadoSeleccionDesdeIds(modelo: Modelo, ids: Id[], modo: ModoSeleccion): Partial<OpmStore> {
  const tipados = ids
    .map((id) => ({ id, tipo: tipoDeCosa(modelo, id) }))
    .filter((item): item is { id: Id; tipo: "entidad" | "enlace" | "estado" } => item.tipo !== null);
  const seleccionados = [...new Set(tipados.map((item) => item.id))];

  // Mezcla heterogénea (tipos distintos en multi-select) colapsa los tres
  // campos exclusivos a null: el batch queda en `seleccionados` pero no
  // hay "único seleccionado" que iluminar en Inspector/Halo.
  const tiposPresentes = new Set(tipados.map((item) => item.tipo));
  const unico = seleccionados.length === 1 ? seleccionados[0] : null;
  const tipoUnico = unico ? tipoDeCosa(modelo, unico) : null;
  const colapsadoPorHeterogeneidad = tiposPresentes.size > 1;

  return {
    seleccionados,
    modoSeleccion: seleccionados.length > 1 ? "multi" : modo,
    seleccionId: !colapsadoPorHeterogeneidad && tipoUnico === "entidad" && unico ? unico : null,
    enlaceSeleccionId: !colapsadoPorHeterogeneidad && tipoUnico === "enlace" && unico ? unico : null,
    estadoSeleccionId: !colapsadoPorHeterogeneidad && tipoUnico === "estado" && unico ? unico : null,
    modoEnlace: null,
    mensaje: null,
  };
}

export function opdActivoSeguro(modelo: Modelo, opdActivoId: Id): Id {
  return modelo.opds[opdActivoId] ? opdActivoId : modelo.opdRaizId;
}

export function confirmarEliminacionOpd(nombre: string): boolean {
  return runtimeEffects.confirm(`Eliminar OPD "${nombre}"? Esta acción se puede deshacer.`);
}

export function aparienciaSeleccionadaActiva(modelo: Modelo, opdActivoId: Id, seleccionId: Id | null): Apariencia | null {
  if (!seleccionId) return null;
  const entidad = modelo.entidades[seleccionId];
  if (!entidad) return null;
  const opd = modelo.opds[opdActivoId];
  return opd ? aparienciaDeEntidadEnOpd(opd, seleccionId) : null;
}

export function opdDestinoDeAviso(modelo: Modelo, aviso: Aviso, opdActivoId: Id): Id | null {
  if (aviso.opdId && modelo.opds[aviso.opdId]) return aviso.opdId;
  if (!aviso.elementoId) return null;
  if (aviso.elementoTipo === "opd") return modelo.opds[aviso.elementoId] ? aviso.elementoId : null;
  if (aviso.elementoTipo === "enlace") return opdIdDeEnlace(modelo, aviso.elementoId, opdActivoId);
  if (aviso.elementoTipo === "entidad") return opdIdDeEntidad(modelo, aviso.elementoId, opdActivoId);
  return null;
}

export function opdIdDeEnlace(modelo: Modelo, enlaceId: Id, opdPreferidoId: Id): Id | null {
  const preferido = modelo.opds[opdPreferidoId];
  if (preferido && Object.values(preferido.enlaces).some((apariencia) => apariencia.enlaceId === enlaceId)) {
    return opdPreferidoId;
  }
  for (const opd of Object.values(modelo.opds)) {
    if (Object.values(opd.enlaces).some((apariencia) => apariencia.enlaceId === enlaceId)) return opd.id;
  }
  return null;
}

export function opdIdDeEntidad(modelo: Modelo, entidadId: Id, opdPreferidoId: Id): Id | null {
  return opdIdDeEntidadVisible(modelo, entidadId, opdPreferidoId);
}

// ── Persistencia del WorkspaceIndice ────────────────────────────

export function escribirIndiceWorkspace(indice: WorkspaceIndice): void {
  if (!persistenciaBackendHabilitada()) return;
  const sessionEpoch = captureSessionEpoch();
  const baseIndex = estadoActual()?.indice ?? indiceVacio();
  workspaceWriteQueue = workspaceWriteQueue.then(async () => {
    if (!isSessionEpochCurrent(sessionEpoch)) return;
    const state = estadoActual();
    if (!state || state.requiereLogin) return;

    let baseRevision = state.workspaceRevision;
    if (baseRevision === null || persistedWorkspaceIndex === null) {
      const loaded = await cargarWorkspaceBackend();
      if (!isSessionEpochCurrent(sessionEpoch) || estadoActual()?.requiereLogin) return;
      if (!loaded.ok) {
        setEstadoStore({ mensaje: loaded.error });
        return;
      }
      if (observePersistedWorkspace(loaded.value)) {
        baseRevision = loaded.value.revision;
      } else {
        baseRevision = estadoActual()?.workspaceRevision ?? loaded.value.revision;
      }
    }

    const indexToSend = mergeWorkspaceBootstrap(
      persistedWorkspaceIndex ?? indiceVacio(),
      baseIndex,
      indice,
    );
    const saved = await guardarWorkspaceBackend(indexToSend, baseRevision);
    if (!isSessionEpochCurrent(sessionEpoch) || estadoActual()?.requiereLogin) return;
    if (!saved.ok) {
      setEstadoStore({ mensaje: saved.error });
      return;
    }
    persistedWorkspaceIndex = saved.value.indice;
    const stateAtResolution = estadoActual();
    setEstadoStore({
      workspaceRevision: saved.value.revision,
      ...(stateAtResolution?.indice === indice
        ? { indice: saved.value.indice }
        : {}),
    });
  });
}

export function leerIndiceWorkspace(): WorkspaceIndice {
  return indiceVacio();
}

/**
 * Anti-race del bootstrap del workspace: el load async del backend
 * (`sincronizarListadoBackend`) puede resolver DESPUÉS de que el usuario haya
 * cambiado una preferencia (p.ej. visibilidad de esencia OPL) en los primeros
 * ms de sesión. Sin esto, el `set({ indice })` del bootstrap pisaría ese cambio
 * con el `preferenciasUi` del backend (que aún no lo tenía).
 *
 * Fusiona dando precedencia POR CLAVE a las preferencias locales (cambios
 * en-sesión) sobre las del backend. En un load fresco el índice local es
 * `indiceVacio()` (sin `preferenciasUi`), así que el backend gana intacto; tras
 * un cambio del usuario, esa clave gana y el resto del backend se conserva.
 */
export function fusionarPreferenciasBootstrap(
  indiceBackend: WorkspaceIndice,
  indiceLocal: WorkspaceIndice,
): WorkspaceIndice {
  const prefsLocales = indiceLocal.preferenciasUi;
  if (!prefsLocales || Object.keys(prefsLocales).length === 0) return indiceBackend;
  return {
    ...indiceBackend,
    preferenciasUi: { ...(indiceBackend.preferenciasUi ?? {}), ...prefsLocales },
  };
}

/**
 * Aplica al snapshot remoto únicamente el delta ocurrido localmente desde la
 * base observada. Así el bootstrap conserva cambios tempranos sin borrar
 * carpetas/modelos remotos que el estado inicial todavía no conocía.
 */
export function mergeWorkspaceBootstrap(
  backendIndex: WorkspaceIndice,
  baseIndex: WorkspaceIndice,
  localIndex: WorkspaceIndice,
): WorkspaceIndice {
  return {
    modelos: mergeCollectionById(
      backendIndex.modelos,
      baseIndex.modelos,
      localIndex.modelos,
    ),
    carpetas: mergeCollectionById(
      backendIndex.carpetas,
      baseIndex.carpetas,
      localIndex.carpetas,
    ),
    recientes: areEqual(baseIndex.recientes, localIndex.recientes)
      ? backendIndex.recientes
      : localIndex.recientes,
    ...mergeOptionalField(
      "busquedaGlobalUltima",
      backendIndex.busquedaGlobalUltima,
      baseIndex.busquedaGlobalUltima,
      localIndex.busquedaGlobalUltima,
    ),
    ...mergeOptionalField(
      "preferenciasUi",
      backendIndex.preferenciasUi,
      baseIndex.preferenciasUi,
      localIndex.preferenciasUi,
    ),
  };
}

/** Registra una lectura sin permitir que una respuesta vieja retroceda la base. */
export function observePersistedWorkspace(workspace: WorkspacePersistido): boolean {
  const state = estadoActual();
  if (!state) return false;
  if (state.workspaceRevision !== null &&
    state.workspaceRevision > workspace.revision) {
    return false;
  }
  persistedWorkspaceIndex = workspace.indice;
  setEstadoStore({ workspaceRevision: workspace.revision });
  return true;
}

function mergeCollectionById<T extends { id: Id }>(
  remoteItems: T[],
  base: T[],
  localItems: T[],
): T[] {
  const result = new Map(remoteItems.map((item) => [item.id, item]));
  const baseById = new Map(base.map((item) => [item.id, item]));
  const localById = new Map(localItems.map((item) => [item.id, item]));
  for (const id of new Set([...baseById.keys(), ...localById.keys()])) {
    const baseItem = baseById.get(id);
    const localItem = localById.get(id);
    if (areEqual(baseItem, localItem)) continue;
    if (!localItem) {
      result.delete(id);
      continue;
    }
    const remoteItem = result.get(id);
    result.set(
      id,
      baseItem && remoteItem
        ? mergeRecord(remoteItem, baseItem, localItem)
        : localItem,
    );
  }
  return [...result.values()];
}

function mergeRecord<T extends object>(remote: T, base: T, local: T): T {
  const result = { ...remote } as Record<string, unknown>;
  const baseRecord = base as Record<string, unknown>;
  const localRecord = local as Record<string, unknown>;
  for (const key of new Set([...Object.keys(baseRecord), ...Object.keys(localRecord)])) {
    if (areEqual(baseRecord[key], localRecord[key])) continue;
    if (localRecord[key] === undefined) delete result[key];
    else result[key] = localRecord[key];
  }
  return result as T;
}

function mergeOptionalField<K extends string, T>(
  key: K,
  remote: T | undefined,
  base: T | undefined,
  local: T | undefined,
): Partial<Record<K, T>> {
  if (areEqual(base, local)) {
    return remote === undefined ? {} : { [key]: remote } as Record<K, T>;
  }
  if (local === undefined) return {};
  if (isPlainObject(remote) && isPlainObject(local)) {
    return {
      [key]: mergeRecord(
        remote,
        isPlainObject(base) ? base : {},
        local,
      ) as T,
    } as Record<K, T>;
  }
  return { [key]: local } as Record<K, T>;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function areEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function sincronizarIndiceConModelosGuardados(modelosGuardados: ResumenModeloPersistido[], indice: WorkspaceIndice): WorkspaceIndice {
  const idsGuardados = new Set(modelosGuardados.map((m) => m.id));
  const modelos: WorkspaceIndice["modelos"] = modelosGuardados.map((m) => {
    const existente = indice.modelos.find((item) => item.id === m.id);
    return {
      ...existente,
      id: m.id,
      carpetaId: existente?.carpetaId ?? m.carpetaId ?? null,
      ...(existente?.archivado !== undefined ? { archivado: existente.archivado } : m.archivado ? { archivado: true } : {}),
      ...(existente?.archivadoEn ? { archivadoEn: existente.archivadoEn } : m.archivadoEn ? { archivadoEn: m.archivadoEn } : {}),
      ...(existente?.esBiblioteca !== undefined ? { esBiblioteca: existente.esBiblioteca } : m.esBiblioteca ? { esBiblioteca: true } : {}),
      ...(existente?.esApunte !== undefined ? { esApunte: existente.esApunte } : m.esApunte ? { esApunte: true } : {}),
      ...(m.versiones ? { versiones: m.versiones } : {}),
      ...(existente?.mapa ? { mapa: existente.mapa } : {}),
    };
  });
  // Conservar modelos del índice que no están en modelosGuardados
  for (const m of indice.modelos) {
    if (!idsGuardados.has(m.id)) modelos.push(m);
  }
  return { ...indice, modelos, recientes: indice.recientes.filter((r) => idsGuardados.has(r)) };
}

export function esRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function modelosRecientesDeIndice(indice: WorkspaceIndice, guardados: ResumenModeloPersistido[]): ResumenModeloPersistido[] {
  return indice.recientes
    .map((id) => guardados.find((m) => m.id === id))
    .filter((m): m is ResumenModeloPersistido => m !== undefined);
}

export function leerPreferenciaBooleana(key: string, fallback: boolean): boolean {
  void key;
  return fallback;
}

export function escribirPreferenciaBooleana(key: string, value: boolean): void {
  void key;
  void value;
}

export function crearIdModeloLocal(): Id {
  return runtimeEffects.randomUUID() ?? `modelo-${runtimeEffects.now().getTime().toString(36)}-${runtimeEffects.random().toString(36).slice(2, 10)}`;
}

export function deshacerRuntime(set: SetStore, get: GetStore): void {
  const { modelo, opdActivoId } = get();
  const previo = undoStack.at(-1);
  if (!previo) {
    set({ mensaje: "No hay cambios para deshacer", puedeDeshacer: false });
    return;
  }
  const bloqueoAbanico = mensajeBloqueoCambioAbanicoHeredado(modelo, previo, opdActivoId, "historial");
  if (bloqueoAbanico) {
    set({ mensaje: bloqueoAbanico });
    return;
  }
  undoStack = undoStack.slice(0, -1);
  redoStack = [modelo, ...redoStack].slice(0, UNDO_LIMIT);
  set(estadoModelo(previo, {
    opdActivoId: opdActivoSeguro(previo, opdActivoId),
    seleccionId: null,
    enlaceSeleccionId: null,
    estadoSeleccionId: null,
    modoEnlace: null,
    modoCreacion: null,
    mensaje: "Cambio deshecho",
  }));
}

export function rehacerRuntime(set: SetStore, get: GetStore): void {
  const { modelo, opdActivoId } = get();
  const siguiente = redoStack[0];
  if (!siguiente) {
    set({ mensaje: "No hay cambios para rehacer", puedeRehacer: false });
    return;
  }
  const bloqueoAbanico = mensajeBloqueoCambioAbanicoHeredado(modelo, siguiente, opdActivoId, "historial");
  if (bloqueoAbanico) {
    set({ mensaje: bloqueoAbanico });
    return;
  }
  redoStack = redoStack.slice(1);
  undoStack = [...undoStack, modelo].slice(-UNDO_LIMIT);
  set(estadoModelo(siguiente, {
    opdActivoId: opdActivoSeguro(siguiente, opdActivoId),
    seleccionId: null,
    enlaceSeleccionId: null,
    estadoSeleccionId: null,
    modoEnlace: null,
    modoCreacion: null,
    mensaje: "Cambio rehecho",
  }));
}
