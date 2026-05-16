import { describe, expect, test } from "bun:test";
import type { Enlace, Entidad, Modelo } from "../../../modelo/tipos";
import type { OpmJointMetadata } from "../proyeccion";
import { contenidoHoverTooltip } from "./hoverTooltipContent";

describe("contenidoHoverTooltip", () => {
  test("describe entidad OPM con tipo, esencia, afiliacion y SSOT", () => {
    const modelo = modeloBase({
      entidades: {
        "o-1": { id: "o-1", tipo: "objeto", nombre: "Cliente", esencia: "fisica", afiliacion: "ambiental" },
      },
    });
    const meta: OpmJointMetadata = { kind: "entidad", opdId: "opd-1", entidadId: "o-1", aparienciaId: "a-o-1", rol: "externo" };

    expect(contenidoHoverTooltip(modelo, meta)).toBe("Objeto OPM · Cliente · físico · ambiental · [Glos 3.55]");
  });

  test("describe enlace OPM con tipo, multiplicidad y SSOT visual", () => {
    const modelo = modeloBase({
      entidades: {},
      enlaces: {
        "e-1": {
          id: "e-1",
          tipo: "consumo",
          origenId: { kind: "entidad", id: "o-1" },
          destinoId: { kind: "entidad", id: "p-1" },
          etiqueta: "",
          multiplicidadDestino: "1..*",
        },
      },
    });
    const meta: OpmJointMetadata = { kind: "enlace", opdId: "opd-1", enlaceId: "e-1", aparienciaEnlaceId: "ae-1", tipo: "consumo" };

    expect(contenidoHoverTooltip(modelo, meta)).toBe("Enlace OPM · consumo · multiplicidad destino 1..* · [V-239]");
  });
});

function modeloBase(input: {
  entidades: Record<string, Entidad>;
  enlaces?: Record<string, Enlace>;
}): Modelo {
  return {
    id: "m",
    nombre: "Tooltip",
    opdRaizId: "opd-1",
    entidades: input.entidades,
    enlaces: input.enlaces ?? {},
    estados: {},
    opds: {
      "opd-1": { id: "opd-1", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} },
    },
    nextSeq: 1,
  };
}
