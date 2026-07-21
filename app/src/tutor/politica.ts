import type {
  CompositionIntentSnapshot,
  ElementIntentSnapshot,
  EntryIntentSnapshot,
  ExportUnavailableIntentSnapshot,
  FichaLocalIntentSnapshot,
  KnowledgeIntentSnapshot,
  KnowledgeLens,
  LinkDesignIntentSnapshot,
  NumericSimulationIntentSnapshot,
  PersistenceIntentSnapshot,
  RefinementUnavailableIntentSnapshot,
  ReuseIntentSnapshot,
  SimulationIntentSnapshot,
  TutorCandidate,
  TutorContext,
  TutorIntentSnapshot,
  TutorIntervention,
  TutorSurfaceClaim,
  ViewIntentSnapshot,
} from "./tipos";

const PRIORITY_RANK = {
  integrity: 0,
  "human-decision": 1,
  "loss-or-concurrency": 2,
  "persistent-diagnostic": 3,
  consequence: 4,
  "opl-echo": 5,
  "optional-teaching": 6,
} as const;

const LENS_ORDER: readonly KnowledgeLens[] = ["systems", "software", "health"];

export function normalizeKnowledgeLenses(lenses: readonly KnowledgeLens[]): KnowledgeLens[] {
  const present = new Set(lenses);
  return LENS_ORDER.filter((lens) => present.has(lens));
}

export function runTutorPolicy(
  snapshot: TutorIntentSnapshot,
  claims: readonly TutorSurfaceClaim[] = [],
): TutorIntervention {
  const resultId = "resultId" in snapshot ? snapshot.resultId : undefined;
  return arbitrateTutorCandidates(
    candidatesForSnapshot(snapshot),
    { intentId: snapshot.intentId, ...(resultId ? { resultId } : {}) },
    claims,
  );
}

export function arbitrateTutorCandidates(
  candidates: readonly TutorCandidate[],
  context: TutorContext,
  claims: readonly TutorSurfaceClaim[] = [],
): TutorIntervention {
  const available = candidates
    .filter((candidate) => !claims.some((claim) => claimMatchesCandidate(claim, candidate)))
    .sort(compareCandidates);

  const selected = available[0];
  if (!selected) {
    return {
      kind: "silent",
      ...context,
      reason: candidates.length > 0 ? "already-owned" : "no-candidate",
    };
  }

  return {
    kind: interventionKind(selected.priority),
    intentId: selected.intentId,
    ...(selected.resultId ? { resultId: selected.resultId } : {}),
    actionId: selected.actionId,
    owner: selected.surface,
    contentId: selected.contentId,
    priority: selected.priority,
    activeLenses: normalizeKnowledgeLenses(selected.activeLenses),
  };
}

function interventionKind(priority: TutorCandidate["priority"]): Exclude<TutorIntervention["kind"], "silent"> {
  if (priority === "integrity") return "block";
  if (priority === "human-decision") return "ask";
  if (priority === "consequence" || priority === "opl-echo" || priority === "loss-or-concurrency") {
    return "confirm";
  }
  return "orient";
}

function candidatesForSnapshot(snapshot: TutorIntentSnapshot): TutorCandidate[] {
  switch (snapshot.kind) {
    case "refine":
      return refineCandidates(snapshot);
    case "simulation":
      return simulationCandidates(snapshot);
    case "composition":
      return compositionCandidates(snapshot);
    case "ficha-local":
      return fichaLocalCandidates(snapshot);
    case "persistence":
      return persistenceCandidates(snapshot);
    case "entry":
      return entryCandidates(snapshot);
    case "element":
      return elementCandidates(snapshot);
    case "link-design":
      return linkDesignCandidates(snapshot);
    case "view":
      return viewCandidates(snapshot);
    case "knowledge":
      return knowledgeCandidates(snapshot);
    case "reuse":
      return reuseCandidates(snapshot);
    case "numeric-simulation":
      return numericSimulationCandidates(snapshot);
    case "refinement-unavailable":
      return refinementUnavailableCandidates(snapshot);
    case "export-unavailable":
      return exportUnavailableCandidates(snapshot);
  }
}

function entryCandidates(snapshot: EntryIntentSnapshot): TutorCandidate[] {
  switch (snapshot.focus) {
    case "start":
      return [candidate(snapshot, "content.start.entry", snapshot.phase === "committed" ? "consequence" : "optional-teaching")];
    case "lifecycle":
      return [candidate(snapshot, "content.lifecycle.regime", snapshot.factsPreserved ? "optional-teaching" : "human-decision")];
    case "purpose":
      return [candidate(snapshot, "content.purpose.frontier", snapshot.purposePresent ? "optional-teaching" : "human-decision")];
    case "degrade":
      return [];
  }
}

