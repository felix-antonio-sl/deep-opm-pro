import { CryptoHasher } from "bun";
import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import {
  auditCapabilityEffects,
  auditScenarioOwners,
  auditTutorCutCoverage,
  auditTutorRegistry,
  auditTutorSourceReferences,
  TUTOR_REQUIRED_CUTS,
} from "./auditoria";
import { CAPABILITY_BY_ID, TUTOR_CAPABILITIES, TUTOR_CUT_COVERAGE, TUTOR_ENTRYPOINT_CATALOG } from "./capacidades";
import {
  TUTOR_CONTENT,
  getTutorContent,
  resolveTutorContent,
  searchTutorContent,
} from "./contenidos";
import { TUTOR_SCENARIOS } from "./escenarios";
import {
  TUTOR_SOURCES,
  resolveTutorSourceDocument,
  resolveTutorSourceRef,
  searchTutorSources,
} from "./fuentes";
import { runTutorPolicy } from "./politica";
import type { CapabilityDescriptor, TutorEntrypointId, TutorScenario, TutorSource } from "./tipos";
import { construirAccionesMenuCommandPalette } from "../ui/CommandPalette";

const repoRoot = join(import.meta.dir, "../../..");

describe("registro verificable del tutor", () => {
  test("cruza descriptores, contenido, escenarios, entrypoints y fuentes sin brechas", () => {
    expect(auditTutorRegistry()).toEqual([]);
  });

  test("cubre de 1A a 7C con capacidades, entrypoints, escenarios y prueba explícitos", () => {
    expect(TUTOR_CUT_COVERAGE.map((record) => record.cut)).toEqual([...TUTOR_REQUIRED_CUTS]);
    expect(auditTutorCutCoverage(TUTOR_CUT_COVERAGE)).toEqual([]);
    expect(issueCodes(auditTutorCutCoverage(TUTOR_CUT_COVERAGE.slice(1))))
      .toContain("CUT_MISSING");
  });

  test("ningun estado no vivo expone CTA", () => {
    for (const content of TUTOR_CONTENT) {
      const capability = CAPABILITY_BY_ID.get(content.capabilityId);
      expect(capability).toBeDefined();
      if (capability && ["reference-only", "external", "absent"].includes(capability.status)) {
        expect(content.action).toBeUndefined();
      }
    }
  });

  test("el catalogo clasifica cada entrypoint semantico o justifica su exencion", () => {
    for (const entrypoint of TUTOR_ENTRYPOINT_CATALOG) {
      if (entrypoint.classification === "operational-exempt") {
        expect(entrypoint.reason?.trim().length).toBeGreaterThan(0);
      }
    }
    expect(new Set(TUTOR_ENTRYPOINT_CATALOG.map((entrypoint) => entrypoint.entrypointId)).size)
      .toBe(TUTOR_ENTRYPOINT_CATALOG.length);
    expect(TUTOR_ENTRYPOINT_CATALOG.find((entrypoint) => entrypoint.entrypointId === "palette:configuracion")?.classification)
      .toBe("operational-exempt");
    expect(CAPABILITY_BY_ID.get("cap.persistence.import-save")?.entrypointIds)
      .not.toContain("palette:configuracion");
  });

  test("cada accion viva del menu Ctrl+K entra al gate explicito", () => {
    const cataloged = new Set(TUTOR_ENTRYPOINT_CATALOG.map((entrypoint) => entrypoint.entrypointId));
    const actions = construirAccionesMenuCommandPalette(commandPaletteDeps());
    for (const action of actions) expect(cataloged.has(`palette:${action.id}`)).toBeTrue();
  });

  test("cada entrypoint semantico vivo tiene efecto propietario y recuperacion", () => {
    const semantic = new Set(TUTOR_ENTRYPOINT_CATALOG
      .filter((entrypoint) => entrypoint.classification === "semantic")
      .map((entrypoint) => entrypoint.entrypointId));
    expect(auditCapabilityEffects(TUTOR_CAPABILITIES, semantic)).toEqual([]);

    const capability = CAPABILITY_BY_ID.get("cap.start.workspace");
    expect(capability).toBeDefined();
    if (!capability) throw new Error("Falta cap.start.workspace en el fixture.");
    const withoutCoverage: CapabilityDescriptor = {
      ...capability,
      effects: capability.effects.map((effect) => ({ ...effect, entrypointIds: [] })),
    };
    expect(issueCodes(auditCapabilityEffects([withoutCoverage], semantic)))
      .toContain("ENTRYPOINT_WITHOUT_EFFECT");
    const outsideOwner: CapabilityDescriptor = {
      ...capability,
      effects: [{ ...capability.effects[0]!, entrypointIds: ["tutor:search"] }],
    };
    expect(issueCodes(auditCapabilityEffects([outsideOwner], semantic)))
      .toContain("EFFECT_ENTRYPOINT_OUTSIDE_CAPABILITY");
    const duplicateEffect: CapabilityDescriptor = {
      ...capability,
      effects: [capability.effects[0]!, capability.effects[0]!],
    };
    expect(issueCodes(auditCapabilityEffects([duplicateEffect], semantic)))
      .toContain("EFFECT_ENTRYPOINT_DUPLICATE");
  });

  test("cada escenario no silencioso usa una superficie propietaria de su capacidad", () => {
    expect(auditScenarioOwners(TUTOR_CAPABILITIES, TUTOR_SCENARIOS)).toEqual([]);
    const scenario = TUTOR_SCENARIOS.find((item) => item.expected.kind !== "silent");
    expect(scenario).toBeDefined();
    if (!scenario || scenario.expected.kind === "silent") throw new Error("Falta escenario no silencioso.");
    const invalid = {
      ...scenario,
      expected: { ...scenario.expected, owner: "mobile-read" as const },
    } satisfies TutorScenario;
    expect(issueCodes(auditScenarioOwners(TUTOR_CAPABILITIES, [invalid])))
      .toContain("SCENARIO_OWNER_NOT_OWNED");
  });

  test("apertura y commit conservan secuencias de efecto honestas", () => {
    const start = effectByEntrypoint("cap.start.workspace");
    expect(effectKinds(start, "palette:nuevo-modelo")).toEqual(["workspace"]);
    expect(lastRecovery(start, "palette:nuevo-modelo")).toContain("no existe un paso de Cancelar");

    const pieces = effectByEntrypoint("cap.reuse.pieces");
    expect(effectKinds(pieces, "palette:vitrina-estereotipos")).toEqual(["transient-ui"]);
    expect(effectKinds(pieces, "pieces:copy")).toEqual(["model"]);

    const persistence = effectByEntrypoint("cap.persistence.import-save");
    expect(effectKinds(persistence, "palette:abrir-importar")).toEqual(["transient-ui"]);
    expect(effectKinds(persistence, "workspace:import-active")).toEqual(["external", "transient-ui", "model", "model"]);
    expect(effectKinds(persistence, "workspace:save")).toEqual(["external", "workspace"]);

    const appearance = effectByEntrypoint("cap.appearance.view");
    expect(effectKinds(appearance, "palette:alias-visibles")).toEqual(["transient-ui"]);
    expect(effectKinds(appearance, "palette:auto-layout")).toEqual(["model"]);

    const requirements = effectByEntrypoint("cap.requirement.coverage");
    expect(effectKinds(requirements, "palette:crear-requisito")).toEqual(["transient-ui"]);
    expect(effectKinds(requirements, "requirement:create")).toEqual(["model"]);

    const submodel = effectByEntrypoint("cap.submodel.reference");
    expect(effectKinds(submodel, "palette:conectar-submodelo")).toEqual(["transient-ui"]);
    expect(effectKinds(submodel, "submodel:connect-reference")).toEqual(["model"]);
    expect(effectKinds(submodel, "submodel:open-reference")).toEqual(["read"]);

    const numeric = effectByEntrypoint("cap.simulation.numeric");
    expect(effectKinds(numeric, "palette:simulacion-numerica")).toEqual(["transient-ui"]);
    expect(effectKinds(numeric, "simulation:numeric-run")).toEqual(["transient-ui"]);
    expect(effectKinds(numeric, "simulation:numeric-csv")).toEqual(["external"]);

    const flow = effectByEntrypoint("cap.flow.control");
    expect(effectKinds(flow, "palette:resolver-decision")).toEqual(["transient-ui"]);

    const diagnostic = effectByEntrypoint("cap.diagnostic.reactive");
    expect(effectKinds(diagnostic, "diagnostic:focus-issue")).toEqual(["read"]);
    expect(effectKinds(diagnostic, "palette:exportar-diagnostico")).toEqual(["external"]);

    const lifecycle = effectByEntrypoint("cap.lifecycle.regime");
    expect(effectKinds(lifecycle, "workspace:graduate-model")).toEqual(["read", "external", "workspace"]);
    expect(effectKinds(lifecycle, "workspace:mark-library")).toEqual(["workspace"]);
  });

  test("ficha local y ficha upstream conservan contratos separados", () => {
    const local = CAPABILITY_BY_ID.get("cap.ficha.local");
    const upstream = CAPABILITY_BY_ID.get("cap.ficha.upstream");
    expect(local?.cut).toBe("3A");
    expect(local?.status).toBe("live");
    expect(local?.entrypointIds).toContain("inspector:ficha-pregunta-habilitante");
    expect(local?.entrypointIds).toContain("inspector:ficha-lentes-conocimiento");
    expect(local?.effects.every((effect) => effect.steps.every((step) => step.kind === "model" && step.recovery.includes("restaura"))))
      .toBeTrue();
    expect(upstream?.status).toBe("external");
    expect(upstream?.entrypointIds).toEqual([]);
  });

  test("crear, restaurar y eliminar version tienen efectos mutantes propios", () => {
    const history = CAPABILITY_BY_ID.get("cap.history.review-version");
    expect(history).toBeDefined();
    const effectByEntrypoint = new Map(history?.effects.flatMap((effect) =>
      effect.entrypointIds.map((entrypointId) => [entrypointId, effect] as const)
    ));
    expect(effectKinds(effectByEntrypoint, "workspace:create-version")).toEqual(["external"]);
    expect(effectKinds(effectByEntrypoint, "workspace:restore-version-copy")).toEqual(["external", "external", "workspace"]);
    expect(lastRecovery(effectByEntrypoint, "workspace:restore-version-copy")).toContain("reabrir el original");
    expect(lastRecovery(effectByEntrypoint, "workspace:delete-version")).toContain("no existe undo");
    expect(effectByEntrypoint.has("palette:versiones-modelo")).toBeTrue();
  });

  test("inventaria las cinco autoridades y todo el corpus pedagogico aprobado", () => {
    expect(TUTOR_SOURCES.filter((source) => source.sourceClass === "canonical")).toHaveLength(5);
    expect(TUTOR_SOURCES.filter((source) => source.sourceClass !== "canonical")).toHaveLength(23);

    const manifestSheets = TUTOR_SOURCES
      .filter((source) => source.sourceClass === "cheatsheet")
      .map((source) => source.locator.replace("docs/cheatsheets/", ""))
      .sort();
    const liveSheets = [...new Bun.Glob("*.html").scanSync({
      cwd: join(repoRoot, "docs/cheatsheets"),
      onlyFiles: true,
    })].sort();
    expect(manifestSheets).toEqual(liveSheets);
  });

  test("cada ruta repo-local existe y conserva su checksum reproducible", async () => {
    for (const source of TUTOR_SOURCES) {
      if (source.integrity.kind !== "sha256") continue;
      const file = Bun.file(join(repoRoot, source.locator));
      expect(await file.exists()).toBeTrue();
      const digest = new CryptoHasher("sha256").update(await file.arrayBuffer()).digest("hex");
      expect(digest).toBe(source.integrity.value);
    }
  });

  test("cada ancla repo-local corresponde a un heading tematico real", async () => {
    for (const source of TUTOR_SOURCES) {
      if (source.integrity.kind !== "sha256") continue;
      const body = await Bun.file(join(repoRoot, source.locator)).text();
      const headings = extractHeadings(body, source.locator.endsWith(".html"));
      for (const anchor of source.anchors) {
        expect(headings.has(anchor.heading)).toBeTrue();
      }
    }
  });

  test("resuelve documento completo y ancla por URL local estatica", () => {
    for (const source of TUTOR_SOURCES) {
      expect(resolveTutorSourceDocument(source.sourceId)).toEqual({
        source,
        href: `/tutor-sources/${source.sourceId}.html`,
      });
      for (const anchor of source.anchors) {
        const resolved = resolveTutorSourceRef({ sourceId: source.sourceId, anchor: anchor.id });
        expect(resolved?.anchor).toEqual(anchor);
        expect(resolved?.href).toBe(`/tutor-sources/${source.sourceId}.html#${anchor.id}`);
        expect(resolved?.href.includes(source.locator)).toBeFalse();
      }
    }
  });

  test("la auditoria rechaza root, rutas rotas, anclas rotas y documento ausente", () => {
    const source = TUTOR_SOURCES[0] as TutorSource;
    const validRef = { sourceId: source.sourceId, anchor: source.anchors[0]!.id };
    const genericSource = {
      ...source,
      anchors: [{ id: "root", label: "Documento completo", heading: "Documento completo" }],
    } as TutorSource;
    expect(issueCodes(auditTutorSourceReferences(
      [genericSource],
      [{ sourceId: source.sourceId, anchor: "root" }],
      new Set([source.documentPath]),
    ))).toContain("SOURCE_ANCHOR_GENERIC");
    expect(issueCodes(auditTutorSourceReferences(
      [source],
      [{ sourceId: source.sourceId, anchor: "does-not-exist" }],
      new Set([source.documentPath]),
    ))).toContain("SOURCE_REF_BROKEN");
    expect(issueCodes(auditTutorSourceReferences(
      [{ ...source, documentPath: "/tutor-sources/wrong.html" } as TutorSource],
      [validRef],
      new Set(["/tutor-sources/wrong.html"]),
    ))).toContain("SOURCE_DOCUMENT_ROUTE_BROKEN");
    expect(issueCodes(auditTutorSourceReferences([source], [validRef], new Set())))
      .toContain("SOURCE_DOCUMENT_MISSING");
  });

  test("cada URN canonica resuelve por version en el resolutor vivo", async () => {
    const resolver = await Bun.file(join(repoRoot, "docs/canon-opm/resolutor-urn.json")).json() as {
      urn: Record<string, { path: string; version: string }>;
    };

    for (const source of TUTOR_SOURCES) {
      if (source.integrity.kind !== "version") continue;
      expect(resolver.urn[source.locator]?.version).toBe(source.integrity.value);
      expect(resolver.urn[source.locator]?.path.trim().length).toBeGreaterThan(0);
    }
  });

  test("cada escenario de integración cita un recorrido E2E existente y exacto", async () => {
    const integrations = TUTOR_SCENARIOS.filter((scenario) => scenario.testCondition === "integration");
    expect(integrations.length).toBeGreaterThan(0);
    for (const scenario of integrations) {
      const evidence = scenario.integrationEvidence;
      const body = await Bun.file(join(repoRoot, "app", evidence.file)).text();
      expect(body).toContain(`test("${evidence.test}"`);
    }
  });

  test("la busqueda es estable y las lentes no cambian Ahora ni CTA", () => {
    const first = searchTutorContent("frontera", ["health", "systems", "health"]);
    const second = searchTutorContent("frontera", ["systems", "health"]);
    expect(first).toEqual(second);
    expect(first.length).toBeGreaterThan(0);

    const base = getTutorContent("content.purpose.frontier");
    const resolved = resolveTutorContent("content.purpose.frontier", ["health", "systems"]);
    expect(resolved?.now).toBe(base?.now);
    expect(resolved?.action).toEqual(base?.action);
    expect(resolved?.activeLenses).toEqual(["systems", "health"]);
    expect(searchTutorSources("sanitario").some((source) => source.sourceId === "source.manual.health")).toBeTrue();
    expect(searchTutorContent("Reglas OPM estrictas").length).toBeGreaterThan(0);
  });

  test("la autoridad categorial solo explica composicion o preservacion", () => {
    const categorical = TUTOR_CONTENT.filter((content) =>
      content.sourceRefs.some((ref) => ref.sourceId === "source.canon.categorical"),
    );
    expect(categorical.length).toBeGreaterThan(0);
    for (const content of categorical) {
      expect(content.authorityPlane).toBe("formal-explanation");
      expect(content.capabilityId).toBe("cap.composition.interface");
    }
  });

  test("los escenarios son fixtures falsables de politica y resolucion", () => {
    for (const capability of TUTOR_CAPABILITIES) {
      expect(TUTOR_SCENARIOS.some((scenario) => scenario.capabilityId === capability.capabilityId)).toBeTrue();
    }
    for (const scenario of TUTOR_SCENARIOS) {
      expect(runTutorPolicy(scenario.snapshot, scenario.claims ?? [])).toEqual(scenario.expected);

      if (scenario.expected.kind === "silent") {
        expect(scenario.expectedContent).toBeUndefined();
        continue;
      }

      const resolved = resolveTutorContent(
        scenario.expected.contentId,
        scenario.expected.activeLenses,
      );
      expect(resolved).not.toBeNull();
      expect(scenario.expectedContent).toBeDefined();
      if (!scenario.expectedContent) throw new Error(`${scenario.scenarioId} no declara expectedContent.`);
      expect({
        contentId: resolved?.contentId,
        authorityPlane: resolved?.authorityPlane,
        ...(resolved?.action ? { actionId: resolved.action.actionId } : {}),
        activeLenses: resolved?.activeLenses,
      }).toEqual(scenario.expectedContent);
    }
  });

  test("las referencias base y de lentes son tematicas y resolubles", () => {
    for (const content of TUTOR_CONTENT) {
      const refs = [
        ...content.sourceRefs,
        ...Object.values(content.lensDetails ?? {}).flatMap((detail) => detail?.sourceRefs ?? []),
      ];
      for (const ref of refs) {
        expect(ref.anchor).not.toBe("root");
        expect(resolveTutorSourceRef(ref)).not.toBeNull();
      }
    }
  });
});

