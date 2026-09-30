import type { AutosalvadoControl } from "../persistencia/autosalvado";
import { carpetaIdDeJson, exportarModelo, hidratarModelo } from "../serializacion/json";
import type { Aviso } from "../modelo/validaciones";
import type { Apariencia, Id, Modelo, Opd, Pestana, PestanaId } from "../modelo/tipos";
import { construirDescriptorMapa, type CriterioResaltado } from "../canvas/mapaSistema";
import { dentroDeApariencia } from "../modelo/layout";
import { aparienciaDeEntidadEnOpd, opdIdDeEntidadVisible } from "../modelo/politicaApariciones";
import { obtenerRefinamiento } from "../modelo/refinamientos";
import { sincronizarAbanicos } from "../modelo/abanicos";
import { sincronizarPuertosTodosLosOpd } from "../modelo/operaciones";
import type { ResumenModeloPersistido } from "../persistencia/modelos";
import { cargarBaseRevisionBackend, cargarWorkspaceBackend, guardarAutosalvadoBackend, guardarWorkspaceBackend, getDocumentLocalIdentity, persistenciaBackendHabilitada, type BaseRevisionBackend } from "../persistencia/backend";
import { getLocalDocumentRepository, isQuotaError, type LocalDocumentRecord, type LocalRemoteBase } from "../persistencia/localRepository";
import { indiceVacio, workspaceDesdeModelo, type MapaWorkspace, type WorkspaceIndice, type WorkspacePersistido } from "../persistencia/workspace";
import type { ModoSeleccion } from "../canvas/seleccionMultiple";
import type { StoreApi } from "zustand/vanilla";
import { clonarModelo, crearPestanaDesdeModelo, etiquetaPestana } from "./pestanas";
import { RUNTIME_EFFECTS_DEFAULT, type RuntimeEffects } from "./runtimeEffects";
import type { OpmStore } from "./tipos";
import { captureSessionEpoch, isSessionEpochCurrent } from "./sessionEpoch";
import { mensajeBloqueoCambioAbanicoHeredado } from "../modelo/inheritedFanGuard";
import { firmaSnapshotSubmodelo } from "../modelo/submodelos/estado";
import { validarSemanticaFamiliasPreestado } from "../modelo/familiasEfectosPreestado";
import { mergeWorkspaceBootstrap } from "./workspaceMerge";
import { applyChangeSet, validateInverse } from "../modelo/changes/apply";
import type { Base, ChangeSet, CommitReceipt } from "../agent/contracts";
import type { SemanticInverse } from "../modelo/changes/types";
import { AGENT_CAPABILITY_PROFILE } from "../agent/capabilityProfile";
import {
  DocumentOperationsController,
  mergePreparedModelEdit,
  replayPreparedDocumentEdits,
  sha256Json,
  type PreparedDocumentEdit,
} from "./documentOperations";
import { intentHistory, type IntentHistoryEntry } from "./intentHistory";
export { fusionarPreferenciasBootstrap, mergeWorkspaceBootstrap } from "./workspaceMerge";

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

interface PreparedRuntimeEdit {
  extra: Partial<OpmStore>;
  change: ChangeSet | null;
  history?: "undo" | "redo";
}

export interface RuntimePendingCommit {
  documentId: string;
  pendingId: string;
  candidate: Modelo;
  change: ChangeSet | null;
  status: "prepared" | "conflict";
  reason?: string;
  references?: string[];
}

export interface RuntimeCommitApplication {
  receipt: CommitReceipt;
  base: Base;
  modelJson: string;
  inverse: SemanticInverse;
  change?: ChangeSet;
}

export interface RuntimeHistoryAction {
  kind: "undo" | "reapply";
  sourceChangeId: string;
}

export type RuntimeReconcileResult =
  | { kind: "integrated"; changeId: string; model: Modelo; appliedPending: number; conflicts: number }
  | { kind: "rejected"; reason: string };

const documentOperationControllers = new Map<string, DocumentOperationsController<unknown, PreparedRuntimeEdit>>();
const reservationModels = new Map<string, {
  change: ChangeSet;
  baseModel: Modelo;
  undoDepth: number;
  historyAction?: RuntimeHistoryAction;
}>();
const observedBaseModels = new Map<string, Modelo>();
const legacyHistoryRebase = new Map<string, { changeId: string; base: Modelo; remote: Modelo }>();
const pendingDocumentConflicts = new Map<string, RuntimePendingCommit[]>();
const pendingCommitListeners = new Set<(event: RuntimePendingCommit) => void>();
const intentActionListeners = new Set<(action: "undo" | "reapply", entry: IntentHistoryEntry) => void>();

export function conectarRuntimeStore(api: StoreApi<OpmStore>): void {
  storeApi = api;
  const state = api.getState();
  documentOperationsForState(state);
}

export function inicializarRuntimeStore(api: StoreApi<OpmStore>, modelo: Modelo): void {
  storeApi = api;
  undoStack = [];
  redoStack = [];
  autosalvadoControl = null;
  resetWorkspacePersistenceRuntime();
  documentOperationControllers.clear();
  reservationModels.clear();
  observedBaseModels.clear();
  legacyHistoryRebase.clear();
  pendingDocumentConflicts.clear();
  pendingCommitListeners.clear();
  intentActionListeners.clear();
  intentHistory.clearAll();
  snapshotGuardado = exportarModelo(sincronizarPuertosTodosLosOpd(modelo));
  documentOperationsForState(api.getState());
}

export function documentIdForState(state: Pick<OpmStore, "modeloPersistidoId" | "pestanaActivaId">): string {
  return state.modeloPersistidoId ?? `local:${state.pestanaActivaId}`;
}

export function getDocumentOperationsController(documentId?: string): DocumentOperationsController<unknown, PreparedRuntimeEdit> {
  const state = estadoActual();
  if (!state && !documentId) throw new Error("Store OPM no inicializado");
  const id = documentId ?? documentIdForState(state!);
  let controller = documentOperationControllers.get(id);
  if (!controller) {
    controller = new DocumentOperationsController<unknown, PreparedRuntimeEdit>({ documentId: id });
    documentOperationControllers.set(id, controller);
  }
  return controller;
}

export function onPendingCommit(listener: (event: RuntimePendingCommit) => void): () => void {
  pendingCommitListeners.add(listener);
  return () => pendingCommitListeners.delete(listener);
}

export function onIntentHistoryAction(listener: (action: "undo" | "reapply", entry: IntentHistoryEntry) => void): () => void {
  intentActionListeners.add(listener);
  return () => intentActionListeners.delete(listener);
}

