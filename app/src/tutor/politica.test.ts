import { describe, expect, test } from "bun:test";
import type {
  CompositionIntentSnapshot,
  FichaLocalIntentSnapshot,
  PersistenceIntentSnapshot,
  RefineIntentSnapshot,
  SimulationIntentSnapshot,
  TutorCandidate,
} from "./tipos";
import {
  arbitrateTutorCandidates,
  normalizeKnowledgeLenses,
  runTutorPolicy,
} from "./politica";
import {
  deriveElementIntent,
  deriveEntryIntent,
  deriveKnowledgeIntent,
  deriveLinkDesignIntent,
  deriveNumericSimulationIntent,
  deriveReuseIntent,
  deriveViewIntent,
} from "./adaptadores";

const refineIntent: RefineIntentSnapshot = {
  kind: "refine",
  intentId: "intent-refine-1",
  actionId: "contextual:inzoom",
  surface: "selection-annotation",
  interactionMode: "editable",
  mode: "decomposition",
  stage: "question",
  questionComplete: false,
  integrityBlocked: false,
  activeLenses: [],
};

const simulationIntent: SimulationIntentSnapshot = {
  kind: "simulation",
  intentId: "intent-sim-1",
  actionId: "simulation:step",
  surface: "simulation-bar",
  interactionMode: "simulation",
  phase: "running",
  firstUse: false,
};

