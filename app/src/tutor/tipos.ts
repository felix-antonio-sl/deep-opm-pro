export type CapabilityId = `cap.${string}`;
export type TutorContentId = `content.${string}`;
export type TutorScenarioId = `scenario.${string}`;
export type TutorSourceId = `source.${string}`;
export type TutorEntrypointId = `${string}:${string}`;

export type TutorCut =
  | "1A"
  | "1B"
  | "2A"
  | "2B"
  | "2C"
  | "2D"
  | "3A"
  | "3B"
  | "3C"
  | "3D"
  | "4A"
  | "4B"
  | "5A"
  | "5B"
  | "6A"
  | "6B"
  | "7A"
  | "7B"
  | "7C";

export type CapabilityStatus = "live" | "live-read" | "reference-only" | "external" | "absent";
export type TutorBehavior = "guide" | "confirm" | "reference" | "limit" | "silent";
export type EffectKind = "read" | "transient-ui" | "model" | "workspace" | "external";

export type SurfaceOwner =
  | "selection-annotation"
  | "opd-header"
  | "inspector"
  | "opl-panel"
  | "diagnostic-panel"
  | "simulation-bar"
  | "numeric-simulation-dialog"
  | "pieces"
  | "composition-dialog"
  | "workspace-manager"
  | "command-palette"
  | "canvas"
  | "empty-state"
  | "tree"
  | "persistence-chip"
  | "modal"
  | "mobile-read";

export type InteractionMode = "editable" | "read-only" | "simulation" | "mobile-read";
export type KnowledgeLens = "systems" | "software" | "health";
export type AuthorityPlane = "validity" | "method" | "opd" | "opl" | "formal-explanation";

export interface CapabilityEffectStep {
  kind: EffectKind;
  outcome: string;
  recovery: string;
}

export interface CapabilityEffect {
  entrypointIds: readonly TutorEntrypointId[];
  steps: readonly CapabilityEffectStep[];
}

export interface CapabilityDescriptor {
  capabilityId: CapabilityId;
  cut: TutorCut;
  family: string;
  status: CapabilityStatus;
  behavior: TutorBehavior;
  owners: readonly SurfaceOwner[];
  entrypointIds: readonly TutorEntrypointId[];
  effects: readonly CapabilityEffect[];
  limits: readonly string[];
  silentWhen: readonly string[];
}

export interface TutorCutCoverage {
  cut: TutorCut;
  capabilityIds: readonly CapabilityId[];
  entrypointIds: readonly TutorEntrypointId[];
  scenarioIds: readonly TutorScenarioId[];
  proof: string;
}

export type TutorAction =
  | { kind: "focus"; actionId: TutorEntrypointId; label: string }
  | { kind: "navigate"; actionId: TutorEntrypointId; label: string }
  | { kind: "open-existing"; actionId: TutorEntrypointId; label: string };

export interface TutorSourceRef {
  sourceId: TutorSourceId;
  anchor: string;
}

export interface TutorLensDetail {
  criterion: string;
  sourceRefs: readonly TutorSourceRef[];
}

export interface TutorContent {
  contentId: TutorContentId;
  capabilityId: CapabilityId;
  moment: string;
  contexts: readonly InteractionMode[];
  authorityPlane: AuthorityPlane;
  now: string;
  criterion: string;
  sourceRefs: readonly TutorSourceRef[];
  applicableLenses: readonly KnowledgeLens[];
  lensDetails?: Partial<Readonly<Record<KnowledgeLens, TutorLensDetail>>>;
  action?: TutorAction;
}

interface TutorScenarioBase {
  scenarioId: TutorScenarioId;
  capabilityId: CapabilityId;
  condition: string;
  snapshot: TutorIntentSnapshot;
  claims?: readonly TutorSurfaceClaim[];
  expected: TutorIntervention;
  expectedContent?: {
    contentId: TutorContentId;
    authorityPlane: AuthorityPlane;
    actionId?: TutorEntrypointId;
    activeLenses: readonly KnowledgeLens[];
  };
  accessibility: readonly string[];
}

