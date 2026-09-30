import { describe, expect, test } from "bun:test";
import { definirProbabilidadesAbanico, formarAbanico } from "../modelo/abanicos";
import { agregarFuenteExploracion, agregarTrazoExploracion, crearPropuestaExploracion } from "../modelo/mesaExploracion";
import { extremoEntidad, extremoEstado } from "../modelo/extremos";
import {
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  descomponerProceso,
} from "../modelo/operaciones";
import { compartirAnclaExtremosEnlaces } from "../modelo/operaciones/ports";
import type { Modelo, Resultado } from "../modelo/tipos";
import { exportarModelo } from "./json";
import {
  createPortablePackage,
  PORTABLE_READER_PROFILE,
  readPortablePackage,
  type PortablePackageInput,
} from "./portablePackage";

function must<T>(result: Resultado<T>): T {
  if (!result.ok) throw new Error(result.error);
  return result.value;
}

function modelWithPreservedDistinctions(): Modelo {
  let model = crearModelo("Decisión portable");
  model = must(crearProceso(model, model.opdRaizId, { x: 0, y: 0 }, "Decidir"));
  model = must(crearObjeto(model, model.opdRaizId, { x: 320, y: 0 }, "Resultado"));
  const process = Object.values(model.entidades).find((item) => item.nombre === "Decidir")!;
  const output = Object.values(model.entidades).find((item) => item.nombre === "Resultado")!;
  model = must(crearEstadosIniciales(model, output.id)).modelo;
  const states = Object.values(model.estados).filter((item) => item.entidadId === output.id);
  const first = must(crearEnlace(model, model.opdRaizId, extremoEntidad(process.id), extremoEstado(states[0]!.id), "resultado"));
  model = first;
  model = must(crearEnlace(model, model.opdRaizId, extremoEntidad(process.id), extremoEstado(states[1]!.id), "resultado"));
  const branches = Object.keys(model.enlaces);
  model = must(compartirAnclaExtremosEnlaces(model, model.opdRaizId, branches, "origen", "E"));
  model = must(formarAbanico(model, model.opdRaizId, branches, "XOR"));
  model = must(definirProbabilidadesAbanico(model, Object.keys(model.abanicos ?? {})[0]!, { [branches[0]!]: 0.7, [branches[1]!]: 0.3 }));
  model = must(descomponerProceso(model, model.opdRaizId, process.id)).modelo;

  const rootOpd = model.opds[model.opdRaizId]!;
  const source = must(agregarFuenteExploracion(model, { titulo: "Borrador pendiente", contenido: "PRIVATE_SOURCE_MARKER_75f6: el proceso tiene una excepción por resolver." }, "2026-09-22T11:00:00.000Z"));
  const trace = must(agregarTrazoExploracion(source.modelo, { fuenteIds: [source.fuenteId], texto: "PRIVATE_SOURCE_MARKER_75f6: una excepción por resolver" }, "2026-09-22T11:01:00.000Z"));
  const pending = must(crearPropuestaExploracion(trace.modelo, {
    trazoIds: [trace.trazoId],
    operacion: { tipo: "crear-entidad", entidadTipo: "objeto", nombre: "PRIVATE_SOURCE_MARKER_75f6 · Excepción", opdId: model.opdRaizId },
  }, "2026-09-22T11:02:00.000Z"));
  const modelWithUrl = pending.modelo;
  const processAfter = modelWithUrl.entidades[process.id]!;
  return {
    ...pending.modelo,
    entidades: {
      ...modelWithUrl.entidades,
      [process.id]: {
        ...processAfter,
        urls: [{ id: "private-url", tipo: "articulo", url: "https://example.org/item?access_token=MODEL_SECRET_MARKER_91c2" }],
      },
    },
    notasMesa: {
      "review-1": {
        id: "review-1",
        target: { tipo: "modelo" },
        texto: "La mesa mantiene pendiente confirmar el criterio de salida.",
        fecha: "2026-09-22",
      },
    },
    declaracionesNoNucleares: {
      "assertion-1": {
        id: "assertion-1",
        clase: "restriccion",
        afirmacion: "El sistema debe conservar una salida verificable.",
        targets: [{ tipo: "modelo" }],
        propietarioSemantico: "Equipo de modelado",
        procedencia: ["Revisión humana"],
        estadoAsercion: "pendiente",
      },
    },
    submodelos: {
      "external-piece-1": {
        id: "external-piece-1",
        modeloId: "external-model-9",
        nombre: "Pieza externa",
        anchorEntidadId: process.id,
        estado: "desconectado",
        source: { modeloId: "external-model-9", nombre: "Pieza externa v9", revisionHash: "sha256:piece-v9" },
        anchor: { entidadId: process.id, opdId: rootOpd.id },
        contrato: { frozenAtHash: "sha256:contract-9" },
      },
    },
  };
}

