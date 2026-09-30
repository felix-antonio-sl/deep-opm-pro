import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "./operaciones";
import { sanitizePublicLocator, sanitizePublicModelUrls } from "./shareSanitization";

describe("sanitización para lectura compartida", () => {
  test("la normalización del navegador no permite ocultar parámetros sensibles", () => {
    for (const value of ["  HTTPS://example.org/?access_token=HIDDEN_MARKER  ", "https:example.org/?access_token=HIDDEN_MARKER"]) {
      expect(sanitizePublicLocator(value)).not.toContain("HIDDEN_MARKER");
    }
  });
  test("limpia credenciales de entidades y plantillas de estereotipo sin mutar el modelo original", () => {
    let model = crearModelo("Enlaces compartidos");
    const created = crearObjeto(model, model.opdRaizId, { x: 80, y: 100 }, "Sistema");
    if (!created.ok) throw new Error(created.error);
    model = created.value;
    const entity = Object.values(model.entidades)[0]!;

    const rootUrl = "https://USERINFO_SECRET_MARKER:PASSWORD_SECRET_MARKER@example.org/item?access_token=ROOT_QUERY_SECRET_MARKER&view=diagram#state=keep&access_token=ROOT_HASH_SECRET_MARKER";
    const rootImageUrl = "https://example.org/image?api_key=IMAGE_QUERY_SECRET_MARKER&size=small";
    const templateUrl = "https://example.org/template?client_secret=TEMPLATE_QUERY_SECRET_MARKER&mode=opm#access_token=TEMPLATE_HASH_SECRET_MARKER&tab=overview";
    model = {
      ...model,
      entidades: {
        ...model.entidades,
        [entity.id]: {
          ...entity,
          urls: [{ id: "root-link", tipo: "articulo", url: rootUrl }],
          imagen: { url: rootImageUrl, modo: "imagen" },
        },
      },
      estereotipos: {
        "stereotype-template": {
          id: "stereotype-template",
          nombre: "Plantilla de prueba",
          plantilla: {
            entidades: {
              "template-entity": {
                ...entity,
                id: "template-entity",
                nombre: "Entidad de plantilla",
                urls: [{ id: "template-link", tipo: "articulo", url: templateUrl }],
              },
            },
            estados: {},
            enlaces: {},
            apariencias: { "template-entity": { x: 0, y: 0, width: 120, height: 60 } },
          },
        },
      },
    };

    const sourceText = JSON.stringify(model);
    const sanitized = sanitizePublicModelUrls(model);
    const safeText = JSON.stringify(sanitized);
    for (const marker of [
      "USERINFO_SECRET_MARKER",
      "PASSWORD_SECRET_MARKER",
      "ROOT_QUERY_SECRET_MARKER",
      "ROOT_HASH_SECRET_MARKER",
      "IMAGE_QUERY_SECRET_MARKER",
      "TEMPLATE_QUERY_SECRET_MARKER",
      "TEMPLATE_HASH_SECRET_MARKER",
    ]) {
      expect(sourceText).toContain(marker);
      expect(safeText).not.toContain(marker);
    }

    expect(sanitized).not.toBe(model);
    expect(sanitized.entidades).not.toBe(model.entidades);
    expect(sanitized.estereotipos).not.toBe(model.estereotipos);
    expect(sanitized.entidades[entity.id]!.urls![0]!.url).toContain("view=diagram");
    expect(new URL(sanitized.entidades[entity.id]!.urls![0]!.url).hash).toContain("state=keep");
    expect(new URL(sanitized.estereotipos!["stereotype-template"]!.plantilla!.entidades["template-entity"]!.urls![0]!.url).hash).toContain("tab=overview");
    expect(model.entidades[entity.id]!.urls![0]!.url).toBe(rootUrl);
    expect(model.estereotipos!["stereotype-template"]!.plantilla!.entidades["template-entity"]!.urls![0]!.url).toBe(templateUrl);
  });

  test("sólo trata URLs HTTP(S) y oculta un URL web inválido", () => {
    expect(sanitizePublicLocator("opforja://pieza/model-1?secret=domain-value")).toBe("opforja://pieza/model-1?secret=domain-value");
    expect(sanitizePublicLocator("https://%zz.example/path")).toBe("[URL web no válida omitida]");
  });
});
