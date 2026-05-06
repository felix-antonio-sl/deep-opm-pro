import { describe, expect, test } from "bun:test";
import { agruparSubprocesosParalelos } from "./helpers";
import type { Apariencia } from "../../tipos";

describe("helpers refinamiento", () => {
  test("agrupa subprocesos con Y similar dentro de tolerancia", () => {
    const grupos = agruparSubprocesosParalelos([
      ap("a-3", 260, 220),
      ap("a-1", 200, 100),
      ap("a-2", 120, 103),
      ap("a-4", 120, 228),
    ]);

    expect(grupos.map((grupo) => grupo.map((apariencia) => apariencia.id))).toEqual([
      ["a-2", "a-1"],
      ["a-3"],
      ["a-4"],
    ]);
  });

  test("separa grupos cuando exceden tolerancia", () => {
    const grupos = agruparSubprocesosParalelos([
      ap("a-1", 120, 100),
      ap("a-2", 120, 105),
    ], 4);

    expect(grupos).toHaveLength(2);
  });
});

function ap(id: string, x: number, y: number): Apariencia {
  return {
    id,
    entidadId: `p-${id}`,
    opdId: "opd-1",
    x,
    y,
    width: 135,
    height: 60,
  };
}