function baseInput(overrides: Partial<PortablePackageInput> = {}): PortablePackageInput {
  const model = modelWithPreservedDistinctions();
  return {
    profile: PORTABLE_READER_PROFILE,
    createdAt: "2026-09-23T10:00:00.000Z",
    selectedRevisionId: "revision-current",
    revisions: [{
      id: "revision-current",
      modelJson: exportarModelo(model),
      label: "Decisión portable · revisión actual",
      selectedOpdId: model.opdRaizId,
      createdAt: "2026-09-23T09:50:00.000Z",
      revision: 12,
    }],
    includedSources: [{
      id: "source-allowed",
      title: "Criterio de decisión",
      locator: "https://example.org/evidence?api_key=secret-value&section=2",
      content: "Una salida válida debe quedar trazable.",
      mediaType: "text/plain",
      authorizedByUser: true,
    }],
    omittedSources: [{
      id: "source-omitted",
      title: "Pieza externa v9",
      locator: "https://library.example/pieces/model-9",
      reason: "No se incluyó el contenido externo; se conserva su localizador.",
    }],
    ...overrides,
  };
}

describe("portable package", () => {
  test("roundtrip retains XOR, refinement, pending decisions, human review, and external-piece locators", async () => {
    const bytes = await createPortablePackage(baseInput());
    const result = await readPortablePackage(bytes);
    expect(result.kind).toBe("ready");
    if (result.kind !== "ready") return;

    expect(result.integrity).toBe("verified");
    expect(result.package.manifest.selectedRevisionId).toBe("revision-current");
    expect(result.revisions).toHaveLength(1);
    const model = result.revisions[0]!.model;
    expect(Object.keys(model.opds)).toHaveLength(2);
    expect(Object.values(model.abanicos ?? {}).some((fan) => fan.operador === "XOR" && fan.decision?.modo === "probabilidades")).toBe(true);
    expect(Object.values(model.enlaces).map((link) => link.probabilidad).filter((value) => value !== undefined).sort()).toEqual([0.3, 0.7]);
    expect(Object.values(model.entidades).some((entity) => entity.refinamientos?.descomposicion?.opdId)).toBe(true);
    expect(model.declaracionesNoNucleares?.["assertion-1"]?.estadoAsercion).toBe("pendiente");
    expect(Object.values(model.mesaExploracion?.propuestas ?? {}).some((proposal) => proposal.estado === "pendiente")).toBe(true);
    expect(model.notasMesa?.["review-1"]?.texto).toContain("La mesa mantiene pendiente");
    expect(model.submodelos?.["external-piece-1"]).toMatchObject({
      estado: "desconectado",
      source: { modeloId: "external-model-9", revisionHash: "sha256:piece-v9" },
      contrato: { frozenAtHash: "sha256:contract-9" },
    });
    expect(result.package.sources.included[0]).toMatchObject({
      authorization: "human-authorized",
      content: "Una salida válida debe quedar trazable.",
      redactedLocatorParams: ["api_key"],
    });
    expect(result.package.sources.included[0]?.locator).not.toContain("secret-value");
    expect(result.package.sources.omitted[0]).toMatchObject({
      locator: "https://library.example/pieces/model-9",
      reason: "No se incluyó el contenido externo; se conserva su localizador.",
    });
  });

  test("redacts unchecked Mesa source text and derived pending text while retaining IDs and status", async () => {
    const bytes = await createPortablePackage(baseInput());
    const fullBytesAsText = new TextDecoder().decode(bytes);
    expect(fullBytesAsText).not.toContain("PRIVATE_SOURCE_MARKER_75f6");
    expect(fullBytesAsText).not.toContain("MODEL_SECRET_MARKER_91c2");
    const result = await readPortablePackage(bytes);
    expect(result.kind).toBe("ready");
    if (result.kind !== "ready") return;

    const model = result.revisions[0]!.model;
    const source = Object.values(model.mesaExploracion!.fuentes)[0]!;
    const trace = Object.values(model.mesaExploracion!.trazos)[0]!;
    const proposal = Object.values(model.mesaExploracion!.propuestas)[0]!;
    expect(source.id).toBe("fuente-exploracion-1");
    expect(source.contenido).toContain("Contenido omitido");
    expect(trace.fuenteIds).toEqual([source.id]);
    expect(trace.texto).toContain("Texto dependiente omitido");
    expect(proposal.trazoIds).toEqual([trace.id]);
    expect(proposal.estado).toBe("pendiente");
    expect(proposal.operacion.nombre).toContain("Propuesta pendiente");
    expect(result.package.sources.omitted.some((item) => item.modelSourceId === source.id && item.locator.includes(source.id))).toBe(true);
    expect(Object.values(model.entidades).flatMap((entity) => entity.urls ?? []).find((item) => item.id === "private-url")?.url).toContain("redacted");
  });

  test("included model source text needs an explicit matching source grant", async () => {
    const input = baseInput();
    const model = JSON.parse(input.revisions[0]!.modelJson) as { modelo: Modelo };
    const source = Object.values(model.modelo.mesaExploracion!.fuentes)[0]!;
    input.includedSources = [...(input.includedSources ?? []), {
      id: `mesa:${source.id}`,
      modelSourceId: source.id,
      title: source.titulo ?? "Fuente de la mesa",
      locator: `opforja://mesa-exploracion/${source.id}`,
      content: source.contenido,
      mediaType: "text/plain",
      authorizedByUser: true,
    }];
    const bytes = await createPortablePackage(input);
    expect(new TextDecoder().decode(bytes)).toContain("PRIVATE_SOURCE_MARKER_75f6");
    const result = await readPortablePackage(bytes);
    expect(result.kind).toBe("ready");
    if (result.kind !== "ready") return;
    expect(result.package.sources.included.find((item) => item.modelSourceId === source.id)?.content).toContain("PRIVATE_SOURCE_MARKER_75f6");
  });

  test("rejects changed payload bytes and extra envelope fields", async () => {
    const bytes = await createPortablePackage(baseInput());
    const envelope = JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
    envelope.payload = `${String(envelope.payload)} `;
    await expect(readPortablePackage(JSON.stringify(envelope))).rejects.toThrow("huella");

    const clean = JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
    clean.privateConversation = "not part of this format";
    await expect(readPortablePackage(JSON.stringify(clean))).rejects.toThrow("propiedades no admitidas");
  });

  test("requires explicit source consent and preserves incompatible profile bytes unchanged", async () => {
    const unauthorized = baseInput({ includedSources: [{
      id: "source-private",
      title: "No autorizado",
      locator: "https://example.org/private",
      content: "contenido",
      authorizedByUser: false as unknown as true,
    }] });
    await expect(createPortablePackage(unauthorized)).rejects.toThrow("autorización explícita");

    const bytes = await createPortablePackage(baseInput({ profile: { id: "future-profile", version: "v9" } }));
    const result = await readPortablePackage(bytes);
    expect(result.kind).toBe("unsupported-profile");
    expect([...result.originalBytes]).toEqual([...bytes]);

    const compatibleBytes = await createPortablePackage(baseInput());
    const envelope = JSON.parse(new TextDecoder().decode(compatibleBytes)) as { payload: string; integrity: { algorithm: string; payloadDigest: string } };
    const payload = JSON.parse(envelope.payload) as { profile: { id: string; version: string }; revisions: Array<{ modelJson: string }> };
    payload.profile = { id: "future-profile", version: "v9" };
    payload.revisions[0]!.modelJson = "future model representation; do not hydrate with v0";
    envelope.payload = JSON.stringify(payload);
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(envelope.payload));
    envelope.integrity.payloadDigest = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
    const futureBytes = new TextEncoder().encode(JSON.stringify(envelope));
    const futureResult = await readPortablePackage(futureBytes);
    expect(futureResult.kind).toBe("unsupported-profile");
    expect([...futureResult.originalBytes]).toEqual([...futureBytes]);
  });

  test("redacts credentials in stereotype template URLs, including fragment parameters, without mutating the source model", async () => {
    const model = modelWithPreservedDistinctions();
    const templateUrl = "https://TEMPLATE_USER_SECRET:TEMPLATE_PASS_SECRET@example.org/pattern?access_token=TEMPLATE_QUERY_SECRET&view=opd#access_token=TEMPLATE_HASH_SECRET&section=overview";
    const entity = Object.values(model.entidades)[0]!;
    model.estereotipos = {
      "stereotype-private-links": {
        id: "stereotype-private-links",
        nombre: "Enlaces privados de plantilla",
        plantilla: {
          entidades: {
            "template-entity": {
              ...entity,
              id: "template-entity",
              nombre: "Entidad de plantilla",
              urls: [{ id: "template-url", tipo: "articulo", url: templateUrl }],
            },
          },
          estados: {},
          enlaces: {},
          apariencias: { "template-entity": { x: 0, y: 0, width: 120, height: 60 } },
        },
      },
    };
    const originalJson = exportarModelo(model);
    expect(originalJson).toContain("TEMPLATE_USER_SECRET");
    expect(originalJson).toContain("TEMPLATE_HASH_SECRET");

    const input = baseInput();
    input.revisions[0] = { ...input.revisions[0]!, modelJson: originalJson };
    const bytes = await createPortablePackage(input);
    const packageText = new TextDecoder().decode(bytes);
    for (const marker of [
      "TEMPLATE_USER_SECRET",
      "TEMPLATE_PASS_SECRET",
      "TEMPLATE_QUERY_SECRET",
      "TEMPLATE_HASH_SECRET",
      "MODEL_SECRET_MARKER_91c2",
    ]) expect(packageText).not.toContain(marker);
    expect(model.estereotipos["stereotype-private-links"]!.plantilla!.entidades["template-entity"]!.urls![0]!.url).toBe(templateUrl);
  });
});
