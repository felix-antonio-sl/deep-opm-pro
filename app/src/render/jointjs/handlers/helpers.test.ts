import { describe, expect, test } from "bun:test";
import type { dia } from "jointjs";
import { ajustarPaperAContenido, calcularAjusteScroll, CANVAS_PADDING, prevenirInteraccionNativa, selectorEsAnchorConexion } from "./helpers";

describe("selectores interactivos", () => {
  test("detecta anchors de conexion como affordance exclusiva de enlace", () => {
    expect(selectorEsAnchorConexion("connect-anchor-e")).toBe(true);
    expect(selectorEsAnchorConexion("connect-anchor-e-state0")).toBe(true);
    expect(selectorEsAnchorConexion("stateCapsule0")).toBe(false);
    expect(selectorEsAnchorConexion(null)).toBe(false);
  });

  test("prevenirInteraccionNativa delega en JointJS para cortar elementMove", () => {
    let invocado = false;
    const view = {
      preventDefaultInteraction() {
        invocado = true;
      },
    } as unknown as dia.CellView;

    prevenirInteraccionNativa(view, {} as dia.Event);

    expect(invocado).toBe(true);
  });
});

// Canvas infinito: cuando fitToContent({allowNewOrigin:'any'}) reposiciona el
// origen del paper (translate) porque el contenido creció hacia arriba/izquierda,
// el viewport (scroll DOM) debe seguir el desplazamiento para que el contenido
// no "salte" en pantalla. Esta es la pieza pura del tracking de origen.
describe("calcularAjusteScroll (canvas infinito, no-salto)", () => {
  test("crecer hacia arriba-izquierda desplaza el scroll por el delta de origen", () => {
    // fitToContent movió el origen del paper de (0,0) a (300,200) para acomodar
    // contenido negativo; el scroll debe sumar ese delta para fijar la vista.
    const resultado = calcularAjusteScroll(
      { left: 1000, top: 800 },
      { tx: 0, ty: 0 },
      { tx: 300, ty: 200 },
    );
    expect(resultado).toEqual({ left: 1300, top: 1000 });
  });

  test("sin cambio de origen deja el scroll intacto", () => {
    const resultado = calcularAjusteScroll(
      { left: 500, top: 400 },
      { tx: 120, ty: 90 },
      { tx: 120, ty: 90 },
    );
    expect(resultado).toEqual({ left: 500, top: 400 });
  });

  test("nunca produce scroll negativo (clamp a 0)", () => {
    const resultado = calcularAjusteScroll(
      { left: 50, top: 30 },
      { tx: 400, ty: 400 },
      { tx: 0, ty: 0 },
    );
    expect(resultado).toEqual({ left: 0, top: 0 });
  });
});

describe("ajustarPaperAContenido (canvas infinito)", () => {
  // Fakes que simulan el contrato del paper JointJS: getContentArea reporta el
  // bbox del contenido (vacío vs no-vacío) y fitToContent mueve el origen.
  const paperFake = (
    area: { width: number; height: number },
    onFit: (opt: Record<string, unknown>) => void,
    translates: Array<{ tx: number; ty: number }> = [{ tx: 0, ty: 0 }, { tx: 0, ty: 0 }],
  ): dia.Paper => {
    let i = 0;
    return {
      translate: () => translates[Math.min(i++, translates.length - 1)]!,
      getContentArea: () => ({ x: 0, y: 0, ...area }),
      fitToContent: (opt: Record<string, unknown>) => onFit(opt),
    } as unknown as dia.Paper;
  };

  test("con contenido pide a fitToContent crecer en cualquier dirección, con aire, y reporta el desplazamiento de origen", () => {
    const opciones: Array<Record<string, unknown>> = [];
    const paper = paperFake({ width: 200, height: 120 }, (opt) => opciones.push(opt),
      [{ tx: 10, ty: 20 }, { tx: 310, ty: 220 }]);

    const ajuste = ajustarPaperAContenido(paper, { minWidth: 800, minHeight: 600 });

    // La propiedad distintiva del canvas infinito: 'any' (no 'positive'/false),
    // que es lo que permite crecer en las 4 direcciones y desplazar el origen.
    expect(opciones[0]?.allowNewOrigin).toBe("any");
    expect(opciones[0]?.useModelGeometry).toBe(true);
    expect(opciones[0]?.minWidth).toBe(800);
    expect(opciones[0]?.minHeight).toBe(600);
    // Con contenido se añade aire (padding) para poder centrarlo en el viewport.
    expect(opciones[0]?.padding).toBe(CANVAS_PADDING);
    // El delta de origen alimenta el scroll-compensation (no-salto).
    expect(ajuste).toEqual({
      translateAntes: { tx: 10, ty: 20 },
      translateDespues: { tx: 310, ty: 220 },
    });
  });

  test("OPD vacío no añade padding: el paper cae a minWidth/minHeight (parte a pantalla)", () => {
    const opciones: Array<Record<string, unknown>> = [];
    // Sin contenido: getContentArea reporta área 0×0. El padding generoso haría
    // un paper de 2×padding (no a pantalla); con contenido vacío debe ser 0.
    const paper = paperFake({ width: 0, height: 0 }, (opt) => opciones.push(opt));

    ajustarPaperAContenido(paper, { minWidth: 708, minHeight: 808 });

    expect(opciones[0]?.padding).toBe(0);
    expect(opciones[0]?.minWidth).toBe(708);
    expect(opciones[0]?.minHeight).toBe(808);
  });

  test("export offscreen (sin viewport) respeta el padding explícito y no fuerza minWidth/minHeight", () => {
    const opciones: Array<Record<string, unknown>> = [];
    const paper = paperFake({ width: 400, height: 300 }, (opt) => opciones.push(opt));

    ajustarPaperAContenido(paper, { padding: 32 });

    expect(opciones[0]?.allowNewOrigin).toBe("any");
    expect(opciones[0]?.padding).toBe(32);
    expect("minWidth" in (opciones[0] ?? {})).toBe(false);
    expect("minHeight" in (opciones[0] ?? {})).toBe(false);
  });
});
