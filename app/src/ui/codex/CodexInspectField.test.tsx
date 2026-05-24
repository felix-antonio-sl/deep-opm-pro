// Ronda Codex v1 · L2 — estructura de CodexInspectField.
//
// Sin DOM-render library en el stack de unit tests (ver oplTipografia.test.tsx):
// se invoca el componente como funcion y se inspecciona el arbol de vnodes
// (clave + valor + slot link). El render en DOM lo cubren los smokes de
// inspector (e2e/15, e2e/20).
import { describe, expect, test } from "bun:test";
import { tokens } from "../tokens";
import { GLIFO_VACIO } from "./glifos";
import { CodexInspectField } from "./CodexInspectField";

type Vnode = { type: unknown; props: Record<string, any> };

function hijos(v: Vnode): Vnode[] {
  const c = v.props.children;
  return (Array.isArray(c) ? c : [c]).filter((x): x is Vnode => !!x && typeof x === "object");
}

describe("CodexInspectField · estructura L2", () => {
  test("clave italic serif a la izquierda", () => {
    const v = CodexInspectField({ k: "tipo", v: "texto" }) as unknown as Vnode;
    const [key, value] = hijos(v);
    expect(key!.props.children).toBe("tipo");
    expect(key!.props.style.fontStyle).toBe("italic");
    expect(key!.props.style.fontFamily).toBe(tokens.typography.serif);
    expect(value!.props.children).toBe("texto");
  });

  test("valor mono adopta familia monoespaciada", () => {
    const v = CodexInspectField({ k: "id", v: "o.01", mono: true }) as unknown as Vnode;
    const [, value] = hijos(v);
    expect(value!.props.style.fontFamily).toBe(tokens.typography.mono);
  });

  test("valor vacio (—) se atenua a inkSoft", () => {
    const v = CodexInspectField({ k: "unidad", v: GLIFO_VACIO }) as unknown as Vnode;
    const [, value] = hijos(v);
    expect(value!.props.style.color).toBe(tokens.colors.inkSoft);
  });

  test("valor presente usa tinta ink (no atenuado)", () => {
    const v = CodexInspectField({ k: "unidad", v: "kg" }) as unknown as Vnode;
    const [, value] = hijos(v);
    expect(value!.props.style.color).toBe(tokens.colors.ink);
  });

  test("link opcional se renderiza como boton palabra-accion", () => {
    let clicked = false;
    const v = CodexInspectField({ k: "imagen", v: "sin adjuntar", link: "+ agregar", onLink: () => { clicked = true; } }) as unknown as Vnode;
    const nodos = hijos(v);
    const link = nodos[2]!;
    expect(link.type).toBe("button");
    expect(link.props.children).toBe("+ agregar");
    link.props.onClick();
    expect(clicked).toBe(true);
  });

  test("sin link: solo clave y valor", () => {
    const v = CodexInspectField({ k: "tipo", v: "texto" }) as unknown as Vnode;
    expect(hijos(v)).toHaveLength(2);
  });

  test("padding vertical compacto 4px 0 (chrome editorial sin caja)", () => {
    const v = CodexInspectField({ k: "tipo", v: "texto" }) as unknown as Vnode;
    expect(v.props.style.padding).toBe("4px 0");
  });

  test("testId se propaga al contenedor", () => {
    const v = CodexInspectField({ k: "tipo", v: "texto", testId: "campo-tipo" }) as unknown as Vnode;
    expect(v.props["data-testid"]).toBe("campo-tipo");
  });
});
