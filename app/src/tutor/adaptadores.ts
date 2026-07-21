import type {
  ElementIntentSnapshot,
  EntryIntentSnapshot,
  ExportUnavailableIntentSnapshot,
  FichaLocalIntentSnapshot,
  KnowledgeIntentSnapshot,
  KnowledgeLens,
  LinkDesignIntentSnapshot,
  NumericSimulationIntentSnapshot,
  RefinementUnavailableIntentSnapshot,
  ReuseIntentSnapshot,
  ViewIntentSnapshot,
} from "./tipos";

interface LensAwareAdapter {
  activeLenses?: readonly KnowledgeLens[];
}

interface AdapterBase extends LensAwareAdapter {
  intentId: string;
}

export type EntryTutorState = AdapterBase & (
  | { focus: "start"; operation: "new-note" | "duplicate-tab"; tabsBefore: number; tabsAfter: number }
  | { focus: "lifecycle"; transition: "graduate" | "graduate-library" | "mark-library" | "unmark-library"; factsPreserved: boolean }
  | { focus: "degrade"; transitionAvailable: false }
  | ({ focus: "purpose"; strategy: "sd-first" | "workshop" | null; purposePresent: boolean } & LensAwareAdapter)
);

export function deriveEntryIntent(state: EntryTutorState): EntryIntentSnapshot {
  const base = adapterBase(state);
  switch (state.focus) {
    case "start":
      if (state.operation === "new-note") {
        return {
          ...base,
          kind: "entry",
          focus: "start",
          actionId: "palette:nuevo-modelo",
          surface: "command-palette",
          operation: "new-note",
          phase: state.tabsAfter > state.tabsBefore ? "committed" : "choice",
          tabsBefore: state.tabsBefore,
          tabsAfter: state.tabsAfter,
        };
      }
      return {
        ...base,
        kind: "entry",
        focus: "start",
        actionId: "palette:abrir-pestana",
        surface: "command-palette",
        operation: "duplicate-tab",
        phase: state.tabsAfter > state.tabsBefore ? "committed" : "choice",
        tabsBefore: state.tabsBefore,
        tabsAfter: state.tabsAfter,
      };
    case "lifecycle":
      switch (state.transition) {
        case "graduate":
          return { ...base, kind: "entry", focus: "lifecycle", actionId: "workspace:graduate-model", surface: "modal", transition: "graduate", phase: "decision", factsPreserved: state.factsPreserved };
        case "graduate-library":
          return { ...base, kind: "entry", focus: "lifecycle", actionId: "workspace:graduate-library", surface: "modal", transition: "graduate-library", phase: "decision", factsPreserved: state.factsPreserved };
        case "mark-library":
          return { ...base, kind: "entry", focus: "lifecycle", actionId: "workspace:mark-library", surface: "modal", transition: "mark-library", phase: "decision", factsPreserved: state.factsPreserved };
        case "unmark-library":
          return { ...base, kind: "entry", focus: "lifecycle", actionId: "workspace:unmark-library", surface: "modal", transition: "unmark-library", phase: "decision", factsPreserved: state.factsPreserved };
      }
    case "degrade":
      return {
        ...base,
        kind: "entry",
        focus: "degrade",
        actionId: "tutor:search",
        surface: "command-palette",
        transitionAvailable: false,
      };
    case "purpose":
      return {
        ...base,
        ...lensContext(state),
        kind: "entry",
        focus: "purpose",
        actionId: "empty-state:choose-entry",
        surface: "empty-state",
        strategy: state.strategy,
        purposePresent: state.purposePresent,
      };
  }
}

export type FichaLocalTutorState = AdapterBase & LensAwareAdapter & {
  field:
    | "pregunta-habilitante"
    | "dueno-significado"
    | "responsable-decision"
    | "tipos-modelo"
    | "criterio-suficiencia"
    | "vida-util"
    | "revisar-cuando"
    | "lentes-conocimiento";
} & (
  | { phase: "editing"; valueChanged: boolean; resultId?: never }
  | { phase: "committed"; valueChanged: true; resultId: string }
);

export function deriveFichaLocalIntent(state: FichaLocalTutorState): FichaLocalIntentSnapshot {
  const base = {
    ...adapterBase(state),
    ...lensContext(state),
    kind: "ficha-local" as const,
    ...fichaLocalOperation(state.field),
    surface: "inspector" as const,
    interactionMode: "editable" as const,
    hasUpstreamProvenance: false as const,
    phase: state.phase,
    valueChanged: state.valueChanged,
  };
  return state.phase === "committed"
    ? { ...base, phase: "committed", valueChanged: true, resultId: state.resultId }
    : { ...base, phase: "editing", valueChanged: state.valueChanged };
}

