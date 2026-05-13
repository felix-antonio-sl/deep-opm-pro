import { describe, expect, test } from "bun:test";
import type { dia } from "jointjs";
import { calcularSiguienteZoom, fitCanvasAPantalla, zoomCanvasEnCursor } from "./zoom";

describe("handlers/zoom", () => {
  test("limita cada wheel a un cambio suave aunque deltaY sea grande", () => {
    expect(calcularSiguienteZoom(1, eventoWheel(100))).toBeCloseTo(0.995, 5);
    expect(calcularSiguienteZoom(1, eventoWheel(-100))).toBeCloseTo(1.005, 5);
    expect(calcularSiguienteZoom(1, eventoWheel(5000))).toBeCloseTo(0.995, 5);
    expect(calcularSiguienteZoom(1, eventoWheel(-5000))).toBeCloseTo(1.005, 5);
  });

  test("trackpad con deltas pequenos produce cambios subporcentuales", () => {
    expect(calcularSiguienteZoom(1, eventoWheel(1))).toBeCloseTo(0.99992, 5);
    expect(calcularSiguienteZoom(1, eventoWheel(-1))).toBeCloseTo(1.00008, 5);
  });

  test("respeta limites absolutos de zoom", () => {
    expect(calcularSiguienteZoom(0.5, eventoWheel(100))).toBe(0.5);
    expect(calcularSiguienteZoom(1.6, eventoWheel(-100))).toBe(1.6);
  });

  test("aplica zoom en el cursor compensando translate en JointJS 3.x", () => {
    const llamadasScale: Array<[number, number]> = [];
    const llamadasTranslate: Array<[number, number]> = [];
    let sx = 1;
    let sy = 1;
    let tx = 0;
    let ty = 0;
    const paper = {
      scale: ((nuevoSx?: number, nuevoSy?: number) => {
        if (nuevoSx === undefined) return { sx, sy };
        sx = nuevoSx;
        sy = nuevoSy ?? nuevoSx;
        llamadasScale.push([sx, sy]);
        return undefined;
      }) as unknown,
      translate: ((nuevoTx?: number, nuevoTy?: number) => {
        if (nuevoTx === undefined) return { tx, ty };
        tx = nuevoTx;
        ty = nuevoTy ?? 0;
        llamadasTranslate.push([tx, ty]);
        return undefined;
      }) as unknown,
      clientToLocalPoint: (x: number, y: number) => ({ x: (x - tx) / sx, y: (y - ty) / sy }),
      localToPaperPoint: (point: { x: number; y: number }) => ({ x: point.x * sx + tx, y: point.y * sy + ty }),
    } as unknown as dia.Paper;

    zoomCanvasEnCursor(paper, { ...eventoWheel(-100), clientX: 10, clientY: 20 } as WheelEvent);

    expect(llamadasScale).toEqual([[1.005, 1.005]]);
    expect(llamadasTranslate).toHaveLength(1);
    const puntoTrasZoom = (paper as unknown as {
      localToPaperPoint(point: { x: number; y: number }): { x: number; y: number };
    }).localToPaperPoint({ x: 10, y: 20 });
    expect(puntoTrasZoom.x).toBeCloseTo(10, 8);
    expect(puntoTrasZoom.y).toBeCloseTo(20, 8);
  });

  test("zoom repetido no acumula deriva hacia la esquina superior izquierda", () => {
    let sx = 1;
    let sy = 1;
    let tx = 0;
    let ty = 0;
    const paper = {
      scale: ((nuevoSx?: number, nuevoSy?: number) => {
        if (nuevoSx === undefined) return { sx, sy };
        sx = nuevoSx;
        sy = nuevoSy ?? nuevoSx;
        return undefined;
      }) as unknown,
      translate: ((nuevoTx?: number, nuevoTy?: number) => {
        if (nuevoTx === undefined) return { tx, ty };
        tx = nuevoTx;
        ty = nuevoTy ?? 0;
        return undefined;
      }) as unknown,
      clientToLocalPoint: (x: number, y: number) => ({ x: (x - tx) / sx, y: (y - ty) / sy }),
      localToPaperPoint: (point: { x: number; y: number }) => ({ x: point.x * sx + tx, y: point.y * sy + ty }),
    } as unknown as dia.Paper;

    for (let i = 0; i < 25; i += 1) {
      const puntoAntes = (paper as unknown as { clientToLocalPoint(x: number, y: number): { x: number; y: number } }).clientToLocalPoint(500, 320);
      zoomCanvasEnCursor(paper, { ...eventoWheel(-100), clientX: 500, clientY: 320 } as WheelEvent);
      const puntoDespues = (paper as unknown as { localToPaperPoint(point: { x: number; y: number }): { x: number; y: number } }).localToPaperPoint(puntoAntes);
      expect(puntoDespues.x).toBeCloseTo(500, 8);
      expect(puntoDespues.y).toBeCloseTo(320, 8);
    }
  });

  test("zoom en fondo vacio ancla el centro del contenido para que no desaparezca", () => {
    let sx = 1;
    let sy = 1;
    let tx = 0;
    let ty = 0;
    const centroContenido = { x: 300, y: 220 };
    const paper = {
      model: { getBBox: () => ({ x: 200, y: 160, width: 200, height: 120 }) },
      scale: ((nuevoSx?: number, nuevoSy?: number) => {
        if (nuevoSx === undefined) return { sx, sy };
        sx = nuevoSx;
        sy = nuevoSy ?? nuevoSx;
        return undefined;
      }) as unknown,
      translate: ((nuevoTx?: number, nuevoTy?: number) => {
        if (nuevoTx === undefined) return { tx, ty };
        tx = nuevoTx;
        ty = nuevoTy ?? 0;
        return undefined;
      }) as unknown,
      clientToLocalPoint: (x: number, y: number) => ({ x: (x - tx) / sx, y: (y - ty) / sy }),
      localToPaperPoint: (point: { x: number; y: number }) => ({ x: point.x * sx + tx, y: point.y * sy + ty }),
    } as unknown as dia.Paper;

    zoomCanvasEnCursor(paper, { ...eventoWheel(-100), clientX: 900, clientY: 700 } as WheelEvent);

    const centroTrasZoom = (paper as unknown as {
      localToPaperPoint(point: { x: number; y: number }): { x: number; y: number };
    }).localToPaperPoint(centroContenido);
    expect(centroTrasZoom.x).toBeCloseTo(300, 8);
    expect(centroTrasZoom.y).toBeCloseTo(220, 8);
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