export function getPendingDocumentConflicts(documentId: string): readonly RuntimePendingCommit[] {
  return [...(pendingDocumentConflicts.get(documentId) ?? [])];
}

export function submitDocumentChange(documentId: string, change: ChangeSet):
  | { kind: "applied"; changeId: string; sequence: number; model: Modelo; inverse: SemanticInverse }
  | { kind: "prepared"; pendingId: string }
  | { kind: "rejected"; validation: Extract<ReturnType<typeof applyChangeSet>, { kind: "rejected" }> } {
  const state = estadoActual();
  if (!state) throw new Error("Store OPM no inicializado");
  if (change.target.kind !== "current" || change.target.documentId !== documentId || documentIdForState(state) !== documentId) {
    return { kind: "rejected", validation: { kind: "rejected", code: "invalid-change", message: "El cambio no apunta al documento activo", references: [documentId] } };
  }
  const validation = applyChangeSet(state.modelo, { id: change.id, operations: change.operations });
  if (validation.kind === "rejected") return { kind: "rejected", validation };
  const controller = getDocumentOperationsController(documentId);
  if (controller.snapshot().reservation) {
    const prepared = controller.prepareHumanEdit({
      base: state.modelo,
      candidate: validation.candidate,
      payload: { extra: { dirtyModelo: true }, change },
    });
    if (!prepared) throw new Error("No se pudo preparar el cambio durante la reserva");
    const event: RuntimePendingCommit = {
      documentId,
      pendingId: prepared.id,
      candidate: validation.candidate,
      change,
      status: "prepared",
    };
    for (const listener of pendingCommitListeners) listener(event);
    return { kind: "prepared", pendingId: prepared.id };
  }
  if (!commitModelo(setEstadoStore, state.modelo, validation.candidate, { dirtyModelo: true })) {
    return {
      kind: "rejected",
      validation: { kind: "rejected", code: "invalid-model", message: obtenerEstadoStore().mensaje ?? "El cambio no se pudo aplicar", references: [] },
    };
  }
  return {
    kind: "applied",
    changeId: change.id,
    sequence: controller.snapshot().clientSequence,
    model: obtenerEstadoStore().modelo,
    inverse: validation.inverse,
  };
}

function documentOperationsForState(state: OpmStore): DocumentOperationsController<unknown, PreparedRuntimeEdit> {
  return getDocumentOperationsController(documentIdForState(state));
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

export function entidadNueva(previo: Modelo, siguiente: Modelo): Id | null {
  const previos = new Set(Object.keys(previo.entidades));
  return Object.keys(siguiente.entidades).find((id) => !previos.has(id)) ?? null;
}

export function enlaceNuevo(previo: Modelo, siguiente: Modelo): Id | null {
  const previos = new Set(Object.keys(previo.enlaces));
  return Object.keys(siguiente.enlaces).find((id) => !previos.has(id)) ?? null;
}

export async function flushDocumentOperations(
  documentId = documentIdForState(obtenerEstadoStore()),
  profileVersion = AGENT_CAPABILITY_PROFILE,
): Promise<Base> {
  if (documentId.startsWith("local:")) throw new Error("Guarda el documento antes de iniciar una tarea agéntica");
  const operations = getDocumentOperationsController(documentId);
  if (operations.snapshot().reservation) throw new Error("Hay un commit reservado en este documento");
  if (operations.snapshot().pendingEdits.length > 0 || (pendingDocumentConflicts.get(documentId)?.length ?? 0) > 0) {
    throw new Error("Resuelve las ediciones preparadas antes de iniciar otra tarea");
  }

  // The gateway hashes the effective server copy. Bring this tab's exact JSON
  // into autosave first so it cannot authorize against a stale or dirty branch.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const state = obtenerEstadoStore();
    const model = modelForDocument(state, documentId);
    if (!model) throw new Error("El documento ya no está abierto");
    const modelIndex = state.indice.modelos.find((item) => item.id === documentId);
    const observedBefore = await cargarBaseRevisionBackend(documentId);
    if (!observedBefore.ok) throw new Error(`No se pudo comprobar la base del documento: ${observedBefore.error}`);
    const observedJson = baseEfectivaJson(observedBefore.value);
    const carpetaId = modelIndex ? modelIndex.carpetaId : carpetaIdDeJson(observedJson);
    const json = exportarModelo(model, carpetaId);
    const knownRevision = state.revisionBasePorModelo[documentId] ??
      state.modelosGuardados.find((item) => item.id === documentId)?.revision;
    const observed = observedBefore;
    const observedRevision = observed.value.model.revision;
    if (typeof observedRevision !== "number") throw new Error("La revisión base del documento no está disponible");
    if (typeof knownRevision === "number" && knownRevision !== observedRevision) {
      const effectiveBefore = baseEfectivaJson(observed.value);
      if (await sha256Json(effectiveBefore) !== await sha256Json(json)) {
        throw new Error("El servidor tiene una revisión nueva y la copia local difiere; sincroniza antes de continuar");
      }
    }

    const effectiveJson = baseEfectivaJson(observed.value);
    if (await sha256Json(effectiveJson) !== await sha256Json(json)) {
      const saved = await guardarAutosalvadoBackend(documentId, json, observedRevision);
      if (!saved.ok) {
        if (attempt < 2) continue;
        throw new Error(`No se pudo fijar la copia de trabajo en el servidor: ${saved.error}`);
      }
    }

    const confirmed = await cargarBaseRevisionBackend(documentId);
    if (!confirmed.ok) throw new Error(`No se pudo confirmar la base del documento: ${confirmed.error}`);
    const confirmedRevision = confirmed.value.model.revision;
    if (typeof confirmedRevision !== "number") throw new Error("La revisión confirmada del documento no está disponible");
    const confirmedJson = baseEfectivaJson(confirmed.value);
    const currentState = obtenerEstadoStore();
    const currentModel = modelForDocument(currentState, documentId);
    if (!currentModel) throw new Error("El documento dejó de estar abierto");
    const currentIndex = currentState.indice.modelos.find((item) => item.id === documentId);
    const currentFolderId = currentIndex ? currentIndex.carpetaId : carpetaIdDeJson(confirmedJson);
    const currentJson = exportarModelo(currentModel, currentFolderId);
    if (await sha256Json(confirmedJson) !== await sha256Json(json) ||
      await sha256Json(currentJson) !== await sha256Json(json)) continue;
    const effectiveModel = hidratarModelo(confirmedJson);
    if (!effectiveModel.ok) throw new Error(`La base remota no se pudo leer: ${effectiveModel.error}`);
    observedBaseModels.set(documentId, effectiveModel.value);
    marcarModeloAutosalvado(documentId, currentModel, confirmedJson, currentFolderId);
    const snapshot = operations.snapshot();
    const base: Base = {
      revision: confirmedRevision,
      semanticHash: firmaSnapshotSubmodelo(effectiveModel.value),
      workingCopyHash: await sha256Json(exportarModelo(effectiveModel.value, carpetaIdDeJson(confirmedJson))),
      clientSequence: snapshot.clientSequence,
      profileVersion,
    };
    if (!operations.observeBase(base)) continue;
    return base;
  }
  throw new Error("La copia de trabajo siguió cambiando mientras se fijaba la base");
}

