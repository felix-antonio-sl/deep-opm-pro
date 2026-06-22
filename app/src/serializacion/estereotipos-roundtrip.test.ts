import { describe, expect, test } from "bun:test";
import { ESTEREOTIPO_REQUIREMENT_ID } from "../modelo/estereotipos";
import type { Modelo, PlantillaEstereotipo } from "../modelo/tipos";
import { exportarModelo, hidratarModelo } from "./json";

const FORMATO = "deep-opm-pro.modelo.v0";

/** Documento mínimo con una sola entidad y un OPD raíz que la muestra. */
function documento(entidadExtra: Record<string, unknown>, modeloExtra: Record<string, unknown> = {}): string {
  return JSON.stringify({
    formato: FORMATO,
    modelo: {
      id: "m",
      nombre: "M",
      opdRaizId: "opd-raiz",
      nextSeq: 100,
      entidades: {
        "o-1": {
          id: "o-1",
          tipo: "objeto",
          nombre: "Pedido",
          esencia: "informacional",
          afiliacion: "sistemica",
          ...entidadExtra,
        },
      },
      estados: {},
      enlaces: {},
      opds: {
        "opd-raiz": {
          id: "opd-raiz",
          nombre: "SD0",
          padreId: null,
          apariencias: {
            "a-1": { id: "a-1", entidadId: "o-1", opdId: "opd-raiz", x: 40, y: 40, width: 120, height: 60, modoPlegado: "completo" },
          },
          enlaces: {},
        },
      },
      ...modeloExtra,
    },
  });
}

const REQUISITO_VALIDO = {
  idLogico: "REQ-1",
  descripcion: "El pedido debe quedar trazado.",
  dureza: "hard",
  actor: "Mesa",
  satisfaction: "pendiente",
};

describe("serializacion - estereotipos (D6.1)", () => {
  test("backwards-compat: legacy estereotipo:'requirement' hidrata a estereotipoId de fábrica con requisito intacto", () => {
    const res = hidratarModelo(documento({ estereotipo: "requirement", requisito: REQUISITO_VALIDO }));
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    const ent = res.value.entidades["o-1"]!;
    expect(ent.estereotipoId).toBe(ESTEREOTIPO_REQUIREMENT_ID);
    expect("estereotipo" in ent).toBe(false);
    expect(ent.requisito).toMatchObject({ idLogico: "REQ-1", dureza: "hard", actor: "Mesa" });
  });

  test("nuevo: estereotipoId + catálogo estereotipos round-trip íntegro", () => {
    const catalogo = {
      "est-1": { id: "est-1", nombre: "Actor", propositoDeModelado: "Marca un actor del sistema." },
    };
    const json = documento({ estereotipoId: "est-1" }, { estereotipos: catalogo });
    const res = hidratarModelo(json);
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.value.entidades["o-1"]?.estereotipoId).toBe("est-1");
    expect(res.value.estereotipos).toEqual(catalogo);
    // round-trip estable: re-exportar e re-hidratar conserva el catálogo y la aplicación.
    const reexport = hidratarModelo(exportarModelo(res.value));
    expect(reexport.ok).toBe(true);
    if (!reexport.ok) return;
    expect(reexport.value.estereotipos).toEqual(catalogo);
    expect(reexport.value.entidades["o-1"]?.estereotipoId).toBe("est-1");
  });

  test("contrato de import (DURO): estereotipoId que NO resuelve es rechazado con diagnóstico (simétrico a ordenInzoom)", () => {
    const res = hidratarModelo(documento({ estereotipoId: "est-fantasma" }));
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.error).toContain("estereotipoId");
  });

  test("acoplamiento: requisito con estereotipoId != requirement es rechazado", () => {
    const json = documento(
      { estereotipoId: "est-1", requisito: REQUISITO_VALIDO },
      { estereotipos: { "est-1": { id: "est-1", nombre: "Actor" } } },
    );
    const res = hidratarModelo(json);
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.error).toContain("requisito");
  });

  test("requirement de fábrica resuelve sin catálogo (import válido sin estereotipos)", () => {
    const res = hidratarModelo(documento({ estereotipoId: ESTEREOTIPO_REQUIREMENT_ID, requisito: REQUISITO_VALIDO }));
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.value.entidades["o-1"]?.estereotipoId).toBe(ESTEREOTIPO_REQUIREMENT_ID);
  });

  test("catálogo de estereotipos malformado se RECHAZA (forma, no silencio)", () => {
    const res = hidratarModelo(documento({}, { estereotipos: { "est-1": { id: "est-OTRO", nombre: "X" } } }));
    expect(res.ok).toBe(false);
  });

  test("modelo sin estereotipos no emite la clave (byte-identidad sobre opcional ausente)", () => {
    const res = hidratarModelo(documento({}));
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect("estereotipos" in res.value).toBe(false);
  });
});