function elementCandidates(snapshot: ElementIntentSnapshot): TutorCandidate[] {
  switch (snapshot.focus) {
    case "kind":
      return [candidate(snapshot, "content.entity.kind", snapshot.chosenKind ? "optional-teaching" : "human-decision")];
    case "properties":
      return [candidate(snapshot, "content.entity.properties", "optional-teaching")];
    case "state":
      return [candidate(snapshot, "content.state.lifecycle", snapshot.ownerKind === "object" ? "optional-teaching" : "integrity")];
  }
}

function linkDesignCandidates(snapshot: LinkDesignIntentSnapshot): TutorCandidate[] {
  switch (snapshot.focus) {
    case "procedural":
      return [candidate(snapshot, "content.link.procedural", snapshot.endpointsReady && snapshot.selectedType ? "optional-teaching" : "human-decision")];
    case "structural":
      return [candidate(snapshot, "content.link.structural", snapshot.selectedRelation ? "optional-teaching" : "human-decision")];
    case "probabilistic-weights":
      return [];
  }
}

function viewCandidates(snapshot: ViewIntentSnapshot): TutorCandidate[] {
  switch (snapshot.focus) {
    case "appearance":
      return [candidate(snapshot, "content.appearance.view", "optional-teaching")];
    case "derived":
      return [candidate(snapshot, "content.view.derived", "optional-teaching")];
    case "opl":
      return [candidate(snapshot, "content.opl.delta", snapshot.previewVisible ? "optional-teaching" : "human-decision")];
    case "navigation":
      return [candidate(snapshot, "content.navigation.reasoning", "optional-teaching")];
    case "discovery":
      return [candidate(snapshot, "content.discovery.corpus", "optional-teaching")];
    case "mobile-read":
      return [candidate(snapshot, "content.interaction.readonly", "optional-teaching")];
    case "outzoom":
      return [];
  }
}

function knowledgeCandidates(snapshot: KnowledgeIntentSnapshot): TutorCandidate[] {
  switch (snapshot.focus) {
    case "requirement":
      return [candidate(snapshot, "content.requirement.coverage", "optional-teaching")];
    case "ontology":
      return [candidate(snapshot, "content.ontology.lexical", "optional-teaching")];
    case "evidence":
      return [candidate(snapshot, "content.evidence.dispatch", "optional-teaching")];
    case "handoff":
      return [candidate(snapshot, "content.handoff.skill", "optional-teaching")];
    case "upstream-ficha":
    case "inference":
    case "certification":
      return [];
  }
}

function reuseCandidates(snapshot: ReuseIntentSnapshot): TutorCandidate[] {
  switch (snapshot.focus) {
    case "pieces":
      if (!snapshot.anchorAvailable) return [];
      return [candidate(snapshot, "content.reuse.pieces", snapshot.choice ? "optional-teaching" : "human-decision")];
    case "anchor-drift":
      if (!snapshot.driftDetected) return [];
      return [candidate(snapshot, "content.reuse.anchor-drift", !snapshot.choice ? "human-decision" : "optional-teaching")];
    case "submodel":
      return [candidate(snapshot, "content.submodel.reference", "optional-teaching")];
  }
}

function numericSimulationCandidates(snapshot: NumericSimulationIntentSnapshot): TutorCandidate[] {
  return [candidate(snapshot, "content.simulation.numeric.scope", "optional-teaching")];
}

function refinementUnavailableCandidates(_snapshot: RefinementUnavailableIntentSnapshot): TutorCandidate[] {
  return [];
}

function exportUnavailableCandidates(_snapshot: ExportUnavailableIntentSnapshot): TutorCandidate[] {
  return [];
}

function refineCandidates(snapshot: Extract<TutorIntentSnapshot, { kind: "refine" }>): TutorCandidate[] {
  const candidates: TutorCandidate[] = [];

  if (snapshot.integrityBlocked) {
    candidates.push(candidate(snapshot, "content.diagnostic.integrity", "integrity", "diagnostic-panel"));
  }

  if (snapshot.stage === "question") {
    candidates.push(candidate(
      snapshot,
      "content.refinement.question",
      snapshot.questionComplete ? "optional-teaching" : "human-decision",
    ));
  } else {
    candidates.push(candidate(snapshot, "content.refinement.confirmed", "consequence"));
  }

  return candidates;
}