function baseEfectivaJson(observed: BaseRevisionBackend): string {
  return observed.witness.source === "autosave"
    ? observed.autosave?.json ?? observed.model.json
    : observed.model.json;
}

function marcarModeloAutosalvado(documentId: string, model: Modelo, json: string, carpetaId: string | null): void {
  const state = estadoActual();
  if (!state) return;
  if (documentIdForState(state) === documentId) {
    if (exportarModelo(state.modelo, carpetaId) !== json) return;
    marcarSnapshotModelo(state.modelo);
    const partial = estadoModelo(state.modelo, { dirty: false, dirtyModelo: false });
    const pestanasAbiertas = (partial.pestanasAbiertas ?? state.pestanasAbiertas).map((tab) =>
      tab.id === state.pestanaActivaId ? { ...tab, snapshotJson: exportarModelo(state.modelo), dirty: false } : tab,
    );
    storeApi?.setState({ ...partial, pestanasAbiertas });
    return;
  }
  const pestanasAbiertas = state.pestanasAbiertas.map((tab) => tab.modeloId === documentId &&
    exportarModelo(tab.modelo, carpetaId) === json
    ? { ...tab, snapshotJson: exportarModelo(model), dirty: false }
    : tab);
  storeApi?.setState({ pestanasAbiertas });
}

export type PrepareDocumentCommitResult<Grant> =
  | { kind: "prepared"; grant: Grant; base: Base; controllerId: string }
  | { kind: "stale-base"; current: Base; reason: string }
  | { kind: "busy" }
  | { kind: "grant-failed"; reason: string }
  | { kind: "expired" };

export async function prepareDocumentCommit<Grant>(input: {
  change: ChangeSet;
  base: Base;
  policy: "review" | "delegated";
  historyAction?: RuntimeHistoryAction;
  issueGrant: (request: {
    documentId: string;
    changeId: string;
    change: ChangeSet;
    kind: "review" | "delegated";
    controllerId: string;
    clientSequence: number;
    workingCopyHash: string;
    base: Base;
  }) => Promise<{ grant: Grant; expiresAt: string }>;
  now?: () => number;
}): Promise<PrepareDocumentCommitResult<Grant>> {
  const documentId = input.change.target.documentId;
  if (input.change.target.kind !== "current") return { kind: "stale-base", current: input.base, reason: "Las variantes no reservan escritura sobre el vigente" };
  let current: Base;
  try {
    current = await flushDocumentOperations(documentId, input.base.profileVersion);
  } catch (error) {
    return { kind: "stale-base", current: input.base, reason: error instanceof Error ? error.message : "No se pudo fijar la base" };
  }
  if (!basesIguales(current, input.base) || input.change.base.clientSequence !== current.clientSequence) {
    return { kind: "stale-base", current, reason: "La copia de trabajo cambió desde que se preparó el candidato" };
  }
  const state = obtenerEstadoStore();
  const model = modelForDocument(state, documentId);
  if (!model) return { kind: "stale-base", current, reason: "El documento ya no está abierto" };
  const operations = getDocumentOperationsController(documentId);
  const startedAt = (input.now ?? Date.now)();
  const started = operations.beginReservation(input.change.id, current, startedAt);
  if (started.kind === "busy") return { kind: "busy" };
  if (started.kind !== "reserved") {
    return { kind: "stale-base", current, reason: "La secuencia local ya avanzó" };
  }
  reservationModels.set(documentId, {
    change: input.change,
    // The server applies semantic operations to its effective saved/autosave
    // base. Merge the complete local working copy against that same point so
    // already-dirty human fields survive the remote receipt.
    baseModel: clonarModelo(observedBaseModels.get(documentId) ?? model),
    undoDepth: legacyUndoDepth(state, documentId),
    ...(input.historyAction ? { historyAction: input.historyAction } : {}),
  });
  try {
    const grantResult = await input.issueGrant({
      documentId,
      changeId: input.change.id,
      change: input.change,
      kind: input.policy,
      controllerId: operations.controllerId,
      clientSequence: current.clientSequence,
      workingCopyHash: current.workingCopyHash,
      base: current,
    });
    const expiresAt = Date.parse(grantResult.expiresAt);
    if (!operations.attachGrant(input.change.id, grantResult.grant, expiresAt, (input.now ?? Date.now)())) {
      releaseDocumentCommit(documentId, input.change.id, "El permiso de commit venció antes de poder usarlo");
      return { kind: "expired" };
    }
    return { kind: "prepared", grant: grantResult.grant, base: current, controllerId: operations.controllerId };
  } catch (error) {
    // Issuing a grant cannot apply a change. Even when its response is lost,
    // a grant the client never received is unusable; later edits advance the
    // bound sequence/hash. Release the reservation and replay queued drafts.
    const reason = errorMessage(error);
    releaseDocumentCommit(documentId, input.change.id, reason);
    return { kind: "grant-failed", reason };
  }
}

function basesIguales(left: Base, right: Base): boolean {
  return left.revision === right.revision &&
    left.semanticHash === right.semanticHash &&
    left.workingCopyHash === right.workingCopyHash &&
    left.clientSequence === right.clientSequence &&
    left.profileVersion === right.profileVersion;
}

function modelForDocument(state: OpmStore, documentId: string): Modelo | null {
  if (documentIdForState(state) === documentId) return state.modelo;
  const tab = state.pestanasAbiertas.find((item) =>
    item.modeloId === documentId || (item.modeloId === null && `local:${item.id}` === documentId));
  return tab?.modelo ?? null;
}

function legacyUndoDepth(state: OpmStore, documentId: string): number {
  if (documentIdForState(state) === documentId) return undoStack.length;
  return state.pestanasAbiertas.find((item) => item.modeloId === documentId)?.historialUndo.length ?? 0;
}

