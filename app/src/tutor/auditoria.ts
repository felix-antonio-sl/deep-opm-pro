import { CAPABILITY_BY_ID, TUTOR_CAPABILITIES, TUTOR_CUT_COVERAGE, TUTOR_ENTRYPOINT_CATALOG } from "./capacidades";
import { TUTOR_CONTENT, resolveTutorContent } from "./contenidos";
import { TUTOR_SCENARIOS } from "./escenarios";
import {
  TUTOR_SOURCE_BY_ID,
  TUTOR_SOURCES,
  buildTutorSourceDocumentPath,
} from "./fuentes";
import { normalizeKnowledgeLenses, runTutorPolicy } from "./politica";
import type { CapabilityDescriptor, TutorCut, TutorCutCoverage, TutorScenario, TutorSource, TutorSourceRef } from "./tipos";

export interface TutorRegistryIssue {
  code: string;
  detail: string;
}

export const TUTOR_REQUIRED_CUTS = ["1A", "1B", "2A", "2B", "2C", "2D", "3A", "3B", "3C", "3D", "4A", "4B", "5A", "5B", "6A", "6B", "7A", "7B", "7C"] as const satisfies readonly TutorCut[];
const GENERIC_ANCHOR_NAMES = new Set([
  "root",
  "top",
  "inicio",
  "general",
  "document",
  "documento",
  "documento completo",
  "full document",
]);

export function auditCapabilityEffects(
  capabilities: readonly CapabilityDescriptor[],
  semanticEntrypointIds: ReadonlySet<string>,
): TutorRegistryIssue[] {
  const issues: TutorRegistryIssue[] = [];

  for (const capability of capabilities) {
    const owned = new Set(capability.entrypointIds);
    const covered = new Set<string>();
    for (const effect of capability.effects) {
      if (effect.steps.length === 0) {
        issue(issues, "EFFECT_SEQUENCE_EMPTY", `${capability.capabilityId} declara una secuencia vacía.`);
      }
      if (owned.size > 0 && effect.entrypointIds.length === 0) {
        issue(issues, "EFFECT_WITHOUT_ENTRYPOINT", `${capability.capabilityId} declara una secuencia de efecto sin entrypoint.`);
      }
      for (const entrypointId of effect.entrypointIds) {
        if (!owned.has(entrypointId)) {
          issue(issues, "EFFECT_ENTRYPOINT_OUTSIDE_CAPABILITY", `${capability.capabilityId} apunta a ${entrypointId}.`);
          continue;
        }
        if (covered.has(entrypointId)) {
          issue(issues, "EFFECT_ENTRYPOINT_DUPLICATE", `${entrypointId} declara más de una secuencia de efecto.`);
        }
        covered.add(entrypointId);
      }
    }

    if (capability.status !== "live" && capability.status !== "live-read") continue;
    for (const entrypointId of capability.entrypointIds) {
      if (semanticEntrypointIds.has(entrypointId) && !covered.has(entrypointId)) {
        issue(issues, "ENTRYPOINT_WITHOUT_EFFECT", `${entrypointId} no declara consecuencia y recuperación.`);
      }
    }
  }

  return issues.sort(compareIssues);
}

