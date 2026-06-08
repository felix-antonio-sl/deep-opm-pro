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
    // BUG-20260607T224342Z-a8e599: tracking subió de 0.06em a 0.12em
    // para hacer eco de la "marca" del spine crimson; fontWeight subió
    // de 600 a 700 por la misma razón.
    expect(s.tag.color).toBe(tokens.colors.crimson);
    expect(s.tag.textTransform).toBe("uppercase");
    expect(s.tag.letterSpacing).toBe("0.12em");
    expect(s.tag.fontWeight).toBe(700);
  });

  test("controles conservan su altura compacta (alineada con segmentados)", () => {
    // BUG-20260608T171552Z-17477a: ambos `control` y `segmentBtn` se
    // alinean a 26px (antes 28) para que cuando estan en la misma fila
    // (p. ej. `salir` junto a `segmented velocidad`), sus bordes
    // superior/inferior coincidan al pixel. Esto era la raiz de un
    // drift visual sutil que BUG-17477a expuso.
    expect(s.control.height).toBe(26);
    expect(s.segmentBtn.height).toBe(26);
    expect(s.segmented.display).toBe("inline-flex");
  });
});

describe("BarraSimulacion control-jerarquia (BUG-20260608T171552Z-17477a)", () => {
  test("el control tiene silueta de boton-fantasma discreta", () => {
    // BUG-20260608T171552Z-17477a: el operador no distinguia "esto es un
    // boton" de "esto es un label" en la fila de controles. La silueta
    // base es: hairline `rule` + color de texto `inkMid` (vs `ink` de los
    // labels de status) + height 26 + padding horizontal 8 + sin radius.
    // La invariante canon se mantiene: sin background permanente, sin
    // radio, sin sombra — el canon ui-forja §2 prohibe `Button` con
    // background + radius + shadow ("las acciones son palabras separadas
    // por `·`"). El hairline + color jerarquizado es la variacion
    // minima que rompe la confusion sin romper el canon.
    expect(s.control.border).toBe(`1px solid ${tokens.colors.rule}`);
    expect(s.control.borderRadius).toBe(0);
    expect(s.control.color).toBe(tokens.colors.inkMid);
    expect(s.control.background).toBe("transparent");
    expect(s.control.height).toBe(26);
    expect(s.control.padding).toBe("0 8px");
  });

  test("el control activo (autoAvance prendido) se diferencia del reposo", () => {
    // BUG-20260608T171552Z-17477a: el boton `reproducir`/`pausa` cuando
    // la simulacion esta corriendo necesita leerse como "presionado
    // sostenido". Mantenemos el border-bottom 2px crimson como acento
    // semantico de "la simulacion esta corriendo AHORA" (no es un
    // hover, es un estado), y agregamos fondo `paper` + color `ink`
    // para que se lea como "mas oscuro que el hover efimero".
    expect(s.controlActivo.color).toBe(tokens.colors.ink);
    expect(s.controlActivo.background).toBe(tokens.colors.paper);
    expect(s.controlActivo.borderColor).toBe(tokens.colors.ruleStrong);
    expect(s.controlActivo.borderBottomColor).toBe(tokens.colors.crimson);
    expect(s.controlActivo.borderBottomWidth).toBe(2);
  });

  test("los pseudo-estados (hover/active/focus/disabled) tienen invariantes", () => {
    // BUG-20260608T171552Z-17477a: hover/active/focus/disabled se aplican
    // via CSS de pseudo-clases (no inline) porque inline no soporta
    // pseudo-clases. Anclamos aqui los valores de wash/border/outline
    // para que un refactor del CSS no rompa silenciosamente la
    // jerarquia visual.
    // hover: wash `paper` (mas claro que el fondo `paperWarm` de la barra).
    expect(s.controlHover.background).toBe(tokens.colors.paper);
    expect(s.controlHover.color).toBe(tokens.colors.ink);
    expect(s.controlHover.borderColor).toBe(tokens.colors.ruleStrong);
    // active (mientras se aprieta): wash `paperWarm` (un punto mas oscuro
    // que el hover = "estas apretando").
    expect(s.controlApretado.background).toBe(tokens.colors.paperWarm);
    // disabled: el boton debe ser casi invisible — sin affordance de
    // click. `inkFaint` para el texto y `paperWarm` (mismo color que el
    // fondo) para el border.
    expect(s.controlDeshabilitado.color).toBe(tokens.colors.inkFaint);
    expect(s.controlDeshabilitado.borderColor).toBe(tokens.colors.paperWarm);
    expect(s.controlDeshabilitado.cursor).toBe("not-allowed");
    // focus-visible: outline crimson canon (ui-forja §4.1).
    expect(s.controlFocus.outline).toBe(`2px solid ${tokens.colors.crimson}`);
    expect(s.controlFocus.outlineOffset).toBe(2);
  });

  test("la fila de controles tiene separador editorial dotted", () => {
    // BUG-20260608T171552Z-17477a: la fila de controles (botones +
    // segmentados) gana un border-top dotted `rule` para que el ojo lea
    // "status line -> narrativa -> controles -> timeline" como bloques
    // tipograficos, no como una sola linea plana de palabras.
    expect(s.filaControles.borderTop).toBe(`1px dotted ${tokens.colors.rule}`);
    expect(s.filaControles.flexBasis).toBe("100%");
    expect(s.filaControles.display).toBe("flex");
  });

  test("la fila de timeline/trace tambien usa dotted como separador", () => {
    // BUG-20260608T171552Z-17477a: la fila de timeline (microfases +
    // timer) es informacion, no controles. Usa el mismo lenguaje dotted
    // que `filaControles` para señalar "esto ya no son acciones, es info".
    expect(s.filaTimeline.borderTop).toBe(`1px dotted ${tokens.colors.rule}`);
    expect(s.filaTimeline.flexBasis).toBe("100%");
  });

  test("el proceso activo se lee como chip de estado, no como boton", () => {
    // BUG-20260608T171552Z-17477a: el span "proceso activo" competia
    // visualmente con el boton `reproducir` activo (ambos crimson).
    // Ahora se diferencia con un border-left 2px crimson + fondo `paper`
    // (sale del frame `paperWarm`) + padding asimétrico, leyendose como
    // **etiqueta de estado** semantica.
    expect(s.procesoActivo.borderLeft).toBe(`2px solid ${tokens.colors.crimson}`);
    expect(s.procesoActivo.background).toBe(tokens.colors.paper);
    expect(s.procesoActivo.color).toBe(tokens.colors.crimson);
    expect(s.procesoActivo.padding).toBe("1px 6px 1px 8px");
  });

  test("el segmented widget sube su silueta para no confundirse con botones sueltos", () => {
    // BUG-20260608T171552Z-17477a: el grupo `segmented` (modo/velocidad)
    // subio su border de `rule` a `ruleStrong` para leerse como "un
    // widget continuo" diferenciado de los `control` sueltos. Ademas,
    // cada boton interno del grupo gana un `borderRight` para que se lean
    // los limites entre opciones (un detalle obsesivo canon, III).
    expect(s.segmented.border).toBe(`1px solid ${tokens.colors.ruleStrong}`);
    expect(s.segmentBtn.borderRight).toBe(`1px solid ${tokens.colors.rule}`);
    expect(s.segmentBtnUltimo.borderRight).toBe("none");
    expect(s.segmentBtn.height).toBe(26);
  });

  test("el segmento activo mantiene su wash paperWarm como acento", () => {
    // BUG-20260608T171552Z-17477a: invariante preservada — el segmento
    // activo usa `paperWarm` (NO `paper`) para no competir con el boton
    // `reproducir` activo. La diferencia wash ayuda a diferenciar
    // visualmente "selector de opcion" vs "boton de accion".
    expect(s.segmentActivo.background).toBe(tokens.colors.paperWarm);
    expect(s.segmentActivo.color).toBe(tokens.colors.ink);
    expect(s.segmentActivo.fontWeight).toBe(600);
  });
});