export type TutorScenario = TutorScenarioBase & (
  | { testCondition: "unit"; integrationEvidence?: never }
  | {
      testCondition: "integration";
      integrationEvidence: {
        file: `e2e/${string}.spec.ts`;
        test: string;
      };
    }
);

export interface TutorIntentBase {
  intentId: string;
  actionId: TutorEntrypointId;
  surface: SurfaceOwner;
  interactionMode: InteractionMode;
}

export interface TutorLensContext {
  activeLenses: readonly KnowledgeLens[];
}

type RefineOperation =
  | { actionId: "contextual:inzoom"; mode: "decomposition" }
  | { actionId: "contextual:unfold"; mode: "unfold" }
  | { actionId: "tree:adopt-refinement"; mode: "adoption" };

type RefineBase = Omit<TutorIntentBase, "actionId"> & TutorLensContext & RefineOperation & {
  kind: "refine";
};

type RefineQuestionSnapshot = RefineBase & {
  stage: "question";
  questionComplete: boolean;
  integrityBlocked: boolean;
  resultId?: never;
};

type RefineConfirmedSnapshot = RefineBase & {
  stage: "confirmed";
  questionComplete: true;
  integrityBlocked: false;
  resultId: string;
};

export type RefineIntentSnapshot = RefineQuestionSnapshot | RefineConfirmedSnapshot;

type SimulationBase = Omit<TutorIntentBase, "actionId" | "surface"> & {
  kind: "simulation";
  surface: "simulation-bar";
  firstUse: boolean;
};

type SimulationDecisionSnapshot = SimulationBase & {
  actionId: "simulation:decision";
  phase: "decision";
  resultId?: never;
};

type SimulationPendingSnapshot = SimulationBase & {
  actionId: "simulation:step";
  phase: "preflight" | "blocked" | "running";
  resultId?: never;
};

type SimulationResultSnapshot = SimulationBase & {
  actionId: "simulation:step";
  phase: "step" | "complete";
  resultId: string;
};

export type SimulationIntentSnapshot =
  | SimulationDecisionSnapshot
  | SimulationPendingSnapshot
  | SimulationResultSnapshot;

type CompositionBase = Omit<TutorIntentBase, "actionId" | "surface"> & {
  kind: "composition";
  actionId: "composition:apply";
  surface: "composition-dialog";
  mappingResolvable: boolean;
  integrityBlocked: boolean;
  linealityConflict: boolean;
};

type CompositionDecisionSnapshot = CompositionBase & {
  phase: "preflight" | "choice";
  resultId?: never;
};

type CompositionAppliedSnapshot = CompositionBase & {
  phase: "applied";
  mappingResolvable: true;
  integrityBlocked: false;
  linealityConflict: boolean;
  resultId: string;
};

export type CompositionIntentSnapshot = (CompositionDecisionSnapshot | CompositionAppliedSnapshot) & TutorLensContext;

type FichaLocalOperation =
  | { field: "pregunta-habilitante"; actionId: "inspector:ficha-pregunta-habilitante" }
  | { field: "dueno-significado"; actionId: "inspector:ficha-dueno-significado" }
  | { field: "responsable-decision"; actionId: "inspector:ficha-responsable-decision" }
  | { field: "tipos-modelo"; actionId: "inspector:ficha-tipos-modelo" }
  | { field: "criterio-suficiencia"; actionId: "inspector:ficha-criterio-suficiencia" }
  | { field: "vida-util"; actionId: "inspector:ficha-vida-util" }
  | { field: "revisar-cuando"; actionId: "inspector:ficha-revisar-cuando" }
  | { field: "lentes-conocimiento"; actionId: "inspector:ficha-lentes-conocimiento" };

type FichaLocalBase = Omit<TutorIntentBase, "actionId" | "surface" | "interactionMode"> & TutorLensContext & FichaLocalOperation & {
  kind: "ficha-local";
  surface: "inspector";
  interactionMode: "editable";
  hasUpstreamProvenance: false;
};