export type ElementTutorState = AdapterBase & (
  | ({ focus: "kind"; chosenKind: "object" | "process" | null } & LensAwareAdapter)
  | { focus: "properties"; property: "essence" | "affiliation" | "alias" | "url" | "image" }
  | ({ focus: "state"; ownerKind: "object" | "process"; declaredCurrent: boolean; runtimeCurrent: boolean } & LensAwareAdapter)
);

export function deriveElementIntent(state: ElementTutorState): ElementIntentSnapshot {
  const base = adapterBase(state);
  switch (state.focus) {
    case "kind":
      return { ...base, ...lensContext(state), kind: "element", focus: "kind", actionId: "canvas:create-object-process", surface: "canvas", chosenKind: state.chosenKind };
    case "properties":
      return { ...base, kind: "element", focus: "properties", actionId: "inspector:entity-properties", surface: "inspector", property: state.property, logicalIdentityChanges: false };
    case "state":
      return { ...base, ...lensContext(state), kind: "element", focus: "state", actionId: "inspector:state-lifecycle", surface: "inspector", ownerKind: state.ownerKind, declaredCurrent: state.declaredCurrent, runtimeCurrent: state.runtimeCurrent };
  }
}

export type LinkTutorState = AdapterBase & (
  | { focus: "procedural"; endpointsReady: boolean; selectedType: string | null }
  | { focus: "structural"; selectedRelation: "aggregation" | "exhibition" | "generalization" | "instantiation" | null }
  | { focus: "probabilistic-weights"; persistedWeightsAvailable: false }
);

export function deriveLinkDesignIntent(state: LinkTutorState): LinkDesignIntentSnapshot {
  const base = adapterBase(state);
  switch (state.focus) {
    case "procedural":
      return { ...base, kind: "link-design", focus: "procedural", actionId: "inspector:link-procedural", surface: "inspector", endpointsReady: state.endpointsReady, selectedType: state.selectedType };
    case "structural":
      return { ...base, kind: "link-design", focus: "structural", actionId: "inspector:link-structural", surface: "inspector", selectedRelation: state.selectedRelation };
    case "probabilistic-weights":
      return { ...base, kind: "link-design", focus: "probabilistic-weights", actionId: "tutor:search", surface: "inspector", persistedWeightsAvailable: false };
  }
}

export type ViewTutorState = AdapterBase & (
  | { focus: "appearance"; appearanceCount: number }
  | { focus: "derived"; readOnly: true }
  | { focus: "opl"; recognizedLines: number; unrecognizedLines: number; previewVisible: boolean }
  | ({ focus: "navigation"; query: string; resultCount: number } & LensAwareAdapter)
  | ({ focus: "discovery"; query: string; contentMatches: number; sourceMatches: number } & LensAwareAdapter)
  | { focus: "mobile-read"; editable: false }
  | { focus: "outzoom"; mutationAvailable: false }
);

export function deriveViewIntent(state: ViewTutorState): ViewIntentSnapshot {
  const base = adapterBase(state);
  switch (state.focus) {
    case "appearance":
      return { ...base, kind: "view", focus: "appearance", actionId: "inspector:appearance", surface: "inspector", appearanceCount: state.appearanceCount, createsLogicalIdentity: false };
    case "derived":
      return { ...base, kind: "view", focus: "derived", actionId: "tree:derived-view", surface: "tree", readOnly: true, ownsFacts: false };
    case "opl":
      return { ...base, kind: "view", focus: "opl", actionId: "opl:apply-preview", surface: "opl-panel", recognizedLines: state.recognizedLines, unrecognizedLines: state.unrecognizedLines, previewVisible: state.previewVisible };
    case "navigation":
      return { ...base, ...lensContext(state), kind: "view", focus: "navigation", actionId: "palette:buscar-modelo", surface: "command-palette", query: state.query, resultCount: state.resultCount, causalClaim: false };
    case "discovery":
      return { ...base, ...lensContext(state), kind: "view", focus: "discovery", actionId: "tutor:search", surface: "command-palette", query: state.query, contentMatches: state.contentMatches, sourceMatches: state.sourceMatches };
    case "mobile-read":
      return { ...base, kind: "view", focus: "mobile-read", actionId: "mobile:read-context", surface: "mobile-read", editable: false };
    case "outzoom":
      return { ...base, kind: "view", focus: "outzoom", actionId: "tutor:search", surface: "command-palette", mutationAvailable: false };
  }
}

