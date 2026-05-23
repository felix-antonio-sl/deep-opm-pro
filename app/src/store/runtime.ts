import { crearAutosalvado, type AutosalvadoControl } from "../persistencia/autosalvado";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import type { Aviso } from "../modelo/validaciones";
import type { Apariencia, Id, Modelo, Opd, Pestana, PestanaId } from "../modelo/tipos";
import { construirDescriptorMapa, type CriterioResaltado } from "../canvas/mapaSistema";
import { dentroDeApariencia } from "../modelo/layout";
import { aparienciaDeEntidadEnOpd, opdIdDeEntidadVisible } from "../modelo/politicaApariciones";
import { obtenerRefinamiento } from "../modelo/refinamientos";
import { sincronizarAbanicos } from "../modelo/abanicos";
import { cambiarAfiliacion, cambiarEsencia, crearEnlace, crearModelo, crearObjeto, crearProceso, sincronizarPuertosTodosLosOpd } from "../modelo/operaciones";
import { fixtureTodos, type FixtureDemo } from "../modelo/fixtures";
import { listarModelosLocales, type ResumenModeloPersistido } from "../persistencia/local";
import { indiceVacio, workspaceDesdeModelo, type MapaWorkspace, type WorkspaceIndice } from "../persistencia/workspace";
import {
  PREF_MOSTRAR_ARCHIVADOS_KEY as PREF_ARCHIVADOS_STORAGE_KEY,
  PREF_MOSTRAR_VERSIONES_KEY as PREF_VERSIONES_STORAGE_KEY,
  WORKSPACE_INDEX_KEY,
  escribirIndiceWorkspaceEnStorage,
  escribirPreferenciaBooleanaEnStorage,
  leerIndiceWorkspaceDesdeStorage,
  leerPreferenciaBooleanaDesdeStorage,
} from "../persistencia/workspaceStorage";
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
  aplicarEstiloApariencias,
  aplicarEstiloEnlaces,
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

export const UNDO_LIMIT = 100;
export const WS_KEY = WORKSPACE_INDEX_KEY;
export const PREF_MOSTRAR_ARCHIVADOS_KEY = PREF_ARCHIVADOS_STORAGE_KEY;
export const PREF_MOSTRAR_VERSIONES_KEY = PREF_VERSIONES_STORAGE_KEY;
export const PORTAPAPELES_WORKSPACE_TTL_MS = 5 * 60 * 1000;
export const ANCHO_PANEL_ARBOL_DEFAULT = 240;
export const ANCHO_PANEL_ARBOL_MIN = 160;
export const ANCHO_PANEL_ARBOL_MAX = 600;
// BUG-20260511T225343Z-696858: inspector derecho resizable via DivisorPanel.
// Defaults proporcionales a anchoPanelArbol (240/160/600 → 300/240/560).
export const ANCHO_PANEL_INSPECTOR_DEFAULT = 300;
export const ANCHO_PANEL_INSPECTOR_MIN = 240;
export const ANCHO_PANEL_INSPECTOR_MAX = 560;

let snapshotGuardado = "";
let undoStack: Modelo[] = [];
let redoStack: Modelo[] = [];
let autosalvadoControl: AutosalvadoControl | null = null;
let storeApi: StoreApi<OpmStore> | null = null;
let runtimeEffects: RuntimeEffects = RUNTIME_EFFECTS_DEFAULT;

export function conectarRuntimeStore(api: StoreApi<OpmStore>): void { storeApi = api; }
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
    modoCreacion: null,
    nuevaCosaPendiente: null,
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
  // Ronda 23 L3 #7: pestañas precargadas con el fixture de bienvenida
  // (cargadoDesde === "bienvenida") son tan transitorias como una pestaña
  // "nuevo" recién creada — el operador todavía no editó nada, así que
  // "Empezar vacío" o el asistente deben reemplazarlas sin abrir tab nueva.
  const origenReemplazable = pestana.cargadoDesde === "nuevo" || pestana.cargadoDesde === "bienvenida";
  if (!origenReemplazable) return false;
  if (pestana.modeloId !== null) return false;
  if (pestana.dirty) return false;
  if (pestana.cargadoDesde === "bienvenida") return true;
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