describe("serializacion - plantilla de estereotipo (D6.2)", () => {
  const PLANTILLA_VALIDA: PlantillaEstereotipo = {
    entidades: {
      "o-1": { id: "o-1", tipo: "objeto", nombre: "Documento", esencia: "informacional", afiliacion: "sistemica" },
      "p-1": { id: "p-1", tipo: "proceso", nombre: "Tramitar", esencia: "informacional", afiliacion: "sistemica" },
    },
    estados: {},
    enlaces: {
      "e-1": { id: "e-1", tipo: "consumo", origenId: { kind: "entidad", id: "o-1" }, destinoId: { kind: "entidad", id: "p-1" }, etiqueta: "" },
    },
    apariencias: {
      "o-1": { x: 0, y: 0, width: 120, height: 60 },
      "p-1": { x: 200, y: 0, width: 120, height: 60 },
    },
    anclaLocalId: "o-1",
  };

  function conPlantilla(plantilla: unknown): ReturnType<typeof hidratarModelo> {
    return hidratarModelo(documento({}, { estereotipos: { "est-1": { id: "est-1", nombre: "Trámite", plantilla } } }));
  }

  test("7a. catálogo con plantilla hidrata/exporta íntegro (round-trip estable)", () => {
    const res = conPlantilla(PLANTILLA_VALIDA);
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.value.estereotipos?.["est-1"]?.plantilla).toEqual(PLANTILLA_VALIDA);
    const reexport = hidratarModelo(exportarModelo(res.value));
    expect(reexport.ok).toBe(true);
    if (!reexport.ok) return;
    expect(reexport.value.estereotipos?.["est-1"]?.plantilla).toEqual(PLANTILLA_VALIDA);
  });

  test("7b. plantilla con enlace de extremo colgante se RECHAZA con diagnóstico", () => {
    const res = conPlantilla({
      ...PLANTILLA_VALIDA,
      enlaces: { "e-1": { id: "e-1", tipo: "consumo", origenId: { kind: "entidad", id: "o-fantasma" }, destinoId: { kind: "entidad", id: "p-1" }, etiqueta: "" } },
    });
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.error).toContain("plantilla");
  });

  test("7c. plantilla con apariencia de entidad inexistente se RECHAZA con diagnóstico", () => {
    const res = conPlantilla({ ...PLANTILLA_VALIDA, apariencias: { ...PLANTILLA_VALIDA.apariencias, "o-fantasma": { x: 0, y: 0, width: 10, height: 10 } } });
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.error).toContain("apariencias");
  });

  test("7d. anclaLocalId que no es entidad de la plantilla se RECHAZA", () => {
    const res = conPlantilla({ ...PLANTILLA_VALIDA, anclaLocalId: "o-fantasma" });
    expect(res.ok).toBe(false);
    if (res.ok) return;
    expect(res.error).toContain("anclaLocalId");
  });

  test("estereotipo sin plantilla no emite la clave (byte-identidad)", () => {
    const res = hidratarModelo(documento({}, { estereotipos: { "est-1": { id: "est-1", nombre: "Marca" } } }));
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect("plantilla" in (res.value.estereotipos?.["est-1"] ?? {})).toBe(false);
  });
});

void (null as unknown as Modelo);