export type KnowledgeTutorState = AdapterBase & (
  | ({ focus: "requirement"; operation: "create" | "mark" | "satisfy"; coverageDeclared: boolean; externalEvidencePresent: boolean } & LensAwareAdapter)
  | { focus: "ontology"; termCount: number; automaticConsumerAvailable: false }
  | ({ focus: "evidence"; route: "local-note" | "normative-ratification" } & LensAwareAdapter)
  | { focus: "handoff"; payloadReady: boolean }
  | { focus: "upstream-ficha"; hasUpstreamProvenance: true; localEditorAvailable: false }
  | { focus: "inference"; localInferenceAvailable: false }
  | { focus: "certification"; automaticCertificationAvailable: false }
);

export function deriveKnowledgeIntent(state: KnowledgeTutorState): KnowledgeIntentSnapshot {
  const base = adapterBase(state);
  switch (state.focus) {
    case "requirement":
      switch (state.operation) {
        case "create":
          return { ...base, ...lensContext(state), kind: "knowledge", focus: "requirement", actionId: "requirement:create", surface: "inspector", operation: "create", coverageDeclared: state.coverageDeclared, externalEvidencePresent: state.externalEvidencePresent };
        case "mark":
          return { ...base, ...lensContext(state), kind: "knowledge", focus: "requirement", actionId: "requirement:mark", surface: "inspector", operation: "mark", coverageDeclared: state.coverageDeclared, externalEvidencePresent: state.externalEvidencePresent };
        case "satisfy":
          return { ...base, ...lensContext(state), kind: "knowledge", focus: "requirement", actionId: "requirement:satisfy", surface: "inspector", operation: "satisfy", coverageDeclared: state.coverageDeclared, externalEvidencePresent: state.externalEvidencePresent };
      }
    case "ontology":
      return { ...base, kind: "knowledge", focus: "ontology", actionId: "ontology:save", surface: "modal", termCount: state.termCount, automaticConsumerAvailable: false };
    case "evidence":
      if (state.route === "local-note") {
        return { ...base, ...lensContext(state), kind: "knowledge", focus: "evidence", actionId: "inspector:note-add", surface: "inspector", route: "local-note" };
      }
      return { ...base, ...lensContext(state), kind: "knowledge", focus: "evidence", actionId: "inspector:anchor-ratify-source", surface: "inspector", route: "normative-ratification" };
    case "handoff":
      return { ...base, kind: "knowledge", focus: "handoff", actionId: "palette:copiar-contexto-skill", surface: "command-palette", payloadReady: state.payloadReady, modelMutated: false };
    case "upstream-ficha":
      return { ...base, kind: "knowledge", focus: "upstream-ficha", actionId: "tutor:search", surface: "inspector", hasUpstreamProvenance: true, localEditorAvailable: false };
    case "inference":
      return { ...base, kind: "knowledge", focus: "inference", actionId: "tutor:search", surface: "command-palette", localInferenceAvailable: false };
    case "certification":
      return { ...base, kind: "knowledge", focus: "certification", actionId: "tutor:search", surface: "command-palette", automaticCertificationAvailable: false };
  }
}

export type ReuseTutorState = AdapterBase & (
  | { focus: "pieces"; originSelected: boolean; anchorAvailable: boolean; choice: "copy" | "anchor" | null }
  | { focus: "anchor-drift"; driftDetected: boolean; choice: "resync" | "detach" | null }
  | { focus: "submodel"; phase: "choice" | "connected" | "reading"; referenceLoaded: boolean; readOnly: true }
);