type FichaLocalEditingSnapshot = FichaLocalBase & {
  phase: "editing";
  valueChanged: boolean;
  resultId?: never;
};

type FichaLocalCommittedSnapshot = FichaLocalBase & {
  phase: "committed";
  valueChanged: true;
  resultId: string;
};

export type FichaLocalIntentSnapshot = FichaLocalEditingSnapshot | FichaLocalCommittedSnapshot;

type PersistenceOperation =
  | { operation: "import-active"; actionId: "workspace:import-active"; surface: "workspace-manager" }
  | { operation: "import-new"; actionId: "workspace:import-new-tab"; surface: "workspace-manager" }
  | { operation: "version-create"; actionId: "workspace:create-version"; surface: "modal" }
  | { operation: "version-delete"; actionId: "workspace:delete-version"; surface: "modal" }
  | { operation: "version-restore-copy"; actionId: "workspace:restore-version-copy"; surface: "modal" }
  | { operation: "export"; actionId: "palette:exportar-json"; surface: "command-palette" };

type PersistenceBase = Omit<TutorIntentBase, "actionId" | "surface"> & PersistenceOperation & {
  kind: "persistence";
  hasUnsavedChanges: boolean;
  destructiveConfirmed: boolean;
};

type PersistenceDecisionSnapshot = PersistenceBase & {
  phase: "decision";
  resultId?: never;
};

type PersistenceConfirmedSnapshot = PersistenceBase & {
  phase: "confirmed";
  resultId: string;
};

export type PersistenceIntentSnapshot = PersistenceDecisionSnapshot | PersistenceConfirmedSnapshot;

type EntryBase = Omit<TutorIntentBase, "actionId" | "surface"> & {
  kind: "entry";
  surface: "command-palette" | "empty-state" | "modal";
};

export type EntryIntentSnapshot = EntryBase & (
  | ({
      focus: "start";
      phase: "choice" | "committed";
      tabsBefore: number;
      tabsAfter: number;
    } & (
      | { actionId: "palette:nuevo-modelo"; operation: "new-note" }
      | { actionId: "palette:abrir-pestana"; operation: "duplicate-tab" }
    ))
  | ({
      focus: "lifecycle";
      phase: "decision";
      factsPreserved: boolean;
    } & (
      | { actionId: "workspace:graduate-model"; transition: "graduate" }
      | { actionId: "workspace:graduate-library"; transition: "graduate-library" }
      | { actionId: "workspace:mark-library"; transition: "mark-library" }
      | { actionId: "workspace:unmark-library"; transition: "unmark-library" }
    ))
  | {
      focus: "degrade";
      actionId: "tutor:search";
      transitionAvailable: false;
    }
  | ({
      focus: "purpose";
      actionId: "empty-state:choose-entry";
      strategy: "sd-first" | "workshop" | null;
      purposePresent: boolean;
    } & TutorLensContext)
);

type ElementBase = Omit<TutorIntentBase, "actionId" | "surface"> & {
  kind: "element";
  surface: "canvas" | "inspector";
};

export type ElementIntentSnapshot = ElementBase & (
  | ({
      focus: "kind";
      actionId: "canvas:create-object-process";
      chosenKind: "object" | "process" | null;
    } & TutorLensContext)
  | {
      focus: "properties";
      actionId: "inspector:entity-properties";
      property: "essence" | "affiliation" | "alias" | "url" | "image";
      logicalIdentityChanges: false;
    }
  | ({
      focus: "state";
      actionId: "inspector:state-lifecycle";
      ownerKind: "object" | "process";
      declaredCurrent: boolean;
      runtimeCurrent: boolean;
    } & TutorLensContext)
);

type LinkDesignBase = Omit<TutorIntentBase, "actionId" | "surface"> & {
  kind: "link-design";
  surface: "inspector";
};

export type LinkDesignIntentSnapshot = LinkDesignBase & (
  | {
      focus: "procedural";
      actionId: "inspector:link-procedural";
      endpointsReady: boolean;
      selectedType: string | null;
    }
  | {
      focus: "structural";
      actionId: "inspector:link-structural";
      selectedRelation: "aggregation" | "exhibition" | "generalization" | "instantiation" | null;
    }
  | {
      focus: "probabilistic-weights";
      actionId: "tutor:search";
      persistedWeightsAvailable: false;
    }
);