describe("politica pura del tutor", () => {
  test("es total y silent es una salida explicita", () => {
    expect(runTutorPolicy(refineIntent).kind).toBe("ask");
    expect(runTutorPolicy(simulationIntent)).toEqual({
      kind: "silent",
      intentId: "intent-sim-1",
      reason: "no-candidate",
    });
  });

  test("distingue ask, orient, confirm y block por consecuencia real", () => {
    expect(runTutorPolicy(refineIntent).kind).toBe("ask");
    expect(runTutorPolicy({ ...refineIntent, questionComplete: true }).kind).toBe("orient");
    expect(runTutorPolicy({
      ...refineIntent,
      stage: "confirmed",
      questionComplete: true,
      integrityBlocked: false,
      resultId: "refinement-1",
    }).kind).toBe("confirm");
    expect(runTutorPolicy({ ...refineIntent, integrityBlocked: true }).kind).toBe("block");
  });

  test("aplica la prioridad canonica antes del identificador estable", () => {
    const candidates: TutorCandidate[] = [
      candidate("content.optional", "optional-teaching"),
      candidate("content.loss", "loss-or-concurrency"),
      candidate("content.integrity", "integrity"),
      candidate("content.decision", "human-decision"),
    ];

    const result = arbitrateTutorCandidates(candidates, { intentId: "intent-1" });
    expect(result.kind).toBe("block");
    if (result.kind !== "silent") {
      expect(result.contentId).toBe("content.integrity");
      expect(result.priority).toBe("integrity");
    }
  });

  test("permanece determinista ante permutaciones equivalentes", () => {
    const candidates: TutorCandidate[] = [
      candidate("content.zeta", "consequence"),
      candidate("content.alfa", "consequence"),
      candidate("content.media", "consequence"),
    ];

    const context = { intentId: "intent-1" };
    expect(arbitrateTutorCandidates(candidates, context)).toEqual(arbitrateTutorCandidates([...candidates].reverse(), context));
  });

  test("deduplica por intentId y resultId frente a otros propietarios", () => {
    const candidateWithResult: TutorCandidate = {
      ...candidate("content.result", "consequence"),
      resultId: "result-1",
    };

    expect(arbitrateTutorCandidates([candidateWithResult], { intentId: "intent-1", resultId: "result-1" }, [{ owner: "flash", resultId: "result-1" }])).toEqual({
      kind: "silent",
      intentId: "intent-1",
      resultId: "result-1",
      reason: "already-owned",
    });
    expect(arbitrateTutorCandidates([candidateWithResult], { intentId: "intent-1", resultId: "result-1" }, [{ owner: "diagnostic", intentId: "intent-1" }])).toEqual({
      kind: "silent",
      intentId: "intent-1",
      resultId: "result-1",
      reason: "already-owned",
    });
  });

  test("un diagnostico persistente no relacionado puede coexistir", () => {
    const result = arbitrateTutorCandidates(
      [{ ...candidate("content.result", "consequence"), resultId: "result-1" }],
      { intentId: "intent-1", resultId: "result-1" },
      [{ owner: "diagnostic", resultId: "result-unrelated" }],
    );

    expect(result.kind).toBe("confirm");
  });

  test("normaliza enfoques con orden canonico e idempotencia", () => {
    expect(normalizeKnowledgeLenses(["health", "systems", "health", "software"])).toEqual([
      "systems",
      "software",
      "health",
    ]);
    expect(normalizeKnowledgeLenses(normalizeKnowledgeLenses(["software", "systems"]))).toEqual([
      "systems",
      "software",
    ]);
  });

  test("resuelve composicion por campos propios sin contentId de entrada", () => {
    const preflight: CompositionIntentSnapshot = {
      kind: "composition",
      intentId: "intent-composition",
      actionId: "composition:apply",
      surface: "composition-dialog",
      interactionMode: "editable",
      activeLenses: ["software", "systems"],
      phase: "preflight",
      mappingResolvable: true,
      integrityBlocked: false,
      linealityConflict: false,
    };

    expect(runTutorPolicy(preflight).kind).toBe("orient");
    expect(runTutorPolicy({ ...preflight, mappingResolvable: false }).kind).toBe("block");
    const lineality = runTutorPolicy({ ...preflight, linealityConflict: true });
    expect(lineality.kind).toBe("orient");
    if (lineality.kind !== "silent") expect(lineality.contentId).toBe("content.composition.preservation");
    const applied = runTutorPolicy({
      ...preflight,
      phase: "applied",
      mappingResolvable: true,
      integrityBlocked: false,
      resultId: "composition-result-1",
    });
    expect(applied.kind).toBe("confirm");
    if (applied.kind !== "silent") expect(applied.contentId).toBe("content.composition.confirmed");
  });

  test("separa ficha local editable de la ficha upstream externa", () => {
    const ficha: FichaLocalIntentSnapshot = {
      kind: "ficha-local",
      intentId: "intent-ficha-local",
      actionId: "inspector:ficha-pregunta-habilitante",
      surface: "inspector",
      interactionMode: "editable",
      activeLenses: ["systems"],
      field: "pregunta-habilitante",
      phase: "editing",
      valueChanged: true,
      hasUpstreamProvenance: false,
    };

    expect(runTutorPolicy(ficha).kind).toBe("orient");
    expect(runTutorPolicy({ ...ficha, valueChanged: false }).kind).toBe("silent");
    const committed = runTutorPolicy({
      ...ficha,
      intentId: "intent-ficha-lentes",
      resultId: "ficha-result-1",
      actionId: "inspector:ficha-lentes-conocimiento",
      field: "lentes-conocimiento",
      phase: "committed",
      valueChanged: true,
    });
    expect(committed.kind).toBe("confirm");
    if (committed.kind !== "silent") expect(committed.contentId).toBe("content.ficha.local");
  });

  test("distingue riesgo y resultado en operaciones persistentes tipadas", () => {
    const importActive: PersistenceIntentSnapshot = {
      kind: "persistence",
      intentId: "intent-import-active",
      actionId: "workspace:import-active",
      surface: "workspace-manager",
      interactionMode: "editable",
      operation: "import-active",
      phase: "decision",
      hasUnsavedChanges: true,
      destructiveConfirmed: false,
    };

    expect(runTutorPolicy(importActive).kind).toBe("confirm");
    expect(runTutorPolicy({
      ...importActive,
      actionId: "workspace:import-new-tab",
      operation: "import-new",
      hasUnsavedChanges: false,
    }).kind).toBe("orient");
    const deleteVersion = runTutorPolicy({
      ...importActive,
      intentId: "intent-version-delete",
      actionId: "workspace:delete-version",
      surface: "modal",
      operation: "version-delete",
      hasUnsavedChanges: false,
    });
    expect(deleteVersion.kind).toBe("confirm");
    if (deleteVersion.kind !== "silent") {
      expect(deleteVersion.actionId).toBe("workspace:delete-version");
      expect(deleteVersion.contentId).toBe("content.history.version-mutation");
    }
    const exported = runTutorPolicy({
      ...importActive,
      intentId: "intent-export",
      resultId: "export-result-1",
      actionId: "palette:exportar-json",
      surface: "command-palette",
      operation: "export",
      phase: "confirmed",
      destructiveConfirmed: true,
    });
    expect(exported.kind).toBe("confirm");
    if (exported.kind !== "silent") expect(exported.contentId).toBe("content.export.interchange");
  });

  test("cada adaptador rechaza campos ajenos a su variante", () => {
    if (false) {
      // @ts-expect-error start no consume integridad de composición
      deriveEntryIntent({ intentId: "type-entry", focus: "start", operation: "new-note", tabsBefore: 1, tabsAfter: 1, integrityBlocked: true });
      // @ts-expect-error elemento no consume dirty de persistencia
      deriveElementIntent({ intentId: "type-element", focus: "kind", chosenKind: "object", hasUnsavedChanges: true });
      // @ts-expect-error enlace no consume conteos OPL
      deriveLinkDesignIntent({ intentId: "type-link", focus: "procedural", endpointsReady: true, selectedType: "consumo", recognizedLines: 2 });
      // @ts-expect-error vista no consume procedencia de ficha
      deriveViewIntent({ intentId: "type-view", focus: "mobile-read", editable: false, hasUpstreamProvenance: true });
      // @ts-expect-error conocimiento no consume conflicto de linealidad
      deriveKnowledgeIntent({ intentId: "type-knowledge", focus: "ontology", termCount: 1, automaticConsumerAvailable: false, linealityConflict: true });
      // @ts-expect-error reuso no consume evidencia externa de requisito
      deriveReuseIntent({ intentId: "type-reuse", focus: "pieces", originSelected: true, choice: null, externalEvidencePresent: true });
      // @ts-expect-error simulación numérica no consume factsPreserved de lifecycle
      deriveNumericSimulationIntent({ intentId: "type-numeric", phase: "configure", configuredAttributeCount: 1, factsPreserved: true });
    }
    expect(true).toBeTrue();
  });
});

function candidate(contentId: TutorCandidate["contentId"], priority: TutorCandidate["priority"]): TutorCandidate {
  return {
    intentId: "intent-1",
    actionId: "test:action",
    surface: "selection-annotation",
    contentId,
    priority,
    activeLenses: [],
  };
}