export function deriveReuseIntent(state: ReuseTutorState): ReuseIntentSnapshot {
  const base = adapterBase(state);
  switch (state.focus) {
    case "pieces":
      if (state.choice === "copy") {
        return { ...base, kind: "reuse", focus: "pieces", actionId: "pieces:copy", surface: "pieces", originSelected: state.originSelected, anchorAvailable: state.anchorAvailable, choice: "copy" };
      }
      if (state.choice === "anchor") {
        return { ...base, kind: "reuse", focus: "pieces", actionId: "pieces:anchor", surface: "pieces", originSelected: state.originSelected, anchorAvailable: state.anchorAvailable, choice: "anchor" };
      }
      return {
        ...base,
        kind: "reuse",
        focus: "pieces",
        actionId: "palette:vitrina-estereotipos",
        surface: "pieces",
        originSelected: state.originSelected,
        anchorAvailable: state.anchorAvailable,
        choice: null,
      };
    case "anchor-drift":
      if (state.choice === "resync") {
        return { ...base, kind: "reuse", focus: "anchor-drift", actionId: "anchor:resync", surface: "inspector", driftDetected: state.driftDetected, choice: "resync" };
      }
      if (state.choice === "detach") {
        return { ...base, kind: "reuse", focus: "anchor-drift", actionId: "anchor:detach", surface: "inspector", driftDetected: state.driftDetected, choice: "detach" };
      }
      return {
        ...base,
        kind: "reuse",
        focus: "anchor-drift",
        actionId: "inspector:anchor-drift",
        surface: "inspector",
        driftDetected: state.driftDetected,
        choice: null,
      };
    case "submodel":
      if (state.phase === "choice") {
        return { ...base, kind: "reuse", focus: "submodel", actionId: "palette:conectar-submodelo", surface: "modal", phase: "choice", referenceLoaded: state.referenceLoaded, readOnly: true };
      }
      if (state.phase === "connected") {
        return { ...base, kind: "reuse", focus: "submodel", actionId: "submodel:connect-reference", surface: "modal", phase: "connected", referenceLoaded: state.referenceLoaded, readOnly: true };
      }
      return {
        ...base,
        kind: "reuse",
        focus: "submodel",
        actionId: "submodel:open-reference",
        surface: "modal",
        phase: "reading",
        referenceLoaded: state.referenceLoaded,
        readOnly: true,
      };
  }
}

export function deriveNumericSimulationIntent(
  state: AdapterBase & LensAwareAdapter & { phase: "configure" | "sampled" | "download"; configuredAttributeCount: number },
): NumericSimulationIntentSnapshot {
  const base = { ...adapterBase(state), ...lensContext(state), kind: "numeric-simulation" as const, surface: "numeric-simulation-dialog" as const, configuredAttributeCount: state.configuredAttributeCount, modelsProcessDynamics: false as const };
  if (state.phase === "download") return { ...base, actionId: "simulation:numeric-csv", phase: "download" };
  if (state.phase === "sampled") return { ...base, actionId: "simulation:numeric-run", phase: "sampled" };
  return { ...base, actionId: "simulation:numeric-run", phase: "configure" };
}

export function deriveRefinementUnavailableIntent(
  state: AdapterBase & { operation: "unadopt" },
): RefinementUnavailableIntentSnapshot {
  return { ...adapterBase(state), kind: "refinement-unavailable", actionId: "tutor:search", surface: "command-palette", operation: state.operation, available: false };
}

export function deriveExportUnavailableIntent(
  state: AdapterBase & { format: "pdf" | "diff" | "merge" },
): ExportUnavailableIntentSnapshot {
  return { ...adapterBase(state), kind: "export-unavailable", actionId: "tutor:search", surface: "command-palette", format: state.format, available: false };
}

function adapterBase(state: AdapterBase) {
  return {
    intentId: state.intentId,
    interactionMode: "editable" as const,
  };
}

function lensContext(state: LensAwareAdapter) {
  return { activeLenses: state.activeLenses ?? [] };
}

function fichaLocalOperation(field: FichaLocalTutorState["field"]) {
  switch (field) {
    case "pregunta-habilitante": return { field, actionId: "inspector:ficha-pregunta-habilitante" } as const;
    case "dueno-significado": return { field, actionId: "inspector:ficha-dueno-significado" } as const;
    case "responsable-decision": return { field, actionId: "inspector:ficha-responsable-decision" } as const;
    case "tipos-modelo": return { field, actionId: "inspector:ficha-tipos-modelo" } as const;
    case "criterio-suficiencia": return { field, actionId: "inspector:ficha-criterio-suficiencia" } as const;
    case "vida-util": return { field, actionId: "inspector:ficha-vida-util" } as const;
    case "revisar-cuando": return { field, actionId: "inspector:ficha-revisar-cuando" } as const;
    case "lentes-conocimiento": return { field, actionId: "inspector:ficha-lentes-conocimiento" } as const;
  }
}
