// Ronda Codex v1 · L1 — contrato tipografico OPL.
//
// Este repo no tiene DOM-render library en el stack de unit tests (ver
// avisoNoEditables.test.ts). Los helpers son componentes Preact; invocarlos como
// funcion devuelve el vnode que producen, cuyo `.type` y `.props.style` se
// inspeccionan directamente. El render en DOM lo cubre el smoke 03-opl-panel.
import { describe, expect, test } from "bun:test";
import { tokens } from "../tokens";
import { OplObj, OplProc, OplState } from "./oplTipografia";

type Vnode = { type: string; props: { style: preact.JSX.CSSProperties; "data-opl-tipo": string; children: unknown } };

describe("oplTipografia · contrato L1", () => {
  test("OplObj: serif bold subrayado solido en tinta (objeto)", () => {
    const v = OplObj({ children: "System Name" }) as unknown as Vnode;
    expect(v.type).toBe("b");
    expect(v.props["data-opl-tipo"]).toBe("objeto");
    expect(v.props.children).toBe("System Name");
    expect(v.props.style.fontWeight).toBe(tokens.typography.weights.bold);
    expect(v.props.style.fontStyle).toBe("normal");
    expect(v.props.style.color).toBe(tokens.colors.ink);
    expect(v.props.style.borderBottom).toBe(`${tokens.stroke.hairline}px solid ${tokens.colors.ink}`);
  });

  test("OplProc: serif bold italic subrayado punteado (proceso)", () => {
    const v = OplProc({ children: "Main System Doing" }) as unknown as Vnode;
    expect(v.type).toBe("span");
    expect(v.props["data-opl-tipo"]).toBe("proceso");
    expect(v.props.style.fontWeight).toBe(tokens.typography.weights.bold);
    expect(v.props.style.fontStyle).toBe("italic");
    expect(v.props.style.borderBottom).toBe(`${tokens.stroke.hairline}px dashed ${tokens.colors.ink}`);
  });

  test("OplState: mono oliva canon sobre fill suave, nunca crimson (V-203)", () => {
    const v = OplState({ children: "problematic" }) as unknown as Vnode;
    expect(v.type).toBe("span");
    expect(v.props["data-opl-tipo"]).toBe("estado");
    expect(v.props.style.fontFamily).toBe(tokens.typography.mono);
    expect(v.props.style.color).toBe(tokens.colors.opm.state);
    expect(v.props.style.background).toBe(tokens.colors.opm.stateFill);
    // Decision blocked brief §9: estado en oliva canon, jamas crimson.
    expect(v.props.style.color).not.toBe(tokens.colors.crimson);
  });
});