type ViewBase = Omit<TutorIntentBase, "actionId" | "surface"> & { kind: "view" };

export type ViewIntentSnapshot = ViewBase & (
  | {
      focus: "appearance";
      actionId: "inspector:appearance";
      surface: "inspector";
      appearanceCount: number;
      createsLogicalIdentity: false;
    }
  | {
      focus: "derived";
      actionId: "tree:derived-view";
      surface: "tree";
      readOnly: true;
      ownsFacts: false;
    }
  | {
      focus: "opl";
      actionId: "opl:apply-preview";
      surface: "opl-panel";
      recognizedLines: number;
      unrecognizedLines: number;
      previewVisible: boolean;
    }
  | ({
      focus: "navigation";
      actionId: "palette:buscar-modelo";
      surface: "command-palette";
      query: string;
      resultCount: number;
      causalClaim: false;
    } & TutorLensContext)
  | ({
      focus: "discovery";
      actionId: "tutor:search";
      surface: "command-palette";
      query: string;
      contentMatches: number;
      sourceMatches: number;
    } & TutorLensContext)
  | {
      focus: "mobile-read";
      actionId: "mobile:read-context";
      surface: "mobile-read";
      editable: false;
    }
  | {
      focus: "outzoom";
      actionId: "tutor:search";
      surface: "command-palette";
      mutationAvailable: false;
    }
);

type KnowledgeBase = Omit<TutorIntentBase, "actionId" | "surface"> & { kind: "knowledge" };

type RequirementOperation =
  | { operation: "create"; actionId: "requirement:create" }
  | { operation: "mark"; actionId: "requirement:mark" }
  | { operation: "satisfy"; actionId: "requirement:satisfy" };

export type KnowledgeIntentSnapshot = KnowledgeBase & (
  | ({
      focus: "requirement";
      surface: "inspector";
      coverageDeclared: boolean;
      externalEvidencePresent: boolean;
    } & TutorLensContext & RequirementOperation)
  | {
      focus: "ontology";
      actionId: "ontology:save";
      surface: "modal";
      termCount: number;
      automaticConsumerAvailable: false;
    }
  | ({
      focus: "evidence";
      surface: "inspector";
    } & TutorLensContext & (
      | { route: "local-note"; actionId: "inspector:note-add" }
      | { route: "normative-ratification"; actionId: "inspector:anchor-ratify-source" }
    ))
  | {
      focus: "handoff";
      actionId: "palette:copiar-contexto-skill";
      surface: "command-palette";
      payloadReady: boolean;
      modelMutated: false;
    }
  | {
      focus: "upstream-ficha";
      actionId: "tutor:search";
      surface: "inspector";
      hasUpstreamProvenance: true;
      localEditorAvailable: false;
    }
  | {
      focus: "inference";
      actionId: "tutor:search";
      surface: "command-palette";
      localInferenceAvailable: false;
    }
  | {
      focus: "certification";
      actionId: "tutor:search";
      surface: "command-palette";
      automaticCertificationAvailable: false;
    }
);

type ReuseBase = Omit<TutorIntentBase, "actionId" | "surface"> & {
  kind: "reuse";
  surface: "pieces" | "inspector" | "modal";
};

export type ReuseIntentSnapshot = ReuseBase & (
  | ({
      focus: "pieces";
      originSelected: boolean;
      anchorAvailable: boolean;
    } & (
      | { choice: null; actionId: "palette:vitrina-estereotipos" }
      | { choice: "copy"; actionId: "pieces:copy" }
      | { choice: "anchor"; actionId: "pieces:anchor" }
    ))
  | ({
      focus: "anchor-drift";
      driftDetected: boolean;
    } & (
      | { choice: null; actionId: "inspector:anchor-drift" }
      | { choice: "resync"; actionId: "anchor:resync" }
      | { choice: "detach"; actionId: "anchor:detach" }
    ))
  | ({
      focus: "submodel";
      referenceLoaded: boolean;
      readOnly: true;
    } & (
      | { phase: "choice"; actionId: "palette:conectar-submodelo" }
      | { phase: "connected"; actionId: "submodel:connect-reference" }
      | { phase: "reading"; actionId: "submodel:open-reference" }
    ))
);

