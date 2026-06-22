// D7.2: composer de la capa de pizarra. Cada Boceto del OPD activo se proyecta a
// una celda JointJS en estilo BOSQUEJO claramente distinto del modelo (tenue,
// trazo discontinuo, sin sombra) para que se lea "esto NO es OPM aún". Marca
// `opm.kind="boceto"` + `bocetoId` en metadatos para que el handler lo distinga.
// El boceto seleccionado recibe un realce.

import { describe, expect, test } from "bun:test";
import { proyectarBoceto, proyectarBocetosDelOpd } from "./boceto";
import { CODEX } from "../constantes.codex";
import type { Boceto } from "../../../modelo/tipos";

const FORMA: Boceto = { id: "bo-1", tipo: "forma", x: 10, y: 20, w: 120, h: 60, texto: "idea" };
const NOTA: Boceto = { id: "bo-2", tipo: "nota", x: 0, y: 0, w: 140, h: 80, texto: "preguntar" };
const TEXTO: Boceto = { id: "bo-3", tipo: "texto", x: 5, y: 5, texto: "rótulo" };
const FLECHA: Boceto = { id: "bo-4", tipo: "flecha", puntos: [{ x: 0, y: 0 }, { x: 90, y: 80 }] };

describe("composer boceto", () => {
  test("forma ⇒ rect con opm.kind boceto + bocetoId, trazo discontinuo y sin sombra", () => {
    const cell = proyectarBoceto("opd-1", FORMA, false);
    expect(cell.type).toBe("standard.Rectangle");
    expect(cell.id).toBe("bo-1");
    expect(cell.opm).toMatchObject({ kind: "boceto", opdId: "opd-1", bocetoId: "bo-1", tipo: "forma" });
    const attrs = cell.attrs as Record<string, Record<string, unknown>>;
    // Estilo bosquejo: discontinuo, paleta tenue, sin filtro de sombra.
    expect(attrs.body?.strokeDasharray).toBeDefined();
    expect(attrs.body?.filter).toBeUndefined();
    expect(attrs.label?.text).toBe("idea");
  });

  test("texto ⇒ celda text", () => {
    const cell = proyectarBoceto("opd-1", TEXTO, false);
    expect(cell.type).toBe("standard.Path");
    const attrs = cell.attrs as Record<string, Record<string, unknown>>;
    expect(attrs.label?.text).toBe("rótulo");
  });

  test("nota ⇒ rect con texto", () => {
    const cell = proyectarBoceto("opd-1", NOTA, false);
    expect(cell.type).toBe("standard.Rectangle");
    const attrs = cell.attrs as Record<string, Record<string, unknown>>;
    expect(attrs.label?.text).toBe("preguntar");
  });

  test("flecha ⇒ polilínea por puntos", () => {
    const cell = proyectarBoceto("opd-1", FLECHA, false);
    expect(cell.type).toBe("standard.Link");
    expect(cell.opm).toMatchObject({ kind: "boceto", tipo: "flecha" });
  });

  test("el boceto seleccionado recibe realce (no usa la misma tinta que el no-seleccionado)", () => {
    const normal = proyectarBoceto("opd-1", FORMA, false);
    const realce = proyectarBoceto("opd-1", FORMA, true);
    const normalAttrs = normal.attrs as Record<string, Record<string, unknown>>;
    const realceAttrs = realce.attrs as Record<string, Record<string, unknown>>;
    // El realce de selección usa crimson (canal UI de foco/selección).
    expect(realceAttrs.body?.stroke).toBe(CODEX.colores.crimson);
    expect(realceAttrs.body?.stroke).not.toBe(normalAttrs.body?.stroke);
  });

  test("proyectarBocetosDelOpd: un OPD con un boceto forma proyecta una celda boceto", () => {
    const opd = { bocetos: { "bo-1": FORMA } } as never;
    const cells = proyectarBocetosDelOpd("opd-1", opd, null);
    expect(cells).toHaveLength(1);
    expect(cells[0]?.opm.kind).toBe("boceto");
  });

  test("proyectarBocetosDelOpd: sin bocetos ⇒ ninguna celda", () => {
    const opd = {} as never;
    expect(proyectarBocetosDelOpd("opd-1", opd, null)).toHaveLength(0);
    const opdVacio = { bocetos: {} } as never;
    expect(proyectarBocetosDelOpd("opd-1", opdVacio, null)).toHaveLength(0);
  });

  test("proyectarBocetosDelOpd: el id seleccionado recibe realce; los otros no", () => {
    const opd = { bocetos: { "bo-1": FORMA, "bo-2": NOTA } } as never;
    const cells = proyectarBocetosDelOpd("opd-1", opd, "bo-1");
    const seleccionada = cells.find((c) => c.id === "bo-1")!;
    const otra = cells.find((c) => c.id === "bo-2")!;
    const selAttrs = seleccionada.attrs as Record<string, Record<string, unknown>>;
    const otraAttrs = otra.attrs as Record<string, Record<string, unknown>>;
    expect(selAttrs.body?.stroke).toBe(CODEX.colores.crimson);
    expect(otraAttrs.body?.stroke).not.toBe(CODEX.colores.crimson);
  });
});