export function reconcileDocumentCommit(input: RuntimeCommitApplication): RuntimeReconcileResult {
  const documentId = input.receipt.target.documentId;
  const controller = getDocumentOperationsController(documentId);
  const reservation = controller.snapshot().reservation;
  const context = reservationModels.get(documentId);
  const change = context?.change;
  if (!reservation || !context || !change || reservation.changeId !== change.id ||
    input.receipt.changeId !== change.id || context.change.id !== change.id ||
    (input.change && input.change.id !== change.id)) {
    return { kind: "rejected", reason: "El recibo no corresponde a la reserva activa" };
  }
  if (input.receipt.target.kind !== "current" || change.target.kind !== "current" ||
    change.target.documentId !== documentId || input.receipt.previousRevision !== reservation.base.revision ||
    input.receipt.revision <= input.receipt.previousRevision || input.base.revision < input.receipt.revision ||
    input.base.clientSequence !== reservation.base.clientSequence || !input.base.workingCopyHash.trim()) {
    return { kind: "rejected", reason: "El recibo pertenece a otra base o destino" };
  }
  const hydrated = hidratarModelo(input.modelJson);
  if (!hydrated.ok) return { kind: "rejected", reason: `El modelo confirmado no se pudo leer: ${hydrated.error}` };

  const state = estadoActual();
  if (!state) return { kind: "rejected", reason: "Store OPM no inicializado" };
  const current = modelForDocument(state, documentId);
  if (!current) return { kind: "rejected", reason: "El documento dejó de estar abierto" };
  const pending = controller.finishReservation(change.id);
  if (!pending) return { kind: "rejected", reason: "La reserva ya fue reconciliada" };
  reservationModels.delete(documentId);

  const remoteModel = hydrated.value;
  const liveDelta = mergePreparedModelEdit(context.baseModel, current, remoteModel);
  let working = remoteModel;
  let conflicts = 0;
  if (liveDelta.kind === "merged") {
    working = liveDelta.model;
  } else {
    conflicts += 1;
    retainPendingConflict({
      documentId,
      pendingId: `${documentId}:conflict:${change.id}:live`,
      candidate: current,
      change: null,
      status: "conflict",
      reason: "La edición local posterior coincide con un hecho que cambió el commit remoto",
      references: liveDelta.paths,
    });
  }

  const historyStartDepth = context.historyAction?.kind === "undo" ? 0 : context.undoDepth;
  rebaseLegacySnapshots(documentId, historyStartDepth, context.baseModel, remoteModel);
  legacyHistoryRebase.set(documentId, { changeId: change.id, base: context.baseModel, remote: remoteModel });
  controller.recordRemoteCommit();
  const barrier = legacyUndoDepth(obtenerEstadoStore(), documentId);
  if (context.historyAction?.kind === "undo") {
    intentHistory.markUndone(documentId, context.historyAction.sourceChangeId, change.id);
  } else if (context.historyAction?.kind === "reapply") {
    const reapplication = intentHistory.recordReapplied({
      documentId,
      originalChangeId: context.historyAction.sourceChangeId,
      changeId: change.id,
      change,
      inverse: input.inverse,
      sequence: controller.snapshot().clientSequence,
      legacyUndoDepth: barrier,
    });
    if (!reapplication) {
      intentHistory.recordApplied({
        documentId,
        changeId: change.id,
        target: change.target,
        sequence: controller.snapshot().clientSequence,
        legacyUndoDepth: barrier,
        change,
        inverse: input.inverse,
      });
    }
  } else if (change.operations.length > 0) {
    intentHistory.recordApplied({
      documentId,
      changeId: change.id,
      target: change.target,
      sequence: controller.snapshot().clientSequence,
      legacyUndoDepth: barrier,
      change,
      inverse: input.inverse,
    });
  }

  let appliedPending = 0;
  const pendingReplay = replayPreparedDocumentEdits(working, pending, (model, edit) => {
    const replay = replayPreparedEdit(model, edit, state.opdActivoId);
    return replay.kind === "applied"
      ? { kind: "merged", model: replay.model }
      : { kind: "conflict", paths: replay.references, reason: replay.reason };
  });
  for (const conflict of pendingReplay.conflicts) {
    conflicts += 1;
    retainPreparedConflict(documentId, conflict.edit, conflict.paths, conflict.reason ?? "La edición necesita resolverse sobre la nueva base");
  }
  for (const step of pendingReplay.applied) {
    if (step.edit.payload.history === "undo") {
      undoStack = undoStack.slice(0, -1);
      redoStack = [clonarModelo(step.before), ...redoStack].slice(0, UNDO_LIMIT);
      intentHistory.shiftLegacyUndoDepth(documentId, -1);
    } else if (step.edit.payload.history === "redo") {
      redoStack = redoStack.slice(1);
      undoStack = [...undoStack, clonarModelo(step.before)].slice(-UNDO_LIMIT);
    } else {
      appendLegacySnapshot(documentId, step.before);
    }
    controller.recordAppliedEdit();
    appliedPending += 1;
  }
  working = pendingReplay.model;

  const effectiveRevision = Math.max(input.receipt.revision, input.base.revision);

  applyReconciledModel({
    documentId,
    remoteModel,
    remoteJson: input.modelJson,
    workingModel: working,
    revision: effectiveRevision,
    priorDirtyModelo: state.dirtyModelo || appliedPending > 0,
  });
  return { kind: "integrated", changeId: change.id, model: working, appliedPending, conflicts };
}

export function releaseDocumentCommit(documentId: string, changeId: string, reason: string): boolean {
  const controller = getDocumentOperationsController(documentId);
  const pending = controller.releaseReservation(changeId);
  if (!pending) return false;
  reservationModels.delete(documentId);
  const state = estadoActual();
  const current = state && modelForDocument(state, documentId);
  if (!state || !current) return true;
  let working = current;
  let applied = 0;
  for (const edit of pending) {
    const replay = replayPreparedEdit(working, edit, state.opdActivoId);
    if (replay.kind === "conflict") {
      retainPreparedConflict(documentId, edit, replay.references, replay.reason);
      continue;
    }
    if (edit.payload.history === "undo") {
      undoStack = undoStack.slice(0, -1);
      redoStack = [clonarModelo(working), ...redoStack].slice(0, UNDO_LIMIT);
      intentHistory.shiftLegacyUndoDepth(documentId, -1);
    } else if (edit.payload.history === "redo") {
      redoStack = redoStack.slice(1);
      undoStack = [...undoStack, clonarModelo(working)].slice(-UNDO_LIMIT);
    } else {
      appendLegacySnapshot(documentId, working);
    }
    working = replay.model;
    controller.recordAppliedEdit();
    applied += 1;
  }
  if (applied > 0) applyLocalWorkingModel(documentId, working, reason);
  else if (documentIdForState(state) === documentId) storeApi?.setState({ mensaje: reason });
  return true;
}