export function auditTutorCutCoverage(
  coverage: readonly TutorCutCoverage[],
  capabilities: readonly CapabilityDescriptor[] = TUTOR_CAPABILITIES,
  scenarioIds: ReadonlySet<string> = new Set(TUTOR_SCENARIOS.map((scenario) => scenario.scenarioId)),
  entrypointIds: ReadonlySet<string> = new Set(TUTOR_ENTRYPOINT_CATALOG.map((entrypoint) => entrypoint.entrypointId)),
): TutorRegistryIssue[] {
  const issues: TutorRegistryIssue[] = [];
  const capabilityIds = new Set(capabilities.map((capability) => capability.capabilityId));
  const seenCuts = new Set<TutorCut>();

  for (const record of coverage) {
    if (seenCuts.has(record.cut)) issue(issues, "CUT_COVERAGE_DUPLICATE", `El corte ${record.cut} tiene más de un registro de cobertura.`);
    seenCuts.add(record.cut);
    if (!record.proof.trim()) issue(issues, "CUT_COVERAGE_WITHOUT_PROOF", `El corte ${record.cut} no declara prueba.`);
    if (record.capabilityIds.length === 0) issue(issues, "CUT_COVERAGE_WITHOUT_CAPABILITY", `El corte ${record.cut} no referencia capacidades.`);
    if (record.scenarioIds.length === 0) issue(issues, "CUT_COVERAGE_WITHOUT_SCENARIO", `El corte ${record.cut} no referencia escenarios.`);
    for (const capabilityId of record.capabilityIds) {
      if (!capabilityIds.has(capabilityId)) issue(issues, "CUT_CAPABILITY_MISSING", `${record.cut} referencia ${capabilityId} inexistente.`);
    }
    for (const entrypointId of record.entrypointIds) {
      if (!entrypointIds.has(entrypointId)) issue(issues, "CUT_ENTRYPOINT_MISSING", `${record.cut} referencia ${entrypointId} inexistente.`);
    }
    for (const scenarioId of record.scenarioIds) {
      if (!scenarioIds.has(scenarioId)) issue(issues, "CUT_SCENARIO_MISSING", `${record.cut} referencia ${scenarioId} inexistente.`);
    }
  }
  for (const cut of TUTOR_REQUIRED_CUTS) {
    if (!seenCuts.has(cut)) issue(issues, "CUT_MISSING", `Falta cobertura explícita del corte ${cut}.`);
  }

  return issues.sort(compareIssues);
}

export function auditTutorSourceReferences(
  sources: readonly TutorSource[],
  refs: readonly TutorSourceRef[],
  availableDocumentPaths: ReadonlySet<string>,
): TutorRegistryIssue[] {
  const issues: TutorRegistryIssue[] = [];
  const sourcesById = new Map(sources.map((source) => [source.sourceId, source]));

  auditUnique(issues, "SOURCE_DUPLICATE", sources, (source) => source.sourceId);
  auditUnique(issues, "SOURCE_DOCUMENT_DUPLICATE", sources, (source) => source.documentPath);

  for (const source of sources) {
    const expectedPath = buildTutorSourceDocumentPath(source.sourceId);
    if (source.documentPath !== expectedPath || !/^\/tutor-sources\/source\.[a-z0-9.-]+\.html$/.test(source.documentPath)) {
      issue(issues, "SOURCE_DOCUMENT_ROUTE_BROKEN", `${source.sourceId} declara ${source.documentPath}.`);
    }
    if (/^https?:/i.test(source.locator) || /^https?:/i.test(source.documentPath)) {
      issue(issues, "REMOTE_SOURCE", `${source.sourceId} introduce una ruta remota.`);
    }
    if (source.anchors.length === 0 || source.sections.length === 0) {
      issue(issues, "SOURCE_ROUTE_INCOMPLETE", `${source.sourceId} no declara sección o ancla.`);
    }

    const seenAnchors = new Set<string>();
    for (const anchor of source.anchors) {
      if (seenAnchors.has(anchor.id)) {
        issue(issues, "SOURCE_ANCHOR_DUPLICATE", `${source.sourceId}#${anchor.id}.`);
      }
      seenAnchors.add(anchor.id);

      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(anchor.id)) {
        issue(issues, "SOURCE_ANCHOR_INVALID", `${source.sourceId}#${anchor.id}.`);
      }
      if (
        isGenericAnchor(anchor.id)
        || isGenericAnchor(anchor.label)
        || isGenericAnchor(anchor.heading)
        || !anchor.label.trim()
        || !anchor.heading.trim()
      ) {
        issue(issues, "SOURCE_ANCHOR_GENERIC", `${source.sourceId}#${anchor.id}.`);
      }
    }
  }

  for (const ref of refs) {
    if (isGenericAnchor(ref.anchor)) {
      issue(issues, "SOURCE_REF_GENERIC", `${ref.sourceId}#${ref.anchor}.`);
      continue;
    }

    const source = sourcesById.get(ref.sourceId);
    if (!source || !source.anchors.some((anchor) => anchor.id === ref.anchor)) {
      issue(issues, "SOURCE_REF_BROKEN", `${ref.sourceId}#${ref.anchor}.`);
      continue;
    }
    if (!availableDocumentPaths.has(source.documentPath)) {
      issue(issues, "SOURCE_DOCUMENT_MISSING", `${ref.sourceId} requiere ${source.documentPath}.`);
    }
  }

  return issues.sort(compareIssues);
}

