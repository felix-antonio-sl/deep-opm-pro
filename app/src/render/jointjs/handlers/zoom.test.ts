import { describe, expect, test } from "bun:test";
import type { dia } from "jointjs";
import { calcularSiguienteZoom, fitCanvasAPantalla, zoomCanvasEnCursor } from "./zoom";

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

  test("fit usa transformToFitContent contra el viewport visible y refresca vistas", () => {
    const llamadas: unknown[] = [];
    let wakeUps = 0;
    let viewportChecks = 0;
    const paper = {
      transformToFitContent: (options: unknown) => llamadas.push(options),
      wakeUp: () => { wakeUps += 1; },
      checkViewport: () => { viewportChecks += 1; },
    } as unknown as dia.Paper;
    const viewport = {
      clientWidth: 900,
      clientHeight: 600,
      scrollLeft: 120,
      scrollTop: 80,
    } as HTMLElement;

    fitCanvasAPantalla(paper, viewport);

    expect(llamadas).toHaveLength(1);
    expect(llamadas[0]).toMatchObject({
      padding: 40,
      minScale: 0.5,
      maxScale: 1.6,
      preserveAspectRatio: true,
      useModelGeometry: true,
      horizontalAlign: "middle",
      verticalAlign: "middle",
      fittingBBox: { x: 120, y: 80, width: 900, height: 600 },
    });
    expect(wakeUps).toBe(1);
    expect(viewportChecks).toBe(1);
  });
});

function eventoWheel(deltaY: number, deltaMode = 0): Pick<WheelEvent, "deltaY" | "deltaMode"> {
  return { deltaY, deltaMode };
}