function applyLocalWorkingModel(documentId: string, model: Modelo, message: string): void {
  const state = estadoActual();
  if (!state) return;
  if (documentIdForState(state) === documentId) {
    storeApi?.setState(estadoModelo(model, { dirtyModelo: true, mensaje: message }));
    return;
  }
  const pestanasAbiertas = state.pestanasAbiertas.map((tab) => tab.modeloId === documentId
    ? { ...tab, modelo: clonarModelo(model), dirty: true }
    : tab);
  storeApi?.setState({ pestanasAbiertas, mensaje: message });
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "No se pudo reservar el commit";
}

type PreparedEditReplay =
  | { kind: "applied"; model: Modelo }
  | { kind: "conflict"; reason: string; references: string[] };

function replayPreparedEdit(current: Modelo, edit: PreparedDocumentEdit<PreparedRuntimeEdit>, opdActivoId: Id): PreparedEditReplay {
  const merged = mergePreparedModelEdit(edit.base, edit.candidate, current);
  if (merged.kind === "conflict") {
    return { kind: "conflict", reason: "La edición necesita resolverse sobre la nueva base", references: merged.paths };
  }
  if (edit.payload.change) {
    const semantic = applyChangeSet(current, { id: edit.payload.change.id, operations: edit.payload.change.operations });
    if (semantic.kind === "rejected") {
      return { kind: "conflict", reason: semantic.message, references: semantic.references };
    }
    // T2's semantic projection covers supported model collections only. Keep
    // metadata/layout from the full draft only when the batch represents it.
    if (exportarModelo(semantic.candidate) !== exportarModelo(merged.model)) {
      return {
        kind: "conflict",
        reason: "La edición preparada incluye cambios fuera del lote semántico; conserva el borrador para revisión",
        references: semantic.writeIds,
      };
    }
  }
  const validated = validateRebasedModel(current, merged.model, opdActivoId);
  return validated.ok
    ? { kind: "applied", model: validated.model }
    : { kind: "conflict", reason: "La edición no supera la validación sobre la nueva base", references: [validated.error] };
}

function validateRebasedModel(
  previo: Modelo,
  siguiente: Modelo,
  opdActivoId: Id,
): { ok: true; model: Modelo } | { ok: false; error: string } {
  const synced = sincronizarPuertosTodosLosOpd(sincronizarAbanicos(siguiente));
  const fanBlock = mensajeBloqueoCambioAbanicoHeredado(previo, synced, opdActivoId);
  if (fanBlock) return { ok: false, error: fanBlock };
  const families = validarSemanticaFamiliasPreestado(synced.familiasEfectosPreestado, synced);
  if (!families.ok) return { ok: false, error: families.error };
  const normalized = hidratarModelo(exportarModelo(synced));
  return normalized.ok
    ? { ok: true, model: normalized.value }
    : { ok: false, error: normalized.error };
}

function retainPreparedConflict(
  documentId: string,
  edit: PreparedDocumentEdit<PreparedRuntimeEdit>,
  references: string[],
  reason: string,
): void {
  const event: RuntimePendingCommit = {
    documentId,
    pendingId: edit.id,
    candidate: edit.candidate,
    change: edit.payload.change,
    status: "conflict",
    reason,
    references,
  };
  retainPendingConflict(event);
}

function retainPendingConflict(event: RuntimePendingCommit): void {
  const current = pendingDocumentConflicts.get(event.documentId) ?? [];
  pendingDocumentConflicts.set(event.documentId, [...current, event]);
  for (const listener of pendingCommitListeners) listener(event);
}

function appendLegacySnapshot(documentId: string, before: Modelo): void {
  const state = estadoActual();
  if (!state) return;
  if (documentIdForState(state) === documentId) {
    undoStack = [...undoStack, clonarModelo(before)].slice(-UNDO_LIMIT);
    redoStack = [];
    return;
  }
  const pestanasAbiertas = state.pestanasAbiertas.map((tab) => tab.modeloId === documentId
    ? { ...tab, historialUndo: [...tab.historialUndo, clonarModelo(before)].slice(-UNDO_LIMIT), cursorUndo: Math.min(tab.historialUndo.length + 1, UNDO_LIMIT) }
    : tab);
  storeApi?.setState({ pestanasAbiertas });
}

function rebaseLegacySnapshots(documentId: string, startDepth: number, base: Modelo, remote: Modelo): boolean {
  const state = estadoActual();
  if (!state) return false;
  if (documentIdForState(state) === documentId) {
    const updated = [...undoStack];
    let undoHistorySafe = true;
    for (let index = startDepth; index < updated.length; index += 1) {
      const merged = mergePreparedModelEdit(base, remote, updated[index]!);
      if (merged.kind === "conflict") {
        undoHistorySafe = false;
        break;
      }
      updated[index] = merged.model;
    }
    undoStack = updated;
    const rebasedRedo = [...redoStack];
    let redoHistorySafe = true;
    for (let index = 0; index < rebasedRedo.length; index += 1) {
      const merged = mergePreparedModelEdit(base, rebasedRedo[index]!, remote);
      if (merged.kind === "conflict") {
        redoHistorySafe = false;
        break;
      }
      rebasedRedo[index] = merged.model;
    }
    redoStack = rebasedRedo;
    return undoHistorySafe && redoHistorySafe;
  }
  let ok = true;
  const pestanasAbiertas = state.pestanasAbiertas.map((tab) => {
    if (tab.modeloId !== documentId) return tab;
    const updated = [...tab.historialUndo];
    for (let index = startDepth; index < updated.length; index += 1) {
      const merged = mergePreparedModelEdit(base, remote, updated[index]!);
      if (merged.kind === "conflict") {
        ok = false;
        return tab;
      }
      updated[index] = merged.model;
    }
    return { ...tab, historialUndo: updated };
  });
  storeApi?.setState({ pestanasAbiertas });
  return ok;
}

