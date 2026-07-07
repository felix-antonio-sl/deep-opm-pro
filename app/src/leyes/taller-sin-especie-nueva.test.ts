import { describe, expect, test } from "bun:test";
import { especieDe, type Especie } from "../persistencia/especie";

describe("LEY: sin especie nueva (guardia categorial CLAUDE.md)", () => {
  test("las especies son exactamente {modelo, apunte, biblioteca}", () => {
    const especies: Especie[] = ["modelo", "apunte", "biblioteca"];
    expect(especies.length).toBe(3);
    // exhaustividad: cualquier combinación de los DOS flags mapea a una de las 3.
    expect(especieDe({})).toBe("modelo");
    expect(especieDe({ esApunte: true })).toBe("apunte");
    expect(especieDe({ esBiblioteca: true })).toBe("biblioteca");
    // apunte gana a biblioteca (orden de especieDe) — no hay 4ta especie posible.
    expect(especieDe({ esApunte: true, esBiblioteca: true })).toBe("apunte");
  });

  test("un flag de especie desconocido NO crea una 4ta especie (guardia efectiva)", () => {
    // Anclado a la superficie REAL de especieDe (no tautológico): un flag hipotético
    // `esCuaderno` NO altera la clasificación — especieDe solo conoce esApunte/esBiblioteca.
    // Si alguien introduce un 3er flag y lo cablea en especieDe sin migrar al discriminado,
    // este test (que exige "modelo" ante flags no-reconocidos) romperá.
    expect(especieDe({ esApunte: false, esBiblioteca: false } as Record<string, boolean>)).toBe("modelo");
    expect(especieDe({ esCuaderno: true } as Record<string, boolean>)).toBe("modelo"); // ignorado hoy
    // Exhaustividad total sobre las 4 combinaciones de los DOS flags → solo 3 especies.
    const combos = [
      { esApunte: false, esBiblioteca: false },
      { esApunte: true, esBiblioteca: false },
      { esApunte: false, esBiblioteca: true },
      { esApunte: true, esBiblioteca: true },
    ];
    const especiesVistas = new Set(combos.map((c) => especieDe(c)));
    expect([...especiesVistas].sort()).toEqual(["apunte", "biblioteca", "modelo"]);
  });
});
