import { describe, expect, test } from "bun:test";
import { calcularScrollPan, calcularZoomPinch, distanciaToques, puntoMedioToques, superaUmbralPan } from "./gestosTouch";
import { ZOOM_MAX, ZOOM_MIN } from "./helpers";

// Gestos táctiles del canvas en modo lectura (reporte operador: en iPhone no
// se puede hacer zoom ni desplazar). Pan = scroll DOM del viewport (canvas
// infinito); pinch = zoom anclado al punto medio de los dedos.

describe("geometría de toques", () => {
  test("distanciaToques es la euclidiana", () => {
    expect(distanciaToques({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });

  test("puntoMedioToques promedia ambos ejes", () => {
    expect(puntoMedioToques({ x: 10, y: 20 }, { x: 30, y: 40 })).toEqual({ x: 20, y: 30 });
  });

  test("superaUmbralPan distingue tap de arrastre", () => {
    expect(superaUmbralPan({ x: 0, y: 0 }, { x: 3, y: 3 })).toBe(false);
    expect(superaUmbralPan({ x: 0, y: 0 }, { x: 0, y: 9 })).toBe(true);
  });
});

describe("calcularZoomPinch — escala proporcional a la separación, acotada", () => {
  test("separar los dedos al doble duplica la escala", () => {
    expect(calcularZoomPinch(1, 100, 200)).toBe(ZOOM_MAX); // 2 → clamp al máximo
    expect(calcularZoomPinch(0.6, 100, 200)).toBeCloseTo(1.2);
  });

  test("juntar los dedos reduce, con piso ZOOM_MIN", () => {
    expect(calcularZoomPinch(1, 200, 100)).toBe(ZOOM_MIN);
    expect(calcularZoomPinch(1, 100, 80)).toBeCloseTo(0.8);
  });

  test("distancia inicial cero no divide por cero (mantiene escala)", () => {
    expect(calcularZoomPinch(1, 0, 50)).toBe(1);
  });
});

describe("calcularScrollPan — mover el dedo arrastra el contenido con él", () => {
  test("dedo hacia la izquierda ⇒ scroll avanza (contenido sigue al dedo)", () => {
    expect(calcularScrollPan({ left: 100, top: 50 }, { x: 200, y: 300 }, { x: 150, y: 280 }))
      .toEqual({ left: 150, top: 70 });
  });

  test("sin movimiento no cambia el scroll", () => {
    expect(calcularScrollPan({ left: 10, top: 20 }, { x: 5, y: 5 }, { x: 5, y: 5 }))
      .toEqual({ left: 10, top: 20 });
  });
});