function simulationCandidates(snapshot: SimulationIntentSnapshot): TutorCandidate[] {
  const candidates: TutorCandidate[] = [];

  if (snapshot.firstUse && snapshot.phase !== "running") {
    candidates.push(candidate(snapshot, "content.simulation.conceptual.scope", "optional-teaching"));
  }

  switch (snapshot.phase) {
    case "preflight":
    case "running":
      break;
    case "blocked":
      candidates.push(candidate(snapshot, "content.simulation.conceptual.blocked", "integrity"));
      break;
    case "decision":
      candidates.push(candidate(snapshot, "content.flow.control.decision", "human-decision"));
      break;
    case "step":
      candidates.push(candidate(snapshot, "content.simulation.conceptual.step", "consequence"));
      break;
    case "complete":
      candidates.push(candidate(snapshot, "content.simulation.conceptual.complete", "consequence"));
      break;
  }

  return candidates;
}

function compositionCandidates(snapshot: CompositionIntentSnapshot): TutorCandidate[] {
  if (snapshot.integrityBlocked) {
    return [candidate(snapshot, "content.diagnostic.integrity", "integrity", "diagnostic-panel")];
  }
  if (!snapshot.mappingResolvable) {
    return [candidate(snapshot, "content.composition.choice", "integrity")];
  }
  if (snapshot.phase === "applied") {
    return [candidate(snapshot, "content.composition.confirmed", "consequence")];
  }
  if (snapshot.linealityConflict) {
    return [candidate(snapshot, "content.composition.preservation", "optional-teaching")];
  }
  return [candidate(
    snapshot,
    "content.composition.choice",
    snapshot.phase === "choice" ? "human-decision" : "optional-teaching",
  )];
}

function fichaLocalCandidates(snapshot: FichaLocalIntentSnapshot): TutorCandidate[] {
  if (snapshot.phase === "editing" && !snapshot.valueChanged) return [];
  return [candidate(
    snapshot,
    "content.ficha.local",
    snapshot.phase === "committed" ? "consequence" : "optional-teaching",
  )];
}

function persistenceCandidates(snapshot: PersistenceIntentSnapshot): TutorCandidate[] {
  const contentId = persistenceContentId(snapshot.operation);
  if (snapshot.phase === "confirmed") {
    return [candidate(snapshot, contentId, "consequence")];
  }

  const risksLoss = (
    snapshot.operation === "import-active" && snapshot.hasUnsavedChanges
  ) || snapshot.operation === "version-delete";
  return [candidate(
    snapshot,
    contentId,
    risksLoss && !snapshot.destructiveConfirmed ? "loss-or-concurrency" : "optional-teaching",
  )];
}

function persistenceContentId(
  operation: PersistenceIntentSnapshot["operation"],
): TutorCandidate["contentId"] {
  switch (operation) {
    case "import-active":
    case "import-new":
      return "content.persistence.import-save";
    case "version-delete":
    case "version-create":
    case "version-restore-copy":
      return "content.history.version-mutation";
    case "export":
      return "content.export.interchange";
  }
}

function candidate(
  snapshot: TutorIntentSnapshot,
  contentId: TutorCandidate["contentId"],
  priority: TutorCandidate["priority"],
  surface = snapshot.surface,
): TutorCandidate {
  const resultId = "resultId" in snapshot ? snapshot.resultId : undefined;
  return {
    intentId: snapshot.intentId,
    ...(resultId ? { resultId } : {}),
    actionId: snapshot.actionId,
    surface,
    contentId,
    priority,
    activeLenses: "activeLenses" in snapshot ? snapshot.activeLenses : [],
  };
}

function claimMatchesCandidate(claim: TutorSurfaceClaim, candidateValue: TutorCandidate): boolean {
  if (claim.intentId && claim.intentId === candidateValue.intentId) return true;
  return !!claim.resultId && !!candidateValue.resultId && claim.resultId === candidateValue.resultId;
}

function compareCandidates(a: TutorCandidate, b: TutorCandidate): number {
  const priority = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  if (priority !== 0) return priority;
  const content = a.contentId.localeCompare(b.contentId, "en");
  if (content !== 0) return content;
  const surface = a.surface.localeCompare(b.surface, "en");
  if (surface !== 0) return surface;
  return a.actionId.localeCompare(b.actionId, "en");
}