function effectByEntrypoint(capabilityId: CapabilityDescriptor["capabilityId"]) {
  const capability = CAPABILITY_BY_ID.get(capabilityId);
  if (!capability) throw new Error(`Falta ${capabilityId}.`);
  return new Map(capability.effects.flatMap((effect) =>
    effect.entrypointIds.map((entrypointId) => [entrypointId, effect] as const)
  ));
}

function effectKinds(
  effects: ReturnType<typeof effectByEntrypoint>,
  entrypointId: TutorEntrypointId,
) {
  return effects.get(entrypointId)?.steps.map((step) => step.kind) ?? [];
}

function lastRecovery(
  effects: ReturnType<typeof effectByEntrypoint>,
  entrypointId: TutorEntrypointId,
) {
  return effects.get(entrypointId)?.steps.at(-1)?.recovery;
}

function issueCodes(issues: ReturnType<typeof auditTutorSourceReferences>): string[] {
  return issues.map((issue) => issue.code);
}

function extractHeadings(body: string, html: boolean): Set<string> {
  if (!html) {
    return new Set(
      body.split("\n")
        .flatMap((line) => line.match(/^#{1,6}\s+(.+?)\s*$/)?.[1] ?? [])
        .map((heading) => heading.trim()),
    );
  }

  return new Set(
    [...body.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)]
      .map((match) => (match[1] ?? "")
        .replace(/<[^>]+>/g, "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, "\"")
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim()),
  );
}

function commandPaletteDeps(): Parameters<typeof construirAccionesMenuCommandPalette>[0] {
  const booleanKeys = new Set([
    "gridActiva",
    "opdActivoBloqueadoDensidad",
    "modeloBloqueadoDensidad",
    "opdActivoBloqueadoSuelto",
    "modeloBloqueadoSueltos",
    "hayEntidadSeleccionada",
    "hayEnlaceSeleccionado",
    "aliasVisibles",
    "descripcionesVisibles",
    "soloCanvasActivo",
    "modoImagenGlobalActivo",
    "mostrarArchivados",
    "mostrarVersiones",
  ]);
  return new Proxy({}, {
    get: (_target, property) => {
      if (typeof property === "string" && booleanKeys.has(property)) return false;
      if (property === "modeloPersistidoId") return "modelo-test";
      if (property === "etiquetaModoImagenGlobal") return "texto";
      return () => {};
    },
  }) as Parameters<typeof construirAccionesMenuCommandPalette>[0];
}
