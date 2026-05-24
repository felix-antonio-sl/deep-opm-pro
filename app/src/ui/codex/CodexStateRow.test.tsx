// Ronda Codex v1 · L2 — estructura de CodexStateRow.
//
// Sin DOM-render library en el stack de unit tests (ver oplTipografia.test.tsx):
// se invoca el componente como funcion y se inspecciona el arbol de vnodes
// (badge oliva + nombre/slot + flags como palabras). El render en DOM lo cubre
// el smoke e2e/15-estado-ciudadano.
import { describe, expect, test } from "bun:test";
import { tokens } from "../tokens";
import { CodexStateRow, type CodexStateFlag } from "./CodexStateRow";

type Vnode = { type: unknown; props: Record<string, any> };

function hijos(v: Vnode): Vnode[] {
  const c = v.props.children;
  return (Array.isArray(c) ? c : [c]).filter((x): x is Vnode => !!x && typeof x === "object");
}

const flag = (over: Partial<CodexStateFlag> = {}): CodexStateFlag => ({ label: "inicial", active: false, ...over });

describe("CodexStateRow · estructura L2", () => {
  test("badge 8×8 en oliva canon (border state + fill stateFill), nunca crimson", () => {
    const v = CodexStateRow({ name: "pendiente", flags: [] }) as unknown as Vnode;
    const header = hijos(v)[0]!;
    const badge = hijos(header)[0]!;
    expect(badge.props.style.width).toBe("8px");
    expect(badge.props.style.height).toBe("8px");
    expect(badge.props.style.border).toBe(`${tokens.stroke.hairline}px solid ${tokens.colors.opm.state}`);
    expect(badge.props.style.background).toBe(tokens.colors.opm.stateFill);
    expect(badge.props.style.border).not.toContain(tokens.colors.crimson);
  });

  test("nombre en italic serif", () => {
    const v = CodexStateRow({ name: "pendiente", flags: [] }) as unknown as Vnode;
    const header = hijos(v)[0]!;
    const nombre = hijos(header)[1]!;
    expect(nombre.props.children).toBe("pendiente");
    expect(nombre.props.style.fontStyle).toBe("italic");
    expect(nombre.props.style.fontFamily).toBe(tokens.typography.serif);
  });

  test("flag activo: bold + underline ink", () => {
    const v = CodexStateRow({ name: "p", flags: [flag({ label: "inicial", active: true })] }) as unknown as Vnode;
    const flagsRow = hijos(v)[1]!;
    const boton = hijos(flagsRow)[0]!;
    expect(boton.props.children).toBe("inicial");
    expect(boton.props.style.fontWeight).toBe(tokens.typography.weights.semibold);
    expect(boton.props.style.borderBottom).toBe(`${tokens.stroke.hairline}px solid ${tokens.colors.ink}`);
    expect(boton.props["aria-pressed"]).toBe(true);
  });

  test("flag inactivo: inkSoft, sin underline", () => {
    const v = CodexStateRow({ name: "p", flags: [flag({ label: "final", active: false })] }) as unknown as Vnode;
    const flagsRow = hijos(v)[1]!;
    const boton = hijos(flagsRow)[0]!;
    expect(boton.props.style.color).toBe(tokens.colors.inkSoft);
  });

  test("flag suprimir SIEMPRE en crimson (canal UI, V-203)", () => {
    const v = CodexStateRow({ name: "p", flags: [flag({ label: "suprimir", danger: true })] }) as unknown as Vnode;
    const flagsRow = hijos(v)[1]!;
    const boton = hijos(flagsRow)[0]!;
    expect(boton.props.style.color).toBe(tokens.colors.crimson);
  });

  test("flag toggle dispara onToggle", () => {
    let toggled = false;
    const v = CodexStateRow({ name: "p", flags: [flag({ onToggle: () => { toggled = true; } })] }) as unknown as Vnode;
    const flagsRow = hijos(v)[1]!;
    const boton = hijos(flagsRow)[0]!;
    boton.props.onClick();
    expect(toggled).toBe(true);
  });

  test("flag disabled: not-allowed y disabled propagado", () => {
    const v = CodexStateRow({ name: "p", flags: [flag({ disabled: true })] }) as unknown as Vnode;
    const flagsRow = hijos(v)[1]!;
    const boton = hijos(flagsRow)[0]!;
    expect(boton.props.disabled).toBe(true);
    expect(boton.props.style.cursor).toBe("not-allowed");
  });

  test("reorden: flechas ↑↓ con testIds inmutables y disabled segun puede", () => {
    const v = CodexStateRow({ name: "p", flags: [], onSubir: () => {}, onBajar: () => {}, puedeSubir: false, puedeBajar: true }) as unknown as Vnode;
    const header = hijos(v)[0]!;
    const reorden = hijos(header).find((n) => Array.isArray(n.props.children))!;
    const [subir, bajar] = hijos(reorden);
    expect(subir!.props["data-testid"]).toBe("inspector-estado-subir");
    expect(subir!.props.disabled).toBe(true);
    expect(bajar!.props["data-testid"]).toBe("inspector-estado-bajar");
    expect(bajar!.props.disabled).toBe(false);
  });

  test("nameSlot reemplaza al texto name", () => {
    const slot = { type: "input", props: {} };
    const v = CodexStateRow({ name: "ignorado", nameSlot: slot as any, flags: [] }) as unknown as Vnode;
    const header = hijos(v)[0]!;
    const nodoNombre = hijos(header)[1]!;
    expect(nodoNombre.props.children).toBe(slot);
  });
});