function applyReconciledModel(input: {
  documentId: string;
  remoteModel: Modelo;
  remoteJson: string;
  workingModel: Modelo;
  revision: number;
  priorDirtyModelo: boolean;
}): void {
  const state = estadoActual();
  if (!state) return;
  const revisionBasePorModelo = conBaseRevision(state.revisionBasePorModelo, input.documentId, input.revision);
  const models = state.modelosGuardados.map((item) => item.id === input.documentId
    ? { ...item, revision: input.revision, nombre: input.remoteModel.nombre }
    : item);
  if (documentIdForState(state) === input.documentId) {
    marcarSnapshotJson(input.remoteJson);
    const carpetaId = carpetaIdDeJson(input.remoteJson);
    const workingJson = exportarModelo(input.workingModel, carpetaId);
    const dirty = workingJson !== input.remoteJson;
    const pestanasAbiertas = state.pestanasAbiertas.map((tab) => tab.id === state.pestanaActivaId
      ? { ...tab, snapshotJson: input.remoteJson, dirty }
      : tab);
    const partial = estadoModelo(input.workingModel, {
      mensaje: pendingDocumentConflicts.get(input.documentId)?.length
        ? "Commit integrado; hay ediciones preparadas que requieren revisión"
        : "Commit integrado",
      modeloPersistidoId: input.documentId,
      revisionBasePorModelo,
      modelosGuardados: models,
      pestanasAbiertas,
      dirty,
      dirtyModelo: input.priorDirtyModelo || Boolean(pendingDocumentConflicts.get(input.documentId)?.length),
    });
    storeApi?.setState({
      ...partial,
      puedeDeshacer: puedeDeshacerDocumento(input.documentId, undoStack.length),
      puedeRehacer: puedeRehacerDocumento(input.documentId),
    });
    return;
  }

  const remoteJson = input.remoteJson;
  const carpetaId = carpetaIdDeJson(remoteJson);
  const pestanasAbiertas = state.pestanasAbiertas.map((tab) => {
    if (tab.modeloId !== input.documentId) return tab;
    const workingJson = exportarModelo(input.workingModel, carpetaId);
    return {
      ...tab,
      modelo: clonarModelo(input.workingModel),
      dirty: workingJson !== remoteJson,
      snapshotJson: remoteJson,
      historialUndo: [...tab.historialUndo],
      cursorUndo: tab.historialUndo.length,
    };
  });
  storeApi?.setState({ pestanasAbiertas, revisionBasePorModelo, modelosGuardados: models });
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
    refinamientoPendiente: null,
    confirmacionEliminarRefinamiento: null,
    confirmacionDevolverBoceto: null,
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
      modelo: clonarModelo(state.modelo),
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
 * semántico que aplicar). `false` = bloqueado por solo-lectura o integridad semántica — los
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
  const familias = validarSemanticaFamiliasPreestado(sincronizado.familiasEfectosPreestado, sincronizado);
  if (!familias.ok) {
    set({ mensaje: `Cambio no aplicado. ${familias.error}. Actualiza o retira la declaración de familia en la misma edición.` });
    return false;
  }
  if (previoSincronizado === sincronizado || exportarModelo(previoSincronizado) === exportarModelo(sincronizado)) {
    set(extra);
    return true;
  }
  if (estado) {
    const documentId = documentIdForState(estado);
    const operations = getDocumentOperationsController(documentId);
    const reserved = Boolean(operations.snapshot().reservation);
    if (reserved && extra.dirtyModelo !== false) {
      const prepared = operations.prepareHumanEdit({
        base: previoSincronizado,
        candidate: sincronizado,
        payload: { extra, change: null },
      });
      if (prepared) {
        const event: RuntimePendingCommit = {
          documentId,
          pendingId: prepared.id,
          candidate: clonarModelo(sincronizado),
          change: null,
          status: "prepared",
        };
        for (const listener of pendingCommitListeners) listener(event);
        set({ mensaje: "Edición preparada; se comprobará sobre la base que llegue del servidor" });
        return false;
      }
    }
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
  if (estado) {
    const operations = getDocumentOperationsController(documentIdForState(estado));
    if (!operations.snapshot().reservation) operations.recordAppliedEdit();
    queueLocalDocumentCheckpoint(documentIdForState(estado));
  }
  return true;
}

export interface LocalDocumentSnapshotInput {
  snapshotJson: string;
  initialSnapshotJson: string;
  remoteBase: LocalRemoteBase | null;
  history: unknown[];
}

export function localDocumentSnapshotInput(documentId: string): LocalDocumentSnapshotInput | null {
  const state = estadoActual();
  if (!state || documentIdForState(state) !== documentId) return null;
  const tab = state.pestanasAbiertas.find((item) => item.id === state.pestanaActivaId);
  const rawInitialSnapshotJson = tab?.snapshotJson ?? snapshotGuardado;
  const modelIndex = state.indice.modelos.find((item) => item.id === documentId);
  const folderId = modelIndex ? modelIndex.carpetaId : carpetaIdDeJson(rawInitialSnapshotJson);
  const snapshotJson = exportarModelo(state.modelo, folderId);
  const initialModel = hidratarModelo(rawInitialSnapshotJson);
  const initialSnapshotJson = initialModel.ok
    ? exportarModelo(initialModel.value, folderId)
    : rawInitialSnapshotJson;
  const revision = state.revisionBasePorModelo[documentId];
  const remoteBase = !documentId.startsWith("local:")
    ? { revision: typeof revision === "number" ? revision : null, snapshotJson: initialSnapshotJson }
    : null;
  const history = [{
    format: "opforja.local-history.v1",
    undo: (tab?.historialUndo ?? undoStack).map((model) => exportarModelo(model, folderId)),
    cursor: tab?.cursorUndo ?? undoStack.length,
    intents: intentHistory.entries(documentId),
  }];
  return { snapshotJson, initialSnapshotJson, remoteBase, history };
}