export function auditScenarioOwners(
  capabilities: readonly CapabilityDescriptor[],
  scenarios: readonly TutorScenario[],
): TutorRegistryIssue[] {
  const issues: TutorRegistryIssue[] = [];
  const capabilitiesById = new Map(capabilities.map((capability) => [capability.capabilityId, capability]));

  for (const scenario of scenarios) {
    if (scenario.expected.kind === "silent") continue;
    const capability = capabilitiesById.get(scenario.capabilityId);
    if (capability && !capability.owners.includes(scenario.expected.owner)) {
      issue(
        issues,
        "SCENARIO_OWNER_NOT_OWNED",
        `${scenario.scenarioId} usa ${scenario.expected.owner} fuera de ${scenario.capabilityId}.`,
      );
    }
  }

  return issues.sort(compareIssues);
}

export function auditTutorRegistry(): TutorRegistryIssue[] {
  const issues: TutorRegistryIssue[] = [];

  auditUnique(issues, "CAPABILITY_DUPLICATE", TUTOR_CAPABILITIES, (capability) => capability.capabilityId);
  auditUnique(issues, "CONTENT_DUPLICATE", TUTOR_CONTENT, (content) => content.contentId);
  auditUnique(issues, "SCENARIO_DUPLICATE", TUTOR_SCENARIOS, (scenario) => scenario.scenarioId);
  auditUnique(issues, "ENTRYPOINT_DUPLICATE", TUTOR_ENTRYPOINT_CATALOG, (entrypoint) => entrypoint.entrypointId);

  issues.push(...auditCapabilityEffects(
    TUTOR_CAPABILITIES,
    new Set(TUTOR_ENTRYPOINT_CATALOG
      .filter((entrypoint) => entrypoint.classification === "semantic")
      .map((entrypoint) => entrypoint.entrypointId)),
  ));
  issues.push(...auditTutorCutCoverage(TUTOR_CUT_COVERAGE));
  issues.push(...auditScenarioOwners(TUTOR_CAPABILITIES, TUTOR_SCENARIOS));

  const registryRefs = TUTOR_CONTENT.flatMap((content) => [
    ...content.sourceRefs,
    ...Object.values(content.lensDetails ?? {}).flatMap((detail) => detail?.sourceRefs ?? []),
  ]);
  issues.push(...auditTutorSourceReferences(
    TUTOR_SOURCES,
    registryRefs,
    new Set(TUTOR_SOURCES.map((source) => source.documentPath)),
  ));

  const contentByCapability = new Map<string, typeof TUTOR_CONTENT[number][]>();
  for (const content of TUTOR_CONTENT) {
    const capability = CAPABILITY_BY_ID.get(content.capabilityId);
    if (!capability) {
      issue(issues, "CONTENT_ORPHAN", `${content.contentId} apunta a ${content.capabilityId}.`);
      continue;
    }
    const current = contentByCapability.get(content.capabilityId) ?? [];
    current.push(content);
    contentByCapability.set(content.capabilityId, current);

    if (!content.now.trim() || !content.criterion.trim() || content.contexts.length === 0) {
      issue(issues, "CONTENT_INCOMPLETE", `${content.contentId} no completa Ahora/Criterio/contexto.`);
    }
    if (content.sourceRefs.length === 0) {
      issue(issues, "CONTENT_WITHOUT_SOURCE", `${content.contentId} no cita Fundamento.`);
    }

    const hasOwner = content.sourceRefs.some((ref) =>
      TUTOR_SOURCE_BY_ID.get(ref.sourceId)?.ownerPlane === content.authorityPlane,
    );
    if (!hasOwner) {
      issue(issues, "AUTHORITY_OWNER_MISSING", `${content.contentId} no cita al propietario ${content.authorityPlane}.`);
    }

    const normalizedLenses = normalizeKnowledgeLenses(content.applicableLenses);
    if (normalizedLenses.join("|") !== content.applicableLenses.join("|")) {
      issue(issues, "LENSES_NOT_CANONICAL", `${content.contentId} declara lentes duplicadas o fuera de orden.`);
    }

    const citesCategorical = content.sourceRefs.some((ref) => ref.sourceId === "source.canon.categorical");
    if (citesCategorical && (
      content.authorityPlane !== "formal-explanation"
      || content.capabilityId !== "cap.composition.interface"
    )) {
      issue(issues, "CATEGORICAL_OVERREACH", `${content.contentId} usa autoridad categorial fuera de explicación de composición.`);
    }

    if (content.action) {
      if (["reference-only", "external", "absent"].includes(capability.status)) {
        issue(issues, "NON_LIVE_ACTION", `${content.contentId} expone CTA para ${capability.status}.`);
      }
      if (!capability.entrypointIds.includes(content.action.actionId)) {
        issue(issues, "ACTION_NOT_OWNED", `${content.contentId} usa ${content.action.actionId} fuera de ${content.capabilityId}.`);
      }
    }
  }

  for (const capability of TUTOR_CAPABILITIES) {
    const contents = contentByCapability.get(capability.capabilityId) ?? [];
    if (capability.status === "absent" && contents.length > 0) {
      issue(issues, "ABSENT_PROMOTED", `${capability.capabilityId} ausente tiene contenido promocional.`);
    }
    if (capability.behavior !== "silent" && contents.length === 0) {
      issue(issues, "CONTENT_MISSING", `${capability.capabilityId} requiere contenido ${capability.behavior}.`);
    }
    if (capability.effects.some((effect) => effect.steps.some((step) => !step.outcome.trim() || !step.recovery.trim()))) {
      issue(issues, "EFFECT_INCOMPLETE", `${capability.capabilityId} no declara consecuencia y recuperación.`);
    }
    const scenarios = TUTOR_SCENARIOS.filter((scenario) => scenario.capabilityId === capability.capabilityId);
    if (scenarios.length === 0) {
      issue(issues, "SCENARIO_MISSING", `${capability.capabilityId} no tiene fixture falsable.`);
    }
    if (
      ["reference-only", "external", "absent"].includes(capability.status)
      && scenarios.some((scenario) => scenario.expected.kind !== "silent")
    ) {
      issue(issues, "NON_LIVE_SCENARIO_NOT_SILENT", `${capability.capabilityId} promete intervención para ${capability.status}.`);
    }
  }

  const semanticEntrypoints = new Set(
    TUTOR_ENTRYPOINT_CATALOG
      .filter((entrypoint) => entrypoint.classification === "semantic")
      .map((entrypoint) => entrypoint.entrypointId),
  );
  const ownedEntrypoints = new Set(TUTOR_CAPABILITIES.flatMap((capability) => capability.entrypointIds));
  for (const entrypointId of semanticEntrypoints) {
    if (!ownedEntrypoints.has(entrypointId)) issue(issues, "ENTRYPOINT_UNCLASSIFIED", `${entrypointId} no tiene capability.`);
  }
  for (const entrypointId of ownedEntrypoints) {
    if (!semanticEntrypoints.has(entrypointId)) issue(issues, "ENTRYPOINT_NOT_CATALOGED", `${entrypointId} no está en el catálogo vivo.`);
  }
  for (const entrypoint of TUTOR_ENTRYPOINT_CATALOG) {
    if (entrypoint.classification === "operational-exempt" && !entrypoint.reason?.trim()) {
      issue(issues, "EXEMPTION_WITHOUT_REASON", `${entrypoint.entrypointId} no justifica su exención.`);
    }
  }

  for (const scenario of TUTOR_SCENARIOS) {
    const capability = CAPABILITY_BY_ID.get(scenario.capabilityId);
    if (!capability) {
      issue(issues, "SCENARIO_ORPHAN", `${scenario.scenarioId} apunta a ${scenario.capabilityId}.`);
      continue;
    }
    if (!scenario.condition.trim() || !scenario.snapshot.intentId.trim() || !scenario.snapshot.actionId.trim()) {
      issue(issues, "SCENARIO_INCOMPLETE", `${scenario.scenarioId} no declara condición o snapshot concreto.`);
    }
    const actualIntervention = runTutorPolicy(scenario.snapshot, scenario.claims ?? []);
    if (stableSerialize(actualIntervention) !== stableSerialize(scenario.expected)) {
      issue(issues, "SCENARIO_POLICY_MISMATCH", `${scenario.scenarioId} no coincide con runTutorPolicy.`);
    }

    if (scenario.expected.kind === "silent") {
      if (scenario.expectedContent) {
        issue(issues, "SCENARIO_SILENT_WITH_CONTENT", `${scenario.scenarioId} declara contenido siendo silent.`);
      }
      continue;
    }

    const content = resolveTutorContent(
      scenario.expected.contentId,
      scenario.expected.activeLenses,
    );
    if (!content || content.capabilityId !== scenario.capabilityId) {
      issue(issues, "SCENARIO_CONTENT_MISMATCH", `${scenario.scenarioId} no resuelve contenido propietario.`);
      continue;
    }
    if (scenario.condition.trim() === content.moment.trim()) {
      issue(issues, "SCENARIO_TAUTOLOGICAL", `${scenario.scenarioId} copia el moment del contenido.`);
    }
    if (!scenario.expectedContent) {
      issue(issues, "SCENARIO_EXPECTATION_INCOMPLETE", `${scenario.scenarioId} no fija el contenido resuelto.`);
      continue;
    }
    const resolvedExpectation = {
      contentId: content.contentId,
      authorityPlane: content.authorityPlane,
      ...(content.action ? { actionId: content.action.actionId } : {}),
      activeLenses: content.activeLenses,
    };
    if (stableSerialize(resolvedExpectation) !== stableSerialize(scenario.expectedContent)) {
      issue(issues, "SCENARIO_RESOLUTION_MISMATCH", `${scenario.scenarioId} no coincide con resolveTutorContent.`);
    }
  }

  return issues.sort(compareIssues);
}

function auditUnique<T>(
  issues: TutorRegistryIssue[],
  code: string,
  values: readonly T[],
  keyOf: (value: T) => string,
): void {
  const seen = new Set<string>();
  for (const value of values) {
    const key = keyOf(value);
    if (seen.has(key)) issue(issues, code, key);
    seen.add(key);
  }
}

function issue(issues: TutorRegistryIssue[], code: string, detail: string): void {
  issues.push({ code, detail });
}

function isGenericAnchor(value: string): boolean {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return GENERIC_ANCHOR_NAMES.has(normalized);
}

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right, "en"))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableSerialize(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "undefined";
}

function compareIssues(left: TutorRegistryIssue, right: TutorRegistryIssue): number {
  return `${left.code}:${left.detail}`.localeCompare(`${right.code}:${right.detail}`, "en");
}
