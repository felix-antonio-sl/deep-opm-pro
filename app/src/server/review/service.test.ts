import { describe, expect, test } from "bun:test";
import { exportarModelo } from "../../serializacion/json";
import { crearObjeto, crearModelo } from "../../modelo/operaciones/creacion";
import { MESA_EXPLORACION_SCHEMA } from "../../modelo/tipos/extensiones";
import type { Modelo } from "../../modelo/tipos";
import type { PersistenciaSesion } from "../modelPersistence";
import { createMemoryReviewRepository } from "./memoryRepository";
import { createReviewService } from "./service";
import { canonicalWorkingCopyHash } from "./hash";

const owner: PersistenciaSesion = { tenantId: "tenant", userId: "owner", auth: true, authKind: "operator" };
const other: PersistenciaSesion = { tenantId: "tenant", userId: "other", auth: true, authKind: "operator" };
const agent: PersistenciaSesion = { tenantId: "tenant", userId: "owner", auth: true, authKind: "agent" };

function modelWithSources(): Modelo {
  let model = crearModelo("Revisión congelada");
  const withEntity = crearObjeto(model, model.opdRaizId, { x: 10, y: 20 }, "Elemento", { id: "entity-1" });
  if (!withEntity.ok) throw new Error(withEntity.error);
  model = withEntity.value;
  model.entidades["entity-1"] = {
    ...model.entidades["entity-1"]!,
    urls: [{ id: "private-url", tipo: "articulo", url: "https://example.test/?access_token=REVIEW_SECRET_MARKER" }],
  };
  model.notasMesa = { privateNote: { id: "privateNote", target: { tipo: "modelo" }, texto: "nota personal secreta", fecha: "2026-01-01" } };
  model.mesaExploracion = {
    schema: MESA_EXPLORACION_SCHEMA,
    fuentes: {
      allowed: { id: "allowed", tipo: "texto", titulo: "Fuente elegida", contenido: "Texto autorizado", creadaEn: "2026-01-01" },
      denied: { id: "denied", tipo: "texto", titulo: "Fuente no elegida", contenido: "Contenido privado", creadaEn: "2026-01-01" },
    },
    trazos: {
      allowedTrace: { id: "allowedTrace", fuenteIds: ["allowed"], texto: "Fragmento elegido", creadoEn: "2026-01-01" },
      deniedTrace: { id: "deniedTrace", fuenteIds: ["denied"], texto: "Fragmento oculto", creadoEn: "2026-01-01" },
    },
    propuestas: {},
    confirmaciones: {},
  };
  return model;
}

function jsonRequest(path: string, method = "GET", body?: unknown): Request {
  return new Request(`http://local${path}`, {
    method,
    ...(body !== undefined ? { headers: { "content-type": "application/json" }, body: JSON.stringify(body) } : {}),
  });
}

