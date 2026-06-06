import { describe, expect, test } from "bun:test";
import { CodexColHeader } from "./CodexColHeader";
import { tokens } from "../tokens";

type Vnode = { type: unknown; props: Record<string, any> };

function hijos(v: Vnode): Vnode[] {
  const c = v.props.children;
  return (Array.isArray(c) ? c : [c]).filter((x): x is Vnode => !!x && typeof x === "object");
}

describe("CodexColHeader", () => {
  test("renderiza kicker y title sin meta cuando no se entrega", () => {
    const v = CodexColHeader({ kicker: "ÍNDICE", title: "OPDs" }) as unknown as Vnode;
    expect(v.type).toBe("header");
    const [kicker, title, meta] = hijos(v);
    expect(kicker!.type).toBe("span");
    expect(kicker!.props.children).toBe("ÍNDICE");
    expect(title!.type).toBe("strong");
    expect(title!.props.children).toBe("OPDs");
    expect(meta).toBeUndefined();
  });

  test("admite meta opcional alineado a la derecha ocupando ambas filas", () => {
    const v = CodexColHeader({ kicker: "ÍNDICE", title: "OPDs", meta: 7 }) as unknown as Vnode;
    const [, , meta] = hijos(v);
    expect(meta!.props.children).toBe(7);
    expect(meta!.props.style.gridColumn).toBe("2 / 3");
    expect(meta!.props.style.gridRow).toBe("1 / 3");
    expect(meta!.props.style.alignSelf).toBe("center");
  });

  test("crece con el contenido: gridTemplateRows auto auto y minHeight como suelo (no techo)", () => {
    // BUG-20260606T041330Z-1f46fe: el panel padre (`rightIndexPane`) ponía
    // `gridTemplateRows: "42px ..."` con la fila exacta, y el header
    // necesitaba ~46-48px (kicker fs9 + title fs13 lh1.1 + rowGap + padding).
    // Aquí el header SÍ crece con su contenido: las filas son `auto auto`
    // y la altura es `minHeight: 42` (suelo), no un `height` fijo.
    const v = CodexColHeader({ kicker: "ÍNDICE", title: "OPDs" }) as unknown as Vnode;
    const s = v.props.style;
    expect(s.display).toBe("grid");
    expect(s.gridTemplateRows).toBe("auto auto");
    expect(s.minHeight).toBe(42);
    expect(s.height).toBeUndefined();
    expect(s.padding).toBe("8px 12px");
    expect(s.rowGap).toBe("2px");
    expect(s.overflow).toBeUndefined();
  });

  test("title usa lineHeight tight para no inflar la altura de la fila", () => {
    const v = CodexColHeader({ kicker: "ÍNDICE", title: "OPDs" }) as unknown as Vnode;
    const [, title] = hijos(v);
    expect(title!.props.style.fontSize).toBe(`${tokens.typography.fs.fs13}px`);
    expect(title!.props.style.lineHeight).toBe(tokens.typography.lh.tight);
    expect(title!.props.style.fontWeight).toBe(tokens.typography.weights.bold);
    expect(title!.props.style.overflow).toBe("hidden");
    expect(title!.props.style.textOverflow).toBe("ellipsis");
    expect(title!.props.style.whiteSpace).toBe("nowrap");
  });

  test("kicker es mono uppercase con tracking ancho (etiqueta editorial)", () => {
    const v = CodexColHeader({ kicker: "MARGINALIA", title: "OPL" }) as unknown as Vnode;
    const [kicker] = hijos(v);
    expect(kicker!.props.style.fontFamily).toBe(tokens.typography.mono);
    expect(kicker!.props.style.fontSize).toBe(`${tokens.typography.fs.fs9}px`);
    expect(kicker!.props.style.textTransform).toBe("uppercase");
    expect(kicker!.props.style.letterSpacing).toBe(tokens.typography.ls.mark);
  });
});