export async function restoreLocalDocumentRecord(record: LocalDocumentRecord, options: { replaceDirty?: boolean } = {}): Promise<boolean> {
  const state = estadoActual();
  if (!state || state.readOnly || state.esBibliotecaAbierta || (state.dirtyModelo && options.replaceDirty !== true)) return false;
  const hydrated = hidratarModelo(record.snapshotJson);
  if (!hydrated.ok) return false;

  const storedHistory = record.history.find((item): item is {
    format: string;
    undo?: unknown;
    cursor?: unknown;
    intents?: unknown;
  } => Boolean(item && typeof item === "object" && (item as { format?: unknown }).format === "opforja.local-history.v1"));
  const undo = Array.isArray(storedHistory?.undo)
    ? storedHistory.undo.map((json) => typeof json === "string" ? hidratarModelo(json) : null)
      .filter((result): result is Extract<ReturnType<typeof hidratarModelo>, { ok: true }> => result?.ok === true)
      .map((result) => result.value)
    : [];
  const intents = Array.isArray(storedHistory?.intents)
    ? storedHistory.intents as IntentHistoryEntry[]
    : [];
  undoStack = undo.slice(-UNDO_LIMIT);
  redoStack = [];
  intentHistory.restoreDocument(record.documentId, intents);

  const persistentId = record.documentId.startsWith("local:") ? null : record.documentId;
  const localTabId = record.documentId.startsWith("local:") ? record.documentId.slice("local:".length) : null;
  const existing = state.pestanasAbiertas.find((tab) => persistentId
    ? tab.modeloId === persistentId
    : tab.id === localTabId);
  const recoveredTab: Pestana = {
    id: existing?.id ?? (localTabId ?? `pestana-${record.documentId}`),
    etiqueta: etiquetaPestana({ nombre: hydrated.value.nombre, modeloId: persistentId }),
    modeloId: persistentId,
    modelo: clonarModelo(hydrated.value),
    cargadoDesde: persistentId ? "persistido" : "importado",
    dirty: record.status !== "synced" || record.snapshotJson !== (record.remoteBase?.snapshotJson ?? record.snapshotJson),
    historialUndo: undo,
    cursorUndo: typeof storedHistory?.cursor === "number" ? storedHistory.cursor : undo.length,
    vistaMapaActivaPestana: false,
    snapshotJson: record.remoteBase?.snapshotJson ?? record.snapshotJson,
  };
  const pestanasAbiertas = existing
    ? state.pestanasAbiertas.map((tab) => tab.id === existing.id ? recoveredTab : tab)
    : state.pestanasAbiertas.length === 1 && !state.dirtyModelo && !state.modeloPersistidoId
      ? [recoveredTab]
      : [...state.pestanasAbiertas, recoveredTab];
  const revisionBasePorModelo = record.remoteBase && typeof record.remoteBase.revision === "number"
    ? conBaseRevision(state.revisionBasePorModelo, record.documentId, record.remoteBase.revision)
    : state.revisionBasePorModelo;
  const baselineJson = record.remoteBase?.snapshotJson ?? recoveredTab.snapshotJson ?? record.snapshotJson;
  snapshotGuardado = baselineJson;
  const dirty = recoveredTab.dirty;
  const message = record.status === "conflict"
    ? "Copia local recuperada sin conexión; hay dos ramas que requieren decisión"
    : record.status === "saved-here"
      ? "Copia local recuperada sin conexión; hay cambios sin sincronizar"
      : "Documento local recuperado";
  storeApi?.setState({
    ...estadoModelo(hydrated.value, {
      pestanasAbiertas,
      pestanaActivaId: recoveredTab.id,
      modeloPersistidoId: persistentId,
      descripcionModeloLocal: "",
      revisionBasePorModelo,
      dirty,
      dirtyModelo: dirty,
      requiereLogin: false,
      mensaje: message,
      readOnly: state.readOnly,
      esBibliotecaAbierta: state.esBibliotecaAbierta,
      puedeDeshacer: undo.length > 0,
      puedeRehacer: false,
    }),
    pestanasAbiertas,
    pestanaActivaId: recoveredTab.id,
    modeloPersistidoId: persistentId,
  });
  return true;
}

const localCheckpointQueues = new Map<string, Promise<void>>();

function queueLocalDocumentCheckpoint(documentId: string): void {
  const identity = getDocumentLocalIdentity();
  if (identity.status !== "authenticated" && identity.status !== "offline") return;
  const input = localDocumentSnapshotInput(documentId);
  if (!input) return;
  const repository = getLocalDocumentRepository();
  const key = JSON.stringify([identity.identity.tenantId, identity.identity.userId, documentId]);
  repository.setWriteStatus(identity.identity, documentId, { state: "saving" });
  const previous = localCheckpointQueues.get(key) ?? Promise.resolve();
  const current = previous.catch(() => undefined).then(async () => {
    const existing = await repository.loadDocument(identity.identity, documentId);
    await repository.saveHere({
      identity: identity.identity,
      documentId,
      snapshotJson: input.snapshotJson,
      initialSnapshotJson: input.initialSnapshotJson,
      ...(!existing && input.remoteBase ? { remoteBase: input.remoteBase } : {}),
      expectedLocalRevision: existing?.localRevision ?? 0,
      history: input.history,
    });
    repository.setWriteStatus(identity.identity, documentId, { state: "saved" });
  }).catch((error: unknown) => {
    repository.setWriteStatus(identity.identity, documentId, {
      state: "error",
      message: isQuotaError(error) ? "No hay espacio local; el trabajo sigue en memoria" : error instanceof Error ? error.message : "No se pudo guardar la copia local",
    });
  });
  localCheckpointQueues.set(key, current);
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
  const documentoHistorial = actual
    ? extra.modeloPersistidoId !== undefined
      ? extra.modeloPersistidoId ?? `local:${actual.pestanaActivaId}`
      : documentIdForState(actual)
    : null;
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
            modelo: clonarModelo(modeloSincronizado),
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
    puedeDeshacer: documentoHistorial ? puedeDeshacerDocumento(documentoHistorial, undoStack.length) : undoStack.length > 0,
    puedeRehacer: documentoHistorial ? puedeRehacerDocumento(documentoHistorial) : redoStack.length > 0,
    ...(pestanasAbiertas ? { pestanasAbiertas } : {}),
    // Brechas B3/B4: al cargar/reemplazar modelo, limpiar cualquier diálogo de colisión
    // o creación pendiente que pudiera haber quedado abierto.
    colisionPendiente: null,
    nuevaCosaPendiente: null,
    refinamientoPendiente: null,
    confirmacionEliminarRefinamiento: null,
    confirmacionDevolverBoceto: null,
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
  const documentId = documentIdForState(get());
  const barrier = intentHistory.undoBarrier(documentId);
  if (barrier !== null && undoStack.length <= barrier) {
    if (undoStack.length < barrier) {
      set({ mensaje: "El historial anterior está protegido hasta resolver el cambio remoto", puedeDeshacer: false });
      return;
    }
    const entry = intentHistory.undoCandidate(documentId, undoStack.length);
    if (!entry) {
      set({ mensaje: "La reversión remota ya está en curso", puedeDeshacer: false });
      return;
    }
    const inverse = validateInverse(modelo, entry.inverse);
    if (inverse.kind === "conflict") {
      intentHistory.markUndoConflict(documentId, entry.changeId, inverse);
      set({ mensaje: `No se pudo deshacer ${entry.changeId}: ${inverse.reason}`, puedeDeshacer: true });
      return;
    }
    intentHistory.markUndoPending(documentId, entry.changeId);
    if (!dispatchIntentHistoryAction("undo", entry)) {
      intentHistory.cancelUndoPending(documentId, entry.changeId);
      set({ mensaje: "No hay un canal de operación para revertir este cambio", puedeDeshacer: true });
      return;
    }
    set({ mensaje: "Revirtiendo el cambio confirmado…", puedeDeshacer: false });
    return;
  }
  const previo = undoStack.at(-1);
  if (!previo) {
    set({ mensaje: "No hay cambios para deshacer", puedeDeshacer: false });
    return;
  }
  const historyBase = legacyHistoryRebase.get(documentId);
  let undoTarget = previo;
  if (historyBase) {
    const rebased = mergePreparedModelEdit(historyBase.base, historyBase.remote, previo);
    if (rebased.kind === "conflict") {
      retainPendingConflict({
        documentId,
        pendingId: `${documentId}:history-undo:${historyBase.changeId}:${undoStack.length}`,
        candidate: previo,
        change: null,
        status: "conflict",
        reason: "El paso de historial requiere revisar cambios remotos concurrentes",
        references: rebased.paths,
      });
      set({ mensaje: "No se pudo deshacer sin afectar cambios remotos; el snapshot queda disponible para revisión" });
      return;
    }
    const checked = validateRebasedModel(modelo, rebased.model, opdActivoId);
    if (!checked.ok) {
      set({ mensaje: `El snapshot no se puede rebasar: ${checked.error}` });
      return;
    }
    undoTarget = checked.model;
  }
  const controller = getDocumentOperationsController(documentId);
  if (controller.snapshot().reservation) {
    const prepared = controller.prepareHumanEdit({ base: modelo, candidate: undoTarget, payload: { extra: {}, change: null, history: "undo" } });
    if (prepared) {
      const event: RuntimePendingCommit = { documentId, pendingId: prepared.id, candidate: undoTarget, change: null, status: "prepared" };
      for (const listener of pendingCommitListeners) listener(event);
      set({ mensaje: "Deshacer preparado; se aplicará cuando llegue el recibo del commit" });
    }
    return;
  }
  const bloqueoAbanico = mensajeBloqueoCambioAbanicoHeredado(modelo, undoTarget, opdActivoId, "historial");
  if (bloqueoAbanico) {
    set({ mensaje: bloqueoAbanico });
    return;
  }
  undoStack = undoStack.slice(0, -1);
  redoStack = [modelo, ...redoStack].slice(0, UNDO_LIMIT);
  set(estadoModelo(undoTarget, {
    opdActivoId: opdActivoSeguro(undoTarget, opdActivoId),
    seleccionId: null,
    enlaceSeleccionId: null,
    estadoSeleccionId: null,
    modoEnlace: null,
    modoCreacion: null,
    mensaje: "Cambio deshecho",
  }));
  controller.recordAppliedEdit();
}