describe("servicio de revisión compartida", () => {
  test("inmoviliza la revisión, aplica fuentes seleccionadas, conserva anotaciones y revoca el acceso", async () => {
    let currentModel = modelWithSources();
    let currentRevision = 3;
    const repository = createMemoryReviewRepository(async (session, documentId) =>
      documentId === currentModel.id
        ? { ownerId: "owner", revision: currentRevision, source: "autosave", modelJson: exportarModelo(currentModel), modelName: currentModel.nombre }
        : null,
    );
    let tick = 0;
    const service = createReviewService({ repository, now: () => `2026-02-01T00:00:0${tick++}.000Z` });
    const baseHash = canonicalWorkingCopyHash(exportarModelo(currentModel))!;
    const staleResponse = await service.handleOperator(jsonRequest("/__deep-opm/review/grants", "POST", {
      documentId: currentModel.id,
      includedSourceIds: ["allowed"],
      annotate: true,
      expectedRevision: 2,
      expectedWorkingCopyHash: baseHash,
    }), owner);
    expect(staleResponse.status).toBe(409);
    const createdResponse = await service.handleOperator(jsonRequest("/__deep-opm/review/grants", "POST", {
      documentId: currentModel.id,
      includedSourceIds: ["allowed"],
      annotate: true,
      expectedRevision: 3,
      expectedWorkingCopyHash: baseHash,
    }), owner);
    expect(createdResponse.status).toBe(201);
    const { share, token } = await createdResponse.json() as { share: { id: string; revision: number; source: string }; token: string };
    expect(share).toMatchObject({ revision: 3, source: "autosave" });
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);

    currentModel = crearModelo("Nuevo estado posterior");
    currentRevision = 4;
    const sharePath = `/__deep-opm/review/${token}`;
    const firstRead = await service.handlePublic(jsonRequest(sharePath));
    expect(firstRead.status).toBe(200);
    const view = await firstRead.json() as { share: { revision: number; modelName: string; omittedSourcesCount: number }; modelJson: string; sources: Array<{ id: string; content: string }> };
    expect(view.share).toMatchObject({ revision: 3, modelName: "Revisión congelada" });
    expect(view.share.omittedSourcesCount).toBe(1);
    expect(view.sources).toHaveLength(1);
    expect(view.sources[0]).toMatchObject({ id: "allowed", title: "Fuente elegida", content: "Texto autorizado", mediaType: "text/plain" });
    expect(view.modelJson).toContain("Texto autorizado");
    expect(view.modelJson).not.toContain("Contenido privado");
    expect(view.modelJson).not.toContain("Fragmento oculto");
    expect(view.modelJson).not.toContain("nota personal secreta");
    expect(view.modelJson).not.toContain("REVIEW_SECRET_MARKER");
    expect(JSON.stringify(view)).not.toContain('"denied"');
    expect(JSON.stringify(view)).not.toContain("Fuente no elegida");
    expect(view.modelJson).not.toContain('"id":"modelo-1"');
    expect(JSON.stringify(view)).not.toContain('"documentId"');
    expect(firstRead.headers.get("cache-control")).toContain("no-store");
    expect(firstRead.headers.get("referrer-policy")).toBe("no-referrer");

    const anchor = { kind: "entity", id: "entity-1" };
    const posted = await Promise.all(["Lector A", "Lector B"].map(() => service.handlePublic(
      jsonRequest(`${sharePath}/annotations`, "POST", { anchor, text: "Revisar esta decisión" }),
    )));
    expect(posted.map((response) => response.status)).toEqual([201, 201]);
    const annotations = await Promise.all(posted.map(async (response) => (await response.json() as { annotation: { id: string; actorId: string; revision: number } }).annotation));
    expect(annotations[0]!.actorId).not.toBe(annotations[1]!.actorId);
    expect(annotations.map((annotation) => annotation.revision)).toEqual([3, 3]);
    const ownerReview = await service.handleOperator(jsonRequest(`/__deep-opm/review/grants/${share.id}?documentId=${currentModel.id}`), owner);
    expect(ownerReview.status).toBe(200);
    expect((await ownerReview.json() as { annotations: unknown[] }).annotations).toHaveLength(2);

    const strangerList = await service.handleOperator(jsonRequest(`/__deep-opm/review/grants?documentId=${currentModel.id}`), other);
    expect(await strangerList.json()).toEqual({ shares: [] });
    const strangerRevoke = await service.handleOperator(jsonRequest(`/__deep-opm/review/grants/${share.id}?documentId=${currentModel.id}`, "DELETE"), other);
    expect(strangerRevoke.status).toBe(404);
    expect((await service.handleOperator(jsonRequest("/__deep-opm/review/grants", "POST", {
      documentId: currentModel.id, includedSourceIds: [], annotate: true,
      expectedRevision: currentRevision,
      expectedWorkingCopyHash: canonicalWorkingCopyHash(exportarModelo(currentModel)),
    }), other)).status).toBe(404);
    expect((await service.handleOperator(jsonRequest("/__deep-opm/review/grants", "POST", {
      documentId: currentModel.id, includedSourceIds: [], annotate: true,
    }), agent)).status).toBe(403);

    const firstAnnotation = annotations[0]!;
    const resolutionResponse = await service.handleOperator(jsonRequest(
      `/__deep-opm/review/grants/${share.id}/annotations/${firstAnnotation.id}/resolve?documentId=${currentModel.id}`,
      "POST",
      { outcome: "kept", note: "Se conserva el comentario original" },
    ), owner);
    expect(resolutionResponse.status).toBe(200);
    const resolution = (await resolutionResponse.json() as { annotation: { text: string; resolutions: Array<{ revision: number; anchorPresent: boolean }> } }).annotation;
    expect(resolution.text).toBe("Revisar esta decisión");
    expect(resolution.resolutions).toHaveLength(1);
    expect(resolution.resolutions[0]).toMatchObject({ revision: 4, anchorPresent: false, outcome: "kept" });

    const revoked = await service.handleOperator(jsonRequest(`/__deep-opm/review/grants/${share.id}?documentId=${currentModel.id}`, "DELETE"), owner);
    expect(revoked.status).toBe(200);
    const unavailable = await service.handlePublic(jsonRequest(sharePath));
    const invalid = await service.handlePublic(jsonRequest(`/__deep-opm/review/${"a".repeat(43)}`));
    expect(unavailable.status).toBe(404);
    expect(await unavailable.text()).toBe(await invalid.text());
  });

  test("rechaza anotaciones si el autor compartió la revisión como solo lectura", async () => {
    const model = modelWithSources();
    const repository = createMemoryReviewRepository(async (session, documentId) =>
      documentId === model.id ? { ownerId: "owner", revision: 1, source: "saved", modelJson: exportarModelo(model), modelName: model.nombre } : null,
    );
    const service = createReviewService({ repository });
    const created = await service.handleOperator(jsonRequest("/__deep-opm/review/grants", "POST", {
      documentId: model.id, includedSourceIds: [], annotate: false,
      expectedRevision: 1,
      expectedWorkingCopyHash: canonicalWorkingCopyHash(exportarModelo(model)),
    }), owner);
    const { token } = await created.json() as { token: string };
    const publicView = await service.handlePublic(jsonRequest(`/__deep-opm/review/${token}`));
    expect(publicView.status).toBe(200);
    const publicResult = await publicView.json() as { share: { omittedSourcesCount: number }; sources: unknown[] };
    expect(publicResult.share.omittedSourcesCount).toBe(2);
    expect(publicResult.sources).toHaveLength(0);
    const denied = await service.handlePublic(jsonRequest(`/__deep-opm/review/${token}/annotations`, "POST", {
      anchor: { kind: "model" }, text: "No debe entrar",
    }));
    expect(denied.status).toBe(403);
  });
});
