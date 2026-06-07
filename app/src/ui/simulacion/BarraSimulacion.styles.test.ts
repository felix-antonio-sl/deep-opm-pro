import { describe, expect, test } from "bun:test";
import { s } from "./BarraSimulacion";
import { tokens } from "../tokens";

describe("BarraSimulacion layout (BUG-20260606T063734Z-52df54)", () => {
  test("barra usa alignItems flex-start para no descentrar la fila de status contra la narrativa", () => {
    // Antes del fix: `alignItems: "center"` en el padre centraba la `fila`
    // de status contra el panel `narrativa` cuando ambos compartían línea.
    // Como la narrativa crece con `detalle` y `chips`, el status line
    // "flotaba" y el desajuste aumentaba con el contenido.
    expect(s.barra.display).toBe("flex");
    expect(s.barra.alignItems).toBe("flex-start");
    expect(s.barra.flexWrap).toBe("wrap");
    expect(s.barra.minHeight).toBe(44);
  });

  test("narrativa vive en su propia fila con flexBasis 100% y maxHeight acotada", () => {
    // `flexBasis: "100%"` fuerza nueva línea: status arriba, controles abajo.
    // `maxHeight: "90px"` + `overflow: "hidden"` acotan el crecimiento del
    // panel cuando el detalle o los chips se vuelven largos (antes esa
    // altura libre tiraba del `alignItems: center` del padre y desalineaba
    // el status).
    expect(s.narrativa.flexBasis).toBe("100%");
    expect(s.narrativa.maxHeight).toBe("90px");
    expect(s.narrativa.overflow).toBe("hidden");
    expect(s.narrativa.borderLeft).toBe(`3px solid ${tokens.colors.ruleStrong}`);
  });

  test("narrativa conserva su minWidth flexible y el padding del panel", () => {
    // `flex: "1 1 520px"` y `minWidth: 280` siguen dando el rango flexible
    // para cuando el padre aprieta (mobile-readonly shell, ventanas angostas).
    expect(s.narrativa.flex).toBe("1 1 520px");
    expect(s.narrativa.minWidth).toBe(280);
    expect(s.narrativa.maxWidth).toBe("100%");
    expect(s.narrativa.padding).toBe("5px 8px");
  });

  test("fila de status mantiene su wrap interno pero ya no es el centro del desajuste", () => {
    // La `fila` (status line) no necesita cambios — el problema era del
    // `alignItems` del padre, no de la fila misma. Aseguramos que sigue
    // siendo un flex inline con wrap.
    expect(s.fila.display).toBe("flex");
    expect(s.fila.alignItems).toBe("center");
    expect(s.fila.gap).toBe(4);
    expect(s.fila.flexWrap).toBe("wrap");
  });

  test("tag del status es mono uppercase con tracking ancho (invariante editorial)", () => {
    // Sanity: la `tag` "Simulacion" es el ancla visual del status. La
    // invariante de marca crimson+uppercase+tracking sigue aplicando.
    expect(s.tag.color).toBe(tokens.colors.crimson);
    expect(s.tag.textTransform).toBe("uppercase");
    expect(s.tag.letterSpacing).toBe("0.06em");
    expect(s.tag.fontWeight).toBe(600);
  });

  test("controles conservan su altura compacta y segmentados inline", () => {
    // Los botones (reproducir/correr/reiniciar/headless/salir) y los
    // segmentados (modo, velocidad) no cambian con el fix; pero anclar sus
    // invariantes previene que un refactor futuro los aplaste verticalmente.
    expect(s.control.height).toBe(28);
    expect(s.segmentBtn.height).toBe(28);
    expect(s.segmented.display).toBe("inline-flex");
    expect(s.segmented.border).toBe(`1px solid ${tokens.colors.rule}`);
  });
});
