import { describe, expect, test } from "bun:test";
import { projectReviewModel, reviewAnchorExists, addReviewResolution, type ReviewAnnotation } from "./review";
import { crearModelo, crearObjeto } from "./operaciones/creacion";
import { MESA_EXPLORACION_SCHEMA } from "./tipos/extensiones";

describe("modelo de revisión compartida", () => {
  test("filtra fuentes y todo trazo/propuesta/confirmación que dependa de una fuente excluida", () => {
    const model = crearModelo("Snapshot");
    model.notasMesa = { note: { id: "note", target: { tipo: "modelo" }, texto: "privado", fecha: "2026-01-01" } };
    model.mesaExploracion = {
      schema: MESA_EXPLORACION_SCHEMA,
      fuentes: {
        allowed: { id: "allowed", tipo: "texto", titulo: "Compartida", contenido: "visible", creadaEn: "2026-01-01" },
        denied: { id: "denied", tipo: "texto", titulo: "Secreto", contenido: "no devolver", creadaEn: "2026-01-01" },
      },
      trazos: {
        publicTrace: { id: "publicTrace", fuenteIds: ["allowed"], texto: "hecho visible", creadoEn: "2026-01-01" },
        privateTrace: { id: "privateTrace", fuenteIds: ["denied"], texto: "fragmento privado", creadoEn: "2026-01-01" },
        mixedTrace: { id: "mixedTrace", fuenteIds: ["allowed", "denied"], texto: "mezcla", creadoEn: "2026-01-01" },
      },
      propuestas: {
        publicProposal: { id: "publicProposal", trazoIds: ["publicTrace"], baseFirmaSemantica: "x", operacion: { tipo: "crear-entidad", entidadTipo: "objeto", nombre: "Visible", opdId: model.opdRaizId }, estado: "pendiente", creadaEn: "2026-01-01" },
        privateProposal: { id: "privateProposal", trazoIds: ["privateTrace"], baseFirmaSemantica: "x", operacion: { tipo: "crear-entidad", entidadTipo: "objeto", nombre: "Privada", opdId: model.opdRaizId }, estado: "pendiente", creadaEn: "2026-01-01" },
      },
      confirmaciones: {
        publicConfirmation: { id: "publicConfirmation", propuestaId: "publicProposal", targets: [{ tipo: "entidad", id: "missing", opdId: model.opdRaizId }], fuenteIds: ["allowed"], trazoIds: ["publicTrace"], confirmadoEn: "2026-01-01" },
        privateConfirmation: { id: "privateConfirmation", propuestaId: "privateProposal", targets: [{ tipo: "entidad", id: "missing", opdId: model.opdRaizId }], fuenteIds: ["denied"], trazoIds: ["privateTrace"], confirmadoEn: "2026-01-01" },
      },
    };

    const projected = projectReviewModel(model, ["allowed"]);
    expect(projected.notasMesa).toBeUndefined();
    expect(Object.keys(projected.mesaExploracion!.fuentes)).toEqual(["allowed"]);
    expect(Object.keys(projected.mesaExploracion!.trazos)).toEqual(["publicTrace"]);
    expect(Object.keys(projected.mesaExploracion!.propuestas)).toEqual(["publicProposal"]);
    expect(Object.keys(projected.mesaExploracion!.confirmaciones)).toEqual(["publicConfirmation"]);
    expect(JSON.stringify(projected)).not.toContain("Secreto");
    expect(JSON.stringify(projected)).not.toContain("fragmento privado");
  });

  test("no expone mesa ni notas cuando el permiso de fuentes está vacío", () => {
    const model = crearModelo("Snapshot");
    model.mesaExploracion = {
      schema: MESA_EXPLORACION_SCHEMA,
      fuentes: { secret: { id: "secret", tipo: "texto", titulo: "T", contenido: "C", creadaEn: "2026-01-01" } },
      trazos: {}, propuestas: {}, confirmaciones: {},
    };
    expect(projectReviewModel(model, []).mesaExploracion).toBeUndefined();
  });

  test("sanea URLs sensibles en modelo y plantillas sin alterar el snapshot original", () => {
    let model = crearModelo("Snapshot");
    const created = crearObjeto(model, model.opdRaizId, { x: 0, y: 0 }, "Elemento", { id: "entity-1" });
    if (!created.ok) throw new Error(created.error);
    model = created.value;
    model.entidades["entity-1"] = {
      ...model.entidades["entity-1"]!,
      urls: [{ id: "url-1", tipo: "articulo", url: "https://example.test/?access_token=ROOT_SECRET" }],
    };
    model.estereotipos = {
      "stereotype-1": {
        id: "stereotype-1",
        nombre: "Plantilla",
        plantilla: {
          entidades: {
            "template-entity": {
              id: "template-entity",
              tipo: "objeto",
              nombre: "Elemento de plantilla",
              esencia: "informacional",
              afiliacion: "sistemica",
              urls: [{ id: "template-url", tipo: "articulo", url: "https://example.test/#access_token=TEMPLATE_SECRET" }],
            },
          },
          estados: {},
          enlaces: {},
          apariencias: { "template-entity": { x: 0, y: 0, width: 120, height: 60 } },
        },
      },
    };
    const original = structuredClone(model);

    const projected = projectReviewModel(model, []);

    expect(JSON.stringify(projected)).not.toContain("ROOT_SECRET");
    expect(JSON.stringify(projected)).not.toContain("TEMPLATE_SECRET");
    expect(model).toEqual(original);
    expect(JSON.stringify(model)).toContain("ROOT_SECRET");
    expect(JSON.stringify(model)).toContain("TEMPLATE_SECRET");
  });

  test("valida el referente contra la revisión y conserva resoluciones como historial", () => {
    const model = crearModelo("Snapshot");
    expect(reviewAnchorExists(model, { kind: "model" })).toBe(true);
    expect(reviewAnchorExists(model, { kind: "opd", id: model.opdRaizId })).toBe(true);
    expect(reviewAnchorExists(model, { kind: "entity", id: "absent" })).toBe(false);
    const annotation: ReviewAnnotation = {
      id: "a", shareId: "s", documentId: model.id, revision: 1,
      anchor: { kind: "model" }, text: "nota", actorId: "reader", actorLabel: "Lector",
      actorKind: "reader", createdAt: "2026-01-01", resolutions: [],
    };
    const resolution = {
      id: "r", actorId: "owner", actorLabel: "Autor", at: "2026-01-02", revision: 2,
      outcome: "kept" as const, note: "La nota sigue vigente", anchorPresent: true,
    };
    const resolved = addReviewResolution(annotation, resolution);
    expect(resolved.text).toBe("nota");
    expect(resolved.resolutions).toEqual([resolution]);
    expect(addReviewResolution(resolved, resolution)).toBe(resolved);
  });
});