describe("BarraSimulacion canvas-frame (BUG-20260607T224342Z-a8e599)", () => {
  test("la barra vive en la region canvas (no position fixed full-width)", () => {
    // BUG-20260607T224342Z-a8e599: la barra dejó de ser un overlay
    // `position: fixed` con `left: 0; right: 0` (que cubría los botones
    // ◀/▶ de los paneles laterales OPL/Inspector). Ahora vive dentro de
    // `CodexCanvasMount.topbar` y se renderiza como un bloque relativo.
    // Verificamos: position relative, NO fixed, NO left/right absolutos
    // (su ancho lo define el flex del topbar del canvas).
    expect(s.barra.position).toBe("relative");
    expect(s.barra.background).toBe(tokens.colors.paperWarm);
    expect(s.barra.borderTop).toBe(`2px solid ${tokens.colors.crimson}`);
  });

  test("spines laterales con gradiente crimson enmarca la barra", () => {
    // BUG-20260607T224342Z-a8e599: dos spines (izq + der) de 3px con
    // gradiente vertical crimson→50% opacidad señalan "modo especial"
    // sin tapar al canvas. Se aplican como divs hermanos absolutos
    // dentro del contenedor `position: relative`.
    expect(s.barraSpine.position).toBe("absolute");
    expect(s.barraSpine.top).toBe(0);
    expect(s.barraSpine.bottom).toBe(0);
    expect(s.barraSpine.width).toBe(3);
    expect(s.barraSpine.background).toContain(tokens.colors.crimson);
    expect(s.barraSpine.pointerEvents).toBe("none");
  });

  test("tag incluye un live dot crimson (modo en vivo)", () => {
    // La tag "Simulacion" es el ancla visual del status. El "live dot"
    // es un span crimson 6px con clase CSS `.sim-live-dot` que aplica
    // la animación de pulso via @keyframes inyectado por el componente.
    expect(s.tagDot.width).toBe(6);
    expect(s.tagDot.height).toBe(6);
    expect(s.tagDot.background).toBe(tokens.colors.crimson);
    expect(s.tagDot.borderRadius).toBe("50%");
  });

  test("tag usa la marca mono uppercase con tracking amplio", () => {
    // La tag sigue siendo el ancla visual "SIMULACIÓN" con marca crimson
    // y tipografía mono. El cambio es la presencia del live dot.
    expect(s.tag.color).toBe(tokens.colors.crimson);
    expect(s.tag.textTransform).toBe("uppercase");
    expect(s.tag.fontWeight).toBe(700);
    expect(s.tag.fontFamily).toBe(tokens.typography.fontFamilyMono);
  });

  test("narrativa se destaca del fondo paperWarm con surface paper", () => {
    // BUG-20260607T224342Z-a8e599: para jerarquía visual, la panel
    // narrativa (el contenido destacado de la barra) usa `paper` (más
    // claro) sobre el `paperWarm` del fondo de la barra.
    expect(s.narrativa.background).toBe(tokens.colors.paper);
  });
});
