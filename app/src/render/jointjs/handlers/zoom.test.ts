import { describe, expect, test } from "bun:test";
import type { dia } from "jointjs";
import { calcularSiguienteZoom, zoomCanvasEnCursor } from "./zoom";

describe("handlers/zoom", () => {
  test("limita cada wheel a un cambio suave aunque deltaY sea grande", () => {
    expect(calcularSiguienteZoom(1, eventoWheel(100))).toBeCloseTo(0.99, 5);
    expect(calcularSiguienteZoom(1, eventoWheel(-100))).toBeCloseTo(1.01, 5);
    expect(calcularSiguienteZoom(1, eventoWheel(5000))).toBeCloseTo(0.99, 5);
    expect(calcularSiguienteZoom(1, eventoWheel(-5000))).toBeCloseTo(1.01, 5);
  });

  test("trackpad con deltas pequenos produce cambios subporcentuales", () => {
    expect(calcularSiguienteZoom(1, eventoWheel(1))).toBeCloseTo(0.99984, 5);
    expect(calcularSiguienteZoom(1, eventoWheel(-1))).toBeCloseTo(1.00016, 5);
  });

  test("respeta limites absolutos de zoom", () => {
    expect(calcularSiguienteZoom(0.5, eventoWheel(100))).toBe(0.5);
    expect(calcularSiguienteZoom(1.6, eventoWheel(-100))).toBe(1.6);
  });

  test("aplica zoom en el cursor cuando paper expone clientToLocalPoint", () => {
    const llamadas: Array<[number, number, number | undefined, number | undefined]> = [];
    const paper = {
      scale: ((sx?: number, sy?: number, ox?: number, oy?: number) => {
        if (sx === undefined) return { sx: 1, sy: 1 };
        llamadas.push([sx, sy ?? sx, ox, oy]);
        return undefined;
      }) as unknown,
      clientToLocalPoint: () => ({ x: 42, y: 24 }),
    } as unknown as dia.Paper;

    zoomCanvasEnCursor(paper, { ...eventoWheel(-100), clientX: 10, clientY: 20 } as WheelEvent);

    expect(llamadas).toEqual([[1.01, 1.01, 42, 24]]);
  });
});

function eventoWheel(deltaY: number, deltaMode = 0): Pick<WheelEvent, "deltaY" | "deltaMode"> {
  return { deltaY, deltaMode };
}