export function commitModelo(
  set: (partial: Partial<OpmStore>) => void,
  previo: Modelo,
  siguiente: Modelo,
  extra: Partial<OpmStore> = {},
): void {
  if (storeApi?.getState().readOnly) {
    set({ mensaje: "Modelo en solo lectura. Usa Guardar como para crear copia editable." });
    return;
  }
  const previoSincronizado = sincronizarPuertosTodosLosOpd(previo);
  const sincronizado = sincronizarPuertosTodosLosOpd(sincronizarAbanicos(siguiente));
  if (previoSincronizado === sincronizado || exportarModelo(previoSincronizado) === exportarModelo(sincronizado)) {
    set(extra);
    return;
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
  const listado = listarModelosLocales();
  return listado.ok ? listado.value : [];
}

export function estadoModelo(modelo: Modelo, extra: Partial<OpmStore> = {}): Partial<OpmStore> {
  const modeloSincronizado = sincronizarPuertosTodosLosOpd(modelo);
  const dirty = extra.dirty ?? (exportarModelo(modeloSincronizado) !== snapshotGuardado);
  // P0 ronda 4: dirtyModelo solo se activa con cambios semanticos.
  // Layout puro (drag, nudge, auto-layout) conserva el valor actual via
  // extra.dirtyModelo explicito. commitModelo setea extra.dirtyModelo=true
  // por defecto para mutaciones semanticas. Para cargas y modelos nuevos
  // (cargarDemo, nuevoModelo, cargarLocal, cargarFixture) que llaman
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

export function crearDemo(): Modelo {
  const fixtures = fixtureTodos();
  return fixtures[0]?.modelo ?? crearModeloOnStarMinimo();
}

function crearModeloOnStarMinimo(): Modelo {
  let modelo = crearModelo("OnStar mínimo");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 90, y: 90 }, "Driver"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 330, y: 90 }, "OnStar System"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 230 }, "Driver Rescuing"));

  const driver = entidadPorNombre(modelo, "Driver");
  const sistema = entidadPorNombre(modelo, "OnStar System");
  const rescate = entidadPorNombre(modelo, "Driver Rescuing");

  modelo = must(cambiarEsencia(modelo, driver, "fisica"));
  modelo = must(cambiarAfiliacion(modelo, driver, "ambiental"));
  modelo = must(cambiarEsencia(modelo, sistema, "fisica"));
  modelo = must(cambiarEsencia(modelo, rescate, "fisica"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, driver, rescate, "agente"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, sistema, rescate, "efecto"));
  return modelo;
}

export function listarFixtures(): FixtureDemo[] {
  return fixtureTodos();
}

export function crearFixturePorNombre(nombre: string): Modelo | null {
  const fixtures = fixtureTodos();
  const fixture = fixtures.find((f) => f.modelo.nombre === nombre);
  return fixture?.modelo ?? null;
}

export function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad demo no encontrada: ${nombre}`);
  return entidad.id;
}

export function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

// ── Persistencia del WorkspaceIndice ────────────────────────────

export function escribirIndiceWorkspace(indice: WorkspaceIndice): void {
  escribirIndiceWorkspaceEnStorage(runtimeEffects, indice);
}

export function leerIndiceWorkspace(): WorkspaceIndice {
  return leerIndiceWorkspaceDesdeStorage(runtimeEffects);
}

export function sincronizarIndiceConModelosGuardados(modelosGuardados: ResumenModeloPersistido[], indice: WorkspaceIndice): WorkspaceIndice {
  const idsGuardados = new Set(modelosGuardados.map((m) => m.id));
  const modelos: WorkspaceIndice["modelos"] = modelosGuardados.map((m) => {
    const existente = indice.modelos.find((item) => item.id === m.id);
    return {
      ...existente,
      id: m.id,
      carpetaId: m.carpetaId ?? existente?.carpetaId ?? null,
      ...(m.archivado ? { archivado: true } : {}),
      ...(m.archivadoEn ? { archivadoEn: m.archivadoEn } : {}),
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
  return leerPreferenciaBooleanaDesdeStorage(runtimeEffects, key, fallback);
}

export function escribirPreferenciaBooleana(key: string, value: boolean): void {
  escribirPreferenciaBooleanaEnStorage(runtimeEffects, key, value);
}

export function crearIdModeloLocal(): Id {
  return runtimeEffects.randomUUID() ?? `modelo-${runtimeEffects.now().getTime().toString(36)}-${runtimeEffects.random().toString(36).slice(2, 10)}`;
}

/**
 * HU-50.024: Genera HTML autocontenido con estilos canónicos OPL-ES (JOYAS §1).
 * Colores: objeto #70E483, proceso #3BC3FF, estado #586D8C.
 */
export function generarHtmlOpl(lineas: string[], titulo: string): string {
  const escapeHtml = (texto: string) =>
    texto
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const filas = lineas
    .map((linea, i) => {
      // Colorear tokens markdown: **objeto** y *proceso*
      const coloreada = linea
        .replace(/\*\*([^*]+)\*\*/g, '<span class="obj">$1</span>')
        .replace(/\*([^*\s][^*]*?)\*/g, '<span class="proc">$1</span>')
        .replace(/`([^`]+)`/g, '<span class="est">$1</span>');
      return `<tr><td class="num">${i + 1}.</td><td>${coloreada}</td></tr>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>OPL-ES — ${escapeHtml(titulo)}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 13px; line-height: 1.65; color: #1f2937; max-width: 960px; margin: 40px auto; padding: 0 20px; }
  h1 { font-size: 18px; color: #334155; margin-bottom: 24px; }
  table { border-collapse: collapse; width: 100%; }
  td { vertical-align: top; padding: 2px 6px; }
  td.num { color: #667085; text-align: right; width: 32px; font-variant-numeric: tabular-nums; }
  .obj { color: #1f7a3c; font-weight: 700; }
  .proc { color: #147aa5; font-style: italic; font-weight: 700; }
  .est { color: #475467; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; }
</style>
</head>
<body>
<h1>OPL-ES &mdash; ${escapeHtml(titulo)}</h1>
<table>${filas}</table>
</body>
</html>`;
}


export function deshacerRuntime(set: SetStore, get: GetStore): void {
  const { modelo, opdActivoId } = get();
  const previo = undoStack.pop();
  if (!previo) {
    set({ mensaje: "No hay cambios para deshacer", puedeDeshacer: false });
    return;
  }
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
  const siguiente = redoStack.shift();
  if (!siguiente) {
    set({ mensaje: "No hay cambios para rehacer", puedeRehacer: false });
    return;
  }
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