export function rehacerRuntime(set: SetStore, get: GetStore): void {
  const { modelo, opdActivoId } = get();
  const documentId = documentIdForState(get());
  const semantic = intentHistory.reapplyCandidate(documentId);
  if (semantic && redoStack.length === 0) {
    if (!intentHistory.markReapplyPending(documentId, semantic.changeId)) return;
    if (!dispatchIntentHistoryAction("reapply", semantic)) {
      intentHistory.cancelReapplyPending(documentId, semantic.changeId);
      set({ mensaje: "No hay un canal de operación para reaplicar este cambio", puedeRehacer: true });
      return;
    }
    set({ mensaje: "Reaplicando el cambio confirmado…", puedeRehacer: false });
    return;
  }
  const siguiente = redoStack[0];
  if (!siguiente) {
    set({ mensaje: "No hay cambios para rehacer", puedeRehacer: false });
    return;
  }
  let redoTarget = siguiente;
  const historyBase = legacyHistoryRebase.get(documentId);
  if (historyBase) {
    const rebased = mergePreparedModelEdit(historyBase.base, siguiente, modelo);
    if (rebased.kind === "conflict") {
      retainPendingConflict({
        documentId,
        pendingId: `${documentId}:history-redo:${historyBase.changeId}:${redoStack.length}`,
        candidate: siguiente,
        change: null,
        status: "conflict",
        reason: "El paso de rehacer requiere revisar cambios remotos concurrentes",
        references: rebased.paths,
      });
      set({ mensaje: "No se pudo rehacer sin afectar cambios remotos; el snapshot queda disponible para revisión" });
      return;
    }
    const checked = validateRebasedModel(modelo, rebased.model, opdActivoId);
    if (!checked.ok) {
      set({ mensaje: `El snapshot no se puede rebasar: ${checked.error}` });
      return;
    }
    redoTarget = checked.model;
  }
  const bloqueoAbanico = mensajeBloqueoCambioAbanicoHeredado(modelo, redoTarget, opdActivoId, "historial");
  if (bloqueoAbanico) {
    set({ mensaje: bloqueoAbanico });
    return;
  }
  const controller = getDocumentOperationsController(documentId);
  if (controller.snapshot().reservation) {
    const prepared = controller.prepareHumanEdit({ base: modelo, candidate: redoTarget, payload: { extra: {}, change: null, history: "redo" } });
    if (prepared) {
      const event: RuntimePendingCommit = { documentId, pendingId: prepared.id, candidate: redoTarget, change: null, status: "prepared" };
      for (const listener of pendingCommitListeners) listener(event);
      set({ mensaje: "Rehacer preparado; se aplicará cuando llegue el recibo del commit" });
    }
    return;
  }
  redoStack = redoStack.slice(1);
  undoStack = [...undoStack, modelo].slice(-UNDO_LIMIT);
  set(estadoModelo(siguiente, {
    opdActivoId: opdActivoSeguro(redoTarget, opdActivoId),
    seleccionId: null,
    enlaceSeleccionId: null,
    estadoSeleccionId: null,
    modoEnlace: null,
    modoCreacion: null,
    mensaje: "Cambio rehecho",
  }));
  controller.recordAppliedEdit();
}

function dispatchIntentHistoryAction(action: "undo" | "reapply", entry: IntentHistoryEntry): boolean {
  if (intentActionListeners.size === 0) return false;
  for (const listener of intentActionListeners) listener(action, entry);
  return true;
}

function puedeDeshacerDocumento(documentId: string, depth: number): boolean {
  const barrier = intentHistory.undoBarrier(documentId);
  if (barrier === null) return depth > 0;
  if (depth > barrier) return true;
  return depth === barrier && intentHistory.undoCandidate(documentId, depth) !== null;
}

function puedeRehacerDocumento(documentId: string): boolean {
  return redoStack.length > 0 || intentHistory.reapplyCandidate(documentId) !== null;
}
