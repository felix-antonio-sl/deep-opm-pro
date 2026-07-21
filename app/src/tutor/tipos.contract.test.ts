import { describe, expect, test } from "bun:test";
import type { TutorIntentSnapshot } from "./tipos";

const core = { intentId: "contract-intent", interactionMode: "editable" } as const;
const lenses = { activeLenses: [] } as const;
const refine = { ...core, ...lenses, kind: "refine", surface: "selection-annotation" } as const;
const simulation = { intentId: "contract-simulation", kind: "simulation", surface: "simulation-bar", interactionMode: "simulation", firstUse: false } as const;
const composition = { ...core, ...lenses, kind: "composition", actionId: "composition:apply", surface: "composition-dialog", mappingResolvable: true, integrityBlocked: false, linealityConflict: false } as const;
const ficha = { ...core, ...lenses, kind: "ficha-local", surface: "inspector", hasUpstreamProvenance: false } as const;
const persistence = { ...core, kind: "persistence", hasUnsavedChanges: false, destructiveConfirmed: false } as const;
const entry = { ...core, kind: "entry" } as const;
const element = { ...core, kind: "element" } as const;
const link = { ...core, kind: "link-design", surface: "inspector" } as const;
const view = { ...core, kind: "view" } as const;
const knowledge = { ...core, kind: "knowledge" } as const;
const reuse = { ...core, kind: "reuse" } as const;
const numeric = { ...core, ...lenses, kind: "numeric-simulation", surface: "numeric-simulation-dialog", configuredAttributeCount: 2, modelsProcessDynamics: false } as const;