type NumericSimulationOperation =
  | { actionId: "simulation:numeric-run"; phase: "configure" | "sampled" }
  | { actionId: "simulation:numeric-csv"; phase: "download" };

export type NumericSimulationIntentSnapshot = Omit<TutorIntentBase, "actionId" | "surface"> & TutorLensContext & NumericSimulationOperation & {
  kind: "numeric-simulation";
  surface: "numeric-simulation-dialog";
  configuredAttributeCount: number;
  modelsProcessDynamics: false;
};

export interface RefinementUnavailableIntentSnapshot extends Omit<TutorIntentBase, "actionId" | "surface"> {
  kind: "refinement-unavailable";
  actionId: "tutor:search";
  surface: "command-palette";
  operation: "unadopt";
  available: false;
}

export interface ExportUnavailableIntentSnapshot extends Omit<TutorIntentBase, "actionId" | "surface"> {
  kind: "export-unavailable";
  actionId: "tutor:search";
  surface: "command-palette";
  format: "pdf" | "diff" | "merge";
  available: false;
}

export type TutorIntentSnapshot =
  | RefineIntentSnapshot
  | SimulationIntentSnapshot
  | CompositionIntentSnapshot
  | FichaLocalIntentSnapshot
  | PersistenceIntentSnapshot
  | EntryIntentSnapshot
  | ElementIntentSnapshot
  | LinkDesignIntentSnapshot
  | ViewIntentSnapshot
  | KnowledgeIntentSnapshot
  | ReuseIntentSnapshot
  | NumericSimulationIntentSnapshot
  | RefinementUnavailableIntentSnapshot
  | ExportUnavailableIntentSnapshot;

export type TutorPriority =
  | "integrity"
  | "human-decision"
  | "loss-or-concurrency"
  | "persistent-diagnostic"
  | "consequence"
  | "opl-echo"
  | "optional-teaching";

export interface TutorCandidate {
  intentId: string;
  resultId?: string;
  actionId: TutorEntrypointId;
  surface: SurfaceOwner;
  contentId: TutorContentId;
  priority: TutorPriority;
  activeLenses: readonly KnowledgeLens[];
}

export interface TutorSurfaceClaim {
  owner: "tutor" | "flash" | "diagnostic" | "product";
  intentId?: string;
  resultId?: string;
}

export interface TutorContext {
  intentId: string;
  resultId?: string;
}

export type TutorIntervention =
  | (TutorContext & { kind: "silent"; reason: "no-candidate" | "already-owned" })
  | {
      kind: "confirm" | "orient" | "ask" | "block";
      intentId: string;
      resultId?: string;
      actionId: TutorEntrypointId;
      owner: SurfaceOwner;
      contentId: TutorContentId;
      priority: TutorPriority;
      activeLenses: readonly KnowledgeLens[];
    };

export interface TutorSourceAnchor {
  id: string;
  label: string;
  heading: string;
}

export type TutorSourceIntegrity =
  | { kind: "version"; value: string }
  | { kind: "sha256"; value: string };

export interface TutorSource {
  sourceId: TutorSourceId;
  title: string;
  sourceClass: "canonical" | "manual" | "guide" | "cheatsheet-index" | "cheatsheet";
  ownerPlane: AuthorityPlane | "pedagogy" | "operation" | "domain";
  locator: string;
  documentPath: `/tutor-sources/${string}.html`;
  sections: readonly string[];
  anchors: readonly TutorSourceAnchor[];
  integrity: TutorSourceIntegrity;
}

export interface TutorEntrypoint {
  entrypointId: TutorEntrypointId;
  classification: "semantic" | "operational-exempt";
  reason?: string;
}
