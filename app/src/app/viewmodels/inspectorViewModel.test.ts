/**
 * Unit tests del helper `calcularConteosModelo` que alimenta el Inspector
 * vacio (Corte 3.5 sustracción de chrome).
 */
import { describe, expect, test } from "bun:test";
import { calcularConteosModelo } from "./inspectorViewModel";

describe("calcularConteosModelo", () => {
  test("modelo vacío reporta ceros", () => {
    expect(calcularConteosModelo({}, {})).toEqual({ objetos: 0, procesos: 0, opds: 0 });
  });

  test("separa objetos de procesos y cuenta OPDs", () => {
    const entidades = {
      "o-1": { tipo: "objeto" as const },
      "o-2": { tipo: "objeto" as const },
      "p-1": { tipo: "proceso" as const },
    };
    const opds = { "opd-1": {}, "opd-2": {}, "opd-3": {} };
    expect(calcularConteosModelo(entidades, opds)).toEqual({ objetos: 2, procesos: 1, opds: 3 });
  });

  test("ignora entradas undefined sin reventar", () => {
    const entidades = {
      "o-1": { tipo: "objeto" as const },
      "bad": undefined as unknown as { tipo: "objeto" },
    };
    expect(calcularConteosModelo(entidades, {})).toEqual({ objetos: 1, procesos: 0, opds: 0 });
  });
});