const VALID_SNAPSHOTS = [
  { ...refine, actionId: "contextual:inzoom", mode: "decomposition", stage: "question", questionComplete: false, integrityBlocked: false },
  { ...refine, actionId: "contextual:inzoom", mode: "decomposition", stage: "confirmed", questionComplete: true, integrityBlocked: false, resultId: "refine-inzoom" },
  { ...refine, actionId: "contextual:unfold", mode: "unfold", stage: "question", questionComplete: true, integrityBlocked: false },
  { ...refine, actionId: "contextual:unfold", mode: "unfold", stage: "confirmed", questionComplete: true, integrityBlocked: false, resultId: "refine-unfold" },
  { ...refine, actionId: "tree:adopt-refinement", mode: "adoption", stage: "question", questionComplete: false, integrityBlocked: true },
  { ...refine, actionId: "tree:adopt-refinement", mode: "adoption", stage: "confirmed", questionComplete: true, integrityBlocked: false, resultId: "refine-adopt" },

  { ...simulation, actionId: "simulation:decision", phase: "decision" },
  { ...simulation, actionId: "simulation:step", phase: "preflight" },
  { ...simulation, actionId: "simulation:step", phase: "blocked" },
  { ...simulation, actionId: "simulation:step", phase: "running" },
  { ...simulation, actionId: "simulation:step", phase: "step", resultId: "simulation-step" },
  { ...simulation, actionId: "simulation:step", phase: "complete", resultId: "simulation-complete" },

  { ...composition, phase: "preflight" },
  { ...composition, phase: "choice", mappingResolvable: false },
  { ...composition, phase: "applied", resultId: "composition-result" },

  { ...ficha, field: "pregunta-habilitante", actionId: "inspector:ficha-pregunta-habilitante", phase: "editing", valueChanged: false },
  { ...ficha, field: "pregunta-habilitante", actionId: "inspector:ficha-pregunta-habilitante", phase: "committed", valueChanged: true, resultId: "ficha-pregunta" },
  { ...ficha, field: "dueno-significado", actionId: "inspector:ficha-dueno-significado", phase: "editing", valueChanged: true },
  { ...ficha, field: "dueno-significado", actionId: "inspector:ficha-dueno-significado", phase: "committed", valueChanged: true, resultId: "ficha-dueno" },
  { ...ficha, field: "responsable-decision", actionId: "inspector:ficha-responsable-decision", phase: "editing", valueChanged: true },
  { ...ficha, field: "responsable-decision", actionId: "inspector:ficha-responsable-decision", phase: "committed", valueChanged: true, resultId: "ficha-responsable" },
  { ...ficha, field: "tipos-modelo", actionId: "inspector:ficha-tipos-modelo", phase: "editing", valueChanged: true },
  { ...ficha, field: "tipos-modelo", actionId: "inspector:ficha-tipos-modelo", phase: "committed", valueChanged: true, resultId: "ficha-tipos" },
  { ...ficha, field: "criterio-suficiencia", actionId: "inspector:ficha-criterio-suficiencia", phase: "editing", valueChanged: true },
  { ...ficha, field: "criterio-suficiencia", actionId: "inspector:ficha-criterio-suficiencia", phase: "committed", valueChanged: true, resultId: "ficha-criterio" },
  { ...ficha, field: "vida-util", actionId: "inspector:ficha-vida-util", phase: "editing", valueChanged: true },
  { ...ficha, field: "vida-util", actionId: "inspector:ficha-vida-util", phase: "committed", valueChanged: true, resultId: "ficha-vida" },
  { ...ficha, field: "revisar-cuando", actionId: "inspector:ficha-revisar-cuando", phase: "editing", valueChanged: true },
  { ...ficha, field: "revisar-cuando", actionId: "inspector:ficha-revisar-cuando", phase: "committed", valueChanged: true, resultId: "ficha-revisar" },
  { ...ficha, field: "lentes-conocimiento", actionId: "inspector:ficha-lentes-conocimiento", phase: "editing", valueChanged: true },
  { ...ficha, field: "lentes-conocimiento", actionId: "inspector:ficha-lentes-conocimiento", phase: "committed", valueChanged: true, resultId: "ficha-lentes" },

  { ...persistence, operation: "import-active", actionId: "workspace:import-active", surface: "workspace-manager", phase: "decision" },
  { ...persistence, operation: "import-active", actionId: "workspace:import-active", surface: "workspace-manager", phase: "confirmed", resultId: "import-active" },
  { ...persistence, operation: "import-new", actionId: "workspace:import-new-tab", surface: "workspace-manager", phase: "decision" },
  { ...persistence, operation: "import-new", actionId: "workspace:import-new-tab", surface: "workspace-manager", phase: "confirmed", resultId: "import-new" },
  { ...persistence, operation: "version-create", actionId: "workspace:create-version", surface: "modal", phase: "decision" },
  { ...persistence, operation: "version-create", actionId: "workspace:create-version", surface: "modal", phase: "confirmed", resultId: "version-create" },
  { ...persistence, operation: "version-delete", actionId: "workspace:delete-version", surface: "modal", phase: "decision" },
  { ...persistence, operation: "version-delete", actionId: "workspace:delete-version", surface: "modal", phase: "confirmed", resultId: "version-delete" },
  { ...persistence, operation: "version-restore-copy", actionId: "workspace:restore-version-copy", surface: "modal", phase: "decision" },
  { ...persistence, operation: "version-restore-copy", actionId: "workspace:restore-version-copy", surface: "modal", phase: "confirmed", resultId: "version-restore" },
  { ...persistence, operation: "export", actionId: "palette:exportar-json", surface: "command-palette", phase: "decision" },
  { ...persistence, operation: "export", actionId: "palette:exportar-json", surface: "command-palette", phase: "confirmed", resultId: "export-json" },

  { ...entry, focus: "start", surface: "command-palette", operation: "new-note", actionId: "palette:nuevo-modelo", phase: "choice", tabsBefore: 1, tabsAfter: 1 },
  { ...entry, focus: "start", surface: "command-palette", operation: "new-note", actionId: "palette:nuevo-modelo", phase: "committed", tabsBefore: 1, tabsAfter: 2 },
  { ...entry, focus: "start", surface: "command-palette", operation: "duplicate-tab", actionId: "palette:abrir-pestana", phase: "choice", tabsBefore: 1, tabsAfter: 1 },
  { ...entry, focus: "start", surface: "command-palette", operation: "duplicate-tab", actionId: "palette:abrir-pestana", phase: "committed", tabsBefore: 1, tabsAfter: 2 },
  { ...entry, focus: "lifecycle", surface: "modal", transition: "graduate", actionId: "workspace:graduate-model", phase: "decision", factsPreserved: true },
  { ...entry, focus: "lifecycle", surface: "modal", transition: "graduate-library", actionId: "workspace:graduate-library", phase: "decision", factsPreserved: true },
  { ...entry, focus: "lifecycle", surface: "modal", transition: "mark-library", actionId: "workspace:mark-library", phase: "decision", factsPreserved: true },
  { ...entry, focus: "lifecycle", surface: "modal", transition: "unmark-library", actionId: "workspace:unmark-library", phase: "decision", factsPreserved: true },
  { ...entry, focus: "degrade", surface: "command-palette", actionId: "tutor:search", transitionAvailable: false },
  { ...entry, ...lenses, focus: "purpose", surface: "empty-state", actionId: "empty-state:choose-entry", strategy: null, purposePresent: false },

  { ...element, ...lenses, focus: "kind", actionId: "canvas:create-object-process", surface: "canvas", chosenKind: null },
  { ...element, focus: "properties", actionId: "inspector:entity-properties", surface: "inspector", property: "essence", logicalIdentityChanges: false },
  { ...element, ...lenses, focus: "state", actionId: "inspector:state-lifecycle", surface: "inspector", ownerKind: "object", declaredCurrent: true, runtimeCurrent: false },

  { ...link, focus: "procedural", actionId: "inspector:link-procedural", endpointsReady: true, selectedType: "consumo" },
  { ...link, focus: "structural", actionId: "inspector:link-structural", selectedRelation: "aggregation" },
  { ...link, focus: "probabilistic-weights", actionId: "tutor:search", persistedWeightsAvailable: false },

  { ...view, focus: "appearance", actionId: "inspector:appearance", surface: "inspector", appearanceCount: 2, createsLogicalIdentity: false },
  { ...view, focus: "derived", actionId: "tree:derived-view", surface: "tree", readOnly: true, ownsFacts: false },
  { ...view, focus: "opl", actionId: "opl:apply-preview", surface: "opl-panel", recognizedLines: 1, unrecognizedLines: 0, previewVisible: true },
  { ...view, ...lenses, focus: "navigation", actionId: "palette:buscar-modelo", surface: "command-palette", query: "modelo", resultCount: 1, causalClaim: false },
  { ...view, ...lenses, focus: "discovery", actionId: "tutor:search", surface: "command-palette", query: "frontera", contentMatches: 1, sourceMatches: 1 },
  { ...view, focus: "mobile-read", actionId: "mobile:read-context", surface: "mobile-read", editable: false },
  { ...view, focus: "outzoom", actionId: "tutor:search", surface: "command-palette", mutationAvailable: false },

  { ...knowledge, ...lenses, focus: "requirement", operation: "create", actionId: "requirement:create", surface: "inspector", coverageDeclared: false, externalEvidencePresent: false },
  { ...knowledge, ...lenses, focus: "requirement", operation: "mark", actionId: "requirement:mark", surface: "inspector", coverageDeclared: true, externalEvidencePresent: false },
  { ...knowledge, ...lenses, focus: "requirement", operation: "satisfy", actionId: "requirement:satisfy", surface: "inspector", coverageDeclared: true, externalEvidencePresent: true },
  { ...knowledge, focus: "ontology", actionId: "ontology:save", surface: "modal", termCount: 2, automaticConsumerAvailable: false },
  { ...knowledge, ...lenses, focus: "evidence", route: "local-note", actionId: "inspector:note-add", surface: "inspector" },
  { ...knowledge, ...lenses, focus: "evidence", route: "normative-ratification", actionId: "inspector:anchor-ratify-source", surface: "inspector" },
  { ...knowledge, focus: "handoff", actionId: "palette:copiar-contexto-skill", surface: "command-palette", payloadReady: true, modelMutated: false },
  { ...knowledge, focus: "upstream-ficha", actionId: "tutor:search", surface: "inspector", hasUpstreamProvenance: true, localEditorAvailable: false },
  { ...knowledge, focus: "inference", actionId: "tutor:search", surface: "command-palette", localInferenceAvailable: false },
  { ...knowledge, focus: "certification", actionId: "tutor:search", surface: "command-palette", automaticCertificationAvailable: false },

  { ...reuse, focus: "pieces", actionId: "palette:vitrina-estereotipos", surface: "pieces", originSelected: true, anchorAvailable: true, choice: null },
  { ...reuse, focus: "pieces", actionId: "pieces:copy", surface: "pieces", originSelected: true, anchorAvailable: true, choice: "copy" },
  { ...reuse, focus: "pieces", actionId: "pieces:anchor", surface: "pieces", originSelected: true, anchorAvailable: true, choice: "anchor" },
  { ...reuse, focus: "anchor-drift", actionId: "inspector:anchor-drift", surface: "inspector", driftDetected: true, choice: null },
  { ...reuse, focus: "anchor-drift", actionId: "anchor:resync", surface: "inspector", driftDetected: true, choice: "resync" },
  { ...reuse, focus: "anchor-drift", actionId: "anchor:detach", surface: "inspector", driftDetected: true, choice: "detach" },
  { ...reuse, focus: "submodel", actionId: "palette:conectar-submodelo", surface: "modal", referenceLoaded: false, readOnly: true, phase: "choice" },
  { ...reuse, focus: "submodel", actionId: "submodel:connect-reference", surface: "modal", referenceLoaded: true, readOnly: true, phase: "connected" },
  { ...reuse, focus: "submodel", actionId: "submodel:open-reference", surface: "modal", referenceLoaded: true, readOnly: true, phase: "reading" },

  { ...numeric, actionId: "simulation:numeric-run", phase: "configure" },
  { ...numeric, actionId: "simulation:numeric-run", phase: "sampled" },
  { ...numeric, actionId: "simulation:numeric-csv", phase: "download" },

  { ...core, kind: "refinement-unavailable", actionId: "tutor:search", surface: "command-palette", operation: "unadopt", available: false },
  { ...core, kind: "export-unavailable", actionId: "tutor:search", surface: "command-palette", format: "pdf", available: false },
  { ...core, kind: "export-unavailable", actionId: "tutor:search", surface: "command-palette", format: "diff", available: false },
  { ...core, kind: "export-unavailable", actionId: "tutor:search", surface: "command-palette", format: "merge", available: false },
] as const satisfies readonly TutorIntentSnapshot[];

function acceptSnapshot(_snapshot: TutorIntentSnapshot): void {}

describe("contrato exhaustivo de snapshots del tutor", () => {
  test("enumera cada correlación viva de acción, fase, campo, transición y resultado", () => {
    expect(VALID_SNAPSHOTS).toHaveLength(92);
  });

  test("rechaza correlaciones imposibles y campos ajenos por familia", () => {
    if (false) {
      // @ts-expect-error in-zoom solo admite descomposición
      acceptSnapshot({ ...refine, actionId: "contextual:inzoom", mode: "unfold", stage: "question", questionComplete: false, integrityBlocked: false });
      // @ts-expect-error una pregunta no tiene resultado
      acceptSnapshot({ ...refine, actionId: "contextual:inzoom", mode: "decomposition", stage: "question", questionComplete: true, integrityBlocked: false, resultId: "premature" });
      // @ts-expect-error confirmar exige resultado, pregunta completa e integridad libre
      acceptSnapshot({ ...refine, actionId: "contextual:unfold", mode: "unfold", stage: "confirmed", questionComplete: false, integrityBlocked: true });
      // @ts-expect-error refinamiento no consume dirty de persistencia
      acceptSnapshot({ ...refine, actionId: "contextual:inzoom", mode: "decomposition", stage: "question", questionComplete: false, integrityBlocked: false, hasUnsavedChanges: true });

      // @ts-expect-error decision tiene entrypoint propio
      acceptSnapshot({ ...simulation, actionId: "simulation:step", phase: "decision" });
      // @ts-expect-error running todavía no tiene resultado
      acceptSnapshot({ ...simulation, actionId: "simulation:step", phase: "running", resultId: "premature" });
      // @ts-expect-error step exige un resultado correlacionado
      acceptSnapshot({ ...simulation, actionId: "simulation:step", phase: "step" });
      // @ts-expect-error simulación conceptual no consume mapeos de composición
      acceptSnapshot({ ...simulation, actionId: "simulation:step", phase: "preflight", mappingResolvable: true });

      // @ts-expect-error una decisión de composición no tiene resultado
      acceptSnapshot({ ...composition, phase: "choice", resultId: "premature" });
      // @ts-expect-error applied exige mapeo resoluble, integridad libre y resultado
      acceptSnapshot({ ...composition, phase: "applied", mappingResolvable: false, resultId: "invalid" });
      // @ts-expect-error composición no consume firstUse
      acceptSnapshot({ ...composition, phase: "preflight", firstUse: true });

      // @ts-expect-error campo y entrypoint de ficha deben coincidir
      acceptSnapshot({ ...ficha, field: "vida-util", actionId: "inspector:ficha-dueno-significado", phase: "editing", valueChanged: true });
      // @ts-expect-error edición no produce resultId
      acceptSnapshot({ ...ficha, field: "vida-util", actionId: "inspector:ficha-vida-util", phase: "editing", valueChanged: true, resultId: "premature" });
      // @ts-expect-error commit exige cambio y resultado
      acceptSnapshot({ ...ficha, field: "vida-util", actionId: "inspector:ficha-vida-util", phase: "committed", valueChanged: false });
      // @ts-expect-error ficha no consume transición de ciclo de vida
      acceptSnapshot({ ...ficha, field: "vida-util", actionId: "inspector:ficha-vida-util", phase: "editing", valueChanged: true, transition: "graduate" });

      // @ts-expect-error operación, acción y superficie persistente se correlacionan
      acceptSnapshot({ ...persistence, operation: "version-create", actionId: "workspace:delete-version", surface: "modal", phase: "decision" });
      // @ts-expect-error decisión persistente no tiene resultado
      acceptSnapshot({ ...persistence, operation: "export", actionId: "palette:exportar-json", surface: "command-palette", phase: "decision", resultId: "premature" });
      // @ts-expect-error confirmación persistente exige resultado
      acceptSnapshot({ ...persistence, operation: "version-delete", actionId: "workspace:delete-version", surface: "modal", phase: "confirmed" });
      // @ts-expect-error persistencia no consume activeLenses
      acceptSnapshot({ ...persistence, operation: "version-create", actionId: "workspace:create-version", surface: "modal", phase: "decision", activeLenses: [] });

      // @ts-expect-error transición y acción de ciclo de vida deben coincidir
      acceptSnapshot({ ...entry, focus: "lifecycle", surface: "modal", transition: "graduate", actionId: "workspace:mark-library", phase: "decision", factsPreserved: true });
      // @ts-expect-error entrada no consume selectedType
      acceptSnapshot({ ...entry, focus: "degrade", surface: "command-palette", actionId: "tutor:search", transitionAvailable: false, selectedType: "consumo" });
      // @ts-expect-error elemento no consume conteos OPL
      acceptSnapshot({ ...element, ...lenses, focus: "kind", actionId: "canvas:create-object-process", surface: "canvas", chosenKind: "object", recognizedLines: 1 });
      // @ts-expect-error enlace estructural no consume campos procedurales
      acceptSnapshot({ ...link, focus: "structural", actionId: "inspector:link-structural", selectedRelation: "aggregation", endpointsReady: true });
      // @ts-expect-error vista derivada no consume mutable identity
      acceptSnapshot({ ...view, focus: "derived", actionId: "tree:derived-view", surface: "tree", readOnly: true, ownsFacts: false, logicalIdentityChanges: false });
      // @ts-expect-error requisito correlaciona operación y acción
      acceptSnapshot({ ...knowledge, ...lenses, focus: "requirement", operation: "create", actionId: "requirement:satisfy", surface: "inspector", coverageDeclared: false, externalEvidencePresent: false });
      // @ts-expect-error reuso de piezas no consume drift
      acceptSnapshot({ ...reuse, focus: "pieces", actionId: "pieces:copy", surface: "pieces", originSelected: true, anchorAvailable: true, choice: "copy", driftDetected: true });
      // @ts-expect-error CSV solo corresponde a download
      acceptSnapshot({ ...numeric, actionId: "simulation:numeric-csv", phase: "sampled" });
      // @ts-expect-error refinamiento ausente no consume formato de exportación
      acceptSnapshot({ ...core, kind: "refinement-unavailable", actionId: "tutor:search", surface: "command-palette", operation: "unadopt", available: false, format: "pdf" });
      // @ts-expect-error exportación ausente no consume operación de refinamiento
      acceptSnapshot({ ...core, kind: "export-unavailable", actionId: "tutor:search", surface: "command-palette", format: "pdf", available: false, operation: "unadopt" });
    }
    expect(true).toBeTrue();
  });
});
